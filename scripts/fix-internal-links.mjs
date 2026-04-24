#!/usr/bin/env node
/**
 * fix-internal-links.mjs
 *
 * Fixes internal markdown links in migrated docs:
 *   1. Converts old numbered-prefix paths (02_Controls/igGrid/09_igGrid_Known_Issues.mdx)
 *      to their new slugified equivalents (controls/iggrid/known-issues)
 *   2. Removes .mdx / .md extensions from link targets (Starlight uses slug routing)
 *   3. Resolves targets against the actual file tree and reports unresolvable links
 *
 * Reuses the same rename logic from rename-jquery-topics.mjs so results are consistent.
 *
 * Usage:
 *   node scripts/fix-internal-links.mjs                                  # dry-run (jQuery default)
 *   node scripts/fix-internal-links.mjs --apply                          # apply changes
 *   node scripts/fix-internal-links.mjs --topics=docs/other/src/content/en/topics   # other library
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slug as githubSlug } from 'github-slugger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const TOPICS    = topicsArg
  ? path.resolve(ROOT, topicsArg.slice('--topics='.length))
  : path.join(ROOT, 'docs/jquery/src/content/en/topics');

const APPLY = process.argv.includes('--apply');

console.log(`\n=== fix-internal-links [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===`);
console.log(`  topics: ${TOPICS}\n`);

// ─── Naming helpers (same as rename-jquery-topics.mjs) ────────────────────────

function isChangelogDir(dirName) {
  const n = dirName.toLowerCase();
  return (
    n.includes('revision') || n.includes('changelog') ||
    n.includes('breaking') || n.includes("what's-new") ||
    n.includes('whats-new') || n.includes("what's_new") ||
    n.includes('whats_new')
  );
}

function cleanFolderName(name) {
  let s = name;
  s = s.replace(/^\d+[_-]/, '');
  s = s.replace(/[_ ]+/g, '-');
  s = s.toLowerCase();
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  s = githubSlug(s);
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  return s;
}

function cleanFileStem(stem, parentFolder) {
  let s = stem;
  s = s.replace(/^~/, '');
  if (isChangelogDir(parentFolder)) {
    s = s.replace(/^(\d+)[_-]/, '$1-');
  } else {
    s = s.replace(/^\d+[_-]/, '');
  }
  s = s.replace(/[_ ]+/g, '-');
  s = s.toLowerCase();
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  if (isChangelogDir(parentFolder)) {
    const m = s.match(/^(\d+-)(.*)/);
    s = m ? m[1] + githubSlug(m[2]) : githubSlug(s);
  } else {
    s = githubSlug(s);
  }
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  return s;
}

function prefixVariants(rawFolderName) {
  const cleaned = cleanFolderName(rawFolderName);
  const slugged = githubSlug(rawFolderName);
  const s = new Set([
    cleaned, cleaned.replace(/-/g, ''),
    slugged, slugged.replace(/-/g, ''),
  ]);
  return [...s].filter(v => v.length >= 3);
}

function stripRedundantPrefix(cleanedStem, rawAncestorFolders) {
  const folders = Array.isArray(rawAncestorFolders) ? rawAncestorFolders : [rawAncestorFolders];
  for (const rawFolder of folders) {
    for (const prefix of prefixVariants(rawFolder)) {
      if (cleanedStem.startsWith(prefix + '-') && cleanedStem.length > prefix.length + 1) {
        return cleanedStem.slice(prefix.length + 1);
      }
    }
  }
  return null;
}

/**
 * Transform an old-style relative path to its new slugified form.
 * Handles both folder segments and the final file segment.
 * Removes .mdx/.md extension from the result (slug routing).
 */
function transformHref(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const transformed = parts.map((part, i) => {
    const isLast = i === parts.length - 1;
    if (!isLast) {
      if (part === '.' || part === '..') return part;
      return cleanFolderName(part);
    }
    // Last segment — may be a file with extension
    const dotIdx = part.lastIndexOf('.');
    if (dotIdx <= 0) {
      return cleanFolderName(part);
    }
    const ext  = part.slice(dotIdx);
    const stem = part.slice(0, dotIdx);
    const parentName = i > 0 ? parts[i - 1] : '';
    const cleanedStem = cleanFileStem(stem, parentName);
    const ancestors = parts.slice(0, i).filter(p => p !== '.' && p !== '..').reverse();
    const stripped = stripRedundantPrefix(cleanedStem, ancestors);
    // For .mdx/.md links, drop the extension (slug routing)
    if (ext === '.mdx' || ext === '.md') {
      return stripped ?? cleanedStem;
    }
    return (stripped ?? cleanedStem) + ext;
  });
  return transformed.join('/');
}

// ─── File walker ──────────────────────────────────────────────────────────────

function walkMdx(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMdx(full));
    else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) results.push(full);
  }
  return results;
}

// ─── Build set of all existing slugs and a reverse-lookup map ─────────────────

function buildSlugSet() {
  const slugs = new Set();
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        const rel = path.relative(TOPICS, full).replace(/\\/g, '/');
        const slug = rel.replace(/\.(mdx|md)$/, '');
        slugs.add(slug.toLowerCase());
      }
    }
  }
  walk(TOPICS);
  return slugs;
}

/**
 * Build a reverse map from old-style fileName slugs to current file paths.
 * For each file, generate all plausible old-style names by combining ancestor
 * folder names with the file stem.
 * E.g. controls/igdatachart/adding.mdx → igdatachart-adding
 */
function buildReverseMap() {
  const map = new Map(); // oldName → currentSlug

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        const rel = path.relative(TOPICS, full).replace(/\\/g, '/').replace(/\.(mdx|md)$/, '');
        const parts = rel.split('/');
        const stem = parts[parts.length - 1];

        // Generate old-style names by combining ancestor folder with stem
        for (let i = parts.length - 2; i >= 0; i--) {
          const prefix = parts[i];
          // prefix-stem (e.g. igdatachart-adding)
          const key1 = prefix + '-' + stem;
          if (!map.has(key1)) map.set(key1, rel);
          // stem-prefix (e.g. adding-igdatachart)
          const key2 = stem + '-' + prefix;
          if (!map.has(key2)) map.set(key2, rel);
        }

        // Also map the full stem as-is
        if (!map.has(stem)) map.set(stem, rel);
        // For changelog files with number prefix (e.g. 00-breaking-changes-...), also add without number
        const noNum = stem.replace(/^\d+-/, '');
        if (noNum !== stem && !map.has(noNum)) map.set(noNum, rel);
        // And the full relative path as a key
        if (!map.has(rel)) map.set(rel, rel);
      }
    }
  }
  walk(TOPICS);
  return map;
}

/**
 * Given a bare name (e.g. "igdatachart-adding"), find the best matching slug.
 * Prefers paths where the control name appears as a folder in the path.
 */
function resolveBareName(name, reverseMap, existingSlugs) {
  // 1. Direct hit in reverse map
  const direct = reverseMap.get(name);
  if (direct && existingSlugs.has(direct.toLowerCase())) return direct;

  // 1b. If name has /, try the last segment as a bare name
  if (name.includes('/')) {
    const lastSeg = name.split('/').pop();
    const fromLast = resolveBareName(lastSeg, reverseMap, existingSlugs);
    if (fromLast) return fromLast;
  }

  // 2. Try to decompose: if name is "controlname-rest", look for "rest" in a
  //    folder that contains "controlname"
  const parts = name.split('-');
  for (let splitAt = 1; splitAt < parts.length; splitAt++) {
    const prefix = parts.slice(0, splitAt).join('-');
    const suffix = parts.slice(splitAt).join('-');

    // Look for suffix.mdx inside a folder matching prefix
    for (const slug of existingSlugs) {
      const slugParts = slug.split('/');
      const slugStem = slugParts[slugParts.length - 1];
      if (slugStem === suffix && slug.includes(prefix)) {
        return slug;
      }
    }
  }

  // 3. Try suffix-prefix order too
  for (let splitAt = 1; splitAt < parts.length; splitAt++) {
    const suffix = parts.slice(0, splitAt).join('-');
    const prefix = parts.slice(splitAt).join('-');

    for (const slug of existingSlugs) {
      const slugParts = slug.split('/');
      const slugStem = slugParts[slugParts.length - 1];
      if (slugStem === suffix && slug.includes(prefix)) {
        return slug;
      }
    }
  }

  // 4. Deep decomposition: check if the name can be formed by joining
  //    path folder names + stem with '-'. For each slug, see if
  //    concatenating some ancestor folders + stem produces the name.
  for (const slug of existingSlugs) {
    const slugParts = slug.split('/');
    const slugStem = slugParts[slugParts.length - 1];
    // The name must end with the stem
    if (!name.endsWith(slugStem)) continue;
    // Check if the prefix (before stem) is composed of folder names from the path
    const prefixStr = name.slice(0, name.length - slugStem.length).replace(/-$/, '');
    if (!prefixStr) continue; // Already handled by direct lookup
    const prefixParts = prefixStr.split('-');
    // Every prefix part must appear as a folder in the slug path
    const folders = slugParts.slice(0, -1);
    const allMatch = prefixParts.every(pp => folders.some(f => f === pp || f.includes(pp) || f.replace(/-/g, '') === pp || pp.replace(/-/g, '') === f.replace(/-/g, '')));
    if (allMatch) return slug;
  }

  return null;
}

// ─── Link regex ───────────────────────────────────────────────────────────────

// Matches markdown links: [text](target) or [text](target#anchor)
// Captures: (1) opening "[text](", (2) path, (3) optional #fragment)
const LINK_RE = /(\[[^\]]*\]\()([^)#?\s]+?)((?:#[^)]*)?)\)/g;

// ─── Main ─────────────────────────────────────────────────────────────────────

const existingSlugs = buildSlugSet();
const reverseMap    = buildReverseMap();
const files = walkMdx(TOPICS);

let totalFixed     = 0;
let totalStripped  = 0;  // .mdx extension removed
let totalResolved  = 0;  // bare/absolute names resolved to full paths
let totalUnresolved = 0;
let filesChanged   = 0;
const unresolved = new Map();

for (const file of files) {
  const original = fs.readFileSync(file, 'utf-8');
  const fileDir  = path.dirname(file);
  let changed = false;

  const result = original.replace(LINK_RE, (match, open, href, fragment) => {
    // Skip external URLs (but not // which is a broken internal link prefix)
    if (/^https?:\/\//i.test(href)) return match;
    // Fix broken multiple-slash prefix (// or ///) → single /
    if (/^\/\/+/.test(href) && !href.startsWith('//www.') && !href.startsWith('//cdn.')) {
      href = '/' + href.replace(/^\/+/, '');
    }
    // Skip image refs
    if (/\.(png|jpg|gif|svg|jpeg|webp)$/i.test(href)) return match;
    // Skip {environment:...} refs
    if (href.includes('{environment:') || href.includes('&#123;environment:')) return match;
    // Skip .html links (external API refs)
    if (/\.html$/i.test(href)) return match;

    const originalHref = href;
    let newHref = href;

    // Check if href has old numbered-prefix segments (e.g. 02_Controls, 04_Data-Sources)
    const hasOldPrefixes = /(?:^|\/)\d{2}_/.test(href) || /(?:^|\/)\d{2}-/.test(href);
    // Check if href has .mdx/.md extension
    const hasMdxExt = /\.(mdx|md)$/.test(href);
    // Check if href is absolute (starts with /)
    const isAbsolute = href.startsWith('/');
    // Check if href is a bare name (no ../ prefix, no /)
    const isBare = !href.startsWith('.') && !href.startsWith('/') && !href.includes('/');
    // Check if href is a relative ./name or ./path/name without numbered prefixes
    const isDotRelative = href.startsWith('./') && !hasOldPrefixes;

    if (!hasOldPrefixes && !hasMdxExt && !isAbsolute && !isBare && !isDotRelative) return match;

    // Decode URL-encoded characters for path processing
    let decoded = href;
    try { decoded = decodeURIComponent(href); } catch {}

    if (hasOldPrefixes) {
      // Transform old numbered-prefix path to new slugified path
      const upMatch = decoded.match(/^((?:\.\.\/)*\.?\/?)(.*)/);
      const upPrefix = upMatch[1];
      const topicPath = upMatch[2];

      if (topicPath) {
        const transformed = transformHref(topicPath);
        newHref = upPrefix + transformed;
        totalFixed++;

        // After transforming, try to resolve via reverse map if it's a simple name
        // (e.g. ./iggrid-columnmoving-propertyreference → /controls/iggrid/.../columnmoving-propertyreference)
        const bareName = transformed.replace(/^\.\//, '');
        if (!bareName.includes('/') || bareName.split('/').length <= 2) {
          const resolved = resolveBareName(bareName, reverseMap, existingSlugs);
          if (resolved) {
            newHref = '/' + resolved;
            totalResolved++;
          }
        } else {
          // Multi-segment path — check if it resolves as-is relative to TOPICS
          const candidate = transformed.replace(/^\.\//, '');
          if (existingSlugs.has(candidate.toLowerCase())) {
            newHref = '/' + candidate;
            totalResolved++;
          } else {
            // Try the last segment as a bare name
            const lastSeg = candidate.split('/').pop();
            const resolved = resolveBareName(lastSeg, reverseMap, existingSlugs);
            if (resolved) {
              newHref = '/' + resolved;
              totalResolved++;
            }
          }
        }
      }
    } else if (isAbsolute) {
      // Absolute path like /igdatachart-adding or /igdatachart-adding.mdx
      let bareName = decoded.replace(/^\//, '').replace(/\.(mdx|md)$/, '');
      const resolved = resolveBareName(bareName, reverseMap, existingSlugs);
      if (resolved) {
        newHref = '/' + resolved;
        totalResolved++;
      } else {
        // Still strip .mdx extension
        newHref = decoded.replace(/\.(mdx|md)$/, '');
      }
    } else if (isBare) {
      // Bare name like iglineargauge-overview or iglineargauge-overview.mdx
      let bareName = decoded.replace(/\.(mdx|md)$/, '');
      const resolved = resolveBareName(bareName, reverseMap, existingSlugs);
      if (resolved) {
        // Convert to absolute path
        newHref = '/' + resolved;
        totalResolved++;
      } else {
        newHref = decoded.replace(/\.(mdx|md)$/, '');
      }
    } else if (isDotRelative) {
      // ./name or ./path/name — try to resolve via reverse map
      let bareName = decoded.replace(/^\.\//, '').replace(/\.(mdx|md)$/, '');
      // If it contains /, try each segment through reverse map
      const resolved = resolveBareName(bareName, reverseMap, existingSlugs);
      if (resolved) {
        newHref = '/' + resolved;
        totalResolved++;
      } else {
        // Try resolving relative to current file directory
        const resolvedAbs = path.resolve(fileDir, decoded.replace(/\.(mdx|md)$/, ''));
        const resolvedRel = path.relative(TOPICS, resolvedAbs).replace(/\\/g, '/').toLowerCase();
        if (existingSlugs.has(resolvedRel)) {
          newHref = '/' + resolvedRel;
          totalResolved++;
        } else {
          newHref = decoded.replace(/\.(mdx|md)$/, '');
        }
      }
    } else if (hasMdxExt) {
      // Relative path with .mdx extension — just strip extension
      newHref = decoded.replace(/\.(mdx|md)$/, '');
    }

    if (newHref === originalHref) return match;

    // Strip .mdx extension if still present
    if (/\.(mdx|md)$/.test(newHref)) {
      newHref = newHref.replace(/\.(mdx|md)$/, '');
      totalStripped++;
    } else if (hasMdxExt) {
      totalStripped++;
    }

    // Verify the target exists
    let resolvedRel;
    if (newHref.startsWith('/')) {
      resolvedRel = newHref.slice(1).toLowerCase();
    } else {
      const resolvedAbs = path.resolve(fileDir, newHref);
      resolvedRel = path.relative(TOPICS, resolvedAbs).replace(/\\/g, '/').toLowerCase();
    }

    if (!existingSlugs.has(resolvedRel)) {
      totalUnresolved++;
      const key = newHref.replace(/^(\.\.\/)+/, '').replace(/^\//, '');

      unresolved.set(key, (unresolved.get(key) || 0) + 1);
    }

    changed = true;
    return open + newHref + (fragment || '') + ')';
  });

  if (changed) {
    filesChanged++;
    const rel = path.relative(TOPICS, file).replace(/\\/g, '/');
    if (APPLY) {
      fs.writeFileSync(file, result, 'utf-8');
      console.log(`  ✓ ${rel}`);
    } else {
      console.log(`  [dry-run] ${rel}`);
    }
  }
}

console.log(`\nResults:`);
console.log(`  Files changed     : ${filesChanged}`);
console.log(`  Old paths fixed   : ${totalFixed}`);
console.log(`  .mdx ext stripped : ${totalStripped}`);
console.log(`  Bare/abs resolved : ${totalResolved}`);
console.log(`  Unresolved targets: ${totalUnresolved}`);

if (unresolved.size > 0) {
  console.log(`\nUnresolved targets (top 30):`);
  const sorted = [...unresolved.entries()].sort((a, b) => b[1] - a[1]);
  for (const [target, count] of sorted.slice(0, 30)) {
    console.log(`  ${count}x ${target}`);
  }
  if (sorted.length > 30) console.log(`  ... and ${sorted.length - 30} more`);
}

console.log('\nDone.\n');

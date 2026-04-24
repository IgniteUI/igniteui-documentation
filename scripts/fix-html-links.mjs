#!/usr/bin/env node
/**
 * fix-html-links.mjs
 *
 * Converts legacy DocFX .html cross-references in MDX files to .mdx references.
 * Builds a map of fileName → actual .mdx file path from <!--\n|metadata|\n{...}\n|metadata|\n-->
 * blocks, then rewrites (SomeName.html) → (actual-path.mdx) in markdown links.
 *
 * Must be run BEFORE rename-jquery-topics.mjs (paths still have NN_ prefixes).
 *
 * Usage:
 *   node scripts/fix-html-links.mjs                # dry-run
 *   node scripts/fix-html-links.mjs --apply        # apply changes
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const TOPICS_DIR = topicsArg
  ? path.resolve(ROOT, topicsArg.slice('--topics='.length))
  : path.join(ROOT, 'docs/jquery/src/content/en/topics');
const APPLY = process.argv.includes('--apply');

// ─── Walk .mdx files ────────────────────────────────────────────────────────
function walkMdx(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMdx(full));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

// ─── Build fileName → relativePath map from metadata blocks ──────────────────
const METADATA_RE = /<!--\s*\|metadata\|([\s\S]*?)\|metadata\|\s*-->/;

function buildFileNameMap() {
  const map = new Map(); // lowercased fileName → relative path from TOPICS_DIR
  const files = walkMdx(TOPICS_DIR);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const m = content.match(METADATA_RE);
    if (!m) continue;

    try {
      const json = JSON.parse(m[1].trim());
      if (json.fileName) {
        const rel = path.relative(TOPICS_DIR, file).replace(/\\/g, '/');
        map.set(json.fileName.toLowerCase(), rel);
      }
    } catch {
      // ignore parse errors
    }
  }

  return map;
}

// ─── Link patterns ───────────────────────────────────────────────────────────
// Match markdown links with .html targets: [text](Something.html) or [text](Something.html#anchor)
const HTML_LINK_RE = /(\[(?:[^\]]*)\]\()([^)#?\s]+)\.html((?:#[^)]*)?)\)/gi;

// ─── Main ────────────────────────────────────────────────────────────────────
console.log(`\n=== fix-html-links [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===\n`);

console.log('Building fileName map from metadata blocks...');
const fileNameMap = buildFileNameMap();
console.log(`  Found ${fileNameMap.size} fileName entries.\n`);

const files = walkMdx(TOPICS_DIR);
let totalLinks    = 0;
let totalResolved = 0;
let totalMissing  = 0;
let filesChanged  = 0;
const missing = new Map(); // unresolved fileName → count

for (const file of files) {
  const original = fs.readFileSync(file, 'utf-8');
  const fileDir  = path.dirname(file);
  let changed = false;

  const converted = original.replace(HTML_LINK_RE, (match, open, stem, fragment) => {
    // Skip external URLs (http://, https://, //)
    if (/^https?:\/\//i.test(stem) || stem.startsWith('//')) return match;
    // Skip API reference links (Infragistics.Web.Mvc~..., contain ~)
    if (stem.includes('~') || stem.includes('Infragistics.')) return match;
    // Skip %%token%% or {environment:...} prefixed links
    if (stem.startsWith('%%') || stem.startsWith('{environment:')) return match;

    // Try direct lookup, then URL-decoded lookup.
    const key = stem.toLowerCase();
    const decodedKey = decodeURIComponent(key);
    const target = fileNameMap.get(key) || fileNameMap.get(decodedKey);

    if (target) {
      // Compute relative path from current file to target.
      const targetAbs = path.join(TOPICS_DIR, target);
      let rel = path.relative(fileDir, targetAbs).replace(/\\/g, '/');
      if (!rel.startsWith('.')) rel = './' + rel;
      totalResolved++;
      changed = true;
      return open + rel + (fragment || '') + ')';
    }

    // Unresolved — leave as .html (will be a broken link but detectable).
    totalMissing++;
    missing.set(stem, (missing.get(stem) || 0) + 1);
    return match;
  });

  if (changed) {
    totalLinks += (original.match(HTML_LINK_RE) || []).length;
    filesChanged++;
    const rel = path.relative(TOPICS_DIR, file);
    if (APPLY) {
      fs.writeFileSync(file, converted, 'utf-8');
      console.log(`  ✓ ${rel}`);
    } else {
      console.log(`  [dry-run] ${rel}`);
    }
  }
}

console.log(`\nResolved: ${totalResolved} links in ${filesChanged} files`);
console.log(`Unresolved: ${totalMissing} links`);

if (missing.size > 0) {
  console.log('\nUnresolved fileNames (may be external/API links):');
  const sorted = [...missing.entries()].sort((a, b) => b[1] - a[1]);
  for (const [name, count] of sorted.slice(0, 30)) {
    console.log(`  ${count}x ${name}`);
  }
  if (sorted.length > 30) console.log(`  ... and ${sorted.length - 30} more`);
}

console.log('\nDone.\n');

/**
 * sort-jquery-toc.mjs
 *
 * Reorders docs/jquery/toc.json to match the canonical order defined by the
 * original NN_-prefixed source structure recorded in scripts/jquery-toc-ref.json.
 *
 * Usage:
 *   node scripts/sort-jquery-toc.mjs
 *
 * How it works:
 *   1. Reads jquery-toc-ref.json (original toc with NN_-prefixed hrefs)
 *   2. Transforms every href using the same rename rules as rename-jquery-topics.mjs
 *      → produces the final clean hrefs (e.g. controls/igbulletgraph/overview.mdx)
 *   3. Builds a position map:  cleanHref → orderIndex
 *   4. Reads the current toc.json and sorts each level according to that map
 *      (items not found in the map keep their current relative order at the end)
 *   5. Writes the sorted toc.json back to disk
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { slug as githubSlug } from 'github-slugger';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOC_FILE     = join(__dirname, '..', 'docs', 'jquery', 'toc.json');
const REF_FILE     = join(__dirname, 'jquery-toc-ref.json');

// ─── transformHref (mirrors rename-jquery-topics.mjs) ────────────────────────

function isChangelogDir(name) {
  const n = name.toLowerCase();
  return n.includes('revision') || n.includes('changelog') || n.includes('breaking') ||
         n.includes("what's-new") || n.includes('whats-new') ||
         n.includes("what's_new") || n.includes('whats_new');
}

function cleanFolderName(name) {
  let s = name.replace(/^\d+[_-]/, '').replace(/[_ ]+/g, '-').toLowerCase();
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  s = githubSlug(s);
  return s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
}

function cleanFileStem(stem, parentFolder) {
  let s = stem.replace(/^~/, '');
  if (isChangelogDir(parentFolder)) {
    s = s.replace(/^(\d+)[_-]/, '$1-');
  } else {
    s = s.replace(/^\d+[_-]/, '');
  }
  s = s.replace(/[_ ]+/g, '-').toLowerCase();
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  if (isChangelogDir(parentFolder)) {
    const m = s.match(/^(\d+-)(.*)$/);
    s = m ? m[1] + githubSlug(m[2]) : githubSlug(s);
  } else {
    s = githubSlug(s);
  }
  return s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
}

function prefixVariants(rawFolderName) {
  const cleaned = cleanFolderName(rawFolderName);
  const slugged = githubSlug(rawFolderName);
  const s = new Set([cleaned, cleaned.replace(/-/g, ''), slugged, slugged.replace(/-/g, '')]);
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

function transformHref(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  return parts.map((part, i) => {
    const isLast = i === parts.length - 1;
    if (!isLast) return cleanFolderName(part);
    const dotIdx = part.lastIndexOf('.');
    if (dotIdx <= 0) return cleanFolderName(part);
    const ext        = part.slice(dotIdx);
    const stem       = part.slice(0, dotIdx);
    const parentName = i > 0 ? parts[i - 1] : '';
    const cleaned    = cleanFileStem(stem, parentName);
    const ancestors  = parts.slice(0, i).reverse();
    return (stripRedundantPrefix(cleaned, ancestors) ?? cleaned) + ext;
  }).join('/');
}

// ─── Build order map from reference toc ──────────────────────────────────────

const orderMap = new Map(); // cleanHref → absolute order index

let counter = 0;

function indexRefNode(node) {
  if (node.href) {
    const clean = transformHref(node.href);
    if (!orderMap.has(clean)) {
      orderMap.set(clean, counter++);
    }
  }
  if (Array.isArray(node.items)) {
    for (const child of node.items) {
      indexRefNode(child);
    }
  }
}

const ref = JSON.parse(readFileSync(REF_FILE, 'utf8'));
for (const node of ref) {
  indexRefNode(node);
}

console.log(`Order map built: ${orderMap.size} entries from reference toc.`);

// ─── Sort toc.json ────────────────────────────────────────────────────────────

function sortKey(node) {
  // 1. Use embedded order field if present (set by gen-jquery-toc.mjs from NN_ prefix)
  if (typeof node.order === 'number') return node.order;
  // 2. Fall back to reference toc order map (for tocs generated before order field was added)
  const href = node.href;
  if (href && orderMap.has(href)) return orderMap.get(href);
  // 3. Group node without href: use first child's key as proxy
  if (node.items && node.items.length > 0) {
    for (const child of node.items) {
      const k = sortKey(child);
      if (k < Infinity) return k;
    }
  }
  return Infinity; // unknown items go to end
}

function sortNodes(nodes) {
  // Sort the array in-place by position in reference
  nodes.sort((a, b) => sortKey(a) - sortKey(b));
  // Recurse
  for (const node of nodes) {
    if (Array.isArray(node.items) && node.items.length > 0) {
      sortNodes(node.items);
    }
  }
}

const toc = JSON.parse(readFileSync(TOC_FILE, 'utf8'));
sortNodes(toc);

writeFileSync(TOC_FILE, JSON.stringify(toc, null, 2) + '\n', 'utf8');
console.log(`toc.json reordered and written to ${TOC_FILE}`);

#!/usr/bin/env node
/**
 * fix-broken-images-all.mjs
 *
 * Scans all MDX files for image references (markdown ![...](...) syntax).
 * For each reference, checks if the image actually exists at the resolved path.
 * If not, searches the entire topics tree for a file with the same basename
 * and rewrites the path. If no match is found, comments out the image.
 *
 * Usage:  node scripts/fix-broken-images-all.mjs [topicsDir]
 *   default topicsDir: docs/jquery/src/content/en/topics
 */
import fs from 'fs';
import path from 'path';

const TOPICS_ROOT = process.argv[2] || 'docs/jquery/src/content/en/topics';

// ── Build an index: basename → absolute path(s) ──────────────────────────────
const imageIndex = new Map(); // basename (case-insensitive key) → [absPaths]

function indexImages(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { indexImages(full); continue; }
    if (/\.(png|jpe?g|gif|svg|webp|bmp)$/i.test(entry.name)) {
      const key = entry.name.toLowerCase();
      if (!imageIndex.has(key)) imageIndex.set(key, []);
      imageIndex.get(key).push(full);
    }
  }
}
indexImages(TOPICS_ROOT);
console.log(`Indexed ${imageIndex.size} unique image basenames.`);

// ── Walk MDX files ───────────────────────────────────────────────────────────
function findMdx(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findMdx(full));
    else if (/\.mdx?$/.test(entry.name)) results.push(full);
  }
  return results;
}

const files = findMdx(TOPICS_ROOT);
let fixedFiles = 0;
let fixedRefs = 0;
let commentedOut = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const fileDir = path.dirname(file);
  let changed = false;

  // Match markdown images: ![alt](path) — path must end with image extension
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+\.(png|jpe?g|gif|svg|webp|bmp))\)/gi,
    (match, alt, imgPath, _ext) => {
      // Skip external URLs
      if (/^https?:\/\//i.test(imgPath)) return match;

      // Resolve the path relative to the file
      const resolved = path.resolve(fileDir, imgPath);

      // Case-insensitive check: the file might be .PNG but ref says .png
      if (fs.existsSync(resolved)) return match; // already OK

      // Try case-insensitive match in same directory
      const resolvedDir = path.dirname(resolved);
      const resolvedBase = path.basename(resolved);
      if (fs.existsSync(resolvedDir)) {
        const dirEntries = fs.readdirSync(resolvedDir);
        const caseMatch = dirEntries.find(e => e.toLowerCase() === resolvedBase.toLowerCase());
        if (caseMatch) {
          const correctPath = path.relative(fileDir, path.join(resolvedDir, caseMatch)).replace(/\\/g, '/');
          changed = true;
          fixedRefs++;
          return `![${alt}](${correctPath})`;
        }
      }

      // Search the index for this basename
      const key = resolvedBase.toLowerCase();
      const candidates = imageIndex.get(key);
      if (candidates && candidates.length > 0) {
        // Pick the closest candidate (fewest directory hops from this file)
        let best = candidates[0];
        let bestDist = Infinity;
        for (const c of candidates) {
          const rel = path.relative(fileDir, c);
          const hops = rel.split(/[\\/]/).filter(s => s === '..').length + rel.split(/[\\/]/).length;
          if (hops < bestDist) { bestDist = hops; best = c; }
        }
        const correctPath = path.relative(fileDir, best).replace(/\\/g, '/');
        changed = true;
        fixedRefs++;
        return `![${alt}](${correctPath})`;
      }

      // Image truly not found — comment it out so build doesn't fail
      changed = true;
      commentedOut++;
      return `{/* image not found: ${resolvedBase} */}`;
    }
  );

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    fixedFiles++;
  }
}

console.log(`Done. Fixed ${fixedRefs} image refs in ${fixedFiles} files. Commented out ${commentedOut} missing images.`);

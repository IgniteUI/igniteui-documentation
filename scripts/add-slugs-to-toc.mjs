#!/usr/bin/env node
/**
 * add-slugs-to-toc.mjs
 *
 * Reads toc.json and for each entry with an `href`, reads the source file
 * to extract the slug (from frontmatter `slug:` or DocFX metadata `"fileName"`).
 * Adds a `"slug"` field to each toc.json entry so that sidebar.ts and
 * integration.ts can resolve slugs without reading every source file.
 *
 * This script should run AFTER the migration pipeline (after rename, after
 * normalize-mdx has added frontmatter with slugs).
 *
 * Usage:
 *   node scripts/add-slugs-to-toc.mjs                                    # jQuery default
 *   node scripts/add-slugs-to-toc.mjs --topics=<path> --toc=<path>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const tocArg = process.argv.find(a => a.startsWith('--toc='));

const TOPICS = topicsArg
  ? path.resolve(topicsArg.slice('--topics='.length))
  : path.join(ROOT, 'docs/jquery/src/content/en/topics');

const TOC_PATH = tocArg
  ? path.resolve(tocArg.slice('--toc='.length))
  : path.join(ROOT, 'docs/jquery/toc.json');

function getSlugFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Strip BOM if present
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    // Check frontmatter slug
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
      const slugMatch = fmMatch[1].match(/^slug:\s*(.+)$/m);
      if (slugMatch) return slugMatch[1].trim();
    }
    // Check DocFX metadata fileName
    const fnMatch = content.match(/"fileName"\s*:\s*"([^"]+)"/);
    if (fnMatch) return fnMatch[1];
  } catch { /* file not readable */ }
  return null;
}

function resolveFile(href) {
  const full = path.join(TOPICS, href);
  if (fs.existsSync(full)) return full;
  // Try swapping .mdx/.md
  if (href.endsWith('.mdx')) {
    const alt = path.join(TOPICS, href.slice(0, -4) + '.md');
    if (fs.existsSync(alt)) return alt;
  } else if (href.endsWith('.md')) {
    const alt = path.join(TOPICS, href.slice(0, -3) + '.mdx');
    if (fs.existsSync(alt)) return alt;
  }
  return null;
}

function processItems(items) {
  let added = 0;
  for (const item of items) {
    if (item.href) {
      const file = resolveFile(item.href);
      if (file) {
        const slug = getSlugFromFile(file);
        if (slug) {
          item.slug = slug;
          added++;
        }
      }
    }
    if (item.items) {
      added += processItems(item.items);
    }
  }
  return added;
}

const toc = JSON.parse(fs.readFileSync(TOC_PATH, 'utf-8'));
const added = processItems(toc);
fs.writeFileSync(TOC_PATH, JSON.stringify(toc, null, 2) + '\n', 'utf-8');
console.log(`Added ${added} slugs to ${TOC_PATH}`);

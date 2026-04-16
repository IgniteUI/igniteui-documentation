#!/usr/bin/env node
/**
 * Add or update title attributes on Aside components in localized files.
 * 
 * Usage:
 *   node scripts/fix-aside-titles.mjs            # apply changes
 *   node scripts/fix-aside-titles.mjs --dry-run  # preview without writing
 */

import fs from 'node:fs';
import path from 'node:path';

// ── Configuration ──────────────────────────────────────────────────────────

const LOCALIZED_TITLES = {
  note: {
    jp: '注',   // Japanese: "Note"
    kr: '참고',  // Korean: "Note"
  },
  tip: {
    jp: 'ヒント',
    kr: '팁',
  },
  caution: {
    jp: '警告',  // Japanese: "Warning"
    kr: '경고',  // Korean: "Warning"
  },
  danger: {
    jp: '注意',  // Japanese: "Caution"
    kr: '주의',  // Korean: "Caution"
  },
};

const DOCS_ROOT = path.resolve(process.cwd(), 'docs');
const DRY_RUN = process.argv.includes('--dry-run');

// ── File collection ────────────────────────────────────────────────────────

function collectMdxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'generated') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMdxFiles(full));
    } else if (/\.mdx$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Detect language from file path.
 */
function detectLanguage(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/jp/')) return 'jp';
  if (normalized.includes('/kr/')) return 'kr';
  return null;  // Not a localized file
}

/**
 * Fix Aside component titles in localized files.
 */
function fixAsideTitles(text, lang) {
  if (!lang) return { output: text, count: 0 };
  
  let count = 0;
  
  // Match: <Aside type="note"> or <Aside type="caution" title="Warning">
  const output = text.replace(
    /<Aside\s+type="(note|tip|caution|danger)"(?:\s+title="[^"]*")?>/g,
    (match, type) => {
      const title = LOCALIZED_TITLES[type]?.[lang];
      if (!title) return match;  // No title defined for this type
      
      count++;
      return `<Aside type="${type}" title="${title}">`;
    }
  );
  
  return { output, count };
}

// ── Main ───────────────────────────────────────────────────────────────────

console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Scanning ${DOCS_ROOT} for .mdx files...\n`);

const files = collectMdxFiles(DOCS_ROOT);
let totalFixed = 0;
let filesModified = 0;

for (const filePath of files) {
  const lang = detectLanguage(filePath);
  if (!lang) continue;  // Skip non-localized files
  
  const original = fs.readFileSync(filePath, 'utf-8');
  const { output: fixed, count } = fixAsideTitles(original, lang);

  if (count > 0 && fixed !== original) {
    totalFixed += count;
    filesModified++;

    const rel = path.relative(process.cwd(), filePath);
    console.log(`  ${rel}  (${count} Aside component${count > 1 ? 's' : ''} updated)`);

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
    }
  }
}

console.log(
  `\n${DRY_RUN ? '[DRY RUN] ' : ''}Done — updated ${totalFixed} Aside component(s) across ${filesModified} .mdx file(s).`
);

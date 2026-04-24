#!/usr/bin/env node
/**
 * convert-html-tables.mjs
 *
 * Converts HTML <table> blocks in MDX files to Markdown pipe tables.
 * Tables with colspan/rowspan are left as HTML (fix-pseudo-html handles JSX compat).
 * Cell content: <br> → ", ", HTML tags stripped, whitespace normalized.
 *
 * Usage:
 *   node scripts/convert-html-tables.mjs [dir]              # dry-run
 *   node scripts/convert-html-tables.mjs [dir] --apply      # apply changes
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

const dirArg = process.argv.find(a => !a.startsWith('-') && a !== process.argv[0] && a !== process.argv[1]);
const TOPICS_DIR = dirArg
  ? path.resolve(dirArg)
  : path.join(ROOT, 'docs/jquery/src/content/en/topics');

const APPLY = process.argv.includes('--apply');

// ─── HTML table regex ────────────────────────────────────────────────────────
// Matches <table ...>...</table> blocks (greedy-minimal inner match).
const TABLE_RE = /<table[^>]*>([\s\S]*?)<\/table>/gi;

// Check for colspan or rowspan — these can't be converted to MD pipe tables.
const COMPLEX_RE = /\b(colspan|rowspan)\s*=/i;

// ─── Strip HTML tags from cell content ───────────────────────────────────────
function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, ' \u2502 ')           // <br> → separator
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, '$1') // <img alt="x"> → x
    .replace(/<img[^>]*>/gi, '')                     // <img> without alt
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)') // <a> → [text](href)
    .replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')  // <code> → backtick
    .replace(/<\/?[a-z][^>]*>/gi, '')                // strip remaining tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')                          // numeric entities
    .replace(/\s+/g, ' ')                            // collapse whitespace
    .replace(/\s*\u2502\s*/g, ', ')                  // clean up br separators
    .replace(/,\s*$/, '')                            // trailing comma
    .replace(/^\s*,\s*/, '')                         // leading comma
    .trim();
}

// ─── Extract rows from a <thead> or <tbody> block ────────────────────────────
function extractRows(sectionHtml) {
  const rows = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRe.exec(sectionHtml)) !== null) {
    const cells = [];
    const cellRe = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let cellMatch;
    while ((cellMatch = cellRe.exec(rowMatch[1])) !== null) {
      cells.push(stripTags(cellMatch[1]));
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

// ─── Convert a single HTML table to Markdown ─────────────────────────────────
function tableToMarkdown(tableHtml) {
  // Skip complex tables.
  if (COMPLEX_RE.test(tableHtml)) return null;

  const theadMatch = tableHtml.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
  const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);

  let headerRows = theadMatch ? extractRows(theadMatch[1]) : [];
  let bodyRows   = tbodyMatch ? extractRows(tbodyMatch[1]) : [];

  // If no thead, try extracting all rows and use first as header.
  if (headerRows.length === 0 && bodyRows.length === 0) {
    const allRows = extractRows(tableHtml);
    if (allRows.length < 2) return null;
    headerRows = [allRows[0]];
    bodyRows   = allRows.slice(1);
  }

  if (headerRows.length === 0 && bodyRows.length === 0) return null;

  // Use first header row; if no header, synthesize empty headers.
  const headers = headerRows[0] || bodyRows[0].map(() => '');
  const colCount = headers.length;

  // Ensure all rows have the same number of columns.
  const normalize = (row) => {
    while (row.length < colCount) row.push('');
    return row.slice(0, colCount);
  };

  // Escape pipe characters in cell content.
  const esc = (s) => s.replace(/\|/g, '\\|');

  // Build markdown.
  const lines = [];
  lines.push('| ' + normalize(headers).map(esc).join(' | ') + ' |');
  lines.push('| ' + headers.map(() => '---').join(' | ') + ' |');
  for (const row of bodyRows) {
    lines.push('| ' + normalize(row).map(esc).join(' | ') + ' |');
  }

  return lines.join('\n');
}

// ─── Walk files ──────────────────────────────────────────────────────────────
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

// ─── Main ────────────────────────────────────────────────────────────────────
console.log(`\n=== convert-html-tables [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===\n`);

const files = walkMdx(TOPICS_DIR);
let totalConverted = 0;
let totalSkipped   = 0;
let filesChanged   = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf-8');
  let changed = false;

  const converted = original.replace(TABLE_RE, (match) => {
    const md = tableToMarkdown(match);
    if (md) {
      totalConverted++;
      changed = true;
      return '\n' + md + '\n';
    }
    totalSkipped++;
    return match; // leave complex tables as-is
  });

  if (changed) {
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

console.log(`\nConverted: ${totalConverted} tables in ${filesChanged} files`);
console.log(`Skipped (complex): ${totalSkipped} tables`);
console.log('Done.\n');

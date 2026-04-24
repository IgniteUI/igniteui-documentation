#!/usr/bin/env node
/**
 * convert-docfx-tokens.mjs
 *
 * Converts legacy DocFX %%Token%% placeholders to {environment:Token} format
 * understood by the remark-docfx plugin at build time.
 *
 * Also replaces %%Token%% in toc.json *names* with their literal resolved values
 * (sidebar display text should not contain build-time tokens).
 *
 * Usage:
 *   node scripts/convert-docfx-tokens.mjs                      # dry-run
 *   node scripts/convert-docfx-tokens.mjs --apply               # apply changes
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
const TOC_JSON   = path.join(ROOT, 'docs/jquery/toc.json');
const ENV_JSON   = path.join(ROOT, 'docs/jquery/src/content/en/environment.json');

const APPLY = process.argv.includes('--apply');

// ─── Token definitions (resolved values for toc.json names) ──────────────────
// These are loaded from environment.json production section.
function loadTokenValues() {
  try {
    const data = JSON.parse(fs.readFileSync(ENV_JSON, 'utf-8'));
    return data.production || data.development || {};
  } catch {
    return {};
  }
}

// ─── The %%Token%% pattern ───────────────────────────────────────────────────
const TOKEN_RE = /%%(\w+)%%/g;

// ─── Walk MDX files ──────────────────────────────────────────────────────────
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

// ─── Convert content files: %%Token%% → {environment:Token} ─────────────────
function convertContentTokens() {
  const files = walkMdx(TOPICS_DIR);
  let totalReplacements = 0;
  let filesChanged = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf-8');
    const converted = original.replace(TOKEN_RE, (_match, key) => `&#123;environment:${key}&#125;`);

    if (converted !== original) {
      const count = (original.match(TOKEN_RE) || []).length;
      totalReplacements += count;
      filesChanged++;
      const rel = path.relative(TOPICS_DIR, file);
      if (!APPLY) {
        console.log(`  [dry-run] ${rel}: ${count} token(s)`);
      } else {
        fs.writeFileSync(file, converted, 'utf-8');
        console.log(`  ✓ ${rel}: ${count} token(s) converted`);
      }
    }
  }

  console.log(`\nContent tokens: ${totalReplacements} replacements across ${filesChanged} files`);
}

// ─── Convert toc.json: resolve %%Token%% in "name" fields to literal values ─
function convertTocTokens() {
  if (!fs.existsSync(TOC_JSON)) {
    console.log('  [skip] toc.json not found');
    return;
  }

  const values = loadTokenValues();
  const original = fs.readFileSync(TOC_JSON, 'utf-8');

  // Replace %%Token%% with resolved value (or leave as-is if unknown).
  const converted = original.replace(TOKEN_RE, (_match, key) => {
    if (values[key]) return values[key];
    console.warn(`  [warn] Unknown token in toc.json: %%${key}%%`);
    return _match;
  });

  if (converted !== original) {
    const count = (original.match(TOKEN_RE) || []).length;
    if (!APPLY) {
      console.log(`  [dry-run] toc.json: ${count} token(s)`);
    } else {
      fs.writeFileSync(TOC_JSON, converted, 'utf-8');
      console.log(`  ✓ toc.json: ${count} token(s) resolved`);
    }
  } else {
    console.log('  toc.json: no tokens found');
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
console.log(`\n=== convert-docfx-tokens [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===\n`);
console.log('Phase 1: Content files (%%Token%% → {environment:Token})');
convertContentTokens();
console.log('\nPhase 2: toc.json (%%Token%% → literal values)');
convertTocTokens();
console.log('\nDone.\n');

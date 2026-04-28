#!/usr/bin/env node
/**
 * convert-docfx-tokens.mjs
 *
 * Converts legacy DocFX %%Token%% placeholders to {environment:Token} format
 * in BOTH content (`.md` / `.mdx`) and `toc.json` "name" fields.
 *
 * Tokens are intentionally kept dynamic — the runtime resolves them per
 * environment (development / staging / production):
 *   - MDX:       src/plugins/remark-docfx.ts
 *   - toc.json:  src/sidebar.ts (buildSidebarFromToc)
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
const tocArg    = process.argv.find(a => a.startsWith('--toc='));
const TOPICS_DIR = topicsArg
  ? path.resolve(ROOT, topicsArg.slice('--topics='.length))
  : path.join(ROOT, 'docs/jquery/src/content/en/topics');
const TOC_JSON   = tocArg
  ? path.resolve(ROOT, tocArg.slice('--toc='.length))
  : path.join(ROOT, 'docs/jquery/toc.json');

// Resolve environment.json from the topics directory (supports ja, en, etc.)
const ENV_JSON   = fs.existsSync(path.join(TOPICS_DIR, 'environment.json'))
  ? path.join(TOPICS_DIR, 'environment.json')
  : path.join(ROOT, 'docs/jquery/src/content/en/environment.json');

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
// Body uses backslash-escaped braces (`\{…\}`) so MDX won't parse `{` as JSX.
// MDX strips the `\` and the runtime resolver in remark-docfx sees the literal
// `{environment:Foo}`. Frontmatter is YAML — `{` is just a literal char there —
// so we keep raw braces (`{environment:Foo}`) in frontmatter.
function convertContentTokens() {
  const files = walkMdx(TOPICS_DIR);
  let totalReplacements = 0;
  let filesChanged = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf-8');
    const bom = original.charCodeAt(0) === 0xFEFF ? '\uFEFF' : '';
    const text = bom ? original.slice(1) : original;

    // Split frontmatter from body (frontmatter must start at byte 0 after BOM).
    const fmMatch = text.match(/^(---[\s\S]*?\r?\n---\r?\n?)/);
    const frontmatter = fmMatch ? fmMatch[1] : '';
    const body = fmMatch ? text.slice(frontmatter.length) : text;

    const newFm = frontmatter.replace(TOKEN_RE, (_m, key) => `{environment:${key}}`);
    const newBody = body.replace(TOKEN_RE, (_m, key) => `\\{environment:${key}\\}`);
    const converted = bom + newFm + newBody;

    if (converted !== original) {
      const count = ((frontmatter + body).match(TOKEN_RE) || []).length;
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

// ─── Convert toc.json: %%Token%% → {environment:Token} (kept dynamic) ────
function convertTocTokens() {
  if (!fs.existsSync(TOC_JSON)) {
    console.log('  [skip] toc.json not found');
    return;
  }

  const original = fs.readFileSync(TOC_JSON, 'utf-8');

  // Convert %%Token%% → {environment:Token} so the value remains environment-
  // aware (resolved at runtime by src/sidebar.ts via environment.json).
  const converted = original.replace(TOKEN_RE, (_m, key) => `{environment:${key}}`);

  if (converted !== original) {
    const count = (original.match(TOKEN_RE) || []).length;
    if (!APPLY) {
      console.log(`  [dry-run] toc.json: ${count} token(s)`);
    } else {
      fs.writeFileSync(TOC_JSON, converted, 'utf-8');
      console.log(`  ✓ toc.json: ${count} token(s) converted`);
    }
  } else {
    console.log('  toc.json: no tokens found');
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
console.log(`\n=== convert-docfx-tokens [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===\n`);
console.log('Phase 1: Content files (%%Token%% → {environment:Token})');
convertContentTokens();
console.log('\nPhase 2: toc.json (%%Token%% → {environment:Token})');
convertTocTokens();
console.log('\nDone.\n');

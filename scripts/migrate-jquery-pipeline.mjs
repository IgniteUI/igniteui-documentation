#!/usr/bin/env node
/**
 * migrate-jquery-pipeline.mjs
 *
 * Full migration pipeline for DocFX-style docs → Astro/Starlight MDX.
 * Orchestrates all scripts in the correct order.
 *
 * Designed for files originally exported from DocFX with NN_ numeric prefixes,
 * %%Token%% environment markers, .html cross-references, and HTML tables.
 *
 * Pipeline order:
 *   1. gen-jquery-toc          – generate toc.json from file tree (uses NN_ prefixes for order)
 *   2. convert-docfx-tokens    – %%Token%% → {environment:Token} in content, resolve in toc.json
 *   3. convert-html-tables     – HTML <table> → Markdown pipe tables
 *   4. fix-html-links          – .html cross-references → .mdx relative paths
 *   5. rename-jquery-topics    – strip NN_ prefixes, slugify, update toc & inline links
 *   6. fix-pseudo-html         – escape pseudo-HTML tokens & curly braces for MDX
 *   7. fix-all-mdx             – comprehensive MDX fixes (orphaned tags, anchors, escapes)
 *   8. fix-broken-images       – fix broken image paths (wrong depth, old numbered folders)
 *   9. fix-internal-links      – resolve old-style links, strip .mdx, fix // prefixes
 *  10. add-slugs-to-toc        – add slugs to toc.json from frontmatter
 *  11. validate-mdx            – check MDX compilation
 *
 * Note: `{environment:Foo}` tokens in MDX are resolved at compile time by
 * `src/plugins/remark-docfx.ts`, and the same tokens in `toc.json` are
 * resolved at sidebar-build time by `src/sidebar.ts`. Do NOT statically
 * rewrite these tokens — keep them dynamic so dev/staging/prod builds can
 * each render their own values.
 *
 * Usage:
 *   node scripts/migrate-jquery-pipeline.mjs                              # dry-run (jQuery default)
 *   node scripts/migrate-jquery-pipeline.mjs --apply                      # execute all steps
 *   node scripts/migrate-jquery-pipeline.mjs --apply --topics=docs/other/src/content/en/topics
 *
 * Parameters:
 *   --apply                    Execute changes (default: dry-run)
 *   --topics=<path>            Topics directory (default: docs/jquery/src/content/en/topics)
 *   --toc=<path>               toc.json output path (default: docs/jquery/toc.json)
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const APPLY = process.argv.includes('--apply');
const applyFlag = APPLY ? '--apply' : '';

const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const tocArg    = process.argv.find(a => a.startsWith('--toc='));
const TOPICS = topicsArg ? topicsArg.slice('--topics='.length) : 'docs/jquery/src/content/en/topics';
const topicsFlag = topicsArg ? ` --topics=${TOPICS}` : '';
const tocFlag    = tocArg ? ` --toc=${tocArg.slice('--toc='.length)}` : '';

function run(label, cmd) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  STEP: ${label}`);
  console.log(`${'═'.repeat(70)}\n`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    console.error(`\n✗ FAILED: ${label}`);
    console.error(`  Command: ${cmd}`);
    console.error(`  Exit code: ${err.status}`);
    process.exit(1);
  }
}

console.log(`\n${'█'.repeat(70)}`);
console.log(`  Docs Migration Pipeline [${APPLY ? 'APPLY' : 'DRY-RUN'}]`);
console.log(`  Topics: ${TOPICS}`);
console.log(`${'█'.repeat(70)}`);

// Step 1: Generate toc.json (reads NN_ prefixes for order, H1s still have %%tokens%%)
if (APPLY) {
  run('Generate toc.json', `node scripts/gen-jquery-toc.mjs${topicsFlag}${tocFlag}`);
} else {
  console.log('\n  [dry-run] Skipping gen-jquery-toc (always writes, no dry-run mode)');
}

// Step 2: Convert %%Token%% → {environment:Token} in content files,
//         resolve %%Token%% → literal values in toc.json names
run('Convert DocFX tokens', `node scripts/convert-docfx-tokens.mjs ${applyFlag}${topicsFlag}${tocFlag}`);

// Step 3: Convert HTML tables → Markdown pipe tables
run('Convert HTML tables', `node scripts/convert-html-tables.mjs ${TOPICS} ${applyFlag}`);

// Step 4: Fix .html links → .mdx links (uses fileName metadata to build map)
run('Fix .html links', `node scripts/fix-html-links.mjs ${applyFlag}${topicsFlag}`);

// Step 5: Rename files/folders (strips NN_, slugifies, updates toc & inline links)
run('Rename topics', `node scripts/rename-jquery-topics.mjs ${applyFlag}${topicsFlag}${tocFlag}`);

// Step 6: Fix HTML/JSX issues for MDX compatibility (always writes, no --apply flag)
if (APPLY) {
  run('Fix pseudo-HTML', `node scripts/fix-pseudo-html.mjs ${TOPICS}`);
} else {
  console.log('\n  [dry-run] Skipping fix-pseudo-html (always writes, no dry-run mode)');
}

// Step 7: Comprehensive MDX fixes (orphaned HTML tags, anchors, brace escaping)
run('Fix all MDX issues', `node scripts/fix-all-mdx.mjs ${applyFlag}${topicsFlag}`);

// Step 8: Fix broken image paths
if (APPLY) {
  run('Fix broken images', `node scripts/fix-broken-images-all.mjs ${TOPICS}`);
} else {
  run('Find broken images', `node scripts/find-broken-images.mjs${topicsFlag}`);
}

// Step 9: Fix internal links (resolve old names, strip .mdx, fix // prefixes)
run('Fix internal links', `node scripts/fix-internal-links.mjs ${applyFlag}${topicsFlag}`);

// Step 10: Add slugs to toc.json (reads frontmatter/metadata from source files)
if (APPLY) {
  run('Add slugs to toc.json', `node scripts/add-slugs-to-toc.mjs${topicsFlag}${tocFlag}`);
} else {
  console.log('\n  [dry-run] Skipping add-slugs-to-toc (always writes, no dry-run mode)');
}


// Step 11: Validate MDX compilation
run('Validate MDX', `node scripts/validate-mdx.mjs ${TOPICS}`);

console.log(`\n${'█'.repeat(70)}`);
console.log(`  Pipeline complete [${APPLY ? 'APPLY' : 'DRY-RUN'}]`);
console.log(`${'█'.repeat(70)}\n`);

#!/usr/bin/env node
/**
 * migrate-embed-samples.mjs
 *
 * Converts legacy DocFX embed-sample blocks to the new <Sample> MDX component.
 *
 * Input pattern (any of these forms):
 *
 *   <div class="embed-sample">
 *      [Label Text]({environment:SamplesEmbedUrl}/grid/cell-merging-custom)
 *   </div>
 *
 *   <div class="embed-sample">
 *      [{environment:SamplesEmbedUrl}/grid/angular]({environment:SamplesEmbedUrl}/grid/angular)
 *   </div>
 *
 * Output:
 *
 *   <Sample src="/grid/cell-merging-custom/index.html" height={428} alt="Label Text"/>
 *
 * Rules:
 *   - The sample path is extracted from the URL (the part after {environment:SamplesEmbedUrl}).
 *   - `/index.html` is appended to the path if it doesn't already end with a file extension.
 *   - The label is used as `alt`. If the label is the same as the URL (URL-only form), `alt`
 *     is derived from the last path segment, title-cased.
 *   - If the import for Sample.astro is not already present, it is added after the frontmatter.
 *   - Already-commented-out embed-sample blocks (JSX comments) are left untouched.
 *
 * Usage:
 *   node scripts/migrate-embed-samples.mjs                      # dry-run (shows what would change)
 *   node scripts/migrate-embed-samples.mjs --apply              # write changes to disk
 *   node scripts/migrate-embed-samples.mjs --topics=docs/other/src/content/en/topics
 *   node scripts/migrate-embed-samples.mjs --height=500         # override default height (default: 428)
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

const topicsArg  = process.argv.find(a => a.startsWith('--topics='));
const heightArg  = process.argv.find(a => a.startsWith('--height='));
const TOPICS_DIR = topicsArg
    ? path.resolve(ROOT, topicsArg.slice('--topics='.length))
    : path.join(ROOT, 'docs/jquery/src/content/en/topics');
const DEFAULT_HEIGHT = heightArg ? parseInt(heightArg.slice('--height='.length), 10) : 428;
const APPLY = process.argv.includes('--apply');

const SAMPLE_IMPORT = "import Sample from 'docs-template/components/mdx/Sample.astro';";

console.log(`\n=== migrate-embed-samples [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===`);
console.log(`  topics:  ${TOPICS_DIR}`);
console.log(`  height:  ${DEFAULT_HEIGHT}`);
console.log();

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

/**
 * Derives a display label from a URL sample path.
 * Uses the last two meaningful segments to give better context.
 * e.g. "/grid/cell-merging-custom/index.html" → "Grid Cell Merging Custom"
 *      "/data-chart/json-binding/index.html"  → "Data Chart Json Binding"
 */
function labelFromPath(samplePath) {
    const segments = samplePath.split('/').filter(s => s && s !== 'index.html');
    // Use all segments (omitting 'index.html') joined as a title.
    return segments
        .join(' ')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Decodes HTML entities used in MDX to escape JSX curly braces.
 * &#123; → {    &#125; → }
 */
function decodeEntities(str) {
    return str.replace(/&#123;/g, '{').replace(/&#125;/g, '}');
}

/**
 * Given a URL like "{environment:SamplesEmbedUrl}/grid/cell-merging-custom",
 * extracts the sample path ("/grid/cell-merging-custom") and returns
 * the src value with "/index.html" appended when there's no file extension.
 */
function urlToSrc(rawUrl) {
    // Strip the {environment:SamplesEmbedUrl} token (with or without HTML entities).
    const decoded = decodeEntities(rawUrl);
    const withoutToken = decoded
        .replace(/\{environment:SamplesEmbedUrl\}/gi, '')
        .replace(/\{environment:NewSamplesUrl\}/gi, '')
        .replace(/\{environment:SamplesUrl\}/gi, '');

    let src = withoutToken.trim();
    if (!src.startsWith('/')) src = '/' + src;

    // Append /index.html if no file extension at the end.
    if (!/\.[a-z]+$/i.test(src)) {
        src = src.replace(/\/$/, '') + '/index.html';
    }

    return src;
}

/**
 * Determines whether a label string is just a URL (URL-only form).
 * In that case we derive the alt from the path instead.
 */
function isUrlLabel(label) {
    const decoded = decodeEntities(label);
    return /\{environment:Samples/.test(decoded) || /^https?:\/\//.test(decoded.trim());
}

// ─── The embed-sample block regex ─────────────────────────────────────────────
//
// Matches:
//   <div class="embed-sample">
//      [label](url)
//   </div>
//
// Does NOT match blocks that are already inside a {/* */} comment.
// We look for the block in raw text and handle surrounding JSX comment detection
// by checking the context before each match.

const EMBED_BLOCK_RE =
    /<div\s+class="embed-sample">\s*\[([^\]]*)\]\(([^)]*)\)\s*<\/div>/g;

// ─── Per-file transformation ──────────────────────────────────────────────────

function migrateFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf-8');
    let updated    = original;

    // Track whether we made any replacement.
    let changed = false;

    // We iterate with a manual loop so we can check if the match is already
    // inside a {/* ... */} JSX comment and skip it.
    let match;
    const replacements = [];

    EMBED_BLOCK_RE.lastIndex = 0;
    while ((match = EMBED_BLOCK_RE.exec(original)) !== null) {
        const fullMatch  = match[0];
        const rawLabel   = match[1];
        const rawUrl     = match[2];
        const matchStart = match.index;

        // Skip if inside a {/* ... */} JSX comment.
        // We check for an unclosed {/* before this match position.
        const before = original.slice(0, matchStart);
        const openComments  = (before.match(/\{\/\*/g)  ?? []).length;
        const closeComments = (before.match(/\*\/\}/g)  ?? []).length;
        if (openComments > closeComments) continue;

        const src = urlToSrc(rawUrl);
        const alt = isUrlLabel(rawLabel) ? labelFromPath(src) : rawLabel.trim();

        const component = `<Sample src="${src}" height={${DEFAULT_HEIGHT}} alt="${alt}"/>`;

        replacements.push({ fullMatch, component });
    }

    if (replacements.length === 0) return;

    // Apply replacements in reverse order so indices stay valid.
    // Since we're doing string replacement (not index-based), just replace all.
    for (const { fullMatch, component } of replacements) {
        updated = updated.replace(fullMatch, component);
        changed = true;
    }

    // Inject the Sample import if not already present.
    if (changed && !updated.includes(SAMPLE_IMPORT)) {
        // Insert after the closing --- of the frontmatter, or at the top.
        const fmEnd = updated.indexOf('---', 3);
        if (fmEnd !== -1) {
            const insertAt = fmEnd + 3;
            // Strip leading whitespace/newlines after frontmatter, then
            // add exactly: blank line, import, blank line, content.
            // This ensures there is always an empty line before the first heading.
            const rest = updated.slice(insertAt).replace(/^\s*\n+/, '');
            updated = updated.slice(0, insertAt) + '\n\n' + SAMPLE_IMPORT + '\n\n' + rest;
        } else {
            updated = SAMPLE_IMPORT + '\n\n' + updated;
        }
    }

    if (updated === original) return;

    const rel = path.relative(ROOT, filePath);
    console.log(`  ${APPLY ? 'updated' : 'would update'}: ${rel} (${replacements.length} replacement${replacements.length > 1 ? 's' : ''})`);
    replacements.forEach(({ fullMatch, component }) => {
        const preview = fullMatch.replace(/\s+/g, ' ').slice(0, 80);
        console.log(`    - "${preview}" → ${component}`);
    });

    if (APPLY) {
        fs.writeFileSync(filePath, updated, 'utf-8');
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const files = walkMdx(TOPICS_DIR);
let totalFiles = 0;
let totalReplacements = 0;

for (const file of files) {
    const before = fs.readFileSync(file, 'utf-8');
    EMBED_BLOCK_RE.lastIndex = 0;
    const count = (before.match(EMBED_BLOCK_RE) ?? []).length;
    if (count > 0) {
        totalFiles++;
        totalReplacements += count;
        migrateFile(file);
    }
}

console.log();
console.log(`=== Summary ===`);
console.log(`  Files with embed-sample blocks: ${totalFiles}`);
console.log(`  Total blocks to replace:        ${totalReplacements}`);
if (!APPLY) {
    console.log();
    console.log('  Run with --apply to write changes.');
}
console.log();

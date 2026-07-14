#!/usr/bin/env node
/**
 * HTML link crawler for built dist/ output.
 *
 * Scans all .html files under dist/, extracts internal href links that
 * point to product doc pages, and checks whether the target page exists
 * as an .html file in the same dist tree.
 *
 * Usage:
 *   node scripts/check-html-links.mjs
 *   node scripts/check-html-links.mjs --dist=dist/angular
 *   node scripts/check-html-links.mjs --md=reports/html-links-report.md
 *   node scripts/check-html-links.mjs --summary
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

// CLI arg ─────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; })
);

const DIST_ROOT  = resolve(args.dist ?? 'dist');
const MD_OUTPUT  = args.md     ? String(args.md)  : null;
const SUMMARY    = args.summary === true;
const DIVIDER    = '═'.repeat(72);

// URL prefix → dist subfolders map
// Each platform uses one URL prefix for both EN and JP builds.
// We check the linked slug against all dist folders for that prefix.
const PREFIX_MAP = [
    { prefix: '/products/ignite-ui-angular/angular/components',               dirs: ['dist/angular', 'dist/angular-jp'] },
    { prefix: '/products/ignite-ui-react/react/components',                   dirs: ['dist/react',   'dist/react-jp']   },
    { prefix: '/products/ignite-ui-web-components/web-components/components', dirs: ['dist/wc',      'dist/wc-jp']      },
    { prefix: '/products/ignite-ui-blazor/blazor/components',                 dirs: ['dist/blazor',  'dist/blazor-jp']  },
];

// Build a Set of all html pages in each dist subfolder (relative slug → true)
function buildPageIndex(distDir) {
    const index = new Set();
    if (!existsSync(distDir)) return index;
    function walk(dir) {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) { walk(full); continue; }
            if (entry.name.endsWith('.html')) {
                // Store path relative to distDir, without extension, with leading /
                // Normalize to lowercase so lookups are case-insensitive (avoids
                // false positives on Windows where readdirSync returns the on-disk
                // case which may differ from the case used in HTML hrefs).
                const rel = full.slice(distDir.length).replace(/\\/g, '/').replace(/\.html$/, '').toLowerCase();
                index.add(rel);
            }
        }
    }
    walk(distDir);
    return index;
}

// Pre build page indexes for all dist subfolders
const pageIndexes = new Map();
for (const { dirs } of PREFIX_MAP) {
    for (const dir of dirs) {
        if (!pageIndexes.has(dir)) {
            pageIndexes.set(dir, buildPageIndex(dir));
        }
    }
}

// HTML walking
function walkHtml(dir, results = []) {
    if (!existsSync(dir)) return results;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) { walkHtml(full, results); continue; }
        if (entry.name.endsWith('.html')) results.push(full);
    }
    return results;
}

// Extract internal doc hrefs from HTML content
const HREF_RE = /href="([^"]+)"/g;

function extractInternalLinks(html) {
    const links = new Set();
    let m;
    while ((m = HREF_RE.exec(html)) !== null) {
        const href = m[1].split('#')[0].trim(); // strip anchors
        if (!href) continue;
        if (!href.startsWith('/products/')) continue;     // only doc pages
        if (href.includes('://')) continue;               // skip absolute URLs
        // Skip assets: _astro/, favicon, images, css, js, fonts, etc.
        if (/_astro\//.test(href)) continue;
        if (/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff2?|ttf|eot|map)$/i.test(href)) continue;
        // Skip API reference class pages (served from external API docs, not generated in this build)
        if (/\/classes\/[^/]+\.html$/.test(href)) continue;
        links.add(href);
    }
    return links;
}

function resolveLink(href) {
    for (const { prefix, dirs } of PREFIX_MAP) {
        if (href.startsWith(prefix)) {
            // Normalize to lowercase to match the lowercased page index.
            // Also strip a trailing .html extension from legacy links.
            let slug = href.slice(prefix.length) || '/index';
            slug = slug.replace(/\.html$/i, '').toLowerCase();

            // Build a list of candidate slugs
            const slugNoIndex         = slug.replace(/\/index$/, '');
            const slugNoTrailingSlash = slug.replace(/\/$/, '');
            const slugBoth            = slugNoTrailingSlash.replace(/\/index$/, '');
            const candidates = [...new Set([slug, slugNoIndex, slugNoTrailingSlash, slugBoth, slug + '/index'])];

            // Link is valid if it exists in ANY of the dirs for this prefix (en or jp)
            for (const dir of dirs) {
                const index = pageIndexes.get(dir);
                if (index && candidates.some(c => index.has(c))) {
                    return { found: true, dirs };
                }
            }
            return { found: false, dirs, slug };
        }
    }
    return null; // doesn't match any known prefix
}

// Main scan
console.log(`\n${DIVIDER}`);
console.log('  HTML LINK CRAWLER');
console.log(DIVIDER);
console.log(`  Dist root: ${DIST_ROOT}\n`);

const allHtmlFiles = walkHtml(DIST_ROOT);
const brokenLinks  = []; // { file, href, dir }
let totalLinks     = 0;
let skippedLinks   = 0;

for (const file of allHtmlFiles) {
    const html = readFileSync(file, 'utf8');
    const links = extractInternalLinks(html);

    for (const href of links) {
        totalLinks++;
        const result = resolveLink(href);
        if (result === null) { skippedLinks++; continue; } // unknown prefix
        if (!result.found) {
            brokenLinks.push({ file: file.replace(/\\/g, '/'), href, dirs: result.dirs });
        }
    }
}

// Group all occurrences by broken href: Map<href, { dirs, referrers: Set<file> }>
const brokenByHref = new Map();
for (const { file, href, dirs } of brokenLinks) {
    if (!brokenByHref.has(href)) brokenByHref.set(href, { dirs, referrers: new Set() });
    brokenByHref.get(href).referrers.add(file);
}
const uniqueBroken = [...brokenByHref.entries()]; // [ [href, { dirs, referrers }], ... ]

// Output
if (SUMMARY) {
    const status = brokenLinks.length === 0 ? '✅' : '❌';
    console.log(`  ${status}  HTML files: ${allHtmlFiles.length}  |  Links checked: ${totalLinks}  |  Broken (unique): ${uniqueBroken.length}`);
} else {
    if (uniqueBroken.length === 0) {
        console.log('  ✅  No broken internal links found.\n');
    } else {
        for (const [href, { referrers }] of uniqueBroken) {
            console.log(`  ✗  ${href}`);
            for (const ref of referrers) {
                console.log(`       referenced from: ${ref}`);
            }
            console.log('');
        }
    }

    console.log(`\n${DIVIDER}`);
    console.log(`  HTML files scanned  : ${allHtmlFiles.length}`);
    console.log(`  Internal links      : ${totalLinks}`);
    console.log(`  Skipped (no prefix) : ${skippedLinks}`);
    console.log(`  ✅ OK               : ${totalLinks - skippedLinks - brokenLinks.length}`);
    console.log(`  ❌ Broken           : ${brokenLinks.length}  (${uniqueBroken.length} unique)`);
    console.log(DIVIDER + '\n');
}

// Markdown report
if (MD_OUTPUT) {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const lines = [
        '# HTML Link Crawl Report', '',
        `_Generated: ${ts}_`, '',
        '## Summary', '',
        '| | |', '|---|---|',
        `| HTML files scanned | ${allHtmlFiles.length} |`,
        `| Internal links checked | ${totalLinks - skippedLinks} |`,
        `| ✅ OK | ${totalLinks - skippedLinks - brokenLinks.length} |`,
        `| ❌ Broken (unique targets) | **${uniqueBroken.length}** |`, '',
    ];

    if (uniqueBroken.length > 0) {
        lines.push('## Broken Links', '');
        for (const [href, { dirs, referrers }] of uniqueBroken) {
            lines.push(`### \`${href}\``);
            lines.push('');
            lines.push(`_Missing in: ${dirs.join(', ')}_`);
            lines.push('');
            lines.push('Referenced from:');
            lines.push('');
            for (const ref of referrers) {
                lines.push(`- \`${ref}\``);
            }
            lines.push('');
        }
    }

    writeFileSync(MD_OUTPUT, lines.join('\n'));
    console.log(`  Markdown report written to: ${MD_OUTPUT}\n`);
}

process.exit(brokenLinks.length > 0 ? 1 : 0);

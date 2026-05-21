#!/usr/bin/env node
/**
 * Crawls all HTML files in the dist/ build output and checks every link that
 * targets staging.infragistics.com/api.
 *
 * Built docs always embed /latest/ in API URLs.  The staging server does not
 * serve /latest/ — it only has versioned paths (21.2.0, 21.0.0, …) that differ
 * per package.  Before checking links we probe each unique package root to
 * discover its real version via redirect, then rewrite /latest/ accordingly.
 *
 * Broken link detection: the API server returns HTTP 200 for missing types/members
 * and renders a "Page not found" page inside .igd-main-content.  We detect this
 * by reading the response body and looking for a known marker string.
 *
 * Usage:
 *   node scripts/check-api-links.mjs
 *   node scripts/check-api-links.mjs --dist=dist
 *   node scripts/check-api-links.mjs --platform=angular
 *   node scripts/check-api-links.mjs --concurrency=20
 *   node scripts/check-api-links.mjs --timeout=15000
 *   node scripts/check-api-links.mjs --output=api-link-report.json
 *   node scripts/check-api-links.mjs --md=api-link-report.md
 *
 * Exit code: 0 = all OK, 1 = broken links found.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

// CLI args

const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => {
            const [k, ...rest] = a.slice(2).split('=');
            return [k, rest.length ? rest.join('=') : true];
        })
);

const DIST_DIR    = String(args.dist         ?? 'dist');
const PLATFORM    = args.platform ? String(args.platform) : null;
const CONCURRENCY = parseInt(String(args.concurrency ?? '20'), 10);
const TIMEOUT_MS  = parseInt(String(args.timeout     ?? '15000'), 10);
const OUTPUT      = args.output ? String(args.output) : null;
const MD_OUTPUT   = args.md     ? String(args.md)     : null;

// Constants

const HREF_RE = /href="(https:\/\/staging\.infragistics\.com\/api[^"#]+(?:#[^"]+)?)"/g;

// Extracts the package root from a /latest/ URL.
// e.g. https://staging.infragistics.com/api/angular/igniteui-angular/latest/...
//   → https://staging.infragistics.com/api/angular/igniteui-angular/
const PKG_ROOT_RE = /^(https:\/\/staging\.infragistics\.com\/api\/[^/]+\/[^/]+\/)latest\//;

const FOLDER_LABELS = {
    angular:      'Angular (EN)',
    'angular-jp': 'Angular (JP)',
    react:        'React (EN)',
    'react-jp':   'React (JP)',
    wc:           'WebComponents (EN)',
    'wc-jp':      'WebComponents (JP)',
    blazor:       'Blazor (EN)',
    'blazor-jp':  'Blazor (JP)',
};

/** Subfolders to skip inside each platform build - no API links there. */
const SKIP_DIRS = new Set(['_astro', 'pagefind', 'images']);

// The staging API server returns HTTP 200 for every URL - even for missing
// types/members.  The only reliable signal is the breadcrumb inside
// .igd-main-content: on a 404 page it contains title="Page not found", while
// on a real API page it shows the actual class/interface/type name.
// Using the breadcrumb attribute is far more specific than checking for a
// generic string like "<p>Page not found.</p>" which can appear in page content.
const NOT_FOUND_MARKER = 'class="docs-breadcrumb-crumb" title="Page not found"';

// File walking
function walkHtml(dir) {
    const results = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name)) results.push(...walkHtml(full));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

/** Returns a Set of staging API href values found in the given HTML file. */
function extractLinks(filePath) {
    const html = readFileSync(filePath, 'utf-8');
    const links = new Set();
    for (const m of html.matchAll(HREF_RE)) links.add(m[1]);
    return links;
}

// Version discovery

/**
 * Discovers the real version for each package that uses /latest/ URLs.
 *
 * Strategy:
 *   1. Pick one sample URL per package root.
 *   2. Fetch
 *   3. Check res.url first: if the server redirected to a versioned path, done.
 *   4. Otherwise the response body for version-like links that match the
 *      same package root (e.g. href="…/igniteui-angular/21.2.0/…").  The
 *      NOT_FOUND page includes a full site navigation that references real
 *      versioned URLs, which we can extract.
 *
 * Returns a Map<packageRoot, resolvedVersion>.
 */
async function discoverVersions(urls) {
    // Collect unique package roots from /latest/ URLs
    const roots = new Set();
    for (const url of urls) {
        const m = url.match(PKG_ROOT_RE);
        if (m) roots.add(m[1]);
    }
    if (roots.size === 0) return new Map();

    const versionMap = new Map();

    // Every /latest/ page embeds a `latestVersions` JS variable mapping
    // package name → current version.  One fetch resolves all packages at once.
    const sampleUrl = [...urls].find(u => PKG_ROOT_RE.test(u))?.split('#')[0];
    if (!sampleUrl) return versionMap;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(sampleUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'User-Agent': 'docs-api-link-checker/1.0' },
            redirect: 'follow',
        });
        clearTimeout(timer);

        // Strategy 1: redirect happened — res.url has the versioned path
        const finalUrl = res.url ?? '';
        const redirectMatch = finalUrl.match(/\/(\d+\.\d+\.\d+)\//);
        if (redirectMatch) {
            for (const root of roots) versionMap.set(root, redirectMatch[1]);
            return versionMap;
        }

        // Strategy 2: parse the embedded `latestVersions` JSON object.
        // The page scripts contain:
        //   const latestVersions = "{\"igniteui-angular\":\"21.2.0\",..."}"
        const body = await res.text();
        const lvMatch = body.match(/const latestVersions\s*=\s*"((?:[^"\\]|\\.)*)"/);
        if (lvMatch) {
            const latestVersions = JSON.parse(lvMatch[1].replace(/\\"/g, '"'));
            for (const root of roots) {
                // Package name is the last path segment of the root URL
                const pkgName = root.replace(/\/$/, '').split('/').pop();
                if (pkgName && latestVersions[pkgName]) {
                    versionMap.set(root, latestVersions[pkgName]);
                }
            }
        }
    } catch {
        clearTimeout(timer);
    }

    return versionMap;
}

/** Rewrites /latest/ to the discovered version for the given URL, if known. */
function resolveLatest(url, versionMap) {
    const m = url.match(PKG_ROOT_RE);
    if (!m) return url;
    const version = versionMap.get(m[1]);
    return version ? url.replace('/latest/', `/${version}/`) : url;
}

// HTTP checking

async function checkUrl(url, versionMap) {
    const fetchUrl = resolveLatest(url, versionMap);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(fetchUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'User-Agent': 'docs-api-link-checker/1.0' },
            redirect: 'follow',
        });
        clearTimeout(timer);

        if (!res.ok) {
            await res.body?.cancel();
            return { url, fetchUrl, status: res.status, ok: false };
        }

        // HTTP 200 - must read body to detect the not-found page.
        const body = await res.text();
        if (body.includes(NOT_FOUND_MARKER)) {
            return { url, fetchUrl, status: 'NOT_FOUND', ok: false };
        }

        return { url, fetchUrl, status: res.status, ok: true };
    } catch (err) {
        clearTimeout(timer);
        return {
            url,
            fetchUrl,
            status: null,
            ok: false,
            error: err.name === 'AbortError' ? 'TIMEOUT' : String(err.message),
        };
    }
}

/** Runs `checkUrl` over `urls` with at most `concurrency` in-flight at a time. */
async function checkAll(urls, versionMap, concurrency, onProgress) {
    const results = [];
    let idx = 0;
    async function worker() {
        while (idx < urls.length) {
            const url = urls[idx++];
            const result = await checkUrl(url, versionMap);
            results.push(result);
            onProgress(result, results.length, urls.length);
        }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
    return results;
}

// Known framework class suffixes that may produce wrong URLs when kind="class" is wrong
const COMMON_CLASS_SUFFIXES = ['Component', 'Module', 'Service', 'Directive', 'Pipe', 'Factory'];

// Matches class-segment staging URLs
const DIST_CLASS_URL_RE = /^(https:\/\/staging\.infragistics\.com\/api\/[^/]+\/[^/]+\/[^/]+\/)classes\/([^#]+?)(#.*)?$/;

/**
 * For a broken class URL, derives up to 3 alternative URLs:
 *   noSuffix           — same class segment, suffix stripped
 *   interfacesNoSuffix — interfaces segment, suffix stripped (kind was wrong)
 *   interfaces         — interfaces segment, type name unchanged
 */
function resolveDistVariants(url) {
    const variants = {};
    const base_url = url.split('#')[0];
    const m = base_url.match(DIST_CLASS_URL_RE);
    if (!m) return variants;
    const [, base, typeSlug] = m;
    const frag = url.includes('#') ? url.slice(url.indexOf('#')) : '';
    const dotIdx = typeSlug.lastIndexOf('.');
    const typeName = dotIdx >= 0 ? typeSlug.slice(dotIdx + 1) : typeSlug;
    const pkgPart  = dotIdx >= 0 ? typeSlug.slice(0, dotIdx + 1) : '';
    for (const sfx of COMMON_CLASS_SUFFIXES) {
        if (typeName.endsWith(sfx)) {
            const stripped = typeName.slice(0, -sfx.length);
            variants.noSuffix           = base + 'classes/'    + pkgPart + stripped + frag;
            variants.interfacesNoSuffix = base + 'interfaces/' + pkgPart + stripped + frag;
            variants.interfaces         = base + 'interfaces/' + pkgPart + typeName + frag;
            break;
        }
    }
    return variants;
}

/** Returns a prop-fix hint for the source ApiLink. */
function suggestDistFix(variantOk) {
    if (variantOk.interfacesNoSuffix) return 'In ApiLink: set kind="interface" (suffix removed automatically)';
    if (variantOk.noSuffix)           return 'In ApiLink: add suffix={false} or excludeSuffixFor="Platform"';
    if (variantOk.interfaces)         return 'In ApiLink: set kind="interface"';
    return 'In ApiLink: verify type/member — may need exclude="Platform"';
}

// Main

// 1. Discover platform folders
let platformFolders;
try {
    platformFolders = readdirSync(DIST_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name)
        .filter(name => {
            if (!PLATFORM) return Object.hasOwn(FOLDER_LABELS, name);
            return name === PLATFORM || name === `${PLATFORM}-jp`;
        });
} catch {
    console.error(`Cannot read dist directory: "${DIST_DIR}"`);
    console.error('Run a staging build first, or pass --dist=<path>.');
    process.exit(1);
}

if (platformFolders.length === 0) {
    console.error(`No matching platform folders found in "${DIST_DIR}".`);
    if (PLATFORM) console.error(`  Tried: "${PLATFORM}" and "${PLATFORM}-jp"`);
    process.exit(1);
}

// 2. Scan HTML files and build URL → { pages, platforms } index
console.log(`\nScanning "${DIST_DIR}" — platforms: ${platformFolders.join(', ')}\n`);

const urlIndex = new Map(); // url → { pages: Set<relPath>, platforms: Set<label> }
let totalFiles = 0;

for (const folder of platformFolders) {
    const label = FOLDER_LABELS[folder] ?? folder;
    const htmlFiles = walkHtml(join(DIST_DIR, folder));
    totalFiles += htmlFiles.length;
    for (const file of htmlFiles) {
        const relPath = relative(DIST_DIR, file).replace(/\\/g, '/');
        for (const url of extractLinks(file)) {
            if (!urlIndex.has(url)) urlIndex.set(url, { pages: new Set(), platforms: new Set() });
            urlIndex.get(url).pages.add(relPath);
            urlIndex.get(url).platforms.add(label);
        }
    }
}

const uniqueUrls = [...urlIndex.keys()].sort();
console.log(`  HTML files scanned : ${totalFiles}`);
console.log(`  Unique staging URLs: ${uniqueUrls.length}`);
console.log(`  Concurrency        : ${CONCURRENCY}`);
console.log(`  Timeout / request  : ${TIMEOUT_MS} ms\n`);

if (uniqueUrls.length === 0) {
    console.log('No staging API links found. Nothing to check.');
    process.exit(0);
}

// 3. Auto-discover per-package versions by probing each package root
const versionMap = await discoverVersions(uniqueUrls);


// 4. Check all URLs
const startTime = Date.now();
const checkResults = await checkAll(uniqueUrls, versionMap, CONCURRENCY, (_r, done, total) => {
    const pct = ((done / total) * 100).toFixed(1);
    process.stdout.write(`\r  Checking... ${done}/${total} (${pct}%)   `);
});
process.stdout.write('\n');
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`  Completed in ${elapsed}s\n`);

// 4b. Variant checking — probe alternative URLs for each broken link
const distVariantSet = new Set();
const distVariantMeta = [];
for (const result of checkResults) {
    if (result.ok) continue;
    const variants = resolveDistVariants(result.url);
    for (const vUrl of Object.values(variants)) distVariantSet.add(vUrl.split('#')[0]);
    distVariantMeta.push({ url: result.url, variants });
}
const distVariantOkMap = new Map();
if (distVariantSet.size > 0) {
    process.stdout.write('  Probing ' + distVariantSet.size + ' variant URL(s) for fix hints...\n');
    const vRes = await checkAll([...distVariantSet], versionMap, CONCURRENCY, () => {});
    for (const r of vRes) distVariantOkMap.set(r.url.split('#')[0], r.ok);
}
const distSuggestionMap = new Map();
for (const { url, variants } of distVariantMeta) {
    const variantOk = {};
    for (const [name, vUrl] of Object.entries(variants)) {
        variantOk[name] = distVariantOkMap.get(vUrl.split('#')[0]) ?? false;
    }
    distSuggestionMap.set(url, { variants, variantOk, hint: suggestDistFix(variantOk) });
}

// 5. Organize results
const okResults     = checkResults.filter(r => r.ok);
const brokenResults = checkResults.filter(r => !r.ok);
const softResults   = brokenResults.filter(r => r.status === 'NOT_FOUND');
const hardResults   = brokenResults.filter(r => r.status !== 'NOT_FOUND');

const brokenByPlatform = new Map(
    platformFolders.map(f => [FOLDER_LABELS[f] ?? f, []])
);
for (const result of brokenResults) {
    const meta = urlIndex.get(result.url);
    for (const platform of meta.platforms) {
        brokenByPlatform.get(platform)?.push({
            url: result.url,
            fetchUrl: result.fetchUrl,
            status: result.status ?? result.error,
            pages: [...meta.pages],
        });
    }
}

// 6. Print report
const HR  = '═'.repeat(72);
const HR2 = '─'.repeat(72);
console.log(HR);
console.log('  API LINK CHECK REPORT');
console.log(HR);
console.log(`  ✓  OK              : ${okResults.length}`);
console.log(`  ✗  Not found       : ${softResults.length}  ← type/member missing (HTTP 200 + 404 body)`);
console.log(`  ✗  HTTP error      : ${hardResults.length}`);
console.log(`  ✗  Total broken    : ${brokenResults.length}`);
console.log(HR2);

if (brokenResults.length === 0) {
    console.log('\n  All staging API links are reachable.\n');
} else {
    for (const [platform, items] of brokenByPlatform) {
        if (items.length === 0) continue;
        const unique = [...new Map(items.map(i => [i.url, i])).values()];
        console.log(`\n  ${platform}  —  ${unique.length} broken link${unique.length === 1 ? '' : 's'}\n`);
        for (const item of unique) {
            const tag = item.status === 'NOT_FOUND'
                ? '[NOT FOUND — type/member missing]'
                : `[HTTP ${item.status ?? item.error}]`;
            console.log(`    ✗ ${tag}`);
            console.log(`      ${item.url}`);
            if (item.fetchUrl !== item.url) {
                console.log(`      checked as: ${item.fetchUrl}`);
            }
            const sug = distSuggestionMap.get(item.url);
            if (sug) {
                for (const [name, vUrl] of Object.entries(sug.variants)) {
                    const ok = sug.variantOk[name];
                    const lbl = name === 'noSuffix' ? 'no-suffix' : name === 'interfacesNoSuffix' ? 'interfaces+no-suffix' : 'interfaces';
                    console.log('      ' + (ok ? '\u2713' : '\u2717') + ' ' + lbl + ': ' + vUrl);
                }
                console.log('      \u2192 FIX: ' + sug.hint);
            }
            const pages = item.pages.filter(p => p.startsWith(platform.toLowerCase().split(' ')[0]));
            const display = pages.length ? pages : item.pages;
            for (const page of display.slice(0, 3)) {
                console.log(`           in: ${page}`);
            }
            if (display.length > 3) {
                console.log(`           ... and ${display.length - 3} more page(s)`);
            }
        }
    }
    console.log('');
}

console.log(HR);

// 7. Optional JSON report
if (OUTPUT) {
    const report = {
        generatedAt: new Date().toISOString(),
        distDir: DIST_DIR,
        platforms: platformFolders,
        resolvedVersions: Object.fromEntries(versionMap),
        totalFiles,
        uniqueUrls: uniqueUrls.length,
        ok: okResults.length,
        broken: brokenResults.length,
        brokenNotFound: softResults.length,
        brokenHttp: hardResults.length,
        results: checkResults.map(r => {
            const sug = r.ok ? undefined : distSuggestionMap.get(r.url);
            return {
                url: r.url,
                fetchUrl: r.fetchUrl,
                status: r.status ?? null,
                error: r.error ?? null,
                ok: r.ok,
                pages: [...(urlIndex.get(r.url)?.pages ?? [])],
                platforms: [...(urlIndex.get(r.url)?.platforms ?? [])],
                ...(sug ? { hint: sug.hint, variantOk: sug.variantOk } : {}),
            };
        }),
    };
    writeFileSync(OUTPUT, JSON.stringify(report, null, 2));
    console.log(`\n  JSON report written to: ${OUTPUT}\n`);
}

// 8. Optional Markdown report
if (MD_OUTPUT) {
    const lines = [];
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    lines.push(`# API Link Check Report`);
    lines.push(`\n_Generated: ${ts}_\n`);
    lines.push(`## Summary\n`);
    lines.push(`| | |`);
    lines.push(`|---|---|`);
    lines.push(`| ✅ OK | ${okResults.length} |`);
    lines.push(`| ❌ Not found (type/member missing) | ${softResults.length} |`);
    lines.push(`| ❌ HTTP error | ${hardResults.length} |`);
    lines.push(`| ❌ **Total broken** | **${brokenResults.length}** |`);
    lines.push(``);

    for (const [platform, items] of brokenByPlatform) {
        if (items.length === 0) continue;
        const unique = [...new Map(items.map(i => [i.url, i])).values()];
        const platformPrefix = platform.toLowerCase().split(' ')[0];
        lines.push(`## ${platform} — ${unique.length} broken link${unique.length === 1 ? '' : 's'}\n`);

        // Group by page
        const byPage = new Map();
        for (const item of items) {
            const pages = item.pages.filter(p => p.startsWith(platformPrefix));
            const display = pages.length ? pages : item.pages;
            for (const page of display) {
                if (!byPage.has(page)) byPage.set(page, []);
                byPage.get(page).push(item);
            }
        }

        lines.push(`### By URL\n`);
        for (const item of unique) {
            const tag = item.status === 'NOT_FOUND' ? 'NOT FOUND — type/member missing' : `HTTP ${item.status ?? item.error}`;
            lines.push(`- ❌ \`${tag}\``);
            lines.push(`  - URL: \`${item.url}\``);
            if (item.fetchUrl !== item.url) {
                lines.push(`  - Checked as: \`${item.fetchUrl}\``);
            }
            const mdSug = distSuggestionMap.get(item.url);
            if (mdSug) {
                for (const [name, vUrl] of Object.entries(mdSug.variants)) {
                    const ok = mdSug.variantOk[name];
                    const lbl = name === 'noSuffix' ? 'no-suffix' : name === 'interfacesNoSuffix' ? 'interfaces+no-suffix' : 'interfaces';
                    lines.push('  - ' + (ok ? '\u2705' : '\u274c') + ' ' + lbl + ': `' + vUrl + '`');
                }
                lines.push('  - **FIX**: `' + mdSug.hint + '`');
            }
            const pages = item.pages.filter(p => p.startsWith(platformPrefix));
            const display = pages.length ? pages : item.pages;
            for (const page of display) {
                lines.push(`  - in: \`${page}\``);
            }
        }
        lines.push(``);

        lines.push(`### By Page\n`);
        for (const [page, pageItems] of [...byPage.entries()].sort()) {
            const pageUnique = [...new Map(pageItems.map(i => [i.url, i])).values()];
            lines.push(`#### \`${page}\` — ${pageUnique.length} broken link${pageUnique.length === 1 ? '' : 's'}\n`);
            for (const item of pageUnique) {
                lines.push(`- \`${item.url}\``);
            }
            lines.push(``);
        }
    }

    writeFileSync(MD_OUTPUT, lines.join('\n'));
    console.log(`\n  Markdown report written to: ${MD_OUTPUT}\n`);
}

process.exit(brokenResults.length > 0 ? 1 : 0);

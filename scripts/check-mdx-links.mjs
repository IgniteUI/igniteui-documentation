#!/usr/bin/env node
/**
 * Crawls MDX source files and checks every <ApiLink> component's resolved URL
 * against the staging API server.
 *
 * Parses ApiLink props directly from MDX, resolves them into staging URLs using
 * the same logic as ApiLink.astro, then validates each URL is reachable.
 *
 * When --platform=angular the script first runs docs/angular/scripts/sync-generated.mjs
 * to pull in generated xplat content, then scans docs/angular/src/content.
 * Pass --no-sync to skip the pre-sync step.
 *
 * Usage:
 *   node --experimental-strip-types scripts/check-mdx-links.mjs
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --platform=react
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --platform=angular
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --platform=angular --no-sync
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --platform=angular --md=report.md
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --concurrency=20
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --timeout=15000
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --output=report.json
 *
 * Exit code: 0 = all OK, 1 = broken links found.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// CLI args
const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => {
            const [k, ...rest] = a.slice(2).split('=');
            return [k, rest.length ? rest.join('=') : true];
        })
);

const PLATFORM    = args.platform ? String(args.platform) : null;
const CONCURRENCY = parseInt(String(args.concurrency ?? '20'), 10);
const TIMEOUT_MS  = parseInt(String(args.timeout     ?? '15000'), 10);
const OUTPUT      = args.output ? String(args.output) : null;
const MD_OUTPUT   = args.md     ? String(args.md)     : null;
const NO_SYNC     = !!args['no-sync'];
const DEFAULT_SRC = (PLATFORM === 'angular') ? 'docs/angular/src/content' : 'docs/xplat/src/content';
const SRC_DIR     = String(args.src ?? DEFAULT_SRC);

// Platform resolution
const PLATFORM_MAP = {
    angular: 'Angular',
    react:   'React',
    wc:      'WebComponents',
    blazor:  'Blazor',
};

function getPlatforms() {
    if (PLATFORM) {
        const name = PLATFORM_MAP[PLATFORM];
        if (!name) {
            console.error(`Unknown platform "${PLATFORM}". Use: angular, react, wc, blazor`);
            process.exit(1);
        }
        return [name];
    }
    return Object.values(PLATFORM_MAP);
}

// Parse PLATFORMS from platform-context.ts directly
function parsePlatformConfigs() {
    const srcPath = resolve('src/lib/platform-context.ts');
    const src = readFileSync(srcPath, 'utf-8');

    const match = src.match(/const PLATFORMS[^=]*=\s*\{/);
    if (!match) throw new Error('Cannot find PLATFORMS in platform-context.ts');

    const startIdx = src.indexOf(match[0]) + match[0].length - 1;
    let depth = 1;
    let i = startIdx + 1;
    while (i < src.length && depth > 0) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') depth--;
        i++;
    }
    let objStr = src.slice(startIdx, i);

    // Strip TypeScript syntax
    objStr = objStr
        .replace(/as\s+PlatformName(\s*\|[^,}\n]+)?/g, '')
        .replace(/as\s+Record<[^>]+>/g, '')
        .replace(/:\s*Record<PlatformName,\s*PlatformContext>/g, '');

    const fn = new Function(`return (${objStr});`);
    return fn();
}

const PLATFORMS = parsePlatformConfigs();

// ApiLink URL resolution (mirrors ApiLink.astro logic)
const KIND_SEGMENT = {
    class:     'classes',
    interface: 'interfaces',
    enum:      'enums',
    type:      'types',
    variable:  'variables',
    function:  'functions',
};

function resolveApiLinkUrl(props, platformName) {
    const config = PLATFORMS[platformName];
    if (!config) return null;

    const {
        type, kind = 'class', member, pkg = 'core',
        prefixed = true, suffix = true,
        excludeSuffixFor, excludePrefixFor,
    } = props;
    const prefix = config.prefix;
    const pkgConfig = config.apiPackages[pkg] ?? config.apiPackages['core'];
    if (!pkgConfig) return null;

    const splitList = (v) => v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : [];
    const effectivePrefixed = prefixed && !splitList(excludePrefixFor).includes(platformName);
    const effectiveSuffix   = suffix   && !splitList(excludeSuffixFor).includes(platformName);

    const baseType = effectivePrefixed ? `${prefix}${type}` : type;
    const segment = KIND_SEGMENT[kind];
    if (!segment) return null;

    let url;
    if (kind === 'class') {
        const fullType = (effectiveSuffix && pkgConfig.classSuffix) ? `${baseType}${pkgConfig.classSuffix}` : baseType;
        const cased = pkgConfig.preserveCase ? fullType : fullType.toLowerCase();
        const classSlug = pkgConfig.noPackagePrefix ? cased : `${pkgConfig.packageId}.${cased}`;
        const memberAnchor = member
            ? `#${pkgConfig.pascalCaseMembers ? member.charAt(0).toUpperCase() + member.slice(1) : member}`
            : '';
        url = `${pkgConfig.docRoot}/classes/${classSlug}${memberAnchor}`;
    } else {
        const slug = pkgConfig.noPackagePrefix ? baseType : `${pkgConfig.packageId}.${baseType}`;
        const memberAnchorNonClass = member
            ? `#${
                kind === 'enum'
                    ? member
                    : pkgConfig.pascalCaseMembers
                        ? member.charAt(0).toUpperCase() + member.slice(1)
                        : member.toLowerCase()
            }`
            : '';
        url = `${pkgConfig.docRoot}/${segment}/${slug}${memberAnchorNonClass}`;
    }
    return url;
}

/**
 * Given a BROKEN primary URL and its source props, returns up to 3 alternative
 * URLs to try (no-suffix, no-prefix, no-both). Only includes variants that differ
 * from the primary URL (i.e. where there is something to strip).
 *
 * Used post-check to suggest the cheapest prop fix:
 *   noSuffix → excludeSuffixFor="Platform"
 *   noPrefix → excludePrefixFor="Platform"  (or prefixed={false} when global)
 *   noBoth   → both of the above
 */
function resolveVariantUrls(primaryUrl, props, platformName) {
    const variants = {};
    // no-suffix: disable classSuffix for this platform
    const noSuffixUrl = resolveApiLinkUrl(
        { ...props, suffix: false, excludeSuffixFor: undefined }, platformName);
    if (noSuffixUrl && noSuffixUrl !== primaryUrl)
        variants.noSuffix = noSuffixUrl;

    // no-prefix: disable platform prefix for this platform
    const noPrefixUrl = resolveApiLinkUrl(
        { ...props, prefixed: false, excludePrefixFor: undefined }, platformName);
    if (noPrefixUrl && noPrefixUrl !== primaryUrl)
        variants.noPrefix = noPrefixUrl;

    // no-both: disable both
    const noBothUrl = resolveApiLinkUrl(
        { ...props, suffix: false, prefixed: false, excludeSuffixFor: undefined, excludePrefixFor: undefined },
        platformName);
    if (noBothUrl && noBothUrl !== primaryUrl
            && noBothUrl !== variants.noSuffix && noBothUrl !== variants.noPrefix)
        variants.noBoth = noBothUrl;

    return variants;
}

/** Given which variant URLs work, returns a short prop-fix hint string. */
function suggestFix(variantOk, platformName) {
    const { noSuffix, noPrefix, noBoth } = variantOk ?? {};
    if (noSuffix && !noPrefix) return `excludeSuffixFor="${platformName}"`;
    if (!noSuffix && noPrefix) return `excludePrefixFor="${platformName}" (or prefixed={false} globally)`;
    if (noSuffix && noPrefix)  return `excludeSuffixFor="${platformName}" -or- excludePrefixFor="${platformName}"`;
    if (noBoth)                return `excludeSuffixFor="${platformName}" + excludePrefixFor="${platformName}"`;
    return `exclude="${platformName}" (no variant resolves — symbol absent)`;
}

// MDX parsing

/** Regex to match <ApiLink ... /> or <ApiLink ...>...</ApiLink> */
const API_LINK_RE = /<ApiLink\s+([^>]*?)\/?>(?:<\/ApiLink>)?/g;

/** Regex to match <PlatformBlock for="...">...</PlatformBlock> including nested content */
const PLATFORM_BLOCK_RE = /<PlatformBlock\s+for="([^"]+)">([\s\S]*?)<\/PlatformBlock>/g;

/** Parses JSX-style props from a string like `pkg="charts" type="CategoryChart" kind="enum" prefixed={false}` */
function parseProps(propsStr) {
    const props = {};
    const PROP_RE = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|{([^}]*)})/g;
    let m;
    while ((m = PROP_RE.exec(propsStr)) !== null) {
        const [, name, strVal, singleVal, exprVal] = m;
        if (strVal !== undefined) {
            props[name] = strVal;
        } else if (singleVal !== undefined) {
            props[name] = singleVal;
        } else if (exprVal !== undefined) {
            if (exprVal === 'true') props[name] = true;
            else if (exprVal === 'false') props[name] = false;
            else if (/^\d+$/.test(exprVal)) props[name] = parseInt(exprVal, 10);
            else props[name] = exprVal;
        }
    }
    return props;
}

/**
 * Extracts all ApiLink occurrences from an MDX file, respecting PlatformBlock scoping.
 * Returns an array of { props, platforms } where platforms is null (all) or a Set of platform names.
 */
function extractApiLinks(content) {
    const results = [];

    // Strip MDX/JSX comments ({/* ... */}) and HTML comments (<!-- ... -->) by
    // replacing them with same-length whitespace so byte positions stay aligned.
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, m => ' '.repeat(m.length));
    content = content.replace(/<!--[\s\S]*?-->/g, m => ' '.repeat(m.length));

    // Collect PlatformBlock open/close tokens; resolve nesting via a stack so
    // an ApiLink's platform scope is the intersection of all enclosing blocks.
    const PB_OPEN_TOKEN = /<PlatformBlock\s+for="([^"]+)"\s*>/g;
    const PB_CLOSE_TOKEN = /<\/PlatformBlock>/g;
    const pbTokens = [];
    let pbTok;
    while ((pbTok = PB_OPEN_TOKEN.exec(content)) !== null) {
        const platforms = new Set(pbTok[1].split(',').map(p => p.trim()));
        pbTokens.push({ kind: 'open', pos: pbTok.index, end: pbTok.index + pbTok[0].length, platforms });
    }
    while ((pbTok = PB_CLOSE_TOKEN.exec(content)) !== null) {
        pbTokens.push({ kind: 'close', pos: pbTok.index, end: pbTok.index + pbTok[0].length });
    }
    pbTokens.sort((a, b) => a.pos - b.pos);

    const blockRanges = []; // { start, end, platforms: Set }
    const pbStack = [];
    for (const tok of pbTokens) {
        if (tok.kind === 'open') {
            pbStack.push(tok);
        } else {
            const opened = pbStack.pop();
            if (opened) {
                blockRanges.push({ start: opened.pos, end: tok.end, platforms: opened.platforms });
            }
        }
    }

    // Find all ApiLinks
    API_LINK_RE.lastIndex = 0;
    let alMatch;
    while ((alMatch = API_LINK_RE.exec(content)) !== null) {
        const pos = alMatch.index;
        const props = parseProps(alMatch[1]);
        if (!props.type) continue;

        // Skip template variables like {ComponentName} — resolved at build time
        if (/\{.*\}/.test(props.type)) continue;

        // Intersection of ALL enclosing PlatformBlock scopes (handles nesting).
        let scopedPlatforms = null;
        for (const b of blockRanges) {
            if (pos < b.start || pos >= b.end) continue;
            if (scopedPlatforms === null) {
                scopedPlatforms = new Set(b.platforms);
            } else {
                for (const p of [...scopedPlatforms]) {
                    if (!b.platforms.has(p)) scopedPlatforms.delete(p);
                }
            }
        }
        // Honor exclude="A,B" on the ApiLink itself: those platforms render a
        // code-only fallback (no link) and must not be checked.
        if (props.exclude) {
            const excluded = new Set(props.exclude.split(',').map(s => s.trim()).filter(Boolean));
            if (scopedPlatforms === null) {
                scopedPlatforms = new Set(['Angular', 'React', 'WebComponents', 'Blazor']);
            }
            for (const p of [...scopedPlatforms]) {
                if (excluded.has(p)) scopedPlatforms.delete(p);
            }
        }
        results.push({
            props,
            platforms: scopedPlatforms,
        });
    }

    return results;
}

// File walking — MDX source files only (single file or directory)
function walkMdx(dir) {
    const results = [];
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true });
    } catch {
        // dir might be a single file path
        if (dir.endsWith('.mdx')) results.push(dir);
        return results;
    }
    for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walkMdx(full));
        } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
            results.push(full);
        }
    }
    return results;
}

// Version discovery
const PKG_ROOT_RE = /^(https:\/\/staging\.infragistics\.com\/api\/[^/]+\/[^/]+\/)latest\//;

async function discoverVersions(urls) {
    const roots = new Set();
    for (const url of urls) {
        const m = url.match(PKG_ROOT_RE);
        if (m) roots.add(m[1]);
    }
    if (roots.size === 0) return new Map();

    const versionMap = new Map();
    const sampleUrl = urls.find(u => PKG_ROOT_RE.test(u))?.split('#')[0];
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

        const finalUrl = res.url ?? '';
        const redirectMatch = finalUrl.match(/\/(\d+\.\d+\.\d+)\//);
        if (redirectMatch) {
            for (const root of roots) versionMap.set(root, redirectMatch[1]);
            return versionMap;
        }

        const body = await res.text();
        const lvMatch = body.match(/const latestVersions\s*=\s*"((?:[^"\\]|\\.)*)"/);
        if (lvMatch) {
            const latestVersions = JSON.parse(lvMatch[1].replace(/\\"/g, '"'));
            for (const root of roots) {
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

function resolveLatest(url, versionMap) {
    const m = url.match(PKG_ROOT_RE);
    if (!m) return url;
    const version = versionMap.get(m[1]);
    return version ? url.replace('/latest/', `/${version}/`) : url;
}

// HTTP checking
const NOT_FOUND_MARKER = 'class="docs-breadcrumb-crumb" title="Page not found"';

async function checkUrl(url, versionMap) {
    const baseUrl = url.split('#')[0];
    const fetchUrl = resolveLatest(baseUrl, versionMap);
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

// --- Main ---

const targetPlatforms = getPlatforms();

// For Angular: sync generated MDX content into docs/angular before scanning
if (PLATFORM === 'angular' && !NO_SYNC) {
    const syncScript = resolve('docs/angular/scripts/sync-generated.mjs');
    console.log('\n  Syncing Angular generated content (sync-generated.mjs)...');
    const r = spawnSync(process.execPath, [syncScript], { stdio: 'inherit' });
    if (r.status !== 0) {
        console.error('\n  sync-generated.mjs failed — aborting.');
        process.exit(1);
    }
    console.log();
}

console.log(`\nScanning sources in "${SRC_DIR}"`);
console.log(`Platforms: ${targetPlatforms.join(', ')}\n`);

const mdxFiles = walkMdx(resolve(SRC_DIR));
if (mdxFiles.length === 0) {
    console.error(`No MDX files found in "${SRC_DIR}".`);
    process.exit(1);
}

// Build URL index: url -> { pages, platforms, propsByPlatform }
const urlIndex = new Map();
let totalLinks = 0;

for (const file of mdxFiles) {
    const relPath = relative(process.cwd(), file).replace(/\\/g, '/');
    const content = readFileSync(file, 'utf-8');
    const apiLinks = extractApiLinks(content);

    for (const { props, platforms: scopedPlatforms } of apiLinks) {
        const applicablePlatforms = scopedPlatforms
            ? targetPlatforms.filter(p => scopedPlatforms.has(p))
            : targetPlatforms;

        for (const platformName of applicablePlatforms) {
            const url = resolveApiLinkUrl(props, platformName);
            if (!url) continue;

            totalLinks++;
            if (!urlIndex.has(url)) {
                urlIndex.set(url, { pages: new Set(), platforms: new Set(), propsByPlatform: new Map() });
            }
            urlIndex.get(url).pages.add(relPath);
            urlIndex.get(url).platforms.add(platformName);
            // Store props once per platform so we can generate variant URLs later
            if (!urlIndex.get(url).propsByPlatform.has(platformName)) {
                urlIndex.get(url).propsByPlatform.set(platformName, props);
            }
        }
    }
}

const uniqueUrls = [...urlIndex.keys()].sort();
console.log(`  MDX files scanned  : ${mdxFiles.length}`);
console.log(`  Total ApiLink refs : ${totalLinks}`);
console.log(`  Unique staging URLs: ${uniqueUrls.length}`);
console.log(`  Concurrency        : ${CONCURRENCY}`);
console.log(`  Timeout / request  : ${TIMEOUT_MS} ms\n`);

if (uniqueUrls.length === 0) {
    console.log('No staging API links resolved. Nothing to check.');
    process.exit(0);
}

// Discover versions
const versionMap = await discoverVersions(uniqueUrls);

// Check all URLs
const startTime = Date.now();
const checkResults = await checkAll(uniqueUrls, versionMap, CONCURRENCY, (_r, done, total) => {
    const pct = ((done / total) * 100).toFixed(1);
    process.stdout.write(`\r  Checking... ${done}/${total} (${pct}%)   `);
});
process.stdout.write('\n');
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`  Completed in ${elapsed}s\n`);

// Organize results
const okResults     = checkResults.filter(r => r.ok);
const brokenResults = checkResults.filter(r => !r.ok);
const softResults   = brokenResults.filter(r => r.status === 'NOT_FOUND');
const hardResults   = brokenResults.filter(r => r.status !== 'NOT_FOUND');

const brokenByPlatform = new Map(
    targetPlatforms.map(p => [p, []])
);
for (const result of brokenResults) {
    const meta = urlIndex.get(result.url);
    for (const platform of meta.platforms) {
        if (brokenByPlatform.has(platform)) {
            brokenByPlatform.get(platform).push({
                url: result.url,
                fetchUrl: result.fetchUrl,
                status: result.status ?? result.error,
                pages: [...meta.pages],
            });
        }
    }
}

// ── Variant URL checking (post-primary-check) ──────────────────────────────
// For every broken (url, platform) pair, compute up to 3 variant URLs and
// batch-check them, then build a suggestion map used in the report.

const variantUrlSet = new Set();

// Collect all variant base-URLs that we need to probe
const brokenVariantMeta = [];  // { url, platformName, primaryFetchUrl, variants }
for (const result of brokenResults) {
    const meta = urlIndex.get(result.url);
    for (const platformName of meta.platforms) {
        if (!brokenByPlatform.has(platformName)) continue;
        const props = meta.propsByPlatform.get(platformName);
        if (!props) continue;
        const variants = resolveVariantUrls(result.url, props, platformName);
        for (const vUrl of Object.values(variants)) {
            variantUrlSet.add(vUrl.split('#')[0]);
        }
        brokenVariantMeta.push({ url: result.url, platformName, variants });
    }
}

// Probe all unique variant base-URLs
const variantOkMap = new Map(); // base-url -> boolean
if (variantUrlSet.size > 0) {
    process.stdout.write(`  Probing ${variantUrlSet.size} variant URL(s) for fix hints...\n`);
    const vRes = await checkAll([...variantUrlSet], versionMap, CONCURRENCY, () => {});
    for (const r of vRes) variantOkMap.set(r.url.split('#')[0], r.ok);
}

// Build suggestion lookup: "${url}::${platform}" -> { variants, variantOk, hint }
const suggestionMap = new Map();
for (const { url, platformName, variants } of brokenVariantMeta) {
    const variantOk = {};
    for (const [name, vUrl] of Object.entries(variants)) {
        variantOk[name] = variantOkMap.get(vUrl.split('#')[0]) ?? false;
    }
    const hint = suggestFix(variantOk, platformName);
    suggestionMap.set(`${url}::${platformName}`, { variants, variantOk, hint });
}
// ─────────────────────────────────────────────────────────────────────────────

// Print report
const HR  = '\u2550'.repeat(72);
const HR2 = '\u2500'.repeat(72);
console.log(HR);
console.log('  API LINK CHECK REPORT (MDX source)');
console.log(HR);
console.log(`  \u2713  OK              : ${okResults.length}`);
console.log(`  \u2717  Not found       : ${softResults.length}  \u2190 type/member missing (HTTP 200 + 404 body)`);
console.log(`  \u2717  HTTP error      : ${hardResults.length}`);
console.log(`  \u2717  Total broken    : ${brokenResults.length}`);
console.log(HR2);

if (brokenResults.length === 0) {
    console.log('\n  All staging API links are reachable.\n');
} else {
    for (const [platform, items] of brokenByPlatform) {
        if (items.length === 0) continue;
        const unique = [...new Map(items.map(i => [i.url, i])).values()];
        console.log(`\n  ${platform}  \u2014  ${unique.length} broken link${unique.length === 1 ? '' : 's'}\n`);
        for (const item of unique) {
            const tag = item.status === 'NOT_FOUND'
                ? '[NOT FOUND \u2014 type/member missing]'
                : `[HTTP ${item.status ?? item.error}]`;
            console.log(`    \u2717 ${tag}`);
            console.log(`      ${item.url}`);
            if (item.fetchUrl !== item.url) {
                console.log(`      checked as: ${item.fetchUrl}`);
            }
            // Variant hints
            const sug = suggestionMap.get(`${item.url}::${platform}`);
            if (sug) {
                const TICK = '\u2713', CROSS = '\u2717';
                for (const [name, vUrl] of Object.entries(sug.variants)) {
                    const ok = sug.variantOk[name];
                    const label = name === 'noSuffix' ? 'no-suffix' : name === 'noPrefix' ? 'no-prefix' : 'no-suffix+prefix';
                    console.log(`      ${ok ? TICK : CROSS} ${label}: ${vUrl}`);
                }
                console.log(`      \u2192 FIX: ${sug.hint}`);
            }
            for (const page of item.pages.slice(0, 3)) {
                console.log(`           in: ${page}`);
            }
            if (item.pages.length > 3) {
                console.log(`           ... and ${item.pages.length - 3} more page(s)`);
            }
        }
    }
    console.log('');
}

console.log(HR);

// Optional JSON report
if (OUTPUT) {
    const report = {
        generatedAt: new Date().toISOString(),
        srcDir: SRC_DIR,
        platforms: targetPlatforms,
        resolvedVersions: Object.fromEntries(versionMap),
        totalFiles: mdxFiles.length,
        totalLinks,
        uniqueUrls: uniqueUrls.length,
        ok: okResults.length,
        broken: brokenResults.length,
        brokenNotFound: softResults.length,
        brokenHttp: hardResults.length,
        results: checkResults.map(r => {
            const meta = urlIndex.get(r.url);
            const suggestions = r.ok ? undefined : Object.fromEntries(
                [...(meta?.platforms ?? [])].map(p => {
                    const s = suggestionMap.get(`${r.url}::${p}`);
                    return [p, s ? { hint: s.hint, variantOk: s.variantOk } : { hint: `exclude="${p}"` }];
                })
            );
            return {
                url: r.url,
                fetchUrl: r.fetchUrl,
                status: r.status ?? null,
                error: r.error ?? null,
                ok: r.ok,
                pages: [...(meta?.pages ?? [])],
                platforms: [...(meta?.platforms ?? [])],
                ...(suggestions ? { suggestions } : {}),
            };
        }),
    };
    writeFileSync(OUTPUT, JSON.stringify(report, null, 2));
    console.log(`\n  JSON report written to: ${OUTPUT}\n`);
}

// Optional Markdown report
if (MD_OUTPUT) {
    const lines = [];
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    lines.push(`# API Link Check Report`);
    lines.push(`\n_Generated: ${ts}_\n`);
    lines.push(`## Summary\n`);
    lines.push(`| | |`);
    lines.push(`|---|---|`);
    lines.push(`| \u2705 OK | ${okResults.length} |`);
    lines.push(`| \u274c Not found (type/member missing) | ${softResults.length} |`);
    lines.push(`| \u274c HTTP error | ${hardResults.length} |`);
    lines.push(`| \u274c **Total broken** | **${brokenResults.length}** |`);
    lines.push(``);

    for (const [platform, items] of brokenByPlatform) {
        if (items.length === 0) continue;
        const unique = [...new Map(items.map(i => [i.url, i])).values()];
        lines.push(`## ${platform} \u2014 ${unique.length} broken link${unique.length === 1 ? '' : 's'}\n`);

        // Group by page
        const byPage = new Map();
        for (const item of items) {
            for (const page of item.pages) {
                if (!byPage.has(page)) byPage.set(page, []);
                byPage.get(page).push(item);
            }
        }

        lines.push(`### By URL\n`);
        for (const item of unique) {
            const tag = item.status === 'NOT_FOUND' ? 'NOT FOUND \u2014 type/member missing' : `HTTP ${item.status ?? item.error}`;
            lines.push(`- \u274c \`${tag}\``);
            lines.push(`  - URL: \`${item.url}\``);
            if (item.fetchUrl !== item.url) {
                lines.push(`  - Checked as: \`${item.fetchUrl}\``);
            }
            const mdSug = suggestionMap.get(`${item.url}::${platform}`);
            if (mdSug) {
                const TICK = '\u2705', CROSS = '\u274c';
                for (const [name, vUrl] of Object.entries(mdSug.variants)) {
                    const ok = mdSug.variantOk[name];
                    const label = name === 'noSuffix' ? 'no-suffix' : name === 'noPrefix' ? 'no-prefix' : 'no-suffix+prefix';
                    lines.push(`  - ${ok ? TICK : CROSS} ${label}: \`${vUrl}\``);
                }
                lines.push(`  - **FIX**: \`${mdSug.hint}\``);
            }
            for (const page of item.pages) {
                lines.push(`  - in: \`${page}\``);
            }
        }
        lines.push(``);

        lines.push(`### By Page\n`);
        for (const [page, pageItems] of [...byPage.entries()].sort()) {
            const pageUnique = [...new Map(pageItems.map(i => [i.url, i])).values()];
            lines.push(`#### \`${page}\` \u2014 ${pageUnique.length} broken link${pageUnique.length === 1 ? '' : 's'}\n`);
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

#!/usr/bin/env node
/**
 * Crawls MDX source files and checks every <ApiLink> component's resolved URL.
 *
 * Parses ApiLink props directly from MDX, resolves them through the local
 * api-link-index registry, then validates each URL is reachable.
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

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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
const RESOLVE_ONLY = !!args['resolve-only'];
const DEFAULT_SRC = (PLATFORM === 'angular') ? 'docs/angular/src/content' : 'docs/xplat/src/content';
const SRC_DIR     = String(args.src ?? DEFAULT_SRC);
const API_LINK_INDEX_VERSION = String(args.index ?? process.env.API_LINK_INDEX_VERSION ?? (process.env.NODE_ENV === 'production' ? 'prod-latest' : 'staging-latest'));

// Platform resolution
const PLATFORM_MAP = {
    angular: 'Angular',
    react:   'React',
    wc:      'WebComponents',
    blazor:  'Blazor',
};

const PLATFORM_CONFIGS = {
    Angular:       { folder: 'angular',       prefix: 'Igx', classSuffix: 'Component' },
    React:         { folder: 'react',         prefix: 'Igr' },
    WebComponents: { folder: 'webcomponents', prefix: 'Igc', classSuffix: 'Component' },
    Blazor:        { folder: 'blazor',        prefix: 'Igb', pascalCaseMembers: true },
};

const PACKAGE_IDS = {
    Angular: {
        core: 'igniteui-angular',
        charts: 'igniteui-angular-charts',
        grids: 'igniteui-angular',
        gauges: 'igniteui-angular-gauges',
        maps: 'igniteui-angular-maps',
        inputs: 'igniteui-angular',
        layouts: 'igniteui-angular',
        excel: 'igniteui-angular-excel',
        spreadsheet: 'igniteui-angular-spreadsheet',
        datasources: 'igniteui-angular-datasources',
        dashboards: 'igniteui-angular-dashboards',
    },
    React: {
        core: 'igniteui-react',
        charts: 'igniteui-react-charts',
        grids: 'igniteui-react-grids',
        gauges: 'igniteui-react-gauges',
        maps: 'igniteui-react-maps',
        inputs: 'igniteui-react-inputs',
        layouts: 'igniteui-react-layouts',
        excel: 'igniteui-react-excel',
        spreadsheet: 'igniteui-react-spreadsheet',
        datasources: 'igniteui-react-datasources',
        dashboards: 'igniteui-react-dashboards',
        dockmanager: 'igniteui-react-dockmanager',
    },
    WebComponents: {
        core: 'igniteui-webcomponents',
        charts: 'igniteui-webcomponents-charts',
        grids: 'igniteui-webcomponents-grids',
        gauges: 'igniteui-webcomponents-gauges',
        maps: 'igniteui-webcomponents-maps',
        inputs: 'igniteui-webcomponents-inputs',
        layouts: 'igniteui-webcomponents-layouts',
        excel: 'igniteui-webcomponents-excel',
        spreadsheet: 'igniteui-webcomponents-spreadsheet',
        datasources: 'igniteui-webcomponents-datasources',
        dashboards: 'igniteui-webcomponents-dashboards',
        dockmanager: 'igniteui-dockmanager',
        gridlite: 'igniteui-grid-lite',
        'grid-lite': 'igniteui-grid-lite',
    },
    Blazor: {
        core: 'IgniteUI.Blazor',
        charts: 'IgniteUI.Blazor',
        grids: 'IgniteUI.Blazor',
        gauges: 'IgniteUI.Blazor',
        maps: 'IgniteUI.Blazor',
        inputs: 'IgniteUI.Blazor',
        layouts: 'IgniteUI.Blazor',
        excel: 'IgniteUI.Blazor.Documents.Excel',
        spreadsheet: 'IgniteUI.Blazor',
        datasources: 'IgniteUI.Blazor',
        dashboards: 'IgniteUI.Blazor',
        gridlite: 'IgniteUI.Blazor.GridLite',
        'grid-lite': 'IgniteUI.Blazor.GridLite',
    },
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

const upperFirst = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
const splitList = (value) => value ? String(value).split(',').map(item => item.trim()).filter(Boolean) : [];
const addUnique = (values, value) => {
    if (value && !values.includes(value)) values.push(value);
};

function getApiDocsBaseUrl() {
    const value = process.env.API_DOCS_BASE_URL
        ?? (process.env.NODE_ENV === 'production'
            ? 'https://www.infragistics.com/api'
            : 'https://staging.infragistics.com/api');
    const trimmed = value.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

function loadApiLinkIndexes() {
    return Object.fromEntries(Object.entries(PLATFORM_CONFIGS).map(([platformName, config]) => {
        const file = resolve('src', 'data', 'api-link-index', config.folder, `${API_LINK_INDEX_VERSION}.json`);
        if (!existsSync(file)) return [platformName, null];
        return [platformName, JSON.parse(readFileSync(file, 'utf-8'))];
    }));
}

const API_LINK_INDEXES = loadApiLinkIndexes();
const API_DOCS_ORIGIN = new URL(getApiDocsBaseUrl()).origin;

function candidateNames(props, platformName) {
    const platform = PLATFORM_CONFIGS[platformName];
    const explicitKind = props.kind;
    const prefixed = props.prefixed !== false && !splitList(props.excludePrefixFor).includes(platformName);
    const suffix = props.suffix !== false && !splitList(props.excludeSuffixFor).includes(platformName);
    const bases = [];
    if (prefixed) addUnique(bases, `${platform.prefix}${props.type}`);
    addUnique(bases, props.type);

    const names = [];
    for (const base of bases) {
        if ((!explicitKind || explicitKind === 'class') && suffix && platform.classSuffix) {
            addUnique(names, `${base}${platform.classSuffix}`);
        }
        addUnique(names, base);
    }
    return names;
}

function resolveApiLink(props, platformName) {
    const index = API_LINK_INDEXES[platformName];
    if (!index?.symbols) return { status: 'unavailable' };
    if (!props.type) return { status: 'missing-type' };
    if (props.type.includes('{')) return { status: 'dynamic' };
    if (props.kind === 'sass') return { status: 'sass' };
    if (splitList(props.exclude).includes(platformName)) return { status: 'excluded' };

    const explicitPkg = typeof props.pkg === 'string' && props.pkg.length > 0;
    const packageId = explicitPkg ? PACKAGE_IDS[platformName]?.[props.pkg] : undefined;
    if (explicitPkg && !packageId) return { status: 'unknown-package' };
    const platform = PLATFORM_CONFIGS[platformName];
    let matchedSymbol = false;

    for (const name of candidateNames(props, platformName)) {
        const value = index.symbols[name];
        if (!value) continue;
        const symbols = Array.isArray(value) ? value : [value];
        for (const symbol of symbols) {
            if (packageId && symbol.p && symbol.p !== packageId) continue;
            if (props.kind && symbol.k && symbol.k !== props.kind) continue;
            matchedSymbol = true;
            const anchor = resolveMemberAnchor(symbol, props.member, platform);
            if (anchor === null) continue;
            const path = `${symbol.u}${anchor ? `#${anchor}` : ''}`;
            return { status: 'resolved', url: path.startsWith('/') ? `${API_DOCS_ORIGIN}${path}` : path };
        }
    }
    return { status: matchedSymbol ? 'member-missing' : 'missing' };
}

function resolveApiLinkUrl(props, platformName) {
    const resolved = resolveApiLink(props, platformName);
    return resolved.status === 'resolved' ? resolved.url : null;
}

function resolveMemberAnchor(symbol, member, platform) {
    if (!member) return '';
    const members = symbol.m ?? {};
    const candidates = [member];
    if (platform.pascalCaseMembers) candidates.push(upperFirst(member));
    candidates.push(upperFirst(member), member.toLowerCase());
    for (const candidate of [...new Set(candidates)]) {
        if (members[candidate]) return members[candidate];
    }
    return null;
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
const PKG_ROOT_RE = /^(https?:\/\/[^/]+\/api\/[^/]+\/[^/]+\/)latest\//;

/**
 * Discovers the actual published version for each unique package root by
 * following the /latest/ redirect independently per package.
 * Each package (igniteui-react, igniteui-react-grids, igniteui-react-charts, …)
 * may be at a different version, so we must NOT share a single resolved version
 * across all packages.
 */
async function discoverVersions(urls) {
    // Map each root → first sample URL for that root
    const rootSamples = new Map();
    for (const url of urls) {
        const m = url.match(PKG_ROOT_RE);
        if (m && !rootSamples.has(m[1])) rootSamples.set(m[1], url.split('#')[0]);
    }
    if (rootSamples.size === 0) return new Map();

    const versionMap = new Map();

    await Promise.all([...rootSamples.entries()].map(async ([root, sampleUrl]) => {
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

            // Primary: extract version from the redirect destination URL
            const finalUrl = res.url ?? '';
            const redirectMatch = finalUrl.match(/\/(\d+\.\d+\.\d+)\//);
            if (redirectMatch) {
                versionMap.set(root, redirectMatch[1]);
                await res.body?.cancel();
                return;
            }

            // Fallback: parse latestVersions from the page body
            const body = await res.text();
            const lvMatch = body.match(/const latestVersions\s*=\s*"((?:[^"\\]|\\.)*)"/);
            if (lvMatch) {
                const latestVersions = JSON.parse(lvMatch[1].replace(/\\"/g, '"'));
                const pkgName = root.replace(/\/$/, '').split('/').pop();
                if (pkgName && latestVersions[pkgName]) {
                    versionMap.set(root, latestVersions[pkgName]);
                }
            }
        } catch {
            clearTimeout(timer);
        }
    }));

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
    for (const lang of ['en', 'jp']) {
        console.log(`\n  Syncing Angular generated content (sync-generated.mjs --lang=${lang})...`);
        const r = spawnSync(process.execPath, [syncScript, `--lang=${lang}`], { stdio: 'inherit' });
        if (r.status !== 0) {
            console.error(`\n  sync-generated.mjs --lang=${lang} failed — aborting.`);
            process.exit(1);
        }
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
let totalApiLinkRefs = 0;
let totalResolvedLinks = 0;
const resolutionStats = new Map(targetPlatforms.map(platform => [platform, {
    resolved: 0,
    unresolved: 0,
    reasons: new Map(),
    examples: new Map(),
}]));

function recordResolution(platformName, status, relPath, props) {
    const stats = resolutionStats.get(platformName);
    if (!stats) return;

    if (status === 'resolved') {
        stats.resolved++;
        return;
    }

    stats.unresolved++;
    stats.reasons.set(status, (stats.reasons.get(status) ?? 0) + 1);
    if (!stats.examples.has(status)) {
        const label = props.member ? `${props.type}.${props.member}` : props.type;
        stats.examples.set(status, { file: relPath, label });
    }
}

for (const file of mdxFiles) {
    const relPath = relative(process.cwd(), file).replace(/\\/g, '/');
    const content = readFileSync(file, 'utf-8');
    const apiLinks = extractApiLinks(content);

    for (const { props, platforms: scopedPlatforms } of apiLinks) {
        const applicablePlatforms = scopedPlatforms
            ? targetPlatforms.filter(p => scopedPlatforms.has(p))
            : targetPlatforms;

        for (const platformName of applicablePlatforms) {
            totalApiLinkRefs++;
            const resolved = resolveApiLink(props, platformName);
            recordResolution(platformName, resolved.status, relPath, props);
            if (resolved.status !== 'resolved') continue;

            totalResolvedLinks++;
            if (!urlIndex.has(resolved.url)) {
                urlIndex.set(resolved.url, { pages: new Set(), platforms: new Set() });
            }
            urlIndex.get(resolved.url).pages.add(relPath);
            urlIndex.get(resolved.url).platforms.add(platformName);
        }
    }
}

const uniqueUrls = [...urlIndex.keys()].sort();
console.log(`  MDX files scanned  : ${mdxFiles.length}`);
console.log(`  Total ApiLink refs : ${totalApiLinkRefs}`);
console.log(`  Resolved refs      : ${totalResolvedLinks}`);
console.log(`  Unique API URLs     : ${uniqueUrls.length}`);
console.log(`  Concurrency        : ${CONCURRENCY}`);
console.log(`  Timeout / request  : ${TIMEOUT_MS} ms\n`);

for (const [platform, stats] of resolutionStats) {
    if (stats.resolved === 0 && stats.unresolved === 0) continue;
    const reasons = [...stats.reasons.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([reason, count]) => `${reason}: ${count}`)
        .join(', ');
    console.log(`  ${platform} registry resolution: ${stats.resolved} resolved, ${stats.unresolved} not linked${reasons ? ` (${reasons})` : ''}`);
    for (const [reason, example] of [...stats.examples.entries()].slice(0, 3)) {
        console.log(`    example ${reason}: ${example.label} in ${example.file}`);
    }
}
console.log();

if (RESOLVE_ONLY) {
    if (OUTPUT) {
        const report = {
            generatedAt: new Date().toISOString(),
            srcDir: SRC_DIR,
            platforms: targetPlatforms,
            totalFiles: mdxFiles.length,
            totalLinks: totalApiLinkRefs,
            resolvedLinks: totalResolvedLinks,
            uniqueUrls: uniqueUrls.length,
            registryResolution: Object.fromEntries([...resolutionStats.entries()].map(([platform, stats]) => [
                platform,
                {
                    resolved: stats.resolved,
                    unresolved: stats.unresolved,
                    reasons: Object.fromEntries(stats.reasons),
                    examples: Object.fromEntries(stats.examples),
                },
            ])),
        };
        writeFileSync(OUTPUT, JSON.stringify(report, null, 2));
        console.log(`  JSON report written to: ${OUTPUT}\n`);
    }
    process.exit(0);
}

if (uniqueUrls.length === 0) {
    console.log('No registry API links resolved. Nothing to check.');
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
    console.log('\n  All registry API links are reachable.\n');
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
        totalLinks: totalApiLinkRefs,
        resolvedLinks: totalResolvedLinks,
        uniqueUrls: uniqueUrls.length,
        registryResolution: Object.fromEntries([...resolutionStats.entries()].map(([platform, stats]) => [
            platform,
            {
                resolved: stats.resolved,
                unresolved: stats.unresolved,
                reasons: Object.fromEntries(stats.reasons),
                examples: Object.fromEntries(stats.examples),
            },
        ])),
        ok: okResults.length,
        broken: brokenResults.length,
        brokenNotFound: softResults.length,
        brokenHttp: hardResults.length,
        results: checkResults.map(r => {
            const meta = urlIndex.get(r.url);
            return {
                url: r.url,
                fetchUrl: r.fetchUrl,
                status: r.status ?? null,
                error: r.error ?? null,
                ok: r.ok,
                pages: [...(meta?.pages ?? [])],
                platforms: [...(meta?.platforms ?? [])],
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
    lines.push(`| ApiLink refs | ${totalApiLinkRefs} |`);
    lines.push(`| Resolved refs | ${totalResolvedLinks} |`);
    lines.push(`| Unique URLs | ${uniqueUrls.length} |`);
    lines.push(`| \u2705 OK | ${okResults.length} |`);
    lines.push(`| \u274c Not found (type/member missing) | ${softResults.length} |`);
    lines.push(`| \u274c HTTP error | ${hardResults.length} |`);
    lines.push(`| \u274c **Total broken** | **${brokenResults.length}** |`);
    lines.push(``);

    lines.push(`## Registry Resolution\n`);
    for (const [platform, stats] of resolutionStats) {
        if (stats.resolved === 0 && stats.unresolved === 0) continue;
        const reasons = [...stats.reasons.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([reason, count]) => `${reason}: ${count}`)
            .join(', ');
        lines.push(`- **${platform}**: ${stats.resolved} resolved, ${stats.unresolved} not linked${reasons ? ` (${reasons})` : ''}`);
    }
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

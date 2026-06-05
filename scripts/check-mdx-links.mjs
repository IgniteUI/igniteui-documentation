#!/usr/bin/env node
/**
 * Crawls MDX source files and checks every <ApiLink> component's resolved URL.
 *
 * Parses ApiLink props directly from MDX, resolves them through the local
 * api-link-index registry, then validates each URL is reachable.
 *
 * When --platform=angular the script first runs the same xplat generation +
 * sync npm scripts used by Angular builds, then scans docs/angular/src/content.
 * When --platform=react|wc|blazor the script first runs the matching xplat
 * generation scripts, then scans raw docs/xplat/src/content filtered through
 * the platform exclusions from each language toc.json.
 * Pass --no-sync to skip the pre-scan generation/sync step.
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
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --resolve-only --list-broken
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --resolve-only --list-broken --broken-limit=50
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --resolve-only --broken-md=mdx-broken-links.md
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --resolve-only --list-unresolved
 *   node --experimental-strip-types scripts/check-mdx-links.mjs --resolve-only --ambiguity-md=api-link-ambiguity-report.md --fail-on-ambiguity
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
const UNRESOLVED_MD_OUTPUT = args['unresolved-md'] ? String(args['unresolved-md']) : null;
const AMBIGUITY_MD_OUTPUT = args['ambiguity-md'] ? String(args['ambiguity-md']) : null;
const UNRESOLVED_REASON = args['unresolved-reason'] ? String(args['unresolved-reason']) : null;
const BROKEN_MD_OUTPUT = args['broken-md'] ? String(args['broken-md']) : null;
const LIST_BROKEN = args['list-broken'] !== undefined;
const LIST_UNRESOLVED = args['list-unresolved'] !== undefined;
const LIST_AMBIGUITIES = args['list-ambiguities'] !== undefined;
const FAIL_ON_AMBIGUITY = args['fail-on-ambiguity'] !== undefined;
const BROKEN_LIMIT = parseListLimit(args['broken-limit'] ?? args['unresolved-limit'] ?? '100');
const NO_SYNC     = !!args['no-sync'];
const RESOLVE_ONLY = !!args['resolve-only'];
const DEFAULT_SRC = PLATFORM === 'angular'
    ? 'docs/angular/src/content'
    : 'docs/xplat/src/content';
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
        inputs: 'igniteui-angular-inputs',
        layouts: 'igniteui-angular',
        'geo-core': 'igniteui-angular-core',
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
        'geo-core': 'igniteui-react-core',
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
        'geo-core': 'igniteui-webcomponents-core',
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
        'geo-core': 'IgniteUI.Blazor',
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

function parseListLimit(value) {
    if (value === true || value === 'all') return Infinity;
    const parsed = parseInt(String(value), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 100;
}

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
const NPM_CLI = process.env.npm_execpath;

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
        const resolvedSymbols = [];
        for (const symbol of symbols) {
            if (packageId && symbol.p && symbol.p !== packageId) continue;
            if (props.kind && symbol.k && symbol.k !== props.kind) continue;
            matchedSymbol = true;
            const memberMatch = resolveMember(symbol, props.member, platform);
            if (memberMatch === null) continue;
            resolvedSymbols.push({ symbol, memberMatch });
        }
        if (resolvedSymbols.length > 0) {
            const { symbol, memberMatch } = resolvedSymbols[0];
            const path = `${symbol.u}${memberMatch.anchor ? `#${memberMatch.anchor}` : ''}`;
            return {
                status: 'resolved',
                url: path.startsWith('/') ? `${API_DOCS_ORIGIN}${path}` : path,
                member: memberMatch.member,
                ambiguity: resolvedSymbols.length > 1
                    ? {
                        candidate: name,
                        symbols: resolvedSymbols.map(item => item.symbol),
                    }
                    : null,
            };
        }
    }
    return { status: matchedSymbol ? 'member-missing' : 'missing' };
}

function resolveApiLinkUrl(props, platformName) {
    const resolved = resolveApiLink(props, platformName);
    return resolved.status === 'resolved' ? resolved.url : null;
}

function resolveMember(symbol, member, platform) {
    if (!member) return { member: '', anchor: '' };
    const members = symbol.m ?? {};
    const exactCandidates = [member];
    if (platform.pascalCaseMembers) exactCandidates.push(upperFirst(member));
    exactCandidates.push(upperFirst(member), member.toLowerCase());

    for (const candidate of [...new Set(exactCandidates)]) {
        if (Object.hasOwn(members, candidate)) {
            return { member: candidate, anchor: members[candidate] };
        }
    }

    const normalized = member.toLowerCase();
    for (const [registryMember, anchor] of Object.entries(members)) {
        if (registryMember.toLowerCase() === normalized) {
            return { member: registryMember, anchor };
        }
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

function normalizeTocHref(href) {
    return String(href).replace(/\.(md|mdx)$/, '').replace(/\\/g, '/');
}

function collectAllTocSlugs(nodes, slugs) {
    for (const node of nodes || []) {
        if (node.href) slugs.add(normalizeTocHref(node.href));
        if (Array.isArray(node.items)) collectAllTocSlugs(node.items, slugs);
    }
}

function collectExcludedTocSlugs(nodes, platformName, excluded = new Set()) {
    for (const node of nodes || []) {
        const isExcluded = Array.isArray(node.exclude) && node.exclude.includes(platformName);
        if (isExcluded && node.href) {
            excluded.add(normalizeTocHref(node.href));
        }
        if (Array.isArray(node.items)) {
            if (isExcluded) {
                collectAllTocSlugs(node.items, excluded);
            } else {
                collectExcludedTocSlugs(node.items, platformName, excluded);
            }
        }
    }
    return excluded;
}

function collectIncludedTocSlugs(nodes, platformName, included = new Set()) {
    for (const node of nodes || []) {
        const isExcluded = Array.isArray(node.exclude) && node.exclude.includes(platformName);
        if (!isExcluded && node.href) {
            included.add(normalizeTocHref(node.href));
        }
        if (Array.isArray(node.items) && !isExcluded) {
            collectIncludedTocSlugs(node.items, platformName, included);
        }
    }
    return included;
}

const xplatExcludedSlugCache = new Map();

function getXplatExcludedSlugs(lang, platformName) {
    const cacheKey = `${lang}|${platformName}`;
    if (xplatExcludedSlugCache.has(cacheKey)) return xplatExcludedSlugCache.get(cacheKey);

    const tocPath = resolve('docs/xplat/src/content', lang, 'toc.json');
    const excluded = new Set();
    if (existsSync(tocPath)) {
        const toc = JSON.parse(readFileSync(tocPath, 'utf-8'));
        for (const slug of collectExcludedTocSlugs(toc, platformName)) excluded.add(slug);
        for (const slug of collectIncludedTocSlugs(toc, platformName)) excluded.delete(slug);
    }
    xplatExcludedSlugCache.set(cacheKey, excluded);
    return excluded;
}

function xplatRawContentSlug(file) {
    const rel = relative(resolve('docs/xplat/src/content'), file).replace(/\\/g, '/');
    const match = rel.match(/^([^/]+)\/components\/(.+)\.mdx$/);
    if (!match) return null;
    return { lang: match[1], slug: match[2] };
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
const XPLAT_GENERATE_SCRIPTS = {
    react: [
        ['en', 'generate:react'],
        ['jp', 'generate:react:jp'],
    ],
    wc: [
        ['en', 'generate:webcomponents'],
        ['jp', 'generate:webcomponents:jp'],
    ],
    blazor: [
        ['en', 'generate:blazor'],
        ['jp', 'generate:blazor:jp'],
    ],
};

function runNpmScript(script, prefix) {
    if (NPM_CLI) {
        return spawnSync(process.execPath, [NPM_CLI, 'run', script, '--prefix', prefix], { stdio: 'inherit' });
    }
    return spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', script, '--prefix', prefix], {
        stdio: 'inherit',
        shell: process.platform === 'win32',
    });
}

function runRequiredNpmScript(script, prefix, description) {
    console.log(`\n  ${description} (${script})...`);
    const r = runNpmScript(script, prefix);
    if (r.error) {
        console.error(`\n  Failed to start npm: ${r.error.message}`);
    }
    if (r.status !== 0) {
        console.error(`\n  ${script} failed — aborting.`);
        process.exit(1);
    }
}

// For Angular: regenerate xplat Angular MDX and sync it into docs/angular before scanning
if (PLATFORM === 'angular' && !NO_SYNC) {
    const syncScripts = [
        ['en', 'sync:generated-from-xplat'],
        ['jp', 'sync:generated-from-xplat:jp'],
    ];

    for (const [lang, script] of syncScripts) {
        runRequiredNpmScript(script, 'docs/angular', `Refreshing Angular generated content (lang=${lang})`);
    }
    console.log();
}

// For xplat platform checks: generate platform-filtered MDX before scanning
if (XPLAT_GENERATE_SCRIPTS[PLATFORM] && !NO_SYNC && !args.src) {
    for (const [lang, script] of XPLAT_GENERATE_SCRIPTS[PLATFORM]) {
        runRequiredNpmScript(script, 'docs/xplat', `Generating xplat ${PLATFORM_MAP[PLATFORM]} MDX (lang=${lang})`);
    }
    console.log();
}

console.log(`\nScanning sources in "${SRC_DIR}"`);
console.log(`Platforms: ${targetPlatforms.join(', ')}\n`);

let mdxFiles = walkMdx(resolve(SRC_DIR));
if (XPLAT_GENERATE_SCRIPTS[PLATFORM] && !args.src) {
    const platformName = PLATFORM_MAP[PLATFORM];
    const beforeFilter = mdxFiles.length;
    mdxFiles = mdxFiles.filter(file => {
        const source = xplatRawContentSlug(file);
        if (!source) return true;
        return !getXplatExcludedSlugs(source.lang, platformName).has(source.slug);
    });
    console.log(`  Platform TOC filter : ${beforeFilter - mdxFiles.length} excluded MDX file(s) skipped\n`);
}
if (mdxFiles.length === 0) {
    console.error(`No MDX files found in "${SRC_DIR}".`);
    process.exit(1);
}

// Build URL index: url -> { pages, platforms, propsByPlatform }
const urlIndex = new Map();
let totalApiLinkRefs = 0;
let totalResolvedLinks = 0;
const ambiguityDetails = [];
const resolutionStats = new Map(targetPlatforms.map(platform => [platform, {
    resolved: 0,
    unresolved: 0,
    reasons: new Map(),
    examples: new Map(),
}]));
const unresolvedDetails = [];
const NON_BROKEN_UNRESOLVED_STATUSES = new Set(['dynamic', 'excluded', 'sass']);

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
    if (!UNRESOLVED_REASON || status === UNRESOLVED_REASON) {
        unresolvedDetails.push({
            platform: platformName,
            status,
            file: relPath,
            type: props.type,
            member: props.member ?? '',
            kind: props.kind ?? '',
            pkg: props.pkg ?? '',
            label: props.member ? `${props.type}.${props.member}` : props.type,
        });
    }
}

function filterUnresolvedDetails(details, { actionableOnly = false } = {}) {
    return details.filter(item => {
        if (UNRESOLVED_REASON && item.status !== UNRESOLVED_REASON) return false;
        return !actionableOnly || !NON_BROKEN_UNRESOLVED_STATUSES.has(item.status);
    });
}

function symbolLabel(symbol) {
    return [
        symbol.p ?? '',
        symbol.k ?? '',
        symbol.u ?? '',
        `${Object.keys(symbol.m ?? {}).length} member(s)`,
    ].join(' / ');
}

function escapeMdTable(value) {
    return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function groupUnresolvedDetails(details) {
    const grouped = new Map();
    for (const item of details) {
        const key = `${item.platform}|${item.status}|${item.label}|${item.pkg}|${item.kind}`;
        if (!grouped.has(key)) {
            grouped.set(key, { ...item, files: new Set() });
        }
        grouped.get(key).files.add(item.file);
    }
    return [...grouped.values()].sort((a, b) =>
        a.platform.localeCompare(b.platform)
        || a.status.localeCompare(b.status)
        || a.label.localeCompare(b.label)
    );
}

function groupAmbiguityDetails(details) {
    const grouped = new Map();
    for (const item of details) {
        const symbolKey = item.symbols.map(symbolLabel).join('\n');
        const key = `${item.platform}|${item.label}|${item.candidate}|${item.pkg}|${item.kind}|${symbolKey}`;
        if (!grouped.has(key)) {
            grouped.set(key, { ...item, files: new Set() });
        }
        grouped.get(key).files.add(item.file);
    }
    return [...grouped.values()].sort((a, b) =>
        a.platform.localeCompare(b.platform)
        || a.label.localeCompare(b.label)
        || a.candidate.localeCompare(b.candidate)
    );
}

function getRegistryDuplicateDetails() {
    const details = [];
    for (const platformName of targetPlatforms) {
        const index = API_LINK_INDEXES[platformName];
        if (!index?.symbols) continue;
        for (const [candidate, value] of Object.entries(index.symbols)) {
            if (!Array.isArray(value) || value.length < 2) continue;
            details.push({
                platform: platformName,
                candidate,
                symbols: value,
            });
        }
    }
    return details.sort((a, b) =>
        a.platform.localeCompare(b.platform)
        || a.candidate.localeCompare(b.candidate)
    );
}

function printUnresolvedList(title, details, limit) {
    const grouped = groupUnresolvedDetails(details);
    console.log(`\n${title}`);
    console.log('\u2500'.repeat(title.length));

    if (grouped.length === 0) {
        console.log('  None.\n');
        return;
    }

    const visible = grouped.slice(0, limit);
    for (const item of visible) {
        const meta = [
            item.pkg ? `pkg=${item.pkg}` : '',
            item.kind ? `kind=${item.kind}` : '',
        ].filter(Boolean).join(', ');
        console.log(`  - ${item.platform} / ${item.status}: ${item.label}${meta ? ` (${meta})` : ''}`);
        for (const file of [...item.files].sort().slice(0, 5)) {
            console.log(`      ${file}`);
        }
        if (item.files.size > 5) {
            console.log(`      ... and ${item.files.size - 5} more file(s)`);
        }
    }

    if (grouped.length > visible.length) {
        console.log(`  ... and ${grouped.length - visible.length} more grouped item(s). Use --broken-limit=all to print everything.`);
    }
    console.log('');
}

function printAmbiguityList(title, details, limit) {
    const grouped = groupAmbiguityDetails(details);
    console.log(`\n${title}`);
    console.log('\u2500'.repeat(title.length));

    if (grouped.length === 0) {
        console.log('  None.\n');
        return;
    }

    const visible = grouped.slice(0, limit);
    for (const item of visible) {
        const meta = [
            item.pkg ? `pkg=${item.pkg}` : '',
            item.kind ? `kind=${item.kind}` : '',
        ].filter(Boolean).join(', ');
        console.log(`  - ${item.platform}: ${item.label} -> ${item.candidate}${meta ? ` (${meta})` : ''}`);
        for (const symbol of item.symbols) {
            console.log(`      ${symbolLabel(symbol)}`);
        }
        for (const file of [...item.files].sort().slice(0, 5)) {
            console.log(`      in: ${file}`);
        }
        if (item.files.size > 5) {
            console.log(`      ... and ${item.files.size - 5} more file(s)`);
        }
    }

    if (grouped.length > visible.length) {
        console.log(`  ... and ${grouped.length - visible.length} more grouped item(s). Use --broken-limit=all to print everything.`);
    }
    console.log('');
}

function writeUnresolvedMarkdownReport(filePath, title, details) {
    const grouped = groupUnresolvedDetails(details);
    const lines = [];
    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`| Platform | Status | ApiLink | pkg | kind | Files |`);
    lines.push(`|---|---|---|---|---|---|`);
    for (const item of grouped) {
        const files = [...item.files].sort().map(file => `\`${file}\``).join('<br>');
        lines.push(`| ${item.platform} | ${item.status} | \`${item.label}\` | ${item.pkg || ''} | ${item.kind || ''} | ${files} |`);
    }
    writeFileSync(filePath, lines.join('\n'));
    return { rows: details.length, groupedRows: grouped.length };
}

function writeAmbiguityMarkdownReport(filePath, details) {
    const grouped = groupAmbiguityDetails(details);
    const duplicateDetails = getRegistryDuplicateDetails();
    const duplicateCounts = new Map(targetPlatforms.map(platform => [platform, 0]));
    const referencedCounts = new Map(targetPlatforms.map(platform => [platform, 0]));
    for (const item of duplicateDetails) {
        duplicateCounts.set(item.platform, (duplicateCounts.get(item.platform) ?? 0) + 1);
    }
    for (const item of grouped) {
        referencedCounts.set(item.platform, (referencedCounts.get(item.platform) ?? 0) + 1);
    }

    const lines = [];
    lines.push('# ApiLink Registry Ambiguity Report');
    lines.push('');
    lines.push(`Generated from \`${API_LINK_INDEX_VERSION}\` registries and \`${SRC_DIR.replace(/\\/g, '/')}\`.`);
    lines.push('');
    lines.push('## Summary');
    lines.push('');
    lines.push('| Platform | Registry duplicate symbol keys | Referenced ambiguous ApiLinks |');
    lines.push('|---|---:|---:|');
    for (const platformName of targetPlatforms) {
        lines.push(`| ${platformName} | ${duplicateCounts.get(platformName) ?? 0} | ${referencedCounts.get(platformName) ?? 0} |`);
    }
    lines.push('');
    lines.push('## Referenced Ambiguous ApiLinks');
    lines.push('');
    lines.push('These ApiLink references resolve to more than one registry symbol after applying their current props. Add a disambiguating `pkg` or `kind`, or replace the link when it should not target product API docs.');
    lines.push('');
    for (const platformName of targetPlatforms) {
        const platformItems = grouped.filter(item => item.platform === platformName);
        lines.push(`### ${platformName}`);
        lines.push('');
        if (platformItems.length === 0) {
            lines.push('No referenced ambiguities.');
            lines.push('');
            continue;
        }
        lines.push('| ApiLink | Candidate key | Current props | Registry symbols | Files |');
        lines.push('|---|---|---|---|---|');
        for (const item of platformItems) {
            const props = [
                item.pkg ? `pkg="${item.pkg}"` : '',
                item.kind ? `kind="${item.kind}"` : '',
            ].filter(Boolean).join('<br>');
            const symbols = item.symbols.map(symbol => escapeMdTable(symbolLabel(symbol))).join('<br>');
            const files = [...item.files].sort().map(file => `\`${file}\``).join('<br>');
            lines.push(`| \`${escapeMdTable(item.label)}\` | \`${escapeMdTable(item.candidate)}\` | ${props} | ${symbols} | ${files} |`);
        }
        lines.push('');
    }

    lines.push('## All Registry Duplicate Symbol Keys');
    lines.push('');
    for (const platformName of targetPlatforms) {
        const platformItems = duplicateDetails.filter(item => item.platform === platformName);
        lines.push(`### ${platformName}`);
        lines.push('');
        if (platformItems.length === 0) {
            lines.push('No duplicate symbol keys.');
            lines.push('');
            continue;
        }
        lines.push('| Candidate key | Registry symbols |');
        lines.push('|---|---|');
        for (const item of platformItems) {
            const symbols = item.symbols.map(symbol => escapeMdTable(symbolLabel(symbol))).join('<br>');
            lines.push(`| \`${escapeMdTable(item.candidate)}\` | ${symbols} |`);
        }
        lines.push('');
    }

    writeFileSync(filePath, lines.join('\n'));
    return { rows: details.length, groupedRows: grouped.length, duplicateRows: duplicateDetails.length };
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
            if (resolved.ambiguity) {
                ambiguityDetails.push({
                    platform: platformName,
                    file: relPath,
                    type: props.type,
                    member: props.member ?? '',
                    kind: props.kind ?? '',
                    pkg: props.pkg ?? '',
                    label: props.member ? `${props.type}.${props.member}` : props.type,
                    candidate: resolved.ambiguity.candidate,
                    symbols: resolved.ambiguity.symbols,
                });
            }

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
console.log(`  Ambiguous refs     : ${ambiguityDetails.length}`);
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

if (LIST_BROKEN) {
    const filtered = filterUnresolvedDetails(unresolvedDetails, { actionableOnly: true });
    const reasonLabel = UNRESOLVED_REASON ? ` (${UNRESOLVED_REASON})` : '';
    printUnresolvedList(`Broken ApiLinks${reasonLabel}`, filtered, BROKEN_LIMIT);
}

if (LIST_UNRESOLVED) {
    const filtered = filterUnresolvedDetails(unresolvedDetails);
    const reasonLabel = UNRESOLVED_REASON ? ` (${UNRESOLVED_REASON})` : '';
    printUnresolvedList(`Unresolved ApiLinks${reasonLabel}`, filtered, BROKEN_LIMIT);
}

if (LIST_AMBIGUITIES) {
    printAmbiguityList('Ambiguous ApiLinks', ambiguityDetails, BROKEN_LIMIT);
}

if (BROKEN_MD_OUTPUT) {
    const filtered = filterUnresolvedDetails(unresolvedDetails, { actionableOnly: true });
    const reasonLabel = UNRESOLVED_REASON ? `: ${UNRESOLVED_REASON}` : '';
    const result = writeUnresolvedMarkdownReport(BROKEN_MD_OUTPUT, `ApiLink Broken Report${reasonLabel}`, filtered);
    console.log(`  Broken ApiLink report written to: ${BROKEN_MD_OUTPUT}`);
    console.log(`  Broken rows: ${result.rows}, grouped rows: ${result.groupedRows}\n`);
}

if (AMBIGUITY_MD_OUTPUT) {
    const result = writeAmbiguityMarkdownReport(AMBIGUITY_MD_OUTPUT, ambiguityDetails);
    console.log(`  Ambiguity report written to: ${AMBIGUITY_MD_OUTPUT}`);
    console.log(`  Ambiguous rows: ${result.rows}, grouped rows: ${result.groupedRows}, registry duplicate rows: ${result.duplicateRows}\n`);
}

if (UNRESOLVED_MD_OUTPUT) {
    const filtered = filterUnresolvedDetails(unresolvedDetails);
    const reasonLabel = UNRESOLVED_REASON ? `: ${UNRESOLVED_REASON}` : '';
    const result = writeUnresolvedMarkdownReport(UNRESOLVED_MD_OUTPUT, `ApiLink Unresolved Report${reasonLabel}`, filtered);
    console.log(`  Unresolved report written to: ${UNRESOLVED_MD_OUTPUT}`);
    console.log(`  Unresolved rows: ${result.rows}, grouped rows: ${result.groupedRows}\n`);
}

if (RESOLVE_ONLY) {
    if (OUTPUT) {
        const report = {
            generatedAt: new Date().toISOString(),
            srcDir: SRC_DIR,
            platforms: targetPlatforms,
            totalFiles: mdxFiles.length,
            totalLinks: totalApiLinkRefs,
            resolvedLinks: totalResolvedLinks,
            ambiguousLinks: ambiguityDetails.length,
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
    process.exit(FAIL_ON_AMBIGUITY && ambiguityDetails.length > 0 ? 1 : 0);
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
        ambiguousLinks: ambiguityDetails.length,
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
    lines.push(`| Ambiguous refs | ${ambiguityDetails.length} |`);
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

process.exit(brokenResults.length > 0 || (FAIL_ON_AMBIGUITY && ambiguityDetails.length > 0) ? 1 : 0);

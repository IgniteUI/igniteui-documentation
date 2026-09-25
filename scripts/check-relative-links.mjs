#!/usr/bin/env node
/**
 * Validates all relative Markdown links in MDX source files to ensure
 * the target pages exist on disk. Catches broken cross-topic links such
 * as typos in directory or file names (e.g. ./interativity/chat). https://github.com/IgniteUI/igniteui-documentation/pull/327
 *
 * Scans .mdx files and finds [text](./path) or [text](../path) links,
 * resolves them relative to the source file's directory, then checks
 * whether the target exists (trying .mdx, .md, and bare extensions).
 * JSX-style href attributes with relative paths are also checked.
 *
 * The hrefs in each toc.json are checked in the same pass. They are file paths
 * rather than URLs, but they break the same way a link does — and buildSidebar()
 * drops an entry whose target is missing instead of failing, so a stale one
 * disappears from the sidebar with no error.
 *
 * When --platform=angular the script scans docs/angular/src/content plus
 * docs/xplat/generated/Angular — the two roots the Angular site serves.
 * When --platform=react|wc|blazor  it scans docs/xplat/src/content.
 * Omitting --platform scans every tree in one pass.
 *
 * Usage:
 *   node scripts/check-relative-links.mjs
 *   node scripts/check-relative-links.mjs --platform=angular
 *   node scripts/check-relative-links.mjs --platform=react
 *   node scripts/check-relative-links.mjs --platform=wc
 *   node scripts/check-relative-links.mjs --platform=blazor
 *   node scripts/check-relative-links.mjs --src=docs/xplat/src/content
 *   node scripts/check-relative-links.mjs --md=reports/relative-links-report.md
 *
 * Exit code: 0 = all OK, 1 = broken links found.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path'; // join used in walkMdx
import {
    ANGULAR_AUTHORED_ROOT,
    ANGULAR_OVERLAY_ROOT,
    getRootGroup,
    isShadowedAuthoredFile,
    isUnservedOverlayFile,
} from './lib/angular-content-roots.mjs';

// CLI args
const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => {
            const [k, ...rest] = a.slice(2).split('=');
            return [k, rest.length ? rest.join('=') : true];
        })
);

const PLATFORM  = args.platform ? String(args.platform) : null;
const MD_OUTPUT = args.md       ? String(args.md)       : null;
const SUMMARY   = args.summary  === true;

const XPLAT_PLATFORMS = new Set(['react', 'wc', 'blazor']);

/**
 * Drops roots that are not on disk, so a language the xplat generator does not
 * emit (`kr`) simply has no overlay rather than a hard failure. Losing an en/jp
 * overlay, though, silently shrinks coverage: its generated topics are skipped,
 * and links and toc entries pointing at them report a false "not found" — so
 * each missing language is called out.
 */
function keepExisting(dirs) {
    if (dirs.includes(ANGULAR_OVERLAY_ROOT)) {
        const missing = ['en', 'jp'].filter(lang => !existsSync(`${ANGULAR_OVERLAY_ROOT}/${lang}`));
        if (missing.length) {
            console.warn(
                `[warn] "${ANGULAR_OVERLAY_ROOT}" is missing ${missing.join(' and ')} — that part of the xplat Angular overlay was not scanned.\n` +
                '       Links in its generated topics are unchecked, and links or toc entries pointing at\n' +
                '       those topics may report a false "not found". Generate it first:\n' +
                missing
                    .map(lang => `         npm run ${lang === 'en' ? 'xplat:generate' : 'xplat:generate:jp'} --prefix docs/angular`)
                    .join('\n')
            );
        }
    }
    return dirs.filter(d => existsSync(d));
}

function getSrcDirs() {
    if (args.src) return [String(args.src)];
    // The Angular site overlays the xplat generator's Angular output on its own
    // content instead of copying it in, so both trees have to be scanned — and
    // links may point across them (see lib/angular-content-roots.mjs).
    if (PLATFORM === 'angular') {
        return keepExisting([ANGULAR_AUTHORED_ROOT, ANGULAR_OVERLAY_ROOT]);
    }
    if (PLATFORM === 'xplat' || (PLATFORM && XPLAT_PLATFORMS.has(PLATFORM))) {
        // Scan source for _shared/ template links, plus the React/WC/Blazor
        // generated output (after generate.mjs has rewritten _shared/ paths).
        // Angular is intentionally excluded here: generated/Angular/ is one of
        // the two roots the Angular site serves, so --platform=angular scans it.
        // Run the generate scripts before this check so generated/ is up to date.
        const dirs = ['docs/xplat/src/content'];
        for (const p of ['React', 'WebComponents', 'Blazor']) {
            const d = `docs/xplat/generated/${p}`;
            if (existsSync(d)) dirs.push(d);
        }
        return dirs;
    }
    if (PLATFORM) {
        console.error(`Unknown platform "${PLATFORM}". Use: angular, xplat, react, wc, blazor`);
        process.exit(1);
    }
    return keepExisting([ANGULAR_AUTHORED_ROOT, ANGULAR_OVERLAY_ROOT, 'docs/xplat/src/content']);
}

// File walking

/**
 * Directories that are excluded from scanning by default.
 *

 *   grids_templates/ — angular source templates for generate-grids.mjs; links
 *   resolve from the generated output, not the template source.
 *
 * _shared/ — xplat source templates expanded by xplat/scripts/generate.mjs
 *   into grid/, tree-grid/ etc. under docs/xplat/generated/; links are
 *   validated via the generated output, not the template source.
 *
 * kr/ — Korean locale content is not actively maintained to the same level
 *   as en/jp and is excluded from automated link validation.
 */
const EXCLUDED_DIR_NAMES = new Set(['grids_templates', '_shared', 'kr']);

function walkMdx(dir) {
    const results = [];
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true });
    } catch {
        if (dir.endsWith('.mdx')) results.push(dir);
        return results;
    }
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (EXCLUDED_DIR_NAMES.has(entry.name)) continue;
            results.push(...walkMdx(join(dir, entry.name)));
        } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
            results.push(join(dir, entry.name));
        }
    }
    return results;
}

// Link extraction

/**
 * Returns content with MDX/JSX and HTML comments blanked out (preserving
 * positions so line numbers stay correct).
 */
function stripComments(content) {
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, m => ' '.repeat(m.length));
    content = content.replace(/<!--[\s\S]*?-->/g, m => ' '.repeat(m.length));
    return content;
}

/**
 * Blanks out <PlatformBlock for="...">...</PlatformBlock> sections that do not
 * apply to any of the given platforms, preserving byte positions so that line
 * numbers remain accurate. Handles nested PlatformBlock elements.
 *
 * When `platforms` is null (no platform filter), nothing is blanked.
 */
function blankInapplicablePlatformBlocks(content, platforms) {
    if (!platforms || platforms.size === 0) return content;

    const PB_OPEN_RE = /<PlatformBlock\s+for="([^"]+)"\s*>/g;
    const ANY_TAG_RE = /<PlatformBlock\s+for="[^"]+"\s*>|<\/PlatformBlock>/g;
    const chars = content.split('');

    PB_OPEN_RE.lastIndex = 0;
    let openMatch;
    while ((openMatch = PB_OPEN_RE.exec(content)) !== null) {
        const blockPlatforms = openMatch[1].split(',').map(p => p.trim());
        const applicable = blockPlatforms.some(p => platforms.has(p));
        if (applicable) continue; // keep this block as-is

        // Find the matching </PlatformBlock>, tracking nesting depth.
        const bodyStart = openMatch.index + openMatch[0].length;
        ANY_TAG_RE.lastIndex = bodyStart;
        let depth = 1;
        let closeMatch = null;
        while (depth > 0) {
            closeMatch = ANY_TAG_RE.exec(content);
            if (!closeMatch) break;
            if (closeMatch[0].startsWith('</')) depth--;
            else depth++;
        }
        if (!closeMatch) continue;

        const blankStart = openMatch.index;
        const blankEnd = closeMatch.index + closeMatch[0].length;
        for (let i = blankStart; i < blankEnd; i++) {
            if (chars[i] !== '\n') chars[i] = ' ';
        }
        PB_OPEN_RE.lastIndex = blankEnd;
    }

    return chars.join('');
}

/**
 * Maps a source file path to the set of applicable platforms for PlatformBlock
 * filtering. Files in docs/xplat/src/content are shared across all xplat
 * platforms, we filter out Angular only blocks; files in docs/angular/src and
 * in the generator's Angular output keep Angular blocks and skip xplat-only ones.
 */
function platformSetForFile(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    if (normalized.includes('docs/angular/src/') || normalized.includes('docs/xplat/generated/Angular/')) {
        return new Set(['Angular']);
    }
    if (normalized.includes('docs/xplat/src/')) {
        return new Set(['React', 'WebComponents', 'Blazor']);
    }
    return null; // no filtering
}

/** Markdown link: [text](url) — captures the URL portion. */
const MD_LINK_RE = /\[(?:[^\]\\]|\\.)*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

/**
 * JSX href attribute with relative path:  href="./..." or href='../'
 * Captures the attribute value.
 */
const JSX_HREF_RE = /href=["'](\.[^"'\s>]+)["']/g;

/**
 * True when `path` is an existing *file*.
 *
 * Every doc page is a file, so a bare directory must never satisfy a link on
 * its own: a group folder such as components/inputs/ exists on disk but
 * publishes no page, and /inputs 404s.
 */
function isFile(path) {
    try {
        return statSync(path).isFile();
    } catch {
        return false;
    }
}

/**
 * True when `path` is a file the site actually serves.
 *
 * A file the site never renders cannot satisfy a link: the xplat copies of
 * grids/ and changelog/ sit on disk but are excluded from the Angular overlay,
 * so accepting one would hide a genuinely broken link on a page that *is*
 * served (see lib/angular-content-roots.mjs).
 */
function isServedFile(path) {
    return !isUnservedOverlayFile(path) && isFile(path);
}

/**
 * Every on-disk file that can publish at the URL `base` maps to.
 *
 * Astro derives the id from the file path and strips a trailing `/index`
 * (see getContentEntryIdAndSlug in astro/dist/content/utils.js), so
 * components/themes/sass/index.mdx publishes at /themes/sass — a directory
 * therefore does satisfy a link, but only when it holds an index page.
 * `base` itself is included for links that already carry an extension.
 */
function pageCandidates(base) {
    return [
        base,
        base + '.mdx',
        base + '.md',
        join(base, 'index.mdx'),
        join(base, 'index.md'),
    ];
}

/** Strip hash fragment (#anchor) from a URL path. */
function stripHash(url) {
    const i = url.indexOf('#');
    return i >= 0 ? url.slice(0, i) : url;
}

/** File extensions that are clearly non-documentation assets — skip these. */
const ASSET_EXTENSIONS = new Set([
    '.css', '.js', '.ts', '.mjs', '.cjs',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
    '.json', '.xml', '.yaml', '.yml',
    '.zip', '.tar', '.gz', '.pdf',
    '.woff', '.woff2', '.ttf', '.eot',
    '.html', '.htm',
]);

/**
 * Asset extensions that disqualify an *absolute* link from being a doc link.
 *
 * .html/.htm are deliberately excluded from this set: legacy docfx URLs were
 * written as /themes/palettes.html, and treating them as assets made them
 * invisible to this check instead of reporting them as broken.
 */
const ABSOLUTE_LINK_ASSET_EXTENSIONS = new Set(
    [...ASSET_EXTENSIONS].filter(ext => ext !== '.html' && ext !== '.htm')
);

/**
 * True when a URL is an absolute doc-internal link, e.g. /treegrid/tree-grid.
 * Rejects external URLs, anchors-only, protocol-relative, and asset extensions.
 */
function isAbsoluteDocLink(url) {
    if (!url.startsWith('/') || url.startsWith('//')) return false;
    if (url.startsWith('/#')) return false; // anchor-only
    const path = stripHash(url).slice(1); // strip leading '/'
    if (!path) return false;
    const dot = path.lastIndexOf('.');
    const slash = path.lastIndexOf('/');
    if (dot > slash) {
        const ext = path.slice(dot).toLowerCase();
        if (ABSOLUTE_LINK_ASSET_EXTENSIONS.has(ext)) return false;
    }
    return true;
}

/**
 * Given a file path, returns the language-specific content root
 * e.g. 'docs/angular/src/content/en/' or null if not determinable.
 */
function getLangRoot(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    const m = normalized.match(/^(.*\/(?:content|generated\/[^/]+)\/(?:en|jp|kr))\//i);
    return m ? m[1] + '/' : null;
}

// `OVERLAY_ROOT_GROUPS`, `getRootGroup`, `isUnservedOverlayFile` and
// `isShadowedAuthoredFile` live in scripts/lib/angular-content-roots.mjs — the
// single description of what the Angular site actually serves, shared with
// check-mdx-links.mjs.

/** Legacy docfx extension on a doc URL, e.g. /themes/palettes.html */
const LEGACY_HTML_RE = /\.html?$/i;

/**
 * Resolves an absolute doc link like /treegrid/tree-grid against `langRoots` —
 * every content root that shares this slug namespace (see getRootGroup).
 * Returns { resolved, reason }; resolved is null when the target does not exist.
 */
function resolveAbsoluteLink(langRoots, url) {
    let path = stripHash(url).slice(1); // strip leading '/'
    if (!path) return { resolved: 'hash-only', reason: null };

    // Astro lowercases all URL slugs at build time. Always resolve using the
    // lowercased path so that camelCase links like /pivotGrid/... are flagged
    // as broken (the built URL is /pivotgrid/...).
    path = path.toLowerCase();

    // The docs collection is rooted at content/<lang>/components (see
    // docs/*/src/content.config.ts), so "components" is never a URL segment.
    // A link starting with it is the on-disk file path written as a URL: it
    // resolves to a real file yet 404s in the browser, which is what let
    // https://github.com/IgniteUI/igniteui-documentation/issues/530 through.
    if (path === 'components' || path.startsWith('components/')) {
        return { resolved: null, reason: 'components-prefix' };
    }

    // Legacy docfx URLs carried a .html suffix; Astro routes do not.
    const legacyHtml = LEGACY_HTML_RE.test(path);
    if (legacyHtml) path = path.replace(LEGACY_HTML_RE, '');

    for (const langRoot of langRoots) {
        const base = resolve(langRoot, 'components', path);
        for (const candidate of pageCandidates(base)) {
            if (isServedFile(candidate)) {
                return { resolved: candidate, reason: legacyHtml ? 'legacy-html' : null };
            }
        }
    }

    return { resolved: null, reason: legacyHtml ? 'legacy-html' : 'not-found' };
}

/**
 * True when a URL is a relative file path to a doc page.
 * Accepts:  ./page.mdx, ../dir/page.mdx, page.mdx, dir/page.mdx (bare with .mdx extension)
 * Rejects:  http(s), mailto, anchor-only (#), absolute paths (/), asset extensions.
 */
function isRelativeFilePath(url) {
    if (url.startsWith('//') || url.startsWith('/') || url.startsWith('#')) return false;
    if (url.includes('://') || url.startsWith('mailto:')) return false;

    const isExplicitRelative = url.startsWith('./') || url.startsWith('../');
    // Also accept bare paths that explicitly carry a .md or .mdx extension
    // e.g. (page.mdx) or (subdir/page.mdx) — resolves as same-directory relative.
    // Excludes template variables like {GithubLink}/... which aren't real relative paths.
    const isBareDocLink = !isExplicitRelative && !url.startsWith('{') && /\.mdx?(?:#|$)/i.test(url);

    if (!isExplicitRelative && !isBareDocLink) return false;

    const path = stripHash(url);
    const dot = path.lastIndexOf('.');
    const slash = path.lastIndexOf('/');
    if (dot > slash) {
        const ext = path.slice(dot).toLowerCase();
        if (ASSET_EXTENSIONS.has(ext)) return false;
    }
    return true;
}


/**
 * Extracts every relative and absolute doc link from the MDX content of the given file.
 * Returns: Array<{ href: string, line: number, kind: 'relative'|'absolute' }>
 */
function extractRelativeLinks(content, filePath) {
    let stripped = stripComments(content);
    stripped = blankInapplicablePlatformBlocks(stripped, platformSetForFile(filePath));
    const links = [];

    // Build line-start offset table for line/col mapping.
    const lineOffsets = [0];
    for (let i = 0; i < stripped.length; i++) {
        if (stripped[i] === '\n') lineOffsets.push(i + 1);
    }
    function offsetToLine(offset) {
        let lo = 0, hi = lineOffsets.length - 1;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (lineOffsets[mid] <= offset) lo = mid; else hi = mid - 1;
        }
        return lo + 1;
    }

    // Markdown links
    MD_LINK_RE.lastIndex = 0;
    let m;
    while ((m = MD_LINK_RE.exec(stripped)) !== null) {
        const href = m[1];
        if (isRelativeFilePath(href)) {
            links.push({ href, line: offsetToLine(m.index), kind: 'relative' });
        } else if (isAbsoluteDocLink(href)) {
            links.push({ href, line: offsetToLine(m.index), kind: 'absolute' });
        }
    }

    // JSX href attributes
    JSX_HREF_RE.lastIndex = 0;
    while ((m = JSX_HREF_RE.exec(stripped)) !== null) {
        const href = m[1];
        if (isRelativeFilePath(href)) {
            links.push({ href, line: offsetToLine(m.index), kind: 'relative' });
        } else if (isAbsoluteDocLink(href)) {
            links.push({ href, line: offsetToLine(m.index), kind: 'absolute' });
        }
    }

    return links;
}

// File resolution

/**
 * Returns `abs` followed by the same path re-anchored on every peer in
 * `langRoots` — the file's own root first, then each root it shares a slug
 * namespace with (see getRootGroup). A path outside the own root is returned
 * alone.
 */
function acrossRoots(abs, langRoots) {
    const [ownRoot, ...peerRoots] = langRoots;
    const paths = [abs];
    if (ownRoot && peerRoots.length) {
        const fromRoot = relative(resolve(ownRoot), abs);
        if (!fromRoot.startsWith('..')) {
            for (const peer of peerRoots) paths.push(resolve(peer, fromRoot));
        }
    }
    return paths;
}

/**
 * Returns { resolved, missingExt } for `href` relative to `fileDir`.
 * resolved = null means the target does not exist in any content root.
 * missingExt = true means the path has no extension but resolves via .mdx —
 *   the link should be written as ./page.mdx, not ./page.
 *
 * Candidates cover the tree the file lives in first, then the same relative
 * path re-anchored on each root it shares a slug namespace with, so a link
 * that points at a topic served from the other tree still resolves.
 */
function resolveLink(fileDir, href, langRoots = []) {
    const path = stripHash(href);
    if (!path) return { resolved: 'hash-only', missingExt: false };

    // Candidates re-anchored on a peer root can land on a file the site never
    // serves (the overlay's excluded grids/ and changelog/); isServedFile()
    // rejects those, or a broken /grids/... reference would pass.
    const candidates = acrossRoots(resolve(fileDir, path), langRoots);

    for (const candidate of candidates) {
        if (isServedFile(candidate)) return { resolved: candidate, missingExt: false };
    }

    for (const candidate of candidates) {
        const target = pageCandidates(candidate).find(isServedFile);
        if (!target) continue;

        const lastDot = path.lastIndexOf('.');
        const lastSlash = path.lastIndexOf('/');
        const hasExt = lastDot > lastSlash;
        const isBare = !path.startsWith('./') && !path.startsWith('../');
        const missingExt = !hasExt || isBare;
        return { resolved: target, missingExt, bare: isBare };
    }

    return { resolved: null, missingExt: false };
}

// Main scan

const cwd = process.cwd();

/** @type {string[]} */
let filesToScan;
let scanDescription;

const srcDirs = getSrcDirs();
// Only scan files the Angular site actually renders: skip the overlay's
// excluded grids/ and changelog/, and skip authored topics that xplat shadows —
// the latter are on disk but never served, so their links belong to no page.
filesToScan = srcDirs
    .flatMap(d => walkMdx(resolve(d)))
    .filter(f => !isUnservedOverlayFile(f) && !isShadowedAuthoredFile(f));
scanDescription = `source dirs: ${srcDirs.join(', ')}`;

console.log(`\nScanning for relative links`);
console.log(`Scope: ${scanDescription}`);
if (PLATFORM) console.log(`Platform: ${PLATFORM}`);
console.log('');

/** @type {Array<{file: string, line: number, href: string}>} */
const brokenLinks = [];
let totalFiles = 0;
let totalLinks = 0;

for (const file of filesToScan) {
    totalFiles++;
    const content = readFileSync(file, 'utf-8');
    const links = extractRelativeLinks(content, file);
    totalLinks += links.length;
    const fileDir = dirname(file);
    const relFile = relative(cwd, file).replace(/\\/g, '/');

    const langRoot = getLangRoot(file);
    const langRoots = getRootGroup(langRoot);

    for (const { href, line, kind } of links) {
        if (kind === 'absolute') {
            if (langRoot) {
                const { resolved, reason } = resolveAbsoluteLink(langRoots, href);
                // A legacy .html suffix 404s on the Astro routes even when the
                // target page itself exists, so report it either way.
                if (resolved === null || reason === 'legacy-html') {
                    brokenLinks.push({ file: relFile, line, href, reason });
                }
            }
            continue;
        }
        const { resolved, missingExt, bare } = resolveLink(fileDir, href, langRoots);
        if (resolved === null) {
            brokenLinks.push({ file: relFile, line, href, reason: 'not-found' });
        } else if (bare) {
            brokenLinks.push({ file: relFile, line, href, reason: 'bare-path' });
        } else if (missingExt) {
            brokenLinks.push({ file: relFile, line, href, reason: 'missing-mdx' });
        }
    }

    // Second pass: catch bare links (no ./ or ../) that resolve to .mdx files.
    // Only flag when the file actually exists, avoids false positives.
    const BARE_LINK_RE = /\]\((?!https?:\/\/|#|\/|\.\.?\/|mailto:|{)([a-zA-Z][a-zA-Z0-9/_-]*)(#[^)]*)?\)/g;
    for (const m of content.matchAll(BARE_LINK_RE)) {
        const href = m[1];
        const hash = m[2] ?? '';
        const resolvesToPage = acrossRoots(resolve(fileDir, href), langRoots)
            .some(candidate => isServedFile(candidate + '.mdx'));
        if (resolvesToPage) {
            const line = (content.slice(0, m.index).match(/\n/g) || []).length + 1;
            brokenLinks.push({ file: relFile, line, href: href + hash, reason: 'bare-path' });
        }
    }
}

// toc.json navigation

/**
 * toc.json hrefs are the sidebar's only source of navigation, and they are file
 * paths relative to the components dir carrying the .mdx extension — not URLs.
 *
 * They need checking for the same reason the links above do, and are easy to get
 * wrong in the same way: a topic move changes both, and buildSidebar() drops an
 * entry whose target is missing (docExists() → null in src/sidebar.ts) rather
 * than failing, so a stale href disappears from the sidebar with no error.
 *
 * Resolution reuses getRootGroup(), so an Angular toc entry may point at a page
 * that only the xplat overlay (docs/xplat/generated/Angular/<lang>/) provides.
 */

/** Ordered { value, line } for every "href" in a toc, read from the raw text. */
function tocHrefLines(text) {
    const lines = [];
    const re = /"href"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = re.exec(text)) !== null) {
        lines.push({
            value: m[1],
            line: (text.slice(0, m.index).match(/\n/g) || []).length + 1,
        });
    }
    return lines;
}

/**
 * Yields every toc entry carrying an href, in document order, with the chain of
 * entry names and the platforms it is excluded for.
 *
 * buildFilteredToc() in docs/xplat/astro.config.ts drops an excluded node along
 * with its children, so exclusions accumulate down the tree. Excluded entries
 * are still yielded (flagged) to keep the ordering aligned with tocHrefLines().
 */
function* walkTocEntries(entries, trail = [], excluded = [], counter = { n: 0 }) {
    if (!Array.isArray(entries)) return;

    for (const entry of entries) {
        if (!entry || typeof entry !== 'object') continue;

        const path = [...trail, entry.name ?? '(unnamed)'];
        const excl = Array.isArray(entry.exclude) ? [...excluded, ...entry.exclude] : excluded;

        if (typeof entry.href === 'string' && entry.href) {
            yield { href: entry.href, trail: path, excluded: excl, index: counter.n++ };
        }
        if (Array.isArray(entry.items)) {
            yield* walkTocEntries(entry.items, path, excl, counter);
        }
    }
}

/**
 * True when a toc href resolves under any of `langRoots`.
 *
 * docExists() accepts the href as written and also swaps .md ↔ .mdx, so both
 * count here. Like docExists(), a root never answers for a path it excludes.
 */
function tocHrefResolves(langRoots, href) {
    const normalized = href.replace(/\\/g, '/');
    const swapped = normalized.endsWith('.mdx') ? normalized.slice(0, -4) + '.md'
                  : normalized.endsWith('.md')  ? normalized.slice(0, -3) + '.mdx'
                  : null;

    for (const langRoot of langRoots) {
        if (isServedFile(resolve(langRoot, 'components', normalized))) return true;
        if (swapped && isServedFile(resolve(langRoot, 'components', swapped))) return true;
    }
    return false;
}

/**
 * The tocs in scope, as { toc, langRoots, platform }.
 *
 * Angular ships its own toc per language and resolves through getRootGroup(),
 * so it picks up the xplat-authored pages the site overlays. The xplat
 * platforms share one source toc that astro.config.ts filters per platform at
 * build time, so the same filter is applied here against each generated tree.
 */
function getTocTargets() {
    const targets = [];

    if (!PLATFORM || PLATFORM === 'angular') {
        for (const lang of ['en', 'jp']) {
            const langRoot = resolve(cwd, ANGULAR_AUTHORED_ROOT, lang) + '/';
            const toc = resolve(langRoot, 'components', 'toc.json');
            if (existsSync(toc)) targets.push({ toc, langRoots: getRootGroup(langRoot), platform: null });
        }
    }

    if (!PLATFORM || PLATFORM === 'xplat' || XPLAT_PLATFORMS.has(PLATFORM)) {
        for (const platform of ['React', 'WebComponents', 'Blazor']) {
            for (const lang of ['en', 'jp']) {
                const toc = resolve(cwd, 'docs/xplat/src/content', lang, 'toc.json');
                const dir = resolve(cwd, 'docs/xplat/generated', platform, lang) + '/';
                if (!existsSync(toc) || !existsSync(dir)) continue;

                targets.push({ toc, langRoots: [dir], platform });
            }
        }
    }

    return targets;
}

let totalTocHrefs = 0;

for (const { toc, langRoots, platform } of getTocTargets()) {
    const text = readFileSync(toc, 'utf-8');
    const relToc = relative(cwd, toc).replace(/\\/g, '/');

    let entries;
    try {
        entries = JSON.parse(text);
    } catch (error) {
        brokenLinks.push({ file: relToc, line: 1, href: '(whole file)', reason: `unparseable JSON: ${error.message}` });
        continue;
    }

    const hrefLines = tocHrefLines(text);

    for (const { href, trail, excluded, index } of walkTocEntries(entries)) {
        if (platform && excluded.includes(platform)) continue;

        totalTocHrefs++;
        if (tocHrefResolves(langRoots, href)) continue;

        brokenLinks.push({
            file: relToc,
            line: hrefLines[index]?.value === href ? hrefLines[index].line : 1,
            href,
            reason: 'toc-not-found',
            entry: platform ? `${platform}: ${trail.join(' → ')}` : trail.join(' → '),
        });
    }
}

// Reporting

const HR  = '═'.repeat(72);
const HR2 = '─'.repeat(72);

// --summary mode: print one compact status line and exit (used by CI for the final combined summary)
if (SUMMARY) {
    const label  = PLATFORM ?? 'all';
    const status = brokenLinks.length === 0 ? '✅' : '❌';
    console.log(`  ${status}  ${label.padEnd(10)}  Broken links: ${brokenLinks.length}  (${totalFiles} files, ${totalLinks} links, ${totalTocHrefs} toc hrefs)`);
    process.exit(brokenLinks.length > 0 ? 1 : 0);
}

// --summary mode: print one compact status line and exit (used by CI for the final combined summary)
if (SUMMARY) {
    const label  = PLATFORM ?? 'all';
    const status = brokenLinks.length === 0 ? '✅' : '❌';
    console.log(`  ${status}  ${label.padEnd(10)}  Broken links: ${brokenLinks.length}  (${totalFiles} files, ${totalLinks} links, ${totalTocHrefs} toc hrefs)`);
    process.exit(brokenLinks.length > 0 ? 1 : 0);
}

console.log(`  MDX/MD files scanned : ${totalFiles}`);
console.log(`  Relative links found : ${totalLinks}`);
console.log(`  TOC hrefs found      : ${totalTocHrefs}`);
console.log(`  Broken               : ${brokenLinks.length}\n`);

console.log(HR);
console.log('  RELATIVE LINK CHECK REPORT (MDX source + toc.json)');
console.log(HR);

if (brokenLinks.length === 0) {
    console.log('\n  All links and toc entries resolve to pages that ship.\n');
} else {
    for (const item of brokenLinks) {
        const tag = item.reason === 'bare-path'         ? '[use ./page.mdx instead]'
                  : item.reason === 'missing-mdx'       ? '[add .mdx extension]'
                  : item.reason === 'components-prefix' ? '[drop the /components prefix]'
                  : item.reason === 'legacy-html'       ? '[drop the .html extension]'
                  : item.reason === 'toc-not-found'     ? '[toc target missing — entry is dropped from the sidebar]'
                  : item.reason.startsWith('unparseable') ? `[${item.reason}]`
                  : '[not found]';
        console.log(`\n  ✗  ${item.file}:${item.line}  ${tag}`);
        console.log(`       href: ${item.href}`);
        if (item.entry) console.log(`       entry: ${item.entry}`);
    }
    console.log('');
}

console.log(HR);

// Markdown report

if (MD_OUTPUT) {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const lines = [];
    lines.push('# Relative Link Check Report');
    lines.push('');
    lines.push(`_Generated: ${ts}_`);
    lines.push('');
    lines.push('## Summary');
    lines.push('');
    lines.push('| | |');
    lines.push('|---|---|');
    lines.push(`| Files scanned | ${totalFiles} |`);
    lines.push(`| Relative links | ${totalLinks} |`);
    lines.push(`| TOC hrefs | ${totalTocHrefs} |`);
    lines.push(`| ✅ OK | ${totalLinks + totalTocHrefs - brokenLinks.length} |`);
    lines.push(`| ❌ **Broken** | **${brokenLinks.length}** |`);
    lines.push('');

    if (brokenLinks.length > 0) {
        lines.push('## Broken Links');
        lines.push('');
        lines.push('| File | Line | href | Issue |');
        lines.push('|---|---:|---|---|');
        for (const item of brokenLinks) {
            const issue = item.reason === 'bare-path'         ? 'use ./page.mdx instead'
                        : item.reason === 'missing-mdx'       ? 'add .mdx extension'
                        : item.reason === 'components-prefix' ? 'drop the /components prefix'
                        : item.reason === 'legacy-html'       ? 'drop the .html extension'
                        : item.reason === 'toc-not-found'     ? 'toc target missing — entry is dropped from the sidebar'
                        : item.reason.startsWith('unparseable') ? item.reason
                        : 'not found';
            const where = item.entry ? ` (${item.entry})` : '';
            lines.push(`| \`${item.file}\` | ${item.line} | \`${item.href}\`${where} | ${issue} |`);
        }
        lines.push('');
    }

    writeFileSync(MD_OUTPUT, lines.join('\n'));
    console.log(`\n  Markdown report written to: ${MD_OUTPUT}\n`);
}

process.exit(brokenLinks.length > 0 ? 1 : 0);

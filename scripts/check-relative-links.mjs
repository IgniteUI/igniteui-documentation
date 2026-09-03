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

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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
 * emit (`kr`) simply has no overlay rather than a hard failure. Losing the
 * Angular overlay root, though, silently shrinks coverage over every generated
 * topic — so that one is called out.
 */
function keepExisting(dirs) {
    return dirs.filter(d => {
        if (existsSync(d)) return true;
        if (d === ANGULAR_OVERLAY_ROOT) {
            console.warn(
                `[warn] "${d}" is missing — the xplat Angular overlay was not scanned.\n` +
                '       Links in generated topics are unchecked. Generate it first:\n' +
                '         npm run xplat:generate --prefix docs/angular\n' +
                '         npm run xplat:generate:jp --prefix docs/angular'
            );
        }
        return false;
    });
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
        if (ASSET_EXTENSIONS.has(ext)) return false;
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

/**
 * Resolves an absolute doc link like /treegrid/tree-grid against the
 * language content roots. Tries components/{path}.mdx then {path}.mdx in each
 * root that shares the slug namespace.
 * Returns the resolved path string or null if not found.
 */
function resolveAbsoluteLink(langRoots, url) {
    const path = stripHash(url).slice(1); // strip leading '/'
    if (!path) return 'hash-only';
    // Astro lowercases all URL slugs at build time. Always resolve using the
    // lowercased path so that camelCase links like /pivotGrid/... are flagged
    // as broken (the built URL is /pivotgrid/...).
    const pathLower = path.toLowerCase();
    for (const langRoot of langRoots) {
        const candidates = [
            resolve(langRoot, 'components', pathLower),
            resolve(langRoot, pathLower),
        ];
        for (const base of candidates) {
            for (const candidate of [base, base + '.mdx', base + '.md']) {
                // A file the site never serves cannot satisfy a link: the xplat
                // copies of grids/ and changelog/ sit on disk but are excluded
                // from the overlay, so accepting one would hide a genuinely
                // broken link on a page that *is* served.
                if (isUnservedOverlayFile(candidate)) continue;
                if (existsSync(candidate)) return candidate;
            }
        }
    }
    return null;
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
 * Returns { resolved, missingExt } for `href` relative to `fileDir`.
 * resolved = null means the target does not exist on disk.
 * missingExt = true means the path has no extension but resolves via .mdx —
 *   the link should be written as ./page.mdx, not ./page.
 */
function resolveLink(fileDir, href, langRoots = []) {
    const path = stripHash(href);
    if (!path) return { resolved: 'hash-only', missingExt: false };

    const describe = (abs) => {
        const lastDot = path.lastIndexOf('.');
        const lastSlash = path.lastIndexOf('/');
        const hasExt = lastDot > lastSlash;
        const isBare = !path.startsWith('./') && !path.startsWith('../');
        return { resolved: abs, missingExt: !hasExt || isBare, bare: isBare };
    };

    // The file's own root first, then any root it shares a slug namespace with:
    // the same relative path is re-anchored on each peer, so a link that points
    // at a topic served from the other tree still resolves.
    const [ownRoot, ...peerRoots] = langRoots;
    const bases = [resolve(fileDir, path)];
    if (ownRoot && peerRoots.length) {
        const fromRoot = relative(resolve(ownRoot), bases[0]);
        if (!fromRoot.startsWith('..')) {
            for (const peer of peerRoots) bases.push(resolve(peer, fromRoot));
        }
    }

    // Candidates re-anchored on a peer root can land on a file the site never
    // serves (the overlay's excluded grids/ and changelog/); those must not
    // satisfy the link, or a broken /grids/... reference would pass.
    for (const abs of bases) {
        if (isUnservedOverlayFile(abs)) continue;
        if (existsSync(abs)) return { resolved: abs, missingExt: false };
    }
    for (const abs of bases) {
        if (isUnservedOverlayFile(abs + '.mdx')) continue;
        if (existsSync(abs + '.mdx')) return describe(abs + '.mdx');
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
                const resolved = resolveAbsoluteLink(langRoots, href);
                if (resolved === null) {
                    brokenLinks.push({ file: relFile, line, href, reason: 'not-found' });
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
        const abs = resolve(fileDir, href);
        if (existsSync(abs + '.mdx')) {
            const line = (content.slice(0, m.index).match(/\n/g) || []).length + 1;
            brokenLinks.push({ file: relFile, line, href: href + hash, reason: 'bare-path' });
        }
    }
}

// Reporting

const HR  = '═'.repeat(72);
const HR2 = '─'.repeat(72);

// --summary mode: print one compact status line and exit (used by CI for the final combined summary)
if (SUMMARY) {
    const label  = PLATFORM ?? 'all';
    const status = brokenLinks.length === 0 ? '✅' : '❌';
    console.log(`  ${status}  ${label.padEnd(10)}  Broken links: ${brokenLinks.length}  (${totalFiles} files, ${totalLinks} links)`);
    process.exit(brokenLinks.length > 0 ? 1 : 0);
}

// --summary mode: print one compact status line and exit (used by CI for the final combined summary)
if (SUMMARY) {
    const label  = PLATFORM ?? 'all';
    const status = brokenLinks.length === 0 ? '✅' : '❌';
    console.log(`  ${status}  ${label.padEnd(10)}  Broken links: ${brokenLinks.length}  (${totalFiles} files, ${totalLinks} links)`);
    process.exit(brokenLinks.length > 0 ? 1 : 0);
}

console.log(`  MDX/MD files scanned : ${totalFiles}`);
console.log(`  Relative links found : ${totalLinks}`);
console.log(`  Broken links         : ${brokenLinks.length}\n`);

console.log(HR);
console.log('  RELATIVE LINK CHECK REPORT (MDX source)');
console.log(HR);

if (brokenLinks.length === 0) {
    console.log('\n  All relative links resolve to existing files.\n');
} else {
    for (const item of brokenLinks) {
        const tag = item.reason === 'bare-path'    ? '[use ./page.mdx instead]'
                  : item.reason === 'missing-mdx'  ? '[add .mdx extension]'
                  : '[not found]';
        console.log(`\n  ✗  ${item.file}:${item.line}  ${tag}`);
        console.log(`       href: ${item.href}`);
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
    lines.push(`| ✅ OK | ${totalLinks - brokenLinks.length} |`);
    lines.push(`| ❌ **Broken** | **${brokenLinks.length}** |`);
    lines.push('');

    if (brokenLinks.length > 0) {
        lines.push('## Broken Links');
        lines.push('');
        lines.push('| File | Line | href | Issue |');
        lines.push('|---|---:|---|---|');
        for (const item of brokenLinks) {
            const issue = item.reason === 'bare-path'   ? 'use ./page.mdx instead'
                        : item.reason === 'missing-mdx' ? 'add .mdx extension'
                        : 'not found';
            lines.push(`| \`${item.file}\` | ${item.line} | \`${item.href}\` | ${issue} |`);
        }
        lines.push('');
    }

    writeFileSync(MD_OUTPUT, lines.join('\n'));
    console.log(`\n  Markdown report written to: ${MD_OUTPUT}\n`);
}

process.exit(brokenLinks.length > 0 ? 1 : 0);

/**
 * Platform-specific markdown generator.
 *
 * Covers:
 *   1. Variable substitution          {Platform}, {PackageCore}, etc.
 *   2. Platform block filtering        <!-- Angular -->...<!-- end: Angular -->
 *   3. Component block filtering       <!-- ComponentStart: Grid -->...<!-- ComponentEnd: Grid -->
 *   4. Code block removal              by exclusive language tag AND by content detection
 *   5. Shared file expansion           _shared/*.mdx → grid/, tree-grid/, …
 *   6. Sample viewer transformation    `sample="..."` → <code-view> HTML
 *   7. CodeSandbox / StackBlitz buttons (per platform config)
 *   8. TOC generation                  filter toc.json by platform → dist toc.json
 *   9. Multi-language support          --lang=en|jp|kr
 *
 * Usage:
 *   node scripts/generate.mjs --platform=React
 *   node scripts/generate.mjs --platform=Angular --lang=jp
 *   node scripts/generate.mjs --platform=WebComponents --lang=kr
 */

import {
    readFileSync, writeFileSync, mkdirSync,
    existsSync, readdirSync, rmSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// CLI arguments
// ---------------------------------------------------------------------------

const args        = process.argv.slice(2);
const get         = (prefix) => args.find(a => a.startsWith(prefix))?.split('=')[1];

const PLATFORM = get('--platform=') ?? process.env.PLATFORM ?? 'React';
const LANG     = get('--lang=')     ?? process.env.LANG_CODE ?? 'en';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');

// Source MD files:  src/content/{lang}/components/
const SRC_COMPONENTS = path.join(ROOT, 'src', 'content', LANG, 'components');

// Source toc.json:  src/content/{lang}/toc.json

const OUT_DIR = path.join(ROOT, 'generated', PLATFORM, LANG, 'components');

const DOC_CONFIG     = path.join(ROOT, 'docConfig.json');

// ---------------------------------------------------------------------------
// Load config files
// ---------------------------------------------------------------------------

const docConfig = JSON.parse(readFileSync(DOC_CONFIG, 'utf8'));

const platformConfig = docConfig[PLATFORM];
if (!platformConfig) {
    const valid = Object.keys(docConfig).filter(k => k !== 'NOTE').join(', ');
    console.error(`Unknown platform "${PLATFORM}". Valid: ${valid}`);
    process.exit(1);
}

// ---------------------------------------------------------------------------
// Build the set of hrefs excluded for the current platform from toc.json.
//
// toc.json entries look like:
//   { "href": "general-changelog-dv-react.md", "exclude": ["Angular", "Blazor"] }
//
// We normalise each href to a slug (no .md/.mdx extension, forward slashes)
// and store it in a Set for O(1) lookup in processDir / expandSharedFiles.
// Section nodes with no href but with children are recursively scanned.
// ---------------------------------------------------------------------------

function collectExcludedSlugs(nodes, excluded = new Set()) {
    for (const node of nodes || []) {
        const isExcluded = Array.isArray(node.exclude) && node.exclude.includes(PLATFORM);
        if (isExcluded && node.href) {
            excluded.add(node.href.replace(/\.(mdx?)?$/, '').replace(/\\/g, '/'));
        }
        if (Array.isArray(node.items)) {
            if (isExcluded) {
                collectAllSlugs(node.items, excluded);
            } else {
                collectExcludedSlugs(node.items, excluded);
            }
        }
    }
    return excluded;
}

function collectAllSlugs(nodes, excluded) {
    for (const node of nodes || []) {
        if (node.href) excluded.add(node.href.replace(/\.(mdx?)?$/, '').replace(/\\/g, '/'));
        if (Array.isArray(node.items)) collectAllSlugs(node.items, excluded);
    }
}

// Collect slugs that are reachable via at least one non-excluded path.
// A slug present in both included and excluded sets is NOT excluded —
// e.g. general-getting-started.md appears under a React node AND a Blazor-only node.
function collectIncludedSlugs(nodes, included = new Set()) {
    for (const node of nodes || []) {
        const isExcluded = Array.isArray(node.exclude) && node.exclude.includes(PLATFORM);
        if (!isExcluded && node.href) {
            included.add(node.href.replace(/\.(mdx?)?$/, '').replace(/\\/g, '/'));
        }
        if (Array.isArray(node.items) && !isExcluded) {
            collectIncludedSlugs(node.items, included);
        }
    }
    return included;
}

const TOC_PATH = path.join(ROOT, 'src', 'content', LANG, 'toc.json');
const EXCLUDED_SLUGS = (() => {
    if (!existsSync(TOC_PATH)) return new Set();
    const toc = JSON.parse(readFileSync(TOC_PATH, 'utf8'));
    const excluded = collectExcludedSlugs(toc);
    const included = collectIncludedSlugs(toc);
    // A slug reachable via a non-excluded path is never excluded,
    // even if it also appears under an excluded parent (e.g. shared getting-started page).
    for (const slug of included) excluded.delete(slug);
    return excluded;
})();

console.log(`[generate] Excluded pages for ${PLATFORM}: ${EXCLUDED_SLUGS.size}`);

// ---------------------------------------------------------------------------
// Markdown spacing
// ---------------------------------------------------------------------------

function normalizeMarkdownSpacing(content) {
    const hasFinalNewline = /\r?\n$/.test(content);
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const result = [];
    let blankCount = 0;

    for (const line of lines) {
        if (line.trim() === '') {
            blankCount++;
            if (blankCount <= 1) {
                result.push('');
            }
            continue;
        }

        blankCount = 0;
        result.push(line);
    }

    let normalized = result.join('\n').replace(/\n+$/, '');
    if (hasFinalNewline) {
        normalized += '\n';
    }
    return normalized;
}

function prepareMarkdownOutput(content) {
    return normalizeMarkdownSpacing(content);
}

// ---------------------------------------------------------------------------
// Sort longer names first to avoid partial-match problems
// e.g. {PlatformLower} must match before {Platform}
const replacements = platformConfig.replacements
    .filter(r => r.name && r.value !== undefined)
    .sort((a, b) => b.name.length - a.name.length);


// ---------------------------------------------------------------------------
// 1. Variable substitution
// ---------------------------------------------------------------------------

function applyReplacements(content, extraReplacements = []) {
    const all = [...extraReplacements, ...replacements]
        .sort((a, b) => b.name.length - a.name.length);
    for (const { name, value } of all) {
        content = content.replaceAll(name, value);
    }
    return content;
}

// ---------------------------------------------------------------------------
// 2. Platform block filtering
// ---------------------------------------------------------------------------

function filterPlatformBlocks(content) {
    return content.replace(
        /<!-- ([\w ,]+?) -->([\s\S]*?)<!-- end: \1 -->/g,
        (_m, platforms, body) =>
            platforms.split(',').map(p => p.trim()).includes(PLATFORM) ? body : '',
    );
}

// ---------------------------------------------------------------------------
// 3. Component block filtering
// ---------------------------------------------------------------------------

/**
 * Filter component-conditional blocks, keeping only content for the given
 * component key. Handles both syntaxes:
 *
 *   Legacy HTML comment syntax (used in .md files):
 *     <!-- ComponentStart: Grid -->...<!-- ComponentEnd: Grid -->
 *
 *   MDX component syntax (used in _shared/*.mdx):
 *     <ComponentBlock for="Grid">...</ComponentBlock>
 *
 * If componentKey is null, all block markers are stripped (content kept).
 */
function filterComponentBlocks(content, componentKey) {
    // --- HTML comment syntax ---
    if (!componentKey) {
        content = content
            .replace(/<!-- ComponentStart: [\w, ]+ -->/g, '')
            .replace(/<!-- ComponentEnd: [\w, ]+ -->/g, '');
    } else {
        content = content.replace(
            /<!-- ComponentStart: ([\w, ]+) -->([\s\S]*?)<!-- ComponentEnd: \1 -->/g,
            (_m, keys, body) =>
                keys.split(',').map(k => k.trim()).includes(componentKey) ? body : '',
        );
    }

    // --- MDX <ComponentBlock for="..."> syntax ---
    if (!componentKey) {
        // Strip the wrapper tags, keep the body
        content = content.replace(
            /<ComponentBlock for="[\w, ]+">([\s\S]*?)<\/ComponentBlock>/g,
            (_m, body) => body,
        );
    } else {
        content = content.replace(
            /<ComponentBlock for="([\w, ]+)">([\s\S]*?)<\/ComponentBlock>/g,
            (_m, keys, body) =>
                keys.split(',').map(k => k.trim()).includes(componentKey) ? body : '',
        );
    }

    return content;
}


// ---------------------------------------------------------------------------
// 4. Code block filtering  (language tag + content detection)
// ---------------------------------------------------------------------------

// Languages that belong exclusively to one platform
const EXCLUSIVE_LANG = {
    razor:  'Blazor',
    cshtml: 'Blazor',
    tsx:    'React',
    jsx:    'React',
};

// Content patterns for generic languages (ts / html)
const CONTENT_PATTERNS = {
    Angular:       [/igx-\w+/,   /\bIgx[A-Z]/],
    React:         [/\bIgr[A-Z]/],
    WebComponents: [/igc-\w+/,   /\bIgc[A-Z]/],
    Blazor:        [/\bIgb[A-Z]/],
};

function detectPlatformFromContent(lang, code) {
    const l = lang.toLowerCase();
    if (!['ts', 'typescript', 'html'].includes(l)) return null;
    for (const [platform, patterns] of Object.entries(CONTENT_PATTERNS)) {
        if (patterns.some(p => p.test(code))) return platform;
    }
    return null;
}

function filterCodeBlocks(content) {
    return content.replace(/```(\w+)([\s\S]*?)```/g, (match, lang, body) => {
        // Exclusive language check
        const owner = EXCLUSIVE_LANG[lang.toLowerCase()];
        if (owner && owner !== PLATFORM) return '';

        // Content-based detection for ts / html
        const detected = detectPlatformFromContent(lang, body);
        if (detected && detected !== PLATFORM) return '';

        return match;
    });
}

// ---------------------------------------------------------------------------
// 5. <PlatformBlock for="..."> filtering for MDX files
//
// Depth-aware stack parser — correctly handles nested PlatformBlocks.
// Keeps body content when the platform list includes PLATFORM, strips otherwise.
// After filtering the now-unused `import PlatformBlock` line is also removed.
// ---------------------------------------------------------------------------

function inlinePlatformBlocks(content) {
    const openRe  = /<PlatformBlock\s+for="([^"]+)">/g;
    const closeRe = /<\/PlatformBlock>/g;

    let result = '';
    let pos = 0;

    while (pos < content.length) {
        openRe.lastIndex  = pos;
        closeRe.lastIndex = pos;
        const openMatch  = openRe.exec(content);
        const closeMatch = closeRe.exec(content);
        const openPos    = openMatch  ? openMatch.index  : Infinity;
        const closePos   = closeMatch ? closeMatch.index : Infinity;

        if (openPos === Infinity && closePos === Infinity) {
            result += content.slice(pos);
            break;
        }

        if (closePos < openPos) {
            // Orphaned closer — pass through verbatim
            result += content.slice(pos, closePos + closeMatch[0].length);
            pos = closePos + closeMatch[0].length;
            continue;
        }

        result += content.slice(pos, openPos);
        const platforms = openMatch[1].split(',').map(s => s.trim());
        const keep      = platforms.includes(PLATFORM);
        const bodyStart = openPos + openMatch[0].length;

        let depth = 1, searchPos = bodyStart;
        let bodyEnd = content.length, closerEnd = content.length;

        while (depth > 0) {
            openRe.lastIndex  = searchPos;
            closeRe.lastIndex = searchPos;
            const nextOpen  = openRe.exec(content);
            const nextClose = closeRe.exec(content);
            const nop = nextOpen  ? nextOpen.index  : Infinity;
            const ncp = nextClose ? nextClose.index : Infinity;

            if (ncp === Infinity) {
                bodyEnd = closerEnd = content.length;
                depth = 0;
            } else if (ncp < nop) {
                depth--;
                if (depth === 0) {
                    bodyEnd   = ncp;
                    closerEnd = ncp + nextClose[0].length;
                } else {
                    searchPos = ncp + nextClose[0].length;
                }
            } else {
                depth++;
                searchPos = nop + nextOpen[0].length;
            }
        }

        if (keep) {
            result += inlinePlatformBlocks(content.slice(bodyStart, bodyEnd));
        }

        pos = closerEnd;
    }

    return result;
}

function transformMdxFile(content) {
    // 1. Resolve <PlatformBlock> tags — keep only this platform's content
    content = inlinePlatformBlocks(content);
    // 2. Remove the now-unused PlatformBlock import (if any)
    content = content.replace(/^import PlatformBlock from '[^']+';?\r?\n/m, '');
    // 3. Resolve all tokens ({Platform}, {ProductName}, etc.) in both frontmatter and body.
    content = applyReplacements(content);
    return content;
}

// ---------------------------------------------------------------------------
// 6 & 7. Sample viewer + edit buttons
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 8. TOC generation — moved to astro.config.ts (buildFilteredToc)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Full transform pipelines
// ---------------------------------------------------------------------------

function normalise(content) {
    return content.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * Convert relative image paths (../images/, ../../images/, etc.)
 * to absolute /images/ so Astro can resolve them from public/.
 */
function normalizeImagePaths(content) {
    return content.replace(/(?:\.\.\/)+images\//g, '/images/');
}

function transformRegularFile(content, componentKey = null) {
    content = filterPlatformBlocks(content);
    content = filterComponentBlocks(content, componentKey);
    content = filterCodeBlocks(content);
    content = applyReplacements(content);
    content = normalizeImagePaths(content);
    return normalise(content);
}

// ---------------------------------------------------------------------------
// 5b. Shared grid file expansion
//
// grids/_shared/*.mdx → generated/.../grids/grid/*.mdx
//                        generated/.../grids/hierarchical-grid/*.mdx
//                        generated/.../grids/tree-grid/*.mdx
//                        generated/.../grids/pivot-grid/*.mdx  (if listed)
//
// Each component has a set of token overrides mapping {ComponentTitle} etc.
// to the specific grid's values, plus a ComponentStart filter key.
// ---------------------------------------------------------------------------

/**
 * Component definitions for _shared expansion.
 * key        — matches <!-- ComponentStart: key --> blocks
 * outDir     — sub-directory under grids/ in the output
 * tokenMap   — maps {ComponentXxx} tokens to per-component replacements
 *              by pulling existing replacement values from docConfig
 */
function buildSharedComponents() {
    const r = replacements;
    const get = (name) => r.find(x => x.name === name)?.value ?? '';

    return [
        {
            key: 'Grid',
            outDir: 'grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{GridTitle}') },
                { name: '{ComponentName}',       value: get('{GridName}') },
                { name: '{ComponentModule}',     value: get('{GridModule}') },
                { name: '{ComponentSelector}',   value: get('{GridSelector}') },
                { name: '{ComponentPackage}',    value: get('{GridPackage}') },
                { name: '{ComponentSample}',     value: get('{GridSample}') },
                { name: '{ComponentKeywords}',   value: get('{GridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{GridApiMembers}') },
            ],
        },
        {
            key: 'HierarchicalGrid',
            outDir: 'hierarchical-grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{HierarchicalGridTitle}') },
                { name: '{ComponentName}',       value: get('{HierarchicalGridName}') },
                { name: '{ComponentModule}',     value: get('{HierarchicalGridModule}') },
                { name: '{ComponentSelector}',   value: get('{HierarchicalGridSelector}') },
                { name: '{ComponentPackage}',    value: get('{HierarchicalGridPackage}') },
                { name: '{ComponentSample}',     value: get('{HierarchicalGridSample}') },
                { name: '{ComponentKeywords}',   value: get('{HierarchicalGridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{HierarchicalGridApiMembers}') },
            ],
        },
        {
            key: 'TreeGrid',
            outDir: 'tree-grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{TreeGridTitle}') },
                { name: '{ComponentName}',       value: get('{TreeGridName}') },
                { name: '{ComponentModule}',     value: get('{TreeGridModule}') },
                { name: '{ComponentSelector}',   value: get('{TreeGridSelector}') },
                { name: '{ComponentPackage}',    value: get('{TreeGridPackage}') },
                { name: '{ComponentSample}',     value: get('{TreeGridSample}') },
                { name: '{ComponentKeywords}',   value: get('{TreeGridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{TreeGridApiMembers}') },
            ],
        },
        {
            key: 'PivotGrid',
            outDir: 'pivot-grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{PivotGridTitle}') },
                { name: '{ComponentName}',       value: get('{PivotGridName}') },
                { name: '{ComponentModule}',     value: get('{PivotGridModule}') },
                { name: '{ComponentSelector}',   value: get('{PivotGridSelector}') },
                { name: '{ComponentPackage}',    value: get('{PivotGridPackage}') },
                { name: '{ComponentSample}',     value: get('{PivotGridSample}') },
                { name: '{ComponentKeywords}',   value: get('{PivotGridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{PivotGridApiMembers}') },
            ],
        },
    ];
}

/**
 * For a given _shared .md file, check which components it applies to
 * by reading its sharedComponents frontmatter field.
 * Returns an array of component keys like ['Grid', 'TreeGrid', 'HierarchicalGrid'].
 */
function getSharedComponentKeys(content) {
    const m = content.match(/^sharedComponents:\s*\[([^\]]+)\]/m);
    if (!m) return null; // applies to all
    return m[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
}

/**
 * Ensure required MDX imports (Sample, PlatformBlock, ApiLink) are present
 * after the frontmatter block.
 */

function ensureMdxImports(content) {
    const needsSample  = content.includes('<Sample ');
    const needsApiLink = /<ApiLink\b/.test(content);

    const imports = [
        needsSample  && "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';",
        needsApiLink && "import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';",
    ].filter(Boolean);

    if (imports.length === 0) return content;

    // Check which imports are already present in the header section only
    // (before the first heading) to avoid false matches inside code blocks.
    const headerEnd = content.search(/^#\s/m);
    const header = headerEnd >= 0 ? content.slice(0, headerEnd) : content.slice(0, 2000);
    const newImports = imports.filter(imp => !header.includes(imp));
    if (newImports.length === 0) return content;

    // Insert after the closing --- of the frontmatter (handle both LF and CRLF)
    return content.replace(/^(---[\s\S]*?^---)\r?\n/m, `$1\n${newImports.join('\n')}\n\n`);
}

/**
 * Expand all _shared/*.mdx files into per-component output directories.
 *
 * For each component:
 *  - Filters <!-- ComponentStart/End --> blocks (keep only the target component)
 *  - Filters <!-- Platform -->...<!-- end: Platform --> blocks for current PLATFORM
 *  - Applies replacements to frontmatter only (body handled by Vite plugin at build time)
 *  - Applies component-specific token replacements to frontmatter
 *  - Adds _componentKey frontmatter so the Vite plugin resolves {Component*} tokens in body
 *  - Strips docfx-only frontmatter fields (mentionedTypes, sharedComponents, namespace)
 *  - Ensures required MDX imports are present (Sample, PlatformBlock, ApiLink)
 *  - Writes as .mdx to the per-component output directory
 */
function expandSharedFiles(sharedSrcDir, gridsOutDir) {
    if (!existsSync(sharedSrcDir)) return;

    const components = buildSharedComponents();

    for (const entry of readdirSync(sharedSrcDir)) {
        if (!/\.mdx$/.test(entry)) continue;

        const srcPath = path.join(sharedSrcDir, entry);
        const raw = readFileSync(srcPath, 'utf8');

        // Determine which components this file applies to
        const applicableKeys = getSharedComponentKeys(raw);

        for (const comp of components) {
            // Skip if not applicable
            if (applicableKeys && !applicableKeys.includes(comp.key)) continue;

            const outSubDir = path.join(gridsOutDir, comp.outDir);
            mkdirSync(outSubDir, { recursive: true });

            // 1. Filter component blocks (keep only this component's sections).
            let content = filterComponentBlocks(raw, comp.key);

            // 2. Filter <PlatformBlock> tags — keep only this platform's content.
            content = inlinePlatformBlocks(content);
            content = content.replace(/^import PlatformBlock from '[^']+';?\r?\n/m, '');

            // 3. Apply replacements + component tokens to frontmatter only.
            //    Body tokens ({Platform} etc.) are still handled by the Vite plugin
            //    at build time via _componentKey.
            const compTokens = [...comp.tokens].sort((a, b) => b.name.length - a.name.length);
            content = content.replace(/^(---[\s\S]*?^---)/m, fm => {
                let resolved = applyReplacements(fm);
                for (const { name, value } of compTokens) {
                    resolved = resolved.replaceAll(name, value);
                }
                return resolved;
            });

            // 4. Add _componentKey to frontmatter and strip docfx-only fields
            content = content.replace(/^(---)([\s\S]*?)(^---)/m, (_m, open, body, close) => {
                let fm = body
                    .replace(/^mentionedTypes:.*\r?\n/m, '')
                    .replace(/^sharedComponents:.*\r?\n/m, '')
                    .replace(/^namespace:.*\r?\n/m, '');
                // Add _componentKey if not already present
                if (!fm.includes('_componentKey:')) {
                    fm = fm.trimEnd() + `\n_componentKey: ${comp.key}\n`;
                }
                return `${open}${fm}${close}`;
            });

            // 5. Normalize image paths
            content = normalizeImagePaths(content);

            // 6. Check exclusion before writing
            const slug = `grids/${comp.outDir}/${entry.replace(/\.mdx?$/, '')}`;
            if (EXCLUDED_SLUGS.has(slug)) {
                console.log(`[generate] Skipping excluded: ${slug}`);
                continue;
            }

            // 7. Ensure MDX imports are present
            content = ensureMdxImports(content);

            // 8. Write as .mdx
            writeFileSync(path.join(outSubDir, entry), prepareMarkdownOutput(content), 'utf8');
        }

        console.log(`[generate] _shared/${entry} → grid/, hierarchical-grid/, tree-grid/, pivot-grid/`);
    }
}

// ---------------------------------------------------------------------------
// 9. Directory walker  (handles shared file expansion)
// ---------------------------------------------------------------------------

function processDir(srcDir, outDir, relBase = '') {
    mkdirSync(outDir, { recursive: true });

    for (const entry of readdirSync(srcDir)) {
        if (entry === '_shared') continue; // handled separately below
        const srcPath = path.join(srcDir, entry);

        if (/\.mdx?$/.test(entry)) {
            const slug = relBase
                ? `${relBase}/${entry.replace(/\.mdx?$/, '')}`
                : entry.replace(/\.mdx?$/, '');
            if (EXCLUDED_SLUGS.has(slug)) {
                console.log(`[generate] Skipping excluded: ${slug}`);
                continue;
            }
            const raw = readFileSync(srcPath, 'utf8');
            if (/\.mdx$/.test(entry)) {
                writeFileSync(path.join(outDir, entry), prepareMarkdownOutput(ensureMdxImports(transformMdxFile(raw))), 'utf8');
            } else {
                writeFileSync(path.join(outDir, entry), prepareMarkdownOutput(transformRegularFile(raw)), 'utf8');
            }
        } else if (entry.endsWith('.json') && entry !== 'toc.json') {
            const raw = readFileSync(srcPath, 'utf8');
            writeFileSync(path.join(outDir, entry), applyReplacements(raw), 'utf8');
        } else if (!path.extname(entry)) {
            // No extension → treat as a subdirectory
            processDir(srcPath, path.join(outDir, entry), relBase ? `${relBase}/${entry}` : entry);
        }
    }

}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log(`[generate] Platform : ${PLATFORM}`);
console.log(`[generate] Language : ${LANG}`);
console.log(`[generate] Source   : ${SRC_COMPONENTS}`);
console.log(`[generate] Output   : ${OUT_DIR}`);

if (!existsSync(SRC_COMPONENTS)) {
    console.error(`Source directory not found: ${SRC_COMPONENTS}`);
    console.error(`For lang="${LANG}", add translated files to src/content/${LANG}/components/`);
    process.exit(1);
}

// Clean the output root (generated/{PLATFORM}/{LANG}/)
const OUT_ROOT = path.dirname(OUT_DIR); // generated/{PLATFORM}/{LANG}/
if (existsSync(OUT_ROOT)) {
    rmSync(OUT_ROOT, { recursive: true, force: true });
    console.log(`[generate] Cleaned output: ${OUT_ROOT}`);
}
mkdirSync(OUT_DIR, { recursive: true });
processDir(SRC_COMPONENTS, OUT_DIR);

// Expand grids/_shared/*.mdx into per-component output directories
const sharedSrc = path.join(SRC_COMPONENTS, 'grids', '_shared');
const gridsOut  = path.join(OUT_DIR, 'grids');
expandSharedFiles(sharedSrc, gridsOut);
// generateToc()          → now done inline in astro.config.ts (buildFilteredToc)
// generateEnvironmentJson() → now read from docConfig.json.samplesBrowsers via platform-context.ts

// Write .platform.json so astro.config.mjs picks up the right platform
writeFileSync(
    path.join(ROOT, '.platform.json'),
    JSON.stringify({ platform: PLATFORM, lang: LANG }, null, 2),
    'utf8',
);

// Clear Astro's content cache so the next dev/build picks up the correct
// platform + language content rather than serving stale cached entries.
const astroCacheDir = path.join(ROOT, '.astro');
if (existsSync(astroCacheDir)) {
    rmSync(astroCacheDir, { recursive: true, force: true });
    console.log('[generate] Cleared .astro cache.');
}

console.log('[generate] Done.');

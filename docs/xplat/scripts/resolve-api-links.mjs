#!/usr/bin/env node
/**
 * resolve-api-links.mjs
 *
 * Converts bare inline-code references (e.g. `Value`, `transitionDuration`)
 * in xplat MDX files into <ApiLink> components, using the same apiMap JSON
 * files that the original igniteui-xplat-docs gulpfile uses
 * (https://github.com/IgniteUI/igniteui-xplat-docs).
 *
 * For each MDX file with `mentionedTypes:` frontmatter, the script:
 *   1. Reads the mentionedTypes list.
 *   2. Builds a lookup of every member on those types (and their base types)
 *      via the merged apiMap from all 4 platforms.
 *   3. Scans the body (outside code fences, outside JSX attributes) for
 *      inline `code` references.
 *   4. If the backticked text matches either a member of any mentioned type
 *      or a known type name, replaces the inline code with an <ApiLink>.
 *   5. Ensures `import ApiLink ...` is present.
 *
 * Usage:
 *   node scripts/resolve-api-links.mjs                # convert all en/ jp/ kr/ files
 *   node scripts/resolve-api-links.mjs --dry-run      # show what would change, no writes
 *   node scripts/resolve-api-links.mjs --file <path>  # process a single file
 *   node scripts/resolve-api-links.mjs --limit 5      # stop after 5 modified files
 *   node scripts/resolve-api-links.mjs --verbose      # log every replacement
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const XPLAT_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT  = path.resolve(XPLAT_ROOT, '..', '..');
const CONTENT_ROOT = path.join(XPLAT_ROOT, 'src', 'content');

// Locate the igniteui-xplat-docs repo.
// Resolution order:
//   1. XPLAT_DOCS_ROOT env variable (set explicitly, e.g. in CI)
//   2. Sibling directory next to this repo (standard local dev layout)
//   3. Fetch from GitHub (https://github.com/IgniteUI/igniteui-xplat-docs) — no local clone needed
const XPLAT_DOCS_ROOT_LOCAL = process.env.XPLAT_DOCS_ROOT
    ?? path.resolve(REPO_ROOT, '..', 'igniteui-xplat-docs');
const API_MAP_ROOT_LOCAL = path.join(XPLAT_DOCS_ROOT_LOCAL, 'apiMap');
const USE_LOCAL = fs.existsSync(API_MAP_ROOT_LOCAL);

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/IgniteUI/igniteui-xplat-docs/master';
const GITHUB_API_BASE = 'https://api.github.com/repos/IgniteUI/igniteui-xplat-docs';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');
const LIMIT   = (() => {
    const i = args.indexOf('--limit');
    return i >= 0 ? parseInt(args[i + 1], 10) : Infinity;
})();
const SINGLE_FILE = (() => {
    const i = args.indexOf('--file');
    return i >= 0 ? args[i + 1] : null;
})();

// -----------------------------------------------------------------------------
// 1. Load and merge apiMap JSON across all 4 platforms.
// -----------------------------------------------------------------------------

const PLATFORMS = ['Angular', 'React', 'WebComponents', 'Blazor'];

/**
 * Merged type map:
 *   originalName -> {
 *     originalName,
 *     originalNamespace,
 *     packageName,
 *     originalBaseTypeName,
 *     originalBaseTypeNamespace,
 *     isEnum, isInterface,
 *     names: { [platform]: mappedName },
 *     members: Map<originalMemberName, { originalName, names: {[platform]: mappedName} }>
 *   }
 */
const typeMap = new Map();

function ensureType(originalName) {
    let t = typeMap.get(originalName);
    if (!t) {
        t = {
            originalName,
            originalNamespace: null,
            packageName: null,
            originalBaseTypeName: null,
            originalBaseTypeNamespace: null,
            isEnum: false,
            isInterface: false,
            names: {},
            members: new Map(),
        };
        typeMap.set(originalName, t);
    }
    return t;
}

function mergeType(type) {
    const t = ensureType(type.originalName);
    if (type.originalNamespace)         t.originalNamespace = type.originalNamespace;
    if (type.packageName)               t.packageName = type.packageName;
    if (type.originalBaseTypeName)      t.originalBaseTypeName = type.originalBaseTypeName;
    if (type.originalBaseTypeNamespace) t.originalBaseTypeNamespace = type.originalBaseTypeNamespace;
    if (type.isEnum)                    t.isEnum = true;
    if (type.isInterface)               t.isInterface = true;

    if (Array.isArray(type.names)) {
        for (const n of type.names) {
            if (n.platform && n.mappedName && !t.names[n.platform]) {
                t.names[n.platform] = n.mappedName;
            }
        }
    }
    if (Array.isArray(type.members)) {
        for (const m of type.members) {
            if (!m.originalName) continue;
            let existing = t.members.get(m.originalName);
            if (!existing) {
                existing = { originalName: m.originalName, names: {} };
                t.members.set(m.originalName, existing);
            }
            for (const n of (m.names || [])) {
                if (n.platform && n.mappedName && !existing.names[n.platform]) {
                    existing.names[n.platform] = n.mappedName;
                }
            }
        }
    }
}

async function loadApiMaps() {
    let apiMapFileCount = 0;

    if (USE_LOCAL) {
        for (const platform of PLATFORMS) {
            const dir = path.join(API_MAP_ROOT_LOCAL, platform);
            if (!fs.existsSync(dir)) continue;
            for (const file of fs.readdirSync(dir)) {
                if (!file.endsWith('.apiMap.json')) continue;
                apiMapFileCount++;
                const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
                for (const t of (json.types || [])) mergeType(t);
            }
        }
        console.log(`[resolve-api-links] loaded ${apiMapFileCount} apiMap JSON file(s) from local clone, ${typeMap.size} unique types`);
        return;
    }

    // No local clone — fetch from GitHub.
    console.log('[resolve-api-links] no local igniteui-xplat-docs clone found, fetching apiMap from GitHub...');
    const headers = { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

    // Get the full tree to enumerate all apiMap JSON paths.
    const treeUrl = `${GITHUB_API_BASE}/git/trees/master?recursive=1`;
    const treeResp = await fetch(treeUrl, { headers });
    if (!treeResp.ok) {
        console.error(`[resolve-api-links] GitHub tree fetch failed: ${treeResp.status} ${treeResp.statusText}`);
        console.error(`    Tip: set GITHUB_TOKEN env variable to avoid rate limits.`);
        process.exit(2);
    }
    const treeData = await treeResp.json();
    const apiMapPaths = (treeData.tree || [])
        .filter(e => e.type === 'blob' && e.path.startsWith('apiMap/') && e.path.endsWith('.apiMap.json'))
        .map(e => e.path);

    if (apiMapPaths.length === 0) {
        console.error('[resolve-api-links] no apiMap JSON files found in GitHub tree');
        process.exit(2);
    }

    // Fetch all files in parallel.
    const results = await Promise.all(
        apiMapPaths.map(async (filePath) => {
            const url = `${GITHUB_RAW_BASE}/${filePath}`;
            const resp = await fetch(url, { headers });
            if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
            return resp.json();
        })
    );

    for (const json of results) {
        apiMapFileCount++;
        for (const t of (json.types || [])) mergeType(t);
    }
    console.log(`[resolve-api-links] fetched ${apiMapFileCount} apiMap JSON file(s) from GitHub, ${typeMap.size} unique types`);
}

await loadApiMaps();

// -----------------------------------------------------------------------------
// 2. Helpers — type / member resolution, pkg mapping.
// -----------------------------------------------------------------------------

const PACKAGE_NAME_TO_PKG = {
    'igniteui-core':         'core',
    'igniteui-charts':       'charts',
    'igniteui-data-grids':   'grids',
    'igniteui-webgrids':     'grids',
    'igniteui-excel':        'excel',
    'igniteui-spreadsheet':  'spreadsheet',
    'igniteui-spreadsheet-chart-adapter': 'spreadsheet',
    'igniteui-gauges':       'gauges',
    'igniteui-inputs':       'inputs',
    'igniteui-webinputs':    'inputs',
    'igniteui-layouts':      'layouts',
    'igniteui-maps':         'maps',
    'igniteui-dashboards':   null,
};

function pkgForType(t) {
    if (!t) return 'core';
    if (t.packageName && PACKAGE_NAME_TO_PKG[t.packageName] !== undefined) {
        return PACKAGE_NAME_TO_PKG[t.packageName] || 'core';
    }
    return 'core';
}

/**
 * Find a type by name. Falls back to the `Xam`-prefixed form because the
 * migration to MDX dropped the `Xam` prefix from `mentionedTypes` entries
 * (apiMap still uses originals like `XamBulletGraph`).
 */
function findType(name) {
    return typeMap.get(name)
        || typeMap.get('Xam' + name)
        || null;
}

/** Walk inheritance chain of `typeName`, calling visit(type) for each. */
function* walkBaseTypes(typeName) {
    const seen = new Set();
    let cur = findType(typeName);
    while (cur && !seen.has(cur.originalName)) {
        seen.add(cur.originalName);
        yield cur;
        if (!cur.originalBaseTypeName) break;
        cur = findType(cur.originalBaseTypeName);
    }
}

/** Display name strips Xam prefix so docs read naturally. */
function shortTypeName(originalName) {
    return originalName.startsWith('Xam') ? originalName.slice(3) : originalName;
}

/**
 * Resolve a backticked identifier against mentionedTypes.
 * Returns { kind: 'member'|'type', type, member?, originalText }
 * or null if no match.
 */
function resolveIdentifier(ident, mentionedTypes, mentionedPkgs) {
    // 0. If ident exactly matches a type name listed in mentionedTypes, prefer
    //    the type match over any coincidental member match on another type.
    //    e.g. `Grid` listed in mentionedTypes should resolve to the Grid component,
    //    not to DataGridCellEventArgs.grid member.
    if (mentionedTypes.includes(ident)) {
        const directType = findType(ident);
        if (directType) return { kind: 'type', type: directType };
    }

    // 1. Member match against each mentioned type's inheritance chain.
    //    (Member match wins over a coincidentally-matching unrelated type.)
    for (const mt of mentionedTypes) {
        for (const t of walkBaseTypes(mt)) {
            if (t.members.has(ident)) {
                return {
                    kind:   'member',
                    type:   findType(mt) || t,
                    member: t.members.get(ident),
                };
            }
        }
    }
    // 2. Direct type match — but only when the candidate type belongs to the
    //    same package as one of the mentionedTypes. Avoids cross-package
    //    false positives (e.g. `ChartTitle` matching the unrelated Excel type
    //    in a charts file).
    const directType = findType(ident);
    if (directType) {
        const candidatePkg = pkgForType(directType);
        if (mentionedPkgs.has(candidatePkg) || mentionedTypes.includes(directType.originalName)
            || mentionedTypes.includes(shortTypeName(directType.originalName))) {
            return { kind: 'type', type: directType };
        }
    }
    return null;
}

/** Pick the camelCase / JS-style member name from Angular/React/WC. */
function jsMemberName(member) {
    return member.names.Angular || member.names.React || member.names.WebComponents
        || member.names.Blazor || member.originalName;
}

// -----------------------------------------------------------------------------
// 3. MDX scanning — find inline-code outside code fences / JSX attributes.
// -----------------------------------------------------------------------------

const IMPORT_LINE = `import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';`;

function hasApiLinkImport(text) {
    return /import\s+ApiLink\s+from\s+['"][^'"]*ApiLink\.astro['"]/m.test(text);
}

function addApiLinkImport(text) {
    if (hasApiLinkImport(text)) return text;
    // Only look at the top-of-file import block (after frontmatter, before any
    // heading/content). This avoids picking up `import …` lines inside code
    // fences further down the file.
    const fmEnd = text.startsWith('---') ? text.indexOf('\n---', 4) : -1;
    let scanStart = fmEnd >= 0 ? fmEnd + 4 : 0;
    // Skip leading newlines/whitespace.
    while (scanStart < text.length && /[\r\n]/.test(text[scanStart])) scanStart++;

    // Walk lines: stop at the first line that isn't blank and isn't an
    // `import …;` line.
    let pos = scanStart;
    let lastImportEnd = -1;
    while (pos < text.length) {
        const nlIdx = text.indexOf('\n', pos);
        const lineEnd = nlIdx < 0 ? text.length : nlIdx;
        const line = text.slice(pos, lineEnd).replace(/\r$/, '');
        if (line.trim() === '') {
            // blank — keep scanning
        } else if (/^import\s.*;\s*$/.test(line)) {
            lastImportEnd = lineEnd; // position of '\n' (or end)
        } else {
            break; // hit non-import content
        }
        if (nlIdx < 0) break;
        pos = nlIdx + 1;
    }

    if (lastImportEnd >= 0) {
        // Place the new import directly after the last import line and any
        // trailing blank lines that follow it, ensuring exactly one blank
        // line separates the new import from following content.
        let insertAt = lastImportEnd;
        if (text[insertAt] === '\n') insertAt++;
        // Skip subsequent blank lines.
        while (insertAt < text.length) {
            const c0 = text[insertAt];
            const c1 = text[insertAt + 1];
            if (c0 === '\n')                { insertAt++; continue; }
            if (c0 === '\r' && c1 === '\n') { insertAt += 2; continue; }
            if (c0 === '\r')                { insertAt++; continue; }
            break;
        }
        return text.slice(0, insertAt) + IMPORT_LINE + '\n\n' + text.slice(insertAt);
    }

    // No top-level imports — insert right after frontmatter (or at the
    // beginning of file when no frontmatter is present).
    if (fmEnd >= 0) {
        let insertAt = fmEnd + 4;
        if (text[insertAt] === '\r') insertAt++;
        if (text[insertAt] === '\n') insertAt++;
        return text.slice(0, insertAt) + IMPORT_LINE + '\n\n' + text.slice(insertAt);
    }
    return IMPORT_LINE + '\n\n' + text;
}

function parseFrontmatter(text) {
    if (!text.startsWith('---')) return { fm: null, body: text, fmRaw: '' };
    const end = text.indexOf('\n---', 3);
    if (end < 0) return { fm: null, body: text, fmRaw: '' };
    const raw = text.slice(0, end + 4);
    // Very small YAML subset — we only need `mentionedTypes`.
    const fm = {};
    const mtMatch = raw.match(/^mentionedTypes:\s*\[([^\]]*)\]/m);
    if (mtMatch) {
        fm.mentionedTypes = mtMatch[1]
            .split(',')
            .map(s => s.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
    } else {
        fm.mentionedTypes = [];
    }
    return { fm, body: text.slice(end + 4), fmRaw: raw };
}

/** Build ApiLink JSX from a resolved match. */
function buildApiLink(match, originalText) {
    const t        = match.type;
    const pkg      = pkgForType(t);
    const isEnum   = t.isEnum;
    const isIface  = t.isInterface;
    const kind     = isEnum ? 'enum' : (isIface ? 'interface' : 'class');

    // Strip backtick-N generic arity suffix (e.g. "SortSettings`1" → "SortSettings").
    const shortName = shortTypeName(t.originalName).replace(/`\d+$/, '');

    const props = [];
    if (pkg !== 'core') props.push(`pkg="${pkg}"`);
    if (kind !== 'class') props.push(`kind="${kind}"`);
    props.push(`type="${shortName}"`);

    if (match.kind === 'member') {
        props.push(`member="${jsMemberName(match.member)}"`);
        props.push(`label="${originalText}"`);
    }
    return `<ApiLink ${props.join(' ')} />`;
}

/**
 * Walk the MDX body line-by-line, skipping fenced code blocks (``` … ```)
 * and JSX attribute values, then replace inline `…` matches.
 */
function transformBody(body, mentionedTypes, mentionedPkgs, stats) {
    const lines = body.split('\n');
    let inFence = false;
    let fenceMarker = '';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const fenceMatch = line.match(/^(\s*)(```+|~~~+)/);
        if (fenceMatch) {
            if (!inFence) {
                inFence = true;
                fenceMarker = fenceMatch[2];
            } else if (line.includes(fenceMarker)) {
                inFence = false;
                fenceMarker = '';
            }
            continue;
        }
        if (inFence) continue;

        // Replace inline `…` outside JSX attributes.
        // Strategy: split the line on JSX tag boundaries; only process text
        // segments that are not inside <... ...> tags. A simple heuristic
        // that handles the common case (we don't need a full JSX parser).
        lines[i] = replaceInlineCodeOutsideTags(line, mentionedTypes, mentionedPkgs, stats);
    }
    return lines.join('\n');
}

function replaceInlineCodeOutsideTags(line, mentionedTypes, mentionedPkgs, stats) {
    // Tokenize: split into runs of "inside-tag" and "outside-tag".
    // Naive: a "<" begins a tag, ">" ends it. Inside a tag we never touch
    // backticks. Outside, we run the inline-code regex.
    let out = '';
    let i = 0;
    let inTag = false;
    let buffer = '';
    while (i < line.length) {
        const ch = line[i];
        if (!inTag && ch === '<' && /[A-Za-z/!]/.test(line[i + 1] || '')) {
            // Flush buffer with replacements.
            out += processOutside(buffer, mentionedTypes, mentionedPkgs, stats);
            buffer = '';
            inTag = true;
            out += ch;
        } else if (inTag && ch === '>') {
            out += ch;
            inTag = false;
        } else if (inTag) {
            out += ch;
        } else {
            buffer += ch;
        }
        i++;
    }
    if (buffer) out += processOutside(buffer, mentionedTypes, mentionedPkgs, stats);
    return out;
}

const INLINE_CODE_RE = /`([A-Za-z_][A-Za-z0-9_]*)`/g;

function processOutside(segment, mentionedTypes, mentionedPkgs, stats) {
    return segment.replace(INLINE_CODE_RE, (full, ident) => {
        const resolved = resolveIdentifier(ident, mentionedTypes, mentionedPkgs);
        if (!resolved) return full;
        const replacement = buildApiLink(resolved, ident);
        stats.replacements++;
        if (VERBOSE) {
            console.log(`   \`${ident}\` -> ${replacement}`);
        }
        return replacement;
    });
}

// -----------------------------------------------------------------------------
// 4. File iteration.
// -----------------------------------------------------------------------------

function* walkMdx(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walkMdx(full);
        else if (entry.isFile() && entry.name.endsWith('.mdx')) yield full;
    }
}

/**
 * If the MDX file has no `mentionedTypes:`, fall back to reading the
 * corresponding original .md from the sibling igniteui-xplat-docs repo
 * (https://github.com/IgniteUI/igniteui-xplat-docs).
 */
function loadMentionedTypesFromOriginal(mdxPath) {
    const rel = path.relative(CONTENT_ROOT, mdxPath).replace(/\\/g, '/');
    const mdPath = path.join(ORIG_DOC_ROOT, rel).replace(/\.mdx$/, '.md');
    if (!fs.existsSync(mdPath)) return [];
    const raw = fs.readFileSync(mdPath, 'utf8');
    if (!raw.startsWith('---')) return [];
    const end = raw.indexOf('\n---', 3);
    if (end < 0) return [];
    const fmRaw = raw.slice(0, end + 4);
    const m = fmRaw.match(/^mentionedTypes:\s*\[([^\]]*)\]/m);
    if (!m) return [];
    return m[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}

/** Derive additional mentioned types from any existing <ApiLink type="X"> already in the body. */
function deriveMentionedTypesFromBody(body) {
    const found = new Set();
    const re = /<ApiLink\b[^>]*\btype="([A-Za-z_][A-Za-z0-9_]*)"/g;
    let m;
    while ((m = re.exec(body))) found.add(m[1]);
    return [...found];
}

function processFile(file) {
    const text = fs.readFileSync(file, 'utf8');
    const { fm, body, fmRaw } = parseFrontmatter(text);
    if (!fm) return null;

    let mentionedTypes = fm.mentionedTypes;
    if (mentionedTypes.length === 0) {
        mentionedTypes = loadMentionedTypesFromOriginal(file);
    }
    // Augment with any types already referenced via existing <ApiLink>.
    const fromBody = deriveMentionedTypesFromBody(body);
    if (fromBody.length) {
        const seen = new Set(mentionedTypes);
        for (const t of fromBody) if (!seen.has(t)) { mentionedTypes.push(t); seen.add(t); }
    }
    if (mentionedTypes.length === 0) return null;

    const stats = { replacements: 0 };
    const mentionedPkgs = new Set();
    for (const mt of mentionedTypes) {
        const t = findType(mt);
        if (t) mentionedPkgs.add(pkgForType(t));
    }
    let newBody = transformBody(body, mentionedTypes, mentionedPkgs, stats);
    if (stats.replacements === 0) return null;

    let newText = fmRaw + newBody;
    newText = addApiLinkImport(newText);
    return { newText, stats };
}

const allFiles = SINGLE_FILE
    ? [path.resolve(SINGLE_FILE)]
    : [...walkMdx(path.join(CONTENT_ROOT, 'en')),
       ...walkMdx(path.join(CONTENT_ROOT, 'jp')),
       ...walkMdx(path.join(CONTENT_ROOT, 'kr'))];

let modified = 0;
let totalRepl = 0;
for (const file of allFiles) {
    if (modified >= LIMIT) break;
    const result = processFile(file);
    if (!result) continue;
    const rel = path.relative(XPLAT_ROOT, file).replace(/\\/g, '/');
    console.log(`${DRY_RUN ? '[dry]' : '[fix]'} ${rel}  (+${result.stats.replacements} ApiLinks)`);
    totalRepl += result.stats.replacements;
    modified++;
    if (!DRY_RUN) fs.writeFileSync(file, result.newText, 'utf8');
}

console.log(`\n[resolve-api-links] ${DRY_RUN ? 'would update' : 'updated'} ${modified} file(s), ${totalRepl} total ApiLink replacements`);

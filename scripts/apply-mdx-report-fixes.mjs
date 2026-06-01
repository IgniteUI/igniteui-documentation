#!/usr/bin/env node
/**
 * apply-mdx-report-fixes.mjs
 *
 * Reads all mdx-link-report-*.md files and applies the suggested fixes to
 * the MDX source files. Handles three fix types:
 *
 *   excludeSuffixFor="Platform"  — suffix (e.g. "Component") is wrong for this
 *                                  platform; suppresses classSuffix for the given
 *                                  platforms without hiding the link entirely.
 *   exclude="Platform"           — symbol absent from this platform's API; renders
 *                                  as plain inline code instead of a broken link.
 *   excludePrefixFor="Platform"  — platform prefix (Igx/Igr/Igc/Igb) should not
 *                                  be prepended for the given platforms.
 *
 * Angular-report paths are remapped to xplat source because sync-generated.mjs
 * overwrites docs/angular/src/content from docs/xplat/src/content (except grids/
 * and changelog/, which Angular owns directly).
 *
 * Usage:
 *   node scripts/apply-mdx-report-fixes.mjs
 *   node scripts/apply-mdx-report-fixes.mjs --dry-run
 */

import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry-run');

const PLATFORM_REPORTS = [
    ['Angular',       'mdx-link-report-angular.md'],
    ['React',         'mdx-link-report-react.md'],
    ['WebComponents', 'mdx-link-report-wc.md'],
    ['Blazor',        'mdx-link-report-blazor.md'],
];

// ─── Path mapping ─────────────────────────────────────────────────────────────

// Angular docs/angular/src/content/* is generated from docs/xplat/src/content/*
// via sync-generated.mjs, EXCEPT grids/ and changelog/ which Angular owns.
function mapAngularPath(p) {
    const m = p.match(/^docs\/angular\/src\/content\/(en|jp)\/components\/(.+)$/);
    if (!m) return p;
    const [, lang, rest] = m;
    if (rest.startsWith('grids/') || rest.startsWith('changelog/')) return p;
    return `docs/xplat/src/content/${lang}/components/${rest}`;
}

// ─── Type name helpers ────────────────────────────────────────────────────────

const PREFIX_RE = /^(Igr|Igx|Igc|Igb)/;
const SUFFIX_RE = /(Component|Module|Directive|Element)$/;
const stripPrefix = n => n.replace(PREFIX_RE, '');
const stripSuffix = n => n.replace(SUFFIX_RE, '');

// Produce the variants of a URL type name that might appear as `type=` in MDX.
// e.g. "IgxChartSelectionComponent" → ["ChartSelectionComponent", "ChartSelection"]
//      "IgxSpreadsheet"             → ["Spreadsheet"]
//      "SortSettings"               → ["SortSettings"]
function baseVariants(name) {
    const noPrefix = stripPrefix(name);
    const noSuffix = stripSuffix(noPrefix);
    return noSuffix !== noPrefix ? [noPrefix, noSuffix] : [noPrefix];
}

// ─── Report parsing ───────────────────────────────────────────────────────────

function parseReport(reportPath, platform) {
    let text;
    try { text = readFileSync(reportPath, 'utf8'); } catch { return []; }

    const entries = [];
    const lines = text.split(/\r?\n/);
    let cur = null;   // {types[], member, kind, fixType}
    let files = [];   // files seen since last URL block

    function flush() {
        if (cur?.fixType && files.length > 0) {
            for (const file of [...new Set(files)]) {
                for (const type of cur.types) {
                    entries.push({
                        file,
                        type,
                        member: cur.member,
                        kind: cur.kind,
                        fixType: cur.fixType,
                        platform,
                    });
                }
            }
        }
        cur = null;
        files = [];
    }

    const SEG_MAP = {
        classes: 'class', interfaces: 'interface', enums: 'enum',
        types: 'type', variables: 'variable', functions: 'function',
    };

    for (const line of lines) {
        // New URL entry
        const urlM = line.match(/^\s+- URL:\s+`([^`]+)`/);
        if (urlM) {
            flush();
            const url = urlM[1];
            const m = url.match(/\/(classes|interfaces|enums|types|variables|functions)\/([^#?/]+)(?:#(.+))?$/);
            if (m) {
                cur = {
                    types: baseVariants(m[2]),
                    member: (m[3] || '').toLowerCase(),
                    kind: SEG_MAP[m[1]] || 'class',
                    fixType: null,
                };
            }
            continue;
        }

        // FIX suggestion
        const fixM = line.match(/^\s+- \*\*FIX\*\*:\s+`([^`]+)`/);
        if (fixM && cur) {
            const s = fixM[1];
            if (s.startsWith('excludeSuffixFor='))      cur.fixType = 'excludeSuffixFor';
            else if (s.startsWith('exclude='))           cur.fixType = 'exclude';
            else if (s.startsWith('excludePrefixFor='))  cur.fixType = 'excludePrefixFor';
            continue;
        }

        // File reference
        const inM = line.match(/^\s+- in:\s+`([^`]+)`/);
        if (inM && cur?.fixType) {
            const raw = inM[1].replace(/\\/g, '/');
            files.push(mapAngularPath(raw));
        }
    }
    flush();
    return entries;
}

// ─── Fix map builder ──────────────────────────────────────────────────────────

// Returns: Map<file, Map<"type|member|kind", {excludeSuffixFor, exclude, excludePrefixFor}>>
function buildFixMap() {
    const result = new Map();

    for (const [platform, reportPath] of PLATFORM_REPORTS) {
        for (const e of parseReport(reportPath, platform)) {
            if (!result.has(e.file)) result.set(e.file, new Map());
            const fileMap = result.get(e.file);
            const key = `${e.type}|${e.member}|${e.kind}`;
            if (!fileMap.has(key)) {
                fileMap.set(key, {
                    excludeSuffixFor: new Set(),
                    exclude: new Set(),
                    excludePrefixFor: new Set(),
                });
            }
            fileMap.get(key)[e.fixType].add(e.platform);
        }
    }
    return result;
}

// ─── Tag patching ─────────────────────────────────────────────────────────────

const API_LINK_RE = /<ApiLink\b[^/>]*\/>/g;

function getAttr(tag, name) {
    const m = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|\\{([^}]*)\\})`));
    if (!m) return undefined;
    if (m[1] !== undefined) return m[1];
    if (m[2] !== undefined) return m[2];
    if (m[3] === 'true') return true;
    if (m[3] === 'false') return false;
    return m[3];
}

function setStringAttr(tag, attrName, value) {
    const re = new RegExp(`\\s+${attrName}=(?:"[^"]*"|'[^']*'|\\{[^}]*\\})`);
    if (re.test(tag)) {
        return tag.replace(re, ` ${attrName}="${value}"`);
    }
    return tag.replace(/\s*\/>$/, ` ${attrName}="${value}" />`);
}

function mergeStringAttr(tag, attrName, newPlatforms) {
    if (newPlatforms.size === 0) return { tag, changed: false };
    const existing = getAttr(tag, attrName);
    const merged = new Set(newPlatforms);
    if (typeof existing === 'string') {
        for (const p of existing.split(',').map(s => s.trim()).filter(Boolean)) merged.add(p);
    }
    const mergedStr = [...merged].sort().join(',');
    if (typeof existing === 'string' && existing === mergedStr) return { tag, changed: false };
    return { tag: setStringAttr(tag, attrName, mergedStr), changed: true };
}

function processFile(filePath, fileMap) {
    let content;
    try { content = readFileSync(filePath, 'utf8'); } catch {
        console.warn(`  ⚠  Cannot read: ${filePath}`);
        return 0;
    }

    const parts = [];
    let last = 0;
    let changes = 0;
    API_LINK_RE.lastIndex = 0;
    let m;

    while ((m = API_LINK_RE.exec(content)) !== null) {
        const tag = m[0];
        parts.push(content.slice(last, m.index));
        last = m.index + tag.length;

        const rawType = getAttr(tag, 'type');
        if (!rawType || typeof rawType !== 'string' || /[{}]/.test(rawType)) {
            parts.push(tag);
            continue;
        }

        const member = String(getAttr(tag, 'member') || '').toLowerCase();
        const kind = String(getAttr(tag, 'kind') || 'class');
        const key = `${rawType}|${member}|${kind}`;

        const fix = fileMap.get(key);
        if (!fix) { parts.push(tag); continue; }

        let newTag = tag;
        let tagChanged = false;

        for (const attr of ['excludeSuffixFor', 'exclude', 'excludePrefixFor']) {
            const { tag: patched, changed } = mergeStringAttr(newTag, attr, fix[attr]);
            if (changed) { newTag = patched; tagChanged = true; changes++; }
        }

        parts.push(tagChanged ? newTag : tag);
    }

    parts.push(content.slice(last));
    if (changes === 0) return 0;
    if (!DRY) writeFileSync(filePath, parts.join(''));
    return changes;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const fixMap = buildFixMap();
let totalFiles = 0, totalChanges = 0;

for (const [file, fileMap] of fixMap) {
    const c = processFile(file, fileMap);
    if (c > 0) {
        totalFiles++;
        totalChanges += c;
        console.log(`${DRY ? '[dry] ' : ''}${file}  (+${c})`);
    }
}

console.log(`\n${DRY ? '[dry-run] ' : ''}Files: ${totalFiles}, Tags updated: ${totalChanges}`);

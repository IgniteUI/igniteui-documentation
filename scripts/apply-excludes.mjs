#!/usr/bin/env node
/**
 * apply-excludes.mjs
 *
 * Reads mdx-link-report-*.md files and applies exclude="Platform" to ApiLink
 * tags where the fix suggestion is `exclude=` (symbol absent from that platform).
 *
 * For excludeSuffixFor/excludePrefixFor fixes use apply-mdx-report-fixes.mjs,
 * which handles all three fix types in a single pass.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry-run');
const PLATFORM_REPORTS = [
    ['Angular',      'mdx-link-report-angular.md'],
    ['React',        'mdx-link-report-react.md'],
    ['WebComponents','mdx-link-report-wc.md'],
    ['Blazor',       'mdx-link-report-blazor.md'],
];

// Angular content (except grids/ and changelog/) is synced from xplat via
// sync-generated.mjs — redirect those paths to the xplat source.
function mapAngularPath(p) {
    const m = p.match(/^docs\/angular\/src\/content\/(en|jp)\/components\/(.+)$/);
    if (!m) return p;
    const [, lang, rest] = m;
    if (rest.startsWith('grids/') || rest.startsWith('changelog/')) return p;
    return `docs/xplat/src/content/${lang}/components/${rest}`;
}

const PREFIX_RE = /^(Igr|Igx|Igc|Igb)/;
const SUFFIX_RE = /(Component|Module|Directive|Element)$/;
const stripPrefix = (n) => n.replace(PREFIX_RE, '');
const stripSuffix = (n) => n.replace(SUFFIX_RE, '');
const baseVariants = (n) => {
    const p = stripPrefix(n);
    const ps = stripSuffix(p);
    return ps !== p ? [p, ps] : [p];
};

function parseReport(path) {
    let text;
    try { text = readFileSync(path, 'utf8'); } catch { return []; }
    const lines = text.split(/\r?\n/);
    const out = [];
    let current = null;
    let isExcludeFix = false;
    for (const line of lines) {
        const urlMatch = line.match(/^\s+- URL:\s+`([^`]+)`/);
        if (urlMatch) {
            current = null;
            isExcludeFix = false;
            const url = urlMatch[1];
            const m = url.match(/\/(classes|interfaces|enums|types|variables|functions)\/([^#?]+)(?:#(.+))?$/);
            if (m) {
                const segMap = { classes: 'class', interfaces: 'interface', enums: 'enum', types: 'type', variables: 'variable', functions: 'function' };
                current = { types: baseVariants(m[2]), member: (m[3] || '').toLowerCase(), kind: segMap[m[1]] };
            }
            continue;
        }
        // Only collect entries where the report suggests exclude= (not excludeSuffixFor)
        const fixMatch = line.match(/^\s+- \*\*FIX\*\*:\s+`([^`]+)`/);
        if (fixMatch) {
            isExcludeFix = fixMatch[1].startsWith('exclude=');
            continue;
        }
        const inMatch = line.match(/^\s+- in:\s+`([^`]+)`/);
        if (inMatch && current && isExcludeFix) {
            const file = mapAngularPath(inMatch[1].replace(/\\/g, '/'));
            out.push({ file, types: current.types, member: current.member, kind: current.kind });
        }
    }
    return out;
}

function buildBrokenMap() {
    const m = new Map();
    for (const [plat, path] of PLATFORM_REPORTS) {
        for (const e of parseReport(path)) {
            if (!m.has(e.file)) m.set(e.file, new Map());
            const fileMap = m.get(e.file);
            for (const t of e.types) {
                const key = `${t}|${e.member}|${e.kind}`;
                if (!fileMap.has(key)) fileMap.set(key, new Set());
                fileMap.get(key).add(plat);
            }
        }
    }
    return m;
}

const API_LINK_RE = /<ApiLink\b[^/>]*\/>/g;
const getAttr = (tag, name) => {
    const m = tag.match(new RegExp(`\\s${name}=(["'])([^"']*)\\1`));
    return m ? m[2] : null;
};
const setExcludeAttr = (tag, platforms) => {
    const list = [...platforms].sort().join(',');
    if (/\sexclude=(["'])[^"']*\1/.test(tag)) {
        return tag.replace(/\sexclude=(["'])[^"']*\1/, ` exclude="${list}"`);
    }
    return tag.replace(/\s*\/>$/, ` exclude="${list}" />`);
};

function processFile(file, fileMap) {
    let content;
    try { content = readFileSync(file, 'utf8'); } catch { return 0; }
    let changes = 0;
    const out = [];
    let last = 0;
    API_LINK_RE.lastIndex = 0;
    let m;
    while ((m = API_LINK_RE.exec(content)) !== null) {
        const tag = m[0];
        out.push(content.slice(last, m.index));
        last = m.index + tag.length;
        const rawType = getAttr(tag, 'type');
        if (!rawType || /[{}]/.test(rawType)) { out.push(tag); continue; }
        const base = stripPrefix(rawType);
        const member = (getAttr(tag, 'member') || '').toLowerCase();
        const kind = getAttr(tag, 'kind') || 'class';
        const key = `${base}|${member}|${kind}`;
        const brokenPlatforms = fileMap.get(key);
        if (!brokenPlatforms || brokenPlatforms.size === 0) { out.push(tag); continue; }

        const existing = getAttr(tag, 'exclude');
        const merged = new Set(brokenPlatforms);
        if (existing) for (const p of existing.split(',').map(s => s.trim()).filter(Boolean)) merged.add(p);

        if (existing) {
            const existingSet = new Set(existing.split(',').map(s => s.trim()));
            let same = existingSet.size === merged.size;
            for (const p of merged) if (!existingSet.has(p)) { same = false; break; }
            if (same) { out.push(tag); continue; }
        }
        out.push(setExcludeAttr(tag, merged));
        changes++;
    }
    out.push(content.slice(last));
    if (changes === 0) return 0;
    if (!DRY) writeFileSync(file, out.join(''));
    return changes;
}

const brokenMap = buildBrokenMap();
let totalFiles = 0, totalChanges = 0;
for (const [file, fileMap] of brokenMap) {
    const c = processFile(file, fileMap);
    if (c > 0) {
        totalFiles++;
        totalChanges += c;
        console.log(`${DRY ? '[dry] ' : ''}${file}  (+${c})`);
    }
}
console.log(`\n${DRY ? '[dry-run] ' : ''}Files: ${totalFiles}, Tags updated: ${totalChanges}`);

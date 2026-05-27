#!/usr/bin/env node
/**
 * apply-react-platform-fixes.mjs
 *
 * Report-driven fix: reads api-link-report-react.md, extracts (file, brokenUrl)
 * pairs, and for each ApiLink tag in those files whose resolved URL matches a
 * broken URL applies one of two transformations:
 *
 *   1) FORCE_REACT_INTERFACE (type is a "class" per apiMap but actually an
 *      "interface" in React TypeDoc): emit a 2-platform split where the React
 *      tag carries kind="interface" and the other platforms keep the original.
 *
 *   2) REACT_MISSING (type doesn't exist in React TypeDoc at all): wrap the
 *      original tag in <PlatformBlock for="Angular,Blazor,WebComponents">.
 *
 * Idempotent: skips tags already inside a PlatformBlock that excludes React,
 * or already carrying kind="interface" (for FORCE_REACT_INTERFACE).
 *
 * Usage:
 *   node scripts/apply-react-platform-fixes.mjs [--dry-run] [--report=PATH]
 */

import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry-run');
const REPORT = (process.argv.find(a => a.startsWith('--report=')) || '--report=api-link-report-react.md').slice('--report='.length);

const FORCE_REACT_INTERFACE = new Set([
    'Column', 'ClipboardOptions', 'ForOfState', 'GroupingExpression',
    'PivotKeys', 'SummaryResult', 'GroupByRowSelectorTemplateDetails',
]);

const PREFIX_RE = /^(Igr|Igx|Igc|Igb)/;
const stripPrefix = (n) => n.replace(PREFIX_RE, '');

// -------- Parse report --------

/**
 * Returns Map<file, Array<{type, member}>> for broken React links.
 * Both `type` and `member` are normalized (prefix stripped, member may be '').
 */
function parseReport(path) {
    const text = readFileSync(path, 'utf8');
    const lines = text.split(/\r?\n/);
    const result = new Map();

    let current = null; // { type, member }
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const urlMatch = line.match(/^\s+- URL:\s+`([^`]+)`/);
        if (urlMatch) {
            const url = urlMatch[1];
            const m = url.match(/\/(?:classes|interfaces|enums)\/([^#?]+)(?:#(.+))?$/);
            current = m ? { type: stripPrefix(m[1]), member: m[2] || '' } : null;
            continue;
        }
        const inMatch = line.match(/^\s+- in:\s+`([^`]+)`/);
        if (inMatch && current) {
            const file = inMatch[1].replace(/\\/g, '/');
            if (!result.has(file)) result.set(file, []);
            result.get(file).push({ ...current });
        }
    }
    return result;
}

// -------- Tag transforms --------

const API_LINK_RE = /<ApiLink\b[^/>]*\/>/g;
const PB_OPEN_RE = /<PlatformBlock\s+for="([^"]+)"\s*>/g;
const PB_CLOSE_TAG = '</PlatformBlock>';

const platformsOf = (s) => new Set(s.split(',').map(x => x.trim()));

function enclosingPlatformBlock(text, offset) {
    PB_OPEN_RE.lastIndex = 0;
    let m;
    let result = null;
    while ((m = PB_OPEN_RE.exec(text)) !== null) {
        if (m.index > offset) break;
        const openEnd = m.index + m[0].length;
        const closeAt = text.indexOf(PB_CLOSE_TAG, openEnd);
        if (closeAt < 0) continue;
        if (offset >= openEnd && offset < closeAt) {
            result = { platforms: platformsOf(m[1]), start: m.index, end: closeAt + PB_CLOSE_TAG.length };
        }
    }
    return result;
}

const getAttr = (tag, name) => {
    const m = tag.match(new RegExp(`\\s${name}="([^"]+)"`));
    return m ? m[1] : null;
};

const tagWithKind = (tag, kind) => {
    if (/\skind=(["'])[^"']+\1/.test(tag)) {
        return tag.replace(/\skind=(["'])[^"']+\1/, ` kind="${kind}"`);
    }
    return tag.replace(/(\stype=")/, ` kind="${kind}"$1`);
};

/**
 * Returns the broken entry that matches this ApiLink tag, or null.
 * Match requires: type matches (after prefix-strip) AND member matches
 * (both empty or identical).
 */
function matchBroken(tag, brokenList) {
    const rawType = getAttr(tag, 'type');
    if (!rawType) return null;
    if (/[{}]/.test(rawType)) return null;
    const base = stripPrefix(rawType);
    const tagMember = getAttr(tag, 'member') || '';
    for (const b of brokenList) {
        if (b.type === base && b.member === tagMember) return b;
    }
    return null;
}

function transformTag(tag, brokenList, content, offset) {
    const matched = matchBroken(tag, brokenList);
    if (!matched) return null;

    const enclosing = enclosingPlatformBlock(content, offset);
    if (enclosing && !enclosing.platforms.has('React')) return null;
    if (enclosing && enclosing.platforms.size === 1 && enclosing.platforms.has('React')) return null;

    const base = matched.type;
    const isInterface = FORCE_REACT_INTERFACE.has(base);

    const enclosingPlatforms = enclosing ? [...enclosing.platforms] : ['React', 'Angular', 'Blazor', 'WebComponents'];
    const others = enclosingPlatforms.filter(p => p !== 'React');

    if (isInterface) {
        if (/\skind=(["'])interface\1/.test(tag)) return null;
        const reactTag = tagWithKind(tag, 'interface');
        const reactBlock = `<PlatformBlock for="React">${reactTag}</PlatformBlock>`;
        if (others.length === 0) return reactBlock;
        return `${reactBlock}<PlatformBlock for="${others.join(',')}">${tag}</PlatformBlock>`;
    }
    if (others.length === 0) return null;
    return `<PlatformBlock for="${others.join(',')}">${tag}</PlatformBlock>`;
}

function processFile(file, brokenList) {
    let content;
    try {
        content = readFileSync(file, 'utf8');
    } catch {
        console.warn(`!! skip missing: ${file}`);
        return 0;
    }
    let changes = 0;
    const out = [];
    let last = 0;
    API_LINK_RE.lastIndex = 0;
    let m;
    while ((m = API_LINK_RE.exec(content)) !== null) {
        const tag = m[0];
        const replacement = transformTag(tag, brokenList, content, m.index);
        out.push(content.slice(last, m.index));
        if (replacement) {
            out.push(replacement);
            changes++;
        } else {
            out.push(tag);
        }
        last = m.index + tag.length;
    }
    out.push(content.slice(last));
    if (changes === 0) return 0;

    let final = out.join('');
    if (!/import\s+PlatformBlock\s+from\s+['"]/.test(final)) {
        const importLine = `import PlatformBlock from 'igniteui-astro-components/components/mdx/PlatformBlock.astro';\n`;
        const startOfFm = final.startsWith('---') ? final.indexOf('\n---', 3) : -1;
        if (startOfFm >= 0) {
            final = final.slice(0, startOfFm + 4) + '\n' + importLine + final.slice(startOfFm + 4);
        } else {
            final = importLine + final;
        }
    }
    if (!DRY) writeFileSync(file, final);
    return changes;
}

// -------- Run --------

const reportMap = parseReport(REPORT);
let totalChanges = 0;
let filesChanged = 0;
for (const [file, brokenList] of reportMap) {
    const c = processFile(file, brokenList);
    if (c > 0) {
        filesChanged++;
        totalChanges += c;
        console.log(`${DRY ? '[dry] ' : ''}${file}  (+${c})`);
    } else {
        console.log(`     (no-change) ${file}`);
    }
}
console.log(`\n${DRY ? '[dry-run] ' : ''}Files in report: ${reportMap.size}, Files changed: ${filesChanged}, Tags transformed: ${totalChanges}`);

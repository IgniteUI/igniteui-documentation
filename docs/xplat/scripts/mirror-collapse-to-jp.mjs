#!/usr/bin/env node
/**
 * mirror-collapse-to-jp.mjs
 *
 * Applies a topic's collapse to the Japanese copy of the same topic.
 *
 * The translated topics carry the same code blocks as the English ones — 41 of bullet-graph's 42
 * were byte-identical — with only the prose translated. So a collapse is the same substitution on
 * both sides, and doing them together is the only way they stay together: the one time it was left
 * for later, the Japanese copy silently kept a section the English one had already collapsed.
 *
 * Works from the English file's json-snippet fences, in order, against the Japanese file's snippet
 * groups, in order. Both are grouped the same way — a run of blocks with nothing but whitespace
 * between them — and the group count has to agree, or nothing is written: a topic whose two copies
 * have drifted apart needs a person, not a substitution.
 *
 *   node scripts/mirror-collapse-to-jp.mjs --file=radial-gauge.mdx [--dry-run]
 */

import { leafBlocksOf } from './platform-blocks.mjs';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const args = process.argv.slice(2);
const argOf = (name, dflt) => {
    const hit = args.find(a => a.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : dflt;
};
const FILE = argOf('file', null);
const DRY = args.includes('--dry-run');

if (!FILE) {
    console.error('usage: node scripts/mirror-collapse-to-jp.mjs --file=<topic.mdx> [--dry-run]');
    process.exit(2);
}

function findUnder(dir, name) {
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) {
            const hit = findUnder(full, name);
            if (hit) return hit;
        } else if (full.endsWith(name)) {
            return full;
        }
    }
    return null;
}

const enFile = findUnder(path.join(ROOT, 'src', 'content', 'en', 'components'), FILE);
const jpFile = findUnder(path.join(ROOT, 'src', 'content', 'jp', 'components'), FILE);
if (!enFile) { console.error(`no English topic matching ${FILE}`); process.exit(2); }
if (!jpFile) { console.error(`no Japanese topic matching ${FILE} — nothing to mirror`); process.exit(0); }

const en = readFileSync(enFile, 'utf8');
const jp = readFileSync(jpFile, 'utf8');

/**
 * A run of code blocks with nothing but whitespace between them.
 *
 * Every code fence counts, not just the markup ones. A collapse replaces a whole section — the
 * markup and the code beside it — so a section whose blocks are all `ts`, as Map Background's are,
 * has to be seen here or the snippet is inserted after the blocks it was meant to replace and the
 * page ends up with both.
 */
function groupsOf(text) {
    const blocks = [];
    // Depth aware: pairing an opener with the first closer after it takes an inner block's closer,
    // and a group whose extent is wrong takes whatever sits between with it when it is replaced.
    for (const b of leafBlocksOf(text)) {
        const body = text.slice(b.bodyStart, b.bodyEnd);
        if (!/```(html|tsx|razor|xaml|ts|typescript|csharp|js|javascript)\n/.test(body)) continue;
        const fence = /```(?:html|tsx|razor|xaml|ts|typescript|csharp|js|javascript)\n([\s\S]*?)```/.exec(body);
        blocks.push({ platforms: b.platforms, body: fence ? fence[1] : '',
                      start: b.start, end: b.end });
    }
    const groups = [];
    let current = [], seen = new Set();
    for (const b of blocks) {
        const previousEnd = current.length ? current[current.length - 1].end : -1;
        const intervening = previousEnd >= 0 && text.slice(previousEnd, b.start).trim().length > 0;
if (current.length && (intervening || b.platforms.some(p => seen.has(p)))) {
            groups.push(current); current = []; seen = new Set();
        }
        current.push(b);
        for (const p of b.platforms) seen.add(p);
    }
    if (current.length) groups.push(current);
    return groups;
}

/**
 * Which heading section a position falls in.
 *
 * Sections are the unit both copies share. Matching a fence to a group by position only works while
 * each fence replaced exactly one group, and a collapse often merges several — the imagery topics
 * put a markup block and a code block per platform under one heading, and one JSON replaces all of
 * them. The headings are translated but there are the same number in the same order, so counting
 * them locates a section in either copy.
 */
function sectionIndexer(text) {
    const headings = [...text.matchAll(/^#{1,6} .+$/gm)].map(m => m.index);
    return at => headings.filter(h => h < at).length;
}

const enSection = sectionIndexer(en);
const jpSection = sectionIndexer(jp);

// The closing fence has to be the first one at a line start, or a fence with no body — which is
// what a ref= fence is — runs on and swallows everything up to the next fence's close.
const enFences = [...en.matchAll(/```json-snippet[^\n]*\n[\s\S]*?^```/gm)]
    .map(m => ({ section: enSection(m.index), fence: m[0] }));
const jpGroups = groupsOf(jp);

const enHeadings = (en.match(/^#{1,6} .+$/gm) || []).length;
const jpHeadings = (jp.match(/^#{1,6} .+$/gm) || []).length;

console.log(`${path.basename(FILE)}: ${enFences.length} snippet(s) in en, ` +
            `${jpGroups.length} group(s) in jp, ${enHeadings}/${jpHeadings} headings`);

if (enFences.length === 0) {
    console.log('nothing collapsed in the English topic yet');
    process.exit(0);
}
if (enHeadings !== jpHeadings) {
    console.error(`refusing to write: en has ${enHeadings} headings and jp has ${jpHeadings}. ` +
                  `The two copies have drifted and need reconciling by hand.`);
    process.exit(1);
}

// All of a section's snippets, in the order English has them. A section is replaced whole rather
// than group by group, so two snippets under one heading — a definition and the code beside it —
// both land, and neither has to be matched to a particular group.
const bySection = new Map();
for (const f of enFences) {
    if (!bySection.has(f.section)) bySection.set(f.section, []);
    bySection.get(f.section).push(f.fence);
}

// Code blocks are the same text in both copies — only the prose is translated — so a Japanese
// block English still has is recognisable by its body.
const enKeptBodies = new Set();
for (const group of groupsOf(en)) {
    for (const b of group) enKeptBodies.add(b.body.trim());
}

let out = '', last = 0, written = 0;
const replacedSections = new Set();
for (const group of jpGroups) {
    const section = jpSection(group[0].start);
    if (!bySection.has(section)) continue;                       // hand written on both sides
    if (group.every(b => enKeptBodies.has(b.body.trim()))) continue;   // English kept this one too
    out += jp.slice(last, group[0].start);
    if (!replacedSections.has(section)) {   // the section's snippets land where its first group was
        out += bySection.get(section).join('\n\n');
        replacedSections.add(section);
        written++;
    }
    last = group[group.length - 1].end;
}
out += jp.slice(last);

// A section collapsed on both sides already, whose definition has since changed in English. The
// snippet is the same text in both copies — only the prose is translated — so a difference is
// always the Japanese copy being behind, never a translation.
let updated = 0;
const jpFences = [...out.matchAll(/```json-snippet[^\n]*\n(?:[\s\S]*?\n)?```/g)];
if (jpFences.length === enFences.length) {
    let rebuilt = '', at = 0;
    for (let i = 0; i < jpFences.length; i++) {
        if (jpFences[i][0] !== enFences[i].fence) updated++;
        rebuilt += out.slice(at, jpFences[i].index) + enFences[i].fence;
        at = jpFences[i].index + jpFences[i][0].length;
    }
    out = rebuilt + out.slice(at);
}

// A wrapper left holding nothing. Some sections wrap each platform twice — once round the markup
// and once round the code — so collapsing the fenced one leaves its empty twin behind, which the
// English copy dropped along with everything else in the section.
out = out.replace(/<PlatformBlock\s+for="[^"]+">\s*<\/PlatformBlock>\n*/g, '');

if (DRY) {
    console.log(`would replace ${written} group(s) and refresh ${updated} snippet(s); ` +
                `${jp.length} -> ${out.length} bytes`);
    process.exit(0);
}
writeFileSync(jpFile, out, 'utf8');
console.log(`mirrored ${written} group(s) and refreshed ${updated} snippet(s) in ` +
            `${path.relative(ROOT, jpFile)}`);

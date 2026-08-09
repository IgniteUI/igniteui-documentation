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

/** A run of code blocks with nothing but whitespace between them. Same rule the dossier uses. */
function groupsOf(text) {
    const blocks = [];
    for (const m of text.matchAll(/<PlatformBlock\s+for="([^"]+)">([\s\S]*?)<\/PlatformBlock>/g)) {
        if (!/```(html|tsx|razor|xaml)\n/.test(m[2])) continue;
        blocks.push({ platforms: m[1].split(',').map(s => s.trim()),
                      start: m.index, end: m.index + m[0].length });
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

const enFences = [...en.matchAll(/```json-snippet[^\n]*\n[\s\S]*?\n```/g)]
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

// Every group in a section the English copy collapsed is replaced by that section's snippet.
const bySection = new Map();
for (const f of enFences) {
    if (bySection.has(f.section)) {
        console.error(`refusing to write: section ${f.section} holds more than one snippet in en, ` +
                      `so which jp group each replaces is ambiguous.`);
        process.exit(1);
    }
    bySection.set(f.section, f.fence);
}

let out = '', last = 0, written = 0, replacedSections = new Set();
for (const group of jpGroups) {
    const section = jpSection(group[0].start);
    if (!bySection.has(section)) continue;      // still hand written on both sides
    out += jp.slice(last, group[0].start);
    if (!replacedSections.has(section)) {       // the first group in the section becomes the snippet
        out += bySection.get(section);
        replacedSections.add(section);
        written++;
    }
    last = group[group.length - 1].end;
}
out += jp.slice(last);

if (DRY) {
    console.log(`would replace ${written} group(s); ${jp.length} -> ${out.length} bytes`);
    process.exit(0);
}
writeFileSync(jpFile, out, 'utf8');
console.log(`mirrored ${written} group(s) into ${path.relative(ROOT, jpFile)}`);

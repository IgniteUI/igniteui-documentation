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
 * What the English topic holds in document order: a collapsed snippet, or a group still written by
 * hand. Both matter — a topic is rarely collapsed all at once, and an uncollapsed group still
 * occupies a position that the Japanese copy also has. Comparing only the fences to all of the
 * Japanese groups misaligns as soon as one group is left alone.
 */
const enItems = [
    ...[...en.matchAll(/```json-snippet[^\n]*\n[\s\S]*?\n```/g)]
        .map(m => ({ at: m.index, fence: m[0] })),
    ...groupsOf(en).map(g => ({ at: g[0].start, fence: null })),
].sort((a, b) => a.at - b.at);

const jpGroups = groupsOf(jp);
const collapsed = enItems.filter(i => i.fence !== null).length;

console.log(`${path.basename(FILE)}: en has ${collapsed} collapsed and ` +
            `${enItems.length - collapsed} still by hand; jp has ${jpGroups.length} group(s)`);

if (collapsed === 0) {
    console.log('nothing collapsed in the English topic yet');
    process.exit(0);
}
if (enItems.length !== jpGroups.length) {
    console.error(`refusing to write: en has ${enItems.length} snippet positions and jp has ` +
                  `${jpGroups.length} groups. The two copies have drifted and need reconciling by hand.`);
    process.exit(1);
}

let out = '', last = 0, written = 0;
for (let i = 0; i < enItems.length; i++) {
    if (enItems[i].fence === null) continue;   // still hand written on both sides
    const group = jpGroups[i];
    out += jp.slice(last, group[0].start) + enItems[i].fence;
    last = group[group.length - 1].end;
    written++;
}
out += jp.slice(last);

if (DRY) {
    console.log(`would replace ${written} group(s); ${jp.length} -> ${out.length} bytes`);
    process.exit(0);
}
writeFileSync(jpFile, out, 'utf8');
console.log(`mirrored ${written} group(s) into ${path.relative(ROOT, jpFile)}`);

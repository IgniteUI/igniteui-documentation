#!/usr/bin/env node
/**
 * snippet-group-dossier.mjs
 *
 * Prints everything needed to decide, for one snippet group, what it should collapse to.
 *
 * Pairing a group to a sample by rule has been tried several ways and each fails on the same
 * thing: with values set aside, a topic about binding multiple sources looks exactly like one
 * about binding a csv, because they set the same properties. Deciding that needs to read the
 * prose, which is a judgement rather than a heuristic.
 *
 * So this gathers the evidence and makes no decision:
 *
 *   - the prose immediately before the group, which is what the snippet is illustrating
 *   - every platform's version of the snippet
 *   - the samples the topic shows nearby, with the properties each sets
 *   - any value the prose states, since those are visible to the reader and bind the snippet
 *
 * The last is the one that decides values. A topic that says "a value of 70" must show 70,
 * whatever the sample runs, so prose beats sample and sample beats whatever a platform drifted to.
 *
 *   node scripts/snippet-group-dossier.mjs --file=bullet-graph.mdx [--group=2]
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const args = process.argv.slice(2);
const argOf = (name, dflt) => {
    const hit = args.find(a => a.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : dflt;
};
const LANG = argOf('lang', 'en');
const FILE = argOf('file', null);
const ONLY_GROUP = argOf('group', null);
const EXAMPLES = process.env.XPLAT_EXAMPLES;

if (!FILE || !EXAMPLES) {
    console.error('usage: XPLAT_EXAMPLES=… node scripts/snippet-group-dossier.mjs --file=<topic.mdx>');
    process.exit(2);
}

const CONTENT_DIR = path.join(ROOT, 'src', 'content', LANG, 'components');

function findTopic(dir) {
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) {
            const hit = findTopic(full);
            if (hit) return hit;
        } else if (full.endsWith(FILE)) {
            return full;
        }
    }
    return null;
}

const topic = findTopic(CONTENT_DIR);
if (!topic) { console.error(`no topic matching ${FILE}`); process.exit(2); }
const text = readFileSync(topic, 'utf8');

// ---------------------------------------------------------------------------

const blocks = [];
const blockRe = /<PlatformBlock\s+for="([^"]+)">([\s\S]*?)<\/PlatformBlock>/g;
let m;
while ((m = blockRe.exec(text)) !== null) {
    const fence = /```(html|tsx|razor|xaml)\n([\s\S]*?)```/.exec(m[2]);
    if (!fence) continue;
    blocks.push({ platforms: m[1], lang: fence[1], body: fence[2],
                  start: m.index, end: m.index + m[0].length });
}

/**
 * A group is a run of blocks with nothing but whitespace between them.
 *
 * One platform's version of a snippet follows the next immediately; anything a reader can see —
 * a sentence, a sample, a heading — means the topic has moved on to something else. Measured over
 * the whole corpus, 1437 adjacent pairs have nothing between them and ~980 have prose, while a
 * heading sits alone between two blocks 5 times, so headings carry no signal prose does not.
 *
 * The known exception is a gap reading only "or", which joins two spellings of one snippet. Too
 * rare to write a rule for, and a wrong split there is visible in the dossier anyway.
 */
const groups = [];
let current = [], seen = new Set();
for (const b of blocks) {
    const platforms = b.platforms.split(',').map(s => s.trim());
    const previousEnd = current.length ? current[current.length - 1].end : -1;
    const intervening = previousEnd >= 0 && text.slice(previousEnd, b.start).trim().length > 0;
    if (current.length && (intervening || platforms.some(p => seen.has(p)))) {
        groups.push(current); current = []; seen = new Set();
    }
    current.push(b);
    for (const p of platforms) seen.add(p);
}
if (current.length) groups.push(current);

const samples = [...text.matchAll(/<Sample\s+src="([^"]+)"/g)].map(s => ({ src: s[1], at: s.index }));

function sampleContent(src) {
    const file = path.join(EXAMPLES, 'samples', src.replace(/^\//, '') + '.json');
    if (!existsSync(file)) return null;
    try {
        const parsed = JSON.parse(readFileSync(file, 'utf8'));
        return parsed?.descriptions?.content ?? parsed;
    } catch { return null; }
}

/** The prose before a group, with markup and code stripped, back to the previous group. */
function proseBefore(group, index) {
    const from = index > 0 ? groups[index - 1][groups[index - 1].length - 1].end : 0;
    let prose = text.slice(from, group[0].start);
    prose = prose.replace(/```[\s\S]*?```/g, '')
                 .replace(/<PlatformBlock[^>]*>|<\/PlatformBlock>/g, '')
                 .replace(/<Sample[^>]*\/>/g, '')
                 .replace(/<ApiLink[^>]*\/>/g, m => (/type="([^"]+)"/.exec(m)?.[1] ?? ''))
                 .replace(/<[^>]+>/g, '')
                 .replace(/\n{2,}/g, '\n')
                 .trim();
    return prose;
}

console.log(`topic: ${path.relative(CONTENT_DIR, topic)}   groups: ${groups.length}   samples: ${samples.length}\n`);

groups.forEach((group, index) => {
    if (ONLY_GROUP !== null && String(index + 1) !== ONLY_GROUP) return;

    // Candidates in both directions, since a topic may state its point and then show the sample,
    // or show the sample and then explain it. Which one the group belongs to is the judgement.
    const groupStart = group[0].start, groupEnd = group[group.length - 1].end;
    const before = samples.filter(s => s.at < groupStart).slice(-1);
    const after = samples.filter(s => s.at > groupEnd).slice(0, 1);
    const nearby = [...before, ...after];

    console.log('='.repeat(78));
    console.log(`GROUP ${index + 1}  (platforms: ${group.map(b => b.platforms).join(' | ')})`);

    const prose = proseBefore(group, index);
    console.log(`\n-- prose before it --\n${prose.slice(-900) || '(none)'}`);

    // Values the prose states, which the snippet is obliged to show.
    const proseNumbers = [...new Set((prose.match(/(?<![\w.#])-?\d+(?:\.\d+)?(?![\w.])/g) || []))]
        .filter(n => n !== '0' && n !== '1');
    if (proseNumbers.length) console.log(`\n-- numbers the prose states -- ${proseNumbers.join(', ')}`);

    console.log(`\n-- samples in this group's span --`);
    if (nearby.length === 0) console.log('   (none)');
    for (const s of nearby) {
        const content = sampleContent(s.src);
        if (!content) { console.log(`   ${s.src}  (no JSON in the examples repo)`); continue; }
        const scalars = Object.entries(content)
            .filter(([, v]) => typeof v !== 'object')
            .map(([k, v]) => `${k}=${v}`);
        // Which side it sits on matters: a section states its point, shows the snippet, then runs
        // the sample. The one after the group is the peer; the one before belongs to the section
        // above and is shown only so a mis-set section is visible.
        const side = s.at > groupEnd ? 'after the group' : 'before it';
        console.log(`   ${s.src}  (${side})\n      ${scalars.join(', ')}`);
        const children = Object.entries(content).filter(([, v]) => Array.isArray(v));
        for (const [name, list] of children) console.log(`      ${name}: ${list.length} item(s)`);
    }

    console.log(`\n-- what each platform shows --`);
    for (const b of group) {
        console.log(`\n   [${b.platforms}]`);
        console.log(b.body.replace(/\s+$/, '').split('\n').map(l => '     ' + l).join('\n'));
    }
    console.log();
});

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

import { leafBlocksOf } from './platform-blocks.mjs';
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
// Depth aware: these blocks nest, and a lazily paired closer is the inner block's.
for (const b of leafBlocksOf(text)) {
    const m = { 1: b.platforms.join(', '), 2: text.slice(b.bodyStart, b.bodyEnd),
                0: text.slice(b.start, b.end), index: b.start };
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

// ---------------------------------------------------------------------------
// Candidates found by what the snippet sets, rather than by what the page shows.
//
// The samples a topic embeds are not always the ones its snippets came from. chart-annotations
// displays three data-chart samples while every one of its snippets is a CategoryChart, and the
// CategoryChart annotation samples it was actually written from — annotations-final-value,
// annotations-callouts, annotations-custom — are never mentioned on the page. Pairing on the
// embedded <Sample> alone reported that topic as needing samples back-ported from another repo,
// when the JSON was already sitting in this one.
// ---------------------------------------------------------------------------

/** Attribute and property names compared without their platform's spelling. */
const normalise = name => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const IGNORED_NAMES = new Set(['name', 'id', 'type', 'width', 'height', 'ref']);

function allSamples() {
    const root = path.join(EXAMPLES, 'samples');
    const found = [];
    (function walk(dir) {
        for (const entry of readdirSync(dir)) {
            const full = path.join(dir, entry);
            if (statSync(full).isDirectory()) walk(full);
            else if (full.endsWith('.json')) {
                const src = '/' + path.relative(root, full).replace(/\.json$/, '');
                const content = sampleContent(src);
                if (content && typeof content.type === 'string') found.push({ src, content });
            }
        }
    })(root);
    return found;
}

let sampleIndex = null;

/** The attribute names a group's blocks write, whatever each platform calls them. */
function namesWritten(group) {
    const names = new Set();
    for (const b of group) {
        for (const m of b.body.matchAll(/(?:^|\s)([A-Za-z][\w:.-]*)\s*=/g)) {
            const n = normalise(m[1].replace(/^\[|\]$/g, '').replace(/^\(|\)$/g, ''));
            if (n && !IGNORED_NAMES.has(n)) names.add(n);
        }
    }
    return names;
}

/** Every property name a sample sets, including on its children. */
function namesIn(content, into = new Set()) {
    if (content === null || typeof content !== 'object') return into;
    if (Array.isArray(content)) { content.forEach(c => namesIn(c, into)); return into; }
    for (const [key, value] of Object.entries(content)) {
        if (key.startsWith('$')) continue;
        const n = normalise(key.replace(/Ref$/, ''));
        if (n && !IGNORED_NAMES.has(n)) into.add(n);
        namesIn(value, into);
    }
    return into;
}

/**
 * The component a group's blocks are about, as the sample JSON would name it.
 *
 * Taken from the root element — igx-radial-gauge, IgbRadialGauge, igCharts:XamRadialGauge all
 * reduce to radialgauge. The gauges share most of their property names, so a radial gauge section
 * about ranges matches the linear gauge's ranges sample just as well on properties alone; only the
 * element says which component the reader is being shown.
 */
function componentOf(group) {
    for (const b of group) {
        const tag = /<\s*([A-Za-z][\w:.-]*)/.exec(b.body);
        if (!tag) continue;
        const name = tag[1].replace(/^.*:/, '')          // igCharts:XamRadialGauge
                           .replace(/^(igx|igc|igb|igr|Igx|Igc|Igb|Igr|Xam)[-]?/, '');
        return normalise(name);
    }
    return null;
}

/** Samples that set most of what this group's snippets set, best first. */
function candidatesFor(group) {
    if (sampleIndex === null) {
        sampleIndex = allSamples().map(s => ({ ...s, names: namesIn(s.content) }));
    }
    const wanted = namesWritten(group);
    if (wanted.size === 0) return [];
    const component = componentOf(group);

    const scored = [];
    for (const sample of sampleIndex) {
        let covered = 0;
        for (const n of wanted) if (sample.names.has(n)) covered++;
        if (covered === 0) continue;
        // Coverage of the snippet decides; a sample setting far more than the snippet is still a
        // fine source, so its extra properties only break ties.
        const sameComponent = component !== null && normalise(sample.content.type) === component;
        scored.push({ ...sample, covered, ratio: covered / wanted.size,
                      extra: sample.names.size, sameComponent });
    }
    // A sample of the same component wins over a better scoring one of a different component: a
    // reader shown a radial gauge is not helped by the linear gauge's numbers.
    scored.sort((a, b) => (b.sameComponent - a.sameComponent) || b.ratio - a.ratio || a.extra - b.extra);
    return scored.slice(0, 4);
}

/** The prose before a group, with markup and code stripped, back to the previous group. */
function proseBefore(group, index) {
    const from = index > 0 ? groups[index - 1][groups[index - 1].length - 1].end : 0;
    let prose = text.slice(from, group[0].start);
    prose = prose.replace(/```[\s\S]*?```/g, '')
                 .replace(/<PlatformBlock[^>]*>|<\/PlatformBlock>/g, '')
                 .replace(/<Sample[^>]*\/>/g, '')
                 .replace(/<ApiLink[^>]*\/>/g, m => (/type="([^"]+)"/.exec(m)?.[1] ?? ''));
    // Until it stops changing, rather than once: taking out `<a<b>c>` in a single pass leaves `c>`,
    // and a tag can be spelled so that removing one reassembles another around it.
    let previous;
    do {
        previous = prose;
        prose = prose.replace(/<[^>]+>/g, '');
    } while (prose !== previous);
    return prose.replace(/\n{2,}/g, '\n').trim();
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

    const candidates = candidatesFor(group);
    if (candidates.length > 0) {
        console.log(`\n-- samples that set what this group sets --`);
        const shown = new Set(nearby.map(s => s.src));
        for (const c of candidates) {
            const covers = `${c.covered}/${namesWritten(group).size}`;
            const note = shown.has(c.src) ? '' : '   (not shown on the page)';
            console.log(`   ${(c.ratio * 100).toFixed(0).padStart(3)}%  covers ${covers}  ${c.src}${note}`);
        }
    }

    console.log(`\n-- what each platform shows --`);
    for (const b of group) {
        console.log(`\n   [${b.platforms}]`);
        console.log(b.body.replace(/\s+$/, '').split('\n').map(l => '     ' + l).join('\n'));
    }
    console.log();
});

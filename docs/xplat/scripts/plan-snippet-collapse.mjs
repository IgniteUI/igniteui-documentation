#!/usr/bin/env node
/**
 * plan-snippet-collapse.mjs
 *
 * Decides, for every snippet group that peers a sample, whether it can be collapsed into a
 * json-snippet that references that sample.
 *
 * The test is whether the group is a *subset* of the sample it sits beside. Each platform's block
 * is read back into the properties it states; those are resolved to their description names, so
 * dataSource and ItemsSource are one property; and each is compared with the sample's value for it.
 *
 *   subset      every property the block states matches the sample, on every platform.
 *               The sample is provably the source, so the block becomes a reference to it plus the
 *               list of properties it illustrates. Nothing is restated, and the topic stops being
 *               able to drift from the thing it is showing.
 *
 *   not subset  some property disagrees, or is not on the sample at all. Either the topic has
 *               drifted from its sample — bullet-graph states value=70 beside a sample running
 *               value=80 — or it is deliberately illustrating a scenario the sample does not cover.
 *               Those need a person, and this prints every platform's version so the call can be
 *               made from what the topic actually says.
 *
 *   no sample   the group peers no sample, so there is nothing to reference.
 *
 *   node scripts/plan-snippet-collapse.mjs [--lang=en] [--file=bullet-graph.mdx] [--show-blocked]
 */

import { leafBlocksOf } from './platform-blocks.mjs';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const args = process.argv.slice(2);
const argOf = (name, dflt) => {
    const hit = args.find(a => a.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : dflt;
};
const LANG = argOf('lang', 'en');
const ONLY_FILE = argOf('file', null);
const SHOW_BLOCKED = args.includes('--show-blocked');
const SHOW_PLAN = args.includes('--plan');

const CONTENT_DIR = path.join(ROOT, 'src', 'content', LANG, 'components');
const EXAMPLES = process.env.XPLAT_EXAMPLES;
if (!EXAMPLES) {
    console.error('set XPLAT_EXAMPLES to the igniteui-xplat-examples checkout');
    process.exit(2);
}

/**
 * Where a sample may be found, in the order tried.
 *
 * The JSON in igniteui-xplat-examples is what a snippet can reference directly. Where there is
 * none, the sample may still exist in igniteui-wc-examples as an emitted project — samples were
 * back ported from there into the examples repo to fill out the WinUI set, and not all of them
 * have been. Those are not missing, they are not yet converted: the JSON can be back ported the
 * same way, and then the snippet collapses like any other.
 */
const WC_EXAMPLES = process.env.IG_WC_EXAMPLES
    || '/Users/graham/Documents/GitHub/igniteui-wc-examples';

const SNIPPET_API_PATH = process.env.IG_SNIPPET_API
    || '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dist/snippet-api.cjs';
const SNIPPET_DOM_SHIM = process.env.IG_SNIPPET_DOM_SHIM
    || '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dom-shim.js';

const api = (() => {
    const require = createRequire(import.meta.url);
    require(SNIPPET_DOM_SHIM);
    return require(SNIPPET_API_PATH);
})();

// A PlatformBlock gates on groups as well as platforms; any member of a group will do, because a
// group exists precisely because its platforms share the naming.
const METADATA_PLATFORM = {
    Xaml: 'WinUI', NonWeb: 'WinUI', Web: 'Angular',
    WinUI: 'WinUI', Uno: 'Uno', Angular: 'Angular',
    React: 'React', WebComponents: 'WebComponents', Blazor: 'Blazor',
};

// ---------------------------------------------------------------------------
// Reading a hand written block back into what it states
// ---------------------------------------------------------------------------

function canonicalTag(raw) {
    if (raw.includes('.')) return null;
    let t = raw.replace(/^[A-Za-z]+:/, '').replace(/[-_]/g, '').toLowerCase();
    for (const p of ['igniteui', 'igx', 'igc', 'igr', 'igb', 'xam']) {
        if (t.startsWith(p) && t.length > p.length) {
            t = t.slice(p.length);
            break;
        }
    }
    if (t.endsWith('component')) t = t.slice(0, -'component'.length);
    return t || null;
}

/** The properties a block states on its first element, by description name. */
function readStatedProperties(body, platform) {
    const tagRe = /<([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}))*)\s*\/?>/;
    const m = tagRe.exec(body);
    if (!m) return null;

    const tag = canonicalTag(m[1]);
    if (!tag) return null;

    const stated = new Map();
    const attrRe = /([\w:.-]+)\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\})/g;
    let a;
    while ((a = attrRe.exec(m[2])) !== null) {
        const written = a[1].replace(/^[\w]+:/, '');
        const flat = written.replace(/[-_]/g, '').toLowerCase();
        if (['name', 'id', 'ref', 'key'].includes(flat)) continue;

        // Web Components writes a property spinal cased; the metadata knows it camel cased, so
        // the dashes come out before asking. Without this every Web Components property looks
        // like one the sample does not have.
        const asked = written.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
        const metadataPlatform = METADATA_PLATFORM[platform];
        const resolved = metadataPlatform
            ? api.resolvePropertyName(descriptionTypeFor(tag), metadataPlatform, asked)
            : null;
        if (!resolved) unresolvedProperties.push(`${tag}.${asked}`);
        stated.set(resolved || asked, unquote(a[2]));
    }
    return { tag, stated };
}

function unquote(raw) {
    let v = raw.trim();
    if (v.startsWith('{') && v.endsWith('}')) v = v.slice(1, -1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    return v.trim();
}

/** Whether a block's value and the sample's say the same thing, allowing for how each is written. */
function sameValue(stated, sampleValue) {
    if (sampleValue === undefined || sampleValue === null) return false;
    const a = String(stated).trim();
    const b = String(sampleValue).trim();
    if (a === b) return true;
    if (a.toLowerCase() === b.toLowerCase()) return true;

    // A number stated with a unit, against the sample's bare number.
    const numA = a.replace(/(px|%|pt|em|rem)$/, '');
    const numB = b.replace(/(px|%|pt|em|rem)$/, '');
    if (numA !== a || numB !== b) {
        if (parseFloat(numA) === parseFloat(numB)) return true;
    }
    if (!isNaN(parseFloat(a)) && parseFloat(a) === parseFloat(b)) return true;

    // An enumeration written qualified against the bare member, and a colour's letter case.
    const enumA = a.includes('.') ? a.slice(a.lastIndexOf('.') + 1) : a;
    if (enumA.toLowerCase() === b.toLowerCase()) return true;

    // A reference, however each platform spells it.
    const refA = a.replace(/^\{\s*Binding\s+/, '').replace(/\}$/, '').replace(/^@/, '')
        .replace(/^this\./, '').replace(/^state\./, '');
    if (refA.toLowerCase() === b.toLowerCase()) return true;

    return false;
}

// ---------------------------------------------------------------------------
// Samples and descriptions
// ---------------------------------------------------------------------------

let descriptionNames = null;
function descriptionTypeFor(tag) {
    if (descriptionNames === null) {
        descriptionNames = new Map();
        const dir = path.join(ROOT, '..', '..', 'src', 'data', 'api-map');
        try {
            for (const platform of readdirSync(dir)) {
                const p = path.join(dir, platform);
                if (!statSync(p).isDirectory()) continue;
                for (const file of readdirSync(p)) {
                    if (!file.endsWith('.json')) continue;
                    let data;
                    try { data = JSON.parse(readFileSync(path.join(p, file), 'utf8')); } catch { continue; }
                    for (const type of data.types || []) {
                        const name = (type.originalName || '');
                        if (!name.endsWith('Description')) continue;
                        const bare = name.replace(/Description$/, '');
                        descriptionNames.set(bare.toLowerCase(), bare);
                        if (bare.startsWith('Web')) {
                            const stripped = bare.slice(3).toLowerCase();
                            if (!descriptionNames.has(stripped)) descriptionNames.set(stripped, bare);
                        }
                    }
                }
            }
        } catch { /* nothing to index */ }
    }
    return descriptionNames.get(tag) || tag;
}

/** A component is in scope when it has a description of its own and that description is not a Web one. */
function isInScope(tag) {
    const type = descriptionTypeFor(tag);
    return type !== tag && !type.startsWith('Web');
}

/** Whether a sample exists in wc-examples, as an emitted project, ready to be back ported. */
function existsInWcExamples(src) {
    return existsSync(path.join(WC_EXAMPLES, 'samples', src.replace(/^\//, '')));
}

function loadSample(src) {
    const file = path.join(EXAMPLES, 'samples', src.replace(/^\//, '') + '.json');
    if (!existsSync(file)) return null;
    try {
        const parsed = JSON.parse(readFileSync(file, 'utf8'));
        const root = parsed?.descriptions?.content ?? parsed;
        if (!root || typeof root !== 'object') return null;
        // A sample writes its properties camel cased while a description names them Pascal cased,
        // so lookups go through a lower cased index rather than the keys as written.
        const indexed = new Map();
        for (const [name, value] of Object.entries(root)) indexed.set(name.toLowerCase(), value);
        return indexed;
    } catch {
        return null;
    }
}


/**
 * Every sample in the examples repo, indexed by the component at its root.
 *
 * Built once so that a group whose sample cannot be worked out from where it sits can still be
 * matched on what it says.
 */
let samplesByType = null;
function samplesForType(typeName) {
    if (samplesByType === null) {
        samplesByType = new Map();
        const root = path.join(EXAMPLES, 'samples');
        const walkSamples = (dir) => {
            let entries = [];
            try { entries = readdirSync(dir); } catch { return; }
            for (const entry of entries) {
                const full = path.join(dir, entry);
                if (statSync(full).isDirectory()) { walkSamples(full); continue; }
                if (!entry.endsWith('.json')) continue;
                let parsed;
                try { parsed = JSON.parse(readFileSync(full, 'utf8')); } catch { continue; }
                const content = parsed?.descriptions?.content ?? parsed;
                const type = content?.type;
                if (!type) continue;
                const src = '/' + path.relative(root, full).replace(/\.json$/, '').split(path.sep).join('/');
                if (!samplesByType.has(type)) samplesByType.set(type, []);
                samplesByType.get(type).push({ src, content });
            }
        };
        walkSamples(root);
    }
    return samplesByType.get(typeName) || [];
}

/**
 * A sample the group is probably illustrating, chosen by how well it covers what the snippet says.
 *
 * Many snippets appear to be written from scratch rather than narrowed from a sample: for one
 * gauge topic, twenty samples of that component existed and none set even the same properties. So
 * an exact match is the wrong test. What is wanted is the sample that best covers the properties
 * the snippet sets, preferring one the topic already references, since a topic's own samples are
 * what it is discussing.
 *
 * Values are deliberately not compared. They are what has drifted, and re-anchoring the snippet to
 * the sample's values is the point of finding it.
 */
function sampleByContent(read, referencedInTopic) {
    const type = descriptionTypeFor(read[0].parsed.tag);
    const candidates = samplesForType(type);
    if (candidates.length === 0) return null;

    // The properties the snippet sets, across whichever platform states the most.
    const stated = new Set();
    for (const block of read) {
        for (const [name] of block.parsed.stated) stated.add(name.toLowerCase());
    }
    if (stated.size === 0) return null;

    let best = null;
    for (const candidate of candidates) {
        const has = new Set(Object.keys(candidate.content).map(n => n.toLowerCase()));
        let covered = 0;
        for (const name of stated) if (has.has(name)) covered++;
        const coverage = covered / stated.size;
        if (coverage < 0.75) continue;

        // A sample the topic already shows beats one merely of the same component, and among
        // equals the tighter one — a sample twice the size merely contains the snippet.
        const score = coverage
            + (referencedInTopic.has(candidate.src) ? 1 : 0)
            - Math.min(0.4, Math.max(0, has.size - stated.size) / 200);
        if (!best || score > best.score) best = { src: candidate.src, score, coverage };
    }
    return best ? best.src : null;
}

// ---------------------------------------------------------------------------
// Groups, and the sample each peers
// ---------------------------------------------------------------------------

function findGroups(text) {
    const found = [];
    // Depth aware: these blocks nest, and a lazily paired closer is the inner block's.
    for (const b of leafBlocksOf(text)) {
        const m = { 1: b.platforms.join(', '), 2: text.slice(b.bodyStart, b.bodyEnd),
                    0: text.slice(b.start, b.end), index: b.start };
        const fence = /```(html|tsx|razor|xaml)\n([\s\S]*?)```/.exec(m[2]);
        if (!fence) continue;
        found.push({ platforms: m[1], body: fence[2], start: m.index, end: m.index + m[0].length });
    }

    const samplePositions = [...text.matchAll(/<Sample\s+src="[^"]+"/g)].map(m => m.index);

    const groups = [];
    let current = [];
    let seen = new Set();
    for (const b of found) {
        const platforms = b.platforms.split(',').map(s => s.trim());
        // A sample between one block and the next starts a new section: the topics write some
        // platforms' blocks, then the sample, then the rest. Without this the blocks either side
        // are treated as one group and paired with whatever sample precedes both.
        const previousEnd = current.length ? current[current.length - 1].end : -1;
        const sampleBetween = previousEnd >= 0 && samplePositions.some(at => at > previousEnd && at < b.start);
        if (current.length && (sampleBetween || platforms.some(p => seen.has(p)))) {
            groups.push(current); current = []; seen = new Set();
        }
        current.push(b);
        for (const p of platforms) seen.add(p);
    }
    if (current.length) groups.push(current);
    return groups;
}

/**
 * The sample a group is illustrating: the nearest one with no other snippet group in between.
 *
 * Neither direction nor headings decide this. A topic's opening sample sits above its first
 * snippet while a section further down shows the sample under them, so direction mispairs half of
 * them; and a heading frequently falls between a group and the sample it belongs to — of the
 * blocks with a sample within a screen's distance, more than half have a heading in between — so
 * sectioning by heading rejects pairings that are plainly related.
 *
 * What does separate two samples is another snippet group: whatever lies between a group and the
 * next group is that group's, headings included.
 */
function peeredSample(text, group, allGroups) {
    const samples = [...text.matchAll(/<Sample\s+src="([^"]+)"/g)]
        .map(m => ({ src: m[1], at: m.index }));
    if (samples.length === 0) return null;

    const start = group[0].start;
    const end = group[group.length - 1].end;

    // The window this group owns: up to the previous group, and on to the next.
    const previousEnd = allGroups
        .filter(g => g[g.length - 1].end <= start)
        .reduce((acc, g) => Math.max(acc, g[g.length - 1].end), 0);
    const nextStart = allGroups
        .filter(g => g[0].start >= end)
        .reduce((acc, g) => Math.min(acc, g[0].start), text.length);

    const owned = samples.filter(s => s.at >= previousEnd && s.at <= nextStart);
    if (owned.length === 0) return null;
    if (owned.length === 1) return owned[0].src;

    // More than one in the window: the closest, and only when it is unambiguous.
    const scored = owned
        .map(s => ({ src: s.src, distance: s.at < start ? start - s.at : s.at - end }))
        .sort((a, b) => a.distance - b.distance);
    if (scored[0].src === scored[1].src) return scored[0].src;
    return scored[0].distance * 2 < scored[1].distance ? scored[0].src : null;
}

// ---------------------------------------------------------------------------

function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        const p = path.join(dir, entry);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (entry.endsWith('.mdx') || entry.endsWith('.md')) out.push(p);
    }
    return out;
}

let collapsible = 0, blocked = 0, noSample = 0, outOfScope = 0;
const blockedGroups = [];
const collapsePlan = [];
const unpairedReasons = [];
const missingSamples = [];
const noSampleFiles = [];
let backportable = 0;
let matchedByContent = 0;
const backportList = [];
const unresolvedProperties = [];
let groupsExpressible = 0, groupsNotExpressible = 0;

for (const file of walk(CONTENT_DIR)) {
    if (ONLY_FILE && !file.endsWith(ONLY_FILE)) continue;
    const text = readFileSync(file, 'utf8');

    const groups = findGroups(text);
    for (const group of groups) {
        const read = group
            .map(b => ({ platforms: b.platforms, body: b.body,
                         parsed: readStatedProperties(b.body, b.platforms.split(',')[0].trim()) }))
            .filter(b => b.parsed);
        if (read.length === 0) continue;

        if (!isInScope(read[0].parsed.tag)) { outOfScope++; continue; }

        const before = unresolvedProperties.length;
        // Expressible means every property the blocks state is a description property, so the
        // group can become JSON whether or not a sample exists to reference.
        for (const b of read) void b;
        if (unresolvedProperties.length === before) groupsExpressible++; else groupsNotExpressible++;

        // Where it sits decides first; what it says decides when that cannot.
        let src = peeredSample(text, group, groups);
        if (!src || !loadSample(src)) {
            const referencedInTopic = new Set(
                [...text.matchAll(/<Sample\s+src="([^"]+)"/g)].map(m => m[1]));
            const byContent = sampleByContent(read, referencedInTopic);
            if (byContent) {
                src = byContent; matchedByContent++;
                if (process.env.DEBUG_CONTENT) {
                    console.log(`  [content] ${path.relative(CONTENT_DIR, file)} -> ${byContent}`);
                }
            }
        }
        const sample = src ? loadSample(src) : null;
        if (!sample) {
            if (src && existsInWcExamples(src)) {
                // Present upstream but not yet converted: a back port away from collapsing.
                backportable++;
                backportList.push(src);
            } else {
                noSample++;
                noSampleFiles.push(path.relative(CONTENT_DIR, file));
                if (src) missingSamples.push(src);
            }
            continue;
        }

        // Per platform: does everything this block states match the sample?
        const perPlatform = read.map(block => {
            const wrong = [];
            for (const [name, value] of block.parsed.stated) {
                if (!sameValue(value, sample.get(name.toLowerCase()))) {
                    wrong.push({ name, stated: value,
                                 sample: sample.get(name.toLowerCase()) === undefined
                                     ? '(not on sample)' : sample.get(name.toLowerCase()) });
                }
            }
            return { platforms: block.platforms, body: block.body,
                     stated: [...block.parsed.stated.keys()], wrong };
        });

        const agreeing = perPlatform.filter(b => b.wrong.length === 0 && b.stated.length > 0);

        if (agreeing.length > 0) {
            // At least one platform states the sample's own values, which settles that the sample
            // is the scenario the section is about. The others have drifted from it, so the whole
            // group collapses to the sample and they come back into line.
            collapsible++;
            const include = new Set();
            for (const b of agreeing) for (const name of b.stated) include.add(name);
            collapsePlan.push({ file: path.relative(CONTENT_DIR, file), src,
                                agreeing: agreeing.map(b => b.platforms),
                                drifted: perPlatform.filter(b => b.wrong.length > 0)
                                    .map(b => ({ platforms: b.platforms, wrong: b.wrong })),
                                include: [...include] });
        } else {
            blocked++;
            blockedGroups.push({ file: path.relative(CONTENT_DIR, file), src,
                                 read: perPlatform, mismatches: perPlatform.flatMap(b =>
                                     b.wrong.map(w => ({ platforms: b.platforms, ...w }))) });
        }
    }
}

if (args.includes('--where-unpaired')) {
    const counts = new Map();
    for (const f of noSampleFiles) counts.set(f, (counts.get(f) || 0) + 1);
    for (const [f, n] of [...counts].sort((a,b)=>b[1]-a[1]).slice(0, 12)) console.log(`  ${String(n).padStart(3)}  ${f}`);
}
if (args.includes('--why-unpaired')) {
    console.log(`  ${String(missingSamples.length).padStart(4)}  paired but the sample file was not found`);
    for (const s of [...new Set(missingSamples)].slice(0, 6)) console.log(`          ${s}`);
    const counts = new Map();
    for (const r of unpairedReasons) counts.set(r, (counts.get(r) || 0) + 1);
    for (const [r, n] of [...counts].sort((a,b)=>b[1]-a[1])) console.log(`  ${String(n).padStart(4)}  ${r}`);
}
console.log(`expressible as JSON: ${groupsExpressible}   not expressible: ${groupsNotExpressible}`);
if (args.includes('--unresolved')) {
    const counts = new Map();
    for (const u of unresolvedProperties) counts.set(u, (counts.get(u) || 0) + 1);
    for (const [u, n] of [...counts].sort((a,b)=>b[1]-a[1]).slice(0, 20)) console.log(`  ${String(n).padStart(4)}  ${u}`);
}
console.log(`matched to a sample by content rather than position: ${matchedByContent}`);
console.log(`needs the sample back ported from wc-examples first: ${backportable}`);
if (args.includes('--backport')) {
    for (const src of [...new Set(backportList)].sort()) console.log(`  ${src}`);
}
console.log(`collapsible: ${collapsible}   needs a decision: ${blocked}   no peered sample: ${noSample}` +
    `   out of scope: ${outOfScope}`);

if (SHOW_PLAN) {
    for (const g of collapsePlan) {
        console.log(`\n${g.file}\n  collapse to ${g.src}`);
        console.log(`  agrees with the sample already: ${g.agreeing.join(', ')}`);
        console.log(`  illustrating: ${g.include.join(', ')}`);
        for (const d of g.drifted) {
            console.log(`  ${d.platforms} changes:`);
            for (const w of d.wrong) console.log(`      ${w.name}: ${w.stated} -> ${w.sample}`);
        }
    }
}

if (SHOW_BLOCKED) {
    for (const g of blockedGroups) {
        console.log(`\n${'='.repeat(78)}\n${g.file}\n  sample: ${g.src}`);
        for (const m of g.mismatches) {
            console.log(`  ${m.platforms} states ${m.name}=${m.stated}, sample has ${m.sample}`);
        }
        for (const b of g.read) {
            console.log(`\n  --- ${b.platforms} ---`);
            console.log(b.body.split('\n').map(l => '  ' + l).join('\n').replace(/\s+$/, ''));
        }
    }
}

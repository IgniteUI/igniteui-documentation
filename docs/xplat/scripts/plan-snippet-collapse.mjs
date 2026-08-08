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

// ---------------------------------------------------------------------------
// Groups, and the sample each peers
// ---------------------------------------------------------------------------

function findGroups(text) {
    const blockRe = /<PlatformBlock\s+for="([^"]+)">([\s\S]*?)<\/PlatformBlock>/g;
    const found = [];
    let m;
    while ((m = blockRe.exec(text)) !== null) {
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
 * The sample a group is illustrating: the one in the same section of the topic.
 *
 * Direction is not the rule. A topic's opening sample sits above its first snippet, while a
 * section further down writes the snippets and shows the sample under them — both orders occur,
 * so looking only forwards or only backwards mispairs half of them. What holds is that a section
 * is about one thing: its heading, its prose, its snippets and its sample.
 *
 * A section with more than one sample is left unpaired rather than guessed at, since a wrong
 * pairing reports every property of the group as a disagreement.
 */
function peeredSample(text, group) {
    const headings = [...text.matchAll(/^#{2,}\s+.+$/gm)].map(m => m.index);
    const start = group[0].start;
    const end = group[group.length - 1].end;

    const sectionStart = headings.filter(h => h <= start).reduce((a, h) => Math.max(a, h), 0);
    const sectionEnd = headings.filter(h => h > end).reduce((a, h) => Math.min(a, h), text.length);

    const inSection = [...text.matchAll(/<Sample\s+src="([^"]+)"/g)]
        .filter(m => m.index >= sectionStart && m.index < sectionEnd)
        .map(m => m[1]);

    const distinct = [...new Set(inSection)];
    return distinct.length === 1 ? distinct[0] : null;
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

        const src = peeredSample(text, group);
        const sample = src ? loadSample(src) : null;
        if (!sample) { noSample++; continue; }

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

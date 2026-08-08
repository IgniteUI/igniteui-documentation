#!/usr/bin/env node
/**
 * check-snippet-divergence.mjs
 *
 * Finds snippet groups whose per-platform blocks disagree about *content*.
 *
 * A snippet group is a run of <PlatformBlock> sections each holding one markup block for the same
 * sample. They are written by hand, one per platform, so they drift: the same sample ends up with
 * a different value, a missing attribute, or an entirely different configuration on one platform.
 *
 * That matters now because collapsing a group into a single JSON definition forces one answer.
 * Where the platforms already agree, collapsing is mechanical. Where they differ, the difference
 * is almost certainly a mistake in the docs and has to be fixed — or understood — first, because
 * collapsing would silently pick a winner.
 *
 * What is compared is the content, not the dialect. Element names, attribute names, quoting and
 * layout all differ legitimately between platforms:
 *
 *     <igx-bullet-graph minimumValue="5">      Angular
 *     <IgrBulletGraph minimumValue={5}>        React
 *     <igc-bullet-graph minimum-value="5">     Web Components
 *     <IgbBulletGraph MinimumValue="5">        Blazor
 *     <igGauges:XamBulletGraph MinimumValue="5">  XAML
 *
 * All five say the same thing, and this reports nothing. It reports when one of them says 55 and
 * the others say 5.
 *
 *   node scripts/check-snippet-divergence.mjs [--lang=en] [--file=bullet-graph.mdx] [--verbose]
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
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
const ONLY_FILE = argOf('file', null);
const VERBOSE = args.includes('--verbose');

const CONTENT_DIR = path.join(ROOT, 'src', 'content', LANG, 'components');

// ---------------------------------------------------------------------------
// Normalising a markup block to what it actually says
// ---------------------------------------------------------------------------

/**
 * A tag name reduced to the component it names, or null when the tag is not one of our components.
 *
 * Only elements carrying a platform's own prefix count. A topic is free to wrap a sample in a
 * <div>, and XAML writes property elements like <DataChart.Axes>; neither is content, and counting
 * them makes every later element line up against the wrong one.
 */
function canonicalTag(raw) {
    if (raw.includes('.')) return null;         // xaml property element: DataChart.Axes

    let t = raw;
    const hadNamespace = /^[A-Za-z]+:/.test(t);
    t = t.replace(/^[A-Za-z]+:/, '');           // xaml namespace prefix: igGauges:
    t = t.replace(/[-_]/g, '');                 // spinal case: igx-bullet-graph
    t = t.toLowerCase();

    // Platform prefixes, longest first so Xam is not eaten by a shorter match.
    for (const p of ['igniteui', 'igx', 'igc', 'igr', 'igb', 'xam']) {
        if (t.startsWith(p) && t.length > p.length) {
            t = t.slice(p.length);
            if (t.endsWith('component')) t = t.slice(0, -'component'.length);
            return t;
        }
    }
    // A namespaced XAML tag with no Xam prefix is still one of ours (igGauges:LinearGraphRange).
    if (hadNamespace) {
        if (t.endsWith('component')) t = t.slice(0, -'component'.length);
        return t;
    }
    return null;
}

/** An attribute name reduced to the property it names. */
function canonicalAttr(raw) {
    return raw.replace(/[-_]/g, '').toLowerCase();
}

/** An attribute value reduced to what it means, with the platform's delimiters removed. */
function canonicalValue(raw) {
    let v = raw.trim();
    if (v.startsWith('{') && v.endsWith('}')) v = v.slice(1, -1).trim();   // JSX braces
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
    }
    v = v.trim();
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v.toLowerCase();   // hex colour case is not content
    return v;
}

/**
 * The elements a markup block declares, each as its tag and attributes. Deliberately not a real
 * parser: these are documentation snippets, and a tolerant scan reports more than a strict parse
 * that gives up on the first oddity.
 */
function readElements(body) {
    const elements = [];
    const tagRe = /<([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}))*)\s*\/?>/g;
    let m;
    while ((m = tagRe.exec(body)) !== null) {
        const tag = canonicalTag(m[1]);
        if (!tag) continue;
        const attrs = {};
        const attrRe = /([\w:.-]+)\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\})/g;
        let a;
        while ((a = attrRe.exec(m[2])) !== null) {
            const name = canonicalAttr(a[1]);
            // Names and refs are platform plumbing, not content: React writes ref, Angular writes
            // a template variable, and a generated sample invents a name where a doc writes none.
            if (name === 'name' || name === 'id' || name === 'ref') continue;
            attrs[name] = canonicalValue(a[2]);
        }
        elements.push({ tag, attrs });
    }
    return elements;
}

// ---------------------------------------------------------------------------
// Finding the groups
// ---------------------------------------------------------------------------

/**
 * Snippet groups in a topic: runs of consecutive PlatformBlocks that each hold exactly one markup
 * block. A run is broken by prose, so two unrelated samples are not compared with each other.
 */
function findGroups(text) {
    const blockRe = /<PlatformBlock\s+for="([^"]+)">([\s\S]*?)<\/PlatformBlock>/g;
    const found = [];
    let m;
    while ((m = blockRe.exec(text)) !== null) {
        const fence = /```(html|tsx|razor|xaml)\n([\s\S]*?)```/.exec(m[2]);
        if (!fence) continue;
        // Prose between one block and the next means a new group.
        const between = text.slice(found.length ? found[found.length - 1].end : 0, m.index);
        found.push({
            platforms: m[1], lang: fence[1], body: fence[2],
            start: m.index, end: m.index + m[0].length,
            breaks: /\S/.test(between.replace(/<\/?PlatformBlock[^>]*>/g, '')) && found.length > 0,
        });
    }
    // A group is a run of blocks covering *disjoint* platforms. That is what ends it, as much as
    // prose does: not every sample carries a block for every platform, so when a platform comes
    // round again the next sample has started. Without this, a group missing one platform swallows
    // the first block of the sample after it, and everything from there compares against the wrong
    // thing — which looks like the components disagreeing when nothing is wrong.
    const groups = [];
    let current = [];
    let seen = new Set();
    for (const b of found) {
        const platforms = b.platforms.split(',').map(s => s.trim());
        const repeats = platforms.some(p => seen.has(p));
        if ((b.breaks || repeats) && current.length) {
            groups.push(current);
            current = [];
            seen = new Set();
        }
        current.push(b);
        for (const p of platforms) seen.add(p);
    }
    if (current.length) groups.push(current);
    return groups.filter(g => g.length > 1);
}

// ---------------------------------------------------------------------------
// Comparing
// ---------------------------------------------------------------------------

function compareGroup(group) {
    const parsed = group.map(b => ({ platforms: b.platforms, lang: b.lang, elements: readElements(b.body) }));

    // Only compare blocks that actually describe elements.
    const usable = parsed.filter(p => p.elements.length > 0);
    if (usable.length < 2) return null;

    // Blocks whose first component disagrees are almost certainly not variants of one sample —
    // consecutive PlatformBlocks in a topic are not always a group, and pairing a React button
    // with a Blazor grid produces noise rather than a finding. Skipped rather than reported,
    // because what this tool is for is differences within a sample, not proving what a group is.
    const firstTags = new Set(usable.map(p => p.elements[0].tag));
    if (firstTags.size > 1) return null;

    const issues = [];

    const counts = new Set(usable.map(p => p.elements.length));
    if (counts.size > 1) {
        issues.push({
            kind: 'element count',
            detail: usable.map(p => `${p.platforms}: ${p.elements.length}`).join(', '),
        });
    }

    const shortest = Math.min(...usable.map(p => p.elements.length));
    for (let i = 0; i < shortest; i++) {
        const tags = new Set(usable.map(p => p.elements[i].tag));
        if (tags.size > 1) {
            issues.push({
                kind: `element ${i + 1} is a different component`,
                detail: usable.map(p => `${p.platforms}: ${p.elements[i].tag}`).join(', '),
            });
            continue;
        }
        const names = new Set();
        for (const p of usable) for (const k of Object.keys(p.elements[i].attrs)) names.add(k);
        for (const name of names) {
            const values = usable.map(p => [p.platforms, p.elements[i].attrs[name]]);
            const distinct = new Set(values.map(v => v[1] === undefined ? '(absent)' : v[1]));
            if (distinct.size > 1) {
                issues.push({
                    kind: `element ${i + 1} ${name}`,
                    detail: values.map(([pl, v]) => `${pl}: ${v === undefined ? '(absent)' : v}`).join(', '),
                });
            }
        }
    }
    return issues.length ? { platforms: usable.map(p => p.platforms), issues } : null;
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

let filesWithIssues = 0, groupsChecked = 0, groupsDiverged = 0, issueCount = 0;
const byKind = new Map();

for (const file of walk(CONTENT_DIR)) {
    if (ONLY_FILE && !file.endsWith(ONLY_FILE)) continue;
    const text = readFileSync(file, 'utf8');
    const groups = findGroups(text);
    let reported = false;
    for (const group of groups) {
        groupsChecked++;
        const result = compareGroup(group);
        if (!result) continue;
        groupsDiverged++;
        issueCount += result.issues.length;
        for (const i of result.issues) {
            const key = i.kind.replace(/element \d+ /, '');
            byKind.set(key, (byKind.get(key) || 0) + 1);
        }
        if (!reported) { console.log(`\n${path.relative(CONTENT_DIR, file)}`); reported = true; filesWithIssues++; }
        console.log(`  group [${result.platforms.join(' | ')}]`);
        for (const i of result.issues.slice(0, VERBOSE ? 100 : 6)) {
            console.log(`      ${i.kind}: ${i.detail}`);
        }
        if (!VERBOSE && result.issues.length > 6) {
            console.log(`      … and ${result.issues.length - 6} more`);
        }
    }
}

console.log(`\n${groupsDiverged} of ${groupsChecked} snippet groups disagree across platforms` +
    ` (${issueCount} differences in ${filesWithIssues} topics)`);
if (byKind.size) {
    console.log('\nmost common:');
    for (const [k, v] of [...byKind.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
        console.log(`  ${String(v).padStart(5)}  ${k}`);
    }
}

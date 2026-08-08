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

/**
 * Platform member name → the canonical name it maps to, from the vendored apiMap.
 *
 * A property is deliberately named differently on some platforms: the canonical ItemsSource is
 * dataSource on the web ones. That is expected variance the renderer already handles, so comparing
 * the raw names would report a difference on every data bound sample in the docs. The apiMap is the
 * product build's own record of those renames, so it is what decides here rather than a list kept
 * by hand.
 */
const API_MAP_DIR = path.join(ROOT, '..', '..', 'src', 'data', 'api-map');

const canonicalMemberNames = (() => {
    const map = new Map();
    const canonicalNames = new Set();
    const ambiguous = new Set();
    let dirs = [];
    try {
        dirs = readdirSync(API_MAP_DIR).filter(d => statSync(path.join(API_MAP_DIR, d)).isDirectory());
    } catch {
        return map;   // no apiMap available; fall back to comparing names as written
    }
    for (const dir of dirs) {
        for (const file of readdirSync(path.join(API_MAP_DIR, dir))) {
            if (!file.endsWith('.json')) continue;
            let data;
            try { data = JSON.parse(readFileSync(path.join(API_MAP_DIR, dir, file), 'utf8')); }
            catch { continue; }
            for (const type of data.types || []) {
                for (const member of type.members || []) {
                    const original = member.originalName;
                    if (!original || original.includes('.') || original.startsWith('this[')) continue;
                    canonicalNames.add(original.replace(/[-_]/g, '').toLowerCase());
                    for (const n of member.names || []) {
                        if (!n.mappedName) continue;
                        const from = n.mappedName.replace(/[-_]/g, '').toLowerCase();
                        const to = original.replace(/[-_]/g, '').toLowerCase();
                        if (from === to) continue;
                        // Ambiguous: this platform name maps to more than one canonical name, so
                        // it cannot be resolved without knowing the type. Left alone.
                        if (map.has(from) && map.get(from) !== to) { ambiguous.add(from); continue; }
                        map.set(from, to);
                    }
                }
            }
        }
    }
    // A rename is only safe when the platform's name is not itself a canonical name somewhere.
    // One type renaming IconName to `name` must not turn every `name` in the docs into an icon.
    for (const from of [...map.keys()]) {
        if (canonicalNames.has(from) || ambiguous.has(from)) map.delete(from);
    }
    return map;
})();

/** An attribute name reduced to the property it names, in its canonical form. */
function canonicalAttr(raw) {
    const flattened = raw.replace(/[-_]/g, '').toLowerCase();
    return canonicalMemberNames.get(flattened) || flattened;
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

    // How a platform refers to the data is its own business: XAML writes {Binding SalesData},
    // React writes this.state.salesData and Blazor writes SalesData. All three name the same
    // thing, and the renderer already knows how to write each. What matters is whether they name
    // the *same* thing, so the reference is reduced to the name itself.
    const binding = /^\{\s*Binding\s+([\w.]+)\s*\}$/.exec(v);
    if (binding) return binding[1].toLowerCase();
    if (/^@[A-Za-z_][\w.]*$/.test(v)) return v.slice(1).toLowerCase();   // razor: @SalesData
    if (/^(this\.)?(state\.)?[\w.]+$/.test(v) && /[a-zA-Z]/.test(v)) {
        const stripped = v.replace(/^this\./, '').replace(/^state\./, '');
        // Only treat it as a reference when it looks like one rather than a literal value.
        if (/^[A-Za-z_][\w]*$/.test(stripped)) return stripped.toLowerCase();
    }
    return v;
}

/** The colour names the docs actually use, for telling a colour from any other bare word. */
const COLOR_WORDS = new Set([
    'transparent', 'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink',
    'gray', 'grey', 'brown', 'cyan', 'magenta', 'lime', 'navy', 'teal', 'olive', 'maroon', 'silver',
    'gold', 'aqua', 'fuchsia', 'indigo', 'violet', 'salmon', 'khaki', 'plum', 'orchid', 'tan',
    'crimson', 'tomato', 'coral', 'ivory', 'beige', 'lavender', 'turquoise', 'wheat', 'snow',
    'dodgerblue', 'limegreen', 'royalblue', 'skyblue', 'steelblue', 'seagreen', 'forestgreen',
    'darkblue', 'darkgreen', 'darkred', 'darkgray', 'darkgrey', 'lightblue', 'lightgreen',
    'lightgray', 'lightgrey', 'hotpink', 'deeppink', 'deepskyblue', 'midnightblue', 'gainsboro',
]);

/** Whether a value is a number, including the dimension and percentage forms. */
function isNumericValue(v) {
    if (typeof v !== 'string') return false;
    return /^-?\d+(\.\d+)?(px|%|pt|em|rem)?$/.test(v.trim());
}

/** Whether a value names a colour, in any of the notations the docs use. */
function isColorValue(v) {
    if (typeof v !== 'string') return false;
    const s = v.trim().toLowerCase();
    if (/^#[0-9a-f]{3,8}$/.test(s)) return true;
    if (/^rgba?\(/.test(s)) return true;
    return COLOR_WORDS.has(s);
}

/**
 * Whether an attribute value is a reference to something the page supplies, rather than a literal.
 *
 * This is what makes an absence explainable: a platform that binds its data in code writes no
 * attribute at all, so `{Binding SalesData}` on one platform and nothing on another is the same
 * sample expressed two ways. A missing *literal* is not explained by that and stays reported.
 */
function isReferenceValue(raw) {
    let v = raw.trim();
    if (v.startsWith('{') && v.endsWith('}')) {
        const inner = v.slice(1, -1).trim();
        if (/^Binding\s+[\w.]+$/.test(inner)) return true;      // {Binding SalesData}
        v = inner;
    }
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1).trim();
    }
    if (/^@[A-Za-z_]/.test(v)) return true;                      // razor: @SalesData
    return /^(this\.|state\.)/.test(v);                          // this.state.salesData
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
        const bindings = new Set();
        const attrRe = /([\w:.-]+)\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\})/g;
        let a;
        while ((a = attrRe.exec(m[2])) !== null) {
            // Checked on the name as written, before any rename: these are platform plumbing,
            // not content — React writes ref, Angular a template variable, and a generated sample
            // invents a name where a doc writes none.
            const written = a[1].replace(/^[\w]+:/, '').replace(/[-_]/g, '').toLowerCase();
            if (written === 'name' || written === 'id' || written === 'ref' || written === 'key') continue;
            const name = canonicalAttr(a[1]);
            // Dimensions are presentation, and they legitimately differ: a web block sizes the
            // sample for the page it sits on, and the XAML platforms omit them entirely because
            // the hosting panel decides. Emission handles that with a style option, so a
            // difference here is not something to fix in the source.
            if (name === 'width' || name === 'height') continue;
            attrs[name] = canonicalValue(a[2]);
            if (isReferenceValue(a[2])) bindings.add(name);
        }
        elements.push({ tag, attrs, bindings });
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

    const issues = [];

    // Compared per component rather than by position. A platform legitimately carries an element
    // the others do not — XAML declares the axes a CategoryChart infers, Angular groups columns in
    // a layout — and lining up by position makes one such element throw every later comparison off,
    // reporting the whole rest of the snippet as different when only one thing is.
    const byTag = usable.map(p => {
        const m = new Map();
        for (const el of p.elements) {
            if (!m.has(el.tag)) m.set(el.tag, []);
            m.get(el.tag).push(el);
        }
        return { platforms: p.platforms, tags: m };
    });

    const allTags = new Set();
    for (const p of byTag) for (const tag of p.tags.keys()) allTags.add(tag);

    for (const tag of allTags) {
        const counts = byTag.map(p => [p.platforms, (p.tags.get(tag) || []).length]);
        const nonZero = counts.filter(c => c[1] > 0).map(c => c[1]);
        const distinctCounts = new Set(nonZero);
        const detail = counts.map(([pl, n]) => `${pl}: ${n}`).join(', ');

        // A platform showing none of a component is showing a smaller piece of the sample — the
        // topics do that deliberately, illustrating a feature rather than repeating the whole
        // thing. Reported apart from the platforms that show it and disagree about how many, which
        // is the one that says something is wrong.
        if (distinctCounts.size > 1) {
            issues.push({ kind: `how many ${tag}`, detail });
        } else if (counts.some(c => c[1] === 0)) {
            issues.push({ kind: `${tag} shown only on some platforms`, detail, scope: true });
        }

        const withTag = byTag.filter(p => (p.tags.get(tag) || []).length > 0);
        if (withTag.length < 2) continue;
        const common = Math.min(...withTag.map(p => p.tags.get(tag).length));

        for (let i = 0; i < common; i++) {
            const names = new Set();
            for (const p of withTag) for (const k of Object.keys(p.tags.get(tag)[i].attrs)) names.add(k);

            for (const name of names) {
                const values = withTag.map(p => [p.platforms, p.tags.get(tag)[i].attrs[name]]);
                const present = values.filter(v => v[1] !== undefined);
                const distinct = new Set(present.map(v => v[1]));
                const where = common > 1 ? `${tag} ${i + 1}` : tag;
                const detail = values.map(([pl, v]) => `${pl}: ${v === undefined ? '(absent)' : v}`).join(', ');

                // A colour chosen differently is a cosmetic choice, not a claim about the
                // component, and picking one when collapsing changes nothing a reader relies on.
                if (present.length > 0 && present.every(v => isColorValue(v[1]))) continue;
                // Numbers likewise: a minimum, maximum or extent is an illustrative figure that
                // the topics pick freely.
                if (present.length > 0 && present.every(v => isNumericValue(v[1]))) continue;

                if (distinct.size > 1) {
                    issues.push({ kind: `${where} ${name}`, detail });
                    continue;
                }
                if (present.length === values.length) continue;

                // Absent on some platform. Explained only when the platforms that do write it are
                // binding to something the page supplies, since a platform may bind the same thing
                // in code instead. A missing literal is not explained and is still reported.
                const boundWherePresent = withTag.every(p =>
                    p.tags.get(tag)[i].attrs[name] === undefined || p.tags.get(tag)[i].bindings.has(name));
                if (!boundWherePresent) {
                    issues.push({ kind: `${where} ${name}`, detail });
                }
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

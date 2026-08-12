#!/usr/bin/env node
/**
 * add-xaml-snippets.mjs
 *
 * Adds XAML snippets to topics, alongside the existing per-platform snippets.
 *
 * The snippets are *sculpted*, not dumped: the doc body carries minimal,
 * feature-focused illustrations (Blazor's column-sorting snippet is 3 lines),
 * while the full sample source is what the sample widget serves in its code
 * tabs. So for each existing snippet group this reads the sibling web snippet,
 * maps its attribute names to their canonical XAML form, and emits only those
 * attributes — taking values from the real winui-samples markup wherever
 * possible so they are accurate rather than invented.
 *
 * Name resolution is apiMap-authoritative with a fuzzy fallback
 * (`dataSource` → `ItemsSource` from the map; `headerClickAction` →
 * `HeaderClickAction` by convention). See dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/notes/WINUI-UNO-PLAN.md §6.4.
 *
 * **Lockstep is enforced, not assumed.** A topic is edited only when its en and
 * jp copies agree on the *sequence* of snippet groups — same count, same
 * reference platform per group. 47 of 292 topics are already structurally
 * divergent between locales, and inserting into each independently would deepen
 * that. Divergent topics are skipped and reported for manual handling, so this
 * pass never widens the gap between locales.
 *
 * Usage:
 *   node scripts/add-xaml-snippets.mjs --dry-run
 *   node scripts/add-xaml-snippets.mjs --only grids/data-grid
 *   node scripts/add-xaml-snippets.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractXamlSnippet, formatXaml, readXmlnsMap, findPrimaryElement } from './lib/extract-xaml-snippet.mjs';
import { loadApiMap, resolveApiMapRoot, resolveMemberName, resolveTypeName, fuzzyToPascal } from './lib/api-map-names.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPO_ROOT = path.resolve(ROOT, '..', '..');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');
const ONLY = (() => {
    const i = args.indexOf('--only');
    return i >= 0 ? args[i + 1] : null;
})();
const LANGS = ['en', 'jp'];

const SAMPLES = process.env.WINUI_SAMPLES_ROOT ?? path.resolve(REPO_ROOT, '..', 'winui-samples', 'samples');

/** Platform plumbing, never part of a XAML snippet. */
const DROP_ATTRS = new Set([
    'ref', 'id', 'class', 'style', 'key', 'slot',
    // The WinUI samples size via the layout container, not on the control.
    'height', 'width',
]);

/** Preference order for the snippet we mirror: closest to XAML first. */
const REFERENCE_ORDER = ['Blazor', 'React', 'WebComponents', 'Angular'];

const apiMapRoot = resolveApiMapRoot(null, REPO_ROOT);
if (!apiMapRoot) {
    console.error('[xaml] apiMap not found');
    process.exit(1);
}
const apiMap = loadApiMap(apiMapRoot);

/**
 * Every property name used anywhere in the WinUI sample corpus.
 *
 * Second line of defence: when a web attribute has no counterpart on *this*
 * sample's element, the mapped name is still trustworthy if it appears in real
 * WinUI code elsewhere. A name that appears nowhere in the corpus is most
 * likely web-only and is dropped rather than published.
 */
const corpusNames = (() => {
    const names = new Set();
    const walk = d => {
        for (const e of readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name.endsWith('.xaml')) {
                const t = readFileSync(p, 'utf8');
                for (const m of t.matchAll(/([\w]+)\s*=\s*"/g)) names.add(m[1].toLowerCase());
                for (const m of t.matchAll(/<\w+:\w+\.(\w+)>/g)) names.add(m[1].toLowerCase());
            } else if (e.name.endsWith('.cs')) {
                const t = readFileSync(p, 'utf8');
                for (const m of t.matchAll(/\.(\w+)\s*[=(]/g)) names.add(m[1].toLowerCase());
            }
        }
    };
    if (existsSync(SAMPLES) && statSync(SAMPLES).isDirectory()) walk(SAMPLES);
    return names;
})();

// ---------------------------------------------------------------------------
// Parsing the existing snippet groups
// ---------------------------------------------------------------------------

/**
 * A "group" is a run of PlatformBlocks separated only by blank lines. The XAML
 * block is appended at the end of the run, where a reader expects the next
 * platform's variant.
 */
function findSnippetGroups(text) {
    const blocks = [];
    const re = /<PlatformBlock for="([^"]+)">\s*([\s\S]*?)\s*<\/PlatformBlock>/g;
    let m;
    while ((m = re.exec(text))) {
        blocks.push({ platforms: m[1], body: m[2], start: m.index, end: m.index + m[0].length });
    }
    const groups = [];
    for (const b of blocks) {
        const last = groups[groups.length - 1];
        if (last && text.slice(last.end, b.start).trim() === '') last.blocks.push(b), (last.end = b.end);
        else groups.push({ blocks: [b], end: b.end });
    }
    // Only groups that actually contain a fenced code block are snippet groups.
    return groups.filter(g => g.blocks.some(b => /```/.test(b.body)));
}

/**
 * Pulls the element name and attributes out of a web snippet.
 *
 * `elementCount` is how many product elements the snippet contains: more than
 * one means it demonstrates nested structure, which must not be flattened away.
 */
function parseWebElement(code) {
    const el = code.match(/<((?:Ig[rbcx]|igc-)[\w-]*)([\s\S]*?)\/?>/);
    if (!el) return null;
    const attrs = [];
    for (const a of el[2].matchAll(/([@a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|\{([^}]*)\}|'([^']*)')/g)) {
        attrs.push({ name: a[1], value: a[2] ?? a[3] ?? a[4] ?? '' });
    }
    const opens = [...code.matchAll(/<((?:Ig[rbcx]|igc-)[\w-]*)/g)].map(m => m[1]);
    const distinct = new Set(opens);
    return { type: el[1], attrs, elementCount: distinct.size, openCount: opens.length };
}

/**
 * The sample's real element subtree — children, property-element wrappers and all.
 * Used whenever the reference snippet shows nested structure.
 *
 * Children are never touched: the nested shape is the thing being documented.
 * The *root* element's attributes are pruned to those the reference snippet
 * actually illustrates, so the snippet stays focused instead of reproducing
 * every property the runnable sample happens to set. An attribute is kept when
 * it is in the sculpted set, when it is `Name`/`ItemsSource` (the identity and
 * data the children depend on), or when a child binds to it by `ElementName`.
 */
function buildSubtreeSnippet(sampleDir, preferredLocalName, keepNames = null) {
    const file = path.join(sampleDir, 'Sample.xaml');
    if (!existsSync(file)) return null;
    const xaml = readFileSync(file, 'utf8');
    const r =
        extractXamlSnippet(xaml, { localName: `Xam${preferredLocalName}` }) ||
        extractXamlSnippet(xaml, { localName: preferredLocalName });
    if (!r) return null;

    let snippet = r.snippet;
    if (keepNames && keepNames.size) {
        const nl = snippet.indexOf('\n');
        // End of the root's open tag: the first `>` outside a quoted value.
        // Must be the index *after* it, so a self-closing `/>` is consumed whole
        // and its `>` is not left behind to duplicate the re-attached tail.
        let openEnd = -1;
        let inQuote = false;
        for (let i = 0; i < snippet.length; i++) {
            const c = snippet[i];
            if (c === '"') inQuote = !inQuote;
            else if (c === '>' && !inQuote) { openEnd = i + 1; break; }
        }
        if (nl !== -1 && openEnd !== -1) {
            const openTag = snippet.slice(0, openEnd);
            const rest = snippet.slice(openEnd);
            const lines = openTag.split('\n');
            const head = lines[0];
            const attrLines = lines.slice(1);
            const referenced = new Set(
                [...snippet.matchAll(/ElementName=(\w+)/g)].map(m => m[1].toLowerCase()),
            );
            // `formatXaml` hangs the closing `>` off the last attribute line, so
            // strip it while filtering and re-attach it to whatever ends up last.
            const tail = openTag.trimEnd().endsWith('/>') ? ' />' : '>';
            const bare = attrLines
                .map(l => l.replace(/\s*\/?>\s*$/, ''))
                .filter(l => l.trim());
            const kept = bare.filter(l => {
                const m = l.match(/^\s*([\w:.]+)\s*=/);
                if (!m) return false;
                const name = m[1].toLowerCase();
                if (keepNames.has(name)) return true;
                if (name === 'itemssource') return true;
                if (name === 'name') {
                    const v = l.match(/="([^"]*)"/);
                    return v ? referenced.has(v[1].toLowerCase()) : false;
                }
                return false;
            });
            if (kept.length) {
                kept[kept.length - 1] += tail;
                snippet = [head, ...kept].join('\n') + rest;
            }
        }
    }
    return { snippet, emitted: [{ name: '(subtree)', via: 'sample-subtree' }], skipped: [] };
}

/** Normalises a web attribute value into XAML attribute syntax. */
function normaliseValue(raw) {
    let v = String(raw).trim();
    if (!v) return null;
    // `HeaderClickAction.SortByMultipleColumns` → `SortByMultipleColumns`
    const enumMatch = v.match(/^[A-Za-z][\w]*\.([A-Za-z][\w]*)$/);
    if (enumMatch) return enumMatch[1];
    // Expressions we cannot faithfully translate.
    if (/^(this\.|\{|=>|\(|new\s)/.test(v) || v.includes('=>')) return null;
    if (/^(true|false)$/i.test(v)) return v.toLowerCase();
    if (/^-?[\d.]+$/.test(v)) return v;
    if (/^[A-Za-z][\w]*$/.test(v)) return v;      // bare identifier, e.g. DataSource="DataSource"
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v;
    return v.includes('"') ? null : v;
}

// ---------------------------------------------------------------------------
// Building the XAML snippet
// ---------------------------------------------------------------------------

/** `IgbDataGridToolbar` → `DataGridToolbar`; `igc-data-grid` → `DataGrid`. */
function webTypeToXamlLocalName(webType) {
    const stem = webType.startsWith('igc-')
        ? webType
              .slice(4)
              .replace(/[-_](\w)/g, (_m, c) => c.toUpperCase())
              .replace(/^(\w)/, (_m, c) => c.toUpperCase())
        : webType.replace(/^(Igr|Igc|Igb|Igx)/, '');
    return stem;
}

/**
 * Chooses which of a topic's samples to source a group from.
 *
 * A topic's groups can document different controls — chart-markers mixes
 * CategoryChart and DataChart, chart-performance spans three chart types — so
 * binding one sample per topic silently drops every group whose control that
 * sample does not contain. Search the topic's own `<Sample>` refs for one that
 * actually has the element, preferring an exact `Xam<name>` match.
 */
function pickSampleFor(sampleRefs, localName) {
    const wanted = [`Xam${localName}`, localName];
    for (const want of wanted) {
        for (const ref of sampleRefs) {
            const file = path.join(SAMPLES, ref, 'Sample.xaml');
            if (!existsSync(file)) continue;
            const xaml = readFileSync(file, 'utf8');
            if (new RegExp(`<\\w+:${want}(?=[\\s/>.])`).test(xaml)) return ref;
        }
    }
    return null;
}

/**
 * Index of every XAML element in the corpus: local name → { prefix, sample ref }.
 *
 * A topic's own samples are the first choice, but a doc for an in-scope component
 * must be processed whether or not *that* sample exists yet. This lets a group
 * fall back to any sample in the corpus that uses the element, and — failing that
 * — supplies the correct prefix so a snippet can still be emitted from the web
 * reference alone.
 */
const corpusElements = (() => {
    const byName = new Map();
    const walk = d => {
        for (const e of readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) { walk(p); continue; }
            if (e.name !== 'Sample.xaml') continue;
            const rel = path.relative(SAMPLES, path.dirname(p));
            const xaml = readFileSync(p, 'utf8');
            for (const m of xaml.matchAll(/<(\w+):(\w+)(?=[\s/>.])/g)) {
                if (!byName.has(m[2])) byName.set(m[2], { prefix: m[1], ref: rel });
            }
        }
    };
    if (existsSync(SAMPLES) && statSync(SAMPLES).isDirectory()) walk(SAMPLES);
    return byName;
})();

/**
 * Resolves the XAML element for a web type, and where to source it from.
 *
 * Controls are `Xam`-prefixed in WinUI while helper types are not, so the corpus
 * is consulted rather than a prefix rule guessed (`RadialGaugeRange` is bare even
 * though the apiMap's legacy canonical says `XamRadialGaugeRange`).
 */
function resolveXamlElement(sampleRefs, webType) {
    const localName = webTypeToXamlLocalName(webType);
    const inTopic = pickSampleFor(sampleRefs, localName);
    if (inTopic) {
        const preferred = existsSync(path.join(SAMPLES, inTopic, 'Sample.xaml')) &&
            new RegExp(`<\\w+:Xam${localName}(?=[\\s/>.])`).test(readFileSync(path.join(SAMPLES, inTopic, 'Sample.xaml'), 'utf8'))
            ? `Xam${localName}` : localName;
        return { localName: preferred, ref: inTopic, via: 'topic-sample' };
    }
    for (const cand of [`Xam${localName}`, localName]) {
        const hit = corpusElements.get(cand);
        if (hit) return { localName: cand, ref: hit.ref, prefix: hit.prefix, via: 'corpus-sample' };
    }
    // Not in the corpus at all: emit from the web reference, prefixing only the
    // control-shaped names (that is the WinUI convention for controls).
    const isControl = /(?:Chart|Grid|Gauge|Graph|Map|Toolbar|Spreadsheet|Sparkline|Editor)$/.test(localName);
    return { localName: isControl ? `Xam${localName}` : localName, ref: null, via: 'web-derived' };
}

/**
 * Attribute values as they appear on a specific element of the real sample.
 *
 * `preferred` is the element the web snippet is about — a topic's snippet group
 * may target the toolbar or a column rather than the grid itself, and putting
 * those attributes on the grid element would be wrong. Tries `Xam<name>` then
 * `<name>`, and returns null when the sample has no such element so the caller
 * can skip rather than invent.
 */
function sampleAttributes(sampleDir, preferred = null) {
    const file = path.join(sampleDir, 'Sample.xaml');
    if (!existsSync(file)) return null;
    const xaml = readFileSync(file, 'utf8');
    const found =
        (preferred && (findPrimaryElement(xaml, `Xam${preferred}`) || findPrimaryElement(xaml, preferred))) ||
        (preferred ? null : findPrimaryElement(xaml));
    if (!found) return null;
    const tagEnd = xaml.indexOf('>', found.start);
    const head = xaml.slice(found.start, tagEnd);
    // Keyed case-insensitively, but the literal spelling is retained: the
    // sample is compiled code, so its attribute names are the authoritative
    // WinUI names and are what gets emitted.
    const attrs = new Map();
    for (const a of head.matchAll(/([\w:.]+)\s*=\s*"([^"]*)"/g)) {
        attrs.set(a[1].toLowerCase(), { name: a[1], value: a[2] });
    }
    return {
        prefix: found.prefix,
        localName: found.localName,
        attrs,
        xmlns: readXmlnsMap(xaml).get(found.prefix) ?? null,
    };
}

/**
 * Sculpts a XAML snippet mirroring `web`'s attribute set.
 *
 * Direction matters: the apiMap is authored canonical → platform, so it is used
 * here only to work out *which* sample attribute a web attribute corresponds to.
 * The emitted name and value then come from the sample — compiled code, and
 * therefore authoritative for WinUI — rather than from an inverted map lookup,
 * which is ambiguous for renamed members (`dataSource` inverts to both
 * `ItemsSource` and `DataSource`).
 *
 * Returns null when nothing trustworthy can be emitted.
 */
function buildSnippet(web, sample, target = null) {
    const canonicalType = resolveTypeName(apiMap, web.type.replace(/^igc-/, '')).name;
    if (!sample) {
        // No sample element to source from: synthesise from the web reference.
        const prefix = target?.prefix ?? corpusElements.get(target?.localName)?.prefix ?? 'ig';
        sample = { prefix, localName: target?.localName ?? webTypeToXamlLocalName(web.type), attrs: new Map(), xmlns: null };
    }
    const emitted = [];
    const skipped = [];

    for (const { name, value } of web.attrs) {
        const bare = name.replace(/^@/, '');
        if (DROP_ATTRS.has(bare.toLowerCase())) continue;
        if (/^on[A-Z]/.test(bare) || bare.startsWith('@bind')) continue;

        // Candidate canonical spellings, best first, used purely to locate the
        // corresponding attribute on the sample element.
        const resolved = resolveMemberName(apiMap, bare, canonicalType);
        const candidates = [resolved.name, ...(resolved.ambiguous ?? []), fuzzyToPascal(bare)];

        const hit = candidates.map(c => sample.attrs.get(c.toLowerCase())).find(Boolean);
        if (hit) {
            // Authoritative: name and value both straight from the sample.
            emitted.push({ name: hit.name, value: hit.value, via: `sample/${resolved.via}` });
            continue;
        }

        // `*Name` properties are a known trap: on the web they are *string*
        // references to a named element (`xAxisName="xAxis"`,
        // `targetGridName="grid"`), whereas XAML binds the object itself
        // (`XAxis="{Binding ElementName=xAxis}"`, `TargetGrid="{Binding …}"`).
        // The value shapes are therefore incompatible, so these may only be
        // emitted when the sample element supplies the value — never through the
        // corpus fallback below, which would carry the web string across.
        if (/Name$/.test(bare) && bare !== 'Name') {
            skipped.push(`${bare} (*Name property — needs an element binding, not on sample)`);
            continue;
        }

        // Not on this sample's element. Fall back in order of authority:
        //   corpus hit   — the name is used in real WinUI code
        //   apiMap hit   — the map is the authority on naming, and its coverage
        //                  is far wider than the 279-sample corpus, so a direct
        //                  hit stands on its own
        //   fuzzy only   — PascalCase convention; emitted so an in-scope doc is
        //                  still processed, but recorded as the weakest source
        const v = normaliseValue(value);
        if (v === null || v === undefined) {
            skipped.push(`${bare} (no usable value)`);
            continue;
        }
        const inCorpus = candidates.find(c => corpusNames.has(c.toLowerCase()));
        if (inCorpus) {
            emitted.push({ name: inCorpus, value: v, via: `corpus/${resolved.via}` });
        } else if (resolved.via.startsWith('apimap')) {
            emitted.push({ name: resolved.name, value: v, via: `apimap-only/${resolved.via}` });
        } else {
            emitted.push({ name: resolved.name, value: v, via: 'fuzzy-only' });
        }
    }

    if (!emitted.length) return null;

    // Two web attributes can resolve to the same XAML property (the web surface
    // sometimes splits what XAML exposes once). Emitting both would produce a
    // duplicate attribute and invalid markup, so keep the first.
    const seenAttr = new Set();
    const deduped = emitted.filter(a => {
        const k = a.name.toLowerCase();
        if (seenAttr.has(k)) {
            skipped.push(`${a.name} (duplicate of an already-mapped property)`);
            return false;
        }
        seenAttr.add(k);
        return true;
    });
    emitted.length = 0;
    emitted.push(...deduped);

    // Bare prefix, no xmlns declaration. The declaration is the one part of a
    // XAML snippet that differs by dialect — `using:` on WinUI/UWP and Uno,
    // `clr-namespace:…;assembly=…` on WPF — so emitting it would make the
    // snippet wrong for a platform we intend to add later. Real pages declare
    // prefixes once at the top of the file, which is what these assume.
    const tag = `${sample.prefix}:${sample.localName}`;
    const attrText = emitted.map(a => `${a.name}="${a.value}"`).join(' ');
    return {
        snippet: formatXaml(`<${tag} ${attrText} />`),
        emitted,
        skipped,
    };
}

// ---------------------------------------------------------------------------
// Walking topics
// ---------------------------------------------------------------------------

function topicFiles(lang) {
    const base = path.join(ROOT, 'src', 'content', lang, 'components');
    const out = [];
    const walk = d => {
        for (const e of readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name.endsWith('.mdx')) out.push(p);
        }
    };
    if (existsSync(base)) walk(base);
    return out.filter(f => !ONLY || f.includes(ONLY));
}

const stats = {
    topics: 0,
    changed: 0,
    groups: 0,
    inserted: 0,
    skippedGroups: 0,
    skippedDivergent: 0,
    skippedNoJp: 0,
};
const detail = [];
const divergent = [];
const gaps = [];

/**
 * Plans the insertions for one locale's copy of a topic.
 * Returns `{ inserts, signature }`; the signature is what the locales must agree
 * on for the edit to be lockstep-safe.
 */
function planTopic(file, text, sampleRefs, sampleRef) {
    const groups = findSnippetGroups(text);
    const inserts = [];
    const signature = [];
    for (const g of groups) {
        let web = null;
        for (const pref of REFERENCE_ORDER) {
            const b = g.blocks.find(x => x.platforms.includes(pref) && /```/.test(x.body));
            if (!b) continue;
            const code = b.body.match(/```\w*\n([\s\S]*?)\n```/);
            if (!code) continue;
            const parsed = parseWebElement(code[1]);
            if (parsed) { web = parsed; break; }
        }
        if (!web) { signature.push('-'); continue; }

        // Resolve the element and where to source it. An in-scope component's doc
        // is processed even when its sample does not exist yet — the chain falls
        // back topic-sample → corpus-sample → web-derived rather than skipping.
        const target = resolveXamlElement(sampleRefs, web.type);
        const sampleDirForGroup = target.ref ? path.join(SAMPLES, target.ref) : null;
        const sample = sampleDirForGroup ? sampleAttributes(sampleDirForGroup, target.localName.replace(/^Xam/, '')) : null;
        if (!sample && target.via !== 'web-derived') {
            signature.push(`${web.type}:no-element`);
            gaps.push({ file: path.relative(REPO_ROOT, file), web: web.type, reason: `element ${target.localName} not readable` });
            continue;
        }
        if (target.via !== 'topic-sample') {
            gaps.push({ file: path.relative(REPO_ROOT, file), web: web.type, reason: `sourced ${target.via}` });
        }

        // When the reference snippet contains child elements, the section is
        // about that nested structure (column definitions, gauge ranges, geo
        // series). A flat attribute-only snippet would silently drop it and read
        // as if the feature needed no markup, so take the sample's real subtree —
        // which also carries the property-element wrappers XAML requires
        // (`XamDataGrid.Columns`, `XamRadialGauge.Ranges`) and that the web
        // platforms express as plain children.
        const refHasChildren = (web.elementCount ?? 1) > 1;
        const flat = buildSnippet(web, sample, target);
        const built = refHasChildren && sampleDirForGroup
            ? buildSubtreeSnippet(
                  sampleDirForGroup,
                  webTypeToXamlLocalName(web.type),
                  new Set((flat?.emitted ?? []).map(e => e.name.toLowerCase())),
              ) ?? flat
            : flat;
        if (!built) { signature.push(`${web.type}:no-snippet`); continue; }

        signature.push(`${web.type}->${sample.localName}`);
        inserts.push({
            at: g.end,
            block: `\n\n<PlatformBlock for="Xaml">\n\`\`\`xaml\n${built.snippet}\n\`\`\`\n</PlatformBlock>`,
            built,
            web,
            sample,
        });
    }
    return { inserts, signature: signature.join('|') };
}

function applyInserts(text, inserts) {
    for (let i = inserts.length - 1; i >= 0; i--) {
        text = text.slice(0, inserts[i].at) + inserts[i].block + text.slice(inserts[i].at);
    }
    if (!/^import PlatformBlock /m.test(text)) {
        text = text.replace(
            /^(---\n[\s\S]*?\n---\n\n)/,
            `$1import PlatformBlock from 'igniteui-astro-components/components/mdx/PlatformBlock.astro';\n`,
        );
    }
    return text;
}

// Drive from en, requiring a matching jp copy: both are edited together or neither is.
const EN = 'en';
const OTHER = LANGS.filter(l => l !== EN);

for (const enFile of topicFiles(EN)) {
    const rel = path.relative(path.join(ROOT, 'src', 'content', EN, 'components'), enFile);
    const texts = { [EN]: readFileSync(enFile, 'utf8') };
    const files = { [EN]: enFile };

    let missing = false;
    for (const lang of OTHER) {
        const f = path.join(ROOT, 'src', 'content', lang, 'components', rel);
        if (!existsSync(f)) { missing = true; break; }
        files[lang] = f;
        texts[lang] = readFileSync(f, 'utf8');
    }
    if (missing) { stats.skippedNoJp++; continue; }
    if (Object.values(texts).some(t => /<PlatformBlock for="[^"]*Xaml/.test(t))) continue;

    const sampleRefs = [...new Set([...texts[EN].matchAll(/<Sample\s+src="\/([^"]+)"/g)].map(m => m[1]))]
        .filter(s => !s.includes('{') && existsSync(path.join(SAMPLES, s)));
    if (!sampleRefs.length) continue;
    const sampleRef = sampleRefs[0];

    stats.topics++;
    const plans = {};
    for (const lang of LANGS) plans[lang] = planTopic(files[lang], texts[lang], sampleRefs, sampleRef);
    stats.groups += plans[EN].signature.split('|').filter(s => s !== '').length;

    // Lockstep gate: every locale must plan the same sequence of insertions.
    const sigs = new Set(LANGS.map(l => plans[l].signature));
    if (sigs.size > 1) {
        stats.skippedDivergent++;
        divergent.push({ rel, sigs: LANGS.map(l => `${l}:${plans[l].signature || '(none)'}`) });
        continue;
    }
    if (!plans[EN].inserts.length) continue;

    for (const lang of LANGS) {
        const out = applyInserts(texts[lang], plans[lang].inserts);
        if (!DRY) writeFileSync(files[lang], out, 'utf8');
    }
    stats.changed += LANGS.length;
    stats.inserted += plans[EN].inserts.length * LANGS.length;
    for (const ins of plans[EN].inserts) {
        if (!VERBOSE) continue;
        detail.push(`  ${rel}  ${ins.web.type} → ${ins.sample.localName}` +
            `  [${ins.built.emitted.map(e => `${e.name}:${e.via}`).join(', ')}]` +
            (ins.built.skipped.length ? `  skipped: ${ins.built.skipped.join(', ')}` : ''));
    }
}

if (VERBOSE) for (const d of detail.slice(0, 80)) console.log(d);
if (divergent.length) {
    console.log(`\n  skipped — en/jp plan differently (manual handling needed):`);
    for (const d of divergent.slice(0, 15)) {
        console.log(`    ${d.rel}`);
        for (const s of d.sigs) console.log(`        ${s.slice(0, 150)}`);
    }
    if (divergent.length > 15) console.log(`    … ${divergent.length - 15} more`);
}
console.log(`\n  topics considered: ${stats.topics}   snippet groups: ${stats.groups}`);
console.log(`  skipped: ${stats.skippedDivergent} divergent between locales, ${stats.skippedNoJp} with no jp counterpart`);
console.log(`  XAML blocks per locale: ${stats.inserted / LANGS.length}   files written: ${stats.changed}`);
console.log(`  lockstep: enforced by construction (identical plans required across ${LANGS.join('/')})`);
console.log(`\n[xaml] ${DRY ? 'would insert' : 'inserted'} ${stats.inserted} block(s) across ${LANGS.length} locale(s)\n`);

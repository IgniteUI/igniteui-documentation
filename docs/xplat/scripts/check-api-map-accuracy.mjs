#!/usr/bin/env node
/**
 * check-api-map-accuracy.mjs
 *
 * Regression test for apiMap-authoritative name resolution.
 *
 * Establishes that switching from fuzzy (PascalCase/prefix) resolution to
 * "apiMap first, fuzzy fallback" moves *only* toward accuracy. It does this
 * against an independent ground truth — the real WinUI sample sources in
 * winui-samples, which are compiled code and therefore use names that actually
 * exist on the controls.
 *
 * For every property name appearing in the web platforms' doc snippets:
 *   - compute the fuzzy candidate and the apiMap candidate
 *   - look up both in the WinUI sources
 *   - classify the outcome
 *
 * A run is a PASS when no case is classified `fuzzy-better`.
 *
 * Usage:
 *   node scripts/check-api-map-accuracy.mjs
 *   node scripts/check-api-map-accuracy.mjs --verbose
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    loadApiMap,
    resolveApiMapRoot,
    resolveMemberName,
    resolveTypeName,
    fuzzyToPascal,
} from './lib/api-map-names.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPO_ROOT = path.resolve(ROOT, '..', '..');
const VERBOSE = process.argv.includes('--verbose');

const WINUI_SAMPLES =
    process.env.WINUI_SAMPLES_ROOT ?? path.resolve(REPO_ROOT, '..', 'winui-samples', 'samples');

// ---------------------------------------------------------------------------
// Ground truth: every attribute / property name used in the WinUI samples
// ---------------------------------------------------------------------------

function collectWinUINames(dir) {
    const attrs = new Set();
    /** XAML element local names present in the samples, e.g. XamDataGrid, TextColumn. */
    const elements = new Set();
    const walk = d => {
        for (const entry of readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, entry.name);
            if (entry.isDirectory()) {
                walk(p);
            } else if (entry.name.endsWith('.xaml')) {
                const t = readFileSync(p, 'utf8');
                for (const m of t.matchAll(/(\w+)\s*=\s*"/g)) attrs.add(m[1]);
                for (const m of t.matchAll(/<\w+:(\w+)\.(\w+)>/g)) attrs.add(m[2]);
                for (const m of t.matchAll(/<\/?\w+:(\w+)[\s/>.]/g)) elements.add(m[1]);
            } else if (entry.name.endsWith('.cs')) {
                const t = readFileSync(p, 'utf8');
                for (const m of t.matchAll(/\.(\w+)\s*=/g)) attrs.add(m[1]);
                for (const m of t.matchAll(/\b(\w+)\s*=\s*(?:new|"|\d|true|false)/g)) attrs.add(m[1]);
                for (const m of t.matchAll(/\bnew\s+(\w+)\s*[({]/g)) elements.add(m[1]);
            }
        }
    };
    walk(dir);
    return { attrs, elements };
}

/**
 * Whether a doc type has a WinUI counterpart at all.
 *
 * The ground truth is name *presence*, not type-scoped membership, so a
 * web-only component (Divider, Input, …) would otherwise be judged against
 * incidental matches from unrelated samples. Restricting to types WinUI
 * actually ships keeps the comparison meaningful.
 */
function hasWinUICounterpart(docType, elements) {
    const stem = docType.replace(/^igc-/, '').replace(/^(Igr|Igc|Igb|Igx)/, '');
    const pascal = stem.replace(/[-_](\w)/g, (_m, c) => c.toUpperCase()).replace(/^(\w)/, (_m, c) => c.toUpperCase());
    return elements.has(pascal) || elements.has(`Xam${pascal}`);
}

// ---------------------------------------------------------------------------
// Web doc snippets: platform property names, with their owning type
// ---------------------------------------------------------------------------

/** Pulls `<IgrX attr={…} …>` / `<igc-x attr="…">` / `<IgbX Attr="…">` usages. */
function collectDocUsages(contentDir) {
    const usages = [];
    const walk = d => {
        for (const entry of readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, entry.name);
            if (entry.isDirectory()) {
                walk(p);
                continue;
            }
            if (!entry.name.endsWith('.mdx')) continue;
            const text = readFileSync(p, 'utf8');
            for (const block of text.matchAll(/```(?:tsx|html|razor)\n([\s\S]*?)\n```/g)) {
                const code = block[1];
                // JSX / Razor elements: <IgrDataGrid …>, <IgbDataGrid …>
                for (const el of code.matchAll(/<(Ig[rbcx]\w+)([\s\S]*?)\/?>/g)) {
                    const type = el[1];
                    for (const a of el[2].matchAll(/(?:^|\s)([a-zA-Z][\w-]*)\s*=/g)) {
                        usages.push({ file: p, type, attr: a[1] });
                    }
                }
                // Custom elements: <igc-data-grid header-click-action="…">
                for (const el of code.matchAll(/<(igc-[\w-]+)([\s\S]*?)\/?>/g)) {
                    const type = el[1];
                    for (const a of el[2].matchAll(/(?:^|\s)([a-zA-Z][\w-]*)\s*=/g)) {
                        usages.push({ file: p, type, attr: a[1] });
                    }
                }
            }
        }
    };
    walk(contentDir);
    return usages;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const apiMapRoot = resolveApiMapRoot(null, REPO_ROOT);
if (!apiMapRoot) {
    console.error('[accuracy] apiMap not found — clone igniteui-xplat-docs beside this repo');
    process.exit(1);
}
if (!existsSync(WINUI_SAMPLES) || !statSync(WINUI_SAMPLES).isDirectory()) {
    console.error(`[accuracy] winui-samples not found at ${WINUI_SAMPLES}`);
    process.exit(1);
}

const apiMap = loadApiMap(apiMapRoot);
const { attrs: winuiNames, elements: winuiElements } = collectWinUINames(WINUI_SAMPLES);
const usages = collectDocUsages(path.join(ROOT, 'src', 'content', 'en', 'components'));

// Attributes that are platform plumbing, not API surface.
const IGNORED = new Set(['ref', 'id', 'class', 'style', 'key', 'height', 'width', 'slot', 'name']);

const buckets = {
    agree: [],
    'apimap-better': [],
    'fuzzy-better': [],
    'both-unknown': [],
    'both-known': [],
};

const seen = new Set();
let skippedNoCounterpart = 0;
for (const { type, attr } of usages) {
    if (IGNORED.has(attr.toLowerCase()) || attr.startsWith('@')) continue;
    if (!hasWinUICounterpart(type, winuiElements)) {
        skippedNoCounterpart++;
        continue;
    }
    const key = `${type}::${attr}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const canonicalType = resolveTypeName(apiMap, type.replace(/^igc-/, '')).name;
    const viaApiMap = resolveMemberName(apiMap, attr, canonicalType);
    const fuzzy = fuzzyToPascal(attr);

    if (viaApiMap.name === fuzzy) {
        buckets.agree.push({ type, attr, name: fuzzy });
        continue;
    }
    const apiKnown = winuiNames.has(viaApiMap.name);
    const fuzzyKnown = winuiNames.has(fuzzy);
    const row = { type, attr, apiMap: viaApiMap.name, fuzzy, via: viaApiMap.via };
    if (apiKnown && !fuzzyKnown) buckets['apimap-better'].push(row);
    else if (!apiKnown && fuzzyKnown) buckets['fuzzy-better'].push(row);
    else if (apiKnown && fuzzyKnown) buckets['both-known'].push(row);
    else buckets['both-unknown'].push(row);
}

const total = seen.size;
console.log(`\n  apiMap accuracy regression — ground truth: ${winuiNames.size} names from the WinUI samples`);
console.log(`  distinct type::property usages in web doc snippets: ${total}`);
console.log(`  usages skipped (component has no WinUI counterpart): ${skippedNoCounterpart}\n`);
const label = {
    agree: 'identical (apiMap and fuzzy agree)',
    'apimap-better': 'apiMap correct, fuzzy WRONG           → improvement',
    'fuzzy-better': 'fuzzy correct, apiMap WRONG           → REGRESSION',
    'both-known': 'both names exist in WinUI             → review',
    'both-unknown': 'neither name seen in samples          → unverifiable',
};
for (const k of ['agree', 'apimap-better', 'both-known', 'both-unknown', 'fuzzy-better']) {
    console.log(`    ${String(buckets[k].length).padStart(5)}  ${label[k]}`);
}

const show = (k, limit) => {
    if (!buckets[k].length) return;
    console.log(`\n  ${label[k]}:`);
    for (const r of buckets[k].slice(0, limit)) {
        console.log(`    ${r.type}.${r.attr}  apiMap="${r.apiMap}"  fuzzy="${r.fuzzy}"  (${r.via})`);
    }
    if (buckets[k].length > limit) console.log(`    … ${buckets[k].length - limit} more`);
};
show('apimap-better', VERBOSE ? 200 : 12);
show('both-known', VERBOSE ? 200 : 8);
show('fuzzy-better', 200);
if (VERBOSE) show('both-unknown', 40);

const regressions = buckets['fuzzy-better'].length;
console.log(
    `\n  ${regressions === 0 ? 'PASS' : 'FAIL'} — ${buckets['apimap-better'].length} improvement(s), ${regressions} regression(s)\n`,
);
process.exit(regressions === 0 ? 0 : 1);

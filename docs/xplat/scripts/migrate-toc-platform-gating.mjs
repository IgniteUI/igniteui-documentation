#!/usr/bin/env node
/**
 * migrate-toc-platform-gating.mjs
 *
 * Applies platform gating to `toc.json` so the XAML platforms (WinUI, Uno) see
 * only the topics that apply to them, and future non-web platforms inherit the
 * same treatment for free.
 *
 * The rules are derived, not hand-listed: a topic is in scope for the non-web
 * platforms when it embeds a sample from a component that `winui-samples`
 * actually ships. Everything else is gated `include: ["Web"]` — an allowlist, so
 * adding a platform never requires revisiting these entries.
 *
 *   web-only topic / section / header  → include: ["Web"]
 *   Data Grid family                   → include: ["NonWeb"]   (+ redundant
 *                                        four-platform `exclude` dropped)
 *   shared DV topic                    → untouched
 *
 * Idempotent: existing `include` values are never overwritten, so re-running is
 * safe. Per-locale indentation is preserved (en uses 2 spaces, jp uses 4).
 *
 * Usage:
 *   node scripts/migrate-toc-platform-gating.mjs --dry-run
 *   node scripts/migrate-toc-platform-gating.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitsFor, PLATFORM_GROUPS } from '../../../src/lib/platform-groups.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPO_ROOT = path.resolve(ROOT, '..', '..');
const DRY = process.argv.includes('--dry-run');

const SAMPLES = process.env.WINUI_SAMPLES_ROOT ?? path.resolve(REPO_ROOT, '..', 'winui-samples', 'samples');

/** Locale → indentation width, matching what each file already uses. */
const LOCALES = { en: 2, jp: 4 };

/** Grid variants generated from `grids/_shared/` templates. */
const GRID_VARIANTS = ['grid', 'tree-grid', 'hierarchical-grid', 'pivot-grid'];

const WEB = new Set(PLATFORM_GROUPS.Web);

/**
 * Sample-path prefixes (`group/component`) that winui-samples ships, plus the
 * Zoom Slider — its control is coming, so the topic is kept in scope and the
 * sample is a backfill item.
 */
const NONWEB_COMPONENTS = (() => {
    const set = new Set(['charts/zoomslider']);
    if (!existsSync(SAMPLES)) return set;

    for (const group of readdirSync(SAMPLES)) {
        const gp = path.join(SAMPLES, group);
        if (!statSync(gp).isDirectory()) continue;
        for (const component of readdirSync(gp)) {
            if (statSync(path.join(gp, component)).isDirectory()) set.add(`${group}/${component}`);
        }
    }
    return set;
})();

const contentDir = lang => path.join(ROOT, 'src', 'content', lang, 'components');

/** Maps a toc href to its source file, accounting for `_shared` expansion. */
function resolveHref(lang, href) {
    const base = contentDir(lang);
    const f = href.replace(/\\/g, '/');
    if (existsSync(path.join(base, f))) return f;
    const m = f.match(new RegExp(`^grids/(${GRID_VARIANTS.join('|')})/(.+\\.mdx)$`));
    if (m && existsSync(path.join(base, `grids/_shared/${m[2]}`))) return `grids/_shared/${m[2]}`;
    return null;
}

const sampleCache = new Map();
/** Whether a topic embeds a sample from a component the XAML platforms ship. */
function referencesNonWebSample(lang, file) {
    const key = `${lang}/${file}`;
    if (!sampleCache.has(key)) {
        const text = readFileSync(path.join(contentDir(lang), file), 'utf8');
        const prefixes = new Set(
            [...text.matchAll(/<Sample\s+src="\/([^"]+)"/g)].map(m => m[1].split('/').slice(0, 2).join('/')),
        );
        sampleCache.set(key, [...prefixes].some(p => NONWEB_COMPONENTS.has(p)));
    }
    return sampleCache.get(key);
}

const stats = {};
const bump = k => (stats[k] = (stats[k] ?? 0) + 1);

function classify(lang, node) {
    const href = node.href.replace(/\\/g, '/');
    if (href.startsWith('grids/data-grid/')) return 'datagrid';
    const file = resolveHref(lang, href);
    if (!file) return 'web';                      // stale entry: keep off the new platforms
    return referencesNonWebSample(lang, file) ? 'nonweb' : 'web';
}

function dropRedundantWebExclude(node) {
    if (Array.isArray(node.exclude) && WEB.size && [...WEB].every(p => node.exclude.includes(p))) {
        delete node.exclude;
        bump('dropped-redundant-web-exclude');
    }
}

/** Pass 1 — leaves, nested sections, and the Data Grid family. */
function gateNodes(lang, nodes) {
    let allWeb = true;
    for (const node of nodes) {
        const kids = Array.isArray(node.items) && node.items.length ? node.items : null;
        const kidsWeb = kids ? gateNodes(lang, kids) : true;

        if (node.href) {
            const kind = classify(lang, node);
            if (kind === 'datagrid') {
                if (!('include' in node)) { node.include = ['NonWeb']; bump('datagrid->NonWeb'); }
                dropRedundantWebExclude(node);
                allWeb = false;
            } else if (kind === 'nonweb') {
                bump('left-shared');
                allWeb = false;
            } else if (!('include' in node)) {
                node.include = ['Web'];
                bump('leaf->Web');
            }
            if (!('include' in node)) allWeb = false;
        } else if (kids) {
            if (kidsWeb && !('include' in node)) { node.include = ['Web']; bump('section->Web'); }
            allWeb = allWeb && kidsWeb;
        }
        if (kids && !kidsWeb) allWeb = false;
    }
    return allWeb;
}

/** Pass 2 — a node whose children are Data Grid topics is the Data Grid parent. */
function gateDataGridParents(nodes) {
    for (const node of nodes) {
        const kids = node.items;
        if (!Array.isArray(kids)) continue;
        if (kids.some(k => typeof k.href === 'string' && k.href.startsWith('grids/data-grid/'))) {
            if (!('include' in node)) { node.include = ['NonWeb']; bump('datagrid-parent->NonWeb'); }
            dropRedundantWebExclude(node);
        }
        gateDataGridParents(kids);
    }
}

/**
 * Pass 3 — the toc is largely flat: a header row governs the sibling run up to
 * the next header. Gate the header when nothing in its run survives for the
 * non-web platforms, so their sidebar shows no empty sections.
 */
function gateHeaders(nodes) {
    const isHeader = n => n.header === true || (!('href' in n) && !(Array.isArray(n.items) && n.items.length));
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (Array.isArray(node.items)) gateHeaders(node.items);
        if (!isHeader(node) || 'include' in node) continue;
        const run = [];
        for (const next of nodes.slice(i + 1)) {
            if (isHeader(next)) break;
            run.push(next);
        }
        if (!run.length) continue;
        const survives = run.some(n => PLATFORM_GROUPS.NonWeb.some(p => emitsFor(p, n)));
        if (!survives) { node.include = ['Web']; bump('header->Web'); }
    }
}

/** Pass 4 — ensure every ported Data Grid topic has a toc entry. */
const EXTRA_ENTRIES = [
    { href: 'grids/data-grid/cell-merging.mdx', names: { en: 'Cell Merging', jp: 'セル結合' }, after: 'grids/data-grid/cell-activation.mdx' },
];

function addMissingEntries(lang, nodes) {
    for (const spec of EXTRA_ENTRIES) {
        let found = false;
        const scan = ns => ns.forEach(n => { if (n.href === spec.href) found = true; if (Array.isArray(n.items)) scan(n.items); });
        scan(nodes);
        if (found) continue;
        const place = ns => {
            for (const n of ns) {
                const kids = n.items;
                if (!Array.isArray(kids)) continue;
                const at = kids.findIndex(k => k.href === spec.after);
                if (at >= 0) {
                    kids.splice(at, 0, { name: spec.names[lang], href: spec.href, include: ['NonWeb'] });
                    bump('added-missing-toc-entry');
                    return true;
                }
                if (place(kids)) return true;
            }
            return false;
        };
        place(nodes);
    }
}

for (const [lang, indent] of Object.entries(LOCALES)) {
    const file = path.join(ROOT, 'src', 'content', lang, 'toc.json');
    // Read and let a missing file say so, rather than asking whether it exists and then reading it:
    // the answer to the question can stop being true between the two.
    let original;
    try {
        original = readFileSync(file, 'utf8');
    } catch {
        continue;
    }
    const toc = JSON.parse(original);

    addMissingEntries(lang, toc);
    gateDataGridParents(toc);
    gateNodes(lang, toc);
    gateHeaders(toc);

    const out = JSON.stringify(toc, null, indent) + (original.endsWith('\n') ? '\n' : '');
    if (!DRY) writeFileSync(file, out, 'utf8');
    console.log(`  ${lang}: ${DRY ? 'would write' : 'wrote'} toc.json (indent ${indent})`);
}

for (const [k, v] of Object.entries(stats).sort()) console.log(`    ${k}: ${v}`);

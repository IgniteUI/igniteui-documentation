#!/usr/bin/env node
/**
 * Every topic declares which population it belongs to, and this checks that the declaration holds up.
 *
 *   platformType: xplat            the cross-platform (DV) set, API terms resolved through the maps
 *   platformType: xplat-unmapped   the same set, where the full treatment cannot be applied yet
 *   platformType: web-only         the web platforms and no further
 *
 * Two different questions live here, and keeping them apart is the point. **Identity** is what a topic
 * is, and it is declared. **Publication** is which platforms the toc actually sends it to. They are
 * allowed to disagree -- the data grid's accessibility topic is an xplat doc that reaches no desktop
 * platform because what it should say there is undecided -- so a disagreement is reported rather than
 * failed. What fails is a page that has not declared, declared something unknown, or declared xplat
 * and then opted out of the treatment that makes it xplat.
 *
 *   node scripts/check-doc-scope.mjs [--lang=en]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PLATFORM_TYPES } from './lib/api-terms.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANG = (process.argv.find(a => a.startsWith('--lang=')) || '--lang=en').slice(7);
const CONTENT = path.join(ROOT, 'src', 'content', LANG, 'components');

const WEB = ['Angular', 'React', 'WebComponents', 'Blazor'];
const DESKTOP = ['WinUI', 'Uno'];
const GROUPS = { Web: WEB, NonWeb: DESKTOP, Xaml: DESKTOP };
const expand = (list) => (list || []).flatMap(name => GROUPS[name] ?? [name]);

/** The toc's own rule: a node hides a platform by including others or excluding it outright. */
function visible(node, platform) {
    const include = expand(node.include);
    if (include.length && !include.includes(platform)) return false;
    return !expand(node.exclude).includes(platform);
}

/** Which platforms the toc publishes each page to. A page the toc never names publishes everywhere. */
function publication(toc) {
    const seen = new Map();
    (function walk(nodes, blocked) {
        for (const node of nodes ?? []) {
            const hidden = new Set(blocked);
            for (const platform of [...WEB, ...DESKTOP]) if (!visible(node, platform)) hidden.add(platform);
            if (node.href) {
                const shown = [...WEB, ...DESKTOP].filter(p => !hidden.has(p));
                // a page reachable by two paths is published if either path shows it
                const already = seen.get(node.href) ?? [];
                seen.set(node.href, [...new Set([...already, ...shown])]);
            }
            if (Array.isArray(node.items)) walk(node.items, hidden);
        }
    })(toc, new Set());
    return seen;
}

const toc = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'content', LANG, 'toc.json'), 'utf-8'));
const published = publication(toc);

const pages = [];
(function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.mdx')) pages.push(full);
    }
})(CONTENT);

const DV_SHAPED = /^(charts\/|geo-map|category-chart|financial-chart|data-chart|radial-gauge|linear-gauge|bullet-graph|zoomslider|dashboard-tile|grids\/data-grid\/|excel-|spreadsheet|maps\/|menus\/toolbar|inputs\/color-editor|general-changelog-dv)/;
const IMPLIED = { xplat: 'full', 'xplat-unmapped': 'passthrough', 'web-only': 'none' };

const errors = [];
const noDesktop = [], desktopLeak = [], dvShaped = [], redundant = [];

for (const file of pages.sort()) {
    const slug = file.slice(CONTENT.length + 1);
    const text = fs.readFileSync(file, 'utf-8');
    const declared = /^platformType:\s*(\S+)/m.exec(text)?.[1];
    if (!declared) { errors.push(`${slug}: no platformType`); continue; }
    if (!PLATFORM_TYPES.includes(declared)) {
        errors.push(`${slug}: platformType "${declared}" is not one of ${PLATFORM_TYPES.join(', ')}`);
        continue;
    }
    const mode = /^apiTerms:\s*(\S+)/m.exec(text)?.[1];
    if (declared === 'xplat' && mode === 'none') {
        errors.push(`${slug}: xplat, but apiTerms: none opts out of the treatment that makes it xplat. ` +
                    `Use platformType: xplat-unmapped if its API cannot be resolved.`);
    }
    if (mode && mode === IMPLIED[declared]) redundant.push(`${slug}: apiTerms: ${mode} is what ${declared} already implies`);

    // Publication, which is the toc's business rather than the page's.
    //
    // A shared grid topic is never published as itself: generation fans it out into grid/, tree-grid/
    // and the rest, and the toc names those copies. Asking where the source publishes reads "every
    // platform, because nothing names it" and reports 41 topics as leaking onto the XAML sites, which
    // is an artefact of the question rather than anything about the page.
    if (slug.startsWith('grids/_shared/')) continue;

    const shown = published.get(slug) ?? [...WEB, ...DESKTOP];
    const desktop = shown.filter(p => DESKTOP.includes(p));
    if (declared.startsWith('xplat') && desktop.length === 0) noDesktop.push(slug);
    if (declared === 'web-only' && desktop.length > 0) desktopLeak.push(`${slug} (${desktop.join(', ')})`);
    if (declared === 'web-only' && DV_SHAPED.test(slug)) dvShaped.push(slug);
}

const report = (title, list, note) => {
    if (list.length === 0) return;
    console.log(`\n${list.length} ${title}`);
    if (note) console.log(`  ${note}`);
    for (const one of list) console.log(`    ${one}`);
};

report('page(s) in the cross-platform set that reach no desktop platform', noDesktop,
       'identity and publication may differ on purpose; each of these is a toc decision to confirm');
report('web-only page(s) the toc publishes to a desktop platform', desktopLeak,
       'a web topic on a XAML site: either the declaration or the toc entry is wrong');
report('web-only page(s) whose subject looks like the DV set', dvShaped,
       'not collapsed and not declared xplat -- may simply never have been processed');
report('page(s) stating an apiTerms their platformType already implies', redundant);

console.log(`\n${pages.length} page(s) checked in ${LANG}: ` +
            `${errors.length} error(s), ${noDesktop.length + desktopLeak.length + dvShaped.length} to review.`);
for (const one of errors) console.error(`  ${one}`);
process.exit(errors.length > 0 ? 1 : 0);

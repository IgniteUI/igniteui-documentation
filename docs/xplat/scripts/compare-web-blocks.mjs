/**
 * What a collapsed snippet emits for the web, against the web block it replaced.
 *
 * A topic gated to the XAML platforms cannot be reviewed by regenerating it: the web pages do not
 * build, so the only XAML output is compared and the web half goes unseen. But the web blocks are
 * the accurate record for the web — they were published, where the XAML blocks were generated from
 * the samples — and those pages may be published again.
 *
 * So this recovers each page as it stood before a commit, reads the block each platform had, and
 * sets it beside what the fence emits for that platform now. It reports attributes gained, lost and
 * changed, per platform, which is the review that matters.
 *
 *   XPLAT_EXAMPLES=<checkout> node scripts/compare-web-blocks.mjs --before=<rev> [glob]
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { loadSnippetApi, resolveExamplesRoot } from './lib/snippet-toolchain.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXAMPLES = resolveExamplesRoot();

const args = process.argv.slice(2);
const BEFORE = (args.find(a => a.startsWith('--before=')) || '--before=HEAD').slice(9);
const ONLY = args.find(a => !a.startsWith('--')) || 'grids/data-grid';

const api = loadSnippetApi();

const COMMON = { suppressAutoElementNames: true, suppressNameAttribute: true,
                 omitHandlerSignature: true, directAssignment: true,
                 colorNotation: 'hex', pascalCaseColorNames: true, indentAttributes: true };
const STYLE = {
    Angular: { ...COMMON, numericAttributeStyle: 'bare' },
    React: { ...COMMON, numericAttributeStyle: 'braced', booleanAttributeStyle: 'braced', selfCloseEmptyElements: true },
    WebComponents: { ...COMMON },
    Blazor: { ...COMMON, selfCloseEmptyElements: true },
};

/**
 * Every element in a block, keyed by what it is, with its attributes.
 *
 * Keyed by the element rather than by position: a section pairing a toolbar with its grid writes two
 * elements, and the platforms do not agree on which comes first or on how many blocks they take. The
 * tag name is reduced the same way the attributes are, so IgrDataGrid, igc-data-grid and IgbDataGrid
 * are one thing.
 */
function elementsOf(markup) {
    const found = new Map();
    for (const tag of markup.matchAll(/<([A-Za-z][\w:-]*)((?:\s+[\w:@-]+\s*=\s*(?:"[^"]*"|\{[^}]*\}))*)/g)) {
        const name = tag[1].replace(/^(Igr|Igc|Igb|Igx|igc-|igx-|igb-|igr-|igDataGrids:)/i, '')
                           .replace(/-/g, '').toLowerCase();
        if (!name || name === 'div' || name === 'button' || name === 'renderfragment') continue;
        const attrs = new Map();
        for (const m of (tag[2] || '').matchAll(/([\w:@-]+)\s*=\s*(?:"([^"]*)"|\{([^}]*)\})/g)) {
            // The name each platform gives the same property differs only in shape —
            // header-click-action, headerClickAction, HeaderClickAction — so it is compared with
            // those differences removed.
            const key = m[1].replace(/[-@]/g, '').toLowerCase();
            const value = (m[2] ?? m[3] ?? '').replace(/^this\./, '').trim();
            attrs.set(key, value);
        }
        if (!found.has(name)) found.set(name, attrs);
    }
    return found;
}

const git = (rev, file) =>
    execFileSync('git', ['show', `${rev}:${file}`], { cwd: ROOT, encoding: 'utf-8' });

const OPEN = /<PlatformBlock\s+for="([^"]+)">([\s\S]*?)<\/PlatformBlock>/g;

const files = execFileSync('git', ['ls-files', 'src/content/en/components'], { cwd: ROOT, encoding: 'utf-8' })
    .split('\n').filter(f => f.includes(ONLY) && f.endsWith('.mdx'));

let compared = 0, pages = 0;
for (const file of files) {
    const now = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    if (!now.includes('```json-snippet')) continue;
    let was;
    try { was = git(BEFORE, `docs/xplat/${file}`); } catch { continue; }

    // Each platform's markup as the page had it, in order.
    const had = new Map();
    for (const m of was.matchAll(OPEN)) {
        const fence = m[2].match(/```(tsx|html|razor)\n([\s\S]*?)```/);
        if (!fence) continue;
        for (const platform of m[1].split(',').map(s => s.trim())) {
            if (!STYLE[platform]) continue;
            if (!had.has(platform)) had.set(platform, []);
            had.get(platform).push(fence[2]);
        }
    }
    if (had.size === 0) continue;

    // What the page's fences emit for those platforms now, in order.
    const emits = new Map();
    const byId = new Map();
    for (const m of now.matchAll(/```json-snippet([^\n]*)\n([\s\S]*?)^```/gm)) {
        const attrs = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
        let body = m[2];
        if (attrs.id) byId.set(attrs.id, body);
        if (attrs.ref) body = byId.get(attrs.ref) ?? body;
        if (!body.trim() || (attrs.channel && attrs.channel !== 'markup')) continue;
        for (const platform of Object.keys(STYLE)) {
            const excluded = (attrs.exclude || '').split(',').map(s => s.trim());
            if (excluded.includes(platform)) continue;
            let out = '';
            try {
                out = api.emitSingleSnippet(body, platform, {
                    examplesRoot: EXAMPLES, defaultSnippetId: 'main', styleDefaults: STYLE[platform] }) ?? '';
            } catch (e) { out = `(failed: ${e.message.split('\n')[0]})`; }
            if (!emits.has(platform)) emits.set(platform, []);
            emits.get(platform).push(out);
        }
    }

    const lines = [];
    for (const [platform, blocks] of had) {
        const produced = emits.get(platform) ?? [];
        // Every element the page had for this platform, against every element it emits now, matched
        // by which element it is.
        const before = new Map(), after = new Map();
        for (const b of blocks) for (const [k, v] of elementsOf(b)) if (!before.has(k)) before.set(k, v);
        for (const b of produced) for (const [k, v] of elementsOf(b)) if (!after.has(k)) after.set(k, v);
        for (const [element, was] of before) {
            const now = after.get(element);
            compared++;
            if (!now) {
                // Nothing emits this element: either the section is still hand written, or something
                // was dropped. Reported, since only reading it can tell the two apart.
                lines.push(`   ${platform} ${element}: no longer emitted`);
                continue;
            }
            const gained = [...now.keys()].filter(k => !was.has(k) && k !== 'ref' && k !== 'id');
            const lost = [...was.keys()].filter(k => !now.has(k) && k !== 'ref' && k !== 'id');
            const changed = [...now.keys()].filter(k => was.has(k) && was.get(k) !== now.get(k) &&
                                                        k !== 'ref' && k !== 'id' && k !== 'datasource')
                .map(k => `${k}: ${was.get(k)} -> ${now.get(k)}`);
            if (gained.length || lost.length || changed.length) {
                lines.push(`   ${platform} ${element}` +
                    (lost.length ? `\n      lost:    ${lost.join(', ')}` : '') +
                    (gained.length ? `\n      gained:  ${gained.join(', ')}` : '') +
                    (changed.length ? `\n      changed: ${changed.join('; ')}` : ''));
            }
        }
    }
    if (lines.length) {
        pages++;
        console.log(`\n${file.split('/components/')[1]}`);
        console.log(lines.join('\n'));
    }
}
console.log(`\n${compared} block(s) compared; ${pages} page(s) differ from what the web had`);

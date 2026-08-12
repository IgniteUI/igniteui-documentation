/**
 * Emits every json-snippet for every platform, whatever the topic's own gating says.
 *
 * Generation only emits a fence for the platforms its page publishes on, so a topic gated to one
 * technology is never emitted for the others — the data grid set is gated to the XAML platforms,
 * and its fences had never once been emitted for the web. Schema validation still runs there, but a
 * schema says nothing about what comes out: a definition can be perfectly valid and emit a member
 * path the platform spells differently, or fail outright on a type that platform does not have.
 *
 * So this runs the fences the way the generator would, once per platform, and reports what breaks.
 * It is the check that would have caught skipAlterDataCasing: the web emitters camelise a member of
 * the data without it, and no XAML run can show that.
 *
 *   XPLAT_EXAMPLES=<examples checkout> node scripts/check-snippet-emission.mjs [--lang=en] [glob]
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const EXAMPLES = process.env.XPLAT_EXAMPLES;
if (!EXAMPLES) {
    console.error('set XPLAT_EXAMPLES to the igniteui-xplat-examples checkout');
    process.exit(2);
}

const args = process.argv.slice(2);
const LANG = (args.find(a => a.startsWith('--lang=')) || '--lang=en').slice(7);
const ONLY = args.find(a => !a.startsWith('--'));
// Printing is how a page gated away from a platform gets reviewed at all: its fences are emitted
// here and nowhere else, so without this the output can only be proved non-empty, not read.
const PRINT = args.some(a => a === '--print');
const PRINT_PLATFORM = (args.find(a => a.startsWith('--platform=')) || '').slice(11);

const SNIPPET_API = process.env.IG_SNIPPET_API
    ?? '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dist/snippet-api.cjs';
const DOM_SHIM = process.env.IG_SNIPPET_DOM_SHIM
    ?? '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dom-shim.js';
require(DOM_SHIM);
const api = require(SNIPPET_API);

const PLATFORMS = ['Angular', 'React', 'WebComponents', 'Blazor', 'WinUI'];

// The generator's own style tables, read from it rather than copied, so this cannot drift from what
// the pages are actually built with.
const generator = fs.readFileSync(path.join(ROOT, 'scripts', 'generate.mjs'), 'utf-8');
const styleFor = (platform) => {
    const common = {};
    const block = generator.match(/const SNIPPET_STYLE_COMMON = \{([\s\S]*?)\n\};/);
    for (const [, key, value] of block[1].matchAll(/^\s{4}(\w+):\s*([^,\n]+),/gm)) {
        common[key] = value === 'true' ? true : value === 'false' ? false : value.replace(/['"]/g, '');
    }
    const per = {
        Angular: { indentAttributes: true, numericAttributeStyle: 'bare' },
        React: { indentAttributes: true, numericAttributeStyle: 'braced', booleanAttributeStyle: 'braced', selfCloseEmptyElements: true },
        WebComponents: { indentAttributes: true },
        Blazor: { indentAttributes: true, selfCloseEmptyElements: true },
        WinUI: { indentXamlAttributes: true, omitDimensions: true, selfCloseEmptyElements: true },
    };
    return { ...common, ...per[platform] };
};

/** Every fence in a topic, with the attributes on its line. */
function fencesOf(text) {
    const found = [];
    for (const m of text.matchAll(/```json-snippet([^\n]*)\n([\s\S]*?)^```/gm)) {
        const attrs = {};
        for (const a of m[1].matchAll(/(\w+)="([^"]*)"/g)) attrs[a[1]] = a[2];
        found.push({ attrs, body: m[2], line: text.slice(0, m.index).split('\n').length });
    }
    return found;
}

const files = [];
const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.mdx')) files.push(full);
    }
};
walk(path.join(ROOT, 'src', 'content', LANG, 'components'));

/** The regions a fence's channel names, presets expanded and delimiters dropped. */
function regionsOf(channel) {
    const presets = { codeBehind: 'bindingImports...bindingInit,bindingCode' };
    const expanded = presets[channel.trim()] ?? channel;
    return expanded.split(/(?:\.\.\.|,)/).map(one => one.trim()).filter(Boolean);
}

/** Whether any sidecar under this node includes something, as the generator asks it. */
function hasInclusionMarker(node) {
    if (Array.isArray(node)) return node.some(hasInclusionMarker);
    if (!node || typeof node !== 'object') return false;
    for (const [key, value] of Object.entries(node)) {
        if (key.startsWith('$') && !['$styleOptions', '$comment', '$setInCode', '$assignInCode'].includes(key)) {
            const markers = Array.isArray(value) ? value
                : typeof value === 'object' && value !== null ? Object.values(value) : [value];
            if (markers.some(m => typeof m === 'string' && m.trim().startsWith('+'))) return true;
        }
        if (typeof value === 'object' && hasInclusionMarker(value)) return true;
    }
    return false;
}

let checked = 0, failures = 0, skipped = 0;
const byId = new Map();
for (const file of files.sort()) {
    if (ONLY && !file.includes(ONLY)) continue;
    const text = fs.readFileSync(file, 'utf-8');
    for (const fence of fencesOf(text)) {
        const where = `${file.split('/content/')[1]}:${fence.line}`;
        let body = fence.body;
        if (fence.attrs.id) byId.set(fence.attrs.id, body);
        if (fence.attrs.ref) body = byId.get(fence.attrs.ref) ?? body;
        if (!body.trim()) continue;

        for (const platform of PLATFORMS) {
            // The fence's own exclusions still apply: a snippet that says it is not for a platform
            // is not expected to emit there.
            const excluded = (fence.attrs.exclude || '').split(',').map(s => s.trim()).filter(Boolean);
            const isXaml = platform === 'WinUI' || platform === 'Uno';
            if (excluded.includes(platform) || (isXaml && excluded.includes('Xaml'))) { skipped++; continue; }

            checked++;
            try {
                const channel = fence.attrs.channel;
                const opts = { examplesRoot: EXAMPLES, styleDefaults: styleFor(platform),
                               defaultSnippetId: 'main' };
                if (!channel || channel === 'markup') {
                    // A body that is an array states several definitions, emitted one after another,
                    // so each is checked on its own.
                    let parsed = null;
                    try { parsed = JSON.parse(body); } catch { /* the emitter reports it below */ }
                    const bodies = Array.isArray(parsed)
                        ? parsed.map(one => JSON.stringify(one)) : [body];
                    for (const one of bodies) {
                        const out = api.emitSingleSnippet(one, platform, opts);
                        if (out === null || out.trim() === '') {
                            throw new Error('emitted nothing');
                        }
                        if (PRINT && (!PRINT_PLATFORM || PRINT_PLATFORM === platform)) {
                            console.log(`\n--- ${where} [${platform}] markup`);
                            console.log(out.split('\n').map(l => '    ' + l).join('\n'));
                        }
                    }
                } else {
                    // Channels go through the marked form the generator uses; asking for the whole
                    // definition on that channel is enough to prove it emits.
                    //
                    // One region at a time, because a fence may ask for several — "a...b" and "a,b"
                    // are one block built from two regions, and neither name is a channel token on
                    // its own. Emitting the composed string would ask for a channel that cannot
                    // exist, which produces nothing and proves nothing.
                    let produced = '';
                    // "auto" is not a region: the definition's own markers say which channel it
                    // wants, and they are already in the body. Emitting it unchanged is the check.
                    for (const region of channel.trim() === 'auto' ? [null] : regionsOf(channel)) {
                        const parsed = JSON.parse(body);
                        const root = parsed.descriptions?.content ?? parsed;
                        // Marked the way the generator marks it, or this checks something the pages
                        // do not emit: a definition that marks parts of itself is asking for those
                        // parts, and marking its root as well would widen it to the whole element.
                        if (region !== null) {
                            if (!hasInclusionMarker(root)) root['$type'] = `+check:${region}`;
                            if (parsed.onViewInit) parsed['$onViewInit'] = `+check:${region}`;
                            if (parsed.onInit) parsed['$onInit'] = `+check:${region}`;
                            if (parsed.modules !== undefined) parsed['$modules'] = `+check:${region}`;
                        }
                        const out = api.emitSnippets(JSON.stringify(parsed), platform, {
                            ...opts, forceCodeBehind: region === 'code' });
                        const asked = region === null
                            ? out.find(s => s.content && s.content.trim())
                            : out.find(s => s.key === `check:${region}`)
                                ?? out.find(s => s.channel === region);
                        if (asked?.content?.trim()) produced += asked.content;
                        if (PRINT && (!PRINT_PLATFORM || PRINT_PLATFORM === platform)) {
                            console.log(`\n--- ${where} [${platform}] ${region ?? 'auto'}`);
                            console.log((asked?.content?.trim() || '(nothing)').split('\n')
                                .map(l => '    ' + l).join('\n'));
                        }
                    }
                    // A region this platform writes nothing to drops out, as the generator drops it
                    // — but a fence where every region is empty produces an empty block.
                    if (produced.trim() === '') throw new Error('emitted nothing');
                }
            } catch (e) {
                failures++;
                console.log(`${where} [${platform}] ${fence.attrs.channel || 'markup'}: ${e.message.split('\n')[0]}`);
            }
        }
    }
}

console.log(`\n${checked} emission(s) checked across ${PLATFORMS.length} platforms, ` +
            `${skipped} skipped by exclusion, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);

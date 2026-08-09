#!/usr/bin/env node
/**
 * check-snippet-code-channels.mjs
 *
 * Finds collapsed snippets that are incomplete as markup alone.
 *
 * Most properties become attributes, but some cannot on some platforms — a data source on Web
 * Components is assigned in script, not written on the tag. When that happens the markup carries
 * only a reference, and a topic showing the markup by itself has told the reader to bind a source
 * without saying where it comes from. The original topics handled this with a companion code block
 * beside the markup; a collapsed topic has to keep one.
 *
 * Which snippets need it is not a judgement: the renderer already decides what it cannot write as
 * an attribute, and sends it to the binding code instead. So this asks the renderer.
 *
 * Reported per platform, because it differs by platform — the same sample needs a code block for
 * Web Components and none for Angular, whose template syntax can bind a source inline.
 *
 *   XPLAT_EXAMPLES=… node scripts/check-snippet-code-channels.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const EXAMPLES = process.env.XPLAT_EXAMPLES;

if (!EXAMPLES) {
    console.error('usage: XPLAT_EXAMPLES=… node scripts/check-snippet-code-channels.mjs');
    process.exit(2);
}

const require = createRequire(import.meta.url);
const SNIPPET_API = process.env.IG_SNIPPET_API
    || '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dist/snippet-api.cjs';
const DOM_SHIM = process.env.IG_SNIPPET_DOM_SHIM
    || '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dom-shim.js';
require(DOM_SHIM);
const api = require(SNIPPET_API);

const PLATFORMS = ['Angular', 'React', 'WebComponents', 'Blazor', 'WinUI'];
const CONTENT = path.join(ROOT, 'src', 'content', 'en', 'components');

const files = [];
(function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (full.endsWith('.mdx')) files.push(full);
    }
})(CONTENT);

/** The platforms a topic still shows a hand written code block for, near a given position. */
function codeBlockPlatforms(text) {
    const found = new Set();
    for (const m of text.matchAll(/<PlatformBlock\s+for="([^"]+)">([\s\S]*?)<\/PlatformBlock>/g)) {
        if (!/```(ts|typescript|razor|csharp)\n/.test(m[2])) continue;
        for (const p of m[1].split(',')) found.add(p.trim());
    }
    return found;
}

let total = 0, needing = 0, uncovered = 0;
for (const file of files) {
    const text = readFileSync(file, 'utf8');
    if (!text.includes('```json-snippet')) continue;
    const hasCodeBlockFor = codeBlockPlatforms(text);

    for (const m of text.matchAll(/```json-snippet[^\n]*\n([\s\S]*?)\n```/g)) {
        total++;
        const line = text.slice(0, m.index).split('\n').length;
        let parsed;
        try { parsed = JSON.parse(m[1]); } catch { continue; }

        const needs = [];
        for (const platform of PLATFORMS) {
            // A recording zone over the binding code alone: what this platform could not write as
            // an attribute and had to assign instead.
            const probe = { ...parsed, $type: '+probe:bindingCode' };
            let body = '';
            try {
                const out = api.emitSnippets(JSON.stringify(probe), platform, {
                    examplesRoot: EXAMPLES,
                    styleDefaults: { suppressAutoElementNames: true },
                });
                body = (out.find(s => s.channel === 'bindingCode')?.content || '').trim();
            } catch { /* a platform this sample cannot be emitted for says nothing here */ }
            if (body) needs.push({ platform, lines: body.split('\n').filter(Boolean).length });
        }
        if (needs.length === 0) continue;

        needing++;
        const missing = needs.filter(n => !hasCodeBlockFor.has(n.platform) &&
                                          !hasCodeBlockFor.has('Xaml'));
        const where = `${path.relative(ROOT, file)}:${line}`;
        console.log(`${where}`);
        for (const n of needs) {
            const covered = hasCodeBlockFor.has(n.platform) ? '' : '   <- no code block on the page';
            if (!hasCodeBlockFor.has(n.platform)) uncovered++;
            console.log(`    ${n.platform}: ${n.lines} line(s) of binding code${covered}`);
        }
    }
}

console.log(`\n${needing} of ${total} collapsed snippets set something in code rather than markup.`);
if (uncovered > 0) {
    console.log(`${uncovered} of those have no companion code block on the page, so the snippet is ` +
                `incomplete as shown.`);
    process.exit(1);
}
console.log('Every one of them still has a companion code block beside it.');

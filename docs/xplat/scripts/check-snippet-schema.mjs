/**
 * Every json-snippet on every page, checked against the schema the descriptions declare.
 *
 * A page states a component as JSON, and the emitter turns it into each platform's code. A property
 * the description does not have is not an error the emitter reports — it writes nothing and moves
 * on, so the page publishes with a hole in it. This is the check that catches that, and it runs over
 * both locales rather than only the one being built.
 *
 * Usage:
 *   node scripts/check-snippet-schema.mjs [--lang=en,jp] [--quiet] [path fragment]
 *
 * The emitter and the examples checkout are resolved by lib/snippet-toolchain.mjs: a peer checkout
 * locally, XPLAT_EXAMPLES / IG_SNIPPET_API when they live somewhere else, or a clone of the matching
 * examples branch when there is no peer at all.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    loadSnippetApi, resolveExamplesRoot, mdxFilesUnder, XPLAT_ROOT,
} from './lib/snippet-toolchain.mjs';
import { snippetsIn, schemaValidator, problemsWith } from './lib/snippet-schema.mjs';

const args = process.argv.slice(2);
const LANGS = (args.find(a => a.startsWith('--lang=')) || '--lang=en,jp').slice(7)
    .split(',').map(s => s.trim()).filter(Boolean);
const QUIET = args.some(a => a === '--quiet');
const ONLY = args.find(a => !a.startsWith('--'));

const examples = resolveExamplesRoot({ quiet: QUIET });
const api = loadSnippetApi();

const say = (message) => { if (!QUIET) console.log(message); };

let validator = null;
let checked = 0;
const problems = [];

for (const lang of LANGS) {
    const dir = path.join(XPLAT_ROOT, 'src', 'content', lang, 'components');
    if (!fs.existsSync(dir)) {
        console.error(`no content for --lang=${lang} at ${path.relative(XPLAT_ROOT, dir)}`);
        process.exit(2);
    }
    const files = mdxFilesUnder(dir).filter(file => !ONLY || file.includes(ONLY));
    const snippets = snippetsIn(files, { relativeTo: path.join(XPLAT_ROOT, 'src', 'content') });
    if (snippets.length === 0) {
        say(`[schema] ${lang}: no json-snippet found${ONLY ? ` under "${ONLY}"` : ''}`);
        continue;
    }

    // Emitted once and reused across locales: the schema comes from the description metadata, which
    // has nothing to do with which language the prose is in, and emitting it is the slow part.
    if (validator === null) {
        validator = schemaValidator(api, examples, { onProgress: message => say(`[schema] ${message}`) });
        if (validator.dangling.length > 0) {
            say(`[schema] ${validator.dangling.length} type(s) are referenced by the schema but not ` +
                `defined by it, so their properties go unchecked: ` +
                `${validator.dangling.slice(0, 6).join(', ')}` +
                (validator.dangling.length > 6 ? ', …' : ''));
        }
    }

    for (const snippet of snippets) {
        checked++;
        problems.push(...problemsWith(snippet, validator));
    }
    say(`[schema] ${lang}: ${snippets.length} snippet(s) checked`);
}

if (problems.length === 0) {
    console.log(`\n${checked} snippet(s) valid against the schema`);
    process.exit(0);
}

// Grouped by page, because a mistake in a definition that a page states twice is one mistake to fix,
// and a wall of interleaved paths reads as many.
const byFile = new Map();
for (const problem of problems) {
    const file = problem.where.split(':')[0];
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push(problem);
}

console.error('');
for (const [file, list] of byFile) {
    console.error(file);
    for (const problem of list) {
        const line = problem.where.split(':')[1];
        const at = problem.at ? ` ${problem.at}` : '';
        console.error(`  line ${line}${at}  ${problem.message}`);
    }
    console.error('');
}
console.error(`${problems.length} problem(s) in ${checked} snippet(s) across ${byFile.size} page(s)`);
console.error('Every property has to be one the component\'s description declares — the emitter ' +
              'drops anything else without a word, which publishes a page with a hole in it.');
process.exit(1);

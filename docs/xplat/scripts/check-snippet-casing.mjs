/**
 * Whether a fence agrees with its sample about casing.
 *
 * Casing is altered in concert: the emitter camelises a data item's members and camelises every member
 * path in the markup with them. But it only re-cases the properties it knows to be member paths, whose
 * value is a plain path — so a member path buried in an expression is left as written: an aggregation's
 * "Sum(Sales) as Sales", a filter string, a grouping of "Country". A sample binding through one of those,
 * or binding data built in code, declares `skipAlterDataCasing`, and then neither half is altered.
 *
 * A fence emitting from that sample has to say the same thing. If the sample skips and the fence does
 * not, the fence's member paths get camelised while the data does not, and the topic publishes a
 * property bound to nothing. Nothing reports that today: the emitter is doing as it was told, and the
 * page looks right.
 *
 * Usage:
 *   node scripts/check-snippet-casing.mjs [--lang=en,jp]
 */

import fs from 'fs';
import path from 'path';
import {
    resolveExamplesRoot, mdxFilesUnder, fencesOf, XPLAT_ROOT,
} from './lib/snippet-toolchain.mjs';

const args = process.argv.slice(2);
const LANGS = (args.find(a => a.startsWith('--lang=')) || '--lang=en,jp').slice(7)
    .split(',').map(s => s.trim()).filter(Boolean);

const examples = resolveExamplesRoot({ quiet: true });

/**
 * Whether a definition binds anything whose casing matters: data, or a path into it.
 *
 * A member path, a field name, or a reference to a data item. Everything else — a module list, a
 * handler, a style — is emitted the same either way.
 */
function bindsData(node) {
    if (Array.isArray(node)) return node.some(bindsData);
    if (!node || typeof node !== 'object') return false;
    for (const [key, value] of Object.entries(node)) {
        if (/MemberPath$/.test(key) && typeof value === 'string') return true;
        if (key === 'field' && typeof value === 'string') return true;
        if (/^data[A-Za-z]*Ref$/.test(key) && typeof value === 'string') return true;
        if (typeof value === 'object' && bindsData(value)) return true;
    }
    return false;
}

/** What a sample says about casing, or null when there is no such sample. */
function sampleSkipsCasing(source) {
    const file = path.join(examples, 'samples', source.replace(/^\//, '') + '.json');
    if (!fs.existsSync(file)) return null;
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8')).skipAlterDataCasing === true;
    } catch {
        return null;
    }
}

const problems = [];
let checked = 0;
let missingSamples = 0;

for (const lang of LANGS) {
    const dir = path.join(XPLAT_ROOT, 'src', 'content', lang, 'components');
    if (!fs.existsSync(dir)) continue;
    for (const file of mdxFilesUnder(dir)) {
        const text = fs.readFileSync(file, 'utf8');
        if (!text.includes('```json-snippet')) continue;
        const where = path.relative(path.join(XPLAT_ROOT, 'src', 'content'), file);
        for (const fence of fencesOf(text)) {
            const source = fence.attrs.source;
            if (!source || !fence.body.trim()) continue;
            const sampleSkips = sampleSkipsCasing(source);
            if (sampleSkips === null) { missingSamples++; continue; }

            let parsed;
            try {
                parsed = JSON.parse(fence.body);
            } catch {
                continue;   // the schema check reports this properly
            }
            for (const one of Array.isArray(parsed) ? parsed : [parsed]) {
                // Only a fence that binds data can be affected. A fence that emits a module list and a
                // registration call, or a handler body, names no member path and no data — casing has
                // nothing to act on there, and reporting it would be noise.
                if (!bindsData(one)) continue;
                checked++;
                const fenceSkips = one && one.skipAlterDataCasing === true;
                if (sampleSkips === fenceSkips) continue;
                problems.push({
                    where: `${where}:${fence.line}`,
                    source,
                    message: sampleSkips
                        ? 'the sample sets skipAlterDataCasing and the fence does not — the emitted ' +
                          'member paths will be re-cased while the data is not'
                        : 'the fence sets skipAlterDataCasing and the sample does not — the emitted ' +
                          'data keeps its casing while the sample\'s does not',
                });
            }
        }
    }
}

if (missingSamples > 0) {
    console.log(`[casing] ${missingSamples} fence(s) name a sample that is not in this checkout`);
}

if (problems.length === 0) {
    console.log(`\n${checked} fence(s) agree with their sample about casing`);
    process.exit(0);
}

console.error('');
for (const problem of problems) {
    console.error(`${problem.where}  (source ${problem.source})`);
    console.error(`  ${problem.message}`);
}
console.error(`\n${problems.length} fence(s) disagree with their sample, of ${checked} checked`);
process.exit(1);

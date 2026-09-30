/**
 * Whether a snippet's exclusions leave a platform reading prose with no code.
 *
 * A fence that excludes a platform disappears on that platform — the prose introducing it does not.
 * So there is only one sound reason to exclude: the section holds several snippets and the platform
 * still has a live one there to go with what the prose says. Anything else leaves a heading, a
 * sentence saying "the following code shows", and nothing after it.
 *
 * A platform is covered when either
 *   - another fence in the same section shows for it, or
 *   - a PlatformBlock hides that section from it, so there is no orphaned prose to read.
 *
 * Usage:
 *   node scripts/check-snippet-exclusions.mjs [--lang=en,jp] [--quiet]
 */

import fs from 'fs';
import path from 'path';
import { mdxFilesUnder, fencesOf, XPLAT_ROOT } from './lib/snippet-toolchain.mjs';

const args = process.argv.slice(2);
const LANGS = (args.find(a => a.startsWith('--lang=')) || '--lang=en').slice(7)
    .split(',').map(s => s.trim()).filter(Boolean);

/** Every platform a topic can be read as. Xaml is the two that share XAML markup. */
const ALL = ['Angular', 'React', 'WebComponents', 'Blazor', 'WinUI', 'WPF'];
const XAML = ['WinUI', 'WPF'];

function expand(names) {
    const out = new Set();
    for (const name of names) {
        if (name === 'Xaml') XAML.forEach(x => out.add(x));
        else if (ALL.includes(name)) out.add(name);
    }
    return out;
}

/** The PlatformBlock ranges in a page, as line spans with the platforms they allow. */
function platformBlocksOf(text) {
    const lines = text.split('\n');
    const blocks = [];
    const open = [];
    lines.forEach((line, i) => {
        const start = line.match(/<PlatformBlock\s+for="([^"]*)"/);
        if (start) {
            open.push({ from: i + 1, allows: expand(start[1].split(',').map(s => s.trim())) });
            return;
        }
        if (line.includes('</PlatformBlock>') && open.length > 0) {
            const b = open.pop();
            blocks.push({ ...b, to: i + 1 });
        }
    });
    return blocks;
}

/** Sections are what a reader sees as one unit: a heading and everything under it. */
function sectionOf(text, line) {
    const lines = text.split('\n');
    let from = 1;
    for (let i = 0; i < line - 1 && i < lines.length; i++) {
        if (/^#{2,4}\s/.test(lines[i])) from = i + 1;
    }
    let to = lines.length;
    for (let i = line; i < lines.length; i++) {
        if (/^#{2,4}\s/.test(lines[i])) { to = i; break; }
    }
    return { from, to };
}

const problems = { stranded: [] };
let fences = 0, excluded = 0;

for (const lang of LANGS) {
    const dir = path.join(XPLAT_ROOT, 'src', 'content', lang, 'components');
    if (!fs.existsSync(dir)) continue;
    for (const file of mdxFilesUnder(dir)) {
        const text = fs.readFileSync(file, 'utf8');
        if (!text.includes('```json-snippet')) continue;
        const where = path.relative(path.join(XPLAT_ROOT, 'src', 'content'), file);
        const blocks = platformBlocksOf(text);

        const all = fencesOf(text);
        for (const fence of all) {
            fences++;
            const off = expand((fence.attrs.exclude || '').split(',').map(s => s.trim()).filter(Boolean));
            if (off.size === 0) continue;
            excluded++;

            const gates = blocks.filter(b => fence.line > b.from && fence.line < b.to);
            const gated = gates.length > 0
                ? gates.map(g => g.allows).reduce((a, b) => new Set([...a].filter(x => b.has(x))))
                : null;

            // The other snippets a reader has in the same section, and who they show for.
            const section = sectionOf(text, fence.line);
            const siblings = all.filter(other => other !== fence &&
                other.line > section.from && other.line < section.to);
            const covered = new Set();
            for (const sibling of siblings) {
                const siblingOff = expand((sibling.attrs.exclude || '').split(',')
                    .map(s => s.trim()).filter(Boolean));
                for (const platform of ALL) if (!siblingOff.has(platform)) covered.add(platform);
            }

            const stranded = [...off].filter(platform =>
                !covered.has(platform) && !(gated !== null && !gated.has(platform)));
            if (stranded.length > 0) {
                problems.stranded.push({
                    where: `${where}:${fence.line}`,
                    exclude: fence.attrs.exclude,
                    reads: stranded.join(', '),
                    siblings: siblings.length,
                    gate: gated === null ? null : [...gated].join(', '),
                });
            }
        }
    }
}

const say = (title, rows, render) => {
    if (rows.length === 0) return;
    console.log(`\n${title} (${rows.length})`);
    for (const row of rows) console.log('  ' + render(row));
};

say('these platforms read prose with no snippet under it', problems.stranded,
    r => `${r.where}  exclude="${r.exclude}"  reads empty: ${r.reads}` +
         `  (${r.siblings} other snippet(s) in the section` +
         `${r.gate === null ? ', no PlatformBlock' : `, gated for ${r.gate}`})`);

const bad = problems.stranded.length;
console.log(`\n${fences} fence(s), ${excluded} with an exclusion, ${bad} leaving a platform with ` +
            `prose and no snippet`);
process.exit(bad > 0 ? 1 : 0);

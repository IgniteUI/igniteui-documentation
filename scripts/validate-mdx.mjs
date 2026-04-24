/**
 * Validate all MDX files under a directory using @mdx-js/mdx compile.
 * Reports all errors grouped by type so patterns can be identified.
 *
 * Usage: node scripts/validate-mdx.mjs [dir]
 * Default dir: docs/jquery/src/content/en/topics
 */
import { compile } from '@mdx-js/mdx';
import { readdirSync, readFileSync } from 'fs';
import { resolve, join, relative } from 'path';

const targetDir = process.argv[2] ?? 'docs/jquery/src/content/en/topics';
const abs = resolve(targetDir);

function walk(dir) {
    const items = readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const item of items) {
        const full = join(dir, item.name);
        if (item.isDirectory()) files = files.concat(walk(full));
        else if (item.name.endsWith('.mdx')) files.push(full);
    }
    return files;
}

const all = walk(abs);
console.log(`Validating ${all.length} files in ${abs}\n`);

const errors = [];
let ok = 0;

for (const f of all) {
    const text = readFileSync(f, 'utf8');
    try {
        await compile(text, { format: 'mdx' });
        ok++;
    } catch (e) {
        const msg = e.message ?? String(e);
        // Extract position if present
        const posMatch = msg.match(/\((\d+):(\d+)[^)]*\)/);
        const pos = posMatch ? `${posMatch[1]}:${posMatch[2]}` : '?';
        // Strip file path from message for grouping
        const key = msg.replace(/\([^)]*\)/g, '(...)').replace(/`[^`]+`/g, '`...`').split('\n')[0].trim();
        errors.push({ file: relative(abs, f), pos, msg: msg.split('\n')[0].trim(), key });
    }
}

// Group by error key
const grouped = new Map();
for (const e of errors) {
    if (!grouped.has(e.key)) grouped.set(e.key, []);
    grouped.get(e.key).push(e);
}

console.log(`\nResults: ${ok} OK, ${errors.length} errors across ${grouped.size} distinct patterns\n`);
console.log('='.repeat(80));

// Print each group
for (const [key, items] of [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n[${items.length} files] ${key}`);
    for (const e of items) {
        console.log(`  ${e.file}:${e.pos}  |  ${e.msg}`);
    }
}

console.log('\n' + '='.repeat(80));
console.log(`Total errors: ${errors.length}`);

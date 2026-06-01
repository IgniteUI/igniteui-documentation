#!/usr/bin/env node
/**
 * migrate-platformblock-to-exclude.mjs
 *
 * Scans the xplat MDX content tree for PURE-EXCLUSION wrappers of the form:
 *
 *   <PlatformBlock for="Angular,Blazor,WebComponents"><ApiLink ... /></PlatformBlock>
 *
 * (i.e. a PlatformBlock that lists 3-of-4 known platforms, contains nothing
 * but a single self-closing <ApiLink ... />) and rewrites them as:
 *
 *   <ApiLink ... exclude="React" />
 *
 * Generalized to any single excluded platform.
 *
 * Idempotent. Run with `--dry-run` to preview.
 *
 * Usage:
 *   node scripts/migrate-platformblock-to-exclude.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

const DRY = process.argv.includes('--dry-run');
const ALL = ['Angular', 'React', 'WebComponents', 'Blazor'];

const ROOT = join(process.cwd(), 'docs', 'xplat', 'src', 'content');

function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) walk(full, out);
        else if (full.endsWith('.mdx')) out.push(full);
    }
    return out;
}

// PURE-EXCLUSION wrapper: PlatformBlock that contains exactly one self-closing
// ApiLink (whitespace allowed) and nothing else.
const PB_API_RE = /<PlatformBlock\s+for="([^"]+)"\s*>\s*(<ApiLink\b[^/>]*\/>)\s*<\/PlatformBlock>/g;

function migrate(text) {
    let count = 0;
    const out = text.replace(PB_API_RE, (full, forAttr, apiTag) => {
        const fors = forAttr.split(',').map(s => s.trim()).filter(Boolean);
        // Only handle single-platform exclusion: |fors| === |ALL| - 1
        if (fors.length !== ALL.length - 1) return full;
        const excluded = ALL.filter(p => !fors.includes(p));
        if (excluded.length !== 1) return full;
        // Skip if tag already has exclude attribute
        if (/\sexclude="/.test(apiTag)) return full;
        count++;
        const newTag = apiTag.replace(/\s*\/>$/, ` exclude="${excluded[0]}" />`);
        return newTag;
    });
    return { text: out, count };
}

let totalFiles = 0, totalReplacements = 0;
for (const file of walk(ROOT)) {
    const src = readFileSync(file, 'utf8');
    const { text, count } = migrate(src);
    if (count > 0) {
        totalFiles++;
        totalReplacements += count;
        console.log(`${DRY ? '[dry] ' : ''}${file.replace(process.cwd() + sep, '').replaceAll('\\','/')}  (+${count})`);
        if (!DRY) writeFileSync(file, text);
    }
}
console.log(`\n${DRY ? '[dry-run] ' : ''}Files: ${totalFiles}, Replacements: ${totalReplacements}`);

#!/usr/bin/env node
/**
 * Assert that every topic emitted for a desktop product is commercially licensed.
 *
 * Usage:
 *   node scripts/check-commercial-license.mjs --platform=WinUI --lang=en
 *   node scripts/check-commercial-license.mjs --platform=Uno --lang=jp
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const value = (name) => args.find(arg => arg.startsWith(`${name}=`))?.slice(name.length + 1);
const platform = value('--platform');
const lang = value('--lang') ?? 'en';
const desktopPlatforms = new Set(['WinUI', 'Uno']);

if (!desktopPlatforms.has(platform)) {
    console.error('Expected --platform=WinUI or --platform=Uno.');
    process.exit(2);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const components = path.join(root, 'generated', platform, lang, 'components');

if (!fs.existsSync(components)) {
    console.error(`Generated output not found: ${components}`);
    console.error(`Run generate.mjs --platform=${platform} --lang=${lang} first.`);
    process.exit(2);
}

const files = [];
(function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.mdx')) files.push(full);
    }
})(components);

const errors = [];
for (const file of files.sort()) {
    const text = fs.readFileSync(file, 'utf8');
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)?.[1];
    const relative = path.relative(components, file);

    if (frontmatter == null) {
        errors.push(`${relative}: missing YAML frontmatter`);
        continue;
    }

    const licenses = [...frontmatter.matchAll(/^license:\s*(.*?)\s*$/gm)].map(match => match[1]);
    if (licenses.length !== 1 || licenses[0] !== 'commercial') {
        const actual = licenses.length === 0 ? 'missing' : licenses.join(', ');
        errors.push(`${relative}: expected exactly "license: commercial"; found ${actual}`);
    }
}

console.log(`${platform}/${lang}: checked ${files.length} emitted topic(s), ${errors.length} license error(s).`);
for (const error of errors) console.error(`  ${error}`);
process.exit(errors.length > 0 ? 1 : 0);

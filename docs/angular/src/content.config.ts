import { createDocsCollection } from 'docs-template/content';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// src/ → project root
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

let lang = 'en';
try {
	const cfg = JSON.parse(readFileSync(path.join(root, '.platform.json'), 'utf8'));
	lang = cfg.lang ?? lang;
} catch { /* use defaults */ }

const docsDir = path.join(root, 'src', 'content', lang, 'components');

export const collections = {
	docs: createDocsCollection(docsDir, { exclude: ['**/*.md'] }),
};

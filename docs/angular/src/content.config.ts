import { z } from 'astro/zod';
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

const docsDir = path.join(root, 'src', 'content', lang);

const tableOfContentsSchema = z.object({
        tableOfContents: z
                .union([
                        z.literal(false),
                        z.object({
                                minHeadingLevel: z.number().min(2).max(6).optional(),
                                maxHeadingLevel: z.number().min(2).max(6).optional(),
                        }),
                ])
                .optional(),
});

export const collections = {
        docs: createDocsCollection(docsDir, { exclude: ['**/*.md'], extendSchema: tableOfContentsSchema }),
};

import { z } from 'astro/zod';
import { createDocsCollection } from 'docs-template/content';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// src/ → project root
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

let platform = 'React';
let lang = 'en';
try {
    const cfg = JSON.parse(readFileSync(path.join(root, '.platform.json'), 'utf8'));
    platform = cfg.platform ?? platform;
    lang     = cfg.lang     ?? lang;
} catch { /* use defaults */ }

const docsDir = path.join(root, 'generated', platform, lang, 'components');
console.log(`[content.config] platform=${platform} lang=${lang} → ${docsDir}`);

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
    docs: createDocsCollection(docsDir, { extendSchema: tableOfContentsSchema }),
};

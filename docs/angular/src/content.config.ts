import { z } from 'astro/zod';
import { createDocsCollection, docRootsFromEnv } from 'docs-template/content';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// src/ → project root
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

let lang = 'en';
try {
	const cfg = JSON.parse(readFileSync(path.join(root, '.platform.json'), 'utf8'));
	lang = cfg.lang ?? lang;
} catch { /* use defaults */ }

// Angular's own, hand-authored topics.
const docsDir = path.join(root, 'src', 'content', lang, 'components');

// Topics generated from the shared cross-platform source. These are read in
// place — nothing is copied into src/content — and they take precedence over
// the Angular tree, so a topic that has moved to xplat is served from xplat
// even if a stale copy is still sitting in src/content.
//
// changelog/ and grids/ stay Angular-owned and are never taken from xplat.
const xplatDir = path.join(root, '..', 'xplat', 'generated', 'Angular', lang, 'components');

// astro.config.ts owns the root list: createDocsSite resolves `source.docsDir`
// plus `source.overlayDirs` (excludes and all) and publishes the result as
// DOCS_SOURCE_PATHS, so the collection is built from exactly the roots the rest
// of the site resolves against. The literal fallback below only applies when
// this config is loaded without that env var — `astro check`, a direct
// `getCollection()` in a script — and must stay in step with astro.config.ts.
const rootsFromEnv = docRootsFromEnv();
const roots = rootsFromEnv.length
	? rootsFromEnv
	: existsSync(xplatDir)
		? [{ dir: xplatDir, exclude: ['changelog/**', 'grids/**'] }, docsDir]
		: [docsDir];

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
        docs: createDocsCollection(roots, { exclude: ['**/*.md'], extendSchema: tableOfContentsSchema }),
};

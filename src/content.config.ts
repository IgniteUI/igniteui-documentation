import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the markdown source directory.
// DOCS_SOURCE_PATH may be an absolute path (from env var) or we compute one.
// We convert to a file:// URL so Astro's glob loader can always resolve it correctly.
const rawSourcePath =
  process.env.DOCS_SOURCE_PATH ??
  path.resolve(__dirname, '../../igniteui-docfx/en/components');

const DOCS_BASE = pathToFileURL(rawSourcePath);

export const collections = {
  docs: defineCollection({
    loader: glob({
      base: DOCS_BASE,
      pattern: [
        '*.{md,mdx}',
        '**/*.{md,mdx}',
        '!**/_*.{md,mdx}',
        '!**/toc.yml',
        '!**/*.json',
        // igniteui-docfx–specific excludes
        '!**/grids_templates/**',
        '!**/style-guide.md',
        '!**/themes/sass/presets/**',
        '!themes.md',
      ],
    }),
    schema: docsSchema({
      extend: z.object({
        _description: z.any().optional(),
        _keywords: z.any().optional(),
        _license: z.any().optional(),
        _canonicalLink: z.any().optional(),
        _language: z.any().optional(),
        mentionedTypes: z.any().optional(),
        namespace: z.any().optional(),
      }),
    }),
  }),
};

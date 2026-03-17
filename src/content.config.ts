import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro:content';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read markdown files directly from igniteui-docfx — no local copying needed.
// The landing page (/) is handled by src/pages/index.astro via StarlightPage.
const DOCS_SOURCES: Record<string, { docsDir: string }> = {
  docfx: {
    docsDir: '../igniteui-docfx/en/components',
  },
  xplat: {
    docsDir: '../igniteui-xplat-docs/doc/en/components',
  },
};

const SOURCE_KEY = process.env.SOURCE_KEY || 'docfx';
const DOCS_DIR = DOCS_SOURCES[SOURCE_KEY].docsDir;
export const collections = {
  docs: defineCollection({
    loader: glob({
      base: DOCS_DIR,
      pattern: [
        '*.{md,mdx}',
        '**/*.{md,mdx}',
        '!**/_*.{md,mdx}',
        '!**/grids_templates/**',
        '!**/style-guide.md',
        '!**/themes/sass/presets/**',
        '!themes.md',
      ],
    }),
    schema: docsSchema({
      extend: z.object({
        // Allow docfx frontmatter fields (values can be null when YAML key has no value)
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

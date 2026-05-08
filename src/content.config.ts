// Re-export the pre-built collection from the shared helper.
// DOCS_SOURCE_PATH is set to the components dir (en/components) by
// astro.config.ts before Astro evaluates this file.
import { z } from 'astro/zod';
import { createDocsCollection } from './content-helper.ts';

// TODO: remove these template-specific exclusions once the source repos add
// proper Starlight frontmatter to these files (no `title` → fail schema).
export const collections = {
  docs: createDocsCollection(process.env.DOCS_SOURCE_PATH, {
    exclude: [
      'grids_templates/**',
      'style-guide.md',
      'themes/sass/presets/**',
      'themes.md',
    ],
    extendSchema: z.object({
      tableOfContents: z
        .union([
          z.literal(false),
          z.object({
            minHeadingLevel: z.number().min(2).max(6).optional(),
            maxHeadingLevel: z.number().min(2).max(6).optional(),
          }),
        ])
        .optional(),
    }),
  }),
};

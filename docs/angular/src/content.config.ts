import { z } from 'astro/zod';
import { createDocsCollection } from 'docs-template/content';

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

// No source is passed: astro.config.ts owns the root list (the Angular tree plus
// the xplat overlay), and createDocsSite publishes it as DOCS_SOURCE_PATHS.
export const collections = {
        docs: createDocsCollection(undefined, { exclude: ['**/*.md'], extendSchema: tableOfContentsSchema }),
};

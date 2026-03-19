/**
 * content-helper.mjs
 *
 * Returns the glob `pattern` array for the Astro content collection.
 * Source-agnostic: consuming repos provide their own path and any extra
 * exclude patterns, then call `defineCollection` / `docsSchema` themselves.
 *
 * Keeping `defineCollection`, `docsSchema`, and `z` out of this file means
 * it can be safely imported by `astro.config.mjs` or other Node scripts
 * without needing Astro's virtual-module resolver.
 *
 * Usage in a consuming repo's `src/content.config.ts`:
 *
 *   import { defineCollection, z } from 'astro:content';
 *   import { glob } from 'astro/loaders';
 *   import { docsSchema } from '@astrojs/starlight/schema';
 *   import { docsGlobPattern } from 'docs-template/content';
 *
 *   export const collections = {
 *     docs: defineCollection({
 *       loader: glob({
 *         base: process.env.DOCS_SOURCE_PATH ?? './docs',
 *         pattern: docsGlobPattern({ exclude: ['!**/internal/**'] }),
 *       }),
 *       schema: docsSchema({
 *         extend: z.object({ myField: z.string().optional() }),
 *       }),
 *     }),
 *   };
 */

/**
 * Returns the glob pattern array for a docs collection.
 * Includes sensible base excludes (drafts, toc files, bare JSON).
 *
 * @param {object} [options]
 * @param {string[]} [options.exclude]  Extra negative glob patterns.
 * @returns {string[]}
 */
export function docsGlobPattern({ exclude = [] } = {}) {
  return [
    '*.{md,mdx}',
    '**/*.{md,mdx}',
    '!**/_*.{md,mdx}',   // draft / partial files
    '!**/toc.yml',
    '!**/*.json',
    ...exclude,
  ];
}

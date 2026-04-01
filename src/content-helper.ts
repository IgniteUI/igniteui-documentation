/**
 * content-helper.ts
 *
 * Exports `createDocsCollection` — a helper for consuming Astro projects to
 * wire up their own `src/content.config.ts` with a single call.
 *
 * ── Zero-config usage (recommended when using createDocsSite) ─────────────
 *
 *   // src/content.config.ts — entire file, nothing else needed
 *   import { collections } from 'docs-template/content';
 *   export { collections };
 *
 *   `createDocsSite({ source: { docsDir } })` in astro.config.ts
 *   automatically sets DOCS_SOURCE_PATH, so the exported `collections`
 *   object picks it up with no extra configuration.
 *
 * ── Custom excludes / extra schema fields ────────────────────────────────
 *
 *   import { z } from 'astro:content';
 *   import { createDocsCollection } from 'docs-template/content';
 *
 *   export const collections = {
 *     docs: createDocsCollection(process.env.DOCS_SOURCE_PATH, {
 *       exclude: ['internal/**', 'draft.md'],
 *       extendSchema: z.object({ myCustomField: z.string().optional() }),
 *     }),
 *   };
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { pathToFileURL } from 'node:url';

type ExtendSchema = NonNullable<Parameters<typeof docsSchema>[0]>['extend'];

// SEO fields added to Starlight's base schema so `keywords` is preserved
// through validation instead of being stripped as an unknown field.
const EXTENDED_SEO_FIELDS = { keywords: z.string().optional() } as const;

/** Sentinel value placed on entries that have no title so we can remove them after loading. */
const SKIP_TITLE = '\x00skip';

/**
 * Wraps a loader so that after it populates the store, any entry whose
 * title equals the SKIP_TITLE sentinel is silently removed.
 *
 * Works in tandem with `skippableDocsSchema` which injects the sentinel
 * before Zod validation runs (preventing InvalidContentEntryDataError),
 * so the entry makes it into the store and can then be deleted here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withTitleFilter(baseLoader: any): any {
    return {
        ...baseLoader,
        load: async (ctx: any) => {
            await baseLoader.load(ctx);
            for (const id of [...ctx.store.keys()]) {
                const entry = ctx.store.get(id);
                if (!entry?.data?.title || entry.data.title === SKIP_TITLE) {
                    ctx.store.delete(id);
                }
            }
        },
    };
}

/**
 * Wraps docsSchema with a z.preprocess that injects a sentinel title for entries
 * missing one so the glob loader doesn't throw InvalidContentEntryDataError;
 * withTitleFilter removes those entries after loading.
 */
function skippableDocsSchema(extend?: ExtendSchema) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base = docsSchema(extend ? { extend } : undefined) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ctx: any) => z.preprocess(
        (data: unknown) => {
            if (typeof data === 'object' && data !== null) {
                const d = data as Record<string, unknown>;
                if (d['description'] === null) delete d['description'];
                if (!d['title']) return { ...d, title: SKIP_TITLE };
            }
            return data;
        },
        base(ctx),
    );
}

interface CreateDocsCollectionOptions {
    /**
     * Glob patterns to exclude (relative to `sourceDir`). A leading `!` is
     * added automatically when missing, so `'internal/**'` and
     * `'!internal/**'` are both accepted.
     */
    exclude?: string[];
    /**
     * Additional Zod object fields merged into the Starlight doc schema.
     * Useful for repo-specific frontmatter fields.
     */
    extendSchema?: ExtendSchema;
}

/**
 * Creates an Astro content collection (`docs`) for a Starlight docs site,
 * using a glob loader against the given source directory.
 *
 * Call this from your project's `src/content.config.ts`:
 *
 *   export const collections = {
 *     docs: createDocsCollection(process.env.DOCS_SOURCE_PATH),
 *   };
 *
 * @param sourceDir - Absolute path to the directory containing the source
 *   `.md`/`.mdx` files. Defaults to `process.env.DOCS_SOURCE_PATH` if omitted.
 * @param options - Optional exclude patterns and schema extension.
 *
 * @throws When neither `sourceDir` nor `DOCS_SOURCE_PATH` env var is set.
 */
export function createDocsCollection(
    sourceDir?: string,
    { exclude = [], extendSchema }: CreateDocsCollectionOptions = {},
) {
    const dir = sourceDir ?? process.env.DOCS_SOURCE_PATH;
    if (!dir) {
        throw new Error(
            '[docs-template] createDocsCollection: no source directory provided. ' +
            'Pass a path as the first argument or set the DOCS_SOURCE_PATH env variable.'
        );
    }

    // Normalise exclude patterns — ensure each starts with '!'
    const excludePatterns = exclude.map(p => (p.startsWith('!') ? p : `!${p}`));

    const extendSEO: ExtendSchema = (ctx) => {
        const user = typeof extendSchema === 'function' ? extendSchema(ctx) : extendSchema;
        return ((user ?? z.object({})) as z.ZodObject<z.ZodRawShape>).extend(EXTENDED_SEO_FIELDS);
    };

    return defineCollection({
        loader: withTitleFilter(glob({
            base: pathToFileURL(dir.endsWith('/') ? dir : dir + '/'),
            pattern: [
                '*.{md,mdx}',
                '**/*.{md,mdx}',
                '!**/_*.{md,mdx}',
                '!**/toc.yml',
                '!**/*.json',
                '!readme.md',
                '!README.md',
                '!CHANGELOG.md',
                '!LICENSE.md',
                ...excludePatterns,
            ],
        })),
        // use => schema: docsSchema({ extend }) as any, when skippableDocsSchema is no longer needed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: skippableDocsSchema(extendSEO) as any,
    });
}

// ---------------------------------------------------------------------------
// Zero-config pre-built export
// ---------------------------------------------------------------------------

/**
 * Ready-to-use `collections` object for the common case where
 * `createDocsSite` is used in `astro.config.ts`.
 *
 * The source directory is read from `process.env.DOCS_SOURCE_PATH`, which
 * `createDocsSite({ source: { docsDir } })` sets automatically.
 *
 * Usage — the entire `src/content.config.ts` in a consuming project:
 *
 *   import { collections } from 'docs-template/content';
 *   export { collections };
 *
 * If you need custom excludes or extra schema fields, use
 * `createDocsCollection` directly instead.
 */
export const collections = {
    docs: createDocsCollection(process.env.DOCS_SOURCE_PATH),
};

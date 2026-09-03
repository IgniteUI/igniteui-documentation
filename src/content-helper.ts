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
 *   `createDocsSite({ source: { docsDir, overlayDirs } })` in astro.config.ts
 *   publishes the full root list, so the exported `collections` object picks
 *   it up with no extra configuration.
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
 *
 * ── Overlaying a generated tree on an authored one ────────────────────────
 *
 *   Pass several roots, highest precedence first. All roots share one slug
 *   namespace, and the first root to provide a slug wins — nothing is copied
 *   between the trees, so the authored tree stays free of build output:
 *
 *   export const collections = {
 *     docs: createDocsCollection([
 *       { dir: generatedDir, exclude: ['changelog/**'] },  // wins
 *       authoredDir,
 *     ]),
 *   };
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { docRootsFromEnv, toRootList, type DocsContentRoot } from './lib/doc-roots.ts';

// The canonical root helpers live in `lib/doc-roots.ts` — re-exported here so a
// consuming `content.config.ts` can read the root list `createDocsSite`
// published (`docRootsFromEnv()`) from the same module it already imports.
export { docRootsFromEnv } from './lib/doc-roots.ts';
export type { DocsContentRoot, ResolvedDocRoot } from './lib/doc-roots.ts';

/** Sentinel value placed on entries that have no title so we can remove them after loading. */
const SKIP_TITLE = '\x00skip';

/**
 * Wraps a loader so that after it populates the store, any entry whose
 * title equals the SKIP_TITLE sentinel is silently removed.
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

// ---------------------------------------------------------------------------
// Multi-root overlay support
// ---------------------------------------------------------------------------
//
// Astro's `glob()` loader owns the whole store: it snapshots `store.keys()` when
// it starts and deletes every id it did not touch by the time it finishes. Two
// glob loaders sharing one collection would therefore wipe each other's entries.
//
// `scopeStore` hands each root its own view of the store so that:
//   • `keys()`  lists only the entries that came from *that* root, so a root's
//     cleanup sweep can never delete another root's pages;
//   • `get()` only ever hands a root back its *own* entries, so a shadowed page
//     is silently skipped instead of overwriting the winner (and without
//     tripping Astro's duplicate-slug warning, which fires inside the loader
//     between its `get` and its `set`);
//   • `set()` is refused for ids a higher-precedence root has claimed.
//
// Ownership is decided by the entry's own `filePath`, not just by what a root
// wrote during this pass: on a *warm* load the glob loader returns early — with
// no `set` — as soon as it sees an unchanged digest, so a root that wins every
// one of its slugs may never call `set` at all. `get()` therefore registers the
// claim itself, which is what keeps the winner from being overwritten by the
// next root on the second and every later build against a populated store.
//
// Roots are always ordered highest precedence first, so root 0 wins every
// collision — see `src/lib/doc-roots.ts` for the convention.

/** Absolute path of the file an entry was loaded from, or `undefined`. */
function entrySourcePath(entry: unknown, configRoot: string): string | undefined {
    const filePath = (entry as { filePath?: string } | undefined)?.filePath;
    return filePath ? path.resolve(configRoot, filePath) : undefined;
}

interface ScopeStoreOptions {
    /** Absolute path of the root this view belongs to. */
    root: string;
    /** Index of this root in the precedence list (0 = highest). */
    rootIndex: number;
    /** True when this is the lowest-precedence root. */
    isLast: boolean;
    /** Astro's `config.root`, used to absolutize the relative `filePath` on entries. */
    configRoot: string;
    /** Shared across roots for one load pass: entry id → index of the root that claimed it. */
    claimed: Map<string, number>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scopeStore(store: any, options: ScopeStoreOptions): any {
    const { root, rootIndex, isLast, configRoot, claimed } = options;
    const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;

    /**
     * Ownership of a stored entry, decided by the file it was loaded from:
     *   `'mine'`    — the file lives under this root;
     *   `'other'`   — it lives under a different root;
     *   `'orphan'`  — it has no file path (predates this loader, or came from
     *                 elsewhere). Only the last root claims orphans, so they are
     *                 still swept exactly once.
     */
    const ownership = (id: string): 'mine' | 'other' | 'orphan' => {
        const source = entrySourcePath(store.get(id), configRoot);
        if (!source) return 'orphan';
        return source.startsWith(rootWithSep) ? 'mine' : 'other';
    };

    /** True when `id` was loaded from this root — decided by the entry's own file path. */
    const ownsEntry = (id: string): boolean => {
        const owner = ownership(id);
        return owner === 'orphan' ? isLast : owner === 'mine';
    };

    /** True when any *other* root has taken this id during this load pass. */
    const takenByOther = (id: string): boolean => {
        const owner = claimed.get(id);
        return owner !== undefined && owner !== rootIndex;
    };

    /**
     * True when a root that outranks this one has taken the id. Writes are
     * blocked only by higher precedence, never by lower, so a root can still
     * take over a slug it should win — which is what happens when the dev
     * server's watcher adds a file that shadows an already-loaded page.
     */
    const takenByHigher = (id: string): boolean => {
        const owner = claimed.get(id);
        return owner !== undefined && owner < rootIndex;
    };

    return {
        ...store,
        keys: () => [...store.keys()].filter(ownsEntry),
        entries: () => [...store.entries()].filter(([id]: [string]) => ownsEntry(id)),
        values: () => [...store.entries()].filter(([id]: [string]) => ownsEntry(id)).map(([, v]: [string, unknown]) => v),
        // Hiding another root's entry keeps the two files from being compared
        // against each other, which is what would otherwise emit a
        // duplicate-slug warning for a slug that is deliberately shadowed.
        //
        // Reading one's own entry also *claims* the id. The loader calls `get`
        // for every file it walks, but only calls `set` when the content
        // actually changed, so claiming here is the only thing that records the
        // winner on a warm load — without it the next root would see an
        // unclaimed id and overwrite the page it is supposed to be shadowed by.
        get: (id: string) => {
            if (takenByOther(id)) return undefined;
            switch (ownership(id)) {
                case 'mine':
                    claimed.set(id, rootIndex);
                    return store.get(id);
                case 'other':
                    return undefined;
                default:
                    // No file path to go on (or no entry at all) — nothing to
                    // claim; hand back whatever the store has.
                    return store.get(id);
            }
        },
        set: (entry: { id: string }) => {
            if (takenByHigher(entry.id)) return false;
            claimed.set(entry.id, rootIndex);
            return store.set(entry);
        },
        delete: (id: string) => {
            if (takenByOther(id)) return;
            claimed.delete(id);
            return store.delete(id);
        },
    };
}

/**
 * Runs one glob loader per content root against a single collection.
 *
 * Roots are listed highest precedence first and loaded in that order, so the
 * first root to provide a slug is the one that wins.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function overlayLoader(loaders: Array<{ root: string; loader: any }>): any {
    if (loaders.length === 1) return loaders[0].loader;

    return {
        name: 'docs-overlay-loader',
        load: async (ctx: any) => {
            // Entry `filePath`s are stored relative to Astro's project root,
            // which the config exposes as a file:// URL.
            const configRoot = ctx.config?.root ? fileURLToPath(ctx.config.root) : process.cwd();
            const claimed = new Map<string, number>();

            for (const [rootIndex, { root, loader }] of loaders.entries()) {
                await loader.load({
                    ...ctx,
                    store: scopeStore(ctx.store, {
                        root,
                        rootIndex,
                        isLast: rootIndex === loaders.length - 1,
                        configRoot,
                        claimed,
                    }),
                });
            }
        },
    };
}

/**
 * Base frontmatter schema for MDX/Markdown documentation files.
 * Wraps with a z.preprocess that injects a sentinel title for entries
 * missing one so the glob loader doesn't throw InvalidContentEntryDataError.
 */
function makeDocsSchema(extend?: z.ZodObject<z.ZodRawShape>) {
    const base = z.object({
        title: z.string(),
        description: z.string().optional().nullable(),
        keywords: z.string().optional().nullable(),
        draft: z.boolean().optional(),
        license: z.string().optional(),
    });

    const schema = extend ? base.merge(extend) : base;

    return z.preprocess(
        (data: unknown) => {
            if (typeof data === 'object' && data !== null) {
                const d = data as Record<string, unknown>;
                if (d['description'] === null) delete d['description'];
                if (!d['title']) return { ...d, title: SKIP_TITLE };
            }
            return data;
        },
        schema,
    );
}

interface CreateDocsCollectionOptions {
    /**
     * Glob patterns to exclude, applied to *every* root (relative to each root).
     * A leading `!` is added automatically when missing, so `'internal/**'` and
     * `'!internal/**'` are both accepted.
     */
    exclude?: string[];
    /**
     * Additional Zod object fields merged into the docs schema.
     * Useful for repo-specific frontmatter fields.
     */
    extendSchema?: z.ZodObject<z.ZodRawShape>;
}

/**
 * Creates an Astro content collection (`docs`) for a docs site, using a glob
 * loader against each source directory.
 *
 * @param sourceDir - Absolute path to the directory containing the source
 *   `.md`/`.mdx` files, or a list of such directories **ordered highest
 *   precedence first**: when the same slug exists in more than one root, the
 *   earliest root in the list provides the page and the rest are ignored.
 *   Defaults to `process.env.DOCS_SOURCE_PATH` if omitted.
 * @param options - Optional exclude patterns and schema extension.
 */
export function createDocsCollection(
    sourceDir?: DocsContentRoot | DocsContentRoot[],
    { exclude = [], extendSchema }: CreateDocsCollectionOptions = {},
) {
    const configured = sourceDir ?? process.env.DOCS_SOURCE_PATH;
    const roots = toRootList(
        (Array.isArray(configured) ? configured : [configured])
            .filter((r): r is DocsContentRoot => Boolean(r)),
    ).filter(r => Boolean(r.dir));

    if (roots.length === 0) {
        throw new Error(
            '[docs-template] createDocsCollection: no source directory provided. ' +
            'Pass a path (or list of paths) as the first argument or set the DOCS_SOURCE_PATH env variable.'
        );
    }

    const toNegated = (patterns: string[]) => patterns.map(p => (p.startsWith('!') ? p : `!${p}`));

    const loaders = roots.map(({ dir, exclude: rootExclude }) => ({
        root: path.resolve(dir),
        loader: glob({
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
                ...toNegated([...exclude, ...rootExclude]),
            ],
        }),
    }));

    return defineCollection({
        loader: withTitleFilter(overlayLoader(loaders)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: makeDocsSchema(extendSchema) as any,
    });
}

// ---------------------------------------------------------------------------
// Zero-config pre-built export
// ---------------------------------------------------------------------------

/**
 * Ready-to-use `collections` object for the common case where
 * `createDocsSite` is used in `astro.config.ts`.
 *
 * Usage — the entire `src/content.config.ts` in a consuming project:
 *
 *   import { collections } from 'docs-template/content';
 *   export { collections };
 */
export const collections = {
    docs: createDocsCollection(docRootsFromEnv()),
};

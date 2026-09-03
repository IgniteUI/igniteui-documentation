/**
 * doc-roots.ts
 *
 * Helpers for docs sites whose content is assembled from more than one
 * directory on disk.
 *
 * A docs site has one *base* content root (`source.docsDir`) and zero or more
 * *overlay* roots (`source.overlayDirs`). All roots share a single slug
 * namespace: a file at `<root>/charts/types/area-chart.mdx` is always the page
 * `/charts/types/area-chart`, whichever root it came from.
 *
 * When the same slug exists in several roots, the overlay wins. This is how the
 * Angular docs consume the cross-platform (xplat) generator: the generated
 * topics under `docs/xplat/generated/Angular/{lang}/components` override the
 * hand-authored ones under `docs/angular/src/content/{lang}/components`, without
 * anything ever being copied into the tracked tree.
 *
 * ── Ordering convention ──────────────────────────────────────────────────────
 * Every function here takes and returns roots **highest precedence first**, so
 * a plain `for` loop over the list resolves a slug the same way the site does.
 * The one place that reverses the list is the content loader, where the *last*
 * loader to write a given id is the one that wins.
 */

import fs from 'node:fs';
import path from 'node:path';

/** Env var carrying the full ordered root list as a JSON array of absolute paths. */
export const DOC_ROOTS_ENV = 'DOCS_SOURCE_PATHS';

/**
 * Normalizes a base dir plus optional overlays into an ordered, de-duplicated
 * list of absolute paths, highest precedence first.
 *
 * Roots that do not exist on disk are dropped — a language the xplat generator
 * does not emit (`kr`, today) simply has no overlay rather than a broken one.
 */
export function resolveDocRoots(
    docsDir: string | undefined,
    overlayDirs: readonly string[] = [],
): string[] {
    const ordered = [...overlayDirs, docsDir].filter((d): d is string => Boolean(d));
    const seen = new Set<string>();
    const roots: string[] = [];

    for (const dir of ordered) {
        const abs = path.resolve(dir);
        if (seen.has(abs)) continue;
        seen.add(abs);
        if (fs.existsSync(abs)) roots.push(abs);
    }

    return roots;
}

/** Coerces the `string | string[]` shape accepted by the public options into a list. */
export function toRootList(docsDir: string | readonly string[] | undefined): string[] {
    if (!docsDir) return [];
    return (Array.isArray(docsDir) ? docsDir : [docsDir as string]).map(d => path.resolve(d));
}

/**
 * Returns the absolute path of the first root that contains `relPath`,
 * or `undefined` when no root does.
 */
export function findInRoots(roots: readonly string[], relPath: string): string | undefined {
    for (const root of roots) {
        const candidate = path.join(root, relPath);
        if (fs.existsSync(candidate)) return candidate;
    }
    return undefined;
}

/**
 * Returns the first existing file among `relPaths`, searched root-by-root in
 * precedence order. Each root is fully checked before moving to the next, so an
 * overlay's `.md` beats the base's `.mdx` — matching how the loader resolves a
 * slug that exists in both roots.
 */
export function findFirstInRoots(
    roots: readonly string[],
    relPaths: readonly string[],
): string | undefined {
    for (const root of roots) {
        for (const relPath of relPaths) {
            const candidate = path.join(root, relPath);
            if (fs.existsSync(candidate)) return candidate;
        }
    }
    return undefined;
}

/**
 * Returns the root that `filePath` lives under, or `undefined` when it lives
 * outside every root. Used to turn an absolute source path back into a slug —
 * the relative path must be computed against the file's *own* root, not the
 * highest-precedence one, or cross-root links resolve to the wrong slug.
 *
 * The longest matching root wins, so nested roots behave sensibly.
 */
export function rootForFile(roots: readonly string[], filePath: string): string | undefined {
    const abs = path.resolve(filePath);
    let best: string | undefined;

    for (const root of roots) {
        const withSep = root.endsWith(path.sep) ? root : root + path.sep;
        if (!abs.startsWith(withSep)) continue;
        if (!best || root.length > best.length) best = root;
    }

    return best;
}

/**
 * Reads the ordered root list published by `createDocsSite`.
 * Falls back to the single `DOCS_SOURCE_PATH` for sites that never set overlays.
 */
export function docRootsFromEnv(): string[] {
    const raw = process.env[DOC_ROOTS_ENV];
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.map(String);
        } catch { /* fall through to the single-path form */ }
    }
    return process.env.DOCS_SOURCE_PATH ? [path.resolve(process.env.DOCS_SOURCE_PATH)] : [];
}

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
 * The content loader follows the same convention: it loads the roots in list
 * order and refuses writes from a lower-precedence root for any id a higher one
 * has already claimed, so the *first* root to provide a slug is the one that
 * wins. Never reverse the list before handing it to a consumer.
 *
 * ── Excludes ────────────────────────────────────────────────────────────────
 * A root may carry its own `exclude` globs — subtrees it contributes on disk but
 * that the site does not serve (the Angular site keeps `changelog/` and `grids/`
 * for itself, for example). The excludes travel with the root through
 * `DOCS_SOURCE_PATHS`, so the content loader, the sidebar, the llms.txt metadata
 * and the dev-mode raw-Markdown middleware all resolve a slug to the same file.
 */

import fs from 'node:fs';
import path from 'node:path';

/** Env var carrying the full ordered root list as a JSON array. */
export const DOC_ROOTS_ENV = 'DOCS_SOURCE_PATHS';

/**
 * A content root. Use the object form to give one root its own exclusions —
 * for example, keeping a generated tree's `changelog/` out of a site that
 * maintains its own.
 */
export type DocsContentRoot = string | { dir: string; exclude?: string[] };

/** A content root with its directory absolutized and its excludes normalized. */
export interface ResolvedDocRoot {
    /** Absolute path of the root directory. */
    dir: string;
    /** Glob patterns, relative to `dir`, that this root does not contribute. */
    exclude: string[];
}

/** Absolutizes a root and fills in a missing `exclude` list. */
export function normalizeRoot(root: DocsContentRoot): ResolvedDocRoot {
    return typeof root === 'string'
        ? { dir: path.resolve(root), exclude: [] }
        : { dir: path.resolve(root.dir), exclude: [...(root.exclude ?? [])] };
}

// ---------------------------------------------------------------------------
// Exclude matching
// ---------------------------------------------------------------------------

/**
 * Compiles one of the simple globs used by root excludes (`changelog/**`,
 * `grids/**`, `internal/*.mdx`) into a regular expression.
 *
 * Supported: `**` (any number of path segments), `*` (anything but `/`) and
 * `?` (a single character but `/`). That is the whole vocabulary the excludes
 * use, which keeps this dependency-free — the content loader hands the same
 * patterns to Astro's glob loader, which understands a much larger grammar,
 * so anything fancier belongs there rather than here.
 */
function globToRegExp(pattern: string): RegExp {
    const src = pattern.replace(/^!/, '');
    let body = '';

    for (let i = 0; i < src.length; i++) {
        const char = src[i];
        if (char === '*') {
            if (src[i + 1] === '*') {
                if (src[i + 2] === '/') {
                    // `**/` spans zero or more whole path segments.
                    body += '(?:[^/]*/)*';
                    i += 2;
                } else {
                    // A trailing `**` matches everything below this point.
                    body += '.*';
                    i += 1;
                }
            } else {
                body += '[^/]*';
            }
        } else if (char === '?') {
            body += '[^/]';
        } else if (char && '.+^${}()|[]'.includes(char)) {
            body += '\\' + char;
        } else if (char === '\\') {
            body += '\\\\';
        } else {
            body += char;
        }
    }

    return new RegExp(`^${body}$`);
}

const globCache = new Map<string, RegExp>();

function matchesGlob(pattern: string, relPath: string): boolean {
    let re = globCache.get(pattern);
    if (!re) {
        re = globToRegExp(pattern);
        globCache.set(pattern, re);
    }
    return re.test(relPath);
}

/**
 * True when `relPath` (root-relative, POSIX separators) is excluded from `root`.
 * An excluded path is treated as absent: the next root gets a chance to supply
 * the slug, exactly as the content loader resolves it.
 */
export function isExcludedFromRoot(root: ResolvedDocRoot, relPath: string): boolean {
    if (!root.exclude.length) return false;
    const normalized = relPath.replace(/\\/g, '/');
    return root.exclude.some(pattern => matchesGlob(pattern, normalized));
}

// ---------------------------------------------------------------------------
// Root lists
// ---------------------------------------------------------------------------

/**
 * Normalizes a base dir plus optional overlays into an ordered, de-duplicated
 * list of roots, highest precedence first.
 *
 * Roots that do not exist on disk are dropped — a language the xplat generator
 * does not emit (`kr`, today) simply has no overlay rather than a broken one.
 */
export function resolveDocRoots(
    docsDir: DocsContentRoot | undefined,
    overlayDirs: readonly DocsContentRoot[] = [],
): ResolvedDocRoot[] {
    const ordered = [...overlayDirs, docsDir].filter((d): d is DocsContentRoot => Boolean(d));
    const seen = new Set<string>();
    const roots: ResolvedDocRoot[] = [];

    for (const entry of ordered) {
        const root = normalizeRoot(entry);
        if (!root.dir || seen.has(root.dir)) continue;
        seen.add(root.dir);
        if (fs.existsSync(root.dir)) roots.push(root);
    }

    return roots;
}

/** Coerces the shapes accepted by the public options into a resolved root list. */
export function toRootList(
    docsDir: DocsContentRoot | readonly DocsContentRoot[] | undefined,
): ResolvedDocRoot[] {
    if (!docsDir) return [];
    const list = Array.isArray(docsDir)
        ? (docsDir as readonly DocsContentRoot[])
        : [docsDir as DocsContentRoot];
    return list.filter(Boolean).map(normalizeRoot);
}

/** The bare directory paths of a root list, for consumers that only need those. */
export function rootDirs(roots: readonly DocsContentRoot[]): string[] {
    return toRootList(roots).map(r => r.dir);
}

/**
 * Returns the absolute path of the first root that contains `relPath`,
 * or `undefined` when no root does. Paths a root excludes are skipped, so a
 * root never answers for a page the site does not serve from it.
 */
export function findInRoots(
    roots: readonly DocsContentRoot[],
    relPath: string,
): string | undefined {
    for (const root of toRootList(roots)) {
        if (isExcludedFromRoot(root, relPath)) continue;
        const candidate = path.join(root.dir, relPath);
        if (fs.existsSync(candidate)) return candidate;
    }
    return undefined;
}

/**
 * Returns the first existing file among `relPaths`, searched root-by-root in
 * precedence order. Each root is fully checked before moving to the next, so an
 * overlay's `.md` beats the base's `.mdx` — matching how the loader resolves a
 * slug that exists in both roots. Excluded paths are skipped, for the same
 * reason as in `findInRoots`.
 */
export function findFirstInRoots(
    roots: readonly DocsContentRoot[],
    relPaths: readonly string[],
): string | undefined {
    for (const root of toRootList(roots)) {
        for (const relPath of relPaths) {
            if (isExcludedFromRoot(root, relPath)) continue;
            const candidate = path.join(root.dir, relPath);
            if (fs.existsSync(candidate)) return candidate;
        }
    }
    return undefined;
}

/**
 * Returns the root directory that `filePath` lives under, or `undefined` when it
 * lives outside every root. Used to turn an absolute source path back into a
 * slug — the relative path must be computed against the file's *own* root, not
 * the highest-precedence one, or cross-root links resolve to the wrong slug.
 *
 * The longest matching root wins, so nested roots behave sensibly.
 */
export function rootForFile(
    roots: readonly DocsContentRoot[],
    filePath: string,
): string | undefined {
    const abs = path.resolve(filePath);
    let best: string | undefined;

    for (const { dir } of toRootList(roots)) {
        const withSep = dir.endsWith(path.sep) ? dir : dir + path.sep;
        if (!abs.startsWith(withSep)) continue;
        if (!best || dir.length > best.length) best = dir;
    }

    return best;
}

/** Serializes a root list for `DOCS_SOURCE_PATHS`. */
export function serializeDocRoots(roots: readonly ResolvedDocRoot[]): string {
    return JSON.stringify(
        roots.map(r => (r.exclude.length ? { dir: r.dir, exclude: r.exclude } : r.dir)),
    );
}

/**
 * Reads the ordered root list published by `createDocsSite`, excludes included.
 * Falls back to the single `DOCS_SOURCE_PATH` for sites that never set overlays.
 */
export function docRootsFromEnv(): ResolvedDocRoot[] {
    const raw = process.env[DOC_ROOTS_ENV];
    if (raw) {
        try {
            const parsed: unknown = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed
                    .filter((entry): entry is DocsContentRoot =>
                        typeof entry === 'string' ||
                        (typeof entry === 'object' && entry !== null && 'dir' in entry))
                    .map(normalizeRoot);
            }
        } catch { /* fall through to the single-path form */ }
    }
    return process.env.DOCS_SOURCE_PATH
        ? [normalizeRoot(process.env.DOCS_SOURCE_PATH)]
        : [];
}

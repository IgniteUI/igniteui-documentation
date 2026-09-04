/**
 * angular-content-roots.mjs
 *
 * One description of "which files does the Angular site actually serve", shared
 * by every link checker so the answer cannot drift between them.
 *
 * The Angular site is built from two content roots overlaid in place — nothing
 * is ever copied between the trees:
 *
 *   1. docs/xplat/generated/Angular/{lang}/components   (highest precedence)
 *   2. docs/angular/src/content/{lang}/components       (hand-authored)
 *
 * Two consequences a checker has to model:
 *
 *   • Parts of the overlay are excluded, so those files exist on disk but are
 *     never rendered — see `isUnservedOverlayFile`.
 *   • xplat always wins a slug collision, so an authored topic the generator
 *     also emits is never rendered either — see `isShadowedAuthoredFile`.
 *
 * KEEP IN SYNC with the roots and excludes in
 * `docs/angular/src/content.config.ts` and the `source.overlayDirs` entry in
 * `docs/angular/astro.config.ts`. If an exclude is added there, add it here.
 */

import { existsSync } from 'node:fs';

/** Repo-relative path of the Angular site's own, hand-authored content root. */
export const ANGULAR_AUTHORED_ROOT = 'docs/angular/src/content';

/** Repo-relative path of the xplat generator's Angular output (the overlay). */
export const ANGULAR_OVERLAY_ROOT = 'docs/xplat/generated/Angular';

/**
 * Content roots that share one slug namespace. The Angular site serves its own
 * tree and the xplat generator's Angular output as a single set of pages, so a
 * link may legitimately point from one tree at a topic that lives in the other.
 */
export const OVERLAY_ROOT_GROUPS = [
    [ANGULAR_AUTHORED_ROOT, ANGULAR_OVERLAY_ROOT],
];

/**
 * Directories excluded from the overlay in `docs/angular/src/content.config.ts`.
 * They stay Angular-owned, so the xplat copies are never served.
 */
export const OVERLAY_EXCLUDED_DIRS = ['changelog', 'grids'];

/**
 * Paths that exist in the generated tree but are not served, because the site
 * excludes them from the overlay.
 */
const UNSERVED_OVERLAY_PATHS = [
    new RegExp(
        `(^|/)${ANGULAR_OVERLAY_ROOT}/[^/]+/components/(${OVERLAY_EXCLUDED_DIRS.join('|')})(/|$)`,
        'i',
    ),
];

/** Forward-slash form of a path, for matching against the repo-relative patterns. */
function normalize(filePath) {
    return String(filePath).replace(/\\/g, '/');
}

/**
 * True when `filePath` lives in the overlay but under a path the Angular site
 * excludes, so the file is on disk yet never rendered. Such files must not be
 * scanned, and must not satisfy a link from a page that *is* rendered.
 */
export function isUnservedOverlayFile(filePath) {
    const normalized = normalize(filePath);
    return UNSERVED_OVERLAY_PATHS.some(re => re.test(normalized));
}

// The leading group is whatever precedes the repo-relative root — an absolute
// prefix ending in `/`, or nothing at all for an already-relative path.
const AUTHORED_TOPIC_RE = new RegExp(
    `^(|.*/)${ANGULAR_AUTHORED_ROOT}/([^/]+)/components/(.+)$`,
    'i',
);

/**
 * True when `filePath` is a hand-authored Angular topic whose slug the xplat
 * generator also provides. xplat wins every collision, so the authored file is
 * dead weight: it is never rendered, and scanning it would report links that no
 * published page contains.
 */
export function isShadowedAuthoredFile(filePath) {
    const match = AUTHORED_TOPIC_RE.exec(normalize(filePath));
    if (!match) return false;
    const [, prefix, lang, rel] = match;
    const overlayCandidate = `${prefix}${ANGULAR_OVERLAY_ROOT}/${lang}/components/${rel}`;
    // An overlay file the site excludes shadows nothing — `grids/` and
    // `changelog/` stay Angular-owned even though xplat also emits them.
    if (isUnservedOverlayFile(overlayCandidate)) return false;
    return existsSync(overlayCandidate);
}

/** True when the Angular site never renders `filePath`, for either reason above. */
export function isUnservedAngularFile(filePath) {
    return isUnservedOverlayFile(filePath) || isShadowedAuthoredFile(filePath);
}

/**
 * Returns every language root that resolves alongside `langRoot`, itself first.
 * Roots that are not on disk (a language the generator does not emit) are dropped.
 *
 * `langRoot` is absolute — the scan resolves its source dirs — so the
 * repo-relative group entries are matched as a substring and the prefix before
 * them is carried over to the peers.
 */
export function getRootGroup(langRoot) {
    if (!langRoot) return [];
    const normalized = normalize(langRoot).replace(/\/$/, '');
    for (const group of OVERLAY_ROOT_GROUPS) {
        for (const base of group) {
            const at = normalized.lastIndexOf(base + '/');
            if (at === -1) continue;
            const prefix = normalized.slice(0, at);
            const lang = normalized.slice(at + base.length + 1);
            if (!lang || lang.includes('/')) continue;
            const peers = group
                .filter(other => other !== base)
                .map(other => `${prefix}${other}/${lang}/`)
                .filter(dir => existsSync(dir));
            return [langRoot, ...peers];
        }
    }
    return [langRoot];
}

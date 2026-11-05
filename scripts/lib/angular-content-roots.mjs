/**
 * angular-content-roots.mjs
 *
 * The one description of the Angular site's content roots. The site's
 * `docs/angular/astro.config.ts` takes its overlay from `angularOverlayRoot()`,
 * and the link checkers and `clean-synced.mjs` model the same roots from here,
 * so what the site serves and what the scripts check cannot drift apart.
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
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isExcludedFromRoot } from '../../src/lib/doc-roots.ts';

/** Repo-relative path of the Angular site's own, hand-authored content root. */
export const ANGULAR_AUTHORED_ROOT = 'docs/angular/src/content';

/** Repo-relative path of the xplat generator's Angular output (the overlay). */
export const ANGULAR_OVERLAY_ROOT = 'docs/xplat/generated/Angular';

/**
 * Overlay subtrees, relative to `{lang}/components`, that the site does not
 * serve: `changelog/` and `grids/` stay Angular-owned even though xplat emits
 * them too.
 */
export const ANGULAR_OVERLAY_EXCLUDE = ['changelog/**', 'grids/**'];

/** The docs/angular npm script that generates each language's overlay. */
export const OVERLAY_GENERATE_SCRIPTS = { en: 'xplat:generate', jp: 'xplat:generate:jp' };

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** The overlay content root for `lang`, as `createDocsSite` takes it in `source.overlayDirs`. */
export function angularOverlayRoot(lang) {
    return {
        dir: join(REPO_ROOT, ANGULAR_OVERLAY_ROOT, lang, 'components'),
        exclude: [...ANGULAR_OVERLAY_EXCLUDE],
    };
}

/** Forward-slash form of a path, for matching against the repo-relative roots. */
function normalize(filePath) {
    return String(filePath).replace(/\\/g, '/');
}

// `<prefix><root>/<lang><rest>` for either Angular root. The prefix is whatever
// precedes the repo-relative root — an absolute directory ending in `/`, or
// nothing at all for an already-relative path.
const ANGULAR_PATH_RE = new RegExp(
    `^(.*/)?(${ANGULAR_AUTHORED_ROOT}|${ANGULAR_OVERLAY_ROOT})/([^/]+)(/.*)?$`,
);

/** Splits a path under either Angular root into its parts, or returns `null`. */
function parseAngularPath(filePath) {
    const match = ANGULAR_PATH_RE.exec(normalize(filePath));
    return match && { prefix: match[1] ?? '', root: match[2], lang: match[3], rest: match[4] ?? '' };
}

/** The same language and rest of the path, re-anchored on the other Angular root. */
function peerPath({ prefix, root, lang, rest }) {
    const peer = root === ANGULAR_AUTHORED_ROOT ? ANGULAR_OVERLAY_ROOT : ANGULAR_AUTHORED_ROOT;
    return `${prefix}${peer}/${lang}${rest}`;
}

/** The part of `rest` below `components/`, or `null` when it is not under it. */
function componentsRel(rest) {
    return rest.startsWith('/components/') ? rest.slice('/components/'.length) : null;
}

/**
 * True when `filePath` lives in the overlay but under a path the Angular site
 * excludes, so the file is on disk yet never rendered. Such files must not be
 * scanned, and must not satisfy a link from a page that *is* rendered.
 */
export function isUnservedOverlayFile(filePath) {
    const parsed = parseAngularPath(filePath);
    if (parsed?.root !== ANGULAR_OVERLAY_ROOT) return false;
    const rel = componentsRel(parsed.rest);
    return rel !== null && isExcludedFromRoot({ exclude: ANGULAR_OVERLAY_EXCLUDE }, rel);
}

/**
 * True when `filePath` is a hand-authored Angular topic whose slug the xplat
 * generator also provides. xplat wins every collision, so the authored file is
 * dead weight: it is never rendered, and scanning it would report links that no
 * published page contains.
 */
export function isShadowedAuthoredFile(filePath) {
    const parsed = parseAngularPath(filePath);
    if (parsed?.root !== ANGULAR_AUTHORED_ROOT || componentsRel(parsed.rest) === null) return false;
    const overlayCandidate = peerPath(parsed);
    // An overlay file the site excludes shadows nothing — `grids/` and
    // `changelog/` stay Angular-owned even though xplat also emits them.
    return !isUnservedOverlayFile(overlayCandidate) && existsSync(overlayCandidate);
}

/** True when the Angular site never renders `filePath`, for either reason above. */
export function isUnservedAngularFile(filePath) {
    return isUnservedOverlayFile(filePath) || isShadowedAuthoredFile(filePath);
}

const rootGroupCache = new Map();

/**
 * Returns every language root that resolves alongside `langRoot`, itself first.
 * A peer that is not on disk (a language the generator does not emit) is dropped.
 *
 * `langRoot` is usually absolute — the scan resolves its source dirs — so the
 * prefix before the repo-relative root is carried over to the peer.
 */
export function getRootGroup(langRoot) {
    if (!langRoot) return [];
    let group = rootGroupCache.get(langRoot);
    if (!group) {
        const parsed = parseAngularPath(normalize(langRoot).replace(/\/$/, ''));
        const peer = parsed && !parsed.rest ? `${peerPath(parsed)}/` : null;
        group = peer && existsSync(peer) ? [langRoot, peer] : [langRoot];
        rootGroupCache.set(langRoot, group);
    }
    return group;
}

/**
 * Drops source `dirs` that are not on disk.
 *
 * A language the xplat generator does not emit (`kr`) simply has no overlay.
 * A missing en/jp overlay, though, silently shrinks coverage: its generated
 * topics go unchecked, and links and toc entries pointing at them report a
 * false "not found" — so each missing language is called out with the command
 * that generates it.
 */
export function keepExistingRoots(dirs) {
    for (const dir of dirs) {
        if (dir !== ANGULAR_OVERLAY_ROOT) {
            if (!existsSync(dir)) console.warn(`[warn] Source root "${dir}" does not exist — skipping it.`);
            continue;
        }
        const missing = Object.entries(OVERLAY_GENERATE_SCRIPTS).filter(([lang]) => !existsSync(`${dir}/${lang}`));
        if (!missing.length) continue;
        console.warn(
            `[warn] "${dir}" is missing ${missing.map(([lang]) => lang).join(' and ')} — that part of the xplat Angular overlay was not scanned.\n` +
            '       Links in its generated topics are unchecked, and links or toc entries pointing at\n' +
            '       those topics may report a false "not found". Generate it first:\n' +
            missing.map(([, script]) => `         npm run ${script} --prefix docs/angular`).join('\n'),
        );
    }
    return dirs.filter(dir => existsSync(dir));
}

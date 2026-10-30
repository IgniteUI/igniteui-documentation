#!/usr/bin/env node
/**
 * One-shot cleanup for the old xplat → Angular copy step.
 *
 * The Angular site used to build by copying `docs/xplat/generated/Angular/{lang}`
 * over `docs/angular/src/content/{lang}`, which left generated topics sitting in
 * the tracked content tree. The site now overlays the generated tree in place, so
 * those copies are dead weight: they are shadowed by the xplat originals and can
 * only cause confusion (edits to them have no effect).
 *
 * This deletes, from the Angular tree, every file the generator also emits.
 *
 * Files that are *tracked* in git are never touched — a tracked file that xplat
 * also provides is a topic that was moved upstream without deleting the Angular
 * copy, and removing it is a reviewable change, not a cleanup side effect. Those
 * are reported at the end so they can be handled deliberately.
 *
 * Usage:
 *   node scripts/clean-synced.mjs            # report only
 *   node scripts/clean-synced.mjs --apply    # actually delete
 *   node scripts/clean-synced.mjs --apply --lang=jp
 */

import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
    ANGULAR_AUTHORED_ROOT,
    ANGULAR_OVERLAY_ROOT,
    OVERLAY_GENERATE_SCRIPTS,
} from '../../../scripts/lib/angular-content-roots.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../../..');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const langArg = args.find(a => a.startsWith('--lang='))?.split('=')[1];
const langs = langArg ? [langArg] : Object.keys(OVERLAY_GENERATE_SCRIPTS);

/**
 * Paths the old copy step never wrote, so nothing under them can be a leftover.
 * These stay Angular-owned, exactly as the overlay's excludes keep them.
 */
const NEVER_COPIED = /(^|\/)(grids|changelog)\/|(^|\/)toc\.(json|yml)$/;

/** Relative paths of every file the generator emits for `lang`. */
function generatedFiles(sourceDir) {
    return readdirSync(sourceDir, { recursive: true, withFileTypes: true })
        .filter(entry => entry.isFile())
        .map(entry => relative(sourceDir, join(entry.parentPath, entry.name)).replace(/\\/g, '/'));
}

/**
 * Repo-relative paths of every file git tracks under `dir`, lower-cased so a
 * case-only difference on a case-insensitive checkout still counts as tracked —
 * the safe side to err on, since this script deletes untracked files.
 *
 * Exits rather than answering when git fails: a git that cannot run would make
 * every file look untracked.
 */
function trackedFiles(dir) {
    const r = spawnSync('git', ['ls-files', '-z', '--', dir], { cwd: repoRoot, encoding: 'utf8' });
    if (r.error || r.status !== 0) {
        const reason = r.error?.message ?? ((r.stderr ?? '').trim() || `exit code ${r.status}`);
        console.error(`[clean-synced] git ls-files failed: ${reason}`);
        console.error('[clean-synced] Refusing to delete anything without a working git. Aborting.');
        process.exit(1);
    }
    return new Set(r.stdout.split('\0').filter(Boolean).map(p => p.toLowerCase()));
}

/** Removes directories left empty by the deletions, bottom-up. */
function pruneEmptyDirs(dir, stopAt) {
    let current = dir;
    while (current.startsWith(stopAt) && current !== stopAt) {
        if (!existsSync(current) || readdirSync(current).length > 0) return;
        rmSync(current, { recursive: true });
        current = dirname(current);
    }
}

// Fail fast: without git this script cannot tell a leftover copy from a
// tracked topic, and it must never delete the latter.
const tracked = trackedFiles(ANGULAR_AUTHORED_ROOT);

let totalRemoved = 0;
const trackedOverlaps = [];

for (const lang of langs) {
    const sourceDir = join(repoRoot, ANGULAR_OVERLAY_ROOT, lang);
    const targetRel = `${ANGULAR_AUTHORED_ROOT}/${lang}`;
    const targetDir = join(repoRoot, targetRel);

    if (!existsSync(sourceDir)) {
        const script = OVERLAY_GENERATE_SCRIPTS[lang];
        console.log(`[clean-synced] ${lang}: no generated output${script ? ` — run "npm run ${script}" first` : ''}. Skipping.`);
        continue;
    }
    if (!existsSync(targetDir)) continue;

    const stale = [];
    for (const rel of generatedFiles(sourceDir)) {
        if (NEVER_COPIED.test(rel)) continue;
        const candidate = join(targetDir, rel);
        if (!existsSync(candidate)) continue;
        if (tracked.has(`${targetRel}/${rel}`.toLowerCase())) {
            trackedOverlaps.push(`${targetRel}/${rel}`);
            continue;
        }
        stale.push(candidate);
    }

    console.log(`[clean-synced] ${lang}: ${stale.length} leftover generated file(s) in the Angular tree`);
    for (const file of stale) {
        console.log(`  ${apply ? 'removed ' : 'would remove '}${relative(repoRoot, file).replace(/\\/g, '/')}`);
        if (apply) {
            rmSync(file);
            pruneEmptyDirs(dirname(file), targetDir);
        }
    }
    totalRemoved += stale.length;
}

console.log(
    apply
        ? `\n[clean-synced] Removed ${totalRemoved} file(s).`
        : `\n[clean-synced] ${totalRemoved} file(s) would be removed. Re-run with --apply.`
);

if (trackedOverlaps.length) {
    console.log(
        `\n[clean-synced] ${trackedOverlaps.length} tracked Angular topic(s) are also provided by xplat.\n` +
        '  xplat wins, so these are shadowed and never served. Delete them in a\n' +
        '  reviewed commit, or move the change upstream into docs/xplat/src/content:'
    );
    for (const file of trackedOverlaps) console.log(`  ${file}`);
}

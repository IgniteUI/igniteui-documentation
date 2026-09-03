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

import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../../..');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const langArg = args.find(a => a.startsWith('--lang='))?.split('=')[1];
const langs = langArg ? [langArg] : ['en', 'jp'];

/**
 * Paths the old copy step never wrote, so nothing under them can be a leftover.
 * These stay Angular-owned, exactly as the overlay's excludes keep them.
 */
const NEVER_COPIED = /(^|\/)(grids|changelog)\/|(^|\/)toc\.(json|yml)$/;

/** Relative paths of every file the generator emits for `lang`. */
function generatedFiles(sourceDir) {
    const out = [];
    const visit = (dir) => {
        for (const entry of readdirSync(dir)) {
            const abs = join(dir, entry);
            if (statSync(abs).isDirectory()) visit(abs);
            else out.push(relative(sourceDir, abs).replace(/\\/g, '/'));
        }
    };
    visit(sourceDir);
    return out;
}

/**
 * Aborts the run. Anything git cannot answer confidently has to stop the
 * script *before* it deletes: a git that fails to run would otherwise make
 * every file look untracked, and this script deletes untracked files.
 */
function abortOnGitFailure(result, what) {
    if (result.error) {
        console.error(`[clean-synced] Could not run git (${what}): ${result.error.message}`);
        console.error('[clean-synced] Refusing to delete anything without a working git. Aborting.');
        process.exit(1);
    }
    const stderr = (result.stderr ?? '').toString().trim();
    console.error(`[clean-synced] git ${what} failed with exit code ${result.status}.`);
    if (stderr) console.error(`  ${stderr}`);
    console.error('[clean-synced] Refusing to delete anything without a trustworthy git. Aborting.');
    process.exit(1);
}

/** Verifies up front that git runs and that repoRoot really is a repository. */
function assertGitAvailable() {
    const r = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
        cwd: repoRoot,
        encoding: 'utf8',
    });
    if (r.error || r.status !== 0) abortOnGitFailure(r, 'rev-parse --is-inside-work-tree');
}

/**
 * True when git has the path in the index — those are never deleted here.
 *
 * `git ls-files --error-unmatch` exits 0 for a tracked path and 1 for an
 * untracked one. Every other outcome (git missing, fatal repo error, a signal)
 * is a failure to answer, not a "no", so it aborts rather than green-lighting
 * a delete.
 */
function isTracked(absPath) {
    const r = spawnSync('git', ['ls-files', '--error-unmatch', '--', absPath], {
        cwd: repoRoot,
        encoding: 'utf8',
    });
    if (r.error || r.status === null) abortOnGitFailure(r, `ls-files -- ${absPath}`);
    if (r.status === 0) return true;
    if (r.status === 1) return false;
    return abortOnGitFailure(r, `ls-files -- ${absPath}`);
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
assertGitAvailable();

let totalRemoved = 0;
const trackedOverlaps = [];

for (const lang of langs) {
    const sourceDir = join(repoRoot, `docs/xplat/generated/Angular/${lang}`);
    const targetDir = join(repoRoot, `docs/angular/src/content/${lang}`);

    if (!existsSync(sourceDir)) {
        console.log(`[clean-synced] ${lang}: no generated output — run "npm run xplat:generate" first. Skipping.`);
        continue;
    }
    if (!existsSync(targetDir)) continue;

    const stale = [];
    for (const rel of generatedFiles(sourceDir)) {
        if (NEVER_COPIED.test(rel)) continue;
        const candidate = join(targetDir, rel);
        if (!existsSync(candidate)) continue;
        if (isTracked(candidate)) {
            trackedOverlaps.push(`docs/angular/src/content/${lang}/${rel}`);
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

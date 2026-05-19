#!/usr/bin/env node
/**
 * Replay individual igniteui-docfx/vnext commits into this repo,
 * preserving per-commit git history.
 *
 * Usage:
 *   node scripts/merge-vnext-updates.mjs [ancestor] [remote/branch]
 *
 * Defaults:
 *   ancestor = LAST_SYNC (update after each successful run)
 *   remote   = igniteui-docfx/vnext
 *
 * Strategy: For each non-merge commit in ANCESTOR..THEIRS (oldest first):
 *   1. Find which content files it touches
 *   2. 3-way body-only merge each file (using that commit's parent as ancestor)
 *   3. Auto-resolve ApiLink conflicts: keep ours when theirs has raw {environment:...} links
 *   4. If conflict cannot be auto-resolved: restore original file, skip it, log it
 *   5. git commit only the clean files with the original author/date/message
 *   6. Verify HEAD advanced after commit — warn if not (e.g. IDE "Undo Last Commit" interference)
 *
 * No MDX transforms (.md link stripping, callout → DocsAside conversion) are applied
 * here. Those are local repo requirements that must land in their own commit so they
 * are not falsely attributed to the upstream author. After this script finishes, run:
 *
 *   node scripts/check-mdx-quality.mjs --fix
 *   node scripts/convert-callouts.mjs
 *   git add -A -- docs/angular/src/content/
 *   git commit -m "fix(sync): apply MDX transforms to new vnext content"
 *
 * After a successful run with no remaining conflicts, update LAST_SYNC below.
 *
 * grids_templates/* files are expanded to all 4 grid subdirectories.
 * Images and toc.yml are always skipped.
 *
 * Note: uses ~1 instead of ^ for parent refs — ^ is special in cmd.exe on Windows.
 */

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// ──────────────────────────────────────────────────────────────────────────────
// UPDATE THIS to the tip commit after each successful sync
const LAST_SYNC = 'cfef387355';
// ──────────────────────────────────────────────────────────────────────────────

const ANCESTOR = process.argv[2] || LAST_SYNC;
const THEIRS   = process.argv[3] || 'igniteui-docfx/vnext';
const CONTENT_DIR = 'docs/angular/src/content';
const GRID_DIRS   = ['grid', 'treegrid', 'hierarchicalgrid', 'pivotGrid'];

// ── Auto-resolve conflicts ────────────────────────────────────────────────────
// Keep "ours" when theirs still has a raw {environment:...} API link and ours
// already has an <ApiLink> component — this is not a transform, just preferring
// our existing MDX-compatible form over the upstream docfx form.

const RAW_API_RE = /\{environment:(dvApiBaseUrl|angularApiUrl)[^}]*\}/;

function autoResolveConflicts(content) {
  return content.replace(
    /<<<<<<< [^\n]+\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> [^\n]+\n/g,
    (match, ours, theirs) => {
      if (RAW_API_RE.test(theirs) && !RAW_API_RE.test(ours)) {
        return ours;
      }
      return match;
    }
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function splitFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  let fmCount = 0, splitIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---' && ++fmCount === 2) { splitIdx = i; break; }
  }
  if (splitIdx === -1) return { head: '', body: content };
  return {
    head: lines.slice(0, splitIdx + 1).join('\n') + '\n',
    body: lines.slice(splitIdx + 1).join('\n'),
  };
}

function getLocalPaths(docfxPath) {
  const paths = [];
  if (docfxPath.includes('grids_templates/')) {
    for (const gridDir of GRID_DIRS) {
      const local = `${CONTENT_DIR}/${docfxPath.replace('grids_templates/', `${gridDir}/`).replace(/\.md$/, '.mdx')}`;
      if (existsSync(local)) paths.push(local);
    }
  } else {
    const local = `${CONTENT_DIR}/${docfxPath.replace(/\.md$/, '.mdx')}`;
    if (existsSync(local)) paths.push(local);
  }
  return paths;
}

function gitContent(ref, path) {
  try { return execSync(`git show "${ref}:${path}"`, { encoding: 'utf8' }); }
  catch { return null; }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`Ancestor: ${ANCESTOR}`);
console.log(`Theirs:   ${THEIRS}\n`);

const commitList = execSync(
  `git log --no-merges --reverse --format="%H" ${ANCESTOR}..${THEIRS} -- en/ jp/`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

console.log(`Found ${commitList.length} commits to replay.\n`);

const tmpDir = mkdtempSync(join(tmpdir(), 'merge-vnext-'));
let totalCommits = 0, totalFiles = 0, skippedCommits = 0;
const allConflictFiles = [];

try {
  for (const sha of commitList) {
    const authorName  = execSync(`git log -1 --format="%aN" ${sha}`, { encoding: 'utf8' }).trim();
    const authorEmail = execSync(`git log -1 --format="%aE" ${sha}`, { encoding: 'utf8' }).trim();
    const authorDate  = execSync(`git log -1 --format="%aI" ${sha}`, { encoding: 'utf8' }).trim();
    const commitDate  = execSync(`git log -1 --format="%cI" ${sha}`, { encoding: 'utf8' }).trim();
    const message     = execSync(`git log -1 --format="%B" ${sha}`, { encoding: 'utf8' }).trim();

    const changedRaw = execSync(
      `git diff --name-only ${sha}~1..${sha} -- en/ jp/`,
      { encoding: 'utf8' }
    ).trim().split('\n').filter(f => f && !f.includes('/images/') && !f.endsWith('toc.yml'));

    if (changedRaw.length === 0) { skippedCommits++; continue; }

    const shortSha = sha.slice(0, 10);
    console.log(`\n[${shortSha}] ${message.split('\n')[0].slice(0, 72)}`);

    const cleanPaths = [], conflictedPaths = [];

    for (const docfxFile of changedRaw) {
      const localPaths = getLocalPaths(docfxFile);
      if (localPaths.length === 0) continue;

      const ancestorContent = gitContent(`${sha}~1`, docfxFile);
      const theirsContent   = gitContent(sha, docfxFile);
      if (!ancestorContent || !theirsContent) continue;

      const ancestorBody = splitFrontmatter(ancestorContent).body;
      const theirsBody   = splitFrontmatter(theirsContent).body;
      if (ancestorBody === theirsBody) continue;

      for (const localPath of localPaths) {
        const oursContent = readFileSync(localPath, 'utf8');
        const { head: oursHead, body: oursBody } = splitFrontmatter(oursContent);

        const ancestorFile = join(tmpDir, 'ancestor.md');
        const theirsFile   = join(tmpDir, 'theirs.md');
        const oursFile     = join(tmpDir, 'ours.mdx');

        writeFileSync(ancestorFile, ancestorBody);
        writeFileSync(theirsFile, theirsBody);
        writeFileSync(oursFile, oursBody);

        const result = spawnSync('git', [
          'merge-file',
          '-L', `ours (${localPath})`,
          '-L', `ancestor (${sha}~1:${docfxFile})`,
          '-L', `theirs (${sha}:${docfxFile})`,
          oursFile, ancestorFile, theirsFile,
        ], { encoding: 'utf8' });

        let mergedBody = readFileSync(oursFile, 'utf8');
        let hasConflict = result.status > 0;

        if (hasConflict) {
          mergedBody = autoResolveConflicts(mergedBody);
          hasConflict = mergedBody.includes('<<<<<<<');
        }

        if (hasConflict) {
          process.stdout.write(`  ✗ ${localPath} (conflict — skipped, needs manual fix)\n`);
          conflictedPaths.push(localPath);
          allConflictFiles.push({ sha: shortSha, path: localPath });
        } else if (mergedBody !== oursBody) {
          writeFileSync(localPath, oursHead + mergedBody);
          cleanPaths.push(localPath);
          process.stdout.write(`  ${result.status === 0 ? '✓' : '~'} ${localPath}\n`);
        }
      }
    }

    if (cleanPaths.length === 0) {
      process.stdout.write(`  (no clean changes — skipping commit)\n`);
      skippedCommits++;
      continue;
    }

    for (const p of cleanPaths) {
      execSync(`git add -- "${p}"`, { encoding: 'utf8' });
    }

    const env = {
      ...process.env,
      GIT_AUTHOR_NAME:    authorName,
      GIT_AUTHOR_EMAIL:   authorEmail,
      GIT_AUTHOR_DATE:    authorDate,
      GIT_COMMITTER_DATE: commitDate,
    };

    const msgFile = join(tmpDir, 'COMMIT_MSG');
    const trailer = conflictedPaths.length > 0
      ? `\n\nNote: ${conflictedPaths.length} file(s) had unresolvable conflicts and were skipped.`
      : '';
    writeFileSync(msgFile, `${message}\n\n(cherry-picked from igniteui-docfx@${sha})${trailer}`);

    const headBefore = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    spawnSync('git', ['commit', '-F', msgFile], { env, stdio: 'inherit' });
    const headAfter = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

    if (headBefore === headAfter) {
      process.stdout.write(`  ! WARNING: HEAD did not advance — check for IDE interference (e.g. "Undo Last Commit").\n`);
    } else {
      totalCommits++;
      totalFiles += cleanPaths.length;
      process.stdout.write(`  → committed as ${headAfter.slice(0, 10)} (${cleanPaths.length} file(s))\n`);
    }
  }
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Done.`);
console.log(`  Commits created:  ${totalCommits}`);
console.log(`  Files updated:    ${totalFiles}`);
console.log(`  Skipped commits:  ${skippedCommits}`);
console.log(`  Unresolved conflicts: ${allConflictFiles.length}`);

if (allConflictFiles.length > 0) {
  console.log(`\nFiles that need manual resolution (not committed):`);
  for (const { sha, path } of allConflictFiles) {
    console.log(`  [${sha}] ${path}`);
  }
}

if (allConflictFiles.length === 0 && totalCommits > 0) {
  const tip = execSync(`git rev-parse ${THEIRS}`, { encoding: 'utf8' }).trim().slice(0, 10);
  console.log(`\nAll clean. Update LAST_SYNC in this script to: ${tip}`);
}

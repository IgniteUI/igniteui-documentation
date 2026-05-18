#!/usr/bin/env node
/**
 * 3-way merge of docfx vnext body-only updates into local .mdx files.
 *
 * Usage:
 *   node scripts/merge-vnext-updates.mjs [ancestor] [theirs]
 *
 * Defaults:
 *   ancestor = the last sync point (update LAST_SYNC below after each sync)
 *   theirs   = igniteui-docfx/vnext
 *
 * Strategy: Merge only the BODY (content after frontmatter `---`), because
 * our frontmatter has been structurally transformed (underscore removal, field
 * deletion) and always conflicts with the docfx ancestor. Body content shares
 * the same structure between ancestor/ours so merges cleanly.
 *
 * For each modified file in docfx (between ANCESTOR and THEIRS):
 *   1. Extract body from ancestor (after second ---)
 *   2. Extract body from theirs (after second ---)
 *   3. Extract body from ours (after second --- in .mdx)
 *   4. Run `git merge-file` on body only
 *   5. If clean, splice merged body back into our file (preserving our frontmatter + imports)
 *
 * grids_templates/* files are expanded to all 4 grid subdirectories.
 * Images and toc.yml are skipped.
 *
 * After running this script, run convert-callouts.mjs to handle any new
 * >[!NOTE] callouts or <!-- schema: --> comments introduced by the merge.
 */

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// ──────────────────────────────────────────────────────────────────────────────
// UPDATE THIS after each successful sync to docfx vnext
const LAST_SYNC = 'f8c877bc9e';
// ──────────────────────────────────────────────────────────────────────────────

const ANCESTOR = process.argv[2] || LAST_SYNC;
const THEIRS = process.argv[3] || 'igniteui-docfx/vnext';
const CONTENT_DIR = 'docs/angular/src/content';
const GRID_DIRS = ['grid', 'treegrid', 'hierarchicalgrid', 'pivotGrid'];

// Get list of modified files
console.log(`Ancestor: ${ANCESTOR}`);
console.log(`Theirs:   ${THEIRS}\n`);

const modifiedRaw = execSync(
  `git diff --diff-filter=M --name-only ${ANCESTOR}..${THEIRS} -- en/ jp/`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

// Filter out images and toc.yml
const modified = modifiedRaw.filter(f =>
  !f.includes('/images/') && !f.endsWith('toc.yml')
);

console.log(`Found ${modified.length} modified content files to merge.\n`);

/**
 * Split content into { head, body } at the closing frontmatter ---.
 * head = everything up to and including the second "---\n" (or "---\r\n")
 * body = everything after
 */
function splitFrontmatter(content) {
  // Find the second occurrence of --- on its own line
  const lines = content.split(/\r?\n/);
  let fmCount = 0;
  let splitIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      fmCount++;
      if (fmCount === 2) {
        splitIdx = i;
        break;
      }
    }
  }
  if (splitIdx === -1) {
    // No frontmatter found - treat entire content as body
    return { head: '', body: content };
  }
  // head includes the closing --- line
  const head = lines.slice(0, splitIdx + 1).join('\n') + '\n';
  const body = lines.slice(splitIdx + 1).join('\n');
  return { head, body };
}

// Expand grids_templates/* to actual grid directories
function getLocalPaths(docfxPath) {
  const paths = [];
  if (docfxPath.includes('grids_templates/')) {
    for (const gridDir of GRID_DIRS) {
      const expanded = docfxPath.replace('grids_templates/', `${gridDir}/`);
      const localPath = `${CONTENT_DIR}/${expanded.replace(/\.md$/, '.mdx')}`;
      if (existsSync(localPath)) {
        paths.push(localPath);
      }
    }
  } else {
    const localPath = `${CONTENT_DIR}/${docfxPath.replace(/\.md$/, '.mdx')}`;
    if (existsSync(localPath)) {
      paths.push(localPath);
    }
  }
  return paths;
}

function getGitContent(ref, path) {
  try {
    return execSync(`git show ${ref}:${path}`, { encoding: 'utf8' });
  } catch {
    return null;
  }
}

// Stats
let merged = 0;
let conflicts = 0;
let skipped = 0;
let noChange = 0;
const conflictFiles = [];
const failedFiles = [];

// Create temp dir for merge operations
const tmpDir = mkdtempSync(join(tmpdir(), 'merge-vnext-'));

try {
  for (const docfxFile of modified) {
    const localPaths = getLocalPaths(docfxFile);
    if (localPaths.length === 0) {
      skipped++;
      continue;
    }

    // Get ancestor and theirs content
    const ancestorContent = getGitContent(ANCESTOR, docfxFile);
    const theirsContent = getGitContent(THEIRS, docfxFile);

    if (!ancestorContent || !theirsContent) {
      skipped++;
      continue;
    }

    // Extract bodies
    const ancestorBody = splitFrontmatter(ancestorContent).body;
    const theirsBody = splitFrontmatter(theirsContent).body;

    // Quick check: if ancestor body === theirs body, skip (no body change)
    if (ancestorBody === theirsBody) {
      skipped++;
      continue;
    }

    for (const localPath of localPaths) {
      const oursContent = readFileSync(localPath, 'utf8');
      const { head: oursHead, body: oursBody } = splitFrontmatter(oursContent);

      // Write temp files for git merge-file (body only)
      const ancestorFile = join(tmpDir, 'ancestor.md');
      const theirsFile = join(tmpDir, 'theirs.md');
      const oursFile = join(tmpDir, 'ours.mdx');

      writeFileSync(ancestorFile, ancestorBody);
      writeFileSync(theirsFile, theirsBody);
      writeFileSync(oursFile, oursBody);

      // git merge-file modifies oursFile in place
      const result = spawnSync('git', [
        'merge-file',
        '-L', `ours (${localPath})`,
        '-L', `ancestor (${ANCESTOR}:${docfxFile})`,
        '-L', `theirs (${THEIRS}:${docfxFile})`,
        oursFile, ancestorFile, theirsFile
      ], { encoding: 'utf8' });

      if (result.status === 0) {
        // Clean merge - splice body back
        const mergedBody = readFileSync(oursFile, 'utf8');
        if (mergedBody !== oursBody) {
          const finalContent = oursHead + mergedBody;
          writeFileSync(localPath, finalContent);
          merged++;
          process.stdout.write(`  ✓ ${localPath}\n`);
        } else {
          noChange++;
        }
      } else if (result.status > 0) {
        // Conflicts in body - write back with conflict markers
        const mergedBody = readFileSync(oursFile, 'utf8');
        const finalContent = oursHead + mergedBody;
        writeFileSync(localPath, finalContent);
        conflicts++;
        conflictFiles.push(localPath);
        process.stdout.write(`  ✗ ${localPath} (${result.status} conflict(s))\n`);
      } else {
        failedFiles.push(localPath);
        process.stdout.write(`  ! ${localPath} (merge-file error)\n`);
      }
    }
  }
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Results:`);
console.log(`  Clean merges (with changes):  ${merged}`);
console.log(`  No effective change:          ${noChange}`);
console.log(`  Conflicts:                    ${conflicts}`);
console.log(`  Skipped (no local file):      ${skipped}`);
console.log(`  Errors:                       ${failedFiles.length}`);

if (conflictFiles.length > 0) {
  console.log(`\nFiles with conflicts (need manual resolution):`);
  for (const f of conflictFiles) {
    console.log(`  ${f}`);
  }
}

if (failedFiles.length > 0) {
  console.log(`\nFailed files:`);
  for (const f of failedFiles) {
    console.log(`  ${f}`);
  }
}

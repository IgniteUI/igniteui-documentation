#!/usr/bin/env node
/**
 * rename-jquery-topics.mjs
 *
 * Renames jQuery docs files and folders, then updates all references.
 *
 * Usage:
 *   node scripts/rename-jquery-topics.mjs              # dry-run (preview)
 *   node scripts/rename-jquery-topics.mjs --apply      # execute changes
 *   node scripts/rename-jquery-topics.mjs --check-refs # report .md cross-refs
 *
 * RENAME RULES — files:
 *   1. Strip leading ~
 *   2. Strip leading NNN_ numeric prefix
 *      UNLESS in a changelog/revision-history directory → keep as NNN-
 *   3. Replace underscores and spaces with hyphens
 *   4. Lowercase the whole name
 *   5. Collapse runs of hyphens; trim leading/trailing hyphens
 *
 * RENAME RULES — folders:
 *   1. Strip leading NNN_ or NNN- numeric prefix
 *   2. Replace underscores and spaces with hyphens
 *   3. Lowercase
 *   4. Collapse/trim hyphens
 *
 * Uses fs.renameSync (not git mv) to avoid Windows interactive-prompt issues.
 * After renaming, runs `git add -A` so git tracks all moves by content.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// --topics=<relative-path>  e.g. --topics=docs/jquery/src/content/en/topics
// --toc=<relative-path>     e.g. --toc=docs/jquery/toc.json
const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const tocArg    = process.argv.find(a => a.startsWith('--toc='));

const TOPICS   = topicsArg
  ? path.resolve(ROOT, topicsArg.slice('--topics='.length))
  : path.join(ROOT, 'docs/jquery/src/content/en/topics');

const TOC_JSON = tocArg
  ? path.resolve(ROOT, tocArg.slice('--toc='.length))
  : path.join(ROOT, 'docs/jquery/toc.json');

const APPLY      = process.argv.includes('--apply');
const CHECK_REFS = process.argv.includes('--check-refs');

console.log(`\n=== rename-topics  [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===`);
console.log(`  topics : ${TOPICS}`);
console.log(`  toc    : ${TOC_JSON}\n`);

// ─── Naming helpers ───────────────────────────────────────────────────────────

/**
 * Returns true when files in this directory should keep their numeric prefix
 * (revision history / changelog folders).
 * @param {string} dirName  raw folder name (not yet cleaned)
 */
function isChangelogDir(dirName) {
  const n = dirName.toLowerCase();
  return (
    n.includes('revision') ||
    n.includes('changelog') ||
    n.includes('breaking') ||
    n.includes("what's-new") ||
    n.includes('whats-new') ||
    n.includes("what's_new") ||
    n.includes('whats_new')
  );
}

/**
 * Clean a file stem (no extension).
 * @param {string} stem          original stem
 * @param {string} parentFolder  raw name of the immediate parent directory
 */
function cleanFileStem(stem, parentFolder) {
  let s = stem;
  // 1. Strip leading ~
  s = s.replace(/^~/, '');
  // 2. Numeric prefix: keep (as NNN-) for changelog dirs, strip otherwise
  if (isChangelogDir(parentFolder)) {
    s = s.replace(/^(\d+)[_-]/, '$1-');
  } else {
    s = s.replace(/^\d+[_-]/, '');
  }
  // 3. Replace underscores and spaces with hyphens
  s = s.replace(/[_ ]+/g, '-');
  // 4. Lowercase
  s = s.toLowerCase();
  // 5. Normalise hyphens
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  return s;
}

/** Clean a folder name. */
function cleanFolderName(name) {
  let s = name;
  // 1. Strip leading numeric prefix NNN_ or NNN-
  s = s.replace(/^\d+[_-]/, '');
  // 2. Underscores and spaces → hyphens
  s = s.replace(/[_ ]+/g, '-');
  // 3. Lowercase
  s = s.toLowerCase();
  // 4. Normalise hyphens
  s = s.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  return s;
}

/**
 * Apply rename rules to a relative href/path (as stored in toc.json or
 * a relative markdown link).  Handles both files and folder segments.
 */
function transformHref(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  return parts
    .map((part, i) => {
      const isLast = i === parts.length - 1;
      if (!isLast) {
        return cleanFolderName(part);
      }
      // Last segment — may be a file with extension
      const dotIdx = part.lastIndexOf('.');
      if (dotIdx <= 0) {
        // No extension or dot-only prefix — treat as folder
        return cleanFolderName(part);
      }
      const ext        = part.slice(dotIdx);   // e.g. ".mdx"
      const stem       = part.slice(0, dotIdx);
      const parentName = i > 0 ? parts[i - 1] : '';
      return cleanFileStem(stem, parentName) + ext;
    })
    .join('/');
}

// ─── Phase 1: Collect renames ─────────────────────────────────────────────────

console.log('Phase 1: Building rename mapping…\n');

/** @type {{ from: string; to: string }[]} — deepest-first order */
const folderRenames = [];
/** @type {{ from: string; to: string }[]} */
const fileRenames = [];

function collectRenames(dir) {
  const entries    = fs.readdirSync(dir, { withFileTypes: true });
  const parentName = path.basename(dir); // raw name of this directory

  // Recurse into subdirectories first (deepest-first)
  for (const e of entries.filter(e => e.isDirectory())) {
    collectRenames(path.join(dir, e.name));
  }

  // Files in this directory
  for (const e of entries.filter(e => e.isFile())) {
    if (!e.name.endsWith('.mdx') && !e.name.endsWith('.md')) continue;
    const ext     = path.extname(e.name);
    const stem    = e.name.slice(0, -ext.length);
    const newStem = cleanFileStem(stem, parentName);
    const newName = newStem + ext;
    if (newName !== e.name) {
      fileRenames.push({ from: path.join(dir, e.name), to: path.join(dir, newName) });
    }
  }

  // Queue rename of this directory itself (skip TOPICS root)
  if (dir !== TOPICS) {
    const parent  = path.dirname(dir);
    const oldName = path.basename(dir);
    const newName = cleanFolderName(oldName);
    if (newName !== oldName) {
      folderRenames.push({ from: dir, to: path.join(parent, newName) });
    }
  }
}

collectRenames(TOPICS);

// ── Collision check ───────────────────────────────────────────────────────────

let collisions = 0;

const seenFolders = new Map(); // lower(newPath) → oldPath
for (const r of folderRenames) {
  const key = r.to.toLowerCase();
  if (seenFolders.has(key) && seenFolders.get(key).toLowerCase() !== r.from.toLowerCase()) {
    console.log(`  [COLLISION folder] ${path.relative(TOPICS, r.from)}  →  ${path.relative(TOPICS, r.to)}`);
    collisions++;
  }
  seenFolders.set(key, r.from);
}

const seenFiles = new Map();
for (const r of fileRenames) {
  const key = r.to.toLowerCase();
  if (seenFiles.has(key) && seenFiles.get(key).toLowerCase() !== r.from.toLowerCase()) {
    console.log(`  [COLLISION file] ${path.relative(TOPICS, r.from)}  →  ${path.relative(TOPICS, r.to)}`);
    collisions++;
  }
  seenFiles.set(key, r.from);
}

console.log(`  Folders to rename : ${folderRenames.length}  (${collisions} collision(s))`);
console.log(`  Files  to rename  : ${fileRenames.length}\n`);

if (!APPLY) {
  const MAX = 20;
  console.log(`--- Folder renames preview (first ${MAX}) ---`);
  for (const r of folderRenames.slice(0, MAX)) {
    console.log(`  ${path.relative(TOPICS, r.from)}  →  ${path.relative(TOPICS, r.to)}`);
  }
  console.log(`\n--- File renames preview (first ${MAX}) ---`);
  for (const r of fileRenames.slice(0, MAX)) {
    console.log(`  ${path.relative(TOPICS, r.from)}  →  ${path.relative(TOPICS, r.to)}`);
  }
  console.log('');
}

// ─── Phase 2 (optional): Check cross-references ───────────────────────────────

if (CHECK_REFS) {
  console.log('\nPhase 2: Checking .mdx files for links to same-name .md files…\n');

  function collectMdx(dir) {
    const out = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...collectMdx(full));
      else if (e.name.endsWith('.mdx')) out.push(full);
    }
    return out;
  }

  const allMdx = collectMdx(TOPICS);
  // Set of abs paths without extension (lowercased) for all .mdx files
  const mdxSet = new Set(allMdx.map(f => f.slice(0, -4).toLowerCase()));
  const linkRe = /\[(?:[^\]]*)\]\(([^)#?\s]+\.md)\)/gi;
  let   found  = 0;

  for (const mdxFile of allMdx) {
    const body = fs.readFileSync(mdxFile, 'utf8');
    let m;
    linkRe.lastIndex = 0;
    while ((m = linkRe.exec(body)) !== null) {
      const linkHref  = m[1];
      if (linkHref.startsWith('http') || linkHref.startsWith('/')) continue;
      const targetAbs = path.resolve(path.dirname(mdxFile), linkHref);
      const stemAbs   = targetAbs.slice(0, -3).toLowerCase(); // strip .md
      if (mdxSet.has(stemAbs)) {
        console.log(
          `  [MDX→MD] ${path.relative(TOPICS, mdxFile)}\n` +
          `            links to "${linkHref}"  (an .mdx with the same stem exists)`
        );
        found++;
      }
    }
  }

  console.log(found === 0
    ? '  No MDX→MD self-reference links found.\n'
    : `\n  Total: ${found} link(s)\n`);
}

// ─── Phase 3: Apply filesystem renames ───────────────────────────────────────

if (APPLY) {
  // ── 3a: files ──────────────────────────────────────────────────────────────
  console.log('\nPhase 3a: Renaming files…\n');
  let done = 0, skipped = 0;

  for (const { from, to } of fileRenames) {
    if (!fs.existsSync(from)) {
      console.log(`  [SKIP] gone: ${path.relative(TOPICS, from)}`);
      skipped++;
      continue;
    }
    // On a case-insensitive FS existsSync('Foo.mdx') returns true for 'foo.mdx'.
    // Only skip if the target is genuinely a *different* file that already exists.
    if (from.toLowerCase() !== to.toLowerCase() && fs.existsSync(to)) {
      console.log(`  [SKIP] target exists: ${path.relative(TOPICS, to)}`);
      skipped++;
      continue;
    }
    try {
      if (from.toLowerCase() === to.toLowerCase()) {
        // Case-only change on Windows: use a temp name to force the FS update
        const tmp = to + '__tmp__';
        fs.renameSync(from, tmp);
        fs.renameSync(tmp, to);
      } else {
        fs.renameSync(from, to);
      }
      done++;
    } catch (err) {
      console.error(`  [ERROR] ${path.relative(TOPICS, from)}: ${err.message}`);
    }
  }
  console.log(`  Files:   done=${done}, skipped=${skipped}\n`);

  // ── 3b: folders (deepest first) ────────────────────────────────────────────
  console.log('Phase 3b: Renaming folders (deepest first)…\n');
  done = 0; skipped = 0;

  /** Returns true if a directory exists and has no files anywhere inside it. */
  function isDirEmpty(dirPath) {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const e of entries) {
        if (e.isFile()) return false;
        if (e.isDirectory() && !isDirEmpty(path.join(dirPath, e.name))) return false;
      }
      return true;
    } catch { return false; }
  }

  /** Recursively remove an empty directory tree. */
  function removeEmptyDir(dirPath) {
    try { fs.rmdirSync(dirPath, { recursive: true }); } catch { /* ignore */ }
  }

  /**
   * Rename a directory.  Uses robocopy /E /MOVE on Windows to work around
   * EPERM failures caused by VS Code file-watcher holding directory handles.
   */
  function renameDir(from, to) {
    if (process.platform === 'win32') {
      // robocopy exits 0-7 for success, >=8 for error
      try {
        execSync(
          `robocopy "${from}" "${to}" /E /MOVE /NFL /NDL /NJH /NJS /NC /NS /NP`,
          { cwd: ROOT, stdio: 'pipe', shell: 'cmd.exe' }
        );
      } catch (roboErr) {
        // robocopy exit codes 1-7 mean "success with some files copied/skipped"
        const code = roboErr.status;
        if (code === undefined || code >= 8) throw roboErr;
      }
      // robocopy /MOVE removes files but may leave empty source dirs — clean up
      if (fs.existsSync(from)) {
        fs.rmSync(from, { recursive: true, force: true });
      }
    } else {
      fs.renameSync(from, to);
    }
  }

  for (const { from, to } of folderRenames) {
    if (!fs.existsSync(from)) {
      console.log(`  [SKIP] gone: ${path.relative(TOPICS, from)}`);
      skipped++;
      continue;
    }
    if (from.toLowerCase() !== to.toLowerCase() && fs.existsSync(to)) {
      // Target exists — remove it only if it is empty (empty placeholder dir)
      if (isDirEmpty(to)) {
        console.log(`  [REMOVE empty] ${path.relative(TOPICS, to)}`);
        removeEmptyDir(to);
      } else {
        console.log(`  [SKIP] target exists (non-empty): ${path.relative(TOPICS, to)}`);
        skipped++;
        continue;
      }
    }
    try {
      if (from.toLowerCase() === to.toLowerCase()) {
        // Case-only change: move via a temp name
        const tmp = to + '__tmp__';
        renameDir(from, tmp);
        renameDir(tmp, to);
      } else {
        renameDir(from, to);
      }
      done++;
    } catch (err) {
      console.error(`  [ERROR] ${path.relative(TOPICS, from)}: ${err.message}`);
    }
  }
  console.log(`  Folders: done=${done}, skipped=${skipped}\n`);

  // ── 3c: git add -A ─────────────────────────────────────────────────────────
  console.log('Phase 3c: Staging with git add -A…');
  try {
    execSync('git add -A -- docs/jquery/src/content/en/topics/', { cwd: ROOT, stdio: 'inherit' });
    console.log('  git add -A complete.\n');
  } catch (err) {
    console.error(`  [ERROR] git add: ${err.message}`);
  }
}

// ─── Phase 4: Update toc.json ─────────────────────────────────────────────────

console.log('Phase 4: Updating toc.json…');

const toc      = JSON.parse(fs.readFileSync(TOC_JSON, 'utf8'));
let   tocCount = 0;

function updateTocNode(node) {
  if (node.href) {
    const updated = transformHref(node.href);
    if (updated !== node.href) { node.href = updated; tocCount++; }
  }
  if (Array.isArray(node.items)) node.items.forEach(updateTocNode);
}
toc.forEach(updateTocNode);

console.log(`  ${tocCount} href(s) ${APPLY ? 'updated' : 'would be updated'}.`);
if (APPLY && tocCount > 0) {
  fs.writeFileSync(TOC_JSON, JSON.stringify(toc, null, 2) + '\n', 'utf8');
  console.log('  toc.json written.\n');
} else {
  console.log('');
}

// ─── Phase 5: Update inline links in .mdx / .md files ────────────────────────

console.log('Phase 5: Updating inline markdown links…');

function collectAllMd(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collectAllMd(full));
    else if (e.name.endsWith('.mdx') || e.name.endsWith('.md')) out.push(full);
  }
  return out;
}

// After --apply the files have been renamed, so we scan from the new locations.
// In dry-run we scan from the original locations (files not yet moved).
const mdFilesForScan = collectAllMd(TOPICS);
const LINK_RE        = /(\[(?:[^\]]*)\]\()([^)#?\s]+\.mdx?)(\s+"[^"]*")?\)/gi;
let   totalLinks     = 0;
let   totalModified  = 0;

for (const filePath of mdFilesForScan) {
  const original = fs.readFileSync(filePath, 'utf8');
  let   changed  = false;

  const updated = original.replace(LINK_RE, (_match, open, href, title) => {
    if (href.startsWith('http') || href.startsWith('/')) return _match;
    const newHref = transformHref(href);
    if (newHref !== href) {
      changed = true;
      totalLinks++;
      return open + newHref + (title ?? '') + ')';
    }
    return _match;
  });

  if (changed) {
    totalModified++;
    if (APPLY) {
      fs.writeFileSync(filePath, updated, 'utf8');
    } else {
      console.log(`  ${path.relative(TOPICS, filePath)}`);
    }
  }
}

console.log(`  ${totalLinks} link(s) in ${totalModified} file(s) ${APPLY ? 'updated' : 'would be updated'}.\n`);

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log(`=== Done [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===`);
if (!APPLY) console.log('\nRun with --apply to execute changes.');
console.log('');

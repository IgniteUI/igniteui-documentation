#!/usr/bin/env node
/**
 * Generates the `.claude/skills/` pointer files from the canonical SKILL.md files.
 *
 * Claude Code discovers project skills only from `.claude/skills/`, so every canonical skill needs
 * a pointer there. A pointer carries the canonical `name` and `description` verbatim — that pair is
 * the triggering surface and must match byte for byte — plus a body that redirects to the canonical
 * file. Pointers hold no rules.
 *
 *   node scripts/sync-agent-skills.mjs            # write pointers
 *   node scripts/sync-agent-skills.mjs --check    # verify only, non-zero exit on drift
 *
 * See `.agents/README.md` for why the canonical skills live where they do.
 */

import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POINTER_DIR = path.join(ROOT, '.claude', 'skills');

/** Directories holding canonical skills, in the order they are documented in `.agents/README.md`. */
const CANONICAL_DIRS = [
  path.join(ROOT, '.agents', 'skills'),
  path.join(ROOT, '.github', 'skills'),
];

const check = process.argv.includes('--check');

/** Agent Skills spec limits: https://agentskills.io/specification */
const NAME_MAX = 64;
const DESCRIPTION_MAX = 1024;
const FILE_MAX_LINES = 500;
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/**
 * A tag-shaped run in a description. Frontmatter is injected into the agent's system prompt and the
 * pointer copies it verbatim into a second file, so a stray tag is a prompt-injection surface in two
 * places. Requires a letter or a closing slash after `<` so prose like `<500 lines` is not a match.
 */
const DESCRIPTION_TAG_PATTERN = /<\/?[a-zA-Z][^>]*>/;
/** The one license every skill here declares; all of them are first-party internal tooling. */
const REQUIRED_LICENSE = 'MIT';

/**
 * A frontmatter field's value as the consumer sees it. A folded block (`description: >-`) joins its
 * lines with single spaces, so the raw text would both overcount the length and hide markers that
 * straddle a line break.
 */
function fieldValue(field) {
  const lines = field.split('\n');
  const first = lines[0].replace(/^[^:]+:[ \t]*/, '').trim();
  if (first && first !== '>-' && first !== '>' && first !== '|') {
    return first.replace(/^(['"])(.*)\1$/, '$2');
  }
  return lines
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ');
}

/**
 * Reads a file, returning null when it is not there. Checking first and reading after would be a
 * race: the file can go away between the two calls.
 */
async function readIfPresent(file) {
  try {
    return await readFile(file, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

/** Lists a directory, returning [] when it is not there. Same reasoning as readIfPresent. */
async function readdirIfPresent(dir) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

/**
 * Splits a SKILL.md into its raw YAML frontmatter block and the rest. The closing `---` may end the
 * file: a skill with frontmatter and no body is the spec's own minimal example, and requiring a
 * newline after it rejected that file as having no frontmatter at all — a misleading message on a
 * file that plainly has some.
 */
function splitFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  return match ? { frontmatter: match[1] } : null;
}

/**
 * Extracts a top-level scalar or folded-block field from raw frontmatter, preserving the author's
 * exact formatting. Parsing with a YAML library and re-emitting would reflow the folded
 * `description` blocks and break the byte-match the trigger surface depends on.
 */
function extractField(frontmatter, field) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((l) => new RegExp(`^${field}:`).test(l));
  if (start === -1) return null;

  const collected = [lines[start]];
  for (let i = start + 1; i < lines.length; i++) {
    // A new top-level key ends the field; indented lines continue it.
    if (/^\S/.test(lines[i])) break;
    collected.push(lines[i]);
  }
  while (collected.length > 1 && collected.at(-1).trim() === '') collected.pop();
  return collected.join('\n');
}

/** Directories a SKILL.md may legitimately live in: the two canonical roots, plus the pointers. */
const ALLOWED_SKILL_ROOTS = ['.agents/skills', '.github/skills', '.claude/skills'];

/**
 * Not worth walking: build output and vendored trees, none of which hold tracked files. Only add a
 * directory here if nothing in it is tracked — a tracked directory holds authored, reviewed content,
 * and skipping one would carve a hole in a scan whose whole purpose is to leave nowhere to hide.
 * `reports/` was here and is tracked, so it is scanned.
 */
const SCAN_SKIP = new Set(['node_modules', '.git', 'dist', '.astro', 'coverage']);

/**
 * Every SKILL.md in the repo, so one added in the wrong place fails loudly instead of being
 * invisible. Scanning only the canonical roots would mean a skill dropped into `.codex/skills/`,
 * a root `skills/`, or a resurrected `.ai/` passed silently.
 */
async function findStraySkills() {
  const stray = [];
  async function walk(dir, rel) {
    for (const entry of await readdirIfPresent(dir)) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (SCAN_SKIP.has(entry.name)) continue;
        await walk(path.join(dir, entry.name), childRel);
      } else if (entry.name === 'SKILL.md') {
        // Exactly `<root>/<name>/SKILL.md`. A prefix match would also accept a deeper path such as
        // `.agents/skills/<name>/references/SKILL.md`, which collectSkills never looks at — so an
        // unregistered skill would pass both checks.
        const placed = ALLOWED_SKILL_ROOTS.some(
          (root) =>
            childRel.startsWith(`${root}/`) &&
            childRel.slice(root.length + 1).split('/').length === 2,
        );
        if (!placed) stray.push(childRel);
      }
    }
  }
  await walk(ROOT, '');
  return stray.sort();
}

/** The value of a single-line scalar field, with surrounding quotes removed. */
function scalarValue(field) {
  const match = /^[^:]+:[ \t]*(.*)$/.exec(field.split('\n')[0]);
  if (!match) return null;
  return match[1].trim().replace(/^(['"])(.*)\1$/, '$2');
}

/** Every canonical skill on disk, as { name, relDir, text }. */
async function collectSkills() {
  const found = [];
  for (const dir of CANONICAL_DIRS) {
    for (const entry of await readdirIfPresent(dir)) {
      if (!entry.isDirectory()) continue;
      const text = await readIfPresent(path.join(dir, entry.name, 'SKILL.md'));
      if (text === null) continue;
      found.push({
        name: entry.name,
        relDir: path.relative(ROOT, path.join(dir, entry.name)).split(path.sep).join('/'),
        text,
      });
    }
  }
  return found.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * The line that marks a pointer as ours. It is what tells the reaper below that a directory under
 * `.claude/skills/` was generated and may be removed, so the two must stay in step — hence one
 * constant rather than the same sentence written twice.
 */
const POINTER_MARKER = 'Generated by `scripts/sync-agent-skills.mjs`. Do not edit.';

function renderPointer({ name, relDir }, nameField, descriptionField) {
  // `..` three times: .claude/skills/<name>/SKILL.md -> repo root.
  const canonical = `../../../${relDir}/SKILL.md`;
  return `---
${nameField}
${descriptionField}
---

# ${name} (pointer)

${POINTER_MARKER}

Claude Code discovers project skills only from \`.claude/skills/\`, so this file exposes the skill
there. The source of truth is [\`${relDir}/SKILL.md\`](${canonical}) — read it and follow it as your
complete instructions before taking any action.

Resolve every reference path in the canonical skill relative to its own directory, \`${relDir}/\`.

This pointer carries no rules. If it ever disagrees with the canonical skill, the canonical skill
wins.
`;
}

const skills = await collectSkills();
if (skills.length === 0) {
  console.error('No canonical skills found. Expected SKILL.md under:');
  for (const d of CANONICAL_DIRS) console.error(`  ${path.relative(ROOT, d)}/<skill-name>/`);
  process.exit(1);
}

/*
 * A SKILL.md outside the canonical roots would otherwise be invisible to every check below, so the
 * one mistake this guard most needs to catch — a skill in the wrong place — would pass silently.
 */
{
  const stray = await findStraySkills();
  if (stray.length > 0) {
    console.error('Skills found outside the canonical directories:');
    console.error('');
    for (const s of stray) console.error(`  ${s}`);
    console.error('');
    console.error('A skill belongs in .agents/skills/, or in .github/skills/ when gh-aw must see it.');
    console.error('See .agents/README.md, "Why skills live in two places".');
    process.exit(1);
  }
}

/*
 * Parse and validate every canonical skill before writing anything, so a malformed or
 * mis-identified skill fails the run rather than producing a pointer that misrepresents it.
 */
const parsed = [];
{
  const invalid = [];
  for (const skill of skills) {
    const parts = splitFrontmatter(skill.text);
    if (!parts) {
      invalid.push(`${skill.relDir}/SKILL.md: no YAML frontmatter block`);
      continue;
    }

    const nameField = extractField(parts.frontmatter, 'name');
    const descriptionField = extractField(parts.frontmatter, 'description');
    if (!nameField || !descriptionField) {
      invalid.push(`${skill.relDir}/SKILL.md: frontmatter needs both 'name' and 'description'`);
      continue;
    }

    // The directory name keys the pointer path and the collision check below, while the pointer
    // advertises the declared `name`. If they disagree the pointer misrepresents the skill, and
    // two mismatched skills could advertise one name while passing a directory-keyed check.
    const declared = scalarValue(nameField);
    if (declared !== skill.name) {
      invalid.push(
        `${skill.relDir}/SKILL.md: frontmatter name '${declared}' does not match its directory '${skill.name}'`,
      );
      continue;
    }

    // Agent Skills spec limits. The description is the trigger surface and the pointer copies it
    // verbatim, so a breach here is duplicated into .claude/skills/.
    if (declared.length > NAME_MAX) {
      invalid.push(`${skill.relDir}/SKILL.md: name is ${declared.length} characters (max ${NAME_MAX})`);
      continue;
    }
    if (!NAME_PATTERN.test(declared)) {
      invalid.push(
        `${skill.relDir}/SKILL.md: name '${declared}' must be lowercase letters, numbers and single hyphens, with no leading or trailing hyphen`,
      );
      continue;
    }

    const description = fieldValue(descriptionField);
    if (description.length > DESCRIPTION_MAX) {
      invalid.push(
        `${skill.relDir}/SKILL.md: description is ${description.length} characters (max ${DESCRIPTION_MAX})`,
      );
      continue;
    }
    if (description.length === 0) {
      invalid.push(`${skill.relDir}/SKILL.md: description is empty`);
      continue;
    }
    const tag = DESCRIPTION_TAG_PATTERN.exec(description);
    if (tag) {
      invalid.push(
        `${skill.relDir}/SKILL.md: description contains the tag '${tag[0]}' — write it as plain text, without angle brackets`,
      );
      continue;
    }

    // House rules, stated in .agents/skills/skill-authoring/SKILL.md.
    // Checking only that the key is present would accept `license:` with nothing after it.
    const licenseField = extractField(parts.frontmatter, 'license');
    if (!licenseField || fieldValue(licenseField) !== REQUIRED_LICENSE) {
      invalid.push(`${skill.relDir}/SKILL.md: frontmatter needs 'license: ${REQUIRED_LICENSE}'`);
      continue;
    }

    // Without this the skill is matched automatically but cannot be invoked by name, which is half
    // the discovery contract the skill-authoring skill promises.
    const invocableField = extractField(parts.frontmatter, 'user-invocable');
    if (!invocableField || fieldValue(invocableField) !== 'true') {
      invalid.push(`${skill.relDir}/SKILL.md: frontmatter needs 'user-invocable: true'`);
      continue;
    }
    const haystack = description;
    const missingMarkers = ['WHEN TO USE:', 'WHEN NOT TO USE:'].filter((m) => !haystack.includes(m));
    if (missingMarkers.length > 0) {
      invalid.push(
        `${skill.relDir}/SKILL.md: description is missing ${missingMarkers.join(' and ')}`,
      );
      continue;
    }

    // The whole file, frontmatter included: the spec's budget is "keep your main SKILL.md under 500
    // lines", and the agent loads all of it when the skill activates. Two skills here already carry
    // 17-18 lines of frontmatter, and a 1024-character description adds ~11 more, so excluding it
    // would let the file that actually gets loaded run well past the budget.
    const fileLines = skill.text.split('\n').length;
    if (fileLines > FILE_MAX_LINES) {
      invalid.push(
        `${skill.relDir}/SKILL.md: ${fileLines} lines (max ${FILE_MAX_LINES}) — move detail into references/`,
      );
      continue;
    }

    parsed.push({ ...skill, nameField, descriptionField });
  }

  if (invalid.length > 0) {
    console.error('Canonical skills are not valid:');
    console.error('');
    for (const i of invalid) console.error(`  ${i}`);
    console.error('');
    console.error('See .agents/skills/skill-authoring/SKILL.md for the frontmatter contract.');
    process.exit(1);
  }
}

/*
 * A skill name may exist in only one canonical directory. Pointers are keyed by name, so two
 * canonical skills sharing one would resolve to the same `.claude/skills/<name>/SKILL.md` and the
 * second would silently overwrite the first, leaving one canonical skill unexposed. Fail before
 * writing anything.
 */
{
  const firstSeen = new Map();
  const collisions = [];
  for (const skill of parsed) {
    const first = firstSeen.get(skill.name);
    if (first) collisions.push(`${skill.name}: ${first.relDir} and ${skill.relDir}`);
    else firstSeen.set(skill.name, skill);
  }
  if (collisions.length > 0) {
    console.error('A skill name exists in more than one canonical directory:');
    console.error('');
    for (const c of collisions) console.error(`  ${c}`);
    console.error('');
    console.error('Pointers are keyed by name, so these would overwrite each other.');
    console.error('Keep one copy — see .agents/README.md, "Why skills live in two places".');
    process.exit(1);
  }
}

const problems = [];
const written = [];

for (const skill of parsed) {
  const { nameField, descriptionField } = skill;
  const expected = renderPointer(skill, nameField, descriptionField);
  const pointerPath = path.join(POINTER_DIR, skill.name, 'SKILL.md');
  const actual = await readIfPresent(pointerPath);

  if (actual === expected) continue;

  if (check) {
    problems.push(
      actual === null
        ? `.claude/skills/${skill.name}/SKILL.md: missing pointer for ${skill.relDir}`
        : `.claude/skills/${skill.name}/SKILL.md: out of sync with ${skill.relDir}/SKILL.md`,
    );
  } else {
    await mkdir(path.dirname(pointerPath), { recursive: true });
    await writeFile(pointerPath, expected, 'utf8');
    written.push(skill.name);
  }
}

// Pointers whose canonical skill no longer exists are stale.
{
  const names = new Set(parsed.map((s) => s.name));
  for (const entry of await readdirIfPresent(POINTER_DIR)) {
    if (!entry.isDirectory() || names.has(entry.name)) continue;

    // Only ever reap what this script wrote. `.claude/skills/` is also where a developer's own
    // local skills live, and those are untracked, so deleting one destroys work with no way back.
    // A directory without the generated marker is somebody else's and is left alone entirely --
    // not removed, and not reported, because it is not part of the contract this script enforces.
    const pointer = await readIfPresent(path.join(POINTER_DIR, entry.name, 'SKILL.md'));
    if (pointer === null || !pointer.includes(POINTER_MARKER)) continue;

    if (check) {
      problems.push(`.claude/skills/${entry.name}/: no canonical skill with this name`);
    } else {
      await rm(path.join(POINTER_DIR, entry.name), { recursive: true, force: true });
      written.push(`${entry.name} (removed)`);
    }
  }
}

if (problems.length > 0) {
  console.error('Agent skill pointers are out of sync:\n');
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nRun `npm run skills:sync` and commit the result.');
  process.exit(1);
}

if (check) {
  console.log(`Agent skill pointers are in sync (${parsed.length} skills).`);
} else if (written.length > 0) {
  console.log(`Synced ${written.length} pointer(s): ${written.join(', ')}`);
} else {
  console.log(`Agent skill pointers already up to date (${parsed.length} skills).`);
}

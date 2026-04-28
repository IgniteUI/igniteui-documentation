#!/usr/bin/env node
/**
 * fix-nested-lists.mjs
 *
 * Fixes nested list indentation in "In this topic" / "In this group" sections.
 * DocFX used 2-space indentation for nested lists, but MDX with `-   ` markers
 * (dash + 3 spaces = 4-char marker) requires 4-space indentation per level.
 *
 * Before: `-   Parent\n  -   Child\n    -   Grandchild`
 * After:  `-   Parent\n    -   Child\n        -   Grandchild`
 *
 * Usage:
 *   node scripts/fix-nested-lists.mjs                  # dry-run
 *   node scripts/fix-nested-lists.mjs --apply           # apply
 *   node scripts/fix-nested-lists.mjs --apply --topics=docs/other/src/content/en/topics
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const APPLY = process.argv.includes('--apply');
const topicsArg = process.argv.find(a => a.startsWith('--topics='));
const TOPICS = topicsArg
  ? path.resolve(ROOT, topicsArg.slice('--topics='.length))
  : path.join(ROOT, 'docs/jquery/src/content/en/topics');

console.log(`\n=== fix-nested-lists [${APPLY ? 'APPLY' : 'DRY-RUN'}] ===`);
console.log(`  topics: ${TOPICS}\n`);

function walkMdx(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMdx(full));
    else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) results.push(full);
  }
  return results;
}

/**
 * Fix indentation in a block of list lines.
 * Detects the indentation step used (typically 2 or 3 spaces) and
 * normalizes to 4-space steps.
 */
function fixListBlock(lines) {
  // Detect: find the smallest non-zero indent used with a list marker
  let minIndent = Infinity;
  for (const line of lines) {
    const m = line.match(/^(\s+)-\s/);
    if (m) {
      const indent = m[1].length;
      if (indent > 0 && indent < minIndent) minIndent = indent;
    }
  }

  if (minIndent === Infinity || minIndent >= 4) return lines; // already correct or no nesting

  // Calculate multiplier to reach 4-space steps
  const multiplier = Math.ceil(4 / minIndent);

  return lines.map(line => {
    const m = line.match(/^(\s+)(-\s)/);
    if (m) {
      const currentIndent = m[1].length;
      const newIndent = currentIndent * multiplier;
      return ' '.repeat(newIndent) + line.trimStart();
    }
    return line;
  });
}

const mdxFiles = walkMdx(TOPICS);
let filesChanged = 0;
let listsFixed = 0;

for (const file of mdxFiles) {
  const relPath = path.relative(TOPICS, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  let changed = false;
  const result = [];
  let i = 0;

  while (i < lines.length) {
    // Detect start of a list block (line starting with `-`)
    // that contains nested items with < 4 space indent
    if (/^-\s/.test(lines[i])) {
      // Collect the entire list block
      const listStart = i;
      const listLines = [];
      while (i < lines.length && (/^(\s*)-\s/.test(lines[i]) || /^\s+\S/.test(lines[i]))) {
        listLines.push(lines[i]);
        i++;
      }

      // Check if any line has 1-3 space indent before a list marker
      const hasShallowNesting = listLines.some(l => /^\s{1,3}-\s/.test(l));

      if (hasShallowNesting) {
        const fixed = fixListBlock(listLines);
        result.push(...fixed);
        changed = true;
        listsFixed++;
      } else {
        result.push(...listLines);
      }
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  if (changed) {
    filesChanged++;
    if (APPLY) {
      fs.writeFileSync(file, result.join('\n'), 'utf-8');
    }
    if (!APPLY && filesChanged <= 10) {
      console.log(`  [preview] ${relPath}`);
    }
  }
}

console.log(`\nResults:`);
console.log(`  Files changed: ${filesChanged}`);
console.log(`  List blocks fixed: ${listsFixed}`);
console.log(`  Total files: ${mdxFiles.length}`);

if (!APPLY) console.log(`\nRun with --apply to write changes.`);
console.log('Done.\n');

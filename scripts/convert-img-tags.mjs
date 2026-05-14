#!/usr/bin/env node
/**
 * Convert <img class="responsive-img" src="relative/path"> tags to astro <Image> components.
 *
 * Usage:
 *   node scripts/convert-img-tags.mjs [directory]
 *
 * Default directory: docs/angular/src/content/
 *
 * Only converts <img> tags that:
 *   - Have class="responsive-img"
 *   - Have a relative src (starts with . or ../)
 *   - Are NOT inside code fences (```)
 *
 * Conversion pattern:
 *   Before: <img class="responsive-img" src="../images/foo-bar.png" alt="Description" />
 *   After:  <Image src={fooBar} alt="Description" class="responsive-img" />
 *
 * Also adds:
 *   import { Image } from 'astro:assets';
 *   import fooBar from '../images/foo-bar.png';
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { basename } from 'node:path';

const searchDir = process.argv[2] || 'docs/angular/src/content/';

const IMAGE_IMPORT = "import { Image } from 'astro:assets';";

// Find all .mdx files with responsive-img <img> tags having relative src
let filesRaw;
try {
  filesRaw = execSync(
    `grep -rln "<img.*responsive-img.*src=\\"\\\\." ${searchDir} --include="*.mdx"`,
    { encoding: 'utf8' }
  ).trim().split('\n').filter(Boolean);
} catch {
  // Try alternate pattern (class after src)
  try {
    filesRaw = execSync(
      `grep -rln "<img.*src=\\"\\\\." ${searchDir} --include="*.mdx"`,
      { encoding: 'utf8' }
    ).trim().split('\n').filter(Boolean);
    // Filter to only responsive-img
    filesRaw = filesRaw.filter(f => {
      const c = readFileSync(f, 'utf8');
      return /<img[^>]*class="responsive-img"[^>]*src="\./.test(c) ||
             /<img[^>]*src="\.[^"]*"[^>]*class="responsive-img"/.test(c);
    });
  } catch {
    filesRaw = [];
  }
}

if (filesRaw.length === 0) {
  console.log('No files with convertible <img> tags found.');
  process.exit(0);
}

console.log(`Found ${filesRaw.length} file(s) with <img class="responsive-img"> tags to convert.\n`);

/**
 * Convert a filename/path to a camelCase variable name.
 * e.g. "ig-step-by-step-new-project-action.png" -> "igStepByStepNewProjectAction"
 */
function toVarName(imgPath) {
  const name = basename(imgPath).replace(/\.[^.]+$/, ''); // strip extension
  return name.replace(/[-_]([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Check if a line position is inside a code fence in the file content.
 */
function isInsideCodeFence(lines, lineIdx) {
  let insideFence = false;
  for (let i = 0; i < lineIdx; i++) {
    if (lines[i].trimStart().startsWith('```')) {
      insideFence = !insideFence;
    }
  }
  return insideFence;
}

let converted = 0;
let importsAdded = 0;

// Regex to match <img class="responsive-img" src="..." alt="..." /> variations
// Handles attribute order: class before or after src
const imgRegex = /<img\s+(?:[^>]*?)class="responsive-img"(?:[^>]*?)src="(\.[^"]+)"(?:[^>]*?)(?:alt="([^"]*)")?(?:[^>]*?)\/?>/g;
// Also handle src before class
const imgRegex2 = /<img\s+(?:[^>]*?)src="(\.[^"]+)"(?:[^>]*?)class="responsive-img"(?:[^>]*?)(?:alt="([^"]*)")?(?:[^>]*?)\/?>/g;

for (const filePath of filesRaw) {
  let content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const original = content;
  const newImports = [];

  // Find all img tags to convert (not inside code fences)
  const toReplace = [];

  for (let i = 0; i < lines.length; i++) {
    if (isInsideCodeFence(lines, i)) continue;
    const line = lines[i];

    // Try both attribute orderings
    for (const regex of [imgRegex, imgRegex2]) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(line)) !== null) {
        const [fullMatch, src, alt] = match;
        toReplace.push({ fullMatch, src, alt: alt || '', lineIdx: i });
      }
    }
  }

  if (toReplace.length === 0) continue;

  // Dedupe by fullMatch
  const seen = new Set();
  const unique = toReplace.filter(r => {
    if (seen.has(r.fullMatch)) return false;
    seen.add(r.fullMatch);
    return true;
  });

  for (const { fullMatch, src, alt } of unique) {
    const varName = toVarName(src);

    // Check if import already exists
    const importLine = `import ${varName} from '${src}';`;
    if (!content.includes(importLine) && !content.includes(`import ${varName} from`)) {
      newImports.push(importLine);
    }

    // Replace img tag with Image component
    const imageTag = `<Image src={${varName}} alt="${alt}" class="responsive-img" />`;
    content = content.replace(fullMatch, imageTag);
  }

  // Add Image import from astro:assets if not present
  if (!content.includes(IMAGE_IMPORT)) {
    newImports.unshift(IMAGE_IMPORT);
  }

  // Insert new imports after frontmatter
  if (newImports.length > 0) {
    const firstFm = content.indexOf('---');
    const secondFm = firstFm !== -1 ? content.indexOf('---', firstFm + 3) : -1;
    if (secondFm !== -1) {
      const insertPos = content.indexOf('\n', secondFm) + 1;
      // Check if there are already imports, add after them
      const afterFm = content.slice(insertPos);
      const existingImportEnd = afterFm.search(/^(?!import |$|\s*$)/m);
      const actualInsertPos = existingImportEnd > 0 ? insertPos + existingImportEnd : insertPos;
      content = content.slice(0, actualInsertPos) + newImports.join('\n') + '\n' + content.slice(actualInsertPos);
    }
    importsAdded += newImports.length;
  }

  if (content !== original) {
    writeFileSync(filePath, content);
    converted++;
    process.stdout.write(`  ~ ${filePath} (${unique.length} tag(s))\n`);
  }
}

console.log(`\nDone.`);
console.log(`  Files converted:    ${converted}`);
console.log(`  Imports added:      ${importsAdded}`);

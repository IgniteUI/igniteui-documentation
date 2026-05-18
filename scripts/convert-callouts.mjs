#!/usr/bin/env node
/**
 * Convert docfx-style callouts to MDX <DocsAside> in all .mdx files.
 * Also removes <!-- schema: ... --> comments and ensures DocsAside import exists.
 *
 * Usage:
 *   node scripts/convert-callouts.mjs [directory]
 *
 * Default directory: docs/angular/src/content/
 *
 * Callout patterns:
 *   > [!NOTE]         or   >[!NOTE]
 *   > text line 1          >text line 1
 *   > text line 2          >text line 2
 *
 * Becomes:
 *   <DocsAside type="note">
 *   text line 1
 *   text line 2
 *   </DocsAside>
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const DOCS_ASIDE_IMPORT = "import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';";

const searchDir = process.argv[2] || 'docs/angular/src/content/';

// Find all .mdx files with callouts or schema comments
let filesRaw;
try {
  filesRaw = execSync(
    `grep -rl "\\[!NOTE\\]\\|\\[!TIP\\]\\|\\[!WARNING\\]\\|\\[!IMPORTANT\\]\\|\\[!CAUTION\\]\\|<!-- schema:" ${searchDir} --include="*.mdx"`,
    { encoding: 'utf8' }
  ).trim().split('\n').filter(Boolean);
} catch {
  filesRaw = [];
}

console.log(`Found ${filesRaw.length} files with callouts/schema comments to process.\n`);

let converted = 0;
let schemasRemoved = 0;
let importsAdded = 0;

for (const filePath of filesRaw) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // Remove <!-- schema: ... --> lines
  content = content.replace(/^<!-- schema:.*-->\r?\n/gm, '');
  if (content !== original) schemasRemoved++;

  // Convert callouts line-by-line, skipping content inside code fences
  {
    const inputLines = content.split('\n');
    const outputLines = [];
    let inFence = false;
    for (let i = 0; i < inputLines.length; i++) {
      const line = inputLines[i];
      if (line.match(/^```/)) { inFence = !inFence; outputLines.push(line); continue; }
      if (inFence) { outputLines.push(line); continue; }
      const m = line.match(/^[ \t]*>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*\r?$/);
      if (m) {
        const type = m[1];
        const bodyLines = [];
        while (i + 1 < inputLines.length && inputLines[i + 1].match(/^[ \t]*>/)) {
          i++;
          bodyLines.push(inputLines[i].replace(/^[ \t]*>\s?/, '').replace(/\r$/, ''));
        }
        const typeLC = type.toLowerCase() === 'important' ? 'note' : type.toLowerCase();
        outputLines.push(`<DocsAside type="${typeLC}">`, ...bodyLines, `</DocsAside>`);
        continue;
      }
      outputLines.push(line);
    }
    content = outputLines.join('\n');
  }

  // Ensure DocsAside import exists if we have <DocsAside in the file
  if (content.includes('<DocsAside') && !content.includes(DOCS_ASIDE_IMPORT)) {
    // Insert after frontmatter (after second ---)
    const firstFm = content.indexOf('---');
    const secondFm = firstFm !== -1 ? content.indexOf('---', firstFm + 3) : -1;
    if (secondFm !== -1) {
      // Has frontmatter — insert after closing ---
      const insertPos = content.indexOf('\n', secondFm) + 1;
      content = content.slice(0, insertPos) + '\n' + DOCS_ASIDE_IMPORT + '\n' + content.slice(insertPos);
      importsAdded++;
    } else {
      // No frontmatter — insert at the very top
      content = DOCS_ASIDE_IMPORT + '\n\n' + content;
      importsAdded++;
    }
  }

  if (content !== original) {
    writeFileSync(filePath, content);
    converted++;
    process.stdout.write(`  ~ ${filePath}\n`);
  }
}

console.log(`\nDone.`);
console.log(`  Files converted:    ${converted}`);
console.log(`  Schema removed:     ${schemasRemoved}`);
console.log(`  Imports added:      ${importsAdded}`);

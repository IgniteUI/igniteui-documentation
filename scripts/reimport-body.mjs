#!/usr/bin/env node
/**
 * Re-merge upstream body content for files where "keep ours" conflict resolution
 * discarded substantive text changes during the initial 3-way merge.
 *
 * Strategy: For each affected file:
 *   1. 3-way merge body (ancestor vs ours vs theirs) using git merge-file
 *   2. For conflicts, prefer "theirs" (keep upstream text changes)
 *   3. Apply MDX transforms to the resolved body:
 *      - Convert >[!NOTE/TIP/...] → <DocsAside>
 *      - Remove <!-- schema: --> comments
 *      - Convert other HTML comments to MDX comments (outside code fences)
 *      - Convert <code-view> → <Sample>
 *      - Convert <img class="responsive-img"> → <Image>
 *
 * Usage:
 *   node scripts/reimport-body.mjs              (process all known rewritten files)
 *   node scripts/reimport-body.mjs --all        (same as above)
 *   node scripts/reimport-body.mjs file1.md ... (process specific docfx paths)
 *
 * After running, build to verify: npm run angular:build-staging:en
 */

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';

const ANCESTOR = process.argv.find(a => a.startsWith('--ancestor='))?.split('=')[1] || 'f8c877bc9e';
const THEIRS = process.argv.find(a => a.startsWith('--theirs='))?.split('=')[1] || 'igniteui-docfx/vnext';
const CONTENT_DIR = 'docs/angular/src/content';
const GRID_DIRS = ['grid', 'treegrid', 'hierarchicalgrid', 'pivotGrid'];

const DOCS_ASIDE_IMPORT = "import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';";
const SAMPLE_IMPORT = "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';";
const IMAGE_IMPORT = "import { Image } from 'astro:assets';";

// Files that had substantial text rewrites in the upstream (not just syntax differences)
const KNOWN_REWRITTEN = [
  'en/components/ai/skills.md',
  'en/components/ai/theming-mcp.md',
  'en/components/date-range-picker.md',
  'en/components/general/getting-started.md',
  'en/components/general/open-source-vs-premium.md',
  'en/components/general/cli/getting-started-with-cli.md',
  'en/components/general/cli/getting-started-with-angular-schematics.md',
  'en/components/general/cli/component-templates.md',
  'en/components/general/cli/step-by-step-guide-using-angular-schematics.md',
  'en/components/general/cli/step-by-step-guide-using-cli.md',
  'en/components/general/cli-overview.md',
  'en/components/general/localization.md',
  'en/components/general/how-to/how-to-use-standalone-components.md',
  'en/components/general/how-to/how-to-perform-crud.md',
  'en/components/general/data-analysis.md',
  'en/components/icon-service.md',
  'en/components/interactivity/accessibility-compliance.md',
  'en/components/grids_templates/state-persistence.md',
  'en/components/grids_templates/keyboard-navigation.md',
  'en/components/grids_templates/export-excel.md',
  'en/components/grids_templates/summaries.md',
  'en/components/grids_templates/column-types.md',
  'en/components/grids_templates/editing.md',
  'en/components/grids_templates/search.md',
  'en/components/tooltip.md',
  'en/components/mask.md',
  'en/components/paginator.md',
  'en/components/badge.md',
  'en/components/grid/grid.md',
  'en/components/themes/sass/roundness.md',
  'en/components/themes/sass/global-themes.md',
  'en/components/themes/index.md',
  'en/components/date-time-editor.md',
  'en/components/charts/types/data-pie-chart.md',
  'en/components/general-breaking-changes-dv.md',
  'jp/components/ai/skills.md',
  'jp/components/ai/theming-mcp.md',
  'jp/components/interactivity/accessibility-compliance.md',
  'jp/components/general/how-to/how-to-use-standalone-components.md',
  'jp/components/general-changelog-dv.md',
  'jp/components/menus/toolbar.md',
];

function splitFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  let fmCount = 0;
  let splitIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      fmCount++;
      if (fmCount === 2) { splitIdx = i; break; }
    }
  }
  if (splitIdx === -1) return { head: '', body: content };
  const head = lines.slice(0, splitIdx + 1).join('\n') + '\n';
  const body = lines.slice(splitIdx + 1).join('\n');
  return { head, body };
}

function getGitContent(ref, path) {
  try {
    return execSync(`git show ${ref}:${path}`, { encoding: 'utf8' });
  } catch { return null; }
}

function getLocalPaths(docfxPath) {
  const paths = [];
  if (docfxPath.includes('grids_templates/')) {
    for (const dir of GRID_DIRS) {
      const expanded = docfxPath.replace('grids_templates/', `${dir}/`);
      const p = `${CONTENT_DIR}/${expanded.replace(/\.md$/, '.mdx')}`;
      if (existsSync(p)) paths.push(p);
    }
  } else {
    const p = `${CONTENT_DIR}/${docfxPath.replace(/\.md$/, '.mdx')}`;
    if (existsSync(p)) paths.push(p);
  }
  return paths;
}

/**
 * Resolve conflicts in merged text by keeping "theirs" in conflicts.
 */
function resolveConflictsKeepTheirs(text) {
  const lines = text.split('\n');
  const result = [];
  let inConflict = false;
  let section = null;

  for (const line of lines) {
    if (line.startsWith('<<<<<<< ')) {
      inConflict = true;
      section = 'ours';
      continue;
    }
    if (line === '=======' && inConflict) {
      section = 'theirs';
      continue;
    }
    if (line.startsWith('>>>>>>> ') && inConflict) {
      inConflict = false;
      section = null;
      continue;
    }
    if (inConflict) {
      if (section === 'theirs') {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}

function toVarName(imgPath) {
  const name = basename(imgPath).replace(/\.[^.]+$/, '');
  return name.replace(/[-_]([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Convert <code-view> elements to <Sample> components.
 */
function convertCodeViews(body) {
  let needsSample = false;

  // Match various code-view patterns
  const codeViewRegex = /<code-view\s+[^>]*?(?:iframe-src="[^"]*?"[^>]*?)>\s*(?:<\/code-view>)?/gs;

  body = body.replace(codeViewRegex, (match) => {
    needsSample = true;

    const heightMatch = match.match(/style="height:\s*(\d+)px"/);
    const iframeSrcMatch = match.match(/iframe-src="\{environment:[^}]+\}([^"]*?)\/?\s*"/);
    const altMatch = match.match(/alt="([^"]*)"/);

    const height = heightMatch ? heightMatch[1] : '400';
    let src = iframeSrcMatch ? iframeSrcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';

    src = src.replace(/\/$/, '');

    let attrs = `src="${src}" height={${height}}`;
    if (alt) attrs += ` alt="${alt}"`;

    return `<Sample ${attrs} />`;
  });

  return { body, needsSample };
}

/**
 * Apply MDX transforms to a body string.
 */
function transformBody(body) {
  let needsDocsAside = false;
  let needsSample = false;
  const imageImports = [];

  // Remove <!-- schema: ... --> single-line comments
  body = body.replace(/^<!-- schema:.*-->\s*\n?/gm, '');

  // Convert HTML comments to MDX comments (only outside code fences)
  body = convertHtmlComments(body);

  // Convert callouts line-by-line, skipping content inside code fences
  {
    const inputLines = body.split('\n');
    const outputLines = [];
    let inFence = false;
    for (let i = 0; i < inputLines.length; i++) {
      const line = inputLines[i];
      if (line.match(/^```/)) { inFence = !inFence; outputLines.push(line); continue; }
      if (inFence) { outputLines.push(line); continue; }
      const m = line.match(/^[ \t]*>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*\r?$/);
      if (m) {
        needsDocsAside = true;
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
    body = outputLines.join('\n');
  }

  // Convert <code-view> to <Sample>
  const codeViewResult = convertCodeViews(body);
  body = codeViewResult.body;
  needsSample = codeViewResult.needsSample;

  // Convert <img class="responsive-img" src="..." alt="..."> to <Image>
  const imgRegex = /<img\s+class="responsive-img"\s+src="(\.[^"]+)"\s+alt="([^"]*)"\s*\/?>/g;
  for (const m of [...body.matchAll(imgRegex)]) {
    const [fullMatch, src, alt] = m;
    const varName = toVarName(src);
    if (!imageImports.find(i => i.varName === varName)) {
      imageImports.push({ varName, src });
    }
    body = body.replace(fullMatch, `<Image src={${varName}} alt="${alt}" class="responsive-img" />`);
  }

  const imgRegex2 = /<img\s+class="responsive-img"\s+alt="([^"]*)"\s+src="(\.[^"]+)"\s*\/?>/g;
  for (const m of [...body.matchAll(imgRegex2)]) {
    const [fullMatch, alt, src] = m;
    const varName = toVarName(src);
    if (!imageImports.find(i => i.varName === varName)) {
      imageImports.push({ varName, src });
    }
    body = body.replace(fullMatch, `<Image src={${varName}} alt="${alt}" class="responsive-img" />`);
  }

  return { body, needsDocsAside, needsSample, imageImports };
}

/**
 * Convert HTML comments to MDX comments, but only outside code fences.
 */
function convertHtmlComments(content) {
  const lines = content.split('\n');
  const result = [];
  let inFence = false;
  let inComment = false;
  let commentBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^```/)) {
      if (inComment) {
        // Flush comment before code fence
        result.push('{/*' + commentBuffer.join('\n') + '*/}');
        commentBuffer = [];
        inComment = false;
      }
      inFence = !inFence;
      result.push(line);
      continue;
    }

    if (inFence) {
      result.push(line);
      continue;
    }

    // Outside code fence - handle HTML comments
    if (!inComment) {
      const startIdx = line.indexOf('<!--');
      if (startIdx !== -1) {
        const endIdx = line.indexOf('-->', startIdx + 4);
        if (endIdx !== -1) {
          // Single-line comment
          const before = line.substring(0, startIdx);
          const comment = line.substring(startIdx + 4, endIdx);
          const after = line.substring(endIdx + 3);
          result.push(before + '{/*' + comment + '*/}' + after);
        } else {
          // Multi-line comment starts
          inComment = true;
          const before = line.substring(0, startIdx);
          if (before.trim()) result.push(before);
          commentBuffer.push(line.substring(startIdx + 4));
        }
      } else {
        result.push(line);
      }
    } else {
      // Inside multi-line comment
      const endIdx = line.indexOf('-->');
      if (endIdx !== -1) {
        commentBuffer.push(line.substring(0, endIdx));
        result.push('{/*' + commentBuffer.join('\n') + '*/}');
        const after = line.substring(endIdx + 3);
        if (after.trim()) result.push(after);
        commentBuffer = [];
        inComment = false;
      } else {
        commentBuffer.push(line);
      }
    }
  }

  // Flush any remaining comment
  if (inComment && commentBuffer.length > 0) {
    result.push('{/*' + commentBuffer.join('\n') + '*/}');
  }

  return result.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
let filesToProcess;
if (args.length === 0) {
  filesToProcess = KNOWN_REWRITTEN;
} else {
  filesToProcess = args;
}

console.log(`Re-merging body content for ${filesToProcess.length} files (ancestor=${ANCESTOR}, theirs=${THEIRS})...\n`);

let updated = 0;
let skipped = 0;
let cleanMerge = 0;
let resolvedConflicts = 0;

const tmpDir = mkdtempSync(join(tmpdir(), 'reimport-'));

try {
  for (const docfxFile of filesToProcess) {
    const ancestorContent = getGitContent(ANCESTOR, docfxFile);
    const theirsContent = getGitContent(THEIRS, docfxFile);

    if (!theirsContent) {
      console.log(`  SKIP ${docfxFile} (not found in ${THEIRS})`);
      skipped++;
      continue;
    }
    if (!ancestorContent) {
      console.log(`  SKIP ${docfxFile} (not found in ancestor)`);
      skipped++;
      continue;
    }

    const localPaths = getLocalPaths(docfxFile);
    if (localPaths.length === 0) {
      console.log(`  SKIP ${docfxFile} (no local .mdx found)`);
      skipped++;
      continue;
    }

    const ancestorBody = splitFrontmatter(ancestorContent).body;
    const theirsBody = splitFrontmatter(theirsContent).body;

    if (ancestorBody === theirsBody) {
      skipped++;
      continue;
    }

    for (const localPath of localPaths) {
      const oursContent = readFileSync(localPath, 'utf8');
      const { head: oursHead, body: oursBody } = splitFrontmatter(oursContent);

      // 3-way merge the bodies
      const ancestorFile = join(tmpDir, 'ancestor.md');
      const theirsFile = join(tmpDir, 'theirs.md');
      const oursFile = join(tmpDir, 'ours.mdx');

      writeFileSync(ancestorFile, ancestorBody);
      writeFileSync(theirsFile, theirsBody);
      writeFileSync(oursFile, oursBody);

      const result = spawnSync('git', [
        'merge-file',
        '-L', 'ours',
        '-L', 'ancestor',
        '-L', 'theirs',
        oursFile, ancestorFile, theirsFile
      ], { encoding: 'utf8' });

      let mergedBody;
      if (result.status === 0) {
        // Clean merge
        mergedBody = readFileSync(oursFile, 'utf8');
        cleanMerge++;
      } else if (result.status > 0) {
        // Conflicts - resolve by keeping theirs
        const conflictedBody = readFileSync(oursFile, 'utf8');
        mergedBody = resolveConflictsKeepTheirs(conflictedBody);
        resolvedConflicts++;
      } else {
        console.log(`  ! ${localPath} (merge-file error)`);
        continue;
      }

      // Apply MDX transforms to the merged body
      const { body: transformedBody, needsDocsAside, needsSample, imageImports } = transformBody(mergedBody);

      // Strip MDX import lines from merged body (they'll be in the header section)
      // Only strip imports that are actual MDX component/asset imports, not code examples
      const bodyLines = transformedBody.split('\n');
      const bodyImports = [];
      const bodyContent = [];
      let pastImports = false;
      for (const line of bodyLines) {
        if (!pastImports && line.match(/^import .+from ['"](?:igniteui-astro|astro:|\.\.?\/)/)) {
          bodyImports.push(line);
        } else if (!pastImports && line.trim() === '') {
          // Skip leading blank lines
          continue;
        } else {
          pastImports = true;
          bodyContent.push(line);
        }
      }
      const cleanBody = bodyContent.join('\n');

      // Collect existing imports from our file (only top-level MDX imports, not those in code blocks)
      const oursBodyLines = oursBody.split('\n');
      const existingTopImports = [];
      for (const line of oursBodyLines) {
        if (line.match(/^import /)) {
          existingTopImports.push(line);
        } else if (line.trim() === '') {
          continue;
        } else {
          break;
        }
      }
      const existingImportLines = [...new Set([...existingTopImports, ...bodyImports])];

      // Determine which imports are needed
      const importsNeeded = new Set(existingImportLines);

      if (needsDocsAside && !existingImportLines.some(i => i.includes('DocsAside'))) {
        importsNeeded.add(DOCS_ASIDE_IMPORT);
      }
      if (needsSample && !existingImportLines.some(i => i.includes('Sample'))) {
        importsNeeded.add(SAMPLE_IMPORT);
      }
      if (imageImports.length > 0 && !existingImportLines.some(i => i.includes("'astro:assets'"))) {
        importsNeeded.add(IMAGE_IMPORT);
      }
      for (const { varName, src } of imageImports) {
        if (!existingImportLines.some(i => i.includes(varName))) {
          importsNeeded.add(`import ${varName} from '${src}';`);
        }
      }

      // Rebuild file
      const uniqueImports = [...importsNeeded];
      let finalContent;
      if (uniqueImports.length > 0) {
        finalContent = oursHead + '\n' + uniqueImports.join('\n') + '\n\n' + cleanBody;
      } else {
        finalContent = oursHead + '\n' + cleanBody;
      }

      writeFileSync(localPath, finalContent);
      updated++;
      process.stdout.write(`  ✓ ${localPath}\n`);
    }
  }
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

console.log(`\nDone.`);
console.log(`  Updated: ${updated}`);
console.log(`  Clean merges: ${cleanMerge}`);
console.log(`  Conflict resolutions (keep theirs): ${resolvedConflicts}`);
console.log(`  Skipped: ${skipped}`);

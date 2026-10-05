#!/usr/bin/env node
/**
 * Validates .mdx files for common quality issues.
 * Run this after importing or bulk-editing content to catch regressions.
 *
 * Checks:
 *   1. Raw {environment:angularApiUrl} links (should be <ApiLink> components)
 *   2. Raw .md links (should use .mdx extension)
 *   3. <code-view> elements (should be <Sample> components)
 *   4. HTML comments outside code fences (should be MDX style) 
 *   5. Unclosed <br> tags (should be <br /> in MDX)
 *   6. >[!NOTE/TIP/...] callouts (should be <DocsAside> components)
 *   7. <!-- schema: --> comments (should be removed)
 *   8. Lost <ApiLink> (compare count with master/base branch)
 *   9. Lost <Sample> (compare count with master/base branch)
 *  10. Markdown images ![alt](path) outside code fences (should be <Image> components)
 *
 * Usage:
 *   node scripts/check-mdx-quality.mjs                     (check all modified .mdx vs master)
 *   node scripts/check-mdx-quality.mjs --base=main         (compare against different branch)
 *   node scripts/check-mdx-quality.mjs --dir=docs/angular  (check specific directory)
 *   node scripts/check-mdx-quality.mjs --fix               (auto-convert .md links to .mdx)
 *
 * Exit code: 0 = clean, 1 = issues found
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const BASE = process.argv.find(a => a.startsWith('--base='))?.split('=')[1] || 'master';
const DIR = process.argv.find(a => a.startsWith('--dir='))?.split('=')[1] || 'docs/angular/src/content';
const FIX = process.argv.includes('--fix');
const ALL = process.argv.includes('--all');

// Get files to check
let files;

function walkDir(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...walkDir(fullPath));
      } else if (entry.name.endsWith('.mdx')) {
        results.push(fullPath.replace(/\\/g, '/'));
      }
    }
  } catch { /* skip inaccessible dirs */ }
  return results;
}

if (ALL) {
  files = walkDir(DIR);
} else {
  const fileSet = new Set();
  // Get committed changes vs base
  try {
    execSync(`git diff ${BASE}..HEAD --name-only -- *.mdx`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      .trim().split('\n').filter(Boolean).forEach(f => fileSet.add(f));
  } catch { /* base branch may not exist */ }
  // Also get uncommitted changes
  try {
    execSync(`git diff --name-only -- *.mdx`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      .trim().split('\n').filter(Boolean).forEach(f => fileSet.add(f));
  } catch { /* no uncommitted changes */ }
  files = [...fileSet];
}

if (files.length === 0) {
  console.log('No .mdx files to check.');
  process.exit(0);
}

console.log(`Checking ${files.length} .mdx files against ${BASE}...\n`);

const issues = [];

function isInsideCodeFence(lines, lineIdx) {
  let inFence = false;
  for (let i = 0; i < lineIdx; i++) {
    if (lines[i].match(/^```/)) inFence = !inFence;
  }
  return inFence;
}

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch { continue; }

  const lines = content.split('\n');
  const fileIssues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const inFence = isInsideCodeFence(lines, i);
    if (inFence) continue;

    // Check 1: Raw angularApiUrl links (should be <ApiLink>)
    const apiUrlMatches = line.match(/\[`?[^`\]]+`?\]\(\{environment:angularApiUrl\}[^)]+\)/g);
    if (apiUrlMatches) {
      for (const m of apiUrlMatches) {
        fileIssues.push({ line: lineNum, type: 'raw-api-link', msg: `Raw API URL (should be <ApiLink>): ${m.substring(0, 80)}` });
      }
    }

    // Check 2: Raw .md links (should use .mdx extension)
    const mdLinks = line.match(/\[[^\]]+\]\([^)]*\.md[)#]/g);
    if (mdLinks) {
      for (const m of mdLinks) {
        // Skip external links (http/https)
        if (m.includes('http://') || m.includes('https://')) continue;
        fileIssues.push({ line: lineNum, type: 'md-link', msg: `Raw .md link (should be .mdx): ${m.substring(0, 80)}` });
      }
    }

    // Check 3: <code-view> elements
    if (line.includes('<code-view')) {
      fileIssues.push({ line: lineNum, type: 'code-view', msg: '<code-view> should be <Sample>' });
    }

    // Check 4: HTML comments outside code fences
    if (line.includes('<!--')) {
      fileIssues.push({ line: lineNum, type: 'html-comment', msg: `HTML comment (should be {/* */} in MDX): ${line.trim().substring(0, 60)}` });
    }

    // Check 5: Unclosed <br> (not <br /> or <br/>)
    if (line.match(/<br\s*>/) && !line.match(/<br\s*\/>/)) {
      fileIssues.push({ line: lineNum, type: 'unclosed-br', msg: '<br> should be <br />' });
    }

    // Check 6: Raw callouts
    if (line.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/)) {
      fileIssues.push({ line: lineNum, type: 'raw-callout', msg: 'Raw callout (should be <DocsAside>)' });
    }

    // Check 7: Schema comments
    if (line.match(/^<!-- schema:/)) {
      fileIssues.push({ line: lineNum, type: 'schema-comment', msg: '<!-- schema: --> should be removed' });
    }

    // Check 10: Markdown images outside code fences (should be <Image> from astro:assets)
    const mdImages = line.match(/!\[[^\]]*\]\([^)]+\.(png|jpg|jpeg|gif|svg|webp)[^)]*\)/gi);
    if (mdImages) {
      for (const m of mdImages) {
        fileIssues.push({ line: lineNum, type: 'markdown-image', msg: `Markdown image (should be <Image> from astro:assets): ${m.substring(0, 80)}` });
      }
    }
  }

  // Check 8 & 9: Compare component counts with base
  try {
    const baseContent = execSync(`git show ${BASE}:${file}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const baseApiLinks = (baseContent.match(/<ApiLink/g) || []).length;
    const currApiLinks = (content.match(/<ApiLink/g) || []).length;
    if (currApiLinks < baseApiLinks) {
      fileIssues.push({ line: 0, type: 'lost-apilink', msg: `Lost <ApiLink> components: had ${baseApiLinks}, now ${currApiLinks} (lost ${baseApiLinks - currApiLinks})` });
    }

    const baseSamples = (baseContent.match(/<Sample/g) || []).length;
    const currSamples = (content.match(/<Sample/g) || []).length;
    if (currSamples < baseSamples) {
      fileIssues.push({ line: 0, type: 'lost-sample', msg: `Lost <Sample> components: had ${baseSamples}, now ${currSamples} (lost ${baseSamples - currSamples})` });
    }
  } catch {
    // File doesn't exist in base - skip comparison
  }

  if (fileIssues.length > 0) {
    issues.push({ file, issues: fileIssues });
  }
}

// Report
if (issues.length === 0) {
  console.log('✓ All files pass MDX quality checks.');
  process.exit(0);
}

let totalIssues = 0;
for (const { file, issues: fileIssues } of issues) {
  console.log(`\n  ${file}:`);
  for (const issue of fileIssues) {
    const loc = issue.line > 0 ? `:${issue.line}` : '';
    console.log(`    [${issue.type}]${loc} ${issue.msg}`);
    totalIssues++;
  }
}

// Summary by type
const typeCounts = {};
for (const { issues: fileIssues } of issues) {
  for (const issue of fileIssues) {
    typeCounts[issue.type] = (typeCounts[issue.type] || 0) + 1;
  }
}
console.log(`\n${'─'.repeat(60)}`);
console.log(`Summary: ${totalIssues} issues in ${issues.length} files\n`);
for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

// Auto-fix mode
if (FIX) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log('Auto-converting .md links to .mdx...\n');
  let fixed = 0;
  for (const { file, issues: fileIssues } of issues) {
    const mdLinkIssues = fileIssues.filter(i => i.type === 'md-link');
    if (mdLinkIssues.length === 0) continue;

    let content = readFileSync(file, 'utf8');
    // Replace .md) with .mdx) and .md# with .mdx#
    content = content.replace(/(\[[^\]]+\]\([^)]*?)\.md([)#])/g, (match, before, after) => {
      if (before.includes('http://') || before.includes('https://')) return match;
      return `${before}.mdx${after}`;
    });
    writeFileSync(file, content);
    fixed++;
    console.log(`  Fixed: ${file}`);
  }
  console.log(`\n  ${fixed} files fixed.`);
}

process.exit(1);

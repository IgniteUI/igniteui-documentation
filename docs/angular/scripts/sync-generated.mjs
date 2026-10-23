#!/usr/bin/env node
import { closeSync, cpSync, existsSync, ftruncateSync, openSync, readFileSync, readdirSync, statSync, writeSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lang = process.argv.find(a => a.startsWith('--lang='))?.split('=')[1] ?? 'en';

const repoRoot = join(__dirname, '../../..');
const sourceDir = join(repoRoot, `docs/xplat/generated/Angular/${lang}`);
const targetDir = join(repoRoot, `docs/angular/src/content/${lang}`);

console.log(`Syncing generated Angular MDX content from xplat (lang: ${lang})...`);

if (!existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  console.error('Run the xplat generation script first.');
  process.exit(1);
}

function shouldCopy(src) {
  // Skip grids folder (Angular has its own)
  if (src.includes('/grids/') || src.includes('\\grids\\')) {
    return false;
  }
  // Skip changelog folder (Angular has its own)
  if (src.includes('/changelog/') || src.includes('\\changelog\\')) {
    return false;
  }
  // Skip TOC files (Angular manages its own)
  if (src.endsWith('toc.json') || src.endsWith('toc.yml')) {
    return false;
  }
  return true;
}

function normalizeMarkdownSpacing(content) {
  const hasFinalNewline = /\r?\n$/.test(content);
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const result = [];
  let blankCount = 0;
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      blankCount = 0;
      result.push(line);
      continue;
    }

    if (inFence) {
      result.push(line);
      continue;
    }

    if (line.trim() === '') {
      blankCount++;
      if (blankCount <= 1) {
        result.push('');
      }
      continue;
    }

    blankCount = 0;
    result.push(line);
  }

  let normalized = result.join('\n').replace(/\n+$/, '');
  if (hasFinalNewline) {
    normalized += '\n';
  }
  return normalized;
}

function normalizeCopiedMarkdownFiles(srcDir, destDir) {
  let normalizedCount = 0;

  function visit(srcPath) {
    if (!shouldCopy(srcPath)) return;

    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(srcPath)) {
        visit(join(srcPath, entry));
      }
      return;
    }

    if (!/\.(md|mdx)$/i.test(srcPath)) return;

    const destPath = join(destDir, relative(srcDir, srcPath));
    let fd;

    try {
      fd = openSync(destPath, 'r+');
      const original = readFileSync(fd, 'utf8');
      const normalized = normalizeMarkdownSpacing(original);

      if (normalized !== original) {
        ftruncateSync(fd, 0);
        writeSync(fd, normalized, 0, 'utf8');
        normalizedCount++;
      }
    } catch (error) {
      if (error?.code === 'ENOENT') return;
      throw error;
    } finally {
      if (fd !== undefined) {
        closeSync(fd);
      }
    }
  }

  visit(srcDir);
  return normalizedCount;
}

// Copy all generated content files from source to target
console.log(`Copying from ${sourceDir} to ${targetDir}`);
cpSync(sourceDir, targetDir, {
  recursive: true,
  filter: shouldCopy,
});

const normalizedFiles = normalizeCopiedMarkdownFiles(sourceDir, targetDir);

console.log(' Generated content synced successfully');
console.log(' Excluded: grids/, changelog/, toc files');
console.log(` Normalized markdown spacing in ${normalizedFiles} file(s)`);

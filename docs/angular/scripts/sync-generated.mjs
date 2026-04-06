#!/usr/bin/env node
import { cpSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const repoRoot = join(__dirname, '../../..');
const sourceDir = join(repoRoot, 'docs/xplat/generated/Angular/en');
const targetDir = join(repoRoot, 'docs/angular/src/content/en');

console.log('Syncing generated Angular MDX content from xplat...');

if (!existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  console.error('Run the xplat generation script first.');
  process.exit(1);
}

// Copy all generated content files from source to target
console.log(`Copying from ${sourceDir} to ${targetDir}`);
cpSync(sourceDir, targetDir, { 
  recursive: true,
  filter: (src) => {
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
});

console.log(' Generated content synced successfully');
console.log(' Excluded: grids/, changelog/, toc files');

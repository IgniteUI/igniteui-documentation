#!/usr/bin/env node
/**
 * normalize-mdx.mjs — CLI wrapper for docs-template/normalize-mdx
 *
 * Usage:
 *   node scripts/normalize-mdx.mjs <topicsDir>
 *   node scripts/normalize-mdx.mjs docs/jquery/src/content/en/topics
 */
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const targetDir = process.argv[2];
if (!targetDir) {
    console.error('Usage: node scripts/normalize-mdx.mjs <topicsDir>');
    process.exit(1);
}

const abs = path.resolve(targetDir);
console.log(`\nNormalizing MDX files in: ${abs}\n`);

// Import via tsx/vite-aware path. Fallback to direct TS import if available.
const { normalizeMdxDir } = await import('../src/normalize-mdx.ts');

const { processed, skipped, errors } = normalizeMdxDir(abs, { verbose: true });
console.log(`\nDone — processed: ${processed}, skipped: ${skipped}, errors: ${errors}`);
if (errors > 0) process.exit(1);

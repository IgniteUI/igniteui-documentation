/**
 * llmsPageTxt.mjs — Astro integration
 *
 * Hooks into the Astro build lifecycle to:
 *   1. Validate that every HTML doc page has a sibling llms.txt file.
 *   2. Log a summary report (page count, missing files, total size).
 *
 * The actual txt generation is handled by src/pages/[...slug]/llms.txt.ts
 * (a static API route) which runs earlier in the build. This integration
 * acts as the post-build verification / reporting layer.
 *
 * To extend: add your own post-processing logic in the `astro:build:done`
 * hook below (e.g. minification, upload to a CDN, etc.).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all files matching a predicate under `dir`. */
async function collectFiles(dir, predicate) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(full, predicate)));
    } else if (predicate(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Return human-readable file size string. */
function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ---------------------------------------------------------------------------
// Integration factory
// ---------------------------------------------------------------------------

export function llmsPageTxtIntegration() {
  return {
    name: 'llms-page-txt',
    hooks: {
      /**
       * astro:build:done
       *
       * Runs after all static files have been written to dist/.
       * Validates that every index.html page has a sibling llms.txt,
       * then prints a summary.
       */
      async 'astro:build:done'({ dir, logger }) {
        const distDir = fileURLToPath(dir);

        const VARIANTS = ['llms.txt', 'llms-full.txt', 'llms-small.txt'];

        // Collect all generated index.html and llms variant files
        const [htmlFiles, ...variantFileLists] = await Promise.all([
          collectFiles(distDir, (name) => name === 'index.html'),
          ...VARIANTS.map((v) => collectFiles(distDir, (name) => name === v)),
        ]);

        // Build a lookup set per variant: set of page dirs that have the file
        const variantSets = variantFileLists.map(
          (files) => new Set(files.map((f) => path.dirname(f)))
        );

        const missing = [];
        const variantBytes = VARIANTS.map(() => 0);
        const variantCounts = variantFileLists.map((f) => f.length);

        for (const html of htmlFiles) {
          const pageDir = path.dirname(html);
          const rel = path.relative(distDir, pageDir) || '/';
          // Root index.html (/) has no slug-based llms files — skip it.
          if (rel === '.') continue;

          const missingVariants = VARIANTS.filter((_, i) => !variantSets[i].has(pageDir));
          if (missingVariants.length > 0) {
            missing.push(`${rel} (missing: ${missingVariants.join(', ')})`);
          } else {
            for (let i = 0; i < VARIANTS.length; i++) {
              const stat = await fs.stat(path.join(pageDir, VARIANTS[i])).catch(() => null);
              if (stat) variantBytes[i] += stat.size;
            }
          }
        }

        // Summary report
        const totalFiles = variantCounts.reduce((a, b) => a + b, 0);
        const totalBytes = variantBytes.reduce((a, b) => a + b, 0);
        logger.info(
          `llms-page-txt — ${totalFiles} files generated across ${VARIANTS.length} variants, ` +
            `total size: ${humanSize(totalBytes)}`
        );
        for (let i = 0; i < VARIANTS.length; i++) {
          logger.info(`  ${VARIANTS[i]}: ${variantCounts[i]} files, ${humanSize(variantBytes[i])}`);
        }

        if (missing.length > 0) {
          logger.warn(
            `llms-page-txt — ${missing.length} page(s) missing variants:\n` +
              missing.map((r) => `  • ${r}`).join('\n')
          );
        } else {
          logger.info('llms-page-txt — all doc pages have llms.txt + llms-full.txt + llms-small.txt ✓');
        }
      },
    },
  };
}

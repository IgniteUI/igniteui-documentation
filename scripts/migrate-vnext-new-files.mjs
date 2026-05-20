#!/usr/bin/env node
// Apply DocFX → MDX migration transforms IN-PLACE on the 9 newly-imported pages.
// Reads the existing .mdx files (just renamed from .md) and rewrites them.
//
// This is split from the import step so that `git log --follow` shows:
//   1. content migration commit
//   2. .md → .mdx rename commit
//   3. ...the original docfx commit history (via format-patch + git am)
//
// Run: node scripts/migrate-vnext-new-files.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = process.cwd();

const FILES = [
    'docs/angular/src/content/en/components/ai/ai-assisted-development-overview.mdx',
    'docs/angular/src/content/en/components/ai/cli-mcp.mdx',
    'docs/angular/src/content/en/components/ai/maker-framework.mdx',
    'docs/angular/src/content/en/components/general/how-to/general-how-to-mcp-e2e.mdx',
    'docs/angular/src/content/jp/components/ai/ai-assisted-development-overview.mdx',
    'docs/angular/src/content/jp/components/ai/cli-mcp.mdx',
    'docs/angular/src/content/jp/components/ai/maker-framework.mdx',
    'docs/angular/src/content/jp/components/general-whats-new-dv.mdx',
    'docs/angular/src/content/jp/components/style-guide.mdx',
];

/** Apply DocFX → MDX migration rules. */
function migrate(content, { isJp }) {
    let out = content;
    const importsNeeded = new Set();

    // 1. Frontmatter cleanup
    out = out.replace(/^---\n([\s\S]*?)\n---/, (match, fm) => {
        let body = fm
            .replace(/^_description:/m, 'description:')
            .replace(/^_keywords:/m, 'keywords:')
            .replace(/^_license:/m, 'license:')
            .replace(/^_canonicalLink:/m, 'canonicalLink:');
        if (!isJp) body = body.replace(/^_language:\s*\w+\s*\n?/m, '');
        body = body
            .replace(/^namespace:.*\n?/m, '')
            .replace(/^last_updated:.*\n?/m, '');
        return `---\n${body}\n---`;
    });

    // 2. Drop the leading <!-- schema: ... --> comment after frontmatter
    out = out.replace(/^(---\n[\s\S]*?\n---\n+)<!--\s*schema:[^>]*-->\s*\n+/, '$1');

    // 3. >[!NOTE] / >[!WARNING] / >[!TIP] / >[!CAUTION] / >[!IMPORTANT] callouts
    out = out.replace(
        /^>\s*\[!(NOTE|TIP|WARNING|CAUTION|DANGER|IMPORTANT)\]\s*\n((?:^>.*\n)+)/gm,
        (m, kind, body) => {
            const typeMap = {
                NOTE: 'note',
                TIP: 'tip',
                WARNING: 'warning',
                CAUTION: 'warning',
                DANGER: 'danger',
                IMPORTANT: 'note',
            };
            const type = typeMap[kind] ?? 'note';
            const inner = body.replace(/^>\s?/gm, '').replace(/\n+$/, '');
            importsNeeded.add('DocsAside');
            return `<DocsAside type="${type}">\n\n${inner}\n\n</DocsAside>\n\n`;
        },
    );

    // 4. Strip {environment:...} prefix from canonicalLink values
    out = out.replace(
        /^canonicalLink:\s*"\{environment:[^}]+\}(\/[^"]*)"/m,
        (_m, p) => `canonicalLink: "${p}"`,
    );

    // 5. Add component imports right after frontmatter
    if (importsNeeded.size > 0) {
        const map = {
            DocsAside: `import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';`,
        };
        const imports = [...importsNeeded].map((n) => map[n]).filter(Boolean).join('\n');
        out = out.replace(/^(---\n[\s\S]*?\n---)\n+/, `$1\n\n${imports}\n\n`);
    }

    return out;
}

console.log('Applying DocFX -> MDX migration to imported files ...\n');
for (const rel of FILES) {
    const abs = join(REPO_ROOT, rel);
    if (!existsSync(abs)) {
        console.error(`  SKIP (missing) ${rel}`);
        continue;
    }
    const isJp = rel.includes('/jp/');
    const beforeRaw = readFileSync(abs, 'utf8');
    // Normalise CRLF -> LF for regex matching, then preserve original EOL on write.
    const usedCrlf = beforeRaw.includes('\r\n');
    const before = usedCrlf ? beforeRaw.replace(/\r\n/g, '\n') : beforeRaw;
    const migrated = migrate(before, { isJp });
    const after = usedCrlf ? migrated.replace(/\n/g, '\r\n') : migrated;
    if (after !== beforeRaw) {
        writeFileSync(abs, after, 'utf8');
        console.log(`  ~ ${rel}`);
    } else {
        console.log(`  = ${rel} (no change)`);
    }
}

console.log('\nDone. Manual review still recommended for:');
console.log('  - <img> tags  -> astro:assets <Image>');
console.log('  - {environment:...} URL tokens in body  -> <ApiLink> or hard-coded URL');
console.log('  - inline <p class="highlight"> blocks with multi-paragraph content');
console.log('  - toc.json entries (add new pages where appropriate)');

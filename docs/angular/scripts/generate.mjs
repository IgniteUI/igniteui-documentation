import { writeFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const get  = (prefix) => args.find(a => a.startsWith(prefix))?.split('=')[1];
const LANG = get('--lang=') ?? process.env.DOCS_LANG ?? 'en';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Write .platform.json so content.config.ts and getPlatformContext() resolve correctly
writeFileSync(path.join(ROOT, '.platform.json'), JSON.stringify({ platform: 'Angular', lang: LANG }, null, 2));
console.log(`[generate] lang: ${LANG}`);

// Clear Astro's content cache so the next build picks up fresh content
const cache = path.join(ROOT, '.astro');
if (existsSync(cache)) {
    rmSync(cache, { recursive: true, force: true });
    console.log('[generate] Cleared .astro cache.');
}

console.log('[generate] Done.');

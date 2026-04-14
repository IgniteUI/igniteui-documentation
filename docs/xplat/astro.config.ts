import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS } from 'docs-template/platform';
import { remarkEnv } from './src/plugins/remark-env.ts';
import { remarkApiLinks } from './src/plugins/remark-api-links.ts';

// ---------------------------------------------------------------------------
// Platform selection
//
// Priority (highest → lowest):
//   1. PLATFORM env var    (e.g. PLATFORM=Angular npm run dev)
//   2. .platform.json      (written by scripts/generate.mjs)
//   3. Default → 'React'
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveSetting(envKey: string, jsonKey: string, fallback: string): string {
    if (process.env[envKey]) return process.env[envKey]!;
    try {
        const file = path.join(__dirname, '.platform.json');
        if (existsSync(file)) {
            const cfg = JSON.parse(readFileSync(file, 'utf8'));
            if (cfg[jsonKey]) return cfg[jsonKey];
        }
    } catch { /* ignore */ }
    return fallback;
}

const platform = resolveSetting('PLATFORM', 'platform', 'React');
const lang = resolveSetting('LANG_CODE', 'lang', 'en');

// DOCS_ENV: 'development' | 'staging' | 'production'  (preferred, default: 'development')
// NODE_ENV: fallback — do NOT set to 'staging'; Vite derives import.meta.env.DEV from it.
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';

if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
	throw new Error(
		`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`
	);
}

const mode: DocsMode = docsEnv;

const PLATFORMS = IGDOCS_PLATFORMS;

const PROD_HOST = 'https://www.infragistics.com';
const STAGING_HOST = 'https://staging.infragistics.com';

const p = PLATFORMS[platform];
const site = mode === 'production' ? `${PROD_HOST}${p.base}`
    : mode === 'staging' ? `${STAGING_HOST}${p.base}`
    : `http://localhost:${p.devPort}`;

const XPLAT_ROOT = path.join(__dirname, 'generated', platform, lang);

console.log(`[astro.config] Platform: ${platform}  lang: ${lang}  mode: ${mode}  site: ${site}`);

// https://astro.build/config
export default createDocsSite({
    site,
    base: mode !== 'development' ? p.base : undefined,
    title: p.title,
    description: p.description,
    platform: p.key,
    navLang: lang === 'jp' ? 'ja' : lang,
    mode,
    source: {
        tocPath: path.join(XPLAT_ROOT, 'components', 'toc.json'),
        docsDir: path.join(XPLAT_ROOT, 'components'),
    },
    productLinks: Object.values(PLATFORMS).map(({ label, key, base: b }) => ({
        label,
        href: mode === 'production' ? `${PROD_HOST}${b}` : `${STAGING_HOST}${b}`,
        platform: key,
    })),
    starlight: {
        logo: { src: './public/favicon.svg' },
    },
    image: { service: { entrypoint: 'astro/assets/services/noop' } },
    markdown: { remarkPlugins: [remarkEnv, remarkApiLinks] },
});

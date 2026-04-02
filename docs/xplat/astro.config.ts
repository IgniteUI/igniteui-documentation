import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { type PlatformMeta } from 'docs-template/platform';
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

// NODE_ENV: 'development' | 'staging' | 'production'  (default: 'development')
const nodeEnv = process.env.NODE_ENV || 'development';
const mode: DocsMode = nodeEnv === 'production' ? 'prod'
    : nodeEnv === 'staging' ? 'staging'
        : 'dev';

// ---------------------------------------------------------------------------
// Single source of truth for all per-platform values
// ---------------------------------------------------------------------------

const PLATFORMS: Record<string, PlatformMeta> = {
    Angular: {
        title: 'Ignite UI for Angular',
        description: 'Reference docs for Ignite UI for Angular.',
        key: 'angular',
        devPort: 4331,
        base: '/docs-angular-new',
        igPath: 'ignite-ui-angular/angular/components',
        label: 'Angular',
    },
    React: {
        title: 'Ignite UI for React',
        description: 'Reference docs for Ignite UI for React.',
        key: 'react',
        devPort: 4332,
        base: '/docs-react-new',
        igPath: 'ignite-ui-react/react/components',
        label: 'React',
    },
    WebComponents: {
        title: 'Ignite UI for Web Components',
        description: 'Reference docs for Ignite UI for Web Components.',
        key: 'web-components',
        devPort: 4333,
        base: '/docs-wc-new',
        igPath: 'ignite-ui-web-components/web-components/components',
        label: 'Web Components',
    },
    Blazor: {
        title: 'Ignite UI for Blazor',
        description: 'Reference docs for Ignite UI for Blazor.',
        key: 'blazor',
        devPort: 4334,
        base: '/docs-blazor-new',
        igPath: 'ignite-ui-blazor/blazor/components',
        label: 'Blazor',
    },
};

const igBase = mode === 'prod'
    ? 'https://www.infragistics.com/products/'
    : 'https://staging.infragistics.com/products/';

const p = PLATFORMS[platform];
const site = mode === 'dev' ? `http://localhost:${p.devPort}` : `${igBase}${p.igPath}`;

const XPLAT_ROOT = path.join(__dirname, 'generated', platform, lang);

console.log(`[astro.config] Platform: ${platform}  lang: ${lang}  mode: ${mode}  site: ${site}`);

// https://astro.build/config
export default createDocsSite({
    site,
    base: mode !== 'dev' ? p.base : undefined,
    title: p.title,
    description: p.description,
    platform: p.key,
    navLang: lang === 'jp' ? 'ja' : lang,
    mode,
    source: {
        tocPath: path.join(XPLAT_ROOT, 'components', 'toc.json'),
        docsDir: path.join(XPLAT_ROOT, 'components'),
    },
    productLinks: Object.values(PLATFORMS).map(({ label, key, igPath }) => ({
        label,
        href: `${igBase}${igPath}`,
        platform: key,
    })),
    starlight: {
        logo: { src: './public/favicon.svg' },
    },
    image: { service: { entrypoint: 'astro/assets/services/noop' } },
    markdown: { remarkPlugins: [remarkEnv, remarkApiLinks] },
});

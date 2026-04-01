import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { type PlatformKey, type PlatformMeta } from 'docs-template/platform';
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
const lang     = resolveSetting('LANG_CODE', 'lang',     'en');

// NODE_ENV: 'development' | 'staging' | 'production'  (default: 'development')
const nodeEnv = process.env.NODE_ENV || 'development';
const mode: DocsMode = nodeEnv === 'production' ? 'prod'
    : nodeEnv === 'staging' ? 'staging'
    : 'dev';

// ---------------------------------------------------------------------------
// Per-platform site metadata
// ---------------------------------------------------------------------------

const PLATFORM_META: Record<string, PlatformMeta> = {
    Angular: {
        title: 'Ignite UI for Angular',
        description: 'Reference docs for Ignite UI for Angular.',
    },
    React: {
        title: 'Ignite UI for React',
        description: 'Reference docs for Ignite UI for React.',
    },
    WebComponents: {
        title: 'Ignite UI for Web Components',
        description: 'Reference docs for Ignite UI for Web Components.',
    },
    Blazor: {
        title: 'Ignite UI for Blazor',
        description: 'Reference docs for Ignite UI for Blazor.',
    },
};

const PLATFORM_KEY: Record<string, PlatformKey> = {
    Angular: 'angular',
    React: 'react',
    WebComponents: 'web-components',
    Blazor: 'blazor',
};

const PROD_SITE: Record<string, string> = {
    Angular: 'https://www.infragistics.com/products/ignite-ui-angular/angular/components',
    React: 'https://www.infragistics.com/products/ignite-ui-react/react/components',
    WebComponents: 'https://www.infragistics.com/products/ignite-ui-web-components/web-components/components',
    Blazor: 'https://www.infragistics.com/products/ignite-ui-blazor/blazor/components',
};

const STAGING_SITE: Record<string, string> = {
    Angular: 'https://staging.infragistics.com/products/ignite-ui-angular/angular/components',
    React: 'https://staging.infragistics.com/products/ignite-ui-react/react/components',
    WebComponents: 'https://staging.infragistics.com/products/ignite-ui-web-components/web-components/components',
    Blazor: 'https://staging.infragistics.com/products/ignite-ui-blazor/blazor/components',
};

// Dev-server ports — must match docs/xplat/package.json script --port values
const DEV_PORT: Record<string, number> = {
    Angular: 4331,
    React: 4332,
    WebComponents: 4333,
    Blazor: 4334,
};

// ── Resolved values for this build ───────────────────────────────────────────────
const meta = PLATFORM_META[platform];
const site = mode === 'prod' ? PROD_SITE[platform]
    : mode === 'staging' ? STAGING_SITE[platform]
        : `http://localhost:${DEV_PORT[platform]}`;

const XPLAT_ROOT = path.join(__dirname, 'generated', platform, lang);

console.log(`[astro.config] Platform: ${platform}  lang: ${lang}  mode: ${mode}  site: ${site}`);

// https://astro.build/config
export default createDocsSite({
    site,
    title: meta.title,
    description: meta.description,
    platform: PLATFORM_KEY[platform],
    navLang: lang === 'jp' ? 'ja' : lang,
    mode,
    source: {
        tocPath: path.join(XPLAT_ROOT, 'components', 'toc.json'),
        docsDir: path.join(XPLAT_ROOT, 'components'),
    },
    starlight: {
        logo: { src: './public/favicon.svg' },
    },
    // Serve images statically from public/ — no Astro image optimization needed
    image: { service: { entrypoint: 'astro/assets/services/noop' } },
    markdown: { remarkPlugins: [remarkEnv, remarkApiLinks] },
});

import path from 'node:path';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { generateGridTopics, normalizeImagePaths } from './src/generate-grids.mjs';
import { remarkEnv } from './src/plugins/remark-env.mjs';

// ── Build mode and language ──────────────────────────────────────────────────
// NODE_ENV: 'development' | 'staging' | 'production'  (default: 'development')
// DOCS_LANG: 'en' | 'jp' | 'kr'                       (default: 'en')
const nodeEnv = process.env.NODE_ENV || 'development';
const docsLang = process.env.DOCS_LANG || 'en';

const mode: DocsMode = nodeEnv === 'production' ? 'prod'
    : nodeEnv === 'staging' ? 'staging'
    : 'dev';

// ── Site URL — varies by build mode ─────────────────────────────────────────
const PROD_SITE    = 'https://www.infragistics.com/products/ignite-ui-angular/angular/components';
const STAGING_SITE = 'https://staging.infragistics.com/products/ignite-ui-angular/angular/components';
const DEV_SITE     = 'http://localhost:4321';

const site = mode === 'prod' ? PROD_SITE
    : mode === 'staging' ? STAGING_SITE
    : DEV_SITE;

// ── Source paths ─────────────────────────────────────────────────────────────
const docsDir           = path.resolve(`./src/content/${docsLang}`);
const componentsDocsDir = path.join(docsDir, 'components');
const templatesDir      = path.join(docsDir, 'grids_templates');

// ── Pre-build steps (run before Astro starts) ────────────────────────────────
generateGridTopics(templatesDir, componentsDocsDir);
normalizeImagePaths(componentsDocsDir);

// https://astro.build/config
export default createDocsSite({
    site,
    title: 'Ignite UI for Angular',
    description: 'Component and API reference docs for Ignite UI for Angular.',
    platform: 'angular',
    navLang: docsLang === 'jp' ? 'ja' : docsLang,
    mode,
    source: {
        tocPath: path.join(componentsDocsDir, 'toc.yml'),
        docsDir: componentsDocsDir,
        imagesDir: path.join(docsDir, 'images'),
    },
    sidebar: { exclude: [/^internal\//] },
    starlight: {
        // logo: { src: './public/favicon.svg' },
    },
    image: { service: { entrypoint: 'astro/assets/services/noop' } },
    markdown: { remarkPlugins: [remarkEnv] },
});

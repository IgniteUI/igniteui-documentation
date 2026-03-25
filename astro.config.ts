import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { buildSidebarFromToc, staticImagesIntegration, siteMetaIntegration } from './src/integration';
import { getPlatformHead } from './src/platform';
import path from 'node:path';
import { loadEnv } from 'vite';

// Load .env into process.env — Vite/Astro does this for the browser bundle
// but NOT for astro.config.ts itself, so we do it explicitly here.
const env = loadEnv('', process.cwd(), '');
Object.assign(process.env, env);

// ---------------------------------------------------------------------------
// Source paths — set via DOCS_SOURCE_PATH env var.
// For local development copy .env.example to .env and set an absolute path:
//   DOCS_SOURCE_PATH=C:/Repos/docs/igniteui-docfx   (Windows)
//   DOCS_SOURCE_PATH=/home/user/repos/igniteui-docfx  (macOS/Linux)
// In CI/CD this is provided by the pipeline environment.
// Consuming repos use createDocsSite({ source: { docsDir } }) which sets
// the env var automatically — this manual config is the template's own demo.
// ---------------------------------------------------------------------------

if (!process.env.DOCS_SOURCE_PATH) {
    throw new Error(
        '[docs-template] DOCS_SOURCE_PATH env var is required. ' +
        'Copy .env.example to .env and set an absolute path to the docs source repo root. ' +
        'When using createDocsSite({ source: { docsDir } }), this is set automatically.'
    );
}

const SOURCE_ROOT = path.resolve(process.env.DOCS_SOURCE_PATH);
const COMPONENTS = path.join(SOURCE_ROOT, 'en/components');
const IMAGES = path.join(SOURCE_ROOT, 'en/images');
const TOC_PATH = path.join(SOURCE_ROOT, 'en/components/toc.yml');

// Narrow DOCS_SOURCE_PATH to the components dir so content.config.ts uses
// it as the glob base (same as what createDocsSite does automatically).
process.env.DOCS_SOURCE_PATH = COMPONENTS;

const sidebar = buildSidebarFromToc({
  tocPath: TOC_PATH,
  docsDir: COMPONENTS,
  exclude: [
    /^grids_templates\//i,
    /^style-guide\.md$/i,
    /^themes\/sass\/presets\//i,
    /^themes\.md$/i,
  ],
});

// // Ensure a default build mode for local/demo usage.
// process.env.DOCS_BUILD_MODE = process.env.DOCS_BUILD_MODE ?? 'dev';
// const DOCS_BUILD_MODE = process.env.DOCS_BUILD_MODE;

// https://astro.build/config
export default defineConfig({
  site: 'https://igniteui.github.io/docs-template',
  // base: '/docs-template', // Uncomment if deploying to a subpath
  compressHTML: true,
  build: {
    assets: '_assets',
  },
  // Ensure Sass `@import 'highlight.js/…'` resolves from node_modules
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.join(process.cwd(), 'node_modules')],
          // The if-function deprecation originates inside igniteui-theming
          // (vendor code in node_modules we cannot modify). Silence only that.
          silenceDeprecations: ['if-function'],
        },
      },
    },
  },
  image: {
    // Disable built-in image optimization — images are served statically
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  integrations: [
    starlight({
      title: 'Ignite UI for Angular',
      logo: {
        src: './public/favicon.svg',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/IgniteUI/igniteui-angular' },
      ],
      sidebar,
      // Prepend the packaged theme entry so consuming projects get the theme.
      customCss: ['./src/styles/custom.css'],
      head: [
        // Platform CDN assets — driven by platform below
        ...getPlatformHead('angular', 'en'),
        // Angular-specific Ignite UI component bundle (repo-specific, not in shared registry)
        // { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/products/ignite-ui-angular/angular/bundles/igniteui.f5cfb48022e69dd66658.css' } },
      ],
      editLink: {
        baseUrl: 'https://github.com/IgniteUI/igniteui-docfx/edit/master/en/components/',
      },
      components: {
        Header: './src/components/overrides/Header.astro',
        Footer: './src/components/overrides/Footer.astro',
      },
    }),
    staticImagesIntegration(IMAGES),
    siteMetaIntegration({
      title: 'Ignite UI for Angular',
      platform: 'angular',
      description:
        'Complete reference documentation for Ignite UI for Angular — a Material-based ' +
        'UI component library including Data Grid, Charts, Gauges, Calendars, and more.',
      docsDir: COMPONENTS,
      sidebar,
    }),
  ],
  markdown: {
    remarkPlugins: [
      (await import('./src/plugins/remark-docfx')).remarkDocfx,
    ],
  },
});


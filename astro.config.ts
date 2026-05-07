import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
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
// ---------------------------------------------------------------------------

if (!process.env.DOCS_SOURCE_PATH) {
  throw new Error(
    '[docs-template] DOCS_SOURCE_PATH env var is required. ' +
    'Copy .env.example to .env and set an absolute path to the docs source repo root.'
  );
}

const SOURCE_ROOT = path.resolve(process.env.DOCS_SOURCE_PATH);
const COMPONENTS = path.join(SOURCE_ROOT, 'en/components');
const IMAGES = path.join(SOURCE_ROOT, 'en/images');
const TOC_PATH = path.join(SOURCE_ROOT, 'en/components/toc.yml');

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

// https://astro.build/config
export default defineConfig({
  site: 'localhost:4321',
  compressHTML: true,
  build: {
    assets: '_assets',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.join(process.cwd(), 'node_modules')],
          silenceDeprecations: ['if-function'],
        },
      },
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  integrations: [
    siteMetaIntegration({
      title: 'Ignite UI for Angular',
      platform: 'angular',
      description:
        'Complete reference documentation for Ignite UI for Angular — a Material-based ' +
        'UI component library including Data Grid, Charts, Gauges, Calendars, and more.',
      docsDir: COMPONENTS,
      sidebar,
      head: [
        ...getPlatformHead('angular', 'en'),
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css' } },
        { tag: 'script', attrs: { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js', defer: true } },
      ],
      productLinks: [
        { label: 'Angular',        href: '#', platform: 'angular' },
        { label: 'React',          href: '#', platform: 'react' },
        { label: 'Blazor',         href: '#', platform: 'blazor' },
        { label: 'Web Components', href: '#', platform: 'web-components' },
      ],
    }),
    mdx(),
    staticImagesIntegration(IMAGES),
  ],
  markdown: {
    remarkPlugins: [
      (await import('./src/plugins/remark-docfx')).remarkDocfx,
    ],
    rehypePlugins: [
      (await import('./src/plugins/remark-docfx')).rehypeCodeView,
    ],
  },
});

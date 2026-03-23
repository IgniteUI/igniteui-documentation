import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { buildSidebarFromToc, staticImagesIntegration, siteMetaIntegration } from './src/integration.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Source paths — specific to this repo (igniteui-docfx / Angular docs).
// Consuming repos define their own equivalent block and pass it to the shared
// buildSidebarFromToc() / createDocsCollection() helpers.
// ---------------------------------------------------------------------------

const SOURCE_ROOT =
  process.env.DOCS_SOURCE_PATH
    ? path.resolve(process.env.DOCS_SOURCE_PATH)
    : path.resolve(__dirname, '..', 'igniteui-docfx');

const COMPONENTS = path.join(SOURCE_ROOT, 'en/components');
const IMAGES     = path.join(SOURCE_ROOT, 'en/images');
const TOC_PATH   = path.join(SOURCE_ROOT, 'en/components/toc.yml');

const sidebar = buildSidebarFromToc({
  tocPath: TOC_PATH,
  componentsDir: COMPONENTS,
  exclude: [
    /^grids_templates\//i,
    /^style-guide\.md$/i,
    /^themes\/sass\/presets\//i,
    /^themes\.md$/i,
  ],
});

// https://astro.build/config
export default defineConfig({
  site: 'https://igniteui.github.io/docs-template',
  // base: '/docs-template', // Uncomment if deploying to a subpath
  compressHTML: true,
  build: {
    assets: '_assets',
  },
  vite: {
    css: {
      preprocessorOptions: {
        // Allow Sass files to resolve igniteui-theming subpaths via node_modules
        scss: {
          loadPaths: [path.resolve(__dirname, 'node_modules')],
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
      customCss: [
        './src/styles/ig-theme.scss',
      ],
      editLink: {
        baseUrl: 'https://github.com/IgniteUI/igniteui-docfx/edit/master/en/components/',
      },
    }),
    staticImagesIntegration(IMAGES),
    siteMetaIntegration({
      title: 'Ignite UI for Angular',
      description:
        'Complete reference documentation for Ignite UI for Angular — a Material-based ' +
        'UI component library including Data Grid, Charts, Gauges, Calendars, and more.',
      docsSourcePath: COMPONENTS,
      sidebar,
    }),
  ],
  markdown: {
    remarkPlugins: [
      (await import('./src/plugins/remark-docfx.mjs')).remarkDocfx,
    ],
  },
});
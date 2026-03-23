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
const IMAGES = path.join(SOURCE_ROOT, 'en/images');
const TOC_PATH = path.join(SOURCE_ROOT, 'en/components/toc.yml');

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
      customCss: ['./src/styles/custom.css'],
      head: [
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/layout.css' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/products/ignite-ui-angular/angular/bundles/igniteui.f5cfb48022e69dd66658.css' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/animate-custom.css' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/fontello.css' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', integrity: 'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u', crossorigin: 'anonymous' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/css/navigation.css' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/css/footer.css' } },
        { tag: 'script', attrs: { src: 'https://code.jquery.com/jquery-3.1.0.js', integrity: 'sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=', crossorigin: 'anonymous' } },
        { tag: 'script', attrs: { src: 'https://www.infragistics.com/assets/modern/scripts/plugins.nav.js' } },
        { tag: 'script', attrs: { src: 'https://www.infragistics.com/assets/modern/scripts/navigation.js' } },
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
      prefetchNav: true,
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
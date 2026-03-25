import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { buildSidebarFromToc, staticImagesIntegration, siteMetaIntegration } from './src/integration.mjs';
import { getPlatformHead } from './src/platform.mjs';
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
    : path.resolve('C:/Users/dtsvetkov/Work/igniteui-docfx');

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
  vite: {
    plugins: [
      {
        // Collapse multi-line <code-view> attribute lists to a single line so
        // remark can parse them as a type-7 HTML block and our remark-docfx
        // plugin can transform them.
        //
        // Before:  <code-view style="height:460px"\n
        //                     data-demos-base-url="..."\n
        //                     iframe-src="..." alt="...">\n</code-view>
        // After:   <code-view style="height:460px" data-demos-base-url="..." iframe-src="..." alt="...">
        //          </code-view>
        name: 'vite-preprocess-code-view',
        enforce: 'pre',
        transform(code, id) {
          if (!id.match(/\.(md|mdx)($|\?)/)) return null;
          const processed = code.replace(
            /<code-view([\s\S]*?)>\s*<\/code-view>/g,
            (_m, attrs) => {
              const flat = attrs.replace(/\s+/g, ' ').trim();
              return `<code-view ${flat}>\n</code-view>`;
            }
          );
          if (processed === code) return null;
          return { code: processed, map: null };
        },
      },
    ],
  },
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
        // Platform CDN assets — driven by `platform` option in siteMetaIntegration below
        ...getPlatformHead('angular', 'en'),
        // Angular-specific Ignite UI component bundle (repo-specific, not in shared registry)
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/products/ignite-ui-angular/angular/bundles/igniteui.f5cfb48022e69dd66658.css' } },
        // Code-view widget — replicates the old igniteui-docfx-template runtime widget
        { tag: 'script', attrs: { src: '/scripts/code-view.js', defer: true } },
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
      platform: 'angular', // Used to drive platform-specific features like CDN assets and global nav configuration
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
    rehypePlugins: [
      (await import('./src/plugins/remark-docfx.mjs')).rehypeCodeView,
    ],
  },
});
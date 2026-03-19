/**
 * integration.mjs
 *
 * Shared configuration helpers for Astro + Starlight docs sites.
 * All functions are independently usable; `createDocsSite` is the
 * convenience wrapper that composes them all.
 *
 * --- Option A: one-liner config (recommended for standard setups) ---
 *
 *   import { createDocsSite } from 'docs-template/integration';
 *
 *   export default createDocsSite({
 *     site:  'https://my-org.github.io/my-docs',
 *     title: 'My Library',
 *     description: 'Reference docs for My Library.',
 *     source: {
 *       tocPath:       './my-docs/toc.yml',
 *       componentsDir: './my-docs/en/components',
 *       imagesDir:     './my-docs/en/images',   // omit to skip image serving
 *     },
 *     sidebar: { exclude: [/^internal\//] },   // optional TOC excludes
 *     // Extra Starlight options (logo, social, editLink, customCss, …)
 *     starlight: {
 *       logo: { src: './public/favicon.svg' },
 *     },
 *     // Extra Astro options (markdown, image, build, …)
 *     markdown: { remarkPlugins: [] },
 *   });
 *
 * --- Option B: manual composition (for full control) ---
 *
 *   import { buildSidebarFromToc, staticImagesIntegration, siteMetaIntegration } from 'docs-template/integration';
 *
 *   const sidebar = buildSidebarFromToc({ tocPath, componentsDir });
 *
 *   export default defineConfig({
 *     integrations: [
 *       siteMetaIntegration({ title: 'My Library', description: 'Reference docs.' }),
 *       starlight({ sidebar }),
 *       staticImagesIntegration('/abs/path/to/my-docs/images'),
 *     ],
 *   });
 *
 * Generated output:
 *   /llms.txt              — manifest listing every page with its .md URL
 *   /{slug}.md             — raw markdown for each page (env-vars substituted)
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { buildSidebarFromToc } from './sidebar.mjs';
import { replaceEnvVars } from './plugins/remark-docfx.mjs';

// ---------------------------------------------------------------------------
// Sidebar slug → metadata map
// ---------------------------------------------------------------------------

function buildSlugMetaMap(sidebar) {
  const map = new Map();
  function walk(items, groupLabel) {
    for (const item of items) {
      if (typeof item.slug === 'string') {
        map.set(item.slug, { metaTitle: item.label, groupMetaTitle: groupLabel ?? '' });
      }
      if (Array.isArray(item.items)) {
        walk(item.items, groupLabel ?? item.label);
      }
    }
  }
  walk(sidebar ?? [], null);
  return map;
}

function injectFrontmatterKeys(raw, keys) {
  const extra = Object.entries(keys)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
  if (/^---\r?\n/.test(raw)) {
    const afterOpen = raw.indexOf('\n') + 1;
    const closeOffset = raw.slice(afterOpen).search(/^---[ \t]*(\r?\n|$)/m);
    if (closeOffset !== -1) {
      const closeIdx = afterOpen + closeOffset;
      return raw.slice(0, closeIdx) + extra + '\n' + raw.slice(closeIdx);
    }
  }
  return `---\n${extra}\n---\n\n${raw}`;
}

// ---------------------------------------------------------------------------
// Site meta virtual module
// ---------------------------------------------------------------------------

/**
 * Astro integration that exposes site metadata as the virtual module
 * `virtual:docs-template/site-meta`, consumed by `src/pages/llms.txt.ts`.
 *
 * @param {object} options
 * @param {string} options.title        Site title.
 * @param {string} [options.description] Short description for the llms.txt header.
 * @param {string} [options.docsSourcePath] Path to the source markdown files.
 * @returns {import('astro').AstroIntegration}
 */
export function siteMetaIntegration({ title, description = '', docsSourcePath, sidebar } = {}) {
  const slugMeta = buildSlugMetaMap(sidebar);
  const moduleCode = `export const title = ${JSON.stringify(title)};
export const description = ${JSON.stringify(description)};
export const sidebar = ${JSON.stringify(sidebar ?? [])};
`;
  const virtualId = 'virtual:docs-template/site-meta';
  const resolvedId = '\0' + virtualId;

  return {
    name: 'docs-template:site-meta',
    hooks: {
      'astro:config:setup'({ updateConfig, injectRoute }) {
        injectRoute({
          pattern: '/llms.txt',
          entrypoint: fileURLToPath(new URL('./routes/llms.txt.ts', import.meta.url)),
          prerender: true,
        });
        updateConfig({
          vite: {
            plugins: [{
              name: 'vite-plugin-docs-template-site-meta',
              resolveId(id) { if (id === virtualId) return resolvedId; },
              load(id) { if (id === resolvedId) return moduleCode; },
            }],
          },
        });
      },

      'astro:server:setup'({ server }) {
        if (!docsSourcePath) return;
        server.middlewares.use(async (req, res, next) => {
          // Only handle requests ending in .md
          if (!req.url?.endsWith('.md')) return next();
          // Strip leading slash and .md suffix to get the slug
          const slug = req.url.slice(1, -3);
          for (const ext of ['.md', '.mdx']) {
            const src = path.join(docsSourcePath, slug + ext);
            try {
              const raw = await fsp.readFile(src, 'utf-8');
              const meta = slugMeta.get(slug);
              const content = meta ? injectFrontmatterKeys(replaceEnvVars(raw), meta) : replaceEnvVars(raw);
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.end(content);
              return;
            } catch { /* try next extension */ }
          }
          next();
        });
      },

      async 'astro:build:done'({ dir, pages }) {
        if (!docsSourcePath) return;
        const outDir = fileURLToPath(dir);

        // pages[].pathname is like "accordion/" or "charts/chart-api/" — strip trailing slash.
        const slugs = pages
          .map(p => p.pathname.replace(/\/$/, ''))
          .filter(s => s && s !== '404' && s !== 'index');

        await Promise.all(
          slugs.map(async (slug) => {
            for (const ext of ['.md', '.mdx']) {
              const src = path.join(docsSourcePath, slug + ext);
              try {
                const raw = await fsp.readFile(src, 'utf-8');
                const meta = slugMeta.get(slug);
                const content = meta ? injectFrontmatterKeys(replaceEnvVars(raw), meta) : replaceEnvVars(raw);
                const dest = path.join(outDir, slug + '.md');
                await fsp.mkdir(path.dirname(dest), { recursive: true });
                await fsp.writeFile(dest, content, 'utf-8');
                break;
              } catch { /* try next extension */ }
            }
          })
        );
      },
    },
  };
}

export { buildSidebarFromToc };
// ---------------------------------------------------------------------------
// Static images integration
// ---------------------------------------------------------------------------

const MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
  avif: 'image/avif', ico: 'image/x-icon',
};

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

/**
 * Astro integration that serves a local images directory during development
 * (via Vite middleware) and copies it to the build output.
 *
 * Usage:
 *   import { staticImagesIntegration } from 'docs-template/integration';
 *
 *   export default defineConfig({
 *     integrations: [
 *       ...,
 *       staticImagesIntegration('/abs/path/to/images'),
 *     ],
 *   });
 *
 * @param {string} imagesDir  Absolute path to the directory of images to serve.
 * @param {object} [options]
 * @param {string} [options.urlPath='/images']  URL prefix under which images are served.
 * @returns {import('astro').AstroIntegration}
 */
export function staticImagesIntegration(imagesDir, { urlPath = '/images' } = {}) {
  return {
    name: 'static-images',
    hooks: {
      'astro:server:setup'({ server }) {
        server.middlewares.use(urlPath, (req, res, next) => {
          // Normalise and prevent path traversal
          const safePath = path.normalize(req.url || '/').replace(/\.\./g, '');
          const filePath = path.join(imagesDir, safePath);
          try {
            if (fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).slice(1).toLowerCase();
              res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch { /* file not found — fall through */ }
          next();
        });
      },
      async 'astro:build:done'({ dir }) {
        const destImages = path.join(fileURLToPath(dir), urlPath.replace(/^\//, ''));
        copyDirSync(imagesDir, destImages);
      },
    },
  };
}

// ---------------------------------------------------------------------------
// All-in-one factory
// ---------------------------------------------------------------------------

/**
 * Creates a complete Astro config for a standard Starlight docs site.
 *
 * All individual helpers (`buildSidebarFromToc`, `withSidebarLlmsSets`,
 * `staticImagesIntegration`) remain independently importable for cases that
 * need finer control.
 *
 * @param {object}   options
 * @param {string}   options.site                     Deployed site URL.
 * @param {string}   [options.base]                   Base path, e.g. '/docs'.
 * @param {string}   options.title                    Starlight site title.
 * @param {object}   options.source                   Content source paths.
 * @param {string}   options.source.tocPath           Absolute path to the TOC file.
 * @param {string}   options.source.componentsDir     Absolute path to Markdown directory.
 * @param {string}   [options.source.imagesDir]       Absolute path to images directory.
 *                                                     Omit to skip the images integration.
 * @param {object}   [options.sidebar={}]             Sidebar builder options.
 * @param {RegExp[]} [options.sidebar.exclude=[]]     Patterns to exclude from the TOC.
 * @param {string}   [options.description='']         Short description for the llms.txt header.
 * @param {object}   [options.starlight={}]           Extra Starlight options (logo, social,
 *                                                     editLink, customCss, plugins, …).
 * @param {Array}    [options.integrations=[]]        Extra Astro integrations appended after
 *                                                     the built-in ones.
 * @param {...*}     options                          Any remaining keys are spread into
 *                                                     `defineConfig` (markdown, image, build, …).
 * @returns {import('astro').AstroConfig}
 */
export function createDocsSite(options = {}) {
  const {
    site,
    base,
    title,
    description = '',
    source = {},
    sidebar: sidebarOptions = {},
    starlight: starlightExtra = {},
    integrations: extraIntegrations = [],
    ...astroExtra
  } = options;

  const sidebar = buildSidebarFromToc({
    tocPath: source.tocPath,
    componentsDir: source.componentsDir,
    exclude: sidebarOptions.exclude ?? [],
  });

  return defineConfig({
    site,
    ...(base !== undefined ? { base } : {}),
    ...astroExtra,
    integrations: [
      siteMetaIntegration({ title, description, docsSourcePath: source.componentsDir }),
      starlight({ title, sidebar, ...starlightExtra }),
      ...(source.imagesDir ? [staticImagesIntegration(source.imagesDir)] : []),
      ...extraIntegrations,
    ],
  });
}


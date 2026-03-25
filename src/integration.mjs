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
 *     platform: 'angular',   // drives CDN head entries + nav prefetch
 *     navLang: 'en',         // 'en' | 'ja' | 'kr'
 *     source: {
 *       tocPath:       './my-docs/toc.yml',
 *       componentsDir: './my-docs/en/components',
 *       imagesDir:     './my-docs/en/images',   // omit to skip image serving
 *     },
 *     sidebar: { exclude: [/^internal\//] },   // optional TOC excludes
 *     head: [                                   // extra <head> entries after platform ones
 *       { tag: 'link', attrs: { rel: 'stylesheet', href: '...' } },
 *     ],
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
import { getNavConfig, getPlatformHead } from './platform.mjs';

// ---------------------------------------------------------------------------
// Navigation HTML prefetch cache + helpers
// ---------------------------------------------------------------------------

/** Module-level cache so the nav URL is fetched at most once per build. */
let _navHtmlCache = null;

/**
 * Strip all <script> tags from an HTML string.
 * The nav HTML fetched from infragistics.com / appbuilder.dev may contain
 * inline or external scripts that don't belong in the docs page (e.g.
 * staging.appbuilder.dev references in the IG nav).  Platform-specific
 * scripts are already injected cleanly via getPlatformHead().
 */
function stripScripts(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

/**
 * Rewrite root-relative href/src/action attributes in nav HTML to absolute
 * URLs using the given base origin (e.g. 'https://www.infragistics.com').
 *
 * Without this, links like href="/products/ignite-ui" resolve against the
 * local dev-server origin and Astro's client-side router intercepts them,
 * logging 404 warnings for every nav-bar link the user hovers or clicks.
 */
function absolutifyNavUrls(html, baseOrigin) {
  return html
    .replace(/(href|src|action)="(\/)([^"]*)"/g, `$1="${baseOrigin}/$3"`)
    .replace(/(href|src|action)='(\/)([^']*)'/g, `$1='${baseOrigin}/$3'`);
}

/**
 * Nesting-aware outer-HTML extractor.
 * Finds the first tag whose opening tag matches `openPattern` and returns
 * the complete element including its closing tag.
 *
 * @param {string} html       Full HTML string to search.
 * @param {string} openPattern  Regex source for the opening tag (no flags).
 * @returns {string}
 */
function extractOuterHtml(html, openPattern) {
  const openRe = new RegExp(openPattern, 'i');
  const tagRe = /<\/?([a-z][a-z0-9]*)[^>]*>/gi;

  let tagName = null;
  let depth = 0;
  let startIdx = -1;

  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const full = m[0];
    const name = m[1].toLowerCase();
    const isSelfClose = full.endsWith('/>');
    const isClose = full.startsWith('</');

    if (tagName === null) {
      if (openRe.test(full)) {
        tagName = name;
        startIdx = m.index;
        depth = isSelfClose ? 0 : 1;
        if (depth === 0) return full;
      }
      continue;
    }

    if (name !== tagName) continue;
    if (isSelfClose) continue;
    if (isClose) { depth--; if (depth === 0) return html.slice(startIdx, tagRe.lastIndex); }
    else depth++;
  }

  return '';
}

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
export function siteMetaIntegration({ title, description = '', docsSourcePath, sidebar, platform = null, navLang = 'en', prefetchNav = false, prefetchAppBuilderNav = false } = {}) {
  const slugMeta = buildSlugMetaMap(sidebar);
  const moduleCode = `export const title = ${JSON.stringify(title)};
export const description = ${JSON.stringify(description)};
export const sidebar = ${JSON.stringify(sidebar ?? [])};
`;
  const virtualId = 'virtual:docs-template/site-meta';
  const resolvedId = '\0' + virtualId;

  const navVirtualId = 'virtual:docs-template/nav-html';
  const navResolvedId = '\0' + navVirtualId;

  // Resolve effective platform: explicit `platform` option wins; fall back to
  // deprecated boolean flags for backwards compatibility.
  const effectivePlatform =
    platform ??
    (prefetchAppBuilderNav ? 'appbuilder' : null) ??
    (prefetchNav ? 'angular' : null);

  const { navType, navUrl } = getNavConfig(effectivePlatform, navLang);

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
              resolveId(id) {
                if (id === virtualId) return resolvedId;
                if (id === navVirtualId) return navResolvedId;
              },
              async load(id) {
                if (id === resolvedId) return moduleCode;
                if (id !== navResolvedId) return;

                // Return cached module code — fetched at most once per build.
                if (_navHtmlCache) return _navHtmlCache;

                let headerHtml = '';
                let uiFooterHtml = '';
                let footerHtml = '';

                // ── IG nav prefetch ──────────────────────────────────────────
                if (navType === 'infragistics' && navUrl) {
                  try {
                    const res = await fetch(navUrl, {
                      credentials: 'omit',
                      signal: AbortSignal.timeout(15_000),
                    });
                    if (res.ok) {
                      const html = await res.text();
                      const igBase = navLang === 'ja' ? 'https://jp.infragistics.com' : 'https://www.infragistics.com';
                      headerHtml   = absolutifyNavUrls(stripScripts(extractOuterHtml(html, '<header[^>]+id="header"')), igBase);
                      uiFooterHtml = absolutifyNavUrls(stripScripts(extractOuterHtml(html, '<footer[^>]+class="[^"]*\\bui-footer\\b')), igBase);
                      footerHtml   = absolutifyNavUrls(stripScripts(extractOuterHtml(html, '<footer[^>]+id="footer"')), igBase);
                      // Strip the hello-bar promotional strip
                      headerHtml = headerHtml.replace(
                        /<div[^>]+id="hello-bar"[\s\S]*?<\/div>\s*/i, ''
                      );
                    } else {
                      console.warn(`[docs-template] Navigation fetch returned ${res.status} — falling back to empty markup.`);
                    }
                  } catch (err) {
                    console.warn(`[docs-template] Could not fetch navigation HTML: ${err.message} — falling back to empty markup.`);
                  }
                }

                // ── AppBuilder nav prefetch ──────────────────────────────────
                let abHeaderHtml = '';
                let abFooterHtml = '';
                let abFooterUtilsHtml = '';
                let abFooterCopyrightHtml = '';
                let abContactSalesHtml = '';

                if (navType === 'appbuilder' && navUrl) {
                  try {
                    const abRes = await fetch(navUrl, {
                      credentials: 'omit',
                      signal: AbortSignal.timeout(15_000),
                    });
                    if (abRes.ok) {
                      const abRaw = await abRes.text();
                      // Endpoint may return JSON { header, footer } or a full HTML page.
                      let parsed = false;
                      try {
                        const data = JSON.parse(abRaw);
                        if (data.header || data.footer) {
                          abHeaderHtml = data.header ?? '';
                          abFooterHtml = data.footer ?? '';
                          parsed = true;
                        }
                      } catch { /* not JSON — fall through to HTML extraction */ }

                      if (!parsed) {
                        const abBase = 'https://www.appbuilder.dev';
                        abHeaderHtml          = absolutifyNavUrls(stripScripts(extractOuterHtml(abRaw, '<header')), abBase);
                        abFooterHtml          = absolutifyNavUrls(stripScripts(extractOuterHtml(abRaw, '<footer')), abBase);
                        abFooterUtilsHtml     = absolutifyNavUrls(stripScripts(extractOuterHtml(abRaw, '<[a-z][a-z0-9]*[^>]+class="[^"]*\\bfooter-utils\\b')), abBase);
                        abFooterCopyrightHtml = absolutifyNavUrls(stripScripts(extractOuterHtml(abRaw, '<[a-z][a-z0-9]*[^>]+class="[^"]*\\bfooter-copyright\\b')), abBase);
                        abContactSalesHtml    = absolutifyNavUrls(stripScripts(extractOuterHtml(abRaw, '<[a-z][a-z0-9]*[^>]+id="contactSales"')), abBase);
                      }
                    } else {
                      console.warn(`[docs-template] AppBuilder nav fetch returned ${abRes.status} — falling back to runtime loading.`);
                    }
                  } catch (err) {
                    console.warn(`[docs-template] Could not prefetch AppBuilder navigation: ${err.message} — falling back to runtime loading.`);
                  }
                }

                _navHtmlCache = [
                  `export const platform = ${JSON.stringify(effectivePlatform ?? null)};`,
                  `export const navLang = ${JSON.stringify(navLang)};`,
                  `export const prefetched = ${JSON.stringify(!!headerHtml)};`,
                  `export const headerHtml = ${JSON.stringify(headerHtml)};`,
                  `export const uiFooterHtml = ${JSON.stringify(uiFooterHtml)};`,
                  `export const footerHtml = ${JSON.stringify(footerHtml)};`,
                  `export const abPrefetched = ${JSON.stringify(!!abHeaderHtml)};`,
                  `export const abHeaderHtml = ${JSON.stringify(abHeaderHtml)};`,
                  `export const abFooterHtml = ${JSON.stringify(abFooterHtml)};`,
                  `export const abFooterUtilsHtml = ${JSON.stringify(abFooterUtilsHtml)};`,
                  `export const abFooterCopyrightHtml = ${JSON.stringify(abFooterCopyrightHtml)};`,
                  `export const abContactSalesHtml = ${JSON.stringify(abContactSalesHtml)};`,
                ].join('\n');
                return _navHtmlCache;
              },
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
          // Extract path (no query string)
          const rawUrl = req.url || '/';
          const requestPath = rawUrl.split('?', 1)[0] || '/';
          // Decode URL component; reject malformed encodings
          let decodedPath;
          try {
            decodedPath = decodeURIComponent(requestPath);
          } catch {
            return next();
          }
          // Build absolute file path and ensure it stays within imagesDir
          const basePath = path.resolve(imagesDir);
          const relativePath = decodedPath.replace(/^\/+/, '');
          const filePath = path.resolve(path.join(basePath, relativePath));
          // Prevent path traversal outside of imagesDir
          if (filePath !== basePath && !filePath.startsWith(basePath + path.sep)) {
            return next();
          }
          try {
            if (fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).slice(1).toLowerCase();
              res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch {
            /* file not found — fall through */
          }
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
 * @param {'angular'|'react'|'blazor'|'web-components'|'slingshot'|'appbuilder'|'reveal'} [options.platform]
 *                                                     Platform identifier. Drives CDN styles/scripts
 *                                                     injected into `<head>` (via `getPlatformHead`)
 *                                                     and the build-time nav prefetch endpoint.
 *                                                     When provided, takes precedence over the
 *                                                     deprecated `prefetchNav` flag.
 * @param {string}   [options.navLang='en']           Locale for the nav prefetch URL ('en'|'ja'|'kr').
 * @param {Array}    [options.head=[]]                Extra `<head>` entries appended after the
 *                                                     platform entries. Same format as Starlight's
 *                                                     `head` option.
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
    platform = null,
    navLang = 'en',
    head = [],
    starlight: starlightExtra = {},
    integrations: extraIntegrations = [],
    // Deprecated: use `platform` instead
    prefetchNav = false,
    prefetchAppBuilderNav = false,
    ...astroExtra
  } = options;

  const sidebar = buildSidebarFromToc({
    tocPath: source.tocPath,
    componentsDir: source.componentsDir,
    exclude: sidebarOptions.exclude ?? [],
  });

  // Resolve effective platform — explicit option wins over deprecated flags.
  const effectivePlatform =
    platform ??
    (prefetchAppBuilderNav ? 'appbuilder' : null) ??
    (prefetchNav ? 'angular' : null);

  // Platform CDN entries come first so site-specific `head` entries can override.
  const platformHead = effectivePlatform ? getPlatformHead(effectivePlatform, navLang) : [];

  return defineConfig({
    site,
    ...(base !== undefined ? { base } : {}),
    ...astroExtra,
    integrations: [
      siteMetaIntegration({ title, description, docsSourcePath: source.componentsDir, sidebar, platform: effectivePlatform, navLang }),
      starlight({ title, sidebar, head: [...platformHead, ...head], ...starlightExtra }),
      ...(source.imagesDir ? [staticImagesIntegration(source.imagesDir)] : []),
      ...extraIntegrations,
    ],
  });
}


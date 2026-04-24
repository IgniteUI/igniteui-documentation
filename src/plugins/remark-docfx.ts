/**
 * Remark plugin that transforms docfx-specific markdown syntax into
 * standard HTML / markdown that Starlight can render.
 *
 * Handles:
 * 1. {environment:...} variable substitution in text, links, and raw HTML
 * 2. <code-view> elements -> .ig-code-view placeholder divs (enhanced by code-view.js)
 * 3. <div class="divider--half"></div> -> <hr>
 * 4. Relative .md link rewriting for Astro trailing-slash URLs
 */

import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';
import { walkDocsFiles } from '../llms.ts';

// ENV is loaded lazily the first time replaceEnvVars() is called — NOT at
// module load time.  Module-level code runs while the Astro config is being
// evaluated, before createDocsSite() has had a chance to set DOCS_SOURCE_PATH.
// Deferring the load ensures we read the correct environment.json for the
// active project (Angular, Blazor, React, WC, …).
let _ENV: Record<string, string> | null = null;
let _envSourcePath: string | null = null; // tracks which DOCS_SOURCE_PATH was used

function loadEnv(): Record<string, string> {
  const currentPath = process.env.DOCS_SOURCE_PATH ?? null;
  // Re-load if the source path changed (e.g. two projects built in the same process)
  if (_ENV !== null && currentPath === _envSourcePath) return _ENV as Record<string, string>;
  _envSourcePath = currentPath;
  _ENV = null;

  if (!process.env.DOCS_SOURCE_PATH) { _ENV = {}; return _ENV as Record<string, string>; }
  const sourceRoot = path.resolve(process.env.DOCS_SOURCE_PATH);

  // Search order:
  //   1. {docsDir}/en/environment.json   — docfx repo layout
  //   2. {docsDir}/environment.json      — flat layout
  //   3. {docsDir}/../environment.json   — xplat layout: docsDir = dist/{P}/{lang}/components,
  //                                        environment.json lives one level up
  //   4. {docsDir}/../en/environment.json
  const parent = path.dirname(sourceRoot);
  const candidates = [
    path.join(sourceRoot, 'en', 'environment.json'),
    path.join(sourceRoot, 'environment.json'),
    path.join(parent, 'environment.json'),
    path.join(parent, 'en', 'environment.json'),
  ];

  const envPath = candidates.find(c => fs.existsSync(c));
  if (!envPath) { _ENV = {}; return _ENV; }

  try {
    const envData = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
    // DOCS_ENV overrides explicitly (useful for staging builds).
    // Otherwise fall back to NODE_ENV ('development' | 'production').
    // Matches environment.json keys: development / staging / production.
    const envKey = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'production';
    _ENV = envData[envKey] ?? envData.production ?? {};
  } catch {
    _ENV = {};
  }

  return _ENV as Record<string, string>;
}

const ENV_PATTERN = /(?:\{|&#123;)environment:(\w+)(?:\}|&#125;)/g;

// ---------------------------------------------------------------------------
// Slug resolution map — lazily built once per DOCS_SOURCE_PATH.
// Maps various link forms to the canonical slug for each page.
// ---------------------------------------------------------------------------
let _slugMap: Map<string, string> | null = null;
let _slugMapSourcePath: string | null = null;

function getSlugMap(docsDir: string): Map<string, string> {
  if (_slugMap !== null && docsDir === _slugMapSourcePath) return _slugMap;
  _slugMapSourcePath = docsDir;
  _slugMap = new Map();

  for (const entry of walkDocsFiles(docsDir)) {
    const relLower = entry.relPath.toLowerCase();
    const basename = path.basename(relLower);

    if (entry.slug !== entry.relPath) {
      // Custom slug (from frontmatter or DocFX metadata)
      _slugMap.set(relLower, entry.slug);
      if (!_slugMap.has(basename)) _slugMap.set(basename, entry.slug);
      _slugMap.set(entry.slug, entry.slug); // identity mapping
    } else {
      // No slug override — Astro uses the file path as the route
      if (!_slugMap.has(basename)) _slugMap.set(basename, relLower);
      _slugMap.set(relLower, relLower);
    }
  }

  return _slugMap;
}

/**
 * Resolve a link path to the correct slug using the slug map.
 * Tries exact path match, then basename-only match.
 */
function resolveSlug(linkPath: string, docsDir: string): string {
  const map = getSlugMap(docsDir);
  const normalized = linkPath.toLowerCase();

  // Try exact match (full path)
  if (map.has(normalized)) return map.get(normalized)!;

  // Try basename only (for flat fileName-based links)
  const basename = normalized.split('/').pop() ?? normalized;
  if (map.has(basename)) return map.get(basename)!;

  // Try each suffix — the link might include partial directory paths
  // e.g. "/adding/igbulletgraph-adding" when file is at "controls/igbulletgraph/adding/adding"
  // In this case we can't match, just return the original
  return normalized;
}

/**
 * Rewrite a .md/.mdx link to a root-relative Astro URL.
 * Handles both relative links and root-relative links.
 * @param url      - Raw link URL from the markdown AST.
 * @param filePath - Absolute path of the current .md file.
 * @param docsDir  - Absolute path to the docs root (DOCS_SOURCE_PATH).
 */
function rewriteMdLink(url: string, filePath: string, docsDir: string): string {
  if (!url) return url;
  if (
    url.startsWith('http://') || url.startsWith('https://') ||
    url.startsWith('#') || url.startsWith('mailto:')
  ) return url;

  // Normalize multiple slashes (e.g. //// → /)
  const cleaned = url.replace(/\/{2,}/g, '/');

  // Separate path from fragment / query-string suffix.
  const hashIdx = cleaned.indexOf('#');
  const qIdx    = cleaned.indexOf('?');
  const splitAt = hashIdx !== -1 ? hashIdx : qIdx !== -1 ? qIdx : -1;
  let mdPath = splitAt !== -1 ? cleaned.slice(0, splitAt) : cleaned;
  const suffix = splitAt !== -1 ? cleaned.slice(splitAt) : '';

  // Only handle .md and .mdx links
  if (!mdPath.endsWith('.md') && !mdPath.endsWith('.mdx')) return cleaned;

  const docsBase = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');

  // Root-relative links (start with /)
  if (mdPath.startsWith('/')) {
    // Strip leading / and extension
    const linkPath = mdPath.slice(1).replace(/\.(mdx|md)$/i, '');
    const slug = resolveSlug(linkPath, docsDir);
    return docsBase + '/' + slug + '/' + suffix;
  }

  // Relative links
  const fileDir     = path.dirname(filePath);
  const resolved    = path.resolve(fileDir, mdPath);

  // Compute the slug: path relative to docsDir, forward slashes, no extension.
  const rel = path.relative(docsDir, resolved).replace(/\\/g, '/');
  const relNoExt = rel.replace(/\.(mdx|md)$/i, '');
  const slug = resolveSlug(relNoExt, docsDir);

  return docsBase + '/' + slug + '/' + suffix;
}

export function replaceEnvVars(str: string): string {
  if (!str || typeof str !== 'string') return str;
  const env = loadEnv();
  return str.replace(ENV_PATTERN, (_match, key) => env[key] ?? `{environment:${key}}`);
}

/**
 * Build the pre-rendered widget HTML shell (matches the Sample.astro structure).
 * Picked up at runtime by sample-widget.ts via `.code-view[data-platform]`.
 */
function buildWidgetHtml(
  src: string,
  demosBase: string,
  githubSrc: string,
  height: string,
  alt: string,
  platform: string,
): string {
  const widgetId = 'cw' + src.replace(/[^a-z0-9]/gi, '-');
  const tabId    = `${widgetId}-example`;
  const safeAlt  = alt.replace(/"/g, '&quot;');
  return (
    `<div class="code-view" id="${widgetId}"` +
    ` data-iframe-src="${src}"` +
    (demosBase ? ` data-demos-base-url="${demosBase}"` : '') +
    (githubSrc ? ` data-github-src="${githubSrc}"`    : '') +
    ` data-platform="${platform}">` +
    `<div class="code-view-navbar">` +
    `<div class="code-view-tab code-view-tab--active" data-tab-id="${tabId}">EXAMPLE</div>` +
    `<span class="fs-button-container" title="Expand to fullscreen"></span>` +
    `</div>` +
    `<div class="code-views-container">` +
    `<div id="${tabId}" class="sample-container code-view-tab-content loading" style="height: ${height}">` +
    `<iframe data-src="${src}" title="${safeAlt}" style="width: 100%; height: 100%;" frameborder="0" seamless=""></iframe>` +
    `</div>` +
    `</div>` +
    `</div>`
  );
}

/**
 * Transform <code-view ...> ... </code-view> raw HTML blocks into the
 * pre-rendered widget shell consumed by sample-widget.ts at runtime.
 */
function transformCodeView(html: string): string {
  return html.replace(
    /<code-view\s+([\s\S]*?)>\s*(?:<\/code-view>)?/g,
    (_match, attrs: string) => {
      const stackblitzMatch = attrs.match(/stackblitz="([^"]*)"/);
      const codesandboxMatch = attrs.match(/codesandbox="([^"]*)"/);
      const srcMatch = attrs.match(/iframe-src="([^"]*)"/);
      const demosBaseMatch = attrs.match(/data-demos-base-url="([^"]*)"/);
      const githubSrcMatch = attrs.match(/github-src="([^"]*)"/);
      const heightMatch = attrs.match(/style="height:\s*(\d+px)"/);
      const altMatch = attrs.match(/alt="([^"]*)"/);
      const height = heightMatch ? heightMatch[1] : '400px';
      const alt = altMatch ? altMatch[1] : 'Demo';

      // Explicit StackBlitz embed (stackblitz="<project-or-url>")
      if (stackblitzMatch) {
        const project = replaceEnvVars(stackblitzMatch[1]);
        const embedUrl = project.startsWith('http')
          ? project
          : `https://stackblitz.com/edit/${project}?embed=1&file=src/app/app.component.ts`;
        return `<iframe src="${embedUrl}" style="width:100%;height:${height};border:1px solid #e5e7eb;border-radius:8px;" title="${alt} (StackBlitz)" loading="lazy" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>`;
      }

      // Explicit CodeSandbox embed (codesandbox="<project-or-url>")
      if (codesandboxMatch) {
        const project = replaceEnvVars(codesandboxMatch[1]);
        const embedUrl = project.startsWith('http')
          ? project
          : `https://codesandbox.io/embed/${project}?fontsize=14&hidenavigation=1&theme=light`;
        return `<iframe src="${embedUrl}" style="width:100%;height:${height};border:1px solid #e5e7eb;border-radius:8px;" title="${alt} (CodeSandbox)" loading="lazy" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>`;
      }

      // Standard docfx code-view with iframe-src + data-demos-base-url.
      // Output the pre-rendered widget shell; sample-widget.ts activates it at runtime.
      if (srcMatch) {
        const src = replaceEnvVars(srcMatch[1]);
        if (!src || src.includes('{environment:')) return ''; // env var not resolved
        const demosBaseUrl = demosBaseMatch ? replaceEnvVars(demosBaseMatch[1]) : '';
        const githubSrc = githubSrcMatch ? githubSrcMatch[1] : '';
        const platform = process.env.DOCS_PLATFORM || 'angular';
        return buildWidgetHtml(src, demosBaseUrl, githubSrc, height, alt, platform);
      }

      return '';
    }
  );
}

/**
 * Transform <div class="divider--half"></div> into <hr>
 */
function transformDividers(html: string): string {
  return html.replace(/<div\s+class="divider--half"\s*>\s*<\/div>/g, '<hr/>');
}

function strVal(v: unknown): string {
  return typeof v === 'string' ? v : Array.isArray(v) ? v.join(' ') : String(v ?? '');
}

/**
 * Rehype plugin — transforms <code-view> elements into the pre-rendered widget shell.
 *
 * Handles two HAST representations depending on what's in the pipeline:
 *
 * 1. `element` nodes (tagName === 'code-view') — produced when rehype-raw is
 *    present and re-parses raw HTML fragments into proper HAST elements.
 *
 * 2. `raw` string nodes — produced when rehype-raw is NOT in the pipeline
 *    (e.g. Astro content-collection .md files). In that case multiline
 *    <code-view> blocks are opaque raw strings; we run the same regex
 *    transformer used in the remark stage.
 */
export function rehypeCodeView() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // ── 1. element nodes (after rehype-raw) ──────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'code-view') return;

      const p = node.properties || {};

      // HAST converts hyphenated attributes to camelCase via property-information.
      const iframeSrc  = strVal(p.iframeSrc      ?? p['iframe-src']             ?? '');
      const demosBase  = strVal(p.dataDemosBaseUrl ?? p['data-demos-base-url'] ?? '');
      const githubSrc  = strVal(p.githubSrc      ?? p['github-src']             ?? '');
      const styleStr   = strVal(p.style ?? '');
      const alt        = strVal(p.alt   ?? 'Demo');

      const src     = replaceEnvVars(iframeSrc);
      const baseUrl = replaceEnvVars(demosBase);

      if (!src || src.includes('{environment:')) return;

      const heightMatch = styleStr.match(/height:\s*(\d+\s*px)/i);
      const height   = heightMatch ? heightMatch[1].replace(/\s+/, '') : '400px';
      const platform = process.env.DOCS_PLATFORM || 'angular';
      const widgetId = 'cw' + src.replace(/[^a-z0-9]/gi, '-');
      const tabId    = `${widgetId}-example`;

      node.tagName = 'div';
      node.properties = {
        className:          ['code-view'],
        id:                 widgetId,
        'data-iframe-src':  src,
        'data-platform':    platform,
        ...(baseUrl   ? { 'data-demos-base-url': baseUrl }  : {}),
        ...(githubSrc ? { 'data-github-src': githubSrc }    : {}),
      };
      node.children = [
        {
          type: 'element', tagName: 'div',
          properties: { className: ['code-view-navbar'] },
          children: [
            {
              type: 'element', tagName: 'div',
              properties: { className: ['code-view-tab', 'code-view-tab--active'], 'data-tab-id': tabId },
              children: [{ type: 'text', value: 'EXAMPLE' }],
            },
            {
              type: 'element', tagName: 'span',
              properties: { className: ['fs-button-container'], title: 'Expand to fullscreen' },
              children: [],
            },
          ],
        },
        {
          type: 'element', tagName: 'div',
          properties: { className: ['code-views-container'] },
          children: [
            {
              type: 'element', tagName: 'div',
              properties: {
                id: tabId,
                className: ['sample-container', 'code-view-tab-content', 'loading'],
                style: `height: ${height}`,
              },
              children: [
                {
                  type: 'element', tagName: 'iframe',
                  properties: {
                    'data-src': src,
                    title: alt,
                    style: 'width: 100%; height: 100%;',
                    frameBorder: '0',
                    seamless: '',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ];
    });

    // ── 2. raw string nodes (no rehype-raw in pipeline) ──────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, 'raw', (node: any) => {
      if (!node.value || !node.value.includes('<code-view')) return;
      const updated = transformCodeView(replaceEnvVars(node.value as string));
      if (updated !== node.value) node.value = updated;
    });
  };
}

export function remarkDocfx() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any, file: any) => {
    const filePath = (file.path as string) ?? '';
    const docsDir  = process.env.DOCS_SOURCE_PATH
      ? path.resolve(process.env.DOCS_SOURCE_PATH)
      : (filePath ? path.dirname(filePath) : '');
    // 1. Walk the AST and replace environment variables in text/links/html
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, (node: any) => {
      // Text nodes
      if (node.type === 'text' && node.value) {
        node.value = replaceEnvVars(node.value as string);
      }

      // Links
      if (node.type === 'link' && node.url) {
        node.url = replaceEnvVars(node.url as string);
        node.url = rewriteMdLink(node.url as string, filePath, docsDir);
        // Prepend DOCS_BASE to root-relative internal links that were not already
        // rewritten by rewriteMdLink (e.g. bare /grids/grid/… links that skip
        // the .md-only rewriter above).
        const docsBase = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');
        if (
          docsBase &&
          (node.url as string).startsWith('/') &&
          !(node.url as string).startsWith('//') &&
          !(node.url as string).startsWith(docsBase + '/')
        ) {
          node.url = docsBase + (node.url as string);
        }
      }

      // Images
      if (node.type === 'image' && node.url) {
        node.url = replaceEnvVars(node.url as string);
        node.url = (node.url as string).replace(/^(\.\.\/)+images\//, '/images/');
      }

      // Code blocks — normalize language identifiers to lowercase
      if (node.type === 'code' && node.lang) {
        node.lang = (node.lang as string).toLowerCase();
      }

      // Inline HTML
      if (node.type === 'html' && node.value) {
        node.value = replaceEnvVars(node.value as string);
        node.value = transformCodeView(node.value as string);
        node.value = transformDividers(node.value as string);
        node.value = (node.value as string).replace(/src="(\.\.\/)+images\//g, 'src="/images/');
      }
    });
  };
}

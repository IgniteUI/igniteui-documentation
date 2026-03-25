/**
 * Remark plugin that transforms docfx-specific markdown syntax into
 * standard HTML / markdown that Starlight can render.
 *
 * Handles:
 * 1. {environment:...} variable substitution in text, links, and raw HTML
 * 2. <code-view> elements -> iframe embeds
 * 3. <div class="divider--half"></div> -> <hr>
 * 4. Docfx frontmatter normalisation (_description -> description)
 */

import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';

// Resolve the docs source root — must match the logic in astro.config.mjs and content.config.ts.
// DOCS_SOURCE_PATH env var is the repo root (e.g. C:/Users/.../igniteui-docfx).
const SOURCE_ROOT = process.env.DOCS_SOURCE_PATH
  ? path.resolve(process.env.DOCS_SOURCE_PATH)
  : path.resolve('C:/Users/dtsvetkov/Work/igniteui-docfx');

const ENV_PATH = path.join(SOURCE_ROOT, 'en', 'environment.json');
let ENV;
try {
  const envData = JSON.parse(fs.readFileSync(ENV_PATH, 'utf-8'));
  // DOCS_ENV overrides explicitly (useful for staging builds).
  // Otherwise fall back to NODE_ENV ('development' | 'production').
  // Matches environment.json keys: development / staging / production.
  const envKey = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'production';
  ENV = envData[envKey] ?? envData.production ?? {};
} catch {
  ENV = {};
}

const ENV_PATTERN = /\{environment:(\w+)\}/g;

export function replaceEnvVars(str) {
  if (!str || typeof str !== 'string') return str;
  return str.replace(ENV_PATTERN, (_match, key) => ENV[key] ?? `{environment:${key}}`);
}

/**
 * Transform <code-view ...> ... </code-view> raw HTML blocks into an iframe
 * widget with a StackBlitz live-editing link — matching what the old docfx
 * template's instantiateCodeViews() + AngularCodeService produced at runtime.
 */
function transformCodeView(html) {
  return html.replace(
    /<code-view\s+([\s\S]*?)>\s*(?:<\/code-view>)?/g,
    (_match, attrs) => {
      const stackblitzMatch = attrs.match(/stackblitz="([^"]*)"/);
      const codesandboxMatch = attrs.match(/codesandbox="([^"]*)"/);
      const srcMatch = attrs.match(/iframe-src="([^"]*)"/);
      const demosBaseMatch = attrs.match(/data-demos-base-url="([^"]*)"/);
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
      // Output a placeholder div; the client-side code-view.js script will
      // build the full widget (tabs, live-editing buttons, lazy iframe) at runtime.
      if (srcMatch) {
        const src = replaceEnvVars(srcMatch[1]);
        if (!src || src.includes('{environment:')) return ''; // env var not resolved
        const demosBaseUrl = demosBaseMatch ? replaceEnvVars(demosBaseMatch[1]) : '';
        const attrs = [
          `class="ig-code-view"`,
          `data-src="${src}"`,
          `data-height="${height}"`,
          `data-alt="${alt}"`,
          demosBaseUrl ? `data-demos-base-url="${demosBaseUrl}"` : '',
        ].filter(Boolean).join(' ');
        return `<div ${attrs}></div>`;
      }

      return '';
    }
  );
}

/**
 * Transform <div class="divider--half"></div> into <hr>
 */
function transformDividers(html) {
  return html.replace(/<div\s+class="divider--half"\s*>\s*<\/div>/g, '<hr/>');
}

/**
 * Rehype plugin — transforms <code-view> elements into .ig-code-view placeholders.
 *
 * Handles two HAST representations depending on what's in the pipeline:
 *
 * 1. `element` nodes (tagName === 'code-view') — produced when rehype-raw is
 *    present and re-parses raw HTML fragments into proper HAST elements.
 *
 * 2. `raw` string nodes — produced when rehype-raw is NOT in the pipeline
 *    (e.g. Astro content-collection .md files).  In that case multiline
 *    <code-view> blocks are carried through as opaque raw strings and we run
 *    the same regex transformer used in the remark stage.
 */
export function rehypeCodeView() {
  return (tree) => {
    // ── 1. element nodes (after rehype-raw) ──────────────────────────────────
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'code-view') return;

      const p = node.properties || {};

      // HAST converts hyphenated attributes to camelCase via property-information.
      // Unknown attributes (iframe-src, data-*) follow the same rule, so we
      // check both forms to be safe across HAST versions.
      const iframeSrc = str(p.iframeSrc   ?? p['iframe-src']             ?? '');
      const demosBase = str(p.dataDemosBaseUrl ?? p['data-demos-base-url'] ?? '');
      const styleStr  = str(p.style ?? '');
      const alt       = str(p.alt   ?? 'Demo');

      const src     = replaceEnvVars(iframeSrc);
      const baseUrl = replaceEnvVars(demosBase);

      if (!src || src.includes('{environment:')) return;

      const heightMatch = styleStr.match(/height:\s*(\d+\s*px)/i);
      const height = heightMatch ? heightMatch[1].replace(/\s+/, '') : '400px';

      node.tagName = 'div';
      node.properties = {
        className: ['ig-code-view'],
        'data-src': src,
        'data-height': height,
        'data-alt': alt,
        ...(baseUrl ? { 'data-demos-base-url': baseUrl } : {}),
      };
      node.children = [];
    });

    // ── 2. raw string nodes (no rehype-raw in pipeline) ──────────────────────
    visit(tree, 'raw', (node) => {
      if (!node.value || !node.value.includes('<code-view')) return;
      const updated = transformCodeView(replaceEnvVars(node.value));
      if (updated !== node.value) node.value = updated;
    });
  };
}

function str(v) {
  return typeof v === 'string' ? v : Array.isArray(v) ? v.join(' ') : String(v ?? '');
}

export function remarkDocfx() {
  return (tree, file) => {
    // 1. Transform frontmatter: map _description -> description, _keywords -> keywords
    if (file.data.astro?.frontmatter) {
      const fm = file.data.astro.frontmatter;
      if (fm._description && !fm.description) {
        fm.description = fm._description;
      }
      // Remove underscore-prefixed keys that Starlight doesn't use
      delete fm._description;
      delete fm._keywords;
      delete fm._license;
    }

    // 2. Walk the AST and replace environment variables in text/links/html
    visit(tree, (node) => {
      // Text nodes
      if (node.type === 'text' && node.value) {
        node.value = replaceEnvVars(node.value);
      }

      // Links
      if (node.type === 'link' && node.url) {
        node.url = replaceEnvVars(node.url);
      }

      // Images
      if (node.type === 'image' && node.url) {
        node.url = replaceEnvVars(node.url);
        // Fix relative image paths: ../../images/ -> /images/
        node.url = node.url.replace(/^\.\.\/\.\.\/images\//, '/images/');
        node.url = node.url.replace(/^\.\.\/images\//, '/images/');
      }

      // Code blocks — normalize language identifiers to lowercase so
      // astro-expressive-code can find the grammar (e.g. "TypeScript" → "typescript")
      if (node.type === 'code' && node.lang) {
        node.lang = node.lang.toLowerCase();
      }

      // Inline HTML
      if (node.type === 'html' && node.value) {
        node.value = replaceEnvVars(node.value);
        node.value = transformCodeView(node.value);
        node.value = transformDividers(node.value);
        // Fix image src paths in raw HTML
        node.value = node.value.replace(
          /src="\.\.\/\.\.\/images\//g,
          'src="/images/'
        );
        node.value = node.value.replace(
          /src="\.\.\/images\//g,
          'src="/images/'
        );
      }
    });
  };
}

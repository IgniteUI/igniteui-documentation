/**
 * Remark plugin that transforms docfx-specific markdown syntax into
 * standard HTML / markdown that Starlight can render.
 *
 * Handles:
 * 1. {environment:...} variable substitution in text, links, and raw HTML
 * 2. <code-view> elements -> .ig-code-view placeholder divs (enhanced by code-view.js)
 * 3. <div class="divider--half"></div> -> <hr>
 * 4. Docfx frontmatter normalisation (_description -> description)
 */

import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';

// Resolve the docs source root — must match the logic in astro.config.ts and content.config.ts.
// DOCS_SOURCE_PATH env var is the repo root (e.g. C:/Users/.../igniteui-docfx).
const SOURCE_ROOT = process.env.DOCS_SOURCE_PATH
  ? path.resolve(process.env.DOCS_SOURCE_PATH)
  : path.resolve('C:/Users/dtsvetkov/Work/igniteui-docfx');

// Support both DocFX layout ({root}/en/environment.json) and flat layout ({root}/environment.json)
const ENV_PATH =
  fs.existsSync(path.join(SOURCE_ROOT, 'en', 'environment.json'))
    ? path.join(SOURCE_ROOT, 'en', 'environment.json')
    : path.join(SOURCE_ROOT, 'environment.json');
let ENV: Record<string, string> = {};
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

export function replaceEnvVars(str: string): string {
  if (!str || typeof str !== 'string') return str;
  return str.replace(ENV_PATTERN, (_match, key) => ENV[key] ?? `{environment:${key}}`);
}

/**
 * Transform <code-view ...> ... </code-view> raw HTML blocks into an .ig-code-view
 * placeholder div — enhanced by the client-side code-view.js script at runtime.
 */
function transformCodeView(html: string): string {
  return html.replace(
    /<code-view\s+([\s\S]*?)>\s*(?:<\/code-view>)?/g,
    (_match, attrs: string) => {
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
        const divAttrs = [
          `class="ig-code-view"`,
          `data-src="${src}"`,
          `data-height="${height}"`,
          `data-alt="${alt}"`,
          demosBaseUrl ? `data-demos-base-url="${demosBaseUrl}"` : '',
        ].filter(Boolean).join(' ');
        return `<div ${divAttrs}></div>`;
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
 * Rehype plugin — transforms <code-view> elements into .ig-code-view placeholders.
 *
 * Handles two HAST representations depending on what's in the pipeline:
 *
 * 1. `element` nodes (tagName === 'code-view') — produced when rehype-raw is
 *    present and re-parses raw HTML fragments into proper HAST elements.
 *
 * 2. `raw` string nodes — produced when rehype-raw is NOT in the pipeline
 *    (e.g. Astro content-collection .md files). In that case multiline
 *    <code-view> blocks are carried through as opaque raw strings and we run
 *    the same regex transformer used in the remark stage.
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
      const iframeSrc = strVal(p.iframeSrc   ?? p['iframe-src']             ?? '');
      const demosBase = strVal(p.dataDemosBaseUrl ?? p['data-demos-base-url'] ?? '');
      const styleStr  = strVal(p.style ?? '');
      const alt       = strVal(p.alt   ?? 'Demo');

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
    // 1. Transform frontmatter: map _description -> description, _keywords -> keywords
    if (file.data.astro?.frontmatter) {
      const fm = file.data.astro.frontmatter as Record<string, unknown>;
      if (fm._description && !fm.description) {
        fm.description = fm._description;
      }
      delete fm._description;
      delete fm._keywords;
      delete fm._license;
    }

    // 2. Walk the AST and replace environment variables in text/links/html
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, (node: any) => {
      // Text nodes
      if (node.type === 'text' && node.value) {
        node.value = replaceEnvVars(node.value as string);
      }

      // Links
      if (node.type === 'link' && node.url) {
        node.url = replaceEnvVars(node.url as string);
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

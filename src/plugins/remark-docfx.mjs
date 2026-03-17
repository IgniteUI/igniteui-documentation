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
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Read environment variables directly from igniteui-docfx — no generated copy needed
const SOURCE_ROOT = path.resolve(__dirname, '..', '..', '..', process.env.SOURCE_KEY === 'xplat' ? 'igniteui-xplat-docs' : 'igniteui-docfx');

const ENV_PATH = path.join(SOURCE_ROOT, 'en', 'environment.json');
let ENV;
try {
  const envData = JSON.parse(fs.readFileSync(ENV_PATH, 'utf-8'));
  ENV = envData.production ?? {};
} catch {
  ENV = {};
}

const ENV_PATTERN = /\{environment:(\w+)\}/g;

function replaceEnvVars(str) {
  if (!str || typeof str !== 'string') return str;
  return str.replace(ENV_PATTERN, (_match, key) => ENV[key] ?? `{environment:${key}}`);
}

/**
 * Transform <code-view ...> ... </code-view> raw HTML blocks
 * into rendered iframes.
 */
function transformCodeView(html) {
  // Replace code-view blocks with iframes
  return html.replace(
    /<code-view\s+([^>]*)>\s*<\/code-view>/gs,
    (_match, attrs) => {
      const srcMatch = attrs.match(/iframe-src="([^"]*)"/);
      const heightMatch = attrs.match(/style="height:(\d+px)"/);
      const altMatch = attrs.match(/alt="([^"]*)"/);
      const src = srcMatch ? replaceEnvVars(srcMatch[1]) : '';
      const height = heightMatch ? heightMatch[1] : '400px';
      const alt = altMatch ? altMatch[1] : 'Demo';

      if (!src) return '';
      return `<iframe src="${src}" style="width:100%;height:${height};border:1px solid #e5e7eb;border-radius:8px;" title="${alt}" loading="lazy"></iframe>`;
    }
  );
}

/**
 * Transform <div class="divider--half"></div> into <hr>
 */
function transformDividers(html) {
  return html.replace(/<div\s+class="divider--half"\s*>\s*<\/div>/g, '<hr/>');
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

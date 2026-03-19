/**
 * sidebar.mjs
 *
 * Builds an Astro Starlight sidebar from a YAML or JSON TOC file.
 * Source-agnostic: consuming repos pass their own paths.
 *
 * Usage in a consuming repo's astro.config.mjs:
 *
 *   import { buildSidebarFromToc } from 'docs-template/sidebar';
 *
 *   const sidebar = buildSidebarFromToc({
 *     tocPath: './node_modules/my-docs-source/toc.yml',   // YAML or JSON
 *     componentsDir: './node_modules/my-docs-source/en/components',
 *     // exclude: [/^internal\//],   // optional extra exclude patterns
 *   });
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function docExists(componentsDir, href, exclude) {
  if (!href) return false;
  if (exclude?.some((p) => p.test(href))) return false;
  return fs.existsSync(path.join(componentsDir, href));
}

function hrefToSlug(href) {
  if (!href) return '';
  let slug = href
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .toLowerCase();
  slug = slug.replace(/\/index$/, '');
  return slug === 'index' ? '' : slug;
}

function convertTocItem(componentsDir, item, exclude) {
  if (!item.name) return null;

  if (item.items?.length > 0) {
    const group = { label: item.name, items: [] };
    if (item.href && docExists(componentsDir, item.href, exclude)) {
      group.items.push({ label: 'Overview', slug: hrefToSlug(item.href) });
    }
    for (const child of item.items) {
      const entry = convertTocItem(componentsDir, child, exclude);
      if (entry) group.items.push(entry);
    }
    return group.items.length > 0 ? group : null;
  }

  if (item.href) {
    if (!docExists(componentsDir, item.href, exclude)) return null;
    const entry = { label: item.name, slug: hrefToSlug(item.href) };
    // Common TOC badge conventions (docfx-style, widely adopted)
    if (item.new) entry.badge = { text: 'New', variant: 'success' };
    else if (item.preview) entry.badge = { text: 'Preview', variant: 'caution' };
    else if (item.updated) entry.badge = { text: 'Updated', variant: 'note' };
    else if (item.premium) entry.badge = { text: 'Premium', variant: 'tip' };
    return entry;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Reads a YAML or JSON TOC file and converts it to a Starlight sidebar array.
 *
 * @param {object} options
 * @param {string} options.tocPath       Absolute path to the TOC file (.yml or .json).
 * @param {string} options.componentsDir Absolute path to the Markdown components directory.
 * @param {RegExp[]} [options.exclude]   Extra patterns to exclude (matched against the `href`).
 * @returns {import('@astrojs/starlight').StarlightUserConfig['sidebar']}
 */
export function buildSidebarFromToc({ tocPath, componentsDir, exclude = [] }) {
  const tocRaw = fs.readFileSync(tocPath, 'utf-8');
  const tocItems = tocPath.endsWith('.json') ? JSON.parse(tocRaw) : yaml.load(tocRaw);

  const sidebar = [];
  let currentGroup = null;

  for (const item of tocItems) {
    if (item.header) {
      if (currentGroup) sidebar.push(currentGroup);
      currentGroup = { label: item.name, items: [] };
      if (item.href && docExists(componentsDir, item.href, exclude)) {
        currentGroup.items.push({ label: item.name, slug: hrefToSlug(item.href) });
      }
      continue;
    }
    const entry = convertTocItem(componentsDir, item, exclude);
    if (!entry) continue;
    if (currentGroup) currentGroup.items.push(entry);
    else sidebar.push(entry);
  }

  if (currentGroup) sidebar.push(currentGroup);
  return sidebar;
}


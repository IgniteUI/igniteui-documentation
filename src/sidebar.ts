/**
 * sidebar.ts
 *
 * Builds an Astro Starlight sidebar from a YAML or JSON TOC file.
 * Source-agnostic: consuming repos pass their own paths.
 *
 * Usage in a consuming repo's astro.config.ts:
 *
 *   import { buildSidebarFromToc } from 'docs-template/sidebar';
 *
 *   const sidebar = buildSidebarFromToc({
 *     tocPath: './node_modules/my-docs-source/toc.yml',   // YAML or JSON
 *     docsDir: './node_modules/my-docs-source/en/components',
 *     // exclude: [/^internal\//],   // optional extra exclude patterns
 *   });
 */

import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import type { SidebarEntry, SidebarGroup, SidebarLink } from './lib/sidebar/types';

// Re-export so consumers (astro.config.ts in child sites) can import the
// canonical types from the same module they already use.
export type { SidebarEntry, SidebarGroup, SidebarLink } from './lib/sidebar/types';

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface TocItem {
    name?: string;
    href?: string;
    header?: boolean;
    items?: TocItem[];
    new?: boolean;
    preview?: boolean;
    updated?: boolean;
    premium?: boolean;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function docExists(docsDir: string, href: string, exclude: RegExp[]): boolean {
    if (!href) return false;
    if (exclude?.some((p) => p.test(href))) return false;
    // Check the href as-is, then also with .md ↔ .mdx swapped so that toc.json
    // entries like "charts/chart-features.md" resolve even when the file on disk
    // is "charts/chart-features.mdx" (and vice-versa).
    if (fs.existsSync(path.join(docsDir, href))) return true;
    const alt = href.endsWith('.mdx')
        ? href.slice(0, -4) + '.md'
        : href.endsWith('.md') ? href.slice(0, -3) + '.mdx' : null;
    return alt !== null && fs.existsSync(path.join(docsDir, alt));
}

function hrefToSlug(href: string): string {
    if (!href) return '';
    let slug = href
        .replace(/\\/g, '/')
        .replace(/\.(md|mdx)$/i, '')
        .toLowerCase();
    slug = slug.replace(/\/index$/, '');
    return slug === 'index' ? '' : slug;
}

/**
 * Initial collapsed state by depth:
 *   • depth 0 (root groups, incl. `header:true` sections) → `collapsed: false`
 *   • depth ≥ 1 (nested groups) → `collapsed: true`
 */
function collapsedForDepth(depth: number): boolean {
    return depth > 0;
}

function convertTocItem(
    docsDir: string,
    item: TocItem,
    exclude: RegExp[],
    depth: number,
): SidebarEntry | null {
    if (!item.name) return null;

    if (item.items && item.items.length > 0) {
        const group: SidebarGroup = {
            label: item.name,
            items: [],
            collapsed: collapsedForDepth(depth),
        };
        if (item.href && docExists(docsDir, item.href, exclude)) {
            group.items.push({ label: 'Overview', slug: hrefToSlug(item.href) });
        }
        for (const child of item.items) {
            const entry = convertTocItem(docsDir, child, exclude, depth + 1);
            if (entry) group.items.push(entry);
        }
        return group.items.length > 0 ? group : null;
    }

    if (item.href) {
        if (!docExists(docsDir, item.href, exclude)) return null;
        const entry: SidebarLink = { label: item.name, slug: hrefToSlug(item.href) };
        const badges: NonNullable<SidebarLink['badges']> = [];
        if (item.new)          badges.push({ text: 'New',     variant: 'new'     });
        else if (item.preview) badges.push({ text: 'Preview', variant: 'preview' });
        else if (item.updated) badges.push({ text: 'Updated', variant: 'updated' });
        if (item.premium) {
            entry.attrs = { 'data-premium': 'true' };
            badges.push({ text: 'Premium', variant: 'premium' });
        }
        if (badges.length) entry.badges = badges;
        return entry;
    }

    return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface BuildSidebarFromTocOptions {
    /** Absolute path to the TOC file (.yml or .json). */
    tocPath: string;
    /** Absolute path to the Markdown docs directory. */
    docsDir: string;
    /** Extra patterns to exclude (matched against the `href`). */
    exclude?: RegExp[];
}

/**
 * Reads a YAML or JSON TOC file and converts it to a Starlight sidebar array.
 */
export function buildSidebarFromToc({ tocPath, docsDir, exclude = [] }: BuildSidebarFromTocOptions): SidebarEntry[] {
    if (!tocPath || !fs.existsSync(tocPath)) return [];
    const tocRaw = fs.readFileSync(tocPath, 'utf-8');
    const tocItems = tocPath.endsWith('.json') ? JSON.parse(tocRaw) : yaml.load(tocRaw) as TocItem[];

    const sidebar: SidebarEntry[] = [];
    let currentGroup: SidebarGroup | null = null;

    for (const item of tocItems) {
        if (item.header) {
            if (currentGroup) sidebar.push(currentGroup);
            // Root-level header section — open by default.
            currentGroup = { label: item.name!, items: [], collapsed: collapsedForDepth(0) };
            if (item.href && docExists(docsDir, item.href, exclude)) {
                currentGroup.items.push({ label: 'Overview', slug: hrefToSlug(item.href) });
            }
            continue;
        }
        // Items inside a header section are at depth 1 (nested);
        // items outside any header section are at depth 0 (root).
        const depth = currentGroup ? 1 : 0;
        const entry = convertTocItem(docsDir, item, exclude, depth);
        if (!entry) continue;
        if (currentGroup) currentGroup.items.push(entry);
        else sidebar.push(entry);
    }

    if (currentGroup) sidebar.push(currentGroup);
    return sidebar;
}

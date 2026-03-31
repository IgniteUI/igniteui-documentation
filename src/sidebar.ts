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
import yaml from 'js-yaml';

// ---------------------------------------------------------------------------
// Starlight sidebar types
// ---------------------------------------------------------------------------

type BadgeVariant = 'note' | 'danger' | 'success' | 'caution' | 'tip' | 'default';

interface SidebarBadge {
    text: string;
    variant: BadgeVariant;
}

interface SidebarLink {
    label: string;
    slug: string;
    badge?: SidebarBadge;
}

interface SidebarGroup {
    label: string;
    items: SidebarEntry[];
}

type SidebarEntry = SidebarLink | SidebarGroup;

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
    return fs.existsSync(path.join(docsDir, href));
}

function hrefToSlug(href: string): string {
    if (!href) return '';
    let slug = href
        .replace(/\\/g, '/')
        .replace(/\.md$/i, '')
        .toLowerCase();
    slug = slug.replace(/\/index$/, '');
    return slug === 'index' ? '' : slug;
}

function convertTocItem(docsDir: string, item: TocItem, exclude: RegExp[]): SidebarEntry | null {
    if (!item.name) return null;

    if (item.items && item.items.length > 0) {
        const group: SidebarGroup = { label: item.name, items: [] };
        if (item.href && docExists(docsDir, item.href, exclude)) {
            group.items.push({ label: 'Overview', slug: hrefToSlug(item.href) });
        }
        for (const child of item.items) {
            const entry = convertTocItem(docsDir, child, exclude);
            if (entry) group.items.push(entry);
        }
        return group.items.length > 0 ? group : null;
    }

    if (item.href) {
        if (!docExists(docsDir, item.href, exclude)) return null;
        const entry: SidebarLink = { label: item.name, slug: hrefToSlug(item.href) };
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
            currentGroup = { label: item.name!, items: [] };
            if (item.href && docExists(docsDir, item.href, exclude)) {
                currentGroup.items.push({ label: item.name, slug: hrefToSlug(item.href) });
            }
            continue;
        }
        const entry = convertTocItem(docsDir, item, exclude);
        if (!entry) continue;
        if (currentGroup) currentGroup.items.push(entry);
        else sidebar.push(entry);
    }

    if (currentGroup) sidebar.push(currentGroup);
    return sidebar;
}

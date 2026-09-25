/**
 * sidebar.ts
 *
 * Builds an Astro sidebar from a JSON TOC file.
 * Source-agnostic: consuming repos pass their own paths.
 *
 * Usage in a consuming repo's astro.config.ts:
 *
 *   import { buildSidebarFromToc } from 'docs-template/sidebar';
 *
 *   const sidebar = buildSidebarFromToc({
 *     tocPath: './node_modules/my-docs-source/toc.json',
 *     docsDir: './node_modules/my-docs-source/en/components',
 *     // exclude: [/^internal\//],   // optional extra exclude patterns
 *   });
 */

import fs from 'node:fs';
import { findFirstInRoots, toRootList, type DocsContentRoot, type ResolvedDocRoot } from './lib/doc-roots.ts';
import { SIDEBAR_BADGE_VARIANTS } from './lib/sidebar/types';
import type { SidebarBadgeVariant, SidebarEntry, SidebarGroup, SidebarLink } from './lib/sidebar/types';

// Re-export so consumers (astro.config.ts in child sites) can import the
// canonical types from the same module they already use.
export { SIDEBAR_BADGE_VARIANTS } from './lib/sidebar/types';
export type { SidebarBadgeVariant, SidebarEntry, SidebarGroup, SidebarLink } from './lib/sidebar/types';

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface TocItem extends Partial<Record<SidebarBadgeVariant, boolean>> {
    name?: string;
    href?: string;
    header?: boolean;
    sortable?: boolean;
    items?: TocItem[];
    /** Per-platform badge overrides. Stripped during TOC generation. */
    platforms?: Record<string, Partial<Pick<TocItem, SidebarBadgeVariant>>>;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function docExists(docsDirs: ResolvedDocRoot[], href: string, exclude: RegExp[]): boolean {
    if (!href) return false;
    if (exclude?.some((p) => p.test(href))) return false;
    // Check the href as-is, then also with .md ↔ .mdx swapped as a safety net
    // (toc.json uses .mdx, but this guards against any stale .md hrefs).
    const alt = href.endsWith('.mdx')
        ? href.slice(0, -4) + '.md'
        : href.endsWith('.md') ? href.slice(0, -3) + '.mdx' : null;
    const candidates = alt === null ? [href] : [href, alt];
    // A single TOC drives every content root, so an entry counts as present
    // when *any* root supplies the page.
    return findFirstInRoots(docsDirs, candidates) !== undefined;
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

function sortableLabel(label: string): string {
    return label.replace(/[-:()[\]/&]+/g, ' ');
}

function sortSidebarEntries(entries: SidebarEntry[]): SidebarEntry[] {
    return entries.sort((a, b) => sortableLabel(a.label).localeCompare(sortableLabel(b.label), undefined, {
        sensitivity: 'base',
        numeric: true,
    }));
}

function sortGroupItems(group: SidebarGroup): void {
    const [first, ...rest] = group.items;
    if (first && 'slug' in first && first.label === 'Overview') {
        group.items = [first, ...sortSidebarEntries(rest)];
        return;
    }
    group.items = sortSidebarEntries(group.items);
}

function convertTocItem(
    docsDirs: ResolvedDocRoot[],
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
        if (item.href && docExists(docsDirs, item.href, exclude)) {
            const overviewEntry: SidebarLink = { label: 'Overview', slug: hrefToSlug(item.href) };
            if (item.premium) {
                overviewEntry.attrs = { 'data-premium': 'true' };
                overviewEntry.badges = [{ text: 'Premium', variant: 'premium' }];
            }
            group.items.push(overviewEntry);
        }
        for (const child of item.items) {
            const entry = convertTocItem(docsDirs, child, exclude, depth + 1);
            if (entry) group.items.push(entry);
        }
        if (item.sortable) sortGroupItems(group);
        return group.items.length > 0 ? group : null;
    }

    if (item.href) {
        if (!docExists(docsDirs, item.href, exclude)) return null;
        const entry: SidebarLink = { label: item.name, slug: hrefToSlug(item.href) };
        const badges: NonNullable<SidebarLink['badges']> = [];
        for (const variant of SIDEBAR_BADGE_VARIANTS) {
            if (!item[variant]) continue;
            if (variant === 'premium') {
                entry.attrs = { 'data-premium': 'true' };
            }
            badges.push({ text: variant.charAt(0).toUpperCase() + variant.slice(1), variant });
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
    /** Absolute path to the TOC file (.json). */
    tocPath: string;
    /**
     * Absolute path to the Markdown docs directory, or a list of roots
     * ordered highest precedence first. A TOC entry is kept when any of them
     * supplies the page — a root that excludes the path does not count.
     */
    docsDir: DocsContentRoot | DocsContentRoot[];
    /** Extra patterns to exclude (matched against the `href`). */
    exclude?: RegExp[];
}

/**
 * Reads a JSON TOC file and converts it to a sidebar array.
 */
export function buildSidebarFromToc({ tocPath, docsDir, exclude = [] }: BuildSidebarFromTocOptions): SidebarEntry[] {
    if (!tocPath || !fs.existsSync(tocPath)) return [];
    const docsDirs = toRootList(docsDir);
    const tocRaw = fs.readFileSync(tocPath, 'utf-8');
    const tocItems: TocItem[] = JSON.parse(tocRaw);

    const sidebar: SidebarEntry[] = [];
    let currentGroup: SidebarGroup | null = null;
    let currentGroupSortable = false;

    for (const item of tocItems) {
        if (item.header) {
            if (currentGroup) {
                if (currentGroupSortable) sortGroupItems(currentGroup);
                sidebar.push(currentGroup);
            }
            // Root-level header section — open by default.
            currentGroup = { label: item.name!, items: [], collapsed: collapsedForDepth(0) };
            currentGroupSortable = item.sortable === true;
            if (item.href && docExists(docsDirs, item.href, exclude)) {
                const overviewEntry: SidebarLink = { label: 'Overview', slug: hrefToSlug(item.href) };
                if (item.premium) {
                    overviewEntry.attrs = { 'data-premium': 'true' };
                    overviewEntry.badges = [{ text: 'Premium', variant: 'premium' }];
                }
                currentGroup.items.push(overviewEntry);
            }
            continue;
        }
        // Items inside a header section are at depth 1 (nested);
        // items outside any header section are at depth 0 (root).
        const depth = currentGroup ? 1 : 0;
        const entry = convertTocItem(docsDirs, item, exclude, depth);
        if (!entry) continue;
        if (currentGroup) currentGroup.items.push(entry);
        else sidebar.push(entry);
    }

    if (currentGroup) {
        if (currentGroupSortable) sortGroupItems(currentGroup);
        sidebar.push(currentGroup);
    }
    return sidebar;
}

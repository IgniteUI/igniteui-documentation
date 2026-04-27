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
import { slug as githubSlug } from 'github-slugger';

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
    attrs?: Record<string, string | number | boolean | undefined>;
}

interface SidebarGroup {
    label: string;
    items: SidebarEntry[];
    collapsed?: boolean;
}

type SidebarEntry = SidebarLink | SidebarGroup;

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface TocItem {
    name?: string;
    href?: string;
    slug?: string;
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

function hrefToSlug(href: string, docsDir?: string): string {
    if (!href) return '';

    // If docsDir is given, try to read a slug/fileName override from the file.
    if (docsDir) {
        const filePath = fs.existsSync(path.join(docsDir, href))
            ? path.join(docsDir, href)
            : href.endsWith('.mdx')
                ? (fs.existsSync(path.join(docsDir, href.slice(0, -4) + '.md'))
                    ? path.join(docsDir, href.slice(0, -4) + '.md') : null)
                : href.endsWith('.md')
                    ? (fs.existsSync(path.join(docsDir, href.slice(0, -3) + '.mdx'))
                        ? path.join(docsDir, href.slice(0, -3) + '.mdx') : null)
                    : null;
        if (filePath) {
            try {
                let content = fs.readFileSync(filePath, 'utf-8');
                // Strip UTF-8 BOM if present
                if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
                // Check for frontmatter slug first
                const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                if (fmMatch) {
                    const slugMatch = fmMatch[1].match(/^slug:\s*(.+)$/m);
                    if (slugMatch) return slugMatch[1].trim();
                }
                // Check for DocFX metadata fileName (normalizeMdxContent will use it as slug)
                const fnMatch = content.match(/"fileName"\s*:\s*"([^"]+)"/);
                if (fnMatch) return fnMatch[1];
            } catch { /* fall through to path-based slug */ }
        }
    }

    // Strip extension, normalise separators to /, lowercase.
    const withoutExt = href
        .replace(/\\/g, '/')
        .replace(/\.(md|mdx)$/i, '')
        .toLowerCase();
    const withoutIndex = withoutExt.replace(/\/index$/, '');
    if (withoutIndex === 'index') return '';

    // Apply the same per-segment github-slugger normalization that Astro uses
    // when generating content collection entry IDs (see Astro content/utils.js).
    // Use the stateless slug() function (not the GithubSlugger class) to avoid
    // duplicate-counting across segments — e.g. 'controls/igbulletgraph/igbulletgraph'
    // must stay as-is, not become 'controls/igbulletgraph/igbulletgraph-1'.
    return withoutIndex
        .split('/')
        .map(segment => githubSlug(segment))
        .join('/');
}

function convertTocItem(docsDir: string, item: TocItem, exclude: RegExp[]): SidebarEntry | null {
    if (!item.name) return null;

    if (item.items && item.items.length > 0) {
        const group: SidebarGroup = { label: item.name, items: [], collapsed: true };
        if (item.href && docExists(docsDir, item.href, exclude)) {
            group.items.push({ label: 'Overview', slug: item.slug || hrefToSlug(item.href, docsDir) });
        }
        for (const child of item.items) {
            const entry = convertTocItem(docsDir, child, exclude);
            if (entry) group.items.push(entry);
        }
        return group.items.length > 0 ? group : null;
    }

    if (item.href) {
        if (!docExists(docsDir, item.href, exclude)) return null;
        const entry: SidebarLink = { label: item.name, slug: item.slug || hrefToSlug(item.href, docsDir) };
        // Status badge — only one slot available in Starlight, priority order:
        if (item.new) entry.badge = { text: 'New', variant: 'success' };
        else if (item.preview) entry.badge = { text: 'Preview', variant: 'caution' };
        else if (item.updated) entry.badge = { text: 'Updated', variant: 'note' };
        // Premium is rendered via data-premium attr so it can coexist with a
        // status badge (CSS ::after pseudo-element adds the star icon).
        if (item.premium) {
            entry.attrs = { 'data-premium': 'true' };
            // Only use the badge slot for premium when no status badge is shown.
            if (!entry.badge) entry.badge = { text: 'Premium', variant: 'tip' };
        }
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
                currentGroup.items.push({ label: 'Overview', slug: hrefToSlug(item.href, docsDir) });
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

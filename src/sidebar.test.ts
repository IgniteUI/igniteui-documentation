import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildSidebarFromToc } from './sidebar.ts';
import type { SidebarEntry, SidebarGroup, SidebarLink } from './lib/sidebar/types';

let tmp: string;
let docsDir: string;
let tocPath: string;

/** Writes a docs file (any content — only its existence matters here). */
function writeDoc(relPath: string): void {
    const file = path.join(docsDir, relPath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '---\ntitle: Page\n---\n');
}

/** Writes the TOC and returns the sidebar built from it. */
function build(toc: unknown, exclude?: RegExp[]): SidebarEntry[] {
    fs.writeFileSync(tocPath, JSON.stringify(toc));
    return buildSidebarFromToc({ tocPath, docsDir, ...(exclude ? { exclude } : {}) });
}

const asGroup = (entry: SidebarEntry): SidebarGroup => entry as SidebarGroup;
const asLink = (entry: SidebarEntry): SidebarLink => entry as SidebarLink;

beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sidebar-'));
    docsDir = path.join(tmp, 'content');
    fs.mkdirSync(docsDir, { recursive: true });
    tocPath = path.join(tmp, 'toc.json');
});

afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
});

describe('buildSidebarFromToc', () => {
    it('returns an empty sidebar when the TOC path is empty', () => {
        expect(buildSidebarFromToc({ tocPath: '', docsDir })).toEqual([]);
    });

    it('returns an empty sidebar when the TOC file does not exist', () => {
        expect(buildSidebarFromToc({ tocPath: path.join(tmp, 'missing.json'), docsDir })).toEqual([]);
    });

    it('turns a header item into an open root group with an Overview link', () => {
        writeDoc('grids/index.mdx');
        const sidebar = build([
            { name: 'Grids', header: true, href: 'grids/index.mdx' },
        ]);

        expect(sidebar).toHaveLength(1);
        const group = asGroup(sidebar[0]);
        expect(group.label).toBe('Grids');
        expect(group.collapsed).toBe(false);
        expect(group.items).toEqual([{ label: 'Overview', slug: 'grids' }]);
    });

    it('adds the premium badge and data attribute to a premium header Overview link', () => {
        writeDoc('grids/index.mdx');
        const sidebar = build([
            { name: 'Grids', header: true, href: 'grids/index.mdx', premium: true },
        ]);

        expect(asGroup(sidebar[0]).items[0]).toEqual({
            label: 'Overview',
            slug: 'grids',
            attrs: { 'data-premium': 'true' },
            badges: [{ text: 'Premium', variant: 'premium' }],
        });
    });

    it('drops items whose file does not exist', () => {
        writeDoc('grids/grid.mdx');
        const sidebar = build([
            { name: 'Grid', href: 'grids/grid.mdx' },
            { name: 'Ghost', href: 'grids/ghost.mdx' },
        ]);

        expect(sidebar.map(e => e.label)).toEqual(['Grid']);
    });

    it('resolves an .mdx href when only the .md file exists', () => {
        writeDoc('grids/grid.md');
        const sidebar = build([{ name: 'Grid', href: 'grids/grid.mdx' }]);

        expect(sidebar).toEqual([{ label: 'Grid', slug: 'grids/grid' }]);
    });

    it('resolves an .md href when only the .mdx file exists', () => {
        writeDoc('grids/grid.mdx');
        const sidebar = build([{ name: 'Grid', href: 'grids/grid.md' }]);

        expect(sidebar).toEqual([{ label: 'Grid', slug: 'grids/grid' }]);
    });

    it('drops hrefs matched by an exclude pattern', () => {
        writeDoc('grids/grid.mdx');
        writeDoc('internal/notes.mdx');
        const sidebar = build(
            [
                { name: 'Grid', href: 'grids/grid.mdx' },
                { name: 'Notes', href: 'internal/notes.mdx' },
            ],
            [/^internal\//],
        );

        expect(sidebar.map(e => e.label)).toEqual(['Grid']);
    });

    it('sorts a sortable group by label while keeping Overview first', () => {
        writeDoc('grids/index.mdx');
        writeDoc('grids/zebra.mdx');
        writeDoc('grids/alpha.mdx');
        writeDoc('grids/mid.mdx');
        const sidebar = build([
            { name: 'Grids', header: true, href: 'grids/index.mdx', sortable: true },
            { name: 'Zebra', href: 'grids/zebra.mdx' },
            { name: 'Alpha', href: 'grids/alpha.mdx' },
            { name: 'Mid', href: 'grids/mid.mdx' },
        ]);

        expect(asGroup(sidebar[0]).items.map(e => e.label)).toEqual(['Overview', 'Alpha', 'Mid', 'Zebra']);
    });

    it('leaves a non-sortable group in TOC order', () => {
        writeDoc('grids/zebra.mdx');
        writeDoc('grids/alpha.mdx');
        const sidebar = build([
            { name: 'Grids', header: true },
            { name: 'Zebra', href: 'grids/zebra.mdx' },
            { name: 'Alpha', href: 'grids/alpha.mdx' },
        ]);

        expect(asGroup(sidebar[0]).items.map(e => e.label)).toEqual(['Zebra', 'Alpha']);
    });

    it('places items before any header at the root and later items under their header', () => {
        writeDoc('intro.mdx');
        writeDoc('grids/grid.mdx');
        const sidebar = build([
            { name: 'Intro', href: 'intro.mdx' },
            { name: 'Grids', header: true },
            { name: 'Grid', href: 'grids/grid.mdx' },
        ]);

        expect(sidebar.map(e => e.label)).toEqual(['Intro', 'Grids']);
        expect(asGroup(sidebar[1]).items.map(e => e.label)).toEqual(['Grid']);
    });

    it('collapses nested groups but leaves root groups open', () => {
        writeDoc('charts/pie.mdx');
        writeDoc('grids/grid.mdx');
        const sidebar = build([
            { name: 'Charts', items: [{ name: 'Pie', href: 'charts/pie.mdx' }] },
            { name: 'Grids', header: true },
            { name: 'Data Grid', items: [{ name: 'Grid', href: 'grids/grid.mdx' }] },
        ]);

        // Depth 0 — a group outside any header section.
        expect(asGroup(sidebar[0]).collapsed).toBe(false);
        // Depth 0 — the header section itself.
        expect(asGroup(sidebar[1]).collapsed).toBe(false);
        // Depth 1 — a group inside a header section.
        expect(asGroup(asGroup(sidebar[1]).items[0]).collapsed).toBe(true);
    });

    it('maps badge flags on an ordinary item to badge entries', () => {
        writeDoc('grids/grid.mdx');
        const sidebar = build([
            { name: 'Grid', href: 'grids/grid.mdx', new: true, preview: true },
        ]);

        expect(asLink(sidebar[0]).badges).toEqual([
            { text: 'New', variant: 'new' },
            { text: 'Preview', variant: 'preview' },
        ]);
        expect(asLink(sidebar[0]).attrs).toBeUndefined();
    });

    it('adds the premium data attribute alongside the badge on an ordinary item', () => {
        writeDoc('grids/grid.mdx');
        const sidebar = build([
            { name: 'Grid', href: 'grids/grid.mdx', premium: true },
        ]);

        expect(asLink(sidebar[0])).toEqual({
            label: 'Grid',
            slug: 'grids/grid',
            attrs: { 'data-premium': 'true' },
            badges: [{ text: 'Premium', variant: 'premium' }],
        });
    });

    it('drops a group whose children all resolve to missing files', () => {
        const sidebar = build([
            { name: 'Charts', items: [{ name: 'Pie', href: 'charts/pie.mdx' }] },
        ]);

        expect(sidebar).toEqual([]);
    });

    it('resolves a page from the highest-precedence root that supplies it', () => {
        const overlay = path.join(tmp, 'overlay');
        fs.mkdirSync(path.join(overlay, 'grids'), { recursive: true });
        fs.writeFileSync(path.join(overlay, 'grids', 'grid.mdx'), '---\ntitle: Grid\n---\n');
        fs.writeFileSync(tocPath, JSON.stringify([{ name: 'Grid', href: 'grids/grid.mdx' }]));

        // The base root has no such file; the overlay supplies it.
        const sidebar = buildSidebarFromToc({ tocPath, docsDir: [overlay, docsDir] });
        expect(sidebar).toEqual([{ label: 'Grid', slug: 'grids/grid' }]);
    });

    it('ignores a page a root excludes', () => {
        writeDoc('changelog/notes.mdx');
        fs.writeFileSync(tocPath, JSON.stringify([{ name: 'Notes', href: 'changelog/notes.mdx' }]));

        const sidebar = buildSidebarFromToc({
            tocPath,
            docsDir: [{ dir: docsDir, exclude: ['changelog/**'] }],
        });
        expect(sidebar).toEqual([]);
    });
});

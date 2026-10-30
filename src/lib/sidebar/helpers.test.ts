import { describe, expect, it } from 'vitest';
import {
    getActiveLabel,
    getAncestorTrail,
    getBreadcrumb,
    hasActive,
    isActive,
    isGroup,
    isInitiallyOpen,
    joinPath,
    normalizeSlug,
} from './helpers.ts';
import type { SidebarEntry, SidebarGroup } from './types';

/**
 * Three-level fixture reused by the tree-walking helpers:
 *
 *   Grids & Lists            (root group)
 *     └ Data Grid            (nested group)
 *         └ Editing          (nested group)
 *             ├ Overview     grids/data-grid/editing
 *             └ Cell Editing grids/data-grid/editing/cell
 *     └ List                 grids/list
 *   General                  (root group)
 *     └ Getting Started      general/getting-started
 */
const tree = (): SidebarEntry[] => [
    {
        label: 'Grids & Lists',
        collapsed: false,
        items: [
            {
                label: 'Data Grid',
                collapsed: true,
                items: [
                    {
                        label: 'Editing',
                        collapsed: true,
                        items: [
                            { label: 'Overview', slug: 'grids/data-grid/editing' },
                            { label: 'Cell Editing', slug: 'grids/data-grid/editing/cell' },
                        ],
                    },
                ],
            },
            { label: 'List', slug: 'grids/list' },
        ],
    },
    {
        label: 'General',
        collapsed: false,
        items: [
            { label: 'Getting Started', slug: 'general/getting-started' },
        ],
    },
];

describe('isGroup', () => {
    it('recognises an entry with items as a group', () => {
        expect(isGroup({ label: 'Grids', items: [] })).toBe(true);
    });

    it('recognises an entry with a slug as a link', () => {
        expect(isGroup({ label: 'List', slug: 'grids/list' })).toBe(false);
    });
});

describe('normalizeSlug', () => {
    it('strips a leading slash', () => {
        expect(normalizeSlug('/grids/list')).toBe('grids/list');
    });

    it('strips a trailing slash', () => {
        expect(normalizeSlug('grids/list/')).toBe('grids/list');
    });

    it('strips both a leading and a trailing slash', () => {
        expect(normalizeSlug('/grids/list/')).toBe('grids/list');
    });

    it('leaves inner slashes alone', () => {
        expect(normalizeSlug('grids/data-grid/editing')).toBe('grids/data-grid/editing');
    });

    it('returns an empty string for the root slug', () => {
        expect(normalizeSlug('/')).toBe('');
    });
});

describe('isActive', () => {
    it('matches two identical slugs', () => {
        expect(isActive('grids/list', 'grids/list')).toBe(true);
    });

    it('does not match two different slugs', () => {
        expect(isActive('grids/list', 'grids/grid')).toBe(false);
    });

    it('ignores leading and trailing slashes on either side', () => {
        expect(isActive('/grids/list/', 'grids/list')).toBe(true);
        expect(isActive('grids/list', '/grids/list/')).toBe(true);
    });

    it('does not treat a prefix as a match', () => {
        expect(isActive('grids', 'grids/list')).toBe(false);
    });
});

describe('hasActive', () => {
    it('finds a match among the links at the top level of the list', () => {
        const items = (tree()[0] as SidebarGroup).items;
        expect(hasActive(items, 'grids/list')).toBe(true);
    });

    it('finds a match nested several levels deep', () => {
        expect(hasActive(tree(), 'grids/data-grid/editing/cell')).toBe(true);
    });

    it('returns false when no descendant matches', () => {
        expect(hasActive(tree(), 'charts/pie')).toBe(false);
    });
});

describe('joinPath', () => {
    it('joins ancestors and the label with a greater-than sign', () => {
        expect(joinPath(['Grids & Lists', 'Data Grid'], 'Editing')).toBe('Grids & Lists>Data Grid>Editing');
    });

    it('returns just the label when there are no ancestors', () => {
        expect(joinPath([], 'General')).toBe('General');
    });

    it('keeps empty ancestor labels as empty segments', () => {
        expect(joinPath([''], 'General')).toBe('>General');
    });
});

describe('isInitiallyOpen', () => {
    it('opens a collapsed group that contains the active page', () => {
        const group: SidebarGroup = {
            label: 'Editing',
            collapsed: true,
            items: [{ label: 'Overview', slug: 'grids/data-grid/editing' }],
        };
        expect(isInitiallyOpen(group, 'grids/data-grid/editing')).toBe(true);
    });

    it('keeps a collapsed group closed when it does not contain the active page', () => {
        const group: SidebarGroup = {
            label: 'Editing',
            collapsed: true,
            items: [{ label: 'Overview', slug: 'grids/data-grid/editing' }],
        };
        expect(isInitiallyOpen(group, 'charts/pie')).toBe(false);
    });

    it('opens a group explicitly marked as not collapsed', () => {
        const group: SidebarGroup = {
            label: 'General',
            collapsed: false,
            items: [{ label: 'Getting Started', slug: 'general/getting-started' }],
        };
        expect(isInitiallyOpen(group, 'charts/pie')).toBe(true);
    });

    it('keeps a group without a collapsed flag closed', () => {
        const group: SidebarGroup = {
            label: 'General',
            items: [{ label: 'Getting Started', slug: 'general/getting-started' }],
        };
        expect(isInitiallyOpen(group, 'charts/pie')).toBe(false);
    });
});

describe('getAncestorTrail', () => {
    it('returns every ancestor label root-first for a deeply nested page', () => {
        expect(getAncestorTrail(tree(), 'grids/data-grid/editing/cell')).toEqual([
            'Grids & Lists',
            'Data Grid',
            'Editing',
        ]);
    });

    it('returns the single ancestor of a page one level down', () => {
        expect(getAncestorTrail(tree(), 'general/getting-started')).toEqual(['General']);
    });

    it('returns an empty array when the slug is not in the tree', () => {
        expect(getAncestorTrail(tree(), 'charts/pie')).toEqual([]);
    });
});

describe('getActiveLabel', () => {
    it('returns the label of the matching nested link', () => {
        expect(getActiveLabel(tree(), 'grids/data-grid/editing/cell')).toBe('Cell Editing');
    });

    it('returns an empty string when the slug is not in the tree', () => {
        expect(getActiveLabel(tree(), 'charts/pie')).toBe('');
    });
});

describe('getBreadcrumb', () => {
    it('drops the root group and ends with the active label', () => {
        expect(getBreadcrumb(tree(), 'grids/data-grid/editing/cell')).toEqual([
            'Data Grid',
            'Editing',
            'Cell Editing',
        ]);
    });

    it('returns just the leaf label for a page directly under a root group', () => {
        expect(getBreadcrumb(tree(), 'general/getting-started')).toEqual(['Getting Started']);
    });

    it('returns an empty array when the slug is not in the tree', () => {
        expect(getBreadcrumb(tree(), 'charts/pie')).toEqual([]);
    });
});

/**
 * Pure sidebar tree helpers — no DOM, no I/O.
 * Shared by the SSR components and any consumer that walks the tree.
 */

import type { SidebarEntry, SidebarGroup } from './types';

export const isGroup = (e: SidebarEntry): e is SidebarGroup => 'items' in e;

export const normalizeSlug = (slug: string): string => slug.replace(/^\/|\/$/g, '');

export const isActive = (slug: string, current: string): boolean =>
  normalizeSlug(slug) === normalizeSlug(current);

/** True if any descendant link matches the current slug. */
export const hasActive = (items: SidebarEntry[], current: string): boolean =>
  items.some((item) =>
    isGroup(item) ? hasActive(item.items, current) : isActive(item.slug, current),
  );

/** Stable path key: ancestor labels + own label, joined with `>`. */
export const joinPath = (ancestors: string[], label: string): string =>
  [...ancestors, label].join('>');

/**
 * Initial open state for a group:
 *   • forced open if it contains the active page
 *   • otherwise driven by the group's `collapsed` flag (open when not collapsed)
 *
 * Convention used by `buildSidebarFromToc`: root groups have `collapsed:false`,
 * nested groups have `collapsed:true`.
 */
export const isInitiallyOpen = (group: SidebarGroup, currentSlug: string): boolean =>
  hasActive(group.items, currentSlug) || group.collapsed === false;

/**
 * Walk the sidebar tree to find the active link, returning the chain of
 * ancestor group labels (root-first). Returns `[]` if the slug is not found.
 *
 *   getAncestorTrail(tree, 'grids/data-grid/editing')
 *   // → ['Grids & Lists', 'Data Grid', 'Editing']
 */
export const getAncestorTrail = (
  items: SidebarEntry[],
  currentSlug: string,
  trail: string[] = [],
): string[] => {
  for (const item of items) {
    if (isGroup(item)) {
      const found = getAncestorTrail(item.items, currentSlug, [...trail, item.label]);
      if (found.length > 0) return found;
    } else if (isActive(item.slug, currentSlug)) {
      return trail;
    }
  }
  return [];
};

/** Returns the active link's own label, or `''` if the slug is not in the tree. */
export const getActiveLabel = (items: SidebarEntry[], currentSlug: string): string => {
  for (const item of items) {
    if (isGroup(item)) {
      const found = getActiveLabel(item.items, currentSlug);
      if (found) return found;
    } else if (isActive(item.slug, currentSlug)) {
      return item.label;
    }
  }
  return '';
};

/**
 * Breadcrumb for the current page, starting **below** the root group (root is
 * dropped — UI shows the site title there) and ending with the active item's
 * own label. Returns `[]` if the page is not in the sidebar.
 */
export const getBreadcrumb = (items: SidebarEntry[], currentSlug: string): string[] => {
  const ancestors = getAncestorTrail(items, currentSlug).slice(1);
  const leaf = getActiveLabel(items, currentSlug);
  return leaf ? [...ancestors, leaf] : ancestors;
};

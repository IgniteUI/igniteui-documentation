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

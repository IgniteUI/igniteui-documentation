/**
 * Shared sidebar types + pure helpers. Used by SidebarTree / SidebarItem.
 */

export type SidebarBadge = { text: string; variant: string };

export type SidebarLink = {
  label: string;
  slug: string;
  badge?: SidebarBadge;
  attrs?: Record<string, string | number | boolean | undefined>;
};

export type SidebarGroup = {
  label: string;
  items: SidebarEntry[];
  collapsed?: boolean;
};

export type SidebarEntry = SidebarLink | SidebarGroup;

export const isGroup = (e: SidebarEntry): e is SidebarGroup => 'items' in e;

export const normalize = (slug: string): string => slug.replace(/^\/|\/$/g, '');

export const isActive = (slug: string, current: string): boolean =>
  normalize(slug) === normalize(current);

export const hasActive = (items: SidebarEntry[], current: string): boolean =>
  items.some((item) =>
    isGroup(item) ? hasActive(item.items, current) : isActive(item.slug, current),
  );

/** Stable path key: ancestor labels + own label, joined with `>`. */
export const joinPath = (ancestors: string[], label: string): string =>
  [...ancestors, label].join('>');

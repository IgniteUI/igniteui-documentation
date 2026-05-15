/**
 * Sidebar data types — shared between the build-time TOC builder
 * (`src/sidebar.ts`) and the runtime sidebar components
 * (`src/components/sidebar/*`).
 *
 * Single source of truth, no duplication.
 */

export type SidebarBadgeVariant =
  | 'note'
  | 'danger'
  | 'success'
  | 'caution'
  | 'tip'
  | 'default';

export interface SidebarBadge {
  text: string;
  variant: SidebarBadgeVariant;
}

export interface SidebarLink {
  label: string;
  slug: string;
  badges?: SidebarBadge[];
  attrs?: Record<string, string | number | boolean | undefined>;
}

export interface SidebarGroup {
  label: string;
  items: SidebarEntry[];
  /** When `true`, the group is rendered closed by default. Defaults to open. */
  collapsed?: boolean;
}

export type SidebarEntry = SidebarLink | SidebarGroup;

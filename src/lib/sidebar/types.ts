/**
 * Sidebar data types — re-exported from `igniteui-astro-components` so the
 * producer (this repo's `buildSidebarFromToc`) and consumer (the package's
 * `DocsSidebar` renderer) always agree on the shape.
 *
 * Do not duplicate these types locally; keep this file as a thin re-export.
 */

export { SIDEBAR_BADGE_VARIANTS } from 'igniteui-astro-components/lib/sidebar/types';
export type {
  SidebarEntry,
  SidebarGroup,
  SidebarLink,
  SidebarBadge,
  SidebarBadgeVariant,
} from 'igniteui-astro-components/lib/sidebar/types';

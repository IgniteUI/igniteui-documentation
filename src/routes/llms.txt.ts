import type { APIRoute } from 'astro';
import { title, description, sidebar } from 'virtual:docs-template/site-meta';

export const prerender = true;

type SidebarItem = { label: string; slug?: string; items?: SidebarItem[] };

function walkSidebar(items: SidebarItem[], base: string, lines: string[], depth = 0) {
  const nestedGroups: SidebarItem[] = [];
  for (const item of items) {
    if (item.slug !== undefined) {
      if (depth === 1) {
        lines.push("", `### ${item.label}`, "");
      }

      const slug = item.slug === '' ? 'index' : item.slug;
      lines.push(`- [${item.label}](${base}/${slug}.md)`);
      continue;
    }

    if (Array.isArray(item.items) && item.items.length > 0) {
      nestedGroups.push(item);
    }
  }

  for (const group of nestedGroups) {
    if (depth < 3) {
      const headingLevel = depth === 0 ? 2 : depth + 2;
      lines.push("", `${"#".repeat(headingLevel)} ${group.label}`, "");
    }

    walkSidebar(group.items!, base, lines, depth + 1);
  }
}

export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? '').replace(/\/$/, '');
  const lines: string[] = [`# ${title}`, '', `> ${description}`, ''];
  walkSidebar(sidebar as SidebarItem[], base, lines);
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

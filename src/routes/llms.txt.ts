import type { APIRoute } from 'astro';
// @ts-expect-error virtual module provided by siteMetaIntegration
import { title, description, sidebar } from 'virtual:docs-template/site-meta';

export const prerender = true;

type SidebarItem = { label: string; slug?: string; items?: SidebarItem[] };

function walkSidebar(items: SidebarItem[], base: string, lines: string[], depth = 0) {
  for (const item of items) {
    if (item.slug !== undefined) {
      lines.push(`- [${item.label}](${base}/${item.slug}.md)`);
    } else if (Array.isArray(item.items)) {
      lines.push('', `## ${item.label}`, '');
      walkSidebar(item.items, base, lines, depth + 1);
    }
  }
}

export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? '').replace(/\/$/, '');
  const lines: string[] = [`# ${title}`, '', `> ${description}`, ''];
  walkSidebar(sidebar, base, lines);
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

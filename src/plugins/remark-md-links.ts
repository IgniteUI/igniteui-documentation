/**
 * Remark plugin: rewrite relative .md links to Astro-compatible URLs.
 *
 * Transforms `[label](./some-page.md)` or `[label](../folder/page.md#section)`
 * into root-relative URLs like `/products/.../some-page/` (with DOCS_BASE prepended).
 *
 * Also prepends DOCS_BASE to bare root-relative internal links (e.g. `/grids/grid/...`)
 * that are already absolute but missing the site base path.
 */

import { visit } from 'unist-util-visit';
import path from 'node:path';

/**
 * Resolve a relative .md link to an absolute Astro URL.
 * Non-relative, non-.md, and external links are returned unchanged.
 */
function rewriteMdLink(url: string, filePath: string, docsDir: string): string {
  if (!url) return url;
  if (
    url.startsWith('http://') || url.startsWith('https://') ||
    url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:')
  ) return url;

  const hashIdx = url.indexOf('#');
  const qIdx = url.indexOf('?');
  const splitAt = hashIdx !== -1 ? hashIdx : qIdx !== -1 ? qIdx : -1;
  let mdPath = splitAt !== -1 ? url.slice(0, splitAt) : url;
  const suffix = splitAt !== -1 ? url.slice(splitAt) : '';

  if (!mdPath.endsWith('.md')) return url;

  const fileDir = path.dirname(filePath);
  const resolved = path.resolve(fileDir, mdPath);
  const rel = path.relative(docsDir, resolved).replace(/\\/g, '/');
  const slug = rel.endsWith('.md') ? rel.slice(0, -3) : rel;

  const docsBase = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');
  return docsBase + '/' + slug.toLowerCase() + '/' + suffix;
}

/** Remark plugin that rewrites relative .md links and prepends DOCS_BASE. */
export function remarkMdLinks() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any, file: any) => {
    const filePath = (file.path as string) ?? '';
    const docsDir = process.env.DOCS_SOURCE_PATH
      ? path.resolve(process.env.DOCS_SOURCE_PATH)
      : (filePath ? path.dirname(filePath) : '');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, 'link', (node: any) => {
      node.url = rewriteMdLink(node.url as string, filePath, docsDir);

      // Prepend DOCS_BASE to root-relative internal links not already prefixed.
      const docsBase = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');
      if (
        docsBase &&
        (node.url as string).startsWith('/') &&
        !(node.url as string).startsWith('//') &&
        !(node.url as string).startsWith(docsBase + '/')
      ) {
        node.url = docsBase + (node.url as string);
      }
    });
  };
}

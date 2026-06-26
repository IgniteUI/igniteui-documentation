/**
 * Remark plugin: rewrite relative .mdx links to Astro-compatible URLs.
 *
 * Transforms `[label](./some-page.mdx)` or `[label](../folder/page.mdx#section)`
 * into root-relative URLs like `/products/.../some-page` (with DOCS_BASE prepended).
 *
 * Convention: source files use `.mdx` extension in relative links (enables editor
 * Go-to-Definition). This plugin strips the extension and makes the URL absolute
 * so the rendered HTML uses clean extension-less paths.
 *
 * Also prepends DOCS_BASE to bare root-relative internal links (e.g. `/grids/grid/...`)
 * that are already absolute but missing the site base path.
 *
 * Respects trailing slash preference via DOCS_TRAILING_SLASH env var ('always', 'never', 'ignore').
 * Both Angular and Xplat astro docs default to trailing slash 'never'.
 *
 * Non-relative links (http/https, /, #, mailto:) and links without .mdx are left unchanged.
 */

import { visit } from 'unist-util-visit';
import path from 'node:path';

/**
 * Resolve a relative .mdx link to an absolute Astro URL.
 * Non-relative, non-.mdx, and external links are returned unchanged.
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
  const mdPath = splitAt !== -1 ? url.slice(0, splitAt) : url;
  const suffix = splitAt !== -1 ? url.slice(splitAt) : '';

  if (!mdPath.endsWith('.mdx')) return url;

  const fileDir = path.dirname(filePath);
  const resolved = path.resolve(fileDir, mdPath);
  const rel = path.relative(docsDir, resolved).replace(/\\/g, '/');
  let slug = rel.slice(0, -4); // strip .mdx
  // index.mdx files generate the parent folder URL (e.g. themes/index.mdx → themes)
  if (slug.endsWith('/index')) slug = slug.slice(0, -6);

  const docsBase = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');
  const trailingSlash = process.env.DOCS_TRAILING_SLASH ?? 'ignore';
  const trail = trailingSlash === 'never' ? '' : '/';
  return docsBase + '/' + slug.toLowerCase() + trail + suffix;
}

/** Remark plugin that rewrites relative .mdx links, prepends DOCS_BASE, and fixes relative image paths. */
export function remarkMdLinks() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any, file: any) => {
    const filePath = (file.path as string) ?? '';
    const docsDir = process.env.DOCS_SOURCE_PATH
      ? path.resolve(process.env.DOCS_SOURCE_PATH)
      : (filePath ? path.dirname(filePath) : '');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, (node: any) => {
      if (node.type === 'link' && node.url) {
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
      }

      // Rewrite relative `../images/` paths in markdown image nodes to root-relative `/images/`.
      // Generated MDX files may contain relative image references that Vite cannot resolve.
      if (node.type === 'image' && node.url) {
        node.url = (node.url as string).replace(/^(\.\.\/)+images\//, '/images/');
      }
    });
  };
}

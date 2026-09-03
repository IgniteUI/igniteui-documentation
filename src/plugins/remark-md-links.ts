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

import { defineMdastPlugin } from 'satteri';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docRootsFromEnv, rootForFile, type ResolvedDocRoot } from '../lib/doc-roots.ts';

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

/** Parsed once — this runs for every link node in every page. */
let docRootsCache: ResolvedDocRoot[] | undefined;
function cachedDocRoots(): ResolvedDocRoot[] {
  return (docRootsCache ??= docRootsFromEnv());
}

/**
 * Resolve the source file path and docs root for the document being compiled.
 *
 * With several content roots the slug must be computed against the root the
 * file itself lives in — every root shares one slug namespace, so a link from
 * a generated topic to an authored one still lands on the right URL even though
 * the target does not exist inside the generated tree.
 */
function resolvePaths(fileURL: URL | undefined): { filePath: string; docsDir: string } {
  const filePath = fileURL ? fileURLToPath(fileURL) : '';
  const ownRoot = filePath ? rootForFile(cachedDocRoots(), filePath) : undefined;
  const docsDir = ownRoot
    ?? (process.env.DOCS_SOURCE_PATH
      ? path.resolve(process.env.DOCS_SOURCE_PATH)
      : (filePath ? path.dirname(filePath) : ''));
  return { filePath, docsDir };
}

/**
 * Sätteri MDAST plugin that rewrites relative .mdx links, prepends DOCS_BASE,
 * and fixes relative image paths.
 */
export function remarkMdLinks() {
  return defineMdastPlugin({
    name: 'md-links',

    link(node, ctx) {
      if (!node.url) return;
      const { filePath, docsDir } = resolvePaths(ctx.fileURL);
      let url = rewriteMdLink(node.url, filePath, docsDir);

      // Prepend DOCS_BASE to root-relative internal links not already prefixed.
      const docsBase = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');
      if (
        docsBase &&
        url.startsWith('/') &&
        !url.startsWith('//') &&
        !url.startsWith(docsBase + '/')
      ) {
        url = docsBase + url;
      }

      if (url !== node.url) ctx.setProperty(node, 'url', url);
    },

    // Rewrite relative `../images/` paths in markdown image nodes to root-relative `/images/`.
    // Generated MDX files may contain relative image references that Vite cannot resolve.
    image(node, ctx) {
      if (!node.url) return;
      const url = node.url.replace(/^(\.\.\/)+images\//, '/images/');
      if (url !== node.url) ctx.setProperty(node, 'url', url);
    },
  });
}

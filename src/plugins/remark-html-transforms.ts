/**
 * Sätteri MDAST plugin: inline HTML transforms.
 *
 * Handles legacy HTML patterns in markdown content:
 *   - Rewrites relative `../images/` sources to root-relative paths
 *   - Normalizes code block language identifiers to lowercase
 */

import { defineMdastPlugin } from 'satteri';

const IMG_SRC_PATTERN = /src="(\.\.\/)+images\//g;

/** Sätteri MDAST plugin that transforms legacy HTML patterns in the AST. */
export function remarkHtmlTransforms() {
  return defineMdastPlugin({
    name: 'html-transforms',

    // Inline HTML: relative img src → root-relative
    html(node, ctx) {
      if (!node.value) return;
      const value = node.value.replace(IMG_SRC_PATTERN, 'src="/images/');
      if (value !== node.value) ctx.setProperty(node, 'value', value);
    },

    // Code blocks: normalize language to lowercase
    code(node, ctx) {
      if (!node.lang) return;
      const lang = node.lang.toLowerCase();
      if (lang !== node.lang) ctx.setProperty(node, 'lang', lang);
    },
  });
}

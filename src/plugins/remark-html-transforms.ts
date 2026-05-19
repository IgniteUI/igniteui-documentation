/**
 * Remark plugin: inline HTML transforms.
 *
 * Handles legacy HTML patterns in markdown content:
 *   - `<div class="divider--half"></div>` → `<hr/>`
 *   - Normalizes code block language identifiers to lowercase
 */

import { visit } from 'unist-util-visit';

const DIVIDER_PATTERN = /<div\s+class="divider--half"\s*>\s*<\/div>/g;
const IMG_SRC_PATTERN = /src="(\.\.\/)+images\//g;

/** Remark plugin that transforms legacy HTML patterns in the AST. */
export function remarkHtmlTransforms() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, (node: any) => {
      // Inline HTML: divider → hr, relative img src → root-relative
      if (node.type === 'html' && node.value) {
        node.value = (node.value as string).replace(DIVIDER_PATTERN, '<hr/>');
        node.value = (node.value as string).replace(IMG_SRC_PATTERN, 'src="/images/');
      }

      // Code blocks: normalize language to lowercase
      if (node.type === 'code' && node.lang) {
        node.lang = (node.lang as string).toLowerCase();
      }
    });
  };
}

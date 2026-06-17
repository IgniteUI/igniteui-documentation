/**
 * Rehype plugin: strip empty &lt;p&gt; tags.
 *
 * Remark inserts empty paragraph nodes for the whitespace/newlines that appear
 * between sibling HTML elements inside custom elements such as
 * `<igc-expansion-panel>`. For example:
 *
 *   <igc-expansion-panel>
 *     <span slot="title">…</span>   ← newline here becomes <p></p>
 *     <ul>…</ul>                    ← newline here becomes <p></p>
 *   </igc-expansion-panel>
 *
 * This plugin removes any `<p>` element whose children are all absent or
 * consist solely of whitespace text nodes.
 */

import { visit, CONTINUE } from 'unist-util-visit';

/** Returns true when a `<p>` node has no meaningful content. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEmptyParagraph(node: any): boolean {
    if (!node.children || node.children.length === 0) return true;
    return node.children.every(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (child: any) => child.type === 'text' && child.value.trim() === ''
    );
}

/** Rehype plugin that removes empty `<p>` elements from the tree. */
export function rehypeStripEmptyParagraphs() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
            if (node.tagName !== 'p' || !parent || index == null) return;
            if (isEmptyParagraph(node)) {
                parent.children.splice(index, 1);
                // Return the same index so the visitor re-checks this position
                return [CONTINUE, index];
            }
        });
    };
}

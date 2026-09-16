/**
 * Sätteri HAST plugin: strip empty &lt;p&gt; tags.
 *
 * The Markdown parser inserts empty paragraph nodes for the whitespace/newlines
 * that appear between sibling HTML elements inside custom elements such as
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

import { defineHastPlugin } from 'satteri';
import type { Element } from 'hast';

/** Returns true when a `<p>` node has no meaningful content. */
function isEmptyParagraph(node: Readonly<Element>): boolean {
    if (!node.children || node.children.length === 0) return true;
    return node.children.every(
        (child) => child.type === 'text' && child.value.trim() === ''
    );
}

/** Sätteri HAST plugin that removes empty `<p>` elements from the tree. */
export function rehypeStripEmptyParagraphs() {
    return defineHastPlugin({
        name: 'strip-empty-paragraphs',
        element: {
            filter: ['p'],
            visit(node, ctx) {
                if (isEmptyParagraph(node)) ctx.removeNode(node);
            },
        },
    });
}

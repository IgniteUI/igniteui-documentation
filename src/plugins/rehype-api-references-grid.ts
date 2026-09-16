/**
 * Sätteri HAST plugin: wrap API References section content in a grid nav.
 *
 * Markdown `## API References` headings are followed by <ApiLink> components
 * and <PlatformBlock> wrappers separated by <br> tags. Blank lines between
 * items create multiple <p> elements, so a plain CSS `h2 + p` selector only
 * catches the first paragraph.
 *
 * This plugin finds every <h2> whose text is "API References", collects all
 * following siblings up to the next heading, strips <br> nodes and blank text
 * nodes, and wraps the collected nodes in:
 *   <nav class="idg-api-references">…</nav>
 *
 * The collected nodes are copied into the wrapper (see `detach`) and the
 * originals removed, which carries MDX components across intact.
 */

import { defineHastPlugin } from 'satteri';
import type { HastNode } from 'satteri';
import type { ElementContent } from 'hast';

/** True if the node is a heading (h1–h6). */
function isHeading(node: HastNode): boolean {
    return node.type === 'element' && /^h[1-6]$/.test(node.tagName);
}

/** True if the node is an empty or whitespace-only text node. */
function isBlankText(node: HastNode): boolean {
    return node.type === 'text' && node.value.trim() === '';
}

/** True if the node is a <br> in any form (HTML element or MDX JSX). */
function isBr(node: HastNode): boolean {
    return (node.type === 'element' && node.tagName === 'br') ||
           ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'br');
}

/**
 * Recursively copy a node into a plain, id-free object.
 *
 * Sätteri encodes a node that still carries its arena id as a *ref*, which
 * copies the subtree but leaves the original in place — and removing that
 * original then invalidates the ref, deleting the copy too. Spreading drops the
 * non-enumerable id (the materializers' convention), so the result is rebuilt
 * as fresh content and the original can safely be removed.
 */
function detach<T extends HastNode>(node: T): T {
    const copy = { ...node } as T & { children?: HastNode[] };
    const children = childrenOf(node);
    if (children) copy.children = children.map(detach);
    return copy;
}

/** Children of a node, or `undefined` for the leaf types that have none. */
function childrenOf(node: HastNode): HastNode[] | undefined {
    const children = (node as { children?: HastNode[] }).children;
    return Array.isArray(children) ? children : undefined;
}

export function rehypeApiReferencesGrid() {
    return defineHastPlugin({
        name: 'api-references-grid',
        element: {
            filter: ['h2'],
            visit(node, ctx) {
                if (ctx.textContent(node).trim() !== 'API References') return;

                const parent = ctx.parent(node);
                const index = ctx.indexOf(node);
                if (!parent || index === undefined) return;

                // Collect all siblings after the heading until the next heading.
                const siblings = parent.children as HastNode[];
                let end = index + 1;
                while (end < siblings.length && !isHeading(siblings[end])) end++;

                const contentNodes = siblings.slice(index + 1, end);
                if (contentNodes.length === 0) return;

                // Flatten: unwrap <p> elements so their children become direct grid items.
                const flatNodes: HastNode[] = [];
                for (const n of contentNodes) {
                    if (n.type === 'element' && n.tagName === 'p') {
                        flatNodes.push(...(childrenOf(n) ?? []));
                    } else {
                        flatNodes.push(n);
                    }
                }

                const gridItems = flatNodes.filter((n) => !isBlankText(n) && !isBr(n));
                if (gridItems.length === 0) return;

                ctx.insertAfter(node, {
                    type: 'element',
                    tagName: 'nav',
                    properties: { className: ['idg-api-references'] },
                    children: gridItems.map(detach) as ElementContent[],
                });

                // The nav holds detached copies, so every original is removed.
                for (const n of contentNodes) ctx.removeNode(n);
            },
        },
    });
}

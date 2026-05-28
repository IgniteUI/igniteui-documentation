/**
 * Rehype plugin: wrap API References section content in a grid div.
 *
 * Markdown `## API References` headings are followed by <ApiLink> components
 * and <PlatformBlock> wrappers separated by <br> tags. Blank lines between
 * items create multiple <p> elements, so a plain CSS `h2 + p` selector only
 * catches the first paragraph.
 *
 * This plugin walks the HAST, finds every <h2> whose text is "API References",
 * collects all following siblings up to the next heading, strips <br> nodes and blank text nodes,
 * and wraps the collected nodes in:
 *   <div class="api-references-grid">…</div>
 */

import { visit, SKIP } from 'unist-util-visit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HastNode = any;

/** True if the node is a heading (h1–h6). */
function isHeading(node: HastNode): boolean {
    return node.type === 'element' && /^h[1-6]$/.test(node.tagName);
}

/** True if the node is an <h2> whose text content equals "API References". */
function isApiReferencesHeading(node: HastNode): boolean {
    if (node.type !== 'element' || node.tagName !== 'h2') return false;
    const text = extractText(node).trim();
    return text === 'API References';
}

/** Recursively extract all text from a node. */
function extractText(node: HastNode): string {
    if (node.type === 'text') return node.value;
    if (node.children) return node.children.map(extractText).join('');
    return '';
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

/** Strip blank text nodes and <br> elements from a node list. */
function stripBlanks(nodes: HastNode[]): HastNode[] {
    return nodes.filter((n) => !isBlankText(n) && !isBr(n));
}

export function rehypeApiReferencesGrid() {
    return (tree: HastNode) => {
        // Process any container node (root or element) whose children may include headings.
        // The `root` node holds top-level siblings — that's where ## API References and the
        // following <ApiLink> blocks live, so we must include it in the visitor.
        visit(tree, (node: HastNode) => node.type === 'root' || (node.type === 'element' && !!node.children), (node: HastNode) => {

            const children: HastNode[] = node.children;
            let i = 0;

            while (i < children.length) {
                const child = children[i];

                if (isApiReferencesHeading(child)) {
                    // Collect all siblings after the heading until the next heading
                    const start = i + 1;
                    let end = start;

                    while (end < children.length && !isHeading(children[end])) {
                        end++;
                    }

                    const contentNodes = children.slice(start, end);

                    // Flatten: unwrap <p> elements so their children become direct grid items
                    const flatNodes: HastNode[] = [];
                    for (const n of contentNodes) {
                        if (n.type === 'element' && n.tagName === 'p') {
                            flatNodes.push(...(n.children ?? []));
                        } else {
                            flatNodes.push(n);
                        }
                    }

                    const gridItems = stripBlanks(flatNodes);

                    if (gridItems.length === 0) {
                        i++;
                        continue;
                    }

                    // Build the wrapper nav
                    const gridDiv: HastNode = {
                        type: 'element',
                        tagName: 'nav',
                        properties: { className: ['idg-api-references'] },
                        children: gridItems,
                    };

                    // Replace the original siblings with the wrapper
                    children.splice(start, end - start, gridDiv);

                    // Skip past the newly inserted wrapper
                    i = start + 1;
                    return SKIP;
                }

                i++;
            }
        });
    };
}

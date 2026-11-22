/**
 * Markdown → HTML tree with the URLs of links and images kept exactly as written. The default
 * handlers percent-encode them, which would turn `%%jQueryApiUrl%%` into `%25%25jQueryApiUrl%25%25`
 * before the link steps can read it.
 */
import { toHast } from 'mdast-util-to-hast';

function link(state, node) {
    const properties = { href: node.url };
    if (node.title !== null && node.title !== undefined) properties.title = node.title;
    const result = { type: 'element', tagName: 'a', properties, children: state.all(node) };
    state.patch(node, result);
    return state.applyData(node, result);
}

function image(state, node) {
    const properties = { src: node.url, alt: node.alt };
    if (node.title !== null && node.title !== undefined) properties.title = node.title;
    const result = { type: 'element', tagName: 'img', properties, children: [] };
    state.patch(node, result);
    return state.applyData(node, result);
}

export function toHastVerbatim(tree) {
    return toHast(tree, { allowDangerousHtml: true, handlers: { link, image } });
}

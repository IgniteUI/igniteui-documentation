/**
 * The doc set's toc.json, generated from the topic map: the old navigation tree (folders with
 * their landing pages, siblings in the old tool's order, the old labels), limited to the topics
 * that were converted. The `.link` alias becomes a second entry for its target; the `.stub`, which
 * injected the MVC API tree into the old navigation, has no equivalent and is left out.
 */
export function buildToc(map, included) {
    const convert = (node) => {
        if (node.kind === 'stub') return null;
        if (node.kind === 'alias') {
            return node.slug && included.has(node.slug) ? { name: node.label, href: `${node.slug}.mdx` } : null;
        }
        if (node.kind === 'topic') {
            return included.has(node.slug) ? { name: node.label, href: `${node.slug}.mdx` } : null;
        }
        // folder
        const items = node.children.map(convert).filter(Boolean);
        const own = node.slug && included.has(node.slug);
        if (!items.length && !own) return null;
        const entry = { name: node.label };
        if (own) entry.href = `${node.slug}.mdx`;
        if (items.length) entry.items = items;
        return entry;
    };
    return map.nav.children.map(convert).filter(Boolean);
}

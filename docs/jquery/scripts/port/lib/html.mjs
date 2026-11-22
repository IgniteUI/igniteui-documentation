/**
 * The HTML in a topic, through a real HTML parser: the Markdown tree goes to HTML (hast) with its
 * raw HTML kept, `hast-util-raw` parses that HTML with parse5 (the browser algorithm: implied and
 * mismatched end tags repaired, void elements closed), and `hast-util-to-mdast` brings the result
 * back to Markdown. What Markdown can say becomes Markdown; every other element becomes an MDX
 * JSX element with its attributes, so the serializer writes valid MDX (self-closed void tags,
 * escaped text) instead of hand-written replacements.
 */
import { toHastVerbatim } from './to-hast.mjs';
import { raw } from 'hast-util-raw';
import { toMdast, defaultHandlers } from 'hast-util-to-mdast';
import { toText } from 'hast-util-to-text';
import { find, html as htmlSchema, svg as svgSchema } from 'property-information';

/** Inline-level elements kept as JSX. */
const JSX_TEXT = new Set([
    'kbd', 'sup', 'sub', 'mark', 'u', 'small', 'abbr', 'cite', 'dfn', 'big', 'font', 'nobr', 'label',
    'button', 'span', 'time', 'q', 'ins', 'bdi', 'bdo', 'wbr', 'input', 'select', 'textarea', 'canvas',
    'meter', 'progress', 'output', 'img', 'iframe', 'video', 'audio', 'object', 'embed', 'svg', 'a',
]);
/** Block-level elements kept as JSX. */
const JSX_FLOW = new Set([
    'div', 'figure', 'figcaption', 'center', 'section', 'details', 'summary', 'dl', 'dt', 'dd', 'form',
    'fieldset', 'legend', 'article', 'aside', 'header', 'footer', 'nav', 'main', 'address', 'table',
    'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col', 'picture', 'source', 'option',
    'optgroup', 'map', 'area',
]);
/** Elements with no place in a topic body: dropped and reported. */
const DROP = new Set(['script', 'style', 'link', 'meta', 'title', 'base', 'head', 'noscript', 'template']);
/** Wrappers that carry nothing without attributes. */
const UNWRAP_WHEN_BARE = new Set(['span', 'div', 'font', 'center', 'section', 'article', 'main', 'nobr']);

/** hast properties → JSX attributes, under their HTML names. */
function attributesOf(node) {
    const space = node.properties && node.tagName === 'svg' ? svgSchema : htmlSchema;
    const attributes = [];
    for (const [key, value] of Object.entries(node.properties ?? {})) {
        if (value === null || value === undefined || value === false) continue;
        const info = find(space, key);
        const name = info.attribute;
        let v;
        if (value === true) v = null;
        else if (Array.isArray(value)) v = value.join(info.commaSeparated ? ', ' : ' ');
        else v = String(value);
        attributes.push({ type: 'mdxJsxAttribute', name, value: v });
    }
    return attributes;
}

function hasAttributes(node) {
    return Object.values(node.properties ?? {}).some(v => v !== null && v !== undefined && v !== false);
}

export function createConverter(report) {
    const count = (bucket, key) => { report[bucket][key] = (report[bucket][key] ?? 0) + 1; };

    function jsx(state, node, flow) {
        const element = {
            type: flow ? 'mdxJsxFlowElement' : 'mdxJsxTextElement',
            name: node.tagName,
            attributes: attributesOf(node),
            children: [],
        };
        const kids = state.all(node);
        element.children = flow ? state.toFlow(kids) : kids;
        state.patch(node, element);
        count('jsxElements', node.tagName);
        return element;
    }

    function cellIsSimple(cell) {
        if (cell.properties?.rowSpan > 1 || cell.properties?.colSpan > 1) return false;
        let simple = true;
        const check = (n, depth) => {
            for (const child of n.children ?? []) {
                if (child.type !== 'element') continue;
                const name = child.tagName;
                if (name === 'p' && depth === 0 && cell.children.filter(c => c.type === 'element' && c.tagName === 'p').length === 1) { check(child, depth + 1); continue; }
                if (['ul', 'ol', 'pre', 'table', 'p', 'div', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dl', 'hr', 'figure'].includes(name)) { simple = false; return; }
                check(child, depth + 1);
            }
        };
        check(cell, 0);
        return simple;
    }

    /** A table Markdown can hold: a header row, cells with inline content only, no spans or captions. */
    function tableIsSimple(node) {
        const rows = [];
        const sections = [];
        const walk = (n) => {
            for (const child of n.children ?? []) {
                if (child.type !== 'element') continue;
                if (child.tagName === 'tr') rows.push(child);
                else if (['thead', 'tbody', 'tfoot'].includes(child.tagName)) { sections.push(child.tagName); walk(child); }
                else if (['caption', 'colgroup', 'col'].includes(child.tagName)) sections.push(child.tagName);
            }
        };
        walk(node);
        if (!rows.length || sections.includes('caption')) return false;
        const firstCells = rows[0].children.filter(c => c.type === 'element');
        const headed = sections.includes('thead') || firstCells.every(c => c.tagName === 'th');
        if (!headed) return false;
        for (const row of rows) {
            for (const cell of row.children) {
                if (cell.type === 'element' && !cellIsSimple(cell)) return false;
            }
        }
        return true;
    }

    const handlers = {
        a(state, node) {
            if (node.properties?.href === undefined || node.properties?.href === null) {
                // A named anchor; the heading step keeps it where a link depends on it.
                return jsx(state, node, false);
            }
            const dropped = Object.keys(node.properties).filter(k => !['href', 'title'].includes(k));
            for (const k of dropped) count('droppedLinkAttributes', k);
            return defaultHandlers.a(state, node);
        },
        img(state, node) {
            const extra = Object.keys(node.properties ?? {}).filter(k => !['src', 'alt', 'title'].includes(k));
            if (extra.length) return jsx(state, node, false);
            return defaultHandlers.img(state, node);
        },
        table(state, node) {
            if (state.inTable || !tableIsSimple(node)) {
                count('tables', 'jsx');
                const was = [state.inTable, state.jsxTable];
                state.inTable = true;
                state.jsxTable = true;
                const result = jsx(state, node, true);
                [state.inTable, state.jsxTable] = was;
                return result;
            }
            count('tables', 'markdown');
            const was = state.jsxTable;
            state.jsxTable = false;
            const result = defaultHandlers.table(state, node);
            state.jsxTable = was;
            return result;
        },
        br(state, node, parent) {
            // A line break inside a Markdown table cell cannot be a Markdown break.
            if (state.inTable) return jsx(state, node, false);
            return defaultHandlers.br(state, node, parent);
        },
        input(state, node, parent) {
            if (node.properties?.type === 'checkbox' && parent?.tagName === 'li') return defaultHandlers.input(state, node, parent);
            return jsx(state, node, false);
        },
        li(state, node, parent) {
            // A list item is loose only when it had paragraphs; a nested list alone keeps it tight.
            const result = defaultHandlers.li(state, node, parent);
            result.spread = (node.children ?? []).some(c => c.type === 'element' && c.tagName === 'p');
            return result;
        },
        ul: list,
        ol: list,
        comment(state, node) {
            report.comments.push(node.value.trim().slice(0, 120));
        },
    };
    for (const name of JSX_TEXT) {
        if (handlers[name]) continue;
        handlers[name] = (state, node) => {
            if (UNWRAP_WHEN_BARE.has(node.tagName) && !hasAttributes(node)) return state.all(node);
            return jsx(state, node, false);
        };
    }
    for (const name of JSX_FLOW) {
        if (handlers[name]) continue;
        handlers[name] = (state, node) => {
            if (UNWRAP_WHEN_BARE.has(node.tagName) && !hasAttributes(node)) return state.toFlow(state.all(node));
            if (['tr', 'th', 'td', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup', 'col'].includes(node.tagName) && !state.jsxTable) {
                // Inside a Markdown table the default handlers build the rows and cells.
                const fallback = defaultHandlers[node.tagName];
                return fallback ? fallback(state, node) : state.all(node);
            }
            return jsx(state, node, ['div', 'figure', 'center', 'section', 'details', 'dl', 'form', 'fieldset', 'article', 'aside', 'header', 'footer', 'nav', 'main', 'address', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup', 'picture', 'map'].includes(node.tagName) || isFlowContext(node));
        };
    }
    for (const name of DROP) {
        handlers[name] = (state, node) => {
            report.dropped.push({ tag: name, text: toText(node).trim().slice(0, 80) });
        };
    }
    const { comment, ...elementHandlers } = handlers;

    /** Markdown (with raw HTML) → hast → parsed HTML → Markdown + JSX. */
    function convert(mdast) {
        const hast = toHastVerbatim(mdast);
        const parsed = raw(hast);
        return toMdast(parsed, {
            handlers: elementHandlers,
            nodeHandlers: { comment },
        });
    }

    return { convert };
}

function list(state, node, parent) {
    const result = defaultHandlers[node.tagName](state, node, parent);
    if (result?.type === 'list') result.spread = result.children.some(item => item.spread);
    return result;
}

/** Table cells, captions and list-like children hold flow content when they hold blocks. */
function isFlowContext(node) {
    return (node.children ?? []).some(c => c.type === 'element' && ['p', 'ul', 'ol', 'pre', 'div', 'table', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dl', 'figure'].includes(c.tagName));
}

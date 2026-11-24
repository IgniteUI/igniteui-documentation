/**
 * Parsing: CommonMark + GFM through remark, plus the three places where the old help's renderer
 * (marked 0.3.2) read the same text differently and the authors relied on it. Each is decided on
 * the parse result, not by rewriting the text with patterns:
 *
 * 1. HTML blocks spanning blank lines. marked kept an HTML block open until its closing tag;
 *    CommonMark ends it at the first blank line, and the indented rows after it become code. When
 *    an HTML block (at the top, or in a list item) leaves an element open, the blank lines are
 *    removed up to the end tag that closes it, provided that the element is part of a table or all
 *    CommonMark reads in between is HTML, paragraphs or indented code (cell text, indented or not);
 *    otherwise, at the top, only while the next block starts with a tag. Tags inside code spans do
 *    not count. The text is then parsed again.
 * 2. Headings without a space after `#`. marked made `#Title` a heading and let it interrupt a
 *    paragraph; CommonMark reads it as paragraph text. Paragraph lines that start that way become
 *    headings.
 * 3. Markdown inside HTML blocks. marked ran its inline rules over the text of an HTML block
 *    (links, emphasis, code spans inside `<td>` or `<div>`); CommonMark leaves it raw. The text
 *    between tags is parsed as inline Markdown and the result written back as HTML, so the HTML
 *    parser sees what the old site showed.
 *
 * Tags whose name is not an HTML element (`<T>`, `<columnKey>`, `<appSettings>` in prose) were
 * swallowed by browsers; they are turned into text here so the serializer escapes them.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { Parser } from 'htmlparser2';
import { htmlTagNames } from 'html-tag-names';
import { htmlVoidElements } from 'html-void-elements';
import { toHastVerbatim } from './to-hast.mjs';
import { toHtml } from 'hast-util-to-html';
import { visitParents } from 'unist-util-visit-parents';

const processor = unified().use(remarkParse).use(remarkGfm);
export const parseMarkdown = (text) => processor.parse(text);

const KNOWN_TAGS = new Set([...htmlTagNames, 'svg', 'math']);
const VOID = new Set(htmlVoidElements);
/** Elements whose content marked did not run inline rules over, and HTML does not parse. */
const RAW_TEXT = new Set(['pre', 'code', 'script', 'style', 'textarea', 'xmp', 'kbd']);

export function isKnownTag(name) {
    return KNOWN_TAGS.has(String(name).toLowerCase());
}

/** Normalizes the raw file: byte-order mark, line endings. */
export function normalizeSource(text) {
    return text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
}

/** Elements opened in an HTML fragment and not closed in it. */
export function unclosedElements(html) {
    const stack = [];
    const parser = new Parser({
        onopentag(name) {
            if (!VOID.has(name) && isKnownTag(name)) stack.push(name);
        },
        onclosetag(name, isImplied) {
            if (isImplied || VOID.has(name)) return;
            const at = stack.lastIndexOf(name);
            if (at !== -1) stack.splice(at);
        },
    }, { lowerCaseTags: true, recognizeSelfClosing: true });
    parser.write(html);
    parser.end();
    return stack;
}

const lineStart = (text, offset) => text.lastIndexOf('\n', offset - 1) + 1;

/**
 * The text with the content of its code spans blanked, at the same offsets: a tag written as code
 * (`<textarea>` in a cell) is not markup, and an HTML parser that took it for one would read the
 * rest of the text as the textarea's content.
 */
function maskCodeSpans(text) {
    const spans = [];
    visitParents(inlineOnly.parse(text), 'inlineCode', node => { spans.push(node.position); });
    if (!spans.length) return text;
    let out = '';
    let at = 0;
    for (const { start, end } of spans) {
        out += text.slice(at, start.offset) + text.slice(start.offset, end.offset).replace(/[^\n]/g, ' ');
        at = end.offset;
    }
    return out + text.slice(at);
}

/**
 * Where the elements opened from `start` on are all closed again: the offset just after the end
 * tag that closes the outermost of them, reading on through the rest of the text; -1 if never.
 */
function closingOffset(text, start) {
    const stack = [];
    let at = -1;
    const parser = new Parser({
        onopentag(name) {
            if (!VOID.has(name) && isKnownTag(name)) stack.push(name);
        },
        onclosetag(name, isImplied) {
            if (isImplied || VOID.has(name) || at !== -1) return;
            const index = stack.lastIndexOf(name);
            if (index === -1) return;
            stack.splice(index);
            if (!stack.length) {
                at = start + parser.endIndex + 1;
                parser.pause();
            }
        },
    }, { lowerCaseTags: true, recognizeSelfClosing: true });
    parser.write(text.slice(start));
    if (at === -1) parser.end();
    return at;
}

/**
 * What marked read as the text of an HTML block that ran across it: more HTML, a paragraph (cell
 * text at the margin) or an indented code block (cell text indented). Outside a table, a heading,
 * list, fenced code block or quote in between means the author wrapped Markdown in an element, and
 * CommonMark's reading of that is kept. Inside a table it is cell text that CommonMark took for a
 * block (`-` in a cell under a line of text is a heading underline, `>` a quote), which marked
 * showed as text, and which would break the table into pieces.
 */
const TABLE_PARTS = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th']);
const readAsBlockText = (node, text, open) => open.some(name => TABLE_PARTS.has(name))
    || node.type === 'html' || node.type === 'paragraph'
    || (node.type === 'code' && !/^(?:`{3,}|~{3,})/.test(text.slice(node.position.start.offset, node.position.start.offset + 3)));

/** Rule 1. Returns the possibly rewritten text and what was joined. */
export function joinSplitHtmlBlocks(text) {
    const joined = [];
    for (let guard = 0; guard < 50; guard++) {
        const tree = parseMarkdown(text);
        const masked = maskCodeSpans(text);
        const edits = [];
        const covered = [];
        // Blocks at the top and in list items (a table in a step of a procedure); the end tag
        // must then be in the same item.
        const containers = [tree];
        visitParents(tree, 'listItem', item => { containers.push(item); });
        for (const parent of containers) for (const [index, node] of parent.children.entries()) {
            if (node.type !== 'html') continue;
            const start = node.position.start.offset;
            if (covered.some(([from, to]) => start >= from && start < to)) continue;
            const open = unclosedElements(masked.slice(start, node.position.end.offset));
            if (!open.length) continue;
            // To the end tag, as marked did, when only text-like blocks lie in between.
            const close = closingOffset(masked, start);
            const within = close !== -1 && (parent === tree || close <= parent.position.end.offset);
            const inside = within ? parent.children.slice(index + 1).filter(n => n.position.start.offset < close) : [];
            if (inside.length && inside.every(n => readAsBlockText(n, text, open))) {
                const from = node.position.end.offset;
                for (const gap of text.slice(from, close).matchAll(/\n(?:[ \t]*\n)+/g)) {
                    edits.push({ from: from + gap.index, to: from + gap.index + gap[0].length, line: node.position.end.line, open });
                }
                covered.push([start, close]);
                continue;
            }
            if (parent !== tree) continue;
            // Otherwise follow the block across each blank line while an element is still open
            // and the next line is markup; once joined, CommonMark continues it to the next blank.
            let cursor = node.position.end.offset;
            for (;;) {
                const gap = /^\n(?:[ \t]*\n)+/.exec(text.slice(cursor, cursor + 4000));
                if (!gap) break;
                const nextLine = cursor + gap[0].length;
                if (!/^[ \t]*</.test(text.slice(nextLine, nextLine + 200))) break;
                const stillOpen = unclosedElements(masked.slice(start, cursor));
                if (!stillOpen.length) break;
                edits.push({ from: cursor, to: nextLine, line: node.position.end.line, open: stillOpen });
                const rest = text.slice(nextLine).search(/\n[ \t]*\n/);
                cursor = rest === -1 ? text.length : nextLine + rest;
            }
        }
        if (!edits.length) return { text, joined };
        // Applied from the end so the offsets stay valid; then parsed again to confirm. Two blocks
        // can reach the same blank line (the second one lies in the run the first one follows,
        // `</tr> <tr>` at the margin); it is removed once, or the second removal eats the text.
        let applied = Infinity;
        for (const edit of edits.sort((a, b) => b.from - a.from)) {
            if (edit.to > applied) continue;
            applied = edit.from;
            text = `${text.slice(0, edit.from)}\n${text.slice(edit.to)}`;
            joined.push({ line: edit.line, open: edit.open.join('>') });
        }
    }
    throw new Error('joinSplitHtmlBlocks did not settle');
}

/** Splits a paragraph's phrasing children into lines at the newlines of its text nodes. */
function splitLines(children) {
    const lines = [[]];
    for (const child of children) {
        if (child.type === 'text' && child.value.includes('\n')) {
            const parts = child.value.split('\n');
            parts.forEach((part, index) => {
                if (index > 0) lines.push([]);
                if (part) lines.at(-1).push({ ...child, value: part });
            });
        } else {
            lines.at(-1).push(child);
        }
    }
    return lines;
}

const NO_SPACE_HEADING = /^(#{1,6})(?=[^#\s])/;
/**
 * The marker of a heading without a space, at the start of a paragraph line. In
 * `##<a id="x"></a>Title` the text node holds the marker alone and the anchor follows it.
 */
function noSpaceHeading(line) {
    const first = line[0];
    if (first?.type !== 'text') return null;
    const m = NO_SPACE_HEADING.exec(first.value);
    if (m) return m;
    const bare = /^(#{1,6})$/.exec(first.value);
    return bare && line[1]?.type === 'html' ? bare : null;
}

/** Rule 2. Mutates the tree; returns the headings it made. */
export function fixHeadingsWithoutSpace(tree) {
    const made = [];
    visitParents(tree, 'paragraph', (node, ancestors) => {
        const parent = ancestors.at(-1);
        const lines = splitLines(node.children);
        if (!lines.some(line => noSpaceHeading(line))) return;
        const replacement = [];
        let buffer = [];
        const flush = () => {
            if (!buffer.length) return;
            const children = [];
            buffer.forEach((line, index) => {
                if (index > 0) children.push({ type: 'text', value: '\n' });
                children.push(...line);
            });
            replacement.push({ type: 'paragraph', children: mergeText(children) });
            buffer = [];
        };
        for (const line of lines) {
            const first = line[0];
            const m = noSpaceHeading(line);
            if (!m) { buffer.push(line); continue; }
            flush();
            // The closing sequence is cut here only when the text is the whole line.
            const rest = line.length === 1 ? first.value.slice(m[1].length).replace(/\s+#*\s*$/, '') : first.value.slice(m[1].length);
            const children = [...(rest ? [{ ...first, value: rest }] : []), ...line.slice(1)];
            const afterAnchor = children.find(c => c.type === 'text');
            if (afterAnchor && afterAnchor !== children[0]) afterAnchor.value = afterAnchor.value.replace(/^\s+/, '');
            // A trailing closing sequence (`#Title#`) is not part of the text.
            const last = children.at(-1);
            if (last?.type === 'text') last.value = last.value.replace(/\s*#+\s*$/, '');
            replacement.push({ type: 'heading', depth: m[1].length, children, position: node.position });
            made.push({ line: node.position?.start.line, depth: m[1].length });
        }
        flush();
        const index = parent.children.indexOf(node);
        parent.children.splice(index, 1, ...replacement);
        return index + replacement.length;
    });
    return made;
}

function mergeText(children) {
    const out = [];
    for (const child of children) {
        const prev = out.at(-1);
        if (child.type === 'text' && prev?.type === 'text') prev.value += child.value;
        else out.push(child);
    }
    return out;
}

/** Tag name of an inline HTML node such as `<T>` or `</b>`; null for comments and others. */
export function tagNameOf(raw) {
    const m = /^<\/?([A-Za-z][A-Za-z0-9:-]*)/.exec(raw.trim());
    return m ? m[1] : null;
}

/**
 * Escapes tags with names that are not HTML elements inside an HTML fragment, so that the HTML
 * parser reads them as text (as the authors meant).
 */
export function escapeUnknownTags(html, found) {
    const edits = [];
    const parser = new Parser({
        onopentagname(name) {
            if (!isKnownTag(name)) edits.push(parser.startIndex);
        },
        onclosetag(name, isImplied) {
            if (!isImplied && !isKnownTag(name) && html[parser.startIndex] === '<') edits.push(parser.startIndex);
        },
    }, { lowerCaseTags: false, recognizeSelfClosing: true });
    parser.write(html);
    parser.end();
    if (!edits.length) return html;
    let out = html;
    for (const at of [...new Set(edits)].sort((a, b) => b - a)) {
        found?.push(tagNameOf(html.slice(at, at + 64)) ?? '?');
        out = `${out.slice(0, at)}&lt;${out.slice(at + 1)}`;
    }
    return out;
}

/**
 * `<a id="x"/>`: XML-style self-closing syntax on an element that is not void. To its author an
 * empty element; to an HTML parser an open one that swallows the rest of the page. Written as
 * `<a id="x"></a>` before parsing.
 */
export function closeSelfClosedElements(html, found) {
    const edits = [];
    const parser = new Parser({
        onopentag(name) {
            const raw = html.slice(parser.startIndex, parser.endIndex + 1);
            if (raw.endsWith('/>') && !VOID.has(name) && isKnownTag(name)) {
                edits.push({ start: parser.startIndex, end: parser.endIndex + 1, raw, name });
            }
        },
    }, { lowerCaseTags: true, recognizeSelfClosing: false });
    parser.write(html);
    parser.end();
    let out = html;
    for (const e of edits.reverse()) {
        found?.push(e.name);
        const open = e.raw.replace(/\s*\/>$/, '>');
        out = `${out.slice(0, e.start)}${open}</${/^<([^\s/>]+)/.exec(e.raw)[1]}>${out.slice(e.end)}`;
    }
    return out;
}

/**
 * The Markdown parser with every block construct switched off, so that a block of HTML reads as
 * paragraphs of inline content: code spans, links, emphasis and inline HTML tags, found left to
 * right as marked's inline pass found them (a code span hides the `<input>` written inside it).
 */
const inlineOnly = unified().use(remarkParse).use(remarkGfm).use(function disableBlocks() {
    const data = this.data();
    (data.micromarkExtensions ??= []).push({
        disable: {
            null: ['blockQuote', 'codeFenced', 'codeIndented', 'definition', 'headingAtx', 'htmlFlow',
                'list', 'setextUnderline', 'thematicBreak', 'table', 'gfmFootnoteDefinition'],
        },
    });
});

const RAW_HTML_CONTEXT = new Set(['pre', 'script', 'style', 'textarea', 'xmp']);

/** Rule 3: inline Markdown in the text of an HTML block, written back as HTML. */
export function inlineMarkdownInHtml(html, report) {
    const tree = inlineOnly.parse(html);
    const replacements = [];
    let rawDepth = 0;
    const walk = (children) => {
        for (const node of children) {
            if (node.type === 'paragraph') { walk(node.children); continue; }
            if (node.type === 'html') {
                const m = /^<(\/?)([A-Za-z][A-Za-z0-9]*)/.exec(node.value);
                if (m && RAW_HTML_CONTEXT.has(m[2].toLowerCase())) rawDepth += m[1] ? -1 : 1;
                if (rawDepth < 0) rawDepth = 0;
                continue;
            }
            if (node.type === 'text' || node.type === 'break' || rawDepth > 0) continue;
            replacements.push(node);
        }
    };
    walk(tree.children);
    if (!replacements.length) return html;
    let out = html;
    for (const node of replacements.reverse()) {
        const rendered = toHtml(toHastVerbatim(node), { allowDangerousHtml: true });
        out = `${out.slice(0, node.position.start.offset)}${rendered}${out.slice(node.position.end.offset)}`;
        report.inlineRendered++;
    }
    return out;
}

/**
 * Rule 4. `**Note:**Text`: marked closed the strong span; CommonMark does not, because a closing
 * `**` after punctuation must be followed by a space or punctuation. Text that still holds such a
 * span after parsing gets it as strong.
 */
export function markedStrong(tree) {
    let count = 0;
    const SPAN = /\*\*([^*\s](?:[^*]*?[^*\s])?)\*\*(?=[\p{L}\p{N}])/u;
    visitParents(tree, 'text', (node, ancestors) => {
        const parent = ancestors.at(-1);
        if (!SPAN.test(node.value)) return;
        const parts = [];
        let rest = node.value;
        let m;
        while ((m = SPAN.exec(rest))) {
            if (!/\p{P}$/u.test(m[1])) break;
            if (m.index) parts.push({ type: 'text', value: rest.slice(0, m.index) });
            parts.push({ type: 'strong', children: [{ type: 'text', value: m[1] }] });
            rest = rest.slice(m.index + m[0].length);
            count++;
        }
        if (!parts.length) return;
        if (rest) parts.push({ type: 'text', value: rest });
        const index = parent.children.indexOf(node);
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
    });
    return count;
}

/**
 * Parsing: CommonMark + GFM through remark, plus the places where the old help's renderer
 * (marked 0.3.2) read the same text differently and the authors relied on it. Each is decided on
 * the parse result; rules 1 and 6 then change the text (blank lines, indentation) and parse it
 * again, the others change the tree:
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
 * 4. `**Note:**Text`, closed as marked closed it.
 * 5. Pipe tables as marked read them: header and delimiter rows of different widths, rows split
 *    at every `|`, a table ended at the first line without one.
 * 6. List items as marked read them: lines it kept in an item, indented less than CommonMark needs.
 * 7. A line that is only an inline tag (`<a id="x" />`) does not take in the lines under it.
 * 8. Links and images with a space in the destination.
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

/** marked's columns: a tab is four spaces wherever it stands (it replaced them before lexing). */
const markedIndent = line => /^[ \t]*/.exec(line)[0].replace(/\t/g, '    ').length;
/** CommonMark's columns: tab stops every four. */
function commonMarkIndent(line) {
    let column = 0;
    for (const ch of /^[ \t]*/.exec(line)[0]) column = ch === '\t' ? column + 4 - (column % 4) : column + 1;
    return column;
}
/**
 * A list item's first line: its indent and the column of its text as marked counted them (every
 * tab four spaces; marked took that many spaces off the item's lines), and the column CommonMark
 * reads its content at (tab stops; one past the marker when five columns or more follow it).
 */
function itemStart(line) {
    const m = /^( *)([*+-]|\d+\.)( +)(?=\S|$)/.exec(line.replace(/\t/g, '    '));
    if (!m) return null;
    const cm = /^([ \t]*)([*+-]|\d+\.)([ \t]+)/.exec(line);
    const marker = commonMarkIndent(cm[1]) + cm[2].length;
    let after = marker;
    for (const ch of cm[3]) after = ch === '\t' ? after + 4 - (after % 4) : after + 1;
    return {
        indent: m[1].length, content: m[0].length, cmContent: after - marker > 4 || !line.trim().slice(cm[2].length).trim() ? marker + 1 : after,
        // CommonMark lets a list interrupt a paragraph only with a bullet or the number 1.
        interrupts: !/^\d+$/.test(m[2].slice(0, -1)) || m[2] === '1.',
    };
}
const MARKED_HR = /^ *(?:[-*_] *){3,}$/;
const MARKED_DEF = /^ *\[[^\]]+\]: *<?[^\s>]+>?(?: +["(][^\n]+[")])? *$/;

/**
 * Rule 6. List items as marked read them. marked ran a list on over blank lines for as long as
 * the next line started with a space, cut it into items at the bullets as deep as its first one,
 * took up to the item's text column of spaces off each line and lexed the rest; CommonMark ends
 * an item at the first line, after a blank or outside a paragraph, that is not indented to the
 * item's content column. So ` a. Step` under `1. ` ends the list in CommonMark, the tab-indented
 * code that follows becomes an indented code block holding Markdown, and `   - Sub` (three
 * spaces) under `-   Item` becomes a sibling item where marked nested it. The lines marked kept
 * in an item that CommonMark would not are indented to the item's content column (plus what
 * marked left of their own indentation), list by list, and the text is parsed again until
 * nothing changes. Not touched: lists in quotes, a list right under a quote (marked's quote took
 * it in), and `2. Step` right under text (CommonMark would not start a list there).
 */
export function indentListItemsAsMarked(text) {
    let raised = 0;
    for (let guard = 0; guard < 20; guard++) {
        const tree = parseMarkdown(text);
        const lines = text.split('\n');
        const edits = new Map();
        // Lists at the top, then lists in list items, each measured from its parent's content column.
        visitParents(tree, 'list', (list, ancestors) => {
            if (ancestors.some(a => a.type === 'blockquote')) return;
            // Right under a quote, with no blank line between, the list was part of the quote to
            // marked (its quotes ran on to the next blank line), and ended with it.
            const siblings = ancestors.at(-1).children;
            const before = siblings[siblings.indexOf(list) - 1];
            if (before?.type === 'blockquote' && before.position.end.line === list.position.start.line - 1) return;
            const parentItem = ancestors.findLast(a => a.type === 'listItem');
            const base = parentItem ? itemStart(lines[parentItem.position.start.line - 1])?.content : 0;
            if (base === undefined) return;
            const firstLine = list.position.start.line - 1;
            let item = itemStart(lines[firstLine]);
            if (!item) return;
            const listIndent = item.indent;
            let blank = false;
            for (let i = firstLine + 1; i < lines.length; i++) {
                const line = lines[i];
                if (!line.trim()) {
                    blank = true;
                    continue;
                }
                const k = markedIndent(line);
                const start = itemStart(line);
                const sibling = start && start.indent === listIndent;
                // marked's end of the list: after a blank line, text at the parent's margin that
                // is no item of this list; a rule; a link definition. A list in an item also ends
                // at a bullet left of the item's text (an item of a list further out).
                if ((blank && k <= base && !sibling) || MARKED_HR.test(line.replace(/\t/g, '    ')) || MARKED_DEF.test(line)
                    || (base && k < base && start)) break;
                const afterBlank = blank;
                blank = false;
                if (sibling) {
                    item = start;
                    continue;
                }
                if (commonMarkIndent(line) >= item.cmContent) continue;
                // marked made `2. Step` under a line of text a nested list; CommonMark would read it
                // as more of that text, so it is better left where it is.
                if (start && !start.interrupts && !afterBlank) continue;
                edits.set(i, item.cmContent + Math.max(0, k - item.content));
            }
        });
        if (!edits.size) return { text, raised };
        for (const [i, columns] of edits) lines[i] = ' '.repeat(columns) + lines[i].replace(/^[ \t]*/, '');
        raised += edits.size;
        text = lines.join('\n');
    }
    throw new Error('indentListItemsAsMarked did not settle');
}

/**
 * Rules 1 and 6 on the text, in the order that keeps each from misreading the other: HTML blocks
 * first (cell text such as `1. The data array` is no list), then list items, then HTML blocks
 * again (a table that now sits in a list item). Every reading of a topic goes through this.
 */
export function markedBlocks(text) {
    const first = joinSplitHtmlBlocks(text);
    const lists = indentListItemsAsMarked(first.text);
    const second = joinSplitHtmlBlocks(lists.text);
    return { text: second.text, joined: first.joined.length + second.joined.length, raised: lists.raised };
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
    markedSpacedLinks(tree, html);
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
            if (node.type === 'text' || node.type === 'break' || rawDepth > 0 || !node.position) continue;
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

// Rule 5: pipe tables. marked's two forms, tried in this order at the start of a top-level block.
const MARKED_NPTABLE = /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/;
const MARKED_TABLE = /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/;

/** Cells of one row as marked split it, each with its offset: the ends trimmed by `lead`/`trail`, split at `|`. */
function markedCells(line, base, lead, trail) {
    const skip = lead ? lead.exec(line)[0].length : 0;
    const rest = line.slice(skip);
    const cut = trail ? trail.exec(rest) : null;
    const body = cut ? rest.slice(0, cut.index) : rest;
    const cells = [];
    let from = 0;
    for (const m of body.matchAll(/ *\| */g)) {
        cells.push({ text: body.slice(from, m.index), at: base + skip + from });
        from = m.index + m[0].length;
    }
    cells.push({ text: body.slice(from), at: base + skip + from });
    return cells;
}

/** How marked 0.3.2 read a pipe table at `start` (a line start): header, align, rows, end; or null. */
function markedTable(text, start) {
    const src = text.slice(start);
    let kind = 'np';
    let m = MARKED_NPTABLE.exec(src);
    if (!m) {
        kind = 'pipes';
        m = MARKED_TABLE.exec(src);
    }
    if (!m) return null;
    const headerAt = start + m[0].indexOf(m[1]);
    const header = markedCells(m[1], headerAt, /^ */, / *\| *$/);
    const align = m[2].replace(/^ *|\| *$/g, '').split(/ *\| */).map(a => (/^ *-+: *$/.test(a) ? 'right'
        : /^ *:-+: *$/.test(a) ? 'center' : /^ *:-+ *$/.test(a) ? 'left' : null));
    const rows = [];
    let at = start + m[0].indexOf(m[3], m[0].indexOf(m[2]) + m[2].length);
    for (const line of m[3].replace(/\n$/, '').split('\n')) {
        if (line.trim()) rows.push(kind === 'np' ? markedCells(line, at, null, null) : markedCells(line, at, /^ *\| */, / *\| *$/));
        at += line.length + 1;
    }
    return { header, align, rows, end: start + m[0].length };
}

/** How many cells of a row carry text (a trailing `|` gives marked an empty last cell). */
const filledWidth = cells => cells.reduce((width, cell, i) => (cell.text.trim() ? i + 1 : width), 0);

const lineOfOffset = (text, offset) => {
    let line = 1;
    for (let i = text.indexOf('\n'); i !== -1 && i < offset; i = text.indexOf('\n', i + 1)) line++;
    return line;
};

/** Moves the positions of a tree parsed from text[base…] to the whole text. */
function shiftPositions(tree, text, base) {
    const line = lineOfOffset(text, base) - 1;
    const column = base - lineStart(text, base);
    visitParents(tree, node => {
        if (!node.position) return;
        for (const point of [node.position.start, node.position.end]) {
            if (point.line === 1) point.column += column;
            point.line += line;
            point.offset += base;
        }
    });
    return tree;
}

/** The mdast table of marked's reading; as wide as its widest row with text in it. */
function tableNode(table, text, position) {
    const width = Math.max(1, filledWidth(table.header), ...table.rows.map(filledWidth));
    const cell = c => {
        const value = c?.text.trim() ?? '';
        const lead = c ? c.text.length - c.text.trimStart().length : 0;
        const paragraph = value ? shiftPositions(inlineOnly.parse(value), text, c.at + lead).children[0] : null;
        return { type: 'tableCell', children: paragraph?.children ?? [] };
    };
    const row = cells => ({ type: 'tableRow', children: Array.from({ length: width }, (_, i) => cell(cells[i])) });
    return {
        type: 'table', position,
        align: Array.from({ length: width }, (_, i) => table.align[i] ?? null),
        children: [row(table.header), ...table.rows.map(row)],
    };
}

/**
 * Rule 5. Pipe tables as marked read them. GFM wants a header row exactly as wide as the
 * delimiter row (`Legend |` over `---|---` is text to it); marked took any widths, split every
 * row at each `|` and kept the cells a row has beyond the header. GFM also runs a table on over
 * lines without a `|`, which marked left to the next block. A top-level paragraph that marked read
 * as a table becomes that table; a table GFM read with a row or a cell's text less is rebuilt as
 * marked read it. What follows marked's table in the same block is parsed again. Tables in list
 * items stay as GFM reads them: marked made none there.
 */
export function markedTables(tree, text) {
    const done = { 'paragraphs marked read as a table': 0, 'tables GFM read otherwise, rebuilt as marked read them': 0 };
    const kids = tree.children;
    for (let i = 0; i < kids.length; i++) {
        const node = kids[i];
        if ((node.type !== 'paragraph' && node.type !== 'table') || !node.position) continue;
        const start = lineStart(text, node.position.start.offset);
        const table = markedTable(text, start);
        if (!table || table.end <= start) continue;
        if (node.type === 'table') {
            // Rebuilt only where GFM lost something: a row (it ran on over a line without `|`) or
            // the text of a cell (cut off past its width). Where marked only moved cells along
            // (`|a|b|` under a header without pipes gave it an empty first cell), GFM's is kept.
            const filled = cells => cells.filter(c => c.text.trim()).length;
            // Cells past the header's width stay in the tree but are dropped when it is rendered.
            const width = node.children[0].children.length;
            const gfmFilled = row => row.children.slice(0, width).filter(c => c.children.some(k => k.type !== 'text' || k.value.trim())).length;
            const rows = [table.header, ...table.rows];
            const same = rows.length === node.children.length && rows.every((cells, r) => filled(cells) <= gfmFilled(node.children[r]));
            if (same) continue;
        }
        const end = Math.min(table.end, node.position.end.offset);
        const position = { start: { ...node.position.start }, end: { line: lineOfOffset(text, end), column: end - lineStart(text, end) + 1, offset: end } };
        const replacement = [tableNode(table, text, position)];
        if (table.end < node.position.end.offset && text.slice(table.end, node.position.end.offset).trim()) {
            replacement.push(...shiftPositions(parseMarkdown(text.slice(table.end, node.position.end.offset)), text, table.end).children);
        }
        kids.splice(i, 1, ...replacement);
        done[node.type === 'paragraph' ? 'paragraphs marked read as a table' : 'tables GFM read otherwise, rebuilt as marked read them']++;
    }
    return done;
}

/**
 * Rule 8. Links and images whose destination has a space in it (`![](../04_Hover Interactions/a.png)`,
 * `[x](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings property.)`): marked read up to the
 * closing parenthesis; CommonMark allows no space there and leaves the text. Text that still holds
 * such a link after parsing gets it as a link or image, with the destination as written. Returns
 * how many; given the `source` the tree was parsed from, the new nodes get the offsets rule 3
 * splices by.
 */
export function markedSpacedLinks(tree, source = null) {
    const LINK = /(!?)\[([^[\]]*)\]\(\s*([^()\s][^()]*?\s[^()]*?)\s*\)/;
    let count = 0;
    visitParents(tree, 'text', (node, ancestors) => {
        const parent = ancestors.at(-1);
        if (!LINK.test(node.value) || parent.type === 'link') return;
        // The link's offsets: found in the source as written within the text's range (escapes
        // or entities elsewhere in the text make its value differ from the source).
        const range = source && node.position ? source.slice(node.position.start.offset, node.position.end.offset) : null;
        let searchFrom = 0;
        const parts = [];
        let rest = node.value;
        let m;
        while ((m = LINK.exec(rest))) {
            if (m.index) parts.push({ type: 'text', value: rest.slice(0, m.index) });
            const [whole, bang, label, destination] = m;
            // marked took a quoted title off the end, as CommonMark does.
            const [, url, title = null] = /^(.*?)(?:\s+["']([^"']*)["'])?$/.exec(destination);
            const found = range ? range.indexOf(whole, searchFrom) : -1;
            if (found !== -1) searchFrom = found + whole.length;
            const position = found !== -1
                ? { start: { offset: node.position.start.offset + found }, end: { offset: node.position.start.offset + found + whole.length } }
                : undefined;
            parts.push(bang
                ? { type: 'image', url, alt: label, title, position }
                : { type: 'link', url, title, children: label ? [{ type: 'text', value: label }] : [], position });
            rest = rest.slice(m.index + whole.length);
            count++;
        }
        if (rest) parts.push({ type: 'text', value: rest });
        const index = parent.children.indexOf(node);
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
    });
    return count;
}

/** The tags marked 0.3.2 never began an HTML block with (its `block._tag` exclusions). */
const MARKED_INLINE_TAG = /^ {0,3}<\/?(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\b[^>]*>(?:<\/[a-z]+>)?[ \t]*$/i;

/**
 * Rule 7. A line that is nothing but an inline tag (`<a id="x" />` above `### Title`) begins an
 * HTML block in CommonMark, which then takes in every line to the next blank one, the heading too.
 * marked began no HTML block with such tags: the line was a paragraph, and the heading under it
 * interrupted that. The lines after the tag are parsed as Markdown again.
 */
export function splitInlineTagBlocks(tree, text) {
    let split = 0;
    visitParents(tree, 'html', (node, ancestors) => {
        const parent = ancestors.at(-1);
        if (!node.position || node.position.end.line === node.position.start.line || PHRASING.has(parent.type)) return;
        const firstEnd = text.indexOf('\n', node.position.start.offset);
        if (!MARKED_INLINE_TAG.test(text.slice(lineStart(text, node.position.start.offset), firstEnd))) return;
        const rest = shiftPositions(parseMarkdown(text.slice(firstEnd + 1, node.position.end.offset)), text, firstEnd + 1).children;
        const head = { ...node, value: text.slice(node.position.start.offset, firstEnd), position: { start: node.position.start, end: { line: node.position.start.line, column: firstEnd - lineStart(text, firstEnd) + 1, offset: firstEnd } } };
        const index = parent.children.indexOf(node);
        parent.children.splice(index, 1, head, ...rest);
        split++;
        return index + 1 + rest.length;
    });
    return split;
}
const PHRASING = new Set(['paragraph', 'heading', 'emphasis', 'strong', 'delete', 'link', 'tableCell', 'linkReference']);

/** A paragraph that still reads like a pipe table: a line with `|` over a delimiter row. */
export const looksLikePipeTable = value => /(^|\n)[^\n]*\|[^\n]*\n *\|? *:?-+:? *(\| *:?-+:? *)+\|? *(\n|$)/.test(value);

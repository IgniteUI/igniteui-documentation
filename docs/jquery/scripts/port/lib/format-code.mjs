/**
 * Code blocks through Prettier, at 80 columns: what the site's code block holds in a 1440-pixel
 * window (it wraps longer lines, as the old site did at about 110). The topics' code was laid out
 * for the old width, and much of it by hand, with mixed indentation.
 *
 * Only layout changes. A block is formatted when Prettier has a parser for its language, the block
 * parses as that language, and the result has the same text once layout, quotes and optional
 * punctuation are set aside; any other block stays as written. So C#, Visual Basic, Razor and
 * ASPX stay, for which Prettier has no parser.
 *
 * Script that does not parse as written gets a second chance, because much of it is sound code
 * written the way documentation writes it:
 * - `...` where code is left out (`function () { ... }`, a line of its own, the end of a list). It
 *   is set aside while Prettier runs and put back.
 * - The members of an object without the object, and a call chain without what it is called on.
 *   They are formatted inside one and taken out again.
 * - Typographic quotes for string quotes, from a word processor. They become straight quotes. This
 *   is the one repair that changes the code, and it is kept only where the code parses with it
 *   and did not without.
 * Script that still does not parse is broken in a way no rule should guess at; it stays as
 * written and is listed, with what is still wider than the block, for the pass that works the
 * lists.
 */
import * as prettier from 'prettier';
import { visit } from 'unist-util-visit';

export const CODE_WIDTH = 80;

const PARSERS = { js: 'babel', typescript: 'typescript', css: 'css', scss: 'scss', less: 'less', json: 'json', html: 'html' };
const OPTIONS = {
    printWidth: CODE_WIDTH,
    tabWidth: 4,
    useTabs: false,
    // The product's style, and its audience's browsers: no commas the authors did not write.
    trailingComma: 'none',
    quoteProps: 'preserve',
    // Line breaks between elements of a snippet carry no meaning; hugging them to the tags
    // (`<b\n>x</b\n>`) to keep them out would.
    htmlWhitespaceSensitivity: 'ignore',
    endOfLine: 'lf',
};

/** Server-side code in markup: Prettier would reflow it as text. CSS at-rules are not that. */
const SERVER_CODE = /<%|(?:^|[\s>("'=])@(?!media\b|import\b|font-face\b|charset\b|keyframes\b|supports\b|page\b)[A-Za-z({*]/;

/** What a block says, apart from how it is laid out. */
const essence = text => text.toLowerCase().replace(/[\s'"`;,()/\\]/g, '');

const LINE_COMMENTS = new Set(['js', 'typescript', 'csharp']);

/**
 * A line that is only a `//` comment and wider than the block continues on further comment lines,
 * broken between words. Prettier leaves comments as written, and no formatter runs on C#.
 */
function wrapLineComments(text) {
    return text.split('\n').flatMap(line => {
        const m = /^(\s*)(\/\/+ ?)(.*)$/.exec(line);
        if (!m || widthOf(line) <= CODE_WIDTH) return [line];
        const [, indent, marker, body] = m;
        const room = Math.max(20, CODE_WIDTH - indent.length - marker.length);
        const parts = [];
        let current = '';
        for (const piece of piecesOf(body)) {
            const glue = current && piece.spaced ? ' ' : '';
            if (current && widthOf(current) + glue.length + widthOf(piece.text) > room) {
                parts.push(current);
                current = piece.text;
            } else {
                current = `${current}${glue}${piece.text}`;
            }
        }
        if (current) parts.push(current);
        return parts.map(part => `${indent}${marker}${part}`);
    }).join('\n');
}

/**
 * Columns a text takes in a code block. A Japanese character (kana, kanji, full-width forms and
 * punctuation) is as wide as two Latin ones in a monospaced face, and Prettier counts it so too.
 */
const WIDE = /[\u1100-\u115f\u2e80-\u303e\u3041-\u33ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/;
const WIDE_ALL = new RegExp(WIDE.source, 'g');
export const widthOf = text => text.length + (text.match(WIDE_ALL)?.length ?? 0);

/** Japanese punctuation that does not start a line, and brackets that do not end one. */
const NOT_FIRST = /[、。，．・：；！？）」』】〕〉》ー々ぁぃぅぇぉっゃゅょァィゥェォッャュョ)\]}.,:;!?]/;
const NOT_LAST = /[（「『【〔〈《(\[{]/;

/**
 * The pieces a comment can be broken between: its words, and inside Japanese text, which has no
 * spaces, any two characters that punctuation does not hold together. `spaced` says a space stood
 * before the piece.
 */
function piecesOf(body) {
    const pieces = [];
    for (const word of body.trim().split(/\s+/)) {
        if (!WIDE.test(word)) {
            pieces.push({ text: word, spaced: true });
            continue;
        }
        const chars = [...word];
        let current = '';
        let spaced = true;
        chars.forEach((ch, i) => {
            current += ch;
            const next = chars[i + 1];
            if (next === undefined || !(WIDE.test(ch) || WIDE.test(next)) || NOT_FIRST.test(next) || NOT_LAST.test(ch)) return;
            pieces.push({ text: current, spaced });
            current = '';
            spaced = false;
        });
        if (current) pieces.push({ text: current, spaced });
    }
    return pieces;
}

// ── script that does not parse as written ───────────────────────────────────

const ELLIPSIS = String.raw`(?:\.\.\.|…)`;
/** `{ ... }`: a body or an object whose content is left out. */
const ELIDED_BODY = new RegExp(String.raw`\{[ \t]*${ELLIPSIS}[ \t]*\}`, 'g');
/** A line that is only `...`: statements or members left out. */
const ELIDED_LINE = new RegExp(String.raw`^([ \t]*)(${ELLIPSIS})[ \t]*(,?)[ \t]*$`, 'gm');
/** `...` in a line, where an argument or an element is left out. Before a name it is spread syntax. */
const ELIDED = new RegExp(String.raw`${ELLIPSIS}(?=[ \t]*(?:[,)\]};]|$))`, 'gm');

/**
 * Sets the placeholders aside: an elided body becomes an empty one, which Prettier keeps on its
 * line; a line of its own becomes a comment, which Prettier keeps on a line of its own between
 * members and statements alike; any other becomes a name. `restore` puts them back, or returns
 * null when it cannot (it cannot tell which empty braces were placeholders, or a marker is gone).
 */
function setPlaceholdersAside(text) {
    if (text.includes('__elided')) return null;
    const bodies = [];
    const tokens = [];
    let out = text.replace(ELIDED_BODY, m => { bodies.push(m.includes('…') ? '{ … }' : '{ ... }'); return '{}'; });
    out = out.replace(ELIDED_LINE, (m, indent, token, comma, offset, whole) => {
        // Prettier drops the comma that led on to what is left out; remember to put it back.
        tokens.push({ token: `${token}${comma}`, line: true, commaBefore: /,\s*$/.test(whole.slice(0, offset)) });
        return `${indent}/*__elided${tokens.length - 1}__*/`;
    });
    out = out.replace(ELIDED, token => { tokens.push({ token }); return `__elided${tokens.length - 1}__`; });
    if (!bodies.length && !tokens.length) return null;
    return {
        text: out,
        restore(formatted) {
            if ((formatted.match(/\{\}/g) ?? []).length !== bodies.length) return null;
            let next = 0;
            const lines = formatted.replace(/\{\}/g, () => bodies[next++]).split('\n');
            for (const [index, { token, line, commaBefore }] of tokens.entries()) {
                // As a statement the name got a semicolon.
                const marker = line ? `/*__elided${index}__*/` : new RegExp(`__elided${index}__;?`);
                const at = lines.findIndex(l => (line ? l.includes(marker) : marker.test(l)));
                if (at === -1) return null;
                lines[at] = lines[at].replace(marker, token);
                if (line && commaBefore && at > 0 && /[^,{[(\s]\s*$/.test(lines[at - 1]) && lines[at].trim() === token) lines[at - 1] += ',';
            }
            return lines.join('\n');
        },
    };
}

const straightQuotes = text => text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
const dedent = lines => lines.map(line => line.replace(/^ {4}/, '')).join('\n');

/** A fragment formatted inside what it is a part of, and taken out again. */
const WRAPPERS = {
    // `key: value,` lines: the members of an object.
    object: {
        applies: () => true,
        wrap: text => `({\n${text}\n})`,
        unwrap(formatted, source) {
            const lines = /^\(\{\n([\s\S]*)\n\}\);?$/.exec(formatted);
            const one = lines ? null : /^\(\{ ?([\s\S]*?) ?\}\);?$/.exec(formatted);
            if (!lines && !one) return null;
            const inner = lines ? dedent(lines[1].split('\n')) : one[1];
            // Prettier drops the comma that led on to the members not shown.
            return /,\s*$/.test(source) ? `${inner},` : inner;
        },
    },
    // `.on(…)`: a call chain without what it is called on.
    chain: {
        applies: text => text.trimStart().startsWith('.'),
        wrap: text => `__chain__${text.trimStart()}`,
        unwrap(formatted, source) {
            let inner;
            if (formatted.startsWith('__chain__\n')) inner = dedent(formatted.split('\n').slice(1));
            else if (formatted.startsWith('__chain__.')) inner = formatted.slice('__chain__'.length);
            else return null;
            return /;\s*$/.test(source) ? inner : inner.replace(/;$/, '');
        },
    },
};

/** The repairs to try on script that does not parse, the fewest first. */
const ATTEMPTS = [
    ['placeholders'], ['quotes'], ['object'], ['chain'],
    ['placeholders', 'object'], ['placeholders', 'chain'], ['quotes', 'placeholders'], ['quotes', 'object'], ['quotes', 'chain'],
    ['quotes', 'placeholders', 'object'], ['quotes', 'placeholders', 'chain'],
];
const REPAIR_NAMES = {
    placeholders: 'with "..." placeholders set aside',
    quotes: 'with typographic quotes made straight',
    object: 'as the members of an object',
    chain: 'as a call chain',
};

/** The block laid out with these repairs, or null when it does not parse with them or would say something else. */
async function formatRepaired(source, parser, repairs) {
    let text = source;
    if (repairs.includes('quotes')) {
        text = straightQuotes(text);
        if (text === source) return null;
    }
    // What the result must say: the source, with straight quotes when that is the repair.
    const said = text;
    let aside = null;
    if (repairs.includes('placeholders')) {
        aside = setPlaceholdersAside(text);
        if (!aside) return null;
        text = aside.text;
    }
    const wrapper = WRAPPERS[repairs.find(r => WRAPPERS[r])];
    if (wrapper) {
        if (!wrapper.applies(said)) return null;
        text = wrapper.wrap(text);
    }
    let formatted;
    try {
        formatted = (await prettier.format(text, { ...OPTIONS, parser })).replace(/\n+$/, '');
    } catch {
        return null;
    }
    if (wrapper) formatted = wrapper.unwrap(formatted, said);
    if (formatted !== null && aside) formatted = aside.restore(formatted);
    return formatted !== null && essence(formatted) === essence(said) ? formatted : null;
}

function skipReason(node) {
    if (!node.value.trim()) return 'empty';
    if (!PARSERS[node.lang]) return node.lang ? `no formatter for ${node.lang}` : 'no language';
    // Markup under a JavaScript tag would parse, as JSX.
    if ((node.lang === 'js' || node.lang === 'typescript') && node.value.trimStart().startsWith('<')) return 'markup tagged as script';
    if (node.lang === 'html' && SERVER_CODE.test(node.value)) return 'server-side code in the markup';
    return null;
}

export async function formatCode(tree, ctx) {
    const { handled, undecided } = ctx.report.code;
    const count = what => { handled[what] = (handled[what] ?? 0) + 1; };
    const blocks = [];
    visit(tree, 'code', node => { blocks.push(node); });
    for (const node of blocks) {
        let why = skipReason(node);
        if (why === 'empty') continue;
        if (!why) {
            try {
                const formatted = (await prettier.format(node.value, { ...OPTIONS, parser: PARSERS[node.lang] })).replace(/\n+$/, '');
                if (essence(formatted) !== essence(node.value)) why = 'formatting would change more than the layout';
                else if (formatted === node.value) count('code blocks already as Prettier lays them out');
                else {
                    node.value = formatted;
                    count('code blocks laid out by Prettier');
                }
            } catch (error) {
                let repaired = null;
                if (node.lang === 'js' || node.lang === 'typescript') {
                    for (const repairs of ATTEMPTS) {
                        const formatted = await formatRepaired(node.value, PARSERS[node.lang], repairs);
                        if (formatted === null) continue;
                        repaired = repairs;
                        node.value = formatted;
                        break;
                    }
                }
                if (repaired) {
                    for (const repair of repaired) count(`code blocks laid out by Prettier ${REPAIR_NAMES[repair]}`);
                } else {
                    why = `does not parse as ${node.lang}`;
                    const message = String(error.message).split('\n')[0].replace(/\s*\(\d+:\d+\)\s*$/, '');
                    undecided.push({
                        topic: ctx.row.source, line: node.data?.sourceLine ?? null,
                        reason: `code that does not parse as ${node.lang} (left as written)`,
                        detail: `${message}: ${node.value.trim().split('\n')[0].slice(0, 60)}`,
                    });
                }
            }
        }
        if (why) count(`code blocks left as written: ${why}`);
        if (LINE_COMMENTS.has(node.lang)) {
            const wrapped = wrapLineComments(node.value);
            if (wrapped !== node.value) {
                node.value = wrapped;
                count('code blocks with whole-line comments wrapped');
            }
        }
        const wide = node.value.split('\n').filter(line => widthOf(line) > CODE_WIDTH);
        if (wide.length) {
            undecided.push({
                topic: ctx.row.source, line: node.data?.sourceLine ?? null,
                reason: `lines wider than ${CODE_WIDTH} columns (${why ?? 'Prettier cannot break them'})`,
                detail: `${wide.length} of ${node.value.split('\n').length} lines, the longest ${Math.max(...wide.map(widthOf))}: ${wide[0].trim().slice(0, 50)}`,
            });
        }
    }
}

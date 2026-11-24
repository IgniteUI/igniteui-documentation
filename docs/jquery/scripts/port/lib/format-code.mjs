/**
 * Code blocks through Prettier, at 80 columns: what the site's code block holds in a 1440-pixel
 * window (it wraps longer lines, as the old site did at about 110). The topics' code was laid out
 * for the old width, and much of it by hand, with mixed indentation.
 *
 * Only layout changes. A block is formatted when Prettier has a parser for its language, the block
 * parses as that language, and the result has the same text once layout, quotes and optional
 * punctuation are set aside; any other block stays as written. So fragments that are not whole
 * statements stay, and so do C#, Visual Basic, Razor and ASPX, for which Prettier has no parser.
 * What is still wider than the block is listed, for the pass that works the lists.
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
        if (!m || line.length <= CODE_WIDTH) return [line];
        const [, indent, marker, body] = m;
        const room = Math.max(20, CODE_WIDTH - indent.length - marker.length);
        const parts = [];
        let current = '';
        for (const word of body.trim().split(/\s+/)) {
            if (current && current.length + 1 + word.length > room) {
                parts.push(current);
                current = word;
            } else {
                current = current ? `${current} ${word}` : word;
            }
        }
        if (current) parts.push(current);
        return parts.map(part => `${indent}${marker}${part}`);
    }).join('\n');
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
                why = `does not parse as ${node.lang}`;
                const message = String(error.message).split('\n')[0].replace(/\s*\(\d+:\d+\)\s*$/, '');
                if (/Unexpected character|Unterminated/.test(message)) {
                    undecided.push({ topic: ctx.row.source, line: node.position?.start.line ?? null, reason: `code is not valid ${node.lang}`, detail: message });
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
        const wide = node.value.split('\n').filter(line => line.length > CODE_WIDTH);
        if (wide.length) {
            undecided.push({
                topic: ctx.row.source, line: node.position?.start.line ?? null,
                reason: `lines wider than ${CODE_WIDTH} columns (${why ?? 'Prettier cannot break them'})`,
                detail: `${wide.length} of ${node.value.split('\n').length} lines, the longest ${Math.max(...wide.map(l => l.length))}: ${wide[0].trim().slice(0, 50)}`,
            });
        }
    }
}

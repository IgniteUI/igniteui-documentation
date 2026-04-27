#!/usr/bin/env node
/**
 * fix-pseudo-html.mjs — MDX compatibility fixer for legacy DocFX content.
 *
 * Fixes two classes of MDX parse errors:
 *   1. Bare pseudo-HTML tokens (<language>, <value>, etc.) → &lt;language&gt;
 *   2. Bare curly braces in prose ({...}) → &#123;...&#125;
 *
 * Usage:
 *   node scripts/fix-pseudo-html.mjs <topicsDir>
 */
import fs from 'node:fs';
import path from 'node:path';

const targetDir = process.argv[2];
if (!targetDir) {
    console.error('Usage: node scripts/fix-pseudo-html.mjs <topicsDir>');
    process.exit(1);
}

const KNOWN_HTML_TAGS = new Set([
    'a','abbr','address','area','article','aside','audio','b','base','bdi','bdo',
    'blockquote','br','button','canvas','caption','cite','code','col',
    'colgroup','data','datalist','dd','del','details','dfn','dialog','div','dl',
    'dt','em','embed','fieldset','figcaption','figure','footer','form','h1','h2',
    'h3','h4','h5','h6','header','hgroup','hr','i','iframe','img',
    'input','ins','kbd','label','legend','li','link','main','map','mark','menu',
    'meta','meter','nav','noscript','object','ol','optgroup','option','output',
    'p','picture','pre','progress','q','rp','rt','ruby','s','samp','script',
    'search','section','select','slot','small','source','span','strong','style',
    'sub','summary','sup','table','tbody','td','template','textarea','tfoot',
    'th','thead','time','title','tr','track','u','ul','var','video','wbr',
    // Intentionally omitted: 'body','head','html' — these document-structure tags
    // are used only as placeholder text in content pages and must be escaped.
]);

function fixProseChunk(prose) {
    // Undo backslash-escape attempts from prior runs.
    let p = prose.replace(/\\<(\/?[a-zA-Z][a-zA-Z0-9._-]*)/g, '<$1');

    // 1. Escape bare pseudo-HTML tags not in the HTML allowlist.
    //    Tag regex extended to handle uppercase, dots, underscores (e.g.
    //    <StockMarketDataPoint>, <system.web>, <installation_folder>).
    p = p.replace(/<\/?([a-zA-Z][a-zA-Z0-9._-]*)(\s|\/?>|>)/g, (match, tag, rest) => {
        if (KNOWN_HTML_TAGS.has(tag.toLowerCase())) return match;
        const isClose = match.startsWith('</');
        return isClose
            ? `&lt;/${tag}${rest.replace(/>/, '&gt;')}`
            : `&lt;${tag}${rest.replace(/>/, '&gt;')}`;
    });

    // 1b. Escape ASP.NET <%...%> template tags (MDX errors on the % character).
    p = p.replace(/<%/g, '&lt;%');

    // 1c. Escape <*identifier> (star/asterisk at start of tag name, possibly with spaces).
    p = p.replace(/<(\*[^>]+)>/g, (_, inner) => `&lt;${inner}&gt;`);

    // 2. Fix void HTML elements: MDX (JSX) requires self-closing slash.
    //    e.g. <br> → <br/>, <img src="x"> → <img src="x"/>
    p = p.replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)(?<!\/)>/g,
        (match, tag, attrs) => `<${tag}${attrs}/>`
    );

    // 2. Escape bare `{` as &#123; — skip already-encoded entities and
    //    {environment:...} which remark-docfx handles at render time.
    p = p.replace(/\{(?!environment:)/g, (m, offset, str) => {
        // Don't re-encode something that is already an HTML entity like &#123;
        const before = str.slice(Math.max(0, offset - 1), offset);
        if (before === '&') return m;
        return '&#123;';
    });

    // 3. Escape bare `}` as &#125; — skip `}` that closes an HTML entity.
    p = p.replace(/\}/g, (m, offset, str) => {
        const before = str.slice(Math.max(0, offset - 6), offset);
        if (/&#\d{2,3}$/.test(before)) return m;
        return '&#125;';
    });

    return p;
}

/**
 * Escape asterisks that are not part of balanced *emphasis* or **strong** markdown.
 * A lone * (not matching another *) causes MDX parse errors inside HTML elements.
 */
function escapeUnpairedAsterisks(text) {
    // Normalize: collapse 2+ backslashes immediately before * to a single backslash.
    // In markdown, an even number of backslashes before * cancel out, leaving * unescaped.
    // Normalizing to \* ensures the asterisk is always properly escaped.
    text = text.replace(/\\{2,}(?=\*)/g, '\\');

    // Scan left-to-right, track balanced * pairs.
    const result = [];
    let i = 0;
    while (i < text.length) {
        // Skip already-escaped \* to avoid cascading re-escaping on repeated runs.
        if (text[i] === '\\' && i + 1 < text.length && text[i + 1] === '*') {
            result.push('\\*'); i += 2; continue;
        }
        if (text[i] !== '*') { result.push(text[i++]); continue; }
        // Count consecutive asterisks at this position
        let count = 0;
        const start = i;
        while (i < text.length && text[i] === '*') { count++; i++; }
        const stars = text.slice(start, i);
        // Find matching closing sequence, skipping escaped \* positions.
        let closeIdx = -1;
        let searchPos = i;
        while (searchPos < text.length) {
            const idx = text.indexOf(stars, searchPos);
            if (idx === -1) break;
            if (idx > 0 && text[idx - 1] === '\\') { searchPos = idx + stars.length; continue; }
            closeIdx = idx;
            break;
        }
        if (closeIdx !== -1) {
            // There's a matching pair — keep as-is (it's real markdown emphasis/strong)
            result.push(stars);
        } else {
            // No matching close — escape all asterisks
            result.push(stars.replace(/\*/g, '\\*'));
        }
    }
    return result.join('');
}

/**
 * Repair cells broken by a previous fixTableCells run that cut the outer <td>/<th>
 * at the first nested </td>/</th> rather than the true outer closing tag.
 *
 * Detection: a line that opens a <td> or <th>, contains <table, but does NOT
 * contain </table> on the same line (the nested table spans beyond this line).
 *
 * Fix: collect subsequent lines until </table> is found and the outer </tag>
 * follows on the same or next line, then flatten everything to one line.
 */
function repairBrokenOuterCells(body) {
    const lines = body.split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const cellOpen = /<(td|th)\b[^>]*>/i.exec(line);
        if (cellOpen && line.includes('<table') && !line.includes('</table>')) {
            const tag = cellOpen[1].toLowerCase();
            const closeTag = `</${tag}>`;
            const collected = [line];
            let j = i + 1;
            let found = false;
            let seenTableClose = false;
            let tableCloseCollIdx = -1;
            while (j < lines.length) {
                const jLine = lines[j];
                if (!seenTableClose && jLine.includes('</table>')) {
                    seenTableClose = true;
                }
                if (seenTableClose) {
                    const closeIdx = jLine.indexOf(closeTag);
                    if (closeIdx !== -1) {
                        // Include only up to and including the outer closing tag.
                        collected.push(jLine.slice(0, closeIdx + closeTag.length));
                        found = true;
                        break;
                    }
                }
                collected.push(jLine);
                if (seenTableClose && tableCloseCollIdx === -1) {
                    tableCloseCollIdx = collected.length - 1;
                }
                // Fallback: if >5 lines past </table> with no outer </tag>, the line
                // doesn't have a matching outer cell — just close at the </table> line.
                if (tableCloseCollIdx !== -1 && collected.length - tableCloseCollIdx > 5) {
                    collected.length = tableCloseCollIdx + 1;
                    found = true;
                    break;
                }
                j++;
            }
            if (found) {
                out.push(collected.join(' ').replace(/\s+/g, ' ').trim());
                i = j + 1;
                continue;
            }
        }
        out.push(line);
        i++;
    }
    return out.join('\n');
}

/**
 * Fix multiline <td>/<th> cells by collapsing them to single lines.
 * Also fixes malformed closing tags (e.g. </th </tr> → </th></tr>).
 *
 * Uses an iterative "innermost first" approach so that nested tables are
 * handled correctly: inner cells are collapsed first, then outer cells.
 */
function fixTableCells(body) {
    // Fix malformed closing tags: </th </tr> (missing >) or </th > (space before >)
    body = body.replace(/<\/(th|td|tr|thead|tbody|tfoot)\s+>?/gi, '</$1>');

    // Iteratively collapse innermost td/th cells — those whose content contains
    // no nested <td> or <th> opening tags.  Repeat until stable.
    let prev;
    do {
        prev = body;
        body = body.replace(
            /<(td|th)\b([^>]*)>((?:(?!<(?:td|th)\b)[\s\S])*?)<\/\1>/gi,
            (_, tag, attrs, content) => {
                const collapsed = content.replace(/\s+/g, ' ').trim();
                return `<${tag}${attrs}>${escapeUnpairedAsterisks(collapsed)}</${tag}>`;
            }
        );
    } while (body !== prev);

    return body;
}

function fixFile(text) {
    // Strip BOM — we re-add it when writing if it was present.
    const bom = text.charCodeAt(0) === 0xFEFF ? '\uFEFF' : '';
    if (bom) text = text.slice(1);

    // Preserve frontmatter intact.
    const fmMatch = text.match(/^(---[\s\S]*?---\n?)/);
    const frontmatter = fmMatch ? fmMatch[1] : '';
    let body = fmMatch ? text.slice(frontmatter.length) : text;

    // -------------------------------------------------------------------------
    // Pre-step: Extract the DocFX metadata block before ANY processing.
    // normalizeMdxContent (step 7) needs it intact to extract the fileName slug.
    // We re-attach it at the very end so it's untouched by brace escaping etc.
    // -------------------------------------------------------------------------
    const metaRe = /<!--\s*\|metadata\|[\s\S]*?\|metadata\|\s*-->\n?/;
    const metaMatch = body.match(metaRe);
    const metadataBlock = metaMatch ? metaMatch[0] : '';
    if (metaMatch) {
        body = body.slice(0, metaMatch.index) + body.slice(metaMatch.index + metaMatch[0].length);
    }

    // -------------------------------------------------------------------------
    // Step 0a: Remove ALL remaining HTML comments. With the metadata block
    // already extracted, every comment left is a TODO/note that MDX can't parse.
    // -------------------------------------------------------------------------
    body = body.replace(/<!--[\s\S]*?-->/g, '');

    // -------------------------------------------------------------------------
    // Step 0b: Various structural HTML repairs (order matters).
    // -------------------------------------------------------------------------
    // </br> is a malformed void close-tag → <br/>
    body = body.replace(/<\/br>/gi, '<br/>');

    // Remove duplicate closing </table> (e.g. two </table> on consecutive lines)
    body = body.replace(/(<\/table>)([ \t]*\r?\n[ \t]*)<\/table>/g, '$1$2');

    // Remove whitespace between </tr> and <tr> on the same line — a space/tab
    // creates a text node between table rows which MDX cannot parse as valid JSX.
    body = body.replace(/<\/tr>([ \t]+)<tr/g, '</tr><tr');

    // Heading anchor fixes:
    //   a) Close unclosed <a> in headings: ## <a id="x">Text → ## <a id="x"></a>Text
    //      Note: [ \t]* (zero or more) to also handle ###<a (no space after #)
    body = body.replace(/^(#{1,6}[ \t]*[^\n]*?)<a\b([^>]*)>(?!<\/a>)/gm, '$1<a$2></a>');
    //   b) Remove orphaned </a> at start of heading content: ## </a>Text → ## Text
    body = body.replace(/^(#{1,6}[ \t]+)<\/a>/gm, '$1');

    // Fix self-closing <a .../></a> pairs → <a ...></a>
    // e.g. ## <a id="relatedtopics"/></a> → ## <a id="relatedtopics"></a>
    body = body.replace(/<a\b([^>]*)\/>([ \t]*)<\/a>/g, '<a$1>$2</a>');

    // Dedent code fence markers — MDX does not support indented code fences.
    // "    ```js" → "```js" (removes leading spaces/tabs from ``` lines)
    body = body.replace(/^[ \t]+(```)/gm, '$1');

    // Fix <br> (non-self-closed void element) using a fence-only split to avoid
    // the single-backtick-in-URL issue that prevents fixProseChunk from seeing it.
    {
        const fenceParts = body.split(/(```[\s\S]*?```)/g);
        body = fenceParts.map((part, i) => i % 2 === 1 ? part : part.replace(/<br>/gi, '<br/>')).join('');
    }

    // Fix unclosed backtick code spans that had } escaped by a previous run:
    //   `&#125;); → `});`   (restore the intended closing backtick)
    body = body.replace(/`&#125;\);(?!`)/g, '`});`');

    // Fix unquoted attribute value followed by extra "": id=name"" → id="name"
    body = body.replace(/\b(id|class|name|href)=([^"'\s>{/][^\s>"]*)"">/g, '$1="$2">');

    // Escape <word/word> pseudo-tags (slash embedded in tag name):
    //   <configuration/behaviors> → &lt;configuration/behaviors&gt;
    body = body.replace(/<([a-zA-Z][a-zA-Z0-9._-]*\/[a-zA-Z][a-zA-Z0-9._-]*)>/g,
        (_, tag) => `&lt;${tag}&gt;`);

    // Escape HTML block-level tags inside markdown link text [...<tag>...]
    // These are descriptive references (e.g. [text with <div> elements](#anchor))
    body = body.replace(/\[([^\]\n]*?)<(div|section|article|aside|ul|ol|li|p|nav|main|header|footer)\b([^>]*?)>([^\]\n]*?)\]/g,
        (_, before, tag, attrs, after) => `[${before}&lt;${tag}${attrs}&gt;${after}]`);

    // Escape block-level HTML tags used as inline descriptive text (surrounded by spaces)
    // e.g. "the <div> element" or "layout <div> element with..."
    body = body.replace(/([ \t])<(div|section|article|aside|p|nav|main|header|footer)\b([^>]*?)>([ \t])/g,
        (_, before, tag, attrs, after) => `${before}&lt;${tag}${attrs}&gt;${after}`);

    // Remove stray </span> that appear immediately after </a> (copy-paste artifact)
    body = body.replace(/<\/a><\/span>/g, '</a>');

    // Remove stray </td>/<th>/<tr> from markdown pipe table rows.
    // These are lines that contain | (pipe-table syntax) but also have an errant
    // HTML closing tag (probably a copy-paste artifact).
    body = body.replace(/^([^<\n]*\|[^\n]*?)<\/(?:td|th|tr)>([ \t]*)$/gm, '$1$2');

    // Remove stray </li> at end of blockquote lines that have no matching <li>.
    body = body.replace(/^(>[ \t]+(?:(?!<li\b).)*?)<\/li>([ \t]*)$/gm, '$1$2');

    // Remove stray </li> that appear at the very start of a pipe table cell (after |).
    // These are artifacts where a cell starts with </li> from a wrapping list context.
    body = body.replace(/(\|[ \t]*)<\/li>/g, '$1');

    // Remove stray > character that appears right after a </td> at end of line.
    // e.g. <td>&#9210;</td>>  →  <td>&#9210;</td>
    body = body.replace(/(<\/(?:td|th)>)([ \t]*)>[ \t]*$/gm, '$1$2');

    // -------------------------------------------------------------------------
    // Step 0c: Insert missing </li> before the next <li> where HTML5 allows
    // implicit closing but MDX/JSX requires explicit tags.
    // -------------------------------------------------------------------------
    body = body.replace(/<li\b([^>]*)>((?:[^<]|<(?!\/li>|\/ul>|\/ol>|ul\b|ol\b))*?)<li\b/g,
        (_, attrs, content) => `<li${attrs}>${content}</li><li`);
    // Repeat until stable (handles chains like <li>a<li>b<li>c</li>)
    let prev0;
    do {
        prev0 = body;
        body = body.replace(/<li\b([^>]*)>((?:[^<]|<(?!\/li>|\/ul>|\/ol>|ul\b|ol\b))*?)<li\b/g,
            (_, attrs, content) => `<li${attrs}>${content}</li><li`);
    } while (body !== prev0);

    // -------------------------------------------------------------------------
    // Step 1: Repair cells broken by a previous fixTableCells run (nested tables
    // incorrectly cut at first inner </td>). Flatten outer cell + nested table
    // to one line so MDX can parse it as a single JSX expression.
    // -------------------------------------------------------------------------
    body = repairBrokenOuterCells(body);

    // -------------------------------------------------------------------------
    // Step 2: Collapse remaining multiline <td>/<th> cells. Uses iterative
    // innermost approach so nested tables at any depth are handled correctly.
    // Also fixes malformed closing tags like </th </tr>.
    // -------------------------------------------------------------------------
    body = fixTableCells(body);

    // -------------------------------------------------------------------------
    // Step 3: Remove blank lines that break MDX's inline HTML block parsing.
    // MDX ends an inline HTML block at a blank line, causing </tr> errors.
    // -------------------------------------------------------------------------
    // 3a: blank line immediately after table/row opening tag
    body = body.replace(/(<(?:table|thead|tbody|tfoot|tr)\b[^>]*>)\r?\n[ \t]*\r?\n/g, '$1\n');
    // 3b: blank lines between </td> or </th> and the next <td>/<th>/</tr>
    body = body.replace(/(<\/(?:td|th)>[ \t]*)\r?\n(?:[ \t]*\r?\n)+([ \t]*<(?:\/tr|td|th)\b)/g, '$1\n$2');

    // Split body into code-fence/inline-code segments and prose segments.
    const parts = body.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
    const fixed = parts.map((part, i) => (i % 2 === 1 ? part : fixProseChunk(part))).join('');

    return bom + frontmatter + metadataBlock + fixed;
}

const abs = path.resolve(targetDir);
console.log('\nFixing MDX compatibility in: ' + abs + '\n');

let processed = 0, skipped = 0, errors = 0;

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) { walk(full); continue; }
        if (!entry.name.endsWith('.mdx') && !entry.name.endsWith('.md')) continue;
        try {
            const source = fs.readFileSync(full, 'utf8');
            const fixed = fixFile(source);
            if (fixed === source) { skipped++; continue; }
            fs.writeFileSync(full, fixed, 'utf8');
            processed++;
            console.log('  [OK]   ' + path.relative(abs, full));
        } catch (err) {
            errors++;
            console.error('  [ERR]  ' + path.relative(abs, full) + ': ' + err.message);
        }
    }
}

walk(abs);
console.log('\nDone - fixed: ' + processed + ', unchanged: ' + skipped + ', errors: ' + errors);
if (errors > 0) process.exit(1);

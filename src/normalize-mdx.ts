/**
 * normalize-mdx.ts
 *
 * Converts legacy DocFX-style MDX/MD files to standard Astro/Starlight format.
 *
 * Legacy format:
 *   <!--
 *   |metadata|
 *   { "fileName": "...", "controlName": "...", "tags": [...] }
 *   |metadata|
 *   -->
 *
 *   # Page Title
 *   Body content…
 *
 * Output format:
 *   ---
 *   title: "Page Title"
 *   ---
 *
 *   # Page Title
 *   Body content…
 *
 * Idempotent: files already starting with `---` and containing no metadata
 * block are left untouched. Partial states (frontmatter present but metadata
 * block still in body) are also fixed.
 *
 * Usage from astro.config.ts:
 *   import { normalizeMdxDir } from 'docs-template/normalize-mdx';
 *   normalizeMdxDir(path.resolve('./src/content/en/topics'));
 *
 * CLI (via scripts/normalize-mdx.mjs):
 *   node scripts/normalize-mdx.mjs <topicsDir>
 */

import fs   from 'node:fs';
import path from 'node:path';

/** Matches the full DocFX metadata comment block (anywhere in the file). */
const METADATA_RE = /<!--\s*\|metadata\|[\s\S]*?\|metadata\|\s*-->\n?/g;

/** Matches the first # H1 heading (space after # is optional). */
const H1_RE = /^#[ \t]*(.+?)[ \t]*$/m;

/**
 * Matches bare angle-bracket tokens used as text placeholders in legacy DocFX
 * content (e.g. `<language>`, `<value>`, `<type>`) that are NOT real HTML/JSX
 * tags and would cause MDX parse errors.
 *
 * Strategy: escape them as `\<word>` so MDX treats them as literal text.
 * We only escape tokens that:
 *   - appear outside of code spans/blocks (handled by splitting on code fences)
 *   - consist solely of lowercase letters (real HTML tags are a small known set;
 *     these pseudo-tags are things like <language>, <value>, <tablename>, etc.)
 *   - are NOT a known HTML void/block/inline element
 *
 * Regex matches `<word>` or `</word>` where word is 2+ lowercase letters not
 * in the HTML tag allowlist.
 */
const KNOWN_HTML_TAGS = new Set([
    'a','abbr','address','area','article','aside','audio','b','base','bdi','bdo',
    'blockquote','br','button','canvas','caption','cite','code','col',
    'colgroup','data','datalist','dd','del','details','dfn','dialog','div','dl',
    'dt','em','embed','fieldset','figcaption','figure','footer','form','h1','h2',
    'h3','h4','h5','h6','header','hgroup','hr','i','iframe','img',
    'input','ins','kbd','label','legend','li','main','map','mark','menu',
    'meter','nav','noscript','object','ol','optgroup','option','output',
    'p','picture','pre','progress','q','rp','rt','ruby','s','samp',
    'search','section','select','slot','small','source','span','strong',
    'sub','summary','sup','table','tbody','td','template','textarea','tfoot',
    'th','thead','time','tr','track','u','ul','var','video','wbr',
    // Intentionally omitted: 'body','head','html' — document-structure tags
    // used only as placeholder text in content pages and must be escaped.
    // Also omitted: 'script','style','link','meta','title' — head/resource tags
    // that should never appear in MDX prose and cause parse errors if orphaned.
]);

/**
 * Escape asterisks in a string that are not part of balanced *emphasis* or **strong**.
 * A lone unmatched * inside an HTML element causes MDX parse errors.
 */
function escapeUnpairedAsterisks(text: string): string {
    // Normalize: collapse 2+ backslashes immediately before * to a single backslash.
    // In markdown, an even number of backslashes before * cancel out, leaving * unescaped.
    text = text.replace(/\\{2,}(?=\*)/g, '\\');

    const result: string[] = [];
    let i = 0;
    while (i < text.length) {
        // Skip already-escaped \* to avoid cascading re-escaping on repeated runs.
        if (text[i] === '\\' && i + 1 < text.length && text[i + 1] === '*') {
            result.push('\\*'); i += 2; continue;
        }
        if (text[i] !== '*') { result.push(text[i++]); continue; }
        const start = i;
        while (i < text.length && text[i] === '*') i++;
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
        // If a matching closing sequence exists, keep as-is (real markdown).
        result.push(closeIdx !== -1 ? stars : stars.replace(/\*/g, '\\*'));
    }
    return result.join('');
}

/** Fix prose chunk: pseudo-HTML escaping, void element self-closing, curly brace escaping. */
function fixProseChunk(prose: string): string {
    // Undo backslash-escape attempts from prior runs.
    let p = prose.replace(/\\<(\/?[a-zA-Z][a-zA-Z0-9._-]*)/g, '<$1');

    // 1. Escape bare pseudo-HTML tags not in the HTML allowlist.
    //    Extended to handle uppercase, dots, underscores in tag names.
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
        (_match, tag, attrs) => `<${tag}${attrs}/>`
    );

    // 3. Escape bare `{` as &#123; — skip already-encoded entities.
    //    remark-docfx handles &#123;environment:...&#125; at render time.
    p = p.replace(/\{/g, (m, offset, str) => {
        const before = str.slice(Math.max(0, offset - 1), offset);
        if (before === '&') return m;
        return '&#123;';
    });

    // 4. Escape bare `}` as &#125; — skip `}` that closes an HTML entity.
    p = p.replace(/\}/g, (m, offset, str) => {
        const before = str.slice(Math.max(0, offset - 6), offset);
        if (/&#\d{2,3}$/.test(before)) return m;
        return '&#125;';
    });

    return p;
}

/**
 * Fix multiline `<td>/<th>` elements and escape unmatched asterisks in all
 * table cells. Must run on the full body before prose splitting, since the
 * regex needs to see the complete opening+closing tag pair across lines.
 *
 * Also handles `<thead>` correctly via the `\b` word boundary (prevents
 * `th` in `thead` from being matched as a `<th>` tag).
 */
/**
 * Repair cells broken by a previous fixTableCells run that cut the outer <td>/<th>
 * at the first nested </td>/</th> rather than the true outer closing tag.
 */
function repairBrokenOuterCells(body: string): string {
    const lines = body.split('\n');
    const out: string[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const cellOpen = /<(td|th)\b[^>]*>/i.exec(line);
        if (cellOpen && line.includes('<table') && !line.includes('</table>')) {
            const tag = cellOpen[1].toLowerCase();
            const closeTag = `</${tag}>`;
            const collected: string[] = [line];
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
                        collected.push(jLine.slice(0, closeIdx + closeTag.length));
                        found = true;
                        break;
                    }
                }
                collected.push(jLine);
                if (seenTableClose && tableCloseCollIdx === -1) {
                    tableCloseCollIdx = collected.length - 1;
                }
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
 * Fix multiline <td>/<th> cells using an iterative innermost-first approach,
 * and fix malformed closing tags (e.g. </th </tr> → </th></tr>).
 */
function fixTableCells(body: string): string {
    // Fix malformed closing tags: </th </tr> (missing >) or </th > (space before >)
    body = body.replace(/<\/(th|td|tr|thead|tbody|tfoot)\s+>?/gi, '</$1>');

    // Iteratively collapse innermost td/th cells (no nested td/th in content).
    let prev: string;
    do {
        prev = body;
        body = body.replace(
            /<(td|th)\b([^>]*)>((?:(?!<(?:td|th)\b)[\s\S])*?)<\/\1>/gi,
            (_: string, tag: string, attrs: string, content: string) => {
                const collapsed = content.replace(/\s+/g, ' ').trim();
                return `<${tag}${attrs}>${escapeUnpairedAsterisks(collapsed)}</${tag}>`;
            }
        );
    } while (body !== prev);

    return body;
}

/**
 * Escape table-element tags (td, th, tr, thead, tbody, tfoot) that appear
 * outside of any <table>…</table> block. These orphaned tags cause MDX/JSX
 * parse errors like "Unexpected closing slash `/` in tag".
 */
function escapeOrphanedTableTags(body: string): string {
    // Split by code fences so we don't modify code blocks.
    const codeParts = body.split(/(```[\s\S]*?```)/g);
    return codeParts.map((part, i) => {
        if (i % 2 === 1) return part; // code block — skip

        // Track table nesting depth.
        // Replace all table-element tags outside <table> blocks.
        let depth = 0;
        return part.replace(/<(\/?)(\w+)([^>]*?)>/g, (match, slash, tag, attrs) => {
            const lowerTag = tag.toLowerCase();
            if (lowerTag === 'table') {
                if (slash) {
                    if (depth > 0) { depth--; return match; }
                    // Orphaned </table>
                    return `&lt;/${tag}&gt;`;
                }
                depth++;
                return match;
            }
            // Table-internal tags
            const tableTags = new Set(['td', 'th', 'tr', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup']);
            if (tableTags.has(lowerTag)) {
                if (depth > 0) return match; // inside a <table> — keep
                // Orphaned table tag — escape
                return slash
                    ? `&lt;/${tag}&gt;`
                    : `&lt;${tag}${attrs}&gt;`;
            }
            return match;
        });
    }).join('');
}

/**
 * Escape HTML tags inside markdown table cells that would cause MDX parse
 * errors. Keeps safe inline tags that MDX handles well. Escapes block-level
 * and complex tags (div, ul, ol, li, p, section, etc.) to &lt;…&gt;.
 * Only processes markdown table rows (lines with | separators, not separator rows).
 */
const MD_TABLE_SAFE_TAGS = new Set([
    'br', 'code', 'em', 'strong', 'b', 'i', 'a', 'span', 'sub', 'sup',
    'del', 's', 'kbd', 'mark', 'small', 'abbr', 'img',
]);

function escapeHtmlInMarkdownTableCells(body: string): string {
    const lines = body.split('\n');
    // Detect markdown table blocks: a header row followed by a separator row (---|---).
    // We process rows within these blocks.
    const isSepRow = (line: string) =>
        /^\s*\|?\s*[-:]+[-| :]*\s*$/.test(line);

    let inMdTable = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect start of markdown table (separator row follows)
        if (!inMdTable && i + 1 < lines.length && isSepRow(lines[i + 1]) && line.includes('|')) {
            inMdTable = true;
            lines[i] = escapeHtmlInTableRow(line);
            continue;
        }
        if (inMdTable && isSepRow(line)) {
            continue; // skip separator row
        }
        if (inMdTable) {
            if (!line.includes('|') || line.trim() === '' || /^#{1,6}\s/.test(line.trim())) {
                inMdTable = false;
                continue;
            }
            lines[i] = escapeHtmlInTableRow(line);
        }
    }
    return lines.join('\n');
}

function escapeHtmlInTableRow(line: string): string {
    // Split by | but preserve the delimiters for reconstruction.
    // Don't split | inside code spans.
    const cells = line.split('|');
    return cells.map((cell, idx) => {
        // First and last are usually empty in | ... | ... | format
        if (idx === 0 || idx === cells.length - 1) return cell;
        // Escape non-safe HTML tags
        return cell.replace(/<(\/?)([\w.-]+)([^>]*?)>/g, (match, slash, tag, attrs) => {
            const lower = tag.toLowerCase();
            if (MD_TABLE_SAFE_TAGS.has(lower)) return match;
            // Escape the tag
            return slash
                ? `&lt;/${tag}&gt;`
                : `&lt;${tag}${attrs}&gt;`;
        });
    }).join('|');
}

// ---------------------------------------------------------------------------
// Core transform
// ---------------------------------------------------------------------------

/**
 * Transform the content of a single MDX/MD file.
 *
 * @returns  Transformed content string, or `null` when no change is needed.
 */
export function normalizeMdxContent(source: string): string | null {
    // Extract fileName from metadata block before stripping (used as slug).
    const fileNameMatch = source.match(/"fileName"\s*:\s*"([^"]+)"/);
    const slug = fileNameMatch ? fileNameMatch[1] : null;

    // Strip ALL DocFX metadata comment blocks.
    const stripped = source.replace(METADATA_RE, '');

    const trimmed        = stripped.trimStart();
    const hasFrontmatter = trimmed.startsWith('---');

    let body = stripped;

    if (!hasFrontmatter) {
        const h1Match = H1_RE.exec(body);
        // No H1 title found — strip the metadata block only (content-helper
        // will remove the entry from the collection since title is missing).
        if (!h1Match) return stripped !== source ? body : null;

        const title = h1Match[1]
            .trim()
            .replace(/"/g, "'"); // escape double-quotes for YAML

        // Collapse any leading blank lines to a single blank line.
        body = body.replace(/^[\r\n]+/, '\n');

        const slugLine = slug ? `slug: ${slug}\n` : '';
        const frontmatter = `---\ntitle: "${title}"\n${slugLine}---\n`;
        body = frontmatter + body;
    } else if (slug) {
        // Has frontmatter but no slug — inject slug if missing
        const fmEnd = body.indexOf('---', body.indexOf('---') + 3);
        if (fmEnd !== -1) {
            const fm = body.slice(0, fmEnd);
            if (!/^slug\s*:/m.test(fm)) {
                body = body.slice(0, fmEnd) + `slug: ${slug}\n` + body.slice(fmEnd);
            }
        }
    }

    // Collapse runs of 4+ newlines down to 3 (2 blank lines max).
    body = body.replace(/\n{4,}/g, '\n\n\n');

    // Remove HTML comments (includes DocFX metadata and <!-- TODO --> blocks).
    body = body.replace(/<!--[\s\S]*?-->/g, '');

    // </br> malformed void close-tag → <br/>
    body = body.replace(/<\/br>/gi, '<br/>');

    // Remove duplicate closing </table>
    body = body.replace(/(<\/table>)([ \t]*\r?\n[ \t]*)<\/table>/g, '$1$2');

    // Remove whitespace between </tr> and <tr> on the same line (prevents text node)
    body = body.replace(/<\/tr>([ \t]+)<tr/g, '</tr><tr');

    // Heading anchor fixes ([ \t]* allows zero spaces, so ###<a works too)
    body = body.replace(/^(#{1,6}[ \t]*[^\n]*?)<a\b([^>]*)>(?!<\/a>)/gm, '$1<a$2></a>');
    body = body.replace(/^(#{1,6}[ \t]+)<\/a>/gm, '$1');

    // Fix self-closing <a .../></a> pairs → <a ...></a>
    body = body.replace(/<a\b([^>]*)\/>([ \t]*)<\/a>/g, '<a$1>$2</a>');

    // Dedent code fence markers (MDX does not support indented code fences)
    body = body.replace(/^[ \t]+(```)/gm, '$1');

    // Fix <br> (non-self-closed) using fence-only split (avoids backtick-in-URL issue)
    {
        const fenceParts = body.split(/(```[\s\S]*?```)/g);
        body = fenceParts.map((part: string, i: number) => i % 2 === 1 ? part : part.replace(/<br>/gi, '<br/>')).join('');
    }

    // Fix unclosed backtick code spans that had } escaped by a previous run
    body = body.replace(/`&#125;\);(?!`)/g, '`});`');

    // Fix unquoted attribute: id=value"" → id="value"
    body = body.replace(/\b(id|class|name|href)=([^"'\s>{/][^\s>"]*)"">/g, '$1="$2">');

    // Escape <word/word> pseudo-tags (slash in tag name)
    body = body.replace(/<([a-zA-Z][a-zA-Z0-9._-]*\/[a-zA-Z][a-zA-Z0-9._-]*)>/g,
        (_: string, tag: string) => `&lt;${tag}&gt;`);

    // Escape HTML block-level tags inside markdown link text
    body = body.replace(/\[([^\]\n]*?)<(div|section|article|aside|ul|ol|li|p|nav|main|header|footer)\b([^>]*?)>([^\]\n]*?)\]/g,
        (_: string, before: string, tag: string, attrs: string, after: string) => `[${before}&lt;${tag}${attrs}&gt;${after}]`);

    // Escape block-level HTML tags used as inline descriptive text (surrounded by spaces)
    body = body.replace(/([ \t])<(div|section|article|aside|p|nav|main|header|footer)\b([^>]*?)>([ \t])/g,
        (_: string, before: string, tag: string, attrs: string, after: string) => `${before}&lt;${tag}${attrs}&gt;${after}`);

    // Remove stray </span> immediately after </a>
    body = body.replace(/<\/a><\/span>/g, '</a>');

    // Remove stray </td>/<th>/<tr> from markdown pipe table rows
    body = body.replace(/^([^<\n]*\|[^\n]*?)<\/(?:td|th|tr)>([ \t]*)$/gm, '$1$2');

    // Remove stray </li> at end of blockquote lines without matching <li>
    body = body.replace(/^(>[ \t]+(?:(?!<li\b).)*?)<\/li>([ \t]*)$/gm, '$1$2');

    // Remove stray </li> that appear at the very start of a pipe table cell (after |).
    body = body.replace(/(\|[ \t]*)<\/li>/g, '$1');

    // Remove stray > right after </td> at end of line
    body = body.replace(/(<\/(?:td|th)>)([ \t]*)>[ \t]*$/gm, '$1$2');

    // Remove orphaned </li> tags inside markdown table cells: closing tags that
    // appear before any opening <li> in the same cell. These are artifacts from
    // table conversion where list items span cell boundaries.
    // Only applies to markdown table rows (lines containing | separators).
    body = body.split('\n').map(line => {
        // Only process markdown table rows (contain | but are not separator rows)
        if (!line.includes('|') || /^\s*\|?\s*[-:]+\s*(\|\s*[-:]+\s*)*\|?\s*$/.test(line)) return line;

        // Process each cell: remove </li> before the first <li> in each cell.
        return line.split('|').map(cell => {
            const firstLi = cell.indexOf('<li');
            if (firstLi === -1) {
                // No <li> in this cell — remove all </li>
                return cell.replace(/<\/li>/g, '');
            }
            // Remove </li> only before the first <li>
            const before = cell.slice(0, firstLi);
            const after = cell.slice(firstLi);
            return before.replace(/<\/li>/g, '') + after;
        }).join('|');
    }).join('\n');

    // Insert missing </li> before the next <li> where HTML5 allows implicit closing
    // but MDX/JSX requires explicit tags.
    let prevLi: string;
    do {
        prevLi = body;
        body = body.replace(/<li\b([^>]*)>((?:[^<]|<(?!\/li>|\/ul>|\/ol>|ul\b|ol\b))*?)<li\b/g,
            (_: string, attrs: string, content: string) => `<li${attrs}>${content}</li><li`);
    } while (body !== prevLi);

    // Insert missing </li> before </ul> and </ol>.
    body = body.replace(/<li\b([^>]*)>((?:[^<]|<(?!\/li>|\/ul>|\/ol>|ul\b|ol\b|li\b))*?)<\/(ul|ol)>/g,
        (_: string, attrs: string, content: string, listTag: string) =>
            `<li${attrs}>${content}</li></${listTag}>`);

    // Close the last unclosed <li> in a sequence that doesn't end with </li>,
    // </ul>, or </ol>.  This handles <li> inside table cells where the closing
    // tag is implied by the end of the cell/row.
    // Look for <li> ... (end-of-line or | or </td> or </th>) without a closing </li>.
    body = body.replace(/<li\b([^>]*)>((?:(?!<\/li>|<li\b|<\/?[uo]l\b)[\s\S])*?)(?=\n|$)/g,
        (match, attrs, content) => {
            // Don't double-close if already closed
            if (match.trimEnd().endsWith('</li>')) return match;
            return `<li${attrs}>${content}</li>`;
        });

    // Insert missing </tr> before the next <tr> where HTML5 allows implicit closing
    // but MDX/JSX requires explicit tags.
    let prevTr: string;
    do {
        prevTr = body;
        body = body.replace(
            /<tr\b([^>]*)>((?:(?!<\/tr>)[\s\S])*?)\n([ \t]*)<tr\b/g,
            (_: string, attrs: string, content: string, indent: string) =>
                `<tr${attrs}>${content}\n${indent}</tr>\n${indent}<tr`
        );
    } while (body !== prevTr);

    // Insert missing </tr> before </tbody>, </thead>, </tfoot>, or </table>
    body = body.replace(
        /<tr\b([^>]*)>((?:(?!<\/tr>)[\s\S])*?)\n([ \t]*)<\/(tbody|thead|tfoot|table)>/g,
        (_: string, attrs: string, content: string, indent: string, closeTag: string) =>
            `<tr${attrs}>${content}\n${indent}</tr>\n${indent}</${closeTag}>`
    );

    // Repair cells broken by prior runs (nested tables cut at first inner </td>).
    body = repairBrokenOuterCells(body);

    // Fix multiline <td>/<th> and unmatched * in all table cells.
    // Must run before prose splitting so the full open+close tag pair is visible.
    body = fixTableCells(body);

    // Remove blank lines that break MDX's inline HTML block parsing.
    // MDX ends an inline HTML block at a blank line, causing </tr> errors.
    // 3a: blank line immediately after table/row opening tag
    body = body.replace(/(<(?:table|thead|tbody|tfoot|tr)\b[^>]*>)\r?\n[ \t]*\r?\n/g, '$1\n');
    // 3b: blank lines between </td> or </th> and the next <td>/<th>/</tr>/<tr>
    body = body.replace(/(<\/(?:td|th)>[ \t]*)\r?\n(?:[ \t]*\r?\n)+([ \t]*<(?:\/tr|td|th|tr)\b)/g, '$1\n$2');

    // MDX/JSX chokes when </tr> follows </td> or </th> on the same line because
    // it conflicts with the paragraph flow context inside the cell. Put </tr>
    // on its own line to prevent "Expected the closing tag </tr>…" errors.
    body = body.replace(/<\/(td|th)>(\s*)<\/tr>/g, '</$1>\n</tr>');

    // Escape HTML tags inside markdown table cells that cause MDX/JSX parse errors.
    // Safe inline tags (br, code, em, strong, b, i, a, span, sub, sup) are kept.
    // Block/complex tags (div, ul, ol, li, p, table, etc.) are escaped to &lt;...&gt;.
    body = escapeHtmlInMarkdownTableCells(body);

    // Fix prose sections: pseudo-HTML escaping, void element self-closing,
    // curly brace escaping. Skip code spans/fences.
    const parts = body.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
    body = parts.map((part, i) => (i % 2 === 1 ? part : fixProseChunk(part))).join('');

    // Escape orphaned table-element tags that appear outside <table> blocks.
    // After fixTableCells and table-to-markdown conversion, some closing tags
    // (e.g. </td>, </tr>, </tbody>, </table>) may be left without matching
    // opening tags, causing MDX JSX parse errors.
    body = escapeOrphanedTableTags(body);

    // Return null only if absolutely nothing changed.
    if (body === source) return null;
    return body;
}

// ---------------------------------------------------------------------------
// Directory walker
// ---------------------------------------------------------------------------

export interface NormalizeMdxDirResult {
    processed: number;
    skipped:   number;
    errors:    number;
}

/**
 * Normalize all `.mdx` and `.md` files under `dir`, in place.
 *
 * @param dir      Absolute path to the topics directory to process.
 * @param verbose  When true, logs each file action to stdout.
 */
export function normalizeMdxDir(
    dir: string,
    { verbose = false }: { verbose?: boolean } = {},
): NormalizeMdxDirResult {
    if (!fs.existsSync(dir)) {
        console.warn(`[normalize-mdx] Directory not found, skipping: ${dir}`);
        return { processed: 0, skipped: 0, errors: 0 };
    }

    let processed = 0;
    let skipped   = 0;
    let errors    = 0;

    function walk(current: string): void {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) { walk(full); continue; }
            if (!entry.name.endsWith('.mdx') && !entry.name.endsWith('.md')) continue;

            try {
                const raw    = fs.readFileSync(full, 'utf8');
                // Strip UTF-8 BOM (\uFEFF) if present.
                const source = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;

                const updated = normalizeMdxContent(source);
                if (updated === null) {
                    skipped++;
                    if (verbose) console.log(`  [SKIP] ${path.relative(dir, full)}`);
                } else {
                    fs.writeFileSync(full, updated, 'utf8');
                    processed++;
                    if (verbose) console.log(`  [OK]   ${path.relative(dir, full)}`);
                }
            } catch (err) {
                errors++;
                console.error(
                    `  [ERR]  ${path.relative(dir, full)}: ${(err as Error).message}`,
                );
            }
        }
    }

    walk(dir);

    return { processed, skipped, errors };
}

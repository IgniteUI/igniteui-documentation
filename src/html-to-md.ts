/**
 * html-to-md.ts  —  HTML → Markdown converter for the LLM output pipeline
 *
 * Part of the Astro `astro:build:done` post-processing pipeline.
 * After Astro renders every MDX page to HTML (with fully resolved components,
 * Shiki syntax highlighting, platform-specific content, etc.), this module
 * converts each rendered page back to clean Markdown optimised for LLM
 * consumption — stripping navigation chrome, decorative elements, and other
 * tokens that are useful for human readers but waste context window budget.
 *
 * Why HTML → MD instead of source MDX → MD?
 *   Source MDX files contain JSX components (`<ApiLink>`, `<PlatformBlock>`),
 *   remark/rehype plugin directives, and env-var placeholders that only resolve
 *   during the Astro build.  Converting the *rendered* HTML guarantees the MD
 *   output reflects the final, reader-facing content with no unresolved markup.
 *
 * Entry points
 *   buildHtmlToMdConverter() — create a configured TurndownService once per
 *                              build; reuse across all pages for performance.
 *   htmlPageToMd(path, siteUrl, converter) — convert a single built HTML file
 *                                            to Markdown.  Returns '' when the
 *                                            file is missing or has no content.
 */

import fsp from 'node:fs/promises';
import { JSDOM } from 'jsdom';
// @ts-expect-error — no bundled types; works correctly at runtime via ESM build
import TurndownService from 'turndown';
// @ts-expect-error — no bundled types
import { tables as gfmTables } from 'turndown-plugin-gfm';
// ── Typographic normalization ─────────────────────────────────────────────
// Replace common typographic characters with plain ASCII equivalents.
// Unlike `unidecode` (which romanizes CJK characters), this preserves all
// non-Latin scripts — essential for Japanese and Korean documentation builds.
const TYPOGRAPHIC_MAP: Record<string, string> = {
    '\u2018': "'", '\u2019': "'",   // curly single quotes
    '\u201C': '"', '\u201D': '"',   // curly double quotes
    '\u2013': '--', '\u2014': '--',  // en-dash, em-dash
    '\u2026': '...',                 // ellipsis
    '\u00A0': ' ', '\u202F': ' ',     // non-breaking space, narrow no-break space
    '\u00AE': '(R)', '\u2122': '(TM)', '\u00A9': '(C)', // symbols
};
const TYPOGRAPHIC_RE = new RegExp('[' + Object.keys(TYPOGRAPHIC_MAP).join('') + ']', 'g');

function normalizeTypography(text: string): string {
    return text.replace(TYPOGRAPHIC_RE, ch => TYPOGRAPHIC_MAP[ch] ?? ch);
}

/** Build a configured TurndownService instance.  Create once per build, reuse per page. */
export function buildHtmlToMdConverter() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const td: any = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        fence: '```',
        bulletListMarker: '-',
        hr: '---',
    });

    td.use(gfmTables);

    // ── Element removal ──────────────────────────────────────────────────────
    // These elements carry no documentation value and are dropped entirely:
    //   script/style       — runtime scripts and CSS
    //   igc-icon            — decorative web-component icons (chevrons, etc.)
    //   igc-icon-button     — heading anchor-link buttons added by rehype
    td.remove(['script', 'style', 'igc-icon', 'igc-icon-button']);

    // ── Turndown rules ────────────────────────────────────────────────────
    // Custom rules transform site-specific HTML patterns into clean Markdown
    // or suppress them when they add no value for LLMs.

    // Remove breadcrumb nav — the API references nav must survive.
    td.addRule('breadcrumb', {
        filter: (node: Element) => node.nodeName === 'NAV' && (node.getAttribute('class') || '').includes('docs-breadcrumb'),
        replacement: () => '',
    });

    // DocsAside callout -> GFM blockquote with bold severity label.
    // Use split() for exact class-word matching — includes() would also match
    // child elements like .igd-aside__content, causing double-wrapping.
    td.addRule('docs-aside', {
        filter: (node: Element) => node.nodeName === 'DIV' && (node.getAttribute('class') || '').split(/\s+/).includes('igd-aside'),
        replacement: (content: string, node: Element) => {
            const label = node.getAttribute('aria-label') ?? 'Note';
            const lines = content.trim().split('\n').map((l: string) => `> ${l}`).join('\n');
            return `\n\n> **${label}:**\n${lines}\n\n`;
        },
    });

    // Sample iframes -> "[title](url)" link so seams read "And the result is: [Example](url)"
    // rather than dangling with nothing after the prose lead-in.
    td.addRule('sample-iframe', {
        filter: (node: Element) => node.nodeName === 'IFRAME' && !!node.getAttribute('data-src'),
        replacement: (_: string, node: Element) => {
            const url = node.getAttribute('data-src') ?? '';
            const title = node.getAttribute('title') ?? 'Live example';
            return `\n\n[${title}](${url})\n\n`;
        },
    });

    // Sample container divs — let the iframe rule handle the link, drop the wrapper chrome
    td.addRule('sample-container', {
        filter: (node: Element) => node.nodeName === 'DIV' && (node.getAttribute('class') || '').includes('igd-sample-container'),
        replacement: (content: string) => content,
    });

    // Decorative half-dividers -> drop
    td.addRule('divider', {
        filter: (node: Element) => node.nodeName === 'DIV' && (node.getAttribute('class') || '').includes('divider--half'),
        replacement: () => '',
    });

    return td;
}

export type HtmlToMdConverter = ReturnType<typeof buildHtmlToMdConverter>;

/**
 * Convert a single built HTML page to Markdown.
 *
 * Returns empty string if the file doesn't exist or has no recognisable
 * content element — the caller skips writing `.md` in that case.
 */
export async function htmlPageToMd(
    htmlPath: string,
    siteUrl: string,
    td: HtmlToMdConverter,
    /** Source file reference used in warnings — defaults to htmlPath. Pass the
     *  MDX source path so error messages point developers at the right file. */
    sourceRef = htmlPath,
): Promise<string> {
    let html: string;
    try { html = await fsp.readFile(htmlPath, 'utf-8'); }
    catch { return ''; }

    // Warn if page has Shiki blocks but extraction finds none — catches selector renames.
    const hasShikiBlocks = html.includes('astro-code');

    // ── Extract Shiki code blocks before JSDOM ───────────────────────────────
    // Replace each <pre class="astro-code"> with a plain marker so turndown
    // never sees the Shiki token spans — fenced blocks are stitched back afterward.
    const codeBlocks: Array<{ lang: string; code: string }> = [];
    const htmlWithMarkers = html.replace(
        /<pre\b[^>]*class="[^"]*astro-code[^"]*"[^>]*data-language="([^"]*)"[^>]*>([\s\S]*?)<\/pre>/g,
        (_, lang, body) => {
            const rawCode = body
                .replace(/<[^>]+>/g, '')
                .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
                .trim();
            const idx = codeBlocks.length;
            codeBlocks.push({ lang, code: rawCode });
            return `<p>SHIKIFENCE${idx}SHIKIEND</p>`;
        },
    );

    if (hasShikiBlocks && codeBlocks.length === 0) {
        console.warn(`[html-to-md] ${sourceRef}: page has Shiki code blocks but none were extracted — check that pre.astro-code and data-language selectors still match the built HTML.`);
    }

    // ── Parse and extract content ────────────────────────────────────────────
    // Strip <meta charset> before passing to JSDOM to prevent double-encoding
    // of typographic characters (the charset tag can cause JSDOM to re-interpret
    // an already-decoded JS string, producing mojibake in innerHTML).
    const htmlForDom = htmlWithMarkers.replace(/<meta\b[^>]*charset[^>]*>/gi, '');
    const { window: { document } } = new JSDOM(htmlForDom);

    const content =
        document.querySelector('[data-pagefind-body]') ??
        document.querySelector('main.igd-main-content__markdown');
    if (!content) {
        console.warn(`[html-to-md] ${sourceRef}: no content element found — check that [data-pagefind-body] or main.igd-main-content__markdown exists in the built HTML (layout may have changed).`);
        return '';
    }

    // Remove chrome inside <main> that isn't doc content.
    // These elements are part of the site UI, not the documentation prose.
    //
    // Note: we do NOT remove all [data-pagefind-ignore] elements — the rehype
    // plugin marks single-char inline <code> (like `%`) with that attribute to
    // prevent noisy pagefind matches, but those tokens are meaningful content
    // that must appear in the LLM Markdown output.  Only block-level pagefind-
    // ignored regions (nav, div) are true chrome worth stripping.
    for (const el of content.querySelectorAll([
        'svg',                                // decorative page logo
        'igc-badge',                          // license / open-source badge
        'div[data-pagefind-ignore]',          // pagefind-excluded block regions
        'nav[data-pagefind-ignore]',          // pagefind-excluded nav regions
        'section[data-pagefind-ignore]',      // pagefind-excluded section regions
        '.igd-aside__icon',                   // DocsAside decorative icon
        '.igd-aside__title',                  // DocsAside visible label (we use aria-label instead)
        '.igd-anchor-link',                   // heading anchor-link buttons (§ links)
    ].join(','))) el.remove();

    // ── Convert ──────────────────────────────────────────────────────────────
    let md: string = td.turndown(content.innerHTML);

    // Normalize typographic punctuation to plain ASCII (curly quotes, dashes,
    // NBSP, etc.) while preserving all non-Latin scripts (Japanese, Korean).
    // Applied BEFORE restoring code blocks so code content is never touched.
    md = normalizeTypography(md);

    // Restore fenced code blocks (raw code from HTML, never transliterated).
    // Use a fence longer than any backtick run inside the code so nested
    // Markdown examples (which themselves contain ```) produce valid output.
    md = md.replace(/SHIKIFENCE(\d+)SHIKIEND/g, (_, i) => {
        const { lang, code } = codeBlocks[Number(i)];
        const longest = code.match(/`{3,}/g)?.reduce((a, b) => a.length >= b.length ? a : b, '') ?? '';
        const fence = '`'.repeat(Math.max(3, longest.length + 1));
        return `${fence}${lang}\n${code}\n${fence}`;
    });

    // ── Link post-processing ────────────────────────────────────────────────
    // Absolutize root-relative links so LLMs can follow them, and append .md
    // to internal doc links so they resolve to the LLM-friendly Markdown files
    // rather than the HTML pages meant for human readers.
    let origin = '';
    let basePath = '';
    try {
        const u = new URL(siteUrl);
        origin = u.origin;
        basePath = u.pathname.replace(/\/$/, '');
    } catch { /* no-op */ }
    if (origin) {
        md = md.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_, label, p) => {
            // Split off query string and fragment before checking the path.
            const qIdx    = p.indexOf('?');
            const hIdx    = p.indexOf('#');
            const suffIdx = qIdx >= 0 ? qIdx : hIdx;           // first of ? or #
            const pathPart = suffIdx >= 0 ? p.slice(0, suffIdx) : p;
            const suffix   = suffIdx >= 0 ? p.slice(suffIdx) : '';
            // Boundary check: path must equal basePath or continue with '/'.
            const isInternal = basePath && (pathPart === basePath || pathPart.startsWith(basePath + '/'));
            const hasExt     = /\.[a-z]{2,5}$/i.test(pathPart);
            // Strip trailing slash before appending .md to avoid "foo/.md".
            const cleanPath  = pathPart.replace(/\/$/, '');
            const finalPath  = isInternal && !hasExt ? `${cleanPath}.md${suffix}` : p;
            return `[${label}](${origin}${finalPath})`;
        });
    }

    return md.trim() + '\n';
}

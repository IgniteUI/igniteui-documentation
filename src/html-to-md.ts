/**
 * html-to-md.ts
 *
 * Converts a built Astro HTML page to clean Markdown suitable for LLM consumption.
 *
 * Entry points:
 *   buildHtmlToMdConverter() — create once per build, share across pages
 *   htmlPageToMd(path, siteUrl, converter) — convert a single page
 */

import fsp from 'node:fs/promises';
import { JSDOM } from 'jsdom';
// @ts-expect-error — no bundled types; works correctly at runtime via ESM build
import TurndownService from 'turndown';
// @ts-expect-error — no bundled types
import { tables as gfmTables } from 'turndown-plugin-gfm';

/** Build a configured TurndownService instance. Create once per build, reuse per page. */
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

    // Drop noise elements entirely
    td.remove(['script', 'style', 'igc-icon']);

    // Remove breadcrumb nav only — the API references nav must survive
    td.addRule('breadcrumb', {
        filter: (node: Element) => node.nodeName === 'NAV' && (node.getAttribute('class') || '').includes('docs-breadcrumb'),
        replacement: () => '',
    });

    // DocsAside callout → GFM blockquote with bold severity label.
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

    // Sample iframes → "[title](url)" link so seams read "And the result is: [Example](url)"
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

    // Decorative half-dividers → drop
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
): Promise<string> {
    let html: string;
    try { html = await fsp.readFile(htmlPath, 'utf-8'); }
    catch { return ''; }

    // ── Selector guard ───────────────────────────────────────────────────────
    // Warn at the first page that has Shiki blocks but the extractor finds none.
    // A theme rename (pre.astro-code → something else) would otherwise silently
    // produce empty code sections across the entire corpus.
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
        console.warn(`[html-to-md] ${htmlPath}: page contains Shiki blocks but none were extracted — check that pre.astro-code and data-language selectors still match the built HTML.`);
    }

    // ── Parse and extract content ────────────────────────────────────────────
    const { window: { document } } = new JSDOM(htmlWithMarkers);

    const content =
        document.querySelector('[data-pagefind-body]') ??
        document.querySelector('main.igd-main-content__markdown');
    if (!content) return '';

    // Remove chrome inside <main> that isn't doc content
    for (const el of content.querySelectorAll([
        'svg',                    // page logo
        'igc-badge',              // license/open-source badge
        '[data-pagefind-ignore]', // pagefind-excluded regions
        '.igd-aside__icon',       // DocsAside decorative icon
        '.igd-aside__title',      // DocsAside visible label (we use aria-label)
    ].join(','))) el.remove();

    // ── Convert ──────────────────────────────────────────────────────────────
    // JSDOM serialises some Unicode characters as HTML entities in innerHTML
    // (e.g. U+2014 EM DASH → &#x2014;). Turndown in Node.js doesn't decode
    // named/numeric entities before writing, so they'd end up as literal text.
    // Decode them here so the markdown output stays clean UTF-8.
    const rawInner = content.innerHTML
        .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
        .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
        .replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’')
        .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
        .replace(/&hellip;/g, '…').replace(/&amp;/g, '&');
    let md: string = td.turndown(rawInner);

    // Restore fenced code blocks
    md = md.replace(/SHIKIFENCE(\d+)SHIKIEND/g, (_, i) => {
        const { lang, code } = codeBlocks[Number(i)];
        return `\`\`\`${lang}\n${code}\n\`\`\``;
    });

    // Absolutize root-relative links and add .md extension to internal doc links.
    // Use origin only — rendered HTML links already include the full path from
    // root, so joining against the full site URL would double the base path.
    let origin = '';
    let basePath = '';
    try {
        const u = new URL(siteUrl);
        origin = u.origin;
        basePath = u.pathname.replace(/\/$/, '');
    } catch { /* no-op */ }
    if (origin) {
        md = md.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_, label, p) => {
            // Split off anchor fragment before deciding whether to add .md
            const hashIdx = p.indexOf('#');
            const pathPart = hashIdx >= 0 ? p.slice(0, hashIdx) : p;
            const anchor = hashIdx >= 0 ? p.slice(hashIdx) : '';
            // Add .md for internal doc pages: same base path, no existing extension
            const isInternal = basePath && pathPart.startsWith(basePath);
            const hasExt = /\.[a-z]{2,5}$/i.test(pathPart);
            const finalPath = isInternal && !hasExt ? `${pathPart}.md${anchor}` : p;
            return `[${label}](${origin}${finalPath})`;
        });
    }

    return md.trim() + '\n';
}

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { buildHtmlToMdConverter, htmlPageToMd } from './html-to-md.ts';

const fixture = (name: string): string =>
    path.join(fileURLToPath(new URL('../test/fixtures/html-to-md/', import.meta.url)), name);

const PAGE = fixture('page.html');
const SITE_URL = 'https://example.test/docs/';

describe('buildHtmlToMdConverter', () => {
    const td = buildHtmlToMdConverter();

    it('writes headings in ATX style', () => {
        expect(td.turndown('<h2>Options</h2>')).toBe('## Options');
    });

    it('converts a table to GFM pipe syntax', () => {
        const md: string = td.turndown(
            '<table><thead><tr><th>Name</th><th>Type</th></tr></thead>' +
            '<tbody><tr><td>data</td><td>Array</td></tr></tbody></table>',
        );

        expect(md).toContain('| Name | Type |');
        expect(md).toContain('| data | Array |');
    });

    it('writes code blocks as fenced blocks carrying the language', () => {
        const md: string = td.turndown('<pre><code class="language-typescript">const a = 1;</code></pre>');

        expect(md).toBe('```typescript\nconst a = 1;\n```');
    });

    it('uses a dash as the bullet list marker', () => {
        expect(td.turndown('<ul><li>Sorting</li><li>Filtering</li></ul>')).toBe('-   Sorting\n-   Filtering');
    });

    it('drops scripts, styles and decorative icons', () => {
        const md: string = td.turndown(
            '<p>Text</p><script>a()</script><style>p{}</style>' +
            '<igc-icon name="info"></igc-icon><igc-icon-button></igc-icon-button><igc-divider></igc-divider>',
        );

        expect(md).toBe('Text');
    });

    it('removes the breadcrumb nav', () => {
        const md: string = td.turndown('<nav class="docs-breadcrumb"><a href="/a">A</a></nav><p>Body</p>');

        expect(md).toBe('Body');
    });

    it('turns a DocsAside into a blockquote labelled from aria-label', () => {
        const md: string = td.turndown('<div class="igd-aside" aria-label="Warning"><p>Careful.</p></div>');

        expect(md).toBe('> **Warning:**\n> Careful.');
    });

    it('turns a sample iframe into a titled link', () => {
        const md: string = td.turndown(
            '<div class="igd-sample-container"><iframe data-src="https://example.test/s/1" title="Grid Example"></iframe></div>',
        );

        expect(md).toBe('[Grid Example](https://example.test/s/1)');
    });
});

describe('htmlPageToMd', () => {
    const convert = (url = SITE_URL) => htmlPageToMd(PAGE, url, buildHtmlToMdConverter());

    it('returns an empty string when the file does not exist', async () => {
        expect(await htmlPageToMd(fixture('missing.html'), SITE_URL, buildHtmlToMdConverter())).toBe('');
    });

    it('returns an empty string when the page has no content element', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
            expect(await htmlPageToMd(fixture('no-content.html'), SITE_URL, buildHtmlToMdConverter())).toBe('');
            expect(warn).toHaveBeenCalledOnce();
        } finally {
            warn.mockRestore();
        }
    });

    it('keeps the fenced code block with its language and unhighlighted source', async () => {
        const md = await convert();

        expect(md).toContain('```typescript\nconst grid = new Grid();\ngrid.data = [];\n```');
    });

    it('strips navigation chrome from the page', async () => {
        const md = await convert();

        expect(md).not.toContain('Home');
        expect(md).not.toContain('docs-breadcrumb');
        expect(md).not.toContain('Footer chrome');
        expect(md).not.toContain('Premium');
    });

    it('normalises typographic characters to ASCII', async () => {
        const md = await convert();

        expect(md).toContain('"smart" quotes');
        expect(md).toContain('an ellipsis...');
        expect(md).toContain('Ignite UI(TM)');
        expect(md).not.toMatch(/[‘’“”…™]/);
    });

    it('absolutizes internal links and appends .md, keeping query and fragment', async () => {
        const md = await convert();

        expect(md).toContain('(https://example.test/docs/grids/data-grid/editing.md)');
        expect(md).toContain('(https://example.test/docs/grids/data-grid/editing.md?tab=api#cells)');
    });

    it('leaves a link that already has a file extension alone', async () => {
        const md = await convert();

        expect(md).toContain('(https://example.test/docs/assets/sheet.pdf)');
    });

    it('leaves external links untouched', async () => {
        const md = await convert();

        expect(md).toContain('(https://example.test/external)');
        expect(md).not.toContain('external.md');
    });

    it('leaves links alone when the site URL cannot be parsed', async () => {
        const md = await convert('not a url');

        expect(md).toContain('(/docs/grids/data-grid/editing)');
    });

    it('renders the aside as a blockquote without its decorative icon or title', async () => {
        const md = await convert();

        expect(md).toContain('> **Note:**');
        expect(md).toContain('> Virtualization is on by default.');
    });

    it('ends with exactly one trailing newline', async () => {
        const md = await convert();

        expect(md.endsWith('\n')).toBe(true);
        expect(md.endsWith('\n\n')).toBe(false);
    });

    it('matches the recorded Markdown for the fixture page', async () => {
        await expect(await convert()).toMatchFileSnapshot('./__snapshots__/html-page.md');
    });
});

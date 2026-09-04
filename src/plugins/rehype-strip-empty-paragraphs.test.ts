import { markdownToHtml } from 'satteri';
import { describe, expect, it } from 'vitest';
import { rehypeStripEmptyParagraphs } from './rehype-strip-empty-paragraphs.ts';

/** Compiles `source` through the plugin under test. */
async function render(source: string): Promise<string> {
    const { html } = await markdownToHtml(source, { hastPlugins: [rehypeStripEmptyParagraphs] });
    return html;
}

/** The same source without the plugin, to show what the plugin actually changed. */
async function renderPlain(source: string): Promise<string> {
    const { html } = await markdownToHtml(source);
    return html;
}

// A paragraph holding a single non-breaking space is the shape the plugin
// targets: its only child is a text node that trims to nothing.
const BLANK_PARAGRAPH = 'Before.\n\n&nbsp;\n\nAfter.';
const NBSP = '\u00A0';

describe('rehypeStripEmptyParagraphs', () => {
    it('removes a paragraph whose only child is whitespace', async () => {
        expect(await renderPlain(BLANK_PARAGRAPH)).toContain(`<p>${NBSP}</p>`);
        expect(await render(BLANK_PARAGRAPH)).not.toContain(`<p>${NBSP}</p>`);
    });

    it('keeps the paragraphs around the removed one', async () => {
        const html = await render(BLANK_PARAGRAPH);

        expect(html).toContain('<p>Before.</p>');
        expect(html).toContain('<p>After.</p>');
    });

    it('keeps a paragraph with text', async () => {
        expect(await render('Some prose.')).toContain('<p>Some prose.</p>');
    });

    it('keeps a paragraph that is only an inline element', async () => {
        expect(await render('<span>x</span>')).toContain('<p><span>x</span></p>');
    });

    it('keeps a paragraph that mixes whitespace with an inline element', async () => {
        expect(await render('&nbsp;<em>x</em>&nbsp;')).toContain('<em>x</em>');
    });

    it('keeps a paragraph holding only a link', async () => {
        expect(await render('[Grid](/grids)')).toContain('<p><a href="/grids">Grid</a></p>');
    });

    it('leaves other empty elements alone', async () => {
        expect(await render('<div></div>')).toContain('<div></div>');
    });

    it('removes every blank paragraph in the document', async () => {
        const html = await render('A\n\n&nbsp;\n\nB\n\n&nbsp;\n\nC');

        expect(html).not.toContain(NBSP);
        expect(html).toContain('<p>A</p>');
        expect(html).toContain('<p>C</p>');
    });
});

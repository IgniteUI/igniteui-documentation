import { markdownToHtml } from 'satteri';
import { describe, expect, it } from 'vitest';
import { remarkHtmlTransforms } from './remark-html-transforms.ts';

/** Compiles `source` through the plugin under test. */
async function render(source: string): Promise<string> {
    const { html } = await markdownToHtml(source, { mdastPlugins: [remarkHtmlTransforms] });
    return html;
}

describe('remarkHtmlTransforms', () => {
    it('rewrites a relative images src in inline HTML to a root-relative path', async () => {
        const html = await render('<img src="../../images/grid.png" alt="Grid">');

        expect(html).toContain('src="/images/grid.png"');
        expect(html).not.toContain('../');
    });

    it('rewrites a single-level relative images src', async () => {
        expect(await render('<img src="../images/grid.png">')).toContain('src="/images/grid.png"');
    });

    it('leaves an images src that is already root-relative alone', async () => {
        expect(await render('<img src="/images/grid.png">')).toContain('src="/images/grid.png"');
    });

    it('leaves a relative src that is not under images alone', async () => {
        expect(await render('<img src="../assets/grid.png">')).toContain('src="../assets/grid.png"');
    });

    it('rewrites every relative images src in one HTML block', async () => {
        const html = await render('<p><img src="../images/a.png"><img src="../../images/b.png"></p>');

        expect(html).toContain('src="/images/a.png"');
        expect(html).toContain('src="/images/b.png"');
    });

    it('lower-cases a code fence language', async () => {
        expect(await render('```TypeScript\nconst a = 1;\n```')).toContain('class="language-typescript"');
    });

    it('leaves an already lower-case language untouched', async () => {
        expect(await render('```typescript\nconst a = 1;\n```')).toContain('class="language-typescript"');
    });

    it('leaves a fence without a language alone', async () => {
        const html = await render('```\nplain\n```');

        expect(html).toContain('<code>');
        expect(html).not.toContain('class="language-');
    });
});

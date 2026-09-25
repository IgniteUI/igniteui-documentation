import { markdownToHtml } from 'satteri';
import { describe, expect, it } from 'vitest';
import { rehypeApiReferencesGrid } from './rehype-api-references-grid.ts';

/** Compiles `source` through the plugin under test. */
async function render(source: string): Promise<string> {
    const { html } = await markdownToHtml(source, { hastPlugins: [rehypeApiReferencesGrid] });
    return html;
}

/** Contents of the generated grid nav, or `''` when the plugin did not wrap anything. */
function nav(html: string): string {
    return /<nav class="idg-api-references">([\s\S]*?)<\/nav>/.exec(html)?.[1] ?? '';
}

// The two trailing spaces are Markdown hard breaks — they become the `<br>`
// separators the plugin strips while collecting the grid items.
const API_SECTION = [
    '## API References',
    '',
    '[IgxGrid](/api/grid)  ',
    '[IgxColumn](/api/column)',
    '',
    '[IgxRow](/api/row)',
].join('\n');

describe('rehypeApiReferencesGrid', () => {
    it('wraps the whole section in a grid nav', async () => {
        const items = nav(await render(API_SECTION));

        expect(items).toContain('<a href="/api/grid">IgxGrid</a>');
        expect(items).toContain('<a href="/api/column">IgxColumn</a>');
        expect(items).toContain('<a href="/api/row">IgxRow</a>');
    });

    it('drops the line-break separators', async () => {
        expect(await render(API_SECTION)).not.toContain('<br>');
    });

    it('unwraps the paragraphs so the links become direct grid items', async () => {
        expect(nav(await render(API_SECTION))).not.toContain('<p>');
    });

    it('leaves the heading itself in place', async () => {
        expect(await render(API_SECTION)).toContain('API References</h2>');
    });

    it('stops collecting at the next heading', async () => {
        const html = await render([API_SECTION, '', '## Additional Resources', '', '[Grid guide](/guides/grid)'].join('\n'));

        expect(nav(html)).toContain('IgxRow');
        expect(nav(html)).not.toContain('Grid guide');
        expect(html).toContain('<a href="/guides/grid">Grid guide</a>');
    });

    it('leaves a different h2 alone', async () => {
        const html = await render('## Usage\n\n[IgxGrid](/api/grid)');

        expect(html).not.toContain('idg-api-references');
        expect(html).toContain('<a href="/api/grid">IgxGrid</a>');
    });

    it('leaves the heading untouched when the section is empty', async () => {
        const html = await render('## API References\n\n## Usage\n\nProse.');

        expect(html).not.toContain('idg-api-references');
        expect(html).toContain('API References</h2>');
    });

    it('does not move content that precedes the heading', async () => {
        const html = await render(`Intro prose.\n\n${API_SECTION}`);

        expect(nav(html)).not.toContain('Intro prose.');
        expect(html).toContain('<p>Intro prose.</p>');
    });

    it('ignores a heading that only contains the phrase', async () => {
        expect(await render('## More API References\n\n[IgxGrid](/api/grid)')).not.toContain('idg-api-references');
    });

    it('removes the original nodes so each link appears once', async () => {
        const html = await render(API_SECTION);

        expect(html.split('<a href="/api/grid">').length - 1).toBe(1);
    });
});

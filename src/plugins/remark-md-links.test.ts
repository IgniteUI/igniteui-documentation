import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { markdownToHtml } from 'satteri';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let tmp: string;
/** The document being compiled: `<root>/components/data-grid.mdx`. */
let docURL: URL;

beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'md-links-'));
    fs.mkdirSync(path.join(tmp, 'components'), { recursive: true });
    const file = path.join(tmp, 'components', 'data-grid.mdx');
    fs.writeFileSync(file, '# Data Grid\n');
    docURL = pathToFileURL(file);
    vi.stubEnv('DOCS_SOURCE_PATHS', '');
    vi.stubEnv('DOCS_SOURCE_PATH', tmp);
    vi.stubEnv('DOCS_BASE', '');
    vi.stubEnv('DOCS_TRAILING_SLASH', 'never');
});

afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(tmp, { recursive: true, force: true });
});

/** Compiles `source` with a freshly loaded plugin and returns the rendered HTML. */
async function render(source: string): Promise<string> {
    vi.resetModules();
    const { remarkMdLinks } = await import('./remark-md-links.ts');
    const { html } = await markdownToHtml(source, { mdastPlugins: [remarkMdLinks], fileURL: docURL });
    return html;
}

/** Rewrites a single link and returns its final href. */
async function href(url: string): Promise<string> {
    const html = await render(`[label](${url})`);
    return /href="([^"]*)"/.exec(html)?.[1] ?? '';
}

describe('remarkMdLinks', () => {
    it('rewrites a sibling .mdx link to a root-relative URL', async () => {
        expect(await href('./editing.mdx')).toBe('/components/editing');
    });

    it('rewrites a .mdx link without a leading ./', async () => {
        expect(await href('editing.mdx')).toBe('/components/editing');
    });

    it('keeps the fragment of a parent-relative link', async () => {
        expect(await href('../general/getting-started.mdx#install')).toBe('/general/getting-started#install');
    });

    it('keeps the query string', async () => {
        expect(await href('./editing.mdx?tab=api')).toBe('/components/editing?tab=api');
    });

    it('collapses an index.mdx link to its folder', async () => {
        expect(await href('./themes/index.mdx')).toBe('/components/themes');
    });

    it('lower-cases the slug', async () => {
        expect(await href('./Cell-Editing.mdx')).toBe('/components/cell-editing');
    });

    it('prepends DOCS_BASE to a rewritten link', async () => {
        vi.stubEnv('DOCS_BASE', '/products/grids/');
        expect(await href('./editing.mdx')).toBe('/products/grids/components/editing');
    });

    it('prepends DOCS_BASE to a bare root-relative link', async () => {
        vi.stubEnv('DOCS_BASE', '/products/grids');
        expect(await href('/general/getting-started')).toBe('/products/grids/general/getting-started');
    });

    it('does not prepend DOCS_BASE twice', async () => {
        vi.stubEnv('DOCS_BASE', '/products/grids');
        expect(await href('/products/grids/general')).toBe('/products/grids/general');
    });

    it('appends a trailing slash unless DOCS_TRAILING_SLASH is never', async () => {
        vi.stubEnv('DOCS_TRAILING_SLASH', 'always');
        expect(await href('./editing.mdx')).toBe('/components/editing/');
    });

    it('appends a trailing slash when DOCS_TRAILING_SLASH is unset', async () => {
        vi.stubEnv('DOCS_TRAILING_SLASH', '');
        expect(await href('./editing.mdx')).toBe('/components/editing/');
    });

    it.each([
        ['https://example.test/page', 'an https URL'],
        ['http://example.test/page', 'an http URL'],
        ['/general/getting-started', 'a root-relative path'],
        ['#section', 'a bare fragment'],
        ['mailto:support@example.test', 'a mailto link'],
        ['./notes.txt', 'a relative non-mdx link'],
        ['./sibling', 'a relative extension-less link'],
    ])('leaves %s unchanged (%s)', async url => {
        expect(await href(url)).toBe(url);
    });

    it('resolves the slug against the root the file itself lives in', async () => {
        const overlay = path.join(tmp, '..', path.basename(tmp) + '-overlay');
        fs.mkdirSync(path.join(overlay, 'components'), { recursive: true });
        const file = path.join(overlay, 'components', 'generated.mdx');
        fs.writeFileSync(file, '# Generated\n');
        docURL = pathToFileURL(file);
        vi.stubEnv('DOCS_SOURCE_PATHS', JSON.stringify([overlay, tmp]));

        try {
            // `tmp` is the first entry of DOCS_SOURCE_PATH but the file lives in
            // the overlay, so the slug is computed against the overlay root.
            expect(await href('./editing.mdx')).toBe('/components/editing');
        } finally {
            fs.rmSync(overlay, { recursive: true, force: true });
        }
    });

    it('rewrites a relative images path on an image node', async () => {
        const html = await render('![Grid](../../images/grid.png)');
        expect(html).toContain('src="/images/grid.png"');
    });

    it('leaves an absolute image path alone', async () => {
        const html = await render('![Grid](/images/grid.png)');
        expect(html).toContain('src="/images/grid.png"');
    });
});

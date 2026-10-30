import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    buildLlmsMetaMap,
    buildLlmsTxt,
    collectSlugs,
    extractLlmsMeta,
    getBroadSectionsForPlatform,
    IGDOCS_BROAD_SECTIONS,
    toUrlSlug,
    type LlmsMeta,
} from './llms.ts';
import type { SidebarEntry } from './lib/sidebar/types';

let tmp: string;

beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'llms-'));
});

afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
});

function writeDoc(relPath: string, contents: string): void {
    const file = path.join(tmp, relPath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
}

/** A three-level sidebar reused by the walk-based helpers. */
const sidebar = (): SidebarEntry[] => [
    {
        label: 'Grids & Lists',
        collapsed: false,
        items: [
            { label: 'Overview', slug: 'grids' },
            {
                label: 'Data Grid',
                collapsed: true,
                items: [
                    { label: 'Overview', slug: 'grids/data-grid' },
                    { label: 'Cell Editing', slug: 'grids/data-grid/editing' },
                ],
            },
        ],
    },
    {
        label: 'General',
        collapsed: false,
        items: [{ label: 'Getting Started', slug: 'general/getting-started' }],
    },
];

describe('extractLlmsMeta', () => {
    it('reads the description and keywords from the llms block', () => {
        const meta = extractLlmsMeta([
            '---',
            'title: Grid',
            'llms:',
            '  description: The data grid.',
            '  keywords:',
            '    - grid',
            '    - table',
            '---',
            'body',
        ].join('\n'));

        expect(meta).toEqual({ description: 'The data grid.', keywords: ['grid', 'table'] });
    });

    it('falls back to the flat llmsdescription field', () => {
        const meta = extractLlmsMeta('---\ntitle: Grid\nllmsdescription: Flat form.\n---\n');
        expect(meta).toEqual({ description: 'Flat form.' });
    });

    it('falls back to the plain description when no llms block is present', () => {
        const meta = extractLlmsMeta('---\ntitle: Grid\ndescription: Plain description.\n---\n');
        expect(meta).toEqual({ description: 'Plain description.' });
    });

    it('prefers the llms description over the plain one', () => {
        const meta = extractLlmsMeta([
            '---',
            'description: Plain.',
            'llmsdescription: Flat.',
            'llms:',
            '  description: Nested.',
            '---',
        ].join('\n'));

        expect(meta.description).toBe('Nested.');
    });

    it('ignores a null description', () => {
        expect(extractLlmsMeta('---\ntitle: Grid\ndescription: null\n---\n')).toEqual({});
    });

    it('wraps a single string keyword into an array', () => {
        expect(extractLlmsMeta('---\nllmskeywords: grid\n---\n')).toEqual({ keywords: ['grid'] });
    });

    it('ignores keywords that are neither a string nor an array', () => {
        expect(extractLlmsMeta('---\nllmskeywords: 42\n---\n')).toEqual({});
    });

    it('returns an empty object for a document without frontmatter', () => {
        expect(extractLlmsMeta('# Just a heading\n')).toEqual({});
    });

    it('drops an empty keyword list', () => {
        expect(extractLlmsMeta('---\ndescription: Grid.\nllmskeywords: []\n---\n')).toEqual({
            description: 'Grid.',
        });
    });
});

describe('collectSlugs', () => {
    it('returns every link slug in tree order', () => {
        expect(collectSlugs(sidebar())).toEqual([
            'grids',
            'grids/data-grid',
            'grids/data-grid/editing',
            'general/getting-started',
        ]);
    });

    it('returns an empty array for an empty tree', () => {
        expect(collectSlugs([])).toEqual([]);
    });
});

describe('buildLlmsMetaMap', () => {
    it('reads metadata for the slugs that have a source file', () => {
        writeDoc('grids.mdx', '---\ntitle: Grids\ndescription: All grids.\n---\n');
        writeDoc('grids/data-grid/index.md', '---\ntitle: Data Grid\nllmsdescription: The grid.\n---\n');

        const map = buildLlmsMetaMap(tmp, sidebar());

        expect([...map.keys()]).toEqual(['grids', 'grids/data-grid']);
        expect(map.get('grids')).toEqual({ description: 'All grids.' });
        expect(map.get('grids/data-grid')).toEqual({ description: 'The grid.' });
    });

    it('skips a slug whose file has no llms metadata', () => {
        writeDoc('grids.mdx', '---\ntitle: Grids\n---\n');
        expect(buildLlmsMetaMap(tmp, sidebar()).size).toBe(0);
    });

    it('reads the root index file for the empty slug', () => {
        writeDoc('index.mdx', '---\ntitle: Home\ndescription: The home page.\n---\n');

        const map = buildLlmsMetaMap(tmp, [{ label: 'Home', slug: '' }]);
        expect(map.get('')).toEqual({ description: 'The home page.' });
    });

    it('takes metadata from the highest-precedence root', () => {
        const overlay = path.join(tmp, 'overlay');
        const base = path.join(tmp, 'base');
        fs.mkdirSync(overlay, { recursive: true });
        fs.mkdirSync(base, { recursive: true });
        fs.writeFileSync(path.join(overlay, 'grids.mdx'), '---\ndescription: Overlay.\n---\n');
        fs.writeFileSync(path.join(base, 'grids.mdx'), '---\ndescription: Base.\n---\n');

        const map = buildLlmsMetaMap([overlay, base], [{ label: 'Grids', slug: 'grids' }]);
        expect(map.get('grids')).toEqual({ description: 'Overlay.' });
    });
});

describe('toUrlSlug', () => {
    it('lower-cases and hyphenates a plain label', () => {
        expect(toUrlSlug('React Grids')).toBe('react-grids');
    });

    it('collapses runs of punctuation into a single hyphen', () => {
        expect(toUrlSlug('Grids & Lists')).toBe('grids-lists');
    });

    it('strips a leading hyphen produced by leading punctuation', () => {
        expect(toUrlSlug('  React')).toBe('react');
    });

    it('keeps digits', () => {
        expect(toUrlSlug('Chart 3D')).toBe('chart-3d');
    });

    // Current behaviour: the trailing-hyphen strip is not global, so only the
    // first of a leading/trailing pair is removed.
    it('leaves a trailing hyphen when the label both starts and ends with punctuation', () => {
        expect(toUrlSlug('  React Grids  ')).toBe('react-grids-');
    });

    it.todo('should strip both the leading and the trailing hyphen (the replace lacks the /g flag)');
});

describe('getBroadSectionsForPlatform', () => {
    it.each(['angular', 'react', 'blazor', 'web-components'])(
        'returns the full broad-section set for %s',
        platform => {
            const sections = getBroadSectionsForPlatform(platform);
            expect(sections.size).toBe(IGDOCS_BROAD_SECTIONS.length);
            expect(sections.has('Grids & Lists')).toBe(true);
        },
    );

    it('returns an empty set for null', () => {
        expect(getBroadSectionsForPlatform(null).size).toBe(0);
    });

    it('returns an empty set for a platform with no broad sections', () => {
        expect(getBroadSectionsForPlatform('appbuilder').size).toBe(0);
    });
});

describe('buildLlmsTxt', () => {
    const metaMap = (): Map<string, LlmsMeta> => new Map<string, LlmsMeta>([
        ['grids', { description: 'Every grid component.', keywords: ['grid', 'table'] }],
        ['grids/data-grid/editing', { description: 'Editing cells in the grid.' }],
    ]);

    it('opens with the title and the site description blockquote', () => {
        const txt = buildLlmsTxt('/docs', 'Ignite UI', 'Docs for Ignite UI.', sidebar(), metaMap());

        expect(txt.startsWith('# Ignite UI\n\n> Docs for Ignite UI.\n')).toBe(true);
    });

    it('uses the localized description when one is given', () => {
        const txt = buildLlmsTxt('/docs', 'Ignite UI', 'English.', [], new Map(), [], new Set(), 'jp', '日本語。');

        expect(txt).toContain('> 日本語。');
        expect(txt).toContain('## ドキュメント セット');
    });

    it('emits a page line with the .md URL and the description', () => {
        const txt = buildLlmsTxt('/docs', 'Ignite UI', 'Docs.', sidebar(), metaMap());

        expect(txt).toContain('- [Grids & Lists Overview](/docs/grids.md): Every grid component.');
        expect(txt).toContain('  Tags: grid, table');
    });

    it('emits a section heading for each group', () => {
        const txt = buildLlmsTxt('/docs', 'Ignite UI', 'Docs.', sidebar(), metaMap());

        expect(txt).toContain('## Grids & Lists');
        expect(txt).toContain('### Data Grid');
    });

    it('adds the API reference link only when an API docs URL is given', () => {
        const withApi = buildLlmsTxt('/docs', 'T', 'D', [], new Map(), [], new Set(), 'en', undefined, 'https://x/api/llms.txt');
        const without = buildLlmsTxt('/docs', 'T', 'D', [], new Map());

        expect(withApi).toContain('- [API Reference](https://x/api/llms.txt): Full TypeDoc');
        expect(without).not.toContain('API Reference');
    });

    it('lists each documentation set with its own .txt URL', () => {
        const txt = buildLlmsTxt('/docs', 'T', 'D', [], new Map(), [
            { label: 'React Grids', paths: ['grids/**'], description: 'Grid docs only.' },
            { label: 'Charts', paths: ['charts/**'] },
        ]);

        expect(txt).toContain('- [React Grids](/docs/_llms-txt/react-grids.txt): Grid docs only.');
        expect(txt).toContain('- [Charts](/docs/_llms-txt/charts.txt)');
    });

    it('does not prefix a label whose ancestor is a broad section', () => {
        const txt = buildLlmsTxt(
            '/docs',
            'T',
            'D',
            sidebar(),
            metaMap(),
            [],
            getBroadSectionsForPlatform('angular'),
        );

        // "Grids & Lists" is a navigation bucket, so the Overview page under it
        // keeps its bare label instead of inheriting a prefix.
        expect(txt).toContain('- [Overview](/docs/grids.md)');
    });

    it('matches the recorded manifest for a small sidebar', async () => {
        const txt = buildLlmsTxt(
            '/docs',
            'Ignite UI',
            'Docs for Ignite UI.',
            sidebar(),
            metaMap(),
            [{ label: 'React Grids', paths: ['grids/**'], description: 'Grid docs only.' }],
            new Set(),
            'en',
            undefined,
            'https://example.test/api/angular/llms.txt',
        );

        await expect(txt).toMatchFileSnapshot('./__snapshots__/llms-txt.txt');
    });
});

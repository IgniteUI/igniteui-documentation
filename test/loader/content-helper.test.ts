/**
 * Drives the real Astro glob loader through `createDocsCollection` against a
 * fake in-memory store, so the multi-root overlay behaviour is exercised
 * end-to-end without booting Astro.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createFakeContext } from './fake-astro-context.ts';

type CreateDocsCollection = typeof import('../../src/content-helper.ts')['createDocsCollection'];

let tmp: string;
let overlay: string;
let base: string;
let createDocsCollection: CreateDocsCollection;

/** Writes `<root>/<relPath>` with a title-only frontmatter block. */
function write(root: string, relPath: string, title: string): string {
    const file = path.join(root, relPath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `---\ntitle: ${title}\n---\nbody of ${title}\n`);
    return file;
}

/** The overlay/base pair every case starts from. */
function seed(): void {
    write(overlay, 'a.mdx', 'A-overlay');
    write(base, 'a.mdx', 'A-base');
    write(base, 'b.mdx', 'B-base');
    write(overlay, 'changelog/c.mdx', 'C-overlay-excluded');
    write(base, 'changelog/c.mdx', 'C-base');
    write(overlay, 'd.mdx', 'D-overlay');
    write(base, 'd.md', 'D-base-md');
}

/** The two-root collection under test: overlay first, base second. */
function overlayCollection() {
    return createDocsCollection([{ dir: overlay, exclude: ['changelog/**'] }, base]);
}

beforeEach(async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'overlay-'));
    overlay = path.join(tmp, 'overlay');
    base = path.join(tmp, 'base');
    fs.mkdirSync(overlay, { recursive: true });
    fs.mkdirSync(base, { recursive: true });

    // The module builds its zero-config `collections` export at import time and
    // throws when no root is configured, so a source path must exist first.
    vi.stubEnv('DOCS_SOURCE_PATHS', undefined);
    vi.stubEnv('DOCS_SOURCE_PATH', base);
    vi.resetModules();
    ({ createDocsCollection } = await import('../../src/content-helper.ts'));
});

afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(tmp, { recursive: true, force: true });
});

describe('createDocsCollection construction', () => {
    it('throws when it is given no roots at all', () => {
        expect(() => createDocsCollection([])).toThrow(/no source directory provided/);
    });

    it('uses the plain glob loader for a single root', () => {
        const collection = createDocsCollection(base) as { loader: { name: string } };

        expect(collection.loader.name).toBe('glob-loader');
    });

    it('uses the overlay loader for two roots', () => {
        expect((overlayCollection() as { loader: { name: string } }).loader.name).toBe('docs-overlay-loader');
    });

    it('falls back to DOCS_SOURCE_PATH when no root is passed', () => {
        expect((createDocsCollection() as { loader: { name: string } }).loader.name).toBe('glob-loader');
    });
});

describe('cold load', () => {
    beforeEach(() => seed());

    it('serves a shadowed slug from the overlay', async () => {
        const fake = createFakeContext(tmp);
        await overlayCollection().loader.load(fake.ctx);

        expect(fake.title('a')).toBe('A-overlay');
    });

    it('serves a slug only the base has from the base', async () => {
        const fake = createFakeContext(tmp);
        await overlayCollection().loader.load(fake.ctx);

        expect(fake.title('b')).toBe('B-base');
    });

    it('serves a subtree the overlay excludes from the base', async () => {
        const fake = createFakeContext(tmp);
        await overlayCollection().loader.load(fake.ctx);

        expect(fake.title('changelog/c')).toBe('C-base');
        expect(fake.filePathOf('changelog/c')).toBe('base/changelog/c.mdx');
    });

    it('applies the collection-wide exclude option to every root', async () => {
        write(overlay, 'internal/secret.mdx', 'Secret-overlay');
        write(base, 'internal/secret.mdx', 'Secret-base');
        const fake = createFakeContext(tmp);

        await createDocsCollection([overlay, base], { exclude: ['internal/**'] }).loader.load(fake.ctx);

        expect(fake.entries.has('internal/secret')).toBe(false);
    });

    it('skips underscore-prefixed files', async () => {
        write(overlay, '_draft.mdx', 'Draft');
        const fake = createFakeContext(tmp);

        await overlayCollection().loader.load(fake.ctx);

        expect(fake.entries.has('_draft')).toBe(false);
    });

    it('sweeps an entry whose frontmatter has no title', async () => {
        fs.writeFileSync(path.join(base, 'untitled.mdx'), '---\ndescription: no title here\n---\nbody\n');
        const fake = createFakeContext(tmp);

        await overlayCollection().loader.load(fake.ctx);

        expect(fake.entries.has('untitled')).toBe(false);
        expect(fake.entries.has('b')).toBe(true);
    });

    it('stores every file path relative to the project root', async () => {
        const fake = createFakeContext(tmp);
        await overlayCollection().loader.load(fake.ctx);

        for (const entry of fake.entries.values()) {
            expect(path.isAbsolute(entry.filePath ?? '')).toBe(false);
            expect(entry.filePath).toMatch(/^(overlay|base)\//);
        }
    });

    it('loads without a watcher', async () => {
        const fake = createFakeContext(tmp, { watcher: false });

        await overlayCollection().loader.load(fake.ctx);

        expect(fake.title('a')).toBe('A-overlay');
        expect(fake.handlers.size).toBe(0);
    });
});

describe('warm load', () => {
    beforeEach(() => seed());

    it('keeps the overlay winner and logs nothing on a second load', async () => {
        const fake = createFakeContext(tmp);
        const collection = overlayCollection();
        await collection.loader.load(fake.ctx);
        const countAfterFirst = fake.entries.size;
        fake.logs.length = 0;

        await collection.loader.load(fake.ctx);

        expect(fake.title('a')).toBe('A-overlay');
        expect(fake.entries.size).toBe(countAfterFirst);
        expect(fake.logs.filter(([level]) => level !== 'info')).toEqual([]);
    });

    it('hands a slug to the base once the overlay file is gone', async () => {
        const fake = createFakeContext(tmp);
        const collection = overlayCollection();
        await collection.loader.load(fake.ctx);

        fs.unlinkSync(path.join(overlay, 'a.mdx'));
        await collection.loader.load(fake.ctx);

        expect(fake.title('a')).toBe('A-base');
        expect(fake.filePathOf('a')).toBe('base/a.mdx');
    });
});

describe('watcher', () => {
    let fake: ReturnType<typeof createFakeContext>;

    beforeEach(async () => {
        seed();
        fake = createFakeContext(tmp);
        await overlayCollection().loader.load(fake.ctx);
    });

    it('registers add, change and unlink handlers for each root', () => {
        expect([...fake.handlers.values()].flat()).toHaveLength(6);
        expect(fake.handlers.get('add')).toHaveLength(2);
        expect(fake.handlers.get('change')).toHaveLength(2);
        expect(fake.handlers.get('unlink')).toHaveLength(2);
    });

    it('falls back to the base file when the winning overlay file is deleted', async () => {
        const file = path.join(overlay, 'a.mdx');
        fs.unlinkSync(file);
        await fake.trigger('unlink', file);

        expect(fake.title('a')).toBe('A-base');
        expect(fake.filePathOf('a')).toBe('base/a.mdx');
    });

    it('falls back from a deleted .mdx to the base .md of the same slug', async () => {
        const file = path.join(overlay, 'd.mdx');
        fs.unlinkSync(file);
        await fake.trigger('unlink', file);

        expect(fake.title('d')).toBe('D-base-md');
    });

    it('lets a newly added overlay file take a slug over', async () => {
        const file = write(overlay, 'b.mdx', 'B-overlay');
        await fake.trigger('add', file);

        expect(fake.title('b')).toBe('B-overlay');
    });

    it('leaves the winner in place when a shadowed base file is deleted', async () => {
        const added = write(overlay, 'b.mdx', 'B-overlay');
        await fake.trigger('add', added);

        const shadowed = path.join(base, 'b.mdx');
        fs.unlinkSync(shadowed);
        await fake.trigger('unlink', shadowed);

        expect(fake.title('b')).toBe('B-overlay');
    });

    it('removes the page when no root can serve it any more', async () => {
        const file = path.join(base, 'b.mdx');
        fs.unlinkSync(file);
        await fake.trigger('unlink', file);

        expect(fake.entries.has('b')).toBe(false);
    });

    it('reflects an edit to a base file that has become the winner', async () => {
        const overlayFile = path.join(overlay, 'a.mdx');
        fs.unlinkSync(overlayFile);
        await fake.trigger('unlink', overlayFile);

        const baseFile = write(base, 'a.mdx', 'A-base-edited');
        await fake.trigger('change', baseFile);

        expect(fake.title('a')).toBe('A-base-edited');
    });

    it('ignores the deletion of an excluded overlay file', async () => {
        const file = path.join(overlay, 'changelog', 'c.mdx');
        fs.unlinkSync(file);
        await fake.trigger('unlink', file);

        expect(fake.title('changelog/c')).toBe('C-base');
    });

    it('ignores the deletion of a file outside every root', async () => {
        const outside = write(tmp, 'stray.mdx', 'Stray');
        await fake.trigger('unlink', outside);

        expect(fake.title('a')).toBe('A-overlay');
        expect(fake.entries.has('stray')).toBe(false);
    });

    it('logs no warnings or errors while the watcher runs', async () => {
        fake.logs.length = 0;
        const file = path.join(overlay, 'a.mdx');
        fs.unlinkSync(file);
        await fake.trigger('unlink', file);

        expect(fake.logs.filter(([level]) => level !== 'info')).toEqual([]);
    });
});

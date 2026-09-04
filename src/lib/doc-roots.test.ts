import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    DOC_ROOTS_ENV,
    docRootsFromEnv,
    findFirstInRoots,
    findInRoots,
    isExcludedFromRoot,
    normalizeRoot,
    resolveDocRoots,
    rootDirs,
    rootForFile,
    serializeDocRoots,
    toRootList,
    type ResolvedDocRoot,
} from './doc-roots.ts';

let tmp: string;

/** A root object for the exclude tests; the directory never has to exist. */
const rootWith = (...exclude: string[]): ResolvedDocRoot => ({ dir: path.resolve('/docs'), exclude });

/** Creates `<tmp>/<name>` and returns its absolute path. */
function makeDir(name: string): string {
    const dir = path.join(tmp, name);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}

/** Writes an empty file under `dir`, creating parent directories. */
function makeFile(dir: string, relPath: string): string {
    const file = path.join(dir, relPath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '');
    return file;
}

beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-roots-'));
});

afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(tmp, { recursive: true, force: true });
});

describe('isExcludedFromRoot', () => {
    it('returns false when the root excludes nothing', () => {
        expect(isExcludedFromRoot(rootWith(), 'changelog/a.mdx')).toBe(false);
    });

    it('matches a whole subtree with a trailing double star', () => {
        const root = rootWith('changelog/**');

        expect(isExcludedFromRoot(root, 'changelog/a.mdx')).toBe(true);
        expect(isExcludedFromRoot(root, 'changelog/x/y.mdx')).toBe(true);
    });

    it('does not let a subtree pattern match a longer directory name', () => {
        expect(isExcludedFromRoot(rootWith('changelog/**'), 'changelogs/a.mdx')).toBe(false);
    });

    it('matches only one level with a single star', () => {
        const root = rootWith('internal/*.mdx');

        expect(isExcludedFromRoot(root, 'internal/notes.mdx')).toBe(true);
        expect(isExcludedFromRoot(root, 'internal/deep/notes.mdx')).toBe(false);
    });

    it('matches at any depth with a leading double star', () => {
        const root = rootWith('**/_*.mdx');

        expect(isExcludedFromRoot(root, '_draft.mdx')).toBe(true);
        expect(isExcludedFromRoot(root, 'grids/_draft.mdx')).toBe(true);
        expect(isExcludedFromRoot(root, 'grids/data-grid/_draft.mdx')).toBe(true);
        expect(isExcludedFromRoot(root, 'grids/draft.mdx')).toBe(false);
    });

    it('matches exactly one non-slash character with a question mark', () => {
        const root = rootWith('a?.mdx');

        expect(isExcludedFromRoot(root, 'ab.mdx')).toBe(true);
        expect(isExcludedFromRoot(root, 'abc.mdx')).toBe(false);
        expect(isExcludedFromRoot(root, 'a.mdx')).toBe(false);
        expect(isExcludedFromRoot(root, 'a/.mdx')).toBe(false);
    });

    it('treats regex metacharacters as literals', () => {
        const root = rootWith('a.b');

        expect(isExcludedFromRoot(root, 'a.b')).toBe(true);
        expect(isExcludedFromRoot(root, 'axb')).toBe(false);
    });

    it('ignores a leading negation marker', () => {
        expect(isExcludedFromRoot(rootWith('!changelog/**'), 'changelog/a.mdx')).toBe(true);
    });

    it('normalises Windows separators in the path being tested', () => {
        expect(isExcludedFromRoot(rootWith('changelog/**'), 'changelog\\x\\y.mdx')).toBe(true);
    });

    it('is true when any of several patterns matches', () => {
        const root = rootWith('changelog/**', 'grids/**');

        expect(isExcludedFromRoot(root, 'grids/data-grid.mdx')).toBe(true);
        expect(isExcludedFromRoot(root, 'charts/pie.mdx')).toBe(false);
    });
});

describe('normalizeRoot', () => {
    it('absolutises a string root and gives it an empty exclude list', () => {
        expect(normalizeRoot('docs/content')).toEqual({
            dir: path.resolve('docs/content'),
            exclude: [],
        });
    });

    it('absolutises an object root and keeps its excludes', () => {
        expect(normalizeRoot({ dir: 'docs/content', exclude: ['changelog/**'] })).toEqual({
            dir: path.resolve('docs/content'),
            exclude: ['changelog/**'],
        });
    });

    it('fills in a missing exclude list on an object root', () => {
        expect(normalizeRoot({ dir: tmp }).exclude).toEqual([]);
    });

    it('copies the exclude list so the result cannot mutate the input', () => {
        const input = { dir: tmp, exclude: ['changelog/**'] };
        const result = normalizeRoot(input);
        result.exclude.push('grids/**');

        expect(input.exclude).toEqual(['changelog/**']);
    });

    it('leaves an already absolute directory alone', () => {
        expect(normalizeRoot(tmp).dir).toBe(path.resolve(tmp));
    });
});

describe('resolveDocRoots', () => {
    it('lists the overlays before the base directory', () => {
        const base = makeDir('base');
        const overlay = makeDir('overlay');

        expect(resolveDocRoots(base, [overlay]).map(r => r.dir)).toEqual([overlay, base]);
    });

    it('de-duplicates repeated directories, keeping the first entry', () => {
        const base = makeDir('base');

        const roots = resolveDocRoots(base, [{ dir: base, exclude: ['changelog/**'] }]);

        expect(roots).toHaveLength(1);
        expect(roots[0].exclude).toEqual(['changelog/**']);
    });

    it('drops roots that do not exist on disk', () => {
        const base = makeDir('base');

        expect(resolveDocRoots(base, [path.join(tmp, 'no-such-overlay')]).map(r => r.dir)).toEqual([base]);
    });

    it('returns an empty list when there is no base and no overlay', () => {
        expect(resolveDocRoots(undefined)).toEqual([]);
    });

    it('returns only the overlays when the base is undefined', () => {
        const overlay = makeDir('overlay');

        expect(resolveDocRoots(undefined, [overlay]).map(r => r.dir)).toEqual([overlay]);
    });

    it('keeps the excludes of each root', () => {
        const base = makeDir('base');
        const overlay = makeDir('overlay');

        const roots = resolveDocRoots(base, [{ dir: overlay, exclude: ['changelog/**'] }]);

        expect(roots.map(r => r.exclude)).toEqual([['changelog/**'], []]);
    });
});

describe('toRootList', () => {
    it('returns an empty list for undefined', () => {
        expect(toRootList(undefined)).toEqual([]);
    });

    it('wraps a single root into a one-entry list', () => {
        expect(toRootList(tmp)).toEqual([{ dir: path.resolve(tmp), exclude: [] }]);
    });

    it('normalises every entry of an array', () => {
        expect(toRootList([tmp, { dir: tmp, exclude: ['a/**'] }])).toEqual([
            { dir: path.resolve(tmp), exclude: [] },
            { dir: path.resolve(tmp), exclude: ['a/**'] },
        ]);
    });

    it('drops falsy entries of an array', () => {
        expect(toRootList([tmp, '', undefined as never])).toHaveLength(1);
    });

    it('returns an empty list for an empty array', () => {
        expect(toRootList([])).toEqual([]);
    });
});

describe('rootDirs', () => {
    it('returns the bare directories in order', () => {
        expect(rootDirs([tmp, { dir: path.join(tmp, 'overlay') }]))
            .toEqual([path.resolve(tmp), path.resolve(path.join(tmp, 'overlay'))]);
    });

    it('returns an empty list for an empty root list', () => {
        expect(rootDirs([])).toEqual([]);
    });
});

describe('findInRoots', () => {
    it('returns the file from the first root that has it', () => {
        const overlay = makeDir('overlay');
        const base = makeDir('base');
        const wanted = makeFile(overlay, 'a.mdx');
        makeFile(base, 'a.mdx');

        expect(findInRoots([overlay, base], 'a.mdx')).toBe(wanted);
    });

    it('falls through to the next root when the first excludes the path', () => {
        const overlay = makeDir('overlay');
        const base = makeDir('base');
        makeFile(overlay, 'changelog/a.mdx');
        const wanted = makeFile(base, 'changelog/a.mdx');

        expect(findInRoots([{ dir: overlay, exclude: ['changelog/**'] }, base], 'changelog/a.mdx')).toBe(wanted);
    });

    it('returns undefined when no root has the file', () => {
        expect(findInRoots([makeDir('base')], 'missing.mdx')).toBeUndefined();
    });

    it('returns undefined for an empty root list', () => {
        expect(findInRoots([], 'a.mdx')).toBeUndefined();
    });
});

describe('findFirstInRoots', () => {
    it('checks a root against every candidate before moving to the next root', () => {
        const overlay = makeDir('overlay');
        const base = makeDir('base');
        const wanted = makeFile(overlay, 'a.md');
        makeFile(base, 'a.mdx');

        // The overlay's `.md` wins over the base's `.mdx` even though `.mdx`
        // comes first in the candidate list.
        expect(findFirstInRoots([overlay, base], ['a.mdx', 'a.md'])).toBe(wanted);
    });

    it('prefers the earlier candidate within one root', () => {
        const base = makeDir('base');
        const wanted = makeFile(base, 'a.mdx');
        makeFile(base, 'a.md');

        expect(findFirstInRoots([base], ['a.mdx', 'a.md'])).toBe(wanted);
    });

    it('skips candidates the root excludes', () => {
        const overlay = makeDir('overlay');
        const base = makeDir('base');
        makeFile(overlay, 'changelog/a.mdx');
        const wanted = makeFile(base, 'changelog/a.mdx');

        expect(findFirstInRoots(
            [{ dir: overlay, exclude: ['changelog/**'] }, base],
            ['changelog/a.mdx', 'changelog/a.md'],
        )).toBe(wanted);
    });

    it('returns undefined when no candidate exists anywhere', () => {
        expect(findFirstInRoots([makeDir('base')], ['a.mdx', 'a.md'])).toBeUndefined();
    });
});

describe('rootForFile', () => {
    it('returns the root a file lives under', () => {
        const base = makeDir('base');

        expect(rootForFile([base], path.join(base, 'grids', 'a.mdx'))).toBe(path.resolve(base));
    });

    it('picks the longest matching root when roots are nested', () => {
        const outer = makeDir('outer');
        const inner = makeDir(path.join('outer', 'inner'));

        expect(rootForFile([outer, inner], path.join(inner, 'a.mdx'))).toBe(path.resolve(inner));
    });

    it('does not match a directory that only shares a name prefix', () => {
        const base = makeDir('base');
        const sibling = makeDir('base-other');

        expect(rootForFile([base], path.join(sibling, 'a.mdx'))).toBeUndefined();
    });

    it('returns undefined for a file outside every root', () => {
        expect(rootForFile([makeDir('base')], path.join(tmp, 'elsewhere', 'a.mdx'))).toBeUndefined();
    });

    it('returns undefined for an empty root list', () => {
        expect(rootForFile([], path.join(tmp, 'a.mdx'))).toBeUndefined();
    });
});

describe('serializeDocRoots and docRootsFromEnv', () => {
    it('serialises a root without excludes as a bare string', () => {
        expect(serializeDocRoots([{ dir: '/docs', exclude: [] }])).toBe('["/docs"]');
    });

    it('serialises a root with excludes as an object', () => {
        expect(serializeDocRoots([{ dir: '/docs', exclude: ['changelog/**'] }]))
            .toBe('[{"dir":"/docs","exclude":["changelog/**"]}]');
    });

    it('round-trips a mixed root list through the environment', () => {
        const roots: ResolvedDocRoot[] = [
            { dir: path.resolve(tmp, 'overlay'), exclude: ['changelog/**'] },
            { dir: path.resolve(tmp, 'base'), exclude: [] },
        ];
        vi.stubEnv(DOC_ROOTS_ENV, serializeDocRoots(roots));

        expect(docRootsFromEnv()).toEqual(roots);
    });

    it('falls back to DOCS_SOURCE_PATH when the root list is malformed JSON', () => {
        vi.stubEnv(DOC_ROOTS_ENV, '{not json');
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);

        expect(docRootsFromEnv()).toEqual([{ dir: path.resolve(tmp), exclude: [] }]);
    });

    it('falls back to DOCS_SOURCE_PATH when the root list is not an array', () => {
        vi.stubEnv(DOC_ROOTS_ENV, '{"dir":"/docs"}');
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);

        expect(docRootsFromEnv()).toEqual([{ dir: path.resolve(tmp), exclude: [] }]);
    });

    it('drops entries of the wrong shape', () => {
        vi.stubEnv(DOC_ROOTS_ENV, JSON.stringify(['/docs', 42, null, { exclude: [] }]));

        expect(docRootsFromEnv()).toEqual([{ dir: path.resolve('/docs'), exclude: [] }]);
    });

    it('returns an empty list when neither variable is set', () => {
        vi.stubEnv(DOC_ROOTS_ENV, undefined);
        vi.stubEnv('DOCS_SOURCE_PATH', undefined);

        expect(docRootsFromEnv()).toEqual([]);
    });
});

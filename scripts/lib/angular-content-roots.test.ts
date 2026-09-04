import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    ANGULAR_AUTHORED_ROOT,
    ANGULAR_OVERLAY_ROOT,
    getRootGroup,
    isShadowedAuthoredFile,
    isUnservedAngularFile,
    isUnservedOverlayFile,
    OVERLAY_EXCLUDED_DIRS,
} from './angular-content-roots.mjs';

/** Repo root of the fake checkout, in the forward-slash form the module expects. */
let repo: string;

const authored = (lang: string): string => `${repo}/${ANGULAR_AUTHORED_ROOT}/${lang}`;
const overlay = (lang: string): string => `${repo}/${ANGULAR_OVERLAY_ROOT}/${lang}`;

/** Creates an empty file at `absPath`, parents included. */
function touch(absPath: string): string {
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, '');
    return absPath;
}

beforeEach(() => {
    repo = fs.mkdtempSync(path.join(os.tmpdir(), 'ng-roots-')).replace(/\\/g, '/');

    // Authored tree: one topic the generator also emits, one it does not, and
    // one under a directory the site keeps for itself.
    touch(`${authored('en')}/components/charts/pie.md`);
    touch(`${authored('en')}/components/unique.md`);
    touch(`${authored('en')}/components/grids/grid.md`);
    touch(`${authored('jp')}/components/charts/pie.md`);
    touch(`${authored('kr')}/components/charts/pie.md`);

    // Overlay tree: the generated twins, plus the excluded subtrees.
    touch(`${overlay('en')}/components/charts/pie.md`);
    touch(`${overlay('en')}/components/grids/grid.md`);
    touch(`${overlay('en')}/components/changelog/notes.md`);
    touch(`${overlay('jp')}/components/charts/pie.md`);
});

afterEach(() => {
    fs.rmSync(repo, { recursive: true, force: true });
});

describe('isUnservedOverlayFile', () => {
    it.each(OVERLAY_EXCLUDED_DIRS)('treats the overlay %s directory as unserved', dir => {
        expect(isUnservedOverlayFile(`${ANGULAR_OVERLAY_ROOT}/en/components/${dir}/topic.md`)).toBe(true);
    });

    it('serves an overlay file outside the excluded directories', () => {
        expect(isUnservedOverlayFile(`${ANGULAR_OVERLAY_ROOT}/en/components/charts/pie.md`)).toBe(false);
    });

    it('matches the excluded directory itself, without a trailing path', () => {
        expect(isUnservedOverlayFile(`${ANGULAR_OVERLAY_ROOT}/en/components/grids`)).toBe(true);
    });

    it('does not match a directory that merely starts with an excluded name', () => {
        expect(isUnservedOverlayFile(`${ANGULAR_OVERLAY_ROOT}/en/components/gridsy/topic.md`)).toBe(false);
    });

    it('matches when the repo-relative path is prefixed by an absolute directory', () => {
        expect(isUnservedOverlayFile(`${overlay('en')}/components/changelog/notes.md`)).toBe(true);
    });

    it('normalises Windows separators', () => {
        expect(isUnservedOverlayFile(`${ANGULAR_OVERLAY_ROOT}/en/components/grids/grid.md`.replace(/\//g, '\\')))
            .toBe(true);
    });

    it('ignores case', () => {
        expect(isUnservedOverlayFile('docs/xplat/generated/angular/EN/components/Changelog/notes.md')).toBe(true);
    });

    it('never treats an authored file as an unserved overlay file', () => {
        expect(isUnservedOverlayFile(`${ANGULAR_AUTHORED_ROOT}/en/components/grids/grid.md`)).toBe(false);
    });
});

describe('isShadowedAuthoredFile', () => {
    it('reports an authored topic the generator also emits', () => {
        expect(isShadowedAuthoredFile(`${authored('en')}/components/charts/pie.md`)).toBe(true);
    });

    it('does not report an authored topic with no generated twin', () => {
        expect(isShadowedAuthoredFile(`${authored('en')}/components/unique.md`)).toBe(false);
    });

    it('does not report an authored topic whose twin the site excludes', () => {
        // `grids/` stays Angular-owned, so the generated copy shadows nothing.
        expect(isShadowedAuthoredFile(`${authored('en')}/components/grids/grid.md`)).toBe(false);
    });

    it('does not report a topic in a language the generator does not emit', () => {
        expect(isShadowedAuthoredFile(`${authored('kr')}/components/charts/pie.md`)).toBe(false);
    });

    it('reports a shadowed topic in the Japanese tree', () => {
        expect(isShadowedAuthoredFile(`${authored('jp')}/components/charts/pie.md`)).toBe(true);
    });

    it('returns false for a path outside the authored root', () => {
        expect(isShadowedAuthoredFile(`${overlay('en')}/components/charts/pie.md`)).toBe(false);
        expect(isShadowedAuthoredFile(`${repo}/docs/xplat/src/content/en/components/charts/pie.md`)).toBe(false);
    });
});

describe('isUnservedAngularFile', () => {
    it('is true for an excluded overlay file', () => {
        expect(isUnservedAngularFile(`${overlay('en')}/components/changelog/notes.md`)).toBe(true);
    });

    it('is true for a shadowed authored file', () => {
        expect(isUnservedAngularFile(`${authored('en')}/components/charts/pie.md`)).toBe(true);
    });

    it('is false for an authored file the site actually renders', () => {
        expect(isUnservedAngularFile(`${authored('en')}/components/unique.md`)).toBe(false);
    });

    it('is false for a served overlay file', () => {
        expect(isUnservedAngularFile(`${overlay('en')}/components/charts/pie.md`)).toBe(false);
    });
});

describe('getRootGroup', () => {
    it('pairs the authored English root with its overlay', () => {
        expect(getRootGroup(authored('en'))).toEqual([authored('en'), `${overlay('en')}/`]);
    });

    it('pairs the overlay root with the authored tree', () => {
        expect(getRootGroup(overlay('en'))).toEqual([overlay('en'), `${authored('en')}/`]);
    });

    it('pairs the Japanese roots', () => {
        expect(getRootGroup(authored('jp'))).toEqual([authored('jp'), `${overlay('jp')}/`]);
    });

    it('drops a peer the generator does not emit', () => {
        expect(getRootGroup(authored('kr'))).toEqual([authored('kr')]);
    });

    it('ignores a trailing slash on the input', () => {
        expect(getRootGroup(`${authored('en')}/`)).toEqual([`${authored('en')}/`, `${overlay('en')}/`]);
    });

    it('returns a path outside both roots on its own', () => {
        const outside = `${repo}/docs/xplat/src/content/en`;
        expect(getRootGroup(outside)).toEqual([outside]);
    });

    it('returns a deeper path inside a root on its own', () => {
        const deeper = `${authored('en')}/components`;
        expect(getRootGroup(deeper)).toEqual([deeper]);
    });

    it('returns an empty list for an empty root', () => {
        expect(getRootGroup('')).toEqual([]);
    });
});

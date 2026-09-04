import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { markdownToHtml } from 'satteri';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let tmp: string;

/** Loads a fresh copy of the module so its `loadEnv` cache starts empty. */
async function loadModule() {
    vi.resetModules();
    return import('./remark-env-vars.ts');
}

beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'env-vars-'));
    fs.writeFileSync(
        path.join(tmp, 'environment.json'),
        JSON.stringify({
            production: { demosBaseUrl: 'https://prod.test/samples' },
            development: { demosBaseUrl: 'https://dev.test/samples' },
        }),
    );
});

afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(tmp, { recursive: true, force: true });
});

describe('replaceEnvVars', () => {
    it('substitutes a token from the block the build mode selects', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        vi.stubEnv('DOCS_ENV', 'development');
        const { replaceEnvVars } = await loadModule();

        expect(replaceEnvVars('See {environment:demosBaseUrl}/grid.')).toBe('See https://dev.test/samples/grid.');
    });

    it('falls back to the production block for an unknown build mode', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        vi.stubEnv('DOCS_ENV', 'no-such-mode');
        const { replaceEnvVars } = await loadModule();

        expect(replaceEnvVars('{environment:demosBaseUrl}')).toBe('https://prod.test/samples');
    });

    it('prefers the en/environment.json under the source root', async () => {
        fs.mkdirSync(path.join(tmp, 'en'));
        fs.writeFileSync(
            path.join(tmp, 'en', 'environment.json'),
            JSON.stringify({ production: { demosBaseUrl: 'https://en.test/samples' } }),
        );
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        vi.stubEnv('DOCS_ENV', 'production');
        const { replaceEnvVars } = await loadModule();

        expect(replaceEnvVars('{environment:demosBaseUrl}')).toBe('https://en.test/samples');
    });

    it('leaves an unknown key as the literal token', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        vi.stubEnv('DOCS_ENV', 'production');
        const { replaceEnvVars } = await loadModule();

        expect(replaceEnvVars('{environment:nope}')).toBe('{environment:nope}');
    });

    it('replaces every token in the string', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        vi.stubEnv('DOCS_ENV', 'production');
        const { replaceEnvVars } = await loadModule();

        expect(replaceEnvVars('{environment:demosBaseUrl} and {environment:demosBaseUrl}'))
            .toBe('https://prod.test/samples and https://prod.test/samples');
    });

    it('leaves tokens untouched when no source path is configured', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', '');
        vi.stubEnv('DOCS_PLATFORM', '');
        const { replaceEnvVars } = await loadModule();

        expect(replaceEnvVars('{environment:demosBaseUrl}')).toBe('{environment:demosBaseUrl}');
    });

    it('returns non-string input unchanged', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        const { replaceEnvVars } = await loadModule();

        expect(replaceEnvVars('')).toBe('');
        expect(replaceEnvVars(undefined as unknown as string)).toBeUndefined();
    });

    it('reloads the environment when the source path changes', async () => {
        const other = fs.mkdtempSync(path.join(os.tmpdir(), 'env-vars-other-'));
        try {
            fs.writeFileSync(
                path.join(other, 'environment.json'),
                JSON.stringify({ production: { demosBaseUrl: 'https://other.test/samples' } }),
            );
            vi.stubEnv('DOCS_SOURCE_PATH', tmp);
            vi.stubEnv('DOCS_ENV', 'production');
            const { replaceEnvVars } = await loadModule();
            expect(replaceEnvVars('{environment:demosBaseUrl}')).toBe('https://prod.test/samples');

            vi.stubEnv('DOCS_SOURCE_PATH', other);
            expect(replaceEnvVars('{environment:demosBaseUrl}')).toBe('https://other.test/samples');
        } finally {
            fs.rmSync(other, { recursive: true, force: true });
        }
    });
});

describe('remarkEnvVars', () => {
    it('substitutes tokens in text, link URLs and inline HTML', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        vi.stubEnv('DOCS_ENV', 'production');
        const { remarkEnvVars } = await loadModule();

        const { html } = await markdownToHtml(
            [
                'Base is {environment:demosBaseUrl}.',
                '',
                '[Sample]({environment:demosBaseUrl}/grid)',
                '',
                '<span data-url="{environment:demosBaseUrl}"></span>',
            ].join('\n'),
            { mdastPlugins: [remarkEnvVars] },
        );

        expect(html).toContain('Base is https://prod.test/samples.');
        expect(html).toContain('href="https://prod.test/samples/grid"');
        expect(html).toContain('data-url="https://prod.test/samples"');
    });

    it('substitutes tokens in image URLs', async () => {
        vi.stubEnv('DOCS_SOURCE_PATH', tmp);
        vi.stubEnv('DOCS_ENV', 'production');
        const { remarkEnvVars } = await loadModule();

        const { html } = await markdownToHtml('![Grid]({environment:demosBaseUrl}/grid.png)', {
            mdastPlugins: [remarkEnvVars],
        });

        expect(html).toContain('src="https://prod.test/samples/grid.png"');
    });
});

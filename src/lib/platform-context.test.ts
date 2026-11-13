import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlatformName } from './api-platform-config.ts';

const STAGING = 'https://staging.infragistics.com/api';
const PLATFORMS: PlatformName[] = ['Angular', 'React', 'WebComponents', 'Blazor'];

let tmp: string;

/** Loads a fresh copy of the module so its `_ctx` / `_env` caches start empty. */
async function loadModule() {
    vi.resetModules();
    return import('./platform-context.ts');
}

/** Points `process.cwd()` at the temp dir the test populated. */
function useTmpAsCwd(): void {
    vi.spyOn(process, 'cwd').mockReturnValue(tmp);
}

function writeJson(relPath: string, data: unknown): void {
    const file = path.join(tmp, relPath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data));
}

beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'platform-ctx-'));
    // A clean slate: every env var the module reads is removed by default.
    // The module uses `??`, so an empty string would be a *value*, not "unset".
    for (const name of ['PLATFORM', 'DOCS_ENV', 'NODE_ENV', 'API_DOCS_BASE_URL', 'LANG_CODE', 'API_LINK_INDEX_VERSION', 'DOCS_SOURCE_PATH', 'DOCS_PROJECT_ROOT', 'GTM_CONTAINER_ID']) {
        vi.stubEnv(name, undefined);
    }
    vi.stubEnv('DOCS_ENV', 'development');
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    fs.rmSync(tmp, { recursive: true, force: true });
});

describe('getPlatformContext', () => {
    it.each(PLATFORMS)('returns the context of %s when named explicitly', async name => {
        useTmpAsCwd();
        const { getPlatformContext } = await loadModule();
        const ctx = getPlatformContext(name);

        expect(ctx.name).toBe(name);
        expect(Object.keys(ctx.packages)).toEqual(['common', 'charts', 'grids', 'gauges', 'maps']);
    });

    it.each(PLATFORMS)('roots every %s API package at the staging API docs base', async name => {
        useTmpAsCwd();
        const { getPlatformContext } = await loadModule();
        const roots = Object.values(getPlatformContext(name).apiPackages).map(pkg => pkg.docRoot);

        expect(roots.length).toBeGreaterThan(0);
        expect(roots.every(root => root.startsWith(`${STAGING}/`))).toBe(true);
    });

    it('uses the production API docs base in production', async () => {
        useTmpAsCwd();
        vi.stubEnv('DOCS_ENV', 'production');
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext('Angular').apiPackages['core'].docRoot)
            .toBe('https://www.infragistics.com/api/angular/igniteui-angular/latest');
    });

    it('rewrites the docRoot from API_DOCS_BASE_URL', async () => {
        useTmpAsCwd();
        vi.stubEnv('API_DOCS_BASE_URL', 'https://custom.test/api');
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext('React').apiPackages['charts'].docRoot)
            .toBe('https://custom.test/api/react/igniteui-react-charts/latest');
    });

    it('appends the /api segment to an API_DOCS_BASE_URL that lacks it', async () => {
        useTmpAsCwd();
        vi.stubEnv('API_DOCS_BASE_URL', 'https://custom.test/');
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext('React').apiPackages['charts'].docRoot)
            .toBe('https://custom.test/api/react/igniteui-react-charts/latest');
    });

    it('resolves the platform from the PLATFORM env var', async () => {
        useTmpAsCwd();
        vi.stubEnv('PLATFORM', 'Blazor');
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext().name).toBe('Blazor');
    });

    it('falls back to .platform.json in the working directory', async () => {
        writeJson('.platform.json', { platform: 'WebComponents' });
        useTmpAsCwd();
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext().name).toBe('WebComponents');
    });

    it('prefers the PLATFORM env var over .platform.json', async () => {
        writeJson('.platform.json', { platform: 'WebComponents' });
        useTmpAsCwd();
        vi.stubEnv('PLATFORM', 'Angular');
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext().name).toBe('Angular');
    });

    it('defaults to React when nothing selects a platform', async () => {
        useTmpAsCwd();
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext().name).toBe('React');
    });

    it('falls back to React for an unknown PLATFORM value', async () => {
        useTmpAsCwd();
        vi.stubEnv('PLATFORM', 'Vue');
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext().name).toBe('React');
    });

    it('falls back to React for an unknown platform in .platform.json', async () => {
        writeJson('.platform.json', { platform: 'Vue' });
        useTmpAsCwd();
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext().name).toBe('React');
    });

    it('caches the no-arg context but not the explicitly named one', async () => {
        useTmpAsCwd();
        const { getPlatformContext } = await loadModule();

        expect(getPlatformContext()).toBe(getPlatformContext());
        expect(getPlatformContext('Angular')).not.toBe(getPlatformContext('Angular'));
    });
});

describe('getEnvVars', () => {
    it('reads the generated environment.json for the platform, locale and mode', async () => {
        writeJson('generated/React/en/environment.json', {
            development: { demosBaseUrl: 'https://dev.test' },
            production: { demosBaseUrl: 'https://prod.test' },
        });
        useTmpAsCwd();
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toEqual({ demosBaseUrl: 'https://dev.test' });
    });

    it('honours LANG_CODE when locating the generated file', async () => {
        writeJson('generated/React/jp/environment.json', { development: { demosBaseUrl: 'https://jp.test' } });
        useTmpAsCwd();
        vi.stubEnv('LANG_CODE', 'jp');
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toEqual({ demosBaseUrl: 'https://jp.test' });
    });

    it('falls back to the development block for an unknown mode', async () => {
        writeJson('generated/React/en/environment.json', { development: { demosBaseUrl: 'https://dev.test' } });
        useTmpAsCwd();
        vi.stubEnv('DOCS_ENV', 'staging');
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toEqual({ demosBaseUrl: 'https://dev.test' });
    });

    it('falls back to an environment.json under DOCS_SOURCE_PATH', async () => {
        const source = path.join(tmp, 'source');
        fs.mkdirSync(source, { recursive: true });
        fs.writeFileSync(
            path.join(source, 'environment.json'),
            JSON.stringify({ development: { demosBaseUrl: 'https://source.test' } }),
        );
        useTmpAsCwd();
        vi.stubEnv('DOCS_SOURCE_PATH', source);
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toEqual({ demosBaseUrl: 'https://source.test' });
    });

    it('prefers the en/environment.json under DOCS_SOURCE_PATH', async () => {
        const source = path.join(tmp, 'source');
        fs.mkdirSync(path.join(source, 'en'), { recursive: true });
        fs.writeFileSync(
            path.join(source, 'environment.json'),
            JSON.stringify({ development: { demosBaseUrl: 'https://root.test' } }),
        );
        fs.writeFileSync(
            path.join(source, 'en', 'environment.json'),
            JSON.stringify({ development: { demosBaseUrl: 'https://en.test' } }),
        );
        useTmpAsCwd();
        vi.stubEnv('DOCS_SOURCE_PATH', source);
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toEqual({ demosBaseUrl: 'https://en.test' });
    });

    it('falls back to the samplesBrowsers block of docConfig.json', async () => {
        writeJson('docConfig.json', { React: { samplesBrowsers: { development: 'https://demos.test' } } });
        useTmpAsCwd();
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toEqual({
            dvDemosBaseUrl: 'https://demos.test',
            demosBaseUrl: 'https://demos.test',
            infragisticsBaseUrl: 'https://www.infragistics.com',
        });
    });

    it('returns an empty object when no environment source exists', async () => {
        useTmpAsCwd();
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toEqual({});
    });

    it('caches the result for the build lifetime', async () => {
        writeJson('generated/React/en/environment.json', { development: { demosBaseUrl: 'https://dev.test' } });
        useTmpAsCwd();
        const { getEnvVars } = await loadModule();

        expect(getEnvVars()).toBe(getEnvVars());
    });
});

describe('getGtmContainerId', () => {
    it('returns the explicit GTM_CONTAINER_ID override', async () => {
        useTmpAsCwd();
        vi.stubEnv('GTM_CONTAINER_ID', 'GTM-OVERRIDE');
        const { getGtmContainerId } = await loadModule();

        expect(getGtmContainerId()).toBe('GTM-OVERRIDE');
    });

    it('reads GTMContainerId out of the resolved environment.json', async () => {
        writeJson('generated/React/en/environment.json', { development: { GTMContainerId: 'GTM-FROMJSON' } });
        useTmpAsCwd();
        const { getGtmContainerId } = await loadModule();

        expect(getGtmContainerId()).toBe('GTM-FROMJSON');
    });

    it.each([
        ['development', 'GTM-WLXLBZD'],
        ['staging', 'GTM-NCKNPN'],
        ['production', 'GTM-T65CF7'],
    ])('falls back to the built-in English id for %s', async (mode, expected) => {
        useTmpAsCwd();
        vi.stubEnv('DOCS_ENV', mode);
        const { getGtmContainerId } = await loadModule();

        expect(getGtmContainerId()).toBe(expected);
    });

    it('uses the Japanese defaults for LANG_CODE jp', async () => {
        useTmpAsCwd();
        vi.stubEnv('LANG_CODE', 'jp');
        vi.stubEnv('DOCS_ENV', 'production');
        const { getGtmContainerId } = await loadModule();

        expect(getGtmContainerId()).toBe('GTM-KVNSWJ');
    });

    it('falls back to the English defaults for a locale without its own set', async () => {
        useTmpAsCwd();
        vi.stubEnv('LANG_CODE', 'kr');
        vi.stubEnv('DOCS_ENV', 'production');
        const { getGtmContainerId } = await loadModule();

        expect(getGtmContainerId()).toBe('GTM-T65CF7');
    });

    it('falls back to the development id for an unknown build mode', async () => {
        useTmpAsCwd();
        vi.stubEnv('DOCS_ENV', 'qa');
        const { getGtmContainerId } = await loadModule();

        expect(getGtmContainerId()).toBe('GTM-WLXLBZD');
    });
});

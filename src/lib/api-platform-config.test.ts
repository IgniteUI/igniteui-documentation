import { describe, expect, it } from 'vitest';
import {
    API_PLATFORM_CONFIGS,
    apiDocRoot,
    apiDocsPlatformPath,
    createApiPackages,
    getPackageClassSuffixes,
    getPackageIds,
    PLATFORM_MAP,
    type PlatformName,
} from './api-platform-config.ts';

const PLATFORMS = Object.keys(API_PLATFORM_CONFIGS) as PlatformName[];
const BASE = 'https://staging.example.test/api';

describe('apiDocsPlatformPath', () => {
    it.each([
        ['Angular', 'angular'],
        ['React', 'react'],
        ['WebComponents', 'webcomponents'],
        ['Blazor', 'blazor'],
    ] as Array<[PlatformName, string]>)('maps %s to the %s folder', (platform, folder) => {
        expect(apiDocsPlatformPath(platform)).toBe(folder);
    });
});

describe('apiDocRoot', () => {
    it('joins the base URL, the platform folder, the package and the version', () => {
        expect(apiDocRoot(BASE, 'Angular', 'igniteui-angular-charts'))
            .toBe('https://staging.example.test/api/angular/igniteui-angular-charts/latest');
    });

    it.each(PLATFORMS)('uses the folder of %s', platform => {
        expect(apiDocRoot(BASE, platform, 'pkg'))
            .toBe(`${BASE}/${apiDocsPlatformPath(platform)}/pkg/latest`);
    });
});

describe('createApiPackages', () => {
    it.each(PLATFORMS)('returns one entry per package for %s', platform => {
        const packages = createApiPackages(BASE, platform);
        const definitions = API_PLATFORM_CONFIGS[platform].apiPackages;

        expect(Object.keys(packages)).toEqual(Object.keys(definitions));
    });

    it('builds each docRoot from the given base URL', () => {
        const packages = createApiPackages(BASE, 'React');

        expect(packages['charts'].docRoot).toBe(`${BASE}/react/igniteui-react-charts/latest`);
        expect(packages['core'].docRoot).toBe(`${BASE}/react/igniteui-react/latest`);
    });

    it('keeps the definition fields and adds the runtime flags', () => {
        expect(createApiPackages(BASE, 'Angular')['core']).toEqual({
            packageId: 'igniteui-angular',
            classSuffix: 'Component',
            docRoot: `${BASE}/angular/igniteui-angular/latest`,
            noPackagePrefix: true,
            preserveCase: true,
        });
    });

    it('carries the pascalCaseMembers flag through for Blazor', () => {
        expect(createApiPackages(BASE, 'Blazor')['core'].pascalCaseMembers).toBe(true);
    });
});

describe('getPackageIds', () => {
    it.each(PLATFORMS)('returns a package id for every key of %s', platform => {
        const ids = getPackageIds(platform);
        const definitions = API_PLATFORM_CONFIGS[platform].apiPackages;

        expect(Object.keys(ids)).toEqual(Object.keys(definitions));
        for (const [key, id] of Object.entries(ids)) {
            expect(id).toBe(definitions[key].packageId);
        }
    });

    it('maps every Blazor key onto an IgniteUI.Blazor package', () => {
        for (const id of Object.values(getPackageIds('Blazor'))) {
            expect(id.startsWith('IgniteUI.Blazor')).toBe(true);
        }
    });
});

describe('getPackageClassSuffixes', () => {
    it('returns Component for the Angular packages that declare it', () => {
        const suffixes = getPackageClassSuffixes('Angular');

        expect(suffixes['core']).toBe('Component');
        expect(suffixes['excel']).toBeUndefined();
    });

    it('leaves every React suffix undefined', () => {
        const suffixes = getPackageClassSuffixes('React');

        expect(Object.values(suffixes).every(value => value === undefined)).toBe(true);
    });

    it.each(PLATFORMS)('returns an entry for every key of %s', platform => {
        expect(Object.keys(getPackageClassSuffixes(platform)))
            .toEqual(Object.keys(API_PLATFORM_CONFIGS[platform].apiPackages));
    });
});

describe('PLATFORM_MAP', () => {
    it('maps each short name to a configured platform', () => {
        expect(PLATFORM_MAP).toEqual({
            angular: 'Angular',
            react: 'React',
            wc: 'WebComponents',
            blazor: 'Blazor',
        });
    });

    it('covers every platform in the config registry', () => {
        expect(new Set(Object.values(PLATFORM_MAP))).toEqual(new Set(PLATFORMS));
    });
});

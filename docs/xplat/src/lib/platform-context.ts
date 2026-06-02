/**
 * Typed platform configuration — replaces the per-platform `replacements`
 * array in docConfig.json with a first-class TypeScript object.
 *
 * Components and MDX files import `getPlatformContext()` directly instead of
 * relying on string-replacement tokens like {Platform} or {ProductName}.
 */

import fs from 'node:fs';
import path from 'node:path';

export type PlatformName = 'Angular' | 'React' | 'WebComponents' | 'Blazor';

export interface ApiPackageConfig {
    /** TypeDoc documentation root URL (no trailing slash). */
    docRoot: string;
    /**
     * Package identifier as it appears in the TypeDoc URL path.
     * Core packages use hyphens ("igniteui-react"),
     * sub-packages use underscores ("igniteui_react_charts").
     */
    packageId: string;
    /**
     * When true the package prefix is omitted from the class URL, e.g.
     * Angular docs use `/classes/IgxGridComponent.html` (no `packageId.` prefix).
     * Case is also preserved (not lowercased) when this flag is set.
     */
    noPackagePrefix?: boolean;
    /**
     * When true the class name casing is preserved as-is (no .toLowerCase()).
     * New api-docs routes use PascalCase symbol names.
     */
    preserveCase?: boolean;
    /**
     * Preferred class-name suffix used by ApiLink. The generated registry tries
     * both the suffixed and unsuffixed names, so this does not mean every API
     * symbol is expected to have the suffix.
     */
    classSuffix?: string;
    /**
     * When true, member anchor names are PascalCase (first letter uppercased).
     * Blazor API docs use PascalCase anchors.
     */
    pascalCaseMembers?: boolean;
}

export interface PlatformContext {
    name: PlatformName;
    /** Optional compact ApiLink symbol index loaded by the docs host at build time. */
    apiLinkIndex?: {
        symbols?: Record<string, unknown>;
    };
    /** Lower-case slug used in URLs, e.g. "angular" */
    lower: string;
    /** Component class prefix, e.g. "Igx" / "Igr" / "Igc" / "Igb" */
    prefix: string;
    productName: string;
    productSpinal: string;
    /**
     * Per-package API documentation config keyed by short name.
     * "core" is always the main component package.
     * Other keys match the logical package category: "charts", "grids",
     * "gauges", "maps", "inputs", "layouts", "excel", "spreadsheet", etc.
     *
     * URL for a class:   {docRoot}/classes/{packageId}.{PrefixType}.html
     * URL for a member:  {docRoot}/classes/{packageId}.{PrefixType}.html#{member}
     */
    apiPackages: Record<string, ApiPackageConfig>;
    packages: {
        common: string;
        charts: string;
        grids: string;
        gauges: string;
        maps: string;
    };
    links: {
        github: string;
        forums: string;
        repoSamples: string;
    };
}

function getBuildMode(): string {
    return process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'development';
}

function getApiDocsBaseUrl(): string {
    const value = process.env.API_DOCS_BASE_URL
        ?? (getBuildMode() === 'staging'
            ? 'https://staging.infragistics.com/api'
            : getBuildMode() === 'production'
                ? 'https://www.infragistics.com/api'
                : 'https://staging.infragistics.com/api');
    const trimmed = value.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

const API_DOCS_BASE_URL = getApiDocsBaseUrl();

function getApiLinkIndexName(): string {
    return process.env.API_LINK_INDEX_VERSION
        ?? (getBuildMode() === 'production' ? 'prod-latest' : 'staging-latest');
}

function apiDocsPlatformPath(platform: PlatformName): string {
    return platform === 'WebComponents' ? 'webcomponents' : platform.toLowerCase();
}

function apiDocRoot(platform: PlatformName, packageId: string): string {
    return `${API_DOCS_BASE_URL}/${apiDocsPlatformPath(platform)}/${packageId}/latest`;
}

function apiPackage(platform: PlatformName, packageId: string, options: Partial<ApiPackageConfig> = {}): ApiPackageConfig {
    return {
        docRoot: apiDocRoot(platform, packageId),
        packageId,
        noPackagePrefix: true,
        preserveCase: true,
        ...options,
    };
}

function loadApiLinkIndex(platform: PlatformName): PlatformContext['apiLinkIndex'] {
    try {
        const file = path.resolve(
            process.cwd(),
            'src',
            'data',
            'api-link-index',
            apiDocsPlatformPath(platform),
            `${getApiLinkIndexName()}.json`
        );
        if (!fs.existsSync(file)) return undefined;
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
        return undefined;
    }
}

const PLATFORMS: Record<PlatformName, PlatformContext> = {
    Angular: {
        name: 'Angular',
        apiLinkIndex: loadApiLinkIndex('Angular'),
        lower: 'angular',
        prefix: 'Igx',
        productName: 'Ignite UI for Angular',
        productSpinal: 'ignite-ui-angular',
        apiPackages: {
            core:        apiPackage('Angular', 'igniteui-angular', { classSuffix: 'Component' }),
            charts:      apiPackage('Angular', 'igniteui-angular-charts', { classSuffix: 'Component' }),
            grids:       apiPackage('Angular', 'igniteui-angular', { classSuffix: 'Component' }),
            gauges:      apiPackage('Angular', 'igniteui-angular-gauges', { classSuffix: 'Component' }),
            maps:        apiPackage('Angular', 'igniteui-angular-maps', { classSuffix: 'Component' }),
            excel:       apiPackage('Angular', 'igniteui-angular-excel', { classSuffix: 'Component' }),
            spreadsheet: apiPackage('Angular', 'igniteui-angular-spreadsheet', { classSuffix: 'Component' }),
            inputs:      apiPackage('Angular', 'igniteui-angular', { classSuffix: 'Component' }),
            layouts:     apiPackage('Angular', 'igniteui-angular', { classSuffix: 'Component' }),
        },
        packages: {
            common: 'igniteui-angular',
            charts: 'igniteui-angular-charts',
            grids: 'igniteui-angular',
            gauges: 'igniteui-angular-gauges',
            maps: 'igniteui-angular-maps',
        },
        links: {
            github: 'https://github.com/IgniteUI/igniteui-angular',
            forums: 'https://www.infragistics.com/community/forums/f/ignite-ui-for-angular',
            repoSamples: 'https://github.com/IgniteUI/igniteui-angular-examples/tree/master/samples',
        },
    },
    React: {
        name: 'React',
        apiLinkIndex: loadApiLinkIndex('React'),
        lower: 'react',
        prefix: 'Igr',
        productName: 'Ignite UI for React',
        productSpinal: 'ignite-ui-react',
        apiPackages: {
            core:        apiPackage('React', 'igniteui-react'),
            charts:      apiPackage('React', 'igniteui-react-charts'),
            grids:       apiPackage('React', 'igniteui-react-grids'),
            gauges:      apiPackage('React', 'igniteui-react-gauges'),
            maps:        apiPackage('React', 'igniteui-react-maps'),
            inputs:      apiPackage('React', 'igniteui-react-inputs'),
            layouts:     apiPackage('React', 'igniteui-react-layouts'),
            excel:       apiPackage('React', 'igniteui-react-excel'),
            spreadsheet: apiPackage('React', 'igniteui-react-spreadsheet'),
            datasources: apiPackage('React', 'igniteui-react-datasources'),
            dockmanager: apiPackage('React', 'igniteui-react-dockmanager'),
        },
        packages: {
            common: '@infragistics/igniteui-react',
            charts: '@infragistics/igniteui-react-charts',
            grids: '@infragistics/igniteui-react-grids',
            gauges: '@infragistics/igniteui-react-gauges',
            maps: '@infragistics/igniteui-react-maps',
        },
        links: {
            github: 'https://github.com/IgniteUI/igniteui-react',
            forums: 'https://www.infragistics.com/community/forums/f/ignite-ui-for-react',
            repoSamples: 'https://github.com/IgniteUI/igniteui-react-examples/tree/master/samples',
        },
    },
    WebComponents: {
        name: 'WebComponents',
        apiLinkIndex: loadApiLinkIndex('WebComponents'),
        lower: 'webcomponents',
        prefix: 'Igc',
        productName: 'Ignite UI for Web Components',
        productSpinal: 'ignite-ui-web-components',
        apiPackages: {
            core:        apiPackage('WebComponents', 'igniteui-webcomponents', { classSuffix: 'Component' }),
            charts:      apiPackage('WebComponents', 'igniteui-webcomponents-charts', { classSuffix: 'Component' }),
            grids:       apiPackage('WebComponents', 'igniteui-webcomponents-grids', { classSuffix: 'Component' }),
            gauges:      apiPackage('WebComponents', 'igniteui-webcomponents-gauges', { classSuffix: 'Component' }),
            maps:        apiPackage('WebComponents', 'igniteui-webcomponents-maps', { classSuffix: 'Component' }),
            inputs:      apiPackage('WebComponents', 'igniteui-webcomponents-inputs', { classSuffix: 'Component' }),
            layouts:     apiPackage('WebComponents', 'igniteui-webcomponents-layouts', { classSuffix: 'Component' }),
            excel:       apiPackage('WebComponents', 'igniteui-webcomponents-excel', { classSuffix: 'Component' }),
            spreadsheet: apiPackage('WebComponents', 'igniteui-webcomponents-spreadsheet', { classSuffix: 'Component' }),
            datasources: apiPackage('WebComponents', 'igniteui-webcomponents-datasources', { classSuffix: 'Component' }),
            dockmanager: apiPackage('WebComponents', 'igniteui-dockmanager', { classSuffix: 'Component' }),
            gridlite:    apiPackage('WebComponents', 'igniteui-grid-lite', { classSuffix: 'Component' }),
        },
        packages: {
            common: 'igniteui-webcomponents',
            charts: 'igniteui-webcomponents-charts',
            grids: 'igniteui-webcomponents-grids',
            gauges: 'igniteui-webcomponents-gauges',
            maps: 'igniteui-webcomponents-maps',
        },
        links: {
            github: 'https://github.com/IgniteUI/igniteui-webcomponents',
            forums: 'https://www.infragistics.com/community/forums/f/ignite-ui-for-web-components',
            repoSamples: 'https://github.com/IgniteUI/igniteui-webcomponents-examples/tree/master/samples',
        },
    },
    Blazor: {
        name: 'Blazor',
        apiLinkIndex: loadApiLinkIndex('Blazor'),
        lower: 'blazor',
        prefix: 'Igb',
        productName: 'Ignite UI for Blazor',
        productSpinal: 'ignite-ui-blazor',
        apiPackages: {
            core:          apiPackage('Blazor', 'IgniteUI.Blazor', { pascalCaseMembers: true }),
            charts:        apiPackage('Blazor', 'IgniteUI.Blazor', { pascalCaseMembers: true }),
            grids:         apiPackage('Blazor', 'IgniteUI.Blazor', { pascalCaseMembers: true }),
            gauges:        apiPackage('Blazor', 'IgniteUI.Blazor', { pascalCaseMembers: true }),
            maps:          apiPackage('Blazor', 'IgniteUI.Blazor', { pascalCaseMembers: true }),
            excel:         apiPackage('Blazor', 'IgniteUI.Blazor.Documents.Excel', { pascalCaseMembers: true }),
            spreadsheet:   apiPackage('Blazor', 'IgniteUI.Blazor', { pascalCaseMembers: true }),
            documentsCore: apiPackage('Blazor', 'IgniteUI.Blazor.Documents.Core', { pascalCaseMembers: true }),
            lite:          apiPackage('Blazor', 'IgniteUI.Blazor.Lite', { pascalCaseMembers: true }),
            gridlite:      apiPackage('Blazor', 'IgniteUI.Blazor.GridLite', { pascalCaseMembers: true }),
        },
        packages: {
            common: 'IgniteUI.Blazor',
            charts: 'IgniteUI.Blazor',
            grids: 'IgniteUI.Blazor',
            gauges: 'IgniteUI.Blazor',
            maps: 'IgniteUI.Blazor',
        },
        links: {
            github: 'https://github.com/IgniteUI/igniteui-blazor',
            forums: 'https://www.infragistics.com/community/forums/f/ignite-ui-for-blazor',
            repoSamples: 'https://github.com/IgniteUI/igniteui-blazor-examples/tree/master/samples',
        },
    },
};

let _ctx: PlatformContext | null = null;
let _env: Record<string, string> | null = null;

/**
 * Returns the platform context for the current build.
 * Resolution order: PLATFORM env var → .platform.json → 'React' default.
 *
 * Result is cached for the build lifetime.
 */
export function getPlatformContext(): PlatformContext {
    if (_ctx) return _ctx;

    let name: PlatformName = 'React';

    const envPlatform = process.env.PLATFORM as PlatformName | undefined;
    if (envPlatform && PLATFORMS[envPlatform]) {
        name = envPlatform;
    } else {
        try {
            const cfgPath = path.resolve(process.cwd(), '.platform.json');
            if (fs.existsSync(cfgPath)) {
                const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
                if (cfg.platform && PLATFORMS[cfg.platform as PlatformName]) {
                    name = cfg.platform as PlatformName;
                }
            }
        } catch { /* use default */ }
    }

    _ctx = PLATFORMS[name];
    return _ctx;
}

/**
 * Reads the environment variables for the current build mode.
 * Resolves {environment:key} tokens used by components and the Vite plugin.
 *
 * Returns an empty object if environment.json is not found (e.g. before
 * generate.mjs has run — or when environment.json is absorbed into this config
 * in a full MDX migration).
 */
export function getEnvVars(): Record<string, string> {
    if (_env) return _env;

    const { name } = getPlatformContext();
    const lang = process.env.LANG_CODE ?? 'en';
    const mode = process.env.NODE_ENV ?? 'development';

    // Primary: generated/environment.json (written by generate.mjs when present)
    try {
        const envPath = path.resolve(process.cwd(), 'generated', name, lang, 'environment.json');
        const all = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
        const vars = (all[mode] ?? all['development'] ?? {}) as Record<string, string>;
        if (Object.keys(vars).length > 0) {
            _env = vars;
            return _env;
        }
    } catch { /* fall through to docConfig fallback */ }

    // Fallback: read samplesBrowsers directly from docConfig.json — no generate step needed.
    // This is the only source needed in a full-MDX build where generate.mjs is not run.
    try {
        const docConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'docConfig.json'), 'utf-8'));
        const demosUrl: string = docConfig[name]?.samplesBrowsers?.[mode]
            ?? docConfig[name]?.samplesBrowsers?.['development']
            ?? '';
        _env = {
            dvDemosBaseUrl:      demosUrl,
            demosBaseUrl:        demosUrl,
            infragisticsBaseUrl: 'https://www.infragistics.com',
        };
    } catch {
        _env = {};
    }

    return _env!;
}

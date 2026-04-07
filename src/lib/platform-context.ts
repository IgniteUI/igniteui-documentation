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
     */
    noPackagePrefix?: boolean;
    /**
     * When true the class name casing is preserved as-is (no .toLowerCase()).
     * New-style API sites (react-apis-new, wc-apis-new, blazor-apis-new) use PascalCase URLs.
     */
    preserveCase?: boolean;
    /**
     * Optional suffix appended to the class name before lowercasing, e.g.
     * Angular DV packages append "Component" so `CategoryChart` resolves to
     * `igniteui_angular_charts.igxcategorychartcomponent.html`.
     * Only applied when `prefixed={true}`.
     */
    classSuffix?: string;
}

export interface PlatformContext {
    name: PlatformName;
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

const PLATFORMS: Record<PlatformName, PlatformContext> = {
    Angular: {
        name: 'Angular',
        lower: 'angular',
        prefix: 'Igx',
        productName: 'Ignite UI for Angular',
        productSpinal: 'ignite-ui-angular',
        apiPackages: {
            core:        { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular/21.0.x', packageId: 'igniteui-angular', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            charts:      { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular-charts/latest', packageId: 'igniteui-angular-charts', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            grids:       { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular/21.0.x', packageId: 'igniteui-angular', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            gauges:      { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular-gauges/latest', packageId: 'igniteui-angular-gauges', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            maps:        { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular-maps/latest',        packageId: 'igniteui-angular-maps',        noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            excel:       { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular-excel/latest',       packageId: 'igniteui-angular-excel',       noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            spreadsheet: { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular-spreadsheet/latest', packageId: 'igniteui-angular-spreadsheet', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            inputs:      { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular-inputs/latest',      packageId: 'igniteui-angular-inputs',      noPackagePrefix: true, preserveCase: true },
            layouts:     { docRoot: 'https://staging.infragistics.com/angular-apis-new/angular/igniteui-angular-layouts/latest',     packageId: 'igniteui-angular-layouts',     noPackagePrefix: true, preserveCase: true },
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
        lower: 'react',
        prefix: 'Igr',
        productName: 'Ignite UI for React',
        productSpinal: 'ignite-ui-react',
        apiPackages: {
            core:        { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react/19.5.1', packageId: 'igniteui-react', noPackagePrefix: true, preserveCase: true },
            charts:      { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-charts/latest', packageId: 'igniteui-react-charts', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            grids:       { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-grids/19.5.1', packageId: 'igniteui-react-grids', noPackagePrefix: true, preserveCase: true },
            gauges:      { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-gauges/latest', packageId: 'igniteui-react-gauges', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            maps:        { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-maps/latest',        packageId: 'igniteui-react-maps',        noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            inputs:      { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-inputs/latest',      packageId: 'igniteui-react-inputs',      noPackagePrefix: true, preserveCase: true },
            layouts:     { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-layouts/latest',     packageId: 'igniteui-react-layouts',     noPackagePrefix: true, preserveCase: true },
            excel:       { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-excel/latest',       packageId: 'igniteui-react-excel',       noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            spreadsheet: { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-spreadsheet/latest', packageId: 'igniteui-react-spreadsheet', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            datasources: { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-datasources/latest', packageId: 'igniteui-react-datasources', noPackagePrefix: true, preserveCase: true },
            'grid-lite': { docRoot: 'https://staging.infragistics.com/react-apis-new/react/igniteui-react-grids/19.5.1',       packageId: 'igniteui-react-grids',       noPackagePrefix: true, preserveCase: true },
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
        lower: 'webcomponents',
        prefix: 'Igc',
        productName: 'Ignite UI for Web Components',
        productSpinal: 'ignite-ui-web-components',
        apiPackages: {
            core:        { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents/latest', packageId: 'igniteui-webcomponents', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            charts:      { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-charts/latest', packageId: 'igniteui-webcomponents-charts', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            grids:       { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-grids/latest', packageId: 'igniteui-webcomponents-grids', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            gauges:      { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-gauges/latest', packageId: 'igniteui-webcomponents-gauges', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            maps:        { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-maps/latest',        packageId: 'igniteui-webcomponents-maps',        noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            inputs:      { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-inputs/latest',      packageId: 'igniteui-webcomponents-inputs',      noPackagePrefix: true, preserveCase: true },
            layouts:     { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-layouts/latest',     packageId: 'igniteui-webcomponents-layouts',     noPackagePrefix: true, preserveCase: true },
            excel:       { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-excel/latest',       packageId: 'igniteui-webcomponents-excel',       noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            spreadsheet: { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-spreadsheet/latest', packageId: 'igniteui-webcomponents-spreadsheet', noPackagePrefix: true, preserveCase: true, classSuffix: 'Component' },
            datasources: { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-webcomponents-datasources/latest', packageId: 'igniteui-webcomponents-datasources', noPackagePrefix: true, preserveCase: true },
            'grid-lite': { docRoot: 'https://staging.infragistics.com/wc-apis-new/wc/igniteui-grid-lite/latest',                packageId: 'igniteui-grid-lite',                noPackagePrefix: true, preserveCase: true },
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
        lower: 'blazor',
        prefix: 'Igb',
        productName: 'Ignite UI for Blazor',
        productSpinal: 'ignite-ui-blazor',
        apiPackages: {
            core:        { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor/25.1.x', packageId: 'IgniteUI.Blazor', noPackagePrefix: true, preserveCase: true },
            charts:      { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor/25.1.x', packageId: 'IgniteUI.Blazor', noPackagePrefix: true, preserveCase: true },
            grids:       { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor/25.1.x', packageId: 'IgniteUI.Blazor', noPackagePrefix: true, preserveCase: true },
            gauges:      { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor/25.1.x', packageId: 'IgniteUI.Blazor', noPackagePrefix: true, preserveCase: true },
            maps:        { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor/25.1.x', packageId: 'IgniteUI.Blazor', noPackagePrefix: true, preserveCase: true },
            excel:       { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor/25.1.x', packageId: 'IgniteUI.Blazor', noPackagePrefix: true, preserveCase: true },
            spreadsheet: { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor/25.1.x',         packageId: 'IgniteUI.Blazor',         noPackagePrefix: true, preserveCase: true },
            'grid-lite': { docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor.GridLite/25.1.x', packageId: 'IgniteUI.Blazor.GridLite', noPackagePrefix: true, preserveCase: true },
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
    const mode = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'development';

    // Primary: generated/environment.json (written by generate.mjs when present)
    try {
        const envPath = path.resolve(process.cwd(), 'generated', name, lang, 'environment.json');
        const all = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
        const vars = (all[mode] ?? all['development'] ?? {}) as Record<string, string>;
        if (Object.keys(vars).length > 0) {
            _env = vars;
            return _env;
        }
    } catch { /* fall through */ }

    // Secondary: DOCS_SOURCE_PATH-based environment.json (Angular docs approach)
    try {
        const sourcePath = process.env.DOCS_SOURCE_PATH;
        if (sourcePath) {
            const sourceRoot = path.resolve(sourcePath);
            const parent = path.dirname(sourceRoot);
            const candidates = [
                path.join(sourceRoot, 'en', 'environment.json'),
                path.join(sourceRoot, 'environment.json'),
                path.join(parent, 'environment.json'),
                path.join(parent, 'en', 'environment.json'),
            ];
            const envPath = candidates.find(c => fs.existsSync(c));
            if (envPath) {
                const all = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
                const vars = (all[mode] ?? all['production'] ?? {}) as Record<string, string>;
                if (Object.keys(vars).length > 0) {
                    _env = vars;
                    return _env;
                }
            }
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

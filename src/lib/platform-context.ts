/**
 * Platform configuration implementation — the single source of truth for
 * IgniteUI platform metadata used across Angular, React, WebComponents, and Blazor docs.
 *
 * Types are defined in igniteui-astro-components/lib/types so components can
 * remain agnostic (reading context from Astro.locals set by middleware).
 */

import fs from 'node:fs';
import path from 'node:path';
export type { PlatformName, ApiPackageConfig, PlatformContext } from 'igniteui-astro-components/lib/types';
import type { PlatformName, PlatformContext } from 'igniteui-astro-components/lib/types';
import { API_PLATFORM_CONFIGS, createApiPackages } from './api-platform-config.ts';

const DEFAULT_API_DOCS_BASE_URL = 'https://staging.infragistics.com/api';

const PLATFORMS: Record<PlatformName, PlatformContext> = {
    Angular: {
        name: 'Angular',
        lower: API_PLATFORM_CONFIGS.Angular.folder,
        prefix: API_PLATFORM_CONFIGS.Angular.prefix,
        productName: 'Ignite UI for Angular',
        productSpinal: 'ignite-ui-angular',
        apiPackages: createApiPackages(DEFAULT_API_DOCS_BASE_URL, 'Angular'),
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
        sassApiUrl: 'https://www.infragistics.com/products/ignite-ui-angular/docs/sass/latest',
    },
    React: {
        name: 'React',
        lower: API_PLATFORM_CONFIGS.React.folder,
        prefix: API_PLATFORM_CONFIGS.React.prefix,
        productName: 'Ignite UI for React',
        productSpinal: 'ignite-ui-react',
        apiPackages: createApiPackages(DEFAULT_API_DOCS_BASE_URL, 'React'),
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
        lower: API_PLATFORM_CONFIGS.WebComponents.folder,
        prefix: API_PLATFORM_CONFIGS.WebComponents.prefix,
        productName: 'Ignite UI for Web Components',
        productSpinal: 'ignite-ui-web-components',
        apiPackages: createApiPackages(DEFAULT_API_DOCS_BASE_URL, 'WebComponents'),
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
        lower: API_PLATFORM_CONFIGS.Blazor.folder,
        prefix: API_PLATFORM_CONFIGS.Blazor.prefix,
        productName: 'Ignite UI for Blazor',
        productSpinal: 'ignite-ui-blazor',
        apiPackages: createApiPackages(DEFAULT_API_DOCS_BASE_URL, 'Blazor'),
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


function getBuildMode(): string {
    return process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'development';
}

function getApiDocsBaseUrl(): string {
    const mode = getBuildMode();
    const value = process.env.API_DOCS_BASE_URL
        ?? (mode === 'production'
            ? 'https://www.infragistics.com/api'
            : 'https://staging.infragistics.com/api');

    const trimmed = value.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

function getApiLinkIndexName(): string {
    return process.env.API_LINK_INDEX_VERSION
        ?? (getBuildMode() === 'production' ? 'prod-latest' : 'staging-latest');
}

function loadApiLinkIndex(platformSlug: string): PlatformContext['apiLinkIndex'] {
    try {
        const file = path.resolve(process.cwd(), 'src', 'data', 'api-link-index', platformSlug, `${getApiLinkIndexName()}.json`);
        if (!fs.existsSync(file)) return undefined;
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
        return undefined;
    }
}

/**
 * Returns the platform context for the current build.
 * Resolution order: PLATFORM env var → .platform.json → 'React' default.
 *
 * Result is cached for the build lifetime.
 */
function buildContext(name: PlatformName): PlatformContext {
    const apiDocsBaseUrl = getApiDocsBaseUrl();
    const base = PLATFORMS[name];
    return {
        ...base,
        apiLinkIndex: loadApiLinkIndex(base.lower),
        apiPackages: Object.fromEntries(
            Object.entries(base.apiPackages).map(([key, pkg]) => [
                key,
                {
                    ...pkg,
                    docRoot: pkg.docRoot
                        .replace(DEFAULT_API_DOCS_BASE_URL, apiDocsBaseUrl),
                },
            ])
        ),
    };
}

/**
 * Returns the platform context for the current build.
 *
 * When `name` is provided it is used directly.
 * Otherwise resolution order: PLATFORM env var → .platform.json → 'React' default.
 *
 * Passing an explicit name bypasses caching so each call with a different name
 * returns the correct context. The no-arg form is cached for the build lifetime.
 */
export function getPlatformContext(name?: PlatformName): PlatformContext {
    if (name) return buildContext(name);

    if (_ctx) return _ctx;

    let resolved: PlatformName = 'React';

    const envPlatform = process.env.PLATFORM as PlatformName | undefined;
    if (envPlatform && PLATFORMS[envPlatform]) {
        resolved = envPlatform;
    } else {
        try {
            const cfgPath = path.resolve(process.cwd(), '.platform.json');
            if (fs.existsSync(cfgPath)) {
                const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
                if (cfg.platform && PLATFORMS[cfg.platform as PlatformName]) {
                    resolved = cfg.platform as PlatformName;
                }
            }
        } catch { /* use default */ }
    }

    _ctx = buildContext(resolved);
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
    const mode = getBuildMode();

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
        const projectRoot = process.env.DOCS_PROJECT_ROOT ?? process.cwd();
        const docConfig = JSON.parse(fs.readFileSync(path.resolve(projectRoot, 'docConfig.json'), 'utf-8'));
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

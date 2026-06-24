import path from 'node:path';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS, type NavLang } from 'docs-template/platform';
import mdx from '@astrojs/mdx';

// ---------------------------------------------------------------------------
// Platform selection
// Priority: PLATFORM env var → .platform.json (written by generate.mjs) → 'React'
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Preserve the project root before chdir so platform-context.ts can find docConfig.json.
process.env.DOCS_PROJECT_ROOT = __dirname;
// When --outDir=../../dist/* points outside docs/xplat/, Astro's getOutDirWithinCwd()
// falls back to .astro/ as serverRoot, causing image generation to ENOENT.
// Changing CWD to the repo root makes dist/* start with CWD, so serverRoot is correct.
// Astro resolves --outDir against the project root (not CWD), so that path is unaffected.
process.chdir(path.join(__dirname, '../..'));

function resolveSetting(envKey: string, jsonKey: string, fallback: string): string {
    if (process.env[envKey]) return process.env[envKey]!;
    try {
        const file = path.join(__dirname, '.platform.json');
        if (existsSync(file)) {
            const cfg = JSON.parse(readFileSync(file, 'utf8'));
            if (cfg[jsonKey]) return cfg[jsonKey];
        }
    } catch { /* ignore */ }
    return fallback;
}

const platform = resolveSetting('PLATFORM', 'platform', 'React');
const lang = resolveSetting('LANG_CODE', 'lang', 'en') as NavLang;

// DOCS_ENV: 'development' | 'staging' | 'production'  (preferred, default: 'development')
// NODE_ENV: fallback — do NOT set to 'staging'; Vite derives import.meta.env.DEV from it.
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';

if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
	throw new Error(
		`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`
	);
}

const mode: DocsMode = docsEnv;

const PLATFORMS = IGDOCS_PLATFORMS;

const PLATFORM_META: Record<string, { title: string; description: string }> = {
    Angular:       { title: 'Ignite UI for Angular',       description: 'Reference docs for Ignite UI for Angular.'       },
    React:         { title: 'Ignite UI for React',         description: 'Reference docs for Ignite UI for React.'         },
    WebComponents: { title: 'Ignite UI for Web Components', description: 'Reference docs for Ignite UI for Web Components.' },
    Blazor:        { title: 'Ignite UI for Blazor',        description: 'Reference docs for Ignite UI for Blazor.'        },
};

const PLATFORM_KEY: Record<string, string> = {
    Angular: 'angular', React: 'react', WebComponents: 'web-components', Blazor: 'blazor',
};

const PLATFORM_SITE: Record<string, string> = {
    Angular:       'https://www.infragistics.com/products/ignite-ui-angular/angular/components',
    React:         'https://www.infragistics.com/products/ignite-ui-react/react/components',
    WebComponents: 'https://www.infragistics.com/products/ignite-ui-web-components/web-components/components',
    Blazor:        'https://www.infragistics.com/products/ignite-ui-blazor/blazor/components',
};

const meta      = PLATFORM_META[platform] ?? PLATFORM_META['React'];
const XPLAT_ROOT = path.join(__dirname, 'generated', platform, lang);

// Resolved once at config time, used by vitePluginPlatformTokens to substitute
// {environment:dvDemosBaseUrl} and {environment:demosBaseUrl} tokens correctly
// for each platform (e.g. blazor-client for Blazor, react-demos for React).
const demosBaseUrl = (() => {
    try {
        const docConfig = JSON.parse(readFileSync(path.join(__dirname, 'docConfig.json'), 'utf8'));
        return docConfig[platform]?.samplesBrowsers?.[mode]
            ?? docConfig[platform]?.samplesBrowsers?.['production']
            ?? '';
    } catch { return ''; }
})();

// ---------------------------------------------------------------------------
// Vite plugin: resolve docConfig tokens in .mdx files before MDX compilation
//
// In MDX, {Platform} is a JSX expression — if Platform is undefined it throws.
// This pre-transform replaces all {Token} patterns with their per-platform
// values from docConfig.json before the MDX compiler ever sees the source.
// Image paths (../images/) are also normalized to /images/ here.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _replacements: Array<{ name: string; value: string }> | null = null;

function getReplacements(): Array<{ name: string; value: string }> {
    if (_replacements) return _replacements;
    try {
        const docConfig = JSON.parse(readFileSync(path.join(__dirname, 'docConfig.json'), 'utf8'));
        _replacements = ((docConfig[platform]?.replacements ?? []) as Array<{ name?: string; value?: string }>)
            .filter((r): r is { name: string; value: string } => !!(r.name && r.value !== undefined))
            .sort((a, b) => b.name.length - a.name.length);
    } catch {
        _replacements = [];
    }
    return _replacements;
}

/**
 * Build {Component*} replacements for a given component key (e.g. "Grid").
 * Maps {GridTitle} → {ComponentTitle}, {GridName} → {ComponentName}, etc.
 */
function getComponentReplacements(componentKey: string): Array<{ name: string; value: string }> {
    const prefix = `{${componentKey}`;
    return getReplacements()
        .filter(r => r.name.startsWith(prefix))
        .map(r => ({
            name:  `{Component${r.name.slice(prefix.length)}`,
            value: r.value,
        }))
        .sort((a, b) => b.name.length - a.name.length);
}

/**
 * Depth-aware inliner for <PlatformBlock for="..."> tags.
 *
 * The naive non-greedy regex approach breaks when PlatformBlocks are nested:
 * the outer opener matches the first inner closer, leaving the outer closer
 * as an orphan that MDX then refuses to parse.
 *
 * This function walks the string once, tracking nesting depth with a stack
 * so each opener is always paired with its correct matching closer.
 */
function inlinePlatformBlocks(content: string, plat: string): string {
    const openRe  = /<PlatformBlock\s+for="([^"]+)">/g;
    const closeRe = /<\/PlatformBlock>/g;

    let result = '';
    let pos = 0;

    while (pos < content.length) {
        openRe.lastIndex  = pos;
        closeRe.lastIndex = pos;
        const openMatch  = openRe.exec(content);
        const closeMatch = closeRe.exec(content);
        const openPos    = openMatch  ? openMatch.index  : Infinity;
        const closePos   = closeMatch ? closeMatch.index : Infinity;

        if (openPos === Infinity && closePos === Infinity) {
            result += content.slice(pos);
            break;
        }

        if (closePos < openPos) {
            // Orphaned closer — pass through verbatim so MDX error is visible
            result += content.slice(pos, closePos + closeMatch![0].length);
            pos = closePos + closeMatch![0].length;
            continue;
        }

        // Opener comes first — append literal text up to it
        result += content.slice(pos, openPos);
        const platforms = openMatch![1].split(',').map((s: string) => s.trim());
        const keep      = platforms.includes(plat);
        const bodyStart = openPos + openMatch![0].length;

        // Walk forward to find the correctly nested closing tag
        let depth = 1;
        let searchPos = bodyStart;
        let bodyEnd   = content.length;
        let closerEnd = content.length;

        while (depth > 0) {
            openRe.lastIndex  = searchPos;
            closeRe.lastIndex = searchPos;
            const nextOpen  = openRe.exec(content);
            const nextClose = closeRe.exec(content);
            const nop = nextOpen  ? nextOpen.index  : Infinity;
            const ncp = nextClose ? nextClose.index : Infinity;

            if (ncp === Infinity) {
                // Malformed — no matching closer; consume to end
                bodyEnd = closerEnd = content.length;
                depth = 0;
            } else if (ncp < nop) {
                depth--;
                if (depth === 0) {
                    bodyEnd   = ncp;
                    closerEnd = ncp + nextClose![0].length;
                } else {
                    searchPos = ncp + nextClose![0].length;
                }
            } else {
                depth++;
                searchPos = nop + nextOpen![0].length;
            }
        }

        if (keep) {
            // Recurse so nested PlatformBlocks inside kept content are also resolved
            result += inlinePlatformBlocks(content.slice(bodyStart, bodyEnd), plat);
        }

        pos = closerEnd;
    }

    return result;
}

function vitePluginPlatformTokens() {
    return {
        name: 'vite-platform-tokens',
        enforce: 'pre' as const,  // run before @astrojs/mdx compiles the source
        transform(code: string, id: string) {
            if (!id.endsWith('.mdx')) return null;

            let result = code;

            // 0. Inline <PlatformBlock for="..."> — keep content for matching platform,
            // strip for others. Must run before MDX compilation so fenced code blocks
            // inside PlatformBlock end up at document top level where expressive-code can
            // process them. Uses a depth-aware parser to correctly handle nested blocks.
            result = inlinePlatformBlocks(result, platform);
            // Remove the now-unused PlatformBlock import (if any)
            result = result.replace(/^import PlatformBlock from '[^']+';?\r?\n/m, '');

            // 1. If the file has _componentKey frontmatter, resolve {Component*} tokens first
            const compKeyMatch = result.match(/^---[\s\S]*?^_componentKey:\s*(\w+)/m);
            if (compKeyMatch) {
                for (const { name, value } of getComponentReplacements(compKeyMatch[1])) {
                    result = result.replaceAll(name, value);
                }
            }

            // 2. Apply all docConfig replacements ({Platform}, {PackageCore}, etc.)
            for (const { name: token, value } of getReplacements()) {
                result = result.replaceAll(token, value);
            }

            // 3. Replace legacy {environment:key} docfx tokens.
            result = result.replace(/\{environment:([^}]+)\}/g, (_m, key) => {
                const ENV_MAP: Record<string, string> = {
                    infragisticsBaseUrl:  'https://www.infragistics.com',
                    sassApiUrl:           'https://www.infragistics.com/products/ignite-ui-angular/docs/sass/latest',
                    angularApiUrl:        'https://www.infragistics.com/products/ignite-ui-angular/docs/typescript/latest',
                    AngularApiUrl:        'https://www.infragistics.com/products/ignite-ui-angular/docs/typescript/latest',
                    wcApiUrl:             'https://www.infragistics.com/products/ignite-ui-web-components/docs/typescript/latest',
                    WebComponentsApiUrl:  'https://www.infragistics.com/products/ignite-ui-web-components/docs/typescript/latest',
                    ReactApiUrl:          'https://www.infragistics.com/products/ignite-ui-react/docs/typescript/latest',
                    BlazorApiUrl:         'https://www.infragistics.com/products/ignite-ui-blazor/docs/typescript/latest',
                    dvDemosBaseUrl:       demosBaseUrl,
                    demosBaseUrl:         demosBaseUrl,
                };
                return ENV_MAP[key] ?? '';
            });

            // 4. Replace any remaining unresolved doc-style tokens so MDX doesn't
            // try to evaluate them as JS expressions and throw at runtime.
            //
            // Two patterns to clean up:
            //   a) Tokens with hyphens or underscores in suffix: {PackageVerChanges-25-1-OCT_2} → strip braces
            //      Character class includes underscore so e.g. OCT_2 is handled correctly.
            //   b) UpperCamelCase docfx tokens: {PackageAngularComponents} → empty string
            //      (these are platform-specific tokens absent from the current platform)
            result = result.replace(/\{([A-Za-z][A-Za-z0-9]*(?:[-][A-Za-z0-9._]+)+)\}/g, (_m, inner) => inner);
            // Strip remaining {UpperCamelCase} docfx-style tokens (2+ capital-started words
            // concatenated, e.g. {PackageAngularComponents}, {ComponentTitle}).
            // Guards: the name must be ≥2 uppercase words mashed together (PascalCase with
            // at least one interior uppercase letter), and NOT be a valid JS identifier
            // that was intentionally exported (those would already be resolved above).
            result = result.replace(/\{([A-Z][A-Za-z0-9]*[A-Z][A-Za-z0-9]*)\}/g, () => '');

            return result === code ? null : { code: result, map: null };
        },
    };
}

// ---------------------------------------------------------------------------
// TOC filtering — replaces the toc-generation step from generate.mjs
// Reads src/content/{lang}/toc.json, filters by platform, substitutes tokens,
// writes to generated/{platform}/{lang}/components/toc.json.
// ---------------------------------------------------------------------------

function buildFilteredToc(): string {
    const srcToc = path.join(__dirname, 'src', 'content', lang, 'toc.json');
    const outToc = path.join(XPLAT_ROOT, 'components', 'toc.json');

    if (!existsSync(srcToc)) return outToc;

    const tokens: Record<string, string> = {};
    for (const { name, value } of getReplacements()) tokens[name] = value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function filterNodes(nodes: any[]): any[] {
        if (!Array.isArray(nodes)) return [];
        return nodes
            .filter(n => !Array.isArray(n.exclude) || !n.exclude.includes(platform))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ exclude, platforms, ...rest }) => {
                // Apply platform-specific badge overrides, e.g.:
                //   "platforms": { "Blazor": { "new": false, "preview": true } }
                if (platforms && typeof platforms === 'object' && platforms[platform]) {
                    const override = platforms[platform];
                    for (const key of ['new', 'preview', 'updated', 'premium'] as const) {
                        if (key in override) rest[key] = override[key];
                    }
                }
                if (typeof rest.name === 'string') {
                    for (const [token, value] of Object.entries(tokens)) {
                        rest.name = (rest.name as string).replaceAll(token, value);
                    }
                }
                if (Array.isArray(rest.items)) rest.items = filterNodes(rest.items);
                return rest;
            });
    }

    const filtered = filterNodes(JSON.parse(readFileSync(srcToc, 'utf8')));
    mkdirSync(path.dirname(outToc), { recursive: true });
    writeFileSync(outToc, JSON.stringify(filtered, null, 2), 'utf8');
    console.log(`[astro.config] toc.json → ${platform}/${lang}`);
    return outToc;
}

const filteredTocPath = buildFilteredToc();

console.log(`[astro.config] Platform: ${platform}  lang: ${lang}  mode: ${mode}`);
const PROD_HOST = lang === 'jp' ? 'https://jp.infragistics.com' : 'https://www.infragistics.com';
const STAGING_HOST = lang === 'jp' ? 'https://jp.staging.infragistics.com' : 'https://staging.infragistics.com';

const platformLangKey = lang === 'jp' ? `${platform}JP` : platform;
const p = PLATFORMS[platformLangKey] ?? PLATFORMS[platform];
const site = mode === 'production' ? `${PROD_HOST}${p.base}`
    : mode === 'staging' ? `${STAGING_HOST}${p.base}`
    : `http://localhost:${p.devPort}`;


console.log(`[astro.config] Platform: ${platform}  lang: ${lang}  mode: ${mode}  site: ${site}`);

// https://astro.build/config
export default createDocsSite({
    site,
    base: mode !== 'development' ? p.base : undefined,
    title: p.title,
    description: p.description,
    platform: p.key,
    navLang: lang,
    mode,
    build: {
        format: 'file'
    },
    trailingSlash: 'never',
    source: {
        tocPath: filteredTocPath,
        docsDir: path.join(XPLAT_ROOT, 'components'),
    },
    productLinks: Object.values(PLATFORMS)
        .filter(p => p.lang === lang)
        .map(({ label, key, base: b }) => ({
            label,
            href: mode === 'production' ? `${PROD_HOST}${b}` : `${STAGING_HOST}${b}`,
            platform: key,
        })),
    packages: Object.values(PLATFORMS)
        .filter(p => p.lang === lang)
        .map(({ label, key, base: b }) => ({
            label,
            value: key,
            href: mode === 'production' ? `${PROD_HOST}${b}/` : `${STAGING_HOST}${b}/`,
        })),
    selectedPackage: p.key,
    head: [
        { tag: 'link', attrs: { rel: 'icon', href: `${mode !== 'development' ? p.base : ''}/favicon.ico`, type: 'image/x-icon' } },
    ],
    integrations: [
        mdx(),
        {
            name: 'watch-docs-template',
            hooks: {
                'astro:server:setup': ({ server }) => {
                    server.watcher.add(path.resolve(__dirname, '../../src'));
                },
            },
        },
    ],
    vite: {
        plugins: [
            vitePluginPlatformTokens(),
        ],
        resolve: {
            alias: {
                '@xplat-images': path.resolve(__dirname, 'src/assets/images'),
            },
        },
        server: {
            fs: { strict: false },
            ...(mode === 'development' && platform === 'Blazor' && demosBaseUrl ? {
                proxy: {
                    '/code-viewer': { target: demosBaseUrl, changeOrigin: true, secure: false },
                },
            } : {}),
        },
    },
});

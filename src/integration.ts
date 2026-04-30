/**
 * integration.ts
 *
 * Shared configuration helpers for Astro + Starlight docs sites.
 * All functions are independently usable; `createDocsSite` is the
 * convenience wrapper that composes them all.
 *
 * --- Option A: one-liner config (recommended for standard setups) ---
 *
 *   import { createDocsSite } from 'docs-template/integration';
 *
 *   export default createDocsSite({
 *     site:  'https://my-org.github.io/my-docs',
 *     title: 'My Library',
 *     description: 'Reference docs for My Library.',
 *     platform: 'angular',   // drives CDN head entries + nav prefetch
 *     navLang: 'en',         // 'en' | 'jp' | 'kr'
 *     source: {
 *       tocPath:  './my-docs/toc.yml',
 *       docsDir:  './my-docs/en/components',
 *       imagesDir: './my-docs/en/images',   // omit to skip image serving
 *     },
 *     sidebar: { exclude: [/^internal\//] },   // optional TOC excludes
 *     head: [                                   // extra <head> entries after platform ones
 *       { tag: 'link', attrs: { rel: 'stylesheet', href: '...' } },
 *     ],
 *     // Extra Starlight options (logo, social, editLink, customCss, …)
 *     starlight: {
 *       logo: { src: './public/favicon.svg' },
 *     },
 *     // Extra Astro options (markdown, image, build, …)
 *     markdown: { remarkPlugins: [] },
 *   });
 *
 * --- Option B: manual composition (for full control) ---
 *
 *   import { buildSidebarFromToc, staticImagesIntegration, siteMetaIntegration } from 'docs-template/integration';
 *
 *   const sidebar = buildSidebarFromToc({ tocPath, docsDir });
 *
 *   export default defineConfig({
 *     integrations: [
 *       siteMetaIntegration({ title: 'My Library', description: 'Reference docs.' }),
 *       starlight({ sidebar }),
 *       staticImagesIntegration('/abs/path/to/my-docs/images'),
 *     ],
 *   });
 *
 * Generated output:
 *   /llms.txt              — manifest listing every page with its .md URL
 *   /{slug}.md             — raw markdown for each page (env-vars substituted)
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { createIndex as pagefindCreateIndex } from 'pagefind';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import type { AstroIntegration } from 'astro';
import mdx from '@astrojs/mdx';
import {
    buildLlmsTxt, buildLlmsMetaMap, getBroadSectionsForPlatform, toUrlSlug,
    type LlmsMeta, type LlmsSet, type SidebarItem,
} from './llms.ts';
import { buildSidebarFromToc } from './sidebar';
import { getNavConfig, getPlatformHead } from './platform';
import type { HeadEntry, PlatformKey, NavLang } from './platform.ts';
import { JSDOM } from 'jsdom';
import { remarkDocfx, rehypeCodeView } from './plugins/remark-docfx';

/** Build / deployment mode. Drives env-var `DOCS_BUILD_MODE`. */
export type DocsMode = 'development' | 'staging' | 'production';

/** Module-level cache so the nav URL is fetched at most once per build. */
let _navHtmlCache: string | null = null;

/**
 * Read `themeApiUrl` and `themingWidgetVersion` from the project's
 * environment.json at build time. Mirrors the lookup order in remark-docfx.ts
 * so both always resolve from the same file.
 */
function readThemingEnv(sourcePath: string | undefined, envKey: string): {
    themeApiUrl: string;
    widgetVersion: string;
} {
    if (!sourcePath) return { themeApiUrl: '', widgetVersion: 'latest' };
    const root = path.resolve(sourcePath);
    const parent = path.dirname(root);
    const candidates = [
        path.join(root, 'en', 'environment.json'),
        path.join(root, 'environment.json'),
        path.join(parent, 'environment.json'),
        path.join(parent, 'en', 'environment.json'),
    ];
    const envPath = candidates.find(c => fs.existsSync(c));
    if (!envPath) return { themeApiUrl: '', widgetVersion: 'latest' };
    try {
        const data = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
        const env = data[envKey] ?? data.production ?? {};
        return {
            themeApiUrl: (env.themeApiUrl as string) ?? '',
            widgetVersion: (env.themingWidgetVersion as string) ?? 'latest',
        };
    } catch {
        return { themeApiUrl: '', widgetVersion: 'latest' };
    }
}

/**
 * Strip all <script> tags from an HTML string.
 * The nav HTML fetched from infragistics.com / appbuilder.dev may contain
 * inline or external scripts that don't belong in the docs page (e.g.
 * staging.appbuilder.dev references in the IG nav).  Platform-specific
 * scripts are already injected cleanly via getPlatformHead().
 */
function stripScripts(html: string): string {
    const dom = new JSDOM(html);
    const { document } = dom.window;

    document.querySelectorAll('script').forEach((el) => {
        el.remove();
    });

    return document.body.innerHTML;
}

/**
 * Rewrite root-relative href/src/action attributes in nav HTML to absolute
 * URLs using the given base origin (e.g. 'https://www.infragistics.com').
 *
 * Without this, links like href="/products/ignite-ui" resolve against the
 * local dev-server origin and Astro's client-side router intercepts them,
 * logging 404 warnings for every nav-bar link the user hovers or clicks.
 */
function absolutifyNavUrls(html: string, baseOrigin: string): string {
    return html
        .replace(/(href|src|action)="(\/)([^"]*)"/g, `$1="${baseOrigin}/$3"`)
        .replace(/(href|src|action)='(\/)([^']*)'/g, `$1='${baseOrigin}/$3'`);
}

/**
 * Nesting-aware outer-HTML extractor.
 * Finds the first tag whose opening tag matches `openPattern` and returns
 * the complete element including its closing tag.
 *
 * @param html - Full HTML string to search.
 * @param openPattern - Regex source for the opening tag (no flags).
 */
function extractOuterHtml(html: string, openPattern: string): string {
    const openRe = new RegExp(openPattern, 'i');
    const tagRe = /<\/?([a-z][a-z0-9]*)[^>]*>/gi;

    let tagName: string | null = null;
    let depth = 0;
    let startIdx = -1;

    let m: RegExpExecArray | null;
    while ((m = tagRe.exec(html)) !== null) {
        const full = m[0];
        const name = m[1].toLowerCase();
        const isSelfClose = full.endsWith('/>');
        const isClose = full.startsWith('</');

        if (tagName === null) {
            if (openRe.test(full)) {
                tagName = name;
                startIdx = m.index;
                depth = isSelfClose ? 0 : 1;
                if (depth === 0) return full;
            }
            continue;
        }

        if (name !== tagName) continue;
        if (isSelfClose) continue;
        if (isClose) { depth--; if (depth === 0) return html.slice(startIdx, tagRe.lastIndex); }
        else depth++;
    }

    return '';
}

// ---------------------------------------------------------------------------
// Site meta virtual module
// ---------------------------------------------------------------------------

export interface ProductLink {
    /** Display label shown in the DocsSubHeader, e.g. `"Angular"`. */
    label: string;
    /** Absolute or root-relative href to the sibling docs site. */
    href: string;
    /**
     * Optional platform key (matches `PlatformKey`).
     * When it equals the current build's platform the link is omitted from the DocsSubHeader.
     */
    platform?: PlatformKey;
}

export interface SiteMetaOptions {
    title: string;
    description?: string;
    /** Path to the source markdown files. */
    docsDir?: string;
    sidebar?: SidebarItem[];
    platform?: PlatformKey | null;
    navLang?: NavLang;
    /** Build / deployment mode. Exposed via `process.env.DOCS_BUILD_MODE`. */
    mode?: DocsMode;
    /** Named documentation subsets linked from llms.txt. */
    llmsSets?: LlmsSet[];
    /** Cross-product navigation links rendered in the DocsSubHeader. */
    productLinks?: ProductLink[];
    /**
     * Extra `<head>` entries injected via the `virtual:docs-template/site-meta`
     * module and rendered by `MainLayout.astro`.
     */
    head?: HeadEntry[];
    /** @deprecated Use `platform` instead. */
    prefetchNav?: boolean;
    /** @deprecated Use `platform: 'appbuilder'` instead. */
    prefetchAppBuilderNav?: boolean;
}

/**
 * Strip MDX-specific syntax from a source file so the `.md` endpoint
 * served to LLM crawlers contains clean markdown instead of JSX.
 *
 * Removes:
 *  - `import … from '…'` lines at the top of the file
 *  - Self-closing JSX components: <Sample …/>, <ApiRef …/>, <ApiLink …/>
 *  - Block JSX components: <ApiRef …>…</ApiRef>
 *  - Inline <style>{`…`}</style> blocks
 */
function stripMdxForLlms(raw: string): string {
    return raw
        // Remove all import lines
        .replace(/^import\s+.+from\s+['"][^'"]+['"];?\r?\n/gm, '')
        // Remove <style>{`...`}</style> blocks (multiline)
        .replace(/<style>\{`[\s\S]*?`\}<\/style>\s*/g, '')
        // Remove self-closing components: <Sample … />, <ApiRef … />, <ApiLink … />
        .replace(/<(Sample|ApiRef|ApiLink|ComponentBlock|PlatformBlock)\b[^>]*\/>\s*/g, '')
        // Remove paired components: <ApiRef …>…</ApiRef>
        .replace(/<(ApiRef|ApiLink|ComponentBlock|PlatformBlock)\b[^>]*>[\s\S]*?<\/\1>\s*/g, '')
        // Collapse 3+ blank lines left behind into 2
        .replace(/\n{3,}/g, '\n\n')
        .trim() + '\n';
}

/**
 * Astro integration that exposes site metadata as the virtual module
 * `virtual:docs-template/site-meta` and generates /llms.txt at build time.
 */
export function siteMetaIntegration({
    title,
    description = '',
    docsDir,
    sidebar,
    platform = null,
    navLang = 'en',
    mode = 'development',
    llmsSets = [],
    productLinks = [],
    head = [],
    prefetchNav = false,
    prefetchAppBuilderNav = false,
}: SiteMetaOptions = {} as SiteMetaOptions): AstroIntegration {
    const llmsMetaMap = docsDir
        ? buildLlmsMetaMap(docsDir, sidebar ?? [])
        : new Map<string, LlmsMeta>();

    const virtualId = 'virtual:docs-template/site-meta';
    const resolvedId = '\0' + virtualId;

    const navVirtualId = 'virtual:docs-template/nav-html';
    const navResolvedId = '\0' + navVirtualId;

    // Resolve effective platform: explicit `platform` option wins; fall back to
    // deprecated boolean flags for backwards compatibility.
    const effectivePlatform: PlatformKey | null =
        platform ??
        (prefetchAppBuilderNav ? 'appbuilder' : null) ??
        (prefetchNav ? 'angular' : null);

    const { navType, navUrl } = getNavConfig(effectivePlatform, navLang);

    // Navigation buckets for this platform — stripped from ancestor paths during label generation.
    const broadSections = getBroadSectionsForPlatform(effectivePlatform);
    const moduleCode = `export const title = ${JSON.stringify(title)};
export const sidebar = ${JSON.stringify(sidebar ?? [])};
export const productLinks = ${JSON.stringify(productLinks)};
export const headEntries = ${JSON.stringify(head ?? [])};
`;

    // Captured from astro:config:done; used to generate llms.txt content.
    let configuredSite = '';

    return {
        name: 'docs-template:site-meta',
        hooks: {
            'astro:config:done'({ config }) {
                configuredSite = (config.site?.toString() ?? '').replace(/\/$/, '');
            },
            'astro:config:setup'({ updateConfig, injectRoute }) {
                injectRoute({
                    pattern: '/sitemap.xml',
                    entrypoint: fileURLToPath(new URL('./routes/sitemap.xml.ts', import.meta.url)),
                    prerender: true,
                });

                // Inject the dynamic doc-page route so consuming projects don't
                // need their own [...slug].astro. Project pages take priority over
                // injected routes, so the template's own src/pages/[...slug].astro
                // still wins when the template is used standalone.
                injectRoute({
                    pattern: '/[...slug]',
                    entrypoint: fileURLToPath(new URL('./routes/[...slug].astro', import.meta.url)),
                    prerender: true,
                });


                // Configure Sass loadPaths so bare `highlight.js/scss/vs2015`
                // imports in the platform theme files resolve from node_modules.
                updateConfig({
                    vite: {
                        css: {
                            preprocessorOptions: {
                                scss: {
                                    loadPaths: [path.join(process.cwd(), 'node_modules')],
                                    // The if-function deprecation originates inside
                                    // igniteui-theming (vendor code we cannot modify).
                                    silenceDeprecations: ['if-function'],
                                },
                            },
                        },
                    },
                });
                updateConfig({
                    vite: {
                        plugins: [{
                            name: 'vite-plugin-docs-template-site-meta',
                            resolveId(id: string) {
                                if (id === virtualId) return resolvedId;
                                if (id === navVirtualId) return navResolvedId;
                            },
                            async load(id: string) {
                                if (id === resolvedId) return moduleCode;
                                if (id !== navResolvedId) return;

                                // Return cached module code — fetched at most once per build.
                                if (_navHtmlCache) return _navHtmlCache;

                                // ── Theming env ──────────────────────────────────────────────
                                const envKey = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'production';
                                const { themeApiUrl, widgetVersion } = readThemingEnv(process.env.DOCS_SOURCE_PATH, envKey);
                                const widgetScriptSrc = widgetVersion
                                    ? `https://cdn-na.infragistics.com/igniteui/theming-widget/${widgetVersion}/igniteui-theming-widget.js`
                                    : '';

                                let headerHtml = '';
                                let uiFooterHtml = '';
                                let footerHtml = '';

                                // ── IG nav prefetch ──────────────────────────────────────────
                                if (navType === 'infragistics' && navUrl) {
                                    try {
                                        const res = await fetch(navUrl, {
                                            credentials: 'omit',
                                            signal: AbortSignal.timeout(15_000),
                                        });
                                        if (res.ok) {
                                            const html = await res.text();
                                            const igBase = navLang === 'jp' ? 'https://jp.infragistics.com' : 'https://www.infragistics.com';
                                            headerHtml = absolutifyNavUrls(stripScripts(extractOuterHtml(html, '<header[^>]+id="header"')), igBase);
                                            uiFooterHtml = absolutifyNavUrls(stripScripts(extractOuterHtml(html, '<footer[^>]+class="[^"]*\\bui-footer\\b')), igBase);
                                            footerHtml = absolutifyNavUrls(stripScripts(extractOuterHtml(html, '<footer[^>]+id="footer"')), igBase);
                                            // Strip the hello-bar promotional strip
                                            headerHtml = headerHtml.replace(
                                                /<div[^>]+id="hello-bar"[\s\S]*?<\/div>\s*/i, ''
                                            );
                                        } else {
                                            console.warn(`[docs-template] Navigation fetch returned ${res.status} — falling back to empty markup.`);
                                        }
                                    } catch (err: unknown) {
                                        console.warn(`[docs-template] Could not fetch navigation HTML: ${(err as Error).message} — falling back to empty markup.`);
                                    }
                                }

                                // ── AppBuilder nav prefetch ──────────────────────────────────
                                let abHeaderHtml = '';
                                let abFooterHtml = '';
                                let abFooterUtilsHtml = '';
                                let abFooterCopyrightHtml = '';
                                let abContactSalesHtml = '';

                                if (navType === 'appbuilder' && navUrl) {
                                    try {
                                        const abRes = await fetch(navUrl, {
                                            credentials: 'omit',
                                            signal: AbortSignal.timeout(15_000),
                                        });
                                        if (abRes.ok) {
                                            const abRaw = await abRes.text();
                                            // Endpoint may return JSON { header, footer } or a full HTML page.
                                            let parsed = false;
                                            try {
                                                const data = JSON.parse(abRaw) as { header?: string; footer?: string };
                                                if (data.header || data.footer) {
                                                    abHeaderHtml = data.header ?? '';
                                                    abFooterHtml = data.footer ?? '';
                                                    parsed = true;
                                                }
                                            } catch { /* not JSON — fall through to HTML extraction */ }

                                            if (!parsed) {
                                                abHeaderHtml = extractOuterHtml(abRaw, '<header');
                                                abFooterHtml = extractOuterHtml(abRaw, '<footer');
                                                abFooterUtilsHtml = extractOuterHtml(abRaw, '<[a-z][a-z0-9]*[^>]+class="[^"]*\\bfooter-utils\\b');
                                                abFooterCopyrightHtml = extractOuterHtml(abRaw, '<[a-z][a-z0-9]*[^>]+class="[^"]*\\bfooter-copyright\\b');
                                                abContactSalesHtml = extractOuterHtml(abRaw, '<[a-z][a-z0-9]*[^>]+id="contactSales"');
                                            }
                                        } else {
                                            console.warn(`[docs-template] AppBuilder nav fetch returned ${abRes.status} — falling back to runtime loading.`);
                                        }
                                    } catch (err: unknown) {
                                        console.warn(`[docs-template] Could not prefetch AppBuilder navigation: ${(err as Error).message} — falling back to runtime loading.`);
                                    }
                                }

                                _navHtmlCache = [
                                    `export const platform = ${JSON.stringify(effectivePlatform ?? null)};`,
                                    `export const navLang = ${JSON.stringify(navLang)};`,
                                    `export const themeApiUrl = ${JSON.stringify(themeApiUrl)};`,
                                    `export const widgetScriptSrc = ${JSON.stringify(widgetScriptSrc)};`,
                                    `export const prefetched = ${JSON.stringify(!!headerHtml)};`,
                                    `export const headerHtml = ${JSON.stringify(headerHtml)};`,
                                    `export const uiFooterHtml = ${JSON.stringify(uiFooterHtml)};`,
                                    `export const footerHtml = ${JSON.stringify(footerHtml)};`,
                                    `export const abPrefetched = ${JSON.stringify(!!abHeaderHtml)};`,
                                    `export const abHeaderHtml = ${JSON.stringify(abHeaderHtml)};`,
                                    `export const abFooterHtml = ${JSON.stringify(abFooterHtml)};`,
                                    `export const abFooterUtilsHtml = ${JSON.stringify(abFooterUtilsHtml)};`,
                                    `export const abFooterCopyrightHtml = ${JSON.stringify(abFooterCopyrightHtml)};`,
                                    `export const abContactSalesHtml = ${JSON.stringify(abContactSalesHtml)};`,
                                ].join('\n');
                                return _navHtmlCache;
                            },
                        }],
                    },
                });
            },

            'astro:server:setup'({ server }) {
                if (!docsDir) return;
                server.middlewares.use(async (req, res, next) => {
                    // Only handle requests ending in .md
                    if (!req.url?.endsWith('.md')) return next();
                    // Strip leading slash and .md suffix to get the slug
                    const slug = req.url.slice(1, -3);
                    for (const ext of ['.md', '.mdx']) {
                        const src = path.join(docsDir, slug + ext);
                        try {
                            const raw = await fsp.readFile(src, 'utf-8');
                            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                            res.end(raw);
                            return;
                        } catch { /* try next extension */ }
                    }
                    next();
                });
            },

            async 'astro:build:done'({ dir, pages }) {
                const outDir = fileURLToPath(dir);

                // Copy package scripts to the build output /scripts/ directory.
                const pkgScripts = fileURLToPath(new URL('../public/scripts', import.meta.url));
                if (fs.existsSync(pkgScripts)) copyDirSync(pkgScripts, path.join(outDir, 'scripts'));

                // Write our custom llms.txt after all rendering — always wins over plugin output.
                const llmsContent = buildLlmsTxt(configuredSite, title, description, sidebar ?? [], llmsMetaMap, llmsSets, broadSections);
                await fsp.writeFile(path.join(outDir, 'llms.txt'), llmsContent, 'utf-8');

                if (!docsDir) return;

                // pages[].pathname is like "accordion/" or "charts/chart-api/" — strip trailing slash.
                const slugs = pages
                    .map(p => p.pathname.replace(/\/$/, ''))
                    .filter(s => s && s !== '404' && s !== 'index');

                await Promise.all(
                    slugs.map(async (slug) => {
                        for (const ext of ['.md', '.mdx']) {
                            const src = path.join(docsDir, slug + ext);
                            try {
                                const raw = await fsp.readFile(src, 'utf-8');
                                const dest = path.join(outDir, slug + '.md');
                                await fsp.mkdir(path.dirname(dest), { recursive: true });
                                await fsp.writeFile(dest, stripMdxForLlms(raw), 'utf-8');
                                break;
                            } catch { /* try next extension */ }
                        }
                    })
                );

                // ── llms-full.txt / llms-small.txt ──────────────────────────────────
                // Read back the already-written per-page .md files and combine them.
                const pageTexts = (
                    await Promise.all(
                        slugs.map(async (slug) => {
                            try {
                                return await fsp.readFile(path.join(outDir, slug + '.md'), 'utf-8');
                            } catch { return ''; }
                        })
                    )
                ).filter(Boolean);

                const fullContent = pageTexts.join('\n\n---\n\n');
                await fsp.writeFile(path.join(outDir, 'llms-full.txt'), fullContent, 'utf-8');

                // Small variant: strip fenced code blocks and inline code.
                const smallContent = fullContent
                    .replace(/^```[\s\S]*?^```/gm, '')
                    .replace(/`[^`\n]+`/g, '')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();
                await fsp.writeFile(path.join(outDir, 'llms-small.txt'), smallContent, 'utf-8');

                // ── /_llms-txt/{set-slug}.txt ────────────────────────────────────────
                if (llmsSets.length > 0) {
                    const llmsTxtDir = path.join(outDir, '_llms-txt');
                    await fsp.mkdir(llmsTxtDir, { recursive: true });

                    await Promise.all(
                        llmsSets.map(async (set) => {
                            const matchingSlugs = slugs.filter((slug) =>
                                set.paths.some((pattern) => {
                                    if (pattern.endsWith('*')) {
                                        return slug.startsWith(pattern.slice(0, -1));
                                    }
                                    return slug === pattern || slug.startsWith(pattern + '/');
                                })
                            );

                            const setText = (
                                await Promise.all(
                                    matchingSlugs.map(async (slug) => {
                                        try {
                                            return await fsp.readFile(path.join(outDir, slug + '.md'), 'utf-8');
                                        } catch { return ''; }
                                    })
                                )
                            ).filter(Boolean).join('\n\n---\n\n');

                            await fsp.writeFile(
                                path.join(llmsTxtDir, toUrlSlug(set.label) + '.txt'),
                                setText,
                                'utf-8',
                            );
                        })
                    );
                }

                // Run pagefind to generate the search index from the built HTML.
                // The index is written to <outDir>/pagefind/ and served statically.
                console.log('[docs-template] Running pagefind…');
                try {
                    const { index, errors: initErrors } = await pagefindCreateIndex({});
                    if (initErrors?.length) throw new Error(initErrors.join(', '));
                    const { errors: addErrors } = await index!.addDirectory({ path: outDir });
                    if (addErrors?.length) console.warn('[docs-template] pagefind addDirectory warnings:', addErrors);
                    const { errors: writeErrors } = await index!.writeFiles({
                        outputPath: path.join(outDir, 'pagefind'),
                    });
                    if (writeErrors?.length) console.warn('[docs-template] pagefind writeFiles warnings:', writeErrors);
                    console.log('[docs-template] pagefind index written.');
                } catch (err) {
                    console.warn('[docs-template] pagefind failed — search index will be unavailable.', err);
                }
            },
        },
    };
}

export { buildSidebarFromToc };
export type { LlmsMeta, LlmsSet } from './llms.ts';

// ---------------------------------------------------------------------------
// Static images integration
// ---------------------------------------------------------------------------

const MIME: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
    avif: 'image/avif', ico: 'image/x-icon',
};

function copyDirSync(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) copyDirSync(s, d);
        else fs.copyFileSync(s, d);
    }
}

/**
 * Astro integration that serves a local images directory during development
 * (via Vite middleware) and copies it to the build output.
 *
 * @param imagesDir - Absolute path to the directory of images to serve.
 * @param options.urlPath - URL prefix under which images are served (default `'/images'`).
 */
export function staticImagesIntegration(
    imagesDir: string,
    { urlPath = '/images' }: { urlPath?: string } = {},
): AstroIntegration {
    return {
        name: 'static-images',
        hooks: {
            'astro:server:setup'({ server }) {
                server.middlewares.use(urlPath, (req, res, next) => {
                    // Extract path (no query string)
                    const rawUrl = req.url || '/';
                    const requestPath = rawUrl.split('?', 1)[0] || '/';
                    // Decode URL component; reject malformed encodings
                    let decodedPath: string;
                    try {
                        decodedPath = decodeURIComponent(requestPath);
                    } catch {
                        return next();
                    }
                    // Build absolute file path and ensure it stays within imagesDir
                    const basePath = path.resolve(imagesDir);
                    const relativePath = decodedPath.replace(/^\/+/, '');
                    const filePath = path.resolve(path.join(basePath, relativePath));
                    // Prevent path traversal outside of imagesDir
                    if (filePath !== basePath && !filePath.startsWith(basePath + path.sep)) {
                        return next();
                    }
                    try {
                        if (fs.statSync(filePath).isFile()) {
                            const ext = path.extname(filePath).slice(1).toLowerCase();
                            res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
                            fs.createReadStream(filePath).pipe(res);
                            return;
                        }
                    } catch {
                        /* file not found — fall through */
                    }
                    next();
                });
            },
            async 'astro:build:done'({ dir }) {
                const destImages = path.join(fileURLToPath(dir), urlPath.replace(/^\//, ''));
                copyDirSync(imagesDir, destImages);
            },
        },
    };
}

/**
 * Astro integration that post-processes all built HTML files to prepend `base`
 * to root-relative `src="/..."` attributes that Astro doesn't rewrite automatically
 * (e.g. raw `<img>` tags in markdown/MDX content).
 */
function createBasePrependIntegration(base: string): AstroIntegration {
    const normalizedBase = base.replace(/\/$/, '');

    function rewriteDir(dir: string): void {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { rewriteDir(full); continue; }
            if (!entry.name.endsWith('.html')) continue;

            const original = fs.readFileSync(full, 'utf-8');
            const rewritten = original.replace(
                /\bsrc="(\/[^"]*)"/g,
                (_: string, url: string) => {
                    if (url.startsWith(normalizedBase + '/')) return `src="${url}"`;
                    return `src="${normalizedBase}${url}"`;
                },
            );
            if (rewritten !== original) fs.writeFileSync(full, rewritten, 'utf-8');
        }
    }

    return {
        name: 'docs-template:base-prepend',
        hooks: {
            'astro:build:done'({ dir }) {
                rewriteDir(fileURLToPath(dir));
            },
        },
    };
}

// ---------------------------------------------------------------------------
// All-in-one factory
// ---------------------------------------------------------------------------

export interface DocsSiteSource {
    /** Absolute path to the TOC file. */
    tocPath: string;
    /** Absolute path to the Markdown docs directory. */
    docsDir: string;
    /**
     * Absolute path to images directory.
     * Omit to skip the images integration.
     */
    imagesDir?: string;
}

export interface CreateDocsSiteOptions {
    /** Deployed site URL. */
    site: string;
    /** Base path, e.g. `'/docs'`. */
    base?: string;
    /** Site title shown in the browser tab and DocsSubHeader. */
    title: string;
    /** Short description for the llms.txt header. */
    description?: string;
    /** Content source paths. */
    source: Partial<DocsSiteSource>;
    /** Sidebar builder options. */
    sidebar?: {
        /** Patterns to exclude from the TOC. */
        exclude?: RegExp[];
    };
    /**
     * Platform identifier. Drives CDN styles/scripts injected into `<head>`
     * and the build-time nav prefetch endpoint.
     */
    platform?: PlatformKey | null;
    /** Locale for the nav prefetch URL. */
    navLang?: NavLang;
    /**
     * Extra `<head>` entries appended after the platform entries.
     */
    head?: HeadEntry[];
    /**
     * Build / deployment mode.
     * - `'development'` — local development (default)
     * - `'staging'` — pre-production environment
     * - `'production'` — production deployment
     *
     * Exposed as `process.env.DOCS_BUILD_MODE`.
     */
    mode?: DocsMode;
    /**
     * Named documentation subsets. Each entry generates a dedicated
     * `/_llms-txt/{slug}.txt` and adds a link under
     * `## Documentation sets` in `llms.txt`.
     */
    llmsSets?: LlmsSet[];
    /** Cross-product navigation links rendered in the DocsSubHeader. */
    productLinks?: ProductLink[];
    /** Extra Astro integrations appended after the built-in ones. */
    integrations?: AstroIntegration[];
    /**
     * @deprecated Starlight has been removed. This option is ignored.
     * Use `head` for extra head entries and `integrations` for extra integrations.
     */
    starlight?: Record<string, unknown>;
    /** Any remaining keys are spread into `defineConfig` (markdown, image, build, …). */
    [key: string]: unknown;
}

/**
 * Creates a complete Astro config for a standard Starlight docs site.
 *
 * All individual helpers (`buildSidebarFromToc`, `staticImagesIntegration`,
 * `siteMetaIntegration`) remain independently importable for cases that
 * need finer control.
 * @param options - Configuration options.
 */
export function createDocsSite(options: CreateDocsSiteOptions = {} as CreateDocsSiteOptions): ReturnType<typeof defineConfig> {
    const {
        site,
        base,
        title,
        description = '',
        source = {},
        sidebar: sidebarOptions = {},
        platform = null,
        navLang = 'en',
        mode = 'development',
        productLinks = [],
        head = [],
        llmsSets = [] as LlmsSet[],
        integrations: extraIntegrations = [],
        ...astroExtra
    } = options;

    const sidebar = buildSidebarFromToc({
        tocPath: source.tocPath!,
        docsDir: source.docsDir!,
        exclude: sidebarOptions.exclude ?? [],
    });

    // Expose env vars so consuming content.config.ts and components can read them.
    if (source.docsDir) {
        process.env.DOCS_SOURCE_PATH = source.docsDir;
    }
    process.env.DOCS_BUILD_MODE = mode;
    process.env.DOCS_BASE = base ? base.replace(/\/$/, '') : '';
    if (!process.env.DOCS_ENV) {
        process.env.DOCS_ENV = mode;
    }
    // Expose the platform so remark-docfx can set data-platform on widgets it generates.
    if (platform) {
        process.env.DOCS_PLATFORM = platform;
    }

    // Platform CDN entries come first so site-specific `head` entries can override.
    const platformHead = platform ? getPlatformHead(platform, navLang) : [];

    // highlight.js for code-tab syntax highlighting inside code-view widgets.
    const codeViewHead: HeadEntry[] = [
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css' } },
        { tag: 'script', attrs: { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js', defer: true } },
    ];

    // Auto-configure a Vite dev-server proxy so sample-widget.ts can fetch
    // /code-viewer/*.json from the local demos server without CORS issues.
    const devProxy: Record<string, object> = {};
    if (source.docsDir) {
        try {
            const docsRoot = path.resolve(source.docsDir);
            const envCandidates = [
                path.join(docsRoot, 'en', 'environment.json'),
                path.join(docsRoot, 'environment.json'),
                path.join(path.dirname(docsRoot), 'environment.json'),
                path.join(path.dirname(docsRoot), 'en', 'environment.json'),
            ];
            const envFile = envCandidates.find(c => fs.existsSync(c));
            if (envFile) {
                const envData = JSON.parse(fs.readFileSync(envFile, 'utf-8'));
                const envKey = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'production';
                const env: Record<string, string> = envData[envKey] ?? envData.production ?? {};
                const demosUrl = env.dvDemosBaseUrl || env.demosBaseUrl;
                if (demosUrl) {
                    const u = new URL(demosUrl);
                    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                        const cfg = { target: demosUrl, changeOrigin: true, secure: false };
                        devProxy['/code-viewer'] = cfg;
                        devProxy['/assets/code-viewer'] = cfg;
                    }
                }
            }
        } catch { /* non-fatal — proxy just won't be configured */ }
    }

    return defineConfig({
        site,
        ...(base !== undefined ? { base } : {}),
        // Docs sites serve images statically — disable Astro's image optimization
        // so relative image paths in markdown don't cause build errors.
        image: { service: { entrypoint: 'astro/assets/services/noop' }, ...(astroExtra as any).image },
        ...astroExtra,
        vite: {
            ...(astroExtra as any).vite,
            server: {
                ...(astroExtra as any).vite?.server,
                proxy: {
                    ...devProxy,
                    ...(astroExtra as any).vite?.server?.proxy,
                },
            },
        },
        markdown: {
            ...(astroExtra as any).markdown,
            remarkPlugins: [
                remarkDocfx,
                ...((astroExtra as any).markdown?.remarkPlugins ?? []),
            ],
            rehypePlugins: [
                rehypeCodeView,
                ...((astroExtra as any).markdown?.rehypePlugins ?? []),
            ],
        },
        integrations: [
            siteMetaIntegration({
                title,
                description,
                docsDir: source.docsDir,
                sidebar,
                platform,
                navLang,
                mode,
                llmsSets,
                productLinks,
                head: [...platformHead, ...codeViewHead, ...head],
            }),
            mdx(),
            ...(source.imagesDir ? [staticImagesIntegration(source.imagesDir)] : []),
            ...(base ? [createBasePrependIntegration(base)] : []),
            ...extraIntegrations,
        ],
    });
}

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
 *     navLang: 'en',         // 'en' | 'ja' | 'kr'
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
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import type { AstroIntegration, AstroConfig } from 'astro';
import starlight from '@astrojs/starlight';
import { buildSidebarFromToc } from './sidebar';
import { replaceEnvVars } from './plugins/remark-docfx';
import { getNavConfig, getPlatformHead } from './platform';
import type { HeadEntry, PlatformKey } from './platform.ts';
import { JSDOM } from 'jsdom';

// ---------------------------------------------------------------------------
// Navigation HTML prefetch cache + helpers
// ---------------------------------------------------------------------------

/** Module-level cache so the nav URL is fetched at most once per build. */
let _navHtmlCache: string | null = null;

/**
 * Strip all <script> tags from an HTML string.
 * The nav HTML fetched from infragistics.com / appbuilder.dev may contain
 * inline or external scripts that don't belong in the docs page (e.g.
 * staging.appbuilder.dev references in the IG nav).  Platform-specific
 * scripts are already injected cleanly via getPlatformHead().
 */
function stripScripts(html: string): string {
    // Use a DOM parser instead of a fragile regexp to remove all <script> tags.
    // This correctly handles malformed end tags like </script foo="bar">,
    // extra whitespace, case differences, and nested/script-like text.
    const dom = new JSDOM(html);
    const { document } = dom.window;

    document.querySelectorAll('script').forEach((el) => {
        el.remove();
    });

    return dom.serialize();
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
// Sidebar slug → metadata map
// ---------------------------------------------------------------------------

interface SlugMeta {
    [key: string]: unknown;
    metaTitle: string;
    groupMetaTitle: string;
}

interface SidebarItem {
    label?: string;
    slug?: string;
    items?: SidebarItem[];
}

function buildSlugMetaMap(sidebar: SidebarItem[] | undefined): Map<string, SlugMeta> {
    const map = new Map<string, SlugMeta>();
    function walk(items: SidebarItem[], groupLabel: string | null) {
        for (const item of items) {
            if (typeof item.slug === 'string') {
                map.set(item.slug, { metaTitle: item.label ?? '', groupMetaTitle: groupLabel ?? '' });
            }
            if (Array.isArray(item.items)) {
                walk(item.items, groupLabel ?? item.label ?? null);
            }
        }
    }
    walk(sidebar ?? [], null);
    return map;
}

function injectFrontmatterKeys(raw: string, keys: Record<string, unknown>): string {
    const extra = Object.entries(keys)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n');
    if (/^---\r?\n/.test(raw)) {
        const afterOpen = raw.indexOf('\n') + 1;
        const closeOffset = raw.slice(afterOpen).search(/^---[ \t]*(\r?\n|$)/m);
        if (closeOffset !== -1) {
            const closeIdx = afterOpen + closeOffset;
            return raw.slice(0, closeIdx) + extra + '\n' + raw.slice(closeIdx);
        }
    }
    return `---\n${extra}\n---\n\n${raw}`;
}

// ---------------------------------------------------------------------------
// Site meta virtual module
// ---------------------------------------------------------------------------

export interface SiteMetaOptions {
    title: string;
    description?: string;
    /** Path to the source markdown files. */
    docsDir?: string;
    sidebar?: SidebarItem[];
    platform?: PlatformKey | null;
    navLang?: string;
    /** @deprecated Use `platform` instead. */
    prefetchNav?: boolean;
    /** @deprecated Use `platform: 'appbuilder'` instead. */
    prefetchAppBuilderNav?: boolean;
}

/**
 * Astro integration that exposes site metadata as the virtual module
 * `virtual:docs-template/site-meta`, consumed by `src/pages/llms.txt.ts`.
 */
export function siteMetaIntegration({
    title,
    description = '',
    docsDir,
    sidebar,
    platform = null,
    navLang = 'en',
    prefetchNav = false,
    prefetchAppBuilderNav = false,
}: SiteMetaOptions = {} as SiteMetaOptions): AstroIntegration {
    const slugMeta = buildSlugMetaMap(sidebar);
    const moduleCode = `export const title = ${JSON.stringify(title)};
export const description = ${JSON.stringify(description)};
export const sidebar = ${JSON.stringify(sidebar ?? [])};
`;
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

    return {
        name: 'docs-template:site-meta',
        hooks: {
            'astro:config:setup'({ updateConfig, injectRoute }) {
                injectRoute({
                    pattern: '/llms.txt',
                    entrypoint: fileURLToPath(new URL('./routes/llms.txt.ts', import.meta.url)),
                    prerender: true,
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
                                            const igBase = navLang === 'ja' ? 'https://jp.infragistics.com' : 'https://www.infragistics.com';
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
                            const meta = slugMeta.get(slug);
                            const content = meta ? injectFrontmatterKeys(replaceEnvVars(raw), meta) : replaceEnvVars(raw);
                            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                            res.end(content);
                            return;
                        } catch { /* try next extension */ }
                    }
                    next();
                });
            },

            async 'astro:build:done'({ dir, pages }) {
                if (!docsDir) return;
                const outDir = fileURLToPath(dir);

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
                                const meta = slugMeta.get(slug);
                                const content = meta ? injectFrontmatterKeys(replaceEnvVars(raw), meta) : replaceEnvVars(raw);
                                const dest = path.join(outDir, slug + '.md');
                                await fsp.mkdir(path.dirname(dest), { recursive: true });
                                await fsp.writeFile(dest, content, 'utf-8');
                                break;
                            } catch { /* try next extension */ }
                        }
                    })
                );
            },
        },
    };
}

export { buildSidebarFromToc };

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
    /** Starlight site title. */
    title: string;
    /** Short description for the llms.txt header. */
    description?: string;
    /** Content source paths. */
    source?: Partial<DocsSiteSource>;
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
    /** Locale for the nav prefetch URL ('en' | 'ja' | 'kr'). */
    navLang?: string;
    /**
     * Extra `<head>` entries appended after the platform entries.
     * Same format as Starlight's `head` option.
     */
    head?: HeadEntry[];
    /** Extra Starlight options (logo, social, editLink, customCss, plugins, …). */
    starlight?: Record<string, unknown>;
    /** Extra Astro integrations appended after the built-in ones. */
    integrations?: AstroIntegration[];
    /** Any remaining keys are spread into `defineConfig` (markdown, image, build, …). */
    [key: string]: unknown;
}

/**
 * Creates a complete Astro config for a standard Starlight docs site.
 *
 * All individual helpers (`buildSidebarFromToc`, `staticImagesIntegration`,
 * `siteMetaIntegration`) remain independently importable for cases that
 * need finer control.
 *
 * @remarks
 * **Content collection required** — `createDocsSite` does NOT automatically
 * convert `.md` files into rendered HTML pages by itself. Astro renders pages
 * only when the source markdown is registered in a content collection.
 *
 * This function sets `process.env.DOCS_SOURCE_PATH` to `source.docsDir`
 * so your `src/content.config.ts` can pick it up without any extra wiring.
 * The minimal `content.config.ts` for a consuming project is:
 *
 *   import { createDocsCollection } from 'docs-template/content';
 *   export const collections = {
 *     docs: createDocsCollection(process.env.DOCS_SOURCE_PATH),
 *   };
 *
 * Without this file, `createDocsSite` still configures Starlight (sidebar,
 * nav, head assets, llms.txt) but **no doc pages will be generated**.
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
        head = [],
        starlight: starlightExtra = {},
        integrations: extraIntegrations = [],
        ...astroExtra
    } = options;

    const sidebar = buildSidebarFromToc({
        tocPath: source.tocPath!,
        docsDir: source.docsDir!,
        exclude: sidebarOptions.exclude ?? [],
    });

    // Expose the source path via env var so the consuming project's
    // src/content.config.ts (which uses createDocsCollection) can find the
    // markdown files without any extra configuration.
    if (source.docsDir) {
        process.env.DOCS_SOURCE_PATH = source.docsDir;
    }

    // Platform CDN entries come first so site-specific `head` entries can override.
    const platformHead = platform ? getPlatformHead(platform, navLang) : [];

    return defineConfig({
        site,
        ...(base !== undefined ? { base } : {}),
        ...astroExtra,
        integrations: [
            siteMetaIntegration({ title, description, docsDir: source.docsDir, sidebar, platform, navLang }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            starlight({ title, sidebar: sidebar as any, head: [...platformHead, ...head] as any, ...starlightExtra }),
            ...(source.imagesDir ? [staticImagesIntegration(source.imagesDir)] : []),
            ...extraIntegrations,
        ],
    });
}

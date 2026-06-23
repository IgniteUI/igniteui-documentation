/**
 * integration.ts
 *
 * Shared configuration helpers for Astro docs sites.
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
 *     platform: 'angular',   // drives CDN head entries
 *     navLang: 'en',         // 'en' | 'jp' | 'kr'
 *     source: {
 *       tocPath:  './my-docs/toc.yml',
 *       docsDir:  './my-docs/en/components',
 *     },
 *     sidebar: { exclude: [/^internal\//] },   // optional TOC excludes
 *     head: [                                   // extra <head> entries after platform ones
 *       { tag: 'link', attrs: { rel: 'stylesheet', href: '...' } },
 *     ],
 *     // Extra Astro options (markdown, image, build, …)
 *     markdown: { remarkPlugins: [] },
 *   });
 *
 * --- Option B: manual composition (for full control) ---
 *
 *   import { buildSidebarFromToc, siteMetaIntegration } from 'docs-template/integration';
 *
 *   const sidebar = buildSidebarFromToc({ tocPath, docsDir });
 *
 *   export default defineConfig({
 *     integrations: [
 *       siteMetaIntegration({ title: 'My Library', description: 'Reference docs.' }),
 *     ],
 *   });
 *
 * Generated output:
 *   /llms.txt              — manifest listing every page with its .md URL
 *   /{slug}.md             — Markdown for each page (converted from rendered HTML)
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { buildHtmlToMdConverter, htmlPageToMd } from './html-to-md.ts';
import { createIndex as pagefindCreateIndex } from 'pagefind';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import type { AstroIntegration } from 'astro';
import mdx from '@astrojs/mdx';
import {
    buildLlmsTxt, buildLlmsMetaMap, getBroadSectionsForPlatform, toUrlSlug,
    type LlmsMeta, type LlmsSet, type SidebarEntry,
} from './llms.ts';
import { buildSidebarFromToc } from './sidebar';
import { getPlatformHead } from './platform';
import type { HeadEntry, PlatformKey, NavLang } from './platform.ts';
import { remarkEnvVars } from './plugins/remark-env-vars';
import { remarkMdLinks } from './plugins/remark-md-links';
import { remarkHtmlTransforms } from './plugins/remark-html-transforms';
import { rehypeTableWrapper } from 'igniteui-astro-components/plugins/rehype-table-wrapper';
import { rehypeHeadingAnchors } from 'igniteui-astro-components/plugins/rehype-heading-anchors';
import { rehypePagefindIgnore } from 'igniteui-astro-components/plugins/rehype-pagefind-ignore';
import { rehypeStripEmptyParagraphs } from './plugins/rehype-strip-empty-paragraphs';
import { rehypeApiReferencesGrid } from './plugins/rehype-api-references-grid';

/** Build / deployment mode. Drives env-var `DOCS_BUILD_MODE`. */
export type DocsMode = 'development' | 'staging' | 'production';

// ---------------------------------------------------------------------------
// LLM Markdown generation  (called from astro:build:done)
// ---------------------------------------------------------------------------

interface GenerateLlmsMdOptions {
    /** Absolute path to the Astro build output directory. */
    outDir: string;
    /** Page slugs to convert (stripped of trailing slashes). */
    slugs: string[];
    /** Path to the source docs directory — used only for diagnostic warnings. */
    docsDir: string;
    /** Configured site URL. */
    siteUrl: string;
    /** Named documentation subsets to assemble into combined .txt files. */
    llmsSets: LlmsSet[];
}

const UTF8_BOM = '\uFEFF';

function withUtf8Bom(content: string): string {
    return UTF8_BOM + content.replace(/^\uFEFF/, '');
}

/**
 * Converts all built HTML pages to Markdown and writes the LLM bundle files.
 *
 * Produces:
 *   /{slug}.md        — per-page Markdown converted from the rendered HTML
 *   /llms-full.txt    — all pages concatenated into a single file
 *   /llms-small.txt   — same as full, but with code blocks and inline code removed
 *   /_llms-txt/*.txt  — topic-specific bundles defined by `llmsSets`
 */
async function generateLlmsMdFiles({ outDir, slugs, docsDir, siteUrl, llmsSets }: GenerateLlmsMdOptions): Promise<void> {
    console.log(`[docs-template] Generating ${slugs.length} .md files…`);
    const mdStart = Date.now();

    // Build the TurndownService converter once; reuse across all pages.
    const td = buildHtmlToMdConverter();

    let mdDone = 0;
    const skippedSlugs: string[] = [];
    const mdFiles = await Promise.all(
        slugs.map(async (slug) => {
            const htmlPath = path.join(outDir, slug + '.html');
            const dest = path.join(outDir, slug + '.md');

            // Resolve the source MDX/MD path so warnings point developers at the
            // file they need to edit, not the built HTML artifact.
            const sourceRef = ['.mdx', '.md']
                .map(ext => path.join(docsDir, slug + ext))
                .find(f => fs.existsSync(f)) ?? path.join(docsDir, slug + '.mdx');

            const md = await htmlPageToMd(htmlPath, siteUrl, td, sourceRef);
            if (!md) { skippedSlugs.push(slug); mdDone++; return ''; }
            await fsp.mkdir(path.dirname(dest), { recursive: true });
            await fsp.writeFile(dest, withUtf8Bom(md), 'utf-8');
            mdDone++;
            if (mdDone % 50 === 0 || mdDone === slugs.length) {
                console.log(`[docs-template]   ${mdDone}/${slugs.length} pages converted`);
            }
            return md;
        })
    );

    const mdGenerated = mdFiles.filter(Boolean).length;
    const mdElapsed = ((Date.now() - mdStart) / 1000).toFixed(1);
    console.log(`[docs-template] .md generation complete — ${mdGenerated}/${slugs.length} pages written in ${mdElapsed}s`);

    // Conversion-count guard: warn when a significant number of pages produced
    // no Markdown — likely a layout change or missing HTML rather than pages
    // that legitimately have no content.
    if (skippedSlugs.length > 0) {
        const pct = ((skippedSlugs.length / slugs.length) * 100).toFixed(1);
        const level = skippedSlugs.length > slugs.length * 0.1 ? 'error' : 'warn';
        const sample = skippedSlugs.slice(0, 10).join(', ');
        const suffix = skippedSlugs.length > 10 ? `, … and ${skippedSlugs.length - 10} more` : '';
        console[level](`[docs-template] ${skippedSlugs.length} of ${slugs.length} pages (${pct}%) produced no .md output: ${sample}${suffix}`);
        if (level === 'error') process.exitCode = 1;
    }

    // Selector guard: if we built more than a handful of pages but extracted zero
    // fenced code blocks, the Shiki class names likely changed and extraction is
    // silently broken — fail loud rather than ship codeless docs.
    // Count opening fence lines only (those followed by a language identifier or newline).
    const totalBlocks = mdFiles.reduce((n, md) => n + (md.match(/^`{3,}[^`\n]*$/gm) ?? []).length, 0) / 2;
    if (slugs.length > 5 && totalBlocks === 0) {
        console.error('[docs-template] Selector guard: 0 code blocks across all pages. Check that pre.astro-code and data-language still match the built HTML.');
        process.exitCode = 1;
    } else {
        console.log(`[docs-template] Selector guard OK — ~${Math.round(totalBlocks)} code blocks across corpus`);
    }

    // ── llms-full.txt / llms-small.txt ──────────────────────────────────────
    console.log('[docs-template] Writing llms-full.txt and llms-small.txt…');
    const pageTexts = mdFiles.filter(Boolean);

    const fullContent = pageTexts.join('\n\n---\n\n');
    await fsp.writeFile(path.join(outDir, 'llms-full.txt'), withUtf8Bom(fullContent), 'utf-8');

    // Small variant: strip fenced code blocks and inline code to reduce token count.
    // Backreference ensures a 4-backtick block isn't closed by a nested 3-backtick line.
    const smallContent = fullContent
        .replace(/^(`{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '')
        .replace(/`[^`\n]+`/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    await fsp.writeFile(path.join(outDir, 'llms-small.txt'), withUtf8Bom(smallContent), 'utf-8');

    // ── /_llms-txt/{set-slug}.txt ────────────────────────────────────────────
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
                                const content = await fsp.readFile(path.join(outDir, slug + '.md'), 'utf-8');
                                return content.replace(/^\uFEFF/, '');
                            } catch { return ''; }
                        })
                    )
                ).filter(Boolean).join('\n\n---\n\n');

                await fsp.writeFile(
                    path.join(llmsTxtDir, toUrlSlug(set.label) + '.txt'),
                    withUtf8Bom(setText),
                    'utf-8',
                );
            })
        );
    }
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
    /** Localized site description for non-English builds. Used in the llms.txt
     *  manifest blockquote instead of the (typically English) `description`. */
    localizedDescription?: string;
    /** Path to the source markdown files. */
    docsDir?: string;
    sidebar?: SidebarEntry[];
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
    /**
     * Items for the DocsSubHeader package/platform selector.
     * The selector is hidden when there are no package options to render
     * (for example, when `packages` is omitted or an empty array).
     */
    packages?: Array<string | { label: string; value?: string; href?: string }>;
    /**
     * Initially selected package value. Must match one of `packages`;
     * ignored when no package options are available.
     */
    selectedPackage?: string;
    /**
     * Platform context used to resolve `<ApiLink>` components in generated `.md` files.
     * When provided, ApiLinks are rendered as markdown links pointing to the correct API docs URL.
     * When omitted, ApiLinks fall back to inline code (`` `TypeName.member` ``).
     */
}


/**
 * Astro integration that exposes site metadata as the virtual module
 * `virtual:docs-template/site-meta` and generates /llms.txt at build time.
 */
export function siteMetaIntegration({
    title,
    description = '',
    localizedDescription,
    docsDir,
    sidebar,
    platform = null,
    navLang = 'en',
    mode = 'development',
    llmsSets = [],
    productLinks = [],
    head = [],
    packages = [],
    selectedPackage = '',
}: SiteMetaOptions = {} as SiteMetaOptions): AstroIntegration {
    const llmsMetaMap = docsDir
        ? buildLlmsMetaMap(docsDir, sidebar ?? [])
        : new Map<string, LlmsMeta>();

    const virtualId = 'virtual:docs-template/site-meta';
    const resolvedId = '\0' + virtualId;

    const navVirtualId = 'virtual:docs-template/nav-html';
    const navResolvedId = '\0' + navVirtualId;

    // Navigation buckets for this platform — stripped from ancestor paths during label generation.
    const broadSections = getBroadSectionsForPlatform(platform ?? null);
    // Captured from astro:config:done; used to generate llms.txt content.
    let configuredSite = '';
    let configuredTrailingSlash: string = 'ignore';

    return {
        name: 'docs-template:site-meta',
        hooks: {
            'astro:config:done'({ config }) {
                configuredSite = (config.site?.toString() ?? '').replace(/\/$/, '');
                configuredTrailingSlash = config.trailingSlash ?? 'ignore';
            },
            'astro:config:setup'({ updateConfig, injectRoute, addMiddleware }) {
                addMiddleware({
                    entrypoint: fileURLToPath(new URL('./middleware.ts', import.meta.url)),
                    order: 'pre',
                });

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
                            load(id: string) {
                                if (id === resolvedId) return `export const title = ${JSON.stringify(title)};
export const sidebar = ${JSON.stringify(sidebar ?? [])};
export const productLinks = ${JSON.stringify(productLinks)};
export const headEntries = ${JSON.stringify(head ?? [])};
export const trailingSlash = ${JSON.stringify(configuredTrailingSlash)};
export const navLang = ${JSON.stringify(navLang)};
export const packages = ${JSON.stringify(packages)};
export const selectedPackage = ${JSON.stringify(selectedPackage)};
`;
                                if (id !== navResolvedId) return;

                                return [
                                    `export const platform = ${JSON.stringify(platform ?? null)};`,
                                ].join('\n');
                            },
                        }],
                    },
                });
            },

            'astro:server:setup'({ server }) {
                if (!docsDir) return;
                // Dev-mode convenience: serve raw source MDX/MD files for /{slug}.md
                // requests so LLM clients can fetch Markdown during local development
                // without a full production build.  The HTML→MD pipeline only runs at
                // build time, so dev mode falls back to source content.
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

                // ── LLM artifacts ────────────────────────────────────────────────
                // Write llms.txt manifest (always — even without docsDir).
                const llmsContent = buildLlmsTxt(configuredSite, title, description, sidebar ?? [], llmsMetaMap, llmsSets, broadSections, navLang, localizedDescription);
                // English metadata can also contain Unicode punctuation and symbols.
                // Include a UTF-8 signature because static preview servers may omit charset.
                await fsp.writeFile(path.join(outDir, 'llms.txt'), withUtf8Bom(llmsContent), 'utf-8');

                if (docsDir) {
                    const slugs = pages
                        .map(p => p.pathname.replace(/\/$/, ''))
                        .filter(s => s && s !== '404' && s !== 'index');

                    await generateLlmsMdFiles({
                        outDir,
                        slugs,
                        docsDir,
                        siteUrl: configuredSite,
                        llmsSets,
                    });
                }

                // ── Pagefind search index ────────────────────────────────────────
                console.log('[docs-template] Running pagefind…');
                try {
                    const { index, errors: initErrors } = await pagefindCreateIndex({});
                    if (initErrors?.length) throw new Error(initErrors.join(', '));
                    const { errors: addErrors } = await index!.addDirectory({ path: outDir, rootSelector: 'main' });
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
                /(?<![a-zA-Z])src="(\/[^"]*)"/g,
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
    /** Localized site description for non-English builds. Used in the llms.txt
     *  manifest blockquote instead of the (typically English) `description`. */
    localizedDescription?: string;
    /** Content source paths. */
    source: Partial<DocsSiteSource>;
    /** Sidebar builder options. */
    sidebar?: {
        /** Patterns to exclude from the TOC. */
        exclude?: RegExp[];
    };
    /**
     * Platform identifier. Drives CDN styles/scripts injected into `<head>`.
     */
    platform?: PlatformKey | null;
    /** Locale for the nav bar. */
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
    /** Items for the DocsSubHeader package/platform selector. When `packages` is empty, the selector is hidden. */
    packages?: Array<string | { label: string; value?: string; href?: string }>;
    /** Initially selected package value when `packages` is provided (must match one of `packages`). */
    selectedPackage?: string;
    /** Extra Astro integrations appended after the built-in ones. */
    integrations?: AstroIntegration[];
    /** Any remaining keys are spread into `defineConfig` (markdown, image, build, …). */
    [key: string]: unknown;
}

/**
 * Creates a complete Astro config for a docs site.
 *
 * All individual helpers (`buildSidebarFromToc`, `siteMetaIntegration`)
 * remain independently importable for cases that need finer control.
 * @param options - Configuration options.
 */
export function createDocsSite(options: CreateDocsSiteOptions = {} as CreateDocsSiteOptions): ReturnType<typeof defineConfig> {
    const {
        site,
        base,
        title,
        description = '',
        localizedDescription,
        source = {},
        sidebar: sidebarOptions = {},
        platform = null,
        navLang = 'en',
        mode = 'development',
        productLinks = [],
        packages = [],
        selectedPackage = '',
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
    process.env.DOCS_TRAILING_SLASH = (astroExtra.trailingSlash as string) ?? 'ignore';
    if (!process.env.DOCS_ENV) {
        process.env.DOCS_ENV = mode;
    }
    // Expose the platform so the remark plugin can set data-platform on widgets it generates.
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
            shikiConfig: {
                theme: 'dark-plus',
                wrap: true,
            },
            ...(astroExtra as any).markdown,
            remarkPlugins: [
                remarkEnvVars,
                remarkMdLinks,
                remarkHtmlTransforms,
                ...((astroExtra as any).markdown?.remarkPlugins ?? []),
            ],
            rehypePlugins: [
                rehypeTableWrapper,
                rehypeHeadingAnchors,
                rehypeStripEmptyParagraphs,
                rehypeApiReferencesGrid,
                rehypePagefindIgnore,
                ...((astroExtra as any).markdown?.rehypePlugins ?? []),
            ],
        },
        integrations: [
            siteMetaIntegration({
                title,
                description,
                localizedDescription,
                docsDir: source.docsDir,
                sidebar,
                platform,
                navLang,
                mode,
                llmsSets,
                productLinks,
                packages,
                selectedPackage,
                head: [...platformHead, ...codeViewHead, ...head],
            }),
            ...(base ? [createBasePrependIntegration(base)] : []),
            ...extraIntegrations,
        ],
    });
}

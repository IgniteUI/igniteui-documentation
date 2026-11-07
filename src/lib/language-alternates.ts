/**
 * language-alternates.ts — canonical and hreflang links for a docs page.
 *
 * Every product's docs are built twice, once per language, and deployed to two
 * hosts with the same paths:
 *
 *   https://www.infragistics.com/products/ignite-ui-react/react/components/grids/data-grid
 *   https://jp.infragistics.com/products/ignite-ui-react/react/components/grids/data-grid
 *
 * Search engines only treat the two as language versions of one page when each
 * links to the other with `<link rel="alternate" hreflang>`. Without that, Google
 * can show the Japanese page for an English search (it does today for "react grid").
 *
 * A build knows only its own pages, so the other language's pages are read from
 * that site's deployed sitemap.xml once per build (loadLanguageAlternates, called
 * from src/components/overrides/Head.astro). That list is what is live, which is
 * exactly what an hreflang link must point to. If it cannot be read, the build goes
 * on without hreflang links (and says so): a link to a page that does not exist is
 * worse than no link. Development builds and the frozen Korean docs are not paired.
 */

import { IGDOCS_PLATFORMS } from '../platform.ts';

/** Docs build language (`navLang`) → BCP 47 tag used by hreflang and `<html lang>`. */
export const HREFLANG_BY_NAV_LANG: Record<string, string> = { en: 'en', jp: 'ja', kr: 'ko' };

/**
 * Where each language's docs are deployed, per build mode. The same hosts the doc
 * sets' astro.config.ts files build their `site` from. Korean (frozen legacy) is
 * not paired.
 */
const DOCS_HOSTS: Record<string, Record<'en' | 'jp', string>> = {
    production: { en: 'https://www.infragistics.com', jp: 'https://jp.infragistics.com' },
    staging: { en: 'https://staging.infragistics.com', jp: 'https://jp.staging.infragistics.com' },
};

/**
 * The other language's docs site for a product. `platformKey` is the build's
 * `platform` from `virtual:docs-template/nav-html` (`'angular'`, `'react'`, …),
 * matched with the other language's entry in `IGDOCS_PLATFORMS`. Empty in
 * development, for Korean, and for a platform without a docs site in the other
 * language.
 */
export function languageAlternatesFor(platformKey: string | null, navLang: string, mode: string): LanguageAlternate[] {
    const other = navLang === 'en' ? 'jp' : navLang === 'jp' ? 'en' : null;
    const host = other ? DOCS_HOSTS[mode]?.[other] : undefined;
    const meta = other && platformKey
        ? Object.values(IGDOCS_PLATFORMS).find(m => m.key === platformKey && m.lang === other)
        : undefined;
    if (!other || !host || !meta) return [];
    return [{ hreflang: HREFLANG_BY_NAV_LANG[other], site: `${host}${meta.base}` }];
}

/** The other language's docs site for the same product, as passed to `createDocsSite`. */
export interface LanguageAlternate {
    /** BCP 47 language tag of the other site, e.g. `'ja'`. */
    hreflang: string;
    /** That site's root URL, including the base path, without a trailing slash. */
    site: string;
}

/** A `LanguageAlternate` with the page paths its sitemap lists. */
export interface ResolvedLanguageAlternate extends LanguageAlternate {
    /** Page paths relative to `site`, e.g. `'grids/data-grid'`; `''` is the site root. */
    pages: string[];
}

export interface HeadLink {
    hreflang: string;
    href: string;
}

const trimSlash = (s: string) => s.replace(/\/+$/, '');

/**
 * The page path relative to the site, as the sitemap and the deployed URL write it:
 * the content id without a trailing `index` segment.
 */
export function pagePathFromSlug(slug: string): string {
    return slug.replace(/(^|\/)index$/, '').replace(/^\/+|\/+$/g, '');
}

/** The absolute URL of a page: `site` + `/` + `pagePath`, never ending in a slash. */
export function pageUrl(site: string, pagePath: string): string {
    return pagePath ? `${trimSlash(site)}/${pagePath}` : trimSlash(site);
}

/**
 * Page paths in a sitemap that belong to `site`. URLs outside `site` (another host
 * or base path) are ignored.
 */
export function pagesFromSitemap(xml: string, site: string): string[] {
    const root = trimSlash(site);
    const pages = new Set<string>();
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
        const loc = trimSlash(m[1].replace(/&amp;/g, '&'));
        if (loc === root) pages.add('');
        else if (loc.startsWith(`${root}/`)) pages.add(loc.slice(root.length + 1));
    }
    return [...pages];
}

/**
 * Reads each alternate site's sitemap. An alternate whose sitemap cannot be read
 * is dropped with a warning; the build never fails here.
 */
export async function resolveLanguageAlternates(
    alternates: LanguageAlternate[],
    {
        fetchImpl = fetch,
        timeoutMs = 20_000,
        warn = (msg: string) => console.warn(msg),
    }: { fetchImpl?: typeof fetch; timeoutMs?: number; warn?: (msg: string) => void } = {},
): Promise<ResolvedLanguageAlternate[]> {
    const resolved: ResolvedLanguageAlternate[] = [];
    for (const alt of alternates) {
        const site = trimSlash(alt.site);
        const url = `${site}/sitemap.xml`;
        try {
            const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const pages = pagesFromSitemap(await res.text(), site);
            if (pages.length === 0) throw new Error('no pages under the site in the sitemap');
            resolved.push({ hreflang: alt.hreflang, site, pages });
        } catch (err) {
            warn(`[language-alternates] ${url}: ${(err as Error).message}. No hreflang="${alt.hreflang}" links in this build.`);
        }
    }
    return resolved;
}

/**
 * The hreflang links for one page: this page, every alternate that has the same
 * path, and `x-default` pointing at the English version. Empty when no other
 * language has the page, so a page never declares a pairing on its own.
 */
export function hreflangLinks({
    pagePath,
    selfHreflang,
    selfUrl,
    alternates,
}: {
    pagePath: string;
    selfHreflang: string;
    selfUrl: string;
    alternates: ResolvedLanguageAlternate[];
}): HeadLink[] {
    const others = alternates
        .filter(a => a.hreflang !== selfHreflang && a.pages.includes(pagePath))
        .map(a => ({ hreflang: a.hreflang, href: pageUrl(a.site, pagePath) }));
    if (others.length === 0) return [];

    const links = [{ hreflang: selfHreflang, href: selfUrl }, ...others];
    const english = links.find(l => l.hreflang === 'en');
    if (english) links.push({ hreflang: 'x-default', href: english.href });
    return links;
}

let loaded: Promise<ResolvedLanguageAlternate[]> | undefined;

/**
 * The other language's docs and the pages its sitemap lists, read once per build
 * and shared by every page (Astro renders all pages of a build in one process).
 */
export function loadLanguageAlternates(
    platformKey: string | null,
    navLang: string,
    mode: string,
): Promise<ResolvedLanguageAlternate[]> {
    loaded ??= resolveLanguageAlternates(languageAlternatesFor(platformKey, navLang, mode)).then(alts => {
        for (const alt of alts) {
            console.info(`[language-alternates] hreflang="${alt.hreflang}": ${alt.pages.length} pages listed by ${alt.site}/sitemap.xml`);
        }
        return alts;
    });
    return loaded;
}

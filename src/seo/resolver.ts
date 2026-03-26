/**
 * SEO data resolved from a DocFX page's frontmatter entry.
 *
 * Starlight's default Head already emits: <title>, <meta name="description">,
 * <link rel="canonical">, og:*, twitter:card.
 * This resolver covers what Starlight omits for DocFX pages:
 *   - description  — from _description (Starlight needs entry.data.description,
 *                    but DocFX uses the underscore-prefixed variant)
 *   - keywords     — from _keywords (Starlight never emits this)
 */
export interface PageSeo {
    description: string;
    keywords: string;
}

export function resolvePageSeo(data: {
    _description?: string | null;
    _keywords?: string | null;
}): PageSeo {
    return {
        description: data._description?.trim() || '',
        keywords: data._keywords?.trim() || '',
    };
}

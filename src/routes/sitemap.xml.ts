import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
    const entries = await getCollection('docs');
    const base    = (site?.href ?? '').replace(/\/$/, '');
    const lastmod = new Date().toISOString();

    const urls = entries
        .map(({ id }) => {
            const slug = id.replace(/\.(md|mdx)$/i, '').replace(/\/index$/, '');
            return `  <url>\n    <loc>${base}/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
};

import { defineMiddleware } from 'astro:middleware';
import { getPlatformContext, getEnvVars } from './lib/platform-context.js';
import { LANGUAGE_TAGS, type NavLang } from './platform.js';

/**
 * The shared layout (igniteui-astro-components' DocsLayout) writes
 * `<html lang="en">` for every build. A translated build says its own language
 * here, so browsers, screen readers and search engines read the page in it.
 * LANG_CODE is set by createDocsSite() from the build's navLang.
 */
const htmlLang = () => LANGUAGE_TAGS[(process.env.LANG_CODE ?? 'en') as NavLang] ?? 'en';

export const onRequest = defineMiddleware(async (ctx, next) => {
    ctx.locals.platformContext = getPlatformContext();
    ctx.locals.envVars = getEnvVars();
    const response = await next();
    const lang = htmlLang();
    if (lang === 'en' || !(response.headers.get('content-type') ?? '').includes('text/html')) return response;
    const html = await response.text();
    return new Response(html.replace(/(<html\b[^>]*?\slang=")en(")/, `$1${lang}$2`), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    });
});

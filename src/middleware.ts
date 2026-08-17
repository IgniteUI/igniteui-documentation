import { defineMiddleware } from 'astro:middleware';
import { getPlatformContext, getEnvVars, getGtmContainerId } from './lib/platform-context.js';

export const onRequest = defineMiddleware(async (ctx, next) => {
    ctx.locals.platformContext = getPlatformContext();
    ctx.locals.envVars = getEnvVars();

    const response = await next();

    // Only rewrite HTML documents — skip .md/.txt/.xml endpoints and static assets.
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) return response;

    const html = await response.text();
    if (!/<body[^>]*>/i.test(html)) return response;

    const gtmNoscript = `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${getGtmContainerId()}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`;
    const updated = html.replace(/<body([^>]*)>/i, `<body$1>${gtmNoscript}`);

    const headers = new Headers(response.headers);
    headers.delete('content-length');

    return new Response(updated, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
});

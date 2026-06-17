import { defineMiddleware } from 'astro:middleware';
import { getPlatformContext, getEnvVars } from './lib/platform-context.js';

export const onRequest = defineMiddleware((ctx, next) => {
    ctx.locals.platformContext = getPlatformContext();
    ctx.locals.envVars = getEnvVars();
    return next();
});

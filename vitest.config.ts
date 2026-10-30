import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            // Astro's virtual module; tests never boot Astro, so a passthrough
            // stub stands in for it (needed by src/content.config.ts imports).
            'astro:content': fileURLToPath(new URL('./test/stubs/astro-content.ts', import.meta.url)),
        },
    },
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'test/**/*.test.ts'],
    },
});

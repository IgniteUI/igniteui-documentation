import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://igniteui.github.io/docs-template',
  // base: '/docs-template', // Uncomment if deploying to a subpath
  compressHTML: true,
  build: {
    assets: '_assets',
  },
});
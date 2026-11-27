import { createDocsCollection } from 'docs-template/content';

// No source is passed: astro.config.ts names the content root and createDocsSite publishes it.
// Topics are MDX; the port's own notes and reports are not pages.
export const collections = {
    docs: createDocsCollection(undefined, { exclude: ['**/*.md'] }),
};

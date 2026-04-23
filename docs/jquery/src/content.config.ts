// Zero-config content collection.
// createDocsSite() in astro.config.ts sets DOCS_SOURCE_PATH to the absolute
// path of src/content/en/topics before Astro starts, so the collection
// automatically resolves to the right directory.
import { collections } from 'docs-template/content';
export { collections };

// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import mdx from '@astrojs/mdx';

/**
 * The Ignite UI for jQuery doc set. It is a doc set of its own: not an xplat platform, and
 * source-complete in this folder. Its topics are served at the slugs of the help they replace,
 * `/help/<slug>`, so the content root is flat: one `<slug>.mdx` per topic, images under `images/`.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Preserve the project root before chdir so platform-context.ts can find this doc set.
process.env.DOCS_PROJECT_ROOT = __dirname;
// The API link registry (src/data/api-link-index) and the chrome snapshot are resolved from the
// repository root, as for the other doc sets; see docs/angular/astro.config.ts for the outDir reason.
process.chdir(path.join(__dirname, '../..'));

// DOCS_ENV: 'development' | 'staging' | 'production' (default 'development').
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';
if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
	throw new Error(`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`);
}
const mode: DocsMode = docsEnv;

// The help is served by igniteui.com under /help. No staging host is decided yet, so staging
// builds use the production host too.
const HOST = 'https://www.igniteui.com';
const base = '/help';
const site = mode === 'development' ? 'http://localhost:4351' : `${HOST}${base}`;

const docsDir = path.join(__dirname, 'src', 'content', 'en');

// https://astro.build/config
export default createDocsSite({
	site,
	base: mode !== 'development' ? base : undefined,
	title: 'Ignite UI for jQuery',
	description: 'Documentation for Ignite UI for jQuery and its ASP.NET MVC and ASP.NET Core wrappers.',
	platform: 'jquery',
	navLang: 'en',
	mode,
	build: {
		format: 'file',
	},
	trailingSlash: 'never',
	source: {
		tocPath: path.join(docsDir, 'toc.json'),
		docsDir,
	},
	integrations: [mdx()],
	vite: {
		server: { fs: { strict: false } },
	},
});

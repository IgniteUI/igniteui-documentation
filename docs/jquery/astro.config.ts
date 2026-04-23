// @ts-check
import mdx from '@astrojs/mdx';
import path from 'node:path';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS } from 'docs-template/platform';

// ── Build mode ───────────────────────────────────────────────────────────────
// DOCS_ENV: 'development' | 'staging' | 'production'  (preferred, default: 'development')
// NODE_ENV: fallback — do NOT set to 'staging'; Vite derives import.meta.env.DEV from it.
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';

if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
	throw new Error(
		`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`
	);
}

const mode: DocsMode = docsEnv;

// ── Site URL — varies by build mode ─────────────────────────────────────────
const PROD_HOST = 'https://www.infragistics.com';
const STAGING_HOST = 'https://staging.infragistics.com';

const { base } = IGDOCS_PLATFORMS['jQuery'];
const site = mode === 'production' ? `${PROD_HOST}${base}`
	: mode === 'staging' ? `${STAGING_HOST}${base}`
	: 'http://localhost:4335';

// ── Source paths ─────────────────────────────────────────────────────────────
const docsDir = path.resolve('./src/content/en/topics');
const tocPath  = path.resolve('./toc.json');

// https://astro.build/config
export default createDocsSite({
	site,
	base: mode !== 'development' ? base : undefined,
	title: 'Ignite UI for jQuery',
	description: 'Component and API reference docs for Ignite UI for jQuery.',
	platform: 'jquery',
	navLang: 'en',
	mode,
	productLinks: Object.values(IGDOCS_PLATFORMS)
		.filter(p => p.lang === 'en')
		.map(({ label, key, base: b }) => ({
			label,
			href: mode === 'production' ? `${PROD_HOST}${b}` : `${STAGING_HOST}${b}`,
			platform: key,
		})),
	source: {
		tocPath,
		docsDir,
	},
	starlight: {},
	image: { service: { entrypoint: 'astro/assets/services/noop' } },
	integrations: [mdx()],
	// Expose @/ alias so MDX files can import components.
	vite: {
		resolve: {
			alias: { '@': path.resolve('./src') },
		},
	},
});

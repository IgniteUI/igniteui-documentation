import path from 'node:path';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS } from 'docs-template/platform';
import { generateGridTopics, normalizeImagePaths } from './src/generate-grids.mjs';
import { remarkEnv } from './src/plugins/remark-env.mjs';

// ── Build mode and language ──────────────────────────────────────────────────
// DOCS_ENV: 'development' | 'staging' | 'production'  (preferred, default: 'development')
// NODE_ENV: fallback — do NOT set to 'staging'; Vite derives import.meta.env.DEV from it.
// DOCS_LANG: 'en' | 'jp' | 'kr'                       (default: 'en')
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';
const docsLang = process.env.DOCS_LANG || 'en';

if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
	throw new Error(
		`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`
	);
}

const mode: DocsMode = docsEnv;

// ── Site URL — varies by build mode ─────────────────────────────────────────
const PROD_HOST = 'https://www.infragistics.com';
const STAGING_HOST = 'https://staging.infragistics.com';

const { base } = IGDOCS_PLATFORMS.Angular;
const site = mode === 'production' ? `${PROD_HOST}${base}`
	: mode === 'staging' ? `${STAGING_HOST}${base}`
	: 'http://localhost:4321';

// ── Source paths ─────────────────────────────────────────────────────────────
const docsDir = path.resolve(`./src/content/${docsLang}`);
const componentsDocsDir = path.join(docsDir, 'components');
const templatesDir = path.join(docsDir, 'grids_templates');

// ── Pre-build steps (run before Astro starts) ────────────────────────────────
generateGridTopics(templatesDir, componentsDocsDir);
normalizeImagePaths(componentsDocsDir);

// https://astro.build/config
export default createDocsSite({
	site,
	base: mode !== 'development' ? base : undefined,
	title: 'Ignite UI for Angular',
	description: 'Component and API reference docs for Ignite UI for Angular.',
	platform: 'angular',
	navLang: docsLang === 'jp' ? 'ja' : docsLang,
	mode,
	productLinks: Object.values(IGDOCS_PLATFORMS).map(({ label, key, base: b }) => ({
		label,
		href: mode === 'production' ? `${PROD_HOST}${b}` : `${STAGING_HOST}${b}`,
		platform: key,
	})),
	source: {
		tocPath: path.join(componentsDocsDir, 'toc.yml'),
		docsDir: componentsDocsDir,
		imagesDir: path.join(docsDir, 'images'),
	},
	sidebar: { exclude: [/^internal\//] },
	starlight: {
		// logo: { src: './public/favicon.svg' },
	},
	image: { service: { entrypoint: 'astro/assets/services/noop' } },
	markdown: { remarkPlugins: [remarkEnv] },
});

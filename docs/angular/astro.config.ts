// @ts-check
import mdx from '@astrojs/mdx';
import path from 'node:path';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS } from 'docs-template/platform';
import { generateGridTopics, normalizeImagePaths } from './src/generate-grids.mjs';

// ── Build mode and language ──────────────────────────────────────────────────
// NODE_ENV: 'development' | 'staging' | 'production'  (default: 'development')
// DOCS_LANG: 'en' | 'jp' | 'kr'                       (default: 'en')
const nodeEnv = process.env.NODE_ENV || 'development';
const docsLang = process.env.DOCS_LANG || 'en';

const mode: DocsMode = nodeEnv === 'production' ? 'prod'
	: nodeEnv === 'staging' ? 'staging'
		: 'dev';

// ── Site URL — varies by build mode ─────────────────────────────────────────
const PROD_HOST = 'https://www.infragistics.com';
const STAGING_HOST = 'https://staging.infragistics.com';

const { base } = IGDOCS_PLATFORMS.Angular;
const site = mode === 'prod' ? `${PROD_HOST}${base}`
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
	base: mode !== 'dev' ? base : undefined,
	title: 'Ignite UI for Angular',
	description: 'Component and API reference docs for Ignite UI for Angular.',
	platform: 'angular',
	navLang: docsLang === 'jp' ? 'ja' : docsLang,
	mode,
	productLinks: Object.values(IGDOCS_PLATFORMS).map(({ label, key, base: b }) => ({
		label,
		href: mode === 'prod' ? `${PROD_HOST}${b}` : `${STAGING_HOST}${b}`,
		platform: key,
	})),
	source: {
		tocPath: `${componentsDocsDir}/toc.json`,
		docsDir: componentsDocsDir,
		imagesDir: path.join(docsDir, 'images'),
	},
	sidebar: { exclude: [/^internal\//] },
	starlight: {
		// logo: { src: './public/favicon.svg' },
	},
	image: { service: { entrypoint: 'astro/assets/services/noop' } },
	integrations: [mdx()],
	// Expose @/ alias so MDX files can import Sample.astro and peer components.
	vite: {
		resolve: {
			alias: { '@': path.resolve('./src') },
		},
	},
});

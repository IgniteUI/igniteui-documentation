// @ts-check
import mdx from '@astrojs/mdx';
import path from 'node:path';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS, type NavLang } from 'docs-template/platform';
import { normalizeMdxDir } from 'docs-template/normalize-mdx';

// ── Build mode and language ──────────────────────────────────────────────────
// DOCS_ENV: 'development' | 'staging' | 'production'  (preferred, default: 'development')
// NODE_ENV: fallback — do NOT set to 'staging'; Vite derives import.meta.env.DEV from it.
// DOCS_LANG: 'en' | 'jp'                              (default: 'en')
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';
const docsLang = (process.env.DOCS_LANG || 'en') as NavLang;

if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
	throw new Error(
		`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`
	);
}

const mode: DocsMode = docsEnv;

// ── Site URL — varies by build mode ─────────────────────────────────────────
const PROD_HOST = 'https://www.igniteui.com';
const STAGING_HOST = 'https://staging.igniteui.com';

// jp.infragistics.com is the JP domain; the base path is the same as en.
const platformKey = docsLang === 'jp' ? 'jQueryJP' : 'jQuery';
const { base } = IGDOCS_PLATFORMS[platformKey];
const site = mode === 'production' ? `${PROD_HOST}${base}`
	: mode === 'staging' ? `${STAGING_HOST}${base}`
	: 'http://localhost:4335';

// ── Source paths ─────────────────────────────────────────────────────────────
// Japanese source files live in 'ja/' (ISO 639-1 code used by the migration
// pipeline), while the DOCS_LANG environment value is 'jp' (matching other
// platform conventions). All other languages use DOCS_LANG as the folder name.
const contentLangDir = docsLang === 'jp' ? 'ja' : docsLang;
const docsDir  = path.resolve(`./src/content/${contentLangDir}/topics`);
const tocPath  = docsLang === 'jp'
	? path.resolve('./src/content/toc.json')
	: path.resolve('./toc.json');

// ── Pre-process: normalize legacy DocFX MDX files to Astro/Starlight format ──
normalizeMdxDir(docsDir);

// https://astro.build/config
export default createDocsSite({
	site,
	base: mode !== 'development' ? base : undefined,
	title: 'Ignite UI for jQuery',
	description: 'Component and API reference docs for Ignite UI for jQuery.',
	platform: 'jquery',
	navLang: docsLang,
	mode,
	productLinks: Object.values(IGDOCS_PLATFORMS)
		.filter(p => p.lang === docsLang)
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

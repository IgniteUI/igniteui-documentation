// @ts-check
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS, type NavLang } from 'docs-template/platform';
import { generateGridTopics } from './src/scripts/generate-grids.mjs';
import mdx from '@astrojs/mdx';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Preserve the project root before chdir so platform-context.ts can find docConfig.json.
process.env.DOCS_PROJECT_ROOT = __dirname;
// When --outDir=../../dist/* points outside docs/angular/, Astro's getOutDirWithinCwd()
// falls back to .astro/ as serverRoot, causing image generation to ENOENT.
// Changing CWD to the repo root makes dist/* start with CWD, so serverRoot is correct.
// Astro resolves --outDir against the project root (not CWD), so that path is unaffected.
process.chdir(path.join(__dirname, '../..'));

// ── Build mode and language ──────────────────────────────────────────────────
// DOCS_ENV: 'development' | 'staging' | 'production'  (preferred, default: 'development')
// NODE_ENV: fallback — do NOT set to 'staging'; Vite derives import.meta.env.DEV from it.
// DOCS_LANG: 'en' | 'jp' | 'kr'                       (default: 'en')
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';
const docsLang = (process.env.DOCS_LANG || 'en') as NavLang;

if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
	throw new Error(
		`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`
	);
}

const mode: DocsMode = docsEnv;

// ── Site URL — varies by build mode ─────────────────────────────────────────
const PROD_HOST = docsLang === 'jp' ? 'https://jp.infragistics.com' : 'https://www.infragistics.com';
const STAGING_HOST = docsLang === 'jp' ? 'https://jp.staging.infragistics.com' : 'https://staging.infragistics.com';

const platformKey = docsLang === 'jp' ? 'AngularJP' : 'Angular';
const { base } = IGDOCS_PLATFORMS[platformKey];
const site = mode === 'production' ? `${PROD_HOST}${base}`
	: mode === 'staging' ? `${STAGING_HOST}${base}`
	: 'http://localhost:4321';

// ── Source paths ─────────────────────────────────────────────────────────────
const docsDir = path.join(__dirname, 'src', 'content', docsLang);
const componentsDocsDir = path.join(docsDir, 'components');
const templatesDir = path.join(docsDir, 'grids_templates');

// ── @xplat-images resolution ──────────────────────────────────────────────
// Topics generated from the xplat source import their images as
// '@xplat-images/<path>'. Those images already live once in the shared xplat
// asset folder, which is language-agnostic — so resolve there, and let the
// Angular locale's own image directory take precedence when it holds the same
// relative path. That override is what keeps the localized Japanese screenshots
// (general/nuget-*, marketing/*) winning over the English originals, without
// every other xplat image needing a copy in this tree.
//
// Ordered highest-precedence-first. A specifier matching nothing resolves to the
// shared root, so the resulting ImageNotFound names where a new shared image
// belongs rather than a per-locale path most images should never need.
const xplatImageRoots = [
	path.join(__dirname, 'src', 'content', docsLang, 'images'),
	path.join(__dirname, '..', 'xplat', 'src', 'assets', 'images'),
];

const XPLAT_IMAGES = '@xplat-images';

// A resolve.alias cannot express a fallback, so this runs as a pre plugin.
function xplatImages(): Plugin {
	return {
		name: 'igdocs:xplat-images',
		enforce: 'pre',
		resolveId(source) {
			if (source !== XPLAT_IMAGES && !source.startsWith(`${XPLAT_IMAGES}/`)) return null;
			const rel = source.slice(XPLAT_IMAGES.length + 1);
			const hit = xplatImageRoots.find(root => existsSync(path.join(root, rel)));
			return path.join(hit ?? xplatImageRoots[xplatImageRoots.length - 1], rel);
		},
	};
}
const localizedDescription: Partial<Record<NavLang, string>> = {
	jp: 'Ignite UI for Angular のコンポーネントと API リファレンス ドキュメントです。',
	kr: 'Ignite UI for Angular 컴포넌트 및 API 참조 문서입니다.',
};

// ── Pre-build steps (run before Astro starts) ────────────────────────────────
generateGridTopics(templatesDir, componentsDocsDir);

// https://astro.build/config
export default createDocsSite({
	site,
	base: mode !== 'development' ? base : undefined,
	title: 'Ignite UI for Angular',
	description: 'Component and API reference docs for Ignite UI for Angular.',
	localizedDescription: localizedDescription[docsLang],
	platform: 'angular',
	navLang: docsLang,
	mode,
	build: {
		format: 'file'
	},
	trailingSlash: 'never',
	productLinks: Object.values(IGDOCS_PLATFORMS)
		.filter(p => p.lang === docsLang)
		.map(({ label, key, base: b }) => ({
			label,
			href: mode === 'production' ? `${PROD_HOST}${b}` : `${STAGING_HOST}${b}`,
			platform: key,
		})),
	packages: Object.values(IGDOCS_PLATFORMS)
		.filter(p => p.lang === docsLang)
		.map(({ label, key, base, root }) => ({
			label,
			value: key,
			href: mode === 'production' ? `${PROD_HOST}${base}${root}` : `${STAGING_HOST}${base}${root}`,
			// Switching keeps the current topic when it exists under `base`; `href` is the fallback.
			base: mode === 'production' ? `${PROD_HOST}${base}` : `${STAGING_HOST}${base}`,
		})),
	selectedPackage: 'angular',
	source: {
		tocPath: `${componentsDocsDir}/toc.json`,
		docsDir: componentsDocsDir,
	},
	head: [
		{ tag: 'link', attrs: { rel: 'icon', href: `${mode !== 'development' ? base : ''}/favicon.ico`, type: 'image/x-icon' } },
	],
	sidebar: { exclude: [/^internal\//] },
	integrations: [
		mdx(),
		{
			name: 'watch-docs-template',
			hooks: {
				'astro:server:setup': ({ server }) => {
					server.watcher.add(path.resolve(__dirname, '../../src'));
				},
			},
		},
	],
	// Expose @/ alias so MDX files can import Sample.astro and peer components.
	// @xplat-images is handled by xplatImages() rather than an alias — see above.
	vite: {
		plugins: [xplatImages()],
		resolve: {
			alias: {
				'@': path.join(__dirname, 'src'),
			},
		},
		server: { fs: { strict: false } },
	},
});

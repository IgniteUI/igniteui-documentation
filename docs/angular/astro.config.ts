import path from 'node:path';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { generateGridTopics, normalizeImagePaths } from './src/generate-grids.mjs';
import { remarkEnv } from './src/plugins/remark-env.mjs';

// ── Build mode and language ──────────────────────────────────────────────────
// NODE_ENV: 'development' | 'staging' | 'production'  (default: 'development')
// DOCS_LANG: 'en' | 'jp' | 'kr'                       (default: 'en')
const nodeEnv = process.env.NODE_ENV || 'development';
const docsLang = process.env.DOCS_LANG || 'en';

const mode: DocsMode = nodeEnv === 'production' ? 'prod'
	: nodeEnv === 'staging' ? 'staging'
		: 'dev';

// ── Site URL — varies by build mode ─────────────────────────────────────────
const igBase = mode === 'prod'
	? 'https://www.infragistics.com/products/'
	: 'https://staging.infragistics.com/products/';

const IG_PATHS = {
	Angular: 'ignite-ui-angular/angular/components',
	React: 'ignite-ui-react/react/components',
	WebComponents: 'ignite-ui-web-components/web-components/components',
	Blazor: 'ignite-ui-blazor/blazor/components',
} as const;

const site = mode === 'dev' ? 'http://localhost:4321' : `${igBase}${IG_PATHS.Angular}`;

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
	title: 'Ignite UI for Angular',
	description: 'Component and API reference docs for Ignite UI for Angular.',
	platform: 'angular',
	navLang: docsLang === 'jp' ? 'ja' : docsLang,
	mode,
	productLinks: [
		{ label: 'Angular', href: `${igBase}${IG_PATHS.Angular}`, platform: 'angular' },
		{ label: 'React', href: `${igBase}${IG_PATHS.React}`, platform: 'react' },
		{ label: 'Web Components', href: `${igBase}${IG_PATHS.WebComponents}`, platform: 'web-components' },
		{ label: 'Blazor', href: `${igBase}${IG_PATHS.Blazor}`, platform: 'blazor' },
	],
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

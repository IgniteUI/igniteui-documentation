// @ts-check
import path from 'node:path';
import { createDocsSite } from 'docs-template/integration';
import { generateGridTopics, normalizeImagePaths } from './src/generate-grids.mjs';
import { remarkEnv } from './src/plugins/remark-env.mjs';

// ── Resolve build mode and language from environment variables ───────────────
// NODE_ENV: 'development' | 'staging' | 'production'  (default: 'development')
// DOCS_LANG: 'en' | 'jp' | 'kr'                       (default: 'en')
const nodeEnv = process.env.NODE_ENV || 'development';
const docsLang = process.env.DOCS_LANG || 'en';

/** @type {'dev' | 'staging' | 'prod'} */
const mode = nodeEnv === 'production' ? 'prod'
	: nodeEnv === 'staging' ? 'staging'
		: 'dev';

const docsDir = path.resolve(`./src/content/${docsLang}`);
const componentsDocsDir = path.join(docsDir, 'components');
const templatesDir = path.resolve(`${docsDir}/grids_templates`);

// ── Pre-build steps (run before Astro starts) ───────────────────────────────
generateGridTopics(templatesDir, componentsDocsDir);
normalizeImagePaths(componentsDocsDir);

const PLATFORM_URL_BASE: string = nodeEnv === 'production'
	? 'https://www.infragistics.com/products/'
	: 'https://staging.infragistics.com/products/';

const PLATFORM_SITE: Record<string, string> = {
    Angular:       `${PLATFORM_URL_BASE}ignite-ui-angular/angular/components`,
    React:         `${PLATFORM_URL_BASE}ignite-ui-react/react/components`,
    WebComponents: `${PLATFORM_URL_BASE}ignite-ui-web-components/web-components/components`,
    Blazor:        `${PLATFORM_URL_BASE}ignite-ui-blazor/blazor/components`,
};

// https://astro.build/config
export default createDocsSite({
	site: PLATFORM_SITE.Angular,
	base: '/docs-angular-new',
	title: 'Ignite UI for Angular',
	description: 'Component and API reference docs for Ignite UI for Angular.',
	platform: 'angular',
	navLang: docsLang === 'jp' ? 'ja' : docsLang,   // docs-template expects 'ja' not 'jp'
	mode,
	productLinks: [
        { label: 'Angular',        href: PLATFORM_SITE.Angular,       platform: 'angular' },
        { label: 'React',          href: PLATFORM_SITE.React,         platform: 'react' },
        { label: 'Web Components', href: PLATFORM_SITE.WebComponents, platform: 'web-components' },
        { label: 'Blazor',         href: PLATFORM_SITE.Blazor,        platform: 'blazor' },
    ],
	source: {
		tocPath: `${componentsDocsDir}/toc.yml`,
		docsDir: componentsDocsDir,
		imagesDir: `${docsDir}/images`,
	},
	sidebar: { exclude: [/^internal\//] },
	head: [],
	starlight: {
		// logo: { src: './public/favicon.svg' },
	},
	image: { service: { entrypoint: 'astro/assets/services/noop' } },
	markdown: { remarkPlugins: [remarkEnv] },
});

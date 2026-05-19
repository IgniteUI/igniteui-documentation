declare module 'virtual:docs-template/site-meta' {
	export const title: string;
	export const description: string;
	export const sidebar: { label: string; slug?: string; items?: unknown[] }[];
	export const mode: 'dev' | 'staging' | 'prod';
	export const trailingSlash: 'always' | 'never' | 'ignore';
}

declare module 'virtual:docs-template/nav-html' {
	export const platform: 'igniteui' | 'angular' | 'react' | 'blazor' | 'web-components' | 'slingshot' | 'appbuilder' | null;
	export const navLang: string;
	export const prefetched: boolean;
	export const headerHtml: string;
	export const uiFooterHtml: string;
	export const footerHtml: string;
	export const abPrefetched: boolean;
	export const abHeaderHtml: string;
	export const abFooterHtml: string;
	export const abFooterUtilsHtml: string;
	export const abFooterCopyrightHtml: string;
	export const abContactSalesHtml: string;
}
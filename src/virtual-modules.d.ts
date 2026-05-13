declare module 'virtual:docs-template/site-meta' {
  export const sidebar: { label: string; slug?: string; items?: unknown[] }[];
  export const title: string;
  export const navLang: import('./platform.ts').NavLang;
  /** Cross-product navigation links for the DocsSubHeader. */
  export const productLinks: Array<{
    label: string;
    href: string;
    platform?: string;
  }>;
  /** Extra <head> entries injected by siteMetaIntegration (platform CDN, highlight.js, etc.). */
  export const headEntries: Array<{
    tag: string;
    attrs?: Record<string, string | boolean | undefined>;
    content?: string;
  }>;
  /** Astro trailingSlash config value: 'always' | 'never' | 'ignore'. */
  export const trailingSlash: 'always' | 'never' | 'ignore';
}

declare module 'virtual:docs-template/nav-html' {
  export const platform: 'igniteui' | 'angular' | 'react' | 'blazor' | 'web-components' | 'slingshot' | 'appbuilder' | null;
  export const themeApiUrl: string;
  export const widgetScriptSrc: string;
}

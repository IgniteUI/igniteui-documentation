declare module 'virtual:docs-template/site-meta' {
  export const sidebar: { label: string; slug?: string; items?: unknown[] }[];
  export const title: string;
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
}

import type { NavLang, NavTheme } from './platform.ts';

declare module 'virtual:docs-template/nav-html' {
  export const platform: 'igniteui' | 'angular' | 'react' | 'blazor' | 'web-components' | 'slingshot' | 'appbuilder' | null;
  export const navLang: NavLang;
  export const themeApiUrl: string;
  export const widgetScriptSrc: string;
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

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
  /** Locale for the nav prefetch URL. Mirrors the value on `virtual:docs-template/nav-html`. */
  export const navLang: NavLang;
  /** Items for the DocsSubHeader package/platform selector. Empty array when not configured. */
  export const packages: Array<string | { label: string; value?: string; href?: string }>;
  /** Initially selected package. Empty string when not configured. */
  export const selectedPackage: string;
}

declare module 'virtual:docs-template/nav-html' {
  export const platform: 'igniteui' | 'angular' | 'react' | 'blazor' | 'web-components' | 'slingshot' | 'appbuilder' | null;
}

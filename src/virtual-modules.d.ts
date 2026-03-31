// virtual:starlight/components/* are declared in Starlight's virtual-internal.d.ts
// which is not publicly re-exported. Declare the ones we use directly.
declare module 'virtual:starlight/components/Search' {
  const Search: typeof import('@astrojs/starlight/components/Search.astro').default;
  export default Search;
}

declare module 'virtual:docs-template/site-meta' {
  export const title: string;
  export const description: string;
  export const sidebar: { label: string; slug?: string; items?: unknown[] }[];
  /** Build / deployment mode set via `createDocsSite({ mode })`. */
  export const mode: 'dev' | 'staging' | 'prod';
  /** Cross-product navigation links for the DocsSubHeader. */
  export const productLinks: Array<{
    label: string;
    href: string;
    platform?: string;
  }>;
}

declare module 'virtual:docs-template/nav-html' {
  /**
   * The platform set via `siteMetaIntegration({ platform })` in astro.config.mjs.
   * `null` when no platform is configured (defaults to IG nav styles/behaviour).
   */
  export const platform: 'igniteui' | 'angular' | 'react' | 'blazor' | 'web-components' | 'slingshot' | 'appbuilder' | 'reveal' | null;
  /** The locale configured for the nav fetch (`'en'` | `'ja'` | `'kr'`). */
  export const navLang: string;
  /** `true` when the IG nav was successfully fetched at build time. */
  export const prefetched: boolean;
  /** Outer HTML of `<header id="header">` from infragistics.com/navigation. */
  export const headerHtml: string;
  /** Outer HTML of `<footer class="ui-footer ...">` from infragistics.com/navigation. */
  export const uiFooterHtml: string;
  /** Outer HTML of `<footer id="footer">` from infragistics.com/navigation. */
  export const footerHtml: string;

  /** `true` when the AppBuilder nav was successfully prefetched at build time. */
  export const abPrefetched: boolean;
  /** Outer HTML of `<header>` from appbuilder.dev/header-footer-export. */
  export const abHeaderHtml: string;
  /** Outer HTML of `<footer>` from appbuilder.dev/header-footer-export. */
  export const abFooterHtml: string;
  /** Outer HTML of the `.footer.footer-utils` element. */
  export const abFooterUtilsHtml: string;
  /** Outer HTML of the `.footer.footer-copyright` element. */
  export const abFooterCopyrightHtml: string;
  /** Outer HTML of the `#contactSales` modal element. */
  export const abContactSalesHtml: string;
}

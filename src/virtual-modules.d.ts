declare module 'virtual:docs-template/site-meta' {
  export const title: string;
  export const description: string;
  export const sidebar: { label: string; slug?: string; items?: unknown[] }[];
}

declare module 'virtual:docs-template/nav-html' {
  /** `true` when the nav was successfully fetched at build time. */
  export const prefetched: boolean;
  /** Outer HTML of `<header id="header">` from infragistics.com/navigation. */
  export const headerHtml: string;
  /** Outer HTML of `<footer class="ui-footer ...">` from infragistics.com/navigation. */
  export const uiFooterHtml: string;
  /** Outer HTML of `<footer id="footer">` from infragistics.com/navigation. */
  export const footerHtml: string;
}

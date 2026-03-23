/**
 * platform.mjs
 *
 * Central registry of per-platform CDN assets (styles / scripts) and nav
 * endpoint configuration, ported from igniteui-docfx-template:
 *   - template/partials/head.tmpl.partial    (styles + AppBuilder init script)
 *   - template/partials/scripts.tmpl.partial (scripts per platform)
 *   - template/conceptual.html.primary.js   (platform flag derivation)
 *
 * Usage from astro.config.mjs:
 *   import { getPlatformHead } from './src/platform.mjs';
 *   // inside starlight({ head: getPlatformHead('angular', 'en') })
 *
 * Usage from integration.mjs:
 *   import { getNavConfig } from './platform.mjs';
 *   const { navType, navUrl } = getNavConfig(platform, navLang);
 */

// ---------------------------------------------------------------------------
// Shared IG styles — used by: angular, react, blazor, web-components, slingshot
// ---------------------------------------------------------------------------
const IG_STYLES = [
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/layout.css' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/animate-custom.css' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/fontello.css' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' } },
  {
    tag: 'link',
    attrs: {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
      integrity: 'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u',
      crossorigin: 'anonymous',
    },
  },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/css/navigation.css' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/css/footer.css' } },
];

// ---------------------------------------------------------------------------
// Shared IG scripts — used by: angular, react, blazor, web-components, slingshot
// ---------------------------------------------------------------------------
const IG_SCRIPTS = [
  {
    tag: 'script',
    attrs: {
      src: 'https://code.jquery.com/jquery-3.1.0.js',
      integrity: 'sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=',
      crossorigin: 'anonymous',
    },
  },
  { tag: 'script', attrs: { src: 'https://www.infragistics.com/assets/modern/scripts/plugins.nav.js' } },
  { tag: 'script', attrs: { src: 'https://www.infragistics.com/assets/modern/scripts/navigation.js' } },
];

// ---------------------------------------------------------------------------
// AppBuilder styles — source: head.tmpl.partial {{#_isAppBuilder}} block
// ---------------------------------------------------------------------------
const APPBUILDER_STYLES = [
  // Mega-menu plugin styles
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/uploads/maxmegamenu/style.css?ver=631e5d', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-includes/css/dashicons.min.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/plugins/megamenu-pro/icons/genericons/genericons/genericons.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/plugins/megamenu-pro/icons/fontawesome6/css/all.min.css', media: 'all' } },
  // Bootstrap v4.4 partials (slingshot/appbuilder theme)
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_reboot.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_type.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_grid.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_buttons.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_forms.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_input-group.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_custom-forms.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_utilities.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/ig-modal.css', media: 'all' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/css/styles.css', media: 'all' } },
  // Fonts
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Figtree:300,400,700&display=swap' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap' } },
];

// ---------------------------------------------------------------------------
// AppBuilder scripts — source: scripts.tmpl.partial {{#_isAppBuilder}} block
// These are injected into <head> so they are available when the prebuild
// header HTML calls jQuery / maxmegamenu on load.
// ---------------------------------------------------------------------------
const APPBUILDER_SCRIPTS = [
  // jQuery from staging (megamenu plugins may depend on this specific version)
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-includes/js/jquery/jquery.min.js?ver=3.7.1' } },
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1' } },
  // Site JS
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/js/plugins.js?ver=1' } },
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/js/script.js?ver=1' } },
  // Mega-menu plugins
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-includes/js/hoverIntent.min.js?ver=1.10.2' } },
  // Inline megamenu config (must precede the megamenu plugin scripts)
  { tag: 'script', attrs: {}, content: 'var megamenu = {"timeout":"300","interval":"100"};' },
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-content/plugins/megamenu-pro/assets/public.js?ver=2.3.1.1' } },
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-content/plugins/megamenu/js/maxmegamenu.js?ver=3.3.1' } },
  // Contact form + lead tracking
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/js/sf.common.js?ver=1' } },
  { tag: 'script', attrs: { src: 'https://www.google.com/recaptcha/api.js?render=6Lc-MFAaAAAAAIWi7UOrSUfUZnVmDUSsXjzS4BgY&ver=1' } },
  { tag: 'script', attrs: { src: 'https://staging.appbuilder.dev/wp-content/themes/slingshot/js/leadTracker.js?ver=1' } },
];

// ---------------------------------------------------------------------------
// Platform registry
// navType drives which endpoint the build-time prefetch uses:
//   'infragistics' → www/jp.infragistics.com/navigation
//   'appbuilder'   → www.appbuilder.dev/header-footer-export
//   'reveal'       → no fetch (static embedded nav)
// ---------------------------------------------------------------------------
export const PLATFORM_DEFS = {
  angular:           { navType: 'infragistics', styles: IG_STYLES,         scripts: IG_SCRIPTS         },
  react:             { navType: 'infragistics', styles: IG_STYLES,         scripts: IG_SCRIPTS         },
  blazor:            { navType: 'infragistics', styles: IG_STYLES,         scripts: IG_SCRIPTS         },
  'web-components':  { navType: 'infragistics', styles: IG_STYLES,         scripts: IG_SCRIPTS         },
  slingshot:         { navType: 'infragistics', styles: IG_STYLES,         scripts: IG_SCRIPTS         },
  appbuilder:        { navType: 'appbuilder',   styles: APPBUILDER_STYLES, scripts: APPBUILDER_SCRIPTS },
  reveal:            { navType: 'reveal',        styles: [],                scripts: []                 },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns an array of Starlight `head` entries for the given platform.
 * Pass the result directly to `starlight({ head: getPlatformHead(...) })`.
 *
 * @param {keyof PLATFORM_DEFS} platform
 * @param {string} [lang='en']  Locale — not currently used but kept for API completeness.
 * @returns {Array<{ tag: string, attrs: Record<string,string>, content?: string }>}
 */
export function getPlatformHead(platform, lang = 'en') {
  const def = PLATFORM_DEFS[platform];
  if (!def) {
    console.warn(`[docs-template] Unknown platform "${platform}" — no head entries injected.`);
    return [];
  }
  return [...def.styles, ...def.scripts];
}

/**
 * Returns the nav endpoint config for the given platform.
 * Used internally by siteMetaIntegration to decide what to prefetch.
 *
 * @param {keyof PLATFORM_DEFS | null} platform
 * @param {string} [lang='en']
 * @returns {{ navType: string, navUrl: string | null }}
 */
export function getNavConfig(platform, lang = 'en') {
  const igBase = lang === 'ja' ? 'https://jp.infragistics.com' : 'https://www.infragistics.com';
  switch (platform) {
    case 'appbuilder':
      return { navType: 'appbuilder', navUrl: 'https://www.appbuilder.dev/header-footer-export' };
    case 'reveal':
      return { navType: 'reveal', navUrl: null };
    case 'angular':
    case 'react':
    case 'blazor':
    case 'web-components':
    case 'slingshot':
      return { navType: 'infragistics', navUrl: `${igBase}/navigation` };
    default:
      return { navType: 'none', navUrl: null };
  }
}

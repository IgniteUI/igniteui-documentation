/**
 * platform.ts
 *
 * Central registry of per-platform CDN assets (styles / scripts) and nav
 * endpoint configuration, ported from igniteui-docfx-template:
 *   - template/partials/head.tmpl.partial    (styles + AppBuilder init script)
 *   - template/partials/scripts.tmpl.partial (scripts per platform)
 *   - template/conceptual.html.primary.js   (platform flag derivation)
 *
 * Usage from astro.config.ts:
 *   import { getPlatformHead } from './src/platform.ts';
 *   // inside starlight({ head: getPlatformHead('angular', 'en') })
 *
 * Usage from integration.ts:
 *   import { getNavConfig } from './platform.ts';
 *   const { navType, navUrl } = getNavConfig(platform, navLang);
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** HTML tag names accepted by Starlight's `head` array. */
export type HeadTag =
    | 'title' | 'link' | 'style' | 'base'
    | 'meta' | 'script' | 'noscript' | 'template';

/** Single entry in Starlight's `head` array — tag, attrs, optional content. */
export type HeadEntry = {
    tag: HeadTag;
    attrs?: Record<string, string | boolean | undefined>;
    content?: string;
};

export type PlatformKey =
    | 'angular'
    | 'react'
    | 'blazor'
    | 'web-components'
    | 'slingshot'
    | 'appbuilder';

/** Locale code for nav/API requests and UI string lookups. */
export type NavLang = 'en' | 'jp' | 'kr';

/**
 * Theme identifier used by nav/footer components.
 * `'igniteui'` is the catch-all for all IG-family sites that don't have a
 * more specific key; the rest match `PlatformKey` exactly.
 */
export type NavTheme = PlatformKey | 'igniteui';

export interface PlatformMeta {
    title: string; description: string;
    key: PlatformKey; devPort: number;
    base: string; label: string;
    lang: NavLang;
}

type NavType = 'infragistics' | 'appbuilder' | 'none';

interface PlatformDef {
    navType: NavType;
    styles: HeadEntry[];
    scripts: HeadEntry[];
}

export interface NavConfig {
    navType: NavType;
    navUrl: string | null;
}

// ---------------------------------------------------------------------------
// Shared IG styles — used by: angular, react, blazor, web-components, slingshot
// ---------------------------------------------------------------------------
const IG_STYLES: HeadEntry[] = [
    // Bootstrap is wrapped in a CSS cascade layer so its global resets do not
    // bleed into the Starlight theme. The layer priority order is declared at
    // the top of custom.css: @layer bootstrap, starlight.core, starlight.overrides
    // Note: @import layer() does not support the `integrity` SRI attribute.
    {
        tag: 'style',
        content: '@import url("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css") layer(bootstrap);',
    },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/layout.css' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/animate-custom.css' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/assets/modern/css/fontello.css' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/css/navigation.css' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://www.infragistics.com/css/footer.css' } },
];

// ---------------------------------------------------------------------------
// Shared IG scripts — used by: angular, react, blazor, web-components, slingshot
// ---------------------------------------------------------------------------
const IG_SCRIPTS: HeadEntry[] = [
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
const APPBUILDER_STYLES: HeadEntry[] = [
    // Mega-menu plugin styles
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/uploads/maxmegamenu/style.css?ver=631e5d', media: 'all' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-includes/css/dashicons.min.css', media: 'all' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/plugins/megamenu-pro/icons/genericons/genericons/genericons.css', media: 'all' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://staging.appbuilder.dev/wp-content/plugins/megamenu-pro/icons/fontawesome6/css/all.min.css', media: 'all' } },
    // Bootstrap v4.4 partials — wrapped in a CSS cascade layer so they don't
    // override the Starlight theme. See custom.css @layer declaration.
    {
        tag: 'style',
        content: [
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_reboot.css") layer(bootstrap);',
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_type.css") layer(bootstrap);',
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_grid.css") layer(bootstrap);',
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_buttons.css") layer(bootstrap);',
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_forms.css") layer(bootstrap);',
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_input-group.css") layer(bootstrap);',
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_custom-forms.css") layer(bootstrap);',
            '@import url("https://staging.appbuilder.dev/wp-content/themes/slingshot/css/bootstrap.v4.4/_utilities.css") layer(bootstrap);',
        ].join('\n'),
    },
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
const APPBUILDER_SCRIPTS: HeadEntry[] = [
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
// ---------------------------------------------------------------------------
export const PLATFORM_DEFS: Record<PlatformKey, PlatformDef> = {
    angular: { navType: 'infragistics', styles: IG_STYLES, scripts: IG_SCRIPTS },
    react: { navType: 'infragistics', styles: IG_STYLES, scripts: IG_SCRIPTS },
    blazor: { navType: 'infragistics', styles: IG_STYLES, scripts: IG_SCRIPTS },
    'web-components': { navType: 'infragistics', styles: IG_STYLES, scripts: IG_SCRIPTS },
    slingshot: { navType: 'infragistics', styles: IG_STYLES, scripts: IG_SCRIPTS },
    appbuilder: { navType: 'appbuilder', styles: APPBUILDER_STYLES, scripts: APPBUILDER_SCRIPTS },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Shared per-platform metadata for all Ignite UI docs sites.
 * Import this in `astro.config.ts` files instead of duplicating the data.
 */
export const IGDOCS_PLATFORMS: Record<string, PlatformMeta> = {
    // English
    Angular: {
        lang: 'en', label: 'Angular', key: 'angular', devPort: 4331,
        base: '/products/ignite-ui-angular/angular/components',
        title: 'Ignite UI for Angular',
        description: 'Component documentation for Ignite UI for Angular.',
    },
    React: {
        lang: 'en', label: 'React', key: 'react', devPort: 4332,
        base: '/products/ignite-ui-react/react',
        title: 'Ignite UI for React',
        description: 'Component documentation for Ignite UI for React.',
    },
    WebComponents: {
        lang: 'en', label: 'Web Components', key: 'web-components', devPort: 4333,
        base: '/products/ignite-ui-web-components/web-components/components',
        title: 'Ignite UI for Web Components',
        description: 'Component documentation for Ignite UI for Web Components.',
    },
    Blazor: {
        lang: 'en', label: 'Blazor', key: 'blazor', devPort: 4334,
        base: '/products/ignite-ui-blazor/blazor/components',
        title: 'Ignite UI for Blazor',
        description: 'Component documentation for Ignite UI for Blazor.',
    },
    // Japanese
    
    AngularJP: {
        lang: 'jp', label: 'Angular', key: 'angular', devPort: 4341,
        base: '/products/ignite-ui-angular/angular/components',
        title: 'Ignite UI for Angular',
        description: 'Component documentation for Ignite UI for Angular.',
    },
    ReactJP: {
        lang: 'jp', label: 'React', key: 'react', devPort: 4342,
        base: '/products/ignite-ui-react/react/components',
        title: 'Ignite UI for React',
        description: 'Component documentation for Ignite UI for React.',
    },
    WebComponentsJP: {
        lang: 'jp', label: 'Web Components', key: 'web-components', devPort: 4343,
        base: '/products/ignite-ui-web-components/web-components/components',
        title: 'Ignite UI for Web Components',
        description: 'Component documentation for Ignite UI for Web Components.',
    },
    BlazorJP: {
        lang: 'jp', label: 'Blazor', key: 'blazor', devPort: 4344,
        base: '/products/ignite-ui-blazor/blazor/components',
        title: 'Ignite UI for Blazor',
        description: 'Component documentation for Ignite UI for Blazor.',
    },
};

/**
 * Returns an array of Starlight `head` entries for the given platform.
 * Pass the result directly to `starlight({ head: getPlatformHead(...) })`.
 *
 * @param platform - Platform identifier.
 * @param lang - Locale — not currently used but kept for API completeness.
 */
export function getPlatformHead(platform: string, lang = 'en'): HeadEntry[] {
    const def = PLATFORM_DEFS[platform as PlatformKey];
    if (!def) {
        console.warn(`[docs-template] Unknown platform "${platform}" — no head entries injected.`);
        return [];
    }
    return [
        { tag: 'meta', attrs: { property: 'docs:platform', content: platform } },
        ...def.styles,
        ...def.scripts,
    ];
}

/**
 * Returns the nav endpoint config for the given platform.
 * Used internally by siteMetaIntegration to decide what to prefetch.
 *
 * @param platform - Platform identifier, or `null` for no nav.
 * @param lang - Locale for the nav URL ('en' | 'jp' | 'kr').
 */
export function getNavConfig(platform: string | null, lang = 'en'): NavConfig {
    const igBase = lang === 'jp' ? 'https://jp.infragistics.com' : 'https://www.infragistics.com';
    switch (platform) {
        case 'appbuilder':
            return { navType: 'appbuilder', navUrl: 'https://www.appbuilder.dev/header-footer-export' };
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

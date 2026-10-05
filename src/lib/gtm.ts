/**
 * gtm.ts
 *
 * Google Tag Manager wiring shared by every docs page:
 *
 *   - `createGtmHead()` — the `<head>` entries: Consent Mode, the container
 *     loader, the shared Infragistics cookie-consent banner and the SPA
 *     page-view bridge, in the one order that works.
 *   - `createGtmHtmlIntegration()` — the post-build HTML rewrite for the pieces
 *     the layout package exposes no slot for: the GTM `<noscript>` fallback and
 *     the "Cookie Settings" footer control.
 *
 * Why the consent stack is loaded rather than owned here
 * -------------------------------------------------------
 * Docs pages share the main site's GTM containers, so they have to run under
 * the same consent regime as www.infragistics.com or the two halves of one
 * container measure different populations. The marketing site publishes its
 * consent implementation as static assets for exactly this purpose
 * (Marketing-Infragistics issue #31; the contract is docs/CONSENT-EMBEDDING.md
 * in that repo), rebuilt from its own sources on every deploy:
 *
 *   consent-bootstrap.js  the engine: Consent Mode v2 defaults, the `ig_consent`
 *                         cookie (Domain=.infragistics.com, so one decision
 *                         covers www/staging/jp), the category→signal mapping,
 *                         `window.igConsent`, and the `initialCustomConsentUpdate`
 *                         / `customConsentUpdate` dataLayer events the containers
 *                         already listen for
 *   consent-banner.js     the banner markup + behaviour; injects `#igd-consent`
 *                         when the page has none and binds `[data-consent-open]`
 *   consent.css           banner styles, every rule scoped under `.igd-consent`
 *
 * Nothing from those files is copied here: a fork would stop receiving
 * compliance fixes while continuing to look correct. The URLs, `window.igConsent`,
 * the cookie shape and `data-consent-open` are the stable API; wording and
 * design are not, so nothing here asserts on them.
 *
 * Entry order for English pages (load-bearing)
 * --------------------------------------------
 *   1. Inline fail-safe: the dataLayer/gtag shims, the very Consent Mode default
 *      the engine sets itself (every optional signal denied, security granted,
 *      wait_for_update 500) and the main site's `user_id` push. Defaults are
 *      per-key last-write-wins and the engine writes identical values, so the
 *      duplicate changes nothing — but if the engine ever fails to load (404
 *      before the marketing cutover, a network blip, an ad blocker) a *missing*
 *      default is not treated as denial: tags fire as though consent had been
 *      given. These few inline bytes make that failure fail closed instead.
 *   2. consent-bootstrap.js as a plain synchronous <script src> — never `async`,
 *      never `defer`. A default that lands after the container has fired is void
 *      while still appearing to work; a blocking script is what guarantees the
 *      engine has finished before the loader below is reached.
 *   3. The GTM loader, Google's stock snippet.
 *   4. consent.css and consent-banner.js (`defer`). No ordering constraint: by
 *      the time the banner runs the engine has installed its API.
 *   5. Styles for the footer control (see `createGtmHtmlIntegration`).
 *   6. The SPA bridge. DocsLayout renders <ClientRouter />, so topic-to-topic
 *      navigation is a pushState swap: gtm.js runs only on the initial hard load
 *      and no further All Pages trigger fires. On every `astro:page-load` after
 *      the first it pushes `trackSPAPageview`, the Custom Event the published
 *      containers already listen for, so no container change is needed. It also
 *      carries the injected `#igd-consent` element into the incoming document on
 *      `astro:before-swap`: the banner lives in <body>, which the router replaces
 *      wholesale, and its handlers are bound to that node — without this an
 *      undecided visitor would lose the banner on the first navigation.
 *
 * Japanese pages (jp.infragistics.com)
 * ------------------------------------
 * The shared banner ships English copy only, and jp.infragistics.com still runs
 * its own localized consent block, so jp docs do not load the bundle. They mirror
 * what the jp main site does on every page instead: the same all-denied default,
 * then an immediate grant of every signal (the main site treats
 * jp.infragistics.com as implied consent) plus the `initialCustomConsentUpdate`
 * event its container listens for. Adopting the bundle there once it is
 * localized is tracked in Marketing-Infragistics issue #31.
 *
 * Any other locale gets the deny-all default and no banner (fail closed).
 *
 * Astro does not re-execute head scripts whose content is unchanged across a
 * view transition, so every inline entry runs exactly once per full page load.
 * The consent and SPA snippets still guard on a window flag so that a future
 * per-page value in either one cannot double-apply the defaults or register the
 * listeners twice; the loader is left as Google's stock snippet.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import type { HeadEntry, NavLang } from '../platform.ts';

export interface GtmHeadOptions {
    /** Container ID for this build — see `getGtmContainerId()`. */
    containerId: string;
    /** Locale of the build; selects the consent flow described in the module docs. */
    navLang: NavLang;
    /** Where the shared consent bundle is served from, no trailing slash — see `getConsentAssetsBaseUrl()`. */
    consentAssetsBaseUrl: string;
}

/**
 * Whether pages built for this locale load the shared Infragistics consent
 * banner (and therefore need the "Cookie Settings" footer control).
 */
export function usesSharedConsentBanner(navLang: NavLang): boolean {
    return navLang === 'en';
}

/** Class of the footer control; styled by `CONSENT_CONTROL_STYLE`. */
export const CONSENT_CONTROL_CLASS = 'igd-consent-open';

// ---------------------------------------------------------------------------
// Inline snippets
// ---------------------------------------------------------------------------

/** dataLayer + gtag shims. The engine reuses `window.gtag` when it is already a function. */
const GTAG_SHIM = `window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}`;

/** The main site pushes the signed-in visitor's id ahead of the container on every page. */
const USER_ID_PUSH = `try{var igdUserId=localStorage.getItem('userId');if(igdUserId!==null){window.dataLayer.push({'user_id':igdUserId});}}catch(e){}`;

/**
 * Exactly the default consent-bootstrap.js sets. It must stay identical: a
 * default that *differs* from the engine's is where two implementations start
 * fighting (see §3a of the embedding contract).
 */
const SHARED_BANNER_DEFAULT = `gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','functionality_storage':'denied','personalization_storage':'denied','security_storage':'granted','wait_for_update':500});`;

/** The default the Umbraco main site sets ahead of its container, jp.infragistics.com included. */
const LEGACY_SITE_DEFAULT = `gtag('consent','default',{'functionality_storage':'denied','analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','security_storage':'denied','personalization_storage':'denied','wait_for_update':500});`;

/** jp.infragistics.com is implied consent: the main site grants every signal on every page load. */
const JP_IMPLIED_CONSENT = `gtag('consent','update',{'functionality_storage':'granted','security_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted','analytics_storage':'granted','personalization_storage':'granted'});window.dataLayer.push({event:'initialCustomConsentUpdate'});`;

function consentSnippet(body: string): string {
    return `${GTAG_SHIM}if(!window.__igdGtmConsent){window.__igdGtmConsent=1;${body}}`;
}

function gtmLoader(containerId: string): string {
    return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`;
}

/** One `trackSPAPageview` per client-side navigation; the initial hard load is gtm.js's own page view. */
const SPA_PAGEVIEW = `var initial=true;document.addEventListener('astro:page-load',function(){if(initial){initial=false;return;}window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'trackSPAPageview',page_path:location.pathname+location.search,page_location:location.href,page_title:document.title});});`;

/**
 * consent-banner.js appends `#igd-consent` to <body>. Move that very node into
 * the incoming document before the router swaps bodies, so an undecided banner
 * stays on screen and its bound handlers survive the navigation.
 */
const BANNER_CARRY_OVER = `document.addEventListener('astro:before-swap',function(e){var banner=document.getElementById('igd-consent');if(banner&&!e.newDocument.getElementById('igd-consent')){e.newDocument.body.appendChild(banner);}});`;

function spaBridge(carryBanner: boolean): string {
    return `(function(){if(window.__igdGtmSpaBridge)return;window.__igdGtmSpaBridge=1;${SPA_PAGEVIEW}${carryBanner ? BANNER_CARRY_OVER : ''}})();`;
}

/**
 * Makes the footer <button> indistinguishable from the legal links beside it.
 * The main-site footer styles those via `.ui-footer .ui-footer__menu a` (plus
 * `.ui-footer--legal a` for the size); a <button> matches none of them, so the
 * same values are restated here. The fallback placement (see the rewrite) is a
 * plain centred line under the page.
 */
const CONSENT_CONTROL_STYLE = [
    `.${CONSENT_CONTROL_CLASS}{appearance:none;-webkit-appearance:none;background:none;border:0;margin:0;padding:0;font:inherit;line-height:inherit;color:inherit;text-decoration:underline;cursor:pointer}`,
    `.ui-footer .ui-footer__menu .${CONSENT_CONTROL_CLASS}{display:block;padding-top:.5em;font-size:.8em;color:#a7a7a7;text-decoration:none}`,
    `.ui-footer .ui-footer__menu .${CONSENT_CONTROL_CLASS}:hover,.ui-footer .ui-footer__menu .${CONSENT_CONTROL_CLASS}:focus-visible{color:#0099ff}`,
    `.igd-consent-open-fallback{padding:12px 16px;text-align:center;font-size:14px}`,
].join('');

// ---------------------------------------------------------------------------
// <head> entries
// ---------------------------------------------------------------------------

/**
 * The GTM `<head>` entries for one build, in the order described in the module
 * docs. Pass them first in the `head` array so they land as high in `<head>` as
 * DocsLayout allows.
 */
export function createGtmHead({ containerId, navLang, consentAssetsBaseUrl }: GtmHeadOptions): HeadEntry[] {
    const loader: HeadEntry = { tag: 'script', content: gtmLoader(containerId) };

    if (usesSharedConsentBanner(navLang)) {
        return [
            { tag: 'script', content: consentSnippet(SHARED_BANNER_DEFAULT + USER_ID_PUSH) },
            // Synchronous on purpose: no `defer`, no `async` — see the module docs.
            { tag: 'script', attrs: { src: `${consentAssetsBaseUrl}/consent-bootstrap.js` } },
            loader,
            { tag: 'link', attrs: { rel: 'stylesheet', href: `${consentAssetsBaseUrl}/consent.css` } },
            { tag: 'script', attrs: { src: `${consentAssetsBaseUrl}/consent-banner.js`, defer: true } },
            { tag: 'style', content: CONSENT_CONTROL_STYLE },
            { tag: 'script', content: spaBridge(true) },
        ];
    }

    const consent = navLang === 'jp'
        ? LEGACY_SITE_DEFAULT + USER_ID_PUSH + JP_IMPLIED_CONSENT
        : LEGACY_SITE_DEFAULT + USER_ID_PUSH;

    return [
        { tag: 'script', content: consentSnippet(consent) },
        loader,
        { tag: 'script', content: spaBridge(false) },
    ];
}

// ---------------------------------------------------------------------------
// Post-build HTML rewrite
// ---------------------------------------------------------------------------

export interface GtmHtmlIntegrationOptions {
    /** Container ID for the `<noscript>` fallback. */
    containerId: string;
    /** Add the "Cookie Settings" control to the footer — pages that load the shared banner. */
    consentControl: boolean;
}

/**
 * Astro integration that post-processes every built HTML page:
 *
 *   - injects the GTM `<noscript>` fallback immediately after the opening
 *     `<body>` tag;
 *   - when `consentControl` is set, adds a "Cookie Settings"
 *     `<button data-consent-open>` next to the footer's "Cookies" (cookie policy)
 *     link. GDPR Art. 7(3) wants withdrawing consent to be as easy as giving it,
 *     so the control has to be on every page; consent-banner.js binds it with a
 *     delegated listener and re-opens the banner on the *stored* decision. If
 *     the footer already carries a `[data-consent-open]` control (the marketing
 *     site's own footer does), nothing is added.
 *
 * This is a post-build rewrite rather than an Astro component because
 * DocsLayout ships from the published `igniteui-astro-components` package and
 * exposes no body-top or footer slot: a component can only render inside
 * `<main>`, i.e. in the middle of the Pagefind-indexed content region, and the
 * footer itself is the main site's `/navigation` payload rendered verbatim.
 * Rewriting the response in middleware was the other option, but that buffers
 * every HTML response (see #493), whereas this runs once per file at build time.
 *
 * Pages that do not load the container (Astro's redirect stubs, for instance)
 * are left untouched.
 *
 * The dev server serves pages without either addition; only built output gets
 * them (`astro preview` shows the real thing).
 */
export function createGtmHtmlIntegration({ containerId, consentControl }: GtmHtmlIntegrationOptions): AstroIntegration {
    const noscriptMarker = 'Google Tag Manager (noscript)';
    const GTM_LOADER_MARKER = 'googletagmanager.com/gtm.js';
    const noscript = `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`;

    const control = `<button type="button" class="menu__link ${CONSENT_CONTROL_CLASS}" data-consent-open>Cookie Settings</button>`;
    // The footer's cookie-policy entry: `<li …><a … href="/legal/cookie-policy">Cookies</a></li>`.
    // The control becomes its next sibling, reusing the <li> attributes so the
    // spacing matches whatever inline styles the footer currently carries.
    const cookiePolicyItem = /<li\b([^>]*)>\s*<a\b[^>]*\bhref="[^"]*\/legal\/cookie-policy"[^>]*>[\s\S]*?<\/a>\s*<\/li>/i;
    const fallback = `<div class="igd-consent-open-fallback">${control}</div>`;
    let warnedFallback = false;

    function addConsentControl(html: string): string {
        if (html.includes('data-consent-open')) return html;

        const match = cookiePolicyItem.exec(html);
        if (match) {
            const attrs = match[1].replace(/\s+id="[^"]*"/i, '');
            const end = match.index + match[0].length;
            return `${html.slice(0, end)}<li${attrs}>${control}</li>${html.slice(end)}`;
        }

        // The footer markup has changed, or the page has no footer. Keep the
        // control on the page regardless — a missing withdrawal path is the one
        // outcome that is not acceptable — and say so once per build.
        if (!warnedFallback) {
            warnedFallback = true;
            console.warn('[docs-template] gtm: footer cookie-policy link not found — the "Cookie Settings" control was appended before </body> instead.');
        }
        return html.replace(/<\/body>/i, `${fallback}</body>`);
    }

    function rewriteFile(file: string): void {
        const original = fs.readFileSync(file, 'utf-8');
        // Only pages that load the container get the fallback and the control.
        // Astro's redirect stubs, for instance, have neither the layout nor a
        // <head> with GTM in it, so a <noscript> iframe or a "Cookie Settings"
        // button there would be dead weight (and a false footer-not-found alarm).
        if (!original.includes(GTM_LOADER_MARKER)) return;
        let html = original;
        if (!html.includes(noscriptMarker)) {
            html = html.replace(/<body[^>]*>/i, (openTag: string) => openTag + noscript);
        }
        if (consentControl) html = addConsentControl(html);
        if (html !== original) fs.writeFileSync(file, html, 'utf-8');
    }

    function rewriteDir(dir: string): void {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { rewriteDir(full); continue; }
            if (entry.name.endsWith('.html')) rewriteFile(full);
        }
    }

    return {
        name: 'docs-template:gtm-html',
        hooks: {
            'astro:build:done'({ dir }) {
                rewriteDir(fileURLToPath(dir));
            },
        },
    };
}

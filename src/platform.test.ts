import { describe, expect, it, vi } from 'vitest';
import { getNavConfig, getPlatformHead, IGDOCS_PLATFORMS, PLATFORM_DEFS, type PlatformKey } from './platform.ts';

const PLATFORM_KEYS = Object.keys(PLATFORM_DEFS) as PlatformKey[];
const IG_PLATFORMS = PLATFORM_KEYS.filter(key => key !== 'appbuilder');

describe('getNavConfig', () => {
    it.each(IG_PLATFORMS)('points %s at the Infragistics nav endpoint', platform => {
        expect(getNavConfig(platform)).toEqual({
            navType: 'infragistics',
            navUrl: 'https://www.infragistics.com/navigation',
        });
    });

    it.each(IG_PLATFORMS)('uses the Japanese host for %s in jp', platform => {
        expect(getNavConfig(platform, 'jp')).toEqual({
            navType: 'infragistics',
            navUrl: 'https://jp.infragistics.com/navigation',
        });
    });

    it.each(IG_PLATFORMS)('falls back to the English host for %s in kr', platform => {
        expect(getNavConfig(platform, 'kr').navUrl).toBe('https://www.infragistics.com/navigation');
    });

    it.each(['en', 'jp', 'kr'])('keeps the AppBuilder endpoint locale-independent in %s', lang => {
        expect(getNavConfig('appbuilder', lang)).toEqual({
            navType: 'appbuilder',
            navUrl: 'https://www.appbuilder.dev/header-footer-export',
        });
    });

    it.each(['en', 'jp', 'kr'])('returns no nav for a null platform in %s', lang => {
        expect(getNavConfig(null, lang)).toEqual({ navType: 'none', navUrl: null });
    });

    it('returns no nav for an unknown platform', () => {
        expect(getNavConfig('mystery')).toEqual({ navType: 'none', navUrl: null });
    });

    it('defaults to the English host when no locale is given', () => {
        expect(getNavConfig('angular').navUrl).toBe('https://www.infragistics.com/navigation');
    });
});

describe('getPlatformHead', () => {
    it.each(PLATFORM_KEYS)('opens the head of %s with the platform meta tag', platform => {
        const head = getPlatformHead(platform);

        expect(Array.isArray(head)).toBe(true);
        expect(head[0]).toEqual({ tag: 'meta', attrs: { property: 'docs:platform', content: platform } });
    });

    it.each(IG_PLATFORMS)('includes the shared Infragistics navigation assets for %s', platform => {
        const head = getPlatformHead(platform);
        const hrefs = head.map(entry => entry.attrs?.['href']);
        const srcs = head.map(entry => entry.attrs?.['src']);

        expect(hrefs).toContain('https://www.infragistics.com/css/navigation.css');
        expect(srcs).toContain('https://www.infragistics.com/assets/modern/scripts/navigation.js');
    });

    it('includes the AppBuilder mega-menu assets instead for appbuilder', () => {
        const head = getPlatformHead('appbuilder');
        const hrefs = head.map(entry => entry.attrs?.['href']);
        const srcs = head.map(entry => entry.attrs?.['src']);

        expect(hrefs).toContain('https://staging.appbuilder.dev/wp-includes/css/dashicons.min.css');
        expect(srcs).toContain('https://staging.appbuilder.dev/wp-content/plugins/megamenu/js/maxmegamenu.js?ver=3.3.1');
        expect(hrefs).not.toContain('https://www.infragistics.com/css/navigation.css');
    });

    it('carries the bootstrap cascade layer as an inline style', () => {
        const head = getPlatformHead('angular');
        const styles = head.filter(entry => entry.tag === 'style');

        expect(styles).toHaveLength(1);
        expect(styles[0].content).toContain('layer(bootstrap)');
    });

    it('warns and returns nothing for an unknown platform', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
            expect(getPlatformHead('mystery')).toEqual([]);
            expect(warn).toHaveBeenCalledOnce();
        } finally {
            warn.mockRestore();
        }
    });

    it('ignores the locale argument', () => {
        expect(getPlatformHead('angular', 'jp')).toEqual(getPlatformHead('angular', 'en'));
    });
});

describe('IGDOCS_PLATFORMS', () => {
    it('pairs every English entry with a Japanese one on the same platform key', () => {
        for (const [name, meta] of Object.entries(IGDOCS_PLATFORMS)) {
            if (meta.lang !== 'en') continue;
            const jp = IGDOCS_PLATFORMS[`${name}JP`];
            expect(jp, `${name}JP`).toBeDefined();
            expect(jp.key).toBe(meta.key);
            expect(jp.lang).toBe('jp');
        }
    });

    it('gives every entry its own dev port', () => {
        const ports = Object.values(IGDOCS_PLATFORMS).map(meta => meta.devPort);

        expect(new Set(ports).size).toBe(ports.length);
    });

    it('uses a platform key that the head registry knows', () => {
        for (const meta of Object.values(IGDOCS_PLATFORMS)) {
            expect(PLATFORM_DEFS[meta.key]).toBeDefined();
        }
    });
});

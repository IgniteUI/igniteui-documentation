import { describe, expect, it, vi } from 'vitest';
import { getPlatformHead, IGDOCS_PLATFORMS, PLATFORM_DEFS, type PlatformKey } from './platform.ts';

const PLATFORM_KEYS = Object.keys(PLATFORM_DEFS) as PlatformKey[];
const IG_PLATFORMS = PLATFORM_KEYS.filter(key => key !== 'appbuilder');

const LEGACY_NAV_CSS = 'https://www.infragistics.com/css/navigation.css';
const LEGACY_NAV_JS = 'https://www.infragistics.com/assets/modern/scripts/navigation.js';

describe('getPlatformHead', () => {
    it.each(PLATFORM_KEYS)('opens the head of %s with the platform meta tag', platform => {
        const head = getPlatformHead(platform);

        expect(Array.isArray(head)).toBe(true);
        expect(head[0]).toEqual({ tag: 'meta', attrs: { property: 'docs:platform', content: platform } });
    });

    it.each(IG_PLATFORMS)('leaves the legacy navigation assets out of an English %s build', platform => {
        const head = getPlatformHead(platform);
        const hrefs = head.map(entry => entry.attrs?.['href']);
        const srcs = head.map(entry => entry.attrs?.['src']);

        expect(hrefs).not.toContain(LEGACY_NAV_CSS);
        expect(srcs).not.toContain(LEGACY_NAV_JS);
    });

    it.each(IG_PLATFORMS)('adds the legacy navigation assets to a Japanese %s build', platform => {
        const head = getPlatformHead(platform, 'jp');
        const hrefs = head.map(entry => entry.attrs?.['href']);
        const srcs = head.map(entry => entry.attrs?.['src']);

        expect(hrefs).toContain(LEGACY_NAV_CSS);
        expect(srcs).toContain(LEGACY_NAV_JS);
    });

    it('includes the AppBuilder mega-menu assets instead for appbuilder', () => {
        const head = getPlatformHead('appbuilder');
        const hrefs = head.map(entry => entry.attrs?.['href']);
        const srcs = head.map(entry => entry.attrs?.['src']);

        expect(hrefs).toContain('https://staging.appbuilder.dev/wp-includes/css/dashicons.min.css');
        expect(srcs).toContain('https://staging.appbuilder.dev/wp-content/plugins/megamenu/js/maxmegamenu.js?ver=3.3.1');
        expect(hrefs).not.toContain(LEGACY_NAV_CSS);
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

    it('keeps the AppBuilder head locale-independent', () => {
        expect(getPlatformHead('appbuilder', 'jp')).toEqual(getPlatformHead('appbuilder', 'en'));
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

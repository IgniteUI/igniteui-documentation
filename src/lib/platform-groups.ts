/**
 * platform-groups.ts
 *
 * Platform group aliases and the shared emission predicate used by every place
 * that decides whether a piece of content is emitted for the platform being built:
 *
 *   - `buildFilteredToc()`      — docs/xplat/astro.config.ts   (navigation)
 *   - `inlinePlatformBlocks()`  — docs/xplat/astro.config.ts   (in-page content)
 *   - `generate.mjs`            — docs/xplat/scripts/          (generated output)
 *   - the link checkers         — scripts/check-*.mjs
 *
 * All of them must agree. A divergence means the sidebar advertises a page the
 * build did not emit, or the checkers validate a different set of files than
 * ships. Import from here rather than re-implementing the rules.
 *
 * ---------------------------------------------------------------------------
 * Model
 * ---------------------------------------------------------------------------
 * `exclude` is a blacklist, `include` is an allowlist, and both accept group
 * aliases as well as platform names. `include` is evaluated first and wins:
 *
 *   (no fields)                     → emitted everywhere
 *   exclude: ["Angular"]            → everywhere except Angular
 *   exclude: ["NonWeb"]             → everywhere except WinUI and Uno
 *   include: ["Web"]                → only Angular, React, WebComponents, Blazor
 *   include: ["NonWeb"]             → only WinUI and Uno
 *   include: ["Web"], exclude: ["Angular"]
 *                                   → React, WebComponents, Blazor
 *
 * Prefer `include: ["Web"]` over `exclude: ["NonWeb"]` for content that is
 * web-only by nature. An allowlist stays correct when a platform is added; a
 * blacklist has to be revisited every time. Mobile platforms join `NonWeb`.
 */

/**
 * The authoritative list of platforms. Groups are views over this list, so a
 * new platform is added here first and then to whichever groups describe it.
 */
export const PLATFORMS = [
    'Angular',
    'React',
    'WebComponents',
    'Blazor',
    'WinUI',
    'Uno',
] as const;

export type PlatformName = (typeof PLATFORMS)[number];

/**
 * Group aliases usable anywhere a platform name is accepted.
 *
 * **Groups overlap by design, and membership is expected to drift.** A platform
 * belongs to as many groups as describe it; `resolvePlatformList` unions them.
 * Do not treat any two groups as interchangeable just because their membership
 * coincides today — see the `NonWeb` / `Xaml` note below.
 *
 * Groups likely to be added as the platform set grows:
 *
 * | Group | Would contain | Notes |
 * |---|---|---|
 * | `Mobile` | MAUI, Flutter, .NET iOS, … | subset of `NonWeb` |
 * | `DotNet` | Blazor, WinUI, Uno, MAUI, .NET iOS | **cuts across** `Web`/`NonWeb` — the natural gate for `cs` snippets |
 * | `Native` | everything not `Web` | may end up a synonym for `NonWeb`; keep separate if the distinction is meaningful |
 *
 * Adding a platform (MAUI, say) is: append to `PLATFORMS`, then add to
 * `NonWeb`, `Xaml` (it is XAML-based) and `DotNet`. Nothing else changes —
 * every consumer reads these rules rather than hard-coding platform lists.
 *
 * Keep group names distinct from platform names — `resolvePlatformList` treats
 * any unrecognised entry as a literal platform name, so a collision would
 * silently shadow the platform. `assertGroupsValid()` enforces both that and
 * that every member is a real platform.
 */
export const PLATFORM_GROUPS: Record<string, readonly string[]> = {
    /** Browser-hosted platforms. */
    Web: ['Angular', 'React', 'WebComponents', 'Blazor'],
    /**
     * Natively-hosted platforms — the complement of `Web`. Expected future
     * members include WPF, MAUI, Flutter and .NET iOS. Adding a non-XAML one
     * makes this group stop matching `Xaml`.
     */
    NonWeb: ['WinUI', 'Uno'],
    /**
     * Platforms using XAML markup. **WPF is an intended future member**, which
     * is why XAML snippets carry a bare prefix and no `xmlns` declaration: the
     * declaration syntax differs by dialect (`using:` on WinUI/UWP and Uno,
     * `clr-namespace:…;assembly=…` on WPF) even though the element markup is
     * shared.
     *
     * `Xaml` and `NonWeb` have identical membership *today* but are not
     * synonyms and must not be collapsed into one another:
     *   - Flutter and .NET iOS would be `NonWeb` but not `Xaml` (no XAML).
     *   - WPF and MAUI would be both — they are XAML-based.
     * Gate XAML markup and XAML-specific APIs on `Xaml`; gate "not a browser"
     * concerns on `NonWeb`.
     *
     * Note that a language like `cs` cuts across both axes — it is shared by
     * Blazor (Web) and every .NET native platform — so it must stay a generic
     * language rather than being mapped to a group. A separate orthogonal
     * group (e.g. `DotNet`) would be the way to express that if it is needed.
     */
    Xaml: ['WinUI', 'Uno'],
};

/**
 * Every known platform name. Derived from `PLATFORMS`, not from the groups —
 * a platform in no group (or only in a future group) must still be listed here.
 */
export const ALL_PLATFORMS: readonly string[] = PLATFORMS;

/** Every group a platform belongs to. Useful when debugging a filtering result. */
export function groupsFor(platform: string): string[] {
    return Object.entries(PLATFORM_GROUPS)
        .filter(([, members]) => members.includes(platform))
        .map(([name]) => name);
}

/**
 * Validates the group table: no group name may collide with a platform name,
 * and every member must be a real platform. Throws on violation.
 *
 * Called by the group-rule tests; cheap enough to call from a build step.
 */
export function assertGroupsValid(): void {
    const platforms = new Set<string>(PLATFORMS);
    for (const [name, members] of Object.entries(PLATFORM_GROUPS)) {
        if (platforms.has(name)) {
            throw new Error(
                `[platform-groups] group "${name}" collides with a platform name; ` +
                `the group would shadow the platform in every include/exclude list.`,
            );
        }
        for (const member of members) {
            if (!platforms.has(member)) {
                throw new Error(
                    `[platform-groups] group "${name}" lists unknown platform "${member}". ` +
                    `Add it to PLATFORMS first.`,
                );
            }
        }
    }
}

/**
 * Expands group aliases into platform names. Unrecognised entries pass through
 * unchanged so a plain platform name always works, and a typo stays visible in
 * the output rather than silently matching everything.
 */
export function resolvePlatformList(names: readonly string[] | undefined): string[] {
    if (!Array.isArray(names)) return [];
    const out = new Set<string>();
    for (const raw of names) {
        const name = typeof raw === 'string' ? raw.trim() : '';
        if (!name) continue;
        const group = PLATFORM_GROUPS[name];
        if (group) {
            for (const member of group) out.add(member);
        } else {
            out.add(name);
        }
    }
    return [...out];
}

/** A toc node or content block carrying platform visibility fields. */
export interface PlatformGated {
    include?: readonly string[];
    exclude?: readonly string[];
}

/**
 * Whether `platform` should receive this node.
 *
 * `include` is checked first: when present and non-empty, a platform outside it
 * is dropped regardless of `exclude`. `exclude` then removes platforms from
 * whatever remains.
 */
export function emitsFor(platform: string, node: PlatformGated | undefined): boolean {
    if (!node) return true;

    const include = resolvePlatformList(node.include);
    if (include.length > 0 && !include.includes(platform)) return false;

    const exclude = resolvePlatformList(node.exclude);
    if (exclude.includes(platform)) return false;

    return true;
}

/**
 * Whether a `<PlatformBlock for="...">` value matches `platform`.
 * `for` is a comma-separated list of platform names and/or group aliases.
 */
export function forMatches(platform: string, forValue: string): boolean {
    return resolvePlatformList(forValue.split(',')).includes(platform);
}

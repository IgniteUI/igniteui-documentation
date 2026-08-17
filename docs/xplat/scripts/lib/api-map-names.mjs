/**
 * api-map-names.mjs
 *
 * Resolves platform-specific API names to their canonical (XAML) form using the
 * product-generated apiMap JSON from igniteui-xplat-docs.
 *
 * Precedence — an apiMap direct hit is authoritative; otherwise the existing
 * fuzzy convention applies:
 *
 *   1. apiMap direct hit   `dataSource` → `ItemsSource`   (a genuine rename)
 *   2. fuzzy fallback      `headerClickAction` → `HeaderClickAction`  (PascalCase)
 *
 * This is deliberately additive: names the map does not cover keep resolving the
 * way they do today. See dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/notes/WINUI-UNO-PLAN.md §6.4.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Locates the apiMap directory.
 *
 * The vendored copy under `src/data/api-map/` is the primary source: the
 * originating repo (igniteui-xplat-docs) is archived, so the maps live here now.
 * The sibling-clone and env-var paths remain as an escape hatch for regenerating
 * or diffing against the original.
 */
export function resolveApiMapRoot(explicit = null, repoRoot = process.cwd()) {
    const candidates = [
        explicit,
        path.join(repoRoot, 'src', 'data', 'api-map'),
        process.env.XPLAT_DOCS_ROOT ? path.join(process.env.XPLAT_DOCS_ROOT, 'apiMap') : null,
        path.resolve(repoRoot, '..', 'igniteui-xplat-docs', 'apiMap'),
    ].filter(Boolean);
    return candidates.find(c => existsSync(c)) ?? null;
}

/**
 * Builds lookup tables from the apiMap files.
 *
 * Reverse (platform name → canonical), which is what the authoring tools read:
 *   memberToCanonical: Map<lowercased platform member name, Map<canonical, count>>
 *   typeToCanonical:   Map<lowercased platform type name, Map<canonical, count>>
 *   memberByType:      Map<`${canonicalType}::${lowercased member}`, canonical member>
 *
 * Forward (canonical → the name one platform uses), which is what the build reads to
 * turn a canonical term in prose into the name the reader's platform has:
 *   typeForward:    Map<lowercased canonical type, Map<platform, mappedName>>
 *   memberForward:  Map<`${lowercased canonical type}::${lowercased member}`, Map<platform, mappedName>>
 *   memberAnywhere: Map<lowercased canonical member, Map<platform, Map<mappedName, count>>>
 *
 * Counts are retained so an ambiguous name can be reported rather than guessed.
 */
export function loadApiMap(apiMapRoot) {
    const memberToCanonical = new Map();
    const typeToCanonical = new Map();
    const memberByType = new Map();

    const typeForward = new Map();
    const memberForward = new Map();
    const memberAnywhere = new Map();
    /** canonical type -> its canonical base type, so a scoped lookup can walk up. */
    const baseOf = new Map();

    const add = (map, key, value) => {
        const k = key.toLowerCase();
        if (!map.has(k)) map.set(k, new Map());
        const inner = map.get(k);
        inner.set(value, (inner.get(value) ?? 0) + 1);
    };

    /**
     * One canonical name's spelling on one platform, with every spelling kept and counted.
     *
     * Keyed with the canonical casing exactly, unlike the reverse tables. Canonical names are
     * PascalCase, and a case-insensitive forward lookup matches things that are not API names at all:
     * `prefix` and `suffix` are slot names in prose and would resolve to the Prefix and Suffix types,
     * `label` to XamLabel, `color` to Color. Requiring the case makes a hit mean the author wrote the
     * canonical name, which is the whole premise.
     *
     * Every spelling is kept rather than the first, because one canonical name can belong to two
     * different types in different assemblies: `Grid` is the xplat data grid in Grid.JS (`IgrDataGrid`)
     * and the web-only grid in WebGrids.JS (`IgrGrid`). Taking whichever file was read first would
     * silently pick one.
     */
    const addForward = (map, key, platform, mappedName) => {
        if (!map.has(key)) map.set(key, new Map());
        const byPlatform = map.get(key);
        if (!byPlatform.has(platform)) byPlatform.set(platform, new Map());
        const spellings = byPlatform.get(platform);
        spellings.set(mappedName, (spellings.get(mappedName) ?? 0) + 1);
    };

    for (const platformDir of readdirSync(apiMapRoot)) {
        const dir = path.join(apiMapRoot, platformDir);
        let files;
        try {
            // Overrides last, so what they add sits on top of the generated maps. They carry the same
            // schema, which is what lets one entry fix both directions at once: a member recorded
            // under its canonical name with a platform spelling gives the forward answer for that
            // platform and the reverse answer for the spelling, in one place.
            const all = readdirSync(dir);
            files = [
                ...all.filter(f => f.endsWith('.apiMap.json')),
                ...all.filter(f => f.endsWith('.apiMap.overrides.json')),
            ];
        } catch {
            continue;
        }
        for (const file of files) {
            let json;
            try {
                json = JSON.parse(readFileSync(path.join(dir, file), 'utf8'));
            } catch {
                continue;
            }
            for (const type of json.types ?? []) {
                const canonicalType = type.originalName;
                if (!canonicalType) continue;
                if (type.originalBaseTypeName && !baseOf.has(canonicalType)) {
                    baseOf.set(canonicalType, type.originalBaseTypeName);
                }
                for (const n of type.names ?? []) {
                    if (!n.mappedName) continue;
                    add(typeToCanonical, n.mappedName, canonicalType);
                    if (n.platform) addForward(typeForward, canonicalType, n.platform, n.mappedName);
                }
                for (const member of type.members ?? []) {
                    const canonicalMember = (member.originalName ?? '').replace(/\(\)$/, '');
                    if (!canonicalMember || canonicalMember === '.ctor') continue;
                    for (const n of member.names ?? []) {
                        if (!n.mappedName) continue;
                        add(memberToCanonical, n.mappedName, canonicalMember);
                        memberByType.set(
                            `${canonicalType}::${n.mappedName.toLowerCase()}`,
                            canonicalMember,
                        );
                        if (!n.platform) continue;
                        addForward(memberForward, `${canonicalType}::${canonicalMember}`, n.platform, n.mappedName);

                        // Unscoped, for a term whose owning type the topic never named. Kept with
                        // counts so an ambiguous member can be reported instead of guessed at, and
                        // keyed with the canonical casing to match the forward tables.
                        if (!memberAnywhere.has(canonicalMember)) memberAnywhere.set(canonicalMember, new Map());
                        const byPlatform = memberAnywhere.get(canonicalMember);
                        if (!byPlatform.has(n.platform)) byPlatform.set(n.platform, new Map());
                        const spellings = byPlatform.get(n.platform);
                        spellings.set(n.mappedName, (spellings.get(n.mappedName) ?? 0) + 1);
                    }
                }
            }
        }
    }
    return { memberToCanonical, typeToCanonical, memberByType, typeForward, memberForward, memberAnywhere, baseOf };
}

/**
 * Narrows a candidate set by dropping the description mirrors.
 *
 * Every widget has a matching `<Name>Description` type carrying its metadata, so a term that reaches
 * both is not really ambiguous -- the component is what a topic means, and the description is the
 * bookkeeping behind it. Only applied when a non-description candidate survives, so a term that only
 * ever names a description still resolves to it.
 */
function preferComponentsOverDescriptions(candidates) {
    const components = candidates.filter(one => !one.endsWith('Description'));
    return components.length > 0 ? components : candidates;
}

/**
 * The affixes the platforms put on a type name.
 *
 * Used to work back from a name a topic actually wrote to the canonical one. The canonical vocabulary
 * is not self-consistent — the grid is `Grid` but the chart is `XamDataChart` and the gauge
 * `XamRadialGauge` — so a topic that writes the reasonable `DataChart` is not wrong so much as using
 * one of the several names the thing has. Trying the affixes finds it without a table of exceptions.
 */
const TYPE_PREFIXES = ['', 'Xam', 'Igc', 'Igr', 'Igb', 'Igx'];
const TYPE_SUFFIXES = ['', 'Component', 'Description'];

/** Every spelling a written term might be, canonical or platform-flavoured. */
function typeCandidates(term) {
    const seen = new Set();
    for (const prefix of TYPE_PREFIXES) {
        for (const suffix of TYPE_SUFFIXES) {
            seen.add(prefix + term + suffix);
        }
    }
    seen.delete(term);          // tried on its own first, by both routes
    return [term, ...seen];
}

/**
 * The canonical type a written term refers to.
 *
 * Canonical is what a topic should write, and an exact canonical hit is taken first. Failing that the
 * term is treated as a name some platform uses and reversed — directly, and with each platform's
 * affixes tried, so `DataChart` finds `XamDataChart` and `IgcDataGridComponent` finds `Grid`.
 *
 * Only when the answer is unambiguous. `Grid` names two different types in two assemblies, so a term
 * that reaches more than one canonical is reported rather than guessed at.
 *
 * @returns {{ canonical: string|null, via?: 'canonical'|'alias', ambiguous?: string[] }}
 */
export function canonicalTypeFor(apiMap, term, platform = null) {
    if (apiMap.typeForward.has(term)) return { canonical: term, via: 'canonical' };

    const found = new Set();
    for (const candidate of typeCandidates(term)) {
        if (apiMap.typeForward.has(candidate)) found.add(candidate);
        for (const canonical of apiMap.typeToCanonical.get(candidate.toLowerCase())?.keys() ?? []) {
            found.add(canonical);
        }
    }

    const narrowed = preferComponentsOverDescriptions([...found]);
    if (narrowed.length === 1) return { canonical: narrowed[0], via: 'alias' };

    if (narrowed.length > 1) {
        const found = new Set(narrowed);
        // Narrowed to the ones this platform actually has. `DataGrid` reaches both `Grid` and
        // `DataGridDescription`, and only `Grid` exists on WinUI, so the answer is not in doubt even
        // though two canonicals carry the name. A term still ambiguous after this is genuinely
        // ambiguous, and the author settles it by writing the canonical, which is checked first.
        const onPlatform = platform
            ? [...found].filter(one => apiMap.typeForward.get(one)?.has(platform))
            : [];

        if (onPlatform.length === 1) return { canonical: onPlatform[0], via: 'alias' };
        return { canonical: null, ambiguous: [...found].sort() };
    }

    return { canonical: null };
}

/**
 * The canonical member a written term refers to, by the same precedence as types.
 *
 * @returns {{ canonical: string, via: 'canonical'|'alias' }|{ canonical: null, ambiguous?: string[] }}
 */
export function canonicalMemberFor(apiMap, term, canonicalType = null, scopedOnly = false) {
    if (canonicalType && apiMap.memberForward.has(`${canonicalType}::${term}`)) {
        return { canonical: term, via: 'canonical' };
    }

    if (canonicalType) {
        // Up the base chain: a topic names the component it is about, and the property is commonly
        // declared on a base -- markerTypes is on XYChart, not on the CategoryChart a page mentions.
        // The original docfx-era tool did the same, and without it a scoped lookup misses most
        // inherited members and the term loses its type attribution.
        for (let owner = canonicalType, hops = 0; owner && hops < 12; owner = apiMap.baseOf.get(owner), hops++) {
            if (apiMap.memberForward.has(`${owner}::${term}`)) return { canonical: term, via: 'canonical', owner };
            const inherited = apiMap.memberByType.get(`${owner}::${term.toLowerCase()}`);
            if (usableCanonical(inherited)) return { canonical: inherited, via: 'alias', owner };
        }
        // Asked about one type specifically, so an answer from some other type is not an answer. The
        // caller walks the page's mentionedTypes in turn, and without this the first type listed
        // claims every member the maps know anywhere -- a chart property attributed to a workbook.
        if (scopedOnly) return { canonical: null };
    }

    if (apiMap.memberAnywhere.has(term)) return { canonical: term, via: 'canonical' };

    // A dotted canonical is a path into a nested object, not a member name -- the same rule
    // resolveMemberName applies. `strokeThickness` reaches StrokeThickness and also six
    // `<something>Style.strokeThickness` paths, and only the first is a name.
    //
    // The bare term first, then with an "on" event-handler prefix stripped: a topic that wrote the
    // React-style `onCellValueChanging` means the CellValueChanging event, and the prefix belongs to
    // one platform's binding convention rather than to the name.
    const spellings = [term];
    const unprefixed = /^on[A-Z]/.test(term) ? term.slice(2) : null;
    if (unprefixed) spellings.push(unprefixed);

    const aliased = spellings
        .flatMap(one => [...(apiMap.memberToCanonical.get(one.toLowerCase())?.keys() ?? [])])
        .filter(usableCanonical)
        .filter((one, i, all) => all.indexOf(one) === i);

    const narrowedMembers = preferComponentsOverDescriptions(aliased);
    if (narrowedMembers.length === 1) return { canonical: narrowedMembers[0], via: 'alias' };

    if (narrowedMembers.length > 1) {
        const aliased = narrowedMembers;
        // A term that *is* one of the candidates bar casing means that candidate, not the composite
        // property it was flattened out of: `groupTextFontFamily` is GroupTextFontFamily, even though
        // the web platforms also flatten GroupTextStyle into that name.
        const exact = aliased.filter(one => one.toLowerCase() === term.toLowerCase());
        if (exact.length === 1) return { canonical: exact[0], via: 'alias' };
        return { canonical: null, ambiguous: aliased };
    }

    return { canonical: null };
}

/** A canonical name, as opposed to a path into a nested object. */
const usableCanonical = name => typeof name === 'string' && name.length > 0 && !name.includes('.');

/**
 * The name `platform` uses for a canonical type, and whether the maps know the type at all.
 *
 * The two are separate answers because they mean different things to a caller. A type no map
 * mentions is an authoring mistake — a term that resolves nowhere. A type the maps know but that
 * has no entry for this platform is normal: not every assembly is generated for every platform,
 * and the canonical name is then the right thing to print.
 *
 * @returns {{ known: boolean, name: string|null }} `name` is null when only `known` is true.
 */
export function forwardTypeName(apiMap, canonicalType, platform) {
    const byPlatform = apiMap.typeForward.get(canonicalType);
    if (!byPlatform) return { known: false, name: null };

    return { known: true, ...rankSpellings(byPlatform.get(platform)) };
}

/**
 * The name `platform` uses for a canonical member, scoped to a type when one is known.
 *
 * @returns {{ known: boolean, name: string|null, ambiguous?: string[] }}
 */
export function forwardMemberName(apiMap, canonicalMember, platform, canonicalType = null) {
    const byPlatform = canonicalType
        ? apiMap.memberForward.get(`${canonicalType}::${canonicalMember}`) ?? apiMap.memberAnywhere.get(canonicalMember)
        : apiMap.memberAnywhere.get(canonicalMember);

    if (!byPlatform) return { known: false, name: null };
    return { known: true, ...rankSpellings(byPlatform.get(platform)) };
}

/** The best-attested spelling for a platform, and the rest if there is more than one. */
function rankSpellings(spellings) {
    if (!spellings || spellings.size === 0) return { name: null };
    const ranked = [...spellings.entries()].sort((a, b) => b[1] - a[1]);
    return { name: ranked[0][0], ...(ranked.length > 1 ? { ambiguous: ranked.map(([n]) => n) } : {}) };
}

/** `headerClickAction` → `HeaderClickAction`; `header-click-action` → `HeaderClickAction`. */
export function fuzzyToPascal(name) {
    return name
        .replace(/[-_](\w)/g, (_m, c) => c.toUpperCase())
        .replace(/^(\w)/, (_m, c) => c.toUpperCase());
}

/**
 * Resolves a platform-specific member name to its canonical XAML name.
 *
 * @returns {{ name: string, via: 'apimap'|'apimap-type'|'fuzzy', ambiguous?: string[] }}
 */
export function resolveMemberName(apiMap, memberName, canonicalType = null) {
    // A dotted canonical is a *path* into a nested object, not a property name.
    // The web platforms flatten those (`shapeStyle.strokeThickness` surfaces as
    // `shapeStrokeThickness`), and XAML keeps the flattened property too, so the
    // fuzzy form is the accurate one. Treat dotted hits as no-hit.
    const usable = n => typeof n === 'string' && n.length > 0 && !n.includes('.');

    if (canonicalType) {
        const scoped = apiMap.memberByType.get(`${canonicalType}::${memberName.toLowerCase()}`);
        if (usable(scoped)) return { name: scoped, via: 'apimap-type' };
        if (scoped) return { name: fuzzyToPascal(memberName), via: 'fuzzy-nested' };
    }
    const all = apiMap.memberToCanonical.get(memberName.toLowerCase());
    const hits = all && new Map([...all].filter(([n]) => usable(n)));
    if (hits && hits.size) {
        // Most frequently attested canonical wins; report the rest as ambiguous.
        const ranked = [...hits.entries()].sort((a, b) => b[1] - a[1]);
        const [best] = ranked[0];
        return {
            name: best,
            via: 'apimap',
            ...(ranked.length > 1 ? { ambiguous: ranked.map(([n]) => n) } : {}),
        };
    }
    return { name: fuzzyToPascal(memberName), via: 'fuzzy' };
}

/** Resolves a platform-specific type name (e.g. `IgrDataGrid`) to its canonical form. */
export function resolveTypeName(apiMap, typeName) {
    const hits = apiMap.typeToCanonical.get(typeName.toLowerCase());
    if (hits && hits.size) {
        const ranked = [...hits.entries()].sort((a, b) => b[1] - a[1]);
        return { name: ranked[0][0], via: 'apimap', ...(ranked.length > 1 ? { ambiguous: ranked.map(([n]) => n) } : {}) };
    }
    return { name: typeName.replace(/^(Igr|Igc|Igb|Igx)/, ''), via: 'fuzzy' };
}

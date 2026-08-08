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
 * way they do today. See WINUI-UNO-PLAN.md §6.4.
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
 * Returns:
 *   memberToCanonical: Map<lowercased platform member name, Map<canonical, count>>
 *   typeToCanonical:   Map<lowercased platform type name, Map<canonical, count>>
 *   memberByType:      Map<`${canonicalType}::${lowercased member}`, canonical member>
 *
 * Counts are retained so an ambiguous name can be reported rather than guessed.
 */
export function loadApiMap(apiMapRoot) {
    const memberToCanonical = new Map();
    const typeToCanonical = new Map();
    const memberByType = new Map();

    const add = (map, key, value) => {
        const k = key.toLowerCase();
        if (!map.has(k)) map.set(k, new Map());
        const inner = map.get(k);
        inner.set(value, (inner.get(value) ?? 0) + 1);
    };

    for (const platformDir of readdirSync(apiMapRoot)) {
        const dir = path.join(apiMapRoot, platformDir);
        let files;
        try {
            files = readdirSync(dir).filter(f => f.endsWith('.apiMap.json'));
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
                for (const n of type.names ?? []) {
                    if (n.mappedName) add(typeToCanonical, n.mappedName, canonicalType);
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
                    }
                }
            }
        }
    }
    return { memberToCanonical, typeToCanonical, memberByType };
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

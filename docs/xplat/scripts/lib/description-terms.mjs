/**
 * description-terms.mjs
 *
 * Resolves the backticked API terms of a `platformType: xplat` page for one platform, from the
 * product's own description metadata (TypeDescriptionContext) and the published api-docs indexes.
 *
 * The description metadata is what says what a term *is* and what each platform calls it: a type, a
 * property and its per-platform names ("(w:LabelSettings.Visibility,p:LabelVisibility)"), an event, an
 * enum and its values. The index is what says the name really exists on the platform, and how that
 * platform spells it. Nothing is guessed: a term neither can answer is an error, reported with the
 * page, and the build fails -- the fix is in the page or in the metadata, never around it.
 *
 * Term forms an author can write:
 *
 *   `Type`                 a description type or an enum, by its description name (DataChart)
 *   `Member`               a member of a type in context: the nearest type named before it on the
 *                          page, then the page's mentionedTypes
 *   `Type.Member`          the same, owner stated; the label keeps the qualifier
 *   `m:Name`, `m:T.Name`   a method -- the descriptions do not describe methods, so the term says what
 *                          it is and the index confirms it; camelCased on the camelCasing platforms
 *   `EventScript`          Blazor's synchronous variant of an event; the suffix is dropped elsewhere
 *   `A/B/C`                a group that some platforms collapse into one member: the parts resolve
 *                          separately, and where they name one member (GroupRowMargin.Left, .Top, ...)
 *                          a single link is emitted
 *   `\anything`            not an API term; the backslash is removed and nothing is resolved
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { loadSnippetApi } from './snippet-toolchain.mjs';

/** The platforms that camelCase a member name; the rest use it as the description declares it. */
const CAMELCASING = new Set(['Angular', 'React', 'WebComponents']);

/** How each platform names a class, which is what the index is keyed by. */
const AFFIXES = {
    WebComponents: { prefix: 'Igc', suffix: 'Component' },
    Angular: { prefix: 'Igx', suffix: 'Component' },
    React: { prefix: 'Igr', suffix: '' },
    Blazor: { prefix: 'Igb', suffix: '' },
    WinUI: { prefix: 'Xam', suffix: '' },
    Uno: { prefix: 'Xam', suffix: '' },
};

const INDEX_SLUG = { WebComponents: 'webcomponents', Angular: 'angular', React: 'react', Blazor: 'blazor', WinUI: 'winui', Uno: 'uno' };

const ESCAPE = /^\\+/;
const METHOD = 'm:';
const SCRIPT = 'Script';
const NAME = /^[A-Za-z][A-Za-z0-9]*$/;
const QUALIFIED = /^([A-Za-z][A-Za-z0-9]*)\.([A-Za-z][A-Za-z0-9]*)$/;

const camel = s => s.charAt(0).toLowerCase() + s.slice(1);
const pascal = s => s.charAt(0).toUpperCase() + s.slice(1);

// --- the description metadata, asked once per process -----------------------------------------------

let descriptions = null;
function describe() {
    if (descriptions !== null) return descriptions;
    const api = loadSnippetApi();
    const types = new Set(api.descriptionTypeNames());
    const props = new Map();
    const propsOf = t => {
        if (!props.has(t)) props.set(t, (api.descriptionProperties(t) ?? []).filter(p => !p.includes('@') && !p.startsWith('__')));
        return props.get(t);
    };
    // Enums, from where the metadata uses them: an ExportedType property with @names. There is no
    // list of enums of their own, so every usage site is read and the values merged.
    let enums = null;
    const enumsOf = () => {
        if (enums !== null) return enums;
        enums = new Map();
        for (const t of types) {
            for (const p of propsOf(t)) {
                const info = api.descriptionPropertyInfo(t, p);
                if (!info || info.knownType !== 'ExportedType' || !info.enumNames || !info.specificType) continue;
                if (!enums.has(info.specificType)) enums.set(info.specificType, new Set());
                for (const v of info.enumNames) enums.get(info.specificType).add(v);
            }
        }
        return enums;
    };
    descriptions = { api, types, propsOf, enumsOf, info: (t, p) => api.descriptionPropertyInfo(t, p) };
    return descriptions;
}

// --- the api-docs indexes ------------------------------------------------------------------------------

const indexes = new Map();
function indexFor(platform, repoRoot) {
    if (indexes.has(platform)) return indexes.get(platform);
    const slug = INDEX_SLUG[platform];
    // The same file ApiLink reads, so a term that passes here is one the page can link; a platform with
    // no file of that name yet (WinUI and Uno have only staging) is checked against staging.
    const wanted = process.env.API_LINK_INDEX_VERSION
        ?? ((process.env.DOCS_ENV ?? process.env.NODE_ENV) === 'production' ? 'prod-latest' : 'staging-latest');
    const dir = path.join(repoRoot, 'src', 'data', 'api-link-index', slug ?? '');
    const file = [wanted, 'staging-latest'].map(n => path.join(dir, `${n}.json`)).find(existsSync);
    const symbols = file ? JSON.parse(readFileSync(file, 'utf8')).symbols : null;
    indexes.set(platform, symbols);
    return symbols;
}

/**
 * The platform's class for a description type or enum: which index symbol it is, and the ApiLink
 * attributes that reach it. The index decides -- an enum and a plain object carry no prefix or suffix
 * on any platform, a component carries both where the platform has them.
 */
function platformType(name, platform, repoRoot) {
    const symbols = indexFor(platform, repoRoot);
    if (!symbols) return null;
    const { prefix, suffix } = AFFIXES[platform];
    const candidates = [
        { symbol: prefix + name + suffix, prefixed: true, suffix: suffix !== '' },
        { symbol: prefix + name, prefixed: true, suffix: false },
        { symbol: name + suffix, prefixed: false, suffix: suffix !== '' },
        { symbol: name, prefixed: false, suffix: false },
    ];
    const hit = candidates.find(c => symbols[c.symbol]);
    return hit ? { ...hit, entries: symbols[hit.symbol] } : null;
}

/**
 * An enum as a platform's index records it, for the enums no described property uses (the financial
 * series' DataLegendSeriesValueType, say). Its values are the index's; where the index lists an enum
 * with no values at all -- WinUI's and Uno's do -- the values other platforms' indexes record for the
 * same enum stand in, so a value is still checked rather than assumed.
 */
function indexEnum(name, platform, repoRoot) {
    const own = platformType(name, platform, repoRoot);
    if (!own || !own.entries.some(e => e.k === 'enum')) return null;
    const values = new Set(own.entries.flatMap(e => Object.keys(e.m ?? {})));
    if (values.size === 0) {
        for (const other of Object.keys(AFFIXES)) {
            if (other === platform) continue;
            const t = platformType(name, other, repoRoot);
            if (t && t.entries.some(e => e.k === 'enum')) for (const e of t.entries) for (const v of Object.keys(e.m ?? {})) values.add(v);
        }
    }
    return { type: own, values };
}

// Some index entries list only what a class declares -- every WinUI and Uno class, and a few web ones --
// so an inherited member is looked for up the class hierarchy. Nothing in the index records the hierarchy; until it does, the api maps' base
// types answer. Web and Blazor indexes list inherited members on the class itself.
let bases = null;
function baseChain(canonical, repoRoot) {
    if (bases === null) {
        bases = new Map();
        const root = path.join(repoRoot, 'src', 'data', 'api-map');
        if (existsSync(root)) {
            for (const dir of readdirSafe(root)) {
                for (const file of readdirSafe(path.join(root, dir)).filter(f => f.endsWith('.json'))) {
                    let json; try { json = JSON.parse(readFileSync(path.join(root, dir, file), 'utf8')); } catch { continue; }
                    for (const t of json.types ?? []) if (t.originalName && t.originalBaseTypeName && !bases.has(t.originalName)) bases.set(t.originalName, t.originalBaseTypeName);
                }
            }
        }
    }
    const out = [], seen = new Set();
    for (let t = canonical; t && !seen.has(t); t = bases.get(t)) { seen.add(t); out.push(t); }
    return out;
}
function readdirSafe(dir) { try { return readdirSync(dir); } catch { return []; } }

/** The index's own spelling of a member on a type (or, where the index is declared-only, its bases). */
function indexMember(typeName, member, platform, repoRoot, { method = false } = {}) {
    const lc = member.toLowerCase();
    const look = entries => {
        for (const e of entries ?? []) {
            for (const [k, v] of Object.entries(e.m ?? {})) {
                if (k.toLowerCase() !== lc) continue;
                // WinUI and Uno write a method with its signature; elsewhere the entry cannot say.
                if (method && (platform === 'WinUI' || platform === 'Uno') && !String(v).includes('(')) continue;
                return k;
            }
        }
        return null;
    };
    const own = platformType(typeName, platform, repoRoot);
    if (!own) return null;
    const direct = look(own.entries);
    if (direct) return direct;
    // Not only WinUI and Uno: some web classes are listed declared-only too (IgcGeographicMapComponent
    // carries its own 52 members; windowRect is on IgcSeriesViewerComponent).
    const chain = new Set([own.symbol, typeName, 'Xam' + typeName].flatMap(t => baseChain(t, repoRoot).slice(1)));
    for (const base of chain) {
        const b = platformType(base.replace(/^Xam/, ''), platform, repoRoot) ?? platformType(base, platform, repoRoot);
        const found = b && look(b.entries);
        if (found) return found;
    }
    return null;
}

// --- one term ----------------------------------------------------------------------------------------

/**
 * A description property of `type` a written member name refers to: the name itself, or the name with
 * the Ref suffix the metadata gives data, method, template and event references. Both existing is a
 * question the author must settle, and says so.
 */
function describedProperty(d, type, written, platform) {
    const lc = written.toLowerCase();
    const props = d.propsOf(type);
    const bare = props.find(p => p.toLowerCase() === lc);
    const ref = props.find(p => p.toLowerCase() === lc + 'ref');
    // Both is common and harmless: DataSource (the typed value) and DataSourceRef (the reference) are
    // one member on every platform. It is a question only when the platform names them differently.
    if (bare && ref && propertyPlatformName(d, type, bare, platform, false) !== propertyPlatformName(d, type, ref, platform, false)) {
        return { error: `${type} has both ${bare} and ${ref}, which ${platform} names differently; write the one meant` };
    }
    return bare || ref ? { prop: bare ?? ref } : null;
}

/** What `platform` calls a description property, before the index is asked to confirm it. */
function propertyPlatformName(d, type, prop, platform, wantScript) {
    const info = d.info(type, prop);
    if (info?.knownType === 'EventRef') {
        const event = info.specificType ?? prop.replace(/Ref$/, '');
        const name = CAMELCASING.has(platform) ? camel(event) : pascal(event);
        return platform === 'Blazor' && wantScript ? name + SCRIPT : name;
    }
    const mapped = d.api.platformPropertyName(type, platform, prop) ?? prop;
    // A reference property's public name drops the Ref the metadata keys it by, unless the metadata
    // maps it to a name of its own (ItemsSource on the XAML platforms).
    if (/Ref$/.test(prop) && mapped.toLowerCase() === prop.toLowerCase()) return mapped.slice(0, -3);
    return mapped;
}

/**
 * Resolves one term for one platform.
 * @returns {{ html?: string, text?: string, error?: string }}
 */
function resolveOne(term, ctx) {
    const { d, platform, repoRoot, context } = ctx;
    const enums = () => d.enumsOf();
    const isType = t => d.types.has(t) || enums().has(t) || !!indexEnum(t, platform, repoRoot);

    // m:Name / m:Type.Name
    if (term.startsWith(METHOD)) {
        const rest = term.slice(METHOD.length);
        const q = QUALIFIED.exec(rest);
        const owners = q ? [q[1]] : context.filter(t => d.types.has(t));
        const leaf = q ? q[2] : rest;
        if (!NAME.test(leaf)) return { error: `\`${term}\`: not a method name` };
        const wanted = CAMELCASING.has(platform) ? camel(leaf) : pascal(leaf);
        for (const owner of owners) {
            const found = indexMember(owner, wanted, platform, repoRoot, { method: true });
            if (found) return { html: link(owner, found, platform, repoRoot, q ? `${owner}.${found}` : found) };
        }
        return { kind: 'index', error: `\`${term}\`: no ${platform} method ${wanted} on ${owners.join(', ') || '(no type in context)'}` };
    }

    // A group: each part resolved, then collapsed where the platform has one member for all of them.
    if (term.includes('/')) {
        const parts = term.split('/');
        const out = parts.map(p => resolveMember(p, ctx));
        const bad = out.find(o => o.error);
        if (bad) return bad;   // keeps the failing part's kind
        const names = out.map(o => o.name);
        // Parts that are neither one member nor all different are the metadata contradicting itself:
        // RadialGauge maps FontWeight to FontStyle on WinUI, so the group would name FontStyle twice.
        const distinct = new Set(names);
        if (distinct.size > 1 && distinct.size < names.length) {
            return { error: `\`${term}\`: on ${platform} the parts resolve to ${names.join(', ')} -- two parts name the same member, which the description metadata should not do` };
        }
        const parent = names[0].includes('.') ? names[0].slice(0, names[0].lastIndexOf('.')) : null;
        if (names.every(n => n === names[0])) return { html: out[0].html };
        if (parent && names.every(n => n.startsWith(parent + '.'))) {
            const found = indexMember(out[0].owner, parent, platform, repoRoot);
            if (!found) return { kind: 'index', error: `\`${term}\`: ${platform} collapses these to ${out[0].owner}.${parent}, which its index does not have` };
            return { html: link(out[0].owner, found, platform, repoRoot, found) };
        }
        return { html: out.map(o => o.html).join('/') };
    }

    // An exact description type or enum name is a type, before any member reading of it.
    if (NAME.test(term) && isType(term)) {
        const t = platformType(term, platform, repoRoot);
        if (!t) return { kind: 'index', error: `\`${term}\`: no ${platform} class for this type in the api index` };
        return { html: `<ApiLink type="${term}" prefixed={${t.prefixed}} suffix={${t.suffix}} />` };
    }

    const r = resolveMember(term, ctx);
    return r.error ? r : { html: r.html };   // r.kind travels with the error
}

/** A member term, bare or qualified, against the qualifier or the types in context. */
function resolveMember(term, ctx) {
    const { d, platform, repoRoot, context } = ctx;
    const q = QUALIFIED.exec(term);
    const qualifier = q && (d.types.has(q[1]) || d.enumsOf().has(q[1]) || indexEnum(q[1], platform, repoRoot)) ? q[1] : null;
    if (q && !qualifier) return { error: `\`${term}\`: ${q[1]} is not a description type or enum` };
    const written = qualifier ? q[2] : term;
    if (!NAME.test(written)) return { error: `\`${term}\`: not an API name` };
    const owners = qualifier ? [qualifier] : context;
    const wantScript = written.endsWith(SCRIPT) && written.length > SCRIPT.length;

    // An enum value two enums in context both have is a question for the author, not the first one's:
    // `None` on a page naming ModifierKeys and InteractionState could be either. Qualified, it is not.
    if (!qualifier) {
        const claimsValue = o => d.enumsOf().get(o)?.has(written) || indexEnum(o, platform, repoRoot)?.values.has(written);
        const nearbyClaim = owners.slice(0, owners.nearby ?? 0).find(claimsValue);
        const claims = nearbyClaim ? [nearbyClaim] : owners.filter(claimsValue);
        if (claims.length > 1) {
            return { error: `\`${term}\`: a value of ${claims.join(' and ')}, which the page both names; qualify it (\`${claims[0]}.${written}\`)` };
        }
    }

    const misses = [];
    let missName = null;
    const firstClaim = !qualifier ? owners.slice(0, owners.nearby ?? 0).find(o => d.enumsOf().get(o)?.has(written) || indexEnum(o, platform, repoRoot)?.values.has(written)) : null;
    const ordered = firstClaim ? [firstClaim, ...owners.filter(o => o !== firstClaim)] : owners;
    for (const owner of ordered) {
        // An enum value.
        const described = d.enumsOf().get(owner);
        const indexed = described?.has(written) ? null : indexEnum(owner, platform, repoRoot);
        const values = described?.has(written) ? described : indexed?.values;
        if (described || indexed) {
            if (!values || !values.has(written)) continue;
            const t = platformType(owner, platform, repoRoot);
            if (!t) return { kind: 'index', error: `\`${term}\`: no ${platform} class for enum ${owner} in the api index` };
            const label = qualifier ? `${owner}.${written}` : written;
            return { owner, name: written, html: `<ApiLink type="${owner}" prefixed={${t.prefixed}} suffix={${t.suffix}} member="${written}" label="${label}" />` };
        }
        if (!d.types.has(owner)) continue;
        let hit = describedProperty(d, owner, written, platform);
        let script = false;
        if (!hit && wantScript) { hit = describedProperty(d, owner, written.slice(0, -SCRIPT.length), platform); script = !!hit; }
        if (!hit) continue;
        if (hit.error) return { error: `\`${term}\`: ${hit.error}` };
        // Transforms that change which member a platform has, as the code generating renderer applies
        // them (CodeGenerationTransformer). TextStyleTransform, on the platforms whose metadata names it
        // (WPF, WinUI, Uno), expands one text style into the four font members, named by swapping
        // TextStyle for each part in the description name -- so the term becomes four links there. The
        // other direction, four font properties collapsing into one web member, needs nothing here: the
        // metadata gives the four the same web name and a group of them collapses to one link.
        const transform = d.api.descriptionPropertyTransform ? d.api.descriptionPropertyTransform(owner, platform, hit.prop) : null;
        if (transform === 'TextStyleTransform' && /TextStyle/.test(hit.prop)) {
            const parts = ['FontFamily', 'FontSize', 'FontWeight', 'FontStyle'].map(part => hit.prop.replace('TextStyle', part));
            const found = parts.map(part => indexMember(owner, part, platform, repoRoot));
            if (found.some(f => !f)) { misses.push(`${owner}.${parts.filter((_, i) => !found[i]).join('/')} (TextStyleTransform)`); continue; }
            return { owner, name: found.join('/'), html: found.map(f => link(owner, f, platform, repoRoot, qualifier ? `${owner}.${f}` : f)).join('/') };
        }
        // Blazor sits in no prefix group, so the metadata answers it with the description name. Its API
        // is generated from the TypeScript widget, though, so where the web collapses font properties
        // into one member Blazor may have that member instead (IgbCategoryChart.TitleTextStyle) -- or
        // both (IgbRadialGauge has Font and the TitleFont* members). Both names come from the metadata;
        // the index says which Blazor has, and the description name wins when it has both.
        const name = propertyPlatformName(d, owner, hit.prop, platform, script);
        const candidates = [name];
        if (platform === 'Blazor' && d.api.descriptionPropertyTransform) {
            const webTransform = d.api.descriptionPropertyTransform(owner, 'WebComponents', hit.prop);
            if (/^Font(Family|Size|Style|Weight)Transform$/.test(webTransform ?? '')) {
                candidates.push(pascal(d.api.platformPropertyName(owner, 'WebComponents', hit.prop)));
            }
        }
        // A name the platform keeps inside a sub-object (LabelSettings.Visibility) is checked by its
        // head, which is the member the class declares.
        let found = null, chosen = name;
        for (const c of candidates) { found = indexMember(owner, c.split('.')[0], platform, repoRoot); if (found) { chosen = c; break; } }
        if (!found) { misses.push(`${owner}.${candidates.join(' or ')}`); missName ??= candidates[0]; continue; }
        const shown = chosen.includes('.') ? found + chosen.slice(chosen.indexOf('.')) : found;
        return { owner, name: shown, html: link(owner, shown, platform, repoRoot, qualifier ? `${owner}.${shown}` : shown) };
    }
    if (misses.length) return { kind: 'index', fallback: missName, error: `\`${term}\`: described as ${misses.join(', ')}, which the ${platform} api index does not have` };
    return { error: `\`${term}\`: ${qualifier ? `not a member of ${qualifier}` : `no type in context has it (context: ${owners.join(', ') || 'none'})`}` };
}

function link(owner, member, platform, repoRoot, label) {
    const t = platformType(owner, platform, repoRoot);
    const attrs = t ? `type="${owner}" prefixed={${t.prefixed}} suffix={${t.suffix}}` : `type="${owner}"`;
    return `<ApiLink ${attrs} member="${member}" label="${label}" />`;
}

// --- a page ------------------------------------------------------------------------------------------

/** Spans no term is taken from: frontmatter, fences, JSX tags and MDX comments. */
function protectedRanges(content) {
    const ranges = [];
    for (const m of content.matchAll(/^---\n[\s\S]*?\n---/g)) ranges.push([m.index, m.index + m[0].length]);
    for (const m of content.matchAll(/^(```|````)[\s\S]*?^\1/gm)) ranges.push([m.index, m.index + m[0].length]);
    for (const m of content.matchAll(/<[A-Z][A-Za-z]*\b[^>]*>/g)) ranges.push([m.index, m.index + m[0].length]);
    for (const m of content.matchAll(/\{\/\*[\s\S]*?\*\/\}/g)) ranges.push([m.index, m.index + m[0].length]);
    return ranges;
}
const inside = (ranges, at) => ranges.some(([from, to]) => at >= from && at < to);

/** A term shape this resolver owns; anything else in backticks is ordinary code and left alone. */
const TERM = /^(?:m:)?[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)?(?:\/[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)?)*$/;
const looksLikeTerm = t => TERM.test(t) && (t.startsWith(METHOD) || /[A-Z]/.test(t));

function mentionedTypesOf(content) {
    const m = /^mentionedTypes:\s*\[([^\]]*)\]/m.exec(content);
    return m ? m[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean) : [];
}

/**
 * Every backticked term on a page, rewritten for one platform.
 *
 * @returns {{ content: string, errors: {term: string, line: number, message: string}[], usedApiLink: boolean }}
 */
export function resolveDescriptionTerms(content, platform, { repoRoot }) {
    if (!AFFIXES[platform]) throw new Error(`description terms: no platform ${platform}`);
    const d = describe();
    const ranges = protectedRanges(content);
    const declared = mentionedTypesOf(content);
    const isType = t => d.types.has(t) || d.enumsOf().has(t) || !!indexEnum(t, platform, repoRoot);

    // Types the page names, where it names them, so a member takes the nearest one before it.
    const named = [];
    for (const m of content.matchAll(/<ApiLink\b[^>]*?\btype="([^"]+)"[^>]*>/g)) named.push({ at: m.index, type: m[1] });
    for (const m of content.matchAll(/`([A-Za-z][A-Za-z0-9]*)(?:\.[A-Za-z][A-Za-z0-9]*)?`/g)) if (isType(m[1])) named.push({ at: m.index, type: m[1] });
    // A property whose value is an enum puts that enum in context where the page names it: a list of
    // options after "the `selectionMode` property ..." is SeriesSelectionMode's, which is how the prose
    // reads. The property is looked for on the page's own types, and its enum comes from the metadata.
    const describedDeclared = declared.filter(t => d.types.has(t));
    for (const m of content.matchAll(/`(?:([A-Za-z][A-Za-z0-9]*)\.)?([A-Za-z][A-Za-z0-9]*)`/g)) {
        const owners = m[1] && d.types.has(m[1]) ? [m[1]] : describedDeclared;
        for (const owner of owners) {
            const hit = describedProperty(d, owner, m[2], platform);
            const info = hit?.prop ? d.info(owner, hit.prop) : null;
            if (info?.knownType === 'ExportedType' && info.specificType && d.enumsOf().has(info.specificType)) {
                named.push({ at: m.index, type: info.specificType, fromProperty: true });
                break;
            }
        }
    }
    named.sort((a, b) => a.at - b.at);
    const contextAt = at => {
        const out = [];
        for (let i = named.length - 1; i >= 0; i--) if (named[i].at < at && isType(named[i].type) && !out.includes(named[i].type)) out.push(named[i].type);
        const nearby = out.length;
        for (const t of declared) if (isType(t) && !out.includes(t)) out.push(t);
        out.nearby = nearby;   // how many of these the page named before the term, nearest first
        return out;
    };

    const errors = [];
    let usedApiLink = false;
    const lineOf = at => content.slice(0, at).split('\n').length;
    const out = content.replace(/`([^`\n]+)`/g, (whole, term, at) => {
        if (inside(ranges, at)) return whole;
        if (ESCAPE.test(term)) return '`' + term.replace(ESCAPE, '') + '`';
        if (!looksLikeTerm(term)) return whole;
        const r = resolveOne(term, { d, platform, repoRoot, context: contextAt(at) });
        if (r.error) {
            errors.push({ term, line: lineOf(at), message: r.error, kind: r.kind ?? 'description' });
            // Unlinked either way; an index miss the description could name keeps the platform's
            // spelling (markerSize on the web), so an acknowledged gap still reads correctly.
            return r.fallback ? '`' + r.fallback + '`' : whole;
        }
        usedApiLink = true;
        return r.html;
    });
    return { content: out, errors, usedApiLink };
}

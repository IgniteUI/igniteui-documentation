/**
 * Backticked API terms, resolved to the name the platform being generated actually uses.
 *
 * A topic writes the canonical name in a code span — `ItemsSource` — and this turns it into an
 * ApiLink carrying that platform's spelling: ItemsSource on the XAML platforms, dataSource on Web
 * Components. The renderer has always done this for the code it emits, which is why a snippet says
 * ItemsSource while the sentence introducing it said DataSource; the same answer is now available to
 * prose.
 *
 * It replaces a transform that was materialised away. The docfx build fed every inline-code node
 * through API resolution; resolve-api-links.mjs later ran that logic once over the source and wrote
 * the result in as <ApiLink> tags, which froze one platform's spelling into a file that serves six.
 *
 * Three outcomes, which are not the same thing:
 *
 *   resolved   the maps have this term and a name for this platform  -> that name
 *   canonical  the maps have this term but nothing for this platform -> the canonical name, no error.
 *              Normal: not every assembly is generated for every platform, WPF especially.
 *   unknown    no map on any platform has this term                 -> an authoring error, reported
 *
 * A term that should not resolve at all — `true`, `.shp`, a Windows path — is escaped with a leading
 * backslash, which says so explicitly rather than relying on it happening to miss.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    resolveApiMapRoot,
    loadApiMap,
    canonicalTypeFor,
    canonicalMemberFor,
    forwardTypeName,
    forwardMemberName,
} from './api-map-names.mjs';

/** A term written `\like-this` is not an API name. The backslash is the author saying so. */
const ESCAPE = '\\';

let cachedApiMap = null;
let cachedPassthrough = null;

/**
 * The components no generator describes, by type name.
 *
 * Read once, and empty rather than fatal when absent: a repository without the file simply has no
 * pass-through components.
 */
export function passthroughTypes(repoRoot = undefined) {
    if (cachedPassthrough) return cachedPassthrough;
    const root = resolveApiMapRoot(null, repoRoot);
    cachedPassthrough = new Set();
    if (root) {
        try {
            const raw = JSON.parse(readFileSync(join(root, 'passthrough.json'), 'utf8'));
            for (const t of raw.types ?? []) cachedPassthrough.add(t);
        } catch { /* no file, no pass-through components */ }
    }
    return cachedPassthrough;
}

/** The maps, loaded once. */
export function apiMap(repoRoot = undefined) {
    if (cachedApiMap) return cachedApiMap;
    const root = resolveApiMapRoot(null, repoRoot);
    if (!root) throw new Error('No apiMap directory found; expected src/data/api-map');
    cachedApiMap = loadApiMap(root);
    return cachedApiMap;
}

/** The `apiTerms:` values a page may declare. */
export const API_TERM_MODES = ['full', 'none', 'passthrough'];

/**
 * How a page wants its code spans treated, from `apiTerms:` in the frontmatter.
 *
 *   full         every backticked term is resolved through the maps
 *   none         nothing is touched: the code span is preserved as authored, no ApiLink, no report
 *   passthrough  resolved by rule rather than by lookup -- the canonical name as written on the XAML
 *                platforms, camelCased on the ones that camelCase -- and still rendered as an
 *                ApiLink, with nothing reported as unknown
 *
 * **Required, with no default.** Which of the two a page wants is not derivable from the page: it
 * follows from whether the page ships outside the web, and that lives in the toc. Defaulting either
 * way makes the wrong answer the silent one — default `full` and a web-only page reports every
 * backticked shell command as an unresolved API name; default `none` and a cross-platform page
 * quietly stops resolving and nobody notices until a reader sees the wrong platform's spelling. So
 * the decision is stated per page and a page that has not stated it fails.
 *
 * `none` is for pages outside the cross-platform set. A page that only ever ships for the web has no
 * second spelling to resolve to, so resolution can only introduce noise.
 *
 * `passthrough` is for the parts of the product ApiGenerator does not build: the Excel library, and
 * components like DataChart that carry no widget markers for WPF and are exposed directly. Their
 * canonical C# surface *is* the public API, so there is no map and never will be by that route, and a
 * name is the same everywhere bar casing. Reporting those as unknown would be reporting that a
 * generator we do not run for them did not run.
 *
 * A page in `passthrough` still gets platform-correct casing, which is the part a reader notices.
 * What it gives up is the check: a typo on such a page resolves as happily as a real name.
 */
export function apiTermsMode(content, where = 'this page') {
    const match = /^apiTerms:\s*(\S+)/m.exec(content);
    if (!match) {
        throw new Error(
            `${where}: no apiTerms in the frontmatter. Add "apiTerms: full" for a page that ships ` +
            `outside the web, or "apiTerms: none" for one that does not.`);
    }

    const mode = match[1].replace(/^["']|["']$/g, '');
    if (!API_TERM_MODES.includes(mode)) {
        throw new Error(`${where}: apiTerms is "${mode}"; expected one of ${API_TERM_MODES.join(', ')}.`);
    }
    return mode;
}

/**
 * The types a page says it talks about, which scope what a bare member name can mean.
 *
 * The same frontmatter the docfx transform used, still authored on 266 of the topics and — until
 * now — read by nothing at build time.
 */
export function mentionedTypesOf(content) {
    const match = /^mentionedTypes:\s*\[([^\]]*)\]/m.exec(content);
    if (!match) return [];
    return match[1]
        .split(',')
        .map(one => one.trim().replace(/^["']|["']$/g, ''))
        .filter(one => one && !one.startsWith('{'));      // {ComponentApiMembers} is a token, not a type
}

/**
 * Where each type this page names appears, so a later member can be resolved against it.
 *
 * mentionedTypes was only ever a way of *supplying* this context, not the only source of it: naming a
 * type and then a property of it is how the prose reads, and the type is the context for what follows.
 * Types named as ApiLinks count too -- most pages carry those rather than a backticked type name.
 */
function typeContextPositions(content) {
    const found = [];
    for (const m of content.matchAll(/<ApiLink\b[^>]*?\btype="([^"]+)"[^>]*>/g)) {
        found.push({ at: m.index, type: m[1] });
    }
    for (const m of content.matchAll(/`([A-Za-z][A-Za-z0-9]*)`/g)) {
        found.push({ at: m.index, type: m[1] });
    }
    return found.sort((a, b) => a.at - b.at);
}

/** The types named before this point, nearest first. */
function contextAt(positions, at, known) {
    const out = [];
    for (let i = positions.length - 1; i >= 0; i--) {
        if (positions[i].at >= at) continue;
        const t = positions[i].type;
        if (known(t) && !out.includes(t)) out.push(t);
    }
    return out;
}

/** The spans a code term must not be found in: fenced blocks, frontmatter, and JSX attributes. */
function protectedRanges(content) {
    const ranges = [];
    for (const m of content.matchAll(/^---\n[\s\S]*?\n---/g)) ranges.push([m.index, m.index + m[0].length]);
    for (const m of content.matchAll(/^(```|````)[\s\S]*?^\1/gm)) ranges.push([m.index, m.index + m[0].length]);
    // A whole JSX tag, so a term inside an attribute value is left alone.
    for (const m of content.matchAll(/<[A-Z][A-Za-z]*\b[^>]*>/g)) ranges.push([m.index, m.index + m[0].length]);
    return ranges;
}

const inside = (ranges, at) => ranges.some(([from, to]) => at >= from && at < to);

/**
 * Only a bare identifier can be an API name. `.shp`, `2px` and prose in backticks cannot.
 *
 * An all-lowercase single word is excluded too. The reverse tables are case-insensitive, because they
 * have to resolve camelCase platform names like `dataSource`, and that makes ordinary words in code
 * spans collide with real types: `prefix` and `suffix` are slot names, `label`, `header`, `size`,
 * `icon` and `name` are prose. Every genuine API name either starts capitalised or carries an internal
 * capital, so requiring one costs nothing and removes the whole class.
 */
/**
 * `Type.Member` — a term that says which type it belongs to.
 *
 * The oldest form of all: a topic that qualifies a member needs no context from anywhere else, and
 * the resolver should not need mentionedTypes to answer it.
 */
const QUALIFIED = /^([A-Za-z][A-Za-z0-9]*)\.([A-Za-z][A-Za-z0-9]*)$/;

/**
 * Any dotted term. What the dot means is decided by resolution, not by spelling: if the head resolves
 * as a type the dot is type scoping, and otherwise the whole thing is tried as one name, which is how
 * a path into a sub-object is recorded -- `labelSettings.angle`. Casing cannot be the test, because a
 * fully qualified name is exactly what an author reaches for to disambiguate, and nothing guarantees
 * the two halves are cased differently.
 *
 * A dotted term the maps cannot answer is reported like any other, `index.ts` included. The escape is
 * how an author says a code span is not an API name, and guessing on their behalf would hide the one
 * decision this check exists to surface.
 */
const DOTTED = /^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)+$/;

const looksLikeIdentifier = term =>
    (/^[A-Za-z][A-Za-z0-9]*$/.test(term) && /[A-Z]/.test(term)) || DOTTED.test(term);

/**
 * Resolves one term, without deciding how to render it.
 *
 * @returns {{ kind: 'type'|'member'|'unknown', canonical: string, type?: string,
 *             name: string|null, ambiguous?: string[] }}
 *          `name` is null when the term is known but this platform has no entry — the caller
 *          prints the canonical name and does not complain.
 */
export function resolveTerm(map, term, platform, types = [], passthrough = new Set()) {
    // A dotted term. Try the head as a type first: if it is one, the dot is type scoping and the tail
    // is the member. If it is not, the dot is inside the name -- a path into a sub-object, which the
    // maps record whole.
    const qualified = QUALIFIED.exec(term);
    if (qualified) {
        const owner = canonicalTypeFor(map, qualified[1], platform);
        if (owner.canonical) {
            const asMember = canonicalMemberFor(map, qualified[2], owner.canonical, true);
            if (asMember.canonical) {
                const forward = forwardMemberName(map, asMember.canonical, platform, owner.canonical);
                const ownerName = forwardTypeName(map, owner.canonical, platform).name ?? owner.canonical;
                return {
                    kind: 'member', canonical: asMember.canonical, written: term, type: owner.canonical,
                    via: 'qualified', qualifiedBy: ownerName,
                    name: forward.name ?? asMember.canonical,
                };
            }
            // The head is a type, so this was meant as an API reference and the tail is wrong.
            return { kind: 'unknown', canonical: term, written: term, name: null };
        }
    }


    const asType = canonicalTypeFor(map, term, platform);
    if (asType.canonical) {
        const forward = forwardTypeName(map, asType.canonical, platform);
        return { kind: 'type', canonical: asType.canonical, written: term, via: asType.via, name: forward.name };
    }
    // Scoped first: the same member name can belong to several types, and the page said which.
    for (const written of types) {
        const owner = canonicalTypeFor(map, written, platform).canonical ?? written;
        const asMember = canonicalMemberFor(map, term, owner, true);
        if (!asMember.canonical) continue;
        const forward = forwardMemberName(map, asMember.canonical, platform, owner);
        return {
            kind: 'member', canonical: asMember.canonical, written: term, type: owner, via: asMember.via,
            name: forward.name, ...(forward.ambiguous ? { ambiguous: forward.ambiguous } : {}),
        };
    }

    if (asType.ambiguous) {
        // Reported only once the page's own context has had its say. A name can be both an enum and a
        // property -- TrendLineType is the enum and TrendLineType is the property on every chart that
        // has trendlines -- and the two spellings collide with an unrelated type from another product
        // area (Excel's TrendlineType) once case is folded. A page that named the chart it is about
        // has already answered which one is meant, so asking the author to disambiguate would be
        // asking for something they already said.
        //
        // Still reported when nothing in context claims it: the canonical spelling is checked before
        // any alias, so writing it settles the question outright.
        return { kind: 'ambiguous', canonical: term, written: term, name: null, ambiguous: asType.ambiguous };
    }

    const unscoped = canonicalMemberFor(map, term);
    if (unscoped.canonical) {
        const forward = forwardMemberName(map, unscoped.canonical, platform);
        return {
            kind: 'member', canonical: unscoped.canonical, written: term, via: unscoped.via,
            name: forward.name, ...(forward.ambiguous ? { ambiguous: forward.ambiguous } : {}),
        };
    }
    if (unscoped.ambiguous) {
        return { kind: 'ambiguous', canonical: term, written: term, name: null, ambiguous: unscoped.ambiguous };
    }

    // A component no generator describes, named by this page: resolve by rule instead of reporting a
    // term the maps were never going to contain. Scoped this way so the rest of a mixed page is still
    // checked -- only the areas listed in passthrough.json get the benefit of the doubt.
    // Blazor synthesizes a `<Event>Script` variant of every event, for handlers that must run
    // synchronously. The generator does not record the synthesized names -- no Blazor member in any
    // map maps to a *Script name -- so the map holds the base event only.
    //
    // Validated against the base and linked as the variant: stripping the suffix proves the member
    // exists, which is what the check is for, while the ApiLink still points at the name the reader
    // actually uses. Neither an escape nor a bare term would do: an escape suppresses the link for
    // something that really is API, and a bare term cannot be validated at all.
    if (platform === 'Blazor' && /[a-z]Script$/.test(term)) {
        const base = term.slice(0, -'Script'.length);
        for (const written of [...types, null]) {
            const holder = written === null ? null : (canonicalTypeFor(map, written, platform).canonical ?? written);
            const asMember = canonicalMemberFor(map, base, holder, holder !== null);
            if (!asMember.canonical) continue;
            return {
                kind: 'member', canonical: term, written: term, via: 'blazor-script',
                ...(holder ? { type: holder } : {}), name: term,
            };
        }
    }

    const owner = types.find(one => passthrough.has(one));
    if (owner !== undefined) {
        const camel = CAMELCASING_PLATFORMS.has(platform);
        const name = camel ? term.charAt(0).toLowerCase() + term.slice(1) : term;
        return { kind: 'passthrough', canonical: term, written: term, type: owner, name };
    }

    return { kind: 'unknown', canonical: term, written: term, name: null };
}

/** The platforms that camelCase a member name; the rest use it as the canonical declares it. */
const CAMELCASING_PLATFORMS = new Set(['Angular', 'React', 'WebComponents']);

/**
 * Resolution by rule, for the parts of the product no generator describes.
 *
 * The canonical name is the C# name, so the answer is the term itself on the XAML platforms and its
 * camelCased form on the web ones. Blazor keeps PascalCase, which is why it is not in the set above.
 *
 * Nothing is reported: without a map there is no way to tell a real name from a typo here, and a
 * check that cannot distinguish them should not pretend to.
 */
function passthroughTerms(content, platform) {
    const ranges = protectedRanges(content);
    const camel = CAMELCASING_PLATFORMS.has(platform);
    const owner = mentionedTypesOf(content)[0];
    const resolved = [];
    let usedApiLink = false;

    const out = content.replace(/`([^`\n]+)`/g, (whole, term, at) => {
        if (inside(ranges, at)) return whole;

        if (term.startsWith(ESCAPE)) return '`' + term.slice(ESCAPE.length) + '`';
        if (!looksLikeIdentifier(term)) return whole;

        const name = camel ? term.charAt(0).toLowerCase() + term.slice(1) : term;
        resolved.push({ written: term, canonical: term, type: owner, name, via: 'passthrough' });
        usedApiLink = true;
        // A link, like every other resolved term. Only the *name* came from the rule rather than a
        // lookup; whether the api-docs index can point at it is a separate question, and ApiLink
        // already renders a plain code span when it cannot.
        const type = owner ? ` type="${owner}"` : '';
        return `<ApiLink${type} member="${term}" label="${name}" />`;
    });

    return { content: out, resolved, canonical: [], unknown: [], ambiguous: [], usedApiLink };
}

/**
 * Every backticked term rewritten for one platform.
 *
 * Returns the content and what happened to each term, so a check can fail the build on terms that
 * resolve nowhere — which is the guarantee the ApiLink form gave up. An <ApiLink> naming a member
 * that does not exist fails only where an index can see it, and no index covers WinUI or Uno.
 */
export function resolveApiTerms(content, platform, { mentionedTypes = null, repoRoot = undefined, where = 'this page' } = {}) {
    const mode = apiTermsMode(content, where);

    if (mode === 'passthrough') {
        return passthroughTerms(content, platform);
    }

    if (mode === 'none') {
        // Returned as it came, and reported as nothing rather than as everything unresolved: a page
        // that opted out should not appear in the check's output at all.
        return { content, resolved: [], canonical: [], unknown: [], ambiguous: [], usedApiLink: false, skipped: true };
    }

    const map = apiMap(repoRoot);
    const passthrough = passthroughTypes(repoRoot);
    const declared = mentionedTypes ?? mentionedTypesOf(content);
    const ranges = protectedRanges(content);
    // Implicit context, nearest first, with what the frontmatter declared behind it. A type named two
    // sentences ago is a better guess for an unqualified member than one listed in the frontmatter.
    const isKnownType = t => canonicalTypeFor(map, t, platform).canonical !== null;
    const positions = typeContextPositions(content);

    const resolved = [];
    const canonical = [];
    const unknown = [];
    const ambiguous = [];
    let usedApiLink = false;

    const out = content.replace(/`([^`\n]+)`/g, (whole, term, at) => {
        if (inside(ranges, at)) return whole;

        if (term.startsWith(ESCAPE)) {
            // The author has said this is not an API name. The backslash was for us, not the reader.
            return '`' + term.slice(ESCAPE.length) + '`';
        }

        if (!looksLikeIdentifier(term)) return whole;

        const scoped = [...contextAt(positions, at, isKnownType), ...declared];
        const hit = resolveTerm(map, term, platform, scoped, passthrough);

        if (hit.kind === 'unknown') {
            // Left exactly as written so the page still builds; the check is what fails.
            unknown.push(term);
            return whole;
        }

        if (hit.kind === 'passthrough') {
            // Still a link. The page named the type, so there is something to point at even though no
            // map describes it -- only the *name* came from the rule rather than from a lookup. A page
            // that opted out wholesale (apiTerms: passthrough) is the explicit case and stays plain.
            usedApiLink = true;
            resolved.push(hit);
            return `<ApiLink type="${hit.type}" member="${hit.canonical}" label="${hit.name}" />`;
        }

        if (hit.kind === 'ambiguous') {
            ambiguous.push({ term, candidates: hit.ambiguous });
            return whole;
        }

        usedApiLink = true;

        // A term the maps know but this platform does not have keeps its canonical name. Still an
        // ApiLink, so it stays a link rather than degrading to plain code on one platform.
        const label = hit.name ?? hit.canonical;
        if (hit.name === null) canonical.push(term); else resolved.push(hit);

        if (hit.kind === 'type') {
            return `<ApiLink type="${hit.canonical}" label="${label}" />`;
        }

        const owner = hit.type ? ` type="${hit.type}"` : '';
        // A term the author qualified stays qualified, in the platform's own spelling for both halves.
        const shown = hit.via === 'qualified' ? `${hit.qualifiedBy}.${label}` : label;
        return `<ApiLink${owner} member="${hit.canonical}" label="${shown}" />`;
    });

    return { content: out, resolved, canonical, unknown, ambiguous, usedApiLink };
}

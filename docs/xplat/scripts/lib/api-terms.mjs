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
 * This module decides how a page wants its terms treated. For the xplat pages, the resolution itself
 * is description-terms.mjs, which reads the product's description metadata and the api-docs indexes:
 * a term either resolves to this platform's name or is an error the build reports.
 *
 * A term that should not resolve at all — `true`, `.shp`, a Windows path — is escaped with a leading
 * backslash, which says so explicitly rather than relying on it happening to miss.
 */

import { resolveDescriptionTerms } from './description-terms.mjs';

/**
 * A term written `\like-this` is not an API name. The backslash is the author saying so.
 *
 * A run of them counts as one. Inside a code span a backslash is a literal character, not an escape,
 * so an author doubling it -- as several did, reasonably, expecting MDX to need it -- meant the same
 * thing. Stripping only one left the other on the page: readers saw `\NaN`, `\MaxValue`, `\Low`.
 */
const ESCAPE = /^\\+/;

/** The `apiTerms:` values a page may declare. */
export const API_TERM_MODES = ['full', 'none', 'passthrough'];

/** Whether a page declares itself web-only. See platformType. */
export function isWebOnly(content, where = 'this page') {
    return platformType(content, where) === 'web-only';
}

/** The `platformType:` values a page may declare. */
export const PLATFORM_TYPES = ['xplat', 'xplat-unmapped', 'web-only'];

/** What each platform type means a page's code spans want, when the page does not say otherwise. */
const API_TERMS_DEFAULT = { xplat: 'full', 'xplat-unmapped': 'passthrough', 'web-only': 'none' };

/**
 * Which population a page belongs to, from `platformType:` in the frontmatter.
 *
 *   xplat            the DV set, with an API the generator describes
 *   xplat-unmapped   the DV set, where the full treatment cannot be applied yet. Two reasons so far,
 *                    and both are the page's situation rather than its identity: the Excel library
 *                    has an API no generator describes, so there is no description to check its
 *                    names against; and the data grid's accessibility topic documents ARIA on DOM elements
 *                    while the XAML platforms have UI Automation, so what it should say there is not
 *                    yet decided. Either way the terms resolve by rule. Saying this here rather than
 *                    per page keeps "an xplat doc is `full`" true without an exception list: a page
 *                    that cannot meet it is its own category rather than one quietly opting out.
 *   web-only         published for the web platforms and no further
 *
 * **Required, with no default.** It decides two things a page cannot be read for: what `apiTerms`
 * means here, and whether a hand written block per platform is a drift risk or nobody's business.
 * A page that has not stated it fails, naming the file.
 */
export function platformType(content, where = 'this page') {
    const match = /^platformType:\s*(\S+)/m.exec(content);
    if (!match) {
        throw new Error(
            `${where}: no platformType in the frontmatter. Add "platformType: xplat" for a topic in ` +
            `the cross-platform (DV) set, "platformType: xplat-unmapped" for one whose API no ` +
            `generator describes, or "platformType: web-only" for one that ships for the web ` +
            `platforms only.`);
    }
    const value = match[1].replace(/^["']|["']$/g, '');
    if (!PLATFORM_TYPES.includes(value)) {
        throw new Error(`${where}: platformType is "${value}"; expected one of ${PLATFORM_TYPES.join(', ')}.`);
    }
    return value;
}

/**
 * How a page wants its code spans treated: `apiTerms:` if it states one, otherwise whatever its
 * `platformType` implies.
 *
 *   full         every term in backticks is resolved through the description metadata
 *   none         nothing is touched: the code span is preserved as authored, no ApiLink, no report
 *   passthrough  resolved by rule rather than by lookup -- the canonical name as written on the XAML
 *                platforms, camelCased on the ones that camelCase -- and still rendered as an
 *                ApiLink, with nothing reported as unknown
 *
 * **The default comes from `platformType`,** which is what this used to require every page to restate.
 * An xplat topic is `full`: it has a second spelling to resolve to on every platform it ships for, and
 * a name nothing resolves is an API claim nobody checked. A web-only topic is `none`: it has no second
 * spelling, so resolution can only introduce noise -- every backticked shell command reported as an
 * unresolved API name. Defaulting without knowing the population is what made this undecidable
 * before; the population is now stated in the page.
 *
 * A page states `apiTerms` only to differ from that. `passthrough` is the case that needs it: the
 * parts of the product ApiGenerator does not build -- the Excel library, and components like DataChart
 * that carry no widget markers for WPF and are exposed directly. Their canonical C# surface *is* the
 * public API, so there is no description and never will be by that route, and a name is the same everywhere
 * bar casing. Reporting those as unknown would be reporting that a generator we do not run for them
 * did not run.
 *
 * A page in `passthrough` still gets platform-correct casing, which is the part a reader notices.
 * What it gives up is the check: a typo on such a page resolves as happily as a real name.
 */
export function apiTermsMode(content, where = 'this page') {
    const match = /^apiTerms:\s*(\S+)/m.exec(content);
    if (!match) {
        return API_TERMS_DEFAULT[platformType(content, where)];
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

/** `global::Name` forces the type reading, whatever the page's context would otherwise imply. */
const GLOBAL = 'global::';

/**
 * Any dotted term. What the dot means is decided by resolution, not by spelling: if the head resolves
 * as a type the dot is type scoping, and otherwise the whole thing is tried as one name, which is how
 * a path into a sub-object is recorded -- `labelSettings.angle`. Casing cannot be the test, because a
 * fully qualified name is exactly what an author reaches for to disambiguate, and nothing guarantees
 * the two halves are cased differently.
 *
 * A dotted term resolution cannot answer is reported like any other, `index.ts` included. The escape is
 * how an author says a code span is not an API name, and guessing on their behalf would hide the one
 * decision this check exists to surface.
 */
const DOTTED = /^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)+$/;

const looksLikeIdentifier = term => {
    // `global::Name` is a name with an instruction attached, so it is judged on the name.
    const bare = term.startsWith(GLOBAL) ? term.slice(GLOBAL.length) : term;
    return (/^[A-Za-z][A-Za-z0-9]*$/.test(bare) && /[A-Z]/.test(bare)) || DOTTED.test(bare);
};

/** The platforms that camelCase a member name; the rest use it as the canonical declares it. */
const CAMELCASING_PLATFORMS = new Set(['Angular', 'React', 'WebComponents']);

/**
 * Resolution by rule, for the parts of the product no generator describes.
 *
 * The canonical name is the C# name, so the answer is the term itself on the XAML platforms and its
 * camelCased form on the web ones. Blazor keeps PascalCase, which is why it is not in the set above.
 *
 * Nothing is reported: without a description there is no way to tell a real name from a typo here, and a
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

        if (ESCAPE.test(term)) return '`' + term.replace(ESCAPE, '') + '`';
        if (!looksLikeIdentifier(term)) return whole;

        const name = camel ? term.charAt(0).toLowerCase() + term.slice(1) : term;
        resolved.push({ written: term, canonical: term, type: owner, name, via: 'passthrough' });
        usedApiLink = true;
        // A link, like every other resolved term. Only the *name* came from the rule rather than a
        // lookup; whether the api-docs index can point at it is a separate question, and ApiLink
        // already renders a plain code span when it cannot.
        // No owner, no link -- see the note in resolveApiTerms. The rule still gave the right spelling.
        if (!owner) {
            usedApiLink = false;
            return '`' + name + '`';
        }
        return `<ApiLink type="${owner}" member="${name}" />`;
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

    // The xplat set resolves from the product's description metadata and the api-docs indexes; see
    // description-terms.mjs. Every term either resolves or is an error the build reports and fails on.
    const described = resolveDescriptionTerms(content, platform, { repoRoot: repoRoot ?? process.cwd() });
    return { content: described.content, resolved: [], canonical: [], unknown: [], ambiguous: [],
             errors: described.errors, usedApiLink: described.usedApiLink };
}

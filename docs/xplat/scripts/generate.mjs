/**
 * Platform-specific markdown generator.
 *
 * Covers:
 *   1. Variable substitution          {Platform}, {PackageCore}, etc.
 *   2. Platform block filtering        <!-- Angular -->...<!-- end: Angular -->
 *   3. Component block filtering       <!-- ComponentStart: Grid -->...<!-- ComponentEnd: Grid -->
 *   4. Code block removal              by exclusive language tag AND by content detection
 *   5. Shared file expansion           _shared/*.mdx → grid/, tree-grid/, …
 *   6. Sample viewer transformation    `sample="..."` → <code-view> HTML
 *   7. CodeSandbox / StackBlitz buttons (per platform config)
 *   8. TOC generation                  filter toc.json by platform → dist toc.json
 *   9. Multi-language support          --lang=en|jp|kr
 *
 * Usage:
 *   node scripts/generate.mjs --platform=React
 *   node scripts/generate.mjs --platform=Angular --lang=jp
 *   node scripts/generate.mjs --platform=WebComponents --lang=kr
 */

import {
    readFileSync, writeFileSync, mkdirSync,
    existsSync, readdirSync, rmSync, statSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// The snippet emitter is a CommonJS bundle of the locally built renderer; see transformJsonSnippets.
import { createRequire } from 'node:module';
import Ajv from 'ajv';
import draft06 from 'ajv/dist/refs/json-schema-draft-06.json' with { type: 'json' };
// Canonical platform-visibility rules, shared with astro.config.ts and the
// link checkers. Node strips the TS types on import (CI runs Node 24).
import { emitsFor, forMatches } from '../../../src/lib/platform-groups.ts';

// ---------------------------------------------------------------------------
// CLI arguments
// ---------------------------------------------------------------------------

const args        = process.argv.slice(2);
const get         = (prefix) => args.find(a => a.startsWith(prefix))?.split('=')[1];

const PLATFORM = get('--platform=') ?? process.env.PLATFORM ?? 'React';
const LANG     = get('--lang=')     ?? process.env.LANG_CODE ?? 'en';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');

// Source MD files:  src/content/{lang}/components/
const SRC_COMPONENTS = path.join(ROOT, 'src', 'content', LANG, 'components');

// Source toc.json:  src/content/{lang}/toc.json

const OUT_DIR = path.join(ROOT, 'generated', PLATFORM, LANG, 'components');

const DOC_CONFIG     = path.join(ROOT, 'docConfig.json');

// ---------------------------------------------------------------------------
// Load config files
// ---------------------------------------------------------------------------

const docConfig = JSON.parse(readFileSync(DOC_CONFIG, 'utf8'));

const platformConfig = docConfig[PLATFORM];
if (!platformConfig) {
    const valid = Object.keys(docConfig).filter(k => k !== 'NOTE').join(', ');
    console.error(`Unknown platform "${PLATFORM}". Valid: ${valid}`);
    process.exit(1);
}

// ---------------------------------------------------------------------------
// Build the set of hrefs excluded for the current platform from toc.json.
//
// toc.json entries look like:
//   { "href": "general-changelog-dv-react.mdx", "exclude": ["Angular", "Blazor"] }
//
// We normalise each href to a slug (no .md/.mdx extension, forward slashes)
// and store it in a Set for O(1) lookup in processDir / expandSharedFiles.
// Section nodes with no href but with children are recursively scanned.
// ---------------------------------------------------------------------------

function collectExcludedSlugs(nodes, excluded = new Set()) {
    for (const node of nodes || []) {
        const isExcluded = !emitsFor(PLATFORM, node);
        if (isExcluded && node.href) {
            excluded.add(node.href.replace(/\.(mdx?)?$/, '').replace(/\\/g, '/'));
        }
        if (Array.isArray(node.items)) {
            if (isExcluded) {
                collectAllSlugs(node.items, excluded);
            } else {
                collectExcludedSlugs(node.items, excluded);
            }
        }
    }
    return excluded;
}

function collectAllSlugs(nodes, excluded) {
    for (const node of nodes || []) {
        if (node.href) excluded.add(node.href.replace(/\.(mdx?)?$/, '').replace(/\\/g, '/'));
        if (Array.isArray(node.items)) collectAllSlugs(node.items, excluded);
    }
}

// Collect slugs that are reachable via at least one non-excluded path.
// A slug present in both included and excluded sets is NOT excluded —
// e.g. general-getting-started.md appears under a React node AND a Blazor-only node.
function collectIncludedSlugs(nodes, included = new Set()) {
    for (const node of nodes || []) {
        const isExcluded = !emitsFor(PLATFORM, node);
        if (!isExcluded && node.href) {
            included.add(node.href.replace(/\.(mdx?)?$/, '').replace(/\\/g, '/'));
        }
        if (Array.isArray(node.items) && !isExcluded) {
            collectIncludedSlugs(node.items, included);
        }
    }
    return included;
}

const TOC_PATH = path.join(ROOT, 'src', 'content', LANG, 'toc.json');
const EXCLUDED_SLUGS = (() => {
    if (!existsSync(TOC_PATH)) return new Set();
    const toc = JSON.parse(readFileSync(TOC_PATH, 'utf8'));
    const excluded = collectExcludedSlugs(toc);
    const included = collectIncludedSlugs(toc);
    // A slug reachable via a non-excluded path is never excluded,
    // even if it also appears under an excluded parent (e.g. shared getting-started page).
    for (const slug of included) excluded.delete(slug);
    return excluded;
})();

console.log(`[generate] Excluded pages for ${PLATFORM}: ${EXCLUDED_SLUGS.size}`);

// ---------------------------------------------------------------------------
// Markdown spacing
// ---------------------------------------------------------------------------

function normalizeMarkdownSpacing(content) {
    const hasFinalNewline = /\r?\n$/.test(content);
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const result = [];
    let blankCount = 0;
    let inFence = false;

    for (const line of lines) {
        if (/^\s*(```|~~~)/.test(line)) {
            inFence = !inFence;
            blankCount = 0;
            result.push(line);
            continue;
        }

        if (inFence) {
            result.push(line);
            continue;
        }

        if (line.trim() === '') {
            blankCount++;
            if (blankCount <= 1) {
                result.push('');
            }
            continue;
        }

        blankCount = 0;
        result.push(line);
    }

    let normalized = result.join('\n').replace(/\n+$/, '');
    if (hasFinalNewline) {
        normalized += '\n';
    }
    return normalized;
}

function prepareMarkdownOutput(content) {
    return normalizeMarkdownSpacing(content);
}

// ---------------------------------------------------------------------------
// Sort longer names first to avoid partial-match problems
// e.g. {PlatformLower} must match before {Platform}
const replacements = platformConfig.replacements
    .filter(r => r.name && r.value !== undefined)
    .sort((a, b) => b.name.length - a.name.length);


// ---------------------------------------------------------------------------
// 1. Variable substitution
// ---------------------------------------------------------------------------

function applyReplacements(content, extraReplacements = []) {
    const all = [...extraReplacements, ...replacements]
        .sort((a, b) => b.name.length - a.name.length);
    for (const { name, value } of all) {
        content = content.replaceAll(name, value);
    }
    return content;
}

// ---------------------------------------------------------------------------
// 2. Platform block filtering
// ---------------------------------------------------------------------------

function filterPlatformBlocks(content) {
    return content.replace(
        /<!-- ([\w ,]+?) -->([\s\S]*?)<!-- end: \1 -->/g,
        // Accepts platform names and group aliases (Web, NonWeb) alike.
        (_m, platforms, body) => (forMatches(PLATFORM, platforms) ? body : ''),
    );
}

// ---------------------------------------------------------------------------
// 3. Component block filtering
// ---------------------------------------------------------------------------

/**
 * Filter component-conditional blocks, keeping only content for the given
 * component key. Handles both syntaxes:
 *
 *   Legacy HTML comment syntax (used in .md files):
 *     <!-- ComponentStart: Grid -->...<!-- ComponentEnd: Grid -->
 *
 *   MDX component syntax (used in _shared/*.mdx):
 *     <ComponentBlock for="Grid">...</ComponentBlock>
 *
 * If componentKey is null, all block markers are stripped (content kept).
 */
function filterComponentBlocks(content, componentKey) {
    // --- HTML comment syntax ---
    if (!componentKey) {
        content = content
            .replace(/<!-- ComponentStart: [\w, ]+ -->/g, '')
            .replace(/<!-- ComponentEnd: [\w, ]+ -->/g, '');
    } else {
        content = content.replace(
            /<!-- ComponentStart: ([\w, ]+) -->([\s\S]*?)<!-- ComponentEnd: \1 -->/g,
            (_m, keys, body) =>
                keys.split(',').map(k => k.trim()).includes(componentKey) ? body : '',
        );
    }

    // --- MDX <ComponentBlock for="..."> syntax ---
    if (!componentKey) {
        // Strip the wrapper tags, keep the body
        content = content.replace(
            /<ComponentBlock for="[\w, ]+">([\s\S]*?)<\/ComponentBlock>/g,
            (_m, body) => body,
        );
    } else {
        content = content.replace(
            /<ComponentBlock for="([\w, ]+)">([\s\S]*?)<\/ComponentBlock>/g,
            (_m, keys, body) =>
                keys.split(',').map(k => k.trim()).includes(componentKey) ? body : '',
        );
    }

    return content;
}


// ---------------------------------------------------------------------------
// 4. Code block filtering  (language tag + content detection)
// ---------------------------------------------------------------------------

// Languages that belong exclusively to one platform, or to one platform group.
// A value may be a platform name or a group alias (see src/lib/platform-groups.ts).
// `xaml` maps to the Xaml group — NOT NonWeb, which will also cover non-XAML
// platforms such as mobile.
const EXCLUSIVE_LANG = {
    razor:  'Blazor',
    cshtml: 'Blazor',
    tsx:    'React',
    jsx:    'React',
    xaml:   'Xaml',
};

// Content patterns for generic languages (ts / html / cs)
const CONTENT_PATTERNS = {
    Angular:       [/igx-\w+/,   /\bIgx[A-Z]/],
    React:         [/\bIgr[A-Z]/],
    WebComponents: [/igc-\w+/,   /\bIgc[A-Z]/],
    Blazor:        [/\bIgb[A-Z]/],
};

function detectPlatformFromContent(lang, code) {
    const l = lang.toLowerCase();
    if (!['ts', 'typescript', 'html'].includes(l)) return null;
    for (const [platform, patterns] of Object.entries(CONTENT_PATTERNS)) {
        if (patterns.some(p => p.test(code))) return platform;
    }
    return null;
}

function filterCodeBlocks(content) {
    return content.replace(/```(\w+)([\s\S]*?)```/g, (match, lang, body) => {
        // Exclusive language check. `owner` may be a platform or a group alias.
        const owner = EXCLUSIVE_LANG[lang.toLowerCase()];
        if (owner && !forMatches(PLATFORM, owner)) return '';

        // Content-based detection for ts / html
        const detected = detectPlatformFromContent(lang, body);
        if (detected && detected !== PLATFORM) return '';

        return match;
    });
}

// ---------------------------------------------------------------------------
// 5. <PlatformBlock for="..."> filtering for MDX files
//
// Depth-aware stack parser — correctly handles nested PlatformBlocks.
// Keeps body content when the platform list includes PLATFORM, strips otherwise.
// After filtering the now-unused `import PlatformBlock` line is also removed.
// ---------------------------------------------------------------------------

function inlinePlatformBlocks(content) {
    const openRe  = /<PlatformBlock\s+for="([^"]+)">/g;
    const closeRe = /<\/PlatformBlock>/g;

    let result = '';
    let pos = 0;

    while (pos < content.length) {
        openRe.lastIndex  = pos;
        closeRe.lastIndex = pos;
        const openMatch  = openRe.exec(content);
        const closeMatch = closeRe.exec(content);
        const openPos    = openMatch  ? openMatch.index  : Infinity;
        const closePos   = closeMatch ? closeMatch.index : Infinity;

        if (openPos === Infinity && closePos === Infinity) {
            result += content.slice(pos);
            break;
        }

        if (closePos < openPos) {
            // Orphaned closer — pass through verbatim
            result += content.slice(pos, closePos + closeMatch[0].length);
            pos = closePos + closeMatch[0].length;
            continue;
        }

        result += content.slice(pos, openPos);
        const keep      = forMatches(PLATFORM, openMatch[1]);
        const bodyStart = openPos + openMatch[0].length;

        let depth = 1, searchPos = bodyStart;
        let bodyEnd = content.length, closerEnd = content.length;

        while (depth > 0) {
            openRe.lastIndex  = searchPos;
            closeRe.lastIndex = searchPos;
            const nextOpen  = openRe.exec(content);
            const nextClose = closeRe.exec(content);
            const nop = nextOpen  ? nextOpen.index  : Infinity;
            const ncp = nextClose ? nextClose.index : Infinity;

            if (ncp === Infinity) {
                bodyEnd = closerEnd = content.length;
                depth = 0;
            } else if (ncp < nop) {
                depth--;
                if (depth === 0) {
                    bodyEnd   = ncp;
                    closerEnd = ncp + nextClose[0].length;
                } else {
                    searchPos = ncp + nextClose[0].length;
                }
            } else {
                depth++;
                searchPos = nop + nextOpen[0].length;
            }
        }

        if (keep) {
            result += inlinePlatformBlocks(content.slice(bodyStart, bodyEnd));
        }

        pos = closerEnd;
    }

    return result;
}

// ---------------------------------------------------------------------------
// 5c. json-snippet blocks
//
// A ```json-snippet block holds one sample as JSON, and is turned into this platform's markup
// here, during generation. That replaces the four or five hand written blocks a topic would
// otherwise carry for the same sample — one per platform — with a single definition.
//
// Purely additive. Every other block is left exactly as it was, so a topic can hold both forms
// and a platform specific snippet that has no JSON equivalent keeps working unchanged.
//
// The emitter is the locally built one from the renderer work, loaded through a CommonJS bundle.
// When that work is published this becomes an ordinary package import and the paths below go away.
// ---------------------------------------------------------------------------

const SNIPPET_API_PATH = process.env.IG_SNIPPET_API
    || '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dist/snippet-api.cjs';
const SNIPPET_DOM_SHIM = process.env.IG_SNIPPET_DOM_SHIM
    || '/Users/graham/Documents/work/dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/dom-shim.js';
const SNIPPET_EXAMPLES = process.env.XPLAT_EXAMPLES;

// The fence language each platform's markup is written in, which is what the topic would have
// hand written for it.
const SNIPPET_FENCE_LANG = {
    Angular: 'html',
    WebComponents: 'html',
    React: 'tsx',
    Blazor: 'razor',
    WPF: 'xaml',
    WinUI: 'xaml',
    Uno: 'xaml',
};

/**
 * The style a documentation snippet is written in, before any sample says otherwise.
 *
 * The renderer's own defaults are what a generated project wants — every attribute on its own
 * line, every dimension stated. A doc block is not that: it keeps attributes on the tag's line,
 * and the XAML platforms write no dimensions at all because the hosting panel decides them.
 * Stating it once here beats repeating it in every sample, and a sample can still override any of
 * it through $styleOptions.
 */
// Shared by every platform. One attribute per line is the renderer's own default and is how the
// topics are written — thirty properties on one line is unreadable at any page width. Colours are
// pinned to the spelling the topics use: a name where the colour has one, hex otherwise, rather
// than each emitter picking (Web Components would otherwise write rgba(189, 220, 252, 1) for the
// #bddcfc that Blazor writes).
const SNIPPET_STYLE_COMMON = {
    suppressAutoElementNames: true,
    suppressNameAttribute: true,
    // The topics show the statements a handler runs, not the method the library wraps them in.
    omitHandlerSignature: true,
    colorNotation: 'hex',
    pascalCaseColorNames: true,
};

const SNIPPET_STYLE_DEFAULTS = {
    default: { ...SNIPPET_STYLE_COMMON, indentAttributes: true },

    // How each platform's topics have always written their numbers: Angular leaves them
    // undelimited, React braces them, and the rest quote them. React's emitter indents its
    // attributes already, so it is the one platform that must not ask for it again.
    Angular: { ...SNIPPET_STYLE_COMMON, indentAttributes: true, numericAttributeStyle: 'bare' },
    WebComponents: { ...SNIPPET_STYLE_COMMON, indentAttributes: true },
    Blazor: { ...SNIPPET_STYLE_COMMON, indentAttributes: true },
    React: {
        ...SNIPPET_STYLE_COMMON,
        numericAttributeStyle: 'braced',
        booleanAttributeStyle: 'braced',
        selfCloseEmptyElements: true,
    },

    // The XAML platforms state no dimensions, because the hosting panel decides them.
    WPF: { ...SNIPPET_STYLE_COMMON, indentXamlAttributes: true, omitDimensions: true },
    WinUI: { ...SNIPPET_STYLE_COMMON, indentXamlAttributes: true, omitDimensions: true },
    Uno: { ...SNIPPET_STYLE_COMMON, indentXamlAttributes: true, omitDimensions: true },
};

let snippetApi = null;
function loadSnippetApi() {
    if (snippetApi !== null) return snippetApi;
    const require = createRequire(import.meta.url);
    // The renderer drags in Web Components classes that touch window/document at module scope.
    // Code generation never renders, so the stub is only there to let the modules load.
    require(SNIPPET_DOM_SHIM);
    snippetApi = require(SNIPPET_API_PATH);
    return snippetApi;
}

/** `id="x" ref="x" channel="bindingCode" source="/x" exclude="Blazor"` on the fence line. */
function parseFenceAttributes(info) {
    const attrs = {};
    for (const m of info.matchAll(/(\w+)="([^"]*)"/g)) attrs[m[1]] = m[2];
    return attrs;
}

/**
 * The JSON each `id=` fence holds, so a later `ref=` fence can emit the same definition on another
 * channel without the topic stating it twice.
 *
 * Some properties cannot be written as an attribute on some platforms — a data source or a tooltip
 * template on Web Components is assigned in script — so a topic showing only markup would leave
 * that platform's reader with a series bound to nothing. The second fence emits exactly the part
 * the first could not, from the same definition, which is the whole point: two hand written blocks
 * are two things to keep in step, and they never were.
 */
function collectSnippetDefinitions(content) {
    const byId = new Map();
    for (const m of content.matchAll(/```json-snippet *([^\n]*)\n([\s\S]*?)```/g)) {
        const id = parseFenceAttributes(m[1]).id;
        if (id) byId.set(id, m[2]);
    }
    return byId;
}

function sampleFileFor(src) {
    return path.join(SNIPPET_EXAMPLES, 'samples', src.replace(/^\//, '') + '.json');
}

/**
 * Turns every ```json-snippet block into this platform's markup.
 *
 *   ```json-snippet source="/gauges/bullet-graph/measures" exclude="Blazor"
 *   { "type": "BulletGraph", "value": 50, … }
 *   ```
 *
 * The JSON is written out in full rather than naming the sample and overlaying changes onto it. A
 * reader of the topic can then see the whole snippet in the topic, which is the point — a block
 * whose real content lives in another file, assembled by rules, is not something anyone can read.
 *
 * `source` names the running sample the values came from. Nothing is read from it during
 * generation, but it is not decoration: check-snippet-sources.mjs compares the two and reports
 * every property where they differ, so a snippet that drifts from the sample it claims to show is
 * caught rather than discovered years later. That difference is exactly the overlay, so if the
 * inline form is ever regretted, the overlay form can be produced from it mechanically.
 *
 * A snippet showing fewer properties than its source is the normal case and says nothing: a section
 * about tick marks shows tick marks, not the thirty properties the running sample carries. What the
 * check reports is a property both of them set to different values, which is the only shape drift
 * can take once the two are linked.
 *
 * `exclude` names platforms the snippet is not for. A list of platforms to include was the other
 * option and is the wrong default — a snippet is for every platform unless something makes it not,
 * so stating the exception keeps the common case empty.
 */
/** Where the emitted schema is written, so an editor can point $schema at it. */
const SNIPPET_SCHEMA_OUT = path.join(ROOT, 'generated', 'snippet-schema.json');

/**
 * Emits the JSON schema and checks every json-snippet in the source against it.
 *
 * The renderer rejects a bad snippet one property at a time and only once generation reaches it,
 * which turns a page with five mistakes into five runs. The schema knows every description type
 * and every property on it, so one pass can report all of them, with the file and the property
 * named. It runs before any output is written, because a build that fails halfway leaves a
 * half-generated tree behind.
 *
 * The schema is written out as well as used, so the same file can back editor completion.
 */
function validateJsonSnippets(sourceDir) {
    const files = [];
    (function walk(dir) {
        for (const entry of readdirSync(dir)) {
            const full = path.join(dir, entry);
            if (statSync(full).isDirectory()) walk(full);
            else if (full.endsWith('.mdx')) files.push(full);
        }
    })(sourceDir);

    const snippets = [];
    for (const file of files) {
        const text = readFileSync(file, 'utf8');
        if (!text.includes('```json-snippet')) continue;
        for (const m of text.matchAll(/```json-snippet *([^\n]*)\n([\s\S]*?)```/g)) {
            const line = text.slice(0, m.index).split('\n').length;
            snippets.push({ file, line, info: m[1], body: m[2] });
        }
    }
    if (snippets.length === 0) return;

    const api = loadSnippetApi();
    const schema = JSON.parse(api.emitJsonSchema(SNIPPET_EXAMPLES));
    mkdirSync(path.dirname(SNIPPET_SCHEMA_OUT), { recursive: true });
    writeFileSync(SNIPPET_SCHEMA_OUT, JSON.stringify(schema, null, 2), 'utf8');

    // The schema references some types it never defines — AxisLabelSettings among them — which ajv
    // treats as fatal. Stubbing them permissively keeps every other property checkable; the count
    // is reported because each one is a property nothing is checking.
    const defined = new Set(Object.keys(schema.definitions));
    const referenced = new Set();
    (function walk(node) {
        if (node === null || typeof node !== 'object') return;
        if (Array.isArray(node)) { node.forEach(walk); return; }
        for (const [key, value] of Object.entries(node)) {
            if (key === '$ref' && typeof value === 'string' && value.startsWith('#/definitions/')) {
                referenced.add(value.slice('#/definitions/'.length));
            }
            walk(value);
        }
    })(schema);
    const dangling = [...referenced].filter(name => !defined.has(name));
    for (const name of dangling) schema.definitions[name] = {};
    if (dangling.length > 0) {
        console.log(`[generate] json-snippet: ${dangling.length} type(s) referenced but not defined ` +
                    `by the schema, so their properties go unchecked: ${dangling.slice(0, 5).join(', ')}` +
                    (dangling.length > 5 ? ', …' : ''));
    }

    const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
    ajv.addMetaSchema(draft06);
    ajv.addSchema(schema, 'snippets');

    // Checked against the description the snippet names, not against the union of all of them.
    // The union reports every property as unknown once per type that lacks it, which buries the
    // one misspelling that is actually wrong under a thousand that are not.
    const validators = new Map();
    const validatorFor = (type) => {
        if (!validators.has(type)) {
            validators.set(type, schema.definitions[type]
                ? ajv.compile({ $ref: `snippets#/definitions/${type}` })
                : null);
        }
        return validators.get(type);
    };

    const problems = [];
    for (const s of snippets) {
        const where = `${path.relative(ROOT, s.file)}:${s.line}`;
        // A ref= fence carries no definition of its own; the one it names is checked where it is
        // written.
        if (parseFenceAttributes(s.info).ref) continue;
        let parsed;
        try {
            parsed = JSON.parse(s.body);
        } catch (e) {
            problems.push(`${where}  not valid JSON — ${e.message}`);
            continue;
        }
        if (!parsed || typeof parsed !== 'object') {
            problems.push(`${where}  a snippet has to be an object describing one component`);
            continue;
        }
        // A snippet needing more than the component — handlers, refs — is written in the sample's
        // own shape, with the component under descriptions.content. Check that, as the emitter does.
        if (parsed.descriptions && parsed.descriptions.content) {
            parsed = parsed.descriptions.content;
        }
        if (typeof parsed.type !== 'string') {
            problems.push(`${where}  no "type", so there is nothing to check it against`);
            continue;
        }
        const validate = validatorFor(parsed.type);
        if (validate === null) {
            problems.push(`${where}  unknown component type "${parsed.type}"`);
            continue;
        }
        if (validate(parsed)) continue;
        for (const err of validate.errors ?? []) {
            const at = err.instancePath || '/';
            problems.push(err.params?.additionalProperty
                ? `${where}  ${at || '/'} unknown property "${err.params.additionalProperty}"`
                : `${where}  ${at} ${err.message}`);
        }
    }

    if (problems.length === 0) {
        console.log(`[generate] json-snippet: ${snippets.length} checked against the schema, all valid`);
        return;
    }
    console.error(`[generate] json-snippet: ${problems.length} problem(s) in ${snippets.length} snippet(s):`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
}

function transformJsonSnippets(content) {
    if (!content.includes('```json-snippet')) return content;

    const lang = SNIPPET_FENCE_LANG[PLATFORM];
    const api = loadSnippetApi();
    const definitions = collectSnippetDefinitions(content);

    return content.replace(/```json-snippet *([^\n]*)\n([\s\S]*?)```/g, (_match, info, body) => {
        // A platform this sample cannot be emitted for drops out, the same way a code block
        // belonging to another platform does.
        if (!lang || !api.isSupportedPlatform(PLATFORM)) return '';

        const attrs = parseFenceAttributes(info);
        // Same spelling a PlatformBlock's for= takes, groups included, so "Xaml" excludes all three.
        if (attrs.exclude && forMatches(PLATFORM, attrs.exclude)) return '';

        // Only that the path resolves. Whether the values still agree is a question for
        // check-snippet-sources.mjs, which can say what differs; failing a build here could only
        // say that something does.
        if (attrs.source && !existsSync(sampleFileFor(attrs.source))) {
            throw new Error(`json-snippet source names a sample that does not exist: ${attrs.source}`);
        }

        // A ref= fence emits another channel of a definition stated once, further up the page.
        let json = body;
        if (attrs.ref) {
            const referenced = definitions.get(attrs.ref);
            if (referenced === undefined) {
                throw new Error(`json-snippet ref="${attrs.ref}" names no snippet with that id`);
            }
            json = referenced;
        }

        const styleDefaults = SNIPPET_STYLE_DEFAULTS[PLATFORM] || SNIPPET_STYLE_DEFAULTS.default;
        const channel = attrs.channel || 'markup';
        let emitted;
        try {
            if (channel === 'markup') {
                emitted = api.emitSingleSnippet(json, PLATFORM, {
                    examplesRoot: SNIPPET_EXAMPLES,
                    defaultSnippetId: 'main',
                    styleDefaults,
                });
            } else {
                emitted = emitChannel(api, json, channel, styleDefaults);
            }
        } catch (e) {
            // Failing the build beats publishing a page with a hole where a sample should be.
            throw new Error(`json-snippet failed for ${PLATFORM}: ${e.message}\n${info}\n${body}`);
        }
        // A channel this platform writes nothing to drops out, the same way a block belonging to
        // another platform does — Angular binds its data source in the template, so it has no
        // binding code to show beside it.
        if (emitted === null || emitted.trim() === '') return '';
        const fence = '```' + (channel === 'markup' ? lang : CODE_FENCE_LANG[PLATFORM] || 'ts') +
                      '\n' + emitted + '\n```';
        if (channel !== 'markup') return fence;
        return fence + companionCode(api, json, attrs, styleDefaults);
    });
}

/**
 * The code that has to run beside this markup, when the markup could not say everything.
 *
 * Some properties cannot be written as an attribute on some platforms — a data source or a tooltip
 * template on Web Components is assigned in script — and the emitter is the thing that knows which,
 * because it is what decided. So a topic does not have to declare that a code block is needed: if
 * anything was left out of the markup, it appears here, and if nothing was, nothing appears. Angular
 * binds its data source in the template and gets no block; Web Components gets two lines.
 *
 * What that block shows is the assignments alone, which is what 149 of the 192 code blocks in the
 * hand written topics show. The 36 that also show how the reference was obtained, and the 27 that
 * declare a field, are the introductory pages; `code="allCode"` gets that fuller form, and
 * `code="none"` turns the whole thing off for a topic that would rather write its own.
 */
function companionCode(api, json, attrs, styleDefaults) {
    const mode = attrs.code || 'auto';
    if (mode === 'none') return '';

    // The assignments decide whether anything is shown at all, even when the fuller form is asked
    // for: field declarations and element lookups on their own teach nothing.
    const bindings = emitChannel(api, json, 'bindingCode', styleDefaults);
    if (bindings.trim() === '') return '';

    const body = mode === 'auto' ? bindings : emitChannel(api, json, mode, styleDefaults);
    if (body.trim() === '') return '';
    return '\n\n```' + (CODE_FENCE_LANG[PLATFORM] || 'ts') + '\n' + body.trim() + '\n```';
}

/** The fence language each platform's code — as opposed to its markup — is written in. */
const CODE_FENCE_LANG = {
    Angular: 'ts',
    React: 'tsx',
    WebComponents: 'ts',
    Blazor: 'razor',
    WPF: 'csharp',
    WinUI: 'csharp',
    Uno: 'csharp',
};

/**
 * One named channel of a definition — the part that did not fit in the markup.
 *
 * Asked for by recording a zone over the whole element on that channel, which is the same
 * mechanism a sample uses to name its own snippets.
 */
function emitChannel(api, json, channel, styleDefaults) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        throw new Error(`not valid JSON: ${e.message}`);
    }
    const root = parsed && parsed.descriptions && parsed.descriptions.content
        ? parsed.descriptions.content
        : parsed;
    root['$type'] = `+doc:${channel}`;

    // A handler is not written where its name appears, so marking the element does not reach it.
    // The list of handler names carries its own sidecar, which registers the request the handler
    // emitter answers when it gets there.
    for (const list of ['onInit', 'onViewInit']) {
        if (parsed[list] !== undefined) parsed[`$${list}`] = `+doc:${channel}`;
    }

    const snippets = api.emitSnippets(JSON.stringify(parsed), PLATFORM, {
        examplesRoot: SNIPPET_EXAMPLES,
        styleDefaults,
    });
    return snippets.find(s => s.channel === channel)?.content ?? '';
}

function transformMdxFile(content) {
    // 0. Turn any json-snippet block into this platform's markup
    content = transformJsonSnippets(content);
    // 1. Resolve <PlatformBlock> tags — keep only this platform's content
    content = inlinePlatformBlocks(content);
    // 2. Remove the now-unused PlatformBlock import (if any)
    content = content.replace(/^import PlatformBlock from '[^']+';?\r?\n/m, '');
    // 3. Resolve all tokens ({Platform}, {ProductName}, etc.) in both frontmatter and body.
    content = applyReplacements(content);
    return content;
}

// ---------------------------------------------------------------------------
// 6 & 7. Sample viewer + edit buttons
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 8. TOC generation — moved to astro.config.ts (buildFilteredToc)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Full transform pipelines
// ---------------------------------------------------------------------------

function normalise(content) {
    return content.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * Convert relative image paths (../images/, ../../images/, etc.)
 * to absolute /images/ so Astro can resolve them from public/.
 */
function normalizeImagePaths(content) {
    return content.replace(/(?:\.\.\/)+images\//g, '/images/');
}

function transformRegularFile(content, componentKey = null) {
    content = transformJsonSnippets(content);
    content = filterPlatformBlocks(content);
    content = filterComponentBlocks(content, componentKey);
    content = filterCodeBlocks(content);
    content = applyReplacements(content);
    content = normalizeImagePaths(content);
    return normalise(content);
}

// ---------------------------------------------------------------------------
// 5b. Shared grid file expansion
//
// grids/_shared/*.mdx → generated/.../grids/grid/*.mdx
//                        generated/.../grids/hierarchical-grid/*.mdx
//                        generated/.../grids/tree-grid/*.mdx
//                        generated/.../grids/pivot-grid/*.mdx  (if listed)
//
// Each component has a set of token overrides mapping {ComponentTitle} etc.
// to the specific grid's values, plus a ComponentStart filter key.
// ---------------------------------------------------------------------------

/**
 * Component definitions for _shared expansion.
 * key        — matches <!-- ComponentStart: key --> blocks
 * outDir     — sub-directory under grids/ in the output
 * tokenMap   — maps {ComponentXxx} tokens to per-component replacements
 *              by pulling existing replacement values from docConfig
 */
function buildSharedComponents() {
    const r = replacements;
    const get = (name) => r.find(x => x.name === name)?.value ?? '';

    return [
        {
            key: 'Grid',
            outDir: 'grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{GridTitle}') },
                { name: '{ComponentName}',       value: get('{GridName}') },
                { name: '{ComponentModule}',     value: get('{GridModule}') },
                { name: '{ComponentSelector}',   value: get('{GridSelector}') },
                { name: '{ComponentPackage}',    value: get('{GridPackage}') },
                { name: '{ComponentSample}',     value: get('{GridSample}') },
                { name: '{ComponentKeywords}',   value: get('{GridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{GridApiMembers}') },
            ],
        },
        {
            key: 'HierarchicalGrid',
            outDir: 'hierarchical-grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{HierarchicalGridTitle}') },
                { name: '{ComponentName}',       value: get('{HierarchicalGridName}') },
                { name: '{ComponentModule}',     value: get('{HierarchicalGridModule}') },
                { name: '{ComponentSelector}',   value: get('{HierarchicalGridSelector}') },
                { name: '{ComponentPackage}',    value: get('{HierarchicalGridPackage}') },
                { name: '{ComponentSample}',     value: get('{HierarchicalGridSample}') },
                { name: '{ComponentKeywords}',   value: get('{HierarchicalGridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{HierarchicalGridApiMembers}') },
            ],
        },
        {
            key: 'TreeGrid',
            outDir: 'tree-grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{TreeGridTitle}') },
                { name: '{ComponentName}',       value: get('{TreeGridName}') },
                { name: '{ComponentModule}',     value: get('{TreeGridModule}') },
                { name: '{ComponentSelector}',   value: get('{TreeGridSelector}') },
                { name: '{ComponentPackage}',    value: get('{TreeGridPackage}') },
                { name: '{ComponentSample}',     value: get('{TreeGridSample}') },
                { name: '{ComponentKeywords}',   value: get('{TreeGridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{TreeGridApiMembers}') },
            ],
        },
        {
            key: 'PivotGrid',
            outDir: 'pivot-grid',
            tokens: [
                { name: '{ComponentTitle}',      value: get('{PivotGridTitle}') },
                { name: '{ComponentName}',       value: get('{PivotGridName}') },
                { name: '{ComponentModule}',     value: get('{PivotGridModule}') },
                { name: '{ComponentSelector}',   value: get('{PivotGridSelector}') },
                { name: '{ComponentPackage}',    value: get('{PivotGridPackage}') },
                { name: '{ComponentSample}',     value: get('{PivotGridSample}') },
                { name: '{ComponentKeywords}',   value: get('{PivotGridKeywords}') },
                { name: '{ComponentApiMembers}', value: get('{PivotGridApiMembers}') },
            ],
        },
    ];
}

/**
 * For a given _shared .md file, check which components it applies to
 * by reading its sharedComponents frontmatter field.
 * Returns an array of component keys like ['Grid', 'TreeGrid', 'HierarchicalGrid'].
 */
function getSharedComponentKeys(content) {
    const m = content.match(/^sharedComponents:\s*\[([^\]]+)\]/m);
    if (!m) return null; // applies to all
    return m[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
}

/**
 * Ensure required MDX imports (Sample, PlatformBlock, ApiLink) are present
 * after the frontmatter block.
 */

function ensureMdxImports(content) {
    const needsSample  = content.includes('<Sample ');
    const needsApiLink = /<ApiLink\b/.test(content);

    const imports = [
        needsSample  && "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';",
        needsApiLink && "import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';",
    ].filter(Boolean);

    if (imports.length === 0) return content;

    // Check which imports are already present in the header section only
    // (before the first heading) to avoid false matches inside code blocks.
    const headerEnd = content.search(/^#\s/m);
    const header = headerEnd >= 0 ? content.slice(0, headerEnd) : content.slice(0, 2000);
    const newImports = imports.filter(imp => !header.includes(imp));
    if (newImports.length === 0) return content;

    // Insert after the closing --- of the frontmatter (handle both LF and CRLF)
    return content.replace(/^(---[\s\S]*?^---)\r?\n/m, `$1\n${newImports.join('\n')}\n\n`);
}

/**
 * Expand all _shared/*.mdx files into per-component output directories.
 *
 * For each component:
 *  - Filters <!-- ComponentStart/End --> blocks (keep only the target component)
 *  - Filters <!-- Platform -->...<!-- end: Platform --> blocks for current PLATFORM
 *  - Applies replacements to frontmatter only (body handled by Vite plugin at build time)
 *  - Applies component-specific token replacements to frontmatter
 *  - Adds _componentKey frontmatter so the Vite plugin resolves {Component*} tokens in body
 *  - Strips docfx-only frontmatter fields (mentionedTypes, sharedComponents, namespace)
 *  - Ensures required MDX imports are present (Sample, PlatformBlock, ApiLink)
 *  - Writes as .mdx to the per-component output directory
 */
function expandSharedFiles(sharedSrcDir, gridsOutDir) {
    if (!existsSync(sharedSrcDir)) return;

    const components = buildSharedComponents();

    for (const entry of readdirSync(sharedSrcDir)) {
        if (!/\.mdx$/.test(entry)) continue;

        const srcPath = path.join(sharedSrcDir, entry);
        const raw = readFileSync(srcPath, 'utf8');

        // Determine which components this file applies to
        const applicableKeys = getSharedComponentKeys(raw);

        for (const comp of components) {
            // Skip if not applicable
            if (applicableKeys && !applicableKeys.includes(comp.key)) continue;

            const outSubDir = path.join(gridsOutDir, comp.outDir);
            mkdirSync(outSubDir, { recursive: true });

            // 1. Filter component blocks (keep only this component's sections).
            let content = filterComponentBlocks(raw, comp.key);

            // 2. Filter <PlatformBlock> tags — keep only this platform's content.
            content = inlinePlatformBlocks(content);
            content = content.replace(/^import PlatformBlock from '[^']+';?\r?\n/m, '');

            // 3. Apply replacements + component tokens to frontmatter only.
            //    Body tokens ({Platform} etc.) are still handled by the Vite plugin
            //    at build time via _componentKey.
            const compTokens = [...comp.tokens].sort((a, b) => b.name.length - a.name.length);
            content = content.replace(/^(---[\s\S]*?^---)/m, fm => {
                let resolved = applyReplacements(fm);
                for (const { name, value } of compTokens) {
                    resolved = resolved.replaceAll(name, value);
                }
                return resolved;
            });

            // 4. Add _componentKey to frontmatter and strip docfx-only fields
            content = content.replace(/^(---)([\s\S]*?)(^---)/m, (_m, open, body, close) => {
                let fm = body
                    .replace(/^mentionedTypes:.*\r?\n/m, '')
                    .replace(/^sharedComponents:.*\r?\n/m, '')
                    .replace(/^namespace:.*\r?\n/m, '');
                // Add _componentKey if not already present
                if (!fm.includes('_componentKey:')) {
                    fm = fm.trimEnd() + `\n_componentKey: ${comp.key}\n`;
                }
                return `${open}${fm}${close}`;
            });

            // 5. Normalize image paths
            content = normalizeImagePaths(content);

            // 5b. Rewrite ../_shared/X.mdx → ./X.mdx
            //     After expansion, _shared files land as siblings in the output dir.
            //     Markdown links: (../_shared/X.mdx) → (./X.mdx)
            //     JSX href attrs:  href="../_shared/X.mdx" → href="./X.mdx"
            content = content.replace(/\(\.\.\/_shared\/([^)]+)\)/g, '(./$1)');
            content = content.replace(/href="\.\.\/_shared\/([^"]+)"/g, 'href="./$1"');

            // 5c. Strip links to pages that are excluded for this platform/component.
            //     When a _shared template is expanded to e.g. hierarchical-grid/,
            //     some sibling links point to pages that are excluded (e.g. paging.mdx
            //     is excluded for hierarchical-grid on all platforms).
            //     - List items "- [text](target.mdx)" → remove entire line
            //     - Inline links "[text](target.mdx)" → keep just the text
            content = content.replace(/^- \[([^\]]+)\]\(([^)]+)\)\s*$/mg, (line, _text, href) => {
                const base = href.split('#')[0].replace(/^\.\//, '').replace(/\.mdx?$/, '');
                if (/^https?:|^\//.test(base)) return line;
                const targetSlug = `grids/${comp.outDir}/${base}`;
                return EXCLUDED_SLUGS.has(targetSlug) ? '' : line;
            });
            content = content.replace(/\[([^\]]+)\]\(([^)]+\.mdx[^)]*)\)/g, (match, text, href) => {
                const base = href.split('#')[0].replace(/^\.\//, '').replace(/\.mdx?$/, '');
                if (/^https?:|^\//.test(base)) return match;
                const targetSlug = `grids/${comp.outDir}/${base}`;
                return EXCLUDED_SLUGS.has(targetSlug) ? text : match;
            });

            // 6. Check exclusion before writing
            const slug = `grids/${comp.outDir}/${entry.replace(/\.mdx?$/, '')}`;
            if (EXCLUDED_SLUGS.has(slug)) {
                console.log(`[generate] Skipping excluded: ${slug}`);
                continue;
            }

            // 7. Ensure MDX imports are present
            content = ensureMdxImports(content);

            // 8. Write as .mdx
            writeFileSync(path.join(outSubDir, entry), prepareMarkdownOutput(content), 'utf8');
        }

        console.log(`[generate] _shared/${entry} → grid/, hierarchical-grid/, tree-grid/, pivot-grid/`);
    }
}

// ---------------------------------------------------------------------------
// 9. Directory walker  (handles shared file expansion)
// ---------------------------------------------------------------------------

function processDir(srcDir, outDir, relBase = '') {
    mkdirSync(outDir, { recursive: true });

    for (const entry of readdirSync(srcDir)) {
        if (entry === '_shared') continue; // handled separately below
        const srcPath = path.join(srcDir, entry);

        if (/\.mdx?$/.test(entry)) {
            const slug = relBase
                ? `${relBase}/${entry.replace(/\.mdx?$/, '')}`
                : entry.replace(/\.mdx?$/, '');
            if (EXCLUDED_SLUGS.has(slug)) {
                console.log(`[generate] Skipping excluded: ${slug}`);
                continue;
            }
            const raw = readFileSync(srcPath, 'utf8');
            if (/\.mdx$/.test(entry)) {
                let content = prepareMarkdownOutput(ensureMdxImports(transformMdxFile(raw)));
                // Rewrite _shared/ cross-references so generated files resolve correctly.
                //   top-level (relBase=''):     ./grids/_shared/X.mdx → ./grids/grid/X.mdx
                //   grids/ level (relBase='grids'):  ./_shared/X.mdx → ./grid/X.mdx
                //   grid subdir (relBase='grids/grid' etc.): ../_shared/X.mdx → ./X.mdx
                if (relBase === '') {
                    content = content.replace(/\(\.\/grids\/_shared\/([^)]+)\)/g, '(./grids/grid/$1)');
                    content = content.replace(/href="\.\/grids\/_shared\/([^"]+)"/g, 'href="./grids/grid/$1"');
                } else if (relBase === 'grids') {
                    content = content.replace(/\(\.\/_shared\/([^)]+)\)/g, '(./grid/$1)');
                    content = content.replace(/href="\.\/\_shared\/([^"]+)"/g, 'href="./grid/$1"');
                } else if (relBase.startsWith('grids/')) {
                    content = content.replace(/\(\.\.\/_shared\/([^)]+)\)/g, '(./$1)');
                    content = content.replace(/href="\.\.\/_shared\/([^"]+)"/g, 'href="./$1"');
                }
                writeFileSync(path.join(outDir, entry), content, 'utf8');
            } else {
                writeFileSync(path.join(outDir, entry), prepareMarkdownOutput(transformRegularFile(raw)), 'utf8');
            }
        } else if (entry.endsWith('.json') && entry !== 'toc.json') {
            const raw = readFileSync(srcPath, 'utf8');
            writeFileSync(path.join(outDir, entry), applyReplacements(raw), 'utf8');
        } else if (!path.extname(entry)) {
            // No extension → treat as a subdirectory
            processDir(srcPath, path.join(outDir, entry), relBase ? `${relBase}/${entry}` : entry);
        }
    }

}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log(`[generate] Platform : ${PLATFORM}`);
console.log(`[generate] Language : ${LANG}`);
console.log(`[generate] Source   : ${SRC_COMPONENTS}`);
console.log(`[generate] Output   : ${OUT_DIR}`);

if (!existsSync(SRC_COMPONENTS)) {
    console.error(`Source directory not found: ${SRC_COMPONENTS}`);
    console.error(`For lang="${LANG}", add translated files to src/content/${LANG}/components/`);
    process.exit(1);
}

// Clean the output root (generated/{PLATFORM}/{LANG}/)
const OUT_ROOT = path.dirname(OUT_DIR); // generated/{PLATFORM}/{LANG}/
if (existsSync(OUT_ROOT)) {
    rmSync(OUT_ROOT, { recursive: true, force: true });
    console.log(`[generate] Cleaned output: ${OUT_ROOT}`);
}
mkdirSync(OUT_DIR, { recursive: true });
validateJsonSnippets(SRC_COMPONENTS);
processDir(SRC_COMPONENTS, OUT_DIR);

// Expand grids/_shared/*.mdx into per-component output directories
const sharedSrc = path.join(SRC_COMPONENTS, 'grids', '_shared');
const gridsOut  = path.join(OUT_DIR, 'grids');
expandSharedFiles(sharedSrc, gridsOut);
// generateToc()          → now done inline in astro.config.ts (buildFilteredToc)
// generateEnvironmentJson() → now read from docConfig.json.samplesBrowsers via platform-context.ts

// Write .platform.json so astro.config.mjs picks up the right platform
writeFileSync(
    path.join(ROOT, '.platform.json'),
    JSON.stringify({ platform: PLATFORM, lang: LANG }, null, 2),
    'utf8',
);

// Clear Astro's content cache so the next dev/build picks up the correct
// platform + language content rather than serving stale cached entries.
const astroCacheDir = path.join(ROOT, '.astro');
if (existsSync(astroCacheDir)) {
    rmSync(astroCacheDir, { recursive: true, force: true });
    console.log('[generate] Cleared .astro cache.');
}

console.log('[generate] Done.');

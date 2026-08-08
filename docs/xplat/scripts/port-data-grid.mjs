#!/usr/bin/env node
/**
 * port-data-grid.mjs
 *
 * One-shot port of the Data Grid topic set from the docfx-era repo
 * (igniteui-xplat-docs) into this repo's Astro MDX content.
 *
 * These 32 topics were never carried over during the MDX migration, and their
 * toc entries have been pointing at non-existent files ever since. The Data
 * Grid is the primary grid on the XAML platforms, so the ported topics are
 * gated `include: ["NonWeb"]` in toc.json.
 *
 * **All web snippets are retained.** The toc gates these topics to `NonWeb`
 * today, but that is a navigation decision, not a content one — the Data Grid
 * doc may be generated for the web platforms again. Every React / Web
 * Components / Blazor snippet is preserved, and the previously-inert
 * `<!--React-->` markers are converted into real PlatformBlocks, so a future
 * web build filters them correctly instead of showing all variants at once.
 *
 * Conversions performed:
 *   1. frontmatter        docfx `_description` / `_keywords` → schema names,
 *                         `license` and the required `llms.description` added
 *   2. platform blocks    `<!-- React -->…<!-- end: React -->` → <PlatformBlock>
 *   3. samples            `sample="/x", height="600", alt="y"` → <Sample …/>
 *   4. notes              `> [!Note]` → <DocsAside type="info">
 *   5. links              `./x.md` → `./x.mdx`
 *   6. imports            added for exactly the components each file uses
 *
 * Usage:
 *   node scripts/port-data-grid.mjs --dry-run
 *   node scripts/port-data-grid.mjs
 *   node scripts/port-data-grid.mjs --src <path-to-igniteui-xplat-docs>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLATFORMS } from '../../../src/lib/platform-groups.ts';

/** Only these names are treated as platform markers; anything else is prose. */
const KNOWN_PLATFORMS = new Set(PLATFORMS);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPO_ROOT = path.resolve(ROOT, '..', '..');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const argSrc = (() => {
    const i = args.indexOf('--src');
    return i >= 0 ? args[i + 1] : null;
})();
/**
 * Locales to port. en and jp are kept in lockstep — the toc is shared in shape
 * across locales, so porting one without the other leaves dead sidebar links.
 */
const LANGS = (() => {
    const i = args.indexOf('--lang');
    return i >= 0 ? [args[i + 1]] : ['en', 'jp'];
})();

const XPLAT_DOCS =
    argSrc ??
    process.env.XPLAT_DOCS_ROOT ??
    path.resolve(REPO_ROOT, '..', 'igniteui-xplat-docs');

const srcDirFor = lang => path.join(XPLAT_DOCS, 'doc', lang, 'components', 'grids', 'data-grid');
const outDirFor = lang => path.join(ROOT, 'src', 'content', lang, 'components', 'grids', 'data-grid');

for (const lang of LANGS) {
    if (!existsSync(srcDirFor(lang))) {
        console.error(`[port] source not found: ${srcDirFor(lang)}`);
        console.error('[port] pass --src <path-to-igniteui-xplat-docs> or set XPLAT_DOCS_ROOT');
        process.exit(1);
    }
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

/** Quote a YAML scalar that contains `{`, `:`, `|`, `#` or leading/trailing space. */
function yamlQuote(v) {
    const s = String(v).trim();
    return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/**
 * Derives the `llms.description` one-liner required by check:llms-metadata.
 * Prefers the first body sentence, which is written for humans and is the most
 * accurate summary available; falls back to the topic description.
 */
function deriveLlmsDescription(body, description, title, lang = 'en') {
    const prose = body
        // Drop platform-gated regions first. Every one of these topics opens
        // with a Blazor/WebComponents deprecation aside; without this, all 32
        // would take that aside as their summary.
        .replace(/<!--\s*[A-Za-z][\w, ]*?\s*-->[\s\S]*?<!--\s*end:[^>]*?-->/g, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/^\s*>\s*\[![\s\S]*?(?:\n\s*\n|$)/gm, ' ')
        .replace(/^#.*$/gm, ' ')
        .replace(/^>.*$/gm, ' ')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`sample="[^`]*`/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        // Flatten markdown links to their text — a description is plain prose,
        // and a link target here would also dodge the .md → .mdx conversion.
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    // Mirrors scripts/check-llms-metadata.mjs: minimum length is locale-specific,
    // Japanese descriptions must contain Japanese text, and none may open with
    // page-oriented wording.
    const GENERIC_OPENING = /^(?:the following|this (?:example|topic|section)|in this example|below\b|here,)/i;
    const JAPANESE_TEXT = /[぀-ヿ㐀-鿿]/;
    const minLen = lang === 'jp' ? 20 : 40;
    const isUsable = s =>
        s.length >= minLen &&
        s.length <= 240 &&
        !GENERIC_OPENING.test(s) &&
        (lang !== 'jp' || JAPANESE_TEXT.test(s));

    // Japanese prose uses `。` as the sentence terminator.
    for (const sentence of prose.split(lang === 'jp' ? /(?<=[。.!])\s*/ : /(?<=[.!])\s+/)) {
        const s = sentence.trim();
        if (isUsable(s)) return s;
    }
    if (description) {
        const d = description.replace(/\s+/g, ' ').trim();
        const trimmed = d.length > 240 ? `${d.slice(0, 237).trimEnd()}...` : d;
        if (isUsable(trimmed) || (!GENERIC_OPENING.test(trimmed) && trimmed.length >= minLen)) return trimmed;
    }
    return title.replace(/\s*\|.*$/, '').trim();
}

function convertFrontmatter(raw, body, lang = 'en') {
    const lines = raw.split('\n');
    const out = new Map();
    let key = null;
    for (const line of lines) {
        const m = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
        if (m) {
            key = m[1];
            out.set(key, m[2]);
        } else if (key && line.trim()) {
            out.set(key, `${out.get(key)} ${line.trim()}`);
        }
    }

    const title = out.get('title') ?? '';
    const description = out.get('_description') ?? out.get('description') ?? '';
    const keywords = out.get('_keywords') ?? out.get('keywords') ?? '';

    const fm = [];
    fm.push(`title: ${yamlQuote(title)}`);
    if (description) fm.push(`description: ${yamlQuote(description)}`);
    if (keywords) fm.push(`keywords: ${yamlQuote(keywords)}`);
    fm.push('license: commercial');
    if (out.has('mentionedTypes')) fm.push(`mentionedTypes: ${out.get('mentionedTypes').trim()}`);
    if (out.has('namespace')) fm.push(`namespace: ${out.get('namespace').trim()}`);
    if (out.has('_canonicalLink')) fm.push(`_canonicalLink: ${yamlQuote(out.get('_canonicalLink'))}`);
    fm.push('llms:');
    fm.push(`  description: ${yamlQuote(deriveLlmsDescription(body, description, title, lang))}`);
    return fm.join('\n');
}

// ---------------------------------------------------------------------------
// Body
// ---------------------------------------------------------------------------

/**
 * Drops the deprecation notice that opens every source topic.
 *
 * The docfx originals carried a Blazor/WebComponents-scoped note saying the
 * Data Grid is deprecated in favour of the Grid. It is not wanted in this doc
 * set at all — the Data Grid is the primary grid on the XAML platforms — so the
 * whole notice is removed rather than platform-gated.
 *
 * Removes the enclosing platform-comment region when the notice is all it
 * contained, so no empty PlatformBlock is left behind.
 */
const DEPRECATION_TEXT = /has been deprecated|非推奨/;

function removeDeprecationNotices(body) {
    // Notice wrapped in a platform-comment region.
    body = body.replace(
        /<!--\s*[A-Za-z][\w, ]*?\s*-->\s*([\s\S]*?)<!--\s*end:[^>]*?-->\s*/g,
        (whole, inner) => {
            if (!DEPRECATION_TEXT.test(inner)) return whole;
            const withoutNote = inner.replace(/^\s*>\s*\[!\w+\]\s*\n[\s\S]*?(?=\n\s*\n|$)/m, '').trim();
            // Region held more than the notice — keep the region, drop the notice.
            if (withoutNote) return whole.replace(inner, `${withoutNote}\n\n`);
            return '';
        },
    );
    // Bare notice with no enclosing region.
    body = body.replace(/^\s*>\s*\[!\w+\]\s*\n(?:.*\n)*?(?=\s*\n)/gm, m =>
        DEPRECATION_TEXT.test(m) ? '' : m,
    );
    return body;
}

/** `<!-- React, Blazor -->` … `<!-- end: React, Blazor -->` → <PlatformBlock>. */
function convertPlatformBlocks(body) {
    return body.replace(
        /<!--\s*([A-Za-z][\w, ]*?)\s*-->([\s\S]*?)<!--\s*end:\s*\1\s*-->/g,
        (_m, platforms, inner) => {
            const list = platforms.split(',').map(s => s.trim()).filter(Boolean).join(', ');
            return `<PlatformBlock for="${list}">\n${inner.trim()}\n</PlatformBlock>`;
        },
    );
}

/**
 * Unpaired `<!--React-->` markers immediately preceding a fenced code block.
 *
 * These were inert HTML comments in the docfx pipeline — the gulpfile never
 * processed them — so both the React and the Web Components variant of an
 * import snippet rendered on every platform. Turning each into a PlatformBlock
 * around the block it annotates makes the author's intent real, which matters
 * here because these `ts` blocks carry no `Igr`/`Igc` token for generate.mjs's
 * content detection to catch, and would otherwise survive into the XAML output.
 */
function convertMarkedCodeBlocks(body, knownPlatforms) {
    const re = /<!--\s*([A-Za-z][\w, ]*?)\s*-->\s*\n(```[\s\S]*?\n```)/g;
    return body.replace(re, (m, platforms, block) => {
        const list = platforms.split(',').map(s => s.trim()).filter(Boolean);
        if (!list.length || !list.every(p => knownPlatforms.has(p))) return m;
        return `<PlatformBlock for="${list.join(', ')}">\n${block}\n</PlatformBlock>`;
    });
}

/**
 * Wraps every remaining platform-specific code fence in a PlatformBlock.
 *
 * The docfx pipeline filtered code blocks by language and content at build time
 * (`filterCodeBlocks` in generate.mjs), but that step runs only for `.md` files —
 * `transformMdxFile` does not call it. The MDX convention is that platform-
 * specific snippets are wrapped explicitly. Without this pass the React `tsx`,
 * Blazor `razor` and `Igr`/`Igc`-bearing `ts` snippets all render on every
 * platform, which is what the docfx output effectively did.
 *
 * Blocks whose platform cannot be determined are left unwrapped — they are
 * genuinely shared (JSON data, CSS, plain TypeScript).
 */
const EXCLUSIVE_LANG = { razor: 'Blazor', cshtml: 'Blazor', tsx: 'React', jsx: 'React' };
const CONTENT_PATTERNS = [
    ['Angular', [/igx-\w+/, /\bIgx[A-Z]/]],
    ['React', [/\bIgr[A-Z]/]],
    ['WebComponents', [/igc-\w+/, /\bIgc[A-Z]/]],
    ['Blazor', [/\bIgb[A-Z]/]],
];

function detectBlockPlatform(lang, code) {
    const owner = EXCLUSIVE_LANG[lang.toLowerCase()];
    if (owner) return owner;
    if (!['ts', 'typescript', 'html', 'css'].includes(lang.toLowerCase())) return null;
    for (const [platform, patterns] of CONTENT_PATTERNS) {
        if (patterns.some(p => p.test(code))) return platform;
    }
    return null;
}

/** Byte ranges already inside a PlatformBlock, so blocks are not double-wrapped. */
function protectedRanges(body) {
    const ranges = [];
    const openRe = /<PlatformBlock\s+for="[^"]+">/g;
    let m;
    while ((m = openRe.exec(body))) {
        const close = body.indexOf('</PlatformBlock>', m.index);
        if (close === -1) continue;
        ranges.push([m.index, close + '</PlatformBlock>'.length]);
    }
    return ranges;
}

function wrapPlatformCodeBlocks(body) {
    const ranges = protectedRanges(body);
    const inside = i => ranges.some(([a, b]) => i >= a && i < b);
    const fence = /^```(\w+)\n([\s\S]*?)\n```$/gm;
    const edits = [];
    let m;
    while ((m = fence.exec(body))) {
        if (inside(m.index)) continue;
        const platform = detectBlockPlatform(m[1], m[2]);
        if (!platform) continue;
        edits.push([m.index, m.index + m[0].length, platform, m[0]]);
    }
    for (let i = edits.length - 1; i >= 0; i--) {
        const [start, end, platform, block] = edits[i];
        body = `${body.slice(0, start)}<PlatformBlock for="${platform}">\n${block}\n</PlatformBlock>${body.slice(end)}`;
    }
    return body;
}

/** MDX rejects HTML comments; author notes become MDX expression comments. */
function convertComments(body) {
    return body.replace(/<!--([\s\S]*?)-->/g, (_m, inner) => `{/*${inner.replace(/\*\//g, '*\\/')}*/}`);
}

/** `sample="/path", height="600", alt="text"` (in backticks) → <Sample …/>. */
function convertSamples(body) {
    return body.replace(
        /`sample="([^"]+)"(?:,\s*height="(\d+)")?(?:,\s*alt="([^"]*)")?`/g,
        (_m, src, height, alt) => {
            const parts = [`src="${src}"`];
            if (height) parts.push(`height={${height}}`);
            if (alt) parts.push(`alt="${alt}"`);
            return `<Sample ${parts.join(' ')} />`;
        },
    );
}

/**
 * `> [!Note]` blocks → <DocsAside type="info">.
 * The docfx form puts the marker on its own quoted line and the text either on
 * following quoted lines or on plain lines directly beneath.
 */
function convertNotes(body) {
    const lines = body.split('\n');
    const out = [];
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^>\s*\[!(Note|Warning|Tip|Important|Caution)\]\s*$/i);
        if (!m) {
            out.push(lines[i]);
            continue;
        }
        const kind = m[1].toLowerCase();
        const type = kind === 'warning' || kind === 'caution' ? 'warning' : 'info';
        const buf = [];
        let j = i + 1;
        for (; j < lines.length; j++) {
            const l = lines[j];
            if (!l.trim()) break;
            // Stop at a heading, a comment, or any JSX/HTML tag boundary — a
            // closing tag swallowed into the note body produces interleaved
            // tags (`</PlatformBlock>` inside `<DocsAside>`), which MDX rejects.
            if (l.startsWith('#') || /^\s*<\/?[A-Za-z!]/.test(l)) break;
            buf.push(l.replace(/^>\s?/, ''));
        }
        out.push(`<DocsAside type="${type}">`, ...buf, '</DocsAside>');
        i = j - 1;
    }
    return out.join('\n');
}

/**
 * Link targets corrected on the way through.
 *
 * The deprecation notice at the top of every topic points at the Data Grid's
 * own overview. The sources disagreed and neither target was right for this
 * repo: English used `../data-grid.md`, which is the *web Grid* landing page
 * here (it drives {GridSample} and is what the toc's "Grid" entry points at),
 * while Japanese used `grid/overview.md`, resolving to
 * `grids/data-grid/grid/overview.mdx`, which has never existed and fails the
 * CI-gated relative-link checker.
 */
const LINK_FIXES = [
    [/\]\(grid\/overview\.md(#[^)]*)?\)/g, '](overview.md$1)'],
    [/\]\(\.\.\/data-grid\.md(#[^)]*)?\)/g, '](overview.md$1)'],
];

/** Relative cross-page links must carry the `.mdx` extension in this repo. */
function convertLinks(body) {
    for (const [re, to] of LINK_FIXES) body = body.replace(re, to);
    return body
        .replace(/\]\(([^)\s]+?)\.md(#[^)]*)?\)/g, (_m, p, hash) => `](${p}.mdx${hash ?? ''})`)
        // `$1` above leaves an empty group as literal `undefined` when absent
        .replace(/\.mdx\)undefined/g, '.mdx)');
}

const IMPORTS = [
    ['PlatformBlock', "import PlatformBlock from 'igniteui-astro-components/components/mdx/PlatformBlock.astro';"],
    ['Sample', "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';"],
    ['DocsAside', "import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';"],
    ['ApiLink', "import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';"],
];

function buildImports(body) {
    return IMPORTS.filter(([name]) => new RegExp(`<${name}[\\s/>]`).test(body))
        .map(([, stmt]) => stmt)
        .join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let written = 0;
const report = [];
const perLang = {};

for (const lang of LANGS) {
const SRC_DIR = srcDirFor(lang);
const OUT_DIR = outDirFor(lang);
const files = readdirSync(SRC_DIR).filter(f => f.endsWith('.md')).sort();
if (!DRY) mkdirSync(OUT_DIR, { recursive: true });
perLang[lang] = 0;

for (const file of files) {
    const raw = readFileSync(path.join(SRC_DIR, file), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) {
        report.push([`${lang}/${file}`, 'SKIPPED — no frontmatter']);
        continue;
    }

    let body = m[2];
    // Deprecation notices are dropped outright, before anything else looks at
    // the body — including the llms.description derivation below.
    body = removeDeprecationNotices(body);
    // Notes first: converting them before the platform comments become JSX
    // keeps each aside wholly inside its region, so the tags cannot interleave.
    body = convertNotes(body);
    body = convertPlatformBlocks(body);
    body = convertMarkedCodeBlocks(body, KNOWN_PLATFORMS);
    body = wrapPlatformCodeBlocks(body);
    body = convertSamples(body);
    body = convertLinks(body);
    // Last: any comment still present is author prose, and MDX cannot parse the
    // HTML form. Must run after the platform-comment conversions above.
    body = convertComments(body);

    const fm = convertFrontmatter(m[1], removeDeprecationNotices(m[2]), lang);
    const imports = buildImports(body);
    const doc = `---\n${fm}\n---\n\n${imports ? `${imports}\n\n` : ''}${body.replace(/^\n+/, '').trimEnd()}\n`;

    const outFile = path.join(OUT_DIR, file.replace(/\.md$/, '.mdx'));
    if (!DRY) writeFileSync(outFile, doc, 'utf8');
    written++;
    perLang[lang]++;

    const opens = (doc.match(/<PlatformBlock/g) || []).length;
    const closes = (doc.match(/<\/PlatformBlock>/g) || []).length;
    const stray = (doc.match(/<!--/g) || []).length;
    if (opens !== closes || stray) {
        report.push([
            `${lang}/${file}`,
            `PB ${opens}/${closes}${opens === closes ? '' : ' <-- UNBALANCED'}`,
            stray ? `${stray} HTML comments left <-- MDX will fail` : '',
        ]);
    }
}
}

for (const row of report) console.log('  ' + row.filter(Boolean).join('  |  '));
if (!report.length) console.log('  no structural problems');
const counts = Object.entries(perLang).map(([l, n]) => `${l}: ${n}`).join(', ');
console.log(`\n[port] ${DRY ? 'would write' : 'wrote'} ${written} file(s) (${counts})`);

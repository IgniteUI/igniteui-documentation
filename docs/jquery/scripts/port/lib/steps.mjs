/**
 * The transformation steps. Each takes the topic's tree and context and records what it handled
 * and what it could not decide in its own section of the report (`ctx.report.<step>`).
 */
import path from 'node:path';
import fs from 'node:fs';
import GithubSlugger from 'github-slugger';
import { visit, SKIP } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import { toString } from 'mdast-util-to-string';
import { resolveClient, resolveDotNet } from './api-index.mjs';
import { TOKEN_RE, URL_TOKENS } from './tokens.mjs';
import { ruleSlug } from './topic-map.mjs';
import { htmlTagNames } from 'html-tag-names';

const HTML_TAGS = new Set(htmlTagNames);

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });
const exprAttr = (name, expression) => ({ type: 'mdxJsxAttribute', name, value: { type: 'mdxJsxAttributeValueExpression', value: expression } });
const getAttr = (node, name) => node.attributes?.find(a => a.name === name)?.value;
const lineOf = node => node?.position?.start?.line ?? null;

function undecided(ctx, step, reason, detail, node) {
    ctx.report[step].undecided.push({ topic: ctx.row.source, line: lineOf(node), reason, detail });
}
function handled(ctx, step, what, n = 1) {
    const h = ctx.report[step].handled;
    h[what] = (h[what] ?? 0) + n;
}

function replaceNode(parent, node, replacement) {
    const index = parent.children.indexOf(node);
    parent.children.splice(index, 1, ...[].concat(replacement));
}

// ── metadata ────────────────────────────────────────────────────────────────

const METADATA_RE = /^<!--\s*\|metadata\|\s*([\s\S]*?)\s*\|metadata\|\s*-->$/;

/** The `<!-- |metadata| {…} |metadata| -->` comment becomes front matter. Runs on the parsed source. */
export function readMetadataComment(tree, ctx) {
    const first = tree.children[0];
    if (first?.type === 'html') {
        const m = METADATA_RE.exec(first.value.trim());
        if (m) {
            tree.children.shift();
            try {
                const data = JSON.parse(m[1]);
                handled(ctx, 'metadata', 'metadata comment');
                return data;
            } catch (error) {
                undecided(ctx, 'metadata', 'metadata comment is not JSON', error.message, first);
                return null;
            }
        }
    }
    undecided(ctx, 'metadata', 'no metadata comment', null, first);
    return null;
}

/** Text form of the metadata, for the topic map (before the topic is converted). */
export function metadataFromText(text) {
    const m = /<!--\s*\|metadata\|\s*([\s\S]*?)\s*\|metadata\|\s*-->/.exec(text);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch { return null; }
}

// ── headings ────────────────────────────────────────────────────────────────

/** The first level-1 heading gives the title. */
export function takeTitle(tree, ctx) {
    let title = null;
    visit(tree, 'heading', node => {
        if (title === null && node.depth === 1) {
            title = toString(node).replace(/\s+/g, ' ').trim();
            return false;
        }
    });
    if (title === null) {
        visit(tree, 'heading', node => {
            if (title === null) title = toString(node).replace(/\s+/g, ' ').trim();
        });
        undecided(ctx, 'headings', title ? 'no level-1 heading; title from the first heading' : 'no heading; title from the navigation label', null, null);
        title ??= ctx.row.navLabel;
    }
    handled(ctx, 'headings', 'titles');
    return ctx.tokens.literal(title);
}

/** marked 0.3.2 heading ids, which old links may point at. */
const markedId = text => text.toLowerCase().replace(/[^\w]+/g, '-');

/**
 * Anchors. An explicit `<a id|name>` is kept only where a link in the set points at it; a fragment
 * that only matched the old renderer's generated heading id gets an explicit anchor on that
 * heading; any other fragment that matches nothing is reported.
 */
export function anchors(tree, ctx) {
    const referenced = ctx.anchorRefs.get(ctx.row.slug) ?? new Map();
    const explicit = new Set();
    // The id the site will give each heading (github-slugger over the heading text, in order).
    const ownIds = new Map();
    {
        const slugger = new GithubSlugger();
        visit(tree, 'heading', node => {
            if (node.depth > 1) ownIds.set(node, slugger.slug(toString(node).trim()));
        });
    }
    visitParents(tree, 'mdxJsxTextElement', (node, ancestors) => {
        if (node.name !== 'a' || getAttr(node, 'href') !== undefined) return;
        const id = getAttr(node, 'id') ?? getAttr(node, 'name');
        const parent = ancestors.at(-1);
        const heading = ancestors.findLast(a => a.type === 'heading');
        if (typeof id === 'string' && heading && ownIds.get(heading) === id && !node.children.length) {
            handled(ctx, 'headings', 'anchors removed (same as the heading\'s own id)');
            const index = parent.children.indexOf(node);
            parent.children.splice(index, 1);
            return index;
        }
        if (typeof id === 'string' && referenced.has(id)) {
            explicit.add(id);
            node.attributes = [attr('id', id)];
            handled(ctx, 'headings', 'anchors kept (linked)');
            return SKIP;
        }
        handled(ctx, 'headings', 'anchors removed (nothing links to them)');
        const index = parent.children.indexOf(node);
        parent.children.splice(index, 1, ...node.children);
        return index;
    });
    // Generated ids of the new site (github-slugger, as rehype-heading-anchors does).
    const slugger = new GithubSlugger();
    const headings = [];
    visit(tree, 'heading', node => {
        const text = toString(node).trim();
        headings.push({ node, id: node.depth > 1 ? slugger.slug(text) : null, old: markedId(text) });
    });
    const known = new Set([...explicit, ...headings.map(h => h.id).filter(Boolean)]);
    for (const [fragment, from] of referenced) {
        if (known.has(fragment)) continue;
        const heading = headings.find(h => h.old === fragment && h.node.depth > 1);
        if (heading) {
            heading.node.children.unshift({ type: 'mdxJsxTextElement', name: 'a', attributes: [attr('id', fragment)], children: [] });
            known.add(fragment);
            handled(ctx, 'headings', 'anchors added for old heading ids');
            continue;
        }
        undecided(ctx, 'headings', 'link to an anchor the topic does not have', `#${fragment} (from ${[...from].slice(0, 3).join(', ')})`, null);
    }
}

// ── code ────────────────────────────────────────────────────────────────────

const LANG_ALIASES = {
    javascript: 'js', javscript: 'js', jscript: 'js', JavaScript: 'js', Javascript: 'js', JS: 'js',
    'c#': 'csharp', cs: 'csharp', 'C#': 'csharp', HTML: 'html', htm: 'html', XML: 'xml', CSS: 'css',
    ts: 'typescript', TypeScript: 'typescript', VB: 'vb', 'vb.net': 'vb', shell: 'bash', sh: 'bash', cmd: 'bat',
    JSON: 'json', aspx: 'html', cshtml: 'razor', SQL: 'sql',
};
const KNOWN_LANGS = new Set(['js', 'csharp', 'html', 'xml', 'css', 'scss', 'typescript', 'vb', 'bash', 'json', 'razor', 'sql', 'bat', 'powershell', 'text', 'tsx', 'jsx', 'php', 'java', 'python', 'less']);
/** "In HTML:" style labels the topics put before a code block. */
const LABEL_LANGS = [
    [/^(java\s*script|javascript|jscript|js|jquery)$/i, 'js'],
    [/^(html|html5|html markup|markup)$/i, 'html'],
    [/^(razor|asp\.net mvc( view)?|mvc( view)?|asp\.net mvc helper|cshtml|aspx|asp\.net( mvc)?( razor)?( view)?)$/i, 'razor'],
    [/^(c#|csharp|c# code|asp\.net mvc controller|controller)$/i, 'csharp'],
    [/^(vb|vb\.net|visual basic)$/i, 'vb'],
    [/^css$/i, 'css'],
    [/^(typescript|ts)$/i, 'typescript'],
    [/^json$/i, 'json'],
    [/^xml$/i, 'xml'],
    [/^(sql|t-sql)$/i, 'sql'],
];

function labelLanguage(paragraph) {
    if (paragraph?.type !== 'paragraph') return null;
    const text = toString(paragraph).trim();
    const m = /^(?:in|code in|example in|code)\s+([^:]+?)\s*:?$/i.exec(text);
    if (!m) return null;
    for (const [re, lang] of LABEL_LANGS) if (re.test(m[1].trim())) return lang;
    return null;
}

/** Code blocks: fenced (the serializer writes every block fenced), language normalized or inferred by rule. */
export function code(tree, ctx) {
    visitParents(tree, 'code', (node, ancestors) => {
        const parent = ancestors.at(-1);
        handled(ctx, 'code', 'code blocks');
        // Hard tabs become spaces at tab stops of four (the site's lint forbids tabs; the code is
        // the same code).
        if (node.value.includes('\t')) {
            node.value = node.value.split('\n').map(line => {
                let out = '';
                for (const ch of line) out += ch === '\t' ? ' '.repeat(4 - (out.length % 4)) : ch;
                return out;
            }).join('\n');
            handled(ctx, 'code', 'code blocks with tabs expanded to spaces');
        }
        if (node.lang) {
            const mapped = LANG_ALIASES[node.lang] ?? LANG_ALIASES[node.lang.toLowerCase()] ?? node.lang;
            if (mapped !== node.lang) handled(ctx, 'code', `language ${node.lang} → ${mapped}`);
            node.lang = mapped;
            if (!KNOWN_LANGS.has(node.lang)) undecided(ctx, 'code', 'unknown language', node.lang, node);
            return;
        }
        const previous = parent.children[parent.children.indexOf(node) - 1];
        const fromLabel = labelLanguage(previous);
        if (fromLabel) {
            node.lang = fromLabel;
            handled(ctx, 'code', 'language from the "In …:" label');
            return;
        }
        const value = node.value.trimStart();
        let fromContent = null;
        if (/^(\$\(|\$\.ig\.|\$\.|var |let |const |function\b|\/\/ )/.test(value)) fromContent = 'js';
        else if (/^(@\(Html\.|@Html\.|@using |@model )/.test(value)) fromContent = 'razor';
        else if (/^(npm|npx|ig|bower|yarn|ng|jspm|git|cd|mkdir|dotnet) /.test(value)) fromContent = 'bash';
        else if (/^(Install-Package|Update-Package) /.test(value)) fromContent = 'powershell';
        else if (/^<\?xml /.test(value)) fromContent = 'xml';
        else if (/^<!DOCTYPE html/i.test(value)) fromContent = 'html';
        else {
            // Markup that opens with an HTML element is HTML.
            const tag = /^<([a-z][a-z0-9]*)[\s>/]/.exec(value)?.[1];
            if (tag && HTML_TAGS.has(tag)) fromContent = 'html';
        }
        if (fromContent) {
            node.lang = fromContent;
            handled(ctx, 'code', 'language from the first token');
            return;
        }
        undecided(ctx, 'code', 'no language', value.split('\n')[0].slice(0, 60), node);
    });
}

// ── links: classification ───────────────────────────────────────────────────

const OLD_API_ORIGIN = /^https?:\/\/(?:www\.|jp\.)?igniteui\.com\/help\/api\/[^/]+\/?/i;
const HELP_ORIGIN = /^https?:\/\/(?:www\.|jp\.|staging\.)?igniteui\.com\/help\//i;
const DOTNET_LINK = /^(?:[A-Za-z0-9_.]*\/)?(Infragistics[A-Za-z0-9_.]*~[^#]+)(?:\.html?)?(?:#.*)?$/;

export function classifyUrl(url) {
    if (url.startsWith('%%jQueryApiUrl%%')) return { kind: 'client-api', rest: url.slice('%%jQueryApiUrl%%'.length) };
    if (OLD_API_ORIGIN.test(url)) return { kind: 'client-api', rest: url.replace(OLD_API_ORIGIN, '/'), hardcoded: true };
    if (DOTNET_LINK.test(url) && url.includes('~')) return { kind: 'dotnet-api' };
    if (url.startsWith('%%HelpRootUrl%%')) return { kind: 'topic', rest: url.slice('%%HelpRootUrl%%'.length) };
    if (HELP_ORIGIN.test(url)) return { kind: 'topic', rest: url.replace(HELP_ORIGIN, ''), hardcoded: true };
    if (/^%%(SamplesUrl|SamplesEmbedUrl|NewSamplesUrl|DesignerUrl)%%/.test(url)) return { kind: 'samples' };
    if (url.startsWith('#')) return { kind: 'in-page', rest: url.slice(1) };
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) return { kind: 'external' };
    if (/\.(png|jpe?g|gif|svg)(#.*)?$/i.test(url)) return { kind: 'image-file' };
    if (/^(?:\.\.?\/)*[^/?]+?(?:\.html?)?(?:#.*)?$/i.test(url)) return { kind: 'topic', rest: url };
    return { kind: 'other' };
}

/** The topic a `Some-Topic.html#x` style link names, through the map. */
export function resolveTopic(map, rest) {
    const [pathPart, fragment = ''] = rest.split('#');
    const name = decodeURIComponent(pathPart).replace(/^(\.\.?\/)+/, '').replace(/\.html?$/i, '').replace(/\?.*$/, '').trim();
    if (!name) return { status: 'empty', fragment };
    const direct = map.bySlug.get(name.toLowerCase()) ?? map.bySlug.get(ruleSlug(`${name}.md`));
    if (direct) return { status: 'resolved', row: direct, fragment };
    return { status: 'missing', name, fragment };
}

/** Collects, over the whole set, which anchors of which topic are linked to. */
export function collectAnchorRefs(tree, row, map, refs) {
    const add = (slug, fragment, from) => {
        if (!fragment) return;
        if (!refs.has(slug)) refs.set(slug, new Map());
        const m = refs.get(slug);
        if (!m.has(fragment)) m.set(fragment, new Set());
        m.get(fragment).add(from);
    };
    const consider = url => {
        const c = classifyUrl(url);
        if (c.kind === 'in-page') add(row.slug, c.rest, row.slug);
        if (c.kind === 'topic') {
            const r = resolveTopic(map, c.rest);
            if (r.status === 'resolved') add(r.row.slug, r.fragment, row.slug);
        }
    };
    visit(tree, 'link', node => consider(node.url));
    visit(tree, 'html', node => {
        for (const m of node.value.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) consider(m[1]);
    });
}

// ── API links ───────────────────────────────────────────────────────────────

const CLIENT_UNRESOLVED_REASON = {
    'no-page': 'API page not in the index',
    'no-member': 'API member not in the index',
    'ambiguous-member': 'API member matches several paths',
};

/** Client and .NET API links become `ApiLink`, resolved through the merged index, or plain text. */
export function apiLinks(tree, ctx) {
    visitParents(tree, 'link', (node, ancestors) => {
        const parent = ancestors.at(-1);
        const c = classifyUrl(node.url);
        if (c.kind !== 'client-api' && c.kind !== 'dotnet-api') return;
        const label = toString(node).replace(/\s+/g, ' ').trim();
        let result;
        if (c.kind === 'client-api') {
            const [page, fragment] = c.rest.split('#');
            result = resolveClient(ctx.api, page, fragment);
            if (c.hardcoded) handled(ctx, 'apiLinks', 'client links with a hard-coded old API URL');
            if (result.status === 'root') {
                node.url = '%%jQueryApiUrl%%';
                handled(ctx, 'apiLinks', 'links to the API root (environment key)');
                return;
            }
        } else {
            result = resolveDotNet(ctx.api, node.url);
        }
        const step = 'apiLinks';
        const kindLabel = c.kind === 'client-api' ? 'client' : '.NET';
        if (result.status === 'resolved' || result.status === 'section') {
            const attributes = [attr('type', result.type)];
            if (result.member) attributes.push(attr('member', result.member));
            attributes.push(attr('pkg', result.pkg));
            if (label) attributes.push(attr('label', ctx.tokens.literal(label)));
            replaceNode(parent, node, { type: 'mdxJsxTextElement', name: 'ApiLink', attributes, children: [], position: node.position });
            handled(ctx, step, `${kindLabel} links resolved`);
            if (result.note) handled(ctx, step, `${kindLabel}: ${result.note}`);
            if (result.status === 'section') {
                handled(ctx, step, `${kindLabel}: section link, linked to the page`);
                undecided(ctx, step, 'section anchor dropped (the link component has no section form)', `${result.type}#${result.detail}`, node);
            }
            return SKIP;
        }
        const reason = c.kind === 'client-api'
            ? CLIENT_UNRESOLVED_REASON[result.status] ?? result.status
            : { 'no-package': 'assembly not in the index', namespace: 'namespace page (no equivalent)', 'no-type': 'type not in the index', 'no-member': 'member not in the index', 'ambiguous-type': 'type name not unique in its package', 'not-api': 'not an API link' }[result.status] ?? result.status;
        undecided(ctx, step, `${kindLabel}: ${reason}`, `${result.detail ?? ''} ← ${node.url}`, node);
        handled(ctx, step, `${kindLabel} links made plain text`);
        replaceNode(parent, node, node.children);
        return SKIP;
    });
}

// ── links between topics ────────────────────────────────────────────────────

/** Links to topics resolve through the map to `./<slug>.mdx`; links to topics that do not exist become text. */
export function topicLinks(tree, ctx) {
    visitParents(tree, 'link', (node, ancestors) => {
        const parent = ancestors.at(-1);
        const c = classifyUrl(node.url);
        if (c.kind === 'in-page') {
            handled(ctx, 'topicLinks', 'in-page links');
            return;
        }
        if (c.kind !== 'topic') return;
        const r = resolveTopic(ctx.map, c.rest);
        if (r.status === 'resolved' && !r.row.excluded) {
            node.url = `./${r.row.slug}.mdx${r.fragment ? `#${r.fragment}` : ''}`;
            handled(ctx, 'topicLinks', c.hardcoded ? 'links resolved (absolute help URL)' : 'links resolved');
            return;
        }
        const reason = r.status === 'resolved' ? 'links to a dropped topic (AngularJS)' : 'links to a topic that does not exist';
        undecided(ctx, 'topicLinks', reason, node.url, node);
        handled(ctx, 'topicLinks', 'links made plain text');
        replaceNode(parent, node, node.children);
        return SKIP;
    });
}

// ── samples ─────────────────────────────────────────────────────────────────

/**
 * Embedded samples (`<div class="embed-sample">[title](%%SamplesEmbedUrl%%/<path>)</div>`) become
 * `<Sample>` in its bare-iframe mode, which needs no code service. The iframe shows the page the
 * old help showed as the embed's Result tab: the sample's own `index.html` in the published help
 * samples, which `demosBaseUrl` points at (IgniteUI/help-samples on GitHub Pages, per volume and
 * language). Sample links keep pointing at the samples site through
 * `{environment:samplesBrowserUrl}` (the token step).
 */
export function samples(tree, ctx) {
    visitParents(tree, 'mdxJsxFlowElement', (node, ancestors) => {
        const cls = String(getAttr(node, 'class') ?? '');
        if (node.name !== 'div' || !cls.split(/\s+/).includes('embed-sample')) return;
        const parent = ancestors.at(-1);
        const links = [];
        visit(node, 'link', l => { links.push(l); });
        const link = links.length === 1 ? links[0] : null;
        const m = link && /^%%SamplesEmbedUrl%%\/?(.+?)\/?$/.exec(link.url);
        if (!m) {
            undecided(ctx, 'samples', 'embed-sample block of an unknown shape', toString(node).slice(0, 80), node);
            return;
        }
        const alt = ctx.tokens.literal(toString(link).trim());
        ctx.sampleEmbeds.push(m[1]);
        replaceNode(parent, node, {
            type: 'mdxJsxFlowElement', name: 'Sample', position: node.position, children: [],
            attributes: [attr('src', `/${m[1]}/index.html`), exprAttr('height', '500'), attr('alt', alt), attr('chrome', 'bare'), attr('fullscreenBtn', null)],
        });
        ctx.usesComponents.add('Sample');
        handled(ctx, 'samples', 'embedded samples → Sample');
        return SKIP;
    });
    visit(tree, 'link', node => {
        if (/^%%(SamplesUrl|NewSamplesUrl)%%/.test(node.url)) handled(ctx, 'samples', 'sample links (environment key)');
        else if (/^%%SamplesEmbedUrl%%/.test(node.url)) handled(ctx, 'samples', 'links to the help samples repository (environment key)');
    });
}

// ── images ──────────────────────────────────────────────────────────────────

/** Normalized folder for a source image: `02_Controls/igGrid/03_Features/x.png` → `Controls/igGrid/Features/x.png`. */
export function imageTarget(sourceRel) {
    const segments = sourceRel.split('/');
    const file = segments.pop();
    const folders = segments.filter(s => s !== 'images').map(s => s.replace(/^\d+_/, '').replace(/^~/, '').replace(/[ ()']/g, '-'));
    return [...folders, file].join('/');
}

export function buildImageIndex(topicsDir) {
    const byBase = new Map();
    const walk = (dir, rel) => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const abs = path.join(dir, e.name);
            const r = rel ? `${rel}/${e.name}` : e.name;
            if (e.isDirectory()) walk(abs, r);
            else if (/\.(png|jpe?g|gif|svg|bmp)$/i.test(e.name)) {
                const key = e.name.toLowerCase();
                if (!byBase.has(key)) byBase.set(key, []);
                byBase.get(key).push(r);
            }
        }
    };
    walk(topicsDir, '');
    return byBase;
}

function identifierFor(file, used) {
    let base = path.basename(file).replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    base = `img${base.charAt(0).toUpperCase()}${base.slice(1)}`;
    let name = base;
    for (let i = 2; used.has(name); i++) name = `${base}${i}`;
    used.add(name);
    return name;
}

/** Resolves an image reference of a topic to a real source file. */
export function resolveImage(ctx, src) {
    const clean = decodeURIComponent(src.split('#')[0].split('?')[0]);
    const topicDir = path.posix.dirname(ctx.row.source);
    const direct = path.posix.normalize(path.posix.join(topicDir, clean));
    if (fs.existsSync(path.join(ctx.topicsDir, direct))) return { status: 'resolved', file: direct };
    const candidates = ctx.imageIndex.get(path.posix.basename(clean).toLowerCase()) ?? [];
    if (candidates.length === 1) return { status: 'flattened', file: candidates[0] };
    if (candidates.length > 1) {
        // Nearest to the topic: the longest shared folder prefix.
        const score = c => { let i = 0; const a = c.split('/'); const b = topicDir.split('/'); while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };
        const sorted = [...candidates].sort((x, y) => score(y) - score(x));
        if (score(sorted[0]) > score(sorted[1])) return { status: 'flattened', file: sorted[0] };
        return { status: 'ambiguous', candidates };
    }
    return { status: 'missing' };
}

/** Images: resolved to real files, copied next to the topics, imported and rendered with `Image`. */
export function images(tree, ctx) {
    const used = new Set();
    const imports = new Map();
    const importFor = (file) => {
        if (imports.has(file)) return imports.get(file);
        const target = imageTarget(file);
        const id = identifierFor(target, used);
        imports.set(file, id);
        ctx.imageImports.push({ id, path: `./images/${target}` });
        ctx.imageCopies.push({ from: file, to: target });
        return id;
    };
    const convert = (node, parent, src, alt, title, extra) => {
        if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('data:')) {
            handled(ctx, 'images', 'external images (left as they are)');
            return;
        }
        const r = resolveImage(ctx, ctx.tokens.literal(src));
        if (r.status === 'missing' || r.status === 'ambiguous') {
            undecided(ctx, 'images', r.status === 'missing' ? 'image not found' : 'image name matches several files', src, node);
            handled(ctx, 'images', 'images dropped');
            replaceNode(parent, node, []);
            return;
        }
        if (r.status === 'flattened') handled(ctx, 'images', 'resolved only by file name (old tool flattened folders)');
        const id = importFor(r.file);
        const attributes = [exprAttr('src', id), attr('alt', ctx.tokens.literal(alt ?? ''))];
        if (title) attributes.push(attr('title', ctx.tokens.literal(title)));
        attributes.push(...extra);
        if (!alt) handled(ctx, 'images', 'images without alternative text');
        replaceNode(parent, node, { type: 'mdxJsxTextElement', name: 'Image', attributes, children: [], position: node.position });
        ctx.usesComponents.add('Image');
        handled(ctx, 'images', 'images');
    };
    visitParents(tree, 'image', (node, ancestors) => {
        convert(node, ancestors.at(-1), node.url, node.alt, node.title, []);
        return SKIP;
    });
    visitParents(tree, n => (n.type === 'mdxJsxTextElement' || n.type === 'mdxJsxFlowElement') && n.name === 'img', (node, ancestors) => {
        const src = getAttr(node, 'src');
        if (typeof src !== 'string') { undecided(ctx, 'images', 'img without src', null, node); return; }
        const extra = node.attributes.filter(a => !['src', 'alt', 'title'].includes(a.name));
        convert(node, ancestors.at(-1), src, getAttr(node, 'alt'), getAttr(node, 'title'), extra);
        return SKIP;
    });
    visit(tree, 'link', node => {
        if (classifyUrl(node.url).kind === 'image-file') undecided(ctx, 'images', 'link to an image file', node.url, node);
    });
}

// ── notes ───────────────────────────────────────────────────────────────────

/** Callout labels and how they map onto DocsAside (type, and an explicit title where it differs). */
const NOTE_LABELS = [
    [/^notes?$/i, 'note', null],
    [/^remarks?$/i, 'note', 'Remark'],
    [/^tip$/i, 'info', 'Tip'],
    [/^important$/i, 'warning', 'Important'],
    [/^(warning|caution)$/i, 'warning', null],
    [/^workaround$/i, 'note', 'Workaround'],
    [/^(注|注意|メモ|ヒント|重要)$/, 'note', 'jp'],
];

function noteLabel(paragraph) {
    const first = paragraph?.children?.[0];
    if (!first) return null;
    if ((first.type === 'strong' || first.type === 'emphasis')) {
        const text = toString(first).trim();
        const m = /^(.+?)\s*[:：]?$/.exec(text);
        const after = paragraph.children[1];
        // A label alone in its paragraph (`> **Workaround**` above the text) is a label too.
        if (m && !after) return { word: m[1], consume: 'strong' };
        if (m && (text.endsWith(':') || text.endsWith('：') || (after?.type === 'text' && /^\s*[:：]/.test(after.value)))) {
            return { word: m[1], consume: after?.type === 'text' && /^\s*[:：]/.test(after.value) ? 'strong+colon' : 'strong' };
        }
        return null;
    }
    if (first.type === 'text') {
        const m = /^\s*([A-Za-z]+|[^\s:：]{1,3})\s*[:：]\s*/.exec(first.value);
        if (m) return { word: m[1], consume: 'text', length: m[0].length };
    }
    return null;
}

/** `> **Note:** …` blockquotes become `DocsAside`; the label becomes its title. */
export function notes(tree, ctx) {
    visitParents(tree, 'blockquote', (node, ancestors) => {
        const parent = ancestors.at(-1);
        const firstPara = node.children[0];
        const label = noteLabel(firstPara);
        const match = label && NOTE_LABELS.find(([re]) => re.test(label.word));
        if (!match) {
            undecided(ctx, 'notes', 'blockquote without a callout label (left as a blockquote)', toString(node).slice(0, 60), node);
            return;
        }
        if (label.consume === 'text') {
            firstPara.children[0] = { ...firstPara.children[0], value: firstPara.children[0].value.slice(label.length) };
        } else {
            firstPara.children.shift();
            if (label.consume === 'strong+colon') firstPara.children[0].value = firstPara.children[0].value.replace(/^\s*[:：]\s*/, '');
        }
        const lead = firstPara.children[0];
        if (lead?.type === 'text') lead.value = lead.value.replace(/^\s+/, '');
        if (lead?.type === 'text' && !lead.value) firstPara.children.shift();
        if (firstPara.children.length === 0 || (firstPara.children.length === 1 && firstPara.children[0].type === 'break')) node.children.shift();
        const [, type, title] = match;
        const attributes = [attr('type', type)];
        if (title === 'jp') attributes.push(attr('title', label.word));
        else if (title) attributes.push(attr('title', label.word));
        replaceNode(parent, node, { type: 'mdxJsxFlowElement', name: 'DocsAside', attributes, children: node.children, position: node.position });
        ctx.usesComponents.add('DocsAside');
        handled(ctx, 'notes', `"${label.word}" → DocsAside ${type}`);
        return SKIP;
    });
    // Paragraph notes outside a blockquote are counted, not converted (a decision).
    visit(tree, 'paragraph', node => {
        const label = noteLabel(node);
        if (label && /^notes?$/i.test(label.word)) handled(ctx, 'notes', 'paragraph notes outside a blockquote (not converted)');
    });
}

// ── tokens ──────────────────────────────────────────────────────────────────

/** Every remaining token: text tokens literal, URL tokens as environment keys (literal in code). */
export function tokens(tree, ctx) {
    const t = ctx.tokens;
    const where = node => () => `${ctx.row.source}:${lineOf(node) ?? '?'}`;
    visit(tree, node => {
        if (node.type === 'text') node.value = t.inText(node.value, where(node));
        else if (node.type === 'inlineCode' || node.type === 'code') node.value = t.literal(node.value, where(node));
        else if (node.type === 'link') {
            node.url = t.inText(node.url, where(node));
            if (node.title) node.title = t.literal(node.title, where(node));
        } else if (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') {
            for (const a of node.attributes) {
                if (typeof a.value === 'string') a.value = ['href', 'src'].includes(a.name) ? t.inText(a.value, where(node)) : t.literal(a.value, where(node));
            }
        }
    });
    // An environment key written as text must survive MDX: the serializer escapes its braces.
}

// ── description ─────────────────────────────────────────────────────────────

const GENERIC_OPENING = /^(?:the following|this (?:example|topic|section)|in this example|below\b|here,)/i;
const TOPIC_SUBJECT = /^(?:this|the following) (?:topic|article|document|section|walkthrough|procedure|tutorial|guide|help topic|reference)s?\s+/i;

const plain = (ctx, node) => ctx.tokens.literal(toString(node)).replace(/[™®]/g, '').replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
/** Paragraphs that introduce something rather than say something. */
const isLeadIn = text => /:$/.test(text) || /\bfollowing (sections|topics)\b/i.test(text) || /^(in|code in)\b[^.]*$/i.test(text);

/** Sentences of a text, each with its closing punctuation. */
const sentencesOf = text => text.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/).map(s => s.trim()).filter(Boolean);

/**
 * `llms.description`, derived by rule from the topic's own first prose:
 * 1. the paragraphs of the "Purpose" section, or else the paragraphs after the title, without
 *    lead-ins (a paragraph ending with a colon, "contains the following sections", "In C#:");
 * 2. the first sentence, and the next ones until it reaches 40 characters, up to 300 characters
 *    (cut at a word, never with an ellipsis);
 * 3. a leading "This topic" or "The following topic" is dropped and the verb capitalized, because
 *    the site's check rejects page-oriented openings;
 * 4. still under 40 characters, or still opening with "The following" or "Below": the title is put
 *    in front (`<title>: <text>`).
 * Every result is marked generated in the front matter for review.
 */
export function describe(tree, ctx) {
    const kids = tree.children;
    let start = kids.findIndex(n => n.type === 'heading' && /^purpose$/i.test(toString(n).trim()));
    let source = 'purpose';
    if (start === -1) {
        start = kids.findIndex(n => n.type === 'heading' && n.depth === 1);
        source = 'first paragraph';
    }
    const candidates = [];
    for (let i = start + 1; i < kids.length && candidates.length < 3; i++) {
        const n = kids[i];
        if (n.type === 'heading' && source === 'purpose') break;
        if (n.type !== 'paragraph') continue;
        const text = plain(ctx, n);
        if (text.length < 15 || isLeadIn(text)) continue;
        candidates.push(text);
    }
    if (!candidates.length) {
        undecided(ctx, 'description', 'no prose to derive a description from', null, null);
        return null;
    }
    const rules = [source];
    let out = '';
    for (const s of candidates.flatMap(sentencesOf)) {
        if (out.length >= 40) break;
        const next = out ? `${out} ${s}` : s;
        if (out && next.length > 300) break;
        out = next;
    }
    if (TOPIC_SUBJECT.test(out)) {
        out = out.replace(TOPIC_SUBJECT, '');
        out = out.charAt(0).toUpperCase() + out.slice(1);
        rules.push('"This topic" dropped');
    }
    if (out.length < 40 || GENERIC_OPENING.test(out)) {
        out = `${ctx.titleText}: ${out}`;
        rules.push('title put in front');
    }
    if (out.length > 300) {
        out = out.slice(0, 300).replace(/\s+\S*$/, '').replace(/[,;:]$/, '');
        rules.push('shortened at a word');
    }
    out = out.replace(/[:;,]$/, '');
    if (!/[.!?)]$/.test(out)) out += '.';
    if (out.length < 40) undecided(ctx, 'description', 'derived description shorter than 40 characters', out, null);
    handled(ctx, 'description', `rule: ${rules.join(', ')}`);
    return out;
}

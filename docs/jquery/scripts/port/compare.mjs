#!/usr/bin/env node
/**
 * Structural comparison of converted topics, to find what a conversion lost or added:
 * - source Markdown (as the old renderer read it: Markdown plus the HTML inside it) against the
 *   output MDX: headings, links, images, code blocks, table rows, notes;
 * - optionally the live page (https://www.igniteui.com/help/<slug>, `#document-content`) against
 *   the built page (`dist/jquery/<slug>.html`, `<main>`), counted the same way.
 *
 *   node docs/jquery/scripts/port/compare.mjs --topics=<…>/topics --out=docs/jquery/src/content/en \
 *     --only=<source folders or files, comma-separated> [--dist=dist/jquery] [--live-cache=<dir>] [--json=<file>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import { visit } from 'unist-util-visit';
import { parseDocument, DomUtils } from 'htmlparser2';
import { normalizeSource, joinSplitHtmlBlocks, parseMarkdown, fixHeadingsWithoutSpace, inlineMarkdownInHtml } from './lib/parse.mjs';
import { ruleSlug } from './lib/topic-map.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    return [k, v.length ? v.join('=') : true];
}));
const topicsDir = path.resolve(args.topics);
const only = String(args.only).replace(/\\/g, '/');
const slugOverrides = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), 'slug-overrides.json'), 'utf8'));

const empty = () => ({ headings: 0, links: 0, apiLinks: 0, images: 0, codeBlocks: 0, tableRows: 0, notes: 0, samples: 0 });

/** Counts in HTML text (the raw HTML of a Markdown source, or a rendered page). */
function countHtml(html, counts, { rendered = false, slug = null } = {}) {
    const doc = parseDocument(html);
    const all = DomUtils.getElementsByTagName(() => true, doc, true);
    for (const el of all) {
        const name = el.name;
        if (/^h[1-6]$/.test(name)) counts.headings++;
        else if (name === 'a' && el.attribs.href && !el.attribs.href.startsWith('#') && !(slug && new RegExp('^(?:/help/)?' + slug + '#', 'i').test(el.attribs.href)) && !(el.attribs.class ?? '').includes('anchor')) {
            if (!rendered && /%%SamplesEmbedUrl%%/.test(el.attribs.href)) continue;
            if (/\/help\/api\/|\/api\/jquery|Infragistics\.Web|%%jQueryApiUrl%%/.test(el.attribs.href)) counts.apiLinks++;
            else counts.links++;
        } else if (name === 'img') counts.images++;
        else if (name === 'pre') counts.codeBlocks++;
        else if (name === 'tr') counts.tableRows++;
        else if (rendered && (el.attribs.class ?? '').split(/\s+/).includes('igd-aside')) counts.notes++;
        else if (rendered && name === 'iframe' && !/googletagmanager/.test(el.attribs.src ?? '')) counts.samples++;
        else if (!rendered && (el.attribs.class ?? '').split(/\s+/).includes('embed-sample')) counts.samples++;
    }
}

function noteLike(node) {
    const first = node.children?.[0]?.children?.[0];
    const text = first ? (first.value ?? first.children?.[0]?.value ?? '') : '';
    return /^\s*(note|notes|workaround|warning|important|tip)\b/i.test(text);
}

function countSource(file) {
    let text = normalizeSource(fs.readFileSync(file, 'utf8'));
    text = joinSplitHtmlBlocks(text).text;
    const tree = parseMarkdown(text);
    fixHeadingsWithoutSpace(tree);
    const c = empty();
    visit(tree, node => {
        if (node.type === 'heading') c.headings++;
        else if (node.type === 'link') {
            if (node.url.startsWith('#')) return;
            if (/%%jQueryApiUrl%%|Infragistics[\w.]*~|igniteui\.com\/help\/api\//.test(node.url)) c.apiLinks++;
            else c.links++;
        } else if (node.type === 'image') c.images++;
        else if (node.type === 'code') c.codeBlocks++;
        else if (node.type === 'tableRow') c.tableRows++;
        else if (node.type === 'blockquote' && noteLike(node)) c.notes++;
        else if (node.type === 'html') {
            // Until nothing changes: removing one comment can leave another one behind.
            let html = node.value;
            for (let before; before !== html;) {
                before = html;
                html = html.replace(/<!--[\s\S]*?-->/g, '');
            }
            // The Markdown written inside HTML blocks (links, images, code spans), rendered as the
            // old renderer rendered it: then a `<textarea>` written as code is not read as markup.
            countHtml(inlineMarkdownInHtml(html, { inlineRendered: 0 }), c);
        }
    });
    return c;
}

const mdx = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkFrontmatter, ['yaml']);
function countOutput(file) {
    const tree = mdx.parse(fs.readFileSync(file, 'utf8'));
    const c = empty();
    visit(tree, node => {
        if (node.type === 'heading') c.headings++;
        else if (node.type === 'link' && !node.url.startsWith('#')) c.links++;
        else if (node.type === 'code') c.codeBlocks++;
        else if (node.type === 'tableRow') c.tableRows++;
        else if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
            if (node.name === 'ApiLink') c.apiLinks++;
            else if (node.name === 'Image' || node.name === 'img') c.images++;
            else if (node.name === 'DocsAside') c.notes++;
            else if (node.name === 'Sample') c.samples++;
            else if (node.name === 'tr') c.tableRows++;
            else if (/^h[1-6]$/.test(node.name)) c.headings++;
            else if (node.name === 'a' && node.attributes.some(a => a.name === 'href')) c.links++;
        }
    });
    return c;
}

async function live(slug) {
    const cacheDir = args['live-cache'] ? path.resolve(args['live-cache']) : null;
    const cached = cacheDir && path.join(cacheDir, `${slug}.html`);
    if (cached && fs.existsSync(cached)) return fs.readFileSync(cached, 'utf8');
    const res = await fetch(`https://www.igniteui.com/help/${slug}`, { headers: { 'User-Agent': 'docs-port-compare/1.0' } });
    const html = await res.text();
    if (cached) { fs.mkdirSync(cacheDir, { recursive: true }); fs.writeFileSync(cached, html); }
    return html;
}

function region(html, test) {
    const doc = parseDocument(html);
    const el = DomUtils.findOne(test, doc.children, true);
    return el ? DomUtils.getOuterHTML(el) : '';
}

const rows = [];
const walk = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const r = `${rel}/${e.name}`;
        if (e.isDirectory() && e.name !== 'images') walk(path.join(dir, e.name), r);
        else if (e.isFile() && e.name.endsWith('.md')) rows.push(r.replace(/^\//, ''));
    }
};
for (const one of only.split(',').map(s => s.replace(/\/$/, ''))) {
    if (fs.statSync(path.join(topicsDir, one)).isFile()) rows.push(one);
    else walk(path.join(topicsDir, one), one);
}

const results = [];
for (const source of rows.sort()) {
    const slug = slugOverrides[source] ?? ruleSlug(path.basename(source));
    const out = path.join(path.resolve(args.out), `${slug}.mdx`);
    const result = { source, slug, source_: countSource(path.join(topicsDir, source)), output: fs.existsSync(out) ? countOutput(out) : null };
    if (args.dist) {
        const built = path.join(path.resolve(args.dist), `${slug}.html`);
        const liveHtml = region(await live(slug), el => el.attribs?.id === 'document-content');
        const builtHtml = fs.existsSync(built) ? region(fs.readFileSync(built, 'utf8'), el => el.name === 'main') : '';
        const l = empty(); countHtml(liveHtml, l, { rendered: true, slug });
        // The live site renders notes as blockquotes.
        l.notes = DomUtils.getElementsByTagName('blockquote', parseDocument(liveHtml), true).length;
        const b = empty(); countHtml(builtHtml, b, { rendered: true, slug });
        Object.assign(result, { live: l, built: b });
    }
    results.push(result);
}

const keys = Object.keys(empty());
const fmt = (c) => (c ? keys.map(k => c[k]).join(' / ') : '—');
console.log(`Counts: ${keys.join(' / ')}`);
for (const r of results) {
    console.log(`\n${r.slug}  (${r.source})`);
    console.log(`  source ${fmt(r.source_)}\n  output ${fmt(r.output)}`);
    if (r.live) console.log(`  live   ${fmt(r.live)}\n  built  ${fmt(r.built)}`);
    const diff = keys.filter(k => r.output && r.source_[k] !== r.output[k]);
    if (diff.length) console.log(`  source ≠ output: ${diff.map(k => `${k} ${r.source_[k]}→${r.output[k]}`).join(', ')}`);
    if (r.live) {
        const ld = keys.filter(k => r.live[k] !== r.built[k]);
        if (ld.length) console.log(`  live ≠ built: ${ld.map(k => `${k} ${r.live[k]}→${r.built[k]}`).join(', ')}`);
    }
}
if (args.json) fs.writeFileSync(path.resolve(args.json), `${JSON.stringify(results, null, 2)}\n`);

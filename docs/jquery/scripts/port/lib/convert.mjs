/**
 * One topic, source Markdown to MDX: parse, transform the tree, serialize, compile.
 */
import { unified } from 'unified';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import { compile } from '@mdx-js/mdx';
import { mdxToJs } from 'satteri';
import YAML from 'yaml';
import { visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import {
    normalizeSource, joinSplitHtmlBlocks, parseMarkdown, fixHeadingsWithoutSpace,
    escapeUnknownTags, inlineMarkdownInHtml, isKnownTag, tagNameOf, closeSelfClosedElements, markedStrong,
} from './parse.mjs';
import { createConverter } from './html.mjs';
import {
    readMetadataComment, takeTitle, anchors, code, apiLinks, topicLinks, samples, images, notes,
    tokens, describe, dropInTopicList,
} from './steps.mjs';
import { formatCode } from './format-code.mjs';

export const STEPS = ['parse', 'metadata', 'html', 'headings', 'code', 'apiLinks', 'topicLinks', 'samples', 'images', 'notes', 'tokens', 'description', 'gate'];

export function emptyReport() {
    const report = {};
    for (const step of STEPS) report[step] = { handled: {}, undecided: [] };
    Object.assign(report.html, { jsxElements: {}, tables: {}, droppedLinkAttributes: {}, comments: [], dropped: [], unknownTags: {} });
    Object.assign(report.parse, { inlineRendered: 0, inlineSkipped: 0 });
    return report;
}

const COMPONENT_IMPORTS = {
    ApiLink: "import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';",
    DocsAside: "import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';",
    Sample: "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';",
    Image: "import { Image } from 'astro:assets';",
};
const PHRASING_PARENTS = new Set(['paragraph', 'heading', 'emphasis', 'strong', 'delete', 'link', 'tableCell', 'linkReference']);

const serializer = unified()
    .use(remarkMdx)
    .use(remarkGfm)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkStringify, { bullet: '-', fences: true, rule: '-', emphasis: '*', strong: '*', listItemIndent: 'one', incrementListMarker: true });

function handled(report, step, what, n = 1) {
    report[step].handled[what] = (report[step].handled[what] ?? 0) + n;
}

/**
 * @param {string} raw the source file
 * @param {object} ctx { row, map, tokens, api, topicsDir, imageIndex, anchorRefs, report }
 */
export async function convertTopic(raw, ctx) {
    const { report } = ctx;
    const where = line => ({ topic: ctx.row.source, line });
    Object.assign(ctx, { usesComponents: new Set(), imageImports: [], imageCopies: [], sampleEmbeds: [] });

    // ── parse ──
    let text = normalizeSource(raw);
    if (raw.charCodeAt(0) === 0xfeff) handled(report, 'parse', 'byte-order marks removed');
    if (raw.includes('\r')) handled(report, 'parse', 'line endings normalized');
    const joined = joinSplitHtmlBlocks(text);
    text = joined.text;
    if (joined.joined.length) handled(report, 'parse', 'HTML blocks rejoined across blank lines', joined.joined.length);
    let tree = parseMarkdown(text);
    const metadata = readMetadataComment(tree, ctx);

    const lines = text.split('\n');
    visit(tree, 'code', node => {
        const first = lines[node.position.start.line - 1] ?? '';
        const fence = /^\s*(`{3,}|~{3,})/.exec(first);
        if (!fence) { handled(report, 'code', 'indented blocks made fenced'); return; }
        const last = lines[node.position.end.line - 1] ?? '';
        const closed = node.position.end.line > node.position.start.line && new RegExp(`^\\s*${fence[1][0]}{${fence[1].length},}\\s*$`).test(last);
        if (!closed) report.code.undecided.push({ ...where(node.position.start.line), reason: 'unclosed fence (runs to the end of its container)', detail: first.trim().slice(0, 40) });
    });

    const made = fixHeadingsWithoutSpace(tree);
    if (made.length) handled(report, 'headings', 'headings without a space after # made headings', made.length);
    const inTopic = dropInTopicList(tree);
    if (inTopic?.removed) handled(report, 'headings', '"In this topic" lists of the topic\'s own sections removed');
    if (inTopic?.emptied) handled(report, 'headings', 'headings removed that held only that list');
    if (inTopic?.kept) report.headings.undecided.push({ ...where(inTopic.kept.position?.start.line), reason: '"In this topic" section of another shape (kept)', detail: inTopic.why });
    const strong = markedStrong(tree);
    if (strong) handled(report, 'parse', 'strong spans closed before a letter (**Note:**Text)', strong);

    visitParents(tree, 'html', (node, ancestors) => {
        const parent = ancestors.at(-1);
        const inline = PHRASING_PARENTS.has(parent.type);
        // In a block, the inline Markdown first: a code span hides the tags written inside it.
        if (!inline) node.value = inlineMarkdownInHtml(node.value, report.parse);
        const selfClosed = [];
        node.value = closeSelfClosedElements(node.value, selfClosed);
        if (selfClosed.length) handled(report, 'html', 'self-closed non-void elements written as empty elements', selfClosed.length);
        if (inline) {
            const name = tagNameOf(node.value);
            if (name && !isKnownTag(name)) {
                report.html.unknownTags[name] = (report.html.unknownTags[name] ?? 0) + 1;
                const index = parent.children.indexOf(node);
                parent.children[index] = { type: 'text', value: node.value, position: node.position };
                return;
            }
            // A named anchor opened and never closed in its heading or paragraph (`### <a id="x">Title`)
            // is an empty anchor to its author; left open, the HTML parser wraps the rest of the page in it.
            if (name?.toLowerCase() === 'a' && /^<a\b/i.test(node.value) && !/\bhref\s*=/i.test(node.value)) {
                const rest = parent.children.slice(parent.children.indexOf(node) + 1);
                if (!rest.some(n => n.type === 'html' && /^<\/a\s*>/i.test(n.value))) {
                    node.value += '</a>';
                    handled(report, 'html', 'unclosed named anchors closed where they open');
                }
            }
            return;
        }
        const found = [];
        node.value = escapeUnknownTags(node.value, found);
        for (const name of found) report.html.unknownTags[name] = (report.html.unknownTags[name] ?? 0) + 1;
    });

    // ── HTML through the HTML parser, back to Markdown + JSX ──
    tree = createConverter(report.html).convert(tree);
    for (const comment of report.html.comments.splice(0)) {
        report.html.undecided.push({ ...where(null), reason: 'HTML comment removed', detail: comment });
    }
    for (const dropped of report.html.dropped.splice(0)) {
        report.html.undecided.push({ ...where(null), reason: `<${dropped.tag}> in the topic body removed`, detail: dropped.text });
    }

    // ── steps ──
    const title = takeTitle(tree, ctx);
    ctx.titleText = title;
    const description = describe(tree, ctx);
    apiLinks(tree, ctx);
    topicLinks(tree, ctx);
    samples(tree, ctx);
    images(tree, ctx);
    notes(tree, ctx);
    code(tree, ctx);
    await formatCode(tree, ctx);
    tokens(tree, ctx);
    anchors(tree, ctx);
    visit(tree, 'mdxJsxTextElement', node => { if (node.name === 'ApiLink') ctx.usesComponents.add('ApiLink'); });

    // ── front matter and imports ──
    const frontmatter = { title };
    if (metadata?.tags?.length) frontmatter.keywords = ctx.tokens.literal(metadata.tags.join(', '));
    if (description) {
        frontmatter.llms = { description };
        frontmatter.generated = ['llms.description'];
    }
    const yaml = YAML.stringify(frontmatter, { lineWidth: 0, defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN' }).trimEnd();
    const importLines = [
        ...['Image', 'ApiLink', 'DocsAside', 'Sample'].filter(c => ctx.usesComponents.has(c)).map(c => COMPONENT_IMPORTS[c]),
        ...ctx.imageImports.map(i => `import ${i.id} from '${i.path}';`),
    ];
    tree.children.unshift({ type: 'yaml', value: yaml }, ...(importLines.length ? [{ type: 'mdxjsEsm', value: importLines.join('\n') }] : []));

    const mdx = serializer.stringify(tree);
    return { mdx, title, description, metadata };
}

/** The gate: the output must compile with the reference MDX compiler and with the site's (Sätteri). */
export async function gate(mdx) {
    const errors = [];
    try {
        await compile(mdx, { remarkPlugins: [remarkGfm, remarkFrontmatter] });
    } catch (error) {
        errors.push({ compiler: '@mdx-js/mdx', message: String(error.reason ?? error.message).split('\n')[0], line: error.line ?? error.place?.line ?? null });
    }
    try {
        mdxToJs(mdx, { features: { gfm: true, frontmatter: true } });
    } catch (error) {
        errors.push({ compiler: 'satteri', message: String(error.message).split('\n')[0], line: null });
    }
    return errors;
}

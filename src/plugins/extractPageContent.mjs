/**
 * extractPageContent.mjs
 *
 * Converts a raw .md / .mdx document body into clean, LLM-friendly Markdown.
 * Extracts ONLY the meaningful textual content from the source file — all
 * decorative HTML (styling divs, image wrappers, spacers), MDX imports/exports,
 * and JSX expressions are stripped so the AI receives only prose, headings,
 * code blocks, tables, and lists.
 *
 * Three modes (one per per-page llms variant):
 *
 *   full  – pre-process (strip MDX + HTML) then remark round-trip stripping all
 *           HTML nodes. Keeps code blocks, tables, callouts intact.
 *           → llms-full.txt
 *
 *   clean – same as full. Normalises Markdown formatting via remark-stringify.
 *           → llms.txt  (default)
 *
 *   small – clean + additionally strips > [!NOTE/TIP/WARNING/…] callouts.
 *           → llms-small.txt
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { visit, SKIP } from 'unist-util-visit';

// ---------------------------------------------------------------------------
// Pre-processing (regex, runs before AST parsing)
// ---------------------------------------------------------------------------

/**
 * Strips non-content noise that is easy to handle with regex:
 *   - YAML frontmatter (safety net; normally absent from doc.body)
 *   - MDX import / export statements
 *   - HTML comments
 */
function preProcess(raw) {
  return raw
    .replace(/^---[\s\S]*?---\n?/m, '')   // YAML frontmatter
    .replace(/^(import|export)\s.+$/gm, '') // MDX imports/exports
    .replace(/<!--[\s\S]*?-->/g, '')        // HTML comments
    .trim();
}

// ---------------------------------------------------------------------------
// Post-processing (runs after remark-stringify)
// ---------------------------------------------------------------------------

// Matches inline HTML tags that survive as plain text after remark-stringify,
// e.g. `<img .../>`, `<br>`, `<span style="...">...</span>`.
const INLINE_HTML_RE = /<[^>]+>/g;

/**
 * Cleans up the stringified output:
 *   - Strips residual inline HTML tags (e.g. <img>, <br>, <span style="...">)
 *   - Trims trailing whitespace from each line
 *   - Collapses 3+ blank lines to a single blank line
 */
function postProcess(text) {
  return text
    .replace(INLINE_HTML_RE, '')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ---------------------------------------------------------------------------
// Remark plugins
// ---------------------------------------------------------------------------

/**
 * Removes AST nodes that produce no readable content:
 *   - MDX ESM blocks (import/export)
 *   - MDX expression nodes ({...})
 *   - MDX JSX flow elements (<Component .../>)
 *   - Raw HTML blocks (<div>, <img>, <span>, etc. at block level)
 *
 * Nodes that have readable text children (e.g. mdxJsxTextElement wrapping
 * plain text) are unwrapped rather than dropped.
 */
const NOISE_NODE_TYPES = new Set([
  'mdxjsEsm',          // import / export statements
  'mdxFlowExpression', // {expr} blocks
  'mdxTextExpression', // inline {expr}
  'mdxJsxFlowElement', // <Component> at block level
  'html',              // raw HTML blocks embedded in markdown
]);

function remarkStripNoise() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index == null) return;
      if (NOISE_NODE_TYPES.has(node.type)) {
        if (node.children?.length) {
          parent.children.splice(index, 1, ...node.children);
          return [SKIP, index];
        }
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}

/**
 * Additional minification (llms-small.txt only):
 * Strips > [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION], > [!IMPORTANT]
 * callout blockquotes (GitHub / docfx convention).
 */
const CALLOUT_RE = /^\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]/i;

function remarkMinifyCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!parent || index == null) return;
      const firstText = node.children?.[0]?.children?.[0]?.value ?? '';
      if (CALLOUT_RE.test(firstText.trim())) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}

// ---------------------------------------------------------------------------
// Processor instances — built once, reused across all pages
// ---------------------------------------------------------------------------

const STRINGIFY_OPTS = { bullet: '-', fences: true, listItemIndent: 'one' };

/** Used for both llms-full.txt and llms.txt */
const cleanProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStripNoise)
  .use(remarkStringify, STRINGIFY_OPTS);

/** Used for llms-small.txt */
const smallProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStripNoise)
  .use(remarkMinifyCallouts)
  .use(remarkStringify, STRINGIFY_OPTS);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns cleaned full-fidelity content (llms-full.txt).
 * Runs through the remark pipeline so HTML is stripped at the AST level.
 *
 * @param {string} rawBody
 * @returns {Promise<string>}
 */
export async function getRawContent(rawBody) {
  if (!rawBody?.trim()) return '';
  const vfile = await cleanProcessor.process(preProcess(rawBody));
  return postProcess(String(vfile));
}

/**
 * Extracts clean, LLM-ready Markdown from a doc body.
 *
 * @param {string} rawBody
 * @param {{ minify?: boolean }} [opts]
 *   minify: true  → also strip callout blockquotes  (llms-small.txt)
 *   minify: false → clean Markdown, all content kept (llms.txt)
 * @returns {Promise<string>}
 */
export async function extractPageContent(rawBody, { minify = false } = {}) {
  if (!rawBody?.trim()) return '';
  const proc = minify ? smallProcessor : cleanProcessor;
  const vfile = await proc.process(preProcess(rawBody));
  return postProcess(String(vfile));
}


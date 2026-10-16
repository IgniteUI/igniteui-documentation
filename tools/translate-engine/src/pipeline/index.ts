import matter from 'gray-matter';
import {
  quoteUnquotedBraceValues,
  stringifyFrontmatter,
  type FrontmatterStyle,
} from '../frontmatter.js';
import type { BodyMode, Translator } from '../types.js';
import { translateBody } from './body.js';
import {
  extractLeadingComponentBlockFrontmatters,
  translateComponentBlockTemplatedFile,
} from './component-block.js';
import { applyNode, collectNode } from './frontmatter-walk.js';
import type { PipelineOptions } from './options.js';
import { isHtmlBody, translateHtmlBody, translateMany } from './translate-text.js';

// Structure-preserving translation of one markdown/MDX file - the pipeline entry point.
// every project-specific decision (field contract, extra protected patterns, body
// mode) is injected via PipelineOptions. The stages themselves live in the
// sibling modules (protect, frontmatter-walk, translate-text, body,
// component-block).

export type { PipelineOptions } from './options.js';

export async function translateMarkdownFile(
  source: string,
  t: Translator,
  opts: PipelineOptions,
): Promise<string> {
  const normalized = quoteUnquotedBraceValues(source);
  const leading = extractLeadingComponentBlockFrontmatters(normalized);
  if (leading) return translateComponentBlockTemplatedFile(leading, t, opts);

  const { data, content: body } = matter(normalized);
  const frontmatter = data as Record<string, unknown>;

  // Frontmatter: collect every translatable string, batch-translate, reinsert
  // in the same order.
  const strings: string[] = [];
  const blocksList: Map<string, string>[] = [];
  collectNode(opts.contract, frontmatter, strings, blocksList, opts.protectPatterns ?? []);
  const translations = await translateMany(strings, t, opts.mem);
  const translatedFrontmatter = applyNode(
    opts.contract,
    frontmatter,
    translations,
    { i: 0 },
    blocksList,
  );

  // Body: mode decided per file - skip (verbatim), html (tag-split), markdown,
  // or auto (project hook first, then html sniffing).
  const mode: BodyMode = opts.bodyMode ?? 'auto';
  const skip = mode === 'skip' || (mode === 'auto' && opts.skipBodyWhen?.(frontmatter) === true);

  let translatedBody = body;
  if (!skip && body.trim()) {
    const asHtml = mode === 'html' || (mode === 'auto' && isHtmlBody(body));
    translatedBody = asHtml
      ? await translateHtmlBody(body, t, opts.mem)
      : await translateBody(
          body,
          t,
          opts.protectPatterns ?? [],
          opts.mem,
          opts.translatableAttributes,
        );
  }

  return stringifyDocument(translatedBody, translatedFrontmatter, opts.frontmatterStyle);
}

// gray-matter's own stringify() re-parses the body string for frontmatter
// delimiters it doesn't have, and its bundled YAML engine (js-yaml v3) folds
// long values into `>-` block scalars with no way to disable it cleanly. We
// only need gray-matter for PARSING; writing goes through our own serializer
// (src/frontmatter.ts, js-yaml v4) so line-folding and quote style are
// controllable, then we wrap it with the same delimiter conventions
// gray-matter itself would use.
function stringifyDocument(
  body: string,
  frontmatter: Record<string, unknown>,
  style?: FrontmatterStyle,
): string {
  const yamlText = stringifyFrontmatter(frontmatter, style).replace(/\n+$/, '');
  const bodyOut = body.endsWith('\n') ? body : `${body}\n`;
  return `---\n${yamlText}\n---\n${bodyOut}`;
}

import yaml from 'js-yaml';
import { stringifyFrontmatter } from '../frontmatter.js';
import type { BodyMode, Translator } from '../types.js';
import { translateBody } from './body.js';
import { applyNode, collectNode } from './frontmatter-walk.js';
import type { PipelineOptions } from './options.js';
import { translateHtmlBody, translateMany } from './translate-text.js';

// ComponentBlock-templated files (multiple concatenated frontmatter blocks)
// Some files (Angular docs' grids_templates/*.mdx, 35 of 41 files in that
// directory) concatenate MULTIPLE ENTIRE mini-documents in one physical file -
// one whole frontmatter block per platform, each wrapped in its own
// <ComponentBlock for="X">, stacked before a single SHARED body:
//   <ComponentBlock for="Grid">
//
//   ---
//   title: ...
//   ---
//
//   </ComponentBlock>
//   <ComponentBlock for="TreeGrid">
//   ...
//   </ComponentBlock>
//
//   import ...
//   # shared body content
// The file does NOT start with "---", so gray-matter finds NO frontmatter at
// all (data = {}) — title/description/keywords were never being translated
// for any of these files. Worse, everything after the FIRST "---" (including
// the SECOND platform's own "---" pair) gets fed to remark as body text,
// where a bare "---" is CommonMark thematic-break syntax — corrupting
// everything downstream (confirmed: fenced-code and link counts drifting
// with ZERO translation involved, same diagnostic used for the other
// structural fixes above). Detect and handle this shape as its own case
// BEFORE gray-matter/remark ever see it; any file that doesn't match this
// exact leading pattern falls through to the unchanged existing logic below.
const LEADING_COMPONENTBLOCK_FRONTMATTER_RE =
  /^<ComponentBlock for="([^"]+)">\r?\n(?:\r?\n)*---\r?\n([\s\S]*?)\r?\n---\r?\n(?:\r?\n)*<\/ComponentBlock>\r?\n/;

export function extractLeadingComponentBlockFrontmatters(
  raw: string,
): { blocks: Array<{ platform: string; yaml: string }>; rest: string } | null {
  const blocks: Array<{ platform: string; yaml: string }> = [];
  let remaining = raw;
  for (;;) {
    const m = remaining.match(LEADING_COMPONENTBLOCK_FRONTMATTER_RE);
    if (!m) break;
    blocks.push({ platform: m[1], yaml: m[2] });
    remaining = remaining.slice(m[0].length);
  }
  return blocks.length ? { blocks, rest: remaining } : null;
}

export async function translateComponentBlockTemplatedFile(
  leading: { blocks: Array<{ platform: string; yaml: string }>; rest: string },
  t: Translator,
  opts: PipelineOptions,
): Promise<string> {
  const translatedBlocks: string[] = [];
  for (const block of leading.blocks) {
    const frontmatter = (yaml.load(block.yaml) ?? {}) as Record<string, unknown>;
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
    const yamlText = stringifyFrontmatter(translatedFrontmatter, opts.frontmatterStyle).replace(
      /\n+$/,
      '',
    );
    translatedBlocks.push(
      `<ComponentBlock for="${block.platform}">\n\n---\n${yamlText}\n---\n\n</ComponentBlock>\n`,
    );
  }

  const body = leading.rest;
  // No 'auto' isHtmlBody sniffing here: this shared body ALWAYS starts with a
  // leading <ComponentBlock for="X"> wrapper (by construction — see the
  // leading-frontmatter-cluster shape this whole function exists to handle),
  // which would make the generic auto-detection misclassify an otherwise
  // ordinary MARKDOWN body (headings, prose, fenced code, occasional JSX) as
  // raw HTML needing the tag-split translator. That path has no concept of
  // markdown code fences, and worse, its long-value sanitizer strips a
  // fence's backtick markers as if the MODEL had accidentally added them —
  // confirmed as the actual cause of code-mismatch reports on this file
  // shape (fences disappearing, content surviving underneath). Bodies in
  // this shape are markdown by construction; only an explicit
  // bodyMode: 'html' should route through the HTML path.
  const mode: BodyMode = opts.bodyMode ?? 'auto';
  let translatedBody = body;
  if (body.trim()) {
    translatedBody =
      mode === 'html'
        ? await translateHtmlBody(body, t, opts.mem)
        : await translateBody(
            body,
            t,
            opts.protectPatterns ?? [],
            opts.mem,
            opts.translatableAttributes,
          );
  }
  const bodyOut = translatedBody.endsWith('\n') ? translatedBody : `${translatedBody}\n`;
  return translatedBlocks.join('') + bodyOut;
}

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import type { Root } from 'mdast';
import type { TranslationMemory, Translator } from '../types.js';
import {
  extractProtectedBlocks,
  protectAstNodes,
  protectFencedPlaceholderBlocks,
  restorePlaceholders,
  restoreProtectedBlocks,
  type AttributeTask,
} from './protect.js';
import { translateMany, translateProseWithTokenCheck } from './translate-text.js';

// Markdown body
// parse → protect → translate → restore, on an MDX-aware, GFM-aware remark AST.
//
// remark-mdx is what makes this four steps rather than a dozen. Parsed as plain
// CommonMark, MDX misparses in ways that each needed their own text-level
// repair BEFORE the parser ever ran: an `import` line filed as a paragraph (and
// then escaped and autolinked on the way out), a multi-line JSX opening tag
// whose lone `>` opened a blockquote, a bare tag absorbed into the adjacent
// block, `{Platform}` read as prose, `<a>text</a>` split into three siblings.
// Those repairs are gone. Under remark-mdx each of those constructs is a typed
// node with source offsets, so protectAstNodes masks it by NODE TYPE and
// restores it from the document's own bytes — which is both exact and, unlike a
// regex over raw text, incapable of matching a code SAMPLE that merely looks
// like markup.

export async function translateBody(
  body: string,
  t: Translator,
  protectPatterns: string[],
  mem?: TranslationMemory,
  translatableAttributes?: Record<string, string[]>,
): Promise<string> {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(body) as Root;

  const { placeholders, attributeTasks } = protectAstNodes(
    tree,
    body,
    translatableAttributes ?? {},
  );

  // Component attributes are translated straight from the attribute nodes, and
  // spliced back into the frozen source slice their element was masked to.
  await applyAttributeTranslations(attributeTasks, placeholders, t, protectPatterns, mem);

  const stringified = String(
    unified().use(remarkStringify, { bullet: '-' }).use(remarkGfm).use(remarkMdx).stringify(tree),
  );

  // Swallow whole fenced-code spans (fence + placeholder + fence, indentation
  // included) into one atomic token FIRST, so a list-nested code block's
  // indentation can never be reflowed by the model - see
  // protectFencedPlaceholderBlocks for why this is a separate pass from the
  // AST-level code protection above.
  const { replaced: fenceProtected, blocks: fenceBlocks } =
    protectFencedPlaceholderBlocks(stringified);

  // Project patterns (preserveNames, brand terms) are still text-level: they
  // match prose, which has no node type. Applied AFTER stringify so a
  // __MDX_N__ placeholder never goes back through remark, which would read the
  // double underscores as bold emphasis.
  const { replaced: bodyForTranslation, blocks: mdxBlocks } = extractProtectedBlocks(
    fenceProtected,
    protectPatterns,
  );

  // NOT memorized: this text carries per-document placeholder tokens, so
  // reusing it across pages would inject the wrong markup.
  const translatedProse = await translateProseWithTokenCheck(bodyForTranslation, t.one);

  const restoredBlocks = restoreProtectedBlocks(
    translatedProse,
    new Map([...fenceBlocks, ...mdxBlocks]),
  );
  return restorePlaceholders(restoredBlocks, placeholders);
}

/**
 * Translate the configured component attribute values and splice them back in.
 *
 * Some components carry ALL their user-facing text in attributes rather than
 * children — `<CtaArea title="…" description="…" label="…" />` is entirely
 * self-closing, and two whole marketing CTA sections once shipped in English on
 * every locale because the model literally never saw that text. There are no
 * children to expose, so the text has to be reached through the attributes
 * themselves.
 *
 * protectAstNodes located each one as a span inside the source slice its
 * element was masked to (see AttributeTask); this rewrites that stored slice.
 * Edits to the same slice are applied RIGHT TO LEFT so that replacing one
 * attribute cannot shift the offsets of the ones recorded before it.
 * protectPatterns still apply inside each value — `{Platform}` and friends must
 * survive — and `"` in a translation is escaped so it cannot terminate the
 * attribute it lives in.
 */
async function applyAttributeTranslations(
  tasks: AttributeTask[],
  placeholders: Map<string, string>,
  t: Translator,
  protectPatterns: string[],
  mem?: TranslationMemory,
): Promise<void> {
  if (tasks.length === 0) return;

  const masked = tasks.map((task) => extractProtectedBlocks(task.value, protectPatterns));
  const translations = await translateMany(
    masked.map((m) => m.replaced),
    t,
    mem,
  );

  const byKey = new Map<string, Array<{ task: AttributeTask; text: string }>>();
  tasks.forEach((task, i) => {
    const text = restoreProtectedBlocks(translations[i], masked[i].blocks).replace(/"/g, '&quot;');
    const edits = byKey.get(task.key) ?? [];
    edits.push({ task, text });
    byKey.set(task.key, edits);
  });

  for (const [key, edits] of byKey) {
    let slice = placeholders.get(key);
    if (slice === undefined) continue;
    for (const { task, text } of [...edits].sort((a, b) => b.task.start - a.task.start)) {
      slice = slice.slice(0, task.start) + `${task.name}="${text}"` + slice.slice(task.end);
    }
    placeholders.set(key, slice);
  }
}

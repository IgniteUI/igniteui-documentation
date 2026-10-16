import type { Root } from 'mdast';

// Masking and restore of non-prose constructs. Everything here turns a piece of
// markup into a __PREFIX_n__ token (or back), so the model never sees it.

// Custom-pattern extraction
// Runs AFTER remark stringify so the placeholder never goes back through remark
// (double-underscore patterns like __MDX_0__ would be parsed as bold).
//
// JSX is NOT handled here. Under remark-mdx every tag, `{expression}` and
// `import` is a typed AST node, so protectAstNodes masks them by node type
// before stringify - exact, and addressable by source position. What is left
// for this pass is what genuinely has no node type: project-supplied regexes
// (preserveNames, brand terms, `{environment:…}`) and the keyboard-key names
// below. It also still runs over FRONTMATTER strings, where there is no AST
// at all - which is why the `{Placeholder}` protectPattern is still earning
// its keep even though the body no longer needs it.

// Keyboard key names, for when a future author mentions one as plain prose
// instead of wrapping it in <kbd> (the wrapped case is handled separately -
// see the kbd entry in translateHtmlBody's skip-tag list). Deliberately only
// the names that have NO common alternate meaning in ordinary English prose:
// multi-word phrases ("Page Up", "Arrow Down") or abbreviations that are only
// ever used for the key ("Ctrl", "Esc"). Single ambiguous words are excluded
// on purpose — Tab/End/Home/Enter/Space/Delete/Shift/Alt/Escape/Insert all
// collide with everyday English (this exact docs corpus uses "Alt text" for
// images, "Enter your name" as an instruction, "the End of the chapter",
// etc.) and can only be safely identified by their <kbd> wrapping, which
// carries the disambiguating context a bare word match cannot.
const SAFE_KEY_NAMES = [
  'Page Up',
  'Page Down',
  'Arrow Up',
  'Arrow Down',
  'Arrow Left',
  'Arrow Right',
  'Caps Lock',
  'Num Lock',
  'Print Screen',
  'Scroll Lock',
  'Backspace',
  'Ctrl',
  'Cmd',
  'Esc',
];
const SAFE_KEY_NAME_RE = new RegExp(
  `\\b(${SAFE_KEY_NAMES.map((k) => k.replace(/ /g, '\\s+')).join('|')})\\b`,
  'gi',
);

export function extractProtectedBlocks(
  content: string,
  extraPatterns: string[] = [],
): { replaced: string; blocks: Map<string, string> } {
  const blocks = new Map<string, string>();
  let idx = 0;
  const mask = (match: string): string => {
    const key = `__MDX_${idx++}__`;
    blocks.set(key, match);
    return key;
  };
  let replaced = content;
  // 1. Project patterns (preserveNames, brand terms, `{environment:…}`).
  for (const src of extraPatterns) {
    replaced = replaced.replace(new RegExp(src, 'g'), mask);
  }
  // 2. Unambiguous keyboard key names appearing as plain text (see comment above).
  replaced = replaced.replace(SAFE_KEY_NAME_RE, mask);
  return { replaced, blocks };
}

// Fenced code block, atomic protection (indentation-safety)
// protectAstNodes already reduces a `code` node's CONTENT to one placeholder
// line (`__BLOCK_n__`), so remark-stringify re-serializes it as:
//   <indent>```lang
//   <indent>__BLOCK_n__
//   <indent>```
// For a code block that's a child of a list item, <indent> is non-empty (the
// list's content offset). That three-line span is still sent to the model as
// plain text alongside the surrounding prose — and LLMs routinely "clean up"
// perceived-inconsistent indentation, collapsing or shifting the fence lines
// independently of the placeholder line. The result: a fence and its content
// end up at DIFFERENT indentation levels, which breaks CommonMark's rule that
// a list-nested code block must align with the list item — the block silently
// pops out of the list on render.
//
// Fix: swallow the whole 3-line span (fence-open + placeholder + fence-close,
// indentation included) into a SINGLE opaque token before it ever reaches the
// model, exactly like a JSX component. There is then no multi-line whitespace
// left for the model to "fix".
// Matches the whole 3-line span (any leading whitespace on the open line,
// captured as group 1 and reused only to size the fence-length backreference
// via group 2 — the close line's indentation is intentionally NOT required to
// match exactly, since some serializers vary it slightly). Uses .replace()
// so the KEY substitutes exactly the matched text, INCLUDING its leading
// whitespace — unlike a manual line-rebuild, this can't double-apply indent,
// because nothing is left before the key for a later restore step to stack on.
const FENCED_PLACEHOLDER_RE =
  /^([ \t]*)(`{3,})[^\n]*\r?\n[ \t]*__BLOCK_\d+__[ \t]*\r?\n[ \t]*\2`*[ \t]*$/gm;

export function protectFencedPlaceholderBlocks(text: string): {
  replaced: string;
  blocks: Map<string, string>;
} {
  const blocks = new Map<string, string>();
  let idx = 0;
  const replaced = text.replace(FENCED_PLACEHOLDER_RE, (match) => {
    const key = `__FENCE_${idx++}__`;
    blocks.set(key, match);
    return key;
  });
  return { replaced, blocks };
}

// Restore masked blocks, INNERMOST LAST.
//
// Masks can nest: extractProtectedBlocks applies its rules in order, so a later
// rule can swallow text that an earlier rule already tokenized. Real example -
// `Badge` is a preserveNames entry (masked first, as __MDX_0__), and the MDX
// import rule then masks the whole line that now contains it:
//
//   import Badge from '…/Badge.astro';
//     -> import __MDX_0__ from '…/__MDX_1__.astro';    (preserveNames pass)
//     -> __MDX_2__                                      (import pass)
//
// Restoring in INSERTION order replaces __MDX_0__ while it is still buried
// inside __MDX_2__'s stored value, so the substitution finds nothing; expanding
// __MDX_2__ afterwards then re-exposes a token nothing will ever restore, and it
// ships as literal `__MDX_0__` text (a leftover-token validator error).
//
// Reverse order is correct in general, not just for this case: a mask can only
// contain tokens that already existed when it was created, so an OUTER mask is
// always created AFTER the inner ones it swallows. Walking newest-first
// therefore always expands the outer wrapper before the tokens it contains.
export function restoreProtectedBlocks(content: string, blocks: Map<string, string>): string {
  let result = content;
  for (const [key, value] of [...blocks].reverse()) {
    result = result.split(key).join(value);
  }
  return result;
}

// AST node protection
// Stores RAW values (no Markdown syntax wrapping) so restoration is a simple
// string replacement into the already-stringified output where remark has
// re-added the surrounding backticks / fences.
//
// There is no fenced-vs-indented reconciliation here any more. CommonMark has
// two syntaxes for a code block and collapses both to the same node, so the
// engine used to record which one the source had used and convert the output
// back. MDX has only one: indented code blocks are not part of the language,
// and four leading spaces are ordinary paragraph text (or a JSX element's
// layout). Nothing can produce an indented code node, so nothing needs
// restoring - and content this corpus had indented, which the old parser froze
// as an untranslatable code node, is now the prose the docs build always
// treated it as.

// The MDX constructs remark-mdx gives us as typed nodes, and how each is masked.
//
// Structural types are declared locally rather than imported from
// mdast-util-mdx-jsx: that package is only a transitive dependency of
// remark-mdx, and just these few fields are ever touched.
interface Offsets {
  position?: { start: { offset?: number }; end: { offset?: number } };
}
interface MdxAttribute extends Offsets {
  type: string;
  name?: string | null;
  value?: unknown;
}
interface AnyNode extends Offsets {
  type: string;
  name?: string | null;
  value?: string;
  url?: string;
  lang?: string | null;
  attributes?: MdxAttribute[];
  children?: AnyNode[];
}

const JSX_ELEMENT_TYPES = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement']);

// Node types with no translatable text of their own, whatever they contain:
// an ESM import block and an `{expression}` are code, not prose.
const OPAQUE_TYPES = new Set(['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression']);

// Elements masked WHOLE even when they have children, because those children
// are not prose. This is the same list translateHtmlBody has always skipped —
// the reasoning is unchanged, only the mechanism is. `kbd` matters most: its
// content is a literal key label (TAB, SHIFT), and translating it produced
// wrong results per file ("TAB" -> "PESTAÑA", the browser tab). Under the old
// CommonMark parser these arrived as raw `html` nodes and the skip list caught
// them there; under remark-mdx they are ordinary JSX elements whose children
// WOULD otherwise be recursed into, so the exemption has to be restated here.
const NEVER_RECURSE = new Set(['script', 'style', 'pre', 'code', 'svg', 'noscript', 'kbd']);

/**
 * One attribute value that must be translated inside an already-masked slice.
 *
 * The element itself is frozen as source bytes (see maskFromSource), so a
 * translated attribute cannot simply be assigned to the AST node — by the time
 * the model is called, that node is gone. Instead the attribute's span is
 * recorded RELATIVE to the start of the slice that swallowed it, and body.ts
 * splices the translation back into the stored slice once it has one.
 */
export interface AttributeTask {
  /** Placeholder whose stored value contains this attribute. */
  key: string;
  /** Attribute span (`alt="…"` inclusive), relative to that stored value. */
  start: number;
  end: number;
  name: string;
  value: string;
}

export interface ProtectResult {
  placeholders: Map<string, string>;
  attributeTasks: AttributeTask[];
}

const startOf = (n: Offsets): number | undefined => n.position?.start.offset;
const endOf = (n: Offsets): number | undefined => n.position?.end.offset;

/**
 * Mask every non-prose construct in the tree, leaving translatable text behind.
 *
 * Code, inline code and link/image URLs are masked by VALUE, exactly as before.
 * Everything MDX-specific is masked by SOURCE SLICE instead: the stored text is
 * the document's own bytes between the node's start and end offsets, so the
 * serializer never gets a chance to rewrite it. That is the single defence
 * against mdast-util-mdx-jsx re-quoting attributes or re-indenting a tag —
 * `<Sample src="…" height={510} alt="…" />` comes back exactly as authored
 * because it is never re-serialized at all, only substituted.
 *
 * JSX elements fall into two cases:
 *
 *   - No children (or in NEVER_RECURSE): masked whole, one token.
 *   - With children: the element is FLATTENED — open tag, children and close
 *     tag become siblings of whatever contained the element. The tags are
 *     masked from source; the children stay ordinary mdast and are translated
 *     like any other prose. Flattening is also what keeps a nested component's
 *     content at its authored indentation: mdast-util-mdx-jsx indents the
 *     children of a JSX element by two spaces per level, so a fenced code block
 *     inside <ComponentBlock><PlatformBlock> lands four spaces in, which
 *     CommonMark then reads as an indented code block. There is no option to
 *     turn that off; flattening removes the nesting it would indent.
 */
export function protectAstNodes(
  tree: Root,
  sourceText: string,
  translatableAttributes: Record<string, string[]> = {},
): ProtectResult {
  const placeholders = new Map<string, string>();
  const attributeTasks: AttributeTask[] = [];
  let blockIdx = 0;
  let jsxIdx = 0;
  let urlIdx = 0;

  const maskFromSource = (start: number, end: number): { node: AnyNode; key: string } => {
    const key = `__JSX_${jsxIdx++}__`;
    placeholders.set(key, sourceText.slice(start, end));
    return { node: { type: 'html', value: key }, key };
  };

  // Record the spans of the attributes this element wants translated, relative
  // to `sliceStart` — the offset the enclosing placeholder was cut from.
  const recordAttributes = (node: AnyNode, key: string, sliceStart: number): void => {
    const wanted = node.name ? translatableAttributes[node.name] : undefined;
    if (!wanted?.length) return;
    for (const attr of node.attributes ?? []) {
      if (attr.type !== 'mdxJsxAttribute' || !attr.name) continue;
      if (!wanted.includes(attr.name)) continue;
      // An expression value (`height={510}`) is code, not prose — skip it.
      if (typeof attr.value !== 'string') continue;
      const s = startOf(attr);
      const e = endOf(attr);
      if (s === undefined || e === undefined) continue;
      attributeTasks.push({
        key,
        start: s - sliceStart,
        end: e - sliceStart,
        name: attr.name,
        value: attr.value,
      });
    }
  };

  // An element with no children of its own, or one whose children are not
  // prose — either way it is masked as a single unit.
  const isOpaque = (n: AnyNode): boolean => {
    if (OPAQUE_TYPES.has(n.type)) return true;
    if (!JSX_ELEMENT_TYPES.has(n.type)) return false;
    if (n.name && NEVER_RECURSE.has(n.name)) return true;
    return !n.children?.length;
  };

  // Two opaque siblings belong to the SAME mask when nothing but a single line
  // break separates them in the source. The "API References" section of the
  // chart pages is ten consecutive `<ApiLink … /><br />` lines with no blank
  // line anywhere: masked one element at a time, each would come back as its
  // own block with a blank line after it, turning one list into twenty
  // paragraphs. Masking the whole run from source keeps the author's line
  // breaks byte-exact.
  const runsTogether = (prev: AnyNode, next: AnyNode): boolean => {
    const a = endOf(prev);
    const b = startOf(next);
    if (a === undefined || b === undefined || b < a) return false;
    return /^[^\S\r\n]*\r?\n?[^\S\r\n]*$/.test(sourceText.slice(a, b));
  };

  const walk = (parent: AnyNode): void => {
    const kids = parent.children;
    if (!Array.isArray(kids)) return;
    const out: AnyNode[] = [];

    for (let i = 0; i < kids.length; i++) {
      const node = kids[i];
      const start = startOf(node);

      if (isOpaque(node) && start !== undefined) {
        // Extend to the longest run of adjacent opaque siblings.
        let j = i;
        while (j + 1 < kids.length && isOpaque(kids[j + 1]) && runsTogether(kids[j], kids[j + 1])) {
          j++;
        }
        const end = endOf(kids[j]);
        if (end !== undefined) {
          const { node: placeholder, key } = maskFromSource(start, end);
          for (let k = i; k <= j; k++) recordAttributes(kids[k], key, start);
          out.push(placeholder);
          i = j;
          continue;
        }
      }

      if (JSX_ELEMENT_TYPES.has(node.type)) {
        const children = node.children ?? [];
        const first = children[0];
        const last = children[children.length - 1];
        const elEnd = endOf(node);
        const innerStart = first ? startOf(first) : undefined;
        const innerEnd = last ? endOf(last) : undefined;
        if (
          start !== undefined &&
          elEnd !== undefined &&
          innerStart !== undefined &&
          innerEnd !== undefined
        ) {
          // Only whitespace can sit between the open tag and the first child,
          // so trimming the slice is exact — and it keeps trailing blank lines
          // out of a value restorePlaceholders would otherwise re-indent.
          const openKey = `__JSX_${jsxIdx++}__`;
          placeholders.set(openKey, sourceText.slice(start, innerStart).trimEnd());
          recordAttributes(node, openKey, start);
          out.push({ type: 'html', value: openKey });

          walk(node);
          out.push(...(node.children ?? []));

          const closeKey = `__JSX_${jsxIdx++}__`;
          placeholders.set(closeKey, sourceText.slice(innerEnd, elEnd).trimStart());
          out.push({ type: 'html', value: closeKey });
          continue;
        }
        // No usable position info: leave the element alone rather than risk
        // cutting the wrong bytes. The serializer will re-emit it as JSX.
      }

      if (node.type === 'code') {
        const key = `__BLOCK_${blockIdx++}__`;
        placeholders.set(key, node.value ?? '');
        node.value = key; // lang is kept so the fence language survives
      } else if (node.type === 'inlineCode') {
        const key = `__BLOCK_${blockIdx++}__`;
        placeholders.set(key, node.value ?? '');
        node.value = key;
      } else if (node.type === 'image' || node.type === 'link') {
        const key = `__URL_${urlIdx++}__`;
        placeholders.set(key, node.url ?? '');
        node.url = key;
      }

      walk(node);
      out.push(node);
    }

    parent.children = out;
  };

  walk(tree as unknown as AnyNode);

  return { placeholders, attributeTasks };
}

// A code node's stored value is the DEDENTED raw text (remark strips a list
// item's own indentation while parsing), with none of that indent baked back
// in. When the value is single-line, splicing it in at the token's position
// is enough — whatever preceded the token on that line is untouched either
// way. When the value spans multiple lines (a multi-line code block nested in
// a list item or blockquote), only line 1 inherits the token's preceding
// indent for free; every later line of the raw value would land at column 0,
// breaking alignment with the fence. Reapply the same preceding whitespace to
// every line of a multi-line value so the whole block stays uniformly
// indented, matching what the source document actually had.
export function restorePlaceholders(content: string, placeholders: Map<string, string>): string {
  let result = content;
  // Sort by key length descending to avoid partial-key collision
  const sorted = [...placeholders.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [key, value] of sorted) {
    if (!value.includes('\n')) {
      result = result.split(key).join(value);
      continue;
    }
    result = result.replace(
      new RegExp(`([ \\t]*)${key}`, 'g'),
      (_match, indent: string) => indent + value.split('\n').join(`\n${indent}`),
    );
  }
  return result;
}

import { orderedBlockToken, pipelineToken } from '../tokens.js';
import type { TranslationMemory, Translator } from '../types.js';
import { sanitizeFrontmatterValue } from './frontmatter-walk.js';

// The text-translation layer: dedup + batch + retry + token-integrity checks,
// and the raw-HTML tag-split translator.
//
// Component ATTRIBUTE translation used to live here as a regex over raw body
// text, because a CommonMark parser has no concept of a JSX attribute. It is
// now driven by the attribute nodes themselves - see applyAttributeTranslations
// in body.ts.

// A string that comes back empty or byte-identical to the source is almost
// always the model echoing the input — retry once before giving up.
export async function withRetryIfUnchanged(
  text: string,
  one: (t: string) => Promise<string>,
): Promise<string> {
  const r = await one(text);
  if (r.trim() && r.trim() !== text.trim()) return r;
  const r2 = await one(text);
  if (r2.trim() && r2.trim() !== text.trim()) return r2;
  return r.trim() ? r : text;
}

// Every __BLOCK_n__/__URL_n__/__MDX_n__/__FENCE_n__ token present in the input
// MUST reappear in the output — restoreProtectedBlocks/restorePlaceholders is a
// pure string substitution with no way to reconstruct content for a token the
// model silently dropped from its response. That's a DIFFERENT failure from a
// leftover (unrestored) token: nothing literal survives to grep for, the
// restored file just has a hole where that token's content (a whole code
// block, or a ComponentBlock/PlatformBlock wrapper — itself often containing
// several more tags) should be — observed in production as validator
// tag-mismatch/code-mismatch counts with no other symptom. Matters most for
// translateBody's single large completion: a token-dense page (dozens of
// masked JSX wrappers) is the one call in the whole pipeline with no
// per-item structure (unlike the JSON-batched frontmatter path) and the
// most opportunities for the model to drop exactly one token mid-response.
function extractTokens(text: string): Set<string> {
  return new Set(text.match(pipelineToken()) ?? []);
}

export async function translateProseWithTokenCheck(
  text: string,
  one: (t: string) => Promise<string>,
): Promise<string> {
  const expected = extractTokens(text);
  const missingCount = (out: string): number => {
    let n = 0;
    for (const tok of expected) if (!out.includes(tok)) n++;
    return n;
  };
  let out = await withRetryIfUnchanged(text, one);
  if (missingCount(out) > 0) {
    const retry = await one(text);
    if (missingCount(retry) < missingCount(out)) out = retry;
  }
  return realignBlockTokenOrder(text, out);
}

// __BLOCK_n__/__FENCE_n__ each stand for a whole, distinct code block and must
// stay in the SAME RELATIVE ORDER as the source — but an LLM asked to
// translate a token-dense page doesn't reliably follow that instruction (see
// the reorder-prohibition rule in prompt.ts): it can swap two of these tokens
// while still emitting every one of them exactly once, which the
// missing-token retry above can't see (nothing is missing) and which restores
// as "same code block count, wrong content at position N" — the exact
// code-mismatch symptom seen in production even with the prompt rule and the
// retry both in place. Since restoreProtectedBlocks is a pure positional
// string substitution, this is fixable deterministically instead of hoping a
// retry does better: relabel every BLOCK/FENCE-shaped token in the output, in
// the order it appears, to whatever token occupies that same position in the
// input. Only applied when the counts match exactly — a genuine drop or
// duplicate (caught separately above) leaves the positions unaligned, and
// this bails out untouched rather than guessing.
function realignBlockTokenOrder(input: string, output: string): string {
  const wanted = input.match(orderedBlockToken()) ?? [];
  let i = 0;
  let overflowed = false;
  const fixed = output.replace(orderedBlockToken(), () => {
    if (i >= wanted.length) {
      overflowed = true;
      return '';
    }
    return wanted[i++];
  });
  return !overflowed && i === wanted.length ? fixed : output;
}

// A string that is ONLY a clock time / range ("8:30 – 9:15 AM"). Passing these
// through the model at all makes AM/PM markers drift between batch chunks —
// skip the model entirely so every time is identical, in every locale.
function isTimeOnly(s: string): boolean {
  if (!/\d{1,2}:\d{2}/.test(s)) return false;
  const residue = s
    .replace(/\d{1,2}:\d{2}/g, '')
    .replace(/\b[ap]\.?\s*m\.?\b/gi, '')
    .replace(/[\s\d.,:;–—-]/g, '');
  return residue.length === 0;
}

// A value this large is never put in a JSON batch - a giant item next to small
// ones makes the model duplicate or misassign keys. Translate it solo.
const SOLO_MIN_CHARS = 1200;

export async function translateMany(
  strings: string[],
  t: Translator,
  mem?: TranslationMemory,
): Promise<string[]> {
  if (strings.length === 0) return [];
  // Dedupe identical sources: translate once, reuse - guarantees consistency
  // (a phrase in a TOC link and a heading gets the same translation).
  const unique: string[] = [];
  const indexOf = new Map<string, number>();
  for (const s of strings) {
    if (!indexOf.has(s)) {
      indexOf.set(s, unique.length);
      unique.push(s);
    }
  }
  const uniqueOut: string[] = Array.from({ length: unique.length }, () => '');
  const batchIdx: number[] = [];
  for (let i = 0; i < unique.length; i++) {
    const src = unique[i];
    const remembered = mem?.get(src);
    if (isTimeOnly(src)) {
      uniqueOut[i] = src;
    } else if (remembered != null) {
      uniqueOut[i] = remembered;
    } else if (isHtmlBody(src)) {
      uniqueOut[i] = await translateHtmlBody(src, t, mem);
      mem?.set(src, uniqueOut[i]);
    } else if (src.length > SOLO_MIN_CHARS) {
      uniqueOut[i] = sanitizeFrontmatterValue(await withRetryIfUnchanged(src, t.one));
      mem?.set(src, uniqueOut[i]);
    } else {
      batchIdx.push(i);
    }
  }
  const batch = await t.many(batchIdx.map((i) => unique[i]));
  for (let k = 0; k < batchIdx.length; k++) {
    const i = batchIdx[k];
    const src = unique[i];
    const v = batch[k];
    const usable = v != null && v.trim() !== '' && v.trim() !== src.trim();
    uniqueOut[i] = sanitizeFrontmatterValue(
      usable ? (v as string) : await withRetryIfUnchanged(src, t.one),
    );
    mem?.set(src, uniqueOut[i]);
  }
  return strings.map((s) => uniqueOut[indexOf.get(s) as number]);
}

// Raw-HTML translation (tag-split)
// Translate ONLY the text between tags. Every tag — attributes, ids, hrefs,
// self-closing slashes — passes through byte-for-byte; the model never sees a
// tag, so it cannot rebalance structure or invent attributes. Text inside
// script/style/pre/code/svg is left untouched.

export function isHtmlBody(body: string): boolean {
  return /^\s*<(?:[a-zA-Z]+|!--)/.test(body);
}

export async function translateHtmlBody(
  html: string,
  t: Translator,
  mem?: TranslationMemory,
): Promise<string> {
  const parts = html.split(/(<[^>]+>)/); // odd indices are tags/comments — kept verbatim
  const slots: number[] = [];
  const texts: string[] = [];
  let inSkip = false;
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    if (seg.startsWith('<')) {
      // kbd's content is a literal keyboard key label (TAB, SHIFT, ENTER…), not
      // prose — translating it produces inconsistent, sometimes-wrong per-file
      // results (e.g. "TAB" → "PESTAÑA", which means browser/folder tab, not
      // the key) since the model has no way to tell a <kbd> key name from
      // ordinary text. Same treatment as code: never touch its content.
      const m = seg.match(/^<\s*(\/?)\s*(script|style|pre|code|svg|noscript|kbd)\b/i);
      if (m) inSkip = !m[1];
      continue;
    }
    if (inSkip) continue;
    if (!/[A-Za-z]/.test(seg)) continue; // whitespace / entities / punctuation only
    slots.push(i);
    texts.push(seg);
  }
  if (texts.length === 0) return html;
  const translated = await translateMany(texts, t, mem);
  slots.forEach((p, k) => {
    const orig = parts[p];
    const lead = orig.match(/^\s*/)?.[0] ?? '';
    const trail = orig.match(/\s*$/)?.[0] ?? '';
    parts[p] = lead + translated[k].trim() + trail;
  });
  return parts.join('');
}

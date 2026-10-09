import { isPlainObject, isTranslatableValue, type FieldContract } from '../types.js';
import { extractProtectedBlocks, restoreProtectedBlocks } from './protect.js';

// Frontmatter collect/apply walk + scalar sanitizer. collectNode and applyNode
// walk the parsed frontmatter in IDENTICAL order with the SAME predicate, so
// the i-th collected string maps back to the i-th translated slot.

// LLMs sometimes decorate a short scalar - wrap it in a ```fence```, add a "# "
// heading marker, or a "Here is the translation:" preamble. Strip those from
// scalar values. The body is NOT sanitized (it legitimately contains headings).
export function sanitizeFrontmatterValue(value: string): string {
  let v = value.trim();
  const fence = v.match(/^```[a-zA-Z0-9]*\n?([\s\S]*?)\n?```$/);
  if (fence) v = fence[1].trim();
  v = v.replace(/^(?:here(?:'s| is)\b[^\n:]*:|translat(?:ion|ed[^\n:]*)\s*:)\s*/i, '').trim();
  v = v.replace(/^#{1,6}\s+/, '');
  return v.trim();
}

// collect and apply walk the frontmatter in IDENTICAL order with the SAME
// predicate, so the i-th collected string maps to the i-th translated slot.
// Frontmatter strings go through the SAME protectPatterns masking as the body
// (extractProtectedBlocks/restoreProtectedBlocks, already used for {environment:*}
// and {Platform}/{ProductName}-style tokens there) — a title/description/keywords
// value containing one of these is otherwise sent to the model as plain text,
// relying on instruction-following alone instead of the deterministic mask+restore
// every other protected construct gets.
export function collectNode(
  contract: FieldContract,
  obj: Record<string, unknown>,
  acc: string[],
  blocksList: Map<string, string>[],
  protectPatterns: string[],
): void {
  for (const [key, value] of Object.entries(obj))
    collectValue(contract, key, value, acc, blocksList, protectPatterns);
}
function collectValue(
  contract: FieldContract,
  key: string,
  value: unknown,
  acc: string[],
  blocksList: Map<string, string>[],
  protectPatterns: string[],
): void {
  if (typeof value === 'string') {
    if (value.trim() && isTranslatableValue(contract, key, value)) {
      const { replaced, blocks } = extractProtectedBlocks(value, protectPatterns);
      acc.push(replaced);
      blocksList.push(blocks);
    }
  } else if (Array.isArray(value)) {
    for (const el of value) {
      if (typeof el === 'string') {
        if (el.trim() && isTranslatableValue(contract, key, el)) {
          const { replaced, blocks } = extractProtectedBlocks(el, protectPatterns);
          acc.push(replaced);
          blocksList.push(blocks);
        }
      } else if (isPlainObject(el)) collectNode(contract, el, acc, blocksList, protectPatterns);
    }
  } else if (isPlainObject(value)) collectNode(contract, value, acc, blocksList, protectPatterns);
}

export function applyNode(
  contract: FieldContract,
  obj: Record<string, unknown>,
  t: string[],
  cur: { i: number },
  blocksList: Map<string, string>[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj))
    out[key] = applyValue(contract, key, value, t, cur, blocksList);
  return out;
}
function applyValue(
  contract: FieldContract,
  key: string,
  value: unknown,
  t: string[],
  cur: { i: number },
  blocksList: Map<string, string>[],
): unknown {
  if (typeof value === 'string') {
    if (!value.trim() || !isTranslatableValue(contract, key, value)) return value;
    const translated = t[cur.i];
    const blocks = blocksList[cur.i];
    cur.i++;
    return restoreProtectedBlocks(translated, blocks);
  }
  if (Array.isArray(value)) {
    return value.map((el) => {
      if (typeof el === 'string') {
        if (!el.trim() || !isTranslatableValue(contract, key, el)) return el;
        const translated = t[cur.i];
        const blocks = blocksList[cur.i];
        cur.i++;
        return restoreProtectedBlocks(translated, blocks);
      }
      if (isPlainObject(el)) return applyNode(contract, el, t, cur, blocksList);
      return el;
    });
  }
  if (isPlainObject(value)) return applyNode(contract, value, t, cur, blocksList);
  return value; // numbers, booleans, null, Date, etc.
}

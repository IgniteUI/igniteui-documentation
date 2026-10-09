import matter from 'gray-matter';
import { diffArrays } from 'diff';
import { quoteUnquotedBraceValues, stringifyFrontmatter } from './frontmatter.js';
import type { FrontmatterStyle } from './frontmatter.js';
import { isPlainObject, isTranslatableValue, type FieldContract } from './types.js';

// Incremental "sync": update an existing translation IN PLACE, re-translating only
// the blocks that changed between two versions of the English source and leaving
// everything else (already-translated, possibly human) untouched. A 3-way merge
// of EN-old (git base) + EN-new (current) + TARGET-old (existing translation).
//
// The safety invariant: the target is assumed structurally parallel to EN-old
// (block i of the target is the translation of block i of EN-old - true when the
// target came from structure-preserving translation). If that doesn't hold, we
// ABORT rather than risk splicing a translation into the wrong place.

// Split a markdown body into top-level blocks separated by blank lines, keeping
// fenced code blocks intact (a blank line INSIDE a ``` fence does not split it).
// Blocks are trimmed of surrounding blank lines; empty blocks are dropped.
export function splitBlocks(body: string): string[] {
  const lines = body.split('\n');
  const blocks: string[] = [];
  let cur: string[] = [];
  let inFence = false;
  const flush = () => {
    const text = cur.join('\n').replace(/^\n+|\n+$/g, '');
    if (text.trim() !== '') blocks.push(text);
    cur = [];
  };
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      cur.push(line);
      continue;
    }
    if (!inFence && line.trim() === '') {
      flush();
      continue;
    }
    cur.push(line);
  }
  flush();
  return blocks;
}

/** Splice the body: keep the target's block for every unchanged EN block, and
 *  translate only the changed/added ones. Aborts (structurally unsafe) when the
 *  EN-old body and the target body don't have the same block count. */
export async function spliceBody(
  enOldBody: string,
  enNewBody: string,
  targetBody: string,
  translateBlock: (block: string) => Promise<string>,
): Promise<{ body: string; translated: number; kept: number } | { aborted: string }> {
  const oldBlocks = splitBlocks(enOldBody);
  const newBlocks = splitBlocks(enNewBody);
  const targetBlocks = splitBlocks(targetBody);

  if (oldBlocks.length !== targetBlocks.length) {
    return {
      aborted: `EN@base has ${oldBlocks.length} body blocks but the target has ${targetBlocks.length} - structures diverged, not safe to splice. Re-translate this file in full, or fix it by hand.`,
    };
  }

  // Walk the block-level diff of EN-old → EN-new. `targetBlocks[oldIdx]` is the
  // existing translation of old block oldIdx (the target is parallel to EN-old),
  // so each diff run maps cleanly:
  //   unchanged → reuse the target's translation      (advances through EN-old)
  //   removed   → skip it (that block/translation is gone; advances EN-old)
  //   added     → translate the new block             (no EN-old counterpart)
  const out: string[] = [];
  let translated = 0;
  let kept = 0;
  let oldIdx = 0;
  for (const run of diffArrays(oldBlocks, newBlocks)) {
    if (run.added) {
      for (const block of run.value) {
        out.push(await translateBlock(block));
        translated++;
      }
    } else if (run.removed) {
      oldIdx += run.value.length;
    } else {
      for (let k = 0; k < run.value.length; k++) {
        out.push(targetBlocks[oldIdx++]);
        kept++;
      }
    }
  }
  return { body: out.join('\n\n'), translated, kept };
}

// Field-level frontmatter merge: for each value, keep the target's value when the
// EN value is unchanged from base; otherwise translate the new EN value (if the
// contract says it's translatable) or copy it verbatim (locked fields follow the
// source). Recurses into nested objects and arrays.
async function mergeValue(
  contract: FieldContract,
  key: string,
  newV: unknown,
  oldV: unknown,
  tgtV: unknown,
  translateValue: (value: string) => Promise<string>,
): Promise<unknown> {
  if (typeof newV === 'string') {
    if (typeof oldV === 'string' && newV === oldV && typeof tgtV === 'string') return tgtV;
    if (newV.trim() && isTranslatableValue(contract, key, newV)) return await translateValue(newV);
    return newV;
  }
  if (Array.isArray(newV)) {
    const oldArr = Array.isArray(oldV) ? oldV : [];
    const tgtArr = Array.isArray(tgtV) ? tgtV : [];
    const out: unknown[] = [];
    for (let i = 0; i < newV.length; i++) {
      out.push(await mergeValue(contract, key, newV[i], oldArr[i], tgtArr[i], translateValue));
    }
    return out;
  }
  if (isPlainObject(newV)) {
    const oldObj = isPlainObject(oldV) ? oldV : {};
    const tgtObj = isPlainObject(tgtV) ? tgtV : {};
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(newV)) {
      out[k] = await mergeValue(contract, k, v, oldObj[k], tgtObj[k], translateValue);
    }
    return out;
  }
  return newV; // numbers, booleans, null, Date, …
}

export interface SyncOptions {
  contract: FieldContract;
  frontmatterStyle?: FrontmatterStyle;
  /** Translate one changed/added body block (protect → translate → restore). */
  translateBlock: (block: string) => Promise<string>;
  /** Translate one changed frontmatter scalar. */
  translateValue: (value: string) => Promise<string>;
}

/** 3-way sync of one document. Returns the merged output, or an abort reason when
 *  the body structures diverged (never risks a mis-spliced translation). */
export async function syncDocument(
  enOldRaw: string,
  enNewRaw: string,
  targetRaw: string,
  opts: SyncOptions,
): Promise<{ output: string; translatedBlocks: number; keptBlocks: number } | { aborted: string }> {
  const enOld = matter(quoteUnquotedBraceValues(enOldRaw));
  const enNew = matter(quoteUnquotedBraceValues(enNewRaw));
  const tgt = matter(quoteUnquotedBraceValues(targetRaw));

  const spliced = await spliceBody(enOld.content, enNew.content, tgt.content, opts.translateBlock);
  if ('aborted' in spliced) return spliced;

  const mergedData = (await mergeValue(
    opts.contract,
    '',
    enNew.data as Record<string, unknown>,
    enOld.data as Record<string, unknown>,
    tgt.data as Record<string, unknown>,
    opts.translateValue,
  )) as Record<string, unknown>;

  const yamlText = stringifyFrontmatter(mergedData, opts.frontmatterStyle).replace(/\n+$/, '');
  const bodyOut = spliced.body.endsWith('\n') ? spliced.body : `${spliced.body}\n`;
  return {
    output: `---\n${yamlText}\n---\n\n${bodyOut}`,
    translatedBlocks: spliced.translated,
    keptBlocks: spliced.kept,
  };
}

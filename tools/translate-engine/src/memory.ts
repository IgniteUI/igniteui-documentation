import { promises as fs } from 'node:fs';
import path from 'node:path';
import { anyToken } from './tokens.js';
import type { TranslationMemory } from './types.js';

// Per-locale translation memory, stored as sorted JSON under the project's
// dataDir so it's version-controlled and diffs stay reviewable in PRs.
// TM is for repeated SHORT strings (headings, CTAs, card titles) - giant blocks
// rarely recur and just bloat the file.

const TM_MAX_LEN = 1000;

const tmFile = (dataDir: string, code: string): string => path.join(dataDir, 'tm', `${code}.json`);

// TM is a cache of clean, repeatable PROSE (headings text, labels, CTAs) - it
// must never hold structural markup, which is per-document/context-specific and
// belongs to the pipeline, not the memory. A segment "carries markup" when it
// contains any of:
//   • a pipeline placeholder token  (__MDX_n__ / __BLOCK_n__ / …) - per-document
//     masking noise, only reusable by coincidence of identical token layout;
//   • a {Placeholder} template token ({Platform}, {ComponentTitle},
//     {environment:*}) - a build-time value, not translatable prose;
//   • a leading Markdown block marker (## heading, - list, > quote) - a sign the
//     segment leaked in raw from the HTML tag-split path instead of being parsed
//     structurally (the model often strips it, so key and value disagree).
// These slip past a plain token check, which is why "## Additional Resources"
// and "{Platform} … Cell Merging Example" were still showing up in the TM.
function carriesMarkup(s: string): boolean {
  return (
    anyToken().test(s) ||
    /\{[A-Za-z][^}]*\}/.test(s) ||
    /(^|\n)[ \t]{0,3}(?:#{1,6}\s|[-*+]\s|>\s)/.test(s)
  );
}

// The single rule for "is this a valid TM entry" - clean, short, an actual
// translation, and markup-free. Applied on BOTH write (memoryFor.set) and read
// (loadTM), so a stale/polluted file SELF-HEALS: invalid entries are dropped
// when the file is loaded, and the next saveTM writes it clean. No manual edit.
export function isCacheable(src: string, target: string): boolean {
  if (!src || !target || target === src || src.length > TM_MAX_LEN) return false;
  if (carriesMarkup(src) || carriesMarkup(target)) return false;
  return true;
}

export async function loadTM(dataDir: string, code: string): Promise<Map<string, string>> {
  try {
    const obj = JSON.parse(await fs.readFile(tmFile(dataDir, code), 'utf-8')) as Record<
      string,
      string
    >;
    const map = new Map<string, string>();
    for (const [k, v] of Object.entries(obj)) {
      const src = k.trim();
      const target = (v ?? '').trim();
      if (isCacheable(src, target)) map.set(src, target);
    }
    return map;
  } catch {
    return new Map();
  }
}

export async function saveTM(
  dataDir: string,
  code: string,
  map: Map<string, string>,
): Promise<void> {
  await fs.mkdir(path.join(dataDir, 'tm'), { recursive: true });
  const obj: Record<string, string> = {};
  for (const k of [...map.keys()].sort()) obj[k] = map.get(k)!;
  await fs.writeFile(tmFile(dataDir, code), JSON.stringify(obj, null, 2) + '\n', 'utf-8');
}

// Wrap a TM map as the memory the pipeline consumes. `set` is the auto-capture
// guard: stores only clean, short, actually-translated segments.
export function memoryFor(map: Map<string, string>): TranslationMemory {
  return {
    // Trimmed on both sides of the read/write so "same sentence, different
    // surrounding whitespace" collapses into ONE entry instead of two near-
    // duplicate keys - a real defect observed in production TM data (the
    // reveal-astro-tools reference this was ported from has the exact same
    // paragraph stored twice, once with trailing whitespace, both mapping to
    // the identical translation).
    get: (s) => map.get(s.trim()),
    set: (s, t) => {
      const src = s.trim();
      const target = (t ?? '').trim();
      if (isCacheable(src, target)) map.set(src, target);
    },
  };
}

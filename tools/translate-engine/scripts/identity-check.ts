#!/usr/bin/env tsx
// Identity round-trip audit — find ENGINE defects without calling a model.
//
//   npx tsx scripts/identity-check.ts --config configs/<project>.config.mjs
//
// Runs every source file through the real pipeline with a translator that
// returns each string byte-identical. Anything that differs between input and
// output was produced by the engine alone: no model, no API key, no spend.
//
// This is the cheapest defect-finding tool in the toolkit, and it earns its
// keep. Three separate corruptions on the Bulgarian pilot looked like model
// failures for days - collapsed multi-line JSX inside code fences, whole FAQ
// sections shipping untranslated, and placeholders destroyed in frontmatter.
// All three reproduced here in seconds, identically, with no model in the loop,
// which is what proved they were ours to fix. Run it against a new corpus
// BEFORE spending anything on a translation pass.
//
// Exit code 0 = clean, 2 = defects found (so CI can gate on it).
import { promises as fs } from 'node:fs';
import { loadConfig } from '../src/config.js';
import { discover } from '../src/discover.js';
import { pipelineOptionsFrom } from '../src/cli-support.js';
import { translateMarkdownFile } from '../src/pipeline/index.js';
import type { Translator } from '../src/types.js';

// Returns every string exactly as given - the whole point of the exercise.
const identity: Translator = {
  one: async (text: string) => text,
  many: async (texts: string[]) => texts,
};

const CODE_FENCE = /^[ \t]*(?:>\s*)?(`{3,})[^\n]*\n([\s\S]*?)\n[ \t]*(?:>\s*)?\1`*\s*$/gm;
const IMPORT_LINE = /^import\s[^\n]*$/gm;

const fences = (s: string): string[] => [...s.matchAll(CODE_FENCE)].map((m) => m[2]);
const imports = (s: string): string[] => s.match(IMPORT_LINE) ?? [];

function argOf(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const configPath = argOf('--config');
if (!configPath) {
  console.error('usage: tsx scripts/identity-check.ts --config <path> [--locale <code>]');
  process.exit(1);
}

const cfg = await loadConfig(configPath);
const target = cfg.targets.find((t) => t.code === argOf('--locale')) ?? cfg.targets[0];
// discover() yields one entry per (file, locale) pair; the engine behaviour
// under test is locale-independent, so collapse to one entry per source file.
const all = await discover(cfg, [target.code]);
const files = [...new Map(all.map((f) => [f.relPath, f])).values()];
const opts = pipelineOptionsFrom(cfg);

console.log(`identity round-trip: ${files.length} file(s), contract of "${cfg.name}"\n`);

let defective = 0;
for (const f of files) {
  const src = await fs.readFile(f.sourceAbs, 'utf-8');
  const problems: string[] = [];
  let out: string;
  try {
    out = await translateMarkdownFile(src, identity, opts);
  } catch (err) {
    console.log(`  x ${f.relPath}\n      pipeline threw: ${(err as Error).message}`);
    defective++;
    continue;
  }

  // Code fences must survive byte-for-byte. Report EVERY differing block —
  // stopping at the first hides whether a fix was complete.
  const a = fences(src);
  const b = fences(out);
  if (a.length !== b.length) {
    problems.push(`fenced block count ${a.length} -> ${b.length}`);
  } else {
    const differing = a.map((x, i) => (x === b[i] ? 0 : i + 1)).filter(Boolean);
    if (differing.length) problems.push(`code block(s) rewritten: #${differing.join(', #')}`);
  }

  // Every protectPatterns construct must come back with the same count. With an
  // identity translator a shortfall CANNOT be a model dropping a token, so it
  // is always the engine destroying one (e.g. YAML eating `[{Token}]`).
  for (const pattern of cfg.declaredProtectPatterns ?? []) {
    let re: RegExp;
    try {
      re = new RegExp(pattern, 'g');
    } catch {
      continue;
    }
    const enN = (src.match(re) ?? []).length;
    if (!enN) continue;
    const trN = (out.match(new RegExp(pattern, 'g')) ?? []).length;
    if (trN !== enN) problems.push(`/${pattern}/ ${enN} -> ${trN}`);
  }

  const ia = imports(src);
  const ib = imports(out);
  if (ia.join('\n') !== ib.join('\n'))
    problems.push(`import lines changed (${ia.length} -> ${ib.length})`);

  // Prose that came back as a code node is the FAQ defect: content the
  // translator was never asked to touch, because remark saw indented text.
  const proseAsCode = b.filter((v) => !a.includes(v) && /[a-z]{3,}\s+[a-z]{3,}.*[.!?]$/i.test(v));
  if (proseAsCode.length) {
    problems.push(`${proseAsCode.length} prose block(s) parsed as code (would ship untranslated)`);
  }

  if (problems.length) {
    defective++;
    console.log(`  x ${f.relPath}`);
    for (const p of problems) console.log(`      ${p}`);
  }
}

console.log(
  `\n${defective === 0 ? 'clean' : `${defective} of ${files.length} file(s) corrupted by the engine`}` +
    ` — locale "${target.code}" contract, no model involved`,
);
process.exit(defective === 0 ? 0 : 2);

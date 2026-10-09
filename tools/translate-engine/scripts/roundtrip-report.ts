#!/usr/bin/env tsx
// Round-trip diff report — everything the engine changes with NO model in the loop.
//
//   npx tsx scripts/roundtrip-report.ts --config configs/jp-mockup.config.mjs
//
// identity-check.ts is the pass/fail gate: it asserts a fixed set of invariants
// (fence content, protectPattern counts, import lines, prose-parsed-as-code) and
// says nothing about anything else. That is the right shape for CI, but it means
// a change can be clean there and still move a lot of bytes.
//
// This writes the rest of the picture to reports/roundtrip-<project>.md: every
// non-blank line that differs between a source file and its identity round-trip,
// grouped by file. Blank-line placement is excluded deliberately — remark
// normalizes it on every round trip, always has, and it is not a defect.
//
// Use it when reviewing a change to the parser or the masking rules, where the
// question is not "did the gate pass" but "what exactly moved, and is each one
// something I meant?".
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { diffLines } from 'diff';
import { loadConfig } from '../src/config.js';
import { discover } from '../src/discover.js';
import { pipelineOptionsFrom } from '../src/cli-support.js';
import { translateMarkdownFile } from '../src/pipeline/index.js';
import type { Translator } from '../src/types.js';

const identity: Translator = {
  one: async (text: string) => text,
  many: async (texts: string[]) => texts,
};

function argOf(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const configPath = argOf('--config');
if (!configPath) {
  console.error('usage: tsx scripts/roundtrip-report.ts --config <path> [--locale <code>]');
  process.exit(1);
}

/** Blank lines carry no meaning across a remark round trip — compare content only. */
const contentLines = (s: string): string =>
  s
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .filter((l) => l !== '')
    .join('\n') + '\n';

const cfg = await loadConfig(configPath);
const target = cfg.targets.find((t) => t.code === argOf('--locale')) ?? cfg.targets[0];
const all = await discover(cfg, [target.code]);
const files = [...new Map(all.map((f) => [f.relPath, f])).values()];
const opts = pipelineOptionsFrom(cfg);

const out: string[] = [
  `# Identity round-trip diff — ${cfg.name}`,
  '',
  `${files.length} source file(s), no model involved. Blank-line placement is excluded.`,
  '',
];
let changed = 0;
let totalAdded = 0;
let totalRemoved = 0;

for (const f of files) {
  const src = await fs.readFile(f.sourceAbs, 'utf-8');
  let result: string;
  try {
    result = await translateMarkdownFile(src, identity, opts);
  } catch (err) {
    out.push(`## ${f.relPath}`, '', `**pipeline threw:** ${(err as Error).message}`, '');
    changed++;
    continue;
  }
  const a = contentLines(src);
  const b = contentLines(result);
  if (a === b) continue;

  changed++;
  const hunks: string[] = [];
  for (const part of diffLines(a, b)) {
    if (!part.added && !part.removed) continue;
    const lines = part.value.split('\n').filter(Boolean);
    if (part.added) totalAdded += lines.length;
    else totalRemoved += lines.length;
    for (const l of lines) hunks.push(`${part.added ? '+' : '-'} ${l}`);
  }
  out.push(`## ${f.relPath}`, '', '```diff', ...hunks, '```', '');
}

out.splice(
  3,
  0,
  changed === 0
    ? '**Byte-identical on every file.**'
    : `**${changed} of ${files.length} file(s) differ** — ${totalRemoved} line(s) removed, ${totalAdded} added.`,
  '',
);

const dir = path.join(process.cwd(), 'reports');
await fs.mkdir(dir, { recursive: true });
const dest = path.join(dir, `roundtrip-${cfg.name}.md`);
await fs.writeFile(dest, out.join('\n'), 'utf-8');
console.log(
  `${changed} of ${files.length} file(s) differ (-${totalRemoved}/+${totalAdded} lines) -> ${path.relative(process.cwd(), dest)}`,
);

#!/usr/bin/env tsx
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

// Standalone, config-free cost estimator. Walks a single file OR a folder
// (any depth of subfolders) of text/markdown content and estimates the USD
// cost of translating it with a given model - a plain chars/4 token
// heuristic, no API calls, no real tokenizer, no dependency on the rest of
// this repo. Point it at ANY folder, not just this project's content.
//
//   npx tsx scripts/estimate-cost.ts --path <file-or-folder> --model gpt-5.5
//   npx tsx scripts/estimate-cost.ts --path ./docs/es --model claude-sonnet-5 --list

// USD per 1,000,000 tokens. Add a model here, or bypass this table entirely
// with --rate-input/--rate-output. Keep this in sync with each vendor's own
// pricing page when it changes - this is a snapshot, not a live feed.
const MODEL_RATES: Record<string, { input: number; output: number }> = {
  'gpt-5.5': { input: 5.0, output: 30.0 },
  'gpt-4.1': { input: 2.0, output: 8.0 },
  'claude-haiku-4-5': { input: 1.0, output: 5.0 },
  'claude-sonnet-5': { input: 2.0, output: 10.0 }, // 3/15 is Sonnet 4.6, not 5
  'claude-opus-4-8': { input: 15.0, output: 75.0 },
  'gemini-3.5-flash': { input: 1.5, output: 9.0 },
  'gemini-3.1-pro': { input: 2.0, output: 12.0 },
  'gemini-2.5-flash-lite': { input: 0.1, output: 0.4 },
};

const DEFAULT_EXTENSIONS = ['.md', '.mdx'];

// OpenAI's own stated rule of thumb for English text ("~4 chars per token")
// close enough across providers for an estimate, not a real tokenizer.
// Measured against the Claude tokenizer on this MDX corpus it UNDER-counts by
// ~1.7x (column-pinning.mdx: 9,875 estimated vs 16,973 counted) - code, JSX
// and punctuation tokenize far worse than prose. Scale accordingly.
const CHARS_PER_TOKEN = 4;

interface FileStat {
  file: string;
  chars: number;
  words: number;
  tokens: number;
}

function estimateTokens(chars: number): number {
  return Math.ceil(chars / CHARS_PER_TOKEN);
}

// Accepts a single file OR a directory - recurses into subfolders at any
// depth, filtering by extension. No glob syntax needed: everything under the
// given path that matches an extension is included.
async function collectFiles(target: string, extensions: Set<string>): Promise<string[]> {
  const st = await fs.stat(target);
  if (st.isFile()) return [target];

  const out: string[] = [];
  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
        out.push(full);
      }
    }
  }
  await walk(target);
  return out.sort();
}

async function statFile(file: string): Promise<FileStat> {
  const content = await fs.readFile(file, 'utf-8');
  const chars = content.length;
  const words = content.split(/\s+/).filter(Boolean).length;
  return { file, chars, words, tokens: estimateTokens(chars) };
}

function formatUsd(n: number): string {
  return n > 0 && n < 0.01 ? '<$0.01' : `$${n.toFixed(2)}`;
}

const HELP = `estimate-cost - standalone translation-cost estimator (no API calls)

Usage:
  npx tsx scripts/estimate-cost.ts --path <file-or-folder> --model <name> [options]

Options:
  --path <p>            Required. A single file OR a folder, walked
                         recursively through every level of subfolders.
  --model <name>         A key from the model list below.
  --rate-input <n>       USD per 1M input tokens — overrides/bypasses --model.
  --rate-output <n>      USD per 1M output tokens — overrides/bypasses --model.
  --ext <.md,.mdx>       Comma-separated extensions to include (default: .md,.mdx).
  --output-ratio <n>     Estimated output tokens as a fraction of input tokens
                         (default 0.8). Raise it for languages that expand the
                         text (e.g. 1.15 for prose-heavy German/Spanish),
                         lower it for ones that compress (CJK).
  --list                 Print every file's own estimate, not just the total.
  --help                 Show this help.

Known models (USD per 1M tokens, input/output):
${Object.entries(MODEL_RATES)
  .map(([k, v]) => `  ${k.padEnd(24)} $${v.input}/1M in, $${v.output}/1M out`)
  .join('\n')}
`;

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: {
      path: { type: 'string' },
      model: { type: 'string' },
      ext: { type: 'string' },
      'output-ratio': { type: 'string' },
      'rate-input': { type: 'string' },
      'rate-output': { type: 'string' },
      list: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });

  if (values.help || !values.path) {
    console.log(HELP);
    return values.help ? 0 : 1;
  }

  let rateInput: number;
  let rateOutput: number;
  if (values['rate-input'] && values['rate-output']) {
    rateInput = Number(values['rate-input']);
    rateOutput = Number(values['rate-output']);
  } else if (values.model && MODEL_RATES[values.model]) {
    rateInput = MODEL_RATES[values.model].input;
    rateOutput = MODEL_RATES[values.model].output;
  } else {
    console.error(
      `error: unknown model "${values.model ?? '(none given)'}" — pass --model <${Object.keys(MODEL_RATES).join('|')}> ` +
        `or supply --rate-input/--rate-output directly.\n`,
    );
    console.log(HELP);
    return 1;
  }

  const extensions = new Set(
    (values.ext ?? DEFAULT_EXTENSIONS.join(',')).split(',').map((e) => e.trim().toLowerCase()),
  );
  const outputRatio = values['output-ratio'] ? Number(values['output-ratio']) : 0.8;

  const absPath = path.resolve(values.path);
  let files: string[];
  try {
    files = await collectFiles(absPath, extensions);
  } catch (err) {
    console.error(
      `error: cannot read "${absPath}": ${err instanceof Error ? err.message : String(err)}`,
    );
    return 1;
  }
  if (files.length === 0) {
    console.error(`no files matching [${[...extensions].join(', ')}] found under ${absPath}`);
    return 1;
  }

  const stats = await Promise.all(files.map(statFile));

  if (values.list) {
    for (const s of stats) {
      console.log(
        `  ${path.relative(absPath, s.file) || path.basename(s.file)}  —  ${s.chars.toLocaleString()} chars, ${s.words.toLocaleString()} words, ~${s.tokens.toLocaleString()} tokens`,
      );
    }
    console.log('');
  }

  const totalChars = stats.reduce((n, s) => n + s.chars, 0);
  const totalWords = stats.reduce((n, s) => n + s.words, 0);
  const inputTokens = stats.reduce((n, s) => n + s.tokens, 0);
  const outputTokens = Math.ceil(inputTokens * outputRatio);

  const inputCost = (inputTokens / 1_000_000) * rateInput;
  const outputCost = (outputTokens / 1_000_000) * rateOutput;

  console.log(`path:          ${absPath}`);
  console.log(`files:         ${files.length}`);
  console.log(`extensions:    ${[...extensions].join(', ')}`);
  console.log(`total chars:   ${totalChars.toLocaleString()}`);
  console.log(`total words:   ${totalWords.toLocaleString()}`);
  console.log(
    `rates:         $${rateInput}/1M in, $${rateOutput}/1M out${values.model ? ` (${values.model})` : ' (custom)'}`,
  );
  console.log(`output ratio:  ${outputRatio}`);
  console.log('');
  console.log(`est. input tokens:   ${inputTokens.toLocaleString()}  -  ${formatUsd(inputCost)}`);
  console.log(`est. output tokens:  ${outputTokens.toLocaleString()}  -  ${formatUsd(outputCost)}`);
  console.log(`TOTAL estimate:      ${formatUsd(inputCost + outputCost)}`);
  console.log('');
  console.log("Note: chars/4 heuristic, not a real tokenizer - and it can't know what");
  console.log('protectPatterns/code-fence masking would strip before a real run sends');
  console.log('content to a model. Treat this as a ballpark, not a quote.');

  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  },
);

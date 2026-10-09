#!/usr/bin/env tsx
import { parseArgs } from 'node:util';
import { cmdJudge } from './commands/judge.js';
import { cmdStatus } from './commands/status.js';
import { cmdSync } from './commands/sync.js';
import { cmdTranslate } from './commands/translate.js';
import { cmdValidate } from './commands/validate.js';
import { loadConfig } from './config.js';

// translate-engine CLI - arg parsing + dispatch. Each command lives in
// src/commands/*; shared helpers (scoping, config-derived settings, report
// writer, violation printing) live in src/cli-support.ts.
//
//   tsx src/cli.ts status    --config <project.config.mjs> [--locale kr]
//   tsx src/cli.ts translate --config <...> [--locale kr] [--file rel[,rel2,...]] [--dir rel[,rel2,...]] [--all] [--limit N] [--dry-run]
//   tsx src/cli.ts sync      --config <...> [--locale kr] --file rel[,rel2,...] [--base <ref>] [--base-file <path>] [--dry-run]
//   tsx src/cli.ts validate  --config <...> [--locale kr] [--file rel[,rel2,...]] [--dir rel[,rel2,...]]
//   tsx src/cli.ts judge     --config <...> [--locale kr] [--file rel[,rel2,...]] [--dir rel[,rel2,...]] [--sample N]
//
// Exit codes: 0 ok · 1 usage/config error · 2 validation errors found

const HELP = `translate-engine

commands:
  status     per-locale missing/done counts (add --list for file detail)
  translate  translate missing files (default) or --all / --file <rel>
  sync       propagate an EN content change to every locale: splice just the
             changed blocks (preserving the rest), or full-translate a new page
  validate   re-validate existing translated files against their EN sources
  judge      LLM quality scores for translated files (--sample N per locale)

common flags:
  --config <path>       project config module (required)
  --locale <code>       restrict to one locale (repeatable via comma list)
  --file <rel[,rel2]>   restrict to specific file(s), relative to the source dir
                        (comma-separated). ALWAYS use this when testing a
                        handful of files - without it, judge/validate act on
                        every file that already exists for the locale,
                        including untranslated legacy placeholder copies.
  --dir <rel[,rel2]>    restrict to every file under a folder, relative to the
                        source dir, INCLUDING nested subfolders at any depth
                        (comma-separated for multiple folders). Combines with
                        --file if both are given. Use this instead of typing
                        out a giant --file list for "translate this whole
                        section of the docs."
  --json                machine-readable output

translate flags:
  --all             re-translate everything, not just missing files
  --limit <n>       cap number of files processed
  --dry-run         translate + validate but write nothing (no report either)

Every file is written regardless of validator errors - a bad translation
never leaves a stale/missing target file behind. judge/judge --fix is the
downstream pass that catches and repairs quality issues. Every non-dry-run
translate call appends a run summary - files written with validator errors
and failed files (exceptions), with details - to
<dataDir>/reports/translate-<project>.md (one growing file per project).

sync flags:
  --base <ref>          git ref holding the OLD English source to diff against
                        (default HEAD - i.e. "the file as last committed"). The
                        changed blocks between <ref> and the working tree are the
                        only ones re-translated; every unchanged block keeps its
                        existing (human/precious) translation byte-for-byte.
  --base-file <path>    use this local file as the OLD English source instead of
                        git (for local testing without commits). Requires exactly
                        one file in scope via --file.
  --dry-run             splice + validate but write nothing

sync is the single entry point for a content change: per EN file per locale it
picks the right action automatically. A CHANGED page splices - only the changed
blocks re-translate, every unchanged block keeps its existing translation. A NEW
page (no version at <base>), or a locale with no translation yet, is FULLY
translated from scratch. Either way the SAME deterministic validator runs on the
result. It ABORTS a splice (writing nothing) when the existing translation's
block structure no longer lines up with the old EN source, rather than risk
splicing a block into the wrong place - re-translate that file in full or fix it
by hand. Exit code 2 signals any abort or validator error.

judge flags:
  --sample <n>      files per locale to judge when --file is not given
                    (default 10; 0 = all - expensive on a large tree, use
                    --file instead when you mean "just the files I touched")
  --fix             for any file scoring <= 3, re-translate it with the judge's
                    issues fed back as correction context, then re-validate (held
                    back if the re-translation breaks validation) and re-judge.
                    Prints before/after scores. Costs one extra translate + judge
                    call per fixed file.

Every judged file is ALSO re-checked with the deterministic validator. A TRUE
DISAGREEMENT - the judge scored the file well (> 3) but the validator found a
structural defect - is NOT auto-fixed: the fix is SKIPPED and BOTH assessments
(the judge's score/issues AND the validator's errors) are logged to the console
(CI) and the md report as "VALIDATOR DISAGREES" for human review. Files scoring
<= 3 always go straight to the fix, even if the validator flagged them (a
from-scratch retranslate can repair structure, and the result is re-validated).

Every judge call appends to two report files under <dataDir>/reports/:
judge-<project>.json (full score history, machine-readable) and
judge-<project>.md (the same run, human-readable - same growing-file,
append-as-you-go pattern as translate's report).
`;

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      config: { type: 'string' },
      locale: { type: 'string' },
      file: { type: 'string' },
      dir: { type: 'string' },
      all: { type: 'boolean', default: false },
      list: { type: 'boolean', default: false },
      limit: { type: 'string' },
      sample: { type: 'string' },
      base: { type: 'string' },
      'base-file': { type: 'string' },
      'dry-run': { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
      fix: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });

  const command = positionals[0];
  if (values.help || !command) {
    console.log(HELP);
    return values.help ? 0 : 1;
  }
  if (!values.config) {
    console.error('error: --config <path> is required\n');
    console.log(HELP);
    return 1;
  }

  const cfg = await loadConfig(values.config);
  const locales = values.locale ? values.locale.split(',').map((s) => s.trim()) : undefined;

  switch (command) {
    case 'status':
      return cmdStatus(cfg, locales, values.list, values.json);
    case 'translate':
      return cmdTranslate(cfg, locales, {
        file: values.file,
        dir: values.dir,
        all: values.all,
        limit: values.limit ? Number(values.limit) : undefined,
        dryRun: values['dry-run'],
      });
    case 'sync':
      return cmdSync(cfg, locales, {
        file: values.file,
        dir: values.dir,
        base: values.base,
        baseFile: values['base-file'],
        dryRun: values['dry-run'],
      });
    case 'validate':
      return cmdValidate(cfg, locales, values.file, values.dir, values.json);
    case 'judge':
      return cmdJudge(
        cfg,
        locales,
        values.file,
        values.dir,
        values.sample ? Number(values.sample) : 10,
        values.json,
        values.fix,
      );
    default:
      console.error(`unknown command "${command}"\n`);
      console.log(HELP);
      return 1;
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  },
);

import { promises as fs } from 'node:fs';
import path from 'node:path';
import pLimit from 'p-limit';
import {
  concurrencyFor,
  describeProvider,
  makeAppendingReport,
  pipelineOptionsFrom,
  printViolations,
  promptSettingsFrom,
  providerFor,
  scopeFiles,
  filterTargetLocales,
  validateSettingsFrom,
} from '../cli-support.js';
import { discover, type DiscoveredFile } from '../discover.js';
import { loadTM, memoryFor, saveTM } from '../memory.js';
import { translateMarkdownFile } from '../pipeline.js';
import { makeTranslatorFor } from '../providers/index.js';
import { hasErrors, validateTranslation } from '../validate.js';
import type { ResolvedConfig } from '../types.js';

export interface TranslateFlags {
  file?: string;
  dir?: string;
  all: boolean;
  limit?: number;
  dryRun: boolean;
}

export async function cmdTranslate(
  cfg: ResolvedConfig,
  locales: string[] | undefined,
  flags: TranslateFlags,
): Promise<number> {
  const settings = promptSettingsFrom(cfg);
  const validateSettings = validateSettingsFrom(cfg);

  const scope = scopeFiles(await discover(cfg, locales), flags.file, flags.dir);
  if (scope.error) {
    console.error(`error: ${scope.error}`);
    return 1;
  }
  const files = scope.files;

  const targets = filterTargetLocales(cfg, locales);

  let hadValidationErrors = false;

  // Report lines are appended to disk AS THEY HAPPEN (see makeAppendingReport) —
  // a run interrupted partway (Ctrl+C, crash) still leaves a durable record of
  // every errored/failed file up to that point, same reasoning as the per-file
  // TM save below. dry-run disables the report entirely.
  const reportPath = path.join(cfg.dataDirAbs, 'reports', `translate-${cfg.name}.md`);
  // With per-locale routing a run can use several models, so the header lists
  // the effective translator for every locale in scope rather than one name
  // that would be wrong for most of them.
  const header = targets
    .map((t) => `${t.code}=${describeProvider(providerFor(cfg, t))}`)
    .join(', ');
  const report = makeAppendingReport(
    reportPath,
    `## ${new Date().toISOString()} — ${header}\n\n`,
    !flags.dryRun,
  );

  for (const target of targets) {
    const work = files.filter((f) => {
      const st = f.targets[target.code]?.state;
      return flags.all || flags.file || flags.dir ? true : st === 'missing';
    });
    const queue = flags.limit ? work.slice(0, flags.limit) : work;
    if (queue.length === 0) {
      console.log(`[${target.code}] nothing to translate`);
      continue;
    }
    // Resolved per locale: a run may translate bg on a local Ollama model and
    // ja on a cloud one, each with its own safe concurrency.
    const providerCfg = providerFor(cfg, target);
    const concurrency = concurrencyFor(providerCfg);
    console.log(
      `[${target.code}] translating ${queue.length} file(s) with ${describeProvider(providerCfg)}…`,
    );

    const tmMap = await loadTM(cfg.dataDirAbs, target.code);
    const mem = memoryFor(tmMap);
    const translator = makeTranslatorFor(providerCfg, target, settings);

    let done = 0;
    const runOne = async (f: DiscoveredFile): Promise<void> => {
      const source = await fs.readFile(f.sourceAbs, 'utf-8');
      try {
        try {
          const output = await translateMarkdownFile(
            source,
            translator,
            pipelineOptionsFrom(cfg, mem),
          );

          const violations = validateTranslation(source, output, validateSettings);
          printViolations(f.relPath, target.code, violations);

          // Always written, even with validator errors - `judge`/`judge --fix`
          // is the downstream pass that catches and repairs these, so a bad
          // translation should never leave a stale/missing target file behind.
          if (hasErrors(violations)) {
            hadValidationErrors = true;
            const detail = violations
              .filter((v) => v.severity === 'error')
              .map((v) => `  - [${v.code}]${v.field ? ` ${v.field}:` : ''} ${v.message}`)
              .join('\n');
            await report.line(
              `- \`${f.relPath}\` [${target.code}] written WITH validator errors\n${detail}`,
            );
          }
          if (!flags.dryRun) {
            const targetAbs = f.targets[target.code].targetAbs;
            await fs.mkdir(path.dirname(targetAbs), { recursive: true });
            await fs.writeFile(targetAbs, output, 'utf-8');
          }
          done++;
          const flag = hasErrors(violations) ? 'Warning' : 'OK';
          console.log(
            `  ${flag} ${f.relPath} [${target.code}]${flags.dryRun ? ' (dry-run)' : ''}${hasErrors(violations) ? ' (validator errors — written anyway)' : ''}`,
          );
        } catch (err) {
          hadValidationErrors = true;
          // err.message can be an empty string for some low-level fetch/abort
          // failures - fall back to String(err) so the report line is never
          // just a bare, undiagnosable "FAILED `file`: ".
          const message = err instanceof Error && err.message ? err.message : String(err);
          await report.line(`- FAILED \`${f.relPath}\` [${target.code}]: ${message}`);
          console.error(`  Error: ${f.relPath} [${target.code}] failed: ${message}`);
        }
      } finally {
        // Persist TM after EVERY file, not once at the end of the whole batch -
        // a run interrupted partway (crash, Ctrl+C, network failure) still
        // keeps everything translated so far, instead of losing it all because
        // the save was waiting for files that hadn't even started yet.
        if (!flags.dryRun) await saveTM(cfg.dataDirAbs, target.code, tmMap);
      }
    };

    // Bounded concurrency via p-limit (the same tested micro-lib Astro/Vite use) instead of a hand-rolled worker pool: it caps
    // in-flight translations at `concurrency` so we don't fire hundreds of
    // provider requests at once (rate limits / memory), while still running up
    // to N in parallel. limit() queues each call and releases a slot as each
    // settles; Promise.all waits for the whole batch.
    const limit = pLimit(concurrency);
    await Promise.all(queue.map((f) => limit(() => runOne(f))));

    await report.line(`- **${target.code}**: ${done}/${queue.length} written`);
    console.log(`[${target.code}] ${done}/${queue.length} written`);
  }

  if (report.started) {
    await fs.appendFile(reportPath, '\n---\n\n', 'utf-8');
    console.log(`\nreport: ${reportPath}`);
  }

  return hadValidationErrors ? 2 : 0;
}

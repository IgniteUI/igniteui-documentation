import { promises as fs } from 'node:fs';
import path from 'node:path';
import pLimit from 'p-limit';
import {
  concurrencyFor,
  filterTargetLocales,
  pipelineOptionsFrom,
  printViolations,
  promptSettingsFrom,
  providerFor,
  scopeFiles,
  validateSettingsFrom,
} from '../cli-support.js';
import { discover, type DiscoveredFile } from '../discover.js';
import { openGitReader } from '../git.js';
import { syncDocument } from '../incremental.js';
import { loadTM, memoryFor, saveTM } from '../memory.js';
import { translateMarkdownFile } from '../pipeline.js';
import { translateBody } from '../pipeline/body.js';
import { extractProtectedBlocks, restoreProtectedBlocks } from '../pipeline/protect.js';
import { sanitizeFrontmatterValue } from '../pipeline/frontmatter-walk.js';
import { makeTranslatorFor } from '../providers/index.js';
import { hasErrors, validateTranslation } from '../validate.js';
import type { ResolvedConfig, Translator } from '../types.js';

export interface SyncFlags {
  file?: string;
  dir?: string;
  /** Git ref to diff the EN source against (the "old" version). Default HEAD. */
  base?: string;
  /** Local old-EN file to use instead of git (git-free testing). Requires a
   *  single file in scope. */
  baseFile?: string;
  dryRun: boolean;
}

// A changed/added body block: full protect → translate → restore, same path the
// full-file translator uses for prose.
function makeTranslateBlock(cfg: ResolvedConfig, t: Translator, mem: ReturnType<typeof memoryFor>) {
  return (block: string): Promise<string> =>
    translateBody(block, t, cfg.protectPatterns ?? [], mem, cfg.translatableAttributes);
}

// A changed frontmatter scalar: mask protected tokens, translate, un-decorate
// (strip stray fences/preambles), restore tokens - mirrors the frontmatter walk.
function makeTranslateValue(cfg: ResolvedConfig, t: Translator) {
  return async (value: string): Promise<string> => {
    const { replaced, blocks } = extractProtectedBlocks(value, cfg.protectPatterns ?? []);
    const out = await t.one(replaced);
    return restoreProtectedBlocks(sanitizeFrontmatterValue(out), blocks);
  };
}

export async function cmdSync(
  cfg: ResolvedConfig,
  locales: string[] | undefined,
  flags: SyncFlags,
): Promise<number> {
  const settings = promptSettingsFrom(cfg);
  const validateSettings = validateSettingsFrom(cfg);
  const base = flags.base ?? 'HEAD';
  const baseLabel = flags.baseFile ? `--base-file ${flags.baseFile}` : base;

  const scope = scopeFiles(await discover(cfg, locales), flags.file, flags.dir);
  if (scope.error) {
    console.error(`error: ${scope.error}`);
    return 1;
  }
  const files = scope.files;
  if (files.length === 0) {
    console.error('error: nothing in scope - pass --file <rel> (the changed EN page)');
    return 1;
  }
  if (flags.baseFile && files.length !== 1) {
    console.error(
      `error: --base-file names a single old-EN file, but ${files.length} files are in scope - narrow with --file <rel>`,
    );
    return 1;
  }

  const targets = filterTargetLocales(cfg, locales);

  let hadErrors = false;
  let aborted = 0;

  // Pre-read each file's EN-new + EN-old once (shared across all target locales).
  // enOldRaw === undefined marks a brand-new EN file (no version at <base>): it
  // has no "before" to diff, so every locale gets a full from-scratch translation.
  interface Prepared {
    f: DiscoveredFile;
    enNewRaw: string;
    enOldRaw: string | undefined;
  }
  // `git show` emits blobs as stored (LF), but a working-tree read can come back
  // CRLF on a repo with core.autocrlf=true. Collapse CRLF - LF on BOTH EN sides
  // before any diffing, otherwise every line looks changed and the whole file
  // would be needlessly re-translated (overwriting existing translations). No-op
  // on an LF repo; a lone \r is left untouched.
  const toLf = (s: string): string => s.replaceAll('\r\n', '\n');

  // Resolve the "old EN" source ONCE for the whole run: either a git reader
  // (repo root found + --base verified a single time, then one `git show` per
  // file) or a fixed local file (--base-file). openGitReader throws up front on
  // an unresolvable --base, so a bad ref fails before we translate anything.
  let readOldEn: (fileAbs: string) => Promise<string | undefined>;
  if (flags.baseFile) {
    const oldPath = path.resolve(flags.baseFile);
    readOldEn = async () => toLf(await fs.readFile(oldPath, 'utf-8'));
  } else {
    const reader = await openGitReader(cfg.sourceDirAbs, base);
    readOldEn = async (fileAbs) => {
      const c = await reader.read(fileAbs);
      return c === undefined ? undefined : toLf(c);
    };
  }

  const prepared: Prepared[] = [];
  for (const f of files) {
    const enNewRaw = toLf(await fs.readFile(f.sourceAbs, 'utf-8'));
    const enOldRaw = await readOldEn(f.sourceAbs);
    if (enOldRaw !== undefined && enOldRaw === enNewRaw) {
      console.log(`  SKIP ${f.relPath}: EN unchanged vs ${baseLabel}`);
      continue;
    }
    prepared.push({ f, enNewRaw, enOldRaw });
  }
  if (prepared.length === 0) return 0;

  for (const target of targets) {
    // Per-locale routing: resolve the translator (and its safe concurrency) for
    // THIS locale, not once for the whole run.
    const providerCfg = providerFor(cfg, target);
    const concurrency = concurrencyFor(providerCfg);
    const tmMap = await loadTM(cfg.dataDirAbs, target.code);
    const mem = memoryFor(tmMap);
    const translator = makeTranslatorFor(providerCfg, target, settings);
    const translateBlock = makeTranslateBlock(cfg, translator, mem);
    const translateValue = makeTranslateValue(cfg, translator);

    const runOne = async ({ f, enNewRaw, enOldRaw }: Prepared): Promise<void> => {
      const slot = f.targets[target.code];
      try {
        // Two ways to end up doing a WHOLE-file translation instead of a splice:
        //   - enOldRaw === undefined: the EN file is brand new (no base version).
        //   - slot.state === 'missing': EN existed, but this locale has no
        //     translation yet (e.g. a locale added after the page) - nothing to
        //     preserve, so translate it all.
        // Either way the SAME deterministic validator runs on the result below.
        let output: string;
        let summary: string;
        if (enOldRaw === undefined || slot.state === 'missing') {
          output = await translateMarkdownFile(enNewRaw, translator, pipelineOptionsFrom(cfg, mem));
          summary =
            enOldRaw === undefined
              ? 'new EN file - full translate'
              : 'no existing translation - full translate';
        } else {
          const targetRaw = await fs.readFile(slot.targetAbs, 'utf-8');
          const result = await syncDocument(enOldRaw, enNewRaw, targetRaw, {
            contract: cfg.contract,
            frontmatterStyle: cfg.frontmatterStyle,
            translateBlock,
            translateValue,
          });
          if ('aborted' in result) {
            aborted++;
            console.warn(`  ABORT ${f.relPath} [${target.code}]: ${result.aborted}`);
            return;
          }
          output = result.output;
          summary = `${result.translatedBlocks} block(s) translated, ${result.keptBlocks} kept`;
        }

        const violations = validateTranslation(enNewRaw, output, validateSettings);
        printViolations(f.relPath, target.code, violations);
        if (hasErrors(violations)) hadErrors = true;

        if (!flags.dryRun) {
          await fs.mkdir(path.dirname(slot.targetAbs), { recursive: true });
          await fs.writeFile(slot.targetAbs, output, 'utf-8');
        }

        const flag = hasErrors(violations) ? 'Warning' : 'OK';
        console.log(
          `  ${flag} ${f.relPath} [${target.code}]: ${summary}${flags.dryRun ? ' (dry-run)' : ''}${hasErrors(violations) ? ' (validator errors - written anyway)' : ''}`,
        );
      } catch (err) {
        hadErrors = true;
        const message = err instanceof Error && err.message ? err.message : String(err);
        console.error(`  Error: ${f.relPath} [${target.code}] failed: ${message}`);
      }
    };

    const limit = pLimit(concurrency);
    await Promise.all(prepared.map((p) => limit(() => runOne(p))));
    if (!flags.dryRun) await saveTM(cfg.dataDirAbs, target.code, tmMap);
  }

  // Aborts are a structural safety stop, not a translation failure: surface them
  // as exit 2 (same "needs a human" channel as validator errors) so CI notices.
  if (aborted > 0) {
    console.warn(
      `\n${aborted} file/locale pair(s) aborted (structures diverged) - re-translate or fix by hand.`,
    );
  }
  return hadErrors || aborted > 0 ? 2 : 0;
}

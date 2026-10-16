import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  describeProvider,
  judgeFor,
  makeAppendingReport,
  pipelineOptionsFrom,
  printViolations,
  promptSettingsFrom,
  providerFor,
  scopeFiles,
  filterTargetLocales,
  validateSettingsFrom,
} from '../cli-support.js';
import { discover } from '../discover.js';
import { judgeTranslation, type JudgeScore } from '../judge.js';
import { loadTM, memoryFor, saveTM } from '../memory.js';
import { translateMarkdownFile } from '../pipeline.js';
import { createProvider, makeTranslatorFor } from '../providers/index.js';
import { PendingAnswerError } from '../providers/exchange.js';
import { hasErrors, validateTranslation } from '../validate.js';
import type { ResolvedConfig } from '../types.js';

export async function cmdJudge(
  cfg: ResolvedConfig,
  locales: string[] | undefined,
  file: string | undefined,
  dir: string | undefined,
  filesPerLocale: number,
  json: boolean,
  fix: boolean,
): Promise<number> {
  // A judge may be defined at project level, per locale, or both (merged). Only
  // a config with NEITHER anywhere is a usage error - checked up front so the
  // command still fails fast instead of after discovery.
  if (!cfg.judge && !cfg.targets.some((t) => t.judge)) {
    console.error('error: no "judge" provider configured for this project');
    return 1;
  }
  const scope = scopeFiles(await discover(cfg, locales), file, dir);
  if (scope.error) {
    console.error(`error: ${scope.error}`);
    return 1;
  }
  const files = scope.files;
  const hasExplicitScope = scope.scoped;
  const targets = filterTargetLocales(cfg, locales);
  const promptSettings = promptSettingsFrom(cfg);
  const validateSettings = validateSettingsFrom(cfg);

  // Markdown report
  // Human-readable companion to the JSON history below - same growing-file,
  // append-as-you-go pattern as translate's report, so a run can be read
  // directly (in an editor or `git diff`) without parsing JSON, and nothing
  // is lost if the run is interrupted partway.
  const mdReportPath = path.join(cfg.dataDirAbs, 'reports', `judge-${cfg.name}.md`);
  // Per-locale routing means one run can use several judges, so the header lists
  // the effective judge for every locale in scope instead of a single name that
  // would be wrong for most of them. A locale with no judge is marked as such
  // rather than omitted, so the report shows what was skipped.
  const judgeHeader = targets
    .map((t) => {
      const jc = judgeFor(cfg, t);
      return `${t.code}=${jc ? describeProvider(jc) : 'none'}`;
    })
    .join(', ');
  const report = makeAppendingReport(
    mdReportPath,
    `## ${new Date().toISOString()} — ${judgeHeader}\n\n`,
  );

  const scores: JudgeScore[] = [];
  for (const target of targets) {
    const candidates = files.filter((f) => f.targets[target.code]?.state !== 'missing');
    // Decide WHICH translated files to judge for this locale:
    //   - --file / --dir given (hasExplicitScope): judge that exact set, no filesPerLocale.
    //   - whole-locale run with filesPerLocale > 0 (default 10): judge an even
    //     spread across the tree (pickEvenly) - judging all ~450 docs per run
    //     would be slow/costly, and the first folder alone isn't representative.
    //   - whole-locale run with --sample 0 (filesPerLocale === 0): judge everything.
    const picked =
      !hasExplicitScope && filesPerLocale > 0 ? pickEvenly(candidates, filesPerLocale) : candidates;
    if (picked.length === 0) {
      console.log(
        `[${target.code}] nothing to judge (requested file(s) not translated for this locale)`,
      );
      continue;
    }

    // Per-locale routing: judge and fix-translator are both resolved for THIS
    // locale. A locale with no judge anywhere is skipped rather than failing the
    // whole run - other locales may well be judgeable.
    const judgeCfg = judgeFor(cfg, target);
    if (!judgeCfg) {
      console.log(`[${target.code}] skipped - no judge configured for this locale`);
      continue;
    }
    const judge = createProvider(judgeCfg);
    const fixProviderCfg = providerFor(cfg, target);
    if (fixProviderCfg.id === judgeCfg.id && fixProviderCfg.model === judgeCfg.model) {
      console.warn(
        `  Warning [${target.code}] judge and translator are the SAME model ` +
          `(${describeProvider(judgeCfg)}) - scores will carry a self-grading blind spot.`,
      );
    }
    console.log(
      `[${target.code}] judging ${picked.length} file(s) with ${describeProvider(judgeCfg)}…`,
    );

    // Lazy: only loaded the first time a file in this target actually needs
    // fixing, so a plain (non --fix) judge run never touches TM at all.
    let tmMap: Map<string, string> | undefined;
    let tmDirty = false;

    for (const f of picked) {
      const source = await fs.readFile(f.sourceAbs, 'utf-8');
      const translated = await fs.readFile(f.targets[target.code].targetAbs, 'utf-8');
      // An exchange judge (src/providers/exchange.ts) may not have this file's
      // answer yet: skip the file so the others are still scored and nothing
      // half-done reaches the history; the answered files land on the next run.
      let score: JudgeScore;
      try {
        score = await judgeTranslation(
          judge,
          f.relPath,
          source,
          translated,
          target,
          cfg.glossaryEntries,
          cfg.promptContext,
          cfg.styleGuide,
        );
      } catch (err) {
        if (err instanceof PendingAnswerError) {
          console.log(`  pending ${f.relPath} [${target.code}] - ${err.message}`);
          continue;
        }
        throw err;
      }
      scores.push(score);
      const flag = score.overall <= 3 ? ' Warning! ' : '   ';
      console.log(
        `${flag} ${score.overall}/5 ${f.relPath} [${target.code}]${score.issues.length ? ` — ${score.issues[0]}` : ''}`,
      );
      await report.line(
        `- ${score.overall}/5 \`${f.relPath}\` [${target.code}]` +
          (score.issues.length ? `\n${score.issues.map((iss) => `  - ${iss}`).join('\n')}` : ''),
      );

      // Judge is an LLM scoring another LLM's output - it can and does miss
      // concrete, mechanically-detectable defects (a dropped brand term, an
      // extra fence) while still handing out a high score, since nothing in
      // its own reasoning surfaces the specific check that would catch it.
      // Running the deterministic validator on every judged file (cheap -
      // synchronous, no extra API call) and flagging any disagreement is the
      // way to catch that blind spot instead of trusting judge's score alone.
      const docViolations = validateTranslation(source, translated, validateSettings);
      // True DISAGREEMENT: the judge LIKED the file (>3) but the deterministic
      // validator found a structural defect. Don't auto-fix — re-translating a
      // file the model already considers good is pointless, and the conflict
      // needs a human. Log BOTH sides (judge score/issues AND validator errors)
      // to the CI console and the md report, then skip. Files scoring <= 3 fall
      // through to --fix below EVEN IF the validator flagged them: a from-scratch
      // retranslate can repair the structure, and the result is re-validated and
      // held back if it still can't.
      if (hasErrors(docViolations) && score.overall > 3) {
        const errDetail = docViolations
          .filter((v) => v.severity === 'error')
          .map((v) => `[${v.code}] ${v.message}`);
        const judgeLine = `${score.overall}/5${score.issues.length ? ` — ${score.issues.join('; ')}` : ''}`;
        console.log(` VALIDATOR DISAGREES — fix SKIPPED, logged for review:`);
        console.log(` judge:     ${judgeLine}`);
        for (const d of errDetail) console.log(`        validator: ${d}`);
        await report.line(
          `  - VALIDATOR DISAGREES — fix SKIPPED, needs human review:\n` +
            `    - judge: ${judgeLine}\n` +
            errDetail.map((d) => `    - validator: ${d}`).join('\n'),
        );
      }

      // score <= 3 - go straight to the fix (re-translate); score > 3 is never fixed.
      if (!fix || score.overall > 3) continue;
      // Below 3: correction notes alone don't reliably help. Observed in
      // production , two files stuck at 2/5 came back 2/5 again after a
      // correction-notes fix, because the missing content (JSX component
      // attribute text, e.g. <CtaArea title="..." description="...">) is
      // architecturally invisible to the model; no amount of "
      // translate the CTA section" feedback helps when that section was
      // never part of what the model saw. At 3/5 the translation is broadly
      // right with specific, fixable complaints - correction notes work
      // there (observed: 3/5 → 5/5, 3/5 → 4/5 in the same run). Below 3,
      // skip straight to a full from-scratch retranslate instead.
      const fromScratch = score.overall < 3;
      if (!fromScratch && score.issues.length === 0) continue;

      console.log(
        fromScratch
          ? `  --fix: score below 3 - re-translating from scratch (no correction notes)…`
          : `  --fix: re-translating with ${score.issues.length} issue(s) fed back as correction context…`,
      );
      await report.line(
        fromScratch
          ? `  - --fix: score below 3 - re-translating from scratch (no correction notes)`
          : `  - --fix: re-translating with ${score.issues.length} issue(s) fed back as correction context`,
      );
      tmMap ??= await loadTM(cfg.dataDirAbs, target.code);
      const mem = memoryFor(tmMap);
      const fixTranslator = makeTranslatorFor(
        fixProviderCfg,
        target,
        fromScratch ? promptSettings : { ...promptSettings, correctionNotes: score.issues },
      );

      let fixedOutput: string;
      try {
        fixedOutput = await translateMarkdownFile(
          source,
          fixTranslator,
          pipelineOptionsFrom(cfg, mem),
        );
      } catch (err) {
        const message = err instanceof Error && err.message ? err.message : String(err);
        console.log(`    FAIL fix attempt failed: ${message}`);
        await report.line(`  - FAIL fix attempt failed: ${message}`);
        continue;
      }
      tmDirty = true;

      const fixViolations = validateTranslation(source, fixedOutput, validateSettings);
      if (hasErrors(fixViolations)) {
        console.log(`    FAIL fix HELD BACK (validator errors) - original file left untouched:`);
        printViolations(f.relPath, target.code, fixViolations);
        await report.line(
          `  - FAIL fix HELD BACK (validator errors) - original file left untouched`,
        );
        continue;
      }

      const targetAbs = f.targets[target.code].targetAbs;
      await fs.mkdir(path.dirname(targetAbs), { recursive: true });
      await fs.writeFile(targetAbs, fixedOutput, 'utf-8');

      const newScore = await judgeTranslation(
        judge,
        f.relPath,
        source,
        fixedOutput,
        target,
        cfg.glossaryEntries,
        cfg.promptContext,
        cfg.styleGuide,
      );
      scores.push(newScore);
      const improved = newScore.overall > score.overall;
      console.log(
        `    ${improved ? 'OK' : '~'} re-judged: ${score.overall}/5 → ${newScore.overall}/5` +
          (newScore.issues.length ? ` - remaining: ${newScore.issues[0]}` : ' - no issues found'),
      );
      await report.line(
        `  - ${improved ? 'OK' : '~'} re-judged: ${score.overall}/5 → ${newScore.overall}/5` +
          (newScore.issues.length
            ? `\n${newScore.issues.map((iss) => `    - ${iss}`).join('\n')}`
            : ' - no issues found'),
      );
    }

    if (tmDirty && tmMap) await saveTM(cfg.dataDirAbs, target.code, tmMap);
  }

  // One file per project, holding the FULL judge history - every run's
  // scores are appended, never overwritten, so past results stay visible
  // (score, issues, and timestamp) alongside the newest ones.
  const reportPath = path.join(cfg.dataDirAbs, 'reports', `judge-${cfg.name}.json`);
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  let history: JudgeScore[] = [];
  try {
    history = JSON.parse(await fs.readFile(reportPath, 'utf-8')) as JudgeScore[];
  } catch {
    // first run for this project — start a new history
  }
  const allScores = [...history, ...scores];
  await fs.writeFile(reportPath, JSON.stringify(allScores, null, 2) + '\n', 'utf-8');

  if (json) console.log(JSON.stringify(scores, null, 2));
  const avg = scores.length
    ? (scores.reduce((n, s) => n + s.overall, 0) / scores.length).toFixed(2)
    : 'n/a';
  const low = scores.filter((s) => s.overall <= 3).length;
  console.log(`\naverage overall: ${avg}/5 · ${low} file(s) at or below 3 · report: ${reportPath}`);
  if (report.started) {
    await fs.appendFile(
      mdReportPath,
      `\naverage overall: ${avg}/5 · ${low} file(s) at or below 3\n\n---\n\n`,
      'utf-8',
    );
    console.log(`report: ${mdReportPath}`);
  }
  return 0;
}

// Pick n items spread across the alphabetical file list instead of taking the
// first n - the first folder is not representative of the whole tree.
function pickEvenly<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr;
  const step = arr.length / n;
  return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)]);
}

// Write the translation stamp into translated files' frontmatter.
//
//   node stamp.mjs --run <id|latest> [--dry-run]
//       every page-locale the run WROTE: source_sha = the EN blob id the plan
//       translated, the translation model, the judge's overall score when that
//       exact text was judged (else null), the judge model, today's date.
//       Also puts back `_language` (dropped by the engine's sync) and adds
//       `_language: ja` to Japanese pages, the jp corpus convention.
//   node stamp.mjs mark --tree xplat|angular --locale <code> --file <rel>[,<rel>] [--model human-reviewed] [--dry-run]
//       stamp EXISTING translations as current against today's EN page, e.g.
//       after a native speaker confirmed an unstamped human translation is up
//       to date; staleness is tracked from then on.
//
// Stamp it LAST (after judge and fix): the engine's validator compares
// frontmatter shape with the EN page, so a stamped file reports a
// shape-mismatch in a later `validate`/`judge` - see TRANSLATION.md.
import fs from 'node:fs';
import {
  JUDGE_LABEL,
  activeItems,
  applyStamp,
  blobSha,
  contentSha,
  enDir,
  fail,
  gitShow,
  loadPlan,
  loadStatus,
  parseArgs,
  parseLocales,
  readText,
  repoAbs,
  resolveRun,
  saveStatus,
  targetRel,
  today,
  TREES,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2), ['dry-run']);
const dry = args['dry-run'];
const date = today();

function write(repoRel, text) {
  if (!dry) fs.writeFileSync(repoAbs(repoRel), text, 'utf8');
}

if (args._[0] === 'mark') {
  const tree = args.tree;
  if (!TREES[tree]) fail('--tree xplat|angular');
  if (!args.file) fail('--file <rel>[,<rel>]');
  for (const code of parseLocales(args.locale)) {
    for (const rel of String(args.file).split(',').map((s) => s.trim())) {
      const en = readText(repoAbs(`${enDir(tree)}/${rel}`));
      if (en === undefined) fail(`no EN page ${enDir(tree)}/${rel}`);
      const t = targetRel(tree, code, rel);
      const text = readText(repoAbs(t));
      if (text === undefined) {
        console.log(`  skip ${t} - no translation to mark`);
        continue;
      }
      const stamp = { source_sha: blobSha(en), model: args.model ?? 'human', judge: null, judge_model: null, date };
      write(t, applyStamp(text, stamp));
      console.log(`  marked ${t} as current (${stamp.model})${dry ? ' (dry-run)' : ''}`);
    }
  }
  process.exit(0);
}

const run = resolveRun(args.run);
const plan = loadPlan(run);
const status = loadStatus(run);
let n = 0;
for (const item of activeItems(plan)) {
  const s = status.items[item.key];
  if (!s?.written) continue;
  const text = readText(repoAbs(item.target));
  if (text === undefined) {
    console.log(`  MISSING ${item.target} - written by the run but gone now; not stamped`);
    continue;
  }
  const enNow = blobSha(readText(repoAbs(`${enDir(item.tree)}/${item.rel}`)) ?? '');
  if (enNow !== item.enSha) {
    console.log(`  note ${item.key}: the EN page changed after the plan was made - stamped with the planned version, so /translate-list shows it stale`);
  }
  const judged = s.judgeState === 'judged' && s.judgedSha === contentSha(text);
  if (s.judgeState === 'judged' && !judged) {
    console.log(`  note ${item.key}: edited after it was judged - judge score left empty (re-judge to record one)`);
  }
  const stamp = {
    source_sha: item.enSha,
    model: s.model ?? plan.modelLabel,
    judge: judged ? s.judge.overall : null,
    judge_model: judged ? (s.judgeModel ?? JUDGE_LABEL) : null,
    date,
  };
  const out = applyStamp(text, stamp, {
    previous: gitShow('HEAD', item.target),
    ensureLanguage: item.locale === 'ja' ? 'ja' : undefined,
  });
  write(item.target, out);
  s.stamped = date;
  n++;
  console.log(`  stamped ${item.target} - ${stamp.model}, judge ${stamp.judge ?? 'n/a'}${dry ? ' (dry-run)' : ''}`);
}
if (!dry) saveStatus(run, status);
console.log(`\n${n} file(s) ${dry ? 'would be ' : ''}stamped (run ${run}).`);

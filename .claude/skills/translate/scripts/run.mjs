// Execute a run plan with the engine, one engine command per (page, locale).
//
//   node run.mjs --run <id|latest> --step record|replay|judge|validate [--only <filter>] [--force]
//
//   record    EXCHANGE_MODE=record + --dry-run: surfaces every prompt, writes nothing
//   replay    the real run: answers are read back, translations are written
//   judge     the exchange judge (never recorded): the first pass writes the
//             judge prompts, the pass after the answers produces the scores
//   validate  re-run the deterministic validator (after manual fixes)
//
//   --only    pending | failed | all | <tree:locale:rel>[,<...>]
//   --force   replay even when recorded prompts are unanswered / re-judge
//             unchanged content
//
// Why one command per item: the provider rewrites a prompt's meta file every
// time it is asked, so diffing the exchange directory around a command tells
// exactly which prompts belong to which page - the dispatch and the "what is
// still missing for this page" checks depend on that.
//
// Why the translation memory is reset before every command: the engine leaves
// TM hits out of its JSON batches, so a batch prompt depends on the TM. The
// record pass is a dry run and never saves TM; a replay saves after each file.
// Without the reset, page 2's replay would see page 1's new entries, build a
// different batch than the one recorded, and stall on a prompt nobody answered.
// Each command therefore starts from the TM as it was when the run began
// (runs/<id>/tm-base) and the additions are merged into data/tm/ afterwards.
import fs from 'node:fs';
import path from 'node:path';
import {
  JUDGE_LABEL,
  REPORTS_DIR,
  SKILL_SCRIPTS,
  TM_DIR,
  TREES,
  activeItems,
  blobSha,
  configPath,
  contentSha,
  engineCli,
  exchangeDir,
  exchangePrompts,
  fail,
  gitDirty,
  loadPlan,
  loadStatus,
  metaSnapshot,
  askedSince,
  parseArgs,
  readJson,
  readText,
  repoAbs,
  resolveRun,
  runDir,
  saveStatus,
  stripManaged,
  writeJson,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2), ['force']);
const run = resolveRun(args.run);
const step = args.step;
if (!['record', 'replay', 'judge', 'validate'].includes(step)) fail('--step record|replay|judge|validate');
const plan = loadPlan(run);
const status = loadStatus(run);
const st = (key) => (status.items[key] ??= {});

// ------------------------------------------------------------ TM isolation

const tmBaseDir = path.join(runDir(run), 'tm-base');
const tmAddedDir = path.join(runDir(run), 'tm-added');
const tmFiles = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : []);
const tmDigest = () =>
  tmFiles(TM_DIR)
    .sort()
    .map((f) => `${f}:${readText(path.join(TM_DIR, f))}`)
    .join('\n');

function ensureTmBase() {
  if (fs.existsSync(tmBaseDir)) return;
  fs.mkdirSync(tmBaseDir, { recursive: true });
  for (const f of tmFiles(TM_DIR)) fs.copyFileSync(path.join(TM_DIR, f), path.join(tmBaseDir, f));
  status.tmDigest = tmDigest();
}

function restoreTmBase() {
  fs.mkdirSync(TM_DIR, { recursive: true });
  const base = new Set(tmFiles(tmBaseDir));
  for (const f of tmFiles(TM_DIR)) if (!base.has(f)) fs.rmSync(path.join(TM_DIR, f));
  for (const f of base) fs.copyFileSync(path.join(tmBaseDir, f), path.join(TM_DIR, f));
}

function collectTmAdditions() {
  for (const f of tmFiles(TM_DIR)) {
    const now = readJson(path.join(TM_DIR, f), {});
    const base = readJson(path.join(tmBaseDir, f), {});
    const addedFile = path.join(tmAddedDir, f);
    const added = readJson(addedFile, {});
    let changed = false;
    for (const [k, v] of Object.entries(now)) {
      if (base[k] === undefined && added[k] === undefined) {
        added[k] = v;
        changed = true;
      }
    }
    if (changed) writeJson(addedFile, added);
  }
}

/** data/tm = TM at run start + every addition of this run, in the engine's own format. */
function finalizeTm() {
  const names = new Set([...tmFiles(tmBaseDir), ...tmFiles(tmAddedDir)]);
  for (const f of names) {
    const merged = { ...readJson(path.join(tmAddedDir, f), {}), ...readJson(path.join(tmBaseDir, f), {}) };
    const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
    writeJson(path.join(TM_DIR, f), sorted);
  }
  status.tmDigest = tmDigest();
}

// ------------------------------------------------------------ item helpers

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const lineRe = (re) => new RegExp(re, 'm');

function promptsOf(key, role) {
  const hashes = new Set(st(key)[role === 'judge' ? 'judgePrompts' : 'prompts'] ?? []);
  return exchangePrompts(exchangeDir(run, role)).filter((p) => hashes.has(p.hash));
}

const unanswered = (key, role) => promptsOf(key, role).filter((p) => !p.answered);

/** A written item with an answer written after it last ran: an answered retry (attempt N), or a re-done answer. */
function answersChanged(key) {
  const s = st(key);
  if (!s.at) return false;
  return promptsOf(key, 'translate').some((p) => p.answered && fs.statSync(p.answerFile).mtimeMs > Date.parse(s.at));
}

const isWritten = (key) => st(key).written === true;

function select() {
  const act = activeItems(plan);
  const only = args.only;
  if (only && !['all', 'pending', 'failed'].includes(only)) {
    const keys = String(only).split(',').map((k) => k.trim());
    for (const k of keys) if (!act.some((i) => i.key === k)) fail(`no active item "${k}"`);
    return act.filter((i) => keys.includes(i.key));
  }
  if (only === 'all') return act;
  if (step === 'record') return only ? act.filter((i) => !st(i.key).prompts) : act;
  if (step === 'replay') {
    if (only === 'failed') return act.filter((i) => ['pending', 'error', 'awaiting-answers'].includes(st(i.key).state));
    return act.filter(
      (i) =>
        st(i.key).recordState !== 'aborted' &&
        (!isWritten(i.key) || answersChanged(i.key) || (only === 'pending' && unanswered(i.key, 'translate').length > 0)),
    );
  }
  if (step === 'judge') {
    return act.filter((i) => {
      if (!isWritten(i.key)) return false;
      const s = st(i.key);
      if (only === 'pending') return s.judgeState === 'judge-pending';
      const sha = contentSha(readText(repoAbs(i.target)) ?? '');
      return args.force || s.judgeState !== 'judged' || s.judgedSha !== sha;
    });
  }
  return act.filter((i) => isWritten(i.key)); // validate
}

function engineArgs(item, kind) {
  const base = ['--config', configPath(item.tree), '--locale', item.locale, '--file', item.rel];
  if (kind === 'judge') return ['judge', ...base];
  if (kind === 'validate') return ['validate', ...base, '--json'];
  const cmd = item.action === 'sync' ? ['sync', ...base] : ['translate', ...base];
  if (item.action === 'sync') cmd.push(...(item.baseFile ? ['--base-file', item.baseFile] : ['--base', item.base]));
  if (kind === 'record') cmd.push('--dry-run');
  return cmd;
}

function parseTranslate(out, item) {
  const r = esc(item.rel);
  const l = esc(item.locale);
  const violations = [...out.matchAll(/^ {4}([x~]) \[([\w-]+)\] (.*)$/gm)].map((m) => ({
    severity: m[1] === 'x' ? 'error' : 'warn',
    code: m[2],
    message: m[3],
  }));
  let m;
  if ((m = out.match(lineRe(`^\\s+ABORT ${r} \\[${l}\\]: (.*)$`)))) return { state: 'aborted', message: m[1] };
  if (lineRe(`^\\s+SKIP ${r}: EN unchanged`).test(out)) return { state: 'unchanged', message: 'EN unchanged vs the base' };
  if ((m = out.match(lineRe(`^\\s+Error: ${r} \\[${l}\\] failed: (.*)$`)))) {
    return { state: /exchange: no answer yet/.test(m[1]) ? 'pending' : 'error', message: m[1] };
  }
  if (lineRe(`^\\s+Warning ${r} \\[${l}\\]`).test(out)) return { state: 'written-errors', violations };
  if (lineRe(`^\\s+OK ${r} \\[${l}\\]`).test(out)) return { state: 'written', violations };
  return { state: 'error', message: `unrecognised engine output:\n${out.trim().split('\n').slice(-8).join('\n')}` };
}

/**
 * Why a replay must not write this item, or null. Two cases: the run wrote the
 * file earlier and it has changed since (fix edits, the stamp) - a replay would
 * overwrite them; or a /retranslate target that has uncommitted changes of
 * someone else (checked again here, because answering takes a while after plan
 * time). --force overrides both.
 */
function overwriteGuard(item, s) {
  const text = readText(repoAbs(item.target));
  if (s.written && s.writtenSha && text !== undefined && blobSha(text) !== s.writtenSha) {
    return 'the file changed after this run wrote it (fix edits or the stamp) - a replay would overwrite that; --force to replay anyway';
  }
  if (!s.written && item.retranslate && !plan.force && gitDirty([item.target]).size) {
    return 'has uncommitted changes in the working tree - retranslating would overwrite them; commit or discard them, or --force';
  }
  return null;
}

function latestJudgeEntry(item, since) {
  const file = path.join(REPORTS_DIR, `judge-${TREES[item.tree].name}.json`);
  const hist = readJson(file, []);
  return hist.filter((e) => e.file === item.rel && e.locale === item.locale && e.timestamp >= since).pop();
}

// ------------------------------------------------------------------- steps

const items = select();
if (!items.length) {
  console.log(`nothing to do for --step ${step}${args.only ? ` --only ${args.only}` : ''} in run ${run}`);
  process.exit(0);
}

const tmTouching = step === 'record' || step === 'replay';
if (tmTouching) {
  ensureTmBase();
  if (step === 'replay' && status.tmDigest !== undefined && status.tmDigest !== tmDigest() && !args.force) {
    fail(
      'data/tm/ changed since this run last wrote it (a manual TM edit?). A replay resets the TM to the ' +
        'run start and would discard that edit. Make TM corrections after the last replay, or pass --force.',
    );
  }
}

// Session (exchange) runs label the model from the plan; an API run (DOCS_PROVIDER set) keeps the
// caller's real DOCS_MODEL. The labels are recorded per item for the stamp.
const sessionT = (process.env.DOCS_PROVIDER ?? 'exchange') === 'exchange';
const sessionJ = (process.env.DOCS_JUDGE ?? 'exchange') === 'exchange';
const env = sessionT ? { DOCS_RUN: run, DOCS_MODEL: plan.model } : { DOCS_RUN: run };
const modelLabel = sessionT ? plan.modelLabel : process.env.DOCS_MODEL;
const judgeLabel = process.env.DOCS_JUDGE_MODEL ?? (sessionJ ? JUDGE_LABEL : 'claude-sonnet-5');
const role = step === 'judge' ? 'judge' : 'translate';
const counts = {};
for (const item of items) {
  const s = st(item.key);
  if (step === 'replay' && !args.force) {
    const missing = unanswered(item.key, 'translate');
    if (missing.length) {
      s.state = s.written ? s.state : 'awaiting-answers';
      s.message = `${missing.length} recorded prompt(s) still unanswered: ${missing.map((p) => `${p.hash}@${p.attempt}`).join(', ')}`;
      counts['awaiting-answers'] = (counts['awaiting-answers'] ?? 0) + 1;
      console.log(`  WAIT    ${item.key} - ${s.message}`);
      continue;
    }
    const blocked = overwriteGuard(item, s);
    if (blocked) {
      s.blocked = blocked;
      counts.blocked = (counts.blocked ?? 0) + 1;
      console.log(`  BLOCKED ${item.key} - ${blocked}`);
      continue;
    }
    delete s.blocked;
  }
  if (tmTouching) restoreTmBase();
  // judge/validate compare the target with the EN page; hide the stamp and
  // `_language` (target-only metadata) for the command, restore byte-for-byte.
  // A backup sits in the run dir until the file is back, in case of a crash.
  const targetAbs = repoAbs(item.target);
  const original = step === 'judge' || step === 'validate' ? readText(targetAbs) : undefined;
  const hidden = original !== undefined && stripManaged(original) !== original;
  const backup = path.join(runDir(run), 'backup', item.key.replace(/[^A-Za-z0-9._-]+/g, '_'));
  if (hidden) {
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.writeFileSync(backup, original, 'utf8');
    fs.writeFileSync(targetAbs, stripManaged(original), 'utf8');
  }
  const before = metaSnapshot(exchangeDir(run, role));
  const startedAt = new Date().toISOString();
  let out;
  try {
    ({ out } = engineCli(engineArgs(item, step), {
      ...env,
      EXCHANGE_MODE: step === 'record' ? 'record' : 'replay',
    }));
  } finally {
    if (hidden) {
      fs.writeFileSync(targetAbs, original, 'utf8');
      fs.rmSync(backup);
    }
  }
  const asked = askedSince(before, metaSnapshot(exchangeDir(run, role)));
  fs.appendFileSync(path.join(runDir(run), `${step}.log`), `\n### ${startedAt} ${item.key}\n${out}\n`, 'utf8');

  let label;
  if (step === 'record') {
    const r = parseTranslate(out, item);
    // A record starts the item over (e.g. after plan.mjs set switched sync -> translate).
    for (const k of ['state', 'written', 'violations', 'judgeState', 'judge', 'judgedSha', 'retryPending', 'at']) delete s[k];
    s.prompts = asked;
    s.recordState = r.state === 'written' || r.state === 'written-errors' ? 'recorded' : r.state;
    s.message = r.message;
    label = s.recordState;
    console.log(`  ${label.padEnd(9)} ${item.key} - ${asked.length} prompt(s)${r.message ? ` - ${r.message}` : ''}`);
  } else if (step === 'replay') {
    const r = parseTranslate(out, item);
    collectTmAdditions();
    s.prompts = [...new Set([...(s.prompts ?? []), ...asked])];
    s.state = r.state;
    s.message = r.message;
    s.at = new Date().toISOString();
    if (r.state === 'written' || r.state === 'written-errors') {
      s.written = true;
      s.writtenSha = blobSha(readText(repoAbs(item.target)) ?? '');
      s.model = modelLabel;
      s.violations = r.violations;
      s.judgeState = undefined;
    }
    const retries = promptsOf(item.key, 'translate').filter((p) => p.attempt > 1 && !p.answered);
    s.retryPending = retries.map((p) => `${p.hash}@${p.attempt}`);
    label = r.state;
    const errs = (r.violations ?? []).filter((v) => v.severity === 'error').length;
    console.log(
      `  ${label.padEnd(14)} ${item.key}${errs ? ` - ${errs} validator error(s)` : ''}${r.message ? ` - ${r.message}` : ''}` +
        (retries.length ? ` - engine asked for a retry: ${s.retryPending.join(', ')}` : ''),
    );
  } else if (step === 'judge') {
    s.judgePrompts = asked;
    const r = esc(item.rel);
    const l = esc(item.locale);
    if (lineRe(`^\\s+pending ${r} \\[${l}\\]`).test(out)) {
      s.judgeState = 'judge-pending';
    } else if (new RegExp(`\\d/5 ${r} \\[${l}\\]`).test(out)) {
      const entry = latestJudgeEntry(item, startedAt);
      s.judgeState = 'judged';
      s.judge = entry;
      s.judgeModel = judgeLabel;
      s.judgedSha = contentSha(readText(repoAbs(item.target)) ?? '');
      s.disagreement = [...out.matchAll(/^\s+validator: (.*)$/gm)].map((m) => m[1]);
    } else {
      s.judgeState = 'judge-error';
      s.message = out.trim().split('\n').slice(-6).join('\n');
    }
    label = s.judgeState;
    console.log(
      `  ${label.padEnd(13)} ${item.key}${s.judgeState === 'judged' && s.judge ? ` - ${s.judge.overall}/5` : ''}${s.judgeState === 'judge-error' ? ` - ${s.message}` : ''}`,
    );
  } else {
    // `validate --json` prints one JSON array; skip any stray log line before it.
    let report;
    for (const m of out.matchAll(/^\[/gm)) {
      try {
        report = JSON.parse(out.slice(m.index));
        break;
      } catch {
        // not the array yet
      }
    }
    s.validation = (report ?? []).flatMap((r) => r.violations);
    label = report === undefined ? 'error' : s.validation.some((v) => v.severity === 'error') ? 'errors' : 'clean';
    if (report === undefined) s.message = `unrecognised validate output:\n${out.trim().split('\n').slice(-6).join('\n')}`;
    console.log(`  ${label.padEnd(7)} ${item.key}${s.validation.length ? ` - ${s.validation.map((v) => `[${v.code}] ${v.message}`).join('; ')}` : ''}`);
  }
  counts[label] = (counts[label] ?? 0) + 1;
  saveStatus(run, status);
}
if (tmTouching) finalizeTm();
saveStatus(run, status);
writeSummary();

console.log(`\n${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}`);
console.log(`log: ${path.join(runDir(run), `${step}.log`)}`);
console.log(`summary: ${path.join(runDir(run), 'summary.md')}`);
nextHint();

// ---------------------------------------------------------------- output

function nextHint() {
  const act = activeItems(plan);
  const pendingT = new Set(act.flatMap((i) => unanswered(i.key, 'translate').map((p) => p.hash)));
  const pendingJ = new Set(act.flatMap((i) => unanswered(i.key, 'judge').map((p) => p.hash)));
  const S = SKILL_SCRIPTS;
  if (step === 'record') {
    const aborted = act.filter((i) => st(i.key).recordState === 'aborted');
    if (aborted.length) console.log(`\n${aborted.length} item(s) ABORTED (structures diverged) - ask the user; to translate in full: node ${S}/plan.mjs set --run ${run} --item <key> --action translate`);
    console.log(`\n${pendingT.size} prompt(s) to answer. next: node ${S}/dispatch.mjs --run ${run} --role translate`);
  } else if (step === 'replay') {
    const waiting = act.filter((i) => ['pending', 'awaiting-answers'].includes(st(i.key).state));
    const retry = act.filter((i) => (st(i.key).retryPending ?? []).length);
    const blocked = items.filter((i) => st(i.key).blocked);
    if (blocked.length) console.log(`\n${blocked.length} item(s) BLOCKED to protect uncommitted or edited files - tell the user; --force overrides.`);
    if (pendingT.size) console.log(`\n${pendingT.size} prompt(s) unanswered (${waiting.length} item(s) waiting, ${retry.length} with retry requests). next: node ${S}/dispatch.mjs --run ${run} --role translate, then: node ${S}/run.mjs --run ${run} --step replay`);
    else if (act.every((i) => isWritten(i.key) || ['aborted', 'unchanged'].includes(st(i.key).state ?? st(i.key).recordState)))
      console.log(`\nall items done. next: node ${S}/run.mjs --run ${run} --step judge`);
  } else if (step === 'judge') {
    if (pendingJ.size) console.log(`\n${pendingJ.size} judge prompt(s) to answer (Sonnet). next: node ${S}/dispatch.mjs --run ${run} --role judge, then: node ${S}/run.mjs --run ${run} --step judge`);
    else console.log(`\njudging complete - show the summary to the user. Stamp when done: node ${S}/stamp.mjs --run ${run}`);
  }
}

function writeSummary() {
  const lines = [
    `# Translation run ${run}`,
    '',
    `- created: ${plan.createdAt} (${plan.mode}${plan.mergeBase ? `, merge base \`${plan.mergeBase.slice(0, 10)}\` of \`${plan.baseRef}\`` : ''})`,
    `- translation model: ${plan.model} (\`${plan.modelLabel}\`), judge: Sonnet subagents`,
    '',
    '| item | translation | validator errors | judge (acc/comp/term/flu → overall) |',
    '| --- | --- | --- | --- |',
  ];
  for (const i of activeItems(plan)) {
    const s = status.items[i.key] ?? {};
    const errs = (s.validation ?? s.violations ?? []).filter((v) => v.severity === 'error').length;
    const j = s.judge;
    const judge = s.judgeState === 'judged' && j ? `${j.accuracy}/${j.completeness}/${j.terminology}/${j.fluency} → **${j.overall}**` : (s.judgeState ?? '-');
    lines.push(`| \`${i.key}\` (${i.action}) | ${s.state ?? s.recordState ?? '-'} | ${errs} | ${judge} |`);
  }
  const withFindings = activeItems(plan).filter((i) => {
    const s = status.items[i.key] ?? {};
    return (s.validation ?? s.violations ?? []).length || s.judge?.issues?.length || s.disagreement?.length || s.message;
  });
  if (withFindings.length) lines.push('', '## Findings');
  for (const i of withFindings) {
    const s = status.items[i.key];
    lines.push('', `### ${i.key}`, '', `target: \`${i.target}\``);
    if (s.message) lines.push('', `note: ${s.message}`);
    for (const v of s.validation ?? s.violations ?? []) lines.push(`- validator ${v.severity}: [${v.code}] ${v.message}`);
    for (const d of s.disagreement ?? []) lines.push(`- VALIDATOR DISAGREES with the judge: ${d}`);
    for (const iss of s.judge?.issues ?? []) lines.push(`- judge: ${iss}`);
  }
  lines.push('', '## Reports', '');
  for (const t of new Set(activeItems(plan).map((i) => i.tree))) {
    const n = TREES[t].name;
    lines.push(`- \`${path.join(REPORTS_DIR, `translate-${n}.md`)}\``, `- \`${path.join(REPORTS_DIR, `judge-${n}.md`)}\` / \`.json\``);
  }
  fs.writeFileSync(path.join(runDir(run), 'summary.md'), lines.join('\n') + '\n', 'utf8');
}


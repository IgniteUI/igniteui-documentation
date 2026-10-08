// Turn a run's unanswered exchange prompts into subagent tasks, and check the
// answers before the engine reads them back.
//
//   node dispatch.mjs --run <id|latest> --role translate|judge [--json]
//   node dispatch.mjs --run <id|latest> --role translate|judge --check [--reset-bad]
//
// Listing: prints one block per subagent task - the model to use and the exact
// instruction text to give it. Grouping: one page body per subagent; up to
// three JSON batches (or three short single strings) per subagent; two judge
// prompts per subagent, a very large one alone. Prompts whose source is only
// placeholder tokens / punctuation or one code identifier are answered here
// with their own source text - that is what a model returns for them, and the
// engine asks them only because an unchanged batch value looked like an echo.
//
// --check: validates every answer of the run for the role (JSON shape and keys,
// placeholder tokens, labels/fences, echoes, judge scores); --reset-bad renames
// the bad ones (*.rejected-N.txt) so the next listing offers them again.
import fs from 'node:fs';
import path from 'node:path';
import {
  SKILL_SCRIPTS,
  activeItems,
  answerFileName,
  exchangeDir,
  exchangePrompts,
  fail,
  loadPlan,
  loadStatus,
  parseArgs,
  resolveRun,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2), ['check', 'reset-bad', 'json']);
const run = resolveRun(args.run);
const role = args.role;
if (!['translate', 'judge'].includes(role)) fail('--role translate|judge');
const plan = loadPlan(run);
const status = loadStatus(run);
const dir = exchangeDir(run, role);

// Only prompts that belong to an active item: a dropped item's prompts, or a
// prompt from a superseded judge pass, are never dispatched.
const field = role === 'judge' ? 'judgePrompts' : 'prompts';
const owned = new Map();
for (const i of activeItems(plan)) {
  for (const h of status.items[i.key]?.[field] ?? []) owned.set(h, [...(owned.get(h) ?? []), i.key]);
}
const prompts = exchangePrompts(dir).filter((p) => owned.has(p.hash));

// ---------------------------------------------------------------- parsing

const TOKEN = /__[A-Z]+_?\d+__/g;
const readPrompt = (p) => fs.readFileSync(p.promptFile, 'utf8');
const sourceOf = (prompt) => prompt.match(/<source>\n([\s\S]*?)\n<\/source>/)?.[1];

function trailingJson(prompt) {
  const start = prompt.lastIndexOf('\n{');
  if (start < 0) return null;
  try {
    return JSON.parse(prompt.slice(start + 1));
  } catch {
    return null;
  }
}

function extractJson(text) {
  let t = text.trim();
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) t = fence[1].trim();
  const a = t.indexOf('{');
  const b = t.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(t.slice(a, b + 1));
  } catch {
    return null;
  }
}

/** Only tokens / punctuation / digits, or one code-shaped identifier: nothing to translate. */
function isTrivial(src) {
  const s = src.replace(TOKEN, ' ').trim();
  if (!s || /^[\p{P}\p{S}\s\d]*$/u.test(s)) return true;
  return /^[A-Za-z_$][\w$.-]*(\(\))?$/.test(s) && (/[a-z][A-Z]|[._$-]|\(\)|\d/.test(s) || /^[A-Z][A-Z0-9_]+$/.test(s));
}

const tokenBag = (s) => (s.match(TOKEN) ?? []).sort().join(' ');
const longLines = (text) => text.split('\n').some((l) => l.length > 2000);

function kindOf(p, text) {
  if (role === 'judge') return 'judge';
  if (p.meta.json) {
    const obj = trailingJson(text);
    return obj && Object.values(obj).every((v) => isTrivial(String(v))) ? 'echo-json' : 'batch';
  }
  const src = sourceOf(text) ?? '';
  if (isTrivial(src)) return 'echo';
  // A page body (or a multi-line spliced block) gets its own subagent; a
  // single line - a fallback string, a one-paragraph block - can share one.
  return src.trim().includes('\n') || src.length >= 1500 ? 'body' : 'short';
}

// ------------------------------------------------------------ instructions

const TRANSLATE_RULES =
  "output ONLY the translation, no preamble, no commentary, no code fences, no 'Translation:' label; " +
  'reproduce every placeholder token of the form __WORD_n__ exactly once and unchanged, in a position that ' +
  'fits the target language; keep the exact leading whitespace of every line and keep blank lines where ' +
  'they are; never reflow, summarize, skip or shorten anything';
const JSON_RULES =
  'the file ends with a JSON object whose values are the strings to translate; your answer is a JSON object ' +
  'with the SAME keys, every value translated, and nothing else (no preamble, no commentary, no code fences); ' +
  'follow the RULES in the prompt and reproduce every __WORD_n__ token exactly once inside the value it came from';
const READ_ALL =
  'Read the prompt file completely; if one Read does not return the whole file, continue with offset until the end.';
const LONG_NOTE = (files) =>
  ` Note: ${files.join(', ')} ${files.length > 1 ? 'contain' : 'contains'} lines longer than 2000 characters; ` +
  'if a Read result shows any line cut off, read that file with the Bash tool (cat "<path>") instead so you see every character.';

function pairs(task) {
  return task.prompts
    .map((p, n) => `${task.prompts.length > 1 ? `(${n + 1}) ` : ''}Prompt file: ${p.promptFile}. Answer file: ${p.answerFile}.`)
    .join(' ');
}

function instruction(task) {
  const many = task.prompts.length > 1;
  const longs = task.prompts.filter((p) => p.long).map((p) => path.basename(p.promptFile));
  const note = longs.length ? LONG_NOTE(longs) : '';
  if (task.kind === 'judge') {
    return (
      `You are the reviewer model behind a translation quality pipeline. Your only job is to answer ${many ? 'two prompts' : 'one prompt'} ` +
      `stored in ${many ? 'files' : 'a file'} and write ${many ? 'each answer to its answer file' : 'the answer to another file'}. ${pairs(task)} ` +
      `${many ? 'For each prompt: ' : ''}Read the prompt file completely, through the closing </translation> line; if one Read does not ` +
      'return the whole file, continue with offset until the end - do not score from a partial read. Compare the translation ' +
      'against the English source and score it exactly as the prompt instructs, judging only from the file. Produce ONLY the ' +
      'JSON object the prompt asks for, with integer scores 1-5 and concrete, quotable issues, and write it verbatim to the ' +
      `answer file with the Write tool.${many ? ' Score the two prompts independently of each other.' : ''} Do not read, create or ` +
      `modify any other file.${note} Reply with one line per answer: '<answer file name>: written, overall <n>'.`
    );
  }
  const json = task.kind === 'batch';
  return (
    'You are the translation model behind a documentation translation pipeline. ' +
    (many
      ? `Your only job is to answer ${task.prompts.length} prompts, each stored in its own file, and write each answer to its own answer file. The prompts are independent: answer each one only from its own file. `
      : 'Your only job is to answer one prompt that is stored in a file and write the answer to another file. ') +
    `${pairs(task)} Steps${many ? ', for each prompt in turn' : ''}: 1. ${READ_ALL} 2. The file is a complete prompt addressed to you. ` +
    (json
      ? `Produce the response it asks for: ${JSON_RULES}. `
      : `Produce the response it asks for, following its RULES exactly: ${TRANSLATE_RULES}. `) +
    `3. Write the response verbatim to ${many ? "that prompt's" : 'the'} answer file with the Write tool. ` +
    `Do not read, create or modify any other file.${note} ` +
    `Reply with one line${many ? ' per answer' : ''}: '<answer file name>: written, <${json ? 'keys' : 'lines'}> ${json ? 'keys' : 'lines'}'.`
  );
}

// ------------------------------------------------------------------ check

function checkAnswer(p) {
  const prompt = readPrompt(p);
  let answer = fs.readFileSync(p.answerFile, 'utf8').replace(/^﻿/, '');
  const notes = [];
  if (answer.includes('\r\n')) {
    answer = answer.replaceAll('\r\n', '\n');
    fs.writeFileSync(p.answerFile, answer, 'utf8');
    notes.push('normalized CRLF line endings to LF');
  }
  const problems = [];
  if (!answer.trim()) return { problems: ['empty answer'], notes };

  if (role === 'judge') {
    const j = extractJson(answer);
    if (!j) problems.push('not a JSON object');
    else {
      for (const k of ['accuracy', 'completeness', 'terminology', 'fluency', 'overall']) {
        if (!Number.isInteger(j[k]) || j[k] < 1 || j[k] > 5) problems.push(`"${k}" is not an integer 1-5`);
      }
      if (!Array.isArray(j.issues) || j.issues.some((x) => typeof x !== 'string')) problems.push('"issues" is not an array of strings');
    }
    return { problems, notes };
  }

  if (p.meta.json) {
    const src = trailingJson(prompt) ?? {};
    const ans = extractJson(answer);
    if (!ans) return { problems: ['not a JSON object'], notes };
    for (const [k, v] of Object.entries(src)) {
      const a = ans[k];
      if (typeof a !== 'string' || !a.trim()) problems.push(`key "${k}" missing or empty`);
      else if (tokenBag(a) !== tokenBag(String(v))) problems.push(`key "${k}": placeholder tokens differ (source: ${tokenBag(String(v)) || 'none'}; answer: ${tokenBag(a) || 'none'})`);
      else if (a.trim() === String(v).trim() && !isTrivial(String(v))) problems.push(`key "${k}" came back untranslated (the engine would re-ask it alone)`);
    }
    for (const k of Object.keys(ans)) if (!(k in src)) notes.push(`extra key "${k}" (ignored by the engine)`);
    return { problems, notes };
  }

  const src = sourceOf(prompt) ?? '';
  if (/^\s*(translation|translated text)\s*:/i.test(answer)) problems.push("starts with a 'Translation:' label");
  if (/^\s*```/.test(answer) && !/^\s*```/.test(src)) problems.push('wrapped in a code fence');
  if (tokenBag(answer) !== tokenBag(src)) {
    const need = src.match(TOKEN) ?? [];
    const got = answer.match(TOKEN) ?? [];
    const missing = need.filter((t) => !got.includes(t));
    const extra = got.filter((t, i) => got.indexOf(t) !== i || !need.includes(t));
    problems.push(`placeholder tokens differ - missing: ${missing.join(' ') || 'none'}; extra/duplicated: ${extra.join(' ') || 'none'}`);
  }
  if (answer.trim() === src.trim() && !isTrivial(src)) problems.push('identical to the source (echo)');
  const ls = src.trimEnd().split('\n').length;
  const la = answer.trimEnd().split('\n').length;
  if (Math.abs(ls - la) > Math.max(2, ls * 0.1)) notes.push(`line count ${la} vs source ${ls} - check nothing was merged or dropped`);
  return { problems, notes };
}

if (args.check) {
  let ok = 0;
  const bad = [];
  for (const p of prompts.filter((x) => x.answered)) {
    const { problems, notes } = checkAnswer(p);
    for (const n of notes) console.log(`  note ${p.hash}: ${n}`);
    if (problems.length) bad.push({ p, problems });
    else ok++;
  }
  const missing = prompts.filter((x) => !x.answered);
  console.log(`${ok} answer(s) OK, ${bad.length} with problems, ${missing.length} still unanswered (${role}, run ${run})`);
  for (const { p, problems } of bad) {
    console.log(`  BAD ${p.hash} (${owned.get(p.hash).join(', ')}): ${problems.join('; ')}`);
    console.log(`      answer: ${p.answerFile}`);
    if (args['reset-bad']) {
      let n = 1;
      while (fs.existsSync(p.answerFile.replace(/\.txt$/, `.rejected-${n}.txt`))) n++;
      fs.renameSync(p.answerFile, p.answerFile.replace(/\.txt$/, `.rejected-${n}.txt`));
      console.log('      -> set aside; the next listing offers this prompt again');
    }
  }
  if (bad.length && !args['reset-bad']) console.log(`\nre-answer them: node ${SKILL_SCRIPTS}/dispatch.mjs --run ${run} --role ${role} --check --reset-bad, then list again`);
  if (!bad.length && !missing.length) {
    const nextStep = role === 'judge' ? 'judge' : 'replay';
    console.log(`\nnext: node ${SKILL_SCRIPTS}/run.mjs --run ${run} --step ${nextStep}`);
  }
  process.exit(bad.length ? 1 : 0);
}

// ------------------------------------------------------------------- list

const pending = prompts.filter((p) => !p.answered);
const echoed = [];
const work = [];
for (const p of pending) {
  const text = readPrompt(p);
  const kind = kindOf(p, text);
  if (kind === 'echo' || kind === 'echo-json') {
    const answer = kind === 'echo' ? sourceOf(text) : JSON.stringify(trailingJson(text));
    // The engine re-asks an unchanged reply once (attempt 2), so answer both.
    for (let a = 1; a <= Math.max(2, p.attempt); a++) {
      const f = path.join(dir, answerFileName(p.hash, a));
      if (!fs.existsSync(f)) fs.writeFileSync(f, answer, 'utf8');
    }
    echoed.push(p);
    continue;
  }
  work.push({ ...p, kind, long: longLines(text) });
}

const tasks = [];
const bySize = (a, b) => b.meta.chars - a.meta.chars;
for (const p of work.filter((x) => x.kind === 'body').sort(bySize)) tasks.push({ kind: 'body', prompts: [p] });
for (const kind of ['batch', 'short']) {
  const list = work.filter((x) => x.kind === kind).sort(bySize);
  for (let i = 0; i < list.length; i += 3) tasks.push({ kind, prompts: list.slice(i, i + 3) });
}
const judges = work.filter((x) => x.kind === 'judge').sort(bySize);
for (const p of judges.filter((x) => x.meta.chars > 50_000)) tasks.push({ kind: 'judge', prompts: [p] });
const small = judges.filter((x) => x.meta.chars <= 50_000);
for (let i = 0; i < small.length; i += 2) tasks.push({ kind: 'judge', prompts: small.slice(i, i + 2) });

const model = role === 'judge' ? 'sonnet' : plan.model;
const out = tasks.map((t, n) => ({
  task: n + 1,
  kind: t.kind,
  model,
  chars: t.prompts.reduce((s, p) => s + p.meta.chars, 0),
  items: [...new Set(t.prompts.flatMap((p) => owned.get(p.hash)))],
  prompts: t.prompts.map((p) => ({ hash: p.hash, attempt: p.attempt, promptFile: p.promptFile, answerFile: p.answerFile, preview: p.meta.preview })),
  instruction: instruction(t),
}));

if (args.json) {
  console.log(JSON.stringify({ run, role, echoed: echoed.map((p) => p.hash), tasks: out }, null, 2));
  process.exit(0);
}
if (echoed.length) {
  console.log(`answered ${echoed.length} trivial prompt(s) with their own source text: ${echoed.map((p) => `${p.hash}@${p.attempt}`).join(', ')}`);
}
if (!out.length) {
  console.log(`no ${role} prompts waiting for a model in run ${run}.`);
  console.log(`next: node ${SKILL_SCRIPTS}/dispatch.mjs --run ${run} --role ${role} --check`);
  process.exit(0);
}
console.log(
  `${out.length} subagent task(s) for ${pending.length - echoed.length} prompt(s) - role ${role}, model ${model}` +
    (role === 'judge' ? ' (the judge is always Sonnet)' : '') +
    '. Spawn one Agent per task with that model, in parallel (at most 8 at a time), passing the instruction text verbatim.\n',
);
for (const t of out) {
  const retry = t.prompts.some((p) => p.attempt > 1) ? ' · RETRY (fresh subagent)' : '';
  console.log(`=== task ${t.task}/${out.length} · ${t.kind} · model: ${t.model} · ${t.chars.toLocaleString('en-US')} chars${retry} · ${t.items.join(', ')}`);
  for (const p of t.prompts) console.log(`    ${p.hash}@${p.attempt}  ${p.preview}`);
  console.log(t.instruction);
  console.log('');
}
console.log(`when every task has replied: node ${SKILL_SCRIPTS}/dispatch.mjs --run ${run} --role ${role} --check`);

// Build a translation run plan: which EN pages, which locales, and per pair
// whether the engine should `translate` (no translation yet) or `sync` (splice
// only the changed blocks into the existing translation).
//
//   node plan.mjs changed [--base vnext] [--locale ja,kr] [--tree xplat] [--model opus|sonnet] [--include-non-toc]
//   node plan.mjs pick [N] [--dir <subdir>] [--tree ..] [--locale ..] [--model ..] [--include-non-toc]
//   node plan.mjs files <tree>:<rel>[,<tree>:<rel>] [--base <ref>] [--locale ..] [--model ..]
//       named pages; an unstamped existing translation is spliced from --base
//       (the EN version it matches) or, without --base, left out
//   node plan.mjs retranslate --locale <code> (--file <rel>[,<rel>] | --dir <subdir> [N]) [--tree xplat|angular]
//                             [--model ..] [--include-stamped] [--include-non-toc] [--force]
//       FULL re-translation of pages that already have a translation (the
//       /retranslate skill): one locale, tree default xplat, --dir picks the
//       first N (default 3) unstamped translated pages in alphabetical order.
//       Refuses when a selected target has uncommitted changes, unless --force.
//   node plan.mjs set --run <id|latest> --item <tree:locale:rel> --action translate|skip
//   node plan.mjs show [--run <id|latest>]
//
// Writes tools/translate-engine/data/runs/<run>/plan.json (gitignored) and prints it.
import fs from 'node:fs';
import path from 'node:path';
import {
  MODEL_LABELS,
  SEAT,
  SKILL_SCRIPTS,
  TREES,
  activeItems,
  blobSha,
  classify,
  enDir,
  enFiles,
  fail,
  git,
  gitBlob,
  gitDirty,
  gitShow,
  itemKey,
  localeOf,
  loadPlan,
  newRunId,
  parseArgs,
  parseLocales,
  parseTrees,
  readText,
  repoAbs,
  resolveRun,
  runDir,
  runsThatWrote,
  savePlan,
  targetRel,
  tocCoverage,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2), ['include-non-toc', 'full', 'include-stamped', 'force']);
const mode = args._[0];

function modelOf(arg) {
  const m = arg ?? 'opus';
  if (!MODEL_LABELS[m]) fail(`--model must be opus or sonnet (got "${m}")`);
  return m;
}

/** Write an old EN blob where `sync --base-file` can read it. */
function baseFile(run, sha) {
  const file = path.join(runDir(run), 'bases', `${sha}.mdx`);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, gitBlob(sha), 'utf8');
  }
  return file;
}

/**
 * Decide the engine action for one (page, locale). `mergeBase` is set in
 * `changed` mode: an unstamped translation (human/legacy) is assumed to match
 * EN at the merge base, so only the blocks changed since then are spliced.
 */
function decide(run, tree, rel, code, enSha, mergeBase) {
  const c = classify(tree, rel, code, enSha);
  const base = { tree, rel, locale: code, target: c.target, enSha };
  if (c.state === 'missing') {
    return { ...base, action: 'translate', reason: c.legacy ? 'no .mdx translation (a legacy docfx .md exists, not built)' : 'no translation yet' };
  }
  if (c.state === 'current') return { ...base, action: 'skip', reason: 'stamp matches the EN page - already current' };
  if (c.state === 'stale') {
    if (c.baseAvailable) {
      return { ...base, action: 'sync', baseFile: baseFile(run, c.stamp.source_sha), reason: `stamped translation is stale - splice against the EN it was made from (${c.stamp.source_sha.slice(0, 10)})` };
    }
    return { ...base, action: 'translate', warn: 'overwrites the existing (machine) translation', reason: 'stamped, but the EN it was made from is not in this clone - full re-translation' };
  }
  // unstamped: a human or legacy translation
  if (!mergeBase) {
    return { ...base, action: 'skip', reason: 'unstamped existing translation (human/legacy) - left as is; to update it: plan.mjs files ... --base <EN ref it matches> or --full' };
  }
  const enAtBase = gitShow(mergeBase, `${enDir(tree)}/${rel}`);
  if (enAtBase === undefined) {
    return { ...base, action: 'translate', warn: 'overwrites an existing translation of a page that is new on this branch', reason: 'EN page is new on this branch but a translation already exists' };
  }
  if (blobSha(enAtBase) === enSha) return { ...base, action: 'skip', reason: 'EN unchanged vs the merge base' };
  return { ...base, action: 'sync', base: mergeBase, reason: 'existing translation - splice the blocks changed since the merge base' };
}

function translationsOf(tree, rel, locales) {
  return locales.map((c) => targetRel(tree, c, rel)).filter((p) => fs.existsSync(repoAbs(p)));
}

function changed(run, locales, trees) {
  const baseRef = args.base ?? 'vnext';
  let mergeBase;
  try {
    mergeBase = git(['merge-base', 'HEAD', baseRef]).trim();
  } catch {
    fail(`cannot find the merge base of HEAD and "${baseRef}" (pass --base <ref>)`);
  }
  const items = [];
  const skipped = [];
  const deleted = [];
  const renamed = [];
  for (const tree of trees) {
    const dir = enDir(tree);
    const covered = tocCoverage(tree);
    const changedRels = new Set();
    const rec = git(['diff', '--name-status', '-z', '-M', mergeBase, '--', dir]).split('\0');
    for (let i = 0; i < rec.length - 1; ) {
      const status = rec[i++];
      if (!status) continue;
      const a = rec[i++];
      const b = status.startsWith('R') || status.startsWith('C') ? rec[i++] : undefined;
      const relA = a.slice(dir.length + 1);
      if (!/\.mdx?$/.test(a)) continue;
      if (status === 'D') deleted.push({ tree, rel: relA, translations: translationsOf(tree, relA, locales) });
      else if (status.startsWith('R')) {
        const relB = b.slice(dir.length + 1);
        renamed.push({ tree, from: relA, to: relB, translations: translationsOf(tree, relA, locales) });
        changedRels.add(relB);
      } else changedRels.add(b ? b.slice(dir.length + 1) : relA);
    }
    const untracked = git(['ls-files', '-z', '--others', '--exclude-standard', '--', dir]).split('\0');
    for (const p of untracked) if (/\.mdx?$/.test(p)) changedRels.add(p.slice(dir.length + 1));

    for (const rel of [...changedRels].sort()) {
      if (!covered(rel) && !args['include-non-toc']) {
        skipped.push({ tree, rel, reason: 'not linked from the TOC (the jp-sync workflows skip these too; --include-non-toc to translate)' });
        continue;
      }
      const enSha = blobSha(readText(repoAbs(`${dir}/${rel}`)));
      for (const code of locales) items.push(decide(run, tree, rel, code, enSha, mergeBase));
    }
  }
  return { mergeBase, baseRef, items, skipped, deleted, renamed };
}

function pick(run, locales, trees) {
  const n = Number(args._[1] ?? 3);
  if (!Number.isInteger(n) || n < 1) fail('pick N: N must be a positive integer');
  const pages = [];
  for (const tree of trees) {
    const covered = tocCoverage(tree);
    const scope = args.dir ? String(args.dir).replace(/\/+$/, '') : undefined;
    for (const rel of enFiles(tree)) {
      if (scope && rel !== scope && !rel.startsWith(`${scope}/`)) continue;
      if (!covered(rel) && !args['include-non-toc']) continue;
      const enSha = blobSha(readText(repoAbs(`${enDir(tree)}/${rel}`)));
      const states = locales.map((c) => ({ c, s: classify(tree, rel, c, enSha).state }));
      const stale = states.some((x) => x.s === 'stale');
      const missing = states.some((x) => x.s === 'missing');
      if (stale || missing) pages.push({ tree, rel, enSha, rank: stale ? 0 : 1 });
    }
  }
  pages.sort((a, b) => a.rank - b.rank || a.tree.localeCompare(b.tree) || a.rel.localeCompare(b.rel));
  const chosen = pages.slice(0, n);
  const items = chosen.flatMap((p) => locales.map((c) => decide(run, p.tree, p.rel, c, p.enSha)));
  return { items, skipped: [], deleted: [], renamed: [], remaining: pages.length - chosen.length };
}

function files(run, locales) {
  const specs = String(args._[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!specs.length) fail('files: name the pages as <tree>:<rel>[,<tree>:<rel>]');
  let mergeBase;
  if (args.base) {
    try {
      mergeBase = git(['rev-parse', '--verify', `${args.base}^{commit}`]).trim();
    } catch {
      fail(`unknown --base "${args.base}"`);
    }
  }
  const items = [];
  for (const spec of specs) {
    const tree = spec.slice(0, spec.indexOf(':'));
    const rel = spec.slice(spec.indexOf(':') + 1);
    if (!TREES[tree]) fail(`"${spec}": prefix the page with xplat: or angular:`);
    const en = readText(repoAbs(`${enDir(tree)}/${rel}`));
    if (en === undefined) fail(`no EN page ${enDir(tree)}/${rel}`);
    const enSha = blobSha(en);
    for (const code of locales) {
      const d = decide(run, tree, rel, code, enSha, mergeBase);
      if (args.full && d.action !== 'translate') {
        items.push({ ...d, action: 'translate', base: undefined, baseFile: undefined, warn: 'overwrites the existing translation', reason: 'full translation requested (--full)' });
      } else items.push(d);
    }
  }
  return { mergeBase, baseRef: args.base, items, skipped: [], deleted: [], renamed: [] };
}

/**
 * /retranslate: replace EXISTING translations with a fresh full translation.
 * Eligible = the page has a translation in this locale and it carries no stamp
 * (not yet produced by this process); --include-stamped adds stamped ones.
 * Finished pages get stamped, so repeating the same --dir command continues
 * where the last batch stopped.
 */
function retranslate() {
  if (!args.locale) fail('--locale is required: one locale per run (ja, kr, es, pt-br)');
  const locales = parseLocales(args.locale);
  if (locales.length !== 1) fail(`one locale per run - got ${locales.join(', ')}`);
  const code = locales[0];
  const tree = args.tree ?? 'xplat';
  if (!TREES[tree]) fail('--tree must be xplat or angular (one tree per run)');
  if (!args.file === !args.dir) fail('name the pages with --file <rel>[,<rel>] or a folder with --dir <subdir> [N] - exactly one of the two');
  const folder = localeOf(code).folder;
  const notes = [];

  let candidates;
  let n = Infinity;
  if (args.file) {
    candidates = String(args.file).split(',').map((s) => s.trim().replaceAll('\\', '/')).filter(Boolean);
    const covered = tocCoverage(tree);
    for (const rel of candidates) {
      if (readText(repoAbs(`${enDir(tree)}/${rel}`)) === undefined) fail(`no EN page ${enDir(tree)}/${rel}`);
      if (!covered(rel)) notes.push(`${rel} is not linked from any TOC (taken anyway - it was named explicitly)`);
    }
  } else {
    n = Number(args._[1] ?? 3);
    if (!Number.isInteger(n) || n < 1) fail('--dir <subdir> N: N must be a positive integer');
    const scope = String(args.dir).replaceAll('\\', '/').replace(/\/+$/, '');
    const covered = tocCoverage(tree);
    const all = enFiles(tree).filter((rel) => rel === scope || rel.startsWith(`${scope}/`));
    if (!all.length) fail(`no EN pages under ${enDir(tree)}/${scope}`);
    candidates = all.filter((rel) => args['include-non-toc'] || covered(rel));
    if (all.length > candidates.length) notes.push(`${all.length - candidates.length} page(s) under ${scope} are not linked from any TOC and were left out (--include-non-toc)`);
  }

  const eligible = [];
  const noTranslation = [];
  const stamped = [];
  for (const rel of candidates) {
    const enSha = blobSha(readText(repoAbs(`${enDir(tree)}/${rel}`)));
    const c = classify(tree, rel, code, enSha);
    if (c.state === 'missing') noTranslation.push(rel);
    else if (c.state === 'unstamped' || args['include-stamped']) eligible.push({ rel, enSha, c });
    else stamped.push(rel);
  }
  const chosen = eligible.slice(0, n);

  const list = (rels) => (args.file ? `: ${rels.join(', ')}` : '');
  if (noTranslation.length) {
    notes.push(`${noTranslation.length} page(s) have no ${folder}/ translation at all - not this skill's job, use /translate-all${list(noTranslation)}`);
  }
  if (stamped.length) {
    notes.push(`${stamped.length} page(s) already carry a stamp (made by this process) and were left out - --include-stamped to redo them${list(stamped)}`);
  }

  const items = chosen.map(({ rel, enSha, c }) => ({
    tree,
    rel,
    locale: code,
    target: c.target,
    enSha,
    enBytes: Buffer.byteLength(readText(repoAbs(`${enDir(tree)}/${rel}`)), 'utf8'),
    action: 'translate',
    retranslate: true,
    warn: 'replaces the existing translation',
    reason: c.state === 'unstamped' ? 'existing translation without a stamp - full re-translation' : `stamped (${c.state}) - full re-translation (--include-stamped)`,
  }));

  // Never clobber a reviewer's uncommitted work: check the targets before anything runs.
  const dirty = gitDirty(items.map((i) => i.target));
  if (dirty.size) {
    const lines = [...dirty].map((t) => {
      const key = itemKey(items.find((i) => i.target === t));
      const runs = runsThatWrote(key);
      return `  ${t}${runs.length ? ` (written by run ${runs.join(', ')} - if that run never stamped, finish it: stamp.mjs --run ${runs[runs.length - 1]})` : ''}`;
    });
    if (!args.force) {
      fail(`${dirty.size} selected translation(s) have uncommitted changes; retranslating would overwrite them:\n${lines.join('\n')}\nCommit or discard those changes first, or pass --force to overwrite them.`);
    }
    notes.push(`--force: ${dirty.size} target(s) with uncommitted changes WILL be overwritten:\n${lines.join('\n')}`);
  }

  return {
    locales,
    trees: [tree],
    force: Boolean(args.force && dirty.size),
    items,
    notes,
    skipped: [],
    deleted: [],
    renamed: [],
    remaining: args.dir ? eligible.length - chosen.length : undefined,
    scope: args.dir ? String(args.dir) : undefined,
  };
}

function printPlan(plan) {
  const act = activeItems(plan);
  console.log(`run ${plan.run}  (${plan.mode}${plan.mergeBase ? `, merge base ${plan.mergeBase.slice(0, 10)} of ${plan.baseRef}` : ''})`);
  console.log(`translation model: ${plan.model} (${plan.modelLabel}); judge: Sonnet subagents`);
  console.log(`plan: ${path.join(runDir(plan.run), 'plan.json')}\n`);
  for (const i of plan.items) {
    const how = i.action === 'sync' ? (i.baseFile ? 'sync --base-file' : `sync --base ${i.base.slice(0, 10)}`) : i.retranslate && i.action === 'translate' ? 'retranslate' : i.action;
    const size = i.enBytes ? ` (EN ${(i.enBytes / 1024).toFixed(1)} KB)` : '';
    console.log(`  ${how.padEnd(22)} ${itemKey(i)}${size}  - ${i.reason}${i.warn ? `  [WARNING: ${i.warn}]` : ''}`);
  }
  for (const s of plan.skipped) console.log(`  ${'skip'.padEnd(22)} ${s.tree}:${s.locale ? `${s.locale}:` : ''}${s.rel}  - ${s.reason}`);
  for (const r of plan.renamed) console.log(`  renamed: ${r.tree}:${r.from} -> ${r.to}; translations at the OLD path: ${r.translations.join(', ') || 'none'}`);
  for (const d of plan.deleted) console.log(`  deleted EN page: ${d.tree}:${d.rel}; translations left behind: ${d.translations.join(', ') || 'none'}`);
  for (const n of plan.notes ?? []) console.log(`  note: ${n}`);
  if (plan.remaining !== undefined) {
    console.log(
      plan.mode === 'retranslate'
        ? `\n${plan.remaining} more unstamped page(s) under ${plan.scope} after this batch - finished pages get stamped, so repeating the same command continues with the next ones.`
        : `\n${plan.remaining} more page(s) still need translation after this batch.`,
    );
  }
  const est = act.length * (SEAT.translate + SEAT.judge);
  console.log(
    `\nper page and locale: ~${SEAT.translate / 1000}k tokens translating + ~${SEAT.judge / 1000}k judging (measured average; long pages cost more).` +
      `\n${act.length} page-locale pair(s) to translate and judge. Rough seat usage: ~${Math.round((act.length * SEAT.translate) / 1000)}k tokens ` +
      `translating + ~${Math.round((act.length * SEAT.judge) / 1000)}k judging = ~${(est / 1e6).toFixed(1)}M ` +
      `(full-page figure; a sync that splices a few blocks costs a fraction).`,
  );
  if (est > SEAT.confirmAbove) console.log('ABOVE the confirmation threshold - ask the user before answering prompts.');
  if (act.some((i) => i.warn)) console.log('Some items OVERWRITE an existing translation - confirm with the user first.');
  if (act.length) console.log(`\nnext: node ${SKILL_SCRIPTS}/run.mjs --run ${plan.run} --step record`);
}

if (['changed', 'pick', 'files', 'retranslate'].includes(mode)) {
  const run = newRunId();
  const model = modelOf(args.model);
  let locales;
  let trees;
  let body;
  if (mode === 'retranslate') ({ locales, trees, ...body } = retranslate());
  else {
    locales = parseLocales(args.locale);
    trees = parseTrees(args.tree);
    body = mode === 'changed' ? changed(run, locales, trees) : mode === 'pick' ? pick(run, locales, trees) : files(run, locales);
  }
  const items = body.items.map((i) => ({ key: itemKey(i), ...i }));
  const plan = {
    run,
    createdAt: new Date().toISOString(),
    mode,
    model,
    modelLabel: MODEL_LABELS[model],
    locales,
    trees,
    ...body,
    items: items.filter((i) => i.action !== 'skip'),
    skipped: [...body.skipped, ...items.filter((i) => i.action === 'skip').map((i) => ({ tree: i.tree, rel: i.rel, locale: i.locale, reason: i.reason }))],
  };
  if (!plan.items.length) {
    for (const s of plan.skipped) console.log(`  skip ${s.tree}:${s.locale ? `${s.locale}:` : ''}${s.rel} - ${s.reason}`);
    for (const r of plan.renamed) console.log(`  renamed: ${r.tree}:${r.from} -> ${r.to}; translations at the OLD path: ${r.translations.join(', ') || 'none'}`);
    for (const d of plan.deleted) console.log(`  deleted EN page: ${d.tree}:${d.rel}; translations left behind: ${d.translations.join(', ') || 'none'}`);
    for (const n of plan.notes ?? []) console.log(`  note: ${n}`);
    console.log(
      mode === 'changed'
        ? `nothing to translate: no EN page changed on this branch since the merge base ${plan.mergeBase.slice(0, 10)} of ${plan.baseRef} needs work.`
        : mode === 'retranslate'
          ? 'nothing to retranslate: no page in the selection has an existing translation without a stamp (see the notes).'
          : 'nothing to translate: every page in scope is current or has an (unstamped) existing translation.',
    );
    process.exit(0);
  }
  savePlan(run, plan);
  printPlan(plan);
} else if (mode === 'set') {
  const run = resolveRun(args.run);
  const plan = loadPlan(run);
  const item = plan.items.find((i) => i.key === args.item);
  if (!item) fail(`no item "${args.item}" in run ${run}`);
  if (!['translate', 'skip'].includes(args.action)) fail('--action must be translate or skip');
  item.action = args.action;
  if (args.action === 'translate') {
    delete item.base;
    delete item.baseFile;
    if (fs.existsSync(repoAbs(item.target))) item.warn = 'overwrites the existing translation';
    item.reason = 'switched to a full translation';
  } else item.reason = 'dropped from this run';
  savePlan(run, plan);
  console.log(`${item.key}: ${item.action}${item.action === 'translate' ? ' - re-run the record step for it: run.mjs --step record --only ' + item.key : ''}`);
} else if (mode === 'show') {
  printPlan(loadPlan(resolveRun(args.run)));
} else {
  console.error('usage: node plan.mjs changed|pick|files|retranslate|set|show [options] - see the header of this file');
  process.exit(1);
}

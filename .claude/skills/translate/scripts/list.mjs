// Which EN pages still need translation, per tree and locale, and why.
//
//   node list.mjs [--tree xplat|angular] [--locale ja,kr] [--dir <subdir>] [--include-non-toc] [--files] [--json]
//
// The state comes from the `_translation` stamp in each TRANSLATED file:
//   missing    no translation file                        -> needs translation
//   stale      stamped, EN page changed since (by blob id) -> needs translation
//   current    stamped with today's EN blob id            -> done
//   unstamped  a translation without a stamp (human / legacy). Treated as
//              translated-but-unverified: listed separately, never picked by
//              /translate-all. "EN newer" is a git-history HEURISTIC only: the
//              EN page has a commit later than the translation's last commit.
// Pages no TOC links to are left out (the jp-sync workflows skip them too)
// unless --include-non-toc.
import {
  LOCALES,
  TREES,
  blobSha,
  classify,
  enDir,
  enFiles,
  lastCommitTimes,
  parseArgs,
  parseLocales,
  parseTrees,
  readText,
  repoAbs,
  tocCoverage,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2), ['include-non-toc', 'files', 'json']);
const locales = parseLocales(args.locale);
const trees = parseTrees(args.tree);
const scope = args.dir ? String(args.dir).replace(/\/+$/, '') : undefined;

const result = {};
for (const tree of trees) {
  const covered = tocCoverage(tree);
  const all = enFiles(tree).filter((rel) => !scope || rel === scope || rel.startsWith(`${scope}/`));
  const pages = all.filter((rel) => args['include-non-toc'] || covered(rel));
  const times = lastCommitTimes(TREES[tree].contentDir);
  const r = { pages: pages.length, nonToc: all.length - pages.length, locales: {} };
  for (const code of locales) {
    r.locales[code] = { missing: [], stale: [], current: [], unstamped: [], unstampedEnNewer: [], legacy: 0, staleNoBase: 0 };
  }
  for (const rel of pages) {
    const enPath = `${enDir(tree)}/${rel}`;
    const enSha = blobSha(readText(repoAbs(enPath)));
    const enTime = times.get(enPath) ?? Infinity;
    for (const code of locales) {
      const c = classify(tree, rel, code, enSha);
      const bucket = r.locales[code];
      bucket[c.state].push(rel);
      if (c.legacy) bucket.legacy++;
      if (c.state === 'stale' && !c.baseAvailable) bucket.staleNoBase++;
      if (c.state === 'unstamped' && enTime !== Infinity && enTime > (times.get(c.target) ?? Infinity)) {
        bucket.unstampedEnNewer.push(rel);
      }
    }
  }
  result[tree] = r;
}

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

const name = (code) => LOCALES.find((l) => l.code === code);
for (const [tree, r] of Object.entries(result)) {
  console.log(
    `\n${tree} (${TREES[tree].contentDir}) - ${r.pages} EN page(s)${scope ? ` under ${scope}` : ''}` +
      (r.nonToc ? `; ${r.nonToc} more not linked from the TOC, left out (--include-non-toc)` : ''),
  );
  console.log('  locale (folder)      NEEDS  = missing + stale    current   unstamped (EN newer*)');
  for (const [code, b] of Object.entries(r.locales)) {
    const needs = b.missing.length + b.stale.length;
    const label = `${code} (${name(code).folder}/)`.padEnd(20);
    console.log(
      `  ${label} ${String(needs).padStart(5)}  = ${String(b.missing.length).padStart(7)} + ${String(b.stale.length).padStart(5)}` +
        `    ${String(b.current.length).padStart(7)}   ${String(b.unstamped.length).padStart(9)} (${b.unstampedEnNewer.length})`,
    );
    const notes = [];
    if (b.legacy) notes.push(`${b.legacy} of the missing have only a legacy docfx .md (not built by Astro)`);
    if (b.staleNoBase) notes.push(`${b.staleNoBase} stale page(s) need a full re-translation (their old EN is not in this clone)`);
    for (const n of notes) console.log(`      ${n}`);
    if (args.files) {
      for (const rel of b.missing) console.log(`      missing    ${rel}`);
      for (const rel of b.stale) console.log(`      stale      ${rel}  (EN changed since the stamp)`);
      for (const rel of b.unstampedEnNewer) console.log(`      unstamped  ${rel}  (EN has newer commits - possibly stale, not auto-translated)`);
    }
  }
}
console.log(
  '\n* unstamped = an existing translation without a `_translation` stamp (human or legacy): counted as translated-but-unverified,' +
    '\n  never picked by /translate-all. "EN newer" is a git-history heuristic. Mark verified ones current with stamp.mjs mark.',
);

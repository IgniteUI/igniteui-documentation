// Shared helpers for the /translate, /translate-all and /translate-list skills.
// Plain Node (no dependencies) so they run before and without `npm ci`; only
// run.mjs needs the engine's node_modules (it spawns the engine CLI).
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(SCRIPTS_DIR, '../../../..');
export const ENGINE = path.join(REPO, 'tools', 'translate-engine');
const shared = await import(
  pathToFileURL(path.join(ENGINE, 'configs', 'docs-shared.mjs')).href
);
export const { TREES, LOCALES, DATA_DIR_ABS } = shared;
if (path.resolve(shared.ROOT_ABS) !== REPO) {
  throw new Error(`repo root mismatch: ${shared.ROOT_ABS} vs ${REPO}`);
}

export const RUNS_DIR = path.join(DATA_DIR_ABS, 'runs');
export const TM_DIR = path.join(DATA_DIR_ABS, 'tm');
export const REPORTS_DIR = path.join(DATA_DIR_ABS, 'reports');
export const SKILL_SCRIPTS = '.claude/skills/translate/scripts';

/** Rough harness-reported seat usage per page and locale (MODEL-EVALUATION.md §7 exp. 4). */
export const SEAT = { translate: 175_000, judge: 100_000, confirmAbove: 1_000_000 };
export const MODEL_LABELS = { opus: 'claude-opus-subagent', sonnet: 'claude-sonnet-subagent' };
export const JUDGE_LABEL = 'claude-sonnet-subagent';

// ---------------------------------------------------------------- arguments

/** Tiny argv parser: --flag value, --flag=value, --bool, positionals. */
export function parseArgs(argv, booleans = []) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      out._.push(a);
      continue;
    }
    const [k, v] = a.slice(2).split(/=(.*)/s, 2);
    if (v !== undefined) out[k] = v;
    else if (booleans.includes(k)) out[k] = true;
    else out[k] = argv[++i];
  }
  return out;
}

export function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

/** Locale codes from "--locale ja,kr" (jp accepted for ja); all four by default. */
export function parseLocales(arg) {
  if (!arg) return LOCALES.map((l) => l.code);
  const codes = String(arg)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .map((c) => (c === 'jp' ? 'ja' : c));
  for (const c of codes) {
    if (!LOCALES.some((l) => l.code === c)) {
      fail(`unknown locale "${c}" (known: ${LOCALES.map((l) => l.code).join(', ')})`);
    }
  }
  return codes;
}

export function parseTrees(arg) {
  if (!arg || arg === 'all') return Object.keys(TREES);
  const trees = String(arg).split(',').map((s) => s.trim());
  for (const t of trees) if (!TREES[t]) fail(`unknown tree "${t}" (xplat, angular)`);
  return trees;
}

export const localeOf = (code) => LOCALES.find((l) => l.code === code);

// ---------------------------------------------------------------------- git

export function git(args, opts = {}) {
  return execFileSync('git', args, {
    cwd: REPO,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', opts.quiet ? 'ignore' : 'pipe'],
  });
}

export function gitOk(args) {
  return spawnSync('git', args, { cwd: REPO, stdio: 'ignore' }).status === 0;
}

/** Content of <ref>:<repo-relative path>, or undefined when it does not exist there. */
export function gitShow(ref, repoRel) {
  try {
    return git(['show', `${ref}:${repoRel}`], { quiet: true });
  } catch {
    return undefined;
  }
}

/** The subset of these repo-relative paths with uncommitted changes (modified, staged, untracked, deleted). */
export function gitDirty(repoRels) {
  if (!repoRels.length) return new Set();
  const out = git(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', ...repoRels]);
  const dirty = new Set();
  const rec = out.split('\0');
  for (let i = 0; i < rec.length; i++) {
    if (!rec[i]) continue;
    dirty.add(rec[i].slice(3));
    if (/^[RC]/.test(rec[i])) i++; // -z puts a rename's source path in the next field
  }
  return new Set(repoRels.filter((p) => dirty.has(p)));
}

/** Raw blob by object id, or undefined when this clone does not have it. */
export function gitBlob(sha) {
  if (!/^[0-9a-f]{40}$/.test(sha ?? '')) return undefined;
  try {
    return git(['cat-file', 'blob', sha], { quiet: true });
  } catch {
    return undefined;
  }
}

// ------------------------------------------------------------ hashing, files

export const lf = (s) => s.replaceAll('\r\n', '\n');

/** git's blob id for a text file: what `git hash-object` prints for it (LF-normalized). */
export function blobSha(text) {
  const buf = Buffer.from(lf(text), 'utf8');
  return createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
}

export function readText(abs) {
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch {
    return undefined;
  }
}

export function writeJson(abs, data) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export const readJson = (abs, fallback) => {
  const t = readText(abs);
  return t === undefined ? fallback : JSON.parse(t);
};

export const posix = (p) => p.replaceAll('\\', '/');

// ------------------------------------------------------------ content trees

export const enDir = (tree) => `${TREES[tree].contentDir}/en`;
export const targetRel = (tree, code, rel) =>
  `${TREES[tree].contentDir}/${localeOf(code).folder}/${rel}`;
export const repoAbs = (repoRel) => path.join(REPO, repoRel);
export const configPath = (tree) => path.join(ENGINE, 'configs', TREES[tree].config);

/** EN pages the engine sees: tracked + untracked-not-ignored .md/.mdx that exist on disk. */
export function enFiles(tree) {
  const dir = enDir(tree);
  const out = git(['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', dir]);
  return [
    ...new Set(
      out
        .split('\0')
        .filter((p) => /\.mdx?$/.test(p) && fs.existsSync(repoAbs(p)))
        .map((p) => p.slice(dir.length + 1)),
    ),
  ].sort();
}

const stripExt = (p) => p.replace(/\.mdx?$/, '');

/**
 * The jp-sync workflows' TOC rule: a page is translated when a TOC href
 * resolves to it (.md and .mdx interchangeable) or it is a shared template.
 */
export function tocCoverage(tree) {
  const t = TREES[tree];
  const keys = new Set();
  for (const { file, base } of t.toc) {
    const abs = repoAbs(`${enDir(tree)}/${file}`);
    if (!fs.existsSync(abs)) continue;
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (!n || typeof n !== 'object') return;
      if (typeof n.href === 'string' && !/^https?:/i.test(n.href)) {
        keys.add(stripExt(path.posix.normalize(path.posix.join(base || '.', n.href.split('#')[0]))));
      }
      for (const k of ['items', 'children']) if (Array.isArray(n[k])) n[k].forEach(walk);
    };
    walk(JSON.parse(fs.readFileSync(abs, 'utf8')));
  }
  return (rel) => keys.has(stripExt(rel)) || t.templates.some((d) => rel.startsWith(`${d}/`));
}

// --------------------------------------------------------------- frontmatter

function fmBounds(lines) {
  if (lines[0]?.replace(/\r$/, '') !== '---') return null;
  for (let i = 1; i < lines.length; i++) if (/^---\s*$/.test(lines[i].replace(/\r$/, ''))) return i;
  return null;
}

/** Top-level frontmatter keys with their line ranges [start, end). */
function fmBlocks(lines, end) {
  const blocks = [];
  for (let i = 1; i < end; i++) {
    const m = lines[i].match(/^([A-Za-z_][\w.-]*)\s*:/);
    if (m) blocks.push({ key: m[1], start: i, end: i + 1 });
    else if (blocks.length && /^(\s|-)/.test(lines[i])) blocks[blocks.length - 1].end = i + 1;
  }
  return blocks;
}

function parseScalar(raw) {
  const v = raw.trim();
  if (v === '' || v === 'null' || v === '~') return null;
  if (v.startsWith('"')) return JSON.parse(v);
  if (v.startsWith("'")) return v.slice(1, -1).replaceAll("''", "'");
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

/** The `_translation` stamp of a translated file, or null. */
export function readStamp(text) {
  if (text === undefined) return null;
  const lines = text.split('\n');
  const end = fmBounds(lines);
  if (end === null) return null;
  const block = fmBlocks(lines, end).find((b) => b.key === '_translation');
  if (!block) return null;
  const stamp = {};
  for (let i = block.start + 1; i < block.end; i++) {
    const m = lines[i].replace(/\r$/, '').match(/^\s+([A-Za-z_]+):\s*(.*)$/);
    if (m) stamp[m[1]] = parseScalar(m[2]);
  }
  return stamp;
}

const q = (v) => (v === null || v === undefined ? 'null' : typeof v === 'number' ? String(v) : JSON.stringify(String(v)));

/**
 * Write (or replace) the stamp, and put back the repo's `_`-prefixed metadata
 * keys the engine drops: its sync rebuilds frontmatter from the EN keys, so
 * `_language` disappears from an existing jp/kr page. `previous` is the file's
 * last committed version; `ensureLanguage` adds `_language: <code>` when absent
 * (the jp corpus convention, see .github/workflows/sync-jp-docs-*.md).
 */
export function applyStamp(text, stamp, { previous, ensureLanguage } = {}) {
  let lines = text.split('\n');
  let end = fmBounds(lines);
  if (end === null) throw new Error('no frontmatter block');
  const old = fmBlocks(lines, end).find((b) => b.key === '_translation');
  if (old) {
    lines.splice(old.start, old.end - old.start);
    end -= old.end - old.start;
  }

  const insertAt = (blockLines, afterKey) => {
    const blocks = fmBlocks(lines, end);
    const after = afterKey && blocks.find((b) => b.key === afterKey);
    const llms = blocks.find((b) => b.key === 'llms');
    const at = after ? after.end : llms ? llms.start : end;
    lines.splice(at, 0, ...blockLines);
    end += blockLines.length;
  };

  if (previous) {
    const pLines = previous.split('\n');
    const pEnd = fmBounds(pLines);
    if (pEnd !== null) {
      const pBlocks = fmBlocks(pLines, pEnd);
      pBlocks.forEach((b, i) => {
        if (!b.key.startsWith('_') || b.key === '_translation') return;
        if (fmBlocks(lines, end).some((c) => c.key === b.key)) return;
        insertAt(pLines.slice(b.start, b.end).map((l) => l.replace(/\r$/, '')), pBlocks[i - 1]?.key);
      });
    }
  }
  if (ensureLanguage && !fmBlocks(lines, end).some((b) => b.key === '_language')) {
    insertAt([`_language: ${ensureLanguage}`]);
  }

  const block = [
    '_translation:',
    `  source_sha: ${q(stamp.source_sha)}`,
    `  model: ${q(stamp.model)}`,
    `  judge: ${q(stamp.judge)}`,
    `  judge_model: ${q(stamp.judge_model)}`,
    `  date: ${q(stamp.date)}`,
  ];
  lines.splice(end, 0, ...block);
  return lines.join('\n');
}

/**
 * The file without the target-only metadata the engine knows nothing about
 * (the stamp, `_language`). Its validator compares frontmatter shape with the
 * EN page, so these keys read as a structural defect - run.mjs hides them from
 * the engine during judge/validate and restores the file afterwards.
 */
export function stripManaged(text) {
  const lines = text.split('\n');
  const end = fmBounds(lines);
  if (end === null) return text;
  const drop = new Set();
  for (const b of fmBlocks(lines, end)) {
    if (b.key === '_translation' || b.key === '_language') {
      for (let i = b.start; i < b.end; i++) drop.add(i);
    }
  }
  return lines.filter((_, i) => !drop.has(i)).join('\n');
}

/** Content identity for "was this exact text judged": ignores the stamp and _language. */
export const contentSha = (text) => blobSha(stripManaged(text));

// ------------------------------------------------------- translation state

/**
 * State of one EN page in one locale:
 *   missing    no translation file
 *   current    stamped, and the stamp's source_sha is the EN page's blob id now
 *   stale      stamped, EN changed since (baseAvailable: the old EN is in git)
 *   unstamped  a translation without a stamp - human or legacy; never
 *              re-translated by /translate-all
 */
export function classify(tree, rel, code, enSha) {
  const tRel = targetRel(tree, code, rel);
  const text = readText(repoAbs(tRel));
  if (text === undefined) {
    const legacy = rel.endsWith('.mdx') && fs.existsSync(repoAbs(tRel.replace(/\.mdx$/, '.md')));
    return { state: 'missing', target: tRel, legacy };
  }
  const stamp = readStamp(text);
  if (!stamp?.source_sha) return { state: 'unstamped', target: tRel };
  if (stamp.source_sha === enSha) return { state: 'current', target: tRel, stamp };
  return {
    state: 'stale',
    target: tRel,
    stamp,
    baseAvailable: gitBlob(stamp.source_sha) !== undefined,
  };
}

/** Last commit time (unix seconds) per repo-relative path under a directory - one git call. */
export function lastCommitTimes(dir) {
  const out = git(['log', '--format=@%ct', '--name-only', '--', dir]);
  const times = new Map();
  let t = 0;
  for (const line of out.split('\n')) {
    if (line.startsWith('@')) t = Number(line.slice(1));
    else if (line && !times.has(line)) times.set(line, t);
  }
  return times;
}

// ---------------------------------------------------------------- runs

export const itemKey = (i) => `${i.tree}:${i.locale}:${i.rel}`;

export function newRunId() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export const runDir = (id) => path.join(RUNS_DIR, id);
export const exchangeDir = (id, role) => path.join(runDir(id), 'exchange', role);

/** "latest" -> the newest run directory (ids are timestamps, so they sort). */
export function resolveRun(arg) {
  if (arg && arg !== 'latest') {
    if (!fs.existsSync(path.join(runDir(arg), 'plan.json'))) fail(`no plan for run "${arg}"`);
    return arg;
  }
  const ids = fs.existsSync(RUNS_DIR)
    ? fs.readdirSync(RUNS_DIR).filter((d) => fs.existsSync(path.join(runDir(d), 'plan.json'))).sort()
    : [];
  if (!ids.length) fail('no run yet - create one with plan.mjs');
  return ids[ids.length - 1];
}

export const loadPlan = (id) => readJson(path.join(runDir(id), 'plan.json'));
export const savePlan = (id, plan) => writeJson(path.join(runDir(id), 'plan.json'), plan);
export const loadStatus = (id) => readJson(path.join(runDir(id), 'status.json'), { items: {} });
export const saveStatus = (id, st) => writeJson(path.join(runDir(id), 'status.json'), st);

/** Runs whose status says they wrote this item - to point at an unfinished (unstamped) run. */
export function runsThatWrote(key) {
  if (!fs.existsSync(RUNS_DIR)) return [];
  return fs
    .readdirSync(RUNS_DIR)
    .filter((id) => readJson(path.join(runDir(id), 'status.json'), { items: {} }).items?.[key]?.written)
    .sort();
}

/** Items the plan will act on (an item set to skip stays in the plan for the record). */
export const activeItems = (plan) => plan.items.filter((i) => i.action !== 'skip');

// ------------------------------------------------------------ exchange files

export const answerFileName = (hash, attempt) =>
  attempt > 1 ? `${hash}.answer-${attempt}.txt` : `${hash}.answer.txt`;

/** Every prompt in an exchange dir with its meta and whether its latest attempt is answered. */
export function exchangePrompts(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.meta.json'))
    .map((f) => {
      const hash = f.slice(0, -'.meta.json'.length);
      const meta = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const attempt = meta.requested ?? 1;
      const answerFile = path.join(dir, answerFileName(hash, attempt));
      return {
        hash,
        meta,
        attempt,
        promptFile: path.join(dir, `${hash}.prompt.txt`),
        answerFile,
        answered: fs.existsSync(answerFile),
      };
    });
}

/** hash -> mtime of its meta file; the provider rewrites the meta on every ask. */
export function metaSnapshot(dir) {
  const snap = new Map();
  if (!fs.existsSync(dir)) return snap;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.meta.json')) snap.set(f.slice(0, -10), fs.statSync(path.join(dir, f)).mtimeMs);
  }
  return snap;
}

export function askedSince(before, after) {
  return [...after].filter(([h, t]) => before.get(h) !== t).map(([h]) => h);
}

// -------------------------------------------------------------- engine CLI

export function engineCli(args, env = {}) {
  const tsx = path.join(ENGINE, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  if (!fs.existsSync(tsx)) fail('engine dependencies missing - run: npm ci --prefix tools/translate-engine');
  const r = spawnSync(process.execPath, [tsx, 'src/cli.ts', ...args], {
    cwd: ENGINE,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`
    .split('\n')
    .filter((l) => !l.startsWith('[config] preserveNames'))
    .join('\n');
  return { code: r.status ?? 1, out };
}

export function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

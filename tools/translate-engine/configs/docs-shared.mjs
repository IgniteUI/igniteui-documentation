// Shared factory for this repository's two content trees (docs/xplat and
// docs/angular). Not part of the upstream engine - see ../PROVENANCE.md.
//
// One factory, so the masking rules, locales, providers and data layout cannot
// drift between the two trees; the per-tree configs pass only what really
// differs (brand list, prompt context, attribute list, frontmatter style).
//
// Locale codes vs folders: the engine's glossary and style guide are keyed by
// locale CODE (ja, kr, es, pt-br) while this repo stores Japanese under `jp/`.
// TargetLocale keeps the two apart: { code: 'ja', dir: '.../content/jp' }.
//
// Env knobs (all optional):
//   DOCS_PROVIDER     exchange (default) | anthropic | openai | gemini
//   DOCS_MODEL        exchange: opus (default) | sonnet - a LABEL for the
//                     session subagents that answer the prompts.
//                     API providers: the real model id (required).
//   DOCS_JUDGE        exchange (default) | anthropic | openai | gemini
//   DOCS_JUDGE_MODEL  exchange: the judge label (default: Sonnet subagent).
//                     API providers: the real model id (default claude-sonnet-5).
//   DOCS_RUN          run id; the exchange directories are per run
//                     (data/runs/<run>/exchange/{translate,judge}), so one
//                     run's pending prompts never leak into the next.
//   EXCHANGE_MODE     record | replay - read by the engine's exchange provider.
//
// API keys (only for the API providers) go in configs/.env next to the config
// files - gitignored by the repository's root `.env` rule.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import componentNames from './docs-component-names.mjs';
import styleGuide from './docs-style-guide.mjs';

export const CONFIG_DIR = path.dirname(fileURLToPath(import.meta.url));
/** Repository root, relative to this directory (configs -> translate-engine -> tools -> root). */
export const ROOT = '../../..';
export const ROOT_ABS = path.resolve(CONFIG_DIR, ROOT);
/** Translation memory (tm/, committed), engine reports and per-run exchange data. */
export const DATA_DIR = '../data';
export const DATA_DIR_ABS = path.resolve(CONFIG_DIR, DATA_DIR);

/** Target locales: engine code, clear English name for the prompt, folder name in this repo. */
export const LOCALES = [
  { code: 'ja', name: 'Japanese', folder: 'jp' },
  { code: 'kr', name: 'Korean', folder: 'kr' },
  { code: 'es', name: 'Spanish', folder: 'es' },
  { code: 'pt-br', name: 'Brazilian Portuguese', folder: 'pt-br' },
];

/**
 * Layout of the two content trees. `toc` and `templates` mirror the
 * TOC-coverage rule of the jp-sync workflows (.github/workflows/sync-jp-docs-*.md):
 * only pages a TOC links to, plus the shared grid templates, are translated.
 * TOC hrefs resolve relative to `base` inside the EN tree.
 */
export const TREES = {
  xplat: {
    config: 'docs-xplat.config.mjs',
    name: 'docs-xplat',
    contentDir: 'docs/xplat/src/content',
    toc: [{ file: 'toc.json', base: 'components' }],
    templates: ['components/grids/_shared'],
  },
  angular: {
    config: 'docs-angular.config.mjs',
    name: 'docs-angular',
    contentDir: 'docs/angular/src/content',
    toc: [
      { file: 'toc.json', base: '' },
      { file: 'components/toc.json', base: 'components' },
    ],
    templates: ['grids_templates'],
  },
};

const SESSION_MODELS = { opus: 'claude-opus-subagent', sonnet: 'claude-sonnet-subagent' };
const JUDGE_SESSION_MODEL = 'claude-sonnet-subagent';

// maxTokens is a CAP, not a reservation - see the engine's configs/pilot-config.mjs.
const CLOUD = {
  anthropic: { id: 'anthropic', apiKeyEnv: 'ANTHROPIC_API_KEY', concurrency: 4, maxTokens: 32000 },
  openai: { id: 'openai', apiKeyEnv: 'OPENAI_API_KEY', concurrency: 4, maxTokens: 32000 },
  gemini: { id: 'gemini', apiKeyEnv: 'GEMINI_API_KEY', concurrency: 4, maxTokens: 32000 },
};

function exchangeDir(role) {
  const run = (process.env.DOCS_RUN ?? 'manual').replace(/[^A-Za-z0-9._-]+/g, '-');
  return path.join(DATA_DIR_ABS, 'runs', run, 'exchange', role);
}

function providerFromEnv(kind) {
  const isJudge = kind === 'judge';
  const id = (isJudge ? process.env.DOCS_JUDGE : process.env.DOCS_PROVIDER) ?? 'exchange';
  const model = isJudge ? process.env.DOCS_JUDGE_MODEL : process.env.DOCS_MODEL;
  if (id === 'exchange') {
    // The judge is ALWAYS answered by Sonnet subagents; the label says so in
    // every report header. Concurrency 1 keeps a record pass and its replay
    // asking the same prompts in the same order.
    const label = isJudge
      ? (model ?? JUDGE_SESSION_MODEL)
      : (SESSION_MODELS[model ?? 'opus'] ?? model);
    return { id: 'exchange', model: label, dir: exchangeDir(isJudge ? 'judge' : 'translate'), concurrency: 1 };
  }
  if (!CLOUD[id]) throw new Error(`DOCS_${isJudge ? 'JUDGE' : 'PROVIDER'}: unknown provider "${id}"`);
  const resolved = model ?? (isJudge ? 'claude-sonnet-5' : undefined);
  if (!resolved) throw new Error('DOCS_MODEL is required when DOCS_PROVIDER is an API provider');
  return { ...CLOUD[id], model: resolved };
}

// Files git ignores under the EN tree, as tinyglobby ignore patterns. The
// Angular EN tree holds ~250 generated, gitignored pages on disk (xplat topics
// synced in, grid pages expanded from grids_templates/); translating them would
// be wasted work, and their sources are translated where they live. Same file
// set as scripts/check-llms-metadata.mjs: tracked + untracked-not-ignored.
function gitIgnoredUnder(sourceDir) {
  try {
    const out = execFileSync(
      'git',
      ['ls-files', '-z', '--others', '--ignored', '--exclude-standard', '--directory', '--', sourceDir],
      { cwd: ROOT_ABS, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const escapeGlob = (s) => s.replace(/[\\*?[\]{}()!+@]/g, '\\$&');
    return out
      .split('\0')
      .filter(Boolean)
      .map((p) => p.slice(sourceDir.length + 1))
      .filter(Boolean)
      .map((p) => (p.endsWith('/') ? `${escapeGlob(p)}**` : escapeGlob(p)));
  } catch {
    console.warn('[docs-config] git unavailable - gitignored (generated) pages are NOT excluded');
    return [];
  }
}

/**
 * @param {keyof typeof TREES} tree
 * @param {object} specific  per-tree fields: doNotTranslate, promptContext,
 *                           translatableAttributes, frontmatterStyle
 */
export default function docsConfig(tree, specific) {
  const t = TREES[tree];
  const sourceDir = `${t.contentDir}/en`;
  return {
    name: t.name,
    root: ROOT,
    // Shared by both trees on purpose: TM keys on the exact source string, so a
    // heading translated once is reused verbatim in the other tree.
    dataDir: DATA_DIR,

    source: {
      locale: 'en',
      dir: sourceDir,
      include: ['**/*.mdx', '**/*.md'],
      exclude: gitIgnoredUnder(sourceDir),
    },
    targets: LOCALES.map((l) => ({ code: l.code, name: l.name, dir: `${t.contentDir}/${l.folder}` })),

    contract: {
      translatable: ['title', 'description', 'keywords'],
      preserve: [],
      assets: [],
      enumKeys: [],
    },

    doNotTranslate: specific.doNotTranslate,
    preserveNames: componentNames,
    // Lives in this repository so the /translate fix step can propose edits to
    // it on the branch, where a human reviews them in the PR.
    glossary: '../../../docs/translation/glossary.json',
    promptContext: specific.promptContext,
    styleGuide,
    translatableAttributes: specific.translatableAttributes,
    protectPatterns: [
      // MDX imports need no pattern: remark-mdx parses them as mdxjsEsm nodes.
      '\\{environment:[^}]+\\}',
      '\\{[A-Za-z][A-Za-z0-9]*\\}',
    ],
    bodyMode: 'auto',
    frontmatterStyle: specific.frontmatterStyle,

    provider: providerFromEnv('translate'),
    judge: providerFromEnv('judge'),
  };
}

// Core shared types. Everything project-specific arrives through ProjectConfig —
// the pipeline, validator, and judge never import a project's schema directly.

import type { FrontmatterStyle } from './frontmatter.js';

export interface GlossaryEntry {
  term: string;
  // locale code → approved translation. Codes are whatever the project uses
  // (kr, ja, es, pt-br…) - the toolkit treats them as opaque strings.
  translations: Record<string, string>;
}

// Field contract
// Which frontmatter fields translate, which pass through verbatim.
export interface FieldContract {
  /** Field names whose string values (and string-array elements) translate. */
  translatable: ReadonlySet<string>;
  /** Names subtracted from translatable (person names, brand fields). */
  preserve: ReadonlySet<string>;
  /** Image/video/url path fields — preserved verbatim (explicit guard). */
  assets: ReadonlySet<string>;
  /**
   * Fields that are a display label on one page and a CSS-class/filter key on
   * another. Distinguished by VALUE SHAPE: a slug-like value under one of these
   * keys stays verbatim; a prose value still translates.
   */
  enumKeys: ReadonlySet<string>;
  /** Explicit closed value sets, matched case-sensitively (validator). */
  enums?: Record<string, ReadonlySet<string>>;
}

// A slug/key token: all-lowercase alphanumerics with - or _ separators, no
// spaces - the shape that is safe in a CSS class or URL filter.
export function isSlugLike(value: string): boolean {
  return /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(value.trim());
}

// A plain {} object, not an array, null, Date, or class instance. Used to decide
// whether to recurse into a value as a key/value map (gray-matter parses YAML
// dates into Date objects, which this correctly excludes). Shared by the
// frontmatter walk and the incremental merge.
export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype;
}

export function isTranslatableField(contract: FieldContract, key: string): boolean {
  return contract.translatable.has(key) && !contract.preserve.has(key) && !contract.assets.has(key);
}

// The value-aware decision used by BOTH the pipeline and the validator.
export function isTranslatableValue(contract: FieldContract, key: string, value: string): boolean {
  if (!isTranslatableField(contract, key)) return false;
  if (contract.enumKeys.has(key) && isSlugLike(value)) return false;
  return true;
}

// Provider abstraction

export interface CompleteOptions {
  /** Ask the provider to force JSON output where it supports that natively. */
  json?: boolean;
  maxTokens?: number;
}

/** A raw LLM completion function - the only thing a provider must implement. */
export interface Provider {
  id: string;
  model: string;
  complete(prompt: string, opts?: CompleteOptions): Promise<string>;
}

/** What the pipeline consumes (built from a Provider + prompt templates). */
export interface Translator {
  /** single string (body, and fallback for batch misses) */
  one: (text: string) => Promise<string>;
  /** batch: translations aligned to input order; null for any the model dropped */
  many: (texts: string[]) => Promise<(string | null)[]>;
}

export interface TranslationMemory {
  get(source: string): string | undefined;
  set(source: string, target: string): void;
}

// Project configuration
// Each consuming project (docs-template angular, docs-template xplat, marketing
// site, …) ships one config module. Configs are JS/TS modules, so path mapping
// and body-mode decisions can be functions, not just data.

export interface TargetLocale {
  /** Locale code as used in the project's folder layout (kr, jp, es, pt-br…). */
  code: string;
  /** Clear ENGLISH language name - anchors the model far better than a native
   *  label ("Brazilian Portuguese", not "Português BR"). */
  name: string;
  /** Default output root, relative to project root (used by defaultTargetPath). */
  dir?: string;

  /**
   * Per-locale TRANSLATOR override, MERGED over the project-level `provider`.
   * Partial on purpose: the common case is swapping only the model while
   * keeping the same backend, so
   *
   *   { code: 'bg', name: 'Bulgarian', provider: { model: 'bggpt-gemma-2-9b' } }
   *
   * inherits `id`, `url`, `concurrency` and `apiKeyEnv` from the project block.
   * Language quality is not uniform across models - a Bulgarian-specialised
   * model can beat a general one on bg while losing badly on ja - and before
   * this existed the only way to route per language was to maintain a separate
   * near-duplicate config file per locale.
   */
  provider?: Partial<ProviderConfig>;

  /**
   * Per-locale JUDGE override, merged over the project-level `judge` the same
   * way. Keep the judge a DIFFERENT model (ideally a different vendor) from
   * whatever translates that same locale - the point of the judge layer is that
   * it has no self-grading blind spot, and a per-locale translator override can
   * silently collide with a project-level judge that happens to name the same
   * model.
   */
  judge?: Partial<ProviderConfig>;
}

export type BodyMode = 'auto' | 'markdown' | 'html' | 'skip';

export interface ProviderConfig {
  id: 'anthropic' | 'gemini' | 'openai' | 'ollama' | 'github-models' | 'exchange';
  /** Model name (e.g. 'claude-sonnet-5', 'gpt-5.5'; for github-models an id from
   *  `gh models list`, e.g. 'openai/gpt-4o'). */
  model: string;
  /** Env var holding the API key (never put the key itself in the config).
   *  github-models auth uses a GitHub token - defaults to GITHUB_TOKEN. */
  apiKeyEnv?: string;
  /** exchange only: the directory prompts are written to and answers read
   *  from - see src/providers/exchange.ts. */
  dir?: string;
  /** exchange only: 'replay' (default) fails a file whose answer is missing;
   *  'record' returns a dummy so every prompt of a file surfaces in one
   *  `translate --dry-run` pass. EXCHANGE_MODE in the environment is the
   *  fallback when unset. */
  mode?: 'record' | 'replay';
  /** Ollama only: server URL. */
  url?: string;
  /**
   * Ollama only: context window in tokens (`num_ctx`), default 16384.
   *
   * This is a HARD budget shared by prompt AND completion, and translateBody
   * sends a whole page's prose as ONE completion - so a large page can exceed it
   * and Ollama will silently drop the overflow rather than error. Measured on
   * the bg pilot: the only two files whose (prompt + output) estimate crossed
   * 16384 were also the only two the judge scored 1-2/5 for COMPLETENESS, with
   * whole sections missing. Raise this for a corpus with large pages - the
   * gemma3/qwen families handle far more - but note the KV cache grows with it,
   * so the host needs the spare VRAM.
   */
  numCtx?: number;
  /**
   * Ollama only: enable/disable a reasoning model's thinking phase.
   *
   * Reasoning models (qwen3.x MoE, deepseek-r1…) emit a long chain of thought
   * into a SEPARATE `thinking` field before answering. It never reaches the
   * pipeline - the provider only accumulates `response` - but it is generated,
   * and it dominates the cost: measured on qwen3.6:35b, one short translation
   * took 1382 eval tokens / 19.7s with thinking and 51 tokens / 1.1s without,
   * for a byte-equivalent answer. An 18x tax paid silently.
   *
   * Left UNSET the model does whatever it defaults to, which for a reasoning
   * model means thinking is ON. Set `false` for bulk translation. Consider
   * `true` only if a judge run shows the reasoning actually buys quality -
   * plausible for terminology, since the trace does deliberate over term
   * choices, but verify before paying for it across a whole corpus.
   * Ignored by models that have no thinking phase.
   */
  think?: boolean;
  /** Max files translated concurrently (cloud providers). Default 4; ollama 1. */
  concurrency?: number;
  maxTokens?: number;
}

export interface ProjectConfig {
  /** Short identifier, used in report filenames. */
  name: string;
  /** Project root. Relative values resolve against the config file's directory. */
  root: string;

  source: {
    locale: string;
    /** Source content root, relative to project root. */
    dir: string;
    /** Glob patterns relative to source.dir (supports **, *, ?). */
    include: string[];
    exclude?: string[];
  };

  targets: TargetLocale[];

  /**
   * Map a source-relative path to the target file path RELATIVE TO PROJECT ROOT.
   * Default: join(target.dir, relPath). Override for layouts where the locale is
   * a middle path segment (e.g. src/content/blog/en/post.md).
   */
  targetPathFor?: (relPath: string, target: TargetLocale) => string;

  contract: {
    translatable: string[];
    preserve?: string[];
    assets?: string[];
    enumKeys?: string[];
    enums?: Record<string, string[]>;
  };

  /** Brand/product/tech names kept exactly as written, in priority order
   *  (longer compound names before their prefixes: "Reveal Live" before "Reveal").
   *  Optional: configs are .mjs (not type-checked by tsc), so callers treat a
   *  missing list as empty (`?? []`). */
  doNotTranslate?: string[];

  /**
   * UI COMPONENT / feature names to keep in English with their exact
   * capitalization - e.g. `['Tree Grid', 'Data Grid', 'Grid', 'Chart',
   * Unlike `doNotTranslate` (a soft prompt hint + count check),
   * these are DETERMINISTICALLY masked byte-for-byte before translation (the
   * model never sees them, so it cannot render "Tree Grid" as
   * "cuadrícula de árbol"), and are ALSO added to the do-not-translate prompt
   * rule + validator so paths that can't mask (raw-HTML text runs) still enforce
   * them. Case-sensitive and whole-word: `Grid` matches `Grid` but not `grid`
   * or `Gridlines`. List longer names first is not required - the loader sorts
   * longest-first so `Tree Grid` masks before a bare `Grid`. */
  preserveNames?: string[];

  /** Inline glossary entries, or a JSON file path relative to the config file. */
  glossary?: GlossaryEntry[] | string;

  /** One sentence describing the content domain, injected into every prompt. */
  promptContext?: string;

  /**
   * Terminology & register guidance injected into every translate AND judge
   * prompt - the lever for "how should this read", separate from `glossary`
   * (specific terms) and `doNotTranslate` (hard brand list). A plain string
   * applies to all locales; a `{ [code]: string }` map gives per-locale text
   * (e.g. neutral LatAm-vs-Spain Spanish). Use it to say things like: prefer
   * neutral professional register, keep established English technical / UI
   * component / product names rather than literal calques, and follow a vendor
   * standard (e.g. Microsoft's localization terminology for the language).
   */
  styleGuide?: string | Record<string, string>;

  /** Extra regex sources (strings) protected byte-for-byte before translation —
   *  the safety net for constructs the MDX/AST protection doesn't already cover. */
  protectPatterns?: string[];

  /** Named ATTRIBUTE values to translate for specific self-closing (or
   *  otherwise childless) components, e.g. { CtaArea: ['title', 'description',
   *  'label', 'note'] } - for a component like `<CtaArea title="..." .../>`
   *  whose entire user-facing text lives in attributes there are no children
   *  to translate at all. protectPatterns still apply within each attribute
   *  value ({Platform} etc. survive untouched). */
  translatableAttributes?: Record<string, string[]>;

  /** How the body is translated. 'auto' (default): skip if skipBodyWhen matches,
   *  else html-sniff to pick the tag-split or markdown path. 'markdown': always
   *  the markdown path (no sniffing). 'html': always the tag-split path. 'skip':
   *  body passes through verbatim. */
  bodyMode?: BodyMode;
  /** Per-file override: return true to keep this file's body verbatim
   *  (e.g. Reveal's sectioned pages: (fm) => Array.isArray(fm.sections)). */
  skipBodyWhen?: (frontmatter: Record<string, unknown>) => boolean;

  /** YAML frontmatter formatting: kills line-folding by default and can force
   *  specific keys (e.g. a path field the source always quotes) to match a
   *  source convention js-yaml wouldn't otherwise infer. See src/frontmatter.ts. */
  frontmatterStyle?: FrontmatterStyle;

  /** Directory for translation memory and judge reports, relative to the
   *  config file (default '.translation-data/<name>'). Safe to point two or
   *  more projects at the SAME dataDir to share translation memory across a
   *  product line - TM keys on the exact source string, which is safe to
   *  reuse across projects by design. */
  dataDir?: string;

  provider: ProviderConfig;
  /** Judge model - use a DIFFERENT model/vendor than the translator. */
  judge?: ProviderConfig;
}

// Resolved at load time (paths absolutized, contract sets built, glossary loaded).
export interface ResolvedConfig extends Omit<ProjectConfig, 'contract' | 'glossary'> {
  configDir: string;
  rootAbs: string;
  sourceDirAbs: string;
  dataDirAbs: string;
  contract: FieldContract;
  glossaryEntries: GlossaryEntry[];
  targetPathFor: (relPath: string, target: TargetLocale) => string;
  /**
   * The project's OWN protectPatterns, as authored - without the preserveNames
   * patterns that `protectPatterns` above has merged in.
   *
   * Kept separate for the validator: preserveNames are already enforced by the
   * brand-translated check (they are appended to doNotTranslate), so validating
   * the merged list would double-report every one of them. These authored
   * patterns - `{Platform}`, `{environment:*}`, MDX imports - have no other
   * guard at all.
   */
  declaredProtectPatterns: string[];
  /**
   * The preserveNames that actually survived conflict resolution and were
   * compiled into `protectPatterns` - i.e. the terms the model never sees,
   * because they are masked to a placeholder before the prompt is built.
   *
   * The validator needs this to tell two very different failures apart. A
   * MASKED term that loses occurrences was not mistranslated - it could not
   * be, the model never saw the word - the model dropped the placeholder
   * token. An UNMASKED doNotTranslate term that loses occurrences really was
   * translated, because nothing but the prompt was stopping it. Same symptom,
   * unrelated fixes; reporting both as "brand-translated" hid that for the
   * whole of the Bulgarian pilot.
   */
  maskedNames: string[];
}

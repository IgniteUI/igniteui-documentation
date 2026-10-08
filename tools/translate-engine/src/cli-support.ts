import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { DiscoveredFile } from './discover.js';
import type { PipelineOptions } from './pipeline.js';
import type { PromptSettings } from './prompt.js';
import type { ValidateSettings, Violation } from './validate.js';
import type { ProviderConfig, ResolvedConfig, TargetLocale, TranslationMemory } from './types.js';

// Shared helpers for the CLI commands. Each command (status/translate/validate/
// judge) used to rebuild these settings objects and re-implement --file/--dir
// scoping and report writing inline; centralizing them keeps the four commands
// in lockstep and lets a future option be added in one place.

// Config-derived settings

// Which target locales a command should process: the --locale subset if given,
// else all configured targets. Pure filter, no I/O (the unknown-locale error is
// raised in discover).
export function filterTargetLocales(cfg: ResolvedConfig, locales?: string[]): TargetLocale[] {
  return locales?.length ? cfg.targets.filter((t) => locales.includes(t.code)) : cfg.targets;
}

// Per-locale model routing
// `provider`/`judge` are project-level defaults; a TargetLocale may override
// either with a PARTIAL block that is merged over the default. That keeps the
// common case terse - `provider: { model: 'qwen2.5:72b' }` on the ja target
// inherits id/url/concurrency from the project - while still allowing a locale
// to switch backend entirely (id + model + apiKeyEnv together).

/**
 * Merge a partial locale override over a project-level provider block.
 *
 * SAME backend (override omits `id`, or repeats it): a plain field-wise merge -
 * `{ model: 'qwen2.5:72b' }` keeps the project's url/concurrency/apiKeyEnv.
 *
 * DIFFERENT backend (override names another `id`): the base's remaining fields
 * are backend-SPECIFIC and must not leak. `apiKeyEnv` is the dangerous one - a
 * locale switching an Anthropic project to Gemini would otherwise inherit
 * `ANTHROPIC_API_KEY` and authenticate with the wrong vendor's key. `url`
 * (Ollama's host) and `concurrency` (tuned for the old backend's throughput)
 * are wrong for the same reason. So a backend switch starts clean and must
 * carry whatever it needs itself.
 */
function mergeProvider(
  base: ProviderConfig | undefined,
  override: Partial<ProviderConfig> | undefined,
  what: string,
): ProviderConfig {
  const switching = override?.id !== undefined && override.id !== base?.id;
  const merged = (
    switching ? { ...override } : { ...base, ...override }
  ) as Partial<ProviderConfig>;
  if (!merged.id || !merged.model) {
    throw new Error(
      `${what}: ${switching ? 'switching provider id requires its own "model"' : 'incomplete provider'} ` +
        `(id=${merged.id ?? 'missing'}, model=${merged.model ?? 'missing'})`,
    );
  }
  return merged as ProviderConfig;
}

/** The TRANSLATOR config for one locale: project defaults + locale overrides. */
export function providerFor(cfg: ResolvedConfig, target: TargetLocale): ProviderConfig {
  return mergeProvider(cfg.provider, target.provider, `target "${target.code}" provider`);
}

/**
 * The JUDGE config for one locale, or undefined when neither level defines one.
 *
 * Throws when the MERGED result is incomplete - i.e. a locale supplies a partial
 * judge override (`{ model: 'x' }`) with no project-level judge to inherit `id`
 * from. Failing loudly here beats constructing a provider with `id: undefined`
 * and surfacing it as an opaque "Unknown provider" at the first API call.
 */
export function judgeFor(cfg: ResolvedConfig, target: TargetLocale): ProviderConfig | undefined {
  if (!cfg.judge && !target.judge) return undefined;
  return mergeProvider(cfg.judge, target.judge, `target "${target.code}" judge override`);
}

/**
 * Files translated in parallel for a given provider. Ollama defaults to 1: the
 * bundled host serves requests essentially serially, and firing several at once
 * just deepens its queue. Cloud providers default to 4.
 *
 * Resolved PER LOCALE, since per-locale routing means one run can mix a local
 * Ollama target (must stay at 1) with a cloud target (safely 4).
 */
export function concurrencyFor(provider: ProviderConfig): number {
  return Math.max(1, provider.concurrency ?? (provider.id === 'ollama' ? 1 : 4));
}

/** "ollama:translategemma:27b" - for log lines and report headers. */
export function describeProvider(provider: ProviderConfig): string {
  return `${provider.id}:${provider.model}`;
}

export function validateSettingsFrom(cfg: ResolvedConfig): ValidateSettings {
  return {
    contract: cfg.contract,
    doNotTranslate: cfg.doNotTranslate ?? [],
    // The project's OWN patterns only — preserveNames-derived ones are already
    // enforced via doNotTranslate/brand-translated and would double-report.
    protectPatterns: cfg.declaredProtectPatterns ?? [],
    maskedNames: cfg.maskedNames ?? [],
  };
}

export function promptSettingsFrom(cfg: ResolvedConfig): PromptSettings {
  return {
    doNotTranslate: cfg.doNotTranslate ?? [],
    componentNames: cfg.maskedNames ?? [],
    glossary: cfg.glossaryEntries,
    promptContext: cfg.promptContext,
    styleGuide: cfg.styleGuide,
  };
}

export function pipelineOptionsFrom(cfg: ResolvedConfig, mem?: TranslationMemory): PipelineOptions {
  return {
    contract: cfg.contract,
    protectPatterns: cfg.protectPatterns,
    translatableAttributes: cfg.translatableAttributes,
    bodyMode: cfg.bodyMode,
    skipBodyWhen: cfg.skipBodyWhen,
    frontmatterStyle: cfg.frontmatterStyle,
    mem,
  };
}

// --file / --dir scoping (shared by translate, validate, judge)

// Comma-separated relative paths - a normalized Set. "--file a.mdx,b.mdx"
function parseFileList(file: string | undefined): Set<string> | undefined {
  if (!file) return undefined;
  const rels = file
    .split(',')
    .map((s) => s.trim().replaceAll('\\', '/'))
    .filter(Boolean);
  return new Set(rels);
}

// Comma-separated relative dirs - a normalized Set (trailing slashes stripped so
// "grids/" and "grids" mean the same prefix).
function parseDirList(dir: string | undefined): Set<string> | undefined {
  if (!dir) return undefined;
  const rels = dir
    .split(',')
    .map((s) => s.trim().replaceAll('\\', '/').replace(/\/+$/, ''))
    .filter(Boolean);
  return new Set(rels);
}

// A file is "under" a --dir entry if its relPath is that directory-as-a-file or
// starts with "<dir>/" - this is what includes nested subfolders at any depth.
function isUnderAnyDir(relPath: string, dirs: Set<string>): boolean {
  for (const d of dirs) {
    if (relPath === d || relPath.startsWith(`${d}/`)) return true;
  }
  return false;
}

export interface ScopeResult {
  files: DiscoveredFile[];
  /** Set when --file names an unknown path or --dir matches nothing. Callers
   *  that treat scoping as strict (translate, judge) print this and exit 1;
   *  validate ignores it (audit mode filters silently). */
  error?: string;
  /** Whether --file or --dir was given at all (vs. a whole-locale run). */
  scoped: boolean;
}

// Narrow discovered files to what --file/--dir asked for (the FILE axis; the
// counterpart to filterTargetLocales' locale axis). Also validates the request:
// a bad --file/--dir path comes back as ScopeResult.error, and `scoped` tells
// callers whether an explicit scope was given at all (judge uses it to skip
// sampling). Returns everything unchanged when neither flag is passed.
export function scopeFiles(files: DiscoveredFile[], file?: string, dir?: string): ScopeResult {
  const wanted = parseFileList(file);
  const wantedDirs = parseDirList(dir);
  if (!wanted && !wantedDirs) return { files, scoped: false };

  const filtered = files.filter(
    (f) =>
      (wanted?.has(f.relPath) ?? false) ||
      (wantedDirs ? isUnderAnyDir(f.relPath, wantedDirs) : false),
  );

  if (wanted) {
    const found = new Set(filtered.map((f) => f.relPath));
    const missing = [...wanted].filter((w) => !found.has(w));
    if (missing.length) {
      return {
        files: filtered,
        scoped: true,
        error: `not found among source files: ${missing.join(', ')}`,
      };
    }
  }
  if (wantedDirs) {
    const empty = [...wantedDirs].filter(
      (d) => !files.some((f) => f.relPath === d || f.relPath.startsWith(`${d}/`)),
    );
    if (empty.length) {
      return {
        files: filtered,
        scoped: true,
        error: `no files found under director${empty.length > 1 ? 'ies' : 'y'}: ${empty.join(', ')}`,
      };
    }
  }
  return { files: filtered, scoped: true };
}

// append-as-you-go report writer (translate + judge)

export interface AppendingReport {
  /** Append one line; writes the timestamped header lazily on first call. */
  line: (text: string) => Promise<void>;
  /** True once at least one line has been written (header emitted). */
  readonly started: boolean;
}

// Report lines are flushed to disk AS THEY HAPPEN, not buffered and written at
// the end, a run interrupted partway (Ctrl+C, crash) still leaves a durable
// record up to that point. `enabled: false` (dry-run) makes every call a no-op.
export function makeAppendingReport(
  reportPath: string,
  header: string,
  enabled = true,
): AppendingReport {
  let started = false;
  return {
    get started() {
      return started;
    },
    async line(text: string): Promise<void> {
      if (!enabled) return;
      if (!started) {
        started = true;
        await fs.mkdir(path.dirname(reportPath), { recursive: true });
        await fs.appendFile(reportPath, header, 'utf-8');
      }
      await fs.appendFile(reportPath, `${text}\n`, 'utf-8');
    },
  };
}

// Console output

// Print a file's violations under a `file [locale]` header so each block is
// attributable (the `validate` audit prints no other context; translate/judge
// print their own nearby file line too — a small, harmless repeat). Warnings are
// suppressed unless `always` (validate shows them; the inline translate/judge
// passes show only errors).
export function printViolations(
  file: string,
  locale: string,
  violations: Violation[],
  always = false,
): void {
  const shown = always ? violations : violations.filter((v) => v.severity !== 'warn');
  if (shown.length === 0) return;
  console.log(`  ${file} [${locale}]`);
  for (const v of shown) {
    const mark = v.severity === 'error' ? 'x' : '~';
    console.log(`    ${mark} [${v.code}] ${v.field ? `${v.field}: ` : ''}${v.message}`);
  }
}

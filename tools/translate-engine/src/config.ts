import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type {
  FieldContract,
  GlossaryEntry,
  ProjectConfig,
  ResolvedConfig,
  TargetLocale,
} from './types.js';

// Loads a project config module (.mjs/.js/.ts via tsx) and resolves it:
// absolutize paths, build the contract sets, load the glossary, apply defaults.
// Also loads a `.env` file sitting next to the config (keys only fill gaps —
// real environment variables always win), so each project can keep its own
// provider keys out of git without extra tooling.

export async function loadConfig(configPath: string): Promise<ResolvedConfig> {
  const abs = path.resolve(configPath);
  const configDir = path.dirname(abs);

  // Load a sibling .env into process.env via Node's built-in parser. Real env
  // vars win over the file; a missing file is fine (keys can come from the real
  // environment / CI secrets instead), so the ENOENT is swallowed.
  try {
    process.loadEnvFile(path.join(configDir, '.env'));
  } catch {
    // no .env next to the config
  }

  const mod = (await import(pathToFileURL(abs).href)) as {
    default?: ProjectConfig;
  };
  const cfg = mod.default;
  if (!cfg) throw new Error(`${configPath}: config module has no default export`);
  for (const req of ['name', 'root', 'source', 'targets', 'contract', 'provider'] as const) {
    if (!cfg[req]) throw new Error(`${configPath}: missing required config field "${req}"`);
  }

  const rootAbs = path.resolve(configDir, cfg.root);
  const sourceDirAbs = path.join(rootAbs, cfg.source.dir);
  const dataDirAbs = path.resolve(
    configDir,
    cfg.dataDir ?? path.join('.translation-data', cfg.name),
  );

  const contract: FieldContract = {
    translatable: new Set(cfg.contract.translatable),
    preserve: new Set(cfg.contract.preserve ?? []),
    assets: new Set(cfg.contract.assets ?? []),
    enumKeys: new Set(cfg.contract.enumKeys ?? []),
    enums: cfg.contract.enums
      ? Object.fromEntries(Object.entries(cfg.contract.enums).map(([k, v]) => [k, new Set(v)]))
      : undefined,
  };

  let glossaryEntries: GlossaryEntry[] = [];
  if (Array.isArray(cfg.glossary)) {
    glossaryEntries = cfg.glossary;
  } else if (typeof cfg.glossary === 'string') {
    const gPath = path.resolve(configDir, cfg.glossary);
    try {
      glossaryEntries = JSON.parse(await fs.readFile(gPath, 'utf-8')) as GlossaryEntry[];
    } catch {
      // Missing glossary file is fine on first run; warn so it isn't silent.
      console.warn(`[config] glossary file not found or invalid: ${gPath} (continuing without)`);
    }
  }

  const targetPathFor =
    cfg.targetPathFor ??
    ((relPath: string, target: TargetLocale): string => {
      if (!target.dir) {
        throw new Error(
          `target "${target.code}" has no "dir" and the config supplies no targetPathFor()`,
        );
      }
      return path.posix.join(target.dir.replaceAll('\\', '/'), relPath.replaceAll('\\', '/'));
    });

  // Component/feature names to keep in English (see ProjectConfig.preserveNames).
  // Compiled two ways: (1) into protectPatterns so they're masked byte-for-byte
  // in the frontmatter + markdown-body paths - case-sensitive, whole-word, and
  // sorted longest-first so "Tree Grid" masks before a bare "Grid"; (2) appended
  // to doNotTranslate so the prompt rule + validator enforce them on every path
  // (including raw-HTML text runs, which the mask doesn't reach).
  // preserveNames vs. glossary: resolve the contradiction, don't ship both.
  //
  // A single-word preserveName that is also the HEAD NOUN of a multi-word
  // glossary term is a direct instruction conflict, and the mask always wins
  // because it runs first and the model never sees the word at all. Observed on
  // the bg pilot: `Chart` is a preserveName, while the glossary defines
  // "area chart" -> "площна диаграма" and "column chart" -> "колонна диаграма".
  // Masking the head produced text like:
  //
  //   source   "Area Chart"
  //   mask     "Area __MDX_7__"        <- model cannot see "Chart"
  //   model    "Площна диаграма"        <- translates "Area" as the whole phrase
  //   restore  "Площна диаграма Chart"  <- token returns and duplicates the noun
  //
  // The judge scored exactly this 2/5 as "nonsensical bilingual duplication".
  // It is not model-specific - any model translating a compound as a unit does
  // it, in any language, so no model swap fixes it.
  //
  // Resolution: the GLOSSARY wins for these. If a project explicitly translates
  // "<x> chart", it does not also want a frozen English "Chart" inside that
  // phrase. Multi-word preserveNames ("Tree Grid") are specific enough to be
  // unambiguous and are always kept - longest-match-first ordering below means
  // they mask before any bare head could.
  const declaredNames = cfg.preserveNames ?? [];
  const glossaryHeads = new Set<string>();
  for (const entry of glossaryEntries) {
    const words = entry.term.trim().split(/\s+/);
    if (words.length > 1) glossaryHeads.add(words[words.length - 1].toLowerCase());
  }
  const conflicting = declaredNames.filter(
    (n) => !n.includes(' ') && glossaryHeads.has(n.toLowerCase()),
  );
  const preserveNames = declaredNames.filter((n) => !conflicting.includes(n));
  if (conflicting.length) {
    console.warn(
      `[config] preserveNames ${conflicting.map((n) => `"${n}"`).join(', ')} dropped: each is the ` +
        `head noun of a multi-word glossary term, so masking it would block the glossary ` +
        `translation and leave the English word stranded inside the translated phrase.`,
    );
  }

  // Retired option. Under remark-mdx a component's children are ordinary mdast
  // nodes below a JSX node, so EVERY component's children are translated and the
  // tags alone are masked - which is exactly what this option used to request
  // for a named few. Warn rather than ignore silently: a config still listing it
  // is describing behaviour that is now universal, and the line can be deleted.
  if ((cfg as { translatableComponents?: string[] }).translatableComponents?.length) {
    console.warn(
      `[config] translatableComponents is no longer used and can be removed: since the ` +
        `switch to remark-mdx, the children of every JSX component are translated and only ` +
        `its tags are masked.`,
    );
  }

  const preservePatterns = [...preserveNames]
    .sort((a, b) => b.length - a.length)
    .map((n) => `(?<![A-Za-z0-9])${escapeRegExp(n)}(?![A-Za-z0-9])`);

  return {
    ...cfg,
    configDir,
    rootAbs,
    sourceDirAbs,
    dataDirAbs,
    contract,
    glossaryEntries,
    targetPathFor,
    bodyMode: cfg.bodyMode ?? 'auto',
    doNotTranslate: [
      ...(cfg.doNotTranslate ?? []),
      ...[...preserveNames].sort((a, b) => b.length - a.length),
    ],
    protectPatterns: [...preservePatterns, ...(cfg.protectPatterns ?? [])],
    declaredProtectPatterns: cfg.protectPatterns ?? [],
    // The names that really got masked - `preserveNames` on the spread config
    // above is still the DECLARED list, including any dropped just above.
    maskedNames: preserveNames,
  };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

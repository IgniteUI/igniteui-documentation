import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'tinyglobby';
import type { ResolvedConfig, TargetLocale } from './types.js';

// File discovery. Runs against a local checkout (the CI job or the
// developer's working tree) - no remote API needed. No staleness tracking:
// a target file's existence is the only signal, translate is always invoked
// explicitly for a specific file/locale, so re-translating after an EN
// change is a deliberate `--file` call, not something the tool auto-detects.

export type FileState = 'missing' | 'done';

export interface DiscoveredFile {
  /** POSIX path relative to source.dir (the file's identity across locales). */
  relPath: string;
  sourceAbs: string;
  /** target code → state + absolute target path */
  targets: Record<string, { state: FileState; targetAbs: string }>;
}

export async function discover(
  cfg: ResolvedConfig,
  localeFilter?: string[],
): Promise<DiscoveredFile[]> {
  const targets = localeFilter?.length
    ? cfg.targets.filter((t) => localeFilter.includes(t.code))
    : cfg.targets;
  if (localeFilter?.length && targets.length !== localeFilter.length) {
    const known = new Set(cfg.targets.map((t) => t.code));
    const bad = localeFilter.filter((c) => !known.has(c));
    if (bad.length)
      throw new Error(
        `Unknown locale(s): ${bad.join(', ')} (configured: ${[...known].join(', ')})`,
      );
  }

  // Source files via tinyglobby (the same lean glob engine Vite/Astro use).
  // ignore keeps the project's excludes plus a defensive node_modules/.git skip;
  // dot:true matches dotfiles the include globs ask for; sorted so discovery is
  // stable/alphabetical (pickEvenly's sampling and clean diffs rely on it).
  const rels = (
    await glob(cfg.source.include, {
      cwd: cfg.sourceDirAbs,
      ignore: [...(cfg.source.exclude ?? []), '**/node_modules/**', '**/.git/**'],
      dot: true,
    })
  ).sort();

  // Existence checks run concurrently. On a large tree this is thousands of
  // fs.access calls (files × targets); doing them sequentially made status /
  // discovery needlessly slow. rels.map preserves source order in the result;
  // fs.access is a stat-like syscall (holds no descriptor open), so libuv's
  // threadpool just queues them - no risk of exhausting file descriptors.
  const out: DiscoveredFile[] = await Promise.all(
    rels.map(async (relPath) => {
      const sourceAbs = path.join(cfg.sourceDirAbs, relPath);
      const entry: DiscoveredFile = { relPath, sourceAbs, targets: {} };
      await Promise.all(
        targets.map(async (t) => {
          const targetRel = cfg.targetPathFor(relPath, t);
          const targetAbs = path.join(cfg.rootAbs, targetRel);
          const state: FileState = await fs.access(targetAbs).then(
            () => 'done' as const,
            () => 'missing' as const,
          );
          entry.targets[t.code] = { state, targetAbs };
        }),
      );
      return entry;
    }),
  );
  return out;
}

export function summarize(
  files: DiscoveredFile[],
  targets: TargetLocale[],
): Record<string, Record<FileState, number>> {
  const summary: Record<string, Record<FileState, number>> = {};
  for (const t of targets) {
    summary[t.code] = { missing: 0, done: 0 };
    for (const f of files) {
      const st = f.targets[t.code];
      if (st) summary[t.code][st.state]++;
    }
  }
  return summary;
}

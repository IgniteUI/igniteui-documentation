import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const MAX_BUFFER = 64 * 1024 * 1024;

/** Reads files from one repo, at one ref, with the repo root + ref resolved once. */
export interface GitReader {
  /** The file's content at the ref, or undefined if it didn't exist there. */
  read(fileAbs: string): Promise<string | undefined>;
}

// git's two ways of saying "this path is not in that commit's tree" - a path
// absent from the ref (→ genuinely new file), vs. one that only exists in the
// working directory. ANY OTHER `git show` failure is unexpected and must NOT be
// mistaken for "new file" (that would full-translate and overwrite an existing
// translation), so read() re-throws when this doesn't match.
export function isPathAbsentError(stderr: string): boolean {
  return /does not exist in|exists on disk, but not in/i.test(stderr);
}

/**
 * Open a reader bound to one repo + one ref, doing the expensive resolution ONCE
 * for a whole batch: find the repo root, and verify `ref` resolves to a commit.
 * Each later read() is then a single `git show`.
 *
 * Throws HERE - before any read if `hintDir` isn't in a git work tree, or if
 * `ref` doesn't resolve (a typo, or a CI shallow clone that never fetched the
 * base branch). Failing fast is deliberate: an unresolvable ref must never be
 * mistaken for "every file is new", which would full re-translate and overwrite
 * existing (human/precious) translations.
 */
export async function openGitReader(hintDir: string, ref: string): Promise<GitReader> {
  // Repo root - resolved once. `git show` wants a repo-relative path, so we turn
  // each absolute file path into one via path.relative(top, …) in read().
  let top: string;
  try {
    const { stdout } = await exec('git', ['-C', hintDir, 'rev-parse', '--show-toplevel']);
    top = stdout.trim();
  } catch {
    throw new Error(`not a git repository: ${hintDir} (use --base-file for git-free sync)`);
  }

  // Ref validity - verified once. Peeling `^{commit}` also handles annotated
  // tags; `--verify --quiet` exits non-zero and silent when it can't resolve.
  try {
    await exec('git', ['-C', top, 'rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
  } catch {
    throw new Error(
      `--base ref "${ref}" does not resolve in ${top}. Check the ref name; in CI make ` +
        `sure the base branch is fetched (actions/checkout with fetch-depth: 0). Refusing ` +
        `to run, since treating every changed page as new would overwrite existing translations.`,
    );
  }

  return {
    async read(fileAbs: string): Promise<string | undefined> {
      const rel = path.relative(top, fileAbs).replaceAll('\\', '/');
      try {
        const { stdout } = await exec('git', ['-C', top, 'show', `${ref}:${rel}`], {
          maxBuffer: MAX_BUFFER,
        });
        return stdout;
      } catch (err) {
        // Only a genuine "path not in this ref" is a new file → undefined. Any
        // other git failure re-throws rather than be silently full-translated.
        const stderr = (err as { stderr?: string }).stderr ?? '';
        if (isPathAbsentError(stderr)) return undefined;
        throw err;
      }
    },
  };
}

/**
 * Single-file convenience: read one file's content at a ref. Resolves the repo
 * root and verifies the ref on every call, so prefer openGitReader() when
 * reading many files in one run.
 */
export async function gitShowFile(fileAbs: string, ref: string): Promise<string | undefined> {
  const reader = await openGitReader(path.dirname(fileAbs), ref);
  return reader.read(fileAbs);
}

import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gitShowFile, openGitReader, isPathAbsentError } from '../src/git.js';

describe('isPathAbsentError', () => {
  test('true for git’s "not in this ref" messages (genuinely new file)', () => {
    assert.equal(isPathAbsentError("fatal: path 'foo.mdx' does not exist in 'HEAD'\n"), true);
    assert.equal(
      isPathAbsentError("fatal: path 'foo.mdx' exists on disk, but not in 'abc1234'\n"),
      true,
    );
  });

  test('false for any other failure (re-thrown, never treated as new file)', () => {
    assert.equal(isPathAbsentError(''), false);
    assert.equal(isPathAbsentError('fatal: unable to read tree; repository corrupt'), false);
  });
});

// Spins up a throwaway git repo, commits two files, then edits
// the working tree so HEAD (committed) != disk (working tree) - the exact state
// sync reads during a local, uncommitted edit.
describe('git reader', () => {
  let repo: string;
  let fileAbs: string;
  let file2Abs: string;

  before(async () => {
    repo = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'tk-git-')));
    const git = (...args: string[]) =>
      execFileSync('git', ['-C', repo, ...args], { stdio: 'pipe' });
    git('init', '-q');
    git('config', 'user.email', 't@t.test');
    git('config', 'user.name', 'toolkit test');
    fileAbs = path.join(repo, 'page.mdx');
    file2Abs = path.join(repo, 'sub', 'page2.mdx');
    await fs.writeFile(fileAbs, 'committed body\n', 'utf-8');
    await fs.mkdir(path.dirname(file2Abs), { recursive: true });
    await fs.writeFile(file2Abs, 'second committed\n', 'utf-8');
    git('add', '-A');
    git('commit', '-q', '-m', 'init');
    await fs.writeFile(fileAbs, 'edited body\n', 'utf-8');
  });

  after(async () => {
    await fs.rm(repo, { recursive: true, force: true });
  });

  test('gitShowFile returns the COMMITTED content at HEAD (the "old" EN), not the working tree', async () => {
    assert.equal(await gitShowFile(fileAbs, 'HEAD'), 'committed body\n');
  });

  test('gitShowFile returns undefined when the ref is valid but the path is absent (new file → full translate)', async () => {
    const brandNew = path.join(repo, 'brand-new.mdx');
    await fs.writeFile(brandNew, 'x\n', 'utf-8');
    assert.equal(await gitShowFile(brandNew, 'HEAD'), undefined);
  });

  test('gitShowFile THROWS on an unresolvable --base ref (never silently full-translates → clobber)', async () => {
    await assert.rejects(() => gitShowFile(fileAbs, 'no-such-ref'), /does not resolve/);
  });

  test('openGitReader resolves once, then reads many files (incl. nested paths) with one show each', async () => {
    const reader = await openGitReader(repo, 'HEAD');
    assert.equal(await reader.read(fileAbs), 'committed body\n');
    assert.equal(await reader.read(file2Abs), 'second committed\n');
    assert.equal(await reader.read(path.join(repo, 'nope.mdx')), undefined);
  });

  test('openGitReader FAILS FAST on a bad ref (throws at open, before any read)', async () => {
    await assert.rejects(() => openGitReader(repo, 'no-such-ref'), /does not resolve/);
  });
});

/**
 * Resolves the examples checkout and says where it is.
 *
 * A workflow needs the path before it can pass it to anything, and it needs the clone to have already
 * happened. Both are the same operation, so this is a one-line step that prints the answer:
 *
 *     node docs/xplat/scripts/ci/resolve-examples.mjs --print-path >> "$GITHUB_OUTPUT"
 *
 * Locally it reports what it found, which is worth knowing before a check runs against the wrong
 * samples for twenty minutes. With --pin it updates xplat-examples.lock.json instead, and with
 * --check-pinned it is the merge gate: the lock must name a commit already in the examples mainline.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { resolveExamplesRoot, readExamplesLock, examplesRefTip, EXAMPLES_LOCK } from '../lib/snippet-toolchain.mjs';

const args = process.argv.slice(2);
const FOR_OUTPUT = args.includes('--print-path');

// --pin [ref]: point the lock at a ref's current tip, so every build reads that exact commit. The ref
// defaults to the one already locked. Run it after the examples change lands, and commit the lock.
const pinAt = args.indexOf('--pin');
if (pinAt >= 0) {
    const lock = readExamplesLock();
    const ref = args[pinAt + 1] && !args[pinAt + 1].startsWith('--') ? args[pinAt + 1] : lock.ref;
    const tip = examplesRefTip(lock, ref);
    if (!tip) {
        console.error(`[examples] cannot read the tip of ${ref} in ${lock.repository}`);
        process.exit(2);
    }
    const pinned = { ...lock, ref, commit: tip };
    fs.writeFileSync(EXAMPLES_LOCK, JSON.stringify(pinned, null, 4) + '\n');
    console.log(`[examples] pinned ${ref} at ${tip}`);
    process.exit(0);
}

// --check-pinned: the gate on merging into vnext or master. The lock must name a commit, and that commit
// must be in the examples repository's mainline ("mainline" in the lock, main by default), so the
// documentation never ships against a feature branch that can be rebased away or deleted.
if (args.includes('--check-pinned')) {
    const lock = readExamplesLock();
    const mainline = lock.mainline ?? 'main';
    if (!lock.commit) {
        console.error(`[examples] xplat-examples.lock.json follows ${lock.ref} without a commit. Pin it once ` +
                      `the examples change is in ${mainline}:\n  node docs/xplat/scripts/ci/resolve-examples.mjs --pin ${mainline}`);
        process.exit(1);
    }
    const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'examples-lock-'));
    try {
        const git = (...a) => execFileSync('git', a, { cwd: scratch, stdio: ['ignore', 'pipe', 'pipe'] });
        git('init', '-q', '--bare');
        git('remote', 'add', 'origin', lock.repository);
        git('config', 'remote.origin.promisor', 'true');
        // History only: no trees, no blobs. Enough to ask whether one commit is an ancestor of another.
        git('fetch', '-q', '--filter=tree:0', 'origin', `refs/heads/${mainline}:refs/heads/${mainline}`);
        try {
            git('merge-base', '--is-ancestor', lock.commit, mainline);
        } catch {
            console.error(`[examples] the locked commit ${lock.commit.slice(0, 10)} (${lock.ref}) is not in ` +
                          `${mainline}. Merge the examples change into ${mainline}, then pin it:\n` +
                          `  node docs/xplat/scripts/ci/resolve-examples.mjs --pin ${mainline}`);
            process.exit(1);
        }
    } finally {
        fs.rmSync(scratch, { recursive: true, force: true });
    }
    console.log(`[examples] pinned at ${lock.commit.slice(0, 10)}, which is in ${mainline}`);
    process.exit(0);
}

const root = resolveExamplesRoot({ quiet: FOR_OUTPUT });
if (FOR_OUTPUT) {
    // Both, because a workflow reads the first and a person reads the second.
    console.log(`path=${root}`);
    console.error(`[examples] ${root}`);
} else {
    console.log(root);
}

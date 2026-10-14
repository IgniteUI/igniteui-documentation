/**
 * Resolves the examples checkout and says where it is.
 *
 * A workflow needs the path before it can pass it to anything, and it needs the clone to have already
 * happened. Both are the same operation, so this is a one-line step that prints the answer:
 *
 *     node docs/xplat/scripts/ci/resolve-examples.mjs --print-path >> "$GITHUB_OUTPUT"
 *
 * Locally it reports what it found, which is worth knowing before a check runs against the wrong
 * samples for twenty minutes. With --pin it updates xplat-examples.lock.json instead.
 */

import fs from 'node:fs';
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

const root = resolveExamplesRoot({ quiet: FOR_OUTPUT });
if (FOR_OUTPUT) {
    // Both, because a workflow reads the first and a person reads the second.
    console.log(`path=${root}`);
    console.error(`[examples] ${root}`);
} else {
    console.log(root);
}

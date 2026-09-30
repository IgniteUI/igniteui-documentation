/**
 * Resolves the examples checkout and says where it is.
 *
 * A workflow needs the path before it can pass it to anything, and it needs the clone to have already
 * happened. Both are the same operation, so this is a one-line step that prints the answer:
 *
 *     node docs/xplat/scripts/ci/resolve-examples.mjs --print-path >> "$GITHUB_OUTPUT"
 *
 * Locally it reports what it found, which is worth knowing before a check runs against the wrong
 * samples for twenty minutes.
 */

import { resolveExamplesRoot, resolveExamplesBranch } from '../lib/snippet-toolchain.mjs';

const args = process.argv.slice(2);
const FOR_OUTPUT = args.includes('--print-path');

if (args.includes('--branch-only')) {
    // Which branch would be used, without cloning anything.
    console.log(resolveExamplesBranch(message => console.error(`[examples] ${message}`)));
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

/**
 * Where the snippet toolchain comes from: the emitter that turns a json-snippet into a platform's
 * code, and the examples repository the samples and code generation library live in.
 *
 * Both were absolute paths into one developer's home directory, in six scripts. That works until
 * anyone else runs them, and it cannot work in CI at all. Resolution is stated once here, in the
 * order a run should prefer:
 *
 *   1. an environment variable, which is how CI and anyone with an unusual layout says where
 *   2. a peer checkout beside this repository, which is the ordinary local case
 *   3. a package under node_modules, which is how CI will work once the emitter ships in one
 *
 * A clone is only moved onto another branch when this is CI. A workspace there is made fresh for the
 * run; a directory on someone's machine is theirs.
 *
 * Nothing here builds anything. If the emitter is not built, the message says which command builds
 * it — guessing and running a build inside a check would hide why a run took four minutes.
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));

/** docs/xplat, the root the scripts are written relative to. */
export const XPLAT_ROOT = path.resolve(HERE, '..', '..');

/** The repository root, which is where peer checkouts sit beside. */
export const REPO_ROOT = path.resolve(XPLAT_ROOT, '..', '..');

/** Where a clone goes when there is no peer checkout. Ignored by git; safe to delete. */
export const CACHE_DIR = path.join(REPO_ROOT, '.snippet-cache');

const SPIKE_RELATIVE = path.join(
    'XPlatform', 'Main', 'Tests', 'XSharpTesting', 'SnippetEmitterSpike');

function firstExisting(candidates) {
    for (const candidate of candidates) {
        if (candidate && fs.existsSync(candidate)) return candidate;
    }
    return null;
}

/**
 * The built snippet emitter, as a loaded module.
 *
 * The renderer's modules touch window and document as they load — they are Web Components classes —
 * so a DOM stub is required first. Code generation never renders anything; the stub exists only to
 * let the modules evaluate.
 */
let loaded = null;
export function loadSnippetApi() {
    if (loaded !== null) return loaded;
    const { api, shim } = resolveSnippetApiPaths();
    require(shim);
    loaded = require(api);
    return loaded;
}

/** The paths the emitter and its DOM stub were found at, for a script that wants to report them. */
export function resolveSnippetApiPaths() {
    const fromEnv = process.env.IG_SNIPPET_API;
    const shimFromEnv = process.env.IG_SNIPPET_DOM_SHIM;
    if (fromEnv) {
        if (!fs.existsSync(fromEnv)) {
            fail(`IG_SNIPPET_API names a file that does not exist:\n  ${fromEnv}`);
        }
        const shim = shimFromEnv ?? path.join(path.dirname(path.dirname(fromEnv)), 'dom-shim.js');
        if (!fs.existsSync(shim)) {
            fail(`no DOM stub beside the emitter. Set IG_SNIPPET_DOM_SHIM.\n  looked for ${shim}`);
        }
        return { api: fromEnv, shim, from: 'IG_SNIPPET_API' };
    }

    // A peer dev-tools checkout, which is the ordinary local case.
    const spike = firstExisting([
        path.join(REPO_ROOT, '..', 'dev-tools', SPIKE_RELATIVE),
        path.join(REPO_ROOT, '..', '..', 'dev-tools', SPIKE_RELATIVE),
    ]);
    if (spike) {
        const api = path.join(spike, 'dist', 'snippet-api.cjs');
        const shim = path.join(spike, 'dom-shim.js');
        if (!fs.existsSync(api)) {
            fail(`found a dev-tools checkout but the emitter is not built:\n` +
                 `  ${api}\n\n` +
                 `build it with:\n` +
                 `  cd ${spike}\n` +
                 `  node collect-ts.js && npm run build`);
        }
        return { api, shim, from: path.relative(REPO_ROOT, spike) };
    }

    // A package, which is how CI works once the emitter ships in one. Kept last so a local
    // checkout always wins: someone with dev-tools open is testing their change to it.
    try {
        const pkg = require.resolve('igniteui-webcomponents-core/package.json');
        const dir = path.dirname(pkg);
        const api = firstExisting([path.join(dir, 'snippet-api.cjs')]);
        if (api) return { api, shim: path.join(dir, 'dom-shim.js'), from: 'igniteui-webcomponents-core' };
    } catch { /* not installed, which the message below covers */ }

    fail('no snippet emitter found. Either:\n' +
         '  - check out dev-tools beside this repository and build the emitter:\n' +
         `      cd ../dev-tools/${SPIKE_RELATIVE}\n` +
         '      node collect-ts.js && npm run build\n' +
         '  - or set IG_SNIPPET_API to a built snippet-api.cjs');
}

/**
 * The examples checkout: samples, and the code generation library the samples bind to.
 *
 * Cloned when there is no peer, at the branch that matches the branch being checked. The matching
 * rules are the ones dev-tools uses in Builds/scripts/resolve-xplat-examples-branch.sh, because a
 * change that spans both repositories is made on same-named branches in both, and a check that read
 * main would review the change against the wrong samples.
 */
export function resolveExamplesRoot({ quiet = false } = {}) {
    const say = (message) => { if (!quiet) console.log(`[examples] ${message}`); };

    if (process.env.XPLAT_EXAMPLES) {
        const given = path.resolve(process.env.XPLAT_EXAMPLES);
        if (!fs.existsSync(path.join(given, 'code-gen-library'))) {
            fail(`XPLAT_EXAMPLES has no code-gen-library in it:\n  ${given}`);
        }
        say(`using XPLAT_EXAMPLES: ${given}`);
        return given;
    }

    const peer = firstExisting([
        path.join(REPO_ROOT, '..', 'igniteui-xplat-examples', 'code-gen-library'),
        path.join(REPO_ROOT, '..', '..', 'igniteui-xplat-examples', 'code-gen-library'),
    ]);
    if (peer) {
        const root = path.dirname(peer);
        say(`using the peer checkout: ${root}`);
        return root;
    }

    const clone = path.join(CACHE_DIR, 'igniteui-xplat-examples');
    if (fs.existsSync(path.join(clone, '.git'))) {
        // Moving an existing checkout to another branch is a thing to do in CI and nowhere else. A
        // workspace there is made fresh for the run, so the branch has to be resolved every time; on a
        // machine, whatever is in that directory is there because someone put it there — a worktree of
        // their own clone, a branch under test — and fetching over it discards their work without asking.
        if (!IN_CI) {
            say(`using the checkout already at ${path.relative(REPO_ROOT, clone)}, as it stands`);
            return clone;
        }
        const branch = resolveExamplesBranch(say);
        say(`updating the cached clone to ${branch}`);
        git(clone, ['fetch', '--depth', '1', 'origin', branch]);
        git(clone, ['checkout', '--force', 'FETCH_HEAD']);
        return clone;
    }

    const branch = resolveExamplesBranch(say);
    say(`cloning ${branch} into ${path.relative(REPO_ROOT, clone)}`);
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    git(REPO_ROOT, ['clone', '--depth', '1', '--branch', branch, EXAMPLES_URL, clone]);
    return clone;
}

/** Whether this is a build rather than someone's machine. */
const IN_CI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' ||
    process.env.TF_BUILD === 'True';

const EXAMPLES_URL = process.env.XPLAT_EXAMPLES_URL
    ?? 'https://github.com/IgniteUI/igniteui-xplat-examples.git';

/**
 * Which branch of the examples to read.
 *
 * Same order dev-tools resolves it in: the branch's own name, then any branch whose last segment
 * matches — "docs/json-snippets" finds "gmurray/json-snippets" — then the branch this one is
 * targeting, then main. Stated as a preference list rather than a lookup because a name that
 * matches nothing has to fall all the way back without failing.
 */
export function resolveExamplesBranch(say = () => {}) {
    if (process.env.XPLAT_EXAMPLES_BRANCH) {
        say(`branch from XPLAT_EXAMPLES_BRANCH: ${process.env.XPLAT_EXAMPLES_BRANCH}`);
        return process.env.XPLAT_EXAMPLES_BRANCH;
    }

    const here = currentBranch();
    const target = stripRef(process.env.GITHUB_BASE_REF ?? '');
    const remote = remoteBranches();

    if (here && remote.includes(here)) {
        say(`exact branch match: ${here}`);
        return here;
    }
    const lastNode = here ? here.split('/').pop() : null;
    if (lastNode) {
        const match = remote.find(name => name.split('/').pop() === lastNode);
        if (match) {
            say(`last segment of "${here}" matches: ${match}`);
            return match;
        }
    }
    if (target) {
        if (target === 'main' || remote.includes(target)) {
            say(`no match for "${here}", using the branch it targets: ${target}`);
            return target;
        }
        const release = target.match(/^release\/(.+)$/);
        if (release && remote.includes(release[1])) {
            say(`no match for "${here}", using the release it targets: ${release[1]}`);
            return release[1];
        }
    }
    say(`no match for "${here}", using main`);
    return 'main';
}

function currentBranch() {
    // In a pull request the checkout is detached at the merge commit, so the branch under review is
    // only in the environment. Locally, git knows.
    const fromEnv = stripRef(process.env.GITHUB_HEAD_REF ?? process.env.GITHUB_REF ?? '');
    if (fromEnv) return fromEnv;
    try {
        const name = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'],
            { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
        return name === 'HEAD' ? null : name;
    } catch {
        return null;
    }
}

function remoteBranches() {
    try {
        const out = execFileSync('git', ['ls-remote', '--heads', EXAMPLES_URL],
            { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        return out.split('\n')
            .map(line => line.split('\t')[1])
            .filter(Boolean)
            .map(ref => ref.replace(/^refs\/heads\//, ''));
    } catch {
        // Offline, or no access. Falling back to main is better than failing a check that may not
        // need the clone at all.
        return [];
    }
}

function stripRef(value) {
    return value.replace(/^refs\/heads\//, '').trim();
}

function git(cwd, args) {
    execFileSync('git', args, { cwd, stdio: 'inherit' });
}

function fail(message) {
    console.error(message);
    process.exit(2);
}

/** `id="x" ref="x" channel="bindingCode" source="/x" exclude="Blazor"` on the fence line. */
export function parseFenceAttributes(info) {
    const attrs = {};
    for (const m of info.matchAll(/(\w+)="([^"]*)"/g)) attrs[m[1]] = m[2];
    return attrs;
}

/** Every json-snippet fence in a page, with the line it starts on. */
export function fencesOf(text) {
    const fences = [];
    for (const m of text.matchAll(/```json-snippet *([^\n]*)\n([\s\S]*?)```/g)) {
        fences.push({
            line: text.slice(0, m.index).split('\n').length,
            attrs: parseFenceAttributes(m[1]),
            info: m[1],
            body: m[2],
        });
    }
    return fences;
}

/** Every .mdx under a directory. */
export function mdxFilesUnder(dir) {
    const files = [];
    (function walk(current) {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.mdx')) files.push(full);
        }
    })(dir);
    return files.sort();
}

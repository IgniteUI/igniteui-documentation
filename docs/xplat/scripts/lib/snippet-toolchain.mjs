/**
 * Where the snippet toolchain comes from: the emitter that turns a json-snippet into a platform's
 * code, and the examples repository the samples and code generation library live in.
 *
 * Both were absolute paths into one developer's home directory, in six scripts. That works until
 * anyone else runs them, and it cannot work in CI at all. Resolution is stated once here, in the
 * order a run should prefer:
 *
 *   The emitter: an environment variable, then a built dev-tools spike beside this repository, then
 *   the one built here under scripts/snippet-emitter.
 *
 *   The examples: an environment variable naming a checkout, else the commit xplat-examples.lock.json
 *   states, fetched into .snippet-cache. See resolveExamplesRoot.
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

/** Where the locked examples are fetched to. Ignored by git; safe to delete. */
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
        // The emitter's own stub, not the spike's. The API is authored here and the spike builds
        // that same file, so the stub that answers for it is this one; the spike keeps its own for
        // its harness entries. Two of them disagreeing is how a locally built emitter fails on a
        // DOM call the published one is fine with.
        const shim = path.join(XPLAT_ROOT, 'scripts', 'snippet-emitter', 'dom-shim.js');
        if (fs.existsSync(api)) {
            return { api, shim, from: path.relative(REPO_ROOT, spike) };
        }
        // A checkout that has not been built is not a reason to stop: this repository builds its own
        // from the published packages, and that is what the run falls to. Said out loud, because
        // someone with dev-tools open probably meant to test their change to it.
        console.log(`[emitter] dev-tools is checked out but its emitter is not built, so the ` +
                    `published one is being used. To test your change:\n` +
                    `  cd ${spike}\n` +
                    `  node collect-ts.js && npm run build`);
    }

    // This repository's own build of the emitter, bundled against the published packages. Kept after
    // dev-tools so someone with a checkout open is testing their change to the renderer rather than
    // the last one that shipped — and kept at all so CI needs nothing but npm.
    const own = path.join(XPLAT_ROOT, 'scripts', 'snippet-emitter');
    const ownApi = path.join(own, 'dist', 'snippet-api.cjs');
    if (fs.existsSync(ownApi)) {
        return { api: ownApi, shim: path.join(own, 'dom-shim.js'), from: 'scripts/snippet-emitter' };
    }

    fail('no snippet emitter found. Either:\n' +
         '  - build the one in this repository, which needs nothing else:\n' +
         '      cd docs/xplat/scripts/snippet-emitter\n' +
         '      npm install && npm run build\n' +
         '  - or check out dev-tools beside this repository to test a change to the renderer:\n' +
         `      cd ../dev-tools/${SPIKE_RELATIVE}\n` +
         '      node collect-ts.js && npm run build\n' +
         '  - or set IG_SNIPPET_API to a built snippet-api.cjs');
}

/**
 * The examples checkout: samples, and the code generation library the samples bind to.
 *
 * Which commit is stated in xplat-examples.lock.json beside docs/xplat, not inferred. A checkout found
 * lying around -- a peer clone on whatever branch someone last left it, a cache from an earlier run --
 * was used as it stood, so a build could quietly read months-old samples and report the gaps as
 * errors in the page. Now:
 *
 *   1. XPLAT_EXAMPLES, a checkout named outright, is used as given: that is how someone tests their
 *      own examples changes. It says so when the checkout is not at the locked commit.
 *   2. Otherwise .snippet-cache/igniteui-xplat-examples is made to match the lock: fetched shallow and
 *      sparse, only the folders the documentation reads.
 *
 * A peer checkout is no longer picked up on its own; point XPLAT_EXAMPLES at it to use one.
 */
export const EXAMPLES_LOCK = path.join(XPLAT_ROOT, 'xplat-examples.lock.json');

/** The folders of the examples repository the documentation reads; the rest is never fetched. */
const EXAMPLES_PATHS = ['code-gen-library', 'editor-templates', 'samples'];

/** The lock: { repository, ref, commit }. A commit pins the build; a ref alone follows its tip. */
export function readExamplesLock() {
    let lock;
    try {
        lock = JSON.parse(fs.readFileSync(EXAMPLES_LOCK, 'utf8'));
    } catch (e) {
        fail(`cannot read ${path.relative(REPO_ROOT, EXAMPLES_LOCK)}: ${e.message}`);
    }
    if (!lock.repository || !lock.ref) {
        fail(`${path.relative(REPO_ROOT, EXAMPLES_LOCK)} needs "repository" and "ref"`);
    }
    return lock;
}

export function resolveExamplesRoot({ quiet = false } = {}) {
    const say = (message) => { if (!quiet) console.log(`[examples] ${message}`); };
    const lock = readExamplesLock();

    if (process.env.XPLAT_EXAMPLES) {
        const given = path.resolve(process.env.XPLAT_EXAMPLES);
        if (!fs.existsSync(path.join(given, 'code-gen-library'))) {
            fail(`XPLAT_EXAMPLES has no code-gen-library in it:\n  ${given}`);
        }
        say(`using XPLAT_EXAMPLES: ${given}`);
        const head = gitOut(given, ['rev-parse', 'HEAD']);
        if (lock.commit && head && head !== lock.commit) {
            say(`note: it is at ${head.slice(0, 10)}, not the locked ${lock.commit.slice(0, 10)} (${lock.ref})`);
        }
        return given;
    }

    const clone = path.join(CACHE_DIR, 'igniteui-xplat-examples');
    if (!lock.commit) say(`not pinned: following the tip of ${lock.ref} (pin it with resolve-examples.mjs --pin)`);
    // Generations are often run several at once, one per platform. Whoever gets here first brings the
    // cache to the lock; the rest wait, then find it already there.
    return withCacheLock(clone, () => syncCache(clone, lock, say));
}

function syncCache(clone, lock, say) {
    const wanted = lock.commit ?? lock.ref;
    if (fs.existsSync(clone)) {
        // Only a clone this made is moved. A worktree of someone's own clone, or one with edits in it,
        // is theirs: refusing loses nothing, overwriting could.
        if (!fs.existsSync(path.join(clone, '.git')) || fs.statSync(path.join(clone, '.git')).isFile()) {
            fail(`${path.relative(REPO_ROOT, clone)} is not a clone this toolchain made (a worktree, or ` +
                 `not a repository). Move it aside or delete it, or set XPLAT_EXAMPLES to use it as it is.`);
        }
        if (lock.commit && gitOut(clone, ['rev-parse', 'HEAD']) === lock.commit) {
            say(`${path.relative(REPO_ROOT, clone)} is at the locked ${lock.commit.slice(0, 10)}`);
            return clone;
        }
        if (gitOut(clone, ['status', '--porcelain'])) {
            fail(`${path.relative(REPO_ROOT, clone)} has local changes; not moving it to ${wanted}. ` +
                 `Commit or discard them, or set XPLAT_EXAMPLES to use it as it is.`);
        }
    } else {
        say(`creating ${path.relative(REPO_ROOT, clone)} from ${lock.repository}`);
        fs.mkdirSync(clone, { recursive: true });
        git(clone, ['init', '-q']);
        git(clone, ['remote', 'add', 'origin', lock.repository]);
        git(clone, ['config', 'remote.origin.promisor', 'true']);
        git(clone, ['config', 'remote.origin.partialclonefilter', 'blob:none']);
        git(clone, ['sparse-checkout', 'set', ...EXAMPLES_PATHS]);
    }

    say(`fetching ${wanted}${lock.commit ? ` (${lock.ref})` : ''}`);
    git(clone, ['fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', wanted]);
    git(clone, ['checkout', '-q', '--force', '--detach', 'FETCH_HEAD']);
    if (lock.commit && gitOut(clone, ['rev-parse', 'HEAD']) !== lock.commit) {
        fail(`fetched ${wanted} but the checkout is not at it`);
    }
    return clone;
}

/** Runs fn holding an exclusive lock beside the cache: a directory, since making one is atomic. */
function withCacheLock(clone, fn) {
    const lockDir = clone + '.lock';
    fs.mkdirSync(path.dirname(clone), { recursive: true });
    const started = Date.now();
    for (;;) {
        try {
            fs.mkdirSync(lockDir);
            break;
        } catch (e) {
            if (e.code !== 'EEXIST') throw e;
            if (Date.now() - started > 10 * 60 * 1000) {
                fail(`waited ten minutes for ${path.relative(REPO_ROOT, lockDir)}; if no other run is ` +
                     `fetching the examples, delete it`);
            }
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
        }
    }
    try {
        return fn();
    } finally {
        fs.rmSync(lockDir, { recursive: true, force: true });
    }
}

/** The commit a ref of the locked repository currently points at, or null when it cannot be read. */
export function examplesRefTip(lock, ref = lock.ref) {
    try {
        const out = execFileSync('git', ['ls-remote', lock.repository, `refs/heads/${ref}`],
            { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        return out.split('\t')[0].trim() || null;
    } catch {
        return null;
    }
}

function gitOut(cwd, args) {
    try {
        return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
        return null;
    }
}

function git(cwd, args) {
    execFileSync('git', args, { cwd, stdio: 'inherit' });
}

function fail(message) {
    console.error(message);
    process.exit(2);
}

/**
 * The library project emitter's item templates: the scaffolds a library item is emitted into.
 *
 * No package ships them, so this repository keeps a copy. A dev-tools checkout wins when there is
 * one, and the two are compared so a copy that has drifted says so rather than quietly emitting
 * last year's shape.
 */
export function resolveItemTemplates({ quiet = false } = {}) {
    const say = (message) => { if (!quiet) console.log(`[templates] ${message}`); };
    if (process.env.IG_ITEM_TEMPLATES) {
        return process.env.IG_ITEM_TEMPLATES;
    }

    const own = path.join(XPLAT_ROOT, 'scripts', 'snippet-emitter', 'templates');
    const fromDevTools = firstExisting([
        path.join(REPO_ROOT, '..', 'dev-tools', 'XPlatform', 'Main', 'Source', 'LibraryProjectEmitter',
                  'LibraryProjectEmitter', 'templates'),
        path.join(REPO_ROOT, '..', '..', 'dev-tools', 'XPlatform', 'Main', 'Source', 'LibraryProjectEmitter',
                  'LibraryProjectEmitter', 'templates'),
    ]);
    if (fromDevTools) {
        const drifted = [];
        const mine = path.join(own, 'webcomponents-template');
        const theirs = path.join(fromDevTools, 'webcomponents-template');
        if (fs.existsSync(mine) && fs.existsSync(theirs)) {
            for (const file of fs.readdirSync(mine)) {
                const a = path.join(mine, file);
                const b = path.join(theirs, file);
                if (!fs.existsSync(b) || fs.readFileSync(a, 'utf8') !== fs.readFileSync(b, 'utf8')) {
                    drifted.push(file);
                }
            }
        }
        if (drifted.length > 0) {
            say(`the copy in this repository differs from dev-tools: ${drifted.join(', ')}`);
            say('using dev-tools; copy them over when the difference is meant to stay');
        }
        return fromDevTools;
    }
    return own;
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

/** Every platform a topic can be read as. Xaml is the two that share XAML markup. */
export const ALL_PLATFORMS = ['Angular', 'React', 'WebComponents', 'Blazor', 'WinUI', 'WPF'];

/** "Xaml" stands for the two platforms that share XAML markup; everything else names itself. */
export function expandPlatforms(names) {
    const out = new Set();
    for (const name of names) {
        const trimmed = String(name).trim();
        if (trimmed === 'Xaml') { out.add('WinUI'); out.add('WPF'); }
        else if (ALL_PLATFORMS.includes(trimmed)) out.add(trimmed);
    }
    return out;
}

/**
 * The PlatformBlock ranges in a page, as line spans with the platforms they are shown to.
 *
 * A section a platform cannot see is not that platform's problem: nothing in it is expected to emit
 * there, and nothing in it leaves prose without code. Both checks read containment from here rather
 * than each keeping its own idea of it.
 */
export function platformBlocksOf(text) {
    const lines = text.split('\n');
    const blocks = [];
    const open = [];
    lines.forEach((line, i) => {
        const start = line.match(/<PlatformBlock\s+for="([^"]*)"/);
        if (start) {
            open.push({ from: i + 1, allows: expandPlatforms(start[1].split(',')) });
            return;
        }
        if (line.includes('</PlatformBlock>') && open.length > 0) {
            const b = open.pop();
            blocks.push({ ...b, to: i + 1 });
        }
    });
    return blocks;
}

/** Which platforms a line is shown to, given the blocks around it. All of them when ungated. */
export function platformsAllowedAt(blocks, line) {
    const around = blocks.filter(b => line > b.from && line < b.to);
    if (around.length === 0) return new Set(ALL_PLATFORMS);
    return around.map(b => b.allows)
        .reduce((a, b) => new Set([...a].filter(x => b.has(x))));
}

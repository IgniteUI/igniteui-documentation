/**
 * Every sample in igniteui-xplat-examples, loaded into chromium with the real component renderer,
 * checked for errors.
 *
 * The snippet checks prove a definition emits code. They cannot prove the sample it came from works:
 * a property can be spelled right, typed right and still leave a component throwing on load. This
 * runs the other half — the real packages, the real renderer, one page, every sample.
 *
 * A sample passes when the renderer reports no errors, the browser throws nothing, and the renderer
 * goes idle. Idle is its own signal (queueForIdle runs once nothing is pending), so a sample that
 * never settles is a failure rather than a slow pass.
 *
 * Usage:
 *   node run.mjs                          # the published packages
 *   node run.mjs --packages=<dir>         # a directory of locally built packages
 *   node run.mjs --filter=geo-map         # only samples whose path contains this
 *   node run.mjs --limit=20 --headed      # a quick look, with a visible browser
 *   node run.mjs --timeout=15000
 *
 * The examples checkout is resolved by ../lib/snippet-toolchain.mjs: a peer checkout, XPLAT_EXAMPLES,
 * or a clone of the examples branch matching the branch under check.
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { resolveExamplesRoot } from '../lib/snippet-toolchain.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
    const found = args.find(a => a.startsWith(`--${name}=`));
    return found === undefined ? fallback : found.slice(name.length + 3);
};
const PACKAGES = flag('packages', 'registry');
const FILTER = flag('filter');
const LIMIT = Number(flag('limit', '0')) || 0;
const TIMEOUT = Number(flag('timeout', '8000'));
const HEADED = args.includes('--headed');
const KEEP_OPEN = args.includes('--keep-open');
const VERBOSE = args.includes('--verbose');

const examples = resolveExamplesRoot();
const samplesDir = path.join(examples, 'samples');
if (!fs.existsSync(samplesDir)) {
    console.error(`no samples directory in the examples checkout: ${samplesDir}`);
    process.exit(2);
}

/* ------------------------------------------------------------------ packages */

/**
 * The packages the harness imports.
 *
 * The registry is the default because that is what a reader of the documentation installs, and a
 * check against anything else can pass while the published packages are broken. A local directory is
 * for checking a build before it ships; each entry has to be an installable package folder, which is
 * what the build produces — a folder of loose output with no package.json cannot be resolved by
 * anything, and saying so beats a hundred import failures.
 */
function ensurePackages() {
    const modules = path.join(HERE, 'node_modules');
    if (!fs.existsSync(modules)) {
        console.log('[runtime] installing the harness dependencies');
        run('npm', ['install', '--no-audit', '--no-fund'], HERE);
    }
    if (PACKAGES === 'registry') return;

    const dir = path.resolve(PACKAGES);
    if (!fs.existsSync(dir)) {
        console.error(`--packages names a directory that does not exist: ${dir}`);
        process.exit(2);
    }
    const names = fs.readdirSync(dir).filter(name => name.startsWith('igniteui-webcomponents-'));
    if (names.length === 0) {
        console.error(`no igniteui-webcomponents-* packages in ${dir}`);
        process.exit(2);
    }
    const missing = names.filter(name => !fs.existsSync(path.join(dir, name, 'package.json')));
    if (missing.length > 0) {
        console.error(`these are not installable packages — no package.json in:\n` +
                      missing.map(name => `  ${path.join(dir, name)}`).join('\n') + '\n\n' +
                      'Point --packages at the output of the packaging step, not at intermediate ' +
                      'build output.');
        process.exit(2);
    }
    // Copied over the installed ones rather than symlinked: a symlink would have the local package
    // resolve its own dependencies from outside this project, and copying leaves the source
    // untouched. node_modules is disposable either way.
    for (const name of names) {
        const target = path.join(modules, name);
        fs.rmSync(target, { recursive: true, force: true });
        fs.cpSync(path.join(dir, name), target, { recursive: true });
    }
    console.log(`[runtime] using ${names.length} locally built package(s) from ${dir}`);
}

function ensureChromium() {
    // Playwright downloads browsers on demand and is quiet about having none, which surfaces as a
    // launch failure with a message about executables. Asking for it up front makes the wait
    // explainable, and it is a no-op once installed.
    console.log('[runtime] making sure chromium is available');
    run('npx', ['playwright', 'install', 'chromium'], HERE, { quiet: !VERBOSE });
}

function run(command, argv, cwd, { quiet = false } = {}) {
    execFileSync(command, argv, { cwd, stdio: quiet ? ['ignore', 'ignore', 'inherit'] : 'inherit' });
}

/* ------------------------------------------------------- the sample library */

/**
 * The code generation library, emitted for Web Components.
 *
 * Through the product's own emission — the same code generating renderer the library project emitter
 * drives, the same per-item templates, the same lookup shape it writes — rather than by reading the
 * library folder and deciding for itself which files are data. A second implementation gets the easy
 * items right, is wrong about every item whose content the renderer transforms, and drifts from the
 * real one the moment either changes.
 *
 * Only the items the selected samples actually name are emitted. That keeps the browser's module graph
 * to what is under check, and keeps a sample for a component this harness does not install from
 * failing every other sample by breaking the lookup they all import.
 */
function emitLibrary(api, names) {
    const generated = path.join(HERE, 'generated');
    fs.rmSync(generated, { recursive: true, force: true });
    fs.mkdirSync(generated, { recursive: true });

    const emitted = api.emitLibrary('WebComponents', {
        examplesRoot: examples,
        only: [...names].sort(),
    });

    // An item importing a package this harness does not install cannot be part of the lookup: every
    // item is imported by it, so one unresolvable import stops the page loading at all rather than
    // failing the samples that needed that item. Checked here, in node, because the alternative is
    // finding out from a bundler error with the whole run already lost.
    const unavailable = [];
    const usable = {};
    for (const [name, content] of Object.entries(emitted.files)) {
        const missing = unresolvableImports(content);
        if (missing.length > 0) {
            unavailable.push({ item: name.replace(/\.ts$/, ''), missing });
            continue;
        }
        usable[name] = content;
    }

    for (const [name, content] of Object.entries(usable)) {
        fs.writeFileSync(path.join(generated, name), content, 'utf8');
    }
    const dropped = new Set(unavailable.map(entry => entry.item));
    fs.writeFileSync(path.join(generated, 'libraryManager.ts'),
        withoutItems(emitted.manager, dropped), 'utf8');
    return { ...emitted, unavailable };
}

/** The bare module specifiers a file imports that nothing here can resolve. */
function unresolvableImports(content) {
    const missing = new Set();
    for (const match of content.matchAll(/from\s+['"]([^'".][^'"]*)['"]/g)) {
        const specifier = match[1];
        if (specifier.startsWith('.') || specifier.startsWith('/')) continue;
        try {
            import.meta.resolve(specifier, `file://${path.join(HERE, 'harness.js')}`);
        } catch {
            missing.add(specifier);
        }
    }
    return [...missing];
}

/**
 * The lookup without the items whose files were dropped — both the import and the registration, since
 * either one alone would not compile.
 */
function withoutItems(manager, dropped) {
    if (dropped.size === 0) return manager;
    return manager.split('\n').filter(line => {
        for (const name of dropped) {
            if (line.includes(`from './${name}'`)) return false;
            if (line.includes(`this._items.set("${name}"`)) return false;
            if (line.includes(`this._requiredStyles.add("${name}"`)) return false;
        }
        return true;
    }).join('\n');
}

/**
 * The names a set of samples refer to.
 *
 * Read off the JSON: any string property whose name ends in "Ref" is a reference. Some name an element
 * inside the same description, which the renderer resolves itself and the library simply does not
 * have — asking for those costs nothing.
 */
function referenceNamesIn(node, found = new Set()) {
    if (Array.isArray(node)) {
        for (const item of node) referenceNamesIn(item, found);
        return found;
    }
    if (!node || typeof node !== 'object') return found;
    for (const [key, value] of Object.entries(node)) {
        if (key.endsWith('Ref') && typeof value === 'string') found.add(value);
        else if (typeof value === 'object') referenceNamesIn(value, found);
    }
    // A sample can also list the handlers it runs at start-up by name.
    for (const list of ['onInit', 'onViewInit']) {
        const value = node[list];
        if (typeof value === 'string') found.add(value);
        else if (Array.isArray(value)) for (const one of value) {
            if (typeof one === 'string') found.add(one);
        }
    }
    return found;
}

/** The packages the harness imports, read from its own dependencies. */
const PACKAGE_NAMES = Object.keys(
    JSON.parse(fs.readFileSync(path.join(HERE, 'package.json'), 'utf8')).dependencies ?? {});

/* --------------------------------------------------------------------- samples */

function samples() {
    const found = [];
    (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.json')) found.push(full);
        }
    })(samplesDir);
    const relative = found
        .map(file => path.relative(samplesDir, file).split(path.sep).join('/'))
        .filter(name => !FILTER || name.includes(FILTER))
        .sort();
    return LIMIT > 0 ? relative.slice(0, LIMIT) : relative;
}

/* ------------------------------------------------------------------------ run */

ensurePackages();
ensureChromium();

const list = samples();
if (list.length === 0) {
    console.error(`no samples matched${FILTER ? ` --filter=${FILTER}` : ''}`);
    process.exit(2);
}

const wanted = new Set();
const parsed = new Map();
for (const name of list) {
    const sample = JSON.parse(fs.readFileSync(path.join(samplesDir, name), 'utf8'));
    parsed.set(name, sample);
    referenceNamesIn(sample, wanted);
}

const { loadSnippetApi } = await import('../lib/snippet-toolchain.mjs');
const library = emitLibrary(loadSnippetApi(), wanted);
console.log(`[runtime] emitted ${library.dataItems} data item(s) and ${library.handlerItems} ` +
            `handler item(s) for ${list.length} sample(s)`);
// A sample binding to one of these is not checked, and is reported as such rather than failed. The
// packages in question are the ones the documentation this repository builds does not cover — the
// modern web grids version on their own line — and a check that fails over what it does not install
// says nothing about what it does.
const uncovered = new Set(library.unavailable.map(entry => entry.item));
if (uncovered.size > 0) {
    const packages = new Set(library.unavailable.flatMap(entry => entry.missing));
    console.log(`[runtime] ${uncovered.size} library item(s) need package(s) this harness does not ` +
                `install: ${[...packages].join(', ')}`);
}
const realProblems = library.problems.filter(p => p.reason !== 'no such library item');
if (realProblems.length > 0) {
    console.log(`[runtime] ${realProblems.length} library item(s) emitted nothing:`);
    for (const problem of realProblems.slice(0, 10)) {
        console.log(`  ${problem.item}: ${problem.reason}`);
    }
}

const { createServer } = await import('vite');
const { chromium } = await import('playwright');

const server = await createServer({
    root: HERE,
    configFile: false,
    logLevel: VERBOSE ? 'info' : 'error',
    server: {
        // The data items live in the examples checkout, outside this project.
        fs: { allow: [HERE, examples], strict: false },
        port: 0,
        // No hot reloading. A reload part way through a run replaces the page, and with it the harness
        // the runner is calling into — which read as a hundred samples failing at once because the
        // harness "was undefined".
        hmr: false,
    },
    // Every package named up front, so the dependency optimiser does its work before the first sample
    // rather than discovering a package half way through and reloading the page to use it.
    optimizeDeps: { include: PACKAGE_NAMES },
});
await server.listen();
const url = server.resolvedUrls.local[0];
console.log(`[runtime] harness at ${url}`);

// The browser's own output, kept in a ring. A tab that dies says why on stderr — a signal, an
// out-of-memory report, a check that failed inside the renderer process — and none of that reaches the
// page's console. Playwright hands it over through the logger, so it is here when a crash needs
// explaining and out of the way when it does not.
const browserLog = [];
const browser = await chromium.launch({
    headless: !HEADED,
    logger: {
        isEnabled: (name) => name === 'browser',
        log: (name, severity, message) => {
            browserLog.push(`${severity}: ${String(message).trim()}`);
            if (browserLog.length > 60) browserLog.shift();
        },
    },
});

// Everything the browser complains about, attributed to whichever sample was loading at the time.
let current = null;
const browserProblems = new Map();
const noteProblem = (sample, message) => {
    if (!sample) return;
    if (!browserProblems.has(sample)) browserProblems.set(sample, []);
    browserProblems.get(sample).push(message);
};

/**
 * A page with the harness on it, ready to be asked for a sample.
 *
 * Made through a function because a page can be lost — a tab that runs out of memory takes the harness
 * with it — and the answer to an unreachable host is to start another one, which is what the xsharp
 * test runner does. Restarts are counted and reported: needing one is itself a finding about what a
 * sample left behind, even though the run carries on.
 */
let page = null;
let restarts = 0;
let crashed = false;
// The stages the current sample went through, most recent last.
let stages = [];
// Everything the page said while loading it.
let chatter = [];
// What the renderers reported while loading it, streamed out of the page as it happened.
let rendererSaid = [];

async function openPage() {
    if (page !== null) {
        await page.close().catch(() => {});
    }
    page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    // Playwright says so when a tab dies, which is the only notice that arrives — the call being
    // awaited simply never returns.
    page.on('crash', () => {
        crashed = true;
        noteProblem(current, 'the tab died while this sample was loading');
    });
    page.on('pageerror', (error) => {
        // The first frame as well as the message: "cannot read properties of null" says nothing about
        // where, and where is the whole question when a component throws during load.
        const frame = String(error.stack ?? '').split('\n').find(line => line.trim().startsWith('at '));
        noteProblem(current, `uncaught: ${error.message}${frame ? `\n            ${frame.trim()}` : ''}`);
    });
    page.on('console', (message) => {
        const text = message.text();
        // How far the sample got. Kept per sample so a crash can say which stage it was in, and the
        // last few of them are worth showing even when the tab survives.
        if (text.startsWith('[stage] ')) {
            stages.push(text.slice('[stage] '.length));
            if (stages.length > 12) stages.shift();
            return;
        }
        // What the renderer objected to, as it objected. Kept separately from the return value, which a
        // crashed tab never delivers.
        if (text.startsWith('[cr-error] ')) {
            rendererSaid.push(text.slice('[cr-error] '.length));
            if (rendererSaid.length > 20) rendererSaid.shift();
            return;
        }
        // Everything the page says, of any kind, in a ring. A component often logs something on its
        // way down, and a warning that means nothing on a good run is the whole story on a bad one.
        chatter.push(`${message.type()}: ${text}`);
        if (chatter.length > 40) chatter.shift();
        if (message.type() !== 'error') return;
        // A sample binding to a remote service is not what this check is about, and a network failure in
        // CI would report as a component error.
        if (/net::ERR_|Failed to load resource|ERR_NAME_NOT_RESOLVED/.test(text)) return;
        noteProblem(current, `console: ${text}`);
    });
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction('window.igSampleHarnessReady === true', null, { timeout: 120000 });
}

await openPage();

const setup = await page.evaluate('window.igSampleHarness.registered()');
console.log(`[runtime] registered ${setup.descriptions} description module(s) and ` +
            `${setup.modules} component module(s)`);
if (setup.failures.length > 0) {
    console.log(`[runtime] ${setup.failures.length} module(s) would not register:`);
    for (const failure of setup.failures.slice(0, 10)) console.log(`  ${failure}`);
}

console.log(`[runtime] loading ${list.length} sample(s)\n`);

const failures = [];
const contaminated = [];
const leftBehind = [];
const unresolvedNames = new Map();
const enumProblems = new Map();
const skipped = [];
let passed = 0;
// How much the page is holding after each sample. A page that dies part way through a run is holding
// something it should have let go of, and the shape of this says where it started.
const heapBySample = [];
// The last reading taken, so a crash can say what the page was holding beforehand.
let lastHeap = 0;
// Which sample ran before the current one, so a failure that comes from inherited state can name it.
let previous = null;

for (const name of list) {
    const sample = parsed.get(name);
    const needsUncovered = [...referenceNamesIn(sample)].filter(ref => uncovered.has(ref));
    if (needsUncovered.length > 0) {
        skipped.push({ name, needs: needsUncovered });
        continue;
    }
    current = name;
    let problems = await loadOnce(name, sample);

    // A second attempt, on the same page, for anything that failed. A sample that fails in sequence
    // and passes immediately afterwards was not broken: it inherited something the sample before it
    // left behind, and that is a finding about the component or the renderer rather than about this
    // sample. Reported as its own kind, because the fix is somewhere else entirely.
    if (problems.length > 0) {
        browserProblems.delete(name);
        const second = await loadOnce(name, sample);
        if (second.length === 0) {
            contaminated.push({ name, after: previous, problems });
            console.log(`  LEAK  ${name}`);
            console.log(`          failed after ${previous ?? 'nothing'}, passed on its own`);
            for (const problem of problems.slice(0, 3)) console.log(`          ${problem}`);
            previous = name;
            continue;
        }
        problems = second;
    }

    if (problems.length === 0) {
        passed++;
        if (VERBOSE) console.log(`  ok    ${name}`);
        previous = name;
        continue;
    }
    failures.push({ name, problems });
    console.log(`  FAIL  ${name}`);
    // A crash is reported whole: it cannot be reproduced by reading further down the log.
    const show = problems.some(p => p.startsWith('the page stopped answering')) ? problems.length : 6;
    for (const problem of problems.slice(0, show)) console.log(`          ${problem}`);
    if (problems.length > show) console.log(`          … and ${problems.length - show} more`);
    previous = name;
}

/**
 * That the page still has a harness on it, restarting it if not.
 *
 * A page can go away underneath a run, and the next call then fails with a message about something
 * being undefined, which says nothing about the sample being loaded. Recovering here means a run
 * survives it and the report says how often it happened.
 */
async function ensureHarness() {
    const present = await page.evaluate('window.igSampleHarnessReady === true').catch(() => false);
    if (present === true) return;
    restarts++;
    await openPage();
}

/**
 * Everything known about a page that stopped answering.
 *
 * "Target crashed" on its own says nothing anyone can act on. What is available at that moment: the
 * stage the harness had reached, whatever the page said before it went, what the browser process wrote
 * to its own log, and how much the page was holding beforehand. All of it, because a crash cannot be
 * gone back to — the tab is gone and the state with it.
 */
function describeLostPage(name, error, heapBefore) {
    const lines = [`the page stopped answering: ${error.message.split('\n')[0]}`];
    if (crashed) lines.push('playwright reported the tab as crashed');
    if (stages.length > 0) {
        lines.push(`reached: ${stages.join(' → ')}`);
        lines.push(`so it went down during "${stages[stages.length - 1]}"`);
    }
    lines.push(`the sample: ${describeSample(name)}`);
    // The renderer collects rather than throws, so it may well have said what was wrong before the tab
    // went. Those never came back with the call; they came out on the console as they happened.
    for (const said of rendererSaid.slice(-8)) lines.push(`the renderer reported: ${said}`);
    const said = browserProblems.get(name) ?? [];
    for (const problem of said.slice(-6)) lines.push(`the page said: ${problem}`);
    for (const line of chatter.slice(-8)) lines.push(`the page logged: ${line}`);
    if (heapBefore > 0) {
        lines.push(`it was holding ${(heapBefore / (1024 * 1024)).toFixed(0)}MB before this sample`);
    }
    const fromBrowser = browserLog.filter(line =>
        /error|fatal|out of memory|oom|signal|crash|check failed|abort/i.test(line));
    for (const line of fromBrowser.slice(-8)) lines.push(`the browser said: ${line}`);
    if (fromBrowser.length === 0 && browserLog.length > 0) {
        for (const line of browserLog.slice(-4)) lines.push(`the browser said: ${line}`);
    }
    return lines;
}

/**
 * What a sample is, in a line: the components it names and how many of each.
 *
 * So a crash report stands on its own. Whoever reads it should not have to open the sample to know it
 * was a radial chart with four series.
 */
function describeSample(name) {
    const sample = parsed.get(name);
    if (!sample) return name;
    const counts = new Map();
    (function walk(node) {
        if (Array.isArray(node)) { node.forEach(walk); return; }
        if (!node || typeof node !== 'object') return;
        if (typeof node.type === 'string') counts.set(node.type, (counts.get(node.type) ?? 0) + 1);
        for (const value of Object.values(node)) {
            if (value && typeof value === 'object') walk(value);
        }
    })(sample.descriptions ?? sample);
    const shown = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([type, count]) => count > 1 ? `${count}× ${type}` : type);
    return shown.join(', ') || 'nothing recognisable';
}

/** One attempt at a sample, as a list of complaints. Empty means it loaded clean. */
async function loadOnce(name, sample) {
    let result;
    crashed = false;
    stages = [];
    chatter = [];
    rendererSaid = [];
    const heapBefore = lastHeap;
    try {
        await ensureHarness();
        result = await page.evaluate(
            ([json, timeout]) => window.igSampleHarness.load(json, { timeout }),
            [sample, TIMEOUT]);
    } catch (e) {
        return describeLostPage(name, e, heapBefore);
    }

    for (const missing of result.unresolved) {
        unresolvedNames.set(missing, (unresolvedNames.get(missing) ?? 0) + 1);
    }
    for (const problem of result.enumProblems ?? []) {
        enumProblems.set(problem, (enumProblems.get(problem) ?? 0) + 1);
    }
    for (const problem of result.leftBehind ?? []) {
        // The teardown of whatever ran before this one complained. Named against that sample, since
        // that is whose state it is.
        leftBehind.push({ after: previous, problem });
    }

    const heap = await page.evaluate(
        '(performance.memory && performance.memory.usedJSHeapSize) || 0').catch(() => 0);
    if (heap > 0) {
        heapBySample.push({ name, heap });
        lastHeap = heap;
    }

    return [
        ...result.thrown.map(t => `threw: ${t.split('\n')[0]}`),
        ...result.errors.map(e => `renderer: ${e.split('\n')[0]}`),
        ...(result.timedOut ? [`never went idle within ${TIMEOUT}ms`] : []),
        ...(result.animationTimedOut ? ['animations never settled'] : []),
        ...(browserProblems.get(name) ?? []),
    ];
}

current = null;

if (unresolvedNames.size > 0) {
    console.log(`\n[runtime] ${unresolvedNames.size} reference(s) went unresolved — neither the ` +
                `renderer nor the library had them, so those samples rendered without them:`);
    for (const [name, count] of [...unresolvedNames].slice(0, 10)) {
        console.log(`  ${name} (${count} sample(s))`);
    }
}

if (skipped.length > 0) {
    console.log(`\n[runtime] ${skipped.length} sample(s) not checked: they bind to library items that ` +
                `need a package this harness does not install`);
    for (const entry of skipped.slice(0, 8)) {
        console.log(`  ${entry.name} — binds to ${entry.needs.slice(0, 3).join(', ')}` +
                    (entry.needs.length > 3 ? `, and ${entry.needs.length - 3} more` : ''));
    }
    if (skipped.length > 8) console.log(`  … and ${skipped.length - 8} more`);
}

if (enumProblems.size > 0) {
    console.log(`\n[runtime] ${enumProblems.size} value(s) are not members of the enumeration they ` +
                `were given to, and were read as the first member:`);
    for (const [problem, count] of [...enumProblems].slice(0, 8)) {
        console.log(`  ${problem}${count > 1 ? ` (${count} sample(s))` : ''}`);
    }
}

if (leftBehind.length > 0) {
    console.log(`\n[runtime] ${leftBehind.length} time(s) a sample could not be torn down cleanly:`);
    for (const entry of leftBehind.slice(0, 8)) {
        console.log(`  after ${entry.after ?? 'nothing'}: ${entry.problem}`);
    }
}

if (contaminated.length > 0) {
    console.log(`\n[runtime] ${contaminated.length} sample(s) failed in sequence and passed on their ` +
                `own — state left behind by what ran before them:`);
    for (const entry of contaminated) {
        console.log(`  ${entry.name}, after ${entry.after ?? 'nothing'}`);
    }
}

if (restarts > 0) {
    console.log(`\n[runtime] the page stopped answering ${restarts} time(s) and was restarted — the ` +
                `failures above say which sample was loading and how far it had got`);
}

if (heapBySample.length > 2) {
    const first = heapBySample[0];
    const last = heapBySample[heapBySample.length - 1];
    const mb = (bytes) => (bytes / (1024 * 1024)).toFixed(0);
    console.log(`\n[runtime] the page held ${mb(first.heap)}MB after the first sample and ` +
                `${mb(last.heap)}MB after the last`);
    // The biggest single increases, which is where to look when a run does not survive.
    const jumps = heapBySample.slice(1)
        .map((entry, i) => ({ name: entry.name, grew: entry.heap - heapBySample[i].heap }))
        .filter(entry => entry.grew > 8 * 1024 * 1024)
        .sort((a, b) => b.grew - a.grew)
        .slice(0, 5);
    for (const jump of jumps) console.log(`  +${mb(jump.grew)}MB at ${jump.name}`);
}

console.log(`\n${passed} of ${list.length - skipped.length} sample(s) loaded clean, ` +
            `${failures.length} failed, ${contaminated.length} only in sequence, ` +
            `${skipped.length} not checked`);

if (KEEP_OPEN) {
    console.log('[runtime] --keep-open: the browser stays up. Ctrl-C when done.');
    await new Promise(() => {});
}
await browser.close();
await server.close();
// A sample that only fails in sequence is a failure of the run, not of the sample — but it is still a
// failure: state that leaks between samples is state that leaks between pages in a browser.
process.exit(failures.length > 0 || contaminated.length > 0 ? 1 : 0);

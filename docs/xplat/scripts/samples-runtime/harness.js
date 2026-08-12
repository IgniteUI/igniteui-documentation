/**
 * The page a sample is loaded into, with the real component renderer and the real packages.
 *
 * The discipline is the Web Components test host's, because that host loads hundreds of samples into
 * one page without it falling over, and each part of what it does is there for a reason it learned the
 * hard way. What is left out is only the part about interacting with what rendered: this asks whether a
 * sample loads, not whether it behaves.
 *
 * Registration walks the packages' exports rather than naming modules one by one. A list of imports is
 * a list to keep in step with the product, and its failure mode is a component that quietly does not
 * register — which reads as a broken sample rather than a stale harness.
 */

import * as core from 'igniteui-webcomponents-core';
import * as charts from 'igniteui-webcomponents-charts';
import * as maps from 'igniteui-webcomponents-maps';
import * as gauges from 'igniteui-webcomponents-gauges';
import * as dataGrids from 'igniteui-webcomponents-data-grids';
import * as inputs from 'igniteui-webcomponents-inputs';
import * as layouts from 'igniteui-webcomponents-layouts';
import * as dashboards from 'igniteui-webcomponents-dashboards';
import * as datasources from 'igniteui-webcomponents-datasources';

// Emitted by run.mjs through the product's own library emission — the same code generating renderer,
// the same item templates, the same lookup shape the library project emitter writes. See emitLibrary
// in the snippet emitter's api.
import { LibraryManager, CodeGenHelper } from './generated/libraryManager';

const namespaces = { core, charts, maps, gauges, dataGrids, inputs, layouts, dashboards, datasources };

/**
 * Animations advance on a timer rather than on animation frames.
 *
 * The tick provider drives chart animations through requestAnimationFrame, which a browser throttles or
 * pauses when a page is not the one being painted — headless, or one of several. Animations then never
 * reach idle, every animated sample waits out its timeout, and what they leave queued piles up until
 * the tab dies. Timers fire regardless. Copied from the test host, which installs it for the same
 * reason; it changes nothing about the product.
 */
(function installTimerAnimationClock(frameMs) {
    if (window.__timerAnimationClock) return;
    window.__timerAnimationClock = true;
    window.requestAnimationFrame = (cb) => window.setTimeout(
        () => cb(typeof performance !== 'undefined' ? performance.now() : Date.now()), frameMs);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
})(16);

/**
 * An unknown enumeration value becomes the first member rather than an exception.
 *
 * The host's own accommodation, and it belongs here for the same reason: parse throws, and a throw
 * partway through building a component leaves the renderer holding half of one, which the next sample
 * then inherits. Counted and reported per sample, so a value that is not a real member is still
 * visible — the part a check needs and a host does not.
 */
const enumProblems = [];
(function tolerateUnknownEnumValues() {
    const util = core.EnumUtil;
    if (!util || typeof util.parse !== 'function' || util.__tolerant) return;
    const original = util.parse.bind(util);
    util.parse = (type, value, ignoreCase) => {
        try {
            return original(type, value, ignoreCase);
        } catch (e) {
            enumProblems.push(`"${value}" is not a value of ${type && type.name ? type.name : type}`);
            return 0;
        }
    };
    util.__tolerant = true;
})();

const registered = { descriptions: 0, modules: 0, failures: [] };
let registering = 0;

/** Every description module in every package, into a renderer's context. */
function registerDescriptions(context) {
    registering = 0;
    for (const [nsName, ns] of Object.entries(namespaces)) {
        for (const key of Object.keys(ns)) {
            if (!key.endsWith('DescriptionModule')) continue;
            try {
                ns[key].register(context);
                // Per renderer context, so the number is what a renderer knows rather than the sum
                // over however many renderers this page happens to keep.
                registered.descriptions = Math.max(registered.descriptions, ++registering);
            } catch (e) {
                registered.failures.push(`${nsName}.${key}: ${e && e.message}`);
            }
        }
    }
}

/**
 * Every component module in every package.
 *
 * A description says what to build; a module is what makes the element it names exist. Registering all
 * of them is what lets one page load every sample — a sample naming a component whose module was not
 * registered renders nothing and says nothing.
 */
function registerModules() {
    const manager = core.ModuleManager;
    for (const [nsName, ns] of Object.entries(namespaces)) {
        for (const key of Object.keys(ns)) {
            if (!/^Igc[A-Za-z0-9]*Module$/.test(key)) continue;
            const module = ns[key];
            if (!module || typeof module.register !== 'function') continue;
            try {
                manager.register(module);
                registered.modules++;
            } catch (e) {
                registered.failures.push(`${nsName}.${key}: ${e && e.message}`);
            }
        }
    }
}

/**
 * Two renderers, as the host has: one for the sample, one for the property editor beside it.
 *
 * An editor is a component that drives another component, described in a container of its own. The host
 * keeps it on a renderer of its own, and cleans up both between samples.
 */
const renderer = new core.ComponentRenderer();
const editorRenderer = new core.ComponentRenderer();

for (const each of [renderer, editorRenderer]) {
    // Errors are collected rather than thrown: the renderer catches what goes wrong while it builds and
    // puts it on its own list, which is the difference between a report naming the sample and a stack
    // in the console attached to nothing. Without it the first bad property stops the load, and
    // everything after it goes unexamined.
    each.isProceedOnErrorEnabled = true;
    // Unused references are cleaned up as it renders, so tearing a sample down also unregisters what it
    // registered — the axis a chart declared does not linger to be found by the next sample.
    each.cleanupUnusedOnRender = true;
    registerDescriptions(each.context);
}
registerModules();

/**
 * One of each of the elements a sample is most likely to name, created and thrown away.
 *
 * The host does this too. Registering a module is not the same as the custom element being defined;
 * touching the constructor is what defines it, and a sample that is the first to name one would
 * otherwise render into an element the browser does not know yet.
 */
(function defineCommonElements() {
    for (const tag of ['igc-data-chart', 'igc-category-chart', 'igc-financial-chart', 'igc-pie-chart',
                       'igc-data-grid', 'igc-property-editor-panel', 'igc-bullet-graph',
                       'igc-radial-gauge', 'igc-linear-gauge', 'igc-geographic-map', 'igc-sparkline',
                       'igc-toolbar', 'igc-legend', 'igc-item-legend']) {
        try {
            document.createElement(tag);
        } catch { /* a tag no installed package defines is not this harness's business */ }
    }
})();

const SLOTS = ['content', 'editor', 'legend', 'aboveContent', 'aboveContentLeft', 'aboveContentRight',
               'belowContent', 'leftContent', 'rightContent'];

/** The container a description slot is keyed to. */
const containerFor = (key) => document.getElementById(key);

// What a handler reaches the rendered component through, wired the way the host wires it: by container
// name for a description, and by ref name — either spelling — for anything else.
CodeGenHelper.descriptionLookup = (name) => {
    const container = containerFor(name);
    return container ? container.firstElementChild : null;
};
CodeGenHelper.findByNameLookup = (name) => {
    const capitalised = name.length > 0 ? name[0].toUpperCase() + name.substring(1) : name;
    for (const candidate of [name, capitalised]) {
        let found = null;
        renderer.resolveRefValue(containerFor('content'), candidate, (value) => { found = value; });
        if (found !== null && found !== undefined) return found;
    }
    return LibraryManager.instance.hasItem(name) ? LibraryManager.instance.getInstance(name) : null;
};

/**
 * What a reference in a sample resolves to.
 *
 * The renderer resolves a reference naming an element inside the same description itself; what reaches
 * here is a library item — the data a series binds to, or a handler — and the lookup answers for those
 * exactly as it does in a generated project. Answering means saying so: the renderer takes the value
 * only when "found" is set, and a resolver that assigns the value alone is ignored without a word.
 *
 * Nothing is cached. The lookup builds an instance per request, which is what a generated sample gets,
 * and holding every data set a run has touched is one way to run a page out of memory.
 */
const unresolved = new Set();

function addResolver(target) {
    target.addReferenceResolver((name, args) => {
        if (LibraryManager.instance.hasItem(name)) {
            try {
                args.referenceValue = LibraryManager.instance.getInstance(name);
                args.found = true;
            } catch (e) {
                unresolved.add(`${name} — the library item would not construct: ${e && e.message}`);
            }
            return;
        }
        // A property editor binds to the renderer driving the page. The samples name it "renderer",
        // which is the name a generated sample gives the field it assigns.
        if (name === 'renderer' || name === 'componentRenderer' || name === 'ComponentRenderer') {
            args.referenceValue = renderer;
            args.found = true;
            return;
        }
        // Anything else the renderer could not resolve for itself: reported, not answered. A property
        // editor whose target is in another container is the common one, and not a load failure.
        unresolved.add(name);
    });
}
addResolver(renderer);
addResolver(editorRenderer);

let teardownProblems = [];

/** What the test host allows an animation before calling it stuck. */
const ANIMATION_TIMEOUT = 3000;

/**
 * The state one sample leaves behind, cleared before the next — the host's CleanupPage, which is not
 * the same as emptying the containers.
 *
 * The renderer holds per-container state: what it built, what it is waiting on, which references were
 * provided. A sample loaded over the top of another's inherits it, and the symptom is a sample that
 * passes alone and fails in a run — a failure that moves. Both renderers, every container, as the host
 * does it. What the teardown itself complains about is kept and reported, because a component that
 * cannot be torn down is the next sample's problem and worth naming as this one's.
 */
function cleanupPage() {
    for (const slot of SLOTS) {
        const container = containerFor(slot);
        if (!container) continue;
        for (const each of [renderer, editorRenderer]) {
            try {
                each.cleanup(container, true);
            } catch (e) {
                teardownProblems.push(`${slot}: ${e && e.message}`);
            }
        }
        container.innerHTML = '';
    }
}

/** Waits for every container to have drawn what it was given. */
function flushAll() {
    const containers = SLOTS.map(containerFor).filter(c => c && c.firstElementChild);
    return Promise.all(containers.map(container => new Promise((resolve) => {
        let settled = false;
        const done = () => { if (!settled) { settled = true; resolve(); } };
        setTimeout(done, 2000);
        try {
            renderer.waitForFlush(container, done);
        } catch {
            done();
        }
    })));
}

/**
 * Loads one sample and reports what happened.
 *
 * The host's order, and each wait is for a different thing. Idle says nothing is queued. Flush says what
 * was queued has been drawn. Animation idle says an animated component has settled — and a sample left
 * mid-animation carries on into the next one and throws there, which makes the report blame whichever
 * sample happened to be loading. A timeout at any of the three is a failure: a sample that never
 * settles is doing something it should not.
 */
/**
 * How far the load got, said out loud.
 *
 * A crashed tab answers nothing: the call the runner is waiting on never returns, and all it knows is
 * that the page died. These lines are on the console as they happen, so the runner has them already —
 * the last one printed is the stage the sample was in when the process went down.
 */
function stage(what) {
    console.debug(`[stage] ${what}`);
}

async function load(sample, options) {
    const timeout = (options && options.timeout) || 8000;

    teardownProblems = [];
    enumProblems.length = 0;
    stage('cleanup');
    cleanupPage();
    const leftBehind = teardownProblems.slice();
    renderer.clearErrors();
    editorRenderer.clearErrors();
    unresolved.clear();

    // The renderer asks for a reference by this name when a sample says it animates, and calls it once
    // the animation settles or the time is up. Providing it is how the host waits for animations, and it
    // is also what stops the renderer reporting that reference as missing.
    const animated = sample && sample.hasAnimations === true;
    let onAnimationIdle = null;
    const animationSettled = animated
        ? new Promise((resolve) => { onAnimationIdle = resolve; })
        : Promise.resolve(false);
    if (animated) {
        renderer.provideRefValue(containerFor('content'), 'AnimationIdleHandler',
            (timedOutFlag) => { if (onAnimationIdle) onAnimationIdle(timedOutFlag === true); });
    }

    const json = animated
        ? JSON.stringify({ ...sample, animationIdleTimeout: ANIMATION_TIMEOUT })
        : JSON.stringify(sample);

    stage('loadJson');
    const thrown = [];
    try {
        renderer.loadJson(json, containerFor);
    } catch (e) {
        thrown.push(String((e && e.stack) || e));
    }

    const errors = collectErrors();
    // Anything the renderers object to between the stages, taken as it appears rather than at the end,
    // so a stage that never finishes does not take the reason with it.
    const duringIdle = [];

    stage('idle');
    let timedOut = false;
    let animationTimedOut = false;
    if (thrown.length === 0) {
        timedOut = await new Promise((resolve) => {
            let settled = false;
            const timer = setTimeout(() => {
                if (settled) return;
                settled = true;
                resolve(true);
            }, timeout);
            renderer.queueForIdle(containerFor('content'), () => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(false);
            });
        });

        if (!timedOut) {
            stage('flush');
            duringIdle.push(...collectErrors());
            await flushAll();
            if (animated) {
                stage('animation');
                animationTimedOut = await Promise.race([
                    animationSettled,
                    new Promise((resolve) => setTimeout(() => resolve('gave up'), ANIMATION_TIMEOUT + 1000)),
                ]).then(result => result === 'gave up' || result === true);
            }
        }
    }

    stage('done');
    const afterIdle = collectErrors();

    // Named references the renderer never got a value for: its own account of what is missing, rather
    // than this harness's guess from the JSON.
    const missingRefs = typeof renderer.getMissingRefs === 'function'
        ? renderer.getMissingRefs().slice() : [];

    return {
        errors: errors.concat(duringIdle, afterIdle),
        thrown,
        // What the previous sample left in a state this one had to clear up. Reported against this
        // sample because that is when it was found, and named as the previous sample's doing.
        leftBehind,
        timedOut,
        animationTimedOut,
        enumProblems: enumProblems.slice(),
        unresolved: [...unresolved, ...missingRefs.filter(name => !unresolved.has(name))],
    };
}

/**
 * The errors the renderers have collected, taken off their lists and said out loud as well as returned.
 *
 * Said out loud because of crashes. With errors collected rather than thrown, everything the renderer
 * objected to sits on its list until the load returns — and if the tab dies first, that list dies with
 * it. On the console they have left the page by the time it goes, so a crash report can carry what the
 * renderer was complaining about on the way down.
 */
function collectErrors() {
    const found = [];
    for (const each of [renderer, editorRenderer]) {
        if (each.hasErrors()) {
            for (const error of each.getErrors()) {
                found.push(error);
                console.debug(`[cr-error] ${error}`);
            }
            each.clearErrors();
        }
    }
    return found;
}

window.igSampleHarness = {
    load,
    registered: () => registered,
    itemCount: () => LibraryManager.instance.itemNames().length,
};

// Read by the runner to know the page is usable, rather than guessing with a delay.
window.igSampleHarnessReady = true;

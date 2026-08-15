/// <reference types="vite/client" />
/*
 * A reusable entry point for turning a sample's JSON into the snippets it declares.
 *
 * The other entry points here are command line tools. This one is a function, because the
 * documentation build has to call it while transforming a page: a `json-snippet` block in an .mdx
 * becomes the markup for whichever platform is being generated.
 *
 * It is deliberately the same path the emitter spike's tests exercise — same renderer, same
 * options, same recorder — so that what the documentation build produces is what the suite has
 * already asserted.
 *
 * For now this is bundled from the locally built product TS. Once the renderer work is merged and
 * published, the import block below is the only part that has to change.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import {
    CodeGeneratingComponentRenderer,
    CodeGenerationFolderTemplate,
    CodeGenerationLibrary,
    CodeGenerationLibraryItemType,
    CodeGenerationRendererOptions,
    CodeGenerationSnippetRecorder,
    CodeGenerationTargetPlatforms,
    JsonSchemaEmitter,
    TypeDescriptionPlatform,
} from "igniteui-webcomponents-core";
import * as core from "igniteui-webcomponents-core";

import { NodeCodeGenerationLibraryFileAccess } from "./node-file-access";

export interface EmittedSnippet {
    /** The snippet id the sample declared, or the default id when it declared none. */
    id: string;
    /** The channel or output region the snippet was taken from. */
    channel: string;
    /** "id:channel". */
    key: string;
    content: string;
}

export interface EmitOptions {
    /** Where the code generation library and editor templates live. */
    examplesRoot: string;
    /**
     * Filled with the refs the renderer had no value for once the definition had been loaded.
     *
     * The renderer's own account, taken after the attempt rather than guessed from the JSON: a name
     * it never resolved is one nothing in the definition or the library answered for. Reading it from
     * the renderer is the only reliable way — walking the JSON cannot tell a library item from a
     * component the definition declares itself.
     */
    missingRefsOut?: string[];
    /** The id given to the snippet a sample does not name. */
    defaultSnippetId?: string;
    /** Emit the component as code behind rather than markup. */
    forceCodeBehind?: boolean;
    /**
     * Style options to start from, before the sample's own $styleOptions are read.
     *
     * The renderer's defaults are what it has always emitted, which is right for a generated
     * project but not for a documentation snippet — the docs keep attributes on one line, and the
     * XAML platforms write no dimensions. A caller states that once here, rather than every sample
     * having to repeat it, and any sample can still override what it needs.
     *
     * Keys are the same names $styleOptions uses.
     */
    styleDefaults?: Record<string, unknown>;
}

const fileAccess = new NodeCodeGenerationLibraryFileAccess();

// Loading the library and the description modules is the expensive part, and neither depends on
// the sample. A documentation build emits thousands of snippets, so both are done once.
let cachedLibrary: any = null;
let cachedRoot: string | null = null;

function libraryFor(examplesRoot: string): any {
    if (cachedLibrary !== null && cachedRoot === examplesRoot) return cachedLibrary;
    cachedLibrary = CodeGenerationLibrary.fromFolder(path.join(examplesRoot, "code-gen-library"), fileAccess);
    cachedRoot = examplesRoot;
    return cachedLibrary;
}

// Every description module the package exports. Taken from the package's own surface rather than a
// list, because the set grows with the product and a missing one is a type a sample may not use.
function registerDescriptions(renderer: any): void {
    const context = renderer.context;
    for (const [name, exported] of Object.entries(core as Record<string, any>)) {
        if (!name.endsWith("DescriptionModule")) continue;
        if (exported && typeof exported.register === "function") {
            exported.register(context);
        }
    }
}

/**
 * Folds the caller's style defaults into the sample's own $styleOptions, which the sample wins.
 *
 * Merged into the JSON rather than set on the options object directly, so that a default goes
 * through exactly the same reading a sample's own $styleOptions does — several of these are
 * enumerations whose JSON spelling ("singleLine") is not their value, and assigning the string
 * would quietly do nothing.
 */
function applyStyleDefaults(json: string, defaults: Record<string, unknown> | undefined): string {
    if (!defaults) return json;

    let parsed: any;
    try {
        parsed = JSON.parse(json);
    } catch {
        return json;   // not our business to report; loadCodeJson will say so properly
    }
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return json;

    const declared = parsed["$styleOptions"];
    parsed["$styleOptions"] = { ...defaults, ...(declared && typeof declared === "object" ? declared : {}) };
    return JSON.stringify(parsed);
}

/**
 * The description property a platform's own name refers to, on a given component.
 *
 * For anything reading existing platform source rather than writing it: documentation written as
 * dataSource="…" on the web and ItemsSource="…" in XAML is one property, and the description
 * metadata is the only thing that knows that. Returns null when the component has no such property,
 * which is the caller's cue to fall back to the name as written.
 *
 * Component and platform are named as the documentation spells them — "DataGrid", "WinUI".
 */
export function resolvePropertyName(component: string, platformName: string, writtenName: string): string | null {
    const platform = (TypeDescriptionPlatform as any)[platformName];
    if (platform === undefined) return null;

    const context = sharedContext();
    const resolved = context.resolveFromPlatformName(component, platform, writtenName);
    return resolved === undefined ? null : resolved;
}

// One context, registered once: resolving a name does not depend on any sample, and the
// documentation build asks thousands of times.
let cachedContext: any = null;
function sharedContext(): any {
    if (cachedContext !== null) return cachedContext;
    const options: any = new CodeGenerationRendererOptions();
    const renderer: any = new CodeGeneratingComponentRenderer(
        (CodeGenerationTargetPlatforms as any).WebComponents, options);
    registerDescriptions(renderer);
    cachedContext = renderer.context;
    return cachedContext;
}

/** The platform names this understands, as the documentation build spells them. */
export function isSupportedPlatform(platformName: string): boolean {
    return (CodeGenerationTargetPlatforms as any)[platformName] !== undefined;
}

// Every description type, which is what the schema is generated from. Globbed rather than listed
// because the set grows with the product, and a schema missing a type would report the sample using
// it as invalid.
function descriptionTypeMarkers(): any[] {
    const types: any[] = [];
    for (const [name, exported] of Object.entries(core as Record<string, any>)) {
        if (!name.endsWith("Description")) continue;
        const marker = exported && exported.$t;
        if (marker !== undefined && marker !== null) types.push(marker);
    }
    return types;
}

/**
 * The JSON schema the snippets are written against.
 *
 * Generated from the same description metadata the renderer emits from, so the schema cannot
 * describe a property the renderer would reject, or miss one it would accept.
 */
export function emitJsonSchema(examplesRoot: string): string {
    const types = descriptionTypeMarkers();

    const emitter: any = new (JsonSchemaEmitter as any)(
        types, sharedContext(), libraryFor(examplesRoot));
    return emitter.toString();
}

/**
 * The folder template to emit a platform's snippets from.
 *
 * A platform without one of its own borrows from the platform whose output it shares. Uno emits the
 * same XAML dialect as WinUI, against the same Microsoft.UI.Xaml types, and differs only in how a
 * project is put together — which a snippet never shows. Borrowing beats declaring a second copy
 * that would then have to be kept in step, and beats failing a documentation build over a project
 * file no reader sees.
 */
function templateDirFor(examplesRoot: string, platformName: string): string {
    const borrows: { [key: string]: string } = { Uno: "WinUI" };
    const dir = (name: string) =>
        path.join(examplesRoot, "editor-templates", name, "main-template");
    if (fs.existsSync(dir(platformName))) {
        return dir(platformName);
    }
    const borrowed = borrows[platformName];
    if (borrowed && fs.existsSync(dir(borrowed))) {
        return dir(borrowed);
    }
    throw new Error(`no main-template for ${platformName} at ${dir(platformName)}`);
}

/**
 * Emits every snippet a sample declares, for one platform.
 *
 * Throws rather than returning something half-formed: a documentation build that silently drops a
 * snippet would publish a page with a hole in it, which is worse than failing the build.
 */
export function emitSnippets(json: string, platformName: string, opts: EmitOptions): EmittedSnippet[] {
    const platform = (CodeGenerationTargetPlatforms as any)[platformName];
    if (platform === undefined) {
        throw new Error(`unknown platform: ${platformName}`);
    }

    const templateDir = templateDirFor(opts.examplesRoot, platformName);

    const options: any = new CodeGenerationRendererOptions();
    options.library = libraryFor(opts.examplesRoot);
    options.forceCodeBehind = opts.forceCodeBehind === true;


    const recorder: any = new CodeGenerationSnippetRecorder();
    if (opts.defaultSnippetId && !options.forceCodeBehind) {
        recorder.defaultSnippetId = opts.defaultSnippetId;
    }
    options.snippetRecorder = recorder;

    const renderer: any = new CodeGeneratingComponentRenderer(platform, options);
    registerDescriptions(renderer);

    const template: any = new CodeGenerationFolderTemplate();
    template.fileAccess = fileAccess;
    template.loadTemplate(templateDir);

    renderer.loadCodeJson(applyStyleDefaults(json, opts.styleDefaults));
    const result: any = renderer.emitCode(template);

    // A handler or data source the library does not have produces no code and no complaint, so a
    // misspelled name would publish a page missing the very thing it set out to show.
    if (opts.missingRefsOut) {
        for (const ref of (renderer.getMissingRefs() as string[]) ?? []) {
            if (opts.missingRefsOut.indexOf(ref) < 0) opts.missingRefsOut.push(ref);
        }
    }

    const missing: string[] = result?.getMissingLibraryItems?.() ?? [];
    if (missing.length > 0) {
        throw new Error(`sample refers to library items that do not exist: ${missing.join(", ")}`);
    }

    if (recorder.hasUnclosedZones()) {
        throw new Error("an emitter left a recording zone open — zones are mis-nested");
    }
    const unfulfilled: string[] = recorder.getUnfulfilledNamedRequests();
    if (unfulfilled.length > 0) {
        throw new Error(`snippet asked for library items never emitted: ${unfulfilled.join(", ")}`);
    }

    return (recorder.getSnippets() as any[])
        .map(s => ({ id: s.id, channel: s.channel, key: s.key, content: s.content as string }))
        .sort((a, b) => a.key.localeCompare(b.key));
}

/** The snippet id used when a block filters a sample down rather than naming its own snippets. */
const FILTERED_SNIPPET_ID = "doc";

/**
 * Emits a part of an existing sample: the sample as the source, narrowed to the properties a
 * documentation block is about.
 *
 * A topic showing a sample usually wants a few lines of it, not the thirty properties the running
 * sample carries. Rather than restating those lines — which is how the two drift apart, and they
 * have — the block names the sample and says which properties it is illustrating.
 *
 * The sample is a source, not an authority. A topic may be illustrating a scenario the peered
 * sample does not cover, so `overrides` can change or add anything, and a block that shares nothing
 * with the sample should carry its own definition instead.
 *
 * Returns null when nothing was captured, which means the properties named are not on the element.
 */
export function emitSampleSubset(
    sampleJson: string,
    platformName: string,
    opts: EmitOptions & { include?: string[]; overrides?: Record<string, unknown> },
): string | null {
    let parsed: any;
    try {
        parsed = JSON.parse(sampleJson);
    } catch (e: any) {
        throw new Error(`sample is not valid JSON: ${e.message}`);
    }

    // A sample wraps its component in descriptions.content; a snippet written inline may not.
    const root = parsed && parsed.descriptions && parsed.descriptions.content
        ? parsed.descriptions.content
        : parsed;
    if (!root || typeof root !== "object") {
        throw new Error("sample has no component to emit");
    }

    if (opts.overrides) {
        for (const [name, value] of Object.entries(opts.overrides)) {
            root[name] = value;
        }
    }

    if (opts.include && opts.include.length > 0) {
        // Marking the element and the wanted properties makes everything else fall away: a snippet
        // with any inclusion records only what is included. Same mechanism a sample uses to name
        // its own snippets, driven from here instead.
        root["$type"] = `+${FILTERED_SNIPPET_ID}:markup`;
        for (const name of opts.include) {
            root[`$${name}`] = `+${FILTERED_SNIPPET_ID}:markup`;
        }
    }

    const emitted = emitSnippets(JSON.stringify(parsed), platformName, {
        ...opts,
        defaultSnippetId: opts.include && opts.include.length > 0 ? undefined : opts.defaultSnippetId,
    });

    const wanted = opts.include && opts.include.length > 0
        ? emitted.filter(s => s.id === FILTERED_SNIPPET_ID)
        : emitted;
    if (wanted.length === 0) return null;
    return wanted[0].content;
}

/**
 * The single snippet a sample declares, which is the common case for a documentation block.
 * Returns null when the sample produced nothing for this platform.
 */
export function emitSingleSnippet(json: string, platformName: string, opts: EmitOptions): string | null {
    const snippets = emitSnippets(json, platformName, opts);
    if (snippets.length === 0) return null;
    if (snippets.length === 1) return snippets[0].content;

    const named = opts.defaultSnippetId
        ? snippets.filter(s => s.id === opts.defaultSnippetId)
        : [];
    if (named.length === 1) return named[0].content;

    throw new Error(
        `sample declared ${snippets.length} snippets (${snippets.map(s => s.key).join(", ")}); ` +
        `a documentation block takes one, so name which is wanted`);
}

/* ------------------------------------------------------------- the library, for a browser */

/**
 * The code generation library, emitted for a platform, the way the library project emitter emits it.
 *
 * That tool exists to compile every library item once, and it works by handing each item to the code
 * generating renderer against a mock description and reading back the file the renderer wrote. This
 * is the same sequence, in node, through the same classes — not a reimplementation that walks the
 * library folder and guesses which files are data. A guess gets the easy items right and is wrong
 * about every item whose content the renderer transforms, and the two would drift the moment either
 * side changed.
 *
 * What it is for: loading samples in a browser. A sample binds to its data and handlers by name, and
 * a live renderer resolves those names through a lookup the host provides. That lookup is exactly
 * what the emitter's libraryManager is, so it is returned here too, generated from the same item
 * information.
 *
 * The item templates come from the library project emitter's own templates directory, so there is one
 * copy of them; pass templatesRoot when it is somewhere other than beside that tool.
 */
export interface EmittedLibrary {
    /** File name to content, as the emitter would have written them. */
    files: Record<string, string>;
    /** The lookup a host resolves references through, keyed by item name. */
    manager: string;
    /** What went wrong per item, for the items that produced nothing. */
    problems: { item: string; reason: string }[];
    dataItems: number;
    handlerItems: number;
}

interface LibraryItemInfo {
    name: string;
    isData: boolean;
    /** Whether the module exports the item's own type rather than a holder wrapped around it. */
    isOwnType: boolean;
    hasRequiredStyle: boolean;
    accessPath: string;
}

/**
 * Which of the named library items have nothing for a platform.
 *
 * A definition naming an item the library cannot answer for on a platform does not emit there, and the
 * reason is the library rather than the definition: the item was written for some platforms and not
 * others. Asked for by name so a caller can check what one topic depends on rather than the whole
 * library.
 */
export function itemsMissingForPlatform(platformName: string, opts: {
    examplesRoot: string;
    items?: string[];
}): string[] {
    const platform = (CodeGenerationTargetPlatforms as any)[platformName];
    if (platform === undefined) {
        throw new Error(`unknown platform: ${platformName}`);
    }
    const library: any = libraryFor(opts.examplesRoot);
    const names: string[] = opts.items ?? library.getItemNames();
    const missing: string[] = [];
    for (const name of names) {
        if (!library.hasItem(name)) {
            missing.push(name);
            continue;
        }
        const content = library.getItem(name).getContentForPlatform(platform);
        if (content === null || content === undefined) {
            missing.push(name);
        }
    }
    return missing;
}

export function emitLibrary(platformName: string, opts: {
    examplesRoot: string;
    templatesRoot?: string;
    only?: string[];
    /**
     * Item names whose data keeps the casing it was authored in, or true for all of them.
     *
     * Casing is altered in concert: when the emitter camelises a data item's members it camelises the
     * member paths in the markup with it, so a generated sample matches itself. A caller that has the
     * data emitted here but the paths from somewhere else — a live renderer reading the sample's own
     * JSON — has only one of the two halves, and asking for the data unaltered is how the two agree.
     */
    skipAlterDataCasing?: boolean | string[];
}): EmittedLibrary {
    const platform = (CodeGenerationTargetPlatforms as any)[platformName];
    if (platform === undefined) {
        throw new Error(`unknown platform: ${platformName}`);
    }
    if (platformName !== "WebComponents" && platformName !== "React" && platformName !== "Angular") {
        // The item templates and the shape of the lookup are per platform. Only the web platforms are
        // wired up here, because a browser is the only host that needs this.
        throw new Error(`emitLibrary is only implemented for the web platforms, not ${platformName}`);
    }

    const templateDir = itemTemplateDirFor(platformName, opts.templatesRoot);
    const library: any = libraryFor(opts.examplesRoot);
    const names: string[] = opts.only ?? library.getItemNames();

    // A renderer per item, sharing one registered context — which is what the library project
    // emitter does, and not an optimisation. An emitter keeps state across an emission: the set of
    // library items it has already written is what stops a supporting class being emitted twice. Kept
    // across items, that state makes every item after the first carry the ones before it — the same
    // class declared three times in one file. The context is the part that is safe to share, and
    // registering the description modules into it is the slow part.
    let context: any = null;
    const rendererFor = (): any => {
        const options: any = new CodeGenerationRendererOptions();
        options.library = library;
        options.forceHelperLookups = true;
        options.skipAngularEventDestructuring = true;
        if (context !== null) {
            options.reusedContext = context;
            return new CodeGeneratingComponentRenderer(platform, options);
        }
        const first: any = new CodeGeneratingComponentRenderer(platform, options);
        registerDescriptions(first);
        context = first.context;
        return first;
    };

    const files: Record<string, string> = {};
    const problems: { item: string; reason: string }[] = [];
    const tracked: LibraryItemInfo[] = [];

    // A queue rather than a loop over the names asked for: a library item can import another one —
    // the airports are derived from the flights — and an item whose neighbour was left out does not
    // load. Whatever an emitted file imports from beside it is added and emitted too, until nothing
    // new appears. Emitting the whole library instead would work as well, and is what the library
    // project emitter does; a caller asking for a subset is asking for a smaller module graph.
    const queue: string[] = [...names];
    const seen = new Set<string>(names);

    while (queue.length > 0) {
        const name = queue.shift() as string;
        if (!library.hasItem(name)) {
            problems.push({ item: name, reason: "no such library item" });
            continue;
        }
        const item: any = library.getItem(name);

        // What this item requires is emitted as an item of its own as well as into this one, because a
        // request for a supporting item resolves against the library: an item whose types are only
        // inlined into its requirer is not there to be asked for.
        const requires: string[] | null = item.getRequiresForPlatform(platform);
        if (requires !== null && requires !== undefined) {
            for (const required of requires) {
                if (seen.has(required) || !library.hasItem(required)) continue;
                seen.add(required);
                queue.push(required);
            }
        }

        const content: any = item.getContentForPlatform(platform);
        if (content === null || content === undefined) {
            // Nothing for this platform, which is ordinary: an item can be declared for the XAML
            // platforms alone.
            continue;
        }

        const template: any = new CodeGenerationFolderTemplate();
        template.fileAccess = fileAccess;
        template.loadTemplate(templateDir);

        // The renderer needs something to be emitting into before an item is anything; a description
        // that binds nothing is enough, and is what the emitter uses.
        const renderer: any = rendererFor();
        const skipCasing = opts.skipAlterDataCasing === true ||
            (Array.isArray(opts.skipAlterDataCasing) && opts.skipAlterDataCasing.indexOf(name) >= 0) ||
            content.skipAlterDataCasing === true;
        renderer.loadCodeJson(mockDescription(skipCasing));
        renderer.markRefUsed(name);
        renderer.emitCode(template);

        const emitted = outputOf(template);
        const dataFile = `${name}.ts`;
        if (emitted[dataFile] !== undefined) {
            files[dataFile] = emitted[dataFile];
            enqueueSiblings(emitted[dataFile], library, seen, queue);
            tracked.push({
                name, isData: true, isOwnType: true, hasRequiredStyle: false,
                accessPath: `[() => new ${name}(), () => new ${name}()]`,
            });
            continue;
        }
        // A supporting item declares a type of its own, so it is emitted as that type and reached as
        // one: no holder, the same way a code based data item is its own class. An item asks for one
        // through CodeGenHelper rather than constructing it, and this is what that request resolves
        // against — so the name it is registered under is the name the request states.
        if (item.type === CodeGenerationLibraryItemType.Supporting) {
            const declarations = emitted["supporting.ts"];
            if (declarations !== undefined) {
                files[`${name}.ts`] = declarations;
                enqueueSiblings(declarations, library, seen, queue);
                // Requestable only when the item declares the type its own name states, the way a code
                // based data item does. An item declaring several types — a family of styling
                // strategies, say — is emitted for the items that require it and is not something to
                // ask for by name, so registering it under a type that does not exist is the one thing
                // not to do: the import alone would stop the library loading.
                if (declaresType(declarations, name)) {
                    tracked.push({
                        name, isData: false, isOwnType: true, hasRequiredStyle: false,
                        accessPath: `[() => new ${name}(), () => new ${name}()]`,
                    });
                }
                continue;
            }
            problems.push({ item: name, reason: "no supporting template output to emit its type from" });
            continue;
        }

        const holderFile = emitted["handler.ts"] !== undefined ? "handler.ts"
            : emitted["template.ts"] !== undefined ? "template.ts" : null;
        if (holderFile !== null) {
            const holder = emitted[holderFile].split("PlaceholderHolder").join(`${name}Holder`);
            files[`${name}.ts`] = holder;
            enqueueSiblings(holder, library, seen, queue);
            tracked.push({
                name, isData: false, isOwnType: false,
                hasRequiredStyle: holder.indexOf("requiredStyles") >= 0,
                // A handler is reached through its holder, and bound to it, because the emitter
                // writes it as a method that refers to the holder's own fields.
                accessPath: `[() => new ${name}Holder(), () => { const h = new ${name}Holder(); ` +
                    `const item = (h as any)['${camelize(name)}']; ` +
                    `return typeof item === 'function' ? item.bind(h) : item; }]`,
            });
            continue;
        }
        problems.push({ item: name, reason: `emitted none of ${Object.keys(emitted).join(", ") || "no files"}` });
    }

    return {
        files,
        manager: managerFor(tracked),
        problems,
        dataItems: tracked.filter(i => i.isData).length,
        handlerItems: tracked.filter(i => !i.isData).length,
    };
}

/**
 * The library items an emitted file imports from beside it, queued to be emitted as well.
 *
 * "import { WorldConnections } from './WorldFlights'" says this item does not stand alone. The name
 * imported is not always the item's — an item can export several classes — so the module it is
 * imported from is what identifies it.
 */
/** Whether emitted content declares a type of the given name, which is what makes it requestable. */
function declaresType(content: string, name: string): boolean {
    return new RegExp(`export\\s+(?:abstract\\s+)?class\\s+${name}\\b`).test(content);
}

function enqueueSiblings(content: string, library: any, seen: Set<string>, queue: string[]): void {
    const pattern = /from\s+['"]\.\/([A-Za-z0-9_]+)['"]/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
        const name = match[1];
        if (name === "libraryManager" || seen.has(name) || !library.hasItem(name)) continue;
        seen.add(name);
        queue.push(name);
    }
}

/** Where the per-item templates live: the library project emitter's own copy of them. */
function itemTemplateDirFor(platformName: string, templatesRoot?: string): string {
    const folder = platformName === "WebComponents" ? "webcomponents-template"
        : platformName === "React" ? "react-template" : "angular-template";
    const roots = templatesRoot ? [templatesRoot] : [
        path.resolve(__dirname, "..", "..", "..", "..", "Source", "LibraryProjectEmitter",
            "LibraryProjectEmitter", "templates"),
        path.resolve(process.cwd(), "..", "..", "..", "Source", "LibraryProjectEmitter",
            "LibraryProjectEmitter", "templates"),
    ];
    for (const root of roots) {
        const dir = path.join(root, folder);
        if (fs.existsSync(dir)) return dir;
    }
    throw new Error(`no ${folder} found. Pass templatesRoot pointing at the library project ` +
                    `emitter's templates directory.
  looked in:
    ${roots.join("\n    ")}`);
}

function mockDescription(skipAlterDataCasing: boolean): string {
    const wrapper: any = { descriptions: { content: { type: "DataChart" } } };
    if (skipAlterDataCasing) wrapper.skipAlterDataCasing = true;
    return JSON.stringify(wrapper);
}

function outputOf(template: any): Record<string, string> {
    const out: Record<string, string> = {};
    for (const filePath of template.getFilePaths() as string[]) {
        const content = template.getFileOuutput(filePath);
        if (content === null || content === undefined || String(content).trim() === "") continue;
        out[path.basename(filePath)] = String(content);
    }
    return out;
}

function camelize(name: string): string {
    return name.length === 0 ? name : name[0].toLowerCase() + name.substring(1);
}

/**
 * The lookup, as the library project emitter writes it: an item name to a pair of creators, the
 * holder and the value. Written as a module rather than a namespace so a browser can import it.
 */
function managerFor(items: LibraryItemInfo[]): string {
    const imports = items.map(item => item.isOwnType
        ? `import { ${item.name} } from './${item.name}';`
        : `import { ${item.name}Holder } from './${item.name}';`).join("\n");
    const entries = items.map(item =>
        `        this._items.set(${JSON.stringify(item.name)}, ${item.accessPath});`).join("\n");
    const styles = items.filter(item => item.hasRequiredStyle)
        .map(item => `        this._requiredStyles.add(${JSON.stringify(item.name)});`).join("\n");

    return `${imports}

export class LibraryManager {
    private static _instance: LibraryManager | null = null;
    public static get instance(): LibraryManager {
        if (LibraryManager._instance === null) {
            LibraryManager._instance = new LibraryManager();
        }
        return LibraryManager._instance;
    }
    private _items: Map<string, (() => any)[]> = new Map<string, (() => any)[]>();
    private _requiredStyles: Set<string> = new Set<string>();
    private constructor() {
${entries}
${styles}
    }
    public getInstance(itemName: string): any { return this._items.get(itemName)![1](); }
    public getCreator(itemName: string): (() => any) { return this._items.get(itemName)![1]; }
    public getHolderInstance(itemName: string): any { return this._items.get(itemName)![0](); }
    public getHolderCreator(itemName: string): (() => any) { return this._items.get(itemName)![0]; }
    public hasItem(itemName: string): boolean { return this._items.has(itemName); }
    public hasRequiredStyles(itemName: string): boolean { return this._requiredStyles.has(itemName); }
    public itemNames(): string[] { return [...this._items.keys()]; }
}

export class CodeGenHelper {
    public static descriptionLookup: ((descriptionName: string) => any) | null = null;
    public static findByNameLookup: ((name: string) => any) | null = null;
    public static getDescription<T>(descriptionName: string): T | null {
        if (CodeGenHelper.descriptionLookup === null) { return null; }
        return CodeGenHelper.descriptionLookup(descriptionName) as T;
    }
    public static findByName<T>(name: string): T | null {
        if (CodeGenHelper.findByNameLookup === null) { return null; }
        return CodeGenHelper.findByNameLookup(name) as T;
    }
    // A supporting item, asked for by name rather than constructed on an assumption that its type is
    // in scope. Whoever installed the lookup owns the lifetime of what it hands back: nothing is kept
    // here, so one definition is never given what the definition before it was holding.
    public static getSharedSupporting<T>(itemName: string): T | null {
        if (CodeGenHelper.sharedSupportingLookup === null) { return null; }
        return CodeGenHelper.sharedSupportingLookup(itemName) as T;
    }
    public static createSupporting<T>(itemName: string): T | null {
        if (CodeGenHelper.newSupportingLookup === null) { return null; }
        return CodeGenHelper.newSupportingLookup(itemName) as T;
    }
    public static sharedSupportingLookup: ((itemName: string) => any) | null = null;
    public static newSupportingLookup: ((itemName: string) => any) | null = null;
}
`;
}

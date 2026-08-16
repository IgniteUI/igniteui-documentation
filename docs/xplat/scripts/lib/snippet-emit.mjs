/**
 * What a json-snippet fence emits — one implementation, for the build and for the check.
 *
 * These two used to be separate: generation had this logic, and check-snippet-emission.mjs had its
 * own reading of it, down to scraping the generator's style table with a regular expression. The
 * check passed a page the build then refused to generate, because the check marked a definition one
 * way and the build marked it another, and neither was wrong about its own rules. A check that emits
 * something the pages do not is not evidence about the pages.
 *
 * So the fence is emitted here, and both callers ask this. The check may still choose what to do
 * with what comes back — it emits for platforms a page is gated away from, which generation never
 * does — but what comes back is what would be published.
 */

/** The fence language each platform's code — as opposed to its markup — is written in. */
export const CODE_FENCE_LANG = {
    Angular: 'ts',
    React: 'tsx',
    WebComponents: 'ts',
    Blazor: 'razor',
    WPF: 'csharp',
    WinUI: 'csharp',
    Uno: 'csharp',
};

/** The shorthands for region lists that keep coming up. */
export const CHANNEL_PRESETS = {
    // What a topic showing code behind almost always wants.
    codeBehind: 'bindingImports...bindingInit,bindingCode',
};

/**
 * The channels a handler contributes to — the handler itself, the region it lands in, and the
 * imports its types need. A sample's handlers are asked for these and left alone for the rest.
 */
export const HANDLER_CHANNELS = new Set([
    'handler', 'eventHandlers', 'handlersImports', 'allCode', 'supporting', 'supportingTypes']);

/** The regions a fence's channel names, presets expanded and delimiters dropped. */
export function regionsOf(channel) {
    const expanded = CHANNEL_PRESETS[channel.trim()] ?? channel;
    return expanded.split(/(?:\.\.\.|,)/).map(one => one.trim()).filter(Boolean);
}

/**
 * Whether the definition asks for part of itself, rather than all of itself.
 *
 * A sidecar whose value opens with `+` is an inclusion, wherever it sits in the tree — on an
 * element's `$type` or on one of its properties.
 */
export function hasInclusionMarker(node) {
    if (Array.isArray(node)) return node.some(hasInclusionMarker);
    if (!node || typeof node !== 'object') return false;
    for (const [key, value] of Object.entries(node)) {
        // A sidecar carries one marker, a list of them where the thing belongs to more than one
        // channel, or an object splaying either of those by platform. Any marker anywhere in that
        // counts, so the shapes are flattened rather than enumerated.
        if (key.startsWith('$') && markerStrings(value).some(one => one.startsWith('+'))) {
            return true;
        }
        if (hasInclusionMarker(value)) return true;
    }
    return false;
}

/** Every marker string a sidecar value holds, whichever of the three shapes it is written in. */
function markerStrings(value) {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(markerStrings);
    if (value && typeof value === 'object') return Object.values(value).flatMap(markerStrings);
    return [];
}

/**
 * An emitter bound to one platform and one examples checkout.
 *
 * `knownItem` answers whether a name is a library item this platform has, which is how `item=` can
 * name something that is not a handler. Callers that cannot answer say so by leaving it out, and
 * then `item=` means what it always meant: one of the handlers the sample runs.
 */
export function fenceEmitter({ api, platform, examplesRoot, styleDefaults, knownItem = null }) {

    /**
     * The definition with all but the named items left out of its init lists.
     *
     * What a fence's `item=` asks for. A sample's handlers can include ones the topic is not
     * teaching — a set of shared helpers another handler calls, say — and there is no way to mark
     * one entry of a list, so the copy handed to the emitter lists only what the block should show.
     *
     * A name can also be a supporting item rather than a handler. Those are not in the init lists at
     * all: they are pulled in by the `requires` of the items that are, and the block asks for a
     * region of one. There is nothing to narrow for those, so the lists are left as they stand and
     * the region marker below is what selects the block.
     */
    function withOnlyTheseItems(parsed, only) {
        const wanted = only.split(',').map(one => one.trim()).filter(Boolean);
        const copy = JSON.parse(JSON.stringify(parsed));
        const lists = ['onInit', 'onViewInit'];

        const handlers = new Set();
        for (const list of lists) {
            for (const name of [].concat(copy[list] ?? [])) {
                if (wanted.includes(name)) handlers.add(name);
            }
        }

        // A name that is neither a handler this sample runs nor an item the library has is a mistake
        // worth stopping for: the block would otherwise come out empty, or hold the wrong handler,
        // and read as though that were the sample.
        const unaccounted = wanted.filter(name => !handlers.has(name) &&
                                                  !(knownItem !== null && knownItem(name)));
        if (unaccounted.length > 0) {
            throw new Error(`item="${only}" names nothing this sample uses: ${unaccounted.join(', ')}`);
        }
        if (handlers.size === 0) return copy;

        for (const list of lists) {
            const names = copy[list];
            if (names === undefined) continue;
            const kept = [].concat(names).filter(name => handlers.has(name));
            if (kept.length === 0) delete copy[list];
            else copy[list] = kept;
        }
        return copy;
    }

    /**
     * One named channel of a definition — the part that did not fit in the markup.
     *
     * Asked for by recording a zone over the whole element on that channel, which is the same
     * mechanism a sample uses to name its own snippets.
     */
    function emitChannel(json, channel, only) {
        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch (e) {
            throw new Error(`not valid JSON: ${e.message}`);
        }
        // A sample may run several handlers where the topic teaches one of them. Marking the list
        // asks for all of them, so the ones not wanted are dropped from the copy being emitted; the
        // fence still states the whole sample, and only the block is narrowed.
        if (only) parsed = withOnlyTheseItems(parsed, only);
        // Asking for a component's code is asking for it built rather than declared, which is what
        // forcing code behind does. The performance topics show a property being set on a chart the
        // reader already has, and that is the lesson — not the same property written in markup.
        const asCode = channel === 'code';
        const root = parsed && parsed.descriptions && parsed.descriptions.content
            ? parsed.descriptions.content
            : parsed;
        // Marking the root includes everything under it, which is what a topic showing a whole
        // sample wants. A definition that marks parts of itself is asking for those parts instead,
        // so leave its own markers to say what is included and let the rest stay closed.
        if (!hasInclusionMarker(root)) root['$type'] = `+doc:${channel}`;

        // A handler is not written where its name appears, so marking the element does not reach it.
        // The list of handler names carries its own sidecar, which registers the request the handler
        // emitter answers when it gets there.
        //
        // Only for the channels a handler writes to. Asking one for markup, or for the binding code
        // the companion fence probes, leaves the library item requested and never emitted, which is
        // an error — so a sample can keep its handlers listed while a fence shows only its markup.
        //
        // A fence naming one item asks for that item's code whatever the channel is called: a region
        // of it is a channel token too, and the set above cannot list names an item invents.
        if (HANDLER_CHANNELS.has(channel) || only) {
            for (const list of ['onInit', 'onViewInit']) {
                if (parsed[list] !== undefined) parsed[`$${list}`] = `+doc:${channel}`;
            }
        }

        const snippets = api.emitSnippets(JSON.stringify(parsed), platform, {
            examplesRoot, styleDefaults, forceCodeBehind: asCode,
        });
        // The definition may also produce the whole-sample snippet the emitter makes by default. The
        // one asked for here is the one keyed to this request.
        return snippets.find(s => s.key === `doc:${channel}`)?.content
            ?? snippets.find(s => s.channel === channel)?.content ?? '';
    }

    /**
     * The regions a fence asked for, in order, with whatever it asked to go between them.
     *
     * A topic showing code behind rarely wants one region: it wants the imports, then how the
     * component was reached, then the lines that do the work — and the hand written blocks it
     * replaces put an elision between those, because they are excerpts from different parts of a
     * file rather than one run of statements. Rather than a separate option for that, the delimiter
     * between two names says which it is:
     *
     *     channel="bindingImports...bindingInit,bindingCode"
     *
     * where "," joins two regions directly and "..." puts the platform's own comment ellipsis
     * between them. A region this platform writes nothing to drops out, and takes its delimiter with
     * it, so a block never opens or ends with a stray mark.
     */
    function composeChannels(json, spec, only) {
        const expanded = CHANNEL_PRESETS[spec.trim()] ?? spec;
        // Split on either delimiter, keeping which one it was.
        const parts = expanded.split(/(\.\.\.|,)/).map(one => one.trim()).filter(one => one !== '');

        let out = '';
        let pending = null;
        for (const part of parts) {
            if (part === ',' || part === '...') {
                pending = part;
                continue;
            }
            const content = emitChannel(json, part, only).trim();
            if (content === '') continue;
            if (out !== '') {
                out += '\n';
                // "the rest was left out", as a comment. Composed blocks are code, so the line
                // comment is right for every one of them; a markup fence never composes.
                if (pending === '...') out += '// ...\n';
            }
            out += content;
            pending = null;
        }
        return out;
    }

    /**
     * The platform key a splayed sidecar uses for the platform being emitted. The renderer spells
     * these out in PlatformKeyFor; they are the platform name with a lower case first letter.
     */
    const platformSidecarKey = () => platform.charAt(0).toLowerCase() + platform.slice(1);

    /**
     * The channels this platform's inclusion markers name, anywhere in the definition.
     *
     * Reads the same sidecars the renderer does, including the per platform form, and applies the
     * same rule: a platform's own entry wins, "default" covers the platforms that have none.
     */
    function markedChannelsFor(node, found = new Set()) {
        if (Array.isArray(node)) {
            for (const item of node) markedChannelsFor(item, found);
            return [...found];
        }
        if (!node || typeof node !== 'object') return [...found];

        for (const [key, value] of Object.entries(node)) {
            if (key.startsWith('$') && value && typeof value === 'object' && !Array.isArray(value)) {
                // The per platform form: this platform's entry, or the default when it has none.
                const key_ = platformSidecarKey();
                const named = Object.keys(value).find(one => one.toLowerCase() === key_.toLowerCase());
                const chosen = value[named ?? Object.keys(value).find(one => one.toLowerCase() === 'default')];
                for (const marker of [].concat(chosen ?? [])) addMarkedChannel(marker, found);
                continue;
            }
            if (key.startsWith('$')) {
                for (const marker of [].concat(value)) addMarkedChannel(marker, found);
                continue;
            }
            markedChannelsFor(value, found);
        }
        return [...found];
    }

    function addMarkedChannel(marker, found) {
        if (typeof marker !== 'string' || !marker.startsWith('+')) return;
        // "+doc:code" — the channel follows the id, and no channel at all means markup.
        const [, channel] = marker.replace(/^\+>?/, '').split(':');
        found.add(channel ?? 'markup');
    }

    /**
     * The snippet this platform's own markers asked for, whatever channel that turned out to be.
     *
     * For a section taught in code on one platform and in markup on another: the definition splays
     * its sidecar by platform, and this reads back whichever one applied. Returns the channel too,
     * because the fence has to be labelled with the language of what came out.
     */
    function emitMarkedChannel(json, only) {
        // Which channel this platform's markers asked for has to be known before emitting, not
        // after: a definition wanted as code is built rather than declared, and that is decided
        // going in. The renderer resolves the splay for the emission itself; this reads the same
        // sidecars to pick the channel and, from it, the language the block is labelled with.
        const channels = markedChannelsFor(JSON.parse(json));
        if (channels.length === 0) {
            throw new Error('channel="auto" needs the definition to mark what it wants, and this ' +
                            `one marked nothing for ${platform}`);
        }
        if (channels.length > 1) {
            throw new Error('channel="auto" takes one marked channel, and this definition marked ' +
                            `${channels.join(', ')} for ${platform}`);
        }
        return { channel: channels[0], content: emitChannel(json, channels[0], only) };
    }

    /**
     * The definitions in a snippet body, which is usually one and occasionally several.
     *
     * A few topics show two components side by side because the point is the comparison — chart
     * performance sets an ordinal axis on a FinancialChart and on a DataChart in the same breath,
     * and neither is a child of the other. Written as a JSON array, emitted in order, one blank line
     * between them, which is what the hand written block did.
     */
    function definitionsOf(json) {
        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch {
            return [json];   // let the emitter report it, with the message it would have given anyway
        }
        return Array.isArray(parsed) ? parsed.map(one => JSON.stringify(one)) : [json];
    }

    function marksPartOfItself(json) {
        try {
            const parsed = JSON.parse(json);
            const root = parsed && parsed.descriptions && parsed.descriptions.content
                ? parsed.descriptions.content
                : parsed;
            return hasInclusionMarker(root);
        } catch {
            // Not this function's error to report; emitting it says the same thing with the text.
            return false;
        }
    }

    /**
     * The code that has to run beside this markup, when the markup could not say everything.
     *
     * Some properties cannot be written as an attribute on some platforms — a data source or a
     * tooltip template on Web Components is assigned in script — and the emitter is the thing that
     * knows which, because it is what decided. So a topic does not have to declare that a code block
     * is needed: if anything was left out of the markup, it appears here, and if nothing was,
     * nothing appears. Angular binds its data source in the template and gets no block; Web
     * Components gets two lines.
     *
     * What that block shows is the assignments alone, which is what 149 of the 192 code blocks in
     * the hand written topics show. The 36 that also show how the reference was obtained, and the 27
     * that declare a field, are the introductory pages; `code="allCode"` gets that fuller form, and
     * `code="none"` turns the whole thing off for a topic that would rather write its own.
     */
    function companionCode(json, attrs) {
        const mode = attrs.code || 'auto';
        if (mode === 'none') return '';

        // The assignments decide whether anything is shown at all, even when the fuller form is
        // asked for: field declarations and element lookups on their own teach nothing.
        const bindings = emitChannel(json, 'bindingCode');
        if (bindings.trim() === '') return '';

        const body = mode === 'auto' ? bindings : emitChannel(json, mode);
        return body.trim();
    }

    /**
     * What a fence emits: the channel it turned out to be, its content, and the code that has to run
     * beside it. Empty content means this platform writes nothing here, which is not an error — a
     * fence for a channel a platform does not use drops out the way a foreign code block does.
     */
    function emitFence(json, attrs) {
        const channel = attrs.channel || 'markup';

        if (channel === 'auto') {
            // The definition's own markers say which channel this platform wants, because the topic
            // does not teach the same thing everywhere: a value the reader sets in code on one
            // platform is written in markup on another, and the two are not interchangeable. So the
            // fence names no channel and takes whichever one the marker chose.
            const chosen = emitMarkedChannel(json, attrs.item);
            return { channel: chosen.channel, content: chosen.content, companion: '' };
        }

        if (channel === 'markup') {
            const content = definitionsOf(json)
                // A definition that marks part of itself is emitted twice — once whole, and once as
                // the part asked for. The part is the block the topic wants.
                .map(one => marksPartOfItself(one)
                    ? emitChannel(one, 'markup')
                    : api.emitSingleSnippet(one, platform, {
                        examplesRoot, styleDefaults, defaultSnippetId: 'main',
                    }))
                .filter(one => one !== null && one.trim() !== '')
                // Trimmed before joining: several definitions in one block are separated by one
                // blank line, not by however many the last of them happened to end with.
                .map(one => one.trim())
                .join('\n\n');
            return {
                channel,
                content,
                companion: content.trim() === '' ? '' : companionCode(json, attrs),
            };
        }

        // Several regions can be asked for at once, and the delimiter between their names says what
        // goes between them in the block. See composeChannels.
        return { channel, content: composeChannels(json, channel, attrs.item), companion: '' };
    }

    return { emitFence, emitChannel, composeChannels, companionCode, definitionsOf };
}

/**
 * Whether a name is a library item this platform has, memoised.
 *
 * Asked once per name: the answer needs the library loaded and the item's content resolved for the
 * platform, and a page can name the same supporting item on every fence in a section.
 */
export function libraryItemLookup(api, platform, examplesRoot) {
    const answered = new Map();
    return (name) => {
        if (!answered.has(name)) {
            let known = false;
            try {
                known = api.itemsMissingForPlatform(platform, { examplesRoot, items: [name] })
                           .length === 0;
            } catch {
                // An emitter that cannot answer is not evidence the item is missing; the emission
                // itself will say so, with a message about the thing that actually failed.
                known = false;
            }
            answered.set(name, known);
        }
        return answered.get(name);
    };
}

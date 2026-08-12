/**
 * Checking a json-snippet against the schema the descriptions themselves declare.
 *
 * The schema is emitted from the description metadata, so it is not a second statement of what a
 * component takes — it is the same statement the emitter works from. A property the schema rejects
 * is one the emitter would silently drop, which is how four properties the column chooser does not
 * have came to be published: the block looked right and the emitter wrote nothing.
 *
 * Shared by the generator, which checks as it builds, and by the standalone check, which is what
 * runs in CI. One implementation, so the two cannot disagree about what is valid.
 */

import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import draft06 from 'ajv/dist/refs/json-schema-draft-06.json' with { type: 'json' };
import { fencesOf, mdxFilesUnder } from './snippet-toolchain.mjs';

/**
 * Every definition a page states, one entry per definition — an array body is several, and each is
 * checked on its own. A `ref=` fence carries none: the definition it names is checked where it is
 * written.
 */
export function snippetsIn(files, { relativeTo = null } = {}) {
    const snippets = [];
    for (const file of files) {
        const text = fs.readFileSync(file, 'utf8');
        if (!text.includes('```json-snippet')) continue;
        const where = relativeTo ? path.relative(relativeTo, file) : file;
        for (const fence of fencesOf(text)) {
            if (fence.attrs.ref) continue;
            let bodies = [fence.body];
            try {
                const parsed = JSON.parse(fence.body);
                if (Array.isArray(parsed)) bodies = parsed.map(one => JSON.stringify(one));
            } catch { /* reported by the check, which can name the file */ }
            for (const body of bodies) {
                snippets.push({ file, where: `${where}:${fence.line}`, attrs: fence.attrs, body });
            }
        }
    }
    return snippets;
}

/**
 * A validator over the emitted schema.
 *
 * Compiled per component type rather than over the union of all of them: the union reports every
 * property as unknown once per type that lacks it, which buries the one misspelling that is wrong
 * under a thousand that are not.
 */
export function schemaValidator(api, examplesRoot, { onProgress = () => {} } = {}) {
    onProgress('emitting the schema from the description metadata');
    const schema = JSON.parse(api.emitJsonSchema(examplesRoot));

    // The schema references types it never defines — AxisLabelSettings among them — which ajv treats
    // as fatal. Stubbing them permissively keeps every other property checkable; they are reported
    // because each one is a property nothing is checking.
    const defined = new Set(Object.keys(schema.definitions));
    const referenced = new Set();
    (function walk(node) {
        if (node === null || typeof node !== 'object') return;
        if (Array.isArray(node)) { node.forEach(walk); return; }
        for (const [key, value] of Object.entries(node)) {
            if (key === '$ref' && typeof value === 'string' && value.startsWith('#/definitions/')) {
                referenced.add(value.slice('#/definitions/'.length));
            }
            walk(value);
        }
    })(schema);
    const dangling = [...referenced].filter(name => !defined.has(name));
    for (const name of dangling) schema.definitions[name] = {};

    // inlineRefs: false is the difference between two seconds and a minute and a half. Every
    // property of every description declares a "$key" sidecar referencing one shared marker
    // definition — some 48,000 references — and ajv's default is to inline a referenced schema at
    // each site rather than compile it once and call it.
    const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false, inlineRefs: false });
    ajv.addMetaSchema(draft06);
    ajv.addSchema(schema, 'snippets');

    const compiled = new Map();
    const validatorFor = (type) => {
        if (!compiled.has(type)) {
            compiled.set(type, schema.definitions[type]
                ? ajv.compile({ $ref: `snippets#/definitions/${type}` })
                : null);
        }
        return compiled.get(type);
    };

    return { schema, dangling, validatorFor, knownTypes: [...defined] };
}

/**
 * What is wrong with one snippet, as a list of complaints. Empty means valid.
 *
 * Every description in a definition is checked, not only `descriptions.content`: a topic pairing a
 * toolbar with its grid states the toolbar under another key, and checking content alone let a
 * column chooser carry four properties its description does not have.
 */
export function problemsWith(snippet, validator) {
    const problems = [];
    const add = (message, at = null) => problems.push({ where: snippet.where, at, message });

    let parsed;
    try {
        parsed = JSON.parse(snippet.body);
    } catch (e) {
        add(`not valid JSON — ${e.message}`);
        return problems;
    }
    if (!parsed || typeof parsed !== 'object') {
        add('a snippet has to be an object describing one component');
        return problems;
    }

    const slots = parsed.descriptions && typeof parsed.descriptions === 'object'
        ? Object.entries(parsed.descriptions).map(([slot, value]) => ({ slot, value }))
        : [{ slot: null, value: parsed }];

    for (const { slot, value } of slots) {
        const label = slot ? `descriptions.${slot}` : null;
        if (!value || typeof value !== 'object') {
            add('a description has to be an object', label);
            continue;
        }
        if (typeof value.type !== 'string') {
            add('no "type", so there is nothing to check it against', label);
            continue;
        }
        const validate = validator.validatorFor(value.type);
        if (validate === null) {
            const suggestion = closestName(value.type, validator.knownTypes);
            add(`unknown component type "${value.type}"` +
                (suggestion ? ` — did you mean "${suggestion}"?` : ''), label);
            continue;
        }
        if (validate(value)) continue;
        for (const message of describeErrors(validate.errors ?? [], value, validator)) {
            add(message, label);
        }
    }
    return problems;
}

/**
 * ajv's errors, said the way someone editing a page needs to hear them.
 *
 * ajv reports the shape of the failure; what a page author needs is which property, in which
 * element, and what would have been accepted. Unknown properties get the nearest name the
 * description does have, and a rejected value gets the values the schema allows — an enum
 * misspelling is by far the most common mistake, and "must be equal to one of the allowed values" on
 * its own does not say which those are.
 */
function describeErrors(errors, value, validator) {
    const messages = [];
    const seen = new Set();

    // The union branches of a oneOf produce an error per branch; the one that matters names a real
    // property, so the deepest instancePath wins and the branch bookkeeping is dropped.
    const deepest = new Map();
    for (const err of errors) {
        if (err.keyword === 'if' || err.keyword === 'anyOf' || err.keyword === 'oneOf') continue;
        const key = `${err.instancePath}|${err.keyword}|${err.params?.additionalProperty ?? ''}`;
        if (!deepest.has(key)) deepest.set(key, err);
    }

    // A numeric property accepts the special doubles as strings — "Infinity", "@dbl:NAN" — so a
    // value of the wrong type fails both the number branch and that enum. The type error says what
    // is wrong; the enum's list of four spellings of infinity says nothing anyone needs.
    const typeErrorPaths = new Set([...deepest.values()]
        .filter(err => err.keyword === 'type').map(err => err.instancePath));
    for (const [key, err] of [...deepest.entries()]) {
        if (err.keyword === 'enum' && typeErrorPaths.has(err.instancePath) &&
            (err.params?.allowedValues ?? []).some(v => String(v).includes('Infinity'))) {
            deepest.delete(key);
        }
    }

    for (const err of deepest.values()) {
        const at = err.instancePath ? err.instancePath.replace(/^\//, '').replace(/\//g, '.') : '';
        const shown = at ? `${at}: ` : '';
        let message;
        if (err.params?.additionalProperty) {
            const unknown = err.params.additionalProperty;
            const known = propertyNamesAt(err, value, validator);
            const suggestion = closestName(unknown, known);
            message = `${shown}unknown property "${unknown}"` +
                (suggestion ? ` — did you mean "${suggestion}"?` : '');
        } else if (err.keyword === 'enum' && Array.isArray(err.params?.allowedValues)) {
            const actual = valueAt(value, err.instancePath);
            const allowed = err.params.allowedValues;
            const suggestion = typeof actual === 'string' ? closestName(actual, allowed) : null;
            message = `${shown}${JSON.stringify(actual)} is not one of the accepted values` +
                (suggestion ? ` — did you mean ${JSON.stringify(suggestion)}?` : '') +
                `\n      accepted: ${summarise(allowed)}`;
        } else if (err.keyword === 'type') {
            const actual = valueAt(value, err.instancePath);
            message = `${shown}${JSON.stringify(actual)} ${err.message}`;
        } else {
            message = `${shown}${err.message}`;
        }
        if (!seen.has(message)) {
            seen.add(message);
            messages.push(message);
        }
    }
    return messages;
}

/** The properties the description at this path does have, for a did-you-mean. */
function propertyNamesAt(err, value, validator) {
    const owner = valueAt(value, err.instancePath);
    if (!owner || typeof owner !== 'object' || typeof owner.type !== 'string') return [];
    const definition = validator.schema.definitions[owner.type];
    if (!definition) return [];
    return Object.keys(collectProperties(definition, validator.schema, new Set()));
}

/** A definition's properties, following the references it composes itself from. */
function collectProperties(definition, schema, seen) {
    if (!definition || typeof definition !== 'object') return {};
    let properties = { ...(definition.properties ?? {}) };
    for (const branch of [definition.allOf, definition.anyOf, definition.oneOf].flat()) {
        if (!branch) continue;
        if (branch.$ref && branch.$ref.startsWith('#/definitions/')) {
            const name = branch.$ref.slice('#/definitions/'.length);
            if (seen.has(name)) continue;
            seen.add(name);
            properties = { ...properties, ...collectProperties(schema.definitions[name], schema, seen) };
        } else {
            properties = { ...properties, ...collectProperties(branch, schema, seen) };
        }
    }
    return properties;
}

function valueAt(root, instancePath) {
    if (!instancePath) return root;
    let current = root;
    for (const step of instancePath.replace(/^\//, '').split('/')) {
        if (current === null || typeof current !== 'object') return undefined;
        current = current[step.replace(/~1/g, '/').replace(/~0/g, '~')];
    }
    return current;
}

function summarise(values, limit = 12) {
    const shown = values.slice(0, limit).map(v => JSON.stringify(v)).join(', ');
    return values.length > limit ? `${shown}, … (${values.length} in all)` : shown;
}

/**
 * The nearest of a set of names, or null when nothing is near enough.
 *
 * Case-insensitive first, because "left" for "Left" is the mistake a page makes most often, then by
 * edit distance with a threshold that scales with length — a suggestion that is not close is worse
 * than none, since it sends the reader to the wrong property.
 */
export function closestName(name, candidates) {
    if (!name || !candidates || candidates.length === 0) return null;
    const lower = name.toLowerCase();
    const sameLetters = candidates.find(c => String(c).toLowerCase() === lower);
    if (sameLetters !== undefined && sameLetters !== name) return sameLetters;

    let best = null;
    let bestDistance = Infinity;
    for (const candidate of candidates) {
        const distance = editDistance(lower, String(candidate).toLowerCase());
        if (distance < bestDistance) {
            bestDistance = distance;
            best = candidate;
        }
    }
    const allowed = Math.max(2, Math.floor(name.length / 4));
    return bestDistance <= allowed ? best : null;
}

function editDistance(a, b) {
    const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let left = previous[0];
        previous[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const up = previous[j];
            previous[j] = Math.min(
                previous[j] + 1,
                previous[j - 1] + 1,
                left + (a[i - 1] === b[j - 1] ? 0 : 1));
            left = up;
        }
    }
    return previous[b.length];
}

/** Every snippet under a content directory, checked. Returns the problems, in page order. */
export function checkSnippetsUnder(sourceDir, api, examplesRoot, opts = {}) {
    const snippets = snippetsIn(mdxFilesUnder(sourceDir), { relativeTo: opts.relativeTo ?? null });
    if (snippets.length === 0) return { snippets, problems: [], dangling: [] };
    const validator = schemaValidator(api, examplesRoot, opts);
    const problems = [];
    for (const snippet of snippets) problems.push(...problemsWith(snippet, validator));
    return { snippets, problems, dangling: validator.dangling };
}

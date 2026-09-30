/**
 * extract-xaml-snippet.mjs
 *
 * Pulls a documentation-ready XAML snippet out of a winui-samples `Sample.xaml`.
 *
 * The sample files are runnable apps, not snippets: the control of interest is
 * buried inside layout `Grid`/`StackPanel` scaffolding and sits next to an
 * `XamPropertyEditorPanel` that drives the sample's interactive controls. None
 * of that belongs in a doc, so this extracts just the primary `Xam*` element
 * (with its full subtree), de-indents it, and re-declares the xmlns prefixes it
 * actually uses so the result is copy-pasteable.
 */

/** Harness elements that are part of the sample app, never part of the docs. */
const HARNESS = new Set(['XamPropertyEditorPanel', 'PropertyEditorPropertyDescription']);

/** Reads `xmlns:prefix="value"` declarations from the sample root. */
export function readXmlnsMap(xaml) {
    const map = new Map();
    for (const m of xaml.matchAll(/xmlns:(\w+)="([^"]+)"/g)) map.set(m[1], m[2]);
    return map;
}

/**
 * Finds the primary control element: the first `Xam*` element that is not
 * harness. Returns `{ prefix, localName, start, end }` byte offsets covering
 * the whole element including its closing tag, or null.
 */
export function findPrimaryElement(xaml, preferredLocalName = null) {
    const openRe = /<(\w+):(\w+)(\s|\/|>)/g;
    let m;
    while ((m = openRe.exec(xaml))) {
        const [, prefix, localName] = m;
        if (HARNESS.has(localName)) continue;
        if (preferredLocalName ? localName !== preferredLocalName : !localName.startsWith('Xam')) continue;

        const start = m.index;
        const tagEnd = xaml.indexOf('>', start);
        if (tagEnd === -1) return null;

        // Self-closing element.
        if (xaml[tagEnd - 1] === '/') return { prefix, localName, start, end: tagEnd + 1 };

        // Walk forward counting same-name open/close tags. Property-element
        // children (`<pfx:Name.Prop>`) share the prefix but are not the element,
        // so match on the exact `<pfx:Name` boundary.
        const openTag = new RegExp(`<${prefix}:${localName}(?=[\\s/>])`, 'g');
        const closeTag = new RegExp(`</${prefix}:${localName}>`, 'g');
        let depth = 0;
        let pos = start;
        while (pos < xaml.length) {
            openTag.lastIndex = pos;
            closeTag.lastIndex = pos;
            const o = openTag.exec(xaml);
            const c = closeTag.exec(xaml);
            const op = o ? o.index : Infinity;
            const cp = c ? c.index : Infinity;
            if (op === Infinity && cp === Infinity) break;
            if (op < cp) {
                depth++;
                pos = op + 1;
            } else {
                depth--;
                if (depth === 0) return { prefix, localName, start, end: cp + c[0].length };
                pos = cp + 1;
            }
        }
        return null;
    }
    return null;
}

/**
 * Splits a tag's inner text into its element name and attribute strings,
 * respecting quoted values (so `Binding {ElementName=x}` stays intact).
 */
function splitTag(inner) {
    const nameMatch = inner.match(/^\/?\s*([\w:.]+)/);
    const name = nameMatch ? nameMatch[1] : inner.trim();
    const rest = inner.slice(nameMatch ? nameMatch[0].length : 0);
    const attrs = [];
    const re = /([\w:.]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let m;
    while ((m = re.exec(rest))) attrs.push(`${m[1]}=${m[2]}`);
    return { name, attrs };
}

/**
 * Re-indents a XAML fragment: one attribute per line, children nested by depth,
 * childless elements collapsed to self-closing.
 *
 * The sample files are machine-generated with irregular indentation (attributes
 * at one level, children at another), which reads badly in a doc. The fragments
 * here carry no meaningful text content — everything is attributes — so a
 * token-level reformat is safe without a full XML parse.
 */
export function formatXaml(fragment, indentUnit = '    ') {
    const tokens = [];
    const re = /<[^>]+>/g;
    let m;
    while ((m = re.exec(fragment))) {
        const raw = m[0];
        const inner = raw.slice(1, -1);
        if (inner.startsWith('/')) tokens.push({ kind: 'close', ...splitTag(inner) });
        else if (inner.endsWith('/')) tokens.push({ kind: 'self', ...splitTag(inner.slice(0, -1)) });
        else tokens.push({ kind: 'open', ...splitTag(inner) });
    }

    // Collapse `<X …></X>` to `<X … />`.
    const merged = [];
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        const next = tokens[i + 1];
        if (t.kind === 'open' && next && next.kind === 'close' && next.name === t.name) {
            merged.push({ ...t, kind: 'self' });
            i++;
        } else {
            merged.push(t);
        }
    }

    const out = [];
    let depth = 0;
    for (const t of merged) {
        if (t.kind === 'close') depth = Math.max(0, depth - 1);
        const pad = indentUnit.repeat(depth);
        if (t.kind === 'close') {
            out.push(`${pad}</${t.name}>`);
            continue;
        }
        // `>` / `/>` hangs off the last attribute line, per usual XAML style.
        const tail = t.kind === 'self' ? ' />' : '>';
        if (!t.attrs.length) {
            out.push(`${pad}<${t.name}${tail}`);
        } else if (t.attrs.length === 1) {
            out.push(`${pad}<${t.name} ${t.attrs[0]}${tail}`);
        } else {
            out.push(`${pad}<${t.name}`);
            t.attrs.forEach((a, i) => {
                const last = i === t.attrs.length - 1;
                out.push(`${pad}${indentUnit}${a}${last ? tail : ''}`);
            });
        }
        if (t.kind === 'open') depth++;
    }
    return out.join('\n');
}

/** Removes the common leading indentation from a block. */
function deindent(text) {
    const lines = text.split('\n');
    const indents = lines
        .filter(l => l.trim())
        .map(l => l.match(/^\s*/)[0].length);
    const min = indents.length ? Math.min(...indents) : 0;
    return lines.map(l => (l.trim() ? l.slice(min) : '')).join('\n').trim();
}

/**
 * Extracts a doc-ready snippet.
 *
 * @param {string} xaml - contents of Sample.xaml
 * @param {object} [opts]
 * @param {string|null} [opts.localName] - target element name; defaults to the first `Xam*`
 * @param {boolean} [opts.includeXmlns=false] - re-declare used prefixes on the snippet root.
 *   Off by default: the declaration syntax is the one part of a XAML snippet that is
 *   *not* portable across dialects (`using:` for WinUI/UWP and Uno vs
 *   `clr-namespace:…;assembly=…` for WPF). Snippets therefore carry a bare prefix and
 *   assume it is declared further up the file, which is how a real page is written.
 * @returns {{ snippet: string, localName: string, prefixes: string[] } | null}
 */
export function extractXamlSnippet(xaml, opts = {}) {
    const { localName = null, includeXmlns = false } = opts;
    const found = findPrimaryElement(xaml, localName);
    if (!found) return null;

    let body = deindent(xaml.slice(found.start, found.end));

    // Drop any harness element that ended up nested inside the control.
    for (const h of HARNESS) {
        body = body.replace(new RegExp(`\\s*<\\w+:${h}[\\s\\S]*?</\\w+:${h}>`, 'g'), '');
    }

    const prefixes = [...new Set([...body.matchAll(/<\/?(\w+):/g)].map(m => m[1]))];

    if (includeXmlns) {
        // Declare the prefixes on the snippet root so it is copy-pasteable.
        const xmlnsMap = readXmlnsMap(xaml);
        const decls = prefixes
            .filter(p => xmlnsMap.has(p))
            .map(p => ` xmlns:${p}="${xmlnsMap.get(p)}"`)
            .join('');
        if (decls) {
            const tagEnd = body.search(/\s|\/?>/);
            body = body.slice(0, tagEnd) + decls + body.slice(tagEnd);
        }
    }

    return { snippet: formatXaml(body), localName: found.localName, prefixes };
}

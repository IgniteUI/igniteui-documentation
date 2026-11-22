/**
 * Resolves old API links through the merged jQuery link index (src/data/api-link-index/jquery),
 * following the mapping rules of the API link contract:
 *
 * Client API, `…/<page>#<kind>:<member>`: the page loses its namespace prefix (`ui.`, `ig.`,
 * `ig.excel.`, `ig.scheduler.`, `ig.spreadsheet.`) and a `_hg`/`_tg` suffix and is looked up
 * case-insensitively; the member is looked up with its kind (`options:autoCommit`), exactly, then
 * case-insensitively; a nested option written without its path maps to its single matching path.
 * Section links (`#options`) keep the page only. Anything else has no target and is reported.
 *
 * .NET API, `<Assembly>~<Namespace>.<Type>[~<Member>].html`: the assembly is the package, the type
 * the page (a backtick arity picks the generic type), the member the anchor; `_members` pages map
 * to the type page, namespace pages have no equivalent in the link component.
 *
 * Nothing is built by string replacement: every link the step writes names a registry symbol (and
 * member) that the index contains, with its package.
 */
import fs from 'node:fs';

/** ApiLink `pkg` keys of the jQuery platform (src/lib/api-platform-config.ts). */
export const PACKAGE_KEYS = {
    'ignite-ui': 'core',
    'Infragistics.Web.Mvc': 'mvc',
    'Infragistics.Web.AspNetCore': 'aspnetcore',
    'Infragistics.Web.Documents.Core': 'documents-core',
    'Infragistics.Web.Documents.Excel': 'documents-excel',
    'Infragistics.Web.Documents.IO': 'documents-io',
    'Infragistics.Web.Documents.Reports': 'documents-reports',
    'Infragistics.Web.Documents.Word': 'documents-word',
};

const KINDS = { option: 'options', options: 'options', event: 'events', events: 'events', method: 'methods', methods: 'methods', theming: 'theming', property: 'properties', properties: 'properties' };
const SECTIONS = new Set(['options', 'events', 'methods', 'theming', 'properties']);

export function loadIndex(file) {
    const index = JSON.parse(fs.readFileSync(file, 'utf8'));
    const jsByLower = new Map();
    const netByPackage = new Map();
    for (const [name, value] of Object.entries(index.symbols)) {
        for (const symbol of [].concat(value)) {
            if (symbol.p === 'ignite-ui') {
                jsByLower.set(name.toLowerCase(), { name, symbol });
            } else {
                const base = name.replace(/<.*$/, '');
                const arity = /<(.*)>$/.exec(name)?.[1].split(',').length ?? 0;
                const key = `${base.toLowerCase()}\`${arity}`;
                if (!netByPackage.has(symbol.p)) netByPackage.set(symbol.p, new Map());
                const byName = netByPackage.get(symbol.p);
                if (!byName.has(key)) byName.set(key, []);
                byName.get(key).push({ name, symbol });
            }
        }
    }
    const packagesLower = new Map(index.packages.map(p => [p.toLowerCase(), p]));
    return { index, jsByLower, netByPackage, packagesLower };
}

function findMember(members, wanted) {
    if (Object.hasOwn(members, wanted)) return wanted;
    const lower = wanted.toLowerCase();
    return Object.keys(members).find(k => k.toLowerCase() === lower) ?? null;
}

/**
 * Client API link. `page` is the path after the API root, `fragment` the part after `#`.
 * Returns { status, type, member?, note? }.
 */
export function resolveClient(api, page, fragment) {
    let name = decodeURIComponent(page).replace(/^\/+/, '').replace(/\/+$/, '').replace(/\.html?$/i, '');
    if (!name) return { status: 'root' };
    name = name.replace(/^(ui|ig\.excel|ig\.scheduler|ig\.spreadsheet|ig)\./i, '').replace(/_(hg|tg)$/i, '');
    const hit = api.jsByLower.get(name.toLowerCase());
    if (!hit) return { status: 'no-page', detail: name };
    const result = { type: hit.name, pkg: PACKAGE_KEYS['ignite-ui'] };
    if (!fragment) return { status: 'resolved', ...result };

    const members = hit.symbol.m ?? {};
    const frag = decodeURIComponent(fragment).trim();
    const m = /^([A-Za-z]+)\s*:\s*(.*)$/.exec(frag);
    if (!m) {
        if (SECTIONS.has(frag.toLowerCase())) return { status: 'section', ...result, detail: frag.toLowerCase() };
        // A bare member name: unique across kinds, or not resolvable.
        const matches = Object.keys(members).filter(k => k.split(':').slice(1).join(':').toLowerCase() === frag.toLowerCase());
        if (matches.length === 1) return { status: 'resolved', ...result, member: matches[0], note: 'bare member' };
        return { status: matches.length ? 'ambiguous-member' : 'no-member', ...result, detail: frag };
    }
    const kind = KINDS[m[1].toLowerCase()];
    let path = m[2].trim();
    let malformed = false;
    // Recoverable damage after the name (`dialogTemplate:""`, a trailing `)` or space).
    const clean = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/.exec(path)?.[0];
    if (clean && clean !== path) { path = clean; malformed = true; }
    if (!kind) return { status: 'no-member', ...result, detail: frag };
    if (!path) return { status: 'section', ...result, detail: kind };
    const exact = findMember(members, `${kind}:${path}`);
    if (exact) return { status: 'resolved', ...result, member: exact, note: malformed ? 'malformed fragment repaired' : exact === `${kind}:${path}` ? (m[1] === kind ? null : 'kind spelling') : 'case' };
    if (!path.includes('.')) {
        const nested = Object.keys(members).filter(k => k.startsWith(`${kind}:`) && k.toLowerCase().endsWith(`.${path.toLowerCase()}`));
        if (nested.length === 1) return { status: 'resolved', ...result, member: nested[0], note: 'nested option path' };
        if (nested.length > 1) return { status: 'ambiguous-member', ...result, detail: `${kind}:${path} (${nested.length} paths)` };
    }
    // The same name under exactly one other kind.
    const leaf = path.toLowerCase();
    const other = Object.keys(members).filter(k => k.split(':').slice(1).join(':').toLowerCase() === leaf);
    if (other.length === 1) return { status: 'resolved', ...result, member: other[0], note: 'kind corrected' };
    return { status: 'no-member', ...result, detail: `${kind}:${path}` };
}

/** Normalizes an old assembly name (`Infragistics4.Web.Mvc.v15.2`) to a package id. */
function packageOf(api, assembly) {
    const cleaned = assembly.replace(/\.v\d+\.\d+$/i, '').replace(/^Infragistics\d+/i, 'Infragistics');
    return api.packagesLower.get(cleaned.toLowerCase()) ?? null;
}

/**
 * .NET API link, old help-file form `<Assembly>~<Namespace>.<Type>[~<Member>].html`.
 */
export function resolveDotNet(api, href) {
    const file = decodeURIComponent(href.split('#')[0]).replace(/^.*\//, '').replace(/\.html?$/i, '');
    const parts = file.split('~');
    if (parts.length < 2) return { status: 'not-api' };
    const pkg = packageOf(api, parts[0]);
    if (!pkg) return { status: 'no-package', detail: parts[0] };
    let typePart = parts[1];
    if (/_namespace$/i.test(typePart)) return { status: 'namespace', detail: typePart };
    typePart = typePart.replace(/_(members|properties|methods|events|fields|ctor|overloads)$/i, '');
    const typeMatch = /^(.*?)(?:`(\d+))?$/.exec(typePart);
    const shortName = typeMatch[1].split('.').pop();
    const arity = Number(typeMatch[2] ?? 0);
    const candidates = api.netByPackage.get(pkg)?.get(`${shortName.toLowerCase()}\`${arity}`) ?? [];
    if (candidates.length === 0) return { status: 'no-type', detail: `${pkg} ${shortName}${arity ? `\`${arity}` : ''}` };
    const pkgKey = PACKAGE_KEYS[pkg];
    if (new Set(candidates.map(c => c.symbol.u)).size > 1) return { status: 'ambiguous-type', detail: `${pkg} ${shortName}` };
    const { name, symbol } = candidates[0];
    const result = { type: name, pkg: pkgKey };
    if (parts.length < 3 || !parts[2]) return { status: 'resolved', ...result };
    const memberName = parts[2].replace(/`\d+$/, '').replace(/_overloads?(_\d+)?$/i, '').replace(/\(.*$/, '');
    if (/^(ctor|#ctor)$/i.test(memberName)) {
        const ctor = findMember(symbol.m ?? {}, shortName);
        return ctor ? { status: 'resolved', ...result, member: ctor } : { status: 'resolved', ...result, note: 'constructor to type page' };
    }
    let member = findMember(symbol.m ?? {}, memberName);
    let note = null;
    if (!member) {
        // A generic or overloaded member written without its type parameters or signature
        // (`LoadTransactions` for `LoadTransactions<T>`): its bare alias, when there is one.
        const bare = Object.keys(symbol.m ?? {}).filter(k => !k.includes('(') && k.replace(/<.*>$/, '').toLowerCase() === memberName.toLowerCase());
        if (bare.length === 1) { member = bare[0]; note = 'generic member'; }
    }
    if (!member) return { status: 'no-member', ...result, detail: `${name}.${memberName}` };
    return { status: 'resolved', ...result, member, note };
}

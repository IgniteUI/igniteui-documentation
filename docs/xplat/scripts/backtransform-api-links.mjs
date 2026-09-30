#!/usr/bin/env node
/**
 * Replace authored ApiLink components in strict-xplat source with canonical backticked terms.
 *
 * The generated document still contains ApiLink components. Source uses canonical terms so the
 * API-term resolver can choose each target platform's spelling and link at generation time.
 *
 * Usage:
 *   node scripts/backtransform-api-links.mjs --dry-run [--lang=en] [--file=components/foo.mdx]
 *   node scripts/backtransform-api-links.mjs --write   [--lang=en] [--file=components/foo.mdx]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiMap, resolveApiTerms } from './lib/api-terms.mjs';
import { canonicalMemberFor, canonicalTypeFor } from './lib/api-map-names.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(ROOT, '..', '..');
const WRITE = process.argv.includes('--write');
const DRY_RUN = process.argv.includes('--dry-run') || !WRITE;
const LANG = (process.argv.find(a => a.startsWith('--lang=')) ?? '--lang=en').slice(7);
const ONE_FILE = process.argv.find(a => a.startsWith('--file='))?.slice(7);
const CONTENT = path.join(ROOT, 'src', 'content', LANG);
const COMPONENTS = path.join(CONTENT, 'components');
const PLATFORMS = ['Angular', 'React', 'WebComponents', 'Blazor', 'WinUI', 'Uno'];
// A raw attribute is the explicit authoring escape hatch for links that cannot be represented by a
// canonical backticked term. Preserve those tags and their import.
const TAG_RE = /<ApiLink\b(?![^>]*\braw\b)[^>]*?\/>/g;
const ONE_TAG_RE = /<ApiLink\b[^>]*?\/>/;
const map = apiMap(REPO_ROOT);

function filesUnder(dir) {
    const found = [];
    (function walk(current) {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.mdx')) found.push(full);
        }
    })(dir);
    return found.sort();
}

function validationPlatforms(file) {
    const name = path.basename(file, '.mdx');
    if (name === 'general-changelog-dv-react') return ['React'];
    if (name === 'general-changelog-dv-wc') return ['WebComponents'];
    if (name === 'general-changelog-dv-blazor') return ['Blazor'];
    if (name === 'general-changelog-dv') return ['Angular'];
    return PLATFORMS;
}

function attr(tag, name) {
    return new RegExp(`\\b${name}="([^"]+)"`).exec(tag)?.[1] ?? null;
}

function typeOverridesFor(tags) {
    const overrides = new Map();
    for (const tag of tags) {
        const writtenType = attr(tag, 'type');
        const writtenMember = attr(tag, 'member');
        if (!writtenType || !writtenMember || overrides.has(writtenType)) continue;
        const exact = canonicalTypeFor(map, writtenType).canonical;
        if (exact && canonicalMemberFor(map, writtenMember, exact, true).canonical) continue;
        const component = canonicalTypeFor(map, `Xam${writtenType}`).canonical;
        if (component && canonicalMemberFor(map, writtenMember, component, true).canonical) {
            overrides.set(writtenType, component);
        }
    }
    return overrides;
}

function targetFor(tag, where, typeOverrides) {
    const writtenType = attr(tag, 'type');
    if (!writtenType) throw new Error(`${where}: ApiLink has no static type: ${tag}`);
    const type = typeOverrides.get(writtenType) ?? canonicalTypeFor(map, writtenType).canonical;
    // Keep an unmapped API name as an ordinary canonical candidate. It renders as code today and
    // will begin linking automatically when the API map gains the symbol.
    if (!type) return { type: null, member: null, unresolved: attr(tag, 'label') ?? writtenType };

    const writtenMember = attr(tag, 'member');
    if (!writtenMember) return { type, member: null };
    const member = canonicalMemberFor(map, writtenMember, type, true).canonical
        ?? canonicalMemberFor(map, writtenMember).canonical;
    if (!member) return { type: null, member: null, unresolved: attr(tag, 'label') ?? writtenMember };
    return { type, member };
}

function canonicalGenerated(tag, wanted) {
    const writtenType = attr(tag, 'type');
    const writtenMember = attr(tag, 'member');
    let type = writtenType ? canonicalTypeFor(map, writtenType).canonical : null;
    if (writtenType && type !== wanted.type) {
        const component = canonicalTypeFor(map, `Xam${writtenType}`).canonical;
        if (component === wanted.type) type = component;
    }
    const member = writtenMember && type
        ? (canonicalMemberFor(map, writtenMember, type, true).canonical
            ?? canonicalMemberFor(map, writtenMember).canonical)
        : null;
    return { type, member };
}

function sameTarget(got, wanted) {
    return got.type === wanted.type && (got.member ?? null) === (wanted.member ?? null);
}

function markedContent(content, terms) {
    let index = 0;
    return content.replace(TAG_RE, () => {
        const term = terms[index];
        const marked = `<!--api-backtransform:${index}-->\`${term}\`<!--/api-backtransform:${index}-->`;
        index++;
        return marked;
    });
}

function resolvedTargets(content, wanted, platform, where) {
    const resolved = resolveApiTerms(content, platform, { repoRoot: REPO_ROOT, where }).content;
    const targets = [];
    for (let index = 0; index < wanted.length; index++) {
        const re = new RegExp(`<!--api-backtransform:${index}-->([\\s\\S]*?)<!--/api-backtransform:${index}-->`);
        const between = re.exec(resolved)?.[1] ?? '';
        const tag = between.match(ONE_TAG_RE)?.[0];
        targets.push(tag ? canonicalGenerated(tag, wanted[index]) : null);
    }
    return targets;
}

function removeUnusedImport(content) {
    if (/<ApiLink\b/.test(content)) return content;
    return content.replace(
        /^import ApiLink from ['"]igniteui-astro-components\/components\/mdx\/ApiLink\.astro['"];[ \t]*\r?\n/m,
        '',
    );
}

const files = ONE_FILE
    ? [path.resolve(CONTENT, ONE_FILE.replace(/^\/?/, ''))]
    : filesUnder(COMPONENTS);

let changedFiles = 0;
let changedLinks = 0;
const failures = [];

for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    if (!/^platformType:\s*xplat\s*$/m.test(original)) continue;
    const tags = original.match(TAG_RE) ?? [];
    if (tags.length === 0) continue;

    const rel = path.relative(ROOT, file);
    let targets;
    try {
        const typeOverrides = typeOverridesFor(tags);
        targets = tags.map((tag, index) => targetFor(tag, `${rel} ApiLink ${index + 1}`, typeOverrides));
    } catch (error) {
        failures.push(error.message);
        continue;
    }

    // Prefer a short canonical member. Test it in the real page context on every platform; use the
    // explicit canonical Type.Member form wherever that context would change or lose the target.
    const platforms = validationPlatforms(file);
    const terms = targets.map(target => target.unresolved ?? target.member ?? target.type);
    const initial = markedContent(original, terms);
    for (const platform of platforms) {
        const got = resolvedTargets(initial, targets, platform, rel);
        for (let index = 0; index < targets.length; index++) {
            if (!targets[index].unresolved && targets[index].member &&
                (!got[index] || !sameTarget(got[index], targets[index]))) {
                terms[index] = `${targets[index].type}.${targets[index].member}`;
            }
        }
    }

    const candidate = markedContent(original, terms);
    let safe = true;
    for (const platform of platforms) {
        const got = resolvedTargets(candidate, targets, platform, rel);
        for (let index = 0; index < targets.length; index++) {
            if (targets[index].unresolved) continue;
            if (!got[index] || !sameTarget(got[index], targets[index])) {
                failures.push(`${rel} ApiLink ${index + 1}: \`${terms[index]}\` does not round-trip on ${platform}`);
                safe = false;
            }
        }
    }
    if (!safe) continue;

    let index = 0;
    let updated = original.replace(TAG_RE, () => `\`${terms[index++]}\``);
    updated = removeUnusedImport(updated);
    if (updated === original) continue;
    changedFiles++;
    changedLinks += tags.length;
    console.log(`${DRY_RUN ? '[dry]' : '[write]'} ${rel} (${tags.length})`);
    if (WRITE) fs.writeFileSync(file, updated);
}

if (failures.length) {
    console.error(`\n${failures.length} ApiLink backtransform failure(s):`);
    for (const failure of failures) console.error(`  ${failure}`);
}
console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${changedFiles} file(s), ${changedLinks} ApiLink call(s).`);
process.exit(failures.length ? 1 : 0);

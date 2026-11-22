/**
 * The topic map: one row per source file, built before any topic is converted, because links
 * between topics resolve through it even when the target is outside the set being converted.
 *
 * The slug, navigation label and navigation order follow the rules of the tool that built the
 * live help (its table-of-contents generator), so the new site serves every topic where the old
 * one did and the navigation reads the same:
 * - slug: file name without a leading `~` and a numeric `NN_` prefix, `_` and spaces to `-`,
 *   lowercased (a prefix such as `04.` is not numeric to that rule and stays);
 * - label: the first `#` or `##` heading, with a trailing `(…)` clarification removed (except for
 *   igRating topics), every `-` turned into a space and the tokens replaced;
 * - order: siblings sorted by their lowercased folder or file name; a folder is represented by
 *   its `~…` landing page; `images` folders are not navigation.
 * A slug the live site disagrees with is corrected from the live check (see verify-slugs.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';

export const SOURCE_EXTENSIONS = ['.md'];

/** The old tool's slug rule. */
export function ruleSlug(fileName) {
    let name = fileName.replace(/\.(md|link|stub)$/i, '');
    if (name.startsWith('~')) name = name.slice(1);
    const parts = name.split('_');
    // The old tool used `!isNaN(parts[0])`, which accepts digits only for these names.
    if (name.includes('_') && parts[0] !== '' && !Number.isNaN(Number(parts[0]))) {
        parts.shift();
        name = parts.join('_');
    }
    return name.replace(/ /g, '-').replace(/_/g, '-').toLowerCase();
}

/** The old tool's navigation label rule, applied to the raw first-heading text. */
export function navLabel(rawTitle, replaceTokens) {
    let title = rawTitle;
    if (title.includes('_')) {
        const parts = title.split('_');
        if (!Number.isNaN(Number(parts[0])) && parts[0] !== '') {
            parts.shift();
            title = parts.join('_');
        }
    }
    if (!title.startsWith('igRating')) title = title.replace(/\s*\([^)]+\)\s*$/, '');
    title = title.replace(/-DOT-/g, '.').replace(/-/g, ' ').replace(/’/g, "'");
    return replaceTokens(title).trim();
}

/** The old tool's title extraction: the first `#` or `##` heading in the raw text. */
export function firstHeadingRaw(text) {
    const m = /(?:\s|^) {0,3}#{1,2}[\t ]*([^\r\n]+)/.exec(text);
    return m ? m[1].trim() : null;
}

/** Folder or file segment without its numeric prefix, for image paths and display. */
export function cleanSegment(segment) {
    return segment.replace(/^\d+_/, '').replace(/^~/, '').replace(/ /g, '-');
}

function listDir(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/**
 * Builds the map from a `topics` folder.
 * @param {string} topicsDir absolute path of the exported `topics` folder
 * @param {{ replaceTokens: (s: string) => string, readMetadata: (text: string) => object | null,
 *           slugOverrides?: Record<string, string>, excluded?: (relPath: string) => boolean }} options
 */
export function buildTopicMap(topicsDir, options) {
    const { replaceTokens, readMetadata, slugOverrides = {}, excluded = () => false } = options;
    const topics = [];
    const aliases = [];
    const stubs = [];
    const navRoot = { children: [] };

    const readText = (abs) => fs.readFileSync(abs, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n');

    function topicRow(abs, rel, navPath, order) {
        const text = readText(abs);
        const rawHeading = firstHeadingRaw(text);
        const metadata = readMetadata(text);
        const fileName = path.basename(rel);
        const rule = ruleSlug(fileName);
        const slug = slugOverrides[rel] ?? rule;
        return {
            source: rel,
            slug,
            ruleSlug: rule,
            metadataFileName: metadata?.fileName ?? null,
            controlName: metadata?.controlName || null,
            tags: Array.isArray(metadata?.tags) ? metadata.tags : [],
            rawHeading,
            navLabel: rawHeading ? navLabel(rawHeading, replaceTokens) : 'MISSING TITLE',
            navPath,
            navOrder: order,
            landingPage: fileName.startsWith('~'),
            excluded: excluded(rel),
            target: `${slug}.mdx`,
        };
    }

    function walk(absDir, relDir, navParent, navPath, orderPath) {
        const entries = listDir(absDir);
        const items = [];
        for (const entry of entries) {
            const abs = path.join(absDir, entry.name);
            const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
            if (entry.isDirectory()) {
                if (entry.name === 'images') continue;
                const landing = listDir(abs).find(e => e.isFile() && e.name.startsWith('~') && e.name.endsWith('.md'));
                const node = { kind: 'folder', orderBy: entry.name.toLowerCase(), folder: rel, children: [] };
                if (landing) node.topic = `${rel}/${landing.name}`;
                items.push({ node, abs, rel });
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (entry.name === 'home-page.md' && !relDir) {
                    items.push({ node: { kind: 'home', orderBy: '', topic: rel }, abs, rel });
                } else if (ext === '.md' && !entry.name.startsWith('~')) {
                    items.push({ node: { kind: 'topic', orderBy: entry.name.toLowerCase(), topic: rel }, abs, rel });
                } else if (ext === '.link') {
                    const target = fs.readFileSync(abs, 'utf8').replace(/^﻿/, '').trim();
                    const targetRel = path.posix.normalize(`${relDir}/${target}`);
                    items.push({ node: { kind: 'alias', orderBy: entry.name.toLowerCase(), alias: rel, target: targetRel }, abs, rel });
                } else if (ext === '.stub') {
                    items.push({ node: { kind: 'stub', orderBy: entry.name.toLowerCase(), stub: rel }, abs, rel });
                }
            }
        }
        // The old tool sorted siblings by their lowercased folder or file name.
        items.sort((a, b) => (a.node.orderBy < b.node.orderBy ? -1 : a.node.orderBy > b.node.orderBy ? 1 : 0));
        items.forEach(({ node, abs, rel }, index) => {
            const order = [...orderPath, index];
            if (node.kind === 'folder') {
                const segment = cleanSegment(path.basename(rel));
                if (node.topic) {
                    const row = topicRow(path.join(abs, path.basename(node.topic)), node.topic, navPath, order);
                    topics.push(row);
                    node.slug = row.slug;
                    node.label = row.navLabel;
                } else {
                    node.label = segment;
                }
                navParent.children.push(node);
                walk(abs, rel, node, [...navPath, node.label], order);
            } else if (node.kind === 'topic' || node.kind === 'home') {
                const row = topicRow(abs, rel, navPath, order);
                topics.push(row);
                node.slug = row.slug;
                node.label = row.navLabel;
                if (node.kind === 'topic') navParent.children.push(node);
            } else if (node.kind === 'alias') {
                aliases.push({ alias: rel, target: node.target, navPath, navOrder: order });
                navParent.children.push(node);
            } else if (node.kind === 'stub') {
                stubs.push({ stub: rel, navPath, navOrder: order });
                navParent.children.push(node);
            }
        });
    }

    walk(topicsDir, '', navRoot, [], []);

    const bySlug = new Map();
    const bySource = new Map();
    for (const t of topics) {
        bySource.set(t.source, t);
        const key = t.slug.toLowerCase();
        if (bySlug.has(key)) throw new Error(`Duplicate slug "${t.slug}": ${bySlug.get(key).source} and ${t.source}`);
        bySlug.set(key, t);
    }
    // Aliases resolve to their target's row; their navigation entry points at it.
    for (const a of aliases) {
        a.targetRow = bySource.get(a.target) ?? null;
        a.slug = ruleSlug(path.basename(a.alias));
    }
    // A topic's navigation label falls back to its slug when it has no heading.
    for (const node of walkNav(navRoot)) {
        if (node.kind === 'alias') {
            const target = bySource.get(node.target);
            node.slug = target?.slug ?? null;
            node.label = target?.navLabel ?? null;
        }
    }
    return { topics, aliases, stubs, nav: navRoot, bySlug, bySource };
}

export function* walkNav(node) {
    for (const child of node.children ?? []) {
        yield child;
        yield* walkNav(child);
    }
}

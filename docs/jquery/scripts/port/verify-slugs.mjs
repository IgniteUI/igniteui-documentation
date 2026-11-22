#!/usr/bin/env node
/**
 * Checks every slug of the topic map against the live help (https://www.igniteui.com/help/<slug>),
 * because where the slug rule and the live site disagree the live site wins. One HEAD request per
 * topic; the page's canonical link names the slug the site serves it under.
 *
 *   node docs/jquery/scripts/port/verify-slugs.mjs --topics=<…>/topics --tokens=<table> --version=25.1 \
 *     [--out=<results .json>] [--write-overrides]
 *
 * For a topic the rule gets wrong, the metadata `fileName` is tried next. --write-overrides records
 * the slugs the live site confirms but the rule does not produce in slug-overrides.json, which the
 * converter reads. Topics found under neither are reported and keep the rule's slug.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTopicMap } from './lib/topic-map.mjs';
import { metadataFromText } from './lib/steps.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    return [k, v.length ? v.join('=') : true];
}));
const ORIGIN = 'https://www.igniteui.com/help/';
const map = buildTopicMap(path.resolve(args.topics), { replaceTokens: s => s, readMetadata: metadataFromText });

async function head(slug) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(ORIGIN + encodeURIComponent(slug).replace(/%2F/g, '/'), {
                method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'docs-port-slug-check/1.0' },
            });
            const canonical = /<([^>]+)>;\s*rel="canonical"/.exec(res.headers.get('link') ?? '')?.[1] ?? null;
            return { status: res.status, canonical: canonical ? decodeURIComponent(canonical.replace(/^https?:\/\/[^/]+\/help\//, '')) : null, final: res.url };
        } catch (error) {
            if (attempt === 2) return { status: 'error', error: String(error.message ?? error) };
        }
    }
}

const results = [];
const queue = map.topics.filter(t => !t.excluded);
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
    while (next < queue.length) {
        const row = queue[next++];
        const rule = await head(row.ruleSlug);
        const entry = { source: row.source, rule: row.ruleSlug, ruleStatus: rule.status, canonical: rule.canonical };
        if (rule.status !== 200 && row.metadataFileName && row.metadataFileName.toLowerCase() !== row.ruleSlug) {
            const meta = await head(row.metadataFileName.toLowerCase());
            Object.assign(entry, { metadata: row.metadataFileName.toLowerCase(), metadataStatus: meta.status, metadataCanonical: meta.canonical });
        }
        entry.live = entry.ruleStatus === 200 ? (entry.canonical ?? entry.rule)
            : entry.metadataStatus === 200 ? (entry.metadataCanonical ?? entry.metadata) : null;
        results.push(entry);
    }
}));
results.sort((a, b) => a.source.localeCompare(b.source));

const agree = results.filter(r => r.live === r.rule).length;
const differ = results.filter(r => r.live && r.live !== r.rule);
const missing = results.filter(r => !r.live);
console.log(`${results.length} topics: ${agree} served at the rule's slug, ${differ.length} under another slug, ${missing.length} not found on the live site.`);
for (const r of differ) console.log(`  differs  ${r.source}: rule ${r.rule} → live ${r.live}`);
for (const r of missing) console.log(`  missing  ${r.source}: rule ${r.rule} (${r.ruleStatus})${r.metadata ? `, metadata ${r.metadata} (${r.metadataStatus})` : ''}`);
if (args.out) fs.writeFileSync(path.resolve(args.out), `${JSON.stringify(results, null, 2)}\n`);
if (args['write-overrides']) {
    const overrides = Object.fromEntries(differ.map(r => [r.source, r.live]));
    fs.writeFileSync(path.join(here, 'slug-overrides.json'), `${JSON.stringify(overrides, null, 2)}\n`);
}

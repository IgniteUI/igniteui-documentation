#!/usr/bin/env node
/**
 * Ports the Ignite UI for jQuery help topics (the Markdown sources of the old help) to this doc
 * set (MDX).
 *
 * Deterministic: the same sources, token table and index give the same output, byte for byte.
 * Nothing internal is in these scripts. The token table (the old help tool's configuration, a JSON
 * object of token name to value) is read from wherever it is passed and never copied.
 *
 *   npm install --prefix docs/jquery/scripts/port
 *   node docs/jquery/scripts/port/port.mjs \
 *     --topics=<export of the help topic sources>/topics \
 *     --tokens=<token table .json> --version=25.1 \
 *     --out=docs/jquery/src/content/en \
 *     --report=<dir outside the repository> [--only=02_Controls/igGrid/03_Features/05_Updating] [--clean]
 *
 * --index      merged API link index (default: src/data/api-link-index/jquery/staging-latest.json)
 * --only       convert the topics under this source folder (repeatable, comma-separated); links,
 *              anchors and navigation are still resolved against the whole set
 * --report     where the run writes its report (report.md, report.json, undecided.json, topic-map.json)
 * --clean      delete the .mdx files and images in --out first
 * --no-gate    skip compiling the output
 *
 * Steps (lib/): parse (CommonMark + GFM, marked compatibility), metadata, HTML (parse5 via
 * hast-util-raw, back to Markdown + JSX), headings, code, API links, topic links, samples, images,
 * notes, tokens, description, gate. Each records what it handled and what it could not decide.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTopicMap } from './lib/topic-map.mjs';
import { loadTokenTable, createTokens } from './lib/tokens.mjs';
import { loadIndex } from './lib/api-index.mjs';
import { parseMarkdown, normalizeSource } from './lib/parse.mjs';
import { metadataFromText, collectAnchorRefs, buildImageIndex } from './lib/steps.mjs';
import { convertTopic, gate, emptyReport, STEPS } from './lib/convert.mjs';
import { buildToc } from './lib/navigation.mjs';
import { writeReports } from './lib/report.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');

const args = {};
for (const a of process.argv.slice(2)) {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    args[k] = v.length ? v.join('=') : true;
}
for (const required of ['topics', 'tokens', 'version', 'out', 'report']) {
    if (!args[required]) {
        console.error(`Missing --${required}. See the header of ${path.relative(process.cwd(), fileURLToPath(import.meta.url))}.`);
        process.exit(2);
    }
}

const topicsDir = path.resolve(args.topics);
const outDir = path.resolve(args.out);
const reportDir = path.resolve(args.report);
const indexFile = path.resolve(args.index ?? path.join(repoRoot, 'src/data/api-link-index/jquery/staging-latest.json'));
const only = args.only ? String(args.only).split(',').map(s => s.replace(/\\/g, '/').replace(/\/$/, '')) : null;
const slugOverrides = JSON.parse(fs.readFileSync(path.join(here, 'slug-overrides.json'), 'utf8'));
const EXCLUDED_FOLDERS = ['10_AngularJS Directives/'];

const tokenValues = loadTokenTable(args.tokens, args.version);
const tokens = createTokens(tokenValues);
const map = buildTopicMap(topicsDir, {
    replaceTokens: tokens.quiet,
    readMetadata: metadataFromText,
    slugOverrides,
    excluded: rel => EXCLUDED_FOLDERS.some(f => rel.startsWith(f)),
});
const api = loadIndex(indexFile);
const imageIndex = buildImageIndex(topicsDir);

// Pass 1, whole set: which anchors of which topic links point at.
const anchorRefs = new Map();
for (const row of map.topics) {
    const text = normalizeSource(fs.readFileSync(path.join(topicsDir, row.source), 'utf8'));
    collectAnchorRefs(parseMarkdown(text), row, map, anchorRefs);
}

const selected = map.topics.filter(row => !row.excluded && (!only || only.some(prefix => row.source === prefix || row.source.startsWith(`${prefix}/`))));
if (args.clean) {
    for (const f of fs.existsSync(outDir) ? fs.readdirSync(outDir) : []) {
        if (f.endsWith('.mdx')) fs.rmSync(path.join(outDir, f));
    }
    fs.rmSync(path.join(outDir, 'images'), { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

const report = emptyReport();
const perTopic = [];
const copies = new Map();
for (const row of selected) {
    const raw = fs.readFileSync(path.join(topicsDir, row.source), 'utf8');
    const ctx = { row, map, tokens, api, topicsDir, imageIndex, anchorRefs, report };
    let result;
    try {
        result = convertTopic(raw, ctx);
    } catch (error) {
        report.gate.undecided.push({ topic: row.source, line: null, reason: 'converter error', detail: String(error.stack ?? error).split('\n').slice(0, 3).join(' | ') });
        perTopic.push({ source: row.source, slug: row.slug, converted: false });
        continue;
    }
    const errors = args['no-gate'] ? [] : await gate(result.mdx);
    for (const e of errors) report.gate.undecided.push({ topic: row.source, line: e.line, reason: `does not compile (${e.compiler})`, detail: e.message });
    report.gate.handled[errors.length ? 'topics that do not compile' : 'topics that compile'] = (report.gate.handled[errors.length ? 'topics that do not compile' : 'topics that compile'] ?? 0) + 1;
    fs.writeFileSync(path.join(outDir, `${row.slug}.mdx`), result.mdx);
    for (const c of ctx.imageCopies) copies.set(c.to, c.from);
    perTopic.push({
        source: row.source, slug: row.slug, title: result.title, description: result.description,
        compiles: errors.length === 0, errors: errors.map(e => `${e.compiler}: ${e.message}`), samples: ctx.sampleEmbeds,
    });
}
for (const [to, from] of [...copies].sort()) {
    const dest = path.join(outDir, 'images', to);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(topicsDir, from), dest);
}

const included = new Set(perTopic.filter(t => t.compiles !== false).map(t => t.slug));
fs.writeFileSync(path.join(outDir, 'toc.json'), `${JSON.stringify(buildToc(map, included), null, 2)}\n`);

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, 'topic-map.json'), `${JSON.stringify({
    topics: map.topics.map(({ source, slug, ruleSlug, metadataFileName, rawHeading, navLabel, navPath, navOrder, landingPage, excluded, target }) =>
        ({ source, slug, ruleSlug, metadataFileName, title: rawHeading, navLabel, navPath, navOrder, landingPage, excluded, target })),
    aliases: map.aliases.map(({ alias, target, slug, navPath }) => ({ alias, target, slug, navPath })),
    stubs: map.stubs,
}, null, 2)}\n`);
writeReports(reportDir, { report, perTopic, tokens: tokens.report, selected: selected.length, total: map.topics.length, steps: STEPS });
console.log(`${perTopic.length} topics converted to ${path.relative(process.cwd(), outDir)}; ${perTopic.filter(t => t.compiles).length} compile. Report: ${path.relative(process.cwd(), reportDir)}`);

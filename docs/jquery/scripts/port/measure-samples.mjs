#!/usr/bin/env node
/**
 * Measures the height each embedded sample's page needs and writes sample-heights.json, which the
 * samples step reads. A sample is the page the doc set iframes: `<demosBaseUrl>/<path>/index.html`.
 * It is loaded in headless Chromium in a frame as wide as the site's content column in a
 * 1440-pixel window, and its document height read once it has settled.
 *
 *   npm install --prefix docs/jquery/scripts/port && npx --prefix docs/jquery/scripts/port playwright install chromium
 *   node docs/jquery/scripts/port/measure-samples.mjs --report=<the port run's report dir> [--width=766]
 *
 * --report  a run's report directory: the sample paths are read from its report.json
 * --base    the pages' base URL (default: `demosBaseUrl` of the doc set's environment.json)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    return [k, v.length ? v.join('=') : true];
}));
if (!args.report) {
    console.error('Missing --report. See the header of measure-samples.mjs.');
    process.exit(2);
}
const environment = JSON.parse(fs.readFileSync(path.join(here, '../../src/content/en/environment.json'), 'utf8'));
const base = String(args.base ?? environment.development.demosBaseUrl).replace(/\/$/, '');
const width = Number(args.width ?? 766);
// The frame's default height: a page that needs less reports this.
const VIEWPORT_HEIGHT = 500;

const report = JSON.parse(fs.readFileSync(path.join(path.resolve(args.report), 'report.json'), 'utf8'));
const paths = [...new Set(report.topics.flatMap(t => t.samples ?? []))].sort();

const browser = await chromium.launch();
const heights = {};
const failed = [];
async function measure(sample) {
    const page = await browser.newPage({ viewport: { width, height: VIEWPORT_HEIGHT } });
    try {
        await page.goto(`${base}/${sample}/index.html`, { waitUntil: 'load', timeout: 45000 });
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(2500);
        // A page wider than its frame gets a horizontal scroll bar, which takes its height from the page.
        heights[sample] = await page.evaluate(() => {
            const root = document.documentElement;
            return root.scrollHeight + (root.scrollWidth > root.clientWidth ? 17 : 0);
        });
    } catch (error) {
        failed.push(`${sample}: ${String(error.message).split('\n')[0]}`);
    }
    await page.close();
}
const queue = [...paths];
await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) await measure(queue.shift());
}));
await browser.close();

const sorted = Object.fromEntries(Object.entries(heights).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(path.join(here, 'sample-heights.json'), `${JSON.stringify({ width, viewportHeight: VIEWPORT_HEIGHT, heights: sorted }, null, 2)}\n`);
console.log(`${Object.keys(sorted).length} of ${paths.length} samples measured at ${width} pixels wide.`);
for (const f of failed) console.error(`not measured: ${f}`);
if (failed.length) process.exitCode = 1;

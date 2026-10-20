// Check the actual iframe URLs in a WinUI/Uno documentation build against the
// routes available in the deployed Uno browser. Does not contact live IIS.
// node scripts/check-uno-sample-links.mjs --site=dist/winui --environment=staging --registry=../uno-samples/browser/SamplesBrowser/SampleRegistry.cs
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
    const split = arg.indexOf('=');
    return [arg.slice(2, split), arg.slice(split + 1)];
}));
assert(args.site && args.registry, 'Provide --site=<built docs directory> and --registry=<SampleRegistry.cs>');
assert(['staging', 'production'].includes(args.environment), 'Provide --environment=staging or production');
const config = JSON.parse(readFileSync(new URL('../docs/xplat/docConfig.json', import.meta.url), 'utf8'));
const expectedRoot = args.environment === 'staging'
    ? 'https://staging.infragistics.com/uno-wasm-demos'
    : 'https://www.infragistics.com/uno-wasm-demos';
for (const platform of ['WinUI', 'Uno']) {
    assert.equal(config[platform].samplesBrowsers[args.environment], expectedRoot,
        `${platform} ${args.environment} sample host must match the shared Uno deployment`);
}
const registry = readFileSync(args.registry, 'utf8');
const routes = new Set([...registry.matchAll(/\{\s*"([^"]+)"\s*,/g)].map(match => match[1]));
assert(routes.size > 0, 'No sample routes found in registry');
const failures = [];
let examples = 0;
let sourceWidgets = 0;
function inspect(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) inspect(file);
        else if (entry.name.endsWith('.html')) {
            const html = readFileSync(file, 'utf8');
            if (!html.includes('igd-code-view') && !html.includes('igd-sample-container')) continue;
            const dom = new JSDOM(html);
            const elements = dom.window.document.querySelectorAll(
                '.igd-code-view[data-iframe-src], .igd-sample-container iframe');
            for (const element of elements) {
                if (element.tagName === 'IFRAME' && element.closest('.igd-code-view')) continue;
                if (element.hasAttribute('data-iframe-src')) {
                    sourceWidgets++;
                    if (element.getAttribute('data-demos-base-url') !== expectedRoot) {
                        failures.push(`${file}: source JSON base does not match ${expectedRoot}`);
                    }
                    if (!['winui', 'uno', 'uno-platform'].includes(element.getAttribute('data-platform'))) {
                        failures.push(`${file}: unsupported source-viewer platform ${element.getAttribute('data-platform')}`);
                    }
                }
                const address = element.getAttribute('data-iframe-src')
                    ?? element.getAttribute('data-src') ?? element.getAttribute('src');
                examples++;
                if (!address?.startsWith(expectedRoot + '/')) {
                    failures.push(`${file}: unexpected sample host ${address}`);
                    continue;
                }
                const route = new URL(address).pathname.slice('/uno-wasm-demos/'.length)
                    .replace(/^samples\//, '').replace(/\/$/, '');
                if (element.hasAttribute('data-iframe-src') && new URL(address).pathname !== `/uno-wasm-demos/${route}`) {
                    failures.push(`${file}: source-enabled embed requires a canonical sample route: ${address}`);
                }
                if (!routes.has(route)) failures.push(`${file}: missing Uno sample ${route}`);
            }
            dom.window.close();
        }
    }
}
inspect(args.site);
assert(examples > 0, 'No sample embeds found; provide a built WinUI or Uno documentation site');
assert(sourceWidgets > 0, 'No source-enabled sample widgets found in the built documentation site');
for (const failure of failures) console.error(failure);
assert.equal(failures.length, 0, `${failures.length} invalid sample embeds out of ${examples}`);
console.log(`Validated ${examples} documentation embeds, including ${sourceWidgets} source-enabled widgets, against ${routes.size} Uno sample routes (${args.environment}).`);

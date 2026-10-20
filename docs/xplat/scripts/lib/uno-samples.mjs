import { readFileSync } from 'node:fs';

let available;
const omitted = new Set();
const routeAliases = {
    // Both examples render the WorldCableRoutes shapefile as map polylines.
    'maps/geo-map/binding-shp-file': 'maps/geo-map/binding-shp-polylines',
};
function availableRoutes() {
    if (available) return available;
    // CI checks out the matching Uno branch. The snapshot supports local docs builds.
    available = process.env.UNO_SAMPLES_REGISTRY
        ? new Set([...readFileSync(process.env.UNO_SAMPLES_REGISTRY, 'utf8')
            .matchAll(/\{\s*"([^"]+)"\s*,/g)].map(match => match[1]))
        : new Set(JSON.parse(readFileSync(new URL('../../uno-sample-routes.json', import.meta.url), 'utf8')));
    if (!available.size) throw new Error('Uno sample registry has no routes');
    return available;
}

export function filterUnoSamples(content, platform) {
    if (platform !== 'WinUI' && platform !== 'Uno') return content;
    const routes = availableRoutes();
    // Leave code examples untouched; only transform live, self-closing MDX widgets.
    return content.split(/(^```[^\n]*\n[\s\S]*?^```[ \t]*$)/gm).map((part, index) => {
        if (index % 2) return part;
        return part.replace(/<Sample\b[^>]*\/\s*>/g, widget => {
            const src = widget.match(/\bsrc="([^"]+)"/)?.[1];
            if (!src?.startsWith('/')) return widget;
            const originalRoute = src.replace(/^\/(samples\/)?/, '').replace(/\/$/, '');
            const route = routeAliases[originalRoute] ?? originalRoute;
            if (!routes.has(route)) {
                omitted.add(route);
                return '';
            }
            if (route !== originalRoute) widget = widget.replace(`src="${src}"`, `src="/${route}"`);
            return widget;
        });
    }).join('');
}

export function reportOmittedUnoSamples() {
    if (omitted.size) console.log(`[uno-samples] Omitted ${omitted.size} unavailable live sample routes:\n${[...omitted].sort().join('\n')}`);
}

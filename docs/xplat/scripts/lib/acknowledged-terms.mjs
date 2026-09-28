/**
 * API term errors that are known, owned elsewhere, and deliberately not failing the build yet.
 *
 * An unresolved xplat term fails generation. Some failures are not the page's to fix and cannot be
 * fixed today: the WinUI alpha's api-docs index lists no events, a member exists but the published
 * index predates it. Those go in src/data/api-terms-acknowledged.json with the reason and what clears
 * them, so the build can go on while the list says, every run, what is still outstanding.
 *
 * Loud either way. An acknowledged error is printed as a warning with its reason each time it occurs,
 * and an entry that matched nothing in a run is reported as stale -- the upstream fix landed, or the
 * page changed -- so the list cannot quietly outlive its reasons.
 *
 * An entry:
 *   { "term": "SeriesClick", "platforms": ["WinUI", "Uno"], "page": "charts/features/chart-data-selection.mdx",
 *     "reason": "WinUI alpha index has no events", "clears": "next WinUI alpha" }
 *
 * `page` is optional (every page when absent) and matched against the end of the page path.
 * `platforms` and `reason` are required; an entry without a reason is refused.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function loadAcknowledgedTerms(repoRoot) {
    const file = path.join(repoRoot, 'src', 'data', 'api-terms-acknowledged.json');
    const entries = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).acknowledged ?? [] : [];
    for (const [i, e] of entries.entries()) {
        if (!e.term || !Array.isArray(e.platforms) || !e.platforms.length || !e.reason) {
            throw new Error(`${file}: entry ${i} needs term, platforms and reason: ${JSON.stringify(e)}`);
        }
    }
    const hits = new Map(entries.map(e => [e, 0]));
    const norm = p => String(p).replace(/\\/g, '/');
    return {
        /** The entry acknowledging this error on this platform, or null. */
        match(platform, where, error) {
            // Case-insensitive, as member resolution is: en may write `MarkerSize` where jp writes `markerSize`,
            // and one entry should cover both.
            const e = entries.find(x => x.term.toLowerCase() === error.term.toLowerCase() && x.platforms.includes(platform)
                && (!x.page || norm(where).endsWith(norm(x.page))));
            if (e) hits.set(e, hits.get(e) + 1);
            return e ?? null;
        },
        /** Entries for this platform that matched nothing in the run. */
        stale(platform) {
            return entries.filter(e => e.platforms.includes(platform) && hits.get(e) === 0);
        },
    };
}

/**
 * Release label cleanup script.
 *
 * Fetches the current package version for each platform from the live npm /
 * NuGet registry, then walks the source toc.json files and clears
 * new/updated/preview labels that are 2+ minor versions old.
 *
 * `since` lives inside platforms[PlatformName].since and stores the package
 * version string when the label was introduced (e.g. "7.0.0" for WC).
 * Expiry rule: minorVersion(current) − minorVersion(since) >= 2.
 *
 * Usage:
 *   node scripts/release-labels.mjs                  # all platforms
 *   node scripts/release-labels.mjs --platform=Blazor
 *   node scripts/release-labels.mjs --dry-run        # preview, no writes
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// CLI

const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.length ? v.join('=') : true]; })
);

const PLATFORM_ARG = args.platform ? String(args.platform) : null;
const DRY_RUN = !!args['dry-run'];
const ALL_PLATFORMS = ['Angular', 'React', 'WebComponents', 'Blazor'];

if (PLATFORM_ARG && !ALL_PLATFORMS.includes(PLATFORM_ARG)) {
    console.error(`Unknown platform "${PLATFORM_ARG}". Valid: ${ALL_PLATFORMS.join(', ')}`);
    process.exit(1);
}

const PLATFORMS = PLATFORM_ARG ? [PLATFORM_ARG] : ALL_PLATFORMS;
if (DRY_RUN) console.log('[release-labels] DRY RUN — no files will be written.\n');

// Package registry config per platform

const PLATFORM_PACKAGE = {
    Angular:       { registry: 'npm',   name: 'igniteui-angular' },
    React:         { registry: 'npm',   name: 'igniteui-react' },
    WebComponents: { registry: 'npm',   name: 'igniteui-webcomponents' },
    // IgniteUI.Blazor is a licensed NuGet package (not on nuget.org public feed).
    // IgniteUI.Blazor.Trial is the public mirror with identical versioning.
    Blazor:        { registry: 'nuget', name: 'IgniteUI.Blazor.Trial' },
};

// Version fetching

async function fetchNpmVersion(packageName) {
    try {
        const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
        if (!res.ok) return null;
        const { version } = await res.json();
        return version ?? null;
    } catch { return null; }
}

async function fetchNugetVersion(packageName) {
    // NuGet flat-container API — works for public packages on nuget.org.
    // The last entry in the versions array is the latest release.
    const id = packageName.toLowerCase();
    try {
        const res = await fetch(`https://api.nuget.org/v3-flatcontainer/${id}/index.json`);
        if (!res.ok) return null;
        const { versions } = await res.json();
        return versions?.at(-1) ?? null;
    } catch { return null; }
}

async function getCurrentVersion(platform) {
    const pkg = PLATFORM_PACKAGE[platform];
    if (!pkg) return null;
    if (pkg.registry === 'npm')   return await fetchNpmVersion(pkg.name);
    if (pkg.registry === 'nuget') return await fetchNugetVersion(pkg.name);
    return null;
}

// Expiry logic — compare minor versions, window = 2 minor releases
//
// Linearise as (major * 1000 + minor) so within-major minor bumps are caught
// (e.g. 19.7 → 19.9 = diff 2) and cross-major version gaps are always expired.

const MINOR_EXPIRY = 2;

function minorLinear(v) {
    const [major, minor = 0] = String(v).split('.').map(Number);
    return major * 1000 + minor;
}

function isExpired(since, current) {
    return minorLinear(current) - minorLinear(since) >= MINOR_EXPIRY;
}

// TOC processor — only clears items that have platforms[platform].since

const LABEL_FLAGS = ['new', 'updated', 'preview'];
let totalCleared = 0;
let totalFiles = 0;

function processNodes(nodes, platform, currentVersion) {
    if (!Array.isArray(nodes)) return nodes;
    return nodes.map(node => {
        const out = { ...node };
        const platformEntry = out.platforms?.[platform];
        if (platformEntry?.since && isExpired(platformEntry.since, currentVersion)) {
            const { since: _since, ...entryWithoutSince } = platformEntry;
            const hasBadgeOverrides = LABEL_FLAGS.some(f => f in entryWithoutSince);
            const newPlatforms = { ...out.platforms };

            if (!hasBadgeOverrides) {
                // Since only entry (no badge overrides) the platform was using the base
                // badge. Clear the base flag(s) directly and remove the platform entry.
                // This keeps the output clean: no leftover "React": { "new": false } noise.
                for (const flag of LABEL_FLAGS) {
                    if (out[flag]) out[flag] = false;
                }
                delete newPlatforms[platform];
            } else {
                // Entry had explicit badge overrides. Compute the effective badge state
                // for this platform and set all active labels to false within the entry.
                const effective = { ...out, ...platformEntry };
                const newEntry = { ...entryWithoutSince };
                for (const flag of LABEL_FLAGS) {
                    if (effective[flag]) newEntry[flag] = false;
                }
                for (const flag of LABEL_FLAGS) {
                    if (newEntry[flag] === false && !out[flag]) delete newEntry[flag];
                }
                if (Object.keys(newEntry).length === 0) delete newPlatforms[platform];
                else newPlatforms[platform] = newEntry;
            }

            out.platforms = Object.keys(newPlatforms).length > 0 ? newPlatforms : undefined;
            if (out.platforms === undefined) delete out.platforms;
            totalCleared++;
        }
        if (Array.isArray(out.items)) out.items = processNodes(out.items, platform, currentVersion);
        return out;
    });
}

/** Detect the indentation unit used in a JSON file (e.g. "  " or "    "). */
function detectIndent(raw) {
    const m = raw.match(/^([ \t]+)/m);
    return m ? m[1] : '  ';
}

function processTocFile(tocPath, platform, currentVersion) {
    if (!existsSync(tocPath)) return;
    const raw = readFileSync(tocPath, 'utf8');
    const indent = detectIndent(raw);
    const nodes = JSON.parse(raw);
    const processed = processNodes(nodes, platform, currentVersion);
    if (JSON.stringify(processed) === JSON.stringify(nodes)) return;
    const out = JSON.stringify(processed, null, indent) + '\n';
    if (!DRY_RUN) writeFileSync(tocPath, out, 'utf8');
    console.log(`  ${DRY_RUN ? '[would update]' : 'updated:'} ${path.relative(ROOT, tocPath)}`);
    totalFiles++;
}

// Platform → source toc files

const LANGS = ['en', 'jp', 'kr'];

function tocFilesForPlatform(platform) {
    if (platform === 'Angular') {
        return LANGS.flatMap(lang => [
            path.join(ROOT, `docs/angular/src/content/${lang}/components/toc.json`),
            path.join(ROOT, `docs/angular/src/content/${lang}/toc.json`),
        ]);
    }
    // React, WebComponents, Blazor share the xplat source toc
    return LANGS.map(lang => path.join(ROOT, `docs/xplat/src/content/${lang}/toc.json`));
}

// Run

console.log(`\n[release-labels] platforms : ${PLATFORMS.join(', ')}`);
console.log(`[release-labels] expiry    : ${MINOR_EXPIRY} minor versions\n`);

const processedForPlatform = new Map(); // tocPath - Set of platforms already processed

for (const platform of PLATFORMS) {
    process.stdout.write(`-- ${platform}: fetching current version... `);
    const currentVersion = await getCurrentVersion(platform);
    if (!currentVersion) {
        console.log('FAILED (skipping)');
        continue;
    }
    console.log(currentVersion);

    for (const tocPath of tocFilesForPlatform(platform)) {
        processTocFile(tocPath, platform, currentVersion);
    }
}

console.log(`\n[release-labels] Done. ${totalCleared} label(s) cleared across ${totalFiles} file(s).`);

#!/usr/bin/env node
/**
 * Post-pass over MDX files to fix already-emitted <ApiLink> elements:
 *   1. Strip CLR backtick-arity suffix in type="X`N" → type="X".
 *   2. Reclassify known apiMap class entries that TypeDoc publishes as
 *      interfaces.
 *
 * Idempotent — safe to re-run.
 *
 * Usage:
 *   node scripts/fix-api-link-attrs.mjs        # walk src/content
 *   node scripts/fix-api-link-attrs.mjs <dir>  # walk specific dir
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'src/content');

/** Recursively collect .mdx files. */
function walk(dir, out = []) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, e.name);
        if (e.isDirectory()) walk(full, out);
        else if (e.isFile() && full.endsWith('.mdx')) out.push(full);
    }
    return out;
}

const TAG_RE = /<ApiLink\b[^/>]*\/>/g;

// Types that the apiMap marks as "class" but TypeDoc actually publishes as
// `interfaces/X`. Routing them through kind="interface" fixes the URL.
const FORCE_INTERFACE_RAW = [
    // Excel
    'IWorksheetCellFormat',
    // Grids
    'ColumnPipeArgs',
    'GridBaseDirective',
    'GridStateBaseDirective',
    'GridStateInfo',
    'HierarchicalGridBaseDirective',
    'PivotConfiguration',
    'PivotDimension',
    'PivotValue',
    'PositionStrategy',
    'RowSelectorTemplateDetails',
    'HeadSelectorTemplateDetails',
    'CellType',
    'CellTemplateContext',
];
const FORCE_INTERFACE = new Set([
    ...FORCE_INTERFACE_RAW,
    ...FORCE_INTERFACE_RAW.map(n => 'Igr' + n),
    ...FORCE_INTERFACE_RAW.map(n => 'Igx' + n),
    ...FORCE_INTERFACE_RAW.map(n => 'Igc' + n),
]);

function transformTag(tag) {
    let out = tag;
    let changed = false;

    // 1. Strip backtick-arity in type="X`N"
    out = out.replace(/(\stype=")([^"]+?)`\d+(")/g, (m, a, name, c) => {
        changed = true;
        return `${a}${name}${c}`;
    });

    // 2. Reclassify class → interface for known mis-classified types.
    const typeMatch = out.match(/\stype="([^"]+)"/);
    if (typeMatch && FORCE_INTERFACE.has(typeMatch[1]) && !/\skind="/.test(out)) {
        // No kind specified → defaults to class. Insert kind="interface" before type.
        out = out.replace(/(\stype=")/, ' kind="interface"$1');
        changed = true;
    }

    return { out, changed };
}

let filesScanned = 0;
let filesChanged = 0;
let tagsTouched  = 0;

for (const file of walk(root)) {
    filesScanned++;
    const src = readFileSync(file, 'utf-8');
    let fileChanged = false;
    const next = src.replace(TAG_RE, (tag) => {
        const { out, changed } = transformTag(tag);
        if (changed) { tagsTouched++; fileChanged = true; }
        return out;
    });
    if (fileChanged) {
        writeFileSync(file, next);
        filesChanged++;
    }
}

console.log(`[fix-api-link-attrs] scanned=${filesScanned}, changed=${filesChanged}, tags fixed=${tagsTouched}`);

#!/usr/bin/env node
/**
 * Post-pass over MDX files to fix already-emitted <ApiLink> elements:
 *   1. For kind="enum": add prefixed={false} when missing.
 *      DV / TypeDoc-generated React/WC enum URLs use the bare name (e.g.
 *      .../enums/CategoryChartType), never with an Igr/Igx/Igc prefix.
 *   2. Strip CLR backtick-arity suffix in type="X`N" → type="X".
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

// Types whose React TypeDoc page genuinely does not exist (verified via
// api-link-report-react.md + scripts/probe-classify.mjs). ApiLink references
// to these are demoted to plain `<code>` backticks so the link checker stops
// flagging them. List intentionally maintained by hand — re-derive after a
// staging API publish by inspecting the report.
const NONEXISTENT_TYPES_RAW = [
    // Charts
    'DataAbbreviationMode', 'DataLegendSummaryType', 'TrendLineType',
    'DataSourceSummaryOperand', 'DataSourceSummaryScope', 'DataSourceSectionHeaderDisplayMode',
    'RangeBarSeries',
    // Grids — event args & misc not published in current TypeDoc
    'GridContextMenuEventArgs', 'GridEditDoneEventArgs', 'GridEditEventArgs',
    'GridToolbarExportEventArgs', 'PinRowEventArgs', 'RowDataCancelableEventArgs',
    'DataGridCellEventArgs', 'DataGridColumn', 'ComboBoxColumn',
    'DataGridSelectionMode', 'EnterKeyBehaviors', 'EnterKeyBehaviorAfterEdit',
    'MultiColumnComboBox',
    // Spreadsheet sub-types
    'SpreadsheetSelection', 'SpreadsheetCell', 'SpreadsheetCellRange',
    'SpreadsheetAction', 'SpreadsheetChartAdapter', 'SpreadsheetChartAdapterBase',
    'SortSettings',
    // DockManager layout types
    'DockManager', 'DockManagerLayout', 'DocumentHost', 'ContentPane',
    'SplitPane', 'TabGroupPane', 'Toolbar', 'ToolPanel', 'ToolAction',
    'ToolActionButton', 'ToolActionCheckbox', 'ToolActionGroupHeader',
    'ToolActionIconButton', 'ToolActionIconMenu', 'ToolActionLabel',
    'ToolActionNumberInput', 'ToolActionRadio', 'ToolActionSubPanel',
    // Inputs — event args without TypeDoc
    'CheckboxChangeEventArgs', 'RadioChangeEventArgs',
    'ComponentBoolValueChangedEventArgs', 'ComponentDataValueChangedEventArgs',
    'ComponentValueChangedEventArgs',
    'ColorEditor', 'DateRangeDescriptor',
];
const NONEXISTENT_TYPES = new Set([
    ...NONEXISTENT_TYPES_RAW,
    ...NONEXISTENT_TYPES_RAW.map(n => 'Igr' + n),
    ...NONEXISTENT_TYPES_RAW.map(n => 'Igx' + n),
    ...NONEXISTENT_TYPES_RAW.map(n => 'Igc' + n),
]);

// Types that the apiMap marks as "class" but TypeDoc actually publishes as
// `interfaces/X`. Routing them through kind="interface" fixes the URL.
// Verified via scripts/probe-classify.mjs against the React staging API.
// Note: MDX may reference these with or without the platform prefix
// (e.g. type="GridBaseDirective" → ApiLink prepends "Igr").
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
    // 0. Demote ApiLink → plain backtick code for types whose TypeDoc page
    //    genuinely does not exist (no auto-fix possible).
    const typeAttr = tag.match(/\stype="([^"]+)"/);
    if (typeAttr) {
        const rawType = typeAttr[1].replace(/`\d+$/, '');
        if (NONEXISTENT_TYPES.has(rawType)) {
            const prefixed   = !/\sprefixed=\{false\}/.test(tag);
            const memberAttr = tag.match(/\smember="([^"]+)"/);
            const labelAttr  = tag.match(/\slabel="([^"]+)"/);
            let text;
            if (labelAttr) {
                text = labelAttr[1];
            } else if (memberAttr) {
                const base = prefixed && !/^(Igr|Igx|Igc|Igb)/.test(rawType) ? 'Igr' + rawType : rawType;
                text = `${base}.${memberAttr[1]}`;
            } else {
                text = prefixed && !/^(Igr|Igx|Igc|Igb)/.test(rawType) ? 'Igr' + rawType : rawType;
            }
            return { out: '`' + text + '`', changed: true };
        }
    }

    let out = tag;
    let changed = false;

    // 1. Strip backtick-arity in type="X`N"
    out = out.replace(/(\stype=")([^"]+?)`\d+(")/g, (m, a, name, c) => {
        changed = true;
        return `${a}${name}${c}`;
    });

    // 2. Add prefixed={false} to kind="enum" tags that don't already have it.
    if (/\skind="enum"/.test(out) && !/\sprefixed=\{false\}/.test(out)) {
        // Insert before the closing " />" or "/>"
        out = out.replace(/\s*\/>$/, ' prefixed={false} />');
        changed = true;
    }

    // 3. Reclassify class → interface for known mis-classified types.
    const typeMatch = out.match(/\stype="([^"]+)"/);
    if (typeMatch && FORCE_INTERFACE.has(typeMatch[1]) && !/\skind="/.test(out)) {
        // No kind specified → defaults to class. Insert kind="interface" before type.
        out = out.replace(/(\stype=")/, ' kind="interface"$1');
        changed = true;
    }

    // 4. Spreadsheet types DO carry the platform Igr/Igx/Igc prefix
    //    (only excel types are unprefixed). Strip incorrect prefixed={false}.
    if (/\spkg="spreadsheet"/.test(out) && /\sprefixed=\{false\}/.test(out)) {
        out = out.replace(/\s+prefixed=\{false\}/, '');
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

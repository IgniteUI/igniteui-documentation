#!/usr/bin/env node
/**
 * Restores {environment:dvApiBaseUrl} / {environment:angularApiUrl} links that were
 * stripped to plain backticks by commit 58add32409.
 *
 * Strategy per file:
 *   1. Load pre-strip version from db6c99cbe1 (parent of 58add32409)
 *   2. For each dvApiBaseUrl link, build a map:
 *        plain-backtick-form → <ApiLink .../>
 *   3. Apply those replacements to the current HEAD file
 *
 * Usage:
 *   node scripts/restore-apilinks.mjs               (all branch-changed files)
 *   node scripts/restore-apilinks.mjs --dry-run
 *   node scripts/restore-apilinks.mjs path/to/file.mdx
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PRE_STRIP = 'db6c99cbe1'; // parent of 58add32409
const DRY_RUN = process.argv.includes('--dry-run');
const FROM_LIST = process.argv.find(a => a.startsWith('--from-list='))?.split('=')[1];
const SPECIFICS = process.argv.slice(2).filter(a => !a.startsWith('--') && a.endsWith('.mdx'));
const DIR = 'docs/angular/src/content';

// Manual type-name overrides for types not yet used in existing ApiLink elements
const TYPE_OVERRIDES = new Map([
  ['domainchart',              'DomainChart'],
  ['xychart',                  'XyChart'],
  ['xychartseries',            'XyChartSeries'],
  ['worksheetshapecollection', 'WorksheetShapeCollection'],
  ['piechartbase',             'PieChartBase'],
  ['scatterbase',              'ScatterBase'],
  ['polarbase',                'PolarBase'],
  ['shapeseriesbase',          'ShapeSeriesBase'],
  ['geographicshapeseriesbase','GeographicShapeSeriesBase'],
  ['financialindicator',       'FinancialIndicator'],
  ['financialoverlay',         'FinancialOverlay'],
  ['financialpriceseries',     'FinancialPriceSeries'],
  ['seriesviewer',             'SeriesViewer'],
  ['anchoredradialseries',     'AnchoredRadialSeries'],
  ['markerseries',             'MarkerSeries'],
  ['shapedatasource',          'ShapeDataSource'],
  ['shapefilerecord',          'ShapeFileRecord'],
  ['heattilegenerator',        'HeatTileGenerator'],
]);

// namespace → ApiLink pkg
const PKG_MAP = {
  igniteui_angular_charts:      'charts',
  igniteui_angular_gauges:      'gauges',
  igniteui_angular_maps:        'maps',
  igniteui_angular_core:        'core',
  igniteui_angular_grids:       'grids',
  igniteui_angular_excel:       'excel',
  igniteui_angular_spreadsheet: 'spreadsheet',
  igniteui_angular_inputs:      'inputs',
  igniteui_angular_layouts:     'layouts',
};

function buildTypeLookup() {
  const lookup = new Map();
  function walk(dir) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith('.mdx')) continue;
      const src = readFileSync(p, 'utf8');
      for (const m of src.matchAll(/type="([A-Z][^"]+)"/g)) {
        const t = m[1];
        if (t.startsWith('{')) continue;
        lookup.set(t.toLowerCase(), t);
      }
    }
  }
  walk(DIR);
  return lookup;
}

function urlClassCandidates(cls) {
  const s = cls.toLowerCase();
  const candidates = [s];
  if (s.startsWith('igx')) candidates.push(s.slice(3));
  if (s.endsWith('component')) candidates.push(s.slice(0, -9));
  if (s.startsWith('igx') && s.endsWith('component')) candidates.push(s.slice(3, -9));
  if (s.startsWith('igx') && s.endsWith('series')) candidates.push(s.slice(3));
  return candidates;
}

function stripBackticks(s) { return s.replace(/^`+|`+$/g, ''); }

// Convert link text to what 58add32409 would have left in HEAD as plain backticks.
// Rule: strip backticks; if class ref (IgxXxxComponent), strip Igx + Component; else capitalize first letter.
function linkTextToBacktick(rawLabel) {
  const label = stripBackticks(rawLabel);
  if (/^Igx[A-Z]/.test(label)) {
    let s = label.slice(3); // strip Igx
    if (s.endsWith('Component')) s = s.slice(0, -9);
    return s;
  }
  // camelCase property → PascalCase
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function resolveType(label, cls, typeLookup) {
  const cleanLabel = stripBackticks(label);
  // If class reference, derive type directly from label
  if (/^Igx[A-Z]/.test(cleanLabel)) {
    let s = cleanLabel.slice(3);
    if (s.endsWith('Component')) s = s.slice(0, -9);
    return typeLookup.get(s.toLowerCase()) || s;
  }
  // Otherwise look up from URL class name
  for (const candidate of urlClassCandidates(cls)) {
    if (typeLookup.has(candidate)) return typeLookup.get(candidate);
  }
  const key = cls.toLowerCase().replace(/^igx/, '').replace(/component$/, '');
  return TYPE_OVERRIDES.get(key) || (key.charAt(0).toUpperCase() + key.slice(1));
}

function buildReplacementMap(preStripContent, typeLookup) {
  const map = new Map(); // backtick-text → ApiLink JSX

  const envBase = '\\{environment:(?:dvApiBaseUrl|angularApiUrl)\\}/products/ignite-ui-angular/api/docs/typescript/latest';
  // WITH namespace
  const withNs = new RegExp(`\\[\`?([^\`\\]]*)\`?\\]\\(${envBase}/classes/([^./]+)\\.([^.#)]+)\\.html(?:#([^)]*))?\\)`, 'g');
  // WITHOUT namespace
  const withoutNs = new RegExp(`\\[\`?([^\`\\]]*)\`?\\]\\(${envBase}/classes/([^./\\s#)]+)\\.html(?:#([^)]*))?\\)`, 'g');
  // ENUM
  const enumPat = new RegExp(`\\[\`?([^\`\\]]*)\`?\\]\\(${envBase}/enums/([^./\\s#)]+)\\.html(?:#([^)]*))?\\)`, 'g');

  function addEntry(label, namespace, cls, member) {
    const backtickText = linkTextToBacktick(label);
    if (map.has(backtickText)) return; // first occurrence wins

    const pkg = PKG_MAP[namespace] || '';
    const type = resolveType(label, cls, typeLookup);
    const pkgAttr = pkg ? ` pkg="${pkg}"` : '';
    const memberAttr = member ? ` member="${member}"` : '';
    const cleanLabel = stripBackticks(label);
    const labelIsClassRef = /^Igx[A-Z]/.test(cleanLabel);
    const labelAttr = (!labelIsClassRef && cleanLabel && cleanLabel !== type && cleanLabel !== member) ? ` label="${cleanLabel}"` : '';
    map.set(backtickText, `<ApiLink${pkgAttr} type="${type}"${memberAttr}${labelAttr} />`);
  }

  for (const m of preStripContent.matchAll(withNs)) {
    const [, label, namespace, cls, member = ''] = m;
    addEntry(label, namespace, cls, member);
  }
  for (const m of preStripContent.matchAll(withoutNs)) {
    const [, label, cls, member = ''] = m;
    if (!preStripContent.includes(`${m[2]}.${cls}`)) // avoid re-matching namespace.class caught above
      addEntry(label, '', cls, member);
  }
  for (const m of preStripContent.matchAll(enumPat)) {
    const [, label, enumName, member = ''] = m;
    const cleanLabel = stripBackticks(label);
    const backtickText = linkTextToBacktick(label);
    if (!map.has(backtickText)) {
      const type = typeLookup.get(enumName.toLowerCase()) || TYPE_OVERRIDES.get(enumName.toLowerCase()) || (enumName.charAt(0).toUpperCase() + enumName.slice(1));
      const memberAttr = member ? ` member="${member}"` : '';
      const labelAttr = cleanLabel !== type ? ` label="${cleanLabel}"` : '';
      map.set(backtickText, `<ApiLink type="${type}"${memberAttr}${labelAttr} />`);
    }
  }

  return map;
}

function hasApiLinkImport(content) {
  return content.includes("from 'igniteui-astro-components/components/mdx/ApiLink.astro'");
}

function addApiLinkImport(content) {
  if (hasApiLinkImport(content)) return content;
  const importLine = "import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';";
  const lastImportIdx = content.lastIndexOf('\nimport ');
  if (lastImportIdx !== -1) {
    const lineEnd = content.indexOf('\n', lastImportIdx + 1);
    return content.slice(0, lineEnd + 1) + importLine + '\n' + content.slice(lineEnd + 1);
  }
  const fmEnd = content.indexOf('\n---\n', 3);
  if (fmEnd !== -1) return content.slice(0, fmEnd + 5) + importLine + '\n' + content.slice(fmEnd + 5);
  return content;
}

function applyReplacements(headContent, replacementMap) {
  let result = headContent;
  let count = 0;

  // Sort by length descending to avoid partial replacements
  const entries = [...replacementMap.entries()].sort((a, b) => b[0].length - a[0].length);

  for (const [backtickText, apiLink] of entries) {
    const pattern = new RegExp('`' + backtickText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`', 'g');
    const before = result;
    result = result.replace(pattern, apiLink);
    if (result !== before) count++;
  }

  if (count > 0) result = addApiLinkImport(result);
  return { result, count };
}

// -- Main --
const typeLookup = buildTypeLookup();
console.log(`Type lookup: ${typeLookup.size} known types\n`);

let files;
if (FROM_LIST) {
  files = readFileSync(FROM_LIST, 'utf8').trim().split('\n').filter(Boolean);
} else if (SPECIFICS.length > 0) {
  files = SPECIFICS;
} else {
  const branchFiles = new Set(
    execSync(`git diff master...HEAD --name-only -- "*.mdx"`, { encoding: 'utf8' })
      .trim().split('\n').filter(Boolean)
  );
  const stripFiles = new Set(
    execSync(`git show 58add32409 --name-only`, { encoding: 'utf8' })
      .trim().split('\n').filter(f => f.endsWith('.mdx'))
  );
  files = [...branchFiles].filter(f => stripFiles.has(f));
}

console.log(`Processing ${files.length} files...\n`);
let totalFixed = 0;

for (const file of files) {
  let preStripContent;
  try {
    preStripContent = execSync(`git show ${PRE_STRIP}:"${file}"`, { encoding: 'utf8' });
  } catch { continue; }

  if (!/dvApiBaseUrl|angularApiUrl/.test(preStripContent)) continue;

  const replacementMap = buildReplacementMap(preStripContent, typeLookup);
  if (replacementMap.size === 0) continue;

  let headContent;
  try { headContent = readFileSync(file, 'utf8'); } catch { continue; }

  const { result, count } = applyReplacements(headContent, replacementMap);

  if (count === 0) {
    console.log(`  unchanged (no matches found): ${file}`);
    continue;
  }

  if (DRY_RUN) {
    console.log(`  [dry] ${file}: ${count} replacement(s) from ${replacementMap.size} known backtick forms`);
    // Show sample
    for (const [bt, al] of [...replacementMap.entries()].slice(0, 3)) {
      console.log(`        \`${bt}\` → ${al}`);
    }
  } else {
    writeFileSync(file, result, 'utf8');
    console.log(`  ${file}: ${count} replacement(s)`);
  }
  totalFixed++;
}

console.log(`\nDone: ${totalFixed} files updated${DRY_RUN ? ' (dry run)' : ''}.`);

#!/usr/bin/env node
/**
 * Converts raw {environment:dvApiBaseUrl} and {environment:angularApiUrl} links
 * to <ApiLink> components in MDX files.
 *
 * Usage:
 *   node scripts/convert-dvapi-links.mjs               (branch-changed files vs master)
 *   node scripts/convert-dvapi-links.mjs --all          (all .mdx files in docs/)
 *   node scripts/convert-dvapi-links.mjs --dry-run      (preview without writing)
 *   node scripts/convert-dvapi-links.mjs path/to/file.mdx  (specific file)
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const ALL = process.argv.includes('--all');
const SPECIFIC = process.argv.find(a => a.endsWith('.mdx'));
const BASE = process.argv.find(a => a.startsWith('--base='))?.split('=')[1] || 'master';
const DIR = 'docs/angular/src/content';

// Namespace (from URL) → ApiLink pkg
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

// Build type lookup from all existing <ApiLink type="..."> usages in the docs tree.
// Key: lowercase type name (after stripping igx prefix + component suffix from URL class)
// Value: correct PascalCase type for <ApiLink>
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
        if (t.startsWith('{')) continue; // skip template variables
        lookup.set(t.toLowerCase(), t);
      }
    }
  }
  walk(DIR);
  return lookup;
}

// Convert a URL class name like "igxcategorychartcomponent" → type lookup key "categorychart"
function urlClassToKey(cls) {
  let s = cls.toLowerCase();
  if (s.startsWith('igx')) s = s.slice(3);
  if (s.endsWith('component')) s = s.slice(0, -9);
  return s;
}

// Same but for types without igx prefix (e.g. spreadsheet types: workbook, sheet, etc.)
// Return multiple candidates for the lookup
function urlClassCandidates(cls) {
  const s = cls.toLowerCase();
  const candidates = [s];
  if (s.startsWith('igx')) candidates.push(s.slice(3));
  if (s.endsWith('component')) candidates.push(s.slice(0, -9));
  if (s.startsWith('igx') && s.endsWith('component')) candidates.push(s.slice(3, -9));
  if (s.startsWith('igx') && s.endsWith('series')) candidates.push(s.slice(3));
  return candidates;
}

// Strip surrounding backticks from link label text
function stripBackticks(s) {
  return s.replace(/^`+|`+$/g, '');
}

// Determine if we need to add the ApiLink import
function hasApiLinkImport(content) {
  return content.includes("from 'igniteui-astro-components/components/mdx/ApiLink.astro'");
}

function addApiLinkImport(content) {
  // Insert after existing imports or after the frontmatter closing ---
  if (hasApiLinkImport(content)) return content;
  const importLine = "import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';";
  // After the last import line
  const lastImportIdx = content.lastIndexOf('\nimport ');
  if (lastImportIdx !== -1) {
    const lineEnd = content.indexOf('\n', lastImportIdx + 1);
    return content.slice(0, lineEnd + 1) + importLine + '\n' + content.slice(lineEnd + 1);
  }
  // After frontmatter closing ---
  const fmEnd = content.indexOf('\n---\n', 3);
  if (fmEnd !== -1) {
    return content.slice(0, fmEnd + 5) + importLine + '\n' + content.slice(fmEnd + 5);
  }
  return content;
}

// Convert a single matched link to <ApiLink> or plain backtick fallback
function convertLink(label, namespace, cls, member, typeLookup) {
  const pkg = PKG_MAP[namespace];
  const cleanLabel = stripBackticks(label);

  // Try to resolve type name
  let type = null;
  for (const candidate of urlClassCandidates(cls)) {
    if (typeLookup.has(candidate)) {
      type = typeLookup.get(candidate);
      break;
    }
  }

  // If still no match, try matching by the label text (when label IS the class name like IgxCategoryChartComponent)
  if (!type && /^Igx[A-Z]/.test(cleanLabel)) {
    // Label is a class name: IgxCategoryChartComponent → CategoryChart
    let fromLabel = cleanLabel;
    if (fromLabel.startsWith('Igx')) fromLabel = fromLabel.slice(3);
    if (fromLabel.endsWith('Component')) fromLabel = fromLabel.slice(0, -9);
    const fromLabelKey = fromLabel.toLowerCase();
    if (typeLookup.has(fromLabelKey)) {
      type = typeLookup.get(fromLabelKey);
    } else {
      type = fromLabel; // best-effort
    }
  }

  if (!type) {
    // Cannot determine type — leave as best-effort with raw class name hint
    const key = urlClassToKey(cls);
    // capitalize first char as minimal conversion
    type = key.charAt(0).toUpperCase() + key.slice(1);
  }

  const pkgAttr = pkg ? ` pkg="${pkg}"` : '';
  const memberAttr = member ? ` member="${member}"` : '';

  // Only add label when it's meaningfully different from type
  const labelIsClassRef = /^Igx[A-Z]/.test(cleanLabel);
  const labelAttr = (!labelIsClassRef && cleanLabel && cleanLabel !== type) ? ` label="${cleanLabel}"` : '';

  return `<ApiLink${pkgAttr} type="${type}"${memberAttr}${labelAttr} />`;
}

// Main transform for a file's content
function transform(content, typeLookup) {
  // Two patterns for the class-based URL:
  //   WITH namespace:    classes/igniteui_angular_charts.igxcategorychartcomponent.html[#member]
  //   WITHOUT namespace: classes/igxpiechartcomponent.html[#member]
  // And enum-based:     enums/sparklinedisplaytype.html#member
  const envBase = '\\{environment:(?:dvApiBaseUrl|angularApiUrl)\\}/products/ignite-ui-angular/api/docs/typescript/latest';
  const withNs   = new RegExp(`\\[\`?([^\`\\]]*)\`?\\]\\(${envBase}/classes/([^./]+)\\.([^.#)]+)\\.html(?:#([^)]*))?\\)`, 'g');
  const withoutNs = new RegExp(`\\[\`?([^\`\\]]*)\`?\\]\\(${envBase}/classes/([^./\\s#)]+)\\.html(?:#([^)]*))?\\)`, 'g');
  const enumPat  = new RegExp(`\\[\`?([^\`\\]]*)\`?\\]\\(${envBase}/enums/([^./\\s#)]+)\\.html(?:#([^)]*))?\\)`, 'g');

  let result = content;
  let changed = false;
  const replacements = [];

  // WITH namespace
  for (const m of content.matchAll(withNs)) {
    const [full, label, namespace, cls, member] = m;
    const replacement = convertLink(label, namespace, cls, member || '', typeLookup);
    replacements.push([full, replacement]);
  }

  // WITHOUT namespace (guess pkg from context is hard; leave pkg blank — can be fixed manually)
  for (const m of content.matchAll(withoutNs)) {
    const [full, label, cls, member] = m;
    // Skip if already covered by withNs (namespace pattern would have matched)
    if (replacements.some(([f]) => f === full)) continue;
    const replacement = convertLink(label, '', cls, member || '', typeLookup);
    replacements.push([full, replacement]);
  }

  // ENUM links
  for (const m of content.matchAll(enumPat)) {
    const [full, label, enumName, member] = m;
    if (replacements.some(([f]) => f === full)) continue;
    const cleanLabel = stripBackticks(label);
    // For enum values, represent as member on the enum type
    let type = typeLookup.get(enumName.toLowerCase()) || (enumName.charAt(0).toUpperCase() + enumName.slice(1));
    const replacement = `<ApiLink type="${type}" member="${member || ''}" label="${cleanLabel}" />`;
    replacements.push([full, replacement]);
  }

  if (replacements.length === 0) return { content, changed: false, count: 0 };

  for (const [from, to] of replacements) {
    result = result.replaceAll(from, to);
  }

  // Add import if needed
  if (result !== content) {
    result = addApiLinkImport(result);
    changed = true;
  }

  return { content: result, changed, count: replacements.length };
}

// Collect files to process
function getFiles() {
  if (SPECIFIC) return [SPECIFIC];
  if (ALL) {
    const out = [];
    function walk(dir) {
      let entries;
      try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const e of entries) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.mdx')) out.push(p.replace(/\\/g, '/'));
      }
    }
    walk(DIR);
    return out;
  }
  // Default: branch-changed files
  try {
    return execSync(`git diff ${BASE}...HEAD --name-only -- "*.mdx"`, { encoding: 'utf8' })
      .trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

const typeLookup = buildTypeLookup();
console.log(`Type lookup: ${typeLookup.size} known types\n`);

const files = getFiles();
console.log(`Processing ${files.length} files...\n`);

let totalFixed = 0;
let totalFiles = 0;

for (const file of files) {
  let content;
  try { content = readFileSync(file, 'utf8'); } catch { continue; }

  const { content: newContent, changed, count } = transform(content, typeLookup);

  if (!changed) continue;

  totalFiles++;
  totalFixed += count;

  if (DRY_RUN) {
    console.log(`  [dry] ${file}: would convert ${count} link(s)`);
  } else {
    writeFileSync(file, newContent, 'utf8');
    console.log(`  ${file}: converted ${count} link(s)`);
  }
}

console.log(`\nDone: ${totalFixed} links converted in ${totalFiles} files${DRY_RUN ? ' (dry run)' : ''}.`);

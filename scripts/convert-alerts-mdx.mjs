#!/usr/bin/env node
/**
 * One-time codemod: convert GitHub/docFx alert blockquotes to Starlight <Aside> components.
 * Only targets .mdx files. .md files are left untouched.
 *
 * Type mapping:
 *   [!NOTE]      → <Aside type="note">
 *   [!TIP]       → <Aside type="tip">
 *   [!IMPORTANT] → <Aside type="note">
 *   [!WARNING]   → <Aside type="caution">
 *   [!CAUTION]   → <Aside type="danger">
 *
 * Usage:
 *   node scripts/convert-alerts-mdx.mjs            # apply changes
 *   node scripts/convert-alerts-mdx.mjs --dry-run  # preview without writing
 */

import fs from 'node:fs';
import path from 'node:path';

// ── Configuration ──────────────────────────────────────────────────────────

const TYPE_MAP = {
  note:      'note',
  tip:       'tip',
  important: 'note',
  warning:   'caution',
  caution:   'danger',
};

/** Extra attributes to append to the opening tag per mapped type. */
const TYPE_EXTRA_ATTRS = {
  caution: ' title="Warning"',
};

const STARLIGHT_PKG = '@astrojs/starlight/components';
const DOCS_ROOT     = path.resolve(process.cwd(), 'docs');
const DRY_RUN       = process.argv.includes('--dry-run');

// ── File collection ────────────────────────────────────────────────────────

function collectMdxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'generated') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMdxFiles(full));
    } else if (/\.mdx$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ── Alert detection & conversion ───────────────────────────────────────────

/** ( leading-indent ) >_ [!TYPE] or >_ \[!TYPE] ( remainder ) */
const ALERT_RE = /^(\s*)>\s*\\?\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)/i;

/** ( leading-indent ) > ( optional-space ) ( content ) */
const CONT_RE  = /^(\s*)>(\s?)(.*)/;

function mapType(raw) {
  return TYPE_MAP[raw.toLowerCase()] ?? 'note';
}

/**
 * Convert GFM alert blockquotes to <Aside> JSX blocks.
 * Returns { output, count } — count is the number of alerts converted.
 */
function convertAlerts(text) {
  const eol   = text.includes('\r\n') ? '\r\n' : '\n';
  const lines  = text.split(/\r?\n/);
  const out    = [];
  let count    = 0;

  let inAlert    = false;
  let alertIndent = '';
  let alertType   = '';
  let alertBody   = [];

  function flushAlert() {
    if (!inAlert) return;

    // Trim trailing blank lines from body
    while (alertBody.length && alertBody[alertBody.length - 1].trim() === '') {
      alertBody.pop();
    }

    const extraAttrs = TYPE_EXTRA_ATTRS[alertType] ?? '';
    out.push(`${alertIndent}<Aside type="${alertType}"${extraAttrs}>`);
    for (const bodyLine of alertBody) {
      out.push(bodyLine === '' ? '' : `${alertIndent}${bodyLine}`);
    }
    out.push(`${alertIndent}</Aside>`);
    count++;

    inAlert = false;
    alertBody = [];
  }

  for (const line of lines) {
    // ── New alert marker ─────────────────────────────────────────────────
    const alertMatch = line.match(ALERT_RE);
    if (alertMatch) {
      if (inAlert) {
        flushAlert();
        out.push(''); // blank line between consecutive alerts
      }

      alertIndent = alertMatch[1];
      alertType   = mapType(alertMatch[2]);
      inAlert     = true;
      alertBody   = [];

      // Inline content after the marker (e.g. `> [!Note]Text` or `>[!NOTE]> Text`)
      let remainder = alertMatch[3];
      if (remainder) {
        remainder = remainder.replace(/^>\s?/, ''); // strip `>[!NOTE]> ` pattern
        remainder = remainder.trimStart();
        if (remainder) alertBody.push(remainder);
      }
      continue;
    }

    // ── Inside an alert: blockquote continuation ─────────────────────────
    if (inAlert) {
      const contMatch = line.match(CONT_RE);
      if (contMatch && contMatch[1] === alertIndent) {
        alertBody.push(contMatch[3]);
        continue;
      }
      // End of alert block
      flushAlert();
    }

    out.push(line);
  }

  // Flush trailing alert at end of file
  flushAlert();

  return { output: out.join(eol), count };
}

// ── Import injection ───────────────────────────────────────────────────────

/**
 * Ensure `import { Aside } from '@astrojs/starlight/components'` is present.
 * - If an import from that package already exists, add Aside to it (sorted).
 * - Otherwise, insert a new import line immediately after the frontmatter.
 */
function injectImport(text) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';

  // Regex: import { ... } from '@astrojs/starlight/components' (single-line)
  const existingRe = new RegExp(
    `^(import\\s+\\{)([^}]+)(\\}\\s+from\\s+['"]${STARLIGHT_PKG.replace(/\//g, '\\/')}['"];?)`,
    'm'
  );

  const existingMatch = text.match(existingRe);

  if (existingMatch) {
    // Already imported from this package
    if (/\bAside\b/.test(existingMatch[2])) return text; // Aside already there

    // Merge Aside into existing named imports (alphabetical order)
    const names = ['Aside', ...existingMatch[2].split(',').map(s => s.trim()).filter(Boolean)];
    names.sort((a, b) => a.localeCompare(b));
    return text.replace(existingRe, `${existingMatch[1]} ${names.join(', ')} ${existingMatch[3]}`);
  }

  // No existing import from this package — insert after frontmatter
  const importLine = `import { Aside } from '${STARLIGHT_PKG}';`;

  // Match YAML frontmatter: starts at position 0 with --- ... ---
  const fmMatch = text.match(/^---[\r\n][\s\S]*?^---[ \t]*(\r?\n)/m);
  if (fmMatch) {
    const insertAt = fmMatch.index + fmMatch[0].length;
    return text.slice(0, insertAt) + importLine + eol + text.slice(insertAt);
  }

  // No frontmatter — prepend
  return importLine + eol + text;
}

// ── Main ───────────────────────────────────────────────────────────────────

console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Scanning ${DOCS_ROOT} for .mdx files...\n`);

const files = collectMdxFiles(DOCS_ROOT);
let totalConverted = 0;
let filesModified  = 0;

for (const filePath of files) {
  const original = fs.readFileSync(filePath, 'utf-8');
  const { output: converted, count } = convertAlerts(original);

  if (count > 0) {
    const final = injectImport(converted);
    totalConverted += count;
    filesModified++;

    const rel = path.relative(process.cwd(), filePath);
    console.log(`  ${rel}  (${count} alert${count > 1 ? 's' : ''})`);

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, final, 'utf-8');
    }
  }
}

console.log(
  `\n${DRY_RUN ? '[DRY RUN] ' : ''}Done — converted ${totalConverted} alert(s) across ${filesModified} .mdx file(s).`
);

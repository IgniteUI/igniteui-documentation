#!/usr/bin/env node
/**
 * CI runner for check-relative-links.mjs
 * Runs both --platform=xplat and --platform=angular unconditionally,
 * collects results, prints summary, then exits 1 if either had broken links.
 * Supports --md=<path> to write a combined markdown report.
 */
import { spawnSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';

const DIVIDER = '═'.repeat(72);

const mdArg = process.argv.find(a => a.startsWith('--md='));
const mdPath = mdArg ? mdArg.slice(5) : null;

function run(args) {
    const result = spawnSync('node', ['scripts/check-relative-links.mjs', ...args], {
        encoding: 'utf8',
        shell: false,
    });
    return { output: (result.stdout ?? '') + (result.stderr ?? ''), code: result.status ?? 1 };
}

// Full detail pass (always run both)
const xplat   = run(['--platform=xplat']);
const angular = run(['--platform=angular']);

// Print all output together
process.stdout.write(xplat.output);
process.stdout.write(angular.output);

// Summary pass
const xplatSummary   = run(['--platform=xplat',   '--summary']);
const angularSummary = run(['--platform=angular', '--summary']);

console.log('');
console.log(DIVIDER);
console.log('  SUMMARY');
console.log(DIVIDER);
process.stdout.write(xplatSummary.output);
process.stdout.write(angularSummary.output);
console.log('');

// Combined markdown report: collect broken links from both platforms and write once
if (mdPath) {
    const tmpXplat   = `${mdPath}.xplat.tmp`;
    const tmpAngular = `${mdPath}.angular.tmp`;
    run(['--platform=xplat',   `--md=${tmpXplat}`]);
    run(['--platform=angular', `--md=${tmpAngular}`]);

    // Parse table rows from each report (lines starting with "| `docs/")
    const rowRe = /^\| `[^`]+` \| \d+ \| `[^`]+` \| [^\n]+$/gm;
    const xplatMd   = existsSync(tmpXplat)   ? readFileSync(tmpXplat,   'utf8') : '';
    const angularMd = existsSync(tmpAngular) ? readFileSync(tmpAngular, 'utf8') : '';
    const allRows   = [...(xplatMd.match(rowRe) ?? []), ...(angularMd.match(rowRe) ?? [])];

    // Count totals from summary lines
    const scanned = (xplatMd.match(/\| Files scanned \| (\d+)/) ?? [])[1] ?? '?';
    const linksX  = parseInt((xplatMd.match(/\| Relative links \| (\d+)/) ?? [])[1] ?? '0');
    const linksA  = parseInt((angularMd.match(/\| Relative links \| (\d+)/) ?? [])[1] ?? '0');
    const totalLinks = linksX + linksA;

    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const lines = [
        '# Relative Link Check Report', '',
        `_Generated: ${ts}_`, '',
        '## Summary', '',
        '| | |', '|---|---|',
        `| Files scanned | ${scanned} |`,
        `| Relative links | ${totalLinks} |`,
        `| ✅ OK | ${totalLinks - allRows.length} |`,
        `| ❌ **Broken** | **${allRows.length}** |`, '',
    ];

    if (allRows.length > 0) {
        lines.push('## Broken Links', '');
        lines.push('| File | Line | href | Issue |');
        lines.push('|---|---:|---|---|');
        lines.push(...allRows, '');
    }

    writeFileSync(mdPath, lines.join('\n'));
    console.log(`\n  Markdown report written to: ${mdPath}\n`);

    if (existsSync(tmpXplat))   unlinkSync(tmpXplat);
    if (existsSync(tmpAngular)) unlinkSync(tmpAngular);
}

process.exit(xplat.code + angular.code > 0 ? 1 : 0);


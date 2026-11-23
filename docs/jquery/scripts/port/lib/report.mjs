/**
 * The run's report: per step, what it handled (counts) and what it could not decide (grouped by
 * reason, with a count and examples), plus the per-topic result.
 */
import fs from 'node:fs';
import path from 'node:path';

export function writeReports(dir, { report, perTopic, tokens, selected, total, steps }) {
    const summary = {};
    for (const step of steps) {
        const s = report[step];
        const groups = {};
        for (const item of s.undecided) {
            const g = (groups[item.reason] ??= { count: 0, topics: new Set(), examples: [] });
            g.count++;
            g.topics.add(item.topic);
            if (g.examples.length < 5) g.examples.push(`${item.topic}${item.line ? `:${item.line}` : ''}${item.detail ? ` — ${item.detail}` : ''}`);
        }
        summary[step] = {
            handled: Object.fromEntries(Object.entries(s.handled).sort(([a], [b]) => a.localeCompare(b))),
            undecided: Object.fromEntries(Object.entries(groups).sort((a, b) => b[1].count - a[1].count)
                .map(([reason, g]) => [reason, { count: g.count, topics: g.topics.size, examples: g.examples }])),
        };
    }
    summary.html.jsxElements = report.html.jsxElements;
    summary.html.tables = report.html.tables;
    summary.html.droppedLinkAttributes = report.html.droppedLinkAttributes;
    summary.html.unknownTags = report.html.unknownTags;
    summary.parse.inlineMarkdownInHtml = { rendered: report.parse.inlineRendered, skipped: report.parse.inlineSkipped };
    const tokenSummary = {
        text: tokens.replacedText,
        environmentKeys: tokens.replacedEnv,
        literalUrlsInCode: tokens.replacedLiteralUrl,
        noValue: tokens.noValue.reduce((acc, t) => { acc[t.token] = (acc[t.token] ?? 0) + 1; return acc; }, {}),
    };
    const out = { topicsInSet: total, topicsConverted: selected, compile: { ok: perTopic.filter(t => t.compiles).length, failed: perTopic.filter(t => t.compiles === false).length, converterErrors: perTopic.filter(t => t.converted === false).length }, steps: summary, tokens: tokenSummary, topics: perTopic };
    fs.writeFileSync(path.join(dir, 'report.json'), `${JSON.stringify(out, null, 2)}\n`);
    fs.writeFileSync(path.join(dir, 'undecided.json'), `${JSON.stringify(Object.fromEntries(steps.map(s => [s, report[s].undecided])), null, 2)}\n`);

    // A Markdown table cell: the backslash first, so that the escape of `|` is not itself escaped.
    const cell = text => String(text).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');

    const md = [];
    md.push(`# jQuery topic port: run report`, '');
    md.push(`Topics converted: ${selected} of ${total}. Compile with both compilers: ${out.compile.ok}; fail: ${out.compile.failed}; converter errors: ${out.compile.converterErrors}.`, '');
    for (const step of steps) {
        const s = summary[step];
        md.push(`## ${step}`, '');
        const handled = Object.entries(s.handled);
        if (handled.length) {
            md.push('| Handled | Count |', '|---|---:|');
            for (const [k, v] of handled) md.push(`| ${cell(k)} | ${v} |`);
            md.push('');
        }
        const undecidedEntries = Object.entries(s.undecided);
        if (undecidedEntries.length) {
            md.push('| Not decided | Count | Topics | Example |', '|---|---:|---:|---|');
            for (const [k, v] of undecidedEntries) md.push(`| ${cell(k)} | ${v.count} | ${v.topics} | ${cell(String(v.examples[0] ?? '').slice(0, 160))} |`);
            md.push('');
        }
    }
    md.push('## tokens', '', '```json', JSON.stringify(tokenSummary, null, 2), '```', '');
    md.push('## html details', '', '```json', JSON.stringify({ jsxElements: summary.html.jsxElements, tables: summary.html.tables, droppedLinkAttributes: summary.html.droppedLinkAttributes, unknownTags: summary.html.unknownTags, inlineMarkdownInHtml: summary.parse.inlineMarkdownInHtml }, null, 2), '```', '');
    fs.writeFileSync(path.join(dir, 'report.md'), `${md.join('\n')}\n`);
}

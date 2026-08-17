#!/usr/bin/env node
/**
 * The published pages this branch would change, for one platform, as a diff you can read.
 *
 * A topic is authored once now and emitted per platform, where before each platform's code was
 * written out by hand. That is not a change you can review by reading the source: the source is
 * smaller than what it replaced, and the question a reviewer actually has is whether the page a
 * reader ends up with still says what it did. So this generates both — the branch and whatever it is
 * branched from — and diffs the output.
 *
 * Some of the difference is meant. Hand written per platform code drifted: a property named for one
 * platform in another's block, a stale API name, an import list missing a type. Collapsing to one
 * definition fixed those by construction, so a hunk that removes something is not automatically a
 * regression, and no ranking here can tell you which is which. What it can do is put the hunks in
 * front of you sorted by how much they change, and separate the classes of change that need
 * different judgement:
 *
 *   comment      a comment line the authored block carried and the emitted one does not. Interleaved
 *                explanation is the one thing the collapse genuinely drops rather than corrects,
 *                which is why it is counted on its own.
 *   code         inside a fence: the emitted code differs from what was written by hand.
 *   prose        outside a fence: wording, API terms, PlatformBlock gating.
 *
 * Usage:
 *   node scripts/review-platform-diff.mjs --platform=WebComponents [--lang=en]
 *        [--baseline=origin/vnext] [--out=<dir>] [--reuse] [--html]
 *
 * --reuse skips regenerating when output is already on disk, which is what you want while iterating
 * on the report itself. --html writes a single page with every diff in it.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const arg = (flag, fallback = null) => {
    const hit = process.argv.find(a => a.startsWith(flag));
    return hit ? hit.slice(flag.length) : fallback;
};
const has = flag => process.argv.includes(flag);

const PLATFORM = arg('--platform=', 'WebComponents');
const LANG = arg('--lang=', 'en');
const BASELINE = arg('--baseline=', 'origin/vnext');
const REUSE = has('--reuse');
const WANT_HTML = has('--html') || arg('--out=') !== null;

const XPLAT = path.resolve(import.meta.dirname, '..');
const REPO = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: XPLAT, encoding: 'utf8' }).trim();
const WORK = process.env.IG_REVIEW_DIR ?? path.join(process.env.TMPDIR ?? '/tmp', 'ig-platform-review');
const BASE_TREE = path.join(WORK, 'baseline');
const OUT = arg('--out=', path.join(WORK, `report-${PLATFORM}-${LANG}`));

const run = (cmd, args, cwd, allowFail = false) => {
    try {
        return execFileSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
        if (allowFail) return e.stdout ?? '';
        throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd}:\n${e.stderr ?? e.message}`);
    }
};

/**
 * A checkout of the baseline, reused across runs.
 *
 * Detached on purpose: the ref moves, and a review pinned to whatever it pointed at last week is a
 * review of the wrong thing. Re-pointing an existing worktree is cheaper than making a new one, and
 * keeps the generated output from the previous run available to --reuse.
 */
function baselineTree() {
    const want = run('git', ['rev-parse', BASELINE], REPO).trim();
    if (existsSync(path.join(BASE_TREE, '.git'))) {
        const at = run('git', ['rev-parse', 'HEAD'], BASE_TREE).trim();
        if (at !== want) {
            console.log(`[review] baseline worktree ${at.slice(0, 9)} -> ${want.slice(0, 9)}`);
            run('git', ['checkout', '--detach', want], BASE_TREE);
            rmSync(path.join(BASE_TREE, 'docs/xplat/generated'), { recursive: true, force: true });
        }
        return;
    }
    mkdirSync(WORK, { recursive: true });
    rmSync(BASE_TREE, { recursive: true, force: true });
    run('git', ['worktree', 'prune'], REPO);
    run('git', ['worktree', 'add', '-f', '--detach', BASE_TREE, want], REPO);
    console.log(`[review] baseline worktree at ${want.slice(0, 9)} (${BASELINE})`);
}

function generate(root, label) {
    const out = path.join(root, 'generated', PLATFORM, LANG);
    if (REUSE && existsSync(out) && readdirSync(out).length) {
        console.log(`[review] ${label}: reusing ${out}`);
        return out;
    }
    console.log(`[review] ${label}: generating ${PLATFORM}/${LANG}...`);
    // Not allowFail: a baseline that cannot generate makes every topic look deleted, which reads as
    // a catastrophic diff rather than as the tooling problem it is.
    run('node', ['scripts/generate.mjs', `--platform=${PLATFORM}`, `--lang=${LANG}`], root);
    if (!existsSync(out)) throw new Error(`${label} generated no ${PLATFORM}/${LANG} output`);
    return out;
}

const walk = (dir, base = dir, into = []) => {
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) walk(full, base, into);
        else if (entry.endsWith('.mdx')) into.push(path.relative(base, full));
    }
    return into;
};

/** A unified diff of two files, via git so the hunk headers are the ones a reviewer knows. */
function diffOf(a, b) {
    const out = run('git', ['diff', '--no-index', '--unified=3', '--no-color', '--', a, b], REPO, true);
    return out.split('\n').filter(l => !/^(diff --git|index |--- |\+\+\+ )/.test(l)).join('\n').trim();
}

const COMMENT = /^\s*(\/\/|<!--|#|'|\/\*|\*\s)/;

/**
 * Frontmatter this branch added for the build's own benefit.
 *
 * `apiTerms` tells the transform how to treat the page's code spans and means nothing once the page
 * is transformed, but frontmatter rides through to the output here -- as `mentionedTypes` and
 * `namespace` always have -- so it lands in every generated page and every page therefore differs.
 * A diff where that is the only change is not a change to the page, and left in the pile it hides
 * the ones that are: it turned 339 of 339 topics into "changed".
 *
 * Set aside rather than hidden. They are still counted and still listed, because the day one of
 * these lines is wrong is the day you want to see it.
 */
const DIRECTIVE_LINE = /^[+-]\s*(apiTerms):/;

/**
 * What kind of change a diff holds, counted per line.
 *
 * Fence tracking is by line rather than by parsing the MDX: a hunk is a fragment, so its fences are
 * usually unbalanced and any real parse would be guessing. Counting a ``` as a toggle from the
 * hunk's own start is wrong at the edges and right in the middle, which is where the lines are.
 */
/**
 * @param diff  the unified diff
 * @param after the whole new file, so a comment that merely moved is not counted as lost.
 *
 * Without `after` this overstates the loss badly. Emitted code is laid out differently from the hand
 * written block it replaces -- a handler that was inlined is now emitted as its own fence, so its
 * body shifts -- and the diff shows every line of it as removed and re-added. The comments inside it
 * are still on the page. Only a comment whose text appears nowhere in the new file is lost.
 */
function classify(diff, after = null) {
    const c = { comment: 0, code: 0, prose: 0, added: 0, removed: 0, directive: 0, lostComments: [] };
    let inFence = false;
    for (const line of diff.split('\n')) {
        if (/^@@/.test(line)) { inFence = false; continue; }
        const body = line.slice(1);
        if (/^\s*```/.test(body)) { inFence = !inFence; }
        if (!line.startsWith('+') && !line.startsWith('-')) continue;
        if (line.startsWith('+')) c.added++; else c.removed++;
        if (DIRECTIVE_LINE.test(line)) { c.directive++; continue; }
        if (COMMENT.test(body) && body.trim().length > 3) {
            c.comment++;
            // The audit: what the authored block explained and the emitted one does not.
            const text = body.trim();
            if (line.startsWith('-') && !(after ?? '').includes(text)) c.lostComments.push(text);
        } else if (inFence) c.code++;
        else c.prose++;
    }
    return c;
}

/** Whether a diff changes nothing but build directives. */
const directiveOnly = c => c.directive > 0 && c.comment + c.code + c.prose === 0;

baselineTree();
const baseOut = generate(path.join(BASE_TREE, 'docs/xplat'), 'baseline');
const headOut = generate(XPLAT, 'branch');

const baseFiles = new Set(walk(baseOut));
const headFiles = new Set(walk(headOut));

const rows = [];
for (const rel of new Set([...baseFiles, ...headFiles])) {
    const inBase = baseFiles.has(rel), inHead = headFiles.has(rel);
    if (inBase && !inHead) { rows.push({ rel, status: 'removed', counts: classify(''), diff: '' }); continue; }
    if (!inBase && inHead) { rows.push({ rel, status: 'added', counts: classify(''), diff: '' }); continue; }
    const a = path.join(baseOut, rel), b = path.join(headOut, rel);
    if (readFileSync(a, 'utf8') === readFileSync(b, 'utf8')) { rows.push({ rel, status: 'same' }); continue; }
    const diff = diffOf(a, b);
    const counts = classify(diff, readFileSync(b, 'utf8'));
    rows.push({ rel, status: directiveOnly(counts) ? 'directive-only' : 'changed', counts, diff });
}

const changed = rows.filter(r => r.status === 'changed');
const directives = rows.filter(r => r.status === 'directive-only');
const totals = changed.reduce((t, r) => {
    for (const k of ['comment', 'code', 'prose', 'added', 'removed']) t[k] += r.counts[k];
    return t;
}, { comment: 0, code: 0, prose: 0, added: 0, removed: 0 });

// Biggest first: a reviewer reading top down meets the pages that changed most while their attention
// is freshest, and the tail is mostly one-line API term renames.
changed.sort((x, y) => (y.counts.added + y.counts.removed) - (x.counts.added + x.counts.removed));

const lostByTopic = changed.filter(r => r.counts.lostComments.length)
    .sort((x, y) => y.counts.lostComments.length - x.counts.lostComments.length);
const lostTotal = lostByTopic.reduce((n, r) => n + r.counts.lostComments.length, 0);

console.log(`\n[review] ${PLATFORM}/${LANG} vs ${BASELINE}`);
console.log(`  topics: ${rows.length}  changed ${changed.length}`
    + `  identical ${rows.filter(r => r.status === 'same').length}`
    + `  directive-only ${directives.length}`
    + `  added ${rows.filter(r => r.status === 'added').length}`
    + `  removed ${rows.filter(r => r.status === 'removed').length}`);
console.log(`  lines: +${totals.added} -${totals.removed}`
    + `   (code ${totals.code}, prose ${totals.prose}, comment ${totals.comment})`);
console.log(`\n  most changed:`);
for (const r of changed.slice(0, 12)) {
    console.log(`    +${String(r.counts.added).padStart(4)} -${String(r.counts.removed).padStart(4)}`
        + `  c:${String(r.counts.comment).padStart(3)}  ${r.rel}`);
}
console.log(`\n  comments the emitted page no longer carries: ${lostTotal} across ${lostByTopic.length} topics`);
for (const r of lostByTopic.slice(0, 10)) {
    console.log(`    ${String(r.counts.lostComments.length).padStart(3)}  ${r.rel}`);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify({
    platform: PLATFORM, lang: LANG, baseline: BASELINE,
    baselineCommit: run('git', ['rev-parse', 'HEAD'], BASE_TREE).trim(),
    branchCommit: run('git', ['rev-parse', 'HEAD'], REPO).trim(),
    totals, topics: rows.map(({ rel, status, counts }) => ({ rel, status, counts })),
}, null, 2));

// One file holding every hunk, for grepping and for feeding a review by hand.
writeFileSync(path.join(OUT, `${PLATFORM}-${LANG}.diff`),
    changed.map(r => `=== ${r.rel}\n${r.diff}`).join('\n\n'));

// The audit on its own, so it can be worked through without the diffs around it.
writeFileSync(path.join(OUT, 'lost-comments.json'), JSON.stringify(
    lostByTopic.map(r => ({ topic: r.rel, comments: r.counts.lostComments })), null, 2));

if (WANT_HTML) {
    writeFileSync(path.join(OUT, 'index.html'), html({ rows, changed, directives, totals, lostByTopic, lostTotal }));
}
console.log(`\n  written to ${OUT}`);

function esc(s) {
    return s.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]);
}

/**
 * The report as one page.
 *
 * Ordered by what needs a decision rather than by what is biggest: the comments the emitted page no
 * longer carries come first, because each one is a judgement — restore it as a `$comment`, move it
 * into the handler source, or accept the loss — and there are few enough to work through. The diffs
 * follow, and the directive-only list sits at the end as evidence rather than as reading.
 */
function html({ rows, changed, directives, totals, lostByTopic, lostTotal }) {
    const baseCommit = run('git', ['rev-parse', '--short', 'HEAD'], BASE_TREE).trim();
    const headCommit = run('git', ['rev-parse', '--short', 'HEAD'], REPO).trim();
    const same = rows.filter(r => r.status === 'same').length;
    const added = rows.filter(r => r.status === 'added').map(r => r.rel);
    const removed = rows.filter(r => r.status === 'removed').map(r => r.rel);

    const diffBody = changed.map((r, i) => {
        const lines = r.diff.split('\n').map(l => {
            const cls = l.startsWith('+') ? 'add' : l.startsWith('-') ? 'del' : /^@@/.test(l) ? 'hunk' : 'ctx';
            return `<div class="l ${cls}">${esc(l) || '&nbsp;'}</div>`;
        }).join('');
        return `<details class="row${r.counts.comment ? ' flag' : ''}"${i < 2 ? ' open' : ''}>
<summary><span class="path">${esc(r.rel)}</span>
<span class="tags"><span class="t add">+${r.counts.added}</span><span class="t del">&minus;${r.counts.removed}</span>${
    r.counts.comment ? `<span class="t cmt">${r.counts.comment} comment</span>` : ''}${
    r.counts.code ? `<span class="t neutral">${r.counts.code} code</span>` : ''}${
    r.counts.prose ? `<span class="t neutral">${r.counts.prose} prose</span>` : ''}</span></summary>
<div class="scroll">${lines}</div></details>`;
    }).join('\n');

    const auditBody = lostByTopic.map(r => `<details class="row flag">
<summary><span class="path">${esc(r.rel)}</span>
<span class="tags"><span class="t cmt">${r.counts.lostComments.length} lost</span></span></summary>
<div class="scroll">${r.counts.lostComments.map(c => `<div class="l del">${esc(c)}</div>`).join('')}</div>
</details>`).join('\n');

    const plainList = (title, items) => items.length
        ? `<section><h2>${title}<span class="count">${items.length}</span></h2>
<ul class="plain">${items.map(p => `<li>${esc(p)}</li>`).join('')}</ul></section>` : '';

    return `<title>${PLATFORM} ${LANG} · published page review</title>
<style>
:root{
  --ground:#f6f7f9; --surface:#ffffff; --ink:#16191f; --muted:#5f6771; --rule:#dfe3e8;
  --accent:#0e6b6b; --accent-soft:#e2efee;
  --add-fg:#1f6f43; --add-bg:#e8f4ec; --del-fg:#a12a2a; --del-bg:#fbeaea;
  --hunk-fg:#4a5260; --hunk-bg:#eceff3;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#14171c; --surface:#1b1f26; --ink:#e8eaed; --muted:#9aa3af; --rule:#2b313a;
    --accent:#5ec8c2; --accent-soft:#16302f;
    --add-fg:#7fd6a0; --add-bg:#14291d; --del-fg:#f0a3a3; --del-bg:#2d1718;
    --hunk-fg:#93a0b1; --hunk-bg:#222831;
  }
}
:root[data-theme="dark"]{
  --ground:#14171c; --surface:#1b1f26; --ink:#e8eaed; --muted:#9aa3af; --rule:#2b313a;
  --accent:#5ec8c2; --accent-soft:#16302f;
  --add-fg:#7fd6a0; --add-bg:#14291d; --del-fg:#f0a3a3; --del-bg:#2d1718;
  --hunk-fg:#93a0b1; --hunk-bg:#222831;
}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);
  font:15px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  font-variant-numeric:tabular-nums}
.wrap{max-width:1180px;margin:0 auto;padding:2.5rem 1.25rem 6rem;display:flex;flex-direction:column;gap:2.25rem}
.eyebrow{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);
  font-weight:650;margin:0 0 .4rem}
h1{font-size:1.75rem;line-height:1.2;letter-spacing:-.02em;margin:0;text-wrap:balance}
.lede{color:var(--muted);margin:.4rem 0 0;font-size:.92rem}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.86em}
.bar{position:sticky;top:0;z-index:5;background:var(--ground);border-bottom:1px solid var(--rule);
  display:flex;flex-wrap:wrap;gap:1.5rem;padding:.85rem 0;margin:0}
.metric{display:flex;flex-direction:column;gap:.1rem}
.metric b{font-size:1.15rem;font-weight:650;letter-spacing:-.02em;line-height:1}
.metric span{font-size:.68rem;text-transform:uppercase;letter-spacing:.09em;color:var(--muted)}
.metric.key b{color:var(--accent)}
h2{font-size:.78rem;text-transform:uppercase;letter-spacing:.11em;color:var(--muted);
  font-weight:650;margin:0 0 .75rem;display:flex;align-items:center;gap:.5rem}
h2 .count{background:var(--rule);color:var(--ink);border-radius:99px;padding:.05rem .45rem;
  font-size:.72rem;letter-spacing:0}
section{display:flex;flex-direction:column}
.note{border-left:2px solid var(--accent);background:var(--accent-soft);color:var(--ink);
  padding:.75rem 1rem;font-size:.88rem;margin:0 0 1rem;max-width:68ch}
.note p{margin:0 0 .5rem} .note p:last-child{margin:0}
.rows{display:flex;flex-direction:column;gap:.4rem}
.row{background:var(--surface);border:1px solid var(--rule);border-radius:6px;overflow:hidden;
  border-left:3px solid transparent}
.row.flag{border-left-color:var(--accent)}
.row summary{cursor:pointer;padding:.6rem .8rem;display:flex;flex-wrap:wrap;gap:.75rem;
  align-items:center;justify-content:space-between;list-style:none}
.row summary::-webkit-details-marker{display:none}
.row summary:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.path{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem;word-break:break-all}
.tags{display:flex;gap:.3rem;flex-wrap:wrap}
.t{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.7rem;padding:.1rem .4rem;
  border-radius:3px;white-space:nowrap}
.t.add{background:var(--add-bg);color:var(--add-fg)}
.t.del{background:var(--del-bg);color:var(--del-fg)}
.t.cmt{background:var(--accent-soft);color:var(--accent)}
.t.neutral{background:var(--hunk-bg);color:var(--hunk-fg)}
.scroll{border-top:1px solid var(--rule);overflow-x:auto;background:var(--ground)}
.l{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.5;
  white-space:pre;padding:0 .8rem;min-width:max-content}
.l.add{background:var(--add-bg);color:var(--add-fg)}
.l.del{background:var(--del-bg);color:var(--del-fg)}
.l.hunk{background:var(--hunk-bg);color:var(--hunk-fg)}
.plain{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.78rem;line-height:1.8;
  color:var(--muted);margin:0;padding-left:1.15rem;columns:2;column-gap:2rem}
@media (max-width:640px){.plain{columns:1}}
</style>
<div class="wrap">
<header>
<p class="eyebrow">Published page review</p>
<h1>${PLATFORM} · ${LANG}</h1>
<p class="lede">What this branch changes in the pages a reader gets.
<span class="mono">${esc(BASELINE)}</span> (<span class="mono">${baseCommit}</span>)
→ this branch (<span class="mono">${headCommit}</span>).</p>
</header>

<div class="bar">
<div class="metric"><b>${changed.length}</b><span>changed</span></div>
<div class="metric"><b>${same}</b><span>identical</span></div>
<div class="metric"><b>${directives.length}</b><span>directive only</span></div>
<div class="metric"><b>${added.length}</b><span>added</span></div>
<div class="metric"><b>${removed.length}</b><span>removed</span></div>
<div class="metric"><b>+${totals.added} &minus;${totals.removed}</b><span>lines</span></div>
<div class="metric key"><b>${lostTotal}</b><span>comments lost</span></div>
</div>

${lostTotal ? `<section>
<h2>Comments the page no longer carries<span class="count">${lostTotal}</span></h2>
<div class="note">
<p>Each of these is a decision. A comment explaining code <em>inside a handler</em> belongs in that
handler's source in the examples checkout, where it is emitted with the code. One explaining
<em>generated</em> code has no such home and needs a <span class="mono">$comment</span> on the element
it describes. An elision marker is already covered by the <span class="mono">...</span> delimiter
between channel names. Some are simply obsolete.</p>
</div>
<div class="rows">${auditBody}</div>
</section>` : ''}

<section>
<h2>Diffs<span class="count">${changed.length}</span></h2>
<div class="note">
<p>Largest first. A removed line is not automatically a regression — the hand written per platform
blocks had drifted, and collapsing them to one definition corrected that by construction. Rows with a
comment count are marked.</p>
</div>
<div class="rows">${diffBody}</div>
</section>

${plainList('Added', added)}
${plainList('Removed', removed)}
${plainList('Directive only — the apiTerms line and nothing else', directives.map(r => r.rel))}
</div>`;
}

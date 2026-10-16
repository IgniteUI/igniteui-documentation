---
name: translate
description: >-
  Translate the English documentation pages changed on the current branch into Japanese (jp/),
  Korean (kr/), Spanish (es/) and Brazilian Portuguese (pt-br/) with the repository's translation
  engine (tools/translate-engine). The engine's prompts are answered by subagents of this Claude
  Code session - on the author's own seat, no API key - and every result is scored by Sonnet
  subagents acting as the judge. Use when someone asks to translate, localize or update the
  translations of the EN pages they changed, or types /translate [--locale ja,kr,es,pt-br]
  [--model opus|sonnet]. Costs seat usage: roughly 150-200k tokens per page and locale translated
  with Opus and ~100k per page and locale judged. For pages that did not change on the branch use
  the companion translate-all skill; to replace existing translations from scratch use
  retranslate; to see what still needs translation use translate-list.
---

# Translate changed pages

Runs the vendored translation engine over the EN pages this branch changed, with the model work
done by subagents of this session. The engine does everything else - masking code, JSX and
component names, frontmatter contract, translation memory, splicing changed blocks into existing
translations, the deterministic validator, the judge prompts. Background, design and residuals:
[`TRANSLATION.md`](../../../TRANSLATION.md).

## Ground rules

- Work from the repository root. Helper scripts: `.claude/skills/translate/scripts/`, written
  `$S` below - spell the path out in each command (shell variables do not persist between
  commands). `<run>` is the run id `plan.mjs` prints; `latest` also works. Every script prints the
  exact next command.
- **Never commit, never stage (`git add`), never push.** Everything stays an uncommitted change
  for the author to review.
- **Never edit an EN page.** Never delete a translation; report deleted/renamed EN pages instead.
- No API keys are involved. Translation subagents use the model the user chose (default
  **opus**); judge subagents are **always sonnet**, whatever the translation model.
- Exit code 2 from the engine is normal (validator findings); the scripts handle it.
- If `tools/translate-engine/node_modules` is missing, run `npm ci --prefix tools/translate-engine`
  first (one time).

## Arguments

- `--locale ja,kr,es,pt-br` - subset of locales (default all four; `jp` is accepted for `ja`).
- `--model opus|sonnet` - the TRANSLATION subagents' model (default `opus`). With `sonnet` the
  engine warns that translator and judge are the same model - say so in the summary.
- `--base <ref>` - branch to diff against (default `vnext`; use `origin/vnext` if local `vnext`
  is behind).
- `--tree xplat|angular` - one content tree only.

## Seat usage - check before answering anything

Roughly **150-200k harness-reported tokens per page and locale translated** with Opus and **~100k
per page and locale judged** (measured: ~160k and ~80k, `MODEL-EVALUATION.md` §7 exp. 4 of the
engine). One EN page in all four locales is therefore ~1.1M tokens. A sync that splices a few
changed blocks into an existing translation costs a fraction of that. `plan.mjs` prints an
estimate; when it says "ABOVE the confirmation threshold" (more than a handful of page-locale
pairs), stop and ask the user to confirm or narrow `--locale` / `--tree` before step 3.

## Steps

### 1. Plan

```bash
node $S/plan.mjs changed [--locale ...] [--model ...] [--base vnext]
```

Detects EN pages changed since the merge base with `vnext` (committed on the branch, staged,
unstaged and untracked) in `docs/xplat/src/content/en` and `docs/angular/src/content/en`, and
decides per page and locale:

- `translate` - no translation yet (new page, or a locale that has none);
- `sync --base <merge base>` - an existing unstamped (human) translation: only the blocks
  changed since the merge base are re-translated, the rest is kept byte-for-byte;
- `sync --base-file` - a stamped (machine) translation: spliced against the exact EN it was made
  from, recovered from git by the stamp's blob id;
- skipped - not linked from any TOC (the jp-sync workflows skip those too; `--include-non-toc`
  overrides), already current, or EN unchanged vs the merge base.

Show the user the plan. Mention renamed/deleted EN pages and the translations left behind (do not
delete them). Items marked WARNING overwrite an existing translation - confirm first. If `ja` is in
scope, remind the user that the repository's jp-sync GitHub workflow also translates EN changes to
`jp/` after they merge to `vnext` (see TRANSLATION.md); they may prefer `--locale kr,es,pt-br`.

### 2. Record

```bash
node $S/run.mjs --run <run> --step record
```

A dry run with `EXCHANGE_MODE=record`: the engine writes every prompt it will need into
`tools/translate-engine/data/runs/<run>/exchange/translate/` and writes no content. Items that
**ABORT** ("structures diverged") are existing translations whose block structure does not line
up with the EN page - common for human `jp/` pages. Tell the user and ask per item: leave it (the
default; the jp-sync workflow or a human updates it), or translate it in full, which OVERWRITES the
existing translation:

```bash
node $S/plan.mjs set --run <run> --item <tree:locale:rel> --action translate
node $S/run.mjs --run <run> --step record --only <tree:locale:rel>
```

The engine's raw view of the prompts is
`npx --prefix tools/translate-engine tsx tools/translate-engine/scripts/exchange-pending.ts --dir tools/translate-engine/data/runs/<run>/exchange/translate`;
`dispatch.mjs` (next step) is the same list attributed to plan items, grouped into tasks.

### 3. Answer (translation subagents)

```bash
node $S/dispatch.mjs --run <run> --role translate
```

Prints one block per subagent task: kind, model, the pages it serves, and the **exact instruction
text**. One subagent per page body; up to three JSON batches (or three one-line strings) per
subagent. Prompts whose source is only placeholder tokens or one code identifier are answered by
the script itself with their own source text (that is what a model returns for them).

For every task, spawn an Agent with `model` set to the task's model (the user's choice: `opus`
or `sonnet`) and the instruction text **verbatim** as its prompt. Launch them in parallel - several
Agent calls in one message, at most 8 at a time, in the background - and wait for all to reply.
Then check the answers before the engine reads them:

```bash
node $S/dispatch.mjs --run <run> --role translate --check
```

For any BAD answer (dropped placeholder token, untranslated value, label or fence, broken JSON):
`--check --reset-bad` sets it aside, then list again and give each such task to a **fresh**
subagent. Repeat until the check is clean.

### 4. Replay

```bash
node $S/run.mjs --run <run> --step replay
```

The real run: the engine reads the answers back, restores the masked markup, validates and writes
the files. The runner refuses to replay a page whose recorded prompts are not all answered (the
engine would otherwise invent prompts nobody recorded), and resets the translation memory to the
run start before each page so the replay asks exactly what the record pass asked. After the
replay:

- `pending` - the engine asked something new (a batch value came back unchanged and is re-asked
  alone, and so on): run step 3 again (only the new prompts are listed), then replay again.
- `engine asked for a retry: <hash>@N` - an answer was unusable (e.g. a dropped token) and the
  engine asks the same prompt again; dispatch shows it as a RETRY task writing
  `<hash>.answer-N.txt`. Give it to a fresh subagent, check, replay (the runner re-runs exactly
  those pages).
- `written-errors` - written, with validator findings (see step 6).
- `BLOCKED` - the runner refused to overwrite a file: it changed after this run wrote it (fix
  edits, the stamp), or it is a `/retranslate` target with someone's uncommitted changes. Tell the
  user; `--force` overrides only on their word.

Stop after three replay rounds that still leave pending prompts and report to the user.

### 5. Judge (Sonnet subagents, always)

```bash
node $S/run.mjs --run <run> --step judge        # writes the judge prompts (all "judge-pending")
node $S/dispatch.mjs --run <run> --role judge   # tasks, always model: sonnet
# spawn the Sonnet subagents as in step 3, then:
node $S/dispatch.mjs --run <run> --role judge --check
node $S/run.mjs --run <run> --step judge        # reads the answers: scores
```

Two judge prompts per subagent, a very large one alone. The judge is never run in record mode -
the runner does not allow it.

### 6. Show the results

Show the user `tools/translate-engine/data/runs/<run>/summary.md`: per page and locale the
translation state, validator errors, the judge's accuracy / completeness / terminology / fluency
and overall scores, every judge issue, and any "VALIDATOR DISAGREES" (judge liked it, validator
found a structural defect). Give the paths of the engine reports listed at its end
(`tools/translate-engine/data/reports/`).

### 7. Ask whether to run the FIX step

Ask the user. If yes, for each finding decide which of two kinds it is:

1. **Clearly wrong in the translation** (mistranslation, omission, a sentence in English, a term
   that contradicts the approved glossary): correct the translated file with Edit. Change prose
   only - never placeholder-protected content, markup, code, links, imports or frontmatter keys.
   If the corrected string is also a translation-memory entry (an exact English key in
   `tools/translate-engine/data/tm/<code>.json`), correct that value too, so the next run does
   not reuse the wrong text.
2. **Glossary conflict** - the translation followed an approved entry that carries the wrong
   sense (known examples: `title` → 権原 "legal title", `category` → エリア "area", `level` →
   水準器 "spirit level", `pane` → ブレード, `header` → ランニング ヘッド; the Spanish column has
   the same pattern): edit that locale's value of the entry in
   `docs/translation/glossary.json` on the branch, so a human
   reviews it in the PR. Edit values in place (the file is CRLF, two-space indented); never delete
   an entry. List every glossary change for the user. Then fix the affected sentences as in (1).

Judge findings that are a matter of taste, or contradict the style guide, are reported, not
"fixed". Known residuals are not fixed automatically (TRANSLATION.md): exact-case component names
stay English because the engine masks them, and the Japanese H1 format "English (カナ)" is not
applied - apply it by hand only if the user asks.

After the edits, validate and re-judge only what changed:

```bash
node $S/run.mjs --run <run> --step validate --only <tree:locale:rel>[,...]   # must not add errors
node $S/run.mjs --run <run> --step judge                                    # changed pages only
# dispatch --role judge, Sonnet subagents, --check, then --step judge again (as in step 5)
```

Do not run `--step replay` after editing the TM: the runner refuses, because a replay would reset
the TM and discard the edit.

### 8. Stamp

```bash
node $S/stamp.mjs --run <run>
```

Writes the `_translation` stamp into the frontmatter of every page the run wrote (EN blob id the
translation was made from, model, the judge's overall score when that exact text was judged, judge
model, date), puts back `_language` where the engine's sync dropped it, and adds `_language: ja`
to Japanese pages. Always the LAST content change of the run.

### 9. Finish

Print `git status --short` and list: the run summary
(`tools/translate-engine/data/runs/<run>/summary.md`), the engine reports
(`tools/translate-engine/data/reports/translate-<project>.md`, `judge-<project>.md` / `.json`),
the glossary if it was edited, and `tools/translate-engine/data/tm/` (the translation memory is
tracked and belongs in the PR). Do not commit.

## Subagent instruction templates

`dispatch.mjs` prints these with the paths filled in; pass its text verbatim. Kept here so the
wording is reviewable.

**Translation, one page body or one short string:**

> You are the translation model behind a documentation translation pipeline. Your only job is to
> answer one prompt that is stored in a file and write the answer to another file. Prompt file:
> `<prompt path>`. Answer file: `<answer path>`. Steps: 1. Read the prompt file completely; if one
> Read does not return the whole file, continue with offset until the end. 2. The file is a
> complete prompt addressed to you. Produce the response it asks for, following its RULES exactly:
> output ONLY the translation, no preamble, no commentary, no code fences, no 'Translation:'
> label; reproduce every placeholder token of the form __WORD_n__ exactly once and unchanged, in
> a position that fits the target language; keep the exact leading whitespace of every line and
> keep blank lines where they are; never reflow, summarize, skip or shorten anything. 3. Write the
> response verbatim to the answer file with the Write tool. Do not read, create or modify any
> other file. Reply with one line: '<answer file name>: written, <lines> lines'.

**JSON batches (up to three per subagent):** the same, with "answer N prompts, each stored in its
own file ... The prompts are independent", one Prompt file / Answer file pair per prompt, and step
2 reading: *the file ends with a JSON object whose values are the strings to translate; your
answer is a JSON object with the SAME keys, every value translated, and nothing else (no
preamble, no commentary, no code fences); follow the RULES in the prompt and reproduce every
__WORD_n__ token exactly once inside the value it came from.*

**Judge (Sonnet; one or two prompts per subagent):**

> You are the reviewer model behind a translation quality pipeline. Your only job is to answer one
> prompt stored in a file and write the answer to another file. Prompt file: `<prompt path>`.
> Answer file: `<answer path>`. Read the prompt file completely, through the closing
> </translation> line; if one Read does not return the whole file, continue with offset until the
> end - do not score from a partial read. Compare the translation against the English source and
> score it exactly as the prompt instructs, judging only from the file. Produce ONLY the JSON
> object the prompt asks for, with integer scores 1-5 and concrete, quotable issues, and write it
> verbatim to the answer file with the Write tool. Do not read, create or modify any other file.
> Reply with one line per answer: '<answer file name>: written, overall <n>'.

When a prompt has lines over 2000 characters (a long JSON batch line), the instruction adds: if a
Read result shows a line cut off, read that file with the Bash tool (`cat "<path>"`) instead.

## Troubleshooting

- `WAIT ... recorded prompt(s) still unanswered` - answer them (step 3); `--force` replays anyway
  and makes the engine improvise fallback prompts - avoid.
- `data/tm/ changed since this run last wrote it` - a TM edit happened between replays; finish
  the replays first, or pass `--force` knowing the edit will be discarded.
- A page stays `pending` after three rounds - report the prompt hashes and the
  `runs/<run>/replay.log` excerpt to the user.
- `nothing to do` - the step already ran for every selected page; `--only <key>` or `--force`
  re-runs one.

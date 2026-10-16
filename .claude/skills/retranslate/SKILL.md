---
name: retranslate
description: >-
  Replace EXISTING translations with a fresh, full translation made by the repository's translation
  engine (tools/translate-engine) - for example the Japanese team retranslating its old jp/ pages
  with the new process, the diff reviewed in the PR. One locale per run, pages named with --file
  or taken N at a time from a folder with --dir; only pages that already have a translation
  without a `_translation` stamp are picked, so repeating the same command continues batch by
  batch across sessions. Answers come from subagents of this Claude Code session (author's seat,
  no API key), scored by Sonnet subagents. Use when someone asks to retranslate, redo or replace
  existing translations, or types /retranslate --locale <code> (--file <rel> | --dir <subdir> [N]).
  Costs roughly 150-200k tokens per page translated plus ~100k judged - always confirm first. For
  pages with no translation use translate-all; for pages changed on the branch use translate.
---

# Retranslate existing pages

Same machinery and the same steps as the `translate` skill
([`../translate/SKILL.md`](../translate/SKILL.md)) - read its "Ground rules", "Seat usage", steps
2-9 and subagent templates; they apply unchanged. What differs is the selection and that every
page is translated **in full from the EN page** (`translate --file`, which the engine runs even
when the target exists), never spliced: the existing translation is replaced, and the PR diff is
where it gets reviewed. Helper scripts: `.claude/skills/translate/scripts/` (`$S` below; spell
the path out in each command).

## Usage

```text
/retranslate --locale <code> --file <rel.mdx>[,<rel.mdx>...] [--tree xplat|angular] [--model opus|sonnet] [--include-stamped]
/retranslate --locale <code> --dir <subdir> [N]             [--tree xplat|angular] [--model opus|sonnet] [--include-stamped]
```

- `--locale` is **required**, one code per run: `ja` (folder `jp/`), `kr`, `es`, `pt-br`.
- `--tree` defaults to `xplat`; paths are relative to that tree's `en/` folder
  (e.g. `components/layouts/avatar.mdx`, `--dir components/layouts`).
- `--dir <subdir> [N]` takes the first N (default **3**) eligible pages in alphabetical order.
- Eligible: the page HAS a translation in that locale and it carries **no** `_translation` stamp
  (it was not produced by this process yet). `--include-stamped` also takes stamped pages.
  Pages with no translation at all are left out and reported - that is `/translate-all`'s job.
- Pages no TOC links to are left out of `--dir` selections, as in the other skills
  (`--include-non-toc`); a page named with `--file` is always taken.
- `--model` - the translation subagents' model (default `opus`); the judge is always Sonnet.
- `--force` - see "Uncommitted changes" below. Only on the user's explicit instruction.

## Steps

1. Plan:

   ```bash
   node $S/plan.mjs retranslate --locale <code> (--file <rel>[,<rel>] | --dir <subdir> [N]) [--tree ...] [--model ...] [--include-stamped]
   ```

   It prints the selected pages with their EN size, notes (pages without a translation, stamped
   pages left out, pages outside the TOC), how many eligible pages remain after this batch, and
   the per-page and total seat estimate. **Show this to the user and ask for confirmation before
   step 2** - every selected translation will be replaced.

2. Continue with steps 2-9 of the `translate` skill using the printed run id: record, answer
   (translation subagents, chosen model), replay loop, judge (Sonnet subagents), show the summary,
   ask about the FIX step, stamp, `git status --short` and the report paths. Never commit.

The record pass shows each page as a whole-page `translate` (one body prompt plus frontmatter and
attribute batches); there is no ABORT here, because nothing is spliced.

## Uncommitted changes are never overwritten

`plan.mjs retranslate` refuses when any selected target file has uncommitted changes (modified,
staged or untracked), so a reviewer's in-progress edits are never clobbered; `run.mjs` checks
again right before the replay writes, because answering takes a while. When the dirty file was
written by an earlier run that never got stamped, the message names that run - finish it with
`node $S/stamp.mjs --run <that run>` (or discard the file) and plan again. `--force` overwrites
anyway; use it only when the user says so.

## Resumable, batch by batch

Every finished page is stamped (step 8 of `translate`), and stamped pages are not eligible. So
the same command, repeated, walks through a folder across sessions and days:

```text
/retranslate --locale ja --dir components 5     # day 1: the first 5 unstamped jp pages
/retranslate --locale ja --dir components 5     # day 2: the next 5
```

`plan.mjs` prints how many remain after each batch, and `/translate-list --locale ja --dir
components` shows the remaining **unstamped** count. Stamp at the end of every session - an
unstamped page is picked again next time (and, being an uncommitted change, it blocks the plan
until its run is stamped).

## Japanese

Japanese pages keep `_language: ja` (restored where the old page had it, added otherwise). The
repository's jp-sync GitHub workflows also write `jp/` when EN changes merge to `vnext`; a page
retranslated here can be touched by that workflow later, and an open retranslation PR can conflict
with a jp-sync PR. Agree who owns `jp/` before retranslating it at scale (TRANSLATION.md).

---
name: translate-all
description: >-
  Translate a small batch of English documentation pages that still need translation - no
  translation yet, or a machine translation gone stale because the EN page changed - into
  Japanese (jp/), Korean (kr/), Spanish (es/) and Brazilian Portuguese (pt-br/), with the
  repository's translation engine and subagents of this Claude Code session (author's seat, no API
  key), judged by Sonnet subagents. Use when someone asks to translate the remaining or missing
  pages, backfill a locale, or types /translate-all [N] [--dir <subdir>] [--locale ...]. Picks up
  to N pages (default 3); existing translations without a stamp (human or legacy) are never
  picked. Costs seat usage: roughly 150-200k tokens per page and locale translated plus ~100k
  judged, so always confirm the batch first. For the pages changed on the current branch use the
  translate skill; to replace existing translations use retranslate; to see what is left use
  translate-list.
---

# Translate pages that still need it

Same machinery and the same steps as the `translate` skill
([`../translate/SKILL.md`](../translate/SKILL.md)) - only the way pages are chosen differs. Read
that skill's "Ground rules", "Seat usage", steps 2-9 and subagent templates; they apply unchanged.
Helper scripts: `.claude/skills/translate/scripts/` (`$S` below; spell the path out).

## Arguments

- `N` - how many EN pages to pick (default **3**). A page counts once; it is translated into every
  requested locale that needs it, so N=3 with four locales can be twelve page-locale pairs.
- `--dir <subdir>` - only pages under this folder of the EN tree (e.g. `components/layouts`).
- `--tree xplat|angular`, `--locale ja,kr,es,pt-br`, `--model opus|sonnet` - as in `translate`.
- `--include-non-toc` - also consider pages no TOC links to (left out by default, like the
  jp-sync workflows do).

## What "needs translation" means

Decided from the `_translation` stamp in each translated file (TRANSLATION.md):

- **missing** - no translation file for the locale;
- **stale** - stamped, and the EN page's git blob id is no longer the one in the stamp. The page
  is spliced against the exact EN it was translated from when git still has that blob, otherwise
  translated in full (it is machine output either way);
- never picked: **current** (stamp matches) and **unstamped** existing translations (human or
  legacy - treated as translated but unverified). To replace those with the new process, batch by
  batch, use the `retranslate` skill ([`../retranslate/SKILL.md`](../retranslate/SKILL.md)); to
  update a single one deliberately, `plan.mjs files` below.

Stale pages are picked before missing ones, then alphabetically.

## Steps

1. Plan:

   ```bash
   node $S/plan.mjs pick [N] [--dir ...] [--tree ...] [--locale ...] [--model ...]
   ```

   Show the user the chosen pages, the locales, how many pages remain after this batch and the
   seat-usage estimate. **Always ask for confirmation before step 2** - this is a bulk run. Offer
   to narrow `--locale`, `--dir` or N.

2. Continue with steps 2-9 of the `translate` skill using the printed run id: record, answer
   (translation subagents with the chosen model), replay loop, judge (always Sonnet subagents),
   show the summary, ask about the FIX step, stamp, `git status --short` and the report paths.
   Never commit.

## Specific pages

To translate named pages instead of the next N:

```bash
node $S/plan.mjs files xplat:components/layouts/avatar.mdx,angular:components/grid/grid.mdx [--locale ...]
```

An unstamped existing translation is left out unless `--base <ref>` names the EN version it
matches (it is then spliced from there) or `--full` asks for a full translation, which overwrites
it - confirm with the user first.

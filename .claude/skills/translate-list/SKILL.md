---
name: translate-list
description: >-
  List which English documentation pages still need translation into Japanese (jp/), Korean
  (kr/), Spanish (es/) and Brazilian Portuguese (pt-br/), per content tree (xplat, angular) and
  locale, with counts and the reason - no translation yet, or a machine translation gone stale
  because the EN page changed since it was stamped - plus the existing translations that carry no
  stamp (human or legacy, unverified). Read-only, no model calls, no seat usage. Use when someone
  asks what is left to translate, how far a locale is, which translations are out of date, or types
  /translate-list [--dir <subdir>] [--locale ...]. To translate the pages, use translate-all (next
  N pages) or translate (pages changed on the branch); to replace unstamped existing translations
  batch by batch, retranslate - this list shows how many remain.
---

# What still needs translation

Read-only report. Run from the repository root:

```bash
node .claude/skills/translate/scripts/list.mjs [--tree xplat|angular] [--locale ja,kr,es,pt-br] [--dir <subdir>] [--files] [--include-non-toc]
```

- `--dir` - only pages under this folder of the EN tree (e.g. `components/grids`).
- `--files` - also list the pages behind the counts (missing, stale, and unstamped pages whose
  EN has newer commits).
- `--include-non-toc` - count pages no TOC links to as well (left out by default, like the jp-sync
  workflows do; the header line says how many).
- `--json` - machine-readable.

Present the table to the user and explain the columns:

- **NEEDS = missing + stale** - what `/translate-all` would pick. *missing*: no translation file.
  *stale*: the translated file's `_translation` stamp records a different EN blob id than the EN
  page has now, i.e. EN changed after the translation was made.
- **current** - stamped with the EN page's current blob id.
- **unstamped** - a translation exists but has no stamp: human or legacy work, counted as
  translated-but-unverified and never re-translated automatically. It is also the number of pages
  `/retranslate` has still to do when a team replaces its old translations batch by batch (each
  finished page is stamped and moves to *current*). The number in brackets is a git-history
  heuristic only: pages whose EN file has a commit later than the translation's last commit
  (possibly stale). Once someone confirms such a page is up to date, it can be stamped as current
  so staleness is tracked from then on:

  ```bash
  node .claude/skills/translate/scripts/stamp.mjs mark --tree xplat --locale ja --file <rel>[,<rel>] --model human-reviewed
  ```

  (A frontmatter-only change; show the user `git diff` afterwards. Never commit.)

Notes printed under a locale: Angular `kr/` holds legacy docfx `.md` pages the Astro build does
not load, so those pages count as missing; a stale page whose old EN is no longer in this clone
needs a full re-translation.

Suggest the next step: `/translate-all [N] [--dir ...] [--locale ...]` for a batch,
`/translate` for the pages changed on the current branch, or
`/retranslate --locale <code> --dir <subdir> [N]` to replace unstamped existing translations.
Mention the seat cost (roughly
150-200k tokens per page and locale translated plus ~100k judged) when suggesting a batch.

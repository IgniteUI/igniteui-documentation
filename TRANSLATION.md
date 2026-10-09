# Translating the documentation

How English pages get into Japanese (`jp/`), Korean (`kr/`), Spanish (`es/`) and Brazilian
Portuguese (`pt-br/`) from an author's own Claude Code session. **Status: prototype.**

Four project skills drive a vendored copy of the translation engine
([`tools/translate-engine/`](tools/translate-engine/PROVENANCE.md); for working on the engine
itself start at [`tools/translate-engine/CLAUDE.md`](tools/translate-engine/CLAUDE.md)). The engine does the
deterministic work - it masks code, JSX, `{Platform}`-style tokens and component names, translates
frontmatter by contract, keeps a translation memory, splices changed blocks into existing
translations, restores everything byte-for-byte and validates the result. The model work - the
translations and the quality judgement - is done by subagents of the author's session, on the
author's seat. No API key is involved.

## For authors: the workflow

1. Change English pages on a branch as usual (`docs/xplat/src/content/en`,
   `docs/angular/src/content/en`).
2. In Claude Code, at the repository root, run **`/translate`** (optionally
   `--locale kr,es,pt-br`, `--model sonnet`). The skill shows a plan and a seat-usage estimate,
   asks before anything expensive, then translates, validates and judges.
3. Read the summary it shows: per page and locale the validator findings and the judge's scores
   and issues. Say whether to run the **fix** step (corrections in the files, glossary proposals).
4. The skill stamps the translated files and ends with `git status --short`. Review the diff -
   translations, the translation memory (`tools/translate-engine/data/tm/`), any glossary edits -
   and commit and open the PR yourself. The skills never stage, commit or push.

First time only: `npm ci --prefix tools/translate-engine` (Node 24).

## The four skills

| Skill | What it does |
| --- | --- |
| `/translate [--locale ...] [--model opus\|sonnet] [--base vnext]` | Translates the EN pages changed on the current branch (vs the merge base with `vnext`, plus staged, unstaged and untracked changes) into the four locales. A page with no translation is translated in full; an existing translation gets only the changed blocks spliced in. |
| `/translate-all [N] [--dir <subdir>] [--locale ...]` | Picks up to N pages (default 3) that still need translation - missing, or a stamped machine translation gone stale - and runs the same flow. Never picks an existing unstamped translation. |
| `/translate-list [--dir <subdir>] [--locale ...] [--files]` | Read-only: per tree and locale, how many pages still need translation and why (missing / stale), how many are current, and how many existing translations carry no stamp. |
| `/retranslate --locale <code> (--file <rel>[,...] \| --dir <subdir> [N])` | Replaces existing translations with a fresh full translation, one locale per run, N pages (default 3) at a time from a folder or named files. Picks only pages whose translation carries no stamp, so repeating the command continues batch by batch. See "Retranslating existing pages". |

The skills live in `.claude/skills/{translate,translate-all,translate-list,retranslate}/`; their helper scripts (plain Node, no dependencies)
in `.claude/skills/translate/scripts/`: `plan.mjs` (what to translate), `run.mjs` (drives the
engine), `dispatch.mjs` (turns pending prompts into subagent tasks, checks answers), `stamp.mjs`,
`list.mjs`. They are Claude Code skills, not part of the agent-neutral `.ai/skills` set, because
they depend on spawning subagents with a chosen model.

Only pages a table of contents links to are translated by default (plus the shared grid
templates, `components/grids/_shared/` and `grids_templates/`) - the same rule the jp-sync
workflows apply. 27 xplat and 10 Angular EN pages fall outside it today (`--include-non-toc`).
Gitignored, generated pages (the xplat topics synced into the Angular tree, the expanded grid
pages) are never sources; their real sources are.

## What runs where, and what it costs

Everything runs locally. The engine writes each prompt it needs to a file; subagents of the
session read the file and write the answer to a file; the engine reads it back. Per run:

1. **record** - a dry run that only collects prompts (`EXCHANGE_MODE=record`); nothing is written;
2. **answer** - one subagent per page body, up to three short JSON batches per subagent, with the
   chosen model (Opus by default); trivial prompts (only placeholders, or one code identifier) are
   answered by the script with their own text; answers are checked (placeholders, keys, labels)
   before the engine sees them;
3. **replay** - the real run: answers read back, files written, validator run; prompts the engine
   asks additionally (a retry after an unusable answer, a string re-asked alone) go back to step 2;
4. **judge** - Sonnet subagents score every written page (accuracy, completeness, terminology,
   fluency, overall) with concrete issues. **The judge is always Sonnet**, whatever translated.

Seat usage as the harness reports it, measured on the JP pilot (engine `MODEL-EVALUATION.md` §7,
experiment 4): about **160k tokens per page and locale translated with Opus** and **80k per page
and locale judged** - plan for 150-200k and ~100k. One page in all four locales is ~1.1M tokens;
a splice of a few changed blocks costs a fraction. The skills print an estimate and ask before
anything above ~1M tokens. Wall time is minutes per page, with subagents in parallel.

Per-run scratch lives in `tools/translate-engine/data/runs/<run>/` (prompts, answers, plan,
status, logs, `summary.md`) and engine reports in `tools/translate-engine/data/reports/`; both are
gitignored. The translation memory `tools/translate-engine/data/tm/<locale>.json` is tracked.

## Translation state: the stamp

Every file the skills write gets a stamp at the end of its frontmatter:

```yaml
_translation:
  source_sha: "7048741d32927ed5b9166b4065eaef6d85b89828"   # git blob id of the EN page translated
  model: "claude-opus-subagent"
  judge: 4                                                  # judge overall score, null if not judged
  judge_model: "claude-sonnet-subagent"
  date: "2026-10-08"
```

`source_sha` is what `git hash-object` prints for the EN page at translation time. A page is
**current** when its EN page still has that blob id, **stale** when it changed, **missing** without
a translation file. Because it is a git object id, the EN text the translation was made from can be
fetched back from git (`git cat-file blob <sha>`), so a stale page is spliced precisely: only the
blocks changed since then are re-translated.

**Why a stamp in the translated file and not a flag in the EN file** (the original suggestion was a
frontmatter flag on the EN page): a flag says "translated" but not *of which version* - it cannot
detect that the EN page changed afterwards, which is the common case. A per-locale stamp records
exactly what each translation was made from, needs no change to the English tree (authors' files,
review and lint stay untouched), and lets four locales be at four different states.

Verified for this repository:

- the content schema tolerates the key - zod's default strips unknown keys, as it already does for
  `_language`, `llms`, `mentionedTypes`;
- the engine's `sync` rebuilds frontmatter from the EN keys and **drops** the stamp and
  `_language`; `stamp.mjs` therefore runs after the last engine write, puts `_language` back where
  it was, and adds `_language: ja` to Japanese pages (the jp corpus convention);
- the engine's validator compares frontmatter shape with the EN page and would report the stamp as
  a `shape-mismatch`; the skills' runner hides the stamp and `_language` from the engine during
  `judge`/`validate` and restores the file byte-for-byte. Running the engine's `validate` by hand
  on a stamped file still shows that false error.

### Existing translations without a stamp

All of today's `jp/` pages (and the legacy Angular `kr/` `.md` pages) carry no stamp. They are
treated as **translated but unverified**: `/translate-list` counts them separately (with a
git-history hint of which ones have newer EN commits), and `/translate-all` never re-translates
them. `/translate` still splices EN changes made on the branch into them, and `/retranslate`
replaces them on request (next section). Once someone confirms such a page is up to date, mark it
current so its staleness is tracked from then on:

```bash
node .claude/skills/translate/scripts/stamp.mjs mark --tree xplat --locale ja --file components/layouts/avatar.mdx --model human-reviewed
```

## Retranslating existing pages

For a team that wants its existing pages translated again from scratch by this process - the
Japanese team replacing the old human/plugin `jp/` translations, the diff reviewed in the PR:

```text
/retranslate --locale ja --dir components/layouts 5        # the next 5 unstamped jp pages, alphabetically
/retranslate --locale ja --file components/layouts/avatar.mdx,components/inputs/badge.mdx
```

- One locale per run (`--locale` is required); `--tree` defaults to `xplat`.
- Each page is translated **in full** from the EN page (`translate --file` - the engine translates a
  named file even when its target exists, and never reads the old translation); nothing is spliced.
- Only pages that **have** a translation **without a stamp** are picked; `--include-stamped` also
  takes stamped ones. Pages without any translation are reported and left to `/translate-all`.
- **Resumable:** every finished page is stamped, and stamped pages are not picked again, so repeating
  the same command walks through a folder batch by batch, across sessions and days. `plan.mjs`
  prints how many remain after each batch; `/translate-list --locale ja --dir components` shows the
  remaining unstamped count. Stamp at the end of every session - an unstamped page is picked again.
- **Never clobbers work in progress:** the plan refuses when a selected target file has uncommitted
  changes (and names the earlier run if one of ours wrote it unstamped); the runner checks again
  right before writing, and in every skill a replay refuses to overwrite a file that changed after
  the run wrote it (fix edits, the stamp). `--force` overrides, on the user's word only.
- Japanese pages keep `_language: ja` (restored where the old page had it, added otherwise).
- Same flow otherwise: confirm, record, answer, replay, Sonnet judge, fix-step question, stamp,
  `git status`. Seat usage is the full-page figure for every page: ~175k + ~100k tokens each.

Retranslating `jp/` overlaps with the jp-sync GitHub workflows (see Known residuals): agree who
owns `jp/` before doing it at scale.

## Splicing into human translations

Splicing needs the existing translation to be block-for-block parallel with the EN page it was made
from. Many human `jp/` pages are not (a blank line more or less is enough): then the engine
**aborts** that page rather than misplace a block, and the skill asks whether to leave it or
translate it in full, which overwrites the human translation. In a test against real branch history
two of three Japanese splices aborted this way. The Angular `kr/` pages are legacy `.md` files the
Astro build does not load; the engine writes new `.mdx` pages next to them.

## The glossary fix flow

`docs/translation/glossary.json` holds the approved terminology,
injected as "always use" into every translate and judge prompt. It lives in this repository so the
`/translate` fix step can propose corrections on the branch: when a judge finding is a glossary
conflict - an approved entry that carries the wrong sense of the English word - the step edits that
locale's value and lists the change, and a human reviews it in the PR like any other change.
Known wrong-sense entries (Japanese, mirrored in Spanish): `title` → 権原 (legal title), `category`
→ エリア ("area"), `level` → 水準器 (spirit level), `pane` → ブレード, `header` → ランニング ヘッド,
`group` → リボン グループ, `register` → レジスタ. A native-speaker pass over all 131 entries is due;
`pt-br` has no entries at all yet.

Findings that are plainly wrong in a translation are corrected in the file (and in the translation
memory if the string is stored there), then validated and re-judged.

## Translation memory

`data/tm/<locale>.json` caches short, markup-free strings (frontmatter values, alt texts, FAQ
questions) so a string translated once is reused verbatim, in both trees. The engine designs it to be
version-controlled and reviewed in PRs, so it is tracked here: a wrong entry is visible in the diff,
and a corrected entry propagates. It is sorted JSON - a merge conflict is resolved by keeping both
sides' keys. During a run the runner gives every page the memory as it was at the start of the run
(so the replay asks exactly what the record pass asked) and merges the run's additions at the end.

## Known residuals

- **Exact-case component names stay English.** The engine masks capitalized component names
  (`Icon`, `Grid`, `Badge`, ...) before the model sees them, so "#### Icon" stays English where the
  Japanese reviewers' policy wants アイコン for a common-noun use. Lower-case uses follow the policy.
- **H1 "English (カナ)"** for Japanese headings is not automated (the name reaches the model as a
  placeholder); the fix step applies it by hand only on request.
- **The `jp/` tree is also maintained by the jp-sync GitHub workflows**, which translate EN changes
  after they merge to `vnext`. Running `/translate` or `/retranslate` for `ja` on a branch overlaps
  with them (a retranslation PR can conflict with a jp-sync PR, and the workflow edits pages this
  process produced); either agree on one owner for `ja` or run the skills with `--locale kr,es,pt-br`.
- **New locales are content only.** `es/`, `pt-br/` and xplat `kr/` are created by the engine, but
  the sites build `en`/`jp` (and Angular `kr`): build scripts, TOC JSON, the llms metadata check and
  `cspell.json` (CI spell-checks changed `.mdx` with an English dictionary) need wiring before such
  a PR is green and the pages are published. TOC JSON files are not translated by the engine.
- The session model follows instructions less literally than an API call: subagents have declined
  wrong-sense glossary terms on their own. That is judgement, not engine control - review the diff.

## Running with API keys instead (later)

The same configs run against an API when the team decides to: put the key in
`tools/translate-engine/configs/.env` (see `.env.example`, gitignored) and set the provider and
model for the run - no record or dispatch step is needed:

```bash
export DOCS_PROVIDER=anthropic DOCS_MODEL=<model id>          # translator
export DOCS_JUDGE=anthropic    DOCS_JUDGE_MODEL=<model id>    # judge (default claude-sonnet-5)
node .claude/skills/translate/scripts/plan.mjs changed
node .claude/skills/translate/scripts/run.mjs --run latest --step replay
node .claude/skills/translate/scripts/run.mjs --run latest --step judge
node .claude/skills/translate/scripts/stamp.mjs --run latest
```

or the engine directly, as in its CI recipe:
`cd tools/translate-engine && npx tsx src/cli.ts sync --config configs/docs-xplat.config.mjs --locale es --file <rel> --base vnext`.
`DOCS_PROVIDER` accepts `anthropic`, `openai`, `gemini`; pick a judge model different from the
translator. Model ids and rates: the engine's README.

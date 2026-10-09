# translate-engine (vendored) - map for agents

You are in the vendored copy of the translation engine that the `/translate`, `/translate-all`,
`/retranslate` and `/translate-list` skills drive. This file is a map, not a manual: read the
linked documents for depth. Author workflow: [`TRANSLATION.md`](../../TRANSLATION.md).

## What it is

A structure-preserving Markdown/MDX translator. One line:
**parse → protect → translate → restore → validate**; the **judge** is a separate command.

- **parse** - gray-matter frontmatter; body as a remark AST (GFM + remark-mdx).
- **protect** - everything that is not prose becomes `__WORD_n__` placeholders: code, JSX tags,
  imports, URLs, `{Platform}`-style tokens, and the component names in `configs/docs-component-names.mjs`
  (exact case, whole word). The model never sees them.
- **translate** - one prompt per page body; short strings (frontmatter values, component attributes
  such as `alt`, FAQ questions) in JSON batches; translation memory hits skip the model.
- **restore** - placeholders back byte-for-byte.
- **validate** - deterministic checks (tokens, tags, links, code, imports, brands, frontmatter shape).
  Never blocks the write; flags it (exit code 2).
- **judge** - an LLM scores accuracy / completeness / terminology / fluency / overall with issues,
  and the validator re-runs on the same file.
- **sync** - for an existing translation, splices only the EN blocks that changed between two
  versions; aborts when the translation is not block-parallel to the old EN.

## Where things live

| Path | What |
| --- | --- |
| `src/cli.ts`, `src/commands/` | CLI: `status`, `translate`, `sync`, `validate`, `judge` |
| `src/pipeline/` | `protect.ts` (masking), `body.ts`, `translate-text.ts` (batching, retries), `frontmatter-walk.ts` |
| `src/prompt.ts`, `src/judge.ts` | translate and judge prompt text |
| `src/validate.ts`, `src/incremental.ts`, `src/memory.ts` | validator, sync splice, translation memory |
| `src/config.ts`, `src/providers/` | config loading; providers - `exchange.ts` is the one the skills use |
| `scripts/` | `exchange-pending.ts`, `anchor-check.ts`, `estimate-cost.ts`, audits |
| `tests/` | `node:test` suites (run through tsx) |
| `configs/docs-shared.mjs` | factory: repo root, locales (`ja`→`jp/`, `kr`, `es`, `pt-br`), providers, env knobs, data dir, gitignored-page exclusion |
| `configs/docs-xplat.config.mjs`, `configs/docs-angular.config.mjs` | the two content trees |
| `configs/docs-style-guide.mjs`, `configs/docs-component-names.mjs` | per-locale style rules; masked component names |
| `../../docs/translation/glossary.json` | approved terminology - owned by the localization team |
| `data/tm/` | translation memory, **tracked** |
| `data/runs/<run>/`, `data/reports/` | per-run exchange files, plan, status, logs; engine reports - **gitignored** |
| `../../.claude/skills/*/SKILL.md` | the four skills |
| `../../.claude/skills/translate/scripts/` | `lib`, `plan`, `run`, `dispatch`, `stamp`, `list` (plain Node) |

## Checks - must pass after any change

```bash
npm ci --prefix tools/translate-engine            # once, from the repository root
# skill scripts (oxlint refuses '..' paths, so run this one from the repository root):
tools/translate-engine/node_modules/.bin/oxlint -c tools/translate-engine/.oxlintrc.json .claude/skills/translate/scripts
cd tools/translate-engine
npm test && npm run typecheck && npm run lint     # 103 tests at copy time
npx tsx src/cli.ts status --config configs/docs-xplat.config.mjs
npx tsx src/cli.ts status --config configs/docs-angular.config.mjs
```

CLI exit codes: 0 ok, 1 usage/config error, 2 validator findings or failed files (normal).

## The exchange provider, and how the skills drive it

`provider.id: 'exchange'` (`src/providers/exchange.ts`) answers no prompt itself. For each one it
writes `<hash>.prompt.txt` and `<hash>.meta.json` into the configured `dir` and reads back
`<hash>.answer.txt`, or `<hash>.answer-N.txt` for the engine's retry attempt N.

- **record** (`EXCHANGE_MODE=record` with `--dry-run`): unanswered prompts get a marked dummy, so a
  whole run surfaces every prompt at once and writes nothing.
- **replay** (default): a missing attempt-1 answer throws `PendingAnswerError` - translate/sync mark
  the file FAILED, judge skips it. A missing later attempt reuses the previous answer and records
  the request in the meta, so it can be answered and the file re-run.
- Env knobs read by `docs-shared.mjs`: `DOCS_PROVIDER`, `DOCS_MODEL` (`opus`/`sonnet` labels for
  the exchange; real ids for API providers), `DOCS_JUDGE`, `DOCS_JUDGE_MODEL`, `DOCS_RUN` (per-run
  exchange dir). Keys for API providers go in `configs/.env`.

Skill flow: `plan.mjs` → `run.mjs --step record` → `dispatch.mjs` (subagent tasks with the
instruction text; trivial prompts echoed; `--check` before replay) → `run.mjs --step replay`
(repeat until nothing is pending) → `run.mjs --step judge` twice (prompts, then scores; never in
record mode) → `stamp.mjs`. What `run.mjs` adds on top of the engine, and why:

- one engine command per (page, locale), attributing prompts to pages by their meta files;
- refuses to replay a page while its recorded prompts are unanswered - the engine swallows a
  pending JSON batch and silently asks single-string prompts nobody recorded instead;
- resets `data/tm/` to the run-start TM before each command and merges additions afterwards -
  batches leave out TM hits, so a TM that grew mid-run changes the prompts;
- hides the stamp and `_language` from the engine during judge/validate, then restores the file;
- BLOCKED guard: never overwrites a file changed after the run wrote it, nor a `/retranslate`
  target with someone's uncommitted changes (`--force` overrides).

## Translation-state stamp

`stamp.mjs` appends `_translation: {source_sha, model, judge, judge_model, date}` to the frontmatter
of every file a run wrote; `source_sha` is the git blob id of the EN page translated. `lib.mjs
classify()` derives missing / stale / current / unstamped from it. It must be re-applied after every
engine write: `sync` rebuilds frontmatter from the EN keys and drops the stamp and `_language`, and
`translate` writes from EN. Stamp last - the validator reports target-only keys as `shape-mismatch`.

## Conventions that must hold

- Never edit EN pages (`docs/*/src/content/en`) to fix a translation.
- Skills and agents never stage, commit or push; the author reviews the diff.
- The judge is always Sonnet (label `claude-sonnet-subagent`), whatever translated.
- Exchange translator concurrency stays 1 (record and replay must ask in the same order).
- `data/tm/` is tracked and reviewed; `data/runs/` and `data/reports/` are ignored.
- The glossary belongs to the localization team: agents propose edits on a branch, never decide them.
- Keep `src/`, `scripts/`, `tests/` identical to upstream where possible; put repo-specific logic
  in `configs/` or the skill scripts, and record any engine change in `PROVENANCE.md`.

## Provenance

Copied 2026-10-08 from the translate-engine repository (`C:\Users\SStoychev\Documents\Git\translate-engine`,
branch `sstoychev/remark-mdx`), commit `c8cd749` **plus uncommitted working-tree changes** (the
exchange provider, the keep-list split, the Japanese naming rule). Upstream may have moved on; this
copy may drift. Details and the update procedure: [`PROVENANCE.md`](PROVENANCE.md).

## Known residuals and open items

- Exact-case component names are masked, so a common-noun "Icon" heading stays English in `jp/`.
- The Japanese H1 format "English (カナ)" is not automated.
- Wrong-sense glossary entries (`title` → 権原, `category` → エリア, `level`, `pane`, `header`, ...);
  `pt-br` has no entries.
- `sync` aborts on human pages that are not block-parallel to EN (2 of 3 jp pages in a test).
- `es/`, `pt-br/` and xplat `kr/` need site wiring (build, TOC JSON, `cspell.json`) before publishing.
- `jp/` is also written by the repo's jp-sync GitHub workflows - ownership to agree.
- Engine-level fix candidates: validator tolerating target-only `_` keys; `sync` keeping them;
  surfacing a pending batch instead of swallowing it.

## Read next

- [`ARCHITECTURE.md`](ARCHITECTURE.md) - layers, recipes (add a provider/command/stage), guarantees.
- [`FLOW.md`](FLOW.md) - file-by-file trace of a `translate` run and the `sync` path.
- [`VALIDATION.md`](VALIDATION.md) - every validator check with examples.
- [`README.md`](README.md) - commands and config fields; [`DEPENDENCIES.md`](DEPENDENCIES.md).
- [`docs/history/`](docs/history/) - `MODEL-EVALUATION.md` (models, costs, experiments),
  `NATIVE-REVIEW-LEARNINGS.md` (JP review findings), `REMARK-MDX-MIGRATION.md`.

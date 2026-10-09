# Architecture & maintainer guide

How translate-engine is wired, why it's shaped this way, and - most
importantly - **how to change it**: add a provider, add a command, adjust the
translation behavior, tune terminology, or onboard a brand-new project. Read
this before making a structural change. For day-to-day usage see
[README.md](README.md); for every validator check with examples see
[VALIDATION.md](VALIDATION.md).

---

## 1. The one-paragraph model

The toolkit takes an English `.md`/`.mdx` file and translates **only the
human-readable text**, leaving code, links, JSX components, and locked
frontmatter byte-identical. It does this with a **protect → translate →
restore** pipeline over a remark AST, gates every output with a **deterministic
validator**, and can have a **second LLM judge** the result. Nothing in the
engine knows about any specific project - every project-specific decision
(which fields translate, where files live, which model, brand list, glossary,
terminology guidance) arrives through a **config module**. One engine, many
projects.

---

## 2. Layered architecture

The code is organized in strict dependency layers - each layer only imports
from layers below it, which is what keeps the modules small and cycle-free.

```
┌── CLI dispatch ─────────────────────────────────────────────┐
│  cli.ts            parse argv → load config → call a command │
│  commands/*.ts     status·translate·sync·validate·judge      │
│  cli-support.ts    scopeFiles · settings-from-config ·        │
│                    report writer · printViolations           │
└───────────────┬─────────────────────────────────────────────┘
                │ each command composes the engine below
┌── Engine (project-agnostic) ────────────────────────────────┐
│  pipeline.ts (barrel) → pipeline/*   protect/translate/restore│
│  validate.ts     Layer-1 deterministic validator             │
│  judge.ts        Layer-2 LLM-as-judge                        │
│  incremental.ts   sync 3-way merge: split·diff-splice·fm     │
│  prompt.ts       prompt templates + Translator factory       │
│  providers/*     anthropic·gemini·openai·ollama             │
└───────────────┬─────────────────────────────────────────────┘
                │ configured by
┌── Config & primitives ──────────────────────────────────────┐
│  config.ts       load .mjs config + .env, resolve paths      │
│  types.ts        ProjectConfig, FieldContract, Provider, …    │
│  discover.ts     glob sources → missing/done per target      │
│  memory.ts · frontmatter.ts · tokens.ts · chunk.ts · git.ts  │
└─────────────────────────────────────────────────────────────┘
```

**Key boundary:** the engine layer never imports from `commands/` or reads
`process.argv`. A command reads config + flags and calls
`translateMarkdownFile` / `validateTranslation` / `judgeTranslation`. This is
what lets the same engine be driven by the CLI _or_ embedded in another app
(e.g. a web UI) with no change.

---

## 3. Full module map

| Module                             | Role                                                                                                                                                                             | Change it when…                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `src/cli.ts`                       | argv parse + dispatch to a command (≈140 lines)                                                                                                                                  | adding a flag or a command              |
| `src/commands/status.ts`           | per-locale missing/done counts                                                                                                                                                   | -                                       |
| `src/commands/translate.ts`        | translate → validate → write, concurrency pool, run report                                                                                                                       | changing the translate flow             |
| `src/commands/validate.ts`         | audit existing translations                                                                                                                                                      | -                                       |
| `src/commands/judge.ts`            | sample → judge → (`--fix`) re-translate → re-judge                                                                                                                               | changing the judge/fix flow             |
| `src/commands/sync.ts`             | incremental **sync**: read EN@base (git or `--base-file`), per file/locale splice the changed blocks or full-translate a new page, validate, write                               | changing the sync flow                  |
| `src/cli-support.ts`               | **shared** command helpers: `scopeFiles`, `filterTargetLocales`, `validateSettingsFrom` / `promptSettingsFrom` / `pipelineOptionsFrom`, `makeAppendingReport`, `printViolations` | anything used by ≥2 commands            |
| `src/config.ts`                    | load config module + sibling `.env`, absolutize paths, build contract sets, load glossary                                                                                        | changing config resolution              |
| `src/types.ts`                     | every shared type + the field-contract decision functions (`isTranslatableValue`)                                                                                                | adding a config field or type           |
| `src/discover.ts`                  | glob sources (via `tinyglobby`), compute `missing`/`done` per target (parallel `fs.access`)                                                                                      | changing discovery/state                |
| `src/pipeline.ts`                  | **barrel** - re-exports the public pipeline surface                                                                                                                              | keep in sync when adding public exports |
| `src/pipeline/index.ts`            | `translateMarkdownFile` orchestrator + `stringifyDocument`                                                                                                                       | changing the top-level file flow        |
| `src/pipeline/options.ts`          | `PipelineOptions` type                                                                                                                                                           | adding a pipeline option                |
| `src/pipeline/protect.ts`          | masking/restore: `protectAstNodes` (by MDX node type, restored from source bytes), `extractProtectedBlocks`, fenced-block protection, `restorePlaceholders`                      | changing what gets masked               |
| `src/pipeline/frontmatter-walk.ts` | contract-driven `collectNode`/`applyNode` + scalar sanitizer                                                                                                                     | changing frontmatter handling           |
| `src/pipeline/translate-text.ts`   | dedup+batch+retry (`translateMany`), token-integrity checks, HTML tag-split, component attributes                                                                                | changing how text is sent to the model  |
| `src/pipeline/body.ts`             | the markdown-body protect→translate→restore orchestrator                                                                                                                         | changing body handling                  |
| `src/pipeline/component-block.ts`  | the multi-frontmatter `<ComponentBlock>` special case                                                                                                                            | -                                       |
| `src/prompt.ts`                    | prompt templates, the rule constants, `styleGuideFor`, the `Translator` factory, JSON batching                                                                                   | changing prompt wording/rules           |
| `src/tokens.ts`                    | **single source of truth** for placeholder-token regexes                                                                                                                         | adding a token type                     |
| `src/chunk.ts`                     | shared greedy index chunker                                                                                                                                                      | -                                       |
| `src/incremental.ts`               | **pure 3-way merge core** for `sync`: `splitBlocks`, `spliceBody` (block diff via `diffArrays`), field-level frontmatter merge, `syncDocument` - no I/O, translators injected    | changing the splice/merge logic         |
| `src/git.ts`                       | batch git reader (`openGitReader`): repo root + `--base` ref resolved once, then `git show <ref>:<file>` per file; fail-fast on a bad ref                                        | changing how the "old" EN is read       |
| `src/validate.ts`                  | Layer-1 validator; `Violation` codes                                                                                                                                             | adding a structural check               |
| `src/judge.ts`                     | Layer-2 LLM-as-judge; `JudgeScore`                                                                                                                                               | changing judge scoring                  |
| `src/memory.ts`                    | per-locale translation memory (sorted JSON)                                                                                                                                      | -                                       |
| `src/frontmatter.ts`               | custom YAML serializer + source-hygiene fixers                                                                                                                                   | YAML formatting rules                   |
| `src/providers/index.ts`           | **provider registry** + `fetchWithRetry` + `requireApiKey`                                                                                                                       | adding a provider                       |
| `src/providers/<name>.ts`          | one `Provider` per engine                                                                                                                                                        | a provider's request/response shape     |
| `configs/*.mjs`                    | one config per consuming project + glossaries                                                                                                                                    | onboarding/adjusting a project          |
| `scripts/estimate-cost.ts`         | standalone cost estimator (not wired to the engine)                                                                                                                              | see `scripts/README.md`                 |
| `tests/pipeline.test.ts`           | real pipeline vs. mock translator - the safety net                                                                                                                               | keep green on every change              |

---

## 4. Data flow

### One `translate` run

```
argv -> cli.ts -> cmdTranslate
  loadConfig(.mjs + .env) -> ResolvedConfig
  discover() -> [{ relPath, sourceAbs, targets:{code:{state,targetAbs}} }]
  scopeFiles(--file/--dir) -> eligible files
  for each target locale:
    makeTranslatorFor(provider) -> Translator { one, many }   // via registry
    for each file (concurrency pool):
      translateMarkdownFile(source, translator, pipelineOptionsFrom(cfg,mem))
        ├─ quoteUnquotedBraceValues (frontmatter hygiene)
        ├─ frontmatter: collectNode → translateMany → applyNode
        └─ body: remark+mdx parse → protectAstNodes (by node type)
                 → translate component attributes → stringify
                 → protect fences/patterns → translateProseWithTokenCheck
                 → restore (longest-key-first)
      validateTranslation(source, output)  ── errors? ─-> report + exit-code 2
      write output (ALWAYS, even on validator errors)
      saveTM (after every file)
    append run report (append-as-you-go)
```

Two deliberate invariants show up here:

- **Always write.** A validator error is recorded and flags exit code 2, but
  the file is still written - `judge --fix` is the repair pass, so a bad
  translation never leaves a _stale/missing_ target behind.
- **Persist as you go.** TM and the run report are flushed after each file, so
  an interrupted run keeps everything done so far.

### One `sync` run (incremental)

`sync` reuses the same translator, validator, and writer, but instead of
translating whole files it re-translates **only the blocks that changed**
between two versions of the EN source, preserving the existing translation for
everything else. See [FLOW.md](FLOW.md) for the file-by-file trace.

```
argv -> cli.ts -> cmdSync
  loadConfig -> ResolvedConfig
  openGitReader(sourceDir, --base)     // repo root + ref verified ONCE, fail-fast
  discover() + scopeFiles(--file/--dir) -> the changed EN pages
  per file: EN-new = working tree, EN-old = git show <base>:file  (CRLF→LF)
            EN-old == EN-new ? -> SKIP (unchanged)
  for each target locale (concurrency pool):
      brand-new EN / locale not translated yet
        -> translateMarkdownFile(EN-new)                    // full translate
      else -> syncDocument(EN-old, EN-new, target-old)
                ├─ body: splitBlocks -> diffArrays(old,new)
                │    unchanged run  -> keep the target's block  (no model call)
                │    changed/added  -> translateBlock           (protect→translate→restore)
                │    block counts diverged -> ABORT, write nothing
                └─ frontmatter: field-level 3-way merge (keep vs. translate)
      validateTranslation(EN-new, output)   // the SAME deterministic validator
      write output (unless --dry-run) · saveTM (per locale)
  exit 2 on any abort or validator error
```

Two sync-specific invariants:

- **Preserve, don't re-do.** An unchanged block keeps its existing (human)
  translation byte-for-byte; only changed/added blocks reach the model - the
  90%-case workflow where someone edits one paragraph of an EN page.
- **Fail loud** An unresolvable `--base` (typo, or a CI shallow
  clone) or a diverged block structure stops with a clear error / abort - never a
  silent full-translate over precious existing translations. The "old" EN comes
  from git (`--base <ref>`, default `HEAD`) or `--base-file` for git-free runs.

---

## 5. How the config drives everything

A config is a plain ES module (`configs/*.mjs`) exporting a `ProjectConfig`
(default export). `config.ts` loads it, loads a sibling `.env`, absolutizes
paths, builds the contract into `Set`s, loads the glossary, and returns a
`ResolvedConfig`. Because `config.ts` spreads `...cfg`, **any new optional
field you add to `ProjectConfig` flows through automatically** - you only wire
it where it's consumed.

The three "how should it read" levers, in order of hardness:

| Lever            | Enforcement                                                                                                  | Use for                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `doNotTranslate` | **Hard** - prompt-instructed AND validator-enforced (a term whose count drops is a `brand-translated` error) | firm brand/product names that must stay English                               |
| `glossary`       | **Mandated per-locale rendering** - in the prompt, checked by the judge                                      | a term with one approved translation                                          |
| `styleGuide`     | **Advisory** - injected into the translate _and_ judge prompts                                               | register/terminology nuance ("neutral Spanish, keep component names English") |

The field contract (`translatable`/`preserve`/`assets`/`enumKeys`/`enums`)
decides _which values may change_; `isTranslatableValue` in `types.ts` is the
single decision used by **both** the pipeline writer and the validator, so they
can never disagree.

---

## 6. How to extend it

### Add a translation provider

1. Create `src/providers/<name>.ts` exporting a factory that returns a
   `Provider` (`{ id, model, complete(prompt, opts) }`) - copy an existing one
   (`anthropic.ts` is the simplest); use `fetchWithRetry` + `requireApiKey`.
2. Add its id to the `ProviderConfig['id']` union in `types.ts`.
3. Add one line to the `REGISTRY` in `providers/index.ts`:
   `<name>: { provider: <name>Provider }`.
   That's it - `createProvider` and `makeTranslatorFor` resolve by id.

### Add or change a CLI command

1. Add `src/commands/<name>.ts` exporting `cmd<Name>(cfg, locales, …)`.
2. Reuse `cli-support.ts` helpers - don't re-implement scoping, settings, or
   report writing.
3. Register it in the `switch` in `cli.ts` and add a `--flag` to `parseArgs` if
   needed. Update the `HELP` string.

### Change what the model sees / how text is masked

Work in `src/pipeline/`. Masking lives in `protect.ts`; the "send to model"
logic (batching, retries, HTML) in `translate-text.ts`. There is no
source-rewriting stage before the parser any more: MDX constructs are typed
nodes, so anything structural is handled by node type in `protectAstNodes`
rather than by a regex over raw text. If you add a new placeholder token shape, register it in
`src/tokens.ts` (one place) so the validator sees it too. Add a
regression test to `tests/pipeline.test.ts`.

### Add a prompt rule or tune terminology

Global wording lives as rule constants in `src/prompt.ts` (each documents the
observed failure that motivated it - follow that pattern). Project-specific
terminology goes in a config's `styleGuide` (string = all locales, or
`{ [code]: string }` per locale) - no code change needed.

### Add a structural validator check

Add a `ViolationCode` + a check in `src/validate.ts` (keep it PURE - no IO),
and a test asserting it fires. Remember `error` blocks nothing at write time
but sets exit code 2 and is what `judge` surfaces as "VALIDATOR DISAGREES".

### Support a new project

Write `configs/<project>.config.mjs` (copy a bundled one). Required:
`name`, `root`, `source`, `targets`, `contract`, `provider`. See the config
table in [README.md](README.md#writing-a-project-config) for every field.
Nothing in `src/` changes - that's the whole point.

---

## 7. Testing & the safety net

`npm run check` = Prettier (`format:check`) + oxlint (`lint`) + `tsc --noEmit`
(`typecheck`) + `npm test`. The test suite runs the **real pipeline** against a
deterministic mock translator (uppercasing) and asserts every structural
invariant and every validator code - no network. It is the contract that lets the
engine change with confidence: **keep it green**, and add a test with every
behavioral change.

---

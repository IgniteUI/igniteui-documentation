# translate-engine

> **In this repository.** This is the vendored copy in `tools/translate-engine/` of the docs
> repository ([PROVENANCE.md](PROVENANCE.md)). The configs this README names
> (`configs/docs-template-*.config.mjs`, the mockup and marketing configs, a root `.env.example`)
> and its GitHub Actions CI recipe are not part of this copy. Here the configs are
> `configs/docs-xplat.config.mjs` and `configs/docs-angular.config.mjs` (shared factory
> `configs/docs-shared.mjs`), the glossary is `docs/translation/glossary.json` at the repository
> root, API keys go in `configs/.env` (template `configs/.env.example`), and runs are driven by
> the `/translate`, `/translate-all`, `/retranslate` and `/translate-list` skills - see
> [`TRANSLATION.md`](../../TRANSLATION.md) and [`CLAUDE.md`](CLAUDE.md). `MODEL-EVALUATION.md`,
> `NATIVE-REVIEW-LEARNINGS.md` and `REMARK-MDX-MIGRATION.md` are under
> [`docs/history/`](docs/history/). Everything else here describes the engine itself and applies
> unchanged.

Markdown/MDX translation engine with validation and LLM judge scoring

Project-agnostic, structure-preserving markdown/MDX translation pipeline with
built-in validation and LLM-judge quality scoring. One toolkit serves many
content projects the Ignite UI docs (Angular + xplat), marketing sites, or
anything else with markdown content - **each project supplies its own config**:
field contract, ignore rules, path layout, glossary, brand list, and provider.

The pipeline is a port of the production-tested `translation-manager`
(Reveal marketing site): protect → translate → restore on a GFM-aware remark
AST, contract-driven frontmatter, dedup + JSON batching, translation memory,
and tag-split HTML translation. New here: pluggable cloud providers
(Anthropic / Gemini / OpenAI / Ollama), a structural validator that gates
every write, and an LLM-as-judge layer.

## How it works

For each English `.md`/`.mdx` file, the pipeline **protects** everything that
isn't prose (code, links, JSX components, locked frontmatter fields) behind
placeholder tokens, **translates** only the visible text - frontmatter by a
per-project field contract, the body over a GFM-aware remark AST, with dedup +
JSON batching and a translation-memory cache - then **restores** the protected
constructs byte-for-byte. Every output is checked by a deterministic
**validator** (which gates the write) and can be scored by a second **LLM
judge**.

A validator error doesn't block the write: a flawed file is still written and
flagged (**exit code 2**), and `judge --fix` is the downstream repair pass - so a
run never leaves a stale/missing target behind. There's **no staleness
tracking** - `status` reports `missing`/`done` by target-file existence only, and
re-translating after a source edit is a deliberate call: `translate --file` to
redo a whole file, or **`sync`** to re-translate only the blocks that changed
between two versions of the EN source, preserving the rest of the existing
(human/precious) translation byte-for-byte.

See **[FLOW.md](FLOW.md)** for the full file-by-file trace of a `translate` run.

## Quick start

```bash
npm install
npm run check                               # format + lint + typecheck + pipeline self-test (no network)

cp .env.example configs/.env                # add your API key(s)

npx tsx src/cli.ts status    --config configs/docs-template-angular.config.mjs
npx tsx src/cli.ts translate --config configs/docs-template-angular.config.mjs --locale kr --limit 5
npx tsx src/cli.ts sync      --config configs/docs-template-angular.config.mjs --locale kr --file components/foo.mdx   # after editing foo.mdx: re-translate only the changed blocks

npx tsx src/cli.ts sync --config configs/docs-template-xplat.config.mjs --locale bg --file "components/ai/ai-assisted-development-overview.mdx"

npx tsx src/cli.ts sync --config configs/docs-template-xplat.config.mjs --locale es,ja,bg --file "components/ai/new-file.test.mdx"

npx tsx src/cli.ts validate  --config configs/docs-template-angular.config.mjs --locale kr
npx tsx src/cli.ts judge     --config configs/docs-template-angular.config.mjs --locale kr --sample 5
```

Start with `--limit 5` and inspect the output files before a full run.

## Commands

| Command     | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`    | Per-locale `missing / done` counts (`--list` for per-file detail, `--json` for CI)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `translate` | Translate `missing` files (default). `--file <rel>`/`--dir <rel>` (every file under a folder, nested subfolders included) SCOPE which files are eligible but still only act on `missing` ones unless combined with `--all`, which is the only flag that forces re-translation of already-done files. Every file is validated and always written, even on validator errors (`judge`/`judge --fix` is the downstream pass that catches and repairs those). `--dry-run` writes nothing. Exit code 2 when anything failed validation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `sync`      | **Incremental update** - propagate an EN content change to translations that already exist. Per file per locale it auto-picks: a **changed** page is **spliced** (only the changed blocks re-translate; every unchanged block keeps its existing human/precious translation byte-for-byte), while a **new** page - or a locale with no translation yet - is **fully translated** from scratch. The "old" EN is read from a git ref (`--base <ref>`, **default `HEAD`**, i.e. the last commit vs. your working tree) or from a local file (`--base-file <path>`, git-free, single `--file` only). Same `--file`/`--dir` scoping as `translate`. A splice **aborts** (writing nothing) when the target's block structure no longer lines up with the old EN, rather than mis-place a block - re-translate that file in full instead. An unresolvable `--base` (typo, or a CI shallow clone that never fetched the base branch) is a hard error, never a silent full re-translate. The **same deterministic validator** runs on the result. `--dry-run` writes nothing. **Exit code 2** on any abort or validator error. |
| `validate`  | Re-check already-written translations against their EN sources (audit mode).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `judge`     | LLM quality scores - four dimensions (accuracy / completeness / terminology / fluency) **plus an `overall`** score, each 1–5 - on an evenly-spread sample. `overall` is what the `--fix` `≤ 3` threshold and the run summary use. Every file is also re-checked with the deterministic validator. **`--fix`**: a file scoring **≤ 3** is re-translated with the judge's issues fed back, re-validated (held back if the fix breaks structure) and re-judged. A **true disagreement** - judge scored it **> 3** but the validator found a real defect - is **not** auto-fixed: the fix is skipped and **both** the judge's and the validator's findings are logged ("VALIDATOR DISAGREES") to the console and md report for human review. Appends `judge-<project>.json` (full history) and `judge-<project>.md` (human-readable).                                                                                                                                                                                                                                                                                     |

## Writing a project config

A config is a JS module (`.mjs`) - data plus, where needed, functions. See
[configs/](configs/) for three complete examples. The important fields:

| Field                                          | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`, `source.dir`, `source.include/exclude` | Where the EN content lives; project ignore rules (globs: `**`, `*`, `?`)                                                                                                                                                                                                                                                                                                                                                                                                                |
| `targets[]`                                    | Locale code + clear **English** language name (+ `dir` for simple layouts)                                                                                                                                                                                                                                                                                                                                                                                                              |
| `targetPathFor(rel, target)`                   | Override when the locale is a middle path segment (`blog/en/post.md`)                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `contract`                                     | `translatable` / `preserve` / `assets` / `enumKeys` / `enums` field names - which frontmatter values may translate                                                                                                                                                                                                                                                                                                                                                                      |
| `doNotTranslate`                               | Brand/product names kept verbatim (longer compounds first: `"Reveal Live"` before `"Reveal"`). Prompt-instructed AND validator-enforced: if a term's count drops between source and translation, it's flagged as an error in the run report                                                                                                                                                                                                                                             |
| `preserveNames`                                | UI component/feature names kept in English with **exact capitalization** (`['Tree Grid', 'Data Grid', 'Grid', 'Chart', …]`). **Deterministically masked** byte-for-byte (the model never sees them, so "Tree Grid" can't become "Cuadrícula de Árbol"), case-sensitive & whole-word (`Grid` preserved, common-noun `grid` still translates), AND added to the do-not-translate rule + validator. The docs configs load a shared `~65`-name list from `configs/docs-component-names.mjs` |
| `glossary`                                     | Approved per-locale terminology (inline or JSON path). Fill/maintain it with the `scripts/` tools - see below                                                                                                                                                                                                                                                                                                                                                                           |
| `protectPatterns`                              | Extra regexes protected byte-for-byte (`{environment:*}` tokens…)                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `skipBodyWhen(fm)`                             | Keep a file's body verbatim (Reveal's sectioned pages)                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `promptContext`                                | One sentence describing the content domain, injected into every translate/judge prompt                                                                                                                                                                                                                                                                                                                                                                                                  |
| `styleGuide`                                   | Terminology/register guidance injected into every translate **and** judge prompt - a plain string (all locales) or `{ [code]: string }` (per-locale). The lever for "how should this read" (neutral register, keep established English component/product names, follow a vendor terminology standard), distinct from `glossary` (specific terms) and `doNotTranslate` (hard brand list)                                                                                                 |
| `bodyMode`                                     | `'auto'` (default, html-sniffs the body) / `'markdown'` / `'html'` / `'skip'`                                                                                                                                                                                                                                                                                                                                                                                                           |
| `frontmatterStyle`                             | YAML formatting overrides: `forceQuoteFields` forces quoting on specific keys; `forceFlowFields` keeps a locked array field one-line (`["A", "B"]`) instead of js-yaml's default multi-line block sequence - see `src/frontmatter.ts`                                                                                                                                                                                                                                                   |
| `dataDir`                                      | Where translation memory and judge reports live (default `.translation-data/<name>`) - safe to share across projects (see the bundled configs)                                                                                                                                                                                                                                                                                                                                          |
| `provider` / `judge`                           | Model + `apiKeyEnv`. Judge should be a **different model** (ideally vendor) than the translator                                                                                                                                                                                                                                                                                                                                                                                         |

Keys live in the environment or a `.env` next to the config - never in the
config itself. CI supplies them as repository secrets.

### Bundled configs

- `docs-template-angular.config.mjs` - Ignite UI Angular docs (`docs/angular`), EN → KR. `jp` is deliberately not a target (human-translated upstream).
- `docs-template-xplat.config.mjs` - cross-platform docs (`docs/xplat`).
- `marketing-reveal.config.mjs` - Reveal marketing site: locale-in-the-middle layout, sectioned pages, full field contract from the Astro schema.

## Choosing a model (test matrix)

API cost is a rounding error at this scale (~450 docs ≈ a few dollars per
locale even on premium models, and batch/incremental runs shrink it further) -
so pick by **quality on your language pair**, verified with `judge` plus native
review. Suggested matrix, cheapest screening first:

| Role                    | Model                                           | Why                                                                                                                                                                                                      |
| ----------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Baseline translator     | `claude-haiku-4-5`                              | $1/$5 per MTok; strong structured-instruction following                                                                                                                                                  |
| Quality translator      | `claude-sonnet-5`                               | $3/$15 ($2/$10 intro to Aug 2026); noticeably better CJK prose                                                                                                                                           |
| Alt translator          | `gemini-3.5-flash`                              | $1.50/$9; fast, good multilingual coverage                                                                                                                                                               |
| Alt (premium)           | `gemini-3.1-pro`                                | $2/$12+; Gemini's quality tier                                                                                                                                                                           |
| Alt translator (OpenAI) | `gpt-5.5` (`openai` provider, `OPENAI_API_KEY`) | Cross-vendor comparison point - strong MDX/structure adherence per early testing; verify against your own `judge` runs before trusting it in production                                                  |
| Screening only          | `gemini-2.5-flash-lite`                         | $0.10/$0.40; pipeline smoke tests, not production prose                                                                                                                                                  |
| Local / free            | Ollama (e.g. `gemma3`)                          | Pipeline development without API cost; weakest CJK quality                                                                                                                                               |
| Author's own seat       | `exchange` provider (no API key)                | Prompts go through files and the model behind a Claude Code session (or a person) answers them - the `/translate`-skill shape. See `src/providers/exchange.ts` and `MODEL-EVALUATION.md` §7 experiment 4 |
| Judge                   | a different model than the translator           | No self-grading blind spot (e.g. translate with `gpt-5.5`, judge with `gemini-2.5-pro` or `claude-opus-4-8`)                                                                                             |

Calibration tip (docs): translate ~20 files EN→JA with each candidate and
compare against the existing human JP translations - terminology choices, what
stays English, tone. Pick the model that matches human conventions best, then
point it at KR/ES/BG.

### Per-language model routing

`provider` / `judge` at the top of a config are the project **defaults**. Any
target may override either with a **partial** block, merged over the default -
so "translate Bulgarian with a Bulgarian-specialised model, Japanese with a
CJK-strong one, judge Japanese with Opus" is one config and one run:

```js
provider: { id: 'ollama', model: 'translategemma:27b', url: 'http://10.20.14.98:11434', concurrency: 1 },
judge:    { id: 'anthropic', model: 'claude-sonnet-5', apiKeyEnv: 'ANTHROPIC_API_KEY' },

targets: [
  { code: 'es', name: 'Spanish',    dir: '…/es' },                              // both defaults
  { code: 'bg', name: 'Bulgarian',  dir: '…/bg', provider: { model: 'bggpt-…' } }, // same backend, other model
  { code: 'ja', name: 'Japanese',   dir: '…/ja',
    provider: { model: 'qwen2.5:72b' },
    judge:    { model: 'claude-opus-5' } },                                     // different reviewer for ja
],
```

Two merge rules worth knowing:

- **Omit `id`** and you keep the project backend, swapping only the fields you
  name - `url`, `concurrency` and `apiKeyEnv` are inherited.
- **Name a different `id`** and the override starts **clean**: backend-specific
  fields are deliberately _not_ inherited, because they belong to the old
  backend. Switching an Anthropic project to Gemini for one locale would
  otherwise inherit `ANTHROPIC_API_KEY` and authenticate with the wrong vendor's
  key. Such an override must carry its own `model` (and its own `apiKeyEnv`).

`concurrency` is resolved **per locale**, so one run can drive a local Ollama
target serially while a cloud target runs 4-wide. `judge` warns when a locale's
judge and translator resolve to the same model - that's the self-grading blind
spot the judge layer exists to avoid, and a per-locale translator override can
collide with a project-level judge without you noticing.

Verify a language-specific model actually wins on that language before adopting
it - a 9B specialist does not automatically beat a 27B generalist. That is what
`judge --locale <code>` is for.

## CI (GitHub Actions, in the content repo)

Save as `.github/workflows/translate.yml` in the content repo. Note the
**exit-code handling**: `translate` **always writes** the files, so exit `2`
(validator flagged issues) is a _warning that shouldn't block the PR_ - the
downstream `judge`/human review catches those - while exit `1` (a real
config/usage error) _should_ fail the job.

```yaml
on:
  push: { branches: [master], paths: ['docs/xplat/src/content/en/**'] }
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4                      # content repo
      - uses: actions/checkout@v4
        with: { repository: your-org/translate-engine, path: toolkit }
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci --prefix toolkit

      - name: Translate (tolerate validation errors, fail on real errors)
        run: |
          set +e                                       # don't abort the step on non-zero
          npx tsx toolkit/src/cli.ts translate \
            --config toolkit/configs/docs-template-xplat.config.mjs --locale ja --dir "components/grids/tree-grid"
          code=$?
          if [ "$code" = "2" ]; then
            echo "::warning::Validator flagged issues - files were written; review the report before merging."
          elif [ "$code" != "0" ]; then
            echo "::error::translate failed (exit $code)"; exit "$code"   # exit 1 etc. → fail the job
          fi
        env: { OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }} }

      - name: Judge (sample)
        run: npx tsx toolkit/src/cli.ts judge --config toolkit/configs/docs-template-xplat.config.mjs --locale ja --sample 10
        env: { GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }} }

      - uses: actions/upload-artifact@v4               # attach the run + judge reports for review
        if: always()
        with: { name: translation-reports, path: 'toolkit/configs/.translation-data/**/reports/*.md' }

      - uses: peter-evans/create-pull-request@v6       # translations land via PR, never direct
        with: { branch: translations/auto, title: 'chore: update machine translations' }
```

**Why this shape:** `set +e` stops the shell from aborting on `npx`'s non-zero
exit; we capture `$?` and branch - **exit 2 → a GitHub `::warning::` annotation
and continue** (the PR still opens with the flagged files for human review),
**exit 1 (or anything else non-zero) → `::error::` and fail the job.** The
report is uploaded as an artifact either way (`if: always()`). Merge gates then
stay in the content repo: the locale build (`astro build`), link checks, and the
attached judge/validation reports for human eyes.

## Documentation

Each doc has one job - start at the top and follow the link you need:

| Doc                                | What it covers                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **README.md** (you are here)       | install, commands, writing a config, choosing a model, the CI recipe                                                                    |
| [ARCHITECTURE.md](ARCHITECTURE.md) | how the layers are wired, recipes (add a provider / command / pipeline stage / project), and the guarantees the system protects         |
| [FLOW.md](FLOW.md)                 | a full file-by-file execution trace of one `translate` run (plus masking/restore & frontmatter-ordering deep-dives) and the `sync` path |
| [VALIDATION.md](VALIDATION.md)     | every validator check with a concrete before→after example                                                                              |
| [DEPENDENCIES.md](DEPENDENCIES.md) | why each npm dependency is here (and why providers use plain `fetch`)                                                                   |

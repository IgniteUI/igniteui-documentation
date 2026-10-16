# Provenance of tools/translate-engine

A vendored copy of the **translate-engine** (structure-preserving Markdown/MDX translation with a
deterministic validator and an LLM judge), used by the `/translate`, `/translate-all` and
`/translate-list` skills - see [`TRANSLATION.md`](../../TRANSLATION.md).

| | |
| --- | --- |
| Source | Stamen Stoychev's local `translate-engine` repository (`C:\Users\SStoychev\Documents\Git\translate-engine`), branch `sstoychev/remark-mdx` |
| Revision | commit `c8cd749` ("docs(eval): what the JP native-check skill teaches the pipeline; anchor-check") **plus uncommitted working-tree changes** of that checkout |
| Copied | 2026-10-08, from the working tree (not from git) |

The uncommitted changes carried over are the ones this repository depends on:

- `src/providers/exchange.ts` (new) - the `exchange` provider: prompts and answers go through
  files, with `record` / `replay` modes and numbered answer files for retries;
  `src/providers/index.ts` and `src/types.ts` register it.
- `scripts/exchange-pending.ts` (new) - lists the prompts an exchange directory waits on.
- `src/commands/judge.ts` - a judge prompt without an answer skips the file instead of failing.
- `src/prompt.ts`, `src/cli-support.ts` - the keep-list split: brand names "never translate",
  UI component names "keep where the word names the component".
- `configs/docs-style-guide.mjs` - the Japanese component-naming rule stated by the JP reviewers
  (2026-09-30) and the half-width-space rule.
- `tests/exchange-provider.test.ts` (new), `tests/prompt.test.ts`, `scripts/README.md`.

## What is here

Copied **byte-for-byte** (verified identical to the source working tree): `src/`, `scripts/`,
`tests/`, `package.json`, `package-lock.json`, `tsconfig.json`, `.oxlintrc.json`,
`.prettierrc.json`, `.prettierignore`, `configs/docs-component-names.mjs`,
`configs/docs-style-guide.mjs`, `configs/glossaries/docs-locales.json` (moved to `docs/translation/glossary.json` in this repo). Their mixed CRLF/LF line
endings come from the source checkout; git normalizes them when they are added.

Written for this repository (not upstream):

- `configs/docs-shared.mjs` - one factory for both content trees: repository root, the locale
  mapping (`ja` -> `jp/`, `kr`, `es`, `pt-br`), the `exchange` translator/judge, per-run exchange
  directories, the data directory, and the exclusion of gitignored (generated) pages.
- `configs/docs-xplat.config.mjs`, `configs/docs-angular.config.mjs` - the per-tree fields, carried
  over unchanged from the engine's `docs-template-xplat` / `docs-template-angular` configs
  (brand list, prompt context, translatable attributes, frontmatter style).
- `configs/.env.example`, `CLAUDE.md` (map of this copy for agents), this file.
- `data/` - created by runs: `tm/` (translation memory, tracked), `runs/` and `reports/`
  (gitignored).

The engine's documentation, from the same working tree: `ARCHITECTURE.md`, `FLOW.md`,
`VALIDATION.md` and `DEPENDENCIES.md` byte-for-byte; `README.md` with an "In this repository" note
added after its title and nothing else changed; the history/rationale documents
`MODEL-EVALUATION.md`, `NATIVE-REVIEW-LEARNINGS.md` and `REMARK-MDX-MIGRATION.md` in `docs/history/`,
each with a one-paragraph "Historical document" preface added after its title (their paths and
commands refer to the engine repository).

Not copied: the engine's `.env` (its Anthropic key is invalid anyway), `.translation-data/`,
`mockup-*/`, `reports/`, `node_modules/`, git metadata, the husky/lint-staged hook setup, the
mockup/marketing configs and glossary, `commandUsed`.

`package.json` still has `"prepare": "husky"`; it is inert here because husky does nothing
without a `.git` directory in this folder (checked: `core.hooksPath` of this repository is
unchanged after `npm ci`).

## Checks

```bash
npm ci --prefix tools/translate-engine
cd tools/translate-engine && npm test && npm run typecheck && npm run lint
npx tsx src/cli.ts status --config configs/docs-xplat.config.mjs
npx tsx src/cli.ts status --config configs/docs-angular.config.mjs
```

At copy time: 103/103 tests pass, typecheck and lint are clean, both configs load.

## Updating from upstream

Re-copy the byte-for-byte files listed above and re-run the checks. **Do not overwrite
`docs/translation/glossary.json` blindly**: the `/translate` fix step proposes glossary
corrections here, on the branch, so this copy is the live one - merge the two.

Behaviours the skills work around, worth fixing in the engine itself:

- the validator compares frontmatter shape with the EN page, so target-only keys (`_language`, the
  `_translation` stamp) read as a `shape-mismatch`;
- `sync` rebuilds frontmatter from the EN keys and drops target-only keys (`_language`, the stamp);
- a JSON batch with no answer is swallowed and silently replaced by single-string prompts, which a
  record pass never sees.

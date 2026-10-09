# remark-mdx migration — working guide

> **Historical document.** Written in the translate-engine repository (branch
> `sstoychev/remark-mdx`, up to commit `c8cd749` plus uncommitted changes, October 2026) while the
> engine was being built and evaluated, and copied here unchanged for its rationale and
> measurements. Paths, commands and configs in it refer to that repository - the pilot configs
> (`configs/pilot-config.mjs`, `configs/*-mockup.config.mjs`), the `mockup-*` trees,
> `configs/.translation-data/`, `reports/` - not to this vendored copy; for how the engine is laid
> out here see [`../../CLAUDE.md`](../../CLAUDE.md).

Branch: `sstoychev/remark-mdx`, cut from the tip of `sstoychev/harness-fixes`.
This document is the charter for that branch. It is written so a fresh session
can start from here without the conversation that produced it.

## The one-paragraph version

The engine parses MDX with a **CommonMark** parser (`remark-parse` +
`remark-gfm`, `src/pipeline/body.ts`). MDX is not CommonMark: imports, JSX tags
and `{expressions}` are all misread as prose, blockquotes or HTML blocks. Every
text-level preprocessor and most of the regex masking exists to compensate for
that misparse, one symptom at a time. Parsing with `remark-mdx` instead gives a
correct AST in which those constructs are typed nodes, so the compensation layer
can be retired rather than maintained. **Same translation approach, same
insertion point, smaller harness.**

## Status — complete, all six steps done and all success criteria met

The engine change is complete and verified deterministically. What landed:

- `remark-mdx` on both the parse and stringify pipelines.
- `protectAstNodes` masks `mdxjsEsm`, `mdxFlowExpression`/`mdxTextExpression`
  and `mdxJsx*Element` by node type, **restored from the source bytes** under a
  new `__JSX_n__` token. Elements with children are flattened (open tag,
  children, close tag) so the children translate and the serializer never
  indents them; adjacent opaque siblings that share a line break are coalesced
  into one mask (the `<ApiLink … /><br />` API-reference runs).
- Deleted: `src/pipeline/preprocess.ts` entirely
  (`collapseMultilineJsxOpenTags`, `isolateBareJsxLines`/`childDedents`,
  `mergeInlineHtmlElements`), `collectImportLines`/`restoreImportLines`, the
  JSX regex in `extractProtectedBlocks`, `translateComponentAttributes`, the
  import `protectPattern` in three configs, and the `translatableComponents`
  option (now automatic - the loader warns if a config still sets it).
- Also removed as newly dead: `convertKeysToIndented` / `wasOriginallyFenced`
  (MDX has no indented code blocks, so nothing can produce one) and the
  `unist-util-visit` dependency.

Two findings worth carrying forward:

1. **The old parser was losing real content.** On `column-pinning.mdx` the
   CommonMark parser found 29 code nodes where MDX finds 64 - 35 fenced blocks
   were being swallowed into misparsed blobs. Across the JP corpus the old
   engine changed 246 lines on an identity round trip and gave back only 186; a
   net 60 lines went missing with no model involved. The new engine is
   -191/+193 (see `scripts/roundtrip-report.ts`, below).
2. **Four-space-indented prose now translates.** CommonMark read it as a code
   block and the pipeline froze it; MDX has no such syntax, so it is a
   paragraph - which is what the Astro build always rendered. Same class of bug
   as the FAQ defect, found by the new tests rather than in production.

Verification, all clean:

- Identity audit on all five pilot corpora: `1 of 10`, `column-pinning.mdx`
  block #55 only - byte-identical to the pre-migration baseline. That block is
  the known source defect (a fence indented one space), not an engine bug.
- 95 tests pass. `tests/preprocess-fences.test.ts` and
  `tests/import-escaping.test.ts` are replaced by `tests/mdx-structure.test.ts`,
  which re-expresses every one of their cases through `translateMarkdownFile`.
- New: `scripts/roundtrip-report.ts` writes the full non-blank-line diff of an
  identity round trip to `reports/roundtrip-<project>.md`, for the review
  question the pass/fail audit cannot answer ("what exactly moved?").

Step 6, the real JP run (gpt-5.5 translator, Sonnet judge, same ten files):

| metric       | baseline  | this run | delta     |
| ------------ | --------- | -------- | --------- |
| accuracy     | 3.70      | 4.50     | +0.80     |
| completeness | 4.80      | 4.90     | +0.10     |
| terminology  | 3.60      | 3.90     | +0.30     |
| fluency      | 4.00      | 4.30     | +0.30     |
| **overall**  | 3.60-3.80 | **4.30** | **+0.50** |
| placeholders | 450/450   | 450/450  | =         |

Judge noise is ~0.14, so +0.50 is real. The criterion was "within noise of the
baseline"; it cleared the top of the range instead. No prompt, model or
glossary changed - the difference is content that used to be frozen as code
nodes now reaching the model as prose.

Five validator errors remain, none of them engine defects: the known
`column-pinning.mdx` block #55 (source fence indented one space); one
link-mismatch where the model turned bare anchor text into a markdown link; and
three cases of the model dropping or paraphrasing a masked `preserveNames`
token (`Grid`, `Pie Chart`, `Infragistics`). The categories the deleted
compensation layer used to guard - import-mismatch, tag-mismatch, leftover
tokens - are all clean.

Unrelated pre-existing issue noticed on the way: `npm run format:check` fails on
this Windows checkout for ~60 files nobody has touched, because `core.autocrlf`
is `true` while Prettier defaults to `endOfLine: "lf"`. A `.gitattributes` or
`"endOfLine": "auto"` in `.prettierrc.json` would settle it; left alone here as
out of scope.

## Why not translate somewhere else instead

This was checked against the real docs build before choosing this route.

- The docs build has a pre-HTML step (`docs/xplat/scripts/generate.mjs`), but
  its output is **still MDX** (0 `.md` files; imports, JSX and `{Component*}`
  tokens all survive) and it is **post-expansion**: 281 source files become
  ~1,140 generated ones across four platforms, with `{Platform}` baked in as
  literal text. Translating there costs ~4x and needs the same harness.
- Astro reads `src/content/{lang}` (angular directly; xplat via
  `generated/{platform}/{lang}`, derived from it). The per-language source
  tree is the designed insertion point and is where we already translate.

So: keep translating source MDX; change the parser.

## The current pipeline and what each piece compensates for

`translateBody()` in `src/pipeline/body.ts`, in order:

| step                                                     | where               | exists because CommonMark…                                                                                   |
| -------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `collapseMultilineJsxOpenTags`                           | `preprocess.ts`     | reads a bare `>` line as a blockquote                                                                        |
| `isolateBareJsxLines` (+ `childDedents`)                 | `preprocess.ts`     | absorbs adjacent JSX into HTML blocks; then 4-space child prose becomes an indented code block (the FAQ bug) |
| `translateComponentAttributes`                           | `translate-text.ts` | never sees JSX attributes as attributes — this is a regex over raw text                                      |
| `collectImportLines` / `restoreImportLines`              | `protect.ts`        | files `import X from '…'` as a paragraph and then escapes `_` and autolinks `@` inside it                    |
| `mergeInlineHtmlElements`                                | `preprocess.ts`     | splits `<a>text</a>` into three sibling nodes                                                                |
| import `protectPattern` in the configs                   | `configs/*`         | treats the import line as translatable prose                                                                 |
| `\{[A-Za-z]…\}` `protectPattern`                         | `configs/*`         | treats `{Platform}` as prose                                                                                 |
| `<Capitalized …>` regex mask in `extractProtectedBlocks` | `protect.ts`        | has no JSX node type                                                                                         |

Steps that are NOT compensation and should stay:

- `protectAstNodes` masking of `code` / `inlineCode` / `link` / `image` — these
  are real mdast nodes today and remain so.
- `preserveNames` masking and `doNotTranslate` — semantic, not structural.
- Frontmatter handling (`frontmatter.ts`, `index.ts`) — untouched by this work.
- Translation memory — untouched.
- The validator — it works on text, not the AST, and is the safety net here.

## What remark-mdx gives you

With `.use(remarkMdx)` the parser emits, in place of the misparses above:

| node type                                                                             | replaces                                                                                         |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `mdxjsEsm` — `import`/`export` statements                                             | import regex + collect/restore                                                                   |
| `mdxJsxFlowElement` / `mdxJsxTextElement` — `name`, `attributes[]`, `children[]`      | JSX regex mask, `collapseMultilineJsxOpenTags`, `isolateBareJsxLines`, `mergeInlineHtmlElements` |
| `mdxJsxAttribute { name, value }` (value: string or `mdxJsxAttributeValueExpression`) | `translateComponentAttributes` regex                                                             |
| `mdxFlowExpression` / `mdxTextExpression` — `{Platform}`                              | the `\{…\}` protectPattern                                                                       |

Two properties that matter:

- JSX **children are ordinary mdast**. `translatableComponents` (`DocsAside`,
  `Feature`) stop being special: their prose is just paragraph nodes under a
  JSX node. Check how `component-block.ts` and the `translatableComponents`
  option handle this today before deleting anything.
- Every node carries `position` with source offsets. **Restore masked nodes
  from the original source slice, not from the serializer.** That is what the
  placeholder map already does for code, and it is the single best defence
  against serializer drift (see risks).

## Plan

Do these in order. After every step: `npm test` and the identity audit.

```bash
# the regression gate for the whole migration - no model, no spend
npm run identity-check -- --config configs/jp-mockup.config.mjs --locale ja
```

Expected at the START (baseline): 1 of 10 files flagged, `column-pinning.mdx`
block #55 only. That one is a source defect (a fence indented one space, which
CommonMark strips by spec), not an engine bug — it is the only acceptable
residual at the END too.

0. **Baseline.** Run the audit on all five pilot corpora (`bg`, `jp`, `es`,
   `kr`, `pt-br` — configs in `configs/*-mockup.config.mjs`) and record output.
1. **Install.** `npm i remark-mdx` (brings `mdast-util-mdx`).
2. **Switch the parser and serializer** in `body.ts` — both the `parse` and the
   `stringify` pipelines get `.use(remarkMdx)`. Run the audit. **Expect it to
   fail.** Catalogue every difference; that catalogue is the work list.
3. **Extend `protectAstNodes`** for the new node types:
   - `mdxjsEsm` → opaque `__BLOCK_n__`, restored from source slice.
   - `mdxFlowExpression` / `mdxTextExpression` → opaque `__MDX_n__`.
   - `mdxJsx*Element` → mask the tag, restored from source slice; **recurse into
     `children`** so their prose is translated; for names in
     `translatableAttributes`, translate the listed attribute string values
     via the attribute nodes.
4. **Delete compensation code, one piece at a time**, verifying after each:
   `collapseMultilineJsxOpenTags` → `isolateBareJsxLines`/`childDedents` →
   `collectImportLines`/`restoreImportLines` and the import `protectPattern`
   in `configs/docs-template-*.config.mjs` and `configs/pilot-config.mjs` →
   the JSX regex in `extractProtectedBlocks` → `translateComponentAttributes`
   → `mergeInlineHtmlElements` (check the raw-HTML tag-split path in
   `translate-text.ts` is still reachable; it may be dead).
5. **Tests.** `tests/preprocess-fences.test.ts` guards the two preprocessors by
   name and will not compile once they are gone. Do not just delete it: its
   cases (fenced JSX untouched, FAQ prose not a code node, nested list shape
   kept) are the behaviours that shipped broken. Re-express them as
   whole-pipeline tests through `translateMarkdownFile` with the identity
   translator (`tests/helpers.ts`). Same for `tests/import-escaping.test.ts`.
6. **Real run.** One JP pass, gpt-5.5 translator, sonnet judge:
   ```bash
   JP_PROVIDER=openai JP_MODEL=gpt-5.5 JP_OUT=content/ja-mdx \
     npx tsx src/cli.ts translate --config configs/jp-mockup.config.mjs --locale ja
   JP_PROVIDER=openai JP_MODEL=gpt-5.5 JP_OUT=content/ja-mdx \
     npx tsx src/cli.ts judge --config configs/jp-mockup.config.mjs --locale ja
   ```
   Baseline to beat or match: 3.60-3.80 overall, 450/450 placeholders. Judge
   noise is ~0.14 on ten files (one untouched file drifted 4→3 between two
   runs of the same bytes), so only treat a move of ~0.3+ as real.

## Risks, in the order you will probably hit them

1. **Serializer drift.** `mdast-util-mdx-jsx` re-serializes attributes with its
   own quoting and spacing; `<Sample src="…" height={510} alt="…" />` may not
   come back byte-identical. The audit will show it. The fix is step 3's
   "restore from source slice" — if a masked node is restored from its original
   bytes, the serializer never touches it. Prose-level drift (remark escaping
   `_` or `*` in text) is a separate class; check identity on pages with
   underscores in prose.
2. **The stricter parser throws on invalid MDX.** The guarantee: every corpus
   file compiles in the docs build, so it is valid MDX. The caveat: the docs
   build runs a Vite pre-transform (`vitePluginPlatformTokens` in
   `docs/xplat/astro.config.ts`) that inlines `<PlatformBlock>` and substitutes
   tokens **before** MDX compilation. Confirm the raw source parses without
   that transform. Test on all ten pilot files before anything else.
3. **Lowercase tags are JSX too.** Under remark-mdx, `<div>`/`<span>`/`<a>`
   are `mdxJsxFlowElement`s, not `html` nodes. The `html` branch of
   `protectAstNodes` and the tag-split translator may go dead. Verify rather
   than assume.
4. **`translatableComponents` semantics.** Today some component wrappers are
   exempted from masking so their inner text stays in the prose stream. With
   real children this is automatic — but make sure nothing downstream still
   expects the old exemption.
5. **Frontmatter is separate and unaffected**, but `quoteUnquotedBraceValues`
   in `frontmatter.ts` runs before parsing and must keep running.

## Success criteria

- Identity audit clean on all five pilot corpora except `column-pinning.mdx`
  block #55.
- `body.ts` reduced to parse → protect → translate → restore, with no
  text-level preprocessing before the parse.
- Import handling, `{Placeholder}` handling and JSX masking all done by node
  type, with no regex over raw body text.
- All tests pass; every deleted test file is replaced by a whole-pipeline test
  covering the same defect, with the reason in the commit message.
- JP judge run within noise of the 3.60-3.80 baseline at 450/450 placeholders.

## Where things are

- Engine: `src/pipeline/body.ts` (entry), `protect.ts`, `translate-text.ts`,
  `component-block.ts`; validator `src/validate.ts`.
- Audit tools: `scripts/identity-check.ts` (`npm run identity-check`) for the
  pass/fail gate, `scripts/roundtrip-report.ts` for the full diff.
- Pilot configs: `configs/pilot-config.mjs` (shared factory) and
  `configs/{bg,jp,es,kr,pt-br}-mockup.config.mjs`. Env knobs documented at the
  top of the factory.
- Pilot corpora: `mockup-*/content/en/` (gitignored, regenerate by copying
  from another pilot's `en/`). The `es`, `kr`, `pt-br` and `jp` copies carry
  the frontmatter patch (`mentionedTypes: ["{ComponentApiMembers}"]`); `bg`
  does not.
- Results and decisions: `MODEL-EVALUATION.md` (root). Validator check
  reference: `VALIDATION.md`.
- API keys: `configs/.env` (gitignored) — `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`.
- Ollama host `10.20.14.98:11434` is VPN-only and was unstable at last use;
  not needed for this branch.

## Carried over, NOT part of this branch

- pt-BR glossary does not exist (131 terms, native-speaker work; prerequisite
  for shipping that locale).
- Docs source fixes: `mentionedTypes: [{X}]` → `["{X}"]` in
  `grids/_shared/*.mdx`; the one-space fence indent at
  `column-pinning.mdx:859`.
- Terminology plateaus at 3.2–3.8 for every model; prompt rules and glossary
  extension did not move it; `judge --fix` did (2 of 3 targeted files +1).
- `kr` (docs glossary) vs `ko` (marketing glossary) locale-code split.

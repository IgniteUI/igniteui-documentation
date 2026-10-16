# Translation model evaluation — results and proposal

> **Historical document.** Written in the translate-engine repository (branch
> `sstoychev/remark-mdx`, up to commit `c8cd749` plus uncommitted changes, October 2026) while the
> engine was being built and evaluated, and copied here unchanged for its rationale and
> measurements. Paths, commands and configs in it refer to that repository - the pilot configs
> (`configs/pilot-config.mjs`, `configs/*-mockup.config.mjs`), the `mockup-*` trees,
> `configs/.translation-data/`, `reports/` - not to this vendored copy; for how the engine is laid
> out here see [`../../CLAUDE.md`](../../CLAUDE.md).

Evaluating translator/judge pairings for bulk-translating `igniteui-documentation`
into five locales. Every number below comes from the same ten-file corpus run
through the real pipeline, with the same contract, glossary, style guide and
masking rules for every candidate (all pilots share `configs/pilot-config.mjs`).

Status: **all four shipping locales piloted** — Japanese, Spanish, Korean and
Brazilian Portuguese. Bulgarian was also run, but it is NOT a shipping locale:
it exists so a Bulgarian reader on the team can eyeball output quality directly.
It is reported here as a qualitative spot-check and should not drive decisions.

---

## 1. Headline

Shipping locales, judged by claude-sonnet-5 throughout:

| locale               | claude-sonnet-5 | gpt-5.5  | winner          |
| -------------------- | --------------- | -------- | --------------- |
| Spanish              | 3.70            | **4.00** | gpt-5.5         |
| Japanese             | 3.50            | **3.80** | gpt-5.5         |
| Korean               | **3.70**        | **3.70** | tie             |
| Brazilian Portuguese | **4.10**        | 3.80     | claude-sonnet-5 |

_(Bulgarian, non-shipping spot-check: sonnet 3.90, gpt-5.5 untested.)_

**There is no single best translator.** GPT-5.5 wins Spanish and Japanese,
Sonnet wins Brazilian Portuguese, and Korean is a dead heat on the headline
number. Any plan that standardises on one vendor gives up 0.3 somewhere.

This corrects an earlier draft of this document, which — on the strength of
Spanish and Japanese alone — concluded GPT-5.5 was the leading translator
outright. Two more locales overturned that.

---

## 2. Japanese

| translator / judge                    | acc  | comp | term | flu  | **overall** |
| ------------------------------------- | ---- | ---- | ---- | ---- | ----------- |
| qwen3.6 + thinking / sonnet           | 3.40 | 4.10 | 2.70 | 3.30 | **3.10**    |
| claude-sonnet-5 / sonnet              | 3.40 | 4.90 | 3.20 | 3.90 | **3.50**    |
| claude-sonnet-5 / gpt-5.5 _(control)_ | 3.50 | 4.90 | 3.10 | 3.70 | **3.50**    |
| **gpt-5.5 / sonnet**                  | 3.70 | 4.80 | 3.60 | 4.00 | **3.80**    |
| gpt-5.5 / sonnet, _remark-mdx engine_ | 4.50 | 4.90 | 3.90 | 4.30 | **4.30**    |

Fidelity was a **three-way tie at 449/450 placeholders**, so the separation is
purely linguistic: terminology +0.40 and accuracy +0.30 for GPT-5.5.

The last row is the same translator/judge pairing on the same ten files after
the `remark-mdx` migration (see `REMARK-MDX-MIGRATION.md`) — **+0.50 overall on
a ~0.14 noise band**, at 450/450 placeholders. The gain is not a prompt or model
change; nothing about the translation approach moved. It is what the parser
stopped destroying: content the CommonMark parser froze as code nodes (35
swallowed fenced blocks on `column-pinning.mdx` alone, plus four-space-indented
prose that MDX has never treated as code) was reaching the model as prose for
the first time.

Worth noting against §6's finding that **terminology plateaus at 3.2–3.8 for
every model** and that neither prompt rules nor glossary extension moved it:
this run scores 3.90. One run is not a refutation of that plateau, but it is
the first number above it, and it came from giving the model more of the
document rather than better instructions.

The third row is a control rather than a requested pairing. Sonnet grading
Sonnet carries a self-grading blind spot the engine warns about, so the 3.50
needed confirming from outside the vendor — it came back at exactly 3.50. Two
independent judges agreeing to two decimals makes the GPT-5.5 lead real.

## 3. Bulgarian

| translator / judge             | acc  | comp | term | flu  | **overall** |
| ------------------------------ | ---- | ---- | ---- | ---- | ----------- |
| translategemma:27b / sonnet    | 3.20 | 3.60 | 2.20 | 3.10 | **2.60**    |
| qwen3.6 (no thinking) / sonnet | 3.20 | 3.90 | 2.60 | 3.70 | **3.20**    |
| qwen3.6 + thinking / sonnet    | 4.10 | 4.30 | 2.70 | 3.70 | **3.50**    |
| **claude-sonnet-5 / sonnet**   | 4.40 | 4.20 | 3.30 | 3.90 | **3.90**    |
| claude-sonnet-5 / haiku-4.5    | 4.20 | 4.80 | 3.90 | 4.20 | **4.10**    |

Note the Bulgarian run predates the engine fixes in §5, so the lower rows carry
engine-caused damage that the Japanese numbers do not. GPT-5.5 was not available
when this pilot ran.

---

## 3b. Spanish

Cloud translators only. The local candidates were dropped from this pilot: the
Ollama host became unstable (see below) and the decision was to compare the two
cloud models rather than wait on it.

| translator / judge       | acc  | comp | term     | flu  | **overall** |
| ------------------------ | ---- | ---- | -------- | ---- | ----------- |
| claude-sonnet-5 / sonnet | 4.20 | 4.60 | 3.40     | 3.90 | **3.70**    |
| **gpt-5.5 / sonnet**     | 4.30 | 4.60 | **3.70** | 3.90 | **4.00**    |

**Both scored 450/450 placeholders — the first perfect fidelity in the whole
evaluation, for both models.** The frontmatter YAML shape was patched in this
pilot's source corpus (see §5), which removed the single loss every earlier run
carried. That is direct proof the last remaining placeholder defect lives in the
docs source, not the engine.

The two models are level on accuracy (4.30 vs 4.20), completeness (4.60) and
fluency (3.90). **The entire 0.30 gap is terminology: 3.70 vs 3.40.** GPT-5.5
also threw fewer validator errors (5 vs 8), and the difference is precisely the
three `brand-translated` hits Sonnet incurred and GPT-5.5 did not — i.e. Sonnet
translated `doNotTranslate` terms that GPT-5.5 left alone. The deterministic
validator and the LLM judge independently identified the same weakness, which is
a good sign both are measuring something real.

4.00 is the best score of the evaluation so far, and Spanish is a Romance
language with abundant training data — worth remembering when reading Japanese's
3.80 or Bulgarian's 3.90 as if they were on the same difficulty scale.

### On the local candidates

The Ollama host wedged during this pilot: `mixtral:8x7b` was resident holding
28 GB of VRAM and the host stopped serving entirely — a 12-token prompt did not
return in 120 s, and a control request to the much smaller `gemma4:12b` did not
return in 90 s either. A host-level fault, not a mixtral characteristic.

**mixtral's context was checked before any run and is sufficient**: its ceiling
is 32768 tokens and that is architectural (unlike qwen it cannot be raised). The
largest page (`column-pinning.mdx`, ~9.9k prompt tokens) needs roughly 22.7k for
prompt plus a Spanish completion, since Spanish expands ~15-25% over English —
usable headroom, but that page is already at ~70% of the ceiling and is the one
to watch if the corpus grows. It remains untested on quality.

## 3c. Korean

| translator / judge       | acc      | comp     | term     | flu  | **overall** |
| ------------------------ | -------- | -------- | -------- | ---- | ----------- |
| claude-sonnet-5 / sonnet | **3.90** | 4.60     | **3.70** | 4.00 | **3.70**    |
| gpt-5.5 / sonnet         | 3.30     | **5.00** | 3.50     | 4.10 | **3.70**    |

Both at 450/450 placeholders. Identical overall scores hiding very different
profiles: GPT-5.5 is the most COMPLETE translation in the entire evaluation
(5.00 — nothing dropped anywhere in ten files) but the least accurate of the two
(3.30 vs 3.90), while Sonnet is more accurate and better on terminology.

For docs, accuracy and terminology are the qualities that make a page usable,
and a completeness failure is at least visible to a reader. **Sonnet is the
better pick for Korean despite the tie.** GPT-5.5 threw fewer validator errors
(4 vs 6), so this is a judgement call on the profile, not a clear-cut result.

## 3d. Brazilian Portuguese

| translator / judge           | acc  | comp | term     | flu  | **overall** |
| ---------------------------- | ---- | ---- | -------- | ---- | ----------- |
| **claude-sonnet-5 / sonnet** | 4.40 | 4.80 | **3.80** | 4.10 | **4.10**    |
| gpt-5.5 / sonnet             | 4.50 | 4.80 | 3.60     | 4.20 | **3.80**    |

Both at 450/450 placeholders. **The highest score of the whole evaluation
(4.10), and the only shipping locale GPT-5.5 loses.** GPT-5.5 is marginally
ahead on accuracy and fluency; Sonnet wins on terminology by 0.20 and takes the
overall by 0.30.

**Important caveat: pt-BR ran WITHOUT a glossary.** `configs/glossaries/docs-locales.json`
covers `bg, es, ja, kr` only — there are no Brazilian Portuguese term
translations at all, so the "Approved terminology" block was simply absent from
both prompts. The head-to-head is still fair (both models were equally
unguided), but the 3.60-3.80 terminology numbers are measuring unguided
behaviour, and the absolute score is not directly comparable with the other
locales.

A pt-BR style guide entry WAS added for this pilot (`configs/docs-style-guide.mjs`),
which also restored the shared "keep Ignite UI names in English" rule that every
other locale gets. The 131-term glossary is genuine terminology work and was
deliberately not machine-generated — inventing approved translations would give
the terminology score a false authority.

**Producing the pt-BR docs glossary is a prerequisite for shipping**, and it may
well change this result: terminology is exactly the dimension separating the two
models here.

## 4. Two findings that change how we run this

### Thinking mode solves placeholder fidelity on the local model

The docs are dense with build-time placeholders (`{Platform}`, `{ProductName}`).
A dropped one is unambiguous corruption — the page ships an invented heading.

|                           | placeholders kept |
| ------------------------- | ----------------- |
| qwen3.6, thinking **off** | 396 / 450 (88%)   |
| qwen3.6, thinking **on**  | 448 / 450 (99.6%) |
| claude-sonnet-5           | 449 / 450 (99.8%) |
| gpt-5.5                   | 449 / 450 (99.8%) |

Reasoning is what makes the model _carry_ an opaque token rather than paraphrase
around it. With it on, the local model is indistinguishable from a frontier model
on fidelity. The cost is wall-clock: ~2h45m for ten files versus ~10 min via an
API, roughly 16x slower.

### Do not use Haiku as the judge

Haiku's _overall_ lands within 0.2 of Sonnet's, which makes it look like a safe
substitute. The per-dimension split says otherwise: terminology **3.90 vs 3.30**
— it misses 0.6 of a grade on the one dimension the judge exists for, since the
deterministic validator already covers structure, links, code and placeholders.
A judge that is lenient exactly where it is needed, with a headline number that
hides it, is a false economy. Fine as a cheap regression signal, not as the gate.

By contrast, Sonnet and GPT-5.5 judge consistently and without vendor
favouritism — GPT-5.5 actually marked Sonnet's terminology slightly harsher than
Sonnet marked itself (3.10 vs 3.20). Either is trustworthy as the gate.

---

## 5. Engine defects found and fixed

Three corruptions looked like model failures for days. All three reproduced with
an **identity translator** — every string returned byte-identical, no model, no
API call — which is what proved they were ours.

| defect                                      | cause                                                                                                                                                                  | status                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Multi-line JSX inside code fences collapsed | `collapseMultilineJsxOpenTags` had no fence tracking, rewriting shipped code samples                                                                                   | **fixed** — shared fence mask                |
| Whole FAQ sections shipped untranslated     | `isolateBareJsxLines` left child prose indented 4 spaces between blank lines → CommonMark parsed authored prose as a code block, so it was masked and never translated | **fixed** — relative dedent                  |
| `brand-translated` conflated two failures   | masked terms (dropped placeholder) and unmasked terms (actually translated) shared one error code                                                                      | **fixed** — split into `brand-token-dropped` |

Measured effect on the pilot corpus:

|                               | before  | after       |
| ----------------------------- | ------- | ----------- |
| files corrupted by the engine | 3 of 10 | **1 of 10** |
| code blocks rewritten         | 11      | **1**       |
| FAQ sections lost             | 2 files | **0**       |

Two residuals remain, neither an engine bug:

- **`mentionedTypes: [{ComponentApiMembers}]`** — YAML reads `{…}` as a flow
  _mapping_, destroying the placeholder at parse time before masking can protect
  it. A source authoring issue; quoting the value fixes it. Applied to the
  Spanish pilot corpus; the real docs source still needs it.
- **A code fence indented one space** (`column-pinning.mdx:859`) — CommonMark
  strips a fence's indent from its content, so the round-trip loses one space of
  SCSS indentation. remark is spec-correct; fixing it means changing how the
  English page renders.

### New tooling

`npm run identity-check -- --config <path>` runs a corpus through the real
pipeline with a translator that changes nothing. Anything that differs is the
engine's doing. Exit code 2 so CI can gate on it. **Run this against
igniteui-documentation before spending anything on a translation pass** — it
found all three defects above in seconds, with no API calls.

---

## 6. Proposal

**1. Route the translator per locale — do not standardise on one vendor.** All
four shipping locales are now piloted and there is no universal winner:

| locale               | use             | over                                               | margin |
| -------------------- | --------------- | -------------------------------------------------- | ------ |
| Spanish              | gpt-5.5         | sonnet                                             | +0.30  |
| Japanese             | gpt-5.5         | sonnet                                             | +0.30  |
| Korean               | claude-sonnet-5 | tie on overall, +0.60 accuracy / +0.20 terminology | —      |
| Brazilian Portuguese | claude-sonnet-5 | gpt-5.5                                            | +0.30  |

The engine already supports this: a `provider` block on a target locale
overrides the project default, so one config can route ja/es to OpenAI and
kr/pt-br to Anthropic in a single run (`src/cli-support.ts`, `providerFor`). No
new machinery is needed.

Standardising on either vendor costs ~0.30 on two locales. That is the same
size as the gap the entire model choice buys, so it is not a rounding error.

**2. Judge with a different vendor than the translator.** It removes the
self-grading blind spot for free and costs nothing extra. GPT-5.5 translator +
Sonnet judge is cross-vendor by construction and is the best pairing tested so
far.

**3. Use a cloud translator for the bulk pass.** The local model reaches parity
on fidelity with thinking mode, but is ~16x slower and 0.4-0.7 below on quality.
Its case was always cost, not quality; across a full corpus and five languages
the throughput gap is decisive. Keep Ollama for iteration and CI smoke runs.

**4. Do not ship on the current scores yet — but terminology is NOT the cheap
win it looked like.** 3.5-4.1 out of 5 is not a shippable standard on its own,
and terminology is the lowest dimension for every candidate in every locale. An
earlier version of this recommendation called it "glossary and prompt work, not
a model choice, and the highest-leverage remaining fix". **Two experiments
tested that and it did not hold** — see §7.

**5. Fix the frontmatter YAML shape in the docs source.** One line per affected
file, and it is a `_shared/` grid partial so the real repo likely has many. Until
then every locale loses that placeholder regardless of model.

---

## 7. Terminology: what was tried, and what it showed

All 377 judge issues across the four shipping locales were classified:

| class                                           | count   | share |
| ----------------------------------------------- | ------- | ----- |
| **same term rendered two ways in one document** | **139** | 37%   |
| component/product name translated               | 41      | 11%   |
| approved glossary term not used                 | 19      | 5%    |
| heading left untranslated                       | 17      | 5%    |

The dominant defect is internal INCONSISTENCY, not wrong translation. Each
rendering is individually defensible, which is why no single glossary entry
fixes it.

A concrete root cause was identified: the glossary covers 6 chart terms while
the corpus uses 16 distinct ones. `Area Chart` and `Column Chart` are mandated
so they get translated; `Waterfall Chart`, `Polar Chart` and `Radial Chart` are
absent, and since `Chart` was dropped from `preserveNames` by the head-noun
conflict rule, nothing keeps them English either. The result is
"Gráfico de áreas" two lines above an untouched "Waterfall Chart".

### Experiment 1 — two new prompt rules

`TERM_CONSISTENCY_RULE` (one rendering per term, everywhere in the document) and
`TERM_FAMILY_RULE` (extend the glossary's pattern to uncovered family members),
both in `src/prompt.ts`.

### Experiment 2 — extend the glossary with the 12 missing chart names

Mechanical extensions of the pattern the team already chose. Isolated in
`mockup-es/glossary-charts-experiment.json`; nothing shipped.

### Results (Spanish)

| run                     | acc  | comp | term     | flu  | overall  |
| ----------------------- | ---- | ---- | -------- | ---- | -------- |
| sonnet baseline         | 4.20 | 4.60 | 3.40     | 3.90 | 3.70     |
| sonnet + prompt rules   | 4.20 | 4.20 | **3.20** | 3.80 | 3.60     |
| sonnet + chart glossary | 4.40 | 4.50 | **3.50** | 4.00 | 3.80     |
| gpt-5.5 baseline        | 4.30 | 4.60 | 3.70     | 3.90 | 4.00     |
| gpt-5.5 + prompt rules  | 4.40 | 4.80 | **3.70** | 4.00 | **4.20** |

**Neither intervention moved terminology in the intended direction.** GPT-5.5
gained +0.20 overall from the prompt rules but its terminology score did not
change at all — the gain came from completeness and fluency. Sonnet's
terminology went DOWN with the rules and up only marginally with the glossary.

Measuring the mechanism directly is more informative than the score. Counting,
across three chart pages, how many English "X Chart" names survive versus how
often "gráfico" is used:

| run                     | English `X Chart` left | `gráfico` used |
| ----------------------- | ---------------------- | -------------- |
| sonnet baseline         | 48                     | 151            |
| sonnet + prompt rules   | 44                     | 146            |
| sonnet + chart glossary | **57**                 | 131            |
| **gpt-5.5 baseline**    | **4**                  | **195**        |

**GPT-5.5 was already consistent before any intervention** — it picks one
strategy and applies it throughout. That is why its terminology beat Sonnet's
from the start. Sonnet mixes both strategies in the same document, and neither
the prompt rules nor a fuller glossary changed that; the glossary made it
slightly worse.

### Conclusion

Terminology consistency looks like a **model capability**, not something prompt
wording or glossary coverage reaches. This is the opposite of what recommendation
4 originally assumed.

Two caveats on these numbers: ten files with integer per-file scores means one
file moving by a point shifts the average by 0.10, so most of these deltas are
within noise. And the two experiments disagree with each other on Sonnet
(-0.10 vs +0.10), which is itself a sign of noise rather than signal. A larger
corpus would be needed to call anything smaller than ~0.3 real.

**Kept anyway:** the prompt rules, since they gave GPT-5.5 +0.20 at no fidelity
cost and GPT-5.5 is the pick for Spanish and Japanese.

**Side effect worth carrying over:** the longer prompt pushed one page past the
16000-token output default and the engine correctly failed the file rather than
shipping it truncated. `maxTokens` is now 32000 in the pilot config; the real
docs configs want the same.

### Experiment 3 — Japanese component-name rule (2026-09-30)

The JP docs reviewers stated the naming policy that `NATIVE-REVIEW-LEARNINGS.md`
§0 was waiting for: a component name stays English where the word refers to
the component ("Card コンポーネント"), and is written in katakana where it is a
common noun ("カード形式"). Their criterion is a substitution test - replace the
word with the prefixed type name (cards → IgrCards); if the sentence still
refers to the component and that component is documented on the page, keep
English, otherwise translate. Separately: H1 headings as "English (カナ)", and a
half-width space between English and Japanese text.

What made "cards" come back as "Card" was not the mask - it is exact-case and
whole-word, so a lowercase word never reaches it - but the prompt, which listed
every component name under "never translate them". Change, in three places:

- `src/prompt.ts`: the keep-list is split. Brand names keep the never-translate
  line; UI component names get their own rule (keep where the word names the
  component, translate the ordinary-noun use as the locale's style guide says).
  `TERM_CONSISTENCY_RULE` exempts that ordinary-noun usage from its
  "never switch between English and translated" clause.
- `src/cli-support.ts`: passes the masked component names to the prompt.
- `configs/docs-style-guide.mjs` (ja): the reviewers' rule and their test,
  verbatim, plus the half-width-space rule. The mask is unchanged.

Run: the same ten files, gpt-5.5 translator, output `mockup-jp/content/ja-naming`.
The Sonnet judge was unavailable - the `ANTHROPIC_API_KEY` in `configs/.env`
came back `401 API key is invalid` - so BOTH the new output and the §2 baseline
output were judged by gpt-5.5 under the new style guide. Same scale for the two
rows; the self-grading caveat the engine prints applies to both equally, and
neither row is comparable to the Sonnet-judged 4.30 in §2.

| run (gpt-5.5 judge, new rubric) | acc  | comp | term | flu  | overall |
| ------------------------------- | ---- | ---- | ---- | ---- | ------- |
| baseline (`content/ja-mdx`)     | 4.20 | 4.80 | 3.90 | 4.00 | 4.00    |
| component-name rule             | 4.40 | 5.00 | 4.10 | 4.00 | 4.10    |

Within noise, no file moved down, which is the expected shape for a change
that targets naming rather than meaning. The mechanism, measured directly in
prose (code, frontmatter, JSX and code spans stripped) as English/katakana
occurrences across the ten files, is where the result is:

| name                              | baseline | with rule | human jp |
| --------------------------------- | -------- | --------- | -------- |
| Card                              | 1/0      | 0/1       | 0/1      |
| Button                            | 5/8      | 0/13      | 0/11     |
| Icon                              | 15/20    | 5/30      | 0/34     |
| Grid                              | 14/1     | 6/9       | 0/6      |
| Avatar                            | 71/3     | 71/3      | 15/60    |
| Badge                             | 112/0    | 109/3     | 42/90    |
| component name + particle (total) | 129      | 118       | 42       |

The reviewers' own example now comes out as they specified: "Avatar を使用して、
リスト、カード、プロフィール メニュー…". Secondary names used as common nouns -
cards, buttons, icons, and "the grid" on the feature pages - are katakana, and
on `column-pinning.mdx` they match the human translation sentence for sentence
(the gpt-5.5 judge objected to グリッド there; it is applying the old rule). The
page's own component stays English (Avatar on avatar.mdx, Badge on badge.mdx):
its capitalised occurrences are masked, and the policy keeps component
references English - the human corpus wrote katakana there, the policy does
not, which is why the Avatar/Badge rows do not move toward the human column.
Validator: 4 errors against 5, all the known classes (the azure link, the
`Pie Chart`/`Grid` tokens dropped, block #55). Half-width spacing: 0 violations
in either run, so no normaliser is needed for that rule.

Residual: the byte-for-byte mask freezes every exact-case occurrence regardless
of usage. "#### Icon" and "2. Icon:" on badge.mdx and "Icon コンテナー" on
avatar.mdx stay English where the humans wrote アイコン, and no prompt text can
reach a word the model never sees. Fixing that means making the mask
usage-aware (scope it per page to the frontmatter's `mentionedTypes`, or drop
the hard mask for single-word ambiguous names in ja and let the prompt plus the
`brand-translated` check carry them). The H1 "English (カナ)" format is not
attempted here for the same reason - the name reaches the model as a token - and
needs the deterministic post-pass described in `NATIVE-REVIEW-LEARNINGS.md`.

Kept: the prompt split and the ja style rule. Re-judge with Sonnet once the key
is replaced (`JP_OUT=content/ja-naming npx tsx src/cli.ts judge --config
configs/jp-mockup.config.mjs --locale ja`) to put the row on the §2 scale.

### Experiment 4 — Opus through a Claude Code session, Sonnet judge (2026-10-06)

Question: can the engine's translation step run on an author's own Claude Code
seat - the `/translate`-skill idea - instead of an API key, and what does
Claude Opus produce when it does? The Anthropic API key was still invalid, so
this was also the only way to put a Sonnet judge back on the comparison.

Mechanism: a new `exchange` provider (`src/providers/exchange.ts`). Instead of
calling an API it writes each prompt the engine builds to a file and reads the
answer from a file next to it, so the model behind the session answers while
the engine keeps doing everything else - masking, restore, validation,
translation memory, reports - unchanged. A `record` pass (`translate --dry-run`
with `EXCHANGE_MODE=record`) surfaces every prompt of every file in one go by
handing the pipeline marked dummies; the answers are written; a normal run then
replays them. The engine's own re-asks (a dropped token, an echoed reply) map to
numbered answer files, and the judge command skips a file whose answer is not
there yet. `scripts/exchange-pending.ts` lists what is waiting.

Run: the ten JP pilot files. 31 translation prompts (10 page bodies, 21
frontmatter/attribute batches) answered by 17 Opus subagents of the session,
one per body and three batches per agent, longest page ~13 minutes. Three
echo-guard fallbacks (a keywords line of masked names, the identifier
`AzureMapsImagery`, a lone token) were answered with the source text, which is
what a model returns for them. 10/10 files written. Then 30 judge prompts - this
output, the experiment-3 output and the §2 baseline - answered by 18 Sonnet
subagents under today's style guide, so the three rows share one judge and one
rubric.

| output (Sonnet 5.5 subagent judge, same rubric) | acc      | comp | term | flu      | overall |
| ----------------------------------------------- | -------- | ---- | ---- | -------- | ------- |
| baseline, gpt-5.5, old prompt                   | 4.40     | 4.80 | 4.00 | 4.10     | 4.20    |
| gpt-5.5, component-name rule (exp. 3)           | 4.40     | 5.00 | 3.70 | 3.90     | 3.90    |
| **Opus via session, component-name rule**       | **5.00** | 5.00 | 4.20 | **4.70** | 4.20    |

Opus scored 5 on accuracy for every file and 4.70 on fluency; the overall ties
the baseline because the judge caps most files at 4 on terminology, and the
terminology findings against the Opus output are the glossary conflicts below,
the masked `Icon` anatomy label, and `Grid`/`Map` written in katakana where the
style guide wants English. One concrete marker: the avatar bullet "Set `alt`
when a `src` image represents a specific person" was reversed in both gpt-5.5
runs and is correct in the Opus output.

Read the judge rows with the instrument's spread in mind: the same baseline
files scored 4.30 (Sonnet 5 via API, old rubric, §2), 4.00 (gpt-5.5 judge) and
4.20 (Sonnet 5.5 subagents). A 0.3 gap between judges on identical text is
larger than the ~0.14 run-to-run noise measured earlier, so dimension scores
and the mechanism counts carry more than the overall.

Mechanism, English/katakana in prose across the ten files (experiment-3 table
extended):

| name                              | gpt-5.5 + rule  | Opus + rule | human jp        |
| --------------------------------- | --------------- | ----------- | --------------- |
| Badge                             | 109/3           | 95/17       | 42/90           |
| Grid                              | 6/9             | 8/7         | 0/6             |
| Spreadsheet                       | 5/4             | 9/0         | 5/3             |
| Card / Button / Icon              | 0/1, 0/13, 5/30 | same        | 0/1, 0/11, 0/34 |
| component name + particle (total) | 118             | 112         | 42              |

The reviewers' example sentence comes out as specified in both. Opus keeps
`Spreadsheet` English consistently where gpt-5.5 mixed it, which the judge had
flagged on every gpt-5.5 run. Validator: 5 errors (the `Grid` token dropped on
chart-axis-types AND paging, `Pie Chart` dropped, the azure link, block #55) -
the same classes as the API runs; the `Grid` and `Pie Chart` drops now occur
with every model tried, which points at those two source positions rather than
at any model.

What the session run cost in seat usage, as the harness reports it: roughly
1.6M tokens for the ten translations and 2.4M for the thirty judgements, i.e.
~160k per page translated and ~80k per page judged, in about 25 minutes of
wall time with everything in parallel. That is the number to hold against a
seat's five-hour window when sizing an author-run `/translate`.

Two behaviours to know about before building on this. The session model does
not follow instructions as literally as an API call: three independent Opus
agents refused the glossary's `category → エリア` and `title → 権原` and wrote
カテゴリ / タイトル, and the Sonnet judges then declined to penalise them. Here
that was right (see below) but it is the agent's judgement, not the engine's
control. And the mask residual from experiment 3 is unchanged: `#### Icon`
and `2. Icon:` stay English in all three outputs.

Conclusion for the `/translate` idea: the mechanics work end to end with the
engine untouched except for the provider, the output quality is at least the
API path's, and the shape is a human-attended run on the author's own seat,
which is the compliant one. What a skill would add is the dispatch loop done
here by hand (record, answer, replay, show the validator), plus a decision on
how much of the glossary to enforce.

### A glossary defect found on the way

Three agents, independently, flagged approved entries that translate the wrong
sense of the English word. Verified in `configs/glossaries/docs-locales.json`:

| term     | ja                | es          | the sense it actually carries |
| -------- | ----------------- | ----------- | ----------------------------- |
| title    | 権原              | titularidad | legal title, ownership        |
| level    | 水準器            | nivel       | a spirit level (the tool)     |
| pane     | ブレード          | hoja        | a blade / a sheet             |
| header   | ランニング ヘッド | encabezado  | typography running head       |
| category | エリア            | área        | "area"                        |
| group    | リボン グループ   |             | a ribbon group                |
| register | レジスタ          |             | a CPU register                |

The Spanish column shows the same pattern, so this is how the glossary was
built, not a Japanese slip. These entries are injected as "always use" into
every translate and judge prompt. They explain findings that were read as
model errors before: "Category rendered as エリア throughout" on
chart-axis-types.mdx (the lowest-scored JP file in §2) and ランニング ヘッド on
column-pinning.mdx, and they are a plausible part of the terminology plateau
in §7. Owner: the docs team / a native speaker; a pass over all 131 entries is
due before the next bulk run.

## 8. `judge --fix` — measured

Japanese, gpt-5.5 translator, claude-sonnet-5 judge, on the patched corpus with
the terminology prompt rules in place.

`--fix` only touches files scoring **<= 3**; anything at 4 or 5 is left alone.
Below 3 it re-translates from scratch; at exactly 3 it re-translates with the
judge's specific complaints fed back as correction notes. That eligibility rule
bounds the achievable gain before anything runs.

|               | acc   | comp  | term  | flu  | **overall** |
| ------------- | ----- | ----- | ----- | ---- | ----------- |
| before        | 3.30  | 4.70  | 3.80  | 4.00 | **3.60**    |
| after `--fix` | 3.70  | 4.90  | 3.90  | 4.00 | **3.70**    |
| delta         | +0.40 | +0.20 | +0.10 | 0.00 | **+0.10**   |

Three files were eligible and re-translated. **Two went 3 -> 4; one stayed at 3.** Fidelity held at 450/450 placeholders after re-translation, so the repair
pass did not trade structure for prose.

|           | file                 | before -> after |
| --------- | -------------------- | --------------- |
| fixed     | area-chart.mdx       | 3 -> **4**      |
| fixed     | column-chart.mdx     | 3 -> **4**      |
| fixed     | badge.mdx            | 3 -> 3          |
| untouched | chart-axis-types.mdx | 4 -> **3**      |

### The important caveat: the judge is nondeterministic

`chart-axis-types.mdx` was NOT re-translated — its bytes are identical before and
after — yet it scored 4 the first time and 3 the second. That single file's drift
cancelled half the gain `--fix` actually produced.

One of seven untouched files moving by a full point is roughly **0.14 of judge
noise on a ten-file average**. That is the same magnitude as most of the deltas
reported elsewhere in this document, and it retrospectively justifies the caution
in §7: the terminology experiments' +/-0.10 swings were almost certainly noise.

**Read `--fix` on its hit rate, not the corpus average: 2 of 3 targeted files
gained a full point.** The corpus-level +0.10 understates it because judge
variance ate the rest.

### Cost and limits

One extra translate call plus one extra judge call per fixed file. Only files at
or below 3 qualify, so on a corpus where most files already score 4 the ceiling
is roughly +0.3-0.4 overall — real, but not the step change that would take
3.7 to shippable on its own.

It is nonetheless **the only intervention tested that moved the targeted files**,
where both prompt rules and glossary extension did not.

## 9. Cost per language

Measured, not chars/4. Three inputs that the bundled estimator cannot know were
measured with the API's unbilled `count_tokens` endpoint on the pilot corpus:

| measured quantity                  | value                 | note                                                                           |
| ---------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| tokenizer vs `chars/4` on this MDX | **1.65×** more tokens | code, JSX and punctuation tokenize far worse than prose                        |
| model-visible share after masking  | **0.54** of raw       | code fences, imports, JSX, placeholders never reach the model                  |
| output / input tokens (prose)      | **~1.05**             | same for ja, es, kr, pt-br — CJK does NOT inflate here, most of a page is code |
| fixed prompt overhead              | **4,352 tok / call**  | persona + rules + 131-term glossary + style guide, resent on every call        |
| provider calls per page            | **3.7**               | 1 body completion + ~2.7 frontmatter/attribute batch chunks                    |

The overhead is the surprise: **~4× the translatable content.** It is an
identical prefix on every call to a given locale, which makes it the textbook
prompt-caching case (see below); the providers do not set `cache_control` today.

Scope per language, tracked source only (the angular `components/` folder also
holds 243 generated grid pages; its config has no `exclude` yet, so a naive run
would translate 453 pages instead of 210 and cost ~2.2× the angular figure):

| workspace | pages | raw tokens | model-visible | calls | overhead tokens |
| --------- | ----- | ---------- | ------------- | ----- | --------------- |
| xplat     | 281   | 1.90M      | 1.02M         | 1,040 | 4.53M           |
| angular   | 210   | 1.19M      | 0.64M         | 777   | 3.38M           |

### Translation pass, per language

Rates: Claude Sonnet 5 **$2 / $10** per MTok (Anthropic first-party, verified
against the API pricing table cached 2026-06-24). GPT-5.5 **$5 / $30** is the
rate snapshot in `scripts/estimate-cost.ts` and is **not independently
verified** — check OpenAI's pricing page before relying on it.

|                                            | claude-sonnet-5 | gpt-5.5   |
| ------------------------------------------ | --------------- | --------- |
| xplat                                      | $22             | $60       |
| angular                                    | $15             | $40       |
| **both workspaces**                        | **~$37**        | **~$100** |
| both, with the rules block cached (Sonnet) | **~$22**        | —         |

The caching row assumes cache reads at ~0.1× input: it removes ~40% of Sonnet
spend for a one-line provider change. OpenAI also discounts repeated prefixes
automatically; not quantified here because the base rate is unverified.

### Judge and `--fix`, per language

The judge reads the **full** source and translation (nothing is masked), one
call per page, so it is input-heavy: **~$20 per language** with Sonnet 5 across
both workspaces. `--fix` re-translates and re-judges the files scoring ≤3 —
30-40% of pages on the pilots — adding roughly 30% of the translate + judge cost.

### One-time bulk, all four shipping locales, as routed in §6

| locale               | translator      | translate | judge | `--fix` | **total** |
| -------------------- | --------------- | --------- | ----- | ------- | --------- |
| Japanese             | gpt-5.5         | $100      | $20   | $36     | ~$156     |
| Spanish              | gpt-5.5         | $100      | $20   | $36     | ~$156     |
| Korean               | claude-sonnet-5 | $37       | $20   | $17     | ~$74      |
| Brazilian Portuguese | claude-sonnet-5 | $37       | $20   | $17     | ~$74      |
| **all four**         |                 |           |       |         | **~$460** |

Uncached; Sonnet caching would take the two Sonnet rows to ~~$55 each. Sanity
check: the earliest estimate in this project put a judge pass at $30-150 for
five languages; this measured figure (~~$100 for five) sits inside it.

### What is not in these numbers

- Retries on 429s and truncations (a handful per run on the pilots — small).
- Incremental `sync` runs after the bulk pass, which translate only changed
  blocks and cost a fraction of the above.
- Extrapolation risk: masking factor and calls-per-page come from the ten
  pilot files; the 1.65× tokenizer factor from the same ten. The pilot mixes
  chart, grid and small-component pages deliberately, but it is ten files.

## 10. Open questions

- **The pt-BR glossary does not exist.** 131 terms, native-speaker work, and a
  prerequisite for shipping that locale — terminology is exactly the dimension
  separating the two models there, so it may change the pt-BR recommendation.
- **Terminology plateaus at 3.2-3.8 and neither prompt nor glossary work moved
  it** (§7). If that ceiling is unacceptable for shipping, the remaining levers
  are a human review pass or `judge --fix`, not further prompt tuning.
- `judge --fix` is now measured on Japanese (§8) but only on ten files. Worth a
  larger run before relying on it, and worth checking whether a second `--fix`
  pass helps the files that did not improve on the first.
- The `code-mismatch` on `column-pinning.mdx` block #55 is a source authoring
  defect (a fence indented one space); decide whether to normalise fence
  indentation in the docs repo.
- Locale-code inconsistency between glossaries: the docs glossary uses `kr`
  while the marketing glossary uses `ko`. Worth unifying before the two projects
  ever share tooling.
- Translation memory captures ~3 entries per docs file (versus ~2,480 for the
  marketing corpus) because body prose is deliberately excluded and most docs
  frontmatter carries `{Placeholder}` tokens. TM reuse is effectively not a
  factor for docs under the current design.

# What the JP native-check skill teaches the pipeline

> **Historical document.** Written in the translate-engine repository (branch
> `sstoychev/remark-mdx`, up to commit `c8cd749` plus uncommitted changes, October 2026) while the
> engine was being built and evaluated, and copied here unchanged for its rationale and
> measurements. Paths, commands and configs in it refer to that repository - the pilot configs
> (`configs/pilot-config.mjs`, `configs/*-mockup.config.mjs`), the `mockup-*` trees,
> `configs/.translation-data/`, `reports/` - not to this vendored copy; for how the engine is laid
> out here see [`../../CLAUDE.md`](../../CLAUDE.md).

Assessment of the `native-check` Claude Code skill (`SKILL.md` +
`references/review-prompt.md`) that colleagues use to review Japanese
translation PRs, against what `translate-engine` does today. Written so the
decisions below can be taken without the conversation that produced them.

## The one-paragraph version

The skill is a **human review workflow**: a native speaker checks out a PR and
is walked, systematically, through comparing every changed line against the
English source and against the established translations around it. The
"resembles human translation" result is real, but it comes from a native
speaker fixing the text with a good checklist in hand — that part cannot be
automated. What _can_ be borrowed is the checklist itself: four of its checks
correspond to measurable gaps in our pipeline, and one of them exposed a policy
decision (component naming in Japanese) that no prompt rule can paper over
because our configuration is currently on the wrong side of the established
corpus. Everything below is measured against the ten JP pilot files and the
human-translated `jp/` tree in the docs repo (`docs-template/docs/xplat/src/content/jp`,
262 files, structurally parallel to `en/` and current for the pilot files).

## What the skill does, and what maps onto us

| skill step / check                                                        | nature                  | maps to our pipeline as                                   |
| ------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------- |
| Steps 1–6, 8, 9 (repo detection, branch, superseded PRs, commit, sidebar) | PR workflow for a human | nothing — not our layer                                   |
| Output format (`R001`, `A案/B案`, batch replace)                          | reviewer UX             | nothing directly; informs `judge --fix` (see §5)          |
| **Step 2 — learn the sibling files' patterns before judging**             | context                 | §1: the translator gets no sibling context today          |
| **B / B-1 — notation consistency: heading, frontmatter, alt, body**       | consistency             | §2: frontmatter and body are separate, context-free calls |
| **D — untranslated remnants, including attribute values**                 | coverage                | §3: `FaqItem.question`, `Anatomy.*` shipped in English    |
| **F — anchor links must follow translated headings**                      | structural              | §4: every anchor in our output is broken; nothing checks  |
| A / C — accuracy, first-occurrence terms                                  | judgement               | already the judge's job                                   |
| E — markup/syntax                                                         | structural              | already the validator's job                               |

## 0. The finding that is a decision, not a bug: component naming in Japanese

Our configuration keeps Ignite UI component names in English everywhere
(`preserveNames` masks them byte-for-byte; the shared style-guide rule says
"never translate or transliterate them"). The human-translated JP corpus does
the opposite in running prose, by a wide margin. Counted in prose only — code
fences, frontmatter, JSX lines, code spans and links stripped:

| name       | English | katakana | name     | English | katakana |
| ---------- | ------: | -------: | -------- | ------: | -------: |
| Grid       |     139 |      790 | Combo    |      21 |       51 |
| Avatar     |      19 |       82 | Dialog   |      15 |       49 |
| Badge      |      31 |      118 | Calendar |      29 |       55 |
| Tree Grid  |       8 |       28 | Slider   |      11 |       40 |
| Data Chart |      13 |       26 | Toast    |      12 |        4 |

The convention is consistent and describable: **katakana when the word is a
common noun in the sentence** (画像アバター, 子グリッド, 装飾的なアバター),
**English when it names the component as an entity** — typically compounded
with コンポーネント or as a package/API identity ("Avatar コンポーネント",
"Badge にはどのパッケージを"). Toast is the one exception the humans made.

The same sentence, three ways (avatar.mdx):

> EN: _Use avatars to provide compact visual identity in lists, cards, profile menus…_
> ours: **Avatar** を使用すると、リスト、**Card**、プロファイル メニュー…
> human: **アバター**を使用して、リスト、**カード**、プロフィール メニュー…

"Card" is not even a component here; it is masked because `Card` is in
`preserveNames`. Across the ten files our output has **167** English capitalised
words glued directly to a Japanese particle (Avatar を, Badge の…) against
**61** in the human translation of the same files — 2.7×, and the top two
offenders (Badge 63, Avatar 48) are exactly the masked names. The judge saw the
symptom ("'cards' rendered as the proper noun 'Card'") and still scored the file
4/5, because each sentence is grammatical. A native reviewer working from
sibling files flags it on every line. This is very likely the single largest
reason our JP output does not read as human-translated, and it is invisible to
every metric we have.

It is a terminology decision, not an engine defect, and it belongs to the docs
owners and a native speaker. Two things worth knowing before taking it:

- The human corpus is not a clean standard either: it uses 縦棒チャート in alt
  text where the approved glossary says 縦棒グラフ (which our output follows),
  and ページング in the title but ページネーション in the H1 of the same file.
  "Follow the corpus" and "follow the glossary" will disagree in places; the
  glossary should win where it speaks.
- The config cannot express this today. `preserveNames`, `doNotTranslate` and
  the shared style rule are project-wide; `TargetLocale` carries only
  `code/name/dir/provider/judge`. Implementing the decision needs a per-locale
  exclusion (e.g. `targets[].preserveNamesExcept`) plus a JP style-guide rule
  stating the common-noun/entity convention above.

**Update 2026-09-30.** The reviewers stated the policy: English where the word
names the component, katakana where it is a common noun, decided by a
substitution test (cards → IgrCards: still the component, and documented on
this page? keep English, else translate); "English (カナ)" for H1 headings only;
a half-width space between English and Japanese. The body-text part is
implemented as a prompt split plus a ja style rule and measured in
`MODEL-EVALUATION.md` §7, experiment 3 - the common-noun cases now follow the
policy, the mask residual (exact-case occurrences frozen regardless of usage)
and the H1 pass are what remain.

## 1. The translator works blind; the reviewer does not

Review-prompt Step 2 reads the whole changed file, its English source, and the
sibling files in the same directory (both languages) before judging a single
line — to learn the established terminology, sentence endings, markup handling,
and which words stay English. Our translator receives the glossary (131 terms),
a five-line style note, `doNotTranslate`, and nothing else about how this
corpus is written. The translation memory is exact-segment, short strings only,
and empty for a fresh output directory.

The human `jp/` tree makes this fixable in three escalating ways:

1. **Sibling few-shot.** When translating `column-chart.mdx`, include the
   human EN→JP pair for one sibling (`area-chart.mdx`) in the prompt as a style
   reference. This is Step 2 moved from the reviewer to the translator, and the
   mechanism most likely to move "resembles human translation". Cost: roughly
   doubles input tokens per file (~$0.20 more per ten-file run at gpt-5.5
   rates); output tokens unchanged. Needs an experiment, not a guess — see §6.
2. **TM seeding from the human corpus.** Headings, alt text and table headers
   align by position between `en/` and `jp/` (heading counts match on 8 of the
   10 pilot files exactly). Seeding the TM with those pairs gives byte-identical
   reuse of the established rendering for every recurring string (`## API
リファレンス`, `## その他のリソース`, every `Sample alt`). Body paragraphs
   should not be seeded this way — alignment is not reliable there.
3. **Judge with reference.** For files that have a human translation, score
   against it rather than against the source alone. A much stronger signal than
   the current reference-free judge, and it would have caught §0 numerically.

## 2. Frontmatter and body never see each other

B-1 checks that a component name is written the same way in the heading, the
frontmatter, the alt text and the body. Our pipeline translates the frontmatter
in a batched `translateMany` call and the body in one separate `translateBody`
completion; neither prompt contains the other's output. `TERM_CONSISTENCY_RULE`
tells the model to keep "headings, body text, tables … and frontmatter alike"
consistent — for a frontmatter the body model has never seen. paging.mdx shows
the result: ページング in `title`/`description`/`keywords`, ページネーション in
the H1 and H2. (The humans did the same on that file, which says something about
the term, but the structural cause on our side is real and general.)

Fix: translate the body first, then pass its H1 and the renderings it chose for
the page's key terms into the frontmatter batch as fixed context — or the
reverse. Small engine change in `pipeline/index.ts`; no cost impact.

## 3. Prose in attributes the config does not know about

Check D found, on the same ten files, **all six `FaqItem question="…"` values
and both `Anatomy description="…"` values shipped in English** — neither
component is in `translatableAttributes`. The human corpus translates both. The
judge noticed one of the eight. The validator's `untranslated` check covers
frontmatter fields only.

Done in this change: `FaqItem: ['question']` and `Anatomy: ['name',
'description']` added to all three docs configs. Proposed: a validator check
that flags any string attribute value that is prose-shaped (three or more
words, contains a space) and byte-identical to the source — the same idea as
`untranslated`, applied to JSX attributes. That catches the _class_, not the two
instances.

## 4. Anchor links break the moment a heading is translated

Check F: the docs build derives heading IDs from heading text with
`github-slugger` (Astro's built-in pass, and `rehypeHeadingAnchors` in
`igniteui-astro-components`, both use it). Translate `## {Platform} Column Chart
Example` to `## {Platform} 縦棒グラフの例` and the anchor changes from
`#{PlatformLower}-column-chart-example` to `#{PlatformLower}-縦棒グラフの例`.
Our pipeline masks link URLs and restores them verbatim, so:

| tree                          | anchors | resolve | broken | unverifiable | target not in tree |
| ----------------------------- | ------: | ------: | -----: | -----------: | -----------------: |
| EN source, 10 pilot files     |      14 |       5 |      0 |            0 |                  9 |
| **our JA output, same files** |      14 |   **0** |  **5** |            0 |                  9 |
| EN full corpus (281 files)    |     297 |     237 |      0 |           11 |                 49 |
| human jp (262 files)          |     291 |     195 |     32 |           22 |                 42 |

"Unverifiable" is a link into a heading that carries a `{ComponentTitle}`-style
token, which the build expands per platform; the checker cannot resolve those
statically and does not count them either way. On that basis the EN corpus is
clean, which is also the checker's false-positive control. Every anchor we can
check is broken after translation, in every locale — the first three rows are
locale-independent. The human translators rewrote anchors by hand and still left
32 of 227 checkable ones broken. `scripts/anchor-check.ts` (added in this change,
same slugger the build uses) reproduces the table.

The fix is deterministic and belongs in the engine: after translating a file,
pair its EN and translated headings by position, slug both, and rewrite every
anchor in the output tree that pointed at the EN slug — cross-file, so it runs
as a pass over the whole output after the per-file work. Two supporting checks
fall out of the same design: heading-count parity between source and
translation (a merged or dropped heading is a `completeness` defect the
validator cannot currently see), and the anchor check itself as a validator
rule. Headings containing `{ComponentTitle}`-style tokens expand per platform
in the build and cannot be verified statically; the checker reports those
separately rather than calling them broken.

## 5. `judge --fix` fixes files; the reviewer fixes issues

The review prompt attaches one recommended fix to every finding and applies
them surgically. Our `--fix` re-translates the whole file, and only when the
score is 3 or below. On this run avatar.mdx scored 4/5 with an accuracy error the
judge described precisely — a bullet whose `alt`/`src` meaning is reversed —
and it will never be touched. Worth considering: let `--fix` apply
issue-level corrections (the judge already quotes the problem text) on files
scoring 4, and reserve whole-file re-translation for 3 and below.

## 6. What to do, in order

| #   | change                                                          | kind              | effort | cost       |
| --- | --------------------------------------------------------------- | ----------------- | ------ | ---------- |
| 0   | Decide the JP component-naming policy (§0)                      | decision + config | S      | none       |
| 1   | Anchor rewrite pass + heading-parity + anchor validator (§4)    | engine            | M      | none       |
| 2   | Frontmatter↔body shared context (§2)                            | engine            | S      | none       |
| 3   | Attribute-untranslated validator check (§3)                     | validator         | S      | none       |
| 4   | Sibling few-shot experiment on the JP pilot (§1.1)              | experiment        | M      | ~$3        |
| 5   | TM seeding from the human corpus, headings/alt only (§1.2)      | tool              | S–M    | none       |
| 6   | Judge-with-reference for files that have a human version (§1.3) | judge             | S      | ~$0.50/run |
| 7   | Issue-level `judge --fix` for 4/5 files (§5)                    | judge             | M      | small      |

Item 0 gates how much 4 and 5 can help: seeding a TM or showing sibling
examples that write アバター while the style rule forbids it would pull the
model in two directions. Items 1–3 are defects and can proceed regardless.

## Done in this change

- `NATIVE-REVIEW-LEARNINGS.md` (this file).
- `translatableAttributes` gains `FaqItem: ['question']` and
  `Anatomy: ['name', 'description', 'alt']` in `configs/pilot-config.mjs`,
  `configs/docs-template-xplat.config.mjs`, `configs/docs-template-angular.config.mjs`.
  Verified with the uppercasing mock translator: all three reach the model with
  `Badge`/`Avatar`/`{Platform}` preserved inside them.
- `scripts/anchor-check.ts` + `github-slugger` dev dependency:
  `JP_OUT=content/ja-mdx npm run anchor-check -- --config configs/jp-mockup.config.mjs --locale ja`
  (the pilot configs take the output dir from that env knob), or
  `--source <en-dir> --target <translated-dir>` for an arbitrary pair of trees.
  Exit code 2 when an anchor is broken, so it can gate like `identity-check`.

## Where the evidence came from

- Human JP corpus: `C:/Users/SStoychev/Documents/Git/docs-template/docs/xplat/src/content/jp`
  (the `root` the docs configs already point at, `../../../angularDocs/docs-template`
  resolves to a sibling of this repo). `angular/src/content/jp` has 454 more files.
- Slugging: `igniteui-astro-components/src/plugins/rehype-heading-anchors.ts`
  and Astro's `rehypeHeadingIds`, both `github-slugger` 2.0.0.
- JP pilot output: `mockup-jp/content/ja-mdx` from the remark-mdx step-6 run
  (gpt-5.5 / Sonnet judge, 4.30 overall, `MODEL-EVALUATION.md` §2).

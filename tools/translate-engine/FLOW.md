# Execution flow - a full trace

A file-by-file, function-by-function walkthrough of what happens when you run a
`translate` command, then two deep-dives into the trickiest internals (how the
pipeline **masks and restores** protected constructs, and how the frontmatter
walk **guarantees** every translated value lands back in the right place), and
finally a trace of the **`sync`** (incremental) path. For the high-level layer
map and extension recipes see [ARCHITECTURE.md](ARCHITECTURE.md); this doc is the
"what actually runs" view.

The command traced throughout:

```
npx tsx src/cli.ts translate --config configs/docs-template-xplat.config.mjs --locale es --dir "components/grids"
```

---

## Part 1 - The chain, phase by phase

### Phase 0 - Bootstrap

**1. [src/cli.ts](src/cli.ts) -> `main()`**
`tsx` runs `cli.ts`; the bottom `main().then(...)` fires.

- `parseArgs` -> `{ command:"translate", config, locale:"es", dir:"components/grids" }`.
- Guards: a command and `--config` are present (else print help, exit 1).
- Calls **`loadConfig(values.config)`**, sets `locales = ["es"]`.
- `switch(command)` -> **`cmdTranslate(cfg, ["es"], { dir:"components/grids", all:false, dryRun:false, … })`** in [src/commands/translate.ts](src/commands/translate.ts).

**2. [src/config.ts](src/config.ts) -> `loadConfig()`**

- `process.loadEnvFile(configs/.env)` (Node built-in) - loads provider keys into `process.env`; real env always wins, and a missing `.env` is fine (keys can come from the real environment / CI secrets).
- Dynamic `import()` of `docs-template-xplat.config.mjs`, which imports [configs/docs-component-names.mjs](configs/docs-component-names.mjs) (`preserveNames`) and [configs/docs-style-guide.mjs](configs/docs-style-guide.mjs) (`styleGuide`).
- Validates required fields; absolutizes `rootAbs`, `sourceDirAbs` (`docs/xplat/src/content/en`), `dataDirAbs` (`.translation-data/documentation`).
- Builds the **`FieldContract`** sets ([src/types.ts](src/types.ts)).
- Loads the glossary (`glossaries/docs-locales.json`).
- **Compiles `preserveNames`** into word-boundary regexes prepended to `protectPatterns`, and folds the names into `doNotTranslate`.
- Returns a `ResolvedConfig`.

### Phase 1 - Discovery & scoping

**3. [src/commands/translate.ts](src/commands/translate.ts) -> `cmdTranslate()`** - builds settings via [src/cli-support.ts](src/cli-support.ts):

- `promptSettingsFrom(cfg)` -> `{ doNotTranslate(+preserveNames), glossary, promptContext, styleGuide }`.
- `validateSettingsFrom(cfg)` -> `{ contract, doNotTranslate }`.

**4. [src/discover.ts](src/discover.ts) -> `discover(cfg, ["es"])`**

- Calls **`tinyglobby` `glob(include, { cwd: sourceDirAbs, ignore })`** - walks the EN content dir, matches `**/*.mdx`/`**/*.md`, returns sorted POSIX rel paths.
- For each file, computes the `es` target path via `targetPathFor` and checks existence (`fs.access`, **parallelized**) -> `state: "missing" | "done"`.

**5. [src/cli-support.ts](src/cli-support.ts) -> `scopeFiles(files, undefined, "components/grids")`**

- Keeps files whose `relPath` is under `components/grids/` (nested at any depth). Empty dir -> error + exit 1.
- `filterTargetLocales(cfg, ["es"])` -> `[es]`.

> Because you passed **`--dir`**, the work filter `flags.all || flags.file || flags.dir ? true : st==="missing"` is `true` - **every matched file is (re)translated**, not only `missing` ones.

### Phase 2 - Per-locale setup (loop over `[es]`)

- **[src/memory.ts](src/memory.ts) -> `loadTM(dataDirAbs, "es")`** - reads `documentation/tm/es.json`, running each entry through **`isCacheable`**, so token/markup/oversized junk is dropped (**self-heal on load**). `memoryFor(tmMap)` wraps it as the `TranslationMemory`.
- **[src/providers/index.ts](src/providers/index.ts) -> `makeTranslatorFor(cfg.provider, es, settings, "en")`** - provider **registry** -> `openai` entry -> `createProvider` ([src/providers/openai.ts](src/providers/openai.ts)) -> **[src/prompt.ts](src/prompt.ts) -> `makeTranslator()`** returns `Translator { one, many }`.
- `makeAppendingReport(...)` - the append-as-you-go run report.

### Phase 3 - Per file (concurrency pool, 4 at a time) -> `runOne(f)`

Reads the source, then **`translateMarkdownFile(source, translator, pipelineOptionsFrom(cfg, mem))`**:

**6. [src/pipeline.ts](src/pipeline.ts) (barrel) -> [src/pipeline/index.ts](src/pipeline/index.ts) -> `translateMarkdownFile()`**

- `quoteUnquotedBraceValues` ([src/frontmatter.ts](src/frontmatter.ts)) - quote bare `{Placeholder}`-leading frontmatter so YAML parses.
- `extractLeadingComponentBlockFrontmatters` ([src/pipeline/component-block.ts](src/pipeline/component-block.ts)) - grids often use the multi-`<ComponentBlock>` shape; handled specially if matched.
- `matter()` splits frontmatter / body.
- **Frontmatter:** `collectNode` -> `translateMany` -> `applyNode` ([src/pipeline/frontmatter-walk.ts](src/pipeline/frontmatter-walk.ts)). _(Part 3 explains the ordering guarantee.)_
- **Body:** mode `auto` -> `isHtmlBody`? -> **`translateBody`** ([src/pipeline/body.ts](src/pipeline/body.ts)) or `translateHtmlBody`.
- `stringifyDocument` reassembles frontmatter + body.

**7. [src/pipeline/body.ts](src/pipeline/body.ts) -> `translateBody()`** _(Part 2 explains the masking in detail)_

- `remark` parse **with `remark-mdx`** -> **`protectAstNodes`** ([src/pipeline/protect.ts](src/pipeline/protect.ts)) -> `__BLOCK__`/`__URL__` (code, inline code, URLs) and `__JSX__` (imports, `{expressions}`, JSX tags - restored from the source bytes, never re-serialized).
- `applyAttributeTranslations` - configured component attributes, translated from the `mdxJsxAttribute` nodes and spliced back into the frozen tag.
- stringify -> `protectFencedPlaceholderBlocks` (`__FENCE__`) -> **`extractProtectedBlocks`** (`preserveNames` + `protectPatterns`) -> `__MDX__`.
- **`translateProseWithTokenCheck`** - the single body-prose model call, with token-drop retry + `realignBlockTokenOrder`.
- restore: `restoreProtectedBlocks` then `restorePlaceholders`.

**8. [src/pipeline/translate-text.ts](src/pipeline/translate-text.ts) -> `translateMany()`** (frontmatter values + HTML text runs)

- dedup -> **TM lookup** (`mem.get`) -> `isTimeOnly` passthrough -> HTML tag-split -> solo(>1200 chars) -> **batch** via `t.many`.
- Model calls flow through **[src/prompt.ts](src/prompt.ts)**: `buildPrompt`/`buildBatchPrompt` assemble the **persona** (native speaker), `SHARED_RULES` (TIME, HEADING, REGISTER, **TERMINOLOGY**, **IDENTIFIER**), and `rulesBlock` (`doNotTranslate` + **styleGuide** + **glossary** for `es`); `chunkIndices` ([src/chunk.ts](src/chunk.ts)) batches; `decodeByteTokens`/`extractJsonObject` clean responses.
- `mem.set` caches each clean result (via `isCacheable`). Token shapes come from **[src/tokens.ts](src/tokens.ts)**.

### Phase 4 - Validate & write

- **[src/validate.ts](src/validate.ts) -> `validateTranslation(source, output, validateSettings)`** - ~11 deterministic checks (leftover tokens, frontmatter shape, locked fields, link set, tag multiset, code fences, brand/preserveName counts, English-leak…).
- `printViolations`; on error, set `hadValidationErrors` + append a report line - **the file is written anyway** (`mkdir` + `writeFile` to the `es` target path).
- **`saveTM(dataDirAbs, "es", tmMap)` after every file** (durable on interrupt).

### Phase 5 - Finish

- Per-target `report.line("[es] N/M written")`, close the report file if it started.
- Exit code **`2` if any file failed validation**, else `0`.

### Condensed

```
cli.ts -> config.ts -> commands/translate.ts
  ├─ cli-support.ts (scope, settings, report)
  ├─ discover.ts -> tinyglobby
  ├─ memory.ts (loadTM+self-heal)
  ├─ providers/index.ts -> providers/openai.ts + prompt.ts (Translator)
  └─ per file:
       ├─ pipeline/index.ts (translateMarkdownFile)
       │    ├─ frontmatter.ts · component-block.ts · frontmatter-walk.ts
       │    └─ body.ts -> protect.ts + translate-text.ts -> prompt.ts -> chunk.ts/tokens.ts
       ├─ validate.ts
       └─ write file + memory.ts (saveTM)
```

---

## Part 2 - Deep dive: masking & restoring `<ApiLink>` + `Tree Grid`

The whole reason the toolkit exists: the model must translate prose but **never
touch** code, components, or product names. It achieves this by replacing every
protected construct with an opaque `__TOKEN__` _before_ the model sees the text,
then swapping the originals back _after_. There are **two masking layers**,
because they run at different moments.

Take this body line (`{Platform}` is a build-time token; `Tree Grid` is a
`preserveName`; `<ApiLink/>` is a component; `` `igx-grid` `` is inline code):

```md
The {Platform} Tree Grid supports filtering. See <ApiLink type="IgxGridComponent" member="filter" /> and `igx-grid`.
```

### Layer 1 - AST-level, on the parsed tree: `protectAstNodes` ([protect.ts](src/pipeline/protect.ts))

`translateBody` runs `remark` **with `remark-mdx`** to parse the body into an
AST, then `protectAstNodes` walks it and swaps _node values_ for tokens,
remembering the originals in a `placeholders` map:

| AST node                                       | becomes         | stored in                                                    |
| ---------------------------------------------- | --------------- | ------------------------------------------------------------ |
| `` `igx-grid` `` (inlineCode) / a fenced block | `__BLOCK_n__`   | the node's raw value                                         |
| a `[link](url)` / `![img](url)`                | `__URL_n__`     | the raw URL                                                  |
| `import …` (`mdxjsEsm`)                        | `__JSX_n__`     | **the source bytes** of the whole import block               |
| `{Platform}` (`mdxTextExpression`)             | `__JSX_n__`     | **the source bytes** of the expression                       |
| `<ApiLink … />` (`mdxJsxTextElement`)          | `__JSX_n__`     | **the source bytes** of the whole element                    |
| `<DocsAside>…</DocsAside>` (with children)     | two `__JSX_n__` | the open and close tags; the children stay as ordinary mdast |

The distinction that matters is **restored from source bytes**. A `__JSX__`
token's value is cut straight out of the document by the node's start/end
offsets, so the serializer never re-emits it — which is what keeps
`<Sample src="…" height={510} />` byte-identical rather than re-quoted or
re-indented by `mdast-util-mdx-jsx`.

An element that has children is **flattened**: its open tag, its children and
its close tag become siblings of whatever contained it. That translates the
children like any other prose, and it sidesteps the serializer's habit of
indenting a JSX element's children two spaces per nesting level (four spaces
inside `<ComponentBlock><PlatformBlock>`, which CommonMark would then read back
as an indented code block).

The tree is then `stringify`-ed back to markdown text - now containing tokens
where the code, imports, expressions and tags were.

### Layer 2 - Text-level, after stringify: `extractProtectedBlocks` ([protect.ts](src/pipeline/protect.ts))

Some things aren't AST nodes - a plain-text product name like **Tree Grid** is
just prose. Those are masked on the _stringified text_ (after Layer 1), because
`__…__` tokens must never be re-fed to remark (`__` would be parsed as bold).
`extractProtectedBlocks` applies, in order, and mints `__MDX_n__` tokens:

1. **`protectPatterns`** - this is where **`preserveNames`** lives: the loader
   compiled `Tree Grid` into `(?<![A-Za-z0-9])Tree Grid(?![A-Za-z0-9])`, so
   `Tree Grid` -> `__MDX_0__`.
2. `SAFE_KEY_NAMES` (keyboard keys).

JSX has no rule here any more. `<Component …/>`, `{Platform}` and `import` lines
are all typed MDX nodes, masked in Layer 1 by node type; the `{Placeholder}`
pattern is still declared because it still guards **frontmatter** values, which
have no AST. Note that this layer also runs over frontmatter strings, where it
is the only masking there is.

So by the time the text reaches the model it looks like:

```
The __JSX_1__ __MDX_0__ supports filtering. See __JSX_2__ and __BLOCK_0__.
```

The model only sees translatable words + opaque tokens. The prompt rules
(`tokens.ts` shapes + the "reproduce every `__WORD_n__` exactly once" rule) tell
it to carry the tokens through unchanged. It returns, e.g.:

```
La __MDX_0__ de __JSX_1__ admite el filtrado. Consulte __JSX_2__ y __BLOCK_0__.
```

Note the model **reordered** `__MDX_0__`/`__JSX_1__` for Spanish word order -
that's allowed for `MDX`/`JSX`/`URL` tokens (but **not** `BLOCK`/`FENCE`, which
must keep source order; `realignBlockTokenOrder` enforces that). `JSX` is
deliberately outside that rule: a flattened inline element contributes a
separate open and close token around prose, and target-language word order
legitimately moves the pair.

### Restore - put the originals back, longest-key-first

`translateBody` reverses the two layers, newest masks first:

1. **`restoreProtectedBlocks(prose, fenceBlocks + mdxBlocks)`** - swaps every
   `__MDX__`/`__FENCE__` back to its literal string (`__MDX_0__` ->
   `Tree Grid`). Pure `split/join`.
2. **`restorePlaceholders(text, placeholders)`** - swaps `__BLOCK__`/`__URL__`/`__JSX__`
   back. Keys are sorted **longest-first** so `__BLOCK_1__` can't be partially
   matched by `__BLOCK_10__`; multi-line values (a nested code block) get the
   surrounding indentation reapplied to every line.

Final output - prose translated, everything else **byte-identical**:

```
La Tree Grid de {Platform} admite el filtrado. Consulte <ApiLink type="IgxGridComponent" member="filter" /> y `igx-grid`.
```

`validateTranslation` then double-checks it mechanically: no leftover `__…__`
token, the `<ApiLink>` tag multiset matches, the code fence/inline code is
byte-identical, and `Tree Grid`/`{Platform}` counts didn't drop.

---

## Part 3 - Deep dive: the `collectNode` / `applyNode` ordering guarantee

Frontmatter translation is a **collect -> translate -> reinsert** round-trip. The
danger: after translating a flat list of strings, how do you put each result
back in the _exact_ field it came from - across nested objects and arrays?

The guarantee is structural: **`collectNode` and `applyNode` walk the identical
object in the identical order with the identical predicate**, so the _i_-th
string collected is the _i_-th slot filled. ([frontmatter-walk.ts](src/pipeline/frontmatter-walk.ts))

Take this frontmatter (contract: `title`/`description`/`keywords` translate;
`license` doesn't):

```yaml
title: '{Platform} Tree Grid Overview'
description: 'Learn advanced filtering.'
license: MIT
seo:
  keywords: 'grid, filter'
```

### Collect

`collectNode` iterates `Object.entries` (a deterministic, insertion-ordered
walk), recursing into nested objects/arrays, and pushes a string **only if
`isTranslatableValue(contract, key, value)`** is true - the _same_ decision the
validator and pipeline use everywhere. Following key order exactly, and
recursing into `seo` when it's reached:

```
title        -> translatable      -> acc[0] = "{Platform} Tree Grid Overview"   (+ its mask blocks)
description  -> translatable      -> acc[1] = "Learn advanced filtering."
license      -> NOT translatable  -> skipped (no acc entry)
seo.keywords -> translatable      -> acc[2] = "grid, filter"
```

So:

```
acc = [ "{Platform} Tree Grid Overview", "Learn advanced filtering.", "grid, filter" ]
```

Each entry also carries a **`blocksList[i]`** - the mask map for any
`protectPatterns`/`preserveNames` inside that value (so `{Platform}`/`Tree Grid`
survive here too, exactly like in the body).

### Translate

`translateMany(acc, translator, mem)` returns an array **aligned to input
order** - dedup and TM happen internally but the output index matches the input
index:

```
t = [ "Vista general de {Platform} Tree Grid", "Aprenda el filtrado avanzado.", "grid, filtro" ]
```

### Apply

`applyNode` walks the **same object, same key order, same `isTranslatableValue`
predicate**, carrying a shared counter `cur = { i: 0 }`. For each translatable
leaf it takes `t[cur.i]`, restores that leaf's mask blocks (`blocksList[cur.i]`),
and increments `cur.i`; non-translatable leaves are copied through untouched and
**do not advance the counter**:

```
title       -> translatable -> t[0] -> cur.i=1
description -> translatable -> t[1] -> cur.i=2
license     -> NOT translatable -> "MIT" unchanged, counter stays at 2
seo.keywords-> translatable -> t[2] -> cur.i=3
```

Because collect **skipped** `license` and apply **skips the same `license`**
(identical predicate), the counter never drifts - `t[2]` lands in `seo.keywords`,
not accidentally in `license`. If the two walks used different rules, `cur.i`
would misalign and values would scatter into the wrong fields.

### The safety net

[validate.ts](src/validate.ts)'s `flatten` mirrors this exact traversal to
produce ordered leaves for both source and translation, then asserts
**`same shape`** (same count, same dotted paths). If a translation dropped or
added a field - the failure this ordering is designed to prevent - the validator
raises `shape-mismatch` and it's caught before it ships.

---

## Part 4 - The `sync` (incremental) path

`translate` re-does a whole file. `sync` re-translates **only the blocks that
changed** between two versions of the EN source and keeps the existing
translation for everything else - the 90%-case workflow where someone edits one
paragraph of an already-translated page. The command traced here:

```
npx tsx src/cli.ts sync --config configs/docs-template-xplat.config.mjs --locale es --file "components/ai/ai-assisted-development-overview.mdx"
```

### Phase 0-1 - Bootstrap, discovery, scoping (shared)

Identical to `translate` Phases 0-1: `cli.ts` -> `loadConfig` -> **`cmdSync`**
([src/commands/sync.ts](src/commands/sync.ts)); `discover` + `scopeFiles(--file)`
narrows to the one changed page. `promptSettingsFrom` / `validateSettingsFrom`
build the same settings objects.

### Phase 2 - Resolve the "old" EN source ONCE

- `base = --base ?? "HEAD"`. No `--base-file`, so open a git reader:
  **[src/git.ts](src/git.ts) - `openGitReader(sourceDirAbs, "HEAD")`** -
  `git rev-parse --show-toplevel` (repo root) + `rev-parse --verify HEAD^{commit}`
  (ref valid?), each run **once**. A bad ref throws **here**, before any work.
- `readOldEn(file)` = one `git show HEAD:<repo-rel-path>` per file. `toLf`
  collapses CRLF->LF on both EN sides (so an `autocrlf` working tree doesn't make
  every line look changed).

### Phase 3 - Pre-read + skip (per file, shared across locales)

- `enNewRaw` = working-tree read (`fs.readFile`, `toLf`); `enOldRaw` =
  `readOldEn(file)` (or `undefined` if the path didn't exist at `HEAD` - a
  brand-new page).
- **`enOldRaw === enNewRaw` - `SKIP` (EN unchanged).** Otherwise queue it.

### Phase 4 - Per locale - `runOne(f)`

Same per-locale setup as `translate` (`loadTM`, `makeTranslatorFor`), plus two
injected translators built here: **`translateBlock`** (a body block ->
`translateBody`, i.e. the full protect->translate->restore from Part 2) and
**`translateValue`** (one frontmatter scalar). Then, per file:

- **New page (`enOldRaw === undefined`) or locale not translated yet
  (`state === "missing"`)** - `translateMarkdownFile(enNewRaw, …)` - the exact
  full-file path from Part 1 (nothing to preserve).
- **Otherwise** -> read the existing target and call
  **[src/incremental.ts](src/incremental.ts) -> `syncDocument(enOld, enNew, target)`**:
  - `matter()` splits all three into `{ data, content }`.
  - **`spliceBody`**: `splitBlocks` cuts each body into blank-line blocks
    (fence-aware). Guard: if `oldBlocks.length !== targetBlocks.length` the target
    is no longer parallel to EN-old -> **`ABORT`** (write nothing). Else walk
    **`diffArrays(oldBlocks, newBlocks)`** ([`diff`](DEPENDENCIES.md)):
    _unchanged run_ -> push the target's block (no model call); _removed_ -> skip;
    _added/changed_ -> `await translateBlock(block)`.
  - **`mergeValue`**: field-level 3-way frontmatter merge - a value unchanged from
    EN-old keeps the target's translation; a changed translatable value is
    re-translated via `translateValue`; locked fields follow the source.
  - Reassembles `---\n<yaml>\n---\n\n<body>`.

### Phase 5 - Validate & write (shared)

- **`validateTranslation(enNewRaw, output)`** - the **same** deterministic
  validator as `translate`, run whether the output came from a splice or a full
  translate.
- Write the target (unless `--dry-run`); `saveTM` per locale.

### Condensed

```
cli.ts -> config.ts -> commands/sync.ts
  ├─ git.ts (openGitReader: root + ref ONCE, fail-fast)
  ├─ discover.ts + cli-support.ts (scope to changed files)
  ├─ per file: EN-new (disk) vs EN-old (git show <base>) -> toLf -> SKIP if equal
  └─ per locale:
       ├─ new file / missing target -> pipeline/index.ts (full translate)
       └─ else -> incremental.ts (syncDocument)
            ├─ spliceBody: splitBlocks -> diffArrays -> keep | translateBlock | ABORT
            └─ mergeValue: 3-way frontmatter merge
       ├─ validate.ts (same validator)
       └─ write (unless --dry-run) + memory.ts (saveTM)
```

**Why the split path:** `sync`'s changed/added blocks and the whole full-translate
branch run the identical [body.ts](src/pipeline/body.ts) masking from Part 2, so a
spliced page and a fully-translated page get the same structural guarantees - the
only difference is how much of the file is sent to the model.

---

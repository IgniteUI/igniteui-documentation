# Dependencies - what each one is for

Why every package in [`package.json`](package.json) is here, with a concrete
example from this codebase. The guiding principle: **lean on a battle-tested
library where one exists for a general problem (markdown, YAML, globbing,
concurrency); keep custom code only for the domain-specific parts** (masking,
validation, prompt-building) that no library does. Notably absent by design:
no HTTP client and no LLM SDKs - every provider is plain `fetch`, so the runtime
dependency list stays short.

---

### The markdown engine (remark / unified)

Five packages form the core of "structure-preserving translation": a document
is parsed into an AST, the non-prose parts (code, JSX, links) are masked, the
prose is translated, then the AST is written back - so structure comes out
byte-identical.

#### `unified`

The processor that ties the remark plugins together - you `.use()` plugins onto
it and it manages parse -> transform -> stringify. It's the spine of the pipeline.

```js
// src/pipeline/body.ts
const tree = unified().use(remarkParse).use(remarkGfm).parse(body);
```

**Without it:** no orchestration layer for the remark plugins below.

#### `remark-parse`

Turns a raw Markdown/MDX string into a tree of typed nodes (`heading`, `code`,
`link`, `paragraph`, …). That typed tree is what lets us tell _prose_ from
_code/links_ deterministically instead of guessing with regexes.

```
"## Overview" + a fenced code block
   -> { type: 'heading', … }  { type: 'code', … }  { type: 'paragraph', … }
```

**Without it:** masking would be fragile regex matching instead of structural.

#### `remark-stringify`

The inverse of `remark-parse`: serializes the (now translated) tree back to
Markdown text.

```js
// src/pipeline/body.ts
unified().use(remarkStringify, { bullet: '-' }).use(remarkGfm)…
```

The `{ bullet: '-' }` option pins list-marker style so translation never churns
`*` bullets into `-` (or vice versa) in the diff.

**Without it:** no way to round-trip the AST back to a markdown file.

#### `remark-gfm`

Extends both parse _and_ stringify to understand GitHub Flavored Markdown -
tables, strikethrough, task lists, autolinks - which the docs use heavily.

```js
.use(remarkGfm)   // added on BOTH the parse and the stringify processors
```

**Without it:** a `| col | col |` table is misparsed as plain text and can get
mangled during translation.

#### `remark-mdx`

Teaches the same parse/stringify pipeline that MDX is not CommonMark. With it,
an `import` statement, a `{Platform}` expression and a `<Component …>` tag are
each a **typed node with source offsets** (`mdxjsEsm`, `mdxTextExpression`,
`mdxJsxFlowElement`/`mdxJsxTextElement`) instead of prose, a blockquote or an
HTML blob.

```js
.use(remarkMdx)   // added on BOTH the parse and the stringify processors
```

**Without it:** every one of those constructs is misparsed, and the engine needs
a text-level repair pass per symptom - rewriting raw source before the parser
sees it, which cannot tell authored markup from a code _sample_ that merely
looks like markup. That is the layer this dependency replaced; see
`REMARK-MDX-MIGRATION.md` for the before/after.

#### `unist-util-visit` (removed)

`protectAstNodes` used to walk the tree with `visit`. It now uses its own
recursive walker, because masking a JSX element means **replacing one node with
several** (open tag, children, close tag) and **coalescing adjacent siblings**
into one mask - neither of which fits `visit`'s one-node-at-a-time contract.

### The frontmatter half (gray-matter + js-yaml)

**What "frontmatter" is:** the `--- … ---` YAML block at the very top of a
markdown/MDX file that holds its structured metadata - `title`, `description`,
`keywords`, `canonicalLink`, etc.:

```yaml
---
title: Angular Grid Overview
description: The Ignite UI for Angular grid displays tabular data.
canonicalLink: /components/grid
mentionedTypes: ['IgxGridComponent']
---
# Grid (this part is the body)
```

It has to be handled **separately from the body** because it's structured data,
not prose: only _some_ keys translate (`title`, `description`) while others must
stay byte-identical (`canonicalLink`, `mentionedTypes`) - the decision the field
contract makes. So the pipeline needs to (1) **read** the block into an object,
translate the right keys, then (2) **write** the object back to YAML. Those are
the two dependencies below - one for each direction.

#### `gray-matter` - reads frontmatter IN

Splits a raw file string into `{ data, content }` - the parsed frontmatter as a
JS object, and the markdown below it - so the pipeline can walk `data` by
contract and translate the body independently.

```js
// src/pipeline/index.ts
const { data, content: body } = matter(normalized);
// data = { title: 'Angular Grid Overview', canonicalLink: '/components/grid', … }
// body = '# Grid …'
```

It handles the fiddly parts robustly: locating the `---` fences, tolerating
`\r\n` vs `\n`, empty frontmatter, and running the YAML parse. Used for
**parsing only** in this project - writing goes through `js-yaml` directly
(next), because gray-matter's _own_ `stringify` gives us no control over
formatting.

**Without it:** we'd hand-roll `---`-fence detection + YAML parsing and its edge
cases.

#### `js-yaml` - writes frontmatter OUT

Serializes the (now partly-translated) frontmatter object back to a YAML string.
We call js-yaml **v4 directly** (via [src/frontmatter.ts](src/frontmatter.ts))
rather than letting gray-matter write it, because gray-matter bundles the older
**js-yaml v3**, whose formatting we can't control - and formatting drift shows up
in every single translated file's diff.

```js
// src/frontmatter.ts
yaml.dump(data, { lineWidth: -1, quotingType: '"', noRefs: true });
```

What each option buys us:

- **`lineWidth: -1`** - disables line-folding. js-yaml v3 would fold any value
  over ~80 chars into a multi-line `>-` block scalar, so a one-line
  `description:` in the English source becomes a wrapped multi-line block in
  _every_ translation - pure, meaningless diff noise. `-1` keeps values on one
  line, matching the source.
- **`quotingType: '"'`** - when a value _needs_ quoting, use double quotes (the
  convention the docfx source uses), not js-yaml's default single quotes.
- **`noRefs: true`** - never emit YAML anchors/aliases (`&ref`/`*ref`) for
  repeated values; docs frontmatter should be literal, not reference-linked.

On top of `yaml.dump`, `src/frontmatter.ts` adds small post-passes js-yaml
_can't_ express per-key (force specific keys quoted, keep a specific array on one
line) - see that file. `@types/js-yaml` (a dev dependency) supplies the types,
since js-yaml ships none.

**Without it:** frontmatter output would drift in formatting (folding, quote
style) on every run, burying the real translation changes in noise.

**The round-trip in one line:** `gray-matter` reads the `---` block into an
object -> the pipeline translates the contract-approved keys -> `js-yaml` writes
the object back -> the two are wrapped in `--- … ---` again by
`stringifyDocument`.

### Files & concurrency (tinyglobby + p-limit)

#### `tinyglobby`

Finds the source files to translate - the same lean glob engine Astro/Vite use.

```js
// src/discover.ts
await glob(cfg.source.include, { cwd: cfg.sourceDirAbs, ignore });
// -> ['components/grid/overview.mdx', 'components/chart/types.mdx', …]
```

Replaced a hand-rolled `**`/`*`/`?` matcher - this adds robust brace/negation
support and removes ~70 lines of custom, untested code.

**Without it:** we'd maintain our own recursive directory walker + glob-to-regex
compiler (which is exactly what we deleted).

#### `p-limit`

Caps how many files translate at once - the same battle-tested micro-lib
Astro/Vite use.

```js
// src/commands/translate.ts
const limit = pLimit(concurrency);
await Promise.all(queue.map((f) => limit(() => runOne(f))));
```

Keeps at most `concurrency` provider requests in flight, so a 450-file run
doesn't fire 450 API calls simultaneously (rate limits / memory) while still
running N in parallel.

**Without it:** we'd hand-roll a worker pool draining a shared array (which is
exactly what we replaced).

---

### Incremental sync/diff

#### `diff`

Aligns the OLD vs NEW English blocks in `sync`, so only the blocks that actually
changed are re-translated and every unchanged block keeps its existing (human)
translation. `diffArrays` is an LCS-based array differ - it correctly handles
inserted/deleted blocks (a positional compare would mis-map everything after an
edit).

```js
// src/incremental.ts
for (const run of diffArrays(oldBlocks, newBlocks)) {
  if (run.added) /* translate each new block */ ;
  else if (run.removed) /* skip - that block/translation is gone */ ;
  else /* unchanged run - reuse the target's existing translation */ ;
}
```

---

## Providers - plain `fetch`, no SDK

Every provider is a small `fetch` wrapper (no vendor SDK, no HTTP-client
dependency), sharing `fetchWithRetry` (bounded exponential backoff on
429/5xx/network, honoring `Retry-After`) and `requireApiKey`. That's why the
runtime list has no `openai` / `@anthropic-ai/sdk` / `@google/genai`.

| Provider    | Transport        | JSON mode                      | Truncation guard                      | Judge-capable |
| ----------- | ---------------- | ------------------------------ | ------------------------------------- | ------------- |
| `anthropic` | Messages API     | (prompt-driven)                | `stop_reason === max_tokens` → throw  | yes           |
| `openai`    | Chat Completions | `response_format: json_object` | `finish_reason === length` → throw    | yes           |
| `gemini`    | generateContent  | `responseMimeType`             | `finishReason === MAX_TOKENS` → throw | yes           |
| `ollama`    | `/api/generate`  | `format: json`                 | —                                     | yes           |

Concurrency: `provider.concurrency` (default 4; `ollama` 1). Adding a provider is
one registry entry — see [ARCHITECTURE.md](ARCHITECTURE.md) → "Add a translation
provider".

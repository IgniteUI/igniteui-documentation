# Validation -the deterministic safety net (Layer 1)

`src/validate.ts` compares an English source against **one** translated file and
reports every structural defect the model (or the restore step) may have
introduced. It is **Layer 1**: deterministic, pure (no I/O, no model), and
CI-blocking. Layer 2 -the LLM judge -grades _meaning_; this layer proves
_structure_.

- **Errors** = broken/corrupt output that must NOT ship → set exit code `2`.
- **Warnings** = visibly unfinished but not broken (English leakage) → reported,
  never block.

**Where it runs:** inline after every `translate` (the file is still written on
error -`judge --fix` is the repair pass), as the cross-check and fix-gate in
`judge`, and as the standalone `validate` audit command. `hasErrors()` is the
gate all three use to decide exit code `2`.

---

## Two concepts people conflate: `byte-token` vs "byte-identical"

They sound similar but are different:

### `byte-token` -a defect (a literal `<0xNN>` leak)

Local LLMs sometimes emit raw UTF-8 **byte-fallback tokens as literal text**
instead of the actual character. A non-breaking space (`U+00A0`) should be one
invisible character, but the model outputs the literal string:

```
Ignite UI<0xC2><0xA0>for Angular
```

`prompt.ts`'s `decodeByteTokens` tries to reassemble those bytes first; the
validator is the backstop. **What's checked:** did any raw `<0x..>` token leak
into the visible output?

### "byte-identical" -a comparison method (exact `===`)

Not a defect class -it's _how_ some checks compare. "Byte-for-byte" means exact
character-for-character equality (`a === b`), no normalization. Used where the
model must change **nothing** (code blocks, locked fields). Source code:

```js
const grid = new IgxGridComponent(); // create the grid
```

If the translation changes even one character (e.g. translates the comment to
`// crear la cuadrícula`), `enCode[i] !== trCode[i]` → `code-mismatch`.

So: `byte-token` = "no raw byte tokens leaked"; `byte-identical` = "this thing
wasn't touched at all."

---

## Every check, with an example

Target language in the examples is **Spanish**. Each shows the source, a bad
translation, and the violation it raises.

### 1. `leftover-token` (error)

Inline code `` `igx-grid` `` is masked to `__BLOCK_0__`, translated, then
restored. If restore fails, the placeholder survives:

```
Source (masked):  Use __BLOCK_0__ to render.
Bad output:       Usa __BLOCK_0__ para renderizar.   ← token never swapped back
```

→ `Unrestored placeholder token "__BLOCK_0__" -markup restore failed`

### 2. `byte-token` (error)

```
Bad output:  Presione <0xC2><0xA0> para continuar.
```

→ `Literal byte-fallback token "<0xC2>" leaked into output`

### 3. `unparseable` (error)

The model breaks the YAML frontmatter (e.g. an unquoted value with a colon):

```yaml
---
title: Cuadrícula: la guía # bare colon → invalid YAML
---
```

→ `Translated file does not parse as frontmatter+body: …`
(If the _source_ is the thing that won't parse, the validator returns quietly —
that isn't the translation's fault.)

### 4. `shape-mismatch` (error)

A frontmatter field or array element is dropped, added, or retyped. Here the
model drops an array element:

```yaml
Source:   keywords: ["grid", "data grid"]      # 2 string leaves
Bad:      keywords: ["cuadrícula"]             # 1 string leaf
```

→ `Frontmatter structure changed (field dropped, added, or retyped): keywords: 2 → 1`

This check **gates the per-field checks below** -value comparisons are only safe
when both frontmatters have the same shape in the same order.

### 5. `preserved-modified` (error)

A locked (non-translatable) field -a URL, asset path, id -was changed:

```yaml
Source:   canonicalLink: /components/grid
Bad:      canonicalLink: /componentes/cuadricula
```

→ `Non-translatable field was modified: "/components/grid" → "/componentes/cuadricula"`

### 6. `enum-violation` (error) -two flavors

**(a) Declared enum set** -`enums: { status: ['active', 'deprecated'] }`:

```yaml
Source:   status: active
Bad:      status: activo
```

→ `Enum field "status" has non-key value "activo"`

**(b) enumKey slug** -`enumKeys: ['category']`, value is slug-shaped:

```yaml
Source:   category: big-data
Bad:      category: grandes-datos
```

→ `Enum key "category" was translated ("big-data" → "grandes-datos") -must stay verbatim`

(The same `category` field with a prose value like `Big Data & Analytics` would
translate normally -the decision is per-value via `isSlugLike`.)

### 7. `link-mismatch` (error)

The model translates a URL (it should translate only the link _text_):

```
Source:   See the [data grid](../data-grid) page.
Bad:      Vea la página [cuadrícula](../cuadricula-de-datos).
```

→ `Link targets differ from source (1 → 1) -dropped/changed: ../data-grid · new/altered: ../cuadricula-de-datos`

Link _text_ (`data grid` → `cuadrícula`) is fine -only the target `../data-grid`
is compared. Targets are sorted first, so reordering links in a sentence does not
trigger it; only an added/dropped/changed target does.

### 8. `tag-mismatch` (error)

An HTML/JSX tag is invented, dropped, or its name mangled. Here a component is
dropped:

```
Source:   <ApiLink type="IgxGrid" /> filters rows.
Bad:      Filtra las filas.                        ← <ApiLink/> gone
```

→ `Tag counts differ from source: apilink: 1 → 0`

Attributes are ignored; only the multiset of tag **names** (open + close) is
compared -so a model that invents `<strong>` or drops a `</p>` is caught too.

### 9. `code-mismatch` (error) -count _or_ content

**Count** -a fenced block is dropped or merged:

````
Source has 2  ```js  blocks; translation has 1
````

→ `Fenced code block count differs: 2 → 1`

**Content** -a block is edited (the byte-identical example):

```js
// create the grid      →      // crear la cuadrícula
```

→ `Code block #1 content changed during translation`

Fences indented inside a list item are included -a naive "fence at column 0"
regex would skip those and miss corruption specific to indented blocks.

**Every** differing block is reported, not just the first. Stopping at the first
understates the damage and makes a partial fix look complete: three pilot files
each reported one mismatch while actually having three, six and two, so a change
repairing only block #1 would have shown a clean report and still shipped
corrupted samples.

### 10. `untranslated` (**warning**, not error)

A translatable prose field came back byte-identical to English:

```yaml
Source:   description: The grid displays tabular data.
Bad:      description: The grid displays tabular data.   # identical, real prose
```

→ `Translatable field came back identical to English` **(warn)**

It does **not** fire on values that _should_ stay identical -`title: API`,
`title: Bold BI`, a bare URL, or a number. After stripping placeholder tokens,
tags, URLs, `doNotTranslate` terms, AM/PM, and non-letters, those leave no real
prose behind, so there's no false positive.

### 11. `brand-translated` (error)

An **unmasked** `doNotTranslate` term occurs fewer times than in the source. With
`doNotTranslate: ['Ignite UI']` (3× in source):

```
Source:   Ignite UI … Ignite UI … Ignite UI      (3×)
Bad:      Ignite UI … Encender UI … Ignite UI     (2× -one got translated)
```

→ `"Ignite UI" appears 3× in the source but only 2× in the translation -likely translated, paraphrased, or dropped`

This is the deterministic backstop for `doNotTranslate`, which the prompt
otherwise only _asks_ the model to honor.

Note the word **unmasked**. `preserveNames` terms are masked to a placeholder
before the prompt is built, so the model never sees them and _cannot_ translate
them — a shortfall there is a different failure with a different fix, and it is
reported separately as `brand-token-dropped` (check 14).

### 12. `import-mismatch` (error)

An MDX `import` statement was altered, dropped, or invented. The import block is
machine-generated, never prose, and must be byte-identical in every locale.

```
Source:   import DocsAside from 'igniteui-astro-components/…/DocsAside.astro';
Bad:      import DocsAside от   'igniteui-astro-components/…/DocsAside.astro';
```

→ `Import #1 changed during translation: "import DocsAside from '…'" → "import DocsAside от '…'"`

Why it needed its own check: an import line contains **no tags** (so
`tag-mismatch` is blind to it) and is **not a fenced block** (so `code-mismatch`
is too). The pipeline's masking layer only recognizes `<Capitalized …>` JSX,
code, links, and project `protectPatterns` — a bare `import X from '…';` matches
none of those, so it reaches the model as ordinary prose and gets translated like
any other sentence. That is exactly what happened on the first local-model run:
all four imports of `spreadsheet-chart-adapter.mdx` came back with the
JavaScript keyword `from` rendered in Bulgarian, a hard Astro build failure that
nothing flagged.

The masking gap is fixed per project with a `protectPatterns` entry (the docs
configs now carry one); this check is the backstop for projects that don't.

Two deliberate non-firings:

- **Prose that merely uses the word.** "You can import data from a workbook."
  is not an import statement -the line must both _start_ with `import` and _end_
  with a quoted module specifier -so it still translates normally.
- **Indentation-only changes.** Statements are compared trimmed, so re-indenting
  is not reported as a defect.

### 13. `protected-dropped` (error)

A construct matched by the project's own `protectPatterns` occurs fewer times
than in the source. These are masked to placeholder tokens before the model sees
them, so a shortfall means the model **dropped the token** rather than
reproducing it.

```
Source:   # {Platform} Area Chart
Bad:      # Първи стъпки с площна диаграма      ({Platform} gone, heading invented)
```

→ `Protected construct /\{[A-Za-z][A-Za-z0-9]*\}/ appears 45× in the source but only 17× in the translation`

Why it needed its own check: a _dropped_ placeholder is invisible to every other
check. It is not a leftover token (the token is gone, not stranded), not a tag,
link or fenced block, and not a `doNotTranslate` term. On the Bulgarian pilot a
local model dropped 28 of 45 `{Platform}` tokens in one file and substituted
invented headings; only the LLM judge noticed, which is an expensive way to catch
something deterministic.

### 14. `brand-token-dropped` (error)

A **masked** `preserveNames` term occurs fewer times than in the source. Same
symptom as `brand-translated`, entirely different cause:

|                  | mechanism                                 | what a shortfall means            |
| ---------------- | ----------------------------------------- | --------------------------------- |
| `preserveNames`  | masked to a placeholder before the prompt | the model dropped the **token**   |
| `doNotTranslate` | prompt instruction + this validator       | the model **translated** the word |

Splitting them matters because the fixes are unrelated — one is a token-adherence
problem (mitigated by a stronger model or reasoning mode), the other is a missing
structural guarantee (fixed by masking the term). Reporting both as
`brand-translated` hid that distinction for the whole of the Bulgarian pilot.

---

## How each check compares (the fingerprint)

Every check extracts a **fingerprint** from both files and compares them:

| #   | Code                  | Fingerprint compared         | Comparison                |
| --- | --------------------- | ---------------------------- | ------------------------- |
| 1   | `leftover-token`      | whole-file token regex scan  | any present?              |
| 1   | `byte-token`          | whole-file `<0xNN>` scan     | any present?              |
| 2   | `unparseable`         | gray-matter parse            | does it parse?            |
| 3   | `shape-mismatch`      | ordered frontmatter leaves   | count + path equality     |
| 5   | `preserved-modified`  | locked field value           | `!==` (byte-identical)    |
| 6   | `enum-violation`      | enum value / slug value      | set membership / `!==`    |
| 7   | `link-mismatch`       | sorted link targets          | set equality              |
| 8   | `tag-mismatch`        | tag-name multiset            | count-per-name equality   |
| 9   | `code-mismatch`       | fenced code block contents   | count + `!==`, ALL blocks |
| 10  | `untranslated`        | field value (+ prose test)   | equality + "prose left?"  |
| 11  | `brand-translated`    | term occurrence count        | `trCount < enCount`       |
| 12  | `import-mismatch`     | ordered import statements    | count + `!==` per import  |
| 13  | `protected-dropped`   | protectPatterns match count  | `trCount < enCount`       |
| 14  | `brand-token-dropped` | masked term occurrence count | `trCount < enCount`       |

Two comparison styles recur:

- **Exact `!==` (byte-identical)** for things that must never change -code
  blocks, locked fields.
- **Set / multiset / count** for things that may move but not appear or
  disappear -links, tags, brand terms. (A link can be reordered in a sentence as
  long as it's still there; a code block's position is rigid.)

---

## The prompt ↔ validator pairing

Every check is the deterministic enforcement of a prompt rule
(`src/prompt.ts`). The prompt is the **request**; the validator is the
**receipt** -nothing the model is _asked_ to do is trusted until this pure layer
confirms it.

| Prompt rule                      | Validator check                                    |
| -------------------------------- | -------------------------------------------------- |
| "reproduce every `__TOKEN__`"    | `leftover-token`                                   |
| "keep tags / URLs / code as-is"  | `link-mismatch` / `tag-mismatch` / `code-mismatch` |
| (masked, never shown to model)   | `import-mismatch`                                  |
| "keep `doNotTranslate` verbatim" | `brand-translated`                                 |
| "translate all visible text"     | `untranslated` (warn)                              |
| structural invariants            | `unparseable` / `shape-mismatch`                   |

That is the core safety model: the LLM is unreliable, so anything it corrupts
sets exit `2` and gets a repair pass -making "let a model edit my MDX" safe.

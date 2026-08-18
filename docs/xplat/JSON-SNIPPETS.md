# Authoring json-snippet blocks

A topic states a component once, as JSON, and generation turns it into each platform's own code. The
alternative — and what most of these topics used to be — is one hand written block per platform,
which is four to six copies of the same lesson that drift apart one edit at a time.

Four lines of JSON:

````mdx
```json-snippet source="/inputs/color-editor/overview"
{
    "type": "ColorEditor",
    "name": "colorEditor"
}
```
````

produce, on the four platforms that publish this topic:

```html
<igx-color-editor
    #colorEditor>
</igx-color-editor>
```

```tsx
<IgrColorEditor
    ref={this.colorEditorRef} />
```

```razor
<IgbColorEditor
    @ref="colorEditor" />
```

```xml
<igInputs:XamColorEditor
    Name="colorEditor" />
```

Nobody wrote those four. The element name, the reference idiom, whether an empty element self closes,
how a number is written — all of it comes from the component's own description metadata, which is the
same metadata the product ships. A property the description does not have cannot be emitted, which is
what makes a schema check possible at all.

> **The default is every platform.** A definition emits everywhere the topic publishes. Hiding it from
> a platform is a decision that needs a reason, and "the library item only exists for the others" is
> not one — see [Coverage](#coverage-when-a-platform-should-not-see-something).

---

## The fence

````
```json-snippet source="/maps/geo-map/binding-multiple-shapes" channel="handler" item="MapMultipleShapesLoad"
````

| attribute | what it does |
|---|---|
| `source="/path"` | the sample this definition mirrors. Generation fails if the path names no sample, so a moved sample cannot leave a topic pointing at nothing. |
| `id="name"` | names this definition so later fences can re-emit it. |
| `ref="name"` | emits another channel of a definition stated once further up the page. The body is empty; the definition is not repeated. |
| `channel="..."` | which part of the sample to show. Default `markup`. See [Channels](#channels). |
| `item="Name"` | narrows the block to one library item — a handler the sample runs, or a supporting item whose region is being shown. A name that is neither is an error. |
| `exclude="Platform,…"` | drops the fence on those platforms. Takes the same spelling `PlatformBlock` takes, so `Xaml` covers all the XAML platforms. Read [Coverage](#coverage-when-a-platform-should-not-see-something) before reaching for it. |
| `code="auto\|allCode\|none"` | the companion code block beside markup. Default `auto`. |

### The companion code block

Some properties cannot be written as an attribute on some platforms — a data source or a template on
Web Components is assigned in script. The emitter knows which, because it is what decided, so a topic
does not declare that a code block is needed:

- `code="auto"` (default) — the assignments alone, and nothing at all if the markup said everything.
  Angular binds its data source in the template and gets no block; Web Components gets two lines.
- `code="allCode"` — the fuller form, including how the reference was obtained and the field
  declaration. What an introductory page wants.
- `code="none"` — off, for a topic that would rather write its own.

---

## Channels

A channel is the part of the sample a fence shows. `markup` is the default and needs no attribute.

| channel | what comes out |
|---|---|
| `markup` | the component, declared |
| `code` | the component, built in code rather than declared |
| `allCode` | everything the sample runs |
| `handler` | one event handler's body |
| `eventHandlers` | every handler the sample runs |
| `data` | the data the sample binds |
| `template` | a cell or tooltip template |
| `supporting` | the types a handler calls into |
| `module` | module registration |
| `auto` | whichever channel the definition's own markers asked for — see [Splaying by platform](#splaying-by-platform) |

Finer than a channel are the **regions** each emitter writes, and every region name is a channel token
too:

| region | holds |
|---|---|
| `bindingImports`, `handlersImports`, `modulesImports` | the imports each part needs |
| `bindingFields`, `bindingInit`, `bindingCode` | the field, how the element was reached, the assignments |
| `moduleRegistration` | the registration calls |
| `onInit`, `onViewInit`, `eventHandlers`, `handlersStyles`, `eventScript` | the handler emitter's output |
| `templates`, `templateScripts`, `templateStyles`, `supportingMethods`, `supportingTypes` | the template emitter's output |

A library item may also declare **its own** regions, and those are channel tokens as well. This is how
a topic shows one method of a supporting type at a time:

````mdx
```json-snippet ref="shapes" source="/maps/geo-map/binding-multiple-shapes" channel="readPolygons" item="MapMultipleShapesReaders"
```
````

### Composing several regions

A topic showing code behind rarely wants one region. The delimiter between two names says what goes
between them in the block:

```
channel="bindingImports...bindingFields,bindingInit,bindingCode"
```

- `,` joins two regions directly
- `...` puts the platform's own comment ellipsis between them, because they are excerpts from
  different parts of a file rather than one run of statements

A region this platform writes nothing to drops out and takes its delimiter with it, so a block never
opens or ends with a stray mark. `channel="codeBehind"` is shorthand for
`bindingImports...bindingInit,bindingCode`.

---

## Sidecars and markers

A key beginning with `$` is a sidecar: it says something *about* the property of the same name rather
than setting it. `$type` is the sidecar for the element itself, so marking `$type` marks the element.

A sidecar rather than a decorated key, so the real key keeps its real spelling — the editor can still
complete it, and a mistyped `$widht` is a schema error rather than a silently dropped property.

### The marker grammar

```
<+|->[>]<id>[:<channel>]
```

| part | meaning |
|---|---|
| `+` | record this into the snippet |
| `-` | leave it out |
| `>` | contents only — omit this element's own scaffolding |
| `id` | which snippet. **In these topics it is always `doc`**, which is what a fence asks for |
| `:channel` | which output to capture from. Omitted means `markup` |

The value may be one marker or an array of them, so a property belonging to more than one channel
needs no extra keys: `"$width": ["+doc:markup", "+doc:code"]`.

### What a snippet captures to begin with

One rule, and it follows from the markers alone — never from where they sit:

| markers naming the snippet | baseline | so the markers act as |
|---|---|---|
| none at all | include everything | — |
| only exclusions | include everything | subtractions |
| any inclusion | exclude everything | selections |

The innermost marker wins, so exclusions nest inside inclusions and back again, to any depth.

**No markers** is the common case: the fence prints the whole definition, and most topics need nothing
else.

**Only exclusions** keeps the sample complete but prints less of it — the right way to leave a height
and width out of a block while the sample still sets them and still runs:

```json
{
    "type": "DataChart",
    "height": "400px",
    "$height": "-doc",
    "series": [ ... ]
}
```

**Any inclusion** closes the definition and opens only what is marked. This is the commonest shape in
these topics — a complete, runnable definition that prints only the element the section is about:

```json
{
    "type": "DataChart",
    "series": [
        {
            "type": "LineSeries",
            "$type": "+doc:markup",
            "markerType": "Circle",
            "$markerType": "+doc:markup"
        }
    ]
}
```

> **A snippet is a whole sample that shows part of itself.** Write the complete definition and mark
> the part, rather than writing the fragment alone. The two print the same block, but only the
> complete one can be run — which is what the live harness does with every fence, and what a later
> screenshot pass will need. Two topics were written as bare fragments; one of them was hiding a real
> bug that the schema caught the moment it was rooted in a chart.

### Contents only

`"$type": "+>doc:code"` records what is inside an element without its own scaffolding. The motivating
case is code behind — two assignments without the `var series1 = new LineSeries();` above them.

In markup it has a sharp edge: attributes are emitted *between* the opening and closing scaffolding,
so contents-only on a markup element gives you its attributes and children without the tag, which is
dangling text rather than valid markup. Use it on a markup element only to take children without their
wrapper.

### Handlers, data and templates are requested, not wrapped

Those three are emitted later, by a different emitter, into a different place, so a zone around the
property that references them cannot capture them. The reference registers a *request* keyed by the
library item's name, and the emitter opens the zone when it reaches that item. That is why `item=`
names a library item, and why a misspelled name gives you an empty block rather than an error — the
emission check is what turns that into a failure.

### Splaying by platform

A sidecar's value may be an object keyed by platform, with `default` covering the rest. The platform
key is the platform name with a lower case first letter:

```json
"$dataSourceRef": { "webComponents": "+doc:bindingCode", "default": "+doc:markup" }
```

This is what `channel="auto"` reads: a value the reader sets in code on one platform and writes in
markup on another is not the same lesson, and the fence takes whichever the marker chose — and is
labelled with that channel's language.

### The other sidecars

| sidecar | meaning |
|---|---|
| `$comment` | a remark emitted **ahead of this element**, in the platform's own comment syntax. Give the text alone — `"loads the shapes"`, not `"// loads the shapes"`. Because elements nest, one on a series lands mid-block, above that series' code. |
| `$comments` | the same, but keyed by property, so the remark lands above the line that one property produced: `"$comments": { "markerTypes": "on CategoryChart or FinancialChart" }`. An entry matching no emitted line is reported rather than dropped. |
| `$styleOptions` | see [Style options](#style-options) |
| `$setInCode` | names the platforms where this property is set in code rather than markup: `"$setInCode": { "dataSourceRef": ["webComponents"] }` |
| `$assignInCode` | the same, for a property assigned rather than set |

A comment explaining code **inside a handler** does not belong in a sidecar at all — put it in the
handler's own source in the examples checkout, where it is emitted along with the code it explains.
The sidecars are for the part of a block the renderer generates, which has no other home. An
elision between two excerpts is a third thing again: that is the `...` delimiter between channel
names, and between a class field and the statements under it the emitter writes one itself.

---

## Style options

`$styleOptions` on a definition overrides the documentation defaults for that one snippet. The
defaults live in `SNIPPET_STYLE_DEFAULTS` in `scripts/generate.mjs` and are what the topics have
always looked like — a sample only needs to name what it wants differently.

| option | values | effect |
|---|---|---|
| `indentAttributes` | bool | one attribute per line |
| `indentXamlAttributes` | bool | the same, for XAML |
| `attributeLayout` | `"singleLine"` | everything on one line instead |
| `selfCloseEmptyElements` | bool | `<X />` rather than `<X></X>` |
| `numericAttributeStyle` | `"bare"`, `"quoted"`, `"braced"` | how a number is written. Angular bare, React braced, the rest quoted |
| `booleanAttributeStyle` | `"bare"`, `"quoted"`, `"braced"` | the same for booleans |
| `colorNotation` | `"hex"`, `"rgba"` | how a colour is written |
| `uppercaseHexColors` | bool | `#FFAA00` rather than `#ffaa00` |
| `pascalCaseColorNames` | bool | `Red` rather than `red` |
| `suppressAutoElementNames` | bool | leave off names the emitter would invent |
| `suppressNameAttribute` | bool | leave off the name attribute entirely |
| `omitHandlerSignature` | bool | show a handler's statements, not the method wrapping them |
| `omitDimensions` | bool | no height and width — the XAML platforms let the panel decide |
| `directAssignment` | bool | build a property where it is assigned rather than lazily |
| `qualifyCodeBehindFields` | bool | `this.field` rather than `field` |
| `useSpacesForIndent` | bool | spaces rather than tabs |
| `indentSpaces` | int | how many |
| `swatchCollectionSeparator` | string | between colours in a swatch collection |

An unknown option is ignored rather than fatal, so a definition may name one a newer renderer
understands. That also means a **misspelled option is silent** — the schema check will not catch it.

---

## Coverage: when a platform should not see something

This is the part that goes wrong most often, so the rule is stated plainly.

A fence that excludes a platform **disappears there — the heading and the sentence introducing it do
not.** A reader on that platform meets "the following code shows" and then nothing. Every exclusion in
these topics was once doing exactly that.

> **An `exclude=` is sound only when the section still has a snippet for that platform.** Subtracting
> one fence from a group where another still serves that reader is fine. Subtracting the only fence is
> not.

When a whole section genuinely does not apply — module registration, which the XAML platforms have no
concept of — gate the **section**, prose and all, with `<PlatformBlock>`:

```mdx
<PlatformBlock for="Angular, React, WebComponents, Blazor">
## Dependencies

...prose and the fence...

</PlatformBlock>
```

Both checks read that gating, so a section a platform never sees is not that platform's to emit and
not a place it can be stranded.

**A missing library item is not a reason to hide anything.** If a section emits nothing on a platform
because the item behind it was only ever written for the others, the answer is to write the item — see
the library item guide in the examples repository. Hiding the section instead means that platform's
readers silently lose a feature they have.

Both language copies must be gated identically. `en` is the reference; a change to a topic and a
change to its `jp` counterpart belong in the same commit. Drift here is invisible until a check that
runs `--lang=jp` catches it, which is exactly how four broken fences reached CI.

---

## Standing policies

These decide what a collapsed section is allowed to say, and they are not matters of taste. The full
record, topic by topic, is in `notes/SNIPPET-COLLAPSE-DECISIONS.md` in the emitter spike.

**Never turn an imperative block into markup.** A section the platforms taught in code keeps teaching
it in code — that is what `channel="code"` is for. A value set imperatively may be a signal that the
imperative path is the only one that works, and on React and Blazor a declared value can be reapplied
on re-render, actively undoing what the reader is trying to do. The two forms are not
interchangeable. `collapse-tools/audit-imperative.py`, in the emitter spike, compares every collapsed
section against what it replaced and reports any where a web platform's block was code and the fence
now emits markup.

**XAML snippets are not evidence.** Nothing has ever compiled or run the XAML blocks in these topics,
so nothing has ever caught one being wrong. Where XAML disagrees with the web platforms about a value,
the web platforms win. One side has been checked; the other has not.

**Prose beats sample, sample beats a platform.** A number the topic states in its text is visible to
the reader and is what the snippet must show. Below that the running sample decides, because it is the
thing that executes. A value only one platform's block carried decides nothing.

**A sample is a source, not an authority.** Where the platforms agree with each other and disagree
with the peered sample, pin to the sample and overlay the snippet's values rather than restating
everything inline.

**Whitespace and colour spelling are the build's business, not the topic's.** That is what the style
defaults are for; a definition should only name what it genuinely wants differently.

---

## Library items

Handlers, data, templates and supporting types are not written in the topic. They live in the
**code generation library** in `igniteui-xplat-examples`, one folder per item, one file per platform,
and a topic refers to them by name (`dataSourceRef`, `cellUpdatingRef`, `onInit`, `item=`).

See `code-gen-library/README.md` in that repository for how to write one, what each platform variant
is called, how regions are declared, and what `requires` and `lifetime` do.

---

## Further reading

| document | covers |
|---|---|
| `SnippetEmitterSpike/SNIPPETS.md` (dev-tools) | the marker language in full, with the recorder API behind it |
| `SnippetEmitterSpike/notes/SNIPPET-COLLAPSE-DECISIONS.md` (dev-tools) | every decision made while collapsing these topics, and why |
| `SnippetEmitterSpike/collapse-tools/` (dev-tools) | the tools that do a collapse — planning it, mirroring it to `jp`, auditing it |
| `code-gen-library/README.md` (examples) | writing library items |
| `AI-AGENT-PLATFORM-BLOCK.md` | `PlatformBlock` itself |

---

## Validation and testing

Five things can be checked, and they prove different things. The first four are static; only the last
one runs the component.

| check | proves | runs in CI |
|---|---|---|
| `check-snippet-schema.mjs` | every property exists on the description it is stated on | yes |
| `check-snippet-emission.mjs` | every fence emits non-empty code on every platform | yes, `--lang=en` and `--lang=jp` |
| `check-snippet-exclusions.mjs` | no exclusion leaves a platform reading prose with no code | no — run it by hand |
| `check-snippet-casing.mjs` | a fence agrees with its sample about member casing | no |
| `snippet-runtime/run.mjs` | the component the definition describes actually loads and draws | yes |

```sh
cd docs/xplat

node scripts/check-snippet-schema.mjs
node scripts/check-snippet-emission.mjs --lang=en
node scripts/check-snippet-emission.mjs --lang=jp     # not optional — see below
node scripts/check-snippet-exclusions.mjs
node scripts/generate.mjs --platform=WinUI --lang=en   # the build itself
cd scripts/snippet-runtime && node run.mjs
```

### What each one cannot tell you

- **The schema** is emitted from the description metadata, so it is the same statement the emitter
  works from — but it says nothing about what comes out. A definition can be perfectly valid and emit
  a member path the platform spells differently.
- **Emission** proves a fence produces something on every platform, including platforms the topic is
  gated away from, which generation never exercises. It cannot tell you the code is *correct*.
- **The live harness** loads every fence into chromium against the published packages and reports what
  errored, what drew nothing, and what only fails after something else ran. It is the only check that
  can catch a property that emits perfectly and throws at run time.

### Two traps worth knowing

**Run both languages.** The checks take `--lang` and default to `en`. CI runs both. A topic whose
Japanese copy has drifted fails only under `--lang=jp`.

**Local and CI may not use the same emitter.** `resolveSnippetApiPaths` prefers, in order:
`IG_SNIPPET_API`, a built emitter in a peer `dev-tools` checkout, then this repository's own build from
the published packages. That order exists so someone with `dev-tools` open is testing their change
rather than the last release — but it means that with a built `dev-tools` beside this repo, a local
pass is not automatically a CI pass. CI has no `dev-tools`, and uses the published packages.

```sh
cd docs/xplat/scripts/snippet-emitter && npm install && npm run build   # what CI builds
```

### Generation fails the build

A fence that throws stops generation rather than publishing a page with a hole where a sample should
be. `generate.mjs` reports the platform, the fence's attributes and its body, which is usually enough
to see it. The emission check runs the same code — `scripts/lib/snippet-emit.mjs` — so the two cannot
disagree about what a fence produces.

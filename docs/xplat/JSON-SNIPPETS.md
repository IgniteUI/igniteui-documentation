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

## Which topics this is for

Three populations share `src/content/`, each topic says which it is in its frontmatter, and only one
of them is held to what follows.

| `platformType` | what it is | code in the topic | API terms |
|---|---|---|---|
| `xplat` | the DV set — charts, gauges, maps, dashboard tile, data grid, spreadsheet, toolbar, zoom slider | a `json-snippet` unless a platform-specific snippet is genuinely necessary | `full`, implied |
| `xplat-unmapped` | the same set, where the full treatment cannot be applied yet | the same, where a definition can express it | `passthrough`, implied |
| `web-only` | the web platforms and no further — inputs, layouts, notifications, scheduling, themes, the web grid families, grid lite | whatever suits them | `none`, implied |

**Required, no default**, and it decides `apiTerms`, which a page states only to differ. A topic
without it does not build. `check-doc-scope.mjs` enforces that and reports where a declaration and the
toc disagree; `API-TERMS.md` is normative for the field itself.

Two things follow for anyone working here.

**Read the frontmatter before applying anything below.** A per-platform block on a web-only topic is
not a defect, and rewriting one to use a fence is out of scope rather than an improvement. The
strictures in this guide are the DV set's.

For `platformType: xplat`, those strictures include canonical API names in backticks and no authored
raw `<ApiLink>` calls. Generation emits `ApiLink` after resolving the target platform. The explicit
`<ApiLink raw ... />` form exists only for a link that cannot be represented as a canonical term.

**Identity is not publication.** A topic can be `xplat` and reach no desktop platform — the whole of
Excel and spreadsheet do not, because no XAML package exists, and the data grid's accessibility topic
does not because its XAML shape is undecided. So where a page publishes never settles which population
it belongs to. If you are classifying one: a topic collapsed to fences with full backtick treatment is
certainly `xplat`; one that was not may be `web-only`, or may simply never have been processed.

---

## The fence

````
```json-snippet source="/maps/geo-map/binding-multiple-shapes" channel="handler" item="MapMultipleShapesLoad"
````

| attribute | what it does |
|---|---|
| `source="/path"` | **optional.** The sample this definition mirrors, for provenance. Validated when present — generation fails if the path names no sample, so a moved sample cannot leave a topic pointing at nothing — and nothing requires it. |
| `id="name"` | names this definition so later fences can re-emit it. |
| `ref="name"` | emits another channel of a definition stated once further up the page. The body is empty; the definition is not repeated. |
| `channel="..."` | which part of the sample to show. Default `markup`. See [Channels](#channels). |
| `item="Name"` | narrows the block to one library item — a handler the sample runs, or a supporting item whose region is being shown. A name that is neither is an error. |
| `exclude="Platform,…"` | drops the fence on those platforms. Takes the same spelling `PlatformBlock` takes, so `Xaml` covers all the XAML platforms. Read [Coverage](#coverage-when-a-platform-should-not-see-something) before reaching for it. |
| `code="auto\|allCode\|none"` | the companion code block beside markup. Default `auto`. |
| `include="channel,…"` | `channel="auto"` only: channels to ask for on top of what it asks for anyway. |
| `omit="channel,…"` | `channel="auto"` only: channels to drop from that list. |

`include=` and `omit=` take channel names, the same tokens the fence could have named outright, so
matching what a page used to teach is a matter of naming the difference from `auto`'s default rather
than restating the whole list. `auto` asks for `markup`, `code`, `bindingInit`, `bindingCode` and
`eventHandlers`, plus whatever the definition's own markers named.

**Nothing requires `source`.** It records which sample a definition was taken from, which is worth
having: it is what `check-snippet-casing.mjs` compares a fence against, and what tells a later reader
where the values came from. But a definition that mirrors no single sample is perfectly legitimate —
30 of the 158 fences in `en` name none — and neither the build nor any check asks for one. A fence
teaching one property, or composed from two samples, or stating something no sample runs, simply
leaves it off. Do not invent a `source` to satisfy a rule that does not exist, and do not remove one
that is already there.

### The companion code block

Some properties cannot be written as an attribute on some platforms — a data source or a template on
Web Components is assigned in script. The emitter knows which, because it is what decided, so a topic
does not declare that a code block is needed:

- `code="auto"` (default) — the assignments alone, and nothing at all if the markup said everything.
  Angular binds its data source in the template and gets no block; Web Components gets two lines.
- `code="allCode"` — the fuller form, including how the reference was obtained and the field
  declaration. What an introductory page wants.
- `code="none"` — off, for a topic that would rather write its own.

> **`code=` and `channel=` are not two spellings of one thing.** `code="allCode"` is markup *plus* the
> code beside it. `channel="allCode"` is the code *instead of* the markup — and on the XAML platforms,
> whose samples are markup throughout, there is no code, so the fence emits nothing and drops out. A
> "for your convenience, all of the above combined" section written that way published a heading and
> nothing under it on WinUI and Uno Platform. Such a section wants `channel="auto"`, which takes whatever the
> platform actually has.

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

## More than one component in a fence

A section teaching the same thing about two components states both in one fence, two ways.

**An array** emits each definition in turn, one block, separated by a blank line:

````mdx
```json-snippet source="/charts/data-chart/axis-intervals"
[
    { "type": "CategoryChart", "xAxisInterval": 5 },
    { "type": "FinancialChart", "yAxisInterval": 50 }
]
```
````

**Named holes** do the same through `descriptions`, and are what a fence peered to a sample uses,
because a sample states its components that way:

````mdx
```json-snippet
{
    "descriptions": {
        "financialChart": { "type": "FinancialChart", "xAxisMode": "Ordinal" },
        "dataChart": { "type": "DataChart", "axes": [ { "type": "CategoryXAxis" } ] }
    }
}
```
````

A hole's name is a label, not a layout: `content` is the one the host page lays out, and any other
name is simply how this definition tells its components apart. `descriptions.content` is also where a
marker check looks for the root, so a definition that marks part of itself and wants the whole
treated as one thing puts it under `content`.

One caveat worth knowing, because it bites in the live harness rather than in generation: the harness
makes a container for whatever hole a definition names, and infers that a chart animates and must be
waited for. A definition naming its holes after its components used to time out as "animations never
settled" whatever it contained — fixed, but if you see that message, check the hole names first.

---

## Data casing

`"skipAlterDataCasing": true` on a definition says the sample's data was emitted as written, so member
paths are left alone. Without it the web emitters camelise a member of the data — `Year` becomes
`year` — which is right when the data was generated and wrong when it was not.

It belongs beside the fence's own definition, not in a sidecar, and it has to agree with the sample it
mirrors: `check-snippet-casing.mjs` compares the two and reports a fence that disagrees. No XAML run
can catch this, because the XAML emitters do not alter casing at all.

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

Either sidecar composes with `channel="auto"`, which is how a topic keeps one property imperative
while the element around it stays declarative — markup for the structure, code for the property whose
teaching depends on being assigned. The named property is dropped from the markup and assigned
beside it:

```json-snippet channel="auto" source="..."
{
    "type": "GeographicContourLineSeries",
    "name": "contourSeries",
    "$setInCode": { "thickness": ["angular", "react", "webComponents"] },
    "thickness": 4
}
```

emits the series as markup without a `thickness` attribute, and `contourSeries.thickness = 4;` in the
code beside it. A property holding an element or a collection is assigned through the field the
emitter declares for it; a string, a number or a boolean carries its own literal, quoted where the
language needs it.

A handler fence usually wants its imports above it, which is what the hand written block it replaced
had: `channel="handlersImports...handler"` emits the imports, an elision, then the handler. The `...`
is what writes the elision, and a platform whose handler needs no imports drops the region and its
delimiter both. Between a class field and the statements beneath it the emitter writes one itself,
since those are two parts of a file arriving inside one region.

A region of a **supporting item** wants `supportingImports`, not `handlersImports`. The two are
separate because a supporting item is a type rather than a method and a template is free to put it in
a file of its own — the web templates do — so its imports belong to that file and not to the
component's. Asking for `handlersImports` beside a supporting item's region gives the requiring
handler's imports, which is a list for code the block does not show.

`supportingImports` needs a product build newer than 26.1 beta; until one is vendored those fences
name the region alone, and the imports are on the page in whatever fence asks for them nearer the top.

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
| `indentXamlAttributes` | bool | the same, for XAML — but see the note below |
| `attributeLayout` | `"singleLine"` | everything on one line instead |
| `selfCloseEmptyElements` | bool | `<X />` rather than `<X></X>` |
| `numericAttributeStyle` | `"bare"`, `"quoted"`, `"braced"` | how a number is written. Angular bare, React braced, the rest quoted |
| `booleanAttributeStyle` | `"bare"`, `"quoted"`, `"braced"` | the same for booleans |
| `colorNotation` | `"hex"`, `"rgba"` | how a colour is written |
| `uppercaseHexColors` | bool | `#FFAA00` rather than `#ffaa00` |
| `pascalCaseColorNames` | bool | `Red` rather than `red` |
| `suppressAutoElementNames` | bool | leave off names the emitter would invent |
| `suppressNameAttribute` | bool | leave off the name attribute entirely |
| `preferNameBindings` | bool | write a reference through its companion `…Name` attribute where the component has one, rather than assigning the element in code. Web Components only, and off by default: it is the declarative form the older hand written blocks used |
| `omitHandlerSignature` | bool | show a handler's statements, not the method wrapping them |
| `omitDimensions` | bool | no height and width — the XAML platforms let the panel decide |
| `directAssignment` | bool | build a property where it is assigned rather than lazily |
| `qualifyCodeBehindFields` | bool | `this.field` rather than `field` |
| `useSpacesForIndent` | bool | spaces rather than tabs |
| `indentSpaces` | int | how many |
| `swatchCollectionSeparator` | string | between colours in a swatch collection |

An unknown option is ignored rather than fatal, so a definition may name one a newer renderer
understands. That also means a **misspelled option is silent** — the schema check will not catch it.
The schema does list the options it knows, so `$styleOptions` itself is checked; an option the
installed product has never heard of is what passes silently, and a product newer than the published
package is how that happens.

> **`indentXamlAttributes` only indents an element that has children.** A self-closing root's
> attributes come out at column zero whatever the option says, which is why 234 of the 408 XAML blocks
> in the published output are flat and 174 are indented. It is the renderer's inconsistency, not the
> topic's, and no definition can work around it.

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

> **Gating is also a blind spot.** The emission check asks `platformsAllowedAt` before it emits, so a
> fence inside a `PlatformBlock` is never run for the platforms that block excludes — not by the
> build, and not by the check written to catch what the build cannot say. Nothing measures those
> fences at all.
>
> So a `PlatformBlock` around a fence is worth auditing every time, and is sound only where the
> section is genuinely one platform family's: module registration, a package install, a namespace
> declaration. Two that were not turned up on an audit of all 55 collapsed topics — one hiding the
> `using` directives the XAML platforms need, one hiding a whole summary section from Blazor as well
> as the XAML platforms — and ungating them immediately surfaced three emission failures that had sat
> behind the gate. If a gated fence emits for the excluded platform, the gate was wrong.

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

Seven things can be checked, and they prove different things. The first five are static; only the last
one runs the component.

| check | proves | runs in CI |
|---|---|---|
| `check-doc-scope.mjs` | every topic declares its population, and the declaration holds up | yes |
| `check-snippet-schema.mjs` | every property exists on the description it is stated on | yes |
| `check-snippet-emission.mjs` | every fence emits non-empty code on every platform | yes, `--lang=en` and `--lang=jp` |
| `check-snippet-exclusions.mjs` | no exclusion leaves a platform reading prose with no code | no — run it by hand |
| `check-snippet-casing.mjs` | a fence agrees with its sample about member casing | no |
| `check-snippet-code-channels.mjs` | which fences are incomplete as markup alone, and whether each still has its companion block | no |
| `snippet-runtime/run.mjs` | the component the definition describes actually loads and draws | yes |

```sh
cd docs/xplat

node scripts/check-snippet-schema.mjs
node scripts/check-snippet-emission.mjs --lang=en
node scripts/check-snippet-emission.mjs --lang=jp     # not optional — see below
node scripts/check-snippet-exclusions.mjs
node scripts/check-snippet-casing.mjs
node scripts/check-snippet-code-channels.mjs
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
  can catch a property that emits perfectly and throws at run time. Three flags matter when one
  fails: `--filter=<path fragment>` narrows it to a page, `--sample=<file.json>` runs one definition
  from a file, which is how a failure gets cut down to the property that causes it, and
  `--packages=<dir>` swaps the published packages for a local build.

  It also decides for itself which definitions animate — the chart families that animate on their own,
  plus anything asking for a transition — and waits for those to settle. `"hasAnimations": true` or
  `false` on the definition overrides that inference.

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

Three environment variables decide what a run is actually testing, and CI sets the last of them:

| variable | names |
|---|---|
| `IG_SNIPPET_API` | a built `snippet-api.cjs` to emit with, ahead of a peer `dev-tools` or this repository's own build |
| `IG_ITEM_TEMPLATES` | the library item templates, ahead of a peer `dev-tools` copy and then the vendored one in `scripts/snippet-emitter/templates` |
| `XPLAT_EXAMPLES` | the examples checkout, ahead of a peer clone and then a clone of the branch matching this one |

Pointing the first two at this repository's own copies is how a local run reproduces CI exactly:

```sh
export IG_SNIPPET_API=$PWD/docs/xplat/scripts/snippet-emitter/dist/snippet-api.cjs
export IG_ITEM_TEMPLATES=$PWD/docs/xplat/scripts/snippet-emitter/templates
```

**The vendored templates drift.** `resolveItemTemplates` prefers dev-tools' copy and says out loud
which files differ from the one in this repository — and that message is the only warning you get.
Twelve fences once failed in CI and nowhere else because the vendored `handler.ts` had not gained the
`supportingImports` region dev-tools had added, so a supporting item's import had nowhere to go and
the emitted file referenced a name it never imported. When that message appears, copy them over.

### Generation fails the build

A fence that throws stops generation rather than publishing a page with a hole where a sample should
be. `generate.mjs` reports the platform, the fence's attributes and its body, which is usually enough
to see it. The emission check runs the same code — `scripts/lib/snippet-emit.mjs` — so the two cannot
disagree about what a fence produces.

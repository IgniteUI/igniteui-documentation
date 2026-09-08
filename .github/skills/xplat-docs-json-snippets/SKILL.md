---
name: xplat-docs-json-snippets
description: "Guide for authoring and validating json-snippet blocks in xplat MDX: stating a component once as JSON so generation emits each platform's own code, choosing channels, keeping a platform from being stranded, and running the schema, emission, casing and live-load checks."
user-invocable: true
---

# Xplat json-snippet Guide

## Which documents this applies to

Every topic declares its population in the frontmatter, and the populations are held to different
standards. **`platformType` is required and has no default** — a page without it does not build.

| | **`xplat`** | **`xplat-unmapped`** | **`web-only`** |
|---|---|---|---|
| what it is | the DV set — charts, gauges, maps, dashboard tile, data grid, spreadsheet, toolbar, zoom slider | the DV set, where the full treatment cannot be applied yet | web components — inputs, layouts, notifications, scheduling, themes, the web grid families, grid lite |
| code in the topic | **a `json-snippet` unless a platform-specific snippet is genuinely necessary** | same, where a definition can express it at all | whatever suits them |
| API terms | `apiTerms: full`, implied — canonical names in backticks | `passthrough`, implied | `none`, implied |

**Read the frontmatter first.** It is stated per page, so nothing has to be inferred. `apiTerms`
appears only when a page differs from what its population implies, which is rare.

**Classifying a new page:** identity is what the topic *is*, not where it publishes today — a topic
can be xplat and not reach desktop yet, which is true of the data grid's accessibility topic and of
everything Excel. The strongest evidence is the page's own history: if it was collapsed to
`json-snippet` fences and full backtick treatment, it is definitely xplat. If it was not, it may be
web-only, or it may simply never have been processed — `check-doc-scope.mjs` reports the DV-shaped
pages sitting in `web-only` for exactly that reason.

`xplat-unmapped` is not a soft xplat. It is for a topic whose names genuinely cannot resolve: the
Excel library, whose API no generator describes, and the accessibility topic, whose XAML shape is
undecided. An xplat page may **not** declare `apiTerms: none` — that is opting out of what makes it
xplat, and the check fails on it.

These strictures are **not** a house style to spread. Applying them to a web-only topic is a mistake
in the other direction: those pages are free to hand write a block per platform and to declare any
`apiTerms` mode, and rewriting them to match the DV set is out of scope.

The two rules are not equally hard.

**`apiTerms: full` on an xplat doc is absolute.** A bare name in prose that no map resolves is an API
claim nobody checked, and there is no case where a DV topic wants that.

Strict-xplat source also may not hand-author raw `<ApiLink>` calls. Canonical backticked terms are
required; generation emits the platform-specific component. `<ApiLink raw ... />` is the narrow,
explicitly reviewed exception for a link that truly cannot be represented as a term.

**A `json-snippet` is the strong default, not a ban.** The reason to prefer it is that a hand written
block per platform is four to six copies of one lesson that drift apart an edit at a time — so reach
for a definition first, and expect to justify not doing so. But a platform-specific snippet is a
legitimate tool when it is genuinely necessary, and some lessons are: a data shape with no component
in it, a namespace declaration, a package install, a step that only one platform family has. Write
the block, and say why the definition could not carry it where the change is recorded. What is not
legitimate is reaching for one because writing the definition looked like more work.

If you find an xplat page on `apiTerms: none`, suspect one of two things before copying it: a page
that landed in the set by accident (an untoc'd page publishes everywhere), or a page whose gating
changed without its frontmatter following.

---

`docs/xplat/JSON-SNIPPETS.md` is the normative guide — the marker grammar, every sidecar, the
standing policies. This skill is the working subset: what to write, what breaks, what to run.

## What a fence is

A topic states a component once, as JSON, and generation turns it into each platform's own code.
The alternative is one hand written block per platform, which is four to six copies of one lesson
drifting apart an edit at a time.

````mdx
```json-snippet source="/inputs/color-editor/overview"
{
    "type": "ColorEditor",
    "name": "colorEditor"
}
```
````

That emits `<igx-color-editor>`, `<IgrColorEditor>`, `<IgbColorEditor>` and
`<igInputs:XamColorEditor>` — element name, reference idiom, self-closing, number style and all —
from the component's own description metadata. **A property the description does not have cannot be
emitted, which is what makes the schema check possible.**

**The default is every platform.** Hiding a definition from one needs a reason, and "the library
item only exists for the others" is not one — write the item.

## Attributes

| attribute | what it does |
|---|---|
| `source="/path"` | **optional** — the sample this mirrors, for provenance. Checked when present, never required |
| `channel="…"` | which part to show. Default `markup`; `auto` takes whatever the platform has |
| `code="auto\|allCode\|none"` | the companion code block beside markup. Default `auto` |
| `item="Name"` | narrow to one library item — a handler or a supporting type |
| `id=` / `ref=` | state a definition once, emit another channel of it further down the page |
| `exclude="Platform,…"` | drop the fence there. `Xaml` covers all the XAML platforms |
| `include=` / `omit=` | `channel="auto"` only: add or drop channels |

## The six traps

**1. `code=` and `channel=` are not two spellings of one thing.** `code="allCode"` is markup *plus*
its code; `channel="allCode"` is code *instead of* markup — and the XAML platforms, whose samples
are markup throughout, have none, so the fence emits nothing and vanishes. A "everything above,
combined" section wants `channel="auto"`.

**2. A `PlatformBlock` around a fence is a blind spot, not just a gate.** The emission check asks
`platformsAllowedAt` before it emits, so a gated fence is measured by *nothing* — not the build, not
the check. Gate a section only where it is genuinely one platform family's: module registration, a
package install, a namespace declaration. If a gated fence emits for an excluded platform, the gate
is wrong.

**3. An `exclude=` that strands a reader.** The fence disappears; the heading and "the following
code shows" do not. Sound only when the section still has a snippet for that platform.
`check-snippet-exclusions.mjs` is the check.

**4. Both languages, one commit.** `en` is the reference and `jp` mirrors it. The checks take
`--lang`; CI runs both, and a drifted `jp` copy fails only under `--lang=jp`.

**5. `source=` is not required, and inventing one is worse than omitting it.** It records which
sample a definition came from, and `check-snippet-casing.mjs` uses it to compare the two — so name it
when there is one. But 30 of the 158 fences in `en` name none, because a definition can teach one
property, compose two samples, or state something no sample runs. Nothing enforces it. Leave the ones
already there alone.

**6. `platformType` is required frontmatter, and it decides `apiTerms`.** A page without it does not
build at all. A page that states `apiTerms` usually does not need to — say it only to differ from what
the population implies. See `xplat-docs-api-links`.

## Validating

```sh
cd docs/xplat
node scripts/check-doc-scope.mjs --lang=en            # every topic declares its population
node scripts/check-snippet-schema.mjs                 # every property exists on its description
node scripts/check-snippet-emission.mjs --lang=en     # every fence emits, on every platform
node scripts/check-snippet-emission.mjs --lang=jp
node scripts/check-snippet-exclusions.mjs             # no platform left with prose and no code
node scripts/check-snippet-casing.mjs                 # fence agrees with its sample on casing
node scripts/generate.mjs --platform=WinUI --lang=en  # the build itself
cd scripts/snippet-runtime && node run.mjs            # loads every fence in chromium
```

The first three run in CI, and the live harness runs on every pull request. What each cannot tell you,
and how to cut a runtime failure down with `--sample=`, is in JSON-SNIPPETS.md.

**A local pass is not automatically a CI pass.** The emitter resolves from `IG_SNIPPET_API`, then a
built peer `dev-tools`, then this repository's own build from the published packages — and CI has no
`dev-tools`. Reproduce CI exactly with:

```sh
export IG_SNIPPET_API=$PWD/docs/xplat/scripts/snippet-emitter/dist/snippet-api.cjs
export IG_ITEM_TEMPLATES=$PWD/docs/xplat/scripts/snippet-emitter/templates
```

## Related

| document | covers |
|---|---|
| `docs/xplat/JSON-SNIPPETS.md` | the full contract: markers, sidecars, style options, policies |
| `xplat-docs-api-links` skill | `apiTerms`, `ApiLink`, and the api maps |
| `xplat-docs-platform-block` skill | `PlatformBlock` itself |
| `code-gen-library/README.md` (examples repo) | writing the handlers, data and templates a fence names |

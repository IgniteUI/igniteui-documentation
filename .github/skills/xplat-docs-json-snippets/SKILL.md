---
name: xplat-docs-json-snippets
description: "Guide for authoring and validating json-snippet blocks in xplat MDX: stating a component once as JSON so generation emits each platform's own code, choosing channels, keeping a platform from being stranded, and running the schema, emission, casing and live-load checks."
user-invocable: true
---

# Xplat json-snippet Guide

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
| `source="/path"` | the sample this mirrors. Generation fails if the sample does not exist |
| `channel="…"` | which part to show. Default `markup`; `auto` takes whatever the platform has |
| `code="auto\|allCode\|none"` | the companion code block beside markup. Default `auto` |
| `item="Name"` | narrow to one library item — a handler or a supporting type |
| `id=` / `ref=` | state a definition once, emit another channel of it further down the page |
| `exclude="Platform,…"` | drop the fence there. `Xaml` covers all the XAML platforms |
| `include=` / `omit=` | `channel="auto"` only: add or drop channels |

## The five traps

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

**5. `apiTerms` is required frontmatter.** A page without it does not build. See
`xplat-docs-api-links`.

## Validating

```sh
cd docs/xplat
node scripts/check-snippet-schema.mjs                 # every property exists on its description
node scripts/check-snippet-emission.mjs --lang=en     # every fence emits, on every platform
node scripts/check-snippet-emission.mjs --lang=jp
node scripts/check-snippet-exclusions.mjs             # no platform left with prose and no code
node scripts/check-snippet-casing.mjs                 # fence agrees with its sample on casing
node scripts/generate.mjs --platform=WinUI --lang=en  # the build itself
cd scripts/snippet-runtime && node run.mjs            # loads every fence in chromium
```

The first two run in CI, and the live harness runs on every pull request. What each cannot tell you,
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

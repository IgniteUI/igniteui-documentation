---
license: MIT
name: xplat-docs-api-links
description: "Reference guide for authoring and auditing API terms in the multi-platform docs tree. Strict-xplat topics require canonical backticked terms; other populations may use raw ApiLink components. Covers the platformType populations, the apiTerms modes, raw ApiLink props, and pkg/kind disambiguation. WHEN TO USE: adding, fixing or auditing an ApiLink or a backticked API term in xplat MDX, deciding how a page's platformType or apiTerms affects its names, or resolving a check-mdx-links ambiguity report. WHEN NOT TO USE: PlatformBlock on its own (use xplat-docs-platform-block), json-snippet blocks (use xplat-docs-json-snippets), whole-topic structure (use igniteui-doc-topics), or MDX topic frontmatter (use igniteui-topic-frontmatter)."
user-invocable: true
---

# Xplat ApiLink Guide

Here, **strict xplat** means a topic whose frontmatter explicitly says `platformType: xplat`. The
`docs/xplat` directory is broader: it also contains `xplat-unmapped` and `web-only` topics, so its
folder name alone does not select the strict-xplat rules.

## The page declares its population, and the mode follows

`platformType` is **required frontmatter with no default** — a missing or unknown value stops the
build, naming the file. It decides how names in backticks are treated:

| population | implies | what happens to a name in backticks |
|---|---|---|
| `xplat` | `apiTerms: full` | resolved through the product's description metadata and the api-docs index, linked; the build fails if it does not resolve |
| `xplat-unmapped` | `apiTerms: passthrough` | linked by rule instead of by lookup — no generator describes this API |
| `web-only` | `apiTerms: none` | left exactly as written; no `ApiLink` is emitted |

**`apiTerms` is now an override, not a per-page decision.** State it only where a page differs from
what its population implies; 578 pages that restated the implied value no longer do. An xplat page may
**not** state `none` — that is opting out of the treatment that makes it xplat, and
`check-doc-scope.mjs` fails on it. A topic whose names genuinely cannot resolve is `xplat-unmapped`:
its own population rather than an exception inside another.

`full` and `passthrough` both emit an `ApiLink`. `none` does not: a page that opted out is saying
these are not API names, so linking them would be wrong rather than merely unchecked.

Canonical means the description name, not the platform's spelling: write `` `DataChart` ``, not
`` `XamDataChart` ``. The canonical one reads the same on every platform — which is the point of a
shared topic — and renders as each platform's class name. `xplat-docs-json-snippets` states the same
boundary for code blocks.

Under `full`, `description-terms.mjs` resolves a term from the product's description metadata
(TypeDescriptionContext) and confirms it in the platform's api-docs index; a term neither can answer
fails the build. A member resolves against the nearest type named before it, then `mentionedTypes`;
`Type.Member` states the owner, and `m:Name` marks a method.

`docs/xplat/API-TERMS.md` is normative for all of this — the term forms, how the owning type is
chosen, when a term should *not* resolve, and the report.

For strict-xplat source, canonical API names in backticks are required. Do not hand-author
`<ApiLink>`: generation emits it after choosing the target platform's spelling and URL. Use the
leading-backslash escape inside backticks for a name that must remain code but cannot be resolved,
for example `` `\defineComponents` ``. If a link genuinely cannot be represented as a term, the
narrow exception is `<ApiLink raw ... />`; the `raw` attribute records the deliberate exception and
is required by `check-doc-scope.mjs`.

### Authoring and auditing tools

```sh
npm run check-mdx-links                        # resolution, ambiguities, broken links; --platform= narrows
npm run check-api-links                        # the generated registry's own report
node docs/xplat/scripts/check-doc-scope.mjs --lang=en   # platformType, apiTerms, the raw exception
```

**No tool rewrites prose into `<ApiLink>`.** The two that did, `resolve-api-links.mjs` and
`fix-api-link-attrs.mjs`, have been removed: they froze one platform's spelling into a source file
that serves six, which is the problem canonical backticked terms exist to solve. Author the term and
let generation resolve it.


## Strict-Xplat Markup

Use canonical backticked names and let generation resolve package, kind, prefix, suffix, URL, and
member anchors:

```mdx
`Grid`
`Grid.RowSelection`
`CategoryChart`
```

Qualified `Type.Member` is for a member whose owner cannot be settled safely from prose context.
Prefer the unqualified canonical member where the context already names its type.

## Raw ApiLink Props Outside Strict Xplat

- `type`: required unprefixed symbol name.
- `member`: optional member/property/method/enum value.
- `label`: optional display text.
- `pkg`: disambiguation only. Add it when `check-mdx-links` reports that the same symbol exists in multiple packages.
- `kind`: use for Sass (`kind="sass"`) or when the registry report proves a TypeDoc symbol needs narrowing.
- `raw`: strict-xplat-only exception marker for a link that cannot be represented by a canonical term.

Do not add `exclude`, `excludePrefixFor`, or `excludeSuffixFor`.

Avoid adding `prefixed={false}` or `suffix={false}` in new MDX. Those are legacy
fallback overrides, not the normal registry-based workflow.

## PlatformBlock

Use `PlatformBlock` only when the visible content or actual API symbol differs by
platform:

```mdx
<PlatformBlock for="Angular">
  `IGridState`
</PlatformBlock>

<PlatformBlock for="React,WebComponents,Blazor">
  `GridState`
</PlatformBlock>
```

Do not use PlatformBlock just to work around prefix/suffix/package URL rules.
Those should be handled by the registry or by `pkg` disambiguation.

## Validation

Run registry checks before making manual API-link assumptions:

```bash
npm run check-mdx-links:broken:angular
npm run check-mdx-links:broken:react
npm run check-mdx-links:broken:wc
npm run check-mdx-links:broken:blazor
npm run check-mdx-links:broken:winui
npm run check-mdx-links:broken:uno
```

Every `check-mdx-links` and `check-api-links` family has all six platform variants — plain, `:report`
and `:broken` — so there is no platform you have to drop to the raw script for. `--platform=` takes
`angular`, `react`, `wc`, `blazor`, `winui` or `uno`; omitting it covers all six.

`check-api-links` reads built output under `dist/<platform>`, so build the platform first or it has
nothing to read.

A platform whose API documentation is not published yet fails these checks on **HTTP 404**, not on
anything wrong in the MDX — the term resolved, the page it points at does not exist on the host. That
is the current state for WinUI and Uno. The `:broken` variants are `--resolve-only` and make no HTTP
requests, so use those to check the source itself while a platform's API docs are still coming.

Interpret common statuses:

- `missing`: the symbol was not found in the latest platform registry.
- `member-missing`: the symbol exists, but the requested member was not found.
- `ambiguous`: the symbol exists in multiple packages; add `pkg`.
- `dynamic`: the link uses a template value such as `{ComponentName}` and cannot be resolved statically.
- `sass`: Sass links are intentionally outside the TypeDoc registry.

For `member-missing`, inspect the registry before editing. Some APIs expose
platform-specific member names, for example React `dataSource` versus older
source prose that says `itemsSource`.

### Ambiguity appears when the packages move, and only the build catches it

`check-mdx-links` reads the registry; the *build* resolves every link while rendering. A symbol that
was unambiguous can stop being so when a new product package adds a platform-prefixed twin, and then
the astro build fails at render time with the page it died on:

```
[ApiLink] Ambiguous API symbol "DateRangeDescriptor.rangeType" matched registry candidate
"IgbDateRangeDescriptor". Add pkg= or kind= to disambiguate.
```

For a raw link outside strict xplat, the fix is `pkg=`. For a strict-xplat term, use an exact
canonical spelling, a qualified `Type.Member`, `global::Type`, or correct the API map. Two habits
follow from that:

- When resolving one ambiguity, check the page's other references to that symbol too.
- After a package or beta bump, build every platform rather than trusting the link report —
  `npm run xplat:build:{angular,react,webcomponents,blazor,winui,uno}`. All six exist; each stops at
  the *first* ambiguity, so a clean report is not a clean build.

CI surfaces these in the **CI** and **Check Relative Links** jobs rather than a link-named one, since
both generate the content before doing their own work.

## Related

| document | covers |
|---|---|
| `docs/xplat/API-TERMS.md` | normative: modes, term forms, the report |
| `xplat-docs-json-snippets` skill | stating a component as JSON so every platform's code is generated |
| `xplat-docs-platform-block` skill | `PlatformBlock` itself |

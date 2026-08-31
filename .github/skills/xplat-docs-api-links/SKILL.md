---
name: xplat-docs-api-links
description: "Reference guide for adding, fixing, and auditing ApiLink components in xplat MDX using the generated api-docs registry. Covers clean ApiLink props, pkg/kind disambiguation, member checks, PlatformBlock use, and registry reports."
user-invocable: true
---

# Xplat ApiLink Guide

## The page declares its processing mode first

`apiTerms` is **required frontmatter with no default** — a missing or unknown value stops the build,
so the decision is made per page rather than inherited by a page nobody thought about.

| mode | what happens to a name in backticks | for |
|---|---|---|
| `full` | looked up in the api maps, linked, and reported if it does not resolve | **every xplat doc, always** |
| `passthrough` | linked by rule instead of by map | a component no generator describes |
| `none` | left exactly as written; no `ApiLink` is emitted | a page that is not about a mapped API |

`full` and `passthrough` both emit an `ApiLink`. `none` does not: a page that opted out is saying
these are not API names, so linking them would be wrong rather than merely unchecked.

**On an xplat doc there is no choice to make.** The DV set — anything that publishes to WinUI and Uno
as well as the web platforms — is always `apiTerms: full`, with canonical names written in backticks
and left to resolve. The three-way choice above is a **web-only** latitude: inputs, layouts,
notifications, scheduling, themes, the web grid families and grid lite may declare whatever mode suits
them, and rewriting them to match the DV set is not an improvement. `xplat-docs-json-snippets` states
the same boundary for code blocks and gives the test for which population a page is in.

Canonical means the name the maps know, not the platform's spelling: write `` `DataChart` ``, not
`` `XamDataChart` ``. Both resolve, and the canonical one reads the same on every platform — which is
the point of a shared topic.

Under `full`, a term resolves by canonical name first, then in reverse through the platform affixes
(`Xam`, `Igc`, `Igr`, `Igb`, `Igx`) and the `Component` / `Description` suffixes, then scoped to a
type the page named walking up the base chain, then unscoped. So a topic may write `DataChart` rather
than `XamDataChart` and still resolve, and writing the canonical name always settles a question.

`docs/xplat/API-TERMS.md` is normative for all of this — the resolution order, how the page's subject
type is chosen, when a term should *not* resolve, and the override files for API the maps cannot
describe.

### Authoring and auditing tools

```sh
cd docs/xplat
node scripts/resolve-api-links.mjs --dry-run     # names in backticks -> <ApiLink>; --file for one page
node scripts/fix-api-link-attrs.mjs             # normalize attributes on existing links
node scripts/check-api-map-accuracy.mjs         # the api maps against the generated registry
```


## Preferred Markup

Use unprefixed TypeDoc names and let the registry resolve package, kind, prefix,
suffix, URL, and member anchors:

```mdx
<ApiLink type="Grid" />
<ApiLink type="Grid" member="rowSelection" />
<ApiLink type="CategoryChart" />
```

## Props

- `type`: required unprefixed symbol name.
- `member`: optional member/property/method/enum value.
- `label`: optional display text.
- `pkg`: disambiguation only. Add it when `check-mdx-links` reports that the same symbol exists in multiple packages.
- `kind`: use for Sass (`kind="sass"`) or when the registry report proves a TypeDoc symbol needs narrowing.

Do not add `exclude`, `excludePrefixFor`, or `excludeSuffixFor`.

Avoid adding `prefixed={false}` or `suffix={false}` in new MDX. Those are legacy
fallback overrides, not the normal registry-based workflow.

## PlatformBlock

Use `PlatformBlock` only when the visible content or actual API symbol differs by
platform:

```mdx
<PlatformBlock for="Angular">
  <ApiLink type="IGridState" />
</PlatformBlock>

<PlatformBlock for="React,WebComponents,Blazor">
  <ApiLink type="GridState" />
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
```

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

The fix is `pkg=`, and the first place to look is the same page: `scheduling/calendar` had already
answered it three times with `pkg="core"` and left seven links bare. Two habits follow from that:

- When adding `pkg=` to one link, check whether the page's other links to that symbol need it too.
- After a package or beta bump, build every platform rather than trusting the link report —
  `npm run xplat:build:{angular,react,webcomponents,blazor}`. Each stops at the *first* ambiguity, so
  a clean report is not a clean build.

CI surfaces these in the **CI** and **Check Relative Links** jobs rather than a link-named one, since
both generate the content before doing their own work.

## Related

| document | covers |
|---|---|
| `docs/xplat/API-TERMS.md` | normative: modes, resolution order, overrides, the report |
| `xplat-docs-json-snippets` skill | stating a component as JSON so every platform's code is generated |
| `xplat-docs-api-map-sync` skill | keeping the api maps in step with a release |
| `xplat-docs-platform-block` skill | `PlatformBlock` itself |

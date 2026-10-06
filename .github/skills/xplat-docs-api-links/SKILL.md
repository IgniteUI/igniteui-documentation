---
name: xplat-docs-api-links
description: "Reference guide for adding, fixing, and auditing ApiLink components in xplat MDX using the generated api-docs registry. Covers clean ApiLink props, pkg/kind disambiguation, member checks, PlatformBlock use, and registry reports."
user-invocable: true
---

# Xplat ApiLink Guide

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
fallback overrides, not the normal registry-based workflow. No file under
`docs/xplat/src/content/en/` uses either prop; the registry resolves prefix and
suffix from the symbol. `check-mdx-links` still honours `prefixed` so old markup
keeps resolving, but new markup must not reintroduce it.

This skill is the single authority on ApiLink markup.
`docs/xplat/API-LINKS-README.md` and `docs/xplat/API-REFERENCES.md` are human
background on how the component and registry work. Where they describe
hand-setting `prefixed`, `suffix`, or a routine `pkg`, they predate the registry
and this skill wins.

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

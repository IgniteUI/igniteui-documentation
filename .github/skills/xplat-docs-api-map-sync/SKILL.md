---
name: xplat-docs-api-map-sync
description: "Reference guide for syncing xplat ApiLink coverage from the legacy igniteui-xplat-docs apiMap data while keeping ApiLink markup registry-first. Use when importing missing links from igniteui-xplat-docs or auditing ApiLink coverage after API registry updates."
user-invocable: true
---

# Syncing Xplat ApiLink Coverage

## Current Direction

The docs now resolve ApiLinks through the generated api-docs registry stored in
`src/data/api-link-index/{platform}/{staging-latest|prod-latest}.json`.

The legacy `igniteui-xplat-docs/apiMap` files are useful for discovering missed
references in old markdown, but they are not the final URL source of truth.

## Rules

- Prefer clean links: `<ApiLink type="Grid" />` and `<ApiLink type="Grid" member="rowSelection" />`.
- Use `pkg` only when the registry reports an ambiguous symbol name.
- Use `kind` only when it is needed for Sass links or to disambiguate a real TypeDoc symbol.
- Do not add `exclude`, `excludePrefixFor`, or `excludeSuffixFor`; those props are obsolete.
- Avoid `prefixed={false}` and `suffix={false}` in new MDX. The registry should resolve the real symbol name.
- Use `PlatformBlock` only when the prose or the actual symbol/member name differs by platform.
- Never replace an existing ApiLink with backtick text only because one platform is missing it; report the miss and let the registry/API data decide.

## Workflow

1. Use the local sibling repo `../igniteui-xplat-docs` to inspect old apiMap or markdown references.
2. Add missing xplat ApiLinks to `docs/xplat/src/content`.
3. Run the registry checker:

```bash
npm run check-mdx-links:broken:angular
npm run check-mdx-links:broken:react
npm run check-mdx-links:broken:wc
npm run check-mdx-links:broken:blazor
```

4. For ambiguous results, add `pkg` or `kind` only where the report proves it is needed.
5. For member-missing results, first verify whether the member exists under a different name in the generated registry before changing MDX.
6. Keep generated reports under `reports/` when they are useful for review.

## Migration Helpers

`docs/xplat/scripts/resolve-api-links.mjs` can still be used to convert legacy
backtick references into ApiLinks, but it must not emit prefix/suffix/exclude
override props. Registry validation is the follow-up authority.

`docs/xplat/scripts/fix-api-link-attrs.mjs` may strip CLR generic arity and add
`kind="interface"` for known apiMap/TypeDoc mismatches. It must not add
`prefixed={false}` or `suffix={false}`.

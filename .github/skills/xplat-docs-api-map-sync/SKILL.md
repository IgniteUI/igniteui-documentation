---
name: xplat-docs-api-map-sync
description: "Reference guide for syncing API-map coverage from legacy xplat docs. Strict-xplat source stays canonical-backtick-first; raw ApiLink guidance applies only to other topic populations or explicit exceptions."
user-invocable: true
---

# Syncing Xplat ApiLink Coverage

## Current Direction

The multi-platform content folder is not the same thing as strict xplat. Read `platformType` first.
When it is `xplat`, canonical API terms in backticks are required and generation emits `ApiLink`.

The docs now resolve ApiLinks through the generated api-docs registry stored in
`src/data/api-link-index/{platform}/{staging-latest|prod-latest}.json`.

The legacy `igniteui-xplat-docs/apiMap` files are useful for discovering missed
references in old markdown, but they are not the final URL source of truth.

## Rules

- In strict-xplat source, write canonical terms such as `` `Grid` `` and `` `Grid.RowSelection` ``.
- Use `<ApiLink raw ... />` only when a link genuinely cannot be represented as a term; `raw` is the explicit checker exception.
- Use `pkg` only when the registry reports an ambiguous symbol name.
- Use `kind` only when it is needed for Sass links or to disambiguate a real TypeDoc symbol.
- Do not add `exclude`, `excludePrefixFor`, or `excludeSuffixFor`; those props are obsolete.
- Avoid `prefixed={false}` and `suffix={false}` in new MDX. The registry should resolve the real symbol name.
- Use `PlatformBlock` only when the prose or the actual symbol/member name differs by platform.
- A missing platform target does not justify a frozen raw link. Correct the map, qualify the canonical term, gate genuinely platform-specific prose, or use the documented backtick escape when the name must remain unlinked.

## Workflow

1. Use the local sibling repo `../igniteui-xplat-docs` to inspect old apiMap or markdown references.
2. Add missing canonical terms to strict-xplat topics; use raw links only in other populations or as explicit `raw` exceptions.
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

`docs/xplat/scripts/backtransform-api-links.mjs` converts authored links on strict-xplat pages back
to canonical terms and verifies the type/member identity on every platform. `resolve-api-links.mjs`
is a diagnostic for the opposite, generated direction; do not use it to materialize raw links in
strict-xplat source.

`docs/xplat/scripts/fix-api-link-attrs.mjs` may strip CLR generic arity and add
`kind="interface"` for known apiMap/TypeDoc mismatches. It must not add
`prefixed={false}` or `suffix={false}`.

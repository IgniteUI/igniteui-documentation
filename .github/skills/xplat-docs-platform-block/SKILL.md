---
name: xplat-docs-platform-block
description: "Guidance for using PlatformBlock in xplat MDX after ApiLink moved to registry-based resolution. Use when platform-specific prose or API symbols differ."
user-invocable: true
---

# PlatformBlock In Xplat Docs

## Purpose

`PlatformBlock` is for platform-specific content, not for API URL mechanics.

Use it when:

- prose differs by platform;
- sample code differs by platform;
- the actual symbol or member name differs by platform;
- a platform needs a manual external link or plain text because the API does not exist.

Do not use it just to handle package, prefix, suffix, or URL differences. ApiLink
and the generated registry should handle those.

## Correct Use

```mdx
<PlatformBlock for="Angular">
  <ApiLink type="IGridState" />
</PlatformBlock>

<PlatformBlock for="React,WebComponents,Blazor">
  <ApiLink type="GridState" />
</PlatformBlock>
```

## ApiLink Rules

- Prefer clean links: `<ApiLink type="Grid" />`.
- Add `member` when linking to a member.
- Add `pkg` only when `check-mdx-links` reports an ambiguity.
- Do not add `exclude`, `excludePrefixFor`, or `excludeSuffixFor`.
- Avoid new `prefixed={false}` or `suffix={false}` usage.

## Formatting

Keep PlatformBlocks readable:

```mdx
Some prose before.

<PlatformBlock for="Angular">
  Angular-only content.
</PlatformBlock>

<PlatformBlock for="React,WebComponents,Blazor">
  Shared xplat content.
</PlatformBlock>

Some prose after.
```

Avoid single-line PlatformBlocks unless they are already inside a compact inline
context that cannot be safely restructured.

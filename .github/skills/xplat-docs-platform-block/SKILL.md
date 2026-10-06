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

Do not use it just to handle package, prefix, suffix, or URL differences. Canonical backticked terms,
generation, and the generated registry should handle those.

## Correct Use

```mdx
<PlatformBlock for="Angular">
  `IGridState`
</PlatformBlock>

<PlatformBlock for="React,WebComponents,Blazor">
  `GridState`
</PlatformBlock>
```

## API-Term Rules

- On `platformType: xplat`, canonical backticked API terms are required.
- Qualify a member as `Type.Member` only when prose context cannot settle its owner.
- Use `<ApiLink raw ... />` only for a link that genuinely cannot be represented as a term.
- Raw ApiLink prop guidance belongs to `web-only`, `xplat-unmapped`, or that explicit exception.

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

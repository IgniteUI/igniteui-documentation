---
license: MIT
name: xplat-docs-platform-block
description: "Covers PlatformBlock in xplat MDX, where one source file builds for Angular, React, WebComponents and Blazor. Includes when content needs wrapping and when wrapping would hide it, the import, case-sensitive platform names, ComponentBlock nesting for grid variants, tag balance and the self-closing-tag error, full platform coverage, and the mistakes that silently drop content from a platform. WHEN TO USE: adding, fixing or auditing a PlatformBlock, or diagnosing content that is missing from one platform's built site. WHEN NOT TO USE: ApiLink markup rules (use xplat-docs-api-links), or topic structure and headings (use igniteui-doc-topics)."
user-invocable: true
---

# PlatformBlock In Xplat Docs

MDX files under `docs/xplat/src/content/` are shared across four platforms: **Angular, React,
WebComponents, Blazor**. A single source file is built once per platform, producing four separate
sites. `<PlatformBlock>` renders its content only for the platforms it lists.

## Import

Every MDX file that uses `<PlatformBlock>` must import it:

```mdx
import PlatformBlock from 'igniteui-astro-components/components/mdx/PlatformBlock.astro';
```

Platform names are **case-sensitive**: `Angular`, `React`, `WebComponents`, `Blazor`. A misspelling
such as `Webcomponents` or `blazor` is not an error — the content is silently never shown.

## Purpose

`PlatformBlock` is for platform-specific content, not for API URL mechanics.

Use it when:

- prose differs by platform;
- sample code differs by platform;
- the actual symbol or member name differs by platform;
- a platform needs a manual external link or plain text because the API does not exist.

Do not use it to handle package, prefix, suffix, or URL differences. `ApiLink` and the generated
registry handle those — see the `xplat-docs-api-links` skill.

## Correct use

```mdx
<PlatformBlock for="Angular">
  <ApiLink type="IGridState" />
</PlatformBlock>

<PlatformBlock for="React,WebComponents,Blazor">
  <ApiLink type="GridState" />
</PlatformBlock>
```

## What must NOT be wrapped

Content identical for all platforms must stay unwrapped. Wrapping it hides it from every platform
not listed.

| Content type | Example | Wrap? |
|---|---|---|
| Generic CSS | `.activeRow { border: 2px solid red; }` | **No** |
| JSON / data examples | `[{ id: 1, name: "Alice" }]` | **No** |
| Platform-agnostic concepts | General algorithm explanation in code | **No** |
| Shared prose | Paragraphs about features common to all platforms | **No** |
| Shell / cmd blocks | `npm install …` | **No** |
| Platform-specific markup or APIs | Angular template syntax, WC custom elements, Blazor razor | **Yes** |

## ComponentBlock — per grid variant

Some shared files cover `Grid`, `TreeGrid`, `HierarchicalGrid` and `PivotGrid`. `<ComponentBlock>`
scopes content to specific grid variants.

- **`PlatformBlock` goes inside `ComponentBlock`**, never the other way around.
- A TypeScript block inside a `ComponentBlock` but outside a `PlatformBlock` is visible to Angular,
  React and WebComponents at once. Use that only when the code is literally identical across the
  three — no platform-specific APIs.
- A block using WC-specific APIs (`IgcGridComponent`, `IgcColumnComponent`,
  `IgcCellTemplateContext`) must be wrapped in `<PlatformBlock for="WebComponents">` even inside a
  `ComponentBlock`. The same applies to Angular-specific APIs (`IgxGridComponent`, decorators,
  `@Component`) with `<PlatformBlock for="Angular">`.

## Tag balance

Every `<PlatformBlock for="...">` needs exactly one `</PlatformBlock>`.

`<PlatformBlock />` as a self-closing tag is invalid, and must never be used as a closing tag:

```mdx
<!-- Wrong -->
<PlatformBlock for="Angular" />

<!-- Wrong: self-closing used to close -->
<PlatformBlock for="Angular">
...
<PlatformBlock />

<!-- Correct -->
<PlatformBlock for="Angular">
...
</PlatformBlock>
```

The most common balance bug is closing a block before related code that belongs inside it — the
code then renders on every platform. When extending a block to cover more content, move the closing
tag rather than adding a second one.

Quick check — the counts must be equal:

```bash
grep -c '<PlatformBlock' file.mdx
grep -c '</PlatformBlock>' file.mdx
```

## Full coverage

When a section shows platform-specific code, every platform must be covered, or explicitly omitted
with a comment saying why. A missing platform means that platform's page shows no code at all for
the section.

## Common mistakes

| Mistake | Effect | Fix |
|---|---|---|
| Missing PlatformBlock around WC-specific TypeScript | Code shown on all platforms | Add `<PlatformBlock for="WebComponents">` |
| Self-closing `<PlatformBlock />` used as a closing tag | MDX parse error or wrong rendering | Use `</PlatformBlock>` |
| `</PlatformBlock>` placed before related code | Platform-specific code shown everywhere | Move it after the last related block |
| Wrong platform casing (`Webcomponents`, `blazor`) | Content silently never shown | Use `Angular`, `React`, `WebComponents`, `Blazor` |
| CSS inside a PlatformBlock when it applies to all | CSS hidden from unlisted platforms | Move it outside |
| JSX `{500}` inside a `{/* */}` MDX comment | Parse error: `Cannot read properties of undefined (reading 'start')` | Use a string: `height="500"` |

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

Avoid single-line PlatformBlocks unless they are already inside a compact inline context that cannot
be safely restructured.

## Related

- `xplat-docs-api-links` — the single authority on `ApiLink` markup.
- `src/lib/platform-context.ts` — platform detection and config.

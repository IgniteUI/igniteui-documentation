---
name: xplat-docs-platform-block
description: "Reference guide for using PlatformBlock in xplat MDX documentation files. Covers when to wrap code blocks, valid platform names (Angular, React, WebComponents, Blazor), import requirement, syntax, ComponentBlock nesting rules, platform detection tokens (igx-/igc-/Igr/Igb), self-closing tag errors, tag balance checking, and common mistakes. Use when an agent needs to add, fix, or audit PlatformBlock usage in MDX files."
user-invocable: true
---

# AI Agent Guide — Using PlatformBlock in MDX Files

## Context

MDX files in this folder are **shared across four platforms**: Angular, React, WebComponents, Blazor. A single `.mdx` source file is built once per platform, and the output is a separate documentation site per platform.

`<PlatformBlock>` is an Astro MDX component that renders its content **only for the specified platform(s)**. Any content — prose, code blocks, notes, or JSX — that should appear on some platforms but not others **must be wrapped in a `<PlatformBlock>`**.

> **Key rule:** Every platform-specific code snippet, note, or prose block must be wrapped in a `<PlatformBlock for="...">`. Content valid for ALL platforms can be left unwrapped. When in doubt, wrap it.

---

## Import

Every MDX file that uses `<PlatformBlock>` must import it at the top:

```mdx
import PlatformBlock from 'docs-template/components/mdx/PlatformBlock.astro';
```

This import line must appear before any use of the component. Check for it before adding PlatformBlocks to a file.

---

## Syntax

```mdx
<PlatformBlock for="Angular">
content visible only on Angular
</PlatformBlock>
```

Multiple platforms in one block — use a comma-separated list:

```mdx
<PlatformBlock for="Angular, WebComponents">
content visible on Angular and WebComponents
</PlatformBlock>
```

Valid platform names (exact casing required):

| Platform name | Description |
|---|---|
| `Angular` | Angular (Ignite UI for Angular) |
| `React` | React (Ignite UI for React) |
| `WebComponents` | Web Components (Ignite UI for Web Components) |
| `Blazor` | Blazor (Ignite UI for Blazor) |

---

## What Goes Inside a PlatformBlock

### Platform-specific code snippets

Each platform has a different template/markup syntax. Wrap each variant:

```mdx
<PlatformBlock for="Angular">
```html
<igx-grid [data]="data" [autoGenerate]="false">
    <igx-column field="Name" [sortable]="true"></igx-column>
</igx-grid>
```
</PlatformBlock>

<PlatformBlock for="WebComponents">
```html
<igc-grid id="grid" auto-generate="false">
    <igc-column field="Name" sortable="true"></igc-column>
</igc-grid>
```
</PlatformBlock>

<PlatformBlock for="React">
```tsx
<IgrGrid data={data} autoGenerate={false}>
    <IgrColumn field="Name" sortable={true}></IgrColumn>
</IgrGrid>
```
</PlatformBlock>

<PlatformBlock for="Blazor">
```razor
<IgbGrid Data="data" AutoGenerate="false">
    <IgbColumn Field="Name" Sortable="true"></IgbColumn>
</IgbGrid>
```
</PlatformBlock>
```

### Platform-specific prose notes

```mdx
<PlatformBlock for="Angular">
> [!Note]
> Using `cellEditor` with any editor component will disrupt keyboard navigation flow.
</PlatformBlock>
```

---

## What Does NOT Need a PlatformBlock

Content that is **identical for all platforms** must **not** be wrapped. Wrapping it would hide it from any platform that is not listed. The most common cases:

| Content type | Example | Wrap? |
|---|---|---|
| Generic CSS | `.activeRow { border: 2px solid red; }` | **No** |
| JSON / data examples | `[{ id: 1, name: "Alice" }]` | **No** |
| Platform-agnostic TypeScript concepts | General algorithm explanation in code | **No** |
| Shared prose | Paragraphs about features common to all platforms | **No** |
| Platform-specific markup / APIs | Angular template syntax, WC custom elements, Blazor razor | **Yes** |

---

## Grouping Platforms

When two or more platforms share the exact same content, use a comma-separated `for=` value instead of repeating blocks:

```mdx
<!-- Instead of this (redundant): -->
<PlatformBlock for="Angular">
```typescript
this.grid.sort({ fieldName: 'Name', dir: SortingDirection.Asc });
```
</PlatformBlock>

<PlatformBlock for="WebComponents">
```typescript
this.grid.sort({ fieldName: 'Name', dir: SortingDirection.Asc });
```
</PlatformBlock>

<!-- Do this (correct): -->
<PlatformBlock for="Angular, WebComponents">
```typescript
this.grid.sort({ fieldName: 'Name', dir: SortingDirection.Asc });
```
</PlatformBlock>
```

---

## ComponentBlock — Wrapping per Grid Variant

Some shared files cover multiple grid components: `Grid`, `TreeGrid`, `HierarchicalGrid`, `PivotGrid`. Use `<ComponentBlock>` to scope content to specific grid variants. `PlatformBlock` is nested **inside** `ComponentBlock` when the content is both variant-specific and platform-specific.

```mdx
<!-- Code that differs by grid variant AND by platform -->
<ComponentBlock for="HierarchicalGrid">
<PlatformBlock for="Angular, WebComponents">
```typescript
public updateCell() {
    this.hierarchicalGrid.updateCell(newValue, rowID, 'Age');
}
```
</PlatformBlock>

<PlatformBlock for="Blazor">
```razor
@code {
    this.HierarchicalGridRef.UpdateCell(newValue, rowID, "Age");
}
```
</PlatformBlock>
</ComponentBlock>
```

### Important nesting rules for ComponentBlock + PlatformBlock

- **`PlatformBlock` goes inside `ComponentBlock`**, never the other way around.
- A TypeScript block inside a `ComponentBlock` but outside a `PlatformBlock` is visible to Angular, React, and WebComponents simultaneously. Use this **only** when the TypeScript code is literally identical across those three platforms (i.e., it does not use any platform-specific APIs like `IgcGridComponent` or `IgrGrid`).
- If a TypeScript block uses WC-specific APIs (`IgcGridComponent`, `IgcColumnComponent`, `IgcCellTemplateContext`, etc.), wrap it in `<PlatformBlock for="WebComponents">` even if it is already inside a `ComponentBlock`.
- If a code block uses Angular-specific APIs (`IgxGridComponent`, Angular decorators, `@Component`), wrap it in `<PlatformBlock for="Angular">`.

---

## When to Split vs When to Group

### Split into separate PlatformBlocks when
- The markup/template syntax is different (`igx-` vs `igc-` vs `<IgrGrid>` vs `<IgbGrid>`)
- The API call or property name differs per platform (e.g., `getState()` vs `GetState()`)
- One platform has extra configuration the others do not

### Group into one PlatformBlock when
- The code is byte-for-byte identical across those platforms
- The prose or note applies equally to all listed platforms

### Omit PlatformBlock entirely when
- The content applies to **all four** platforms without exception (CSS, JSON data, shared algorithm explanations)

---

## Code Blocks — Platform Detection Tokens

Every ` ``` ` code snippet that is **platform-specific must be inside** a `<PlatformBlock>`. If the code uses any of these tokens, it is platform-specific and requires a PlatformBlock:

| Token / pattern | Platform |
|---|---|
| `igx-`, `<igx-`, `[igxGridState]`, `@Component`, `@NgModule`, `ngModel` | Angular |
| `igc-`, `<igc-`, `IgcGridComponent`, `IgcColumnComponent`, `IgcCellTemplateContext` | WebComponents |
| `<Igr`, `IgrGrid`, `IgrColumn`, JSX/TSX syntax | React |
| `<Igb`, `IgbGrid`, `@ref`, `@code {`, `.razor` extension | Blazor |

**CSS blocks are almost always platform-agnostic** and do not need a PlatformBlock unless they contain Angular `::ng-deep` or other platform-specific overrides.

---

## Self-Closing Tags Are Invalid

`<PlatformBlock />` as a self-closing tag is invalid. It must always have a closing tag:

```mdx
<!-- Wrong -->
<PlatformBlock for="Angular" />

<!-- Wrong — do NOT use self-closing as a closing tag -->
<PlatformBlock for="Angular">
...
<PlatformBlock />

<!-- Correct -->
<PlatformBlock for="Angular">
...
</PlatformBlock>
```

---

## Balancing Open and Close Tags

Every `<PlatformBlock for="...">` must have exactly one `</PlatformBlock>` closing tag. A common mistake is closing the block too early when the following code block also belongs to the same platform:

```mdx
<!-- Wrong: PlatformBlock closed before the TypeScript block -->
<PlatformBlock for="WebComponents">
```html
<igc-grid id="grid"></igc-grid>
```
</PlatformBlock>

```ts
// WC-specific TypeScript — NOT wrapped!
var grid = document.getElementById('grid') as IgcGridComponent;
```

<!-- Correct: extend the PlatformBlock to cover both blocks -->
<PlatformBlock for="WebComponents">
```html
<igc-grid id="grid"></igc-grid>
```

```ts
var grid = document.getElementById('grid') as IgcGridComponent;
```
</PlatformBlock>
```

### Quick balance check

```bash
# Should print equal counts
grep -c '<PlatformBlock' file.mdx
grep -c '</PlatformBlock>' file.mdx
```

---

## Full Coverage Requirement

When a section of the page shows platform-specific code, **every platform must be covered** (or explicitly omitted with a comment explaining why). Missing a platform means that platform's docs page shows no code for that section.

Typical full-coverage pattern:

```mdx
<PlatformBlock for="Angular">
```html
<!-- Angular markup -->
```
</PlatformBlock>

<PlatformBlock for="WebComponents">
```html
<!-- WC markup -->
```

```ts
// WC-specific TypeScript initialization
```
</PlatformBlock>

<PlatformBlock for="React">
```tsx
{/* React JSX */}
```
</PlatformBlock>

<PlatformBlock for="Blazor">
```razor
@* Blazor Razor syntax *@
```
</PlatformBlock>
```

---

## Step-by-Step: Adding a PlatformBlock to an Existing File

1. **Check for the import** at the top of the file:
   ```mdx
   import PlatformBlock from 'docs-template/components/mdx/PlatformBlock.astro';
   ```
   Add it if missing (after existing imports).

2. **Identify the platform-specific content** — look for platform API tokens (see table above) in unprotected code blocks.

3. **Wrap each variant** in the appropriate `<PlatformBlock for="...">`.

4. **Check balance** — count open vs close tags as shown above.

5. **Do not wrap CSS or JSON** that applies to all platforms.

6. **Do not use self-closing `<PlatformBlock />`** — always use `</PlatformBlock>`.

---

## Common Mistakes

| Mistake | Effect | Fix |
|---|---|---|
| Missing PlatformBlock around WC-specific TypeScript | Code shown on all platforms, breaks Angular/React/Blazor | Add `<PlatformBlock for="WebComponents">` |
| Self-closing `<PlatformBlock />` used as closing tag | MDX parse error or content rendered incorrectly | Change to `</PlatformBlock>` |
| Closing `</PlatformBlock>` placed too early (before related code block) | Platform-specific code shown on all platforms | Move `</PlatformBlock>` to after the last related code block |
| Wrong platform name (e.g. `"Webcomponents"`, `"blazor"`) | Content never shown (silently filtered out) | Use exact casing: `WebComponents`, `Blazor`, `Angular`, `React` |
| CSS inside PlatformBlock when it applies to all platforms | CSS hidden from unlisted platforms | Move CSS outside the PlatformBlock |
| JSX `{500}` inside `{/* */}` MDX comment | Parse error: `Cannot read properties of undefined (reading 'start')` | Change numeric JSX props to strings: `height="500"` |

---

## Key Files

| File | Role |
|---|---|
| `src/components/mdx/PlatformBlock.astro` | PlatformBlock component — renders content conditionally per platform |
| `src/lib/platform-context.ts` | Platform detection and config (used by ApiLink; same platforms) |

## Related Skills

- [`xplat-docs-api-links`](../xplat-docs-api-links/SKILL.md) — ApiLink usage guide

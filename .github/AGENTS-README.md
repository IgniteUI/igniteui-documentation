# xplat Docs Agent Guide

This document describes the AI skills available in this repository, what each one covers, and when to use them.

---

## Context

The MDX files under `docs/xplat/src/content/en/` are **shared across six platforms**: Angular, React, WebComponents, Blazor, WinUI, and Uno Platform. A single source file is built once per platform to produce a separate documentation site each time, and `docs/xplat/src/content/jp/` mirrors the set.

**Three populations live in that tree, and every page declares which it is** in its `platformType` frontmatter, which is required and has no default. **`xplat`** is the DV set — charts, gauges, maps, dashboard tile, data grid, spreadsheet, toolbar, zoom slider — where names in backticks resolve in full and a component is stated as a `json-snippet` unless a platform-specific snippet is genuinely necessary. **`xplat-unmapped`** is the same set where that treatment cannot be applied yet: the Excel library, whose API no generator describes, and the data grid's accessibility topic, whose XAML shape is undecided. **`web-only`** — inputs, layouts, notifications, scheduling, themes, the web grid families, grid lite — carries neither obligation and may do as it likes; reworking one to match the DV set is out of scope, not an improvement. Identity is not publication: a topic can be xplat and not reach the desktop platforms yet.

Three recurring tasks require specific knowledge to do correctly:

1. **ApiLink** — inline API hyperlinks that resolve to the correct platform-specific TypeDoc URL at build time, under the processing mode the page's `apiTerms` frontmatter declares.
2. **PlatformBlock** — a wrapper component that shows content only for the specified platform(s).
3. **json-snippet** — a component stated once as JSON, which generation turns into each platform's own code rather than a hand written block per platform.

The skills below are the canonical reference for all three.

---

## Skills

| Skill | Use it for |
|---|---|
| [`xplat-docs-api-links`](./skills/xplat-docs-api-links/SKILL.md) | Adding, fixing, or auditing `<ApiLink>` calls in MDX files, and the `apiTerms` mode a page declares |
| [`xplat-docs-json-snippets`](./skills/xplat-docs-json-snippets/SKILL.md) | Writing or validating `json-snippet` fences — the JSON a component is stated in, and the checks over it |
| [`xplat-docs-platform-block`](./skills/xplat-docs-platform-block/SKILL.md) | Adding, fixing, or auditing `<PlatformBlock>` usage in MDX files |
| [`xplat-docs-api-map-sync`](./skills/xplat-docs-api-map-sync/SKILL.md) | Keeping the api maps in step with a product release |
| [`docfx-sync`](./skills/docfx-sync/SKILL.md) | Merging upstream igniteui-docfx changes and fixing MDX regressions |

---

## When to Use Which Skill

| Situation | Skill |
|---|---|
| Adding an inline link to a class, property, or method in an MDX file | `xplat-docs-api-links` |
| Fixing a broken or incorrect `<ApiLink>` (wrong type, kind, pkg, or member) | `xplat-docs-api-links` |
| Adding or updating the `## API References` section at the bottom of a page | `xplat-docs-api-links` |
| Working with excel library API links (`pkg="excel"`) | `xplat-docs-api-links` |
| Working with dock manager slot API links | `xplat-docs-api-links` |
| Showing a component's code on a page, or changing what a snippet shows | `xplat-docs-json-snippets` |
| Choosing between markup, code, a handler, or `channel="auto"` for a fence | `xplat-docs-json-snippets` |
| A platform showing a heading and prose with no code under it | `xplat-docs-json-snippets` |
| Running the schema, emission, casing or live-load checks before pushing | `xplat-docs-json-snippets` |
| A page that will not build for want of `apiTerms` | `xplat-docs-api-links` |
| An "Ambiguous API symbol" build failure asking for `pkg=` | `xplat-docs-api-links` |
| Updating the api maps after a product release | `xplat-docs-api-map-sync` |
| Wrapping a code block or prose section so it only appears on specific platforms | `xplat-docs-platform-block` |
| Checking that a file has no bare platform-specific code blocks | `xplat-docs-platform-block` |
| Investigating a PlatformBlock balance error (unmatched open/close tags) | `xplat-docs-platform-block` |
| Fixing a self-closing `<PlatformBlock />` tag error | `xplat-docs-platform-block` |
| Merging a docfx vnext sync PR into this repo | `docfx-sync` |
| Fixing `{environment:angularApiUrl}` links after a sync | `docfx-sync` |
| Fixing `.md` link extensions after a sync | `docfx-sync` |
| Restoring lost `<ApiLink>` or `<Sample>` components after a sync | `docfx-sync` |

---

## Key Concepts

### The four platforms

All MDX content is built for:

| Name | Prefix | Package family |
|---|---|---|
| `Angular` | `Igx` | `igniteui-angular` |
| `React` | `Igr` | `igniteui-react-*` |
| `WebComponents` | `Igc` | `igniteui-webcomponents-*` |
| `Blazor` | `Igb` | `IgniteUI.Blazor` |

### ApiLink rules in brief

- `type=` is always the **short unprefixed** name (e.g. `"Column"`, not `"IgrColumn"`).
- `pkg=` selects the API doc root; the same key works for all platforms.
- `kind=` must match the TypeDoc symbol type — default is `"class"`, must be set explicitly for interfaces, enums, and type aliases.
- `prefixed={false}` is required for `{ComponentName}` template variables and for all `pkg="excel"` types.
- `suffix={false}` is required for utility/non-component classes (FilteringOperand, SortingStrategy, SummaryOperand, all excel types).

### PlatformBlock rules in brief

- Import: `import PlatformBlock from 'docs-template/components/mdx/PlatformBlock.astro';`
- Platform names are case-sensitive: `Angular`, `React`, `WebComponents`, `Blazor`.
- CSS, JSON, and shell/cmd blocks are platform-agnostic — do **not** wrap them.
- WC TypeScript blocks containing `IgcGridComponent`, `IgcColumnComponent`, etc. **must** be wrapped in `<PlatformBlock for="WebComponents">`.
- `<PlatformBlock />` self-closing is invalid — always use `</PlatformBlock>`.
- `PlatformBlock` goes **inside** `ComponentBlock`, never the other way around.

---

## Repository Areas

```
docs/xplat/src/content/en/          MDX source files (one per topic, shared across platforms)
docs/xplat/src/content/en/components/grids/_shared/   Shared grid topic files
src/components/mdx/ApiLink.astro    ApiLink component implementation
src/components/mdx/PlatformBlock.astro   PlatformBlock component implementation
src/lib/platform-context.ts         Platform config — docRoot URLs, package IDs, prefixes
docs/xplat/AI-AGENT-API-LINKS.md   Extended ApiLink reference (human-readable)
docs/xplat/AI-AGENT-PLATFORM-BLOCK.md   Extended PlatformBlock reference (human-readable)
```

---

## Maintenance Notes

When adding a new skill, update:
1. The **Skills** table above
2. The **When to Use Which Skill** table above
3. Add the `SKILL.md` under `.github/skills/<skill-name>/`

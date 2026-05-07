# xplat Docs Agent Guide

This document describes the AI skills available in this repository, what each one covers, and when to use them.

---

## Context

The MDX files under `docs/xplat/src/content/en/` are **shared across four platforms**: Angular, React, WebComponents, and Blazor. A single source file is built once per platform to produce four separate documentation sites. Two recurring tasks require specific knowledge to do correctly:

1. **ApiLink** — inline API hyperlinks that resolve to the correct platform-specific TypeDoc URL at build time.
2. **PlatformBlock** — a wrapper component that shows content only for the specified platform(s).

The skills below are the canonical reference for both.

---

## Skills

| Skill | Use it for |
|---|---|
| [`xplat-docs-api-links`](./skills/xplat-docs-api-links/SKILL.md) | Adding, fixing, or auditing `<ApiLink>` calls in MDX files |
| [`xplat-docs-platform-block`](./skills/xplat-docs-platform-block/SKILL.md) | Adding, fixing, or auditing `<PlatformBlock>` usage in MDX files |

---

## When to Use Which Skill

| Situation | Skill |
|---|---|
| Adding an inline link to a class, property, or method in an MDX file | `xplat-docs-api-links` |
| Fixing a broken or incorrect `<ApiLink>` (wrong type, kind, pkg, or member) | `xplat-docs-api-links` |
| Adding or updating the `## API References` section at the bottom of a page | `xplat-docs-api-links` |
| Working with excel library API links (`pkg="excel"`) | `xplat-docs-api-links` |
| Working with dock manager slot API links | `xplat-docs-api-links` |
| Wrapping a code block or prose section so it only appears on specific platforms | `xplat-docs-platform-block` |
| Checking that a file has no bare platform-specific code blocks | `xplat-docs-platform-block` |
| Investigating a PlatformBlock balance error (unmatched open/close tags) | `xplat-docs-platform-block` |
| Fixing a self-closing `<PlatformBlock />` tag error | `xplat-docs-platform-block` |

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

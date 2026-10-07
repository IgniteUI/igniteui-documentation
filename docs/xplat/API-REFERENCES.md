# API References System — xplat docs

> **Status — human background, not agent instructions.**
> The single authority on `ApiLink` markup is the `xplat-docs-api-links` skill
> ([`.github/skills/xplat-docs-api-links/SKILL.md`](../../.github/skills/xplat-docs-api-links/SKILL.md)).
> This file explains how the component and the registry resolve a URL; it does not define the markup
> rules. `prefixed` and `suffix` are legacy props — the registry resolves both, no file in either doc
> set passes them, and new markup must not add them.

Complete reference for the `ApiLink` component used across all platform MDX pages.

---

## Overview

The `ApiLink` Astro component generates correct, platform-aware hyperlinks to the TypeDoc API docs on infragistics.com.

| Component | Purpose |
|-----------|---------|
| `ApiLink` | Inline `<a><code>…</code></a>` in prose text and in "API References" sections — for class names and members |

The component reads the current build platform from `platform-context.ts` at **build time**. The same MDX markup works for Angular, React, WebComponents, and Blazor — no per-platform conditionals needed.

---

## Files

| File | Role |
|------|------|
| `src/lib/platform-context.ts` | Registry: `apiPackages` per platform — doc roots, package IDs, URL flags |
| `src/components/mdx/ApiLink.astro` | Link component — inline and API References sections |

---

## URL Construction — Step by Step

Given `pkg`, `type`, and optional `member`, the URL is built as follows.

### Step 1 — Look up the package config

```typescript
const pkgConfig = apiPackages[pkg ?? 'core'];
// React + pkg="charts" →
// { docRoot: '…/ignite-ui-react/api/docs/typescript/latest',
//   packageId: 'igniteui_react_charts' }
```

### Step 2 — Build the class name

```typescript
// Add platform prefix (Igr / Igx / Igc / Igb) unless prefixed={false}
const baseType = prefixed ? `${prefix}${type}` : type;
// e.g. prefix="Igr", type="CategoryChart" → "IgrCategoryChart"

// Add Angular DV suffix if configured (never shown in label)
const fullType = pkgConfig.classSuffix
    ? `${baseType}${pkgConfig.classSuffix}`
    : baseType;
// Angular charts: classSuffix="Component" → "IgxCategoryChartComponent"
// React charts: no suffix → "IgrCategoryChart"
```

### Step 3 — Build the class slug

```typescript
const classSlug = pkgConfig.noPackagePrefix
    ? fullType.toLowerCase()                             // no packageId. prefix
    : `${pkgConfig.packageId}.${fullType.toLowerCase()}`; // with packageId. prefix
```

### Step 4 — Final URL

```
{docRoot}/classes/{classSlug}.html#{member?.toLowerCase()}
```

---

## URL Formats

TypeDoc uses three distinct URL patterns across platforms and packages.

### Format 1 — Core components, Angular core/grids (`noPackagePrefix: true`)

```
…/products/ignite-ui-{platform}/docs/typescript/latest/classes/{classname}.html
```

Examples:
- React `core` Toast → `.../classes/igrtoast.html`
- Angular `core` Grid → `.../classes/igxgridcomponent.html`

### Format 2 — DV sub-packages: charts, gauges, maps, excel, spreadsheet

```
…/products/ignite-ui-{platform}/api/docs/typescript/latest/classes/{packageId}.{classname}.html
```

Note the extra `/api/` segment. `packageId` uses **underscores**.

Examples:
- React charts → `.../api/.../classes/igniteui_react_charts.igrcategorychart.html`
- Angular charts → `.../api/.../classes/igniteui_angular_charts.igxcategorychartcomponent.html`
- WC gauges → `.../api/.../classes/igniteui_webcomponents_gauges.igcradialgauge.html`

### Format 3 — React / WebComponents / Blazor grids

```
…/products/ignite-ui-{platform}/docs/typescript/latest/classes/{packageId}.{classname}.html
```

Uses `/docs/` (no `/api/`), but **does** include the `packageId.` prefix. `packageId` uses **hyphens**.

Example:
- React grids Grid → `.../classes/igniteui-react-grids.igrgrid.html`

### Angular DV class suffix

Angular wraps DV classes in Angular Components, so TypeDoc adds a `Component` suffix to the class name. The `classSuffix: 'Component'` config handles this automatically. The **display label never includes the suffix** — only the URL does.

| Short type | Displayed as | Angular URL slug |
|---|---|---|
| `CategoryChart` | `IgxCategoryChart` | `igxcategorychartcomponent` |
| `RadialGauge` | `IgxRadialGauge` | `igxradialgaugecomponent` |

---

## URL Examples

| Platform | `pkg` | Type | Rendered URL |
|----------|-------|------|-------------|
| React | `core` | Toast | `.../ignite-ui-react/docs/.../classes/igrtoast.html` |
| React | `grids` | Grid | `.../ignite-ui-react/docs/.../classes/igniteui-react-grids.igrgrid.html` |
| React | `charts` | CategoryChart | `.../ignite-ui-react/api/docs/.../classes/igniteui_react_charts.igrcategorychart.html` |
| React | `charts` | CategoryChart#transitionInDuration | `…igrcategorychart.html#transitioninduration` |
| Angular | `core` | Grid | `.../ignite-ui-angular/docs/.../classes/igxgridcomponent.html` |
| Angular | `charts` | CategoryChart | `.../ignite-ui-angular/api/docs/.../classes/igniteui_angular_charts.igxcategorychartcomponent.html` |
| WebComponents | `gauges` | RadialGauge | `.../ignite-ui-web-components/api/docs/.../classes/igniteui_webcomponents_gauges.igcradialgauge.html` |
| Blazor | `maps` | GeographicMap | `.../ignite-ui-blazor/api/docs/.../classes/igniteui_blazor_maps.igbgeographicmap.html` |

---

## Package Registry (`platform-context.ts`)

### `ApiPackageConfig` interface

```typescript
export interface ApiPackageConfig {
    docRoot:            string;   // Base URL, no trailing slash
    packageId:          string;   // Segment used in /classes/{packageId}.{class}.html
    noPackagePrefix?:   boolean;  // When true: omit {packageId}. prefix
    preserveCase?:      boolean;  // When true: keep PascalCase in URL (new-style API sites)
    classSuffix?:       string;   // Appended to class name in URL (e.g. 'Component' for Angular DV)
                                  // NOT added to display labels — URL only
    pascalCaseMembers?: boolean;  // When true: member anchors are PascalCase (Blazor)
}
```

### Package keys — what to use per content area

| `pkg=` key | Content area | React package | Angular `classSuffix` |
|------------|-------------|---------------|----------------------|
| `"core"` _(default)_ | Components, inputs, layouts (Toast, Badge, Accordion…) | `igniteui-react` | — |
| `"charts"` | All chart types (CategoryChart, FinancialChart, XamDataChart…) | `igniteui-react-charts` | `Component` |
| `"grids"` | Data grids, columns, grid events | `igniteui-react-grids` | — |
| `"gauges"` | Radial/linear gauges, bullet graph | `igniteui-react-gauges` | `Component` |
| `"maps"` | Geographic map and series | `igniteui-react-maps` | `Component` |
| `"inputs"` | Input controls | `igniteui-react-inputs` | — |
| `"layouts"` | Layout components | `igniteui-react-layouts` | — |
| `"excel"` | Excel library (Workbook, Worksheet…) | `igniteui-react-excel` | — _(no suffix — utility classes)_ |
| `"spreadsheet"` | Spreadsheet component | `igniteui-react-spreadsheet` | `Component` |
| `"datasources"` | Data source utilities | `igniteui-react-datasources` | — |

WebComponents and Blazor use the same key names with their package names and no `classSuffix`.

> **Adding a new package:** Add an entry to each platform's `apiPackages` object in `platform-context.ts` with `docRoot`, `packageId`, and optionally `noPackagePrefix` / `classSuffix`.

---

## `ApiLink` Component

**File:** `src/components/mdx/ApiLink.astro`

Use anywhere in prose to link a class, interface, enum, type alias, variable, or function — and optionally a member on a class or interface. Never use inside code fences.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | **required** | Symbol name without platform prefix, e.g. `"Toast"`, `"configureTheme"` |
| `kind` | `'class' \| 'interface' \| 'enum' \| 'type' \| 'variable' \| 'function'` | `"class"` | TypeDoc symbol kind — determines the URL segment |
| `member` | `string` | — | Property or method name. Appended as `#{member}` anchor in URL |
| `pkg` | `string` | `"core"` | Package key. See table above |
| `label` | `string` | auto | Display text. Defaults to `{Prefix}{Type}` or `{Prefix}{Type}.{member}` — **never** includes `classSuffix` |
| `prefixed` | `boolean` | `true` | Legacy. Whether the platform prefix is prepended. The registry resolves this; do not pass the prop |
| `suffix` | `boolean` | `true` | Legacy. Whether the platform class suffix is appended. The registry resolves this; do not pass the prop |

### URL segments by kind

| `kind=` | TypeDoc URL segment | Casing |
|---------|--------------------|----|
| `"class"` _(default)_ | `/classes/` | lowercased |
| `"interface"` | `/interfaces/` | preserved |
| `"enum"` | `/enums/` | preserved |
| `"type"` | `/types/` | preserved |
| `"variable"` | `/variables/` | preserved |
| `"function"` | `/functions/` | preserved |

> **Note:** Only class URLs are lowercased (TypeDoc behaviour). All other kinds preserve the original symbol casing.

### Usage examples

```mdx
import ApiLink from '@/components/mdx/ApiLink.astro';

<!-- Class link (core package — pkg and kind omitted = defaults) -->
Use the <ApiLink type="Toast" /> component to show notifications.

<!-- Class member link -->
Call the <ApiLink type="Toast" member="show" label="Show" /> method on button click.

<!-- Charts class -->
The <ApiLink pkg="charts" type="CategoryChart" /> renders category data.

<!-- Charts class member -->
Enable via <ApiLink pkg="charts" type="CategoryChart" member="isTransitionInEnabled" label="IsTransitionInEnabled" />.

<!-- Grid property -->
Set <ApiLink pkg="grids" type="{ComponentName}" member="rowSelection" /> to enable selection.

<!-- Function (no platform prefix) -->
Call <ApiLink kind="function" type="configureTheme" /> to apply a theme at runtime.

<!-- Variable (fully-qualified) -->
Use <ApiLink kind="variable" type="IgrCalendarResourceStringEN" /> for English localization.

<!-- Type alias (no prefix) -->
See the <ApiLink kind="type" type="AbsolutePosition" /> type for valid values.

<!-- Interface (no prefix) -->
Implement <ApiLink kind="interface" type="ComboTemplateProps" /> for custom templates.

<!-- Enum -->
Set the <ApiLink kind="enum" type="CalendarSelection" /> enum to control selection mode.
```

### Rendered output (React platform)

```html
<!-- <ApiLink type="Toast" /> -->
<a href=".../ignite-ui-react/docs/typescript/latest/classes/igrtoast.html">
  <code>IgrToast</code>
</a>

<!-- <ApiLink pkg="charts" type="CategoryChart" member="transitionInDuration" label="TransitionInDuration" /> -->
<a href=".../ignite-ui-react/api/docs/typescript/latest/classes/igniteui_react_charts.igrcategorychart.html#transitioninduration">
  <code>TransitionInDuration</code>
</a>

<!-- <ApiLink kind="function" type="configureTheme" /> -->
<a href=".../ignite-ui-react/docs/typescript/latest/functions/igniteui-react.configureTheme.html">
  <code>configureTheme</code>
</a>

<!-- <ApiLink kind="variable" type="IgrCalendarResourceStringEN" /> -->
<a href=".../ignite-ui-react/docs/typescript/latest/variables/igniteui-react.IgrCalendarResourceStringEN.html">
  <code>IgrCalendarResourceStringEN</code>
</a>

<!-- <ApiLink kind="type" type="AbsolutePosition" /> -->
<a href=".../ignite-ui-react/docs/typescript/latest/types/igniteui-react.AbsolutePosition.html">
  <code>AbsolutePosition</code>
</a>

<!-- <ApiLink pkg="charts" type="CategoryChart" /> on Angular -->
<a href=".../ignite-ui-angular/api/docs/typescript/latest/classes/igniteui_angular_charts.igxcategorychartcomponent.html">
  <code>IgxCategoryChart</code>   <!-- label never has "Component" suffix -->
</a>
```

---

## Rules

| Situation | What to do |
|-----------|-----------|
| Class name in prose text | `<ApiLink type="Foo" />` |
| Property or method in prose text | `<ApiLink type="Foo" member="bar" label="Bar" />` |
| Interface name | `<ApiLink kind="interface" type="FooProps" />` |
| Enum name | `<ApiLink kind="enum" type="FooEnum" />` |
| Type alias | `<ApiLink kind="type" type="FooType" />` |
| Variable | `<ApiLink kind="variable" type="FooVar" />` |
| Function | `<ApiLink kind="function" type="fooFn" />` |
| Symbol in "API References" section | `<ApiLink type="Foo" />` — one per type (add `kind=` for non-class) |
| Property/method in "API References" section | **Never** — members go in `<ApiLink>` inline only |
| Chart class/member | `pkg="charts"` only if `check-mdx-links` reports the symbol in more than one package |
| Grid class/member | `pkg="grids"` only to disambiguate; the registry resolves the package otherwise |
| Gauge class/member | `pkg="gauges"` only to disambiguate |
| Map class/member | `pkg="maps"` only to disambiguate |
| Import placement | After frontmatter `---`, before first `#` heading — **never inside a code fence** |

---

## Complete Page Examples

### Core component page (Toast)

```mdx
---
title: {Platform} Toast | {ProductName}
---
import Sample from '@/components/mdx/Sample.astro';
import ApiLink from '@/components/mdx/ApiLink.astro';

# {Platform} Toast

Use the <ApiLink type="Toast" /> component to show brief notifications.

Call the <ApiLink type="Toast" member="show" label="Show" /> method to display it.
Set <ApiLink type="Toast" member="displayTime" label="DisplayTime" /> to control visibility duration.
Use <ApiLink type="Toast" member="keepOpen" label="KeepOpen" /> to prevent auto-dismissal.

<ApiLink type="Toast" />
```

### Charts page (animations)

```mdx
---
title: {Platform} Chart Animations | {ProductName}
---
import Sample from '@/components/mdx/Sample.astro';
import ApiLink from '@/components/mdx/ApiLink.astro';

# {Platform} Chart Animations

Enable animations by setting <ApiLink pkg="charts" type="CategoryChart" member="isTransitionInEnabled" label="IsTransitionInEnabled" /> to `true`.
Control duration with <ApiLink pkg="charts" type="CategoryChart" member="transitionInDuration" label="TransitionInDuration" />.
Set <ApiLink pkg="charts" type="CategoryChart" member="transitionInMode" label="TransitionInMode" /> to choose the animation style.

<ApiLink pkg="charts" type="CategoryChart" />
```

### Grid page (shared file, multi-platform)

```mdx
---
title: {Platform} {ComponentTitle} Row Selection | {ProductName}
---
import ApiLink from '@/components/mdx/ApiLink.astro';

# {Platform} {ComponentTitle} Row Selection

Set <ApiLink pkg="grids" type="{ComponentName}" member="rowSelection" /> to enable selection.
Use <ApiLink pkg="grids" type="{ComponentName}" member="selectedRows" /> to access selected rows.

<ApiLink pkg="grids" type="{ComponentName}" />
<ApiLink pkg="grids" type="Column" />
```

---

## Excel Library — Special Rules

Excel library types (`Workbook`, `Worksheet`, `WorksheetTable`, `WorksheetCell`, `Formula`, `DisplayOptions`, `SortSettings`, etc.) are **utility classes** — they carry no platform prefix and no `Component` suffix on any platform.

The registry knows they carry no prefix, so the markup needs nothing special:

```mdx
<ApiLink pkg="excel" type="WorksheetTable" />
<ApiLink pkg="excel" type="Workbook" />
<ApiLink pkg="excel" type="Worksheet" member="tables" label="Tables" />
```

Older pages pass `prefixed={false}` here. That is the legacy override; do not add it to new markup.

The Blazor excel package is **separate** from `IgniteUI.Blazor`. The `pkg="excel"` config for Blazor resolves to:
- **Package:** `IgniteUI.Blazor.Documents.Excel`
- **URL root:** `https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor.Documents.Excel/25.1.x/`
- Example: `.../classes/WorksheetTable`

Do **not** add `classSuffix: 'Component'` to the `excel` entry in `platform-context.ts` for any platform.

---

## Dock Manager Slot Members

Dock Manager slot names are exposed as members of the `DockManager` class. Use `pkg="core"` (WC API: `igniteui-dockmanager`):

```mdx
<ApiLink pkg="core" type="DockManager" member="closeButton" label="closeButton" />
<ApiLink pkg="core" type="DockManager" member="maximizeButton" label="maximizeButton" />
<ApiLink pkg="core" type="DockManager" member="minimizeButton" label="minimizeButton" />
<ApiLink pkg="core" type="DockManager" member="pinButton" label="pinButton" />
<ApiLink pkg="core" type="DockManager" member="unpinButton" label="unpinButton" />
<ApiLink pkg="core" type="DockManager" member="paneHeaderCloseButton" label="paneHeaderCloseButton" />
<ApiLink pkg="core" type="DockManager" member="splitterHandle" label="splitterHandle" />
```

---

## MDX Parse Error — JSX Expressions in Comments

JSX numeric expressions (`{500}`, `{0}`) inside `{/* */}` MDX block comments cause:
`Cannot read properties of undefined (reading 'start')`

The MDX parser tries to evaluate them even inside comments. Fix by converting to string attributes:

```mdx
{/* Bad — {500} triggers parse error */}
{/* <Sample src="/foo" height={500} alt="{Platform} Example" />*/}

{/* Good — use string attribute and add space before */ */}
{/* <Sample src="/foo" height="500" alt="{Platform} Example" /> */}
```

---

## Writing ApiLink markup

The procedure for adding, fixing and auditing `<ApiLink>` lives in the
[`xplat-docs-api-links`](../../.github/skills/xplat-docs-api-links/SKILL.md) skill, which is the
single authority. This file documents how the component and the registry resolve a URL; it does
not define the markup rules.

# ApiLink — How It Works and How to Update It

## Overview

`<ApiLink>` is an Astro MDX component that generates **platform-aware** hyperlinks to the TypeDoc API reference sites. It resolves the correct URL at build time based on the current platform (Angular, React, WebComponents, Blazor), so a **single MDX source file** produces correct links for all four documentation targets.

> **Important:** The `type=`, `member=`, and `kind=` attributes are the same across all platforms — only the generated URL changes. When you fix an ApiLink, you are fixing it for all platforms at once.

---

## `<ApiLink>` — Inline API Link

Renders an inline `<a><code>…</code></a>` link to a specific type or member.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | **required** | Short type name **without** platform prefix, e.g. `"Grid"`, `"Column"`, `"ClipboardOptions"` |
| `pkg` | string | `"core"` | Package key — see [Package Keys](#package-keys) |
| `kind` | string | `"class"` | Symbol kind: `class`, `interface`, `enum`, `type`, `variable`, `function` |
| `member` | string | — | Property or method name to anchor to, e.g. `"sortable"` |
| `label` | string | auto | Override display text. Defaults to `PrefixType` or `PrefixType.member` |
| `prefixed` | boolean | `true` | When `true`, the platform prefix (`Igr`/`Igx`/`Igc`/`Igb`) is prepended automatically |
| `suffix` | boolean | `true` | When `true`, the platform class suffix (e.g. `Component` for Angular DV packages) is appended. Set `false` for utility/non-component classes (FilteringOperand, SortingStrategy, excel library types, etc.) |

### URL Resolution

For **classes** (default kind):
```
{docRoot}/classes/{PrefixType}#{member}
```

For **non-class kinds** (interface, enum, type, etc.):
```
{docRoot}/{kind}s/{PrefixType}#{member}
```

The `docRoot` and URL format are resolved from `src/lib/platform-context.ts` based on the current platform.

### Examples

```mdx
<!-- Link to the grid component class -->
<ApiLink pkg="grids" type="{ComponentName}" prefixed={false} />

<!-- Link to a column property (same for all platforms) -->
<ApiLink pkg="grids" type="Column" member="sortable" />

<!-- Link to a ColumnGroup property -->
<ApiLink pkg="grids" type="ColumnGroup" member="collapsible" />

<!-- Link to an interface member -->
<ApiLink pkg="grids" type="ClipboardOptions" kind="interface" member="copyHeaders" />

<!-- Link to a grid method with custom label -->
<ApiLink pkg="grids" type="{ComponentName}" member="pinRow" label="PinRow" prefixed={false} />

<!-- Link to a type alias -->
<ApiLink pkg="grids" type="GridCellMergeMode" kind="type" prefixed={false} />

<!-- Angular-only service (no platform prefix) -->
<ApiLink pkg="grids" type="ExcelExporterService" prefixed={false} />
```

---

## Package Keys

The `pkg=` attribute selects which API documentation root to use. The same key works for all platforms — the component resolves the correct URL per platform automatically.

| Key | React package | Angular package | WebComponents package | Blazor package |
|---|---|---|---|---|
| `"core"` | `igniteui-react` | `igniteui-angular` | `igniteui-webcomponents` | `IgniteUI.Blazor` |
| `"grids"` | `igniteui-react-grids` | `igniteui-angular` | `igniteui-webcomponents-grids` | `IgniteUI.Blazor` |
| `"charts"` | `igniteui-react-charts` | `igniteui-angular-charts` | `igniteui-webcomponents-charts` | `IgniteUI.Blazor` |
| `"gauges"` | `igniteui-react-gauges` | `igniteui-angular-gauges` | `igniteui-webcomponents-gauges` | `IgniteUI.Blazor` |
| `"maps"` | `igniteui-react-maps` | `igniteui-angular-maps` | `igniteui-webcomponents-maps` | `IgniteUI.Blazor` |
| `"inputs"` | `igniteui-react-inputs` | `igniteui-angular-inputs` | `igniteui-webcomponents-inputs` | `IgniteUI.Blazor` |
| `"layouts"` | `igniteui-react-layouts` | `igniteui-angular-layouts` | `igniteui-webcomponents-layouts` | `IgniteUI.Blazor` |
| `"excel"` | `igniteui-react-excel` | `igniteui-angular-excel` | `igniteui-webcomponents-excel` | `IgniteUI.Blazor.Documents.Excel` |

---

## Platform Prefixes

Each platform has a different class name prefix, applied automatically when `prefixed={true}` (the default):

| Platform | Prefix | Example resolved type |
|---|---|---|
| React | `Igr` | `IgrColumn` |
| Angular | `Igx` | `IgxColumn` |
| WebComponents | `Igc` | `IgcColumn` |
| Blazor | `Igb` | `IgbColumn` |

This means `<ApiLink pkg="grids" type="Column" member="sortable" />` resolves to `IgrColumn#sortable` for React, `IgxColumn#sortable` for Angular, and so on — all from a single MDX source line.

---

## API Documentation Source Data

Gitgub - https://github.com/IgniteUI/api-docs

The canonical source for determining which class owns a member is the `api-docs` project TypeDoc JSON files. The project lives in a sibling folder to this docs repository. The data files are organized by platform:

```
api-docs/src/data/
  react/
    igniteui-react-grids.json       ← grids package (Grid, Column, ColumnGroup, …)
    igniteui-react.json             ← core package (Toast, Calendar, …)
  angular/
    igniteui-angular-21.0.x.json   ← Angular grids + core
  web-components/
    igniteui-web-components-grids.json
    igniteui-web-components.json
  blazor/
    IgniteUI.Blazor.25.1.x.json
```

---

## `type=` Must Match Where the Member Is Defined

The most common error is pointing `type="{ComponentName}"` to a property that belongs to a **different class**. The component resolves the URL directly — if the member is not on that class in the API docs, the link will be broken.

### Where each kind of member lives

| Scenario | Correct `type=` |
|---|---|
| Grid-level property (`allowFiltering`, `rowEditable`, `clipboardOptions`, …) | `{ComponentName}` + `prefixed={false}` |
| Column property (`sortable`, `filterable`, `editable`, `dataType`, `pinned`, `resizable`, …) | `Column` |
| ColumnGroup-only property (`collapsible`, `expanded`, `collapsibleIndicatorTemplate`) | `ColumnGroup` |
| Property set on child columns (`visibleWhenCollapsed`) | `Column` |
| Row property (`pinned` in row context, `pin`, `unpin`) | `RowDirective` |
| Clipboard options (`enabled`, `copyHeaders`, `copyFormatters`, `separator`) | `ClipboardOptions` + `kind="interface"` |
| State persistence methods (`getState`, `applyState`, …) | `GridState` |
| Exporter options (`freezeHeaders`, `ignoreMultiColumnHeaders`) | `ExporterOptionsBase` |
| Pagination (`perPage`) | `Paginator` |
| Virtual scrolling state (`chunkSize`, `startIndex`) | `ForOfState` |
| Search options (`caseSensitive`, `exactMatch`) | `BaseSearchInfo` |
| Cell type properties (`editValue`) | `CellType` + `kind="interface"` |

### The `prefixed` prop — when to set it

The `prefixed` prop (default `true`) controls whether the platform class prefix (`Igr`/`Igx`/`Igc`/`Igb`) is automatically prepended to `type`.

**Keep default (`prefixed={true}`, or just omit it)** for all concrete short type names:
```mdx
<ApiLink pkg="grids" type="Column" member="sortable" />
<!-- resolves to IgrColumn (React), IgxColumn (Angular), etc. -->
```

**Set `prefixed={false}`** when:
- `type="{ComponentName}"` — the template variable already expands to the full prefixed name at build time
- The type name is already fully qualified (e.g. `"ExcelExporterService"` — Angular-only, no Igr prefix exists)
- The symbol genuinely has no platform prefix (standalone functions, certain enums)

```mdx
<ApiLink pkg="grids" type="{ComponentName}" prefixed={false} />
<ApiLink pkg="grids" type="ExcelExporterService" prefixed={false} />
```

---

### The `suffix` prop — non-component utility classes and excel library types

Some platforms append a suffix to UI component class names. For Angular, the `grids` package appends `Component` to all component classes: `IgxGrid` → `IgxGridComponent`, `IgxColumn` → `IgxColumnComponent`.

However, **utility and strategy classes do not carry this suffix**: `IgxStringFilteringOperand`, `IgxDefaultSortingStrategy`, `IgxSummaryOperand`, etc.

**For these classes, add `suffix={false}`** to prevent the incorrect suffix from being appended:

```mdx
<!-- Wrong — resolves to IgxStringFilteringOperandComponent (404) -->
<ApiLink pkg="grids" type="StringFilteringOperand" />

<!-- Correct — resolves to IgxStringFilteringOperand -->
<ApiLink pkg="grids" type="StringFilteringOperand" suffix={false} />
```

**Classes that need `suffix={false}`** (utility/non-component classes):
- All `*FilteringOperand` classes (`BooleanFilteringOperand`, `NumberFilteringOperand`, `StringFilteringOperand`, `DateFilteringOperand`, etc.)
- All `*SummaryOperand` classes (`SummaryOperand`, `NumberSummaryOperand`, `DateSummaryOperand`)
- Strategy classes (`DefaultSortingStrategy`, `NoopSortingStrategy`, `NoopFilteringStrategy`, `GridSortingStrategy`)
- **All excel library types** (`Workbook`, `Worksheet`, `WorksheetCell`, `WorksheetTable`, `Formula`, `DisplayOptions`, `SortSettings`, etc.) — these are utility classes with no platform prefix and no Component suffix
- Any class whose name does **not** end in a UI-component pattern

**Classes that keep the default `suffix={true}` / omit it** (UI component classes):
- `Column`, `ColumnGroup`, `Grid`, `TreeGrid`, `HierarchicalGrid`
- Any class that maps to a rendered UI component

> **Rule of thumb:** If the class represents something you place in a template (`<igx-column>`, `<igx-grid>`), it has the `Component` suffix. If it is a utility you instantiate in code (`StringFilteringOperand.instance()`), it does not.

---

## Always Set `kind=` to Match the TypeDoc Symbol Type

**This is required — the wrong `kind=` produces a broken URL.** The `kind=` attribute controls which URL segment is used (`/classes/`, `/interfaces/`, `/enums/`, `/types/`, etc.). The default is `"class"`, so you only need to set it explicitly for non-class types.

### How to find the kind

Check the TypeDoc JSON for the symbol's `kind` field:

| JSON `kind` value | MDX `kind=` attribute |
|---|---|
| `128` | `"class"` *(default, can be omitted)* |
| `256` | `"interface"` |
| `8` | `"enum"` |
| `4194304` | `"type"` |
| `64` | `"function"` |
| `32` | `"variable"` |

### Common examples by kind

```mdx
<!-- class (default) — kind= can be omitted -->
<ApiLink pkg="grids" type="Column" member="sortable" />
<ApiLink pkg="grids" type="GridState" member="getState" />

<!-- interface — must set kind="interface" -->
<ApiLink pkg="grids" type="ClipboardOptions" kind="interface" member="copyHeaders" />
<ApiLink pkg="grids" type="CellType" kind="interface" member="editValue" />
<ApiLink pkg="grids" type="RowType" kind="interface" member="validation" />

<!-- enum — must set kind="enum" -->
<ApiLink pkg="grids" type="GridSelectionMode" kind="enum" prefixed={false} />

<!-- type alias — must set kind="type" -->
<ApiLink pkg="grids" type="GridCellMergeMode" kind="type" prefixed={false} />
```

### Quick checklist before writing an ApiLink

1. **Find the symbol** in the TypeDoc JSON — check its `kind` value.
2. **Set `kind=`** if it is not `128` (class).
3. **Set `type=`** to the short unprefixed name that owns the member.
4. **Set `member=`** to the exact property/method name.
5. **Set `pkg=`** to the package the type belongs to.
6. **Keep or remove `prefixed={false}`** — remove it for concrete short names like `"Column"`; keep it for `{ComponentName}` or fully-qualified names.

---

## How to Add API Reference Entries

If a page references a type that is not yet in the `## API References` section, add an `<ApiLink>` for it. Use one `<ApiLink>` per type:

```mdx
## API References

<ApiLink pkg="grids" type="{ComponentName}" prefixed={false} />
<ApiLink pkg="grids" type="Column" />
<ApiLink pkg="grids" type="ColumnGroup" />
<ApiLink pkg="grids" kind="interface" type="ClipboardOptions" />
```

---

## Excel Library — Special Rules

Excel library types (`Workbook`, `Worksheet`, `WorksheetTable`, `WorksheetCell`, `Formula`, `DisplayOptions`, `SortSettings`, etc.) **never** carry a platform prefix or the `Component` suffix on any platform. Always use:

```mdx
<ApiLink pkg="excel" prefixed={false} type="WorksheetTable" />
<ApiLink pkg="excel" prefixed={false} type="Workbook" member="save" label="Save" />
```

The Blazor excel package is **separate** from the main `IgniteUI.Blazor` package:
- `pkg="excel"` → Blazor resolves to `IgniteUI.Blazor.Documents.Excel`
- URL: `https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor.Documents.Excel/25.1.x/classes/WorksheetTable`

---

## Dock Manager Slot Members

For dock-manager slot names (`closeButton`, `maximizeButton`, `minimizeButton`, `pinButton`, `unpinButton`, `paneHeaderCloseButton`, etc.), use `pkg="core"` with `type="DockManager"` and the slot name as `member`:

```mdx
<ApiLink pkg="core" type="DockManager" member="closeButton" label="closeButton" />
<ApiLink pkg="core" type="DockManager" member="splitterHandle" label="splitterHandle" />
```

---

## MDX Parse Error — JSX in Comments

JSX expressions like `{500}` inside `{/* */}` MDX block comments cause a parse error:
`Cannot read properties of undefined (reading 'start')`

Fix: change numeric JSX attributes to strings inside comments, and ensure the closing has a space:

```mdx
{/* Bad */}
{/* <Sample height={500} /> */}

{/* Good */}
{/* <Sample height="500" /> */}
```

---

## Source Files

- Component implementation: [`src/components/mdx/ApiLink.astro`](../../../../../../../src/components/mdx/ApiLink.astro)
- Platform configuration & URL resolution: [`src/lib/platform-context.ts`](../../../../../../../src/lib/platform-context.ts)
- API type data: see `api-docs/src/data/` in the companion `api-docs` project

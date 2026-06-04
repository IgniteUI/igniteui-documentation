# AI Agent Guide — Updating ApiLink in MDX Files

## Context

The MDX files in this folder are shared across four platforms: **Angular, React, WebComponents, Blazor**. The `<ApiLink>` component resolves to the correct platform-specific URL at build time from a single MDX source.

> **Key insight:** The `type=`, `member=`, `pkg=`, and `kind=` attributes are **identical for all platforms**. Fixing an ApiLink fixes it for all four platforms simultaneously. Only the generated URL differs per platform.

---

## Step 1 — Locate the API Source Data

The `api-docs` project (sibling to this docs repository) contains TypeDoc JSON files that are the **authoritative source** for which class owns which member. Find the project by its folder name `api-docs` — the exact path on disk depends on the machine.
Alternatively get the source from this github repository - https://github.com/IgniteUI/api-docs

### Data files by platform

```
api-docs/src/data/
  react/
    igniteui-react-grids.json          ← grids (Grid, Column, ColumnGroup, …)
    igniteui-react.json                ← core components
    igniteui-react-17.5.0.json
    igniteui-react-18.0.0.json
    igniteui-react-dockmanager.json
  angular/
    igniteui-angular-21.0.x.json       ← Angular grids + core (same package)
    igniteui-angular-9.0.x.json
    igniteui-angular-core.json
    igniteui-angular-inputs.json
    igniteui-angular-layouts.json
  web-components/
    igniteui-web-components-grids.json
    igniteui-web-components.json
    igniteui-webcomponents-charts.json
    igniteui-grid-lite.json
  blazor/
    IgniteUI.Blazor.25.1.x.json
    IgniteUI.Blazor.GridLite.25.1.x.json
```

> **Use the React grids JSON as your primary reference.** The class hierarchy and member names are consistent across all platforms. If a member is on `IgrColumn` in React, it is on `IgxColumn` in Angular and `IgcColumn` in WebComponents. The MDX `type=` uses the short unprefixed name (`Column`), so the same fix covers all platforms.

### JSON structure

Each JSON file is a TypeDoc reflection tree. Top-level `children` contains all exported symbols. Relevant `kind` values:

| kind value | Symbol type |
|---|---|
| `8` | Enum |
| `128` | Class |
| `256` | Interface |
| `4194304` | Type alias |

---

## Step 2 — Understand the MDX ApiLink Syntax

```mdx
<ApiLink pkg="grids" type="TypeName" kind="class" member="memberName" prefixed={false} label="DisplayText" />
```

| Attribute | Required | Notes |
|---|---|---|
| `pkg` | yes | Package key: `"grids"`, `"core"`, `"charts"`, etc. Same key for all platforms. |
| `type` | yes | Short type name **without** platform prefix. E.g. `"Column"`, not `"IgrColumn"`. |
| `kind` | **yes*** | Must match the TypeDoc symbol kind. Default is `"class"` — omit only for classes. **Always check and set this explicitly for non-class types.** |
| `member` | no | Property or method name for the anchor. |
| `prefixed` | no | Default `true` — adds `Igr`/`Igx`/`Igc`/`Igb` automatically. Set `false` when `type` contains `{ComponentName}` or the name is already fully-qualified. **Always `false` for excel types.** |
| `suffix` | no | Default `true` — appends `Component` suffix for Angular DV packages. Set `false` for utility classes (FilteringOperand, SortingStrategy, SummaryOperand, all excel types). |
| `label` | no | Override display text. |

### Platform prefix mapping

| Platform | Prefix | Example (type="Column") |
|---|---|---|
| React | `Igr` | links to `IgrColumn` |
| Angular | `Igx` | links to `IgxColumn` |
| WebComponents | `Igc` | links to `IgcColumn` |
| Blazor | `Igb` | links to `IgbColumn` |

---

## Step 3 — The Correct `type=` for Common Members

Most members appear under the same logical class across all platforms. The corrections below apply to all platforms.

### Grid-level members — `type="{ComponentName}" prefixed={false}`

These are on `IgrGridBaseDirective` / `IgrGrid` in React (equivalents in other platforms):

```
addRow, advancedFilteringExpressionsTree, allowAdvancedFiltering, allowFiltering,
batchEditing, beginAddRowById, beginAddRowByIndex, cellMergeMode, cellSelection,
clipboardOptions, closeAdvancedFilteringDialog, columnSelection, columnWidth,
deleteRow, deselectAllRows, disableSummaries, enableSummaries,
excelStyleHeaderIconTemplate, filterMode, filterStrategy, filteringExpressionsTree,
findNext, height, lastSearchInfo, mergeStrategy, moving, openAdvancedFilteringDialog,
pinRow, pinning, primaryKey, rowClasses, rowDraggable, rowEditable, rowHeight,
rowSelection, rowStyles, selectAllRows, selectedRows, showSummaryOnCollapse,
sort, sortStrategy, sortingExpressions, summaryCalculationMode, summaryPosition,
summaryRowHeight, toolbar, totalItemCount, unpinRow, updateCell, updateRow, width
```

### Column members — `type="Column"` (drop `prefixed={false}`)

On `IgrColumn` in React / `IgxColumn` in Angular / `IgcColumn` in WebComponents / `IgbColumn` in Blazor:

```
cellClasses, cellStyles, colEnd, colStart, dataType, disableHiding, disablePinning,
editable, filterable, filteringIgnoreCase, formatter, groupable, hasSummary,
header, hidden, maxWidth, minWidth, pinned, pipeArgs, resizable,
rowEnd, rowStart, searchable, selectable, sortable, sortingIgnoreCase,
summaryFormatter, visibleWhenCollapsed
```

### ColumnGroup-only members — `type="ColumnGroup"` (drop `prefixed={false}`)

Only on `IgrColumnGroup` (not `IgrColumn`):

```
collapsible, collapsibleIndicatorTemplate, expanded
```

### Row members — `type="RowDirective"` (drop `prefixed={false}`)

When the prose refers to a **row object** (not a column):

```
pinned, pin, unpin, data, index, key, delete, update, inEditMode, expanded
```

> **Context matters:** `pinned` is on **both** `IgrColumn` and `IgrRowDirective`. Read the surrounding sentence — "column pinning" → `type="Column"`, "row pinning … the Row" → `type="RowDirective"`.

### Special types

| Member(s) | `type=` | `kind=` | Notes |
|---|---|---|---|
| `enabled`, `copyHeaders`, `copyFormatters`, `separator` | `ClipboardOptions` | `"interface"` | Clipboard options interface |
| `editValue` | `CellType` | `"interface"` | Cell in edit mode |
| `validation` | `CellType` or `RowType` | `"interface"` | Read context to decide |
| `getState`, `applyState`, `getStateAsString`, `applyStateFromString` | `GridState` | `"class"` | State persistence component |
| `freezeHeaders`, `ignoreMultiColumnHeaders` | `ExporterOptionsBase` | `"class"` | Exporter options |
| `perPage` | `Paginator` | `"class"` | Pagination component |
| `chunkSize`, `startIndex` | `ForOfState` | `"class"` | Virtual scrolling state |
| `caseSensitive`, `exactMatch` | `BaseSearchInfo` | `"class"` | Search API parameters |
| `insertAtIndex` in column pin event | `PinColumnEventArgsDetail` | `"class"` | Pin order change event arg |
| `insertAtIndex` in row pin event | `PinRowEventArgsDetail` | `"class"` | Row pin order change event arg |

---

## Step 4 — Always Verify and Set `kind=`

The `kind=` attribute maps directly to the URL segment (`/classes/`, `/interfaces/`, `/enums/`, `/types/`). The wrong `kind=` produces a **404**. The default is `"class"` — only omit `kind=` when you are certain the type is a class.

### How to determine `kind` from the TypeDoc JSON

Check the `kind` field on the top-level symbol in the JSON:

| JSON `kind` value | MDX `kind=` |
|---|---|
| `128` | `"class"` _(default — can be omitted)_ |
| `256` | `"interface"` — **must set explicitly** |
| `8` | `"enum"` — **must set explicitly** |
| `4194304` | `"type"` — **must set explicitly** |
| `64` | `"function"` — **must set explicitly** |
| `32` | `"variable"` — **must set explicitly** |

### Examples by kind

```mdx
<!-- kind=128 (Class) — omit kind= -->
<ApiLink pkg="grids" type="Column" member="sortable" />
<ApiLink pkg="grids" type="GridState" member="getState" />

<!-- kind=256 (Interface) — must add kind="interface" -->
<ApiLink pkg="grids" type="ClipboardOptions" kind="interface" member="copyHeaders" />
<ApiLink pkg="grids" type="CellType" kind="interface" member="editValue" />
<ApiLink pkg="grids" type="RowType" kind="interface" />

<!-- kind=8 (Enum) — must add kind="enum" -->
<ApiLink pkg="grids" type="GridSelectionMode" kind="enum" prefixed={false} />

<!-- kind=4194304 (Type alias) — must add kind="type" -->
<ApiLink pkg="grids" type="GridCellMergeMode" kind="type" prefixed={false} />
```

### Agent rule: check `kind` before writing every ApiLink

Before writing or fixing any `<ApiLink>`:
1. Look up the symbol in the TypeDoc JSON.
2. Check its `kind` value.
3. If `kind != 128`, set `kind=` explicitly.
4. Never assume `"class"` without verifying.

---

## Step 5 — The `prefixed` Rule

The `prefixed` prop (default `true`) controls whether the platform class prefix (`Igr`/`Igx`/`Igc`/`Igb`) is prepended to `type` automatically.

**Keep `prefixed={false}`** when:
- `type="{ComponentName}"` — the template variable already expands to the full prefixed class name at build time (e.g. `IgrGrid`)
- The type name is already fully qualified with a prefix (e.g. `"ExcelExporterService"` — Angular-only service)
- The symbol genuinely has no platform prefix (standalone functions, certain enums used as literals)
- **All excel library types** — `Workbook`, `Worksheet`, `WorksheetTable`, etc. never have a platform prefix

**Remove `prefixed={false}` (use the default)** when:
- You change `type` from `"{ComponentName}"` to a concrete short name like `"Column"`, `"ColumnGroup"`, `"GridState"`, etc.
- The prefix will be added automatically: `Column` → `IgrColumn` (React), `IgxColumn` (Angular), `IgcColumn` (WebComponents), `IgbColumn` (Blazor)

### Examples

```mdx
<!-- {ComponentName} template variable — keep prefixed={false} -->
<ApiLink pkg="grids" type="{ComponentName}" member="rowEditable" prefixed={false} />

<!-- Concrete short name — omit prefixed (default true) -->
<ApiLink pkg="grids" type="Column" member="sortable" />
<ApiLink pkg="grids" type="ColumnGroup" member="collapsible" />
<ApiLink pkg="grids" type="GridState" member="getState" />

<!-- Angular-only service — no prefix exists for React/WC/Blazor, keep prefixed={false} -->
<ApiLink pkg="grids" type="ExcelExporterService" prefixed={false} />

<!-- Excel library — always prefixed={false} -->
<ApiLink pkg="excel" prefixed={false} type="WorksheetTable" />
<ApiLink pkg="excel" prefixed={false} type="Workbook" />
```

---

## Step 5b — The `suffix` Rule (Angular Utility Classes)

Angular's `grids` package appends `Component` to all **UI component** class names in the TypeDoc URL:
`IgxGrid` → `IgxGridComponent`, `IgxColumn` → `IgxColumnComponent`.

**Utility and strategy classes do NOT carry this suffix** and will produce a 404 if the suffix is appended.

### Add `suffix={false}` for utility / non-component classes

```mdx
<!-- Wrong — Angular resolves to IgxStringFilteringOperandComponent (404) -->
<ApiLink pkg="grids" type="StringFilteringOperand" />

<!-- Correct — resolves to IgxStringFilteringOperand -->
<ApiLink pkg="grids" type="StringFilteringOperand" suffix={false} />
```

### Classes that NEED `suffix={false}`

- All `*FilteringOperand` classes: `BooleanFilteringOperand`, `NumberFilteringOperand`, `StringFilteringOperand`, `DateFilteringOperand`, `DateTimeFilteringOperand`, `TimeFilteringOperand`
- All `*SummaryOperand` classes: `SummaryOperand`, `NumberSummaryOperand`, `DateSummaryOperand`
- Strategy classes: `DefaultSortingStrategy`, `NoopSortingStrategy`, `NoopFilteringStrategy`, `GridSortingStrategy`
- Any class that is instantiated in code (not placed in a template)

### Classes that keep the default (`suffix` omitted or `true`)

- UI component classes: `Column`, `ColumnGroup`, `Grid`, `TreeGrid`, `HierarchicalGrid`
- Any class that maps to a rendered element (`<igx-column>`, `<igx-grid>`, etc.)

### Rule of thumb

> If you call it in code like `StringFilteringOperand.instance()` → needs `suffix={false}`.  
> If you put it in a template like `<igx-column>` → keep the default.

---

## Step 6 — Angular-Only Members

Some members exist only in Angular and have no equivalent in React/WebComponents/Blazor. These are typically:
- Angular template directives (`cellEditor`, `cellEditorExit`, `rowEdit`, `rowEditEnter`, etc. — Angular uses event binding syntax `(rowEdit)`)
- Angular services (`ExcelExporterService`, `PdfExporterService`)
- Angular reactive forms integration (`formGroupCreated`, `markAsTouched`)

For these, keep `type="{ComponentName}"` with `prefixed={false}`. The React JSON will not have them (they appear as `onRowEdit`, `onCellEdit`, etc. in React). This is expected — **do not treat "NOT IN JSON" as an error** for these cases.

React renames all events with an `on` prefix: `rowEdit` → `onRowEdit`, `columnPin` → `onColumnPin`, `contextMenu` → `onContextMenu`, etc.

---

## Step 7 — Excel Library Types

Excel library types (`Workbook`, `Worksheet`, `WorksheetTable`, `WorksheetCell`, `Formula`, `DisplayOptions`, `SortSettings`, etc.) are utility classes — they carry **no platform prefix** and **no `Component` suffix** on any platform.

**Always** use `prefixed={false}` for `pkg="excel"`:

```mdx
<ApiLink pkg="excel" prefixed={false} type="WorksheetTable" />
<ApiLink pkg="excel" prefixed={false} type="Workbook" />
<ApiLink pkg="excel" prefixed={false} type="SortSettings" />
```

The Blazor excel package is **not** the main `IgniteUI.Blazor` package — it is `IgniteUI.Blazor.Documents.Excel`. This is already configured in `platform-context.ts`. Do not change it to `IgniteUI.Blazor`.

### `platform-context.ts` excel entry (Blazor — correct)

```typescript
excel: {
  docRoot: 'https://staging.infragistics.com/blazor-apis-new/blazor/IgniteUI.Blazor.Documents.Excel/25.1.x',
  packageId: 'IgniteUI.Blazor.Documents.Excel',
  noPackagePrefix: true,
  preserveCase: true,
  pascalCaseMembers: true
}
```

Do **not** add `classSuffix: 'Component'` to the `excel` entry for any platform.

---

## Step 7b — Dock Manager Slot Members

Dock manager slot names are members of the `DockManager` class, in `pkg="core"`:

```mdx
<ApiLink pkg="core" type="DockManager" member="closeButton" label="closeButton" />
<ApiLink pkg="core" type="DockManager" member="maximizeButton" label="maximizeButton" />
<ApiLink pkg="core" type="DockManager" member="minimizeButton" label="minimizeButton" />
<ApiLink pkg="core" type="DockManager" member="pinButton" label="pinButton" />
<ApiLink pkg="core" type="DockManager" member="unpinButton" label="unpinButton" />
<ApiLink pkg="core" type="DockManager" member="paneHeaderCloseButton" label="paneHeaderCloseButton" />
<ApiLink pkg="core" type="DockManager" member="tabHeaderCloseButton" label="tabHeaderCloseButton" />
<ApiLink pkg="core" type="DockManager" member="moreTabsButton" label="moreTabsButton" />
<ApiLink pkg="core" type="DockManager" member="moreOptionsButton" label="moreOptionsButton" />
<ApiLink pkg="core" type="DockManager" member="splitterHandle" label="splitterHandle" />
```

WC API reference: `https://staging.infragistics.com/wc-apis-new/wc/igniteui-dockmanager/latest/classes/IgcDockManagerComponent/`

---

## Step 7c — MDX Parse Error: JSX in Comments

JSX expressions (`{500}`, `{true}`) inside `{/* */}` MDX comments cause:
`Cannot read properties of undefined (reading 'start')`

Fix: replace JSX numeric props with string values inside comments:

```mdx
{/* Bad */}
{/* <Sample src="/foo" height={500} />*/}

{/* Good */}
{/* <Sample src="/foo" height="500" /> */}
```

---

## Step 8 — Fix Pattern

### Column-level fix

Before:

```mdx
<ApiLink pkg="grids" type="{ComponentName}" member="sortable" prefixed={false} />
```

After:

```mdx
<ApiLink pkg="grids" type="Column" member="sortable" />
```

### Interface fix

Before:

```mdx
<ApiLink pkg="grids" type="{ComponentName}" member="enabled" prefixed={false} />
```

After:

```mdx
<ApiLink pkg="grids" type="ClipboardOptions" kind="interface" member="enabled" />
```

### Wrong class fix

Before:

```mdx
<ApiLink pkg="grids" type="{ComponentName}" member="getState" prefixed={false} />
```

After:

```mdx
<ApiLink pkg="grids" type="GridState" member="getState" />
```

---

## Step 9 — Adding API Reference Entries

If a page references a type not yet in `## API References`, add individual `<ApiLink>` tags — one per type:

```mdx
## API References

<ApiLink pkg="grids" type="{ComponentName}" prefixed={false} />
<ApiLink pkg="grids" type="Column" />
<ApiLink pkg="grids" type="ColumnGroup" />
<ApiLink pkg="grids" kind="interface" type="ClipboardOptions" />
```

Rules:
- One `<ApiLink>` per type — no arrays
- Use `prefixed={false}` only for `{ComponentName}` or fully-qualified names

## Key Files

| File | Role |
|---|---|
| `src/components/mdx/ApiLink.astro` | ApiLink component — URL generation logic |
| `src/lib/platform-context.ts` | Platform config, `docRoot` URLs per platform, prefix mapping |
| `api-docs/src/data/react/igniteui-react-grids.json` | TypeDoc JSON — React grids (primary reference) |
| `api-docs/src/data/react/igniteui-react.json` | TypeDoc JSON — React core |
| `api-docs/src/data/angular/igniteui-angular-21.0.x.json` | TypeDoc JSON — Angular |
| `api-docs/src/data/web-components/igniteui-web-components-grids.json` | TypeDoc JSON — WebComponents grids |
| `api-docs/src/data/blazor/IgniteUI.Blazor.25.1.x.json` | TypeDoc JSON — Blazor |

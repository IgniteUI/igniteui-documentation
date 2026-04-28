---
name: api-link
description: "Reference guide for adding and fixing ApiLink and ApiRef components in MDX documentation files. Covers all platforms: Angular, React, WebComponents, Blazor (TypeDoc URLs) and jQuery (jQueryApiUrl). Covers pkg, type, kind, member, section, prefixed, suffix, and label props; platform prefix mapping (Igr/Igx/Igc/Igb); kind values from TypeDoc JSON; utility class suffix rules; excel library special rules; dock manager slot members; jQuery widget/class URL patterns; and MDX parse error from JSX in comments. Use when an agent needs to add, fix, or audit ApiLink/ApiRef calls in MDX files."
user-invocable: true
---

# AI Agent Guide — Updating ApiLink & ApiRef in MDX Files

## Context

The `<ApiLink>` and `<ApiRef>` components resolve to the correct platform-specific API URL at build time.

- **Angular, React, WebComponents, Blazor** (`docs/angular`, `docs/xplat`) — TypeDoc URLs, resolved from hardcoded `docRoot` values in `platform-context.ts` (host swapped per environment: `staging.infragistics.com` for staging, `www.infragistics.com` for production). Steps 1–9 below apply to all four of these platforms.
- **jQuery** (`docs/jquery`) — URL resolved from `jQueryApiUrl` in `environment.json` at build time. Different URL structure — see the **jQuery API Links** section below.

**Shared MDX files** (`docs/xplat`) are built for all four TypeDoc platforms from a single source. Fixing an `<ApiLink>` there fixes it for Angular, React, WebComponents, and Blazor simultaneously.

**Angular-specific MDX files** (`docs/angular`) are built only for Angular. The same `<ApiLink>` props, `pkg` keys, and `kind` rules from Steps 1–9 apply — the only difference is that there is no multi-platform concern.

---

## Step 1 — Locate the API Source Data (xplat platforms)

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

## Step 2 — Understand the MDX ApiLink Syntax (xplat)

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
| `128` | `"class"` *(default — can be omitted)* |
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

## jQuery API Links

jQuery docs live in `docs/jquery/` and use a completely different URL structure from the TypeDoc platforms.

### How it works

The jQuery build resolves `ApiLink` URLs from `jQueryApiUrl` in `docs/jquery/src/content/en/environment.json`:

| Build mode | `jQueryApiUrl` |
|---|---|
| development | `https://www.infragistics.com/products/ignite-ui/docs/api/js` |
| staging | `https://staging.infragistics.com/products/ignite-ui/docs/api/js` |
| production | `https://www.infragistics.com/products/ignite-ui/docs/api/js` |

Platform is identified via `docs/jquery/.platform.json` (`"platform": "jQuery"`). The build reads this file, resolves to the `jQuery` platform context, and `ApiLink.astro` uses `getEnvVars().jQueryApiUrl` as the base URL.

### jQuery URL structure

```
{jQueryApiUrl}/{namespace}.{widgetName}[#{section}:{member}]
```

- **`namespace`**: `ui` for jQuery UI widgets (default), `ig` for standalone classes/datasources
- **`widgetName`**: the widget or class name as-is (e.g. `igCombo`, `igGrid`, `igBulletGraph`, `OlapXmlaDataSource`)
- **`section`**: `options`, `events`, or `methods` — only used when `member` is present
- **`member`**: the specific option/event/method name

### jQuery `<ApiLink>` props

| Attribute | Notes |
|---|---|
| `type` | Widget or class name as it appears in the jQuery API URL (e.g. `"igCombo"`, `"igBulletGraph"`, `"OlapXmlaDataSource"`). No platform prefix — jQuery has none. |
| `pkg` | `"core"` (default) → `ui.` namespace. `"ig"` → `ig.` namespace. |
| `section` | `"options"` \| `"events"` \| `"methods"`. Required when `member` is set for the anchor to be appended. |
| `member` | The option, event, or method name. Combined with `section` to produce `#section:member`. |
| `label` | Override display text. Recommended — defaults to `type.member` which may not match the original link text. |
| `kind`, `prefixed`, `suffix` | Not applicable for jQuery. Ignored. |

### Examples

```mdx
import ApiLink from 'docs-template/components/mdx/ApiLink.astro';

<!-- Link to a widget page -->
<ApiLink type="igCombo" label="igCombo" />
<!-- → https://www.infragistics.com/products/ignite-ui/docs/api/js/ui.igCombo -->

<!-- Widget option -->
<ApiLink type="igCombo" member="itemTemplate" section="options" label="itemTemplate" />
<!-- → …/ui.igCombo#options:itemTemplate -->

<!-- Widget event -->
<ApiLink type="igCombo" member="activeItemChanged" section="events" label="activeItemChanged" />
<!-- → …/ui.igCombo#events:activeItemChanged -->

<!-- Widget method -->
<ApiLink type="igGrid" member="dataBind" section="methods" label="dataBind" />
<!-- → …/ui.igGrid#methods:dataBind -->

<!-- ig. namespace class (datasource, non-widget) -->
<ApiLink pkg="ig" type="OlapXmlaDataSource" label="OlapXmlaDataSource" />
<!-- → …/ig.OlapXmlaDataSource -->
```

### Replacing `{environment:jQueryApiUrl}` tokens

Old raw link in MDX:
```mdx
[`itemTemplate`]({environment:jQueryApiUrl}/ui.igcombo#options:itemTemplate)
```

Replacement with `<ApiLink>`:
```mdx
<ApiLink type="igCombo" member="itemTemplate" section="options" label="itemTemplate" />
```

Note: the old raw URLs often use all-lowercase widget names (e.g. `ui.igcombo`). The jQuery API site accepts both, but use the camelCase form in `ApiLink` `type=` for consistency (e.g. `"igCombo"` not `"igcombo"`).

### Configuration files

| File | Role |
|---|---|
| `docs/jquery/.platform.json` | Identifies the jQuery platform (`"platform": "jQuery"`) so `getPlatformContext()` returns the jQuery context |
| `docs/jquery/src/content/en/environment.json` | Contains `jQueryApiUrl` per build mode (development / staging / production) |
| `src/lib/platform-context.ts` | `jQuery` entry in `PLATFORMS` — `prefix: ''`, `apiPackages.core` (ui. namespace), `apiPackages.ig` (ig. namespace) |
| `src/components/mdx/ApiLink.astro` | jQuery branch: reads `getEnvVars().jQueryApiUrl`, builds `{baseUrl}/{ns}.{type}[#{section}:{member}]` |

---

## Step 8 — Fix Pattern (xplat)

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

## Step 9 — Adding ApiRef Entries

If a page references a type not yet in `## API References`, add an `<ApiRef>`. Use one call per unique `kind` + `pkg` combination:

```mdx
## API References

<ApiRef pkg="grids" types={["{ComponentName}"]} prefixed={false} />
<ApiRef pkg="grids" types={["Column", "ColumnGroup"]} />
<ApiRef pkg="grids" kind="interface" types={["ClipboardOptions"]} />
```

Rules:
- All `types` in one `<ApiRef>` call must share the same `pkg` and `kind`
- Use `prefixed={false}` only for `{ComponentName}` or fully-qualified names

## Key Files

| File | Role |
|---|---|
| `src/components/mdx/ApiLink.astro` | ApiLink component — URL generation logic (xplat TypeDoc + jQuery) |
| `src/components/mdx/ApiRef.astro` | ApiRef component |
| `src/lib/platform-context.ts` | Platform config, `docRoot` URLs per platform, prefix mapping, jQuery placeholder packages |
| `docs/jquery/.platform.json` | jQuery platform identifier |
| `docs/jquery/src/content/en/environment.json` | jQuery environment URLs including `jQueryApiUrl` |
| `api-docs/src/data/react/igniteui-react-grids.json` | TypeDoc JSON — React grids (primary reference) |
| `api-docs/src/data/react/igniteui-react.json` | TypeDoc JSON — React core |
| `api-docs/src/data/angular/igniteui-angular-21.0.x.json` | TypeDoc JSON — Angular |
| `api-docs/src/data/web-components/igniteui-web-components-grids.json` | TypeDoc JSON — WebComponents grids |
| `api-docs/src/data/blazor/IgniteUI.Blazor.25.1.x.json` | TypeDoc JSON — Blazor |

## Related Skills

- [`xplat-docs-platform-block`](../xplat-docs-platform-block/SKILL.md) — PlatformBlock usage and audit guide

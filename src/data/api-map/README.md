# apiMap — canonical ↔ platform API name mapping

Product-build-generated maps from the canonical (XAML) API surface to each
platform's public names, for both types and members.

**These files are vendored here because the originating repo
(`IgniteUI/igniteui-xplat-docs`) is archived.** This directory is now the source
of truth for the mapping. They are read-only inputs — regenerate from a product
build rather than hand-editing.

## Shape

```jsonc
{
  "types": [{
    "originalName": "PropertyEditor",                        // canonical (XAML)
    "originalNamespace": "Infragistics.Controls.Description",
    "packageName": "igniteui-core",
    "names":   [{ "platform": "WebComponents", "mappedName": "IgcPropertyEditor" }],
    "members": [{ "originalName": "ActualProperties",
                  "names": [{ "platform": "WebComponents",
                              "mappedName": "actualDataSource", "mappedType": "…" }] }]
  }]
}
```

`platform` covers `Angular`, `React`, `WebComponents`, `Blazor`. There are **no
WinUI or Uno entries** — for those platforms the canonical `originalName` is the
name, with the caveat below.

## Why it matters

The mapping encodes renames that no prefix or casing rule can recover —
`ItemsSource` → `dataSource`, `HighlightedItemsSource` → `highlightedDataSource`,
`XAxis` → `barFragmentXAxis`. There are 7,418 such non-casing member renames.

Consumers:

| Consumer | Use |
|---|---|
| [`docs/xplat/scripts/lib/api-map-names.mjs`](../../../docs/xplat/scripts/lib/api-map-names.mjs) | resolves a platform name to its canonical form; apiMap authoritative, fuzzy fallback |
| [`docs/xplat/scripts/check-api-map-accuracy.mjs`](../../../docs/xplat/scripts/check-api-map-accuracy.mjs) | regression test proving apiMap resolution only improves accuracy |
| [`docs/xplat/scripts/resolve-api-links.mjs`](../../../docs/xplat/scripts/resolve-api-links.mjs) | one-shot authoring tool converting backticked names to `<ApiLink>` |

## Caveats

- **`originalName` is legacy-XAML canonical, not always the shipping WinUI
  name.** The map says `XamRadialGaugeRange` / `XamLinearGraphRange` where WinUI
  actually has `RadialGaugeRange` / `LinearGraphRange` (verified against
  `winui-samples`). Do not treat it as authoritative for WinUI *type* names;
  member names are reliable.
- **A dotted canonical is a path, not a name.** `shapeStyle.strokeThickness`
  means the web platforms flattened a nested object. XAML keeps the flattened
  property, so the fuzzy form is correct in those cases.
- **Type-name mappings are inconsistent.** `IgrDataGrid` maps to canonical
  `Grid`, while `IgcDataGrid` has no entry. Prefer taking XAML element names from
  the real samples over deriving them here.

See [WINUI-UNO-PLAN.md](../../../WINUI-UNO-PLAN.md) §6.3–§6.4 for the full
resolution design.

# apiMap — canonical ↔ platform API name mapping

Product-build-generated maps from the canonical (XAML) API surface to each
platform's public names, for both types and members.

**These files are vendored here because the originating repo
(`IgniteUI/igniteui-xplat-docs`) is archived.** This directory is now the source
of truth for the mapping. They are read-only inputs — regenerate from a product
build rather than hand-editing.

## Layout

One directory per platform, holding the maps for that platform. The web maps come from the
TypeScript translators; `WinUI/` and `Uno/` come from the ApiGenerator, which now writes a map
wherever it runs. `WPF/` is sparse: those projects are legacy non-SDK and cannot be loaded on macOS,
so their maps need a Windows or CI run.

`Shared/` is not a platform. The loader reads every directory here and keys forward answers by the
`platform` field on each name, so a file whose entries name several platforms belongs somewhere that
does not claim to be one of them.

## Overrides

A file ending `.apiMap.overrides.json` carries the same schema and is read after the maps, so what it
declares sits on top of them. Two things need it:

- **API suppressed from generation and then exposed by hand.** A generator maps what it generated, so
  a member carrying `[TSSuppressWidgetMember]` is absent even though the package ships it —
  `ShapefileRecord.Points` is in every web package as `points` and in no generated map.
- **A canonical surface altered by `#if` or a partial class**, for a component the ApiGenerator does
  not run for. The canonical name is the TINYCLR one, and the platform's spelling is recorded as a
  rename off it.

Say in the entry's `_comment` where the hand-written exposure actually lives. That is the only
evidence the name is real, and an entry whose name later starts generating normally should be deleted
rather than left to contradict the map.

See [API-TERMS.md](../../../docs/xplat/API-TERMS.md) for how these are read.

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
| [`docs/xplat/scripts/resolve-api-links.mjs`](../../../docs/xplat/scripts/resolve-api-links.mjs) | one-shot authoring tool converting names in backticks to `<ApiLink>` |

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

See `dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/notes/WINUI-UNO-PLAN.md` §6.3–§6.4 for the full
resolution design.

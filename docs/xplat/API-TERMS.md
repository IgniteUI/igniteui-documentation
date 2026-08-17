# API terms in prose

A backticked API name in a topic is written once, canonically, and comes out as the name the
reader's own platform uses. `` `MarkerTypes` `` reaches a Blazor reader as `MarkerTypes`, a
WebComponents reader as `markerTypes`, and each is linked to its own API reference.

Before this, each platform's spelling was written out by hand inside a `PlatformBlock`. That is the
same duplication json-snippets removed from code blocks, with the same result: the copies drifted, and
nothing could tell a drifted name from a correct one.

The check is the point. A term that resolves to nothing is reported and the build says so, which is
how a typo gets caught — there is no other way to catch one, because a misspelled name in prose looks
exactly like a name for a platform you did not build.

## Every topic declares a mode

`apiTerms` is required in the frontmatter. There is no default, so the decision is made per document
rather than inherited by a topic nobody thought about:

| mode | what happens | for |
|---|---|---|
| `full` | looked up in the api maps; unresolvable terms are reported | the xplat topics — anything whose API the generator describes |
| `passthrough` | resolved by rule instead of by map, still linked | a component no generator describes |
| `none` | the code span is left exactly as written, and no `ApiLink` is emitted | topics that are not about a mapped API at all |

`full` and `passthrough` both emit an `ApiLink`. `none` does not — a page that opted out is saying
these are not API names, so linking them would be wrong rather than merely unchecked.

A component can be put in passthrough on its own, in `src/data/api-map/passthrough.json`, so the rest
of a mixed page is still checked. DataChart is deliberately *not* listed there: it falls back to
passthrough where no map answers, rather than declaring itself unchecked.

## How a term resolves

In order, stopping at the first answer:

1. **The canonical name, exact case.** Checked first, so writing the canonical always settles a
   question — which is what makes every rule below safe to have.
2. **Reverse from a platform spelling.** The platform affixes (`Xam`, `Igc`, `Igr`, `Igb`, `Igx`) and
   the `Component` / `Description` suffixes are tried in reverse, so a topic may write `DataChart`
   rather than `XamDataChart` and still resolve. `XamDataChart` in prose is accurate and unpleasant to
   read; both work.
3. **Scoped to a type the page named**, walking up the base chain — `markerTypes` is declared on
   `XYChart`, not on the `CategoryChart` the page is about.
4. **Unscoped**, across every map.

### Which type the page is talking about

Three ways, most specific first:

- **Qualified.** `` `SeriesViewer.CheckmarkMarkerTemplate` `` says it outright. The head is resolved
  as a type first; if it is not one, the dot is part of the name.
- **Implicit context.** The types the prose has already named — in backticks or in an
  `<ApiLink type=…>` — nearest first. `mentionedTypes` is not required, and a topic that reads well
  usually names its subject before it names a property of it.
- **`mentionedTypes`** in the frontmatter, as the fallback.

Take care listing an enum in `mentionedTypes` when a property shares its name. `TrendLineType` is both
an enum and the property on every chart that has trendlines; listing the enum on a page whose prose
means the property makes the term reach two different canonical names.

## When a term should not resolve

Escape it with a leading backslash: `` `\index.ts` ``. The escape says "this is not an API name",
which is a claim worth writing down — an unescaped term that resolves to nothing is a typo until
someone says otherwise.

For a name that exists on one platform only, a `PlatformBlock` is better than an escape: it is real
API, so it should be linked where it exists and absent where it does not.

## Overrides, for API the maps cannot describe

A generator writes a map of what it generated. Something suppressed from generation and then exposed
by hand is missing from the map even though the package ships it, so a real name is indistinguishable
from a typo. `*.apiMap.overrides.json` fills that gap, using the same schema as a map — one entry
gives the forward answer for each platform and the reverse answer for each spelling.

- `src/data/api-map/Shared/HandExposed.apiMap.overrides.json` — API suppressed then hand-exposed on
  every platform, such as `ShapefileRecord.Points`.
- `src/data/api-map/WPF/DataChart.XAML.wpf.apiMap.overrides.json` — WPF renames for components the
  ApiGenerator does not run for, where `#if` or a partial class altered the canonical surface.

The loader reads every directory under the api-map root and keys forward answers by the `platform`
field on each name, so the folder a file sits in is organisation rather than scope.

Record where the hand-written exposure lives in the entry's `_comment`. That note is the only evidence
the name is real, and the entry should be deleted rather than left to rot if the name is ever
generated normally.

## Reading the report

`generate.mjs` prints what it could not resolve at the end of a run:

```
[generate] 4 backticked terms (6 uses) matched no apiMap on any platform:
[generate]        2  Points
```

and separately what reached more than one canonical name. Both should be empty. If a term is
genuinely not an API name, escape it; if it is, it needs a map, an override, or a `PlatformBlock`.

## Related

- [API-LINKS-README.md](API-LINKS-README.md) — the `ApiLink` component itself
- [src/data/api-map/README.md](../../src/data/api-map/README.md) — the maps and where they come from
- [scripts/README.md](scripts/README.md) — the checks

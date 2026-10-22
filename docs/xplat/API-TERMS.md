# API terms in prose

An API name in backticks is written once, canonically, and comes out as the name the
reader's own platform uses. `` `MarkerTypes` `` reaches a Blazor reader as `MarkerTypes`, a
WebComponents reader as `markerTypes`, and each is linked to its own API reference.

Before this, each platform's spelling was written out by hand inside a `PlatformBlock`. That is the
same duplication json-snippets removed from code blocks, with the same result: the copies drifted, and
nothing could tell a drifted name from a correct one.

The check is the point. A term that resolves to nothing is reported and the build says so, which is
how a typo gets caught — there is no other way to catch one, because a misspelled name in prose looks
exactly like a name for a platform you did not build.

## Every topic declares its population, and the mode follows

`platformType` is required in the frontmatter. There is no default, so the decision is made per
document rather than inherited by a topic nobody thought about:

> **Temporarily suspended for `web-only`.** While the JSON snippets work merges, the web-only pages
> carry no `platformType`, so they stay identical to the web documentation and their owners have no
> edits from it to review. The build treats a page without one as `web-only`. Do not add
> `platformType: web-only` to a page in the meantime; xplat pages still state theirs.

| population | what it is | `apiTerms` it implies |
|---|---|---|
| `xplat` | the cross-platform (DV) set — anything whose API the generator describes | `full` |
| `xplat-unmapped` | the same set, where the full treatment cannot be applied yet | `passthrough` |
| `web-only` | published for the web platforms and no further | `none` |

A page states `apiTerms` only to differ from what its population implies, which is rare: 578 pages
stated what their population already says, and now none do.

| mode | what happens | for |
|---|---|---|
| `full` | resolved through the product's description metadata and the api-docs index; an unresolvable term fails the build | every xplat topic |
| `passthrough` | resolved by rule instead of by lookup, still linked | a component no generator describes |
| `none` | the code span is left exactly as written, and no `ApiLink` is emitted | topics that are not about a mapped API at all |

`full` and `passthrough` both emit an `ApiLink`. `none` does not — a page that opted out is saying
these are not API names, so linking them would be wrong rather than merely unchecked.

**An xplat page may not declare `none`.** That is opting out of the treatment that makes it xplat, and
`check-doc-scope.mjs` fails on it. A page that genuinely cannot resolve its names is
`xplat-unmapped` — its own population rather than an exception to this one. Two things sit there
today: the Excel library, whose API no generator describes, and the data grid's accessibility topic,
which documents ARIA on DOM elements while the XAML platforms have UI Automation, so what it should
say there is not yet decided.

**Strict-xplat source must author API terms in backticks.** Do not hand-author `<ApiLink>` in a page
whose frontmatter says `platformType: xplat`; generation emits the component after it resolves the
canonical term for the target platform. `check-doc-scope.mjs` fails on a raw call. The narrow escape
for a link that genuinely cannot be represented as a term is `<ApiLink raw ... />`; `raw` is an
explicit review marker, not an alternative house style. If a name should remain code but cannot be
resolved, use the normal backtick escape instead, for example `` `\defineComponents` ``.

**Identity is not publication.** Which platforms a page reaches is the toc's business, and the two are
allowed to disagree — the accessibility topic is an xplat doc that reaches no desktop platform at all.
`check-doc-scope.mjs` reports a disagreement rather than failing it, because a disagreement is a
decision to confirm rather than a defect to fix.

## How a term resolves

`docs/xplat/scripts/lib/description-terms.mjs` does it, from two sources. The product's description
metadata (TypeDescriptionContext) says what a term *is* — a type, a property and its per-platform
names, an event, an enum and its values — and what each platform calls it. The platform's api-docs
index says the name really exists there, and how that platform spells it. Nothing is guessed: a term
neither can answer is an error, reported with the page, and the build fails.

What an author can write:

| term | means |
|---|---|
| `` `Type` `` | a description type or an enum, by its description name (`DataChart`) |
| `` `Member` `` | a member of the type in context: the nearest type named before it on the page, then the page's `mentionedTypes` |
| `` `Type.Member` `` | the same, with the owner stated; the label keeps the qualifier |
| `` `m:Name` ``, `` `m:Type.Name` `` | a method; the descriptions do not describe methods, so the term says what it is and the index confirms it |
| `` `EventScript` `` | Blazor's synchronous variant of an event; the suffix is dropped elsewhere |
| `` `A/B/C` `` | a group some platforms collapse into one member; the parts resolve separately |

A type renders as the platform's class name — `IgxBulletGraphComponent` on Angular, `XamBulletGraph`
on WinUI — and a qualified member renders with that class name as its owner. A bare member keeps a
short label.

Take care listing an enum in `mentionedTypes` when a property shares its name. `TrendLineType` is both
an enum and the property on every chart that has trendlines; on a page whose prose means the property,
write `` `Series.TrendLineType` `` or name the chart first.

## When a term should not resolve

Escape it with a leading backslash: `` `\index.ts` ``. The escape says "this is not an API name",
which is a claim worth writing down — an unescaped term that resolves to nothing is a typo until
someone says otherwise.

For a name that exists on one platform only, a `PlatformBlock` is better than an escape: it is real
API, so it should be linked where it exists and absent where it does not.

## Reading the report

`generate.mjs` reports every term it could not resolve, grouped by cause, and fails the run:

- **does not map to the description API** — the term names nothing the product describes. Fix the
  page (context, qualifier, escape, `PlatformBlock`) or the description metadata.
- **maps, but missing from the api-docs index** — the term is described, but this platform's index
  lacks the name: the index is behind, or the platform does not have it.

An error that has to wait, because the index predates the API it names, goes in
`src/data/api-terms-acknowledged.json` with the reason and what clears it. It is then printed as a
warning each time it occurs instead of failing the run, and an acknowledgement that no longer matches
anything is reported so it can be deleted.

## Related

- [`xplat-docs-api-links`](../../.github/skills/xplat-docs-api-links/SKILL.md) — the `ApiLink`
  component itself, and the authoring rules for it
- [scripts/lib/description-terms.mjs](scripts/lib/description-terms.mjs) — the resolution itself
- [scripts/README.md](scripts/README.md) — the checks

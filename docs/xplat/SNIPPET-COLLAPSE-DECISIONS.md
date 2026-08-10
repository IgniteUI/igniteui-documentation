# Snippet collapse decisions

When a topic's hand written per-platform snippets are replaced by one `json-snippet` block, the
generated markup usually matches what the topic showed before. Where it does not, the difference is
deliberate, and this file is why.

Read it when a comparison run reports a topic that no longer matches the published documentation.
An entry here means the run is right and the old page was wrong. A difference with no entry here is
a regression in the transform.

Trivial collapses are not listed. A collapse is trivial when every platform already showed the same
thing and the JSON reproduces it; there is nothing to remember. Listed below is everything else.

## Standing policies

These apply to every topic, not just the ones named below.

### XAML snippets are not evidence

The XAML blocks in the documentation have never been exercised — nothing compiles or runs them, so
nothing has ever caught them being wrong. Where XAML disagrees with the web platforms, the web
platforms win, and the XAML block is overwritten with the group's decision. No XAML value is
preserved on the strength of being different.

This is not a guess about which is likelier to be right. It is that one side has been checked and
the other has not.

### Prose beats sample, sample beats a platform

A number the topic states in its text is visible to the reader and is what the snippet has to show.
Below that, the running sample decides, because it is the thing that actually executes. A value that
only one platform's block carries decides nothing.

### Whitespace and colour spelling are set by the build, not by the topic

Three differences are not per-topic decisions and will show up in every collapsed topic at once:

- **Attribute indentation.** Only React's emitter indented an element's attributes under its tag;
  Angular, Web Components and Blazor left them at the tag's own indent, and XAML had the option but
  it was off. `indentAttributes` was added for the markup platforms and is on for the documentation
  build, so all five now match how the topics have always been written.
- **Colour notation.** Each emitter picked its own, so the same `#bddcfc` came out as
  `rgba(189, 220, 252, 1)` on Web Components and `#bddcfc` on Blazor. The build now pins
  `colorNotation: hex` and `pascalCaseColorNames`, giving a colour name where one exists —
  `DodgerBlue` — and hex otherwise.
- **Numeric delimiting.** Angular writes numbers undelimited, React braces them, the rest quote
  them. Set per platform in the build rather than repeated in every snippet.

None of these change what a snippet means. They are listed because a diff that shows every line of
every snippet moving is otherwise alarming.

### A sample is a source, not an authority

A section may be illustrating something the peered sample does not cover. Where the platforms agree
with each other and disagree with the sample, the agreement is the stronger signal: pin to the
sample and overlay the snippet's values, rather than restate the whole thing inline. Overlaying also
narrows the gap for later work, since the overlaid names are then present on both sides.

## geo-map-shape-styling

### Required Imports is generated, and lists more than it used to

The section is worked out from the example itself: the components it uses, plus the types its
styling handler brings, which are two separate regions —
`channel="bindingImports,handlersImports"`.

It lists more than the hand written version did, and more correctly. The page named
`IgxGeographicShapeSeries` where the class is `IgxGeographicShapeSeriesComponent`, and omitted
`IgxGeographicMapComponent` entirely; both are now there, and the two `igniteui-angular-core`
imports are one statement.

Getting there needed two things that were missing rather than broken:

- `ShapeFileOnViewInit` and `ShapeFileStyling` held content for Blazor and WinUI only, so the
  handler emitted nothing on the web platforms. Both now have a `Web.ts`, written in the `Igc`
  dialect the other 195 items use.
- `TransformHandlerCode` was compiled out of this build, so a handler kept the Web Components type
  names whatever platform was asked for. See the renderer commit; it is fixed.

### The three styling sections are still by hand

Shape Random, Scale and Range Styling each construct a helper from `ShapeStylingUtility` — a class
the neighbouring topic teaches — and wire it to `styleShape`. The library's `ShapeFileStyling` does
something else entirely, colouring by continent, so there is nothing to point at. They would need
three new library items plus the utility itself, which is a larger piece of authoring than a
collapse.

Note for anyone reading the commit history: an earlier message said `handlersImports` was not among
the regions a recording zone can cover. That was wrong twice over — the region captures correctly,
and the real obstacles were the two above.

## The spreadsheet topics are not collapsible yet

`Spreadsheet` has no description type. It is not among the 1190 definitions the schema is generated
from, and there are no spreadsheet sample JSONs in the examples repository — the directory does not
exist, so the samples those pages show are authored some other way. Without a description the
renderer has nothing to emit from, so this is a limit of what is described rather than a judgement
about the pages.

That accounts for `spreadsheet-configuring`, `spreadsheet-overview`, `spreadsheet-commands` and the
smaller spreadsheet pages — roughly 50 blocks. They become collapsible the day the component is
described, and nothing else needs to change for that.

The same check turns up two other kinds of root that are not components and never will be:

- **data classes** — `WorldCity`, `SampleDataType`, `List` — a page defining the shape of its data
- **page scaffolding** — `div`, `html`, `script` — the wrapper a sample sits in

## chart-performance

Three sections collapsed, and each needed the array form — a snippet body that is a list of
definitions rather than one. These are the only topics in the set where two components stand side by
side because the point is the comparison, and neither is a child of the other.

### The imperative form became declarative

Chart Markers and Chart Resolution showed property assignments on a chart the reader is assumed to
already have:

```ts
this.Chart.markerTypes.clear();
this.Chart.markerTypes.add(MarkerType.None);
```

They now show the same properties on the components themselves, which is how the rest of the
documentation states them, and which the two comments in the original were already describing — "on
CategoryChart or FinancialChart", then "on LineSeries of DataChart" — so the array has one entry for
each.

Worth knowing that this changes what the section demonstrates: setting a property at runtime to fix
a slow chart, rather than declaring it. The properties and values are the same either way.

Two faults in the originals go with it: the Angular, React and Web Components blocks wrote
`this.Chart.Resolution` with a capital R, which is not the property on those platforms, and the
Blazor block set `this.Chart.Resolution = 10;` twice.

### What is left in this topic

- **Data Structure** shows two whole data classes, one recommended and one not. There is no component
  in it; it is advice about how to shape data, and a description says what a component is.
- **Data Filtering** and the guideline sections are prose with no snippet to collapse.

## geo-map imagery topics

`display-osm-imagery` and `display-esri-imagery` each carried a bare map in markup and, for every
platform, a code block constructing the imagery object and assigning it to `backgroundContent`.
Seven blocks and eleven blocks respectively, saying one thing.

`backgroundContent` is an ordinary described property whose value is another description, so the
whole thing is one JSON with the imagery nested inside the map. The generated markup nests the
imagery element declaratively and needs no code at all — check-snippet-code-channels.mjs confirms
neither snippet produces a line of binding code on any platform, which is what makes dropping the
companion code blocks safe rather than merely tidier.

Expect the shape to change: the page taught "construct the imagery and assign it in code" and now
shows it nested in the markup. Both do what the prose says — set `backgroundContent` to the imagery
object — and the nested form is what the running sample does.

### What is left in these topics, and why

- **`display-bing-imagery`** is not collapsed. Its code block resolves the imagery URI from
  `window.location`, rewriting `http:` to `https:` to match the hosting page. That is a runtime
  workaround rather than configuration, and no description can express it. The declarative half —
  `apiKey` and `imageryStyle` — could be collapsed on its own, but that would leave the page setting
  the same two properties in two places.
- **The Esri Utility section** is not collapsed. It shows `EsriUtility.getUri(EsriStyle.WorldOceansMap)`,
  a helper class the topic is teaching. There is no component being described there, only a call.

## linear-gauge

The cleanest of the three gauges: six of the nine sections matched their own sample outright. XAML
again carries the hero sample's values throughout — `NeedleShape="Needle"` where every web platform
says `Custom`, `#79797a` where they say `DodgerBlue` — and again loses.

### Highlight Needle — value taken from the sample, needle brush kept

The topic ran `value=70` against the sample's 50, and the prose states no number, so the sample
decides and it is now 50 — which also puts it in step with every other section in the topic.

The topic additionally sets `needleBrush="Blue"`, which the sample does not. It is kept: the section
exists to show a second needle, and colouring the main one is what makes the two distinguishable.
Every web platform sets it.

### Tick Marks — value kept at 50

`/gauges/linear-gauge/tickmarks` runs `value=10`; every platform's snippet and every neighbouring
section runs 50. Platform agreement outweighs the sample, and 10 would make this one section
inexplicably different from the rest of the page.

### Summary — constructed as a union

As with the other two gauges, rebuilt as the union of the sections above it rather than the separate
configuration the published page carried. It now includes the highlight needle properties the
published Summary omitted.

## radial-gauge

The same shape as bullet-graph, including the same cause: every XAML block carries the values of the
hero `animation` sample — `MinimumValue=0, MaximumValue=50, Value=25, Interval=5`, scale angles
120/60, `BackingShape="Circular"`, `#d6d6d6` — rather than each section's own. Expect every XAML
block in this topic to differ from the published page.

Eight of the ten sections collapsed to their own sample. The rest:

### Tick Marks — sample pinned, snippet extents kept

As in bullet-graph, the platforms agree with each other and disagree with `/gauges/radial-gauge/tickmarks`
on the extents: the topic writes `tickStartExtent 0.45, tickEndExtent 0.575, minorTickStartExtent
0.575, minorTickEndExtent 0.5` against the sample's `0.5 / 0.57 / 0.57 / 0.52`. Platforms agreeing
outweighs the sample, so the sample is the source and those four are kept.

### Ranges — the topic's own ranges kept

`/gauges/radial-gauge/ranges` runs two ranges in olive and orange with `value=80`; the topic shows
three in red, yellow and green with `value=50`, which is what a section teaching ranges wants. All
the web platforms agree on the topic's version, so it stands, with the sample recorded as the source.

### Labels and Titles — maximumValue converged to 80

The section alone ran `maximumValue=100` where every other section in the topic, and the sample,
run 80. Nothing in the prose depends on it, so it is now 80 like its neighbours.

### Summary — constructed as a union

The published Summary was, again, not the union it claims to be: its own palette (`#c6c6c6`,
`Black`, `#ededed`, `Gray`), its own two ranges at 20–40 and 40–60, and `value=70`. Rebuilt as the
union of the sections above it, taking the earlier section's value where two conflict — `value=50`,
`maximumValue=80`.

As in bullet-graph, the union now contains the Title & Subtitle and Highlight Needle properties the
published Summary omitted. They are among the snippets it says it combines, but they do change what
the reader sees.

## chart-annotations

### Paired against samples the page does not show

Every snippet in this topic is a `CategoryChart`, while the three samples the page embeds are
`DataChart`. The samples the snippets were actually written from — `annotations-final-value` and
`annotations-custom` under `charts/category-chart` — are never mentioned on the page. The XAML
binding to `TemperatureAnnotatedData` is what gives it away: that is `annotations-custom`'s own
`dataSourceRef`.

Collapsed against those two. The embedded `<Sample>` tags are left as they are; whether the page
should show a CategoryChart sample next to CategoryChart snippets is a content question, not a
collapse decision.

### Callout member paths pointed at nothing

The snippets set `calloutsXMemberPath="index"`, `calloutsYMemberPath="value"` and
`calloutsLabelMemberPath="info"`. The running sample uses `Index`, `Temperature` and `TempInfo`,
and `value` and `info` are not fields of the data at all, so two of the three named nothing.
Taken from the sample.

### `calloutsAllowedPositions` was being dropped by the emitter

The prose documents it and the sample sets it, but no platform's snippet showed it, because an enum
collection was emitted only for XAML. It is declared
`Collection:string:CalloutPlacementPositionsCollection:CalloutPlacementPositions`, and a Collection
fell through to sub properties — child elements — which a list of enum values has no representation
as, so it was silently dropped everywhere the emitter did not have to set it in code.
`includedProperties` escaped only because it happens to be declared `Array:string` instead. Fixed in
the renderer; the property is now in the snippet.

### One thing deliberately left

- **The Web Components `ts` block is still hand written.** It sets the data sources in code, which
  is that platform's idiom, and the collapse only covers markup. It now restates member paths the
  generated markup also carries, which is exactly the drift this work exists to remove, so it
  should come from the same JSON through the code channel.

### The XAML callout snippet was in the wrong place

It sat after the Timeline Styling section rather than with the callout markup it duplicates, which
is why the group looked like a separate snippet. Folded into the callout snippet.

## bullet-graph

Six of the nine groups collapsed trivially once XAML was overwritten (Usage, Comparative Measures,
Comparative Ranges, Labels, Backing, Scale). The three below did not.

### Every XAML block was authored from the wrong sample

Not drift. The XAML snippets throughout this topic carry the values of the hero `animation` sample
rather than each section's own sample, in all six sections that have one:

| section | XAML showed | its own sample | `animation` |
| --- | --- | --- | --- |
| Comparative Measures | `Max=120, Value=70, ValueBrush=black, ValueOuterExtent=0.7` | 100 / 50 / dodgerblue / 0.65 | 120 / 70 / #000000 / 0.7 |
| Highlight Value | `Max=120, LabelExtent=0.02` | 100 / 0.025 | 120 / 0.02 |
| Comparative Ranges | ranges 0–40, 40–80, 80–120, extents 0.2 | 0–40, 40–70, 70–100, extents 0.075 | 0–40, 40–80, 80–120, extents 0.2 |
| Tick Marks | `TickEndExtent=0.05, MinorTickCount=5` | 0.05 / 4 | 0.05 / 5 |
| Backing | `#f7f7f7, #d1d1d1, thickness 0` | #bddcfc, dodgerblue, 4 | #f7f7f7, #d1d1d1, 0 |
| Scale | `#dbdbdb, gray, thickness 0` | dodgerblue, darkviolet, 2 | #dbdbdb, gray, 0 |

Expect every XAML block in this topic to differ from the published page. All of it is intended.

### Highlight Value — the snippet now matches the prose

The section reads "a good example is if **value** is 50 and **highlightValue** is set to 25. This
would represent a performance of 50%". Every platform's block, and the peered
`/gauges/bullet-graph/highlight-needle` sample, ran `value=70`, which is 36% and does not illustrate
the sentence above it.

Collapsed to the sample with `value` overridden to 50, so the page shows what it says it shows.

The XAML block additionally set `HighlightValueDisplayMode="Overlay"` and never set
`HighlightValue` at all, so it demonstrated nothing. Gone with the rest of the XAML.

Expect: `value` 70 → 50 on all five platforms.

### Tick Marks — sample pinned, snippet values overlaid

The only group where no platform matched its sample. The four web platforms agreed with each other
and disagreed with `/gauges/bullet-graph/tickmarks` on four extents, and set a `targetValue` the
sample does not have:

| | documentation | sample |
| --- | --- | --- |
| `tickStartExtent` | 0.2 | 0.25 |
| `tickEndExtent` | 0.075 | 0.05 |
| `minorTickStartExtent` | 0.2 | 0.15 |
| `minorTickEndExtent` | 0.1 | 0.05 |
| `targetValue` | 90 | absent |

Four platforms agreeing outweighs the sample, so the sample is pinned and these five are overlaid.
`targetValue` in particular is carried over deliberately: the sample not having it is what made this
group hard to match, and overlaying it means the name is present on both sides next time.

Expect: no change on the web platforms. XAML changes.

### Summary — constructed as a union

The published Summary was not the union it claims to be. It ran its own palette — `Black`, `Gray`,
`#cecece` where the sections use `DodgerBlue`, `LimeGreen`, `DarkViolet` and `#bddcfc` — and its own
ranges (20–40, 40–60, 60–90 at extents 0.25/0.9, against the sections' 0–40, 40–70, 70–100 at
0.075/0.95). It was a third confabulation rather than a combination of the snippets above it.

Rebuilt as the actual union of groups 2–8. Two conflicts had to be resolved, both in favour of the
earlier section, which is also what the published Summary did: `value` is 50 rather than the 70 the
tick, label, backing and scale sections use, and `targetValue` is 80 rather than 90.

One addition to flag: the union includes `highlightValueDisplayMode` and `highlightValue` from the
Highlight Value section, which the published Summary omitted. It is one of the snippets above, so a
union contains it, but it does change how the value bar renders.


The section says "all above code snippets are combined into one code block below". It is by
definition the union of the sections above it and no single sample backs it, so it is written inline
rather than pinned. Built from the collapsed form of groups 2–8, which means it inherits the two
decisions above: `value=50` from Highlight Value, and the overlaid tick extents.

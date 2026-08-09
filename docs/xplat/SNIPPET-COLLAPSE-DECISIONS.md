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

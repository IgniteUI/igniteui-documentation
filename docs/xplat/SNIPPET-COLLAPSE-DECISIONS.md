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

### Never turn an imperative block into markup

A section the platforms taught in code keeps teaching it in code. This is not a matter of taste:

- A value being set imperatively may be a signal that the imperative path is the only one that
  works.
- On React and Blazor a declared value can be reapplied when the component re-renders, so markup can
  actively undo what the reader is trying to do. The two forms are not interchangeable.

Going the other way — declarative teaching emitted as code — is safe by comparison, but still
undesirable where the declarative form would have done, so it is not a free move either.

A definition stays declarative regardless, because that is what a sample has to be to run. Forcing
code behind is what turns it into the imperative block the topic showed, and that is why the
mechanism exists.

Five sections had been collapsed the wrong way. `geo-map-navigation`'s Window Coordinates,
`geo-map-binding-multiple-shapes`' Map Background, and the code snippet sections of
`geo-map-type-scatter-contour-series` and `-area-series` are fixed and now force code behind. The two
imagery topics needed a product fix first and are collapsed correctly now; see below.

`scripts/audit-imperative.py` compares every collapsed section against what it replaced and reports
any where a web platform's block was code and the fence now emits markup.

### The imagery topics needed a metadata fix first

`geo-map-display-osm-imagery` and `-esri-imagery` were collapsed wrongly, put back, and collapsed
again once the product side was fixed. All three web platforms taught the same thing — a bare map in
markup, and the imagery built and assigned in code:

```ts
const tileSource = new IgcOpenStreetMapImagery();
geoMap.backgroundContent = tileSource;
```

The first collapse printed the imagery as a child element instead, which changed imperative teaching
into declarative. Both pages now carry two fences: the map, with `"$backgroundContent":
"-doc:markup"` so the imagery stays out of it, and a `channel="code"` fence marking
`"$backgroundContent": "+doc:code"`, which prints the imagery being constructed and assigned. That is
what every platform showed.

**A correction to an earlier version of this note.** It claimed those nested elements were not
registered and so could not work. That was wrong — `igc-open-street-map-imagery` and its siblings are
registered, each by its own module, and the library resolves child elements through its own
`TypeRegistrar` rather than the browser's custom element registry. Nesting is a legitimate form. The
collapse was wrong for one reason, not two: it changed what the page taught.

### The component suffix was wrong on nine types

Emitting the code fence at all needed a fix in the product. The renderer named the class
`IgcOpenStreetMapImageryComponent`, which does not exist — the package exports
`IgcOpenStreetMapImagery`, registered under that name by `IgcOpenStreetMapImageryModule`. The scales
were right, `IgcValueBrushScaleComponent` really does carry the suffix, so this was per-type knowledge
that was missing.

`GetItemTypeHelper` appends the platform's component suffix unless the description metadata carries
`__skipSuffix`, and that is written only for types marked `[JsonAPISkipSuffix]`. The wrapper's real
name is decided elsewhere, in `TSExportResolver`, which adds the suffix only for types carrying
`XamWrapper` for TS. These nine are exported without it but carried no attribute, so the two
disagreed — and the renderer has a `//TODO: need to detect if suffix is required here.` at the spot.

`[JsonAPISkipSuffix]` is now on `AzureMapsImagery`, `ArcGISOnlineMapImagery`, `BingMapsMapImagery`,
`OpenStreetMapImagery`, `TileGeneratorMapImagery`, `GeographicMapImagery`, `CustomMapImagery`,
`HeatTileGenerator` and `ShapefileConverter` — the last being what `ShapeDataSource` is called before
the platform rename.

Regenerating the descriptions is a build of `Infragistics.jQuery.sln`, or of the specific JS project,
followed by copying the `JsonAPI` output into `Description/Generated`. Two of those files carry
mutations that are deliberately not taken: `HeatTileGenerator` regenerates
`public override string Type` as `public virtual string Type`, and `DashboardTileModule` has its own.
`HeatTileGenerator` was therefore edited by hand to add the one metadata line and keep `override`;
everything else was copied, and each copy differs from what it replaced by that line alone.

### The Esri sample stored a style name where a URI belongs

`display-esri-imagery.json` set `mapServerUri` to `"WorldOceansMap"`, which is the name of a style
rather than an address. The running Web Components sample resolves those names through its own
`EsriUtility`, so the sample was only ever half ported. The three descriptions now hold the URIs that
utility resolves to, which is what the collapsed code fence prints.

The page's "Esri Utility" section stays hand written. It is the source of a helper class the reader
writes, in the same category as the WorldUtils resource pages, not a component to describe.

### What the imperative audit is expected to flag

Several of the audit's reports are expected, and it is worth knowing which, so that a real one is not
lost among them:

- **Data loading and framework scaffolding.** `binding-data-csv`, `binding-data-json-points`,
  `binding-shp-file` and the shape series topics showed `connectedCallback`, `componentDidMount` and
  `@Component` blocks that fetch data. That is not component configuration, and the collapsed pages
  load the same data from a handler item.
- **Bindings that cannot be attributes.** `chart-annotations`' Callout Layer shows Web Components
  assigning `calloutsDataSource` in script because an object cannot go in an attribute. The emitter
  already writes that as the companion code fence.
- **`binding-multiple-sources`' Summary**, discussed under that topic below.

A report outside those categories means a section's teaching changed, which is not allowed.

### Saying a property is set in code, and that it is not bound

Two sidecars, both naming properties against the platforms they apply to:

```json
"$setInCode":    { "backgroundContent": ["angular", "react", "webComponents"] },
"$assignInCode": { "backgroundContent": ["angular", "react", "webComponents"] }
```

`$setInCode` says the property is set in code rather than written into the markup, which is what the
description metadata already says for properties that can never be markup — a data source on Web
Components, for one. This says it for one element, for the cases the metadata does not cover.

`$assignInCode` is the stronger form: assigned in code, **and not bound**. Needed because setting a
property in code does not mean the same thing everywhere. On Web Components it is an assignment, but
on Angular it is a template binding — `[backgroundContent]="osmImagery"` — which is still
declarative, and reapplied whenever the framework re-renders. A topic that assigned the property
imperatively cannot be reproduced by a binding.

Both are per property, and that is not a detail. Tried first as one build wide style, it turned nine
pages' Angular bindings into assignments, `[dataSource]="salesData"` among them, on pages that taught
the binding. The same element commonly has one property that wants assigning and others that should
keep binding.

They belong on the element whose property they name. `tileImagery` is a property of the tile series,
so the sidecar goes there, not on the map above it.

### Where the value comes from, and why it is safe

`directAssignment` is a style option: a property holding an element is built where it is assigned, two
statements, rather than as a lazily constructed backing field. The field is the sounder habit and on
Angular and React the necessary one; the documentation blocks did the former, so the option exists and
the documentation build turns it on.

Referring to a local means dropping the `this.`, and that is only safe where a local exists. Four
things make it so, none of them inferred by reading emitted text:

- `SupportsDirectAssignment(property)` on the emitter: the reference lands in the same scope as the
  construction. Web Components and Blazor markup always; Angular only for a property marked
  `$assignInCode`, because until it stops binding its reference is a template expression that reads a
  member. Default false, so a platform nobody has considered keeps the field.
- `DeclaresRootAsLocal` on the emitter that builds the value: it names its root `var name = new T()`.
- A shadowing local — `var osmImagery = this.osmImagery;` — written when the value ended up as a
  field anyway, so the reference still resolves. The emitter already does this for elements
  themselves.
- The flag is set by the conversion that built the local, not by "this property holds an element". The
  first attempt used the latter and turned `scatterLineSeries1.xAxis = this.xAxis` into `= xAxis` on
  chart-markers, dropping a real field qualification.

### Regions, and what goes between them

A fence can ask for several regions, and the delimiter says what separates them:

```
channel="bindingImports...bindingFields,bindingInit,bindingCode"
```

`,` joins two regions directly and `...` puts the platform's own comment ellipsis between them, which
is what the hand written blocks did — they were excerpts from different parts of a file, not one run
of statements. A region this platform writes nothing to drops out and takes its delimiter with it, so
a block never opens or ends on a stray mark. `codeBehind` is a preset for the common spelling.

### Three emitter fixes these needed

- **A nested element's construction was recorded into the markup.** Converting a property that holds
  an element builds it with its own emitter into a buffer, and while that ran the parent's markup zone
  was still open, so the construction was captured inside an opening tag. The recorder now takes a
  pushed context for the nested build — rather than simply not recording, so that markers inside the
  converted element still work.
- **Sidecars did not reach nested elements.** The nested path handed over only the markers, and gated
  the comment on markers being present, so an element carrying only a comment or only a
  `$setInCode` got nothing. Each sidecar is now passed on its own account.
- **Blank lines inside converted blocks.** Separators written for properties that then emitted
  nothing. Constructing one object is a run of statements, so they go.

### A sidecar can splay by platform

Where the platforms genuinely taught different mechanics, one definition says so:

```json
"$type": { "blazor": "+doc:code", "default": "+doc:markup" }
```

Which is how `charts/features/chart-overlays` now emits a factory method for Blazor, as its page
always did, and markup everywhere else. Before this existed the choice was to overwrite one
platform's teaching, which the rule above does not allow.

- Any sidecar takes the form, and it nests: each platform's entry is a marker or a list of them.
- The platform names are the ones `$styleOptions` already uses — `angular`, `react`,
  `webComponents`, `blazor`, `winUI`, `uno`, `wpf` — matched without regard to case, with `default`
  covering the rest. A name outside that set is a schema error rather than a marker that quietly
  applies nowhere.
- Resolution is in the renderer, beside the style options, so anything using the emitter gets it —
  including the runtime render pass, which is not a documentation build.
- The fallback to `default` is worked out one sidecar at a time, so an element can splay two of them
  where one names this platform and the other only names a default.
- A fence whose definition splays channels asks for `channel="auto"`, since it can no longer name
  one: it takes whichever channel this platform's marker chose, and labels the block with that
  language.

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

  React was left out of that at first, on the grounds that it indented already. It does, but the
  option carries a second meaning: it leaves the opening tag's line unterminated so that each
  attribute ends the line before it, which is what lets an excluded attribute take its line break
  with it. Without it, a snippet that printed only some of an element's attributes began with a
  blank line, and an element with no attributes put its `>` on a line of its own. React asks for it
  now. Turning it on also exposed that the flag was read in code behind, where there is no open line
  to close, leaving a blank line between an element's declaration and its first property on all three
  indenting platforms; the renderer now tracks whether a tag line is actually open.
- **Colour notation.** Each emitter picked its own, so the same `#bddcfc` came out as
  `rgba(189, 220, 252, 1)` on Web Components and `#bddcfc` on Blazor. The build now pins
  `colorNotation: hex` and `pascalCaseColorNames`, giving a colour name where one exists —
  `DodgerBlue` — and hex otherwise.
- **Numeric delimiting.** Angular writes numbers undelimited, React braces them, the rest quote
  them. Set per platform in the build rather than repeated in every snippet.

None of these change what a snippet means. They are listed because a diff that shows every line of
every snippet moving is otherwise alarming.

### The emitter is loaded from a working copy, for now

`generate.mjs` resolves the snippet emitter from the local `dev-tools` build, and `XPLAT_EXAMPLES`
points at a working copy of the examples repository. That is deliberate while the renderer and the
library are still being changed — a collapse often needs a fix on both sides in the same step.

Once the renderer work is published this has to become an ordinary package import, with the library
read from the published examples package rather than a path on someone's disk. Until then no other
machine can reproduce a generation run, so treat the generated output as unverifiable anywhere but
here.

### A sample is a source, not an authority

A section may be illustrating something the peered sample does not cover. Where the platforms agree
with each other and disagree with the sample, the agreement is the stronger signal: pin to the
sample and overlay the snippet's values, rather than restate the whole thing inline. Overlaying also
narrows the gap for later work, since the overlaid names are then present on both sides.

### A snippet is a whole sample that shows part of itself

A topic showing one element is still backed by a complete, runnable definition; what varies is how
much of it is printed. The definition holds the whole chart, and the element the section is about
carries `"$type": "+doc:markup"` so only that element reaches the page. Writing the element on its
own instead would print the same block, but the definition could not be run — and the intent is a
later pass that renders every snippet through the ComponentRenderer and captures screenshots, which
only works if each one stands up on its own.

Two snippets had been written as bare fragments and are now full definitions: the marker reset in
`charts/features/chart-markers` and the overlay text styling in `charts/features/chart-overlays`.
An audit against every type that roots a sample anywhere in the examples repository found no others.

Two things had to change for this to work:

- `emitChannel` marked the root, which includes everything beneath it, so a definition that marked
  part of itself got printed whole. The root is now left alone when the definition carries its own
  markers.
- A definition that marks part of itself produces two snippets — the whole sample and the part — and
  the markup path asked for the whole one. It now takes the part.

A fragment also hid a real bug behind a plausible-looking block. `LineSeries` in the marker reset
had `xMemberPath`/`yMemberPath` copied from the scatter section above it; a `LineSeries` is a
category series and takes `valueMemberPath`. Rootless, it validated; in a chart, the schema caught
it. It reads `valueMemberPath` against a `CategoryXAxis` now.

### chart-overlays: Blazor taught this one in code, and no longer does

The three original blocks disagreed about more than spelling. Web Components and XAML declared the
layer in markup; Blazor showed a `public Series StylingOverlayText()` factory that built one, set
nine styling properties and returned it. That is the one case so far where the platforms taught
different mechanics for the same section, so the rule about not changing the teaching cannot be
satisfied for all three at once.

Neither one wins now. The definition splays its marker by platform, so Blazor emits the layer built
in code and the other four emit it declared in markup, which is what each page always showed. That
mechanism did not exist when this section was first collapsed; markup was chosen for everyone, and
the note here used to argue for it. The properties are a union of the sample, the web markup and the
styling the Blazor block set.

Where the two disagreed on values, the exercised markup was taken: `overlayTextHorizontalMargin` 0
and `overlayTextVerticalMargin` 20, not the 5 and 5 the Blazor block used. The sample supplies
`targetAxisRef`, which none of the three blocks mentioned.

## geo-map-display-heat-imagery

### The heat tiles are built by a handler

The sample was a bare map, with everything interesting in per-platform code, so the port added
`MapDisplayHeatImageryOnViewInit`: it fetches `UsaCitiesPopulation.csv`, reads latitude, longitude and
population into three parallel arrays, builds the `HeatTileGenerator` from them, wraps it in a
`TileGeneratorMapImagery` and adds the tile series. That is what the running Web Components sample
does, and the page's three code blocks were the same thing spelled three ways.

Web platforms only, and `Web.ts` only: this page has never carried a Blazor or XAML block, so the
fences exclude them rather than inventing content for them.

### The web worker stays hand written

The generator can hand its work to a worker, which the page teaches in its own section, and that
wiring is not portable: `new Worker("../heatworker.worker", { type: "module" })` on one bundler is an
imported worker constructor on another, and each platform's block shows a different worker file. The
handler sets everything else and says in a comment where the worker went. Nothing is lost from the
page — the section that teaches it is still there, and it is the only place it was ever explained.

### A heading was reaching only one platform

Not a collapse decision, but found while doing it: the Web Components block from the Web Worker
section was closed *after* the `## Dependencies` heading, so that heading sat inside it and only Web
Components readers ever saw it. Fixed in both languages.

A sweep for the same shape finds 798 headings inside platform blocks across the documentation, but
that count means little — a section that genuinely applies to one platform is written exactly that
way. This one was accidental because the section it titles has blocks for all three platforms
beneath it.

## geo-map-binding-data-model

### The sample was backported, as a handler

No sample existed here either. The port added `samples/maps/geo-map/binding-data-model.json` — a
bare map with one `onViewInit` item, `MapBindingDataModelOnViewInit` — generated by
`code-gen-tools/backport-flight-routes.py` from the same two upstream repositories as
`binding-multiple-sources`.

It has to be a handler rather than a description. The sample draws seven flights as fourteen series,
a polyline for each route and a symbol series for its two cities, each pair in the flight's own
colour. Fourteen series built from seven rows is not something a description states, and it is how
every platform's sample teaches it, so the handler keeps the teaching as it was.

Series order is the Web Components sample's: route first, then its cities, so the markers draw on
top of the line. The Blazor sample adds them the other way round.

### The geodesic maths sits in its own item, and the fence asks for one of the two

`WorldUtils` already exists in the `WorldFlights` item, and this handler cannot reach it there: the
web side's sibling import only resolves when a sample references both items, and this sample binds no
data source at all.

So the maths is a second item, `MapGeodesicsOnViewInit`, which the sample lists first. Every item in
an init list contributes its members to the same component, so the series building calls the helpers
without importing anything — the one way the library can share code today. Its own entry method does
nothing and says so; it exists because an item in an init list is called by name.

That leaves the topic showing both handlers, which is not what it teaches. Fences now take `item=`:

```
```json-snippet channel="handler" item="MapBindingDataModelOnViewInit"
```

The named handlers are the only ones left in the copy handed to the emitter, so the block holds just
them while the fence still states the whole sample. A name that matches no handler the sample runs is
an error rather than an empty block. It takes a comma separated list.

With it the snippet is 74 lines on the web platforms and 80 on the .NET ones, against 76 to 94 for the
hand-written blocks it replaces. Inlining the maths instead would have been 180 and 322.

### Two more emitter fixes

- **Platform directives reached the page.** `//WPF: System.Action` and its like are instructions to
  the sample generator. A single-method handler never showed them, because taking the signature off
  took everything above it too; this item's region declares more than one thing, keeps its signature,
  and so printed the directive as though it were code. They are stripped from snippet output now —
  `//WPF:`, `//WinUI:`, `//GTK:` and `//WindowsForms:`, which is the whole vocabulary the library
  uses. Four expectations in the emitter suite held the directive and were updated.
- The snippet machinery is now spread across the renderer and `generate.mjs` — marker parsing, the
  signature omission, the directive strip, and this item filter. Once it stops moving it wants to be
  one helper class in the Description code generation area, beside the rest of that tooling, rather
  than half of it living in a documentation build script.

### Two emitter bugs this page turned up

- `emitChannel` marked a sample's `onInit`/`onViewInit` lists for **whatever** channel was asked for,
  including markup and the binding code the companion fence probes. A handler writes neither, so the
  library item ended up requested and never emitted, which is fatal. It now marks them only for the
  channels a handler writes to.
- `omitHandlerSignature` took everything between the first `{` and the last `}` in a region, on the
  assumption that a region is one method. This item's C# region declares the types it needs and then
  the handler, so the option cut `public class GeoLocation {` off the front and dedented the rest by
  the wrong amount — a snippet that started mid-class. It now counts braces and leaves a region
  holding more than one declaration alone, which is what its own documentation always claimed.

## geo-map-binding-multiple-sources

### The sample was backported before the page was collapsed

No sample existed in the examples repository for this page — only downstream, in
`igniteui-wc-examples`. The port added `samples/maps/geo-map/binding-multiple-sources.json` and the
three data items it binds, so the page's `source=` now names something real.

The data is computed rather than listed: flight paths are great circle arcs interpolated between
city pairs at 200km intervals, and the airports are whichever cities those flights touch. So the
port carries the arithmetic, in `WorldFlights` — the city list, the geodesic maths, and the flight
assembly — with `WorldAirports` and `WorldGridlines` beside it. The library has no way to share code
between items, so the latter two import from `WorldFlights` and only work alongside it. Every sample
that binds one binds all three, so this holds for now; a shared-dependency or dedup mechanism would
be the better answer.

Both languages are copied from the samples that already run this code, not written for the port:

- TypeScript from `igniteui-wc-examples`, `binding-multiple-sources/src` (2e103c2).
- C# from `igniteui-blazor-examples`, `binding-multiple-sources/Services` (dde6269eac85), which is
  also where `GeoLocation`, `WorldCity`, `FlightInfo` and `CoordinateLine` are declared.

The examples repository's `code-gen-tools/backport-world-connections.py` splices those into the three
items, TypeScript and C# together, so the two cannot drift. Regenerate rather than editing the
emitted files; it takes the library path and the two sample folders.

**The documentation's own resource pages are not the source, and have drifted.**
`geo-map-resources-world-util`, `-world-connections` and `-world-locations` publish a version of the
same code, and it differs from what runs: `WorldConnections` is an instance class where the sample's
is static, `WorldUtils` still has `Console.WriteLine` debugging in it, and `AddAirport` counts flights
per city where the sample's does not — which is why the sample's `WorldCity` has no `Flights`
property. Those three pages are themselves candidates for generating from the library later.

`Point` is the one type that differs between the .NET platforms: `IgniteUI.Blazor.Controls` for
Blazor, which is what the Blazor sample itself imports, `Infragistics.Core` for WinUI and
`System.Windows` for WPF, following the shape data items already in the library.

### Which platform's values won

The three platforms disagreed, and the downstream sample settles it — it agrees with React and
Blazor throughout, so those values are the ones kept:

- Flights: `rgba(196, 14, 14, 0.05)` at thickness 4. Angular's block said
  `rgba(147, 15, 180, 0.5)` at thickness 3.
- Airports: `markerBrush` `#aad3df`. Angular said `White`.
- Gridlines: `Gray` at thickness 1.

Angular's Gridlines block was not a gridlines block at all — it was the Flights series pasted again,
`name="polylineSeries"` and all, so the page showed the same series twice and never showed the
gridlines. It also carried two syntax errors: `datasource = worldFlights` as a bare unquoted
attribute, and `thickness={3.0}`, which is JSX interpolation inside an Angular template.

The two running samples disagree with each other as well, and the Blazor one loses both times: it
draws the flights at `rgba(196, 14, 14, 0.2)` rather than `0.05`, and outlines the airports in
`Black` rather than `rgb(73, 73, 73)`. Every other source — the WC sample, and the Angular, React and
Blazor blocks on the page — says otherwise, so the snippet keeps 0.05 and the grey. A comparison run
against the Blazor sample will flag both; that is the Blazor sample being the odd one out.

Angular's block also defined three `ng-template` tooltips, which neither other web platform had.
They are dropped: this page teaches binding several sources to one map, and the tooltip templates
belong to the tooltip topics.

### Summary is now generated from the same definition

The section says the snippets above are combined for copying, so it emits the imports, the whole
map, and `allCode`. What it no longer carries is the framework scaffolding the hand-written version
had — Angular's `@Component` decorator and class declaration, and its `windowRect` assignment.

The imperative audit reports this section, and it is the one place the report is expected. Angular's
Summary block was a whole component class, so it counts as code, while every Angular block in the
sections above it was markup — the Summary was a different presentation of the same declarative
teaching, not an imperative alternative to it. What the audit is really seeing is that the class
scaffolding is gone, which is the standing decision about page scaffolding rather than a change of
mechanics.

### Three things about markers this page pinned down

- An element wanted on more than one channel takes a **list**: `"$type": ["+doc:markup",
  "+doc:bindingCode"]`. That is how the first section shows the map and the data binding beside it.
- Excluding children is done on the **parent's property**, `"$series": "-doc:markup"`, not by
  marking the children.
- Both of the forms that do not work — a comma separated string, and an exclusion marker on the
  child itself — are **silently ignored**. Nothing is emitted for them and no error is raised, so a
  mistyped marker reads as "this element was not wanted". Worth an error.

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

### The axis guidelines showed a property the financial chart does not have

Axis Intervals and Axis Labels Visibility each demonstrate one guideline on the three charts that
have it, so each is one fence with an **array body** — several definitions, emitted in order with a
blank line between, which is the shape the hand written blocks had.

Collapsing them caught an error the page has carried on all four platforms:

```html
<igx-financial-chart xAxisInterval="5" yAxisInterval="50"></igx-financial-chart>
```

`FinancialChart` has no `xAxisInterval`. It has some forty other `xAxis` properties, and a time based
x axis, which is presumably why an interval is not among them. `CategoryChart` has both. The
collapsed snippet sets only `yAxisInterval` there; the schema rejects the other, which is how it came
to light. Label visibility is fine on both charts and is unchanged.

Data Structure and Data Filtering are not collapsed. They teach a `FlattenDataSource` helper the
reader writes, which is not a component.


Three sections collapsed. Axis Types needed the array form — a snippet body that is a list of
definitions rather than one — because it shows a FinancialChart and a DataChart side by side, and
neither is a child of the other. It is the only place in the set that needs it.

### Chart Markers and Chart Resolution stay imperative

These sections show a property being set on a chart the reader already has:

```ts
this.Chart.markerTypes.clear();
this.Chart.markerTypes.add(MarkerType.None);
```

That is the lesson — how to fix a slow chart you already have — so they are emitted as code rather
than as markup. `channel="code"` forces code behind, which is exactly what that emitter is for, and
every platform shows the assignment again:

```ts
igxCategoryChart1.markerTypes = [MarkerType.None];
```

Each section carries two snippets rather than one array, because the original made the same
distinction in comments: "on CategoryChart or FinancialChart", then "on LineSeries of DataChart".

The one difference from the originals is that the generated code constructs the chart first, where
the page assumed one already existed. It is more to read but it stands on its own.

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

## Types a handler needs beside it: supporting items

An event handler item's content lands inside the generated component's class, so a class the handler
depends on had nowhere to go. `GetItemType` also made the two shapes mutually exclusive: a file with
a `//begin data` region is a data item and its handler region is never read, so "put the types in the
data region of the same item" was not open either. Nesting the type inside the handler region works
in C# and only in C# — Kotlin, Swift and the rest of what is coming do not all offer nested types —
so that was not the answer.

A new item type carries them. `CodeGenerationLibraryItemType.Supporting`: a folder whose per-platform
files hold a `//begin supportingTypes` region, emitted at the same scope as the component through a
`supportingTypes` insertion point every sample template now has. In a razor file that scope is the
component's own class, since a razor file has no namespace scope; everywhere else it is a peer.

A handler names what it needs in its configuration, not in the sample:

    MapShapeRandomStyling/Web-CONFIG.json
    { "requires": ["ShapeStylingUtility"] }

Declared on the item rather than in the sample so a sample naming the handler gets the types without
knowing they exist, and so the item stays self sufficient wherever it is used. The list is flat and
is not followed further — a supporting item requires nothing itself.

**Dedup is by item name, which is why it is an item.** Two handlers requiring the same types produce
one copy: each name goes through the same set that already stops a handler being emitted twice, and
the first mention decides where the declarations land, which keeps a base class ahead of what extends
it. The alternative considered — a labelled `supportingCode` region inside each handler item — was
rejected for exactly this: it duplicates the content in every item that needs it and has to invent an
identity space (labels) to deduplicate what it duplicated, with the label unverified against the code
inside it. Symbol-level dedup was rejected earlier still: it means parsing declarations in every
language the library targets.

Emitted on a channel of its own, `supporting`, deliberately not part of `handler`. A topic showing a
handler shows the lines that do the work; the helper class it calls into is usually a separate topic.
A snippet asking a handler for `channel="supporting"` gets the types the handler requires, because
the emission is recorded under the requiring item's name as well as its own — the request is
registered under the name the topic asked for, which is the handler.

Not yet done: `LibraryProjectEmitter`, the harness that compiles library items, does not emit
supporting items — it writes one file per item through a per-platform scaffold that has no shape for
peer declarations. It logs the skip rather than passing over it silently. A handler requiring one
still generates correctly in a sample.

## geo-map-shape-styling

The last of the DataVisualization topics still hand written. Four sections — Random, Scale, Range and
Comparison — each configured a helper from `ShapeStylingUtility` and wired it to `styleShape`. What
was published did not compile: every one of the four called `getStyle(...)`, and the utility, both on
its own topic and in the sample that runs, defines `generate(...)`. Three of the four also read
`this.ShapeRandomStyling` where the field is `this.shapeRandomStyling`.

Backported from `igniteui-wc-examples/samples/maps/geo-map/shape-styling`, the only downstream repo
that has it. That sample configures all four and switches between them from a dropdown, which the
code generation library cannot express, so it became four samples — `shape-styling-random`, `-scale`,
`-range`, `-comparison` — one per variant, each a map, a shapefile load and one styling. Four rather
than one because everything in `onViewInit` runs: four styling items on one sample would stack four
shape series on one map.

`ShapeStylingUtility` is the supporting item the four variant items require, so the utility exists
once in the library rather than four times.

Two changes to what a reader sees, both deliberate:

- The `import { ShapeRandomStyling } from './ShapeStylingUtility'` line is gone. In a generated
  sample there is no such import — the types are peers of the component — so the emitted snippet
  cannot carry one. The prose still names the class, and its own topic still publishes the file.
- The snippets now show the shapefile load and the series construction around the styling, where the
  hand written ones elided them with `// ...`. The teaching stays imperative throughout, which
  `audit-imperative.py` confirms.

The page's own sample is untouched: it still colours by continent through `ShapeFileStyling`, and the
four new samples back the snippets.

## The data grid topics, and which block is the reference

These pages are gated `include: ["NonWeb"]` in the table of contents, so only the XAML platforms
publish them today — but they were published for the web until recently and may be again. That
settles which block a collapse has to reproduce: **the web blocks are authoritative, WebComponents
first**, and the XAML blocks are not evidence of anything, having been generated from the samples on
this branch by `add-xaml-snippets.mjs`. Where a sample disagrees with a web block, the sample is what
has drifted.

Because the web pages do not generate, a collapse cannot be checked by regenerating them. It is
checked by emitting the fence directly for Angular, React, WebComponents and Blazor with the
generator's own style tables, and reading that against the published block. WinUI is checked the
ordinary way, against the generated page.

Two things every one of these collapses changes, both accepted:

- The grid gains `Name="grid"`. The samples name it and the topics' own API sections look it up by
  that name, so the name belongs in the markup; the hand written XAML omitted it.
- React's enum values become strings — `headerClickAction="SortByMultipleColumns"` where the page
  wrote `{HeaderClickAction.SortByMultipleColumns}`. Both are valid and every collapsed topic writes
  the string. Blazor still qualifies its enums, which is what those pages showed.

  **The enum's import block goes with it.** Nothing in the emitted snippet refers to the enum, so a
  hand written `import { HeaderClickAction } ...` beside the fence is dead text. Deleted, not kept.
  And a page that did need its imports would not keep them by hand either: it would emit them, on
  the imports channel, from the same definition. An uncollapsed block next to a collapsed one is the
  thing this whole exercise is removing.

  Imperative sections are the exception, and only because their code is not emitted at all: where a
  topic teaches an API call, the imports that call needs stay beside it. column-sorting keeps its
  `ColumnSortDescription` import for that reason and loses its `HeaderClickAction` one.

### column-sorting — TriState converged to the web's value

The sample's grid carries `SortByMultipleColumnsTriState`, which is the initial value of the live
demo's dropdown, while all four web blocks teach `SortByMultipleColumns`. The snippet states the
documented value and stays pinned to the sample, in the way the gauge topics overlay a value the
sample happens to set differently.

Only the four markup blocks collapsed. The two import blocks above them are kept.

### column-resizing — the web blocks agree, and correct each other

Three web blocks state `Deferred`, `Interpolate` and a separator width of 5, against the sample's
`Auto` and 1. The snippet states the documented values. WebComponents wrote
`column-moving-separator-width` on a resizing topic; React and Blazor both say resizing, which
settles it as a typo rather than a fourth opinion.

The columns come from the documented blocks — FirstName, LastName, Street with `isResizingEnabled`
off, City — replacing the five styled columns the XAML block inherited from the sample. All four
fields exist on EmployeesSalesData, so this is a narrower example rather than a stale one, and the
one the topic is actually about: resizing turned off for a single column.

### column-moving — SlideOver and 5, not the sample's Auto and 2

All three web blocks agree; the sample differs on both. Documented values stated.

### column-animation — one of the documented values does not exist

React and WebComponents both state `columnAddingAnimationMode="SlideToLeft"`. That enum's members
are the SlideFrom set — SlideToLeft belongs to exchanging and hiding — so the value is not one the
property can take and the schema rejects it. Blazor hints at the same conclusion by qualifying the
adding property with `ColumnShowingAnimationMode.SlideFromLeft`: a wrong type name, but a valid
value. The snippet states `SlideFromLeft`, which is also what the sample runs.

The other three documented values are valid and are kept over the sample's: `SlideToRight` rather
than `Crossfade`, `SlideToTopAndFadeOut` rather than `FadeOut`, `SlideFromBottomAndFadeIn` rather
than `SlideFromLeft`.

Also fixed by collapsing: WebComponents wrote the attribute as `column-addingAnimation-mode`, which
is not the property's name in any casing.

### row-highlighting, row-pinning — nothing but the name

Both collapse cleanly. `rowHoverBackground` is stated where the sample omits it, since all four
blocks teach it. The only change to what a reader sees is the grid's Name.

### column-summaries — Root and RowTop

`summaryScope` is `Root` — React alone said `Groups` — and `groupSummaryDisplayMode` is `RowTop`,
which the web blocks teach against the sample's `RowBottom`. The summary and group descriptions come
from the sample, since no block states them and they are what the topic is demonstrating.

The Japanese copy carries a section the English one does not (カスタム集計), so the mirror refuses to
work in spans on this page and the same definition was applied to it directly. That extra section is
untouched and still hand written.

### horizontal-scrolling — WebComponents ignored, as instructed

Its block writes `id=` on the columns where it means `field=`, and states a minimum of 200 against
120 everywhere else. The two sections take the sample: the grid's minimum, then the sample's own
twelve columns, each with the width the topic is about.

This is the first published output to carry the width shorthand: the XAML columns now read
`Width="*>120"` where they had a nested ColumnWidth element.

### accessibility — not collapsible, and the reason is in the page

The description has no accessibility property at all, so a snippet cannot state one. The page's own
prose says why: the feature is turned on "by setting `--use-accessibility` property to true
explicitly in CSS, preferably using a div tag around the grid", which is what the Blazor block shows.
The React and WebComponents blocks set a `useAccessibility` attribute instead — whether the component
really takes one is a question for the product, but the description does not model it either way.
Left hand written.

### overview, Manually Define Columns — a sample that defines columns manually

The blocks there use ProductID, QuantityPerUnit and UnitsInStock, and nothing in the library carries
the last two, so binding them to the topic's own sample would publish columns showing nothing. The
nearest real definition is `column-auto-generation-sales`: ProductOrders, `autoGenerateColumns` off,
eight columns declared one by one — which is exactly what the section teaches. The snippet states
that sample.

### cell-editing — CellBatch, with the buttons left where they are

The prose settles the value: "When set to CellBatch, in order to commit the changes you must...".
Both batch sections state `CellBatch`, so WebComponents' `Cell` goes, and the grid is now one
snippet with each platform's button markup kept beside it in a block of its own. A description
cannot state a button, and the button is the other half of what those sections teach.

The Error Validation section is not collapsed: it wires `cellValueChanging` and `dataCommitting`,
and the sample carries neither handler, so there is nothing to emit them from.

### row-grouping — imperative stays imperative, one section, two fences

WebComponents and React teach these two properties as an assignment; Blazor and XAML teach them as
an attribute. Those are not interchangeable, so each section states its definition once and emits it
twice: `channel="code"` excluding the XAML platforms, and markup excluding the web ones.

The web output carries the construction line — `var grid = new IgcDataGridComponent();` — before the
assignment, where the page showed the property being set on a grid the reader already has. That is
the shape the code channel produces everywhere, and what chart-performance has been publishing.

### local-data, column-pinning — the shorthand made these possible

Both are column-heavy and neither could be collapsed until a column width could be written as
`*>70`. local-data states the React block column for column, which also removes the page's
duplicated XAML block, its unguarded `ts` fence publishing React's data generator to every platform,
and the TODO admitting WebComponents was never written. Its data is now emitted for every platform
from the ProductOrders item.

column-pinning's block files three columns under a "Columns pinned right" comment and states no
pinning on them. The sample pins them, so the snippet does: a comment contradicted by the markup
beside it is not the reference.

### A toolbar and its grid are one definition, not two

column-chooser and column-pinning each pair a toolbar or chooser with the grid it targets. Those go
in one definition with two descriptions — `aboveContent` and `content`, which is how the samples
already hold them — and the emitter writes both elements in order, matching what the blocks showed.
Splitting them into an array of two definitions does not work: `targetGridRef` resolves within the
definition, so a toolbar emitted alone reports the grid as a library item that does not exist.

### column-chooser — another value that is not a member

The React and WebComponents blocks state `columnHidingAnimationMode="SlideOver"`. SlideOver belongs
to column *moving*; the hiding modes are the SlideTo and FadeOut set. The sample does not set the
property at all, and the section is about the chooser, so the snippet drops it.

### column-options, remote-data — WebComponents' minimum width, again

remote-data's WebComponents block states a minimum of 200 where React, XAML and the sample say 120,
the same disagreement horizontal-scrolling has. 120 stated.

### skipAlterDataCasing belongs on every grid snippet

Every grid sample sets it, and without it the web emitters camelise a member of the data: a column
bound to ProductID comes out as `field="productID"`. XAML is unaffected, which is exactly why this
hid — these pages only generate for XAML, so the WinUI checks were clean while the web output, the
one that matters here, was wrong. All 49 grid fences now carry it.

Worth remembering for any topic that names a field, a member path or a sort key: the flag lives at
the root of the definition, beside `descriptions`, as it does in the samples.

### row-grouping Summary — the union, as code where the page taught code

The section claims to combine the snippets above it, so the definition carries both properties and
the three group descriptions its own blocks build. The web platforms and Blazor take it on the code
channel, since that is how those blocks teach it; XAML takes the markup.

## Checking a collapse for platforms the page does not publish

The data grid topics are gated to the XAML platforms, so `generate.mjs --platform=React` skips them
entirely: their fences had never once been emitted for the web. Schema validation still ran, but a
schema says nothing about what comes out. Two checks close that, and both belong in the routine for
any gated topic:

- `check-snippet-emission.mjs` emits every fence for every platform regardless of gating, honouring
  only the fence's own `exclude`. 541 emissions across five platforms, and it is what proves a
  definition survives the platforms its page happens not to build.
- `compare-web-blocks.mjs` recovers each page from before a commit and sets the block each platform
  had beside what the fence emits for it now, per element, reporting attributes gained, lost and
  changed. The web blocks are the accurate record for the web — they were published, where the XAML
  blocks were generated from the samples — so this is the review that matters on these pages.

What the comparison turned up, beyond the decisions already recorded:

- **A validation gap.** Only `descriptions.content` was ever checked, so any other slot went
  unexamined. The column chooser fence carried four properties its description does not have —
  `showAllText`, `hideAllText`, `height`, `width` — and the emitter dropped them without a word.
  Every description in a definition is checked now, and the four properties are gone from the fence.
- **A grid told not to generate columns, with none stated, has none.** The chooser sections lost
  their columns that way. Both now state the sample's.
- **The toolbar sections' grids leave room for the toolbar**, which is what `calc(100% - 40px)` was
  saying; the fences state it rather than the sample's 100%.
- Enum values come out canonical — `left` becomes `Left`, `thin` becomes `Thin`,
  `slideFromRightAndFadeIn` becomes `SlideFromRightAndFadeIn` — which is a correction, and
  `120px` becomes `120` because the description takes a number.

One thing the description cannot express, left as a gap rather than papered over: the column chooser
takes a height, a width and the text on its show-all and hide-all buttons in the published blocks,
and `ColumnChooser` models none of the four.

## Finishing DataVisualization

### chart-performance — three sections, and a fourth invalid property

The two axis sections show the same setting on three chart types in one block, which is what an array
body is for: three definitions, emitted in order. Data Filtering takes the code channel, the shape
this page already publishes elsewhere.

`xAxisLabelExtent` and `yAxisLabelExtent` are not properties of CategoryChart or FinancialChart —
those expose `xAxisExtent` and `yAxisExtent`, and `labelExtent` is the axis-level name the DataChart
form already used correctly. Fourth invalid value this exercise has turned up.

### geo-map-display-bing-imagery — the osm pattern

Markup, then the binding code, with `$setInCode` and `$assignInCode` for the web platforms, exactly
as the OpenStreetMap topic does. The section had only Angular and React blocks before, so Blazor,
WebComponents and the XAML platforms had nothing.

One thing not carried over: the block listed the three imagery styles as alternatives with `// or`
against each. A definition states one value; the styles are in the topic's own table above.

A ref= fence cannot be used for the second one. The definition it names carries `$type:
+doc:markup`, and a definition that marks part of itself has its own markers respected, so nothing
lands on the binding channels. Both fences state their markers, which is what the osm topic does.

### geo-map-binding-shp-file — a published TODO

The WebComponents block read ` TODO - ADD CODE SNIPPET`. The section teaches loading a shapefile
imperatively, which no sample did — the page's own sample binds `shapefileDataSource` declaratively,
and turning the topic's imperative lesson into that markup is the conversion never to make. So the
loading path is a pair of library items and a sample of its own, and the section emits for every web
platform.

### geo-map-binding-multiple-shapes — Blazor was reading the wrong scenario

Its Blazor block still taught the Asia/Europe scenario the page was rewritten away from, while every
collapsed section on the page shut Blazor out for want of a C# port. The four map handlers now have
Blazor implementations, the fences let Blazor in, and the stale block is gone.

The Summary states the definition twice: the markup, then all four handlers. `allCode` was the
obvious single channel and it carries fields and initialisation but not the handlers.

### What is left in DataVisualization, and why

- **geo-map-display-esri-imagery, Esri Utility** — the value taught is a call:
  `EsriUtility.getUri(EsriStyle.WorldOceansMap)`. A description states values, not calls, so the
  snippet would show a literal URI and lose the utility the section is about.
- **geo-map-resources-world-locations, -world-util** — reference listings of helper classes. The web
  copies could come from the library items that already hold them; the Blazor listings need those
  items ported to C# first.
- **radial-gauge, dashboard-tile** — package and namespace instructions for Blazor, not component
  markup.
- **geo-map-binding-data-csv** — the block is a sample of CSV data.
- **grids/data-grid/type-sparkline-table** — a template column drawing a sparkline per platform,
  which needs a template item written; the sparkline templates in the library are for other things.

### cell-editing, Error Validation — written from the closest sample

The section wires `cellValueChanging` and `dataCommitting`, and no sample carried either. Two library
items do now — one refusing an empty cell with a message and taking anything else, one committing an
update and refusing everything else — and the topic's own sample names them.

Two fences, not one, and for a reason worth remembering: a definition that marks part of itself has
its own markers respected, so the same definition carrying `$cellValueChangingRef: "+doc:handler"`
emits the handler and *nothing* for markup. The markup fence states the definition plain; the handler
fence restates it with the markers on the properties that name the handlers. The lead-in sentence
between them is scoped to the platforms the second fence serves, or XAML reads a sentence promising
code that never comes.

### type-sparkline-table — the sample existed downstream

The topic pointed `<Sample src="/charts/sparkline/grid" />` at a sample that did not exist here. It
does exist in igniteui-wc-examples, so the data generator and the cell template are ported from the
one that runs rather than invented: `ProductsWithHistory` — the sample's own `Products`, reshaped as
an array of rows the way `ProductOrders` is, since that is what `dataSourceRef` binds to — and
`DataGridSparklineTemplate`, which builds the chart in a container once and hands it the row's
history as the grid reuses the cell.

Blazor's block taught a `RenderFragment` holding a `Sparkline`. The library's Blazor templates are
registered scripts, which is what its samples run, so that is what the collapsed topic shows.

## What DataVisualization keeps, and why

The count of "remaining blocks" was misleading for a while because the survey behind it matched
markup fences only — tsx, html, razor, xaml — and everything left on these pages is code. Counting
every fence gives the real picture, and what is left divides into four kinds, none of them a snippet:

- **Dependencies** — `npm install` lines and the Blazor NuGet and namespace instructions. Setup, not
  a component.
- **Component Modules** — the registration each platform performs. The module channel can now be
  asked for a sample's module list, which is a fix worth having, but what it yields is the list; the
  call around it — `ModuleManager.register(...)`, `@NgModule`, `AddIgniteUIBlazor(...)` — lives in
  the platform's template and not in anything a definition can state. These sections need the call,
  so they stay as they are.
- **Companion files and utilities** — the Esri utility, whose lesson is the call
  `EsriUtility.getUri(EsriStyle.WorldOceansMap)`; the heat map's web worker, which is a file the
  reader adds and wires up differently per bundler; the world resource listings, which could come
  from the library items holding them once those items are ported to C#.
- **Illustrations of data** — chart-performance's Data Structure, and the CSV on the csv binding
  topic. They show the shape data should take, not a component.

chart-annotations' Callout Layer was the last one that was really a snippet: WebComponents taught the
same properties as assignments beside the markup fence, and now emits them on the code channel.

## Which components are in scope

"Everything whose canonical description name does not start with Web" is the rule, and the way to
apply it is not the frontmatter — a page can mention Checkbox and be entirely about the web grid.
The components that carry a XAML name in their metadata are the cross platform set, and there are
twenty five of them: the charts, the gauges, the map, the data grid, the toolbar, the dashboard
tile, the zoom slider, the colour editor, the sparkline, the treemap and the legends. The inputs and
layouts are web only and out of scope even though their names carry no Web prefix.

Two things that survey turned up, both metadata copy-and-paste: the DataGrid's WindowsForms
qualified name is UltraLinearGauge, and ODataVirtualDataSource's is the pie chart's.

### menus/toolbar — four sections

The data chart integration, the data URL icon, the vertical orientation and the colour editor. The
toolbar sits beside the component it targets in one definition; a toolbar stated alone reports its
target as a library item that does not exist, which is how the vertical orientation fence failed
first time. That one names no target, which is also what its block showed.

### inputs/color-editor — a cross platform component among the web only ones

Its Usage and Binding to events sections collapse; the handler the event section teaches is a
library item now, on the web, Blazor and .NET, and the topic's sample names it.

### zoomslider-overview — another sample that only existed downstream

The topic pointed at /charts/zoomslider/overview, which exists in igniteui-wc-examples and not here.
Ported, and the Code Snippet section states it.

What these three leave behind is what every component topic keeps: Dependencies and Component
Modules.

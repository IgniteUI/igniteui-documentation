# WinUI & Uno Documentation Emission — Work Plan

**Status:** planning complete, not started
**Owner:** _unassigned_
**Repos in play:** `igniteui-documentation` (target), `igniteui-xplat-docs` (source of un-ported Data Grid content), `winui-samples` (sample sources)
**Last updated:** 2026-08-05

This document is self-contained: it records the current architecture, the locked
decisions, the measured content inventory, and a phased task list. Anyone picking
this up should be able to start at Phase 0 without re-deriving the analysis.

---

## 1. Goal

Emit Ignite UI documentation for two new platforms — **WinUI** and **Uno** — from the
existing xplat MDX source in `docs/xplat/`, alongside the four current platforms
(Angular, React, Web Components, Blazor). This requires:

1. Registering the two platforms in the Astro build (new sites, new build matrix).
2. A platform-filtering model that scales past four platforms, so web-only topics
   stop emitting for WinUI/Uno (and for the mobile platforms that come later).
3. XAML + C# snippets for every in-scope topic, sourced from `winui-samples`.
4. Porting the **Data Grid** topic set, which was never carried from
   `igniteui-xplat-docs` into the Astro docs, and marking it non-web-only.
5. A live sample host that serves the shared samples to both new doc sites.

---

## 2. Locked decisions

| # | Decision | Rationale / consequence |
|---|---|---|
| D1 | **Samples are served live from an Uno WASM host.** One samples browser, compiled from the shared sample sources via Uno to WebAssembly, hosted like the existing `*-demos` sites. Both WinUI and Uno docs embed the live iframe. | Reuses the existing `<Sample>` / `code-view` iframe contract with no doc-side component change. WinUI pages additionally link to the WinUI source in `winui-samples`. |
| D2 | **Platform *groups* plus an `include` allowlist.** Group aliases resolve at build time; the non-web group is named **`NonWeb`** (not `Xaml`), because mobile and other non-web platforms will join it. `include` is added alongside `exclude` and wins over it. | Group naming stays valid as platforms are added. `include: ["Web"]` on a web-only topic means every future non-web platform is excluded automatically — no repeat migration. |
| D3 | **Two separate sites.** WinUI and Uno each get their own `PLATFORM` build, base URL, dev port and `dist/` output, symmetric with React/WC/Blazor. | Per-product URLs and product-switcher entries; doubles the build matrix. |
| D4 | **Scope = components that have WinUI samples.** A component's doc set emits for WinUI/Uno if `winui-samples` has **any** sample for that component. | See §4 for the measured matrix. |
| D5 | **An individual missing sample never excludes a topic.** Only a component with *zero* WinUI samples is excluded wholesale (e.g. Financial Chart, most inputs). Individual unmatched sample routes are a backfill/triage item, not a suppression trigger. | Set by review of the coverage data; some doc sample references are hand-built one-offs rather than entries in the examples repos, so an unmatched route is not evidence the component is unsupported. |
| D7 | **OPEN — translation vs common-JSON emission for snippet generation.** Translation has 84/149 groups covered today but cannot serve the 33 code-only groups at all. Emission removes the guesswork and gets code-behind for free, at the cost of a subsetting mechanism, bolstered forced-code-behind, and back-conversion. **The deciding factor: both paths require the same prerequisite** — see §6.5.2. | Comparison and the decision criterion in **§6.5**. Not to be settled by default; the next increment of translation work is the part that gets thrown away if emission wins. |
| D6 | **API name resolution: ship on the existing heuristic for now, but re-incorporate the apiMaps as a committed follow-up.** The apiMaps are the correct mechanism — the product builds already generate the authoritative canonical ↔ platform name mapping for every type and member. Prefix-plus-casing guessing is a stopgap, accepted only to unblock the launch. | Interim posture in §6.3.2; the committed workstream is **§6.4** and **Phase 7**. Interim rule: do not hand-patch MDX at scale to work around resolution failures — that debt would have to be unpicked. |

---

## 3. How platform emission works today

Understanding these five mechanisms is a prerequisite for Phase 0–1.

### 3.1 Platform selection

One Astro build per platform per locale. `PLATFORM` env var (or `.platform.json`)
selects it — [docs/xplat/astro.config.ts:36](docs/xplat/astro.config.ts#L36). Scripts in
[docs/xplat/package.json](docs/xplat/package.json) wrap this per platform
(`dev:react`, `build:blazor`, …), and the root [package.json](package.json) re-exports
convenience aliases.

### 3.2 Token substitution

`vitePluginPlatformTokens` — [docs/xplat/astro.config.ts:197](docs/xplat/astro.config.ts#L197)
— rewrites `{Platform}`, `{ProductName}`, `{GridSample}`, `{environment:*}` etc. in
`.mdx` before the MDX compiler runs. Values come from the per-platform
`replacements` array in [docs/xplat/docConfig.json](docs/xplat/docConfig.json)
(148 entries for React alone).

### 3.3 Conditional content — `PlatformBlock`

`<PlatformBlock for="Angular, WebComponents">` is **inlined at build time** by
`inlinePlatformBlocks` — [docs/xplat/astro.config.ts:121](docs/xplat/astro.config.ts#L121)
— a depth-aware parser that keeps matching content and strips the rest. The
component import is then removed by regex. This logic lives in this repo, so
group-alias support (D2) can be added here. Authoring rules:
[docs/xplat/AI-AGENT-PLATFORM-BLOCK.md](docs/xplat/AI-AGENT-PLATFORM-BLOCK.md).

### 3.4 Conditional navigation — `toc.json`

`buildFilteredToc` — [docs/xplat/astro.config.ts:271](docs/xplat/astro.config.ts#L271)
— reads `src/content/{lang}/toc.json`, drops nodes whose `exclude` array contains the
active platform, merges `platforms.<Platform>` badge overrides, and writes
`generated/{Platform}/{lang}/components/toc.json`. Badge override rules:
[docs/xplat/PLATFORM-LABELS.md](docs/xplat/PLATFORM-LABELS.md).

**This is blacklist-only today** — there is no `include`. Nearly every entry that is
not Angular-relevant already carries `"exclude": ["Angular"]`.

### 3.5 Samples

`<Sample src="/{GridSample}/groupby-expressions" height={605} alt="…" />` renders a
`code-view` custom element that iframes the platform's hosted samples browser and
pulls code tabs from `/code-viewer/*.json` on the same host. The host URL per
platform and per environment comes from `docConfig.json → <Platform>.samplesBrowsers`
(e.g. React → `https://www.infragistics.com/react-demos`); dev builds proxy
`/code-viewer` — [src/integration.ts:701](src/integration.ts#L701).

> `Sample.astro`, `ApiLink.astro`, `PlatformBlock.astro` and `DocsAside.astro` are
> imported from the **external npm package `igniteui-astro-components@0.0.27`**, not
> from this repo. See risk R3.

---

## 4. Content inventory (measured)

Counted against `docs/xplat/src/content/en/components` (280 MDX topics, 769 `<Sample>`
usages) and `winui-samples/samples` (**279** samples across 15 components).

### 4.1 Components that emit for WinUI/Uno — have WinUI samples

| Sample component | WinUI samples | Doc topics referencing it |
|---|---|---|
| `charts/data-chart` | 66 | 34 |
| `charts/category-chart` | 60 | 25 |
| `maps/geo-map` | 24 | 22 |
| `grids/data-grid` | 37 | 1 (+32 to port, §5.4) |
| `gauges/radial-gauge` | 20 | 1 |
| `gauges/linear-gauge` | 17 | 1 |
| `gauges/bullet-graph` | 13 | 1 |
| `charts/sparkline` | 8 | 2 |
| `charts/data-pie-chart` | 8 | 1 |
| `charts/toolbar` | 7 | 1 |
| `charts/tree-map` | 5 | 2 |
| `charts/dashboard-tile` | 5 | 1 |
| `charts/pie-chart` | 4 | 2 |
| `charts/doughnut-chart` | 3 | 2 |
| `inputs/color-editor` | 1 | 1 |

**59 existing topics** reference at least one sample that already exists for WinUI.
168 distinct sample routes already match between the docs and `winui-samples`.

### 4.2 Components suppressed for WinUI/Uno — zero WinUI samples

`charts/financial-chart` (8 topics) · `excel/excel-library` (8) ·
`excel/spreadsheet` (9) · `grids/grid`, `grids/list`, `grids/tree`, Grid Lite and the
`{GridSample}` / `{TreeGridSample}` / `{PivotGridSample}` / `{HierarchicalGridSample}` /
`{ComponentSample}` web-grid families (~150 topic references) · all `inputs/*` except
`color-editor` · all `layouts/*` (incl. Dock Manager) · all `notifications/*` ·
all `scheduling/*` · `menus/nav-bar`, `menus/nav-drawer` · `interactions/chat`,
`interactions/query-builder` · `themes/*` · `ai/*`.

`menus/toolbar.mdx` **does** emit — its samples are `charts/toolbar`.

**Zoom Slider is an exception to the zero-samples rule:** `charts/zoomslider` has no
WinUI sample folder today, but the control is coming, so `zoomslider-overview.mdx`
emits and the sample is a Phase 2/4 backfill item.

### 4.3 Sample routes referenced by in-scope topics with no matching WinUI folder

42 routes — a **triage list, not an exclusion list** (D5). Some are expected to be
hand-authored samples that never existed in the examples repos; the rest are
genuine backfill candidates for `winui-samples`. Full list in Appendix C.

Distribution: `charts/data-chart` 19 · `charts/financial-chart` 9 (component is
excluded anyway) · `charts/category-chart` 7 · `charts/pie-chart` 3 ·
`charts/sparkline` 2 · `charts/doughnut-chart` 1 · `grids/data-grid` 1.

### 4.4 WinUI samples with no doc reference

110 of 279 — including **36 of the 37 `grids/data-grid` samples**, which is a direct
consequence of the Data Grid topics never being ported (§5.4). The remainder
(data-chart 17, category-chart 15, radial-gauge 11, geo-map 9, linear-gauge 8,
bullet-graph 5, sparkline 4, …) are candidates for new sections in existing topics.

---

## 5. Phased work plan

Phases 0–2 are sequential and blocking. Phases 3–4 are the content bulk and can run
in parallel per component family once Phase 1 lands. Phase 5 is required for the
sites to have an entry point. Phase 6 gates merge. **Phase 7 is committed, not
optional** — it replaces the heuristic name resolution the launch ships on.

### Phase 0 — Register the platforms

Goal: `PLATFORM=WinUI npm run dev:winui` boots and serves the existing xplat content
unfiltered. No content correctness yet.

| File | Change |
|---|---|
| [src/platform.ts:29](src/platform.ts#L29) | `PlatformKey` += `'winui' \| 'uno'` |
| [src/platform.ts:165](src/platform.ts#L165) | `PLATFORM_DEFS` entries — `navType: 'infragistics'`, shared `IG_STYLES` / `IG_SCRIPTS` |
| [src/platform.ts:182](src/platform.ts#L182) | `IGDOCS_PLATFORMS` += `WinUI` / `Uno`: `base` (§8 Q1), `devPort` 4335 / 4336, `root: '/general-getting-started'`, title, description |
| [src/platform.ts:271](src/platform.ts#L271) | `getNavConfig` case list += both keys |
| [src/lib/api-platform-config.ts:1](src/lib/api-platform-config.ts#L1) | `PlatformName` += `'WinUI' \| 'Uno'`; `PLATFORM_MAP` += `winui`, `uno`; `API_PLATFORM_CONFIGS` entries (`folder`, prefix, `pascalCaseMembers: true`, `apiPackages` → `Infragistics.WinUI.*`) |
| [src/lib/platform-context.ts:17](src/lib/platform-context.ts#L17) | `PLATFORMS` entries: `productName`, `productSpinal`, `packages`, `links.github` / `forums` / `repoSamples` → `winui-samples` |
| [src/lib/platform-context.ts:11](src/lib/platform-context.ts#L11) | **Blocker:** `PlatformName` is re-exported from `igniteui-astro-components/lib/types`. Switch this import to the local `api-platform-config.ts` type (already a duplicate definition) or bump the package — see R3 |
| [src/integration.ts:118](src/integration.ts#L118) | `API_DOCS_FOLDER_BY_PLATFORM` += entries, or intentionally omit so no `api/*/llms.txt` URL is emitted (§8 Q2) |
| [src/llms.ts:197](src/llms.ts#L197) | `IGDOCS_PLATFORMS` set += `'winui'`, `'uno'` |
| [src/virtual-modules.d.ts:28](src/virtual-modules.d.ts#L28) | platform union += both |
| [src/plugins/remark-env-vars.ts:26](src/plugins/remark-env-vars.ts#L26) | key→name map += both |
| [docs/xplat/docConfig.json](docs/xplat/docConfig.json) | New `WinUI` / `Uno` blocks: `replacements` (`{Platform}`, `{ProductName}`, `{PackageCore}`, `{RepoSamples}`, sample-path tokens), `samplesBrowsers` (Phase 2 host), `samplesGithubFile` / `samplesGithubTree` → `winui-samples`, `apiDocRoot` |
| [docs/xplat/package.json](docs/xplat/package.json) | `generate:` / `dev:` / `build:` / `build-staging:` / `build-production:` / `preview:` scripts for both platforms |
| [package.json](package.json) | Root `xplat:*:winui` / `:uno` aliases |
| [docs/xplat/scripts/generate.mjs](docs/xplat/scripts/generate.mjs) | Code-fence language → platform map (`xaml`, `csharp`) and content-detection regexes for XAML/`Xam*` types |

**Acceptance:** dev server boots for both platforms; `{Platform}` renders as `WinUI` /
`Uno`; no unresolved `{Token}` leaks into output; sidebar renders.

**Status: done and verified.** `npm run generate:winui` emits 365 MDX files; the dev
server boots on 4335; `/radial-gauge` and `/charts/types/area-chart` return 200 with
`<meta property="docs:platform" content="winui">`, title *"…| Ignite UI for WinUI"*,
`<h1>WinUI Radial Gauge Overview</h1>`, zero unresolved `{Token}`s, and no
cross-platform name leakage (0 `Igr`/`Igb`/`Igx`; the single `Igc` hit is the docs UI's
own `IgcTabsComponent`).

> ⚠️ **Defect this exposed — unresolved `ApiLink`s fabricate type names.**
> `ApiLink.astro` sets `displayLabel = label ?? (member ? `${baseType}.${member}` :
> baseType)` where `baseType = prefixed ? prefix + type : type`. With no WinUI registry
> yet, **every** link falls through to code text — and that text has `Xam` prepended.
> For controls this is correct (`RadialGauge` → `XamRadialGauge`). For the unprefixed
> helper types it renders a type **that does not exist**:
>
> | Doc stem | Renders | Real WinUI name |
> |---|---|---|
> | `RadialGaugeRange` | `XamRadialGaugeRange` | `RadialGaugeRange` |
> | `LinearGraphRange` | `XamLinearGraphRange` | `LinearGraphRange` |
> | `DataGridToolbar` | `XamDataGridToolbar` | `DataGridToolbar` |
> | `ColumnSortDescription` | `XamColumnSortDescription` | `ColumnSortDescription` |
> | `RangeBarSeries`, `TreeMap` | `Xam…` | not present in `winui-samples` — confirm |
>
> This is R7 in visible output: not a dead link but **wrong prose**. Keeping
> `prefixed: true` is still the right call on volume — the correctly-prefixed controls
> account for ≈506 refs (`DataChart` 295, `DataLegend` 80, `RadialGauge` 56,
> `GeographicMap` 40, `PieChart` 13, `BulletGraph` 12, `LinearGauge` 10) against ≈5–10
> mislabelled helper refs. The registry (§6.2) fixes it properly by resolving the bare
> form when no `Xam` form exists. Until then, treat the table above as a known-wrong
> list; per-usage `prefixed={false}` is available but counts as the debt §6.3.2
> guardrail 4 warns about.

### Phase 1 — Platform groups + `include`

Goal: web-only content stops emitting for WinUI/Uno, and the model survives adding
mobile platforms.

1. **New shared module** `src/lib/platform-groups.ts`:
   ```ts
   export const PLATFORM_GROUPS = {
       Web:    ['Angular', 'React', 'WebComponents', 'Blazor'],
       NonWeb: ['WinUI', 'Uno'],           // mobile joins here
   };
   export function resolvePlatformList(names: string[]): string[];  // expands aliases
   export function emitsFor(platform: string, node: { include?: string[]; exclude?: string[] }): boolean;
   ```
   Semantics: expand aliases in `include`, `exclude` and `PlatformBlock for=`. If
   `include` is present and the active platform is not in the resolved set → drop.
   Otherwise apply `exclude`. `include` wins on conflict.

2. **Consumers** — all four must use the shared resolver, or filtering diverges
   between dev, generated output and the link checkers:
   - `buildFilteredToc` — [docs/xplat/astro.config.ts:281](docs/xplat/astro.config.ts#L281)
     (also strip `include` from generated output alongside `exclude` / `platforms`)
   - `inlinePlatformBlocks` — [docs/xplat/astro.config.ts:121](docs/xplat/astro.config.ts#L121)
   - [docs/xplat/scripts/generate.mjs](docs/xplat/scripts/generate.mjs) (docfx-style
     comment blocks and toc filtering)
   - [scripts/check-relative-links.mjs:58](scripts/check-relative-links.mjs#L58) and
     `:178`, [docs/xplat/scripts/resolve-api-links.mjs:66](docs/xplat/scripts/resolve-api-links.mjs#L66),
     `scripts/check-mdx-links.mjs` platform args,
     [scripts/apply-react-platform-fixes.mjs:131](scripts/apply-react-platform-fixes.mjs#L131)

3. **Migrate `toc.json`** ([docs/xplat/src/content/en/toc.json](docs/xplat/src/content/en/toc.json)
   and the `jp` copy) using the §4.2 matrix. Policy:
   - Web-only entry → `"include": ["Web"]` (future-proof; supersedes the need to name
     each new non-web platform). Existing `"exclude": ["Angular"]` can stay for
     Angular-specific suppression within the Web group.
   - Shared DV entry (charts / gauges / maps) → leave as is.
   - WinUI/Uno-only entry (Data Grid family) → `"include": ["NonWeb"]`, replacing the
     current `"exclude": ["Angular","Blazor","WebComponents","React"]` idiom.
   Do this with a scripted migration driven by a checked-in component→group table, then
   review the diff — this touches ~250 entries.

4. **Docs:** update [docs/xplat/AI-AGENT-PLATFORM-BLOCK.md](docs/xplat/AI-AGENT-PLATFORM-BLOCK.md)
   (valid platform names, group aliases, `for="NonWeb"`) and
   [docs/xplat/PLATFORM-LABELS.md](docs/xplat/PLATFORM-LABELS.md) (`include` semantics,
   new platform names for badge overrides).

**Acceptance:** a WinUI build's sidebar contains only §4.1 components plus General;
a React/WC/Blazor/Angular build's sidebar and page count are **byte-identical to
before** (this is the regression that matters most).

### Phase 2 — Uno WASM sample host

Goal: `<Sample>` renders a live sample and code tabs on both new sites, with no change
to the MDX or to the `Sample` component.

1. Stand up an Uno WASM samples browser over the shared sample sources
   (`winui-samples/samples` — 279 samples, each a `Sample.xaml` + `Sample.xaml.cs`
   pair plus data files). Model the ingest on
   [winui-samples/scripts/ingest-samples.ps1](../winui-samples/scripts/ingest-samples.ps1),
   which already produces a route table (`charts/category-chart/annotations-all`) that
   matches the doc `sample=` paths exactly.
2. **Reproduce the samples-browser contract** so the existing component works unchanged:
   an iframe route per sample path, and `/code-viewer/<route>.json` returning the file
   list for the code tabs. Confirm the JSON shape against an existing host
   (`react-demos`) before building.
3. Deploy to a stable staging + production URL; wire both into
   `docConfig.json → WinUI.samplesBrowsers` and `Uno.samplesBrowsers`.
4. WinUI-specific affordance: a "view the WinUI source" link to the matching
   `winui-samples` folder (via `samplesGithubFile` / `samplesGithubTree`), plus a short
   note that the embedded preview is the Uno WASM build of the same sample.
5. Decide the fallback for a doc sample route with no sample on the host (the §4.3
   triage list) — recommended: the component renders a neutral "sample not available
   for this platform" placeholder rather than a broken iframe, and the route is logged
   at build time so the backfill list stays current.

**Acceptance:** `geo-map.mdx` and `radial-gauge.mdx` built for WinUI show a live
sample and XAML/C# code tabs; a known-missing route degrades without a console error.

### Phase 3 — Port the Data Grid topic set

**Source:** `igniteui-xplat-docs/doc/en/components/grids/data-grid/*.md` — 32 topics,
4,533 lines. **Target:** `docs/xplat/src/content/en/components/grids/data-grid/*.mdx`.

The Astro toc **already contains** these 32 entries under "Table / Grid" pointing at
`grids/data-grid/*.mdx` — the files were never created, so those nodes currently
reference nothing. Only the landing page `grids/data-grid.mdx` exists.

Per topic:
- docfx `<!-- Platform -->` … `<!-- end: Platform -->` comments → `<PlatformBlock for="…">`
- `` `sample="/grids/data-grid/x", height="600", alt="…"` `` → `<Sample src="/grids/data-grid/x" height={600} alt="…" />`
- frontmatter → Astro schema (`title`, `description`, `keywords`, `license`,
  `mentionedTypes`, `namespace`, `llms.description`); `_description` / `_keywords` /
  `_canonicalLink` are docfx-era names
- backticked type names → `<ApiLink>` where a target exists (see R1)
- `../data-grid.md` style links → `.mdx`
- toc entries → `"include": ["NonWeb"]`
- **Suppress the web deprecation banner.** These topics open with a "this control has
  been deprecated, migrate to Grid" note scoped to Blazor/WebComponents. The Data Grid
  is the *primary* grid on WinUI/Uno — the note must not leak into their output.
- Add XAML/C# snippets: **32 of the 38** referenced sample routes already exist in
  `winui-samples`, so snippets can be lifted from `Sample.xaml` / `Sample.xaml.cs`.

Sizeable topics to schedule first: `overview` (475 lines), `column-pinning` (400),
`column-types` (365), `cell-editing` (333), `column-summaries` (306),
`column-chooser` (293).

**Acceptance:** all 32 pages build for WinUI and Uno, appear in the sidebar, are absent
from all four web builds, and pass the relative-link and MDX-link checkers.

### Phase 4 — XAML/C# snippets for the 59 in-scope existing topics

For each topic in §4.1, add WinUI/Uno code alongside the existing four platforms,
inside `<PlatformBlock for="NonWeb">` (or `for="WinUI"` / `for="Uno"` where the two
genuinely differ — package names and `using` directives most likely).

- Source of truth: `Sample.xaml` (markup) and `Sample.xaml.cs` (code-behind) in the
  matching `winui-samples` folder.
- **Trim the harness.** Sample XAML wraps the control in `XamPropertyEditorPanel` /
  `PropertyEditorPropertyDescription` scaffolding and layout `Grid`s that must not
  appear in a doc snippet; the code-behind carries a `ComponentRenderer` /
  `…DescriptionModule.Register` block for the same reason. Snippets should show the
  control element and the relevant handler only.
- Type naming is **not uniformly prefixed**: `igGauges:XamRadialGauge`,
  `igDataGrids:XamDataGrid`, but `ig:DataGridToolbar`. Do not machine-derive names from
  a prefix rule.
- Suggested batching, largest first: `charts/types/*` (17 topics) →
  `charts/features/*` (16) → `geo-map-*` (16) → gauges (3) → `dashboard-tile`,
  `menus/toolbar`, `inputs/color-editor`, `charts/chart-overview`, `charts/chart-features`.
- Where a section's only sample is on the §4.3 triage list, keep the prose and
  snippet and let the sample placeholder handle it (D5) — do not suppress the section.

**Acceptance:** every in-scope topic has non-empty WinUI/Uno code for each section
that has code for the web platforms; `PlatformBlock` open/close counts balance
(`grep -c` check documented in the authoring guide).

### Phase 5 — General / setup topics

Strictly outside "components with samples" (D4), but the sites cannot ship without
them: `IGDOCS_PLATFORMS.root` points at `/general-getting-started`.

Minimum set, WinUI- and Uno-specific language (Visual Studio / project templates /
`PackageReference` / licensed NuGet feed), modelled on the existing Blazor
installation topics ([general-nuget-feed.mdx](docs/xplat/src/content/en/components/general-nuget-feed.mdx),
[general-installing-blazor.mdx](docs/xplat/src/content/en/components/general-installing-blazor.mdx)):

- Getting Started (WinUI) / Getting Started (Uno)
- Adding the licensed NuGet feed (can likely be shared with Blazor via group)
- Licensing
- Changelog (new per-platform topic, mirroring `general-changelog-dv-*.mdx`)

Everything else under General (CLI, MCP, OSS vs premium, Next.js, update guide) is
web-only → `include: ["Web"]`.

### Phase 6 — Validation & CI

- `npm run check-relative-links:ci` — extend the generate chain and the platform lists
  to cover WinUI/Uno.
- `npm run check-mdx-links:winui` / `:uno` — needs an API link index or an explicit
  skip (R1).
- `npm run check:llms-metadata`, `npm run lint:md`, `npm run spellcheck` — add
  `WinUI`, `Uno`, `XamDataGrid`, `XamRadialGauge`, `igGauges`, `igDataGrids`,
  `SkiaSharp`, etc. to [cspell.json](cspell.json).
- CI/CD: add both platforms to [.github/workflows/ci.yml](.github/workflows/ci.yml),
  [cd-xplat-en.yml](.github/workflows/cd-xplat-en.yml) and
  [_cd-deploy.yml](.github/workflows/_cd-deploy.yml).
- Regression gate: web-platform page inventories unchanged before/after Phase 1.

### Phase 7 — Re-incorporate the apiMaps (committed follow-up)

Specified in full in **§6.4**. Replaces prefix-plus-casing guessing with the
product-generated canonical ↔ platform name mapping, by making the registry generator
alias-aware. Scheduled after the WinUI/Uno launch; **not optional** — it is the
mechanism the docs are supposed to use, and it also fixes the ≈460 `ApiLink`s already
failing on React.

Blocking dependencies to raise now, since they sit outside this repo:
- product builds must emit `WinUI` and `Uno` entries in apiMap `names[]`
- the apiMaps need a durable home once `igniteui-xplat-docs` is retired

Interim work must not create debt that this phase has to unpick — see §6.3.2 guardrail 4.

---

## 6. Emission matrix (source of truth for Phase 1 migration)

| Doc area | WinUI / Uno | Mechanism |
|---|---|---|
| Charts — types, features, overview, API | **emit** | default (shared) |
| Gauges — radial, linear, bullet | **emit** | default |
| Maps — `geo-map*`, `maps/map-api` | **emit** | default |
| Data Grid — `grids/data-grid/*` (32, ported) | **emit, exclusively** | `include: ["NonWeb"]` |
| `grids/grids.mdx` + `grids/theming.mdx` — the legacy DataGrid landing/theming pages, dead today (excluded for all four web platforms) | **emit, exclusively** — becomes the WinUI/Uno grid landing page. Provisional reading, revisit during Phase 3 | `include: ["NonWeb"]` |
| `grids/data-grid.mdx` — despite the name, the **web** Grid landing page (`{GridSample}`) | hide | `include: ["Web"]` |
| `dashboard-tile`, `menus/toolbar`, `inputs/color-editor` | **emit** | default |
| Zoom Slider — control is coming; no WinUI sample yet | **emit** | default; sample is a backfill item |
| General — Getting Started / NuGet / Licensing / Changelog | **emit** (new, Phase 5) | new topics |
| Financial / Stock Chart | hide | `include: ["Web"]` |
| Grid, Tree Grid, Hierarchical Grid, Pivot Grid, Grid Lite, List, Tree | hide | `include: ["Web"]` |
| Spreadsheet, Excel Library, Excel Utility | hide **for now — deferred, see §6.1** | `include: ["Web"]` |
| Inputs (except Color Editor), Layouts, Notifications, Scheduling, Menus (navbar / drawer) | hide | `include: ["Web"]` |
| Chat, Query Builder, Dock Manager, Tile Manager | hide | `include: ["Web"]` |
| AI-Assisted Development (Agent Workflow, Skills, CLI MCP, Theming MCP, Maker Framework) | hide **for now — deferred, see §6.1** | `include: ["Web"]` |
| Themes / Styling, CLI, Next.js, Update Guide, Localization(i18n) | hide | `include: ["Web"]` |

### 6.1 Deferred, not rejected

Two areas are excluded in this pass but are expected back. **Adapt the existing
topics rather than authoring new ones** when they return — the prose is largely
platform-neutral and the exclusion is a scoping decision, not a content judgement.

| Area | Why deferred | When it returns |
|---|---|---|
| **Excel Library / Spreadsheet / Excel Utility** (18 topics) | No WinUI samples yet | Re-include by relaxing `include: ["Web"]` on those toc entries and adding `NonWeb` snippets; the Excel document API is largely platform-agnostic so most prose survives as is |
| **AI-Assisted Development** (5 topics) | Web-tooling framing (npm/CLI/MCP setup) | Same mechanism; needs the setup language re-cut for Visual Studio / NuGet before it emits |

Keep both out of the Phase 1 `include: ["Web"]` migration script's "permanent" bucket
so re-inclusion is a one-line toc change per entry, not a re-port.

---

## 6.2 API link registry — how it is produced, and what WinUI/Uno needs

Assumption for this plan: **WinUI and Uno will have an API link index.** The chain
below is traced end to end; the one genuinely missing piece is called out in step 5.

### The chain today (Blazor — the exact template for a .NET platform)

| Step | Where | What happens |
|---|---|---|
| 1 | `api-docs/scripts/blazor.js fetch` | Restores `IgniteUI.Blazor.Trial` NuGet packages (feed in `api-docs/scripts/Nuget.Config`) and extracts the DLLs into `blazor_build/temp/` |
| 2 | `dotnet tool run docfx blazor_build/docfx-build-IgniteUI.Blazor.json` | docfx metadata over `temp/IgniteUI.Blazor.dll`, filtered by `IgniteUI.Blazor.filterConfig.yml` → `temp/api/*.yml` → `temp/api-json` (+ `temp/api-raw`) |
| 3 | `blazor_build/blazor-merge-toc.js` | Merges to one per-package JSON under `api-docs/src/data/<platform>/` (gitignored — fetched, not committed), registered in `api-docs/src/data/platforms-config.json` with a version entry and `jsonFile` |
| 4 | api-docs Astro site | Renders `/api/blazor/IgniteUI.Blazor/latest/classes/IgbDataGrid`; `src/data/api-search-index.ts` walks the same JSON for the site's own search index |
| 5 | **nothing** | ⚠️ **The ApiLink registry has no generator.** The four snapshots in this repo were added by hand in PR #256 (Jun 2026, "Add local ApiLink registry snapshots"). `api-docs` produces a *search* index (`u/n/k/v/p/g/m`), which is a **different shape** from the ApiLink registry (`p/k/u/s/m` keyed by symbol name) |
| 6 | `igniteui-documentation` | Snapshots committed at `src/data/api-link-index/<platform>/{staging,prod}-latest.json` + `manifest.json`; loaded by `loadApiLinkIndex()` — [src/lib/platform-context.ts](src/lib/platform-context.ts) |
| 7 | `igniteui-astro-components/src/components/mdx/ApiLink/ApiLink.astro` + `api-link-index.ts` | Resolves symbol → URL at render time |

### Registry contract (from a working snapshot)

```jsonc
{
  "platform": "blazor", "version": "latest", "generatedAt": "2026-06-03T…",
  "packages": ["IgniteUI.Blazor", "IgniteUI.Blazor.Documents.Excel", …],
  "symbols": {
    "IgbDataGrid": [{
      "p": "IgniteUI.Blazor",                                             // package id
      "u": "/api/blazor/IgniteUI.Blazor/latest/classes/IgbDataGrid",       // URL path
      "k": "class", "s": "classes",                                        // kind, url segment
      "m": { "ResolveEventBehavior()": "ResolveEventBehavior()", … }       // member → anchor
    }]
  }
}
```
Angular ≈ 7.6 MB / Blazor ≈ 13.1 MB / React ≈ 6.6 MB (2,619 symbols) / WC ≈ 5.5 MB.

**The resolver is already platform-agnostic** — [api-link-index.ts](../igniteui-astro-components/src/components/mdx/ApiLink/api-link-index.ts)
takes `prefix` / `prefixed` / `suffix` / `classSuffix` from platform context and only
requires a `symbols` map. No resolver change is needed for WinUI/Uno; the single
package-side blocker is the `PlatformName` union at
`igniteui-astro-components/src/lib/types.ts:1`.

### Work required

1. **`api-docs`: a `winui_build/` docfx pipeline** mirroring `blazor_build/`. Metadata
   inputs are the assemblies the samples reference —
   `Infragistics.WinUI.{Charts,DataGrid,Gauges,Maps,Layouts,Inputs,DataVisualization}`
   plus `Infragistics.Core{,.Charts,.DataGrid,.DataVisualization,.Maps}` and
   `Infragistics.Core.Platform.WinUI`. Needs a `filterConfig.yml`, a fetch step, and
   `platforms-config.json` entries for `winui` (and `uno`). **Open:** is there a
   `Infragistics.WinUI.*.Trial` NuGet package to fetch, or must this build from the
   `dev-tools/XPlatform` output that `winui-samples/**/Sample.csproj` references by
   `HintPath`?
2. **Write the missing registry generator** (step 5) — best placed in `api-docs`, which
   already holds the source JSON and the URL-shaping logic. Model it on
   `src/data/api-search-index.ts`, which walks exactly the right data and reuses
   `api-sections.ts` for member categorization; emit the `p/k/u/s/m` shape instead.
   This also retires the hand-maintained snapshots for the four existing platforms.
3. **`igniteui-astro-components`:** extend `PlatformName` (public repo, branchable).
4. **`igniteui-documentation`:** commit `src/data/api-link-index/{winui,uno}/*.json`,
   add both to `manifest.json`, and add `winui` / `uno` to
   `API_DOCS_FOLDER_BY_PLATFORM` — [src/integration.ts:118](src/integration.ts#L118).

---

## 6.3 Platform name divergence — what affordance exists

Short answer: **there is no rename map at render time.** Unlike the
`igniteui-xplat-docs` gulpfile, which resolved canonical → platform names through the
product-generated `apiMap/` JSON on every build, the Astro `ApiLink` resolves
*mechanically* against the registry. The affordances are:

| Affordance | Handles | Does not handle |
|---|---|---|
| `prefix` + `prefixed` prop (default `true`) | `Igx` / `Igr` / `Igc` / `Igb` prefixing. `buildCandidateNames()` tries **both** `${prefix}${type}` and the bare `type` | — |
| `classSuffix` + `suffix` prop | Angular/WC `…Component` suffix | — |
| Case-insensitive member match (`member`, `upperFirst`, `lowercase`, then normalized scan) | Blazor `SuspendNotifications()` ↔ React `suspendNotifications` | genuine renames |
| `pkg`, `kind` props | ambiguity between packages/kinds | renames |
| `label` prop | rendered text only | resolution |
| `PlatformBlock` around the whole `ApiLink` | anything, by hand | scale |
| Statuses `resolved / ambiguous / member-missing / missing / unavailable` | unresolved renders as highlighted code text + checker report | — |

The apiMap knowledge **is** used in this repo, but only at **authoring time**:
[docs/xplat/scripts/resolve-api-links.mjs](docs/xplat/scripts/resolve-api-links.mjs)
reads the `apiMap/*/*.apiMap.json` files (sibling `igniteui-xplat-docs` clone, else
fetched from GitHub raw) plus each topic's `mentionedTypes` frontmatter to convert
backticked names into `<ApiLink>`. It is **not wired into any npm script or workflow** —
a one-shot migration tool, not a build step.

### Measured exposure for the in-scope WinUI/Uno topics

| `<ApiLink type="…">` — 2,150 refs | count |
|---|---|
| canonical name identical to the doc name | 1,611 |
| doc uses the **unprefixed stem** (`RadialGauge`, `DataChart`, `DataLegend`, `GeographicMap`, `BulletGraph`, `LinearGauge`, `PieChart`, …) | 525 (18 distinct) |
| true divergence — `DataSource` → `IDataSource` | 14 (1 distinct) |

| `<ApiLink member="…">` — 1,034 refs | count |
|---|---|
| identical to canonical modulo casing | 1,002 |
| absent from the apiMap | 32 |
| **true rename** | **0** |

The apiMap contains 7,418 non-casing member renames (`ItemsSource` → `dataSource`,
`HighlightedItemsSource` → `highlightedDataSource`, `XAxis` → `barFragmentXAxis`,
`.ctor` → `init`), but they sit on members these DV topics never reference. **The
rename problem is real in the data and almost absent in the content we need.**

### Consequence — use the prefix mechanism, not an alias table

Verified against the actual WinUI sources (1,913 files in `winui-samples`): the
**controls** are `Xam`-prefixed (`XamRadialGauge`, `XamDataChart`, `XamDataGrid`,
`XamGeographicMap`, `XamBulletGraph`, `XamLinearGauge`, `XamPieChart`, `XamSparkline`,
`XamDoughnutChart`, `XamDataLegend`), while **helper types are not** — real WinUI uses
`RadialGaugeRange` and `LinearGraphRange`, even though the apiMap's legacy
`originalName` for those is `XamRadialGaugeRange` / `XamLinearGraphRange`. So the
apiMap originals are legacy-XAML canonical and are **not** a reliable source of modern
WinUI names.

Because `buildCandidateNames()` already tries the prefixed **and** bare form, setting
`prefix: 'Xam'` with `prefixed: true` (no `classSuffix`) resolves both shapes with no
new machinery: `RadialGauge` → tries `XamRadialGauge`, `RadialGauge`; `RadialGaugeRange`
→ tries `XamRadialGaugeRange`, `RadialGaugeRange`. Whichever the registry actually
contains wins. *(This supersedes an earlier `prefixed: false` note.)*

### 6.3.1 The mechanism is heuristic, and it fails silently

Two structural weaknesses, both confirmed by reading `findIndexedSymbol()` and by
measurement. **Neither is acceptable to rely on for a new platform**, so the mitigation
in §6.3.2 is part of the plan, not an optional extra.

**(a) "Which classes don't take a prefix?" — it does not know.** It brute-forces the
candidate list `[Igr+Type+Suffix, Igr+Type, Type+Suffix, Type]` and returns the **first
candidate name that yields exactly one match**. Unprefixed classes work only by the
*absence* of the prefixed name from the registry. When **both** exist with different
URLs, the prefixed one silently wins and the bare type is unreachable — and no
ambiguity is reported, because ambiguity is only detected *within* a single candidate
name, never across candidates:

| Platform | Shadowed bare names | Examples |
|---|---|---|
| React | 8 | `Calendar`, `Axis`, `Legend`, `Series`, `SeriesCollection`, `Sparkline`, `AxisCollection` |
| Blazor | 7 | `Axis`, `Legend`, `Series`, `SeriesCollection`, `Size`, `Sparkline` |
| Web Components | 4 | `SortingExpression`, `RenderFunction`, `AxisCollection`, `SeriesCollection` |
| Angular | 3 | `TransactionService`, `AxisCollection`, `SeriesCollection` |

The only per-type opt-out is writing `prefixed={false}` by hand in the MDX.

**(b) Per-platform member renames have no affordance at all.** Only casing variants are
tried (`member`, `upperFirst`, `lowercase`, then a normalized scan). A genuine rename
returns `member-missing`, the link degrades to highlighted code text, and nothing but
the checker notices.

**Current state for a shipping platform** — the resolver re-implemented faithfully and
run over all 280 English xplat topics for React, with `PlatformBlock` filtering applied
and `{Token}` types excluded (n = 6,182):

| Outcome | Count | Share |
|---|---|---|
| resolved | 5,722 | 92.6% |
| `missing` | 270 | 4.4% |
| `member-missing` | 190 | 3.1% |

≈460 `ApiLink`s already fail on React. The failures are exactly the categories in
question — `GeographicMap.WindowRect`, `SeriesViewer.Legend`, `CrosshairLayer.fill`,
`PolarLineSeries.line` (renames); `DataGrid`, `DataGridColumn`, `DataSource` (the legacy
DataGrid types — **the ones the Phase 3 port depends on**, absent from the React
registry today); and hardcoded cross-platform names leaking into shared content
(`IgbDataChart`, `IgcGrid`, `IgxDataChart`).

### 6.3.2 Interim posture — proceed on the heuristic, with eyes open

**Decision (D6): ship WinUI/Uno on the existing mechanism for now.** Set
`prefix: 'Xam'` with `prefixed: true` and no `classSuffix`; the resolver's
prefixed-then-bare candidate order covers `RadialGauge` → `XamRadialGauge` and
`RadialGaugeRange` → `RadialGaugeRange`. Accept that a share of links will not resolve
and will render as highlighted code text.

This is explicitly a **stopgap**, accepted to unblock Phases 0–5, not the intended end
state. The proper mechanism is §6.4 and is a committed follow-up, not a contingency.

Interim guardrails:

1. **Emit exact names, not stems,** in the generated registry — keep both the `Xam` and
   bare forms as real keys wherever both types exist.
2. **Make cross-candidate collisions visible.** Have `check-mdx-links` report when more
   than one candidate name matches with different URLs; today that resolves silently to
   the prefixed one. Benefits all four existing platforms immediately.
3. **Treat `member-missing` as a CI signal, not noise** — it is currently the only
   automated detector of a rename. Triage the ≈190 existing React cases before the new
   platforms add their own.
4. **Do not hand-patch MDX at scale** to work around resolution failures. Per-type
   `prefixed={false}` props and `PlatformBlock`-wrapped `ApiLink`s are debt that §6.4
   would then have to unpick. Cap hand fixes to the bounded set: the 32 unmapped
   members and the 14 `DataSource` → `IDataSource` refs.

---

## 6.4 Planned: restore apiMap-driven name resolution

**Position: the apiMaps are the correct mechanism for cross-platform name resolution,
and prefix-plus-casing guessing is not.** The product builds already generate the
authoritative canonical ↔ platform-specific mapping for every type and every member;
`igniteui-xplat-docs` consumed it on every build. The Astro docs dropped that and
substituted a heuristic, which is why ≈460 `ApiLink`s silently fail on React today
(§6.3.1). This section is a committed workstream to put it back — scheduled after the
WinUI/Uno launch, but planned and specified now so the interim work does not obstruct it.

### What the apiMaps provide

`igniteui-xplat-docs/apiMap/<Platform>/*.apiMap.json`, generated by the product builds:

```jsonc
{
  "types": [{
    "originalName": "PropertyEditor",                       // canonical (legacy XAML)
    "originalNamespace": "Infragistics.Controls.Description",
    "packageName": "igniteui-core",
    "names":   [{ "platform": "WebComponents", "mappedName": "IgcPropertyEditor", "fileName": "…" }],
    "members": [{ "originalName": "ActualProperties",
                  "names": [{ "platform": "WebComponents",
                              "mappedName": "actualDataSource", "mappedType": "…" }] }]
  }]
}
```

Coverage today: ~3,008 types per web platform (Blazor 2,349) and **7,418 non-casing
member renames** — `ItemsSource` → `dataSource`, `HighlightedItemsSource` →
`highlightedDataSource`, `XAxis` → `barFragmentXAxis`, `.ctor` → `init`. None of these
are recoverable by any prefix or casing rule.

### Design — bake the mapping into the registry, not the resolver

Preferred approach, because it needs **no** change to `igniteui-astro-components` and
**no** change to MDX:

1. The registry generator (§6.2 step 2) takes the apiMaps as a second input alongside
   the docfx/TypeDoc JSON.
2. For each symbol it emits, it adds **alias `symbols` keys** for every platform's
   `mappedName`, and **alias entries inside `m`** pointing at the canonical member's
   anchor. `<ApiLink member="dataSource">` then resolves against WinUI's `ItemsSource`
   anchor on the WinUI build, and against `dataSource` on the WC build.
3. Aliases carry provenance so the checker can distinguish "resolved via alias" from
   "resolved directly" and report alias coverage per platform.
4. **Precedence, not replacement.** The existing fuzzy matching (platform prefix,
   class suffix, case-insensitive members) **stays in place as the fallback**. An
   apiMap direct hit is authoritative and wins; where the apiMap has no entry, the
   current heuristic still applies. This keeps every link that resolves today
   working, and confines the change to adding correctness where the map knows better
   — rather than a flag-day switch to registry-only resolution.

   Resolution order becomes: **apiMap direct hit → registry exact name → prefixed /
   suffixed / case-folded candidates (today's behaviour)**.

Alternative, if aliasing in the registry proves insufficient: restore an authoring-time
resolution pass — extend
[docs/xplat/scripts/resolve-api-links.mjs](docs/xplat/scripts/resolve-api-links.mjs)
from a one-shot into a build step that rewrites canonical names to per-platform names in
generated output. Rejected as the primary approach because it re-introduces a build-time
content rewrite and cannot help the `ApiLink` runtime.

### Upstream dependency — apiMaps must cover WinUI and Uno

`names[]` currently carries only `Angular`, `React`, `WebComponents`, `Blazor`. **The
product builds must emit `WinUI` and `Uno` platform entries.** Do **not** substitute
`originalName`: it is legacy XAML and diverges from shipping WinUI — the map says
`XamRadialGaugeRange` / `XamLinearGraphRange` where real WinUI has `RadialGaugeRange` /
`LinearGraphRange` (verified against 1,913 files in `winui-samples`). Without real WinUI
entries the alias table is one-directional: usable to translate *web* names onto a WinUI
registry keyed by canonical names, but not authoritative for what WinUI actually calls
things.

Also to settle: where the apiMaps live once `igniteui-xplat-docs` is retired. Today the
only consumer resolves them from a sibling clone or GitHub raw
(`resolve-api-links.mjs`). They need a durable home — published artifact from the
product build, or vendored into `api-docs` beside the docfx output.

### Acceptance criteria

- Registry generator emits aliases; alias coverage reported per platform.
- React `ApiLink` resolution ≥ 99% (from 92.6%), `member-missing` → near zero.
- Fuzzy matching retained as the fallback; **no link that resolves today regresses**.
- Cross-candidate shadowing (`Calendar`, `Axis`, `Legend`, `Series`, …) reported by the
  checker, and resolved by an apiMap direct hit wherever the map covers the symbol.
- `DataGrid`, `DataGridColumn`, `DataSource` resolve on every platform that documents
  them.
- No `prefixed={false}` or `PlatformBlock`-wrapped `ApiLink` remains as a workaround for
  a name that the apiMap could have resolved.

---

## 6.5 Snippet generation: translation now, common-JSON emission later

### Where Phase 4 got to

The implemented pass ([add-xaml-snippets.mjs](docs/xplat/scripts/add-xaml-snippets.mjs))
*translates*: it reads the sibling web snippet in each group, maps names through the
apiMap, and sources element/attribute spellings and values from the real
`winui-samples` markup. Result: **84 of 149 snippet groups** covered, 168 blocks
across both locales, all well-formed, zero element names absent from the sample
corpus.

Every remaining gap and every bug found along the way traces to the same root cause —
translation has to *infer* what the target platform needs:

| Found by | Issue |
|---|---|
| review | children dropped (31 groups flattened away the nested structure the topic taught) |
| review | `*Name` properties are string references on the web, object bindings in XAML |
| review | data-chart series↔axis wiring differs structurally from web |
| accuracy test | apiMap inversion is ambiguous (`dataSource` → `ItemsSource` *or* `DataSource`) |
| accuracy test | dotted canonicals (`shapeStyle.strokeThickness`) are paths, not property names |
| XML check | 32 code-only groups cannot be served at all — no markup to translate |

### The better foundation

`igniteui-xplat-examples` already has the facility to take a **common JSON syntax and
emit the markup and code-behind for a sample, per platform**. Pointing that at snippets
removes the inference entirely:

- no web→XAML translation, so no apiMap inversion and no invention risk
- nesting is correct by construction — the emitter knows that XAML needs
  `<XamDataGrid.Columns>` where the web platforms take plain children
- **code-behind comes free**, which is the only way the 32 code-only groups get served
- **a snippet can force something into code-behind** rather than markup, per platform.
  This is not a nicety: the same concept is markup on one platform and imperative on
  another (a XAML `{Binding ElementName=…}` versus a web `xAxisName="xAxis"` string;
  a collection built in `OnLoaded` versus declared inline), and the doc often wants
  the imperative form shown deliberately. Translation cannot decide this — it only
  sees the shape the web snippet happens to have.
- one mechanism serves every platform, including WPF and MAUI when they arrive
- the `*Name` / axis-binding classes of bug stop being possible

**The missing capability is subsetting**: taking just the portion of a sample that a
given snippet should show. Today a sample is all-or-nothing, which is why the doc body
carries hand-sculpted minimal illustrations while the sample widget serves the full
source. Snippet-level regions in the JSON (named, referenced from MDX) would close it.

### Sandbox checking

Worth building either way, and it is what makes "all snippets check" enforceable rather
than aspirational. Two tiers, because they have different reach:

1. **Static validation — runs anywhere, including CI on Linux.** Verify every element,
   property and enum value against the apiMap plus the sample corpus, and parse each
   XAML block as XML. This is what Phase 4 already does; it catches names and shape but
   not types or bindings.
2. **Compile validation — requires Windows for WinUI.** Emit a project per snippet (or
   one project with many snippet `UserControl`s), build it, and attribute errors back to
   the originating snippet. This catches wrong types, wrong enum members, and broken
   bindings — the classes static checking cannot see. **It cannot run on macOS**, so it
   belongs in a Windows CI job.

The hard part is the ancillary binding requirements, and `LibraryProjectEmitter`
(`dev-tools/XPlatform/Main/Source/LibraryProjectEmitter/`) is the natural home: a mode
that emits all library items for WinUI at all required xmlns aliases, **exposing every
data alias on one common data context**, so any snippet resolves without per-snippet
scaffolding.

Measured against the 84 blocks currently emitted, that context is small:

| Requirement | Count | Values |
|---|---|---|
| Data-context properties bound | 11 | `EmployeesSalesData` (17), `ProductOrders` (4), `WorldCities`, `TemperatureAnnotatedData`, `CountryRenewableElectricity`, `CountryNames`, `WorldCapitals`, `SalesData`, `CountryRenewableCallouts`, `RealEstateData`, `NorthwindOrders` |
| `ElementName` targets | 4 | `grid`, `chart`, `xAxis`, `yAxis` |
| Distinct XAML elements | 38 | `XamDataGrid`, `TextColumn`, `ColumnWidth`, `GeographicSymbolSeries`, `CategoryXAxis`, … |

The same two-tier approach generalises to the other platforms — a React/WC/Blazor
snippet can be type-checked or compiled by the equivalent harness, which would catch
the pre-existing web-side defects this work already surfaced by accident (the jp
`IgbLinearGauge`, the unterminated tag, `IgbDataChart` leaking into shared content).

### 6.5.2 Decision — OPEN, and it should not be settled by default

Both paths converge on the **same prerequisite**, which is what makes this worth
deciding now rather than drifting:

> The 33 code-only groups (22%) are the ones translation **cannot serve at all** — there
> is no markup to translate, so they need C# either lifted from `Sample.xaml.cs` by hand-
> rolled extraction, or emitted by forcing code-behind. Either way, code-behind
> generation is the next piece of work.

That symmetry is the decision criterion:

| | Translation (continue) | Common-JSON emission |
|---|---|---|
| Covered today | 84/149 (56%) | 0, but the resolution table seeds it (§6.5.1) |
| Code-only groups | hand-rolled C# extraction from `Sample.xaml.cs` | forced code-behind, per platform |
| Verifiability | markup provable (copy + name-check + XML parse); **C# not locally verifiable** | three tiers: generated JSON schema validates the definition, emitter is deterministic, compile sandbox proves the output builds |
| Nesting / `*Name` / axis wiring | per-class guards, indefinitely | correct by construction |
| Other platforms, WPF/MAUI later | re-translate each time | same mechanism |
| Needs | nothing new | subsetting mechanism, bolstered forced-code-behind, back-conversion, emitter run environment |

**Consequence: the next increment of translation work is precisely the part that gets
thrown away if emission wins** — and it is also the least verifiable part, since there is
no local compile check for generated C#. Spending it twice is the avoidable outcome.

**A generated JSON validation schema closes the verification gap.** A schema can be
emitted for the input JSON, derived from the same component metadata the renderer uses —
so it stays in sync with the API surface instead of being hand-maintained. That matters
more than it first appears:

- **It replaces approximation with authority.** The translation path had to *infer*
  whether a name was real, via apiMap lookup plus a 279-sample corpus check — which is
  why absence from the corpus was only weak evidence. A generated schema validates
  element names, property names and enum values against the actual API surface.
- **It catches errors at authoring time**, in the editor, before emission — and in CI as
  a cheap gate that runs anywhere, no Windows needed.
- **It makes the subsetting syntax discoverable and validated**, which answers the
  earlier objection that a prefix-based marker would be ad hoc: whatever the selector
  shape, the schema documents and enforces it.
- Combined with the compile sandbox it gives two independent tiers — the schema proves
  the *definition* is well-formed and references real API, the sandbox proves the
  *emitted output* builds and binds.

**Feasibility — the honest read.** The pieces all exist; none of it is speculative:
`CodeGeneratingComponentRenderer` already emits samples and can pick markup or code;
the sample JSON already exists, so back-conversion is *mapping*, not authoring;
`LibraryProjectEmitter` is the natural home for the sandbox project and the common data
context, which the measurements show is small (11 bound properties, 4 `ElementName`
targets). The two genuine unknowns are:

1. **How universally forced code-behind can be made to work**, per platform — 22% of
   groups depend on it, and support is currently partial. This is the main feasibility
   risk and should be spiked first, because it gates the emitter path *and* is needed by
   the translation path anyway.
2. **Where the emitter runs.** Node against the latest WC npm packages is cheap but
   exercises the already-working platform; the WinUI alpha/released packages test the
   platform that actually needs proving, at the cost of a Windows job.

**Suggested way to settle it:** spike (1) against a handful of the 33 code-only groups —
one grid, one chart, one gauge. If forced code-behind can produce those three, emission
is feasible and translation should stop where it is (84 groups stand as-is, no C#
extraction written). If it cannot, that is decisive too: the translator continues and the
sandbox becomes the way to keep its output honest.

Either way, the static checks stay: apiMap + corpus name verification, XML
well-formedness, en/jp lockstep, and the byte-identical web-platform regression. They
caught every defect in this work so far and are independent of which path wins.

When the emitter path is picked up, the sequence is: sample subsetting in the common
JSON → per-platform snippet emission (with forced code-behind) →
`LibraryProjectEmitter` sandbox mode exposing the common data context → compile check in
Windows CI, static check retained as the fast gate. The requirement tables above are the
starting spec.

### 6.5.1 Design notes for the deferred work

**What subsetting actually has to express.** Measured over the 149 snippet groups in
non-suppressed topics:

| Share | Case | Consequence for the design |
|---|---|---|
| 93 (62%) | component **with its children shown** | the dominant case: "root element + the children under discussion", not arbitrary fragment extraction |
| 33 (22%) | element + properties mutated from **code-behind** | forced code-behind is load-bearing, not an edge case — see the prerequisite below |
| 9 (6%) | anemic full component definition | falls out of the dominant case with an empty child selection |
| 2 (1%) | individual child, surrounding scope implied | rare; a "root + implied ancestors" flag rather than its own mechanism |
| 12 (8%) | install commands / prose-only code | out of emitter scope; authored by hand |

So the mechanism needs: pick a root, pick which of its properties to show, pick which
children to include, and force any of it to code-behind. Arbitrary slicing is not
required.

**Prerequisite: forced code-behind needs bolstering before this path is viable.**
`CodeGeneratingComponentRenderer` supports forcing code in some cases, but not
universally, and coverage differs by platform. At 22% of all groups — the second-largest
case, and the one the translation pass cannot serve at all — this is not a detail to
discover late. Scope it as explicit work in its own right: audit which
element/property/platform combinations can currently be forced to code-behind, then
close the gaps, per platform. Until that holds, the emitter path cannot replace
hand-authored snippets for a fifth of the corpus, and any migration would stall exactly
where the translator already stalls.

**Marker syntax — a name prefix is probably not enough.** A prefix on property or type
names (stripped at emit time) keeps the sample JSON valid and colocates the intent, but
it cannot express *per-snippet* membership, and one sample commonly backs several
snippets — `grids/data-grid/overview.mdx` alone draws four groups from one sample. A
property in snippet A but not snippet B has no single prefix. Options that do scale:

- **Named snippet regions declared beside the sample definition** — each names a root,
  an include list of properties, a child selection and an `emitAs: markup | code-behind`.
  The sample definition stays pristine and MDX references `sample=X#snippet=sorting`.
  Costs a small schema.
- **Tags on elements/properties**, with a snippet selecting by tag. Colocated and
  supports many snippets per sample, at the price of verbosity in the sample JSON.

**Back-conversion is cheaper than it looks.** Converting today's snippets to shared JSON
is *not* authoring from scratch: the sample JSON already exists (it is what emits the
samples), so back-conversion means mapping each doc snippet to a subset selector over an
existing sample. Phase 4 already computed that mapping — `add-xaml-snippets.mjs` resolves
each group to a concrete (sample, element) pair, and 84 groups resolve today. That
resolution table is the seed for back-conversion, and the residual gaps are already
enumerated by class.

**Where to run the emitter.** Node against the latest Web Components npm packages is the
cheaper CI path but exercises the platform that already works; running the emitter from
the alpha/released **WinUI** packages tests the platform whose output is least proven and
is the only way to validate XAML-specific shapes (property-element collections, element
bindings). Suggested split: WinUI emitter run as the correctness gate in Windows CI,
node/WC as a fast smoke check everywhere else.

---

## 6.6 Spike findings — emitter path is more feasible than assumed

Researched against `dev-tools` on branch **`gmurray/winui`**, which already carries WinUI
emission work. Three questions, three answers.

### 1. Forced imperative code emission — in better shape than feared

There are **two** granularities, not one:

| Mechanism | Scope | State |
|---|---|---|
| `CodeGenerationRendererOptions.ForceCodeBehind` | whole emission | implemented for every doc-relevant platform |
| `MustSetInCode(context, val)` | **per property**, virtual | implemented, and already overridden by the WinUI emitter |

Markup *and* code-behind emitters both exist for Angular, React, WebComponents, WPF,
WinUI/Uno and Blazor. Code-behind-only platforms (WindowsForms, Kotlin, Swift) are
irrelevant to this doc set.

Two details that matter:

- `CodeGenerationTargetPlatforms.WinUI` **and `.Uno` already exist**, dispatching to
  `WinUIXamlCodeGeneratingComponentRendererCodeEmitter : WPFXamlCodeGeneratingComponentRendererCodeEmitter`.
  The subclass exists specifically to handle where WinUI XAML cannot do what WPF can —
  `string[]` and typed enum collections have no property-level TypeConverter and a null
  getter, and `x:Static` is WPF-only — so it routes those through `MustSetInCode` instead.
  That is real, considered work, not a stub.
- **"Cheat and use WPF" is already the implemented design for code-behind.** WinUI/Uno
  `ForceCodeBehind` deliberately returns the *WPF* code-behind emitter, which already
  rewrites namespaces on the way out: `System.Windows.Media` →
  `Microsoft.UI.Xaml.Media` + `Windows.UI` + `Microsoft.UI`, and
  `System.Windows.Controls` → `Microsoft.UI.Xaml.Controls`.

**So the gap is not in the C# mechanism.** Per-property routing to code already exists,
which is what case (c) — "show how to mutate properties from code-behind" — needs.

### 2. Node + public packages, or .NET?

The emitters **are transpiled and ship in `igniteui-core`**. Present in the built TS
surface: Angular (template + code-behind), React (markup + code-behind), WebComponents
(markup + code-behind), Blazor (razor + code-behind), GTK, Kotlin, Swift, WindowsForms,
and — importantly — **`WPFXamlCodeGeneratingComponentRendererCodeEmitter` and
`WPFCodeBehindCodeGeneratingComponentRendererCodeEmitter`**.

Not shipped: the **WinUI subclass**, because it is new on this branch and has not been
transpiled yet.

The one genuinely missing JS capability is **loading the code-gen library from disk**:

| | .NET | JS/TS |
|---|---|---|
| `FromJson(string)` / `fromJson` | yes | yes |
| `ToJson()` / `toJson` | yes | yes |
| Load from disk (`File.ReadAllText`, `-CONFIG.json`) | yes — several paths | **no** |

So JS needs a **prebaked JSON of the library**, exactly as suspected.

#### Preferred fix: make `CodeGenerationLibrary` usable from web, via injected file access

Since the product will need amending anyway for subsetting, the better move is to make the
library loadable from JS rather than to reimplement its behaviour — the categorization and
partitioning rules are the valuable part and must not be duplicated or allowed to drift.

**The product must never reference node.** The dependency is injected inward:

```
CodeGenerationLibrary.FromFolder(path, fileAccess)   // fileAccess passed in
        │
        ├── .NET caller  → System.IO-backed implementation  (stays behind #if WPF || PCL)
        └── node caller  → fs-backed implementation written in TS/JS, outside the product
```

The interface itself is plain and transpiles; only the *System.IO implementation* stays
guarded. The product gains no knowledge of node, and the JS build carries no `System.IO`
reference.

**The required surface is small** — 7 call sites over 4 APIs:

| API | Call sites |
|---|---|
| `File.ReadAllText` | 6 |
| `File.Exists` | 5 |
| `Directory.Exists` | 3 |
| `Path.*` (`GetFileNameWithoutExtension`, `GetExtension`, `GetDirectoryName`, `Combine`) | 5 |
| `DirectoryInfo.GetDirectories()` / `.GetFiles()` | 2 |

so roughly `fileExists`, `directoryExists`, `readAllText`, `getFiles`, `getDirectories`,
plus pure-string path helpers.

**What then stays shared, in one place** — this is the behaviour worth protecting:
`GetItemType`'s data/template/event-handler categorization; `AddPlatformsFromFile`'s
per-type dispatch; the region extraction regexes (`begin template`, `begin content`,
`begin imports`, `begin styles`, `begin supportingMethods`, `begin supportingTypes`,
`begin eventHandler`, `begin emitterOnly`, `begin data`, `begin async data`);
`LoadConfig`'s `-CONFIG.json` handling; the `INFO.txt` / `SOURCE.txt` skips; and the
`Tests` folder recursion in `ProcessFolders`.

**One non-IO blocker to fix in the same change.** `GetPlatformFromFile` resolves a
filename to a platform by reflection (`typeof(CodeGenerationLibraryItemPlatform).GetFields()`),
which will not transpile. `ParsePlatform` next door does the same job with
`Enum.TryParse(val, true, out p)` and sits *outside* the guards — so it already transpiles.
Rewriting `GetPlatformFromFile` to use that removes the last platform-specific dependency,
after which there is little reason for the `#if WPF || PCL` guard around the loading logic
to exist at all.

**Note the build implication:** node needs the *rebuilt* `igniteui-core` TS, not the
currently published npm package — the disk-loading gap persists until the product change
is transpiled.

#### Verified build facts (spike, `dev-tools` branch `gmurray/json-snippets`)

| Check | Result |
|---|---|
| Local transpile on **macOS** — `dotnet build DV.Shared.DESCRIPTION.JS.csproj` | **works**: 0 errors, ~72s (dotnet 8.0.414; `Translator/bin/buildNC` is prebuilt) |
| TS emitted | `TS/igniteui-core/CodeGenerationLibrary.ts` + `…Item`, `…ItemType`, `…ItemPlatform`, `…ItemContentConfiguration` |
| Emitters emitted | all, including **`WPFXamlCodeGeneratingComponentRendererCodeEmitter.ts`** and `WPFCodeBehindCodeGeneratingComponentRendererCodeEmitter.ts` |
| Disk loading in the JS surface | **absent** — built TS exposes only `fromJson` / `toJson` / `hasItem` / `getKeys` / `getItem`, confirming the `#if WPF \|\| PCL` guard is what excludes it |
| WinUI emitter on this branch | **absent** — that work is on `gmurray/winui`; so XAML emission here means the **WPF** emitter, which is consistent with snippets omitting `xmlns` |

**Ingestion pattern to copy** — `XSharpTestHost.WC` already does exactly what the spike
needs, so it is a proven mechanism rather than a new one:

- `gulp productSource` copies local TS from `Source/*.JS/**/bin/**/TS/**/*.ts` (plus
  `Translator/bin/<cfg>/TS`, `WCCore`, `TSCore`) into `src/ig/igniteui-core`, synthesising
  an `index.ts` per directory.
- `tsconfig.json` `paths` map `igniteui-core/*` → `src/ig/igniteui-core/*` **first**, with
  `node_modules/igniteui-webcomponents-core` as fallback — so a local build shadows the
  published package without any other change.

#### Product change — done, plus one blocker found by doing it

Applied to `CodeGenerationLibrary.cs` on `gmurray/json-snippets`:

- **`ICodeGenerationLibraryFileAccess`** — 5 members (`FileExists`, `DirectoryExists`,
  `ReadAllText`, `GetFiles`, `GetDirectories`), marked `[DontHide]` / `[DontObfuscate]`,
  passed *into* `CodeGenerationLibrary`. The product references no host file API.
- **`SystemIOCodeGenerationLibraryFileAccess`** — the System.IO implementation, left
  behind `#if WPF || PCL`; `FromFolder(path)` keeps working on .NET by delegating to
  `FromFolder(path, fileAccess)`.
- **Guard narrowed** so the shared loading logic (categorization, partitioning,
  region extraction, `-CONFIG.json`, `INFO.txt`/`SOURCE.txt` skips, `Tests` recursion)
  compiles on every platform.
- **Path helpers** added as pure string operations, handling both separators, rather than
  widening the interface.
- **Reflection removed** from `GetPlatformFromFile` in favour of `Enum.TryParse`, matching
  what `ParsePlatform` already does.

`CodeGenerationLibrary` was already `[DontHide]` / `[DontObfuscate]` at class level.
**A release build still needs checking for obfuscation issues.**

**⚠️ Blocker: the JS build has no working regex, so region extraction cannot run there.**

| Finding | Detail |
|---|---|
| `System.Text.RegularExpressions` | not available in the JS build; the codebase aliases `Regex = System.RegExp` under `TINYCLR` |
| `System.RegExp` mock surface | `Exec(string): string`, `Test`, `Compile` — **no capture-group or match-index access**, and the loading path needs group 4 in 10 places across 11 patterns |
| `CodeGeneratingRegexHelper.Execute` | its `TINYCLR` branch **returns `input` unchanged — a no-op** |

That last point is a latent product issue well beyond this spike: the **Angular** emitter
uses `CodeGeneratingRegexHelper` in ~9 places (`import {…} from …` rewriting, `Ig[crx]`
renaming, `CodeGenHelper.getDescription<…>` / `findByName<…>` substitution, event-arg
rewriting), so **Angular emission from a JS/WC build is silently degraded today**.

**There is an established fix, and it needs no translator change.** `Script.Literal` is
already used to reach native JS regex:

```csharp
#if JS
    _exp = (RegExp)Script.Literal("new RegExp(patt_)");     // DataSeriesDataProviderAnalyzer
#elif JAVA || SWIFT || KOTLIN
    _exp = new RegExp(patt_);
#else
    _exp = new Regex(patt_);
#endif
```

(also in `RevealCore/BaseRendererComponent.cs`). So `CodeGeneratingRegexHelper`'s JS branch
can be implemented with `Script.Literal` to run a global regex and expose group values,
match index and length — reproducing the .NET branch's reverse-and-splice semantics —
without touching the corelib mock. Fixing it there benefits every JS-built consumer, not
just snippet emission.

**Next steps in order:** implement the JS branch of `CodeGeneratingRegexHelper` → rebuild
`DV.Shared.DESCRIPTION.JS` and confirm `fromFolder` appears in the emitted TS → write the
node-side `ICodeGenerationLibraryFileAccess` over `fs` → ingest local TS the way
`XSharpTestHost.WC` does → round-trip against the 84 existing XAML blocks.

Two ways to bridge it in the meantime, the second avoiding .NET in the loop:

- **Bake with .NET**: run `ToJson()` once and commit/publish the result; node consumes it
  via `fromJson()`. Simplest, but puts a .NET step in the pipeline.
- **Reimplement the library parse in node** — likely the better option. The disk-loading
  side is not complex: it walks the `igniteui-xplat-examples` code-gen library files and
  the adjacent `-CONFIG.json`, then hands the result to the same `FromJson` shape the JS
  `CodeGenerationLibrary` already accepts. Since `fromJson` is public on the TS side, a
  node-side loader only has to *produce that JSON* — it does not need to replicate any of
  the emitter logic. That keeps the whole prototype in node with public packages and no
  .NET in the loop.

**Recommended prototype: node + the public packages, using the WPF XAML emitter.** This
works because of a decision already taken for other reasons — snippets omit the `xmlns`
declaration (§6.3 / D-WPF), and that declaration is the principal WPF↔WinUI XAML
divergence. The residual delta is the enumerable `MustSetInCode` set above.

Fallback if the WPF emitter proves too divergent: .NET with the **`.Core` assemblies**
from the WinUI NuGets. Emission is netstandard code, so this likely does **not** need
Windows — only the *compile sandbox* does.

### 3. Marking include/exclude in the JSON

- The library and template JSON are read through a generic dictionary model
  (`JsonDictionaryItem`, `FromJson`/`ToJson` throughout), so **additive marker keys are
  feasible** without disturbing existing parsing.
- **No JSON-schema emitter exists yet** in the DV shared source — emitting one is new
  work, which matches how it was raised. That is also the reason a marker convention need
  not be constrained by an existing schema: the emitter can be extended alongside it.
- On ergonomics: a **name prefix cannot express per-snippet membership** (§6.5.1 — one
  sample commonly backs several snippets, and a property may be in one and not another).
  A sibling key (`"$snippet": ["sorting"]`) or a separate `snippets` section keyed by name
  both scale, keep the sample definition valid, and are straightforward to describe in a
  generated schema.

### Verification: round-trip against what already exists

The 84 XAML blocks currently in the content are the comparison corpus. If the emitter can
reproduce them — same element, same property set, same nesting — the path is proven on
real cases rather than on a toy. The resolution table from Phase 4 supplies each block's
(sample, element) pair, so the comparison is mechanical.

**Verdict: worth doing the spike.** The pieces that exist are further along than assumed
(WinUI/Uno target platforms, a WinUI emitter subclass, per-property code routing,
transpiled WPF XAML emitter). The genuinely new work is narrow: prebake the library JSON,
choose a marker convention, and extend the schema emitter.

---

## 6.7 Snippet marker design — recording zones

Settled direction: **the sample JSON stays complete and runnable**, and snippets are cut
from it by marking regions. Keeping the definition whole is what makes automated snippet
tests and screenshot capture possible later, so nothing here may reduce a sample to a
fragment.

### Why recording, not filtering

A subset *selector* cannot express the important cases. Consider wanting to show only two
property assignments on a `LineSeries` — no construction of the series, no chart. Filtering
the definition would remove the context the emitter needs; recording does not:

> The emitter walks the entire runnable definition as usual. Output is only **recorded**
> while inside an inclusion zone (or outside an exclusion zone). The two assignments are
> captured; the constructor lines are walked but discarded.

**This has a single place to live.** `CodeGeneratingCodeWriter` holds one `StringBuilder`
and every emitter writes through `Write` / `WriteLine` / `WriteCode` / `NewLine`. Gating
those four is the whole mechanism — no per-emitter changes.

### Markers

Prefix the *name* of an element type or property in the JSON. The prefix is stripped before
the description model sees the name, and retained as metadata the emitters consult:

| Part | Meaning |
|---|---|
| `+` / `-` | begin an inclusion zone / an exclusion zone |
| id | which snippet the zone belongs to — one runnable sample can back several snippets, which is the common case (the Data Grid overview topic draws four) |
| channel | which output the snippet wants (below) |

### Channels — and two different mechanisms

Default is the **main markup**. Two other channels are needed, and only one of them is a
recording zone:

| Channel | Wanted output | Mechanism |
|---|---|---|
| markup *(default)* | the platform's markup form | recording gate over emission |
| code-behind | the imperative form — e.g. property assignment rather than an attribute | recording gate over emission, with `ForceCodeBehind` / `MustSetInCode` for that region |
| handler | a library event handler, **essentially verbatim** | **not emission at all** — read directly from the library |

That last row matters for scoping: the handler text already exists as extracted content on
the library item (`CodeGenerationLibraryItem.getContentForPlatform(...)` → the `handler`
field that `ExtractEventHandlerContent` produced from `WinUI.cs`/`Web.ts`/…). A snippet
asking for a handler needs a *lookup*, not a code-generation pass — so the marker's job
there is only to name which library item and which channel.

### Open points for the syntax

- **Delimiting.** The prefix must be strippable without ambiguity against real names, and
  must keep the JSON valid. A delimited token — `~+sorting:code~HeaderClickAction` — is
  unambiguous and easy to strip; a bare sigil (`+HeaderClickAction`) reads better but
  cannot carry an id or channel.
- **Schema.** The generated JSON schema (§6.5) must accept marked names, i.e. property
  names become pattern-based rather than a fixed enumeration. This is the extension already
  anticipated for the schema emitter.
- **Indentation rebasing.** The writer tracks indent through `IncreaseIndent` /
  `DecreaseIndent`. Recording that opens six levels deep would emit a deeply indented
  snippet; the gate should capture the indent at record-start and subtract it.
- **Line granularity.** `Write` emits partial lines, so toggling mid-line could split
  output. Markers sit on element/property boundaries, so the gate should open and close at
  line boundaries.
- **Zone nesting.** Inclusion inside exclusion (and vice versa) needs defined precedence;
  a small stack in the writer covers it, consistent with how `PlatformBlock` nesting is
  handled in the docs pipeline.

---

## 7. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | **API links.** 7,383 `<ApiLink>` usages across 232 topics need a WinUI/Uno registry. The chain is understood (§6.2) but **no registry generator exists in any repo** — the four current snapshots are hand-made, so this is net-new tooling plus a new docfx pipeline, on a repo (`api-docs`) this plan does not own. | Build the generator early (§6.2 step 2) — it is the long-lead item and it also de-risks the existing four platforms. Until it lands, `ApiLink` renders highlighted text and the checker reports unresolved, so content work in Phases 3–4 is **not blocked**, only its CI gate is. |
| R2 | **Filtering migration blast radius.** ~250 toc entries plus many `PlatformBlock`s change in Phase 1; a mistake silently drops content from a *shipping* web platform. | Script the migration from a checked-in table; gate on a before/after page-inventory diff per web platform. |
| R3 | **`igniteui-astro-components@0.0.27` is external.** It owns `PlatformName`, `Sample.astro`, `ApiLink.astro` and the sidebar types. Adding platforms may require a package release outside this repo. | `PlatformName` is already duplicated locally in `api-platform-config.ts` — import from there. For `Sample` / `ApiLink` behaviour, decide package bump vs. local override early (§8 Q3); it gates Phase 2 and R1. |
| R4 | **Snippet quality.** Raw `Sample.xaml` includes property-editor and layout scaffolding; naive extraction produces noisy, misleading snippets. | Manual or template-driven extraction of the control element + relevant handler; treat generated snippets as drafts. |
| R5 | **Web-grid token machinery.** `{ComponentSample}`, `_componentKey` frontmatter and the `grids/_shared/` templates exist for the four web grids. A WinUI build must not expand them. | Covered by `include: ["Web"]` on those topics; verify `generate.mjs` shared-file expansion is skipped for the new platforms. |
| R7 | **The `ApiLink` resolver is heuristic and fails silently** (§6.3.1). It brute-forces prefixed/bare candidates and takes the first single match, so it cannot know which classes are unprefixed and silently shadows bare names when both forms exist (8 in React, 7 Blazor, 4 WC, 3 Angular). Per-platform member renames have no affordance at all. **≈460 `ApiLink`s already fail on React (92.6% resolved)** — including `DataGrid` / `DataGridColumn` / `DataSource`, which the Phase 3 port depends on. WinUI/Uno is the worst case: shared MDX carries web-mapped names, the registry will carry canonical XAML names. **Accepted for the launch** (D6, §6.3.2) with guardrails: exact names in the registry, cross-candidate collisions reported by `check-mdx-links`, `member-missing` treated as a CI signal, and no large-scale hand-patching of MDX. **Fixed properly by Phase 7 / §6.4** — the apiMaps re-incorporated as the resolution mechanism. Do **not** treat apiMap `originalName` as the modern WinUI name — it is legacy XAML (`XamRadialGaugeRange` vs the real `RadialGaugeRange`). |
| R6 | **Uno ≠ WinUI in packages/namespaces.** Snippets authored as `for="NonWeb"` may be wrong for Uno where assembly or `using` lines differ. | Establish the Uno package/namespace story before Phase 4 (§8 Q5); split blocks where they differ. |

---

## 8. Open questions (need answers from outside this repo)

1. ~~**Branding & URLs**~~ — **settled.** These ship under the **Ultimate UI** brand,
   not Ignite UI:
   | | WinUI | Uno |
   |---|---|---|
   | `productName` / `title` | Infragistics Ultimate UI for WinUI | Infragistics Ultimate UI for Uno Platform |
   | `{ProductNameShort}` | Ultimate UI | Ultimate UI |
   | switcher `label` | WinUI | Uno Platform |
   | `base` | `/products/ultimate-ui-winui/winui/components` | `/products/ultimate-ui-uno/uno/components` |
   | `productSpinal` | `ultimate-ui-winui` | `ultimate-ui-uno` |

   No `ignite-ui` in either slug. The `{ProductLink*}` tokens keep their `ignite-ui-*`
   slugs — they are cross-links to the Ignite UI products, not to these.
   Still open: whether these appear in the existing Infragistics nav / product switcher.
2. **API reference** — resolved into concrete work in §6.2. Remaining unknowns:
   (a) is there an `Infragistics.WinUI.*.Trial` NuGet package for the docfx fetch step,
   or does it build from the `dev-tools/XPlatform` output? (b) who owns adding the
   `winui`/`uno` pipeline to `api-docs`? (c) what are the Uno assembly names?
3. **`igniteui-astro-components`** — public repo, so branchable. Only `PlatformName`
   (`src/lib/types.ts:1`) blocks Phase 0; the ApiLink resolver needs no change. Confirm
   release cadence so this repo can consume a version rather than pin a fork.
4. **Uno WASM host** — owner, build pipeline, and staging/production URLs. Does it
   reproduce the `/code-viewer/*.json` contract, or does `Sample` need a new mode?
5. **Uno samples** — shared source with `winui-samples` plus an Uno head project, or a
   separate repo? What are the Uno package IDs and namespaces?
6. **Locales** — assume `en` only for v1; confirm whether `jp` is expected, since
   `toc.json` exists per locale and the migration would need to cover both.
7. **Mobile platforms** — names and grouping, so `PLATFORM_GROUPS` is right the first
   time (`NonWeb` chosen over `Xaml` specifically to accommodate them).

---

## Appendix A — key files

| Concern | File |
|---|---|
| Platform registry, nav, ports, base URLs | [src/platform.ts](src/platform.ts) |
| API package config, `PlatformName`, `PLATFORM_MAP` | [src/lib/api-platform-config.ts](src/lib/api-platform-config.ts) |
| Per-platform product metadata, api-link index loading | [src/lib/platform-context.ts](src/lib/platform-context.ts) |
| Token substitution, `PlatformBlock` inlining, toc filtering | [docs/xplat/astro.config.ts](docs/xplat/astro.config.ts) |
| Per-platform tokens, sample hosts, api roots | [docs/xplat/docConfig.json](docs/xplat/docConfig.json) |
| Navigation source | [docs/xplat/src/content/en/toc.json](docs/xplat/src/content/en/toc.json) |
| docfx-era generator (platform blocks, shared expansion) | [docs/xplat/scripts/generate.mjs](docs/xplat/scripts/generate.mjs) |
| Authoring rules for conditional content | [docs/xplat/AI-AGENT-PLATFORM-BLOCK.md](docs/xplat/AI-AGENT-PLATFORM-BLOCK.md), [docs/xplat/PLATFORM-LABELS.md](docs/xplat/PLATFORM-LABELS.md) |
| Un-ported Data Grid source | `igniteui-xplat-docs/doc/en/components/grids/data-grid/` |
| WinUI sample sources + route table generator | `winui-samples/samples/`, `winui-samples/scripts/ingest-samples.ps1` |
| API doc generation, docfx pipeline, platform registry | `api-docs` (private, default branch `vnext`) — `blazor_build/`, `scripts/blazor.js`, `src/data/platforms-config.json`, `src/data/api-search-index.ts` |
| `ApiLink` runtime + resolver + `PlatformName` | `igniteui-astro-components` (public, `master`) — `src/components/mdx/ApiLink/`, `src/lib/types.ts` |
| Committed registry snapshots | [src/data/api-link-index/](src/data/api-link-index/) + `manifest.json` |

## Appendix B — useful commands

```bash
# per-platform dev (existing platforms)
npm run xplat:dev:react

# full link-check chain as CI runs it
npm run check-relative-links:ci

# metadata / lint / spelling
npm run check:llms-metadata && npm run lint:md && npm run spellcheck

# PlatformBlock balance check on a file
grep -c '<PlatformBlock' file.mdx; grep -c '</PlatformBlock>' file.mdx
```

## Appendix C — sample-route triage list (42)

Referenced by in-scope topics, no matching folder in `winui-samples`. Per D5 these do
**not** suppress any topic — triage each as (a) hand-authored sample that never
existed in the examples repos, (b) route-name drift, or (c) genuine backfill.

```
charts/category-chart/column-chart-with-highlighting
charts/category-chart/high-frequency
charts/category-chart/high-volume
charts/category-chart/line-chart-with-animations
charts/category-chart/line-chart-with-annotations
charts/category-chart/marker-templates
charts/category-chart/tooltip-template
charts/data-chart/axis-crossing
charts/data-chart/axis-sharing
charts/data-chart/chart-navigation
charts/data-chart/composite-chart
charts/data-chart/crosshair-layer-styling
charts/data-chart/dash-array-axes
charts/data-chart/dash-array-series
charts/data-chart/final-value-layer-styling
charts/data-chart/radial-proportional-category-angle-axis
charts/data-chart/range-bar-chart
charts/data-chart/scatter-marker-options
charts/data-chart/series-value-overlay
charts/data-chart/stacked-chart-types
charts/data-chart/timeline-axis-type
charts/data-chart/tooltip-template
charts/data-chart/type-scatter-area-series
charts/data-chart/type-scatter-contour-series
charts/data-chart/type-scatter-hd-series
charts/data-chart/type-scatter-polygon-series
charts/doughnut-chart/selection
charts/financial-chart/axis-types                      # component excluded (no WinUI samples)
charts/financial-chart/data-legend                     # ”
charts/financial-chart/data-legend-formatting-currency # ”
charts/financial-chart/data-legend-styling-props       # ”
charts/financial-chart/data-tooltip                    # ”
charts/financial-chart/data-tooltip-formatting-currency# ”
charts/financial-chart/data-tooltip-styling-props      # ”
charts/financial-chart/multiple-data                   # ”
charts/financial-chart/trendlines                      # ”
charts/pie-chart/animation
charts/pie-chart/explosion
charts/pie-chart/selection
charts/sparkline/display-types
charts/sparkline/grid
charts/zoomslider/overview                             # control coming; sample needed
grids/data-grid/type-marketing-table
```

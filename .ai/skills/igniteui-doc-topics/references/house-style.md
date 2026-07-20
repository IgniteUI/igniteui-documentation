# Ignite UI house style

The Ignite UI documentation conventions an authored or audited topic must follow. Pair this with
`diataxis-cheatsheet.md` (the *why*) and the section→mode map in `SKILL.md`.

> **Current vs target state.** The live `vnext` repo is *pre-standardization* — many topics use
> drifted headings (e.g. `## Angular Rating Example`, `## Configuration`). This file describes the
> **target** standard (revision-2 blueprint). When **authoring**, write to the target. When
> **auditing**, measure against the target and report the gap.

## Two doc sets

| Doc set | Frameworks | Path (vnext) | Layout | One topic = |
|---|---|---|---|---|
| **Angular** | Angular only | `docs/angular/src/content/en/components/` | flat `*.mdx` | one framework |
| **xplat** | React · Web Components · Blazor | `docs/xplat/src/content/en/components/<category>/` | categorized `*.mdx` | **one file, all three frameworks** |

The **same section list, order, and names apply to both sets.** Differences are mechanical only (see
Per-framework mechanics), never the shape of the page. **Dependencies** appears in both sets — it
covers modules to import (Angular) or supporting components/themes required to render or function
(xplat); currently seen as `## Theming Dependencies`.

## File format & frontmatter

Topics are **Astro `.mdx`**. Frontmatter is YAML. Observed + target fields:

```yaml
---
title: "Angular Star Rating Component – Ignite UI for Angular - MIT license"   # SEO title
description: "…"           # <=~160 chars, shaped as an answer ("X is a … that …")
keywords: "…"              # comma-separated
license: MIT
mentionedTypes: ["Rating"] # xplat: API types referenced on the page
llms:
  description: "…"         # AI-facing one-liner; the exact text an assistant uses to summarize
relatedComponents: [Toast, Banner]   # TARGET field — drives the Usage Do/Don't trigger (see below)
---
```

- **`llms.description`** already exists in both sets and is high-value — write it as a crisp,
  self-contained answer sentence. It is *not* optional filler.
- **`relatedComponents`** is the revision-2 trigger and is **not yet in the repo**. When authoring to
  target, set it. When auditing, treat a missing-but-warranted value as a finding, and a set value
  with no **Usage** → **Do/Don't** guidance as a hard error.

### MDX imports (declare what you use)

```mdx
import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';
import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';
import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';
import PlatformBlock from 'igniteui-astro-components/components/mdx/PlatformBlock.astro';  # xplat only
```

## Per-framework mechanics

- **Prefixes differ by framework/library — don't assume one for all:**
  - **Angular** → native **`igniteui-angular`**, **`igx-`** tags / **`Igx…Component`** classes. The
    Angular doc set documents this library.
  - **Web Components** → **`igniteui-webcomponents`**, **`igc-`** tags / **`Igc…Component`** classes.
  - **React** → **`igniteui-react`**, a **wrapper around the `igc`** web components.
  - **Blazor** → **`igniteui-blazor`**, a **wrapper around the `igc`** web components.
- **Net effect:** the **xplat doc set (React / WC / Blazor) is entirely `igc`-based** — WC is `igc`
  directly; React and Blazor wrap it. The **Angular doc set is `igx`**.
- **Exception — WC-first components in the Angular docs.** Some newer components are built as web
  components and surfaced in the Angular docs via the `igc` element rather than a native `igx` one
  (verified: the Angular **Rating** topic installs `igniteui-webcomponents`, registers
  `IgcRatingComponent`, and renders `<igc-rating>`). So **don't assume `igx` for every Angular topic** —
  verify the tag/class per component.
- **Angular set:** plain prose, no platform tokens. Registers and renders whichever the component is
  (`igx-…` native, or the `igc-…` WC for the exceptions above).
- **xplat set:** the *same file* serves React / WC / Blazor via:
  - **Tokens** the build resolves: `{Platform}`, `{ProductName}`, `{PackageWebComponents}`,
    `{PackageReact}`, `{PackageBlazor}`, etc. Use them in title/description/keywords/headings and prose
    — never hard-code "React" where a token belongs.
  - **`<PlatformBlock for="WebComponents">…</PlatformBlock>`** to wrap framework-specific content
    (install commands, imports, snippets). `for` values: `WebComponents`, `React`, `Blazor`.
- **Live samples** embed the same way in both sets:
  `<Sample src="/inputs/rating/basic" height={150} alt="{Platform} Rating Basic Example" />`
- **API links** use `<ApiLink …>` rather than hand-written URLs so they resolve per framework.

## Never fabricate API identifiers (zero-risk rule)

The skill's job is structure and prose, **not** to invent the API surface. Do **not** emit a guessed
tag, class, package name, property, method, event, CSS part, or theming variable. A plausible-but-wrong
name that a reader copies is worse than an obvious gap.

- Use an identifier **only** when it is verified — from the component's typed API source, an existing
  topic, or the user. The naming patterns are known (Angular `igx-<name>` / `Igx<Name>Component`; WC and
  its React/Blazor wrappers `igc-<name>` / `Igc<Name>Component`), but the pattern is not a licence to
  guess — confirm the exact prefix *and* `<name>` per component (some Angular topics are `igc` — see the
  exception above).
- When you must reference an unverified identifier, write a visible placeholder instead of a guess:
  `‹VERIFY: exact export name›`. For a table, emit the fixed column headers and a single injection note
  — invent no rows.
- This applies equally to React/Blazor wrapper symbols: they resolve to the `igc` core, so prefer the
  verified `igc` usage and mark any wrapper-specific class you can't confirm with `‹VERIFY:…›`.
- **`<ApiLink>` targets are identifiers too.** A `type` that exists in the source is not enough — it
  must have a generated reference page, and the only reliable check is an existing `<ApiLink>` with that
  `type` elsewhere in the doc set. Abstract/base classes in particular (e.g. `ButtonBase`) may appear in
  `mentionedTypes` yet have no page — the rendered link (e.g. `IgrButtonBase`) points nowhere. Link base-class
  members through the concrete component instead (`type="Button" member="href"`), and list only the concrete
  component under **API References**.

## Verification workflow

Use this checklist when creating technical content or auditing an existing topic. Audit mode reports
verification gaps; it does not edit the topic. Existing topic prose and snippets are evidence to check,
not a source of truth.

1. **Identify the target platform.** Angular/native `igx`, Web Components `igc`, React, or Blazor.
2. **Verify public API facts through MCP first.** Use the Ignite UI/API docs MCP source for component
   types, properties, methods, events, and API-link targets.
3. **If MCP is unavailable, use the official platform API docs.**
   - React: `https://www.infragistics.com/api/react/`
   - Web Components: `https://www.infragistics.com/api/webcomponents/`
   - Blazor: `https://www.infragistics.com/api/blazor`
4. **Use typed source only for details the API docs do not expose.** Examples: rendered DOM, slots,
   parts, key handlers, theme `.scss` `@param` comments, precedence rules, and deprecation markers.
5. **Use official framework docs for framework behavior.** Examples: Angular standalone defaults,
   control-flow syntax, React conventions, and Blazor conventions.
6. **Mark unresolved facts visibly.** Use `‹VERIFY: exact fact/source needed›` or flag the issue in the
   audit report; never replace uncertainty with a plausible claim.

Authored fenced code snippets follow the same verification order. Live `<Sample>` embeds are separate:
verify `src`, `alt`, and display props in the topic, but report sample-code problems as upstream sample
project work.

## Component topic — canonical section order

Required = every component topic, always this order. Conditional = only when relevant, but always in
this slot. **These names are the only allowed H2s.** Anything feature-specific becomes a sub-heading
under **Usage**, never a new top-level section.

| # | Section (`##`) | Required? | Diátaxis mode | Contents |
|---|---|---|---|---|
| 1 | *Title + one-line definition* (`#` + lead ¶) | required | orient / reference | H1 is **`‹Component› Component`** — **no** framework prefix, **no** "Overview" suffix (the framework lives in the SEO `title`). Follow with one plain sentence: what it is, what problem it solves. Mirror `llms.description`. |
| 2 | *Live Demo* | required | demonstration (action) | `<Sample>` of the simplest useful state near the top of the page, before **Anatomy**. |
| 3 | **Anatomy** | required for component topics | orientation (reference) | Opens with a screenshot/GIF of the component's parts or the behavior being shown, then the **DOM tree / skeleton** (rendered elements, parts, slots). If the visual asset doesn't exist yet, leave a `{/* TODO */}` marker rather than a broken image, but still include the section and verified skeleton. |
| 4 | **Getting Started** | required | how-to | **Lead with the component-specific import/registration** — the page-unique, high-value part. Compress the generic library install to a **single prerequisite line linking the general getting-started topic** (an inline `ng add igniteui-angular` as a parenthetical is fine); **don't** repeat the multi-sentence install boilerplate that is identical on every component page. Show the **current** registration (standalone import) first; put legacy NgModule **after**, marked as legacy. |
| 5 | **Usage** | required | how-to + explanation | Start with `### Basic Declaration`, showing the smallest valid component markup for each platform. Then add property-focused sub-sections that showcase every public input with a minimal snippet and, when a verified demo exists and adds visual value, a `<Sample>`. Give standalone properties their own sub-section (`Shape`, not `Avatar Shape`); group only tightly coupled properties that form one behavior (for example, content-source priority such as `src`, `alt`, `initials`, and default slot content). The final Usage subsection must be `### Do/Don't`; it uses inline **When to use:** and **When not to use:** labels, not nested headings. Styling content belongs in **Styling**, not here. |
| 6 | **Properties** | required | reference | Table: name · type · default · description. (Replaces "Configuration".) |
| 7 | **Methods** | conditional | reference | Table of callable actions. |
| 8 | **Events** | conditional | reference | Table of emitted events. |
| 9 | **Styling** | required when applicable | how-to + reference | **Open with a `<Sample>` of the styled result** + one intro line, then the **Styling Variables table** (**one table** — variable · what it changes; **no default-value column, no per-theme tabs**) and styleable-parts table. Subsections cover each approach — **first `### Sass Theming`** (the primary Sass theme workflow), then others (e.g. `### Tailwind`, `### Custom sizing`). All styling content lives here, not under Usage. |
| 10 | **Accessibility** | required | reference | Three sub-sections, in order: **Keyboard Interaction** (key→action table), **Screen Readers / ARIA**, **Accessibility Compliance** (conformance evidence — see the sub-structure spec below). |
| 11 | **Troubleshooting** | conditional (required when version-migration or legacy-setup notes exist) | how-to | Gotchas phrased as the reader's real question; answer as cause → fix. **Collect version-migration notes, deprecations, and legacy/alternative approaches here** — not buried in code-fence comments or scattered asides. |
| 12 | **API References** | required | reference | `<ApiLink>` out to the full generated reference; don't duplicate it. |
| 13 | **Dependencies** | conditional | reference | Themes, styles, or supporting components the component relies on to render or function — modules to import (Angular) or supporting components/themes (xplat). (Currently "Theming Dependencies".) |
| 14 | **Additional Resources** | required | navigation | Forums, GitHub, related topics. |

**When Not to Use trigger:** every component topic ends **Usage** with `### Do/Don't`. This subsection
must include inline **When to use:** and **When not to use:** labels, not nested headings. When
`relatedComponents` is non-empty, **When not to use:** must name the specific better-fit sibling(s)
by name and link them; when it's empty (standalone primitives like Badge/Divider), **When not to
use:** states the boundary without inventing a sibling.

**Reference-table contract:** Properties / Methods / Events tables are **generated from the same typed
API source** as the full reference — not hand-typed. Inline tables = the core knobs for fast scanning;
**API References** links to the complete set. One source, so nothing drifts. **When authoring, do not
hand-write or invent rows:** emit the fixed column headers (`name · type · default · description`) and a
single build-injection note, and leave the row values to the generator. Inventing a plausible property
or event name is exactly the failure this contract exists to prevent.

**Usage coverage contract:** begin with `### Basic Declaration`, then use property-focused
sub-sections to demonstrate every public input. Prefer one sub-section per standalone property; group
properties only when they are inseparable in real use or define a shared precedence/behavior. Each
sub-section should include a minimal, copyable snippet for every platform it affects. Add a
`<Sample>` only when the demo path is verified and the visual result teaches something the snippet
alone does not.

**Live-sample contract:** exactly one top preview; add Usage samples only for distinct,
user-facing tasks or property-focused behaviors (selection, editing, sorting, validation,
templating, styling, shape, content, sizing). Soft max **10 samples/page**; up to 10 is fine, and
only clear sprawl past that warrants splitting into focused topics.

### `<Sample>` configuration — pick the props deliberately

`<Sample>` renders a live demo (iframe + source-code tabs + live-edit buttons). **`src` is required and must
point at a real demo path** — treat it like any other identifier under the zero-risk rule: never invent or
guess a `src`, an `lob`/`dv`/`crm` base, or a path; use one only when it's verified from the sample project
or an existing topic, else leave a `‹VERIFY: demo path›` marker. Never hand-edit the demo's code — that lives
in the separate sample project.

Choose the display config from **what the sample is showing**, not by habit:

| Prop | Default | Use it when… |
|---|---|---|
| `src` | — (required) | Always. Relative demo path. |
| `alt` | — | **Always** — the iframe title for accessibility. A missing `alt` is an audit finding (E1). Describe the demo, e.g. `alt="Angular Calendar range selection"`. |
| `height` | `400` | The demo's natural height isn't ~400px. Match the content. **Mutually exclusive with `fitContent`** — set one or the other, never both. |
| `fitContent` | off | The component is small or variable-height (badge, chip, avatar, icon, switch), **or a compact standalone sub-view** (e.g. a calendar days/months/years view), and a fixed frame would waste or clip space. The iframe grows to the component's own height, so **do not also set `height`** — drop it entirely. Ignores `resizable`. |
| `iframeOnly` | off | The **result** is the point and the source isn't instructive — purely visual demos, or a Styling preview whose styling is applied upstream (not in copyable code). Drops the code tabs/footer. Keep the tabs when the code *is* the lesson (e.g. a Sass `calendar-theme` snippet). |
| `fullscreenBtn` | off | Paired with `iframeOnly` for large/complex visual demos that benefit from full-screen. |
| `resizable` | off | Responsiveness is the lesson (grids, layout, splitter, dock manager) — lets the reader drag the width. Ignored with `fitContent`. |
| `position` | — | A small component would otherwise sit in the top-left; align it (`center`, etc.). |
| `spacing` | — | The demo needs breathing room around the iframe (`sm`/`md`/`lg` = 8/16/32px). |
| `noBorder` | off | The default border competes with the demo visually. Cosmetic — use sparingly. |
| `lob` / `dv` / `crm` | default base | The demo lives in the LOB, Data-Viz, or CRM demos app rather than the default — **verify before setting**. |

Defaults are right for most Usage samples: `<Sample src="…" height={…} alt="…" />`. Reach for the extra props
only when the component type calls for it — the top preview and standard task demos keep the code tabs (no
`iframeOnly`); the **Styling** section still opens with a styled-result `<Sample>`, using `iframeOnly` only
when its styling isn't shown as copyable code.

### Accessibility — required sub-structure

`## Accessibility` always carries three `###` sub-sections, in this order. All three are **reference**
mode: statements of fact in tables and short lists — no steps, no marketing.

1. **`### Keyboard Interaction`** — one key → action table, verified against the component's key
   handlers. Note how the component is reached (Tab) and any condition that removes it from the tab
   order.
2. **`### Screen Readers / ARIA`** — the roles, `aria-*` attributes, and announcements the component
   provides (from source), plus what the reader must supply (e.g. `aria-label` when the visible
   content doesn't describe the action).
3. **`### Accessibility Compliance`** — the conformance evidence, in this shape:
   - **Lead sentence** naming the conformance target (WCAG version + level; Section 508 / EN 301 549
     where applicable). This is a product-level claim — state it only from an official Infragistics
     statement; otherwise write `‹VERIFY: conformance target›`.
   - **Conformance table** — two columns: **Criterion · How the component complies**. List only the
     WCAG success criteria *relevant to this component*, each row grounded in behavior already
     verified on this page (the keyboard table, the ARIA facts, the typed source). Link each
     criterion to its WCAG Understanding page. Common criteria to pick from:
     1.3.1 Info and Relationships (roles/structure) · 1.4.1 Use of Color (states not conveyed by
     color alone) · 1.4.3 Contrast (Minimum) (default themes) · 1.4.11 Non-text Contrast ·
     2.1.1 Keyboard + 2.1.2 No Keyboard Trap (full keyboard operability) · 2.4.3 Focus Order ·
     2.4.7 Focus Visible (focus ring) · 2.5.7 Dragging Movements (every drag interaction needs a
     keyboard/single-pointer alternative — splitter, slider, dock manager) · 2.5.8 Target Size
     (Minimum) · 4.1.2 Name, Role, Value · 4.1.3 Status Messages (components that announce — toast,
     snackbar, progress). Omit irrelevant criteria entirely — no "N/A" filler rows.
   - **Your responsibilities** — a short list of what the app author must still do for the page to
     conform: provide the accessible name, keep sufficient contrast when overriding themes, preserve
     a logical focus order in the surrounding layout, keep minimum target sizes when custom-sizing.
     Cross-link the Usage/Styling sections that show *how* — don't repeat the steps here. This split
     (what the component guarantees vs what the reader owes) is the highest-value content of the
     sub-section for both humans and AI assistants.
   - **Known exceptions** *(only when real)* — criteria the component doesn't fully meet, each with
     its workaround or tracking link. An honest, specific gap beats a silent one.
   - **Validation & resources** *(optional, verified only)* — the screen reader / AT combinations the
     component is tested with, and links to the product accessibility statement / VPAT and the
     matching [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern.
     Omit when unverified — never invent a testing matrix.

   Compliance claims are the highest-risk statements on the page — they carry legal weight, and a
   wrong one is copied into the reader's own conformance report. The zero-risk rule applies at full
   strength: no blanket "fully accessible" / "WCAG compliant" sentence, ever; every table row traces
   to observable, verified behavior; product-level claims come only from an official source.

## Overview topics

**5a. Concept / guide overview** (Diátaxis: *explanation*) — e.g. "Theming concepts":
Title + intro → **Overview** → **Before You Start** → **Next Steps** → **Available Tools** →
**Common Workflows** → **Troubleshooting** → **Additional Resources** → optional **FAQ**. Use an
accordion for FAQ content when a compact question-and-answer block is useful.

**5b. Category / index overview** (Diátaxis: *reference/navigation* — a map) — e.g. "Charts overview":
Title + intro → **Key Features** → **Types** (identical micro-structure per entry: one-line def + link + small
`<Sample>`) → **Next Steps** → **API References / Additional Resources**.

Guardrails: cap each section at ~3 short paragraphs (else add sub-sections); isolate marketing copy in
a single "Why {ProductName}" section — never thread it through instructional content.

## Naming reconciliation (drift → standard)

| Seen in the wild | Standard name |
|---|---|
| "Angular X Component Overview"; "X Component Overview"; "{Platform} X Component Overview" (H1) | **`X Component`** (H1 — drop framework + "Overview") |
| Setup; "Getting Started with…"; "Getting Started with Ignite UI for Angular X" | **Getting Started** |
| Code Snippet; Examples; "Using the … Component"; "{Platform} X Example"; "Angular X Example" | **Usage** |
| "Avatar Shape"; "‹Component› ‹Feature›" (Usage sub-heading) | **`‹Feature›`** (drop the component name) |
| Configuration | **Properties** |
| "X vs Y"; "Choosing Between X and Y"; Behavior; Feature Integration | **Do/Don't** (as the final `###` under **Usage**) |
| top-level `## When to Use` / `## When Not to Use`; `### When to Use` / `### When Not to Use`; **When to Use / When Not to Use nested under `## Anatomy`** | Inline **When to use:** / **When not to use:** labels inside the final **Usage** subsection, `### Do/Don't` |
| Summary (as lead-in) | intro ¶ or **Overview** |
| Keyboard Navigation | **Accessibility** |
| WAI-ARIA Support; Compliance; Section 508; Accessibility Statement | **`### Accessibility Compliance`** (under **Accessibility**) |
| Best Practices; Do's and Don'ts; Guidelines; Recommendations | **Do/Don't** (as the final `###` under **Usage**) |
| Theming (H2) | **Styling** (H2); the Sass approach becomes `### Sass Theming` under it |
| Known Limitations; Known Issues and Limitations; Limitations | **Troubleshooting** |
| API; API Reference (singular) | **API References** |
| Theming Dependencies | **Dependencies** |

## Write-for-both-audiences rules (people + AI assistants)

1. **One job per section** — self-contained; no "as mentioned above." A section must make sense landed-on cold.
2. **Lead each section with one plain, specific sentence** before any table/code — skip empty boilerplate.
3. **Use the standard section names everywhere** — "Accessibility" always means the same thing.
4. **Phrase guidance/troubleshooting as real questions** — When-Not-to-Use is the highest-value content for answer accuracy; name the sibling explicitly.
5. **Reference lives in tables**, generated from the typed source.
6. **Strong `description` / `llms.description`** — <~160 chars, answer-shaped.
7. **Document theming variables** — variable · what it changes, in **one table for all themes**. No default-value column: defaults are per-theme values that live in the generated API reference, not the topic.

## Formatting & altitude

- **No divider hugging a block.** Never place `<hr>` or `<igc-divider>` directly before or after a
  `<Sample>`, code fence, or table — those blocks carry their own separation. Dividers separate
  *prose* sections only; in practice a topic rarely needs them at all.
- **Single item ⇒ paragraph.** A `ul`/`ol` with one item is a paragraph. Use a list only for two or
  more parallel items.
- **Current API first, legacy after.** Show the current/recommended approach first (e.g. the
  standalone component import); place deprecated/legacy approaches (NgModule) *below* it, explicitly
  marked as legacy — never above the current one.
- **Don't repeat the generic install boilerplate.** The `ng add igniteui-angular` + "read the getting
  started topic" prose is identical on every component page — collapse it to a **one-line prerequisite
  link** and lead Getting Started with the component-specific import instead. This mirrors how the major
  component libraries (Angular Material, MUI, Ant Design, PrimeNG) work: install lives in one central
  page; each component page shows only its own import. Keep the prerequisite as a single linked line
  (optionally with an inline `ng add` token) so a cold-landing reader or AI still has the pointer — just
  not the repeated paragraph.
- **Styling leads with the result.** The Styling section opens with a `<Sample>` of the styled
  outcome, then the tables; its first subsection is `### Sass Theming` (the Sass theme workflow), then
  the other approaches (`### Tailwind`, `### Custom sizing`, …).
- **One styling table — never per-theme tabs, never default values.** In the `theming` repo every
  theme schema `extend`s the same base schema and only overrides *values* (e.g. `$material-switch`,
  `$fluent-switch`, `$indigo-switch` all extend `$light-switch`; `$bootstrap-switch` extends
  `$fluent-switch`), so **every theme exposes the identical variable set** — only the defaults differ.
  Per-theme tabbed tables (the legacy `.theme-switcher-wrapper` / `.theme-table` markup) therefore
  document a difference that doesn't exist; replace them with **one two-column table:
  variable · what it changes**. Don't add a defaults column either — defaults vary per theme and
  belong to the generated API reference, and the durable content is the variable's name and effect.
- **Audit & modernize inline code snippets — not the samples.** Fenced code blocks (` ```… ```
  `) are authored in the topic, so verify and update them: no deprecated APIs or outdated framework
  idioms (drop `standalone: true`; prefer Angular's built-in control flow `@if`/`@for` over
  `*ngIf`/`*ngFor`; use verified imports, selectors, and tags). The live **`<Sample>`** embeds render
  from the separate sample project — **never hand-edit their code**; fix those upstream. The only
  intentionally "old" snippets are the legacy ones quarantined in **Troubleshooting**.
- **Omit `standalone: true` (Angular).** Components are standalone by default since Angular v19
  (igniteui-angular targets far newer), so it's redundant in examples — don't write it. Show
  `standalone: false` only when illustrating the legacy NgModule path (in Troubleshooting).
- **Version & legacy notes live in Troubleshooting.** Don't bury "prior to vX use…" migration notes
  in code-fence comments, and don't scatter legacy/alternative setup (e.g. NgModule) across the page.
  Collect them in **Troubleshooting**, each phrased as question → cause → fix. Getting Started and
  code samples show only the current, recommended path.
- **Curated (not generated) reference tables — for now.** No build-time generator injects inline
  Properties/Styling-Variables tables yet (only the full API reference is generated, reached via
  `<ApiLink>`). Until one exists, hand-author a **small core** table whose every row is **verified
  from source** (typed component for props; the `@param` doc-comments in the component's
  `_…-theme.scss` for styling vars) and link `<ApiLink>` for the complete set. The zero-risk rule
  still applies: no unverified rows.

## Voice & tone

Write instructions the same way across every topic so readers (and assistants) get one predictable voice.

- **Imperative, second person, present tense.** "Set the `shape` attribute…", "Import the component…" — not "we create…" or "the developer should…". Address the reader as *you* only when needed for clarity.
- **One voice per topic.** Don't mix imperative how-to with first-person-plural narration ("we create") or tutorial hand-holding. Reference sections (Properties/Styling tables, Accessibility) stay descriptive.
- **Specific over vague; cut filler.** Name the exact attribute, value, or behavior. Drop "simply", "just", "in order to", "as you can see", and empty lead-ins.
- **No marketing in instructional prose.** Keep promotion out of how-to/reference; overview topics isolate it in a single "Why {ProductName}" slot.
- **Name features by their real Ignite UI identifier** (e.g. `igx-icon`, not "material icon") and cross-link the topic.

## Verify every claim against the component

The zero-risk rule is not limited to identifiers — **every statement of fact must be verified against the actual component before it ships or is recommended as an edit.** This includes defaults, value ranges, precedence/fallback behavior, version support ("since vX"), deprecations, emitted events, and rendered DOM.

- **Source of truth:** follow the **Verification workflow** above. Public API facts come from MCP
  first, then the official platform API docs. Typed source is for implementation details the API docs
  do not expose. Existing docs and snippets are never sufficient proof by themselves.
- **When recommending edits, verify first.** Never "correct" prose into a plausible-sounding claim you haven't checked — a confident wrong statement is worse than the original.
- **If you can't verify it, don't assert it.** Write `‹VERIFY: …›` or leave the existing text and flag it — never guess a default, a version, or a behavior.
- Behavioral claims that read fine but contradict the source (e.g. "the image falls back to initials on load error" when the code only sets precedence) are exactly what this rule catches.

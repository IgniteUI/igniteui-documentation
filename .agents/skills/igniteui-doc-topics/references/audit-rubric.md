# Audit rubric

Version: v8 · 2026-11-20 · igniteui doc-skill set. Before editing, confirm this version line against `.agents/CHANGELOG.md`.

The audit workflow, the checkable rules for **audit mode**, and the report format to produce. Every
finding maps to a concrete rule below (structure, naming, Diátaxis mode, or metadata) and to a fix.
Detail lives in `house-style.md`; the *why* behind mode findings lives in `diataxis-cheatsheet.md`.

## Audit workflow

1. **Classify** the topic (SKILL.md Step 0) and identify its doc set (Angular vs xplat) and type.
   A component topic still in the Angular tree is the normal pre-rewrite state, not a finding:
   audit it against the same standard, and say in the Summary that bringing it to the standard
   means moving it to the xplat tree (house-style → "Two doc sets").
2. **Follow the verification workflow** in `house-style.md` before judging technical content.
   Old snippets/prose are never the source of truth by themselves. For component topics, inspect the
   matching Indigo.Design component documentation and compare its structure to the topic's Usage
   subsections by semantic content, not heading text, before making Usage-coverage suggestions.
   For the **Accessibility** section, open the component source (house-style → "Verification
   workflow", step 4) and re-derive the keyboard table and the ARIA facts from it for each platform
   family before judging the section — see D14.
3. **Run every check** below — structure/order (A), naming (B), Diátaxis mode integrity (C),
   metadata/AI-readiness and correctness (D), samples/links (E), formatting and snippet currency (F).
   For mode integrity, run the compass on each section and flag drift. For detailed frontmatter-only
   audits or normalization, use the companion `igniteui-topic-frontmatter` skill; for full topic
   audits, apply only the basic metadata checks here unless the user asks for frontmatter
   suggestions.
4. **Report** in the exact format at the end of this file: Verdict → Summary → Findings (each with
   Where / Issue / Principle / Fix) → Quick wins. Order findings Error → Warning → Suggestion.
5. Keep every **Fix** concrete and applyable (the corrected heading, the sentence to move, the table
   to add). If the topic is already clean, say so and note what it does well — don't invent problems.

## Severity

- **Error** — breaks the standard or misleads readers/AI. Must fix.
- **Warning** — drift or a gap that degrades quality. Should fix.
- **Suggestion** — polish; author's judgment.

## Checks

### Category/index exception
Classify the topic before applying the checks below. A category/index page is evaluated against the
category blueprint in `house-style.md`, not the component-topic checklist. Do not report missing
component sections such as `Live Demo`, `Getting Started`, or `Usage`
when the page follows a concise introductory block (a definition plus brief scope or purpose context,
when needed) and `Key Features` (with a short intro and a `Feature` / `Description` /
`Benefits` table) → top-level `Types/Members` section with each concrete type as its own
navigable `###` child subsection and a verified sample → `Next Steps` → `Accessibility` →
`API References` → `Additional Resources` → `FAQ`. Report component-topic sections such as `Live Demo`,
`Getting Started`, or `Properties` in the category introduction as information-architecture drift
instead. Do not require optional supporting sections when the category has no verified category-wide
content for them.

### A. Structure & order
- A1 (Error) A required section is missing (`## Live Demo`, Anatomy, Getting Started, Usage,
  Properties, Accessibility, API References, Dependencies, Additional Resources, Related
  Components, and FAQ on a component topic). `### Prerequisites and Version Compatibility`,
  **Troubleshooting**, and **Known Limitations** are content-driven: never report one as missing
  for its own sake. Report it only when the topic carries content that belongs there but has no
  home — a version or package constraint buried in prose or a code-fence comment; version-migration,
  deprecation, or legacy-setup notes (see F6); a limitation stated elsewhere on the page.
- A2 (Warning) Sections are present but out of the canonical order.
- A3 (Warning) A conditional section sits in the wrong slot.
- A4 (Error) A feature-specific top-level `##` exists that should be a sub-heading under **Usage**,
  including a top-level `## Do/Don't`; or a required canonical section has been omitted or replaced
  by a non-standard heading.
- A5 (Error) `## Live Demo` is missing near the top of the topic, appears after **Anatomy**, or the
  top preview `<Sample>` is left as a bare block instead of living inside the `## Live Demo` section.
- A6 (Suggestion) A `<Sample>` shows nothing that the snippet above it doesn't already convey.
  There is no cap on the number of samples — never flag a topic for the count alone — and the count
  is per platform: an Angular sample and its `igc` counterpart in sibling `<PlatformBlock>`s are one
  sample. Near-duplicate samples are E2, not this check.
- A7 (Warning) **Usage** does not end with `### Do/Don't`; **Do/Don't** has neither a `<DoDont>`
  block nor a `{/* TODO */}` marker for the not-yet-available images; its do/don't pairs are
  hand-written markup (a grid of `<Image>` elements, inline-styled "Do" / "Don't" labels, a single
  combined image) instead of the shared Astro `<DoDont>` component; or it still carries the retired
  **When to use:** / **When not to use:** labels or headings.
- A8 (Warning) **Anatomy** is incomplete: missing its opening screenshot/GIF (or a `{/* TODO */}`
  marker for a not-yet-available asset), missing the shared Astro `<Anatomy>` component, missing
  the numbered legend for an image that labels its parts by number (or the legend's numbers or
  names disagree with the image), or missing the verified DOM tree / skeleton. Also report an
  `<Anatomy>` that passes `name` or `description` (not props of the component; they render
  nothing), and a style override that caps the image with a bare pixel `max-width` instead of
  `min(…px, 100%)` (the image overflows the frame on a narrow screen).
- A9 (Warning) **Accessibility** is missing one of its three required `###` sub-sections —
  **Keyboard Interaction**, **Screen Readers / ARIA**, **Accessibility Compliance** — or has them out
  of order.
- A10 (Warning) **Usage**'s **Do/Don't** subsection contains install steps, code snippets, a property table, or other
  reference/how-to content that belongs in Getting Started, another Usage subsection, Properties, or Accessibility instead of do/don't
  guidance.
- A11 (Warning) **FAQ** uses plain question headings or hand-written accordion markup instead of
  the shared Astro `<Faq>` / `<FaqItem>` components, does not keep each answer concise and
  component-specific, or an answer is not 2–4 self-contained sentences quotable without its question
  (dangling "it"/"this", no subject noun). Also report generic questions, duplicated
  Usage/Troubleshooting content, questions unsupported by the component's verified API or behavior,
  and FAQ sets with no evidence of considering recurring public user questions for the component
  category. Recommend 3–6 questions covering distinct high-value intents, with answers verified
  against official API/source documentation.
- A12 (Warning) A slot-mode FAQ does not set `indicatorPosition="end"` on every `<FaqItem>`;
  setting it only on `<Faq>` does not affect slotted children.
- A13 (Warning) A component topic uses a hand-written anatomy image block instead of the shared
  Astro `<Anatomy>` component, or uses a hand-written sample iframe instead of `<Sample>`.
- A14 (Warning) A content-driven section is padded: `### Prerequisites and Version Compatibility`,
  **Troubleshooting**, or **Known Limitations** is present but tells the reader nothing they need —
  it restates the package name or "the version used in the samples", holds only an intro sentence,
  or lists generic boundaries or advice that belongs in **Do/Don't** or **Related Components**.
  Fix: remove the heading, and move any real guidance to the section that owns it.

### B. Naming
- B1 (Warning) A heading uses a drifted name with a standard equivalent (see reconciliation table).
  Report both: `"Configuration" → Properties`.
- B2 (Warning) Non-standard one-off heading (e.g. `## Angular Rating Example`) → map to standard.
- B3 (Suggestion) Singular/plural or casing mismatch (`API Reference` → `API References`).
- B4 (Warning) H1 carries a framework prefix, or a "Component" or "Overview" suffix → standard H1 is
  the bare component name, `‹Component›` (e.g. `# Angular Avatar Component Overview` → `# Avatar`).
  Pending `‹VERIFY: layout H1/framework adjacency, both doc sets›`: if the layout renders the
  framework/product adjacent to the H1 (template heading, breadcrumb, or HTML title), B4 stands as
  written; if it does not, B4 reverses for the Angular set and the H1 carries the framework (the
  head query is "angular ‹component› component"). Until answered, report B4 findings with this
  dependency noted.
- B5 (Warning) A **Usage** sub-heading repeats the component name (`### Avatar Shape` → `### Shape`).
- B6 (Warning) Body prose or a heading drifts from canonical entity naming (see house-style →
  Entity terminology): "datagrid" as one word outside quoted API symbols, "grid component" as
  subject noun, silent "table"/"data table" drift, product-name abbreviation drift ("IgniteUI",
  "AppBuilder"), bare "grid" as a standalone entity name, or a sibling compound not fully qualified
  (Tree Grid, Hierarchical Grid, Pivot Grid).

### C. Diátaxis mode integrity (mode-bleed)
Run the compass on each section; flag content that has drifted out of the section's assigned mode.
- C1 (Warning) **Explanation inside Usage/Getting Started** ("The reason this works is…") — move it
  to a concept topic and link. Don't move it into **Do/Don't**: that subsection holds only its short
  design-guidance paragraph and the `<DoDont>` blocks, and that paragraph is not a C1 finding.
- C2 (Warning) **Instruction inside a reference section** (Properties/Methods/Events telling the
  reader *how to* build something) — move to Usage; keep the table descriptive.
- C3 (Warning) **Reference dumped into Usage** (exhaustive option lists in prose) — move to the table.
- C4 (Warning) The topic never says when *not* to use the component: **Related Components** lists
  siblings as bare links without the case where each is the better fit — that redirect is the
  high-value half. A `<DoDont>` block whose `do` or `dont` slot only names the panel without saying
  why is the same gap at the pair level.
- C5 (Suggestion) Tutorial-style hand-holding in a how-to (or vice-versa) — match the audience.
- C6 (Warning) **Styling content inside Usage** (CSS-var overrides, `color`/background
  snippets) — move to the **Styling** section.
- C7 (Warning) **Usage doesn't cover every public input** with a property-focused sub-section and
  minimal snippet, or documents each option in isolation instead of
  grouping tightly coupled properties and stating the behavioral relationship once (e.g. the
  content-type priority).
- C8 (Warning) **Usage**'s **Do/Don't** drifts into another mode — install/code steps (belongs in Getting
  Started/Usage), an exhaustive option table (belongs in Properties), or conformance claims (belongs
  in Accessibility) instead of do/don't guidance.
- C9 (Suggestion) **Usage subsection opportunities from Indigo.Design** — the matching
  Indigo.Design component topic has a section whose meaning maps to a real Ignite UI API, slot,
  state, layout pattern, or verified sample, but the topic does not cover it. Compare by semantic
  content rather than heading text, and do not flag Figma-only structure that belongs in Anatomy or
  Styling instead of Usage.

### D. Metadata & AI-readiness
- D0 (Blocker, xplat) No `platformType`, or one that does not match the topic. The field is required
  and has no default, so a topic without it does not build; and it decides which standard the topic is
  held to, so the wrong value quietly applies the wrong rules. `xplat` for the DV set,
  `xplat-unmapped` where its API cannot be resolved, `web-only` for the web platforms and no further.
  Two traps: identity is not publication, so a topic can be `xplat` and reach no desktop platform; and
  a per-platform code block or a non-`full` `apiTerms` is a finding on an xplat topic and perfectly
  fine on a web-only one. `check-doc-scope.mjs` reports both, and house-style carries the contract.
- D1 (Warning) `relatedComponents` and the **Related Components** section disagree: the frontmatter
  lists a sibling that the section doesn't name and link — or vice-versa, the section names a sibling
  that isn't listed in `relatedComponents`. One exception to the reverse case: a sibling the section
  adds for one platform only, inside a `<PlatformBlock>`, need not be listed.
- D2 (Warning) Missing/weak `description` or `llms.description` (not answer-shaped, not
  definition-first, page-referential ("This topic shows…"), or >~160 chars). The full field contract
  lives in house-style → "File format & frontmatter"; for a field-by-field audit, hand off to the
  companion `igniteui-topic-frontmatter` skill.
- D3 (Warning) Section opens with no plain lead sentence naming the component (or platform token),
  or with empty boilerplate. **Live Demo** is exempt: it is sample-only, and a section that starts
  directly with the `<Sample>` is correct.
- D4 (Warning) A section relies on "as mentioned above" / isn't self-contained.
- D5 (Warning) A Properties/Methods/Events table is an empty shell — column headers with a
  "generated at build" note and no rows. No build step fills it; the rows are written by hand and
  verified through the Verification workflow (see F5).
- D6 (Suggestion) Styling variables undocumented where the component is themeable.
- D7 (Warning) xplat: hard-coded framework name where a `{Platform}`/`{ProductName}` token belongs, or
  framework-specific content not wrapped in `<PlatformBlock>`; or a token that
  `docs/xplat/docConfig.json` doesn't define for the platform (`{PackageReact}`, `{PackageBlazor}`),
  which is published as literal text. A framework name written out inside a block for that single
  platform ("The Angular Tabs component…" in `<PlatformBlock for="Angular">`) is correct, not a
  finding.
- D8 (Error) An API identifier (tag, class, package, property, method, event, CSS part, theming
  variable) appears to be fabricated/unverifiable, or an unresolved `‹VERIFY:…›` placeholder was left
  in. Public API values must trace to the Ignite UI/API docs MCP source, or to the official platform
  API docs when MCP is unavailable.
- D9 (Error) A **claim** contradicts or isn't verifiable against the component — a wrong default,
  value range, precedence/fallback behavior, version-support statement, deprecation, or DOM
  description. For public API facts, verify against the Ignite UI/API docs MCP source first; if MCP is
  unavailable, use the official Infragistics API docs for the target platform (Angular
  `https://www.infragistics.com/api/angular/`, React
  `https://www.infragistics.com/api/react/`, Web Components
  `https://www.infragistics.com/api/webcomponents/`, Blazor
  `https://www.infragistics.com/api/blazor`). Use typed source for implementation details not exposed
  by API docs, and official framework docs for framework/version behavior; if unverifiable, don't
  assert it. Existing topic snippets/prose are not sufficient proof.
- D10 (Error) A topic is missing the required `last_updated` metadata. The date must be stored in
  frontmatter and rendered by the site layout; do not duplicate it as MDX/Markdown content.
- D11 (Warning) **Voice/tone drift** — prose isn't imperative/second-person present tense, mixes
  first-person-plural narration ("we create") with how-to, or carries filler ("simply", "just") or
  marketing inside instructional prose.
- D12 (Error) **Blanket or unverified accessibility-conformance claim** — "fully accessible" /
  "WCAG compliant" prose, a conformance target (WCAG level, Section 508, EN 301 549) with no official
  source, a conformance-table row not traceable to behavior verified on the page or in source, an
  "N/A" filler row for an irrelevant criterion, or an invented testing/AT matrix or VPAT link.
  Fix: criterion-level rows tied to observable behavior, or `‹VERIFY:…›`.
- D13 (Warning) **Quotability** — run the quotability test on the H1 lead sentence, each section
  lead, each FAQ answer, and `llms.description`: if an assistant answered the page's target query
  (or the section's sub-query) today, is this the sentence it would quote? A surface where no
  sentence passes is a finding; page-referential phrasing ("This topic shows how to…") never passes.
- D14 (Error) **Accessibility fact not traceable to the component source** — a key → action row, a
  role, an `aria-*` attribute, a tab-order or focus statement, or an announcement in the
  **Accessibility** section disagrees with the component's template or key handlers, or is stated
  for a platform whose source says otherwise. The `igc`-based platforms and Angular render different
  DOM and handle different keys, and a wrapper may bundle an older build, so check each platform
  family against its own source. Rows that look complete are evidence to check, not proof. Where
  the source cannot be read, report the section as unverified instead of passing it.

### E. Samples & links
- E1 (Warning) `<Sample>` missing an `alt`.
- E2 (Suggestion) Near-duplicate samples that teach the same task.
- E3 (Warning) Hand-written API URL instead of `<ApiLink>`.
- E4 (Warning) `<hr>` or `<igc-divider>` placed directly before or after a `<Sample>`, code fence,
  or table (dividers separate prose only).
- E5 (Warning) A `<Sample>` uses a deprecated prop: `iframeOnly` → `chrome="bare"`, `hideCode` →
  `chrome="demo"`. Both are removed in `igniteui-astro-components` 2.0.0. (Until v8 this ID flagged
  `fitContent` together with `height`; the two combine, `height` being the loading placeholder.)
- E6 (Error) An `<ApiLink>` whose `type` has no generated reference page — typically an abstract/base
  class (e.g. `ButtonBase`): the link renders (e.g. `IgrButtonBase`) but points nowhere. Verify the
  target with `npm run check-mdx-links:broken:‹platform›`, which reads the API registry and reports
  `missing` / `member-missing` (the `xplat-docs-api-links` skill owns the details); link base-class
  members through the concrete component (`type="Button" member="href"`) instead.
- E7 (Warning) A prose link uses non-descriptive anchor text ("here", "click here", "this link", a
  bare URL) instead of descriptive, entity-bearing anchor text ("Ignite UI Angular Data Grid
  documentation"). `<ApiLink>` covers API links; this check covers body links.
- E8 (Warning) The component's row in `interactivity/accessibility-compliance.mdx` → **Component
  Support** is stale: the topic has an **Accessibility** section but a platform table still says
  `Not documented yet`, claims `Documented` for something the section doesn't cover, or links a
  retired anchor (`#keyboard-navigation`) or a deleted Angular file. Fix: the row shape in
  house-style → "Compliance index row", in every table the component appears in.

### F. Formatting & altitude
- F1 (Suggestion) A `ul`/`ol` with a single item that should be a paragraph.
- F2 (Warning) A deprecated/legacy setup (e.g. NgModule) shown **above** the current recommended
  approach (standalone) — reorder so current is first, legacy after and marked as such.
- F3 (Suggestion) The **Styling** section doesn't open with an intro line and the Styling Variables
  table; its subsections aren't `### Sass Theming`, `### CSS Variables`, `### Styling with Tailwind`
  in that order, or use a drifted name (`### Tailwind`); or it shows no `<Sample>` of a styled
  result in the subsection whose snippet produces it.
- F4 (Suggestion) **Getting Started** repeats the generic install boilerplate (the `ng add` command with the "install the library first / read getting started" prose that is identical on every page) instead of compressing it to a **one-line prerequisite link** and leading with the component-specific import. Blazor's bare `builder.Services.AddIgniteUIBlazor()` snippet is not boilerplate here (see F9).
- F5 (Warning) An inline Properties/Methods/Events or Styling-Variables table has a row whose name,
  type, default, or description doesn't match the API docs or typed source **for the platform the
  row is shown for**, or one platform's row was copied to another without checking — names, casing,
  types, and defaults differ between Angular, the `igc`-based platforms, and Blazor. Re-check every
  row of the audited topic through the Verification workflow; an existing row is evidence to check,
  not proof.
- F6 (Warning) A version-migration note lives inside a code-fence comment, or legacy/alternative setup
  (e.g. NgModule) is scattered outside **Troubleshooting** → move it into Troubleshooting as
  question → cause → fix; keep Getting Started and samples on the current path only.
- F7 (Warning) An **inline** fenced code snippet uses a deprecated API or outdated framework idiom
  (e.g. `standalone: true`, `*ngIf`/`*ngFor`, an old import path) → modernize it. Scope is authored
  snippets only; **live `<Sample>` embeds are out of scope** (fix those in the sample project), and
  legacy snippets deliberately kept in **Troubleshooting** are exempt.
- F8 (Warning) The Styling section has **per-theme variable tables** (the legacy
  `.theme-switcher-wrapper` / `.theme-table` tabbed markup) or a **default-value column** in the
  Styling Variables table. Every theme extends the same base schema — the variable *set* is identical
  across themes, only the default values differ — so per-theme tabs document a difference that doesn't
  exist, and defaults are per-theme data for the generated API reference. Fix: collapse to **one
  two-column table (variable · what it changes)**.
- F9 (Warning) A Blazor **Getting Started** presents a component module (`typeof(Igb…Module)`) as a required step, or lists the modules of other components the content uses. Components load their own module on first render → show the bare `builder.Services.AddIgniteUIBlazor()` snippet and the component's own module as optional (house-style, *Blazor module registration*). Feature modules no component loads stay required.

## Report format

Produce this exact shape:

```
# Audit: <topic path or name>  (<Angular | xplat> · <component | concept | category>)

**Verdict:** <Conforms | Minor drift | Needs work | Off-standard>
**Summary:** <2–3 sentences: biggest issues and the through-line.>

## Findings
### <Error|Warning|Suggestion> · <Check ID> · <short title>
- **Where:** <section / line>
- **Issue:** <what's wrong, plainly>
- **Principle:** <the house rule or Diátaxis mode it violates>
- **Fix:** <the concrete change — the corrected heading, the sentence to move, the table to add>

<repeat, ordered Error → Warning → Suggestion>

## Quick wins
<bulleted list of the 3–5 highest-leverage, lowest-effort fixes>
```

Keep every **Fix** concrete and applyable — the corrected heading text, the exact sentence to move and
where, the table columns to add. Group findings by severity, most severe first. If the topic is clean,
say so plainly and note what it does well rather than inventing problems.

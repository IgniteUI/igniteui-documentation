# Audit rubric

The checkable rules for **audit mode**, and the report format to produce. Every finding maps to a
concrete rule below (structure, naming, Diátaxis mode, or metadata) and to a fix. Detail lives in
`house-style.md`; the *why* behind mode findings lives in `diataxis-cheatsheet.md`.

## Severity

- **Error** — breaks the standard or misleads readers/AI. Must fix.
- **Warning** — drift or a gap that degrades quality. Should fix.
- **Suggestion** — polish; author's judgment.

## Checks

### A. Structure & order
- A1 (Error) A required section is missing (Live Demo, Anatomy, Getting Started, Usage,
  Properties, Accessibility, API References, Additional Resources on a component
  topic).
- A2 (Warning) Sections are present but out of the canonical order.
- A3 (Warning) A conditional section sits in the wrong slot.
- A4 (Error) A feature-specific top-level `##` exists that should be a sub-heading under **Usage**,
  including a top-level `## Do/Don't`.
- A5 (Error) **Live Demo** is missing near the top of the topic or appears after **Anatomy**.
- A6 (Suggestion) >10 live samples on one page (soft cap) — consider splitting. Up to 10 is fine;
  only flag when a page clearly sprawls past that.
- A7 (Warning) **Usage** does not end with `### Do/Don't`, or **When to use:** / **When not to use:**
  are written as nested headings instead of inline labels inside that subsection.
- A8 (Warning) **Anatomy** is incomplete: missing its opening screenshot/GIF (or a `{/* TODO */}`
  marker for a not-yet-available asset), or missing the verified DOM tree / skeleton.
- A9 (Warning) **Accessibility** is missing one of its three required `###` sub-sections —
  **Keyboard Interaction**, **Screen Readers / ARIA**, **Accessibility Compliance** — or has them out
  of order.
- A10 (Warning) **Usage**'s **Do/Don't** subsection contains install steps, code snippets, a property table, or other
  reference/how-to content that belongs in Getting Started, another Usage subsection, Properties, or Accessibility instead of do/don't
  guidance.

### B. Naming
- B1 (Warning) A heading uses a drifted name with a standard equivalent (see reconciliation table).
  Report both: `"Configuration" → Properties`.
- B2 (Warning) Non-standard one-off heading (e.g. `## Angular Rating Example`) → map to standard.
- B3 (Suggestion) Singular/plural or casing mismatch (`API Reference` → `API References`).
- B4 (Warning) H1 carries a framework prefix or an "Overview" suffix → standard H1 is
  `‹Component› Component` (e.g. `# Angular Avatar Component Overview` → `# Avatar Component`).
- B5 (Warning) A **Usage** sub-heading repeats the component name (`### Avatar Shape` → `### Shape`).

### C. Diátaxis mode integrity (mode-bleed)
Run the compass on each section; flag content that has drifted out of the section's assigned mode.
- C1 (Warning) **Explanation inside Usage/Getting Started** outside the final **Do/Don't** subsection
  ("The reason this works is…") — move to **Do/Don't** or a concept topic and link.
- C2 (Warning) **Instruction inside a reference section** (Properties/Methods/Events telling the
  reader *how to* build something) — move to Usage; keep the table descriptive.
- C3 (Warning) **Reference dumped into Usage** (exhaustive option lists in prose) — move to the table.
- C4 (Warning) **Usage**'s **Do/Don't** only says when to *use* the component, never when *not* to — the
  When-Not-to-Use redirect is the high-value half.
- C5 (Suggestion) Tutorial-style hand-holding in a how-to (or vice-versa) — match the audience.
- C6 (Warning) **Styling content inside Usage** (CSS-var overrides, `color`/background
  snippets) — move to the **Styling** section; Styling should also open with a `<Sample>` of the result.
- C7 (Warning) **Usage doesn't cover every public input** with a property-focused sub-section and
  minimal snippet, omits `### Basic Declaration`, or documents each option in isolation instead of
  grouping tightly coupled properties and stating the behavioral relationship once (e.g. the
  content-type priority).
- C8 (Warning) **Usage**'s **Do/Don't** drifts into another mode — install/code steps (belongs in Getting
  Started/Usage), an exhaustive option table (belongs in Properties), or conformance claims (belongs
  in Accessibility) instead of do/don't guidance.

### D. Metadata & AI-readiness
- D1 (Warning) `relatedComponents` is set but **Usage**'s **Do/Don't** guidance doesn't name the
  specific sibling(s) by name and link them — or vice-versa, it names a sibling that isn't listed in
  `relatedComponents`.
- D2 (Warning) Missing/weak `description` or `llms.description` (not answer-shaped, or >~160 chars).
- D3 (Warning) Section opens with no plain lead sentence, or with empty boilerplate.
- D4 (Warning) A section relies on "as mentioned above" / isn't self-contained.
- D5 (Warning) Properties/Methods/Events appear hand-written rather than from the typed source.
- D6 (Suggestion) Styling variables undocumented where the component is themeable.
- D7 (Warning) xplat: hard-coded framework name where a `{Platform}`/`{ProductName}` token belongs, or
  framework-specific content not wrapped in `<PlatformBlock>`.
- D8 (Error) An API identifier (tag, class, package, property, method, event, CSS part, theming
  variable) appears to be fabricated/unverifiable, or an unresolved `‹VERIFY:…›` placeholder was left
  in. Public API values must trace to the Ignite UI/API docs MCP source, or to the official platform
  API docs when MCP is unavailable.
- D9 (Error) A **claim** contradicts or isn't verifiable against the component — a wrong default,
  value range, precedence/fallback behavior, version-support statement, deprecation, or DOM
  description. For public API facts, verify against the Ignite UI/API docs MCP source first; if MCP is
  unavailable, use the official Infragistics API docs for the target platform (React
  `https://www.infragistics.com/api/react/`, Web Components
  `https://www.infragistics.com/api/webcomponents/`, Blazor
  `https://www.infragistics.com/api/blazor`). Use typed source for implementation details not exposed
  by API docs, and official framework docs for framework/version behavior; if unverifiable, don't
  assert it. Existing topic snippets/prose are not sufficient proof.
- D10 (Warning) **Voice/tone drift** — prose isn't imperative/second-person present tense, mixes
  first-person-plural narration ("we create") with how-to, or carries filler ("simply", "just") or
  marketing inside instructional prose.
- D11 (Error) **Blanket or unverified accessibility-conformance claim** — "fully accessible" /
  "WCAG compliant" prose, a conformance target (WCAG level, Section 508, EN 301 549) with no official
  source, a conformance-table row not traceable to behavior verified on the page or in source, an
  "N/A" filler row for an irrelevant criterion, or an invented testing/AT matrix or VPAT link.
  Fix: criterion-level rows tied to observable behavior, or `‹VERIFY:…›`.

### E. Samples & links
- E1 (Warning) `<Sample>` missing an `alt`.
- E2 (Suggestion) Near-duplicate samples that teach the same task.
- E3 (Warning) Hand-written API URL instead of `<ApiLink>`.
- E4 (Warning) `<hr>` or `<igc-divider>` placed directly before or after a `<Sample>`, code fence,
  or table (dividers separate prose only).
- E5 (Warning) A `<Sample>` sets both `fitContent` and `height` — they are mutually exclusive.
  `fitContent` sizes the iframe to the component, so remove `height`.
- E6 (Error) An `<ApiLink>` whose `type` has no generated reference page — typically an abstract/base
  class (e.g. `ButtonBase`): the link renders (e.g. `IgrButtonBase`) but points nowhere. Verify the
  `type` appears as an `<ApiLink>` target elsewhere in the doc set; link base-class members through
  the concrete component (`type="Button" member="href"`) instead.

### F. Formatting & altitude
- F1 (Suggestion) A `ul`/`ol` with a single item that should be a paragraph.
- F2 (Warning) A deprecated/legacy setup (e.g. NgModule) shown **above** the current recommended
  approach (standalone) — reorder so current is first, legacy after and marked as such.
- F3 (Suggestion) The **Styling** section doesn't open with a `<Sample>` of the styled result, or its
  first subsection isn't `### Sass Theming`.
- F4 (Suggestion) **Getting Started** repeats the generic install boilerplate (the `ng add` command
  with the "install the library first / read getting started" prose that is identical on every page)
  instead of compressing it to a **one-line prerequisite link** and leading with the component-specific
  import.
- F5 (Warning) An inline Properties/Styling-Variables table has rows not verified from source, or is
  presented as generated when the repo has no generator (curated + `<ApiLink>` is the current rule).
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

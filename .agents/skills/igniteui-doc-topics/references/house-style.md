# Ignite UI house style

Version: v8 · 2026-11-20 · igniteui doc-skill set (v8 made `### Prerequisites and Version Compatibility`, Troubleshooting and Known Limitations content-driven and aligned Do/Don't, the H1 and title, the doc sets, Styling, `<Sample>`, Anatomy and the reference tables with the topics rewritten since v7; v7 added the Blazor module-registration rule; v4 added the xplat `apiTerms` contract, the `json-snippet` rule and the `platformType` populations; content was unchanged from v2 through v3). Before editing, confirm this version line against `.agents/CHANGELOG.md`. The "File format & frontmatter" section below is the **single normative field contract** for the doc-skill set; the two SKILL.md files reference it rather than restating it.

The Ignite UI documentation conventions an authored or audited topic must follow. Pair this with
`diataxis-cheatsheet.md` (the *why*); the section→mode map is the "Diátaxis mode" column of the
canonical section table below.

## Contents

- [Two doc sets](#two-doc-sets)
- [File format & frontmatter](#file-format--frontmatter) — the normative field contract
- [Per-framework mechanics](#per-framework-mechanics)
- [Never fabricate API identifiers (zero-risk rule)](#never-fabricate-api-identifiers-zero-risk-rule)
- [Verification workflow](#verification-workflow)
- [Component topic — canonical section order](#component-topic--canonical-section-order) — incl. FAQ
  component, Do/Don't contract, reference-table contract, Usage coverage, Indigo.Design suggestions,
  Live Demo contract, `<Sample>` configuration, Anatomy sub-structure, Accessibility sub-structure
  and compliance index row
- [Overview topics](#overview-topics) — concept/guide and category/index blueprints
- [Naming reconciliation (drift → standard)](#naming-reconciliation-drift--standard)
- [Entity terminology (canonical names)](#entity-terminology-canonical-names)
- [Write-for-both-audiences rules](#write-for-both-audiences-rules-people--ai-assistants)
- [Formatting & altitude](#formatting--altitude)
- [Voice & tone](#voice--tone)
- [Verify every claim against the component](#verify-every-claim-against-the-component)

> **Current vs target state.** The live `vnext` repo is *pre-standardization* — many topics use
> drifted headings (e.g. `## Angular Rating Example`, `## Configuration`). This file describes the
> **target** standard (revision-2 blueprint). When **authoring**, write to the target. When
> **auditing**, measure against the target and report the gap.

## Two doc sets

| Doc set | Frameworks | Path (vnext) | Layout | One topic = |
|---|---|---|---|---|
| **xplat** | Angular · React · Web Components · Blazor · WinUI · Uno | `docs/xplat/src/content/en/components/<category>/` | categorized `*.mdx` | **one file, every platform the topic ships for** |
| **Angular** | Angular only | `docs/angular/src/content/en/components/` | flat `*.mdx` | one framework — a topic not yet moved to xplat, or Angular-only |

**Most Angular component topics still live in the Angular tree. A topic moves to the xplat tree
when it is rewritten to this standard** — the move is part of the rewrite, not a separate
migration. Write the standardized topic in the xplat tree with its Angular content in
`<PlatformBlock for="Angular">`; the build then generates the Angular page from the xplat file
(`docs/xplat/generated/Angular/`, overlaid on the Angular content, xplat winning on the same slug).
The move is finished only when all of these are done, in the same change:

1. **Delete the old Angular `.mdx`.** A copy left behind is dead content that the next author edits
   by mistake.
2. **Repoint every link to it.** Search both trees for the old path: other Angular topics and the
   grid templates, xplat topics that link the Angular page from a `<PlatformBlock for="Angular">`,
   and the links inside the moved topic itself, whose relative paths now start from a different
   folder (Tabs links `../general/getting-started.mdx` for Angular and
   `../general-getting-started.mdx` for the other platforms).
3. **Update both tables of contents.** In `docs/angular/src/content/en/components/toc.json`, change
   the entry's `href` to the xplat path (`tabs.mdx` → `layouts/tabs.mdx`); in
   `docs/xplat/src/content/en/toc.json`, remove `"exclude": ["Angular"]` from the entry.
4. **Run `npm run check-relative-links:ci`** and fix what it reports.

Until a topic is rewritten, its Angular file is the live source, and a small fix to it (a typo, a
link, one snippet) is made there, in place. A topic stays in the Angular tree for good only when it
has no xplat counterpart and is not getting one (an Angular-only component, the grid templates).

The **same section list, order, and names apply to both sets.** Differences are mechanical only (see
Per-framework mechanics), never the shape of the page. **Dependencies** appears in both sets — it
covers modules to import (Angular) or supporting components/themes required to render or function
(xplat); currently seen as `## Theming Dependencies`.

## File format & frontmatter

**This section is the single normative field contract for the doc-skill set.** The companion
`igniteui-topic-frontmatter` skill audits against it and carries the audit procedure and severities;
`igniteui-doc-topics` Create step 4 orders the work. Where wording differs anywhere, this section
wins.

Topics are **Astro `.mdx`**. Frontmatter is YAML. Observed + target fields:

```yaml
---
title: "{Platform} Rating Component"   # xplat component title; the layout appends the site title
description: "…"           # <=~160 chars, definition-first ("X is a … that …"); complete sentences, never ellipsis-truncated
keywords: "…"              # comma-separated; legacy/internal — every keyword appears in the body
license: MIT
mentionedTypes: ["Rating"] # xplat: API types referenced on the page
llms:
  description: "…"         # AI-facing one-liner; defines the component, not the page — the exact text an assistant quotes
last_updated: "YYYY-MM-DD" # required for every topic; rendered by the site layout
relatedComponents: [Slider, RadioGroup]   # the siblings the Related Components section must cover (see below)
platformType: xplat        # xplat: REQUIRED, no default — xplat | xplat-unmapped | web-only
---
```

- **`platformType` (xplat) is required and has no default.** A missing or unknown value stops the
  build. It also decides `apiTerms`, which a page then states only to differ: `xplat` implies `full`
  (names in backticks resolved through the product's description metadata), `xplat-unmapped` implies `passthrough` (resolved
  by rule, for an API no generator describes), `web-only` implies `none` (left as written, no
  `ApiLink`). An xplat page may not state `none`; a topic that genuinely cannot resolve its names is
  `xplat-unmapped`. `docs/xplat/API-TERMS.md` is normative; the `xplat-docs-api-links` skill is the
  working guide.

- **Three populations share the xplat content tree, held to different standards, and each page says
  which it is.** The **DV set** — charts, gauges, maps, dashboard tile, data grid, spreadsheet,
  toolbar, zoom slider — is `platformType: xplat`: canonical names in backticks resolved in full, and
  a component stated as a `json-snippet` unless a platform-specific snippet is genuinely necessary.
  `xplat-unmapped` is the same set where that treatment cannot be applied yet — the Excel library,
  whose API no generator describes, and the data grid's accessibility topic, whose XAML shape is
  undecided. **Web-only** topics — inputs, layouts, notifications, scheduling, themes, the web grid
  families, grid lite — carry no such obligation: they may hand write a block per platform and declare
  any mode, and reworking them to match the DV set is out of scope rather than an improvement.
  **Identity is not publication:** a topic can be xplat and not reach the desktop platforms yet, so
  where a page publishes never settles which population it is in. `check-doc-scope.mjs` enforces the
  declaration and reports the disagreements; the `xplat-docs-json-snippets` skill is the working guide.

- **`llms.description`** already exists in both sets and is high-value — write it as a crisp,
  self-contained answer sentence that **defines the component (or concept), never the page**: subject
  noun names the product and component, no pronouns, no "This topic shows…". It is *not* optional
  filler. The `llms.description`, the H1 lead sentence, and the site's llms-manifest entry should be
  the same sentence or trivial variants of it: one definition, emitted everywhere the machine looks.
- **`description`** is definition-first ("The <Component> is a … that …"), not imperative task
  phrasing ("Use X to …"); complete declarative sentences, written to fit <=~160 characters, never
  truncated with an ellipsis.
- **Cross-field consistency:** `title`, `description`, `llms.description`, `keywords`, the H1, and
  the lead sentence tell one story with the same entity names and the same capability list; the lead
  sentence mirrors `llms.description`.
- **Body support:** every capability named in `description`, `llms.description`, or `keywords` is
  supported by the finished body. Content-bearing fields are generated from the finished body, never
  from imagination (see `create-workflow.md`, step 4).
- **`title`** is `"{Platform} ‹Component› Component"` for xplat component topics
  (`"{Platform} Tabs Component"`); a sub-topic names its own subject the same way
  (`"{Platform} Combo Templates"`). The layout appends ` | ‹site title›` to the HTML title, so add no
  category or brand suffix (`| Layouts | Infragistics`). `{ComponentTitle}` is not a general title
  token: it exists only in the grid templates (`grids/_shared/`, Angular `grids_templates/`), where
  it resolves to the grid type. An xplat category/index topic uses the plain category name only,
  without `{Platform}` or `{ProductName}` (`title: "Grids and Tables"`). Angular-set titles follow
  the frontmatter skill's title rule (`"Angular <Component> Component"`, query-relevant terms within
  ~60 characters).
- **`relatedComponents`** lists the close siblings a reader might pick instead. When authoring, set
  it and cover every listed sibling in the **Related Components** section. When auditing, treat a
  missing-but-warranted value, and a listed sibling that **Related Components** does not cover, as
  findings (rubric D1).
- **`last_updated`** is required for every topic, including category/index topics. Store the date in
  frontmatter and let the site layout render it.

### MDX imports (declare what you use)

```mdx
import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';
import Anatomy from 'igniteui-astro-components/components/mdx/Anatomy.astro';
import DoDont from 'igniteui-astro-components/components/mdx/DoDont.astro';
import { Image } from 'astro:assets';  // when embedding other repo-owned images
import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';
import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';
import PlatformBlock from 'igniteui-astro-components/components/mdx/PlatformBlock.astro';  // xplat only
import Faq from 'igniteui-astro-components/components/mdx/Faq.astro';
import FaqItem from 'igniteui-astro-components/components/mdx/FaqItem.astro';
import tabsAnatomy from '@xplat-images/anatomy-content-light/tabs-lt-a.png';  // repo-owned images
```

**Images are added once, under `docs/xplat/src/assets/images/`**, and imported through the
`@xplat-images` alias. The Angular build resolves the same alias to that shared folder, so a topic
generated for Angular needs no copy under `docs/angular/src/content/en/images/`. A file placed there
with the same relative path *overrides* the shared one — that is for localized screenshots, not for
duplicates.

## Per-framework mechanics

- **Prefixes differ by framework/library — don't assume one for all:**
  - **Angular** → native **`igniteui-angular`**, **`igx-`** tags / **`Igx…Component`** classes. Angular
    content documents this library, in the Angular tree and in an xplat `<PlatformBlock for="Angular">`
    alike.
  - **Web Components** → **`igniteui-webcomponents`**, **`igc-`** tags / **`Igc…Component`** classes.
  - **React** → **`igniteui-react`**, a **wrapper around the `igc`** web components.
  - **Blazor** → **`igniteui-blazor`**, a **wrapper around the `igc`** web components.
  - **WinUI** → **`Infragistics.*`** NuGet packages (e.g. `Infragistics.Core`,
    `Infragistics.WinUI.Charts`), **XAML elements** / **`Xam…`** classes — native, not `igc`-based.
  - **Uno Platform** → the same **`Infragistics.*`** NuGet packages and **`Xam…`** XAML classes as WinUI.
- **Net effect:** the **web xplat platforms (React / WC / Blazor) are entirely `igc`-based** — WC is
  `igc` directly; React and Blazor wrap it. **WinUI and Uno are native XAML/.NET (`Xam…`), not
  `igc`-based.** **Angular is `igx`**.
- **Exception — WC-first components in the Angular docs.** Some newer components are built as web
  components and surfaced in the Angular docs via the `igc` element rather than a native `igx` one
  (verified: the Angular block of the **Rating** topic, `inputs/rating.mdx`, registers
  `IgcRatingComponent` from `igniteui-webcomponents` and renders `<igc-rating>`). So **don't assume
  `igx` for every Angular block** — verify the tag/class per component.
- **Angular set:** plain prose, no platform tokens. Registers and renders whichever the component is
  (`igx-…` native, or the `igc-…` WC for the exceptions above).
- **xplat set:** the *same file* serves Angular / React / WC / Blazor / WinUI / Uno via:
  - **Tokens** the build resolves: `{Platform}`, `{ProductName}`, `{PackageCommon}` (the platform's
    main package — `igniteui-angular`, `igniteui-react`, `igniteui-webcomponents`), `{ForumsLink}`,
    `{GithubLink}`, etc. `docs/xplat/docConfig.json` defines them per platform; a token it doesn't
    define for a platform is published as literal text, so use only the ones listed there (there is
    no `{PackageReact}` or `{PackageBlazor}`). Use tokens in title/description/keywords/headings and
    shared prose — never hard-code "React" where a token belongs. Inside a block for a single
    platform the name may be written out ("The Angular Tabs component…" in
    `<PlatformBlock for="Angular">`): there it is a fact, not a hard-coded guess.
  - **`<PlatformBlock for="WebComponents">…</PlatformBlock>`** to wrap framework-specific content
    (install commands, imports, snippets). `for` values: `Angular`, `React`, `WebComponents`,
    `Blazor`, `WinUI`, `Uno`, plus the group aliases `Web` (Angular + React + WebComponents + Blazor)
    and `NonWeb` / `Xaml` (both = WinUI + Uno). Prefer `for="Web"` for web-only content so it stays
    correct as platforms grow. `Web` includes Angular, so content shared by the three `igc`-based
    platforms only is `for="React,WebComponents,Blazor"`, next to a `for="Angular"` block.
- **Live samples** embed the same way in both sets:
  `<Sample src="/inputs/rating/overview" showThemePicker height={300} noBorder={false} spacing="md" alt="{Platform} Rating overview example" />`
- **API links** use `<ApiLink …>` rather than hand-written URLs so they resolve per framework.

## Never fabricate API identifiers (zero-risk rule)

The skill's job is structure and prose, **not** to invent the API surface. Do **not** emit a guessed
tag, class, package name, property, method, event, CSS part, or theming variable. A plausible-but-wrong
name that a reader copies is worse than an obvious gap.

- Use an identifier **only** when it is verified — through the Verification workflow below, or
  stated by the user. An identifier that appears in an existing topic is evidence to check, not
  proof. The naming patterns are known (Angular `igx-<name>` / `Igx<Name>Component`; WC and
  its React/Blazor wrappers `igc-<name>` / `Igc<Name>Component`), but the pattern is not a licence to
  guess — confirm the exact prefix *and* `<name>` per component (some Angular topics are `igc` — see the
  exception above).
- When you must reference an unverified identifier, write a visible placeholder instead of a guess:
  `‹VERIFY: exact export name›`. In a table, leave the unverified row out or mark its cell
  `‹VERIFY: …›` — invent no rows, and never leave an empty table for a build step to fill (see the
  *Reference-table contract*).
- This applies equally to React/Blazor wrapper symbols: they resolve to the `igc` core, so prefer the
  verified `igc` usage and mark any wrapper-specific class you can't confirm with `‹VERIFY:…›`.
- **`<ApiLink>` targets are identifiers too.** A `type` that exists in the source is not enough — it
  must resolve in the platform's API registry. Check it with `npm run check-mdx-links:broken:‹platform›`
  (`angular`, `react`, `wc`, `blazor`), which reads the registry and reports `missing` and
  `member-missing` targets; the `xplat-docs-api-links` skill owns the details. An existing
  `<ApiLink>` with that `type` elsewhere in the doc set is a hint, not the check. Abstract/base classes in particular (e.g. `ButtonBase`) may appear in
  `mentionedTypes` yet have no page — the rendered link (e.g. `IgrButtonBase`) points nowhere. Link base-class
  members through the concrete component instead (`type="Button" member="href"`), and list only the concrete
  component under **API References**.

## Verification workflow

Use this checklist when creating technical content or auditing an existing topic. Audit mode reports
verification gaps; it does not edit the topic. Existing topic prose and snippets are evidence to check,
not a source of truth.

1. **Identify the target platform.** Angular/native `igx`; Web Components `igc`, React, or Blazor (`igc`-based); or WinUI / Uno (native XAML/.NET, `Xam…`).
2. **Verify public API facts through MCP first.** Use the Ignite UI/API docs MCP source for component
   types, properties, methods, events, and API-link targets.
3. **If MCP is unavailable, use the official platform API docs.**
   - Angular: `https://www.infragistics.com/api/angular/`
   - React: `https://www.infragistics.com/api/react/`
   - Web Components: `https://www.infragistics.com/api/webcomponents/`
   - Blazor: `https://www.infragistics.com/api/blazor`
4. **Use typed source only for details the API docs do not expose.** Examples: rendered DOM, slots,
   parts, key handlers, theme `.scss` `@param` comments, precedence rules, and deprecation markers.
   **Where the component source is:**
   - **Web Components, and the React and Blazor wrappers around them** —
     `IgniteUI/igniteui-webcomponents` → `src/components/‹name›/` (for Tabs: `tabs.ts`, `tab.ts`).
     The render template, the initial ARIA, and the key bindings are in those component files.
     This repo's `node_modules/igniteui-webcomponents/components/‹name›/` holds the compiled build
     of the installed version, enough for a quick check.
   - **Native Angular** — `IgniteUI/igniteui-angular` →
     `projects/igniteui-angular/‹entry-point›/src/` (for Tabs: `tabs/src/tabs/`, with
     `tabs.component.ts` and `tabs.component.html`). It is not installed in this repo; read it from
     a clone or on GitHub.
   - **A wrapper can bundle an older `igc` build than the repository's head** — the Blazor Chip and
     Radio topics record such gaps. Confirm the bundled version before stating a recent behavior
     for React or Blazor.

   If the source cannot be read, the fact is `‹VERIFY: …›`, not a guess.
5. **Use official framework docs for framework behavior.** Examples: Angular standalone defaults,
   control-flow syntax, React conventions, and Blazor conventions.
6. **Mark unresolved facts visibly.** Use `‹VERIFY: exact fact/source needed›` or flag the issue in the
   audit report; never replace uncertainty with a plausible claim.

Authored fenced code snippets follow the same verification order. Live `<Sample>` embeds are separate:
verify `src`, `alt`, and display props in the topic, but report sample-code problems as upstream sample
project work.

## Component topic — canonical section order

Required = every component topic, always this order. Conditional = only when relevant, but always in
this slot. **A conditional section or subsection with nothing verified to say is omitted, never
padded** — an empty or filler section costs the reader more than a missing heading. **These names
are the only allowed H2s.** Anything feature-specific becomes a sub-heading
under **Usage**, never a new top-level section.

| # | Section (`##`) | Required? | Diátaxis mode | Contents |
|---|---|---|---|---|
| 1 | *Title + one-line definition* (`#` + lead ¶) | required | orient / reference | H1 is the bare component name, **`‹Component›`** (`# Tabs`, `# Radio Group`) — **no** framework prefix, **no** "Component" or "Overview" suffix (the framework and "Component" live in the SEO `title`). Follow with one plain sentence: what it is, what problem it solves. Mirror `llms.description`. Every topic, including category/index topics, must contain `last_updated` in frontmatter; the date is rendered by the site layout and must not be added as visible topic text. |
| 2 | **Live Demo** | required | demonstration (action) | A `## Live Demo` section, before **Anatomy**, containing exactly one `<Sample>` per platform of the simplest useful state. The section is sample-only: no lead sentence, no other text. |
| 3 | **Anatomy** | required for component topics | orientation (reference) | Use the shared Astro `<Anatomy>` component with a verified anatomy image (`src`) and an `alt` that describes the labelled parts; follow it with the **numbered legend** of those parts, then the verified **DOM tree / skeleton** (rendered elements, parts, slots) — see *Anatomy — sub-structure* below. If the visual asset doesn't exist yet, leave a `{/* TODO */}` marker rather than a broken image, but still include the section and verified skeleton. |
| 4 | **Getting Started** | required | how-to | **Lead with the component-specific import/registration.** Add a `### Prerequisites and Version Compatibility` subsection **only when the reader must know something before starting** — a verified minimum version for a documented feature, a platform package that ships an older build of the component, an extra package or peer dependency. Never add it to restate the package name or "the version used in the samples"; with nothing to say, omit the heading. Compress the generic library install to a **single prerequisite line linking the general getting-started topic**; **don't** repeat identical install boilerplate. Show the **current** registration first; put legacy setup after, marked as legacy. **Blazor:** module registration is optional — see *Blazor module registration* below. |
| 5 | **Usage** | required | how-to + explanation | Add property-focused sub-sections that showcase every public input with a minimal snippet and, when a verified demo exists and adds visual value, a `<Sample>`. Give standalone properties their own sub-section (`Shape`, not `Avatar Shape`); group only tightly coupled properties that form one behavior (for example, content-source priority such as `src`, `alt`, `initials`, and default slot content). The final Usage subsection must be `### Do/Don't`: one short guidance paragraph, then one `<DoDont>` block for each do/don't pair of the matching Indigo.Design guidance, or a `{/* TODO */}` marker when the images are not available — see the *Do/Don't contract* below. Styling content belongs in **Styling**, not here. |
| 6 | **Properties** | required | reference | Table: name · type · default · description. (Replaces "Configuration".) |
| 7 | **Methods** | conditional | reference | Table of callable actions. |
| 8 | **Events** | conditional | reference | Table of emitted events. |
| 9 | **Styling** | required when applicable | how-to + reference | **Open with one intro line and the Styling Variables table** (**one table** — variable · what it changes; **no default-value column, no per-theme tabs**), then the styleable-parts table(s) for the platforms that expose CSS parts. Subsections cover each approach, in this order: **`### Sass Theming`** (the primary Sass theme workflow), **`### CSS Variables`**, **`### Styling with Tailwind`**. Show the styled result as a `<Sample>` inside the subsection whose snippet produces it, after the snippet. All styling content lives here, not under Usage. |
| 10 | **Accessibility** | required | reference | Three sub-sections, in order: **Keyboard Interaction** (key→action table), **Screen Readers / ARIA**, **Accessibility Compliance** (conformance evidence — see the sub-structure spec below). |
| 11 | **Troubleshooting** | conditional — only when a verified, component-specific gotcha exists, or version-migration / legacy-setup notes need a home | how-to | Gotchas phrased as the reader's real question; answer as cause → fix. **Collect version-migration notes, deprecations, and legacy/alternative approaches here** — not buried in code-fence comments or scattered asides. With nothing real to answer, omit the section: no intro-only section, no generic or invented entries. |
| 12 | **Known Limitations** | conditional — only when a verified limitation exists | reference | Verified platform-independent limitations and boundaries of the component. Use a top-level section when standalone; when the limitations directly support troubleshooting guidance, place them as a `### Known Limitations` subsection inside `## Troubleshooting`. Do not use this content for troubleshooting fixes or unsupported claims. With no verified limitation, omit the section: never fill it with generic boundaries ("is not an interactive component") or with guidance that belongs in **Do/Don't** or **Related Components**. |
| 13 | **API References** | required | reference | `<ApiLink>` out to the full generated reference; don't duplicate it. |
| 14 | **Dependencies** | required | reference | Themes, styles, or supporting components the component relies on to render or function — modules to import (Angular) or supporting components/themes (xplat). |
| 15 | **Additional Resources** | required | navigation | Forums, GitHub, related topics. |
| 16 | **Related Components** | required | navigation / decision support | Verified sibling components and concise links explaining when they are a better fit ("Use Stepper when users complete a sequence of steps"). Covers every sibling listed in `relatedComponents`; this is where "when not to use this component" lives. |
| 17 | **FAQ** | required | reference / how-to | Frequently asked, component-specific questions; render them with `Faq` and `FaqItem`, keep answers concise, and move troubleshooting diagnosis to **Troubleshooting**. |

### FAQ component

When authoring or updating a component topic, use the Astro FAQ components instead of plain FAQ
headings or hand-written accordion markup. Import `Faq` and `FaqItem` from
`igniteui-astro-components/components/mdx/`, wrap the questions in `<Faq>`, and put each answer in a
`<FaqItem question="…" indicatorPosition="end">`. In slot mode, set
`indicatorPosition="end"` on every `FaqItem`; the value on `Faq` does not flow into slotted
children. Prefer slot mode so answers can contain normal MDX, links, code blocks, and other
components. Keep the FAQ questions component-specific and concise; do not move troubleshooting
content into the FAQ merely to populate it.

Each answer is **2–4 self-contained sentences, quotable without its question**: restate the subject
noun, no dangling "it"/"this". An FAQ whose answers cannot stand alone is markup without retrieval
value — FAQ answers are among the most-quoted chunks on the page. Choose the questions with the
question-generation contract below.

### FAQ question-generation contract

This contract is the single source for FAQ questions. Generate them from the component's verified
public surface and the questions users actually ask about that kind of control. Build one question
inventory from these three sources:

- **Component surface** — from the API registry and typed source: primary value or state, important
  inputs and events, form or validation integration, accessibility, keyboard interaction, and
  styling or rendering boundaries.
- **Adoption and fit** — "is ‹Component› right for ‹use case›" and the closest alternative
  component, framework and version support, migration, and licensing/pricing.
- **Recurring public questions** — search public web sources for recurring question shapes using the
  component name with `how to`, `not working`, `value`, `change`, `disabled`, `keyboard`, `form`,
  `validation`, `accessibility`, and `when to use`.

Then select from the inventory:

- Use web results to discover user language, recurring confusion, and missing question types. Prefer
  official Infragistics documentation, API docs, GitHub issues, and framework guidance.
- Treat web search as question discovery, never as authority for API behavior. Verify every answer
  against component source/API and official framework documentation; omit or mark unresolved answers
  with `‹VERIFY: source fact needed›`.
- Select 3–6 questions covering distinct, high-value intents. Prefer concrete outcomes, such as
  “How do I set the Switch value?” or “Why is the Checkbox not changing when I press Space?” Avoid
  generic questions such as “What is accessibility?”.
- Include a question only when its answer adds information not copied verbatim from another section.
  Link to detailed Usage, Accessibility, Properties, or Troubleshooting content instead of repeating
  steps.
- Do not force irrelevant categories onto simple primitives. Each answer must be 2–4 self-contained
  sentences, repeat the component noun, and avoid undocumented defaults, browser support, or
  conformance promises.

**Do/Don't contract:** every component topic ends **Usage** with `### Do/Don't`. It holds
design-usage guidance — how to use the component well — taken from the matching Indigo.Design
component documentation, in this shape:

- **One short paragraph** that states the guidance in prose.
- **One `<DoDont>` block for each do/don't pair.** `doSrc` / `dontSrc` are repo-owned images imported
  from `@xplat-images/‹component›/` (`tabs-do-1.png`, `tabs-do-not-1.png`); `doAlt` / `dontAlt`
  describe what each screenshot shows; the `do` and `dont` slots say in one sentence each why that
  panel is the one to follow or avoid. All four props and both slots are required — the build throws
  without them. Leave a blank line inside each `<Fragment slot="…">` so its text parses as Markdown.
  The component's README in `igniteui-astro-components` is normative for its props.
- **No images yet:** leave a `{/* TODO */}` marker rather than a broken image or hand-written
  do/don't markup (a grid of `<Image>` elements, inline-styled "Do" / "Don't" labels).

No headings, code, install steps, or property tables inside the subsection, and no inline **When to
use:** / **When not to use:** labels — that pattern is retired. **Which component to use instead is
not Do/Don't content: it lives in Related Components.** When `relatedComponents` is non-empty,
**Related Components** names each listed sibling, links it, and says when it is the better fit; when
it is empty (standalone primitives like Badge/Divider), the section states no sibling rather than
inventing one. Canonical example: `layouts/tabs.mdx`.

**Reference-table contract:** Properties / Methods / Events tables are **written by hand and
verified row by row** — no build step generates or injects them; only the full API reference is
generated, and **API References** links to it. Inline tables = the core knobs for fast scanning, not
the whole surface. For every row, check the name, the type, the default, and the description through
the Verification workflow — the API docs for the public surface, the typed source for what they
don't expose — for **each platform the row is shown for**: names, casing, types, and defaults differ
between Angular, the `igc`-based platforms, and Blazor, so one platform's row is never proof for
another. Link the name with `<ApiLink>` wherever the member resolves in that platform's registry;
a name that has no reference entry (a Web Components DOM event such as `igcChange`) stays as code.
A row you cannot
verify is left out or marked `‹VERIFY: …›` — inventing a plausible property or event name is exactly
the failure this contract exists to prevent. Never emit an empty table with a "generated at build"
note: nothing fills it.

**Usage coverage contract:** use property-focused sub-sections to demonstrate every public input.
Prefer one sub-section per standalone property; group
properties only when they are inseparable in real use or define a shared precedence/behavior. Each
sub-section should include a minimal, copyable snippet for every platform it affects. Add a
`<Sample>` only when the demo path is verified and the visual result teaches something the snippet
alone does not.

**Indigo.Design Usage suggestions:** for every component topic, inspect the matching Indigo.Design
component documentation under `https://www.infragistics.com/products/indigo-design/help/components/`
before finalizing or auditing the **Usage** structure. Extract the Indigo.Design component outline
(typically the H2/H3 sections after the demo) and map it to Ignite UI by **meaning**, not by exact
heading text. A section named `Image` may become `Media`; `Card Layout` may become `Layout`;
`Item Content Template` may become `Content`; and a Figma-only `Areas` section may belong in
**Anatomy** instead of **Usage**. Keep useful existing Usage subsections, then suggest or add missing
subsections only when the Indigo.Design section corresponds to a real Ignite UI API, slot, state,
layout pattern, or verified sample. Do not copy Figma-only implementation details into runtime docs;
translate them into the closest verified Ignite UI behavior, or leave them as suggestion-level notes.
If the Indigo.Design topic or asset cannot be reached, state that limitation and continue from the
verified Ignite UI API/source.

**Live Demo contract:** every component topic has a `## Live Demo` section immediately after the
intro and before **Anatomy**. It contains exactly one top preview `<Sample>` per platform of the
simplest useful state, so the page table of contents exposes the demo as a navigable section, and
**nothing else**: the section is sample-only, with no lead sentence — the H1 definition directly
above it already says what the component is, and the sample's `alt` describes the demo. Do not
leave the top sample as a bare block between the intro and Anatomy. Add Usage samples for distinct,
user-facing tasks or property-focused behaviors (selection, editing, sorting, validation,
templating, styling, shape, content, sizing).

**There is no cap on the number of samples.** A thorough component topic carries one for most Usage
subsections — Tabs has 8 per platform, Combo 10. Count per platform: an Angular `<Sample>` and its
`igc` counterpart in sibling `<PlatformBlock>`s are one sample. What a sample must do is earn its
place: show a state or behavior that no other sample on the page shows and that the snippet alone
does not convey. Split a topic by subject, when a feature family deserves a page of its own — never
to get under a count.

### `<Sample>` configuration — pick the props deliberately

`<Sample>` renders a live demo (iframe + source-code tabs + live-edit buttons). **`src` is required and must
point at a real demo path** — treat it like any other identifier under the zero-risk rule: never invent or
guess a `src`, an `lob`/`dv`/`crm`/`wc` base, or a path; use one only when it's verified from the sample project
or an existing topic, else leave a `‹VERIFY: demo path›` marker. Never hand-edit the demo's code — that lives
in the separate sample project.

**The component's README in `igniteui-astro-components` (`src/components/mdx/Sample/README.md`) is
normative for the props and their defaults**; this section says only which to choose. `iframeOnly`
and `hideCode` are deprecated and removed in 2.0.0 — write `chrome="bare"` and `chrome="demo"`.

Choose the display config from **what the sample is showing**, not by habit:

| Prop | Default | Use it when… |
|---|---|---|
| `src` | — (required) | Always. Relative demo path. |
| `alt` | — | **Always** — the iframe title for accessibility. A missing `alt` is an audit finding (E1). Describe the demo, e.g. `alt="{Platform} Tabs example with three tabs that filter a list of people by team"`. |
| `height` | `150` | Set it to the demo's natural height. With `fitContent` it is only the loading placeholder, so the two may be combined. |
| `chrome` | `widget` | What surrounds the demo. `widget` — code tabs and the live-edit footer — when the code *is* the lesson. `demo` — the frame without tabs or code — when the **result** is the point and the snippet above it already shows the code. `bare` — the iframe alone — for an embed that needs no frame. |
| `showThemePicker` | off | The reader should be able to switch the demo between themes. Works with `widget` and `demo`, not with `bare`. |
| `fitContent` | off | The component is small or variable-height (badge, chip, avatar, icon, switch), **or a compact standalone sub-view** (e.g. a calendar days/months/years view), and a fixed frame would waste or clip space. The iframe grows to the component's own height. |
| `fullscreenBtn` | off | With `chrome="bare"`, for large/complex visual demos that benefit from full-screen; the `widget` footer already has the button. |
| `resizable` | off | Responsiveness is the lesson (grids, layout, splitter, dock manager) — lets the reader drag the width. Combines with `fitContent`. |
| `position` | — | A small component would otherwise sit in the top-left; align it (`center`, etc.). |
| `spacing` | `none` | The demo needs breathing room around the iframe (`sm`/`md`/`lg` = 8/16/32px). |
| `noBorder` | `true` | Pass `noBorder={false}` to draw the border whenever the tabs or the footer render (`widget`, `demo`). |
| `noBackground` | `true`; `false` with a theme picker | Pass `noBackground={false}` to draw the backdrop on a sample that has no theme picker. |
| `lob` / `dv` / `crm` / `wc` | default base | The demo lives in the LOB, Data-Viz, CRM, or shared Web Components demos app rather than the default — **verify before setting**. |

Component topics use three shapes; start from these and change a prop only for a reason:

```mdx
{/* Live Demo: code tabs, theme picker */}
<Sample src="…" showThemePicker height={…} noBorder={false} spacing="md" alt="…" />

{/* Usage, showing the result of the snippet above it: no code tabs */}
<Sample src="…" chrome="demo" showThemePicker height={…} noBorder={false} spacing="md" alt="…" />

{/* Styling: code tabs, backdrop, no theme picker */}
<Sample src="…" height={…} noBackground={false} noBorder={false} spacing="md" alt="…" />
```

When the demo path differs between the Angular samples and the `igc`-based ones, put one `<Sample>`
in each `<PlatformBlock>`.

### Anatomy — sub-structure

`## Anatomy` carries four parts, in this order. Canonical example: `layouts/tabs.mdx`.

1. **Lead sentence** naming the component and its main parts.
2. **`<Anatomy>`** with the anatomy image. The component takes `src`, `alt`, and an optional
   `class`; its README in `igniteui-astro-components` is normative. Import the image from
   `@xplat-images/anatomy-content-light/` and pass `src={image.src}`. `alt` describes the parts the
   diagram labels, not merely the component name. `name` and `description` are not props of the
   component and render nothing — don't add them. Size the frame through `class` and a scoped
   `<style>` block only when the default doesn't fit the image.
3. **Numbered legend** — one line for each number in the image: the part name in bold, "(optional)"
   where it applies, and what the part is. The numbers and names match the image exactly.
4. **DOM tree / skeleton** — a `text` fence with the rendered elements, parts, slots, and roles,
   verified from the component template. One lead sentence before each tree; a `//` comment marks
   an element that renders only under a condition. When the `igc`-based platforms and Angular render
   different DOM, give each its own tree in its `<PlatformBlock>`.

### Accessibility — required sub-structure

`## Accessibility` always carries three `###` sub-sections, in this order. All three are **reference**
mode: statements of fact in tables and short lists — no steps, no marketing.

#### Source-first generation contract

Generate the Accessibility section from the component implementation before writing prose. Inspect
the component template/render method and typed source for the rendered native elements, `role`,
`aria-*` attributes, focus/tab-order conditions, disabled handling, and indeterminate or validation
state mapping. Inspect keyboard and pointer event handlers to derive the key-to-action table and
state transitions. Inspect the public API registry to verify property and event names, then map each
fact to the platform that actually implements it. The repositories and folders to read are listed in
the Verification workflow, step 4. Read the `igc` source and the Angular source **separately**: they
render different DOM and handle different keys, so a fact from one is never proof for the other.

- Treat rendered template/source as the authority for DOM, roles, ARIA attributes, and default state
  behavior; treat the topic's existing prose as evidence to re-check, never as the source.
- Treat event handlers as evidence for interaction and state changes only. An event name does not
  prove an accessible name, role, state, or WCAG conformance claim.
- For xplat topics, emit shared facts once and use `<PlatformBlock>` when Angular differs from the
  Web Components implementation or its React/Blazor wrappers.
- Include only verified attributes, events, and state behavior. If source is unavailable or a fact
  cannot be resolved, write `‹VERIFY: source fact needed›` or omit it; never infer ARIA behavior from
  a component name or a generic HTML pattern.
- Derive the compliance table only from behavior verified in the section and an official product
  accessibility statement. Do not generate blanket WCAG/Section 508 compliance claims.

1. **`### Keyboard Interaction`** — one key → action table, verified against the component's key
   handlers. Note how the component is reached (Tab) and any condition that removes it from the tab
   order.
2. **`### Screen Readers / ARIA`** — the roles, `aria-*` attributes, and announcements the component
   provides (from source), plus what the reader must supply (e.g. `aria-label` when the visible
   content doesn't describe the action).
3. **`### Accessibility Compliance`** — the conformance evidence, in this shape:
   - **Lead sentence** that links the product-level statement instead of restating it. The xplat
     `interactivity/accessibility-compliance.mdx` topic records the standards {ProductName} targets
     (WCAG 2.1 Level AA, Section 508, EN 301 549) and calls itself a support summary, not a formal
     conformance statement. Point at it — "Infragistics documents {ProductName} accessibility
     support for Section 508 and WCAG 2.1 guideline areas in the [Accessibility Compliance](…)
     topic." — and claim no conformance level for the component itself. A target that topic does
     not state is `‹VERIFY: conformance target›`.
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

#### Compliance index row

The **Component Support** section of `interactivity/accessibility-compliance.mdx` indexes what each
component's documentation covers, in two tables: one inside `<PlatformBlock for="Angular">` and one
inside `<PlatformBlock for="React, WebComponents, Blazor">`. Whenever a topic gains or changes its
**Accessibility** section, update the component's row in the same change, **in every table the
component appears in**:

- Set **Keyboard interaction** and **Screen reader / ARIA** to `Documented` only for what the
  section really covers on that platform; leave `Not documented yet` where it does not.
- Point the component link and the **Reference** cell at the topic's `#accessibility` anchor.

Row shape: `| [Tabs](../layouts/tabs.mdx#accessibility) | Documented | Documented | [Accessibility](../layouts/tabs.mdx#accessibility) |`.
A stale row — still `Not documented yet`, or linking a retired anchor such as `#keyboard-navigation`
or a deleted Angular file — tells readers the component has no accessibility documentation.

## Overview topics

**5a. Concept / guide overview** (Diátaxis: *explanation*) — e.g. "Theming concepts":
Title + intro → **Overview** → **Before You Start** → **Next Steps** → **Available Tools** →
**Common Workflows** → optional **Troubleshooting** (only with a verified problem to answer) →
**Additional Resources** → optional **FAQ**. Use an
accordion for FAQ content when a compact question-and-answer block is useful.

**5b. Category / index overview** (Diátaxis: *reference/navigation* — a map) — e.g. "Charts overview":
The page starts with an H1 and a concise introductory block: a clear category definition and, when
needed, brief context about its scope or purpose. Follow it with **Key Features** (open with a short intro and a compact `Feature` / `Description` /
`Benefits` table) → top-level **Types / Members** section when the category maps component
types. Each concrete type/member, such as `{Platform} Data Grid`, `{Platform} List`, or
`{Platform} Tree Grid`, is its own navigable `###` child subsection with a concise definition,
verified link, and a verified `<Sample>` for every entry) → additional feature
subsections as needed → **Next Steps** → **Accessibility** → **API References** → **Additional Resources** → **FAQ**.

The category introduction must not use the component-topic sequence `When to Use`,
`When Not to Use`, `Live Demo`, `Getting Started`, `Usage`, `Properties`,
`Accessibility`, or `Troubleshooting` in the category introduction. Selection guidance belongs in the
category definition or in the relevant type/member entry, and a demo belongs inside the entry it
demonstrates. Supporting sections follow the navigation sections and must contain verified,
category-specific content.

Guardrails: cap each section at ~3 short paragraphs (else add sub-sections); isolate marketing copy in
a single "Why {ProductName}" section — never thread it through instructional content.

## Naming reconciliation (drift → standard)

| Seen in the wild | Standard name |
|---|---|
| "Angular X Component Overview"; "X Component Overview"; "{Platform} X Component Overview" (H1) | **`X`** (H1 — drop the framework, "Component", and "Overview"; `# Tabs`) |
| Setup; "Getting Started with…"; "Getting Started with Ignite UI for Angular X" | **Getting Started** |
| Code Snippet; Examples; "Using the … Component"; "{Platform} X Example"; "Angular X Example" | **Usage** |
| "Avatar Shape"; "‹Component› ‹Feature›" (Usage sub-heading) | **`‹Feature›`** (drop the component name) |
| Configuration | **Properties** |
| "X vs Y"; "Choosing Between X and Y" | **Related Components** (each sibling linked, with when it is the better fit) |
| Behavior; Feature Integration | **Do/Don't** (as the final `###` under **Usage**) |
| top-level `## When to Use` / `## When Not to Use`; `### When to Use` / `### When Not to Use`; **When to Use / When Not to Use nested under `## Anatomy`**; inline **When to use:** / **When not to use:** labels under `### Do/Don't` | No heading and no label: what the component is for goes in the **Usage** lead sentence, design guidance in `### Do/Don't` as `<DoDont>` blocks, and the better-fit sibling in **Related Components** |
| Summary (as lead-in) | intro ¶ or **Overview** |
| Keyboard Navigation | **Accessibility** |
| WAI-ARIA Support; Compliance; Section 508; Accessibility Statement | **`### Accessibility Compliance`** (under **Accessibility**) |
| Best Practices; Do's and Don'ts; Guidelines; Recommendations | **Do/Don't** (as the final `###` under **Usage**) |
| Theming (H2) | **Styling** (H2); the Sass approach becomes `### Sass Theming` under it |
| `### Tailwind`; `### Tailwind Styling` (under **Styling**) | **`### Styling with Tailwind`** |
| Known Issues and Limitations; Limitations; Known Issues | **Known Limitations** (a conditional top-level section, present only when verified limitations exist; it may live as `### Known Limitations` under **Troubleshooting** only when the limitations directly support that troubleshooting guidance — see section 12. Troubleshooting *fixes* found under a limitations heading move to **Troubleshooting**.) |
| API; API Reference (singular) | **API References** |
| Theming Dependencies | **Dependencies** |

## Entity terminology (canonical names)

Source: blog-creator product-context v4 · 2026-08-14. This table is a governed copy: when the blog
set's terminology table changes, update this section in the same change and keep both version lines
aligned. Docs are the highest-authority entity signal the site emits — assistants consolidate
entities from repeated identical naming, and drift fragments the association. These names bind body
prose, headings, and frontmatter alike; the frontmatter skill audits the metadata side, rubric B6
audits the body side.

- Canonical component term: **"[Framework] Data Grid"** (title case): "Angular Data Grid", "React
  Data Grid", "Web Components Data Grid", "Blazor Data Grid". Permitted shorthand after first
  mention: "the Data Grid". In the xplat set, write it with the token: "{Platform} Data Grid".
- Sibling components are fixed compounds, always fully qualified: **Tree Grid, Hierarchical Grid,
  Pivot Grid**. Bare "grid" only as a common noun inside feature phrases ("grid features", "bind the
  grid to data"); never as the standalone entity name, never in titles or headings.
- Banned entity synonyms: "datagrid" (one word, except when quoting an API symbol), "grid component"
  as subject noun, silent drift to "table"/"data table". Ecosystem synonyms stated once as an
  explicit equivalence are fine ("row pinning (also known as frozen rows)").
- Product names verbatim: "Ignite UI for Angular", "App Builder"; no abbreviation drift ("IgniteUI",
  "AppBuilder") in prose. In the xplat set, prefer `{ProductName}` where the resolved product name is
  meant.

## Write-for-both-audiences rules (people + AI assistants)

1. **One job per section** — self-contained; no "as mentioned above." A section must make sense landed-on cold.
2. **Lead each section with one plain, specific sentence that names the component** (with the platform token where the set uses them) before any table/code — skip empty boilerplate. **Live Demo** is the one exception: it is sample-only. Sections are the retrieval chunks; a chunk that never names its subject is invisible to the query that should retrieve it.
3. **Use the standard section names everywhere** — "Accessibility" always means the same thing.
4. **Phrase guidance/troubleshooting as real questions** — the better-fit redirect in **Related Components** is the highest-value content for answer accuracy; name the sibling explicitly.
5. **Reference lives in tables**, every row verified through the Verification workflow.
6. **Strong `description` / `llms.description`** — <~160 chars, answer-shaped, definition-first; `llms.description` defines the component, not the page (full contract in "File format & frontmatter").
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
- **Blazor module registration.** A Blazor component loads its own module the first time it renders, so Getting Started shows the bare `builder.Services.AddIgniteUIBlazor()` call (the one setup step a Blazor component page repeats), then names the component's own module as **optional**, linked to the **Component Modules** section of the general getting-started topic. Don't list the modules of other components the content uses. List as required only feature modules that no component loads (chart interactivity, the Dashboard Tile's visualizations). Canonical example: `inputs/badge.mdx`.
- **Styling leads with the reference and shows the result where it is produced.** The Styling
  section opens with an intro line and the variables and parts tables; its subsections are
  `### Sass Theming` (the Sass theme workflow), `### CSS Variables`, and `### Styling with Tailwind`,
  in that order. Each styled-result `<Sample>` sits in the subsection whose snippet produces it.
- **One styling table — never per-theme tabs, never default values.** In the `theming` repo every
  theme schema `extend`s the same base schema and only overrides *values* (e.g. `$material-switch`,
  `$fluent-switch`, `$indigo-switch` all extend `$light-switch`; `$bootstrap-switch` extends
  `$fluent-switch`), so **every theme exposes the identical variable set** — only the defaults differ.
  Per-theme tabbed tables (the legacy `.theme-switcher-wrapper` / `.theme-table` markup) therefore
  document a difference that doesn't exist; replace them with **one two-column table:
  variable · what it changes**. Don't add a defaults column either — defaults vary per theme and
  belong to the generated API reference, and the durable content is the variable's name and effect.
- **An xplat (DV) topic states its component as a `json-snippet` by default.** Generation emits each
  platform's own code from the product's description metadata, so the four to six copies cannot drift
  apart and a property that does not exist cannot be published. A platform-specific snippet is
  discouraged rather than banned: it stays the right tool where a definition genuinely cannot carry the
  lesson — a data shape with no component in it, a namespace declaration, a package install, a step
  only one platform family has — and the reason belongs wherever the change is recorded. **Web-only
  topics are exempt**; a per-platform block there is not a defect. `docs/xplat/JSON-SNIPPETS.md` is normative and the
  `xplat-docs-json-snippets` skill is the working guide. The rest of this bullet applies to the blocks
  a topic still authors by hand — Angular's own topics, and the xplat sections a fence cannot state.
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
- **Styling Variables tables are curated by hand too.** The *Reference-table contract* above covers
  Properties / Methods / Events; the same holds here. Hand-author a **small core** table whose every
  row is **verified from source** — the `@param` doc-comments in the component's `_…-theme.scss` —
  and link `<ApiLink>` for the complete set. The zero-risk rule still applies: no unverified rows.

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

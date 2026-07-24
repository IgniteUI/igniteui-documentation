---
name: igniteui-doc-topics
description: >-
  Author or audit Ignite UI documentation topics — component pages, how-to guides, conceptual
  overviews, and category indexes — for both the Angular doc set and the cross-platform (React /
  Web Components / Blazor) doc set. Applies the Diátaxis framework mapped onto Ignite UI's house
  templates: canonical section order, fixed heading names, frontmatter (including `llms.description`
  and the `relatedComponents` trigger), `.mdx` sample embeds, and per-framework token/PlatformBlock
  mechanics. Use this whenever someone asks to write, draft, create, review, audit, fix, or
  standardize a documentation topic, tutorial, guide, reference page, or concept overview for Ignite
  UI — even if they just say "write docs for the X component" or "review this topic" without naming
  Diátaxis or the templates. Also use it when deciding what *kind* of documentation a page should be,
  or when a topic mixes tutorial / how-to / reference / explanation content that should be separated.
---

# Ignite UI doc topics

Write and audit Ignite UI documentation topics so every page has the same predictable shape — easy
for developers to read and for AI assistants to answer from. The engine is **Diátaxis** (four
documentation modes) applied through **Ignite UI's house templates**.

## Two modes of operation

- **Create** — draft a new topic (component, concept/guide, or category/index) to the standard.
- **Audit** — review an existing topic against the standard and return an issues-and-fixes report.

Detect which from the request ("write/draft/create" → Create; "review/audit/check/fix/standardize" →
Audit). If a topic file or content is supplied, default to Audit unless they ask for a rewrite.

## Reference files — load what the task needs

- `references/diataxis-cheatsheet.md` — the four modes + the compass. Load when classifying a topic
  or diagnosing mode-bleed.
- `references/house-style.md` — sections, order, naming, frontmatter, sample/token mechanics, both
  doc sets. Load for **every** create or audit.
- `references/audit-rubric.md` — the checkable rules + report format. Load for **every** audit.

Read `house-style.md` before writing or judging any topic — it carries the mechanical details
(frontmatter fields, `<Sample>`/`<PlatformBlock>` syntax, Angular-vs-xplat differences) that aren't
in this file.

## Step 0 — Classify with the compass (always first)

Before writing or auditing, decide what *kind* of documentation the page is, using the compass from
the cheat-sheet:

> **action or cognition?**  ×  **acquisition (study) or application (work)?**
> → tutorial · how-to · reference · explanation

- A **component page** is a *composite* (see below).
- A **concept / guide overview** is **explanation**.
- A **category / index overview** is **reference/navigation** (a map).
- A standalone **"How to …" article** is a **how-to guide** — keep it single-mode.

If a request is ambiguous ("document X"), state which topic type you're producing and why, in one
line, before proceeding.

## The composite-topic principle (the heart of this skill)

Pure Diátaxis says keep the four modes in **separate** documents. Ignite UI **component topics
deliberately don't** — one page carries a live demo, a how-to (Getting Started/Usage),
decision guidance in Usage's final Do/Don't subsection, and reference tables
(Properties/Methods/Events). That is fine **because each *section* owns exactly one mode.** The rule
that makes it work:

> **One section, one mode. No mode-bleed.** Each section stays in its assigned Diátaxis mode; when a
> second mode wants in, move it to the section that owns it and cross-link.

Section → mode map (full contents in `house-style.md`):

| Section | Mode | Stays out of |
|---|---|---|
| Live Demo | demonstration (action) | prose/explanation |
| Anatomy: visual + DOM tree / skeleton | orientation (reference) | opinion, install steps |
| Getting Started, Usage | **how-to** | *why* explanations, exhaustive option lists |
| Getting Started → Prerequisites and Version Compatibility | reference / how-to | unverified support claims, migration history |
| Usage → Do/Don't | **explanation** | install steps, code, API detail |
| Properties / Methods / Events | **reference** | instructions, opinion |
| Styling (`### Sass Theming`, `### Tailwind`, …) | how-to (steps) + reference (tables) | conceptual essays |
| Accessibility | reference (keyboard/ARIA/compliance tables) | tutorials, marketing, unverified conformance claims |
| Troubleshooting | how-to (cause → fix) | background theory |
| Known Limitations | **reference** | troubleshooting fixes, tutorials, unverified claims |
| API References / Dependencies / Additional Resources / Related Components / FAQ | reference / navigation | new teaching |

Concrete mode-bleed to catch: a *why* paragraph inside **Usage** (→ move to Do/Don't or a concept
topic, link back); "how to build X" prose inside **Properties** (→ move to Usage; keep the table
descriptive); an exhaustive option list written out in **Usage** prose (→ move to the table). The
cheat-sheet's "two classic confusions" section explains the reasoning.

## Create workflow

1. **Classify** (Step 0). Name the topic type.
2. **Pick the doc set & framework.** Angular set = its own file, plain prose. xplat set = one file
   for React/WC/Blazor using `{Platform}`/`{ProductName}` tokens and `<PlatformBlock for="…">`. Load
   the relevant details from `house-style.md`.
3. **Follow the verification workflow** in `house-style.md` before writing technical content.
   Existing snippets and old prose are clues, not authority. For component topics, also inspect the
   matching Indigo.Design component documentation under
   `https://www.infragistics.com/products/indigo-design/help/components/` and use its component
   structure as input for Usage subsection suggestions.
4. **Write frontmatter first** — `title`, `description` (answer-shaped, ≤~160 chars), `keywords`,
   `license`, `llms.description`, `mentionedTypes` (xplat), and `relatedComponents` if the component
   has close siblings (this lets **Usage**'s final **Do/Don't** subsection name the specific
   sibling instead of speaking generically).
5. **Lay out the canonical sections** in order for that topic type, required ones always present.
   Feature-specific content goes as sub-headings under **Usage**, never as new top-level sections.
6. **Fill each section in its mode.** Lead every section with one plain, specific sentence. Put
   reference in tables. In **Usage**, add property-focused sub-sections so every public input is
   shown with a minimal snippet; group only tightly coupled properties that form one behavior. Keep
   existing useful subsections, then compare against Indigo.Design's component sections by meaning,
   not by exact heading name, to suggest or add any missing runtime-relevant Usage subsections.
   End **Usage** with `### Do/Don't`, using inline **When to use:**
   and **When not to use:** labels rather than nested headings, plus the matching guidance image
   from the Indigo.Design documentation or a `{/* TODO */}` marker when the asset is not available.
   Add a required `## Live Demo` section
   with exactly one top `<Sample>`, then Usage samples only for distinct tasks (soft max 5/page).
   Phrase Do/Don't and Troubleshooting as the reader's real questions. Include the required
   `### Prerequisites and Version Compatibility` subsection under **Getting Started**, and the
   required **Known Limitations**, **Related Components**, and **FAQ** sections in their canonical
   positions.
7. **Self-check against the rubric** before presenting — especially mode-bleed (C-checks) and
   metadata (D-checks). Fix, then deliver the `.mdx`.

## Audit workflow

1. **Classify** the topic and identify its doc set (Angular vs xplat) and type.
2. **Follow the verification workflow** in `house-style.md` before judging technical content.
   Old snippets/prose are never the source of truth by themselves. For component topics, inspect the
   matching Indigo.Design component documentation and compare its structure to the topic's Usage
   subsections by semantic content, not heading text, before making Usage-coverage suggestions.
3. **Run every check** in `references/audit-rubric.md` — structure/order (A), naming (B), Diátaxis
   mode integrity (C), metadata/AI-readiness and correctness (D), samples/links (E), formatting and
   snippet currency (F). For mode integrity, run the compass on each section and flag drift.
   For detailed frontmatter-only audits or normalization, use the companion
   `igniteui-topic-frontmatter` skill; for full topic audits, apply only the basic metadata checks
   here unless the user asks for frontmatter suggestions.
4. **Report** in the rubric's exact format: Verdict → Summary → Findings (each with Where / Issue /
   Principle / Fix) → Quick wins. Order findings Error → Warning → Suggestion.
5. Keep every **Fix** concrete and applyable (the corrected heading, the sentence to move, the table
   to add). If the topic is already clean, say so and note what it does well — don't invent problems.

## Grounding notes

- The live `vnext` repo is **pre-standardization**: expect drifted headings (`## Angular Rating
  Example`, `## Configuration`) and a missing `relatedComponents` field. Author to the **target**
  standard; audit against it while recognizing current reality.
- **Invent no verifiable identifier (zero-risk rule).** Never emit a guessed tag, class, package,
  property, method, event, CSS part, or theming variable — a plausible-but-wrong name a reader copies is
  worse than a visible gap. Use an identifier only when verified (typed API source, an existing topic,
  or the user); otherwise write `‹VERIFY: …›`. For Properties/Methods/Events, emit the fixed column
  headers plus a build-injection note and leave the rows to the generator. React/Blazor wrapper symbols
  resolve to the `igc` core — prefer verified `igc` usage and mark unconfirmed wrapper names `‹VERIFY:…›`.
  (Full detail in `house-style.md` → "Never fabricate API identifiers".)
- Prefer paraphrase and the standard section names over copying any existing topic's prose verbatim.
- **Write in one voice and verify every claim** (see house-style → *Voice & tone* and *Verify every
  claim against the component*): instruct in the imperative/second person, and check every factual
  statement — defaults, behavior, version support, DOM — against the MCP/API-doc source, the official
  platform API docs, typed source when needed, or official framework docs before writing it or
  recommending it as an edit. Don't "correct" prose into a plausible claim you haven't verified.

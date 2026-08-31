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
  For frontmatter-only audits or metadata normalization, use the companion igniteui-topic-frontmatter
  skill instead.
---

# Ignite UI doc topics

Version: v4 · 2026-08-31 · igniteui doc-skill set. All set files carry this version line; before
editing any file, confirm the lines match across the set. The `.claude` adapter's `description` must
byte-match this file's `description`. Change log: `.ai/skills/CHANGELOG.md` · human-readable intent:
`.ai/skills/README.md`.

Write and audit Ignite UI documentation topics so every page has the same predictable shape — easy
for developers to read and for AI assistants to answer from. The engine is **Diátaxis** (four
documentation modes) applied through **Ignite UI's house templates**.

**This file is a routing hub only: no section blueprints, no field rules, no check lists live
here.** The templates and the API surface both change; never author or judge from memory — read the
reference files the task needs, then act.

## Two modes of operation

- **Create** — draft a new topic (component, concept/guide, or category/index) to the standard.
- **Audit** — review an existing topic against the standard and return an issues-and-fixes report.

Detect which from the request ("write/draft/create" → Create; "review/audit/check/fix/standardize" →
Audit). If a topic file or content is supplied, default to Audit unless they ask for a rewrite.

## Step 0 — Classify with the compass (always first)

Before writing or auditing, decide what *kind* of documentation the page is, using the compass from
the cheat-sheet:

> **action or cognition?**  ×  **acquisition (study) or application (work)?**
> → tutorial · how-to · reference · explanation

A **component page** is a *composite* (below). A **concept / guide overview** is **explanation**.
A **category / index overview** is **reference/navigation** (a map). A standalone **"How to …"
article** is a **how-to guide** — keep it single-mode. If a request is ambiguous ("document X"),
state which topic type you're producing and why, in one line, before proceeding.

## The composite-topic principle (the heart of this skill)

Pure Diátaxis keeps the four modes in separate documents. Ignite UI component topics deliberately
carry all four on one page — a live demo, how-to sections, decision guidance, reference tables.
That works **because each *section* owns exactly one mode**:

> **One section, one mode. No mode-bleed.** Each section stays in its assigned Diátaxis mode; when a
> second mode wants in, move it to the section that owns it and cross-link.

The section → mode map is the "Diátaxis mode" column of the canonical section table in
`references/house-style.md`. Concrete mode-bleed to catch: a *why* paragraph inside **Usage**
(→ move to Do/Don't or a concept topic, link back); "how to build X" prose inside **Properties**
(→ move to Usage; keep the table descriptive); an exhaustive option list written out in **Usage**
prose (→ move to the table). The cheat-sheet's "two classic confusions" section explains the
reasoning.

## Task → Reference file

| Task | Reference file to read |
|---|---|
| Classifying a topic or a section; diagnosing mode-bleed | [`references/diataxis-cheatsheet.md`](./references/diataxis-cheatsheet.md) |
| **Every create or audit:** section order and blueprints (component, concept, category), frontmatter contract, naming reconciliation, entity terminology, sample/token/`<PlatformBlock>` mechanics, verification workflow, voice, formatting | [`references/house-style.md`](./references/house-style.md) |
| **Every create:** the step-by-step authoring workflow (scaffold → sections → self-check), including the category/index structure | [`references/create-workflow.md`](./references/create-workflow.md) |
| **Every audit:** the audit workflow, all checkable rules (A–F), and the report format | [`references/audit-rubric.md`](./references/audit-rubric.md) |
| Detailed frontmatter-only audits or normalization | the companion [`igniteui-topic-frontmatter`](../igniteui-topic-frontmatter/SKILL.md) skill; for full topic audits, apply only the rubric's basic metadata checks unless the user asks for frontmatter suggestions |

> **When in doubt, read more rather than fewer reference files.** The cost of an unnecessary read is
> negligible; the cost of a hallucinated API name or a drifted section heading is a broken page that
> poisons AI answers.

## Grounding boundaries (apply in both modes)

- **Invent no verifiable identifier (zero-risk rule).** Never emit a guessed tag, class, package,
  property, method, event, CSS part, theming variable, or `<Sample>`/`<ApiLink>` target — a
  plausible-but-wrong name a reader copies is worse than a visible gap. Verified sources only;
  otherwise write `‹VERIFY: …›`. Full detail: house-style → "Never fabricate API identifiers".
- **Verify every claim against the component** (defaults, behavior, version support, DOM) through
  the verification workflow in house-style — MCP source first, then official platform API docs,
  typed source, official framework docs. Existing topic prose and snippets are evidence to check,
  never a source of truth. Don't "correct" prose into a plausible claim you haven't verified.
- **One voice:** imperative, second person, present tense; no marketing in instructional prose
  (house-style → "Voice & tone").
- The live `vnext` repo is **pre-standardization**: expect drifted headings and missing
  `relatedComponents`. Author to the target standard; audit against it while recognizing current
  reality. Prefer paraphrase and the standard section names over copying any existing topic's prose
  verbatim.

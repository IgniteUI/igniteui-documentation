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

# Ignite UI doc topics adapter

This is a Codex adapter for the canonical repo-local skill.

Before doing any task actions, read and follow the canonical skill at:

`../../../.ai/skills/igniteui-doc-topics/SKILL.md`

Resolve every canonical reference path relative to that canonical skill directory:

- `../../../.ai/skills/igniteui-doc-topics/references/diataxis-cheatsheet.md`
- `../../../.ai/skills/igniteui-doc-topics/references/house-style.md`
- `../../../.ai/skills/igniteui-doc-topics/references/audit-rubric.md`

Do not treat this adapter as a separate source of rules. If this adapter conflicts with the canonical
skill, the canonical `.ai` skill wins.

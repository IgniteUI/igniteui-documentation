---
license: MIT
name: igniteui-topic-frontmatter
description: >-
  Audits and normalizes YAML frontmatter metadata on Ignite UI MDX documentation topics: SEO titles,
  meta descriptions, llms.description, keywords, canonical links, relatedComponents, mentionedTypes,
  license and the AI-readable page identity, across the Angular and xplat doc sets. It is strictly
  frontmatter-only, audit-first: it reports findings and offers suggestions for the user to choose
  from before changing anything, and never edits topic body content, headings, prose, samples, code
  snippets, links, tables or section structure.
  WHEN TO USE: a task mentions frontmatter, SEO titles, meta descriptions, llms.description,
  keywords, canonical links, relatedComponents, mentionedTypes, metadata uniformity, or AI-readable
  page identity on a documentation topic.
  WHEN NOT TO USE: anything touching body content, structure, headings, prose or samples (use
  igniteui-doc-topics), or frontmatter on a SKILL.md rather than on a topic (use skill-authoring).
user-invocable: true
---

# Ignite UI topic frontmatter

Version: v4 · 2026-10-06 · igniteui doc-skill set. All set files carry this version line; before
editing any file, confirm the lines match across the set. The `.claude` adapter's `description` must
byte-match this file's `description`. Change log: `.agents/CHANGELOG.md` · human-readable intent:
`.agents/README.md`.

Audit Ignite UI documentation topic frontmatter so pages have modern, uniform metadata for SEO,
generated schema, and LLM-readable manifests — without touching the topic body.

**This file is a routing hub only: no audit rules, no field shapes, and no report formats live
here.** The metadata contract is precise and versioned; never audit or normalize from memory — read
the reference files first, then act.

## Scope and operating mode

Only inspect and discuss the YAML frontmatter block between the opening and closing `---`. Never
edit or rewrite headings, body prose, samples, code snippets, API tables, links outside frontmatter,
or section order. If a metadata issue depends on body content, cite the body only as evidence and
suggest a frontmatter change.

This skill is **audit-first**:

1. Read the topic's frontmatter.
2. Read the reference files below, then audit against them.
3. Return categorized findings and concrete replacement suggestions in the standard report format.
4. Stop. Do not edit the file until the user explicitly selects what to change; then follow the
   apply procedure in the report-format reference.

## Task → Reference file

| Task | Reference file to read |
|---|---|
| Any audit or normalization: field-by-field quality checks, doc-set/token rules, severity ladder | [`references/audit-rules.md`](./references/audit-rules.md) |
| The normative field contract — which fields exist, their shapes and quality bars (authoritative where wording differs) | [`../igniteui-doc-topics/references/house-style.md`](../igniteui-doc-topics/references/house-style.md) → "File format & frontmatter" |
| Canonical component/product naming for metadata values | [`../igniteui-doc-topics/references/house-style.md`](../igniteui-doc-topics/references/house-style.md) → "Entity terminology" |
| Producing the audit report; applying user-selected suggestions | [`references/report-format.md`](./references/report-format.md) |

> **When in doubt, read more rather than fewer.** A missed field rule doesn't just weaken one page:
> docs metadata is the strongest entity signal the site emits, and drift fragments it.

## Hard boundaries

- **Never invent a canonical link.** Flag inconsistent or suspicious `_canonicalLink` values, but
  require an explicit canonical policy or nearby precedent before suggesting a replacement.
- **Never invent API type names** for `mentionedTypes`; if unsure, flag as a verification issue.
- **Unresolved facts stay visible.** Use `‹VERIFY: …›` placeholders; never replace uncertainty with
  a plausible value.
- **No edits before explicit user selection.** Findings and suggestions first, changes only on
  request, and only to the fields the user selected.

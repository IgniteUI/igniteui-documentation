---
name: igniteui-topic-frontmatter
description: >-
  Audit and normalize YAML frontmatter metadata for Ignite UI MDX documentation topics. Use when a
  task mentions frontmatter, SEO titles, meta descriptions, llms.description, keywords, canonical
  links, relatedComponents, mentionedTypes, license, metadata uniformity, or AI-readable page
  identity in Ignite UI Angular or xplat documentation topics. This skill is strictly
  frontmatter-only: audit first and provide suggestions for the user to choose from before changing
  anything; never edit topic body content, headings, prose, samples, code snippets, links, tables, or
  section structure.
---

# Ignite UI topic frontmatter

Audit Ignite UI documentation topic frontmatter so pages have modern, uniform metadata for SEO,
generated schema, and LLM-readable manifests without touching the topic body.

## Scope

Only inspect and discuss the YAML frontmatter block between the opening and closing `---`.

Do not edit or rewrite:

- H1/H2/H3 headings
- intro paragraphs or body prose
- samples, code snippets, API tables, or links outside frontmatter
- section order or topic structure

If a metadata issue depends on body content, cite the body content only as evidence and suggest a
frontmatter change. Leave the body unchanged.

## Operating mode

This skill is **audit-first**.

1. Read the topic's frontmatter.
2. Audit it against the rules below.
3. Return categorized findings and concrete replacement suggestions.
4. Stop. Do not edit the file until the user explicitly selects what to change.

When the user later asks to apply selected suggestions, edit only the frontmatter fields involved in
those selected suggestions.

## Doc sets

- Angular topics live under `docs/angular/src/content/<lang>/components/`.
- xplat topics live under `docs/xplat/src/content/<lang>/components/` and may use tokens such as
  `{Platform}`, `{ProductName}`, `{ComponentTitle}`, and `{ComponentKeywords}`.

Keep valid platform tokens in xplat frontmatter. Do not replace them with a single concrete
framework name unless the topic itself is framework-specific.

For xplat component metadata, avoid repeating the framework identity in the same field. The xplat
site layout already appends the resolved product name to the HTML title, so use
`title: "{Component}"` and do not add `| {ProductName}` in topic frontmatter. Use `{ProductName}` in
`description` and `llms.description` when the resolved product name identifies the platform, and use
`{Platform}` in `keywords` or when the field genuinely needs the shorter platform label.

## Expected fields

Common fields:

```yaml
---
title: "..."
description: "..."
keywords: "..."
license: MIT
llms:
  description: "..."
---
```

Additional fields when relevant:

```yaml
mentionedTypes: ["ComponentType"]
relatedComponents: [SiblingComponent]
_canonicalLink: "{environment:dvUrl}/components/..."
last_updated: "YYYY-MM-DD"
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 3
```

Do not require optional fields globally. Recommend them only when the topic type or existing repo
pattern warrants them.

## Audit rules

### Required quality checks

- **Title:** present, concise, and topic-specific. Prefer the pattern
  `{Component} | Ignite UI for {Framework}` for component topics, using `{ProductName}` where that
  token resolves to the framework-specific product name. Do not duplicate the framework/platform in
  both the component phrase and product phrase (for example, prefer `Avatar | Ignite UI for React`
  over `React Avatar | Ignite UI for React`). Avoid "complete guide", "ultimate guide",
  "try for free", and other marketing phrases.
- **Description:** present, about 140-160 characters when practical, answer-first, and specific
  enough to stand alone in search results and generated schema. Avoid marketing calls to action.
- **`llms.description`:** present and more answer-shaped than the meta description. It should be a
  single self-contained sentence that says what the topic/component is and what it helps developers
  do. Prefer this over keyword stuffing.
- **Framework/package clarity:** frontmatter must not blur Angular, React, Web Components, and
  Blazor APIs. Angular topics should identify Ignite UI for Angular when needed. xplat topics should
  use `{Platform}` / `{ProductName}` tokens instead of hard-coded single-framework wording.
- **`license`:** present when the topic belongs to a doc set that uses license frontmatter.
- **`mentionedTypes`:** xplat component topics should list the concrete API types linked or
  discussed by the page. Do not invent API type names; if unsure, flag as a verification issue.
- **`relatedComponents`:** recommend only for close sibling components that should affect Do/Don't
  guidance. Do not add generic category neighbors just to fill the field.
- **`keywords`:** treat as legacy/internal metadata, not an SEO optimization surface. Keep it
  coherent if present, but do not spend effort keyword-stuffing. If the repo later drops `keywords`,
  remove it only when the user asks or a repo-level policy exists.
- **`_canonicalLink`:** do not invent. Flag inconsistent or suspicious canonical links, but require
  an explicit canonical policy or nearby precedent before suggesting a replacement.
- **`last_updated`:** do not add to component topics by default. Recommend it only for topic families
  that already use it or when the value is generated/maintained by a clear source of truth.

### Severity

- **Error:** missing required frontmatter for the doc set, malformed YAML, or metadata that clearly
  misidentifies the component/framework.
- **Warning:** weak, inconsistent, misleading, too-long, or marketing-heavy metadata.
- **Suggestion:** polish, consistency improvements, optional fields, or policy-dependent changes.

## Report format

Use this shape:

```md
# Frontmatter Audit: <topic path>

**Verdict:** <Conforms | Minor drift | Needs work | Invalid>
**Summary:** <1-2 sentences about the highest-value metadata fixes.>

## Findings
### <Error|Warning|Suggestion> · <short title>
- **Field:** `<field name>`
- **Issue:** <what is wrong>
- **Suggestion:** <specific replacement or action>

## Suggested Frontmatter Changes
| Field | Current | Suggested | Reason |
|---|---|---|---|
| `description` | ... | ... | ... |

No file changes were made. Tell me which suggestions to apply.
```

If there are no issues, say that the frontmatter conforms and do not invent changes.

## Applying selected suggestions

When the user explicitly asks to apply one or more suggestions:

1. Re-read the file.
2. Modify only the YAML frontmatter block.
3. Preserve unrelated frontmatter fields and field order where practical.
4. Do not edit body content after the closing `---`.
5. Run a focused diff check when available.

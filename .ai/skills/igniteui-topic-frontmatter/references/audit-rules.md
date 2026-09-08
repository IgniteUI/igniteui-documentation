# Frontmatter audit rules

Version: v4 · 2026-08-31 · igniteui doc-skill set. Content carried from SKILL.md v2 unchanged;
restructured into this reference so rules can evolve without touching the router. The normative
field contract lives in `../../igniteui-doc-topics/references/house-style.md` → "File format &
frontmatter"; where wording differs, house-style wins.

## Doc sets and tokens

- Angular topics live under `docs/angular/src/content/<lang>/components/`.
- xplat topics live under `docs/xplat/src/content/<lang>/components/` and may use tokens such as
  `{Platform}`, `{ProductName}`, `{ComponentTitle}`, and `{ComponentKeywords}`.

Keep valid platform tokens in xplat frontmatter. Do not replace them with a single concrete
framework name unless the topic itself is framework-specific.

For xplat component metadata, avoid repeating the framework identity in the same field. The xplat
site layout already appends the resolved product name to the HTML title, so use
`title: "{ComponentTitle}"` and do not add `| {ProductName}` in topic frontmatter. Use `{ProductName}` in
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
last_updated: "YYYY-MM-DD"
llms:
  description: "..."
---
```

Additional fields when relevant:

```yaml
mentionedTypes: ["ComponentType"]
relatedComponents: [SiblingComponent]
_canonicalLink: "{environment:dvUrl}/components/..."
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 3
```

The xplat component topic standard requires `last_updated`. Other optional fields should be
recommended only when the topic type or existing repo pattern warrants them.

## Schema linkage

Frontmatter feeds the generated page schema, so its quality bars are schema quality bars:
`description` should be usable verbatim as the schema description, and any FAQ schema the pipeline
emits must source its question/answer pairs verbatim from the visible FAQ content, never from
synthesized text (`<VERIFY: which schema nodes the pipeline emits and from which fields>`).

## Required quality checks

- **Title:** present, concise, topic-specific, and shaped as the query a developer would type.
  - **xplat component topics:** `title: "{ComponentTitle}"`; the xplat site layout appends the
    resolved product name to the HTML title. Do not add a framework-specific product suffix or
    duplicate the framework/platform in the component phrase.
  - **Angular topics:** the Angular set has no tokens. Target shape: `"Angular <Component> Component"`,
    aiming for <=60 characters of query-relevant terms. Do not hand-code category or brand suffixes
    (`| Layouts | Infragistics`) in frontmatter unless the layout verifiably appends nothing
    (`<VERIFY: Angular layout title suffix behavior>`); suffixes are the layout's job, and hand-coded
    ones spend title characters on non-query terms or double-brand the rendered title. Pre-committed
    outcomes for that verification: if the layout appends a suffix, hand-coded suffixes are Errors
    and titles strip to `"Angular <Component> Component"`; if it appends nothing, one short uniform
    brand suffix (`| Ignite UI`) is standardized by convention, never improvised per page.
  - Avoid "complete guide", "ultimate guide", "try for free", and other marketing phrases; also avoid
    the blog-standard banned set ("revolutionary", "seamless", "game-changing", "best-in-class"
    without a stated basis).
- **Description:** present, about 140-160 characters when practical, answer-first, and specific
  enough to stand alone in search results and generated schema. Declarative and definition-first
  ("The <Component> is a ... that ..."), not imperative task phrasing ("Use X to ..."), which is a
  soft call to action. Complete sentences only: write to fit; never truncate with an ellipsis. Avoid
  marketing calls to action.
- **`llms.description`:** present and more answer-shaped than the meta description: a single
  self-contained sentence, <=~160 characters, that defines the **component** (or the concept the
  topic covers) and what it does. It must survive verbatim extraction: the subject noun names the
  product and component ("The Ignite UI for Angular Avatar is a component that ..."); no pronouns,
  no capability list-dumps, and never page-referential phrasing ("This topic shows how to ..."): an
  assistant answering "what is the {framework} {component}" quotes a definition of the component,
  not a description of the page. Quotability test before accepting the value: is this the sentence
  an assistant would quote for that query today? Prefer this over keyword stuffing. The
  `llms.description`, the H1 lead sentence, and the site's llms-manifest entry for the page should
  be the same sentence or trivial variants of it: one definition, emitted everywhere the machine
  looks (`<VERIFY: does the docs pipeline emit an llms.txt/llms-small.txt manifest from frontmatter,
  and from which field>`).
- **Entity terminology:** metadata uses the canonical component and product names from the shared
  terminology table (house-style → "Entity terminology"; source: blog-creator product-context v4):
  "[Framework] Data Grid" casing, fixed compounds (Tree Grid, Hierarchical Grid, Pivot Grid),
  product names verbatim ("Ignite UI for Angular", not "IgniteUI"), and no banned synonyms
  ("datagrid" as one word except when quoting an API symbol, "grid component" as subject noun,
  silent drift to "table"/"data table"). Repeated identical entity phrasing across topics is the
  point: assistants consolidate entities from it, and drift fragments the association.
- **Framework/package clarity:** frontmatter must not blur Angular, React, Web Components, and
  Blazor APIs. Angular topics should identify Ignite UI for Angular when needed. xplat topics should
  use `{Platform}` / `{ProductName}` tokens instead of hard-coded single-framework wording.
- **`license`:** present when the topic belongs to a doc set that uses license frontmatter.
- **`mentionedTypes`:** xplat component topics should list the concrete API types linked or
  discussed by the page. Do not invent API type names; if unsure, flag as a verification issue.
  Angular-set usage is currently unscoped (`<VERIFY: does the Angular pipeline consume
  mentionedTypes?>`): until answered, treat Angular occurrences as tolerated, not required, and do
  not recommend adding the field to Angular topics.
- **`relatedComponents`:** recommend only for close sibling components that should affect Do/Don't
  guidance. Do not add generic category neighbors just to fill the field.
- **`keywords`:** treat as legacy/internal metadata, not an SEO optimization surface. Coherence
  test if present: every keyword (or its token-resolved form) appears in the topic body; flag
  aspirational terms that appear nowhere. Do not spend effort keyword-stuffing. If the repo later
  drops `keywords`, remove it only when the user asks or a repo-level policy exists.
- **`_canonicalLink`:** do not invent. Flag inconsistent or suspicious canonical links, but require
  an explicit canonical policy or nearby precedent before suggesting a replacement.
- **`last_updated`:** required for component topics. Use the `YYYY-MM-DD` format and keep the value
  maintained by the topic workflow or another clear source of truth.
- **Cross-field consistency:** `title`, `description`, `llms.description`, and `keywords` must tell
  one story with the same entity names and the same capability list, and must agree with the H1 and
  the lead sentence (which the house style requires to mirror `llms.description`). Cite the H1/lead
  only as evidence; suggest the frontmatter change (or flag the body mismatch for the doc-topics
  skill). A capability named in one surface and absent from another (e.g. metadata says
  "images, initials, icons" while the lead says "an image, initials, or custom content") is a
  finding: Warning by default, Error when the mismatch misidentifies what the component supports.
- **Body support:** every capability, feature, or claim named in `description`, `llms.description`,
  or `keywords` must be supported by the topic body (frontmatter is generated from the finished
  body, never from imagination). Cite the body as evidence only; when a metadata claim has no body
  support, suggest removing or rewording the metadata, or flag the body gap for the doc-topics
  skill: do not choose silently which side is wrong.

## Severity

- **Error:** missing required frontmatter for the doc set, malformed YAML, metadata that clearly
  misidentifies the component/framework, or a title whose non-query terms (brand/category suffixes,
  marketing words) push the query terms past the ~60-character truncation point.
- **Warning:** weak, inconsistent, misleading, too-long, or marketing-heavy metadata; a title whose
  query-relevant portion exceeds ~60 characters.
- **Suggestion:** polish, consistency improvements, optional fields, or policy-dependent changes.

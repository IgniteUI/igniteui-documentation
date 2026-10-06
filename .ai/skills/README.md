# Ignite UI doc-skill set — architecture and maintenance guide

Version: v4 · 2026-08-31 · igniteui doc-skill set. This file is for humans; agents load the
SKILL.md files. Change history: `CHANGELOG.md`.

## What this is

Two agent skills that keep Ignite UI documentation topics uniform, verified, and quotable by AI
assistants:

- **`igniteui-doc-topics`** — author or audit whole topics (component pages, concept overviews,
  category indexes) against the Diátaxis-based house templates.
- **`igniteui-topic-frontmatter`** — audit and normalize YAML frontmatter only (SEO titles, meta
  descriptions, `llms.description`, keywords, canonical links), audit-first, never touching the body.

The `.claude/skills/` copies are **thin adapters** for Claude: they carry the same `name` and
`description` (the triggering surface) and redirect to the canonical `.ai/skills/` files. Other
agents can consume the `.ai` skills directly.

## Design intent (why it is structured this way)

**SKILL.md is a routing hub; references carry the substance.** This follows the same pattern as the
`IgniteUI/igniteui-angular` repo skills (e.g. `skills/igniteui-angular-components`): the SKILL.md
holds only identity, scope, hard boundaries, and a Task → Reference table; every rule that can
change over time lives in `references/`. Three reasons:

1. **Progressive disclosure.** Agents always see the name + description; they load the SKILL.md
   body when the skill triggers, and read only the reference files the task needs. Small router =
   cheap trigger, precise loading.
2. **Future-proofing.** Rules evolve (new checks, answered ‹VERIFY› items, template revisions);
   the router does not. Day-to-day maintenance touches only `references/*.md`, so SKILL.md diffs are
   rare and reviewable, and the adapters in `.claude/` almost never need to change.
3. **Anti-drift.** Rules stated once, in one file, referenced everywhere else. The set learned this
   the hard way (see CHANGELOG v2): the same contract stated in three places will disagree within a
   week.

## File map

```
.ai/skills/
├── README.md            ← this file (humans)
├── CHANGELOG.md         ← every change, mapped to review finding IDs
├── igniteui-doc-topics/
│   ├── SKILL.md                       ← router: modes, compass, composite principle, task table
│   └── references/
│       ├── house-style.md             ← THE normative source: blueprints, frontmatter contract,
│       │                                 naming, entity terminology, verification workflow, voice
│       ├── create-workflow.md         ← authoring steps 1–7 + category/index structure
│       ├── audit-rubric.md            ← audit workflow + checks A–F + report format
│       └── diataxis-cheatsheet.md     ← the four modes + the compass (reasoning layer)
└── igniteui-topic-frontmatter/
    ├── SKILL.md                       ← router: scope, audit-first mode, task table, boundaries
    └── references/
        ├── audit-rules.md             ← field-by-field quality checks + severity ladder
        └── report-format.md           ← report shape + apply procedure

.claude/skills/
├── igniteui-doc-topics/SKILL.md          ← adapter (description byte-matches canonical)
└── igniteui-topic-frontmatter/SKILL.md   ← adapter (description byte-matches canonical)
```

**Where xplat build machinery lives instead.** Two contracts an xplat author needs are not house
style but build behaviour, so their working guides are repository skills and this set only points at
them: `.github/skills/xplat-docs-api-links` (the `apiTerms` modes, `ApiLink` props, `pkg=`
disambiguation) and `.github/skills/xplat-docs-json-snippets` (fence attributes, channels, the
checks). house-style names both, and `docs/xplat/API-TERMS.md` and `docs/xplat/JSON-SNIPPETS.md` are
normative for them. Do not restate their rules here — that is the drift this set was restructured to
stop.

**Authority chain:** where any two files differ, `house-style.md` wins on content rules (it is the
single normative field contract and template source); each skill's own references win on its
operational procedure (severities, report shapes, workflow order). The frontmatter skill reads
across into `igniteui-doc-topics/references/house-style.md` deliberately — one contract, two
consumers.

## How to update the set

1. **Edit the reference file**, not the router. New check → `audit-rules.md` or `audit-rubric.md`;
   template change → `house-style.md`; workflow change → `create-workflow.md`. Touch a SKILL.md only
   when scope, boundaries, or routing genuinely change.
2. **Bump the set version line in every file** (`Version: vN · date · igniteui doc-skill set`) —
   all files move together, even content-unchanged ones. A mismatched version line is the drift
   alarm; treat it as a stop sign.
3. **Keep adapter descriptions byte-identical** to the canonical `description` fields. If you
   change a description, change it in both places in the same commit.
4. **Record the change in `CHANGELOG.md`** with what changed, why, and the finding/decision ID it
   traces to. This set is maintained under review discipline; an untraceable edit is how the last
   contradiction got in.
5. **Resolve ‹VERIFY› placeholders by editing, never by deleting.** Each open item is listed in the
   changelog with an owner. When a verification is answered, apply its pre-committed outcome (they
   are written next to the placeholders) and remove the placeholder in the same edit.

## Provenance

- The entity-terminology table in `house-style.md` is a governed copy of
  `blog-creator product-context v4 · 2026-08-14`. When that table changes upstream, update the copy
  in the same change.
- The rule substance was ratified through the D5 review (2026-08-14, findings D5-22…31) and the D2
  review v1.1 (findings D2-01…12, transfer matrix v1). The CHANGELOG maps every edit to those IDs.

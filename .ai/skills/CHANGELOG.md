# igniteui doc-skill set · changelog

## v3 · 2026-08-14

Restructures both skills to the routing-hub + references architecture used by the
`IgniteUI/igniteui-angular` repo skills (SKILL.md = router with a Task → Reference table; all
evolving rules live in `references/`). **No rule content changed** — v2's rules were moved, not
edited; two stale cross-pointers were fixed in the move. Completes D2-03 stage 2 (physical
deduplication) and adds the set-level README. Whole set bumped to v3 (uniform version line,
including content-unchanged files, per the blog-creator convention).

### Changed

| Change | File(s) |
|---|---|
| igniteui-topic-frontmatter split: SKILL.md becomes a router (scope, audit-first mode, task table, hard boundaries); the field checks + severity ladder move to `references/audit-rules.md`; report shape + apply procedure move to `references/report-format.md`. `description` unchanged (adapter byte-match preserved). | igniteui-topic-frontmatter/* |
| igniteui-doc-topics slimmed: SKILL.md keeps identity, two modes, compass, composite principle, task table, grounding boundaries. Create steps 1–7 (6a–6e) + the category/index structure move to `references/create-workflow.md`; the 5 audit-workflow steps move into `audit-rubric.md`. `description` unchanged. | igniteui-doc-topics/SKILL.md, references/create-workflow.md, references/audit-rubric.md |
| Dedup (D2-03 stage 2): the section→mode map is no longer restated in SKILL.md — it is the "Diátaxis mode" column of house-style's canonical section table; SKILL.md keeps only the one-section-one-mode rule and the concrete mode-bleed examples. The category blueprint now lives in house-style + create-workflow only. Stale pointers fixed (house-style intro pointed at a SKILL.md map that moved; body-support bullet pointed at "Create workflow step 4" which now lives in create-workflow.md). | igniteui-doc-topics/SKILL.md, references/house-style.md |
| Set-level README.md added: human-readable intent, file map, authority chain, and the five-step update procedure (edit references not routers; uniform version bump; adapter byte-match; changelog entry; resolve ‹VERIFY› by pre-committed outcome). | README.md |
| Adapters future-proofed: the enumerated reference-path list is replaced by the standing rule "resolve reference paths relative to the canonical skill directory", so adding/renaming references never requires an adapter edit. Descriptions untouched. | .claude/skills/*/SKILL.md |
| Set-wide version line: every file now carries `Version: v3 · 2026-08-14 · igniteui doc-skill set`, including content-unchanged house-style and diataxis-cheatsheet (the cheatsheet gains its first version line). | all files |

### Unchanged

All v2 rule substance (E1–E9 with D2 amendments, D2-01…11 fixes), all open ‹VERIFY› items and their
owners (see the v2 entry below), and both skill `description` fields.

---

## v2 · 2026-08-14

Applies the D5 frontmatter patch v1 (E1–E9) as ratified by D2 (D2 review v1.1, 2026-08-14, transfer
matrix v1 Option A) with D2's amendments, plus the D2 "do now" wave. Three wait-line items were
pulled forward (D2-08, D2-09, D2-11) because the marginal cost inside a full edit pass was zero,
the same precedent as blog-creator v3. Finding IDs reference the D5 review (D5-22…31, patch edits
E1–E9) and the D2 review v1.1 (D2-01…12).

Files changed: `igniteui-topic-frontmatter/SKILL.md`, `igniteui-doc-topics/SKILL.md`,
`igniteui-doc-topics/references/house-style.md`, `igniteui-doc-topics/references/audit-rubric.md`,
both `.claude/skills/*/SKILL.md` adapters. `diataxis-cheatsheet.md` is unchanged (no findings).

### Applied

| Finding | Change | File(s) |
|---|---|---|
| E1 / D5-24 + D2 amendment | Title rule split per doc set: xplat keeps `{ComponentTitle}`; Angular target `"Angular <Component> Component"` within ~60 query-relevant chars, no hand-coded suffixes pending `‹VERIFY: Angular layout title suffix behavior›`, with pre-committed outcomes for both branches (`\| Ignite UI` standardized if the layout appends nothing). Blog banned-phrase set merged in. | frontmatter SKILL.md |
| E2 / D5-26 | Description bar raised: definition-first ("X is a … that …"), not imperative CTA; complete sentences; no ellipsis truncation. | frontmatter SKILL.md, house-style |
| E3 / D5-23 + D2 amendment | `llms.description` defines the component, not the page: subject noun names product + component, no pronouns, no list-dumps, no page-referential phrasing; quotability test at accept time. One-definition rule added: llms.description ≈ H1 lead ≈ llms-manifest entry (`‹VERIFY: manifest source field›`). | frontmatter SKILL.md, house-style |
| E4 / D5-22 | New required check: cross-field consistency (title / description / llms.description / keywords / H1 / lead sentence tell one story, same entities, same capability list). | frontmatter SKILL.md, house-style |
| E5 / D5-25 | New required check: entity terminology in metadata, bound to the shared terminology table. | frontmatter SKILL.md |
| E6 / D5-27 | New required check: body support for every metadata claim; frontmatter generated from the finished body. | frontmatter SKILL.md, house-style |
| E7 / D5-28 | `keywords` coherence made testable: every keyword (or token-resolved form) appears in the body. | frontmatter SKILL.md |
| E8 / D5-30 | `mentionedTypes` scoped: Angular occurrences tolerated, not required, pending `‹VERIFY: does the Angular pipeline consume mentionedTypes?›`. | frontmatter SKILL.md |
| E9 / D5-31 | Schema linkage named in Scope: frontmatter bars are schema bars; FAQPage (if emitted) sources visible FAQ content verbatim (`‹VERIFY: schema pipeline nodes/fields›`). | frontmatter SKILL.md |
| E-10 (D2 §2) | Title character budget in Severity: non-query terms pushing query terms past ~60-char truncation = Error; query-relevant portion >~60 = Warning. | frontmatter SKILL.md |
| D2-01 | Contradiction fixed: reconciliation table no longer maps "Known Limitations" to Troubleshooting; drifted variants map to the required **Known Limitations** section, with the conditional Troubleshooting placement noted. | house-style |
| D2-02 | Create step 4 rewritten "Write frontmatter first" → "Scaffold frontmatter": convention-fixed fields before the body; description / llms.description / keywords / mentionedTypes / relatedComponents generated from the finished body, then the frontmatter skill's cross-field and body-support checks run. Resolves the companion-skill contradiction with E6 / matrix row 11. | doc-topics SKILL.md |
| D2-03 stage 1 | Single-sourcing declared: house-style "File format & frontmatter" is the normative field contract; both SKILL.mds reference it. Version lines added to all changed files; adapter `description` byte-match rule stated in both adapters and both canonicals. Shared field bars synced so no copy contradicts another. | all changed files |
| D2-04 / matrix row 5 | FAQ answer shape bound: 2–4 self-contained sentences quotable without the question; fan-out question patterns (licensing, version support, migration, accessibility, "is X right for") added as authoring guidance. Rubric A11 extended. | house-style, audit-rubric |
| D2-05 / matrix row 1 | Section leads name the component (and platform token): write-for-both rule 2 and rubric D3 extended. | house-style, audit-rubric |
| D2-06 / matrix row 10 | Quotability test given a check ID: new D13 (H1 lead, section leads, FAQ answers, llms.description). | audit-rubric |
| D2-07 / matrix row 8 | New E7: descriptive, entity-bearing anchor text on prose links; "click here"/bare URLs flagged. | audit-rubric |
| D2-08 / matrix row 7 (pulled forward) | New house-style section "Entity terminology (canonical names)", a governed copy of the blog terminology table with provenance line "source: blog-creator product-context v4 · 2026-08-14". New rubric B6 for body-side entity drift. | house-style, audit-rubric |
| D2-09 (pulled forward) | Table of contents added to house-style (>300-line reference, loaded on every create/audit). | house-style |
| D2-10 | Routing boundary sentences added to both skill descriptions (frontmatter-only work → frontmatter skill; body/structure work → doc-topics skill). Adapters updated to byte-match. | both SKILL.mds, both adapters |
| D2-11 (pulled forward) | Create step 6 split into passes 6a–6e; no rule content changed. | doc-topics SKILL.md |
| Matrix row 4 (pre-commitment) | Rubric B4 carries the pending `‹VERIFY: layout H1/framework adjacency›` with both pre-committed outcomes, so the answer resolves the rule mechanically. | audit-rubric |

### Deliberately not applied

- **D2-03 stage 2** (physical deduplication of the field contract out of the frontmatter skill's
  audit rules): batched with the next structural SKILL.md edit; stage 1's authority declaration and
  synced wording carry the interim.
- **D2-12** (verification-URL single-sourcing against RESOURCE-LIST): requires the RESOURCE-LIST
  canonical-variant decision, which has no owner yet.
- **Canonical-link policy enforcement** (D5-29): the skill still refuses to invent canonicals; the
  enforcement text lands only after the policy's two `‹VERIFY›` items are answered (D2 review §5).
- **Em-dash advisory** (matrix row 18): docs team's call; existing file style kept.
- **Matrix rows 4 / E1 branch resolution**: `‹VERIFY›` placeholders ship in the files, as the
  convention intends; the pre-committed outcomes are written next to them.

### Open verification items (owners)

1. `‹VERIFY: Angular layout title suffix behavior›` — docs team. Resolves E1's branch and the
   Severity rule's application to Angular titles.
2. `‹VERIFY: layout H1/framework adjacency, both doc sets›` — docs team. Resolves B4's direction.
3. `‹VERIFY: schema pipeline — node types, source fields, FAQPage presence›` — docs team.
4. `‹VERIFY: does the Angular pipeline consume mentionedTypes?›` — docs team.
5. `‹VERIFY: llms-manifest source field›` — docs team. Resolves the one-definition rule's third leg.
6. `‹VERIFY: what the layout emits when _canonicalLink is absent›` — docs team; if the answer is
   "nothing", it preempts every queue (D2 review §5.1).
7. Canonical-link policy pattern — D2 (draft exists in D2 review §5), docs team implements.

### Deploy

1. Replace the four `.ai` files and two `.claude` adapters in one commit; `git diff` is the review
   surface.
2. The adapter `description` fields must remain byte-identical to their canonicals — check on every
   future edit (version lines are the interim control until a CI check exists).
3. Next steps per the D2 cut line: D5 step 2 diffs are superseded by this apply; skill-creator eval
   loop (pre-patch snapshots exist in git history) after this wave merges.

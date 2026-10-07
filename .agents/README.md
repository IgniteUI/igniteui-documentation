# Ignite UI documentation — agent skills

Version: v4 · 2026-10-06 · igniteui doc-skill set. This file is for humans; agents load the
SKILL.md files. Change history: `.agents/CHANGELOG.md`.

## Layout

```text
.agents/
├── README.md                ← this file: the index for every skill in the repo
├── CHANGELOG.md             ← every change to the doc-skill set, mapped to review finding IDs
└── skills/                  ← canonical skills (Codex reads this path)
    ├── skill-authoring/
    ├── igniteui-doc-topics/
    └── igniteui-topic-frontmatter/

.github/skills/              ← gh-aw skills: pinned here, see "Why skills live in two places"
├── xplat-docs-api-links/
├── xplat-docs-platform-block/
├── xplat-docs-api-map-sync/
├── docfx-sync/
└── agentic-workflows/

.claude/skills/              ← generated pointers, one per skill; never edited by hand
```

## The skills

| Skill | Canonical location | Use it for |
|---|---|---|
| `skill-authoring` | `.agents/skills/` | Writing or editing a skill: where it belongs, the frontmatter contract, the body budget |
| `igniteui-doc-topics` | `.agents/skills/` | Authoring or auditing whole topics against the Diátaxis-based house templates |
| `igniteui-topic-frontmatter` | `.agents/skills/` | Frontmatter-only audits and normalization, audit-first, never touching the body |
| `xplat-docs-api-links` | `.github/skills/` | Adding, fixing or auditing `<ApiLink>` in xplat MDX |
| `xplat-docs-platform-block` | `.github/skills/` | Adding, fixing or auditing `<PlatformBlock>` in xplat MDX |
| `xplat-docs-api-map-sync` | `.github/skills/` | Syncing the generated API map/registry |
| `docfx-sync` | `.github/skills/` | Merging upstream igniteui-docfx changes and fixing MDX regressions |
| `agentic-workflows` | `.github/skills/` | Designing, creating, debugging or upgrading gh-aw workflows |

`xplat-docs-api-links` is the single authority on ApiLink markup. `docs/xplat/API-LINKS-README.md`
and `docs/xplat/API-REFERENCES.md` are human background on how the component and registry work; they
are not agent instructions and do not override the skill.

## Why skills live in two places

One canonical copy per skill, in the directory the tool that needs it can actually read:

- **`.agents/skills/`** is the repository path OpenAI Codex scans (cwd up to the repo root), and the
  path the Agent Skills ecosystem has converged on. New skills go here by default.
- **`.github/skills/`** is pinned by GitHub Agentic Workflows. The gh-aw compiler bakes
  `GH_AW_SKILL_DIR: ".github/skills"` into every `*.lock.yml`, and the activation artifact uploads
  that path, so the JP sync workflows only see skills there. Moving them breaks those workflows.
- **`.claude/skills/`** exists because Claude Code discovers project skills only from
  `.claude/skills/`. It holds generated pointer files, not rules.

There is no `.codex/` directory. Codex reads `.agents/skills/` directly, so no Codex adapter is
needed.

## Pointer files

`.claude/skills/<name>/SKILL.md` is generated from the canonical SKILL.md by
`scripts/sync-agent-skills.mjs`. A pointer carries the canonical `name` and `description` verbatim —
that pair is the triggering surface, so it must match byte for byte — and a body that redirects to
the canonical file. Pointers hold no rules.

Do not edit a pointer. Edit the canonical SKILL.md and run:

```sh
npm run skills:sync          # regenerate pointers
npm run skills:check         # verify pointers match; runs in CI via `npm run verify`
```

## Guardrails

Two automated checks defend the layout:

- **`npm run skills:check`** (CI, via `.github/workflows/agent-skills.yml`, and part of
  `npm run verify`) fails when a `SKILL.md` sits outside the canonical directories, when a pointer is
  missing, stale or orphaned, and when a canonical
  `SKILL.md` breaks the contract in [`skill-authoring`](skills/skill-authoring/SKILL.md): missing
  frontmatter, `name` not matching its directory or outside the 64-character/kebab-case rules, a
  `description` that is empty, over 1024 characters or missing the `WHEN TO USE:` / `WHEN NOT TO USE:`
  markers, a missing `license`, a body over 500 lines, or one name claimed by two directories.
- **`.github/instructions/agent-skills.instructions.md`** steers GitHub Copilot code review on PRs
  touching these paths. It is a path-specific instructions file (`applyTo` frontmatter), which
  Copilot code review honours alongside any repository-wide `.github/copilot-instructions.md`. It
  tells the reviewer to flag a skill added outside the two canonical directories, a hand-edited
  pointer, a rule restated outside its canonical file, reintroduced `prefixed`/`suffix` guidance,
  and version-line or changelog drift.

That workflow runs on every pull request, with no `paths` filter: the mistake most worth catching is
a skill added in the wrong place, and a filter listing the correct locations would skip the job for
exactly those changes.

The CI check catches mechanical drift; the Copilot instructions catch the editorial drift a script
cannot see.

## Design intent (why the doc-skill set is structured this way)

**SKILL.md is a routing hub; references carry the substance.** The SKILL.md holds only identity,
scope, hard boundaries, and a Task → Reference table; every rule that can change over time lives in
`references/`.

1. **Progressive disclosure.** Agents always see the name + description; they load the SKILL.md body
   when the skill triggers, and read only the reference files the task needs. Small router = cheap
   trigger, precise loading.
2. **Future-proofing.** Rules evolve; the router does not. Day-to-day maintenance touches only
   `references/*.md`, so SKILL.md diffs are rare and reviewable, and the pointers never need to
   change.
3. **Anti-drift.** Rules stated once, in one file, referenced everywhere else. The set learned this
   the hard way (see CHANGELOG v2): the same contract stated in three places will disagree within a
   week.

### File map — doc-skill set

```text
.agents/skills/
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
```

**Authority chain:** where any two files differ, `house-style.md` wins on content rules (it is the
single normative field contract and template source); each skill's own references win on its
operational procedure (severities, report shapes, workflow order). The frontmatter skill reads
across into `igniteui-doc-topics/references/house-style.md` deliberately — one contract, two
consumers.

## The four platforms

All xplat MDX content is built for:

| Name | Prefix | Package family |
|---|---|---|
| `Angular` | `Igx` | `igniteui-angular` |
| `React` | `Igr` | `igniteui-react-*` |
| `WebComponents` | `Igc` | `igniteui-webcomponents-*` |
| `Blazor` | `Igb` | `IgniteUI.Blazor` |

Platform names are case-sensitive. `ApiLink` and `PlatformBlock` are supplied by
`igniteui-astro-components`; platform config lives in `src/lib/platform-context.ts`.

## How to update the set

1. **Edit the reference file**, not the router. New check → `audit-rules.md` or `audit-rubric.md`;
   template change → `house-style.md`; workflow change → `create-workflow.md`. Touch a SKILL.md only
   when scope, boundaries, or routing genuinely change.
2. **Bump the set version line in every doc-skill-set file**
   (`Version: vN · date · igniteui doc-skill set`) — all files move together, even
   content-unchanged ones. A mismatched version line is the drift alarm.
3. **Run `npm run skills:sync`** after changing any `name` or `description`. Never hand-edit a
   pointer.
4. **Record the change in `CHANGELOG.md`** with what changed, why, and the finding/decision ID it
   traces to. An untraceable edit is how the last contradiction got in.
5. **Resolve ‹VERIFY› placeholders by editing, never by deleting.** Each open item is listed in the
   changelog with an owner. When a verification is answered, apply its pre-committed outcome and
   remove the placeholder in the same edit.

When adding a new skill, follow [`skill-authoring`](skills/skill-authoring/SKILL.md): put it in
`.agents/skills/` (or `.github/skills/` if gh-aw must see it), add it to **The skills** table above,
and run `npm run skills:sync`.

## Provenance

- The entity-terminology table in `house-style.md` is a governed copy of
  `blog-creator product-context v4 · 2026-08-14`. When that table changes upstream, update the copy
  in the same change.
- The rule substance was ratified through the D5 review (2026-08-14, findings D5-22…31) and the D2
  review v1.1 (findings D2-01…12, transfer matrix v1). The CHANGELOG maps every edit to those IDs.

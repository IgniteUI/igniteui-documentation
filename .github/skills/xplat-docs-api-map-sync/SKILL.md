---
name: xplat-docs-api-map-sync
description: "Reference guide for synchronizing the xplat docs ApiLink references with the upstream igniteui-xplat-docs apiMap data. Covers running scripts/resolve-api-links.mjs to inject ApiLink tags from `IgxFoo.bar`-style backtick references in MDX, syncing docConfig.json with the sibling igniteui-xplat-docs repo, generating per-platform broken-link reports via scripts/check-api-links.mjs, and applying exclude= props to broken ApiLink tags via scripts/apply-excludes.mjs. Use when bumping API package versions, after merging vNext content, or when ApiLink coverage drifts from upstream."
user-invocable: true
---

# AI Agent Guide — Syncing xplat-docs ApiLink Coverage

## Context

This Astro xplat docs project mirrors the legacy gulp-based `igniteui-xplat-docs` pipeline. The legacy pipeline used **apiMap JSON** files (one per platform) and **docConfig.json** to:

1. Convert backtick-prefixed type/member references (`` `IgxGrid.sort` ``) into resolved API URLs.
2. Resolve the right per-platform package version, prefix, suffix, and base URL.

Here those responsibilities are split across:

| Responsibility | Implementation |
|---|---|
| `apiMap` lookup of valid types / members | Per-platform JSON files in sibling `igniteui-xplat-docs/apiMap/{Angular,React,Blazor,WebComponents}/*.apiMap.json` |
| `docConfig` (package versions, prefixes, base URLs) | `docs/xplat/docConfig.json` |
| Backtick → `<ApiLink/>` conversion | `docs/xplat/scripts/resolve-api-links.mjs` (or workspace-level equivalent) |
| Verifying generated URLs against staging | `scripts/check-api-links.mjs` |
| Auto-applying `exclude=` for broken URLs | `scripts/apply-excludes.mjs` |
| Migrating `<PlatformBlock for="..."><ApiLink/></PlatformBlock>` to `exclude=` | `scripts/migrate-platformblock-to-exclude.mjs` |

---

## Sibling Repository Layout

The `igniteui-xplat-docs` repo lives next to this one (typically `c:/Repos/docs/igniteui-xplat-docs`). Path may vary; locate by folder name `igniteui-xplat-docs`.

```
igniteui-xplat-docs/
  apiMap/
    Angular/*.apiMap.json
    React/*.apiMap.json
    Blazor/*.apiMap.json
    WebComponents/*.apiMap.json
  docConfig.json
  gulpfile.js              ← legacy reference; do not run
```

The `astro-components` repo is also a sibling (typically `c:/Repos/docs/astro-components`) and is symlinked into `node_modules/igniteui-astro-components` via the workspace config in `docs-template/package.json`. The `<ApiLink/>` Astro component lives there at `src/components/mdx/ApiLink/ApiLink.astro`.

---

## Workflow 1 — After Bumping a Platform Version

When a platform's API package version changes (e.g. Angular 21.1 → 21.2) some symbols may be renamed, removed, or relocated. Walk through:

```bash
# 1. Sync docConfig.json with upstream (manual diff)
# Compare docs/xplat/docConfig.json with sibling igniteui-xplat-docs/docConfig.json.
# Apply any version, base-URL, or package-key changes; preserve local-only fields
# (e.g. codeSandboxButtonInject).

# 2. Generate per-platform broken-link reports against staging
node scripts/check-api-links.mjs --platform=angular
node scripts/check-api-links.mjs --platform=react
node scripts/check-api-links.mjs --platform=wc
node scripts/check-api-links.mjs --platform=blazor
# → produces api-link-report-{angular,react,wc,blazor}.md at repo root.

# 3. Auto-apply exclude= to ApiLink tags whose URLs are broken
node scripts/apply-excludes.mjs --dry-run    # preview
node scripts/apply-excludes.mjs              # apply

# 4. Re-run reports — broken count should now be near 0
node scripts/check-api-links.mjs --platform=angular
# (and the other three)
```

## Workflow 2 — After Importing New Content from vNext

```bash
# 1. Convert any leftover backtick-style refs (`IgxGrid.sort`) into <ApiLink/>
node scripts/resolve-api-links.mjs   # or the workspace-level equivalent
# This walks docs/xplat/src/content for .mdx files, looks up each backtick
# reference against the apiMap JSON files, and inserts <ApiLink/> when a
# match is found in any of the four platforms.

# 2. Migrate any <PlatformBlock for="..."><ApiLink/></PlatformBlock> wrappers
#    that exist purely for platform-omission into exclude= props.
node scripts/migrate-platformblock-to-exclude.mjs

# 3. Run Workflow 1 (steps 2-4) to verify and auto-fix broken URLs.
```

---

## Script Reference

### `scripts/check-api-links.mjs`

Walks `docs/xplat/src/content/**/*.mdx`, extracts every `<ApiLink/>` tag, computes the staging URL per platform, and HEAD-checks each URL.

- Honors enclosing `<PlatformBlock for="...">` (stack-based intersection) so a tag wrapped for one platform is checked only on that platform.
- Honors `exclude="..."` on the tag itself — listed platforms are dropped from the check set.
- Output:
  - Console summary (OK / Not found / HTTP / Total broken).
  - `api-link-report-<platform>.md` with details on every broken URL and the MDX files it appears in.

CLI:
```
node scripts/check-api-links.mjs --platform=angular|react|wc|blazor
```

### `scripts/apply-excludes.mjs`

Reads all four `api-link-report-*.md` files, builds a per-file map of broken URLs → platforms, then walks each file's `<ApiLink/>` tags and merges `exclude="..."` for any matching tag. Idempotent.

Matching algorithm:
- Strip platform prefix (`Igr/Igx/Igc/Igb`) from URL type names.
- Generate two key variants per URL — with and without `Component/Module/Directive/Element` suffix — to match Angular tags written either with or without the suffix.
- Lowercase member fragments so Blazor's PascalCased `#Condition` matches a tag's `member="condition"`.
- On tag side, key is `(stripPrefix(type) | lowercased member | kind || 'class')`.

CLI:
```
node scripts/apply-excludes.mjs --dry-run
node scripts/apply-excludes.mjs
```

### `scripts/migrate-platformblock-to-exclude.mjs`

Finds the anti-pattern:

```mdx
<PlatformBlock for="A,B,C">
<ApiLink ... />
</PlatformBlock>
```

When `for=` lists exactly N-1 of the 4 platforms, rewrites to:

```mdx
<ApiLink ... exclude="MissingPlatform" />
```

Skips tags that already have an `exclude=` attribute.

### `scripts/resolve-api-links.mjs` (or workspace equivalent)

Walks MDX content and converts backtick-only API references like `` `IgxGrid.sort` `` into `<ApiLink/>` tags by looking up the type and member in the sibling `igniteui-xplat-docs/apiMap/*.json` files.

---

## docConfig.json Sync Checklist

When syncing `docs/xplat/docConfig.json` with the upstream `igniteui-xplat-docs/docConfig.json`:

- Pull in any new platform version numbers (`apiPackages[platform][packageId].version`).
- Pull in any new packageId entries (e.g. new component packages added upstream).
- Preserve **local-only** fields the Astro project uses but the legacy pipeline does not — e.g. `codeSandboxButtonInject`.
- Leave `prefix`, `classSuffix`, and `apiUrl` alone unless explicitly changed upstream — only Angular has a non-empty `classSuffix` ("Component") for chart/gauge/map/excel/spreadsheet packages.

---

## Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Forgot to re-run `check-api-links` after `apply-excludes` | Same broken count reported | Re-run check after apply; report is regenerated. |
| Member casing mismatch (Blazor PascalCase vs MDX lowercase) | Blazor 0 tags updated even though report shows breaks | `apply-excludes.mjs` already handles this via lowercase key. If you customize, preserve the lowercase logic. |
| Angular `Component` suffix only on certain packages | Some Angular URLs still broken after apply | Verify `apply-excludes.mjs` `baseVariants()` adds both with-suffix and without-suffix variants. |
| `replace_string_in_file` silently failing on `apply-excludes.mjs` | Edits report success but file unchanged | Use a Node-based file patcher: `readFileSync` + `.replace()` + `writeFileSync`. Always grep to verify. |

---

## Related Skills

- [`xplat-docs-api-links`](../xplat-docs-api-links/SKILL.md) — ApiLink prop reference
- [`xplat-docs-platform-block`](../xplat-docs-platform-block/SKILL.md) — PlatformBlock and ApiLink `exclude=` semantics

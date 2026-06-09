# Skill: docfx-sync

**Domain**: Merging upstream igniteui-docfx content into docs-template and fixing the MDX regressions it introduces.

Read this skill in full before performing any sync-related task.

---

## What this skill covers

- How to identify and merge a docfx vnext sync PR
- How to run the quality-check script and interpret its output
- Conversion rules for each regression pattern
- `<ApiLink>` syntax for angular-specific docs
- Build verification

---

## Context

`docs/angular/src/content/` originates from [igniteui-docfx](https://github.com/IgniteUI/igniteui-docfx) (`vnext` branch). Periodic sync PRs bring in bulk content as raw docfx Markdown. The sync is purely additive — it does NOT convert docfx patterns to MDX. That conversion is your job.

**Root cause of regressions**: When conflict resolution uses "keep theirs" (upstream) for a file, any MDX-specific fixes that existed in `master` (like `<ApiLink>` components, extensionless links) are silently dropped.

---

## Step 1 — Identify what changed

```bash
# List all modified angular content files vs master
git diff master --name-only -- "docs/angular/src/content/"

# Show specific regression patterns in changed files
node scripts/check-mdx-quality.mjs
```

The script exits with code 1 if issues are found and prints a grouped report. Always run it first before doing any manual investigation.

---

## Step 2 — Fix `.md` link extensions (bulk)

```bash
node scripts/check-mdx-quality.mjs --fix
```

This auto-strips `.md` from all relative links in changed files. Safe to run repeatedly.

---

## Step 3 — Fix raw `{environment:angularApiUrl}` links

These look like:
```md
[IgxGridComponent]({environment:angularApiUrl}/classes/igxgridcomponent.html)
[width]({environment:angularApiUrl}/classes/igxcolumncomponent.html#width)
```

**Algorithm for each occurrence:**

1. Check if master had an `<ApiLink>` for this exact line:
   ```bash
   git show master:docs/angular/src/content/en/components/FILENAME.mdx | grep -n "keyword"
   ```
2. If yes → restore that line exactly from master.
3. If no (new upstream content) → convert using the rules below.

**Conversion rules:**

| URL pattern | `<ApiLink>` form |
|---|---|
| `.../classes/igx{foo}component.html` | `<ApiLink type="Foo" />` |
| `.../classes/igx{foo}component.html#{member}` | `<ApiLink type="Foo" member="member" />` |
| `.../classes/igx{foo}directive.html` | `<ApiLink type="FooDirective" />` |
| `.../interfaces/i{foo}.html` | `<ApiLink kind="interface" type="IFoo" />` |
| `.../enums/igx{foo}.html` | `<ApiLink kind="enum" type="Foo" />` |
| `.../enums/{foo}.html` (no igx) | `<ApiLink kind="enum" type="Foo" />` |
| `.../functions/{foo}.html` | `<ApiLink kind="function" type="foo" />` |

**Prop reference:**

| Prop | Default | When to override |
|---|---|---|
| `type` | required | Short name, no `Igx` prefix — `"Grid"` not `"IgxGrid"` |
| `kind` | `"class"` | Set `"interface"`, `"enum"`, `"type"`, `"function"`, `"variable"` as appropriate |
| `member` | none | Property or method name from the URL anchor |
| `label` | derived | Only when display text differs from the type name (e.g. `label="igx-grid"` for selector display) |
| `pkg` | `"core"` | Angular docs **rarely** need this — use `pkg="charts"` for chart types, etc. |

The generated ApiLink registry resolves prefix/suffix differences. Do not add
`prefixed={false}` or `suffix={false}` for new links.

---

## Step 4 — Verify no other component regressions

Check for lost `<Sample>`, `<DocsAside>`, or `<code-view>` (should not appear — means the Sample migration was not done):

```bash
# Still in output of check-mdx-quality.mjs
# Look for "Lost <ApiLink>" and "Lost <Sample>" sections
```

For each file where the ApiLink count dropped vs master:
```bash
git show master:PATH/FILE.mdx | grep "ApiLink" | head -30
grep "ApiLink" PATH/FILE.mdx | head -30
# Compare line by line — find which ones disappeared
```

---

## Step 5 — Build verification

```bash
npm run angular:build-staging:en   # EN build — expect ~411 pages
npm run angular:build-staging:jp   # JP build — expect ~410 pages
```

A page count drop indicates a broken import or broken MDX syntax. Check the build output for the specific error file.

---

## JP files

JP content is at `docs/angular/src/content/jp/`. Apply the same fixes as EN. The `<ApiLink>` components are identical between EN and JP — use the EN fix as the template. Only the surrounding prose is Japanese.

---

## Common mistakes to avoid

1. **Do not add `pkg=` to angular-specific files** unless the type is from a sub-package (charts, gauges, maps, etc.). Angular docs default to `pkg="core"` which resolves to `igniteui-angular`.

2. **Do not add legacy prefix/suffix override props**. The registry should resolve the actual API symbol name.

3. **Do not use `.md` extensions** in links — the remark plugin does not handle them and produces dead links at build time.

4. **Do not use `{environment:angularApiUrl}` raw links** — they are docfx-only tokens that produce `undefined` in the Astro build.

5. **Check JP when you fix EN** — the JP file for the same component almost always has the same regression since it was translated from the same upstream source.

---

## Quick reference — check script

```bash
# Default: check all modified .mdx files vs master
node scripts/check-mdx-quality.mjs

# Compare against a different base branch
node scripts/check-mdx-quality.mjs --base=main

# Check a specific directory
node scripts/check-mdx-quality.mjs --dir=docs/angular/src/content/jp

# Auto-fix .md link extensions
node scripts/check-mdx-quality.mjs --fix

# Scan all .mdx files (not just changed ones)
node scripts/check-mdx-quality.mjs --all
```

---

## Related skills

- [`xplat-docs-api-links`](../xplat-docs-api-links/SKILL.md) — full ApiLink syntax reference (for xplat files; the `kind`, `suffix`, `prefixed` rules also apply to angular)
- [`xplat-docs-platform-block`](../xplat-docs-platform-block/SKILL.md) — PlatformBlock usage in xplat files

---

## Full process reference

See [DOCFX-SYNC.md](../../../DOCFX-SYNC.md) at the repo root for the complete human-readable migration guide.

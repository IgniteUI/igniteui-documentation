# Syncing from igniteui-docfx (vnext)

This guide explains how to merge upstream docfx content into this repository and fix the regressions that the automated sync introduces.

## Background

The `docs/angular/src/content/` directory originates from [igniteui-docfx](https://github.com/IgniteUI/igniteui-docfx) (the `vnext` branch). Periodically, a PR is opened on this repo that brings in bulk content changes via a squash-merge of the upstream. The content arrives as raw docfx Markdown (`.md`) and must be treated as MDX (`/en` = English, `/jp` = Japanese).

Common regressions introduced by the upstream sync:

| Pattern in upstream | Correct form in this repo |
|---|---|
| `[label]({environment:angularApiUrl}/.../.../classes/...)` | `<ApiLink type="ClassName" />` |
| `[label]({environment:angularApiUrl}/.../.../members/...)` | `<ApiLink type="ClassName" member="memberName" />` |
| `[link text](other-page.md)` | `[link text](other-page)` — no `.md` extension |
| `<code-view src="...">` | `<Sample src="..." height={N} />` |
| `>[!NOTE]` / `>[!TIP]` callouts | `<DocsAside type="note">` / `<DocsAside type="tip">` |
| Unclosed `<br>` | `<br />` |
| HTML comments `<!-- ... -->` outside code blocks | Remove or replace with MDX-style `{/* ... */}` |
| `<!-- schema: -->` | Remove entirely |
| `suffix={false}` / `prefixed={false}` dropped from an ApiLink | Leave them off — the registry resolves prefix and suffix. See "Checking against the skill rules" below |
| Missing or overwritten `llms.description` | Add or preserve a specific summary for the generated `llms.txt` index |

---

## Step-by-step process

### 1. Identify the sync commit

When a PR arrives from the automated sync, note the **upstream tip commit** (the last commit in igniteui-docfx that was merged) and the **ancestor** (the previous sync base). These are typically visible in the PR description or the merge commit message.

For scripting convenience, export them:

```bash
export ANCESTOR=<previous-sync-tip-commit>  # e.g. c9c1248582
export LAST_SYNC=<new-upstream-tip-commit>  # e.g. 9347b2861b
```

### 2. Create a branch and merge

```bash
git checkout master
git pull
git checkout -b your-name/add-latest-docfx-changes
git merge origin/vnext   # or however the upstream is tracked
```

If there are **conflict files** (files that changed both upstream and in master), the safest default for bulk-content files is:

```bash
# Accept upstream content for conflicted files
git checkout --theirs -- docs/angular/src/content/en/components/some-file.mdx
git add docs/angular/src/content/en/components/some-file.mdx
```

> **Warning**: "keep theirs" loses any MDX-specific fixes that were in master. Always run the quality check immediately after (step 3) to find what was lost.

### 3. Run the quality check

```bash
node scripts/check-mdx-quality.mjs
```

This compares every changed `.mdx` file against `master` and reports:

- Raw `{environment:angularApiUrl}` links that must become `<ApiLink>`
- `.md` link extensions that must be stripped
- Lost `<ApiLink>` components (files where the count dropped vs master)
- Lost `<Sample>` components
- Other docfx artifacts (`<code-view>`, `>[!NOTE]`, `<!-- schema: -->`, unclosed `<br>`)

Auto-fix `.md` extensions:

```bash
node scripts/check-mdx-quality.mjs --fix
```

Check a specific directory (e.g. JP):

```bash
node scripts/check-mdx-quality.mjs --dir=docs/angular/src/content/jp
```

Check all files (not just changed ones):

```bash
node scripts/check-mdx-quality.mjs --all
```

Validate English and Japanese LLM metadata after importing or resolving files:

```bash
npm run check:llms-metadata
```

This check does not modify content. Fix each reported source frontmatter block manually and preserve existing `llms.description` values when resolving sync conflicts.

### 4. Fix raw angularApiUrl links

For each file reported with raw `{environment:angularApiUrl}` links:

1. Find what the line looked like on `master`:
   ```bash
   git show master:docs/angular/src/content/en/components/FILENAME.mdx | grep -n "keyword"
   ```
2. If master had an `<ApiLink>` for this line, restore it exactly.
3. If master didn't have this line (it's new upstream content), convert manually:
   - `[IgxFooComponent](url)` → `<ApiLink type="Foo" />`
   - `[IgxFooComponent.bar](url)` → `<ApiLink type="Foo" member="bar" />`
   - `[IFooEventArgs](url)` → `<ApiLink kind="interface" type="IFooEventArgs" />`
   - `[FooEnum](url)` → `<ApiLink kind="enum" type="FooEnum" />`
   - See [ApiLink rules](#apilink-rules) below.

### 5. Verify the build passes

```bash
npm run angular:build-staging:en   # should complete with no errors
npm run angular:build-staging:jp   # same for Japanese
```

Page counts should match master (or be higher if new pages were added). A large drop indicates missing imports or broken MDX.

### 6. Commit and push

```bash
git add -A
git commit -m "fix(sync): restore MDX components lost in docfx vnext merge"
git push origin your-name/add-latest-docfx-changes
```

---

## ApiLink rules

The `docfx-sync` skill owns these: see
[`.github/skills/docfx-sync/SKILL.md`](.github/skills/docfx-sync/SKILL.md) for the URL → `<ApiLink>`
conversion table and the prop reference (`type`, `kind`, `member`, `label`, `pkg`), including the
Angular default where `pkg` is rarely needed.

They are not repeated here. This guide covers the sync process; the skill covers the markup.

---

## JP files

Japanese content mirrors English structure under `docs/angular/src/content/jp/`. Apply the same fixes. The text is Japanese but the `<ApiLink>` components are identical to EN — use the EN file as the reference for what components should exist.

Japanese `llms.description` values must be written in Japanese. They should summarize the actual page content rather than translate English marketing boilerplate.

---

## Checking against the skill rules

After fixing, verify the new `<ApiLink>` additions against the skills that own the markup rules:

- [`.github/skills/docfx-sync/SKILL.md`](.github/skills/docfx-sync/SKILL.md) — conversion table and prop reference for Angular content
- [`.github/skills/xplat-docs-api-links/SKILL.md`](.github/skills/xplat-docs-api-links/SKILL.md) — the single authority on ApiLink markup
- Run `npm run check-mdx-links` and resolve anything it reports as broken or ambiguous

One thing specific to syncing: a sync often drops `prefixed={false}` / `suffix={false}` from links that had them. That is the correct outcome — the registry resolves prefix and suffix — so leave them off rather than restoring from `master`.

---

## Files created this session

| File | Purpose |
|---|---|
| `scripts/check-mdx-quality.mjs` | Post-sync validation — detects raw API links, .md extensions, lost `<ApiLink>`/`<Sample>`, callouts, schema comments, unclosed `<br>`, markdown images |
| `scripts/merge-vnext-updates.mjs` | 3-way body-only merge of docfx vnext updates into local .mdx files; update `LAST_SYNC` after each sync |
| `scripts/reimport-body.mjs` | Re-merge upstream body for files where initial "keep ours" resolution discarded substantive text; applies MDX transforms to resolved content |
| `scripts/convert-callouts.mjs` | Convert `>[!NOTE/TIP/...]` callouts to `<DocsAside>` and remove `<!-- schema: -->` comments in-place |
| `scripts/convert-img-tags.mjs` | Convert `<img class="responsive-img">` tags to `<Image>` components from `astro:assets` |
| `scripts/migrate-vnext-new-files.mjs` | Apply full DocFX → MDX migration to newly-imported pages (frontmatter cleanup, callouts, code-view, images) |
| `DOCFX-SYNC.md` | This guide |
| `.github/skills/docfx-sync/SKILL.md` | AI agent skill for performing syncs |

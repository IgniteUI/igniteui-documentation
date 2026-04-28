---
name: docfx-to-mdx-migration
description: "Reference guide for migrating DocFX-style documentation (`.md` files with `NN_` prefixed folders, `%%Token%%` placeholders, `.html` cross-references, HTML tables, DocFX `<!-- |metadata| ... |metadata| -->` blocks) into Astro/Starlight-compatible MDX in this repo. Covers the 11-step pipeline (`scripts/migrate-jquery-pipeline.mjs`), individual scripts, dynamic environment.json token resolution at runtime (remark-docfx for MDX, sidebar.ts for toc.json), BOM handling for Japanese sources, git rename-detection workflow, and how to migrate a new library or new language. Use when an agent is asked to migrate a new docs source, run/extend the migration pipeline, debug pipeline output, or add a new fixer step."
user-invocable: true
---

# AI Agent Guide — Migrating DocFX Docs to Astro/Starlight MDX

## Context

This repo serves multiple Starlight sites built from MDX content. Source content originally exported from DocFX needs systematic transformation to compile under Astro v6 + `@astrojs/mdx` + Starlight.

DocFX inputs that **cannot** be served as-is:

| DocFX feature | MDX requirement |
|---|---|
| `NN_Topic-Name.md` (numeric prefix for ordering) | Slugified file/folder names (no leading digits) |
| `%%Token%%` placeholders | `{environment:Token}` (resolved by `remark-docfx`) |
| `<!-- \|metadata\| {...} \|metadata\| -->` blocks | YAML frontmatter with `title:` and `slug:` |
| `.html` cross-references | Slug-based routes (no extension) |
| HTML `<table>` (no colspan/rowspan) | Markdown pipe tables |
| Pseudo-HTML tags like `<color>`, `<value>`, `<MyClass>` | Escaped to `&lt;color&gt;` etc. |
| Bare `{` and `}` in prose | `&#123;` / `&#125;` (MDX parses `{` as JSX) |
| BOM at file start (Japanese sources) | Stripped on read, optionally re-added on write |

Authoritative pipeline doc: [scripts/MIGRATION.md](scripts/MIGRATION.md). This skill is the **how-to-think-about-migration** companion.

---

## When to Use This Skill

| Situation | Use this skill? |
|---|---|
| Migrating a new DocFX source folder into `docs/{lib}/src/content/...` | **Yes** |
| Adding a new language (e.g. `kr`) to an already-migrated library | **Yes** |
| Debugging "Files changed: 0" output from a fixer script | **Yes** |
| Adding a new fixer step to the pipeline | **Yes** |
| Fixing a single MDX parse error in 1 file | No — edit the file directly |
| Updating sidebar order for already-migrated content | No — edit `toc.json` directly |
| Resolving `<ApiLink>` / `<ApiRef>` props | No — see the `api-link` skill |

---

## Step 1 — Set Up Source Layout BEFORE Running the Pipeline

Pipeline expects this layout:

```
docs/{lib}/src/content/{lang}/topics/   ← MDX content goes here (initially .md)
docs/{lib}/src/content/{lang}/environment.json   ← token values
docs/{lib}/src/content/{lang}/images/   ← images (optional, fixer locates them)
docs/{lib}/toc.json   (en) OR docs/{lib}/src/content/toc.json   (non-en)
```

For non-English languages, the legacy DocFX folder may use a different code than `DOCS_LANG`:

| `DOCS_LANG` env | Folder name on disk |
|---|---|
| `en` | `en/` |
| `jp` | `ja/` (ISO 639-1, matches DocFX export) |
| `kr` | `kr/` |

The astro-child config translates `DOCS_LANG=jp` → `ja/` folder. See the `astro-child-config` skill.

### Git rename detection (critical for non-English imports)

If you are importing renamed `.md` → `.mdx` files into git, do it as a **2-commit sequence**:

1. **Pure rename commit**: only path changes, no content edits. Stage as renames so git history is preserved:
   ```bash
   git config diff.renameLimit 3000   # default 400 is too low for >1000 files
   git mv <old> <new>                 # OR git add -A after mv (git auto-detects 100% similarity)
   git commit -m "Rename: <source> → <dest> (.md → .mdx)"
   ```
2. **Pipeline commit**: run the migration pipeline, then commit the content changes on top. This way `git log --follow` works correctly.

---

## Step 2 — Run the Pipeline

The orchestrator runs all 12 steps in order:

```bash
# Dry-run first
node scripts/migrate-jquery-pipeline.mjs --topics=docs/{lib}/src/content/{lang}/topics --toc=docs/{lib}/{toc-path}

# Apply
node scripts/migrate-jquery-pipeline.mjs --apply --topics=... --toc=...
```

**Always restore the working tree to the post-rename state before re-running**, because the pipeline is **not idempotent** for all steps. If you need to re-run, restore with:

```bash
rm -rf docs/{lib}/src/content/{lang}/topics
git checkout HEAD -- docs/{lib}/src/content/{lang}/topics
```

### Pipeline order and rationale

| Step | Script | Why this order |
|---|---|---|
| 1 | `gen-jquery-toc` | Reads `NN_` prefixes for ordering — **must run before rename** |
| 2 | `convert-docfx-tokens` | `%%Token%%` → `&#123;environment:Token&#125;` in content; `%%Token%%` → `{environment:Token}` in `toc.json` (kept dynamic) |
| 3 | `convert-html-tables` | HTML tables → markdown pipe tables (skips colspan/rowspan; those are handled at build time) |
| 4 | `fix-html-links` | `.html` → `.mdx` using `"fileName"` from metadata blocks. **Must run before rename** (uses original filenames) |
| 5 | `rename-jquery-topics` | Strip `NN_`, slugify, update `toc.json` and inline links |
| 6 | `fix-pseudo-html` | Escape `<color>`, curly braces. Always writes (no `--apply` flag) |
| 7 | `fix-all-mdx` | 11 fixers + per-file `compile()` validation |
| 8 | `fix-broken-images` | Locate moved/renamed images; rewrites paths |
| 9 | `fix-internal-links` | Resolve old-style flat names → slugified absolute paths; **remaps file-path slugs to frontmatter slugs** |
| 10 | `add-slugs-to-toc` | Read `slug:` from each MDX, inject into `toc.json` so sidebar resolves without per-file reads |
| 11 | `validate-mdx` | Compile every file with `@mdx-js/mdx`; report grouped errors |

---

## Step 3 — Common Pitfalls

### 3a. BOM (UTF-8 byte order mark) breaks frontmatter regexes

Japanese DocFX exports often have BOM (`\uFEFF`) at byte 0. A regex like `/^---/` will not match because the file starts with `\uFEFF---`.

**Fix in any new script that reads MDX files**:

```js
const raw = fs.readFileSync(file, 'utf-8');
const bom = raw.charCodeAt(0) === 0xFEFF ? '\uFEFF' : '';
const text = bom ? raw.slice(1) : raw;
// ... process `text` ...
fs.writeFileSync(file, bom + result, 'utf-8');
```

Files in this repo that already do this: [scripts/fix-pseudo-html.mjs](scripts/fix-pseudo-html.mjs), [scripts/fix-all-mdx.mjs](scripts/fix-all-mdx.mjs), [scripts/add-slugs-to-toc.mjs](scripts/add-slugs-to-toc.mjs), [src/sidebar.ts](src/sidebar.ts), [src/llms.ts](src/llms.ts).

### 3b. "Files changed: 0" but the change should have applied

Common cause: the script compares `content !== content_at_some_intermediate_step` instead of `content !== src` (original disk content). If a transform produces output identical to an intermediate snapshot, the file is **not** written even though it differs from disk.

Always compare write-decision against the **original disk content** captured before any in-memory mutation. See [scripts/fix-all-mdx.mjs](scripts/fix-all-mdx.mjs) for the post-fix history of this exact bug.

### 3c. Frontmatter `slug:` vs file-path slug

Starlight routes by the **frontmatter `slug:` value**, not by file path. A file at `general-and-getting-started/deployment-guide.mdx` with `slug: deployment-guide` is served at `/deployment-guide`, not `/general-and-getting-started/deployment-guide`.

`fix-internal-links` builds a `filePathSlug → frontmatterSlug` map and remaps every resolved link. Any new link-fixer must do the same, or links will 404 in the rendered site.

### 3d. `{environment:Foo}` tokens — **always keep dynamic**

Environment tokens (e.g. `{environment:demosBaseUrl}`, `{environment:sassApiUrl}`) are resolved at **build time per environment** — each of dev / staging / production gets its own value from `environment.json`. Do **not** statically rewrite them to literal strings; doing so hard-codes one environment's URL and breaks the others.

Three resolution sites exist, all backed by the shared helper [src/env-tokens.ts](src/env-tokens.ts):

1. **MDX body**: [src/plugins/remark-docfx.ts](src/plugins/remark-docfx.ts) — visits `text`, `link`, `image`, `code`, `html` and `mdxJsxFlowElement`/`mdxJsxTextElement` (string-literal attribute values) nodes.
2. **`toc.json`**: [src/sidebar.ts](src/sidebar.ts) — resolves on the raw TOC text before parsing, so `name`, `href`, `slug`, badge text all get values from the active `DOCS_ENV`.
3. **Frontmatter**: [src/content-helper.ts](src/content-helper.ts) — resolves `title`, `description`, `keywords` in the schema preprocessor (used for the SEO `<title>` and breadcrumbs; the visible page H1 comes from the body `# Heading`, see below).

**Page H1 convention — body heading is canonical:**

This repo overrides Starlight's `PageTitle` component ([src/components/overrides/PageTitle.astro](src/components/overrides/PageTitle.astro)) to suppress the auto-generated `<h1>` from the frontmatter `title`. The visible H1 is the **body `# Heading`** in every MDX file (the convention across all child sites — angular, xplat, jquery). Migration scripts must therefore *preserve* the body H1, not strip it. Frontmatter `title` is still used by Starlight for the `<title>` tag, breadcrumb, and sidebar fallback label.

**Form rules — body vs frontmatter vs toc.json:**

| Location | Required form | Why |
|---|---|---|
| MDX body prose | `\{environment:Foo\}` (backslash-escaped) | MDX parses bare `{` as JSX expression; `\{` tells MDX to emit a literal `{` in the text node, which the runtime resolver then matches |
| MDX JSX attribute string-literal values (e.g. `data-src="…"`) | `{environment:Foo}` (raw braces) | Inside a quoted JSX attribute value `{` is a literal char — no escaping needed |
| YAML frontmatter (`title:`, `description:`, …) | `{environment:Foo}` (raw braces) | YAML treats `{` as a literal char; frontmatter is resolved by `src/content-helper.ts` (used by Starlight for the H1 and breadcrumbs) |
| `toc.json` | `{environment:Foo}` (raw braces) | JSON parses `{` only at the start of objects, never inside string values |

The runtime regex in [src/env-tokens.ts](src/env-tokens.ts) (`ENV_TOKEN_RE`) matches all three forms (`{…}`, `\{…\}`, and `&#123;…&#125;`) for backward compatibility with legacy content. New content should use the form for its location per the table above.

`scripts/convert-docfx-tokens.mjs` enforces this split: frontmatter gets raw braces, body gets `\{…\}`. Any new fixer that touches MDX must preserve this split — `fix-pseudo-html.mjs`, `fix-all-mdx.mjs` and `fix-internal-links.mjs` all skip both `\{environment:…\}` and the legacy `&#123;environment:…&#125;` forms.

Both layers look up `environment.json` in this order:
```
{docsDir}/en/environment.json
{docsDir}/environment.json
{docsDir}/../environment.json
{docsDir}/../en/environment.json
```
Token values come from `data[DOCS_ENV]` (with fallback to `data.production`).

If you ever feel tempted to write a script that resolves tokens to literals: don't. Add a runtime resolver (using `loadEnvValues()` + `resolveEnvTokens()` from `src/env-tokens.ts`) wherever the token is being rendered as a literal instead.

### 3e. Rename-detection on subsequent commits

Once renames are in commit 1, commit 2 (the pipeline output) will be partially detected as renames if `diff.renameLimit` is large enough AND if no files changed by >50% similarity. Some heavily-rewritten files will show as `delete`+`add`. That is acceptable — `git log --follow` still uses the rename info from commit 1.

---

## Step 4 — Migrating a New Library

```bash
# Place source files under docs/{newlib}/src/content/en/topics
# Place environment.json under docs/{newlib}/src/content/en/environment.json
# Set up astro child config (see the `astro-child-config` skill)

TOPICS=docs/{newlib}/src/content/en/topics
TOC=docs/{newlib}/toc.json

node scripts/migrate-jquery-pipeline.mjs --apply --topics=$TOPICS --toc=$TOC
```

If the new library uses a different folder layout (no `NN_` prefixes, no `%%Token%%`, etc.), specific steps become no-ops automatically — but **gen-jquery-toc** will still need adapting if your toc generation rules differ.

---

## Step 5 — Migrating a New Language to an Existing Library

```bash
# 1. Drop translated source under docs/{lib}/src/content/{ja,kr,...}/topics
# 2. Add environment.json under same parent folder
# 3. Confirm the astro child config supports the lang (see `astro-child-config` skill)

TOPICS=docs/{lib}/src/content/{lang}/topics
TOC=docs/{lib}/src/content/toc.json   # non-en uses src/content/toc.json by convention

node scripts/migrate-jquery-pipeline.mjs --apply --topics=$TOPICS --toc=$TOC
```

Because Japanese sources may have BOM, watch for it in any custom fixer you add (see 3a).

---

## Step 6 — Adding a New Fixer Step

1. Create `scripts/{your-fixer}.mjs`. Follow the pattern of [scripts/fix-internal-links.mjs](scripts/fix-internal-links.mjs):
   - Accept `--apply` (dry-run by default), `--topics=`, `--toc=` flags
   - Walk MDX files via `fs.readdirSync(..., { withFileTypes: true })`
   - Strip BOM on read; re-add on write
   - Print `Results:` summary at end
2. Add to [scripts/migrate-jquery-pipeline.mjs](scripts/migrate-jquery-pipeline.mjs) at the appropriate position (note that pre-rename steps must use original filenames; post-rename steps must use slugs).
3. Document the step in [scripts/MIGRATION.md](scripts/MIGRATION.md).

> **Do not add a runtime MDX rewriter that mutates source files at build time.** The repo previously had a `normalizeMdxDir()` call in `astro.config.ts` (and a `src/normalize-mdx.ts` module) that ran on every dev-server start and re-applied a `{` → `&#123;` escape, repeatedly corrupting frontmatter and body env tokens. All MDX transformation belongs in the migration pipeline (one-time, idempotent) or in remark/rehype plugins (in-memory at compile time, never written to disk).

---

## Quick Reference: Script Command Map

| Goal | Script |
|---|---|
| Generate `toc.json` from file tree | `gen-jquery-toc.mjs` |
| Convert `%%Token%%` → `{environment:Token}` (MDX + toc) | `convert-docfx-tokens.mjs` |
| Convert HTML tables to pipe tables | `convert-html-tables.mjs` |
| Fix `.html` cross-references | `fix-html-links.mjs` |
| Strip `NN_` prefixes, slugify | `rename-jquery-topics.mjs` |
| Escape pseudo-HTML / curly braces | `fix-pseudo-html.mjs` |
| Fix orphaned tags, anchors, etc. + validate | `fix-all-mdx.mjs` |
| Fix broken image paths | `fix-broken-images-all.mjs` |
| Resolve old-style links → frontmatter slugs | `fix-internal-links.mjs` |
| Inject slugs into `toc.json` | `add-slugs-to-toc.mjs` |
| Compile-validate every MDX | `validate-mdx.mjs` |

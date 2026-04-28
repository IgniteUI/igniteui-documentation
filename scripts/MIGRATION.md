# DocFX → Astro/Starlight Migration Scripts

Migration pipeline for converting DocFX-style documentation (`.md` with `NN_` prefixed folders, `%%Token%%` markers, `.html` cross-references) into Astro/Starlight-compatible MDX.

## Quick Start

```bash
# Dry-run (preview changes, nothing written)
node scripts/migrate-jquery-pipeline.mjs

# Apply all steps
node scripts/migrate-jquery-pipeline.mjs --apply

# Use with a different library
node scripts/migrate-jquery-pipeline.mjs --apply --topics=docs/other/src/content/en/topics --toc=docs/other/toc.json
```

## Prerequisites

- Node.js v18+
- Install dependencies: `npm install` (needs `github-slugger`, `@mdx-js/mdx`)
- Source files placed in `docs/{lib}/src/content/en/topics/` with original DocFX folder structure
- `docs/{lib}/src/content/en/environment.json` with token values (see [Environment Tokens](#environment-tokens))

## Pipeline Steps

Run in this order. The pipeline script (`migrate-jquery-pipeline.mjs`) orchestrates all 11 steps automatically.

### Step 1: Generate TOC
```bash
node scripts/gen-jquery-toc.mjs [--topics=<path>] [--toc=<path>]
```
Generates `toc.json` from the file tree. **Must run before rename** — uses `NN_` numeric prefixes for ordering and reads H1 headings for titles.

### Step 2: Convert DocFX Tokens
```bash
node scripts/convert-docfx-tokens.mjs [--apply] [--topics=<path>]
```
Converts `%%Token%%` → `&#123;environment:Token&#125;` in MDX content (entity-encoded so MDX doesn't parse `{` as JSX). Resolves tokens to literal values in `toc.json` names using `environment.json`.

### Step 3: Convert HTML Tables
```bash
node scripts/convert-html-tables.mjs <topics-dir> [--apply]
```
Converts simple HTML `<table>` blocks to Markdown pipe tables. Skips tables with `colspan`/`rowspan` (those are handled at build time by `normalize-mdx.ts`).

### Step 4: Fix .html Links
```bash
node scripts/fix-html-links.mjs [--apply] [--topics=<path>]
```
Converts `.html` cross-references to `.mdx` relative paths. Uses `"fileName"` from DocFX metadata blocks to build a lookup map. **Must run before Step 5 (rename)**.

### Step 5: Rename Topics
```bash
node scripts/rename-jquery-topics.mjs [--apply] [--topics=<path>] [--toc=<path>]
```
Strips `NN_` numeric prefixes from files/folders, slugifies names, updates `toc.json` and inline links. Core renaming step.

### Step 6: Fix Pseudo-HTML
```bash
node scripts/fix-pseudo-html.mjs <topics-dir>
```
Escapes pseudo-HTML tokens (`<color>`, `<ClassName>`) and curly braces for MDX compatibility. Always writes (no `--apply` flag needed).

### Step 7: Fix All MDX Issues
```bash
node scripts/fix-all-mdx.mjs [--apply] [--topics=<path>]
```
Comprehensive MDX fixer (11 fix functions): removes orphaned HTML table fragments, strips inline `<a name="">` anchors, escapes pseudo-HTML in prose, fixes `<li>` in table cells, closes unclosed tables, escapes braces outside code fences, and more. Validates each file with `@mdx-js/mdx` after fixing.

### Step 8: Fix Broken Images
```bash
node scripts/fix-broken-images-all.mjs [topics-dir]
```
Scans all MDX files for broken image references (`![](images/...)` pointing to non-existent files). Builds an index of all images in the topics tree, then:
- Rewrites broken paths to the closest matching image
- Handles case-insensitive filename matching (`.PNG` vs `.png`)
- Comments out truly missing images so the build doesn't fail

To detect broken images without fixing:
```bash
node scripts/find-broken-images.mjs [--topics=<path>]
```

### Step 9: Fix Internal Links
```bash
node scripts/fix-internal-links.mjs [--apply] [--topics=<path>]
```
Resolves old-style flat link names (e.g., `/igdatachart-adding.mdx`) to their correct slugified paths (e.g., `/controls/igdatachart/adding`). Handles:
- Old numbered-prefix paths (`02_Controls/igGrid/...`)
- `.mdx`/`.md` extension stripping (Starlight uses slug routing)
- Bare names and `./` relative links
- `//` and `///` broken absolute prefixes
- Deep multi-segment name decomposition (maps folder+stem combinations)

### Step 10: Add Slugs to toc.json
```bash
node scripts/add-slugs-to-toc.mjs [--topics=<path>] [--toc=<path>]
```
Reads each MDX file referenced in `toc.json` and extracts its slug (from frontmatter `slug:` or DocFX `"fileName"` metadata). Adds a `"slug"` field to each toc.json entry. This lets `sidebar.ts` and `integration.ts` resolve slugs without reading every source file at build time.

### Step 11: Validate MDX
```bash
node scripts/validate-mdx.mjs [topics-dir]
```
Validates all MDX files compile without errors using `@mdx-js/mdx`. Reports errors grouped by type.

## Standalone Utility Scripts

These scripts are **not part of the pipeline** but are useful for specific tasks:

| Script | Purpose |
|--------|---------|
| `normalize-mdx.mjs` | CLI wrapper for `src/normalize-mdx.ts`. Normalizes legacy DocFX MDX (strips metadata, generates frontmatter with slug, escapes braces, fixes HTML tables). Runs automatically at build time via `normalizeMdxDir()` in `astro.config.ts`. |
| `sort-jquery-toc.mjs` | Reorders `toc.json` to match canonical order from original `NN_`-prefixed structure. |
| `fix-nested-lists.mjs` | Fixes nested list indentation (DocFX 2-space → MDX 4-space). |

## Using with Another Library

All scripts accept `--topics=` to override the default jQuery topics path:

```bash
# Example: migrating a "blazor" library
TOPICS=docs/blazor/src/content/en/topics
TOC=docs/blazor/toc.json

node scripts/migrate-jquery-pipeline.mjs --apply --topics=$TOPICS --toc=$TOC

# Or run individual steps:
node scripts/gen-jquery-toc.mjs --topics=$TOPICS --toc=$TOC
node scripts/convert-docfx-tokens.mjs --apply --topics=$TOPICS
node scripts/convert-html-tables.mjs $TOPICS --apply
node scripts/fix-html-links.mjs --apply --topics=$TOPICS
node scripts/rename-jquery-topics.mjs --apply --topics=$TOPICS --toc=$TOC
node scripts/fix-pseudo-html.mjs $TOPICS
node scripts/fix-all-mdx.mjs --apply --topics=$TOPICS
node scripts/fix-broken-images-all.mjs $TOPICS
node scripts/fix-internal-links.mjs --apply --topics=$TOPICS
node scripts/add-slugs-to-toc.mjs --topics=$TOPICS --toc=$TOC
node scripts/validate-mdx.mjs $TOPICS
```

## Environment Tokens

Create `docs/{lib}/src/content/en/environment.json` with token values for each environment:

```json
{
  "development": {
    "ProductName": "My Product",
    "SamplesUrl": "https://dev.samples.example.com"
  },
  "staging": { ... },
  "production": { ... }
}
```

Tokens are used as `&#123;environment:TokenName&#125;` in MDX content (entity-encoded) and resolved at build time by the `remark-docfx` plugin.

## Build-Time Processing

These transformations happen automatically during `npm run build` (no scripts needed):

1. **`normalizeMdxDir()`** (in `astro.config.ts`) — strips DocFX metadata blocks, generates frontmatter with `slug:` from `"fileName"`, escapes `{` to `&#123;`, fixes orphaned HTML table tags, rewrites old numbered-folder image paths.
2. **`remark-docfx`** plugin — resolves `&#123;environment:Token&#125;` to values from `environment.json`, rewrites internal `.mdx` links using a slug map, adds sample widgets.
3. **`sidebar.ts`** — builds Starlight sidebar from `toc.json`, reads `slug` field directly (added by Step 10).
4. **`integration.ts`** — generates `llms.txt` and per-page `.md` files for LLM crawlers, using a slug→file map that handles custom slugs.

## Key Constraints

- **MDX braces**: `{` in prose/table cells causes parse errors. All `{` outside code fences must be escaped to `&#123;` / `&#125;`. The `remark-docfx` plugin handles entity-encoded `&#123;environment:...&#125;` tokens.
- **No `.mdx` in links**: Starlight uses slug-based routing. Links should be `/path/to/page`, not `/path/to/page.mdx`.
- **Absolute links**: Use `/controls/igdatachart/adding` format (from content root).
- **Slugs**: Pages can have flat slugs (from DocFX `"fileName"`) that differ from their filesystem path. The slug is stored in toc.json and used by the sidebar and link resolver.

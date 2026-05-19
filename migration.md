# DocFX → MDX Migration Guide

This guide covers every change needed when moving a doc page from the old DocFX workflow (Angular: `igniteui-docfx`, Xplat: `igniteui-xplat-docs`) to the new Astro-based MDX workflow (`docs-template`).

---

## Table of Contents

1. [Repo & file locations](#1-repo--file-locations)
2. [Dev server & build commands](#2-dev-server--build-commands)
3. [File format: `.md` → `.mdx`](#3-file-format-md--mdx)
4. [Frontmatter](#4-frontmatter)
5. [Links](#5-links)
6. [Samples (`<code-view>` / `` `sample=… `` → `<Sample>`)](#6-samples)
7. [Images](#7-images)
8. [Callout boxes (`>[!NOTE]` → `<DocsAside>`)](#8-callout-boxes)
9. [Inline styles / `<p class="highlight">` → `<div>`](#9-inline-styles)
10. [API links (`ApiLink` and `ApiRef`)](#10-api-links)
11. [Platform-conditional content — Xplat only (`<!-- Platform -->` → `<PlatformBlock>`)](#11-platform-conditional-content--xplat-only)
12. [Table of contents (`toc.yml` → `toc.json`)](#12-table-of-contents)
13. [Environment variables (`{environment:…}`)](#13-environment-variables)
14. [`docConfig.json` / `docComponents.json` — still used](#14-docconfigjson--doccomponentsjson--still-used)
15. [`global.json` — unchanged](#15-globaljson--unchanged)
16. [Image filename casing](#16-image-filename-casing)
17. [Grid template files](#17-grid-template-files)
18. [Adding a new page — checklist](#18-adding-a-new-page--checklist)

---

## 1. Repo & file locations

| | Old (DocFX) | New (MDX) |
|---|---|---|
| Angular content | `igniteui-docfx/en/components/` | `docs-template/docs/angular/src/content/en/components/` |
| Angular JP content | `igniteui-docfx/jp/components/` | `docs-template/docs/angular/src/content/jp/components/` |
| Angular images | `igniteui-docfx/en/images/` | `docs-template/docs/angular/src/content/en/images/` |
| Xplat content | `igniteui-xplat-docs/doc/en/components/` | `docs-template/docs/xplat/src/content/en/components/` |
| Xplat images | `igniteui-xplat-docs/doc/en/images/` | `docs-template/docs/xplat/src/assets/images/` (alias `@xplat-images`) |

The overall directory structure (folder names, sub-folder nesting) is otherwise identical between old and new.

---

## 2. Dev server & build commands

### Angular

```bash
# old (DocFX)
NODE_ENV=development npm start -- --lang en

# new (Astro)
npm run dev:en          # development server, English
npm run dev:jp          # development server, Japanese
npm run build:en        # build, English
npm run build-staging:en
npm run build-staging:jp
```

### Xplat

```bash
# old (DocFX/Yarn)
yarn run build-docfx-react     # generate React output
yarn run build-docfx-blazor

# new (Astro)
cd docs-template
npm run build:staging:react:en
npm run build:staging:wc:en
npm run build:staging:blazor:en
```

The `NODE_ENV` variable (`development` / `staging` / `production`) and `DOCS_LANG` variable (`en` / `jp` / `kr`) are still used to pick the right URLs from `environment.json`.

---

## 3. File format: `.md` → `.mdx`

Rename every file from `.md` to `.mdx`. The content stays mostly the same — MDX is a superset of Markdown — but JSX component tags are now allowed.

---

## 4. Frontmatter

| Field | Old | New |
|---|---|---|
| Description | `_description:` | `description:` |
| Keywords | `_keywords:` | `keywords:` |
| License | `_license:` | `license:` |
| Language | `_language: ja` | `_language: ja` *(unchanged)* |
| Schema / `last_updated` | kept as-is | kept as-is |
| `mentionedTypes` | kept as-is | kept as-is |

Remove the leading underscore from `_description`, `_keywords`, and `_license`. All other frontmatter fields are unchanged.

**Old:**
```yaml
---
title: Angular Card Component
_description: With Angular Card…
_keywords: Angular Card component, …
_license: MIT
---
```

**New:**
```yaml
---
title: Angular Card Component
description: With Angular Card…
keywords: Angular Card component, …
license: MIT
---
```

---

## 5. Links

Internal cross-page links no longer use `.md` file extensions or relative paths. Use root-relative paths without extension.

| | Old | New |
|---|---|---|
| Internal link | `[Getting Started](general/getting-started.md)` | `[Getting Started](/general/getting-started)` |
| Anchor link | `[section](page.md#anchor)` | `[section](/page#anchor)` |
| External links | unchanged | unchanged |

---

## 6. Samples

### Angular

**Old (`<code-view>`):**
```html
<code-view style="height: 500px"
           data-demos-base-url="{environment:demosBaseUrl}"
           iframe-src="{environment:demosBaseUrl}/layouts/card-sample-0/"
           alt="Angular Card Example">
</code-view>
```

**New (`<Sample>`):**
```mdx
import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';

<Sample src="/layouts/card-sample-0" height={500} alt="Angular Card Example" />
```

- `data-demos-base-url` is gone; the correct base URL is injected automatically from `environment.json` based on `NODE_ENV`.
- `height` is a JSX number prop, not a CSS string.
- The closing `/` on the path is optional and usually omitted.

### Xplat

**Old (backtick macro):**
```
`sample="/layouts/card/overview", height="640", alt="{Platform} Card Example"`
```

**New (`<Sample>`):**
```mdx
<Sample src="/layouts/card/overview" height={640} alt="{Platform} Card Example" />
```

The `{Platform}` token is still resolved at build time; no change needed there.

---

## 7. Images

### Angular

**Old (`<img>` with `data-src`):**
```html
<img class="b-lazy responsive-img"
     src="../../images/general/landing-grid-page.png"
     data-src="../../images/general/landing-grid-page.png"
     alt="Angular Data Grid">
```

**New (Astro `<Image>`):**
```mdx
import { Image } from 'astro:assets';
import landingGridPage from '../../images/general/landing-grid-page.png';

<Image src={landingGridPage} alt="Angular Data Grid" />
```

- Import the image as an ES module at the top of the file (after frontmatter).
- Use `<Image>` from `astro:assets` for static images that benefit from optimisation.
- For purely decorative inline SVGs you can still use a plain `<img src={…} />` with the imported variable.

### Xplat

Images live under `docs/xplat/src/assets/images/` and are imported via the `@xplat-images` path alias:

```mdx
import { Image } from 'astro:assets';
import nodejs from '@xplat-images/general/nodejs.svg';

<Image src={nodejs} alt="NodeJS" />
```

### Casing rule (CI fix)

Image filenames **must use lowercase extensions** (`.jpg`, `.png`, `.svg`). Linux CI is case-sensitive; `.JPG` or `.PNG` will pass locally on Windows but break the build on GitHub Actions. Use `git mv` to rename files so Git tracks the change:

```bash
git mv image.JPG image.jpg
```

---

## 8. Callout boxes

**Old (DocFX alert syntax):**
```markdown
>[!NOTE]
> Text of the note.

>[!WARNING]
> Text of the warning.
```

**New (`<DocsAside>`):**
```mdx
import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';

<DocsAside type="note">
Text of the note.
</DocsAside>

<DocsAside type="caution">
Text of the warning.
</DocsAside>
```

Supported `type` values: `note`, `tip`, `caution`, `danger`.

---

## 9. Inline styles

### `<p class="highlight">` paragraph

`<p class="highlight">` works fine in MDX when the content is inline text with no blank lines inside the tag. Use a `<div>` when the content spans multiple paragraphs (i.e., has blank lines between sentences), because a blank line inside a JSX `<p>` causes an MDX parse error.

```mdx
<!-- works – single inline paragraph -->
<p class="highlight">Short description text.</p>

<!-- use div when content has blank lines or multiple block elements -->
<div class="highlight">

First paragraph.

Second paragraph.

</div>
```

### `<style>` blocks

In MDX, pass the CSS as a template literal child:

**Old (plain HTML):**
```html
<style>
.my-class { color: red; }
</style>
```

**New (MDX template literal):**
```mdx
<style>{`
.my-class { color: red; }
`}</style>
```

An alternative that also works (used in some older angular pages) is:
```mdx
<style dangerouslySetInnerHTML={{__html: `.my-class { color: red; }`}} />
```

Prefer the template literal form — it is simpler and matches the pattern used across most pages in this repo.

---

## 10. API links

Two components are available. **`ApiLink` is the preferred component going forward; `ApiRef` is considered deprecated and should not be used for new content.**

### `ApiLink` — inline link to a single API symbol

```mdx
import ApiLink from 'igniteui-astro-components/components/mdx/ApiLink.astro';

<!-- Simple type link -->
<ApiLink type="IgxCardComponent" />

<!-- Specify the package explicitly when it cannot be inferred -->
<ApiLink type="IgxGridComponent" pkg="grids" />

<!-- Link to a member (method / property) -->
<ApiLink type="IgxGridComponent" member="filter" />

<!-- Custom display label -->
<ApiLink type="IgxGridComponent" label="Data Grid" />
```

The component replaces the old pattern of writing the raw API URL:
```markdown
<!-- Old DocFX pattern -->
[`IgxCardComponent`]({environment:angularApiUrl}/classes/igxcardcomponent.html)
```

### `ApiRef` — end-of-page API reference section (deprecated)

`ApiRef` renders a grouped list of API types at the bottom of a page. It still works but **should not be used for new pages**. Convert existing `ApiRef` usage to inline `ApiLink` calls instead.

```mdx
<!-- Deprecated – do not add to new pages -->
import ApiRef from 'igniteui-astro-components/components/mdx/ApiRef.astro';
<ApiRef types={["BulletGraph", "LinearGraphRange"]} pkg="gauges" />
```

---

## 11. Platform-conditional content — Xplat only

The old xplat repo used HTML comments as platform guards:

**Old:**
```markdown
<!-- React -->
Content only for React.
<!-- end: React -->

<!-- WebComponents, Blazor -->
Content for WC and Blazor.
<!-- end: WebComponents, Blazor -->
```

**New (`<PlatformBlock>`):**
```mdx
import PlatformBlock from 'igniteui-astro-components/components/mdx/PlatformBlock.astro';

<PlatformBlock for="React">

Content only for React.

</PlatformBlock>

<PlatformBlock for="WebComponents, Blazor">

Content for WC and Blazor.

</PlatformBlock>
```

Valid platform names: `Angular`, `React`, `WebComponents`, `Blazor`.

- Always leave a blank line after the opening tag and before the closing tag.
- Do not self-close `<PlatformBlock />` — it must have children.
- Fenced code blocks inside `<PlatformBlock>` are automatically filtered by platform during generation, so you can still stack multiple code blocks one after another for different platforms inside a single block.

---

## 12. Table of contents

| | Old | New |
|---|---|---|
| Angular format | `toc.yml` (YAML) | `toc.json` (JSON) |
| Xplat format | `docfx/en/components/toc.json` | `docs/xplat/src/content/en/components/toc.json` |
| File extension in href | `.md` | `.mdx` |
| Platform exclusion (xplat) | `"exclude": ["Angular", "Blazor"]` | same |
| Status values | `"status": "NEW"` / `"NEW_REACT"` | `"status": "new"` / `"updated"` |
| Default page (angular) | first item implicitly | `"default": true` on the entry |

**Old Angular toc.yml:**
```yaml
- name: Getting started
  href: general/getting-started.md
  new: false
```

**New Angular toc.json:**
```json
{
  "name": "Getting started",
  "href": "general/getting-started.mdx",
  "new": false,
  "default": true
}
```

**Xplat TOC entry with platform exclusion:**
```json
{
  "exclude": ["Angular", "React", "WebComponents"],
  "name": "Installing Ignite UI for Blazor",
  "href": "general-installing-blazor.mdx",
  "status": "new"
}
```

---

## 13. Environment variables

`environment.json` is still read and its structure is **unchanged**. The token `{environment:demosBaseUrl}` and similar are **no longer written literally in MDX files** — they are only used internally by the framework and in `environment.json` itself.

The `angularApiUrl` key was removed from the new `environment.json` (it is no longer needed since API URLs are resolved by `ApiLink` automatically).

---

## 14. `docConfig.json` / `docComponents.json` — still used

Both files are carried over without change to `docs-template/docs/xplat/`. They continue to define:

- Platform-specific token replacements (`{ProductName}`, `{Platform}`, `{IgPrefix}`, `{PackageGrids}`, etc.)
- Shared component mappings (`Grid`, `TreeGrid`, `PivotGrid`, `HierarchicalGrid`) that drive the `_shared/` → per-grid file generation

Nothing in these files needs to change when migrating content.

---

## 15. `global.json` — unchanged

`global.json` is copied as-is. All nav bar settings, locale flags, and redirect configuration remain identical.

---

## 16. Image filename casing

All image file extensions must be lowercase. This was not enforced by the DocFX build (which ran on Windows), but the Astro build on Linux CI is case-sensitive and will fail with a Vite "Could not resolve" error.

| Bad (causes CI failure) | Good |
|---|---|
| `screenshot.JPG` | `screenshot.jpg` |
| `diagram.PNG` | `diagram.png` |
| `logo.SVG` | `logo.svg` |

Rename using `git mv` so the rename is tracked:

```bash
git mv docs/angular/src/content/jp/images/general/generate-token.JPG \
       docs/angular/src/content/jp/images/general/generate-token.jpg
```

---

## 17. Grid template files

Both Angular and Xplat have **shared template files** that generate multiple per-grid pages (Grid, TreeGrid, HierarchicalGrid, PivotGrid). The authoring model carried over to MDX but the template syntax changed.

### Angular — `grids_templates/`

Files live in `docs/angular/src/content/<lang>/grids_templates/`. Each file is a shared template that the build expands into per-grid pages under `components/grid/`, `components/treegrid/`, etc.

**Do not edit the generated per-grid files directly** — always edit the template in `grids_templates/`.

| Old (DocFX `@@` syntax) | New (`ComponentBlock` / token) |
|---|---|
| `@@igComponent` | `{ComponentTitle}` |
| `@@if (igxName === 'IgxGrid') { ... }` | `<ComponentBlock for="Grid">...</ComponentBlock>` |
| `@@if (igxName !== 'IgxGrid') { ... }` | `<ComponentBlock for="TreeGrid, HierarchicalGrid, PivotGrid">...</ComponentBlock>` |
| `_canonicalLink: grid/advanced-filtering` | `canonicalLink: grid/advanced-filtering` (no underscore) |

**Old (`@@` syntax):**
```markdown
@@if (igxName === 'IgxGrid') {
---
title: Angular Grid Advanced Filtering
---
}
@@if (igxName !== 'IgxGrid') {
---
title: Angular Grid Advanced Filtering
_canonicalLink: grid/advanced-filtering
---
}

# Angular @@igComponent Advanced Filtering

@@if (igxName === 'IgxGrid') {
<code-view iframe-src="{environment:demosBaseUrl}/grid/grid-advanced-filtering" height="530"></code-view>
}
```

**New (`ComponentBlock`):**
```mdx
<ComponentBlock for="Grid">

---
title: Angular Grid Advanced Filtering
---

</ComponentBlock>
<ComponentBlock for="TreeGrid, HierarchicalGrid, PivotGrid">

---
title: Angular Grid Advanced Filtering
canonicalLink: grid/advanced-filtering
---

</ComponentBlock>

import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';

# Angular {ComponentTitle} Advanced Filtering

<ComponentBlock for="Grid">
<Sample src="/grid/grid-advanced-filtering" height={530} alt="Angular Grid Advanced Filtering Example" />
</ComponentBlock>
```

Valid `for` values: `Grid`, `TreeGrid`, `HierarchicalGrid`, `PivotGrid`.

### Xplat — `grids/_shared/`

Files live in `docs/xplat/src/content/<lang>/components/grids/_shared/`. The structure and tokens are **unchanged** from the old repo — the `sharedComponents` frontmatter array still drives generation:

```yaml
---
sharedComponents: ["Grid", "TreeGrid", "HierarchicalGrid"]
---
```

Tokens like `{ComponentTitle}`, `{ComponentName}`, `{ComponentSample}`, `{ComponentApiMembers}` still work as before. The only syntax changes are the same as for any other MDX file: frontmatter key underscore removal, `<Sample>` instead of backtick macro, `<PlatformBlock>` instead of comment guards.

---

## 18. Adding a new page — checklist

Use this checklist when creating a new MDX page in either `angular` or `xplat`.

- [ ] **File**: create `<name>.mdx` (not `.md`) in the correct `src/content/<lang>/components/` subfolder
- [ ] **Frontmatter**: use `description:`, `keywords:`, `license:` (no leading underscore)
- [ ] **Imports**: add all component imports immediately after the frontmatter closing `---`
- [ ] **Sample**: use `<Sample src="…" height={…} alt="…" />` — no `<code-view>` or backtick macro
- [ ] **Images**: import with ES `import`, use `<Image>` from `astro:assets`; filenames must be lowercase-extension
- [ ] **Callouts**: use `<DocsAside type="note|tip|caution|danger">` — no `>[!NOTE]`
- [ ] **API links**: use `<ApiLink type="…" />` inline — do not add new `<ApiRef>` blocks
- [ ] **Platform blocks** (xplat only): use `<PlatformBlock for="…">` — no HTML comment guards
- [ ] **Internal links**: root-relative, no `.mdx` extension, no `.md` extension
- [ ] **TOC**: add an entry to `toc.json` with `.mdx` extension in `href`
- [ ] **`mentionedTypes`** (xplat): list at least one component class name in frontmatter

# Ignite UI Documentation

This public repository contains the documentation source for the Ignite UI for Angular, Ignite UI for Blazor, Ignite UI for React, and Ignite UI for Web Components products. They are built and hosted using Astro.

## Prerequisites

- [Node.js](https://nodejs.org) v22.12.0 or higher
- [npm](https://www.npmjs.com/)

## Getting Started

```bash
git clone https://github.com/IgniteUI/igniteui-documentation.git
cd igniteui-documentation
npm install
```

## Project Structure

```text
igniteui-documentation/
├── docs/
│   ├── angular/          # Angular documentation package and generated Angular content
│   │   ├── public/       # Angular-specific static assets
│   │   ├── scripts/      # Angular sync and generation scripts
│   │   └── src/          # Angular Astro pages, MDX content, and components
│   └── xplat/            # Shared xplat source for Blazor, React, Web Components, and Angular-generated docs
│       ├── public/       # xplat static assets
│       ├── scripts/      # xplat generation scripts
│       └── src/          # xplat Astro pages, MDX content, assets, and libraries
├── public/               # Shared public assets
├── scripts/              # Repository-level utility scripts
├── src/                  # Shared Astro framework, routing, sidebar, content helpers, styles, and integrations
├── package.json          # Root workspace and convenience scripts
└── tsconfig.json         # Root TypeScript configuration
```

## Running the Documentation Sites

The old template-level run commands are obsolete for product documentation. Each documentation package owns its run, build, and preview commands in its own `package.json`.

Use the platform-specific commands from the root workspace:

| Product | Dev command
| --- | --- |
| Angular | `npm run angular:dev`
| Angular English | `npm run angular:dev:en`
| Angular Japanese | `npm run angular:dev:jp`
| Angular Korean | `npm run angular:dev:kr`
| React | `npm run xplat:dev:react`
| React Japanese | `npm run xplat:dev:react:jp`
| Web Components | `npm run xplat:dev:webcomponents`
| Web Components Japanese | `npm run xplat:dev:webcomponents:jp`
| Blazor | `npm run xplat:dev:blazor`
| Blazor Japanese | `npm run xplat:dev:blazor:jp`


## MDX Components

The MDX files currently use these documentation components from `igniteui-astro-components/components/mdx`:

| Component | Purpose |
| --- | --- |
| `ApiLink` | Links to generated API reference entries. |
| `DocsAside` | Adds callouts and aside content inside documentation pages. |
| `PlatformBlock` | Shows content only for selected platforms. |
| `Sample` | Embeds runnable or linked product samples. |

## Checking Relative Links

Use the root `check-relative-links` scripts to validate that every relative cross-page link in the MDX source resolves to an existing file.

### Link convention

All relative cross-page links must carry the `.mdx` extension. Preferred forms:

- `./page.mdx` — same-directory link (explicit relative)
- `../folder/page.mdx` — parent-directory link (explicit relative)
- `page.mdx` — bare same-directory link (also accepted by the checker)

The `.mdx` extension enables editor Go-to-Definition (Ctrl+Click). The `remarkMdLinks` plugin strips the extension and makes the URL absolute at build time. The link checker validates that the target file exists and normalizes bare `page.mdx` links as same-directory relative.

### Angular content pipeline

The Angular documentation is assembled from three sources before being checked:

1. **xplat sync** — `docs/xplat/src/content/` is generated into platform-specific output and then copied into `docs/angular/src/content/` by the sync scripts.
2. **Grid generation** — `docs/angular/src/content/en/grids_templates/` and `jp/grids_templates/` are template files shared across all four grid types (Grid, TreeGrid, HierarchicalGrid, PivotGrid). `generate.mjs` expands them into the individual component pages under `docs/angular/src/content/en/components/grid/`, `treegrid/`, `hierarchicalgrid/`, and `pivotGrid/`. These template directories are excluded from link checking (same as xplat `_shared/`).
3. **Link check** — the checker scans the fully assembled `docs/angular/src/content/` tree.

The check must run **after** both steps above, otherwise it scans stale or incomplete files and misses links that only exist in generated output.

### Commands

The preferred command to replicate the exact CI pipeline locally:

```bash
npm run check-relative-links:ci
```

This runs the full chain in order:
1. Sync xplat → angular (en)
2. Sync xplat → angular (jp)
3. Generate angular grid pages (en)
4. Generate angular grid pages (jp)
5. Generate xplat React + WC + Blazor pages (en) — expands `_shared/` templates into `docs/xplat/generated/`
6. Generate xplat React + WC + Blazor pages (jp)
7. Check xplat links (source excluding `_shared/` + generated output)
8. Check angular links

Other available commands:

| Scope | Command |
|---|---|
| Full CI simulation (preferred) | `npm run check-relative-links:ci` |
| Angular only (runs generate first) | `npm run check-relative-links:angular` |
| xplat (generates all platforms, then checks source + generated) | `npm run check-relative-links:xplat` |
| Both trees, no setup (skips generate steps) | `npm run check-relative-links` |
| Angular report to file | `npm run check-relative-links:report:angular` |
| xplat report to file | `npm run check-relative-links:report:xplat` |

The checker exits with code 1 on any broken link and prints each failure with a reason code:

| Reason | Meaning |
|---|---|
| `[not found]` | Target file does not exist |
| `[add .mdx extension]` | Link is `./page` — has `./` prefix but is missing the `.mdx` extension |
| `[use ./page.mdx instead]` | Link is `(page)` — bare path with no extension and no `./` prefix |

## Checking MDX API Links

Use the root `check-mdx-links` scripts to validate `ApiLink` references:

| Scope | Command |
|---|---|
| All MDX sources | `npm run check-mdx-links` |
| Angular docs | `npm run check-mdx-links:angular` |
| React xplat docs | `npm run check-mdx-links:react` |
| Web Components xplat docs | `npm run check-mdx-links:wc` |
| Blazor xplat docs | `npm run check-mdx-links:blazor` |
| Markdown reports | `npm run check-mdx-links:report:<platform>` |
| Resolve-only broken-link reports | `npm run check-mdx-links:broken:<platform>` |

These scripts also check for ambiguous `ApiLink` references. If a symbol exists in more than one registry package and the link does not specify enough information to choose safely, the script prints an `Ambiguous ApiLinks` section, writes an `api-link-ambiguity-report*.md` file under `reports/`, and exits with a failure.

Fix ambiguous links by adding a specific `pkg` or `kind` prop. If the correct target differs by platform, wrap platform-specific links in `PlatformBlock`.

## Content Locations

- Angular content lives under `docs/angular/src/content/<locale>/`.
- Shared xplat content lives under `docs/xplat/src/content/<locale>/`.
- Static images and assets are stored in the nearest product package when product-specific, or in the root `public/` directory when shared.

## Collaboration Docs

- [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md): day-to-day editing, generated-content behavior, and report expectations.
- [API-LINK-WORKFLOW.md](API-LINK-WORKFLOW.md): API registry flow, `ApiLink` resolution, ambiguity handling, and checker commands.

## Contributing

Open a pull request against this repository and request review from the documentation team.

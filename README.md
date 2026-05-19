# Ignite UI Documentation

This public repository contains the documentation source for the Ignite UI for Angular, Ignite UI for Blazor, Ignite UI for React, and Ignite UI for Web Components products.

It started as an Astro documentation template, but now fully replaces the old `igniteui-docfx` and `igniteui-xplat-docs` repositories as the source of truth for these product docs.

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

| Product | Dev command | Package command source |
| --- | --- | --- |
| Angular | `npm run angular:dev` | `docs/angular/package.json` |
| Angular English | `npm run angular:dev:en` | `docs/angular/package.json` |
| Angular Japanese | `npm run angular:dev:jp` | `docs/angular/package.json` |
| Angular Korean | `npm run angular:dev:kr` | `docs/angular/package.json` |
| React | `npm run xplat:dev:react` | `docs/xplat/package.json` |
| React Japanese | `npm run xplat:dev:react:jp` | `docs/xplat/package.json` |
| Web Components | `npm run xplat:dev:webcomponents` | `docs/xplat/package.json` |
| Web Components Japanese | `npm run xplat:dev:webcomponents:jp` | `docs/xplat/package.json` |
| Blazor | `npm run xplat:dev:blazor` | `docs/xplat/package.json` |
| Blazor Japanese | `npm run xplat:dev:blazor:jp` | `docs/xplat/package.json` |

Build and preview commands follow the same pattern in the root `package.json`, `docs/angular/package.json`, and `docs/xplat/package.json`.

## MDX Components

The MDX files currently use these documentation components from `igniteui-astro-components/components/mdx`:

| Component | Purpose |
| --- | --- |
| `ApiLink` | Links to generated API reference entries. |
| `DocsAside` | Adds callouts and aside content inside documentation pages. |
| `PlatformBlock` | Shows content only for selected platforms. |
| `Sample` | Embeds runnable or linked product samples. |

## Content Locations

- Angular content lives under `docs/angular/src/content/<locale>/`.
- Shared xplat content lives under `docs/xplat/src/content/<locale>/`.
- Static images and assets are stored in the nearest product package when product-specific, or in the root `public/` directory when shared.

## Contributing

Open a pull request against this repository and request review from the documentation team.

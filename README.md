# docs-template

Shared [Astro](https://astro.build) documentation framework for IgniteUI library docs. Consumes [`igniteui-astro-components`](https://github.com/IgniteUI/astro-components) and provides per-platform builds for Angular, React, Web Components, and Blazor docs.

## Prerequisites

- [Node.js](https://nodejs.org) v22.12.0 or higher
- npm workspaces (both `docs/angular` and `docs/xplat` are workspace members)

## Getting started

```bash
npm install
```

### Dev server

```bash
# Angular docs
npm run angular:dev:en

# xplat (pick a platform)
npm run xplat:dev:angular
npm run xplat:dev:react
npm run xplat:dev:webcomponents
npm run xplat:dev:blazor
```

## Project structure

```
docs-template/
├── src/
│   ├── integration.ts          # Core Astro integration (virtual modules, plugins, pagefind)
│   ├── platform.ts             # Per-platform CDN assets (styles/scripts) + nav types
│   ├── sidebar.ts              # TOC → sidebar tree converter
│   ├── plugins/
│   │   ├── remark-env-vars.ts  # {Environment.X} token substitution
│   │   ├── remark-md-links.ts  # .md → slug rewriting + DOCS_BASE prepending
│   │   └── remark-html-transforms.ts  # divider→<hr>, code lang normalization, img fixes
│   └── components/
│       └── ThemingWidget.astro
├── docs/
│   ├── angular/                # Angular-specific docs workspace
│   └── xplat/                  # Cross-platform docs workspace (React, WC, Blazor)
└── package.json
```

## Available scripts

| Command | Action |
|---|---|
| `npm run angular:dev:en` | Angular docs dev server (English) |
| `npm run angular:build:en` | Build Angular docs (English) |
| `npm run xplat:dev:react` | xplat React dev server |
| `npm run xplat:build:react` | Build xplat React docs |

See `package.json` for the full list of per-platform build/preview commands.

## Markdown plugins

Content is processed through three focused remark plugins (in `src/plugins/`):

| Plugin | Purpose |
|---|---|
| `remark-env-vars` | Substitutes `{Environment.X}` tokens from `environment.json` |
| `remark-md-links` | Rewrites `.md` hrefs to slugs; prepends `DOCS_BASE` |
| `remark-html-transforms` | Converts `---` dividers to `<hr>`, normalises code lang aliases, fixes img `src` |

## Virtual modules

`siteMetaIntegration` (via `createDocsSite`) exposes two virtual modules:

- `virtual:docs-template/site-meta` — `title`, `sidebar`, `productLinks`, `headEntries`, `trailingSlash`, `navLang`
- `virtual:docs-template/nav-html` — `platform`, `themeApiUrl`, `widgetScriptSrc`

## Contributing

Open a pull request and request a review from the docs team.

## 📄 License

Internal use only — © IgniteUI / Infragistics.
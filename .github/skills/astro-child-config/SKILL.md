---
name: astro-child-config
description: "Reference guide for creating or updating an Astro child site under `docs/{lib}/` in this monorepo. Covers `astro.config.ts` structure, `package.json` scripts (dev/build/preview × en/jp), `IGDOCS_PLATFORMS` registration in `src/platform.ts`, language-aware path selection (`DOCS_LANG` env), `tsconfig.json`, `content.config.ts`, the `createDocsSite()` integration helper, port allocation, base paths, multi-language source folder mapping (e.g. `DOCS_LANG=jp` → `ja/` folder), and per-platform conventions (jQuery vs Angular vs xplat). Use when an agent needs to add a new docs library, add a new language to an existing library, or audit a child config for missing scripts/platform entries."
user-invocable: true
---

# AI Agent Guide — Configuring an Astro Child Repo

## Context

This monorepo contains a top-level `docs-template` package and several Astro child sites under `docs/{lib}/`:

| Library | Path | Pattern |
|---|---|---|
| jQuery | `docs/jquery/` | DocFX-imported MDX, env-driven lang switching, `DOCS_LANG=jp` → `ja/` folder |
| Angular | `docs/angular/` | Hand-authored MDX, lang folders: `en`, `jp`, `kr` (literal) |
| xplat | `docs/xplat/` | Generated MDX; **platform** + **lang** dual-axis (Angular/React/WC/Blazor × en/jp) |

All three share the same shell:

- Use `createDocsSite()` from `docs-template/integration` for site assembly
- Register their nav identity in `IGDOCS_PLATFORMS` (`src/platform.ts`)
- Mount their content via `source.docsDir` (env-scoped glob loader)
- Use `cross-env DOCS_ENV=...` and `DOCS_LANG=...` for build configuration

This skill explains how to set up a new child site or add a new language to an existing one.

---

## When to Use This Skill

| Situation | Use this skill? |
|---|---|
| Creating a new `docs/{newlib}/` site | **Yes** |
| Adding `kr` (or another lang) to an existing site | **Yes** |
| Site's nav/footer is broken (missing platform entry) | **Yes** |
| Re-allocating ports because of conflicts | **Yes** |
| Renaming a published library (production base path) | **Yes** |
| Editing content of a single MDX page | No — edit the file directly |
| Configuring sidebar order | No — edit `toc.json` directly |
| Migrating new DocFX content | See `docfx-to-mdx-migration` skill first |

---

## Required Files for a New Child Site

```
docs/{newlib}/
├── astro.config.ts                         # site config (this skill)
├── package.json                            # dev/build/preview scripts (this skill)
├── tsconfig.json                           # extends astro/tsconfigs/strict
├── public/web.config                       # IIS routing (Infragistics CDN)
├── src/
│   ├── content.config.ts                   # re-exports docs-template/content
│   ├── env.d.ts                            # `/// <reference types="astro/client" />`
│   └── content/{lang}/
│       ├── topics/                         # MDX content
│       ├── environment.json                # `{environment:Foo}` token values
│       └── images/                         # (optional) image assets
└── toc.json                                # sidebar (en) — non-en lives at src/content/toc.json
```

---

## Step 1 — Register the Library in `src/platform.ts`

`IGDOCS_PLATFORMS` is the source of truth for nav/footer/product-links. Every (library × language) combo needs an entry.

Open [src/platform.ts](src/platform.ts) and add entries. **Each entry needs a unique `devPort`**:

```ts
export const IGDOCS_PLATFORMS = {
    // ... existing entries ...
    NewLib: {
        lang: 'en', label: 'NewLib', key: 'newlib', devPort: 4336,   // unique port
        base: '/docs-newlib',                                          // production URL path
        title: 'Ignite UI for NewLib',
        description: 'Component documentation for Ignite UI for NewLib.',
    },
    NewLibJP: {                          // mandatory if you support jp
        lang: 'jp', label: 'NewLib', key: 'newlib', devPort: 4346,   // +10 from en port (convention)
        base: '/docs-newlib',            // same base — JP domain handles the lang prefix at infra level
        title: 'Ignite UI for NewLib',
        description: 'Component documentation for Ignite UI for NewLib.',
    },
};
```

### Port allocation convention

| Range | Purpose |
|---|---|
| 4321 | xplat (default Astro port; selects platform via `PLATFORM` env) |
| 4331–4335 | en sites (Angular 4331, React 4332, WC 4333, Blazor 4334, jQuery 4335) |
| 4336+ | new libraries (en) |
| 4341–4345 | jp counterparts (`+10` from en) |
| 4346+ | new libraries (jp) |

Pick the next free port in the appropriate range.

### `getNavConfig()` switch — also in `src/platform.ts`

If your library needs a custom navbar (most do), find the `getNavConfig()` function and add a `case 'newlib':` arm. Without this entry the navbar/footer will render empty — a common bug that masquerades as "site is broken".

---

## Step 2 — Write `docs/{newlib}/astro.config.ts`

The minimal pattern (mirrors [docs/jquery/astro.config.ts](docs/jquery/astro.config.ts)):

```ts
// @ts-check
import mdx from '@astrojs/mdx';
import path from 'node:path';
import { createDocsSite, type DocsMode } from 'docs-template/integration';
import { IGDOCS_PLATFORMS, type NavLang } from 'docs-template/platform';

// ── Build mode and language ──────────────────────────────────────────────────
const docsEnv = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';
const docsLang = (process.env.DOCS_LANG || 'en') as NavLang;

if (docsEnv !== 'development' && docsEnv !== 'staging' && docsEnv !== 'production') {
    throw new Error(`[astro.config] Invalid DOCS_ENV "${docsEnv}". Expected one of: "development", "staging", "production".`);
}
const mode: DocsMode = docsEnv;

// ── Site URL ─────────────────────────────────────────────────────────────────
const PROD_HOST = 'https://www.infragistics.com';
const STAGING_HOST = 'https://staging.infragistics.com';

const platformKey = docsLang === 'jp' ? 'NewLibJP' : 'NewLib';
const { base, devPort } = IGDOCS_PLATFORMS[platformKey];
const site = mode === 'production' ? `${PROD_HOST}${base}`
    : mode === 'staging' ? `${STAGING_HOST}${base}`
    : `http://localhost:${devPort}`;

// ── Source paths ─────────────────────────────────────────────────────────────
// If your jp source folder is named differently (e.g. 'ja' for DocFX-style imports):
const contentLangDir = docsLang === 'jp' ? 'ja' : docsLang;
const docsDir = path.resolve(`./src/content/${contentLangDir}/topics`);
const tocPath = docsLang === 'jp'
    ? path.resolve('./src/content/toc.json')   // non-en convention
    : path.resolve('./toc.json');               // en convention

export default createDocsSite({
    site,
    base: mode !== 'development' ? base : undefined,
    title: 'Ignite UI for NewLib',
    description: 'Component and API reference docs for Ignite UI for NewLib.',
    platform: 'newlib',
    navLang: docsLang,
    mode,
    productLinks: Object.values(IGDOCS_PLATFORMS)
        .filter(p => p.lang === docsLang)
        .map(({ label, key, base: b }) => ({
            label,
            href: mode === 'production' ? `${PROD_HOST}${b}` : `${STAGING_HOST}${b}`,
            platform: key,
        })),
    source: { tocPath, docsDir },
    starlight: {},
    image: { service: { entrypoint: 'astro/assets/services/noop' } },
    integrations: [mdx()],
    vite: {
        resolve: {
            alias: { '@': path.resolve('./src') },
        },
    },
});
```

### Variant: hand-authored content (Angular pattern)

If your `jp` folder is literally `jp/` (not `ja/`), drop the `contentLangDir` mapping:

```ts
const docsDir = path.resolve(`./src/content/${docsLang}`);   // jp/ ja/ kr/ — folder name == DOCS_LANG
```

See [docs/angular/astro.config.ts](docs/angular/astro.config.ts) for the full hand-authored pattern (also runs `generateGridTopics()` as a pre-build step).

### Variant: dual-axis platform × lang (xplat pattern)

If your library generates output for multiple **platforms** (Angular/React/WC/Blazor) AND multiple langs, follow [docs/xplat/astro.config.ts](docs/xplat/astro.config.ts). Key differences:

- Resolves `PLATFORM` from env or `.platform.json`
- Uses `LANG_CODE` instead of `DOCS_LANG`
- Mounts content from `./generated/{platform}/{lang}/`
- Adds a Vite plugin for `{Token}` substitution from `docConfig.json` (must run **before** MDX compile, otherwise `{Token}` is parsed as JSX expression)

---

## Step 3 — Write `docs/{newlib}/package.json`

Match the script matrix from [docs/jquery/package.json](docs/jquery/package.json). For each language, you need `dev:{lang}`, `build:{lang}`, `build-staging:{lang}`, `build-production:{lang}`, `preview:{lang}`:

```json
{
  "name": "newlib-docs",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev --port 4336",
    "dev:en": "cross-env DOCS_ENV=development DOCS_LANG=en astro dev --port 4336",
    "dev:jp": "cross-env DOCS_ENV=development DOCS_LANG=jp astro dev --port 4336",

    "build:en": "cross-env DOCS_ENV=production DOCS_LANG=en NODE_OPTIONS=--max-old-space-size=4096 astro build --outDir=../../dist/newlib",
    "build:jp": "cross-env DOCS_ENV=production DOCS_LANG=jp NODE_OPTIONS=--max-old-space-size=4096 astro build --outDir=../../dist/newlib-jp",
    "build":    "cross-env NODE_OPTIONS=--max-old-space-size=4096 astro build",

    "build-staging:en": "cross-env DOCS_ENV=staging NODE_ENV=production DOCS_LANG=en NODE_OPTIONS=--max-old-space-size=4096 astro build --outDir=../../dist/newlib",
    "build-staging:jp": "cross-env DOCS_ENV=staging NODE_ENV=production DOCS_LANG=jp NODE_OPTIONS=--max-old-space-size=4096 astro build --outDir=../../dist/newlib-jp",

    "build-production:en": "cross-env NODE_ENV=production DOCS_LANG=en NODE_OPTIONS=--max-old-space-size=4096 astro build --outDir=../../dist/newlib",
    "build-production:jp": "cross-env NODE_ENV=production DOCS_LANG=jp NODE_OPTIONS=--max-old-space-size=4096 astro build --outDir=../../dist/newlib-jp",

    "preview:en": "cross-env DOCS_LANG=en astro preview --outDir=../../dist/newlib --port 4336",
    "preview:jp": "cross-env DOCS_LANG=jp astro preview --outDir=../../dist/newlib-jp --port 4336",

    "astro": "astro"
  },
  "engines": { "node": ">=22.12.0" },
  "dependencies": {
    "@astrojs/mdx": "^5.0.0",
    "@astrojs/starlight": "^0.38.3",
    "astro": "^6.1.6",
    "docs-template": "file:../../",
    "sharp": "^0.34.2"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "js-yaml": "^4.1.1",
    "sass-embedded": "^1.98.0"
  }
}
```

### Convention rules for scripts

- **Always `cross-env`** for env vars — works on Windows + macOS + Linux.
- **`DOCS_ENV` is the canonical mode flag**; `NODE_ENV` is only set for legacy Vite behavior.
- **Do NOT set `NODE_ENV=staging`** — Vite derives `import.meta.env.DEV` from it and sets it `false`, breaking dev features.
- **`outDir` is per-lang** — e.g. `../../dist/newlib` for en, `../../dist/newlib-jp` for jp. Otherwise the en build is overwritten.
- **`NODE_OPTIONS=--max-old-space-size=4096`** for builds. Without this, large MDX trees OOM on Windows.
- **`dev:{lang}` uses the same port** — only one lang can run at a time.

---

## Step 4 — Wire Up the Top-Level `package.json`

Add scripts that delegate to the child:

```json
{
  "scripts": {
    "newlib:dev:en": "npm run dev:en --prefix docs/newlib",
    "newlib:dev:jp": "npm run dev:jp --prefix docs/newlib",
    "newlib:build:en": "npm run build:en --prefix docs/newlib",
    "newlib:build:jp": "npm run build:jp --prefix docs/newlib"
  }
}
```

---

## Step 5 — `tsconfig.json` and `content.config.ts`

```jsonc
// docs/newlib/tsconfig.json
{
    "extends": "astro/tsconfigs/strict",
    "include": [".astro/types.d.ts", "**/*"],
    "exclude": ["dist"]
}
```

```ts
// docs/newlib/src/content.config.ts
export { collections } from 'docs-template/content';
```

The re-exported `collections` from [src/content-helper.ts](src/content-helper.ts) reads `DOCS_SOURCE_PATH` (set by `createDocsSite()`) and creates a glob loader scoped to that single language directory. **No need to exclude other languages** — they are simply never included.

---

## Step 6 — Validation Checklist

Before opening a PR for a new child site, verify:

- [ ] Each `(lib, lang)` pair has an entry in `IGDOCS_PLATFORMS` with a unique `devPort`
- [ ] `getNavConfig()` in `src/platform.ts` has a `case '{key}':` arm
- [ ] `astro.config.ts` reads `DOCS_LANG` and selects the correct platform key
- [ ] `package.json` has all script variants (dev/build/build-staging/build-production/preview × langs)
- [ ] `dist/{lib}-{lang}` is the per-lang output (no en/jp collision)
- [ ] `cross-env` is used everywhere (Windows compatibility)
- [ ] `environment.json` exists at `src/content/{lang}/environment.json`
- [ ] `toc.json` location matches `tocPath` in astro.config (en at `./toc.json`, non-en at `./src/content/toc.json` per convention)
- [ ] Top-level `package.json` has delegating scripts

---

## Common Pitfalls

### Empty navbar / footer

The page renders but with no nav. Cause: missing `case '{key}':` in `getNavConfig()` in [src/platform.ts](src/platform.ts).

### Site loads but jp content shows en pages

Cause: `astro.config.ts` is not threading `DOCS_LANG` into `docsDir`. Check that `path.resolve('./src/content/${contentLangDir}/topics')` actually swaps with the env value.

### `EMFILE: too many open files` on Windows during dev

Transient on Windows when many terminals/processes are open. Close other Node processes and retry. If chronic, lower the `Vite` watch concurrency or split content into smaller collections.

### Two languages overwrite each other in `dist/`

Cause: missing per-lang `--outDir` in build scripts. Fix: `--outDir=../../dist/{lib}-{lang}`.

### `import.meta.env.DEV` is `false` in dev mode

Cause: `NODE_ENV=staging` was set somewhere upstream. Use `DOCS_ENV=staging` and leave `NODE_ENV` unset (or `development`).

### Sidebar shows raw `{environment:ProductName}` literals

`toc.json` is JSON, not MDX — `remark-docfx` never sees it. Resolution happens at sidebar-build time inside [src/sidebar.ts](src/sidebar.ts), which reads `environment.json` (same lookup as `remark-docfx`) for the active `DOCS_ENV`. If your sidebar still shows raw `{environment:Foo}` text, check that `environment.json` exists alongside the docs dir and contains the key for your active environment. Do **not** statically rewrite tokens in `toc.json` — keep them dynamic.

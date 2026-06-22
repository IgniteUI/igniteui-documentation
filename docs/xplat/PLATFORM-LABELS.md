# Platform-Specific Labels & Auto cleanup on expiration

The xplat TOC (`src/content/{lang}/toc.json`) supports two label features:

1. **Platform overrides** — show a different badge per platform for the same topic
2. **Auto-expiry** — clear `new`/`updated`/`preview` automatically after 2 minor package versions

Both are configured through the `platforms` field on a toc item.

---

## Supported badges

| Field | Label |
|---|---|
| `"new": true` | **New** |
| `"preview": true` | **Preview** |
| `"updated": true` | **Updated** |
| `"premium": true` | premium icon — combinable, **never** auto-expires |

`new`, `preview`, and `updated` are mutually exclusive (first one wins). `premium` is additive.

---

## How to add a label to a toc item

When adding any `new`, `updated`, or `preview` label, always include a `platforms` entry with a `since` value for each platform the item applies to. Without `since`, the label never expires and becomes stale.

### Step 1 — Find the current package versions

| Platform | Package | Registry | Version (as of last update) |
|---|---|---|---|
| Angular | `igniteui-angular` | npm | 21.2.8 |
| React | `igniteui-react` | npm | 19.7.0 |
| WebComponents | `igniteui-webcomponents` | npm | 7.2.3 |
| Blazor | `IgniteUI.Blazor.Trial` | nuget.org | 26.1.51 |

Check the live version before adding:
```sh
# npm packages
npm view igniteui-webcomponents version
npm view igniteui-react version
npm view igniteui-angular version

# Blazor — check https://www.nuget.org/packages/IgniteUI.Blazor.Trial
```

### Step 2 — Add the toc entry

**Same label on all platforms:**
```json
{
  "name": "My New Feature",
  "href": "path/to/feature.md",
  "new": true,
  "platforms": {
    "React":         { "since": "19.7.0" },
    "WebComponents": { "since": "7.2.3" },
    "Blazor":        { "since": "26.1.51" }
  }
}
```

**Different label per platform:**
```json
{
  "exclude": ["Angular"],
  "name": "My Feature",
  "href": "path/to/feature.md",
  "new": true,
  "platforms": {
    "React":         { "since": "19.7.0" },
    "WebComponents": { "new": false, "updated": true, "since": "7.2.3" },
    "Blazor":        { "new": false, "preview": true, "since": "26.1.51" }
  }
}
```

**Key rules:**
- Each platform in `platforms` needs its own `since` with the **current package version at the time you add the label**
- If a platform is excluded via the `exclude` array, do not add it to `platforms`
- If a platform is omitted from `platforms`, its label inherits the top-level badge but **never expires**
- `platforms` and `since` are stripped from the generated output — they are source-only metadata
- Platform names are case-sensitive: `React`, `WebComponents`, `Blazor`

---

## How it works

```
src/content/{lang}/toc.json   ← you edit this
        │
        ▼  buildFilteredToc()  (docs/xplat/astro.config.ts)  — runs at every build
        │   • Filters items excluded for the active platform
        │   • Applies platforms[activePlatform] badge overrides
        │   • Strips `exclude`, `platforms`, and `since` from output
        │
generated/{Platform}/{lang}/components/toc.json   ← clean output, no metadata
        │
        ▼  buildSidebarFromToc()  (src/sidebar.ts)
        badges rendered in the sidebar
```

```
scripts/release-labels.mjs  — run separately (see Release workflow below)
        │   • Fetches the current live version from npm / NuGet for each platform
        │   • Compares against platforms[P].since in every toc item
        │   • If expired: clears the badge, removes `since` from that platform entry
        │   • Preserves the original file indentation
```

Expiry **only happens via the release script**, not at build time. The build only resolves badge overrides.

---

## When labels are cleared

A label expires when the **minor version** of the platform's package has advanced by **2 or more** since the `since` value was recorded.

The comparison uses linearised minor versioning: `(major × 1000 + minor)`.

| `since` | Current | Diff | Expires? |
|---|---|---|---|
| `19.7.0` | `19.9.0` | 2 | **yes** — 2 minor bumps |
| `19.7.0` | `19.8.0` | 1 | no |
| `7.1.0` | `7.2.3` | 1 | no |
| `7.0.0` | `7.2.3` | 2 | **yes** |
| `17.0.0` | `19.7.0` | 2007 | **yes** — cross-major gaps always expire |

When a label expires the script:
1. Clears `new`/`updated`/`preview` for that platform (adds `"new": false` in the platform override, or clears the base flag if it was the only active source)
2. Removes `since` from that platform entry
3. Cleans up empty `platforms` objects

---

## Release workflow

### Manual run (after a release ships)

```sh
npm run release:labels:dry    # preview what would change — no writes
npm run release:labels        # apply to all platforms
npm run release:labels:react  # one platform only
npm run release:labels:wc
npm run release:labels:blazor
npm run release:labels:angular
```

After running, review the diff and commit the updated toc files.

### Automated GitHub Actions workflow

The workflow [`.github/workflows/clear-expired-sidebar-labels.yml`](../../.github/workflows/clear-expired-sidebar-labels.yml) runs **every Tuesday at 09:00 UTC** and can also be triggered manually from the GitHub Actions UI.

It fetches live package versions from:
- npm registry for Angular, React, WebComponents
- nuget.org public feed (`IgniteUI.Blazor.Trial`) for Blazor — same versions as the licensed package

If any labels have expired it opens a pull request on branch `auto/clear-expired-labels` for review. If nothing has expired the run is silent — no PR is created.

---

## Examples

### Same label on all platforms

```json
{
  "name": "New Feature",
  "href": "path/to/feature.md",
  "new": true,
  "platforms": {
    "React":         { "since": "19.7.0" },
    "WebComponents": { "since": "7.2.3" },
    "Blazor":        { "since": "26.1.51" }
  }
}
```

All three show **New** and expire independently as their packages ship new minor versions.

---

### Different label per platform (issue #329)

```json
{
  "exclude": ["Angular"],
  "name": "Chat",
  "href": "interactivity/chat.md",
  "new": true,
  "platforms": {
    "React":         { "since": "19.6.0" },
    "WebComponents": { "new": false, "updated": true, "since": "7.1.0" },
    "Blazor":        { "new": false, "preview": true, "since": "26.1.0" }
  }
}
```

| React | WebComponents | Blazor |
|---|---|---|
| **New** | **Updated** | **Preview** |

---

### Premium badge combined with per-platform label

`premium` is never auto-expired — put it only on the base item.

```json
{
  "exclude": ["Angular"],
  "name": "Cell Merging",
  "href": "grids/grid/cell-merging.md",
  "premium": true,
  "new": true,
  "platforms": {
    "React":         { "since": "19.6.0" },
    "WebComponents": { "since": "7.1.0" },
    "Blazor":        { "new": false, "preview": true, "since": "26.1.0" }
  }
}
```

| React | WebComponents | Blazor |
|---|---|---|
| **New** + premium | **New** + premium | **Preview** + premium |

---

### What an expired item looks like after the script runs

Before (in source toc):
```json
{
  "name": "Localization(i18n)",
  "href": "localization.md",
  "new": true,
  "platforms": {
    "React":         { "since": "17.0.0" },
    "WebComponents": { "new": false, "updated": true, "since": "5.0.0" }
  }
}
```

After `npm run release:labels` (React 19.7 and WC 7.2 are current):
```json
{
  "name": "Localization(i18n)",
  "href": "localization.md",
  "new": false
}
```

Base flag cleared, `platforms` removed entirely — no badge shown on any platform.

---

## Testing locally

The following items in `src/content/en/toc.json` (and `jp/toc.json`) cover all scenarios:

| Item | React | WebComponents | Blazor | What it tests |
|---|---|---|---|---|
| **Chat** | New | Updated | Preview | Different label per platform |
| **Localization(i18n)** | *(expired — no badge)* | *(expired — no badge)* | *(excluded)* | Expiry cleanup |
| **Open-Source vs Premium** | Updated | New | Preview | WC uses base badge, no override |
| **Cell Merging** | New + premium | New + premium | Preview + premium | `premium` never expires |

Run each dev server and check the sidebar for those items:

```sh
# from docs/xplat/
npm run dev:react
npm run dev:webcomponents
npm run dev:blazor
```

---

## Generated files

`docs/xplat/generated/{Platform}/{lang}/components/toc.json` are rebuilt on every Astro start/build. Do not edit them manually — they are always overwritten.

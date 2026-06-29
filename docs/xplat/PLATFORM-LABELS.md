# Platform-Specific Labels

The xplat TOC (`src/content/{lang}/toc.json`) supports per platform badge overrides via the `platforms` field. The same documentation topic can show a different status label depending on which platform is currently being built — without duplicating the toc entry.

## How it works

`buildFilteredToc()` in `astro.config.ts` reads the source `toc.json` for the active platform, applies any matching `platforms` override, strips both `exclude` and `platforms` from the output, and writes the resolved result to `generated/{Platform}/{lang}/components/toc.json`.

```
src/content/en/toc.json  ← edit here
        │
        ▼  buildFilteredToc()  (astro.config.ts)
        │   1. Filter out items excluded for this platform
        │   2. Merge platforms[activePlatform] onto the item
        │   3. Strip `exclude` and `platforms` from output
        │
generated/React/en/components/toc.json       new: true
generated/WebComponents/en/components/toc.json  new: true
generated/Blazor/en/components/toc.json      preview: true
        │
        ▼  buildSidebarFromToc()  (sidebar.ts)
        badges rendered in the sidebar
```

## Supported badges

| Field | Label shown |
|---|---|
| `"new": true` | **New** |
| `"preview": true` | **Preview** |
| `"updated": true` | **Updated** |
| `"premium": true` | premium icon — combinable with any badge above |

`new`, `preview`, and `updated` are mutually exclusive (first one wins). `premium` is additive.

## Syntax

```json
{
  "name": "My Topic",
  "href": "path/to/topic.md",
  "<default-badge>": true,
  "platforms": {
    "<PlatformName>": { "<field>": <value> }
  }
}
```

- The top-level badge is the **default** for any platform that has no override.
- Entries inside `platforms` are **merged** on top for that platform only.
- Platform names: `React`, `WebComponents`, `Blazor` (case-sensitive).
- `platforms` is stripped from the generated output — it never reaches the sidebar.

---

## Examples

### 1 — React = New, WebComponents = Updated, Blazor = Preview


```json
{
  "exclude": ["Angular"],
  "name": "Chat",
  "href": "interactivity/chat.md",
  "new": true,
  "platforms": {
    "WebComponents": { "new": false, "updated": true },
    "Blazor":        { "new": false, "preview": true }
  }
}
```

| React | WebComponents | Blazor |
|---|---|---|
| **New** | **Updated** | **Preview** |

---

### 2 — React = New, WebComponents = Updated

```json
{
  "exclude": ["Blazor", "Angular"],
  "name": "Localization(i18n)",
  "href": "localization.md",
  "new": true,
  "platforms": {
    "WebComponents": { "new": false, "updated": true }
  }
}
```

| React | WebComponents |
|---|---|
| **New** | **Updated** |

---

### 3 — All three platforms with different labels

React=Updated, WebComponents=New (base, no override), Blazor=Preview.

```json
{
  "exclude": ["Angular"],
  "name": "Open-Source vs Premium",
  "href": "general-open-source-vs-premium.md",
  "new": true,
  "platforms": {
    "React":  { "new": false, "updated": true },
    "Blazor": { "new": false, "preview": true }
  }
}
```

| React | WebComponents | Blazor |
|---|---|---|
| **Updated** | **New** | **Preview** |

---

### 4 — Combined with `premium`

`premium` is not overridden so it carries through to all platforms.

```json
{
  "exclude": ["Angular"],
  "name": "Cell Merging",
  "href": "grids/grid/cell-merging.md",
  "premium": true,
  "new": true,
  "platforms": {
    "Blazor": { "new": false, "preview": true }
  }
}
```

| React | WebComponents | Blazor |
|---|---|---|
| **New** + premium | **New** + premium | **Preview** + premium |

---

### 5 — Remove label on one platform

No badge shown for Blazor; New shown everywhere else.

```json
{
  "name": "Some Feature",
  "href": "path/to/feature.md",
  "new": true,
  "platforms": {
    "Blazor": { "new": false }
  }
}
```

| React | WebComponents | Blazor |
|---|---|---|
| **New** | **New** | *(none)* |

---


## Generated files

`docs/xplat/generated/{Platform}/{lang}/components/toc.json` are rebuilt on every Astro start/build. Do not edit them manually — they are overwritten.

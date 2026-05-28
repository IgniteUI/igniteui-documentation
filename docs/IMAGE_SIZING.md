# Image sizing in MDX content

## TL;DR

If a screenshot looks comically large (portrait images rendered as tall towers, small images blown up to full content width), add `style="width:auto;"` to the `<Image>` tag:

```mdx
<Image src={myImage} alt="..." style="width:auto;" />
```

## Why this is needed

The shared `igniteui-astro-components` design system applies a global CSS rule to every `<img>` inside the markdown content area:

```scss
// node_modules/igniteui-astro-components/src/styles/global/_markdown.scss
.igd-main-content__markdown img {
    display: block;
    max-width: 100%;
    width: 100%;          // ← stretches every image to the content column width
    height: auto;         // ← height is recomputed from the intrinsic aspect ratio
    object-fit: cover;
    ...
}
```

`width: 100%` makes the browser ignore the image's intrinsic width and stretch it to fill the article column. `height: auto` then recomputes the height from the intrinsic aspect ratio. For wide landscape screenshots (e.g. 1008×504) this looks fine — they were going to fill the column anyway. For **portrait** or **small-width** images, it produces an enormous render:

| Native size | Aspect | Rendered in a ~900px column |
|---|---|---|
| 378 × 597 (portrait) | 0.63 | ~900 × **1420** — a giant tower |
| 236 × 206 (tiny) | 1.15 | ~900 × **786** — pixelated and huge |
| 626 × 1107 (tall) | 0.57 | ~900 × **1591** — fills the screen |

## The override

Just `width: auto` is enough. It cancels the global `width: 100%`, which restores the intrinsic width attribute Astro emits on the `<img>` (so the image renders at its natural pixel size instead of stretched). The global `height: auto` is then a no-op — the height matches the intrinsic too. `object-fit: cover` from the global rule is already a no-op without an explicit height, so it does not need to be overridden.

The global `max-width: 100%` still applies, so the image will shrink responsively if the viewport is narrower than the image — you do not lose that behavior by overriding only `width`.

Inline `style=` wins over the global selector by specificity, so no `!important` is needed.

## When to apply it

Rule of thumb: apply the override if the source asset is **portrait** (height > width) or **narrow** (width < ~600px). For typical wide landscape screenshots, leave the default — `width: 100%` is what you want there.

If you're unsure, check the asset's pixel dimensions before importing. Wide screenshots like 1008×504 do not need the override.

## Owning the fix upstream

The proper long-term fix is to change the upstream rule in `igniteui-astro-components` to drop `width: 100%` (and ideally `object-fit: cover`, which is a no-op without an explicit height and is misleading). Until then, this inline override is the per-image escape hatch.

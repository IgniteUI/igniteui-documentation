# text-xplat-docs

The cross-platform documentation topics. One `.mdx` source per topic, built once per platform.

## Guides

| document | covers |
|---|---|
| [JSON-SNIPPETS.md](JSON-SNIPPETS.md) | stating a component once as JSON and emitting it for every platform: fences, channels, markers, style options, and how the whole thing is validated |
| [API-TERMS.md](API-TERMS.md) | the `platformType` populations and what each does to an API name in backticks |
| [PLATFORM-LABELS.md](PLATFORM-LABELS.md) | the platform names and how they are spelled |

Authoring rules live in the skills, not here — see [`.agents/README.md`](../../.agents/README.md)
for the index:

| task | skill |
|---|---|
| `PlatformBlock`, for content that belongs to some platforms and not others | [`xplat-docs-platform-block`](../../.github/skills/xplat-docs-platform-block/SKILL.md) |
| `ApiLink` markup, API terms and how references resolve | [`xplat-docs-api-links`](../../.github/skills/xplat-docs-api-links/SKILL.md) |
| `json-snippet` fences, channels and the checks | [`xplat-docs-json-snippets`](../../.github/skills/xplat-docs-json-snippets/SKILL.md) |

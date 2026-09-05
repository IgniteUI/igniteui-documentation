# scripts

What is here builds, tests or validates the topics. It is what the build and CI run, plus the
snippet validators that are run by hand.

| script | what it does | run by |
|---|---|---|
| `generate.mjs` | builds a platform's topics from the shared `.mdx`, emitting every json-snippet | the build |
| `check-doc-scope.mjs` | every topic declares its population, the declaration holds up, and strict-xplat source uses canonical API terms in backticks instead of raw `ApiLink` calls | CI |
| `check-commercial-license.mjs` | every topic emitted for WinUI and Uno Platform has exactly `license: commercial` in its frontmatter | CI |
| `check-snippet-schema.mjs` | every snippet against the schema the descriptions declare | CI |
| `check-snippet-emission.mjs` | every fence emits on every platform, in both languages | CI |
| `snippet-runtime/run.mjs` | every fence loaded into chromium against the real renderer | CI |
| `check-snippet-exclusions.mjs` | no exclusion leaves a platform reading prose with no code | by hand |
| `check-snippet-casing.mjs` | a fence agrees with its sample about member casing | by hand |
| `check-snippet-code-channels.mjs` | a markup fence carries the code the markup could not say | by hand |
| `check-api-map-accuracy.mjs`, `resolve-api-links.mjs`, `fix-api-link-attrs.mjs` | API links | by hand |
| `lib/`, `platform-blocks.mjs` | shared by the above |  |
| `snippet-emitter/` | the emitter, bundled from the published packages | CI builds it |
| `ci/` | what the workflows call directly |  |

See [JSON-SNIPPETS.md](../JSON-SNIPPETS.md) for what a json-snippet is and how to author one, and
[API-TERMS.md](../API-TERMS.md) for the `platformType` populations and how an API name in backticks
becomes the reader's own spelling.

## Collapsing a topic into snippets

The tools that *do* the collapse — planning it, mirroring it into the Japanese copy, comparing what a
fence emits against the hand written blocks it replaces, and the one-shot migrations from the
docfx era — are not here. They are used once per component and never by the build, so they live with
the emitter they belong to:

```
dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/collapse-tools/
```

That folder's README says what each one is. `review-platform-pages.mjs` is the one to reach for when
judging a collapse: it generates a platform's pages from this branch and from whatever it is branched
from, resolves the `PlatformBlock`s on both sides so a reader of that platform is what is compared,
and diffs the result.

They read this checkout and several of them write it, so they find it beside `dev-tools` or take
`XPLAT_DOCS_ROOT`:

```sh
cd dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike
XPLAT_DOCS_ROOT=/path/to/igniteui-docs-json node collapse-tools/plan-snippet-collapse.mjs --file=<topic>.mdx
```

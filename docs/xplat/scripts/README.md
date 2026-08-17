# scripts

What is here builds, tests or validates the topics. It is what the build and CI run, plus the
snippet validators that are run by hand.

| script | what it does | run by |
|---|---|---|
| `generate.mjs` | builds a platform's topics from the shared `.mdx`, emitting every json-snippet | the build |
| `check-snippet-schema.mjs` | every snippet against the schema the descriptions declare | CI |
| `check-snippet-emission.mjs` | every fence emits on every platform, in both languages | CI |
| `snippet-runtime/run.mjs` | every fence loaded into chromium against the real renderer | CI |
| `check-snippet-exclusions.mjs` | no exclusion leaves a platform reading prose with no code | by hand |
| `check-snippet-casing.mjs` | a fence agrees with its sample about member casing | by hand |
| `check-snippet-code-channels.mjs` | a markup fence carries the code the markup could not say | by hand |
| `check-api-map-accuracy.mjs`, `resolve-api-links.mjs`, `fix-api-link-attrs.mjs` | API links | by hand |
| `review-platform-diff.mjs` | the published pages this branch changes, for one platform, as a diff | by hand |
| `lib/`, `platform-blocks.mjs` | shared by the above |  |
| `snippet-emitter/` | the emitter, bundled from the published packages | CI builds it |
| `ci/` | what the workflows call directly |  |

See [JSON-SNIPPETS.md](../JSON-SNIPPETS.md) for what a json-snippet is and how to author one, and
[API-TERMS.md](../API-TERMS.md) for how a backticked API name in prose becomes the reader's own
spelling.

## Reviewing what a change does to the pages

A topic is authored once and emitted per platform, so reading the source does not tell you what a
reader ends up with. `review-platform-diff.mjs` generates both sides — the branch and whatever it is
branched from — and diffs the output:

```
node scripts/review-platform-diff.mjs --platform=WebComponents --lang=en --html
```

It writes a summary, one `.diff` holding every hunk, a `lost-comments.json`, and with `--html` a page
with the whole review in it. `--baseline=` picks what to compare against (`origin/vnext` by default)
and `--reuse` skips regenerating when the output is already on disk.

Changes are separated by the judgement they need: **comment** for explanation the emitted page no
longer carries, **code** inside a fence, **prose** outside one. A topic whose only difference is its
`apiTerms` line is set aside as directive-only — without that, every topic differs and the ones that
matter are buried.

A removed line is not automatically a regression. The hand written per platform blocks had drifted,
and collapsing them to one definition corrected that by construction.

## Collapsing a topic into snippets

The tools that *do* the collapse — planning it, mirroring it into the Japanese copy, comparing what a
fence emits against the hand written blocks it replaces, and the one-shot migrations from the
docfx era — are not here. They are used once per component and never by the build, so they live with
the emitter they belong to:

```
dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike/collapse-tools/
```

That folder's README says what each one is. They read this checkout and several of them write it, so
they find it beside `dev-tools` or take `XPLAT_DOCS_ROOT`:

```sh
cd dev-tools/XPlatform/Main/Tests/XSharpTesting/SnippetEmitterSpike
XPLAT_DOCS_ROOT=/path/to/igniteui-docs-json node collapse-tools/plan-snippet-collapse.mjs --file=<topic>.mdx
```

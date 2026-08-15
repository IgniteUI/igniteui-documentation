# The snippet emitter, from the published packages

What turns a `json-snippet` fence into a platform's code is the product's own code generating
renderer. It ships in `igniteui-webcomponents-core`, so the checks in this repository do not need a
dev-tools checkout to run — which is what lets them run in CI.

    npm install && npm run build     # writes dist/snippet-api.cjs

What is here is the thin wrapper around the renderer: loading a code generation library from a
folder, emitting one snippet or a whole library, and generating the JSON schema the fences are
validated against. The renderer, the descriptions and the schema emitter all come from the package.

Two accommodations are worth knowing about:

  - `dom-shim.js` is loaded first, because the package's modules touch `window` and `document` as
    they load — they are Web Components, and one of them builds a lit template at module scope.
    Nothing renders here; the stub exists so the modules can evaluate.

  - `templates/webcomponents-template` mirrors the library project emitter's item templates, which
    are not published in any package. A library item is emitted through them. If a dev-tools
    checkout is present, the checks compare the two and say so when they differ; set
    `IG_ITEM_TEMPLATES` to use another copy.

A local dev-tools build still wins when one is present, so a change to the renderer can be tested
before it ships: see resolveSnippetApiPaths in ../lib/snippet-toolchain.mjs for the order.

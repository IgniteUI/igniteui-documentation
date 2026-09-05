# Loading every sample, with the real renderer

```
node run.mjs                       # the published packages
node run.mjs --filter=maps/geo-map # a subset
node run.mjs --limit=20 --headed   # a look, with a visible browser
node run.mjs --packages=<dir>      # a directory of locally built packages
node run.mjs --lang=en             # one locale instead of both
node run.mjs --sample=<file.json>  # one definition from a file, for cutting a failure down
node run.mjs --samples             # the examples repository's samples instead of the fences
```

`--sample=` is the one to reach for on a failure: copy the fence's JSON into a file, delete half, run
it again. That is how "animations never settled" on a two-chart fence turned out to be neither chart —
a definition whose holes are named after its components was waiting on a container this page had not
laid out. Whichever hole a definition names now gets one.

A sample passes when the renderer reports no errors, the browser throws nothing, and the renderer goes
idle, flushes, and settles its animations. Which definitions animate is inferred — the chart families
that animate on their own, plus anything asking for a transition — and `"hasAnimations"` on the
definition settles it either way. All four are the renderer's own signals, waited for in the
order the Web Components test host waits for them — see `harness.js` for why each one matters.

What the run reports besides pass and fail:

- **only in sequence** — the sample failed after another and passed on its own. That is state left
  behind by what ran before it, not a broken sample, and the fix is in the component or the renderer.
  It fails the run: state that leaks between samples leaks between pages.
- **not checked** — the sample binds to a library item that needs a package this harness does not
  install. The modern web grids version on their own line and are not what this documentation covers.
- **references that went unresolved** — neither the renderer nor the library had them. A property
  editor whose target sits in another container is the ordinary case and harmless.
- **values that are not members of the enumeration they were given to** — read as the first member, as
  the test host reads them, but counted here rather than swallowed.
- **what the page was holding** — after the first sample and after the last, with the biggest jumps.
  A page that stops answering is holding something it should have let go of; the run restarts it and
  says how often that happened.

The data and handlers come from the product's own library emission — `emitLibrary` in the snippet
emitter's api, which drives the same code generating renderer the library project emitter drives. The
emitted files are written to `generated/`, which is worth reading when a sample fails for want of
something.

`node_modules` and `generated` are both disposable.

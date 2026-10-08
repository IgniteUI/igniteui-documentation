# scripts/

Standalone dev utilities that live in `scripts/` (not `src/`) because they're
not part of the translate/validate/judge pipeline:

- [`estimate-cost`](#estimate-cost) — ballpark the USD cost of translating content (no API calls).
- `anchor-check` — do `[text](page.mdx#section)` links still resolve after their
  headings were translated? Slugs headings with the same `github-slugger` the
  docs build uses. `--config <path> [--locale <code>]`, or `--source <en-dir>
--target <translated-dir>` for any pair of trees. Exit 2 if an anchor is
  broken. Background in `NATIVE-REVIEW-LEARNINGS.md` §4.
- `exchange-pending` — what an `exchange` provider (`src/providers/exchange.ts`)
  is waiting on: every prompt whose latest attempt has no answer file yet, with
  the prompt and answer paths. `--dir <exchange dir> [--all]`.
- `identity-check` / `roundtrip-report` — engine-only round-trip audits, see the
  headers of the scripts and `REMARK-MDX-MIGRATION.md`.

---

# estimate-cost

A standalone, config-free script that estimates the USD cost of translating a
file or a folder of content with a given LLM. It does **not** call any API,
does **not** read this project's `configs/*.mjs`, and has no dependency on
the rest of `translate-engine` — you can point it at any folder on your
machine, not just this repo's content.

It lives in `scripts/` (not `src/`) specifically because it's a dev utility,
not part of the translation pipeline itself.

## Usage

```bash
npx tsx scripts/estimate-cost.ts --path <file-or-folder> --model <name> [options]

# or, via the package.json script:
npm run estimate-cost -- --path <file-or-folder> --model <name>
```

`--path` accepts either:

- **A single file** — estimates just that file.
- **A folder** — walks it recursively through every level of subfolders and
  estimates the combined total. No glob syntax needed; every file matching
  `--ext` under that folder (at any depth) is included automatically.

### Examples

```bash
# One file
npx tsx scripts/estimate-cost.ts --path ./docs/en/components/grid.mdx --model gpt-5.5

# An entire content tree, nested folders included
npx tsx scripts/estimate-cost.ts --path ./docs/en --model claude-sonnet-5

# See the per-file breakdown, not just the total
npx tsx scripts/estimate-cost.ts --path ./docs/en --model gemini-3.1-pro --list

# A model/rate this script doesn't know about yet
npx tsx scripts/estimate-cost.ts --path ./docs/en --rate-input 2.50 --rate-output 10.00

# Only .txt files, skip .md/.mdx
npx tsx scripts/estimate-cost.ts --path ./notes --model gpt-4.1 --ext .txt
```

## All options

| Flag                 | Required                                          | Default    | Meaning                                                                                      |
| -------------------- | ------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| `--path <p>`         | **yes**                                           | —          | A file or a folder (recursed at any depth).                                                  |
| `--model <name>`     | one of `--model` / `--rate-input`+`--rate-output` | —          | A key from the `MODEL_RATES` table in the script (see below).                                |
| `--rate-input <n>`   |                                                   | —          | USD per 1M input tokens. Overrides/bypasses `--model` when paired with `--rate-output`.      |
| `--rate-output <n>`  |                                                   | —          | USD per 1M output tokens. Same pairing rule as above.                                        |
| `--ext <.md,.mdx>`   |                                                   | `.md,.mdx` | Comma-separated, case-insensitive extension list to include.                                 |
| `--output-ratio <n>` |                                                   | `0.8`      | Estimated output tokens as a fraction of input tokens — see "Why output-ratio exists" below. |
| `--list`             |                                                   | off        | Print every matched file's own chars/words/tokens before the total.                          |
| `--help`             |                                                   |            | Print usage and the current `MODEL_RATES` table.                                             |

Run `--help` any time to see the live list of known models and their rates —
that list comes straight from the script's source, so it can never drift out
of sync with what the tool actually uses.

## How the estimate works

1. Every matched file is read and measured: character count and word count
   (`content.length` and a whitespace split).
2. Input tokens per file = `chars / 4`, rounded up — this is OpenAI's own
   stated rule of thumb for English text ("~4 characters per token"). It's a
   heuristic, not a real tokenizer (no vendor's actual BPE/tokenizer library
   is used), but it's close enough for a ballpark and needs zero dependencies.
3. Output tokens = `input tokens × --output-ratio`.
4. Cost = `(input tokens / 1,000,000) × rate.input + (output tokens / 1,000,000) × rate.output`.

### Why `--output-ratio` exists

Translated output is rarely the same length as the input for two reasons:

- The **source** file includes code blocks, frontmatter, and markup that get
  masked to short placeholder tokens before a real translation call — so the
  content a model actually sees is smaller than the raw file.
- Different **target languages** expand or compress relative to English
  (Spanish/German prose tends to run longer; Japanese/Korean can run shorter
  per character, though CJK tokenizers count differently in the first place).

The default `0.8` was picked by cross-checking this scaling ratio against a
real content estimate (~1.3M input / ~1M output tokens for the Angular docs — a
ratio of ~0.77). Adjust it per target language/content mix rather than trusting
the default blindly:

- Lower it (e.g. `0.5`–`0.6`) for code-heavy docs (most of the "file" is
  protected code that isn't re-translated) or for CJK targets.
- Raise it (e.g. `1.1`–`1.2`) for prose-heavy content translated into a
  language that tends to expand (German, Spanish, French).

## Updating / extending the script

Everything you'd want to change lives in the first ~30 lines of
`estimate-cost.ts`:

**Add or correct a model's pricing** — edit the `MODEL_RATES` object:

```ts
const MODEL_RATES: Record<string, { input: number; output: number }> = {
  'gpt-5.5': { input: 5.0, output: 30.0 },
  // add a new one the same way:
  'my-new-model': { input: 1.25, output: 6.0 },
};
```

Values are USD per 1,000,000 tokens. This table is a hand-maintained
snapshot, not a live feed — when a vendor changes pricing, update the number
here. There's no automated check that it's still current (same caveat as
`src/cost.ts` had before it was removed from the main toolkit).

**Change which files count by default** — edit `DEFAULT_EXTENSIONS`:

```ts
const DEFAULT_EXTENSIONS = ['.md', '.mdx'];
```

**Change the token heuristic** — edit `CHARS_PER_TOKEN` (default `4`) or
replace `estimateTokens()` entirely if you want to wire in a real tokenizer
library instead of the chars/4 approximation. That's the only function that
would need to change; everything else (file walking, cost math, CLI parsing)
is independent of how a single file's token count is computed.

**Change the default output-ratio** — edit the fallback in `main()`:

```ts
const outputRatio = values['output-ratio'] ? Number(values['output-ratio']) : 0.8;
```

## What this script is _not_

- It does not call any provider's API — nothing here costs money to run.
- It is not wired into `src/cli.ts` or any project config — it doesn't know
  about `protectPatterns`, `doNotTranslate`, glossaries, or anything else
  that affects what a _real_ `translate` run would actually send to a model.
- It is a planning tool for "roughly how much would this cost," not a quote.
  Always verify against your provider's real usage dashboard after an actual
  run.

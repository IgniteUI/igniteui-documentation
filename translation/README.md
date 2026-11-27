# translation/

What [IgniteUI/translation-tools](https://github.com/IgniteUI/translation-tools) needs to keep the
translated docs in step with the English. The tool translates only the words: everything else in
a page (markup, components, `<PlatformBlock>` / `<ComponentBlock>` tags, `{Tokens}`, code, links,
frontmatter keys) is the English file's. It runs once per project and language with
`--docs <folder> --locale <locale>`.

| Language | `--locale` | Content folder (`--docs`) | Projects | Glossary | Memory, manifests, scope |
|---|---|---|---|---|---|
| Japanese | `ja` | `jp` | `docs/angular`, `docs/xplat` | `docs/translation/jp-component-names.md` | `memory/ja.json` (fixes `memory/ja.human.json`), `manifest/ja/<project>/`, `scope/ja.json` |
| Spanish | `es` | `es` | `docs/angular`, `docs/xplat` | none | `memory/es.json`, `manifest/es/<project>/`, `scope/es.json` |
| Brazilian Portuguese | `pt-BR` | `pt-BR` | `docs/angular`, `docs/xplat` | none | `memory/pt-BR.json`, `manifest/pt-BR/<project>/`, `scope/pt-BR.json` |
| Korean | `ko` | `kr` | `docs/angular`, `docs/xplat` | none | `memory/ko.json`, `manifest/ko/<project>/`, `scope/ko.json` |

A language runs for a project only when the project has its content folder
(`docs/<project>/src/content/<folder>/`) **and** its manifests (`translation/manifest/<locale>/<project>/`):
all four languages have both for both projects. A project added later starts by itself once
someone seeds it ([Adding a language or a project](#adding-a-language-or-a-project)).

**Status: set up, not running.** The Japanese memory and manifests were taken from the existing
Japanese pages; the Spanish, Brazilian Portuguese and Korean pages were first translated with the
tool (`--export`, agents, `--import`, then `--engine agent`). The workflows are in place but
switched off until an admin sets them up ([Setting it up](#setting-it-up-admin)); until the
[switch-over](#switching-over-from-the-sync-jp-docs--workflows), the `sync-jp-docs-*` workflows
still do the Japanese work.

## How it works

Two flows. Spanish, Brazilian Portuguese and Korean are translated **inside each English pull
request**, before it merges, as on the marketing sites (Marketing-Infragistics' `translate-pr.yml`).
Japanese is translated **after** the English merges, in its own pull request, which the Japanese
team reviews.

```
English pull request into vnext (it changes docs/<project>/src/content/en/**)
        │
        ├─► Translate (es, pt-BR, ko)  (.github/workflows/translate-docs-pr.yml)
        │     translation-tools at a pinned commit; the changed sentences to the model, the rest
        │     from memory; commits the es/, pt-BR/, kr/ pages and their translation/ files to THE
        │     SAME pull request, as the Cross-Org-GitHub-App, and comments what it did
        │   checks on the pull request: "Translations up to date (es, pt-BR, ko)"
        │   (check-jp-translation.yml) and "CI (docs translations)" (ci-jp.yml: builds each
        │   language site the commit changed)
        ▼
merge into vnext: English, Spanish, Portuguese and Korean together
        │
        ▼
Translate docs (Japanese)  (.github/workflows/translate-jp-docs.yml)
        │
        ▼
branch translations/ja ──► ONE pull request into vnext, updated by every run:
        │   "[jp-sync] Japanese translation of English changes"  (labels translation, japanese, automation)
        ├─ the Japanese team: edit pages in GitHub, or in the Translation Manager (its saves are commits
        │  on the same branch; corrections go to memory/ja.human.json)
        │  checks: "Japanese up to date" (check-jp-translation.yml), "CI (docs translations)"
        ▼
merge into vnext ──► the sites deploy as today (Japanese: cd-angular-jp.yml, cd-xplat-jp.yml)
```

### Spanish, Brazilian Portuguese and Korean: in the English pull request

- **When:** a pull request into `vnext` from a branch of this repo, not a draft, that changes
  English content. Every push to it runs again; only what is still untranslated goes to the model,
  so the bot's own commit re-runs it and finds nothing to do.
- **What it commits:** only the three languages' content folders and their memory and manifests
  (`memory/<locale>.json`, `memory/<locale>.human.json`, `manifest/<locale>/`); anything else stops
  the run. A page deleted in English is deleted in each language, with its manifest.
- **Nothing to review:** the comment lists what was translated. A translated page someone edited by
  hand is not changed (listed under *Needs a person*), and *Translations up to date* fails until its
  English change is carried over.
- **Two open pull requests** that both add sentences can conflict on `memory/<locale>.json`: take
  either side (or both), the next run fills in whatever is missing.
- **Safety:** `pull_request_target` runs `vnext`'s copy of the workflow; the pull request is
  read as files. The one file of this repo the tool executes,
  `docs/angular/src/scripts/grid-configs.mjs`, is replaced by `vnext`'s copy before the tool runs
  and is never committed.

### Japanese: its own pull request

- **A run** first brings `translations/<locale>` up to date with `vnext` (a merge; the memory files
  merge by sentence with the tool's `merge-memory.mjs`, both sides kept). Any other conflict stops
  that language's run with a comment on its pull request: merge `vnext` into the branch by hand, then
  run it again. With no open pull request, the branch starts again from `vnext`.
- It translates every page of the project that is out of date (not only the push's), deletes the
  translated page and manifest of an English page that was deleted, commits as the
  Cross-Org-GitHub-App, and opens or updates the language's pull request. Its body and a comment
  list the pages translated, the pages that need a person (a translated page edited by hand whose
  English changed: never overwritten, the English diff is shown), the pages removed, the `#anchor`
  links and `llms.description` answers that could not be made right, and the English commits behind
  the pages, with their authors.
- **A commit** of the run may change only its language's content folder
  (`docs/*/src/content/<folder>/`) and that language's own files in `translation/`
  (`memory/<locale>.json`, `memory/<locale>.human.json`, `manifest/<locale>/`, `scope/<locale>.json`,
  `reports/<locale>-*`), and a run stops if the branch changes anything else: English and code
  changes, and another language's pages or memory, go through their own pull requests. So merging a
  translation pull request never starts a run (it touches no `en/`), and the run never executes
  code that is not on `vnext`.
- **On the pull request:** *&lt;Language&gt; up to date* (*Japanese up to date*, *Spanish up to
  date*, …: `check-jp-translation.yml`, the tool's `--check`: every page of that language is the
  translation of the current English, or a person's edit of one), *CI (docs translations)*
  (`ci-jp.yml`: the build of the sites the change reaches, in the pull request's language; a
  language's xplat topics ship on its Angular site too, so an xplat change builds both), and the checks every pull request already has:
  `npm run check:llms-metadata` (English and Japanese, `lint.yml`) and the relative links
  (`check-relative-links.yml`, which generates the Japanese too). On a `translations/*` branch
  both checks find the language from the branch name.
- **A page someone edited** keeps the edit. When its English changes, the run lists it under
  *Needs a person* and the language's *up to date* check fails until the change is carried over: in
  the Translation Manager (a save records the page as the translation of the current English), or
  with a run in `pages` mode for that page (redone from memory and the model: the edit is replaced,
  so keep what should stay as a correction in `memory/<locale>.human.json`). Re-adopting a single
  page is not a fix: `--adopt` recounts the memory's wordings, and on one page it would skew them.
- **By hand** (Actions → *Translate docs (Japanese)* → Run workflow): the languages (`ja`, the
  default; `es`, `pt-BR`, `ko` only to catch up, e.g. after an English change that reached `vnext`
  without its translation: that opens a one-off `translations/<locale>` pull request), space- or
  comma-separated, or `all`; both projects or one; mode
  `out-of-date` (everything out of date), `dry-run` (the report only: no model, no push), or `pages`
  (redo the listed English files, `docs/<project>/src/content/en/…`, comma-separated, in each
  language picked: a person's edits on them are replaced).

## What is here

| Path | What |
|---|---|
| `memory/ja.json` | Every Japanese sentence, by its English, shared by both projects. Reused wherever that English appears, so an English edit costs only its changed sentences |
| `memory/ja.human.json` | People's corrections, `{ "entries": { "<English>": "<translation>" } }`. Win over the model. Not there until someone adds one |
| `manifest/ja/<project>/<English path>.json` | One per Japanese page (and per `toc.json`): the hash of the English it matches and of the Japanese file. A Japanese page whose hash changed was edited by a person and is **never overwritten** |
| `scope/ja.json` | English pages Japanese does not take (picomatch globs, paths as `en/components/x.mdx`): none today (`{"exclude": []}`); every English page is translated, so each language has the same pages as English |
| `reports/ja-conflicts.json` | English sentences the reviewed pages translate in more than one way: the wording in memory (the one most pages use) and the others, with their pages. Settle one with a fix in `memory/ja.human.json` |
| `reports/ja-block-structure.json` | Where a Japanese page's `<PlatformBlock>` / `<ComponentBlock>` structure is behind the English: English blocks with no Japanese counterpart (the next run translates them), Japanese blocks the English no longer has |
| `memory/es.json`, `memory/pt-BR.json`, `memory/ko.json` | The same for Spanish, Brazilian Portuguese and Korean, from their first translation (agents, `agent@2`); corrections in `memory/<locale>.human.json` once someone adds one |
| `manifest/<locale>/angular/…` | One per translated Angular page and `toc.json`, as for Japanese (190 each) |
| `scope/es.json`, `scope/pt-BR.json`, `scope/ko.json` | As `scope/ja.json`: nothing is left out |

Each language's pull request may change only its own files here (see [How it works](#how-it-works)).

Not read for Japanese: the Japanese-only `jp/components/themes.mdx` and
`jp/components/charts/features/chart-legends.mdx` (Angular), and Angular's `jp/toc.json`.
`docs/angular/src/content/kr/`, once a legacy folder, is now the Korean (`ko`) translation's.

## How the existing Japanese was taken over

On 20 Nov 2026 (English at `4e18730b8`, after the structural fixes to the Japanese pages made the same day), every Japanese page was adopted (`--adopt`) as the
translation of today's English: the reviewed pages stay as they are, and their sentences seed
the memory as the site's own wording (`site@1`).

| | Angular | xplat |
|---|---|---|
| Pages adopted | 189 | 302 |
| Pages whose whole body lines up with the English, section for section | 97 | 217 |
| Sections (from heading to heading) that line up | 2,065 of 2,214 | 3,513 of 3,638 |
| Sentences added to memory (toc names included) | 7,269 | 11,630 |
| `toc.json` names recorded | 406 | 401 |

18,899 sentences in all. Pairing is strict: frontmatter by field (one set per grid in a
`grids_templates` file), the body section by section, and only where both sides have the same
kinds of strings in the same order and the same markup; every pair passes the tool's answer
checks, which for the docs include the glossary's readings (a component name in English or its
reading, not a third wording; "English (reading)" not in a lower heading, a table cell or a prop).
A section that does not line up gives nothing. Where the same English has several Japanese
wordings, the memory takes the one most pages use (a tie: the first read, Angular before xplat)
across both projects, so the result does not depend on the order of the runs: 971 such
sentences, listed in `reports/ja-conflicts.json`. Rebuilding from scratch (delete `memory/` and
`manifest/`, adopt Angular then xplat) gives the same files byte for byte.

Five pages kept half or more of their English sentences in English; they are adopted as they
are, for a person to finish: Angular `general-breaking-changes-dv`, `icon-button`, `input-group`,
`grids_templates/batch-editing`; xplat `grids/_shared/column-pinning`.

## What a run does to a page whose English changed

The page is rebuilt from the English file with the translations spliced in. Unchanged sentences
keep their wording from memory; changed and new ones go to the model. The page then gets
`_language: ja`, the Japanese DocsAside labels (情報, 警告), and its `#anchor` links are
rewritten to the translated headings, per platform and per grid as the site builds the page
(`#{PlatformLower}-…` where the anchor differs by platform); the links that cannot be made right
for every page are listed with their lines. A page whose `llms.description` would fail
`npm run check:llms-metadata` is not written. On a
page whose body did not line up, the first English change retranslates the parts memory does
not have.

## Running it by hand

From this repo's root, with translation-tools checked out next to it (`npm ci` there):

```bash
# what a run would do, no model, no writes (one per project): the workflow's command with --dry-run
node ../translation-tools/translate.mjs --en docs/angular --out docs/angular/src/content \
  --docs jp --locale ja --source en --scope translation/scope/ja.json \
  --memory translation/memory/ja.json --fixes translation/memory/ja.human.json \
  --manifest-dir translation/manifest/ja/angular \
  --glossary docs/translation/jp-component-names.md --dry-run
# xplat: the same with docs/xplat and translation/manifest/ja/xplat
# for real: --engine bedrock (AWS credentials in the environment), --model <id> to pick the model
```

Another language: the same command with its `--docs <folder> --locale <locale>`, its own
`translation/scope/<locale>.json`, `translation/memory/<locale>.json`,
`translation/memory/<locale>.human.json` and `translation/manifest/<locale>/<project>`, and no
`--glossary` (Japanese only). Spanish, for example:

```bash
node ../translation-tools/translate.mjs --en docs/angular --out docs/angular/src/content \
  --docs es --locale es --source en --scope translation/scope/es.json \
  --memory translation/memory/es.json --fixes translation/memory/es.human.json \
  --manifest-dir translation/manifest/es/angular --dry-run
# Brazilian Portuguese: --docs pt-BR --locale pt-BR; Korean: --docs kr --locale ko
```

`--check` instead of `--dry-run` exits 1 when a page is not translated for the current English (the
*&lt;Language&gt; up to date* check). Both also count the anchors the pages to translate would get
rewritten or could not resolve.

To adopt again (after people change Japanese pages outside the tool, say): delete `memory/` and
`manifest/`, then run the commands above with `--adopt` in place of `--dry-run`, Angular first.
Always both projects, from scratch: the result is then the same bytes whatever the order of
earlier runs. Run from a checkout with LF line endings: the manifests hash the bytes on disk.

To merge `vnext` into `translations/<locale>` by hand (a run stopped on a conflict), let the memory
files merge as the workflow merges them, in your checkout only:

```bash
git config merge.translation-memory.driver "node ../translation-tools/merge-memory.mjs %O %A %B"
echo 'translation/memory/*.json merge=translation-memory' >> .git/info/attributes
git checkout translations/ja && git merge origin/vnext   # (or translations/es, …) settle the other files, then push
```

## Adding a language or a project

**A project for a language that already runs**: seed it as below, with
`--en docs/xplat --out docs/xplat/src/content` and `translation/manifest/<locale>/xplat`, and merge
the pages and manifests (in a pull request of their own, or on the language's translation branch:
both are within what that branch may change). From then on the workflows run that project for the
language by themselves: a language runs for a project as soon as both
`docs/<project>/src/content/<folder>/` and `translation/manifest/<locale>/<project>/` exist on
`vnext`. The project also needs its build scripts for the language
(`docs/xplat/package.json` has a `:jp`, `:es`, `:pt-br` and `:kr` copy of every script).

**The first translation** of a project into a language is done once, by hand, with Claude Code
agents (`--engine agent`), as Spanish, Brazilian Portuguese and Korean were. From this repo's root,
with translation-tools next to it, the same command as above with the language's
`--docs`/`--locale` (Spanish, Angular, for example):

```bash
T="node ../translation-tools/translate.mjs --en docs/angular --out docs/angular/src/content \
  --docs es --locale es --source en --scope translation/scope/es.json \
  --memory translation/memory/es.json --manifest-dir translation/manifest/es/angular --engine agent"
$T --export ../es-chunks     # 1. every string to translate, as chunk-NN.json plus INSTRUCTIONS.md
                             # 2. agents translate each chunk into chunk-NN.out.json
$T --import ../es-chunks     # 3. each answer checked like a model's; refused ones in rejected.json
$T                           # 4. writes the pages and manifests from memory (no model)
$T --check                   # nothing left to translate
```

`translation/scope/<locale>.json` is written first (a copy of `scope/ja.json`). A string with no
accepted answer stays in English and is listed. Then build the language
(`npm run build:es --prefix docs/angular`) before the pull request.

**A new language**: every place that names one. Copy what `pt-BR` has in each
(`grep -rn "pt-BR\|pt-br"` outside the content finds them all):

| Where | What to add |
|---|---|
| `src/platform.ts` | the folder in `NavLang`, its language tag in `LANGUAGE_TAGS` (`<html lang>`, structured data) |
| `src/llms.ts` | the language's llms.txt strings |
| `docs/angular/astro.config.ts`, `docs/xplat/astro.config.ts` | the site description; xplat also the "Overview" name |
| `docs/angular/package.json`, `docs/xplat/package.json`, root `package.json` | a copy of every `:jp` script with the language's suffix |
| `src/integration.ts` | `CHROME_LOCALE`, if the marketing site has a header and footer in that language, and its snapshots in `ig-chrome/<staging\|production>-<locale>/` (README, *Header and footer*) |
| `translation/scope/<locale>.json` | a copy of `scope/ja.json` |
| `scripts/check-relative-links.mjs` | the folder in `LANGUAGES` |
| `check-relative-links.yml` | the language in the *Generate* steps (`xplat:generate:<l>`, `generate:<l>`, the xplat `generate:<platform>:<l>`) |
| `cspell.json` | `docs/*/src/content/<folder>/**` in `ignorePaths`, for a language in Latin script (the spellcheck is English) |
| `docs/angular/src/content/<folder>/.gitignore` | a copy of `en/.gitignore` (the generated grid topics are build output) |
| `translate-docs-pr.yml` (translated in the English pull request) | `LANGUAGES` (`<locale>:<folder>`); the job's name |
| `translate-jp-docs.yml` (its own reviewed pull request, as Japanese) | the `languages` allow-list and *The language* step |
| `check-jp-translation.yml` | `LANGUAGES` of the *in-pull-request* job, or the branch table for its own pull request |
| `ci-jp.yml` | the branch table, the folder list, `paths` and the script suffix |
| `cd-angular-en.yml`, `cd-xplat-en.yml`, `cd-angular-jp.yml`, `cd-xplat-jp.yml` | `**/<folder>/**` in `paths-ignore`, so a translation merge does not redeploy English or Japanese |

Changing the workflows is a change to `.github/workflows/`, reviewed like any other. A language
has no deploy workflow of its own yet: `_cd-deploy.yml` and `IgniteUI/igniteui-actions` know `en`
and `jp` only.

## Setting it up (admin)

1. **AWS:** a role that can only invoke Claude on Bedrock, trusting this repo's GitHub OIDC for
   the `intl-translate` environment (as `jp-translate-gha` does for the JP marketing site). The
   docs repo is in the IgniteUI organization: the trust policy names
   `repo:IgniteUI/igniteui-documentation:environment:intl-translate`.
2. **GitHub App:** the Cross-Org-GitHub-App installed on this repo (contents and pull requests:
   write; it pushes the Spanish, Portuguese and Korean translations to each English pull
   request's branch, and `translations/ja`, so the pull requests' checks run) and on
   IgniteUI/translation-tools (contents: read; private, the workflows check it out). Steps:
   translation-tools `github-app/README.md`.
3. **Environment** `intl-translate`, deployment branches: `vnext` only, holding the variables
   `AWS_TRANSLATE_ROLE_ARN` and `TRANSLATE_APP_ID` and the secret `TRANSLATE_APP_KEY`.
   *Translate (es, pt-BR, ko)* and the *up to date* checks run on `pull_request_target`, whose ref is
   `vnext`, so they can use it; nothing else can.
4. **`TOOLS_REF`** in `translate-docs-pr.yml`, `translate-jp-docs.yml` and
   `check-jp-translation.yml`: the full SHA of the translation-tools commit to run (the merge commit
   of the pull request that adds `--docs` and `merge-memory.mjs`), the same in all three, in a pull
   request here. Until then they stop at their first step.
5. **Labels** `translation`, `japanese` and `automation` exist already. (`spanish`, `portuguese`,
   `korean` are only needed for a catch-up pull request run by hand; one whose label is missing is
   opened unlabelled, with a warning.)
6. **Switch over** (below), then the repository variable `TRANSLATE_ENABLED` = `true` (it turns on
   every language at once). Optional repository variables: `BEDROCK_MODEL` (default
   `global.anthropic.claude-haiku-5-5`), `TRANSLATE_MAX_TOKENS` (per project per language per run,
   default 3,000,000).
7. After a few good runs, make *Translations up to date (es, pt-BR, ko)* a required check for pull
   requests into `vnext` (an English change cannot merge without its Spanish, Portuguese and Korean),
   and *Japanese up to date* and the *CI (docs translations)* builds required too.

## Switching over from the sync-jp-docs-* workflows

The old and the new flow must never run together: both start on the same English push, and two
pull requests would rewrite the same Japanese pages.

1. Disable the two gh-aw workflows (Actions → *Sync Japanese Documentation (Angular)* and
   *(xplat)* → Disable workflow, or
   `gh workflow disable sync-jp-docs-angular.lock.yml` and `gh workflow disable sync-jp-docs-xplat.lock.yml`).
   Keep their files until the new flow is proven; `.github/workflows/*.md` and `*.lock.yml` are
   deleted together later (`gh aw` compiles one from the other).
2. Merge or close every open `[jp-sync]` pull request, so `vnext` holds all the Japanese there will be.
3. Adopt again, from scratch, on `vnext` as it now is (above: delete `memory/` and `manifest/`, run
   `--adopt` for Angular, then xplat, from a checkout with LF line endings), and merge that in a
   pull request. Every Japanese page merged since 20 Nov 2026 is then recorded as the translation of
   today's English; without it, each would count as edited by a person.
4. Set `TRANSLATE_ENABLED` = `true`, then run *Translate docs (Japanese)* by hand in `dry-run` mode
   (`all` languages): it should report nothing out of date. From then on, every English pull request
   gets its Spanish, Portuguese and Korean in it, and every English merge updates the
   `translations/ja` pull request.
5. Change the Japanese line in `AGENTS.md` and the localization paragraph of
   `.github/CONTRIBUTING.md` to describe the new flow only.

To go back: set `TRANSLATE_ENABLED` to `false` and enable the two gh-aw workflows again.

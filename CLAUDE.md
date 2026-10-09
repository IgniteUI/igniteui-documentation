## Translation

This repository carries a vendored translation engine (`tools/translate-engine/`) and four Claude
Code skills that drive it: `/translate`, `/translate-all`, `/retranslate`, `/translate-list`. The
author workflow is in [`TRANSLATION.md`](TRANSLATION.md); to change or debug the engine, start at
[`tools/translate-engine/CLAUDE.md`](tools/translate-engine/CLAUDE.md).

- Translations are machine-produced files under `docs/*/src/content/<locale>/` that mirror `en/`
  page for page.
- Never edit an EN page to fix a translation.
- The glossary, `docs/translation/glossary.json`, is owned by the localization team.

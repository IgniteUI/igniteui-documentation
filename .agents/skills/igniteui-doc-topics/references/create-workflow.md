# Create workflow

Version: v8 · 2026-11-20 · igniteui doc-skill set. Restructured out of SKILL.md v2 so the workflow can evolve without touching the router; steps 2, 3 and 6 changed in v8 (see `.agents/CHANGELOG.md`). Blueprints, mechanics, and the frontmatter contract live in `house-style.md`; run the rubric self-check from `audit-rubric.md` before delivering.

## Steps

1. **Classify** (Step 0 in SKILL.md). Name the topic type.
2. **Pick the doc set & framework.** A component topic written to this standard goes in the xplat
   set: one file for Angular/React/WC/Blazor (and WinUI/Uno where the topic ships for them) using
   `{Platform}`/`{ProductName}` tokens and `<PlatformBlock for="…">`, with the Angular content in
   `<PlatformBlock for="Angular">`. Most Angular component topics still sit in the Angular tree;
   rewriting one to the standard is what moves it — write it in the xplat tree and, in the same
   change, delete the old Angular `.mdx`, repoint every link to it, update both `toc.json` files,
   and run the relative-link check (the four steps in house-style → "Two doc sets"). A small fix
   to a topic that is not being rewritten stays in its Angular file. A topic with no xplat
   counterpart, and none planned, is written in the Angular set: its own file, plain prose, no
   tokens.
3. **Follow the verification workflow** in `house-style.md` before writing technical content.
   Existing snippets and old prose are clues, not authority. For component topics, also inspect the
   matching Indigo.Design component documentation under
   `https://www.infragistics.com/products/indigo-design/help/components/` and use its component
   structure as input for Usage subsection suggestions.
  For FAQ questions, build the question inventory defined in `house-style.md` → "FAQ
  question-generation contract", including its public web search; use web results for wording and
  intent discovery only, then verify every answer against official API/source documentation.
  For the Accessibility section, inspect the component template/render method and typed source
  first. The repositories and folders are listed in house-style → "Verification workflow", step 4;
  read the `igc` source and the Angular source separately. Extract rendered native elements,
  `role`, `aria-*` attributes, focus and disabled conditions, and validation/selection state
  mapping. Read keyboard and pointer event handlers to
  derive interaction and state-change facts. Use the API registry to verify public property and
  event names. Generate platform-specific differences with `<PlatformBlock>`, and mark unresolved
  facts with `‹VERIFY: source fact needed›` rather than inferring them from generic HTML behavior.
4. **Scaffold frontmatter** — the metadata contract lives in `house-style.md` → "File format &
   frontmatter"; this step orders the work, it does not restate the rules. Apply the contract to
   every topic type, including category/index topics.
   - **First, for an xplat topic:** `platformType`, which is required and has no default — a topic
     without it does not build, and it decides the standard the rest of the work is held to. `xplat`
     for the DV set, `xplat-unmapped` where its API cannot be resolved, `web-only` for a topic that
     ships for the web platforms and no further. It also settles `apiTerms`, which is then stated only
     to differ. See house-style → "File format & frontmatter".
   - **Before the body (fixed by convention):** `title` (xplat component topics use
     `"{Platform} ‹Component› Component"`; xplat category/index topics use a concise, framework-neutral category
     name without `{Platform}` or `{ProductName}` tokens, for example `title: "Grids and Tables"`;
     Angular topics follow the title rule in the frontmatter skill), `license`, `last_updated`
     (maintained by the topic workflow; the site layout renders it), and `tableOfContents` when used.
   - **After the body is finished — generated from it, never from imagination:** `description`,
     `llms.description`, `keywords`, `mentionedTypes` (xplat), and `relatedComponents` (component
     topics with close siblings only). Then run the companion `igniteui-topic-frontmatter` skill's
     cross-field consistency and body-support checks before delivery.
5. **Lay out the canonical sections** in order for that topic type, required ones always present.
   Feature-specific content goes as sub-headings under **Usage**, never as new top-level sections.
6. **Fill each section in its mode**, in six passes:
   - **6a — Leads and modes.** Lead every section with one plain, specific sentence that names the
     component (and platform token where the set uses them). Keep each section in its assigned mode;
     put reference content in tables, writing each Properties / Methods / Events row by hand and
     checking its name, type, default, and description through the verification workflow for every
     platform the row is shown for (house-style → "Reference-table contract"). Phrase Troubleshooting as the
     reader's real questions.
   - **6b — Usage coverage.** Add property-focused sub-sections so every public input is shown with
     a minimal snippet; group only tightly coupled properties that form one behavior. Keep existing
     useful subsections, then compare against Indigo.Design's component sections by meaning, not by
     exact heading name, to suggest or add any missing runtime-relevant Usage subsections.
   - **6c — Do/Don't.** End **Usage** with `### Do/Don't`: one short guidance paragraph, then one
     shared Astro `DoDont` block for each do/don't pair of the matching Indigo.Design guidance, with
     both images, both alt texts, and both slot sentences — or a `{/* TODO */}` marker when the
     images are not available. Put the better-fit sibling in **Related Components**, not here
     (house-style → "Do/Don't contract").
   - **6d — Required components.** Add a required `## Live Demo` section holding exactly one top
     `<Sample>` per platform and no text, then Usage samples for distinct tasks and property behaviors — no
     cap on their number, but each must show something no other sample on the page shows. For
     samples, use the shared Astro `Sample` component and verify its `src`, display props, and
     descriptive `alt`, starting from the three shapes in house-style → "`<Sample>`
     configuration". For Anatomy, import and use the shared Astro `Anatomy` component with a
     verified anatomy image and alt text, then the numbered legend of the labelled parts, then the
     verified DOM tree or skeleton for each platform family (house-style → "Anatomy —
     sub-structure"). Add each image once under `docs/xplat/src/assets/images/` and import it
     through `@xplat-images`; no copy goes in the Angular tree. For FAQ
     content, import and use the shared Astro `Faq` and `FaqItem` components. In slot mode, set
     `indicatorPosition="end"` on every `FaqItem`, because the value on `Faq` does not flow into
     slotted children. When auditing, flag plain FAQ headings or custom accordion markup and convert
     each question/answer pair to an `FaqItem` while keeping the answer concise and
     component-specific. Select 3–6 questions from the inventory built in step 3, following the
     selection rules in the FAQ question-generation contract. Keep each answer 2–4 self-contained
     sentences; do not copy Troubleshooting or Usage steps verbatim.
   - **6e — Required and content-driven sections check.** Include the required **Related
     Components** and **FAQ** sections in their canonical positions. Decide three parts on
     evidence, not habit: `### Prerequisites and Version Compatibility` under **Getting Started**,
     `## Troubleshooting`, and **Known Limitations** are added only when verification turned up
     something the reader needs — a version or package constraint, a real gotcha with a cause and a
     fix, a verified limitation. With nothing to say, omit the heading; never write a placeholder
     sentence or a generic entry to keep it. A verified
     `### Known Limitations` subsection may live inside `## Troubleshooting` when the limitations
     are directly related to the troubleshooting guidance; do not duplicate it as a separate
     top-level section.
   - **6f — Compliance index row.** Update the component's row in
     `interactivity/accessibility-compliance.mdx` → **Component Support**, in each platform table
     the component appears in, so its status and link match the **Accessibility** section you
     wrote (house-style → "Compliance index row").
7. **Self-check against the rubric** (`audit-rubric.md`) before presenting — especially mode-bleed
   (C-checks) and metadata (D-checks). Fix, then deliver the `.mdx`.

## Category/index topics use a separate structure

Do not apply the component-topic blueprint to a category or index page. A category overview is a
reference/navigation map, not a composite component page. Its structure is:

Apply the common metadata contract to category/index topics as well. Their frontmatter must include
`title`, `description`, `keywords`, `license`, `last_updated`, `llms.description`, and
`mentionedTypes` when the xplat category references generated API types. The category `title` is
the plain category name only, without `{Platform}` or `{ProductName}` tokens; for example,
`title: "Grids and Tables"`. Keep platform and product tokens in the description, keywords, visible
heading, and prose where they are needed. Do not render `last_updated` as visible MDX text.

1. `#` title followed by a concise introductory block: a clear category definition and, when needed,
   brief context about its scope or purpose.
2. `## Key Features` immediately after the title and introductory block. Open with a short sentence, then present
   the category's capabilities in a compact table with `Feature`, `Description`, and `Benefits`
   columns when the content is naturally scannable. Use `## Types` or `## Members` as a top-level
   navigation section when the category maps component types. Make `Types` the parent navigation
   section and make each
   concrete type, such as `{Platform} Data Grid`, `{Platform} List`, or `{Platform} Tree Grid`, a
   separate navigable `###` subsection beneath it. Include a verified `<Sample>` for every type
   entry, together with a concise definition and verified link. Additional
   feature groups can follow as subsections inside `Key Features`.
3. `## Next Steps`.
4. `## Accessibility`, with the same three verified subsections used by component topics.
5. `## API References`.
6. `## Additional Resources`.
7. `## FAQ`, using the shared Astro `Faq` and `FaqItem` components.

Do not add component-only `When to Use`, `When Not to Use`, `Live Demo`, `Getting
Started`, `Usage`, `Properties`, `Accessibility`, or `Troubleshooting` sections
to the category introduction. Put selection guidance in the category definition or the relevant
type/member entry, and put each demo inside the entry it demonstrates. Supporting content such as
browser support, support options, licensing, and FAQ belongs after the navigation sections as
subsections of the page's main structure, not as additional top-level category sections.

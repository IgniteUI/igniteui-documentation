import { before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { translateMarkdownFile } from '../src/pipeline.js';
import { validateTranslation } from '../src/validate.js';
import { docsContract, mock, translateDocs, upper } from './helpers.js';

describe('frontmatter translation & serialization', () => {
  let output = '';
  before(async () => {
    output = await translateDocs();
  });

  test('translatable frontmatter is translated; locked keys are untouched', () => {
    assert.match(output, /title: ANGULAR GRID OVERVIEW/i);
    assert.match(output, /license: MIT/);
    assert.ok(
      output.includes('_canonicalLink: "{environment:dvUrl}/components/grid"') ||
        output.includes("_canonicalLink: '{environment:dvUrl}/components/grid'"),
    );
    assert.ok(output.includes('IgxGridComponent')); // mentionedTypes preserved
  });

  test('no tool-added keys (source_hash/source_locale) in the output', () => {
    assert.doesNotMatch(output, /source_hash:/);
    assert.doesNotMatch(output, /source_locale:/);
  });

  test('long frontmatter values stay on one line (no ">-" folding)', () => {
    assert.doesNotMatch(output, />-\n/);
    assert.match(output, /^description: /m);
  });

  test('an unquoted frontmatter value starting with {Placeholder} does not crash the parser', async () => {
    // Real docfx authoring inconsistency: some pages quote this, some don't.
    const fixture = `---
title: {Platform} What's New | {ProductName} | Infragistics
description: Learn about new features in the {ProductName}.
---

# Changelog
`;
    const out = await translateMarkdownFile(fixture, mock, { contract: docsContract });
    assert.match(out, /title: /);
    assert.match(out, /CHANGELOG/i);
  });

  test('{Platform}/{ProductName} in frontmatter values survive protectPatterns, unmangled', async () => {
    const fixture = `---
title: "{Platform} Linear Gauge | Data Visualization | Infragistics"
description: Use the {ProductName} linear gauge to visualize data.
---

# Overview
`;
    const out = await translateMarkdownFile(fixture, mock, {
      contract: docsContract,
      protectPatterns: ['\\{[A-Za-z][A-Za-z0-9]*\\}'],
    });
    // The mock translator uppercases everything NOT protected — if these
    // placeholders leaked through unmasked they'd come back as {PLATFORM}/
    // {PRODUCTNAME}. Case-preserved means the mask+restore round-trip worked.
    assert.match(out, /\{Platform\}/);
    assert.match(out, /\{ProductName\}/);
    assert.doesNotMatch(out, /\{PLATFORM\}/);
    assert.doesNotMatch(out, /\{PRODUCTNAME\}/);
  });

  test('frontmatterStyle.forceQuoteFields quotes a field the dumper would leave bare', async () => {
    const fixture = `---
title: "Angular Grid Overview"
canonicalLink: /components/grid
last_updated: "2026-04-24"
---

Body text.
`;
    const out = await translateMarkdownFile(fixture, mock, {
      contract: docsContract,
      frontmatterStyle: { forceQuoteFields: ['canonicalLink', 'last_updated'] },
    });
    assert.match(out, /canonicalLink: "\/components\/grid"/);
    assert.match(out, /last_updated: "2026-04-24"/);
    // title wasn't in forceQuoteFields — stays unquoted (unambiguous plain scalar)
    assert.match(out, /^title: ANGULAR GRID OVERVIEW$/m);
  });

  test('frontmatterStyle.forceFlowFields keeps a locked array on one line', async () => {
    const fixture = `---
title: "Linear Gauge Overview"
mentionedTypes: ["LinearGauge", "LinearGraphRange"]
---

Body text.
`;
    const out = await translateMarkdownFile(fixture, mock, {
      contract: docsContract,
      frontmatterStyle: { forceFlowFields: ['mentionedTypes'] },
    });
    // js-yaml's default dump would split this into a multi-line "- LinearGauge"
    // block sequence — forceFlowFields keeps it exactly as the source wrote it.
    assert.match(out, /^mentionedTypes: \["LinearGauge", "LinearGraphRange"\]$/m);
  });

  test('mentionedTypes with a {ComponentApiMembers}-style template placeholder round-trips without a shape mismatch', async () => {
    // _shared/*.mdx partials use `mentionedTypes: [{ComponentApiMembers}]` as a
    // build-time template placeholder. YAML parses `{ComponentApiMembers}` as a
    // flow mapping with a null value, not a string — forceFlowArrayFields used to
    // mistake the re-serialized block-mapping item ("- ComponentApiMembers: null")
    // for a plain scalar and collapse it into the STRING "ComponentApiMembers: null",
    // which then re-parsed as 1 leaf where the source had 0 — a false shape-mismatch.
    const fixture = `---
title: "Batch Editing"
mentionedTypes: [{ComponentApiMembers}]
---

Body text.
`;
    const out = await translateMarkdownFile(fixture, mock, {
      contract: docsContract,
      frontmatterStyle: { forceFlowFields: ['mentionedTypes'] },
    });
    const violations = validateTranslation(fixture, out, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(!violations.some((x) => x.code === 'shape-mismatch'), JSON.stringify(violations));
  });

  test('a file with multiple ComponentBlock-wrapped frontmatter blocks translates all of them and preserves fenced code in the shared body', async () => {
    // Angular docs' grids_templates/*.mdx (35 of 41 files in that directory)
    // concatenate a WHOLE mini-document per platform — its own frontmatter
    // block, each wrapped in <ComponentBlock for="X"> — before a single
    // SHARED body. The file does NOT start with "---", so gray-matter finds
    // NO frontmatter at all (title/description were never translated), and
    // everything after the FIRST "---" — including the SECOND platform's own
    // "---" pair — got fed to remark as body text, where a bare "---" is
    // CommonMark thematic-break syntax, corrupting everything downstream.
    // Also: the shared body starts with a <ComponentBlock> tag, which made
    // the generic isHtmlBody() auto-detection misroute an otherwise ordinary
    // MARKDOWN body through the HTML tag-split translator — whose long-value
    // sanitizer then stripped a genuine fenced code block's backtick markers
    // as if the model had accidentally added them.
    const fixture = `<ComponentBlock for="Grid">

---
title: Grid Title
---

</ComponentBlock>
<ComponentBlock for="TreeGrid">

---
title: TreeGrid Title
---

</ComponentBlock>

# Shared Heading

Some shared prose.

\`\`\`typescript
this.grid.doSomething();
\`\`\`
`;
    const out = await translateMarkdownFile(fixture, upper, { contract: docsContract });
    assert.ok(out.includes('title: GRID TITLE'), 'first block frontmatter must translate');
    assert.ok(out.includes('title: TREEGRID TITLE'), 'second block frontmatter must translate');
    assert.match(
      out,
      /```typescript\nthis\.grid\.doSomething\(\);\n```/,
      'fenced code in the shared body must keep its fence markers',
    );
  });

  test('a ComponentBlock frontmatter block with NO blank line before its closing tag does not crash', async () => {
    // Real-world spacing is inconsistent across grids_templates/*.mdx: most
    // blocks have a blank line between the closing "---" and </ComponentBlock>,
    // but some (e.g. virtualization.mdx) have zero. A regex that required
    // at least one blank line there would backtrack past this block's own
    // closing "---" looking for one, swallowing the NEXT block's frontmatter
    // into the same capture — producing a multi-document string that crashes
    // js-yaml with "expected a single document in the stream, but found more".
    const fixture = `<ComponentBlock for="Grid">

---
title: Grid Title
---
</ComponentBlock>
<ComponentBlock for="TreeGrid">

---
title: TreeGrid Title
---

</ComponentBlock>

# Shared Heading

Some shared prose.
`;
    const out = await translateMarkdownFile(fixture, upper, { contract: docsContract });
    assert.ok(out.includes('title: GRID TITLE'), 'first block frontmatter must translate');
    assert.ok(out.includes('title: TREEGRID TITLE'), 'second block frontmatter must translate');
  });
});

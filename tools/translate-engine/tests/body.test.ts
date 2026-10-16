import { before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { translateMarkdownFile } from '../src/pipeline.js';
import {
  docsContract,
  identity,
  LIST_FENCE_FIXTURE,
  marketingContract,
  MARKETING_FIXTURE,
  mock,
  translateDocs,
} from './helpers.js';

// Assertions against the shared end-to-end translation of DOCS_FIXTURE.
describe('body: end-to-end masking on the docs fixture', () => {
  let output = '';
  before(async () => {
    output = await translateDocs();
  });

  test('translates a docs MDX file end-to-end', () => {
    assert.ok(output.length > 0);
  });

  test('ApiLink and Sample components survive byte-for-byte', () => {
    assert.ok(output.includes('<ApiLink type="IgxGridComponent" member="filter" />'));
    assert.ok(
      output.includes('<Sample src="{environment:demosBaseUrl}/grid/sample" height={600} />'),
    );
  });

  test('DocsAside tags survive but its children are translated', () => {
    assert.ok(output.includes('<DocsAside type="note">'));
    assert.ok(output.includes('</DocsAside>'));
    assert.match(output, /THIS NOTE SHOULD BE TRANSLATED/i);
  });

  test('code fence survives byte-for-byte (incl. comment)', () => {
    assert.ok(output.includes('// code must survive byte-for-byte'));
    assert.ok(output.includes('const grid: IgxGridComponent = new IgxGridComponent();'));
  });

  test('inline code and link URL preserved; prose translated', () => {
    assert.ok(output.includes('`igx-grid`'));
    assert.ok(output.includes('(../data-grid)'));
    assert.match(output, /INLINE CODE STAYS/);
  });

  test('GFM table survives the round-trip', () => {
    assert.match(output, /\| COLUMN \| TYPE \|/i);
  });

  test('no placeholder tokens leak into the output', () => {
    assert.doesNotMatch(output, /__(?:BLOCK|MDX|URL)_?\d+__/);
  });
});

// Self-contained structural/masking cases, each with its own fixture.
describe('body: MDX structure & masking edge cases', () => {
  test('a JSX tag immediately followed by a fence (no blank line) does not leak code into HTML translation', async () => {
    // Reproduces the exact pattern found in components/grids/_shared/*.mdx —
    // without the fix, remark swallows tag+fence into one raw-HTML blob,
    // which gets routed through the HTML tag-split translator and "translates"
    // the code as plain text.
    const fixture = `---
title: "Batch Editing"
---

# Batch Editing

<PlatformBlock for="WebComponents">
\`\`\`html
<IgbGrid Data=data BatchEditing="true">
</IgbGrid>
\`\`\`
</PlatformBlock>
`;
    const out = await translateMarkdownFile(fixture, mock, { contract: docsContract });
    // If the code leaked through unprotected, the mock (which uppercases
    // everything it's asked to translate) would mangle the tag/attributes.
    // Byte-identical code, case included, proves the fence stayed protected.
    assert.ok(out.includes('<IgbGrid Data=data BatchEditing="true">\n</IgbGrid>'));
  });

  test('a real component tag as the first line of code is not corrupted by the fence-adjacency fix', async () => {
    // Guards against the fix being too aggressive: plenty of real Blazor/React
    // samples start their very first code line with a capitalized tag
    // (<IgbGrid>, <IgrGrid>) — that must NOT be mistaken for a JSX-wrapper
    // boundary and split away from its fence-open line.
    const fixture = `---
title: "Sample"
---

# Sample

\`\`\`razor
<IgbGrid @ref="grid" BatchEditing="true">
</IgbGrid>
\`\`\`
`;
    const out = await translateMarkdownFile(fixture, mock, { contract: docsContract });
    // The fence-open + first code line must stay adjacent (no inserted blank
    // line splitting them) — that's what this test actually guards against.
    assert.match(out, /```razor\n<IgbGrid @ref="grid" BatchEditing="true">\n<\/IgbGrid>\n/);
  });

  test('a ComponentBlock/PlatformBlock wrapping one bullet in a list keeps its source indentation', async () => {
    // An unindented <ComponentBlock>/<PlatformBlock> pair wraps a single bullet
    // in an otherwise continuous list, with no blank line separating them from
    // the list items on either side. Without isolating the tag onto its own
    // blank-line-delimited block first, remark treats it as a lazy continuation
    // of the preceding list item and re-indents it on stringify.
    const fixture = `---
title: "Sample"
---

- first item
<ComponentBlock for="Grid">
- second item, grid only
</ComponentBlock>
- third item
`;
    const out = await translateMarkdownFile(fixture, mock, { contract: docsContract });
    assert.match(out, /^<ComponentBlock for="Grid">$/m);
    assert.match(out, /^<\/ComponentBlock>$/m);
  });

  test('translatableAttributes translates named attribute text on a fully self-closing component', async () => {
    // <CtaArea title="..." description="..." label="..." href="..." /> packs
    // ALL its user-facing text into attributes — it has no children at all, so
    // the automatic "translate a component's children" rule reaches none of it.
    const fixture = `---
title: "Sample"
---

# Sample Page

Some intro prose.

<CtaArea
    title="Quick and Easy to Customize {Platform} Tables"
    description="Some description text."
    label="View Samples"
    href="{environment:infragisticsBaseUrl}/resources/sample-applications"
/>
`;
    const out = await translateMarkdownFile(fixture, mock, {
      contract: docsContract,
      protectPatterns: ['\\{[A-Za-z][A-Za-z0-9]*\\}'],
      translatableAttributes: { CtaArea: ['title', 'description', 'label'] },
    });
    assert.match(out, /title="QUICK AND EASY TO CUSTOMIZE \{Platform\} TABLES"/);
    assert.match(out, /description="SOME DESCRIPTION TEXT\."/);
    assert.match(out, /label="VIEW SAMPLES"/);
    // href isn't in the configured attribute list — must stay byte-identical.
    assert.match(out, /href="\{environment:infragisticsBaseUrl\}\/resources\/sample-applications"/);
  });

  test('a paired component translates its title attribute AND its indented children', async () => {
    // <Feature title="..."> wraps an <Image/>, a <span> heading, and a <p> — all
    // indented 4 spaces as pure authoring style, not real nesting. Under a
    // CommonMark parser that indentation satisfied the indented-code-block rule
    // and silently swallowed the children as one opaque "code" node; remark-mdx
    // reads them as the JSX element's children, where indentation is just
    // layout, so they arrive as ordinary prose nodes and get translated.
    const fixture = `---
title: "Sample"
---

# Sample Page

Some intro prose here.

<Feature imagePosition="right" title="Grid Paging">

    <Image slot="image" src={x} alt="Icon" class="b-lazy" />

    <span class="h3 features__heading">Grid Paging<a class="anchorjs-link" href="foo.md"></a></span>
    <p>The Data Grid Paging component is designed to take in an array of data.</p>

</Feature>
`;
    const out = await translateMarkdownFile(fixture, mock, {
      contract: docsContract,
      translatableAttributes: { Feature: ['title'] },
    });
    assert.ok(!out.includes('```'), 'no fence markers should appear');
    assert.match(out, /title="GRID PAGING"/);
    assert.match(out, /GRID PAGING<a class="anchorjs-link"/);
    assert.match(out, /THE DATA GRID PAGING COMPONENT IS DESIGNED TO TAKE IN AN ARRAY OF DATA/);
    assert.ok(out.includes('<Image slot="image" src={x} alt="Icon" class="b-lazy" />'));
  });

  test('kbd tag content (keyboard key names) is never translated', async () => {
    // <kbd>TAB</kbd> etc. are literal keyboard key labels, not prose — they must
    // be skipped by the HTML tag-split translator exactly like code/pre.
    const fixture = `---
title: "Sample"
---

Press <kbd>TAB</kbd> to move focus, then <kbd>SHIFT</kbd> and <kbd>ENTER</kbd> to confirm.
`;
    const out = await translateMarkdownFile(fixture, mock, { contract: docsContract });
    assert.ok(out.includes('<kbd>TAB</kbd>'));
    assert.ok(out.includes('<kbd>SHIFT</kbd>'));
    assert.ok(out.includes('<kbd>ENTER</kbd>'));
  });

  test('unambiguous keyboard key names are protected even as plain prose (no kbd wrapper)', async () => {
    // Defensive coverage for an author who mentions a key without wrapping it in
    // <kbd> — but ONLY for names with no everyday English meaning.
    const fixture = `---
title: "Sample"
---

Press Ctrl and Page Down together, then use Arrow Up to scroll back, or Esc to cancel.
`;
    const out = await translateMarkdownFile(fixture, mock, { contract: docsContract });
    assert.ok(out.includes('Ctrl'));
    assert.ok(out.includes('Page Down'));
    assert.ok(out.includes('Arrow Up'));
    assert.ok(out.includes('Esc'));
  });

  test('ambiguous words are NOT blanket-protected outside kbd (Alt/Enter must still translate)', async () => {
    // Alt/Tab/End/Home/Enter collide with ordinary English (this corpus uses
    // "Alt text" for images, "Enter your details" as an instruction) — the
    // safe-key-name list must not include them.
    const fixture = `---
title: "Sample"
---

Provide meaningful Alt text for every image, and remember to Enter your details in the form.
`;
    const out = await translateMarkdownFile(fixture, mock, { contract: docsContract });
    assert.match(
      out,
      /ALT TEXT/,
      'Alt must translate as ordinary prose, not be masked as a key name',
    );
    assert.match(
      out,
      /ENTER YOUR DETAILS/,
      'Enter must translate as ordinary prose, not be masked as a key name',
    );
  });

  test('a 4-space-indented <li> block (CommonMark indented code) is not converted into a fenced code block', async () => {
    // CommonMark has TWO valid code-block syntaxes: fenced (```) and a plain
    // 4-space indent. This corpus uses the indented style to wrap a run of <li>
    // items inside a <ul>; remark-stringify's default re-serializes ANY code
    // node as a fence — turning those <li> items into a fenced block on every
    // round-trip, with ZERO translation involved.
    const fixture = `---
title: "Sample"
---

<ul class="features-simple-list">
    <li>
        [First feature](grid/first.md) does a thing
    </li>

    <li>
        [Second feature](grid/second.md) does another thing
    </li>
</ul>
`;
    const out = await translateMarkdownFile(fixture, identity, { contract: docsContract });
    assert.ok(
      !out.includes('```'),
      'no fence markers should be introduced for a plain indented block',
    );
    assert.ok(out.includes('[First feature](grid/first.md)'));
    assert.ok(out.includes('[Second feature](grid/second.md)'));
  });

  test('a bare fence with no language tag (list-nested code sample) stays fenced, not indented', async () => {
    // The flip side of the indented-<li> case: remark-parse collapses BOTH
    // CommonMark code-block syntaxes to the SAME AST shape when there's no
    // language tag. A langless bare fence must stay fenced, verified against a
    // source position check rather than a global remark-stringify option.
    const fixture = `---
title: "Sample"
---

1. First case:

    \`\`\`
    expectedData = [{ Name: 'Foo' }];
    \`\`\`

2. Second case:

    \`\`\`
    expectedData = [{ Name: 'Bar' }];
    \`\`\`
`;
    const out = await translateMarkdownFile(fixture, identity, { contract: docsContract });
    const fenceCount = (out.match(/^\s*```/gm) ?? []).length;
    assert.equal(fenceCount, 4, 'both bare fences must keep their open+close markers');
    assert.ok(out.includes("expectedData = [{ Name: 'Foo' }];"));
    assert.ok(out.includes("expectedData = [{ Name: 'Bar' }];"));
  });

  test('a multi-line JSX opening tag does not corrupt the rest of the document', async () => {
    // <Feature\n  attr="x"\n> — the closing ">" alone on its own line is
    // CommonMark BLOCKQUOTE syntax to remark-parse, which silently turns the
    // tag's attributes into paragraph text, opens a spurious empty blockquote,
    // and orphans every real child that follows as 4-space indented "code".
    const fixture = `---
title: "Sample"
---

<Feature
    imagePosition="right"
    title="Grid Paging"
>
    <Image slot="image" src={gridPaging} alt="Icon" class="b-lazy" />
    <span class="h3">Grid Paging</span>
    <p>Some feature description text.</p>
</Feature>
`;
    const out = await translateMarkdownFile(fixture, identity, { contract: docsContract });
    assert.ok(!out.includes('```'), 'no fence markers should appear');
    assert.ok(!out.includes('>\n\n>'), 'no spurious blockquote should appear');
    assert.ok(out.includes('<Image slot="image" src={gridPaging} alt="Icon" class="b-lazy" />'));
    assert.ok(out.includes('<p>Some feature description text.</p>'));
  });

  test('sectioned page: sections translate, body verbatim, enum slug preserved', async () => {
    const out = await translateMarkdownFile(MARKETING_FIXTURE, mock, {
      contract: marketingContract,
      skipBodyWhen: (fm) => Array.isArray(fm.sections),
    });
    assert.match(out, /headline: WHY CHOOSE US/i);
    assert.match(out, /FAST TO EMBED/i);
    assert.ok(out.includes('name: Jane Doe')); // preserve field
    assert.ok(out.includes('/img/hero.png')); // asset
    assert.ok(out.includes('category: big-data')); // slug under enum key → verbatim
    assert.ok(out.includes('Body stays verbatim on sectioned pages.'));
    assert.ok(out.includes('<script>alert(1)</script>'));
  });

  test('a list-nested code fence keeps its indentation after translation', async () => {
    const out = await translateMarkdownFile(LIST_FENCE_FIXTURE, mock, { contract: docsContract });
    // remark normalizes list-continuation indent to the marker width ("2. " = 3
    // chars) — the point is that EVERY line (fence-open, every JSON line,
    // fence-close) carries that SAME 3-space offset on top of the JSON's own
    // nesting, with no double- or dropped indentation on any single line.
    const lines = out.split('\n');
    const fenceOpenIdx = lines.findIndex((l) => l.includes('```json'));
    assert.ok(fenceOpenIdx > 0, 'fence not found in output');
    assert.equal(lines[fenceOpenIdx], '   ```json');
    assert.equal(lines[fenceOpenIdx + 1], '   {');
    assert.equal(lines[fenceOpenIdx + 2], '     "mcpServers": {');
    assert.equal(lines[fenceOpenIdx + 3], '       "example": { "command": "npx" }');
    assert.equal(lines[fenceOpenIdx + 4], '     }');
    assert.equal(lines[fenceOpenIdx + 5], '   }');
    assert.equal(lines[fenceOpenIdx + 6], '   ```');
    assert.doesNotMatch(out, /__FENCE_\d+__/);
  });
});

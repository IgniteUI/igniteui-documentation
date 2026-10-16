import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { translateMarkdownFile } from '../src/pipeline.js';
import { docsContract, identity, mock } from './helpers.js';

// Structural regression guards for the remark-mdx pipeline.
//
// These cases were previously owned by two unit-test files that no longer have
// anything to point at: `preprocess-fences.test.ts` guarded
// collapseMultilineJsxOpenTags / isolateBareJsxLines, and
// `import-escaping.test.ts` guarded collectImportLines / restoreImportLines.
// All four functions existed to repair a CommonMark parser's misreading of MDX
// before it happened, and all four are gone — remark-mdx parses these
// constructs correctly in the first place.
//
// The DEFECTS they were guarding are what matters, and every one of them
// shipped to production at least once, so they are re-expressed here against
// the whole pipeline. Testing through translateMarkdownFile rather than a named
// helper is also what makes them durable: they assert the OUTCOME the docs
// build depends on, not the mechanism that currently produces it, so the next
// refactor cannot quietly delete the guard along with the code.
//
// The identity translator gives structural assertions with no model involved;
// the uppercasing `mock` translator shows what did and did not reach the
// translator at all.

// A body that starts with a tag is sniffed as raw HTML by bodyMode 'auto' and
// routed to the tag-split translator instead of the markdown pipeline. Real
// pages open with an import block or a heading, so every fixture gets an intro
// line — otherwise these would silently be testing the wrong path.
const doc = (body: string): string => `---\ntitle: "Sample"\n---\n\n# Sample Page\n\n${body}\n`;

const run = (body: string, translator = identity, opts = {}): Promise<string> =>
  translateMarkdownFile(doc(body), translator, { contract: docsContract, ...opts });

describe('code fences survive MDX-shaped content', () => {
  test('a multi-line JSX tag inside a fence is content, not markup', async () => {
    // Shipped defect: collapseMultilineJsxOpenTags had no fence tracking and
    // rewrote real React/Blazor samples in three of the ten pilot files,
    // collapsing an authored multi-line tag onto one line in every locale. A
    // fence is a `code` node here, so there is no text-level pass that could.
    const sample = [
      '```tsx',
      '<IgrAvatar',
      '  src="https://example.com/1.jpg"',
      '  alt="A photo of Ana Zane"',
      '/>',
      '```',
    ].join('\n');
    const out = await run(sample);
    assert.ok(out.includes(sample), `fence must survive verbatim, got:\n${out}`);
  });

  test('fence content keeps its indentation inside a component', async () => {
    const body = [
      '<Faq>',
      '',
      '```scss',
      '$a: palette(',
      '  $primary: red',
      ');',
      '```',
      '',
      '</Faq>',
    ].join('\n');
    const out = await run(body);
    assert.ok(out.includes('  $primary: red'), 'indented sample line must not be dedented');
    assert.ok(!out.includes('    $primary: red'), 'nor gain the serializer JSX-child indent');
  });

  test('an import line inside a fence is sample content, left exactly as authored', async () => {
    // This corpus documents components, so samples routinely contain import
    // lines of their own. They are content: they must neither be translated nor
    // confused with the page's real MDX imports.
    const body = [
      "import Sample from 'x/Sample.astro';",
      '',
      'Install it like this:',
      '',
      '```tsx',
      "import { IgrAvatar } from 'igniteui-react';",
      '```',
      '',
      "import Late from 'x/Late.astro';",
    ].join('\n');
    const out = await run(body, mock);
    assert.ok(out.includes("import { IgrAvatar } from 'igniteui-react';"), 'sample import intact');
    assert.ok(out.includes("import Sample from 'x/Sample.astro';"), 'real import intact');
    assert.ok(out.includes("import Late from 'x/Late.astro';"), 'trailing import intact');
    assert.match(out, /INSTALL IT LIKE THIS/, 'the prose around them still translates');
  });

  test('four-space-indented text is prose, because MDX has no indented code blocks', async () => {
    // Not a regression — a correction. CommonMark reads four leading spaces as
    // a code block; MDX has no such syntax, so the docs build has always
    // rendered this as a paragraph. The old parser froze it as a `code` node,
    // which meant the pipeline masked it and it shipped in English. The
    // indentation is layout and is not preserved; the words are, and they now
    // reach the translator like the prose they always were.
    const body = ['Some prose.', '', '    four space indented line'].join('\n');
    const out = await run(body, mock);
    assert.ok(!out.includes('```'), `must not become a fenced block, got:\n${out}`);
    assert.match(out, /FOUR SPACE INDENTED LINE/, 'it reaches the translator');
  });
});

describe('MDX imports are never rewritten', () => {
  // Under a CommonMark parser an import was filed as an ordinary paragraph, so
  // remark-stringify was free to rewrite it. Two distinct corruptions showed up
  // in one 10-file production run with NO model involved:
  //   Azure_Traffic_Tile.png -> Azure\_Traffic\_Tile.png      (emphasis escaping)
  //   avatar_do1@2x.png      -> avatar_[do1@2x.png](mailto:…) (GFM autolink)
  // Either one is a hard Astro build failure. remark-mdx parses the whole block
  // as an mdxjsEsm node, which is masked by node type and restored from the
  // source bytes, so neither escaping nor autolinking can reach it.
  const UNDERSCORED =
    "import azureTile from '@xplat-images/general/Azure_Traffic_Tile_Series_With_Background.png';";
  const EMAILISH = "import avatarDo2x from '@xplat-images/avatar/avatar_do1@2x.png';";

  test('an underscored import path survives byte-for-byte', async () => {
    assert.ok((await run(UNDERSCORED)).includes(UNDERSCORED));
  });

  test('an email-shaped import path survives byte-for-byte', async () => {
    assert.ok((await run(EMAILISH)).includes(EMAILISH));
  });

  test('a whole import block survives in order', async () => {
    const block = [
      "import A from '@images/one_two.png';",
      "import B from '@images/do1@2x.png';",
      "import C from 'igniteui-astro-components/components/mdx/Sample.astro';",
    ].join('\n');
    const out = await run(block, mock);
    assert.ok(out.includes(block), `block must come back intact, got:\n${out}`);
  });

  test('prose that merely uses the word "import" still translates', async () => {
    const body = "import Sample from 'x/Sample.astro';\n\nYou can import data from a workbook.";
    const out = await run(body, mock);
    assert.ok(out.includes("import Sample from 'x/Sample.astro';"), 'the real import is frozen');
    assert.match(out, /YOU CAN IMPORT DATA FROM A WORKBOOK/, 'the sentence is not');
  });
});

describe('component children are prose, not code', () => {
  test('FAQ answer text is translated, not masked as an indented code block', async () => {
    // Shipped defect: the old preprocessor de-indented the tags and inserted
    // blank lines, leaving the answer indented four spaces between blank lines —
    // CommonMark's indented-code-block rule exactly. remark parsed authored
    // prose as code, the pipeline masked it as a __BLOCK__ placeholder, and it
    // was never sent to the translator at all. avatar.mdx and badge.mdx shipped
    // their whole FAQ in English; no deterministic check caught it, only the
    // LLM judge did.
    const body = [
      '<Faq>',
      '  <FaqItem question="When should I use Avatar?" indicatorPosition="end">',
      '    Use Avatar when the UI needs to represent a person.',
      '  </FaqItem>',
      '</Faq>',
    ].join('\n');
    const out = await run(body, mock);
    assert.ok(!out.includes('```'), `no fence may appear, got:\n${out}`);
    assert.match(out, /USE AVATAR WHEN THE UI NEEDS TO REPRESENT A PERSON/);
  });

  test('a nested list inside a component keeps its shape', async () => {
    // Flattening the component must not flatten its content: stripping every
    // child line to column 0 would fix the FAQ case above and turn this nested
    // list into a flat one.
    const body = ['<Feature>', '  - top level', '    - nested', '</Feature>'].join('\n');
    const out = await run(body, mock);
    assert.match(out, /^- TOP LEVEL$/m, 'the outer item is translated and reaches column 0');
    assert.match(out, /^ {2}- NESTED$/m, 'the nested item stays indented relative to it');
  });

  test('a multi-line JSX opening tag is parsed as a tag, not a blockquote', async () => {
    // A bare `>` starting a line IS CommonMark blockquote syntax, so the old
    // parser opened a spurious empty blockquote at the end of a multi-line tag
    // and orphaned everything the component contained. Under remark-mdx the tag
    // is one node and its children are ordinary prose.
    const body = [
      '<Feature',
      '    imagePosition="right"',
      '    title="Grid Paging"',
      '>',
      '',
      'The paging component takes an array of data.',
      '',
      '</Feature>',
    ].join('\n');
    const out = await run(body, mock);
    assert.ok(!out.includes('> '), `no blockquote may be produced, got:\n${out}`);
    assert.match(out, /THE PAGING COMPONENT TAKES AN ARRAY OF DATA/);
    assert.ok(out.includes('imagePosition="right"'), 'the tag keeps its authored attributes');
  });
});

describe('JSX is restored from the source bytes, not re-serialized', () => {
  test('a self-closing tag keeps its exact attribute spelling', async () => {
    // mdast-util-mdx-jsx re-serializes attributes with its own quoting and
    // spacing. Masking each element from its own source slice means the
    // serializer never touches it — which is what keeps an expression-valued
    // attribute (`height={510}`) from being reflowed or requoted.
    const tag = '<Sample src="/charts/data-chart/stacked" height={510} alt="A chart" />';
    const out = await run(`Text before.\n\n${tag}\n\nText after.`);
    assert.ok(out.includes(tag), `tag must be byte-identical, got:\n${out}`);
  });

  test('a run of adjacent tags on consecutive lines stays one block', async () => {
    // The "API References" section of every chart page is a run of
    // `<ApiLink … /><br />` lines with no blank line between them. Masked one
    // element at a time, each would come back as its own block with a blank
    // line after it, turning one list into twenty paragraphs.
    const run3 = [
      '<ApiLink type="CategoryChart" /><br />',
      '<ApiLink type="DataChart" /><br />',
      '<ApiLink type="RangeAreaSeries" /><br />',
    ].join('\n');
    const out = await run(`## API References\n\n${run3}`);
    assert.ok(out.includes(run3), `the run must keep its line breaks, got:\n${out}`);
  });

  test('an {expression} in prose is preserved and its sentence still translates', async () => {
    const out = await run('The {Platform} grid displays data.', mock);
    assert.ok(out.includes('{Platform}'), 'the expression is not translated or escaped');
    assert.match(out, /THE \{Platform\} GRID DISPLAYS DATA/);
  });
});

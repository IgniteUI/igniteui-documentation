import { before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { hasErrors, validateTranslation } from '../src/validate.js';
import { docsContract, DOCS_FIXTURE, LIST_FENCE_FIXTURE, translateDocs } from './helpers.js';

describe('validator (Layer 1)', () => {
  let output = '';
  before(async () => {
    output = await translateDocs();
  });

  test('validator passes the mock translation', () => {
    // doNotTranslate: [] here — the uppercasing mock doesn't simulate a real
    // model's "keep this exact-case brand name" behavior, so a brand check
    // gets its own dedicated test right below instead of asserting zero
    // errors on a mock that was never meant to honor doNotTranslate.
    const violations = validateTranslation(DOCS_FIXTURE, output, {
      contract: docsContract,
      doNotTranslate: [],
    });
    const errors = violations.filter((x) => x.severity === 'error');
    assert.deepEqual(errors, []);
  });

  test('validator catches a brand/do-not-translate term that lost occurrences', () => {
    // The mock uppercases "Angular" → "ANGULAR" everywhere it appears in
    // translatable fields — from doNotTranslate's exact-case perspective,
    // every occurrence of "Angular" was lost, exactly like a real model that
    // ignored the "keep this exact string" instruction would produce.
    const violations = validateTranslation(DOCS_FIXTURE, output, {
      contract: docsContract,
      doNotTranslate: ['Angular'],
    });
    const brand = violations.find((v) => v.code === 'brand-translated');
    assert.ok(brand, 'expected a brand-translated violation');
    assert.match(brand!.message, /Angular/);
  });

  test('validator catches a dropped ApiLink', () => {
    const broken = output.replace(
      '<ApiLink type="IgxGridComponent" member="filter" />',
      'filtering docs',
    );
    const violations = validateTranslation(DOCS_FIXTURE, broken, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(hasErrors(violations), 'expected tag-mismatch error');
    assert.ok(violations.some((x) => x.code === 'tag-mismatch'));
  });

  test('validator catches a modified code block', () => {
    const broken = output.replace('new IgxGridComponent()', 'new TranslatedComponent()');
    const violations = validateTranslation(DOCS_FIXTURE, broken, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(violations.some((x) => x.code === 'code-mismatch'));
  });

  test('validator catches a modified locked frontmatter field', () => {
    const broken = output.replace('{environment:dvUrl}/components/grid', '/kr/components/grid');
    const violations = validateTranslation(DOCS_FIXTURE, broken, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(violations.some((x) => x.code === 'preserved-modified'));
  });

  test('validator flags untranslated prose fields as warnings', () => {
    const violations = validateTranslation(DOCS_FIXTURE, DOCS_FIXTURE, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(violations.some((x) => x.code === 'untranslated' && x.severity === 'warn'));
  });

  test('validator detects corruption in a list-nested code fence (previously invisible)', () => {
    const corrupted = LIST_FENCE_FIXTURE.replace(
      /    ```json\n    \{/,
      '```json\n{', // fence "de-indented" the way an LLM might reflow it
    );
    const violations = validateTranslation(LIST_FENCE_FIXTURE, corrupted, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(violations.some((x) => x.code === 'code-mismatch'));
  });

  // An MDX import block reaches the model as ordinary prose unless a project
  // adds the protectPatterns entry for it, and a real local-model run translated
  // the JavaScript keyword `from` in every import of the page it touched. Nothing
  // flagged it: an import line has no tags (checkTags blind) and is not a fenced
  // block (checkCode blind).
  const IMPORT_FIXTURE = [
    '---',
    'title: Chart Adapter',
    '---',
    "import DocsAside from 'igniteui-astro-components/components/mdx/DocsAside.astro';",
    "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';",
    '',
    '# Chart Adapter',
    '',
    'You can import data from a workbook; this sentence is prose, not an import.',
    '',
  ].join('\n');

  test('validator catches a translated import keyword', () => {
    const broken = IMPORT_FIXTURE.replace(
      "import DocsAside from '",
      "import DocsAside от '", // exactly what translategemma:27b produced
    );
    const violations = validateTranslation(IMPORT_FIXTURE, broken, {
      contract: docsContract,
      doNotTranslate: [],
    });
    const v = violations.find((x) => x.code === 'import-mismatch');
    assert.ok(v, 'expected an import-mismatch violation');
    assert.equal(v!.severity, 'error');
  });

  test('validator catches a dropped import statement', () => {
    const broken = IMPORT_FIXTURE.replace(
      "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';\n",
      '',
    );
    const violations = validateTranslation(IMPORT_FIXTURE, broken, {
      contract: docsContract,
      doNotTranslate: [],
    });
    const v = violations.find((x) => x.code === 'import-mismatch');
    assert.ok(v, 'expected an import-mismatch violation');
    assert.match(v!.message, /2 → 1/);
  });

  test('import check ignores prose that merely uses the word "import"', () => {
    // The prose line ends in "not an import." — it must never be mistaken for an
    // import statement, or translating it would be reported as a defect.
    const translated = IMPORT_FIXTURE.replace(
      'You can import data from a workbook; this sentence is prose, not an import.',
      'Можете да импортирате данни от работна книга; това е проза.',
    );
    const violations = validateTranslation(IMPORT_FIXTURE, translated, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(!violations.some((x) => x.code === 'import-mismatch'));
  });

  test('import check tolerates a pure indentation change', () => {
    const reindented = IMPORT_FIXTURE.replace("import Sample from '", "  import Sample from '");
    const violations = validateTranslation(IMPORT_FIXTURE, reindented, {
      contract: docsContract,
      doNotTranslate: [],
    });
    assert.ok(!violations.some((x) => x.code === 'import-mismatch'));
  });
});

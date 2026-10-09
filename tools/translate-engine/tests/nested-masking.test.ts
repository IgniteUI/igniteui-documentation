import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { extractProtectedBlocks, restoreProtectedBlocks } from '../src/pipeline/protect.js';

// Masks nest whenever a later rule swallows text an earlier rule already
// tokenized. The real case: `Badge` is a preserveNames entry (compiled into
// protectPatterns ahead of the project's own patterns), and the MDX import rule
// then masks the whole import line that contains it. Restoring in insertion
// order left `__MDX_0__` visible in shipped output.
describe('nested masking round-trip', () => {
  const PRESERVE_BADGE = String.raw`(?<![A-Za-z0-9])Badge(?![A-Za-z0-9])`;
  const IMPORT = String.raw`(?<=^|\n)import\s+[^\n]*?\s+from\s+[^\n]*?;`;

  test('an import containing a preserved name round-trips exactly', () => {
    const body = "import Badge from 'igniteui-astro-components/components/mdx/Badge.astro';";
    const { replaced, blocks } = extractProtectedBlocks(body, [PRESERVE_BADGE, IMPORT]);
    assert.equal(restoreProtectedBlocks(replaced, blocks), body);
  });

  test('no placeholder token survives restore', () => {
    const body = [
      "import Badge from 'igniteui-astro-components/components/mdx/Badge.astro';",
      "import Sample from 'igniteui-astro-components/components/mdx/Sample.astro';",
      '',
      'The Badge component shows a count.',
    ].join('\n');
    const { replaced, blocks } = extractProtectedBlocks(body, [PRESERVE_BADGE, IMPORT]);
    const restored = restoreProtectedBlocks(replaced, blocks);
    assert.equal(restored, body);
    assert.ok(!/__MDX_\d+__/.test(restored), 'no leftover placeholder may remain');
  });

  test('order-independence: the outer mask still wins when rules are reversed', () => {
    // If the import rule runs FIRST the whole line is one opaque token and the
    // preserveNames rule never sees inside it — restore must still be exact.
    const body = "import Badge from 'x/Badge.astro';\n\nA Badge in prose.";
    const { replaced, blocks } = extractProtectedBlocks(body, [IMPORT, PRESERVE_BADGE]);
    assert.equal(restoreProtectedBlocks(replaced, blocks), body);
  });

  test('deeply nested masks all restore', () => {
    // A preserved name buried inside an import statement, alongside a line of
    // JSX. Nothing here is masked by node type - extractProtectedBlocks works on
    // raw text (frontmatter values, and the prose stream after stringify) - so
    // the ordering guarantee it makes has to hold on its own.
    const body = [
      "import Badge from 'x/Badge.astro';",
      '',
      '<DocsAside title="Badge notes">See the Badge docs.</DocsAside>',
    ].join('\n');
    const { replaced, blocks } = extractProtectedBlocks(body, [PRESERVE_BADGE, IMPORT]);
    const restored = restoreProtectedBlocks(replaced, blocks);
    assert.equal(restored, body);
    assert.ok(!/__MDX_\d+__/.test(restored));
  });
});

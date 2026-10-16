import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBlocks, spliceBody, syncDocument } from '../src/incremental.js';
import type { FieldContract } from '../src/types.js';

const contract: FieldContract = {
  translatable: new Set(['title', 'description']),
  preserve: new Set(),
  assets: new Set(),
  enumKeys: new Set(),
};

// Visible, reversible block/value "translation" so assertions can see what ran.
const translateBlock = async (b: string) => `X(${b})`;
const translateValue = async (v: string) => `TR:${v}`;

describe('incremental sync core', () => {
  test('splitBlocks keeps fenced code (incl. blank lines) as one block', () => {
    const body =
      '# Heading\n\nPara one.\n\n```js\ncode line\n\nblank inside fence\n```\n\nPara two.';
    const blocks = splitBlocks(body);
    assert.deepEqual(blocks, [
      '# Heading',
      'Para one.',
      '```js\ncode line\n\nblank inside fence\n```',
      'Para two.',
    ]);
  });

  test('spliceBody keeps unchanged target blocks and translates only changed/added ones', async () => {
    const enOld = 'A\n\nB\n\nC';
    const enNew = 'A\n\nB2\n\nC\n\nD'; // B changed, D added, A/C unchanged
    const target = 'TA\n\nTB\n\nTC';
    const r = await spliceBody(enOld, enNew, target, translateBlock);
    assert.ok(!('aborted' in r));
    if ('aborted' in r) return;
    assert.equal(r.body, 'TA\n\nX(B2)\n\nTC\n\nX(D)');
    assert.equal(r.translated, 2); // B2 + D
    assert.equal(r.kept, 2); // TA + TC (TB dropped — its EN block B was replaced)
  });

  test('spliceBody drops the target block for a removed EN block', async () => {
    const enOld = 'A\n\nB\n\nC';
    const enNew = 'A\n\nC'; // B removed
    const target = 'TA\n\nTB\n\nTC';
    const r = await spliceBody(enOld, enNew, target, translateBlock);
    assert.ok(!('aborted' in r));
    if ('aborted' in r) return;
    assert.equal(r.body, 'TA\n\nTC'); // TB gone, TA/TC preserved, nothing translated
    assert.equal(r.translated, 0);
  });

  test('spliceBody handles an insertion at the front without shifting (diff, not positional)', async () => {
    const enOld = 'A\n\nB';
    const enNew = 'X\n\nA\n\nB'; // X inserted before A - a positional compare would mis-map every block
    const target = 'TA\n\nTB';
    const r = await spliceBody(enOld, enNew, target, translateBlock);
    assert.ok(!('aborted' in r));
    if ('aborted' in r) return;
    assert.equal(r.body, 'X(X)\n\nTA\n\nTB'); // A/B translations preserved despite the shift
    assert.equal(r.translated, 1);
    assert.equal(r.kept, 2);
  });

  test('spliceBody ABORTS when the target structure diverged from EN@base', async () => {
    const r = await spliceBody('A\n\nB', 'A\n\nB2', 'TA', translateBlock); // target has 1 block, old has 2
    assert.ok('aborted' in r);
    if ('aborted' in r) assert.match(r.aborted, /diverged/);
  });

  test('syncDocument merges frontmatter field-by-field and splices the body', async () => {
    const enOld = `---
title: Grid
description: The grid.
---

Intro paragraph.

Second paragraph.
`;
    const enNew = `---
title: Grid
description: The grid, now updated.
---

Intro paragraph.

Second paragraph, changed.
`;
    const target = `---
title: Rejilla
description: La rejilla.
---

Intro traducida.

Segunda traducida.
`;
    const r = await syncDocument(enOld, enNew, target, {
      contract,
      translateBlock,
      translateValue,
    });
    assert.ok(!('aborted' in r));
    if ('aborted' in r) return;

    // title unchanged (Grid === Grid) → keep the target's "Rejilla"
    assert.match(r.output, /title: Rejilla/);
    // description changed → re-translated
    assert.match(r.output, /description: .*TR:The grid, now updated\./);
    // unchanged body block preserved verbatim
    assert.match(r.output, /Intro traducida\./);
    assert.doesNotMatch(r.output, /Segunda traducida\./); // its EN block changed → replaced
    // changed body block translated
    assert.match(r.output, /X\(Second paragraph, changed\.\)/);

    assert.equal(r.translatedBlocks, 1);
    assert.equal(r.keptBlocks, 1);
  });
});

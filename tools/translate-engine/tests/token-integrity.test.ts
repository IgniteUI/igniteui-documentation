import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { translateMarkdownFile } from '../src/pipeline.js';
import type { Translator } from '../src/types.js';
import { docsContract, mockTranslate } from './helpers.js';

describe('token integrity (drop retry + reorder realign)', () => {
  test('a model that silently drops one placeholder token on the first attempt is retried and recovers it', async () => {
    // Simulates the class of failure behind production tag-mismatch reports on
    // token-dense pages (many ComponentBlock/PlatformBlock wrappers, each
    // masked as one whole token in the single-shot body completion): the model's
    // response comes back with one __FENCE_n__ token missing entirely (not
    // mistranslated, not left as literal text — just gone), which silently
    // deletes that token's whole restored content with no other symptom.
    // translateProseWithTokenCheck must detect the gap and retry.
    let call = 0;
    const flaky: Translator = {
      one: async (t) => {
        call++;
        const out = mockTranslate(t);
        return call === 1 ? out.replace('__FENCE_0__', '') : out;
      },
      many: async (ts) => ts.map(mockTranslate),
    };
    const fixture = `---
title: "Batch Editing"
---

# Batch Editing

Some prose here.

\`\`\`ts
export class Foo {}
\`\`\`

More prose after.
`;
    const out = await translateMarkdownFile(fixture, flaky, { contract: docsContract });
    assert.equal(call, 2, 'expected exactly one retry after the missing token');
    assert.ok(out.includes('export class Foo {}'));
  });

  test('a model that swaps two code-block tokens (both still present) is realigned back to source order', async () => {
    // Reproduces the code-mismatch symptom still seen in production even with
    // the missing-token retry above AND an explicit "never reorder BLOCK/FENCE
    // tokens" prompt rule: the model emits every token exactly once (nothing
    // missing, so the retry above never fires) but swaps the ORDER of two of
    // them. Restoring is a positional string substitution, so this lands as
    // "same code block count, wrong content at position N" — realignBlockTokenOrder
    // must detect the swap and relabel tokens back to source order.
    const swapping: Translator = {
      one: async (t) => {
        const out = mockTranslate(t);
        return out
          .replace('__FENCE_0__', '\x00SWAP\x00')
          .replace('__FENCE_1__', '__FENCE_0__')
          .replace('\x00SWAP\x00', '__FENCE_1__');
      },
      many: async (ts) => ts.map(mockTranslate),
    };
    const fixture = `---
title: "Sample"
---

# Sample

\`\`\`ts
export class Foo {}
\`\`\`

\`\`\`ts
export class Bar {}
\`\`\`
`;
    const out = await translateMarkdownFile(fixture, swapping, { contract: docsContract });
    const fooPos = out.indexOf('export class Foo {}');
    const barPos = out.indexOf('export class Bar {}');
    assert.ok(fooPos >= 0 && barPos >= 0, 'both code blocks must survive');
    assert.ok(fooPos < barPos, 'Foo must still come before Bar, matching source order');
  });
});

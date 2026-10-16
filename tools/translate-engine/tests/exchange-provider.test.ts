import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  PENDING_MARK,
  PendingAnswerError,
  answerFileName,
  dummyAnswer,
  exchangeProvider,
  hashOf,
} from '../src/providers/exchange.js';

// The exchange provider routes the engine's prompts through files so the model
// behind a Claude Code session (or a person) can answer them. These pin the
// behaviours the record pass and the replay rounds depend on.

const TEXT_PROMPT =
  'Translate.\n\nRULES:\n- x\n\n<source>\n# Avatar Component\n\nUse __MDX_0__ here.\n</source>\n\nTranslation:';
const JSON_PROMPT =
  'Translate each VALUE.\n\n' + JSON.stringify({ '0': 'Live Demo', '1': 'Usage' });

const tmp = (): Promise<string> => fs.mkdtemp(path.join(os.tmpdir(), 'exchange-'));

describe('exchange provider', () => {
  test('replay: a missing answer writes the prompt and meta, then throws PendingAnswerError', async () => {
    const dir = await tmp();
    const p = exchangeProvider({ id: 'exchange', model: 'm', dir, mode: 'replay' });
    await assert.rejects(p.complete(TEXT_PROMPT), PendingAnswerError);
    const hash = hashOf(TEXT_PROMPT);
    assert.equal(await fs.readFile(path.join(dir, `${hash}.prompt.txt`), 'utf-8'), TEXT_PROMPT);
    const meta = JSON.parse(await fs.readFile(path.join(dir, `${hash}.meta.json`), 'utf-8'));
    assert.equal(meta.json, false);
    assert.equal(meta.requested, 1);
    assert.equal(meta.preview, '# Avatar Component');
  });

  test('an answer file is returned verbatim, in either mode', async () => {
    const dir = await tmp();
    const hash = hashOf(TEXT_PROMPT);
    const reply = '# Avatar コンポーネント\n\n__MDX_0__ を使用します。\n';
    await fs.writeFile(path.join(dir, answerFileName(hash, 1)), reply);
    for (const mode of ['replay', 'record'] as const) {
      const p = exchangeProvider({ id: 'exchange', model: 'm', dir, mode });
      assert.equal(await p.complete(TEXT_PROMPT), reply);
    }
  });

  test('record: a text prompt gets its source back with a marker, never unchanged', async () => {
    const dir = await tmp();
    const p = exchangeProvider({ id: 'exchange', model: 'm', dir, mode: 'record' });
    const out = await p.complete(TEXT_PROMPT);
    assert.ok(out.includes('Use __MDX_0__ here.'));
    assert.ok(out.endsWith(PENDING_MARK));
    assert.notEqual(out.trim(), '# Avatar Component\n\nUse __MDX_0__ here.');
  });

  test('record: a JSON batch prompt gets every key back, each value marked', () => {
    const out = JSON.parse(dummyAnswer(JSON_PROMPT, true)) as Record<string, string>;
    assert.deepEqual(Object.keys(out), ['0', '1']);
    assert.equal(out['0'], `Live Demo ${PENDING_MARK}`);
    assert.equal(out['1'], `Usage ${PENDING_MARK}`);
  });

  test('replay: a re-ask without its own answer reuses the previous attempt and records the request', async () => {
    const dir = await tmp();
    const hash = hashOf(TEXT_PROMPT);
    await fs.writeFile(path.join(dir, answerFileName(hash, 1)), 'first');
    const p = exchangeProvider({ id: 'exchange', model: 'm', dir, mode: 'replay' });
    assert.equal(await p.complete(TEXT_PROMPT), 'first');
    assert.equal(await p.complete(TEXT_PROMPT), 'first');
    const meta = JSON.parse(await fs.readFile(path.join(dir, `${hash}.meta.json`), 'utf-8'));
    assert.equal(meta.requested, 2);
    // Once the retry's own answer exists, a fresh process hands it to the second ask.
    await fs.writeFile(path.join(dir, answerFileName(hash, 2)), 'second');
    const p2 = exchangeProvider({ id: 'exchange', model: 'm', dir, mode: 'replay' });
    assert.equal(await p2.complete(TEXT_PROMPT), 'first');
    assert.equal(await p2.complete(TEXT_PROMPT), 'second');
  });
});

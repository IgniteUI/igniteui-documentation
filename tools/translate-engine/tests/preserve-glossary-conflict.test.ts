import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadConfig } from '../src/config.js';

// A single-word preserveName that is ALSO the head noun of a multi-word glossary
// term is a direct instruction conflict, and the mask always wins because it runs
// first and the model never sees the word. On the bg pilot `Chart` was a
// preserveName while the glossary defined "area chart" -> "площна диаграма",
// producing "Площна диаграма Chart" — which the judge scored 2/5 as "nonsensical
// bilingual duplication". config.ts now resolves it in the glossary's favour.
async function configWith(preserveNames: string[], glossary: unknown): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'te-conflict-'));
  await fs.writeFile(path.join(dir, 'glossary.json'), JSON.stringify(glossary));
  await fs.mkdir(path.join(dir, 'src'), { recursive: true });
  const cfg = `export default {
    name: 'conflict-test',
    root: '.',
    source: { locale: 'en', dir: 'src', include: ['**/*.mdx'] },
    targets: [{ code: 'bg', name: 'Bulgarian', dir: 'bg' }],
    contract: { translatable: ['title'] },
    preserveNames: ${JSON.stringify(preserveNames)},
    glossary: 'glossary.json',
    provider: { id: 'ollama', model: 'test' },
  };`;
  const p = path.join(dir, 'p.config.mjs');
  await fs.writeFile(p, cfg);
  return p;
}

const masks = (patterns: string[], name: string): boolean =>
  patterns.some((p) => p.includes(`)${name}(`));

describe('preserveNames / glossary conflict resolution', () => {
  test('drops a single-word name that heads a multi-word glossary term', async () => {
    const p = await configWith(
      ['Chart', 'Grid'],
      [{ term: 'area chart', translations: { bg: 'площна диаграма' } }],
    );
    const cfg = await loadConfig(p);
    assert.equal(masks(cfg.protectPatterns ?? [], 'Chart'), false, '"Chart" must not be masked');
    assert.equal(masks(cfg.protectPatterns ?? [], 'Grid'), true, '"Grid" heads nothing — keep it');
  });

  test('keeps a multi-word preserveName even when its head conflicts', async () => {
    // "Tree Grid" is specific enough to be unambiguous, and longest-match-first
    // ordering means it masks before any bare head could.
    const p = await configWith(
      ['Tree Grid', 'Chart'],
      [{ term: 'area chart', translations: { bg: 'площна диаграма' } }],
    );
    const cfg = await loadConfig(p);
    assert.ok(
      (cfg.protectPatterns ?? []).some((x) => x.includes('Tree') && x.includes('Grid')),
      '"Tree Grid" must still be masked',
    );
    assert.equal(masks(cfg.protectPatterns ?? [], 'Chart'), false);
  });

  test('a dropped name also leaves doNotTranslate', async () => {
    // Otherwise the validator would flag the now-intended translation as a
    // brand-translated error on every single file.
    const p = await configWith(
      ['Chart'],
      [{ term: 'area chart', translations: { bg: 'площна диаграма' } }],
    );
    const cfg = await loadConfig(p);
    assert.ok(!(cfg.doNotTranslate ?? []).includes('Chart'));
  });

  test('single-word glossary terms do NOT cause a drop', async () => {
    // Only MULTI-word terms have a head noun. A glossary entry for "chart"
    // alone is not a compound and implies no conflict.
    const p = await configWith(['Chart'], [{ term: 'chart', translations: { bg: 'диаграма' } }]);
    const cfg = await loadConfig(p);
    assert.equal(masks(cfg.protectPatterns ?? [], 'Chart'), true);
  });

  test('no glossary means nothing is dropped', async () => {
    const p = await configWith(['Chart', 'Grid'], []);
    const cfg = await loadConfig(p);
    assert.equal(masks(cfg.protectPatterns ?? [], 'Chart'), true);
    assert.equal(masks(cfg.protectPatterns ?? [], 'Grid'), true);
  });
});

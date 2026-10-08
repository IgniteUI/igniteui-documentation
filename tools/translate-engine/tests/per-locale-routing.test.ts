import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { concurrencyFor, judgeFor, providerFor } from '../src/cli-support.js';
import type { ResolvedConfig, TargetLocale } from '../src/types.js';

// Per-locale model routing: `provider`/`judge` are project-level defaults and a
// TargetLocale may override either with a PARTIAL block merged over the default.
// The point is that model quality is not uniform across languages - a
// Bulgarian-specialised model can beat a general one on bg while losing on ja.

const base = (targets: TargetLocale[], judge?: ResolvedConfig['judge']): ResolvedConfig =>
  ({
    provider: {
      id: 'ollama',
      model: 'translategemma:27b',
      url: 'http://host:11434',
      concurrency: 1,
    },
    judge,
    targets,
  }) as unknown as ResolvedConfig;

describe('per-locale model routing', () => {
  test('a locale with no override inherits the project provider', () => {
    const t: TargetLocale = { code: 'es', name: 'Spanish' };
    assert.deepEqual(providerFor(base([t]), t), {
      id: 'ollama',
      model: 'translategemma:27b',
      url: 'http://host:11434',
      concurrency: 1,
    });
  });

  test('a partial override swaps only the model, inheriting id/url/concurrency', () => {
    // The common case: same backend, better model for this language.
    const t: TargetLocale = {
      code: 'bg',
      name: 'Bulgarian',
      provider: { model: 'bggpt-gemma-2-9b' },
    };
    assert.deepEqual(providerFor(base([t]), t), {
      id: 'ollama',
      model: 'bggpt-gemma-2-9b',
      url: 'http://host:11434',
      concurrency: 1,
    });
  });

  test('switching backend does NOT inherit the old backend-specific fields', () => {
    // The dangerous case: inheriting apiKeyEnv across a vendor switch would
    // authenticate with the wrong vendor's key. url/concurrency are equally
    // meaningless for the new backend.
    const t: TargetLocale = {
      code: 'ja',
      name: 'Japanese',
      provider: { id: 'anthropic', model: 'claude-sonnet-5', apiKeyEnv: 'ANTHROPIC_API_KEY' },
    };
    const got = providerFor(base([t]), t);
    assert.deepEqual(got, {
      id: 'anthropic',
      model: 'claude-sonnet-5',
      apiKeyEnv: 'ANTHROPIC_API_KEY',
    });
    assert.equal(got.url, undefined, 'must not inherit the Ollama host URL');
    assert.equal(got.concurrency, undefined, "must not inherit Ollama's serial limit");
  });

  test('a backend switch that omits its own model throws', () => {
    const t: TargetLocale = { code: 'ja', name: 'Japanese', provider: { id: 'anthropic' } };
    assert.throws(() => providerFor(base([t]), t), /requires its own "model"/);
  });

  test('concurrency is resolved per locale, not once per run', () => {
    // A single run mixing a local Ollama locale with a cloud one must not apply
    // Ollama's serial limit to the cloud locale, nor the cloud default to Ollama.
    const local: TargetLocale = { code: 'bg', name: 'Bulgarian' };
    const cloud: TargetLocale = {
      code: 'ja',
      name: 'Japanese',
      provider: { id: 'anthropic', model: 'claude-sonnet-5' },
    };
    const cfg = base([local, cloud]);
    assert.equal(concurrencyFor(providerFor(cfg, local)), 1, 'ollama locale stays serial');
    assert.equal(concurrencyFor(providerFor(cfg, cloud)), 4, 'cloud locale gets the cloud default');

    // Backend defaults when nothing is specified anywhere.
    assert.equal(concurrencyFor({ id: 'ollama', model: 'x' }), 1);
    assert.equal(concurrencyFor({ id: 'anthropic', model: 'x' }), 4);
  });

  test('same-backend override keeps project url/concurrency', () => {
    const t: TargetLocale = {
      code: 'ja',
      name: 'Japanese',
      provider: { id: 'ollama', model: 'qwen2.5:72b' },
    };
    const got = providerFor(base([t]), t);
    assert.equal(got.url, 'http://host:11434', 'same backend still inherits the host');
    assert.equal(got.concurrency, 1);
    assert.equal(got.model, 'qwen2.5:72b');
  });

  test('judge merges the same way', () => {
    const t: TargetLocale = { code: 'bg', name: 'Bulgarian', judge: { model: 'claude-opus-5' } };
    const cfg = base([t], {
      id: 'anthropic',
      model: 'claude-sonnet-5',
      apiKeyEnv: 'ANTHROPIC_API_KEY',
    });
    assert.deepEqual(judgeFor(cfg, t), {
      id: 'anthropic',
      model: 'claude-opus-5',
      apiKeyEnv: 'ANTHROPIC_API_KEY',
    });
  });

  test('judgeFor returns undefined when neither level defines one', () => {
    const t: TargetLocale = { code: 'es', name: 'Spanish' };
    assert.equal(judgeFor(base([t]), t), undefined);
  });

  test('an incomplete per-locale judge throws instead of building a broken provider', () => {
    // No project-level judge to inherit `id` from. Failing here beats an opaque
    // "Unknown provider undefined" at the first API call.
    const t: TargetLocale = { code: 'bg', name: 'Bulgarian', judge: { model: 'claude-opus-5' } };
    assert.throws(() => judgeFor(base([t]), t), /incomplete provider/);
  });

  test('a locale-only judge with both id and model is accepted', () => {
    const t: TargetLocale = {
      code: 'bg',
      name: 'Bulgarian',
      judge: { id: 'gemini', model: 'gemini-2.5-pro', apiKeyEnv: 'GEMINI_API_KEY' },
    };
    assert.deepEqual(judgeFor(base([t]), t), {
      id: 'gemini',
      model: 'gemini-2.5-pro',
      apiKeyEnv: 'GEMINI_API_KEY',
    });
  });

  test('overrides do not leak between locales', () => {
    const bg: TargetLocale = { code: 'bg', name: 'Bulgarian', provider: { model: 'bggpt' } };
    const ja: TargetLocale = { code: 'ja', name: 'Japanese' };
    const cfg = base([bg, ja]);
    assert.equal(providerFor(cfg, bg).model, 'bggpt');
    assert.equal(providerFor(cfg, ja).model, 'translategemma:27b');
  });
});

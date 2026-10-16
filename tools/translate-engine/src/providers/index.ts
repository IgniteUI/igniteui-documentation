import type { Provider, ProviderConfig, TargetLocale, Translator } from '../types.js';
import { makeTranslator, type PromptSettings } from '../prompt.js';
import { anthropicProvider } from './anthropic.js';
import { geminiProvider } from './gemini.js';
import { ollamaProvider } from './ollama.js';
import { openaiProvider } from './openai.js';
import { githubModelsProvider } from './github-models.js';
import { exchangeProvider } from './exchange.js';

// One registry entry per provider id: `provider` builds a raw completion
// Provider, and the Translator for a locale is derived from it via
// makeTranslator. Adding a provider = one entry.
interface ProviderEntry {
  provider: (cfg: ProviderConfig) => Provider;
}

const REGISTRY: Record<ProviderConfig['id'], ProviderEntry> = {
  anthropic: { provider: anthropicProvider },
  gemini: { provider: geminiProvider },
  openai: { provider: openaiProvider },
  ollama: { provider: ollamaProvider },
  'github-models': { provider: githubModelsProvider },
  exchange: { provider: exchangeProvider },
};

function entryFor(cfg: ProviderConfig): ProviderEntry {
  const entry = REGISTRY[cfg.id];
  if (!entry) throw new Error(`Unknown provider "${(cfg as ProviderConfig).id}"`);
  return entry;
}

export function createProvider(cfg: ProviderConfig): Provider {
  return entryFor(cfg).provider(cfg);
}

/** Build the prompt-driven Translator for a target locale. */
export function makeTranslatorFor(
  cfg: ProviderConfig,
  target: TargetLocale,
  settings: PromptSettings,
): Translator {
  return makeTranslator(createProvider(cfg), target, settings);
}

export function requireApiKey(cfg: ProviderConfig, fallbackEnv: string): string {
  const envName = cfg.apiKeyEnv ?? fallbackEnv;
  const key = process.env[envName];
  if (!key) {
    throw new Error(
      `Provider "${cfg.id}" needs an API key: set ${envName} in the environment or in a .env next to your config`,
    );
  }
  return key;
}

// Shared retry for transient failures (429 / 5xx / network). The per-call cost
// of one file is small, so a simple bounded exponential backoff is enough.
export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempts = 4,
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
        const retryAfter = Number(res.headers.get('retry-after'));
        const delay =
          Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1500 * 2 ** attempt;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
    } catch (err) {
      lastErr = err;
      // network error - back off and retry
      await new Promise((r) => setTimeout(r, 1500 * 2 ** attempt));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

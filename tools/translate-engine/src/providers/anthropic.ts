import type { CompleteOptions, Provider, ProviderConfig } from '../types.js';
import { fetchWithRetry, requireApiKey } from './index.js';

// Claude via the Messages API (plain fetch - keeps the three providers
// symmetric and dependency-free). Suggested models:
//   translator: claude-haiku-4-5  (cheap baseline)  |  claude-sonnet-5 (quality)
//   judge:      a different model than the translator
export function anthropicProvider(cfg: ProviderConfig): Provider {
  const apiKey = requireApiKey(cfg, 'ANTHROPIC_API_KEY');
  const maxTokensDefault = cfg.maxTokens ?? 16000;

  return {
    id: 'anthropic',
    model: cfg.model,

    async complete(prompt: string, opts: CompleteOptions = {}): Promise<string> {
      const res = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: cfg.model,
          max_tokens: opts.maxTokens ?? maxTokensDefault,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>;
        stop_reason?: string;
      };
      const text = (data.content ?? [])
        .filter((b) => b.type === 'text' && typeof b.text === 'string')
        .map((b) => b.text)
        .join('');
      if (!text) throw new Error(`Anthropic returned no text (stop_reason: ${data.stop_reason})`);
      if (data.stop_reason === 'max_tokens') {
        // A truncated translation is worse than a failed one, the validator
        // would see a structurally broken file. Fail loudly instead.
        throw new Error('Anthropic response truncated at max_tokens — raise provider.maxTokens');
      }
      return text;
    },
  };
}

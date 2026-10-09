import type { CompleteOptions, Provider, ProviderConfig } from '../types.js';
import { fetchWithRetry, requireApiKey } from './index.js';

// OpenAI via the Chat Completions API (plain fetch - keeps every provider
// symmetric and dependency-free). Suggested models:
//   translator/judge comparison point: gpt-5.5  |  cheaper baseline: gpt-4.1
// `max_completion_tokens` (not the deprecated `max_tokens`) is required by
// current-generation models. `response_format: json_object` needs the word
// "JSON" somewhere in the prompt — every buildBatchPrompt/judge prompt in
// this toolkit already says "Return ONLY a JSON object", so this is safe.
export function openaiProvider(cfg: ProviderConfig): Provider {
  const apiKey = requireApiKey(cfg, 'OPENAI_API_KEY');
  const maxTokensDefault = cfg.maxTokens ?? 16000;

  return {
    id: 'openai',
    model: cfg.model,

    async complete(prompt: string, opts: CompleteOptions = {}): Promise<string> {
      const res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: cfg.model,
          max_completion_tokens: opts.maxTokens ?? maxTokensDefault,
          messages: [{ role: 'user', content: prompt }],
          ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
        }),
      });
      const data = (await res.json()) as {
        choices?: Array<{
          message?: { content?: string };
          finish_reason?: string;
        }>;
      };
      const choice = data.choices?.[0];
      const text = choice?.message?.content ?? '';
      if (!text)
        throw new Error(`OpenAI returned no text (finish_reason: ${choice?.finish_reason})`);
      if (choice?.finish_reason === 'length') {
        throw new Error(
          'OpenAI response truncated at max_completion_tokens — raise provider.maxTokens',
        );
      }
      return text;
    },
  };
}

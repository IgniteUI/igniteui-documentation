import type { CompleteOptions, Provider, ProviderConfig } from '../types.js';
import { fetchWithRetry, requireApiKey } from './index.js';

// Google Gemini via the Generative Language REST API. Suggested test models:
//   gemini-3.5-flash (fast/cheap), gemini-3.1-pro (quality),
//   gemini-2.5-flash-lite (very cheap screening runs)
// `json: true` uses responseMimeType so batch responses parse reliably.
export function geminiProvider(cfg: ProviderConfig): Provider {
  const apiKey = requireApiKey(cfg, 'GEMINI_API_KEY');
  const maxTokensDefault = cfg.maxTokens ?? 16000;

  return {
    id: 'gemini',
    model: cfg.model,

    async complete(prompt: string, opts: CompleteOptions = {}): Promise<string> {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent`;
      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: opts.maxTokens ?? maxTokensDefault,
            ...(opts.json ? { responseMimeType: 'application/json' } : {}),
          },
        }),
      });
      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
          finishReason?: string;
        }>;
      };
      const cand = data.candidates?.[0];
      const text = (cand?.content?.parts ?? []).map((p) => p.text ?? '').join('');
      if (!text) throw new Error(`Gemini returned no text (finishReason: ${cand?.finishReason})`);
      if (cand?.finishReason === 'MAX_TOKENS') {
        throw new Error('Gemini response truncated at maxOutputTokens - raise provider.maxTokens');
      }
      return text;
    },
  };
}

import type { CompleteOptions, Provider, ProviderConfig } from '../types.js';
import { fetchWithRetry, requireApiKey } from './index.js';

// GitHub Models - GitHub's unified inference API.
// One OpenAI-compatible /chat/completions endpoint serves the WHOLE catalog
// (OpenAI, Meta Llama, Mistral, Cohere, Phi, …), so the only thing that changes
// per model is the `model` id - get valid ids from `gh models list`
// (e.g. 'openai/gpt-4o', 'mistral-ai/mistral-large-2411', 'meta/llama-3.3-70b-instruct').
//
// Auth is a GitHub token (a PAT locally, or the Actions token with
// `permissions: models: read` in CI) - no vendor API key. Defaults to GITHUB_TOKEN.
//
// Note: not every catalog model supports `response_format: json_object` - the
// batch/judge JSON path may behave differently on some. extractJsonObject already
// tolerates fenced/loose JSON, but verify the specific model you pick.
// If GitHub moves the inference endpoint, update this one constant.
const GITHUB_MODELS_BASE = 'https://models.github.ai/inference';

export function githubModelsProvider(cfg: ProviderConfig): Provider {
  const token = requireApiKey(cfg, 'GITHUB_TOKEN');
  const maxTokensDefault = cfg.maxTokens ?? 16000;

  return {
    id: 'github-models',
    model: cfg.model,

    async complete(prompt: string, opts: CompleteOptions = {}): Promise<string> {
      const res = await fetchWithRetry(`${GITHUB_MODELS_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: cfg.model,
          max_tokens: opts.maxTokens ?? maxTokensDefault,
          messages: [{ role: 'user', content: prompt }],
          ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
        }),
      });
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
      };
      const choice = data.choices?.[0];
      const text = choice?.message?.content ?? '';
      if (!text) {
        throw new Error(`GitHub Models returned no text (finish_reason: ${choice?.finish_reason})`);
      }
      if (choice?.finish_reason === 'length') {
        throw new Error(
          'GitHub Models response truncated at max_tokens - raise provider.maxTokens',
        );
      }
      return text;
    },
  };
}

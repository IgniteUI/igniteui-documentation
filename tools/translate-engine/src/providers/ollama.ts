import type { CompleteOptions, Provider, ProviderConfig } from '../types.js';
import { fetchWithRetry } from './index.js';

// Local Ollama - the free provider for development and pipeline experiments.
// Single-stream by design: run with concurrency 1. Quality on CJK technical
// prose is below the cloud frontier models; fine for testing the pipeline,
// risky as the production translator.
export function ollamaProvider(cfg: ProviderConfig): Provider {
  const url = cfg.url ?? process.env.OLLAMA_URL ?? 'http://localhost:11434';
  const numCtx = cfg.numCtx ?? 16384;

  // num_ctx is a HARD budget covering prompt AND completion, and Ollama enforces
  // it by SILENTLY DROPPING the overflow - no error, no stop_reason, just a
  // shorter answer. translateBody sends a whole page's prose as one completion,
  // so a large page quietly comes back with sections missing, and the only
  // downstream symptom is validator brand/tag counts that don't add up.
  //
  // Estimate the budget before each call and warn. A translation into a
  // non-Latin script is usually LONGER in tokens than its English source, so the
  // output allowance is deliberately not smaller than the input. Warning rather
  // than throwing keeps a run going (the file is still written and flagged), but
  // makes the cause visible instead of leaving it to be inferred from scores.
  const warnIfContextTight = (prompt: string): void => {
    const promptTokens = Math.ceil(prompt.length / 4);
    const projected = promptTokens * 2; // prompt + a same-or-larger completion
    if (projected > numCtx) {
      console.warn(
        `  Warning [ollama] prompt ~${promptTokens} tok + completion likely exceeds num_ctx ` +
          `${numCtx} - Ollama will TRUNCATE, silently dropping content. Raise provider.numCtx ` +
          `(needs host VRAM for the larger KV cache) or split the page.`,
      );
    }
  };

  return {
    id: 'ollama',
    model: cfg.model,

    async complete(prompt: string, opts: CompleteOptions = {}): Promise<string> {
      // STREAMING IS NOT OPTIONAL HERE. Node's global fetch (undici) aborts a
      // request whose response HEADERS haven't arrived within 300s, and a
      // non-streaming Ollama call withholds them until the whole generation is
      // done. A full 6000-char batch (prompt.ts BATCH_LIMITS) on a 27B model at
      // ~12 tok/s takes 200-400s to generate, so `stream: false` fails with a
      // bare "fetch failed" on the larger batches - then burns four retries
      // (~20 min) doing it again. With stream:true headers return immediately
      // and each NDJSON chunk resets the body-idle timer, so only a genuinely
      // stalled model times out.
      warnIfContextTight(prompt);
      const res = await fetchWithRetry(`${url}/api/generate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: cfg.model,
          prompt,
          stream: true,
          // Only sent when explicitly configured, so non-reasoning models are
          // unaffected and a reasoning model keeps its own default unless asked.
          ...(cfg.think === undefined ? {} : { think: cfg.think }),
          ...(opts.json ? { format: 'json' } : {}),
          options: { temperature: 0.1, num_ctx: numCtx },
        }),
      });
      if (!res.body) throw new Error('Ollama returned no response body');

      // NDJSON: one JSON object per line, each carrying an incremental
      // `response` fragment; the final object has done:true. A chunk can split
      // mid-line, so hold the trailing partial line in `buf` until it completes.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let out = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          const evt = JSON.parse(line) as { response?: string; error?: string };
          if (evt.error) throw new Error(`Ollama error: ${evt.error}`);
          if (evt.response) out += evt.response;
        }
      }
      if (buf.trim()) {
        const evt = JSON.parse(buf) as { response?: string; error?: string };
        if (evt.error) throw new Error(`Ollama error: ${evt.error}`);
        if (evt.response) out += evt.response;
      }

      if (!out) throw new Error('Ollama returned an empty response');
      return out;
    },
  };
}

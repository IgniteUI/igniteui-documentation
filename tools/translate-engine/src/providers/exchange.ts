import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { CompleteOptions, Provider, ProviderConfig } from '../types.js';

// Exchange provider: hands every completion off through FILES instead of an
// API call, so something outside this process - a person, or the model behind
// an interactive Claude Code session - answers the engine's prompts while the
// engine keeps doing everything else (masking, restore, validation, TM,
// reports) exactly as it does for an API provider.
//
// Why: the prompts are the engine's whole contract with a model. Routing them
// through files is what lets an author run the pipeline inside their own
// Claude Code session under their own seat (the `/translate`-skill idea), and
// it is also the only way to use a model the engine has no adapter for. The
// prompt is written verbatim; the answer is read verbatim.
//
// Layout under `cfg.dir`:
//   <hash>.prompt.txt    the exact prompt (hash = sha256 prefix of it)
//   <hash>.meta.json     { json, chars, preview, requested, firstSeen }
//   <hash>.answer.txt    the reply to attempt 1
//   <hash>.answer-N.txt  the reply to attempt N. The engine re-asks the SAME
//                        prompt when a reply is unusable (a dropped token, an
//                        echoed input), and a real provider samples afresh,
//                        so every attempt gets its own answer file.
//
// Modes (`cfg.mode`, else EXCHANGE_MODE in the environment):
//   replay (default)  Answer present -> returned. Attempt 1 missing -> the
//                     prompt is written and PendingAnswerError is thrown: the
//                     translate command records the file as FAILED and writes
//                     nothing, the judge command skips the file. A LATER
//                     attempt missing -> the previous attempt's answer is
//                     returned (the engine proceeds as if the retry did not
//                     help) and the request is recorded in meta, so the retry
//                     can be answered and the file re-run.
//   record            Answer missing -> the prompt is written and a DUMMY is
//                     returned so the pipeline keeps moving and every prompt
//                     of a file surfaces in ONE `translate --dry-run` pass
//                     (nothing is written or memorised in a dry run). The
//                     dummy is the source with a marker appended, never the
//                     source itself: an unchanged reply is what the engine
//                     treats as an echo and retries one item at a time, which
//                     would record prompts a real run never issues.

export class PendingAnswerError extends Error {
  constructor(
    public readonly promptFile: string,
    public readonly attempt: number,
  ) {
    super(
      `exchange: no answer yet for ${path.basename(promptFile)}` +
        (attempt > 1 ? ` (attempt ${attempt})` : '') +
        ' - write the answer file and re-run',
    );
    this.name = 'PendingAnswerError';
  }
}

export const PENDING_MARK = '⟦pending⟧';

export function hashOf(prompt: string): string {
  return createHash('sha256').update(prompt, 'utf8').digest('hex').slice(0, 12);
}

export function answerFileName(hash: string, attempt: number): string {
  return attempt > 1 ? `${hash}.answer-${attempt}.txt` : `${hash}.answer.txt`;
}

// The JSON object a batch prompt ends with (buildBatchPrompt appends it as the
// last line). Judge prompts also ask for JSON but carry no such object.
function trailingJson(prompt: string): Record<string, unknown> | null {
  const start = prompt.lastIndexOf('\n{');
  if (start < 0) return null;
  try {
    const parsed = JSON.parse(prompt.slice(start + 1)) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function sourceOf(prompt: string): string {
  const m = prompt.match(/<source>\n([\s\S]*?)\n<\/source>/);
  return m ? m[1] : prompt;
}

/** What `record` mode hands back for an unanswered prompt. Exported for tests. */
export function dummyAnswer(prompt: string, json: boolean): string {
  if (json) {
    const obj = trailingJson(prompt);
    if (!obj) return '{}';
    return JSON.stringify(
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, `${String(v)} ${PENDING_MARK}`])),
    );
  }
  return `${sourceOf(prompt)}\n${PENDING_MARK}`;
}

// A one-line handle for whoever dispatches the answers: the page's H1 when the
// prompt carries one (body and judge prompts), else the first batch value.
function previewOf(prompt: string, json: boolean): string {
  const h1 = prompt.match(/^# .+$/m);
  let text = h1 ? h1[0] : '';
  if (!text && json) {
    const obj = trailingJson(prompt);
    text = obj ? String(Object.values(obj)[0] ?? '') : '';
  }
  if (!text) {
    text =
      sourceOf(prompt)
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l && !l.startsWith('__')) ?? '';
  }
  return text.replace(/\s+/g, ' ').slice(0, 90);
}

async function readIfExists(file: string): Promise<string | undefined> {
  try {
    return (await fs.readFile(file, 'utf-8')).replace(/^﻿/, '');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw err;
  }
}

export function exchangeProvider(cfg: ProviderConfig): Provider {
  if (!cfg.dir) {
    throw new Error('exchange provider needs "dir": the directory prompts and answers go through');
  }
  const dir = cfg.dir;
  const mode = cfg.mode ?? (process.env.EXCHANGE_MODE === 'record' ? 'record' : 'replay');
  // Per process: how many times each prompt has been asked, so a re-ask maps
  // to its own answer file.
  const asked = new Map<string, number>();

  return {
    id: 'exchange',
    model: cfg.model,

    async complete(prompt: string, opts: CompleteOptions = {}): Promise<string> {
      await fs.mkdir(dir, { recursive: true });
      const json = opts.json === true;
      const hash = hashOf(prompt);
      const attempt = (asked.get(hash) ?? 0) + 1;
      asked.set(hash, attempt);

      const promptFile = path.join(dir, `${hash}.prompt.txt`);
      if ((await readIfExists(promptFile)) === undefined) {
        await fs.writeFile(promptFile, prompt, 'utf-8');
      }
      const metaFile = path.join(dir, `${hash}.meta.json`);
      const previous = JSON.parse((await readIfExists(metaFile)) ?? '{}') as {
        requested?: number;
        firstSeen?: string;
      };
      await fs.writeFile(
        metaFile,
        JSON.stringify(
          {
            json,
            chars: prompt.length,
            preview: previewOf(prompt, json),
            requested: Math.max(previous.requested ?? 0, attempt),
            firstSeen: previous.firstSeen ?? new Date().toISOString(),
          },
          null,
          2,
        ) + '\n',
        'utf-8',
      );

      const answer = await readIfExists(path.join(dir, answerFileName(hash, attempt)));
      if (answer !== undefined) return answer;
      if (mode === 'record') return dummyAnswer(prompt, json);
      for (let earlier = attempt - 1; earlier >= 1; earlier--) {
        const reuse = await readIfExists(path.join(dir, answerFileName(hash, earlier)));
        if (reuse !== undefined) {
          console.warn(
            `  [exchange] ${hash}: attempt ${attempt} has no answer yet - reusing attempt ${earlier}; ` +
              `supply ${answerFileName(hash, attempt)} and re-run the file for a fresh retry`,
          );
          return reuse;
        }
      }
      throw new PendingAnswerError(promptFile, attempt);
    },
  };
}

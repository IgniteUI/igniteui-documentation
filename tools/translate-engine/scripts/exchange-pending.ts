// List what an exchange provider (src/providers/exchange.ts) is waiting on:
// every prompt whose latest requested attempt has no answer file yet, largest
// first, with the paths to read and to write. `--all` lists answered ones too.
//
//   npx tsx scripts/exchange-pending.ts --dir <exchange dir> [--all]
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { answerFileName } from '../src/providers/exchange.js';

interface Meta {
  json: boolean;
  chars: number;
  preview: string;
  requested?: number;
}

interface Row {
  hash: string;
  kind: string;
  chars: number;
  attempt: number;
  answered: boolean;
  preview: string;
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: { dir: { type: 'string' }, all: { type: 'boolean', default: false } },
  });
  if (!values.dir) {
    console.error('usage: npx tsx scripts/exchange-pending.ts --dir <exchange dir> [--all]');
    process.exit(1);
  }
  const dir = path.resolve(values.dir);
  const names = (await fs.readdir(dir).catch(() => [] as string[])).filter((f) =>
    f.endsWith('.meta.json'),
  );
  const rows: Row[] = [];
  for (const name of names) {
    const hash = name.slice(0, -'.meta.json'.length);
    const meta = JSON.parse(await fs.readFile(path.join(dir, name), 'utf-8')) as Meta;
    const attempt = meta.requested ?? 1;
    const answered = await fs.access(path.join(dir, answerFileName(hash, attempt))).then(
      () => true,
      () => false,
    );
    if (answered && !values.all) continue;
    rows.push({
      hash,
      kind: meta.json ? 'json' : 'text',
      chars: meta.chars,
      attempt,
      answered,
      preview: meta.preview,
    });
  }
  rows.sort((a, b) => b.chars - a.chars);
  console.log(`${rows.length} ${values.all ? 'prompt(s)' : 'pending prompt(s)'} in ${dir}`);
  for (const r of rows) {
    console.log(
      `${r.answered ? 'answered' : 'PENDING '} ${r.hash}  ${r.kind}  ${String(r.chars).padStart(6)} chars  attempt ${r.attempt}  ${r.preview}`,
    );
    console.log(`    prompt: ${path.join(dir, `${r.hash}.prompt.txt`)}`);
    console.log(`    answer: ${path.join(dir, answerFileName(r.hash, r.attempt))}`);
  }
}

await main();

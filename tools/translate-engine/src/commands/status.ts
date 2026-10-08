import { filterTargetLocales } from '../cli-support.js';
import { discover, summarize } from '../discover.js';
import type { ResolvedConfig } from '../types.js';

export async function cmdStatus(
  cfg: ResolvedConfig,
  locales: string[] | undefined,
  list: boolean,
  json: boolean,
): Promise<number> {
  const files = await discover(cfg, locales);
  const targets = filterTargetLocales(cfg, locales);
  const summary = summarize(files, targets);

  if (json) {
    console.log(JSON.stringify({ project: cfg.name, files: files.length, summary }, null, 2));
    return 0;
  }

  console.log(`${cfg.name} - ${files.length} source files (${cfg.source.locale})\n`);
  console.log('locale   missing   done');
  for (const t of targets) {
    const s = summary[t.code];
    console.log(`${t.code.padEnd(9)}${String(s.missing).padEnd(10)}${s.done}`);
  }
  if (list) {
    for (const f of files) {
      const bad = Object.entries(f.targets).filter(([, v]) => v.state !== 'done');
      if (bad.length)
        console.log(`  ${f.relPath}: ${bad.map(([c, v]) => `${c}=${v.state}`).join(' ')}`);
    }
  }
  return 0;
}

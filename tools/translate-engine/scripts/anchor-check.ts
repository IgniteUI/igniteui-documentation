#!/usr/bin/env tsx
// Anchor-link audit — do `[text](page.mdx#section)` links still resolve after
// the headings they point at were translated?
//
//   npx tsx scripts/anchor-check.ts --config configs/<project>.config.mjs --locale ja
//   npx tsx scripts/anchor-check.ts --source <en-dir> --target <translated-dir>
//
// The docs build derives every heading's id from its TEXT (Astro's built-in
// rehypeHeadingIds and igniteui-astro-components' rehypeHeadingAnchors, both
// via github-slugger). Translate `## Column Chart Example` and the id changes
// from `#column-chart-example` to `#縦棒グラフの例` — but the pipeline masks link
// URLs and restores them byte-for-byte, so every anchor that pointed at a
// translated heading now points at nothing. Ten JP pilot files: 5 of 5
// checkable anchors broken. This is locale-independent.
//
// For every anchor link in the target tree, the target FILE's headings are
// slugged with the same slugger the build uses and the anchor is looked up
// among them. `{Platform}` in a heading is substituted by the build before MDX
// compilation, and the corpus writes such anchors as `#{PlatformLower}-…`, so
// that token is mapped accordingly. Other `{Tokens}` (`{ComponentTitle}` in the
// grids' `_shared` pages) expand per platform in a way that cannot be resolved
// statically; a link into such a heading is reported as unverifiable rather
// than broken.
//
// Exit code 0 = every checkable anchor resolves, 2 = at least one is broken.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';
import { loadConfig } from '../src/config.js';

function argOf(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function resolveTrees(): Promise<{ source: string; target: string; label: string }> {
  const configPath = argOf('--config');
  if (configPath) {
    const cfg = await loadConfig(configPath);
    const t = cfg.targets.find((x) => x.code === argOf('--locale')) ?? cfg.targets[0];
    const targetDir = t.dir ?? `content/${t.code}`;
    return {
      source: cfg.sourceDirAbs,
      target: path.resolve(cfg.rootAbs, targetDir),
      label: `${cfg.name} / ${t.code}`,
    };
  }
  const source = argOf('--source');
  const target = argOf('--target');
  if (!source || !target) {
    console.error(
      'usage: tsx scripts/anchor-check.ts --config <path> [--locale <code>]\n' +
        '       tsx scripts/anchor-check.ts --source <en-dir> --target <translated-dir>',
    );
    process.exit(1);
  }
  return { source: path.resolve(source), target: path.resolve(target), label: target };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}

// Letters only, so it survives slugging: github-slugger strips everything that
// is not a letter, digit, space or hyphen.
const PLATFORM = 'qzplatformtokenqz';
const OTHER_TOKEN = /\{(?!Platform\})[A-Za-z][A-Za-z0-9]*\}/;

interface Headings {
  slugs: Set<string>;
  /** Any heading carried a `{Token}` other than `{Platform}`. */
  templated: boolean;
}

function headingsOf(text: string): Headings {
  const slugger = new GithubSlugger();
  const slugs = new Set<string>();
  let templated = false;
  for (const line of text.split('\n')) {
    const m = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (!m) continue;
    if (OTHER_TOKEN.test(m[1])) templated = true;
    const slug = slugger
      .slug(m[1].replace(/\{Platform\}/g, PLATFORM))
      .replace(new RegExp(PLATFORM, 'g'), '{PlatformLower}');
    slugs.add(slug);
  }
  return { slugs, templated };
}

const { source, target, label } = await resolveTrees();
for (const [name, dir] of [
  ['source', source],
  ['target', target],
] as const) {
  const ok = await fs.stat(dir).then(
    (s) => s.isDirectory(),
    () => false,
  );
  if (!ok) {
    // The pilot configs pick the output dir from an env knob (JP_OUT=…), so a
    // config that loads fine can still point at a tree that was never written.
    console.error(`error: ${name} directory does not exist: ${dir}`);
    process.exit(1);
  }
}
const files = await walk(target);
const cache = new Map<string, Headings | null>();
const headingsFor = async (file: string): Promise<Headings | null> => {
  if (!cache.has(file)) {
    try {
      cache.set(file, headingsOf(await fs.readFile(file, 'utf-8')));
    } catch {
      cache.set(file, null);
    }
  }
  return cache.get(file) ?? null;
};

let total = 0;
let ok = 0;
let unverifiable = 0;
let missingTarget = 0;
const broken: string[] = [];

for (const f of files) {
  const text = await fs.readFile(f, 'utf-8');
  for (const m of text.matchAll(/\]\(([^)#\s]*\.mdx?)#([^)\s]+)\)/g)) {
    total++;
    const [, page, anchor] = m;
    const targetFile = page.startsWith('/')
      ? path.join(target, page)
      : path.resolve(path.dirname(f), page);
    const h = await headingsFor(targetFile);
    if (!h) {
      missingTarget++;
      continue;
    }
    if (h.slugs.has(anchor)) ok++;
    else if (h.templated) unverifiable++;
    else broken.push(`${path.relative(target, f)} -> ${page}#${anchor}`);
  }
}

console.log(`anchor check: ${label}`);
console.log(`  source ${source}\n  target ${target}\n`);
console.log(
  `${total} anchor link(s): ${ok} resolve, ${broken.length} broken, ` +
    `${unverifiable} unverifiable (templated heading), ${missingTarget} target file not in tree`,
);
for (const b of broken) console.log(`  x ${b}`);
process.exit(broken.length ? 2 : 0);

#!/usr/bin/env node
/**
 * chrome-sync — copy the marketing site's exported header/footer into this repo.
 *
 * The marketing site (Marketing-Infragistics) is the single source of the
 * Infragistics header and footer. It publishes them at
 * /assets/chrome/fragment.html (src/lib/chromeExport.ts there). This script
 * fetches that fragment, validates it against the ig-chrome contract, downloads
 * everything it needs and writes a self-contained snapshot, which the site
 * renders through igniteui-astro-components' igChrome() integration:
 *
 *   <out>/manifest.json      contract, build hash, source, sync time
 *   <out>/fragment.html      the fragment, every asset URL rewritten to
 *                            %IG_CHROME_ASSETS%/… (resolved per site, under its
 *                            base path, at build time)
 *   <out>/assets/chrome.css  the versioned CSS the fragment was built with
 *   <out>/assets/chrome.js   the versioned JS the fragment was built with
 *   <out>/assets/media/*     every image the markup or CSS loads from the
 *                            source host (footer badges, logos, framework marks)
 *
 * After the sync nothing is loaded from the marketing host at runtime except
 * the Google Fonts stylesheet the fragment links.
 *
 * Writes nothing when the fragment's build hash equals the snapshot's, so the
 * sync is a no-op until the marketing site changes the chrome.
 * In GitHub Actions it sets the `changed` and `build` step outputs.
 *
 *   node scripts/chrome-sync.mjs --source <url | path/to/dist/assets/chrome/fragment.html> --out ig-chrome/production
 *   node scripts/chrome-sync.mjs ... --allow-missing   # a 404 source is not an error (not published yet)
 *   node scripts/chrome-sync.mjs ... --force           # rewrite even when the build hash is unchanged
 *
 * The validation is igniteui-astro-components' own (the same checks the build
 * and tripwire's NavCache apply), so a snapshot this writes always builds.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseFragment, ASSET_TOKEN } from 'igniteui-astro-components/chrome/contract';

const MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_EXT = /\.(?:png|jpe?g|webp|avif|gif|svg|ico)$/i;

class NotPublished extends Error {}

function parseArgs(argv) {
  const args = { source: '', out: '', force: false, allowMissing: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source') args.source = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--force') args.force = true;
    else if (a === '--allow-missing') args.allowMissing = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!args.help && (!args.source || !args.out)) {
    throw new Error('Both --source and --out are required (see --help).');
  }
  return args;
}

const isUrl = (s) => /^https?:\/\//i.test(s);

async function fetchBytes(url, { html = false } = {}) {
  let res;
  try {
    res = await fetch(url, {
      redirect: 'error', // never follow a redirect to another host
      headers: { 'User-Agent': 'igniteui-chrome-sync/1.0' },
    });
  } catch (err) {
    // A host that can't be reached is a failure, not "not published yet".
    const cause = err.cause?.code || err.cause?.message || err.message;
    throw new Error(`${url} could not be reached (${cause})`);
  }
  if (res.status === 404 && html) throw new NotPublished(`${url} answered HTTP 404`);
  if (!res.ok) throw new Error(`${url} answered HTTP ${res.status}`);
  if (html) {
    const type = (res.headers.get('content-type') || '').split(';')[0].trim();
    if (type !== 'text/html') {
      throw new Error(`${url} answered with Content-Type '${type || '(none)'}', not text/html`);
    }
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) throw new Error(`${url} returned ${buf.length} bytes, over the ${MAX_BYTES} limit`);
  return buf;
}

/**
 * Where to read the fragment's assets from. From a URL source, the asset URLs
 * themselves. From a local marketing build (dist/assets/chrome/fragment.html),
 * the same paths inside that dist folder, whatever host the URLs name.
 */
function makeReader(source) {
  if (isUrl(source)) {
    return {
      fragment: () => fetchBytes(source, { html: true }),
      asset: (url) => fetchBytes(url),
    };
  }
  const file = path.resolve(source);
  const distRoot = path.dirname(path.dirname(path.dirname(file))); // dist/assets/chrome/fragment.html -> dist
  return {
    fragment: async () => fs.readFileSync(file),
    asset: async (url) => fs.readFileSync(path.join(distRoot, decodeURIComponent(new URL(url).pathname))),
  };
}

/** A collision-free, flat file name for an image path: /assets/logos/fw-react.svg -> assets-logos-fw-react.svg */
const mediaName = (pathname) =>
  pathname.startsWith('/assets/chrome/media/')
    ? pathname.slice('/assets/chrome/media/'.length)
    : pathname.replace(/^\/+/, '').replace(/[^\w.-]+/g, '-');

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]);
    return;
  }

  const outDir = path.resolve(args.out);
  const read = makeReader(args.source);

  console.log(`[chrome-sync] ${args.out}: reading ${args.source}`);
  let html;
  try {
    html = (await read.fragment()).toString('utf8');
  } catch (err) {
    if (err instanceof NotPublished && args.allowMissing) {
      console.log(`[chrome-sync] ${args.out}: not published yet (${err.message}); keeping the current snapshot`);
      setOutputs({ changed: 'false', build: '' });
      return;
    }
    throw err;
  }
  const parsed = parseFragment(html);

  const manifestFile = path.join(outDir, 'manifest.json');
  const previous = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : null;
  if (previous && previous.build === parsed.build && !args.force) {
    console.log(`[chrome-sync] ${args.out}: up to date, build ${parsed.build}`);
    setOutputs({ changed: 'false', build: parsed.build });
    return;
  }

  /* The versioned CSS and JS the head links. */
  const cssUrl = /href="([^"]+\/chrome\.css)"/.exec(parsed.head)?.[1];
  const jsUrl = /src="([^"]+\/chrome\.js)"/.exec(parsed.head)?.[1];
  if (!cssUrl || !jsUrl) throw new Error("The fragment's head does not link chrome.css and chrome.js.");
  const origin = new URL(cssUrl).origin;

  const css = (await read.asset(cssUrl)).toString('utf8');
  const js = (await read.asset(jsUrl)).toString('utf8');

  /* Every image on the source host the markup or CSS loads: absolute URLs on
   * the source origin, and root-relative ones (the CSS uses those). */
  const images = new Map(); // pathname -> media file name
  const collect = (text, pattern) => {
    for (const m of text.matchAll(pattern)) {
      const url = new URL(m[1].replace(/&amp;/g, '&'), origin);
      if (url.origin === origin && IMAGE_EXT.test(url.pathname)) images.set(url.pathname, mediaName(url.pathname));
    }
  };
  const escapedOrigin = origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  collect(html, new RegExp(`(${escapedOrigin}/[^"'\\s)]+)`, 'g'));
  collect(css, /url\(\s*["']?(\/[^"')]+)["']?\s*\)/g);

  const tmp = `${outDir}.tmp-${process.pid}`;
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmp, 'assets', 'media'), { recursive: true });

  for (const [pathname, name] of images) {
    fs.writeFileSync(path.join(tmp, 'assets', 'media', name), await read.asset(origin + pathname));
  }

  /* Rewrite the head's CSS/JS and every image to the asset token, so the
   * integration can serve them from each site's own build. */
  let fragment = html.replace(cssUrl, `${ASSET_TOKEN}/chrome.css`).replace(jsUrl, `${ASSET_TOKEN}/chrome.js`);
  let cssOut = css;
  for (const [pathname, name] of images) {
    fragment = fragment.split(origin + pathname).join(`${ASSET_TOKEN}/media/${name}`);
    // CSS sits at the root of the asset folder, so a relative path works under any base.
    cssOut = cssOut.split(`(${pathname})`).join(`(media/${name})`).split(`("${pathname}")`).join(`("media/${name}")`);
  }

  // The rewritten fragment must still satisfy the contract.
  parseFragment(fragment);

  fs.writeFileSync(path.join(tmp, 'fragment.html'), fragment);
  fs.writeFileSync(path.join(tmp, 'assets', 'chrome.css'), cssOut);
  fs.writeFileSync(path.join(tmp, 'assets', 'chrome.js'), js);
  fs.writeFileSync(
    path.join(tmp, 'manifest.json'),
    JSON.stringify(
      {
        contract: parsed.contract,
        build: parsed.build,
        // A local path would be machine-specific in a committed file.
        source: isUrl(args.source) ? args.source : 'local marketing build',
        origin,
        syncedAt: new Date().toISOString(),
        media: [...images.values()].sort(),
      },
      null,
      2,
    ) + '\n',
  );

  // Replace the snapshot in one step, so a failed run never leaves a half-written one.
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.renameSync(tmp, outDir);

  console.log(
    `[chrome-sync] ${args.out}: ${previous ? `${previous.build} -> ` : ''}${parsed.build} ` +
      `(css ${kb(cssOut)}, js ${kb(js)}, ${images.size} image(s))`,
  );
  setOutputs({ changed: 'true', build: parsed.build });
}

function setOutputs(values) {
  if (!process.env.GITHUB_OUTPUT) return;
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(values)
      .map(([k, v]) => `${k}=${v}\n`)
      .join(''),
  );
}

const kb = (text) => `${(Buffer.byteLength(text) / 1024).toFixed(1)} KB`;

main().catch((err) => {
  console.error(`[chrome-sync] ${err.message}`);
  process.exitCode = 1;
});

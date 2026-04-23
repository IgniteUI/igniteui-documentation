import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, relative, dirname, resolve, normalize } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOPICS_DIR = join(__dirname, '..', 'docs', 'jquery', 'src', 'content', 'en', 'topics');
const OUTPUT_FILE = join(__dirname, '..', 'docs', 'jquery', 'toc.json');

const HOME_PAGE_FILES = new Set(['home-page.mdx']);
const IMAGE_DIRS = new Set(['images', 'assets', 'img']);
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.css', '.js', '.zip', '.pdf']);

function getH1(filepath) {
  try {
    const content = readFileSync(filepath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return trimmed.slice(2).trim();
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function cleanLabel(label) {
  if (!label) return label;
  // Remove (...) patterns
  return label.replace(/\s*\([^)]*\)/g, '').trim();
}

function sortKey(name) {
  const m = name.match(/^(\d+)[_\s]/);
  if (m) return [parseInt(m[1], 10), name];
  return [9999, name];
}

function isIgnored(name) {
  const lower = name.toLowerCase();
  if (IMAGE_DIRS.has(lower)) return true;
  const ext = '.' + lower.split('.').pop();
  if (IMAGE_EXTS.has(ext)) return true;
  return false;
}

function resolveLinkFile(linkPath) {
  try {
    const content = readFileSync(linkPath, 'utf-8').trim();
    const linkDir = dirname(linkPath);
    let target = normalize(resolve(linkDir, content));
    // Handle .md -> .mdx
    if (target.endsWith('.md') && !target.endsWith('.mdx')) {
      const mdx = target + 'x';
      if (existsSync(mdx)) target = mdx;
    }
    const rel = relative(TOPICS_DIR, target).replace(/\\/g, '/');
    return rel;
  } catch (e) {
    return null;
  }
}

function buildTocNode(dirpath) {
  const entries = [];
  let names;
  try {
    names = readdirSync(dirpath);
  } catch (e) {
    return entries;
  }

  const regularFiles = [];
  const linkFiles = [];
  const subdirs = [];

  for (const name of names) {
    if (isIgnored(name)) continue;
    const full = join(dirpath, name);
    let stat;
    try { stat = statSync(full); } catch (e) { continue; }

    if (stat.isDirectory()) {
      subdirs.push(name);
    } else if (name.endsWith('.mdx')) {
      if (name.startsWith('~')) continue; // ~ files handled by parent
      if (HOME_PAGE_FILES.has(name)) continue;
      regularFiles.push(name);
    } else if (name.endsWith('.link')) {
      linkFiles.push(name);
    }
    // skip .stub files
  }

  // Combine and sort all items by numeric prefix
  const allItems = [
    ...regularFiles.map(n => ({ key: sortKey(n), type: 'file', name: n })),
    ...linkFiles.map(n => ({ key: sortKey(n), type: 'link', name: n })),
    ...subdirs.map(n => ({ key: sortKey(n), type: 'dir', name: n })),
  ];
  allItems.sort((a, b) => {
    if (a.key[0] !== b.key[0]) return a.key[0] - b.key[0];
    return a.key[1] < b.key[1] ? -1 : 1;
  });

  for (const item of allItems) {
    const { type, name } = item;
    const full = join(dirpath, name);

    if (type === 'file') {
      const h1 = getH1(full);
      if (!h1) continue;
      const label = cleanLabel(h1);
      const rel = relative(TOPICS_DIR, full).replace(/\\/g, '/');
      entries.push({ name: label, href: rel });

    } else if (type === 'link') {
      const targetRel = resolveLinkFile(full);
      if (!targetRel) continue;
      const targetFull = join(TOPICS_DIR, targetRel);
      const h1 = getH1(targetFull);
      if (!h1) continue;
      const label = cleanLabel(h1);
      entries.push({ name: label, href: targetRel });

    } else if (type === 'dir') {
      // Check for ~ landing page in this subdir
      let landingFile = null;
      let subNames;
      try { subNames = readdirSync(full); } catch (e) { subNames = []; }
      for (const sn of subNames) {
        if (sn.startsWith('~') && sn.endsWith('.mdx')) {
          landingFile = join(full, sn);
          break;
        }
      }

      const children = buildTocNode(full);

      if (landingFile) {
        const h1 = getH1(landingFile);
        const label = cleanLabel(h1) || name;
        const landingRel = relative(TOPICS_DIR, landingFile).replace(/\\/g, '/');
        const node = { name: label, href: landingRel };
        if (children.length > 0) node.items = children;
        entries.push(node);
      } else {
        // No landing page - group without href
        // Strip numeric prefix from folder name for label
        const stripped = name.replace(/^\d+[_\s]*/, '').replace(/-/g, ' ').replace(/_/g, ' ').trim() || name;
        const node = { name: stripped };
        if (children.length > 0) node.items = children;
        entries.push(node);
      }
    }
  }

  return entries;
}

// Build top-level TOC
const toc = [];
const topNames = readdirSync(TOPICS_DIR);
const topItems = [];

for (const name of topNames) {
  if (isIgnored(name)) continue;
  const full = join(TOPICS_DIR, name);
  let stat;
  try { stat = statSync(full); } catch (e) { continue; }

  if (stat.isDirectory()) {
    topItems.push({ key: sortKey(name), type: 'dir', name });
  } else if (name.endsWith('.mdx')) {
    if (name.startsWith('~') || HOME_PAGE_FILES.has(name)) continue;
    topItems.push({ key: sortKey(name), type: 'file', name });
  }
}

topItems.sort((a, b) => {
  if (a.key[0] !== b.key[0]) return a.key[0] - b.key[0];
  return a.key[1] < b.key[1] ? -1 : 1;
});

for (const item of topItems) {
  const { type, name } = item;
  const full = join(TOPICS_DIR, name);

  if (type === 'file') {
    const h1 = getH1(full);
    if (!h1) continue;
    const label = cleanLabel(h1);
    const rel = relative(TOPICS_DIR, full).replace(/\\/g, '/');
    toc.push({ name: label, href: rel });

  } else if (type === 'dir') {
    let landingFile = null;
    let subNames;
    try { subNames = readdirSync(full); } catch (e) { subNames = []; }
    for (const sn of subNames) {
      if (sn.startsWith('~') && sn.endsWith('.mdx')) {
        landingFile = join(full, sn);
        break;
      }
    }

    const children = buildTocNode(full);

    if (landingFile) {
      const h1 = getH1(landingFile);
      const label = cleanLabel(h1) || name;
      const landingRel = relative(TOPICS_DIR, landingFile).replace(/\\/g, '/');
      const node = { name: label, href: landingRel };
      if (children.length > 0) node.items = children;
      toc.push(node);
    } else {
      const stripped = name.replace(/^\d+[_\s]*/, '').replace(/-/g, ' ').replace(/_/g, ' ').trim() || name;
      const node = { name: stripped };
      if (children.length > 0) node.items = children;
      toc.push(node);
    }
  }
}

writeFileSync(OUTPUT_FILE, JSON.stringify(toc, null, 2) + '\n', 'utf-8');
console.log(`Written ${OUTPUT_FILE}`);
console.log(`Total top-level entries: ${toc.length}`);

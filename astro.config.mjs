import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_SOURCES = {
  docfx: {
    docsDir: 'en/components',
    imagesDir: 'en/images',
    tocFile: 'en/components/toc.yml',
    envFile: 'en/environment.json',
    title: 'Ignite UI for Angular',
    editLinkBaseUrl: 'https://github.com/IgniteUI/igniteui-docfx/edit/master/en/components/',
    githubHref: 'https://github.com/IgniteUI/igniteui-angular'
  },
  xplat: {
    docsDir: 'doc/en/components',
    imagesDir: 'doc/en/images',
    tocFile: 'docfx/en/components/toc.json',
    envFile: 'docfx/en/environment.json',
    title: 'Ignite UI Docs',
    editLinkBaseUrl: 'https://github.com/IgniteUI/igniteui-xplat-docs/edit/master/doc/en/components/',
    githubHref: 'https://github.com/IgniteUI/igniteui-xplat-docs'
  }
};

const SOURCE_KEY = process.env.SOURCE_KEY || 'docfx';
const SOURCE_ROOT = path.resolve(__dirname, '..', SOURCE_KEY === 'xplat' ? 'igniteui-xplat-docs' : 'igniteui-docfx');

const DOCS_CONFIG = DOCS_SOURCES[SOURCE_KEY];
const COMPONENTS = path.join(SOURCE_ROOT, DOCS_CONFIG.docsDir);
const IMAGES = path.join(SOURCE_ROOT, DOCS_CONFIG.imagesDir);
const TOC_PATH = path.join(SOURCE_ROOT, DOCS_CONFIG.tocFile);

// ---------------------------------------------------------------------------
// Sidebar — built inline from TOC.yml at startup, no intermediate file needed
// ---------------------------------------------------------------------------

const EXCLUDED_PATTERNS = [
  /^grids_templates\//i,
  /^style-guide\.md$/i,
  /^themes\/sass\/presets\//i,
  /^themes\.md$/i,
];

function docExistsInSource(href) {
  if (!href || EXCLUDED_PATTERNS.some((p) => p.test(href))) return false;
  return fs.existsSync(path.join(COMPONENTS, href));
}

function hrefToSlug(href) {
  if (!href) return '';

  let slug = href
    .replace(/\\/g, '/')     // normalize windows paths
    .replace(/\.md$/i, '')   // remove extension
    .toLowerCase();

  slug = slug.replace(/\/index$/, '');
  return slug === 'index' ? '' : slug;
}

function convertTocItem(item) {
  if (!item.name) return null;

  if (item.items?.length > 0) {
    const group = { label: item.name, items: [] };
    if (item.href && docExistsInSource(item.href)) {
      group.items.push({ label: 'Overview', slug: hrefToSlug(item.href) });
    }
    for (const child of item.items) {
      const entry = convertTocItem(child);
      if (entry) group.items.push(entry);
    }
    return group.items.length > 0 ? group : null;
  }

  if (item.href) {
    if (!docExistsInSource(item.href)) return null;
    const entry = { label: item.name, slug: hrefToSlug(item.href) };
    if (item.new) entry.badge = { text: 'New', variant: 'success' };
    else if (item.preview) entry.badge = { text: 'Preview', variant: 'caution' };
    else if (item.updated) entry.badge = { text: 'Updated', variant: 'note' };
    else if (item.premium) entry.badge = { text: 'Premium', variant: 'tip' };
    return entry;
  }

  return null;
}

function loadToc() {
  const tocRaw = fs.readFileSync(TOC_PATH, 'utf-8');
  if (DOCS_CONFIG.tocFile.endsWith('.json')) {
    return JSON.parse(tocRaw);
  }
  return yaml.load(tocRaw);
}

function buildSidebarFromToc() {
  const tocItems = loadToc();
  const sidebar = [];
  let currentGroup = null;

  for (const item of tocItems) {
    if (item.header) {
      if (currentGroup) sidebar.push(currentGroup);
      currentGroup = { label: item.name, items: [] };
      if (item.href && docExistsInSource(item.href)) {
        currentGroup.items.push({ label: item.name, slug: hrefToSlug(item.href) });
      }
      continue;
    }
    const entry = convertTocItem(item);
    if (!entry) continue;
    if (currentGroup) currentGroup.items.push(entry);
    else sidebar.push(entry);
  }

  if (currentGroup) sidebar.push(currentGroup);
  return sidebar;
}

const sidebar = buildSidebarFromToc();

// ---------------------------------------------------------------------------
// Astro integration — serves igniteui-docfx/en/images at /images/
// for dev server (middleware) and production build (copy to dist/images/)
// ---------------------------------------------------------------------------

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

const MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
  avif: 'image/avif', ico: 'image/x-icon',
};

function docfxImagesIntegration() {
  return {
    name: 'docfx-images',
    hooks: {
      'astro:server:setup'({ server }) {
        server.middlewares.use('/images', (req, res, next) => {
          // Normalise and prevent path traversal
          const safePath = path.normalize(req.url || '/').replace(/\.\./g, '');
          const filePath = path.join(IMAGES, safePath);
          try {
            if (fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).slice(1).toLowerCase();
              res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch { /* file not found — fall through */ }
          next();
        });
      },
      async 'astro:build:done'({ dir }) {
        const destImages = path.join(fileURLToPath(dir), 'images');
        copyDirSync(IMAGES, destImages);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://igniteui.github.io/docs-template',
  // base: '/docs-template', // Uncomment if deploying to a subpath
  compressHTML: true,
  build: {
    assets: '_assets',
  },
  image: {
    // Disable built-in image optimization — images are served statically
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  integrations: [
    starlight({
      title: DOCS_CONFIG.title,
      logo: {
        src: './public/favicon.svg',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: DOCS_CONFIG.githubHref },
      ],
      sidebar,
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: DOCS_CONFIG.editLinkBaseUrl,
      },
    }),
    docfxImagesIntegration(),
  ],
  markdown: {
    remarkPlugins: [
      (await import('./src/plugins/remark-docfx.mjs')).remarkDocfx,
    ],
  },
});
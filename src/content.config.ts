import { defineCollection, z } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/** Wraps the glob loader and injects a `title` from the first H1 heading
 *  for files that have no `title` in their YAML frontmatter.
 *  We intercept `parseData` (called before schema validation) to add the title. */
function docsGlobLoader(options: Parameters<typeof glob>[0]): Loader {
  const inner = glob(options);
  return {
    ...inner,
    name: 'docs-glob-with-title',
    async load(ctx) {
      const origParseData = ctx.parseData.bind(ctx);
      ctx.parseData = async ({ id, data, filePath }: any) => {
        if (!data?.title && filePath) {
          const raw = await fs.readFile(filePath, 'utf-8').catch(() => '');
          const h1 = raw.match(/^#\s+(.+?)(?:\s*\{[^}]*\})?\s*$/m)?.[1]?.trim();
          data = { ...data, title: h1 ?? id.split('/').pop()?.replace(/-/g, ' ') ?? id };
        }
        return origParseData({ id, data, filePath });
      };
      return inner.load(ctx);
    },
  };
}

// Resolve the markdown source directory.
// DOCS_SOURCE_PATH is the repo root (e.g. C:/Users/.../igniteui-docfx).
// We convert to a file:// URL so Astro's glob loader can always resolve it correctly.
const SOURCE_ROOT = process.env.DOCS_SOURCE_PATH
  ? path.resolve(process.env.DOCS_SOURCE_PATH)
  : path.resolve('C:/Users/dtsvetkov/Work/igniteui-docfx');

const DOCS_BASE = pathToFileURL(path.join(SOURCE_ROOT, 'en/components'));

export const collections = {
  docs: defineCollection({
    loader: docsGlobLoader({
      base: DOCS_BASE,
      pattern: [
        '*.{md,mdx}',
        '**/*.{md,mdx}',
        '!**/_*.{md,mdx}',
        '!**/toc.yml',
        '!**/*.json',
        // igniteui-docfx–specific excludes
        '!**/grids_templates/**',
        '!**/style-guide.md',
        '!**/themes/sass/presets/**',
        '!themes.md',
      ],
    }),
    schema: docsSchema({
      extend: z.object({
        _description: z.any().optional(),
        _keywords: z.any().optional(),
        _license: z.any().optional(),
        _canonicalLink: z.any().optional(),
        _language: z.any().optional(),
        mentionedTypes: z.any().optional(),
        namespace: z.any().optional(),
      }),
    }),
  }),
};

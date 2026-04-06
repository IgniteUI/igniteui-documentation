// @ts-check
/**
 * Generates grid-specific MDX files from shared templates.
 *
 * This file orchestrates generation; transformation details live in
 * src/lib/grid-generation/* to keep this entrypoint small and maintainable.
 */

import fs from 'node:fs';
import path from 'node:path';
import { GRID_CONFIGS, createTemplateContext } from './lib/grid-generation/configs.mjs';
import {
    buildGeneratedDoc,
    collectTemplates,
    hasFrontmatter,
} from './lib/grid-generation/template-pipeline.mjs';

/**
 * @param {string} filePath
 */
function removeIfExists(filePath) {
    if (fs.existsSync(filePath)) fs.rmSync(filePath);
}

/**
 * Writes file only when content changes.
 *
 * @param {string} filePath
 * @param {string} content
 * @returns {boolean}
 */
function writeFileIfChanged(filePath, content) {
    if (fs.existsSync(filePath)) {
        const current = fs.readFileSync(filePath, 'utf-8');
        if (current === content) return false;
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
}

/**
 * Convert bare internal doc links (e.g. `(filtering)`) to absolute route links
 * for generated grid docs (e.g. `(/grid/filtering)`).
 *
 * This avoids nested URL resolution issues when current page URLs end with `/`.
 *
 * @param {string} content
 * @param {string} routeRoot
 */
function absolutizeBareDocLinks(content, routeRoot) {
    const normalizedRoot = `/${routeRoot}`;

    /** @param {string} url */
    const toAbsolute = (url) => {
        const m = url.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
        const base = m?.[1] ?? url;
        const query = m?.[2] ?? '';
        const hash = m?.[3] ?? '';

        if (!base) return url;
        if (base.startsWith('#')) return url;
        if (base.startsWith('{environment:')) return url;
        if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(base) || base.startsWith('//')) return url;

        // Resolve relative links from the current grid section root.
        const resolved = base.startsWith('/')
            ? path.posix.normalize(base)
            : path.posix.normalize(path.posix.join(normalizedRoot, base));

        // Emit extensionless internal doc links.
        const noMdExt = resolved.replace(/\.mdx?$/i, '');

        return `${noMdExt}${query}${hash}`;
    };

    // Markdown links/images
    let out = content.replace(/(!?\[[^\]]*\]\()([^\)]+)(\))/g, (match, p1, inner, p3) => {
        const trimmed = inner.trim();
        if (!trimmed) return match;

        const firstSpace = trimmed.search(/\s/);
        const urlPart = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
        const rest = firstSpace === -1 ? '' : trimmed.slice(firstSpace);
        const abs = toAbsolute(urlPart);
        if (abs === urlPart) return match;

        return `${p1}${abs}${rest}${p3}`;
    });

    // HTML href/src attrs
    out = out.replace(/\b(href|src)="([^"]+)"/g, (match, attr, url) => {
        const abs = toAbsolute(url);
        if (abs === url) return match;
        return `${attr}="${abs}"`;
    });

    // Reference-style links
    out = out.replace(/^(\[[^\]]+\]:\s+)(\S+)(\s+"[^"]*")?\s*$/gm, (match, p1, url, p3 = '') => {
        const abs = toAbsolute(url);
        if (abs === url) return match;
        return `${p1}${abs}${p3}`;
    });

    return out;
}

/**
 * Generate all grid variant pages from templates.
 *
 * @param {string} templatesDir - Absolute path to the templates directory.
 * @param {string} outBase - Absolute path to the content output directory.
 */
export function generateGridTopics(templatesDir, outBase) {
    if (!fs.existsSync(templatesDir)) {
        console.warn(`[generate-grids] grids_templates dir not found: ${templatesDir}`);
        return;
    }

    const templates = collectTemplates(templatesDir, fs);
    let writtenCount = 0;
    let unchangedCount = 0;

    for (const config of Object.values(GRID_CONFIGS)) {
        const outDir = path.join(outBase, config.igPath);
        fs.mkdirSync(outDir, { recursive: true });
        const context = createTemplateContext(config);

        for (const template of templates) {
            const raw = fs.readFileSync(path.join(templatesDir, template.file), 'utf-8');
            let processed = buildGeneratedDoc(raw, context, config.componentKey);
            processed = absolutizeBareDocLinks(processed, config.igPath);

            const outFile = path.join(outDir, `${template.base}.mdx`);

            if (!hasFrontmatter(processed)) {
                removeIfExists(outFile);
                continue;
            }

            if (writeFileIfChanged(outFile, processed)) writtenCount++;
            else unchangedCount++;
        }
    }

    const variantCount = Object.keys(GRID_CONFIGS).length;
    console.log(
        `[generate-grids] Generated ${writtenCount} updated files ` +
        `(${templates.length} templates × ${variantCount} grid variants, ` +
        `${unchangedCount} unchanged).`,
    );
}

/**
 * Rewrite relative `../images/` paths (any depth) to absolute `/images/` paths
 * in all MDX files under docsDir.
 *
 * @param {string} docsDir - Absolute path to the docs content directory.
 */
export function normalizeImagePaths(docsDir) {
    let fileCount = 0;

    /** @param {string} dir */
    function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.name.endsWith('.mdx')) {
                const original = fs.readFileSync(full, 'utf-8');
                const updated = original.replace(/(?:\.\.\/)+images\//g, '/images/');
                if (updated !== original) {
                    fs.writeFileSync(full, updated, 'utf-8');
                    fileCount++;
                }
            }
        }
    }

    walk(docsDir);
    console.log(`[normalize-image-paths] Updated ${fileCount} files.`);
}

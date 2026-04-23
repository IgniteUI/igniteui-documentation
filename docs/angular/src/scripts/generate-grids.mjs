// @ts-check
/**
 * Generates grid-specific MDX files from shared templates.
 */

import fs from 'node:fs';
import path from 'node:path';
import { GRID_CONFIGS } from './grid-configs.mjs';

// ── Template pipeline ─────────────────────────────────────────────────────────

/**
 * Keep only ComponentBlock sections applicable to the current grid variant.
 *
 * @param {string} content
 * @param {string} componentKey
 * @returns {string}
 */
function filterComponentBlocks(content, componentKey) {
    const openTag = /<ComponentBlock\s+for="([^"]+)"\s*>/g;
    const anyTag = /<ComponentBlock\s+for="([^"]+)"\s*>|<\/ComponentBlock>/g;

    let out = '';
    let cursor = 0;

    while (true) {
        openTag.lastIndex = cursor;
        const open = openTag.exec(content);

        if (!open) {
            out += content.slice(cursor);
            break;
        }

        out += content.slice(cursor, open.index);

        const keys = String(open[1]).split(',').map((k) => k.trim());
        const bodyStart = openTag.lastIndex;

        let depth = 1;
        anyTag.lastIndex = bodyStart;
        let match = null;

        while (depth > 0) {
            match = anyTag.exec(content);
            if (!match) {
                // Malformed input: keep remainder to avoid data loss.
                out += content.slice(open.index);
                return out;
            }

            if (match[0] === '</ComponentBlock>') depth--;
            else depth++;
        }

        const bodyEnd = match?.index;
        const body = content.slice(bodyStart, bodyEnd);

        if (keys.includes(componentKey)) {
            out += filterComponentBlocks(body, componentKey);
        }

        cursor = anyTag.lastIndex;
    }

    return out;
}

/**
 * @param {string} content
 * @param {Record<string, string>} context
 */
function applyReplacements(content, context) {
    let out = content;
    for (const [key, value] of Object.entries(context)) {
        out = out.replaceAll(`{${key}}`, value);
    }
    return out;
}

/**
 * Full content preparation pipeline for one generated output.
 *
 * @param {string} raw
 * @param {Record<string, string>} context
 * @param {string} componentKey
 */
function buildGeneratedDoc(raw, context, componentKey) {
    let result = raw.replace(/\r\n/g, '\n');
    result = filterComponentBlocks(result, componentKey);
    result = applyReplacements(result, context);
    result = result.replace(/\n{3,}/g, '\n\n');
    return result.trimStart();
}

/**
 * @param {string} templatesDir
 * @param {import('node:fs')} fsModule
 * @returns {Array<{base: string, file: string}>}
 */
function collectTemplates(templatesDir, fsModule) {
    return fsModule
        .readdirSync(templatesDir)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => ({ base: file.slice(0, -4), file }));
}

/**
 * @param {string} content
 */
function hasFrontmatter(content) {
    return content.startsWith('---');
}

/**
 * @param {string} filePath
 */
function removeIfExists(filePath) {
    fs.rmSync(filePath, { force: true });
}

/**
 * Writes file only when content changes.
 *
 * @param {string} filePath
 * @param {string} content
 * @returns {boolean}
 */
function writeFileIfChanged(filePath, content) {
    try {
        const current = fs.readFileSync(filePath, 'utf-8');
        if (current === content) return false;
    } catch (err) {
        if (/** @type {NodeJS.ErrnoException} */ (err).code !== 'ENOENT') throw err;
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
}

// ── Entry point ───────────────────────────────────────────────────────────────

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
        for (const template of templates) {
            const raw = fs.readFileSync(path.join(templatesDir, template.file), 'utf-8');
            const processed = buildGeneratedDoc(raw, config, config.componentKey);

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
        `(${templates.length} templates x ${variantCount} grid variants, ` +
        `${unchangedCount} unchanged).`,
    );
}

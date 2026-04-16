// @ts-check

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
 * @param {string} content
 */
function transformStyleBlocks(content) {
    return content.replace(
        /<style>([\s\S]*?)<\/style>/g,
        (_match, css) => `<style dangerouslySetInnerHTML={{__html: \`${css}\`}} />`,
    );
}

/**
 * @param {string} content
 */
function ensureSampleImport(content) {
    if (!content.includes('<Sample ')) return content;

    const importLine = "import Sample from 'docs-template/components/mdx/Sample.astro';";
    const headerEnd = content.search(/^#\s/m);
    const header = headerEnd >= 0 ? content.slice(0, headerEnd) : content.slice(0, 2000);
    if (header.includes(importLine)) return content;

    return content.replace(/^(---[\s\S]*?^---)\r?\n/m, `$1\n${importLine}\n\n`);
}

/**
 * @param {string} content
 */
function ensureAsideImport(content) {
    if (!content.includes('<Aside')) return content;

    const importLine = "import { Aside } from '@astrojs/starlight/components';";
    const headerEnd = content.search(/^#\s/m);
    const header = headerEnd >= 0 ? content.slice(0, headerEnd) : content.slice(0, 2000);
    if (header.includes(importLine)) return content;

    // Check if Sample import already exists - if so, don't add blank line after Aside
    const hasSampleImport = content.includes("import Sample from 'docs-template/components/mdx/Sample.astro'");
    const spacing = hasSampleImport ? '\n' : '\n\n';
    
    return content.replace(/^(---[\s\S]*?^---)\r?\n/m, `$1\n${importLine}${spacing}`);
}

/**
 * @param {string} templatesDir
 * @param {import('node:fs')} fs
 * @returns {Array<{base: string, file: string}>}
 */
export function collectTemplates(templatesDir, fs) {
    return fs
        .readdirSync(templatesDir)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => ({ base: file.slice(0, -4), file }));
}

/**
 * @param {string} content
 */
export function hasFrontmatter(content) {
    return content.startsWith('---');
}

/**
 * Full content preparation pipeline for one generated output.
 *
 * @param {string} raw
 * @param {Record<string, string>} context
 * @param {string} componentKey
 */
export function buildGeneratedDoc(raw, context, componentKey) {
    let result = filterComponentBlocks(raw, componentKey);
    result = applyReplacements(result, context);

    result = result.replace(/<!--\s*markdownlint-disable[^>]*-->\s*/g, '');
    result = result.replace(/\{\/\*\s*markdownlint-disable[^*]*\*\/\}\s*\n?/g, '');
    result = result.replace(/\n{3,}/g, '\n\n');
    result = result.replace(/^\s*(?=---)/, '');

    result = transformStyleBlocks(result);
    result = ensureSampleImport(result);
    result = ensureAsideImport(result);

    return result;
}

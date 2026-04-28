/**
 * env-tokens.ts
 *
 * Shared helper for resolving `{environment:Foo}` / `&#123;environment:Foo&#125;`
 * placeholders against `environment.json` for the active build environment.
 *
 * Used by:
 *   - src/plugins/remark-docfx.ts  (MDX content)
 *   - src/sidebar.ts               (toc.json sidebar labels/hrefs)
 *   - src/content-helper.ts        (frontmatter title/description)
 *
 * Tokens stay dynamic — values come from `environment.json[DOCS_ENV]`
 * (with fallback to `environment.json.production`), so each of dev / staging /
 * production builds renders its own URLs / product names without ever
 * hard-coding literals into the source files.
 */

import fs from 'node:fs';
import path from 'node:path';

export const ENV_TOKEN_RE = /(?:\\\{|\{|&#123;)environment:(\w+)(?:\\\}|\}|&#125;)/g;

const _cache = new Map<string, Record<string, string>>();

/**
 * Load environment.json values for the active DOCS_ENV (or NODE_ENV).
 * Cached per docsDir.
 *
 * Lookup order (first match wins):
 *   1. {docsDir}/en/environment.json     (DocFX layout)
 *   2. {docsDir}/environment.json        (flat layout)
 *   3. {docsDir}/../environment.json     (xplat: docsDir = generated/{P}/{lang})
 *   4. {docsDir}/../en/environment.json
 */
export function loadEnvValues(docsDir: string): Record<string, string> {
    if (!docsDir) return {};
    const cached = _cache.get(docsDir);
    if (cached) return cached;

    const candidates = [
        path.join(docsDir, 'en', 'environment.json'),
        path.join(docsDir, 'environment.json'),
        path.join(path.dirname(docsDir), 'environment.json'),
        path.join(path.dirname(docsDir), 'en', 'environment.json'),
    ];
    const envPath = candidates.find(c => fs.existsSync(c));
    if (!envPath) {
        _cache.set(docsDir, {});
        return {};
    }
    try {
        const data = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
        const envKey = process.env.DOCS_ENV ?? process.env.NODE_ENV ?? 'production';
        const values = data[envKey] ?? data.production ?? {};
        _cache.set(docsDir, values);
        return values;
    } catch {
        _cache.set(docsDir, {});
        return {};
    }
}

/**
 * Replace every `{environment:Foo}` / `&#123;environment:Foo&#125;` token in
 * `text` with the corresponding value from `values`. Unknown tokens are left
 * as-is.
 */
export function resolveEnvTokens(text: string, values: Record<string, string>): string {
    if (!text || typeof text !== 'string') return text;
    ENV_TOKEN_RE.lastIndex = 0;
    if (!ENV_TOKEN_RE.test(text)) return text;
    ENV_TOKEN_RE.lastIndex = 0;
    return text.replace(ENV_TOKEN_RE, (m, k) =>
        Object.prototype.hasOwnProperty.call(values, k) ? values[k] : m
    );
}

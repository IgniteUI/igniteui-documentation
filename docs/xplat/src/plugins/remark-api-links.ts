/**
 * Remark plugin that transforms inline-code API type names inside
 * "## API References" sections into hyperlinks pointing to the
 * Infragistics API documentation.
 *
 * Reads apiDocRoot / apiDocOverrideRoot / apiDocOverrideComponents from
 * docConfig.json, resolves {environment:...} tokens against the generated
 * environment.json, then walks the top-level AST children to find the
 * ## API References heading and the list that follows it.
 */

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

interface ApiLinkConfig {
    apiDocRoot: string;
    apiDocOverrideRoot: string;
    overrideComponents: Set<string>;
}

let _cfg: ApiLinkConfig | null = null;

function resolvePlatformAndLang(): { platform: string; lang: string } {
    const platform = process.env.PLATFORM;
    const lang     = process.env.LANG_CODE;
    if (platform && lang) return { platform, lang };

    try {
        const cfgPath = path.resolve(process.cwd(), '.platform.json');
        if (existsSync(cfgPath)) {
            const cfg = JSON.parse(readFileSync(cfgPath, 'utf-8'));
            return {
                platform: platform || cfg.platform || 'React',
                lang:     lang     || cfg.lang     || 'en',
            };
        }
    } catch { /* ignore */ }

    return { platform: platform || 'React', lang: lang || 'en' };
}

function loadConfig(): ApiLinkConfig | null {
    if (_cfg !== null) return _cfg;

    try {
        const root                   = process.cwd();
        const { platform, lang }     = resolvePlatformAndLang();
        const nodeEnv                = process.env.NODE_ENV || 'development';

        const docConfig      = JSON.parse(readFileSync(path.join(root, 'docConfig.json'), 'utf-8'));
        const platformConfig = docConfig[platform];
        if (!platformConfig) { _cfg = null; return null; }

        const envPath = path.join(root, 'generated', platform, lang, 'environment.json');
        const envData = existsSync(envPath)
            ? JSON.parse(readFileSync(envPath, 'utf-8'))
            : {};
        const env: Record<string, string> = envData[nodeEnv] ?? envData.development ?? {};

        const resolve = (str: string) => (str || '').replace(
            /\{environment:(\w+)\}/g,
            (_: string, key: string) => env[key] ?? '',
        );

        _cfg = {
            apiDocRoot:          resolve(platformConfig.apiDocRoot     || ''),
            apiDocOverrideRoot:  resolve(platformConfig.apiDocOverrideRoot || ''),
            overrideComponents:  new Set(platformConfig.apiDocOverrideComponents || []),
        };
    } catch {
        _cfg = null;
    }

    return _cfg;
}

function typeToUrl(typeName: string, cfg: ApiLinkConfig): string | null {
    const base = cfg.overrideComponents.has(typeName)
        ? cfg.apiDocOverrideRoot
        : cfg.apiDocRoot;

    if (!base) return null;

    return base.replace(/\/?$/, '/') + 'classes/' + typeName.toLowerCase() + '.html';
}

/**
 * Remark plugin — call with no arguments, e.g. `remarkPlugins: [remarkApiLinks]`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function remarkApiLinks(): (tree: any) => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any) => {
        const cfg = loadConfig();
        if (!cfg?.apiDocRoot) return;

        const nodes = tree.children;
        if (!Array.isArray(nodes)) return;

        let inApiSection = false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const node of nodes as any[]) {
            if (node.type === 'heading') {
                if (node.depth <= 2) {
                    const text = (node.children || [])
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((c: any) => c.value || '')
                        .join('')
                        .toLowerCase()
                        .trim();
                    inApiSection = node.depth === 2 && text.startsWith('api reference');
                }
                continue;
            }

            if (!inApiSection) continue;

            if (node.type === 'list') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                for (const item of node.children || [] as any[]) {
                    const para = (item.children || [])[0];
                    if (para?.type !== 'paragraph') continue;

                    const pChildren = para.children || [];
                    if (pChildren.length === 1 && pChildren[0].type === 'inlineCode') {
                        const typeName = pChildren[0].value;
                        const url      = typeToUrl(typeName, cfg);
                        if (url) {
                            para.children = [{
                                type:     'link',
                                url,
                                title:    null,
                                children: [{ type: 'inlineCode', value: typeName }],
                            }];
                        }
                    }
                }
            }
        }
    };
}

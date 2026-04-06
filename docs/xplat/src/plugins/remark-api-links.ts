/**
 * Remark plugin that transforms inline-code API type names into hyperlinks
 * pointing to the Infragistics API documentation.
 *
 * Two passes are made over each markdown file:
 *
 *  "## API References" section
 *   List items that are a single inline-code token become links.
 *
 *  Body text
 *   Every `inlineCode` node whose value matches a type listed in the page's
 *   `mentionedTypes` frontmatter field is turned into a link.  Both the short
 *   name (e.g. `Grid`) and the platform-prefixed name (e.g. `IgcGrid`) are
 *   recognised.  Nodes already inside a link or still carrying unsubstituted
 *   `{token}` placeholders are skipped.
 *
 * Configuration is read from docConfig.json; {environment:...} tokens are
 * resolved against the generated environment.json.
 */

import { visit } from 'unist-util-visit';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

// Platform → class-name prefix used in generated markdown (IgcGrid, IgrGrid…)
const PLATFORM_PREFIX: Record<string, string> = {
    Angular:       'Igx',
    React:         'Igr',
    WebComponents: 'Igc',
    Blazor:        'Igb',
};

interface ApiLinkConfig {
    apiDocRoot:         string;
    apiDocOverrideRoot: string;
    overrideComponents: Set<string>;
    prefix:             string;   // e.g. 'Igc'
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
        const nodeEnv                = process.env.DOCS_ENV || process.env.NODE_ENV || 'development';

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
            apiDocRoot:          resolve(platformConfig.apiDocRoot         || ''),
            apiDocOverrideRoot:  resolve(platformConfig.apiDocOverrideRoot || ''),
            overrideComponents:  new Set(platformConfig.apiDocOverrideComponents || []),
            prefix:              PLATFORM_PREFIX[platform] ?? '',
        };
    } catch {
        _cfg = null;
    }

    return _cfg;
}

function typeToUrl(typeName: string, cfg: ApiLinkConfig): string | null {
    // Skip unsubstituted token placeholders like {ComponentName}.
    if (typeName.includes('{') || typeName.includes('}')) return null;

    const base = cfg.overrideComponents.has(typeName)
        ? cfg.apiDocOverrideRoot
        : cfg.apiDocRoot;

    if (!base) return null;

    return base.replace(/\/?$/, '/') + 'classes/' + typeName.toLowerCase() + '.html';
}

/**
 * Build the set of type names to recognise in body text from the page's
 * `mentionedTypes` frontmatter.  Entries are full namespaced strings like
 * "Infragistics.Controls.Grid"; we add both the short name ("Grid") and the
 * platform-prefixed name ("IgcGrid") so either form in the markdown is linked.
 */
function buildMentionedTypeNames(mentionedTypes: unknown, prefix: string): Set<string> {
    const set = new Set<string>();
    if (!Array.isArray(mentionedTypes)) return set;

    for (const entry of mentionedTypes) {
        if (typeof entry !== 'string') continue;
        const shortName = (entry.split('.').pop() ?? entry).trim();
        if (!shortName || shortName.includes('{')) continue;
        set.add(shortName);                // e.g. 'Grid'
        if (prefix) set.add(prefix + shortName); // e.g. 'IgcGrid'
    }
    return set;
}

/**
 * Remark plugin — call with no arguments, e.g. `remarkPlugins: [remarkApiLinks]`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function remarkApiLinks(): (tree: any, file: any) => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any, file: any) => {
        const cfg = loadConfig();
        if (!cfg?.apiDocRoot) return;

        // ---------------------------------------------------------------
        // Pass 1: "## API References" section list items
        // ---------------------------------------------------------------
        const nodes = tree.children;
        if (Array.isArray(nodes)) {
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
                        inApiSection = node.depth === 2 && (
                            text.startsWith('api reference') ||
                            text.startsWith('api リファレンス')
                        );
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
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const frontmatter = (file?.data?.astro?.frontmatter ?? {}) as Record<string, any>;
        const typeNames   = buildMentionedTypeNames(frontmatter.mentionedTypes, cfg.prefix);
        if (typeNames.size === 0) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visit(tree, 'inlineCode', (node: any, index: number | undefined, parent: any) => {
            if (index === undefined || !parent) return;
            if (parent.type === 'link') return;

            const typeName: string = node.value;
            if (!typeNames.has(typeName)) return;

            const url = typeToUrl(typeName, cfg);
            if (!url) return;

            parent.children.splice(index, 1, {
                type:     'link',
                url,
                title:    null,
                children: [{ type: 'inlineCode', value: typeName }],
            });
        });
    };
}

/**
 * Remark plugin that transforms docfx-specific markdown syntax into
 * standard HTML / markdown that Starlight can render.
 *
 * Handles:
 * 2. <code-view> elements -> iframe embeds
 * 3. <div class="divider--half"></div> -> <hr>
 * 4. Docfx frontmatter normalisation (_description -> description, _keywords -> keywords)
 */

import { visit } from 'unist-util-visit';

/**
 * Transform <code-view ...> ... </code-view> raw HTML blocks
 * into rendered iframes.
 */
function transformCodeView(html: string): string {
    return html.replace(
        /<code-view\s+([^>]*)>\s*<\/code-view>/gs,
        (_match, attrs: string) => {
            const srcMatch = attrs.match(/iframe-src="([^"]*)"/);
            const heightMatch = attrs.match(/style="height:(\d+px)"/);
            const altMatch = attrs.match(/alt="([^"]*)"/);
            const src = srcMatch ? srcMatch[1] : '';
            const height = heightMatch ? heightMatch[1] : '400px';
            const alt = altMatch ? altMatch[1] : 'Demo';

            if (!src) return '';
            return `<iframe src="${src}" style="width:100%;height:${height};border:1px solid #e5e7eb;border-radius:8px;" title="${alt}" loading="lazy"></iframe>`;
        }
    );
}

/**
 * Transform <div class="divider--half"></div> into <hr>
 */
function transformDividers(html: string): string {
    return html.replace(/<div\s+class="divider--half"\s*>\s*<\/div>/g, '<hr/>');
}

export function remarkDocfx() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any, file: any) => {
        // 1. Transform frontmatter: map _description -> description, _keywords -> keywords
        if (file.data.astro?.frontmatter) {
            const fm = file.data.astro.frontmatter as Record<string, unknown>;
            if (fm._description && !fm.description) {
                fm.description = fm._description;
            }
            if (fm._keywords && !fm.keywords) {
                fm.keywords = fm._keywords;
            }
            // Remove underscore-prefixed keys that Starlight doesn't use
            delete fm._description;
            delete fm._keywords;
            delete fm._license;
        }

        // 2. Walk the AST and replace environment variables in text/links/html
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visit(tree, (node: any) => {
            // Images
            if (node.type === 'image' && node.url) {
                // Fix relative image paths: ../../images/ -> /images/
                node.url = (node.url as string).replace(/^\.\.\/\.\.\/images\//, '/images/');
                node.url = (node.url as string).replace(/^\.\.\/images\//, '/images/');
            }

            // Inline HTML
            if (node.type === 'html' && node.value) {
                node.value = transformCodeView(node.value as string);
                node.value = transformDividers(node.value as string);
                // Fix image src paths in raw HTML
                node.value = (node.value as string).replace(
                    /src="\.\.\/\.\.\/images\//g,
                    'src="/images/'
                );
                node.value = (node.value as string).replace(
                    /src="\.\.\/images\//g,
                    'src="/images/'
                );
            }
        });
    };
}

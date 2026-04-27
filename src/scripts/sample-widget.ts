/**
 * sample-widget.ts
 *
 * Client-side widget initialization for the <Sample> Astro component.
 *
 * The HTML shell is pre-rendered by Sample.astro (navbar, iframe, loading state).
 * This module handles the dynamic parts:
 *   – Serial iframe loading (one at a time, IntersectionObserver-based)
 *   – Code-tab fetching and rendering (Angular JSON or xplat JSON)
 *   – Tab switching between EXAMPLE and code views
 *   – Live-editing footer (StackBlitz / CodeSandbox)
 *
 * Selector: `.code-view[data-platform]`
 *   This distinguishes pre-rendered Sample.astro widgets from `.ig-code-view`
 *   elements that come from the docfx pipeline (handled by code-view.js).
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const SAMPLES_ORDER = ['modules', 'ts', 'html', 'scss', 'css'];

const XPLAT_SAMPLES_ORDER: Record<string, string[]> = {
    react:  ['tsx', 'ts', 'html', 'css'],
    wc:     ['tsx', 'ts', 'html', 'css'],
    blazor: ['razor', 'cs', 'js', 'css'],
};

const XPLAT_CODE_BASE: Record<string, string> = {
    wc:     '/assets/code-viewer/',
    react:  '/code-viewer/',
    blazor: '/code-viewer/',
};

const DV_PATHS  = ['gauges/', 'maps/', 'excel/', 'charts/'];
const ASSETS_RE = /([.]{0,2}\/)*assets\//g;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SampleFile {
    fileExtension: string;
    fileHeader:    string;
    content:       string;
    isMain:        boolean;
    path?:         string;
}

interface WidgetContext {
    widget:       HTMLElement;
    iframeSrc:    string;
    demosBaseUrl: string;
    widgetIndex:  number;
    navbar:       HTMLElement;
    container:    HTMLElement;
    activateTab:  (tab: HTMLElement) => void;
    githubSrc:    string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalizes the platform string so it matches the lookup table keys.
 * platform-context.ts returns 'webcomponents' but XPLAT_* tables use 'wc'.
 */
function normalizePlatform(raw: string): string {
    if (raw === 'webcomponents' || raw === 'web-components') return 'wc';
    return raw;
}

function isXplatPlatform(platform: string): boolean {
    return platform === 'react' || platform === 'wc' || platform === 'blazor';
}

function getSamplePath(iframeSrc: string, demosBaseUrl: string): string {
    return iframeSrc
        .replace(demosBaseUrl + '/', '')
        .replace(/\?.*/, '')
        .replace(/\/$/, '');
}

function isDvSample(samplePath: string): boolean {
    return DV_PATHS.some(p => samplePath.startsWith(p));
}

function getRepoBranch(demosBaseUrl: string, isDv: boolean): string {
    const host      = new URL(demosBaseUrl).host;
    const isNonProd = host.includes('staging')
        || window.location.hostname === 'localhost'
        || window.location.hostname === '127.0.0.1';
    if (isDv) return 'vnext';
    return isNonProd ? 'vNext' : 'master';
}

function getXplatBranch(demosBaseUrl: string): string {
    const host      = new URL(demosBaseUrl).host;
    const isNonProd = host.includes('staging')
        || window.location.hostname === 'localhost'
        || window.location.hostname === '127.0.0.1';
    return isNonProd ? 'vnext' : 'master';
}

function replaceRelativeAssetUrls(files: SampleFile[], demosBaseUrl: string): void {
    const assetsBase = demosBaseUrl.replace(/\/$/, '') + '/assets/';
    files.forEach(f => {
        if (f.content && ASSETS_RE.test(f.content)) {
            f.content = f.content.replace(ASSETS_RE, assetsBase);
        }
        ASSETS_RE.lastIndex = 0;
    });
}

// ─── Tab Switching ────────────────────────────────────────────────────────────

/**
 * Returns an `activateTab` callback that mirrors the original buildShell closure.
 * Operates purely on the pre-rendered HTML — no DOM construction needed.
 */
function buildActivateTab(
    navbar:       HTMLElement,
    container:    HTMLElement,
    fsBtn:        HTMLElement | null,
    exampleTabId: string,
): (tab: HTMLElement) => void {
    return function activateTab(tab: HTMLElement) {
        navbar.querySelectorAll<HTMLElement>('.code-view-tab, .code-view-tab--active').forEach(t => {
            t.classList.remove('code-view-tab--active');
            t.classList.add('code-view-tab');
        });
        container.querySelectorAll<HTMLElement>('.code-view-tab-content').forEach(c => {
            c.style.display = 'none';
        });
        tab.classList.remove('code-view-tab');
        tab.classList.add('code-view-tab--active');
        const pane = container.querySelector<HTMLElement>('#' + tab.dataset.tabId);
        if (pane) pane.style.display = '';
        if (fsBtn) {
            fsBtn.style.visibility = tab.dataset.tabId === exampleTabId ? 'visible' : 'hidden';
        }
    };
}

// ─── Code Tab Rendering ───────────────────────────────────────────────────────

function addCodeTab(
    navbar:      HTMLElement,
    container:   HTMLElement,
    activateTab: (tab: HTMLElement) => void,
    widgetIndex: number,
    file:        SampleFile,
    tabIndex:    number,
): void {
    const lang  = file.fileExtension === 'js' ? 'javascript' : (file.fileExtension || 'text');
    const tabId = `cv-${widgetIndex}-code-${tabIndex}`;

    const tab         = document.createElement('div');
    tab.className     = 'code-view-tab';
    tab.textContent   = file.fileHeader.toUpperCase();
    tab.dataset.tabId = tabId;
    tab.addEventListener('click', () => activateTab(tab));
    // Insert before the last child (the fullscreen span stays last in the navbar).
    navbar.insertBefore(tab, navbar.lastElementChild);

    const pane         = document.createElement('div');
    pane.id            = tabId;
    pane.className     = 'code-view-tab-content';
    pane.style.display = 'none';

    const pre     = document.createElement('pre');
    pre.className = 'code-wrapper';

    const code          = document.createElement('code');
    code.className      = `language-${lang}`;
    code.textContent    = file.content;

    const copyBtn       = document.createElement('button');
    copyBtn.className   = 'cv-hljs-code-copy hidden';
    copyBtn.textContent = 'COPY CODE';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(file.content).then(() => {
            const orig = copyBtn.textContent!;
            copyBtn.textContent = 'COPIED!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    pre.addEventListener('mouseenter', () => copyBtn.classList.remove('hidden'));
    pre.addEventListener('mouseleave', () => copyBtn.classList.add('hidden'));

    pre.appendChild(code);
    pre.appendChild(copyBtn);
    pane.appendChild(pre);
    container.appendChild(pane);

    if (typeof (window as any).hljs !== 'undefined') {
        (window as any).hljs.highlightElement(code);
    }
}

// ─── Footer / Live Edit Buttons ───────────────────────────────────────────────

function addFooter(
    widget:         HTMLElement,
    explicitEditor: string | null,
    onStackblitz:   (() => void) | null,
    onCodeSandbox:  (() => void) | null,
    onJsFiddle:     (() => void) | null = null
): void {
    const footer     = document.createElement('div');
    footer.className = 'editing-buttons-container';

    const label       = document.createElement('span');
    label.className   = 'editing-label';
    label.textContent = 'Edit in: ';
    footer.appendChild(label);

    if ((!explicitEditor || explicitEditor === 'stackblitz') && onStackblitz) {
        const btn            = document.createElement('button');
        btn.className        = 'stackblitz-btn';
        btn.textContent      = 'StackBlitz';
        btn.style.fontWeight = '500';
        btn.addEventListener('click', onStackblitz);
        footer.appendChild(btn);
    }

    if ((!explicitEditor || explicitEditor === 'csb') && onCodeSandbox) {
        const btn            = document.createElement('button');
        btn.className        = 'codesandbox-btn';
        btn.textContent      = 'CodeSandbox';
        btn.style.fontWeight = '500';
        btn.addEventListener('click', onCodeSandbox);
        footer.appendChild(btn);
    }

    if ((!explicitEditor || explicitEditor === 'jsfiddle') && onJsFiddle) {
        const btn            = document.createElement('button');
        btn.className        = 'jsfiddle-btn';
        btn.textContent      = 'JSFiddle';
        btn.style.fontWeight = '500';
        btn.addEventListener('click', onJsFiddle);
        footer.appendChild(btn);
    }

    widget.appendChild(footer);
}

// ─── Angular Code Service ─────────────────────────────────────────────────────

class AngularCodeService {
    async init(ctx: WidgetContext): Promise<void> {
        const { widget, iframeSrc, demosBaseUrl, widgetIndex, navbar, container, activateTab } = ctx;
        const samplePath     = getSamplePath(iframeSrc, demosBaseUrl);
        const isDv           = isDvSample(samplePath);
        const assetDir       = isDv ? 'code-viewer' : 'samples';
        const explicitEditor = isDv ? 'csb' : null;

        const fallbackStackblitz  = isDv ? null : () => this._openStackBlitzUrl(samplePath, demosBaseUrl);
        const fallbackCodeSandbox = () => this._openCodeSandboxUrl(samplePath, demosBaseUrl);

        try {
            const metaRes = await fetch(
                `${demosBaseUrl}/assets/samples/meta.json?t=${Date.now()}`,
                { credentials: 'omit' },
            );
            if (!metaRes.ok) throw new Error(`meta.json ${metaRes.status}`);
            const { generationTimeStamp } = await metaRes.json();

            const sampleJsonPath = isDv
                ? `${demosBaseUrl}/assets/${assetDir}/${samplePath}.json`
                : `${demosBaseUrl}/assets/${assetDir}/${samplePath.replace('/', '--')}.json`;

            const [sampleRes, sharedRes] = await Promise.all([
                fetch(`${sampleJsonPath}?t=${generationTimeStamp}`, { credentials: 'omit' }),
                fetch(`${demosBaseUrl}/assets/samples/shared.json?t=${generationTimeStamp}`, { credentials: 'omit' }),
            ]);
            if (!sampleRes.ok) throw new Error(`sample JSON ${sampleRes.status}`);

            const [sampleData, sharedData] = await Promise.all([
                sampleRes.json(),
                sharedRes.ok ? sharedRes.json() : Promise.resolve(null),
            ]);

            replaceRelativeAssetUrls(sampleData.sampleFiles || [], demosBaseUrl);
            if (sharedData) replaceRelativeAssetUrls(sharedData.files || [], demosBaseUrl);

            (sampleData.sampleFiles || [] as SampleFile[])
                .filter((f: SampleFile) => f.isMain)
                .sort((a: SampleFile, b: SampleFile) =>
                    SAMPLES_ORDER.indexOf(a.fileHeader) - SAMPLES_ORDER.indexOf(b.fileHeader))
                .forEach((file: SampleFile, i: number) =>
                    addCodeTab(navbar, container, activateTab, widgetIndex, file, i));

            const onStackblitz = isDv ? null : () => this._openInStackBlitz(sampleData, sharedData);
            addFooter(widget, explicitEditor, onStackblitz, fallbackCodeSandbox);

        } catch (err: any) {
            console.warn('[sample-widget] Could not fetch Angular sample files:', err.message);
            addFooter(widget, explicitEditor, fallbackStackblitz, fallbackCodeSandbox);
        }
    }

    private async _openInStackBlitz(sampleData: any, sharedData: any): Promise<void> {
        let sdk: any;
        try {
            sdk = await this._loadStackBlitzSdk();
        } catch (e: any) {
            console.warn('[sample-widget] StackBlitz SDK failed to load:', e.message);
            return;
        }
        const files: Record<string, string> = {};
        (sharedData?.files || []).forEach((f: any) => {
            if (f.path) files[f.path.replace(/^\.\//, '')] = f.content || '';
        });
        (sampleData.sampleFiles || []).forEach((f: any) => {
            if (f.path) files[f.path.replace(/^\.\//, '')] = f.content || '';
        });
        sdk.openProject(
            {
                title:       'Infragistics Angular Components',
                description: 'Auto-generated from Infragistics Angular Docs',
                template:    'node',
                files,
                tags:        ['angular', 'material', 'cdk', 'web', 'example'],
            },
            { openFile: 'src/app/app.component.ts' },
        );
    }

    private _loadStackBlitzSdk(): Promise<any> {
        if ((window as any).StackBlitzSDK) return Promise.resolve((window as any).StackBlitzSDK);
        return new Promise((resolve, reject) => {
            const s   = document.createElement('script');
            s.src     = 'https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js';
            s.onload  = () => resolve((window as any).StackBlitzSDK);
            s.onerror = () => reject(new Error('Failed to load StackBlitz SDK'));
            document.head.appendChild(s);
        });
    }

    private _openCodeSandboxUrl(samplePath: string, demosBaseUrl: string): void {
        const isDv   = isDvSample(samplePath);
        const branch = getRepoBranch(demosBaseUrl, isDv);
        const repo   = isDv ? 'igniteui-angular-examples' : 'igniteui-live-editing-samples';
        const segs   = new URL(demosBaseUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean);
        const prefix = isDv ? 'samples/' : (segs.pop() || 'angular-demos') + '/';
        window.open(
            `https://codesandbox.io/p/sandbox/github/IgniteUI/${repo}/tree/${branch}/${prefix}${samplePath}`,
            '_blank',
        );
    }

    private _openStackBlitzUrl(samplePath: string, demosBaseUrl: string): void {
        const isDv   = isDvSample(samplePath);
        const branch = getRepoBranch(demosBaseUrl, isDv);
        const repo   = isDv ? 'igniteui-angular-examples' : 'igniteui-live-editing-samples';
        const segs   = new URL(demosBaseUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean);
        const prefix = isDv ? 'samples/' : (segs.pop() || 'angular-demos') + '/';
        window.open(
            `https://stackblitz.com/github/IgniteUI/${repo}/tree/${branch}/${prefix}${samplePath}`,
            '_blank',
        );
    }
}

// ─── Xplat Code Service ───────────────────────────────────────────────────────

class XplatCodeService {
    private platform:          string;
    private samplesOrder:      string[];
    private codeBase:          string;
    private enableLiveEditing: boolean;

    constructor(platform: string) {
        this.platform          = platform;
        this.samplesOrder      = XPLAT_SAMPLES_ORDER[platform] || ['ts', 'html', 'css'];
        this.codeBase          = XPLAT_CODE_BASE[platform]     || '/code-viewer/';
        this.enableLiveEditing = platform !== 'blazor';
    }

    async init(ctx: WidgetContext): Promise<void> {
        const { widget, iframeSrc, demosBaseUrl, widgetIndex, navbar, container, activateTab, githubSrc } = ctx;
        const samplePath     = getSamplePath(iframeSrc, demosBaseUrl);
        const addXplatFooter = () => {
            if (!this.enableLiveEditing || !githubSrc) return;
            addFooter(widget, 'csb', null, () => this._openCodeSandbox(githubSrc, demosBaseUrl));
        };

        try {
            // Blazor's local dev server uses a self-signed cert on a non-4200 port,
            // causing CORS errors. Use a relative URL so Vite's proxy handles it.
            const jsonUrl = this.platform === 'blazor'
                ? `${this.codeBase}${samplePath}.json`
                : `${demosBaseUrl}${this.codeBase}${samplePath}.json`;

            const res = await fetch(jsonUrl, { credentials: 'omit' });
            if (!res.ok) throw new Error(`xplat sample JSON ${res.status}`);
            const data = await res.json();

            (data.sampleFiles || [] as SampleFile[])
                .filter((f: SampleFile) => f.isMain)
                .sort((a: SampleFile, b: SampleFile) =>
                    this.samplesOrder.indexOf(a.fileHeader) - this.samplesOrder.indexOf(b.fileHeader))
                .forEach((file: SampleFile, i: number) =>
                    addCodeTab(navbar, container, activateTab, widgetIndex, file, i));

            addXplatFooter();
        } catch (err: any) {
            console.warn('[sample-widget] Could not fetch xplat sample files:', err.message);
            addXplatFooter();
        }
    }

    private _openCodeSandbox(githubSrc: string, demosBaseUrl: string): void {
        const branch = getXplatBranch(demosBaseUrl);
        window.open(
            `https://codesandbox.io/p/sandbox/github/IgniteUI/igniteui-${this.platform}-examples/tree/${branch}/samples/${githubSrc}`,
            '_blank',
        );
    }
}

// ─── jQuery Code Service ──────────────────────────────────────────────────────

/**
 * jQuery sample structure (hosted on GitHub Pages at igniteui.github.io/help-samples):
 *   <demosBaseUrl>/<samplePath>/index.html   — live demo
 *   <demosBaseUrl>/<samplePath>/.gh-embed.json — metadata with code-viewer file list
 *   <demosBaseUrl>/<samplePath>/fiddle/demo.js|demo.html|demo.css — source files
 *
 * .gh-embed.json has:
 *   { srcUrlPattern, embed: [{ label, path }, { label, path }, { type: "htmlpage", ... }] }
 */

interface GhEmbedEntry {
    label: string;
    path:  string;
    type?: string;
    url?:  string;
}

interface GhEmbedJson {
    srcUrlPattern: string;
    embed:         GhEmbedEntry[];
}

class JQueryCodeService {
    async init(ctx: WidgetContext): Promise<void> {
        const { widget, iframeSrc, demosBaseUrl, widgetIndex, navbar, container, activateTab } = ctx;
        let samplePath = getSamplePath(iframeSrc, demosBaseUrl);
        // Strip trailing filename (e.g. index.html) to get the directory path.
        samplePath = samplePath.replace(/\/[^/]+\.[^/]+$/, '');

        // GitHub Pages uses Jekyll which ignores dotfiles (.gh-embed.json → 404).
        // Use raw.githubusercontent.com instead — it serves all files and sets
        // Access-Control-Allow-Origin: *, so CORS is not an issue from localhost.
        //
        // demosBaseUrl example: https://igniteui.github.io/help-samples/25.1/EN/
        // We need the version/lang prefix from the Pages path, e.g. "25.1/EN".
        const pagesPath  = new URL(demosBaseUrl).pathname;          // /help-samples/25.1/EN/
        const repoName   = pagesPath.split('/').filter(Boolean)[0]; // "help-samples"
        const subPath    = pagesPath.split('/').filter(Boolean).slice(1).join('/').replace(/\/$/, ''); // "25.1/EN"
        const rawBase    = `https://raw.githubusercontent.com/IgniteUI/${repoName}/master`;

        try {
            // Fetch the embed metadata from raw.githubusercontent.com.
            const metaUrl = `${rawBase}/${subPath}/${samplePath}/.gh-embed.json`;
            const metaRes = await fetch(metaUrl, { credentials: 'omit' });
            if (!metaRes.ok) throw new Error(`.gh-embed.json ${metaRes.status}`);
            const meta: GhEmbedJson = await metaRes.json();

            // Filter out the "htmlpage" result entry — only keep code files.
            const codeEntries = meta.embed.filter(e => e.type !== 'htmlpage' && e.path);

            // Fetch all code files in parallel from raw.githubusercontent.com.
            const fileContents = await Promise.all(
                codeEntries.map(async (entry) => {
                    // entry.path is relative to the repo root, e.g.
                    // "25.1/EN/grid/cell-merging-custom/fiddle/demo.js"
                    const url = `${rawBase}/${entry.path}`;
                    try {
                        const res = await fetch(url, { credentials: 'omit' });
                        if (!res.ok) return null;
                        const content = await res.text();
                        return {
                            label:   entry.label,
                            ext:     entry.path.split('.').pop() || 'text',
                            content,
                        };
                    } catch {
                        return null;
                    }
                })
            );

            const files = fileContents.filter(Boolean) as { label: string; ext: string; content: string }[];

            // Add code tabs for each file.
            files.forEach((file, i) => {
                addCodeTab(navbar, container, activateTab, widgetIndex, {
                    fileExtension: file.ext,
                    fileHeader:    file.label,
                    content:       file.content,
                    isMain:        true,
                }, i);
            });

            // Build the "View on GitHub" source URL from srcUrlPattern.
            // srcUrlPattern example: "/${owner}/${repo}-src/blob/25.1/HTMLSamples/grid/cell-merging-custom.html"
            const sourceUrl = meta.srcUrlPattern
                ? `https://github.com${meta.srcUrlPattern
                    .replace('${owner}', 'IgniteUI')
                    .replace('${repo}', 'help-samples')}`
                : null;

            // jsFiddle: post the fiddle files.
            const jsFile   = files.find(f => f.ext === 'js');
            const htmlFile = files.find(f => f.ext === 'html');
            const cssFile  = files.find(f => f.ext === 'css');

            const onJsFiddle = (jsFile || htmlFile)
                ? () => this._openJsFiddle(
                    htmlFile?.content ?? '',
                    jsFile?.content ?? '',
                    cssFile?.content ?? '',
                )
                : null;

            addFooter(widget, 'jsfiddle', null, null, onJsFiddle);

        } catch (err: any) {
            console.warn('[sample-widget] Could not fetch jQuery sample files:', err.message);
        }
    }

    /**
     * Opens jsFiddle with the sample code via a POST form submission.
     * See https://docs.jsfiddle.net/api/display-a-fiddle-from-post
     */
    private _openJsFiddle(html: string, js: string, css: string): void {
        const form   = document.createElement('form');
        form.method  = 'POST';
        form.action  = 'https://jsfiddle.net/api/post/library/pure/';
        form.target  = '_blank';

        const addField = (name: string, value: string) => {
            const input = document.createElement('input');
            input.type  = 'hidden';
            input.name  = name;
            input.value = value;
            form.appendChild(input);
        };

        addField('html', html);
        addField('js',   js);
        addField('css',  css);
        addField('wrap', '1');  // Wrap JS in onLoad

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

/**
 * Initialize all Sample.astro widgets on the page.
 *
 * Called once per page by the deduplicated <script> in Sample.astro.
 * Processes every `.code-view[data-platform]` element — the `data-platform`
 * attribute is what distinguishes pre-rendered Sample.astro widgets from
 * `.ig-code-view` elements managed by code-view.js.
 */
export function initSampleWidgets(): void {
    // Serial iframe-load queue. Loading all iframes simultaneously causes the
    // browser to parse and execute many JS bundles at once, freezing the main
    // thread. Instead we load one iframe at a time: next starts only after the
    // current fires its `load` event.
    const iframeQueue: Array<{ iframe: HTMLIFrameElement; samplePane: HTMLElement }> = [];
    let iframeLoading = false;

    function processIframeQueue() {
        if (iframeLoading || iframeQueue.length === 0) return;
        iframeLoading = true;
        const { iframe, samplePane } = iframeQueue.shift()!;

        iframe.addEventListener('load', () => {
            samplePane.classList.remove('loading');
            iframeLoading = false;
            processIframeQueue();
        }, { once: true });

        iframe.src = iframe.dataset.src!;
    }

    document.querySelectorAll<HTMLElement>('.code-view[data-platform]').forEach((widget, index) => {
        // Guard against double-initialization (e.g. astro:page-load firing on
        // back-navigation to a page whose widgets are still in the DOM).
        if (widget.dataset.initialized) return;
        widget.dataset.initialized = '1';

        const iframeSrc    = widget.dataset.iframeSrc    || '';
        const demosBaseUrl = widget.dataset.demosBaseUrl || '';
        const githubSrc    = widget.dataset.githubSrc    || '';
        const platform     = normalizePlatform(widget.dataset.platform || 'angular');

        if (!iframeSrc) return;

        const navbar     = widget.querySelector<HTMLElement>('.code-view-navbar');
        const container  = widget.querySelector<HTMLElement>('.code-views-container');
        const samplePane = widget.querySelector<HTMLElement>('.sample-container');
        const iframe     = widget.querySelector<HTMLIFrameElement>('iframe');
        const fsBtn      = widget.querySelector<HTMLElement>('.fs-button-container');
        const exampleTab = widget.querySelector<HTMLElement>('.code-view-tab--active');

        if (!navbar || !container) return;

        const exampleTabId = exampleTab?.dataset.tabId ?? `${widget.id}-example`;
        const activateTab  = buildActivateTab(navbar, container, fsBtn, exampleTabId);

        // Wire click handler onto the pre-rendered EXAMPLE tab.
        exampleTab?.addEventListener('click', () => activateTab(exampleTab));

        // Fullscreen button: open the iframe URL in a new tab.
        if (fsBtn && iframe) {
            fsBtn.addEventListener('click', () => {
                const src = iframe.src || iframe.dataset.src || '';
                if (src) window.open(src + (src.includes('?') ? '&' : '?') + 'nav=0', '_blank');
            });
        }

        // Enqueue iframe loading.
        if (iframe && samplePane) {
            const enqueue = () => {
                iframeQueue.push({ iframe, samplePane });
                processIframeQueue();
            };
            if (index === 0) {
                requestAnimationFrame(enqueue);
            } else {
                const visObs = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting) { visObs.disconnect(); enqueue(); }
                });
                visObs.observe(samplePane);
            }
        }

        if (!demosBaseUrl) return;

        const service = platform === 'jquery'
            ? new JQueryCodeService()
            : isXplatPlatform(platform)
                ? new XplatCodeService(platform)
                : new AngularCodeService();

        const ctx: WidgetContext = {
            widget, iframeSrc, demosBaseUrl, widgetIndex: index, navbar, container, activateTab, githubSrc,
        };

        // Fetch code-tab data only when the widget becomes visible.
        const startFetch = () => service.init(ctx);
        if (index === 0) {
            typeof requestIdleCallback !== 'undefined'
                ? requestIdleCallback(startFetch)
                : requestAnimationFrame(startFetch);
        } else {
            const fetchObs = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) { fetchObs.disconnect(); startFetch(); }
            });
            fetchObs.observe(samplePane ?? widget);
        }
    });
}

/**
 * code-view.js
 *
 * Client-side widget that transforms `.ig-code-view` placeholder divs into
 * the interactive code-view widget (iframe + source tabs + live-editing buttons).
 *
 * Architecture:
 *   CodeService (base)
 *     ├── AngularCodeService  — Angular samples, StackBlitz SDK + CodeSandbox
 *     └── XplatCodeService    — React / WebComponents / Blazor samples
 *   DOM helpers               — buildShell, addCodeTab, addFooter
 *   Entry point               — initCodeViews, normalizeRawCodeViews
 */
(function () {
  'use strict';

  // Constants

  const SAMPLES_ORDER = ['modules', 'ts', 'html', 'scss', 'css'];

  const XPLAT_SAMPLES_ORDER = {
    react:  ['tsx', 'ts', 'html', 'css'],
    wc:     ['tsx', 'ts', 'html', 'css'],
    blazor: ['razor', 'cs', 'js', 'css'],
  };

  const XPLAT_CODE_BASE = {
    wc:     '/assets/code-viewer/',
    react:  '/code-viewer/',
    blazor: '/code-viewer/',
  };

  const DV_PATHS  = ['gauges/', 'maps/', 'excel/', 'charts/'];
  const ASSETS_RE = /([.]{0,2}\/)*assets\//g;

  // Platform detection

  function getPagePlatform() {
    const meta = document.querySelector('meta[property="docs:platform"]');
    const raw  = meta ? (meta.getAttribute('content') || 'angular') : 'angular';
    return raw === 'web-components' ? 'wc' : raw;
  }

  function isXplatPlatform(platform) {
    return platform === 'react' || platform === 'wc' || platform === 'blazor';
  }

  // Shared helpers

  function getSamplePath(iframeSrc, demosBaseUrl) {
    return iframeSrc
      .replace(demosBaseUrl + '/', '')
      .replace(/\?.*/, '')
      .replace(/\/$/, '');
  }

  function isDvSample(samplePath) {
    return DV_PATHS.some(p => samplePath.startsWith(p));
  }

  function getRepoBranch(demosBaseUrl, isDv) {
    const host      = new URL(demosBaseUrl).host;
    const isNonProd = host.includes('staging')
      || window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';
    if (isDv) return 'vnext';
    return isNonProd ? 'vNext' : 'master';
  }

  function getXplatBranch(demosBaseUrl) {
    const host      = new URL(demosBaseUrl).host;
    const isNonProd = host.includes('staging')
      || window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';
    return isNonProd ? 'vnext' : 'master';
  }

  function replaceRelativeAssetUrls(files, demosBaseUrl) {
    const assetsBase = demosBaseUrl.replace(/\/$/, '') + '/assets/';
    files.forEach(f => {
      if (f.content && ASSETS_RE.test(f.content)) {
        f.content = f.content.replace(ASSETS_RE, assetsBase);
      }
      ASSETS_RE.lastIndex = 0;
    });
  }

  // DOM builders

  /**
   * Build the widget shell: navbar + sample-container with iframe.
   * The iframe is hidden behind a CSS ::before loading spinner until it fires its load event
   */
  function buildShell(widget, iframeSrc, height, alt, index) {
    widget.classList.add('code-view');

    const navbar     = document.createElement('div');
    navbar.className = 'code-view-navbar';

    const exampleTabId = `cv-${index}-example`;
    const exampleTab   = document.createElement('div');
    exampleTab.className     = 'code-view-tab code-view-tab--active';
    exampleTab.textContent   = 'EXAMPLE';
    exampleTab.dataset.tabId = exampleTabId;

    const fsBtn     = document.createElement('span');
    fsBtn.className = 'fs-button-container';
    fsBtn.title     = 'Expand to fullscreen';

    navbar.appendChild(exampleTab);
    navbar.appendChild(fsBtn);

    const container     = document.createElement('div');
    container.className = 'code-views-container';

    const samplePane     = document.createElement('div');
    samplePane.id        = exampleTabId;
    samplePane.className = 'sample-container code-view-tab-content loading';
    samplePane.style.height = height;

    const iframe = document.createElement('iframe');
    iframe.style.width  = '100%';
    iframe.style.height = '100%';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('seamless', '');
    iframe.title = alt;

    // Always use data-src — initCodeViews manages when to set iframe.src
    // via a serial queue so iframes load one at a time.
    iframe.dataset.src = iframeSrc;

    samplePane.appendChild(iframe);
    container.appendChild(samplePane);
    widget.appendChild(navbar);
    widget.appendChild(container);

    fsBtn.addEventListener('click', () => {
      const src = iframe.src || iframe.dataset.src || '';
      if (src) window.open(src + (src.includes('?') ? '&' : '?') + 'nav=0', '_blank');
    });

    function activateTab(tab) {
      navbar.querySelectorAll('.code-view-tab, .code-view-tab--active').forEach(t => {
        t.classList.remove('code-view-tab--active');
        t.classList.add('code-view-tab');
      });
      container.querySelectorAll('.code-view-tab-content').forEach(c => {
        c.style.display = 'none';
      });
      tab.classList.remove('code-view-tab');
      tab.classList.add('code-view-tab--active');
      const pane = container.querySelector('#' + tab.dataset.tabId);
      if (pane) pane.style.display = '';
      fsBtn.style.visibility = tab.dataset.tabId === exampleTabId ? 'visible' : 'hidden';
    }

    exampleTab.addEventListener('click', () => activateTab(exampleTab));

    return { navbar, container, activateTab };
  }

  function addCodeTab(navbar, container, activateTab, widgetIndex, file, tabIndex) {
    const lang  = file.fileExtension === 'js' ? 'javascript' : (file.fileExtension || 'text');
    const tabId = `cv-${widgetIndex}-code-${tabIndex}`;

    const tab = document.createElement('div');
    tab.className     = 'code-view-tab';
    tab.textContent   = file.fileHeader.toUpperCase();
    tab.dataset.tabId = tabId;
    tab.addEventListener('click', () => activateTab(tab));
    navbar.insertBefore(tab, navbar.lastElementChild);

    const pane     = document.createElement('div');
    pane.id        = tabId;
    pane.className = 'code-view-tab-content';
    pane.style.display = 'none';

    const pre     = document.createElement('pre');
    pre.className = 'code-wrapper';

    const code = document.createElement('code');
    code.className   = `language-${lang}`;
    code.textContent = file.content;

    const copyBtn = document.createElement('button');
    copyBtn.className   = 'cv-hljs-code-copy hidden';
    copyBtn.textContent = 'COPY CODE';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(file.content).then(() => {
        const orig = copyBtn.textContent;
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

    if (typeof hljs !== 'undefined') hljs.highlightElement(code);
  }

  /**
   * Render the live-editing footer. Buttons are only shown when a handler
   * is provided — callers are responsible for supplying fallback handlers.
   */
  function addFooter(widget, explicitEditor, onStackblitz, onCodeSandbox) {
    const footer     = document.createElement('div');
    footer.className = 'editing-buttons-container';

    const label     = document.createElement('span');
    label.className   = 'editing-label';
    label.textContent = 'Edit in: ';
    footer.appendChild(label);

    if ((!explicitEditor || explicitEditor === 'stackblitz') && onStackblitz) {
      const btn = document.createElement('button');
      btn.className        = 'stackblitz-btn';
      btn.textContent      = 'StackBlitz';
      btn.style.fontWeight = '500';
      btn.addEventListener('click', onStackblitz);
      footer.appendChild(btn);
    }

    if ((!explicitEditor || explicitEditor === 'csb') && onCodeSandbox) {
      const btn = document.createElement('button');
      btn.className        = 'codesandbox-btn';
      btn.textContent      = 'CodeSandbox';
      btn.style.fontWeight = '500';
      btn.addEventListener('click', onCodeSandbox);
      footer.appendChild(btn);
    }

    widget.appendChild(footer);
  }

  // AngularCodeService

  /**
   * Handles Angular demo code tabs and live-editing buttons.
   */
  class AngularCodeService {
    async init({ widget, iframeSrc, demosBaseUrl, widgetIndex, navbar, container, activateTab }) {
      const samplePath     = getSamplePath(iframeSrc, demosBaseUrl);
      const isDv           = isDvSample(samplePath);
      const assetDir       = isDv ? 'code-viewer' : 'samples';
      const explicitEditor = isDv ? 'csb' : null;

      // Precompute GitHub URL handlers — used as fallback when fetch fails.
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

        (sampleData.sampleFiles || [])
          .filter(f => f.isMain)
          .sort((a, b) => SAMPLES_ORDER.indexOf(a.fileHeader) - SAMPLES_ORDER.indexOf(b.fileHeader))
          .forEach((file, i) => addCodeTab(navbar, container, activateTab, widgetIndex, file, i));

        const onStackblitz = isDv ? null : () => this._openInStackBlitz(sampleData, sharedData);
        addFooter(widget, explicitEditor, onStackblitz, fallbackCodeSandbox);

      } catch (err) {
        console.warn('[code-view] Could not fetch Angular sample files:', err.message);
        addFooter(widget, explicitEditor, fallbackStackblitz, fallbackCodeSandbox);
      }
    }

    async _openInStackBlitz(sampleData, sharedData) {
      let sdk;
      try {
        sdk = await this._loadStackBlitzSdk();
      } catch (e) {
        console.warn('[code-view] StackBlitz SDK failed to load:', e.message);
        return;
      }
      const files = {};
      (sharedData?.files || []).forEach(f => { if (f.path) files[f.path.replace(/^\.\//, '')] = f.content || ''; });
      (sampleData.sampleFiles || []).forEach(f => { if (f.path) files[f.path.replace(/^\.\//, '')] = f.content || ''; });
      sdk.openProject(
        { title: 'Infragistics Angular Components', description: 'Auto-generated from Infragistics Angular Docs', template: 'node', files, tags: ['angular', 'material', 'cdk', 'web', 'example'] },
        { openFile: 'src/app/app.component.ts' },
      );
    }

    _loadStackBlitzSdk() {
      if (window.StackBlitzSDK) return Promise.resolve(window.StackBlitzSDK);
      return new Promise((resolve, reject) => {
        const s   = document.createElement('script');
        s.src     = 'https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js';
        s.onload  = () => resolve(window.StackBlitzSDK);
        s.onerror = () => reject(new Error('Failed to load StackBlitz SDK'));
        document.head.appendChild(s);
      });
    }

    _openCodeSandboxUrl(samplePath, demosBaseUrl) {
      const isDv   = isDvSample(samplePath);
      const branch = getRepoBranch(demosBaseUrl, isDv);
      const repo   = isDv ? 'igniteui-angular-examples' : 'igniteui-live-editing-samples';
      const segs   = new URL(demosBaseUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean);
      const prefix = isDv ? 'samples/' : (segs.pop() || 'angular-demos') + '/';
      window.open(`https://codesandbox.io/p/sandbox/github/IgniteUI/${repo}/tree/${branch}/${prefix}${samplePath}`, '_blank');
    }

    _openStackBlitzUrl(samplePath, demosBaseUrl) {
      const isDv   = isDvSample(samplePath);
      const branch = getRepoBranch(demosBaseUrl, isDv);
      const repo   = isDv ? 'igniteui-angular-examples' : 'igniteui-live-editing-samples';
      const segs   = new URL(demosBaseUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean);
      const prefix = isDv ? 'samples/' : (segs.pop() || 'angular-demos') + '/';
      window.open(`https://stackblitz.com/github/IgniteUI/${repo}/tree/${branch}/${prefix}${samplePath}`, '_blank');
    }
  }

  // XplatCodeService

  /**
   * Handles React / WebComponents / Blazor demo code tabs and live-editing.
   *
   * Platform differences:
   *   react / wc  — CodeSandbox GitHub URL when github-src is present
   *   blazor      — no live editing; JSON fetched via relative URL (Vite proxy)
   *                 to avoid CORS from the local Blazor dev server
   */
  class XplatCodeService {
    constructor(platform) {
      this.platform          = platform;
      this.samplesOrder      = XPLAT_SAMPLES_ORDER[platform] || ['ts', 'html', 'css'];
      this.codeBase          = XPLAT_CODE_BASE[platform]     || '/code-viewer/';
      this.enableLiveEditing = platform !== 'blazor';
    }

    async init({ widget, iframeSrc, demosBaseUrl, widgetIndex, navbar, container, activateTab, githubSrc }) {
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

        (data.sampleFiles || [])
          .filter(f => f.isMain)
          .sort((a, b) => this.samplesOrder.indexOf(a.fileHeader) - this.samplesOrder.indexOf(b.fileHeader))
          .forEach((file, i) => addCodeTab(navbar, container, activateTab, widgetIndex, file, i));

        addXplatFooter();
      } catch (err) {
        console.warn('[code-view] Could not fetch xplat sample files:', err.message);
        addXplatFooter();
      }
    }

    _openCodeSandbox(githubSrc, demosBaseUrl) {
      const branch = getXplatBranch(demosBaseUrl);
      window.open(
        `https://codesandbox.io/p/sandbox/github/IgniteUI/igniteui-${this.platform}-examples/tree/${branch}/samples/${githubSrc}`,
        '_blank',
      );
    }
  }

  // Entry point

  function createCodeService(platform) {
    if (isXplatPlatform(platform)) return new XplatCodeService(platform);
    return new AngularCodeService();
  }

  function normalizeRawCodeViews() {
    document.querySelectorAll('code-view').forEach(el => {
      const src = el.getAttribute('iframe-src');
      if (!src) return;

      const demosBaseUrl = el.getAttribute('data-demos-base-url') || '';
      const githubSrc    = el.getAttribute('github-src')          || '';
      const styleStr     = el.getAttribute('style')               || '';
      const heightMatch  = styleStr.match(/height:\s*(\d+px)/i);
      const height       = heightMatch ? heightMatch[1] : '400px';
      const alt          = el.getAttribute('alt')                 || 'Demo';

      const div = document.createElement('div');
      div.className          = 'ig-code-view';
      div.dataset.src        = src;
      div.dataset.height     = height;
      div.dataset.alt        = alt;
      if (demosBaseUrl) div.dataset.demosBaseUrl = demosBaseUrl;
      if (githubSrc)    div.dataset.githubSrc    = githubSrc;

      el.replaceWith(div);
    });
  }

  function initCodeViews() {
    normalizeRawCodeViews();

    const platform = getPagePlatform();
    const service  = createCodeService(platform);

    // Serial iframe-load queue. Loading all iframes simultaneously causes the
    // browser to parse and execute many JS bundles at once, freezing the main
    // thread. Instead we load one iframe at a time: the next one starts only
    // after the current iframe fires its `load` event.
    let iframeQueue = [];
    let iframeLoading = false;

    function processIframeQueue() {
      if (iframeLoading || iframeQueue.length === 0) return;
      iframeLoading = true;
      const { iframe, samplePane } = iframeQueue.shift();

      iframe.addEventListener('load', () => {
        samplePane.classList.remove('loading');
        iframeLoading = false;
        processIframeQueue();
      }, { once: true });

      iframe.src = iframe.dataset.src;
    }

    document.querySelectorAll('.ig-code-view').forEach((widget, index) => {
      const src          = widget.dataset.src;
      const demosBaseUrl = widget.dataset.demosBaseUrl || '';
      const height       = widget.dataset.height       || '400px';
      const alt          = widget.dataset.alt          || 'Demo';
      const githubSrc    = widget.dataset.githubSrc    || '';

      if (!src) return;

      const { navbar, container, activateTab } = buildShell(widget, src, height, alt, index);

      if (!demosBaseUrl) return;

      const ctx = { widget, iframeSrc: src, demosBaseUrl, widgetIndex: index, navbar, container, activateTab, githubSrc };

      // buildShell always stores the URL in data-src; initCodeViews decides
      // when to actually assign iframe.src via the serial queue.
      const iframe     = widget.querySelector('iframe');
      const samplePane = widget.querySelector('.sample-container');

      if (iframe && samplePane) {
        // Enqueue the iframe. For index 0 enqueue immediately (after paint);
        // for others wait until the widget scrolls into view.
        const enqueue = () => {
          iframeQueue.push({ iframe, samplePane });
          processIframeQueue();
        };
        if (index === 0) {
          requestAnimationFrame(enqueue);
        } else {
          const visObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
              visObs.disconnect();
              enqueue();
            }
          });
          visObs.observe(samplePane);
        }
      }

      // Fetch code-tab data only when the widget becomes visible.
      const startFetch = () => service.init(ctx);
      if (index === 0) {
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(startFetch);
        } else {
          requestAnimationFrame(startFetch);
        }
      } else {
        const fetchObs = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            fetchObs.disconnect();
            startFetch();
          }
        });
        fetchObs.observe(samplePane || widget);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeViews);
  } else {
    initCodeViews();
  }
})();

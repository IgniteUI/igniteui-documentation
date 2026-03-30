/**
 * code-view.js
 *
 * Client-side widget that transforms `.ig-code-view` placeholder divs (emitted
 * by the remark-docfx plugin) into the full interactive code-view widget that
 * the old igniteui-docfx-template produced at runtime via jQuery + jQuery-UI.
 *
 * Replicates:
 *   - ArticleRenderingService.instantiateCodeViews()  (iframe + tab UI)
 *   - AngularCodeService.init() / generateLiveEditingAngularApp()
 *     (fetch sample source files → code tabs, StackBlitz / CodeSandbox buttons)
 *   - XplatCodeService.init() for React, WebComponents (wc), Blazor
 */
(function () {
  'use strict';

  // ── constants ────────────────────────────────────────────────────────────────

  /** Angular samples tab order */
  const SAMPLES_ORDER = ['modules', 'ts', 'html', 'scss', 'css'];

  /** Tab order per xplat platform key */
  const XPLAT_SAMPLES_ORDER = {
    react:  ['tsx', 'ts', 'html', 'css'],
    wc:     ['tsx', 'ts', 'html', 'css'],
    blazor: ['razor', 'cs', 'js', 'css'],
  };

  /**
   * Code-viewer JSON base path per xplat key.
   * wc   → /assets/code-viewer/
   * rest → /code-viewer/
   * Mirrors XplatCodeService constructor samplesCodeBasePath logic.
   */
  const XPLAT_CODE_BASE = {
    wc:     '/assets/code-viewer/',
    react:  '/code-viewer/',
    blazor: '/code-viewer/',
  };

  const DV_PATHS  = ['gauges/', 'maps/', 'excel/', 'charts/'];
  const ASSETS_RE = /([.]{0,2}\/)*assets\//g;

  // ── platform detection ───────────────────────────────────────────────────────

  /**
   * Read the platform from the <meta property="docs:platform"> tag injected by
   * getPlatformHead() in platform.ts.  Normalises web-components → wc to match
   * XplatCodeService conventions.
   */
  function getPagePlatform() {
    const meta = document.querySelector('meta[property="docs:platform"]');
    const raw  = meta ? (meta.getAttribute('content') || 'angular') : 'angular';
    return raw === 'web-components' ? 'wc' : raw;
  }

  function isXplatPlatform(platform) {
    return platform === 'react' || platform === 'wc' || platform === 'blazor';
  }

  // ── helpers ──────────────────────────────────────────────────────────────────

  function getSamplePath(iframeSrc, demosBaseUrl) {
    return iframeSrc
      .replace(demosBaseUrl + '/', '')
      .replace(/\?.*/, '')
      .replace(/\/$/, '');
  }

  /**
   * Returns the Git branch to use for angular live-editing links.
   * Non-production = staging demos URL or docs site running on localhost.
   *
   * Branch name casing differs per repo:
   *   igniteui-live-editing-samples (non-DV) → 'vNext'
   *   igniteui-angular-examples     (DV)     → 'vnext'
   */
  function getRepoBranch(demosBaseUrl, isDv) {
    const demosHost = new URL(demosBaseUrl).host;
    const isNonProd = demosHost.includes('staging')
      || window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';
    if (isDv) return 'vnext'; // igniteui-angular-examples always uses vnext
    return isNonProd ? 'vNext' : 'master';
  }

  /**
   * Returns the Git branch for xplat platforms (all lowercase).
   * Mirrors XplatCodeService.onGithubProjectButtonClicked branch logic.
   */
  function getXplatBranch(demosBaseUrl) {
    const host = new URL(demosBaseUrl).host;
    const isNonProd = host.includes('staging')
      || window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';
    return isNonProd ? 'vnext' : 'master';
  }

  function isDvSample(samplePath) {
    return DV_PATHS.some(p => samplePath.startsWith(p));
  }

  /**
   * Rewrite relative asset paths inside fetched source-file content so they
   * point to the live demos server.  Mirrors AngularCodeService.replaceRelativeAssetsUrls().
   */
  function replaceRelativeAssetUrls(files, demosBaseUrl) {
    const assetsBase = demosBaseUrl.replace(/\/$/, '') + '/assets/';
    files.forEach(f => {
      if (f.content && ASSETS_RE.test(f.content)) {
        f.content = f.content.replace(ASSETS_RE, assetsBase);
      }
      ASSETS_RE.lastIndex = 0; // reset stateful regex
    });
  }

  /**
   * Lazily load the StackBlitz SDK UMD bundle from CDN.
   */
  function loadStackBlitzSdk() {
    if (window.StackBlitzSDK) return Promise.resolve(window.StackBlitzSDK);
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js';
      s.onload  = () => resolve(window.StackBlitzSDK);
      s.onerror = () => reject(new Error('Failed to load StackBlitz SDK'));
      document.head.appendChild(s);
    });
  }

  /**
   * Open the Angular sample in StackBlitz using the SDK WebContainer approach.
   * Replicates AngularCodeService._openStackBlitz().
   */
  async function openInStackBlitz(sampleData, sharedData) {
    let sdk;
    try {
      sdk = await loadStackBlitzSdk();
    } catch (e) {
      console.warn('[code-view] StackBlitz SDK failed to load:', e.message);
      return;
    }

    const sharedFiles = (sharedData && sharedData.files)       || [];
    const sampleFiles = (sampleData && sampleData.sampleFiles) || [];

    const files = {};
    sharedFiles.forEach(f => { if (f.path) files[f.path.replace(/^\.\//, '')] = f.content || ''; });
    sampleFiles.forEach(f => { if (f.path) files[f.path.replace(/^\.\//, '')] = f.content || ''; });

    sdk.openProject(
      {
        title:       'Infragistics Angular Components',
        description: 'Auto-generated from Infragistics Angular Docs',
        template:    'node',
        files,
        tags: ['angular', 'material', 'cdk', 'web', 'example'],
      },
      { openFile: 'src/app/app.component.ts' }
    );
  }

  /**
   * Open the Angular sample in CodeSandbox via GitHub URL.
   *
   * DV (xplat): igniteui-angular-examples, samples under /samples/.
   * Non-DV:     igniteui-live-editing-samples, samples under /angular-demos/.
   */
  function openInCodeSandbox(samplePath, demosBaseUrl) {
    const isDv   = isDvSample(samplePath);
    const branch = getRepoBranch(demosBaseUrl, isDv);
    const repo   = isDv ? 'igniteui-angular-examples' : 'igniteui-live-editing-samples';
    const segs   = new URL(demosBaseUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean);
    const prefix = isDv ? 'samples/' : (segs.pop() || 'angular-demos') + '/';
    window.open(
      `https://codesandbox.io/p/sandbox/github/IgniteUI/${repo}/tree/${branch}/${prefix}${samplePath}`,
      '_blank'
    );
  }

  /**
   * Open an xplat sample in CodeSandbox via GitHub URL.
   * Mirrors XplatCodeService.getGithubSampleUrl() for CodeSandbox.
   */
  function openInCodeSandboxXplat(githubSrc, xplat, demosBaseUrl) {
    const branch = getXplatBranch(demosBaseUrl);
    window.open(
      `https://codesandbox.io/p/sandbox/github/IgniteUI/igniteui-${xplat}-examples/tree/${branch}/samples/${githubSrc}`,
      '_blank'
    );
  }

  // ── DOM builders ─────────────────────────────────────────────────────────────

  /**
   * Build the initial widget shell:
   *   .code-view
   *     .code-view-navbar   [EXAMPLE tab | … code tabs … | fullscreen btn]
   *     .code-views-container
   *       #cv-{i}-example   .sample-container  (iframe lives here)
   */
  function buildShell(widget, iframeSrc, height, alt, index) {
    widget.classList.add('code-view');

    // ── navbar ──────────────────────────────────────────────────────────────
    const navbar = document.createElement('div');
    navbar.className = 'code-view-navbar';

    const exampleTabId = `cv-${index}-example`;
    const exampleTab   = document.createElement('div');
    exampleTab.className       = 'code-view-tab code-view-tab--active';
    exampleTab.textContent     = 'EXAMPLE';
    exampleTab.dataset.tabId   = exampleTabId;

    const fsBtn = document.createElement('span');
    fsBtn.className = 'fs-button-container';
    fsBtn.title     = 'Expand to fullscreen';

    navbar.appendChild(exampleTab);
    navbar.appendChild(fsBtn);

    // ── container + sample pane ─────────────────────────────────────────────
    const container     = document.createElement('div');
    container.className = 'code-views-container';

    const samplePane = document.createElement('div');
    samplePane.id        = exampleTabId;
    samplePane.className = 'sample-container code-view-tab-content loading';
    samplePane.style.height = height;

    const iframe = document.createElement('iframe');
    iframe.style.width  = '100%';
    iframe.style.height = '100%';
    iframe.frameBorder  = '0';
    iframe.setAttribute('seamless', '');
    iframe.title = alt;

    const onIframeLoad = () => samplePane.classList.remove('loading');

    if (index === 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        iframe.addEventListener('load', onIframeLoad);
        iframe.src = iframeSrc;
      }));
    } else {
      iframe.dataset.src = iframeSrc;
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          iframe.addEventListener('load', onIframeLoad);
          iframe.src = iframe.dataset.src;
          obs.disconnect();
        }
      });
      obs.observe(samplePane);
    }

    samplePane.appendChild(iframe);
    container.appendChild(samplePane);

    widget.appendChild(navbar);
    widget.appendChild(container);

    // ── fullscreen handler ──────────────────────────────────────────────────
    fsBtn.addEventListener('click', () => {
      const src = iframe.src || iframe.dataset.src || '';
      if (src) window.open(src + (src.includes('?') ? '&' : '?') + 'nav=0', '_blank');
    });

    // ── tab-switching ───────────────────────────────────────────────────────
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
      fsBtn.style.visibility = (tab.dataset.tabId === exampleTabId) ? 'visible' : 'hidden';
    }

    exampleTab.addEventListener('click', () => activateTab(exampleTab));

    return { navbar, container, exampleTabId, activateTab };
  }

  /**
   * Add a single source-file code tab.
   */
  function addCodeTab(navbar, container, activateTab, widgetIndex, file, tabIndex) {
    const lang = file.fileExtension === 'js' ? 'javascript' : (file.fileExtension || 'text');
    const tabId = `cv-${widgetIndex}-code-${tabIndex}`;

    const tab = document.createElement('div');
    tab.className     = 'code-view-tab';
    tab.textContent   = file.fileHeader.toUpperCase();
    tab.dataset.tabId = tabId;
    tab.addEventListener('click', () => activateTab(tab));

    navbar.insertBefore(tab, navbar.lastElementChild);

    const pane = document.createElement('div');
    pane.id        = tabId;
    pane.className = 'code-view-tab-content';
    pane.style.display = 'none';

    const pre  = document.createElement('pre');
    pre.className = 'code-wrapper';
    const code = document.createElement('code');
    code.className   = `language-${lang}`;
    code.textContent = file.content;

    const copyBtn = document.createElement('button');
    copyBtn.className   = 'cv-hljs-code-copy hidden';
    copyBtn.textContent = 'COPY CODE';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(file.content).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = 'COPIED!';
        setTimeout(() => { copyBtn.textContent = original; }, 1500);
      });
    });

    pre.addEventListener('mouseenter', () => copyBtn.classList.remove('hidden'));
    pre.addEventListener('mouseleave', () => copyBtn.classList.add('hidden'));

    pre.appendChild(code);
    pre.appendChild(copyBtn);
    pane.appendChild(pre);
    container.appendChild(pane);

    if (typeof hljs !== 'undefined') {
      hljs.highlightElement(code);
    }
  }

  /**
   * Render the live-editing footer with StackBlitz / CodeSandbox buttons.
   *
   * @param {Function|null} onStackblitz  Called when StackBlitz button is clicked.
   * @param {Function|null} onCodeSandbox Called when CodeSandbox button is clicked.
   */
  function addFooter(widget, samplePath, demosBaseUrl, explicitEditor, onStackblitz, onCodeSandbox) {
    const footer = document.createElement('div');
    footer.className = 'editing-buttons-container';

    const label = document.createElement('span');
    label.className   = 'editing-label';
    label.textContent = 'Edit in: ';
    footer.appendChild(label);

    if (!explicitEditor || explicitEditor === 'stackblitz') {
      const btn = document.createElement('button');
      btn.className    = 'stackblitz-btn';
      btn.textContent  = 'StackBlitz';
      btn.style.fontWeight = '500';
      btn.addEventListener('click', () => {
        if (onStackblitz) {
          onStackblitz();
        } else {
          const isDv   = isDvSample(samplePath);
          const repo   = isDv ? 'igniteui-angular-examples' : 'igniteui-live-editing-samples';
          const branch = getRepoBranch(demosBaseUrl, isDv);
          const segs   = new URL(demosBaseUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean);
          const prefix = isDv ? 'samples/' : (segs.pop() || 'angular-demos') + '/';
          window.open(`https://stackblitz.com/github/IgniteUI/${repo}/tree/${branch}/${prefix}${samplePath}`, '_blank');
        }
      });
      footer.appendChild(btn);
    }

    if (!explicitEditor || explicitEditor === 'csb') {
      const btn = document.createElement('button');
      btn.className    = 'codesandbox-btn';
      btn.textContent  = 'CodeSandbox';
      btn.style.fontWeight = '500';
      btn.addEventListener('click', () => {
        if (onCodeSandbox) {
          onCodeSandbox();
        } else {
          const isDv   = isDvSample(samplePath);
          const repo   = isDv ? 'igniteui-angular-examples' : 'igniteui-live-editing-samples';
          const branch = getRepoBranch(demosBaseUrl, isDv);
          const segs   = new URL(demosBaseUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean);
          const prefix = isDv ? 'samples/' : (segs.pop() || 'angular-demos') + '/';
          window.open(`https://codesandbox.io/p/sandbox/github/IgniteUI/${repo}/tree/${branch}/${prefix}${samplePath}`, '_blank');
        }
      });
      footer.appendChild(btn);
    }

    widget.appendChild(footer);
  }

  // ── async: fetch sample source files (Angular) ───────────────────────────────

  /**
   * Fetch Angular sample metadata and populate code tabs.
   * Mirrors AngularCodeService.generateLiveEditingAngularApp().
   */
  async function fetchAndBuildCodeTabs(widget, iframeSrc, demosBaseUrl, widgetIndex, navbar, container, activateTab) {
    const samplePath = getSamplePath(iframeSrc, demosBaseUrl);
    const isDv       = isDvSample(samplePath);
    const assetDir   = isDv ? 'code-viewer' : 'samples';

    try {
      const metaRes = await fetch(
        `${demosBaseUrl}/assets/samples/meta.json?t=${Date.now()}`,
        { credentials: 'omit' }
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
      if (!sampleRes.ok) throw new Error(`sample meta ${sampleRes.status}`);

      const [sampleData, sharedData] = await Promise.all([
        sampleRes.json(),
        sharedRes.ok ? sharedRes.json() : Promise.resolve(null),
      ]);

      replaceRelativeAssetUrls(sampleData.sampleFiles || [], demosBaseUrl);
      if (sharedData) replaceRelativeAssetUrls(sharedData.files || [], demosBaseUrl);

      const mainFiles = (sampleData.sampleFiles || [])
        .filter(f => f.isMain)
        .sort((a, b) => SAMPLES_ORDER.indexOf(a.fileHeader) - SAMPLES_ORDER.indexOf(b.fileHeader));

      mainFiles.forEach((file, i) =>
        addCodeTab(navbar, container, activateTab, widgetIndex, file, i)
      );

      const explicitEditor = isDv ? 'csb' : null;
      const onStackblitz   = isDv ? null  : () => openInStackBlitz(sampleData, sharedData);
      const onCodeSandbox  = () => openInCodeSandbox(samplePath, demosBaseUrl);
      addFooter(widget, samplePath, demosBaseUrl, explicitEditor, onStackblitz, onCodeSandbox);

    } catch (err) {
      console.warn('[code-view] Could not fetch sample files:', err.message);
      addFooter(widget, samplePath, demosBaseUrl, null, null, null);
    }
  }

  // ── async: fetch sample source files (xplat) ────────────────────────────────

  /**
   * Fetch xplat (React / WebComponents / Blazor) sample metadata and build tabs.
   * Mirrors XplatCodeService.getSamplesContent() / sampleFilePostProcess().
   *
   * JSON path:
   *   wc   → {demosBaseUrl}/assets/code-viewer/{samplePath}.json
   *   rest → {demosBaseUrl}/code-viewer/{samplePath}.json
   *
   * Live editing:
   *   react / wc  → StackBlitz + CodeSandbox GitHub URL when github-src present
   *   blazor      → no live editing buttons
   */
  async function fetchXplatCodeTabs(widget, iframeSrc, demosBaseUrl, githubSrc, xplat, widgetIndex, navbar, container, activateTab) {
    const samplePath  = getSamplePath(iframeSrc, demosBaseUrl);
    const codeBase    = XPLAT_CODE_BASE[xplat] || '/code-viewer/';
    const samplesOrder = XPLAT_SAMPLES_ORDER[xplat] || ['ts', 'html', 'css'];

    const addXplatFooter = () => {
      if (xplat === 'blazor' || !githubSrc) return;
      // Mirrors XplatCodeService.renderFooter(..., "csb") — CSB only, no StackBlitz for xplat.
      addFooter(
        widget, samplePath, demosBaseUrl, 'csb',
        null,
        () => openInCodeSandboxXplat(githubSrc, xplat, demosBaseUrl)
      );
    };

    try {
      // Blazor's local dev server uses HTTPS with a self-signed cert on a
      // non-4200 port, which causes CORS errors.  Route through Vite's proxy
      // (configured in integration.ts) by using a relative URL.
      // All other platforms fetch directly from demosBaseUrl.
      const jsonUrl = xplat === 'blazor'
        ? `${codeBase}${samplePath}.json`
        : `${demosBaseUrl}${codeBase}${samplePath}.json`;
      const res = await fetch(jsonUrl, { credentials: 'omit' });
      if (!res.ok) throw new Error(`xplat sample meta ${res.status}`);
      const data = await res.json();

      const mainFiles = (data.sampleFiles || [])
        .filter(f => f.isMain)
        .sort((a, b) => samplesOrder.indexOf(a.fileHeader) - samplesOrder.indexOf(b.fileHeader));

      mainFiles.forEach((file, i) =>
        addCodeTab(navbar, container, activateTab, widgetIndex, file, i)
      );

      addXplatFooter();
    } catch (err) {
      console.warn('[code-view] Could not fetch xplat sample files:', err.message);
      addXplatFooter();
    }
  }

  // ── main entry point ─────────────────────────────────────────────────────────

  /**
   * Normalize raw <code-view> custom elements that were not transformed
   * server-side into .ig-code-view placeholder divs.
   * Also reads the github-src attribute for xplat live editing.
   */
  function normalizeRawCodeViews() {
    document.querySelectorAll('code-view').forEach(el => {
      const src = el.getAttribute('iframe-src');
      if (!src) return;

      const demosBaseUrl = el.getAttribute('data-demos-base-url') || '';
      const githubSrc    = el.getAttribute('github-src') || '';
      const styleStr     = el.getAttribute('style') || '';
      const heightMatch  = styleStr.match(/height:\s*(\d+px)/i);
      const height       = heightMatch ? heightMatch[1] : '400px';
      const alt          = el.getAttribute('alt') || 'Demo';

      const div = document.createElement('div');
      div.className = 'ig-code-view';
      div.dataset.src    = src;
      div.dataset.height = height;
      div.dataset.alt    = alt;
      if (demosBaseUrl) div.dataset.demosBaseUrl = demosBaseUrl;
      if (githubSrc)    div.dataset.githubSrc    = githubSrc;

      el.replaceWith(div);
    });
  }

  function initCodeViews() {
    normalizeRawCodeViews();

    const platform = getPagePlatform();
    const isXplat  = isXplatPlatform(platform);

    document.querySelectorAll('.ig-code-view').forEach((widget, index) => {
      const src          = widget.dataset.src;
      const demosBaseUrl = widget.dataset.demosBaseUrl || '';
      const height       = widget.dataset.height || '400px';
      const alt          = widget.dataset.alt    || 'Demo';
      const githubSrc    = widget.dataset.githubSrc || '';

      if (!src) return;

      const { navbar, container, activateTab } =
        buildShell(widget, src, height, alt, index);

      if (!demosBaseUrl) return;

      const startFetch = () => {
        if (isXplat) {
          fetchXplatCodeTabs(widget, src, demosBaseUrl, githubSrc, platform, index, navbar, container, activateTab);
        } else {
          fetchAndBuildCodeTabs(widget, src, demosBaseUrl, index, navbar, container, activateTab);
        }
      };
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(startFetch);
      } else {
        requestAnimationFrame(startFetch);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeViews);
  } else {
    initCodeViews();
  }
})();

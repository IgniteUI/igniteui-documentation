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
 */
(function () {
  'use strict';

  // ── constants ────────────────────────────────────────────────────────────────

  const SAMPLES_ORDER = ['modules', 'ts', 'html', 'scss', 'css'];
  const DV_PATHS      = ['gauges/', 'maps/', 'excel/', 'charts/'];
  const ASSETS_RE     = /([.]{0,2}\/)*assets\//g;

  // ── helpers ──────────────────────────────────────────────────────────────────

  function getSamplePath(iframeSrc, demosBaseUrl) {
    return iframeSrc
      .replace(demosBaseUrl + '/', '')
      .replace(/\?.*/, '')
      .replace(/\/$/, '');
  }

  /**
   * Returns the Git branch to use for live-editing links.
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

  function isDvSample(samplePath) {
    return DV_PATHS.some(p => samplePath.startsWith(p));
  }

  /**
   * Rewrite relative asset paths inside fetched source-file content so they
   * point to the live demos server.  Mirrors AngularCodeService.replaceRelativeAssetsUrls().
   * When the sample runs on StackBlitz it needs absolute URLs — localhost is unreachable.
   */
  function replaceRelativeAssetUrls(files, demosBaseUrl) {
    // Use the resolved demosBaseUrl as the asset base (works for staging/prod).
    // For localhost we still do the replacement so the pattern is consistent;
    // assets simply won't load inside StackBlitz when pointed at localhost.
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
   * The SDK exposes `window.StackBlitzSDK` after loading.
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
   * Open the sample in StackBlitz using the SDK WebContainer approach.
   * Replicates AngularCodeService._openStackBlitz().
   *
   * template: 'node' → StackBlitz boots a real Node.js environment in the
   * browser, runs `npm install` and `ng serve` as a live dev server.
   * This is fundamentally different from the old POST-form / 'angular-cli'
   * template which only simulated an Angular project statically.
   *
   * Combines sharedData.files (scaffolding) + sampleData.sampleFiles (sample)
   * into a flat { path: content } dictionary, sample files taking precedence.
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

    // Build flat file dictionary; sample files override shared files at same path
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
   * Open the sample in CodeSandbox via GitHub URL.
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

  // ── DOM builders ─────────────────────────────────────────────────────────────

  /**
   * Build the initial widget shell:
   *   .code-view
   *     .code-view-navbar   [EXAMPLE tab | … code tabs … | fullscreen btn]
   *     .code-views-container
   *       #cv-{i}-example   .sample-container  (iframe lives here)
   *
   * Mirrors instantiateCodeViews() from article.ts.
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
    iframe.addEventListener('load', () => samplePane.classList.remove('loading'));

    if (index === 0) {
      // First code-view: load eagerly (mirrors the original behaviour)
      iframe.src = iframeSrc;
    } else {
      // Subsequent code-views: lazy-load via IntersectionObserver
      iframe.dataset.src = iframeSrc;
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
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
      // Hide fullscreen button when a code tab is active
      fsBtn.style.visibility = (tab.dataset.tabId === exampleTabId) ? 'visible' : 'hidden';
    }

    exampleTab.addEventListener('click', () => activateTab(exampleTab));

    return { navbar, container, exampleTabId, activateTab };
  }

  /**
   * Add a single source-file code tab.
   * Mirrors CodeView.createTabsWithCodeViews() from code-view.ts.
   */
  function addCodeTab(navbar, container, activateTab, widgetIndex, file, tabIndex) {
    const lang = file.fileExtension === 'js' ? 'javascript' : (file.fileExtension || 'text');
    const tabId = `cv-${widgetIndex}-code-${tabIndex}`;

    const tab = document.createElement('div');
    tab.className     = 'code-view-tab';
    tab.textContent   = file.fileHeader.toUpperCase();
    tab.dataset.tabId = tabId;
    tab.addEventListener('click', () => activateTab(tab));

    // Insert before the fullscreen button (always last child of navbar)
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

    // Copy-code button (mirrors cv-hljs-code-copy)
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

    // Highlight if highlight.js is loaded on the page
    if (typeof hljs !== 'undefined') {
      hljs.highlightElement(code);
    }
  }

  /**
   * Render the live-editing footer.
   * Mirrors CodeView.renderFooter() + AngularCodeService handlers.
   *
   * @param {Function|null} onStackblitz  Called when StackBlitz button is clicked.
   *   Receives the fetched {sampleData, sharedData} and calls openInStackBlitz().
   *   When null (fetch failed) the button falls back to the GitHub-tree URL.
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
          // Fallback: GitHub-tree URL when file content is unavailable
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
          // Fallback when file fetch failed: GitHub devbox URL
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

  // ── async: fetch sample source files ────────────────────────────────────────

  /**
   * Fetch sample metadata from the demos server and populate code tabs.
   * Mirrors AngularCodeService.generateLiveEditingAngularApp() /
   *          getAngularFiles() / angularSampleFilePostProcess().
   */
  async function fetchAndBuildCodeTabs(widget, iframeSrc, demosBaseUrl, widgetIndex, navbar, container, activateTab) {
    const samplePath = getSamplePath(iframeSrc, demosBaseUrl);
    const isDv       = isDvSample(samplePath);
    const assetDir   = isDv ? 'code-viewer' : 'samples';

    try {
      // 1. meta.json → generationTimeStamp (cache-bust key)
      const metaRes = await fetch(
        `${demosBaseUrl}/assets/samples/meta.json?t=${Date.now()}`,
        { credentials: 'omit' }
      );
      if (!metaRes.ok) throw new Error(`meta.json ${metaRes.status}`);
      const { generationTimeStamp } = await metaRes.json();

      // 2. Fetch sample metadata + shared files in parallel.
      //    Non-DV path convention: layouts/accordion-sample-1 → layouts--accordion-sample-1.json
      //    DV path convention:     charts/data-pie-chart/selection → charts/data-pie-chart/selection.json
      const sampleJsonPath = isDv
        ? `${demosBaseUrl}/assets/${assetDir}/${samplePath}.json`
        : `${demosBaseUrl}/assets/${assetDir}/${samplePath.replace('/', '--')}.json`;
      const [sampleRes, sharedRes] = await Promise.all([
        fetch(`${sampleJsonPath}?t=${generationTimeStamp}`, { credentials: 'omit' }),
        fetch(`${demosBaseUrl}/assets/samples/shared.json?t=${generationTimeStamp}`, { credentials: 'omit' }),
      ]);
      if (!sampleRes.ok) throw new Error(`sample meta ${sampleRes.status}`);

      const sampleData = await sampleRes.json();
      const sharedData = sharedRes.ok ? await sharedRes.json() : null;

      // 3. Replace relative ./assets/ URLs with absolute ones so files work
      //    when opened on StackBlitz (which can't reach localhost).
      replaceRelativeAssetUrls(sampleData.sampleFiles || [], demosBaseUrl);
      if (sharedData) replaceRelativeAssetUrls(sharedData.files || [], demosBaseUrl);

      // 4. Build code tabs for "main" files, sorted by samplesOrder
      const mainFiles = (sampleData.sampleFiles || [])
        .filter(f => f.isMain)
        .sort((a, b) => SAMPLES_ORDER.indexOf(a.fileHeader) - SAMPLES_ORDER.indexOf(b.fileHeader));

      mainFiles.forEach((file, i) =>
        addCodeTab(navbar, container, activateTab, widgetIndex, file, i)
      );

      // 5. Build footer with live-editing callbacks.
      //    DV samples: CodeSandbox only (mirrors original isDvSample check).
      //    Non-DV: both StackBlitz (WebContainer) and CodeSandbox (Define API).
      // DV (xplat): CodeSandbox only (GitHub devbox URL → igniteui-angular-examples).
      // Non-DV: both StackBlitz (file-based WebContainer) and CodeSandbox (GitHub devbox URL).
      const explicitEditor = isDv ? 'csb' : null;
      const onStackblitz   = isDv ? null  : () => openInStackBlitz(sampleData, sharedData);
      const onCodeSandbox  = () => openInCodeSandbox(samplePath, demosBaseUrl);
      addFooter(widget, samplePath, demosBaseUrl, explicitEditor, onStackblitz, onCodeSandbox);

    } catch (err) {
      console.warn('[code-view] Could not fetch sample files:', err.message);
      // Still render the footer so users can at least open the sample externally
      addFooter(widget, samplePath, demosBaseUrl, null, null, null);
    }
  }

  // ── main entry point ─────────────────────────────────────────────────────────

  /**
   * Normalize raw <code-view> custom elements that were not transformed
   * server-side into .ig-code-view placeholder divs so the main loop can
   * handle them uniformly.
   */
  function normalizeRawCodeViews() {
    document.querySelectorAll('code-view').forEach(el => {
      const src = el.getAttribute('iframe-src');
      if (!src) return;

      const demosBaseUrl = el.getAttribute('data-demos-base-url') || '';
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

      el.replaceWith(div);
    });
  }

  function initCodeViews() {
    normalizeRawCodeViews();

    document.querySelectorAll('.ig-code-view').forEach((widget, index) => {
      const src          = widget.dataset.src;
      const demosBaseUrl = widget.dataset.demosBaseUrl || '';
      const height       = widget.dataset.height || '400px';
      const alt          = widget.dataset.alt    || 'Demo';

      if (!src) return;

      const { navbar, container, activateTab } =
        buildShell(widget, src, height, alt, index);

      if (demosBaseUrl) {
        fetchAndBuildCodeTabs(widget, src, demosBaseUrl, index, navbar, container, activateTab);
      } else {
        // No demos base URL — can't build live-editing URLs, skip footer
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeViews);
  } else {
    initCodeViews();
  }
})();

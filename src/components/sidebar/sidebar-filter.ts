/**
 * <sidebar-filter> custom element.
 *
 * Owns the filter input + persistence behavior for the docs sidebar.
 *
 * Architectural rules:
 *   • State lives in attributes / sessionStorage. Visual updates are CSS-driven via:
 *         [data-filtering]      — set on the host while a non-empty query is active
 *         [data-filter-match]   — set on every <li> that should remain visible
 *     CSS hides items lacking `data-filter-match` while the host has
 *     `data-filtering`. We never toggle `.hidden`, classes, or inline styles
 *     for filter visibility.
 *   • `<details open>` is the single source of truth for expand/collapse.
 *     The persisted set of open `data-group-key` values is applied to the
 *     *incoming* document in `astro:before-swap` so the first paint after
 *     navigation already shows the correct state — no flicker.
 *   • The script is a real ES module — evaluated once per hard load and kept
 *     alive across client-side navigations, so listeners are not duplicated.
 *
 * Persistence keys (sessionStorage):
 *   sidebar-filter-value    → current filter input value
 *   sidebar-details-states  → newline-joined list of open group keys
 *   sidebar-scroll-top      → scrollTop of the items scroll container
 */

const FILTER_KEY  = 'sidebar-filter-value';
const DETAILS_KEY = 'sidebar-details-states';
const SCROLL_KEY  = 'sidebar-scroll-top';

const SCROLL_SELECTOR  = '[data-sidebar-scroll]';
const DETAILS_SELECTOR = 'details[data-group-key]';
const ITEMS_SELECTOR   = 'li[data-path]';

let _isClientSideNav = false;

// ── Storage helpers ─────────────────────────────────────────────────────────

const safeGet = (key: string): string => {
  try { return sessionStorage.getItem(key) ?? ''; } catch { return ''; }
};
const safeSet = (key: string, value: string): void => {
  try { sessionStorage.setItem(key, value); } catch { /* quota */ }
};
const safeRemove = (key: string): void => {
  try { sessionStorage.removeItem(key); } catch { /* */ }
};

// ── Tree helpers (pure, attribute-driven) ──────────────────────────────────

const collectOpenKeys = (root: ParentNode): string[] => {
  const keys: string[] = [];
  root.querySelectorAll<HTMLDetailsElement>(DETAILS_SELECTOR).forEach((d) => {
    if (d.open && d.dataset.groupKey) keys.push(d.dataset.groupKey);
  });
  return keys;
};

const applyOpenState = (root: ParentNode, openKeys: Set<string>): void => {
  root.querySelectorAll<HTMLDetailsElement>(DETAILS_SELECTOR).forEach((d) => {
    // Active-page ancestors always stay open.
    if (d.querySelector('a[aria-current="page"]')) { d.open = true; return; }
    const key = d.dataset.groupKey;
    if (key) d.open = openKeys.has(key);
  });
};

const tokenize = (q: string): string[] => q.toLowerCase().split(/\s+/).filter(Boolean);

const itemPath = (li: HTMLLIElement): string =>
  (li.dataset.path ?? li.dataset.label ?? '').toLowerCase();

// ── Cross-navigation hooks (registered once, at module evaluation) ─────────

document.addEventListener('astro:before-preparation', () => {
  _isClientSideNav = true;
  const sc = document.querySelector<HTMLElement>(SCROLL_SELECTOR);
  if (sc) safeSet(SCROLL_KEY, String(sc.scrollTop));

  // While the filter is active, the live DOM reflects the *filter's* open
  // state, not the user's intent. The component keeps the user-intended state
  // in `openSnapshot` (data-open-snapshot attribute) — persist that instead.
  const host = document.querySelector<HTMLElement>('sidebar-filter[data-filtering]');
  const intended = host?.dataset.openSnapshot;
  if (intended !== undefined) {
    safeSet(DETAILS_KEY, intended);
  } else {
    safeSet(DETAILS_KEY, collectOpenKeys(document).join('\n'));
  }
});

document.addEventListener('astro:before-swap', (e) => {
  const newDoc = (e as unknown as { newDocument: Document }).newDocument;
  // Hide the incoming scroll container until scrollTop is restored.
  const newScroll = newDoc.querySelector<HTMLElement>(SCROLL_SELECTOR);
  if (newScroll) newScroll.style.visibility = 'hidden';
  // Pre-apply persisted open state to the *incoming* DOM — first paint correct.
  const raw = safeGet(DETAILS_KEY);
  applyOpenState(newDoc, new Set(raw ? raw.split('\n').filter(Boolean) : []));
});

// ── Custom element ─────────────────────────────────────────────────────────

class SidebarFilter extends HTMLElement {
  private input!: HTMLInputElement;
  private clearBtn!: HTMLButtonElement;
  private status!: HTMLElement;
  private scrollEl: HTMLElement | null = null;
  private items: HTMLLIElement[] = [];
  private details: HTMLDetailsElement[] = [];
  /** Live user intent during filtering; mutated by toggles, persisted, source of truth for `<details>.open`. */
  private openSnapshot: Set<string> | null = null;
  /** Snapshot taken when the user starts filtering on this page; restored on Esc/clear. */
  private preFilterSnapshot: Set<string> | null = null;
  /** Suppress `toggle` persistence while we're programmatically setting `open`. */
  private suppressToggle = false;

  connectedCallback(): void {
    const input    = this.querySelector<HTMLInputElement>('[data-sidebar-filter-input]');
    const clearBtn = this.querySelector<HTMLButtonElement>('[data-sidebar-filter-clear]');
    const status   = this.querySelector<HTMLElement>('[data-sidebar-filter-status]');
    if (!input || !clearBtn || !status) return;

    this.input    = input;
    this.clearBtn = clearBtn;
    this.status   = status;
    this.scrollEl = this.querySelector<HTMLElement>(SCROLL_SELECTOR);
    this.items    = [...this.querySelectorAll<HTMLLIElement>(ITEMS_SELECTOR)];
    this.details  = [...this.querySelectorAll<HTMLDetailsElement>(DETAILS_SELECTOR)];

    this.bindEvents();
    this.restoreOnConnect();
  }

  // ── Events ──────────────────────────────────────────────────────────────

  private bindEvents(): void {
    this.input.addEventListener('input', this.onFilterInput);
    this.input.addEventListener('keydown', this.onFilterKeydown);
    this.clearBtn.addEventListener('click', this.onClearClick);
    // Persist user-driven toggles immediately (delegated, captures bubbled `toggle`).
    this.addEventListener('toggle', this.onDetailsToggle, true);
  }

  private onFilterInput = (): void => {
    safeSet(FILTER_KEY, this.input.value);
    this.applyFilter(this.input.value, 'user');
  };

  private onFilterKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape' || !this.input.value) return;
    this.resetFilter();
  };

  private onClearClick = (): void => {
    this.resetFilter();
    this.input.focus();
  };

  private onDetailsToggle = (e: Event): void => {
    if (this.suppressToggle) return;
    const target = e.target;
    if (!(target instanceof HTMLDetailsElement) || !target.dataset.groupKey) return;

    if (this.openSnapshot) {
      // Filtering is active. Update the user-intended snapshot — NOT the
      // live DOM (which currently reflects the filter's open state). The
      // snapshot is what gets restored when the filter is cleared, and
      // it's what gets persisted across navigation.
      const key = target.dataset.groupKey;
      if (target.open) this.openSnapshot.add(key);
      else this.openSnapshot.delete(key);
      this.syncSnapshotAttr();
      safeSet(DETAILS_KEY, [...this.openSnapshot].join('\n'));
      return;
    }

    // Not filtering: live DOM is the source of truth.
    safeSet(DETAILS_KEY, collectOpenKeys(this).join('\n'));
  };

  /** Mirror `openSnapshot` to a data attribute so the cross-nav hook can read it. */
  private syncSnapshotAttr(): void {
    if (this.openSnapshot) this.dataset.openSnapshot = [...this.openSnapshot].join('\n');
    else delete this.dataset.openSnapshot;
  }

  // ── Restore on connect / after navigation ───────────────────────────────

  private restoreOnConnect(): void {
    const isClientNav = _isClientSideNav;
    _isClientSideNav = false;

    const saved = isClientNav ? safeGet(FILTER_KEY) : '';
    if (!isClientNav) safeRemove(FILTER_KEY);

    if (saved) {
      this.input.value = saved;
      // 'restore' — do NOT auto-open matching groups. The persisted intent
      // (already pre-applied to <details> by `astro:before-swap`) is the
      // source of truth, so a group the user collapsed while filtering
      // stays collapsed after navigation.
      this.applyFilter(saved, 'restore');
    } else {
      this.syncClearButton('');
    }

    this.restoreScroll(isClientNav);
  }

  private restoreScroll(isClientNav: boolean): void {
    const sc = this.scrollEl;
    if (!sc) return;
    requestAnimationFrame(() => {
      if (isClientNav) {
        sc.scrollTop = parseInt(safeGet(SCROLL_KEY) || '0', 10) || 0;
      } else {
        this.scrollActiveIntoView(sc);
      }
      sc.style.visibility = '';
    });
  }

  private scrollActiveIntoView(sc: HTMLElement): void {
    const active = this.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!active) return;
    const linkRect = active.getBoundingClientRect();
    const cRect    = sc.getBoundingClientRect();
    if (linkRect.top < cRect.top) {
      sc.scrollTop += linkRect.top - cRect.top;
    } else if (linkRect.bottom > cRect.bottom) {
      sc.scrollTop += linkRect.bottom - cRect.bottom;
    }
  }

  // ── Filter (attribute-driven) ───────────────────────────────────────────

  /**
   * Apply (or clear) the filter.
   *
   * `source` distinguishes two call sites:
   *   • 'user'    — typed in the input. Auto-opens matching groups so the
   *                user immediately sees results.
   *   • 'restore' — re-applied from sessionStorage after navigation. Trusts
   *                the persisted user intent (already on <details>) and
   *                does NOT auto-open. This is what makes "collapse a group
   *                while filtering, navigate, group stays collapsed" work.
   */
  private applyFilter(rawQuery: string, source: 'user' | 'restore'): void {
    const trimmed = rawQuery.trim();
    this.syncClearButton(trimmed);

    if (!trimmed) {
      this.exitFilterMode();
      return;
    }

    // First entry into filter mode on this page — capture two snapshots:
    //   preFilterSnapshot: in-memory only, restored on Esc/clear.
    //   openSnapshot:      live user intent, mutated by toggles, persisted.
    if (!this.openSnapshot) {
      const current = new Set(collectOpenKeys(this));
      this.openSnapshot = current;
      // 'user' filter on this page → remember the pre-filter baseline so Esc
      // restores it. 'restore' inherits intent from a previous page; there
      // is no meaningful "pre-filter" baseline to restore on this page.
      this.preFilterSnapshot = source === 'user' ? new Set(current) : null;
      this.syncSnapshotAttr();
    }

    const matches = this.computeMatches(tokenize(trimmed));
    this.markMatches(matches);
    this.dataset.filtering = 'true';

    if (source === 'user') {
      // Add matching group keys to the user-intent set so they expand.
      for (const d of this.details) {
        const li = d.parentElement as HTMLLIElement;
        const key = d.dataset.groupKey;
        if (key && matches.has(li)) this.openSnapshot.add(key);
      }
      this.syncSnapshotAttr();
      safeSet(DETAILS_KEY, [...this.openSnapshot].join('\n'));
    }

    this.applyIntentToView();
    this.updateStatus(matches.size > 0 ? null : 'no-match');
  }

  /** Set every <details>.open from `openSnapshot`. Active-page ancestors stay open. */
  private applyIntentToView(): void {
    const intent = this.openSnapshot;
    if (!intent) return;
    this.withSuppressedToggle(() => {
      for (const d of this.details) {
        if (d.querySelector('a[aria-current="page"]')) { d.open = true; continue; }
        const key = d.dataset.groupKey;
        d.open = !!key && intent.has(key);
      }
    });
  }

  private exitFilterMode(): void {
    delete this.dataset.filtering;
    for (const li of this.items) delete li.dataset.filterMatch;

    // Restore the pre-filter baseline if we have one (user cleared on the
    // same page they started filtering). Otherwise keep current intent.
    const restore = this.preFilterSnapshot ?? this.openSnapshot;
    if (restore) {
      this.withSuppressedToggle(() => applyOpenState(this, restore));
      safeSet(DETAILS_KEY, [...restore].join('\n'));
    }
    this.openSnapshot = null;
    this.preFilterSnapshot = null;
    this.syncSnapshotAttr();
    this.ensureActiveAncestorsOpen();
    this.updateStatus(null);
  }

  private withSuppressedToggle(fn: () => void): void {
    this.suppressToggle = true;
    try { fn(); } finally {
      // `toggle` is async — release after the next microtask flushes.
      queueMicrotask(() => { this.suppressToggle = false; });
    }
  }

  /**
   * Visible set = items whose path contains every token, plus their <li>
   * ancestors, plus all descendants of any matched group.
   */
  private computeMatches(tokens: string[]): Set<HTMLLIElement> {
    const visible = new Set<HTMLLIElement>();
    for (const li of this.items) {
      if (!tokens.every((t) => itemPath(li).includes(t))) continue;
      visible.add(li);
      this.collectAncestors(li, visible);
      this.collectGroupDescendants(li, visible);
    }
    return visible;
  }

  private collectAncestors(li: HTMLLIElement, out: Set<HTMLLIElement>): void {
    let node: Element | null = li.parentElement;
    while (node && node !== this) {
      if (node instanceof HTMLLIElement) out.add(node);
      node = node.parentElement;
    }
  }

  private collectGroupDescendants(li: HTMLLIElement, out: Set<HTMLLIElement>): void {
    if (!li.querySelector(':scope > details')) return;
    li.querySelectorAll<HTMLLIElement>(ITEMS_SELECTOR).forEach((d) => out.add(d));
  }

  private markMatches(matches: Set<HTMLLIElement>): void {
    for (const li of this.items) {
      if (matches.has(li)) li.dataset.filterMatch = 'true';
      else delete li.dataset.filterMatch;
    }
  }

  private resetFilter(): void {
    this.input.value = '';
    safeRemove(FILTER_KEY);
    this.exitFilterMode();
  }

  private ensureActiveAncestorsOpen(): void {
    const active = this.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!active) return;
    let node: Element | null = active.parentElement;
    while (node && node !== this) {
      if (node instanceof HTMLDetailsElement) node.open = true;
      node = node.parentElement;
    }
  }

  // ── UI sync ─────────────────────────────────────────────────────────────

  private updateStatus(state: 'no-match' | null): void {
    this.status.textContent =
      state === 'no-match' ? (this.dataset.noResults ?? 'No topics match') : '';
  }

  private syncClearButton(value: string): void {
    this.clearBtn.hidden = value.length === 0;
  }
}

if (!customElements.get('sidebar-filter')) {
  customElements.define('sidebar-filter', SidebarFilter);
}

/**
 * <sidebar-filter> custom element.
 *
 * Owns the filter input + persistence behavior for the docs sidebar.
 *
 * Architectural rules:
 *   • State lives in attributes / sessionStorage. Visual updates are
 *     CSS-driven via:
 *         [data-filtering] — set on root while a non-empty query is active
 *         [data-filter-match]  — set on every <li> that should remain visible
 *     CSS hides items lacking `data-filter-match` while the host has
 *     `data-filtering`. We never toggle `.hidden`, classes, or inline styles
 *     for filtering visibility.
 *   • `<details open>` is the single source of truth for expand/collapse.
 *     The persisted set of open `data-group-key` values is applied to the
 *     *incoming* document in `astro:before-swap` so the first paint after
 *     navigation already shows the correct state — no flicker.
 *   • The script is a real ES module — evaluated once per hard load and kept
 *     alive across client-side navigations, so listeners are not duplicated.
 *
 * Persistence keys (sessionStorage):
 *   sidebar-filter-value   → current filter input value
 *   sidebar-details-states → newline-joined list of open group keys
 *   sidebar-scroll-top     → scrollTop of the items scroll container
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
  safeSet(DETAILS_KEY, collectOpenKeys(document).join('\n'));
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
  /** Snapshot of open group keys before filtering started; restored on clear. */
  private openSnapshot: Set<string> | null = null;

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
    this.applyFilter(this.input.value);
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
    if (!(e.target instanceof HTMLDetailsElement) || !e.target.dataset.groupKey) return;
    safeSet(DETAILS_KEY, collectOpenKeys(this).join('\n'));
  };

  // ── Restore on connect / after navigation ───────────────────────────────

  private restoreOnConnect(): void {
    const isClientNav = _isClientSideNav;
    _isClientSideNav = false;

    const saved = isClientNav ? safeGet(FILTER_KEY) : '';
    if (!isClientNav) safeRemove(FILTER_KEY);

    if (saved) {
      this.input.value = saved;
      this.applyFilter(saved);
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

  private applyFilter(rawQuery: string): void {
    const trimmed = rawQuery.trim();
    this.syncClearButton(trimmed);

    if (!trimmed) {
      this.exitFilterMode();
      return;
    }

    if (!this.openSnapshot) {
      this.openSnapshot = new Set(collectOpenKeys(this));
    }

    const matches = this.computeMatches(tokenize(trimmed));
    this.markMatches(matches);
    this.dataset.filtering = 'true';
    this.openMatchingGroups(matches);
    this.updateStatus(matches.size > 0 ? null : 'no-match');
  }

  private exitFilterMode(): void {
    delete this.dataset.filtering;
    for (const li of this.items) delete li.dataset.filterMatch;
    if (this.openSnapshot) {
      applyOpenState(this, this.openSnapshot);
      this.openSnapshot = null;
    }
    this.ensureActiveAncestorsOpen();
    this.updateStatus(null);
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

  private openMatchingGroups(matches: Set<HTMLLIElement>): void {
    for (const d of this.details) {
      d.open = matches.has(d.parentElement as HTMLLIElement);
    }
  }

  private resetFilter(): void {
    this.input.value = '';
    safeRemove(FILTER_KEY);
    this.applyFilter('');
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

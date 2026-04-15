/**
 * <sidebar-filter> web component.
 *
 * Wraps the Starlight sidebar and provides a real-time text filter with
 * hierarchical path search.
 *
 * Matching rules:
 *   - Each item is matched against its FULL PATH — the concatenation of all
 *     ancestor group labels + the item's own label (e.g. "SERVICES Transaction Service").
 *   - The query is split into whitespace-separated tokens; ALL tokens must appear
 *     (as substrings) in the full path. This enables cross-level queries like
 *     "Service Transaction Service" matching "SERVICES > Transaction Service".
 *   - A matched link reveals itself + all ancestor <li> + opens ancestor <details>.
 *   - A matched group reveals itself + ALL descendant <li> + opens its <details> + ancestors.
 *   - Clearing restores all items and the original <details> open state.
 *
 * Details state management:
 *   - On first keystroke, snapshot the open/closed state of all <details> in the sidebar.
 *   - During filtering, programmatically open/close <details> to expose matches.
 *   - On clear, restore from the snapshot (safe: SidebarPersister has already restored
 *     its own state by this point, so the snapshot reflects the persisted state).
 */
const STORAGE_KEY = 'sidebar-filter-value';

// True only when Astro's ClientRouter is mid-navigation. Stays false on full
// page loads (address bar, reload, new tab) because astro:before-preparation
// never fires in those cases — the module is freshly evaluated each time.
let _isClientSideNav = false;
let _savedScrollTop = 0;
document.addEventListener('astro:before-preparation', () => {
  _isClientSideNav = true;
  const sc = document.querySelector<HTMLElement>('.sidebar-scroll');
  if (sc) _savedScrollTop = sc.scrollTop;
});

class SidebarFilter extends HTMLElement {
  private input!: HTMLInputElement;
  private clearBtn!: HTMLButtonElement;
  private status!: HTMLElement;
  private allItems!: HTMLLIElement[];
  private allDetails!: HTMLDetailsElement[];
  private detailsSnapshot: boolean[] = [];
  private snapshotTaken = false;

  connectedCallback(): void {
    this.input    = this.querySelector<HTMLInputElement>('[data-sidebar-filter-input]')!;
    this.clearBtn = this.querySelector<HTMLButtonElement>('[data-sidebar-filter-clear]')!;
    this.status   = this.querySelector<HTMLElement>('[data-sidebar-filter-status]')!;

    // Snapshot lists at connect-time. The sidebar is static (SSR-rendered).
    this.allItems   = [...this.querySelectorAll<HTMLLIElement>('li')];
    this.allDetails = [...this.querySelectorAll<HTMLDetailsElement>('details')];

    this.input.addEventListener('input', () => {
      sessionStorage.setItem(STORAGE_KEY, this.input.value);
      this.filter(this.input.value);
    });

    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      sessionStorage.removeItem(STORAGE_KEY);
      this.input.focus();
      this.filter('');
    });

    this.input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.input.value = '';
        sessionStorage.removeItem(STORAGE_KEY);
        this.filter('');
      }
    });

    // Restore the filter only after a client-side navigation.
    // On a full page load (address bar, new tab, reload) the flag is false
    // because astro:before-preparation never fired — clear any stale value.
    const isClientNav = _isClientSideNav;
    _isClientSideNav = false;

    const saved = isClientNav ? (sessionStorage.getItem(STORAGE_KEY) ?? '') : '';
    if (!isClientNav) sessionStorage.removeItem(STORAGE_KEY);

    // Hide the scroll container before adjusting scroll position so the
    // browser never renders the sidebar at position 0 before the correction.
    const scrollContainer = this.querySelector<HTMLElement>('.sidebar-scroll');
    if (scrollContainer) scrollContainer.style.visibility = 'hidden';

    if (saved) {
      this.input.value = saved;
      this.filter(saved);
    } else {
      this.syncClearButton('');
    }

    if (isClientNav && scrollContainer) {
      scrollContainer.scrollTop = _savedScrollTop;
    }

    // Restore visibility after the scroll is committed.
    requestAnimationFrame(() => {
      this.scrollToActivePage();
      if (scrollContainer) scrollContainer.style.visibility = '';
    });
  }

  private filter(rawQuery: string): void {
    const trimmed = rawQuery.trim();
    const query = trimmed.toLowerCase();
    this.syncClearButton(trimmed);

    // Take a one-time snapshot of <details> open state before first filter.
    if (!this.snapshotTaken && query) {
      this.detailsSnapshot = this.allDetails.map((d) => d.open);
      this.snapshotTaken = true;
    }

    if (!query) {
      this.showAll();
      this.restoreDetailsState();
      this.ensureActivePageVisible();
      this.snapshotTaken = false;
      this.updateStatus(null);
      //requestAnimationFrame(() => this.scrollToActivePage());
      return;
    }

    // Phase 1: hide all items.
    for (const item of this.allItems) item.hidden = true;

    // Split query into tokens — all must appear in the item's full hierarchical path.
    const tokens = query.split(/\s+/).filter(Boolean);

    // Phase 2: find direct text matches and accumulate items to reveal.
    const toShow = new Set<HTMLLIElement>();
    let matchCount = 0;

    for (const item of this.allItems) {
      const fullPath = this.getItemFullPath(item);
      if (!tokens.every((t) => fullPath.includes(t))) continue;

      matchCount++;
      toShow.add(item);

      // Reveal all ancestor <li> elements.
      this.getAncestorItems(item).forEach((a) => toShow.add(a));

      // If the matched item is a group, also reveal all its descendants.
      if (item.querySelector(':scope > details')) {
        item.querySelectorAll<HTMLLIElement>('li').forEach((d) => toShow.add(d));
      }
    }

    // Phase 3: apply visibility.
    for (const item of this.allItems) item.hidden = !toShow.has(item);

    // Phase 4: sync <details> open state — open those with visible children, close others.
    for (const details of this.allDetails) {
      details.open = toShow.has(details.parentElement as HTMLLIElement);
    }

    this.updateStatus(matchCount);
  }

  /**
   * Get the own label text of a sidebar <li> (link label or group heading).
   * Does NOT include ancestor labels — use getItemFullPath() for hierarchical matching.
   */
  private getItemOwnText(item: HTMLLIElement): string {
    // Link item: <li> > <a> > <span>text</span>
    const linkSpan = item.querySelector(':scope > a > span:first-child');
    if (linkSpan) return linkSpan.textContent?.trim() ?? '';

    // Group item: <li> > <details> > <summary> > <span class="group-label"> > <span class="large">text</span>
    const groupSpan = item.querySelector(':scope > details > summary .group-label > .large');
    if (groupSpan) return groupSpan.textContent?.trim() ?? '';

    return '';
  }

  /**
   * Build the full hierarchical path for an item by concatenating ancestor group
   * labels with the item's own label, e.g. "SERVICES Transaction Service".
   * Returned lowercase for case-insensitive matching.
   */
  private getItemFullPath(item: HTMLLIElement): string {
    const parts: string[] = [];

    // Collect ancestor group labels (outermost first).
    let node: Element | null = item.parentElement;
    while (node && node !== this) {
      if (node instanceof HTMLLIElement) {
        const groupSpan = node.querySelector(':scope > details > summary .group-label > .large');
        if (groupSpan) parts.unshift(groupSpan.textContent?.trim() ?? '');
      }
      node = node.parentElement;
    }

    // Append own label.
    const own = this.getItemOwnText(item);
    if (own) parts.push(own);

    return parts.join(' ').toLowerCase();
  }

  /** Walk up the DOM collecting ancestor <li> elements within this component. */
  private getAncestorItems(item: HTMLLIElement): HTMLLIElement[] {
    const ancestors: HTMLLIElement[] = [];
    let node: Element | null = item.parentElement;
    while (node && node !== this) {
      if (node instanceof HTMLLIElement) ancestors.push(node);
      node = node.parentElement;
    }
    return ancestors;
  }

  private showAll(): void {
    for (const item of this.allItems) item.hidden = false;
  }

  private restoreDetailsState(): void {
    if (!this.snapshotTaken) return;
    this.allDetails.forEach((d, i) => { d.open = this.detailsSnapshot[i] ?? d.open; });
  }

  /**
   * Scroll the sidebar list container so the active page link is visible.
   * Uses scrollIntoView with block:"nearest" to avoid unnecessary scrolling
   * when the link is already in view.
   */
  private scrollToActivePage(): void {
    const activeLink = this.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!activeLink) return;
    if (activeLink.closest('li[hidden]')) return;
    const scrollContainer = this.querySelector<HTMLElement>('.sidebar-scroll');
    if (!scrollContainer) {
      activeLink.scrollIntoView({ block: 'nearest' });
      return;
    }
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const completelyAbove = linkRect.bottom <= containerRect.top;
    const completelyBelow = linkRect.top    >= containerRect.bottom;
    if (completelyAbove || completelyBelow) {
      const linkMid      = linkRect.top + linkRect.height / 2;
      const containerMid = containerRect.top + scrollContainer.clientHeight / 2;
      // Suppress any inherited smooth-scroll so the correction is instant.
      const prev = scrollContainer.style.scrollBehavior;
      scrollContainer.style.scrollBehavior = 'auto';
      scrollContainer.scrollTop += linkMid - containerMid;
      scrollContainer.style.scrollBehavior = prev;
    }
  }

  /**
   * After clearing the filter, ensure the currently active page's ancestor
   * <details> elements are all open so the active link is always visible.
   * This handles the case where the snapshot captured a collapsed state for
   * the group containing the active page.
   */
  private ensureActivePageVisible(): void {
    const activeLink = this.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!activeLink) return;
    let node: Element | null = activeLink.parentElement;
    while (node && node !== this) {
      if (node instanceof HTMLDetailsElement) node.open = true;
      node = node.parentElement;
    }
  }

  private updateStatus(matchCount: number | null): void {
    if (!this.status) return;
    if (matchCount === null || matchCount > 0) {
      this.status.textContent = '';
    } else {
      this.status.textContent = this.dataset.noResults ?? 'No topics match';
    }
  }

  private syncClearButton(value: string): void {
    if (this.clearBtn) this.clearBtn.hidden = value.length === 0;
  }
}

if (!customElements.get('sidebar-filter')) {
  customElements.define('sidebar-filter', SidebarFilter);
}

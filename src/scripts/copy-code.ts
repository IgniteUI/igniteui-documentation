/**
 * Code-block copy button
 *
 * Injects a copy-to-clipboard button into every `<pre class="astro-code">` block.
 * Uses the `copy` / `check` icons from the docs icon registry.
 *
 * Re-runs on View-Transition navigations via the `astro:page-load` event.
 */

function initCopyButtons(): void {
  document.querySelectorAll<HTMLPreElement>('pre.astro-code').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return; // already injected

    // Ensure pre is the positioning anchor for the absolutely-placed button.
    pre.style.position = 'relative';

    const btn = document.createElement('igc-icon-button') as HTMLElement;
    btn.setAttribute('variant', 'flat');
    btn.setAttribute('aria-label', 'Copy code');
    btn.className = 'copy-btn';
    btn.style.position = 'absolute';
    btn.style.top = '0.5rem';
    btn.style.right = '0.5rem';
    btn.style.opacity = '0';
    btn.style.transition = 'opacity 0.15s ease';

    const icon = document.createElement('igc-icon');
    icon.setAttribute('name', 'copy');
    icon.setAttribute('collection', 'docs');
    btn.appendChild(icon);

    // Show on hover / focus
    pre.addEventListener('mouseenter', () => { btn.style.opacity = '1'; });
    pre.addEventListener('mouseleave', () => { if (!btn.matches(':focus-within')) btn.style.opacity = '0'; });
    btn.addEventListener('focus', () => { btn.style.opacity = '1'; });
    btn.addEventListener('blur', () => { btn.style.opacity = '0'; });

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      const text = code ? code.textContent ?? '' : pre.textContent ?? '';
      navigator.clipboard.writeText(text).then(() => {
        icon.setAttribute('name', 'check');
        btn.setAttribute('aria-label', 'Copied!');
        setTimeout(() => {
          icon.setAttribute('name', 'copy');
          btn.setAttribute('aria-label', 'Copy code');
        }, 1500);
      });
    });

    pre.appendChild(btn);
  });
}

// Run immediately (module may load after astro:page-load has fired)
// and on subsequent View-Transition navigations.
initCopyButtons();
document.addEventListener('astro:page-load', initCopyButtons);

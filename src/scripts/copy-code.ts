/**
 * Code-block copy button
 *
 * Injects a copy-to-clipboard button into every `<pre class="astro-code">` block.
 * Uses the `copy` / `check` icons from the docs icon registry.
 *
 * Re-runs on View-Transition navigations via the `astro:page-load` event.
 */

const COPY_BUTTON_STYLE_ID = 'copy-code-button-styles';

function ensureCopyButtonStyles(): void {
  if (document.getElementById(COPY_BUTTON_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = COPY_BUTTON_STYLE_ID;
  style.textContent = `
    pre.astro-code.copy-code-host {
      position: relative;
    }

    pre.astro-code.copy-code-host > .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    pre.astro-code.copy-code-host:hover > .copy-btn,
    pre.astro-code.copy-code-host:focus-within > .copy-btn {
      opacity: 1;
    }
  `;

  document.head.appendChild(style);
}

function initCopyButtons(): void {
  ensureCopyButtonStyles();

  document.querySelectorAll<HTMLPreElement>('pre.astro-code').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return; // already injected

    pre.classList.add('copy-code-host');

    const btn = document.createElement('igc-icon-button') as HTMLElement;
    btn.setAttribute('variant', 'flat');
    btn.setAttribute('aria-label', 'Copy code');
    btn.className = 'copy-btn';

    const icon = document.createElement('igc-icon');
    icon.setAttribute('name', 'copy');
    icon.setAttribute('collection', 'docs');
    btn.appendChild(icon);

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      const text = code ? code.textContent ?? '' : pre.textContent ?? '';

      const resetButtonState = () => {
        icon.setAttribute('name', 'copy');
        btn.setAttribute('aria-label', 'Copy code');
      };

      const showCopiedState = () => {
        icon.setAttribute('name', 'check');
        btn.setAttribute('aria-label', 'Copied!');
        setTimeout(resetButtonState, 1500);
      };

      const showCopyFailedState = () => {
        btn.setAttribute('aria-label', 'Copy failed');
        setTimeout(resetButtonState, 1500);
      };

      const fallbackCopyText = (value: string): boolean => {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);

        try {
          return document.execCommand('copy');
        } catch {
          return false;
        } finally {
          document.body.removeChild(textArea);
        }
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => {
            showCopiedState();
          })
          .catch(() => {
            if (fallbackCopyText(text)) {
              showCopiedState();
            } else {
              showCopyFailedState();
            }
          });
        return;
      }

      if (fallbackCopyText(text)) {
        showCopiedState();
      } else {
        showCopyFailedState();
      }
    });

    pre.appendChild(btn);
  });
}

// Run immediately (module may load after astro:page-load has fired)
// and on subsequent View-Transition navigations.
initCopyButtons();
document.addEventListener('astro:page-load', initCopyButtons);

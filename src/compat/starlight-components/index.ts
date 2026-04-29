/**
 * Compatibility shim for @astrojs/starlight/components.
 *
 * Re-routed via Vite alias in siteMetaIntegration so MDX files that import
 * from '@astrojs/starlight/components' continue to work after removing the
 * Starlight integration.  Replace individual exports with richer implementations
 * as needed.
 */
export { default as Aside      } from './Aside.astro';
export { default as Tabs       } from './Tabs.astro';
export { default as TabItem    } from './TabItem.astro';
export { default as Badge      } from './Badge.astro';
export { default as Card       } from './Card.astro';
export { default as CardGrid   } from './CardGrid.astro';
export { default as Steps      } from './Steps.astro';
// Passthrough stubs for less-common components
export { default as Icon       } from './Aside.astro'; // placeholder — render nothing meaningful
export { default as LinkCard   } from './Card.astro';  // close enough for layout
export { default as FileTree   } from './Aside.astro'; // placeholder

// ---------------------------------------------------------------------------
// Root astro.config.ts — NOT used for production builds.
//
// The actual docs sites are built via:
//   docs/angular/astro.config.ts   → Angular docs
//   docs/xplat/astro.config.ts     → React / Blazor / Web Components docs
//
// Both call createDocsSite() from src/integration.ts which assembles the
// full Astro configuration (plugins, sidebar, head entries, etc.).
//
// This file exists only so Astro tooling (language server, CLI) has a
// valid config when opened from the repo root.
// ---------------------------------------------------------------------------

import { defineConfig } from 'astro/config';

export default defineConfig({});

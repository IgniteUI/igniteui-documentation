// Project config: Ignite UI for Angular docs (docs/angular) of THIS repository.
// Not part of the upstream engine - see ../PROVENANCE.md. Everything shared with
// the xplat tree lives in docs-shared.mjs; the brand list, prompt context and
// attribute list below are carried over unchanged from the engine's
// configs/docs-template-angular.config.mjs.
//
// Generated pages are excluded automatically (docs-shared.mjs asks git for the
// ignored files): the xplat topics synced into this tree and the grid pages
// expanded from grids_templates/ are translated at their sources instead.
//
//   npx tsx src/cli.ts status --config configs/docs-angular.config.mjs
import docsConfig from './docs-shared.mjs';

/** @type {import('../src/types.ts').ProjectConfig} */
export default docsConfig('angular', {
  doNotTranslate: [
    'Ignite UI for Angular',
    'Ignite UI',
    'Infragistics',
    'Angular',
    'React',
    'Web Components',
    'Blazor',
    'TypeScript',
    'JavaScript',
    'SCSS',
    'CSS',
    'App Builder',
    'Indigo.Design',
    'API',
    'UI',
    'UX',
    'CLI',
    'MCP',
    'SDK',
    'npm',
    'DOM',
    'ARIA',
    'JSON',
    'Agent Skills',
    'Chrome',
  ],

  promptContext:
    'the Ignite UI for Angular documentation — how-to guides and API reference ' +
    'read by professional developers building applications with the component library',

  translatableAttributes: {
    CtaArea: ['title', 'description', 'label', 'note'],
    Sample: ['alt'],
    Image: ['alt'],
    FaqItem: ['question'],
    Anatomy: ['name', 'description', 'alt'],
  },

  frontmatterStyle: {
    forceQuoteFields: ['canonicalLink', 'last_updated'],
    forceFlowFields: ['mentionedTypes'],
  },
});

// Project config: cross-platform docs (docs/xplat: React, Web Components,
// Blazor) of THIS repository. Not part of the upstream engine - see
// ../PROVENANCE.md. Everything shared with the Angular tree (root, locales,
// providers, data dir, masking, glossary, style guide) lives in docs-shared.mjs;
// the brand list, prompt context and attribute list below are carried over
// unchanged from the engine's configs/docs-template-xplat.config.mjs.
//
//   npx tsx src/cli.ts status --config configs/docs-xplat.config.mjs
import docsConfig from './docs-shared.mjs';

/** @type {import('../src/types.ts').ProjectConfig} */
export default docsConfig('xplat', {
  doNotTranslate: [
    'Ignite UI for React',
    'Ignite UI for Web Components',
    'Ignite UI for Blazor',
    'Ignite UI',
    'Infragistics',
    'React',
    'Web Components',
    'Blazor',
    'Angular',
    'TypeScript',
    'JavaScript',
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
    'Agent Skills', // named product feature, not a generic phrase
    'Chrome', // browser brand - was transliterated (ja "クローム") before it was listed
  ],

  promptContext:
    'the Ignite UI documentation for React, Web Components, and Blazor — how-to ' +
    'guides and API reference read by professional developers building applications ' +
    'with the component libraries',

  // Components whose user-facing text lives in ATTRIBUTES, not children - a
  // childless tag has nothing else for the model to see.
  translatableAttributes: {
    CtaArea: ['title', 'description', 'label', 'note'],
    Feature: ['title'],
    Sample: ['alt'],
    Image: ['alt'],
    FaqItem: ['question'],
    Anatomy: ['name', 'description', 'alt'],
  },

  // docfx-authored quoting convention: canonicalLink/last_updated stay quoted,
  // mentionedTypes/sharedComponents stay one-line flow arrays.
  frontmatterStyle: {
    forceQuoteFields: ['canonicalLink', 'last_updated'],
    forceFlowFields: ['mentionedTypes', 'sharedComponents'],
  },
});

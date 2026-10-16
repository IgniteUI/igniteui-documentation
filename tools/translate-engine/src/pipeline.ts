// Barrel for the pipeline. The implementation is split across src/pipeline/*
// (protect · preprocess · frontmatter-walk · translate-text · body ·
// component-block · index); this file re-exports the stable public surface so
// existing `import … from './pipeline.js'` sites keep working unchanged.

export { translateMarkdownFile } from './pipeline/index.js';
export type { PipelineOptions } from './pipeline/options.js';
export {
  extractProtectedBlocks,
  protectFencedPlaceholderBlocks,
  restoreProtectedBlocks,
} from './pipeline/protect.js';

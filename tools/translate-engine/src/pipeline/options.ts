import type { FrontmatterStyle } from '../frontmatter.js';
import type { BodyMode, FieldContract, TranslationMemory } from '../types.js';

// Options for translateMarkdownFile. Lives in its own module so both the entry
// point (index.ts) and component-block.ts can import the type without a cycle.

export interface PipelineOptions {
  contract: FieldContract;
  /** Extra regex sources protected byte-for-byte (applied with the MDX pass). */
  protectPatterns?: string[];
  /** Named attribute values to translate for childless/self-closing
   *  components (e.g. { CtaArea: ['title', 'description'] }) - see the
   *  ProjectConfig field of the same name for the full rationale. */
  translatableAttributes?: Record<string, string[]>;
  bodyMode?: BodyMode;
  skipBodyWhen?: (frontmatter: Record<string, unknown>) => boolean;
  mem?: TranslationMemory;
  /** YAML formatting for the rewritten frontmatter (line-folding, quote style). */
  frontmatterStyle?: FrontmatterStyle;
}

import { translateMarkdownFile } from '../src/pipeline.js';
import type { FieldContract, Translator } from '../src/types.js';

// Shared fixtures + mock translators for the pipeline/validator suites. The
// tests run the REAL pipeline against a deterministic translator, so every
// assertion is a structural contract, not a model-quality guess.

// Uppercase every letter OUTSIDE tags and placeholder tokens — a visible,
// reversible "translation" that must never touch protected content.
export function mockTranslate(text: string): string {
  // keep __TOKENS__ and <tags> intact, uppercase everything else
  return text.replace(/__[A-Z]+_?\d+__|<[^>]+>|[^<_]+|_/g, (seg) => {
    if (seg.startsWith('__') || seg.startsWith('<')) return seg;
    return seg.toUpperCase();
  });
}

/** The token/tag-aware uppercasing translator the whole suite runs against. */
export const mock: Translator = {
  one: async (t) => mockTranslate(t),
  many: async (ts) => ts.map(mockTranslate),
};

/** A no-op translator — for round-trip/formatting assertions that must hold
 *  even when the "translation" changes nothing (isolates structural drift). */
export const identity: Translator = {
  one: async (t) => t,
  many: async (ts) => ts,
};

/** A plain uppercasing translator (no token/tag awareness) — used by the
 *  ComponentBlock-templated tests, which assert on frontmatter casing only. */
export const upper: Translator = {
  one: async (t) => t.toUpperCase(),
  many: async (ts) => ts.map((t) => t.toUpperCase()),
};

export const docsContract: FieldContract = {
  translatable: new Set(['title', 'description', 'keywords']),
  preserve: new Set(),
  assets: new Set(),
  enumKeys: new Set(),
};

export const marketingContract: FieldContract = {
  translatable: new Set(['title', 'headline', 'bullets', 'category']),
  preserve: new Set(['name']),
  assets: new Set(['image']),
  enumKeys: new Set(['category']),
};

export const DOCS_FIXTURE = `---
title: "Angular Grid Overview"
description: "The Ignite UI for Angular grid."
keywords: "Angular, grid, Infragistics"
license: MIT
_canonicalLink: "{environment:dvUrl}/components/grid"
mentionedTypes: ["IgxGridComponent"]
llms:
  description: "Grid component summary."
---

# Angular Grid

The grid displays data. See <ApiLink type="IgxGridComponent" member="filter" /> for filtering.

<DocsAside type="note">
This note should be translated by the model.
</DocsAside>

<Sample src="{environment:demosBaseUrl}/grid/sample" height={600} />

Inline code stays: \`igx-grid\`, and a [link](../data-grid) too.

\`\`\`typescript
// code must survive byte-for-byte
const grid: IgxGridComponent = new IgxGridComponent();
\`\`\`

| Column | Type |
| ------ | ---- |
| name   | text |
`;

export const MARKETING_FIXTURE = `---
title: "Product page"
name: "Jane Doe"
image: "/img/hero.png"
sections:
  - headline: "Why choose us"
    category: "big-data"
    bullets:
      - "Fast to embed"
      - "Loved by devs"
---

Body stays verbatim on sectioned pages. <script>alert(1)</script>
`;

export const LIST_FENCE_FIXTURE = `---
title: "CLI MCP config"
---

Steps:

1. First step, plain prose.
2. Configure the server:

    \`\`\`json
    {
      "mcpServers": {
        "example": { "command": "npx" }
      }
    }
    \`\`\`

3. Third step, plain prose.
`;

/** Translate DOCS_FIXTURE with the standard docs options — the shared
 *  end-to-end output several suites assert against (computed once per suite in
 *  a `beforeAll`). */
export function translateDocs(): Promise<string> {
  return translateMarkdownFile(DOCS_FIXTURE, mock, {
    contract: docsContract,
    protectPatterns: ['\\{environment:[^}]+\\}'],
  });
}

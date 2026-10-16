import yaml from 'js-yaml';

// Custom frontmatter serializer. gray-matter's bundled YAML engine (js-yaml
// v3, wired in as its default 'yaml' engine) folds any string longer than 80
// chars into a block scalar (`key: >-` + wrapped continuation lines) - which
// rewrites content that was a single line in the English source into a
// multi-line block in every translated file, a needless diff/format drift.
//
// We call js-yaml v4 directly instead of going through gray-matter's engine,
// so we can disable folding (lineWidth) and control the quote style
// (quotingType) - and optionally force specific keys to always be quoted,
// to match a source convention gray-matter/js-yaml can't infer on their own
// (e.g. the docfx sync quotes `canonicalLink`/`last_updated` but not `title`).

export interface FrontmatterStyle {
  /** 1 disables line-folding entirely (default). Set a number to re-enable
   *  wrapping at that width. */
  lineWidth?: number;
  /** Quote character js-yaml uses when a value REQUIRES quoting (ambiguous
   *  type, special characters). Does not force-quote unambiguous values. */
  quotingType?: '"' | "'";
  /** Top-level frontmatter keys that must always be double-quoted, even when
   *  js-yaml would consider the plain form unambiguous (e.g. a bare path like
   *  `/components/grid` never NEEDS quotes, but the source file always
   *  quotes it) - applied as a post-processing pass. */
  forceQuoteFields?: string[];
  /** Top-level array fields that must stay single-line flow style
   *  (`key: ["A", "B"]`), even though js-yaml's default dump renders any
   *  array as a multi-line block sequence. Use this for locked/non-translatable
   *  array fields (e.g. `mentionedTypes`) so translation doesn't introduce
   *  unrelated formatting churn into the PR diff - the field's VALUE never
   *  changes for these fields; only the accidental re-serialization shape did. */
  forceFlowFields?: string[];
}

const DEFAULT_STYLE: Required<Pick<FrontmatterStyle, 'lineWidth' | 'quotingType'>> = {
  lineWidth: -1,
  quotingType: '"',
};

export function stringifyFrontmatter(
  data: Record<string, unknown>,
  style: FrontmatterStyle = {},
): string {
  let dumped = yaml.dump(data, {
    lineWidth: style.lineWidth ?? DEFAULT_STYLE.lineWidth,
    quotingType: style.quotingType ?? DEFAULT_STYLE.quotingType,
    noRefs: true,
  });
  if (style.forceFlowFields?.length) dumped = forceFlowArrayFields(dumped, style.forceFlowFields);
  return style.forceQuoteFields?.length
    ? forceQuoteTopLevel(dumped, style.forceQuoteFields)
    : dumped;
}

// Some docfx-authored source files leave a frontmatter value completely
// unquoted even though it starts with a literal `{Placeholder}` token, e.g.
// `title: {Platform} What's New | {ProductName} | Infragistics`. YAML treats
// a leading `{` as the start of a flow MAPPING, not literal text - js-yaml
// then fails with "can not read a block mapping entry" trying to parse the
// rest of the line as a key. Other pages in the same corpus quote the exact
// same kind of value (`title: "{Platform} Linear Gauge | ..."`) - this is an
// authoring inconsistency in the source, not something a translation run
// should crash on. Quote any such value, in the frontmatter block ONLY -
// before handing the text to gray-matter/js-yaml.
export function quoteUnquotedBraceValues(source: string): string {
  const m = source.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n[\s\S]*)$/);
  if (!m) return source;
  const [, open, fm, rest] = m;
  const fixed = fm
    .split('\n')
    .map((line) => {
      const kv = line.match(/^([A-Za-z0-9_]+):\s(.*)$/);
      if (!kv) return line;
      const [, key, rawVal] = kv;
      const val = rawVal.trim();
      if (!val.startsWith('{') || val.startsWith('"') || val.startsWith("'")) return line;
      const escaped = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `${key}: "${escaped}"`;
    })
    .join('\n');
  return open + fixed + rest;
}

// Rewrites a block sequence under the given top-level keys back into a
// single-line flow sequence: `key:\n  - "A"\n  - "B"` → `key: ["A", "B"]`.
// js-yaml's dump() has no per-key flow-style option (only a global flowLevel
// depth) - this is a targeted post-processing pass, same shape as
// forceQuoteTopLevel below. Only string items are expected (this project's
// only use case, mentionedTypes, is a string array); anything else is left
// as-is rather than guessing at re-serialization.
export function forceFlowArrayFields(yamlText: string, fields: string[]): string {
  const wanted = new Set(fields);
  const lines = yamlText.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z0-9_]+):\s*$/);
    if (m && wanted.has(m[1])) {
      const items: string[] = [];
      let j = i + 1;
      let onlyStrings = true;
      while (j < lines.length && /^\s*-\s/.test(lines[j])) {
        let val = lines[j].replace(/^\s*-\s*/, '');
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith("'") && val.endsWith("'"))
          val = val.slice(1, -1).replace(/''/g, "'");
        else if (/^[[{]/.test(val))
          onlyStrings = false; // nested flow collection - don't touch
        else if (/^[A-Za-z0-9_]+:(\s|$)/.test(val)) onlyStrings = false; // nested block mapping (e.g. "- ComponentApiMembers: null") - don't touch
        items.push(val);
        j++;
      }
      if (items.length && onlyStrings) {
        const flow = items
          .map((v) => `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
          .join(', ');
        out.push(`${m[1]}: [${flow}]`);
        i = j - 1;
        continue;
      }
    }
    out.push(line);
  }
  return out.join('\n');
}

// Rewrites `key: value` lines for the given top-level keys into `key: "value"`
// - only single-line scalar values (our two known use cases, canonicalLink
// and last_updated, are both short strings). Leaves already-quoted, already
// block/flow-collection, and multi-line values untouched.
export function forceQuoteTopLevel(yamlText: string, fields: string[]): string {
  const wanted = new Set(fields);
  return yamlText
    .split('\n')
    .map((line) => {
      const m = line.match(/^([A-Za-z0-9_]+):\s(.*)$/);
      if (!m || !wanted.has(m[1])) return line;
      const key = m[1];
      let val = m[2].trim();
      if (val === '' || val.startsWith('[') || val.startsWith('{')) return line; // flow collection
      if (val.startsWith('"')) return line; // already double-quoted
      if (val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1).replace(/''/g, "'"); // undo YAML single-quote escaping
      }
      const escaped = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `${key}: "${escaped}"`;
    })
    .join('\n');
}

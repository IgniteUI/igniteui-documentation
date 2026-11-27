// @ts-check
/**
 * Custom markdownlint rules for the docs tree. Add a rule by defining it below
 * and appending it to the exported `rules` array.
 *
 * Loaded by markdownlint-cli through `--rules scripts/custom-rules.mjs`. The CLI
 * loads rule files with require(), which for an ES module returns the module
 * namespace rather than the default export, so the array is also exported
 * under Node's special "module.exports" name. Loaders that use import() read
 * the default export.
 */

/** @typedef {import("markdownlint").Rule} Rule */

/** A line that is only an opening, closing or self-closing tag. */
const TAG_LINE = /^\s*<\/?[A-Za-z][\w.:-]*(\s[^>]*)?\/?>\s*$/;
/** A fence opener or closer: three or more backticks or tildes. */
const FENCE = /^\s{0,3}(`{3,}|~{3,})/;

/**
 * IG031 (blanks-around-fences-jsx).
 *
 * markdownlint parses .mdx files as CommonMark. A line that holds only a tag,
 * such as `<PlatformBlock for="React">`, starts a raw HTML block that runs to
 * the next blank line, so a fence directly under it is not seen as a fence and
 * the built-in MD031 cannot report it. This rule scans the raw lines instead
 * and reports a fence that sits directly against a tag-only line:
 *
 *   <PlatformBlock for="React">   <- needs a blank line after it
 *   ```tsx
 *   ...
 *   ```
 *   </PlatformBlock>              <- needs a blank line before it
 *
 * Each error carries fixInfo, so `markdownlint --fix` inserts the blank line.
 *
 * @type {Rule}
 */
const blanksAroundFencesJsx = {
  names: ["IG031", "blanks-around-fences-jsx"],
  description: "Fenced code blocks next to JSX/HTML tags should be surrounded by blank lines",
  tags: ["code", "blank_lines", "mdx"],
  parser: "none",
  function: (params, onError) => {
    const { lines } = params;
    /** @type {string | null} */
    let open = null;

    lines.forEach((line, i) => {
      const match = line.match(FENCE);
      if (!match) return;
      const marker = match[1];

      if (open === null) {
        open = marker;
        if (i > 0 && TAG_LINE.test(lines[i - 1])) {
          onError({
            lineNumber: i + 1,
            detail: "Missing blank line before fence (after tag line)",
            context: line.trim(),
            fixInfo: { insertText: "\n" },
          });
        }
        return;
      }

      // A closer uses the same character, is at least as long, and has no info string.
      const closes = marker[0] === open[0] && marker.length >= open.length && line.trim() === marker;
      if (!closes) return;

      open = null;
      if (i + 1 < lines.length && TAG_LINE.test(lines[i + 1])) {
        onError({
          lineNumber: i + 1,
          detail: "Missing blank line after fence (before tag line)",
          context: line.trim(),
          // Insert at the start of the tag line, i.e. after the closing fence.
          fixInfo: { lineNumber: i + 2, insertText: "\n" },
        });
      }
    });
  },
};

/** @type {Rule[]} */
const rules = [blanksAroundFencesJsx];

export default rules;
export { rules as "module.exports" };

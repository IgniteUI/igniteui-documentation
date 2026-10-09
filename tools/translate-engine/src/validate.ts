import matter from 'gray-matter';
import { quoteUnquotedBraceValues } from './frontmatter.js';
import { anyToken, leftoverToken } from './tokens.js';
import { isSlugLike, isTranslatableField, type FieldContract } from './types.js';

// Translation validator (Layer 1 - deterministic, CI-blocking)
// The pipeline is structurally sound - it lets the model touch only leaf text -
// but a model can still slip *inside* a leaf: echo English back, mutate a value
// it shouldn't, hijack a link, or drop an array element. And a restore step can
// leave a placeholder token behind. validateTranslation compares an EN source
// against one translated file and reports every defect class, split into:
//   • error - broken/corrupt output that must NOT ship
//   • warn  - visibly unfinished but not broken (English leakage)
// runs inline after translation and in the standalone audit CLI.

export type Severity = 'error' | 'warn';

export interface Violation {
  severity: Severity;
  code: ViolationCode;
  message: string;
  field?: string;
}

export type ViolationCode =
  | 'leftover-token' // a __BLOCK_n__/__MDX_n__/__URL_n__ placeholder survived restore
  | 'byte-token' // a literal <0xNN> byte-fallback token leaked into the output
  | 'unparseable' // the translated file no longer parses as frontmatter+body
  | 'shape-mismatch' // a frontmatter field/array element was dropped, added, or retyped
  | 'preserved-modified' // a non-translatable field (url/asset/enum/id/class) was changed
  | 'enum-violation' // a declared enum field holds a value outside its allowed set
  | 'link-mismatch' // the set of link targets differs (hijacked/translated/dropped link)
  | 'tag-mismatch' // the multiset of HTML/JSX tag names differs (invented/dropped tag)
  | 'code-mismatch' // fenced code block count or content differs from source
  | 'import-mismatch' // an MDX import statement was altered, dropped, or invented
  | 'protected-dropped' // a protectPatterns construct ({Platform}…) lost occurrences
  | 'untranslated' // a translatable prose field came back byte-identical to English
  | 'brand-translated' // an UNMASKED doNotTranslate term occurs fewer times than in the source
  | 'brand-token-dropped'; // a MASKED preserveName lost occurrences: the model dropped its placeholder

export interface ValidateSettings {
  contract: FieldContract;
  doNotTranslate: string[];
  /** The project's OWN protectPatterns (not the preserveNames-derived ones —
   *  those are already covered by the brand-translated check). */
  protectPatterns?: string[];
  /** preserveNames that were actually masked, so a lost occurrence can be
   *  attributed to a dropped placeholder rather than a mistranslation. */
  maskedNames?: string[];
}

// Each check pushes its findings through this callback (shared accumulator).
type Add = (severity: Severity, code: ViolationCode, message: string, field?: string) => void;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype
  );
}

export interface Leaf {
  path: string;
  key: string;
  value: string;
}

// Walk frontmatter into an ordered list of string leaves, IDENTICAL in traversal
// order and key attribution to the pipeline's collectNode/applyNode.
export function flatten(obj: Record<string, unknown>, base: string, out: Leaf[]): void {
  for (const [key, value] of Object.entries(obj))
    walkValue(key, value, base ? `${base}.${key}` : key, out);
}

function walkValue(key: string, value: unknown, path: string, out: Leaf[]): void {
  if (typeof value === 'string') {
    out.push({ path, key, value });
  } else if (Array.isArray(value)) {
    value.forEach((el, i) => {
      if (typeof el === 'string') out.push({ path: `${path}[${i}]`, key, value: el });
      else if (isPlainObject(el)) flatten(el, `${path}[${i}]`, out);
    });
  } else if (isPlainObject(value)) {
    flatten(value, path, out);
  }
}

// All link targets in document order, sorted so a reorder doesn't register -
// only an added/dropped/changed target does. Covers HTML href AND markdown
// (link)(url) / images.
function linkTargets(s: string): string[] {
  const out: string[] = [];
  for (const m of s.matchAll(/href\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) out.push(m[1] ?? m[2] ?? '');
  for (const m of s.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s[^)]*)?\)/g)) out.push(m[1]);
  return out.sort();
}

// Multiset of HTML/JSX tag NAMES (open + close counted together, attributes
// ignored). A model that invents <strong class=…>, drops a </p>, or mangles an
// <ApiLink /> changes this multiset.
function tagCounts(s: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const m of s.matchAll(/<\/?\s*([a-zA-Z][\w-]*)/g)) {
    const t = m[1].toLowerCase();
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
}

// Fenced code blocks in order, INCLUDING ones indented inside a list item
// (`[ \t]*` before the optional blockquote marker) - a block that's a child
// of a list must be indented to align with the list item, and a naive
// "fence starts at column 0" regex silently skips those, letting corruption
// specific to indented blocks go undetected. Code must survive byte-for-byte.
function codeFences(s: string): string[] {
  return [
    ...s.matchAll(/^[ \t]*(?:>\s*)?(`{3,})[^\n]*\n([\s\S]*?)\n[ \t]*(?:>\s*)?\1`*\s*$/gm),
  ].map((m) => m[2]);
}

// True when a translatable field came back byte-identical to its source AND the
// source still carries real prose once invariants (placeholder tokens, tags,
// URLs, brand names, AM/PM, non-letters) are stripped. Avoids false positives on
// values that SHOULD be identical: a bare brand, an acronym, a URL, a number.
function looksUntranslated(src: string, trans: string, doNotTranslate: string[]): boolean {
  if (trans.trim() !== src.trim()) return false;
  let r = src;
  r = r.replace(anyToken(), ' ');
  r = r.replace(/<[^>]+>/g, ' ');
  r = r.replace(/https?:\/\/\S+|\/[\w./#?=-]+/g, ' ');
  for (const term of doNotTranslate) {
    if (term) r = r.split(term).join(' ');
  }
  r = r.replace(/\b[ap]\.?\s*m\.?\b/gi, ' ');
  r = r.replace(/[^A-Za-z]/g, ' ');
  return /[A-Za-z]{3,}/.test(r);
}

function diffCounts(src: Map<string, number>, trans: Map<string, number>): string[] {
  const names = new Set([...src.keys(), ...trans.keys()]);
  const lines: string[] = [];
  for (const name of [...names].sort()) {
    const a = src.get(name) ?? 0;
    const b = trans.get(name) ?? 0;
    if (a !== b) lines.push(`${name}: ${a} → ${b}`);
  }
  return lines;
}

// Main - an orchestrator: run the whole-file token scan, parse both
// frontmatters (halting if the translation won't parse), then the shape/value
// and whole-file structural checks. Each numbered check lives in its own
// function below and pushes findings through `add`.
export function validateTranslation(
  enSource: string,
  translated: string,
  settings: ValidateSettings,
): Violation[] {
  const v: Violation[] = [];
  const add: Add = (severity, code, message, field) => v.push({ severity, code, message, field });

  // 1-2. Leftover placeholders / byte-fallback tokens (whole-file scan).
  checkTokens(translated, add);

  // 2. Parse both. A bad TRANSLATION is 'unparseable' and halts the rest (nothing
  // else is reliable); a bad SOURCE is silently ignored (not our fault).
  const parsed = parseFrontmatters(enSource, translated, add);
  if (!parsed) return v;

  // 3-4. Frontmatter structure + per-field value checks.
  checkFrontmatter(parsed.enLeaves, parsed.trLeaves, settings, add);

  // 5-9. Whole-file structural checks (reached only when the file parses).
  checkLinks(enSource, translated, add);
  checkTags(enSource, translated, add);
  checkCode(enSource, translated, add);
  checkImports(enSource, translated, add);
  checkProtectedTokens(enSource, translated, settings.protectPatterns ?? [], add);
  checkBrands(enSource, translated, settings.doNotTranslate, settings.maskedNames ?? [], add);

  return v;
}

// 1-2. Leftover pipeline placeholders / byte-fallback tokens.
function checkTokens(translated: string, add: Add): void {
  const token = translated.match(leftoverToken());
  if (token)
    add(
      'error',
      'leftover-token',
      `Unrestored placeholder token "${token[0]}" - markup restore failed`,
    );
  const byteTok = translated.match(/<0x[0-9A-Fa-f]{2}>/);
  if (byteTok)
    add('error', 'byte-token', `Literal byte-fallback token "${byteTok[0]}" leaked into output`);
}

// 2. Parse both frontmatters into ordered string leaves. Returns null (halting
// all later checks) when either side won't parse: a bad SOURCE is silently
// ignored (not the translation's fault), a bad TRANSLATION is an 'unparseable'
// error after which nothing else is reliable.
function parseFrontmatters(
  enSource: string,
  translated: string,
  add: Add,
): { enLeaves: Leaf[]; trLeaves: Leaf[] } | null {
  let enData: Record<string, unknown>;
  let trData: Record<string, unknown>;
  try {
    enData = matter(quoteUnquotedBraceValues(enSource)).data as Record<string, unknown>;
  } catch {
    return null; // bad source isn't the translation's fault
  }
  try {
    trData = matter(quoteUnquotedBraceValues(translated)).data as Record<string, unknown>;
  } catch (err) {
    add(
      'error',
      'unparseable',
      `Translated file does not parse as frontmatter+body: ${String(err)}`,
    );
    return null;
  }
  const enLeaves: Leaf[] = [];
  const trLeaves: Leaf[] = [];
  flatten(enData, '', enLeaves);
  flatten(trData, '', trLeaves);
  return { enLeaves, trLeaves };
}

// 3-4. Frontmatter structural integrity, then per-field value checks. The
// per-field pass is only safe when shapes align, so a mismatch short-circuits it.
function checkFrontmatter(
  enLeaves: Leaf[],
  trLeaves: Leaf[],
  settings: ValidateSettings,
  add: Add,
): void {
  const { contract, doNotTranslate } = settings;
  const sameShape =
    enLeaves.length === trLeaves.length && enLeaves.every((l, i) => l.path === trLeaves[i].path);

  if (!sameShape) {
    const keyCount = (ls: Leaf[]) => {
      const m = new Map<string, number>();
      for (const l of ls) m.set(l.key, (m.get(l.key) ?? 0) + 1);
      return m;
    };
    const lines = diffCounts(keyCount(enLeaves), keyCount(trLeaves));
    add(
      'error',
      'shape-mismatch',
      `Frontmatter structure changed (field dropped, added, or retyped): ${lines.join('; ') || `${enLeaves.length} → ${trLeaves.length} string fields`}`,
    );
    return;
  }

  for (let i = 0; i < enLeaves.length; i++) {
    const s = enLeaves[i];
    const tVal = trLeaves[i].value;
    const allowed = contract.enums?.[s.key];
    if (allowed) {
      if (!allowed.has(tVal)) {
        add(
          'error',
          'enum-violation',
          `Enum field "${s.key}" has non-key value "${truncate(tVal)}"`,
          s.path,
        );
      }
    } else if (contract.enumKeys.has(s.key) && isSlugLike(s.value)) {
      if (tVal !== s.value) {
        add(
          'error',
          'enum-violation',
          `Enum key "${s.key}" was translated ("${s.value}" → "${tVal}") - must stay verbatim`,
          s.path,
        );
      }
    } else if (isTranslatableField(contract, s.key)) {
      if (looksUntranslated(s.value, tVal, doNotTranslate)) {
        add(
          'warn',
          'untranslated',
          `Translatable field came back identical to English: "${truncate(tVal)}"`,
          s.path,
        );
      }
    } else if (tVal !== s.value) {
      add(
        'error',
        'preserved-modified',
        `Non-translatable field was modified: "${truncate(s.value)}" → "${truncate(tVal)}"`,
        s.path,
      );
    }
  }
}

// 5. Link integrity (whole file - frontmatter HTML fields AND the body).
function checkLinks(enSource: string, translated: string, add: Add): void {
  const enLinks = linkTargets(enSource);
  const trLinks = linkTargets(translated);
  if (enLinks.join('\n') === trLinks.join('\n')) return;
  const dropped = enLinks.filter((h) => !trLinks.includes(h));
  const added = trLinks.filter((h) => !enLinks.includes(h));
  const detail = [
    dropped.length ? `dropped/changed: ${dropped.slice(0, 4).join(', ')}` : '',
    added.length ? `new/altered: ${added.slice(0, 4).join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  add(
    'error',
    'link-mismatch',
    `Link targets differ from source (${enLinks.length} → ${trLinks.length})${detail ? ` - ${detail}` : ''}`,
  );
}

// 6. HTML/JSX tag multiset (whole file). Catches invented/dropped/mangled tags -
// including custom components like <ApiLink /> and <Sample />.
function checkTags(enSource: string, translated: string, add: Add): void {
  const tagLines = diffCounts(tagCounts(enSource), tagCounts(translated));
  if (tagLines.length) {
    add(
      'error',
      'tag-mismatch',
      `Tag counts differ from source: ${tagLines.slice(0, 6).join('; ')}`,
    );
  }
}

// 7. Fenced code blocks must be byte-identical, in order.
function checkCode(enSource: string, translated: string, add: Add): void {
  const enCode = codeFences(enSource);
  const trCode = codeFences(translated);
  if (enCode.length !== trCode.length) {
    add(
      'error',
      'code-mismatch',
      `Fenced code block count differs: ${enCode.length} → ${trCode.length}`,
    );
    return;
  }
  // Report EVERY differing block, not just the first. Stopping at the first
  // one understates the damage and, worse, makes a partial fix look complete:
  // the pilot reported one mismatch each on three files that actually had
  // three, six and two - so a change that repaired only the first block would
  // have shown a clean diff in the report while still corrupting the rest.
  const differing: number[] = [];
  for (let i = 0; i < enCode.length; i++) {
    if (enCode[i] !== trCode[i]) differing.push(i + 1);
  }
  if (differing.length === 1) {
    add('error', 'code-mismatch', `Code block #${differing[0]} content changed during translation`);
  } else if (differing.length > 1) {
    add(
      'error',
      'code-mismatch',
      `${differing.length} code blocks changed during translation: #${differing.join(', #')}`,
    );
  }
}

// 8. MDX import statements must survive byte-for-byte.
//
// Nothing caught this before. The pipeline's masking layer only recognizes
// <Capitalized …> JSX tags, code, links and project protectPatterns — a bare
// `import Sample from '…';` line matches none of those, so it reaches the model
// as ordinary prose and is translated like any other sentence. Observed in
// production on the very first local-model run: all four imports of
// spreadsheet-chart-adapter.mdx came back with the JavaScript keyword `from`
// translated into Bulgarian (`import DocsAside от '…'`), which is a hard Astro
// build failure. checkTags did NOT flag it (an import line contains no tags) and
// checkCode did not either (it is not a fenced block).
//
// The masking gap itself is fixed per-project with a protectPatterns entry (see
// the docs configs), but that only helps projects that remember to add it. This
// check is the deterministic backstop: the import block is machine-generated,
// never prose, and must be identical in every locale.
function checkImports(enSource: string, translated: string, add: Add): void {
  const enImports = importStatements(enSource);
  const trImports = importStatements(translated);
  if (enImports.length !== trImports.length) {
    add(
      'error',
      'import-mismatch',
      `MDX import count differs: ${enImports.length} → ${trImports.length}`,
    );
    return;
  }
  for (let i = 0; i < enImports.length; i++) {
    if (enImports[i] !== trImports[i]) {
      add(
        'error',
        'import-mismatch',
        `Import #${i + 1} changed during translation: "${enImports[i]}" → "${trImports[i]}"`,
      );
      break;
    }
  }
}

// Import statements in document order. Line-based rather than one big regex so
// the order is unambiguous and the match is tight: the line must START with
// `import` AND END with a quoted module specifier. That deliberately excludes
// ordinary prose that merely uses the word — "You can import data from a
// workbook." is not an import statement and must stay translatable. Compared
// trimmed, so a pure indentation change is not reported as a defect.
function importStatements(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (/^import\s/.test(trimmed) && /['"][^'"]+['"]\s*;?$/.test(trimmed)) out.push(trimmed);
  }
  return out;
}

// 9. protectPatterns constructs must survive in the same numbers.
//
// The pipeline masks each of these to a __MDX_n__ token before the model sees
// the text and substitutes it back afterwards - but a model that DROPS the token
// leaves nothing to substitute, and the construct simply disappears.
//
// Nothing caught that. It is not a leftover token (the token is gone, not
// stranded), not a tag, link or code block, and not a doNotTranslate term. So a
// page could lose most of its `{Platform}` placeholders in total silence.
// Measured on the bg pilot, qwen3.6 dropped 28 of 45 `{Platform}` occurrences in
// area-chart.mdx, substituting invented heading text where the placeholder had
// been ("# {Platform} Area Chart" -> "# Първи стъпки с площна диаграма"), and the
// only reason we found out was the LLM judge reading the prose.
//
// Counted per pattern rather than in aggregate so the report names the construct
// that went missing. A translation with MORE occurrences is not flagged: a
// target language may legitimately repeat a product placeholder where English
// used a pronoun.
function checkProtectedTokens(
  enSource: string,
  translated: string,
  patterns: string[],
  add: Add,
): void {
  for (const src of patterns) {
    let re: RegExp;
    try {
      re = new RegExp(src, 'g');
    } catch {
      continue; // an invalid pattern is the config's problem, not this check's
    }
    const enCount = (enSource.match(re) ?? []).length;
    if (enCount === 0) continue;
    const trCount = (translated.match(new RegExp(src, 'g')) ?? []).length;
    if (trCount < enCount) {
      add(
        'error',
        'protected-dropped',
        `Protected construct /${src}/ appears ${enCount}× in the source but only ${trCount}× in ` +
          `the translation - the model dropped the placeholder token instead of reproducing it`,
      );
    }
  }
}

// 10. Brand/do-not-translate terms must occur at least as often as in the source
// - the deterministic backstop for what the prompt otherwise only ASKS the model
// to honor (nothing caught a translated/paraphrased/dropped occurrence before).
function checkBrands(
  enSource: string,
  translated: string,
  doNotTranslate: string[],
  maskedNames: string[],
  add: Add,
): void {
  const masked = new Set(maskedNames);
  for (const term of doNotTranslate) {
    const enCount = countOccurrences(enSource, term);
    const trCount = countOccurrences(translated, term);
    if (trCount >= enCount) continue;
    // Masked or not decides WHICH failure this is, and the two have nothing to
    // do with each other - see ResolvedConfig.maskedNames.
    if (masked.has(term)) {
      add(
        'error',
        'brand-token-dropped',
        `"${term}" appears ${enCount}× in the source but only ${trCount}× in the translation - it is masked before the prompt, so the model never saw the word: it dropped the placeholder token`,
      );
    } else {
      add(
        'error',
        'brand-translated',
        `"${term}" appears ${enCount}× in the source but only ${trCount}× in the translation - likely translated, paraphrased, or dropped`,
      );
    }
  }
}

function countOccurrences(text: string, term: string): number {
  return term ? text.split(term).length - 1 : 0;
}

function truncate(s: string, n = 60): string {
  const one = s.replace(/\s+/g, ' ').trim();
  return one.length > n ? one.slice(0, n - 1) + '…' : one;
}

export function hasErrors(violations: Violation[]): boolean {
  return violations.some((x) => x.severity === 'error');
}

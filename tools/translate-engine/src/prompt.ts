import { chunkIndices } from './chunk.js';
import type { GlossaryEntry, Provider, TargetLocale, Translator } from './types.js';

// Prompt building + the Translator factory.

export interface PromptSettings {
  doNotTranslate: string[];
  glossary: GlossaryEntry[];
  /** e.g. "technical documentation for the Ignite UI for Angular component library" */
  promptContext?: string;
  /** Project terminology/register guidance. A plain string applies to all
   *  locales; a per-locale map is resolved by target code at prompt-build time
   *  (same pattern as the glossary). See ProjectConfig.styleGuide. */
  styleGuide?: string | Record<string, string>;
  /** UI component names - the config's preserveNames that survived conflict
   *  resolution (ResolvedConfig.maskedNames). They also sit in doNotTranslate,
   *  but the prompt describes the two differently: a brand name is never
   *  translated, a component name is kept only where it names the component.
   *  See rulesBlock. */
  componentNames?: string[];
  /** Set only for a `judge --fix` re-translation pass: the specific issues a
   *  prior judge run found in a previous attempt at this same file, fed back
   *  so the model can target them directly instead of translating blind again. */
  correctionNotes?: string[];
}

/** Resolve per-locale style guidance: a plain string applies to every locale;
 *  a map is looked up by target code. Shared by translate and judge prompts. */
export function styleGuideFor(
  styleGuide: string | Record<string, string> | undefined,
  code: string,
): string | undefined {
  if (!styleGuide) return undefined;
  return typeof styleGuide === 'string' ? styleGuide : styleGuide[code];
}

function rulesBlock(s: PromptSettings, target: TargetLocale): string {
  // Brand names and UI component names get DIFFERENT instructions. Both used
  // to sit in one 'never translate them' list, and the model read a lowercase
  // common noun as the listed name: on the JP pilot 'in lists, cards, profile
  // menus' came back as 'リスト、Card、…' because 'Card' was on the list, where
  // the human translation - and the JP reviewers' stated policy - has カード.
  // The byte-for-byte mask never touched that word (it is exact-case and
  // whole-word), so the over-preservation was entirely the prompt's doing.
  // Component names are therefore described as identities to keep where they
  // NAME the component, and the ordinary-noun case is delegated to the
  // per-locale style guide, which knows how that language writes such words.
  const components = new Set(s.componentNames ?? []);
  const brands = s.doNotTranslate.filter((n) => !components.has(n));
  const never = brands.length
    ? `Keep these names EXACTLY as written, never translate them: ${brands.join(', ')}.`
    : '';
  const componentRule = components.size
    ? `UI component names of this product: ${[...components].join(', ')}. Keep such a name ` +
      'in English wherever it refers to the component itself - never calque or ' +
      'transliterate it there. Where the same word is an ordinary noun (a kind of ' +
      'content, a place in the UI, an example of where something appears) it is ' +
      'ordinary prose: translate it normally, as the style guide for the target ' +
      'language describes.'
    : '';
  const style = styleGuideFor(s.styleGuide, target.code);
  const styleBlock = style ? `\nProject style guide for ${target.name}:\n${style}` : '';
  const terms = s.glossary.filter((g) => g.translations[target.code]);
  const glossaryBlock = terms.length
    ? '\nApproved terminology (always use these translations):\n' +
      terms.map((g) => `- "${g.term}" → "${g.translations[target.code]}"`).join('\n')
    : '';
  const correctionBlock = s.correctionNotes?.length
    ? '\nA PREVIOUS translation attempt at this same document had these specific problems — ' +
      'fix them this time; do not repeat them:\n' +
      s.correctionNotes.map((n) => `- ${n}`).join('\n')
    : '';
  return (
    [never, componentRule].filter(Boolean).join(' ') + styleBlock + glossaryBlock + correctionBlock
  );
}

// Times drift per batch chunk ("8:30 AM" / "午前8:30") because each chunk
// localizes the AM/PM marker independently - keep them byte-identical instead.
const TIME_RULE =
  'Times: keep them EXACTLY as written - both the H:MM numerals and the AM/PM ' +
  'marker. Do NOT translate, localize, reorder, add, or drop AM/PM (e.g. ' +
  "'10:45 - 11:20 AM' must stay '10:45 - 11:20 AM'). Treat AM and PM as fixed tokens.";

// Observed 3 times across separate documents (Japanese target so far):
// "Getting Started with X" collapsed into the same wording as a nearby
// "Overview" / "What is X" heading, losing the distinct "how do I begin"
// meaning. A generic "translate headings accurately" instruction didn't
// prevent this, so naming the exact confusion explicitly instead - untested
// whether this specific phrasing fixes it, but worth trying before falling
// back to per-file glossary/manual correction each time it recurs.
const HEADING_DISTINCTNESS_RULE =
  'Section headings that mean different things must stay different in the translation. ' +
  "In particular, a 'Getting Started with X' or 'Getting started' heading means " +
  "'how to begin using X' - do NOT translate it the same way as a nearby 'Overview' or " +
  "'What is X?' heading, even if both appear early in the document and seem similar in tone.";

// Observed via judge: a single document mixing formal and informal address
// (e.g. Spanish "usted" in one paragraph, "tú" in another) reads as an error
// to native speakers even though each sentence is individually correct - a
// glossary entry can't fix this since it's about the whole document's
// register, not a specific term.
const REGISTER_CONSISTENCY_RULE =
  'Use ONE level of formality throughout the ENTIRE translation and never switch. ' +
  'If the target language distinguishes formal/informal address (e.g. Spanish ' +
  'usted/tú, French vous/tu, German Sie/du), pick whichever register matches ' +
  'professional technical documentation (typically the formal form) and use it ' +
  'consistently in every sentence, not just the one you are currently translating.';

// The single largest defect class the judge reports: 139 of 377 issues across
// the four shipping locales are the SAME term rendered two different ways inside
// one document ("серия" vs "серия от данни"; 'овърлей' vs 'наслагване'; a chart
// name translated in a heading but left English in the table below it). Each
// individual rendering is defensible, which is why no glossary entry fixes it -
// the defect is the variation, not any one choice.
//
// REGISTER_CONSISTENCY_RULE already covers this for formality; this is the same
// idea for terminology. It is stated in terms of the WHOLE document because the
// model translates a page as one completion and can see its own earlier choices.
const TERM_CONSISTENCY_RULE =
  'Pick ONE translation for each distinct term and use it EVERYWHERE in this ' +
  'document - headings, body text, tables, list items, link text, image alt text ' +
  'and frontmatter alike. If you render a term one way in a heading, render it ' +
  'the same way in the paragraph and the table below it. Never alternate between ' +
  'two acceptable renderings of the same concept, and never switch between ' +
  'keeping a name in English in one place and translating it in another when it ' +
  'is used the same way (a component name used as an ordinary noun is a different ' +
  'usage - see the component-name rule). When a ' +
  'term appears in both a short form and a longer form in the source, keep that ' +
  'distinction rather than collapsing both into one.';

// Companion to the rule above, for the specific case that caused most of it.
// The glossary covers 6 chart terms; the docs corpus uses 20+ ("Waterfall
// Chart", "Radial Column Chart", "Step Area Chart" …). So the model finds
// "area chart" -> "gráfico de áreas" mandated, finds nothing for "waterfall
// chart", and picks a DIFFERENT strategy for it - producing "Gráfico de áreas"
// two lines above an untouched "Waterfall Chart". The judge flags the mixture,
// correctly, as inconsistent terminology.
//
// Extending the glossary to every family member is the durable fix, but it is
// terminology work owned by a native speaker. This rule is what lets the model
// behave sensibly in the meantime, and it stays useful afterwards: no glossary
// ever covers a naming family exhaustively.
const TERM_FAMILY_RULE =
  'The approved terminology list is not exhaustive. When it covers SOME members ' +
  'of a family of related names but not others (for example it gives a rule for ' +
  '"area chart" and "column chart" but says nothing about "waterfall chart" or ' +
  '"step area chart"), follow the SAME pattern for every member of that family. ' +
  'Do not treat the uncovered ones differently just because they are absent from ' +
  'the list - translating one and leaving its sibling in English in the same ' +
  'document is worse than either choice applied consistently.';

// Reviewer feedback (Spanish, but general): literal word-for-word translation of
// established technical terms and UI component/product names reads wrong to
// established technical terms and UI component/product names reads wrong to
// developers - "Tree Grid" → "Cuadrícula de Árbol" is grammatical prose but a bad
// coinages) alienates readers outside one country - the industry keeps English
// technical names; mainstream vendor docs (e.g. Microsoft's localization
// terminology) are the de-facto standard. A project-specific styleGuide can
// refine or override this per locale.
const TERMINOLOGY_RULE =
  'Terminology and register: write in NEUTRAL, professional language as used in ' +
  'mainstream industry technical documentation - the register a working software ' +
  'developer in the target market expects. Where a widely-followed vendor standard ' +
  "exists (e.g. Microsoft's localization terminology for this language), follow it. " +
  'Prefer the term the developer audience actually uses over a literal word-for-word ' +
  'calque: for established technical terms and UI component / product / API names ' +
  'this is very often the ORIGINAL ENGLISH term — keep it in English rather than ' +
  'inventing an awkward literal translation. Treat a kept English multi-word ' +
  'component or product name as a fixed proper name: do NOT insert connective words ' +
  "(e.g. Spanish 'de') that you would only add when paraphrasing it inside a sentence. " +
  'Do not over-localize with regional coinages only some speakers use. Stay faithful ' +
  'to the English meaning, but rephrase when a strictly literal rendering reads ' +
  'unnaturally.';

// Safeguard for API/code identifiers that authors DIDN'T wrap in backticks
// (which would otherwise be masked deterministically). Anchored to identifier
// SHAPE, which the model detects reliably - not a vague "product-related word"
// notion, which would over-preserve ordinary prose. Complements preserveNames
// (a fixed component-name list) and the code masking; catches the long tail of
// class/method/property/event/command names written inline as plain text.
const IDENTIFIER_RULE =
  'Product/API identifiers are code, not prose — keep them EXACTLY as written in ' +
  'English even when they are NOT wrapped in backticks. Treat a token as an ' +
  'identifier when its SHAPE is code-like: PascalCase (IgxGridComponent, ' +
  'HierarchicalTransactionService), camelCase (onSelectionChanging), snake_case, ' +
  'kebab-case CLI/package names (igniteui-cli, ai-config), a dotted namespace ' +
  '(Infragistics.Controls), or a name immediately followed by () (EndEdit()). Do ' +
  'NOT translate, inflect, re-case, space, or hyphenate these. Ordinary words ' +
  'that merely relate to the product are still translated normally — this applies ' +
  'only to code-shaped identifiers.';

const SHARED_RULES = (lang: string, s: PromptSettings, target: TargetLocale): string =>
  `- Write the translation ENTIRELY in ${lang}. Never output any other language (e.g. never Spanish when the target is Brazilian Portuguese).
- Translate the natural-language text only.
- Keep EXACTLY as-is: all Markdown/HTML tags & attributes, HTML entities (&amp;, &#8217;), URLs, file paths, and code.
- Placeholder tokens of the form __WORD_0__ represent hidden markup. Reproduce EVERY token exactly once, unchanged; never drop, add, translate, or renumber one.
- __BLOCK_n__ and __FENCE_n__ tokens each stand for a whole, distinct code block. They must stay in EXACTLY the same relative order as the source — never swap __BLOCK_2__ and __BLOCK_3__, for example, even if it seems to read more naturally in the target language. Swapping them silently corrupts two different code samples.
- __MDX_n__ and __URL_n__ tokens may be moved to wherever fits the target language's word order, as long as every token still appears exactly once.
- Preserve the exact leading whitespace/indentation of every line. Do not dedent, re-indent, or reflow list items, nested blocks, or blank lines, even if the indentation looks inconsistent to you.
- Translate ALL visible text, including the text inside HTML tags such as link text in <a>…</a>.
- ${TIME_RULE}
- ${HEADING_DISTINCTNESS_RULE}
- ${REGISTER_CONSISTENCY_RULE}
- ${TERM_CONSISTENCY_RULE}
- ${TERM_FAMILY_RULE}
- ${TERMINOLOGY_RULE}
- ${IDENTIFIER_RULE}
- ${rulesBlock(s, target)}`;

// Anchoring the translator as a NATIVE SPEAKER of the target language nudges the
// model toward idiomatic, natural output (a well-known quality lever) rather than
// literal source-shaped prose. The domain (promptContext) is appended when set.
function persona(s: PromptSettings, target: TargetLocale): string {
  const base = `You are a native ${target.name} speaker and a professional technical translator`;
  return s.promptContext ? `${base} working on ${s.promptContext}.` : `${base}.`;
}

export function buildPrompt(text: string, target: TargetLocale, s: PromptSettings): string {
  return `${persona(s, target)}

Translate the following content to ${target.name}.

RULES:
${SHARED_RULES(target.name, s, target)}
- Output ONLY the translation — no commentary, no preamble, no code fences.

<source>
${text}
</source>

Translation:`;
}

// buildPrompt wraps the text it sends in literal <source>…</source> delimiters,
// and a model can echo that scaffolding straight back into its answer instead of
// treating it as framing. translategemma:27b does exactly this: the body of
// spreadsheet-chart-adapter.mdx came back wrapped in <source>…</source>, which
// the validator then (correctly) reported as tag-mismatch "source: 0 → 2".
//
// Relying on judge --fix for this does not converge: the fix re-translates with
// the SAME model, which is free to emit the wrapper again, and a fix that fails
// validation is held back — so the broken file stays written and flagged. Strip
// it deterministically instead, in the one place that knows the delimiter was
// added. Same idea as sanitizeFrontmatterValue removing echoed fences and
// "Translation:" preambles from frontmatter values.
//
// Guarded two ways: the wrapper must enclose the WHOLE completion, and the input
// must not itself have started with <source> (an HTML <source> element inside a
// <video>/<audio> block is legitimate content — normally masked as a raw-HTML
// __BLOCK__ token, but never strip a real one just in case).
export function stripEchoedSourceWrapper(input: string, output: string): string {
  if (input.trimStart().startsWith('<source')) return output;
  const m = output.trim().match(/^<source>\s*([\s\S]*?)\s*<\/source>$/);
  return m ? m[1] : output;
}

export function buildBatchPrompt(
  obj: Record<string, string>,
  target: TargetLocale,
  s: PromptSettings,
): string {
  return `${persona(s, target)} Translate each VALUE in the JSON object below into ${target.name}.

RULES:
${SHARED_RULES(target.name, s, target)}
- Do NOT translate or change the keys. Return a JSON object with the SAME keys and the translated values.
- Return EVERY key. Output ONLY the JSON object.

${JSON.stringify(obj)}`;
}

// Response hygiene

// Local LLMs sometimes emit byte-fallback tokens as LITERAL text - e.g.
// "<0xC2><0xA0>" instead of U+00A0. Decode any run by reassembling the bytes
// as UTF-8 (invalid sequences degrade to U+FFFD, still better than raw tokens).
export function decodeByteTokens(text: string): string {
  if (!text.includes('<0x')) return text;
  return text.replace(/(?:<0x[0-9A-Fa-f]{2}>)+/g, (run) => {
    const bytes = [...run.matchAll(/<0x([0-9A-Fa-f]{2})>/g)].map((m) => parseInt(m[1], 16));
    return Buffer.from(bytes).toString('utf-8');
  });
}

// Cloud models occasionally wrap JSON in a markdown fence despite instructions.
export function extractJsonObject(text: string): Record<string, unknown> | null {
  let t = text.trim();
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(t.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Batching
// Many short strings go in ONE request as {"0": "...", "1": "..."}. Chunked
// (≤20 items / ≤6000 chars, see chunk.ts) to bound the context and to keep
// JSON-batch failure blast radius small.

const BATCH_LIMITS = { maxItems: 20, maxChars: 6000 };

// Translator factory
// Wires a raw Provider into the two-function Translator the pipeline consumes.

export function makeTranslator(
  provider: Provider,
  target: TargetLocale,
  settings: PromptSettings,
): Translator {
  return {
    async one(text: string): Promise<string> {
      const out = await provider.complete(buildPrompt(text, target, settings));
      // Strip an echoed <source> wrapper before anything downstream sees it —
      // only `one()` needs this, since buildBatchPrompt uses no such delimiter.
      return decodeByteTokens(stripEchoedSourceWrapper(text, out.trim()).trim());
    },

    async many(texts: string[]): Promise<(string | null)[]> {
      const out: (string | null)[] = Array.from({ length: texts.length }, () => null);
      for (const idxs of chunkIndices(texts, BATCH_LIMITS)) {
        const obj: Record<string, string> = {};
        idxs.forEach((globalIdx, local) => {
          obj[String(local)] = texts[globalIdx];
        });
        try {
          const raw = await provider.complete(buildBatchPrompt(obj, target, settings), {
            json: true,
          });
          const parsed = extractJsonObject(raw);
          if (!parsed) continue; // whole chunk falls back to single-string calls
          idxs.forEach((globalIdx, local) => {
            const v = parsed[String(local)];
            if (typeof v === 'string') out[globalIdx] = decodeByteTokens(v);
          });
        } catch {
          // network/parse failure → entries stay null for the fallback path
        }
      }
      return out;
    },
  };
}

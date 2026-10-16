import type { GlossaryEntry, Provider, TargetLocale } from './types.js';
import { extractJsonObject, styleGuideFor } from './prompt.js';

// LLM-as-judge (Layer 2 - semantic QA, sampled/advisory)
// A second model - use a DIFFERENT model (ideally vendor) than the translator so
// it doesn't rubber-stamp its own output - scores each translated file against
// its source. Deterministic structure is Layer 1's job (validate.ts); the judge
// looks for what a parser can't see: mistranslation, dropped meaning, awkward
// register, terminology drift.

export interface JudgeScore {
  file: string;
  locale: string;
  accuracy: number; // 1–5: meaning preserved, no mistranslation
  completeness: number; // 1–5: nothing dropped or summarized away
  terminology: number; // 1–5: glossary/domain terms used consistently
  fluency: number; // 1–5: reads naturally in the target language
  overall: number; // 1–5
  issues: string[]; // concrete, quotable problems found
  /** When this score was produced - the report file accumulates every run's
   *  scores in one place, so this is what distinguishes one pass over a file
   *  from the next. */
  timestamp: string;
}

const clamp = (n: unknown): number => {
  const x = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(x) ? Math.min(5, Math.max(1, Math.round(x))) : 1;
};

function buildJudgePrompt(
  source: string,
  translated: string,
  target: TargetLocale,
  glossary: GlossaryEntry[],
  promptContext?: string,
  styleGuide?: string | Record<string, string>,
): string {
  const terms = glossary
    .filter((g) => g.translations[target.code])
    .map((g) => `- "${g.term}" → "${g.translations[target.code]}"`)
    .join('\n');
  const style = styleGuideFor(styleGuide, target.code);
  return `You are a native ${target.name} speaker and a strict translation quality reviewer for ${promptContext ?? 'technical content'}.
Compare the ${target.name} translation against the English source and score it.

Judge ONLY the natural-language text. Markup, code, URLs, and component tags are validated separately, ignore them unless prose meaning is affected.
${terms ? `\nApproved terminology the translation must use:\n${terms}\n` : ''}${style ? `\nProject style guide the translation must follow — penalize terminology when it is not met:\n${style}\n` : ''}
Score each dimension 1–5 (5 = flawless):
- accuracy: meaning preserved, no mistranslation or invented content
- completeness: no sentence or list item dropped or summarized away
- terminology: domain terms translated consistently, per the approved list AND the project style guide (neutral register, established English names kept, no over-localization)
- fluency: reads like it was written natively in ${target.name}

Report concrete issues, each as one short quotable sentence naming the problem text.

Return ONLY a JSON object: {"accuracy": n, "completeness": n, "terminology": n, "fluency": n, "overall": n, "issues": ["..."]}

<english_source>
${source}
</english_source>

<translation lang="${target.code}">
${translated}
</translation>`;
}

export async function judgeTranslation(
  judge: Provider,
  file: string,
  source: string,
  translated: string,
  target: TargetLocale,
  glossary: GlossaryEntry[],
  promptContext?: string,
  styleGuide?: string | Record<string, string>,
): Promise<JudgeScore> {
  const raw = await judge.complete(
    buildJudgePrompt(source, translated, target, glossary, promptContext, styleGuide),
    { json: true },
  );
  const parsed = extractJsonObject(raw);
  if (!parsed) {
    return {
      file,
      locale: target.code,
      accuracy: 1,
      completeness: 1,
      terminology: 1,
      fluency: 1,
      overall: 1,
      issues: ['judge returned unparseable output — treat as needs-human-review'],
      timestamp: new Date().toISOString(),
    };
  }
  return {
    file,
    locale: target.code,
    accuracy: clamp(parsed.accuracy),
    completeness: clamp(parsed.completeness),
    terminology: clamp(parsed.terminology),
    fluency: clamp(parsed.fluency),
    overall: clamp(parsed.overall),
    issues: Array.isArray(parsed.issues) ? parsed.issues.map(String).slice(0, 20) : [],
    timestamp: new Date().toISOString(),
  };
}

// Per locale styleGuide for the docs, shared by both docs configs (like
// docs-component-names.mjs). Structure: a SHARED rule that applies to every
// language (keep Ignite UI component/product/API names in English) + each
// language's register/tone note distilled from Microsoft's Localization Style
// Guides (spa-neu / jpn / kor / bul). Resolved per target locale by
// styleGuideFor() at prompt-build time, and injected into BOTH the translate and
// judge prompts.

const SHARED =
  'In EVERY target language, keep the actual Ignite UI component, product, and ' +
  'API names in English - do not translate or transliterate them. This covers UI ' +
  'component names ("Tree Grid", "Data Grid", "Grid", "Chart", "Slider", …) and ' +
  'framework component/type names (e.g. IgxGridComponent, igb-grid). Never produce ' +
  'a literal calque such as Spanish "Cuadrícula de Árbol". Treat a kept English ' +
  'name as a fixed proper noun (no inserted connective words). Translate ordinary ' +
  'descriptive prose normally.';

const MSFT = {
  es:
    'Write in neutral, INTERNATIONAL Spanish understood across all Spanish-speaking ' +
    'markets - do not use country-specific coinages; pick the pan-regional term ' +
    '(e.g. use "equipo" or "su PC", never Spain-only "ordenador"). Address the ' +
    'reader with the formal "usted" throughout - never the informal "tú".',
  ja:
    'Write in natural, polite Japanese using the standard polite documentation ' +
    'style (です・ます form). Avoid stiff, archaic, or unnecessarily formal wording, ' +
    'and never use blunt or impolite forms. Omit an explicit "you/your" where ' +
    'natural Japanese would drop it.\n' +
    // Component naming, as stated by the JP docs reviewers (2026-09-30) and as
    // the human-translated jp/ corpus already writes it: English where the word
    // names the component, katakana where it is a common noun. The test is
    // theirs, so the review skill and the engine apply the same rule.
    'Component names: use the English name ONLY where the word refers to the Ignite UI ' +
    'component as such - typically compounded with コンポーネント, or as the thing being ' +
    'configured, rendered, styled or imported ("Avatar コンポーネント", "Badge を使用します"). ' +
    'Where the same word is an ordinary noun - a kind of content, a place in the UI, an ' +
    'example of where something appears - write it in katakana as any Japanese technical ' +
    'writer would ("カード形式で表示", "リスト、カード、プロフィール メニューに配置"). Test: ' +
    'replace the word with the prefixed type name (cards → IgrCards); if the sentence still ' +
    'correctly refers to the component and that component is documented on this page, keep ' +
    'the English name, otherwise translate the word. Example: "The Card component displays ' +
    'elements in a card format." → "Card コンポーネントは、要素をカード形式で表示します。" ' +
    'Put a half-width (ASCII) space between English words and Japanese text ("Avatar を使用", ' +
    '"UI で"); never a full-width space.',
  kr:
    'Write in polite, professional, respectful Korean using the standard formal ' +
    'documentation sentence endings (the "-ㅂ니다/습니다" deferential style). Avoid ' +
    'rude/impolite or overly casual endings.',
  'pt-br':
    'Write in BRAZILIAN Portuguese, not European Portuguese - use Brazilian ' +
    'spelling, vocabulary and constructions throughout (e.g. "tela" not "ecra", ' +
    '"arquivo" not "ficheiro", "usuario" not "utilizador"). Address the reader ' +
    'as "voce", the normal register for Brazilian technical documentation, and ' +
    'prefer the gerund progressive where Brazilian usage expects it. Keep ' +
    'sentences direct; avoid the heavier formal register of European ' +
    'Portuguese.',
  bg:
    'Address the reader directly using the formal second person ("Вие"). Avoid ' +
    'old-fashioned, archaic, or needlessly formal/wordy phrasing; keep sentences ' +
    'brief and clear (passive voice is fine to avoid an awkward construction).',
};

export default Object.fromEntries(
  Object.entries(MSFT).map(([code, note]) => [code, `${SHARED}\n${note}`]),
);

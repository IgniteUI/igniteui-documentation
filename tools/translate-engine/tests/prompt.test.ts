import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPrompt, stripEchoedSourceWrapper } from '../src/prompt.js';

// buildPrompt frames the text it sends in literal <source>…</source> delimiters.
// Some models — translategemma:27b reproducibly — echo that scaffolding back as
// part of the answer, which the validator then reports as tag-mismatch
// "source: 0 → 2". These cover the deterministic strip that removes it.
describe('stripEchoedSourceWrapper', () => {
  test('strips a wrapper the model echoed around the whole completion', () => {
    const input = '# Chart Adapter\n\nThe component shows charts.';
    const echoed = '<source>\n# Адаптер\n\nКомпонентът показва диаграми.\n</source>';
    assert.equal(
      stripEchoedSourceWrapper(input, echoed),
      '# Адаптер\n\nКомпонентът показва диаграми.',
    );
  });

  test('leaves a clean completion untouched', () => {
    const input = 'The component shows charts.';
    const clean = 'Компонентът показва диаграми.';
    assert.equal(stripEchoedSourceWrapper(input, clean), clean);
  });

  test('does not strip when the source itself is a <source> element', () => {
    // A real HTML <source> inside <video>/<audio> is legitimate content. It is
    // normally masked as a raw-HTML __BLOCK__ token, but the guard makes sure we
    // never eat a genuine one even if it does reach the model.
    const input = '<source src="a.mp4" type="video/mp4" />';
    const out = '<source src="a.mp4" type="video/mp4" />';
    assert.equal(stripEchoedSourceWrapper(input, out), out);
  });

  test('does not strip a partial or unbalanced wrapper', () => {
    const input = 'Some prose.';
    // Only an opening tag — not the wrap-the-whole-thing shape we target, so it
    // must be left alone for the validator to flag rather than silently altered.
    const partial = '<source>\nНякакъв текст.';
    assert.equal(stripEchoedSourceWrapper(input, partial), partial);
  });

  test('does not strip when content follows the closing tag', () => {
    const input = 'Some prose.';
    const trailing = '<source>\nНякакъв текст.\n</source>\nOh and here is a note.';
    assert.equal(stripEchoedSourceWrapper(input, trailing), trailing);
  });
});

// The keep-list used to name brands and UI components in ONE 'never translate
// them' line, and the model read a lowercase common noun as the listed name -
// 'in lists, cards, profile menus' came back as 'リスト、Card、…' on the JP pilot.
// Component names now get their own rule that keeps them only where they NAME
// the component; the ordinary-noun case is the per-locale style guide's.
describe('buildPrompt keep-lists', () => {
  const target = { code: 'ja', name: 'Japanese', dir: 'content/ja' };

  test('splits brand names from component names', () => {
    const p = buildPrompt('text', target, {
      doNotTranslate: ['Infragistics', 'React', 'Card', 'Avatar'],
      componentNames: ['Card', 'Avatar'],
      glossary: [],
    });
    assert.match(
      p,
      /never translate them: Infragistics, React\. UI component names of this product: Card, Avatar\. Keep such a name/,
    );
  });

  test('without componentNames every name stays on the never-translate line', () => {
    const p = buildPrompt('text', target, {
      doNotTranslate: ['Infragistics', 'Card'],
      glossary: [],
    });
    assert.match(p, /never translate them: Infragistics, Card\./);
    assert.doesNotMatch(p, /UI component names of this product/);
  });

  test('a component-only list produces the component rule alone', () => {
    const p = buildPrompt('text', target, {
      doNotTranslate: ['Card'],
      componentNames: ['Card'],
      glossary: [],
    });
    assert.doesNotMatch(p, /never translate them/);
    assert.match(p, /UI component names of this product: Card\./);
  });
});

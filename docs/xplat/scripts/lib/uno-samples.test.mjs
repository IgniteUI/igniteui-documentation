import assert from 'node:assert/strict';
import { test } from 'node:test';
import { filterUnoSamples } from './uno-samples.mjs';

const available = '<Sample src="/charts/category-chart/overview" height={500} />';
const unavailable = '<Sample src="/charts/no-such-component/no-such-example" height={500} />';

test('WinUI and Uno retain the source-enabled widget for available samples', () => {
    for (const platform of ['WinUI', 'Uno']) {
        assert.equal(filterUnoSamples(available, platform), available);
        assert.equal(filterUnoSamples('# Feature\n\n' + unavailable + '\nDescription.', platform), '# Feature\n\n\nDescription.');
    }
});

test('web samples and fenced widget examples retain their original markup', () => {
    for (const platform of ['Angular', 'React', 'WebComponents', 'Blazor']) {
        assert.equal(filterUnoSamples(available + unavailable, platform), available + unavailable);
    }
    const code = '```mdx\n' + unavailable + '\n```';
    assert.equal(filterUnoSamples(code, 'Uno'), code);
});

test('multiline widgets and prefixed direct routes resolve to the same sample', () => {
    const widget = '<Sample\n  src="/samples/charts/category-chart/overview/"\n  height={500}\n/>';
    assert.equal(filterUnoSamples(widget, 'Uno'), widget.replace('/samples/charts/category-chart/overview/', '/charts/category-chart/overview'));
    assert.equal(filterUnoSamples('<Sample iframeOnly src="/charts/category-chart/overview" />', 'Uno'),
        '<Sample iframeOnly src="/charts/category-chart/overview" />');
});

test('the shared shapefile example uses the matching Uno polyline sample', () => {
    const widget = '<Sample src="/maps/geo-map/binding-shp-file" height={500} />';
    for (const platform of ['WinUI', 'Uno']) {
        assert.equal(filterUnoSamples(widget, platform),
            '<Sample src="/maps/geo-map/binding-shp-polylines" height={500} />');
    }
    assert.equal(filterUnoSamples(widget, 'WebComponents'), widget);
});

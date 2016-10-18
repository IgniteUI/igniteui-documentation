<!--
|metadata|
{
    "fileName": "categorychart-configuring-chart-types",
    "controlName": "igCategoryChart",
    "tags": ["API", "CategoryChart", "Axes"]
}
|metadata|
-->

# チャート タイプの構成

## チャート タイプの設定

[チャート タイプ](categorychart-chart-types.html)トピックに説明されているとおり、チャートはプロパティを変更するだけでさまざまなチャートタイプを描画できます。

初期化時にチャート タイプを割り当てる方法:

```javascript
$("#theChart").igCategoryChart({
    dataSource: data,
    chartType: "spline"
});
```

初期化後にチャート タイプを変更する方法:

```javascript
$("#theChart").igCategoryChart("option", "chartType", "area");
```

## プロパティ

チャートの外観をカスタマイズには、多数のプロパティが用意されています。

プロパティ名|プロパティ タイプ|デフォルト値|説明
---|---|---|---
`brushes`|object|null|Gets or sets the palette of brushes to use for coloring the chart series. The value provided should be an array of CSS color strings or JavaScript objects defining gradients. Optionally the first element can be a string reading "RGB" or "HSV" to specify the interpolation mode of the collection.
`negativeBrushes`|object|null|Gets or sets the palette used for coloring negative items of Waterfall chart type. The value provided should be an array of CSS color strings or JavaScript objects defining gradients. Optionally the first element can be a string reading "RGB" or "HSV" to specify the interpolation mode of the collection.
`outlines`|object|null|Gets or sets the palette of brushes to use for outlines on the chart series. The value provided should be an array of CSS color strings or JavaScript objects defining gradients. Optionally the first element can be a string reading "RGB" or "HSV" to specify the interpolation mode of the collection.
`resolution`|number|1|Gets or sets the rendering resolution for series in this chart. Where n = Resolution, for every n horizontal pixels, combine all items into a single datapoint.  When Resolution = 0, all datapoints will be rendered as graphical objects.  Charts with a higher resolution will have faster performance.
`thickness`|number|1|Gets or sets the thickness of the chart series. Depending on the ChartType, this can be the main brush used, or just the outline.
`xAxisGap`|number|0|Gets or sets the amount of space between adjacent categories for the X-axis. Gets or sets the gap is silently clamped to the range [0, inf] when used.
`xAxisOverlap`|number|0|Gets or sets the amount of overlap between adjacent categories for the X-axis. Gets or sets the overlap is silently clamped to the range [-1, 1] when used.
`xAxisInverted`|bool|null|Gets or sets whether the direction of the X-axis is inverted, placing the first data items on the right side instead of left side.
`yAxisInverted`|bool|null|Gets or sets whether the direction of the Y-axis is inverted, placing minimum numeric value at the top of the axis instead of bottom.

## 例

以下の例では上記で説明したプロパティのいくつかを使用します。
構成オプションの詳細については、このトピックの最後にあるリンクをご利用ください。

```javascript
$("#theChart").igCategoryChart({
	dataSource: data,
	chartType: "waterfall",
	brushes: ["blue", "green"],
	negativeBrushes: ["red", "yellow"],
	outlines: ["black"],
	thickness: 5
});
```
ウェブページでコードを実行した結果です。
![](images/chart-types-configure.png)

## 関連トピック

- [チュートリアル](igcategorychart-adding.html)

- [チャート タイプ](categorychart-chart-types.html)

- [軸の間隔と重複](categorychart-configuring-axis-gap-and-overlap.html)

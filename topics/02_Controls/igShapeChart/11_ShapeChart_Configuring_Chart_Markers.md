<!--
|metadata|
{
    "fileName": "shapechart-configuring-chart-markers",
    "controlName": "igShapeChart",
    "tags": ["API", "ShapeChart", "Axes"]
}
|metadata|
-->

# チャート マーカーの構成

マーカーは、igShapeChart コントロールのプロット領域のデータ ポイント値を表示する視覚的要素です。マーカーは、値が主グリッド線と副グリッド線の間にある場合も指定したデータ ポイントの値をただちに識別できるようユーザーをサポートします。

このセクションは、igShapeChart コントロールのマーカーでの作業に関するタスクベースの手順についての役立つ情報を提供します。

- [前提条件](#requiredbackground)
- [サポートされるチャート タイプ](#supportedcharttypes)
- [マーカー プロパティ](#markerproperties)
- [マーカー タイプ](#markertypes)
- [マーカー ブラシとアウトライン](#markerbrushesandoutlines)
- [関連コンテンツ](#relatedcontent)

#### <a id="requiredbackground"/> 前提条件
トピック|目的
---|---
[igShapeChart の概要](shapechart-overview.html)|このトピックは、主要機能、最小要件およびユーザー機能性など、igShapeChart コントロールの概念的な情報を提供します。
[igShapeChart を使用した作業の開始](shapechart-getting-started-with-shapechart.html)|このトピックでは、データを igShapeChart コントロールにバインドする方法を説明します。

#### <a id="supportedcharttypes"/> サポートされるチャート タイプ

注: 多角形チャートはポイントによって定義される図形の中央にマーカーを表示します。その他のチャート タイプはデータ項目の X/Y 座標にマーカーを描画します。

- バブル
- 折れ線
- ポイント
- スプライン
- 多角形 

#### <a id="markerproperties"/> マーカー プロパティ
以下の表は、マーカーのすべてのプロパティの一覧です。


プロパティ名|プロパティ型|説明
---|---|---
`markerTypes`| MarkerType |チャートのすべてのシリーズで表示されるマーカーのタイプを決定します。
`markerBrushes` |Brush |マーカーの塗りつぶし色を決定します。
`markerOutlines`|Brush|マーカーのアウトライン色を決定します。
`MarkerMaxCount`|int|マーカーの最大数を決定します。


#### <a id="markertypes"/> マーカー タイプ
プロパティ名|プロパティ型|説明
---|---|---
`circleMarker`|MarkerType|円マーカーのタイプを表示します。
`diamondMarker`|MarkerType|ダイアモンド マーカーのタイプを表示します。
`hexagonMarker`|MarkerType|六角形マーカーのタイプを表示します。
`hexagramMarker`|MarkerType|六線星形マーカーのタイプを表示します。
`pentagramMarker`|MarkerType|五芒星マーカーのタイプを表示します。
`pentagonMarker`|MarkerType|五角形マーカーのタイプを表示します。
`pyramidMarker`|MarkerType|ピラミッドマーカーのタイプを表示します。
`squareMarker`|MarkerType|四角形マーカーのタイプを表示します。
`tetragramMarker`|MarkerType|テトラグラム マーカーのタイプを表示します。
`triangleMarker`|MarkerType|三角形マーカーのタイプを表示します。
`autoMarker`|MarkerType|チャートに描画される各シリーズに上記のリストから 1 つのマーカー タイプを表示します。
`noneMarker`|MarkerType|指定したシリーズでマーカーを非表示にします。


以下のコードは、igShapeChart のマーカー タイプの変更方法を示します。

*HTML の場合:*

```html
$(function () {
     $(“chart1”).igShapeChart({
	     markerTypes: [“diamond, "circle”, "square"]
     });
});
```

以下のスクリーンショットは、折れ線チャート タイプでダイアモンド マーカーを使用した igShapeChart コントロールを示します。

![](images/shapechart-chart-markers-01.png)


#### <a id="markerbrushesandoutlines"/> マーカー ブラシとアウトライン

以下のコード スニペットは、igShapeChart の markerBrushes および markerOutlines の変更方法を示します。

*HTML の場合:*

```html
$(function () {
     $(“chart1”).igShapeChart({
	    markerBrushes: [“White”],
	    markerOutlines: [“Red”, “Orange”, “Green”], 
	    markerTypes: [“diamond", "circle”, "square"]
     });
});
```

以下のスクリーンショットは、折れ線チャート タイプでマーカーをカスタマイズした igShapeChart コントロールを示します。

![](images/shapechart-chart-markers-02.png)



## <a id="relatedtopics"/>関連トピック:

- [軸ラベルの構成](shapechart-configuring-axis-labels.html)

- [軸範囲の構成](shapechart-configuring-axis-ranges.html)
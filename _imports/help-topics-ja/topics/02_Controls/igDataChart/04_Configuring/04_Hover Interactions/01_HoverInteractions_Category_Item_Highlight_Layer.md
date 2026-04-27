<!--
|metadata|
{
    "fileName": "hoverinteractions-category-item-highlight-layer",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# カテゴリ項目ハイライト レイヤーの構成 (igDataChart)

## トピックの概要

### 目的

このトピックは、ホバー操作に使用されるカテゴリ項目ハイライト レイヤーについての情報を提供します。カテゴリ項目ハイライト レイヤーのプロパティについて説明し、実装例を示します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igDataChart の追加](igDataChart-Adding.html): このトピックでは、`igDataChart`™ コントロールをページに追加し、データにバインドする方法を紹介します。

- [igDataChart をデータにバインド](igDataChart-DataBinding.html): このトピックでは、`igDataChart`™ コントロールを各種データ ソース (JavaScript 配列、`IQueryable<T>`、Web サービス) にバインドする方法について説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#overview)
	-   [プレビュー](#preview)
-   [プロパティ](#properties)
-   [例](#example)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a> 概要

#### カテゴリ項目ハイライト レイヤーの概要

`categoryItemHighlightLayer` は、縞模様シェイプまたはマーカーをその位置で描画することにより、カテゴリ軸を使用してシリーズで項目を強調表示します。

デフォルトの強調表示はシリーズの型に依存します。たとえば、`columnSeries` と `lineSeries` の強調表示は同じではありません。`columnSeries` の場合は縞模様シェイプであり、`lineSeries` の場合はマーカーです。`highlightType` プロパティを設定して、デフォルトの強調表示をオーバーライドできます。このプロパティの詳細は、以下の[プロパティ](#properties) セクションを参照してください。

### <a id="preview"></a> プレビュー

以下の画像は、追加の `categoryItemHighlightLayer` で描画された `igDataChart` コントロールのプレビューです。

![](images/jQuery_Item_Highlight_Layer_01.png)



## <a id="properties"></a> プロパティ

#### カテゴリ項目ハイライト レイヤーのサマリー

以下の表で、`categoryItemHighlightLayer` のプロパティを簡単に説明します。

プロパティ名|プロパティ タイプ|説明
---|---|---
bandHighlightWidth|double|このプロパティは、グリッドライン上に配置されたシリーズにおいて項目の強調表示領域の幅を指定します。たとえば、`lineSeries`、`areaSeries` および `splineSeries` です。このプロパティは、グリッドライン間に配置されたシリーズがある場合は影響を及ぼしません。たとえば、`columnSeries` と `waterfallSeries` です。このプロパティに値セットがある場合、縞模様シェイプがグリッドラインの周りに強調表示されます。
highlightType|categoryItemHighlightType|このプロパティは、強調表示の見た目を指定します。デフォルトでは、`lineSeries` などのシリーズにはマーカーを使用し、また `columnSeries` などのシリーズには強調表示縞模様を使用します。
useInterpolation|bool|このプロパティは、強調表示バンドがグリッドラインにスナップするのでなくカーソルにスナップすべきかどうかを指定します。このプロパティは、グリッドライン間に配置されたシリーズがある場合は影響を及ぼしません。たとえば、`columnSeries` シリーズと `waterfallSeries` シリーズです。


## <a id="example"></a> 例

このサンプルは、カテゴリ項目ハイライト レイヤーでカテゴリ軸を使用、その場でバンド図形またはマーカーを描画してシリーズの項目を強調表示します。このサンプル オプション ペインでは、カテゴリ ハイライト レイヤーのプロパティを変更できます。強調表示の色、アウトライン、太さなどの変更が可能です。
  
<div class="embed-sample">
   [カテゴリ項目ハイライト レイヤー](%%SamplesEmbedUrl%%/data-chart/category-item-highlight-layer)
   ![](images/jQuery_Item_Highlight_Layer_01.png)
</div>

## <a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

- [ホバー操作の概要 (igDataChart)](HoverInteractions-Hover-Interactions-Overview.html): このトピックは、利用可能な異なる型のホバー操作レイヤーなど、`igDataChart` コントロール上で利用できるホバー操作について概念的な情報を提供します。

- [ホバー操作プロパティ参照 (igDataChart)](HoverInteractions-Common-Properties.html): このトピックは、ホバー操作機能が、`series` クラスから継承したツールチップの相互作用を強調表示、ホバリングおよび相互作用するために使用するプロパティおよびメソッドについての情報を提供します。

- [カテゴリ ハイライト レイヤーの構成 (igDataChart)](HoverInteractions-Category-Highlight-Layer.html): このトピックは、ホバー操作に使用されるカテゴリ ハイライト レイヤーについての情報を提供します。カテゴリ ハイライト レイヤーのプロパティについて説明し、実装例を示します。

- [カテゴリ ツールチップ レイヤーの構成 (igDataChart)](HoverInteractions-Category-Tooltip-Layer.html): このトピックは、ホバー操作に使用されるカテゴリ ツールチップ レイヤーについての情報を提供します。カテゴリ ツールチップ レイヤーのプロパティについて説明し、実装例を提供します。

- [項目ツールチップ レイヤーの構成 (igDataChart)](HoverInteractions-Item-Tooltip-Layer.html): このトピックは、ホバー操作に使用される項目ツールチップ レイヤーについての情報を提供します。項目ツールチップ レイヤーのプロパティについて説明し、実装例も提供します。

- [十字線レイヤーの構成 (igDataChart)](HoverInteractions-Crosshair-Layer.html): このトピックは、ホバー操作に使用される十字線レイヤーについての情報を提供します。十字線のプロパティについて説明し、実装例を示します。


### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [ホバー操作 - カテゴリ ハイライト レイヤー](HoverInteractions-Category-Highlight-Layer.html#example): このサンプルは、`igDataChart`™ コントロールで 1 つまたはすべてのカテゴリ軸を対象としたカテゴリ ハイライト レイヤーを紹介します。このサンプル オプション ペインでは、カテゴリ ハイライト レイヤーのプロパティを変更できます。強調表示の色、アウトライン、太さなどの変更が可能です。

- [ホバー操作 - カテゴリ ツールチップ レイヤー](HoverInteractions-Category-Tooltip-Layer.html#example): このサンプルでは、カテゴリ軸を使用するシリーズのグループ化されたツールチップを表示するカテゴリ ツールチップ レイヤを紹介します。このサンプル オプション ペインでは、ツールチップの位置の変更など、レイヤーのプロパティを編集できます。

- [ホバー操作 - 項目ツールチップ レイヤー](HoverInteractions-Item-Tooltip-Layer.html#example): このサンプルは、各ターゲット シリーズにツールチップを表示する項目ツールチップ レイヤーを紹介します。このサンプル オプション ペインでは、トランジション期間の変更など、レイヤー プロパティを編集できます。

- [ホバー操作 - 十字線レイヤー](HoverInteractions-Crosshair-Layer.html#example): このサンプルは、ターゲットとする各シリーズの実際の値で交差する、十字線を提供する十字線レイヤーを紹介します。このサンプル オプション ペインでは、十字線の太さの変更など、レイヤー プロパティを編集できます。

- [ホバー操作 - 複数レイヤー](%%SamplesUrl%%/data-chart/multiple-layers): このサンプルは、`igDataChart` コントロール内での複数レイヤーの相互作用を紹介します。このサンプルでは、項目ツールチップ レイヤー、十字線レイヤー、およびカテゴリ ハイライト レイヤーを表示します。



 

 



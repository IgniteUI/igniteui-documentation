<!--
|metadata|
{
    "fileName": "hoverinteractions-hover-interactions-overview",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# ホバー操作の概要 (igDataChart)

#### 目的

このトピックは、利用可能な異なる型のホバー操作レイヤーなど、`igDataChart` コントロール上で利用できるホバー操作について概念的な情報を提供します。

#### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igDataChart の追加](igDataChart-Adding.html): このトピックでは、`igDataChart`™ コントロールをページに追加し、データにバインドする方法を紹介します。

- [igDataChart をデータにバインド](igDataChart-DataBinding.html): このトピックでは、`igDataChart`™ コントロールを各種データ ソース (JavaScript 配列、`IQueryable<T>`、Web サービス) にバインドする方法について説明します。


#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#overview)
-   [共通のプロパティ](#common-properties)
-   [レイヤーのタイプ](#types-of-layers)
    -   [十字線レイヤー](#crosshair-layer)
    -   [カテゴリ ハイライト レイヤー](#category-highlight-layer)
    -   [カテゴリ項目 ハイライト　レイヤー](#category-item-highlight-layer)
    -   [カテゴリ ツールチップ レイヤー](#category-tooltip-layer)
    -   [項目ツールチップ レイヤー](#item-tooltip-layer)
	-   [最終値レイヤー](#final-value-layer)
    -   [コールアウト レイヤー](#callout-layer)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)
	

	
## <a id="overview"></a> 概要

#### ホバー 操作のサマリー

ホバー操作は、シリーズ コレクションに追加されるシリーズであるホバー操作レイヤーを介して実装されます。これらのレイヤーはカーソルの位置に依存します。ホバー操作レイヤーを `igDataChart` コントロールに追加すると、十字線およびツールチップまたはいずれか一方のデフォルト ビヘイビアが無効になります (追加されるレイヤーのタイプによって異なります)。

デフォルトのビヘイビアーは、ホバー操作レイヤーのカーソルを動かすときの組み込みビヘイビアーと視覚的な機能が似ているため無効にします。しかしこのビヘイビアは上書きし、ホバー操作レイヤーの機能に加えてデフォルトの十字線機能を実行できるようにできます。また、一度に 1 つのツールチップ レイヤーで 1 つのシリーズのみが対象になります。1 つのシリーズで複数のヒントレイヤーを目標にすると、ヒントを使用するホバー操作レイヤーは期待通りに動作しなくなります。シリーズに対してツールチップを複数の場所で使用することはできません。

以下のスクリーンショットは、カテゴリ強調表示レイヤー、十字線レイヤー、および品目ツールチップ レイヤーが実装された `igDataChart` コントロールを示しています。

![](images/jQuery_Multiple_Layers_01.png)


## <a id="common-properties"></a> 共通のプロパティ

#### 共通のプロパティおよびメソッドの概要

ホーバー操作レイヤーは `Series` オブジェクトから継承するため、`Series` 基本クラスで利用可能な多くのプロパティおよびメソッドを取得します。しかし、`Series` クラスからのすべてがホバー操作レイヤーで意味をなすわけではありません。たとえば、ホバー操作レイヤーはマウスと対話するようには設計されておらずヒットでテストできません。従って、マウス関連のイベントは起動されません。

共通のプロパティおよびメソッドの詳細は、[ホバー操作プロパティ参照 (igDataChart)](HoverInteractions-Common-Properties.html) のトピックを参照してください。



## <a id="types-of-layers"></a> レイヤーのタイプ

#### 概要

現在、`igDataChart` コントロールで利用可能なホバー操作レイヤーは 5 種類あります。これらのホバー操作レイヤーのそれぞれが、異なる強調表示、ホバーおよびツールチップの操作を個別に、または組み合わせて提供し、強力なホバー操作を実現します。

以下で、`igDataChart` コントロールで利用可能な各レイヤー タイプを簡単に説明します。

### <a id="crosshair-layer"></a> 十字線レイヤー

`crosshairLayer` は、対象となる各シリーズの実際の値に合った十字線を提供します。

![](images/jQuery_Crosshair_Layer_01.png)

詳細は、[十字線レイヤー (igDataChart)](HoverInteractions-Crosshair-Layer.html) のトピックを参照してください。

### <a id="category-highlight-layer"></a> カテゴリ強調表示レイヤー

`categoryHighlightLayer` は、`igDataChart` コントロール内の 1 つまたはすべてのカテゴリ軸を対象にしています。カーソル位置に最も近い軸のエリアを照らすシェイプを描画します。

![](images/jQuery_Category_Highlight_Layer_01.png)

詳細は、[十字線レイヤーの構成 (igDataChart)](HoverInteractions-Category-Highlight-Layer.html) のトピックを参照してください。

### <a id="category-item-highlight-layer"></a> カテゴリ項目強調表示レイヤー

`categoryItemHighlightLayer` レイヤーは、その位置で縞模様シェイプまたはマーカーを描画することにより、カテゴリ軸を使用するシリーズ内の項目を強調表示します。

![](images/jQuery_Item_Highlight_Layer_01.png)

詳細は、[カテゴリ項目強調表示レイヤーの構成 (igDataChart)](HoverInteractions-Category-Item-Highlight-Layer.html) のトピックを参照してください。

### <a id="category-tooltip-layer"></a> カテゴリ ツールチップ レイヤー

`categoryTooltipLayer` は、カテゴリ軸を使用するシリーズ用にグループ化されたツールチップを表示します。

![](images/jQuery_Category_Tooltip_Layer_01.png)

詳細は、[カテゴリ ツールチップ レイヤーの構成 (igDataChart)](HoverInteractions-Category-Tooltip-Layer.html) のトピックを参照してください。

### <a id="item-tooltip-layer"></a> 項目ツールチップ レイヤー

`itemTooltipLayer` は、対象となるすべてのシリーズに対して個別にツールチップを表示します。

![](images/jQuery_Item_Tooltip_Layer_01.png)

詳細は、[項目ツールチップ レイヤーの構成 (igDataChart)](HoverInteractions-Item-Tooltip-Layer.html) のトピックを参照してください。

### <a id="final-value-layer"></a> 最終値レイヤー

`finalValueLayer` は、チャートでシリーズの現在の (最終) 値を表す注釈を表示します。

![](../04_Configuring/04_Hover Interactions/images/jQuery_Final_Value_Layer_01.png)

詳細は、[最終値レイヤーの構成 (igDataChart)](HoverInteractions-Final-Value-Layer.html) のトピックを参照してください。

### <a id="callout-layer"></a> コールアウト レイヤー

`calloutLayer` はチャート既存または新しいデータの注釈を表示します。

![](../04_Configuring/04_Hover Interactions/images/jQuery_Callout_Layer_01.png)

詳細は、[コールアウト レイヤー (igDataChart)](HoverInteractions-Callout-Layer.html) のトピックを参照してください。


## <a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

- [ホバー操作の概要 (igDataChart)](HoverInteractions-Hover-Interactions-Overview.html): このトピックは、利用可能な異なる型のホバー操作レイヤーなど、`igDataChart` コントロール上で利用できるホバー操作について概念的な情報を提供します。

- [ホバー操作プロパティ参照 (igDataChart)](HoverInteractions-Common-Properties.html): このトピックは、ホバー操作機能が、`series` クラスから継承したツールチップの相互作用を強調表示、ホバリングおよび相互作用するために使用するプロパティおよびメソッドについての情報を提供します。

- [十字線レイヤーの構成 (igDataChart)](HoverInteractions-Crosshair-Layer.html): このトピックは、ホバー操作に使用される十字線レイヤーについての情報を提供します。十字線のプロパティについて説明し、実装例を示します。

- [カテゴリ強調表示レイヤーの構成 (igDataChart)](HoverInteractions-Category-Highlight-Layer.html): このトピックは、ホバー操作に使用されるカテゴリ強調表示レイヤーについての情報を提供します。カテゴリ強調表示レイヤーのプロパティについて説明し、実装例を示します。

- [カテゴリ項目強調表示レイヤーの構成 (igDataChart)](HoverInteractions-Category-Item-Highlight-Layer.html): このトピックは、ホバー操作に使用されるカテゴリ項目強調表示レイヤーについての情報を提供します。カテゴリ項目強調表示レイヤーのプロパティについて説明し、実装例を示します。

- [カテゴリ ツールチップ レイヤーの構成 (igDataChart)](HoverInteractions-Category-Tooltip-Layer.html): このトピックは、ホバー操作に使用されるカテゴリ ツールチップ レイヤーについての情報を提供します。カテゴリ ツールチップ レイヤーのプロパティについて説明し、実装例を提供します。

- [項目ツールチップ レイヤーの構成 (igDataChart)](HoverInteractions-Item-Tooltip-Layer.html): このトピックは、ホバー操作に使用される項目ツールチップ レイヤーについての情報を提供します。項目ツールチップ レイヤーのプロパティについて説明し、実装例も提供します。


### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [ホバー操作 - 十字線レイヤー](HoverInteractions-Crosshair-Layer.html#example): このサンプルは、ターゲットとする実際の値に一致する十字線を提供する十字線レイヤーを紹介します。このサンプル オプション ペインでは、十字線の太さの変更など、レイヤー プロパティを編集できます。

- [ホバー操作 - カテゴリ強調表示レイヤー](HoverInteractions-Category-Highlight-Layer.html#example): このサンプルは、`igDataChart`™ コントロールで単一/複数のカテゴリ軸をターゲットにしたカテゴリ強調表示レイヤーを紹介します。このサンプル オプション ペインでは、カテゴリ強調表示レイヤーのプロパティを変更できます。強調表示の色、アウトライン、太さなどの変更が可能です。

- [ホバー操作 - カテゴリ項目の強調表示レイヤー](HoverInteractions-Category-Item-Highlight-Layer.html#example): このサンプルは、カテゴリ項目強調表示レイヤーでカテゴリ軸を使用、その場でバンド図形またはマーカーを描画してシリーズの項目を強調表示します。このサンプル オプション ペインでは、カテゴリ強調表示レイヤーのプロパティを変更できます。強調表示の色、アウトライン、太さなどの変更が可能です。

- [ホバー操作 - カテゴリ ツールチップ レイヤー](HoverInteractions-Category-Tooltip-Layer.html#example): このサンプルは、カテゴリ軸を使用してグループ化されたツールチップを表示するカテゴリ ツール チップ レイヤーを紹介します。このサンプル オプション ペインでは、ツールチップの位置の変更など、レイヤーのプロパティを編集できます。

- [ホバー操作 - 項目ツールチップ レイヤー](HoverInteractions-Item-Tooltip-Layer.html#example): このサンプルは、すべてのターゲット シリーズに項目ツールチップ レイヤーを表示するツールチップ レイヤーを紹介します。 このサンプル オプション ペインでは、トランジション期間の変更など、レイヤー プロパティを編集できます。

- [ホバー操作 - 複数レイヤー](%%SamplesUrl%%/data-chart/multiple-layers): このサンプルは、`igDataChart` コントロール内での複数レイヤーの相互作用を紹介します。このサンプルでは、項目ツールチップ レイヤー、十字線レイヤー、およびカテゴリ強調表示レイヤーを表示します。





 

 



<!--
|metadata|
{
    "fileName": "igdatachart-configuring-navigation-features",
    "controlName": "igDataChart",
    "tags": ["Charting","How Do I","Navigation"]
}
|metadata|
-->

# ナビゲーション機能の構成 (igDataChart)



##トピックの概要

### 目的

このトピックでは、コード例と共に、`igDataChart`™ コントロールのナビゲーション機能を構成する方法と、その API を使用してチャートの表示部分の位置およびサイズを定義する方法を示します。

### 前提条件

本トピックの理解を深めるために、以下のトピックを参照することをお勧めします。

-	[](igDataChart-Overview.html)[igDataChart の概要](igDataChart-Overview.html): このトピックでは、`igDataChart` コントロールについての概念情報を提供します。これには、その主な機能、チャートとユーザー機能を使用するための最低要件が含まれます。

-	[](igDataChart-Adding.html)[igDataChart](igDataChart-Adding.html) の追加: このトピックでは、`igDataChart` コントロールをページに追加し、データにバインドする方法を紹介します。

-	[igDataChart をデータにバインド](igDataChart-DataBinding.html): このトピックでは、`igDataChart` コントロールを各種データ ソース (JavaScript 配列、`IQueryable<T>`、Web サービス) にバインドする方法を紹介します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [ナビゲーション機能の構成の概要](#navigation)
-   [コード例](#example)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)



##<a id="introduction"></a>概要


### <a id="navigation"></a>ナビゲーション機能の概要

`igDataChart` コントロールは、広範なナビゲーション機能のセットと、そうした機能を各種コードで使用するためのオプションやメソッドを備えています。

Overview Plus Detail (OPD) パネルを有効にすると、このパネルはチャートの右下隅に現れることになります。このパネルの中には、チャート全体のサムネイルが表示され、ズーム操作用のボタン類とスライダーが含まれます。さらに、このパネル内で現在のビューの枠をドラッグして別の地域に移動させることもできるようになっています。

ユーザーは、マウス スクロールまたは [Page Up]/[Page Down] キーでズームアウト/ズームイン操作、マウス ドラッグまたはタッチ アンド ドラッグでパン操作を実行でき、他のナビゲーション操作はすべてオプションの設定によって制御されます。すべてのインタラクティブ機能のリファレンスについては、[igDataChart の概要: ユーザー操作とユーザー補助機能](igDataChart-Overview#user-interaction)を参照してください。

`igDataChart` のオプションやメソッドを使用することにより、開発者は、ユーザーによる別の領域への移動操作に伴って現在のチャート位置の設定や現在ビューの座標の取得をさまざまな方法で実装できます。開発者は、初期化時に表示する具体的なビューを指定しておくことも、ユーザー入力や動的操作に応じてランタイムで既定のビューを変更することもできます。



##ナビゲーション機能の構成の概要


### ナビゲーション機能の構成に関する要点チャート

次の表は、ナビゲーション機能に関して `igDataChart` コントロールで構成可能な項目をまとめたものです。

構成可能な項目|詳細|プロパティ
---|---|---
OPD パネルの表示/非表示|既定では、OPD パネルは表示されません。OPD パネルを表示するように構成した場合、このパネルはチャートの右下隅に表示されることになります。|JavaScript の場合:<li>[overviewPlusDetailPaneVisibility](%%jQueryApiUrl%%/ui.igDataChart#options:overviewPlusDetailPaneVisibility)<br>ASP.NET MVC の場合:<li>[OverviewPlusDetailPaneVisibility()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~OverviewPlusDetailPaneVisibility.html)
既定の操作|既定では、パン操作は行えず、ズーム操作が既定のドラッグ操作になっています。パン操作を既定のドラッグ操作に設定しておくこともできます。|JavaScript の場合:<li>[defaultInteraction](%%jQueryApiUrl%%/ui.igDataChart#options:defaultInteraction)<br>ASP.NET MVC の場合:<li>[DefaultInteraction()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~DefaultInteraction.html)
パン操作の修飾キー|パン操作が既定の操作でない場合に使用する修飾キーです。|JavaScript の場合:<li>[panModifier](%%jQueryApiUrl%%/ui.igDataChart#options:panModifier)<br>ASP.NET MVC の場合<li>[PanModifier()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~PanModifier.html)
ズーム操作の修飾キー|ズーム操作が既定の操作でない場合に使用する修飾キーです。既定では、[Ctrl] キーを押すとズームに切り替わります。|JavaScript の場合<li>[dragModifier](%%jQueryApiUrl%%/ui.igDataChart#options:dragModifier)<br>ASP.NET MVC の場合:<li>[DragModifier()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~DragModifier.html)
ズーム|垂直および水平ズーム (そのいずれか) を個別にまたは同時に有効または無効にできます。|JavaScript の場合:<li>[horizontalZoomable](%%jQueryApiUrl%%/ui.igDataChart#options:horizontalZoomable)<br><li>[verticalZoomable](%%jQueryApiUrl%%/ui.igDataChart#options:verticalZoomable)<br>ASP.NET MVC の場合:<li>[HorizontalZoomable()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~HorizontalZoomable.html)<br><li>[VerticalZoomable()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~VerticalZoomable.html)
チャートの表示部分の設定|表示するチャートの表示部分の座標とサイズを設定します。|JavaScript の場合:<li>[windowRect](%%jQueryApiUrl%%/ui.igDataChart#options:windowRect)<br>ASP.NET MVC の場合:<li>[WindowRect()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~WindowRect.html)

##<a id="example"></a>コード例

このサンプルでは、jQuery チャートのさまざまなナビゲーション方法を紹介します。コントロールのコンテンツを組み込みキーボード ナビゲーション (矢印キー、Page Up/Down、Home キー)、組み込みマウス ナビゲーション (Shift キー + マウス ドラッグ、マウス スクロール、マウス ダウン + マウス ドラッグ)、概要と詳細ペイン、またはコード ビハインドでコントロールのウィンドウ位置およびスケール プロパティによってパンニングやズームができます。

<div class="embed-sample">
   [チャート ナビゲーション](%%SamplesEmbedUrl%%/data-chart/chart-navigation)
</div>


##<a id="related-content"></a>関連コンテンツ


###<a id="topics"></a> トピック

このトピックに関連する追加情報については、以下のトピックを参照してください。

-	[構成可能な視覚要素 (igDataChart)](igDataChart-Visual-Elements.html): このトピックでは、`igDataChart` コントロールとそれらを管理するプロパティの構成可能なすべての視覚要素の一覧を示します。

-	[シリーズ タイプ (igDataChart)](igDataChart-Series-Types.html): このトピックでは、`igDataChart` コントロールにより生成できるあらゆる種類のチャートを表示します。

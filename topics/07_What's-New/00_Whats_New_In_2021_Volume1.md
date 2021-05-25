<!--
|metadata|
{
    "fileName": "whats-new-in-2021-volume1",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# 2021 Volume 1 の新機能

このトピックは、%%ProductFamilyName%%™ 2021 Volume 1 リリースの新機能について説明します。

## チャート機能

このリリースでは、すべてのチャート コンポーネント、例えば、データ チャート、カテゴリ チャート、およびファイナンシャル チャートに、いくつかの新しく改善されたビジュアル デザインと構成オプションが導入されています。

### チャート デフォルト値のデザイン更新 (i.e.1-6):

* すべてのチャートのシリーズ/マーカーの新しい色パレット

![](images/chartDefaults1.png)  | ![](images/chartDefaults2.png)
------------- | -------------
![](images/chartDefaults3.png)  | ![](images/chartDefaults4.png)


* 棒/縦棒/ウォーターフォール シリーズを、角が丸いのではなく角が四角になるように変更しました。 

* 散布高密度シリーズの最小/最大ヒート プロパティの色を変更しました。 

* ファイナンシャル/ウォーターフォール シリーズのビジュアルの負の塗りつぶしの色を変更しました。

* マーカーの厚さを 1 pxから 2 pxに変更しました。

* PointSeries、BubbleSeries、ScatterSeries、PolarScatterSeries のマーカーのアウトラインに一致するようにマーカーの塗りつぶしを変更しました。 

[`MarkerFillMode`](%%jQueryApiUrl%%/ui.igDataChart#options:markerFillMode) プロパティを Normal に設定すると、この変更を元に戻すことができます。

* TimeXAxis および OrdinalTimeXAxis のラベリングを圧縮しました。 

* 新しいマーカー プロパティ:

    - [`MarkerFillMode`](%%jQueryApiUrl%%/ui.igDataChart#options:markerFillMode) - マーカーがアウトラインに依存するように、'MatchMarkerOutline' に設定できます。
    - [`MarkerFillOpacity`](%%jQueryApiUrl%%/ui.igDataChart#options:markerFillOpacity) - 0〜1 の値に設定できます。
    - [`MarkerOutlineMode`](%%jQueryApiUrl%%/ui.igDataChart#options:markerOutlineMode) - マーカーのアウトラインが塗りブラシの色に依存するように、'MatchMarkerBrush' に設定できます。

* 新シリーズ [`OutlineMode`](%%jQueryApiUrl%%/ui.igDataChart#options:series.outlineMode) プロパティ:

シリーズ アウトラインの表示を切り替えるように設定できます。データ チャートの場合、プロパティはシリーズ上にあることに注意してください。

* 新しいプロット エリア マージン プロパティ:

    The plot area margin properties define the bleed over area introduced into the viewport when the chart is at the default zoom level. A common use case is to provide space between the axes and first/last data points. Note, the [`ComputedPlotAreaMarginMode`](%%jQueryApiUrl%%/ui.igDataChart#options:computedPlotAreaMarginMode), listed below, will automatically set the margin when markers are enabled. The others are designed to specify a `Number` to represent the thickness, where PlotAreaMarginLeft etc. adjusts the space to all four sides of the chart. These new properties were added:

    - [`PlotAreaMarginLeft`](%%jQueryApiUrl%%/ui.igDataChart#options:plotAreaMarginLeft)
    - [`PlotAreaMarginTop`](%%jQueryApiUrl%%/ui.igDataChart#options:plotAreaMarginTop)
    - [`PlotAreaMarginRight`](%%jQueryApiUrl%%/ui.igDataChart#options:plotAreaMarginRight)
    - [`PlotAreaMarginBottom`](%%jQueryApiUrl%%/ui.igDataChart#options:plotAreaMarginBottom)
    - [`ComputedPlotAreaMarginMode`](%%jQueryApiUrl%%/ui.igDataChart#options:computedPlotAreaMarginMode)

* 新しい強調表示プロパティ:

シリーズの強調表示にいくつかの構成が追加されました。以前のリリースでは、強調表示はホバー時にフェードするように制限されていました。これらの新しいプロパティが追加されました:

- [`HighlightingMode`](%%jQueryApiUrl%%/ui.igDataChart#options:highlightingMode) - ホバーされたシリーズとホバーされていないシリーズをフェードまたは明るくするかを設定します。
- [`HighlightingBehavior`](%%jQueryApiUrl%%/ui.igDataChart#options:highlightingBehavior) - 真上または最も近い項目など、マウスの位置に応じてシリーズを強調表示するかどうかを設定します。

* 次のシリーズの強調表示を追加しました:

- 積層型
- 散布図
- 極座標
- ラジアル 
- 図形

* 次のシリーズに注釈レイヤーを追加しました:

- 積層型
- 散布図
- 極座標
- ラジアル
- 図形

* 積層型シリーズ内の個々の積層フラグメントのデータ ソースをオーバーライドするためのサポートが追加されました。

* 積層型、散布、範囲、極座標、ラジアル、シェイプ シリーズにカスタム スタイルのイベントを追加しました。

* 表示された最初のラベルに基づいてチャートの水平マージンを自動的に拡張するサポートが追加されました。 

### チャート凡例の機能:

* [`LegendHighlightingMode`](%%jQueryApiUrl%%/ui.igDataChart#options:legendHighlightingMode) - 凡例項目にカーソルを合わせると、シリーズの強調表示が有効になります。

### 地理マップの機能 (CTP):

* マップの表示を折り返すためのサポートが追加されました (水平方向に無限にスクロールできます)。  

* 座標原点を折り返しながら、一部のマップ シリーズの表示をシフトするためのサポートが追加されました。  

* シェイプ シリーズの強調表示のサポートが追加されました。 

* シェイプ シリーズの強調表示のサポートが追加されました。 

<!--TODO ADD CONTENTS - sample structure from 20-2 below

### %%ProductNameASPNETCore%%
<Infragistics %%ProductNameASPNETCore%% now supports ASP.NET Core for .NET 5 projects. For more information see the [Using %%ProductNameASPNETCore%%](Using-IgniteUI-Controls-in-ASP.NET-Core-project.html) topic.


### %%ProductNameASPNETCore%% Tag Helpers
%%ProductNameASPNETCore%% Tag Helpers now support ASP.NET Core for .NET 5 projects. For more information see the [Using %%ProductNameASPNETCore%% Tag Helpers](using-ignite-ui-tag-helpers.html) topic.


### Infragistics Documents
Infragistics Documents assemblies are now available for ASP.NET Core for .NET 5 projects.-->

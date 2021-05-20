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

1. すべてのチャートのシリーズ/マーカーの新しい色パレット

![](images/chartDefaults1.png)  | ![](images/chartDefaults2.png)
------------- | -------------
![](images/chartDefaults3.png)  | ![](images/chartDefaults4.png)


2. 棒/縦棒/ウォーターフォール シリーズを、角が丸いのではなく角が四角になるように変更しました。 

3. 散布高密度シリーズの最小/最大ヒート プロパティの色を変更しました。 

4. ファイナンシャル/ウォーターフォール シリーズのビジュアルの負の塗りつぶしの色を変更しました。

5. マーカーの厚さを 1 pxから 2 pxに変更しました。

6. PointSeries、BubbleSeries、ScatterSeries、PolarScatterSeries のマーカーのアウトラインに一致するようにマーカーの塗りつぶしを変更しました。 

[`MarkerFillMode`](%%jQueryApiUrl%%/ui.igDataChart#options:MarkerFillMode) プロパティを Normal に設定すると、この変更を元に戻すことができます。

7. TimeXAxis および OrdinalTimeXAxis のラベリングを圧縮しました。 

8. 新しいマーカー プロパティ:

- [`MarkerFillMode`](%%jQueryApiUrl%%/ui.igDataChart#options:MarkerFillMode) - マーカーがアウトラインに依存するように、'MatchMarkerOutline' に設定できます。
- [`MarkerFillOpacity`](%%jQueryApiUrl%%/ui.igDataChart#options:MarkerFillOpacity) - 0〜1 の値に設定できます。
- [`MarkerOutlineMode`](%%jQueryApiUrl%%/ui.igDataChart#options:MarkerOutlineMode) - マーカーのアウトラインが塗りブラシの色に依存するように、'MatchMarkerBrush' に設定できます。

9. 新シリーズ [`OutlineMode`](%%jQueryApiUrl%%/ui.igDataChart#options:series.OutlineMode) プロパティ:

シリーズ アウトラインの表示を切り替えるように設定できます。データ チャートの場合、プロパティはシリーズ上にあることに注意してください。

10. 新しいプロット エリア マージン プロパティ:

[`PlotAreaMargin`](%%jQueryApiUrl%%/ui.igDataChart#options:PlotAreaMargin) プロパティは、チャートがデフォルトのズーム レベルにあるときにビューポートに導入されるブリード オーバー領域を定義します。一般的な使用例では、軸と最初/最後のデータ ポイントの間にスペースを提供します。以下にリストされている [`ComputedPlotAreaMarginMode`](%%jQueryApiUrl%%/ui.igDataChart#options:ComputedPlotAreaMarginMode) は、マーカーが有効になっているときに自動的にマージンを設定することに注意してください。その他は特定の厚さを指定するように設計されており、PlotAreaMargin はチャートの上下左右それぞれに厚さを提供します。これらの新しいプロパティが追加されました:

- [`PlotAreaMargin`](%%jQueryApiUrl%%/ui.igDataChart#options:PlotAreaMargin)
- [`PlotAreaMarginLeft`](%%jQueryApiUrl%%/ui.igDataChart#options:PlotAreaMarginLeft)
- [`PlotAreaMarginTop`](%%jQueryApiUrl%%/ui.igDataChart#options:PlotAreaMarginTop)
- [`PlotAreaMarginRight`](%%jQueryApiUrl%%/ui.igDataChart#options:PlotAreaMarginRight)
- [`PlotAreaMarginBottom`](%%jQueryApiUrl%%/ui.igDataChart#options:PlotAreaMarginBottom)
- [`ComputedPlotAreaMarginMode`](%%jQueryApiUrl%%/ui.igDataChart#options:ComputedPlotAreaMarginMode)

11. 新しい強調表示プロパティ:

シリーズの強調表示にいくつかの構成が追加されました。以前のリリースでは、強調表示はホバー時にフェードするように制限されていました。これらの新しいプロパティが追加されました:

- [`HighlightingMode`](%%jQueryApiUrl%%/ui.igDataChart#options:HighlightingMode) - ホバーされたシリーズとホバーされていないシリーズをフェードまたは明るくするかを設定します。
- [`HighlightingBehavior`](%%jQueryApiUrl%%/ui.igDataChart#options:HighlightingBehavior) - 真上または最も近い項目など、マウスの位置に応じてシリーズを強調表示するかどうかを設定します。

12. 次のシリーズの強調表示を追加しました:

- 積層型
- 散布図
- 極座標
- ラジアル 
- 図形

13. 次のシリーズに注釈レイヤーを追加しました:

- 積層型
- 散布図
- 極座標
- ラジアル
- 図形

14. 積層型シリーズ内の個々の積層フラグメントのデータ ソースをオーバーライドするためのサポートが追加されました。

15. 積層型、散布、範囲、極座標、ラジアル、シェイプ シリーズにカスタム スタイルのイベントを追加しました。

16. 垂直ズームをシリーズ コンテンツに自動的に同期するサポートが追加されました。

17. 表示された最初のラベルに基づいてチャートの水平マージンを自動的に拡張するサポートが追加されました。 

### チャート凡例の機能:

1. ItemLegend に水平方向を追加しました。

次のチャート タイプでは、ItemLegend を水平方向で使用できます:

- バブル
- ドーナツ
- 円 

2. [`LegendHighlightingMode`](%%jQueryApiUrl%%/ui.igDataChart#options:LegendHighlightingMode) - 凡例項目にカーソルを合わせると、シリーズの強調表示が有効になります。

### 地理マップの機能 (CTP):

1. マップの表示を折り返すためのサポートが追加されました (水平方向に無限にスクロールできます)。  

2. 座標原点を折り返しながら、一部のマップ シリーズの表示をシフトするためのサポートが追加されました。  

3. シェイプ シリーズの強調表示のサポートが追加されました。 

4. シェイプ シリーズの強調表示のサポートが追加されました。 

<!--TODO ADD CONTENTS - sample structure from 20-2 below

### %%ProductNameASPNETCore%%
<Infragistics %%ProductNameASPNETCore%% now supports ASP.NET Core for .NET 5 projects. For more information see the [Using %%ProductNameASPNETCore%%](Using-IgniteUI-Controls-in-ASP.NET-Core-project.html) topic.


### %%ProductNameASPNETCore%% Tag Helpers
%%ProductNameASPNETCore%% Tag Helpers now support ASP.NET Core for .NET 5 projects. For more information see the [Using %%ProductNameASPNETCore%% Tag Helpers](using-ignite-ui-tag-helpers.html) topic.


### Infragistics Documents
Infragistics Documents assemblies are now available for ASP.NET Core for .NET 5 projects.-->

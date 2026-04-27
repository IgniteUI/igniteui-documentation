<!--
|metadata|
{
    "fileName": "shapechart-overview",
    "controlName": "igShapeChart",
    "tags": ["API", "ShapeChart", "Overview"]
}
|metadata|
-->

# 概要 

### igShapeChart について

igShapeChart は軽量で高パフォーマンスなチャートです。このチャートデータ ビジュアライゼーションは、散布シリーズの表示、更にポリラインや多角形データの可視化もサポートします。チャートはシェープ ファイルまたは X/Y ポイントの配列の配列を使用して定義されるカスタム図形のデータをプロットできます。

チャートはスマート データ アダプターを使用してデータを分析し、適切な可視化で描画します。たとえば、`chartType` を `Auto` に設定し、データセットがポイントの List の List で構成される場合、ポイント チャート、ポリライン チャート、または多角形チャートがプロットされます。  

![](images/shapechart_getting_started.png)

ただし、`chartType` プロパティをサポートされる 9 つの可視化のうちの 1 つに設定してチャート タイプを明示的に指定することもできます。 
- ポイント
- バブル
- エリア
- 等高線
- 高密度
- 折れ線
- スプライン
- ポリライン
- 多角形

また、シェープ チャートは、FixedCost、VariableCost、SalesRevenue、および SalesUnits データ列を持つデータ項目が 1 つあれば損益分岐点データを描画できます。　  

![](images/shapechart-breakeven-01.png)


*関連トピック:* 

- [はじめに](shapechart-getting-started-with-shapechart.html)

- [シェープ ファイル データのバインド](shapechart-binding-to-shapefile-data.html)

- [損益分岐点データのバインド](shapechart-binding-to-break-even-data.html)

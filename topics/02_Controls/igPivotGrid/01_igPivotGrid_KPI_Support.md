<!--
|metadata|
{
    "fileName": "igpivotgrid-kpi-support",
    "controlName": "igOlapXmlaDataSource, igPivotDataSelector, igPivotGrid",
    "tags": ["Application Scenarios","Grids","How Do I"]
}
|metadata|
-->

# KPI (キー パフォーマンス インジケーター) のサポート (igPivotGrid、igPivotDataSelector、igOlapXmlaDataSource)

##トピックの概要

#### 目的

このトピックは、多次元 (OLAP) データ セットからの KPI データが %%ProductName%%™ で視覚化される状態を概念的に説明します。KPI を視覚化する %%ProductName%% コントロールは、`igPivotDataSelector`™ および `igPivotGrid`™ にあります。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な記事を示しています。

-   [KPI](http://en.wikipedia.org/wiki/Key_performance_indicators)

**外部リソース**

- [多次元モデルの KPI](http://technet.microsoft.com/ja-jp/library/ms174875.aspx): 多次元モデルの KPI の概要を紹介する MSDN の記事です。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [KPI 視覚エフェクト のサポート](#kpi-visualization-support)
    -   [KPI 視覚エフェクトの概要](#kpi-visualization)
    -   [KPI の技術的な実装の概要](#kpi-technical-implementation)
    -   [KPI の重要な用語](#kpi-key-terms)
-   [関連コンテンツ](#related-content)
    -   [サンプル](#samples)



## <a id="kpi-visualization-support"></a>KPI 視覚エフェクト のサポート

### <a id="kpi-visualization"></a>KPI 視覚エフェクトの概要

KPI (Key Performance Indicator: キー パフォーマンス インジケーター) とは、パフォーマンス管理の特定のタイプを表す用語です。KPI は個別のニーズ (アプリケーションのフィールド) によって変化し、目標に対する進捗や時間軸での傾向など、組織の重要なメトリックスに関する情報を提供します。

OLAP サービスでは、KPI は特定のメジャー グループについて計算されたデータを使用します。データは、分析サービス データをホストする OLAP サーバーで定義されています。このデータは `igPivotDataSelector` に表示され、`igPivotGrid` コントロールでグラフィックとして視覚化できます。

`igPivotDataSelector` コントロールには、サーバーで計算された KPI メンバーが含まれる別のフォルダーが表示されます。

![](images/igPivotGrid_Key_Performance_Indicators_Support_1.png)

igPivotGrid は、KPI またはその実際の値をグラフィックで表示します。

![](images/igPivotGrid_Key_Performance_Indicators_Support_2.png)

各 KPI は、メタデータ ツリーからピボット グリッドのメジャー領域にドラッグ アンド ドロップする、またはプログラムでメジャー コレクションに追加すると、igPivotGrid で視覚化できます。

### <a id="kpi-technical-implementation"></a>KPI の技術的な実装の概要

`igPivotDataSelector`/`igPivotGrid` の KPI のグラフィック表現および値として描画する機能は、`igOlapXmlaDataSource`™ コンポーネントにより提供されます。(KPI 項目はグラフィック表現での描画および値表示のいずれでも表示できますが、同時に両方の表現で表示することはできません。)

グラフィック表現では、アイコンのような画像で KPI 項目またはそのメタデータ項目の状態を象徴的に表現します。グラフィック表現のグループは、サーバーで定義されています。

コンポーネントへのデータのフィード時に、インジケーターはデフォルトで KPIs という名前のフォルダーの `igPivotDataSelector` に表示されます。データ セレクターのツリーに表示される KPI サブフォルダーの階層は、サーバーから提供されたメタデータ情報により構築されます。

各 KPI 項目には、以下のメタデータ項目が含まれています。

-   値
-   目的
-   状態
-   トレンド
-   ウェイト

KPI メタ項目が `igPivotGrid` に表示される方法は、サーバーで定義されたグラフィック タイプに応じて決定されます。

### <a id="kpi-key-terms"></a>KPI の重要な用語

KPI は、 (以下の画像の 1) という名前のルート項目フォルダー  および基本ディレクトリの下に一覧表示される各 KPI 項目 (2) の `igPivotGrid` のデータ セレクターに表示されます。さまざまな KPI メンバー項目 (3) は、それぞれの親 KPI 項目の下にあります。

![](images/igPivotGrid_Key_Performance_Indicators_Support_3.png)

メジャー アイコン (以下の画像の 4) は、値または目標のための KPI メンバーを示すために使用されます (メンバーがメジャーのみで評価される場合)。メジャー名 (5) は、項目タイプを示すラベルの後ろの括弧内に表示されます。

![](images/igPivotGrid_Key_Performance_Indicators_Support_4.png)



## <a id="related-content"></a>関連コンテンツ

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [XMLA データ ソースにバインド](%%SamplesUrl%%/pivot-grid/binding-to-xmla-data-source): このサンプルでは、`igPivotGrid` を `igOlapXmlaDataSource` にバインドし、選択のために `igPivotDataSelector` を使用します。2014 年 1 月以降のリリースでは、`igPivotGrid` は OLAP キューブからの KPI の視覚化をサポートします。





 

 



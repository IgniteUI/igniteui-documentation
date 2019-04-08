<!--
|metadata|
{
    "fileName": "whats-new-in-2014-volume1",
    "controlName": "",
    "tags": ["FAQ","Getting Started"]
}
|metadata|
-->

# 2014 Volume 1 の新機能

## トピックの概要
### 目的

このトピックでは、%%ProductName%%™ 2014 Volume 1 リリースのコントロールと新機能および拡張機能を紹介します。


## 新機能の概要
### 新機能の概要表

以下の表は 2014 Volume 1 の新機能の概要を提供します。詳細については、概要表の後をご覧ください。

### 全般

機能|説明
---|---
[新しい Visual Studio テンプレート](#new-vs-template)|Microsoft® Visual Studio® のファイル > 新しいプロジェクト ダイアログで新しい Infragistics テンプレートを提供します。
[新しいテーマ (CTP)](#new-theme)|iOS 7 という名称の新しいテーマが追加されています。このテーマは、アップルの iOS 7 のデザインをモデルにしています。



### igDataChart

機能|説明
---|---
[新しいデフォルトのスタイル](#igdatachart-new-default-style)|このスタイルは、チャートをさらに洗練された印象にするための、さまざまな視覚効果を変更する機能があります。



### igColorPicker

機能|説明
---|---
[新規コントロール (CTP)](#igcolorpicker-new-control)|`igColorPicker`™ コントロールでは、定義済みのカラーの選択、またはカスタム カラー パレットの定義ができます。



### igGrid

機能|説明
---|---
[列固定と非表示列](#column-fixing-hidden-columns)|グリッドで固定列と非表示列の両方を持つことができます。
[機能状態の保持](#feature-persistence)|機能状態の保持とは、再バインド間でグリッド機能の状態を保持することを意味します。
[タッチ デバイスの行削除の向上](#improved-delete-row-mobile)|タッチ対応デバイスで行を削除するユーザー エクスペリエンスが向上しました。



### igHierarchicalGrid

機能|説明
---|---
[機能状態の保持](#ighierarchicalgrid-feature-persistence)|機能状態の保持とは、再バインドの間に階層グリッド機能の状態を保持することを意味します。
[タッチ デバイスの行削除の向上](#ighierarchicalgrid-improved-delete-row-mobile)|タッチ対応デバイスで行を削除するユーザー エクスペリエンスが向上しました。



### igHtmlEditor

機能|説明
---|---
[新しいデフォルトのスタイル](#htmleditor-default-style)|ツールバーとボタンの新しいルック アンド フィールです。



### igPivotGrid、igPivotDataSelector、igOlapXmlaDataSource

機能|説明
---|---
[KPI サポート](#kpi-support)|`igOlapXmlaDataSource`™ に、キューブに定義された KPI を表示する組み込みサポートが提供されました。データ ソースから提供された KPI は、`igPivotDataSelector`™ および `igPivotGrid`™ で視覚化されます。
[リモート ADOMD.NET データ プロバイダーのサポート](#remote-adomnet-data-provider)|`igOlapXmlaDataSource` により、SSAS サーバーの通信で ADOMD.NET を使用するもう 1 つのリモート構成もサポートされています。



### igPopover

機能|説明
---|---
[新規コントロール (RTM)](#igpopover-newcontrol)|`igPopover`™ コントロール (現在は、RTM) は、ツールチップに似た機能を DOM 要素に追加します。



### igRadialMenu

機能|説明
---|---
[新規コントロール (RTM)](#igradialmenu-new-control)|`igRadialMenu`™ コントロールは、中央ボタンの周りに項目を円形の配置で表示するコンテキスト メニューです。



### igSplitButton

機能|説明
---|---
[新規コントロール (CTP)](#igsplitter-new-control)|`igSplitButton` は、プライマリ ボタンにバインドするデフォルト値の選択、またはドロップダウン リストに表示されたリストからセカンダリ ボタンにバインドする値の選択ができるドロップダウン ボタンです。ボタンにデフォルトの操作/コマンドを提供すると同時に、補助的なオプションも提供したい場合に便利です。



### igToolbar

機能|説明
---|---
[新規コントロール (CTP)](#igtoolbar)|`igToolbar`™ コントロールにより、`igHtmlEditor`™ のカスタム ツールバーのようなツールバーを作成できます。



### igUpload

機能|説明
---|---
[Web Farm / Web Garden のサポート](#igupload-support-web-gardens)|`igUpload`™ コントロールが、Web Farm / Web Garden Internet Information Services (IIS) 構成をサポートするようになりました。



## 全般
### <a id="new-vs-template"></a>新しい Visual Studio テンプレート

Visual Studio 2012 以後のバージョンでファイル > 新しいプロジェクト ダイアログから新しい Infragistics テンプレートをダウンロードできます。このテンプレートを使用することで高度な機能、デザイン、スタイルを持つアプリケーションの作成作業をすぐに開始できます。

各テンプレートでヘルプが提供されます。複数のアプリケーション シナリオに合わせるために Infragistics テンプレート ギャラリーにテンプレートを追加する予定があります。

![](images/Whats_New_Project_Dialog.png)

注: %%ProductName%% の以前のバージョンで、テンプレートが製品インストーラーによってインストールされます。テンプレートは Infragistics テンプレート ギャラリーからアクセスできるようになりました。

### <a id="new-theme"></a>新しいテーマ (CTP)

iOS 7 という名称の新しいテーマが追加されています。このテーマは、アップルの iOS 7 のデザインをモデルにしています。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_16.png)

#### 関連サンプル

-   [iOS 7 テーマ](%%SamplesUrl%%/themes/ios)



## チャートの共通機能
### <a id="igdatachart-new-default-style"></a>新しいデフォルトのスタイル

新しいデフォルトのスタイルがチャート コントロールに適用され、より洗練された外観のチャートが作成できます。(必要に応じて、`legacy.css` スタイル ファイル を使用する従来のデフォルトのスタイルに、チャート コントロールを戻すこともできます。)

古いデフォルトのスタイル

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_1.png)



新しいデフォルトのスタイル

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_2.png)



### サポートされるコントロール

-   igDataChart
-   igDoughnutChart
-   igFunnelChart
-   igPieChart

#### 関連トピック

-   [新しいデフォルトのスタイル](igDataChart-New-Default-Style.html)



## <a id="igcolorpicker-new-control"></a>igColorPicker
### 新規コントロール (CTP)

`igColorPicker` コントロールでは、事前定義されたカラーの選択、またはカスタム カラー パレットを定義できます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_3.png)



## igGrid
### <a id="column-fixing-hidden-columns"></a>列固定と非表示列

グリッドで固定列と非表示列の両方を持つことができます。(列固定機能が列非表示機能と統合されています。)

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_4.png)

### <a id="feature-persistence"></a>機能状態の保持

機能状態の保持とは、再バインド間でグリッド機能の状態を保持することを意味します。

### サポートされる機能

-   フィルタリング
-   Groupby
-   RowSelectors
-   選択
-   並べ替え

新しいプロパティの [persist](%%jQueryApiUrl%%/ui.iggridsorting#options) が、これらの機能に追加されました。機能状態の保持はデフォルトで有効です。

### 関連トピック

-   [選択の概要](igGrid-Selection-Overview.html)
-   [列のグループ化の概要](igGrid-GroupBy-Overview.html)
-   [フィルタリング](igGrid-Filtering.html)
-   [並べ替え概要](igGrid-Sorting-Overview.html)

#### 関連サンプル

-   [機能の永続化](%%SamplesUrl%%/grid/feature-persistence)

### <a id="improved-delete-row-mobile"></a>タッチ デバイスの行削除の向上

タッチ対応デバイスで行を削除するユーザー エクスペリエンスが向上しました。

セル編集モードで、左右へのスワイプにより行の削除ボタンが表示されます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_5.png)

行編集モードでは、キャセルボタンや完了ボタンと共に、行の削除ボタンを使用できます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_6.png)

>**注:** この機能の稼働には、Modernizr ライブラリが必要です。

#### 関連サンプル

-   [基本編集](%%SamplesUrl%%/grid/basic-editing)



## igHierarchicalGrid
### <a id="ighierarchicalgrid-feature-persistence"></a>機能状態の保持

機能状態の保持とは、再バインド間でグリッド機能の状態を保持することを意味します。

### サポートされる機能

-   フィルタリング
-   Groupby
-   RowSelectors
-   選択
-   並べ替え

新しいプロパティ - 
[persist](%%jQueryApiUrl%%/ui.iggridsorting#options)
が、これらの機能に追加されました。 機能状態の保持はデフォルトで有効です。

#### 関連トピック

-   [選択の概要](igGrid-Selection-Overview.html)
-   [列のグループ化の概要](igGrid-GroupBy-Overview.html)
-   [フィルタリング](igGrid-Filtering.html)
-   [並べ替え概要](igGrid-Sorting-Overview.html)

#### 関連サンプル

-   [機能の永続化](%%SamplesUrl%%/grid/feature-persistence)

### <a id="ighierarchicalgrid-improved-delete-row-mobile"></a>タッチ デバイスの行削除の向上

タッチ対応デバイスで行を削除するユーザー エクスペリエンスが向上しました。

セル編集モードで、左右へのスワイプにより行の削除ボタンが表示されます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_7.png)

行編集モードでは、キャセルボタンや完了ボタンと共に、行の削除ボタンを使用できます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_8.png)



## igHtmlEditor
### <a id="htmleditor-default-style"></a>新しいデフォルトのスタイル

新しいデフォルトのスタイルにより、`igHtmlEditor` のルールバーとボタンが新しいルック アンド フィールで提供されます。

古いデフォルトのスタイル

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_9.png)



新しいデフォルトのスタイル

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_10.png)





## igPivotGrid、igPivotDataSelector、igOlapXmlaDataSource
###<a id="kpi-support"></a> KPI サポート

キューブに定義された KPI を表示する組み込みサポートが、`igOlapXmlaDataSource` に提供されています。データ ソースから提供された KPI は、`igPivotDataSelector` および `igPivotGrid` で視覚化されます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_11.png)

#### 関連トピック

-   [KPI (キー パフォーマンス インジケーター) のサポート (igPivotGrid、igPivotDataSelector、igOlapXmlaDataSource)](igPivotGrid-KPI-Support.html)

#### 関連サンプル

-   [XMLA データ ソースにバインド](%%SamplesUrl%%/pivot-grid/binding-to-xmla-data-source)

### <a id="remote-adomnet-data-provider"></a>リモート ADOMD.NET データ プロバイダーのサポート

`igOlapXmlaDataSource` により、SSAS サーバーの通信で ADOMD.NET を使用するもう 1 つのリモート構成もサポートされています。

#### 関連トピック

-   [データ プロバイダーの構成の概要 (igOlapXmlaDataSource)](igOlapXmlaDataSource-Data-Provider-Configuration-Overview.html)

#### 関連サンプル

-   [リモート ADOMD.NET プロバイダー](%%SamplesUrl%%/pivot-grid/remote-adomd-provider)



## <a id="igpopover-newcontrol"></a>igPopover
### 新規コントロール (RTM)

`igPopover` コントロール (現在は RTM) は、ツールチップに似た機能を DOM 要素に追加します。`igPopover` はコンテキスト依存メニューです。動的コンテンツ、詳細情報、オーバーレイされたフォーム、または特定の要素に表示されるすべての情報を表示します。ポップオーバー領域はカスタマイズでき、ロード オン デマンドすることもできます。コンテンツ、アクティブ化および位置について構成できます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_12.png)

#### 関連トピック

-   [igPopover](igPopover-LandingPage.html)

#### 関連サンプル

-   [基本的な使用方法](%%SamplesUrl%%/popover/basic-popover)



## <a id="igradialmenu-new-control"></a>igRadialMenu
### 新規コントロール (RTM)

`igRadialMenu` コントロールは、中央ボタンの周りに項目を円形の配置で表示するコンテキスト メニューです。項目を円形に配置することで項目をすばやく選択できます。各項目は中央に対して均等に配置されます。`igRadialMenu` は、数値、色値、または操作を実行する項目タイプをサポートします。サブ項目もサポートします。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_13.png)

#### 関連するトピック:

-   [igRadialMenu](igRadialMenu.html)

#### 関連サンプル

-   [ボタン項目](%%SamplesUrl%%/radial-menu/button-items)



## <a id="igsplitter-new-control"></a>igSplitButton
### 新規コントロール (CTP)

`igSplitButton` コントロールは、プライマリ ボタンにバインドするデフォルト値の選択、またはドロップダウン リストに表示されたリストからセカンダリ ボタンにバインドする値の選択ができるドロップダウン ボタンです。ボタンにデフォルトの操作/コマンドを提供すると同時に、補助的なオプションも提供したい場合に便利です。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_14.png)

#### 関連サンプル

-   [分割ボタンの基本機能](%%SamplesUrl%%/split-button/change-shapes)



## <a id="igtoolbar"></a>igToolbar
### 新規コントロール (CTP)

`igToolbar` コントロールによって、`igHtmlEditor` のカスタム ツールバーのようなツールバーを作成できます。

![](images/Whats_New_In_Ignite_UI_2014_Volume_1_15.png)

#### 関連サンプル

-   [スタンドアロン ツールバー](%%SamplesUrl%%/html-editor/standalone-toolbar)



## <a id="igupload-support-web-gardens"></a>igUpload
### Web Farm / Web Garden のサポート

`igUpload` コントロールが、Web Farm / Web Garden Internet Information Services (IIS) 構成をサポートするようになりました。サード パーティ プロバイダーが `igUpload` のデータ構造を使用できるように、アプリケーション全体で `CustomDictionaryProvider` オプションを持ちます。オプションの値は、`ISafeDictionary<文字列, UploadInfo>` インターフェイスを実装する型名です。型を実装すると、単一行ソースからのアップロード ファイルの共通データの保存や読み取りができます。

 

 



<!--
|metadata|
{
    "fileName": "data-source-components-overview",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# データ ソース コンポーネントの概要

## トピックの概要

このトピックでは、%%ProductName%%® のデータ ソース コンポーネントの概要を提供します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念とトピックの一覧です。

**概念**

-   データ ソース コンポーネント

**トピック**

- [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html): このトピックは、%%ProductName%% 製品の概要を示します。


## 概要
### データ ソース コンポーネント概要

%%ProductName%% スイートに含まれるデータ ソース コンポーネントは、実データとビジュアル コンポーネントの間で媒介として動作することを目的にしたクライアント サイド コンポーネントです。多数の入力データがサポートされます。%%ProductName%% データ ソース コンポーネントは、以下のカテゴリに分類されます。

-   標準テーブル (グリッド) 形式の標準のフラットおよび階層データ (多次元データ以外) を視覚化するデータ バインド コントロールをフィードするためのフラット データ コンポーネント (`igDataSource`™)
-   OLAP データ スライスとしてデータを視覚化するために使用される多次元 OLAP データ ソース コンポーネント (`igOlapFlatDataSource`™、`igOlapXmlaDataSource`™) 。OLAP 形式 (`igOlapXmlaDataSource` コンポーネントにフィードされる) または標準フラット データ (`igOlapFlatDataSource` コンポーネントにフィードされる) どちらかの元のデータ セット。後者の場合、フラット データはピボット グリッドで OLAP データとして視覚化できます。



## 各データ ソース コンポーネントの概要
### 各データ ソース コンポーネントの概要

以下の表は、%%ProductName%% データソース コンポーネントの使用目的と機能について概要を提供します。コンポーネントに関するトピックへのリンクを含む、各コンポーネントの詳細は表の下に提供されます。

コンポーネント|説明
---|---
[igDataSource](igDataSource-igDataSource.html)|さまざまな種類のデータやソースへバインドするための標準 %%ProductName%% コンポーネント。`igDataSource` は、ソース データ形式を `igGrid`™ などのデータ バインド コントロールにフィードできる形式へ変換します。
[igOlapXmlaDataSource](igOlapXmlaDataSource.html)|多次元 (OLAP) データ ビジュアライゼーション コントロールを Microsoft® SQL Server® Analysis Services (SSAS) サーバーの OLAP データでフィードするのコンポーネント。
[igOlapFlatDataSource](igOlapFlatDataSource.html) |OLAP 形式で表示するためにフラット データを含む多次元 (OLAP) データ ビジュアライゼーション コントロールをフィードするためのコンポーネント。これは、フラット データ コレクションで OLAP のような検証が可能です。



### igDataSource

`igDataSource` コンポーネントは、データのさまざまなタイプにバインドするための規格の %%ProductName%% コンポーネントです。`igGrid` などのデータ バインド コントロールと実際のデータの間のレイヤーとして操作します。データ ソースはローカル (JSON、XML、JavaScript 配列など) またはリモート (REST サービス、WCF サービスなど) に設定できます。ページング、フィルタリング、並べ替えもサポートされます。

#### 関連トピック

-   [](igDataSource-igDataSource.html)[igDataSource](igDataSource-igDataSource.html)

### igOlapXmlaDataSource

`igOlapXmlaDataSource` は、多次元 (OLAP) データ ビジュアライゼーション コントロールを Microsoft SSAS サーバーの OLAP データでフィードするのコンポーネントです。`igOlapXmlaDataSource` は、JavaScript クライアントと　SSAS データの `msmdpump.dll` HTTP プロバイダー間のコミュニケーションを処理します。OLAP データ ビジュアライゼーション コントロールでその操作は透明です。

#### 関連トピック

-   [](igOlapXmlaDataSource.html)[igOlapXmlaDataSource](igOlapXmlaDataSource.html)

### igOlapFlatDataSource

`igOlapFlatDataSource` は、OLAP 形式で表示するためにフラット データを含む多次元 (OLAP) データ ビジュアライゼーション コントロールをフィードするためのコンポーネントです。これは、フラット データ コレクションで OLAP のような検証が可能です。すべての必要なデータ集計と要約を作成することによって。OLAP データ ビジュアライゼーション コントロールでその操作は透明です。

#### 関連トピック

-   [](igOlapFlatDataSource.html)[igOlapFlatDataSource](igOlapFlatDataSource.html)



## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igDataSource](igDataSource-igDataSource.html): このグループのトピックは `igDataSource` コンポーネントを使用する方法を紹介します。

- [igOlapXmlaDataSource](igOlapXmlaDataSource.html): これは、`igOlapXmlaDataSource` コンポーネントとその使用を説明しているトピックのグループです。

- [igOlapFlatDataSource](igOlapFlatDataSource.html): これは、`igOlapFlatDataSource` コンポーネントとその使用を説明しているトピックのグループです。

- [igGrid](igGrid.html): これは、`igGrid` コントロールとその使用について説明します。

- [igPivotGrid](igPivotGrid.html): これは、`igPivotGrid`™ コントロールとその使用について説明します。

- [igPivotDataSelector](igPivotDataSelector.html): これは、`igPivotDataSelector`™ コントロールとその使用について説明します。


### サンプル

このトピックについては、以下のサンプルも参照してください。

- [XML のバインド](%%SamplesUrl%%/data-source/xml-binding): このサンプルでは、jQuery データ ソース コンポーネントをローカル XML にバインドする方法を紹介します。

- [フラット データ ソースへのバインド](%%SamplesUrl%%/pivot-grid/binding-to-flat-data-source): このサンプルでは、`igPivotGrid` を `igOlapFlatDataSource` にバインドし、データ選択のために `igPivotDataSelector` を使用します。

- [XMLA データ ソースにバインド](%%SamplesUrl%%/pivot-grid/binding-to-xmla-data-source): このサンプルでは、`igPivotGrid` を `igOlapXmlaDataSource` にバインドし、選択のために `igPivotDataSelector` を使用します。





 

 



<!--
|metadata|
{
    "fileName": "iggrid-cellmerging-overview",
    "controlName": "igGrid",
    "tags": ["Grids","Grouping","Styling"]
}
|metadata|
-->

# セル結合の概要 (igGrid)

## トピックの概要

### 目的

このトピックは、`igGrid`™ コントロールのセル結合機能とその機能性について説明します。`igGrid` においてセル結合を有効にし構成する方法のコード例が含まれます。

### 前提条件

以下は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igGrid の概要](igGrid-Overview.html): `igGrid` は、表形式データの表示および操作に使用される jQuery ベースのクライアント側グリッドです。そのライフサイクル全体はクライアント側に存在し、サーバー側の技術からは独立しています。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**セル結合を有効にする**](#enabling)
-   [**セル結合を有効にする - コード例**](#enabling-examples)
-   [**JavaScript でセル結合を有効にする (コード例)**](#enabling-js)
    -   [コード](#enabling-js-code)
-   [**ASP.NET MVC でセル結合を有効にする (コード例)**](#enabling-mvc)
    -   [コード](#enabling-mvc-code)
-   [**igGrid の初期セル結合状態を構成する**](#initial)
    -   [プロパティ設定](#initial-property-settings)
    -   [例](#initial-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

この機能により、値が同じであると (表示テキスト)、ユーザーは列内のセルを可視的に結合できます。シンプルに機能を有効にすると、それぞれの並び替えられた列にセル結合を適用します。代わりに、initialState プロパティを merged に設定することにより、ユーザーはグリッドが初期化されるときにセルを結合する機能を有効にすることができます。これは、事前に並べ替えられたデータ ソースで作業する場合に便利です。

結合されたセルは、以下のスクリーン ショットに示すように特別なスタイル設定でレンダリングします。

![](images/igGrid_CellMerging_Overview.png)

複数の並べ替えを有効にすると、並び替えられたすべての列が結合されます。異なる列の並び替え時に単一の並べ替えを使用すると、1 つ前の列はスタイル設定を失い、結果として新しい列内の結合セルに適用されます。

結合されたセルの見た目をカスタマイズするには、定義済みの CSS クラスを使用できます。スタイル設定に関する詳細は、「[CSS クラス参照](igGrid-CellMerging-CSS-Classes-Reference.html)」トピックを参照してください。



## <a id="enabling"></a> セル結合を有効にする

`igGrid` は、デフォルトではセル結合を有効にしないため、明示的に有効にする必要があります。これは、JavaScript と ASP.NET MVC では異なります。

以下においてセル結合を有効にするには|以下を実行します。
---------------------------|---------
JavaScript ファイル|グリッドの `features` 配列においてセル結合構成を定義します。
ASP.NET MVC|グリッドの `Features` メソッドに渡されるデリゲートにおいてセル結合機能をインスタンス化します。



## <a id="enabling-examples"></a> セル結合を有効にする - コード例
以下の表は、このトピックで使用したコード例をまとめたものです。

- [JavaScript でセル結合を有効にする](#enabling-js-code): この例は、JavaScript のデフォルト構成 (`initialState` は `regular`) で `igGrid` のセル結合機能を有効にする操作を示します。

- [ASP.NET MVC でセル結合を有効にする](#enabling-mvc): この例は、ASP.NET MVC のデフォルト構成 (`initialState` は `regular`) で `igGrid` のセル結合機能を有効にする操作を示します。


### <a id="enabling-js"></a> JavaScript でセル結合を有効にする (コード例)

以下のコードは、AdventureWorks データベースから製品表データにバインドされる `igGrid` インスタンスを作成します。列は自動生成されます。セル結合は、デフォルト構成 (`initialState` は`標準`)で有効になります

#### <a id="enabling-js-code"></a> コード

**JavaScript の場合:**

```js
Code
$("#grid1").igGrid({
    dataSource: adventureWorks,
    autoGenerateColumns: true,
    features: [
        {
            name: "CellMerging"
        }
    ]
});
```


### <a id="enabling-mvc"></a> ASP.NET MVC でセル結合を有効にする (コード例)

以下のコードは、ビューモデルとして定義されるカスタム `Product` オブジェクト コレクションにバインドされる `igGrid` インスタンスを作成します。列は自動生成されます。セル結合を、デフォルト構成 (`initialState` は `regular`)で有効にします。

#### <a id="enabling-mvc-code"></a> コード

**C# の場合:**

```csharp
Code
@model IQueryable<Sample.Models.Product>
@(Html.Infragistics()
    .Grid(Model)
    .AutoGenerateColumns(true)
    .Features(feature =>
    {
        feature.CellMerging();
    })
    .DataBind()
    .Render())
```



## <a id="initial"></a> *igGrid* の初期セル結合状態を構成する

このセクションでは、`merged` 初期状態でセル結合を有効にする方法を説明します。

### <a id="initial-property-settings"></a> プロパティ設定

以下の表では、目的の構成をプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
マージされた初期状態を有効にします。|initialState|"merged"


### <a id="initial-example"></a> 例

以下のスクリーンショットは、以下の設定の結果として `igGrid` がどのように見えるかを示しています。

プロパティ|値
---------|------
initialState|"merged"


![](images/igGrid_CellMerging_Overview.png)

以下のコード スニペットは、セル結合の初期状態をコードで設定する方法を示します。

**JavaScript の場合:**

```js
$("#grid").igGrid({
    dataSource: adventureWorks,
    autoGenerateColumns: true,
    features: [
        {
            name: "CellMerging",
            initialState: "merged"
        }
    ]
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Grid(Model)
.AutoGenerateColumns(true)
.ID("grid1")
.Features(f => f.CellMerging().InitialState(CellMergingInitialState.Merged))
.DataBind()
.Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [プロパティ リファレンス (セル結合、igGrid)](igGrid-CellMerging-Property-Reference.html): このトピックでは、`igGrid` コントロールのセル結合機能のプロパティに関する参照情報を提供します。

- [イベント リファレンス (セル結合、igGrid)](igGrid-CellMerging-Event-Reference.html): このトピックでは、`igGrid` コントロールのセル結合機能のイベントに関する参照情報を提供します。

- [CSS クラス リファレンス (セル結合、igGrid)](igGrid-CellMerging-CSS-Classes-Reference.html): このトピックでは、`igGrid` コントロールのセル結合機能の CSS クラスに関する参照情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [セルの結合](%%SamplesUrl%%/grid/cell-merging): このサンプルでは、`igGrid` でセル結合を構成する方法を紹介します。

- [HierarchicalGrid セル結合](%%SamplesUrl%%/hierarchical-grid/cell-merging): このサンプルでは、`igHierarchicalGrid` 結合を構成する方法を紹介します。



 

 



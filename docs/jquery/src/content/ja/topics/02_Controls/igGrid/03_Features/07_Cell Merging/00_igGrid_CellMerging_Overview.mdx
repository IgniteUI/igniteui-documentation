<!--
|metadata|
{
    "fileName": "iggrid-cellmerging-overview",
    "controlName": "igGrid",
    "tags": ["Grids","CellMerging","Styling"]
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
	-   [ビジュアル セル結合](#intro-visual)
    -   [物理セル結合](#intro-physical)
-   [**セル結合を有効にする**](#enabling)
	-   [JavaScript でセル結合を有効にする](#enabling-js)
    -   [ASP.NET MVC でセル結合を有効にする](#enabling-mvc)
-   [**セル結合を適用した場合の構成**](#mergeOn)
    -   [すべての列](#mergeOn-all)
    -   [指定した列](#mergeOn-column)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)


## <a id="introduction"></a> 概要

この機能は、列のセルを定義済み条件またはカスタム条件に基づいて視覚的、または物理的に結合することを可能にします。この機能を有効にした場合、並べ替えた列にデフォルトで表示セルの結合を適用します。並べ替えていない列は結合状態を失います。

ユーザーは [*mergeOn*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:mergeOn) プロパティを使用してデフォルト動作を変更できます。"always" に設定すると、グリッドの初期化時および再描画の処理間でセルが結合されます。これは、事前に並べ替えられたデータ ソースにバインドされるグリッドで作業する場合に便利です。

#### <a id="intro-visual"></a> ビジュアル セル結合

デフォルトでセル結合機能を有効にすると、並べ替えた列のセルを視覚的に結合します。以下の画像はスタイル設定のルールを示します。

![](images/igGrid_CellMerging_Visual.jpg)

結合されたセルの表示をカスタマイズするには、定義済みの CSS クラスを使用できます。スタイル設定に関する詳細は、「[CSS クラス参照](%%jQueryApiUrl%%/ui.iggridcellmerging#theming)」トピックを参照してください。

#### <a id="intro-physical"></a> 物理セル結合

結合されたセルのグループを表す単一のセルが必要な場合、物理結合を使用できます。結合の結果、複数のセルにまたがるテキストがある場合に便利です。HTML Table で複数の行にまたがるセルで *rowspan* を設定した場合と同様に動作します。この方法は、以下のスクリーンショットで示されています。

![](images/igGrid_CellMerging_Physical.jpg)

結合されたセルは、カスタム CSS クラス [*ui-iggrid-physicalmergedcell*](%%jQueryApiUrl%%/ui.iggridcellmerging#theming:ui-iggrid-physicalmergedcell) でスタイル設定できます。セルのテキストの配置変更などに使用できます。



## <a id="enabling"></a> セル結合を有効にする

`igGrid` は、デフォルトではセル結合を有効にしないため、明示的に有効にする必要があります。これは、JavaScript と ASP.NET MVC では異なります。

以下においてセル結合を有効にするには|以下を実行します。
---------------------------|---------
JavaScript ファイル|グリッドの `features` 配列においてセル結合構成を定義します。
ASP.NET MVC|グリッドの `Features` メソッドに渡されるデリゲートにおいてセル結合機能をインスタンス化します。

### <a id="enabling-js"></a> JavaScript でセル結合を有効にする

以下のコードは、AdventureWorks データベースから製品表データにバインドされる `igGrid` インスタンスを作成します。列は自動生成されます。セル結合は、デフォルト構成で有効です。

**JavaScript の場合:**

<div class="embed-sample">
   [セル結合](%%SamplesEmbedUrl%%/grid/cell-merging)
</div>


### <a id="enabling-mvc"></a> ASP.NET MVC でセル結合を有効にする

以下のコードは、ビューモデルとして定義されるカスタム `Product` オブジェクト コレクションにバインドされる `igGrid` インスタンスを作成します。列は自動生成されます。セル結合を、デフォルト構成で有効にします。

**Razor の場合:**

```csharp
@(Html.Infragistics()
    .Grid(Model)
    .AutoGenerateColumns(true)
    .Features(feature =>
    {
        feature.CellMerging();
    })
    .DataBind()
    .Render()
)
```

## <a id="mergeOn"></a> セル結合を適用した場合の構成

このセクションは、セル結合機能がすべての列または特定の列のみに適用される構成方法を紹介します。

### <a id="mergeOn-all"></a> すべての列

以下のサンプルは、すべての列でセルを結合するためにセル結合機能の mergeOn ルールを設定する方法を紹介します。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    dataSource: adventureWorks,
    autoGenerateColumns: true,
    features: [
        {
            name: "CellMerging",
            mergeOn: "always"
        }
    ]
});
```

**Razor の場合:**

```csharp
@(Html.Infragistics().Grid(Model)
    .AutoGenerateColumns(true)
    .ID("grid1")
    .Features(f => f.CellMerging().MergeOn(CellMergingMergeOn.Always))
    .DataBind()
    .Render()
)
```

### <a id="mergeOn-column"></a> 指定した列

以下のサンプルは、「City」キーの列のセルが常に結合されるためにセル結合の mergeOn ルールを設定する方法を紹介します。

並べ替え機能が有効な場合に列を並べ替えると、その列のセルも結合されます。これはセル結合のデフォルト動作で、その他の列のオプションが設定されていないためです。「City」列のセルは結合のままに残ります。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    dataSource: adventureWorks,
    autoGenerateColumns: true,
    features: [
        {
            name: "CellMerging",
            columnSettings: [
                {
                    columnKey: "City",
                    mergeOn: "always"
                }
            ]
        }
    ]
});
```

**Razor の場合:**

```csharp
@(Html.Infragistics().Grid(Model)
	.AutoGenerateColumns(true)
	.ID("grid1")
	.Features(features => 
        features.CellMerging().ColumnSettings(settings =>
            settings.ColumnSetting().ColumnKey("City").MergeOn(CellMergingMergeOn.Always)
        );
    )
	.DataBind()
	.Render()
)
```

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igGrid のセル結合の高度なカスタマイズ](igGrid-CellMerging-Advanced.html)
- [igGrid の概要](igGrid-Overview.html)
- [igGrid 並べ替え](igGrid-Sorting-Overview.html)


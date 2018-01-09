<!--
|metadata|
{
    "fileName": "iggrid-cellmerging-advanced",
    "controlName": "igGrid",
    "tags": ["Grids","CellMerging", "Advanced", "Customization"]
}
|metadata|
-->

# セル結合の高度なカスタマイズ (igGrid)

## トピックの概要

### 目的

このトピックは、`igGrid`™ コントロールのセル結合機能の高度なカスタマイズを紹介します。様々な結合方法の実装および定義済みの方法を説明します。

### 前提条件

以下は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igGrid セル結合の概要](igGrid-CellMerging-Overview.html): このトピックは、`igGrid` に使用するためにセル結合機能を有効にする方法を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**定義済みの結合方法**](#merge-predefined)
    -   [複製方法](#merge-duplicate)
    -   [Null 方法](#merge-null)
-   [**カスタム結合方法**](#merge-custom)
    -   [例](#merge-custom-example)
    -   [サンプル](#merge-custom-sample)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)


## <a id="introduction"></a> 概要

セル結合は 2 つの定義済みの結合方法を提供します。最初のは複製されたセル値を検索します。2 番目は後の *null* 値を結合します。定義済み方法に追加して、カスタム方法を定義するために [*mergeStrategy*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:mergeStrategy) オプションを使用できます。

次のセクションでは、結合の定義済みの方法を説明し、複雑なシナリオで使用するためのカスタム方法を定義する方法を説明します。*物理*セル結合について説明しています。*視覚的な*セルの結合は構成が同様ですが、表示結果が異なります。

## <a id="merge-predefined"></a> 定義済みの結合方法

セル結合で使用される定義済みのメソッドを指定するには、[*mergeStrategy*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:mergeStrategy) プロパティを `"duplicate"` または `"null"` に設定します。デフォルト値は `"duplicate"` です。

### <a id="merge-duplicate"></a> 複製方法

`mergeStrategy` オプションが *"duplicate"* に設定される場合、2 つのセルの値を比較して結合するかどうかを決定します。*`===`* チェックがパスした (同じ値および同じ型がある) 場合、セルは結合が可能です。その後、[*mergeType*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:mergeType) オプションに基づいて、セルは結合されます。 

以下はデータ構造の例です:

```json
var productData1 = [
    { ActionID: "1", ProjectName: "IOT Switch Project", ActionName: "Data Import", /*...*/ },
    { ActionID: "2", ProjectName: "IOT Switch Project", ActionName: "Reports", /*...*/ },
    { ActionID: "4", ProjectName: "IOT Switch Project", ActionName: "Multiple Settings", /*...*/},
    { ActionID: "3", ProjectName: "IOT Switch Project", ActionName: "Data Archiving", /*...*/ },
    { ActionID: "5", ProjectName: "IOT Switch Project", ActionName: "Main Menu: Return Button", /*...*/ },
    { ActionID: "6", ProjectName: "IOT Switch Project", ActionName: "Auto Turn Off", /*...*/ },
    { ActionID: "7", ProjectName: "VR Device", ActionName: "Higher DRI", /*...*/ },
    { ActionID: "8", ProjectName: "VR Device", ActionName: "Accessible Power Button", /*...*/ },
    { ActionID: "9", ProjectName: "VR Device", ActionName: "Additional options", /*...*/ },
    { ActionID: "10", ProjectName: "VR Device", ActionName: "Data Log", Type: "Request", /*...*/ },
    { ActionID: "12", ProjectName: "VR Device", ActionName: "Motion Blur", Type: "Bug", /*...*/ },
    { ActionID: "11", ProjectName: "VR Device", ActionName: "Left Sensors Delay", /*...*/ },
]
```

物理セル結合を *"duplicate"* 形式で初期化するためにデフォルトを使用して mergeStrategy オプションを設定する必要はありません。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    dataSource: productData1,
    primaryKey: "ActionID",
    autoGenerateColumns: false,
    columns: [
        { headerText: "Product ID", key: "ActionID", dataType: "number", hidden: true },
        { headerText: "Project Name", key: "ProjectName", dataType: "string", width: 200 },
        //...
    ],
    features: [
        {
            name: "CellMerging",
            mergeOn: "always",
            mergeType: "physical"
        }
    ]
});
```

**Razor の場合:**

```csharp
@(Html.Infragistics().Grid(Model)
    .ID("grid1")
    .AutoGenerateColumns(false)
    .PrimaryKey("ActionID")
    .Columns(col =>
    {
        col.For(c => c.ActionID).HeaderText("ActionID");
        col.For(c => c.ProjectName).HeaderText("ProjectName");
        //...
    })
    .Features(f =>
    {
        f.CellMerging().MergeOn(CellMergingMergeOn.Always).MergeType(CellMergingMergeType.Physical)
    })
    .DataBind()
    .Render()
)
```

`mergeType` が *"physical"* の場合、結合グループを表すために単一のセルのみが描画されます。上記の構成の結果は以下の画像となります。

![](images/igGrid_CellMerging_Advaced_duplicate_physical.jpg)

結合したセルの値を更新するためにセル更新機能を使用する場合、グループの最初のセルの値のみ変更されます。そのセルは結合状態を失います。残りのセルは結合状態を保持します。

### <a id="merge-null"></a> Null 方法

セル結合機能には `null` セル値に基づいて結合する機能も提供します。このシナリオは "duplicate" 形式と異なります。セルを結合するには、2 番目のセルの値が  `null` である必要があります。最初のセルには `null` または任意の値が可能です。

以下のデータは例です。

```json
var productData2 = [
    { ActionID: "1", ProjectName: "IOT Switch Project", ActionName: "Data Import", /*...*/ },
    { ActionID: "2", ProjectName: null, ActionName: "Reports", /*...*/ },
    { ActionID: "4", ProjectName: null, ActionName: "Multiple Settings", /*...*/},
    { ActionID: "3", ProjectName: null, ActionName: "Data Archiving", /*...*/ },
    { ActionID: "5", ProjectName: null, ActionName: "Main Menu: Return Button", /*...*/ },
    { ActionID: "6", ProjectName: null, ActionName: "Auto Turn Off", /*...*/ },
    { ActionID: "7", ProjectName: "VR Device", ActionName: "Higher DRI", /*...*/ },
    { ActionID: "8", ProjectName: null, ActionName: "Accessible Power Button", /*...*/ },
    { ActionID: "9", ProjectName: null, ActionName: "Additional options", /*...*/ },
    { ActionID: "10", ProjectName: null, ActionName: "Data Log", Type: "Request", /*...*/ },
    { ActionID: "12", ProjectName: null, ActionName: "Motion Blur", Type: "Bug", /*...*/ },
    { ActionID: "11", ProjectName: null, ActionName: "Left Sensors Delay", /*...*/ },
]
```

列で、単一のセルのみが「Project Name」情報を含み、残りのセルの値は `null` です。そのセルがグリッドのデータ ソースで `null` 値が含まれることを確認するために null 許容型 (igDataSource で `number`、`object` または `Date`) が必要です。この例では、列の [*dataType*](%%jQueryApiUrl%%/ui.iggrid#options:columns.dataType) が `"object"` に設定されるため、 `null` 値が保持されます。または [*localSchemaTransform*](%%jQueryApiUrl%%/ui.iggrid#options:localSchemaTransform) を false に設定できます。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    dataSource: productData2,
    primaryKey: "ActionID",
    autoGenerateColumns: false,
    columns: [
        //...
        { headerText: "Project Name", key: "ProjectName", dataType: "object", width: 200 },
        //...
    ],
    features: [
        {
            name: "CellMerging",
            mergeOn: "always",
            mergeType: "physical",
            mergeStrategy: "null"
        }
    ]
});
```

**Razor の場合:**

```csharp
@(Html.Infragistics().Grid(Model)
    .ID("grid1")
    .PrimaryKey("ActionID")
    .AutoGenerateColumns(false)
    .Columns(col =>
    {
        col.For(c => c.ActionID).HeaderText("ActionID");
        col.For(c => c.ProjectName).HeaderText("ProjectName");
        //...
    })
    .Features(f =>
    {
        f.CellMerging()
            .MergeOn(CellMergingMergeOn.Always)
            .MergeType(CellMergingMergeType.Physical)
            .MergeStrategy(CellMergingMergeStrategy.Null)
    })
    .DataBind()
    .Render()
)
```

`mergeType` が *"physical"* の場合、結果は *"duplicate"* 結合の使用方法とほとんど同じです。使用されているデータの構造が異なります。 

![](images/igGrid_CellMerging_Advaced_null_physical.jpg)

セル結合機能をセル更新機能と一緒に使用する場合に便利です。この場合、結合したセルを更新すると、結合グループ全体を可視化的に更新します。データでグループの最初のセル値のみが更新され、その他のセルは *`null`* 値を保持します。

**注:** `null` 値を含む唯一の列のため、"Project Name" 列のみが結合されます。

## <a id="merge-custom"></a> カスタム結合方法

セル結合機能は、シナリオに応じて、カスタム結合方法をサポートします。

### <a id="merge-custom-example"></a> 例

最初の例で、セル結合が予期したとおり実行されましたが、実環境アプリケーションで適切でないことがあります。次の画像で表示されるように、セル結合は 2 つのプロジェクトの間に同じ値を持つセルを結合します。 

![](images/igGrid_CellMerging_Advaced_custom_problem.jpg)

この場合、セル結合機能はデータおよび表示方法を最初から正しく予測できません。特定のアプリケーションの状況でセル値が結合される条件をカスタマイズするためにカスタムの mergeStrategy を設定します。結合される列の以前のレコード、現在のレコード、および列のキーを受け取る関数を割り当てることが可能です。この関数を使用すると、上記のカスタム要件は以下のように実装できます。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    dataSource: productData1,
    primaryKey: "ActionID",
    autoGenerateColumns: false,
    columns: [
        { headerText: "Product ID", key: "ActionID", dataType: "number", hidden: true },
        { headerText: "Project Name", key: "ProjectName", dataType: "string", width: 200 },
        //...
    ],
    features: [
        {
            name: "CellMerging",
            mergeOn: "always",
            mergeType: "physical",
            mergeStrategy: function (prevRec, curRec, columnKey) {
                if ($.type(prevRec[ columnKey ]) === "string" &&
                    $.type(curRec[ columnKey ]) === "string" &&
                        prevRec["ProjectName"] === curRec["ProjectName"]) {
                    //We have cells with string values and matching Project Name
                    return prevRec[ columnKey ].toLowerCase() === curRec[ columnKey ].toLowerCase();
                } else if ( prevRec["ProjectName"] === curRec["ProjectName"]) {
                    //We have other types of cell values and matching Project Name
                    return prevRec[ columnKey ] === curRec[ columnKey ];
                }
                
                //We do not have matching Project Name
                return false;
            }
        }
    ]
});
```

**Razor の場合:**

```csharp
<script>
    window.mergeCellsProject = function (prevRec, curRec, columnKey) {
        //.
    }
</script>

@(Html.Infragistics().Grid(Model)
    .ID("grid1")
    .PrimaryKey("ActionID")
    .AutoGenerateColumns(false)
    .Columns(col =>
    {
        col.For(c => c.ActionID).HeaderText("ActionID");
        col.For(c => c.ProjectName).HeaderText("ProjectName");
        //...
    })
    .Features(f =>
    {
        f.CellMerging()
            .MergeOn(CellMergingMergeOn.Always)
            .MergeType(CellMergingMergeType.Physical)
            .MergeStrategy("mergeCellsProject")
    })
    .DataBind()
    .Render()
)
```

以下はカスタム実装の結果です。

![](images/igGrid_CellMerging_Advaced_custom_solution.jpg)

結合されたグループがプロジェクトに基づいて分割されるため、プロジェクト境界線を識別できます。

このように、`mergeStrategy` プロパティの使用はユーザー エクスペリエンスを向上します。

### <a id="merge-custom-sample"></a> サンプル

以下のサンプルは上記のカスタム方法を実装します。

**JavaScript の場合:**

<div class="embed-sample">
   [セルの結合](%%SamplesEmbedUrl%%/grid/cell-merging-custom)
</div>

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックに関連する追加情報については、以下のトピックを参照してください。

- [igGrid セル結合の概要](igGrid-CellMerging-Overview.html)
- [igGrid の概要](igGrid-Overview.html)
- [igGrid 並べ替え](igGrid-Sorting-Overview.html)

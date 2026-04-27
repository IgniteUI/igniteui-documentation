<!--
|metadata|
{
    "fileName": "configuring-the-tabular-view",
    "controlName": "",
    "tags": ["Data Presentation","How Do I","Tips and Tricks"]
}
|metadata|
-->

# ピボット グリッドの結果セットの表形式ビューの構成

## トピックの概要
### 目的

このトピックは、グリッドのインターフェイスまたはコードを使用し、ピボット グリッド列、行、フィルター、およびメジャーの階層を配置して設定される OLAP キューブ結果の表形式ビューを構成する方法を説明します。

> **注:** このトピックは次のコントロールに対応します: `igOlapFlatDataSource`, `igOlapXmlaDataSource`, `igPivotDataSelector`, `igPivotGrid`, `igPivotView`。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igOlapXmlaDataSource の概要](igOlapXmlaDataSource-Overview.html): このトピックでは、`igOlapXmlaDataSource`™ コンポーネントとその主な機能の概要を提供します。

- [igOlapXmlaDataSource の追加](igOlapXmlaDataSource-Adding.html): このトピックのグループは、`igOlapXmlaDataSource` コンポーネントを HTML ページおよび ASP.NET MVC ビュー の追加する方法について説明します。

- [igOlapFlatDataSource の概要](igOlapFlatDataSource-Overview.html): このトピックでは、`igOlapFlatDataSource`™ コンポーネントとその主な機能の概要を提供します。

- [igOlapFlatDataSource の追加](igOlapFlatDataSource-Adding.html): このトピックのグループは、`igOlapFlatDataSource` を HTML ページおよび ASP.NET MVC ビュー の追加する方法について説明します。

- [igPivotDataSelector の概要](igPivotDataSelector-Overview.html): このトピックは、主要機能、最小要件、ユーザー機能性など、`igPivotDataSelector`™ コントロールに関する概念的な情報を提供します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [列、行、フィルター、およびメジャーを配置して OLAP データ スライスを指定](#specifying-olap-data-slice)
    -   [OLAP データ スライスの指定について](#summary)
    -   [OLAP データ スライスの指定についての概要表](#summary-chart)
-   [ピボット グリッドのインターフェイスによってユーザー構成の設定 (igPivotDataSelector、igPivotGrid、igPivotView)](#user-configuration)
    -   [ユーザー構成の概要](#user-config-summary)
    -   [ユーザー構成オプションの構成](#user-config-options)
-   [データ ソースの初期化でプログラム的に構成 (igOlapFlatDataSource、igOlapXmlaDataSource)](#programmatic-configuration)
    -   [データ ソースの初期化でプログラム的に構成の概要](#programmatic-config-summary)
    -   [プロパティ設定](#programmatic-config-settings)
    -   [コード例](#programmatic-config-example)
-   [ランタイムのプログラム的に構成 (igOlapFlatDataSource、igOlapXmlaDataSource)](#programmatic-configuration-run-time)
    -   [概要](#run-time-overview)
    -   [メソッドの設定](#programmatic-config-settings)
    -   [コード例](#programmatic-config-example)
-   [関連コンテンツ](#related-content)
    -   [サンプル](#samples)



## <a id="specifying-olap-data-slice"></a>列、行、フィルター、およびメジャーを配置して OLAP データ スライスを指定
### <a id="summary"></a>OLAP データ スライスの指定について

多次元 (OLAP) データ セットでデータ解析を実行する前に、OLAP キューブを表で表示し、データのフィルターと集計を設定する必要があります。このフィルターと集計設定は特定のデータ カテゴリおよびデータ集計条件に基づいて設定されます。ピボット グリッドでは、要件に合わせる表ビューはグリッドの行、列、フィルター、メジャーの選択と配置によって設定できます。この配置は、データ カテゴリの集計レベルに基づいて結果セットを特定のスライスにフィルターして表ビューに表示します。特定のデータ スライス (ビュー) を指定して表示するには、行、列、フィルター、およびメジャーの階層を構成 (選択して配置) する必要があります。

%%ProductName%%™ OLAP コンポーネントで、階層の構成は以下のレベルに設定できます。

-   相対する UI ウィジェットのユーザー インターフェイス: `igPivotDataSelector`、`igPivotGrid`™、`igPivotView`™ (ユーザー構成)
-   `igOlapFlatDataSource` または `igOlapXmlaDataSource` API を使用してプログラム的に構成できます。以下を構成できます:
    -   初期化に読み込む特定の列、行、フィルター、メジャーを設定できます。
    -   ランタイムに列、行、フィルター、およびメジャーの配置に変更できます。

### <a id="summary-chart"></a>OLAP データ スライスの指定についての概要表

以下の表は、グリッドの行、列、およびフィルターを構成すると、ピボット グリッドで結果セットの特定の表ビューを構成する方法の概要を提供します。

メソッド|詳細
---|---
[ピボット グリッドのインターフェイスによってユーザー構成の設定 (igPivotDataSelector、igPivotGrid、igPivotView)](#user-configuration)|表ビューを構成するには、ユーザーがピボット グリッドのユーザー インターフェイスで階層およびメジャーをドラッグ アンド ドロップできます。
[データ ソースの初期化でプログラム的に構成 (igOlapFlatDataSource、igOlapXmlaDataSource)](#programmatic-configuration)|データ ソース コンポーネントの初期化オプションで行、列、階層、およびメジャーを設定すると、ピボット グリッドが最小化するときに生成される表ビューをコードで構成できます。
[ランタイムのプログラム的に構成 (igOlapFlatDataSource、igOlapXmlaDataSource)](#programmatic-configuration-run-time)|`igOlapFlatDataSource` および `igOlapXmlaDataSource` コンポーネントの API によってランタイムに表ビューをコードで構成できます。



##<a id="user-configuration"></a> ピボット グリッドのインターフェイスによってユーザー構成の設定 (igPivotDataSelector、igPivotGrid、igPivotView)
### <a id="user-config-summary"></a>ユーザー構成の概要

`igPivotDataSelector` コントロール (および `igPivotDataSelector` を含む `igPivotView` コントロール) は、階層およびメジャーの選択と配置を有効にするユーザー インターフェイスがあります。(`igPivotGrid` は制限される機能を提供します。)この選択と配置を実行するには、項目をメタデータ ツリーから以下の列、行、フィルター、およびメジャーの領域にドラッグします。

以下の画像は、データ スライスを定義するには、Product 階層をメタデータ ツリー ノードから列領域にドラッグ アンド ドロップされる `igPivotDataSelector` コントロールを表示します。このユーザー操作の結果は、階層がデータ ソースの列コレクションに追加されます。`igPivotGrid` がこのデータ ソースにバインドされる場合、階層のルート メンバーが列ヘッダー領域に表示されます。

![](images/igOlap_Configuring_the_Tabular_View_1.png)

#### 関連コンテンツ

以下のトピックのユーザー インタラクションと使用セクションに参照してください。

-   [igPivotDataSelector の概要](igPivotDataSelector-Overview.html)
-   [igPivotGrid の概要](igPivotGrid-Overview.html)
-   [igPivotView 概要](igPivotView-Overview.html)

### <a id="user-config-options"></a>ユーザー構成オプションの構成

デフォルトでは、すべての階層を列、行、およびフィルターにドロップでき、すべてのメジャーがメタデータ ツリーからメジャー領域にドラッグ アンド ドロップできます。ただし、OLAP データ ビジュアライゼーション コントロール (`igPivotDataSelector`、`igPivotGrid`、または `igPivotView`) の [customMoveValidation](%%jQueryApiUrl%%/ui.igPivotGrid#options:customMoveValidation) オプションを使用すると、この動作にカスタム制限を設定できます。



## <a id="programmatic-configuration"></a>データ ソースの初期化でプログラム的に構成 (igOlapFlatDataSource、igOlapXmlaDataSource)
### <a id="programmatic-config-summary"></a>データ ソースの初期化でプログラム的に構成の概要

データ ソース コンポーネントの初期化オプションで行、列、階層、およびメジャーを設定すると、ピボット グリッドが最小化するときに生成される表ビューをコードで構成できます。`igOlapFlatDataSource` および `igOlapXmlaDataSource` コンポーネントは、ビューに表示する階層およびメンバーを指定するためのプロパティの設定によって、この機能をサポートします。

`igOlapFlatDataSource` および `igOlapXmlaDataSource` コンポーネントは、データの現在ビューを含む result プロパティがあります。このプロパティは、データ ソースの現在状態を表示するために OLAP データ表示コントロール (`igPivotDataSelector`、`igPivotGrid`、または `igPivotView`) によって使用されます。

最初の階層またはメジャーを指定するには、対応するプロパティを階層の一意の名前 ([uniqueName](%%jQueryApiUrl%%/ig.Hierarchy#methods:uniqueName) プロパティ値) に設定する必要があります。以下は構文要件です。

-   領域に 2 つ以上の階層またはメジャーがある場合、各階層名前をコンマによって分割します。
-   選択して結果ビューに表示される階層のメンバー (選択されていないメンバーは表示されない)は、階層の一意の名前の後にメンバーの一意の名前を {} で書き、コンマによって分割する必要があります。

>**注:** `igOlapXmlaDataSource` では、一意の名前はサーバーの設定によって決定されます。igOlapFlatDataSource では、階層の一意の名前は以下のパターンに基づいて生成されます:  [dimensionMetadata.name].[hierarchyMetadata.name]メンバーの一意の名前は以下のパターンに基づいて生成されます:

[dimensionMetadata.name].[hierarchyMetadata.name].[levelMetadata.name].parentMembersPath&[membername] 
parentMembersPath は、特定のメンバーの親であるすべてのメンバーの名前の連結です。&[memberName] パターンはすべての名前で使用されます。たとえば、メンバーの有効な一意の名前は: [Date].[Date].[SaleDateDay].&[2007]&[Q 1]&[January]&[Jan 1]

### <a id="programmatic-config-settings"></a>プロパティ設定

以下の表に、これらを管理するプロパティ設定を構成タスクにマップします。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
目的:
			</th>

            <th>
使用するプロパティ:
			</th>

            <th>
設定の選択肢:
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
列階層の設定
			</td>

            <td>
[columns](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:columns)
			</td>

            <td rowspan="4">
特定の階層またはメジャーの一意の名前のコンマによって分割される文字列。

                文字列に名前の左から右への配列は、階層の項目の上から下への配置に相対します。igPivotGrid に右から左へ視覚化されます。たとえば、`“[Date].[Date],[Product].[Product]”` の配列は以下の結果になります。
                    in:

                
                    ![](images/igOlap_Configuring_the_Tabular_View_2.png)
                

                各階層は列、行、およびフィルターのピボット グリッドの 3 つのディメンションに使用できます。
			</td>
        </tr>

        <tr>
            <td>
行階層の設定
			</td>

            <td>
[rows](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:rows)
			</td>
        </tr>

        <tr>
            <td>
フィルター階層の設定
			</td>

            <td>
[filters](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:filters)
			</td>
        </tr>

        <tr>
            <td>
メジャーの設定
			</td>

            <td>
[measures](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:measures)
			</td>
        </tr>
    </tbody>
</table>



### <a id="programmatic-config-example"></a>コード例

以下のコード例は、[igPivotDataSelector を HTML ページに追加](igPivotDataSelector-Adding-to-HTML-Page.html)トピックに説明したように `igOlapFlatDataSource` インスタンスの行、列、メジャーを初期化する方法を紹介します。そのトピックに説明したようにデータ ソースにバインドされる `igPivotDataSelector` コントロールは以下のように表示されます。

![](images/igOlap_Configuring_the_Tabular_View_3.png)

 

**C# の場合:**

```csharp
var dataSource = new $.ig.OlapFlatDataSource({ 
   //…
   rows: "[Date].[Date]",
   columns: "[Product].[Product]",
   measures: "[Measures].[UnitsSold],[Measures].[UnitPrice]"
});
```

以下のコード スニペットは Date 階層に選択したメンバーを指定します。

**C# の場合:**

```csharp
var dataSource = new $.ig.OlapFlatDataSource({ 
   //…
   rows: "[Date].[Date]{ [Date].[Date].[SaleDateDay].&[All Periods]&[2007]&[Q 1]&[January]&[Jan 1], [Date].[Date].[SaleDateDay].&[All Periods]&[2007]&[Q 1]&[January]&[Jan 5]}",
   columns: "[Product].[Product]",
   measures: "[Measures].[UnitsSold],[Measures].[UnitPrice]"
});
```

結果は以下のようになります。

![](images/igOlap_Configuring_the_Tabular_View_4.png)



## <a id="programmatic-configuration-run-time"></a>ランタイムのプログラム的に構成 (igOlapFlatDataSource、igOlapXmlaDataSource)
### <a id="run-time-overview"></a>概要

`igOlapFlatDataSource` および `igOlapXmlaDataSource` コンポーネントの API によってランタイムに表ビューをコードで構成できます。この API はメジャー領域に項目を追加し、削除することをサポートします。

### <a id="programmatic-config-settings"></a>メソッドの設定

以下の表は `igOlapFlatDataSource` および `igOlapXmlaDataSource` API の特定のメソッドを構成タスクにマップします。

目的:|このメソッドを使用:
---|---
項目を列、行、フィルター、またはメジャーに追加する|[addColumnItem(item) or insertColumnItem(index, item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods) <br>[addRowItem(item) or insertRowItem(index, item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods) <br>[addFilterItem(item) or insertFilterItem(index, item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods) <br>[addMeasureItem(item) or insertMeasureItem(index, item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods)
項目を列、行、フィルター、またはメジャーから削除する|[removeColumnItem(item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods) <br>[removeRowItem(item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods) <br>[removeFilterItem(item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods) <br>[removeMeasureItem(item)](%%jQueryApiUrl%%/ig.OlapFlatDataSource#methods)

### <a id="programmatic-config-example"></a>コード例

以下のコード例は、`dataSource` 識別子を使用して OLAP データ ソースの列とメジャーに項目を追加するか、削除する方法を紹介します。

**JavaScript の場合:**

```js
// get a reference to the hierarchy you want to add
var hierarchy = dataSource.getHierarchy("[Date].[Date]");// orvar hierarchy = dataSource.getCoreElement(function (element) { return element.uniqueName() === "[Date].[Date]" }, $.ig.Hierarchy.prototype.getType());

// add it to the columns
dataSource.addColumnItem(hierarchy);
// get a reference to the measure you want to add
var measure = dataSource.getMeasure"[Measures].[UnitsSold]");// orvar measure = dataSource.getCoreElement(function (element) { return element.uniqueName() === "[Measures].[UnitsSold]" }, $.ig.Measure.prototype.getType());
// add it to the measures
dataSource.addMeasureItem(measure);
// update the data source
dataSource.update()
```



## <a id="related-content"></a>関連コンテンツ
### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [フラット データ ソースへのバインド](%%SamplesUrl%%/pivot-grid/binding-to-flat-data-source): このサンプルでは、`igPivotGrid` を `igOlapFlatDataSource` にバインドし、データ選択のために `igPivotDataSelector` を使用します。

- [移動のカスタム検証](%%SamplesUrl%%/pivot-grid/custom-drag-drop-validation): このサンプルでは、ピボット グリッドおよびピボット データ セレクターを使用してカスタム移動検証を構成する方法を紹介します。カスタム検証関数を使用すると、項目の列へのドロップが無効になります。また、名前に「Seller」が含まれる階層では、ピボット グリッドおよびデータ セレクターのドロップ領域へのドロップが無効になります。





 

 



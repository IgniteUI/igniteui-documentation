<!--
|metadata|
{
    "fileName": "igtreegrid-overview",
    "controlName": ["igTreeGrid"],
    "tags": ["Grids"]
}
|metadata|
-->

#igTreeGrid の概要

## トピックの概要

このトピックでは、`igTreeGrid` [CTP] コントロールの概要を説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。

### トピック

-   [igDataSource の概要](igDataSource-igDataSource-Overview.html)
-   [igGrid の概要](igGrid-Overview.html)
-   [igHierarchicalGrid の概要](igHierarchicalGrid-Overview.html)

### このトピックの内容

-   [**概要**](#introduction)
-   [**データ バインディング**](#data-binding)
    -   [フラット データ ソース](#flat-data-source)
    -   [階層データ ソース](#hierarchical-data-source)
-   [**igHierarchicalGrid との比較**](#comparison-hierarchical-grid)
    -   [類似点](#similarities)
    -   [相違点](#differences)
-   [**igTreeGrid の Web ページへの追加**](#adding-igTreeGrid)
    -   [必要なリソース](#required-resources)
    -   [初期化](#initialization)
-   [**サポートされる機能**](#suppored-features)
-   [**関連コンテンツ**](#related-content)
    -   [サンプル](#samples)

## <a id="introduction"></a>概要

`igTreeGrid` [CTP] はグリッドのコントロールで、階層データを一組の列に表示します (階層データは共通データ スキーマを共有する必要があります)。これは、子レイアウトがルート レイアウトと再帰的に同じ列の定義を持つ `igHierarchicalGrid` と比較できます。

`igTreeGrid` には設定可能な展開インジケータがあります。このインジケータは既存の左端の列内にインラインで描画することができます([renderExpandColumn](%%jQueryApiUrl%%/ui.igTreeGrid#options:renderExpandColumn) API を参照)。展開は、別のルックアンドフィールでもカスタマイズできます([ファイル エクスプローラー](%%NewSamplesUrl%%/tree-grid/file-explorer) のサンプルを参照)。

`igTreeGrid` は、`igGrid`/`igHierarchicalGrid` のいくつかの機能をサポートします。詳細は、[サポートされている機能](#suppored-features) のセクションを参照してください。

>**注:** `igTreeGrid` はスタンドアローンのコントロールで、`igGrid` コントロールの単なるエクステンションではありませんが、`igGrid` API は `igTreeGrid` にも適用できます。サポートされる各 `igGrid` API を実行時に使用するには、`$(“.selector”).igGrid()` 構文を使用、または [gridInstance](%%jQueryApiUrl%%/ui.igTreeGrid#methods:gridInstance) API のメソッドを使用できます。

![](images/igTreeGrid_Overview_1.png)

## <a id="data-binding"></a>データ バインディング

`igTreeGrid` は、フラットと階層構造の 2 つの型のデータソースをサポートします。フラットと階層データ ソースの違いは、以下の各セクションで説明します。データ ソースの型は、[hierarchicalDataSource](%%jQueryApiUrl%%/ui.igTreeGrid#options:hierarchicalDataSource) オプションで設定されます。デフォルトで true に設定されています。

### <a id="flat-data-source"></a>フラット データ ソース

フラット データ ソースは、オブジェクトの配列で構成されます。各オブジェクトは、プライマリー キー/外部キーの関係で、親オブジェクトとリンクされます。

**JavaScript の場合:**

```
var flatDS = [
      { "employeeID": 0, "PID": -1, "firstName": "Andrew", "lastName": "Fuller", "reportsTo": "-" },
      { "employeeID": 1, "PID": -1, "firstName": "Jonathan", "lastName": "Smith", "reportsTo": "-" },
      { "employeeID": 2, "PID": -1, "firstName": "Nancy", "lastName": "Davolio", "reportsTo": "-" },
      { "employeeID": 3, "PID": -1, "firstName": "Steven", "lastName": "Buchanan", "reportsTo": "-" },
      // sub of ID 1
      { "employeeID": 4, "PID": 0, "firstName": "Janet", "lastName": "Leverling", "reportsTo": "0" },
      { "employeeID": 5, "PID": 0, "firstName": "Laura", "lastName": "Callahan", "reportsTo": "0" },
      { "employeeID": 6, "PID": 0, "firstName": "Margaret", "lastName": "Peacock", "reportsTo": "0" },
      { "employeeID": 7, "PID": 0, "firstName": "Michael", "lastName": "Suyama", "reportsTo": "0" },
      // sub of ID 4
      { "employeeID": 8, "PID": 4, "firstName": "Anne", "lastName": "Dodsworth", "reportsTo": "4" },
      { "employeeID": 9, "PID": 4, "firstName": "Danielle", "lastName": "Davis", "reportsTo": "4" },
      { "employeeID": 10, "PID": 4, "firstName": "Robert", "lastName": "King", "reportsTo": "4" }
];
```

以下のサンプルでは、`employeeID` がプライマリー キーを表し、`PID` プロパティが外部キーの関係を示しています。

2 つのキーの関係は、ツリー グリッドをインスタンス化する際に各オプションで確立されます。

**JavaScript の場合:**
```
$("#treegrid").igTreeGrid({
      dataSource: flatDS,
      key: "employeeID",
      foreignKey: "PID",
      hierarchicalDataSource: false,
      dataValueForRootLayout: -1 // This is the default
});
```
プライマリー キーの関係は、[key](%%jQueryApiUrl%%/ui.igTreeGrid#options:key) オプション (`igGrid` で定義) により設定されます。外部キーの関係は、[foreignKey](%%jQueryApiUrl%%/ui.igTreeGrid#options:foreignKey) オプションにより設定されます。[hierachicalDataSource](%%jQueryApiUrl%%/ui.igTreeGrid#options:hierachicalDataSource) オプションは、false に設定する必要があります。[dataValueForRootLayout](%%jQueryApiUrl%%/ui.igTreeGrid#options:dataValueForRootLayout) オプションはフラット データ ソースに固有で、対象のレコードをルート レコードとして識別する外部キーの値を示します。

## <a id="hierarchical-data-source"></a>階層データ ソース

階層データ ソースもオブジェクトの配列ですが、各オブジェクトは子データを含むプロパティ (配列) を持ちます。以下のコードは、階層データ ソースを示します。

**JavaScript の場合:**
```
var filesList = [
	{
		"name": "Documents", "dateModified": "9/12/2013", "type": "File Folder", "size": 4480, "files": [
			{ "name": "To do list.txt", "dateModified": "11/5/2013", "type": "TXT File", "size": 4448 },
			{ "name": "Work.txt", "dateModified": "9/12/2013", "type": "TXT File", "size": 32 }
		]
	},
	{
		"name": "Music", "dateModified": "6/10/2014", "type": "File Folder", "size": 5594, "files": [
		{
			"name": "AC/DC", "dateModified": "6/10/2014", "type": "File Folder", "size":2726, "files": [
				{ "name": "Stand Up.mp3", "dateModified": "6/10/2014", "type": "MP3 File", "size": 456 },
				{ "name": "T.N.T.mp3", "dateModified": "6/10/2014", "type": "MP3 File", "size": 1155 },
				{ "name": "The Jack.mp3", "dateModified": "6/10/2014", "type": "MP3 File", "size": 1115 }
			]
		},
		{
			"name": "WhiteSnake", "dateModified": "6/11/2014", "type": "File Folder", "size": 2868, "files": [
				{ "name": "Trouble.mp3", "dateModified": "6/11/2014", "type": "MP3 File", "size": 1234 },
				{ "name": "Bad Boys.mp3", "dateModified": "6/11/2014", "type": "MP3 File", "size": 522 },
				{ "name": "Is This Love.mp3", "dateModified": "6/11/2014", "type": "MP3 File", "size": 1112 }
			]
		}
		]
	}
];
```
ここで、files プロパティは子レイアウトのデータを示します。親データと子データ間の関係は、ツリー グリッドをインスタンス化する際に各オプションによって確立されます。

子レイアウトのデータは、[dataSourceLayoutKey](%%jQueryApiUrl%%/ui.igTreeGrid#options:dataSourceLayoutKey) オプションにより設定されます。

**JavaScript の場合:**
```
$("#treegrid").igTreeGrid({
      dataSource: filesList,
      dataSourceLayoutKey: "files"
});
```

## <a id="comparison-hierarchical-grid"></a>igHierarchicalGrid との比較

このセクションでは、`igTreeGrid` や `igHierarchicalGrid` をどのような時に使用するかアドバイスします。

>**注:** この比較では、2 つのコントロールがデータを同じデータ ソースにバインドできることを前提としています。

### <a id="similarities"></a>類似点

どちらも階層データの表示に使用します。

### <a id="differences"></a>相違点

`igTreeGrid` の場合:

-   データ列の 1 つで、展開されたセルをインラインで描画できます。
-   Column Fixing 機能をサポートします。
-   Group By 機能はサポートしません (グループ化はツリー グリッドに固有です)
-   より軽い DOM フットプリント。コントロールは 1 つの TABLE DOM エレメント内で描画されます (また、`igGrid` のインスタンスは 1 つのみが存在されます)。それだけでなく、`igHierarchicalGrid` は各子レイアウトに対して個別の TABLE DOM を描画します。TABLE エレメントには、1つの `igGrid` インスタンスが存在します。
-   行を拡張する場合は、アニメーションを使用しません (最初に、拡張されたすべての子レイアウトが遅延なく表示されます)。

`igHierarchicalGrid` の場合:

-   階層データ ソースのみが描画可能で、フラット データ ソースは描画できません。
-   仮想化 (連続のみ) をサポートします。
-   ルート レイアウトからの異なるデータ スキーマで、列レイアウトを描画できます。
-   各レイアウト ノードに対し、個別の `igGrid` インスタンスを作成します。`igTreeGrid` 内には 1 つの `igGrid` インスタンスがあり、すべてのレイアウトに対する `igGrid` API での動作に使用されます
-   各機能は、個別のレイアウトで動作します。
-   GroupBy 機能をサポートします。
-   行を拡張する場合は、アニメーションを使用します。

## <a id="adding-igTreeGrid"></a>igTreeGrid の Web ページへの追加

### <a id="required-resources"></a>必要なリソース

Infragistics Loaderを使用せずに、`igTreeGrid` を使用する場合は、以下の各ソースを参照する必要があります。

CSS ファイル

-   css\structure\infragistics.css
-   css\themes\infragistics\infragistics.theme.css

JavaScript ファイル

-   jquery.js
-   jqueryui.js
-   js\modules\infragistics.util.js
-   js\modules\infragistics.ui.shared.js
-   js\modules\infragistics.datasource.js
-   js\modules\infragistics.ui.grid.framework.js
-   js\modules\infragistics.ui.treegrid.js

#### <a id="initialization"></a>初期化

以下のコードは、スタンドアローンの展開された列で階層データ ソースを使用して、`igTreeGrid` を初期化します。

**JavaScript の場合:**
```
$(function () {
var filesList = [
	{
		  "name": "Documents", "dateModified": "9/12/2013", "type": "File Folder", "size": 4480, "files": [
				{ "name": "To do list.txt", "dateModified": "11/5/2013", "type": "TXT File", "size": 4448 },
				{ "name": "Work.txt", "dateModified": "9/12/2013", "type": "TXT File", "size": 32 }
		  ]
	},
	{
		  "name": "Music", "dateModified": "6/10/2014", "type": "File Folder", "size": 5594, "files": [
				{
					  "name": "AC/DC", "dateModified": "6/10/2014", "type": "File Folder", "size":2726, "files": [
							{ "name": "Stand Up.mp3", "dateModified": "6/10/2014", "type": "MP3 File", "size": 456 },
							{ "name": "T.N.T.mp3", "dateModified": "6/10/2014", "type": "MP3 File", "size": 1155 },
							{ "name": "The Jack.mp3", "dateModified": "6/10/2014", "type": "MP3 File", "size": 1115 }
					  ]
				},
				{
					  "name": "WhiteSnake", "dateModified": "6/11/2014", "type": "File Folder", "size": 2868, "files": [
							{ "name": "Trouble.mp3", "dateModified": "6/11/2014", "type": "MP3 File", "size": 1234 },
							{ "name": "Bad Boys.mp3", "dateModified": "6/11/2014", "type": "MP3 File", "size": 522 },
							{ "name": "Is This Love.mp3", "dateModified": "6/11/2014", "type": "MP3 File", "size": 1112 }
					  ]
				}
		  ]
	}
];
$("#treegrid").igTreeGrid({
	dataSource: filesList,
	autoGenerateColumns: false,
	columns: [
		  { headerText: "Name", key: "name", width: "250px", dataType: "string" },
		  { headerText: "Date Modified", key: "dateModified", width: "130px", dataType: "date"},
		  { headerText: "Type", key: "type", width: "230px", dataType: "string" },
		  { headerText: "Size in KB", key: "size", width: "130px", dataType: "number" }
	],
	dataSourceLayoutKey: "files",
	renderExpandColumn: true
});
});
```
### <a id="suppored-features"></a>サポートされる機能

`igTreeGrid` は、`igGrid` や `igHierarchicaGrid` と複数の同じ機能を共有します。他のグリッドと同様に、機能は [features](%%jQueryApiUrl%%/ui.iggrid_tg#options:features) オプション内で設定されます。以下のサンプルは、グリッド機能の設定方法を示します。

**JavaScript の場合:**
```
$("#treegrid").igTreeGrid({
      width: "800px",
      height:"400px",
      dataSource: filesList,
      autoGenerateColumns: true,
      
      dataSourceLayoutKey: "files",
      features: [
      {
            name: "Sorting"
      },
      {
            name: "Filtering"
      }]
});
```
`igTreeGrid` は、以下の各機能をサポートします。

- 列の固定

- 非表示

- フィルタリング – 一度にすべてのレイアウトで動作します。[dataSourceSettings.filtering](%%jQueryApiUrl%%/ui.igtreegrid#options:dataSourceSettings.filtering) オプションで、サブレベルのフィルタリングを設定できます。

- 並べ替え – 一度にすべてのレイアウトで動作します。[dataSourceSettings.sorting](%%jQueryApiUrl%%/ui.igtreegrid#options:dataSourceSettings.sorting) オプションで、サブレベルのフィルタリングを設定できます。

- 更新 - 新しい行の追加は、ルート レイアウトに対してのみ動作します。

- ページング – 許容範囲でのみ動作します

- サイズ変更

- 選択

- ツールチップ

- 複数列ヘッダー

>**注:** 列関連の機能 (列の固定、非表示および サイズ変更) は、すべてのレイアウトが同じ列を共有するため、すべてのレイアウトに対して機能的に影響を与えます。

>**注:** 各機能 API を使用する場合は、機能名はフルネームを使用する必要があります。例: `igGridFiltering`、`igGridSorting` など

## <a id="related-content"></a>関連コンテンツ

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [JSON のバインド](%%NewSamplesUrl%%/tree-grid/json-binding)

- [ファイル エクスプローラー](%%NewSamplesUrl%%/tree-grid/file-explorer)

- [貸借対照表](%%NewSamplesUrl%%/tree-grid/balance-sheet)

- [ASP.NET MVC ヘルパー](%%NewSamplesUrl%%/tree-grid/aspnet-mvc-helper)
                    

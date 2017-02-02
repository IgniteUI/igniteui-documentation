<!--
|metadata|
{
    "fileName": "igdatasource-igdatasource-overview",
    "controlName": "igDataSource",
    "tags": ["Getting Started"]
}
|metadata|
-->

# igDataSource の概要

## igDataSource の概要
`igDataSource` は、`igGrid` コントロールなどのデータ バインドされたコントロールと実際のデータ ソース間の仲介レイヤーとしての役割を果たす jQuery に基づくコンポーネントです。コンポーネントのデータのソースには、次のものがあります。

-   Web サービス (REST GET、WCF などから接続)
-   ローカル データ - JSON、XML、HTML Table、JavaScript 配列 (JSON および XML の文字列を含む)
-   関数が戻すデータ

>**注:** `igGrid` コントロールと違い、`igDataSource` コンポーネントはプレーン JavaScript クラスとして実装され、基本 jQuery ウィジェットは拡張しません。

## 機能
`igDataSource` コンポーネントは、以下の機能をそのままサポートしています。

-   ローカル (データはクライアント側に定義されています) およびリモート (データはサーバーから送信されています) のデータ バインド
-   ページング
-   並べ替え
-   フィルタリング
-   データ スキーマ サポート。多くのソースから一貫したフォーマットにデータを変換します。
-	スキーマ フィールド マッパー 
	
###  スキーマ フィールド マッパー 

スキーマ フィールドの定義は、dataType "object" の列にマッパー機能の設定が可能で、データソース レベルですべてのデータ処理に使用されます。 
これは、複合オブジェクトの特定の値にデータ処理を適用する場合に便利です。以下のデータ ソース構造がある場合:

**JavaScript の場合:**
	
```js
var data = [
	{ "ID": 0, "Name": "Bread", "Description": "Whole grain bread", "Category":  { "ID": 0, "Name": "Food", , "Date": "\/Date(1159660800000)\/"  } }
...
];
```

既成のデータ ソースは、複合オブジェクト構造であるため Category フィールドにデータ処理を適用できません。 
[フィールド](%%jQueryApiUrl%%/ig.datasource#options:settings.fields)のマッパー オプションでデータ抽出関数を定義でき、フィールドに使用されるデータを指定できるようになります。サブフィールドまたは複合データ
たとえば、データ操作を ID サブフィールドに基づいて実行する場合、ID 値を返すマッパー関数を設定できます。コード例 1 を参照できます。 

コード例 1: igGrid の列にマッパー関数を定義します。

**JavaScript の場合:**
	
```js
var ds = new $.ig.DataSource({
	type: "json", 
	dataSource: data, 
	 schema: {
		fields: [{
			name: "ID", type:"number"
		}, {
			name: "Name", type:"string"
		}, {
			name: "Category" , type:"object", mapper: function(record){							
				return record.Category.ID;
			}
		}]         
	}
});
```

この関数は、データ レコードへの参照を保持する単一パラメーターを受け入れ、戻り値を返し、関連フィールドのすべてのデータ処理に使用されます。
フィールドの dataType が "object" であるため、その他のフィールドのデータ変換が適用されずに戻り値が使用されることに注意してください。そのため、追加データ タイプ変換は関数で処理する必要があります。
たとえば、クライアント データソースに文字列形式で保存されるデータ値は、マッパーに返される前に処理する必要があります。それ以外の場合、文字列値として見なされます。

マッパー関数で文字列を日付へ変換

**JavaScript の場合:**
	
```js
var ds = new $.ig.DataSource({
	type: "json", 
	dataSource: data, 
	 schema: {
		fields: [{
			name: "ID", type:"number"
		}, {
			name: "Name", type:"string"
		}, {
			name: "Category" , type:"object", mapper: function(record){							
					var ticks = record.Category.Date.replace("Date(", "").replace(")", "");
					return new Date( parseInt(ticks)) ;
			}
		}]         
	}
});
```

> **注:** この関数は、データ ソースが関連フィールドのデータを抽出する必要がある度に呼び出されます。これには、フィールドに関連するデータ操作処理が含まれます。
 そのため、複雑なデータの抽出および (または) 計算ロジックがパフォーマンスに影響する場合があることに注意してください。

## データ ソースの Web ページへの追加
1.  ご使用の HTML ページで、必要な JavaScript ライブラリを参照します。

	**HTML の場合:**
	
	```html
	<script type="text/javascript" src="jquery-1.4.4.min.js"></script>
	<script type="text/javascript" src="jquery-ui.min.js"></script>
	<script type="text/javascript" src="infragistics.core.js"></script>
	```

2.  次に、`igDataSource` のデータ ソースとしての役割を果たす JSON 配列を作成します。

	**JavaScript の場合:**
	
	```js
	var products = [];
	products[0] = { "ProductID": 1, "Name": "Adjustable Race", "ProductNumber": "AR-5381" };
	products[1] = { "ProductID": 2, "Name": "Bearing Ball", "ProductNumber": "BA-8327" };
	products[2] = { "ProductID": 3, "Name": "BB Ball Bearing", "ProductNumber": "BE-2349" };
	products[3] = { "ProductID": 4, "Name": "Headset Ball Bearings", "ProductNumber": "BE-2908" };
	products[4] = { "ProductID": 316, "Name": "Blade", "ProductNumber": "BL-2036" };
	products[5] = { "ProductID": 317, "Name": "LL Crankarm", "ProductNumber": "CA-5965" };
	products[6] = { "ProductID": 318, "Name": "ML Crankarm", "ProductNumber": "CA-6738" };
	products[7] = { "ProductID": 319, "Name": "HL Crankarm", "ProductNumber": "CA-7457" };
	products[8] = { "ProductID": 320, "Name": "Chainring Bolts", "ProductNumber": "CB-2903" };
	products[8] = { "ProductID": 321, "Name": "Chainring Nut", "ProductNumber": "CN-6137" };
	```

3.  ご使用の HTML ドキュメントの body タグで、HTML テーブルを追加します。
    
	**HTML の場合:**
	
	```html
	<table id="table1">
	</table>
	```

4.  次の jQuery テンプレートを作成します。

	**JavaScript の場合:**

	```js
	var rowTemplate = "<tr> <td> ${ProductID} </td> <td> ${Name} </td> <td> ${ProductNumber}</td></tr>"
	```

5.  `$(document).ready()` イベント ハンドラーの中で、新しい `igDataSource` インスタンスを作成し、それをローカル JSON 文字列にバインドし、そのデータを jQuery テンプレートを使用してテーブル要素に適用します。

	**JavaScript の場合:**
	
	```js
	<script type="text/javascript">
	    $(document).ready(function () {
	        var ds = new $.ig.DataSource({ type: "json", dataSource: products });
	        ds.dataBind();
	        $($.ig.tmpl(rowTemplate, ds.dataView())).appendTo("#table1 tbody");
	    });
	</script>
	```

	>**注:** datasource プロパティは JSON データを保持する products 変数に設定されています。 

6.  HTML ドキュメントを保存して実行します。
	
	![](images/igDataSource_Overview_01.png)

 ###  <a id="filter-by-text"></a>Filter by Text 
The `igDataSource` component provides a way to search for a specific words or phrases in all of its fields. This is done by the [filterByText](%%jQueryApiUrl%%/ig.datasource#options:methods.filterByText) method.

**In Javascript:**
	
```js
var ds = new $.ig.DataSource({
	type: "json", 
	dataSource: data, 
	schema: {
		fields: [{
			name: "ID", type:"number"
		}, {
			name: "Name", type:"string"
		}]         
	}
}), fd;
ds.filterByText("bread");
fd = ds.dataView();
// Result:
// fd = [{
//	 ID: 0,
// 	 Name: "Bread"
// }]
```   
 
If a field has a formatter function the method will take it into account and it will find the records that has the corresponding value. 

**In Javascript:**

```js
var ds = new $.ig.DataSource({
	type: "json", 
	dataSource: data, 
	schema: {
		fields: [{
			name: "ID", type:"number"
		}, {
			name: "Name", type:"string", formatter: function(val, record) {
				return val == "Bread" ? "Tasty Bread" : val;
			}
		}]         
	}
}), fd;
fd = ds.filterByText("tasty");
fd = ds.dataView();
// Result:
// fd = [{
//	 ID: 0,
// 	 Name: "Bread"
// }]
```

There are a few specific cases that are worth pointing out:

1.  Search for several words at a time - if the expression consists of 2 or more words separated by space the method will search for a value that contains all of the words regardless of the order.

**In Javascript:**

```js
ds.filterByText("bread tasty");
```

2.  Search for a phrase - surrounding the text with double quotes will make the method search for the words in the order they were passed. This also includes the formatted values.

**In Javascript:**

```js
ds.filterByText('"tasty bread"');
```

3.  Filter a set of fields - the method provides a way to search for text only in specific fields. They are passed as a parameter in the form of an array.

**In Javascript:**

```js
ds.filterByText("bread", [{name: "Name", type: "string"}]);
```
 
4. If some of the words in the expression are a substring of another word they will be ignored. For example if the expression looks like this: "1 2 12", the method will filter by "12" only.

Example of how this functionality works could be found below :

**In Javascript:**

<div style="700px; overflow-y: scroll">
<div >

```js
<!DOCTYPE html>
<html>
	<head>
		<title> Filter By Text </title>
		<script type="text/javascript" src="jquery-1.4.4.min.js"></script>
		<script type="text/javascript" src="jquery-ui.min.js"></script>
		<script type="text/javascript" src="infragistics.core.js"></script>
		
		<script type="text/javascript">
			$(function () {
				var products = [], ds, table,
					rowTemplate = "<tr> <td> ${ProductID} </td> <td> ${Name} </td> <td> ${ProductNumber}</td> </tr>";
				
				products[0] = { "ProductID": 1, "Name": "Adjustable Race", "ProductNumber": "AR-5381" };
				products[1] = { "ProductID": 2, "Name": "Bearing Ball", "ProductNumber": "BA-8327" };
				products[2] = { "ProductID": 3, "Name": "BB Ball Bearing", "ProductNumber": "BE-2349" };
				products[3] = { "ProductID": 4, "Name": "Headset Ball Bearings", "ProductNumber": "BE-2908" };
				products[4] = { "ProductID": 316, "Name": "Blade", "ProductNumber": "BL-2036" };
				products[5] = { "ProductID": 317, "Name": "LL Crankarm", "ProductNumber": "CA-5965" };
				products[6] = { "ProductID": 318, "Name": "ML Crankarm", "ProductNumber": "CA-6738" };
				products[7] = { "ProductID": 319, "Name": "HL Crankarm", "ProductNumber": "CA-7457" };
				products[8] = { "ProductID": 320, "Name": "Chainring Bolts", "ProductNumber": "CB-2903" };
				products[9] = { "ProductID": 321, "Name": "Chainring Nut", "ProductNumber": "CN-6137" };
				
				ds = new $.ig.DataSource({ 
					type: "json", 
					dataSource: products,
					schema: {
						fields: [{
							name: "ProductID", type:"number"
						}, {
							name: "Name", type:"string"
						}, {
							name: "ProductNumber", type:"string"
						}]         
					}
				});
				ds.dataBind();
				table = $("#table1 tbody")
				$($.ig.tmpl(rowTemplate, ds.dataView())).appendTo(table);
				$("#btn").on("click", function(e) {
					var val = $('#searchBox').val();
					ds.filterByText(val);
					table.empty();
					$($.ig.tmpl(rowTemplate, ds.dataView())).appendTo(table);
				});
			});
		</script>
		<style>
			#table1 {
				border:1px solid #000000; 
				border-spacing: 0;
			}
			#table1 th {
				background-color: #b1b1b1;			
			}
			#table1 th, #table1 td {
				text-align:left; 
				border:1px solid #000000; 
				padding:4px;
			}
		</style>
	</head>
	<body>
		<input type="text" id="searchBox" />
		<input id="btn" type="button" value="Filter" />
		<div style="width: 10px; height: 10px;"></div>
		<table id="table1">
			<thead>
				<tr>
					<th>Product ID</th>
					<th>Name</th>
					<th>Product Number</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</body>
</html>
```
</div>
</div>

##関連トピック

-   [igGrid/igDataSource アーキテクチャの概要](igGrid-igDataSource-Architecture-Overview.html)
-   [DataSchema を使用したデータ変換の実行 (igDataSource)](igDataSource-Using-DataSchema.html)

 

 



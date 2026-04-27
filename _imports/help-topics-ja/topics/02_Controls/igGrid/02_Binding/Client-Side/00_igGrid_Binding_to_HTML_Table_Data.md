<!--
|metadata|
{
    "fileName": "iggrid-binding-to-html-table-data",
    "controlName": "igGrid",
    "tags": ["Data Binding","Grids","How Do I"]
}
|metadata|
-->

# igGrid を HTML テーブル データにバインディング

## 概要

%%ProductName%%® `igGrid` では、`igDataSource` コントロールを介して既存のプレーンな HTML テーブルにバインドできます。HTML テーブルへのバインドには、考慮すべき点がいくつかあります。

-   `dataSource` を指定する必要はありません。バインドするテーブルに `igGrid` ウィジェットのインスタンスを作成する場合、
-   データの展開、解析、バインド、および書式設定の処理がデータ ソース コントロールを通して実行されます。これは、グリッドがバインドされると、プレーンな HTML テーブルのテーブル BODY がクリアされ、データは、JavaScript オブジェクトの配列の形式でデータ ソースに格納されることを意味します。つまり、テーブルがすでにクリアされているため、同じ方法 (TABLE からデータを取得する) でグリッドに再バインドすることはできません。
-   ある HTML テーブルからデータを取得し、別の (おそらく空の) HTML テーブルにグリッド Widget のインスタンスを作成したい場合は、データを含む HTML テーブルをポイントする DOM 要素を、グリッドの `dataSource` オプションに設定する必要があります。リスト 1 はその方法を示しています。

**リスト 1:** dataSource としての HTML TABLE

**JavaScript の場合:**

```js
dataSource: $('#myTable')[0]
```

> **注:** データを含む DOM 要素を選択するにはインデクサーが必要です。

-   HTML テーブル データには名前がないため (キーがなくデータ セルのみ)、列キーが 1 から n まで自動的に生成されます。ここで「n」は、HTML テーブルにある列の数です。
-   HTML テーブルにすでにヘッダー (複数の TH を持つ THEAD 要素) が含まれている場合は、それらが自動的に解析され、jQuery グリッドの `headerText` として設定されます。
-   グリッドがデータ バインドされると、ページング、並べ替え、フィルタリング、選択などのすべてのグリッド機能がデフォルトのまま機能します。
-   列の `headerText` または `dataType` をオーバーライドするために、コードに設定を指定することもできます。たとえば、特定の列に整数が含まれていることが分かっていて、これを文字列として解析したくない場合に使用します。

## 既存のテーブルへのバインド

リスト 2 は、既存の HTML テーブルにグリッドをバインドし、テーブル内の一部の列だけを表示するよう構成する方法を示す完全な例です。

**リスト 2:** 同じ HTML テーブルへのバインド

**JavaScript の場合:**

```js
$("#t1").igGrid({          
    autoGenerateColumns: false,
    columns: [
    	{ headerText: "ProductID", key: "ProductID", width: "100px", dataType: "number" },
    	{ headerText: "Name", key: "Name", width: "80px", dataType: "string" },
    ],
    defaultColumnWidth: 150,
    features: [
    	{
    		name: 'Sorting',
    		type: 'local'
    	}
    ]
}); 
```



**HTML の場合:**

```html
<table id="t1" cellpadding="5" cellspacing="0" border="1">
	<thead>
        <tr>
            <th>
               Product ID 
            </th>
            <th>
              Product Name
            </th>
            <th>
              Product Number  
            </th>
        </tr>
	</thead>
    <tbody>
        <tr><td>1</td><td>Adjustable Race</td><td>AR-5381</td></tr>
        <tr><td>2</td><td>Bearing Ball</td><td>BA-8327</td></tr>
        <tr><td>3</td><td>BB Ball Bearing</td><td>BE-2349</td></tr>
        <tr><td>4</td><td>Headset Ball Bearings</td><td>BE-2908</td></tr>
        <tr><td>316</td><td>Blade</td><td>BL-2036</td></tr>
        <tr><td>317</td><td>LL Crankarm</td><td>CA-5965</td></tr>
        <tr><td>318</td><td>ML Crankarm</td><td>CA-6738</td></tr>
        <tr><td>319</td><td>HL Crankarm</td><td>CA-7457</td></tr>
        <tr><td>320</td><td>Chainring Bolts</td><td>CB-2903</td></tr>
        <tr><td>321</td><td>Chainring Nut</td><td>CN-6137</td></tr>
    </tbody>
</table>
```

## 新しいテーブルへのバインド

リスト 3 は、新しい HTML テーブルにグリッドをバインドし、Table データを解析するときに文字列のデフォルトのデータ型をオーバーライドする方法を示しています。jQuery Grid が HTML にバインドされるとき、すべてのキーに 1 から n まで名前が付けられます。ここで「n」はテーブルの行にあるセルの数です。

**リスト 3:** 新しい HTML テーブルへのバインド

**JavaScript の場合:**

```js
$("#t2").igGrid({
    columns: [
         {key: 1, width: "100px", dataType: "number", headerText: "[Custom Header]" }
    ],
    defaultColumnWidth: 150,
    features: [
        {
        name: 'Sorting',
        type: 'local'
        }
     ],
     dataSource: $("#t1")[0]
}); 
```

**HTML の場合:**

```html
<table id="t1" cellpadding="5" cellspacing="0" border="1">
    <thead>
        <tr>
            <th>
               Product ID 
            </th>
            <th>
              Product Name
            </th>
            <th>
              Product Number  
            </th>
        </tr>
    </thead>
    <tbody>
        <tr><td>1</td><td>Adjustable Race</td><td>AR-5381</td></tr>
        <tr><td>2</td><td>Bearing Ball</td><td>BA-8327</td></tr>
        <tr><td>3</td><td>BB Ball Bearing</td><td>BE-2349</td></tr>
        <tr><td>4</td><td>Headset Ball Bearings</td><td>BE-2908</td></tr>
        <tr><td>316</td><td>Blade</td><td>BL-2036</td></tr>
        <tr><td>317</td><td>LL Crankarm</td><td>CA-5965</td></tr>
        <tr><td>318</td><td>ML Crankarm</td><td>CA-6738</td></tr>
        <tr><td>319</td><td>HL Crankarm</td><td>CA-7457</td></tr>
        <tr><td>320</td><td>Chainring Bolts</td><td>CB-2903</td></tr>
        <tr><td>321</td><td>Chainring Nut</td><td>CN-6137</td></tr>
    </tbody>
</table>
  
<table id="t2"></table>
```

**サンプル**
<div class="embed-sample">
   [%%SamplesEmbedUrl%%/grid/html-binding](%%SamplesEmbedUrl%%/grid/html-binding)
</div>

## 既知の問題と制限

`igGrid` には、考慮が必要な[既知の制限](igGrid-Known-Issues.html)があります。

## 関連トピック

[igGrid の概要](igGrid-Overview.html)

 

 



<!--
|metadata|
{
    "fileName": "igolapflatdatasource-adding-to-an-html-page",
    "controlName": "igOlapFlatDataSource",
    "tags": ["Data Binding","Getting Started","Grids","How Do I"]
}
|metadata|
-->

# igOlapFlatDataSource の HTML ページへの追加

## トピックの概要
### 目的

このトピックは、`igOlapFlatDataSource`™ コントロールを HTML ページに追加しデータへバインドする方法をコード例を用いて示します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

**概念**

-   オンライン解析処理 (OLAP)

**トピック**

- [igOlapFlatDataSource の概要](igOlapFlatDataSource-Overview.html): このトピックは、`igOlapFlatDataSource` コンポーネントおよびその機能の概要を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**igOlapFlatDataSource を HTML ページに追加 - 概念的な概要**](#conceptual-overview)
    -   [igOlapFlatDataSource を HTML ページに追加の概要](#summary)
    -   [要件](#requirements)
    -   [手順](#steps)
-   [**igOlapFlatDataSource を HTML ページに追加 - 手順**](#procedure)
    -   [概要](#procedure-introduction)
    -   [手順](#procedure-steps)
    -   [全コード](#procedure-full-code)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="conceptual-overview"></a>igOlapFlatDataSource を HTML ページに追加 - 概念的な概要
### <a id="summary"></a>igOlapFlatDataSource を HTML ページに追加の概要

`igOlapFlatDataSource` コンポーネントにより、JavaScript クライアント環境で %%ProductName%%™ ピボット グリッド コントロールにフラット データ収集を送ることができるようになります。これによりそのようなデータ セット上で多次元 (OLAP) 解析が可能になります。

`igOlapFlatDataSource` コンポーネントを正しく機能させるには、その [dataSource](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options) と metadata のプロパティを指定しなければなりません。`igOlapFlatDataSource` の初期化は、`igPivotDataSelector` ™、`igPivotGrid` ™ および `igPivotView`™ といった %%ProductName%% ピボットグリッド関連コントロールのいずれかとともに使用される場合には必要ありません (ほとんどの場合が当てはまります)-  (`igOlapFlatDataSource` の初期化は、コンポーネントが独自に使用される場合にのみ必要です)。

`igOlapFlatDataSource` コンポーネントをインスタンス化する場合、`dataSource` と metadata の2 つのパラメータが必要です。`dataSource` パラメータは使用すべき入力データを指定し、metadata パラメータは、入力データをどのように OLAP データとして処理するかを指定します。つまり、ディメンション、階層、メジャー等をどのように生成するか、です。内部では、`igOlapFlatDataSource` は `igDataSource`™ インスタンスを使用します。dataSource プロパティを指定すると、`igDataSource` インスタンスを指定するか、`igDataSource` によりサポートされるデータ ソースに設定できます。

### <a id="requirements"></a>要件

以下は、`igOlapFlatDataSource` を HTML ページへ追加するための全般的な要件です。

-   データ要件 -  `igDataSource` インスタンス、または `igDataSource` によりサポートされるデータのタイプ
-   必要な JavaScript ファイル:
    -   jQuery ライブラリへの参照
    -   %%ProductName%% JavaScript ファイルへの参照

Infragistics® JavaScript ファイルは、デフォルトで %%ProductName%% インストール パス下の JavaScript モジュール フォルダーに配置されます。

-   Jquery-[versionNumber].js (query-1.9.0.js など) - jQuery ライブラリ (jQuery サイトで使用可能)
-   `infragistics.util.js`、`infragistics.util.jquery.js` - 一部の %%ProductName%%™ コンポーネントで使用される共有非 UI ロジックを含む JavaScript ファイル
-   `infragistics.olapxmladatasource.js` - igOlapFlatDataSource コンポーネントを含む JavaScript ファイル
-   (条件付き - Infragistics ローダー が使用されます) `infragistics.loader.js` - コンポーネントにより必要なすべてのインフラジスティックス JavaScript および CSS のファイルを自動で読み込むために使用可能なインフラジスティックス ローダー コンポーネント

### <a id="steps"></a>手順

以下は、`igOlapFlatDataSource` を使用するための概念的なステップです。

1. 必要なリソースへの参照の追加

2. 入力データを準備します。

3. `igOlapFlatDataSource` オブジェクトを定義します。

4. 必要な初期化オプションを構成します。

5. `igOlapFlatDataSource` を初期化します。



## <a id="procedure"></a>igOlapFlatDataSource を HTML ページに追加 - 手順
### <a id="procedure-introduction"></a>概要

以下の手順は、オブジェクトの JavaScript 配列を入力データとして使用する `igOlapFlatDataSource` を定義し初期化します。

手順の最初のステップは、必要な JavaScript ファイルを参照するために可能な両方の方法を提供します。Infragistics Loader  を使用する場合と手動による場合です。

手順は、JavaScript 配列がデータ ソースとして設定され、シンプルなメタデータ宣言を持つ `igOlapFlatDataSource` インスタンスを定義します。

### <a id="procedure-steps"></a>手順

ここでは、`igOlapFlatDataSource` コンポーネントを HTML ページに追加する手順について説明します。

1. 必要なリソースへの参照を追加します。

	-   (推奨) Infragistics Loader を使用する場合
	     
		Loader ファイルへの参照を追加します。(個別のファイルに参照を配置する必要はありません)
	
		**HTML の場合:**
	
	    ```html
	    <script src="js/jquery-1.9.0.js" type="text/javascript"></script>
	    <script src="js/infragistics.loader.js" type="text/javascript"></script>
	    ```
	
	-   ファイルを手動で参照する場合:
	
		それぞれの必要ファイルへ個別の参照を追加します。
	
	    ```
	    <script src="js/jquery-1.9.0.js" type="text/javascript"></script>
	    <script src="js/infragistics.util.js" type="text/javascript"></script>
		<script src="js/infragistics.util.jquery.js" type="text/javascript"></script>
	    <script src="js/infragistics.olapflatdatasource.js" type="text/javascript"></script>
	    ```
	
	>**注:** jQuery バージョン番号は変わる場合があります。コードにリストされるバージョン番号は、本書の執筆時点では最新です。

2. 入力データを準備します。

	JavaScript データ配列を定義します。
	
	**JavaScript の場合:**
	
	```js
	$.ig.loader(function(){
	   var data = [{ "ProductCategory": "Clothing", "UnitPrice": 12.81, "SellerName": "Stanley Brooker", "Country": "Bulgaria", "City": "Plovdiv", "Date": "2007-01-01", "UnitsSold": 282 },
	   { "ProductCategory": "Clothing", "UnitPrice": 49.57, "SellerName": "Elisa Longbottom", "Country": "US", "City": "New York", "Date": "2007-01-05", "UnitsSold": 296 },
	   { "ProductCategory": "Bikes", "UnitPrice": 3.56, "SellerName": "Lydia Burson", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "2007-01-06", "UnitsSold": 68 },
	   { "ProductCategory": "Accessories", "UnitPrice": 85.58, "SellerName": "David Haley", "Country": "UK", "City": "London", "Date": "2007-01-07", "UnitsSold": 293 },
	   { "ProductCategory": "Components", "UnitPrice": 18.13, "SellerName": "John Smith", "Country": "Japan", "City": "Yokohama", "Date": "2007-01-08", "UnitsSold": 240 },
	   { "ProductCategory": "Clothing", "UnitPrice": 68.33, "SellerName": "Larry Lieb", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "2007-01-12", "UnitsSold": 456 },
	   { "ProductCategory": "Components", "UnitPrice": 16.05, "SellerName": "Walter Pang", "Country": "Bulgaria", "City": "Sofia", "Date": "2007-02-09", "UnitsSold": 492 }];
	   // Add all the remaining JS code here
	});
	```
	>**注:** 手順からの残りのすべての JavaScript コードは `igLoader`™ に渡される関数内部で追加しなければなりません。これは、すべての必要なリソースが読み込みを完了すると実行されます。

3. `igOlapFlatDataSource` オブジェクトを定義します。

	コンストラクター関数を呼び出すことにより新しい `$.ig.OlapFlatDataSource` オブジェクトを作成し、データ ソース オプションをプロパティとして含む JavaScript オブジェクトを渡します。最低限、`dataSource` オプションと metadata オプションを指定します。

4. 必要な初期化オプションを構成します。

	以下のコードは、JavaScript 配列がデータ ソースとして設定され、シンプルなメタデータ宣言を持つ `igOlapFlatDataSource` インスタンスを定義します。メタデータの定義方法については、「[メタデータの定義 (igOlapFlatDataSource)](igOlapFlatDataSource-Defining-Metadata.html)」を参照してください。

	**JavaScript の場合:**
	
	```js
	var dataSource = new $.ig.OlapFlatDataSource({
	    dataSource: data,
	    metadata: {
	        cube: {
	            name: "Sales",
	            measuresDimension: {
	                caption: "Measures",
	                measures: [
	                    {  name: "Units Sold", aggregator: function (items, cellMetadata) {
	                        var sum = 0;
	                        $.each(items, function (index, item) {
	                            sum += item.UnitsSold;
	                        });
	                        return sum;}},
	            },
	            dimensions: [ 
	                {
	                    name: "Seller", hierarchies: [{
	                        name: "Seller", levels: [
	                            {
	                                name: "All Sellers",
	                                memberProvider: function (item) { return "All Sellers"; }
	                            },
	                            {
	                                name: "Seller Name",
	                                memberProvider: function (item) { return item.SellerName; }
	                            }]
	                    }]
	                }]
	        }
	    }
	});
	```

5. データ ソースを初期化します。

	ルート [OlapMetadataTreeItem](%%jQueryApiUrl%%/ig.OlapMetadataTreeItem) (メタデータ ツリーのルート ノード) で解決される [promise](http://api.jquery.com/deferred.promise/) オブジェクトを返す OlapFlatDataSource オブジェクトの `initialize()` メソッドを呼び出すことによって、フラットなデータ ソースを初期化します。これは、初期化が非同期処理であるためです。promise オブジェクトは、操作が完了または失敗 ([done](http://api.jquery.com/deferred.done/)、[fail](http://api.jquery.com/deferred.fail/) など) したときにコールバックを開始および実行できるメソッドを公開する、非同期の操作をカプセル化するオブジェクトです。
	
	>**注:** promise (1.6 以前) を実装しない jQuery のバージョンを使用している場合、同じインターフェイスを提供するカスタム フォールバックは自動で使用されます。



### <a id="procedure-full-code"></a>全コード

以下のコードは、`igOlapFlatDataSource` コンポーネントの新しいインスタンスの作成および初期化を示しています。必要な JavaScript リソースを参照するオルタナティブが提供されます。Infragistics Loader を使用する場合としない場合の両方です。

### Infragistics Loader を使用した OlapFlatDataSourceのインスタンス化 :

**JavaScript の場合:**

```js
$.ig.loader({
    scriptPath: '[path to js folder]',
    cssPath: '[path to css folder]',
    resources: 'igOlapFlatDataSource'
});
$.ig.loader(function () {
    var data = [{ "ProductCategory": "Clothing", "UnitPrice": 12.81, "SellerName": "Stanley Brooker", "Country": "Bulgaria", "City": "Plovdiv", "Date": "2007-01-01", "UnitsSold": 282 },
   { "ProductCategory": "Clothing", "UnitPrice": 49.57, "SellerName": "Elisa Longbottom", "Country": "US", "City": "New York", "Date": "2007-01-05", "UnitsSold": 296 },
   { "ProductCategory": "Bikes", "UnitPrice": 3.56, "SellerName": "Lydia Burson", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "2007-01-06", "UnitsSold": 68 },
   { "ProductCategory": "Accessories", "UnitPrice": 85.58, "SellerName": "David Haley", "Country": "UK", "City": "London", "Date": "2007-01-07", "UnitsSold": 293 },
   { "ProductCategory": "Components", "UnitPrice": 18.13, "SellerName": "John Smith", "Country": "Japan", "City": "Yokohama", "Date": "2007-01-08", "UnitsSold": 240 },
   { "ProductCategory": "Clothing", "UnitPrice": 68.33, "SellerName": "Larry Lieb", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "2007-01-12", "UnitsSold": 456 },
   { "ProductCategory": "Components", "UnitPrice": 16.05, "SellerName": "Walter Pang", "Country": "Bulgaria", "City": "Sofia", "Date": "2007-02-09", "UnitsSold": 492 }];
    var dataSource = new $.ig.OlapFlatDataSource({
        dataSource: data,
        metadata: {
            cube: {
                name: "Sales",
                measuresDimension: {
                    caption: "Measures",
                    measures: [
                        {  name: "Units Sold", aggregator: function (items, cellMetadata) {
                            var sum = 0;
                            $.each(items, function (index, item) {
                                sum += item.UnitsSold;
                            });
                            return sum;}},
                },
                dimensions: [ 
                    {
                        name: "Seller", hierarchies: [{
                            name: "Seller", levels: [
                                {
                                    name: "All Sellers",
                                    memberProvider: function (item) { return "All Sellers"; }
                                },
                                {
                                    name: "Seller Name",
                                    memberProvider: function (item) { return item.SellerName; }
                                }]
                        }]
                    }]
            }
        }
    });    
    var promise = dataSource.initialize();
    promise.done(function (metadataTree) {
            // do something when the data source is initialized
        }).fail(function (error) {
            throw error;
        });
});
```

### Infragistics Loader を使用しない OlapFlatDataSourceのインスタンス化 :

**JavaScript の場合:**

```js
$(function() {
    var data = [{ "ProductCategory": "Clothing", "UnitPrice": 12.81, "SellerName": "Stanley Brooker", "Country": "Bulgaria", "City": "Plovdiv", "Date": "2007-01-01", "UnitsSold": 282 },
   { "ProductCategory": "Clothing", "UnitPrice": 49.57, "SellerName": "Elisa Longbottom", "Country": "US", "City": "New York", "Date": "2007-01-05", "UnitsSold": 296 },
   { "ProductCategory": "Bikes", "UnitPrice": 3.56, "SellerName": "Lydia Burson", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "2007-01-06", "UnitsSold": 68 },
   { "ProductCategory": "Accessories", "UnitPrice": 85.58, "SellerName": "David Haley", "Country": "UK", "City": "London", "Date": "2007-01-07", "UnitsSold": 293 },
   { "ProductCategory": "Components", "UnitPrice": 18.13, "SellerName": "John Smith", "Country": "Japan", "City": "Yokohama", "Date": "2007-01-08", "UnitsSold": 240 },
   { "ProductCategory": "Clothing", "UnitPrice": 68.33, "SellerName": "Larry Lieb", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "2007-01-12", "UnitsSold": 456 },
   { "ProductCategory": "Components", "UnitPrice": 16.05, "SellerName": "Walter Pang", "Country": "Bulgaria", "City": "Sofia", "Date": "2007-02-09", "UnitsSold": 492 }];
    var dataSource = new $.ig.OlapFlatDataSource({
        dataSource: data,
        metadata: {
            cube: {
                name: "Sales",
                measuresDimension: {
                    caption: "Measures",
                    measures: [
                        {  name: "Units Sold", aggregator: function (items, cellMetadata) {
                            var sum = 0;
                            $.each(items, function (index, item) {
                                sum += item.UnitsSold;
                            });
                            return sum;}},
                },
                dimensions: [ 
                    {
                        name: "Seller", hierarchies: [{
                            name: "Seller", levels: [
                                {
                                    name: "All Sellers",
                                    memberProvider: function (item) { return "All Sellers"; }
                                },
                                {
                                    name: "Seller Name",
                                    memberProvider: function (item) { return item.SellerName; }
                                }]
                        }]
                    }]
            }
        }
    });    
    var promise = dataSource.initialize();
    promise.done(function (metadataTree) {
            // do something when the data source is initialized
        }).fail(function (error) {
            throw error;
        });
});
```



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ASP.NET MVC ヘルパーを使用した igOlapFlatDataSource の追加](igOlapFlatDataSource-Adding-Using-MVC-Helper.html): このトピックは、 ASP.NET MVC ヘルパーを使用して ASP.NET MVC アプリケーションへ `igOlapFlatDataSource` コントロールを追加する方法についての概念と詳しい手順を説明します。

- [メタデータの定義 (igOlapFlatDataSource)](igOlapFlatDataSource-Defining-Metadata.html): このトピックは、フラットなデータが多次元 (OLAP) フォームを提示できるように `igOlapFlatDataSource` で使用されるデータに対してメタデータを定義する方法を説明します。

- [igPivotDataSelector の追加](igPivotDataSelector-Adding.html): これは、`igPivotDataSelector` を HTML ページと ASP.NET MVC アプリケーションへ追加する方法を示すトピックのグループです。

- [igPivotGrid の追加](igPivotGrid-Adding.html): これは、`igPivotGrid` を HTML ページと ASP.NET MVC アプリケーションへ追加する方法を示すトピックのグループです。

- [igPivotView の追加](igPivotView-Adding.html): これは、`igPivotView` を HTML ページと ASP.NET MVC アプリケーションへ追加する方法を示すトピックのグループです。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [フラット データ ソースへのバインド](%%SamplesUrl%%/pivot-grid/binding-to-flat-data-source): このサンプルでは、`igPivotGrid` を `igOlapFlatDataSource` にバインドし、データ選択のために `igPivotDataSelector` を使用します。





 

 



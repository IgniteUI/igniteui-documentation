<!--
|metadata|
{
    "fileName": "iglistview-configuring-sorting",
    "controlName": "igListView",
    "tags": ["How Do I","Sorting"]
}
|metadata|
-->

# 並べ替えの構成 (igListView)

## トピックの概要

### 目的

このトピックでは、`igListView`™ の並べ替え機能を使用する方法を説明します。

### 前提条件

以下は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView`™ の機能について説明します。

- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。

- [データ属性リファレンス](igListView-Data-Attributes-Reference.html): このトピックでは、すべての `igListView`™ データ属性の一覧を示します。これらの属性を使用して、マークアップで `igListView` を初期化できます。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**プロパティ リファレンス**](#property-reference)
-   [**メソッド リファレンス**](#method-reference)
-   [**イベント リファレンス**](#events-reference)
-   [**JavaScript で igListView 並べ替えの構成**](#js)
    -   [プレビュー](#js-preview)
    -   [要件](#js-requirements)
    -   [概要](#js-overview)
    -   [手順](#js-steps)
-   [**MVC のローカル並べ替えを使用して igListView を構成**](#mvc-local)
    -   [プレビュー](#mvc-local-preview)
    -   [要件](#mvc-local-requirements)
    -   [概要](#mvc-local-overview)
    -   [手順](#mvc-local-steps)
-   [**MVC のリモート並べ替えを使用して igListView を構成**](#mvc-remote)
    -   [プレビュー](#mvc-remote-preview)
    -   [要件](#mvc-remote-requirements)
    -   [概要](#mvc-remote-overview)
    -   [手順](#mvc-remote-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igListView` コントロールには並べ替え機能が内蔵されています。並べ替えは、プリセットで定義します。プリセットは自動生成 (`autoGenerateSortPresets: true`) するか手動で定義します。プリセットは事前に定義された並べ替え条件で、オプション ボタン グループのように視覚化されます。並べ替えは、ページに対してローカルでサーバーでリモートに行うことができます。MVC 3 のケースでは、`igListView` MVC ラッパー機能はそのままリモート並べ替えをサポートしています。リモート並べ替えの構成は簡単です。必要なのはアクション メソッドに `ListViewDataSourceAction` 属性を追加するだけです。

並べ替えにはグループ化機能があり、個別のプリセットまたは並べ替え対象フィールドに設定できます。グループ化の詳細は、「[関連コンテンツ](#related-content)」セクションを参照してください。

グループ化の他にリスト項目を分けるリスト区分線を作成できます。リスト区分線は読み取り専用項目で、バインディング設定で `isDividerKey` プロパティを設定して有効にします。ただし、このプロパティは `sortedFields` プロパティが空のときのみ機能します。`isDividerKey` プロパティは、データが直接データ ソースから来て `igListView` 機能から変更されていない場合にのみ適用されます。

> **注:** バインディング プロパティで `isDividerKey` を設定すると、デフォルト プリセットに対する区分線が描画されます (`sortedFields` プロパティは空でなければなりません)。プリセットまたはカスタム並べ替えから並べ替えを適用すると、リストから区分線が削除されます。これは、区分線の順序が正しくなくなるためです。

![](images/igListView_Sorting_1.png)



## <a id="property-reference"></a> プロパティ リファレンス

このセクションでは、 `igListView` 並べ替え機能の各種のプロパティを説明します。

以下の表は、`igListView` コントロールの並べ替え機能の主なプロパティの目的と機能の概要を示しています。

プロパティ|説明
---|---
[autoGenerateSortPresets](%%jQueryApiUrl%%/mobile.igListViewSorting#options:autoGenerateSortPresets) |true に設定され、プリセット配列が null の場合、各バインディングにプリセットが生成されます。
[caseSensitive](%%jQueryApiUrl%%/mobile.igListViewSorting#options:caseSensitive) |並べ替えの大文字と小文字の区別です。
[customSortFunction](%%jQueryApiUrl%%/mobile.igListViewSorting#options:customSortFunction) |次の 3 つのパラメーターを持つカスタム並べ替え関数です。<br /><ul><li>並べ替えられるデータ</li><li>データ ソース フィールド定義の配列</li><li>使用する並べ替え方向 (オプション)。</li></ul>この関数は、並べ替えられたデータ配列を返します。
[groupComparerFunction](%%jQueryApiUrl%%/mobile.igListViewSorting#options:groupComparerFunction) |カスタム グループ対象関数を指定します。これは比較する 2 つの値を受け取り、それらが同じグループにあるかを示す `bool` を返します。
[groupingSettings](%%jQueryApiUrl%%/mobile.igListViewSorting#options:groupingSettings) |デフォルトのフィールドおよびすべてのプリセットのためにグループ化の表示方法を制御する設定を持つオブジェクト。
[groupNameFunction](%%jQueryApiUrl%%/mobile.igListViewSorting#options:groupNameFunction) |カスタム グループ名関数を指定します。これは、グループの値を受け取り、表示する名前を返します。
[showGrouping](%%jQueryApiUrl%%/mobile.igListViewSorting#options:showGrouping) |このプロパティを使用して並べ替え対象項目をグループ化します。
[sortedFields](%%jQueryApiUrl%%/mobile.igListViewSorting#options:sortedFields) |並べ替え対象フィールドと方向を示すキー/値ペア (fieldName と direction) のリスト。
[sortPresetsLabel](%%jQueryApiUrl%%/mobile.igListViewSorting#options:sortPresetsLabel) |並べ替えプリセットの上に表示されるテキスト。
[sortState](%%jQueryApiUrl%%/mobile.igListViewSorting#options:sortState) |最初に選択されるプリセットの数。プリセットを選択しない場合は default を使用します。
[presets](%%jQueryApiUrl%%/mobile.igListViewSorting#options:presets) |事前設定並べ替えオプションのリスト。
[type](%%jQueryApiUrl%%/mobile.igListViewSorting#options:type) |ローカルまたはリモート並べ替えを定義。




## <a id="method-reference"></a> メソッド リファレンス

このセクションでは、 `igListView` 並べ替え機能のメソッドを説明します。

以下の表は、`igListView` コントロールの並べ替え機能の主なプロパティの目的と機能の概要を示しています。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
メソッド
			</th>
            <th>
説明
			</th>
            <th>
パラメーター
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
[group](%%jQueryApiUrl%%/mobile.igListViewSorting#methods:group)
			</td>
            <td>
このメソッドは項目にグループ化を適用します。
			</td>
            <td>
                <ul>
                    <li>
fields – フィールド定義の配列
					</li>
                    <li>
defaultDirection – 並べ替え方向 (asc または desc)
					</li>
                    <li>
trayText – トレイ エリアのテキスト
					</li>
                    <li>
groupFx – グループ関数
					</li>
                    <li>
groupNameFx – グループ名関数
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
[sort](%%jQueryApiUrl%%/mobile.igListViewSorting#methods:sort)
			</td>
            <td>
このメソッドは項目に並べ替えを適用します。
			</td>
            <td>
                <ul>
                    <li>
fields – フィールド定義の配列
					</li>
                    <li>
defaultDirection – 並べ替え方向 (asc または desc)
					</li>
                    <li>
trayText – トレイ エリアのテキスト
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
[destroy](%%jQueryApiUrl%%/mobile.igListViewSorting#methods:destroy)
			</td>
            <td>
ウィジェットを破棄します。
			</td>
            <td>
なし
			</td>
        </tr>
    </tbody>
</table>




## <a id="events-reference"></a> イベント リファレンス

このセクションでは、 `igListView` 並べ替え機能が実行するイベントを説明します。

以下の表は、`igListView` コントロールのイベントの目的と機能の概要を示します。

イベント|説明|キャンセル可能
---|---|---
[presetChanging](%%jQueryApiUrl%%/mobile.igListViewSorting#events:presetChanging) |このイベントは並べ替えプリセットが変更される前に発生します。|true
[presetChanged](%%jQueryApiUrl%%/mobile.igListViewSorting#events:presetChanged) |このイベントは、プリセットが変更され、データが再描画された後に発生します。|false




## <a id="js"></a> JavaScript で igListView 並べ替えの構成

この手順は、並べ替え機能を有効にして `igListView` を初期化し、それを JavaScript 配列にバインドします。並べ替えは `CategoryName` と `InStock` 列に対して有効です。

### <a id="js-preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Sorting_2.png)

### <a id="js-requirements"></a> 要件

手順を完了するために、Ignite UI %%ProductVersionShort%% 製品をインストールしておく必要があります。

### <a id="js-overview"></a> 概要

このトピックでは、並べ替え機能を使用して JavaScript で `igListView` を設定する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [インフラジスティックス ローダーを使用してスクリプト参照を追加](#js-add-references)
2.  [データ ソースの定義](#js-define-data-source)
3.  [並べ替え機能を使用した igListView の宣言型設定の実行](#js-init-markup)
4.  [オプション: JavaScript で並べ替え機能を使用した igListView のインスタンス化](#js-init-javascript)

### <a id="js-steps"></a> 手順

以下の手順は、JavaScript で並べ替え機能を使用した `igListView` の構成方法を示します。

1. インフラジスティックス ローダーを使用してスクリプト参照を追加 <a id="js-add-references"></a>

	以下に並べ替え機能を有効にして `igListView` を初期化するために必要な参照のリストを示します。ローダーで並べ替え機能を有効にするには、resources プロパティを `igmList.Sorting` に設定する必要があります。
	
	**HTML の場合:**
	
	```
	<link rel="stylesheet" href="jquery.mobile.structure.min.css" />
	<script type="text/javascript" src="jquery.min.js"></script>
	<script type="text/javascript" src="jquery.mobile.min.js"></script>
	<script type="text/javascript" src="infragistics.mobile.loader.js"></script>
	```
	
	**JavaScript の場合:**
	
	```
	<script type="text/javascript">
	    $.ig.loader({
	        scriptPath: "../js/",
	        cssPath: "../css/",
	        resources: "igmList.Sorting",
	        theme: "ios"
	    });
	</script>
	```

2. データ ソースを定義する <a id="js-define-data-source"></a>

	`ProductName`、`CategoryName`、`ImageUrl` および `InStock` フィールドを含む `northwindProducts` JavaScript 配列を定義する必要があります。
	
	**JavaScript の場合:**
	
	```
	var northwindProducts = [
	
	    { "ProductName": "Chai", "CategoryName": "Beverages", 
	
	        "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 39 },
	
	    { "ProductName": "Chang", "CategoryName": "Beverages", 
	
	        "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 17 },
	
	    { "ProductName": "Uncle Bobu0027s Organic Dried Pears", "CategoryName": "Produce", 
	
	        "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 15 },
	
	    { "ProductName": "Ikura", "CategoryName": "Seafood", 
	
	        "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 31 },
	
	    { "ProductName": "Queso Cabrales", "CategoryName": "Dairy Products", 
	
	        "ImageUrl": "../content/images/nw/categories/4.png", "InStock": 22 },
	
	    { "ProductName": "Rössle Sauerkraut", "CategoryName": "Produce", 
	
	        "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 26 },
	
	    { "ProductName": "Thüringer Rostbratwurst", "CategoryName": "Meat/Poultry", 
	
	        "ImageUrl": "../content/images/nw/categories/6.png", "InStock": 0 },
	
	    { "ProductName": "Nord-Ost Matjeshering", "CategoryName": "Seafood", 
	
	        "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 10 }
	
	]
	```

3. 並べ替え機能を使用した `igListView` の宣言型設定の実行 <a id="js-init-markup"></a>

	多くの data-* 属性を含む UL HTML 要素を定義する必要があります。Data-bindings-* を使用してリスト ビューの定義済みプレースホルダーをデータ ソース フィールドにバインドします。Data-sorting-* 属性を使用して並べ替え機能を構成します。
	
	data-sorting-presets 属性を参照して JavaScript コードでプリセットの配列を構成します。
	
	**HTML の場合:**
	
	```
	<ul id="igListViewSorting"
	    data-role="iglistview" 
	    data-data-source="northwindProducts"                 
	    data-auto-generate-layouts="False" 
	    data-bindings-text-key="ProductName"
	    data-bindings-description-key="CategoryName"
	    data-bindings-image-url-key="ImageUrl"
	    data-bindings-count-key="InStock"
	    data-sorting-name="Sorting" 
	    data-sorting="true" 
	    data-sorting-type="local"
	    data-sorting-sort-presets-label="Sorting options" 
	    data-sorting-auto-generate-sort-presets="false" 
	    data-sorting-presets='[ {"text":"Inventory","sortedFields":[ {"fieldName":"InStock","direction":"desc"} ]}, {"text":"Category","sortedFields":[ {"fieldName":"CategoryName","direction":"asc"} ]} ]'>
	</ul>
	```

4. オプション: JavaScript で並べ替え機能を使用した `igListView` のインスタンス化 <a id="js-init-javascript"></a>

	1. DOM HTML 要素プレースホルダーを定義します。
	
		**HTML の場合:**
		
		```
		<div id="igListViewSorting"></div>
		```
	
	2. JavaScript で `igListView` をインスタンス化します。
	
		**JavaScript の場合:**
		
		```
		<script type="text/javascript">
		    $(function () {
		        $("#igListViewSorting").igListView({
		            dataSource: northwindProducts,
		            bindings: {
		                descriptionKey: "CategoryName",
		                textKey: "ProductName",
		                imageUrlKey: "ImageUrl",
		                countKey: "InStock"
		            },
		            features: [
		                {
		                    name: "Sorting",
		                    type: "local",
		                    autoGenerateSortPresets: false,
		                    presets: [
		                        {
		                            text: "Inventory",
		                            sortedFields: [
		                                {
		                                    fieldName: "InStock",
		                                    direction: "desc"
		                                }
		                            ]
		                        },
		                        {
		                            text: "Category",
		                            sortedFields: [
		                                {
		                                    fieldName: "CategoryName",
		                                    direction: "asc"
		                                }
		                            ]
		                        }
		                    ]
		                }
		            ]
		        });
		    });
		</script>
		```


## <a id="mvc-local"></a> MVC のローカル並べ替えを使用して igListView を構成

この手順は、並べ替え機能を有効にして `igListView` を Razor コードで初期化し、それを Json オブジェクトにバインドします。実際の並べ替え操作は、クライアントで行います。2 つのプリセット `Inventory` と `Category` を手動で構成します。並べ替えは `CategoryName` と `InStock` 列に対して有効です。

### <a id="mvc-local-preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Sorting_2.png)

### <a id="mvc-local-requirements"></a> 要件

この手順を実行するには、以下が必要です。

-   Microsoft® Visual Studio 2010 またはそれ以降のバージョンのインストール
-   MVC 3 Framework のインストール
-   Northwind データベースのインストール
-   *Infragistics.Web.Mvc.Mobile.dll* の追加
-   Ignite UI jQuery Mobile ファイルの追加

### <a id="mvc-local-overview"></a> 概要

このトピックでは、MVCで `igListView` を構成する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [Model の定義](#mvc-local-model)
2.  [View の定義](#mvc-local-view)
3.  [Controller の定義](#mvc-local-controller)

### <a id="mvc-local-steps"></a> 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-local-model"></a>

	1.  *Northwind データベース*に `Product` と `Category` テーブルの ADO.NET Entity Data Model を追加し、 `NorthwindModel` という名前を付けます。
	
		![](images/igListView_Sorting_4.png)
	
	2.  フォルダー Models に新しい Class を追加して *ProductViewModel.cs* という名前を付けます。
	
	    **C# の場合:**
	
	    ```
	    public class ProductViewModel
	    {
	        public string ProductName { get; set; }
	        public string CategoryName { get; set; }
	        public string ImageUrl { get; set; }
	        public int InStock { get; set; }
	    }
	    ```

2. View の定義 <a id="mvc-local-view"></a>

	Views フォルダーに新しい View を追加します。*igListViewSorting.cshtml* という名前を付けます。
	
	**C# の場合:**
	
	```
	@(Html
	    .InfragisticsMobile()
	    .ListView(Model)
	    .ID("sortingPresetsListView")
	    .ResponseDataKey("")
	    .ImageMode(ImageMode.Icon)
	    .Bindings(b =>
	    {
	        b.TextKey("ProductName")
	        .DescriptionKey("CategoryName")
	        .ImageUrlKey("ImageUrl")
	        .CountKey("InStock");
	    })
	    .Features(features =>
	    {
	        features
	            .Sorting()
	            .AutoGenerateSortPresets(false)
	            .Type(OpType.Local)
	            .SortPresetsLabel("Default")
	            .Presets(p =>
	            {
	                p.Preset()
	                    .Text("Inventory")
	                    .SortedFields(f =>
	                    {
	                        f.SortedField()
	                            .FieldName("InStock")
	                            .Direction(SortMode.Descending);
	                    });
	                p.Preset()
	                    .Text("Category")
	                    .SortedFields(f =>
	                    {
	                        f.SortedField()
	                            .FieldName("CategoryName")
	                            .Direction(SortMode.Ascending);
	                    });
	            });
	    })
	    .DataSourceUrl(@Url.Action("productjson", "sampledatajson"))
	    .DataBind()
	    .Render()
	)
	```

3. コントローラーの定義 <a id="mvc-local-controller"></a>

	1. *Controllers* フォルダーに新しいコントローラーを追加します。*SampleDataJsonController.cs* という名前を付けます。
	
	2. コントローラーに新しい Action を追加します。これは、`JsonResult` を返します。`ProductJSON` という名前を付けます。
	
	**C# の場合:**
	
	```
	public class SampleDataJsonController : Controller
	{
	    public JsonResult ProductJSON()
	    {
	        var products = GetProducts(30);
	        return Json(products, JsonRequestBehavior.AllowGet);
	    }
	    
	    private IQueryable<ProductViewModel> GetProducts(int count)
	    {
	        var products = (from e in new NorthwindEntities().Products.Include("Category")
	                         select e).Take<Product>(count);
	        var productModels = new List<ProductViewModel>();
	        foreach (var product in products)
	        {
	            productModels.Add(
	                new ProductViewModel
	                {
	                    CategoryName = product.Category.CategoryName,
	                    ProductName = product.ProductName,
	                    InStock = int.Parse(product.UnitsInStock.ToString()),
	                    ImageUrl = _url.Content(
	                        String.Format("~/content/images/mobile/categories/{0}.png", 
	                        product.CategoryID))
	                });
	        }
	        return productModels.AsQueryable();
	    }
	}
	```



## <a id="mvc-remote"></a> MVC のリモート並べ替えを使用して igListView を構成

この手順は、並べ替え機能を有効にして `igListView` を Razor コードで初期化し、それを Json オブジェクトにバインドします。実際の並べ替え操作は、サーバーで行います。2 つのプリセット `Inventory` と `Category` を手動で構成します。並べ替えは `CategoryName` と `InStock` 列に対して有効です。

### <a id="mvc-remote-preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Sorting_1.png)

### <a id="mvc-remote-requirements"></a> 要件

この手順を実行するには、以下が必要です。

-   Microsoft® Visual Studio 2010 またははそれ以降のバージョンのインストール
-   MVC 3 Framework のインストール
-   Northwind データベースのインストール
-   *Infragistics.Web.Mvc.Mobile.dll* の追加
-   Ignite UI jQuery Mobile ファイルの追加

### <a id="mvc-remote-overview"></a> 概要

このトピックでは、MVCで `igListView` を構成する方法について順を追って説明します。
以下はプロセスの概念的概要です。

1. [Model の定義](#mvc-remote-model)
2. [View の定義](#mvc-remote-view)
3. [Controller の定義](#mvc-remote-controller)

### <a id="mvc-remote-steps"></a> 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-remote-model"></a>

	1.  Northwind データベースに Product と Category テーブルの ADO.NET Entity Data Model を追加し、 NorthwindModel という名前を付けます。
	
		![](images/igListView_Sorting_6.png)
	
	2.  フォルダー Models に新しい Class を追加して *ProductViewModel.cs* という名前を付けます。
	
		**C# の場合:**
	
	    ```
	    public class ProductViewModel
	    {
	        public string ProductName { get; set; }
	        public string CategoryName { get; set; }
	        public string ImageUrl { get; set; }
	        public int InStock { get; set; }
	    }
	    ```

3. View の定義 <a id="mvc-remote-view"></a>

	Views フォルダーに新しい View を追加します。*igListViewRemoteSorting.cshtml* という名前を付けます。
	
	**C# の場合:**
	
	```
	@model IQueryable<ProductViewModel>
	@(Html
	    .InfragisticsMobile()
	    .ListView(Model)
	    .ID("remoteListView")
	    .ImageMode(ImageMode.Icon)
	    .Bindings(b =>
	    {
	        b.HeaderKeyFor(p => p.ProductName)
	        .DescriptionKeyFor(p => p.CategoryName)
	        .CountKeyFor(p => p.InStock)
	        .ImageUrlKeyFor(p => p.ImageUrl);
	    })
	    .Features(features =>
	    {
	        features
	            .Sorting()
	            .Type(OpType.Remote)
	            .AutoGenerateSortPresets(false)
	            .Presets(sp =>
	            {
	                sp.Preset()
	                    .Text("Category")
	                    .SortedFields(f =>
	                    {
	                        f.SortedFieldFor(p => p.CategoryName, 
	                            SortMode.Ascending);
	                    });
	                sp.Preset()
	                    .Text("Product")
	                    .SortedFields(f =>
	                    {
	                        f.SortedFieldFor(p => p.ProductName, 
	                            SortMode.Ascending);
	                    });
	            });
	    })
	    .DataSourceUrl(Url.Action("RemoteListViewOperations"))
	    .DataBind()
	    .Render()
	)
	```

4. コントローラーの定義 <a id="mvc-remote-controller"></a>

	**C# の場合:**
	
	```
	public class ListViewController : Controller
	{
	    public ActionResult IgListViewRemoteSorting()
	    {
	        var productModels = GetProducts(30);
	        return View(productModels);
	    }
	    
	    [ListViewDataSourceAction]
	    public ActionResult RemoteListViewOperations()
	    {
	        var productModels = GetProducts(30);
	        return View(productModels);
	    }
	    
	    private IQueryable<ProductViewModel> GetProducts(int count)
	    {
	        var products = (from e in new NorthwindEntities().Products.Include("Category")
	                         select e).Take<Product>(count);
	        var productModels = new List<ProductViewModel>();
	        foreach (var product in products)
	        {
	            productModels.Add(
	                new ProductViewModel
	                {
	                    CategoryName = product.Category.CategoryName,
	                    ProductName = product.ProductName,
	                    InStock = int.Parse(product.UnitsInStock.ToString()),
	                    ImageUrl = _url.Content(
	                        String.Format("~/content/images/mobile/categories/{0}.png",
	                        product.CategoryID))
	                });
	        }
	        return productModels.AsQueryable();
	    }
	}
	```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [フィルタリングの構成](igListView-Configuring-Filtering.html): このトピックでは、`igListView`™ のフィルタリング機能を使用する方法を示します。

- [グループ化の構成](igListView-Configuring-Grouping.html): このトピックでは、`igListView`™ のグループ化機能を使用する方法を説明します。

- [ロード オン デマンドの構成](igListView-Configuring-Load-on-Demand.html): このトピックでは、`igListView`™ のロード オン デマンド機能の使い方を示します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [並べ替えとグループ化のプリセット](%%SamplesUrl%%/mobile-list-view/sort-group-presets): このサンプルでは、グループ化と一緒にローカル並べ替えを示します。

- [リモート機能](%%SamplesUrl%%/mobile-list-view/remote-features): このサンプルでは、グループ化と一緒にリモート並べ替えを示します。





 

 



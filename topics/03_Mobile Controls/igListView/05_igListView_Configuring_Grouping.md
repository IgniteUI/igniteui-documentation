<!--
|metadata|
{
    "fileName": "iglistview-configuring-grouping",
    "controlName": "igListView",
    "tags": ["Grouping","How Do I"]
}
|metadata|
-->

# グループ化の構成 (igListView)

## トピックの概要

### 目的

このトピックでは、`igListView`™ のグループ化機能を使用する方法を説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView`™ の機能について説明します。

- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。

- [並べ替えの構成](igListView-Configuring-Sorting.html): このトピックでは、`igListView`™ の並べ替え機能を使用する方法を説明します。

- [データ属性リファレンス](igListView-Data-Attributes-Reference.html): このトピックでは、すべての `igListView`™ データ属性の一覧を示します。これらの属性を使用して、マークアップで `igListView` を初期化できます。 


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**JavaScript での igListView グループ化の構成**](#js)
    -   [要件](#js-requirements)
    -   [概要](#js-overview)
    -   [手順](#js-steps)
-   [**MVC でグループ化を使用して igListView を構成**](#mvc)
    -   [要件](#mvc-requirements)
    -   [概要](#mvc-overview)
    -   [手順](#mvc-steps)
-   [**JavaScript でカスタム関数を使用した igListView グループ化の構成**](#custom-function)
    -   [要件](#custom-function-requirements)
    -   [概要](#custom-function-overview)
    -   [手順](#custom-function-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igListView` コントロールには、グループ化機能が内蔵されています。これは、並べ替え機能と一緒に働きます。

並べ替えるフィールド (ある場合) のグループを定義するか、並べ替えプリセットの一部としてグループを定義することができます。各プリセットは、`showGrouping` プロパティおよび `groupComparerFunction` と `groupNameFunction` プロパティを持ちます。

> **注:** `isDividerKey` は、`sortedFields` プロパティが設定されていると無視されます。

![](images/igListView_Grouping_1.png)



## <a id="js"></a> JavaScript での igListView グループ化の構成

この手順は、並べ替え機能とグループ化を有効にして `igListView` を初期化し、それを JavaScript 配列にバインドします。並べ替えは、*Title* と *Name* 列に構成します。グループ化が有効になっていると、`sortedFields` 配列から最初のフィールドを取り出します。この例では、`Title` 列をグループ化します。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Grouping_1.png)

### <a id="js-requirements"></a> 要件

手順を完了するために、Ignite UI %%ProductVersionShort%% 製品をインストールしておく必要があります。

### <a id="js-overview"></a> 概要

このトピックでは、並べ替えとグループ化機能を使用して JavaScript で `igListView` を構成する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [インフラジスティックス ローダーを使用してスクリプト参照を追加](#js-add-references)
2.  [データ ソースの定義](#js-define-data-source)
3.  [グループ化機能を使用した igListView の宣言型設定の実行](#js-init-markup)
4.  [オプション: JavaScript でグループ化機能を使用した igListView のインスタンス化](#js-init-javascript)

### <a id="js-steps"></a> 手順

以下の手順は、JavaScript で並べ替え機能を使用した `igListView` の構成方法を示します。

1. インフラジスティックス ローダーを使用してスクリプト参照を追加 <a id="js-add-references"></a>

	以下に並べ替え機能を有効にして `igListView` を初期化するために必要な参照のリストを示します。グループ化機能は並べ替え機能の一部です。ローダーで並べ替え機能を有効にするには、`resources` プロパティを `igmList.Sorting` に設定する必要があります。
	
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

	`ProductName`、`CategoryName`、`ImageUrl` および `InStock` フィールドを含む `northwindEmployees` JavaScript 配列を定義する必要があります。
	
	**JavaScript の場合:**
	
	```
	<script type="text/javascript">
	var northwindEmployees = [
	    { "ID": 1, "Name": "Davolio, Nancy", "Title": "Sales Representative", "ImageUrl": "../content/images/nw/employees/1.png", "Phone": "(206) 555-9857", "PhoneUrl": "tel:(206) 555-9857" },
	    { "ID": 2, "Name": "Fuller, Andrew", "Title": "Vice President, Sales", "ImageUrl": "../content/images/nw/employees/2.png", "Phone": "(206) 555-9482", "PhoneUrl": "tel:(206) 555-9482" },
	    { "ID": 3, "Name": "Leverling, Janet", "Title": "Sales Representative", "ImageUrl": "../content/images/nw/employees/3.png", "Phone": "(206) 555-3412", "PhoneUrl": "tel:(206) 555-3412" },
	    { "ID": 4, "Name": "Peacock, Margaret", "Title": "Sales Representative", "ImageUrl": "../content/images/nw/employees/4.png", "Phone": "(206) 555-8122", "PhoneUrl": "tel:(206) 555-8122" },
	    { "ID": 5, "Name": "Buchanan, Steven", "Title": "Sales Manager", "ImageUrl": "../content/images/nw/employees/5.png", "Phone": "(71) 555-4848", "PhoneUrl": "tel:(71) 555-4848" },
	    { "ID": 6, "Name": "Suyama, Michael", "Title": "Sales Representative", "ImageUrl": "../content/images/nw/employees/6.png", "Phone": "(71) 555-7773", "PhoneUrl": "tel:(71) 555-7773" },
	    { "ID": 7, "Name": "King, Robert", "Title": "Sales Representative", "ImageUrl": "../content/images/nw/employees/7.png", "Phone": "(71) 555-5598", "PhoneUrl": "tel:(71) 555-5598" },
	    { "ID": 8, "Name": "Callahan, Laura", "Title": "Inside Sales Coordinator", "ImageUrl": "../content/images/nw/employees/8.png", "Phone": "(206) 555-1189", "PhoneUrl": "tel:(206) 555-1189" },
	    { "ID": 9, "Name": "Dodsworth, Anne", "Title": "Sales Representative", "ImageUrl": "../content/images/nw/employees/9.png", "Phone": "(71) 555-4444", "PhoneUrl": "tel:(71) 555-4444" }
	]</script>
	```

3. グループ化機能を使用した `igListView` の宣言型設定の実行 <a id="js-init-markup"></a>

	1. このステップでは、多数の data-* 属性を持つ UL (Unordered list) HTML 要素を定義する必要があります。Data-bindings-* を使用してリスト ビューの定義済みプレースホルダーをデータ ソース フィールドにバインドします。Data-sorting-* 属性を使用して並べ替え機能を構成します。
	
	2. グループ化を有効にするには `data-sorting-show-grouping="true"` と設定します。この設定は、`sortedFields` 配列のグループ化を有効にします。
	
	3. グループ化を行うには、並べ替え済みフィールドを定義する data-sorting-sorted-fields 属性を設定します。この場合、`Title` と `Name` フィールドを昇順に並べ替えます。グループ化が適用されると、`sortedFields` 配列から最初の列だけを使用します。
	
	**HTML の場合:**
	
	```
	<ul id="igListViewGrouping"
	    data-role="iglistview"
	    data-icon-mode="thumbnail"
	    data-data-source="northwindEmployees" 
	    data-bindings-description-key="Title"
	    data-bindings-header-key="Name"
	    data-bindings-primary-key="ID"
	    data-bindings-text-key="Phone"
	    data-sorting="true" 
	    data-sorting-type="local"
	    data-sorting-show-grouping="true"
	    data-sorting-auto-generate-sort-presets="false"
	    data-sorting-sorted-fields='[{"fieldName":"Title","direction":"asc"},{"fieldName":"Name","direction":"asc"}]'>
	</ul>
	```

4. オプション: JavaScript でグループ化機能を使用した `igListView` のインスタンス化 <a id="js-init-javascript"></a>

	1. DOM (ドキュメント オブジェクト モデル) HTML 要素のプレースホルダーを定義します。
	
		**HTML の場合:**
		
		```
		<div id="igListViewGrouping"></div>
		```
	
	2. JavaScript で `igListView` をインスタンス化します。
		
		**JavaScript の場合:**
		
		```
		<script type="text/javascript">
		    $.ig.loader(function() {
		        $("#igListViewGrouping").igListView({
		            dataSource: northwindEmployees,
		            bindings: {
		                descriptionKey: "Title",
		                headerKey: "Name",
		                textKey: "Phone",
		                primaryKey: "ID"
		            },
		            features: [
		                {
		                    name: "Sorting",
		                    type: "local",
		                    showGrouping: true,
		                    autoGenerateSortPresets: false,
		                    sortedFields: [
		                        {
		                            fieldName: "Title",
		                            direction: "asc"
		                        },
		                        {
		                            fieldName: "Name",
		                            direction: "asc"
		                        }
		                    ]
		                }
		            ]
		        });
		    });
		</script>
		```



## <a id="mvc"></a> MVC でグループ化を使用して igListView を構成

この手順は、並べ替え機能とグループ化を有効にして `igListView` を Razor コードで初期化し、それを Json オブジェクトにバインドします。`CategoryName` 列のグループ化を行います。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Grouping_3.png)

### <a id="mvc-requirements"></a> 要件

この手順を実行するには、以下が必要です。

-   Microsoft® Visual Studio 2010 またははそれ以降のバージョンのインストール
-   MVC 3 Framework のインストール
-   Northwind データベースのインストール
-   *Infragistics.Web.Mvc.Mobile.dll* の追加
-   Ignite UI jQuery Mobile ファイルの追加

### <a id="mvc-overview"></a> 概要

このトピックでは、MVCで `igListView` グループ化を構成する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [Model の定義](#mvc-local-model)
2.  [View の定義](#mvc-local-view)
3.  [Controller の定義](#mvc-local-controller)

### <a id="mvc-steps"></a> 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-local-model"></a>

	Northwind データベースの `Product` テーブルおよび `Category` テーブルの ADO.NET Entity Data Model を追加し、`NorthwindModel` という名前を付けます。
	
	![](images/igListView_Grouping_4.png)
	
	フォルダー Models に新しい Class を追加して *ProductViewModel.cs* という名前を付けます。
	
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

	Views フォルダーに新しい View を追加します。*igListViewGrouping.cshtml* という名前を付けます。ビューに以下のコードを追加します。定義した `igListView` は、`SampleDataJson` コントローラーの `ProductJSON` アクション メソッドからデータを得ます。
	
	**C# の場合:**
	
	```
	@model IQueryable<ProductViewModel>
	<script type="text/javascript" src="infragistics.mobile.loader.js"></script>
	@(Html.InfragisticsMobile().
	    Loader().
	    ScriptPath("../js/").
	    CssPath("../css/").
	    Render())
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
	            .ShowGrouping(true)
	            //Configuring the SortedFields here creates the default grouping
	            .SortedFields(sf =>
	            {
	                sf.SortedFieldFor(p => p.CategoryName, 
	                    SortMode.Ascending);
	            })
	            .AutoGenerateSortPresets(false)
	            .Type(OpType.Local);
	    })
	    .DataSourceUrl(@Url.Action("productjson", "sampledatajson"))
	    .DataBind()
	    .Render()
	)
	```

3. コントローラーの定義 <a id="mvc-local-controller"></a>

	1. Controllers フォルダーに新しいコントローラーを追加します。*SampleDataJsonController.cs* という名前を付けます。
	
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
	                    ImageUrl = _url.Content(String.Format("~/content/images/mobile/categories/{0}.png", product.CategoryID))
	                });
	        }
	        return productModels.AsQueryable();
	    }
	}
	```





## <a id="custom-function"></a> JavaScript でカスタム関数を使用した igListView グループ化の構成

この手順は、並べ替え機能とグループ化を有効にして `igListView` を初期化し、それを JavaScript 配列にバインドします。並べ替えは、`ProductName` 列に設定します。グループ化は、カスタム比較関数で設定します。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Grouping_1.png)

### <a id="custom-function-requirements"></a> 要件

手順を完了するために、Ignite UI %%ProductVersionShort%% 製品をインストールしておく必要があります。
product.

### <a id="custom-function-overview"></a> 概要

このトピックでは、並べ替え機能を使用して JavaScript で `igListView` を設定する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [インフラジスティックス ローダーを使用してスクリプト参照を追加](#js-custom-group-references)
2.  [データ ソースの定義](#js-custom-group-data-source)
3.  [カスタム グループ化関数の定義](#js-custom-group-functions)
4.  [グループ化機能を使用した igListView の宣言型設定の実行](#js-custom-group-markup)
5.  [オプション: JavaScript でグループ化機能を使用した igListView のインスタンス化](#js-custom-group-javascript)

### <a id="custom-function-steps"></a> 手順

以下の手順は、JavaScript で並べ替え機能を使用した `igListView` の構成方法を示します。

1. インフラジスティックス ローダーを使用してスクリプト参照を追加 <a id="js-custom-group-references"></a>

	以下に並べ替え機能を有効にして `igListView` を初期化するために必要な参照のリストを示します。グループ化機能は並べ替え機能の一部です。ローダーで並べ替え機能を有効にするには、`resources` プロパティを `igmList.Sorting` に設定する必要があります。
	
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

2. データ ソースを定義する <a id="js-custom-group-data-source"></a>

	`ProductName`、`CategoryName`、`ImageUrl` および `InStock` フィールドを含む `northwindProducts` JavaScript 配列を定義する必要があります。
	
	**JavaScript の場合:**
	
	```
	<script type="text/javascript">
	    var northwindProducts = [
	        { "ProductName": "Chai", "CategoryName": "Beverages", "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 39 },
	        { "ProductName": "Chang", "CategoryName": "Beverages", "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 17 },
	        { "ProductName": "Uncle Bobu0027s Organic Dried Pears", "CategoryName": "Produce", "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 15 },
	        { "ProductName": "Ikura", "CategoryName": "Seafood", "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 31 },
	        { "ProductName": "Queso Cabrales", "CategoryName": "Dairy Products", "ImageUrl": "../content/images/nw/categories/4.png", "InStock": 22 },
	        { "ProductName": "Rössle Sauerkraut", "CategoryName": "Produce", "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 26 },
	        { "ProductName": "Thüringer Rostbratwurst", "CategoryName": "Meat/Poultry", "ImageUrl": "../content/images/nw/categories/6.png", "InStock": 0 },
	        { "ProductName": "Nord-Ost Matjeshering", "CategoryName": "Seafood", "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 10 }
	    ]
	</script>
	```

3. カスタム グループ化関数の定義 <a id="js-custom-group-functions"></a>

	1. カスタム グループ化比較関数を定義します。
	
		この関数は、2 つの文字列の最初の文字を比較します。比較は大文字と小文字を区別します。
		
		**JavaScript の場合:**
		
		```
		//Logic to sort by first letter
		function byFirstLetter(val1, val2) {
		    if (val1 === null && val2 === null)
		        return true;
		    if (val1 === null || val2 === null)
		        return false;
		    return typeof val1 === "string" &&
		typeof val2 === "string" &&
		val1.toUpperCase().charCodeAt(0) === val2.toUpperCase().charCodeAt(0);
		}
		```
	
	2. カスタム グループ名関数を定義します。
	
		この関数はグループ名を返します。この場合、これは `ProductName` フィールドの最初の文字です。
		
		**JavaScript の場合:**
		
		```
		//Logic determines group names
		function returnFirstLetter(val) {
		    if (!val || val.length === 0)
		        return "Empty";
		    return val.toUpperCase()[0];
		}
		```

4. グループ化機能を使用した `igListView` の宣言型設定の実行 <a id="js-custom-group-markup"></a>

	1.  多くの data-* 属性を含む UL HTML 要素を定義する必要があります。Data-bindings-* を使用してリスト ビューの定義済みプレースホルダーをデータ ソース フィールドにバインドします。Data-sorting-* 属性を使用して並べ替え機能を構成します。
	2.  グループ化を有効にするには `data-sorting-show-grouping="true"` と設定します。この設定は、`sortedFields` 配列のグループ化を有効にします。
	3.  グループ化を行うには、並べ替え済みフィールドを定義する `data-sorting-sorted-fields` 属性を設定します。このケースでは、`ProductName` を昇順に並べ替えます。
	4.  カスタム グループ化を有効にするには、`data-sorting-group-comparer-function` と `data-sorting-group-name-function` をステップ 3 で定義した関数の名前に設定します。
	
	**HTML の場合:**
	
	```
	<ul id="igListViewGrouping"
	    data-auto-generate-layouts="False" 
	    data-image-mode="icon"
	    data-bindings='{"textKey":"ProductName","descriptionKey":"CategoryName","imageUrlKey":"ImageUrl"}' 
	    data-data-source="northwindProducts" 
	    data-image-mode="icon" 
	    data-role="iglistview" 
	    data-sorting="true" 
	    data-sorting-auto-generate-sort-presets="false" 
	    data-sorting-divider-template="<div>${Name} - ${Count} {{if ${Count} == 1}}Item{{else}}Items{{/if}}</div>" 
	    data-sorting-group-comparer-function="byFirstLetter" 
	    data-sorting-group-name-function="returnFirstLetter" 
	    data-sorting-name="Sorting" 
	    data-sorting-show-grouping="true" 
	    data-sorting-sorted-fields='[ {"fieldName":"ProductName","direction":"asc"} ]'
	    data-sorting-type="local" >
	</ul>
	```

5. オプション: JavaScript でグループ化機能を使用した `igListView` のインスタンス化 <a id="js-custom-group-javascript"></a>

	1. DOM HTML 要素プレースホルダーを定義します。
	
	**HTML の場合:**
	
	```
	<div id="igListViewGrouping"></div>
	```
	
	2. JavaScript で `igListView` をインスタンス化します。
	
	**JavaScript の場合:**
	
	```
	<script type="text/javascript">
	    $.ig.loader(function() {
	        $("#igListViewGrouping").igListView({
	            imageMode: "icon",
	            dataSource: northwindProducts,
	            autoGenerateLayouts: false,
	            bindings: {
	                descriptionKey: "CategoryName",
	                textKey: "ProductName",
	                imageUrlKey: "ImageUrl"
	            },
	            features: [
	                {
	                    name: "Sorting",
	                    type: "local",
	                    showGrouping: true,
	                    autoGenerateSortPresets: false,
	                    dividerTemplate: "<div>${Name} - ${Count} {{if ${Count} == 1}}Item{{else}}Items{{/if}}</div>",
	                    groupComparerFunction: "byFirstLetter",
	                    groupNameFunction: "returnFirstLetter",
	                    sortedFields: [
	                        {
	                            fieldName: "ProductName",
	                            direction: "asc"
	                        }
	                    ]
	                }
	            ]
	        });
	    });
	</script>
	```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [フィルタリングの構成](igListView-Configuring-Filtering.html): このトピックでは `igListView` フィルタリングを構成する方法を説明します。

- [ロード オン デマンドの構成](igListView-Configuring-Load-on-Demand.html): このトピックでは `igListView` でロード オン デマンドを構成する方法を説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [並べ替えとグループ化のプリセット](%%SamplesUrl%%/mobile-list-view/sort-group-presets): このサンプルでは、グループ化と一緒にローカル並べ替えを示します。

- [リモートの並べ替えとフィルタリング](%%SamplesUrl%%/mobile-list-view/remote-features): このサンプルでは、グループ化と一緒にリモート並べ替えを示します。





 

 



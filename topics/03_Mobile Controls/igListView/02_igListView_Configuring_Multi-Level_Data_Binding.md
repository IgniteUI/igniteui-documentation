<!--
|metadata|
{
    "fileName": "iglistview-configuring-multi-level-data-binding",
    "controlName": "igListView",
    "tags": ["Data Binding","Drilldown","How Do I","MVC"]
}
|metadata|
-->

# 複数レベル データ バインディングの構成 (igListView)

## トピックの概要

### 目的

このトピックでは、`igListView`™ を階層データにバインドする方法を示します。

#### 必要な背景

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView`™ の機能について説明します。

- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。

- [データ属性リファレンス](igListView-Data-Attributes-Reference.html): このトピックでは、すべての `igListView`™ データ属性の一覧を示します。これらの属性を使用して、マークアップで `igListView` を初期化できます。


### このトピックの構成

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [JavaScript における igListView 複数レベル データ バインディングの構成](#js-multi-level)
-   [MVC における階層データのある igListView の構成](#mvc-hierarchical)
-   [MVC の階層データに対するロード オン デマンド機能を搭載した igListView の構成](#mvc-load-on-demand)
-   [関連コンテンツ](#related-content)



## <a id="introduction"></a> 概要
`igListView` コントロールは階層データにバインドできます。ロード オン デマンド機能は、子レベルの読み込みに使用できます。

![](images/igListView_Multi-Level_Data_Binding__1.png)



## <a id="js-multi-level"></a> JavaScript における igListView 複数レベル データ バインディングの構成

この手順では、2 階層の `igListView` を初期化し、それを JavaScript 配列にバインドします。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Multi-Level_Data_Binding__1.png)

### 要件

手順を完了するために、Ignite UI %%ProductVersionShort%% 製品をインストールしておく必要があります。

### 概要

このトピックでは、2 階層の `igListView` を構成する方法を順を追って説明します。以下はプロセスの概念的概要です。

1.  [インフラジスティックス ローダーを使用してスクリプト参照を追加](#js-references)
2.  [データ ソースの定義](#js-data-source)
3.  [複数レベル データ バインディング機能を備えた igListView の宣言構成の作成](#js-init-markup)
4.  [オプション: JavaScript における複数レベル データ バインディング機能を備えた igListView のインスタンスの作成](#js-init-javascript)

### 手順

以下の手順は、JavaScript で並べ替え機能を使用した `igListView` の構成方法を示します。

1. インフラジスティックス ローダーを使用してスクリプト参照を追加 <a id="js-references"></a>

	`igListView` を初期化する場合に必要な参照リストを以下に示します。
	
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
	        resources: "igmList",
	        theme: "ios"
	    });
	</script>
	```

2. データ ソースを定義する <a id="js-data-source"></a>

	`northwindCategoriesProducts` JavaScript を、以下のコード スニペットとして定義する必要があります。配列は `Categories` と `Products` 間で階層関係になっています。
	
	**JavaScript の場合:**
	
	```
	var northwindCategoriesProducts = [
	    {"ImageUrl":"../content/images/nw/categories/1.png","ProductCount":12,
	        "CategoryName":"Beverages","Products":[
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":39,
	            "ProductName":"Chai","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":17,
	            "ProductName":"Chang","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":20,
	            "ProductName":"Guaraná Fantástica","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":111,
	            "ProductName":"Sasquatch Ale","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":20,
	            "ProductName":"Steeleye Stout","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":17,
	            "ProductName":"Côte de Blaye","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":69,
	            "ProductName":"Chartreuse verte","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":17,
	            "ProductName":"Ipoh Coffee","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":52,
	            "ProductName":"Laughing Lumberjack Lager","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":15,
	            "ProductName":"Outback Lager","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":125,
	            "ProductName":"Rhönbräu Klosterbier","CategoryName":"Beverages"},
	        {"ImageUrl":"../content/images/nw/categories/1.png","InStock":57,
	            "ProductName":"Lakkalikööri","CategoryName":"Beverages"}
	    ]},
	    {"ImageUrl":"../content/images/nw/categories/2.png","ProductCount":12,
	        "CategoryName":"Condiments","Products":[]},
	    {"ImageUrl":"../content/images/nw/categories/3.png","ProductCount":13,
	        "CategoryName":"Confections","Products":[]},
	    {"ImageUrl":"../content/images/nw/categories/4.png","ProductCount":10,
	        "CategoryName":"Dairy Products","Products":[]},
	    {"ImageUrl":"../content/images/nw/categories/5.png","ProductCount":7,
	        "CategoryName":"Grains/Cereals","Products":[]},
	    {"ImageUrl":"../content/images/nw/categories/6.png","ProductCount":6,
	        "CategoryName":"Meat/Poultry","Products":[]},
	    {"ImageUrl":"../content/images/nw/categories/7.png","ProductCount":5,
	        "CategoryName":"Produce","Products":[]},
	    {"ImageUrl":"../content/images/nw/categories/8.png","ProductCount":12,
	        "CategoryName":"Seafood","Products":[]}
	]
	```

3. 複数レベル データ バインディング機能を備えた `igListView` の宣言構成を作成します <a id="js-init-markup"></a>

	このステップでは、多数の data-* 属性を持つ 2 つの入れ子になった UL (Unordered list) HTML 要素を定義する必要があります。Data-bindings-* を使用してリスト ビューの定義済みプレースホルダーをデータ ソース フィールドにバインドします。アウター UL は Categories `igListView`、インナー UL は `Products` `igListView` を定義しています。両者の関係は、インナー UL 要素の data-key 属性で定義されています。つまり、この子レイアウトは `northwindCategoriesProducts` 配列の各オブジェクトの `Products` プロパティからそのデータを取得するということです。
	
	**HTML の場合:**
	
	```
	<ul id="listViewMultiLevel"
	    data-role="iglistview"
	    data-image-mode="icon"
	    data-data-source="northwindCategoriesProducts" 
	    data-bindings-text-key="CategoryName"
	    data-bindings-details-title-key="CategoryName"
	    data-bindings-image-url-key="ImageUrl"
	    data-bindings-count-key="ProductCount">
	    <li>    
	        <ul data-role="childLayout"
	        data-key="Products"
	        data-image-mode="icon"
	        data-bindings-description-key="CategoryName"
	        data-bindings-text-key="ProductName"
	        data-bindings-image-url-key="ImageUrl"
	        data-bindings-count-key="InStock">
	        </ul>
	    </li>
	</ul>
	```

4. `オプション: JavaScript における複数レベル データ バインディング機能を備えた igListView のインスタンスを作成します` <a id="js-init-javascript"></a>
​	
	1. DOM (ドキュメント オブジェクト モデル) HTML 要素のプレースホルダーを定義します。

		**HTML の場合:**
		
		```
		<div id="listViewMultiLevel"></div>
		```

	2. JavaScript で `igListView` をインスタンス化します。
	
		**JavaScript の場合:**
		
		```
		$.ig.loader(function() {
		    $("#listViewMultiLevel").igListView({
		        dataSource: northwindCategoriesProducts,
		        iconMode: "icon",
		        bindings: {
		            detailsTitleKey: "CategoryName",
		            textKey: "CategoryName",
		            imageUrlKey: "ImageUrl",
		            countKey: "ProductCount"
		        },
		        childLayout: {
		            key: "Products",
		            iconMode: "icon",
		            descriptionKey: "CategoryName",
		            textKey: "ProductName",
		            imageUrlKey: "ImageUrl",
		            countKey: "InStock"
		        }
		    });
		});
		```


## <a id="mvc-hierarchical"></a> MVC における階層データのある igListView の構成

この手順では、Northwind データベースの `Categories` テーブルおよび `Products` テーブルの階層データのある `igListView` を Razor コードで初期化します。2 つのカスタム モデル クラス `ProductViewModel` および `CategoryViewModel` が定義されています。これらのクラスは、基本的にエンティティ モデル クラス `Product` および `Category` に似ています。データは、厳密に型指定された Model から View に転送されます。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Multi-Level_Data_Binding__3.png)

### 要件

この手順を実行するには、以下が必要です。

-   Microsoft ®Visual Studio 2010 以降がインストール済み
-   MVC 3 Framework のインストール
-   Northwind データベースのインストール
-   *Infragistics.Web.Mvc.Mobile.dll* の追加
-   Ignite UI jQuery Mobile ファイルの追加

### 概要

このトピックでは、MVC に階層データがある `igListView` を構成する方法を順を追って説明します。以下はプロセスの概念的概要です。

1. [Model の定義](#mvc-local-model)
2. [View の定義](#mvc-local-view)
3. [Controller の定義](#mvc-local-controller)

### 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-local-model"></a>

	1.  Northwind データベースの `Product` テーブルおよび `Category` テーブルの ADO.NET Entity Data Model を追加し、`NorthwindModel` という名前を付けます。
		
		![](images/igListView_Multi-Level_Data_Binding__4.png)

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

	3.  新しいクラスをフォルダー モデルに追加し、*CategoryViewModel.cs* と名付けます。

	    **C# の場合:**
	
	    ```
	    public class CategoryViewModel
	    {
	        public string CategoryName { get; set; }
	        public List<ProductViewModel> Products { get; set; }
	        public string ImageUrl { get; set; }
	        private int _productCount = 0;
	        public int ProductCount
	        {
	            get
	            {
	                return this.Products.Count;
	            }
	        }
	        public CategoryViewModel()
	        {
	            this.Products = new List<ProductViewModel>();
	        }
	    }
	    ```

2. View の定義 <a id="mvc-local-view"></a>

	Views フォルダーに新しい View を追加します。*igListViewMultiLevel.cshtml* という名前を付けます。
	
	**C# の場合:**
	
	```
	@model IQueryable<CategoryViewModel>
	<script type="text/javascript" src="infragistics.mobile.loader.js"></script>
	@(Html.InfragisticsMobile().
	    Loader().
	    ScriptPath("../js/").
	    CssPath("../css/").
	    Render())
	@(Html
	    .InfragisticsMobile()
	    .ListView(Model)
	    .ID("multiLevelListView")
	    .ImageMode(ImageMode.Icon)
	    .Bindings(b =>
	    {
	        b.TextKey("CategoryName")
	        .ImageUrlKey("ImageUrl")
	        .DetailsTitleKey("CategoryName") 
	        .CountKey("ProductCount");
	    })
	    .ChildLayout(layout =>
	    {
	        layout.For(c => c.Products)
	        .Key("Products")
	        .ImageMode(ImageMode.Icon)
	        .Bindings(b =>
	        {
	            b.TextKey("ProductName")
	            .ImageUrlKey("ImageUrl")
	            .DescriptionKey("CategoryName")
	            .CountKey("InStock");
	        });
	    })
	    .DataBind()
	    .Render()
	)
	```

3. コントローラーの定義 <a id="mvc-local-controller"></a>

	1. *Controllers* フォルダーに新しいコントローラーを追加します。それを *ListViewController.cs* と名付けます。

	2. 新しいアクションを `igListView` を初期化するコントローラーに追加します。`igListViewMultiLevel` という名前を付けます。

	3. `GetCategoriesAndProducts` は、データベース モデル スキーマをステップ 1 で定義したカスタム モデル クラスに変換しているヘルパー メソッドです。

	**C# の場合:**

	```
	public class ListViewController : Controller
	{
	    public ActionResult igListViewMultiLevel()
	    {
	        var categoryModels = GetCategoriesAndProducts();
	        return View(categoryModels.AsQueryable());
	    }
	    
	    public IQueryable<CategoryViewModel> GetCategoriesAndProducts()
	    {
	        var categories = (from c in new NorthwindEntities().Categories.Include("Products")
	                select c);
	        var categoryModels = new List<CategoryViewModel>();
	        foreach (var category in categories)
	        {
	            string imageUrl = _url.Content(
	                String.Format("~/content/images/mobile/categories/{0}.png",
	                category.CategoryID));
	            var categoryModel = new CategoryViewModel
	            {
	                CategoryName = category.CategoryName,
	                ImageUrl = imageUrl
	            };
	            foreach (var product in category.Products)
	            {
	                categoryModel.Products.Add(new ProductViewModel
	                {
	                    CategoryName = category.CategoryName,
	                    ProductName = product.ProductName,
	                    InStock = int.Parse(product.UnitsInStock.ToString()),
	                    ImageUrl = imageUrl
	                });
	            }
	            categoryModels.Add(categoryModel);
	        }
	        return categoryModels.AsQueryable();
	    }
	}
	```



## <a id="mvc-load-on-demand"></a> MVC の階層データに対するロード オン デマンド機能を搭載した igListView の構成

この手順は、子レイアウトに有効になっているロード オン デマンド機能を搭載した `igListView` を Razor コードで初期化します。階層データは、Northwind データベースの Categories テーブルおよび Products テーブルから取得されます。2 つのカスタム モデル クラス `ProductViewModel` および `CategoryViewModel` が定義されています。これらのクラスは、基本的にエンティティ モデル クラス `Product` および `Category`、また Json のシリアル化に使用される `LoadOnDemandViewModel` に似ています。Categories ビューのデータは、明示的に入力された Model から View に転送されます。子レイアウトのデータ (Products) は、`JsonResult` を返す `ProductJSONOnDemand` アクション メソッドにより Json とともにオン デマンドで転送されます。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Multi-Level_Data_Binding__5.png)

### 要件

この手順を実行するには、以下が必要です。

-   Microsoft® Visual Studio 2010 またははそれ以降のバージョンのインストール
-   MVC 3 Framework のインストール
-   Northwind データベースのインストール
-   *Infragistics.Web.Mvc.Mobile.dll* の追加
-   Ignite UI jQuery Mobile ファイルの追加

### 概要

このトピックでは、MVCで `igListView` を構成する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [Model の定義](#mvc-on-demand-model)
2.  [View の定義](#mvc-on-demand-view)
3.  [Controller の定義](#mvc-on-demand-controller)

### 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-on-demand-model"></a>

	1.  Northwind データベースに Product と Category テーブルの ADO.NET Entity Data Model を追加し、 NorthwindModel という名前を付けます。

		![](images/igListView_Multi-Level_Data_Binding__4.png)

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
	
	3.  新しいクラスをフォルダー モデルに追加し、*CategoryViewModel.cs* と名付けます。
	
	    **C# の場合:**
	
	    ```
	    public class CategoryViewModel
	    {
	        public string CategoryName { get; set; }
	        public List<ProductViewModel> Products { get; set; }
	        public string ImageUrl { get; set; }
	        private int _productCount = 0;
	        public int ProductCount
	        {
	            get
	            {
	                return this.Products.Count;
	            }
	        }
	        public CategoryViewModel()
	        {
	            this.Products = new List<ProductViewModel>();
	        }
	    }
	    ```
	
	4.  新しい Class を Models というフォルダーに追加して *LoadOnDemandViewModel.cs* という名前を付けます。
	
	    **C# の場合:**
	
	    ```
	    public class LoadOnDemandViewModel
	    {
	        public IEnumerable<object> Records { get; set; }
	        public int TotalRecordsCount { get; set; }
	    }
	    ```

2. View の定義 <a id="mvc-on-demand-view"></a>

	Views フォルダーに新しい View を追加します。それを *igListViewLoadOnDemand.cshtml* と名付けます。
	
	**C# の場合:**
	
	```
	@model IQueryable<CategoryViewModel>
	<script type="text/javascript" src="infragistics.mobile.loader.js"></script>
	@(Html.InfragisticsMobile().
	    Loader().
	    ScriptPath("../js/").
	    CssPath("../css/").
	    Resources("igmList.LoadOnDemand").
	    Render())
	@(Html
	    .InfragisticsMobile()
	    .ListView(Model)
	    .ID("loadOnDemandListView")
	    .ImageMode(ImageMode.Icon)
	    //Configures children to be requested from the server
	    .LoadChildrenOnDemand(true)
	    .Bindings(b =>
	    {
	        b.HeaderKey("CategoryName")
	        .PrimaryKey("CategoryName")
	        .CountKey("ProductCount")
	        .ImageUrlKey("ImageUrl")
	        .DetailsTitleKey("CategoryName");
	    })
	    .ChildLayout(layout =>
	    {
	        layout.For(c => c.Products)
	        .Key("Products")
	        .ImageMode(ImageMode.Icon)
	        .Bindings(b =>
	        {
	            b.TextKey("ProductName")
	            .DescriptionKey("CategoryName")
	            .ImageUrlKey("ImageUrl");
	        })
	        .DataSourceUrl(Url.Action("ProductJSONOnDemand"));
	    })
	    .DataBind()
	    .Render()
	)
	```

3. コントローラーの定義 <a id="mvc-on-demand-controller"></a>

	1.  *Controllers* フォルダーに新しいコントローラーを追加します。それを *ListViewController.cs* と名付けます。
	2.  新しいアクションを `igListView` を初期化するコントローラーに追加します。それを `igListViewLoadOnDemand` と名付けます。
	3.  新しいアクションを ロード オン デマンド データを返すコントローラーに追加します。`ProductJSONOnDemand` という名前を付けます。
	
	`GetProductsOnDemand` は、データベース モデル スキーマをステップ 1 で定義したカスタム モデル クラスに変換しているヘルパー メソッドです。
	
	**C# の場合:**
	
	```
	public class ListViewController : Controller
	{
	    public ActionResult igListViewLoadOnDemand()
	    {
	        var categoryModels = new ViewModelCollectionHelper(Url.RequestContext).GetCategories();
	        return View(categoryModels.AsQueryable());
	    }
	    
	    public JsonResult ProductJSONOnDemand()
	    {
	        var query = this.HttpContext.Request.QueryString;
	        // extract Category Name from the query string
	        var category = query["path"].Substring("CategoryName:".Length);
	        var loadOnDemandModel = GetProductsOnDemand(category);
	        return Json(loadOnDemandModel, JsonRequestBehavior.AllowGet);
	    }
	    public LoadOnDemandViewModel GetProductsOnDemand(string category)
	    {
	        var products = (from p in new NorthwindEntities().Products.Include("Category")
	                        where (p.Category.CategoryName == category)
	                        select p).OrderBy(p => p.CategoryID);
	        var productCount = (from p in new NorthwindEntities().Products.Include("Category")
	                            where (p.Category.CategoryName == category)
	                            select p).Count();
	        var productModels = new List<ProductViewModel>();
	        UrlHelper urlHelper = new UrlHelper(Url.RequestContext);
	        foreach (var product in products)
	        {
	            productModels.Add(
	                new ProductViewModel
	                {
	                    CategoryName = product.Category.CategoryName,
	                    ProductName = product.ProductName,
	                    InStock = int.Parse(product.UnitsInStock.ToString()),
	                    ImageUrl = urlHelper.Content(
	                        String.Format("~/content/images/mobile/categories/{0}.png",
	                        product.CategoryID))
	                });
	        }
	        var results = new LoadOnDemandViewModel
	        {
	            Records = productModels.AsQueryable(),
	            TotalRecordsCount = productCount
	        };
	        return results;
	    }
	}
	```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [並べ替えの構成](igListView-Configuring-Sorting.html): このトピックでは、`igListView`™ の並べ替え機能を使用する方法を説明します。

- [フィルタリングの構成](igListView-Configuring-Filtering.html): このトピックでは、`igListView`™ のフィルタリング機能を使用する方法を示します。

- [グループ化の構成](igListView-Configuring-Grouping.html): このトピックでは、`igListView`™ のグループ化機能を使用する方法を説明します。

- [ロード オン デマンドの構成](igListView-Configuring-Load-on-Demand.html): このトピックでは、`igListView`™ のロード オン デマンド機能の使い方を示します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [ロード オン デマンド](%%SamplesUrl%%/mobile-list-view/load-on-demand): このサンプルはリモート ロード オン デマンド機能を示したものです。





 

 



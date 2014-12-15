<!--
|metadata|
{
    "fileName": "iglistview-configuring-load-on-demand",
    "controlName": "igListView",
    "tags": ["How Do I","MVC","Performance"]
}
|metadata|
-->

# ロード オン デマンドを構成する (igListView)

## トピックの概要

### 目的

このトピックでは、`igListView`™ のロード オン デマンド機能の使い方を示します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView`™ の機能について説明します。

- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。

- [データ属性リファレンス](igListView-Data-Attributes-Reference.html): このトピックでは、すべての `igListView`™ データ属性の一覧を示します。これらの属性を使用して、マークアップで `igListView` を初期化できます。 



#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**プロパティ リファレンス**](#property-reference)
-   [**イベント リファレンス**](#events-reference)
-   [**igListView ローカル ロード オン デマンドを JavaScript で構成する**](#js)
    -   [要件](#js-requirements)
    -   [概要](#js-overview)
    -   [手順](#js-steps)
-   [**igListView を MVC のローカル ロード オン デマンドで構成する**](#mvc)
    -   [要件](#mvc-requirements)
    -   [概要](#mvc-overview)
    -   [手順](#mvc-steps)
-   [**igListView を MVC のリモート ロード オン デマンドで構成する**](#mvc-remote)
    -   [要件](#mvc-remote-requirements)
    -   [概要](#mvc-remote-overview)
    -   [手順](#mvc-remote-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igListView` コントロールには、ロード オン デマンド機能があります。この機能を使うことで、ユーザーはボタンを押すことでフラット データに対して項目の追加を求めることができます。ロード オン デマンドはローカルでもリモートでも可能です。

リモートのロード オン デマンドは簡単に設定できます。データを返すアクション メソッドに `ListViewDataSourceAction` 属性を適用するだけです。この属性は、背後で実際のリモート操作を行い、機能をより容易かつトランスペアレントに構成します。

![](images/igListView_Load_on_Demand_1.png)



## <a id="property-reference"></a> プロパティ リファレンス

このセクションでは、`igListView` ロード オン デマンド機能のさまざまなプロパティを説明します。

次の表は、`igListView` ロード オン デマンド コントロール特有のプロパティの目的と機能について概要を示します。

プロパティ|説明
---|---
[type](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#options:type)|ローカルまたはリモートのロード オン デマンドを定義します。
[pageSize](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#options:pageSize) |*0* よりも大きい場合、最初にフェッチされてロードされる項目をいくつにするかをコントロールします。
[recordCountKey](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#options:recordCountKey) |データ ソース中のレコード総数を保持する応答内のプロパティです。
[pageSizeUrlKey](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#options:pageSizeUrlKey) |現在要求されているページ サイズが何であるかを示すエンコードされた URL パラメータの名前を示します。
[pageIndexUrlKey](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#options:pageIndexUrlKey) |現在要求されているページ インデックスが何であるかを示すエンコードされた URL パラメータの名前を示します。
[mode](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#options:mode) |追加小目をロードするためのボタンを表示するか、自動的にフェッチするかを定めます。
[autoHideButtonAtEnd](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#options:autoHideButtonAtEnd) |True の場合、残っているページはなく（データ ソースによれば）、**追加データのロード** ボタンと自動ローディングは停止します。




## <a id="events-reference"></a> イベント リファレンス

このセクションでは、`igListView` ロード オン デマンド機能で発生するイベントをリストします。

次の表は、`igListView` ロード オン デマンド機能イベントの目的と機能について概要を示します。

イベント|説明|キャンセル可能
---|---|---
[itemsRequesting](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#events:itemsRequesting) |このイベントは、データの新しいページがフェッチされる前に発生し、`dataView` に追加されます。|true
[itemsRequested](%%jQueryApiUrl%%/mobile.igListViewLoadOnDemand#events:itemsRequested) |このイベントは、データの新しいページが `dataView` に追加された後に発生します。|false





## <a id="js"></a> igListView ローカル ロード オン デマンドを JavaScript で構成する

この手順は、ロード オン デマンド機能を有効にして `igListView` を初期化し、それを JavaScript 配列にバインドします。ロード オン デマンドはクライアント上のフラット データに対して行われ、ページ サイズは 5 項目に設定されます。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Load_on_Demand_1.png)

### <a id="js-requirements"></a> 要件

手順を完了するために、Ignite UI %%ProductVersionShort%% 製品をインストールしておく必要があります。

### <a id="js-overview"></a> 概要

このトピックでは、ロード オン デマンド機能をもつ `igListView` を JavaScript で構成するための手順を順を追って説明します。以下はプロセスの概念的概要です。

1.  [インフラジスティックス ローダーを使用してスクリプト参照を追加](#js-add-references)
2.  [データ ソースの定義](#js-define-data-source)
3.  [ロード オン デマンド機能をもつ igListView の宣言的な構成](#js-init-markup)
4.  [オプション:  ロード オン デマンド機能をもつ igListView を JavaScript でインスタンス化する](#js-init-javascript)

### <a id="js-steps"></a> 手順

次の手順では、ロード オン デマンド機能をもつ `igListView` を JavaScript で構成する方法を説明します。

1. インフラジスティックス ローダーを使用してスクリプト参照を追加 <a id="js-add-references"></a>

	以下は、ロード オン デマンド機能が有効になった `igListView` の初期化に必要な参照のリストです。ローダーでロード オン デマンド機能を有効にするには、`resources` プロパティを `igmList.LoadOnDemand` に設定します。
	
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
	        resources: "igmList.LoadOnDemand",
	        theme: "ios"
	    });
	</script>
	```

2. データ ソースを定義する <a id="js-define-data-source"></a>

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

3. ロード オン デマンド機能をもつ `igListView` の宣言的な構成 <a id="js-init-markup"></a>

	多くの data-* 属性を含む UL HTML 要素を定義する必要があります。Data-bindings-* を使用してリスト ビューの定義済みプレースホルダーをデータ ソース フィールドにバインドします。Data-load-on-demand-* 属性は、ロード オン デマンド機能を構成するのに使われます。
	
	**HTML の場合:**
	
	```
	<ul id="loadOnDemandListView"
	    data-role="iglistview" 
	    data-image-mode="icon"
	    data-auto-generate-layouts="False" 
	    data-bindings-header-key="ProductName"
	    data-bindings-description-key="CategoryName"
	    data-bindings-count-key="InStock"
	    data-data-source="northwindProducts" 
	    data-data-source-type="json" 
	    data-load-on-demand="true" 
	    data-load-on-demand-page-size="5">
	</ul>
	```

4. オプション:  ロード オン デマンド機能をもつ `igListView` を JavaScript でインスタンス化する <a id="js-init-javascript"></a>

	1. DOM html 要素のプレースホルダを定義します。
	
		**HTML の場合:**
		
		```
		<div id="loadOnDemandListView"></div>
		```
	
	2. JavaScript で `igListView` をインスタンス化します。
	
		**JavaScript の場合:**
		
		```
		$.ig.loader(function() {
		    $("#loadOnDemandListView").igListView({
		        dataSource: northwindProducts,
		        bindings: {
		            descriptionKey: "CategoryName",
		            textKey: "ProductName",
		            countKey: "InStock"
		        },
		        features: [
		            {
		                name:'LoadOnDemand',
		                type: 'local', 
		                pageSize: 5
		            }
		        ]
		    });
		});
		```



## <a id="mvc"></a> igListView を MVC のローカル ロード オン デマンドで構成する

この手順は、ロード オン デマンド機能が有効化されている Razor コード内の `igListView` を初期化します。データはモデルから取り出され、ロード オン デマンド機能はローカルになるよう構成されます。このことは、データは最初だけ `igListViewLoadOnDemand` アクション メソッドから要求されることを意味します。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Load_on_Demand_3.png)

### <a id="mvc-requirements"></a> 要件

この手順を実行するには、以下が必要です。

-   Microsoft® Visual Studio 2010 またははそれ以降のバージョンのインストール
-   MVC 3 Framework のインストール
-   Northwind データベースのインストール
-   *Infragistics.Web.Mvc.Mobile.dll* の追加
-   Ignite UI jQuery Mobile ファイルの追加

### <a id="mvc-overview"></a> 概要

このトピックでは、MVCで `igListView` を構成する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [Model の定義](#mvc-local-model)
2.  [View の定義](#mvc-local-view)
3.  [Controller の定義](#mvc-local-controller)

### <a id="mvc-steps"></a> 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-local-model"></a>

	1.  *Northwind データベース*に `Product` と `Category` テーブルの ADO.NET Entity Data Model を追加し、 `NorthwindModel` という名前を付けます。
	
		![](images/igListView_Load_on_Demand_4.png)
	
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

	Views フォルダーに新しい View を追加します。それを *igListViewLoadOnDemand.cshtml* と名付けます。
	
	次のコード スニペットでは、`IQueryable<CategoryViewModel>` の強く型付けされたモデルが定義されます。`igListView` を定義する場合、バインディングの定義にこのモデルを使用してください。
	
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
	    .Inset(true)
	    .ImageMode(ImageMode.Icon)
	    .Bindings(b =>
	    {
	        b.HeaderKey("CategoryName")
	        .PrimaryKey("CategoryName")
	        .CountKey("ProductCount")
	        .ImageUrlKey("ImageUrl")
	        .DetailsTitleKey("CategoryName");
	    })
	    .Features(f =>
	    {
	        f.LoadOnDemand()
	        .Type(OpType.Local)
	        .PageSize(5);
	    })
	    .DataBind()
	    .Render()
	)
	```

3. コントローラーの定義 <a id="mvc-local-controller"></a>

	1.  Controllers フォルダーに新しいコントローラーを追加します。それを *ListViewController.cs* と名付けます。
	2.  新しいアクションを `igListView` を初期化するコントローラーに追加します。それを `igListViewLoadOnDemand` と名付けます。
	
	`GetCategories` は、データベース モデル スキーマをステップ 1 で定義されたカスタム モデル クラスの `CategoryViewModel` に変換するヘルパー メソッドです。
	
	**C# の場合:**
	
	```
	public class ListViewController : Controller
	{
	    public ActionResult igListViewLoadOnDemand()
	    {
	        var categoryModels = GetCategories();
	        return View(categoryModels.AsQueryable());
	    }
	    
	    public IQueryable<CategoryViewModel> GetCategories()
	    {
	        var categories = from c in new NorthwindEntities().Categories.Include("Products")
	                select c;
	        var categoryModels = new List<CategoryViewModel>();
	        foreach (var category in categories)
	        {
	            var categoryModel = new CategoryViewModel
	            {
	                CategoryName = category.CategoryName,
	                ProductCount = category.Products.Count,
	                ImageUrl = _url.Content(String.Format("~/content/images/mobile/categories/{0}.png", category.CategoryID))
	            };
	            categoryModels.Add(categoryModel);
	        }
	        return categoryModels.AsQueryable();
	    }
	}
	```



## <a id="mvc-remote"></a> igListView を MVC のリモート ロード オン デマンドで構成する

この手順は、ロード オン デマンド機能が有効化されている Razor コード内の `igListView` を初期化します。所期のデータは `igListViewLoadOnDemand` アクション メソッドに設定されたモデルから取り出され、ロード オン デマンド機能はリモートとなるよう構成されます。続くデータは `RemoteListViewCategories` アクション メソッドから要求されます。これは `igListView` に対して `DataSourceUrl` を設定することで行われます。`ListViewDataSourceAction` 属性が `RemoteListViewCategories` に追加されます。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Load_on_Demand_3.png)

### <a id="mvc-remote-requirements"></a> 要件

-   この手順を実行するには、以下が必要です。
-   -    Microsoft® Visual Studio 2010 またははそれ以降のバージョンのインストール
    -   MVC 3 Framework のインストール
    -   Northwind データベースのインストール
    -   *Infragistics.Web.Mvc.Mobile.dll* の追加
    -   Ignite UI jQuery Mobile ファイルの追加

### <a id="mvc-remote-overview"></a> 概要

このトピックでは、MVCで `igListView` を構成する方法について順を追って説明します。
以下はプロセスの概念的概要です。

1.  [Model の定義](#mvc-remote-model)
2.  [View の定義](#mvc-remote-view)
3.  [Controller の定義](#mvc-remote-controller)

### <a id="mvc-remote-steps"></a> 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-remote-model"></a>

	1.  *Northwind データベース*に `Product` と `Category` テーブルの ADO.NET Entity Data Model を追加し、 `NorthwindModel` という名前を付けます。
	
		![](images/igListView_Load_on_Demand_4.png)
	
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

2. View の定義 <a id="mvc-remote-view"></a>

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
	    .Inset(true)
	    .ImageMode(ImageMode.Icon)
	    .Bindings(b =>
	    {
	        b.HeaderKey("CategoryName")
	        .PrimaryKey("CategoryName")
	        .CountKey("ProductCount")
	        .ImageUrlKey("ImageUrl")
	        .DetailsTitleKey("CategoryName");
	    })
	    .Features(f =>
	    {
	        f.LoadOnDemand()
	        .Type(OpType.Remote)
	        .PageSize(5);
	    })
	    .DataSourceUrl(Url.Action("RemoteListViewCategories"))
	    .DataBind()
	    .Render()
	)
	```

3. コントローラーの定義 <a id="mvc-remote-controller"></a>

	1. Controllers フォルダーに新しいコントローラーを追加します。それを *ListViewController.cs* と名付けます。
	
	2. 新しいアクションを `igListView` を初期化するコントローラーに追加します。それを `igListViewLoadOnDemand` と名付けます。
	
	3. 新しいアクションを ロード オン デマンド データを返すコントローラーに追加します。それを `RemoteListViewCategories` と名付けます。それに `ListViewDataSourceAction` 属性を追加します。`GetCategories` は、データベース モデル スキーマをステップ 1 で定義されたカスタム モデル クラスの `CategoryViewModel` に変換するヘルパー メソッドです。
	
	**C# の場合:**
	
	```
	public class ListViewController : Controller
	{
	    public ActionResult igListViewLoadOnDemand()
	    {
	        var categoryModels = GetCategories();
	        return View(categoryModels.AsQueryable());
	    }
	    
	    [ListViewDataSourceAction]
	    public ActionResult RemoteListViewCategories()
	    {
	        var categoryModels = new ViewModelCollectionHelper(Url.RequestContext).GetCategories();
	        return View(categoryModels);
	    }
	    
	    public IQueryable<CategoryViewModel> GetCategories()
	    {
	        var categories = from c in new NorthwindEntities().Categories.Include("Products")
	                select c;
	        var categoryModels = new List<CategoryViewModel>();
	        foreach (var category in categories)
	        {
	            var categoryModel = new CategoryViewModel
	            {
	                CategoryName = category.CategoryName,
	                ProductCount = category.Products.Count,
	                ImageUrl = _url.Content(String.Format("~/content/images/mobile/categories/{0}.png", category.CategoryID))
	            };
	            categoryModels.Add(categoryModel);
	        }
	        return categoryModels.AsQueryable();
	    }
	}
	```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [並べ替えの構成](igListView-Configuring-Sorting.html): このトピックでは、`igListView`™ の並べ替え機能を使用する方法を説明します。

- [フィルタリングの構成](igListView-Configuring-Filtering.html): このトピックでは、`igListView`™ のフィルタリング機能を使用する方法を示します。

- [グループ化の構成](igListView-Configuring-Grouping.html): このトピックでは、`igListView`™ のグループ化機能を使用する方法を説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [ロード オン デマンド](%%SamplesUrl%%/mobile-list-view/load-on-demand): このサンプルはリモート ロード オン デマンド機能を示したものです。

- [リモート機能](%%SamplesUrl%%/mobile-list-view/remote-features): このサンプルでは、グループ化と一緒にリモート並べ替えを示します。





 

 



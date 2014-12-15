<!--
|metadata|
{
    "fileName": "iglistview-adding-iglistview-to-a-web-page",
    "controlName": "igListView",
    "tags": ["API","Getting Started","How Do I"]
}
|metadata|
-->

# igListView の Web ページへの追加

## トピックの概要

### 目的

このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。

### 前提条件

- 概念
	- [jQuery Mobile フレームワーク](http://jquerymobile.com/)
- トピック
	- [igListView](igListView.html): すべての `igListView` トピックのランディング ページ。
	- [igListView の概要](igListView-Overview.html): `igListView` の概念的概要を提供します。
- 外部リソース
	- [jQuery Mobile イベント](http://jquerymobile.com/demos/1.1.0-rc.1/docs/api/events.html)



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**プロパティ リファレンス**](#property-reference)
-   [**メソッド リファレンス**](#method-reference)
-   [**イベント リファレンス**](#events-reference)
-   [**バインディング リファレンス**](#bindings-reference)
-   [**igListView の Web ページへの追加**](#adding)
    -   [プレビュー](#preview)
    -   [概要](#overview)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igListView` コントロールは、さまざまな種類のデータ ソースにバインドできます。これを行うには、`igDataSource` ウィジェットを `igListView` およびデータ ソース自体の中間物として使用します。これとは別に、`igListView` は Unordered List および Ordered List の HTML 要素にバインドできます。

デフォルトでは、`igListView` は事前定義された一連のプロパティを含み、それらに対してバインドできます。これらは `Bindings` プロパティで定義されます。たとえば、ヘッダー、テキスト、画像、ナビゲーション URL、カウント バブル、リスト内の各項目の記述を定義できます。インフラジスティックス テンプレート エンジンを使用して独自のテンプレートを定義することもできます。これは `itemTemplate` プロパティを使用して行います。

![](images/Adding_igListView_1.png)



## <a id="property-reference"></a> プロパティ リファレンス

このセクションでは、`igListView` のさまざまなプロパティについて説明します。

以下の表は、`igListView` コントロールの並べ替え機能の主なプロパティの目的と機能の概要を示しています。

プロパティ|説明
---|---
[inset](%%jQueryApiUrl%%/mobile.igList#options:inset) |list view をページ内の挿入物のように示すかどうかを決定します。
[numberedList](%%jQueryApiUrl%%/mobile.igList#options:numberedList) |ol または ul を、データ バインド リストのメイン要素として使用するかどうかを示します。
[dataSource](%%jQueryApiUrl%%/mobile.igList#options:dataSource) |`$.ig.DataSource` が受け入れる任意の有効なデータ ソース、または `$.ig.DataSource` 自身のインスタンスにすることができます。
[dataSourceUrl](%%jQueryApiUrl%%/mobile.igList#options:dataSourceUrl) |AJAX コール `($.ajax)` を使用してデータが取得されるデータ ソースとしてリモート URL を指定します。
[dataSourceType](%%jQueryApiUrl%%/mobile.igList#options:dataSourceType) |データ ソースの種類 (json など) を明示的に設定します。
[itemTemplate](%%jQueryApiUrl%%/mobile.igList#options:itemTemplate) |リスト項目を描画するために使用される、IG templating スタイル テンプレート。
[itemDetailsTemplate](%%jQueryApiUrl%%/mobile.igList#options:itemDetailsTemplate) |サブ ページ内のリスト項目の詳細を描画するために使用される、IG templating スタイル テンプレート。
[imageMode](%%jQueryApiUrl%%/mobile.igList#options:imageMode) |画像、アイコン、またはiサムネイルを表示するかどうかを決定します。
[showCount](%%jQueryApiUrl%%/mobile.igList#options:showCount) |カウント バブルを表示するかどうかを決定します。
[itemHeaderSize](%%jQueryApiUrl%%/mobile.igList#options:itemHeaderSize) |LI に見出しタグを表示するかどうかを決定します。値によって、H1 から H6 になります。
[bindings](%%jQueryApiUrl%%/mobile.igList#options:bindings) |データ バインディング プロパティおよびキーを指定します。
[searchTrayExpandLabel](%%jQueryApiUrl%%/mobile.igList#options:searchTrayExpandLabel) |折り畳まれ、すべての状態がデフォルトの場合に、検索トレーのフッターに表示されるテキスト。
[features](%%jQueryApiUrl%%/mobile.igList#options:features) |多数のリスト フィルター定義: 並べ替え、フィルタリング、ロード オン デマンドなど。





## <a id="method-reference"></a> メソッド リファレンス

このセクションでは、`igListView` のメソッドについて説明します。

以下の表は、`igListView` コントロールの並べ替え機能の主なプロパティの目的と機能の概要を示しています。

メソッド|説明|パラメーター
---|---|---
[container](%%jQueryApiUrl%%/mobile.igList#methods:container) |リスト ウィジェットの最上位のコンテナーである DIV を返します。|なし
[toggleSearchArea](%%jQueryApiUrl%%/mobile.igList#methods:toggleSearchArea) |検索領域を切り替えます。|なし
[dataBind](%%jQueryApiUrl%%/mobile.igList#methods:dataBind) |データにバインドします。|なし
[destroy](%%jQueryApiUrl%%/mobile.igList#methods:destroy) |ウィジェットを破棄します。|なし



## <a id="events-reference"></a> イベント リファレンス

このセクションは、`igListView` が発生するイベントを示します。

以下の表は、`igListView` コントロールのイベントの目的と機能の概要を示します。

イベント|説明|キャンセル可能
---|---|---
[dataBinding](%%jQueryApiUrl%%/mobile.igList#events:dataBinding) |このイベントは、データ バインディングの発生前に発生します。|true
[dataBound](%%jQueryApiUrl%%/mobile.igList#events:dataBound) |このイベントは、データ バインディングの完了後に発生します。|false
[dataRendering](%%jQueryApiUrl%%/mobile.igList#events:dataRendering) |このイベントは、UL/OL をクリーンアップし、新しい項目をレンダリングする前に発生します。|true
[dataRendered](%%jQueryApiUrl%%/mobile.igList#events:dataRendered) |このイベントは、リストが完全に描画された後に発生します。|false
[renderingTray](%%jQueryApiUrl%%/mobile.igList#events:renderingTray) |このイベントは、リストに対して検索トレーが描画される前に発生します。|true
[renderedTray](%%jQueryApiUrl%%/mobile.igList#events:renderedTray) |このイベントは、リストに対して検索トレーが描画された後に発生します。|false
[renderingTrayFooterBar](%%jQueryApiUrl%%/mobile.igList#events:renderingTrayFooterBar) |このイベントは、リストに対して検索トレーのフッター バーが描画される前に発生します。|true
[renderedTrayFooterBar](%%jQueryApiUrl%%/mobile.igList#events:renderedTrayFooterBar) |このイベントは、リストに対して検索トレーのフッター バーが描画された後に発生します。|false
[footerRendering](%%jQueryApiUrl%%/mobile.igList#events:footerRendering) |このイベントは、リストに対してフッターが描画される前に発生します。これを使用して、コンテンツをフッターに追加します。|true
[footerRendered](%%jQueryApiUrl%%/mobile.igList#events:footerRendered) |このイベントは、リスト表示フッターの描画後に発生します。|false
[itemsRendering](%%jQueryApiUrl%%/mobile.igList#events:itemsRendering) |このイベントは、新しいリスト項目の描画前に発生します。|true
[itemsRendered](%%jQueryApiUrl%%/mobile.igList#events:itemsRendered) |このイベントは、リスト項目が作成され、DOM に追加された後に発生します。|false
[subPageCreating](%%jQueryApiUrl%%/mobile.igList#events:subPageCreating) |このイベントは、子リストおよび/または詳細のページが作成される前に発生します。|true
[subPageCreated](%%jQueryApiUrl%%/mobile.igList#events:subPageCreated) |このイベントは、リスト項目が作成され、DOM に追加された後に発生します。|false
[schemaGenerated](%%jQueryApiUrl%%/mobile.igList#events:schemaGenerated) |このイベントは、$.ig.DataSource スキーマが生成された後、それを修正する必要がある場合に発生します。|false
[requestError](%%jQueryApiUrl%%/mobile.igList#events:requestError) |このイベントは、リストがリモート操作 (データ バインディング、ロード オン デマンド、並べ替えなど) を実行しているときに、要求にエラーがある場合に発生します。|false



## <a id="bindings-reference"></a> バインディング リファレンス

### 概要

このセクションでは、`igListView` の事前定義されたバインディングのプロパティについて説明します。デフォルトのテンプレートは以下のコードに似ていますが、設定によって異なります。

**HTML の場合:**

```
<li>
    <div>
        <a href="${navigateUrlKey}">
            <img src="${imageUrlKey}">
            <h2>${headerKey}</h2>
            <p>${descriptionKey}</p>
            ${textKey}
            <span>${countKey}</span>
        </a>
    </div>
</li>
```

見出し部分は `itemHeaderSize` プロパティを介して構成できます。

または、インフラジスティックス テンプレート エンジンを使用して独自のテンプレートを定義することもできます。この場合は `itemTemplate` プロパティを使用してください。

### バインディング リファレンスの概要

以下の表は、`igListView` bindings オブジェクト リテラルの主なプロパティの目的と機能の概要を示しています。

プロパティ|説明
---|---
[textKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.textKey) |その値がノード テキストになる、data source プロパティの名前を指定します。
[imageUrlKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.imageUrlKey) |その値がノード画像の URL として使用される、data source プロパティの名前を指定します。
[navigateUrlKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.navigateUrlKey) |その値がノード アンカーの href 属性として使用される、data source プロパティの名前を指定します。
[countKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.countKey) |その値がノードのカウントとして使用される、data source プロパティの名前を指定します。
[headerKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.headerKey) |その値がノードのヘッダーとして使用される、data source プロパティの名前を指定します。
[descriptionKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.descriptionKey) |その値がノードの記述として使用される、data source プロパティの名前を指定します。
[primaryKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.primaryKey) |その値がデータのプライマリ キー属性として使用される、data source プロパティの名前を指定します。ロード オン デマンドが有効であり、指定されたノードのパスがインデックスの代わりにプライマリ キーを使用して生成される場合に、このプロパティが使用されます。
[isDividerKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.isDividerKey) |項目が読み取り専用のリスト ディバイダーを表すかどうかを決定するために使用される data source プロパティの名前を指定します。
[detailsTitleKey](%%jQueryApiUrl%%/mobile.igList#options:bindings.detailsTitleKey) |その値がノードのサブ ページのタイトルになる、data source プロパティの名前を指定します。
[customBindings](%%jQueryApiUrl%%/mobile.igList#options:bindings.customBindings) |カスタム バインディングのオブジェクト リスト。これによって追加データが item または details テンプレートで使用されることになります。各項目は、`fieldName` および `dataType` のキー/値のペアを含むオブジェクトになります。




## <a id="adding"></a> igListView の Web ページへの追加

この手順では、`igListView` を Web ページに追加するプロセスを説明します。いくつかの方法で、コントロールをインスタンス化することができます。ここでは、標準的な jQuery UI メソッドおよび jQuery mobile メソッドについて、属性を使用して説明します。

### <a id="preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Adding_igListView_1.png)

### <a id="overview"></a> 概要

このトピックでは、`igListView` を Web ページに追加する方法をステップごとに示します。以下はプロセスの概念的概要です。

1.  [必要な JavaScript および CSS ファイルの参照](#reference-resources)
2.  [データの定義](#define-data)
3.  [igListView のインスタンス化](#instantiate)

### <a id="steps"></a> 手順

以下のステップでは、`igListView` を Web ページに追加する方法を示します。

1. 必要な JavaScript および CSS ファイルを参照します。 <a id="reference-resources"></a>
	
	数種類の方法で、必要なファイルを追加できます。

	-   個々のスクリプトの使用
	
	-   Infragistics Loader の使用
	
	推奨される方法は、ローダーの使用です。

	-   個々のファイルを使用して参照します。

		**HTML の場合:**

	    ```
	    <link rel="stylesheet" href="jquery.mobile.structure.min.css" />
	    <link rel="Stylesheet" href="infragistics.mobile.list.css" />
	    <link rel="Stylesheet" href="infragistics.mobile.theme.css" />
	        
	    <script type="text/javascript" src="jquery.min.js"></script>
	    <script type="text/javascript" src="jquery.mobile.min.js"></script>
	        
	    <script type="text/javascript" src="infragistics.util.js"></script>
	    <script type="text/javascript" src="infragistics.ui.shared.js"></script>
	    <script type="text/javascript" src="infragistics.datasource.js"></script>
	    <script type="text/javascript" src="infragistics.ui.scroll.js"></script>
	    <script type="text/javascript" src="infragistics.mobileui.list.js"></script>
	    ```
	-   Infragistics Loader を使用して参照します。

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

2. バインドするデータを定義します <a id="define-data"></a>

	次のコードは、オブジェクトの JavaScript 配列を定義するものです。このデータを使用して、`igListView` をデータにバインドします。Northwind Employees テーブルのデータを使用します。

	**JavaScript の場合:**
	
	```
	var northwindEmployees = [
	    { "ID": 1, "Name": "Davolio, Nancy", "Title": "Sales Representative", 
	        "ImageUrl": "../content/images/nw/employees/1.png",
	        "Phone": "(206) 555-9857", "PhoneUrl": "tel:(206) 555-9857" },
	    { "ID": 2, "Name": "Fuller, Andrew", "Title": "Vice President, Sales", 
	        "ImageUrl": "../content/images/nw/employees/2.png",
	        "Phone": "(206) 555-9482", "PhoneUrl": "tel:(206) 555-9482" },
	    { "ID": 3, "Name": "Leverling, Janet", "Title": "Sales Representative", 
	        "ImageUrl": "../content/images/nw/employees/3.png",
	        "Phone": "(206) 555-3412", "PhoneUrl": "tel:(206) 555-3412" },
	    { "ID": 4, "Name": "Peacock, Margaret", "Title": "Sales Representative", 
	        "ImageUrl": "../content/images/nw/employees/4.png",
	        "Phone": "(206) 555-8122", "PhoneUrl": "tel:(206) 555-8122" },
	    { "ID": 5, "Name": "Buchanan, Steven", "Title": "Sales Manager", 
	        "ImageUrl": "../content/images/nw/employees/5.png",
	        "Phone": "(71) 555-4848", "PhoneUrl": "tel:(71) 555-4848" },
	]
	```

3. `igListView` のインスタンス化 <a id="instantiate"></a>
	
	1. マークアップを使用したインスタンス化
	
		マークアップのみを使用して `igListView` を Web ページでインスタンス化したい場合は、HTML UL 要素を定義する必要があります。提供されている JavaScript ファイルは、バックグラウンドでウィジェットをインスタンス化します。HTML 5 data-* 属性を使用して、要素をデータにバインドします。Data-role 属性は、HTML 要素をラップするコントロールを定義します。この場合は `iglistview` です。データ ソースは、ステップ 2 で定義された JavaScript array をポイントします。他の属性は、データ ソースからのプロパティにバインドします。

		**HTML の場合:**
		
		```
		<ul id="jsonListView"
		    data-role="iglistview"
		    data-data-source="northwindEmployees" 
		    data-bindings-header-key="Name"
		    data-bindings-primary-key="ID"
		    data-bindings-text-key="Phone"
		    data-bindings-image-url-key="ImageUrl"
		    data-bindings-navigate-url-key="PhoneUrl">
		</ul>
		```

	2. JavaScript におけるインスタンス化
	
		a. DIV HTML プレースホルダーを定義します。
	
		**HTML の場合:**
		
		```
		<div id="jsonListView"></div>
		```
		
		b. JavaScript 初期化コードを追加します
	
		-   Infragistics loader を使用している場合は、以下のコードを `$.ig.loader(function () {/*Initialization code here*/});` に追加します。
		-   個々のファイルを参照している場合は、jQuery Mobile `pageinit` イベントにバインドします。
	
		**JavaScript の場合:**
		
		```
		$("#jsonListView").igListView({
		    dataSource: northwindEmployees,
		    bindings: {
		        headerKey: 'Name',
		        primaryKey: 'ID',
		        textKey: 'Phone',
		        imageUrlKey: 'ImageUrl',
		        navigateUrlKey: 'PhoneUrl'
		    }
		});
		```
	
	3. MVC におけるインスタンス化

		**C# の場合:**
		
		```
		@model IQueryable<EmployeeViewModel>
		@(Html
		    .InfragisticsMobile()
		    .ListView(Model)
		    .ID("basicMvcListView")
		    .ImageMode(ImageMode.ThumbNail)
		    .Bindings(b =>
		    {
		        b.HeaderKeyFor(e => e.Name)
		            .PrimaryKeyFor(e => e.ID)
		            .TextKeyFor(e => e.Phone)
		            .ImageUrlKeyFor(e => e.ImageUrl);
		    })
		    .DataBind()
		    .Render()
		)
		```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView`™ の機能について説明します。

- [データ属性リファレンス](igListView-Data-Attributes-Reference.html): このトピックでは、すべての `igListView`™ データ属性の一覧を示します。これらの属性を使用して、マークアップで `igListView` を初期化できます。

- [igDataSource](igDataSource-igDataSource.html): このトピックでは、`igDataSource` トピックに関する参照の情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [JSON のバインド](%%SamplesUrl%%/mobile-list-view/json-binding): このサンプルでは、`igListView` を JSON オブジェクトにバインドする方法を示しています。

- [Collection にバインド](%%SamplesUrl%%/mobile-list-view/bind-collection): このサンプルでは、`igListView` を ASP.NET MVC アプリケーション内のモデルにバインドする方法を示しています。

- [動的バインド](%%SamplesUrl%%/mobile-list-view/dynamic-binding): このサンプルでは、ランタイムで `igListView` をバインドする方法を示しています。





 

 



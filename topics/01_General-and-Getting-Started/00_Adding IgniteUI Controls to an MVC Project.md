<!--
|metadata|
{
    "fileName": "adding-igniteui-controls-to-an-mvc-project",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# コントロールを MVC プロジェクトに追加

## トピックの概要

このトピックでは、ASP.NET MVC アプリケーションで %%ProductNameMVC%%™ コンポーネントを使用した作業の開始方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [%%ProductNameMVC%%™ の使用方法](#mvcHelper)
-   [%%ProductNameMVC%%™ コントロールを定義するメソッド](#methodsMVC)
-   [igTree を使用した ASP.NET MVC アプリケーションの開発](#developingMVC)
-   [関連コンテンツ](#related)

## <a id="mvcHelper"></a> MVC ヘルパーの使用方法

### モバイル MVC ヘルパーの使用方法の概要

%%ProductNameMVC%%™ は、MVC 拡張機能のサーバー側セットを提供します。これによって、次のようにして %%ProductName%% コントロールを定義および使用できるようになります。

**Razor の場合:**

```csharp
@(Html.Infragistics().CONTROL_NAME())
```

または

**Razor の場合:**

```csharp
@(Html.Infragistics().CONTROL_NAME(Model))
```

すべてのコントロールは、`Infragistics()` 拡張メソッドのヘルパー メソッドを使用でき、intellisense を使用して見ることができます。

**Razor の場合:**

```csharp
@(Html.Infragistics().Grid("grid1", Model.GridFiltering))
```

### インストールしたリソースへ移動

%%ProductName%% 20%%ProductVersionShort%% のインストール時に一般的なフォルダー構成を選択した場合、各リソースは次のパスに置かれています。

<table class="table">
	<thead>
		<tr>
			<th>タイプ</th>
			<th>パス</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>アセンブリ</td>
			<td>%%InstallPathMVC%%\</td>
		</tr>
		<tr>
			<td>スクリプト ファイル</td>
			<td>%%InstallPath%%\js</td>
		</tr>
		<tr>
			<td>CSS ファイル</td>
			<td>%%InstallPath%%\css</td>
		</tr>
	</tbody>
</table>

## ## MVC 4 および MVC 5

%%ProductNameMVC%% の機能は、`Infragistics.Web.Mvc` アセンブリに含まれています。これは、MVC4 と MVC5 の両方に対してコンパイル済みです。%%ProductNameMVC%% のアセンブリの場所の詳細は、「[%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」を参照してください。

> **注**: dll の参照の `Copy Local` プロパティを `true` に設定する必要があります。

### %%ProductNameMVC%% ローダーの使用

インフラジスティックス ローダーを使用してページに必要な依存スクリプトおよびスタイル ファイルをロードします。ローダーの使い方の詳細は、「[%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」を参照してください。

以下のコードは、%%ProductNameMVC%% ローダーを初期化する方法を示します。

**Razor の場合:**

  ```csharp
  <script src="{IG Resources root}/js/infragistics.loader.js"></script>
    @(Html.Infragistics()
        .Loader()
        .ScriptPath("{IG Resources root}/js/")
        .CssPath("{IG Resources root}/css/")
        .Render()
    )
  ```


JavaScript ファイルは、Infragistics CDN 上のホスト環境でも使用可能です。CDN を使用すると非常に多くのメリットがあります。詳細は、ヘルプ トピック「[インフラジスティックス コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html)」を参照してください。

**Razor の場合:**

```csharp
<script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.loader.js"></script>
```

**Razor の場合:**

```csharp
@(Html.Infragistics().Loader()
    .ScriptPath(“http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/”)
    .CssPath(“http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/”)
	.Render())
```

### Render() メソッドの呼び出し

%%ProductNameMVC%% コントロールをインスタンス化する場合、他のオプションをすべて構成し終わった後、最後に Render メソッドを呼び出します。これは、クライアントでコントロールをインスタンス化するのに必要な HTML および JavaScript を描画するメソッドです。

## <a id="methodsMVC"></a> %%ProductNameMVC%% コントロールを使用するメソッド

### コントロールを構成するメソッドの概要

MVC アプリケーションでコントロールを設定するための 2 つの異なるオプションがあります。以下の表は、コントロールを Model で定義するか View で定義するかに応じて %%ProductNameMVC%% コントロールの定義に使用できる方法を示します。詳細は、概要表の後に記載されています。

<table class="table">
	<thead>
		<tr>
			<th>メソッド</th>
			<th>説明</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Model でのコントロールの定義</td>
			<td>Model クラスを構成し、グリッド拡張メソッドの引数として渡すことでコントロールを定義します。</td>
		</tr>
		<tr>
			<td>View でのコントロールの定義</td>
			<td>チェーン構文を使用して View でコントロールを定義します。</td>
		</tr>
	</tbody>
</table>

### View でのコントロールの構成

チェーン構文を使用しコントロールを初期化すると、すべての作成および構成のロジックがビューに移動します。これによって、コントローラー コードが非常に簡潔で明快になります。ビューにコントロールを定義するには、呼び出したものと同じオブジェクトを常に返すヘルパー メソッドを介して、必要なプロパティとメソッドを公開します。

以下のコードは、チェーン構文を使用して`igTree` コントロールを初期化する方法を示します。

**Razor の場合:**

```csharp
@(Html.
        Infragistics().
        Tree().
        ID("MVCBoundTree").
        Bindings( bindings => {
            bindings.
            TextKey("Text").
            ValueKey("Value").
            ChildDataProperty("Child").
            Bindings( b1 => {
                b1.
                TextKey("Text").
                ValueKey("Value").
                ImageUrlKey("ImageUrl").
                NavigateUrlKey("NavigateUrl").
                TargetKey("Target");
            });
        }).
        DataSource(Model).
        DataBind().
        Render()  
)
```

複雑なオブジェクトでは、[ラムダ式](http://msdn.microsoft.com/ja-jp/library/bb397687.aspx)を使用して構文を得ます。以下にリストするコードは、ラムダ式を使用して `ColumnLayouts`  を構成する方法を示します。

**Razor の場合:**

```csharp
.ColumnLayouts(layouts =>
    {
        layouts.For(x => x.CustomerAddresses)
        .PrimaryKey("AddressID")
        .ForeignKey("CustomerID")
        .AutoGenerateColumns(false)
        .Columns(childcols1 =>
            {
                childcols1.For(x => x.AddressTypeID).HeaderText("AddressTypeID");
                childcols1.For(x => x.AddressID).HeaderText("AddressID");
                childcols1.For(x => x.CustomerID).HeaderText("CustomerID");
            })
	})
```

### Model でのコントロールの構成

モデル クラスを使用する場合、コントローラーに依存してコントロールを構成します。これは、要求の後に、コントロールのいくつかの設定やプロパティを取得する場合に便利です。これらは、チェーン構文を使用してすべてを View 内で構成した場合には使用できません。

> **注**: モデル クラスは、ビューにデータを返すために使用できるヘルパーとして存在します。これは、コントローラーの特定の機能に必要なわけではありませんが、複雑なリモート操作のコーディングを簡素化します。

**C# の場合:**

```csharp
[ActionName("Filtering")]
public ActionResult GridFiltering()
{
   GridFilteringModel model = new GridFilteringModel();
   model.GridFiltering.DataSourceUrl = Url.Action("BindGridFiltering");
   this.InitializeSortingGridOptions(model.GridFiltering);
   return View(model);
}

private void InitializeSortingGridOptions(GridModel model)
{
   model.Height = "500px";
   model.Columns.Add(new GridColumn("Product ID", "ProductID", "number", "100px"));
   model.Columns.Add(new GridColumn("Product Name", "Name", "string", "300px"));
   model.Columns.Add(new GridColumn("Product Number", "ProductNumber",        "string", "205px"));
   model.Columns.Add(new GridColumn("Standard Cost", "StandardCost", "number", "110px"));
   GridFiltering filtering = new GridFiltering();
   model.Features.Add(filtering);
}
```



## <a id="developingMVC"></a>igTree を使用した ASP.NET MVC アプリケーションの開発

### 概要

以下の手順では、%%ProductNameMVC%% を使用して作業するために必要なアセンブリおよびリソース (CSS および JavaScript ファイル) を追加する方法を示します。

### 要件

この手順を実行するには、以下が必要です。

-   Web アプリケーションが含まれるプロジェクト
-   %%ProductName%% 20%%ProductVersionShort%% がインストール済み
-   [jQuery](http://jquery.com/) コア ライブラリ バージョン 1.4.4 またはそれ以降
-   [jQuery UI](http://jqueryui.com/) ライブラリ 1.8.17 以降
-   [Modernizr](http://modernizr.com/) オープン ソース JavaScript ライブラリ 2.5.2 以降

### 概要

このトピックでは、 `igTree` コントロールを使用した ASP.NET MVC アプリケーションの作成について順を追って説明します。以下はプロセスの概念的概要です。

1. チェーンを使用した MVC アプリケーション内の `igTree` の宣言

2. コントローラーのコードの追加

3. バインディング

### 手順

以下の手順は、`igTree` を使用して ASP.NET MVC アプリケーションを開発する方法を示します。

1. MVC アプリケーションへの必要なリソースの追加

	 - %%ProductName%% 20%%ProductVersionShort%% のインストール フォルダーへ移動します: `%%InstallPath%%`。
	
	 - `js` および `css` フォルダーを MVC アプリケーションのルート ディレクトリへコピーします。
	
	 - `Infragistics.Web.Mvc` アセンブリへの参照を追加します。
	
	> **注**: dll の参照の `Copy Local` プロパティを `true` に設定する必要があります。

2. MVC アプリケーションで igTree を宣言

	 - Infragistics Loader を追加
	
	この手順では、ページのヘッダーに Infragistics Loader を追加します。
	
	**Razor の場合:**
	
	```csharp
	@(Html.Infragistics()
	        .Loader()
	        .ScriptPath("{IG Resources root}/js/")
	        .CssPath("{IG Resources root}/css/")
	        .Render()
	)
	```
	
	 - igTree コントロールを追加
	
	この手順では、MVC アプリケーションに `igTree` コントロールを追加します。
	
	**Razor の場合:**
	
	```csharp
	@(Html.Infragistics()
	        .Tree()
	        .ID("XmlTree")
	        .InitialExpandDepth(0)
	        .DataSource(Model)
	        .CheckboxMode(CheckboxMode.TriState)
	        .DataBind()
	        .Render()  
	)
	```
	
	> **注**: コード リストの Render メソッドの使用に注意してください。すべての %%ProductNameMVC%% は、コントロールのサーバー側描画を開始するために最後のメソッドとして Render メソッドを呼び出す必要があります。

3. コントローラーのコードを追加

	 - アクション名を追加
	
	この手順では、コントローラーに `ActionName` を追加します。
	
	**C# の場合:**
	
	```csharp
	[ActionName("node-images")]
	public ActionResult DataBindingUsingMVC()
	{
	    return View("NodeImages", this.GetData());
	}
	```
	
	 - コントローラに `GetData()` ヘルパー メソッドを追加
	
	この手順はデータ ソースを作成するヘルパー メソッドを定義します。
	
	**C# の場合:**
	
	```csharp
	private IEnumerable<Folders> GetData()
	{
	   string phisicalFilePath = System.Web.HttpContext.Current.Server.MapPath(       System.Web.HttpContext.GetGlobalResourceObject("Tree", "path_treeData")       .ToString());
	   var ctx = XDocument.Load(phisicalFilePath);
	   IEnumerable<Folders> data = from item in ctx.Root.Elements("Folder")
	      select new Folders
	      {
	         Text = item.Attribute("Text").Value,
	         Value = item.Attribute("Value").Value,
	         ImageUrl = Url.Content(item.Attribute("ImageUrl").Value),
	         Folder = from i1 in item.Elements("Folder")
	    select new Folders
	     {
	       Text = i1.Attribute("Text").Value,
	       Value = i1.Attribute("Value").Value,
	       ImageUrl = Url.Content(i1.Attribute("ImageUrl").Value),
	       Folder = from i2 in i1.Elements("Folder")
	              select new Folders
	              {
	          Text = i2.Attribute("Text").Value,
	          Value = i2.Attribute("Value").Value,
	          ImageUrl = Url.Content(i2.Attribute("ImageUrl").Value),
	          Folder = from i3 in i2.Elements("Folder")
	                  select new Folders
	                  {
	                        Text = i3.Attribute("Text").Value,
	                        Value = i3.Attribute("Value").Value,
	                        ImageUrl = Url.Content(i3.Attribute("ImageUrl").Value)
	                  }
	               }
	             }
	         };
	  return data;
	}
	```

4. バインディング

	 - ツリー バインディングを追加
	
	この手順では、igTree にバインディング構成を追加します。
	
	> **注**: バインドされたデータの各フィールドが階層でどのように機能するか igTree コントロールが判断できるようにするには、バインディング オブジェクトをツリーで表示する必要がある型ごとに構成する必要があります。
	
	**C# の場合:**
	
	```csharp
	.Bindings( bindings => {
	            bindings.
	            ValueKey("Value").
	            TextKey("Text").
	            ImageUrlKey("ImageUrl").
	            ChildDataProperty("Folder");
	        })
	```

## 次の手順
%%ProductNameMVC%% を使用して作業する方法を習得した後、コントロールを ASP.NET MVC で使用する方法については、「[igGrid を使用する ASP.NET MVC アプリケーションの開発](igGrid-Developing-ASP-NET-MVC-Applications-with-igGrid.html)」を参照してください。

## <a id="related"></a>関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igGrid を使用する ASP.NET MVC アプリケーションの開発](igGrid-Developing-ASP-NET-MVC-Applications-with-igGrid.html)

- [%%ProductName%% での JavaScript ファイル](Deployment-Guide-JavaScript-Files.html)

- [%%ProductName%% で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)

- [%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)

- [%%ProductName%% 対応 Infragistics コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html)





 

 



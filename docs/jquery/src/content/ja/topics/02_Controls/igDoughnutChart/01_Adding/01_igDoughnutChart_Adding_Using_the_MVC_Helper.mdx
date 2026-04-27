<!--
|metadata|
{
    "fileName": "igdoughnutchart-adding-using-the-mvc-helper",
    "controlName": "Doughnut Chart",
    "tags": ["Charting","Data Binding","Getting Started","How Do I"]
}
|metadata|
-->

# ASP.NET MVC アプリケーションへの igDoughnutChart の追加

## トピックの概要

### 目的

このトピックでは、%%ProductNameMVC%% を使用して ASP.NET MVC アプリケーションに [`igDoughnutChart`](%%jQueryApiUrl%%/ui.igDoughnutChart#options)™ のインスタンスを作成する方法を紹介します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念とトピックの一覧です。

- **概念**
	- jQuery
	- jQuery UI
	- ASP.NET MVC
	- ASP.NET MVC HTML ヘルパー
- **トピック**
	- [コントロールを MVC プロジェクトに追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html): このトピックでは、ASP.NET MVC アプリケーションで %%ProductName%%™ コンポーネントを使用した作業の開始方法を説明します。

 



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**ASP.NET MVC アプリケーションへの *igDoughnutChart* の追加 - 概要**](#intro)
    -   [*igDoughnutChart* の追加の概要](#intro-summary)
    -   [要件](#summary-requirements)
-   [**ASP.NET MVC アプリケーションへの *igDoughnutChart* の追加**](#adding)
    -   [プレビュー](#adding-preview)
    -   [前提条件](#adding-prerequisites)
    -   [概要](#adding-overview)
    -   [手順](#adding-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="intro"></a> ASP.NET MVC アプリケーションへの igDoughnutChart の追加 - 概要

### <a id="intro-summary"></a> *igDoughnutChart* の追加の概要

%%ProductNameMVC%% を使用して ASP.NET MVC アプリケーションに `igDoughnutChart` を追加するには、[`height`](%%jQueryApiUrl%%/ui.igDoughnutChart#options:height) オプションと [`width`](%%jQueryApiUrl%%/ui.igDoughnutChart#options:width) オプションの値を指定して少なくとも 1 つの [`series`](%%jQueryApiUrl%%/ui.igDoughnutChart#options:series) を追加し、サイズを調整する必要があります。

事前構成されたデータ ソース インスタンスを提供する、またはシリーズのためにそれを内部的に作成することが必要です。[`dataSource`](%%jQueryApiUrl%%/ui.igDoughnutChart#options:series.dataSource) オプションは別として、コントロールを表示するには、[name](%%jQueryApiUrl%%/ui.igDoughnutChart#options:series.name) オプションと [`valueMemberPath`](%%jQueryApiUrl%%/ui.igDoughnutChart#options:series.valueMemberPath) オプションの値が必要です。`valueMemberPath` パラメーターは、シリーズのスライスの作成で使用される値を含みます。この例は、シリーズの `dataSource` オプションのインスタンスを作成するために、`ProductItemCollection` モデルで使用されます。シリーズの `valueMemberPath` はIndex に設定され、スライスを作成するためにその値を使用します。

### <a id="summary-requirements"></a> 要件

「[コントロールの MVC プロジェクトへの追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html)」トピックで説明されるとおり、必要な JavaScript ファイル、CSS ファイルおよび ASP.NET MVC アセンブリで構成される ASP.NET MVC アプリケーション



## <a id="adding"></a> ASP.NET MVC アプリケーションへの igDoughnutChart の追加

このトピックでは、%%ProductNameMVC%% を使用して ASP.NET MVC アプリケーションに igDoughnutChart のインスタンスを作成する方法を紹介します。

### <a id="adding-preview"></a> プレビュー

以下のスクリーンショットは結果のプレビューです。

![](images/igDoughnutChart_Adding_igDoughnutChart_to_an_ASP.NET_MVC_Application_1.png)

### <a id="adding-prerequisites"></a> 前提条件

この手順を実行するには、以下のリソースが必要です。

-   ASP.NET MVC アプリケーション
-   アプリケーション プロジェクトに追加された Infragistics.Web.Mvc.dll アセンブリへの参照

### <a id="adding-overview"></a> 概要

以下はプロセスの概念的概要です。

1.  *Infragistics.Web.Mvc.dll* への参照を追加する
2.  ビューの依存関係を構成する
3.  データ収集を定義する
4.  *igDoughnutChart* のインスタンスを作成する

### <a id="adding-steps"></a> 手順

このトピックでは、%%ProductNameMVC%% を使用して ASP.NET MVC アプリケーションに `igDoughnutChart` のインスタンスを作成する方法を紹介します。

1. ***Infragistics.Web.Mvc.dll* への参照を追加します**
	
	ASP.NET アプリケーション に Infragistics.Web.Mvc.dll への参照を追加します。このアセンブリを追加する作業の詳細は、「[コントロールを MVC プロジェクトに追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html)」トピックを参照してください。

2. **ビューの依存関係を構成します。**
	
	**1.***Infragistics.Web.Mvc* 名前空間をインポートします

	%%ProductNameMVC%% を使用するには、Infragistics.Web.Mvc 名前空間をビューにインポートする必要があります。

	**ASPX の場合:**
	```csharp
	<%@ Import Namespace="Infragistics.Web.Mvc" %>
	```
	
	**2.**すべてのデータ ビジュアライゼーション コントロールに対して結合したファイルに参照を追加します
	
	ASP.NET MVC ビューの HEAD タグに以下のファイル参照を追加します (igLoader を使用する、または [HTML ページへの *igDoughnutChart* の追加](igDoughnutChart-Adding-to-an-HTML-Page.html)のトピックで説明するように、すべての Doughnut チャート関係のファイルを明示的に含めます)。

	**ASPX の場合:**
	
	```csharp
	<link href="<%=Url.Content("~/Scripts/css/structure/modules/infragistics.ui.chart.css")%>" rel="stylesheet"></link>
    <link href="<%=Url.Content("~/Scripts/css/themes/infragistics/infragistics.theme.css")%>" rel="stylesheet"></link>
    <script src="<%=Url.Content("~/Scripts/jquery.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/jquery-ui.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.core.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.dv.js")%>" type="text/javascript"></script>
	```

3. **データ収集を定義します。**
	
	**1.**モデル オブジェクト `ProductItem` を定義します 
	
	データ収集のために使用するアプリケーションで 基本的な `ProductItem` オブジェクトを定義します。
	
	**C# の場合:**
	
    ```csharp
    public class ProductItem
    {
        public string ProductCategory { get; set; }
        public int Index { get; set; }
    }
    ```
	
	**2.**`ProductItem` オブジェクトのコレクションを作成します
		
	**C# の場合:**
	
	```csharp
	using System.Collections.Generic;
    namespace DoughnutChartMVC
    {
        public class ProductItemCollection : List<ProductItem>
        {
            public ProductItemCollection()
            {
                this.Add(new ProductItem { ProductCategory = "Footwear", Index = 1498 });
                this.Add(new ProductItem { ProductCategory = "Clothing", Index = 1389 });
                this.Add(new ProductItem { ProductCategory = "Books", Index = 352 });
                this.Add(new ProductItem { ProductCategory = "Accessories", Index = 273 });
                this.Add(new ProductItem { ProductCategory = "Equipment", Index = 100 });
            }
        }
    }
	```
	
	**3.**コントローラーの操作メソッドでビュー モデルとしてコレクションを返します。
	
	**C# の場合:**
	
	```csharp
	using System.Web.Mvc;
    namespace DoughnutChartMVC.Controllers
    {
        public class HomeController : Controller
        {
            public ActionResult Index()
            {
                var products = new ProductItemCollection();
                return View("Index", new ProductItemCollection());
            }
        }
    }
	```
	
	ビューのモデルとして `ProductItemCollection` を追加します。
	
	**ASPX の場合:**
	
	```csharp
	<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<DoughnutChartMVC.ProductItemCollection>" %>
	```

4. ***igDoughnutChart* のインスタンスを作成します。**
	
	**`igDoughnutChart` のインスタンスを作成するために、%%ProductNameMVC%% を使用し基本的なオプションを設定します。**`igDoughnutChart` のインスタンスを作成するには、ASP.NET ページの本文内で %%ProductNameMVC%% を使用します。コントロールのインスタンスを作成する場合、基本的な描画のために、以下に示すような複数のヘルパー メソッドを設定する必要があります。
	
	<table class="table">
		<tbody>
			<tr>
				<th>ヘルパー メソッド</th>
	
				<th>目的</th>
			</tr>
	
			<tr>
				<td>
					Width()
				</td>
	
				<td>
					`igDoughnutChart` の文字列の幅を設定します。
				</td>
			</tr>
	
			<tr>
				<td>
					Height()
				</td>
	
				<td>
					`igDoughnutChart` の文字列の高さを設定します。
				</td>
			</tr>
	
			<tr>
				<td>
					Series()
				</td>
	
				<td>
					`igDoughnutChart` のシリーズのインスタンスを作成します。<br />その `dataSource` は別として、`name` をシリーズに割り当て、その `valueMemberPath` プロパティにスライスのサイズ決定に使用される値を設定する必要があります。
				</td>
			</tr>
		</tbody>
	</table>
	
	最終的に、すべての %%ProductNameMVC%% コントロールと同様に、Render メソッドを呼び出して HTML と JavaScript をビューに描画します。
	
	**ASPX の場合:**
	
	```csharp
	<body>
        <%= Html.Infragistics().DoughnutChart()
                        .Width("300px")
                        .Height("300px")
                        .Series(s =>
                        {
                            s.Ring("flatSeries", Model.AsQueryable())
                                .ValueMemberPath(o => o.Index);
                            })
                         .Render()%>
    </body>
	```

**完全なアプリケーション コードのリスト**

**ASPX の場合:**

```csharp
<%@Page Language="C#" Inherits="System.Web.Mvc.ViewPage<DoughnutChartMVC.ProductItemCollection>" %>
<%@ Import Namespace="Infragistics.Web.Mvc" %>
<!DOCTYPE html>
<html>
<head>
    <title>DoughnutChart</title>
    <link href="<%=Url.Content("~/Scripts/css/structure/modules/infragistics.ui.chart.css")%>" rel="stylesheet"></link>
    <link href="<%=Url.Content("~/Scripts/css/themes/infragistics/infragistics.theme.css")%>" rel="stylesheet"></link>
    <script src="<%=Url.Content("~/Scripts/jquery.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/jquery-ui.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.core.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.dv.js")%>" type="text/javascript"></script>
</head>
<body>
    <%= Html.Infragistics().DoughnutChart()
                    .Width("300px")
                    .Height("300px")
                    .Series(s =>
                    {
                        s.Ring("flatSeries", Model.AsQueryable())
                            .ValueMemberPath(o => o.Index);
                        })
                     .Render()%>
</body>
</html>
```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック


このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*igDoughnutChart* の HTML ページへの追加](igDoughnutChart-Adding-to-an-HTML-Page.html): このトピックは、`igDoughnutChart` を HTML ページに追加する方法を説明します。

- [jQuery および MVC API リファレンス リンク (*igDoughnutChart*)](igDoughnutChart-API-Links.html): このトピックでは、`igDoughnutChart` コントロールと %%ProductNameMVC%%　に関する API ドキュメントへのリンクを提供します。

### <a id="samples"></a> サンプル

以下のサンプルでは、このトピックに関連する情報を提供しています。

- [Collection にバインド](%%SamplesUrl%%/doughnut-chart/bind-to-collection): このサンプルでは、%%ProductNameMVC%%　を使用して `igDoughnutChart` を描画する方法を紹介します。ヘルパーはサーバーのオブジェクトのコレクションにバインドし、そのコレクションを JSON オブジェクトにシリアル化し、必要な `igDoughnutChart` HTML および JavaScript を描画します。





 

 



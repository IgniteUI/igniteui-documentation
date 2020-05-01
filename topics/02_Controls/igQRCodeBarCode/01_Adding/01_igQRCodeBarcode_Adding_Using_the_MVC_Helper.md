<!--
|metadata|
{
    "fileName": "igqrcodebarcode-adding-using-the-mvc-helper",
    "controlName": "igBarcode",
    "tags": ["Getting Started","How Do I"]
}
|metadata|
-->

# ASP.NET MVC アプリケーションへの igQRCodeBarcode の追加



## トピックの概要
### 目的

このトピックではコード例を示して、%%ProductNameMVC%%で ASP.NET MVC アプリケーションに `igQRCodeBarcode`™ を追加する方法を説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念とトピックの一覧です。

-   jQuery
-   jQuery UI
-   ASP.NET MVC
-   ASP.NET MVC HTML ヘルパー

トピック

- [コントロールを MVC プロジェクトに追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html): このトピックでは、ASP.NET MVC アプリケーションで %%ProductName%%™ コンポーネントを使用した作業の開始方法を説明します。

- [igQRCodeBarcode の概要](igQRCodeBarcode-Overview.html): このトピックでは、主要機能、最小要件など、`igQRCodeBarcode` コントロールの概念的情報を提供します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [ASP.NET MVC アプリケーションへの igQRCodeBarcode の追加 - 概要](#overview)
    -   [igQRCodeBarcode の追加の概要](#summary)
    -   [要件](#requirements)
    -   [手順](#steps)
-   [ASP.NET MVC アプリケーションへの igQRCodeBarcode の追加 - 手順](#procedure)
    -   [概要](#procedure-introduction)
    -   [プレビュー](#procedure-preview)
    -   [前提条件](#procedure-prerequisites)
    -   [手順](#procedure-steps)
    -   [全コード](#procedure-code)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a>ASP.NET MVC アプリケーションへの igQRCodeBarcode の追加 - 概要
### <a id="summary"></a>igQRCodeBarcode の追加の概要

`igQRCodeBarcode` コントロールは、%%ProductNameMVC%% を使用して ASP.NET MVC ビューに追加できます。バーコードを正しく表示するには、データをヘルパーに取り込み、コントロールのディメンションを設定する必要があります。`igQRCodeBarcode` コントロールのインスタンスを作成する場合、以下に示すように、基本的な描画に設定する必要があるいくつかのヘルパー メソッドがあります。

%%ProductNameMVC%% メソッド|目的
---|---
Data()|`igQRCodeBarcode` によりエンコードされる文字列データを設定します
Height()|`igQRCodeBarcode` の文字列の高さを設定します
Width()|`igQRCodeBarcode` の文字列の幅を設定します

### <a id="requirements"></a>要件

この手順を実行するには、以下が必要です。

-   ASP.NET MVC アプリケーション
-   アプリケーション プロジェクトに追加される `Infragistics.Web.Mvc.dll` アセンブリに対する参照。詳細は、「[MVC プロジェクトへのコントロールの追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html)」のトピックを参照してください。
-   ビューの依存関係:

    -   ASP.NET MVC ビューに追加される `Infragistics.Web.Mvc` 名前空間

    **ASPX の場合:**

    ```csharp
    <%@ Import Namespace="Infragistics.Web.Mvc" %>
    ```

    **Razor の場合:**

    ```csharp
    @using Infragistics.Web.Mvc
    ```

    -   ASP.NET MVC ビューの `<head>` タグに追加されるすべてのデータ ビジュアライゼーション コントロール用の結合したファイルへの参照

    **ASPX の場合:**

    ```csharp
    <script src="<%=Url.Content("~/Scripts/jquery.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/jquery-ui.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.core.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.dv.js")%>" type="text/javascript"></script>
    ```

    **Razor の場合:**

    ```csharp
    <script src="@Url.Content("~/Scripts/jquery.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/jquery-ui.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/js/infragistics.core.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/js/infragistics.dv.js")" type="text/javascript"></script>
    ```

    [HTML ページへの *igQRCodeBarcode* の追加](igQRCodeBarcode-Adding-to-an-HTML-Page.html)のトピックで説明するように、Infragistics Loader ( コンポーネント) を使用すること、あるいはすべての igQRCodeBarcode 関連のファイルを明示的に含めることも可能です。

### <a id="steps"></a>手順

1. %%ProductNameMVC%% コントロールの追加

2. `igQRCodeBarcode` コントロールのインスタンスの作成。


## <a id="procedure"></a>ASP.NET MVC アプリケーションへの igQRCodeBarcode の追加 - 手順
### <a id="procedure-introduction"></a>概要

この手順では、コントロールの %%ProductNameMVC%% を使用して `igQRCodeBarcode` のインスタンスを ASP.NET MVC アプリケーションに追加し、data、width、heightなどの基本的なオプションを設定します。エンコードする文字列データは *http://www.infragistics.com* です。この手順は、`Infragistics.Web.Mvc.dll` アセンブリ参照がプロジェクトに追加され、コントロールがASP.NET MVC ヘルパーの `Render()` メソッドでビューに描画されることを前提とします。

### <a id="procedure-preview"></a>プレビュー

以下のスクリーンショットは結果のプレビューです。

![](images/igQRCodeBarcode_Adding_igQRCodeBarcode_to_an_ASP.NET_MVC_Application_1.png)

### <a id="procedure-prerequisites"></a>前提条件

「ASP.NET MVC アプリケーションへの `igQRCodeBarcode` の追加」の手順にある前提条件に定義されている、必要な JavaScript ファイル、CSS ファイルおよび ASP.NET MVC アセンブリで構成される ASP.NET MVC アプリケーション

### <a id="procedure-steps"></a>手順

以下の手順では、%%ProductNameMVC%% を使用して ASP.NET MVC アプリケーションに `igQRCodeBarcode` のインスタンスを作成する方法を示します。

1. HTML ヘルパーの追加

	HTML ヘルパーを ASP.NET ページの本文に追加します。
	
	**ASPX の場合:**
	
	```csharp
	<%=(Html.Infragistics().QRCodeBarcode()
	.Render())%>
	```
	
	**Razor の場合:**
	
	```csharp
	@(Html.Infragistics().QRCodeBarcode()
	.Render())
	```

2. `igQRCodeBarcode` コントロールのインスタンスを作成します。

	`igQRCodeBarcode` コントロールのインスタンスを作成します。すべての %%ProductNameMVC%% コントロールと同様に、[Render](Infragistics.Web.Mvc~Infragistics.Web.Mvc.QRCodeBarcodeRenderer~Render.html) メソッドを呼び出して HTML と JavaScript をビューに描画します。
	
	**ASPX の場合:**
	
	```csharp
	<%=(Html.Infragistics().QRCodeBarcode()
		.Height("200px")
		.Width("200px")
		.Data(“http://www.infragistics.com”).Render())
	%>
	```
	
	**Razor の場合:**
	
	```csharp
	@(Html.Infragistics().QRCodeBarcode()
		.Height("200px")
		.Width("200px")
		.Data(“http://www.infragistics.com”).Render())
	```



### <a id="procedure-code"></a>全コード

以下は、この手順の完全なコードです。

**ASPX の場合:**

```csharp
<%@ Import Namespace="Infragistics.Web.Mvc" %>
<!DOCTYPE html>
<html>
	<head>
		<title>QR Barcode</title>
		<script src="<%=Url.Content("~/Scripts/jquery.min.js")%>" type="text/javascript"></script>
		<script src="<%=Url.Content("~/Scripts/jquery-ui.min.js")%>" type="text/javascript"></script>
		<script src="<%=Url.Content("~/Scripts/js/infragistics.core.js")%>" type="text/javascript"></script>
		<script src="<%=Url.Content("~/Scripts/js/infragistics.dv.js")%>" type="text/javascript"></script>
	</head>
	<body>
		<%=(Html.Infragistics().QRCodeBarcode()
		.Height("200px")
		.Width("200px")
		.Data(“http://www.infragistics.com”).Render())%>
	</body>
</html>
```

**Razor の場合:**

```csharp
@using Infragistics.Web.Mvc
<head>
	<title>@ViewBag.Title</title>
	<script src="@Url.Content("~/Scripts/jquery.min.js")" type="text/javascript"></script>
	<script src="@Url.Content("~/Scripts/jquery-ui.min.js")" type="text/javascript"></script>
	<script src="@Url.Content("~/Scripts/js/infragistics.core.js")" type="text/javascript"></script>
	<script src="@Url.Content("~/Scripts/js/infragistics.dv.js")" type="text/javascript"></script>
</head>
<body>
	@(Html.Infragistics().QRCodeBarcode()
	.Height("200px")
	.Width("200px")
	.Data(“http://www.infragistics.com”).Render())
</body>
```



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [HTML ページへの igQRCodeBarcode の追加](igQRCodeBarcode-Adding-to-an-HTML-Page.html): このトピックではコード例を使用して、`igQRCodeBarcode` コントロールを HTML ページに追加する方法を説明します。

- [jQuery および MVC API リファレンス リンク (igQRCodeBarcode)](igQRCodeBarcode-API-Links.html): このトピックでは、`igQRCodeBarcode` コントロールに関する API 参照ドキュメントへのリンクを提供します。



### <a id="samples"></a>サンプル

以下のサンプルでは、このトピックに関連する情報を提供しています。

- [MVC の初期化](%%SamplesUrl%%/barcode/mvc-initialization): このサンプルは、%%ProductNameMVC%% を使用して igQRCodeBarcode コントロールを HTML ページに追加する方法を紹介します。





 

 



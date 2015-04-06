<!--
|metadata|
{
    "fileName": "adding-page",
    "controlName": "Page",
    "tags": ["How Do I","Layouts","MVC"]
}
|metadata|
-->

# Page の追加

## トピックの概要
### 目的
このトピックには、Infragistics MVC ラッパーを使用して Page を有効にするために必要な情報が含まれています。

### 前提条件
このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Page の概要](Page-Overview.html): このトピックでは、Page MVC ラッパーに関連する情報について説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [Page を有効にする](#enabling-page)
-   [関連コンテンツ](#related-content)

## <a id="enabling-page"></a> Page を有効にする

この手順では、MVC ラッパーを使用して、MVC ソリューション内のビュー ページに Page を追加する方法を説明します。Page ラッパーの複数のインスタンスを 1 つの MVC View に追加することができますが、アクティブにできるのはその内の 1 つのみです。以下のサンプルは、このアクションのデモです。

### プレビュー 

次のコードは、最終結果として表示される HTML を示しています。

> **注:** jQuery ページ ウィジェットは、サーバー上の MVC Page ラッパーからの属性だけでなく、いくつかの追加属性も描画することに気づくでしょう。

**HTML の場合:**

```
<div data-role="page" 
     data-title="Page" 
     id="Page1" 
     data-external-page="true" 
     tabindex="0" 
     class="ui-page ui-body-c ui-page-active">
</div>
```

### 前提条件 

この手順を実行するには、以下のリソースが必要です。

-   MVC モバイル アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

### 手順

以下の手順では、基本 Page ラッパーを初期化する方法を示します。

1. ビュー ページにリソースを追加します。

	`Infragistics.Web.Mvc.Mobile.dll` への参照と、Infragistics モバイル Loader への参照が必要です。以下の例では、すべての js および css ファイルが `ig_mobileui` という名前の仮想ディレクトリの下に置かれています。この手順を完了させるためには、このフォルダーの名前を、`js` および `css` ファイルの実際の格納場所に合わせて変更する必要があります。

	**Razor の場合:**

	```
	@using Infragistics.Web.Mvc.Mobile
	<script type="text/javascript" src="http://code.jquery.com/mobile/jquery.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/mobile/1.1.1/jquery.mobile.min.js"></script>
	<script type="text/javascript" src="http://localhost/ig_mobileui/js/infragistics.mobile.loader.js"></script>
	@(Html.InfragisticsMobile().
		Loader().
		ScriptPath("http://localhost/ig_mobileui/js/").
		CssPath("http://localhost/ig_mobileui/css/").
		Render())
	```

2. ビュー ページに Page を追加

	ページの開始をマークするには、以下のコードを追加します。

	**Razor の場合:**

	```
	@(Html.InfragisticsMobile()
		.Page()
		.ID("pg1")
		.Title("Page")
		.BeginRender())
	```

	ページ コンテンツの追加が終わったら、描画されるコンテンツの終わりをマークするために以下のコードを追加する必要があります。

	**Razor の場合:**

	```
	@(Html.InfragisticsMobile()
		.Page()
		.ID("pg1")
		.EndRender())
	```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。


## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Page の概要](Page-Overview.html): このグループのトピックでは、Page MVC ラッパーの使用方法を説明します。
- [*Page* 構成](Page-Configuring.html): このトピックには、MVC ラッパーを使用して Page を構成するために必要な情報および参照が含まれています。
- [Page プロパティ参照](Page-Property-Reference.html): このトピックでは、Page MVC ラッパーのプロパティに関する参照情報について説明します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-page/basic-usage): このサンプルでは、Page ASP.NET MVC ヘルパーを使用して、「data-role="Page"」 の HTML DIV 要素を定義する方法を示します。





 

 



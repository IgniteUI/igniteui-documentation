<!--
|metadata|
{
    "fileName": "adding-pagecontent",
    "controlName": "PageContent",
    "tags": ["How Do I","Layouts","MVC"]
}
|metadata|
-->

# PageContent の追加

## トピックの概要
このトピックでは、Infragistics MVC ラッパーを使用して `PageContent` を有効にする場合に必要な情報について説明します。

このトピックは、以下のセクションで構成されます。

-   [**PageContent を有効にする**](#enabling-pagecontent)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="enabling-pagecontent"></a>PageContent を有効にする
ここでは、MVC ラッパーを使用して MVCソリューションのビュー ページに `PageContent` を追加する手順について説明します。`PageContent` は、ページ中の実際のコンテンツとは意味的に異なります。`PageContent` ラッパーは、親 MVC Page ラッパーが必要です。各 Page は `PageContent` 領域を 1 つだけ含みます。

## <a id="preview"></a>プレビュー

以下のコードは、PageContent を構成した後に描画されるコードを示しています。

> **注:** jQuery Page ウィジェットは、 `class` や `role` のような追加属性をサーバー上で定義しなくても、描画することがわかります。

**HTML の場合:**
```html
<div data-role="content" id="pgcnt1" class="ui-content" role="main"> 
    <p>Content</p> 
</div>
```

## <a id="prerequisites"></a>前提条件 

この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC モバイル アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

## <a id="steps"></a>手順

以下の手順は、基本的な PageContent ラッパーを構成し、HTML コードを保持するコンテナーを描画する方法を示します。

1. ビュー ページにリソースを追加します。

	`Infragistics.Web.Mvc.Mobile.dll` への参照と、Infragistics モバイル Loader への参照が必要です。次の例では、`js` および `css` ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、`js` および `css` ファイルの実際の格納場所に合わせて変更する必要があります。
	
	**Razor の場合:**
	```csharp
	@using Infragistics.Web.Mvc.Mobile
	<script src="http://code.jquery.com/jquery.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile.min.js"></script>
	<script type="text/javascript" src="http://localhost/ig_mobileui/js/infragistics.mobile.loader.js"></script>
	@(Html.InfragisticsMobile().
	    Loader().
	    ScriptPath("http://localhost/ig_mobileui/js/").
	    CssPath("http://localhost/ig_mobileui/css/").
	    Render())
	```

2. `PageContent` をビュー ページに追加します

	`Page` ラッパーのように `PageContent` ラッパーは、中にあるコンテンツを囲む必要があります。
	
	**Razor の場合:**
	
	```csharp
	@(Html.InfragisticsMobile()
	    .PageContent()
	    .ID("pgcnt1")
	    .BeginRender())
	    <p>Content</p>
	@(Html.InfragisticsMobile()
	    .PageContent()
	    .ID("pgcnt1")
	    .EndRender())
	```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。

## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [PageContent の概要](PageContent-Overview.html): このトピックには、PageContent MVC ラッパーの関連情報が含まれています。
- [PageContent プロパティ参照](PageContent-Property-Reference.html): このトピックでは、`PageContent` MVC ラッパーのプロパティに関するリファレンス情報を提供します。

### <a id="samples"></a>サンプル
このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-pagecontent/basic-usage): このサンプルは、Content ASP.NET MVC ヘルパーを使用して、「data-role="content"」の HTML DIV 要素を描画する方法を示します。





 

 



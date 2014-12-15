<!--
|metadata|
{
    "fileName": "adding-navbar",
    "controlName": "NavBar",
    "tags": ["How Do I","MVC","Navigation"]
}
|metadata|
-->

# NavBar の追加

## トピックの概要

### 目的

このトピックには、Infragistics MVC ラッパーを使用して `NavBar` を有効にするために必要な情報が含まれています。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [*NavBar* の概要](NavBar-Overview.html): このトピックでは、`NavBar` MVC ラッパーに関する情報を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**NavBar を有効にする**](#enabling)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="enabling"></a> *NavBar* を有効にする

この手順では、MVC ラッパーを使用して、MVC ソリューション内のビュー ページに `NavBar` を追加する方法を説明します。

### プレビュー 

次のスクリーンショットは最終結果のプレビューです。

![](images/03_AddingNavBar_1.png)

### <a id="prerequisites"></a> 前提条件 

この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC Mobile アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

### <a id="overview"></a> 概要 

以下はプロセスの概念的概要です。

1. ビュー ページへのリソースの追加
2. ビュー ページに `NavBar` を追加
3. 結果の検証

### <a id="steps"></a> 手順

以下の手順では、MVC ラッパーを使用して、MVC ソリューション内のビュー ページに `NavBar` を追加する方法を説明します。

1. ビュー ページにリソースを追加します。

	*Infragistics.Web.Mvc.Mobile.dll* への参照と、Infragistics Mobile Loader への参照が必要です。次の例では、js および css ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、js および css ファイルの実際の格納場所に合わせて変更する必要があります。
	
	**Razor の場合:**
	
	```
	@using Infragistics.Web.Mvc.Mobile
	<script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile.min.js"></script>
	<script type="text/javascript" src="http://localhost/ig_mobileui/js/infragistics.mobile.loader.js"></script>
	@(Html.InfragisticsMobile().
	    Loader().
	    ScriptPath("http://localhost/ig_mobileui/js/").
	    CssPath("http://localhost/ig_mobileui/css/").
	    Render())
	```

2. `NavBar` をビュー ページに追加します
	
	**Razor の場合:**
	
	```
	@(
	    Html.InfragisticsMobile()
	    .NavBar()
	    .ID("nvbr1")
	    .Items(bar => {
	        bar.NavBarItem().Text(Resources.NavBar.Home).Icon(DefaultIcons.Home).Href("http://www.infragistics.com/").Theme("a");
	        bar.NavBarItem().Text(Resources.NavBar.Products).Icon(DefaultIcons.Grid).Href("http://www.infragistics.com/products").Theme("b");
	        bar.NavBarItem().Text(Resources.NavBar.Community).Icon(DefaultIcons.Star).Href("http://www.infragistics.com/community").Theme("c");
	        bar.NavBarItem().Text(Resources.NavBar.Help).Icon(DefaultIcons.Search).Href("http://www.infragistics.com/help").Theme("d");
	        bar.NavBarItem().Text(Resources.NavBar.AboutUs).Icon(DefaultIcons.Info).Href("http://www.infragistics.com/about-us").Theme("e");
	    })
	    .IconPosition(IconPositions.Top)
	    .Render()
	)
	```
	
	> **注:** 個々の `NavBar` 項目に対してアイコン位置を設定することはできません。

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。




## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*NavBar* の概要](NavBar-Overview.html): このトピックでは、`NavBar` MVC ラッパーに関する情報を紹介します。

- [*NavBar* の追加](Adding-NavBar.html): このトピックには、Infragistics MVC ラッパーを使用して `NavBar` を有効にするために必要な情報が含まれています。

- [*NavBar* のプロパティ参照](NavBar-Property-Reference.html): このトピックでは、`NavBar` MVC ラッパーのプロパティに関するリファレンス情報を紹介します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-navbar/basic-usage): `NavBar` ASP.NET MVC ヘルパーでは、ナビゲーション メニューを作成し、それをカスタマイズできます。

 



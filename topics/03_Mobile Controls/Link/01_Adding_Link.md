<!--
|metadata|
{
    "fileName": "adding-link",
    "controlName": "Link",
    "tags": ["How Do I","MVC","Navigation"]
}
|metadata|
-->

# Link の追加

## トピックの概要

### 目的

このトピックでは、Infragistics MVC ラッパーを使用した `Link` を有効にするために必要な情報を提供します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

トピック

目的

[Link の概要](Link-Overview.html)

このトピックでは、MVC `Link` コントロール ラッパーとその主な機能を紹介します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**Link の有効化**](#enabling)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="enabling"></a> Link の有効化

ここでは、MVC ラッパーを使用して MVC ソリューションのビュー ページに `Link` を追加する手順について説明します。

### プレビュー 

次のスクリーンショットは最終結果のプレビューです。

![](images/03_AddingLink_1.png)

### <a id="prerequisites"></a> 前提条件 

この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC モバイル アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

### <a id="overview"></a> 概要 

以下はプロセスの概念的概要です。

1. ビュー ページへのリソースの追加
2. ビュー ページに `Link` を追加
3. 結果の検証

### <a id="steps"></a> 手順

ここでは、MVC ラッパーを使用して `Link` を追加する手順を示します。

1. ビュー ページにリソースを追加します。

	*Infragistics.Web.Mvc.Mobile.dll* への参照と、Infragistics モバイル Loader への参照が必要です。次の例では、js および css ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順の完了させるためには、このフォルダーの名前を、js および css ファイルの実際の格納場所に合わせて変更する必要があります。
	
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

2. ビュー ページに `Link` を追加

	**Razor の場合:**
	
	```
	@(Html.InfragisticsMobile()
	    .Link()
	    .ID("lnk1")
	    .Text("Infragistics")
	    .NavigateUrl("http://www.infragistics.com")
	    .Target("_blank")
	    .Render())
	```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Link* の概要](Link-Overview.html): このトピックでは、MVC `Link` コントロール ラッパーとその主な機能を紹介します。

- [*Link* の構成](Configuring-Link.html): このトピックでは、MVC ラッパーを使用した `Link` を構成するために必要な情報とリファレンスを提供します。

- [*Link* のプロパティ リファレンス](Link-Property-Reference.html): このトピックでは、`Link` MVC ラッパーのプロパティに関するリファレンス情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-link/basic-usage): このサンプルでは、`Link` の ASP.NET MVC ヘルパーの使用方法を紹介します。

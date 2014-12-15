<!--
|metadata|
{
    "fileName": "adding-popup",
    "controlName": "Popup",
    "tags": ["Layouts","MVC"]
}
|metadata|
-->

# Popup の追加

## トピックの概要

### 目的

このトピックでは、Infragistics MVC ラッパーを使用した `Popup` を有効にするために必要な情報を提供します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Popup](Popup-overview.html) [の概要](Popup-overview.html): このトピックでは、`Popup` MVC ラッパーを紹介します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**ポップアップの有効化**](#enabling)
    -   [コードのプレビュー](#code-preview)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="enabling"></a> ポップアップの有効化

ここでは、MVC ラッパーを使用して MVC ソリューションのビュー ページに `Popup` を追加する手順を説明します。1 つの MVC ビューに複数の `Popup` ラッパー インスタンスを追加できますが、複数のインスタンスを同時にアクティブにすることはできません。次にサンプルでは、ラッパー インスタンスをアクティブにする方法を示します。

### <a id="code-preview"></a> コードのプレビュー 

次のコードは、最終結果として表示される HTML を示しています。

> **注:** 一部のデフォルト属性は、サーバー側で定義されていなくても、MVC `Popup` ラッパーによって表示されることになります。こうしたデフォルト属性のなかには、サーバー側の MVC Page ラッパーによって表示される属性に加えて、`aria-disabled` のように jQuery 自体によって追加されるものもあります。

**HTML の場合:**

```
<div data-role="popup" id="popup1" type="Popup" 
     class="ui-popup ui-overlay-shadow ui-corner-all ui-body-c" 
     aria-disabled="false" data-disabled="false" 
     data-shadow="true" data-corners="true" data-transition="none" 
     data-position-to="origin"> 
    <img src="/Content.png" alt="Content"> 
</div> 
```

次の図は、ブラウザーで表示されることになる最終的な `Popup` ウィジェットの外観を示したものです。

![](images/03_AddingPopup_1.png)

### <a id="prerequisites"></a> 前提条件 

この手順を実行するには、以下のリソースが必要です。

-   MVC Mobile アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

### <a id="overview"></a> 概要 

以下はプロセスの概念的概要です。

1. ビュー ページへのリソースの追加
2. ビュー ページに `Popup` を追加
3. `Popup` を開くリンクの追加
4. 結果の検証

### <a id="steps"></a> 手順

以下の手順では、基本的な `Popup` ラッパーを初期化する方法を示します。

1. ビュー ページにリソースを追加します。

	Infragistics.Web.Mvc.Mobile.dll への参照と、Infragistics Mobile Loader への参照が必要です。次の例では、js および css ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、js および css ファイルの実際の格納場所に合わせて変更する必要があります。
	
	**Razor の場合:**
	
	```
	@using Infragistics.Web.Mvc.Mobile
	<script src="http://code.jquery.com/jquery.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile.min.js"></script>
	<script type="text/javascript" src="http://localhost/ig_mobileui/js/infragistics.mobile.loader.js"></script>
	@(Html.InfragisticsMobile()
	    .Loader()
	    .ScriptPath("http://localhost/ig_mobileui/js/")
	    .CssPath("http://localhost/ig_mobileui/css/")
	    .Render())
	```

2. ビュー ページに `Popup` を追加

	`Popup` の開始位置にマークを付けるには、次のコードを追加します。
	
	**Razor の場合:**
	
	```
	@(Html.InfragisticsMobile()
	    .Popup()
	    .ID("popup1")
	    .BeginRender())
	```
	
	`ポップアップ`の内部にコンテンツを追加しておく必要があります。コンテンツを追加しなかった場合、`Popup` は表示されません。この例では、内部画像が `Popup` のコンテンツとして表示されます。
	
	**HTML の場合:**
	
	```
	<img src="Content.png" alt="content"/>
	```
	
	`Popup` コンテンツの追加作業が完了したら、次のコードを追加して、表示されるコンテンツの終了位置にマークを付ける必要があります。
	
	**Razor の場合:**
	
	```
	@(Html.InfragisticsMobile()
	    .Popup()
	    .ID("popup1")
	    .EndRender())
	```

3. `Popup` を開くリンクの追加

	`Popup` コンテンツの作成が完了したら、そのウィジェットを開くリンクを追加する必要があります。このためには、リンク リファレンスへの参照として `Popup` の ID を追加する必要があります。ハッシュ シンボルとしてプレフィックスを付ける必要もあります。明示的に設定する必要のあるもう 1 つの属性は `data-rel` です。
	
	**HTML の場合:**
	
	```
	<a href="#popup1" data-rel="popup">Open Popup</a>
	```
	
	ASP.NET MVC ヘルパーを使用して、上記のものと同じアンカー タグを作成することもできます。
	
	**C# の場合:**
	
	```
	@(Html.InfragisticsMobile()
	    .Link()
	    .ID("lnk1")
	    .Text("Open Popup")
	    .NavigateUrl("#popup1")
		.DestinationRelationship(LinkDestinationRelationshipOptions.Popup)
	    .Render())
	```

4. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Popup の概要](Popup-overview.html): このトピックでは、`Popup` MVC ラッパーを紹介します。

- [Popup のプロパティ リファレンス](Popup-Property-Reference.html): このトピックでは、`Popup` MVC ラッパーのプロパティに関する参照情報について説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-popup/basic-usage): このサンプルでは、`Popup` ASP.NET MVC ヘルパーを初期化し、ボタン クリックで開く方法を紹介します。注: `Popup` Mobile ウィジェットは、jQuery モバイル 1.2.0 で初めて導入された機能です。






 

 



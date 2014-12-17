<!--
|metadata|
{
    "fileName": "collapsible-adding",
    "controlName": "Collapsible",
    "tags": ["Layouts","MVC"]
}
|metadata|
-->

# Collapsible の追加

ここでは、MVC ラッパーを使用して MVCソリューションの [View] ページに `Collapsible` ウィジェットを追加する手順について説明します。

手順を図示したサンプル コードは、ヘッダー名が Custom Header で、「This is a collapsible content」という縮小可能なコンテンツが表示されている、`Collapsible` ASP.NET MVC ラッパーを構成しています。

以下のスクリーンショットは、手順を実施した結果、ページに追加された `Collapsible` ウィジェットを示しています。

![](images/Collapsible_Adding_1.png)

## 前提条件

この手順を実行するには、以下のリソースが必要です。

-   MVC モバイル アプリケーション
-   *Infragistics.Web.Mvc.Mobile.dll* への参照
-   Infragistics モバイル Loader への参照
-   MVC reassurance ラッパーに必要なリソースへの参照

以下のサンプルコードでは、すべての JavaScript および CSS ファイルが *ig_mobileui* という名前の仮想ディレクトリの下に置かれています。この手順を完了するには、マシン上の正しい JavaScript および CSS の保管場所に従ってこのフォルダーの名前を変更する必要があります。

**Razor の場合:**
```
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


## 概要

以下はプロセスの概念的概要です。

1. `Collapsible` ラッパーを  View ページに追加
2. (オプション) 結果の検証

## 手順

以下の手順では、`Collapsible` を追加する手順を説明します。

1. `Collapsible` ASP.NET MVC ラッパーを  View ページに追加します。

	`Collapsible` ウィジェットのインスタンスをその構成設定とともに追加します。
	
	この例では、`Collapsible` は [`HeaderText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~HeaderText.html) プロパティを「Custom Header」に設定して構成され、「This is a collapsible content」という縮小可能なコンテンツが表示されています。
	
	**Razor の場合:**
	
	```
	@(
	    Html.InfragisticsMobile()
	    .Collapsible()
	    .HeaderText("Custom Header")
	    .BeginRender()
	)
	    This is a collapsible content
	@(
	    Html.InfragisticsMobile()
	    .Collapsible()
	    .EndRender()
	)
	```

2. (オプション) 結果を確認します。

	結果を検証するには、View を保存してから、アプリケーションを再ビルドおよび実行します。


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Collapsible の構成*](Collapsible-Configuring.html): このトピックでは `Collapsible` ウィジェットの構成方法について説明します。

- [*Collapsible* のプロパティ参照](Collapsible-Property-Reference.html): このトピックでは、`Collapsible` ウィジェットのプロパティに関する参照情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-collapsible/basic-usage): これは jQuery Mobile collapsible ウィジェットの ASP.NET MVC ヘルパーを紹介するサンプルです。





 

 



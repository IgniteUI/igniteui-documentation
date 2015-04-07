<!--
|metadata|
{
    "fileName": "adding-button",
    "controlName": "Button",
    "tags": ["How Do I","MVC"]
}
|metadata|
-->

#Button の追加

次のスクリーンショットは最終結果のプレビューです。

![](images/03_AddingButton_1.png)

## 前提条件

この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC モバイル アプリケーションを作成します。
-   Ignite UI MVC ラッパー アセンブリを参照します。

## 手順

ここでは、Infragistics MVC ラッパーを使用した Button を有効にする手順を示します。

1. ビュー ページにリソースを追加します。

	> **注:** `Infragistics.Web.Mvc.Mobile.dll` への参照と、Infragistics モバイル Loader への参照が必要です。次の例では、`js` および `css` ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了するためには、このフォルダーは、アプリケーションの正しい `js` と `css` の場所に従って、名前を変更する必要があります。
	
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

2. ビュー ページに Button を追加します。

	**Razor の場合:**
	
	```csharp
	@(
	    Html.InfragisticsMobile()
	    .Button()
	    .ID("btn1")
	    .Text("Button")
	    .Render()
	)
```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Button* の概要](Button-Overview.html): このトピックでは、MVC Button コントロール ラッパーとその主な機能を紹介します。

- [*Button* の構成](Button-Configuring.html): このトピックでは、MVC ラッパーを使用した Button を構成する際に必要な情報とリファレンスを提供します。

- [*Button* のプロパティ リファレンス](Button-Property-Reference.html): このトピックでは、Button MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-button/basic-usage): このサンプルでは、Button の ASP.NET MVC ヘルパーの表示オプションを紹介します。

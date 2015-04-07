<!--
|metadata|
{
    "fileName": "adding-checkbox",
    "controlName": "CheckBox",
    "tags": ["Editing","How Do I","MVC"]
}
|metadata|
-->

# CheckBox の追加

次のスクリーンショットは最終結果のプレビューです。

![](images/03_AddingCheckBox_1.png)

## 手順

以下の手順では、Infragistics MVC ラッパーを使用して `CheckBox` を有効にする方法について説明します。

1. ビュー ページにリソースを追加します。

	> **注:** `Infragistics.Web.Mvc.Mobile.dll` への参照と、Infragistics モバイル Loader への参照が必要です。次の例では、js および css ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、`js` および `css` ファイルの実際の格納場所に合わせて変更する必要があります。
	
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

2. `CheckBox` をビュー ページへ追加する

	**Razor の場合:**
	
	```csharp
	@(Html.InfragisticsMobile()
	    .CheckBox()
	    .Text("Basic CheckBox")
	    .ID("chkbx1")
	    .Checked(true)
	    .Render())
	```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CheckBox* の概要](CheckBox-Overview.html): このトピックには、`CheckBox` MVC ラッパーに関連する情報が収められています。

- [*CheckBoxGroup* の構成](CheckBoxGroup-Configuring.html): このトピックでは、MVC ラッパーで `CheckBoxGroup` を構成するために必要な情報とリファレンス情報を紹介します。

- [*CheckBoxGroup* プロパティのリファレンス](CheckBoxGroup-Property-Reference.html): このトピックでは、`CheckBoxGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-checkbox-group/basic-usage): このサンプルでは、`CheckBoxGroup` の ASP.NET MVC ヘルパーの使用方法を紹介します。

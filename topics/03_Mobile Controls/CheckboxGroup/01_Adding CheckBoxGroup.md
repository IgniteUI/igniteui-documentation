<!--
|metadata|
{
    "fileName": "adding-checkboxgroup",
    "controlName": "CheckBoxGroup",
    "tags": ["Editing","How Do I","MVC"]
}
|metadata|
-->

#CheckBoxGroup の追加

## 概要

`CheckBoxGroup` MVC ラッパーは、同じグループ内の複数の `CheckBox` 項目を結合します。このトピックでは、`CheckBoxGroup` をデフォルト動作で初期化する方法を紹介します。

次のスクリーンショットは最終結果のプレビューです。

![](images/03_AddingCheckBoxGroup_1.png)

## 前提条件
この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC Mobile アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

## 手順
以下の手順では、`CheckBoxGroup` を初期化する方法を紹介します。

1. ビュー ページにリソースを追加します。

	Infragistics.Web.Mvc.Mobile.dll への参照と、Infragistics Mobile Loader への参照が必要です。次の例では、js および css ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、`js` および `css` ファイルの実際の格納場所に合わせて変更する必要があります。
	
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

2. ビュー ページに `CheckBoxGroup` を追加

	**Razor の場合:**

	```
	@(Html.InfragisticsMobile()
	    .CheckBoxGroup()
	    .ID("chkbxgrp1")
	    .Theme("a")
	    .Items(item => {
	        item.CheckBox().Text("Check Box 1");
	        item.CheckBox().Text("Check Box 2");
	        item.CheckBox().Text("Check Box 3");
	    })
	    .Render())
	```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CheckBoxGroup* の概要](CheckBoxGroup-Overview.html): このトピックでは、`CheckBoxGroup` MVC ラッパーに関する情報を紹介します。

- [*CheckBoxGroup* の構成](CheckBoxGroup-Configuring.html): このトピックでは、MVC ラッパーで `CheckBoxGroup` を構成するために必要な情報とリファレンス情報を紹介します。

- [*CheckBoxGroup* プロパティのリファレンス](CheckBoxGroup-Property-Reference.html): このトピックでは、`CheckBoxGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-checkbox-group/basic-usage): このサンプルでは、`CheckBoxGroup` の ASP.NET MVC ヘルパーの使用方法を紹介します。

<!--
|metadata|
{
    "fileName": "addingtextbox",
    "controlName": "TextBox",
    "tags": ["Editing","How Do I","MVC"]
}
|metadata|
-->

# TextBox の追加

以下のステップでは、ASP.NET MVC ビューに `TextBox` を追加します。

## 手順

1. ビュー ページにリソースを追加します。

	`Infragistics.Web.Mvc.Mobile.dll` と Infragistics モバイル Loader の参照情報を設定します。以下の例では、必要な JavaScript ファイルと CSS ファイルは `ig_mobileui` という名前の仮想ディレクトリにあります。このステップを完了するため、アプリケーションにおける JavaScript リソースと CSS リソースのロケーションに応じてこのフォルダーの名前を変更してください。
	
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

2. ビューに `TextBox` を追加する

	**Razor の場合:**
	
	```
	@(
	    Html.InfragisticsMobile()
	    .TextBox()
	    .ID("txtbx1")
	    .Text("Basic Text Box")
	    .Render()
	)
	```

3. 結果を確認します。

	ビューを保存し、再構築し、アプリケーションを実行して結果を確認してください。

## 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [TextBox の概要](TextBox-Overview.html): このトピックには、TextBox ASP.NET MVC ヘルパーの関連情報が含まれています。
- [TextBox プロパティのリファレンス](TextBox-Property-Reference.html): このトピックでは、`TextBox` ASP.NET MVC ヘルパーのオプションのリファレンス情報を紹介します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-textbox/basic-usage): このサンプルでは、`TextBox` ASP.NET MVC ヘルパーを使用していくつかのタイプの入力フィールドを定義する方法を示します。





 

 



<!--
|metadata|
{
    "fileName": "adding-radiobuttongroup",
    "controlName": "RadioButtonGroup",
    "tags": ["Editing","MVC"]
}
|metadata|
-->

# RadioButtonGroup の追加

## トピックの概要
### 目的

このトピックでは、Infragistics MVC ラッパーを使用した RadioButtonGroup を有効にするために必要な情報を提供します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [RadioButtonGroup の概要](RadioButtonGroup-Overview.html): このトピックには、`RadioButtonGroup` MVC ラッパーに関連する情報が収められています。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**RadioButtonGroup を有効にする**](#enabling)
    -   [概要](#introduction)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-topics)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="enabling"></a>RadioButtonGroup を有効にする
### <a id="introduction"></a>概要

この手順では、MVC ラッパーを使用して、MVC ソリューション内のビュー ページに `RadioButtonGroup` を追加する方法を説明します。

### <a id="preview"></a>プレビュー 

次のスクリーンショットは最終結果のプレビューです。

![](images/03_AddingRadioButtonGroup_1.png)

### <a id="prerequisites"></a>前提条件 

この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC Mobile アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

### <a id="overview"></a>概要 

以下はプロセスの概念的概要です。

1. ビュー ページへのリソースの追加

2. `RadioButtonGroup` をビュー ページに追加します

3. 結果の検証

### <a id="steps"></a>手順

以下のステップでは、MVC ラッパーを使用して Radio Button を追加する方法を示します。

1. ビュー ページにリソースを追加します。

	`Infragistics.Web.Mvc.Mobile.dll` への参照と、Infragistics Mobile Loader への参照が必要です。次の例では、js および css ファイルのすべてが ig_mobileui という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、js および css ファイルの実際の格納場所に合わせて変更する必要があります。
	
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

2. `RadioButtonGroup` をビュー ページに追加します
	
	**Razor の場合:**
	
	```
	@(
	    Html.InfragisticsMobile()
	    .RadioButtonGroup()
	    .Text("RadioButtonGroup")
	    .ID("rdbtngrp1")
	    .Items(item =>
	    {
	        item.RadioButton().ID("rdbtnMale").Text(”Male");
	        item.RadioButton().ID("rdbtnFemale").Text(”Female");   
	    })
	    .Render()
	)
	```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。



## <a id="related-topics"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [RadioButtonGroup の概要](RadioButtonGroup-Overview.html): このトピックには、`RadioButtonGroup` MVC ラッパーに関連する情報が収められています。

- [RadioButtonGroup の構成](RadioButtonGroup-Configuring.html): このトピックには、MVC ラッパーを使用して `RadioButtonGroup` を構成するために必要な情報および参照が含まれています。

- [RadioButtonGroup のプロパティ リファレンス](RadioButtonGroup-Property-Reference.html): このトピックでは、`RadioButtonGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-radiobutton-group/basic-usage): このサンプルでは、`RadioButtonGroup` を水平方向または垂直方向に描画する方法を紹介します。





 

 



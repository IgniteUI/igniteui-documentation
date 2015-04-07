<!--
|metadata|
{
    "fileName": "toggleswitch-adding",
    "controlName": "ToggleSwitch",
    "tags": ["How Do I","MVC"]
}
|metadata|
-->

# ToggleSwitch の追加

## トピックの概要

### 目的

このトピックでは、Infragistics® Model-View-Controller (MVC) ラッパーを使用して `Toggle Switch` ウィジェットを有効にする方法をコード例を示して説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Toggle Switch の概要](ToggleSwitch-Overview.html): このトピックでは、`Toggle Switch` MVC ラッパーとその主な機能の概要を示します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**Toggle Switch の追加**](#adding)
-   [**関連コンテンツ**](#related-content)



## <a id="adding"></a> Toggle Switch の追加

この手順は、MVC ラッパーを使用して、MVC ソリューションの View ページに `Toggle Switch` ウィジェットを追加する方法を示します。Infragistics モバイル Loader への参照に加え、*Infragistics.Web.Mvc.Mobile.dll* への参照を追加する必要があります。

サンプル  コードは、*Lights* という左揃えのラベルが付いた、120 ピクセル幅の `Toggle Switch` を構成する手順を示します。

### プレビュー

以下のスクリーンショットは、手順を実行した結果として、ページに追加された `Toggle Switch` ウィジェットを示しています。

![](images/ToggleSwitch_Enabling_1.png)

### 前提条件

この手順を実行するには、以下のリソースが必要です。

-   MVC モバイル アプリケーション
-   MVC reassurance ラッパーに必要なリソースへの参照

### 概要

以下はプロセスの概念的概要です。

1. リソースを  View ページに追加

2. `Toggle Switch` を View ページに追加

3. 結果の検証

### 手順

1. リソースを  View ページに追加します。

	以下のサンプル コードでは、すべての JavaScript および CSS ファイルが、`ig_mobileui` という名前の仮想ディレクトリの下に置かれています。この手順を完了するには、マシン上の正しい JavaScript および CSS の保管場所に従ってこのフォルダーの名前を変更する必要があります。
	
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

2. `Toggle Switch` を View ページに追加します。

	`Toggle Switch` ウィジェットのインスタンスを、その構成設定と共に追加します。
	
	この例では、`Toggle Switch` は、「*Lights*」に設定された [`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Label.html) プロパティ、*Left* に設定された [`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~LabelAlignment.html)、 「*120px*」に設定された [`Width`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Width.html) と共に構成されています。
	
	**Razor の場合:**
	
	```csharp
	@(
	    Html.InfragisticsMobile()
	    .ToggleSwitch()
	    .Label("Lights")
	    .LabelAlignment(Alignment.Left)
	    .Width("12
	0
	px")
	    .Render()
	)
	```

3. 結果を検証します。

	結果を検証するには、ビューを保存してから、アプリケーションを再構築および実行します。


## <a id="related-content"></a> 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Toggle Switch](ToggleSwitch-Configuring.html) [の構成](ToggleSwitch-Configuring.html): このトピックでは、`Toggle Switch` ウィジェットを構成する方法を説明します。

- [Toggle Switch](ToggleSwitch-Property-Reference.html) [のプロパティ参照](ToggleSwitch-Property-Reference.html): このトピックでは、`Toggle Switch` ウィジェットのプロパティに関する参照情報を提供します。このトピックでは、Toggle Switch ウィジェットのプロパティに関する参照情報を提供します。


### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-toggleswitch/basic-usage): このサンプルでは、基本の例で `Toggle Switch` ASP.NET MVC ラッパーを使用する方法を紹介します。

- [デバイス マネージャー](%%SamplesUrl%%/mobile-toggleswitch/device-manager): このサンプルは、デバイスをオン/オフにできるデバイス マネージャーで `Toggle Switch` MVC ラッパーを使用する方法を紹介します。



 

 



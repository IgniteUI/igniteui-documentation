<!--
|metadata|
{
    "fileName": "slider-adding",
    "controlName": "Slider",
    "tags": ["How Do I","MVC"]
}
|metadata|
-->

# Slider の追加

## トピックの概要

### 目的

このトピックでは、Infragistics ASP.NET MVC ヘルパーを使用して jQuery Mobile `slider` を追加する方法を説明しています。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Slider の概要](Slider-Overview.html): このトピックでは、`Slider` ASP.NET MVC ヘルパーの機能を説明しています。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**Slider の追加**](#adding)
-   [**関連コンテンツ**](#related-content)


## <a id="introduction"></a>概要

Slider ASP.NET MVC ヘルパーは、jQuery モバイルの `slider` を ASP.NET ビューに表示するために使用します。スライダーは、数値入力用のエディターとしてモバイル デバイスで使用される一般的な UI 要素です。



## <a id="adding"></a>スライダーの有効化

ここでは、ASP.NET MVC ヘルパーを使用して `Slider` を ASP.NET MVC ソリューションのビューに追加する手順を示します。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Slider_Adding_1.png)

### 前提条件

この手順を実行するには、以下のリソースが必要です。

-   ASP.NET MVC モバイル アプリケーションのインストール

### 概要

以下はプロセスの概念的概要です。

1. ビュー ページへのリソースの追加

2. ビュー ページに Slider を追加

3. 結果の検証

### 手順

既定のオプションを備えた `Slider` をビューに追加する手順を以下に示します。

1. ビュー ページにリソースを追加します。

	*Infragistics.Web.Mvc.Mobile.dll* アセンブリと Infragistics モバイル Loader を参照します。次の例では、JavaScript および CSS ファイルのすべてが *ig_mobileui* という仮想ディレクトリーに置かれています。この手順の完了させるためには、このパスを　JavaScript および CSS ファイルの実際の格納場所に合わせて変更する必要があります。
	
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

2. ビュー ページに `Slider` を追加します。

	この例では、`Slider` の [`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html) プロパティが「*Volume*」に設定され、[`Value`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html) が *30.0* に設定されています。
	
	**Razor の場合:**
	
	```
	@(
	    Html.InfragisticsMobile()
	    .Slider()
	    .Label("Volume")
	    .Value(30.0)    
	    .Render()
	)
	```

3. 結果を確認します。

	ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。




## <a id="related-content"></a>関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Slider の概要](Slider-Overview.html): このトピックでは、`Slider` ASP.NET MVC ヘルパーの機能を説明しています。

- [Slider の構成](Slider-Configuring.html): このトピックでは、ASP.NET MVC ヘルパーを使用して `Slider` を構成するために必要な情報とリファレンスを提供します。

- [プロパティ リファレンス](Slider-Property-Reference.html): このトピックでは、`Slider` ASP.NET MVC ヘルパーのプロパティに関する参照情報を提供しています。



### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-slider/basic-usage): このサンプルでは、基本の例で Slider ASP.NET MVC ヘルパーを使用する方法を紹介します。

- [カラー ピッカー](%%SamplesUrl%%/mobile-slider/color-picker): このサンプルでは、カラー ピッカー シナリオで Slider ASP.NET MVC ヘルパーを使用する方法を紹介します。スライダーを移動させると、四角形の色が変わり、その色の 16 進数値が自動的に表示されます。





 

 



<!--
|metadata|
{
    "fileName": "slider-overview",
    "controlName": "Slider",
    "tags": ["Getting Started"]
}
|metadata|
-->

# スライダーの概要

## トピックの概要

### 目的

このトピックでは、`Slider` ASP.NET MVC ヘルパーの機能を説明しています。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Ignite UI での Mobile リソースの参照](Referencing-Mobile-Resources-in-NetAdvantage-for-jQuery.html): 本トピックでは、Ignite UI コントロールに必要なモバイル リソースの管理方法について説明します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**スライダー ASP.NET MVC ヘルパーの主な機能の概要**](#summary)
-   [**スライダー ASP.NET MVC ヘルパーの主な機能**](#features)
	-   [最小/最大値の設定](#min-max-value)
    -   [ラベル テキストと表示位置の設定](#label)
    -   [デフォルト値](#default-value)
    -   [数値入力表示モードの設定](#numeric-input)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`Slider` ASP.NET MVC ヘルパーは、jQuery モバイルの `slider` ウィジェットを ASP.NET ビューに表示するために使用します。スライダーは、モバイル デバイスで数値データ入力用に使用される一般的な UI 要素です。次のスクリーンショットは、オプションと設定値を既定値のままで使用した場合の`スライダー`です。

![](images/Slider_Overview_1.png)



## <a id="summary"></a> スライダー ASP.NET MVC ヘルパーの主な機能の概要

次の表は、スライダー ASP.NET MVC ヘルパーの主な機能をまとめたものです。

機能|説明
--------|------------
最小/最大値の設定|[`MinValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html) と [`MaxValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html) プロパティは、スライダーの最小値と最大値を設定するために使用します。
ラベル テキストと表示位置の設定|[`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html) と [`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html) プロパティは、スライダーのラベル テキストを構成するために使用します。
既定値の設定|[`Value`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html) プロパティは、スライダーの既定値を設定するために使用します。
数値表示モードの設定|[`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティは、スライダーの数値入力の外観を構成するために使用します。





## <a id="features"></a> スライダー ASP.NET MVC ヘルパーの主な機能

### <a id="min-max-value"></a> 最小/最大値の設定

既定では、最小値は *0.0* に、最大値は *100* に設定されています。[`MinValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html) と [`MaxValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html) プロパティは、スライダーの既定値を変更するために使用します。次のスクリーンショットで示す 2 つのスライダーは、[`MinValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html) プロパティを *20.0* に設定したスライダーと、[`MaxValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html) プロパティを *80.0* に設定したスライダーです。

![](images/Slider_Overview_2.png)

**関連トピック**

-   [スライダーの構成](Slider-Configuring.html)

### <a id="label"></a> ラベル テキストと表示位置の設定

[`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html) プロパティは、スライダーのラベル テキストを設定します。[`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html) プロパティは、スライダーのラベルの表示位置を設定します。既定では、ラベルの表示位置はスライダーの左側になります。下のスクリーンショットでは、[`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html) プロパティが「*Volume*」、[`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html) プロパティが「*bottom*」に設定されています。

![](images/Slider_Overview_3.png)

**関連トピック**

-   [スライダーの構成](Slider-Configuring.html)

### <a id="default-value"></a> デフォルト値

[`Value`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html) プロパティを使用すると、スライダーの初期値を設定できます。下のスクリーンショットでは、 [`Value`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html) プロパティが *35* に設定されています。

![](images/Slider_Overview_4.png)

**関連トピック**

-   [スライダーの構成](Slider-Configuring.html)

### <a id="numeric-input"></a> 数値入力表示モードの設定

[`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティは、数値入力の表示位置を構成するために使用します。このプロパティには、inline (インライン)、block (ブロック)、none (なし) の　3 つ値のいずれかを指定できます。以下のスクリーンショットには、[`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) に 3 つの値を設定した状態を示す 3 つのスライダーがあります。上のスライダーでは [`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティが 「*Inline*」 に設定され、中央のスライダーでは [`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティが 「*Block*」 に設定され、下のスライダーでは [`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティが 「*None*」 に設定されています。

![](images/Slider_Overview_5.png)

**関連トピック**

-   [スライダーの構成](Slider-Configuring.html)



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Slider の追加](Slider-Adding.html): このトピックでは、Infragistics ASP.NET MVC ヘルパーを使用して jQuery Mobile `slider` を追加する方法を説明しています。

- [スライダーの構成](Slider-Configuring.html): このトピックでは、ASP.NET MVC ヘルパーを使用して `Slider` を構成するために必要な情報とリファレンスを提供します。

- [Slider プロパティ参照](Slider-Property-Reference.html): このトピックでは、`Slider` ASP.NET MVC ヘルパーのプロパティに関する参照情報を提供しています。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-slider/basic-usage): このサンプルでは、基本の例で `Slider` ASP.NET MVC ヘルパーを使用する方法を紹介します。
    
- [カラー ピッカー](%%SamplesUrl%%/mobile-slider/color-picker): このサンプルでは、カラー ピッカー シナリオで `Slider` ASP.NET MVC ヘルパーを使用する方法を紹介します。スライダーを移動させると、四角形の色が変わり、その色の 16 進数値が自動的に表示されます。





 

 



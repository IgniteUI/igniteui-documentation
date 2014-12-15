<!--
|metadata|
{
    "fileName": "textbox-overview",
    "controlName": "TextBox",
    "tags": ["Editing","Getting Started","MVC"]
}
|metadata|
-->

# TextBox の概要

## トピックの概要
### 目的

このトピックには、`TextBox` ASP.NET MVC ヘルパーの関連情報が含まれています。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**TextBox ASP.NET MVC ヘルパーの主な機能の概要**](#main-features-summary)
-   [**TextBox ASP.NET MVC ヘルパーの機能**](#features)
    -   [テキスト](#text)
    -   [モード](#mode)
    -   [ネイティブ](#native)
    -   [ラベル](#label)
    -   [Mini](#mini)
    -   [無効](#disable)
    -   [テーマ](#theme)
    -   [属性](#attribute)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a>概要

`TextBox` ASP.NET MVC ヘルパーは標準 HTML 入力をレンダリングします。レンダリングすると、jQuery Mobile はモバイル デバイスとタッチ デバイスに最適化します。つまり、jQuery Mobile [textinput](http://jquerymobile.com/demos/1.1.1/docs/forms/textinputs/index.html) プラグインを使用して入力を動的に変更できます。

![](images/02_TextBoxOverview_1.png)



## <a id="main-features-summary"></a>TextBox ASP.NET MVC ヘルパーの主な機能の概要

以下の表は、`TextBox` ASP.NET MVC ヘルパーの主な機能をまとめています。

機能|説明 
---|---
テキスト|[`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Text.html) オプションはコントロールのテキストを設定および取得します。
モード|`TextBox` にはデフォルトのテンプレートがあり、Multiline、Password、Search、および通常のテキスト モードに使用できます。
ネイティブ|このオプションは、ブラウザに従って、デフォルトの HTML INPUT の外観に戻します。
ラベル|このコントロールには、非表示または表示にできるカスタマイズ可能なラベルがあります。 
Mini|`TextBox` には 2 つの状態があります。1 つは標準、もう 1 つはコントロールを小さくします。 
無効|`TextBox` が無効な場合、これは読み取り専用で、ビジュアル スタイルは無効になります。 
テーマ|`TextBox` は標準 jQuery Mobile テーマを受け入れます。 
属性|ASP.NET MVC `TextBox` ヘルパーには、クライアント上で描画される HTML 属性のリストを受け入れるメソッドがあります。



## <a id="features"></a>TextBox ASP.NET MVC ヘルパーの機能
### <a id="text"></a>テキスト

`TextBox` の [Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Text.html) オプションはコントロールのテキストを設定および取得します。

![](images/02_TextBoxOverview_1.png)

### <a id="mode"></a>モード

`TextBox` には、Multiline、Password、Search、および通常の Text モード用のデフォルトのテンプレートがあります。以下の画像は、`TextBox` の、それぞれのモードでの外観を示します。

![](images/02_TextBoxOverview_3.png)

![](images/02_TextBoxOverview_4.png)

![](images/02_TextBoxOverview_5.png)

### <a id="native"></a>ネイティブ

デフォルトで、jQuery Mobile は入力テキストの通常の HTML 入力を変更し、モバイル デバイス用にそれを最適化します。ただし、ASP.NET MVC `TextBox` ヘルパーによって、必要に応じて、基本 HTML `TextBox` の外観に戻すことができます。

![](images/02_TextBoxOverview_6.png)

### <a id="label"></a>ラベル

[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Text.html) メソッドによって、コントロール自身の内部のテキストを修正できますが、テキストをコントロールの上に配置したい場合、[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Label.html) プロパティを使用します。

![](images/02_TextBoxOverview_7.png)

### <a id="mini"></a>Mini

`TextBox` は 2 つの状態を持つことができます。1 つは標準、もう 1 つはコントロールをより小さくできるものです。`TextBox` のデフォルト サイズが要件に合わず、コントロールのサイズを制限する必要がある場合、その [Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Mini.html) メソッドを使って、`TextBox` を小さくすることができます。

![](images/02_TextBoxOverview_8.png)

### <a id="disable"></a>無効

`TextBox` が無効な場合、それは読み取り専用で、以下の画像に示されているように、テキストのビジュアル スタイルは無効になります。

![](images/02_TextBoxOverview_9.png)

### <a id="theme"></a>テーマ

`TextBox` は標準の [jQuery Mobile テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)を使用できます。デフォルトで、ASP.NET MVC ヘルパーは、デフォルトの jQuery Mobile テーマのスウォッチ、つまり c を使ってコントロールを描画します。

### <a id="attribute"></a>属性

ASP.NET MVC `TextBox` ヘルパーには、クライアント上で描画される HTML 属性のリストを受け入れるメソッドがあります。メソッド名は [HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~HtmlAttributes.html) で、これは [Dictionary](http://msdn.microsoft.com/ja-jp/library/xfhwa508.aspx) タイプのパラメーターを受け入れます。



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [TextBox の追加](AddingTextBox.html): このトピックには、Infragistics ASP.NET MVC ヘルパーを使用して `TextBox` を有効にするために必要な情報が含まれています。

- [TextBox プロパティのリファレンス](TextBox-Property-Reference.html): このトピックでは、`TextBox` ASP.NET MVC ヘルパーのプロパティ参照を提供します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-textbox/basic-usage): このサンプルでは、`TextBox` ASP.NET MVC ヘルパーを使用していくつかのタイプの入力フィールドを定義する方法を示します。





 

 



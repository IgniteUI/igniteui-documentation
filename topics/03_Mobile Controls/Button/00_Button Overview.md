<!--
|metadata|
{
    "fileName": "button-overview",
    "controlName": "Button",
    "tags": ["Getting Started","MVC"]
}
|metadata|
-->

# Button の概要

## トピックの概要

### 目的

このトピックでは、MVC Button コントロール ラッパーとその主な機能を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**Button MVC ラッパーの主な機能の概要**](#features-summary)
-   [**Button MVC ラッパーの各種機能**](#features)
    -   [Text](#text)
    -   [Mini](#mini)
    -   [Inline](#inline)
    -   [Submit](#submit)
    -   [Icons](#icons)
    -   [Corners](#corners)
    -   [Shadow](#shadow)
    -   [Theme](#theme)
    -   [Attributes](#attributes)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

Button MVC ラッパーは、[jQuery モバイル](http://jquerymobile.com/demos/1.1.1/docs/buttons/index.html) コントロールを表示するサーバー側のコントールです。このラッパーを使用すると、MVC Web プロジェクトにボタンを追加して、クライアントやサーバー上でのボタンの状態を構成できるようになります。

![](images/02_ButtonOverview_1.png)



## <a id="features-summary"></a> Button MVC ラッパーの主な機能の概要
Button MVC ラッパーの主な機能を次の表にめとめます。

機能|説明
---|---
[Text](#text) |[`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonModel~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。
[Mini](#mini) |Button が取り得る状態は 2 つあります。1 つは標準の状態で、もう 1 つはコントロールを小型化できる状態です。
[Inline](#inline) |特に指定しない限り、Button はブロック形式になるため、2 つのボタンを挿入した場合は 2 つの行に分けて表示されることになります。[`Inline`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonModel~Inline.html) メソッドを設定すると、1 つの行に複数のボタンを表示できます。
[Submit](#submit) |特に指定されていない限り、Button は HTML DIV 要素としてクライアントに表示されるようになっています。ただし、[送信] ボタンになるように構成されている場合は異なります。その場合、ボタンは submit タイプの HTML インプットとして表示されます。
[Icons](#icons) |Button ごとに表示アイコンを変えるようにカスタマイズできます。
[Corners](#corners) |Button のコーナー (四隅) に丸みを付けるようにカスタマイズできます。
[Shadow](#shadow) |Button に陰を付けるようにカスタマイズできます。
[Theme](#theme) |Button に標準の jQuery モバイル テーマを適用できます。
[Attributes](#attributes) |MVC Button ラッパーは、クライアント側で表示される一連の HTML 属性に対応したメソッドを備えています。




## <a id="features"></a> Button MVC ラッパーの各種機能

### <a id="text"></a> テキスト

Button の [`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonModel~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。

![](images/02_ButtonOverview_2.png)

### <a id="mini"></a> Mini

Button が取り得る状態は 2 つあります。1 つは標準の状態で、もう 1 つはコントロールを小型化できる状態です。既定の Button サイズが個々の要件に合わないためにコントロールのサイズを小さくしたいという場合は、ボタンの [`Mini`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Mini.html) メソッドを使用してチェックボックスを小型化できます。

![](images/02_ButtonOverview_3.png)

### <a id="inline"></a> Inline

特に指定しない限り、Button はブロック形式になるため、2 つのボタンを挿入すると、それらのボタンは 2 つの行に分けて表示されることになります。[`Inline`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonModel~Inline.html) メソッドを設定すると、1 つの行に複数のボタンを表示できます。

![](images/02_ButtonOverview_4.png)

### <a id="submit"></a> Submit

特に指定されていない限り、Button は HTML div 要素としてクライアントに表示されるようになっています。ただし、[送信] ボタンになるように構成されている場合は異なります。その場合、ボタンは送信タイプの HTML インプットとして表示されます。[`IsSubmitButton`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonModel~IsSubmitButton.html) メソッドを使用すれば、任意のボタンを [送信] ボタンとして構成できます。Button は、やはり HTML の span 要素としてクライアントに表示されることになりますが、非表示のインプット送信フィールドに関連付けられたものになります。

![](images/02_ButtonOverview_5.png)

### <a id="icons"></a> アイコン

Button ごとに表示アイコンを変えるようにカスタマイズできます。アイコンの変更は、Icons ラッパー メソッドで実現できます。任意の jQuery Mobile [ボタン アイコン](http://jquerymobile.com/demos/1.1.1/docs/buttons/buttons-icons.html)をパラメーターとして渡すことができます。次の画像は、「チェック」アイコンを使用したボタンのスクリーンショットです。

![](images/02_ButtonOverview_6.png)

### <a id="corners"></a> Corners

Button のコーナー (四隅) に丸みを付けるようにカスタマイズできます。これは、[`Corners`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonModel~Corners.html) メソッドを使用して実現できます。特に指定しない限りボタンのコーナー (四隅) には丸みが付けられるようになっているため、コーナーを四角くしたい場合にはパラメーターとして「false」を渡す必要があります。

![](images/02_ButtonOverview_7.png)

### <a id="shadow"></a> Shadow

Button ラッパーの [`Shadow`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonModel~Shadow.html) メソッドを使用することにより、ボタンに影を付けるようにカスタマイズできます。

![](images/02_ButtonOverview_2.png)

### <a id="theme"></a> テーマ

Button に標準の [jQuery Mobile テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)を適用できます。特に指定しない限り、MVC ラッパーは、既定の jQuery モバイル形式 (つまり、テーマ 「c」) で各コントロールを表示します。次の画像は、テーマ 「e」 でカスタマイズしたボタンのスクリーンショットです。

![](images/02_ButtonOverview_5.png)

### <a id="attributes"></a> 属性

MVC Button ラッパーは、クライアント側で表示される一連の HTML 属性に対応したメソッドを備えています。メソッド名は [`HtmlAttributes`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~HtmlAttributes.html) で、このメソッドは [Dictionary](http://msdn.microsoft.com/ja-jp/library/xfhwa508.aspx) タイプで使用されるパラメーターに対応しています。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Button* の追加](Adding-Button.html): このトピックでは、Infragistics MVC ラッパーを使用した Button を有効にするために必要な情報を提供します。

- [*Button* の構成](Button-Configuring.html): このトピックでは、MVC ラッパーを使用した Button を構成する際に必要な情報とリファレンスを提供します。

- [*Button* のプロパティ リファレンス](Button-Property-Reference.html): このトピックでは、Button MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-button/basic-usage): このサンプルでは、Button の ASP.NET MVC ヘルパーの表示オプションを紹介します。





 

 



<!--
|metadata|
{
    "fileName": "navbar-overview",
    "controlName": "NavBar",
    "tags": ["Getting Started","MVC","Navigation"]
}
|metadata|
-->

# NavBar の概要

## トピックの概要

### 目的

このトピックでは、`NavBar` MVC ラッパーに関する情報を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**NavBar MVC ラッパーの主な機能の要点**](#summary)
-   [**NavBar MVC ラッパーの機能**](#features)
-   -   [項目](#items)
    -   [アイコン](#icon)
    -   [テーマ](#theme)
    -   [属性](#attributes)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)


## <a id="introduction"></a> 概要

NavBar MVC ヘルパーは外部ページや内部ページ ブロックの参照情報である項目メニューを定義します。このコントロールは、個々の項目を構成しスタイルを設定できる API のほか、全体を設定する NavBar を処理します。NavBar MVC ヘルパーは jQuery Mobile [navbar](http://jquerymobile.com/demos/1.1.1/docs/toolbars/docs-headers.html) ウィジェットをレンダリングします。

![](images/02_NavBarOverview_1.png)



## <a id="summary"></a> NavBar MVC ラッパーの主な機能の要点

以下の表は、NavBar MVC ラッパーの主な機能をまとめたものです。

機能|説明
---|---
項目|`NavBar` では、項目を定義できます。それぞれに、テーマ、アイコン、項目セットを割り当てることができます。
アイコン|すべての項目にアイコンを定義でき、アイコンの位置は一般とレベルと個別レベルのいずれかで定義できます。
テーマ|リンクは標準 jQuery Mobile テーマを受け付けます。
属性|MVC Link  ラッパーには、クライアントでレンダリングされる HTML 属性のリストを受け付けるメソッドがあります。


## <a id="features"></a> NavBar MVC ラッパーの機能

### <a id="items"></a> 項目

`NavBar` では、項目を定義できます。それぞれに、固有のテーマ、アイコン、項目セットを割り当てることができます。個別の項目メソッドの詳細については、[*NavBar* プロパティの参照](NavBar-Property-Reference.html)トピックを参照してください。

### <a id="icon"></a> アイコン

Button ごとに表示アイコンを変えるようにカスタマイズできます。アイコンの変更は、Icons ラッパー メソッドで実現できます。任意の jQuery Mobile [ボタン アイコン](http://jquerymobile.com/demos/1.1.1/docs/buttons/buttons-icons.html)をパラメーターとして渡すことができます。以下の図は、すべての項目にさまざまなアイコンがある NavBars です。以下の結果を実現する方法については、[NavBar の追加](Adding-NavBar.html)トピックを参照してください。

![](images/02_NavBarOverview_1.png)

### <a id="theme"></a> テーマ

リンクは標準 [jQuery Mobile テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)を受け付けますが、その場合テーマはコントロールにボタン的な外観のコントロールがないと適用できません。特に指定しない限り、MVC ラッパーは、既定の jQuery モバイル形式 (つまり、テーマ “c”) で各コントロールを表示します。以下の図は、テーマ 「a」 でカスタマイズした `NavBar` です。

![](images/02_NavBarOverview_3.png)

### <a id="attributes"></a> 属性

MVC Link  ラッパーには、クライアントでレンダリングされる HTML 属性のリストを受け付けるメソッドがあります。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*NavBar* の追加](Adding-NavBar.html): このトピックには、Infragistics MVC ラッパーを使用して `NavBar` を有効にするために必要な情報が含まれています。

- [*NavBar* のプロパティ参照](NavBar-Property-Reference.html): このトピックでは、`NavBar` MVC ラッパーのプロパティに関するリファレンス情報を紹介します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-navbar/basic-usage): `NavBar` ASP.NET MVC ヘルパーでは、ナビゲーション メニューを作成し、それをカスタマイズできます。





 

 



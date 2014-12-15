<!--
|metadata|
{
    "fileName": "radiobuttongroup-overview",
    "controlName": "RadioButtonGroup",
    "tags": ["Editing","MVC"]
}
|metadata|
-->

# RadioButtonGroup の概要



## トピックの概要
### 目的

このトピックには、`RadioButtonGroup` MVC ラッパーに関連する情報が収められています。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**RadioButtonGroup MVC ラッパーの主な機能の概要**](#main-features-summary)
-   [**RadioButtonGroup MVC ラッパーの機能**](#features)
    -   [テキスト](#text)
    -   [項目](#items)
    -   [水平方向](#horizontal)
    -   [Mini](#mini)
    -   [テーマ](#theme)
    -   [属性](#attribures)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a>概要

`RadioButtonGroup` MVC ラッパーは一連のオプションを描画しますが、選択できるのはその内の 1 つのみです。他のいくつかのコントロールと同様に、`RadioButtonGroup` MVC ラッパーは標準 HTML 入力要素を使用してから、タッチ環境をサポートするための追加のマークアップと機能を追加します。たとえば、すべてのラジオ ボタンを通常の垂直位置にせずに、`RadioButtonGroup` MVC ラッパーでは、ボタンを水平に配置することも可能です。jQuery Mobile [checkboxradio](http://jquerymobile.com/demos/1.1.1/docs/forms/radiobuttons/) ウィジェットを使用して、任意のラジオ ボタンに動的にアクセスすることもできます。

![](images/02_RadioButtonGroupOverview_1.png)



## <a id="main-features-summary"></a>RadioButtonGroup MVC ラッパーの主な機能の概要

以下の表は、`RadioButtonGroup` MVC ラッパーの主な機能をまとめています。

機能|説明
---|---
テキスト|[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。
項目|このコントロールによって、いくつかの個々のラジオ ボタン項目を定義することができます。これらはその親の動作を継承しますが、それを上書きすることもできます。
水平方向|このコントロールを構成して、ボタンを水平に並べて表示することができます。
Mini|ラジオ ボタンは 2 つの状態が可能です – 1 つは標準、もう 1 つはコントロールを小さくします。
テーマ|`RadioButtonGroup` は標準の jQuery Mobile テーマを受け入れ、それをすべての子ボタンに適用します。
属性|MVC `RadioButtonGroup` ラッパーは、クライアント上で描画される HTML 属性のリストを受け入れるメソッドを持ちます。


## <a id="features"></a>RadioButtonGroup MVC ラッパーの機能
### <a id="text"></a>テキスト

[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。これはラジオ ボタン コンテナーの上に表示されます。

![](images/02_RadioButtonGroupOverview_2.png)

### <a id="items"></a>項目

このコントロールによって、いくつかの個々のラジオ ボタン項目を定義し、選択したものを設定できます。すべてのボタンはその親の動作を継承しますが、それを上書きすることもできます。すべてのオプション ボタンのメソッドを確認するには、[**RadioButtonGroup プロパティ参照**](RadioButtonGroup-Property-Reference.html)のトピックをご覧ください。

### <a id="horizontal"></a>水平方向

以下の画像に示されているように、このコントロールを構成して、ボタンを水平に並べて表示することができます。[**RadioButtonGroup の構成**](RadioButtonGroup-Configuring.html)のトピックで、どのようにこれを実現できるか詳細を確認できます。

![](images/02_RadioButtonGroupOverview_3.png)

### <a id="mini"></a>Mini

`RadioButtonGroup` は 2 つの状態が可能です – 1 つは標準、もう 1 つはコントロールを小さくします。このメソッドはグループ全体が対象ですが、個々のラジオ ボタン項目によって上書きされることも可能です。

![](images/02_RadioButtonGroupOverview_4.png)

### <a id="theme"></a>テーマ

`RadioButtonGroup` は標準の jQuery Mobile テーマを持つことができます。以下の画像は、テーマ「a」が適用された `RadioButtonGroup` を示しています。このメソッドはグループ全体が対象ですが、個々のラジオ ボタン項目にテーマを設定するだけです。独自のテーマを定義するラジオ ボタンがある場合、それによって全体のテーマが上書きされます。

![](images/02_RadioButtonGroupOverview_5.png)

### <a id="attribures"></a>属性

MVC Radio Button ラッパーは、クライアント上で描画される HTML 属性のリストを受け入れるメソッドを持ちます。メソッド名は [HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonWrapper~HtmlAttributes.html) で、このメソッドは [Dictionary](http://msdn.microsoft.com/ja-jp/library/xfhwa508.aspx) タイプで使用されるパラメーターに対応しています。これは子ラジオ ボタンにのみ利用でき、グループには利用できません。



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [RadioButtonGroup の追加](Adding-RadioButtonGroup.html): このトピックでは、Infragistics MVC ラッパーを使用した `RadioButtonGroup` を有効にするために必要な情報を提供します。

- [RadioButtonGroup の構成](RadioButtonGroup-Configuring.html): このトピックには、MVC ラッパーを使用して `RadioButtonGroup` を構成するために必要な情報および参照が含まれています。

- [RadioButtonGroup のプロパティ リファレンス](RadioButtonGroup-Property-Reference.html): このトピックでは、`RadioButtonGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-radiobutton-group/basic-usage): このサンプルでは、`RadioButtonGroup` を水平方向または垂直方向に描画する方法を紹介します。





 

 



<!--
|metadata|
{
    "fileName": "checkbox-overview",
    "controlName": "CheckBox",
    "tags": ["Editing","Getting Started","MVC"]
}
|metadata|
-->

# CheckBox の概要

## トピックの概要

### 目的

このトピックには、`CheckBox` MVC ラッパーに関連する情報が収められています。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**チェックボックス MVC ラッパーの主な機能の概要**](#features-summary)
-   [**チェックボックス MVC ラッパーの各種機能**](#features)
    -   [テキスト](#text)
    -   [Mini](#mini)
    -   [ネイティブな外観](#native-appearance)
    -   [テーマ](#theme)
    -   [属性](#attributes)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

チェックボックス MVC ラッパーは、[jQuery](http://jquerymobile.com/demos/1.1.1/docs/forms/checkboxes/) コントロールを表示するサーバー側のコントールです。このラッパーを使用すると、MVC Web プロジェクトにチェックボックスを追加して、クライアントやサーバー上でのチェックボックスの状態を構成できるようになります。つまり、jQuery モバイルの [checkboxradio](http://jquerymobile.com/demos/1.1.1/docs/forms/checkboxes/) プラグインを使用してチェックボックスを動的に変更できるようになるということです。

![](images/02_CheckBoxOverview_1.png)



## <a id="features-summary"></a> チェックボックス MVC ラッパーの主な機能の概要

`CheckBox` MVC ラッパーの主な機能を次の表にめとめます。

機能|説明
---|---
テキスト|[`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。
チェック|このコントロールは、制御値のチェック/アンチェック/変更を可能にするものです。
Mini|`CheckBox` が取り得る状態は 2 つあります。1 つは標準の状態で、もう 1 つはコントロールを小型化できる状態です。
ネイティブな外観|MVC チェックボックス ラッパーを使用していれば、HTML チェックボックスの外観を基本的な外観に戻すことができます。
テーマ|`CheckBox` は、jQuery モバイルの標準テーマに対応しています。
属性|MVC `CheckBox` ラッパーは、クライアント側で表示される一連の HTML 属性に対応したメソッドを備えています。



## <a id="features"></a> チェックボックス MVC ラッパーの各種機能

### <a id="text"></a> テキスト

`CheckBox` の[`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Text.html) プロパティは、コントロールのテキストを取得または設定するためのプロパティです。

![](images/02_CheckBoxOverview_2.png)

### <a id="mini"></a> Mini

`CheckBox` が取り得る状態は 2 つあります。1 つは標準の状態で、もう 1 つはコントロールを小型化できる状態です。既定の `CheckBox` サイズが個々の要件に合わないためにコントロールのサイズを小さくしたいという場合は、CheckBox の [`Mini`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Mini.html) メソッドを使用してチェックボックスを小型化できます。

![](images/02_CheckBoxOverview_3.png)

### <a id="native-appearance"></a> ネイティブな外観

特に指定しない限り、jQuery モバイルは、モバイル デバイスに合わせてチェックボックス タイプの標準入力を変更します。ただし、MVC `CheckBox` ラッパーを使用していれば、HTML チェックボックスの外観を基本的な外観に戻すことができます。

![](images/02_CheckBoxOverview_4.png)

### <a id="theme"></a> テーマ

`CheckBox` は、標準の [jQuery モバイル テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)に対応しています。特に指定しない限り、MVC ラッパーは、既定の jQuery モバイル形式 (つまり、テーマ “c”) で各コントロールを表示します。次の画像は、テーマ “b” でカスタマイズしたチェックボックスのスクリーンショットです。

![](images/02_CheckBoxOverview_5.png)

### <a id="attributes"></a> 属性

MVC `CheckBox` ラッパーは、クライアント側で表示される一連の HTML 属性に対応したメソッドを備えています。メソッド名は [`HtmlAttributes`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~HtmlAttributes.html) で、このメソッドは [Dictionary](http://msdn.microsoft.com/ja-jp/library/xfhwa508.aspx) タイプで使用されるパラメーターに対応しています。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CheckBox* の追加](Adding-CheckBox.html): このトピックには、Infragistics MVC ラッパーを使用して `CheckBox` を有効にするために必要な情報が含まれています。

- [*CheckBox* の構成](CheckBox-Configuring.html): このトピックでは、MVC ラッパーを使用した `CheckBox` を構成する際に必要な情報とリファレンスを提供します。

- [*CheckBox* プロパティ参照](CheckBox-Property-Reference.html): このトピックでは、`CheckBox` MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-checkbox/basic-usage): このサンプルでは、`CheckBox` の ASP.NET MVC ヘルパーの使用方法を紹介します。





 

 



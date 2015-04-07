<!--
|metadata|
{
    "fileName": "checkboxgroup-overview",
    "controlName": "CheckBoxGroup",
    "tags": ["Editing","Getting Started","MVC"]
}
|metadata|
-->

# CheckBoxGroup の概要

## トピックの概要

### 目的

このトピックでは、`CheckBoxGroup` MVC ラッパーに関する情報を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**CheckBoxGroup MVC ラッパーの主な機能の概要**](#features-summary)
-   [**CheckBoxGroup MVC ラッパーの機能**](#features)
    -   [グループ名の設定](#name)
    -   [項目の定義](#items)
    -   [方向](#orientation)
    -   [Mini](#mini)
    -   [テーマ](#theme)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`CheckBoxGroup` MVC ラッパーにより、複数の個々のチェック ボックスを 1 つのコンテキストの下で結合できます。つまり、jQuery Mobile [checkboxradio](http://jquerymobile.com/demos/1.1.1/docs/forms/checkboxes/) プラグインを使用して、チェック ボックスを動的に変更できます。個々のチェックボックスの構成方法と使用方法の詳細については、[CheckBox](CheckBox.html) トピックを参照してください。

![](images/02_CheckBoxGroupOverview_1.png)



## <a id="features-summary"></a> CheckBoxGroup MVC ラッパーの主な機能の概要

以下の表は、`CheckBoxGroup` MVC ラッパーの主な機能をまとめています。

機能|説明
---|---
グループ名の設定|[`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupModel~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。
項目の定義|このコントロールにより、`CheckBox` 項目を個々に定義できます。
Orientation|`CheckBox` には、デフォルトの垂直と水平の 2 つの状態のいずれか 1 つを指定できます。
Mini|この `CheckBoxGroup` には、標準とコントロールを縮小できる 2 つの状態があります。
テーマ|`CheckBoxGroup` には標準の jQuery Mobile テーマがあります。






## <a id="features"></a> CheckBoxGroup MVC ラッパーの機能

### <a id="name"></a> グループ名の設定

[`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupModel~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。`CheckBox` コンテナーの上に表示されます。

![](images/02_CheckBoxGroupOverview_2.png)

### <a id="items"></a> 項目の定義

このコントロールにより、`CheckBox` 項目を個々に定義できます。詳細は、[CheckBox](CheckBox.html) のトピックをご覧ください。

### <a id="orientation"></a> 方向

`CheckBox` には、デフォルトの垂直と水平の 2 つの状態のいずれか 1 つを指定できます。

![](images/02_CheckBoxGroupOverview_3.png)

### <a id="mini"></a> Mini

この `CheckBoxGroup` には、標準とコントロールを縮小できる 2 つの状態があります。このメソッドはグループ全体に使用できますが、個々のチェック ボックス項目で上書きできます。

![](images/02_CheckBoxGroupOverview_4.png)

### <a id="theme"></a> テーマ

`CheckBoxGroup` には標準の jQuery Mobile テーマがあります。以下の図は、テーマ「a」が適用された `CheckBoxGroup` を示しています。このメソッドはグループ全体に使用できますが、個々の `CheckBox` 項目で上書きできます。

![](images/02_CheckBoxGroupOverview_5.png)



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CheckBoxGroup* の追加](Adding-CheckBoxGroup.html): このトピックでは、Infragistics MVC ラッパーを使用して `CheckBoxGroup` を有効にするために必要な情報を提供します。

- [*CheckBoxGroup* の構成](CheckBoxGroup-Configuring.html): このトピックでは、MVC ラッパーで `CheckBoxGroup` を構成するために必要な情報とリファレンス情報を紹介します。

- [*CheckBoxGroup* プロパティのリファレンス](CheckBoxGroup-Property-Reference.html): このトピックでは、`CheckBoxGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-checkbox-group/basic-usage): このサンプルでは、`CheckBoxGroup` の ASP.NET MVC ヘルパーの使用方法を紹介します。





 

 



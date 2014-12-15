<!--
|metadata|
{
    "fileName": "radiobuttongroup-configuring",
    "controlName": "RadioButtonGroup",
    "tags": ["Editing","MVC"]
}
|metadata|
-->

# RadioButtonGroup の構成


## トピックの概要
### 目的

このトピックには、MVC ラッパーを使用して `RadioButtonGroup` を構成するために必要な情報および参照が含まれています。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [RadioButtonGroup の概要](RadioButtonGroup-Overview.html): このトピックには、`RadioButtonGroup` MVC ラッパーに関連する情報が収められています。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**コントロールの構成の概要**](#config-summary)
-   [**水平方向の RadioButtonGroup**](#horizontal-group)
    -   [概要](#overview)
    -   [プロパティ設定](#property-settings)
    -   [コード例](#code-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="config-summary"></a>コントロールの構成の概要

以下の表は、`RadioButtonGroup` MVC ラッパーの構成可能な要素を示しています。

構成可能な点|詳細|プロパティ
---|---|---
水平方向の `RadioButtonGroup`|このサンプルでは、horizontal `RadioButtonGroup` を作成する方法を紹介します。|<ul><li>[水平方向](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Horizontal.html)</li></ul>


## <a id="horizontal-group"></a>水平方向の RadioButtonGroup
### <a id="overview"></a>概要

水平方向の `RadioButtonGroup` メソッドによって、デフォルトの `RadioButtonGroup` とはわずかに外観が異なるグループを定義できます。すべてのラジオ ボタンは水平に実際のボタンとして表示され、行にすべてのボタンを収める十分なスペースがない場合は、残りのボタンは次の行に表示されます。以下の画像は、水平方向の `RadioButtonGroup` の例を示しています。

![](images/04_RadioButtonGroupConfiguring_1.png)

### <a id="property-settings"></a>プロパティ設定

以下の表では、目的の構成をマップして、水平方向の `RadioButtonGroup` を表示しています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
`RadioButtonGroup` を水平方向に設定|[Horizontal](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Horizontal.html)|true


### <a id="code-example"></a>コード例

以下のコードを使用し、ボタンを水平に表示します。

**Razor の場合:**

```
@(
    Html.InfragisticsMobile()
    .RadioButtonGroup()
    .ID("rdbtngrp2")
    .Horizontal(true)
    .Mini(true)
    .SelectedIndex(1)
    .Items(item =>
    {
        item.RadioButton().ID("rdbtnKurt").Text("Kurt Vonnegut");
        item.RadioButton().ID("rdbtnCoelho").Text("Paolo Coelho"));
        item.RadioButton().ID("rdbtnPirsig").Text("Robert Pirsig");
    })
    .Render()
)
```



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [RadioButtonGroup の概要](RadioButtonGroup-Overview.html): このトピックには、`RadioButtonGroup` MVC ラッパーに関連する情報が収められています。

- [RadioButtonGroup の追加](Adding-RadioButtonGroup.html): このトピックには、Infragistics MVC ラッパーを使用して `RadioButtonGroup` を有効にするために必要な情報が含まれています。

- [RadioButtonGroup のプロパティ リファレンス](RadioButtonGroup-Property-Reference.html): このトピックでは、`RadioButtonGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。


### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-radiobutton-group/basic-usage): このサンプルでは、`RadioButtonGroup` を水平方向または垂直方向に描画する方法を紹介します。





 

 



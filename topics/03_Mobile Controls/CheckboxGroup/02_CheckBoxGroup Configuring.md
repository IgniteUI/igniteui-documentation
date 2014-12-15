<!--
|metadata|
{
    "fileName": "checkboxgroup-configuring",
    "controlName": "CheckBoxGroup",
    "tags": ["Editing","How Do I","MVC"]
}
|metadata|
-->

# CheckBoxGroup の構成

## トピックの概要

### 目的

このトピックでは、MVC ラッパーで `CheckBoxGroup` を構成するために必要な情報とリファレンス情報を紹介します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [*CheckBoxGroup* の概要](CheckBoxGroup-Overview.html): このトピックでは、`CheckBoxGroup` MVC ラッパーに関する情報を紹介します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [コントロールの構成の概要](#summary)
-   [水平の CheckBoxGroup](#horizontal)
-   [関連コンテンツ](#related-content)



## <a id="summary"></a> コントロールの構成の概要
以下の表は、`CheckBoxGroup` MVC ラッパーの構成可能な要素を示しています。

構成可能な点|詳細|プロパティ
----|----|----
Horizontal `CheckBoxGroup`|[`Horizontal`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Horizontal.html) メソッドは、`CheckBox` 項目を水平方向に表示する場合に使用します。|[Horizontal](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Horizontal.html)





## <a id="horizontal"></a> 水平の CheckBoxGroup

[`Horizontal`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Horizontal.html) メソッドは、チェック ボックス項目を水平方向に表示する場合に使用します。これは、`CheckBox` タイトルの名前が短く、1 行で収まる場合に便利です。以下の図は、水平 `CheckBoxGroup` の外観を示しています。

![](images/04_CheckBoxGroupConfiguring_1.png)

親コンテナー幅がすべての `CheckBox` 項目に対応できない場合は、項目は、次の図に示すように次の行に表示されます。

![](images/04_CheckBoxGroupConfiguring_2.png)

### プロパティ設定

以下の表では、水平 `CheckBoxGroup` を表示するために、目的の構成をマップしています。

目的:|使用するプロパティ:|設定の選択肢:
----|----|----
`CheckBoxGroup` の水平方向を設定する|[Horizontal](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Horizontal.html)|true



### コード例

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .CheckBoxGroup()
    .ID("chkbxgrp1")
    .Items(item => {
        item.CheckBox().ID("chk1").Text("Kia");
        item.CheckBox().ID("chk2").Text("VW");
        item.CheckBox().ID("chk3").Text("Audi");
        item.CheckBox().ID("chk4").Text("Porche");
        item.CheckBox().ID("chk5").Text("Volvo");
    })
    .Horizontal(true)
    .Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CheckBoxGroup* の概要](CheckBoxGroup-Overview.html): このトピックでは、`CheckBoxGroup` MVC ラッパーに関する情報を紹介します。

- [*CheckBoxGroup の追加*](Adding-CheckBoxGroup.html): このトピックでは、Infragistics MVC ラッパーを使用して `CheckBoxGroup` を有効にするために必要な情報を提供します。

- [*CheckBoxGroup* プロパティのリファレンス](CheckBoxGroup-Property-Reference.html): このトピックでは、`CheckBoxGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-checkbox-group/basic-usage): このサンプルでは、`CheckBoxGroup` の ASP.NET MVC ヘルパーの使用方法を紹介します。






 

 



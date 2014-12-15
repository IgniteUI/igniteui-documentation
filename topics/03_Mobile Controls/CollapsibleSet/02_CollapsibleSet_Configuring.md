<!--
|metadata|
{
    "fileName": "collapsibleset-configuring",
    "controlName": "CollapsibleSet",
    "tags": ["How Do I","Layouts","MVC"]
}
|metadata|
-->

# CollapsibleSet の構成

## トピックの概要

### 目的

このトピックでは、`CollapsibleSet`™ MVC ラッパーの構成方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [CollapsibleSet の概要](CollapsibleSet-Overview.html): このトピックでは、`CollapsibleSet` ウィジェットとその機能の概要について説明します。

- [*CollapsibleSet* の追加](CollapsibleSet-Adding.html): このトピックでは、Infragistics® Model-View-Controller (MVC) ラッパーを使用して Collapsible ウィジェットを有効にする方法をコード例を用いて説明します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**CollapsibleSet 構成の要点**](#summary )
-   [**状態アイコンの構成**](#state-icon)
    -   [プロパティ設定](#property-settings)
    -   [コード例](#example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="summary "></a> Collapsible 構成の要点

以下の表では、折り畳み可能 MVC ラッパーの構成可能な要素を紹介します。

構成可能な項目|詳細|プロパティ
--------------------|---------|-----------
[状態アイコン](#state-icon)|`CollapsibleSet` の論理状態アイコンは、位置とピクチャを構成できます。これらの点はそれぞれ、専用のプロパティで管理されます。|<ul><li>[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~IconPosition.html)</li><li>[ExpandedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~ExpandedIcon.html)</li><li>[CollapsedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~CollapsedIcon.html)</li></ul>



## <a id="state-icon"></a> 状態アイコンの構成
`CollapsibleSet` のアイコンでは、以下の要素を構成できます。

-   **位置** – ヘッダー上のアイコンの位置
-   **タイプ** – 展開状態と折り畳み状態を示すアイコンのピクチャ

これらの点はそれぞれ、専用のプロパティで管理されます。

### <a id="property-settings"></a> プロパティ設定

以下の表に、これらを管理するプロパティ設定に必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢: 
-------------|--------------------|-----------
アイコンの位置を設定する|[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~IconPosition.html)|以下のいずれかを指定<br /><ul><li> Left </li><li> Right </li><li> Top </li><li> Bottom </li></ul>
折り畳み状態のアイコン ピクチャを変更する|[CollapsedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~CollapsedIcon.html)|目的のイメージ([アイコン セット](http://jquerymobile.com/test/docs/buttons/buttons-icons.html)内のイメージのどれか)
展開状態のアイコン ピクチャを変更する|[ExpandedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~ExpandedIcon.html)|目的のイメージ([アイコン セット](http://jquerymobile.com/test/docs/buttons/buttons-icons.html)内のイメージのどれか)

### <a id="example"></a> コード例

以下のコード スニペットでは、右手の `CollapsibleSet` アイコンの設定方法と、展開アイコンと折り畳みアイコンの両方が矢印下と矢印左の操作でどのように変化するを紹介します。

> **折り畳み/展開アイコン**
>
> [`CollapsedIcon`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~CollapsedIcon.html)/[`ExpandedIcon`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleSetModel~ExpandedIcon.html) プロパティには jQuery Mobile 1.2 以上が必要です。

![](images/CollapsibleSet_Configuring_1.png)


**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .CollapsibleSet()
    .IconPosition(IconPositions.Right)
    .ExpandedIcon(DefaultIcons.DownArrow)
    .CollapsedIcon(DefaultIcons.LeftArrow)
    .BeginRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("First Collapsible")
    .BeginRender()
)
    This is the first content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("Second Collapsible")
    .BeginRender()
)
    This is the second content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .CollapsibleSet()
    .EndRender()
)
@(
 Html.InfragisticsMobile()
    .CollapsibleSet()
    .IconPosition(IconPositions.Right)
    .ExpandedIcon(DefaultIcons.DownArrow)
    .CollapsedIcon(DefaultIcons.LeftArrow)
    .BeginRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("First Collapsible")
    .BeginRender()
)
    This is the first content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("Second Collapsible")
    .BeginRender()
)
    This is the second content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .CollapsibleSet()
    .EndRender()
)
```

![](images/CollapsibleSet_Configuring_2.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .CollapsibleSet()
    .IconPosition(IconPositions.Right)
    .ExpandedIcon(DefaultIcons.DownArrow)
    .CollapsedIcon(DefaultIcons.LeftArrow)
    .BeginRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("First Collapsible")
    .BeginRender()
)
    This is the first content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("Second Collapsible")
    .BeginRender()
)
    This is the second content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .CollapsibleSet()
    .EndRender()
)
@(
 Html.InfragisticsMobile()
    .CollapsibleSet()
    .IconPosition(IconPositions.Right)
    .ExpandedIcon(DefaultIcons.DownArrow)
    .CollapsedIcon(DefaultIcons.LeftArrow)
    .BeginRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("First Collapsible")
    .BeginRender()
)
    This is the first content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("Second Collapsible")
    .BeginRender()
)
    This is the second content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .CollapsibleSet()
    .EndRender()
)
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [CollapsibleSet プロパティ リファレンス](CollapsibleSet-Property-Reference.html): このトピックでは、`CollapsibleSet` ウィジェットに関する参照情報について説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-collapsible-set/basic-usage): このサンプルでは、食品の注文フォームとして `CollapsibleSet` ASP.NET MVC ヘルパーを使用する方法を紹介します。すべての Collapsible コントロールが縮小可能なセットにグループ化されます。縮小可能なセットは一度に 1 つのみ展開されます。縮小可能なセットを展開すると、前に展開されたセットが縮小化されます。




 

 



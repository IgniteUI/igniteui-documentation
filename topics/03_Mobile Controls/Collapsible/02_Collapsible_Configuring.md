<!--
|metadata|
{
    "fileName": "collapsible-configuring",
    "controlName": "Collapsible",
    "tags": ["How Do I"]
}
|metadata|
-->

# Collapsible の構成

## トピックの概要

### 目的

このトピックでは、`Collapsible`™ ASP.NET MVC ラッパーの構成方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [*Collapsible* の概要](Collapsible-Overview.html): このトピックは、`Collapsible` ウィジェットおよびその機能の概要を説明します。

- [*Collapsible* の追加](Collapsible-Adding.html): このトピックでは、Infragistics® Model-View-Controller (MVC) ラッパーを使用して `Collapsible` ウィジェットを有効にする方法をコード例を用いて説明します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [Collapsible 構成の要点](#summary)
-   [Collapsible のデフォルト状態の変更](#default-state)
-   [ヘッダーのテキストの構成](#header-text)
-   [状態アイコンの構成](#state-icon)
-   [関連コンテンツ](#related-content)


## <a id="summary"></a> Collapsible 構成の要点

以下の表は、collapsible MVC ラッパーの構成可能な要素を示しています。

構成可能な項目|詳細|プロパティ
--------------------|---------|-----------
[*Collapsible* のデフォルト状態](#default-state)|`Collapsible` (Expanded/Collapsed) の論理状態は、[`Collapsed`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandCueText.html) プロパティで管理されます。このプロパティをウィジェットの初期化時に設定しておくことが、このウィジェットの既定状態を効率的に変更する方法です。|[Collapsed](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandCueText.html)
[ヘッダーのテキスト](#header-text)|ヘッダーのテキストは、[`HeaderText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~HeaderText.html) プロパティを使用して変更できます。|[HeaderText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~HeaderText.html)
[状態アイコン](#state-icon)|`Collapsible` の論理状態アイコンは、position および picture の面で構成できます。これらの点はそれぞれ、専用のプロパティで管理されます。|[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~IconPosition.html)<br />[ExpandedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandedIcon.html) <br />[CollapsedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~CollapsedIcon.html)




## <a id="default-state"></a> Collapsible のデフォルト状態の変更

`Collapsible` (Expanded/Collapsed) の論理状態は、[`Collapsed`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandCueText.html) プロパティで管理されます。このプロパティをウィジェットの初期化時に設定しておくことが、このウィジェットの既定状態を効率的に変更する方法です。

デフォルトでは、`Collapsible` は Collapsed 状態で初期化されています ([`Collapsed`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandCueText.html) プロパティが true)。

### プロパティ設定

以下の表では、collapsible を true 状態に初期化するために、目的の構成をマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
`Collapsible` 状態を設定する|[Collapsed](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandCueText.html)|*true* または *false*

### コード例

以下のコードは、[`Collapsed`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandCueText.html) プロパティを *false* に設定して初期化することで、`Collapsible` のデフォルト状態を変更する方法を示しています。

![](images/Collapsible_Configuring_1.png)

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("Custom Header")
    .Collapsed(false)
    .BeginRender()
)
    This is a collapsible content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
```



## <a id="header-text"></a> ヘッダーのテキストの構成

ヘッダーのテキストは、[`HeaderText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~HeaderText.html) プロパティを使用して構成されています。

### プロパティ設定

以下の表に、これらを管理するプロパティ設定に必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
ヘッダー テキストを設定する|[HeaderText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~HeaderText.html)|目的のテキスト文字列

### コード例

以下のコードは、[`HeaderText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~HeaderText.html) プロパティを設定して、Collapsible のデフォルト ヘッダー テキストを「My Group」 に変更する方法を示しています。

![](images/Collapsible_Configuring_2.png)

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("My Group")
    .BeginRender()
)
    This is a collapsible content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
```



## <a id="state-icon"></a> 状態アイコンの構成

`Collapsible` のアイコンは、以下の点について構成できます。

-   **位置** - ヘッダー上のアイコンの位置
-   **画像** - Expanded 状態と Collapsed 状態を示すためのアイコン画像

これらの点はそれぞれ、専用のプロパティで管理されます。

### プロパティ設定

以下の表では、希望の構成をプロパティ設定にマップしています。

<table class="table table-striped">
	<thead>
		<tr>
            <th> 目的: </th>
            <th> 使用するプロパティ: </th>
            <th> 設定値: </th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
アイコンの位置を設定する
			</td>
            <td>
[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~IconPosition.html)
			</td>
            <td>
                以下のいずれかを指定
                <ul>
                    <li> Left </li>
                    <li> Right </li>
                    <li> Top </li>
                    <li> Bottom	</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
折り畳み状態のアイコン ピクチャを変更する
			</td>
            <td>
[CollapsedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~CollapsedIcon.html)
			</td>
            <td>
目的のイメージ([アイコン セット](http://jquerymobile.com/test/docs/buttons/buttons-icons.html)内のイメージのどれか)
			</td>
        </tr>
        <tr>
            <td>
展開状態のアイコン ピクチャを変更する
			</td>
            <td>
[ExpandedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandedIcon.html)
			</td>
            <td>
目的のイメージ([アイコン セット](http://jquerymobile.com/test/docs/buttons/buttons-icons.html)内のイメージのどれか)
			</td>
        </tr>
    </tbody>
</table>


### コード例

以下のコード スニペットは、Collapsible アイコンを右に設定し、Expanded アイコンと Collapsed アイコンを下矢印と左矢印に変更する方法を示しています。

折り畳み/展開アイコン

> [`CollapsedIcon`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~CollapsedIcon.html)/[`ExpandedIcon`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandedIcon.html) プロパティには jQuery Mobile 1.2 以上が必要です。

![](images/Collapsible_Configuring_3.png)

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("My Group")
    .IconPosition("right")
    .CollapsedIcon("arrow-l")
    .ExpandedIcon("arrow-d")
    .BeginRender()
)
    This is a collapsible content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("My Group")
    .IconPosition("right")
    .CollapsedIcon("arrow-l")
    .ExpandedIcon("arrow-d")
    .BeginRender()
)
    This is a collapsible content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
```

![](images/Collapsible_Configuring_4.png)

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("My Group")
    .IconPosition("right")
    .CollapsedIcon("arrow-l")
    .ExpandedIcon("arrow-d")
    .BeginRender()
)
    This is a collapsible content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .HeaderText("My Group")
    .IconPosition("right")
    .CollapsedIcon("arrow-l")
    .ExpandedIcon("arrow-d")
    .BeginRender()
)
    This is a collapsible content
@(
    Html.InfragisticsMobile()
    .Collapsible()
    .EndRender()
)
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Collapsible* のプロパティ参照](Collapsible-Property-Reference.html): このトピックでは、`Collapsible` ウィジェットのプロパティに関する参照情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-collapsible/basic-usage): これは jQuery Mobile collapsible ウィジェットの ASP.NET MVC ヘルパーを紹介するサンプルです。






 

 



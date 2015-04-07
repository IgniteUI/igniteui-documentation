<!--
|metadata|
{
    "fileName": "button-configuring",
    "controlName": "Button",
    "tags": ["How Do I","MVC"]
}
|metadata|
-->

# Button の構成

## トピックの概要

### 目的

このトピックでは、MVC ラッパーを使用した Button を構成するために必要な情報とリファレンスを提供します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [*Button* の追加](Adding-Button.html): このトピックでは、Infragistics MVC ラッパーを使用した Button を有効にするために必要な情報を提供します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [コントロールの構成の概要](#summary)
-   [Mini と Inline ボタン](#mini-inline)
-   [ボタンの外観のカスタマイズ](#appearance)
-   [ボタン アイコンを構成](#icon)
-   [送信ボタンを作成](#submit)
-   [関連コンテンツ](#related-content)



## <a id="summary"></a> コントロールの構成の概要

以下の表では、ボタン MVC ラッパーの構成可能な要素を紹介します。

構成可能な点|詳細|プロパティ
---------------------|---------|-----------
Mini と Inline ボタン|このシナリオは、1 行に複数のボタンを配置するかどうかを判断するヒントです。|[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Mini.html)<br />[Inline](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Inline.html)
ボタンの外観のカスタマイズ|ボタン API のこの部分では、コントロールの外観を変更できます。|[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Corners.html)<br />[Shadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Shadow.html)<br />[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Theme.html)
ボタン アイコンを構成|ボタンには、いくつかの構成可能なプロパティを持ったアイコンを割り当てることができます。|[Icon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Icon.html) <br />[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~IconPosition.html) <br />[IconShadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~IconShadow.html)
送信ボタンを作成|ボタンは発信フォームに構成できます。|[IsSubmitButton](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~IsSubmitButton.html)





## <a id="mini-inline"></a> Mini と Inline ボタン

このシナリオは、1 行に複数のボタンを配置するかどうかを判断するヒントです。

![](images/04_ButtonConfiguring_1.png)

### プロパティ設定

以下の表は、1 行に複数のボタンを表示するための構成の対応表です。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
小さいボタンを作成|[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Mini.html)|true
インライン ボタンを作成|[Inline](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Inline.html)|true

### コード例

以下のコードでは、1 行に 2 つのミニ ボタンを設定する方法を紹介します。

**C# の場合:**

```csharp
@(Html.InfragisticsMobile()
	.Button()
	.ID("btnOK")
	.Mini(true)
	.Inline(true)
	.Text("OK")
	.Render())
    
@(Html.InfragisticsMobile()
	.Button()
	.ID("btnCancel")
	.Mini(true)
	.Inline(true)
	.Text("Cancel")
	.Render())
```



## <a id="appearance"></a> ボタンの外観のカスタマイズ

以下のシナリオでは、ボタンの外観をデフォルトの外観とは異なる外観に変更するときに役立つヒントを紹介します。

![](images/04_ButtonConfiguring_2.png)

### プロパティ設定

以下の表は、ボタンの外観を変更するための構成の対応表です。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
角丸を無効にする|[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Corners.html)|false
シャドウを有効にする|[Shadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Shadow.html)|true
jQuery Mobile テーマ b を設定する|[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Theme.html)|b


### コード例

以下のコードは、ボタン メソッドと変更制御外観の設定方法を紹介します。

**C# の場合:**

```csharp
@(Html.InfragisticsMobile()
    .Button()
    .ID("btn1")
    .Corners(false)
    .Shadow(true)
    .Theme("b")
    .Text("Customized Button")
    .Render())
```



## <a id="icon"></a> ボタン アイコンを構成

ボタンには、構成可能なプロパティがいくつかある jQuery Mobile [ボタン アイコン](http://jquerymobile.com/demos/1.1.1/docs/buttons/buttons-icons.html)を構成できます。

![](images/04_ButtonConfiguring_3.png)

### プロパティ設定

以下の表は、ボタン アイコンを設定する構成の対応表です。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
グリッド アイコンを使用|[Icon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~Icon.html)|"grid"
アイコンの位置を設定|[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~IconPosition.html)|"right"
アイコン シャドウを有効にする|[IconShadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~IconShadow.html)|true


### コード例

以下のコードでは、ボタン アイコンを構成して有効にする方法を紹介します。

**C# の場合:**

```csharp
@(Html.InfragisticsMobile()
    .Button()
    .ID("btn1")
    .Icon(DefaultIcons.Grid)
    .IconPosition(IconPositions.Right)
    .IconShadow(true)
    .Text("Icon")
    .Render())
```



## <a id="submit"></a> 送信ボタンを作成

ボタンは発信フォームに構成できます。デフォルトで、ボタンは HTML スパン要素としてレンダリングされます。

![](images/04_ButtonConfiguring_4.png)

### プロパティ設定

以下の表は、送信ボタンをレンダリングする構成の対応表です。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
送信ボタンをレンダリングする|[IsSubmitButton](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ButtonWrapper~IsSubmitButton.html)|true


### コード例

以下のコードは、上の図の結果を得るために設定できるその他メソッドを追加します。

**C# の場合:**

```csharp
@(Html.InfragisticsMobile()
    .Button()
    .ID("btn1")
    .Mini(true)
    .Inline(true)
    .Icon(DefaultIcons.Check)
    .IconPosition(IconPositions.Right)
    .IsSubmitButton(true)
    .Text("Submit")
    .Theme("e")
    .Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Button* の概要](Button-Overview.html): このトピックでは、MVC Button コントロール ラッパーとその主な機能を紹介します。

- [*Button* の追加](Adding-Button.html): このトピックでは、Infragistics MVC ラッパーを使用した Button を有効にするために必要な情報を提供します。

- [*Button* のプロパティ リファレンス](Button-Property-Reference.html): このトピックでは、Button MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-button/basic-usage): このサンプルでは、Button の ASP.NET MVC ヘルパーの表示オプションを紹介します。





 

 



<!--
|metadata|
{
    "fileName": "checkbox-configuring",
    "controlName": "CheckBox",
    "tags": ["Editing","How Do I","MVC"]
}
|metadata|
-->

# CheckBox の構成

## トピックの概要

### 目的

このトピックでは、MVC ラッパーを使用した `CheckBox` を構成する際に必要な情報とリファレンスを提供します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [CheckBox の概要](CheckBox-Overview.html): このトピックでは、MVC `CheckBox` コントロール ラッパーとその主な機能を紹介します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [コントロールの構成の概要](#summary)
-   [CheckBox の外観のカスタマイズ](#appearance)
-   [ネイティブ CheckBox](#native)
-   [関連コンテンツ](#related-content)



## <a id="summary"></a> コントロールの構成の概要

以下の表は、`CheckBox` MVC ラッパーの構成可能な要素を示しています。

構成可能な点|詳細|プロパティ
---------------------|---------|-----------
CheckBox の外観のカスタマイズ|MVC CheckBox ラッパーには、その API にコントールの外観を構成できるメソッドがあります。|[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Mini.html)<br />[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Theme.html)
ネイティブ CheckBox|デフォルトの HTML CheckBox の外観を設定する|[UseNative](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Theme.html)





## <a id="appearance"></a> CheckBox の外観のカスタマイズ

MVC CheckBox ラッパーには、その API にコントールの外観を構成できるメソッドがあります。

![](images/04_CheckBoxConfiguring_1.png)

### プロパティ設定

以下の表では、チェックボックスの外観を構成するために、目的の構成をマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
CheckBox のサイズを制限する|[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Mini.html)|true
jQuery Mobile テーマを設定する|[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Theme.html)|b


### コード例

以下のコードは、`CheckBox` の外観をカスタマイズする方法を示しています。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .CheckBox()
    .ID("chkbx1")
    .Text("Agree License")
    .Mini(true)
    .Theme("b")
    .Render())
```



## <a id="native"></a> ネイティブ CheckBox

デフォルトで、jQuery Mobile は型が `CheckBox` の通常の入力を変更し、モバイル デバイスに使用できるようにします。しかし、必要な場合 MVC `CheckBox` ラッパーにより基本的な HTML `CheckBox` の外観を復元できます。

![](images/04_CheckBoxConfiguring_2.png)

### プロパティ設定

以下の表では、`CheckBox` の true 状態のテキストを「Enable」に設定するために、使用する理想的な構成をマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
デフォルトの HTML `CheckBox` の外観を設定する|[UseNative](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxWrapper~Theme.html)|true



### コード例

以下のコードは、基本的な HTML `CheckBox` の外観を設定する方法を示しています。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .CheckBox()
    .ID("check1")
    .UseNative(true)
    .Text("Native CheckBox")
    .Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CheckBox* の概要](CheckBox-Overview.html): このトピックには、`CheckBox` MVC ラッパーに関連する情報が収められています。

- [*CheckBox の追加*](Adding-CheckBox.html): このトピックには、Infragistics MVC ラッパーを使用して `CheckBox` を有効にするために必要な情報が含まれています。

- [*CheckBox* プロパティ参照](CheckBox-Property-Reference.html): このトピックでは、`CheckBox` MVC ラッパーのプロパティに関するリファレンス情報を提供します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-checkbox-group/basic-usage): このサンプルでは、`CheckBoxGroup` の ASP.NET MVC ヘルパーの使用方法を紹介します。





 

 



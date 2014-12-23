<!--
|metadata|
{
    "fileName": "navbar-property-reference",
    "controlName": "NavBar",
    "tags": ["API","MVC","Navigation"]
}
|metadata|
-->

# NavBar のプロパティ参照

## トピックの概要

### 目的

このトピックでは、`NavBar` MVC ラッパーのプロパティに関するリファレンス情報を紹介します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [*NavBar* の概要](NavBar-Overview.html): このトピックでは、`NavBar` MVC ラッパーに関する情報を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**NavBar MVC ラッパー (プロパティ) のリファレンス**](#reference)
-   [**NavBar 項目 MVC ラッパー (プロパティ) のリファレンス**](#item-reference)



## NavBar MVC ラッパー (プロパティ) のリファレンス

このトピックでは、`NavBar` MVC ラッパーのプロパティに関するリファレンス情報を紹介します。


以下の表では、`NavBar` MVC ラッパーのプロパティを説明し、デフォルト値と推奨値をリストします。

> **Null 値**
>
> 既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細については、[NavBar](http://jquerymobile.com/demos/1.1.1/docs/toolbars/docs-navbar.html) を参照してください。


### NavBar (プロパティ) リファレンス チャート

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarWrapper~ID.html)|string|`NavBar` ID を取得または設定します。|navbar1
[Items](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarWrapper~Items.html)|ラムダ式|すべての `NavBar` 項目を定義します。個々の NavBar 項目の構成方法については、次のパラグラフの表を参照してください。|item => { item.NavBarItem().Text(“Home”); }
[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarWrapper~IconPosition.html)|string|[icon](http://api.jquerymobile.com/icons/) を取得または設定します。|**“right”** <br />“left” <br />“top” <br />“bottom”
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarWrapper~Theme.html)|string|`NavBar` テーマを取得または設定します。|**null** <br />“a”<br />“b”<br />“c”<br />“d”<br />“e”
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarWrapper~HtmlAttributes.html)|IDictionary<string,object>|HTML の追加属性を設定します。|new Dictionary<string, object>() { {"disabled", "disabled"} }






## NavBar 項目 MVC ラッパー (プロパティ) のリファレンス
このトピックでは、`NavBar` MVC ラッパー から取得するプロパティに関する参照情報を紹介します。


以下の表では、`NavBar` MVC ラッパーから取得したメソッドを説明し、デフォルト値と推奨値をリストします。

> **Null 値**
>
> 既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細については、[NavBar](http://jquerymobile.com/demos/1.1.1/docs/toolbars/docs-navbar.html) を参照してください。



### NavBar 項目 (プロパティ) のリファレンス チャート

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarItemWrapper~Text.html)|string|`NavBar` 項目テキストを取得または設定します。|Home
[NavigateUrl](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarItemWrapper~NavigateUrl.html)|string|`NavBar` 項目参照を取得または設定します。|"http://www.infragistics.com"
[Items](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarItemWrapper~NavBarItem.html)|ラムダ式|すべての子 `NavBar` 項目を定義します。|item => { item.NavBarItem().Text(“Home”); }
[Icon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarItemWrapper~Icon.html)|string|[icon](http://api.jquerymobile.com/icons/) を取得または設定します。|“arrow-l” <br />“delete” <br />“plus” <br />“minus” <br />“check” <br />“gear”
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarItemWrapper~Theme.html)|string|`NavBar` 項目テーマを取得または設定します。テーマが項目別に設定されていない場合、`NavBar` ラッパーに定義された総合的テーマを使用します。|**null**<br />“a”<br />“b”<br />“c”<br />“d”<br />“e”
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.NavBarItemWrapper~HtmlAttributes.html)|IDictionary<string,object>|その他の HTML 属性を `NavBar` 項目に設定します。|new Dictionary<string, object>() { {"disabled", "disabled"} }





 

 



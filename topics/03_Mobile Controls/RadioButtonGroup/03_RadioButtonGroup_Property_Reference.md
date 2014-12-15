<!--
|metadata|
{
    "fileName": "radiobuttongroup-property-reference",
    "controlName": "RadioButtonGroup",
    "tags": ["Editing","MVC"]
}
|metadata|
-->

# RadioButtonGroup のプロパティ リファレンス

## RadioButtonGroup MVC ラッパー (プロパティ) の参照
### 概要

このトピックでは、`RadioButtonGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。

### RadioButtonGroup (プロパティ) 参照チャート

以下の表は、`RadioButtonGroup` MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

> null 値: 既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細は以下をご覧ください。

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~ID.html)|文字列|`RadioButtonGroup` ID を取得または設定します。|rdbtngrp1
[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Text.html)|文字列|`RadioButtonGroup` のテキストを取得または設定します。|“RadioButtonGroup”
[Items](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Items.html)|Action<[RadioButtonModelsBuilder](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonModelsBuilder.html)>|グループに属するすべてのラジオ ボタンを定義します。Radio Button メソッドについては、次の表を参照してください。|`item => { item.RadioButton().ID("rdbtnKurt").Text( "Kurt"); item.RadioButton().ID("rdbtnPirsig").Text( "Pirsig"); }`
[SelectedIndex](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~SelectedIndex.html) |int|グループの選択したインデックスを取得または設定します。|0<br>1<br>2
[Horizontal](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Horizontal.html)|bool|グループが水平または垂直のいずれであるかを指定します。|**false** <br>true
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Mini.html)|bool?|`RadioButtonGroup` のサイズ状態を有効または無効にします。|**null**
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~Theme.html)|文字列|`RadioButtonGroup` のテーマを取得または設定します。|**null**<br>“a”<br>“b”<br>“c” <br>“d”<br>“e”


### ラジオボタン (プロパティ) の参照チャート

以下の表は、RadioButton MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

>null 値: 既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細は以下をご覧ください。

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonWrapper~ID.html)|文字列|Radio Button ID を取得または設定します。|buttonID
[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonWrapper~Text.html)|文字列|Radio Button のテキストを取得または設定します。|Button
[Selected](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonWrapper~Selected.html) |bool|選択された値を取得または設定します。|**false**<br>true
[UseNative](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonGroupWrapper~UseNative.html)|bool|RadioButton のネイティブ HTML の外観を有効または無効にします。|**false**<br>true
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonWrapper~Mini.html)|bool?|Radio Button のサイズ状態を有効/無効にします。|**null**<br>true<br>false
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonWrapper~Theme.html)|文字列|Radio Button のテーマを取得または設定します。|**null**<br>“a”<br>“b”<br>“c”<br>“d”<br>“e”
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.RadioButtonWrapper~HtmlAttributes.html)|IDictionary<string,object>|HTML の追加属性を設定します。|`new Dictionary<string, object>() { {"disabled", "disabled"} }`






 

 



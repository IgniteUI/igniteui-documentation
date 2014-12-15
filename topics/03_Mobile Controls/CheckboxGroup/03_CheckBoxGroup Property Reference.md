<!--
|metadata|
{
    "fileName": "checkboxgroup-property-reference",
    "controlName": "CheckBoxGroup",
    "tags": ["API","Editing","MVC"]
}
|metadata|
-->

# CheckBoxGroup プロパティのリファレンス



## CheckBoxGroup MVC ラッパー (プロパティ) の参照

このトピックでは、`CheckBoxGroup` MVC ラッパーのプロパティに関するリファレンス情報を提供します。

以下の表は、`CheckBoxGroup` MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

**Null 値**

> 既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細は、[CheckBoxGroup](http://jquerymobile.com/test/docs/forms/checkboxes/) をご覧ください。

### CheckBoxGroup (プロパティ) 参照チャート

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~ID.html)|文字列||CheckBoxGroupID
[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Text.html)|文字列|`CheckBoxGroup` のテキストを取得または設定します。|Group
[Items](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Items.html) |ラムダ式|グループの部分であるすべてのチェックボックスを定義します。|item => { item.CheckBox().ID("chk1").Text("Text"); }
[Horizontal](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Horizontal.html)|bool|Horizontal `CheckBoxGroup` を有効または無効にします。|**false**
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Mini.html)|bool?|`CheckBox` グループのサイズ状態を有効または無効にします。|**null**
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CheckBoxGroupWrapper~Theme.html)|文字列|`CheckBox` のテーマを取得または設定します。|**null** “a” “b” “c” “d” “e”






 

 



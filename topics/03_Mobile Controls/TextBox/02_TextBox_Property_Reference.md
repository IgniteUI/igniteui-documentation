<!--
|metadata|
{
    "fileName": "textbox-property-reference",
    "controlName": "TextBox",
    "tags": ["API","Editing","MVC"]
}
|metadata|
-->

# TextBox プロパティのリファレンス

## TextBox ASP.NET MVC ヘルパー プロパティのリファレンス
### 概要

このトピックでは、TextBox ASP.NET MVC ヘルパーのプロパティのリファレンス情報を紹介します。

### TextBox プロパティのリファレンス チャート

以下の表では、`TextBox` ASP.NET MVC ヘルパーのプロパティを説明し、デフォルト値と推奨値をリストします。

>**Null 値**: プロパティがデフォルトの null 値のとき、ウィジェットはjQuery モバイル デフォルト設定でレンダリングされます。詳細については、[textinput](http://jquerymobile.com/demos/1.1.1/docs/forms/textinputs/) を参照してください。

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~ID.html)|string|`TextBox` ID を取得または設定します。|“txtbx1”
[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Text.html)|string|`TextBox` テキストを取得または設定します。|“Search…” <br>“Type your search here…”
[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Disabled.html)|bool|`TextBox` を無効にするかどうかを取得または設定します。無効の場合、`TextBox` は読み取り専用で、テキストは無効スタイルで表示されます。|true<br>**false**
[Mode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Mode.html) |[TextEditorTextMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextEditorTextMode.html) |`TextBox` には、Text、Multiline、Password、Search など複数のモードがあります。|TextEditorTextMode.Text <br>TextEditorTextMode.Multiline <br>TextEditorTextMode.Password <br>TextEditorTextMode.Search
[ClearSearchButtonText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~ClearSearchButtonText.html) |string|`TextBox` [TextEditorTextMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextEditorTextMode.html) の値をタイプ Search から取得した場合、テキストを入力すると、検索フィールドに閉じるボタンが表示されます。このプロパティは、閉じるボタンをホバーするとツールチップとして表示されたテキストを取得または設定します。|Clear<br>Clear Search
[UseNative](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~UseNative.html)|bool|`TextBox` のネイティブ外観を有効にするか、無効にします。|**false**<br>true
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Label.html)|string|`TextBox` ラベルを取得または設定します。|TextBox Label
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~HideLabel.html)|bool?|`TextBox` ラベルの表示か非表示を設定します。|**null**
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Mini.html)|bool?|`TextBox` のサイズ状態を有効にするか、無効にします。|**null**
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~Theme.html)|string|`TextBox` テーマを取得または設定します。|**null**<br>“a”<br>“b”<br>“c”<br>“d”<br>“e”
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.TextBoxWrapper~HtmlAttributes.html)|IDictionary<string, object>|HTML の追加属性を設定します。|`new Dictionary<string, object>() { {"disabled", "disabled"} }`


## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [TextBox の概要](TextBox-Overview.html): このトピックでは、`TextBox` MVC ヘルパーに関する情報を紹介します。

- [追加](AddingTextBox.html): このトピックでは、Infragistics ASP.NET MVC ヘルパーで `TextBox` を有効にするのに必要な情報を紹介します。


### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-textbox/basic-usage): このサンプルでは、`TextBox` ASP.NET MVC ヘルパーを使用していくつかのタイプの入力フィールドを定義する方法を示します。





 

 



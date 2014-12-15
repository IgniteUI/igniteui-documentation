<!--
|metadata|
{
    "fileName": "page-property-reference",
    "controlName": "Page",
    "tags": ["API","Layouts","MVC"]
}
|metadata|
-->

# Page プロパティ参照

このトピックでは、Page MVC ラッパーのプロパティに関する参照情報について説明します。*

## Page (プロパティ) リファレンス チャート

Page MVC ラッパーのプロパティに関する説明を次の表にまとめ、各プロパティの既定値と推奨値を示します。

> **注:** 既定値が `null` になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細については、jQuery モバイルの [Page](http://jquerymobile.com/demos/1.1.1/docs/pages/index.html) を参照してください。

プロパティ|タイプ|説明|値 (**デフォルト値は太字です**)
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~ID.html)|文字列|Page の ID を取得または設定します。|“**PageID**”
[Title](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~Title.html) |文字列|Page のタイトルを取得または設定します。|Page
[Url](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~Url.html) |文字列|Page の URL を取得または設定します。1 つのビューにいくつもの Page を定義するときには、このプロパティが非常に役立ちます。このプロパティを使用すると、Page 間の切り替えがスムーズになります。|**http://infragistics.com**
[DomCache](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~DomCache.html)|bool|Page のキャッシュを有効にします。このプロパティの詳細については、[previously-visited](http://jquerymobile.com/demos/1.1.1/docs/pages/index.html) ページを読み返してください。|**false**
[AddBackButton](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~AddBackButton.html)|bool|Page の戻るボタンを追加または削除します。|**false**
[BackButtonText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~BackButtonText.html)|文字列|Page の戻るボタンのテキストを取得または設定します。|Back
[CloseButtonText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~CloseButtonText.html)|文字列|Page を閉じるボタンのテキストを取得または設定します。|X
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageWrapper~Theme.html)|文字列|Page のテーマを取得または設定します。|**null** “a” “b” “c” “d” “e”
[BackButtonTheme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~BackButtonTheme.html)|文字列|戻るボタンのテーマを取得または設定します。|“a” “b” **“c”** “d” “e”
[OverlayTheme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~OverlayTheme.html) |文字列|ダイアログ内で Page を開いたときに表示されるオーバーレイ ボタンのテーマを取得または設定します。|“a” “b” **“c”** “d” “e”
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageWrapper~HtmlAttributes.html)|IDictionary<string,object>|HTML の追加属性を設定します。|new Dictionary<string, object>() { {"disabled", "disabled"} }






 

 



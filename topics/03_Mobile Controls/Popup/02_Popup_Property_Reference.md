<!--
|metadata|
{
    "fileName": "popup-property-reference",
    "controlName": "Popup",
    "tags": ["Layouts","MVC"]
}
|metadata|
-->

# Popup のプロパティ リファレンス



## Popup MVC ラッパー (プロパティ) 参照

このトピックでは、`Popup` MVC ラッパーのプロパティに関する参照情報について説明します。

下の表は、`Popup` MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

> **Null 値**
>
> 既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細は、[ポップアップ](http://jquerymobile.com/demos/1.2.0-rc.2/docs/pages/popup/index.html)をご覧ください。


### Popup (プロパティ) 参照チャート

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~ID.html)|文字列|`Popup` ID を取得または設定します。|**“PopupID”**
[PositionTo](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~PositionTo.html) |object/string|`Popup` が表示される位置を取得または設定します。このプロパティはどの jQuery セレクターでも承諾できます。指定された要素の中央に配置されます。このセレクターは、ポップアップをリンクの中央に配置して開く「origin」およびポップアップをウィンドウの中央に配置する「window」を承諾します。|$(“#targetElementID”)<br />origin<br />window
[Tolerance](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~Tolerance.html) |int|親ウィンドウからの最小許容値をピクセル単位で定義します。整数値または文字列値のいずれかを使用できますが、いくつの値を定義するかによって、ビヘイビアーは異なります。右の列を参照するか、[Popup の概要](Popup-overview.html)に従ってこれについての詳細情報を確認します。|Tolerance(100,150,100,200)<br />Tolerance(100,150)<br />Tolerance(100)
[Transition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~Transition.html)|文字列|[`Popup`] ウィンドウを表示している場合に[トランジション](http://jquerymobile.com/demos/1.0a4.1/docs/pages/docs-transitions.html)を取得または設定します。|slide<br />“slideup”<br />“slidedown”<br />“pop”<br />“fade”<br />“flip”
[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~Corners.html)|bool?|丸みのある `Popup` コーナーを有効または無効にします。|**null**<br />true<br />false
[Shadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~Shadow.html)|bool?|`Popup` シャドウを有効または無効にします。|**null**<br />true<br />fasle
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~Theme.html)|文字列|`Popup` のテーマを取得または設定します。|**null**<br />“a”<br />“b”<br />“c”<br />“d”<br />“e”
[OverlayTheme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~OverlayTheme.html)|文字列|`Popup` を開いている場合に、オーバーレイ `Popup` テーマを取得または設定します。|“a” <br />“b”<br />**“c”** <br />“d”<br />“e”
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~PositionTo.html)|IDictionary<string,object>|その他の HTML 属性を設定します。|new Dictionary<string, object>() { {"disabled", "disabled"} }



 

 



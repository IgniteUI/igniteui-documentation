<!--
|metadata|
{
    "fileName": "pagefooter-property-reference",
    "controlName": "PageFooter",
    "tags": ["API","Layouts","MVC"]
}
|metadata|
-->

# PageFooter プロパティのリファレンス
このトピックでは、PageFooter MVC ラッパーのプロパティに関する参照情報を紹介します。

## PageFooter MVC ラッパー (プロパティ) 参照
下の表は、PageFooter MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

> **注:** 詳細は、<a href="http://jquerymobile.com/demos/1.1.1/docs/toolbars/docs-footers.html">jQuery Mobile</a> をご覧ください。

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageFooterWrapper~ID.html)|string|PageFooter の ID を取得または設定します。|“**PageContentID**”
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageFooterWrapper~Theme.html)|string|PageFooter のテーマを取得または設定します。|**“a”** “b” “c” “d” “e”
[FixedOptions](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageFooterWrapper~FixedOptions.html) |Action<[FixedToolBarOptionsWrapper](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper.html)>|フッターを配置し、構成できるメソッドのセット。詳細は、[Fixed Options](#_Fixed_Options) クラスのメソッドを説明した以下の表をご覧ください。|option => { option.DisablePageZoom(true).Fixed(true); }
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageFooterWrapper~HtmlAttributes.html)|IDictionary<string,object>|HTML の追加属性を設定します。|new Dictionary<string, object>() { {"disabled", "disabled"} }


## Fixed Options MVC ラッパー (プロパティ) 参照
下の表は、Fixed Options MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

> **注:**: プロパティがデフォルトの null 値のとき、ウィジェットはjQuery モバイル デフォルト設定でレンダリングされます。詳細は、[固定位置](http://jquerymobile.com/test/docs/toolbars/bars-fixed-options.html)をご覧ください。

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[Fixed](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~Fixed.html) |bool|コンテナーの固定配置を有効または無効にします。|**null** “a” “b” “c” “d” “e”
[DisablePageZoom](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~DisablePageZoom.html) |bool?|ページの拡大/縮小機能を有効または無効にします。|**null**, true, false
[FullScreen](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~FullScreen.html) |bool?|全画面表示で固定ツールバーを表示するかしないかを有効または無効にします。|**null** true false
[TapToggle](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~TapToggle.html) |bool?|画面をタップまたはマウスをクリックして、ツールバーの表示を切り替えるユーザー機能を有効または無効にします。|**null** true false
[TapToggleBlackList](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~TapToggleBlacklist.html) |string|タップしたときに、ツールバーを切り替えない jQuery セレクターのリスト。|**"a, button,**  **input, select, textarea, .ui-header-fixed, .ui-footer-fixed"**
[HideDuringFocus](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~HideDuringFocus.html) |string|固定ツールバーの場合は除き、フォーカスされているときにツールバーを非表示にする jQuery セレクターのリスト。|**input、select、textarea**
[Transition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~Transition.html)|string|固定ツールバーを表示および非表示にしているときに使用する[切り替え](http://jquerymobile.com/demos/1.0a4.1/docs/pages/docs-transitions.html)を取得または設定します。|**“slide”** "slideup" "slidedown" "pop" "fade" "flip"
[UpdatePagePadding](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~UpdatePagePadding.html) |bool?|親ページを表示しているときに、ツールバーを表示するかどうかを決定します。|**null** true false
[VisilbeOnPageShow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~VisibleOnPageShow.html) |bool?|親が表示されているときに、ツールバーを表示するかどうかを決定します。|**null** true false

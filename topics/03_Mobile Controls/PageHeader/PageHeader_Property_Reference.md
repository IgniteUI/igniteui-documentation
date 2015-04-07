<!--
|metadata|
{
    "fileName": "pageheader-property-reference",
    "controlName": "PageHeader",
    "tags": ["API","Layouts","MVC"]
}
|metadata|
-->

# PageHeader のプロパティ参照



## PageHeader MVC ラッパー (プロパティ) 参照
### 概要

このトピックでは、PageHeader MVC ラッパーのプロパティに関する参照情報を提供します。

### PageHeader (プロパティ) 参照チャート
下の表は、PageHeader MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

> **注:** 詳細は、[jQuery Mobile](http://jquerymobile.com/demos/1.1.1/docs/toolbars/docs-headers.html) をご覧ください。

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageHeaderWrapper~ID.html)|string|PageHeader の ID を取得または設定します。|“**PageContentID**”
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageHeaderWrapper~Theme.html)|string|PageHeader のテーマを取得または設定します。|**“a”** “b” “c” “d” “e”
[FixedOptions](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageHeaderWrapper~FixedOptions.html)|Action<[FixedToolBarOptionsWrapper](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper.html)>|ヘッダーの配置および構成を可能にするメソッドのセット。詳細は、[Fixed Options](#fixed-options) クラスのメソッドを説明した以下の表をご覧ください。|option => { option.DisablePageZoom(true).Fixed(true); }
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageHeaderWrapper~HtmlAttributes.html)|IDictionary<string,object>|HTML の追加属性を設定します。|new Dictionary<string, object>() { {"disabled", "disabled"} }

##  <a id="fixed-options"></a> Fixed Options MVC ラッパー (プロパティ) 参照
### 概要

このトピックでは、*Fixed Options* *MVC ラッパー**のプロパティに関する参照情報について説明します。*

#### PageHeader (プロパティ) 参照チャート

下の表は、Fixed Options MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

> **注:** 既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細は、[固定位置](http://jquerymobile.com/test/docs/toolbars/bars-fixed-options.html)をご覧ください。

<table cellspacing="0" cellpadding="0" class="table table-bordered">
                        <tbody>
                            <tr>
                                <th>
                                    <p>プロパティ</p>
                                </th>

                                <th>
                                    <p>タイプ</p>
                                </th>

                                <th>
                                    <p>説明</p>
                                </th>

                                <th>
                                    <p>値 (<span class="ig-bold">デフォルト値</span>)</p>
                                </th>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~Fixed.html">Fixed</a></span></p>
                                </td>

                                <td>
                                    <p>bool</p>
                                </td>

                                <td>
                                    <p>コンテナーの固定配置を有効または無効にします。</p>
                                </td>

                                <td>
                                    <p><b>null</b></p>

                                    <p>“a”</p>

                                    <p>“b”</p>

                                    <p>“c”</p>

                                    <p>“d”</p>

                                    <p>“e”</p>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~DisablePageZoom.html">DisablePageZoom</a></span></p>
                                </td>

                                <td>
                                    <p>bool?</p>
                                </td>

                                <td>
                                    <p>ページの拡大/縮小機能を有効または無効にします。</p>
                                </td>

                                <td>
                                    <p><b>null</b></p>

                                    <p>true</p>

                                    <p>false</p>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~FullScreen.html">FullScreen</a></span></p>
                                </td>

                                <td>
                                    <p>bool?</p>
                                </td>

                                <td>
                                    <p>全画面表示で固定ツールバーを表示するかしないかを有効または無効にします。</p>
                                </td>

                                <td>
                                    <p><b>null</b></p>

                                    <p>true</p>false
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~TapToggle.html">TapToggle</a></span></p>
                                </td>

                                <td>
                                    <p>bool?</p>
                                </td>

                                <td>
                                    <p>画面をタップまたはマウスをクリックして、ツールバーの表示を切り替えるユーザー機能を有効または無効にします。</p>
                                </td>

                                <td>
                                    <p><b>null</b></p>

                                    <p>true</p>false
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~TapToggleBlacklist.html">TapToggleBlackList</a></span></p>
                                </td>

                                <td>
                                    <p>string</p>
                                </td>

                                <td>
                                    <p>タップしたときに、ツールバーを切り替えない jQuery セレクターのリスト。</p>
                                </td>

                                <td><b>"a, button,</b> <b>input, select, textarea, .ui-header-fixed, .ui-footer-fixed"</b></td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~HideDuringFocus.html">HideDuringFocus</a></span></p>
                                </td>

                                <td>
                                    <p>string</p>
                                </td>

                                <td>
                                    <p>固定ツールバーの場合は除き、フォーカスされているときにツールバーを非表示にする jQuery セレクターのリスト。</p>
                                </td>

                                <td><b>"input, select, textarea"</b></td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~Transition.html">Transition</a></span></p>
                                </td>

                                <td>
                                    <p>string</p>
                                </td>

                                <td>
                                    <p>固定ツールバーを表示および非表示にしているときに使用する <a href="http://jquerymobile.com/demos/1.0a4.1/docs/pages/docs-transitions.html">transition</a> を取得または設定します。</p>
                                </td>

                                <td>
                                    <p><span class="ig-bold">“slide”</span></p>

                                    <p><span>"slideup"</span></p>

                                    <p><span>"slidedown"</span></p>

                                    <p><span>"pop"</span></p>

                                    <p><span>"fade"</span></p>

                                    <p><span>"flip"</span></p>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~UpdatePagePadding.html">UpdatePagePadding</a></span></p>
                                </td>

                                <td>
                                    <p>bool?</p>
                                </td>

                                <td>
                                    <p>親ページを表示しているときに、ツールバーを表示するかどうかを決定します。</p>
                                </td>

                                <td>
                                    <p><b>null</b></p>

                                    <p>true</p>false
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <p class="ig-api-link"><span class="ig-api-link"><a href="Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.FixedToolBarOptionsWrapper~VisibleOnPageShow.html">VisibleOnPageShow</a></span></p>
                                </td>

                                <td>
                                    <p>bool?</p>
                                </td>

                                <td>
                                    <p>親が表示されているときに、ツールバーを表示するかどうかを決定します。</p>
                                </td>

                                <td>
                                    <p><b>null</b></p>

                                    <p>true</p>false
                                </td>
                            </tr>
                        </tbody>
</table>

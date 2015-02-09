<!--
|metadata|
{
    "fileName": "page-configuring",
    "controlName": "Page",
    "tags": ["How Do I","Layouts","MVC"]
}
|metadata|
-->

# Page の構成

## トピックの概要
### 目的

このトピックでは、MVC ラッパーを使用して Page を構成する場合に必要な情報と参照について説明します。

### 前提条件
このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Page の概要](Page-Overview.html): このトピックでは、Page MVC ラッパーに関連する情報について説明します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**コントロールの構成の概要**](#control-config)
-   [**Page ボタンの追加**](#add-page-buttons)
	-   [概要](#overview)
    -   [プロパティ設定](#property-settings)
    -   [コード例](#code-example)
-   [**Page のキャッシュ**](#cache-page)
	-   [概要](#cache-page-overview)
    -   [プロパティ設定](#cache-page-settings)
    -   [コード例](#cache-page-example)
-   [**関連コンテンツ**](#related-content)
	-   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="control-config"></a> コントロールの構成の概要

以下の表は、Page MVC ラッパーの構成可能な要素を示しています。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
構成可能な点
			</th>

            <th>
詳細
			</th>

            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
Page ボタンの追加
			</td>

            <td>
Page の [戻る] ボタンを追加し、[閉じる] ボタンを構成します。
			</td>

            <td>
                <ul>
                    <li>
[AddBackButton](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~AddBackButton.html)
					</li>

                    <li>
[BackButtonText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~BackButtonText.html)
					</li>

                    <li>
[BackButtonTheme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~BackButtonTheme.html)
					</li>

                    <li>
[CloseButtonText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~CloseButtonText.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
Page のキャッシュ
			</td>

            <td>
このサンプルは、Page がページ間を切り替えているときにブラウザーの DOM にキャッシュされるよう、Page ラッパーを構成する方法を示します。
			</td>

            <td>
                <ul>
                    <li>
[DomCache](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~DomCache.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## <a id="add-page-buttons"></a>Page ボタンの追加
### <a id="overview"></a>概要

Page の [戻る] ボタンを追加し、[閉じる] ボタンを構成できます。以下のコードとスクリーンショットは、MVC Page ラッパー構成の結果です。

> **注:** [閉じる] ボタンは、ページがダイアログで開いた場合のみ表示されます。

> **注:** 中に [戻る] ボタンを表示するためには、ページ ヘッダーを定義する必要があります。

**HTML の場合:**

```
<div data-add-back-btn="true" data-back-btn-text="Back" 
         data-back-btn-theme="c" data-close-btn-text="X" 
         data-role="page" id="Page1" data-url="Page1" >
     <div data-role="header"><h1>My Title</h1></div>
</div>
```

![](images/04_PageConfiguring_1.png)

### <a id="property-settings"></a>プロパティ設定

以下の表では、[追加] ボタンを表示し、[閉じる] ボタンを構成するために、目的の構成をマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
[戻る] ボタンを追加する|[AddBackButton](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~AddBackButton.html)|`true`
[戻る] ボタンのテキストを設定する|[BackButtonText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~BackButtonText.html)|`戻る`
[戻る] ボタンのテーマを設定する|[BackButtonTheme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~BackButtonTheme.html)|`a`
[閉じる] ボタンのテキストを設定する|[CloseButtonText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~CloseButtonText.html)|`X`

### <a id="code-example"></a>コード例

以下のコードを使用して、`Page` の開始と終了をマークし、ヘッダーも定義します。[戻る] ボタンを表示するためには、ヘッダーは必須です。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .Page()
    .ID("pg1")
    .AddBackButton(true)
    .BackButtonText("Back")
    .BackButtonTheme("a")
    .CloseButtonText("X")
    .BeginRender())
        <div data-role="header"><h1>My Title</h1></div>
@(Html.InfragisticsMobile()
    .Page()
    .ID("pg1")
    .EndRender())
```



## <a id="cache-page"></a>Page のキャッシュ
ある View で複数の Page をナビゲートする場合、jQuery モバイル フレームワークでは 1 つの Page のみ DOM で使用で使用可能とし、新しいページで置き換えられた場合、そのページはクリアされます。これにより、ブラウザーのメモリがいっぱいになるのを防ぎます。ただし、訪問履歴のある Page を素早くロードしたい場合は、Page の DOM キャッシュを有効にして、インスタンスを DOM に保持します。

以下の HTML コードは、「コード例」のセクションのコードの結果に描画されます。

**HTML の場合:**

```
<div data-dom-cache="true" 
         data-role="page" id="Page1">
</div>
```

### <a id="cache-page-settings"></a>プロパティ設定

以下の表では、Page のキャッシュをブラウザーで有効にするため、目的の構成をマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
[戻る] ボタンを追加する|[DomCache](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~DomCache.html)|`true`


### <a id="cache-page-example"></a>コード例

以下のコードを使用して、Page の開始をマークします。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .Page()
    .ID("pg1")
    .DomeCache(true)
    .BeginRender())
```

Page コンテンツが追加された場合、Page ラッパー定義を閉じます。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .Page()
    .ID("pg1")
    .EndRender())
```



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Page の概要](Page-Overview.html): このトピックでは、Page MVC ラッパーに関連する情報について説明します。
- [*Page* の追加](Adding-Page.html): このトピックでは、Infragistics MVC ラッパーを使用して Page を有効にする場合に必要な情報について説明します。
- [Page プロパティ参照](Page-Property-Reference.html): このトピックでは、Page MVC ラッパーのプロパティに関する参照情報について説明します。

### <a id="samples"></a>サンプル
このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-page/basic-usage): このサンプルでは、Page ASP.NET MVC ヘルパーを使用して、「data-role="Page"」 の HTML DIV 要素を定義する方法を示します。





 

 



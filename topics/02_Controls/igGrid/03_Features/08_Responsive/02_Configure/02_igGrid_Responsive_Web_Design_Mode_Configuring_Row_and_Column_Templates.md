<!--
|metadata|
{
    "fileName": "iggrid-responsive-web-design-mode-configuring-row-and-column-templates",
    "controlName": "igGrid",
    "tags": []
}
|metadata|
-->

# 列テンプレートの構成 (igGrid、RWD モード)

## トピックの概要

### 目的

このトピックは、コード例を用いて `igGrid`™ コントロールの各 Responsive Web Design (RWD) モード 構成に対して列テンプレートを定義する方法、およびアクティブな RWD モード構成の切り替え時のテンプレートの自動変更を構成する方法について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。

- 概念
    - レスポンス Web デザイン
    - レスポンシブ フレームワーク
    - CSS メディア クエリ
- トピック
    - [レスポンス Web デザイン (RWD) モードの概要 (igGrid)](igGrid-Responsive-Web-Design-Mode-Overview.html): このトピックは、`igGrid` コントロールの RWD モード機能およびこの機能が提供する機能性について概念的に説明します。
    - [レスポンス Web デザイン (RWD) モード構成を有効にする (igGrid)](igGrid-Enabling-Responsive-Web-Design-Mode.html): このトピックは、コード例を用いて、`igGrid` コントロールでレスポンス Web デザイン (RWD) モードを有効にする方法について説明します。
	- [レスポンス Web デザイン (RWD) モード構成の概要 (igGrid)](igGrid-Configuring-Responsive-Web-Design-Mode-Overview.html): このトピックは、列の非表示やテンプレートの構成など レスポンス Web デザイン (RWD) モードが構成される要素、およびこれらの要素が互いのどのように関係するのかを概念的に説明します。
- 外部リソース
    -   [A List Apart: レスポンシブ Web デザイン](http://alistapart.com/article/responsive-web-design)
    -   [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
    -   [Wikipedia: レスポンシブ Web デザイン](http://en.wikipedia.org/wiki/Responsive_web_design)
    -   [CSS 3 メディア クエリ](http://www.w3.org/TR/css3-mediaqueries/)

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**テンプレート構成のサマリー**](#summary)
    -   [テンプレート構成のサマリー チャート](#summary-chart)
-   [**列テンプレートを構成する**](#column-template)
    -   [プロパティ設定](#column-template-property-settings)
    -   [例](#column-template-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)



## <a id="summary"></a> テンプレート構成のサマリー

RWD モード テンプレートは、プロファイルごとに構成される `igGrid` テンプレートです。たとえば、Desctop プロファイルでテンプレートを使用すると、`City`、`Country` および `Address` を別個の列とし、タブレットのプロファイルでは単一列に結合できます。

以下のスクリーンショットは、異なる RWD 構成で igGrid がどのように見えるのかを示します。デスクトップ構成では、グリッドには `Country`、`City` および `Address` の 3 つの列があります。タブレット構成では、`Country` 列が非表示になります。電話構成では、`Country` 列と `City` 列が非表示になりますが、そのデータは `Address` 列に追加されます。

デスクトップ構成 (1280 x 1024 px)

![](images/Configuring_Template_Switching_1.png)

タブレット構成 (768 x 1024 px)|電話構成 (320 x 480 px)
-------------------------------------|---------------------------------
![](images/Configuring_Template_Switching_2.png) | ![](images/Configuring_Template_Switching_3.png)


RWD 構成テンプレートが構成されると、テンプレートはプロファイルのアクティブ化により自動的に切り替わります。

### <a id="summary-chart"></a> テンプレート構成のサマリー チャート

以下の表は、*RWD モード テンプレート切り替え*の構成可能な要素のリストです。このメソッドについては、表の下にある解説も参照してください。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
構成可能な項目
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
[列テンプレート](#column-template)
			</td>
            <td>
列テンプレートは、各列に対して個別に定義されます。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings)
					</li>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.configuration.desktop.template](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                    <li>
[columnSettings.configuration.tablet.template](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                    <li>
[columnSettings.configuration.phone.template](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                    <li>
columnSettings.configuration.&lt;custom_mode&gt;.template
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>





## <a id="column-template"></a> 列テンプレートを構成する

列テンプレートは、各列に対して個別に、など列レベルで定義されます。列テンプレートの切り替えは、RWD モード機能の RWD モード [`columnSettings`](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings) プロパティで構成されます。

### <a id="column-template-property-settings"></a> プロパティ設定

以下の表では、任意の構成をそれに関係するプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|---------------
デスクトップ RWD モード プロファイルに対して列テンプレートを構成します。|[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options)|列のキー
 | [columnSettings.configuration.desktop.template](%%jQueryApiUrl%%/ui.iggridresponsive#options) | テンプレート文字列
タブレット RWD プロファイルに対して列テンプレートを構成します。|[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options)|列のキー
 | [columnSettings.configuration.tablet.template](%%jQueryApiUrl%%/ui.iggridresponsive#options) | テンプレート文字列
電話 RWD プロファイルに対して列テンプレートを構成します。|[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options)|列のキー
 | [columnSettings.configuration.phone.template](%%jQueryApiUrl%%/ui.iggridresponsive#options) | テンプレート文字列



### <a id="column-template-example"></a> 例

以下のコードは、RWD モードのデフォルト プロファイルのそれぞれに対して `Name` 列の列テンプレートを定義する方法を示します。テンプレートは、セルのフォント サイズを設定します。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    height: "100%",
    width: "100%",
    columns: [
        { headerText: "Product ID", key: "ProductID", dataType: "number"},
        { headerText: "Product Name", key: "Name", dataType: "string" },
        { headerText: "Product Number", key: "ProductNumber", dataType: "string" }
    ],
    autoGenerateColumns: false,
    dataSource: adventureWorks,
    responseDataKey: "Records",
    features: [
        {
            name: "Responsive",
            columnSettings: [
                {
                    columnKey: "Name",
                    configuration: {
                        desktop: {
                            template: "<span style='font-weight: bold; font-size: 1.2em;'>${Name}</span>"
                        },
                        tablet: {
                            template: "<span style='font-size: 1.1em;'>${Name}</span>"
                        },
                        phone: {
                            template: "<span style='font-size: 0.8em;'>${Name}</span>"
                        }
                    }
                }
            ]
        }
    ]
});
```

**ASPX の場合:**

```csharp
@using Infragistics.Web.Mvc
@model IQueryable<GridDataBinding.Models.Product>
@(Html.Infragistics()
	.Grid(Model)
	.ID("grid1")
	.AutoGenerateColumns(false)
	.Columns(col =>
	{
	    col.For(c => c.ProductID).HeaderText("Product ID");
	    col.For(c => c.Name).HeaderText("Product Name");
	    col.For(c => c.ProductNumber).HeaderText("Product Number");
	})
	.Features(feature =>
	{
	    feature.Responsive().ColumnSettings(cs =>
	    {
	        cs.ColumnSetting().ColumnKey("Name").Configuration(conf => {
	            conf.AddColumnModeConfiguration("desktop", c => c.Template("<span style='font-weight: bold; font-size: 1.2em;'>${Name}</span>"));
	            conf.AddColumnModeConfiguration("tablet", c => c.Template("<span style='font-size: 1.1em;'>${Name}</span>"));
	            conf.AddColumnModeConfiguration("phone", c => c.Template("<span style='font-size: 0.8em;'>${Name}</span>"));
	        });
	    });
	})
	.DataBind()
	.Render())
```

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [列非表示の構成 (igGrid、RWD モード)](igGrid-Responsive-Web-Design-Mode-Configuring-Column-Hiding.html): このトピックでは、コード例を用いて、レスポンス Web デザイン (RWD) モードで `igGrid` コントロール用に列を非表示にする方法について説明します。

- [カスタム レスポンス Web デザイン (RWD) プロファイルの作成 (igGrid)](igGrid-Responsive-Web-Design-Mode-Creating-Custom-Profile.html): このトピックは、コード例を使用して、`igGrid` コントロールのカスタム レスポンシブ Web デザイン (RWD) モード プロファイルを作成する方法について説明します。




 

 



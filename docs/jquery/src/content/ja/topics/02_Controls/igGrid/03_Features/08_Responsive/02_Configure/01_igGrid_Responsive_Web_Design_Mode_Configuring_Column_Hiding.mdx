<!--
|metadata|
{
    "fileName": "iggrid-responsive-web-design-mode-configuring-column-hiding",
    "controlName": "igGrid",
    "tags": []
}
|metadata|
-->

# 列非表示の構成 (igGrid、RWD モード)

## トピックの概要

### 目的

このトピックでは、コード例を用いて、Responsive Web Design (RWD) モードで `igGrid`™ コントロール用に列を非表示にする方法について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。

- 概念
    - レスポンス Web デザイン
    - レスポンシブ フレームワーク
    - CSS メディア クエリ
- トピック
	- [レスポンス Web デザイン (RWD) モード構成の概要 (igGrid)](igGrid-Configuring-Responsive-Web-Design-Mode-Overview.html): このトピックは、列の非表示やテンプレートの構成など レスポンス Web デザイン (RWD) モードが構成される要素、およびこれらの要素が互いのどのように関係するのかを概念的に説明します。
    - [レスポンス Web デザイン (RWD) モードの概要 (igGrid)](igGrid-Responsive-Web-Design-Mode-Overview.html): このトピックは、`igGrid` コントロールの RWD モード機能およびこの機能が提供する機能性について概念的に説明します。
    - [レスポンス Web デザイン (RWD) モード構成を有効にする (igGrid)](igGrid-Enabling-Responsive-Web-Design-Mode.html): このトピックは、コード例を用いて、`igGrid` コントロールでレスポンス Web デザイン (RWD) モードを有効にする方法について説明します。
- 外部リソース
    -   [A List Apart: レスポンシブ Web デザイン](http://alistapart.com/article/responsive-web-design)
    -   [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
    -   [Wikipedia: レスポンシブ Web デザイン](http://en.wikipedia.org/wiki/Responsive_web_design)
    -   [CSS 3 メディア クエリ](http://www.w3.org/TR/css3-mediaqueries/)


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**列非表示構成の概要**](#overview)
    -   [列非表示構成の概要表](#summary-chart)
-   [**CSS クラスを使用している列非表示の構成**](#css)
    -   [プロパティ設定](#css-property-settings)
    -   [例](#css-example)
-   [**プロファイル オブジェクトを使用している列非表示の構成**](#profile-objects)
    -   [プロパティ設定](#profile-objects-property-settings)
    -   [例](#profile-objects-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)



## <a id="overview"></a> 列非表示構成の概要

モードには、RWD プロファイルに基づいて列を非表示/表示するための機能があります。以下のスクリーンショットは、同じグリッドの 携帯電話とタブレットの RWD モード プロファイルで列の非表示を比較します。

携帯電話 プロファイル (320 x 480 px)|タブレット プロファイル (768 x 1024 px)
-----------------------------|--------------------------------
![](images/Configuring_Column_Hiding_1.png) | ![](images/Configuring_Column_Hiding_2.png)


デスクトップ プロファイルでは、より多くの列が表示されます。以下の画像は、デスクトップ プロファイルで表示される同じグリッドを示します。

**デスクトップ プロファイル (1280 x 1024 px)**

![](images/Configuring_Column_Hiding_3.png)



列の非表示は、以下の２つの選択可能な方法で構成できます。

-   **[CSS メディア クエリー](http://www.w3.org/TR/css3-mediaqueries/)に基づいて**、 CSS クラス を使用- デフォルトでは、 CSS クラスは [**CCS 3 メディア クエリ**](http://www.w3.org/TR/css3-mediaqueries/)を使用します。
-   **指定する列単位では**、各個別のプロファイルにおいて各列について非表示か表示かを指定します。

列単位の構成は、[インライン カスタム RWD モード](igGrid-Responsive-Web-Design-Mode-Creating-Custom-Profile.html) を定義した場合、または CSS メディア クエリーに依存しないカスタム RWD モード構成を実装した場合に列の非表示を構成するために唯一使用可能な方法です。

### <a id="summary-chart"></a> 列非表示構成の概要表

以下の表は、RWD モード列の非表示を構成するために使用可能なアプローチを簡単に説明します。このメソッドについては、表の下にある解説も参照してください。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
構成タスク
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
[CSS クラスを使用している列非表示の構成](#css)
			</td>
            <td>
CSS クラスで定義された列の非表示は、CSS 3 メディア クエリーを使用します。
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
[columnSettings.classes](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.classes)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[プロファイル オブジェクトを使用している列非表示の構成](#profile-objects)
			</td>
            <td>
個別の列構成で定義された列の非表示は、`InfragisticsMode` クラスを使用して行われます。
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
[columnSettings.configuration.desktop.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                    <li>
[columnSettings.configuration.tablet.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                    <li>
[columnSettings.configuration.phone.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                    <li>
columnSettings.configuration.&lt;custom_mode&gt;.hidden
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>




## <a id="css"></a> CSS クラスを使用している列非表示の構成

CSS クラスで定義された列の非表示は、CSS 3 メディア クエリーを使用します。CSS クラスは 列単位で `columnSettings` プロパティで構成されます。 `columnSettings.classes` プロパティは、 [HTML 要素のクラス属性](http://www.w3.org/TR/html401/struct/global.html#h-7.5.2)を設定するルールに従います。単一のクラスまたはドットなしで複数のクラスを設定できます。複数のクラスを設定する場合は スペースで区切ります。

### <a id="css-property-settings"></a> プロパティ設定

以下の表では、目的の構成をプロパティ設定にマップしています。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
目的:
			</th>
            <th>
使用するプロパティ:
			</th>
            <th>
設定の選択肢:
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
デスクトップ RWD モード プロファイルに対してCSS クラスを使用して列を非表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.classes](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.classes)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
“ui-hidden-desktop”
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
デスクトップ RWD モード プロファイルに対してCSS クラスを使用して列を表示します。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.classes](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.classes)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
“ui-visible-desktop”
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
タブレット RWD モード プロファイルに対してCSS クラスを使用して列を非表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.classes](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.classes)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
“ui-hidden-tablet”
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
タブレット RWD モード プロファイルに対してCSS クラスを使用して列を表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.classes](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.classes)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
“ui-visible-tablet”
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
電話 RWD モード プロファイルに対してCSS クラスを使用して列を非表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.classes](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.classes)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
“ui-hidden-phone”
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
電話 RWD モード プロファイルに対してCSS クラスを使用して列を表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.classes](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.classes)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
“ui-visible-phone”
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>


### <a id="css-example"></a> 例

この例は、CSS クラスに基づいて列の非表示を設定する方法をデモします。

`ProductID` 列は、同時に `ui-hidden-tablet` クラスと `ui-hidden-phone` クラスを使用するよう構成されます (スペースで区別して行います)。タブレットや携帯電話のプロファイルでは表示されない、など

`ProductNumber` 列は `ui-hidden-phone` クラスを使用するよう構成されます。携帯電話のプロファイルでは表示されない、など。

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
                    columnKey: "ProductID",
                    classes: "ui-hidden-tablet ui-hidden-phone"
                },
                {
                    columnKey: "ProductNumber",
                    classes: "ui-hidden-phone"
                }
            ]
        }
    ]
});
```

**C# の場合:**

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
	        cs.ColumnSetting().ColumnKey("ProductID").Classes("ui-hidden-tablet ui-hidden-phone");
	        cs.ColumnSetting().ColumnKey("ProductNumber").Classes("ui-hidden-phone");
	    });
	})
	.DataBind()
	.Render())
```



## <a id="profile-objects"></a> プロファイル オブジェクトを使用している列非表示の構成

各列の構成で定義される列の非表示は、`columnSettings.configuration` プロパティ内の `InfragisticsMode` クラスで行われます。これは、プロパティが RWD モードのプロファイル名であり、その値は列の可視性を構成するための `hidden` ブール値プロパティを持つオブジェクトです。

### <a id="profile-objects-property-settings"></a> プロパティ設定

以下の表では、目的の構成をプロパティ設定にマップしています。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
目的:
			</th>
            <th>
使用するプロパティ:
			</th>
            <th>
設定の選択肢:
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
デスクトップ RWD モード プロファイルに対して列構成を使用して列を非表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.configuration.desktop.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
true
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
デスクトップ RWD プロファイルに対して列構成を使用して列を表示します。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.configuration.desktop.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
false
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
タブレット RWD モード プロファイルに対して列構成を使用して列を非表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.configuration.tablet.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
true
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
タブレット RWD モード プロファイルに対して列構成を使用して列を表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.configuration.tablet.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
false
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
携帯電話 RWD モード プロファイルに対して列構成を使用して列を非表示にします。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.configuration.tablet.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
true
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
携帯電話 RWD モード プロファイルに対して列構成を使用して列を表示します。
			</td>
            <td>
                <ul>
                    <li>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.columnKey)
					</li>
                    <li>
[columnSettings.configuration.tablet.hidden](%%jQueryApiUrl%%/ui.iggridresponsive#options:columnSettings.configuration)
					</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>
列のキー
					</li>
                    <li>
false
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>


### <a id="profile-objects-example"></a> 例

この例は、列構成に基づいて列の非表示を設定する方法を示します。

`ProductID` 列は、デスクトップ プロファイル (デフォルト) で表示され、タブレットおよび携帯電話のプロファイルでは非表示になります。

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
                    columnKey: "ProductID",
                    configuration: {
                        desktop: {
                            hidden: false
                        },
                        tablet: {
                            hidden: true
                        },
                        phone: {
                            hidden: true
                        }
                    }
                }
            ]
        }
    ]
});
```

**C# の場合:**

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
	        cs.ColumnSetting().ColumnKey("ProductID").Configuration(conf => {
	            conf.AddColumnModeConfiguration("desktop", c => c.Hidden(false));
	            conf.AddColumnModeConfiguration("tablet", c => c.Hidden(true));
	            conf.AddColumnModeConfiguration("phone", c => c.Hidden(true));
	        });
	    });
	})
	.DataBind()
	.Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [行および列テンプレートの構成 (igGrid、RWD モード)](igGrid-Responsive-Web-Design-Mode-Configuring-Row-and-Column-Templates.html): このトピックは、コード例を用いて `igGrid` コントロールの各 レスポンス Web デザイン (RWD) モード プロファイルに対して行と列を定義する方法、およびアクティブな RWD モードの切り替え時のテンプレートの自動変更を構成する方法について説明します。

- [カスタム レスポンス Web デザイン (RWD) プロファイルの作成 (igGrid)](igGrid-Responsive-Web-Design-Mode-Creating-Custom-Profile.html): このトピックは、コード例を使用して、`igGrid` コントロールのカスタム レスポンシブ Web デザイン (RWD) モード プロファイルを作成する方法について説明します。





 

 



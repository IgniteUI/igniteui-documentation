<!--
|metadata|
{
    "fileName": "iggrid-enabling-responsive-web-design-mode",
    "controlName": "igGrid",
    "tags": ["Grids","How Do I","Layouts"]
}
|metadata|
-->

# レスポンス Web デザイン (RWD) モード構成を有効にする (igGrid)

## トピックの概要

### 目的

このトピックは、コード例を用いて、`igGrid`™ コントロールでレスポンス Web デザイン(RWD) モードを有効にする方法について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。

- 概念
	-   レスポンス Web デザイン
	-   レスポンシブ フレームワーク
	-   CSS メディア クエリ
- トピック
	- [レスポンス Web デザイン (RWD) モードの概要 (igGrid)](igGrid-Responsive-Web-Design-Mode-Overview.html): このトピックは、`igGrid` コントロールのレスポンス Web デザイン (RWD) モード機能およびこの機能がサポートする機能性について概念的に説明します。
- 外部リソース
	-   [A List Apart: レスポンシブ Web デザイン](http://alistapart.com/article/responsive-web-design)
	-   [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
	-   [Wikipedia: レスポンシブ Web デザイン](http://en.wikipedia.org/wiki/Responsive_web_design)
	-   [CSS 3 メディア クエリ](http://www.w3.org/TR/css3-mediaqueries/)

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**レスポンス Web デザイン モードの有効化 - 概要**](#overview)
-   [**レスポンス Web デザイン モードの有効化 - コード例**](#examples)
-   [**コード例: JavaScript で レスポンス Web デザイン モードを有効にする**](#js-example)
    -   [コード](#js-code)
-   [**コード例: ASP.NET MVC で レスポンス Web デザイン モードを有効にする**](#mvc-example)
    -   [コード](#mvc-code)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)



## <a id="overview"></a> レスポンス Web デザイン モードの有効化 - 概要

`igGrid` コントロールは、デフォルトでは レスポンス Web デザイン (RWD) モードは無効であるため、明示的に有効にして構成する必要があります。RWD モードは、レスポンシブ機能を介して有効にします。これは、JavaScript と ASP.NET MVC では異なります。

以下の表は、`igGrid` コントロールで レスポンス Web デザイン (RWD) モードを有効にする方法について説明します。詳細は、表の後のコード例を参照してください。

以下において RWD モードを有効にするには|以下を実行します。
---|---
JavaScript ファイル|RWD モード (機能名は `Responsive`) 構成を `igGrid` の `features` 配列で定義します。
ASP.NET MVC|グリッドの `Features` メソッドに渡されるデリゲートで `Responsive` 機能をインスタンス化します。



## <a id="examples"></a> レスポンス Web デザイン モードの有効化 - コード例

以下は、このトピックで使用したコード例を示しています。

- [JavaScript で RWD モードを有効にする](#js-example): この例は、JavaScript で `igGrid` の RWD モードを列非表示構成で有効にする操作を示します。

- [ASP.NET MVC で RWD モードを有効にする](#mvc-example): この例は、ASP.NET MVC で `igGrid` の RWD モードを列非表示構成で有効にする操作を示します。





## <a id="js-example"></a> コード例: JavaScript で レスポンス Web デザイン モードを有効にする

以下の例は、AdventureWorks データベースからの製品表データにバインドされる `igGrid` インスタンスを作成します。ProductID、Name および ProductNumber の 3 つの列を手動で定義します。

RWD モードの列非表示は、CSS クラスを使用して ProductID および ProductNumber 列用に構成されます。

ProductID 列には、`hidden-tablet` および `hidden-phone` CSS クラスが適用されます。これは、列はそれぞれタブレットと電話のプロファイルで表示されないという意味です。

ProductNumber では、`hidden-phone` CSS クラスが適用されます。列が表示されないのは電話のプロファイルのみという意味です。

### <a id="js-code"></a> コード

以下のコードはこの例を実装します。

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
                    classes: "hidden-tablet hidden-phone"
                },
                {
                    columnKey: "ProductNumber",
                    classes: "hidden-phone"
                }
            ]
        }
    ]
});
```



## <a id="mvc-example"></a> コード例: ASP.NET MVC で レスポンス Web デザイン モードを有効にする

こ例は、View モデルとして定義されるカスタム `Product` オブジェクト コレクションにバインドされる `igGrid` インスタンスを作成します。ProductID、Name および ProductNumber の 3 つの列を手動で定義します。

RWD モードの列非表示は、CSS クラスを使用して ProductID および ProductNumber 列用に構成されます。

ProductID 列には、`hidden-tablet` および `hidden-phone` CSS クラスが適用されます。これは、列はそれぞれタブレットと電話のプロファイルで表示されないという意味です。

ProductNumber では、`hidden-phone` CSS クラスが適用されます。列が表示されないのは電話のプロファイルのみという意味です。

### <a id="mvc-code"></a> コード

以下のコードはこの例を実装します。

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
	        cs.ColumnSetting().ColumnKey("ProductID").Classes("hidden-tablet hidden-phone");
	        cs.ColumnSetting().ColumnKey("ProductNumber").Classes("hidden-phone");
	    });
	})
	.DataBind()
	.Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [レスポンス Web デザイン (RWD) モードの構成 (igGrid)](igGrid-Configuring-Responsive-Web-Design-Mode-LandingPage.html): このグループのトピックは、列非表示の構成、カスタムの行おより列のテンプレートの作成、カスタム RWD の構成の作成および Twitter Bootstrap で使用するための RWD モードの構成など、`igGrid` コントロールにおける レスポンス Web デザイン (RWD) モード関連の各種構成タスクを説明します。






 

 



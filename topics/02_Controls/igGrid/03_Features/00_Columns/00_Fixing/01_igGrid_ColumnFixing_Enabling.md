<!--
|metadata|
{
    "fileName": "iggrid-columnfixing-enabling",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# 列固定の有効化 (igGrid)

## トピックの概要

### 目的

このトピックではコード例を使用して、JavaScript と ASP.NET MVC で `igGrid`™ の列固定機能を有効にする方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igGrid の概要](igGrid-Overview.html): このトピックでは、`igGrid` コントロールとその機能の概念的な概要を提供し、HTML ページへの追加方法をコードを用いて説明します。

- [igGrid/igDataSource アーキテクチャの概要](igGrid-igDataSource-Architecture-Overview.html): このトピックでは、`igGrid` コントロールのインナー作用およびデータ ソース コンポーネントとの相互作用を説明します (`igDataSource`™)。

- [列固定の概要 (igGrid)](igGrid-ColumnFixing-Overview.html): このトピックは、サポートされているユーザー インタラクションおよび主な構成オプションなど、`igGrid`™ の列固定機能の概要を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**列固定の有効化 - 概要**](#overview)
    -   [列固定有効化の概要表](#summary-chart)
-   [**コード例**](#code-examples)
	-   [コード例: JavaScript で列固定を有効にする](#code-example-js)
	-   [コード例: ASP.NET MVC で列固定を有効にする](#code-example-mvc)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a> 列固定の有効化 - 概要

`igGrid` コントロールの列固定機能はデフォルトで無効のため、明示的に有効にする必要があります。有効にする方法は、JavaScript と ASP.NET MVC で異なります。(列固定の概要表を参照)

### <a id="summary-chart"></a> 列固定有効化の概要表

以下の表で、JavaScript と ASP.NET MVC で列固定を有効にする操作を簡単に説明します。詳細は、[列固定 - コード例](#code-examples)を参照してください。

列固定を有効にするには|以下を実行します。
---- | ----
JavaScript ファイル|`igGrid` の features 配列で列固定の構成を定義します。
ASP.NET MVC|`igGrid` コントロールの Features メソッドに渡されるデリゲートで列固定機能をインスタンス化します。


## <a id="code-examples"></a> コード例の概要

以下は、このトピックで使用したコード例を示しています。

- [JavaScript で列固定を有効にする](#code-example-js): この例は、JavaScript の[デフォルト構成](igGrid-ColumnFixing-Overview.html#default-configuration)で igGrid の 列固定機能を有効にする操作を示します。

- [ASP.NET MVC で列固定を有効にする](#code-example-mvc): この例は、ASP.NET MVC のデフォルト構成で igGrid の 列固定機能を有効にする操作を示します。

### <a id="code-example-js"></a> コード例: JavaScript で列固定を有効にする

#### 説明

以下のコードは、AdventureWorks データベースから製品表データにバインドされる `igGrid` インスタンスを作成します。列は自動生成され、デフォルトの列幅が設定されます。幅および高さが定義されます。列固定は、[デフォルト構成](igGrid-ColumnFixing-Overview.html#default-configuration)で有効になります。

#### コード

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    dataSource: adventureWorks,
    defaultColumnWidth: "100px",
    width: "600px",
    height: "500px",
    features: [
        {
            name: "ColumnFixing"
        }
    ]
});
```

### <a id="code-example-mvc"></a> コード例: ASP.NET MVC で列固定を有効にする

#### 説明

以下のコードは、ビューモデルとして定義されるカスタム製品オブジェクト コレクションにバインドされる `igGrid` インスタンスを作成します。列は自動生成され、デフォルトの列幅が設定されます。幅および高さが定義されます。列固定は、[デフォルト構成](igGrid-ColumnFixing-Overview.html#default-configuration)で有効になります。

#### コード

以下のコードはこの例を実装します。

**C# の場合:**

```csharp
@model IQueryable<Sample.Models.Product>
@(Html.Infragistics()
    .Grid(Model)
    .DefaultColumnWidth("100px")
    .Width("600px")
    .Height("500px")
    .Features(feature =>
    {
        feature.ColumnFixing();
    })
    .DataBind()
    .Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [列固定の構成 (igGrid)](igGrid-ColumnFixing-Configuring.html): このトピックではコード例を使用して、固定列領域の配置、列固定の初期状態、固定解除列領域の最小幅など、`igGrid` コントロールの列固定機能を構成する方法を説明します。

- [メソッドの参照 (列固定、igGrid)](igGrid-ColumnFixing-Method-Reference.html): このトピックは、`igGrid` コントロールの列固定機能に関するメソッドの参照情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [列の固定](%%SamplesUrl%%/grid/column-fixing): このサンプルは、デフォルトで列を固定に設定する方法や列の固定を防止する方法など、`igGrid` の列固定の基本機能を紹介します。





 

 



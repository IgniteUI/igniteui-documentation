<!--
|metadata|
{
    "fileName": "iggrid-developing-asp-net-mvc-applications-with-iggrid",
    "controlName": "igGrid",
    "tags": ["Grids","MVC"]
}
|metadata|
-->

# igGrid を使用する ASP.NET MVC アプリケーションの開発

## 概要

Ignite UI® のグリッド用の ASP.NET MVC ラッパーまたは `igGrid` は、既存のクライアント専用グリッドを MVC Extensions のサーバー側セットにラップします。これによって、次のようにしてグリッドを定義および使用できるようになります。

```
<%= Html.Infragistics().Grid(Model); %>
```

ASP.NET に依存しませんし、MVC 以外のフレームワークにも依存しません。MVC ラッパーのすべてのコードは、*Infragistics.Web.Mvc* アセンブリに含まれています。これは、MVC2 と MVC3 の両方対してコンパイル済みです。

すべての機能 (オプション、API、など) を単純にラッピングするだけでなく、MVC ラッパーは、ページング、並べ替え、フィルタリングを簡単にするデータ バインドに関連するロジックの多くをカプセル化します。これらの機能を処理するカスタム コードを書く必要ありません。`DataSource` を `IQueryable` オブジェクトのインスタンスにポイントするだけです。

## チェーン構文

使用可能な MVC アプリケーションにグリッドを定義するための 2 つの異なるオプションがあります。その 1 つは、`GridModel` クラスを構成して、グリッド拡張メソッドに引数としてそれを渡す方法です。もう 1 つは、チェーンの手法を使用して View にすべて構成する方法です。

## GridModel を使用したグリッドの構成

グリッド モデル クラスを使用する場合、コントローラーに依存してグリッドを構成します。これは、要求 (ページの変更やフィルタリングなど) の後に、グリッドの構成に使用した設定/プロパティを取得する必要があるシナリオで有効です。チェーンを使用して View にすべてを構成する場合は、こうした設定/プロパティは使用できません。

リスト 1: `GridModel` を使用した MVC アプリケーション内のグリッドの宣言

**C# の場合: モデル コード (ASP.NET MVC)**

```
public class GridFilteringModel
{
        public GridFilteringModel()
    {
           //The GridModel class holds all the properties for the MVC grid.
           GridFiltering = new Infragistics.Web.Mvc.GridModel();
    }

public Infragistics.Web.Mvc.GridModel GridFiltering { get; set; }
}
```

> **注:** `GridModel` ベース クラスを使用すると、すべての MVC Grid プロパティおよびメソッドにアクセスできます。

**C# の場合: コントローラー コード (ASP.NET MVC)**

```
[ActionName("Filtering")]
public ActionResult GridFiltering()
{
   GridFilteringModel model = new GridFilteringModel();
   model.GridFiltering.DataSourceUrl = Url.Action("BindGridFiltering");
   this.InitializeSortingGridOptions(model.GridFiltering);
   return View(model);
}
private void InitializeSortingGridOptions(GridModel model)
{
   model.Height = "500px";
   model.Columns.Add(new GridColumn("Product ID", "ProductID", "number", "100px"));
   model.Columns.Add(new GridColumn("Product Name", "Name", "string", "300px"));
   model.Columns.Add(new GridColumn("Product Number", "ProductNumber", "string", "205px"));
   model.Columns.Add(new GridColumn("Standard Cost", "StandardCost", "number", "110px"));
   GridFiltering filtering = new GridFiltering();
   model.Features.Add(filtering);
}
```

**ASPX/CSHTML の場合:**

  ```
  <%= Html.Infragistics().Grid("grid1", Model.GridFiltering)%>
  ```

## チェーンを使用したグリッドの構成

チェーン構文を使用しグリッドを初期化すると、すべての作成および構成のロジックがビューに移動します。これによって、コントローラー コードが非常に簡潔で明快になります。ビューにグリッドを定義するには、呼び出したものと同じオブジェクトを常に返すラッパー メソッドを介して、必要なプロパティとメソッドをグリッドに公開します。`ColumnSettings` または Columns などの複合オブジェクトの場合は、ラムダ式ビルダーを使用して、リスト 2 に示すような構文を実現します。

リスト 2: チェーンを使用した MVC アプリケーション内のグリッドの宣言

**C# の場合: モデル コード (ASP.NET MVC)**

```
N/A
```

**C# の場合: コントローラー コード (ASP.NET MVC)**

```
[ActionName("cell-selection")]
    public ActionResult GridSelection()
    {
        var ds = this.DataRepository.GetDataContext().MyComplexProducts;
        return View("CellSelection", ds);
    }
```

**ASPX/CSHTML の場合:**

```
<%= Html.Infragistics().Grid(Model).ID("grid1").Columns(column =>
    {
        column.For(x => x.ProductID).HeaderText("Product ID").Width("100px");
        column.For(x => x.Name).HeaderText("Product Name").Width("250px");
        column.For(x => x.ModifiedDate).HeaderText("Modified Date").Width("200px");
        column.For(x => x.ListPrice).HeaderText("List Price").Width("130px");
        }).Features(features => {
            features.Selection().Mode(SelectionMode.Cell).MultipleSelection(true);
        }).Height("500px").DataSourceUrl(Url.Action("PagingGetData")).DataBind().Render()%>
```

## データ バインディング

MVC グリッド ラッパーのすべてのデータ バインディングは、LINQ を使用して実行します。そのため、`DataSource` プロパティは `IQueryable` のインスタンスのみを受け付けます。

グリッドのデータ バインディングでは、2 つの重要なプロパティ `DataSource` および `DataSourceUrl` が考慮されます。ページを初めて描画するとき、`DataSource` を最初に指定する場合、グリッドは、グリッド初期化 JavaScript コードの一部としてデータをインラインで自動的に送信します。そのため、1 つの要求だけで、グリッドを描画し、データ バインドを行います。

`DataSourceUrl` を指定して、`DataSource` を指定しない場合は、グリッドの描画は空となり、2 つ目の要求で `DataSourceUrl` がデータをフェッチします。これは、MVC アプリケーションからグリッドをロードして、同じアプリケーションでホストされている WCF Web サービスにバインドする場合に特に有用です。

ページング、フィルタリング、並べ替えの機能を使用するには、`DataSourceUrl` プロパティを指定する必要があります。これは、コントローラー アクションにマップされる URL で、ある機能がサーバーに要求を送る場合に必ず呼び出されます。コントローラー アクションをマークして純粋な JSON を返す方法をリスト 3 に示します。

リスト 3: `GridDataSourceAction` 属性を使用したコントローラー アクションのマーキング

**C# の場合: コントローラー コード (ASP.NET MVC)**

```
[GridDataSourceAction]
[ActionName("PagingGetData")]
public ActionResult PagingGetData()
{
   var ds = this.DataRepository.GetDataContext().MyComplexProducts;
   return View("RowSelection", ds);
}
```

**ASPX/CSHTML の場合:**

 ```
 <%= Html.Infragistics().Grid(Model).ID("grid1").Columns(column =>
    {
        column.For(x => x.ProductID).HeaderText("Product ID").Width("100px");
        column.For(x => x.Name).HeaderText("Product Name").Width("250px");
        column.For(x => x.ModifiedDate).HeaderText("Modified Date").Width("200px");
        column.For(x => x.ListPrice).HeaderText("List Price").Width("130px");
        }).Features(features => {
            features.Selection().Mode(SelectionMode.Cell).MultipleSelection(true);
        }).Height("500px").DataSourceUrl(Url.Action("PagingGetData")).DataBind().Render()%>
 ```

すでに説明したように、MVC グリッドは URL パラメーターを LINQ 式および句に変換するので、すべてのページング、並べ替え、フィルタリングをそのまま使えます。

## MVC アプリケーションでのグリッドの使用

ASP.NET MVC アプリケーションで `igGrid` を開始するには、最初に、該当するスクリプト参照をビューに含める必要があります。これについてはリスト 4 で説明します。

リスト 4: CSS とスクリプト参照

**HTML の場合:**
```

<link type="text/css" href="css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
<link type="text/css" href="css/structure/infragistics.css" rel="stylesheet" />
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="jquery-ui.js"></script>
<script type="text/javascript" src="infragistics.core.js"></script>
<script type="text/javascript" src="infragistics.lob.js"></script>
```

グリッド列を定義する方法がいくつかあります。デフォルトで、`AutoGenerateColumns` が有効です。そのため、手動で列を指定しない場合は、データ ソースの基本ビジネス オブジェクトから列が推定され、プログラムによってクライアント上に作成されます。

列を定義する別の方法は、チェーンを使用することで、最後の方法は、`GridModel` クラスのインスタンスを使用して列を定義することです。

> **注:** チェーンを使用して列を定義するとき、列の推定データ型を自動的にオーバーライドする場合を除き、基本データのデータ型を指定する必要はありません。

リスト 5 に示した (該当するコードは太字) 次のチェーン構文を使用すると、View 内の機能を簡単に有効にして直接構成できます。

> **注:** 必ず、ご自分のプロジェクトの *Infragistics.Web.Mvc* アセンブリに参照を追加してください。

リスト 5: View でのグリッド機能の有効化

**ASPX/CSHTML の場合:**

```
<%= Html.Infragistics().Grid(Model).ID("grid1").Height("400px").Columns(column =>
    {
        column.For(x => x.ProductID).HeaderText("Product ID");
        column.For(x => x.Name).HeaderText("Product Name");
        column.For(x => x.ModifiedDate).HeaderText("Modified Date");
        column.For(x => x.ListPrice).HeaderText("List Price");
        }).Features(features => {
            features.Filtering().Mode(FilterMode.Advanced).ColumnSettings(settings =>
            {
                settings.ColumnSetting().ColumnKey("ProductID").AllowFiltering(false);
            });
        }).DataSourceUrl(Url.Action("GridGetData")).DataBind().Render()%>
```

## 関連コンテンツ

### トピック

-   [igGrid の概要](igGrid-Overview.html)

 

 



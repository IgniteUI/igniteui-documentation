<!--
|metadata|
{
    "fileName": "igpivotgrid-adding-using-the-mvc-helper",
    "controlName": "igPivotGrid",
    "tags": ["Application Blocks","Getting Started","Grids","How Do I","MVC"]
}
|metadata|
-->

# igPivotGrid の ASP.NET MVC アプリケーションへの追加



##トピックの概要

### 目的

このトピックは、ASP.NET MVC アプリケーションへ `igPivotGrid`™ コントロールを追加する方法について概念と詳しい手順の両方から説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igPivotGrid の概要](igPivotGrid-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igPivotGrid` コントロールに関する概念的な情報を提供します。

- [igPivotGrid の HTML ページへの追加](igPivotGrid-Adding-to-an-HTML-Page.html): このトピックでは、 HTML ページへ `igPivotGrid` コンポーネントを追加する方法についての概念と詳細な手順を説明します。このトピックでは、必要な JavaScript リソース ファイルの完全なリストを提供します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**igPivotGrid の ASP.NET MVC アプリケーションへの追加 - 概念的な概要**](#conceptual-overview)
    -   [igPivotGrid の ASP.NET MVC アプリケーションへの追加のサマリー](#overview-summary)
    -   [要件](#overview-requirements)
    -   [手順](#overview-steps)
-   [**igPivotGrid の ASP.NET MVC アプリケーションへの追加 - 例**](#example)
    -   [概要](#example-introduction)
    -   [プレビュー](#example-preview)
    -   [前提条件](#example-prerequisites)
    -   [手順](#example-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="conceptual-overview"></a>igPivotGrid の ASP.NET MVC アプリケーションへの追加 - 概念的な概要

### <a id="overview-summary"></a>igPivotGrid の ASP.NET MVC アプリケーションへの追加のサマリー

`igPivotGrid` は、%%ProductNameMVC%% の実装を伴うクライアント側コンポーネントで、MVC ビューの CS/VB コードでコンポーネントを使用できます。View のモデル (`igOlapFlatDataSource`™を使用) からデータを実行することも可能です。`igPivotGrid` に ASP.NET MVC ヘルパーを使用する場合、データのバインド方法は 2 通りあります。

-   データ ソースを構成する方法

必要な [DataSourceOptions](Infragistics.Web.Mvc~Infragistics.Web.Mvc.PivotDataSelectorWrapper~DataSourceOptions.html) (データ ソース オブジェクトの作成に使用) を設定することにより行います。この方法は、このトピックで説明します。

-   事前に構成されたデータ ソースを参照する方法

これは、事前に構成されたデータ ソース インスタンスの ID ([DataSourceID](Infragistics.Web.Mvc~Infragistics.Web.Mvc.PivotDataSelectorWrapper~DataSourceID.html)) (「[igOlapXmlaDataSource の ASP.NET MVC アプリケーションへの追加](igOlapXmlaDataSource-Adding-to-an-ASPNETMVC-Application.html)」および「[ASP.NET MVC アプリケーションに igOlapFlatDataSource の追加](igOlapFlatDataSource-Adding-Using-MVC-Helper.html)」で説明) を提供することによって行います。

`igPivotGrid` を View で定義するには、それらを呼び出す同じオブジェクトを常に返すメソッドを使用して必要なプロパティを設定します。これにより、すべての必要なプロパティを設定するために使用する構文をチェーンできます。`DataSourceOptions` などの複雑なオブジェクトの場合、この種の構文を実現するためにラムダ式ビルダーを使用します。

### <a id="overview-requirements"></a>要件

以下は、`igPivotGrid` を ASP.NET MVC アプリケーションへ追加するための全般的な要件です。

-   Infragistics® 名前空間への参照
-   アプリケーションへ追加する必要 JavaScript ファイル (完全なリストについては、「[igPivotGrid の HTML ページへの追加](igPivotGrid-Adding-to-an-HTML-Page.html)」を参照)

### <a id="overview-steps"></a>手順

以下は、`igPivotGrid` を ASP.NET MVC アプリケーションへ追加するための全般的な概念上の手順です。

1. Infragistics 名前空間への参照を追加します。

2. 必要な JavaScript リソースへの参照を追加する

3. `igPivotGrid`  を追加し、データ ソースを構成する



## <a id="example"></a>igPivotGrid の ASP.NET MVC アプリケーションへの追加 - 例

### <a id="example-introduction"></a>概要

以下の手順は、`igPivotGrid` コントロールを ASP.NET MVC アプリケーションに追加する方法について説明します。`igPivotGrid` を追加するための両方の方法についてのコード例 ([DataSourceOptions](Infragistics.Web.Mvc~Infragistics.Web.Mvc.PivotDataSelectorWrapper~DataSourceOptions.html) の設定および [DataSourceID](Infragistics.Web.Mvc~Infragistics.Web.Mvc.PivotDataSelectorWrapper~DataSourceID.html) の設定) を利用できます。この例で必要なリソースは、自動的に Infragistics Loader に参照されます。

### <a id="example-preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igPivotGrid_Adding_1.png)

### <a id="example-prerequisites"></a>前提条件

この手順を実行するには、以下のリソースが必要です。

-   ASP.NET MVC アプリケーション
-   アプリケーション プロジェクトに追加された `Infragistics.Web.Mvc.dll` アセンブリへの参照
-   SQL サーバーで展開された Adventure Works サンプルのデータベース (この例では http://sampledata.infragistics.com を使用)

>**注:** リモート xmla データ プロバイダ ([XmlaDataSourceAction](Infragistics.Web.Mvc~Infragistics.Web.Mvc.XmlaDataSourceActionAttribute.html)) を使用する場合は、MVC 3 以上が必要です。

### <a id="example-steps"></a>手順

以下の手順は、`igPivotGrid` を ASP.NET MVC アプリケーションに追加する方法を示します。

1. Infragistics 名前空間への参照を追加します。

	`Infragistics.Web.Mvc` 名前空間を自分のビュー コードに追加します。

	**ASPX の場合:**

	```csharp
	<%=Import Namespace=”Infragistics.Web.Mvc” %>
	```

2. 必要な JavaScript リソースへの参照を追加します。

	1. `igLoader` へスクリプト参照を追加します。

		以下のスクリプト参照をビューのヘッド セクションに追加します。

		**ASPX の場合:**
		
		```csharp
		<script src="[path to js folder]/infragistics.loader.js"></script>
		```

	2. `igLoader` 定義を追加します。

		以下のコードは、Infragistics Loader を使用して必要なリソースを取り込みます。
		
		**ASPX の場合:**
		
		```csharp
		<%=Html.Infragistics()
		        .Loader()
		        .ScriptPath("[js path]")
		        .CssPath("[css path]")
		        .Render()
		%>
		```

3. `igPivotGrid`  を追加し、データ ソースを構成します。

	以下のコードで `igOlapXmlaDataSource`™ にバインドされる `igPivotGrid` を追加します。
	
	**ASPX の場合:**
	
	```csharp
	<%= Html.Infragistics().PivotGrid()
	.DataSourceOptions(
	    dataSourceOptions => dataSourceOptions
	        .Columns("[Product].[Product Categories]")
	        .Rows("[Sales Territory].[Sales Territory]")
	        .Measures("[Measures].[Internet Order Count]")
	        .XmlaOptions(
	        xmlaOptions => xmlaOptions
	            .ServerUrl("http://sampledata.infragistics.com/olap/msmdpump.dll")
	            .Catalog("Adventure Works DW Standard Edition")
	            .Cube("Adventure Works")
	            .MeasureGroup("Internet Sales"))).Render()
	%>
	```
	
	事前に構成済みのデータ ソースを使用する方を選択する場合、[DataSourceID](Infragistics.Web.Mvc~Infragistics.Web.Mvc.PivotDataSelectorWrapper~DataSourceID.html) プロパティを設定する必要があります。以下のコード例では、ID が olapDataSource である igOlapXmlaDataSource または igOlapFlatDataSource がビューに表示されることを前提としています。(詳細は、「[igOlapXmlaDataSource の ASP.NET MVC アプリケーションへの追加](igOlapXmlaDataSource-Adding-to-an-ASPNETMVC-Application.html)」および「[ASP.NET MVC アプリケーションに igOlapFlatDataSource の追加](igOlapFlatDataSource-Adding-Using-MVC-Helper.html)」を参照してください)
	
	**ASPX の場合:**
	
	```csharp
	<%= Html.Infragistics().PivotGrid()
	.DataSourceID(“olapDataSource”)
	.Render()
	%>
	```


## <a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


- [igOlapFlatDataSource を ASP.NET MVC アプリケーションに追加](igOlapFlatDataSource-Adding-Using-MVC-Helper.html): このトピックは、%%ProductNameMVC%%を使用して ASP.NET MVC アプリケーションへ `igOlapFlatDataSource` コントロールを追加する方法についての概念と詳しい手順を説明します。

- [igOlapXmlaDataSource の ASP.NET MVC アプリケーションへの追加](igOlapXmlaDataSource-Adding-to-an-ASPNETMVC-Application.html): このトピックは、%%ProductNameMVC%%を使用して ASP.NET MVC アプリケーションへ `igOlapXmlaDataSource` コントロールを追加する方法についての概念と詳しい手順を説明します。

- [igPivotDataSelector の概要](igPivotDataSelector-Overview.html): このトピックは、主要機能、最小要件、ユーザー機能性など、`igPivotDataSelector`™ コントロールに関する概念的な情報を提供します。

- [igPivotView 概要](igPivotView-Overview.html): このトピックは、主要機能、最小要件、ユーザー機能性など、`igPivotView`™ コントロールに関する概念的な情報を提供します。


### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [%%ProductNameMVC%% と XMLA データ ソースの使用](%%SamplesUrl%%/pivot-grid/using-the-asp-net-mvc-helper-with-xmla-data-source): このサンプルは、`igOlapXmlaDataSource` コントロールのための ASP.NET MVC ヘルパーを利用した、`igPivotDataSelector` コントロールと `igPivotGrid` コントロールの使用方法を示します。

- [%%ProductNameMVC%% とフラット データ ソースの使用](%%SamplesUrl%%/pivot-grid/using-the-asp-net-mvc-helper-with-flat-data-source): このサンプルは、`igOlapFlatDataSource` コントロールのための ASP.NET MVC ヘルパーを利用した、`igPivotDataSelector` コントロールと `igPivotGrid` コントロールの使用方法を示します。





 

 



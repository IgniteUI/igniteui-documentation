<!--
|metadata|
{
    "fileName": "igpivotgrid-configuration",
    "controlName": "igPivotGrid",
    "tags": ["Getting Started", "Configuring","Pivot Grid"]
}
|metadata|
-->

# igPivotGrid の構成



## トピックの概要

### 目的

このトピックでは、`igPivotGrid`™ コントロールを構成する方法を説明します。

### このトピックの内容
このトピックは、以下のセクションで構成されます。
-   [基本構成](#basic)
-   [詳細の構成](#advanced)
    - [移動のカスタム検証](#custom-move-validation)
    - [カスタム要素のドラッグ アンド ドロップ](#custom-drag-drop)
    - [メンバーの展開](#expand)
-   [関連コンテンツ](#related-content)

## <a id='basic'></a>  基本構成

次の表に、ピボット表にデータを表示するために定義する必要のある基本オプションを示します。

igPivotGrid の場合:

オプション| 説明 | 
------|-------------|
[dataSource](%%jQueryApiUrl%%/ui.igPivotGrid#options:dataSource)| $.ig.OlapXmlaDataSource または $.ig.OlapFlatDataSource のインスタンス。

**$.ig.OlapXmlaDataSource** コンポーネントは、msmdpump.dll HTTP データ プロバイダーで構成された Microsoft® SQL Server Analysis Services (SSAS) サーバーとのコミュニケーションを処理します。 
関連する基本設定は次のとおりです。

オプション| 説明 | 
------|-------------|
[serverUrl](%%jQueryApiUrl%%/ig.OlapXmlaDataSource#options:options.serverUrl)|XMLA  サーバーの URL。
[catalog](%%jQueryApiUrl%%/ig.OlapXmlaDataSource#options:options.catalog)|カタログ名。
[cube](%%jQueryApiUrl%%/ig.OlapXmlaDataSource#options:options.cube)|データ ソース内のキューブの名前。
[rows](%%jQueryApiUrl%%/ig.OlapXmlaDataSource#options:options.rows)|コンマ (,) で区切られた階層名のリスト。これは、データ ソースの行の階層になります。
[columns](%%jQueryApiUrl%%/ig.OlapXmlaDataSource#options:options.columns)|コンマ (,) で区切られた階層名のリスト。これは、データ ソースの列の階層になります。
[measures](%%jQueryApiUrl%%/ig.OlapXmlaDataSource#options:options.measures)|コンマ (,) で区切られたメジャー名のリスト。これは、データ ソースのメジャーになります。

構成の例を示す次の基本サンプルを参照してください。
- [XMLA データ ソースへのバインド](%%SamplesUrl%%/pivot-grid/binding-to-xmla-data-source)

**$.ig.OlapFlatDataSource** コンポーネントは、フラットなデータ コレクション上で多次元の (OLAP のような) 解析を実行します。
関連する基本設定は次のとおりです。


OlapFlatDataSource の場合:

オプション| 説明 | 
------|-------------|
[dataSource](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.dataSource)|$.ig.DataSource が受け入れる有効なデータ ソース、または $.ig.DataSource 自体のインスタンスを指定します。|
[metadata](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.metadata)|$ .ig.DataSource データの処理命令を含むオブジェクト。
[metadata.cube](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.cube)|キューブの作成に使用されるメタデータ。
[metadata.cube.measuresDimension](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.cube)|メジャーのルート ノードについての情報を提供するオブジェクト。
[metadata.cube.dimensions](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.dimensions)|次元メタデータ オブジェクトの配列。
[rows](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.rows)|コンマ (,) で区切られた階層名のリスト。これは、データ ソースの行の階層になります。
[columns](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.columns)|コンマ (,) で区切られた階層名のリスト。これは、データ ソースの列の階層になります。
[measures](%%jQueryApiUrl%%/ig.OlapFlatDataSource#options:options.measures)|コンマ (,) で区切られたメジャー名のリスト。これは、データ ソースのメジャーになります。

構成の例を示す次の基本サンプルを参照してください。
- [フラット データ ソースへのバインド](%%SamplesUrl%%/pivot-grid/binding-to-flat-data-source)

## <a id='advanced'></a>  詳細の構成

次のセクションでは、カスタム シナリオを構成する方法を示します。

### <a id='custom-move-validation'></a> 移動のカスタム検証

igPivotGridを使用すると、[customMoveValidation](%%jQueryApiUrl%%/ui.igPivotGrid#options:customMoveValidation) 関数を指定できます。これにより、移動操作を許可するかどうかを指定できます。

以下のサンプルでは、PivotGrid の列にアイテムをドロップすることを禁止する方法を示します。また、名前に「Seller」が含まれる階層では、ピボット グリッドおよびデータ セレクターのドロップ領域へのドロップが無効になります。

<div class="embed-sample">
   [移動のカスタム検証](%%SamplesEmbedUrl%%/pivot-grid/custom-drag-drop-validation)
</div>

### <a id='custom-drag-drop'></a> カスタム要素のドラッグ アンド ドロップ

次の手順では、igPivotGrid でカスタム要素のドラッグ アンド ドロップを実装する方法を示します。

#### 手順
1. Data-type 属性および data-name 属性を持つ要素を定義します。

 データ型は、要素の型に設定する必要があります。次元、階層、メジャーまたはレベル。データ名は関連する値でなければなりません。
 たとえば、

 ```html
         <div class="ui-igpivot-metadataitem ui-state-default ui-corner-all custom-draggable"
             data-type="Hierarchy"
             data-name="[Seller].[Seller]"><span>Hierarchy: Seller</span></div>
        <div class="ui-igpivot-metadataitem ui-state-default ui-corner-all custom-draggable"
            data-type="Measure"
            data-name="[Measures].[UnitsSold]"><span>Measure: Units Sold</span></div>
 ```

2. jQuery UI の[ドラッグ可能な](https://jqueryui.com/draggable/)インタラクションを使用して、定義された要素をドラッグ可能にします。

このような例を示す次の基本サンプルを参照してください。

<div class="embed-sample">
   [カスタム要素のドラッグ アンド ドロップ](%%SamplesEmbedUrl%%/pivot-grid/drag-drop-custom-elements)
</div>

### <a id='expand'></a> メンバーの展開

ピボットグリッド内のメンバーをコードで展開するには、[expandTupleMember](%%jQueryApiUrl%%/ui.igPivotGrid#methods:expandTupleMember) メソッドを使用できます。
以下のサンプルは、グリッドのデータ ソースが [dataSourceInitialized](%%jQueryApiUrl%%/ui.igPivotGrid#events:dataSourceInitialized) イベントハンドラーで初期化された場合に、このメソッドを使用する方法を示します。

<div class="embed-sample">
   [メンバーの展開](%%SamplesEmbedUrl%%/pivot-grid/expand-members)
</div>


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a>トピック

このトピックに関連する追加情報については、以下のトピックを参照してください。

- [igPivotGrid の HTML ページへの追加](igPivotGrid-Adding-to-an-HTML-Page.html): このトピックは、`igPivotGrid` を HTML ページへ追加する方法を示します。

- [igPivotGrid の ASP.NET MVC アプリケーションへの追加](igPivotGrid-Adding-Using-the-MVC-Helper.html): このトピックは、ASP.NET MVC アプリケーションへ `igPivotGrid` コントロールを追加する方法についての概念と詳しい手順を説明します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [フラット データ ソースへのバインド](%%SamplesUrl%%/pivot-grid/binding-to-flat-data-source): このサンプルでは、`igPivotGrid` を `igOlapFlatDataSource` にバインドする方法を説明します。データ選択で `igPivotDataSelector` が使用されています。

- [%%ProductNameMVC%% と XMLA データ ソースの使用](%%SamplesUrl%%/pivot-grid/using-the-asp-net-mvc-helper-with-xmla-data-source): このサンプルでは、`igOlapXmlaDataSource`で %%ProductNameMVC%% `igPivotGrid` を使用する方法を紹介します。

- [並べ替え](%%SamplesUrl%%/pivot-grid/sorting): このサンプルでは、`igPivotGrid` の並べ替えを有効にし、初期化で特定のレベルに並べ替えを適用する方法を紹介します。

- [レイアウト モード](%%SamplesUrl%%/pivot-grid/layout-modes): このサンプルでは、コンパクト列と行ヘッダーが有効または無効な場合の `igPivotGrid` のレイアウトを比較します。





 

 



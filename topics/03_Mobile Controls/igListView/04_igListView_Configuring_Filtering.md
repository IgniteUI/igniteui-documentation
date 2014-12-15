<!--
|metadata|
{
    "fileName": "iglistview-configuring-filtering",
    "controlName": "igListView",
    "tags": ["Events","Filtering","How Do I","MVC"]
}
|metadata|
-->

# フィルター処理の構成 (igListView)

## トピックの概要

### 目的

このトピックでは、`igListView`™ のフィルタリング機能を使用する方法を示します。

### 前提条件

以下は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView`™ の機能について説明します。

- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。

- [データ属性リファレンス](igListView-Data-Attributes-Reference.html): このトピックでは、すべての `igListView`™ データ属性の一覧を示します。これらの属性を使用して、マークアップで `igListView` を初期化できます。 


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**プロパティ リファレンス**](#property-reference)
-   [**メソッド リファレンス**](#method-reference)
-   [**イベント リファレンス**](#events-reference)
-   [**HTML における ListView フィルター プリセットの構成**](#presets)
    -   [要件](#presets-requirements)
    -   [概要](#presets-overview)
    -   [手順](#presets-steps)
-   [**HTML における ListView フィルター検索ボックスの構成**](#search-box)
    -   [要件](#search-box-requirements)
    -   [概要](#search-box-overview)
    -   [手順](#search-box-steps)
-   [**MVC における igListView リモート フィルタリングの構成**](#remote-filtering)
    -   [要件](#remote-filtering-requirements)
    -   [概要](#remote-filtering-overview)
    -   [手順](#remote-filtering-steps)
-   [**MVC のフィールド セットに対する igListView フィルター処理の構成**](#set-fields)
    -   [要件](#set-fields-requirements)
    -   [概要](#set-fields-overview)
    -   [手順](#set-fields-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igListView` コントロールには定義済みフィルタリング機能があります。以下のタイプのフィルターがあります。

-   検索ボックスを使用する
-   フィルター プリセットを使用する – オプション ボタン グループのように視覚化された定義済みのフィルター条件です。

ページはローカル、サーバーはリモートにフィルター処理できます。MVC 3 シナリオでは、`igListView` MVC ラッパー機能は、そのまま使用できるリモート フィルタリングをサポートしています。リモート フィルタリングの構成は簡単です。必要なのはアクション メソッドに `ListViewDataSourceAction` 属性を追加するだけです。この属性は、背後で実際のリモート操作を行い、機能をより容易かつトランスペアレントに構成します。

プリセットごとに、プリセットのテキストと `filteredFields` プロパティを設定できます。`filteredFields` 配列の各フィールドについて、`fieldname`、`searchValue`、`condition` の各プロパティを設定できます。

検索バー フィルターを 1 つのフィールド、フィールドのセット、またはすべてのフィールドに設定できます。ただし、最終的に、一度に 1 つのフィールドのみまたは同時にすべてのフィールドを検索できます。

-   1 つのフィールドでフィルター処理するには、`searchBarFieldName` プロパティをフィールドの名前に設定します。また `searchBarCondition` プロパティを `searchBarFieldName` と組み合わせて設定できます。
-   フィールドのセットででフィルター処理するには、`searchBarFields` プロパティをフィルター処理するフィールドの配列に設定します。各フィールドには `fieldName`、`text`、および `condition` の各プロパティを設定できます。検索文字列が検索フィールドに型指定されている場合、[すべてのフィールド] ボタンとともに各検索フィールドのプリセット ボタンが (検索フィルターの下に）表示されます。これらのボタンは、フィルターの範囲を定義します。そのため、個々のフィールドかすべてのフィールドを選択できますが、フィールドのセットは選択できません。フィルターがクリアされると、プリセット ボタンは消えます。
-   検索フィルター プレースホルダーを設定することもできます。これは `searchBarPlaceHolder` プロパティを設定して行います。

-   検索バーとフィルター プリセットはまとめて動作できます。これを行うには、フィルタリング機能でプリセット配列を定義し、`searchBarEnabled` を true に設定する必要があります。

![](images/igListView_Filtering_1.png)



## <a id="property-reference"></a> プロパティ リファレンス

このセクションでは、 `igListView` 並べ替え機能の各種のプロパティを説明します。

以下の表は、`igListView` コントロールの並べ替え機能の主なプロパティの目的と機能の概要を示しています。


プロパティ|説明
---|---
[type](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:type)|フィルタリングのローカルとリモートのいずれかを決定します。
[caseSensitive](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:caseSensitive)|フィルタリングの大文字小文字の区別を有効化／無効化します。
[filterExprUrlKey](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:filterExprUrlKey) |リモート要求に対してフィルタリングの式をエンコードする方法を指定する URL キー名。たとえば、`&filter('col') = startsWith`。デフォルトは `OData` です。
[searchBarEnabled](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:searchBarEnabled) |トレーの検索バーを有効にするかどうか判断します。
[searchBarFields](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:searchBarFields) |エンド ユーザーのキーワード検索構成を有効にするソース中のフィールドのリストです。
[searchBarFieldName](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:searchBarFieldName) |キーワード検索で検索するフィールドです。これが空の場合、すべてのフィールドを検索します。
[searchBarPlaceHolder](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:searchBarPlaceHolder) |検索バーが空の場合、検索バーに表示するプレースホルダーです。
[searchBarCondition](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:searchBarCondition) |`searchBarFieldName` で定義された列のフィルタリング条件です。
[filteredFields](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:filteredFields) |フィルター処理されたフィールドを表すキー/値のペアのリスト (`fieldName`、`searchValue`、`condition`、`logic`) です。
[filterPresetsLabel](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:filterPresetsLabel) |フィルター プリセットの上に表示されるテキストです。
[filterState](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:filterState) |使用するプリセットのインデックスです。何もない場合は `default` です。
[presets](%%jQueryApiUrl%%/mobile.igListViewFiltering#options:presets)|プリセット フィルタリング オプションのリストです。



## <a id="method-reference"></a> メソッド リファレンス
このセクションでは、 `igListView` 並べ替え機能のメソッドを説明します。

以下の表は、`igListView` コントロールの並べ替え機能の主なプロパティの目的と機能の概要を示しています。

<table class="table table-striped">
    <thead>
        <tr>
            <th> メソッド </th>
            <th> 説明 </th>
            <th>パラメーター </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
[filter](%%jQueryApiUrl%%/mobile.igListViewFiltering#methods:filter)
            </td>
            <td> フィルター条件を適用します。 </td>
            <td>
                <ul>
                    <li> `fieldExpressions` </li>
                    <li>`trayText` </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
[destroy](%%jQueryApiUrl%%/mobile.igListViewFiltering#methods:destroy)
            </td>
            <td> igListView フィルタリング機能を削除します。 </td>
            <td> N/A </td>
        </tr>
    </tbody>
</table>





## <a id="events-reference"></a> イベント リファレンス

このセクションでは、 `igListView` 並べ替え機能が実行するイベントを説明します。

以下の表は、`igListView` コントロールのイベントの目的と機能の概要を示します。

イベント|説明|キャンセル可能
---|---|---
[presetChanging](%%jQueryApiUrl%%/mobile.igListViewFiltering#events:presetChanging)|このイベントは、フィルターの並べ替えプリセットが変更される前に発生します。|true
[presetChanged](%%jQueryApiUrl%%/mobile.igListViewFiltering#events:presetChanged)|このイベントは、プリセットが変更され、データが再描画された後に発生します。|false
[keywordChanging](%%jQueryApiUrl%%/mobile.igListViewFiltering#events:keywordChanging) |このイベントは、検索バーのキーワードが変更される前に発生します。|true
[keywordChanged](%%jQueryApiUrl%%/mobile.igListViewFiltering#events:keywordChanged) |このイベントは、検索バーのキーワードが変更された後に発生します。|false
[scopeChanging](%%jQueryApiUrl%%/mobile.igListViewFiltering#events:scopeChanging) |このイベントは、フィルターのスコープ プリセットが変更される前に発生します。|true
[scopeChanged](%%jQueryApiUrl%%/mobile.igListViewFiltering#events:scopeChanged) |このイベントは、スコープ プリセットが変更され、場合によりデータが再表示された後に発生します。|false




## <a id="presets"></a> HTML における ListView フィルター プリセットの構成

この手順では、フィルタリング機能が有効になった `igListView` を初期化し、それを JavaScript 配列にバインドします。フィルタリングはローカルに行われ、プリセットを使用します。Beverages と Dairy という 2 つのフィルタリング プリセットが定義されています。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Filtering_2.png)

### <a id="presets-requirements"></a> 要件

手順を完了するために、Ignite UI %%ProductVersionShort%% 製品をインストールしておく必要があります。

### <a id="presets-overview"></a> 概要

このトピックでは、フィルター プリセットを備えた `igHierarchicalGrid` を構成する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [インフラジスティックス ローダーを使用してスクリプト参照を追加](#js-add-references)
2.  [データ ソースの定義](#js-data-source)
3.  [フィルター プリセットを使用した igListView の宣言型設定の実行](#js-define-markup)
4.  [オプション: JavaScript におけるフィルタリング プリセットを備えた igListView のインスタンスの作成](#js-define-javascript)

### <a id="presets-steps"></a> 手順

以下の手順は、フィルター プリセットを使用して `igListView` ローカル フィルターを構成する方法を示します。

1. インフラジスティックス ローダーを使用してスクリプト参照を追加 <a id="js-add-references"></a>

    フィルタリング機能が有効な `igListView` を初期化する場合に必要な参照リストを以下に示します。ローダーでフィルタリング機能を有効にするには、`resources` プロパティを `igmList.Filtering` に設定する必要があります。
    
    **HTML の場合:**
    
    ```
    <link rel="stylesheet" href="jquery.mobile.structure.min.css" />
    <script type="text/javascript" src="jquery.min.js"></script>
    <script type="text/javascript" src="jquery.mobile.min.js"></script>
    <script type="text/javascript" src="infragistics.mobile.loader.js"></script>
    ```
    
    **JavaScript の場合:**
    
    ```
    <script type="text/javascript">
        $.ig.loader({
            scriptPath: "../js/",
            cssPath: "../css/",
            resources: "igmList.Filtering",
            theme: "ios"
        });
    </script>
    ```

2. データ ソースを定義する <a id="js-data-source"></a>

    **JavaScript の場合:**
    
    ```
    var northwindProducts = [
        { "ProductName": "Chai", "CategoryName": "Beverages", 
            "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 39 },
        { "ProductName": "Chang", "CategoryName": "Beverages", 
            "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 17 },
        { "ProductName": "Uncle Bobu0027s Organic Dried Pears", "CategoryName": "Produce", 
            "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 15 },
        { "ProductName": "Ikura", "CategoryName": "Seafood", 
            "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 31 },
        { "ProductName": "Queso Cabrales", "CategoryName": "Dairy Products", 
            "ImageUrl": "../content/images/nw/categories/4.png", "InStock": 22 },
        { "ProductName": "Rössle Sauerkraut", "CategoryName": "Produce", 
            "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 26 },
        { "ProductName": "Thüringer Rostbratwurst", "CategoryName": "Meat/Poultry", 
            "ImageUrl": "../content/images/nw/categories/6.png", "InStock": 0 },
        { "ProductName": "Nord-Ost Matjeshering", "CategoryName": "Seafood", 
            "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 10 }
    ]
    ```

3. フィルター プリセットを使用した `igListView` の宣言型設定の実行 <a id="js-define-markup"></a>

    このステップでは、多数の data-* 属性を持つ UL (Unordered list) HTML 要素を定義する必要があります。Data-bindings-* を使用してリスト ビューの定義済みプレースホルダーをデータ ソース フィールドにバインドします。Data-filtering-* 属性はフィルタリング機能の構成に使用されます。
    
    プリセットの配列を JavaScript コードとして構成するには、data-filtering-presets 属性を参照してください。
    
    **HTML の場合:**
    
    ```
    <ul id="filterPresetsListView"
        data-role="iglistview" 
        data-auto-generate-layouts="False" 
        data-bindings-header-key="ProductName"
        data-bindings-description-key="CategoryName"
        data-bindings-count-key="InStock"
        data-bindings-image-url-key="ImageUrl"
        data-data-source="northwindProducts" 
        data-data-source-type="json" 
        data-filtering="true" 
        data-filtering-name="Filtering" 
        data-filtering-presets='[         {"text":"Beverages","filteredFields":[{"fieldName":"CategoryName","searchValue":"Beverages","condition":"equals"} ]},         {"text":"Dairy","filteredFields":[ {"fieldName":"CategoryName","searchValue":"Dairy Products","condition":"equals"} ]},         {"text":"Seafood","filteredFields":[ {"fieldName":"CategoryName","searchValue":"Seafood","condition":"equals"} ]},         {"text":"Confections","filteredFields":[ {"fieldName":"CategoryName","searchValue":"Confections","condition":"equals"} ]} ]' 
        data-filtering-search-bar-enabled="false">
    </ul>
    ```

4. オプション: JavaScript におけるフィルタリング プリセットを備えた `igListView` のインスタンスの作成 <a id="js-define-javascript"></a>

    1. HTML プレースホルダーを定義
        
        **HTML の場合:**
        
        ```
        <div id="filterPresetsListView"></div>
        ```
    
    2. JavaScript で `igListView` を初期化
    
        **JavaScript の場合:**
        
        ```
        $(function () {
            $("#filterPresetsListView").igListView({
                dataSource: northwindProducts,
                // bind igListView predefined placeholders to data properties
                bindings: {
                    descriptionKey: "CategoryName",
                    textKey: "ProductName",
                    imageUrlKey: "ImageUrl",
                    countKey: "InStock"
                },
                features: [
                    {
                        // declare local filtering with 2 presets for "Beverages" and "Diary"
                        name: "Filtering",
                        type: "local",
                        searchBarEnabled: false,
                        presets: [
                            {
                                // declare "Beverages" preset to match "CategoryName"
                                // column for string "Beverages"
                                text: "Beverages",
                                filteredFields: [
                                    {
                                        fieldName: "CategoryName",
                                        searchValue: "Beverages",
                                        condition: "equals"
                                    }
                                ]
                            },
                            {
                                // declare "Dairy" preset to match "CategoryName" 
                                // column for string "Dairy Products"
                                text: "Dairy",
                                filteredFields: [
                                    {
                                        fieldName: "CategoryName",
                                        searchValue: "Dairy Products",
                                        condition: "equals"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        });
        ```



## <a id="search-box"></a> HTML における ListView フィルター検索ボックスの構成

この手順では、フィルタリング機能が有効になった `igListView` を初期化し、それを JavaScript 配列にバインドします。フィルタリングはローカルに行われ、検索ボックスを使用します。検索ボックスは `greaterThan` 条件を持つ `InStock` 列で検索するよう定義されています。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Filtering_3.png)

### <a id="search-box-requirements"></a> 要件

手順を完了するために、Ignite UI %%ProductVersionShort%% 製品をインストールしておく必要があります。

### <a id="search-box-overview"></a> 概要

このトピックでは、フィルター プリセットを備えた `igListView` を構成する方法について順を追って説明します。
以下はプロセスの概念的概要です。

1.  [インフラジスティックス ローダーを使用してスクリプト参照を追加](#js-search-box-add-references)
2.  [データ ソースの定義](#js-search-box-data-source)
3.  [検索ボックスを使用した igListView の宣言型設定の実行](#js-search-box-define-markup)
4.  [オプション: JavaScript におけるフィルタリング検索ボックスを備えた igListView のインスタンスの作成](#js-search-box-define-javascript)

### <a id="search-box-steps"></a> 手順

以下の手順は、フィルター プリセットを使用して `igListView` ローカル フィルターを構成する方法を示します。

1. インフラジスティックス ローダーを使用してスクリプト参照を追加 <a id="js-search-box-add-references"></a>

    フィルタリング機能が有効な `igListView` を初期化する場合に必要な参照リストを以下に示します。ローダーでフィルタリング機能を有効にするには、`resources` プロパティを `igmList.Filtering` に設定する必要があります。
    
    **HTML の場合:**
    
    ```
    <link rel="stylesheet" href="jquery.mobile.structure.min.css" />
    <script type="text/javascript" src="jquery.min.js"></script>
    <script type="text/javascript" src="jquery.mobile.min.js"></script>
    <script type="text/javascript" src="infragistics.mobile.loader.js"></script>
    ```
    
    **JavaScript の場合:**
    
    ```
    <script type="text/javascript">
        $.ig.loader({
            scriptPath: "../js/",
            cssPath: "../css/",
            resources: "igmList.Filtering",
            theme: "ios"
        });
    </script>
    ```

2. データ ソースを定義する <a id="js-search-box-data-source"></a>
    
    **JavaScript の場合:**
    
    ```
    var northwindProducts = [
        { "ProductName": "Chai", "CategoryName": "Beverages", 
            "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 39 },
        { "ProductName": "Chang", "CategoryName": "Beverages", 
            "ImageUrl": "../content/images/nw/categories/1.png", "InStock": 17 },
        { "ProductName": "Uncle Bobu0027s Organic Dried Pears", "CategoryName": "Produce", 
            "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 15 },
        { "ProductName": "Ikura", "CategoryName": "Seafood", 
            "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 31 },
        { "ProductName": "Queso Cabrales", "CategoryName": "Dairy Products", 
            "ImageUrl": "../content/images/nw/categories/4.png", "InStock": 22 },
        { "ProductName": "Rössle Sauerkraut", "CategoryName": "Produce", 
            "ImageUrl": "../content/images/nw/categories/7.png", "InStock": 26 },
        { "ProductName": "Thüringer Rostbratwurst", "CategoryName": "Meat/Poultry", 
            "ImageUrl": "../content/images/nw/categories/6.png", "InStock": 0 },
        { "ProductName": "Nord-Ost Matjeshering", "CategoryName": "Seafood", 
            "ImageUrl": "../content/images/nw/categories/8.png", "InStock": 10 }
    ]
    ```

3. 検索ボックスを使用した `igListView` の宣言型設定の実行 <a id="js-search-box-define-markup"></a>

    多くの data-* 属性を含む UL HTML 要素を定義する必要があります。Data-bindings-* を使用してリスト ビューの定義済みプレースホルダーをデータ ソース フィールドにバインドします。Data-filtering- 属性はフィルタリング機能の構成に使用されます。
    
    **HTML の場合:**
    
    ```
    <ul id="filterListView"
        data-role="iglistview" 
        data-auto-generate-layouts="False" 
        data-bindings-header-key="ProductName"
        data-bindings-description-key="CategoryName"
        data-bindings-count-key="InStock"
        data-bindings-image-url-key="ImageUrl"
        data-data-source="northwindProducts" 
        data-data-source-type="json" 
        data-filtering="true" 
        data-filtering-name="Filtering" 
        data-filtering-search-bar-enabled="true"
        data-filtering-search-bar-place-holder="Search for In Stock greater than ..."
        data-filtering-search-bar-field-name="InStock"
        data-filtering-search-bar-condition="greaterThan">
    </ul>
    ```

4. オプション: JavaScript におけるフィルタリング検索ボックスを備えた `igListView` のインスタンスの作成 <a id="js-search-box-define-javascript"></a>

    1. HTML プレースホルダーを定義します。
    
    **HTML の場合:**
    
    ```
    <div id="filterPresetsListView"></div>
    ```
    
    2. JavaScript で `igListView` を初期化します。
    
    **JavaScript の場合:**
    
    ```
    <script type="text/javascript">
        $(function () {
            $("#filterListView").igListView({
                dataSource: northwindProducts,
                // bind igListView predefined placeholders to data properties
                bindings: {
                    descriptionKey: "CategoryName",
                    textKey: "ProductName",
                    imageUrlKey: "ImageUrl",
                    countKey: "InStock"
                },
                features: [
                    {
                        // declare local filtering for InStock field with greaterThan condition
                        name: "Filtering",
                        type: "local",
                        searchBarEnabled: true,
                        searchBarPlaceHolder: "Search for In Stock greater than ...",
                        searchBarFieldName: "InStock",
                        searchBarCondition: "greaterThan"
                    }
                ]
            });
        });
    </script>
    ```


## <a id="remote-filtering"></a> MVC における igListView リモート フィルタリングの構成

この手順では、フィルタリング機能が有効になった `igListView` を Razor コードで初期化します。フィルター操作はサーバーで行われます。検索はすべてのフィールドで行われます。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Filtering_1.png)

### <a id="remote-filtering-requirements"></a> 要件

この手順を実行するには、以下が必要です。

-   Microsoft® Visual Studio 2010 またははそれ以降のバージョンのインストール
-   MVC 3 Framework のインストール
-   Northwind データベースのインストール
-   *Infragistics.Web.Mvc.Mobile.dll* の追加
-   Ignite UI jQuery Mobile ファイルの追加

### <a id="remote-filtering-overview"></a> 概要

このトピックでは、MVCで `igListView` を構成する方法について順を追って説明します。以下はプロセスの概念的概要です。

1.  [Model の定義](#mvc-remote-model)
2.  [View の定義](#mvc-remote-view)
3.  [Controller の定義](#mvc-remote-controller)

### <a id="remote-filtering-steps"></a> 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-remote-model"></a>

    1.  Northwind データベースに Product と Category テーブルの ADO.NET Entity Data Model を追加し、 `NorthwindModel` という名前を付けます。
    
        ![](images/igListView_Filtering_5.png)
    
    2.  フォルダー Models に新しい Class を追加して *ProductViewModel.cs* という名前を付けます。
    
        **C# の場合:**
    
        ```
        public class ProductViewModel
        {
            public string ProductName { get; set; }
            public string CategoryName { get; set; }
            public string ImageUrl { get; set; }
            public int InStock { get; set; }
        }
        ```

2. View の定義 <a id="mvc-remote-view"></a>

    Views フォルダーに新しい View を追加します。*igListViewRemoteFiltering.cshtml* という名前を付けます。
    
    **C# の場合:**
    
    ```
    @model IQueryable<ProductViewModel>
    <script type="text/javascript" src="infragistics.mobile.loader.js"></script>
    @(Html.InfragisticsMobile().
        Loader().
        ScriptPath("../js/").
        CssPath("../css/").
        Render())
    @(Html
        .InfragisticsMobile()
        .ListView(Model)
        .ID("remoteListView")
        .ImageMode(ImageMode.Icon)
        .Bindings(b =>
        {
            b.HeaderKeyFor(p => p.ProductName)
            .DescriptionKeyFor(p => p.CategoryName)
            .CountKeyFor(p => p.InStock)
            .ImageUrlKeyFor(p => p.ImageUrl);
        })
        .Features(features =>
        {
            features
                .Filtering()
                .Type(OpType.Remote);
        })
        .DataSourceUrl(Url.Action("RemoteListViewOperations"))
        .DataBind()
        .Render()
        )
    ```

3. コントローラーの定義 <a id="mvc-remote-controller"></a>

    1. Controllers フォルダーに新しいコントローラーを追加します。それを *ListViewController.cs* と名付けます。
    
    2. 新しい Action をフィルタリング機能を初期化するコントローラーに追加します。`IgListViewRemoteFiltering` という名前を付けます。
    
    3. 別の Action をフィルタリングを行うコントローラーに追加します。`RemoteListViewOperations` という名前を付けます。それに `ListViewDataSourceAction` 属性を追加します。
    
    **C# の場合:**
    
    ```
    public class ListViewController : Controller
    {
        public ActionResult IgListViewRemoteFiltering()
        {
            var productModels = GetProducts(30);
            return View(productModels);
        }
        
        [ListViewDataSourceAction]
        public ActionResult RemoteListViewOperations()
        {
            var productModels = GetProducts(30);
            return View(productModels);
        }
        
        private IQueryable<ProductViewModel> GetProducts(int count)
        {
            var products = (from e in new NorthwindEntities().Products.Include("Category")
                             select e).Take<Product>(count);
            var productModels = new List<ProductViewModel>();
            foreach (var product in products)
            {
                productModels.Add(
                    new ProductViewModel
                    {
                        CategoryName = product.Category.CategoryName,
                        ProductName = product.ProductName,
                        InStock = int.Parse(product.UnitsInStock.ToString()),
                        ImageUrl = _url.Content(
                            String.Format("~/content/images/mobile/categories/{0}.png", 
                            product.CategoryID))
                    });
            }
            return productModels.AsQueryable();
        }
    }
    ```
    




## <a id="set-fields"></a> MVC のフィールド セットに対する igListView フィルター処理の構成

この手順では、フィルタリング機能が有効になった `igListView` を Razor コードで初期化します。フィルター操作はサーバーで行われます。`ProductName` フィールドと `CategoryName` フィールドの検索を行います。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igListView_Filtering_6.png)

### <a id="set-fields-requirements"></a> 要件

-   この手順を実行するには、以下が必要です。
-   -    Microsoft® Visual Studio 2010 またははそれ以降のバージョンのインストール
    -   MVC 3 Framework のインストール
    -   Northwind データベースのインストール
    -   *Infragistics.Web.Mvc.Mobile.dll* の追加
    -   Ignite UI jQuery Mobile ファイルの追加

### <a id="set-fields-overview"></a> 概要

このトピックでは、MVCで `igListView` を構成する方法について順を追って説明します。
以下はプロセスの概念的概要です。

1.  [Model の定義](#mvc-set-model)
2.  [View の定義](#mvc-set-view)
3.  [Controller の定義](#mvc-set-controller)

### <a id="set-fields-steps"></a> 手順

以下の手順は、`igListView` を構成する Model、View、および Controller を定義する方法を示します。

1. Model の定義 <a id="mvc-set-model"></a>

    1.  Northwind データベースに Product と Category テーブルの ADO.NET Entity Data Model を追加し、 `NorthwindModel` という名前を付けます。
    
        ![](images/igListView_Filtering_5.png)
    
    2.  フォルダー Models に新しい Class を追加して *ProductViewModel.cs* という名前を付けます。
    
        **C# の場合:**
    
        ```
        public class ProductViewModel
        {
            public string ProductName { get; set; }
            public string CategoryName { get; set; }
            public string ImageUrl { get; set; }
            public int InStock { get; set; }
        }
        ```

2. View の定義 <a id="mvc-set-view"></a>

    Views フォルダーに新しい View を追加します。*igListViewRemoteFiltering.cshtml* という名前を付けます。
    
    **C# の場合:**
    
    ```
    @model IQueryable<ProductViewModel>
    <script type="text/javascript" src="infragistics.mobile.loader.js"></script>
    @(Html.InfragisticsMobile().
        Loader().
        ScriptPath("../js/").
        CssPath("../css/").
        Render())
    @(Html
        .InfragisticsMobile()
        .ListView(Model)
        .NumberedList(true)
        .ID("basicFilteringListView")
        .ImageMode(ImageMode.Icon)
        .Bindings(b =>
        {
            b.TextKey("ProductName")
            .DescriptionKey("CategoryName")
            .CountKey("InStock")
            .ImageUrlKey("ImageUrl");
        })
        .Features(features =>
            features
            .Filtering()
            .SearchBarPlaceHolder("Search for Product or Category ...")
            .SearchBarFields(fields =>
            {
                fields.SearchBarFieldFor(p => p.ProductName).Text("Product");
                fields.SearchBarFieldFor(p => p.CategoryName).Text("Category");
            })
            .Type(OpType.Remote);
        )
        .DataSourceUrl(Url.Action("RemoteListViewOperations"))
        .DataBind()
        .Render()
    )
    ```

3. コントローラーの定義 <a id="mvc-set-controller"></a>

    1. Controllers フォルダーに新しいコントローラーを追加します。それを *ListViewController.cs* と名付けます。
    
    2. 新しい Action をフィルタリング機能を初期化するコントローラーに追加します。`IgListViewRemoteFiltering` という名前を付けます。
    
    3. 別の Action をフィルタリングを行うコントローラーに追加します。`RemoteListViewOperations` という名前を付けます。
    
    それに `ListViewDataSourceAction` 属性を追加します。
    
    **C# の場合:**
    
    ```
    public class ListViewController : Controller
    {
        public ActionResult IgListViewRemoteFiltering()
        {
            var productModels = GetProducts(30);
            return View(productModels);
        }
        
        [ListViewDataSourceAction]
        public ActionResult RemoteListViewOperations()
        {
            var productModels = GetProducts(30);
            return View(productModels);
        }
        
        private IQueryable<ProductViewModel> GetProducts(int count)
        {
            var products = (from e in new NorthwindEntities().Products.Include("Category")
                             select e).Take<Product>(count);
            var productModels = new List<ProductViewModel>();
            foreach (var product in products)
            {
                productModels.Add(
                    new ProductViewModel
                    {
                        CategoryName = product.Category.CategoryName,
                        ProductName = product.ProductName,
                        InStock = int.Parse(product.UnitsInStock.ToString()),
                        ImageUrl = _url.Content(
                            String.Format("~/content/images/mobile/categories/{0}.png",
                            product.CategoryID))
                    });
            }
            return productModels.AsQueryable();
        }
    }
    ```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [並べ替えの構成](igListView-Configuring-Sorting.html): このトピックでは、`igListView` Sorting 機能を構成する方法について説明します。

- [ロード オン デマンドの構成](igListView-Configuring-Load-on-Demand.html): このトピックでは `igListView` でロード オン デマンドを構成する方法を説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [並べ替えとグループ化のプリセット](%%SamplesUrl%%/mobile-list-view/sort-group-presets): このサンプルでは、グループ化と一緒にローカル並べ替えを示します。

- [リモート機能](%%SamplesUrl%%/mobile-list-view/remote-features): このサンプルでは、グループ化と一緒にリモート並べ替えを示します。

- [検索](%%SamplesUrl%%/mobile-list-view/search): このサンプルでは、検索ボックスのあるフィルター処理を構成する方法を示します。






 

 



<!--
|metadata|
{
    "fileName": "creating-a-basic-column-template-in-the-iggrid",
    "controlName": "igGrid",
    "tags": ["Grids","How Do I","Templating"]
}
|metadata|
-->

# 基本的な列テンプレートの作成 (igGrid)

## トピックの概要

### 目的

このトピックでは、`igGrid`™ コントロールの基本的な列テンプレートを作成する方法を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**igGrid での基本的な列テンプレートの作成**](#basic-tempalte)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)



## <a id="basic-tempalte"></a> igGrid での基本的な列テンプレートの作成

この例では、基本的な列テンプレートをグリッドに適用します。追加の非バインド列がグリッドに追加されます。セルにボタンを描画するテンプレートを持ちます。

### <a id="preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。赤いアウトラインで囲まれた列にのみ列テンプレートが適用されます。

![](images/GridColumnTemplateWalkthough_1.png)

### <a id="prerequisites"></a> 前提条件

手順を完了するには空の HTML ページが必要です。

### <a id="steps"></a> 手順

以下のステップでは、`igGrid` の基本的な列テンプレートを作成する方法を紹介します。

1. HTML ページを準備

	HTML ページを準備するには、`igLoader` を追加し、`igGrid` リソースをロードするよう構成します。
	
	**JavaScript の場合:**
	
	```js
	<script src="http://localhost/ig_ui/js/infragistics.loader.js"></script>
	<script type="text/javascript">
		$.ig.loader({
			scriptPath: "http://localhost/ig_ui/js/",
			cssPath: "http://localhost/ig_ui/css/",
			resources: "igGrid"
		});
	</script>
	```

2. 列テンプレートを追加して適用

	1. ページにサンプル データを追加し、ページの本文にテーブル タグ付けします。
	
		**JavaScript の場合:**
		
		```js
        <script src="http://www.igniteui.com/data-files/adventureworks.min.js"></script>
        ```
		
		**HTML の場合:**
		
		```html
        <body>
            <table id="grid1"></table>
        </body>
        ```
	
	2. 列テンプレートを設定した igGrid を追加します。
	
		**JavaScript の場合:**
		
		```js
		<script type="text/javascript">
            $.ig.loader(function () {
                $("#grid").igGrid({
                    autoGenerateColumns: false,
                    width: "100%",
                    height: "500px",
                    columns: [
                        { headerText: "Product ID", key: "ProductID", dataType: "number", width: "15%" },
                        { headerText: "Product Name", key: "Name", dataType: "string", width: "25%" },
                        { headerText: "Product Number", key: "ProductNumber", dataType: "string", width: "25%" },
                        { headerText: "Make Flag", key: "MakeFlag", dataType: "bool", width: "15%" },
                        {
                            headerText: "", 
                            key: "Delete", 
                            dataType: "string", 
                            width: "20%", 
                            unbound: true, 
                            template: "<input type='button' onclick='deleteRow(${ProductID})' value='Delete row' class='delete-button'/>"
                        }
                    ],
                    primaryKey: "ProductID",
                    dataSource: adventureWorks
                });
            });
            </script>
		```

	3. 行を削除する関数を作成します。
	
	**JavaScript の場合:**
	```js
            <script type="text/javascript">
                function deleteRow(rowId) {
                    var grid = $("#grid").data("igGrid");
                    grid.dataSource.deleteRow(rowId);
                    grid.commit();
                }
            </script>
        ```
		
	4. 結果を確認します。

	以下のサンプルは結果のプレビューです。

<div class="embed-sample">
   [列テンプレート](%%SamplesEmbedUrl%%/grid/column-template)
</div>

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Infragistics テンプレート エンジン](igTemplating-Overview.html): このセクションには、Infragistics® テンプレート エンジンの使用に関するトピックが含まれています。



 

 



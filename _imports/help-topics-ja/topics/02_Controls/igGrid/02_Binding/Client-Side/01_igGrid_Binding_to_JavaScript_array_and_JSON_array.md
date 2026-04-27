<!--
|metadata|
{
    "fileName": "iggrid-binding-to-javascript-array-and-json-array",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# igGrid を JavaScript 配列および JSON 配列にバインディング (igGrid)


このドキュメントは、`igGrid` コントロールを JSON 配列、JavaScript 配列、および HTML テーブル要素にバインドする方法を説明します。

## クライアント側データへのバインド

以下の手順は、`igGrid` コントロールをクライアント側データにバインドする方法を示しています。

1.  最初に、アプリケーションに必要なローカライズ済みのリソースを含めます。組み込むリソースの詳細は、「[%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」ヘルプ トピックをご覧ください。
2.  HTML ページに必要な JavaScript および CSS ファイルを参照してください。

    **JavaScript の場合:**

    ```js
    <script src="scripts/jquery.js" type="text/javascript"></script>
    <script src="scripts/jquery-ui.js" type="text/javascript"></script>
    <script src="scripts/infragistics.core.js" type="text/javascript"></script>
	<script src="scripts/infragistics.lob.js" type="text/javascript"></script>
    <link href="css/themes/infragistics/infragistics.theme.css" rel="stylesheet" type="text/css" />
    <link href="css/structure/infragistics.css" rel="stylesheet" type="text/css" />
    ```

3.  次に、必要なクライアント側データ ソースを追加します。

    -   JSON 配列:

	    **JavaScript の場合:**
	
	    ```js
	    var data = [ 
			{ "Name": "John Smith", "Age": 45 },
			{ "Name": "Mary Johnson", "Age": 32 },
			{ "Name": "Bob Ferguson", "Age": 27 }
		];
	    ```

    -   JavaScript 配列:

	    **JavaScript の場合:**
	
	    ```js
	    arrayOfArraysData = [
			["AED", "Emirati Dirham", "Jun  1 1998 12:00AM"],
			["AFA", "Afghani", "Jun  1 1998 12:00AM"],
			["ALL", "Lek", "Jun  1 1998 12:00AM"],
			["AMD", "Armenian Dram", "Jun  1 1998 12:00AM"],
			["ANG", "Netherlands Antillian Guilder", "Jun  1 1998 12:00AM"],
			["AOA", "Kwanza", "Jun  1 1998 12:00AM"],
			["ARS", "Argentine Peso", "Jun  1 1998 12:00AM"],
			["ATS", "Shilling", "Jun  1 1998 12:00AM"],
			["AUD", "Australian Dollar", "Jun  1 1998 12:00AM"],
			["AWG", "Aruban Guilder", "Jun  1 1998 12:00AM"],
			["AZM", "Azerbaijanian Manat", "Jun  1 1998 12:00AM"],
		];
	    ```

    -   HTML テーブル:

	    **HTML の場合:**
	
		```html
		<table id="t1" cellpadding="5" cellspacing="0" border="1">
			<thead>
			    <tr>
			        <th>
			           Product ID 
			        </th>
			        <th>
			          Product Name
			        </th>
			        <th>
			          Product Number  
			        </th>
			    </tr>
			</thead>
			<tbody>
			    <tr><td>1</td><td>Adjustable Race</td><td>AR-5381</td></tr>
			    <tr><td>2</td><td>Bearing Ball</td><td>BA-8327</td></tr>
			    <tr><td>3</td><td>BB Ball Bearing</td><td>BE-2349</td></tr>
			    <tr><td>4</td><td>Headset Ball Bearings</td><td>BE-2908</td></tr>
			    <tr><td>316</td><td>Blade</td><td>BL-2036</td></tr>
			    <tr><td>317</td><td>LL Crankarm</td><td>CA-5965</td></tr>
			    <tr><td>318</td><td>ML Crankarm</td><td>CA-6738</td></tr>
			    <tr><td>319</td><td>HL Crankarm</td><td>CA-7457</td></tr>
			    <tr><td>320</td><td>Chainring Bolts</td><td>CB-2903</td></tr>
			    <tr><td>321</td><td>Chainring Nut</td><td>CN-6137</td></tr>
			</tbody>
		</table>
		```

4.  jQuery クライアント側グリッドの初期化:

    - JSON 配列:
        
	    **HTML の場合:**

        ```html
        <table id=”grid1”></table>
        ```

		**JavaScript の場合:**

	    ```js
	    $(function () {
            $("#grid1").igGrid({
                dataSource: data
            });
        });
	    ```
		
		**igGrid JSON のバインドを表示するサンプル**
		<div class="embed-sample">
			[igGrid JSON のバインド](%%SamplesEmbedUrl%%/grid/json-binding)
		</div>
		
    -   JavaScript 配列:

	    **HTML の場合:**
	
	    ```html
	    <table id=”grid1”></table>
	    ```
	
	    **JavaScript の場合:**
	
	    ```js
	    $(function () {
            $("#grid1").igGrid({
               autoGenerateColumns: false,
                columns: [
                    { headerText: "Employee ID", key: "ProductID", dataType: "string" },
                    { headerText: "Name", key: "Name", dataType: "string" },
                    { headerText: "Date", key: "ProductNumber", dataType: "string" },
                ],
                dataSource: arrayOfArraysData,
                
            });
        });
	    ```
    -   HTML テーブル:

		**JavaScript の場合:**

        ```js
        $("#grid1").igGrid({
           autoGenerateColumns: false,
            columns: [
        		{ key: 1, width: "100px", dataType: "number", headerText: "[Custom Header]" }
            ],
        	defaultColumnWidth: 150    
        });
        ```

## 関連リンク

-   [DataSource 用テーブルのサンプル](iggrid-binding-to-datatable.html)
-   [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html)
-   [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 



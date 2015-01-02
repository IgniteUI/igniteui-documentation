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

[**DataSource 用テーブルのサンプル**](%%SamplesUrl%%/grid/datatable-binding)

1.  最初に、アプリケーションに必要なローカライズ済みのリソースを含めます。組み込むリソースの詳細は、「[Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」ヘルプ トピックをご覧ください。
2.  HTML ページに必要な JavaScript および CSS ファイルを参照してください。

    **JavaScript の場合:**

    ```
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
	
	    ```
	    products = [];
        products[0] = { "ProductID": 1, "Name": "Adjustable Race", "ProductNumber": "AR-5381" };
        products[1] = { "ProductID": 2, "Name": "Bearing Ball", "ProductNumber": "BA-8327" };
        products[2] = { "ProductID": 3, "Name": "BB Ball Bearing", >"ProductNumber": "BE-2349" };
        products[3] = { "ProductID": 4, "Name": "Headset Ball Bearings", "ProductNumber": "BE-2908" };
        products[4] = { "ProductID": 316, "Name": "Blade", "ProductNumber": "BL-2036" };
        products[5] = { "ProductID": 317, "Name": "LL Crankarm", "ProductNumber": "CA-5965" };
        products[6] = { "ProductID": 318, "Name": "ML Crankarm", "ProductNumber": "CA-6738" };
        products[7] = { "ProductID": 319, "Name": "HL Crankarm", "ProductNumber": "CA-7457" };
        products[8] = { "ProductID": 320, "Name": "Chainring Bolts", "ProductNumber": "CB-2903" };
        products[8] = { "ProductID": 321, "Name": "Chainring Nut", "ProductNumber": "CN-6137" };
	    ```

    -   JavaScript 配列:

	    **JavaScript の場合:**
	
	    ```
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
	
		```
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

        ```
        <table id=”grid1”></table>
        ```

		**JavaScript の場合:**

	    ```
	    $(function () {
            $("#grid1").igGrid({
                columns: [
                    { headerText: "Product ID", key: "ProductID", dataType: "number" },
                    { headerText: "Product Name", key: "Name", dataType: "string" },
                    { headerText: "Product Number", key: "ProductNumber", dataType: "string" },
                ],
                width: '500px',
                dataSource: products
            });
        });
	    ```
    -   JavaScript 配列:

	    **HTML の場合:**
	
	    ```
	    <table id=”grid1”></table>
	    ```
	
	    **JavaScript の場合:**
	
	    ```
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

        ```
        $("#grid1").igGrid({
           autoGenerateColumns: false,
            columns: [
        		{ key: 1, width: "100px", dataType: "number", headerText: "[Custom Header]" }
            ],
        	defaultColumnWidth: 150    
        });
        ```

## 関連リンク

-   [DataSource 用テーブルのサンプル](%%SamplesUrl%%/grid/datatable-binding)
-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)
-   [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 



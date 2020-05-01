<!--
|metadata|
{
    "fileName": "iggrid-overview",
    "controlName": "igGrid",
    "tags": ["Getting Started","Grids"]
}
|metadata|
-->

# igGrid の概要

## igGrid の概要

`igGrid` は、表形式データの表示および操作に使用される jQuery ベースのクライアント側グリッドです。そのライフサイクル全体はクライアント側に存在し、サーバー側の技術からは独立しています。

![](images/igGrid_Overview_01.png) 

## 機能

`igGrid` コントロールでは、次のように多数の異なる機能がサポートされています。

-   列サイズの変更
-   列の非表示
-   列の集計
-   行セレクター
-   Groupby
-   ツールチップ
-   並べ替え
-   フィルタリング
-   ページング
-   選択
-   更新
-   jQuery テンプレート
-   バーチャル スクロール

さらに、このグリッドは次もサポートしています。

-   高機能データ操作
-   キーボード ナビゲーション
-   豊富なクライアント側 API
-   ASP.NET MVC ラッパー

## %%ProductFamilyName%% CLI で igGrid を追加

新しい igGrid を簡単にアプリケーションに追加するには、%%ProductFamilyName%% CLI を使用します。

%%ProductFamilyName%% CLI のインストール:

```
npm install -g igniteui-cli
```

%%ProductFamilyName%% CLI インストール後、%%ProductFamilyName%% プロジェクトを生成し、新しい igGrid コンポーネントを追加してプロジェクトをビルドおよび公開すためにカスタム コマンドを実行するには、以下のコマンドを使用します。

```
ig new <project name>
cd <project name>
ig add grid newGrid
ig start
```

すべての利用可能なコマンドおよび詳細な情報については、[「%%ProductFamilyName%% CLI の使用」](Using-Ignite-UI-CLI.html)のトピックを参照してください。

## igGrid の Web ページへの追加

次のステップは、いずれかの jQuery クライアント コードを使用して、Web ページに jQuery グリッドの基本的な実装を作成する方法を示します。どの実装を選択するかについて詳細は、[「%%ProductName%% の概要」](IgniteUI-for-jQuery-Overview.html)を参照してください。

[igGrid の概要のサンプル](%%SamplesUrl%%/grid/overview)

最初に、アプリケーションに必要なローカライズ済みのリソースを含めます。組み込むリソースの詳細は、「[%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」ヘルプ トピックをご覧ください。

1.  HTML ページに**必要な JavaScript および CSS ファイルを参照**してください。**HTML の場合:**

    ```html
    <script src="scripts/jquery.js" type="text/javascript"></script>
    <script src="scripts/jquery-ui.js" type="text/javascript"></script>
    <script src="scripts/infragistics.core.js" type="text/javascript"></script><script src="scripts/infragistics.lob.js" type="text/javascript"></script>
    <link href="css/themes/infragistics/infragistics.theme.css" rel="stylesheet" type="text/css" />
    <link href="css/structure/infragistics.css" rel="stylesheet" type="text/css" />
    ```

2. 次に、グリッドのデータ ソースとしての役割を果たす **JSON 配列**を参照して追加します。
    ```html
    <!--Sample JSON Data-->
    <script src="http://www.igniteui.com/data-files/northwind.js"></script>
     ```

3. 与えられたデータを描画するために *igGrid* が使用する**テーブル DOM 要素を定義**します。

    **HTML の場合:**

    ```html
	<div style="height:300px;">
	    <table id="grid"></table>
	</div>
    ```

4. 上記のセットアップが完了したら、*ID*、*columns*、*dataSource* などの**オプションを設定**します。

    1.  [columns](%%jQueryApiUrl%%/ui.iggrid#options:columns) - `igGrid` の列オブジェクト定義。
        -   `headerText` - 列のヘッダーのテキスト。正しく動作しなくなる機能があるため、HTML タグを使用しないでください。
        -   `key` - データ ソースのキー フィールドの名前。
        -   `dataType` - 列のデータ型。「string」、「number」または「date」を指定できます。

    2.  [dataSource](%%jQueryApiUrl%%/ui.iggrid#options:dataSource) - `igGrid` がデータを表示しているデータ。次のようなオプションがあります。
	    -   JSON オブジェクト
	    -   JavaScript 配列
	    -   XML
	    -   リモート データ
	    -   テーブル DOM 要素
	    
	    **JavaScript の場合:**
	
	    ```js
	    $(function () {
            $("#grid").igGrid({
                autoGenerateColumns: false,
                renderCheckboxes: true,
                primaryKey: "EmployeeID",
                columns: [{
                    // note: if primaryKey is set and data in primary column contains numbers,
                    // then the dataType: "number" is required, otherwise, dataSource may misbehave
                    headerText: "Employee ID", key: "EmployeeID", dataType: "number"
                },
                {
                    headerText: "First Name", key: "FirstName", dataType: "string"
                },
                {
                    headerText: "Last Name", key: "LastName", dataType: "string"
                },
                {
                    headerText: "Title", key: "Title", dataType: "string"
                },
                {
                    headerText: "Birth Date", key: "BirthDate", dataType: "date"
                },
                {
                    headerText: "Postal Code", key: "PostalCode", dataType: "string"
                },
                {
                    headerText: "Country", key: "Country", dataType: "string"
                }
                ],
                dataSource: northwind,
                dataSourceType: "json",
                responseDataKey: "results",
                height: "100%",
                width: "100%",
                tabIndex: 1,
                features: [
                    {
                        name: "Selection",
                        mode: "row",
                        multipleSelection: true
                    },
                    {
                        name: "Paging",
                        pageSize: 5
                    },
                    {
                        name: "Filtering"
                    }
                ]
            });
        });
	    ```

5.  Web ページを実行します。`igGrid` は JSON 配列にバインドし、データを表示します。

     ![](images/igGrid_Overview_02.png)

6. サンプル
<div class="embed-sample">
    [igGrid グリッド API およびイベント](%%SamplesEmbedUrl%%/grid/grid-api-events)
</div>

## 関連コンテンツ

### トピック

-   [igGrid/igDataSource アーキテクチャの概要](igGrid-igDataSource-Architecture-Overview.html)
-   [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html) 
-   [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)


 



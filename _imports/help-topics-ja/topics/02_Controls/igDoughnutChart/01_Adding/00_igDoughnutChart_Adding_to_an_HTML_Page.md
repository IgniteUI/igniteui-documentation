<!--
|metadata|
{
    "fileName": "igdoughnutchart-adding-to-an-html-page",
    "controlName": "Doughnut Chart",
    "tags": ["Charting","Data Binding","Getting Started","How Do I"]
}
|metadata|
-->

# igDoughnutChart の HTML ページへの追加

## トピックの概要

### 目的

このトピックは、`igDoughnutChart`™ を HTML ページに追加する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [必要なリソースの手動で追加する](Adding-the-Required-Resources-for-IgniteUI-for-jQuery.html): このトピックは、必要な JavaScript リソースを追加して %%ProductName%% ライブラリからコントロールを使用する場合の全般的なガイダンスを提供します。

- [*igDoughnutChart* の概要](igDoughnutChart-Overview.html): このトピックは、`igDoughnutChart` コントロールの概要を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [***igDoughnutChart* を HTML ページに追加 - 概要**](#overview)
    -   [要件](#overview-requirements)
    -   [手順](#overview-steps)
-   [***igDoughnutChart* の HTML ページへの追加**](#adding)
	-   [プレビュー](#adding-preview)
    -   [前提条件](#prerequisites)
    -   [概要](#adding-overview)
    -   [手順](#adding-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a> igDoughnutChart を HTML ページに追加 - 概要

ドーナツ型チャートは、カテゴリ データをパーセンテージで表示する場合に使用します。中央の円がくりぬかれ、内径が構成可能で、同心リングを使用するドーナツ型チャートは、複数のシリーズを表示することができます。プロパティを構成するかテーマを適用することで、チャートのスタイルを設定できます。

### <a id="overview-requirements"></a> 要件

以下の表で、`igDoughnutChart` コントロールを使用するための要件を簡単に説明します。

<table class="table table-bordered">
	<tbody>
		<tr>
			<th>
				必要なリソース
			</th>

			<th>
				説明
			</th>

			<th>
				必要な作業
			</th>
		</tr>

		<tr>
			<td>
				jQuery および jQuery UI JavaScript リソース
			</td>

			<td>
				%%ProductName%%™ は、以下のフレームワークをもとにビルドされます。

				<ul>
                    <li>
                    [jQuery](http://jquery.com/)
                    </li>

                    <li>
                    [jQuery UI](http://jqueryui.com/)
                    </li>
				</ul>
			</td>

			<td>
				ページの `<head>` セクションで両方のライブラリにスクリプト参照を追加します。
			</td>
		</tr>

		<tr>
			<td>
				igDoughnutChart CSS リソース ファイル
			</td>

			<td>
				コントロールの各種の要素の描画には、以下の CSS ファイルからのスタイルを使用します。<br>
				&lt;IG CSS root&gt;/structure/modules/infragistics.ui.html5.css<br>
				&lt;IG CSS root&gt;/structure/modules/infragistics.ui.shared.css<br>
				&lt;IG CSS root&gt;/structure/modules/infragistics.ui.chart.css
			</td>

			<td></td>
		</tr>

		<tr>
			<td>
				全般的な `igDoughnutChart` JavaScript リソース
			</td>

			<td>
				igDoughnutChart コントロールは、%%ProductName%% ライブラリ内の複数のファイルで提供される機能に依存します。以下のいずれかの方法で、必要なリソースを読み込みます。

				<ul>
					<li>Infragistics® Loader (igLoader™) を使用します。ページ上に igLoader へのスクリプト参照を含めるのみです。</li>

					<li>必要なリソースの手動による読み込み以下の表にリストされる依存関係を使用する必要があります。</li>

					<li>%%ProductName%% パッケージのすべてのデータ ビジュアライゼーション コントロールのロジックを含む 2 つの結合ファイル (infragistics.core.js および infragistics.dv.js) の読み込み</li>
				</ul>

				以下の表は、igDoughnutChart コントロール関連の %%ProductName%% ライブラリの依存関係を示します。igLoader または結合ファイルを使用しない場合は、以下のリソースを参照してください。

				<table class="table">
					<tbody>
						<tr>
							<th>
								JS リソース
							</th>

							<th>
								説明
							</th>
						</tr>

						<tr>
							<td>
								infragistics.util.js<br>
								infragistics.util.jquery.js
							</td>

							<td>
								%%ProductName%% ユーティリティ
							</td>
						</tr>

						<tr>
							<td>
								infragistics.datasource.js
							</td>

							<td>
								データ ソース フレームワーク
							</td>
						</tr>

						<tr>
							<td>
								infragistics.templating.js
							</td>

							<td>
								テンプレート エンジン (igTemplate™)
							</td>
						</tr>
						
						<tr>
							<td>
								infragistics.ui.widget.js
                            </td>
							<td>
								すべての %%ProductName%% ウィジェットの基本 igWidget。
							</td>
						</tr>
						
						<tr>
							<td>
								infragistics.ext_core.js,<br>
								infragistics.ext_collections.js,<br>
								infragistics.ext_ui.js,<br>
								infragistics.dv_jquerydom.js,<br>
								infragistics.dv_core.js,<br>
								infragistics.dv_geometry.js
							</td>

							<td>
								データ可視化コア機能
							</td>
						</tr>
						
						<tr>
							<td>
								infragistics.datachart_core.js
							<td>
								共有チャート ビジュアライゼーションの機能
							</td>
						</tr>
						
						<tr>
							<td>
								infragistics.dv_interactivity.js
                            </td>
							<td>
								パンニング、ズーム、ドラッグなどのユーザー インタラクションのサポートを提供します。
							</td>
						</tr>

						<tr>
							<td>
								infragistics.piechart.js
							</td>

							<td>
								円チャート ビジュアライゼーション ロジック
							</td>
						</tr>

						<tr>
							<td>
								infragistics.doughnutchart.js
							</td>

							<td>
								ドーナツ型チャート ビジュアライゼーション ロジック
							</td>
						</tr>

						<tr>
							<td>
								infragistics.legend.js
							</td>

							<td>
								凡例機能の共有チャート コード
							</td>
						</tr>

						<tr>
							<td>
								infragistics.dvcommonwidget.js
							</td>

							<td>
								チャートおよびマップの共通ウィジェット
							</td>
						</tr>

						<tr>
							<td>
								infragistics.ui.chartlegend.js
							</td>

							<td>
								igChartLegend™ コントロールは、%%ProductName%% のすべてのチャート コントロールに共通します。
							</td>
						</tr>

						<tr>
							<td>
								infragistics.ui.basechart.js
							</td>

							<td>
								チャート ウィジェット用の共通コード
							</td>
						</tr>

						<tr>
							<td>
								infragistics.ui.chart.js
							</td>

							<td>
								`igDataChart` ウィジェット UI コード
							</td>
						</tr>

						<tr>
							<td>
								infragistics.ui.doughnutchart.js
							</td>

							<td>
								igDoughnutChart ウィジェット UI コード
							</td>
						</tr>
					</tbody>
				</table><br>
			</td>

			<td>
				以下のいずれかを追加します。

				<ul>
					<li>igLoader への参照</li>

					<li>すべての必要な JavaScript ファイルへの参照 (左側の表に一覧表示)</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				IG テーマ (オプション)
			</td>

			<td>
				このテーマには、%%ProductName%% ライブラリ用のビジュアル スタイルが含まれます。テーマ ファイル: &lt;IG CSS root&gt;/themes/Infragistics/infragistics.theme.css
			</td>

			<td></td>
		</tr>
	</tbody>
</table>

### <a id="overview-steps"></a>手順
`igDoughnutChart` を HTML ページへ追加するための一般的な手順を簡単に示すと、以下のようになります。

1. 必要な JavaScript および CSS ファイルの参照
2. サンプル データの追加
3. `igDoughnutChart` のターゲット要素の作成
4. document ready での `igDoughnutChart` のインスタンス作成
5. シリーズの構成

## <a id="adding"></a> igDoughnutChart の HTML ページへの追加

この手順では、`igDoughnutChart` のインスタンスを HTML ページに追加し、コントロールの基本的なオプションであるサイズを構成し、`name`、`dataSource` および `valueMemberPath` を使用して、1 つのシリーズを定義します。

### <a id="adding-preview"></a> プレビュー

以下のスクリーンショットは結果のプレビューです。

![](images/igDoughnutChart_Adding_igDoughnutChart_to_an_HTML_Page_1.png)

### <a id="prerequisites"></a>前提条件

空白の HTML ページ

### <a id="adding-overview"></a> 概要

1.  必要な JavaScript および CSS ファイルの参照
2.  サンプル データの追加
3.  `igDoughnutChart` 用のターゲット要素の作成
4.  document ready での `igDoughnutChart` のインスタンス作成
5.  シリーズの構成

### <a id="adding-steps"></a> 手順

これらの手順に従って、HTML ページに `igDoughnutChart` を追加します。

1. **必要な JavaScript および CSS ファイルを参照します。**

	**HTML の場合:**
	
	```html
	<!DOCTYPE html>
    <html>
    <head>
    <!-- %%ProductName%% IG Theme CSS File -->
	<link href="../../igniteui/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
	<!-- %%ProductName%% Required CSS File -->
	<link rel="stylesheet" type="text/css" href="../../igniteui/css/structure/modules/infragistics.ui.html5.css"/>
	<link rel="stylesheet" type="text/css" href="../../igniteui/css/structure/modules/infragistics.ui.shared.css"/>
	<link rel="stylesheet" type="text/css" href="../../igniteui/css/structure/modules/infragistics.ui.chart.css"/>
	<!-- jQuery Files -->
	<script src="../../js/jquery.min.js"></script>
	<script src="../../js/jquery-ui.min.js"></script>
	<!-- %%ProductName%% Required JavaScript Files -->
	<script src="../../igniteui/js/modules/infragistics.util.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.util.jquery.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.widget.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.datasource.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.templating.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ext_core.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ext_collections.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ext_ui.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dv_jquerydom.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dv_core.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.legend.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dv_geometry.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dv_interactivity.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.datachart_core.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dvcommonwidget.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.chartlegend.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.chart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.piechart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.doughnutchart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.basechart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.doughnutchart.js" type="text/javascript"></script>
    </head>
    <body>
    </body>
    </html>
	```

2. **サンプル データを追加します。**

	サンプル データを `igDoughnutChart` のシリーズのデータ ソースとして使用し、JavaScript 配列を定義します。
	
	**HTML の場合:**
	
	```html
	<head>...    
        <script>      
			var data = [
                  { "ProductCategory": ' Footwear', "Index": 1498 },
                    { "ProductCategory": ' Clothing', "Index": 1389 },
                    { "ProductCategory": ' Books', "Index": 352 },
                    { "ProductCategory": ' Accessories', "Index": 273 },
                    { "ProductCategory": ' Equipment', "Index": 100 }
                ];
    			 ...
           </script>
     </head>
	```

3. ***igDoughnutChart* 用のターゲット要素を作成します。**

	`igDoughnutChart` ウィジェットのインスタンスを作成する HTML 本文内に DIV 要素を作成します。
	
	**HTML の場合:**
	
	```html
	<body>
        <!-- Target element for the igDoughnutChart -->
        <div id="doughnutChart"></div>
    </body>
    …
	```

4. **document ready での *igDoughnutChart* のインスタンスを作成します。**

	前に定義したターゲット要素のセレクターを使用して、ウィジェットのインスタンスを作成します。
	
	**HTML の場合:**
	
    ```html
    <script type="text/jscript">
        $(function () {                        
                  $("#doughnutChart").igDoughnutChart ({
            });
            });
    </script>
    ```

5. **基本的な描画オプションを構成します。**

	`igDoughnutChart` のインスタンスを作成するときに、width および height オプションを構成し、`name`、`dataSource`、`valueMemberPath` オプションを指定して、インスタンスにシリーズを追加します。
	
	**HTML の場合:**
	
	```html
	$(function () {
                var dc = $("#doughnutChart").igDoughnutChart({
                  width: 300,
                  height: 300,
                  series: [
                {
                      name: "flatSeries",
                      valueMemberPath: "Index",
                      dataSource: data
                  }
            ]
       });
    });
	```

#### 完全なコード

**HTML の場合:**

```html
<!DOCTYPE html>
<html>
<head>
<title>DoughnutChart</title>
<!-- %%ProductName%% IG Theme CSS File -->
	<link href="../../igniteui/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
	<!-- %%ProductName%% Required CSS File -->
	<link rel="stylesheet" type="text/css" href="../../igniteui/css/structure/modules/infragistics.ui.html5.css"/>
	<link rel="stylesheet" type="text/css" href="../../igniteui/css/structure/modules/infragistics.ui.shared.css"/>
	<link rel="stylesheet" type="text/css" href="../../igniteui/css/structure/modules/infragistics.ui.chart.css"/>
	<!-- jQuery Files -->
	<script src="../../js/jquery.min.js"></script>
	<script src="../../js/jquery-ui.min.js"></script>
	<!-- %%ProductName%% Required JavaScript Files -->
	<script src="../../igniteui/js/modules/infragistics.util.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.util.jquery.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.widget.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.datasource.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.templating.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ext_core.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ext_collections.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ext_ui.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dv_jquerydom.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dv_core.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.legend.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dv_geometry.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.datachart_core.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.dvcommonwidget.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.chartlegend.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.chart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.piechart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.doughnutchart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.basechart.js" type="text/javascript"></script>
	<script src="../../igniteui/js/modules/infragistics.ui.doughnutchart.js" type="text/javascript"></script>
	<script type="text/javascript">
            var data = [
            { "ProductCategory": ' Footwear', "Index": 1498 },
                { "ProductCategory": ' Clothing', "Index": 1389 },
                { "ProductCategory": ' Books', "Index": 352 },
                { "ProductCategory": ' Accessories', "Index": 273 },
                { "ProductCategory": ' Equipment', "Index": 100 }];
                  $(function () {
            var dc = $("#doughnutChart").igDoughnutChart({
                    width: 300,
                    height: 300,
                    series: [
                          {
                                    name: "flatSeries",
                                valueMemberPath: "Index",
                                    dataSource: data
                          }
                    ]
            });
        });
    </script>
</head>
<body>
<!-- Target element for the igDoughnutChart -->
<div id="doughnutChart"></div>
</body>
</html>
```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ASP.NET MVC アプリケーションへの *igDoughnutChart* の追加](igDoughnutChart-Adding-Using-the-MVC-Helper.html): このトピックでは、%ProductNameMVC%% を使用して ASP.NET MVC アプリケーションに `igDoughnutChart` のインスタンスを作成する方法を紹介します。

- [jQuery および MVC API リファレンス リンク (*igDoughnutChart*)](igDoughnutChart-API-Links.html): このトピックでは、`igDoughnutChart` コントロールと %ProductNameMVC%% に関する API ドキュメントへのリンクを提供します。


### <a id="samples"></a> サンプル

以下のサンプルでは、このトピックに関連する情報を提供しています。

- [JSON へのバインド](%%SamplesUrl%%/doughnut-chart/bind-json): このサンプルは、JSON データにバインドされたドーナツ型チャートを表示します。





 

 



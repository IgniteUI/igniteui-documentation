<!--
|metadata|
{
    "fileName": "igpivotdataselector-adding-to-html-page",
    "controlName": "igPivotDataSelector",
    "tags": ["Application Blocks","Getting Started","Grids","How Do I"]
}
|metadata|
-->

# igPivotDataSelector の HTML ページへの追加

##トピックの概要

### 目的

このトピックは、 HTML ページへ `igPivotDataSelector`™ コントロールを追加する方法について概念と詳しい手順の両方から説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html): このトピックでは、%%ProductName%%™ ライブラリの一般情報を提供します。

- [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、必要な JavaScript リソースを追加して %%ProductName%% ライブラリからコントロールを使用する場合の全般的な説明をします。

- [igPivotDataSelector の概要](igPivotDataSelector-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igPivotDataSelector` コントロールに関する概念的な情報を提供します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [igPivotDataSelector の追加 - 概要](#overview)
    -   [igPivotDataSelector 追加の概要](#adding-control-summary)
    -   [要件](#summary-requirements)
    -   [手順](#summary-steps)
-   [igPivotDataSelector の追加 - 手順](#procedure)
    -   [概要](#procedure-introduction)
    -   [プレビュー](#procedure-preview)
    -   [前提条件](#procedure-prerequisites)
    -   [概要](#procedure-overview)
    -   [手順](#procedure-steps)
-   [**関連コンテンツ**](#related-contend)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="overview"></a>igPivotDataSelector の追加 - 概要

### <a id="adding-control-summary"></a>igPivotDataSelector 追加の概要

`igPivotDataSelector` は、`igOlapFlatDataSource`™ または `igOlapXmlaDataSource`™ のインスタンスを使用して操作します。したがって、`igPivotDataSelector` を HTML ページに追加する場合、内部で作成できるように、事前に構成されたデータ ソース インスタンスを提供するか、必要なオプションを指定する必要があります。

データ ソースは、`igPivotDataSelector` の [dataSource](%%jQueryApiUrl%%/ui.igPivotDataSelector#options:dataSource) パラメーターまたは [dataSourceOptions](%%jQueryApiUrl%%/ui.igPivotDataSelector#options:dataSourceOptions) プロパティのいずれかを通して指定します。データ ソースの設定は、`igPivotDataSelector` の初期化時に唯一設定しなければならない強制オプションです。

### <a id="summary-requirements"></a>要件

以下の表で、`igPivotDataSelector` コントロールの要件を簡単に説明します。

<table cellspacing="0" cellpadding="0" class="table table-bordered">
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
				%%ProductName%%™ は、これらのフレームワークの最上位にビルドされます。

				<ul>
					<li><a href="http://jquery.com/" target="_blank">jQuery</a></li>

					<li><a href="http://jqueryui.com/" target="_blank">jQuery UI</a></li>
				</ul>
			</td>

			<td>
				ページの &lt;head&gt; セクションで両方のライブラリにスクリプト参照を追加します。
			</td>
		</tr>

		<tr>
			<td>
				Modernizr ライブラリ (オプション)
			</td>

			<td>
				Modernizr ライブラリは、ブラウザとデバイス機能を検出するために `igPivotDataSelector` で使用されます。これは強制ではありませんが、含まれないとコントロールは HTML 互換ブラウザーで標準のデスクトップ環境であるかのように振る舞います。

				<ul>
					<li><a href="http://modernizr.com/" target="_blank">Modernizr</a></li>
				</ul>
			</td>

			<td>
				ページの &lt;head&gt; セクションでライブラリにスクリプト参照を追加します。
			</td>
		</tr>

		<tr>
			<td>
				全般的な `igPivotDataSelector` JavaScript リソース
			</td>

			<td>
				%%ProductName%% ライブラリの igPivotDataSelector 機能性は、いくつかのファイルに配布されます。必要なリソースは以下の方法で読み込むことができます。

				<ul>
					<li>(推奨) Infragistics Loader (`igLoader`) を使用します。ページ上に `igLoader` へのスクリプト参照を含めるのみです。</li>

					<li>必要なリソースを手動で読み込みます。以下の表にリストされる依存関係を使用する必要があります。</li>
				</ul>

				以下の表は、`igPivotDataSelector` コントロール関連の %%ProductName%% ライブラリの依存関係を示します。これらのリソースは、リソースを手動で取り込むことを選択する場合は明示的に参照される必要があります (`igLoader` は使用しない)。

				<table cellspacing="0" cellpadding="0" class="table table-bordered">
					<tbody>
						<tr>
							<th>
								JavaScript リソース
							</th>

							<th>
								説明
							</th>
						</tr>

						<tr>
							<td>
								`infragistics.util.js`<br/>
								`infragistics.util.jquery.js`
							</td>

							<td>
								%%ProductName%% ユーティリティ
							</td>
						</tr>

						<tr>
							<td>
								(条件付き- `igOlapFlatDataSource` を使用する場合) `infragistics.datasource.js`
							</td>

							<td>
								`igDataSource`™ コンポーネント
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.olapflatdatasource.js`

								または

								`infragistics.olapxmladatasource.js`
							</td>

							<td>
								データ ソース フレームワーク
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.templating.js`
							</td>

							<td>
								テンプレート エンジン (`igTemplate`™)
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.ui.shared.js`
							</td>

							<td>
								%%ProductName%% 共有コード
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.ui.scroll.js`
							</td>

							<td>
								内部仕様されるスクロール ヘルパー
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.ui.combo.js`
							</td>

							<td>
								コンボ ボックス コントロール (`igCombo`™)
							</td>
						</tr>

						<tr>
							<td height="22">
								`infragistics.ui.tree.js`
							</td>

							<td height="22">
								`igTree`™ コントロール
							</td>
						</tr>

						<tr>
							<td height="22">
								`infragistics.ui.pivot.shared.js`
							</td>

							<td height="22">
								ピボット コンポーネント用の %%ProductName%% 共有コード
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.ui.pivotdataselector.js`
							</td>

							<td>
								`igPivotDataSelector`™ コントロール
							</td>
						</tr>
					</tbody>
				</table><br>
			</td>

			<td>
				以下のいずれかを追加します。

				<ul>
					<li>`igLoader` への参照</li>

					<li>すべての必要な JavaScript ファイルへの参照 (左側の表に一覧表示)</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				IG テーマ

				(オプション)
			</td>

			<td>
				このテーマには、%%ProductName%% ライブラリ用のビジュアル スタイルが含まれます。テーマ ファイル:

				<ul>
					<li>`<IG CSS root>/themes/Infragistics/infragistics.theme.css`</li>
				</ul>
			</td>

			<td></td>
		</tr>

		<tr>
			<td>
				`igPivotDataSelector` CSS リソース ファイル
			</td>

			<td>
				以下の CSS ファイルからのスタイルは、コントロールの各種要素のレンダリングに使用されます。

				<ul>
					<li>`<IG CSS root>/structure/modules/infragistics.ui.shared.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.combo.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.tree.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.pivot.css`</li>
				</ul>
			</td>

			<td>
				ページのファイルにスタイル参照を追加します。
			</td>
		</tr>
	</tbody>
</table>

 

### <a id="summary-steps"></a>手順

`igPivotDataSelector`  を HTML ページへ追加するための一般的な手順をおおまかに示すと、次のようになります。

1. 必要なリソースへの参照を追加する

2. `igPivotDataSelector` で必要な HTML マークアップを追加

3. データ ソースを追加する

4. `igPivotDataSelector` を初期化する



##<a id="procedure"></a>igPivotDataSelector の追加 - 手順

### <a id="procedure-introduction"></a>概要

以下のプロシージャは、Adventure Works サンプル データベースをビジュアル化する HTML アプリケーションに `igPivotDataSelector` コンポーネントを追加する方法をコード例を用いて説明します。プロシージャは Infragistics Loader (`igLoader`) を使用して、推奨オプションである必要なリソースを参照します。

### <a id="procedure-preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igPivotDataSelector_Adding_1.png)

### <a id="procedure-prerequisites"></a>前提条件

この手順を実行するには、以下のリソースが必要です。

-   [Adventure Works](http://msftdbprodsamples.codeplex.com/) サンプル データベース
-   `$.ig.OlapXmlaDataSource` オブジェクトまたは `$.ig.OlapFlatDataSource` オブジェクトのインスタンス

### <a id="procedure-overview"></a>概要

1. 必要なリソースへの参照を追加する

2. `igPivotDataSelector` で必要な HTML マークアップを追加

3. データ ソースを追加する

4. `igPivotDataSelector` を初期化する

### <a id="procedure-steps"></a>手順

以下の手順では、jQuery  `igPivotDataSelector` を初期化する方法を紹介します。

1. 必要なリソースへの参照を追加します。

	1. 必要なファイルを構造化します。
		
		A. jQuery、jQueryUI および Modernizr JavaScript のリソースを Web ページが置かれているディレクトリ内に Scripts  という名前のフォルダーに追加します。

		B. Content/ig という名前のフォルダーに %%ProductName%% CSS ファイルを追加します (詳細は、[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)のトピックを参照してください)。

		C. %%ProductName%% JavaScript ファイルを Web サイト　またはアプリケーション内の Scripts/ig という名前のフォルダーに追加します (詳細は 「[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)」 トピックを参照)。

	2. 必要な JavaScript ライブラリへの参照を追加します。

		jQuery、jQuery UI および Modernizr ライブラリの参照をページの `<head>` セクションに追加します。

		**HTML の場合:**

		```html
		<script  type="text/javascript" src="Scripts/jquery.js"></script>
		<script  type="text/javascript" src="Scripts/jquery-ui.js"></script>
		<script  type="text/javascript" src="Scripts/modernizr.js"></script>
		```

	3.  `igLoader` への参照を追加します。ページ内に `igLoader` スクリプトを含めます。
 
		**HTML の場合:**

		```html
		<script  type="text/javascript" src="Scripts/ig/infragistics.loader.js"></script>
		```

	4. 必要なリソースをロードします。

		`igLoader` をインスタンス化します。

		**HTML の場合:**

		```html
		<script type="text/javascript">
		    $.ig.loader({
		        scriptPath: "Scripts/ig/",
		        cssPath: "Content/ig/",
		        resources: “igPivotDataSelector,igOlapXmlaDataSource"
		    });
		<script>
		```

2. `igPivotDataSelector` で必要な HTML マークアップを追加します。

	HTML ページに “`dataSelector`” の `id` で `div` タグを作成します。

	**HTML の場合:**

	```html
	<div id="dataSelector"></div>
	```

3. データ ソースを追加します。

	サンプル データ ソースの宣言:

	**JavaScript の場合:**

	```js
	$.ig.loader(function () {    var dataSource = new $.ig.OlapXmlaDataSource({
	                serverUrl: "http://sampledata.infragistics.com/olap/msmdpump.dll",
	                catalog: "Adventure Works DW Standard Edition",
	                cube: "Adventure Works",
	                measureGroup: "Internet Sales",
	                rows: "[Sales Territory].[Sales Territory]",
	                columns: "[Product].[Product Categories]",
	                measures: "[Measures].[Internet Order Count],[Measures].[Internet Gross Profit Margin]"
	            });
	});
	```

	このデータ ソースを IE で正しく操作するには、**データ ソース宣言を追加する前に**、jQuery クロスオリジン要求のサポートを true に設定する必要があります。
	
	**JavaScript の場合:**
	
	```js
	$.support.cors = true;
	```

4. `igPivotDataSelector` を初期化する

	`igPivotDataSelector` を読み込むには、以下のコードを追加しなければなりません。

	**JavaScript の場合:**

	```js
	$("#dataSelector").igPivotDataSelector({
	    dataSource: dataSource 
	});
	```

	以下は、`igPivotDataSelector` の [dataSourceOptions](%%jQueryApiUrl%%/ui.igPivotDataSelector#options:dataSourceOptions)プロパティを使用してデータ ソースを指定するオルタナティブな (直接の) 方法です。(「[](#adding-control-summary)[igPivotDataSelector 追加の概要](#adding-control-summary)」を参照)

	**JavaScript の場合:**

	```js
	$("#dataSelector").igPivotDataSelector({
	      dataSourceOptions: {        
			xmlaOptions:{                    
				serverUrl: " http://sampledata.infragistics.com/olap/msmdpump.dll ",
	          	catalog: "Adventure Works DW Standard Edition ",
	          	cube: "Adventure Works",
	          	measureGroup: "Internet Sales"        
			},
	        rows: "[Sales Territory].[Sales Territory]",
	        columns: "[Product].[Product Categories]",
	        measures: "[Measures].[Internet Order Count],[Measures].[Internet Gross Profit Margin]"     
			}
		});
	```


##<a id="related-contend"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックについては、以下のサンプルも参照してください。

- [igPivotDataSelector を ASP.NET MVC アプリケーションに追加](igPivotDataSelector-Adding-Using-the-MVC-Helper.html): このトピックは、`igPivotDataSelector` は ASP.NETMVC アプリケーションを追加する方法をについて概念とコード例の両方で説明します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [フラット データ ソースへのバインド](%%SamplesUrl%%/pivot-grid/binding-to-flat-data-source): このサンプルでは、`igPivotGrid` を `igOlapFlatDataSource` にバインドし、データ選択のために `igPivotDataSelector` を使用します。

- [XMLA データ ソースにバインド](%%SamplesUrl%%/pivot-grid/binding-to-xmla-data-source): このサンプルでは、`igPivotGrid` を `igOlapXmlaDataSource` にバインドし、選択のために `igPivotDataSelector` を使用します。





 

 



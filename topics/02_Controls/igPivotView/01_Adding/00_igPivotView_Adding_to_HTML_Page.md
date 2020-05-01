<!--
|metadata|
{
    "fileName": "igpivotview-adding-to-html-page",
    "controlName": "igPivotView",
    "tags": ["Application Blocks","Data Binding","Data Presentation","Drilldown","Getting Started","Grids","How Do I"]
}
|metadata|
-->

# igPivotView の HTML ページへの追加



##トピックの概要

### 目的

このトピックでは、 HTML ページへ `igPivotView` コンポーネントを追加する方法についての概念と詳しい手順を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、必要な JavaScript リソースを追加して %%ProductName%% ライブラリからコントロールを使用する場合の全般的な説明をします。

- [igPivotView 概要](igPivotView-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igPivotView` コントロールに関する概念的な情報を提供します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [igPivotView の追加 - 概要](#overview)
    -   [igPivotView 追加の概要](#summary)
    -   [要件](#requirements-summary)
    -   [手順](#steps-summary)
-   [igPivotView の追加 - 手順](#procedure)
    -   [概要](#procedure-introduction)
    -   [プレビュー](#procedure-preview)
    -   [前提条件](#procedure-prerequisites)
    -   [概要](#procedure-overview)
    -   [手順](#procedure-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="overview"></a>igPivotView の追加 - 概要

### <a id="summary"></a>igPivotView 追加の概要

`igPivotView` は、`igOlapFlatDataSource`™ または `igOlapXmlaDataSource`™ のインスタンスを使用して操作します。したがって、`igPivotView` を HTML ページに追加する場合、内部で作成できるように、事前に構成されたデータ ソース インスタンスを提供するか、必要なオプションを指定する必要があります。

データ ソースは、`igPivotView` の [dataSource](%%jQueryApiUrl%%/ui.igPivotView#options:dataSource) パラメータまたは [dataSourceOptions](%%jQueryApiUrl%%/ui.igPivotView#options:dataSourceOptions) プロパティを介して指定します。データ ソースの設定は、`igPivotView` の初期化時に唯一設定しなければならない強制オプションです。

### <a id="requirements-summary"></a>要件

次の表は、`igPivotView` コントロールを使用する際に必要な事項を要約したものです。

<table cellspacing="0" cellpadding="0" class="table table-bordered">
	<tbody>
		<tr>
			<th>
				要件/必要なリソース
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
				ページの `<head>` セクションで両方のライブラリにスクリプト参照を追加します。
			</td>
		</tr>

		<tr>
			<td>
				Modernizr ライブラリ (オプション)
			</td>

			<td>
				Modernizr ライブラリは、ブラウザとデバイス機能を検出するために igPivotView で使用されます。これは強制ではありませんが、含まれないとコントロールは HTML 互換ブラウザーで標準のデスクトップ環境であるかのように振る舞います。

				<ul>
					<li><a href="http://modernizr.com/" target="_blank">Modernizr</a></li>
				</ul>
			</td>

			<td>
				ページの `<head>` セクションでライブラリにスクリプト参照を追加します。
			</td>
		</tr>

		<tr>
			<td>
				全般的な igPivotView JavaScript リソース
			</td>

			<td>
				%%ProductName%% ライブラリの igPivotView 機能性は、複数のファイルに渡って配布されます。必要なリソースは以下の方法で読み込むことができます。

				<ul>
					<li>**カスタム JavaScript ファイルを含む**: 推薦される %%ProductName%% JavaScript ファイルの参照方法です。%%ProductName%% コントロールの[カスタム ダウンロード](%%SamplesUrl%%/download)を作成できます。</li>
                    
					<li>**Infragistics Loader の使用**: *Infragistics Loader* は、すべての Infragistics リソース (スタイルおよびスクリプト) を解決するために使用されます。</li>

					<li>必要なリソースを手動で読み込みます。以下の表にリストされる依存関係を使用する必要があります。</li>
				</ul>

				以下の表は、igPivotView コントロール関連の %%ProductName%% ライブラリの依存関係をリストします。これらのリソースは、リソースを手動で取り込むことを選択する場合は明示的に参照される必要があります (igLoader は使用しない)。

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
								`infragistics.ui.splitter.js`
							</td>

							<td height="22">
								`igSplitter`™ コントロール
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
								`infragistics.ui.grid.framework.js`
							</td>

							<td height="22">
								`igGrid`™ コントロール
							</td>
						</tr>

						<tr>
							<td height="22">
								`infragistics.ui.grid.multicolumnheaders.js`
							</td>

							<td height="22">
								`igGrid` コントロール用のマルチ列ヘッダー機能
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
								`infragistics.ui.pivotgrid.js`
							</td>

							<td>
								`igPivotGrid` コントロール
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

						<tr>
							<td>
								`infragistics.ui.pivotview.js`
							</td>

							<td>
								`igPivotView`™ コントロール
							</td>
						</tr>
					</tbody>
				</table><br>
			</td>

			<td>
				以下のいずれかを追加します。

				<ul>
					<li>カスタム JavaScript ファイルへの参照</li>
                    
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
				igPivotView CSS リソース ファイル
			</td>

			<td>
				以下の CSS ファイルからのスタイルは、コントロールの各種要素のレンダリングに使用されます。

				<ul>
					<li>`<IG CSS root>/structure/modules/infragistics.ui.shared.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.combo.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.splitter.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.tree.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.grid.css`</li>

					<li>`<IG CSS root>/structure/modules/infragistics.ui.pivot.css`</li>
				</ul>
			</td>

			<td>
				ページのファイルにスタイル参照を追加します。
			</td>
		</tr>
	</tbody>
</table>



### <a id="steps-summary"></a>手順

`igPivotView` を HTML ページへ追加するための一般的な手順をおおまかに示すと、次のようになります。

1. 必要なリソースへの参照を追加する

2. `igPivotView` で必要な HTML マークアップを追加する

3. データ ソースを追加する

4. `igPivotView` を初期化する



##<a id="procedure"></a>igPivotView の追加 - 手順

### <a id="procedure-introduction"></a>概要

以下の手順は、Adventure Works サンプル データベースをビジュアル化する HTML アプリケーションに `igPivotView` コンポーネントを追加する方法をコード例を用いて説明します。プロシージャは Infragistics Loader (`igLoader`) を使用して、推奨オプションである必要なリソースを参照します。

### <a id="procedure-preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/igPivotView_Adding_1.png)

### <a id="procedure-prerequisites"></a>前提条件

この手順を実行するには、以下のリソースが必要です。

-   Adventure Works サンプル データベース
-   `$.ig.OlapXmlaDataSource` オブジェクトまたは `$.ig.OlapFlatDataSource` オブジェクトのインスタンス

### <a id="procedure-overview"></a>概要

1. 必要なリソースへの参照を追加する

2. `igPivotView` で必要な HTML マークアップを追加する

3. データ ソースを追加する

4. `igPivotView` を初期化する

### <a id="procedure-steps"></a>手順

以下の手順では、jQuery  `igPivotView` を初期化する方法を紹介します。

1. 必要なリソースへの参照を追加します。

	1. 必要なファイルを構造化します。

		A. **jQuery、jQueryUI および Modernizr JavaScript のリソースを Web ページが置かれているディレクトリ内に Scripts  という名前のフォルダーに追加します。**

		B. **Content/ig という名前のフォルダーに %%ProductName%% CSS ファイルを追加します (詳細は、[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)のトピックを参照してください)。**

		C. **%%ProductName%% JavaScript ファイルを Web サイト　またはアプリケーション内の Scripts/ig という名前のフォルダーに追加します (詳細は 「[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)」 トピックを参照)。**

	2. 必要な JavaScript ライブラリへの参照を追加します。**jQuery、jQuery UI および Modernizr ライブラリの参照**をページの `<head>` セクションに追加します。
	
		**HTML の場合:**
		
		```html
		<script  type="text/javascript" src="Scripts/jquery.js"></script>
		<script  type="text/javascript" src="Scripts/jquery-ui.js"></script>
		<script  type="text/javascript" src="Scripts/modernizr.js"></script>
		```
	
	3. `igLoader` への参照を追加します。**ページ内に `igLoader` スクリプトを含めます。**
	
		**HTML の場合:**
		
		```html
		<script  type="text/javascript" src="Scripts/ig/infragistics.loader.js"></script>
		```
	
	4. 必要なリソースをロードします。
	
		igLoader をインスタンス化します。
		
		**HTML の場合:**
		
		```html
		<script type="text/javascript">
		    $.ig.loader({
		        scriptPath: "Scripts/ig/",
		        cssPath: "Content/ig/",
		        resources: “igPivotView,igOlapXmlaDataSource"
		    });
		<script>
		```

2. `igPivotView` で必要な HTML マークアップを追加します。

	**HTML ページに “`dataSelector`” の `id` で `div` タグを作成します。**
	
	**HTML の場合:**
	
	```html
	<div id="pivotView"></div>
	```

3. データ ソースを追加します。

	igLoader の ready イベント ハンドラーでは、データ ソース宣言を追加します。
	
	**JavaScript の場合:**
	
	```js
	var dataSource = new $.ig.OlapXmlaDataSource({
        serverUrl: "http://sampledata.infragistics.com/olap/msmdpump.dll",
        catalog: "Adventure Works DW Standard Edition",
        cube: "Adventure Works",
        measureGroup: "Internet Sales",
        rows: "[Sales Territory].[Sales Territory]",
        columns: "[Product].[Product Categories]",
        measures: "[Measures].[Internet Order Count],[Measures].[Internet Gross Profit Margin]"
    });
	```
	
	このデータ ソースを IE で正しく操作するには、**データ ソース宣言を追加する前に**、jQuery クロスオリジン要求のサポートを true に設定する必要があります。
	
	**JavaScript の場合:**
	
	```js
	$.support.cors = true;
	```

4. `igPivotView` を初期化します。

	igPivotView をロードするには、データ ソースの宣言後に以下のコードを追加しなければなりません。
	
	**JavaScript の場合:**
	
	```js
	$("#pivotView").igPivotView({
	dataSource: dataSource 
	});
	```
	
	以下は、igPivotView の [dataSourceOptions](%%jQueryApiUrl%%/ui.igPivotView#options:dataSourceOptions)プロパティを使用してデータ ソースを指定するオルタナティブな (直接の) 方法です。(「[igPivotView 追加の概要](#summary)」を参照)
	
	**JavaScript の場合:**
	
	```js
	$("#dataSelector").igPivotView({
	      dataSourceOptions: {
	       xmlaOptions: {
	          serverUrl: " http://sampledata.infragistics.com/olap/msmdpump.dll ",
	          catalog: "Adventure Works DW Standard Edition ",
	          cube: "Adventure Works",
	          measureGroup: "Internet Sales",
	       }
	       rows: "[Sales Territory].[Sales Territory]",
	       columns: "[Product].[Product Categories]",
	       measures: "[Measures].[Internet Order Count],[Measures].[Internet Gross Profit Margin]"      
		}
	});
	```
	

##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igPivotView の ASP.NET MVC アプリケーションへの追加](igPivotView-Adding-Using-the-MVC-Helper.html): このトピックは、%%ProductNameMVC%%を使用して ASP.NET MVC アプリケーションへ `igPivotView` コントロールを追加する方法についての概念と詳しい手順を説明します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [フラット データ ソースへのバインド](%%SamplesUrl%%/pivot-view/binding-to-flat-data-source): このサンプルでは、`igPivotView` を `igOlapFlatDataSource` にバインドする方法を紹介します。

- [XMLA にバインドした KPI の表示](%%SamplesUrl%%/pivot-view/binding-to-xmla-data-source): このサンプルでは、`igPivotView` を `igOlapXmlaDataSource` にバインドする方法を紹介します。





 

 



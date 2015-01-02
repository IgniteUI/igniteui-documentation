<!--
|metadata|
{
    "fileName": "using-infragistics-loader",
    "controlName": "1",
    "tags": []
}
|metadata|
-->

# Infragistics Loader による必要なリソースを自動で追加する

## トピックの概要

### 目的

このトピックでは、*Infragistics*® *Loader* を使用して、Ignite UI の必要なリソースを管理する方法について説明します。

#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [Infragistics Loader の概要](#overview)
-   [Infragistics Loader の初期化](#initialization)
-   [Infragistics Loader を使用したリソースのロード](#loading)
-   [Infragistics Loader を使用したローカライズ リソースの参照](#referencing)
-   [Infragistics Loader を使用した地域設定](#regional)
-   [関連コンテンツ](#related)

#### <a id="overview"></a> Infragistics Loader の概要

インフラジスティックス ローダーを使用してスクリプトおよびスタイル モジュールをロードします。これは、2012.2 リリースから導入されました。

結合した JavaScript ファイルを使用するとき、すべての圧縮および結合スクリプトを組み込みます。個別コントロールのリソースを追加する必要がある場合、インフラジスティクス ローダーを使用できます。

ローダーをインスタンス化するページに関連するスクリプトおよび CSS パス CssPath および ScriptPath を指定し、jQuery でローダーをパス

```
{IG Resources root}/js/infragistics.loader.js
```

でアプリケーションに追加する必要があります。

> **注:** MVC ラッパーによってコントロールを初期化すると、すべての依存リソースが自動的に読み込まれます。

**ASPX の場合:**

```
<script src="{IG Resources root}/js/infragistics.loader.js"></script>
    <%= Html.Infragistics()
        .Loader()
        .ScriptPath("{IG Resources root}/js/")
        .CssPath("{IG Resources root}/css/")
        .Render()    %>
```

### <a id="initialization"></a>Infragistics Loader の初期化

Infragistics Loader の初期化には以下の基本的な方法があります。

1.  **オン デマンドにリソースをロードして個別に初期化**

	ローダー インストール時にリソースを指定すると、ファイルのロードが直ちに開始されます。それ以外の場合、確実に JavaScript ファイルを使用できるようインスタンス化ウィジットをローダーのコールバックに延期する必要があります。
	
	**JavaScript の場合:**
	
	```
	$.ig.loader({
	    scriptPath: '{IG Resources root}/js/',
	    cssPath: '{IG Resources root}/css/'
	});  
	// separate initializations                   
	$.ig.loader('igGrid.Paging.Updating', 
	     function () {
	     // Create a couple of igGrids 
	        $("#grid1").igGrid({
	            virtualization: false,
	            autoGenerateColumns: true,
	            jQueryTemplating: false,
	```

2.  **ready オプションを初期化して使用します。このオプションには、すべてのリソースをロードしたとき呼び出す関数を指定します。**

	**JavaScript の場合:**
	
	```
	$.ig.loader({       
	  scriptPath: '{IG Resources root}/js/',
	  cssPath: '{IG Resources root}/css/',
	  resources: 'igGrid.*,igTree',
	  ready: function () { 
	    // THIS FUNCTION WILL BE CALLED WHEN ALL RESOURCES ARE LOADED
	  } 
	});  
	```

3.  **Infragistics Loader の個別の初期化**

	**JavaScript の場合:**
	
	```
	$.ig.loader({
	    scriptPath: '{IG Resources root}/js/',
	    cssPath: '{IG Resources root}/css/',
	    resources: 'igGrid.Sorting.Filtering'
	});
                 
	$.ig.loader(function () {
	    // Create a couple of igGrids 
	    $("#grid1").igGrid({
	        virtualization: false,
	        autoGenerateColumns: true,        
	        . . .
		});
	});
	```

4.  **チェーン メソッドを使用した初期化**

	**JavaScript の場合:**
	
	```
	$.ig.loader().load('igGrid.*', function () {}).load('igTree', function() {});
	```

#### <a id="loading"></a>Infragistics Loader を使用したリソースのロード

以下のリソースをロードする主な方法を示します。

1.  単一リソースをロード。

	以下のコードに示すように、必要な CSS と JavaScript ファイルへのパスを提供し、ローダーがページにフェッチするリソースを宣言する必要があります。このコードは並べ替え機能が有効な igGrid コントロールを読み込みます。
	
	> **注**: MVC ラッパーによってコントロールを初期化すると、すべての依存リソースが自動的に読み込まれます。
	
	**JavaScript の場合:**
	
	```
	<script type="text/javascript">
	    $.ig.loader({
	        scriptPath: "{IG Resources root}/js/",
	        cssPath: "{IG Resources root}/css/",
	        resources: "igGrid.Sorting"
	    });
	    $.ig.loader(function () {
	        $("#grid1").igGrid({
	            autoGenerateColumns: false,
	            columns: [. . .],
	            dataSource: adventureWorks,
	            features: [{
					name: "Sorting",
	                type: "local",
	                mode: "multiple"
	            }]
	        });
	    });
	</script> 
	```

2.  複数リソースをロード。

	読み込むリソースのコンマ区切りのリスト
	
	例： `igTree,igVideoPlayer,igGrid.Paging`。
	
	**JavaScript の場合:**
	
	```
	$.ig.loader({
	    scriptPath: '{IG Resources root}/js/',
	    cssPath: '{IG Resources root}/css/',
	    resources: 'igGrid,igTree'
	});
	```
	
	モジュラー ウィジェット (igGrid など) は `.` (ドット) を使用してリンク機能を許可します。
	
	`categorychart` および `radialchart` スクリプトをロードするには、以下のコードを組み込みます。
	
	![](images/Using_Infragistics_Loader_1.png)
	
	**JavaScript の場合:**
	
	```
	$.ig.loader({
	    scriptPath: "{IG Resources root}/js/",
	    cssPath: "{IG Resources root}/css/",
	    resources: "igDataChart.Category.Radial"
	});
	```

3.  複数リソースをロード。

	ウィジェットのすべてのモジュールを読み込む場合、`*`。例: `igGrid.*`。したがって、コントロールに関連するすべてのスクリプトをロードできます。
	
	**JavaScript の場合:**
	
	```
	$.ig.loader({
	    scriptPath: '{IG Resources root}/js/',
	    cssPath: '{IG Resources root}/css/',
	    resources: 'igHierarchicalGrid.*'
	});
	```

4.  外部リソースのロード

	外部リソースをロードするには、`js` ファイルへの相対パスをコンマで区切って指定します。
	
	**JavaScript の場合:**
	
	```
	$.ig.loader({
	    scriptPath: '{IG Resources root}/js/',
	    cssPath: '{IG Resources root}/css/',
	    resources: "igGrid.*, 
	        extensions/infragistics.datasource.knockoutjs.js, 
	        extensions/infragistics.ui.grid.knockout-extensions.js"
	});
	```

### <a id="referencing"></a>Infragistics Loader を使用したリソースの参照

ウィジェットのローカライズは、locale オプションによって制御されます。

製品では現在以下のロケールをサポートしています。

1.  English(en)
2.  Japanese(ja)
3.  Bulgarian(bg)
4.  Russian(ru)
5.  Spanish (es)
6.  French (fr)
7.  German (de)

製品の英語版では、en リソースはウィジット コードにマージされています。製品の日本版では、`ja` リソースはウィジット コードにマージされています。これらのロケールを設定すると、ローダーは各該当バージョンでファイルを要求しません。

ローダーは、ブラウザの UI の言語を自動的に検出してそのロケールに切り替えることができます。これは、`autoDetectLocale` オプションで制御され、デフォルトで `false` に設定されています。`autoDetectLocale` と locale が設定されていると、locale オプションが優先します。

### <a id="regional"></a>Infragistics Loader を使用した地域設定

地域設定は、エディターなどのコントロールがサポートしています。ローダーは、locale オプションから推測するかブラウザ UI の自動検出により、自動的に地域設定をロードします。

ローダーに他の地域設定の読み込みを強制するには regional オプションを使用する必要があります。

これらの設定は、地域設定の標準に準拠し 2、文字または 5 文字の長さが可能です。すべての地域ファイルは以下のフォルダーにあります。

```
{IG Resources root}/js/modules/i18n/regional/
```

**JavaScript の場合:**

```
$.ig.loader({
    scriptPath: '{IG Resources root}/js/',
    cssPath: '{IG Resources root}/css/',
    resources: 'igHierarchicalGrid.*',
    locale: “bg”,
    regional :”en-GB”
});
```

> **注:** インフラジスティックス エディターで jQuery UI 日付の選択ウィジットを使用するよう構成されている場合、日付の選択の地域設定を別に設定する必要があります。

ページで **jquery-ui-i18n.min.js** を参照する必要があります。

地域設定を指定する必要があります。

```
$.datepicker.setDefaults($.datepicker.regional['ru']);
```

エディターの地域設定を設定するとき、ページで以下のファイルを参照する必要があります。

```
infragistics.ui.regional-i18n.js
```

認められた地域オプションの値は地域フォルダーのファイルの最後にあります。これらは jQuery がサポートする標準のものと同じです。

- af (South Africa)
- ar (Arabic)
- az (Azerbaijan, Latin)
- bg (Bulgaria)
- bs (Bosnia)
- ca (Catalan)
- cs (Czech)
- da (Denmark)
- de (Germany)
- el (Greece)
- en-GB (English, United Kingdom)
- es (Spain)
- et (Estonia)
- fa (Farsi, Iran)
- fi (Finland)
- fo (Faroe)
- fr-CH (French, Switzerland)
- fr (France)
- he (Hebrew, Israel)
- hr (Croatia)
- hu (Hungary)
- hy (Armenia)
- id (Indonesia)
- is (Iceland)
- it (Italy)
- ja (Japan)
- ko (Korea)
- lt (Lithuania)
- lv (Latvia)
- ms (Malaysia)
- nl (Dutch, Netherlands)
- no (Norway)
- pl (Poland)
- pt-BR (Brazil)
- ro (Romania)
- ru (Russia)
- sk (Slovakia)
- sl (Slovenia)
- sq (Albania)
- sr (Cyrillic, Serbia)
- sr-SR (Latin, Serbia)
- sv (Sweden)
- ta (Tamil, India)
- th (Thailand)
- tr (Turkey)
- uk (Ukraine)
- vi (Vietnam)
- zh-CN (PRC, China)
- zh-HK (Hong Kong SAR PRC, China)
- zh-TW (Taiwan, China)

## Infragistics Loader のリソース リファレンス

#### Infragistics Loader のリソース リファレンス表

以下の表は Infragistics Loader の有効なリソース文字列をリストします。

<table class="table table-striped">
	<thead>
		<tr>
			<th>モジュール</th>
			<th>Infragistics Loader のリソース文字列</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>igCombo</td>
			<td>igCombo</td>
		</tr>
		<tr>
			<td>igDataSource</td>
			<td>igDataSource</td>
		</tr>
		<tr>
			<td>igDataChart</td>
			<td>
				igDataChart
				
				<h4>機能</h4>
				<p>機能を複数含むには、`.` を使用して結合される 1 つの文字列に追加します。たとえば、`igDataChart.Category.Financial` を使用できます。</p>
				<p>すべての機能を含むには、以下を使用してください。</p>

				<ul>
					igDataChart.\*
					<ul>
						<li>Category</li>
						<li>Financial</li>
						<li>Polar</li>
						<li>Radial</li>
						<li>RangeCategory</li>
						<li>Scatter</li>
					</ul>
				</ul>
			</td>
		</tr>
		<tr>
			<td>igDialog</td>
			<td>igDialog</td>
		</tr>
		<tr>
			<td>igEditors</td>
			<td>igEditors</td>
		</tr>
		<tr>
			<td>igGrid</td>
			<td>igGrid

			<h4>機能:</h4>
			<p>機能を複数含むには、`.` を使用して結合される 1 つの文字列に追加します。たとえば、`igGrid.Paging.Sorting` を使用できます。</p>
			<p>すべての機能を含むには、`igGrid.*` を使用してください。</p>

			<ul>
				<li>igGrid.\*
					<ul>
						<li> ColumnMoving </li>
						<li> FeatureChooser </li>
						<li> Filtering </li>
						<li> GroupBy </li>
						<li> Hiding </li>
						<li> MergedCells </li>
						<li> Paging </li>
						<li> Resizing </li>
						<li> RowSelectors </li>
						<li> Selection </li>
						<li> Sorting </li>
						<li> Summaries </li>
						<li> MultiColumnHeaders </li>
						<li> Tooltips </li>
						<li> Updating </li>
					</ul>
				</li>
			</ul>

			</td>
		</tr>
		<tr>
			<td>igHierarchicalGrid</td>
			<td>igHierarchicalGrid

				<h4>機能:</h4>
				<p>機能を複数含むには、`.` を使用して結合した 1 つの文字列に追加します。たとえば、`igHierarchicalGrid.Paging.Sorting` を使用できます。</p>
				
				<p>すべての機能を含むには、`igHierarchicalGrid.*` を使用してください。</p>
				
				<ul>
					<li>igHierarchicalGrid.\*
						<ul>
							<li>ColumnMoving</li>
							<li>FeatureChooser</li>
							<li>Filtering</li>
							<li>GroupBy</li>
							<li>Hiding</li>
							<li>MergedCells</li>
							<li>Paging</li>
							<li>Resizing</li>
							<li>RowSelectors</li>
							<li>Selection</li>
							<li>Sorting</li>
							<li>Summaries</li>
							<li>MultiColumnHeaders</li>
							<li>Tooltips</li>
							<li>Updating</li>
						</ul>
					</li>
				</ul>

			</td>
		</tr>
		<tr>
			<td>igHtmlEditor</td>
			<td>igHtmlEditor</td>
		</tr>
		<tr>
			<td>igMap</td>
			<td>igMap</td>
		</tr>
		<tr>
			<td>igOlapDataSource</td>
			<td>igOlapDataSource</td>
		</tr>
		<tr>
			<td>igPieChart</td>
			<td>igPieChart</td>
		</tr>
		<tr>
			<td>igPivotGrid</td>
			<td>igPivotGrid</td>
		</tr>
		<tr>
			<td>igRating</td>
			<td>igRating</td>
		</tr>
		<tr>
			<td>igReportViewer</td>
			<td>igReportViewer</td>
		</tr>
		<tr>
			<td>igTemplating</td>
			<td>igTemplating</td>
		</tr>
		<tr>
			<td>igTree</td>
			<td>igTree</td>
		</tr>
		<tr>
			<td>igUpload</td>
			<td>igUpload</td>
		</tr>
		<tr>
			<td>igVideoPlayer</td>
			<td>igVideoPlayer</td>
		</tr>
	</tbody>
</table>

## <a id="related"></a> 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Ignite UI での JavaScript ファイル](Deployment-Guide-JavaScript-Files.html): このトピックは、Ignite UI™ に含まれるコントロールを使用して作業するために必要な JavaScript ファイルへの参照です。
- [Ignite UI 対応 Infragistics コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html): Ignite UI 対応 Infragistics コンテンツ配信ネットワーク (CDN) の使用方法。
- [必要なリソースの手動で追加する](Adding-the-Required-Resources-for-NetAdvantage-for-jQuery.html): このトピックでは、Ignite UI™ での JavaScript リソースの新しい構成について説明します。
- [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、Web アプリケーションで Ignite UI を操作して、必要なリソースを管理する方法について説明します。

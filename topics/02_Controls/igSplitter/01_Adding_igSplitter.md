<!--
|metadata|
{
    "fileName": "adding-igsplitter",
    "controlName": "igSplitter",
    "tags": ["Getting Started","How Do I","Layouts","Tips and Tricks"]
}
|metadata|
-->

# igSplitter の追加

## トピックの概要
### 目的

このトピックは、JavaScript または ASP.NET MVC のいずれかで `igSplitter`™ コントロールを HTML ページへ追加する方法をコード例を用いて説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念とトピックの一覧です。

**トピック**

- [%%ProductName%% で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、Web アプリケーションで %%ProductName%%® を操作して、必要なリソースを管理する方法について説明します。

- [igSplitter の概要](igSplitter-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igSplitter` コントロールに関する概念的な情報を提供します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [igSplitter の追加 - 概要](#overview)
    -   [igSplitter の追加の概要](#summary)
    -   [要件](#requirements)
    -   [手順](#steps)
-   [JavaScript での igSplitter の追加 - 手順](#procedure-js)
    -   [概要](#js-introduction)
    -   [プレビュー](#js-preview)
    -   [手順](#js-steps)
-   [ASP.NET MVC による igSplitter の追加 - 手順 ](#mvc-procedure)
    -   [概要](#mvc-introduction)
    -   [プレビュー](#mvc-preview)
    -   [手順](#mvc-steps)
-   [igSplitter を TypeScript で追加](#ts-procedure)
    -   [概要](#ts-introduction)
    -   [プレビュー](#ts-preview)
    -   [手順](#ts-steps)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a>igSplitter の追加 - 概要
### <a id="summary"></a>igSplitter の追加の概要

`igSplitter` は、何らかのコンテンツのある 2 つの子 DIV を持つ DIV 要素上で初期化するコントロールです。オプションを構成することなくコントロールをセットアップできます。ただし、この場合 `igSplitter` は、ブラウザ ー ウィンドウ全体を占めます。このため、まさにこれが望んでいる通りの状態である場合を除いて、コンテナーの幅と高さを設定して `igSplitter` を任意のサイズに構成しなければなりません。

![](images/Adding_igSplitter_1.png)

幅と高さの呼び出しはページ上のスプリッターのサイズを指定し、その値は CSS で利用可能な単位で指定できます。

### <a id="requirements"></a>要件

以下の表で、`igSplitter` コントロールの要件を簡単に説明します。

<table class="table">
	<thead>
		<tr>
			<th style="text-align:center;width:15%;"> 要件 / 必要なリソース </th>
            <th style="text-align:center;width:55%;"> 説明 </th>
            <th style="text-align:center;width:30%;"> 必要な作業 </th>
        </tr>
	</thead>
	<tbody>
        <tr>
			<td> jQuery および jQuery UI JavaScript リソース </td>
            <td> %%ProductName%% は、これらのフレームワークの最上位にビルドされます。
                <ul>
					<li> jQuery </li>
                    <li> jQuery UI </li>
                </ul>
            </td>
			<td> ページの `head` セクションで両方のライブラリにスクリプト参照を追加します。</td>
        </tr>
        <tr>
			<td> Modernizr ライブラリ （オプション） </td>
            <td>
                Modernizr ライブラリは、ブラウザーとデバイス機能を検出するために igSplitter で使用されます。これは必須ではなく、含まれていない場合、コントロールは HTML5 をサポートするブラウザーが動作する通常のデスクトップ環境であるように動作します。
                <ul>
                    <li>Modernizr</li>
                </ul>
            </td>
			<td> ページの `head` セクションでライブラリにスクリプト参照を追加します。 </td>
        </tr>
        <tr>
            <td>
igSplitter JavaScript リソース
			</td>
            <td>
                %%ProductName%% ライブラリの igSplitter 機能は、いくつかのファイルにて配布されます。必要なリソースは以下の方法で読み込むことができます。
                <ul>
                    <li>
(推奨) [Infragistics® Loader](Using-Infragistics-Loader.html) (igLoader™)を使用します。ページ上に igLoader へのスクリプト参照を含めるのみです。
					</li>
                    <li>
必要なリソースを手動で読み込みます。以下の表にリストされる依存関係を使用する必要があります。
					</li>
                </ul>
                以下の表は、igSplitter コントロール関連の %%ProductName%% ライブラリの依存関係を示します。これらのリソースは、リソースを手動で取り込むことを選択する場合は明示的に参照される必要があります (igLoader は使用しない)。
                <table class="table">
				<thead>
						<tr>
                            <th> JS リソース </th>
                            <th> 説明 </th>
                        </tr>
				</thead>
				<tbody>
                        <tr>
							<td>
				infragistics.ui.splitter-en.js
							</td>
							<td>
				igSplitter コントロールの言語ファイル
							</td>
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
				infragistics.ui.splitter.js
							</td>
							<td>
				igSplitter コントロール
							</td>
						</tr>
					</tbody>
				</table>
            </td>
            <td>
                以下のいずれかを追加します。
                <ul>
                    <li>
igLoader への参照
					</li>
                    <li>
すべての必要な JavaScript ファイルへの参照 (左側の表に一覧表示)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
IG テーマ (オプション)
			</td>
            <td>
このテーマには、%%ProductName%% ライブラリ用のビジュアル スタイルが含まれます。テーマ ファイル:
                {IG CSS root}/themes/Infragistics/infragistics.theme.css
			</td>
            <td>
			</td>
        </tr>
        <tr>
            <td>
igSplitter 構造
			</td>
            <td>
以下の CSS ファイルからのスタイルは、コントロールの各種要素のレンダリングに使用されます。
                {IG CSS root}/structure/modules/infragistics.ui.splitter.css
			</td>
            <td>
ページのファイルに `style` 参照を追加します。
			</td>
        </tr>
    </tbody>
</table>

>**注:** JavaScript と CSS リソースを読み込むためには igLoader コンポーネントを使うことを推奨します。この方法の詳細については、「[Infragistics Loader の使用](Using-Infragistics-Loader.html)」トピックを参照してください。さらに、オンラインの [%%ProductName%% サンプル ブラウザー](%%SamplesUrl%%) では、igSplitter コンポーネントで igLoader を使用する方法について特有の例が示されています。

### <a id="steps"></a>手順

`igSplitter` を HTML ページへ追加するための一般的な手順をおおまかに示すと、次のようになります。

1. 必要なリソースへの参照を追加する

2. `igSplitter` コントロールを追加する

## <a id="procedure-js"></a>JavaScript での igSplitter の追加 - 手順
### <a id="js-introduction"></a>概要

この手順は、実際の HTML/JavaScript 実装を使用して基本機能を持つ `igSplitter` コントロールを HTML ページへ追加するステップを説明します。`igSplitter` コントロールによって必要とされるすべての %%ProductName%% リソースを読み込むための Infragistics Loader コンポーネントを使用します。

### <a id="js-preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Adding_igSplitter_JS.png)

### <a id="js-steps"></a>手順

以下の手順は、基本的な `igSplitter` コントロールを Web ページに追加する方法を示します。

1. 必要なリソースへの参照を追加します。

	1. 必要なファイルを構造化します。
	
		A. jQuery、jQueryUI および Modernizr JavaScript のリソースを Web ページが置かれているディレクトリ内に Scripts  という名前のフォルダーに追加します。
		
		B. Content/ig という名前のフォルダーに %%ProductName%% CSS ファイルを追加します (詳細は、[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)のトピックを参照してください)。
		
		C. %%ProductName%% JavaScript ファイルを Web サイト　またはアプリケーション内の Scripts/ig という名前のフォルダーに追加します (詳細は 「[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)」 トピックを参照)。

	2. 必要な JavaScript ライブラリへの参照を追加します。
	
		jQuery、jQuery UI および Modernizr ライブラリの参照をページの `head` セクションに追加します。
		
		**HTML の場合:**

		```html
		<script  type="text/javascript" src="Scripts/jquery.js"></script>
		<script  type="text/javascript" src="Scripts/jquery-ui.js"></script>
		<script  type="text/javascript" src="Scripts/modernizr.js"></script>
		```
	
	3. `igLoader` への参照を追加します。ページ内に `igLoader` スクリプトを含めます。

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
		        resources: "igSplitter"
		    });
		<script>
		```

2. `igSplitter` コントロールを追加します。

	1. HTML 要素を `igSplitter` をホストするために追加します。

		HTML ページ上で `igSplitter` をホストするために HTML div 要素を追加します。

		**HTML の場合:**

		```html
		<div id="splitter">
			<div>
				First panel with grid example: <br />
				<div id="grid"></div>
			</div>
			<div>
				Second panel with html editor example: <br />
				<div id="htmlEditor"></div>
			</div>
		</div>
		```

	2. `igSplitter` をインスタンス化します。

		HTML ページのスクリプト要素に初期化コードを追加します。初期化コードは、以前に追加された div 要素で `igSplitter` インスタンスを作成します。

		以下のコードは、コンテナーのサイズを指定することなく `igSplitter` コントロールのインスタンスを作成します。

		**JavaScript の場合:**
		
		```js
		$.ig.loader(function () {
		// Create a basic igSplitter control
		$("#splitter").igSplitter({
		});
		});
		```

		多くの場合、インスタンスのサイズを指定することになります。以下のコードでは、`igSplitter` コンテナーを 400 x 600 ピクセル (幅 x 高さ) になるよう構成します。

		```js
		$.ig.loader(function () {
		 // Create a basic igSplitter control
		 $("#splitter").igSplitter({
		     width: 400,
		     height: 600 });
		 });
		```



## <a id="mvc-procedure"></a>ASP.NET MVC による igSplitter の追加 - 手順

### <a id="mvc-introduction"></a>概要

この手順は、基本的な機能を備えた `igSplitter` を ASP.NET MVC View に追加する方法を示します。この例では、必要なローダーの構成とともに ASP.NET MVC 構文を使用します。

### <a id="mvc-preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Adding_igSplitter_2.png)

### <a id="mvc-steps"></a>手順

以下の手順は、基本的な `igSplitter` コントロールを ASP.NET MVC アプリケーションに追加する方法を示します。

1. 必要なリソースへの参照を追加します。

	1. 必要なファイルを構造化します。

		 A. jQuery、jQueryUI および Modernizr JavaScript のリソースを Web ページが置かれているディレクトリ内に Scripts  という名前のフォルダーに追加します。
		
		 B. Content/ig という名前のフォルダーに %%ProductName%% CSS ファイルを追加します (詳細は、[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)のトピックを参照してください)。
		
		 C. %%ProductName%% JavaScript ファイルを Web サイト　またはアプリケーション内の Scripts/ig という名前のフォルダーに追加します (詳細は 「[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)」 トピックを参照)。

	2. 必要な JavaScript ライブラリへの参照を追加します。jQuery、jQuery UI および Modernizr ライブラリの参照をページの `head` セクションに追加します。
	
		**HTML の場合:**

		```html
		<script  type="text/javascript" src="Scripts/jquery.js"></script>
		<script  type="text/javascript" src="Scripts/jquery-ui.js"></script>
		<script  type="text/javascript" src="Scripts/modernizr.js"></script>
		```

	3. `igLoader` への参照を追加します。ページ内に `igLoader` スクリプトを含めます。

		**HTML の場合:**

		```html
		<script  type="text/javascript" src="Scripts/ig/infragistics.loader.js"></script>
		```

	4. `igSplitter` 用の Loader MVC ヘルパー構成を追加する

		ASP.NET MVC ビューへ以下のコードを追加します。

		**ASPX の場合:**

		```csharp
		@(Html.Infragistics()
		    .Loader()
		    .ScriptPath("http://localhost/ig_ui/js/")
		    .CssPath("http://localhost/ig_ui/css/")
		    .Render()
		)
		```

2. `igSplitter` コントロールを追加します。

	1. HTML 要素を `igSplitter` をホストするために追加します。

		HTML ページ上で `igSplitter` をホストするために HTML div 要素を追加します。

		**HTML の場合:**

		```html
		<div id="splitter">
			<div>
				First panel with grid example: <br />
				<div id="grid"></div>
			</div>
			<div>
				Second panel with html editor example: <br />
				<div id="htmlEditor"></div>
			</div>
		</div>
		```

	2. `igSplitter` をインスタンス化します。以下のコードは、コンテナーのサイズを指定することなく `igSplitter` コントロールのインスタンスを作成します。

		```csharp
		@(Html.Infragistics()
			.Splitter()
			.ID("splitter")
			.Height("300px")
			.Width("900px")
			.SplitterPanelSettings(p =>
			{
				p.AddPanel().Size("300px").Min("30px").Max("300px");
				p.AddPanel().Size("500px").Collapsible(true);
			})
			.Render()
    	)
		```
		
		 多くの場合、インスタンスのサイズを指定することになります。以下のコードでは、`igSplitter` コンテナーを 400 x 600 ピクセル (幅 x 高さ) になるよう構成します。
		
		```
		@(Html.Infragistics()
		    .ID("splitter")
		    .Height("400")
		    .Width("600")
		    .Render()
		)
		```

## <a id="ts-procedure"></a>igSplitter を TypeScript で追加 - 手順

### <a id="ts-introduction"></a>概要

このサンプルでは、垂直 `igSplitter` コントロールを使用してページのレイアウトを TypeScript で管理する方法を紹介します。
最初のコンテナーは TypeScript クラスとして定義される国および大陸を含む `igTree` コントロールを表示します。
ノードをクリックすると、選択した項目の説明が右パネルに表示されます。

### <a id="ts-preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Adding_igSplitter_TypeScript_1.png)

### <a id="ts-steps"></a>手順

以下の手順は、TypeScript を使用して基本的な `igSplitter` コントロールを追加する方法を示します。

1. 必要なリソースへの参照を追加します。

	1. %%ProductName%% のテーマと構造ファイルを含めます。

		**HTML の場合:**
		```html
		<!-- %%ProductName%% Required Combined CSS Files -->
		<link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
		<link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/structure/infragistics.css" rel="stylesheet" />
		```
	2. JavaScript ライブラリを追加します ([modernizr](http://modernizr.com/) はオプションです)。

		**HTML の場合:**
		```html
		<!-- JavaScript Library Dependencies -->
		<script src="http://modernizr.com/downloads/modernizr-latest.js"></script>
		<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
		<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.min.js"></script>
		```

	3. %%ProductName%% スクリプトを含めます。カスタム ダウンロードを使用できますが、その他の方法については[「%%ProductName%% で JavaScript リソースを使用」](Deployment-Guide-JavaScript-Resources.html)を参照できます。

		**HTML の場合:**
		```html
		<!-- %%ProductName%% Required Combined JavaScript Files -->
		<script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.core.js"></script>
		<script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.lob.js"></script>
		```
	4. アプリケーション用の TypeScript ファイルまたは外部のリソースの参照パスを追加します。

		**HTML の場合:**
		```html
		<script src="./TypeScript/sampleApp.js"></script>
		```
		**HTML の場合:**
		```html
		<script src="http://www.igniteui.com/data-files/continents-with-countries-and-cities.js"></script>
    	<script src="http://www.igniteui.com/TypeScriptSamples/splitter/typescript.js"></script>
		```

2. `igSplitter` コントロールを追加します。

	1. HTML 要素を `igSplitter` をホストするために追加します。

		HTML ページ上で `igSplitter` をホストするために HTML div 要素を追加します。

		**HTML の場合:**

		```html
		<div id="splitter">
			<div style="overflow: auto">
				<ul id="tree"></ul>
			</div>
			<div><p>Select a destination from tree.</p></div>
		</div>
		```

	2. データ ソースの追加
		```javascript
		var continentsWithCountries = [{
			"Text": "Europe",
			"Description": "Europe is..",
			"Countries": [{ "Text": "Bulgaria", "Description": "Bulgaria, officially .." }]
		}, {
			"Text": "Asia",
			"Description": "Asia is the world's largest..",
			"Countries": [{ "Text": "Japan", "Description": "Japan is an island.." }, { .. }]
		}, {
			"Text": "North America",
			"Description": "North America..",
			"Countries": [{ "Text": "United States", "Description": "The United States.." }]
		}];
		```
	3. TypeScript 実装コードを追加し、TypeScript 用の %%ProductName%% と jQuery の型定義への参照パスを含めます。

		**TypeScript の場合:**
		```typescript
		/// <reference path="http://www.igniteui.com/js/typings/jquery.d.ts" />
		/// <reference path="http://www.igniteui.com/js/typings/jqueryui.d.ts" />
		/// <reference path="http://www.igniteui.com/js/typings/igniteui.d.ts" />
		declare var continentsWithCountries;

		$(function () {
			$("#splitter").igSplitter({
				height: "300px",
				panels: [{ size: 160, min: 100, max: 250 }]
			});
			$("#tree").igTree({
				dataSource: continentsWithCountries,
				bindings: {
					textKey: "Text",
					valueKey: "Text",
					childDataProperty: "Countries"
				}
			});
			$("#tree").on("igtreeselectionchanged", function (sender, eventArgs) {
				var node = eventArgs.selectedNodes[0];
				if (node.data.Description) {
					(<JQuery>$("#splitter").igSplitter("secondPanel")).html(node.data.Description);
				} else {
					(<JQuery>$("#splitter").igSplitter("secondPanel")).html("No information found.");
				}
			});
		});
		```

## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igSplitter の構成](Configuring-igSplitter.html): このトピックは、`igSplitter` コントロールの構成方法をコード例を用いて説明します。

- [イベント処理 (igSplitter)](igSplitter-Handling-Events.html): このトピックは、イベント ハンドラーを `igSplitter` にアタッチする方法をコード例を用いて説明します。

- [アクセシビリティの遵守 (igSplitter)](igSplitter-Accessibility-Compliance.html): このトピックは、`igSplitter` コントロールのアクセシビリティ機能を説明し、このコントロールを含むページに対してアクセシビリティ準拠を実現させる方法に関するアドバイスを提供します。

- [既知の問題と制限 (igSplitter)](igSplitter-Known-Issues-and-Limitations.html): このトピックでは、`igSplitter` コントロールの既知の問題と制限に関する情報を提供します。

- [jQuery と MVC API リンク (igSplitter)](igSplitter-jQuery-and-ASP.NET-MVC-Helper-API-Links.html): このトピックでは、`igSplitter` コントロールの jQuery および ASP.NET MVC ヘルパー クラスの API ドキュメントへのリンクを提供します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [ベーシック垂直スプリッター](%%SamplesUrl%%/splitter/basic-vertical-splitter): このサンプルでは、スプリッター コントロールを使用してページの垂直レイアウトを管理する方法を紹介します。最初のコンテナーは大陸および国を含むツリー コントロールを表示します。左の垂直パネルはサイズ変更の最大値および最小値があります。ノードをクリックすると、選択した項目の説明が右パネルに表示されます。

- [ベーシック水平スプリッター](%%SamplesUrl%%/splitter/basic-horizontal-splitter): このサンプルでは、スプリッター コントロールを使用して水平レイアウトのマスター/詳細グリッドを管理する方法を紹介します。最初のコンテナーは顧客データを含むマスター グリッドを含みます。マスター グリッドの行がクリックした後に 2 つ目のコンテナーにこの顧客の注文を含むグリッドを表示します。

- [ネスト スプリッター](%%SamplesUrl%%/splitter/nested-splitters): このサンプルでは、ネスト スプリッターのレイアウトを管理する方法を紹介します。パネルは大陸、国、および都市を含むツリーを表示します。ノードをクリックすると、2 つ目のスプリッターにあるマップはノードの座標によって中央揃えます。国が選択した場合、その国の都市を含むグリッドはマップの下に表示されます。パネルはデフォルトでサイズ変更できません。

- [ASP.NET MVC の基本的な使用方法](%%SamplesUrl%%/splitter/aspnet-mvc-helper-splitter): このサンプルでは、 `igSplitter` の ASP.NET MVC ヘルパーを使用する方法を紹介します。

- [スプリッター API およびイベント](%%SamplesUrl%%/splitter/api-events-splitter): このサンプルでは、`igSplitter` コントロールのイベントを処理する方法を紹介し、API を使用する方法を紹介します。









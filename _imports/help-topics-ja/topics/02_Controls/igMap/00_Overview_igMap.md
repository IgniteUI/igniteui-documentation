<!--
|metadata|
{
    "fileName": "overview-igmap",
    "controlName": "igMap",
    "tags": ["Charting","Data Presentation","Getting Started"]
}
|metadata|
-->

# igMap の概要



##トピックの概要

### 目的

このトピックは、`igMap`™ コントロールについて、その主要機能、最小要件、ユーザー機能などの概念的情報を提供します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックと概念の一覧です。


-   [地理情報システム](http://en.wikipedia.org/wiki/Geographic_information_system)
-   [シェープ ファイル](http://wiki.openstreetmap.org/wiki/Shapefiles)
-   [三角測量ファイル](http://vterrain.org/Implementation/Formats/ITF.html)


**トピック**

- [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html) - %%ProductName%%™ ライブラリにつぃての一般的情報

 

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [サポートされるマップ タイプ](#supported-map-types)
    -   [サポートされるマップ タイプの概要](#map-types-summary)
    -   [サポートされるマップ タイプの表](#map-types-table)
-   [最低必要条件](#min-requirements)
    -   [概要](#min-introduction)
    -   [要件の概要表](#min-requirements-summary)
-   [主要な機能の概要](#main-features)
    -   [主要な機能の概要表](#main-features-chart)
    -   [さまざまなマップ プロバイダーのサポート](#different-map-providers)
    -   [ズーム](#zooming)
    -   [パンニング](#panning)
    -   [ツールチップ](#tooltips)
    -   [カスタマイズ可能なマーカー](#customizable-markers)
    -   [シリーズのカスタマイズ可能なルック アンド フィール](#customizable-appearance)
-   [ユーザー相互作用と操作性](#user-interaction)
-   [データ バインディング](#data-binding)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="introduction"></a>概要

###igMap の概要

`igMap` コントロールは、HTML5 Web アプリケーションおよびサイトで、カスタム オーバーレイを使ったマップの描画を容易にすることを目的としています。これは、HTML5 の **Canvas** タグを使って実際のマップを描画し、マップ上でデータを視覚化します。

![](images/Overview_%28igMap%29_1.png)

`igMap` コントロールによって描画されたマップは、マップ プロバイダーが提供する背景コンテンツ（実際の地理マップ）（Bing® Maps、または OpenStreetMap マップなど）、およびユーザーに表示する実際のカスタム データを表すオーバーレイで構成されます。マップ上で描画できるいくつかのタイプのオーバーレイがあり、これらは「マップ シリーズ」または「マップ タイプ」と呼ばれます（[サポートされるマップ タイプ](#supported-map-types)を参照）。

マップは Overview Plus Detail (OPD) パネルを持つことができ、これはユーザーのナビゲーションを支援し、世界地図上の正確な場所を理解できるようにします。マップは、キーボード、キーボードとマウス操作を併用する、またはタッチ対応デバイスでのタッチとドラッグ アクションによるパンやズームなどのユーザー インタラクションに対応しています。詳細については、[主な機能の概要](#main-features)のセクションを参照してください。



##<a id="supported-map-types"></a>サポートされるマップ タイプ

### <a id="map-types-summary"></a>サポートされるマップ タイプの概要

`igMap` コントロールは、さまざまな可視化の目的に対して導入されるいろいろなシリーズ タイプを可能にします。シリーズは、`igMap` の `series.type` プロパティおよびそのそれぞれのデータ バインディング プロパティを設定することによって管理されます。

サポートされるシリーズ タイプの詳細と基本的な構成情報については、[](#map-types-table)[サポートされるマップ タイプの表](#map-types-table)のブロックを参照してください。

### <a id="map-types-table"></a>サポートされるマップ タイプの表

以下の表は、サポートされているマップ（シリーズ）タイプを表示します。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th>
				シリーズ タイプ
			</th>

			<th>
				説明
			</th>

			<th>
				Series.type プロパティの設定
			</th>

			<th>
				データ バインディング プロパティ
			</th>
		</tr>

		<tr>
			<td>
				地理記号シリーズ
			</td>

			<td>
				地理座標に基づいて、マップ上のマーカーを視覚化します。

				<img alt="" src="images/Overview_(igMap)_2.png" width="319" height="230"><br>関連トピック:

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Geographic-Symbol-Series.html">地理シンボル シリーズの構成</a></li>
				</ul>
			</td>

			<td>geographicSymbol</td>

			<td>
				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.latitudeMemberPath" target="_blank">latitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.longitudeMemberPath" target="_blank">longitudeMemberPath</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				地理図形シリーズ
			</td>

			<td>
				シェープ (SHP) ファイルまたはカスタム形状データ ソースが提供する形状データに基づいて、国や地域などの、マップ上の囲まれた領域を視覚化します。

				<img alt="" src="images/Overview_(igMap)_3.png" width="319" height="230"><br>関連トピック:

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Geographic-Shapes.html">地理図形シリーズの構成</a></li>
				</ul>
			</td>

			<td>geographicShape</td>

			<td>
				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.shapeDataSource" target="_blank">shapeDataSource</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.databaseSource" target="_blank">databaseSource</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.shapeMemberPath" target="_blank">shapeMemberPath</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				地理的ポリライン シリーズ
			</td>

			<td>
				シェープ (SHP) ファイルまたはカスタム形状データ ソースが提供する形状データに基づいて、道路、川、または毎日の供給路などの、マップ上の開いたパスを視覚化します。

				<img alt="" src="images/Overview_(igMap)_4.png" width="319" height="230"><br>関連トピック:

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Geographic-Polyline-Series.html">地理ポリライン シリーズの構成</a></li>
				</ul>
			</td>

			<td>geographicPolyline</td>

			<td>
				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.shapeDataSource" target="_blank">shapeDataSource</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.databaseSource" target="_blank">databaseSource</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.shapeMemberPath" target="_blank">shapeMemberPath</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				地理散布エリアシリーズ
			</td>

			<td>
				三角測量 (ITF) ファイルまたはその他のカスタム三角測量データ ソースで定義される不規則三角網 (TIN) に基づいて、色分けされた地理領域を表示します。地理座標および値メンバーも必要です。これは地形高度、人口密度、平均/現在の気温などを示すために使用されます。

				<img alt="" src="images/Overview_(igMap)_5.png" width="319" height="230"><br>関連トピック:

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Geographic-Scatter-Area-Series.html">地理散布エリア シリーズの構成</a></li>
				</ul>
			</td>

			<td>geographicScatterArea</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangulationDataSource" target="_blank">triangulationDataSource</a>

				オプション:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath1" target="_blank">triangleVertexMemberPath1</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath2" target="_blank">triangleVertexMemberPath2</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath3" target="_blank">triangleVertexMemberPath3</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.longitudeMemberPath" target="_blank">longitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.latitudeMemberPath" target="_blank">latitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.colorMemberPath" target="_blank">colorMemberPath</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				地理等高線シリーズ
			</td>

			<td>
				三角測量 (ITF) ファイルまたはその他のカスタム三角測量データ ソースで定義される不規則三角網 (TIN) に基づいて、色付けされた閉じたパスを視覚化します。地理座標および値メンバーも必要です。これは地形高度、人口密度、平均/現在の気温などを示すために使用されます。

				<img alt="" src="images/Overview_(igMap)_6.png" width="319" height="230"><br>関連トピック:

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Geographic-Contour-Line-Series.html">地理等高線シリーズの構成</a></li>
				</ul>
			</td>

			<td>geographicContourLine</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangulationDataSource" target="_blank">triangulationDataSource</a>

				オプション:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath1" target="_blank">triangleVertexMemberPath1</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath2" target="_blank">triangleVertexMemberPath2</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath3" target="_blank">triangleVertexMemberPath3</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.longitudeMemberPath" target="_blank">longitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.latitudeMemberPath" target="_blank">latitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.valueMemberPath" target="_blank">valueMemberPath</a></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>





##<a id="min-requirements"></a>最低必要条件

### <a id="min-introduction"></a>概要

`igMap` コントロールは jQuery UI ウィジェットの 1 つであり、jQuery ライブラリと jQuery UI ライブラリに依存します。Modernzr ライブラリは、ブラウザとデバイスの機能を検出するために内部的に使用されます。コントロールは、機能とデータのバインディング用の %%ProductName%%™ の共有リソースを使用します。これらのリソースへの参照は、実際の jQuery または %%ProductNameMVC%% が使用されているとしても必要となります。コントロールが ASP.NET MVC のコンテクスト内で使用されている場合、`Infragistics.Web.Mvc` アセンブリが必要です。

### <a id="min-requirements-summary"></a>要件の概要表

以下の表は、`igMap` コントロールの要件をまとめています。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th>
				要件
			</th>

			<th>
				説明
			</th>
		</tr>

		<tr>
			<td>
				HTML5 キャンバス API
			</td>

            <td>
igMap コントロールの機能は、HTML5 Canvas タグとそれに関連する API に基づきます。これらをサポートする Web ブラウザであれば、コントロールが生成するマップを描画および表示できます。igMap コントロールの操作にはその他の HTML5 機能は必要ありません。[Wikipedia™](http://en.wikipedia.org/wiki/Main_Page) の[キャンバス 要素: サポート](http://en.wikipedia.org/wiki/Canvas_element#Support)のトピックには、HTML5 キャンバス API をサポートしている、最も一般的なデスクトップとモバイル Web ブラウザのバージョンがが詳述されています。
			</td>
		</tr>

		<tr>
			<td>
				jQuery および jQuery UI JavaScript リソース
			</td>

			<td>
				%%ProductName%% は、これらのフレームワークの最上位にビルドされます。

				<ul>
					<li>jQuery</li>

					<li>jQuery UI</li>
				</ul>

				フレームワークは、igMap コントロールを使用する Web ページによって参照される必要があります。
			</td>
		</tr>

		<tr>
			<td>
				Modernizr

				（オプション）
			</td>

			<td>
				Modernizr ライブラリは、ブラウザおよびデバイス機能を検出するために igMap で使用されます。これは必須ではなく、含まれていない場合、コントロールは HTML5 をサポートするブラウザーが動作する通常のデスクトップ環境であるように動作します。

				<ul>
					<li>Modernizr</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				JavaScript リソース
			</td>

			<td>
				igMap コントロールの機能は、%%ProductName%% ライブラリからの一部のユーティリティとデータ視覚化コアを使用します。

				<table class="table">
					<thead>
						<tr>
							<th>JS リソース</th>

							<th>説明</th>
						</tr>
					</thead>
					<tbody>
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
								`infragistics.datasource.js`
							</td>

							<td>
								igDataSource コントロール
							</td>
						</tr>
						
						<tr>
							<td>
								`infragistics.ui.widget.js`
                            </td>
							<td>
								すべての %%ProductName%% ウィジェットの基本 igWidget。
							</td>
						</tr>

						<tr>
							<td>
						        `infragistics.ext_core.js`<br/>
						        `infragistics.ext_collections.js`<br/>
						        `infragistics.ext_ui.js`<br/>
								`infragistics.dv_jquerydom.js`<br/>
						        `infragistics.ext_text.js`<br/>
						        `infragistics.ext_io.js`<br/>
						        `infragistics.ext_threading.js`<br/>
						        `infragistics.ext_web.js`<br/>
						        `infragistics.dv_core.js`<br/>
						        `infragistics.dv_geo.js`<br/>
						        `infragistics.dv_geometry.js`<br/>
						    </td>

							<td>
								データ可視化コア機能
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.dvcommonwidget.js`
							</td>

							<td>
								チャートおよびマップの共通ウィジェット
							</td>
						</tr>
						
						<tr>
							<td>
								`infragistics.dv_interactivity.js`<br/>
								`infragistics.datachart_interactivity.js`
                            </td>
							<td>
								パンニング、ズーム、ドラッグなどのユーザー インタラクションのサポートを提供します。
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.datachart_core.js`<br/>
								`infragistics.datachart_scatter.js`<br/>
							</td>

							<td>
								チャート シリーズ機能
							</td>
						</tr>
						
						<tr>
							<td>
								`infragistics.geographicmap_core.js`
							</td>

							<td>
								コア マップ視覚化機能
							</td>
						</tr>

						<tr>
							<td>
								`infragistics.ui.map.js`
							</td>

							<td>
								マップ ウィジェット
							</td>
						</tr>

					</tbody>
				</table><br>
			</td>
		</tr>

		<tr>
			<td>
				CSS リソース
			</td>

			<td>
				CSS リソースは、IG テーマおよびマップ構造 CSS で構成されます。

				IG テーマには、%%ProductName%% ライブラリ用に作成されたカスタム ビジュアル スタイルが含まれます。これは次のファイルに含まれます。`{IG CSS root}/themes/Infragistics/infragistics.theme.css`

				マップ構造 CSS リソースは、マップ コントロールのさまざまな要素を描画するために使用されます。`{IG CSS root}/structure/modules/infragistics.ui.map.css`
			</td>
		</tr>
	</tbody>
</table>



>**注:** `igLoader` コントロールを使用して JavaScript および CSS リソースを読み込むことが推奨されます。`igLoader` コントロールを `igMap` と共に使用する方法の例は、[igMap の追加](Adding-igMap.html)のトピックおよび[地理シンボル シリーズ シリーズ](%%SamplesUrl%%/map/geo-symbol-series)のサンプルを参照してください。



##<a id="main-features"></a>主要な機能の概要


### <a id="main-features-chart"></a>主要な機能の概要表

以下の表は、`igMap` コントロールの主な機能をまとめています。追加の詳細は、以下の概要表の下に示します。

機能|説明
---|---
[さまざまなマップ プロバイダーのサポート](#different-map-providers)|マップ プロバイダーはマップ画像を提供し、マップ シリーズはこの背景コンテンツを介してオーバーレイとして描画されます。任意の背景コンテンツ上で、あらゆる 地理シリーズを描画することができます。
[さまざまなマップ タイプ（シリーズ）のサポート](#map-types-summary)|`igMap` コントロールは、さまざまな map シリーズを視覚化できます。シリーズ タイプは、各 series オブジェクトの type オプションによって決定されます。マップ シリーズ タイプによって、異なる種類の入力データを供給する必要があり、それに対応して異なるデータ バインディング オプションを設定する必要があります。
[ズーム](#zooming)|ズームは、`igMap` コントロールのユーザー相互作用機能の一部です。これによって、特定のマップ領域を公開したり、よりスケールの大きいビューを表示したりすることができます。ズームもまた、コントロールの API を使用して、コードによって実行することができます。
[パンニング](#panning)|パンは、`igMap` コントロールのユーザー相互作用機能の一部です。これによって、現在表示されているウィンドウをマップから North、South、East、または West に移動させることができます。パンもまた、コントロールの API を使用して、コードによって実行することができます。
[ツールチップ](#tooltips)|マーカーまたはマップの形状領域上をホバーしたときに、ツールチップを表示できます。ツールチップはカスタム HTML マークアップを描画し、マップの特定の領域に関するデータを表示できるテンプレートに基づいています。
[カスタマイズ可能なマーカー](#customizable-markers)|さまざまなマーカーを使用して、マップからのポイントを指定することができます。円、三角形、ダイアモンドなどの、多くの形状が内蔵されています。内蔵のマーカーとは別に、キャンバス 要素で直接描画することによってカスタム マーカーを作成するオプションがあります。
[シリーズのカスタマイズ可能なルック アンド フィール](#customizable-appearance)|アウトライン、形状、および塗りつぶしなどのシリーズの視覚的コンポーネントは、線の太さとパターン、色、色のグラデーション、不透明度などに関して構成することができます。適用できる正確なカスタマイズは、各シリーズのタイプに対して固有です。
[データ属性にバインドする](#data-binding)|マップ シリーズは、地理座標および/または三角形の他、カスタム データに基づいています。カスタム データ属性（またはデータ レコードのメンバー）にアクセスしてそれをツールチップまたはカスタム マーカーで表示することができます。


### <a id="different-map-providers"></a>さまざまなマップ プロバイダーのサポート

`igMap` コントロールに表示される実際のマップの背景は、マップ プロバイダーから取得したコンテンツです。`igMap` は、さまざまなマップ プロバイダーを使用できます。マップ プロバイダーはマップ画像を提供し、マップ シリーズはこの背景コンテンツを介してオーバーレイとして描画されます。

`igMap` コントロールは以下のマップ プロバイダーをサポートしています。

-   OpenStreetMap
-   Bing Maps

>**注:** Bing Maps では、コンテンツにアクセスするには、カスタム アクセス キーを提供する必要があります。

以下の表は、利用可能な 3 つのマップ プロバイダーを使用して、同じマップ領域と地理シンボル シリーズを示しています。

OpenStreetMap|Bing Maps
---|---
![](images/Overview_%28igMap%29_7.png)|![](images/Overview_%28igMap%29_8.png)



### 関連トピック:

-   [マップ プロバイダーの構成](igMap-Configuring-Map-Provider.html)

### <a id="zooming"></a>ズーム

ズーム機能によって、ズームインして特定のマップ領域を公開したり、ズームアウトしてよりスケールの大きいビューを表示したりすることができます。ズームインとズームアウトは、キーボードおよび/またはマウスを使って、タッチ デバイスでタッチ、ホールド、ドラッグして、あるいは Overview Plus Detail (OPD) 画面の支援によって、ユーザーが直接実行できます。ズームは、`igMap` コントロールの [windowRect](%%jQueryApiUrl%%/ui.igMap#options:windowRect) オプションを使用して、コードによって実行することもできます。

以下の表は、初期のマップ ビューとズームイン ビューを示しています。

初期のビュー|ズームイン ビュー
---|---
![](images/Overview_%28igMap%29_2.png)|![](images/Overview_%28igMap%29_11.png)



### 関連トピック:

-   [ナビゲーション機能の構成](igMap-Configuring-Navigation-Features.html)

###<a id="panning"></a> パンニング

パンによって、現在表示されているウィンドウをマップから North、South、East、または West に移動させることができます。パンは、キーボードおよび/またはマウスを使って、タッチ デバイスでタッチ、ホールド、ドラッグして、あるいは Overview Plus Detail (OPD) 画面の支援によって、ユーザーが直接実行できます。ズームは、`igMap` コントロールの [windowRect](%%jQueryApiUrl%%/ui.igMap#options:windowRect) オプションを使用して、コードによって実行することもできます。

以下の表は、初期のマップ ビューと、わずかに East にパンされた同じビューを示しています。

初期のビュー|East にパン
---|---
![](images/Overview_%28igMap%29_12.png)|![](images/Overview_%28igMap%29_13.png)



### 関連トピック:

-   [ナビゲーション機能の構成](igMap-Configuring-Navigation-Features.html)

### <a id="tooltips"></a>ツールチップ

ツールチップによって、マップ上に特定のポイントまたは区域に関する情報を表示することができます。ツールチップは、ユーザーが、マウス ポインターをマップ上のマーカーまたは形状領域でホバー、あるいはタッチ対応デバイス上をタッチまたは押さえると表示されます。ツールチップは、カスタム HTML マークアップを描画し、マップの特定の領域にバインドされたデータにアクセスできるテンプレートに基づいています。テンプレートの描画は `igTemplating` エンジンによって実行されます。（詳細は、[igTemplating](igTemplating-Overview.html) を参照してください）

以下の画像は、シリーズのポイント上でツールチップが有効になった、地理シンボル シリーズ マップを示しています。

![](images/Overview_%28igMap%29_14.png)

### 関連トピック:

-   [ビジュアル機能の構成](igMap-Configuring-Visual-Features.html)

###<a id="customizable-markers"></a> カスタマイズ可能なマーカー

`igMap` コントロールはマーカーを使用して、地理シンボル シリーズおよび地理図形シリーズのマップ上のポイントを指定します。マーカーは、いくつかの内蔵の形状とそのアウトラインの色と太さで構成することができ、塗りつぶし色は `igMap` コントロールのプロパティまたは CSS によって制御できます。アプリケーションにとって必要であれば、マーカーの表示を無効にすることもできます。標準のマーカーは、円、三角形、ピラミッド、四角形、ダイアモンド、五角形、六角形、四面体、星形五角形、および六線星形ですが、カスタムのマーカーも構成できます。

以下の画像は、いくつかのポイントが四角形のマーカーによって示されたマップ領域を示しています。

![](images/Overview_%28igMap%29_15.png)

内蔵マーカーの形状と動作が十分でない場合は、マーカーがマップ上で描画されるときに常にカスタム マーカーの drawing 関数が呼び出されるように構成することができます。あらゆるカスタム マーカー関数は、キャンバス コンテキスト オブジェクト、マーカー領域の位置とサイズ、およびマーカーにバインドされたデータ項目と共にオブジェクトを受け取ります。また、マーカーのカスタム サイズを計算して返すために、別の関数を提供することもできます。マーカーの drawing 関数は、HTML5 キャンバス API 全体を使用して、クライアント アプリケーションまたは Web ページの要件に合ったものを何でも描画することができます。

以下の画像は、データ ポイントに関する詳細情報を表示するカスタム マーカーと共にマップを示しています。

![](images/Overview_%28igMap%29_16.png)

### 関連トピック:

-   [ビジュアル機能の構成](igMap-Configuring-Visual-Features.html)

### <a id="customizable-appearance"></a>シリーズのカスタマイズ可能なルック アンド フィール

アウトライン、形状、および塗りつぶしなどのシリーズの視覚的コンポーネントは、線の太さとパターン、色、色のグラデーション、不透明度などに関して構成することができます。適用できる正確なカスタマイズは、各シリーズのタイプに対して固有です。

-   **地理シンボル シリーズ、地理図形シリーズ、および 地理ポリライン シリーズ**

地理シンボル シリーズ、地理図形シリーズ、および 地理ポリライン シリーズに関しては、視覚化の性質によって、アウトラインと塗りつぶしが必要です。HTML の標準色または rgba 構文を使用して、マーカーと形状アウトライン、およびポリラインの色、不透明度および線の太さを指定できます。マーカーおよび形状の塗りつぶしの色と不透明度を指定できます。これらのすべての要素は、オプションおよび CSS の両方によって構成可能です。

以下の画像は、いくつかのカスタム色が適用された地理図形シリーズのマップを示しています。

![](images/Overview_%28igMap%29_17.png)

-   **地理散布エリア シリーズ および 地理等高線シリーズ**

地理散布エリア シリーズ および 地理等高線シリーズは、色のパレットを使用して視覚化を行います。各ポイントの実際の色は、構成可能なデータ属性、および最小値と最大値に基づいて、パレットから選択されます。色のパレットは構成可能であり、任意の数の色を含めることができます。パレットの最初の色は最小値未満の値に適用され、最後の色は最大値より大きい値に適用されます。

以下の画像は、カスタム マップと共に、地理散布エリア マップを示しています。

![](images/Overview_%28igMap%29_18.png)

-   **地理図形シリーズ**

地理図形シリーズによって、塗りつぶし用のさまざまな色、および各形状用のアウトラインを設定できます。これを達成するには、描画されている各形状に対して呼び出されるカスタム関数を指定します。関数は、アウトラインと塗りつぶし色を選択するために、特定の形状にバインドされたデータに基づいてカスタム ロジックを適用できます。これは、そのデータ属性に従った色ごとの政治地図の描画、または任意の地理的地域の指定に役立ちます。

以下の図は、人口によって国を異なる色で表した世界地図を示しています。

![](images/Overview_%28igMap%29_19.png)

### 関連トピック:

-   [スタイル設定 (igMap)](Styling-igMap.html)



##<a id="user-interaction"></a>ユーザー相互作用と操作性

### ユーザー インタラクションの概要

次の表は、`igMap` コントロールの主な機能を要約したものです。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th>
				目的
			</th>

			<th>
				方法
			</th>

			<th>
				詳細
			</th>

			<th>
				クライアント/サーバー設定

				<ul>
					<li>詳細については、次を参照してください</li>
				</ul>
			</th>
		</tr>

		<tr>
			<td>
				ズーム
			</td>

			<td>
				<ul>
					<li>マウス ドラッグ</li>

					<li>Ctrl/Alt/Shift + マウス ドラッグ</li>

					<li>マウス スクロール</li>

					<li>デュアル タッチ ドラッグ</li>

					<li>Page Up/Page Down</li>
				</ul>
			</td>

			<td>
				ズームインすると、地域の詳細表示が可能になります。ズームアウトすると、領域の広範なビューが表示されます。
			</td>

			<td>
				<img alt="" src="images/positive.png" width="19" height="18">

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Navigation-Features.html">ナビゲーション機能の構成</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				パン
			</td>

			<td>
				<ul>
					<li>マウス ドラッグ</li>

					<li>Ctrl/Alt/Shift + マウス ドラッグ</li>

					<li>タッチ アンド ドラッグ</li>

					<li>矢印キー</li>
				</ul>
			</td>

			<td>
				ビューを水平または垂直に移行し、隣接した領域を表示します。
			</td>

			<td>
				<img alt="" src="images/positive.png" width="19" height="18">

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Navigation-Features.html">ナビゲーション機能の構成</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				移動する
			</td>

			<td>
				OPD パネル
			</td>

			<td>
				マップの現在表示されている部分の相対位置を示します。ズーム用のボタンとスライダーを含み、現在表示されているウィンドウをパンできます。
			</td>

			<td>
				<img alt="" src="images/positive.png" width="19" height="18">

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Navigation-Features.html">ナビゲーション機能の構成</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				ビュー ツールチップ
			</td>

			<td>
				<ul>
					<li>マウス ホバー</li>

					<li>タッチ アンド ホールド</li>
				</ul>
			</td>

			<td>
				ユーザーにツールチップを表示します。
			</td>

			<td>
				<img alt="" src="images/positive.png" width="19" height="18">

				<ul>
					<li><a class="ig-topic-link" href="igMap-Configuring-Visual-Features.html">ビジュアル機能の構成</a></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>


##<a id="data-binding"></a>データ バインディング

### データ バインディングの概要

マップ シリーズは、地理座標および/または三角形の他、カスタム データに基づいています。
カスタム データ属性（またはデータ レコードのメンバー）にアクセスしてそれをツールチップまたはカスタム マーカーで表示することができます。

マップ オーバーレイの本質は、指定された地理座標にバインドされたデータ レコードに基づいていることです。`igMap` コントロールは、単一ポイントまたは接続されたポイント、あるいは三角形での地理データが必要であり、また任意の追加データ属性を各地理要素にバインドできます。お互いにバインドされたデータは、ツールチップ テンプレート、または可視化のルック アンド フィールをカスタマイズするためにコントロールが呼び出すさまざまなコールバック メソッドでアクセスできます。コントロールは、シェープ ファイルおよびデータベース (DBF) ファイルと共に、地理的緯度と経度で指定されたシンプルなポイントを認識し、それを使って動作します。

### 関連トピック:

-   [データ バインディング (igMap)](Data-Binding-igMap.html)


##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[igMap の追加](Adding-igMap.html): このトピックでは、基本的な機能を備えた簡易マップを Web ページに追加する方法を示します。

-	[データ バインディング (igMap)](Data-Binding-igMap.html): このトピックは、視覚化されたマップ シリーズに応じて `igMap` コントロールをさまざまなデータ ソースにバインドする方法を説明します。

-	[マップのスタイル設定 (igMap)](Styling-igMap.html): このトピックでは、テーマを使用して `igMap`™ コントロールのルック アンド フィールをカスタマイズする方法を説明します。

-	[機能の構成 (igMap)](igMap-Configuring-Features.html): このグループのトピックでは、`igMap`™ コントロールのさまざまな機能の構成方法を説明します。対応する機能としては、特定の地理領域へのナビゲーション、Overview Plus Detail パネルの有効または無効化、表示中の領域をマップ上で取得、パンとズームに関するユーザー インタラクションの構成、ツールチップ テンプレートの構成、カスタム マーカーの設定などがあります。

-	[マップ シリーズの構成 (igMap)](igMap-Creating-Different-Kinds-Maps.html): このグループのトピックでは、`igMap` コントロールによってサポートされているすべてのマップ タイプ (マップ シリーズ) を構成し、各種のマップを生成する方法を説明します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[マップのツールチップ](igmap-configuring-visual-features.html#map-tooltips-sample): このサンプルでは、`igMap` コントロールのマップ ツールチップを設定する方法を紹介します。





 

 



<!--
|metadata|
{
    "fileName": "igdatachart-overview",
    "controlName": "igDataChart",
    "tags": ["Charting","Data Presentation","Getting Started"]
}
|metadata|
-->

# 概要 (igDataChart)



### 目的

このトピックは、`igDataChart`™ コントロールについて、その主要機能、最低必須事項、ユーザー機能といった事項の概念的情報を提供します。

### 必要な背景

以下の表に、このトピックを理解するための前提条件として求められる素材をリストします。


**概念**

-   チャート作成
-   チャート タイプ
-   データの可視化

**トピック**


-	[%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html)

%%ProductName%%™ ライブラリにつぃての一般的情報

### このトピックの構成

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [サポートされるチャート タイプ](#supported-chart-types)
-   [最低必要条件](#min-requirements)
-   [主要機能](#main-features)
   -   [機能の概要](#features-overview)
    -   [凡例](#legend)
    -   [複合チャート](#composite-charts)
    -   [ナビゲーション](#navigation)
    -   [軸](#axis-options)
    -   [ツールチップ](#tooltips)
    -   [十字線](#crosshairs)
    -   [マーカー](#markers)
    -   [トレンドライン](#trend-lines)
-   [ユーザー相互作用と操作性](#user-interaction)
-   [関連コンテンツ](#related-content)
   -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="introduction"></a>概要


### igDataChart の概要

igDataChart は、さまざまな種類のチャートを HTML5 Web アプリケーションおよびサイトに描画するチャート コントロールです。HTML5 の新しい Canvas タグを使用して、データ シリーズを Web ページにプロットします。

![](images/igDataChart_Overview_1.png)

`igDataChart` コントロールを使用すると、多くのさまざまなシリーズ タイプを棒チャート/柱状チャート、財務、カテゴリ (折れ線、スプライン、エリアなど)、極座標、ラジアル、散布図 (散布図および散布図折れ線) 他のように描画できます。チャートは、各データ シリーズの意味をマークする 1 つまたは複数の凡例で構成できます。さらに、他のビジュアル要素およびユーザー操作要素を、十字線、概要と詳細 (OPD) ペイン、軸の主線/副線、軸の幅などのように構成できます。詳細については、[主な機能](#main-features)のセクションを参照してください。



##<a id="supported-chart-types"></a>サポートされるチャート タイプ


### サポートされるチャート タイプの概要

`igDataChart` コントロールは、さまざまな可視化の目的に対して導入されるいろいろなシリーズ タイプを可能にします。

サポートされるチャート タイプの詳細と基本的な構成情報については、[サポートされるチャート タイプの表](#supported-chart-types)のブロックを参照してください。

>**注:** 円グラフは別のコントロール `igPieChart`™ で作成されます。詳細は [igPieChart の概要](igPieChart-Overview.html)をご覧ください。

### サポートされるチャート タイプの表

以下の表はサポートされているチャート タイプを示します。

<table class="table">
	<thead>
		<tr>
            <th>
チャート タイプ
			</th>
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
	</thead>
	<tbody>
        <tr>
            <td>
棒と柱状
			</td>
            <td>
棒
			</td>
            <td>
分類されたデータを水平の棒で可視化します。
			</td>
            <td>
bar
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
列
			</td>
            <td>
分類されたデータを垂直の柱で可視化します。
			</td>
            <td>
column
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
カテゴリ
			</td>
            <td>
線
			</td>
            <td>
分類されたデータをデータ ポイントに鋭い角をもつ線で可視化します。
			</td>
            <td>
line
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
エリア チャート
			</td>
            <td>
分類されたデータをデータ ポイントに鋭い角をもつ線の下の色づけされた領域で可視化します。
			</td>
            <td>
area
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
スプライン
			</td>
            <td>
分類されたデータをデータ ポイント上のなめらかな角をもつ線で可視化します。
			</td>
            <td>
spline
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
スプライン エリア チャート
			</td>
            <td>
分類されたデータをデータ ポイントになめらかな角をもつ線の下の色づけされた領域で可視化します。
			</td>
            <td>
splineArea
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
ウォーターフォール
			</td>
            <td>
分類されたデータを垂直の柱で可視化し、先頭のカテゴリーに対応する先頭の柱は x 軸から始まり、続くカテゴリーはそれぞれ前のカテゴリーが終わったとこから始まります。
			</td>
            <td>
waterfall
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
財務
			</td>
            <td>
ロウソク足チャート
			</td>
            <td>
ロウソク足の形で財務 (投資) 指標の始値、終値、安値、高値を表示します。
			</td>
            <td>
candlestick
			</td>
            <td>
                <ul>
                    <li>
[openMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:openMemberPath)
					</li>

                    <li>
[closeMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:closeMemberPath)
					</li>

                    <li>
[highMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:highMemberPath)
					</li>

                    <li>
[lowMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:lowMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
OHLC チャート
			</td>
            <td>
Open、High、Low、Close の略開始と終わりの値のマーキングをもつ垂直線の形で財務 (投資) 指標の始値、終値、安値、高値を表示します。
			</td>
            <td>
ohlc
			</td>
            <td>
                <ul>
                    <li>
[openMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:openMemberPath)
					</li>

                    <li>
[closeMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:closeMemberPath)
					</li>

                    <li>
[highMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:highMemberPath)
					</li>

                    <li>
[lowMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:lowMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
極座標
			</td>
            <td>
極座標散布図
			</td>
            <td>
極座標系でドット (またはその他のマーカー) によるデータの可視化を行います。
			</td>
            <td>
polarScatter
			</td>
            <td>
                <ul>
                    <li>
[angleMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:angleMemberPath)
					</li>

                    <li>
[radiusMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:radiusMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
極座標折れ線チャート
			</td>
            <td>
極座標系でデータ ポイントを直線で結んだ線によりデータを可視化します。
			</td>
            <td>
polarLine
			</td>
            <td>
                <ul>
                    <li>
[angleMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:angleMemberPath)
					</li>

                    <li>
[radiusMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:radiusMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
極座標エリア チャート
			</td>
            <td>
極座標系でデータ ポイントを直線で結んだ線の下の色づけされた領域でデータを可視化します。
			</td>
            <td>
polarArea
			</td>
            <td>
                <ul>
                    <li>
[angleMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:angleMemberPath)
					</li>

                    <li>
[radiusMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:radiusMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
ラジアル
			</td>
            <td>
ラジアル折れ線チャート
			</td>
            <td>
カテゴリー化されたデータをデータ ポイントを直線で結んだ線により可視化し、すべてのカテゴリーを円内に配置します。
			</td>
            <td>
radialLine
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
ラジアル柱状チャート
			</td>
            <td>
カテゴリー化されたデータを共通の中心から異なる角度で伸ばした柱で可視化します。
			</td>
            <td>
radialColumn
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
ラジアル円チャート
			</td>
            <td>
カテゴリー化されたデータを共通の中心から異なる角度で伸ばしたパイのスライス型要素で可視化します。
			</td>
            <td>
radialPie
			</td>
            <td>
[valueMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemberPath)
			</td>
        </tr>
        <tr>
            <td>
範囲カテゴリ
			</td>
            <td>
範囲エリア チャート
			</td>
            <td>
2 つの値の間の範囲内にある分類されたデータをデータ ポイントを 2 本の直線で結び、間の領域を色づけして可視化します。
			</td>
            <td>
rangeArea
			</td>
            <td>
                <ul>
                    <li>
[lowMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:lowMemberPath)
					</li>

                    <li>
[highMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:highMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
範囲柱状チャート
			</td>
            <td>
2 つの値の間の範囲内にある分類されたデータを柱で可視化します。
			</td>
            <td>
rangeColumn
			</td>
            <td>
                <ul>
                    <li>
[lowMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:lowMemberPath)
					</li>

                    <li>
[highMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:highMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
バブル
			</td>
            <td>
バブル
			</td>
            <td>
複数のパラメータで記述されたデータを異なる直径の色づけされた円で可視化します。
			</td>
            <td>
bubble
			</td>
            <td>
                <ul>
                    <li>
[xMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:xMemberPath)
					</li>

                    <li>
[yMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:yMemberPath)
					</li>

                    <li>
[radiusMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:radiusMemberPath)
					</li>

                    <li>
[fillMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:fillMemberPath)
					</li>

                    <li>
[labelMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:labelMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
散布図
			</td>
            <td>
散布図
			</td>
            <td>
データをデカルト座標系上のドットで可視化します。
			</td>
            <td>
scatter
			</td>
            <td>
                <ul>
                    <li>
[xMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:xMemberPath)
					</li>

                    <li>
[yMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:yMemberPath)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
			</td>
            <td>
散布図 - 折れ線
			</td>
            <td>
デカルト座標系でデータ ポイントを直線で結んだ線によりデータを可視化します。
			</td>
            <td>
scatterLine
			</td>
            <td>
                <ul>
                    <li>
[xMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:yMemberPath)
					</li>

                    <li>
[yMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:yMemberPath)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



##<a id="min-requirements"></a>最低必要条件


### 最低要件の概要

`igDataChart` コントロールは jQuery UI ウィジェットの 1 つであるため、jQuery ライブラリと jQuery UI ライブラリに依存します。Modernzr ライブラリは、内部的にブラウザーと装置の機能を検出するためにも使用されています。コントロールは、機能とデータのバインド用の %%ProductName%%™ の共有リソースのいくつかを使用します。これらのリソースへの参照は、実際の jQuery または %%ProductNameMVC%% が使用されているとしても必要となります。コントロールが ASP.NET MVC のコンテクスト内で使用されている場合、`Infragistics.Web.Mvc` アセンブリが必要です。

### 最低要件の概要表

以下の表で、 `igDataChart` コントロールを使用するための要件を簡単に説明します。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
要件
			</th>

            <th>
説明
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
HTML5 キャンバス API
			</td>

            <td>
チャート用ライブラリの機能は、HTML5 Canvas タグとそれに関する API に基づきます。これらをサポートする Web ブラウザーは、igDataChart コントロールで生成されたチャートを描画し、表示できます。その他の HTML5 機能は、igDataChart コントロールの操作に必要です。[Wikipedia™](http://en.wikipedia.org/wiki/Main_Page) の[キャンバス 要素: サポート](http://en.wikipedia.org/wiki/Canvas_element#Support)のトピックには、HTML5 キャンバス API をサポートしている、最も一般的なデスクトップとモバイル Web ブラウザのバージョンがが詳述されています。
			</td>
		</tr>

		<tr>
			<td>
jQuery および jQuery UI JavaScript リソース
			</td>

			<td>
				%%ProductName%% は、これらのフレームワークの最上位にビルドされます。

				<ul>
					<li>
[jQuery](http://docs.jquery.com/Main_Page)
					</li>

					<li>
[jQuery UI](http://jqueryui.com/)
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
Modernizr
			</td>

			<td>
				Modernizr ライブラリはブラウザー機能とデバイス機能を検出するため igDataChart で使用されます。これは必須ではなく、含まれていない場合、コントロールは HTML5 をサポートするブラウザーが動作する通常のデスクトップ環境であるように動作します。

				<ul>
					<li>
[Modernizr](http://modernizr.com/docs/)
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
一般のチャート JavaScript リソース
			</td>

			<td>
				%%ProductName%% ライブラリのチャート表示機能は、シリーズ タイプに応じて複数のファイルに渡って配布されます。

				手動でリソースを組み込む場合は、以下の表に示す依存関係を使用する必要があります。

				<table class="table table-bordered">
	<thead>
		<tr>
							<th>
JS リソース
			</th>

							<th>
説明
			</th>
						</tr>
	</thead>
	<tbody>
						

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
igDataSource コントロール
			</td>
						</tr>

						<tr>
							<td>
infragistics.ext_core.js<br>
infragistics.ext_collections.js<br>
infragistics.ext_ui.js<br>
infragistics.dv_jquerydom.js<br>
infragistics.dv_core.js<br>
infragistics.dv_geometry.js<br>
infragistics.datachart_core.js
			</td>

							<td>
データ可視化コア機能
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
infragistics.ui.chart.js
			</td>

							<td>
チャート UI ウィジェット
			</td>
						</tr>
						<tr>
							<td>
infragistics.legend.js<br>
infragistics.ui.chartlegend.js
			</td>

							<td>
チャート凡例機能および UI ウィジェット
			</td>
						</tr>

						<tr>
							<td>
infragistics.dv_opd.js
			</td>

							<td>
チャートの概要と詳細ペイン機能
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
					</tbody>
</table>
			</td>
		</tr>

		<tr>
			<td>
チャート タイプ固有の JavaScript リソース
			</td>

			<td>
				上記の一般的なチャート リソースに加えて、使用しているそれぞれのチャート タイプに関連する参照を組み込む必要があります。

				<table class="table table-bordered">
	<thead>
		<tr>
							<th>
チャート シリーズの種類
			</th>

							<th>
JS リソース
			</th>
						</tr>
	</thead>
	<tbody>
						<tr>
			<td>
				共有のカテゴリ機能
			</td>
			<td>
				infragistics.datachart_categorycore.js
			</td>
		</tr>

						<tr>
							<td>
エリア チャート、棒チャート、柱状チャート、折れ線チャート、スプライン チャートすべて、ウォーターフォール
			</td>

							<td>
infragistics.datachart_category.js
			</td>
						</tr>
						
						<tr>
			<td>
				棒チャート
			</td>
			<td>
				infragistics.datachart_verticalcategory.js
			</td>
		</tr>

						<tr>
							<td>
Financial、平均値インジケーター
			</td>

							<td>
infragistics.datachart_financial.js<br>
				infragistics.datachart_extendedfinancial.js
			</td>
						</tr>

						<tr>
							<td>
極座標エリア チャート、極座標折れ線チャート、極座標チャートすべて
			</td>

							<td>
infragistics.datachart_polar.js (依存関係: infragistics.datachart_extendedaxes.js)
			</td>
						</tr>

						<tr>
							<td>
ラジアル チャートすべて
			</td>

							<td>
infragistics.datachart_radial.js (依存関係: infragistics.datachart_extendedaxes.js)
			</td>
						</tr>

						<tr>
							<td>
範囲 チャートすべて
			</td>

							<td>
infragistics.datachart_rangecategory.js
			</td>
						</tr>

						<tr>
							<td>
散布図すべて
			</td>

							<td>
infragistics.datachart_scatter.js
			</td>
						</tr>
						<tr>
			<td>
				すべての積層型チャート
			</td>
			<td>
				infragistics.datachart_stacked.js (依存関係: infragistics.datachart_verticalcategory.js, infragistics.datachart_extendedaxes.js)

			</td>
		</tr>
	
		<tr>
			<td>
				ツールチップ、強調表示、注釈
			</td>
			<td>
				infragistics.datachart_annotation.js

			</td>
		</tr>
	
		<tr>
			<td>
				DateTimeAxis / TimeAxis
			</td>
			<td>
				infragistics.datachart_extendedaxes.js

			</td>
		</tr>
					</tbody>
</table>
			</td>
		</tr>

		<tr>
			<td>
IG テーマ
			</td>

			<td>
				このテーマには、%%ProductName%% ライブラリ向けに作成されたカスタム ビジュアル スタイルが含まれます。これは次のファイルに含まれます。

				<ul>
					<li>
{IG CSS root}/themes/Infragistics/infragistics.theme.css
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
チャート構造
			</td>

			<td>
				この CSS リソースは、コントロールのさまざまな要素を描画するためにチャート コンポーネントによって使用されます。

				<ul>
					<li>
{IG CSS root}/structure/modules/infragistics.ui.chart.css
					</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>


>**注:** 詳細については、[%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)トピックをご覧ください。



##<a id="main-features"></a>主要機能


###<a id="features-overview"></a> 機能の概要

以下の表は、`igDataChart` コントロールの主な機能についてまとめています。追加の詳細は、以下の概要表の下に示します。

<table class="table table-striped">
	<tbody>
		<tr>
			<th>
				機能
			</th>

			<th>
				説明
			</th>
		</tr>

		<tr>
			<td>
				[シリーズ タイプの選択](#supported-chart-types)
			</td>

			<td>
				チャートは複数の異なるシリーズ タイプを描画し ([複合チャート](#composite-charts)を参照)、シリーズ タイプは各 series オブジェクトの type オプションで決まります。シリーズ タイプに応じて、異なるタイプの x 軸および y 軸を選択する必要があり、異なるデータ バインディング オプションを設定する必要があります。
			</td>
		</tr>

		<tr>
			<td>[複合チャート](#composite-charts)</td>

			<td>
				複合チャートには、タイプが異なる複数のシリーズ、または範囲が異なる複数の y 軸があります。
			</td>
		</tr>

		<tr>
			<td>
				[凡例](#legend)
			</td>

			<td>
				チャートには凡例を構成し、視覚化されたあらゆるデータ シリーズのタイトルを表示できます。
			</td>
		</tr>

		<tr>
			<td>
				[ナビゲーション](#navigation)
			</td>

			<td>
				drag-to-zoom、drag-to-pan、概要と詳細ペイン (OPD) パネルなどのインタラクティブ機能により、簡単に詳細情報を拡大し、チャートの異なるエリア間をナビゲートできます。
			</td>
		</tr>

		<tr>
			<td>
				[軸](#axis-options)
			</td>

			<td>
				すべての軸で初期の範囲を定義し、後で外部コントロールをユーザー操作することで、実行時に範囲を変更できます。また、構成可能な軸ラベル、軸線、主線および副線、軸のストライプがあります。
			</td>
		</tr>

		<tr>
			<td>
				[ツールチップ](#tooltips)
			</td>

			<td>
				ツールチップはチャートの上に浮かぶように表示されます。ツールチップは、ツールチップ内に表示される特定の構造とデータを定義するテンプレートに基づいています。
			</td>
		</tr>

		<tr>
			<td>
				[十字線](#crosshairs)
			</td>

			<td>
				十字線は、チャート上のマウスの動作に合わせて動き、2 本の線が正しい角度で交わることでマウス ポインターの先端の場所を指定します。
			</td>
		</tr>

		<tr>
			<td>
				[マーカー](#markers)
			</td>

			<td>
				チャートのデータ ポイントを指定する場合に、さまざまなマーカーを使用できます。これらのマーカーは、三角形、ひし形、四角などタイプもさまざまです。
			</td>
		</tr>

		<tr>
			<td>[トレンドライン](#trend-lines)</td>

			<td>
				各種データ シリーズでは、示したデータのトレンドラインをコントロールにより計算し、表示できます。トレンドラインでは、既知の数学関数による傾向などを、視覚データで視覚的に特定できます。
			</td>
		</tr>
	</tbody>
</table>

### <a id="legend"></a>凡例

凡例は、チャートの各データ シリーズのアイコンとタイトルを表示するビジュアル パネルです。

![](images/igDataChart_Overview_2.png)

凡例は `igChartLegend` という %%ProductName%% ライブラリとは異なるコントロールで実装されており、ページに異なる div 要素が必要です。div 要素は、凡例に含まれるよう各 series オブジェクトで参照されます。`igChartLegend` は、以下で記述するトピックでカバーされる非常にシンプルなコントロールです。

###<a id="composite-charts"></a> 複合チャート

チャートは、タイプが異なる複数のシリーズを組み合わせたり、y 軸の範囲が異なるシリーズを持ったりすることができます。つまり、2 つのデータ シリーズは棒チャートや折れ線チャートなど異なるグラフで示すことができたり、値の範囲が異なるデータを同じチャートで示したりすることができます。

以下の図は、列と線のカテゴリ シリーズを組み合わせた複合チャートを示し、レグは個々の値を表し、線はこれらの値の合計を示し、その形式はトレンドを思わせます。

![](images/igDataChart_Overview_3.png)

###<a id="navigation"></a> ナビゲーション

ズーム、パンニング、概要と詳細 (OPD) ウィンドウによりチャートのナビゲーションが可能です。ズームはマウスをスクロールするか、拡大する領域を四角形にドラッグして行います。パンニングは、チャートがズームされているときにマウスをドラッグして行います。

OPD ウィンドウは、別のナビゲーション ツールです。ユーザーがチャートがアクティブ ビューのどこにあるのかわかるよう、アクティブ ビューがマークされたチャートを小型化した画像です。

![](images/igDataChart_Overview_4.png)

OPD ウィンドウはデフォルトで表示したり、API メソッドで起動して表示するよう構成できます。ズームとパンニングは両方とも、マウス ボタンを押したまま動かすといったドラッグ操作に依存しているため、デフォルトのドラッグ操作や、ドラッグ操作に代わるどの修飾キー (Ctrl、Alt、Shift) を使用するか構成できます。

###<a id="axis-options"></a> 軸

軸はすべてのチャートの主要機能で、さまざまな設定ができます。あらゆる軸の範囲は API 呼び出しにより定義および変更でき、アクティブ ビューのチャートで表示される値の範囲を定義できます。主な軸線の他に、チャートはキー値のタイトル、主グリッド線および副グリッド線、チャート上のエリアを簡単に区別できる軸のストライプも表示できます。

軸の要素は以下の図をご覧ください。

![](images/igDataChart_Overview_5.png)

**凡例:**

1.  軸線
2.  軸ラベル
3.  副線
4.  主線
5.  軸のストライプ

###<a id="tooltips"></a> ツールチップ

ツールチップは、現在のマウス位置に表示され、ツールチップ テンプレートで定義済みの情報を表示する小型のパネルです。通常は、チャートの特定のポイントで示された数値や他の関連する情報です。

![](images/igDataChart_Overview_6.png)

ツールチップ テンプレートは「`text/x-jquery-tmp`l」型の HTML script タグで定義したり、単に HTML マークアップによる文字列の場合があります。実質的にツールチップは、画面に描画される、パラメーター付きの HTML マークアップを定義します。置き換える値は `${item.Price}` などの jQuery テンプレート構文で定義します。

###<a id="crosshairs"></a> 十字線

十字線は、マウス ポインターをチャートに置いたときに、正しい角度で交わる現在のマウス位置に表示されている 2 本の線です。十字線は、チャート シリーズのデータを関連する軸上の同等の位置と画面上で揃えるのに役立ちます。

赤色の両矢印でマークされた十字線ラインは以下の図をご覧ください。

![](images/igDataChart_Overview_7.png)

###<a id="markers"></a> マーカー

マーカーは、データ シリーズのデータ ポイントごとに表示される小さな挿絵です。円、三角形、ひし形、ピラミッド、四角、五角形、六角形など多数のマーカー タイプが使用できます。

円のマーカーがあるチャート (一部のマーカーは赤の矢印で指定されている) は以下の図をご覧ください。

![](images/igDataChart_Overview_8.png)

### 関連トピック:

-   [igDataChart の追加](igDataChart-Adding.html)

###<a id="trend-lines"></a> トレンドライン

トレンドラインでは、既知の数学関数による傾向などを、視覚データで視覚的に特定できます。これにより、データの特性を「この系はリニアである」または「この値は指数関数的に増加している」などと特定できます。トレンドラインは通常、財務およびカテゴリのデータ シリーズに適用されます。

データが五次関数 (五次の多項式) とどれだけ密接に一致しているかを示す、「quintic fit」型トレンドラインの線のカテゴリ シリーズは、以下の図をご覧ください。

![](images/igDataChart_Overview_9.png)



##<a id="user-interaction"></a>ユーザー相互作用と操作性


###ユーザー インタラクションの概要

以下の表で、`igDataChart` コントロールのユーザー相互作用機能を簡単に説明します。Configurable? 列にあるトピックに、さらに詳しい説明があります。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
目的
			</th>
            <th>
方法
			</th>
            <th>
構成方法
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
ズーム
			</td>
            <td>
                <ul>
                    <li>
ドラッグ
					</li>

                    <li>
マウス スクロール
					</li>
                    <li>
二重タップ
					</li>
                </ul>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
パン
			</td>
            <td>
                <ul>
                    <li>
ドラッグ
					</li>
                    <li>
Ctrl/Alt/Shift キー + ドラッグ
					</li>
                </ul>
            </td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
移動する
			</td>
            <td>
OPD ウィンドウ
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
ホバー
			</td>
            <td>
マウス ホバー
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
軸線のオン/オフ
			</td>
            <td>
外部チェック ボックス
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
軸の主線および副線のオン/オフ
			</td>
            <td>
外部チェック ボックス
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
軸のストライプのオン/オフ
			</td>
            <td>
外部チェック ボックス
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
軸ラベルのオン/オフ
			</td>
            <td>
外部チェック ボックス
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
データ シリーズのオン/オフ
			</td>
            <td>
外部チェック ボックス
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
凡例のオン/オフ
			</td>
            <td>
外部チェック ボックス
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
マーカーのオン/オフ
			</td>
            <td>
外部チェック ボックス
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
    </tbody>
</table>


##<a id="related-content"></a>関連コンテンツ


###<a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[igPieChart の概要](igPieChart-Overview.html)

Web ページに円グラフを表示するための関連 `igPieChart` コントロールに関する基本情報が入っています。

-	[シリーズ タイプ (igDataChart)](igDataChart-Series-Types.html): このトピックでは、`igDataChart` コントロールにより生成できるあらゆる種類のチャートを表示します。

-	[構成可能な視覚要素 (igDataChart)](igDataChart-Visual-Elements.html): このトピックでは、`igDataChart` コントロールとそれらを管理するプロパティの構成可能なすべての視覚要素の一覧を示します。

-	[jQuery および MVC API リファレンス リンク (igDataChart)](igDataChart-API-Links.html): `igDataChart` の jQuery API リファレンスを参照し、すべての MVC ヘルパー プロパティとコード スニペットを記載したリファレンス テーブルが入っています。

-	[igDataChart をデータにバインド](igDataChart-DataBinding.html): 各種データ ソースから chart コントロールにデータをバインドする方法を示します。これには、JavaScript 配列、JSON、WCF サービスがあります。どれだけのボリュームのデータを chart コントロールにデータ バインドできるかを示します。

-	[igDataChart のスタイル設定](igDataChart-Styling-Themes.html): さまざまなスタイルとテーマを chart コントロールに適用する方法と、標準テーマの要素を変更する方法を示します。



###<a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。


-	[JSON のバインド](%%SamplesUrl%%/data-chart/json-binding): このサンプルでは、`igDataChart` を JSON データにバインドする方法を示しています。

-	[棒および柱状シリーズ](%%SamplesUrl%%/data-chart/bar-and-column-series): `igDataChart` コントロールを使用して棒チャートおよび柱状チャートを実装する方法を紹介します。

-	[チャート ナビゲーション](igDataChart-Configuring-Navigation-Features.html#example): ズーム、パンニング、ドラッグなどチャートに対するユーザー操作、およびこれらを API から制御する方法を紹介します。

-	[リアルタイムにデータをバインド](%%SamplesUrl%%/data-chart/binding-real-time-data): リアルタイム データを動的にデータ チャートにバインドする方法を紹介します。



 

 



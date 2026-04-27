<!--
|metadata|
{
    "fileName": "deployment-guide-javascript-files",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# %%ProductName%% での JavaScript ファイル

##トピックの概要

### 目的

このトピックは、%%ProductName%%™ に含まれるコントロールを使用して作業するために必要な JavaScript ファイルに関連する参照情報を提供します。

### 必要な背景

以下のリストは、この題材を理解するために必要な、前提条件となるトピックを示しています。

- [%%ProductName%% で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、Web アプリケーションで %%ProductName%% JavaScript を操作して、必要なリソースを管理する方法について説明します。

- [%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html): このトピックでは、デザイン段階でのアプリケーションのセットアップ手順について説明し、実稼働環境で CSS を使用するためのオプションを紹介すると同時に、テーマの作成またはカスタマイズについての概要を示します。

- [%%ProductName%% 向けのインフラジスティックス コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html): %%ProductName%% 対応 Infragistics Content Delivery Network (CDN) の使用方法。


### JavaScript ファイル種類の参照


以下は、%%ProductName%% に含まれる JavaScript のファイル種類の概要を示しています。

結合スクリプトを含む JavaScript ファイルの名前は以下のリストです:

-   `infragistics.core.js`
-   `infragistics.lob.js`
-   `infragistics.dv.js`
-	`infragistics.excel-bundled`
-	`infragistics.spreadsheet-bundled`
-	`infragistics.scheduler-bundled`

ファイルは js フォルダー (%%ProductName%% npm パッケージのインストール パス内の JavaScript ファイルのルート フォルダー) にあります。

ブルガリア語、ロシア語、英語、ドイツ語、スペイン語、およびフランス語の、結合スクリプト バージョンのローカライズ リソースもあります。ファイル名は `infragistics-bg.js`, `infragistics-en.js`、`infragistics-ru.js`、 `infragistics-de.js`、`infragistics-es.js`、および `infragistics-fr.js`であり、これらは `../js/i18n` フォルダーにあります。

**JavaScript 圧縮ファイル**

デバッグ バージョンの例外を除き、すべての JavaScript ファイルは圧縮されています。

**JavaScript 非圧縮ファイル** (デバッグ バージョン)

デバッグには、圧縮されていないファイルを使用します。これらのファイルは圧縮されたファイルと同じファイル構造を持ち、ファイル名も同じです。圧縮されていないファイルは、`.zip` アーカイブで提供されます (`infragistics.IgniteUI.debug.zip`)。

**インターナショナリゼーション**

以下の 2 種類のインターナショナリゼーションがあります。1 つ目は、コントロール内のローカライズ リソースです。2 つ目は、コントロール内の地域設定です。

コントロールのローカライズ リソースは、ブルガリア語、ロシア語、英語、ドイツ語、スペイン語、およびフランス語です。これらは、js/modules/i18n (*js* は、%%ProductName%% プログラムのインストール パス内の JavaScript ファイルのルート フォルダー) にあります。

地域設定 - igRegional JavaScript ファイルは、jQuery エディター用の日付、数字、通貨記号などのローカライズ フォーマットを提供します。これらは、`../js/modules/i18n/regional` (`js` は、%%ProductName%% npm パッケージのインストール パス内の JavaScript ファイルのルート フォルダー) にあります。

>**注:** 結合スクリプト ファイルを使用するときは、地域設定を常に参照する必要があります。これらは結合スクリプト ファイルの一部ではありません。

>**注:** 英語のローカライズ ファイルは圧縮された JS ファイルに統合され、明示的に参照する必要はありません。
その他の言語の場合は、該当するローカライズ スクリプトを実際のページ コードの JavaScript ファイルの前に参照する必要があります。

### JavaScript 拡張機能のファイル参照

以下は、%%ProductName%% に含まれる JavaScript [Knockout.js](http://knockoutjs.com) 機能拡張ファイルの概要です。

以下は、機能拡張スクリプトを含む JavaScript ファイルの名前です。

-   `infragistics.datasource.knockoutjs.js`
-   `infragistics.ui.combo.knockout-extensions.js`
-   `infragistics.ui.datachart.knockout-extensions.js`
-	`infragistics.ui.editors.knockout-extensions.js`
-	`infragistics.ui.grid.knockout-extensions.js`
-	`infragistics.ui.tree.knockout-extensions.js`

ファイルは js フォルダーの子である extensions フォルダーにあります。

>**注:** 機能拡張スクリプトは結合したファイルに含まれていません。機能拡張を使用する場合、このファイルを個別に参照する必要があります。

##コントロールによる JavaScript ファイルの参照

### %%ProductName%% コントロール リスト

特定のコントロールの必要な JavaScript ファイル リストをナビゲートするには、以下のリストのコントロール名をクリックします。

-   [igBulletGraph](#igBulletGraph)
-   [igCategoryChart](#igCategoryChart)
-   [igCombo](#igCombo)
-   [igDataSource](#igDataSource)
-   [igDataChart](#igDataChart)
-   [igDialog](#igDialog)
-   [igDoughnutChart](#igDoughnutChart)
-   [igEditors](#igEditors)
-   [igFinancialChart](#igFinancialChart)
-   [igGrid](#igGrid)
-   [igHierarchicalGrid](#igHierarchicalGrid)
-   [igHtmlEditor](#igHtmlEditor)
-   [igLayoutManager](#igLayoutManager)
-   [igLinearGauge](#igLinearGauge)
-   [igMap](#igMap)
-   [igOlapFlatDataSource](#igOlapFlatDataSource)
-   [igOlapXmlaDataSource](#igOlapXmlaDataSource)
-   [igPieChart](#igPieChart)
-   [igPivotDataSelector](#igPivotDataSelector)
-   [igPivotGrid](#igPivotGrid)
-   [igPivotView](#igPivotView)
-   [igPopover](#igPopover)
-   [igQRCodeBarcode](#igQRCodeBarcode)
-   [igRadialGauge](#igRadialGauge)
-   [igRating](#igRating)
-   [igReportViewer](#igReportViewer)
-   [igScheduler](#igScheduler)
-   [igShapeChart](#igShapeChart)
-   [igSplitter](#igSplitter)
-   [igSpreadsheet](#igSpreadsheet)
-   [igTemplating](#igTemplating)
-   [igTileManager](#igTileManager)
-   [igTree](#igTree)
-   [igTreeGrid](#igTreeGrid)
-   [igUpload](#igUpload)
-   [igVideoPlayer](#igVideoPlayer)
-   [igZoombar](#igZoombar)
-   [igScroll](#igScroll)

#### <a id="igBulletGraph"></a>igBulletGraph

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js<br>
			    infragistics.dv_interactivity.js<br>
				infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.bulletgraph.js
			    <br>infragistics.ui.bulletgraph.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igCategoryChart"></a>igCategoryChart

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.ui.basechart.js
                <br>infragistics.ui.chart.js 
                <br>infragistics.ui.chartlegend.js
                <br>infragistics.ui.shared.js
                <br>infragistics.ui.widget.js
                <br>infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.datasource.js
				<br>infragistics.templating.js
				<br>infragistics.ext_core.js
				<br>infragistics.ext_collections.js
				<br>infragistics.ext_ui.js
				<br>infragistics.ext_web.js
                <br>infragistics.ext_text.js
                <br>infragistics.ext_io.js
				<br>infragistics.dv_jquerydom.js
				<br>infragistics.dv_core.js
				<br>infragistics.dv_datasource.js
				<br>infragistics.dv_dataseriesadapter.js
				<br>infragistics.dv_geo.js
				<br>infragistics.dv_geometry.js
				<br>infragistics.datachart_core.js
				<br>infragistics.datachart_categorycore.js
				<br>infragistics.datachart_domainChart.js 
				<br>infragistics.dvcommonwidget.js
				<br>infragistics.datachart_category.js
				<br>infragistics.legend.js
				
				<h5>機能:</h5>
				
				infragistics.dv_interactivity.js
				<br>infragistics.datachart_interactivity.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.categorychart.js
				<br>infragistics.ui.categorychart.js			
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igChartLegend"></a>igChartLegend

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ext_core.js
				<br>infragistics.ext_collections.js
				<br>infragistics.ext_ui.js
				<br>infragistics.dv_jquerydom.js
				<br>infragistics.dv_core.js
				<br>infragistics.dv_geometry.js
				<br>infragistics.datachart_core.js
				<br>infragistics.dvcommonwidget.js
				<br>infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.legend.js
				<br>infragistics.ui.chartlegend.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igCombo"></a>igCombo 

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
	    		infragistics.ui.combo.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igDataSource"></a>igDataSource

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
				<br>infragistics.util.jquery.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.datasource.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igDataChart"></a>igDataChart

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.datasource.js
			    <br>infragistics.templating.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ext_core.js
				<br>infragistics.ext_collections.js
				<br>infragistics.ext_ui.js
				<br>infragistics.dv_jquerydom.js
				<br>infragistics.dv_core.js
				<br>infragistics.dv_geometry.js
				<br>infragistics.dv_interactivity.js
				<br>infragistics.datachart_core.js
				<br>infragistics.dvcommonwidget.js
				<br>infragistics.ui.basechart.js
				<br>infragistics.ui.chart.js
				<br>infragistics.ui.chartlegend.js
				<br>infragistics.ui.widget.js
			
				<h5>機能:</h5>
                infragistics.datachart_categorycore.js
                <br>infragistics.datachart_category.js
                <br>infragistics.datachart_rangecategory.js
                <br>infragistics.datachart_verticalcategory.js
                <br>infragistics.datachart_financial.js
                <br>infragistics.datachart_extendedfinancial.js
                <br>infragistics.datachart_extendedaxes.js
                <br>infragistics.datachart_polar.js
                <br>infragistics.datachart_radial.js
                <br>infragistics.datachart_scatter.js
                <br>infragistics.datachart_stacked.js
                <br>infragistics.datachart_shape.js
                <br>infragistics.datachart_annotation.js
                <br>infragistics.datachart_interactivity.js
                <br>infragistics.legend.js
				
				<h5>シェープ ファイルの読み込みの追加の依存関係:</h5>
				infragistics.ext_text.js
				<br>infragistics.ext_io.js
				<br>infragistics.ext_web.js
				<br>infragistics.dv_geo.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igDateTimeAxis"></a>igDateTimeAxis

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js<br>
				infragistics.datachart_core.js<br>
				infragistics.datachart_categorycore.js			
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.datachart_extendedaxes.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igDialog"></a>igDialog

<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
    			infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.dialog.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igDoughnutChart"></a>igDoughnutChart 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.datasource.js<br>
				infragistics.templating.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js<br>
				infragistics.datachart_core.js<br>
				infragistics.dvcommonwidget.js<br>
				infragistics.ui.chart.js<br>
				infragistics.piechart.js<br>
				infragistics.ui.basechart.js<br>
				infragistics.dv_interactivity.js<br>
				infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.ui.doughnutchart.js
				<br>infragistics.ui.doughnutchart.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igEditors"></a>igEditors
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
				<br>infragistics.ui.popover.js
				<br>infragistics.ui.notifier.js
				<br>infragistics.ui.validator.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.editors.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igFinancialChart"></a>igFinancialChart
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
                    infragistics.ui.chartlegend.js<br> 
                    infragistics.ui.basechart.js<br>
                    infragistics.ui.chart.js<br>
                    infragistics.ui.zoomslider.js<br>
                    infragistics.ui.shared.js<br>
                    infragistics.ui.widget.js<br>
                    infragistics.util.js<br>
                    infragistics.util.jquery.js<br>
                    infragistics.ext_core.js<br>
                    infragistics.ext_collections.js<br>
                    infragistics.ext_web.js<br>
                    infragistics.ext_text.js<br>
                    infragistics.ext_io.js<br>
                    infragistics.ext_ui.js<br>
                    infragistics.templating.js<br>
                    infragistics.datasource.js<br>
                    infragistics.datachart_categorycore.js<br>
                    infragistics.datachart_core.js<br>
                    infragistics.datachart_extendedaxes.js<br>
                    infragistics.datachart_category.js<br>
                    infragistics.datachart_financial.js<br>
                    infragistics.datachart_extendedfinancial.js<br>
                    infragistics.datachart_domainChart.js<br>
                    infragistics.financialchart.js<br>
                    infragistics.dvcommonwidget.js<br>
                    infragistics.dv_core.js<br>
                    infragistics.dv_geo.js<br>
                    infragistics.dv_geometry.js<br>
                    infragistics.dv_jquerydom.js<br>
                    infragistics.dv_datasource.js<br>
                    infragistics.dv_dataseriesadapter.js<br>
                    infragistics.ext_ui.js<br>
                    infragistics.legend.js<br>
                    infragistics.zoomslider_core.js<br>
                   
                    <h5>機能:</h5>

                    infragistics.dv_interactivity.js
                    <br>infragistics.datachart_interactivity.js
                    <br>infragistics.datachart_annotation.js
                   
            </td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
                    infragistics.datachart_financial.js<br>
                    infragistics.ui.financialchart.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igFunnelChart"></a>igFunnelChart
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.datasource.js<br>
				infragistics.templating.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js<br>
				infragistics.datachart_core.js<br>
				infragistics.dvcommonwidget.js<br>
				infragistics.ui.basechart.js<br>
				infragistics.dv_interactivity.js<br>
				infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.funnelchart.js<br>
				infragistics.ui.funnelchart.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igGrid"></a>igGrid 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.datasource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.grid.shared.js
			    <br>infragistics.ui.scroll.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.grid.framework.js
			
				<h5>機能:</h5>
			    infragistics.ui.grid.featurechooser.js
			    <br>infragistics.ui.grid.filtering.js
			    <br>infragistics.ui.grid.groupby.js
			    <br>infragistics.ui.grid.hiding.js
			    <br>infragistics.ui.grid.cellmerging.js
			    <br>infragistics.ui.grid.paging.js
			    <br>infragistics.ui.grid.resizing.js
			    <br>infragistics.ui.grid.rowselectors.js
			    <br>infragistics.ui.grid.selection.js
			    <br>infragistics.ui.grid.sorting.js
			    <br>infragistics.ui.grid.summaries.js
			    <br>infragistics.ui.grid.tooltips.js
			    <br>infragistics.ui.grid.updating.js
			    <br>infragistics.ui.grid.multicolumnheaders.js
			    <br>infragistics.ui.grid.columnmoving.js
			    <br>infragistics.ui.grid.columnfixing.js
				<br>infragistics.ui.grid.responsive.js
			    <br>infragistics.ui.grid.appendrowsondemand.js
			</td>
		</tr>
	</tbody>
</table>


#### <a id="igHierarchicalGrid"></a>igHierarchicalGrid 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.datasource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.grid.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.grid.framework.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.grid.hierarchical.js

				<h5>機能:</h5>
				infragistics.ui.grid.featurechooser.js
    			<br>infragistics.ui.grid.filtering.js
				<br>infragistics.ui.grid.groupby.js
			    <br>infragistics.ui.grid.hiding.js
			    <br>infragistics.ui.grid.cellmerging.js
			    <br>infragistics.ui.grid.paging.js
			    <br>infragistics.ui.grid.resizing.js
			    <br>infragistics.ui.grid.rowselectors.js
			    <br>infragistics.ui.grid.selection.js
			    <br>infragistics.ui.grid.sorting.js
			    <br>infragistics.ui.grid.summaries.js
			    <br>infragistics.ui.grid.tooltips.js
			    <br>infragistics.ui.grid.updating.js
			    <br>infragistics.ui.grid.multicolumnheaders.js
			    <br>infragistics.ui.grid.columnmoving.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igHtmlEditor"></a>igHtmlEditor 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.datasource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.ui.toolbarbutton.js
			    <br>infragistics.ui.splitbutton.js
			    <br>infragistics.ui.colopicker.js
			    <br>infragistics.ui.popover.js
			    <br>infragistics.ui.colorpickersplitbutton.js
			    <br>infragistics.ui.combo.js
			    <br>infragistics.ui.editors.js
			    <br>infragistics.ui.toolbar.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    <br>infragistics.ui.htmleditor.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igLayoutManager"></a>igLayoutManager 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
				<br>infragistics.util.jquery.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.layoutmanager.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igLinearGauge"></a>igLinearGauge 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js<br>
				<br>infragistics.util.jquery.js
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.lineargauge.js<br>
				infragistics.ui.lineargauge.js
			</td>
		</tr>
	</tbody>
</table>


#### <a id="igMap"></a>igMap 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.ui.chart.js<br>
                infragistics.ui.chartlegend.js<br>
                infragistics.ui.basechart.js<br>
			    infragistics.util.js<br>
				infragistics.ui.shared.js<br>
                infragistics.ui.widget.js<br>
                infragistics.ui.map.template.js<br>
				infragistics.util.jquery.js<br>
				infragistics.datasource.js<br>
				infragistics.templating.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.ext_text.js<br>
                infragistics.ext_io.js<br>
                infragistics.ext_threading.js<br>
                infragistics.ext_web.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_datasource.js<br>
                infragistics.dv_dataseriesadapter.js<br>
                infragistics.dv_interactivity.js<br>
				infragistics.dv_geometry.js<br>
				infragistics.dv_geo.js<br>
				infragistics.datachart_core.js<br>
				infragistics.datachart_categorycore.js<br>
                infragistics.datachart_category.js <br>
                infragistics.datachart_extendedaxes.js<br>
				infragistics.datachart_scatter.js<br>
				infragistics.datachart_shape.js<br>
                infragistics.dvcommonwidget.js<br>
                infragistics.legend.js
				
				<h5>機能:</h5>
				infragistics.dv_interactivity.js<br>
				infragistics.datachart_interactivity.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.geographicmap_core.js<br>
				infragistics.ui.map.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igOverviewPlusDetailPane"></a>igOverviewPlusDetailPane 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.dv_opd.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igOlapFlatDataSource"></a>igOlapFlatDataSource 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>infragistics.util.js
			<br>infragistics.util.jquery.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.olapflatdatasource.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igOlapXmlaDataSource"></a>igOlapXmlaDataSource 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>infragistics.util.js
			<br>infragistics.util.jquery.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.olapxmladatasource.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igPieChart"></a>igPieChart 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.datasource.js<br>
				infragistics.templating.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js<br>
				infragistics.datachart_core.js<br>
				infragistics.dvcommonwidget.js<br>
				infragistics.dv_interactivity.js<br>
				infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.piechart.js<br>
				infragistics.ui.chart.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igPivotDataSelector"></a>igPivotDataSelector 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.datasource.js
			    <br>infragistics.olapflatdatasource.js
			
				<br>*または*
			
			    <br>infragistics.olapxmladatasource.js
				<br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.combo.js
			    <br>infragistics.ui.tree.js
			    <br>infragistics.ui.pivot.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.pivotdataselector.js</td>
		</tr>
	</tbody>
</table>


#### <a id="igPivotGrid"></a>igPivotGrid 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.datasource.js
			    <br>infragistics.olapflatdatasource.js
			
				<br>*または*
			
			    <br>infragistics.olapxmladatasource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.grid.framework.js
			    <br>infragistics.ui.grid.multicolumnheaders.js
			    <br>infragistics.ui.pivot.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.pivotgrid.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igPivotView"></a>igPivotView 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
			    <br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.datasource.js
			    <br>infragistics.olapflatdatasource.js
			
				<br>*または*
			
			    <br>infragistics.olapxmladatasource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.combo.js
			    <br>infragistics.ui.tree.js
			    <br>infragistics.ui.grid.framework.js
			    <br>infragistics.ui.grid.multicolumnheaders.js
			    <br>infragistics.ui.pivot.shared.js
			    <br>infragistics.ui.pivotdataselector.js
			    <br>infragistics.ui.pivotgrid.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.pivotview.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igPopover"></a>igPopover
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>infragistics.util.js
			<br>infragistics.util.jquery.js
			<br>infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.popover.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igQRCodeBarcode"></a>igQRCodeBarcode
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.ui.widget.js
			    <br>infragistics.ext_core.js
			    <br>infragistics.ext_text.js
			    <br>infragistics.ext_collections.js
			    <br>infragistics.ext_ui.js
			    <br>infragistics.dv_core.js
			    <br>infragistics.ext_collectionsextended.js
			    <br>infragistics.barcode_core.js
			    <br>infragistics.dv_jquerydom.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.barcode_qrcodebarcode.js
    			<br>infragistics.encoding.core.js
    			<br>infragistics.ui.qrcodebarcode.js</td>
		</tr>
	</tbody>
</table>



#### <a id="igRadialGauge"></a>igRadialGauge 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
    			infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js<br>
				infragistics.dv_interactivity.js<br>
				infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.radialgauge.js<br>
				infragistics.ui.radialgauge.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igRating"></a>igRating 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>infragistics.util.js
			<br>infragistics.util.jquery.js
			<br>infragistics.ui.widget.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.rating.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igReportViewer"></a>igReportViewer
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.dv.core.js
			    <br>infragistics.dvcommonwidget.js
			    <br>infragistics.ui.chart.js
			    <br>infragistics.chart_categorychart.js
			    <br>infragistics.chart_financialchart.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.ui.reportviewer.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igScheduler"></a>igScheduler
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
				<br>infragistics.templating.js
				<br>infragistics.ui.scroll.js
				<br>infragistics.ext_core.js
				<br>infragistics.ext_text.js
				<br>infragistics.ext_collections.js
				<br>infragistics.ext_io.js
				<br>infragistics.ext_ui.js
				<br>infragistics.ext_collectionsExtended.js
				<br>infragistics.ext_threading.js
				<br>infragistics.ext_web.js
				<br>infragistics.xml.js
				<br>infragistics.dv_core.js
				<br>infragistics.dv_jquerydom.js
				<br>infragistics.dv_interactivity.js
				<br>infragistics.datasource.js
				<br>infragistics.ui.popover.js
				<br>infragistics.ui.validator.js
				<br>infragistics.ui.editors.js
				<br>infragistics.ui.notifier.js
				<br>infragistics.ui.shared.js
				<br>infragistics.ui.combo.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.scheduler.core.js
				<br>infragistics.ui.scheduler.core.js
				<br>infragistics.ui.scheduler.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igScroll"></a>igScroll 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
				<br>modernizr.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.scroll.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igSparkline"></a>igSparkline 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js<br>
				infragistics.util.jquery.js<br>
				infragistics.datasource.js<br>
				infragistics.templating.js<br>
				infragistics.ext_core.js<br>
				infragistics.ext_collections.js<br>
				infragistics.ext_ui.js<br>
				infragistics.dv_jquerydom.js<br>
				infragistics.dv_core.js<br>
				infragistics.dv_geometry.js<br>
				infragistics.dv.simple.core.js<br>
				infragistics.ui.basechart.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.chart_sparkline.js<br>
				infragistics.ui.sparkline.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igSplitter"></a>igSplitter 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>infragistics.util.js
			<br>infragistics.util.jquery.js
			<br>infragistics.ui.widget.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.splitter.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igSpreadsheet"></a>igSpreadsheet
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
			<br>infragistics.util.jquery.js
			<br>infragistics.ext_core.js
			<br>infragistics.ext_text.js
			<br>infragistics.ext_collections.js
			<br>infragistics.ext_io.js
			<br>infragistics.ext_ui.js
			<br>infragistics.ext_collectionsExtended.js
			<br>infragistics.ext_threading.js
			<br>infragistics.ext_web.js
			<br>infragistics.xml.js
			<br>infragistics.documents.core_core.js
			<br>infragistics.documents.core_openxml.js
			<br>infragistics.excel_core.js
			<br>infragistics.excel_functions.js
			<br>infragistics.excel_serialization_biff8.js
			<br>infragistics.excel_serialization_openxml.js
			<br>infragistics.undo.js
			<br>infragistics.dv_core.js
			<br>infragistics.dv_jquerydom.js
			<br>infragistics.dv_interactivity.js
			<br>infragistics.util.jquery.js
			<br>infragistics.datasource.js
			<br>infragistics.templating.js
			<br>infragistics.ui.scroll.js
			<br>infragistics.ui.validator.js
			<br>infragistics.ui.combo.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.spreadsheet.js
				<br>infragistics.ui.spreadsheet.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igShapeChart"></a>igShapeChart
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
                infragistics.util.js<br>
                infragistics.util.jquery.js<br>
                infragistics.ui.shared.js<br>
                infragistics.ui.widget.js<br>
                infragistics.ui.basechart.js<br>
                infragistics.ui.chart.js<br>
                infragistics.ui.chartlegend.js<br> 
                infragistics.ext_core.js<br>
                infragistics.ext_collections.js<br>
                infragistics.ext_ui.js<br>
                infragistics.ext_web.js<br>
                infragistics.ext_text.js<br>
                infragistics.ext_io.js<br>
                infragistics.dvcommonwidget.js<br>
                infragistics.dv_core.js<br>
                infragistics.dv_geo.js<br>
                infragistics.dv_geometry.js<br>
                infragistics.dv_jquerydom.js<br>
                infragistics.dv_datasource.js<br>
                infragistics.dv_dataseriesadapter.js<br>
                infragistics.templating.js<br>
                infragistics.datasource.js<br>
                infragistics.datachart_core.js<br>
                infragistics.datachart_extendedaxes.js<br>
                infragistics.datachart_scatter.js<br>
                infragistics.datachart_shape.js<br>
                infragistics.datachart_domainChart.js<br> 
                infragistics.legend.js<br>

                <h5>機能:</h5>

                infragistics.dv_interactivity.js
                <br>infragistics.datachart_interactivity.js
                <br>infragistics.datachart_visualdata.js
                <br>infragistics.datachart_annotation.js
               
            </td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
                infragistics.ui.shapechart.js<br>
                infragistics.shapechart.js<br>
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igTemplating"></a>igTemplating 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>infragistics.util.js
			<br>infragistics.util.jquery.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    		infragistics.templating.js</td>
		</tr>
	</tbody>
</table>

#### <a id="igTileManager"></a>igTileManager 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.datasource.js
			    <br>infragistics.templating.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.ui.splitter-en.js
			    <br>infragistics.ui.splitter.js
			    <br>infragistics.ui.layoutmanager.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.tilemanager.js
			</td>
		</tr>
	</tbody>
</table>

#### <a id="igTree"></a>igTree 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.tree.js</td>
		</tr>
	</tbody>
</table>


#### <a id="igTreeGrid"></a>igTreeGrid 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.widget.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.grid.shared.js
			    <br>infragistics.ui.scroll.js
				<br>infragistics.ui.grid.framework.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.treegrid.js
			
				<h5>機能:</h5>
			    infragistics.ui.grid.featurechooser.js
			    <br>infragistics.ui.grid.filtering.js
				<br>infragistics.ui.treegrid.filtering.js
			    <br>infragistics.ui.grid.hiding.js
				<br>infragistics.ui.treegrid.hiding.js
			    <br>infragistics.ui.grid.paging.js
				<br>infragistics.ui.treegrid.paging.js
			    <br>infragistics.ui.grid.selection.js
				<br>infragistics.ui.treegrid.selection.js
			    <br>infragistics.ui.grid.sorting.js
				<br>infragistics.ui.treegrid.sorting.js
			    <br>infragistics.ui.grid.tooltips.js
				<br>infragistics.ui.treegrid.tooltips.js
			    <br>infragistics.ui.grid.updating.js
				<br>infragistics.ui.treegrid.updating.js
			    <br>infragistics.ui.grid.multicolumnheaders.js
				<br>infragistics.ui.treegrid.multicolumnheaders.js
			    <br>infragistics.ui.grid.columnfixing.js
				<br>infragistics.ui.treegrid.columnfixing.js
			</td>
		</tr>
	</tbody>
</table>


#### <a id="igUpload"></a>igUpload 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.upload.js</td>
		</tr>
	</tbody>
</table>


#### <a id="igValidator"></a>igValidator 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>infragistics.util.js
			<br>infragistics.util.jquery.js
			<br>infragistics.ui.widget.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.validator.js</td>
		</tr>
	</tbody>
</table>


#### <a id="igVideoPlayer"></a>igVideoPlayer 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
			    infragistics.util.js
				<br>infragistics.util.jquery.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.videoplayer.js
			</td>
		</tr>
	</tbody>
</table>


#### <a id="igZoombar"></a>igZoombar 
<table class="table">
	<thead>
		<tr>
			<th>スクリプトの種類</th>
			<th>スクリプト ファイル名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>依存スクリプト</td>
			<td>
				infragistics.util.js
				<br>infragistics.util.jquery.js
				<br>infragistics.ui.shared.js
				<br>infragistics.ui.widget.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.zoombar.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** 英語のローカライズ ファイルは圧縮された JS ファイルに統合され、明示的に参照する必要はありません。
その他の言語の場合は、該当するローカライズ スクリプトを実際のページ コードの JavaScript ファイルの前に参照する必要があります。


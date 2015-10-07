<!--
|metadata|
{
    "fileName": "deployment-guide-javascript-files",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# Ignite UI での JavaScript ファイル

##トピックの概要

### 目的

このトピックは、Ignite UI™ に含まれるコントロールを使用して作業するために必要な JavaScript ファイルに関連する参照情報を提供します。

### 必要な背景

以下のリストは、この題材を理解するために必要な、前提条件となるトピックを示しています。

- [Ignite UI で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、Web アプリケーションで Ignite UI JavaScript を操作して、必要なリソースを管理する方法について説明します。

- [Ignite UI のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html): このトピックでは、デザイン段階でのアプリケーションのセットアップ手順について説明し、実稼働環境で CSS を使用するためのオプションを紹介すると同時に、テーマの作成またはカスタマイズについての概要を示します。

- [Ignite UI 向けのインフラジスティックス コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html): Ignite UI 対応 Infragistics Content Delivery Network (CDN) の使用方法。


### JavaScript ファイル種類の参照


以下は、Ignite UI に含まれる JavaScript のファイル種類の概要を示しています。

結合スクリプトを含む JavaScript ファイルの名前は以下のリストです:

-   `infragistics.core.js`
-   `infragistics.lob.js`
-   `infragistics.dv.js`

ファイルは js フォルダー (Ignite UI プログラム インストール パス内の JavaScript ファイルのルート フォルダー) にあります。

ブルガリア語、ロシア語、英語、ドイツ語、スペイン語、およびフランス語の、結合スクリプト バージョンのローカライズ リソースもあります。ファイル名は `infragistics-bg.js`, `infragistics-en.js`、`infragistics-ru.js`、 `infragistics-de.js`、`infragistics-es.js`、および `infragistics-fr.js`であり、これらは `../js/i18n` フォルダーにあります。

**JavaScript 縮小ファイル**

デバッグ バージョンの例外を除き、すべての JavaScript ファイルは縮小されています。

**JavaScript 非縮小ファイル** (デバッグ バージョン)

デバッグには、縮小されていないファイルを使用します。これらのファイルは縮小されたファイルと同じファイル構造を持ち、ファイル名も同じです。縮小されていないファイルは、`.zip` アーカイブで提供されます (`infragistics.jquery.debug.zip`)。

**インターナショナリゼーション**

以下の 2 種類のインターナショナリゼーションがあります。1 つ目は、コントロール内のローカライズ リソースです。2 つ目は、コントロール内の地域設定です。

コントロールのローカライズ リソースは、ブルガリア語、ロシア語、英語、ドイツ語、スペイン語、およびフランス語です。これらは、js/modules/i18n (*js* は、Ignite UI プログラムのインストール パス内の JavaScript ファイルのルート フォルダー) にあります。

地域設定 - igRegional JavaScript ファイルは、jQuery エディター用の日付、数字、通貨記号などのローカライズ フォーマットを提供します。これらは、`../js/modules/i18n/regional` (`js` は、Ignite UI プログラムのインストール パス内の JavaScript ファイルのルート フォルダー) にあります。

>**注:** 結合スクリプト ファイルを使用するときは、地域設定を常に参照する必要があります。これらは結合スクリプト ファイルの一部ではありません。

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

##コントロールによる JavaScript ファイルの参照

### Ignite UI コントロール リスト

特定のコントロールの必要な JavaScript ファイル リストをナビゲートするには、以下のリストのコントロール名をクリックします。

-   [igBulletGraph](#igBulletGraph)
-   [igCombo](#igCombo)
-   [igDataSource](#igDataSource)
-   [igDataChart](#igDataChart)
-   [igDialog](#igDialog)
-   [igDoughnutChart](#igDoughnutChart)
-   [igEditors](#igEditors)
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
-   [igSplitter](#igSplitter)
-   [igTemplating](#igTemplating)
-   [igTileManager](#igTileManager)
-   [igTree](#igTree)
-   [igTreeGrid](#igTreeGrid)
-   [igUpload](#igUpload)
-   [igVideoPlayer](#igVideoPlayer)
-   [igZoombar](#igZoombar)

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
				infragistics.util.js
				<br>infragistics.dv.simple.core.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.gauge_bulletgraph.js
			    <br>infragistics.ui.bulletgraph.js
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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.ui.combo-en.js
	    		<br>infragistics.ui.combo.js
			</td>
		</tr>
	</tbody>
</table>
  
>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.dv.core.js
			    <br>infragistics.dvcommonwidget-en.js
			    <br>infragistics.dvcommonwidget.js
			    <br>infragistics.ui.chart.js
			
				<h5>機能:</h5>
			    infragistics.chart_categorychart.js
			    <br>infragistics.chart_financialchart.js
			    <br>infragistics.chart_polarchart.js
			    <br>infragistics.chart_radialchart.js
			    <br>infragistics.chart_rangecategorychart.js
			    <br>infragistics.chart_scatterchart.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.dialog-en.js
			    <br>infragistics.ui.dialog.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

####<a id="igDoughnutChart"></a>igDoughnutChart 
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
			    <br>infragistics.datasource.js
			    <br>infragistics.dv.core.js
			    <br>infragistics.dvcommonwidget-en.js
			    <br>infragistics.dvcommonwidget.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.chartlegend.js
			    <br>infragistics.ui.basechart.js
			    <br>infragistics.chart_piechart.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.ui.doughnutchart-en.js
				<br>infragistics.ui.doughnutchart.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.ui.regional-en.js
			    <br>infragistics.ui.editors-en.js
    			<br>infragistics.ui.editors.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.grid.shared.js
			    <br>infragistics.ui.scroll.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.grid-en.js
			    <br>infragistics.ui.grid.framework.js
			
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


>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.grid.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.grid-en.js
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

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			    <br>infragistics.ui.toolbarbutton.js
			    <br>infragistics.ui.splitbutton.js
			    <br>infragistics.ui.colopicker.js
			    <br>infragistics.ui.popover.js
			    <br>infragistics.ui.colorpickersplitbutton.js
			    <br>infragistics.ui.combo-en.js
			    <br>infragistics.ui.combo.js
			    <br>infragistics.ui.editors-en.js
			    <br>infragistics.ui.editors.js
			    <br>infragistics.ui.toolbar-en.js
			    <br>infragistics.ui.toolbar.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.htmleditor-en.js
			    <br>infragistics.ui.htmleditor.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.layoutmanager.js</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
				infragistics.util.js
				<br>infragistics.dv.simple.core.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.gauge_lineargauge.js
				<br>infragistics.ui.lineargauge.js</td>
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
			    infragistics.util.js
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.dv.core.js
				<br>infragistics.geographicmap_core.js
			    <br>infragistics.dvcommonwidget-en.js
			    <br>infragistics.dvcommonwidget.js
			    <br>infragistics.ui.map.js</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			<td>infragistics.util.js</td>
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
			<td>infragistics.util.js</td>
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
			    infragistics.util.js
			    <br>infragistics.datasource-en.js
				<br>infragistics.dataSource.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
    			infragistics.dv.core.js
    			<br>infragistics.dvcommonwidget-en.js
    			<br>infragistics.dvcommonwidget.js
				<br>infragistics.ui.chart.js
    			<br>infragistics.chart_piechart.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.olapflatdatasource.js
			
				<br>*または*
			
			    <br>infragistics.olapxmladatasource.js
				<br>infragistics.templating-en.js
				<br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.combo-en.js
			    <br>infragistics.ui.combo.js
			    <br>infragistics.ui.tree-en.js
			    <br>infragistics.ui.tree.js
			    <br>infragistics.ui.pivot.shared-en.js
			    <br>infragistics.ui.pivot.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.pivotdataselector.js</td>
		</tr>
	</tbody>
</table>


>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.olapflatdatasource.js
			
				<br>*または*
			
			    <br>infragistics.olapxmladatasource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.grid-en.js
			    <br>infragistics.ui.grid.framework.js
			    <br>infragistics.ui.grid.multicolumnheaders.js
			    <br>infragistics.ui.pivot.shared-en.js
			    <br>infragistics.ui.pivot.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.pivotgrid.js</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.olapflatdatasource.js
			
				<br>*または*
			
			    <br>infragistics.olapxmladatasource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			    <br>infragistics.ui.scroll.js
			    <br>infragistics.ui.combo-en.js
			    <br>infragistics.ui.combo.js
			    <br>infragistics.ui.tree-en.js
			    <br>infragistics.ui.tree.js
			    <br>infragistics.ui.grid-en.js
			    <br>infragistics.ui.grid.framework.js
			    <br>infragistics.ui.grid.multicolumnheaders.js
			    <br>infragistics.ui.pivot.shared-en.js
			    <br>infragistics.ui.pivot.shared.js
			    <br>infragistics.ui.pivotdataselector-en.js
			    <br>infragistics.ui.pivotdataselector.js
			    <br>infragistics.ui.pivotgrid-en.js
			    <br>infragistics.ui.pivotgrid.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.pivotview.js</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			<td>infragistics.util.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.popover-en.js <br />
			    infragistics.ui.popover.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.dv.simple.core.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.barcode_qrcodebarcode.js
    			<br>infragistics.encoding.js (オプション)
    			<br>infragistics.ui.barcode-en.js
    			<br>infragistics.ui.barcode.js</td>
		</tr>
	</tbody>
</table>



>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
    			infragistics.util.js
	    		<br>infragistics.dv.simple.core.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.gauge_radialgauge.js</td>
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
			<td>infragistics.util.js</td>
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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.dv.core.js
			    <br>infragistics.dvcommonwidget-en.js
			    <br>infragistics.dvcommonwidget.js
			    <br>infragistics.ui.chart.js
			    <br>infragistics.chart_categorychart.js
			    <br>infragistics.chart_financialchart.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.reportviewer-en.js
				<br>infragistics.ui.reportviewer.js</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			<td>infragistics.util.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.splitter-en.js
    			<br>infragistics.ui.splitter.js</td>
		</tr>
	</tbody>
</table>


>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			<td>infragistics.util.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.templating-en.js
    		<br>infragistics.templating.js</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.splitter-en.js
			    <br>infragistics.ui.splitter.js
			    <br>infragistics.ui.layoutmanager.js
			    <br>infragistics.util.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.tilemanager-en.js
    			<br>infragistics.ui.tilemanager.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.tree-en.js
    			<br>infragistics.ui.tree.js</td>
		</tr>
	</tbody>
</table>


>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.datasource-en.js
			    <br>infragistics.dataSource.js
			    <br>infragistics.templating-en.js
			    <br>infragistics.templating.js
			    <br>infragistics.ui.shared.js
				<br>infragistics.ui.grid.shared.js
			    <br>infragistics.ui.scroll.js
				<br>infragistics.ui.grid-en.js
				<br>infragistics.ui.grid.framework.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.ui.treegrid-en.js
			    <br>infragistics.ui.treegrid.js
			
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


>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.ui.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.upload-en.js
    			<br>infragistics.ui.upload.js</td>
		</tr>
	</tbody>
</table>


>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			<td>infragistics.util.js</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>infragistics.ui.validator-en.js
    			<br>infragistics.ui.validator.js</td>
		</tr>
	</tbody>
</table>


>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
			    <br>infragistics.ui.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
				infragistics.ui.videoplayer-en.js
    			<br>infragistics.ui.videoplayer.js
			</td>
		</tr>
	</tbody>
</table>



>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

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
				<br>infragistics.ui.shared.js
			</td>
		</tr>
		<tr>
			<td>スクリプト</td>
			<td>
			    infragistics.ui.zoombar-en.js
			    <br>infragistics.ui.zoombar.js
			</td>
		</tr>
	</tbody>
</table>

>**注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。


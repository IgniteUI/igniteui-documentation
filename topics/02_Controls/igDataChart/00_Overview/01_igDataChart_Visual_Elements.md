<!--
|metadata|
{
    "fileName": "igdatachart-visual-elements",
    "controlName": "igDataChart",
    "tags": ["Charting","Getting Started"]
}
|metadata|
-->

# 構成可能な視覚要素 (igDataChart)



##トピックの概要

### 目的

このトピックでは、構成可能な `igDataChart`™ コントロールの視覚要素とそれらを管理するプロパティをすべてリストします。

### 必要な背景

このトピックを理解するためには、以下のトピックを理解しておく必要があります。


-	[igDataChart の概要](igDataChart-Overview.html)

このトピックでは、`igDataChart` コントロールについての概念情報を提供します。これには、その主な機能、チャートとユーザー機能を使用するための最低要件が含まれます。


`igDataChart` コントロールの構成可能な視覚要素と関連プロパティ


### 構成可能な視覚要素の概要

次の図は、`igDataChart` コントロールの構成可能な視覚要素を説明したものです。それらを管理するプロパティのリストは、以下の [構成可能な視覚要素と関連プロパティ](#_Configurable_visual_elements_properties) ブロックにあります。

![](images/igDataChart_Visual_Elements_1.png)

**構成可能な視覚要素:**

​1) データ シリーズ

​2) 凡例

​3) 軸ラベル

​4) 軸線

​5) 軸の主線

​6) 軸の副線

​7) 軸のストライプ

​8) 概要と詳細パネル

​9) 十字線と十字線ポイント

​10) ツールチップ

### 構成可能な視覚要素および関連プロパティ

次の表では、`igDataChart` コントロールの視覚要素とそれらを構成するプロパティをマップします。

<table class="table table-striped">
	<tbody>
		<tr>
			<th>
				視覚要素
			</th>

			<th>
				プロパティ
			</th>
		</tr>

		<tr>
			<td>
				データ シリーズ
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:series" target="_blank">series[]</a>
			</td>
		</tr>

		<tr>
			<td>
				凡例
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:series.legend" target="_blank">series["key"].legend</a>
			</td>
		</tr>

		<tr>
			<td>
				軸ラベル
			</td>

			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelVisibility" target="_blank">axes["key"].labelVisibility</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelLocation" target="_blank">axes["key"].labelLocation</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelExtent" target="_blank">axes["key"].labelExtent</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options.labelHorizontalAlignment" target="_blank">axes["key"].labelHorizontalAlignment</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelVerticalAlignment" target="_blank">axes["key"].labelVerticalAlignment</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelTopMargin" target="_blank">axes["key"].labelTopMargin</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelRightMargin" target="_blank">axes["key"].labelRightMargin</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelBottomMargin" target="_blank">axes["key"].labelBottomMargin</a></p>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.labelLeftMargin" target="_blank">axes["key"].labelLeftMargin</a>
			</td>
		</tr>

		<tr>
			<td>
				軸線
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.stroke" target="_blank">axes["key"].stroke</a>
			</td>
		</tr>

		<tr>
			<td>
				軸の主線
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.majorStroke" target="_blank">axes["key"].majorStroke</a>
			</td>
		</tr>

		<tr>
			<td>
				軸の副線
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.minorStroke" target="_blank">axes["key"].minorStroke</a>
			</td>
		</tr>

		<tr>
			<td>
				軸のストライプ
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.strip" target="_blank">axes["key"].strip</a>
			</td>
		</tr>

		<tr>
			<td>軸目盛り</td>

			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.tickLength" target="_blank">axes["key"].tickLength</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.tickStroke" target="_blank">axes["key"].tickStroke</a></p>

				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.tickStrokeThickness" target="_blank">axes["key"].tickStrokeThickness</a></p>

				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:axes.tickStrokeDashArray" target="_blank">axes["key"].tickStrokeDashArray</a>
			</td>
		</tr>

		<tr>
			<td>
				概要と詳細ウィンドウ
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:overviewPlusDetailPaneVisibility" target="_blank">overviewPlusDetailPaneVisibility</a>
			</td>
		</tr>

		<tr>
			<td>
				十字線
			</td>

			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:crosshairVisibility" target="_blank">crosshairVisibility</a></p>

				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:crosshairPoint" target="_blank">crosshairPoint</a>
			</td>
		</tr>

		<tr>
			<td>
				ツールチップ
			</td>

			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDataChart#options:series.showTooltip" target="_blank">series["key"].showTooltip</a></p>

				<a href="%%jQueryApiUrl%%/ui.igDataChart#options:series.tooltipTemplate" target="_blank">series["key"].tooltipTemplate</a>
			</td>
		</tr>
	</tbody>
</table>





##関連コンテンツ


### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[igDataChart の追加](igDataChart-Adding.html): このトピックは、`igDataChart`™ コントロールの追加とそれへデータをバインドする方法を説明します。

-	[](igDataChart-API-Links.html)[jQuery および ASP.NET MVC ヘルパー  API リファレンス リンク (igDataChart)](igDataChart-API-Links.html): このトピックは、`igDataChart`™ の jQuery および ASP.NET MVC ヘルパー クラスのたえの API マニュアルへのリンクを提供します。



### サンプル

このトピックについては、以下のサンプルも参照してください。

-	[シリーズのツールチップ](%%SamplesUrl%%/data-chart/series-tooltips): このサンプルでは、`igDataChart` のシリーズでデフォルト ツールチップを有効にし、コントロールでカスタム ツールチップ テンプレートを構成する方法を紹介します。





 

 



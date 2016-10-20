<!--
|metadata|
{
    "fileName": "breaking-changes-2016-volume-2",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 2016 Volume 2 の重大な変更

以下の表は、2016 Volume 2 リリースの重大な変更点の概要を示します。問題の詳細な説明は、概要表の後に記載されています。

凡例 |
-------|--------
![](../images/images/positive.png) | 回避策
![](../images/images/negative.png) | 既知の回避策はありません。
![](../images/images/plannedFix.png) | 修正予定です

## [モジュール分割法](#modularization)

機能 | 説明 | 状態
---|---|---
サイズの大きい js ファイルは小さなサイズに分割されます。 |アプリケーションのファイル サイズを小さくするために、サイズの大きいファイルを小さなファイルへモジュール化しました。 | ![](images/positive.png)


## [チャート デフォルト値のデザイン更新](#redesignedchartdefaults)
機能 | 説明 | 状態
---|---|---
igDataChart コントロールのデフォルト値は更新されます。|チャート機能では、多数のビジュアル変更および新しいプロパティ設定によるチャートの全体的なルック アンド フィールが向上しています。| ![](images/positive.png)

## [igChartLegend および igOPDPane は、ローダーを使用する場合明示的に要求される必要があります](#igChartLegendigOPDPane)
機能 | 説明 | 状態
---|---|---
凡例および OPD ペインはがページのチャートで使用されている場合、別々のモジュールとして明示的に読み込む必要があります。|以前は凡例と OPD がモジュール構造のチャートに依存していました。このリリースで構造が更新されたため、明示的に読み込む必要があります。|![](images/negative.png)


## [ローダー使用時にバー シリーズに必要な VerticalCategory モジュール](#barseries)
機能 | 説明 | 状態
---|---|---
VerticalCategory はがページのチャートまたはマップで使用されている場合、別々のモジュールとして明示的に読み込む必要があります。 |以前はバー シリーズと関連軸はチャートに統合されていました。このリリースで構造が更新されたため、明示的に VerticalCategory を読み込む必要があります。 |![](images/negative.png)

## [igPieChart の選択の新しいデフォルト値](#selection)
機能 | 説明 | 状態
---|---|---
円チャートのデフォルト選択が単一選択になりました。|円チャートの選択機能の変更によりデフォルト値が更新されました。|![](images/negative.png)


## <a id="Modularization"></a>モジュール分割法

以下の表は、元のファイルおよび分割された小さなファイルを示します。

前のファイル名  | 分割後
---                 | ---
infragistics.ext.js | infragistics.ext\_core.js <br><br> infragistics.ext\_collections.js <br>      依存関係: infragistics.ext\_core.js <br> <br> infragistics.ext\_collectionsextended.js <br> 依存関係: infragistics.ext\_core.js <br> 依存関係: infragistics.ext\_collections.js <br><br> infragistics.ext\_text.js <br> 依存関係: infragistics.ext\_core.js <br><br> infragistics.ext\_io.js <br> 依存関係: infragistics.ext\_core.js <br> 依存関係: infragistics.ext\_text.js <br><br> infragistics.ext\_threading.js <br> 依存関係: infragistics.ext\_core.js <br><br> infragistics.ext\_ui.js <br> 依存関係: infragistics.ext\_core.js 依存関係: infragistics.ext\_collections.js <br><br> infragistics.ext\_web.js <br>依存関係: infragistics.ext\_core.js <br>依存関係: infragistics.ext\_collections.js <br>依存関係: infragistics.ext\_text.js <br>依存関係: infragistics.ext\_io.js <br>依存関係: infragistics.ext\_threading.js <br><br>結合したファイルの推薦順序: <br> _infragistics.ext\_core.js_ <br>_infragistics.ext\_collections.js_<br>_infragistics.ext\_collectionsextended.js_<br> _infragistics.ext\_text.js_<br>_infragistics.ext\_io.js_<br>_infragistics.ext\_threading.js_ <br>_infragiatics.ext\_ui.js_ <br>_infragistics.ext\_web.js_
infragistics.dv.shared.js|infragistics.dv\_core.js <br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br><br>infragistics.dv\_geo.js <br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_text.js<br>依存関係: infragistics.ext\_io.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br><br>infragistics.dv\_geometry.js<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.dv\_core.js<br><br>infragistics.dv\_opd.js<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.dv\_core.js<br><br>結合したファイルの推薦順序:<br> _infragistics.dv\_core.js_<br>_infragistics.dv\_geometry.js_<br>_infragistics.dv\_geo.js_ <br>_infragistics.dv\_opd.js_
infragistics.datachart.js| infragistics.legend.js  (凡例の表示に必要) <br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br> 依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js <br><br>infragistics.datachart\_core.js<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br><br>infragistics.datachart\_categorycore.js<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br><br> infragistics.datachart\_category.js (カテゴリチャートシリーズの表示に必要。 折れ線、エリアなど )<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js<br><br>infragistics.datachart\_rangecategory.js (範囲カテゴリ シリーズの表示に必要。rangeArea, rangeColumn など)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js<br><br>infragistics.datachart\_verticalcategory.js (棒シリーズの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js<br><br>infragistics.datachart\_financial.js (財務シリーズの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js<br><br>infragistics.datachart\_extendedfinancial.js (財務オーバレイまたは財務指標の表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categoryCore.js<br>依存関係: infragistics.datachart\_financial.js<br><br><br>infragistics.datachart\_extendedaxes.js<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js<br><br>infragistics.datachart\_polar.js (極座標シリーズの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js <br>依存関係: infragistics.datachart\_extendedaxes.js<br><br>infragistics.datachart\_radial.js (ラジアル シリーズの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js<br>依存関係: infragistics.datachart\_extendedaxes.js<br><br>infragistics.datachart\_scatter.js (散布シリーズの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br><br>infragistics.datachart\_stacked.js (積層シリーズの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_categorycore.js<br>依存関係: infragistics.datachart\_category.js<br><br>infragistics.piechart.js (円チャートの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br><br>infragistics.funnelchart.js (ファンネル チャートの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br><br>infragistics.doughnutchart.js (ドーナツ チャートの表示に必要) <br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.piechart.js<br><br>infragistics.datachart\_annotation.js (注釈レイヤーの表示に必要。itemTooltipLayer、categoryToolTipLayer など)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.datachart\_core.js<br><br>infragistics.geographicmap\_core.js (地図マップの表示に必要)<br>依存関係: infragistics.ext\_core.js<br>依存関係: infragistics.ext\_collections.js<br>依存関係: infragistics.ext\_ui.js<br>依存関係: infragistics.ext\_text.js<br>依存関係: infragistics.ext\_io.js<br>依存関係: infragistics.ext\_web.js<br>依存関係: infragistics.dv\_core.js<br>依存関係: infragistics.dv\_geometry.js<br>依存関係: infragistics.dv\_geo.js<br>依存関係: infragistics.datachart\_core.js<br>依存関係: infragistics.datachart\_scatter.js<br><br>結合したファイルの推薦順序: <br>infragistics.legend.js<br>infragistics.datachart\_core.js<br>infragistics.extendedaxes.js<br>infragistics.datachart\_categorycore.js<br>infragistics.datachart\_category.js<br>infragistics.datachart\_verticalcategory.js<br>infragistics.datachart\_rangecategory.js<br>infragistics.datachart\_financial.js<br>infragistics.datachart\_extendedfinancial.js<br>infragistics.datachart\_scatter.js<br>infragistics.datachart\_polar.js<br>infragistics.datachart\_radial.js<br>infragistics.datachart\_stacked.js<br>infragistics.datachart\_annotation.js<br>infragistics.piechart.js<br>infragistics.dougnutchart.js<br>infragistics.funnelchart.js<br>infragistics.geographicmap.js         



## <a id="redesignedchartdefaults"></a>チャート デフォルト値のデザイン更新
チャート デフォルトをこのリリースでデザイン変更しました。

要素 | CSS プロパティ | 以前 | 現在
---|---|---|---
チャート軸 | background | #d6d6d6 |#d0d0d0
チャート軸|border-color|#d6d6d6|#d0d0d0
Sparkline negatives park path|background|#F44336|#C62828
 Sparkline trendline|background|#E68A24 |#7f7f7f
Sparkline first marker |background | #237FA7 |#2E9CA6
 Sparkline last marker| background|#FBC139 |#FF9800
Sparkline low marker |background | #AF39FF|#7446B9
Sparkline high marker |background | #A3B929|#9FB328
 Sparkline negative markers|background |#F44336 |#C62828
Sparkline axis x |border | #989EA3|#666
Sparkline axis y |border |#989EA3 |#666
Sparkline axis x |text-transform | Lowercase	|Uppercase	
Sparkline axis y |text-transform | Lowercase	|Uppercase	
Sparkline axis x |color|#406090 |#777
Sparkline axis y |color |#406090 |#777
Sparkline tooltip |box-shadow |0 0 2px #555555	 |0 0 2px rgba(0,0,0,0.6)	
Sparkline tooltip |box-shadow | 3px 3px 5px rgba(0, 0, 0, 0.25)	|box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);	
Sparkline tooltip |box-shadow |0 0 2px #555555 |0 0 2px rgba(0,0,0,0.6)	
Sparkline tooltip |box-shadow |3px 3px 5px rgba(0, 0, 0, 0.25)| box-shadow: 0 0 2px rgba(0, 0, 0, 0.6)
Sparkline tooltip|	padding	|3px	|	5px 8px	
Sparkline tooltip|	font-size|		|	12px	
Sparkline tooltip|	font-family	|		|"Segoe UI", Arial, sans-serif		
Sparkline tooltip |	background-color |	#ffffff	|	rgba(255,255,255 .95)
Sparkline sparkpath |	background |	#43ABD5	|	#439C47	
Sparkline negativesparkpath	| background |	#B9242E	|	#C62828	
RadialGauge Chart needle|	background-color|	#888888	|	#9a9a9a	
RadialGauge Chart label	| background-color|	#333	|	#666	
RadialGauge Chart range-palette-1 |	background-color |	#71b1c1	|	#439c47	
RadialGauge Chart range-palette-2 |	background-color |	#408090	|	#ff9800	
RadialGauge Chart range-palette-3 |	background-color |	#307080	|	#c62828	
RadialGauge Chart range-palette-4 |	background-color |	#206070	|	#f96232	
RadialGauge Chart range-palette-5 |	background-color |	#105060	 |	#9fb328
RadialGauge Chart range-palette-6 |	background-color |	#014151	|	#7446b9	
RadialGauge Chart |	font-size |	16px |		12px
Bulletgraph label |	background-color |	#333 |		#666		
Bulletgraph range palette 1	| background-color	| #14151	|	#439c47	
Bulletgraph range palette 2	| background-color	| #206070	|	#ff9800	
Bulletgraph range palette 3 | background-color	| #408090	|	#c62828	
Bulletgraph range palette 4	 | background-color	|#71b1c1|		#3f51b5	
Bulletgraph range palette 5	| background-color |	#a2e2f2	 |	#795548
ig charts axis labels |	font-family	 | Verdana, Arial, Helvetica, sans-serif; |"Segoe UI",Arial,sans-serif;															
ig charts tooltip |	box-shadow |	0 0 2px #555555	 |	0 0 2px rgba(0,0,0,0.6)	
ig charts tooltip |	font-family	 | Verdana, Arial, Helvetica, sans-serif; |		"Segoe UI",Arial,sans-serif;					
ig charts tooltip	| background-color	| rgba(255, 255, 255, 0.85)	|	rgba(255, 255, 255, 0.95)							
ig charts tooltip|	border		|	| 1px solid #888	
ig charts title	| color	| #696969	|	#666	
ig charts subtitle |	color |	#696969	|	#666	
ig charts horizontal-axis-title | color	| #696969|		#666
ig charts vertical-axis-title |	color |	#696969	|	#666	
ig charts horizontal-axis-labels |	color |	#9B9B9B	|	#777	
ig charts vertical-axis-labels |	color|	#9B9B9B	 |	#777	
ig charts angular-axis-labels |	color|	#9B9B9B	|	#777
ig charts radial-axis-labels|	color|	#9B9B9B	|	#777	
chartPalette1|	background-color|	#77B5C5	|	#7446B9		
chartPalette1|	border|	#3d7d8d	|	#ffffff	
chartPalette2|	background-color|	#C0C0C0	|	#9FB328
chartPalette2|	border|	#8f8f8f	|	#ffffff	
chartPalette3|	background-color|	#81AE7A	|	#F96232	
chartPalette3|	border|	#608f58	|	#ffffff	
chartPalette4|	background-color|	#FAA958	|	#2E9CA6		
chartPalette4|	border|	#f77e11	|	#ffffff		
chartPalette5|	background-color|	#A77DBF	|	#DC3F76		
chartPalette5|	border|	#7d58a2	|	#ffffff		
chartPalette6|	background-color|	#FF7968	|	#FF9800	
chartPalette6|	border|	#de604e	|	#ffffff	
chartPalette7|	background-color|	#a5c047	|	#3F51B5	
chartPalette7|	border|	#7d9432	|	#ffffff	
chartPalette8|	background-color|	#729dc9	|	#439C47	
chartPalette8|	border|	#507bab	|	#ffffff		
chartPalette9|	background-color|	#f1bd5c	|	#795548	
chartPalette9|	border|	#de9712	|	#ffffff		
chartPalette10|	background-color|	#65ab88	|	#9A9A9A	
chartPalette10|	border|	#447b60	|	#ffffff	
chartPalette11|	background-color|	#7e7bc1	|	#C62828	
chartPalette11|	border|	#545794	|	#ffffff		
ui-chart-legend	|border|1px solid #bcbcbc|	none	
ui-chart-piechart-container	|border|1px solid #bcbcbc|none	
Funnel chart|	font-size|	14px	|	12px
Funnel chart|	color|	#555555	|	#666	
Funnel chart Tooltip|	box-shadow	|3px 3px 5px rgba(0, 0, 0, 0.25)|0 0 2px rgba(0, 0, 0, 0.6)
Funnel chart Tootip|	|#ffffff|rgba(255,255,255 .95)
Funnel chart Tootip|padding	|3px|5px 8px
Doughnut Chart|	color	|	|	#fff
ui chart outerlabels|	color	|	|	#666	
ui chart innerlabels|	color	|	|	#fff	
Doughnut Tooltip|	padding	|3px	|	5px 8px																						

## <a id="igChartLegendigOPDPane"></a>igChartLegend および igOPDPane は、ローダーを使用する場合明示的に要求される必要があります
凡例は以前のモジュール構造ではチャートに依存していました。
新しいモジュール構造では、ページのチャートで使用されている場合、凡例をモジュールとして明示的に読み込む必要があります。

**JavaScript の場合:**

```js
$.ig.loader({ 
   scriptPath: "/ig_ui/js/", 
   cssPath: "/ig_ui/css/", 
   resources: "igChartLegend,igPieChart" 
}); 
```


## <a id="barseries"></a>ローダー使用時にバー シリーズに必要な VerticalCategory モジュール
バー シリーズと関連軸は依然のモジュール構造でチャートに統合されていました。
新しいモジュール構造では、ページのチャートやマップで使用される場合、バーシリーズと関連軸は明示的にモジュールとして読み込む必要があります。

**JavaScript の場合:**

```js
$.ig.loader({ 
   scriptPath: "/ig_ui/js/", 
   cssPath: "/ig_ui/css/", 
   resources: "igDataChart.Category.VerticalCategory" 
}); 
```

## <a id="selection"></a>igPieChart の選択の新しいデフォルト値
円チャート コントロールの新しいデフォルト選択値は SingleSelect に変更しました。

新しい選択機能に干渉せずに既存の円チャート選択ロジックを保つには、SliceSelectionMode オプションを Manual に設定します。
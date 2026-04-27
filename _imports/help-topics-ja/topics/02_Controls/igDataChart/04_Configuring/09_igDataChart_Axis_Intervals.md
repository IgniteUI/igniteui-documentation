<!--
|metadata|
{
    "fileName": "igdatachart-configuring-axis-intervals",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# 軸間隔の構成 (igDataChart)



##トピックの概要


### 目的

このトピックでは、`igDataChart`™ コントロールで主軸および副軸の間隔を構成する方法を説明します。

### 前提条件

このトピックを理解するためには、以下のトピックを理解しておく必要があります:

-	[igDataChart の追加](igDataChart-Adding.html)

このトピックでは、`igDataChart`™ コントロールをページに追加し、データにバインドする方法を紹介します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [主軸および副軸の間隔の構成](#axisintervals)
    -   [概要](#overview)
    -   [プレビュー](#preview)
    -   [プロパティ](#properties)
    -   [NumericXExample](#numericxexample)
    -   [NumericYExample](#numericyexample)
    -   [CategoryXExample](#categoryxexample)
-   [関連コンテンツ](#related-content)

##<a id="axisintervals"></a>軸間隔


###<a id="overview"></a> 概要

`igDataChart` コントロールの主軸および副軸の間隔機能を使用すると、指定された色および太さの間隔を `igDataChart` コントロールの x および y 軸に適用することができます。

###<a id="preview"></a> プレビュー

以下の実例は NumericX および NumericY 軸を使用する構成可能な `igDataChart` コントロールを紹介します。Interval、MinorInterval、MajorStroke、および MinorStroke オプションを設定できます。

<div class="embed-sample">
   [NumericXAxis の間隔](%%SamplesEmbedUrl%%/data-chart/numeric-xaxis-intervals)
   ![](images/jQuery_AxisIntervals_NumericXY_01.png)
</div>

軸の主間隔および副間隔は、軸の Interval プロパティおよび MinorInterval プロパティに、0 より大きい値を設定することで実装されます。副間隔に対応する副グリッド線を表示するには、軸の MinorStroke および MinorStrokeThickness プロパティを設定する必要があります (副グリッド線は色または太さがデフォルトで設定されていません。副グリッド線を表示するには、最初にこれらの値を設定します)。

###<a id="properties"></a> プロパティ

以下の表に、主軸および副軸の間隔の構成で使用できるプロパティを示します。

<table class="table">
	<thead>
		<tr>
			<th>プロパティ名</th>
			<th>プロパティ タイプ</th>
			<th>説明</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Interval</td>
			<td>double</td>
			<td>この値は、軸ラベルおよび主グリッド線 (使用する場合) に必要なスペースを提供します。軸ラベルの間隔も、この値によって設定され、間隔に関連付けられた軸のポイントにラベルが 1 つ表示されることに注意してください。

カテゴリ軸では、この値は、最初の項目から最後のカテゴリ項目の範囲のインデックスとして表されます。通常、この値は、カテゴリ項目の合計数の 10～20% に相当します。その結果、すべての軸ラベルは軸にフィットし、他の軸ラベルによって切り取られることはありません。

数値軸では、この値は軸の最小値から最大値の範囲の double 値として表されます。数値軸はデフォルトで、軸の最小値および最大値から四捨五入されたバランスの良い数値に、自動的に計算されます。

日付/時刻軸では、この値は軸の最小値から最大値の範囲の時間間隔として表されます。</td>
		</tr>
		<tr>
			<td>MajorStroke</td>
			<td>brush</td>
			<td>軸の主グリッド線の色。</td>
		</tr>
		<tr>
			<td>MajorStrokeThickness</td>
			<td>double</td>
			<td>double 値として設定された軸の主グリッド線の太さ (ピクセル)</td>
		</tr>
		<tr>
			<td>MinorInterval</td>
			<td>double</td>
			<td>この値は、主グリッド線と主グリッド線の間に描画される副グリッド線に必要なスペースを提供します。そのために、MinorInterval プロパティの値は、常に MajorInterval プロパティの値より小さい値 (通常、2 分の 1 から 5 分の 1) であることが必要です。

カテゴリ軸では、この値が MajorInterval プロパティの小数として表されます。通常、この値は 0.25 から 0.5 の範囲です。

数値軸では、この値は軸の最小値から最大値の範囲の double 値として表されます。数値軸はデフォルトで、軸の最小値および最高値から副間隔を自動的に計算しません。

日付/時刻軸では、この値は軸の最小値から最大値の範囲の時間間隔として表されます。</td>
		</tr>
		<tr>
			<td>MinorStroke</td>
			<td>brush</td>
			<td>軸の副グリッド線の色。</td>
		</tr>
		<tr>
			<td>MinorStrokeThickness</td>
			<td>double</td>
			<td>double 値として設定された軸の副グリッド線の太さ(ピクセル)。</td>
		</tr>
	</tbody>
</table>

###<a id="numericxexample"></a> NumericXExample

この表の下に示すスクリーンショットは、以下の設定の結果 (LineSeries を使用)、軸の主間隔と副間隔プロパティを NumericXAxis に設定した `igDataChart` コントロールの外観がどのようになるかを示します。

<table class="table">
	<thead>
		<tr>
			<th>プロパティ</th>
			<th>値</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>MinorInterval</td>
			<td>2</td>
		</tr>
		<tr>
			<td>MinorStroke</td>
			<td>“Red”</td>
		</tr>
		<tr>
			<td>MinorStrokeThickness</td>
			<td>1</td>
		</tr>
		<tr>
			<td>Interval</td>
			<td>10</td>
		</tr>
		<tr>
			<td>MajorStroke</td>
			<td>“Green”</td>
		</tr>
		<tr>
			<td>MajorStrokeThickness</td>
			<td>2</td>
		</tr>
		
	</tbody>
</table>

![](images/jQuery_AxisIntervals_NumericX_01.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$("#container").igDataChart({
	…
	axes: [{
                    name: "xAxis",
                    type: "numericX",
                    title: "Year",
                    majorStroke: "Green",
                    minorStroke: 'Red',
                    minorInterval: 2,
                    interval: 10,
                    majorStrokeThickness: 2,

                }, …
```

###<a id="numericYexample"></a> NumericYExample

この表の下に示すスクリーンショットは、以下の設定の結果 (LineSeries を使用)、軸の主間隔と副間隔のプロパティを NumericYAxis に設定した `igDataChart` コントロールの外観がどのようになるかを示します。

<table class="table">
	<thead>
		<tr>
			<th>プロパティ</th>
			<th>値</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>MinorInterval</td>
			<td>5000</td>
		</tr>
		<tr>
			<td>MinorStroke</td>
			<td>“Red”</td>
		</tr>
		<tr>
			<td>MinorStrokeThickness</td>
			<td>1</td>
		</tr>
		<tr>
			<td>Interval</td>
			<td>10000</td>
		</tr>
		<tr>
			<td>MajorStroke</td>
			<td>“Green”</td>
		</tr>
		<tr>
			<td>MajorStrokeThickness</td>
			<td>2</td>
		</tr>
	</tbody>
</table>

![](images/jQuery_AxisIntervals_NumericY_01.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$("#container").igDataChart({
	…
	axes: [{
		    name: "yAxis",
                    type: "numericY",
                    majorStroke: "Green",
                    minorStroke: 'Red',
                    minorInterval: 5000,
                    interval: 10000,
                    }, …
```

###<a id="categoryxexample"></a> CategoryXExample

このサンプルは、軸の主間隔と副間隔のプロパティを CategoryXAxis に設定して、以下の設定の結果 (MinorInterval、MinorStroke、MinorStrokeThickness、Interval、MajorStroke、および MajorStrokeThickness) として表示した `igDataChart` コントロールを紹介します。

<div class="embed-sample">
   [CategoryXAxis の間隔](%%SamplesEmbedUrl%%/data-chart/category-xaxis-intervals)
   ![](images/jquery_axisintervals_categoryx_01.png)
</div>

##<a id="related-content"></a>関連コンテンツ


### トピック

以下のトピックでは、このトピックに関連する追加情報を提供しています。

-	[igDataChart](igDataChart-Adding.html) の追加: このトピックでは、`igDataChart` コントロールをページに追加し、データにバインドする方法を紹介します。


 

 



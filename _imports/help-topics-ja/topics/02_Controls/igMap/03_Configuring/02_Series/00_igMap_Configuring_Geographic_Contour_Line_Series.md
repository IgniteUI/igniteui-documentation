<!--
|metadata|
{
    "fileName": "igmap-configuring-geographic-contour-line-series",
    "controlName": "igMap",
    "tags": ["Charting","Data Presentation","How Do I"]
}
|metadata|
-->

# 地理等高線シリーズの構成 (igMap)

##トピックの概要

### 目的

このトピックでは、`igMap`™ コントロールを使用して、地理等高線シリーズを構成する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igMap の概要](Overview-igMap.html): このトピックは、`igMap` コントロールについて、その主要機能、最小要件、ユーザー インタラクションといった事項の概念的情報を提供します。

- [igMap の追加](Adding-igMap.html): このトピックは、基本的な機能を備えた簡易 `igMap` コントロールを Web ページに追加する方法を示すチュートリアルです。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [地理等高線シリーズ構成の概要](#config-summary)
-   [コード例の概要](#code-example-summary)
    -   [地理等高線シリーズの JavaScript での構成](#config-geographic-js)
    -   [地理等高線シリーズの ASP.NET MVC での構成](#config-geographic-mvc)
    -   [カスタム三角測量データ ソースの構成](#config-custom-datasource)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)
    -   [外部リソース](#external-resources)



##<a id="introduction"></a>概要

### 地理等高線シリーズの概要

`igMap` コントロールの地理等高線シリーズの目的は、不整三角網 (TIN) で指定された領域を三角測量 ITF ファイルまたはその他のカスタム データ ソースと区別することです。TIN は、地表面を数学的に 3D で表現します。

ソース データの三角形は類似値または近似値を持つ範囲ごとにグループ化され、色分けされた線 (等高線) は範囲間、たとえば、異なる値範囲の値を保持する三角形間で描画されます。

データ ソースの使用可能な値の範囲は、サブ範囲に分割され、パレットの各カラーのサブ範囲はマップ シリーズで指定されています。したがって、構成可能なパラメーターであるデータによって、最小値から最大値までの範囲内で色が均等に配分されます。最小値と最大値は、それぞれパレットの最初の色と最後の色を使用して描画されます。

地理等高線シリーズを使用して、地形図、天気情報、または空間的なフィールドを表現するその他のデータ (空間的に分布させた値など)を表すことができます。このマップ シリーズは、等高線ではなくマップ上の塗りつぶし領域を描画する散布シリーズにより構成されています。以下の図では、米国の地域降水量データを表すのに地理等高線シリーズを使用しています。

![](images/Configuring_Geographic_Contour_Line_Series_1.png)

ポリラインのパレット カラーは、CSS スタイルまたはシリーズ オブジェクトのオプションを使用してコントロールできます。詳細については、トピック[マップのスタイル設定 (igMap)](Styling-igMap.html) を参照してください。

注: モバイル デバイスを対象にする場合には、比較的小さい三角測量データ セットを使用することをお勧めします。地理空間データをレンダリングするにはより多くのコンピューティング リソースが必要になり、ほとんどのモバイル デバイスの場合、デスクトップ PC やノート PC と比較してパフォーマンスが低くなります。



##<a id="config-summary"></a>地理等高線シリーズ構成の概要

### 地理等高線シリーズ構成の概要表

以下の表に、地理等高線シリーズで使用できる `igMap` コントロールの構成可能な要素を示します。

<table cellspacing="0" cellpadding="0" class="table table-striped">
	<tbody>
		<tr>
			<th>
				構成可能な項目
			</th>

			<th>
				詳細
			</th>

			<th>
				プロパティ
			</th>
		</tr>

		<tr>
			<td>
				地理等高線シリーズを設定する
			</td>

			<td>
				これらの必須設定では、マップ シリーズのタイプを地理等高線に構成し、シリーズの名前を設定します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.type" target="_blank">series.type</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.name" target="_blank">series.name</a></li>
				</ul>値:

				series.type: “geographicContourLine”,

				series.type: "seriesName"

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1.html" data-auto-update-caption="true">MapSeriesBuilder&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1~GeographicContourLine.html">.GeographicContourLine()</a></li>
						</ul>
					</li>
				</ul>値:

				series.GeographicContourLine(“seriesName”)
			</td>
		</tr>

		<tr>
			<td>
				ITF ファイルへのバインド
			</td>

			<td>
				三角測量ファイルの URL を構成
			</td>

			<td>
				JavaScript の場合:

				<a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangulationDataSource" target="_blank">series.triangulationDataSource</a>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicContourLineSeries`1.html" data-auto-update-caption="true">GeographicContourLineSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~TriangulationDataSource.html">.TriangulationDataSource()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カスタム三角形データ ソースへのバインド
			</td>

			<td>
				地理ポイントと関連する数値のフィールドを示す地理空間データによってオブジェクト配列を構成します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.dataSource" target="_blank">series.dataSource</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.longitudeMemberPath" target="_blank">series.longitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.latitudeMemberPath" target="_blank">series.latitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.valueMemberPath" target="_blank">series.valueMemberPath</a></li>
				</ul>

				オプション:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath1" target="_blank">series.triangleVertexMemberPath1</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath2" target="_blank">series.triangleVertexMemberPath2</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangleVertexMemberPath3" target="_blank">series.triangleVertexMemberPath3</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicContourLineSeries`1.html" data-auto-update-caption="true">GeographicContourLineSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~LongitudeMemberPath.html">.LongitudeMemberPath()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~LatitudeMemberPath.html">.LatitudeMemberPath()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicContourLineSeries`1~ValueMemberPath.html">.ValueMemberPath()</a></li>
						</ul>
					</li>
				</ul>

				オプション:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicContourLineSeries`1.html" data-auto-update-caption="true">GeographicContourLineSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~TriangleVertexMemberPath1.html">.TriangleVertexMemberPath1()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~TriangleVertexMemberPath2.html">.TriangleVertexMemberPath2()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~TriangleVertexMemberPath3.html">.TriangleVertexMemberPath3()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カラーパレット
			</td>

			<td>
				この必須設定は、三角形の値に対してカラー パレットを構成します。

				この設定にデフォルト値はありません。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.fillScale.brushes" target="_blank">series.fillScale.brushes</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.FillScale`1~Brushes.html">FillScale.Brushes()</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カラー パレットの最小値
			</td>

			<td>
				値のサブ範囲を計算する最小値を構成します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.fillScale.minimumValue" target="_blank">series.fillScale.minimumValue</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.ValueBrushScale~MinimumValue.html">FillScale.MinimumValue()</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カラー パレットの最大値
			</td>

			<td>
				値のサブ範囲を計算する最大値を構成します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.fillScale.maximumValue" target="_blank">series.fillScale.maximumValue</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.ValueBrushScale~MaximumValue.html">FillScale.MaximumValue()</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				対数のカラー パレットを設定
			</td>

			<td>
				値をカラーに対数マッピングする場合に使用するマップ シリーズを構成します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.fillScale.isLogarithmic" target="_blank">series.fillScale.isLogarithmic</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.fillScale.logarithmBase" target="_blank">series.fillScale.logarithmBase</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.ValueBrushScale~IsLogarithmic.html">FillScale.IsLogarithmic()</a></li>

					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.ValueBrushScale~LogarithmBase.html">FillScale.LogarithmBase()</a></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>





##<a id="code-example-summary"></a>コード例の概要

### コード例の概要表

以下の表は、このトピックで使用したコード例をまとめたものです。

例|説明
---|---
[地理等高線シリーズの JavaScript での構成](#config-geographic-js)|このコード例は、JavaScript で地理等高線シリーズを表示するために `igMap` コントロールを構成する方法を示します。
[地理等高線シリーズの ASP.NET MVC での構成](#config-geographic-mvc)|このコード例は、`igMap` コントロールを構成して、地理等高線シリーズを ASP.NET MVC で表示する方法を示しています。
[カスタム三角測量データ ソースの構成](#config-custom-datasource)|このコード例は、`igMap` コントロールを構成して、地理等高線シリーズをカスタム三角測量データ ソースで表示する方法を示しています。


##<a id="config-geographic-js"></a>コード例: 地理等高線シリーズの JavaScript での構成

### 説明

このコード例は、JavaScript で地理等高線シリーズを表示するために `igMap` コントロールを構成する方法を示します。例では、三角形ファイルの URL を指定し、最小値と最大値を使用してカラー パレットを定義する方法を示します。ここでは、分かりやすくするためにオプションのデータ バインディング オプションを示します。

### コード

**JavaScript の場合:**

```js
Code
$("#map").igMap({
    ...
    series: [{
        type: "geographicContourLine",
        name: "seriesName",
        fillScale: {
            type: "value",
            brushes: [
                "#3300CC", "#4775FF", "#0099CC", "#00CC99", "#33CC00", 
                "#99CC00", "#CC9900", "#FFC20A", "#CC3300"
            ]
        },
        triangleVertexMemberPath1: "v1",
        triangleVertexMemberPath2: "v2",
        triangleVertexMemberPath3: "v3",
        longitudeMemberPath: "pointX",
        latitudeMemberPath: "pointY",
        valueMemberPath: "value",
        triangulationDataSource: "/Data/triangulation.itf"
    }],
    ...
});
```



##<a id="config-geographic-mvc"></a>コード例: 地理等高線シリーズの ASP.NET MVC での構成

### 説明

このコード例は、`igMap` コントロールを構成して、地理等高線シリーズを ASP.NET MVC で表示する方法を示しています。例では、三角形ファイルの URL を指定し、最小値と最大値を使用してカラー パレットを定義する方法を示します。ここでは、分かりやすくするためにオプションのデータ バインディング オプションを示します。

### コード

**ASPX の場合:**

```csharp
Code
<%= Html.Infragistics().Map()
        .ID("map")
        ...
        .Series(series => {
            series.GeographicContourLine("seriesName")
                .FillScale(scale => scale
                    .Value()
                    .MinimumValue(0.15)
                    .MaximumValue(0.95)
                    .Brushes(new List<string>() { 
                        "#3300CC", "#4775FF", "#0099CC", "#00CC99", "#33CC00", 
                        "#99CC00", "#CC9900", "#FFC20A", "#CC3300" 
                    })
                )
                .TriangleVertexMemberPath1("v1")
                .TriangleVertexMemberPath2("v2")
                .TriangleVertexMemberPath3("v3")
                .LongitudeMemberPath("pointX")
                .LatitudeMemberPath("pointY")
                .ValueMemberPath("value")
                .TriangulationDataSource(Url.Content("~/Data/triangulation.itf"));
        })
        ...
        .DataBind()
        .Render()
%>
```



##<a id="config-custom-datasource"></a>コード例: カスタム三角測量データ ソースの構成

### 説明

このコード例は、`igMap` コントロールを構成して、地理等高線シリーズをカスタム三角測量データ ソースで表示する方法を示しています。例では、コントロールによって処理されるデータ オブジェクトの一般構造とともに、`igMap` コントロールのシリーズ オブジェクトを構成する方法を示します。

### コード

以下のコード スニペットでは、地理ポイントおよび関連する数値に関する情報が含まれている JavaScript 配列を定義しています。この配列には、3 つのデータ メンバーを持つ同一のオブジェクトが含まれています。latitude データ メンバーと longitude データ メンバーは、対応するポイントの地理座標を定義し、value データ メンバーにはそのポイントに関連付けられた数値が含まれています。

**JavaScript の場合:**

```js
var data = [
    { longitude: 0, latitude: 0, value: 1 },
    { longitude: 50, latitude: 0, value: 2 },
    { longitude: 50, latitude: 50, value: 3 },
    { longitude: 0, latitude: 50, value: 1 }
];
```

以下のコード スニペットは、前述のコード スニペットで指定されたカスタム データ ソースによって地理等高線シリーズを構成しています。このコードは、データ 配列の対応するデータ メンバーの名前を使用して、`latitudeMemberPath`、`longitudeMemberPath`、および `valueMemberPath` オプションを明示的に設定しています。

**JavaScript の場合:**

```js
$("#map").igMap({
    ...
    series: [{
        type: "geographicContourLine",
        name: "seriesName",
        dataSource: data,
        latitudeMemberPath: "latitude",
        longitudeMemberPath: "longitude",
        valueMemberPath: "value",
        fillScale: {
            type: "value",
            brushes: [ "darkgreen", "green", "limegreen", "lightgreen" ]
        }
    }],
    ...
});
```

画面を描画する前に、data 配列で定義されたデータ ポイントは、すべての等高線の正しい位置が見つかるよう三角形化されます。三角測量のプロセスの詳細については、リンクに続いて[関連コンテンツ: 外部リソース](igMap-Configuring-Geographic-Contour-Line-Series.html#external-resources)のセクションに記載されています。

##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[マップ シリーズの構成 (igMap)](igMap-Creating-Different-Kinds-Maps.html): このトピックは、`igMap` コントロールでサポートされているすべてのマップ視覚エフェクトを構成し、さまざまな背景コンテンツ (マップ プロバイダー) を使用する方法を説明するトピックのリンクがあるランディング ページです。

-	[機能の構成 (igMap)](igMap-Configuring-Features.html): このトピックは、`igMap` コントロールのさまざまな機能を構成する方法を説明するトピックのリンクがあるランディング ページです。

-	[データ バインディング (igMap)](Data-Binding-igMap.html): このトピックは、視覚化されたマップ シリーズに応じて `igMap` コントロールをさまざまなデータ ソースにバインドする方法を説明します。

-	[マップのスタイル設定 (igMap)](Styling-igMap.html): このトピックは、ビジュアル スタイル設定に関連して `igMap` コントロールを構成する方法を説明しています。



### <a id="samples"></a>サンプル

以下のサンプルでは、このトピックに関連する情報を提供しています。


-	[地理等高線シリーズ](%%SamplesUrl%%/map/geo-contour-line): このサンプルでは、三角形分割ファイル (.ITF) をマップ コントロールにバインドし、地理等高線シリーズを構成する方法を紹介します。



### <a id="external-resources"></a>外部リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

-	[三角測量 (ジオメトリ)](http://en.wikipedia.org/wiki/Triangulation_%28geometry%29): このトピックでは、三角測量のプロセスについて地理的な観点から説明します。

-	[三角測量](http://en.wikipedia.org/wiki/Triangulation): この Wikipedia のトピックでは、三角測量のプロセスに関する説明と、それに関する参考資料が示されています。





 

 



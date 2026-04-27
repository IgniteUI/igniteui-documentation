<!--
|metadata|
{
    "fileName": "igmap-configuring-geographic-scatter-area-series",
    "controlName": "igMap",
    "tags": ["Charting","Data Presentation","How Do I"]
}
|metadata|
-->

# 地理散布エリア シリーズの構成 (igMap)


##トピックの概要

### 目的

このトピックでは、`igMap`™ コントロールを使用して地理散布エリア シリーズを構成する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[igMap の概要](Overview-igMap.html): このトピックは、`igMap` コントロールについて、その主要機能、最小要件、ユーザー インタラクションといった事項の概念的情報を提供します。

-	[igMap の追加](Adding-igMap.html): このトピックは、基本的な機能を備えた簡易 `igMap` コントロールを Web ページに追加する方法を示すチュートリアルです。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [地理散布エリア シリーズ構成の概要](#config-summary)
-   [コード例](#code-example)
    -   [JavaScript における地理散布エリア シリーズの構成](#config-series-js)
    -   [ASP.NET MVC における地理散布エリア シリーズの構成](#config-series-mvc)
    -   [カスタム三角測量データ ソースの構成](#config-custom-datasource)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)
    -   [外部リソース](#external-resources)



##<a id="introduction"></a>概要

### 地理散布エリア シリーズの概要

`igMap` コントロールの地理散布エリア シリーズは、三角測量 ITF ファイルまたはその他のカスタム データ ソースによる不整三角形網 (TIN) によって指定した地域をプロットします。TIN は、地表面を数学的に 3D で表現する方法です。

ソース データの三角形は類似値または近似値を持つ範囲ごとにグループ化され、これらの範囲内のすべての三角形が、マップ シリーズ オブジェクトによって構成されたカラー パレットから選択された色によって塗りつぶされます。

使用可能な値の範囲は、パレット内の各色のサブ範囲に分割されます。したがって、構成可能なパラメーターであるデータによって、最小値から最大値までの範囲内で色が均等に配分されます。ぞれぞれの三角形について、正しいサブ範囲が特定され、対応する色が選択されます。最小値と最大値は、それぞれパレットの最初の色と最後の色を使用して描画されます。

地理散布エリア シリーズは、地形図、天気情報、または空間的なフィールドを表現するその他のデータを表すために役立ちます。たとえば、空間的に分布させた値が含まれます。このマップ シリーズは、範囲全体を色で塗りつぶすのではなく領域間に色付きの等高線を描画する、地理等高線シリーズで構成されています。以下の図では、米国の地域降水量データを表すのに地理散布エリア シリーズを使用しています。

![](images/Configuring_Geographic_Scatter_Area_Series_1.png)

ポリラインのパレット カラーは、CSS スタイルまたはシリーズ オブジェクトのオプションを使用してコントロールできます。詳細については、トピック[マップのスタイル設定 (igMap)](Styling-igMap.html) を参照してください。

>**注:** モバイル デバイスを対象にする場合には、比較的小さい三角測量データ セットを使用することをお勧めします。地理空間データをレンダリングするにはより多くのコンピューティング リソースが必要になり、ほとんどのモバイル デバイスの場合、デスクトップ PC やノート PC と比較してパフォーマンスが低くなります。



##<a id="config-summary"></a>地理散布エリア シリーズ構成の概要

### 地理散布エリア シリーズ構成の概要チャート

以下の表に、`igMap` コントロールの、地理散布エリア シリーズに関して構成可能な要素の一覧を示します。

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
				地理散布エリア シリーズのセットアップ
			</td>

			<td>
				これらの必須設定では、マップ シリーズのタイプを地理散布エリア シリーズに構成し、シリーズの名前を設定します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.type</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.name</a></li>
				</ul><br/>値:<br/>

				**series.type: “geographicScatterArea”**

				**series.type: "seriesName"**
				<br/><br/>
				ASP.NET MVC の場合:
				<br/>
				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1.html" data-auto-update-caption="true">MapSeriesBuilder&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1~GeographicScatterArea.html">.GeographicScatterArea()</a></li>
						</ul>
					</li>
				</ul><br />値:<br />

				<br />**series.GeographicScatterArea(“seriesName”)**
			</td>
		</tr>

		<tr>
			<td>
				ITF ファイルへのバインド
			</td>

			<td>
				この設定は、三角測量ファイルの URL を構成するために使用します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.triangulationDataSource" target="_blank">series.triangulationDataSource</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicScatterAreaSeries`1.html" data-auto-update-caption="true">GeographicScatterAreaSeries&lt;T&gt; クラス</a>

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
				これらの設定は、地理ポイントと関連する数値のフィールドを示す地理空間データによってさまざまなオブジェクトを構成するために使用します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.dataSource" target="_blank">series.dataSource</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.longitudeMemberPath" target="_blank">series.longitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.latitudeMemberPath" target="_blank">series.latitudeMemberPath</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.colorMemberPath" target="_blank">series.colorMemberPath</a></li>
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
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicScatterAreaSeries`1.html" data-auto-update-caption="true">GeographicScatterAreaSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~LongitudeMemberPath.html">.LongitudeMemberPath()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicXYTriangulatingSeries`3~LatitudeMemberPath.html">.LatitudeMemberPath()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicScatterAreaSeries`1~ColorMemberPath.html">.ColorMemberPath()</a></li>
						</ul>
					</li>
				</ul>

				オプション:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicScatterAreaSeries`1.html" data-auto-update-caption="true">GeographicScatterAreaSeries&lt;T&gt; クラス</a>

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
				この必須設定は、三角形の値に対してカラー パレットを構成するために使用します。

				デフォルトのカラー パレットの値はありません。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.colorScale.palette" target="_blank">series.colorScale.palette</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.CustomPalette~Palette.html">CustomPalette.Palette()</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カラー マッピングの値に対する補間モード
			</td>

			<td>
				この設定は、カラーに値をマップするロジックを構成するために使用します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.colorScale.interpolationMode" target="_blank">series.colorScale.interpolationMode</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.CustomPalette~InterpolationMode.html">CustomPalette.InterpolationMode()</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カラー パレットの最小値
			</td>

			<td>
				この設定は、値のサブ範囲を計算する最小値を構成するために使用します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.colorScale.minimumValue" target="_blank">series.colorScale.minimumValue</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.CustomPalette~MinimumValue.html">CustomPalette.MinimumValue()</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カラー パレットの最大値
			</td>

			<td>
				この設定は、値のサブ範囲を計算する最大値を構成するために使用します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options:series.colorScale.maximumValue" target="_blank">series.colorScale.maximumValue</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.CustomPalette~MaximumValue.html">CustomPalette.MaximumValue()</a></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>



##<a id="code-example"></a>コード例

### コード例の概要

以下の表は、このトピックで使用したコード例をまとめたものです。

例|説明
---|---
[JavaScript における地理散布エリア シリーズの構成](#config-series-js)|このコード例は、`igMap` コントロールを構成して、地理散布エリア シリーズを JavaScript で表示する方法を示しています。
[ASP.NET MVC における地理散布エリア シリーズの構成](#config-series-mvc)|このコード例は、`igMap` コントロールを構成して、地理図形シリーズを ASP.NET MVC で表示する方法を示しています。
[カスタム三角測量データ ソースの構成](#config-custom-datasource)|このコード例は、`igMap` コントロールを構成して、地理散布エリア シリーズをカスタム三角測量データ ソースで表示する方法を示しています。 



##<a id="config-series-js"></a>コード例: JavaScript における地理散布エリア シリーズの構成

### 説明

このコード例は、`igMap` コントロールを構成して、地理散布エリア シリーズを JavaScript で表示する方法を示しています。この例は、三角形ファイルの URL を指定したり、補間モードと最小値によってカラー パレットを定義する方法を示しています。

### コード

**JavaScript の場合:**

```js
Code
$("#map").igMap({
    ...
    series: [{
        type: "geographicScatterArea",
        name: "seriesName",
        colorScale: {
            type: "customPalette",
            interpolationMode: "interpolateRGB",
            minimumValue: 0.15,
            palette: ["#3300CC", "#4775FF", "#0099CC", "#00CC99", "#33CC00", 
                "#99CC00", "#CC9900", "#FFC20A", "#CC3300"]
        },
        triangleVertexMemberPath1: "v1",
        triangleVertexMemberPath2: "v2",
        triangleVertexMemberPath3: "v3",
        longitudeMemberPath: "pointX",
        latitudeMemberPath: "pointY",
        colorMemberPath: "value",
        triangulationDataSource: "/Data/triangulation.itf"
    }],
    ...
});
```



##<a id="config-series-mvc"></a>コード例: ASP.NET MVC における地理散布エリア シリーズの構成


### 説明

このコード例は、`igMap` コントロールを構成して、地理散布エリア シリーズを ASP.NET MVC で表示する方法を示しています。この例は、三角形ファイルの URL を指定したり、補間モードと最小値によってカラー パレットを定義する方法を示しています。

### コード

**ASPX の場合:**

```csharp
Code
<%= Html.Infragistics().Map()
        .ID("map")
        ...
        .Series(series => {
            series.GeographicScatterArea("seriesName")
                .ColorScale(cs => 
                    cs.CustomPalette()
                    .InterpolationMode(InterpolationMode.InterpolateRGB)
                    .MinimumValue(0.15)
                    .Palette(new List<string>() { 
                        "#3300CC", "#4775FF", "#0099CC", "#00CC99", "#33CC00", 
                        "#99CC00", "#CC9900", "#FFC20A", "#CC3300" 
                    })
                )
                .TriangleVertexMemberPath1("v1")
                .TriangleVertexMemberPath2("v2")
                .TriangleVertexMemberPath3("v3")
                .LongitudeMemberPath("pointX")
                .LatitudeMemberPath("pointY")
                .ColorMemberPath("value")
                .TriangulationDataSource(Url.Content("~/Data/triangulation.itf"));
        })
        ...
        .DataBind()
        .Render()
%>
```



##<a id="config-custom-datasource"></a>コード例: カスタム三角測量データ ソースの構成

### 説明

このコード例は、`igMap` コントロールを構成して、地理散布エリア シリーズをカスタム三角測量データ ソースで表示する方法を示しています。この例は、コントロールによって処理されるデータ オブジェクトの一般的な構造を示しています。また、igMap コントロールの series オブジェクトを構成する方法も示しています。

### コード

以下のコード スニペットは、地理ポイントおよび関連する数値に関する情報が含まれている JavaScript 配列を定義しています。この配列には、3 つのデータ メンバーを持つ同一のオブジェクトが含まれています。各オブジェクトの latitude および longitude データ メンバーでは、対応するポイントの地理座標が定義されます。value データ メンバーには、ポイントに関連付けられている数値が含まれています。

**JavaScript の場合:**

```js
var data = [
    { longitude: 0, latitude: 0, value: 1 },
    { longitude: 50, latitude: 0, value: 2 },
    { longitude: 50, latitude: 50, value: 3 },
    { longitude: 0, latitude: 50, value: 1 }
];
```

以下のコード スニペットは、前の例で指定されたカスタム データ ソースによって地理等高線シリーズを構成しています。このコードは、データ 配列の対応するデータ メンバーの名前を使用して、`latitudeMemberPath`、`longitudeMemberPath`、および `valueMemberPath` オプションを明示的に設定しています。

**JavaScript の場合:**

```js
$("#map").igMap({
    ...
    series: [{
        type: "geographicScatterArea",
        name: "seriesName",
        dataSource: data,
        latitudeMemberPath: "latitude",
        longitudeMemberPath: "longitude",
        colorMemberPath: "value",
        colorScale: {
            minimumValue: 1,
            interpolationMode: "select",
            palette: ["darkgreen", "green", 'limegreen', 'lightgreen']
        }
    }],
    ...
});
```

画面上にコントロールをレンダリングするには、データ配列で定義されるデータ ポイントを三角形に変換する必要があります。それによって、色分けされたすべての領域の正しい位置とサイズを特定できるようになります。三角測量のプロセスの詳細は、[関連コンテンツ: 外部リソース](igMap-Configuring-Geographic-Scatter-Area-Series.html#external-resources)セクションのリンク先を参照してください。



##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[マップ シリーズの構成 (igMap)](igMap-Creating-Different-Kinds-Maps.html): このトピックは、`igMap` コントロールでサポートされているすべてのマップ視覚エフェクトを構成し、さまざまな背景コンテンツ (マップ プロバイダー) を使用する方法を説明するトピックのリンクがあるランディング ページです。

-	[機能の構成 (igMap)](igMap-Configuring-Features.html): このトピックは、`igMap` コントロールのさまざまな機能を構成する方法を説明するトピックのリンクがあるランディング ページです。

-	[データ バインディング (igMap)](Data-Binding-igMap.html): このトピックは、視覚化されたマップ シリーズに応じて `igMap` コントロールをさまざまなデータ ソースにバインドする方法を説明します。

-	[マップのスタイル設定 (igMap)](Styling-igMap.html): このトピックは、ビジュアル スタイル設定に関連して `igMap` コントロールを構成する方法を説明しています。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[地理散布エリア シリーズ](%%SamplesUrl%%/map/geo-scatter-area): このサンプルでは、地理散布エリア シリーズで三角形分割済ファイル (ITF) をマップ コントロールにバインドする方法を紹介します。



### <a id="external-resources"></a>外部リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

-	[三角測量 (ジオメトリ)](http://en.wikipedia.org/wiki/Triangulation_%28geometry%29): このトピックでは、三角測量のプロセスについて地理的な観点から説明します。

-	[三角測量](http://en.wikipedia.org/wiki/Triangulation): この Wikipedia のトピックでは、三角測量のプロセスに関する説明と、それに関する参考資料が示されています。





 

 



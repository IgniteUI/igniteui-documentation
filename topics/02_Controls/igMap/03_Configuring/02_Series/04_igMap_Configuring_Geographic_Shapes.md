<!--
|metadata|
{
    "fileName": "igmap-configuring-geographic-shapes",
    "controlName": "igMap",
    "tags": ["Charting","Data Presentation","How Do I"]
}
|metadata|
-->

# 地理図形シリーズの構成 (igMap)



##トピックの概要

### 目的

このトピックでは、`igMap`™ コントロールを使用して地理図形シリーズを構成する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[igMap の概要](Overview-igMap.html): このトピックは、`igMap` コントロールについて、その主要機能、最小要件、ユーザー インタラクションといった事項の概念的情報を提供します。

- [igMap の追加](Adding-igMap.html): このトピックは、基本的な機能を備えた簡易 `igMap` コントロールを Web ページに追加する方法を示すチュートリアルです。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [地理図形シリーズの構成の概要](#config-summary)
-   [コード例の概要](#code-example)
    -   [JavaScript における地理図形シリーズの構成](#config-series-js)
    -   [ASP.NET MVC における地理図形シリーズの構成](#config-series-mvc)
    -   [カスタム図形データ ソースの構成](#config-custom-datasource)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="introduction"></a>概要

### 地理図形シリーズの概要

`igMap` コントロールの地理図形シリーズを実際に適用するには、シェープ ファイル、またはアプリケーションが提供するカスタム図形データ ソースで指定された地理領域の図形 (またはクローズド パス) を描画します。シェープ ファイルは、各図形に関連する情報が含まれた対応するデータベースの DBF ファイルと常にペアになっています。カスタム図形データ ソースは、プロパティの形で、または内部構造の一部としてのデータ オブジェクトの形で、各図形に関連する情報を提供します。

地理図形シリーズは、ワールド マップ上で目的のエリアを強調表示する場合に役立ちます。これは、国または行政区域を示すマップ、市場地域、またはその他の地理領域を描画する場合に適しています。

![](images/Configuring_Geographic_Shapes_Series_1.png)

`igMap` コントロールを構成して、図形と合わせてマーカーを描画し、またカスタム マーカーを作成することができます。詳細は、[ビジュアル機能の構成 (igMap)](igMap-Configuring-Visual-Features.html) のトピックを参照してください。

CSS スタイルまたはシリーズ オブジェクトのオプションを使用して、図形やマーカーのアウトラインや色を制御できます。詳細については、トピック[マップのスタイル設定 (igMap)](Styling-igMap.html) を参照してください。

>**注:** モバイル デバイスを対象にする場合には、小さい図形データ セットを使用することをお勧めします。地理空間データをレンダリングするにはより多くのコンピューティング リソースが必要になり、ほとんどのモバイル デバイスの場合、デスクトップ PC やノート PC と比較してパフォーマンスが低くなります。



##<a id="config-summary"></a>地理図形シリーズの構成の概要

### 地理図形シリーズの構成の概要図

以下の表は、`igMap` コントロールの地理図形シリーズの構成可能な要素を示しています。

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
				地理図形シリーズの設定
			</td>

			<td>
				これらの必須設定では、地理図形にマップ シリーズのタイプを構成し、シリーズの名前を設定します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.type</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.name</a></li>
				</ul><br>値:
				<br>
				**series.type: “geographicShape”**,

				**series.type: "seriesName"**<br>

				ASP.NET MVC の場合:<br>

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1.html" data-auto-update-caption="true">MapSeriesBuilder&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1~GeographicShape.html">.GeographicShape()</a></li>
						</ul>
					</li>
				</ul><br>値:<br>

				**series.GeographicShape(“seriesName”)**
			</td>
		</tr>

		<tr>
			<td>
				地理図形シリーズのデータ バインディング オプション
			</td>

			<td>
				これらの必須設定では、図形とデータベース ファイルの URL、またはカスタム図形データ ソースを構成します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.shapeDataSource</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.databaseSource</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~ShapeDataSource.html">.ShapeDataSource()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~DatabaseSource.html">.DatabaseSource()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				ツールチップの表示/非表示
			</td>

			<td>
				ツールチップのレンダリングを有効に設定します。

				デフォルトでは、ツールチップは無効になっています。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.showTooltip</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~ShowTooltip.html">.ShowTooltip()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				ツールチップ テンプレート
			</td>

			<td>
				ツールチップのレンダリングに使用するテンプレートを指定するように構成します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.tooltipTemplate</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~TooltipTemplate.html">.TooltipTemplate()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				図形のアウトライン
			</td>

			<td>
				図形のアウトラインの色を構成します。

				図形のアウトラインのデフォルトの色は黒です。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.outline</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.shapeStyle.stroke</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~Outline.html">.Outline()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				図形のアウトラインの太さ
			</td>

			<td>
				図形のアウトラインの太さを構成します。

				デフォルトの太さは 0 です。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.thickness</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.shapeStyle.thickness</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~Thickness.html">.Thickness()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~ShapeStyle.html">.ShapeStyle()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				図形の塗りつぶし
			</td>

			<td>
				図形の塗りつぶし色を構成します。

				図形のデフォルトの塗りつぶし色は黒です。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.brush</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.shapeStyle.fill</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~Brush.html">.Brush()</a></li>

							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~ShapeStyle.html">.ShapeStyle()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				マーカー タイプ
			</td>

			<td>
				コントロールを構成して、レンダリングのためのマーカー選択を指定します。

				デフォルトでは、コントロールによって、レンダリングするタイプとマーカーが選択されます。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.markerType</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1~MarkerType.html">.MarkerType()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				カスタム マーカー テンプレート
			</td>

			<td>
				マップに使用する キャンバス 要素にコンテンツを直接レンダリングするコールバック関数で、オブジェクトを構成します。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options">series.markerTemplate</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1~MarkerTemplate.html">.MarkerTemplate()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				マーカー アウトライン
			</td>

			<td>
				マーカーの色付きアウトラインを構成します。

				デフォルトでは、アウトラインの色は黒です。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.markerOutline</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicSymbolSeries`1~MarkerOutline.html">.MarkerOutline()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				マーカーの塗りつぶし
			</td>

			<td>
				マーカーの塗りつぶしの色を構成します。

				デフォルトでは、塗りつぶしの色は黒です。
			</td>

			<td>
				JavaScript の場合:

				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igMap#options" target="_blank">series.markerBrush</a></li>
				</ul>

				ASP.NET MVC の場合:

				<ul>
					<li>
						<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeries`1.html" data-auto-update-caption="true">GeographicShapeSeries&lt;T&gt; クラス</a>

						<ul>
							<li><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicSymbolSeries`1~MarkerBrush.html">.MarkerBrush()</a></li>
						</ul>
					</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

##<a id="code-example"></a>コード例の概要

### コード例の概要表

以下の表は、このトピックで使用したコード例をまとめたものです。

例|説明
---|---
[JavaScript における地理図形シリーズの構成](#config-series-js)|このコード例は、`igMap` コントロールを構成して、地理図形シリーズを JavaScript で表示する方法を示しています。
[ASP.NET MVC における地理図形シリーズの構成](#config-series-mvc)|このコード例は、`igMap` コントロールを構成して、地理図形シリーズを ASP.NET MVC で表示する方法を示しています。
[カスタム図形データ ソースの構成](#config-custom-datasource)|このコード例は、`igMap` コントロールを構成して、カスタム図形データ ソースを使用して地理図形シリーズを表示する方法を示しています。





##<a id="config-series-js"></a>コード例: JavaScript における地理図形シリーズの構成

### 説明

このコード例は、`igMap` コントロールを構成して、地理図形シリーズを JavaScript で表示する方法を示しています。この例は、図形とデータベース ファイルの URL を指定する方法を示しています。図形のアウトラインと色の塗りつぶし範囲、自動マーカー選択、マーカーのアウトラインと塗りつぶし色を構成します。

### コード

**JavaScript の場合:**

```js
Code
$("#map").igMap({
    ...
    series: [{
        type: "geographicShape",
        name: "seriesName",
        markerType: "automatic",
        shapeMemberPath: "points",
        shapeDataSource: '/Data/geoshapes.shp',
        databaseSource: '/Data/geoshapes.dbf',
        brush: "rgba(68,138,223,.6)",
        outline: "blue",
        markerBrush: "rgba(50,100,100,0.7)", 
        markerOutline: "blue"
    }],
    ...
});
```



##<a id="config-series-mvc"></a>コード例: ASP.NET MVC における地理図形シリーズの構成

### 説明

このコード例は、`igMap` コントロールを構成して、地理図形シリーズを ASP.NET MVC で表示する方法を示しています。この例は、図形とデータベース ファイルの URL を指定する方法を示しています。図形のアウトライン、色の塗りつぶし領域、自動マーカー選択、マーカーのアウトラインと塗りつぶし色を構成します。

### コード

**ASPX の場合:**

```csharp
Code
<%= Html.Infragistics().Map()
        ...
        .Series(series => {
            series.GeographicShape("seriesName")
                .ShapeDataSource(Url.Content("~/Data/geoshapes.shp"))
                .DatabaseSource(Url.Content("~/Data/geoshapes.dbf"))
                .ShapeMemberPath("points")
                .MarkerType(MarkerType.Automatic)
                .Brush("rgba(68,138,223,.6)")
                .Outline("blue");
                .MarkerBrush("rgba(50,100,100,0.7)")
                .MarkerOutline("blue");
        })
        ...
        .DataBind()
        .Render()
%>
```



##<a id="config-custom-datasource"></a>コード例: カスタム図形データ ソースの構成

### 説明

このコード例は、`igMap` コントロールを構成して、カスタム図形データ ソースを使用して地理図形シリーズを表示する方法を示しています。図形ソースには、個々の図形とそのデータ属性の場所に関する地理空間データが含まれています。

### コード

以下のコード スニペットは、2 つの図形に関する情報が含まれている JavaScript 配列を定義しています。各図形には、図形の配列を保存する points というメンバーが含まれています。各図形は、地理ポイントの配列です。配列内の 2 つのオブジェクトには、data というデータ メンバーが含まれており、図形関連のデータを持つ任意の数のフィールドを保持できます。これらのデータ オブジェクトは、コントロールによって対応する図形にバインドされ、ツールチップ テンプレートとイベント受け渡し関数で使用可能になります。

**JavaScript の場合:**

```js
var data = [
    {
        data: {
            attribute1: "String value 1",
            attribute2: 3.1415,
            attribute3: "12/21/2012"
        },
        points: [
            [
                { x: 0, y: 0 },
                { x: 30, y: 0 },
                { x: 30, y: 30 },
                { x: 0, y: 30 }
            ],
            [
                { x: 5, y: 5 },
                { x: 35, y: 5 },
                { x: 35, y: 35 }
            ]
        ]
    }, 
    {
        data: {
            attribute1: "String value 2",
            attribute2: 2.71828,
            attribute3: "03/14/2001"
        },
        points: [
            [
                { x: 40, y: 0 },
                { x: 70, y: 0 },
                { x: 70, y: 30 },
                { x: 40, y: 30 }
            ]
        ]
    }
];
```

以下のコード スニペットは、上記で指定したカスタム データ ソースを使用して地理図形シリーズを構成しています。このコードでは、`shapeMemberPath` オプションを図形オブジェクトの points データ メンバーの名前に明示的に設定しています。この方法で、メンバー名が異なる任意のオブジェクトに図形データを保存できます。

**JavaScript の場合:**

```js
$("#map").igMap({
    ...
    series: [{
        type: 'geographicShape',
        name: 'customShapeSource',
        dataSource: data,
        shapeMemberPath: "points",
        outline: "black",
        markerType: 'automatic',
        shapeStyle: {
            fill: "lightblue",
            stroke: "black",
            thickness: 8.0
        }
    }],
    ...
});
```



##<a id="related-content"></a>関連コンテンツ


### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[マップ シリーズの構成 (igMap)](igMap-Creating-Different-Kinds-Maps.html): このトピックは、`igMap` コントロールでサポートされているすべてのマップ視覚エフェクトを構成し、さまざまな背景コンテンツ (マップ プロバイダー) を使用する方法を説明するトピックのリンクがあるランディング ページです。

-	[機能の構成 (igMap)](igMap-Configuring-Features.html): このトピックは、`igMap` コントロールのさまざまな機能を構成する方法を説明するトピックのリンクがあるランディング ページです。

-	[データ バインディング (igMap)](Data-Binding-igMap.html): このトピックは、視覚化されたマップ シリーズに応じて `igMap` コントロールをさまざまなデータ ソースにバインドする方法を説明します。

-	[マップのスタイル設定 (igMap)](Styling-igMap.html): このトピックは、ビジュアル スタイル設定に関連して `igMap` コントロールを構成する方法を説明しています。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[地理図形シリーズ](%%SamplesUrl%%/map/geo-shapes-series): このサンプルでは、シェープ ファイルおよびデータベース ファイルをマップ コントロールにバインドし、地理図形を視覚化する方法を紹介します。





 

 



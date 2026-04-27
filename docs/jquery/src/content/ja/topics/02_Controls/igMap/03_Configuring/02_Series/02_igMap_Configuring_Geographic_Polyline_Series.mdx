<!--
|metadata|
{
    "fileName": "igmap-configuring-geographic-polyline-series",
    "controlName": "igMap",
    "tags": ["Charting","Data Presentation","How Do I"]
}
|metadata|
-->

# 地理ポリライン シリーズの構成 (igMap)



##トピックの概要

### 目的

このトピックでは、`igMap`™ コントロールを使用して地理ポリライン シリーズを構成する方法について説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[igMap の概要](Overview-igMap.html): このトピックは、`igMap` コントロールについて、その主要機能、最小要件、ユーザー インタラクションといった事項の概念的情報を提供します。

-	[igMap の追加](Adding-igMap.html): このトピックでは、基本的な機能を備えた簡易マップを Web ページに追加する方法を示します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [地理ポリライン シリーズの構成の概要](#configuration-summary)
-   [コード例の概要](#code-example)
    -   [JavaScript での地理ポリライン シリーズの構成](#config-series-js)
    -   [ASP.NET MVC での地理ポリライン シリーズの構成](#config-series-mvc)
    -   [カスタム図形データ ソースの構成](#config-custom-datasource)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="introduction"></a>概要

### 地理ポリライン シリーズの概要

`igMap` コントロールの地理ポリライン シリーズは、個々のアプリケーションの提供するシェイプ ファイルで指定された地理領域にポリラインを描画するためのものです。ポリラインは、シェイプ (SHP) ファイルで座標によって記述される道路や河川のようなオープン パスです。

各シェイプ ファイルとそれぞれに対応するデータベース DBF は常にペアで提供され、対応するデータベース DBF ファイルには各シェイプに関する情報が収められています。地理ポリライン シリーズは、マップ上で重要なパスを強調表示するのに便利です。これは、サプライ ルートや主要道路を示すという処理や、GPS　データを使用して追跡車両の移動経路を描くといった処理に適しています。

![](images/Configuring_Geographic_Polyline_Series_1.png)

ポリラインの色は、シリーズ オブジェクトの CSS スタイルやオプションを使用して管理できます。詳細については、トピック[igMap のスタイル設定](Styling-igMap.html) を参照してください。

注: モバイル デバイスを対象にする場合には、小さい図形データ セットを使用することをお勧めします。地理空間データをレンダリングするにはより多くのコンピューティング リソースが必要になり、ほとんどのモバイル デバイスの場合、デスクトップ PC やノート PC と比較してパフォーマンスが低くなります。


##<a id="configuration-summary"></a>地理ポリライン シリーズの構成の概要


### 地理ポリライン シリーズの構成に関する要点チャート

次の表は、地理ポリライン シリーズの表示に使用できる `igMap` コントロールについて構成可能な項目をまとめたものです。

<table class="table table-striped">
	<thead>
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
	</thead>
	<tbody>
        

        <tr>
            <td>
シリーズ タイプの設定
			</td>

            <td>
当該の必須設定値は、地理ポリラインのマップ シリーズのタイプを構成し、シリーズ名を設定します。
			</td>

            <td>
                **JavaScript の場合:**

                <ul>
                    <li>
[series.type](%%jQueryApiUrl%%/ui.igMap#options:series.type)
					</li>

                    <li>
[series.name](%%jQueryApiUrl%%/ui.igMap#options:series.name)
					</li>
                </ul>
                値:
                <br>**series.type: “geographicPolyline”** **series.type: “seriesName”**
                <br>
                
                    

                
                ASP.NET MVC の場合:
                <br>

                <ul>
                    <li>
                        [MapSeriesBuilder<t> クラス](Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1.html)</t>

                        <ul>
                            <li>
[.GeographicPolyline()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.MapSeriesBuilder`1~GeographicPolyline.html)
							</li>
                        </ul>
                    </li>
                </ul>
                値:
                <br>**series.GeographicPolyline(“seriesName”)**
            </td>
        </tr>

        <tr>
            <td>
データ バインドのオプション
			</td>

            <td>
当該の必須設定値は、シェイプ ファイル、データベース ファイル、またはカスタム データ ソースに収められる URL を構成します。
			</td>

            <td>
                JavaScript の場合:

                <ul>
                    <li>
[series.shapeDataSource](%%jQueryApiUrl%%/ui.igMap#options:series.shapeDataSource)
					</li>

                    <li>
[series.databaseSource](%%jQueryApiUrl%%/ui.igMap#options:series.databaseSource)
					</li>
                </ul>ASP.NET MVC の場合:

                <ul>
                    <li>
                        [GeographicPolylineSeries<t> クラス](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicPolylineSeries`1.html)</t>

                        <ul>
                            <li>
[.ShapeDataSource()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~ShapeDataSource.html)
							</li>

                            <li>
[.DatabaseSource()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~DatabaseSource.html)
							</li>
                        </ul>
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ポリラインの色
			</td>

            <td>
この項目はポリラインの色を構成します。輪郭線の既定色は白になっています。
			</td>

            <td>
                JavaScript の場合:

                <ul>
                    <li>
[series.outline](%%jQueryApiUrl%%/ui.igMap#options:series.outline)
					</li>

                    <li>
[series.shapeStyle.stroke](%%jQueryApiUrl%%/ui.igMap#options:series.shapeStyle)
					</li>
                </ul>ASP.NET MVC の場合:

                <ul>
                    <li>
                        [GeographicPolylineSeries<t> クラス](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicPolylineSeries`1.html)</t>

                        <ul>
                            <li>
[.Outline()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~Outline.html)
							</li>

                            <li>
[.ShapeStyle()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~ShapeStyle.html)
							</li>
                        </ul>
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ポリラインの太さ
			</td>

            <td>
この項目はポリラインの太さを構成します。太さの既定値は 0 になっています。
			</td>

            <td>
                JavaScript の場合:

                <ul>
                    <li>
[series.thickness](%%jQueryApiUrl%%/ui.igMap#options:series.thickness)
					</li>

                    <li>
[series.shapeStyle.thickness](%%jQueryApiUrl%%/ui.igMap#options:series.shapeStyle)
					</li>
                </ul>ASP.NET MVC の場合:

                <ul>
                    <li>
                        [GeographicPolylineSeries<t> クラス](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicPolylineSeries`1.html)</t>

                        <ul>
                            <li>
[.Thickness()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~Thickness.html)
							</li>

                            <li>
[.ShapeStyle()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GeographicShapeSeriesBase`3~ShapeStyle.html)
							</li>
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
[JavaScript での地理ポリライン シリーズの構成](#config-series-js)|このコード例では、地理ポリライン シリーズを表示する `igMap` コントロールを JavaScript で構成する方法を示します。
[ASP.NET MVC での地理ポリライン シリーズの構成](#config-series-mvc)|このコード例では、地理ポリライン シリーズを表示する `igMap` コントロールを ASP.NET MVC で構成する方法を示します。
[カスタム図形データ ソースの構成](#config-custom-datasource)|このコード例では、地理ポリライン シリーズを表示する `igMap` コントロールをカスタム シェイプ データ ソースで構成する方法を示します。

##<a id="config-series-js"></a>コード例: JavaScript での地理ポリライン シリーズの構成

### 説明

このコード例では、地理ポリライン シリーズを表示する `igMap` コントロールを JavaScript で構成する方法を示します。この例では、シェイプ ファイルおよびデータベース ファイルの URL と、ポリラインの色を指定する方法を示します。

### コード

**JavaScript の場合:**

```js
Code
$("#map").igMap({
    ...
    series: [{
        type: "geographicPolyline",
        name: "seriesName",
        shapeDataSource: "/Data/America/geopolylines.shp",
        databaseSource: "/Data/geopolylines.dbf",
        outline: "grey"
    }],
    ...
    }
});
```



##<a id="config-series-mvc"></a>コード例: ASP.NET MVC での地理ポリライン シリーズの構成

### 説明

このコード例では、地理ポリライン シリーズを表示する `igMap` コントロールを ASP.NET MVC で構成する方法を示します。この例では、シェイプ ファイルとデータベース ファイルの URL を指定する方法を示します。また、シェイプの輪郭線と塗りつぶしの色、自動マーカー選択、およびマーカーの輪郭線と塗りつぶしの色も構成します。

### コード

**ASPX の場合:**

```csharp
Code
<%= Html.Infragistics().Map()
        .ID("map")
        ...
        .Series(series => {
            series.GeographicPolyline("seriesName")
                .ShapeDataSource(Url.Content("~/Data/geopolylines.shp"))
                .DatabaseSource(Url.Content("~/Data/geopolylines.dbf"))
                .Outline("grey");
        })
        ...
        .DataBind()
        .Render()
%>
```



##<a id="config-custom-datasource"></a>コード例: カスタム図形データ ソースの構成

### 説明

このコード例では、地理ポリライン シリーズを表示する `igMap` コントロールをカスタム シェイプ データ ソースで構成する方法を示します。この例は、コントロールによって処理されるデータ オブジェクトの一般的な構造を示しています。また、`igMap` コントロールでの series オブジェクトの構成方法を示すものでもあります。

### コード

次のコード スニペットは、2 つのシェイプに関する情報が含まれる JavaScript 配列を定義しています。それぞれのシェイプはポイントと呼ばれるメンバーから構成され、各メンバーにはパスの配列が収められます。それぞれのパスは地理ポイントの配列であるため、1 つのポリラインに複数のパスが含まれる場合もあります。

**JavaScript の場合:**

```js
var data = [
    {
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
                { x: 35, y: 35 },
                { x: 5, y: 35 }
            ]
        ]
    }, 
    {
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

次のコード スニペットは、前の例で指定したカスタム データ ソースを使用して地理ポリライン シリーズを構成します。このコードでは、`shapeMemberPath` オプションを図形オブジェクトの points データ メンバーの名前に明示的に設定しています。これにより、プロパティ名の異なる任意のオブジェクトにシェイプ データを格納できるようになります。

**JavaScript の場合:**

```js
$("#map").igMap({
    ...
    series: [{
        type: 'geographicPolyline',
        name: 'customShapeSource',
        dataSource: data,
        shapeMemberPath: "points",
        outline: "black"
    }],
    ...
});
```



##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[マップ シリーズの構成 (igMap)](igMap-Creating-Different-Kinds-Maps.html): このトピックは、`igMap` コントロールでサポートされているすべてのマップ視覚エフェクトを構成し、さまざまな背景コンテンツ (マップ プロバイダー) を使用する方法を説明するトピックのリンクがあるランディング ページです。

-	[機能の構成 (igMap)](igMap-Configuring-Features.html): このグループのトピックでは、`igMap` コントロールのさまざまな機能を構成する方法を説明します。対応する機能としては、特定の地理領域へのナビゲーション、Overview Plus Detail パネルの有効または無効化、表示中の領域をマップ上で取得、パンとズームに関するユーザー インタラクションの構成、ツールチップ テンプレートの構成、カスタム マーカーの設定などがあります。

-	[データ バインディング (igMap)](Data-Binding-igMap.html): このトピックは、視覚化されたマップ シリーズに応じて `igMap` コントロールをさまざまなデータ ソースにバインドする方法を説明します。

-	[マップのスタイル設定 (igMap)](Styling-igMap.html): このトピックでは、テーマを使用して `igMap` コントロールのルック アンド フィールをカスタマイズする方法を説明します。


### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[地理的ポリライン シリーズ](%%SamplesUrl%%/map/geo-polyline-series): このサンプルでは、シェープ ファイルおよびデータベース ファイルをバインドして地理ポリライン シリーズを構成する方法を示します。





 

 



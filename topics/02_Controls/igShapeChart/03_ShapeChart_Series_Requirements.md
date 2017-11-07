<!--
|metadata|
{
    "fileName": "shapechart-series-requirements",
    "controlName": "igShapeChart",
    "tags": ["ShapeChart"]
}
|metadata|
-->

# シリーズ要件

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [チャート タイプの設定](#setting-chart-type)
-   [必須の設定](#required-settings)
-   [データ項目の作成](#creating-data-items)
-   [関連コンテンツ](#related-content)

## ChartType プロパティの設定

チャート タイプ トピックで説明されているように、チャート プロパティを変更するだけでさまざまなチャート タイプを描画できます。

初期化時にチャート タイプを割り当てる方法:

**JavaScript の場合:**

```
<script type="text/javascript">
    $(function () 
    {
        $("#shapeChart").igShapeChart(
            {  
                chartType: "bubble",
            }
        });
    });
</script>
```


<table class="table table-striped">
	<thead>
		<tr>
			<th>チャート タイプ</th>
			<th>x</th>
			<th>y</th>
			<th>value</th>
			<th>radius</th>
			<th>points*</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>`Point`</td>
			<td>X</td>
			<td>X</td>
		    <td></td>
		    <td></td>
		    <td></td>
		</tr> 
		<tr>
			<td>`Line`</td>
			<td>X</td>
			<td>X</td>
			 <td></td>
		    <td></td>
		    <td></td>
		</tr> 
		<tr>
			<td>`Spline`</td>
			<td>X</td>
			<td>X</td>
			 <td></td>
		    <td></td>
		    <td></td>
		</tr> 
		<tr>
			<td>`HighDensity`</td>
			<td>X</td>
			<td>X</td>
			 <td></td>
		    <td></td>
		    <td></td>
		</tr> 
		<tr>
			<td>`Bubble`</td>
			<td>X</td>
			<td>X</td>
			<td></td>
			<td>X</td>
			<td></td>
		</tr> 
		<tr>
			<td>`Area`</td>
			<td>X</td>
			<td>X</td>
			<td>X</td>
			<td></td>
			<td></td>
		</tr> 
		<tr>
			<td>`Contour`</td>
			<td>X</td>
			<td>X</td>
			<td>X</td>
			<td></td>
			<td></td>
		</tr> 
		<tr>
			<td>`Polyline`</td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td>X</td>
		</tr> 
		<tr>
			<td>`Polygon`</td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td>X</td>
		</tr>
	</tbody>
</table>

## データ項目の作成

このセクションは、各チャート タイプの最小要件を表示する例です。以下の各データ クラスは、チャートのビジュアル データを描画するプロパティを含みます。

`ChartType` プロパティを `Point`、`Line`、`Spline`、または `HighDensity` 値に設定する場合、以下を使用します。

**JavaScript の場合:**

```
<script>
    function ScatterPoints() 
    { 
  		var dataItems = 
  		[ 
   			{ "x": 10, "y": 10 },  
   			{ "x": 20, "y": 20 }, 
	    ];
        return dataItems;
    }
</script>
```

`ChartType` プロパティを `Bubble` 値に設定する場合、以下を使用します。

**JavaScript の場合:**

```
<script>
    function ScatterBubbles() 
    { 
  		var dataItems = 
   		[ 
   			{ "x": 10, "y": 10, "radius": 10 },  
   			{ "x": 20, "y": 20, "radius": 10 }, 
   		];
   		return dataItems;
	}
</script>
```

`ChartType` プロパティを `Area` または `Contour` 値に設定する場合、以下を使用します。

**JavaScript の場合:**

```
<script>
    function ScatterValues() 
    { 
  		var dataItems = 
   		[ 
   			{ "x": 10, "y": 10, "value": 10 }, 
   			{ "x": 20, "y": 20, "value": 10 }, 
   		];
   		return dataItems;
	}
</script>
```

`ChartType` プロパティを `Polyline` または `Polygon` 値に設定する場合、以下を使用します。
 
```
<script>
    function ScatterShapes(x, y, w, h) 
    {
  	    function createShape(x, y, w, h) 
        {
   		    return [
   				{ "x": x, "y": y },
   				{ "x": x + w, "y": y },
   				{ "x": x + w, "y": y + h },
   				{ "x": x, "y": y + h },
   				{ "x": x, "y": y }];
   		}
		var data = 
		[ 
		   { "points": [createShape(10, 10, 10, 10)]},
		   { "points": [createShape(20, 20, 10, 10)]},
		];	
		
		return data;
	}
</script>
```
    
*関連トピック:* 

- [はじめに](shapechart-getting-started-with-shapechart.html)

- [チャート タイプ](shapechart-chart-types.html)

- [シェープ ファイル データのバインド](shapechart-binding-shapefile-data.html)

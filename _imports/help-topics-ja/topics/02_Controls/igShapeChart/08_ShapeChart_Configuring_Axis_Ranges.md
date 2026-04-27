<!--
|metadata|
{
    "fileName": "shapechart-configuring-axis-ranges",
    "controlName": "igShapeChart",
    "tags": ["API", "ShapeChart", "Axis"]
}
|metadata|
-->

# 軸範囲の構成 (igShapeChart)

`igShapeChart` コントロールでは両軸が数値軸です。数値軸の範囲は軸の最初と終わり、つまり基になるデータの最小値と最大値の数値の差です。範囲の最小値は、軸の最小値です。範囲の最大値は、軸の最大値です。

### このトピックの内容

- [概要](#Overview)
- [コード スニペット](#CodeSnippet)
- [関連コンテンツ](#Related)

<a id="Overview" />
## 概要

デフォルトで、`igShapeChart` コントロールは、チャート プロット領域を最大化するために、最小データ ポイントおよび最大データ ポイントに基づいて軸の範囲の最小値と最大値を計算します。軸の最小値と最大値の自動計算は、データ ポイントのセットに適切でない場合があります。たとえば、チャートの端とプロット シリーズの間に余分なスペースを表示する場合、`igShapeChart` 軸範囲をフォーマットする必要があります。

igShapeChart コントロールの軸の範囲を書式設定するには、チャートの `xAxisMinimumValue`、`xAxisMaximumValue`、`yAxisMinimumValue`、 および `yAxisMaximumValue` プロパティを設定します。これは軸範囲を定義している値に設定し、指定した範囲にデータを表示します。

<a id="CodeSnippet" />
## コード スニペット

以下のサンプル コードは、`igShapeChart` コントロールの X 軸と Y 軸の軸範囲を変更する方法を示します。

**HTML の場合:**
```html
<script>
    
    var data = [
    { "X": 30, "Y": 30},
    { "X": 30, "Y": 70},
    { "X": 70, "Y": 70},
    { "X": 70, "Y": 30}];
            

    $(function () {
        $("#shapeChart").igShapeChart({                
            dataSource: data,
            width: "600px",
            height: "400px",
            xAxisMinimumValue: 0,
            yAxisMinimumValue: 0,
            xAxisMaximumValue: 100,
            yAxisMaximumValue: 100,                   
        });
    });
    
</script>
```
上記の手順を実行すると、igShapeChart コントロールは以下のようになります。

![](images/shapechart_ranges.png)

<a id="Related" />
## 関連コンテンツ
- [軸ラベルの構成](shapechart-configuring-axis-labels.html)
- [軸間隔の構成](shapechart-configuring-axis-intervals.html)

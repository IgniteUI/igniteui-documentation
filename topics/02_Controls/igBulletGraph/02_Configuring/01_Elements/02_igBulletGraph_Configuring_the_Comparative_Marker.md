<!--
|metadata|
{
    "fileName": "igbulletgraph-configuring-the-comparative-marker",
    "controlName": "igBulletGraph",
    "tags": ["Charting","How Do I"]
}
|metadata|
-->

# 比較マーカーの構成 (igBulletGraph)

## トピックの概要

#### 目的

このトピックではコード例を使用して、`igBulletGraph`™ コントロールの比較目盛マーカーを構成する方法を説明します。説明には、マーカーの値、幅、および書式設定が含まれます。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [*igBulletGraph* の概要](igBulletGraph-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igBulletGraph` コントロールの概念的な情報を提供します。

- [*igBulletGraph* の追加](igBulletGraph-Adding.html): このトピック グループは、`igBulletGraph` コントロールを HTML ページと ASP.NET MVC アプリケーションに追加する方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**比較マーカーの構成**](#configuring)
    -   [比較マーカー構成の概要](#configuration-summary)
    -   [比較マーカー構成の概要表](#configuration-summary-chart)
    -   [プロパティ設定](#property-settings)
    -   [例](#example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="configuring"></a> 比較マーカーの構成

####<a id="configuration-summary"></a> 比較マーカー構成の概要

比較マーカーは、パフォーマンス バーが示す値と比較された値をスケールに表示します。比較値は、目標売上高などの目標値または値の超過限度を示す制限値 (体温計の37℃の発熱の目安) にすることができます。

比較目盛マーカーが示す値およびスケール上の位置は、[`targetValue`](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValue) プロパティで設定します。比較マーカーは、そのスケール全域で位置やサイズ ([`targetValueInnerExtent`](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueInnerExtent) および [`targetValueOuterExtent`](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOuterExtent))、幅 ([`targetValueBreadth`](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBreadth)) およびルック アンド フィール (塗りつぶし色 - [`targetValueBrush`](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBrush)、境界線の線幅 - [`targetValueStrokeThickness`](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueStrokeThickness)、境界線の色 - [`targetValueOutline`](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOutline)) に関して各プロパティでカスタマイズできます。

![](images/igBulletGraph_Configuring_the_Comparative_Marker_1.png)

####<a id="configuration-summary-chart"></a> 比較マーカー構成の概要表

以下の表で、`igBulletGraph` コントロールの比較マーカーで構成できる要素を簡単に説明し、構成に使用するプロパティにマップします。

<table class="table table-bordered">
	<thead>
		<tr>
            <th colspan="2">
構成可能な要素
			</th>
            <th>
プロパティ
			</th>
            <th>
デフォルト値
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <th colspan="2">
**名前**
			</th>
            <td>
[targetValueName](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueName)
			</td>
            <td>
設定されていません
			</td>
        </tr>
        <tr>
            <th colspan="2">
**表示値**
			</th>
            <td>
[targetValue](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValue)
			</td>
            <td>
設定されていません
			</td>
        </tr>
        <tr>
            <th colspan="2">
**幅**
			</th>
            <td>
[targetValueBreadth](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBreadth)
			</td>
            <td>
*3.0*
			</td>
        </tr>
        <tr>
            <th rowspan="2">
**スケール全域の位置**
			</th>
            <th>
**内側の端**
			</th>
            <td>
[targetValueInnerExtent](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueInnerExtent)
			</td>
            <td>
*0.3*
			</td>
        </tr>
        <tr>
            <th>
**外側の端**
			</th>
            <td>
[targetValueOuterExtent](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOuterExtent)
			</td>
            <td>
*0.85*
			</td>
        </tr>
        <tr>
            <th rowspan="3">
**ルック アンド フィール**
			</th>
            <th>
塗りつぶし色
			</th>
            <td>
[targetValueBrush](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBrush)
			</td>
            <td>
デフォルトのテーマで定義済み
			</td>
        </tr>
        <tr>
            <th>
境界線の線幅
			</th>
            <td>
[targetValueStrokeThickness](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueStrokeThickness)
			</td>
            <td>
*1.0*
			</td>
        </tr>
        <tr>
            <th>
境界線の色
			</th>
            <td>
[targetValueOutline](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOutline)
			</td>
            <td>
デフォルトのテーマで定義済み
			</td>
        </tr>
        <tr>
            <th colspan="2">
**ツールチップ**
			</th>
            <td>
[targetValueToolTipTemplate](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueToolTipTemplate)
			</td>
            <td>
比較マーカーで示された値
			</td>
        </tr>
    </tbody>
</table>


#### <a id="property-settings"></a> プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。

<table class="table table-bordered">
	<tbody>
		<tr>
            <th colspan="3">
構成の目的:
			</th>
            <th rowspan="2">
使用するプロパティ:
			</th>
            <th rowspan="2">
設定の選択肢:
			</th>
        </tr>
        <tr>
            <th colspan="2">
**要素**
			</th>
            <th>
**詳細**
			</th>
        </tr>
        <tr>
            <th colspan="2">
**名前**
			</th>
            <td>
比較マーカーの名前 ([ツールチップ](igBulletGraph-Configuring-the-Tooltips.html#comparative-marker)の表示用)
			</td>
            <td>
[targetValueName](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueName)
			</td>
            <td>
比較マーカーの名前を表す文字列
			</td>
        </tr>
        <tr>
            <th colspan="2">
**表示する値**
			</th>
            <td>
表示する値
			</td>
            <td>
[targetValue](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValue)
			</td>
            <td>
スケールのメジャーにおける任意の値
			</td>
        </tr>
        <tr>
            <th colspan="2">
**幅**
			</th>
            <td>
マーカーの幅
			</td>
            <td>
[targetValueBreadth](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBreadth)
			</td>
            <td>
任意の値 (ピクセル)
			</td>
        </tr>
        <tr>
            <th rowspan="2">
**スケール全域の位置**
			</th>
            <th>
**内側の端**
			</th>
            <td>
水平方向で比較マーカーが位置する下端、または垂直方向で位置する左端
			</td>
            <td>
[targetValueInnerExtent](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueInnerExtent)
			</td>
            <td>
方向に応じた、[グラフ領域](igBulletGraph-Overview.html#logical-areas)の高さと幅の相対部分として必要な値。小数で指定 (例: *0.2*)
			</td>
        </tr>
        <tr>
            <th>
**外側の端**
			</th>
            <td>
水平方向で比較マーカーが位置する上端、または垂直方向で位置する右端
			</td>
            <td>
[targetValueOuterExtent](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOuterExtent)
			</td>
            <td>
方向に応じた、グラフ領域の高さと幅の相対部分として必要な値。小数で指定 (例: *0.2*)
			</td>
        </tr>
        <tr>
            <th rowspan="3">
**ルック アンド フィール**
			</th>
            <th>
塗りつぶし色
			</th>
            <td>
マーカーの塗りつぶし色
			</td>
            <td>
[targetValueBrush](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBrush)
			</td>
            <td>
任意の色
			</td>
        </tr>
        <tr>
            <th>
境界線の線幅
			</th>
            <td>
マーカーの境界線の幅
			</td>
            <td>
[targetValueStrokeThickness](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueStrokeThickness)
			</td>
            <td>
任意の値 (ピクセル)
			</td>
        </tr>
        <tr>
            <th>
境界線の色
			</th>
            <td>
マーカーの境界線の色を構成
			</td>
            <td>
[targetValueOutline](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOutline)
			</td>
            <td>
任意の色
			</td>
        </tr>
        <tr>
            <th colspan="2">
ツールチップ
			</th>
            <td>
比較マーカーの境界線のコンテンツ
			</td>
            <td>
[targetValueToolTipTemplate](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueToolTipTemplate)
			</td>
            <td>
任意のテンプレート (詳細は、[ツールチップの構成 (*igBulletGraph*)](igBulletGraph-Configuring-the-Tooltips.html) トピックを参照)
			</td>
        </tr>
    </tbody>
</table>

#### <a id="example"></a>例

以下のスクリーンショットは、以下の設定の結果 `igBulletGraph` の外観がどのようになるか示しています。

プロパティ|値
---|---
[targetValue](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValue)|“70”
[targetValueBreadth](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBreadth)|“10”
[targetValueBrush](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueBrush)|#FFFF00
[targetValueInnerExtent](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueInnerExtent) |“0.2”
[targetValueOuterExtent](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOuterExtent) |“0.7”
[targetValueOutline](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueOutline)|'#006400'
[targetValueStrokeThickness](%%jQueryApiUrl%%/ui.igBulletGraph#options:targetValueStrokeThickness)|“3”


![](images/igBulletGraph_Configuring_the_Comparative_Marker_2.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$(function () {             
$("#bulletGraph").igBulletGraph({
    height: "70",                
    width: "300",
    targetValue:"70",
    targetValueBreadth:"10",
    targetValueBrush: '#FFFF00',
    targetValueOutline:'#006400',
    targetValueStrokeThickness: "2",
    targetValueInnerExtent:"0.3",
    targetValueOuterExtent:"0.8"
});
```



## <a id="related-content"></a> 関連コンテンツ

###<a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [スケールの構成 (*igBulletGraph*)](igBulletGraph-Configuring-the-Scale.html): このトピックではコード例を使用して、`igBulletGraph` コントロールのスケールを構成する方法を説明します。説明には、コントロール内のスケールの配置、スケールの目盛およびラベルの構成が含まれます。

- [パフォーマンス バーの構成 (*igBulletGraph*)](igBulletGraph-Configuring-the-Performance-Bar.html): このトピックではコード例を使用して、`igBulletGraph` コントロールのパフォーマンス バーを構成する方法を説明します。説明には、バーが示す値、幅、位置、および書式設定が含まれます。

- [比較範囲の構成 (*igBulletGraph*)](igBulletGraph-Configuring-Comparative-Ranges.html): このトピックではコード例を使用して、`igBulletGraph` コントロールの範囲を構成する方法を説明します。説明には、範囲の数、位置、長さ、幅、および書式設定が含まれます。

- [背景の構成 (*igBulletGraph*)](igBulletGraph-Configuring-the-Background.html): このトピックではコード例を使用して、ブレット グラフの背景を構成する方法を説明します。説明には、背景のサイズ、位置、色、および境界線の設定が含まれます。

- [ツールチップの構成 (*igBulletGraph*)](igBulletGraph-Configuring-the-Tooltips.html): このトピックではコード例を使用して、`igBulletGraph` コントロールのツールチップを有効にする方法および表示する遅延時間を設定する方法を説明します。



###<a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [パフォーマンス バーの設定](%%SamplesUrl%%/bullet-graph/performance-bar-settings): このサンプルでは、`igBulletGraph` コントロールのパフォーマンス (実際値) バー、比較目盛 (ターゲット値) マーカー、およびスケールのディメンションを構成する方法を紹介します。

- [基本構成](%%SamplesUrl%%/bullet-graph/basic-configuration): このサンプルでは、`igBulletGraph` コントロールのシンプルな構成を紹介します。





 

 



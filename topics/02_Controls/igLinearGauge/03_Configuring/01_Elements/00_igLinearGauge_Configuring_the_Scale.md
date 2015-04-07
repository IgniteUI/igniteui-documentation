<!--
|metadata|
{
    "fileName": "iglineargauge-configuring-the-scale",
    "controlName": "igLinearGauge",
    "tags": ["Charting","Formatting"]
}
|metadata|
-->

# スケールの構成 (igLinearGauge)

##トピックの概要

### 目的

このトピックでは例を使用して、`igLinearGauge`™ コントロールのスケールをカスタマイズする方法を説明します。説明には、コントロール内のスケールの配置、スケールの目盛およびラベルの構成が含まれます。(デフォルト設定については、[igLinearGauge の概要](igLinearGauge-Overview.html)のトピックを参照してください。)

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[igLinearGauge の概要](igLinearGauge-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igLinearGauge` コントロールの概念的な情報を提供します。

-	[igLinearGauge の追加](igLinearGauge-Adding.html): このトピック グループでは、`igLinearGauge`™ コントロールを HTML ページと ASP.NET MVC アプリケーションに追加する方法を示します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
    -   [スケール構成の概要](#scale-config-summary)
    -   [スケール構成の概要表](#scale-config-summary-chart)
-   [スケールサイズと位置の構成](#config-size-and-position)
    -   [概要](#size-posotion-overview)
    -   [プロパティ設定](#size-position-settings)
    -   [例](#size-position-example)
-   [スケールの範囲の構成](#range-config)
    -   [概要](#range-overview)
    -   [プロパティ設定](#range-setting)
    -   [例](#range-example)
-   [スケールの主目盛の構成](#major-tick-marks-config)
    -   [概要](#major-ticks-overview)
    -   [スケールに沿った位置、数、およびスペースの構成](#major-ticks-position)
    -   [スケール全域での位置およびセグメントの長さの構成](#major-ticks-length)
    -   [プロパティ設定](#major-ticks-settings)
    -   [例](#major-ticks-exapmle)
-   [スケールの補助目盛の構成](#minor-tick-marks-config)
    -   [概要](#minor-ticks-overview)
    -   [スケールに沿った位置、数、およびスペースの構成](#minor-ticks-position)
    -   [スケール全域での位置およびセグメントの長さの構成](#minor-ticks-length)
    -   [プロパティ設定](#minor-ticks-settings)
    -   [例](#minor-ticks-example)
-   [スケールのラベリングの構成](#labels-config)
    -   [概要](#labels-overview)
    -   [イベント処理](#labels-event)
    -   [プロパティ設定](#labels-settings)
    -   [例 - 水平方向](#horizontal-lable)
    -   [例 - 垂直方向](#vertical-lable)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)[](#samples)



##<a id="introduction"></a>概要

### <a id="scale-config-summary"></a>スケール構成の概要

`igLinearGauge` コントロールのスケールは、目盛とラベル (番号) で形成された論理エンティティです。目盛のサイズおよび位置は[グラフ領域](igLinearGauge-Overview.html#graph-area)に対して構成され、番号ラベルの位置はコントロールの内側の端 (水平方向で下端) に対して構成されます。

`igLinearGauge` コントロールの目盛は、グラフに沿ってメジャーの等間隔で表示されます。目盛は、主目盛および補助目盛の 2 種類がサポートされています。どちらの目盛も、グラフ領域に対して測定される範囲関連の各プロパティの値を調整することにより、スケールに沿って配置できます。目盛の正確な数、位置、外観、および表示の頻度はプロパティ設定によりカスタマイズできます。

ラベルについては、位置、テキスト、書式などのさまざまな要素が構成できます。

### <a id="scale-config-summary-chart"></a>スケール構成の概要表

以下の表で、`igLinearGauge` コントロールのスケールで構成できる要素を簡単に説明し、構成に使用するプロパティにマップします。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th colspan="4">
				構成可能な要素
			</th>

			<th>
				プロパティ
			</th>

			<th>
				デフォルト値
			</th>
		</tr>

		<tr>
			<th rowspan="2" colspan="4">位置</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options">scaleStartExtent</a></td>

			<td>0.05</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">scaleEndExtent</a></td>

			<td>0.95</td>
		</tr>

		<tr>
			<th rowspan="2" colspan="2">範囲と値</th>

			<th colspan="2">最大値</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minimumValue</a></td>

			<td>0</td>
		</tr>

		<tr>
			<th colspan="2">最小値</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">maximumValue</a></td>

			<td>100</td>
		</tr>

		<tr>
			<th rowspan="12">目盛</th>

			<th rowspan="7">主目盛</th>

			<th rowspan="5" colspan="2">
				スケール内の位置、スペースおよび長さ
			</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">interval</a></td>

			<td>
				設定されていません
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">ticksPostInitial</a></td>

			<td>0</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">ticksPreTerminal</a></td>

			<td>0</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickStartExtent</a></td>

			<td>0.02</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickEndExtent</a></td>

			<td>0.2</td>
		</tr>

		<tr>
			<th rowspan="2">ルック アンド フィール</th>

			<th>
				色
			</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickBrush</a></td>

			<td>デフォルトのテーマで定義済み</td>
		</tr>

		<tr>
			<th>
				幅
			</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickStrokeThickness</a></td>

			<td>2.0</td>
		</tr>

		<tr>
			<th rowspan="5">補助目盛</th>

			<th colspan="2">
				隣接する 2 つの主目盛間の数値
			</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickCount</a></td>

			<td>
				3.0
			</td>
		</tr>

		<tr>
			<th rowspan="2" colspan="2">位置</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickStartExtent</a></td>

			<td>0.06</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickEndExtent</a></td>

			<td>0.2</td>
		</tr>

		<tr>
			<th rowspan="2">ルック アンド フィール</th>

			<th>
				色
			</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickBrush</a></td>

			<td>デフォルトのテーマで定義済み</td>
		</tr>

		<tr>
			<th>
				幅
			</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickStrokeThickness</a></td>

			<td>1.0</td>
		</tr>

		<tr>
			<th rowspan="6">ラベル</th>

			<th rowspan="4" colspan="3">
				位置とスペース
			</th>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">labelExtent</a>
			</td>

			<td>0</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">labelInterval</a></td>

			<td>
				設定されていません
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">labelsPostInitial</a></td>

			<td>0</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">labelsPreTerminal</a></td>

			<td>0</td>
		</tr>

		<tr>
			<th colspan="3">数値書式</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">labelFormat</a></td>

			<td>
				設定されていません
			</td>
		</tr>

		<tr>
			<th colspan="2">ルック アンド フィール</th>

			<th>
				色
			</th>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">fontBrush</a></td>

			<td>
				デフォルトのテーマで定義済み
			</td>
		</tr>
	</tbody>
</table>





##<a id="config-size-and-position"></a>スケールサイズと位置の構成

### <a id="size-posotion-overview"></a>概要

スケールに沿ったディメンションの igLinearGauge コントロール内でのスケールのサイズおよび位置は、[グラフ領域](igLinearGauge-Overview.html#graph-area)に対して決定されます。これは一組のプロパティ ([scaleStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options) と [scaleEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options)) により実行されます。

![](images/igLinearGauge_Overview_5.png)

グラフ領域の他方 (スケール全域) のディメンションでのスケールの配置自体を構成できませんが、スケールを構成するすべての要素で個別に構成されます。

>**注:** 番号ラベルの配置を制御する `LabelExtent` プロパティの値は、コントロールの方向が水平の場合はコントロールの高さに対して測定され、それ以外の場合はコントロールの幅に対して測定されます。詳細は、[向きと方向の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Orientation-and-Direction.html) を参照してください。)

### <a id="size-position-settings"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。構成可能な要素の実例については、[例](#size-position-example)を参照してください。

<table cellspacing="0" cellpadding="0" class="table">
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
				要素
			</th>

			<th>
				詳細
			</th>
		</tr>

		<tr>
			<th rowspan="2">
				スケールに沿ったディメンション - サイズと位置
			</th>

			<th>
				開始位置
			</th>

			<td>
				<a id="ScaleStartExten" name="ScaleStartExten"></a>水平方向で[グラフ領域](igLinearGauge-Overview.html#graph-area)の左端からのスケールの開始位置、または垂直方向でグラフ領域の下端からのスケールの開始位置。

				(スケールの方向が反転した場合、水平方向で右端、垂直方向で上端となります。詳細は、<a class="ig-topic-link" href="igLinearGauge-Configuring-the-Orientation-and-Direction.html" data-auto-update-caption="true">向きと方向の構成 (*igLinearGauge*)</a> を参照してください。)
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">scaleStartExtent</a>
			</td>

			<td>
				方向に応じた、コントロールの高さと幅の相対部分として望ましい値。小数で指定 (例: *0.2)*
			</td>
		</tr>

		<tr>
			<th>
				終了位置
			</th>

			<td>
				<a id="ScaleEndExten" name="ScaleEndExten"></a>水平方向でコントロールの左端に対するグラフ領域の左端からのスケールの終了位置、または垂直方向ではグラフ領域の下端からのスケールの終了位置。

				(スケールの方向が反転した場合、水平方向で右端、垂直方向で上端となります。詳細は、<a class="ig-topic-link" href="igLinearGauge-Configuring-the-Orientation-and-Direction.html" data-auto-update-caption="true">向きと方向の構成 (*igLinearGauge*)</a> を参照してください。)
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">scaleEndExtent</a>
			</td>

			<td>
				方向に応じた、コントロールの高さと幅の相対部分として望ましい値。小数で指定 (例: *0.8*)
			</td>
		</tr>
	</tbody>
</table>



### <a id="size-position-example"></a>例

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
scaleStartExtent|0.2
scaleEndExtent|0.9



![](images/igLinearGauge_Configuring_the_Scale_1.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#igLinearGauge').igLinearGauge({
    width: 300,
    height: 70,
    scaleStartExtent: 0.2,
    scaleEndExtent: 0.9});
```



##<a id="range-config"></a>スケールの範囲の構成

### <a id="range-overview"></a>概要

スケールの値は、その値の範囲 (つまり最小値と最大値) を指定することで定義します。これは、[minimumValue](%%jQueryApiUrl%%/ui.igLinearGauge#options) と [minimumValue](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティで定義されます。

最小値と最大値を設定するとスケール内のすべての値が定義され、すべての値は最小値と最大値の間に均等に分布されます。ただし、表示されるにはスケールに配置された番号ラベルがある値のみです。(スケールの値は番号ラベルによってのみ表示できます。ラベルは、スケール上のラベルの位置に基づき各値を表示します。つまり、ラベルの値はスケールに沿ったラベルの配置よって構成され、明示的には設定されません。)最小値および最大値の位置にラベルは必要ではありません。これは、最小値および最大値がスケール上に表示されず、スケールが以下のように表示される可能性があることを意味します。

![](images/igLinearGauge_Configuring_the_Scale_2.png)

スケールの範囲を定義すると、比較範囲および針などの他の値ベースの視覚要素もスケール上に配置できます。前述の要素は値ベースであるため、スケールの範囲が変化 (最小値または最大値の変化、あるいはその両方の変化) すると、これらの視覚要素は、スケール上の位置が保持されたスケール値に応じて再配置されます。(この結果の実例は、[範囲設定](%%SamplesUrl%%/linear-gauge/range-settings)のサンプルを参照してください。)

### <a id="range-setting"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。
構成可能な要素の実例については、[例](#size-position-example)を参照してください。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th colspan="2">
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
			<th>
				要素
			</th>

			<th>
				詳細
			</th>
		</tr>

		<tr>
			<td>
				スケールの最小値
			</td>

			<td>
				スケールが開始する値。
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minimumValue</a>
			</td>

			<td>
				スケールのメジャーにおける任意の値
			</td>
		</tr>

		<tr>
			<td>
				スケールの最大値
			</td>

			<td>
				スケールが終了する値。
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">maximumValue</a>
			</td>

			<td>
				スケールのメジャーにおける任意の値
			</td>
		</tr>
	</tbody>
</table>


### <a id="range-example"></a>例

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
minimumValue|60
maximumValue|70



![](images/igLinearGauge_Configuring_the_Scale_3.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#igLinearGauge').igLinearGauge({
    width: 300,
    height: 70,
    minimumValue: 60,
    maximumValue: 70});
```



##<a id="major-tick-marks-config"></a>スケールの主目盛の構成

### <a id="major-ticks-overview"></a>概要

`igLinearGauge` コントロールの主目盛は、位置および表示する間隔に関してカスタマイズできます。主目盛を形成する線分の高さ、幅、および色も構成が可能です。

### <a id="major-ticks-position"></a>スケールに沿った位置、数、およびスペースの構成

主目盛は、開始点および終了点 ([グラフ領域](igLinearGauge-Overview.html#graph-area)の端からの最初と最後の目盛位置)、および表示する間隔 (各目盛間の距離) で定義します。([ticksPostInitial](%%jQueryApiUrl%%/ui.igLinearGauge#options)、[ticksPreTerminal](%%jQueryApiUrl%%/ui.igLinearGauge#options)、および [interval](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティで定義されます。)この方法で主目盛の開始点および終了点を定義すると、基本的にスケールの位置および長さを定義することになります。

![](images/igLinearGauge_Overview_7.png)

### <a id="major-ticks-length"></a>スケール全域での位置およびセグメントの長さの構成

スケール全域のディメンションでは、主目盛を形成する線分の長さと位置は[グラフ領域](igLinearGauge-Overview.html#graph-area)の端に対して構成されます。([tickStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティおよび [tickEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティによって構成されます。)

![](images/igLinearGauge_Overview_8.png)

### <a id="major-ticks-settings"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。構成可能な要素の実例については、[例](#major-ticks-exapmle)を参照してください。

<table cellspacing="0" cellpadding="0" class="table">
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
				要素
			</th>

			<th>
				詳細
			</th>
		</tr>

		<tr>
			<th rowspan="3">
				スケールに沿った位置、数、およびスペース
			</th>

			<th>
				開始点
			</th>

			<td>
				スケールの<a class="ig-topic-link" href="#size-position-settings">開始位置</a>に対して主目盛が始まる距離
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">ticksPostInitial</a></td>

			<td>
				スケールの開始位置からスケールのメジャーの任意の距離
			</td>
		</tr>

		<tr>
			<th>
				終了点
			</th>

			<td>
				スケールの<a class="ig-topic-link" href="#size-position-settings">終了位置</a>に対して主目盛が終了する距離
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">ticksPreTerminal</a></td>

			<td>
				スケールの終了位置からスケールのメジャーの任意の距離
			</td>
		</tr>

		<tr>
			<th>
				間隔
			</th>

			<td>
				主目盛を配置する間隔 (間隔は、スケールのメジャーにおける隣接する 2 つの主目盛間の距離です。)
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">interval</a>
			</td>

			<td>
				スケールのメジャーにおける任意の値
			</td>
		</tr>

		<tr>
			<th rowspan="2">スケール全域での位置およびセグメントの長さ</th>

			<th>
				開始点
			</th>

			<td>
				主目盛を形成する線分の開始点。

				(開始点は、水平方向でグラフ領域の下部に対して定義され、垂直方向でグラフ領域の左端に対して定義されます。)

				負の値もサポートされ、グラフ領域の下方 / 左側の位置に表示します。
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickStartExtent</a>
			</td>

			<td>
				方向に応じたグラフ領域の高さと幅の相対部分として、スケールのメジャーの望ましい値。小数で指定 (例: *0.2)*
			</td>
		</tr>

		<tr>
			<th>
				終了点
			</th>

			<td>
				水平方向でグラフ領域の下部から主目盛を形成する線分の終了点、または垂直方向でグラフ領域の左の境界線からの主目盛の線分の終了点。

				負の値もサポートされ、グラフ領域の下方 / 左側の位置に表示します。

				(開始点と終了点間の差が目盛の線分の長さになります。)
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickEndExtent</a>
			</td>

			<td>
				方向に応じた、グラフ領域の高さと幅の相対部分として必要な値。小数で指定 (例:  *0.8*)
			</td>
		</tr>

		<tr>
			<th rowspan="2">
				ルック アンド フィール
			</th>

			<th>
				幅
			</th>

			<td>
				主目盛の線分の幅
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickStrokeThickness</a>
			</td>

			<td>
				任意の値 (ピクセル)
			</td>
		</tr>

		<tr>
			<th>
				色
			</th>

			<td>
				主目盛の色
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">tickBrush</a>
			</td>

			<td>
				任意の色
			</td>
		</tr>
	</tbody>
</table>

### <a id="major-ticks-exapmle"></a>例

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
[interval](%%jQueryApiUrl%%/ui.igLinearGauge#options)|30
[tickBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options)|lime
[tickEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options)|0.9
[ticksPostInitial](%%jQueryApiUrl%%/ui.igLinearGauge#options)|30
[ticksPreTerminal](%%jQueryApiUrl%%/ui.igLinearGauge#options)|10
[tickStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options)|0.5
[tickStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options)|3



![](images/igLinearGauge_Configuring_the_Scale_4.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
('#igLinearGauge').igLinearGauge({
    width: 300,
    height: 70,
    interval: 30,
    tickBrush: 'lime',
    tickStartExtent: 0.5,
    tickEndExtent: 0.9,
    ticksPostInitial: 30,
    ticksPreTerminal: 10,
    tickStrokeThickness: 3 });
```



##<a id="minor-tick-marks-config"></a>スケールの補助目盛の構成

### <a id="minor-ticks-overview"></a>概要

`igLinearGauge` コントロールの補助目盛は、明示的に無効にできます。あるいは、2 つの主目盛間の番号、位置、サイズ、および色をカスタマイズできます。

### <a id="minor-ticks-position"></a>スケールに沿った位置、数、およびスペースの構成

補助目盛は、数 (隣接する 2 つの主目盛間の補助目盛の数) として定義されます。(数は [minorTickCount](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティにより定義されます。このプロパティを *0* に設定すると、補助目盛が無効 (非表示) になります。)数が設定されると、指定された数の補助目盛はスケール全体で、各隣接した 2 つの主目盛間に均等に配置されます。

### <a id="minor-ticks-length"></a>スケール全域での位置およびセグメントの長さの構成

スケール全域のディメンションでは、補助目盛の長さと位置は[グラフ領域](igLinearGauge-Overview.html#graph-area)の端に対して構成されます。

![](images/igLinearGauge_Overview_9.png)

### <a id="minor-ticks-settings"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。構成可能な要素の実例については、[例](#minor-ticks-example)を参照してください。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th colspan="4">
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
			<th colspan="3">要素</th>

			<th>詳細</th>
		</tr>

		<tr>
			<th colspan="3">番号とスペース</th>

			<td>
				隣接する 2 つの主目盛間の補助目盛の数
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickCount</a></td>

			<td>
				任意の数。*0* を設定すると補助目盛を非表示。
			</td>
		</tr>

		<tr>
			<th rowspan="4">線分</th>

			<th rowspan="2">長さと位置</th>

			<th>開始点</th>

			<td>
				補助目盛を形成する線分の開始点。

				(開始点は、水平方向で[グラフ領域](igLinearGauge-Overview.html#graph-area)の下部に対して定義され、垂直方向でグラフ領域の左端に対して定義されます。)

				負の値もサポートされ、グラフ領域の下方 / 左側の位置に表示します。
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickStartExtent</a>
			</td>

			<td>
				方向に応じた、コントロールの高さと幅の相対部分として望ましい値。小数で指定 (例: *0.2)*
			</td>
		</tr>

		<tr>
			<th>終了点</th>

			<td>
				水平方向ではグラフ領域の下部から補助目盛を形成する線分の終了点、または垂直方向でグラフ領域の左の境界線からの補助目盛の線分の終了点。

				負の値もサポートされ、グラフ領域の下方 / 左側の位置に表示します。

				(開始点と終了点間の差が目盛の線分の長さになります。)
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickEndExtent</a>
			</td>

			<td>
				方向に応じた、コントロールの高さと幅の相対部分として望ましい値。小数で指定 (例: *0.25)*
			</td>
		</tr>

		<tr>
			<th rowspan="2">ルック アンド フィール</th>

			<th>
				幅
			</th>

			<td>
				補助目盛の線分の幅
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickStrokeThickness</a>
			</td>

			<td>
				任意の値 (ピクセル)
			</td>
		</tr>

		<tr>
			<th>
				色
			</th>

			<td>
				補助目盛の色
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options" target="_blank">minorTickBrush</a>
			</td>

			<td>
				任意の色
			</td>
		</tr>
	</tbody>
</table>



### <a id="minor-ticks-example"></a>例

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。
result of the following settings:

プロパティ|値
---|---
[minorTickBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options)|Purple
[minorTickCount](%%jQueryApiUrl%%/ui.igLinearGauge#options)|4
[minorTickEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options)|0.1
[minorTickStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options)|0.05
[minorTickStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options)|2
[interval](%%jQueryApiUrl%%/ui.igLinearGauge#options)|20



![](images/igLinearGauge_Configuring_the_Scale_5.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
('#igLinearGauge').igLinearGauge({
    width: 300,
    height: 70,
    minorTickCount: 4,
    minorTickBrush: 'purple',
    minorTickStartExtent: 0.05,
    minorTickEndExtent: 0.1,
    minorTickStrokeThickness: 2,
    interval: 20});
```



##<a id="labels-config"></a>スケールのラベリングの構成

### <a id="labels-overview"></a>概要

デフォルトで、スケールのメジャーを示すラベルは有効になっています。ラベルは以下の要因で定義します。

-   開始点および終了点 - スケールの両端での最初と最後のラベルの位置
-   ラベル行の幅 - 方向 (垂直 / 水平) に応じたコントロールの高さと幅に対する幅。この幅は、適用されたスタイル テンプレートのフォント設定のみで間接的に制御できます。
-   発生する間隔 (相互距離)。([labelsPostInitial](%%jQueryApiUrl%%/ui.igLinearGauge#options)、[labelsPreTerminal](%%jQueryApiUrl%%/ui.igLinearGauge#options)、および [labelInterval](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティにより定義されます。)
-   スケール全域のディメンションでのラベル行の位置 - デフォルトで、水平に対してコントロールの下部、垂直に対して左側に設定されています。水平のスケール方向で全行は垂直に移動し、垂直のスケール方向で水平に移動することができます。([labelExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティにより定義されます。)

![](images/igLinearGauge_Overview_6.png)

各ラベルが表示する値は、スケール上の位置によって表される値で定義されます。(このためには[](#range-config)[スケールの値の範囲の構成](#range-config)が必要です。)文字列の書式はラベルに適用できるため、外観を追加でカスタマイズできます。デフォルトで、数値ラベルは各主目盛に対して表示され、ラベルはスケールの方向 (水平 / 垂直) に応じてスケールの下位 / 左側に配置されます。

ラベルと主目盛をカスタマイズする場合、相互の位置関係を確認する必要があります。位置を合わせるには、目盛の間隔 ([interval](%%jQueryApiUrl%%/ui.igLinearGauge#options) プロパティ) とラベルの間隔 (`labelInterval` プロパティ) を同じ値に設定します。(デフォルトで、`labelInterval` プロパティは設定されていませんが、interval に設定された値を使用するため、正しく位置合わせされます。)

### <a id="labels-event"></a>イベント処理

`igLinearGauge` のラベルは、対応するイベントを処理する場合に追加でフォーマットし、位置合わせすることができます。

以下の表では、任意の動作と各イベントのマップを示します。

目的:|このイベントの処理:
---|---
ラベルのフォーマット|[formatLabel](%%jQueryApiUrl%%/ui.igLinearGauge#events:formatLabel)
ラベルの位置合わせ|[alignLabel](%%jQueryApiUrl%%/ui.igLinearGauge#events:alignLabel)



### <a id="labels-settings"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。構成可能な要素の実例については、[](#horizontal-lable)[例 - 水平方向](#horizontal-lable)を参照してください。

<table cellspacing="0" cellpadding="0" class="table">
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
				要素
			</th>

			<th>
				詳細
			</th>
		</tr>

		<tr>
			<th>ラベル行</th>

			<th>
				位置
			</th>

			<td>
				垂直 / 水平方向に応じた、コントロールの下部 / 左端に対するラベル行の配置。
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:labelExtent" target="_blank">labelExtent</a>
			</td>

			<td>
				垂直 / 水平方向に応じた、コントロールの高さと幅の相対部分として望ましい値。小数で指定 (例: *0.8*)。
			</td>
		</tr>

		<tr>
			<th rowspan="3">
				番号とスペース
			</th>

			<th>
				開始点
			</th>

			<td>
				スケールに沿った最初のラベルのスケールのメジャーにおける位置
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPostInitial" target="_blank">labelsPostInitial</a>
			</td>

			<td>
				スケールの最初のラベルを表示するスケールのメジャーにおける値
			</td>
		</tr>

		<tr>
			<th>
				終了点
			</th>

			<td>
				スケールに沿った最後のラベルのスケールのメジャーにおける位置
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPreTerminal" target="_blank">labelsPreTerminal</a>
			</td>

			<td>
				スケールの最後のラベルを表示するスケールのメジャーにおける値
			</td>
		</tr>

		<tr>
			<th>
				間隔
			</th>

			<td>
				ラベルを配置する間隔 (間隔は、スケールのメジャーにおける隣接する 2 つのラベルの距離です。)
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:labelInterval" target="_blank">labelInterval</a>
			</td>

			<td>
				スケールのメジャーにおける任意の値
			</td>
		</tr>

		<tr>
			<th>
				ルック アンド フィール
			</th>

			<th>
				フォント色
			</th>

			<td>
				ラベルのフォント色
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:fontBrush" target="_blank">fontBrush</a>
			</td>

			<td>
				任意の色
			</td>
		</tr>
	</tbody>
</table>



### <a id="horizontal-lable"></a>例 - 水平方向

以下のスクリーンショットは、以下の設定の結果、デフォルトの水平方向で `igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
[labelExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelExtent)|0.75
[labelInterval](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelInterval)|30
[labelsPostInitial](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPostInitial)|20
[labelsPreTerminal](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPreTerminal)|20
[fontBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:fontBrush)|Green



![](images/igLinearGauge_Configuring_the_Scale_6.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
('#igLinearGauge').igLinearGauge({
    width: 300,
    height: 70,
    labelExtent: 0.75,
    labelInterval: 30,
    labelsPostInitial: 20,
    labelsPreTerminal: 20,
    fontBrush: 'green'
});
```

### <a id="vertical-lable"></a>例 - 垂直方向

以下のスクリーンショットは、以下のプロパティ設定の結果、([](#horizontal-lable)[例 - 水平方向](#horizontal-lable)の場合と同様に) 垂直方向で `igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
[orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation)|垂直方向
[labelExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelExtent)|0.75
[labelInterval](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelInterval)|30
[labelsPostInitial](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPostInitial)|20
[labelsPreTerminal](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPreTerminal)|20
[fontBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:fontBrush)|Green



![](images/igLinearGauge_Configuring_the_Scale_7.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
('#igLinearGauge').igLinearGauge({
    height: 300,
    width: 70,
    orientation: 'vertical',
    labelExtent: 0.75,
    labelInterval: 30,
    labelsPostInitial: 20,
    labelsPreTerminal: 20,
    fontBrush: 'green'
});
```



##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[向きと方向の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Orientation-and-Direction.html): このトピックは、垂直スケールと反転したスケール方向の両方またはいずれか一方により igLinearGauge コントロールを構成する方法を説明します。

-	[針の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Needle.html): このトピックではコード例を使用して、igLinearGauge コントロールの針を構成する方法を説明します。説明には、針が示す値、幅、位置、および書式設定が含まれます。

-	[比較範囲の構成 (igLinearGauge)](igLinearGauge-Configuring-Comparative-Ranges.html): このトピックではコード例を使用して、igLinearGauge コントロールの範囲を構成する方法を説明します。説明には、範囲の数、位置、長さ、幅、および書式設定が含まれます。

-	[背景の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Background.html): このトピックではコード例を使用して、リニア ゲージの背景を構成する方法を説明します。説明には、背景のサイズ、位置、色、および境界線の設定が含まれます。

-	[ツールチップの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Tooltips.html): このトピックではコード例を使用して、`igLinearGauge` コントロールのツールチップを有効にする方法および表示する遅延時間を設定する方法を説明します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[スケールの設定](%%SamplesUrl%%/linear-gauge/scale-settings): このサンプルでは、`igLinearGauge` コントロールのサポートされるスケール構成を紹介します。





 

 



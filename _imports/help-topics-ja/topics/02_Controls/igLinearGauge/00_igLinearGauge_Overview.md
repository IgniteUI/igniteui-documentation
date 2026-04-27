<!--
|metadata|
{
    "fileName": "iglineargauge-overview",
    "controlName": "igLinearGauge",
    "tags": ["Getting Started","How Do I"]
}
|metadata|
-->

# igLinearGauge の概要



##トピックの概要


### 目的

このトピックは、主要機能、最小要件およびユーザー機能性など、`igLinearGauge` コントロールの概念的な情報を提供します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)

-   [主要機能](#main-features)
    -   [主要機能の概要](#main-features-summary)
    -   [主要な機能の概要表](#main-features-chart)
-   [論理領域と構成可能な視覚要素の概要](#config-visual-elements-summary)
    -   [論理領域](#logical-areas)
    -   [構成可能な視覚要素](#config-visual-elements)
-   [構成可能な視覚要素および関連プロパティ](#config-visual-elements-related-prop)
    -   [構成可能な視覚要素および関連プロパティの概要](#config-visual-elements-related-prop-summary)
    -   [スケール](#scale)
    -   [針](#needle)
    -   [比較範囲](#comparative-ranges)
    -   [背景](#background-overview)
    -   [ツールチップ](#tooltip-overview)
-   [デフォルトの構成](#default-config)

-   [要件](#requirements)

-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="introduction"></a>概要


### igLinearGauge の概要

`igLinearGauge` コントロールは、データをリニア ゲージ形式で視覚化する %%ProductName%% コントロールです。スケールおよび 1 つ以上の比較範囲と比較した主要な値をシンプルで簡潔に表示します。

![](images/igLinearGauge.png)

`igLinearGauge` コントロールは、データを魅力的な表現にするための機能を提供し、複数のアプリケーションを使用するシナリオも準備されています。



##<a id="main-features"></a>主要機能


### <a id="main-features-summary"></a>主要機能の概要

`igLinearGauge` の機能には構成可能な向きや方向、視覚要素やツールチップなどがあります。このコントロールには、アニメーション化されたトランジションのサポートも組み込まれています。

### <a id="main-features-chart"></a>主要な機能の概要表

以下の表で、`igLinearGauge` コントロールの主な機能を簡単に説明します。

機能|説明
---|---
構成可能な向きと方向|`igLinearGauge` コントロールでは、スケールの向きと方向の状態を設定する API が公開され、ゲージの外観を大幅にカスタマイズすることができます。(詳細は、[向きと方向の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Orientation-and-Direction.html) のトピックを参照してください。)
構成可能な視覚要素|リニア ゲージの各[視覚要素](#config-visual-elements-related-prop)は、さまざまな形で構成できます。(詳細は、[igLinearGauge の構成可能な視覚要素と関連プロパティ](#config-visual-elements-related-prop) を参照してください。)
アニメーション化されたトランジション|`igLinearGauge` コントロールでは、[transitionDuration](%%jQueryApiUrl%%/ui.igLinearGauge#options:transitionDuration) プロパティによるアニメーションの組み込みサポートが提供されています。アニメーション結果は、コントロールの読み込みで再生し、プロパティの値が変更するときにも再生します。デフォルトで、アニメーション化されたトランジションは無効になっています。ミリ秒単位で値を設定できるコントロールの `transitionDuration` プロパティにより、ビューでコントロールをスワイプする時間枠を定義します。視覚要素は左下から右上に移動するスライド効果によって、すべて滑らかに表示されます。値を 0 に設定するとアニメーション トランジションが無効になります。アニメーション化されたトランジション効果を示すサンプルは、[アニメーション化されたトランジション](%%SamplesUrl%%/linear-gauge/animated-transitions)のサンプルを参照してください。
ツールチップのサポート|`igLinearGauge` コントロールに組み込まれたツールチップは、針を作成するための値、または異なる範囲に対応したそれぞれの値を示します。コントロールのデフォルト ルックに合わせて初期スタイル設定がされていますが、その外観はテンプレートでカスタマイズできます。デフォルトでは、ツールチップは無効になっています。(詳細は、[ツールチップの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Tooltips.html) を参照してください)


##<a id="config-visual-elements-summary"></a>論理領域と構成可能な視覚要素の概要


### <a id="logical-areas"></a>論理領域

`igLinearGauge` コントロールの表示領域は、論理的に以下の領域に分割されます: タイトル領域、予約領域、グラフ領域。

水平方向|垂直方向
---|---
![](images/igLinearGauge_Overview_1.png)|![](images/igLinearGauge_Overview_2.png)

各領域は `igLinearGauge` コントロールの一部の[視覚要素](#config-visual-elements)に関連して異なる目的があります。

-  <a id="reserved-area"></a> 予約領域 (1) - この領域は以下のように展開します。
    -   スケールに沿って － 予約領域はコントロールのいずれかの端で始まり、その他の端で終了します。
    -   スケール全域 -
        -   水平方向の向き: 予約領域はコントロールの下端で始まりゲージ スケールの下の余白まで続きます。
        -   垂直方向の向き: 予約領域はコントロールの左端で始まりゲージ スケールの左の余白まで続きます。

予約領域の主な目的は、スケールの番号ラベルに対して、水平方向にも垂直方向にも十分なスペースを与えることにあります。(方向が変化した場合、番号ラベルを表示するための各方向へのスペース要求に対応するために、予約領域はサイズを自動的に調整します。水平方向ではラベルの高さ、垂直方向では最大幅に合わせます。)これは、必ずしも番号ラベルを予約領域に配置する必要があることを意味しません。実際、ラベル行はスケール全域で、[グラフ領域](#graph-area)内のどこにでも配置できます。しかし、ラベル行を予約領域の外に配置しても、予約領域自体のスプレッドおよび位置にはまったく影響はありません。予約領域は変化せず、番号ラベルの高さと幅により (方向に従い) 決定されます。

さらに予約領域が重要なのは、内側の端がスケール全体のディメンションにおいて[グラフ領域](#graph-area)の最初の端を特定する点です。この端が、スケール全域に[視覚要素](#config-visual-elements)の一部を配置する範囲関連プロパティの参照マークの役割を果たします。(最も一般的な場合、これらのプロパティの正の値は視覚要素を[グラフ領域](#graph-area)の内部に置き、負の値は視覚要素を予約領域の内部に配置します。)

-  <a id="graph-area"></a>グラフ領域 (2) - リニア ゲージの針、目盛、範囲、およびオプションで番号ラベルを表示する領域です。ラベルを除く視覚要素の範囲関連のプロパティはすべて、その端に対して測定されます。グラフ領域は、プレースホルダーではなくコントロール内部にスケールを配置する (正確には、スケールの[視覚要素](#config-visual-elements-related-prop)を配置する) 参照フレームとして役割を果たします。

グラフ領域のスプレッド:

-   スケールに沿って － チャート領域はコントロールのいずれかの端で始まり、その他の端で終了します。スケールの開始位置および終了位置は両方とも、グラフ領域の始点側の端 (水平方向の左端または垂直方向の下端) に対して測定されます。
-   スケール全域 - グラフ領域は、予約領域の端 (水平方向でグラフ領域の下端または垂直方向でグラフ領域の左端) から開始されます。予約領域の境界線に接しているグラフ領域の端は、スケールの一部の視覚要素の範囲関連プロパティに対する、スケール全域に視覚要素を配置するための参照点としての役割を果たします。

 

### <a id="config-visual-elements"></a>構成可能な視覚要素

`igLinearGauge` コントロールは、以下の視覚要素が特徴です(下の図を参照)。

-   針 (3) - ゲージ スケールに沿って移動するホバー バー要素として表示される、コントロールの主要なインジケーター。スケールでの位置はゲージの値を表します。

-   比較範囲 (4) - 範囲は、スケール上で指定した値の領域を強調表示する視覚的な要素です。その目的は、パフォーマンス バー メジャーの質的状態を視覚で伝えると同時に、その状態をレベルとして示すことにあります。
-   目盛 (5) - 目盛は、リニア ゲージを読み取りやすくするために、目盛の間隔でスケールを分割して見せる役割を果たします。
    -   主目盛 - 主目盛は、スケールの主要な区切りとして使用されます。表示間隔、範囲、およびスタイルは、対応するプロパティを設定し制御できます。
    -   補助目盛 - 補助目盛は主目盛を補助し、スケールの数値を読み取りやすくするために追加して使用します。主目盛と同じ方法でカスタマイズできます。
-   スケール ラベル (6) - このラベルはスケールのメジャーを示します。
-   境界線 (7) - コントロールのディメンションを視覚的に区切る線です。
-   背景 (8) - 視覚要素が配置された背景のパターンおよび色を設定できます。

![](images/igLinearGauge_Overview_3.png)

-   ツールチップ - 針を作成するための値、またはそれぞれ異なる範囲に対応したそれぞれの値を示します。



##<a id="config-visual-elements-related-prop"></a>構成可能な視覚要素および関連プロパティ


### <a id="config-visual-elements-related-prop-summary"></a>構成可能な視覚要素および関連プロパティの概要

各要素は複数の項目で構成することができます。

以下の表は、`igLinearGauge` コントロールの視覚要素で構成できる項目を示します。構成できる項目の詳細は、この表の次に示す各視覚要素の説明で、図および構成するプロパティと一緒に参照できます。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th>
				視覚要素
			</th>

			<th>
				構成できる主な項目
			</th>
		</tr>

		<tr>
			<td>
				<a class="ig-topic-link" href="#scale">スケール</a>
			</td>

			<td>
				<ul>
					<li>位置</li>

					<li>目盛</li>

					<li>ラベル</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				<a class="ig-topic-link" href="#needle">針</a>
			</td>

			<td>
				<ul>
					<li>表示値</li>

					<li>幅と位置</li>

					<li>ルック アンド フィール (図形)</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				<a class="ig-topic-link" href="#comparative-ranges">比較範囲</a>
			</td>

			<td>
				<ul>
					<li>ゲージに表示する範囲の数値</li>

					<li>長さ、幅、位置</li>

					<li>ルック アンド フィール</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				<a class="ig-topic-link" href="#background-overview">背景</a>
			</td>

			<td>
				<ul>
					<li>サイズと位置</li>

					<li>ルック アンド フィール</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				<a class="ig-topic-link" href="#tooltip-overview">ツールチップ</a>
			</td>

			<td>
				<ul>
					<li>表示遅延</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>



### <a id="scale"></a>スケール

以下の図は、下の表にリストされたスケール関連の範囲を示しています。

グラフ領域内でスケールを配置する範囲|ラベルの位置を設定する範囲
---|---
![](images/igLinearGauge_Overview_5.png)|![](images/igLinearGauge_Overview_6.png)



スケールに沿って主目盛を設定する範囲|スケール全域で主目盛を設定する範囲
---|---
![](images/igLinearGauge_Overview_7.png)|![](images/igLinearGauge_Overview_8.png)



スケール全域で補助目盛を設定する範囲

![](images/igLinearGauge_Overview_9.png)



以下の表は、リニア ゲージのスケールで構成できる項目を示し、管理に使用する `igLinearGauge` プロパティにマップします。

<table class="table table-bordered">
    <thead>
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
    </thead>
    <tbody>
        <tr>
            <th rowspan="2" colspan="4">
位置
            </th>

            <td>
[scaleStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:scaleStartExtent)
            </td>
            <td>
0.05
            </td>
        </tr>
        <tr>
            <td>
[scaleEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:scaleEndExtent)
            </td>
            <td>
0.95
            </td>
        </tr>
        <tr>
            <th rowspan="2" colspan="2">
範囲と値
            </th>

            <th colspan="2">
最大値
            </th>

            <td>
[minimumValue](%%jQueryApiUrl%%/ui.igLinearGauge#options:minimumValue)
            </td>
            <td>
0
            </td>
        </tr>
        <tr>
            <th colspan="2">
最小値
            </th>

            <td>
[maximumValue](%%jQueryApiUrl%%/ui.igLinearGauge#options:maximumValue)
            </td>
            <td>
100
            </td>
        </tr>
        <tr>
            <th rowspan="12">
目盛
            </th>

            <th rowspan="7">
主目盛
            </th>

            <th rowspan="5" colspan="2">
スケール内の位置、スペースおよび長さ
            </th>

            <td>
[interval](%%jQueryApiUrl%%/ui.igLinearGauge#options:interval)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <td>
[ticksPostInitial](%%jQueryApiUrl%%/ui.igLinearGauge#options:ticksPostInitial)
            </td>
            <td>
0
            </td>
        </tr>
        <tr>
            <td>
[ticksPreTerminal](%%jQueryApiUrl%%/ui.igLinearGauge#options:ticksPreTerminal)
            </td>
            <td>
0
            </td>
        </tr>
        <tr>
            <td>
[tickStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:tickStartExtent)
            </td>
            <td>
0.02
            </td>
        </tr>
        <tr>
            <td>
[tickEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:tickEndExtent)
            </td>
            <td>
0.2
            </td>
        </tr>
        <tr>
            <th rowspan="2">
ルック アンド フィール
            </th>
            <th>
色
            </th>

            <td>
[tickBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:tickBrush)
            </td>
            <td>
デフォルトのテーマで定義済み
            </td>
        </tr>
        <tr>
            <th>
幅
            </th>

            <td>
[tickStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#optionstickStrokeThickness)
            </td>
            <td>
2.0
            </td>
        </tr>
        <tr>
            <th rowspan="5">
補助目盛
            </th>

            <th colspan="2">
隣接する 2 つの主目盛間の数値
            </th>

            <td>
[minorTickCount](%%jQueryApiUrl%%/ui.igLinearGauge#options:minorTickCount)
            </td>
            <td>
3.0
            </td>
        </tr>
        <tr>
            <th rowspan="2" colspan="2">
位置
            </th>

            <td>
[minorTickStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:minorTickStartExtent)
            </td>
            <td>
0.06
            </td>
        </tr>
        <tr>
            <td>
[minorTickEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:minorTickEndExtent)
            </td>
            <td>
0.2
            </td>
        </tr>
        <tr>
            <th rowspan="2">
ルック アンド フィール
            </th>
            <th>
色
            </th>

            <td>
[minorTickBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:minorTickBrush)
            </td>
            <td>
デフォルトのテーマで定義済み
            </td>
        </tr>
        <tr>
            <th>
幅
            </th>

            <td>
[minorTickStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options:minorTickStrokeThickness)
            </td>
            <td>
1.0
            </td>
        </tr>
        <tr>
            <th rowspan="6">
ラベル
            </th>

            <th rowspan="4" colspan="3">
位置とスペース
            </th>

            <td>
[labelExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelExtent)
            </td>
            <td>
0
            </td>
        </tr>
        <tr>
            <td>
[labelInterval](%%jQueryApiUrl%%/ui.igLinearGauge#optionslabelInterval)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <td>
[labelsPostInitial](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPostInitial)
            </td>
            <td>
0
            </td>
        </tr>
        <tr>
            <td>
[labelsPreTerminal](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelsPreTerminal)
            </td>
            <td>
0
            </td>
        </tr>
        <tr>
            <th colspan="3">
数値書式
            </th>

            <td>
[labelFormat](%%jQueryApiUrl%%/ui.igLinearGauge#options:labelFormat)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <th colspan="2">
ルック アンド フィール
            </th>
            <th>
色
            </th>

            <td>
[fontBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:fontBrush)
            </td>
            <td>
デフォルトのテーマで定義済み
            </td>
        </tr>
    </tbody>
</table>



### 関連トピック

-   [スケールの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Scale.html)

### <a id="needle"></a>針

以下の図は、下の表にリストされた針関連の範囲を示しています。

![](images/igLinearGauge_Overview_10.png)

以下の表は、リニア ゲージの針の構成できる基本項目を示し、管理に使用する `igLinearGauge` プロパティにマップします。

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
表示値
            </th>
            <td>
[value](%%jQueryApiUrl%%/ui.igLinearGauge#options:value)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <th colspan="2">
幅
            </th>
            <td>
[needleBreadth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBreadth)
            </td>
            <td>
10.0
            </td>
        </tr>
        <tr>
            <th rowspan="4">
ルック アンド フィール
            </th>
            <th>
塗りつぶし色
            </th>
            <td>
[needleBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBrush)
            </td>
            <td>
デフォルトのテーマで定義済み
            </td>
        </tr>
        <tr>
            <th>
境界線の色
            </th>
            <td>
[needleOutline](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOutline)
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
[needleStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleStrokeThickness)
            </td>
            <td>
1.0
            </td>
        </tr>
        <tr>
            <th>
図形
            </th>
            <td>
[needleShape](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape)
            </td>
            <td>
Needle
            </td>
        </tr>
    </tbody>
</table>



### 関連トピック

-   [針の構成 (*igLinearGauge*)](igLinearGauge-Configuring-the-Needle.html)

### <a id="comparative-ranges"></a>比較範囲

以下の図は、下の表にリストされた比較範囲関連の範囲を示しています。

![](images/igLinearGauge_Overview_11.png)

以下の表は、リニア ゲージの比較範囲の構成できる項目を示し、管理に使用する `igLinearGauge` プロパティにマップします。

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
ゲージに表示する範囲の数値
            </th>
            <td>
[ranges](%%jQueryApiUrl%%/ui.igLinearGauge#options:ranges)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <th rowspan="6" colspan="2">
長さ、幅、位置
            </th>
            <td>
[startValue](%%jQueryApiUrl%%/ui.igLinearGauge#options:startValue)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <td>
[endValue](%%jQueryApiUrl%%/ui.igLinearGauge#options:endValue)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <td>
[innerStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:innerStartExtent)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <td>
[innerEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:innerEndExtent)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <td>
[outerStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:outerStartExtent)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <td>
[outerEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:outerEndExtent)
            </td>
            <td>
設定されていません
            </td>
        </tr>
        <tr>
            <th rowspan="3">
ルック アンド フィール
            </th>
            <th>
塗りつぶし色
            </th>
            <td>
[brush](%%jQueryApiUrl%%/ui.igLinearGauge#options:brush)
            </td>
            <td>
デフォルトのテーマで定義済み
            </td>
        </tr>
        <tr>
            <th>
境界線の色
            </th>
            <td>
[outline](%%jQueryApiUrl%%/ui.igLinearGauge#options:outline)
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
[strokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options:strokeThickness)
            </td>
            <td>
1.0
            </td>
        </tr>
        <tr>
            <th colspan="2">
ツールチップ
            </th>
            <td>
[rangeToolTip](%%jQueryApiUrl%%/ui.igLinearGauge#options:rangeToolTip)
            </td>
            <td>
ハイフン (-) で区切られた範囲の開始値と終了値です。
            </td>
        </tr>
    </tbody>
</table>



### 関連トピック

-   [比較範囲の構成 (*igLinearGauge*)](igLinearGauge-Configuring-Comparative-Ranges.html)

### <a id="background-overview"></a>背景

以下の図は、下の表にリストされた背景関連の範囲を示しています。

![](images/igLinearGauge_Overview_12.png)

以下の表は、リニア ゲージの背景の構成できる項目を示し、管理に使用する `igLinearGauge` プロパティにマップします。

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
            <th rowspan="2" colspan="2">
スケール全域のスプレッドおよび位置
            </th>
            <td>
[backingInnerExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:backingInnerExtent)
            </td>
            <td>
0
            </td>
        </tr>
        <tr>
            <td>
[backingOuterExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:backingOuterExtent)
            </td>
            <td>
1.0
            </td>
        </tr>
        <tr>
            <th rowspan="3">
ルック アンド フィール
            </th>
            <th>
色
            </th>
            <td>
[backingBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:backingBrush)
            </td>
            <td>
デフォルトのテーマで定義済み
            </td>
        </tr>
        <tr>
            <th>
境界線の色
            </th>
            <td>
[backingOutline](%%jQueryApiUrl%%/ui.igLinearGauge#options:backingOutline)
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
[backingStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options:backingStrokeThickness)
            </td>
            <td>
2.0
            </td>
        </tr>
    </tbody>
</table>


### 関連トピック

-   [背景の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Background.html)

### <a id="tooltip-overview"></a>ツールチップ

以下の表は、ツールチップに関する `igLinearGauge` コントロールで構成できる項目と管理に使用するプロパティをマップしています。

<table class="table table-bordered">
    <thead>
        <tr>
            <th>
構成可能な項目
            </th>

            <th colspan="2">
詳細
            </th>
            <th>
プロパティ/イベント
            </th>
            <th>
デフォルト値
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>
可視性
            </th>
            <td colspan="2">
igLinearGauge コントロールのツールチップを有効または無効にできます。
            </td>
            <td>
[showToolTip](%%jQueryApiUrl%%/ui.igLinearGauge#options:showToolTip)
            </td>
            <td>
*False*
            </td>
        </tr>
        <tr>
            <th>
遅延時間
            </th>
            <td colspan="2">
視覚要素にマウスを合わせたときにツールチップが表示されるまでのタイムアウトを、ミリ秒数単位で設定します。
            </td>
            <td>
[showToolTipTimeout](%%jQueryApiUrl%%/ui.igLinearGauge#options:showToolTipTimeout)
            </td>
            <td>
*500*
            </td>
        </tr>
        <tr>
            <th rowspan="3">
値
            </th>
            <td rowspan="3">
ツールチップのプロパティでカスタムに値を設定できます。
            </td>
            <td>
[針](igLinearGauge-Configuring-the-Needle.html)
            </td>
            <td>
[needleToolTip](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleToolTip)
            </td>
            <td>
[needleName](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleName) の初期化状態による ([針のカスタム ツールチップの構成](igLinearGauge-Configuring-the-Tooltips.html#config-custom-tooltip)を参照)
            </td>
        </tr>
        <tr>
            <td>
[比較範囲](igLinearGauge-Configuring-Comparative-Ranges.html)
            </td>
            <td>
[rangeToolTip](%%jQueryApiUrl%%/ui.igLinearGauge#options:rangeToolTip)
            </td>
            <td>
ハイフン (-) で区切られた範囲の開始値と終了値です。
            </td>
        </tr>
    </tbody>
</table>



### 関連トピック

-   [ツールチップの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Tooltips.html)



##<a id="default-config"></a>デフォルトの構成

デフォルトで、`igLinearGauge` コントロールは水平方向です。スケールの範囲は、0 から 100 までです。コントロールの主目盛は 10 の間隔で表示され、主目盛間は補助目盛で 3 つに区切られています。タイトルまたはサブタイトルが表示されていない場合、背景色はライト グレーになります。境界線は、2 ピクセルのダーク グレーの線です。針または範囲が表示されていません。アニメーション化されたトランジションが無効です。

以下の図は、デフォルト設定で表示された `igLinearGauge` を示しています。

![](images/igLinearGauge_Overview_13.png)



##<a id="requirements"></a>要件

`igLinearGauge` コントロールは jQuery UI ウィジェットであるため、jQuery ライブラリと jQuery UI ライブラリに依存します。これらのリソースへの参照は、実際の jQuery または %%ProductNameMVC%% が使用されているとしても必要となります。コントロールが ASP.NET MVC のコンテクスト内で使用されている場合、`Infragistics.Web.Mvc` アセンブリが必要です。

リニア ゲージに針を表示するには、[value](%%jQueryApiUrl%%/ui.igLinearGauge#options:value) プロパティの設定が必要です。

完全な要件の一覧については、[igLinearGauge の追加](igLinearGauge-Adding.html)のトピックを参照してください。



##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[igLinearGauge の追加](igLinearGauge-Adding.html): このトピックでは、`igLinearGauge` コントロールを %%ProductName%% アプリケーションに追加する方法を説明します。

-	[igLinearGauge の構成](igLinearGauge-Configuring.html): このトピック グループは、向きや方向および視覚要素を含む `igLinearGauge` コントロールのさまざまな要素を構成する方法を説明します。

-	[jQuery および MVC API リファレンス リンク (igLinearGauge)](igLinearGauge-API-Links.html): このトピックでは、`igLinearGauge` コントロールに関連するキー クラスやプロパティに関する参考情報を提供します。

-	[既知の問題と制限 (igLinearGauge)](igLinearGauge-Known-Issues-and-Limitations.html): このトピックでは、`igLinearGauge` コントロールの既知の問題点および制限に関する情報を提供します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[基本構成](%%SamplesUrl%%/linear-gauge/basic-configuration): このサンプルでは、`igLinearGauge` コントロールのシンプルな構成を紹介します。

-	[アニメーション化されたトランジション](%%SamplesUrl%%/linear-gauge/animated-transitions): このサンプルでは、複数の `igLinearGauge` コントロールの設定間でのアニメーション化されたトランジションを紹介します。





 

 



<!--
|metadata|
{
    "fileName": "iglineargauge-configuring-the-needle",
    "controlName": "igLinearGauge",
    "tags": ["Charting","How Do I"]
}
|metadata|
-->

# 針の構成 (igLinearGauge)

##トピックの概要

### 目的

このトピックではコード例を使用して、`igLinearGauge`™ コントロールの針を構成する方法を説明します。説明には、針が示す値、幅、位置、および書式設定が含まれます。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[igLinearGauge の概要](igLinearGauge-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igLinearGauge` コントロールの概念的な情報を提供します。

-	[igLinearGauge の追加](igLinearGauge-Adding.html): このトピック グループでは、`igLinearGauge` コントロールを HTML ページと ASP.NET MVC アプリケーションに追加する方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [針を構成 - 概念的概要](#overview)
    -   [針構成の概要](#needle-config-summary)
    -   [針構成の概要表](#needle-config-chart)
    -   [プロパティ設定](#property-setting)
-   [針図形の構成](#config-needle-shape)
    -   [針図形構成の概要](#needle-config-summary)
    -   [部分毎のプロパティ サブセット](#subsets-per-part)
    -   [針図形タイプのプロパティ サブセット](#needle-shape-type)
    -   [プロパティ リファレンス](#property-reference)
-   [コード例の概要](#code-example-summary)
-   [コード例: 基本針の構成](#basic-needle)
    -   [説明](#basic-needle-description)
    -   [コード](#basic-needle-code)
-   [コード例: カスタム針の構成](#custom-needle)
    -   [説明](#custom-needle-description)
    -   [コード](#custom-needle-code)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="overview"></a>針を構成 - 概念的概要

### <a id="needle-config-summary"></a>針構成の概要

針を構成するには、針の図形、サイズ、スケールでの位置を指定します。境界線の幅、色、塗りつぶし色などの針のルック アンド フィールを構成し、ツールチップを提供することも可能です。

針の図形を指定するには、[needleShape](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape) プロパティを定義済みの針図形タイプまたはカスタム針タイプに設定します。定義済みの針図形は:

-   針
-   長方形
-   台形
-   三角形

デフォルトの針図形は、長方形の針本体と三角形のポイントを持つ針です。

![](images/igLinearGauge_Configuring_the_Needle_1.png)

カスタムな針図形タイプを指定するには、`needleShape` プロパティを Custom に設定します。

定義済みの図形をカスタマイズできます。図形をカスタマイズしないで定義済みの針図形を使用する場合、基本針を使用しています。カスタム図形を選択するか、定義済みの図形を[範囲タイプまたは幅プロパティ](#config-needle-shape)によってカスタマイズする場合、[カスタム針の構成](#custom-needle)になります。

スケールに従って、針は必ず [value](%%jQueryApiUrl%%/ui.igLinearGauge#options:value) プロパティによって指定した値に配置されます。

スケール全域のディメンションでの針位置は、[needleInnerExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent) および [needleOuterExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent) プロパティにより、グラフ領域の端に対して構成できます。針図形は [needleShape](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape) プロパティによって構成されます。針で使用する複数の定義済みの図形があります。カスタムな図形もサポートされます。

![](images/igLinearGauge_Overview_10.png)

針のルック アンド フィールは、各プロパティ ([needleBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBrush)、[needleOutline](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOutline) および [needleStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleStrokeThickness)) を使用して塗りつぶし色、境界線の色および境界線の線幅をカスタマイズできます。

### <a id="needle-config-chart"></a>針構成の概要表

以下の表で、`igLinearGauge` コントロールの針で構成できる要素を簡単に説明し、それらを管理に使用するプロパティにマップします。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th colspan="2">構成可能な要素</th>

			<th>
				詳細
			</th>

			<th>
				プロパティ
			</th>

			<th>
				デフォルト値
			</th>
		</tr>

		<tr>
			<td colspan="2">図形タイプ</td>

			<td>
				針図形を示す値
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape">needleShape</a></td>

			<td>
				Needle
			</td>
		</tr>

		<tr>
			<td colspan="2">名前</td>

			<td>
				針の名前 ([ツールチップ](igLinearGauge-Configuring-the-Tooltips.html#config-custom-tooltip)の表示用)
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleName">needleName</a></td>

			<td>
				設定されていません
			</td>
		</tr>

		<tr>
			<td colspan="2">表示する値</td>

			<td>
				針で示された値
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:value">value</a>
			</td>

			<td>
				設定されていません
			</td>
		</tr>

		<tr>
			<td rowspan="2" colspan="2">スケール全域のサイズおよび位置</td>

			<td>
				針の内部端の位置
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent">needleInnerExtent</a></td>

			<td>
				デフォルトのテーマで定義済み
			</td>
		</tr>

		<tr>
			<td>
				針の外部端の位置
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent">needleOuterExtent</a></td>

			<td>
				デフォルトのテーマで定義済み
			</td>
		</tr>

		<tr>
			<td rowspan="3">ルック アンド フィール</td>

			<td>
				バーの塗りつぶし色
			</td>

			<td></td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBrush">needleBrush</a></td>

			<td>
				デフォルトのテーマで定義済み
			</td>
		</tr>

		<tr>
			<td>
				針の境界線の幅
			</td>

			<td>
				ピクセル単位
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleStrokeThickness">needleStrokeThickness</a></td>

			<td>
				1.0
			</td>
		</tr>

		<tr>
			<td>
				針の境界線の色
			</td>

			<td></td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOutline">needleOutline</a></td>

			<td>
				デフォルトのテーマで定義済み
			</td>
		</tr>

		<tr>
			<td colspan="2">
				ツールチップ
			</td>

			<td>
				針のツールチップの内容
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleToolTip">needleToolTip</a></td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleName">needleName</a> の初期化状態による</td>
		</tr>
	</tbody>
</table>



>**注:** `tooltip` の構成の詳細は、[ツールチップの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Tooltips.html#config-custom-tooltip)のトピックの[針のカスタム ツールチップの構成](igLinearGauge-Configuring-the-Tooltips.html)を参照してください。

### <a id="property-setting"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th colspan="2">
				構成の目的:
			</th>

			<th>
				使用するプロパティ:
			</th>

			<th>
				設定の選択肢:
			</th>
		</tr>

		<tr>
			<td colspan="2">図形タイプ</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape">needleShape</a></td>

			<td>
				定義済みの図形または「Custom」
			</td>
		</tr>

		<tr>
			<td colspan="2">
				名前
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options">NeedleName</a></td>

			<td>
				針の名前を表す文字列
			</td>
		</tr>

		<tr>
			<td colspan="2">
				<a name="_Hlk363234548"></a>表示する値
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:value">value</a>
			</td>

			<td>
				スケールのメジャーにおける任意の値
			</td>
		</tr>

		<tr>
			<td rowspan="2" colspan="2">
				スケール全域のサイズおよび位置
			</td>

			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent">needleInnerExtent</a>
			</td>

			<td>
				方向に応じた[グラフ領域](igLinearGauge-Overview.html#graph-area)の高さと幅の相対部分として定義した針の内部端の位置。小数で指定されます (例: 0.2)。
			</td>
		</tr>

		<tr>
			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent">needleOuterExtent</a>
			</td>

			<td>
				方向に応じた[チャート領域](igLinearGauge-Overview.html#graph-area)の高さと幅の相対部分として定義した針の外部端の位置。小数で指定されます (例: 0.2)。
			</td>
		</tr>

		<tr>
			<td rowspan="3">
				ルック アンド フィール
			</td>

			<td>
				塗りつぶし色
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBrush">needleBrush</a></td>

			<td>
				任意の色
			</td>
		</tr>

		<tr>
			<td>
				境界線の線幅
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleStrokeThickness">needleStrokeThickness</a></td>

			<td>
				任意の値 (ピクセル)
			</td>
		</tr>

		<tr>
			<td>
				境界線の色
			</td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOutline">needleOutline</a></td>

			<td>
				任意の色
			</td>
		</tr>

		<tr>
			<td>ツールチップ</td>

			<td></td>

			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleToolTip">needleToolTip</a></td>

			<td>
				任意のテンプレート。(<a href="igLinearGauge-Configuring-the-Tooltips.html" data-auto-update-caption="true">ツールチップの構成 (igLinearGauge)</a>を参照)
			</td>
		</tr>
	</tbody>
</table>




##<a id="config-needle-shape"></a>針図形の構成

### <a id="needle-config-summary"></a>針図形構成の概要

定義済みの図形またはカスタムな図形の針図形を構成できます。カスタムな図形の場合、新しい針図形を作成する必要があります。

針図形を構成するには、幅と範囲を制御するプロパティを設定します。このプロパティは、針図形の 3 つの基本部分を定義します。基本部分 (垂直方向に上から下) は:

-   Outer 部分 - 針のスケールから一番遠い部分。
-   Middle 部分 - 外部分および 内部分の間にある部分。[幅に関連するプロパティ](#config-needle-shape)は 2 つのセグメントと共有されます。
-   Inner 部分 - 針のスケールに一番近い部分。

以下の画像は、水平方向が使用される場合、針図形に関連するプロパティを表示します。プロパティの詳細については、[プロパティ リファレンス](#property-reference)を参照してください。

![](images/igLinearGauge_Configuring_the_Needle_2.png)

### プロパティ カテゴリ

針を構成するプロパティは、針の幅またはスケールからの範囲を構成するかどうかに基づいて 2 つのタイプがあります。

-   範囲タイプ プロパティ ([needleInnerExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent)、[needleInnerPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointExtent)、[needleOuterPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointExtent)、[needleOuterExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent))

[チャート領域](igLinearGauge-Overview.html#graph-area)の内部端に相対してスケール ディメンションで針の図形と位置を構成します。値は、スケール ディメンションでチャート領域の範囲の相対部分を表します。小数で指定されます (0.2 など)。0 はチャート領域の内部端で、1 は外部端です。

-   幅に関連するプロパティ ([needleInnerBaseWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerBaseWidth)、[needleOuterBaseWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterBaseWidth)、[needleInnerPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointWidth)、[needleOuterPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointWidth))[needleBreadth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBreadth) プロパティに設定される基本値の相対する部分として定義される設定を示します。相対する部分は小数で指定されます。たとえば、[needleBreadth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBreadth) が 20 に設定され、needleOuterBaseWidth が 0.5 に設定される場合、外部の基本セグメントの実際のサイズは 10 ピクセル (20 x 0.5 = 10) になります。

###プロパティ サブセット 

カスタム図形を構成する ([needleShape](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape) プロパティが Custom の) 場合、すべてのプロパティが適用されます。定義済み図形タイプの場合、この図形の描画が 3 つの基本図形をすべて使用しないため、この幅と範囲のサブセットのみを適用します。

### <a id="subsets-per-part"></a>部分毎のプロパティ サブセット

以下のリストは、カスタム針の基本部分を構成するために必要なプロパティです。

-   Outer 部分のプロパティ:
    -   [needleOuterExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent)
    -   [needleOuterPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointExtent) - Outer および Middle の基本部分の共有設定
    -   [needleOuterBaseWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterBaseWidth)
    -   [needleOuterPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointWidth) - Outer および Middle の基本部分の共有設定
-   Middle 部分のプロパティ:
    -   [needleOuterPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointExtent) - Outer および Middle の基本部分の共有設定
    -   [needleInnerPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointExtent) - Inner および Middle の基本部分の共有設定
    -   [needleOuterPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointWidth) - Outer および Middle の基本部分の共有設定
    -   [needleInnerPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointWidth) - Inner および Middle の基本部分の共有設定
-   Inner 部分のプロパティ:
    -   [needleInnerPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointExtent) - Inner および Middle の基本部分の共有設定
    -   [needleInnerExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent)
    -   [needleInnerPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointWidth) - Inner および Middle の基本部分の共有設定
    -   [needleInnerBaseWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerBaseWidth)

### <a id="needle-shape-type"></a>針図形タイプのプロパティ サブセット

以下の表では、特定の針図形タイプをカスタマイズする場合に設定する図形構成プロパティを表示します。プロパティおよびその設定の詳細については、[プロパティ リファレンス](#property-reference)を参照してください。

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th>
				針図形タイプ
			</th>

			<th>
				プロパティ
			</th>
		</tr>

		<tr>
			<td>カスタム</td>

			<td>
				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBreadth">needleBreadth</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerBaseWidth">needleInnerBaseWidth</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent">needleInnerExtent</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointExtent">needleInnerPointExtent</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointWidth">needleInnerPointWidth</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterBaseWidth">needleOuterBaseWidth</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent">needleOuterExtent</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointExtent">needleOuterPointExtent</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointWidth">needleOuterPointWidth</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>針</td>

			<td>
				<ul>
					<li>needleBreadth</li>

					<li>needleInnerExtent</li>

					<li>needleInnerPointExtent</li>

					<li>needleInnerPointWidth</li>

					<li>needleOuterBaseWidth</li>

					<li>needleOuterExtent</li>

					<li>needleOuterPointWidth</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>長方形</td>

			<td>
				<ul>
					<li>needleBreadth</li>

					<li>needleInnerBaseWidth</li>

					<li>needleInnerExtent</li>

					<li>needleOuterBaseWidth</li>

					<li>needleOuterExtent</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>台形</td>

			<td>
				<ul>
					<li>needleBreadth</li>

					<li>needleInnerBaseWidth</li>

					<li>needleInnerExtent</li>

					<li>needleOuterBaseWidth</li>

					<li>needleOuterExtent</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>三角形</td>

			<td>
				<ul>
					<li>needleBreadth</li>

					<li>needleInnerExtent</li>

					<li>needleOuterBaseWidth</li>

					<li>needleOuterExtent</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>



### <a id="property-reference"></a>プロパティ リファレンス

以下の表は、針図形を構成するプロパティを説明し、適用する図形タイプおよび部分にマップします。プロパティはアルファベット順に紹介します。(プロパティの意味の画像については、[針図形構成の概要](#needle-config-summary)を参照してください。)

<table cellspacing="0" cellpadding="0" class="table">
	<tbody>
		<tr>
			<th>
				プロパティ
			</th>

			<th>
				部分
			</th>

			<th>
				詳細
			</th>

			<th>
				適用する NeedleShape の設定
			</th>
		</tr>

		<tr>
			<td>
				<a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBreadth">needleBreadth</a>

				
			</td>

			<td>
				すべて
			</td>

			<td>
				幅に関連するプロパティを定義するために使用される基本幅 (ピクセル単位)。有効な値は 0 より大きいの数値です。大きい値の場合、針は非常に大きくなります。
			</td>

			<td>
				<ul>
					<li>“custom”</li>

					<li>“needle”</li>

					<li>“rectangle”</li>

					<li>“trapezoid”</li>

					<li>“triangle”</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerBaseWidth">needleInnerBaseWidth</a></td>

			<td>
				Inner
			</td>

			<td>
				針の内部端の Inner 基本セグメントの幅。
			</td>

			<td>
				<ul>
					<li>“custom’</li>

					<li>“rectangle”</li>

					<li>“trapezoid”</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent">needleInnerExtent</a></td>

			<td>
				Inner
			</td>

			<td>
				方向に応じた[]チャート領域(igLinearGauge-Overview.html#graph-area)の高さと幅の相対部分として定義した内部基本セグメントの内部端の位置。小数で指定されます (例: 0.2)。

				needleInnerPointExtent プロパティと内部分のスケールの範囲および位置を指定します。
			</td>

			<td>
				<ul>
					<li>“custom”</li>

					<li>“needle”</li>

					<li>“rectangle”</li>

					<li>“trapezoid”</li>

					<li>“triangle”</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointExtent">needleInnerPointExtent</a></td>

			<td>
				Inner/Middle
			</td>

			<td>
				以下の要素のスケール位置:

				<ul>
					<li>Inner 部分の外部端</li>

					<li>Middle 部分の内部端</li>
				</ul>

				位置はチャート領域の幅の相対部分として定義されます。小数で指定 (例: 0.2)

				needleInnerExtent プロパティと Inner 部分のスケールの範囲および位置を指定します。

				needleOuterPointExtent プロパティと Middle 部分のスケールの範囲および位置を指定します。方向に応じたチャート領域の高さと幅の相対部分として定義した針 (ポイント) の内部ポイントの位置。小数で指定されます (例: 0.2)。
			</td>

			<td>
				<ul>
					<li>“custom”</li>

					<li>“needle”</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointWidth">needleInnerPointWidth</a></td>

			<td>
				Inner/

				Middle
			</td>

			<td>
				以下の要素の幅:

				<ul>
					<li>針の Inner 部分の外部端</li>

					<li>Middle 部分の内部端</li>
				</ul>
			</td>

			<td>
				<ul>
					<li>“custom”</li>

					<li>“needle”</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterBaseWidth">needleOuterBaseWidth</a></td>

			<td>
				Outer
			</td>

			<td>
				Outer 部分の外部端の幅。
			</td>

			<td>
				<ul>
					<li>“custom”</li>

					<li>“needle”</li>

					<li>“rectangle”</li>

					<li>“trapezoid”</li>

					<li>“triangle”</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent">needleOuterExtent</a></td>

			<td>
				Inner
			</td>

			<td>
				方向に応じたチャート領域の高さと幅の相対部分として定義した外部基本セグメントの位置。小数で指定されます (例: 0.2)。

				チャート領域の幅の相対部分として定義した Outer 部分の外部端の位置。小数で指定されます (例: 0.2)。needleOuterPointExtent プロパティと内部分のスケールの範囲および位置を指定します。
			</td>

			<td>
				<ul>
					<li>“custom”</li>

					<li>“needle”</li>

					<li>“rectangle”</li>

					<li>“trapezoid”</li>

					<li>“triangle</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointExtent">needleOuterPointExtent</a></td>

			<td>
				Outer/Middle
			</td>

			<td>
				以下の要素のスケール位置:

				<ul>
					<li>Middle 部分の外部端</li>

					<li>Outer 部分の内部端</li>
				</ul>

				位置はチャート領域の幅の相対部分として定義されます。小数で指定 (例: 0.2)

				needleInnerPointExtent プロパティと Middle 部分のスケールの範囲および位置を指定します。

				needleOuterExtent プロパティと Outer 部分のスケールの範囲および位置を指定します。方向に応じたチャート領域の高さと幅の相対部分として定義した Middle 部分の外部端の位置。小数で指定されます (例: 0.2)。
			</td>

			<td>
				“custom”
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointWidth">needleOuterPointWidth</a></td>

			<td>
				Outer/Middle
			</td>

			<td>
				以下の要素の幅:

				<ul>
					<li>Middle 部分の外部端</li>

					<li>Outer 部分の内部端</li>
				</ul>
			</td>

			<td>
				<ul>
					<li>“custom”</li>

					<li>“needle”</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td><a href="%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape">needleShape</a></td>

			<td>
				図形タイプに基づきます。
			</td>

			<td>
				針の図形デフォルトの値は “Needle” です。長方形の針本体と三角形のポイントを定義します。有効な設定は以下のとおりです。

				<ul>
					<li>“Custom”</li>

					<li>“Needle” (default)</li>

					<li>“Rectangle”</li>

					<li>“Trapezoid”</li>

					<li>“Triangle”</li>
				</ul>
			</td>

			<td>
				needleShape プロパティに適用できません。
			</td>
		</tr>
	</tbody>
</table>


##<a id="code-example-summary"></a>コード例の概要


以下の表は、このトピックで使用したコード例をまとめたものです。

例|説明
---|---
[基本針の構成](#basic-needle)|この例は、カスタム ルック アンド フィール (3 ピクセル幅の茶色の境界線、オレンジの塗りつぶし) でデフォルトの針を設定する方法を紹介します。
[カスタム針の構成](#custom-needle)|この例は、カスタムなチョウ図形の針を定義する方法を紹介します。


##<a id="basic-needle"></a>コード例: 基本針の構成

### <a id="basic-needle-description"></a>説明

この例は、カスタム ルック アンド フィール (3 ピクセル幅の茶色の境界線、オレンジの塗りつぶし) でデフォルトの針を設定する方法を紹介します。

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
[value](%%jQueryApiUrl%%/ui.igLinearGauge#options:value)|“85”
[needleBrush](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBrush)|“orange”
[needleOutline](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOutline)|“brown”
[needleStrokeThickness](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleStrokeThickness)|“3”


![](images/igLinearGauge_Configuring_the_Needle_3.png)

### <a id="basic-needle-code"></a>コード

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$("#lineargauge").igLinearGauge({
    height:"70px",
    width:"300px",
    value: 85,
    needleBrush: "orange",
    needleOutline: "brown",
    needleStrokeThickness: 3
});
```



##<a id="custom-needle"></a>コード例: カスタム針の構成

### <a id="custom-needle-description"></a>説明

以下のスクリーンショットは、以下の設定の結果、カスタムなチョウ形の針を定義したことを示しています。

プロパティ|値
---|---
[needleShape](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleShape)|*custom*
[needleBreadth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleBreadth)|*50*
[needleInnerBaseWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerBaseWidth)|*0*
[needleInnerPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointWidth)|*0.3*
[needleOuterPointWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointWidth)|*0.35*
[needleOuterBaseWidth](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterBaseWidth)|*0.1*
[needleInnerExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerExtent)|*0.4*
[needleInnerPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleInnerPointExtent)|*0.1*
[needleOuterPointExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterPointExtent)|*0.9*
[needleOuterExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleOuterExtent)|*0.6*


![](images/igLinearGauge_Configuring_the_Needle_4.png)


###<a id="custom-needle-code"></a> コード

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$("#lineargauge").igLinearGauge({
    height:"70px",
    width:"300px",
    value: 50,
    needleShape: "custom",
    needleInnerExtent: .4,
    needleOuterExtent: .6,
    needleInnerPointExtent: 0.1,
    needleOuterPointExtent: .9,
    needleInnerBaseWidth: 0,
    needleOuterBaseWidth: .1,
    needleInnerPointWidth: .3,
    needleOuterPointWidth: .35
});
```



##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[スケールの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Scale.html): このトピックではコード例を使用して、`igLinearGauge` コントロールのスケールを構成する方法を説明します。説明には、コントロール内のスケールの配置、スケールの目盛およびラベルの構成が含まれます。

-	[針の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Needle.html): このトピックではコード例を使用して、`igLinearGauge` コントロールの針を構成する方法を説明します。説明には、針の値、幅、および書式設定が含まれます。

-	[比較範囲の構成 (igLinearGauge)](igLinearGauge-Configuring-Comparative-Ranges.html): このトピックではコード例を使用して、`igLinearGauge` コントロールの範囲を構成する方法を説明します。説明には、範囲の数、位置、長さ、幅、および書式設定が含まれます。

-	[背景の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Background.html): このトピックではコード例を使用して、リニア ゲージの背景を構成する方法を説明します。説明には、背景のサイズ、位置、色、および境界線の設定が含まれます。

-	[ツールチップの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Tooltips.html): このトピックではコード例を使用して、`igLinearGauge` コントロールのツールチップを有効にする方法および表示する遅延時間を設定する方法を説明します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[針の設定](%%SamplesUrl%%/linear-gauge/needle-settings): このサンプルでは、定義済み図形を使用するか、カスタム図形を作成すると、値針を構成する方法を紹介します。





 

 



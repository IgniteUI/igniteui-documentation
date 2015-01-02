<!--
|metadata|
{
    "fileName": "igchart-transitions-in-animations",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# トランジション イン アニメーション



##トピックの概要


### 目的

このトピックは、`igDataChart`™ コントロールのトランジション アニメーション機能およびサポートされるシリーズのリストについての情報を提供します。

### 前提条件

このトピックを理解するためには、以下のトピックを理解しておく必要があります:

-	[igDataChart の追加](igDataChart-Adding.html)

このトピックでは、`igDataChart`™ コントロールをページに追加し、データにバインドする方法を紹介します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
    -   [概要](#overview)
    -   [サポートされるシリーズ](#supported-series)
    -   [サポートされるトランジションのタイプ](#supported-transition-types)
    -   [サポートされるトランジションのスピード タイプ](#supported-transition-speed-types)
    -   [サポートされるイージング関数のタイプ](#supported-easing-function-types)
-   [トランジション イン アニメーションを構成する](#transition-in-animations)
    -   [概要](#transition-overview)
    -   [例](#transition-example)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="introduction"></a>概要


###<a id="overview"></a> 概要

この機能は、新しいデータ ソースを読み込むときにシリーズをアニメーション化することを許可します。利用可能なアニメーションは、シリーズのタイプに基づきます。たとえば、`columnSeries` は x 軸を上に上昇させるとアニメーションを再生します。`lineSeries` は y 軸から描画するとアニメーションを再生します。シリーズのアニメーションについて、[トランジション アニメーション](%%SamplesUrl%%/data-chart/transition-animation)および[トランジション アニメーション (財務)](%%SamplesUrl%%/data-chart/transition-animation-financial) サンプルを参照してください。

`isTransitionInEnabled` プロパティを `true` に設定すると、アニメーション化されたトランジションを有効にします。

デフォルトで、アニメーション化されたトランジションは無効になっています。

アニメーション化されたトランジションのトランジション タイプ、データ ポイントに相対するスピード、およびイージング関数によって管理されるイージング トランジションを構成できます。

###<a id="supported-series"></a> サポートされるシリーズ

以下のシリーズ タイプはトランジション アニメーション機能をサポートします:

-   カテゴリ シリーズ
-   範囲カテゴリ シリーズ
-   財務物価シリーズ
-   財務指標

###<a id="supported-transition-types"></a> サポートされるトランジションのタイプ

移動および方向に基づいて複数のアニメーション トランジションのタイプがサポートされます。

-   `fromZero` - シリーズが数値軸の参照値からトランジションします。
-   アコーディオン型のトランジション:
    -   側面から:
        -   `accordionFromLeft` – シリーズは左側からアコーディオンします。
        -   `accordionFromRight` – シリーズは右側からアコーディオンします。
        -   `accordionFromTop` – シリーズは上側からアコーディオンします。
        -   `accordionFromBottom` – シリーズは下側からアコーディオンします。
    -   軸から:
        -   `accordionFromCategoryAxisMinimum` – シリーズはカテゴリ軸の最小値からアコーディオンします。
        -   `accordionFromCategoryAxisMaximum` – シリーズはカテゴリ軸の最大値からアコーディオンします。
        -   `accordionFromValueAxisMaximum` – シリーズは値軸の最大値からアコーディオンします。
        -   `accordionFromValueAxisMinimum` – シリーズは値軸の最小値からアコーディオンします。
-   `expand` – シリーズは値の中点から展開します。
-   スイープ型のトランジション:
    -   側面から:
        -   `sweepFromLeft` – シリーズは左側からスイープします。
        -   `sweepFromRight` – シリーズは右側からスイープします。
        -   `sweepFromTop` – シリーズは上側からスイープします。
        -   `sweepFromBottom` – シリーズは下側からスイープします。
        -   `sweepFromCenter` – シリーズは中央からスイープします。
    -   軸から:
        -   `sweepFromCategoryAxisMaximum` – シリーズはカテゴリ軸の最大値からスイープします。
        -   `sweepFromCategoryAxisMinimum` – シリーズはカテゴリ軸の最小値からスイープします。
        -   `sweepFromValueAxisMaximum` – シリーズは値軸の最大値からスイープします。
        -   `sweepFromValueAxisMinimum` – シリーズは値軸の最小値からスイープします。

###<a id="supported-transition-speed-types"></a> サポートされるトランジションのスピード タイプ

トランジションのスピード タイプは、アニメーション化されたトランジションが再生されているときに、現在シリーズの項目に相対するスピードを決定します。以下のはスピード タイプです:

-   `auto` – 自動的にスピード タイプを選択します。
-   `indexScaled` – データ ポイントのインデックスが軸基点から離れるほど、ポイントへの到着は遅くなります。
-   `normal` – すべてのスピードは標準です。データ ポイントが同時に表示されます。
-   `random` – データ ポイントは時間的にランダムに表示されます。
-   `valueScaled` – データ ポイントの値が開始ポイントから離れるほど、ポイントへの到着が遅くなります。

###<a id="supported-easing-function-types"></a> サポートされるイージング関数のタイプ

イージング関数は、アニメーションのイーズ インする方法を決定します。イージング関数を適用できます。デフォルト値は `cubicEase` です。



##<a id="transition-in-animations"></a>トランジション イン アニメーションを構成する


###<a id="transition-overview"></a> 概要

トランジション タイプは、`transitionInMode` プロパティを任意のトランジション名に設定すると構成されます。プロパティを "auto" (デフォルト値) に設定すると、シリーズ タイプに基づきトランジション タイプを自動的に選択することもできます。

###<a id="transition-example"></a> 例

以下の例では、以下の設定の結果、トランジション イン アニメーションが有効になり、シリーズ列を右側からアコーディオンできる方法を示します。

<table class="table">
	<thead>
		<tr>
			<th>プロパティ</th>
			<th>値</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>isTransitionInEnabled</td>
			<td>“true”</td>
		</tr>
		<tr>
			<td>transitionInSpeedType</td>
			<td>“indexScaled”</td>
		</tr>
		<tr>
			<td>transitionInEasingFunction</td>
			<td>“cubicEase”</td>
		</tr>
		<tr>
			<td>transitionInMode</td>
			<td>“accordionFromRight”</td>
		</tr>
	</tbody>
</table>

以下のコードはこの例を実装します。

**HTML の場合:**

```
$("#chart").igDataChart({
   ...
   ...
   series: [
      {
         name: "2005Population",
         type: "column",
         title: "2005",
         xAxis: "NameAxis",
         yAxis: "PopulationAxis",
         valueMemberPath: "Pop2005",
         isTransitionInEnabled: true,
         transitionInSpeed: "indexSpeed"
      }
   ]
});
```

 



##<a id="related-content"></a>関連コンテンツ


###<a id="topics"></a> トピック

以下のトピックでは、このトピックに関連する追加情報を提供しています。

-	[igDataChart の追加](igDataChart-Adding.html)

このトピックでは、`igDataChart`™ コントロールをページに追加する方法を紹介します。
and bind it to data.



###<a id="samples"></a> サンプル
このトピックについては、以下のサンプルも参照してください。


-	[トランジション アニメーション](%%SamplesUrl%%/data-chart/transition-animation): このサンプルは、チャートの初期化で再生するアニメーション機能を紹介します。

-	[トランジション アニメーション (財務)](%%SamplesUrl%%/data-chart/transition-animation-financial): このサンプルは、財務チャートの初期化で表示されるアニメーション機能を紹介します。





 

 



<!--
|metadata|
{
    "fileName": "iglineargauge-configuring-the-tooltips",
    "controlName": "igLinearGauge",
    "tags": ["Charting","How Do I"]
}
|metadata|
-->

# ツールチップの構成 (igLinearGauge)



##トピックの概要


### 目的

このトピックではコード例を使用して、`igLinearGauge`™ コントロールのツールチップを有効にする方法および表示する遅延時間を設定する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[igLinearGauge の概要](igLinearGauge-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igLinearGauge` コントロールの概念的な情報を提供します。

-	[igLinearGauge の追加](igLinearGauge-Adding.html): このトピック グループでは、`igLinearGauge`™ コントロールを HTML ページと ASP.NET MVC アプリケーションに追加する方法を示します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
    -   [ツールチップ構成の概要](#tooltip-summary)
    -   [ツールチップ構成の概要表](#tooltip-summary-chart)
-   [**ツールチップの有効 / 無効**](#enable-disable-tooltips)
    -   [概要](#enable-disable-overview)
    -   [プロパティ設定](#enable-disable-settings)
    -   [コード例](#enable-disable-example)
-   [**ツールチップ遅延の構成**](#config-tooltip-delay)
    -   [概要](#delay-overview)
    -   [プロパティ設定](#delay-settings)
    -   [コード例](#delay-example)
-   [**カスタム ツールチップの針の構成**](#config-custom-tooltip)
    -   [概要](#custom-tooltip-overview)
    -   [プロパティ設定](#custom-tooltip-settings)
    -   [例](#custom-tooltip-example)
-   [**比較範囲のカスタム ツールチップの構成**](#comparative-ranges)
    -   [概要](#comparative-ranges-overview)
    -   [プロパティ設定](#comparative-ranges-settings)
    -   [例](#comparative-ranges-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)



##<a id="introduction"></a>概要


### <a id="tooltip-summary"></a>ツールチップ構成の概要

`igLinearGauge` コントロールは、ツールチップをサポートします。ツールチップは、針や比較範囲で示される値を表示するように、あらかじめ設定されています。各視覚要素に対応するツールチップは、プロパティ設定で個別に設定されています。

ツールチップの可視性 (有効 / 無効)、遅延 (ツールチップが表示されるまでのタイムアウト値が設定可能です)、値について、それぞれ設定できます。ツールチップの値はカスタム テンプレートに設定できるため、具体的なユース ケースをより詳細に示すことができます。

デフォルトでは、ツールチップは無効になっています。

### <a id="tooltip-summary-chart"></a>ツールチップ構成の概要表

以下の表は、ツールチップに関する `igLinearGauge` コントロールで構成できる項目と管理に使用するプロパティをマップしています。

<table cellspacing="0" cellpadding="0" class="table">
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
[可視性](#enable-disable-tooltips)
			</th>
            <td colspan="2">
igLinearGauge コントロールのツールチップを有効または無効にできます。
			</td>
            <td>
[showToolTip](%%jQueryApiUrl%%/ui.igLinearGauge#options:showToolTip)
			</td>
            <td>
False
			</td>
        </tr>
        <tr>
            <th>
[Delay](#config-tooltip-delay)
			</th>
            <td colspan="2">
視覚要素にマウスを合わせたときにツールチップが表示されるまでのタイムアウトを、ミリ秒数単位で設定します。
			</td>
            <td>
[showToolTipTimeout](%%jQueryApiUrl%%/ui.igLinearGauge#options:showToolTipTimeout)
			</td>
            <td>
500
			</td>
        </tr>
        <tr>
            <th rowspan="3">
値
			</th>
            <td rowspan="3">
ツールチップ テンプレートのそれぞれのプロパティにカスタム値を設定できます。
			</td>
            <td>
[針](#config-custom-tooltip)
			</td>
            <td>
[needleToolTipTemplate](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleToolTipTemplate)
			</td>
            <td>
[needleName](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleName) の初期化状態による ([針のカスタム ツールチップの構成](#config-custom-tooltip)を参照)
			</td>
        </tr>
        <tr>
            <td>
[比較範囲](#comparative-ranges)
			</td>
            <td>
[rangeToolTipTemplate](%%jQueryApiUrl%%/ui.igLinearGauge#options:rangeToolTipTemplate)
			</td>
            <td>
ハイフン (-) で区切られた範囲の開始値と終了値です。
			</td>
        </tr>
    </tbody>
</table>



>**注: **デフォルトのツールチップ テンプレートを変更して、それぞれの視覚要素に異なる値をバインドするには、テンプレートの `${Item.Property}` 構文を使用する必要があります。



##<a id="enable-disable-tooltips"></a>ツールチップの有効 / 無効


### <a id="enable-disable-overview"></a>概要

`igLinearGauge` のツールチップを、表示または非表示 (デフォルト設定) にします。

### <a id="enable-disable-settings"></a>プロパティ設定

以下の表は、要求ビヘイビアーをプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
ツールチップの表示|[showToolTip](%%jQueryApiUrl%%/ui.igLinearGauge#options;showToolTip)|true
ツールチップの非表示|[showToolTip](%%jQueryApiUrl%%/ui.igLinearGauge#options:showToolTip)|false


### <a id="enable-disable-example"></a>コード例

以下のコード例はツールチップを表示します:

**JavaScript の場合:**

```js
$("#lineargauge").igLinearGauge({
    …
    showToolTip: true
});
```



##<a id="config-tooltip-delay"></a>ツールチップ遅延の構成


### <a id="delay-overview"></a>概要

視覚要素がホバーされてからマウスツールチップが表示されるまでの遅延を設定できます。デフォルト値は 500 ミリ秒です。

### <a id="delay-settings"></a>プロパティ設定

以下の表は、要求ビヘイビアーをプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
ツールチップが表示される前の初期遅延の設定|[showToolTipTimeout](%%jQueryApiUrl%%/ui.igLinearGauge#options:showToolTipTimeout)|任意の値 (ミリ秒)



### <a id="delay-example"></a>コード例

以下のコード例では、ツールチップの遅延として 2000 ミリ秒を設定します:

**JavaScript の場合:**

```js
$("#lineargauge").igLinearGauge({
    …
    showToolTip: true,
    showToolTipTimeout: 2000
});
```



##<a id="config-custom-tooltip"></a>カスタム ツールチップの針の構成


### <a id="custom-tooltip-overview"></a>概要

ツールチップの既定値は、[needleName](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleName) プロパティが初期化されているかどうかにより事前に設定されます。

`needleName` プロパティが初期化されている場合は、ツールチップ プロパティのデフォルト書式は以下のようになります。

    <needleName> : <value>

`needleName` プロパティが初期化されていない場合は、ツールチップのデフォルト書式は次のようになります。

    <value>

ツールチップで表示されるデータとそのルック アンド フィールの両方またはいずれか一方を変更するには、カスタム テンプレートで設定します。

### <a id="custom-tooltip-settings"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
針のカスタム ツールチップの設定|[needleToolTipTemplate](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleToolTipTemplate)|必要なテンプレートの ID。



### <a id="custom-tooltip-example"></a>例

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の針のツールチップの外観がどのようになるか示しています。

-	プロパティ: [needleToolTipTemplate](%%jQueryApiUrl%%/ui.igLinearGauge#options:needleToolTipTemplate)

-	値:

	**HTML の場合:**

	```html
	<script id="needleToolTipTemplate" type="text/x-jquery-tmpl">
	    <span style="background: green; border:black solid 2px; color:white">Current: ${item.value}</span>
	</script>
	```



![](images/igLinearGauge_Configuring_the_Tooltips_1.png)

以下のコードはこの例を実装します。

**HTML の場合:**

```html
<script id="needleToolTipTemplate" type="text/x-jquery-tmpl">
    <span style="background: green; border:black solid 2px; color:white">Current: ${item.value}</span>
</script>
<script type="text/javascript">
    $(function () {
        $("#lineargauge").igLinearGauge({
            showToolTip: true,
            needleToolTipTemplate: "needleToolTipTemplate"
            …
        });
    });
</script>
```

##<a id="comparative-ranges"></a>比較範囲のカスタム ツールチップの構成


### <a id="comparative-ranges-overview"></a>概要

比較範囲のツールチップはデフォルトで、マウスでホバーしている範囲が厳密には範囲内ではない場合でも、区切り文字にハイフンを使用して範囲の開始値と終了値 (例：0 - 34) を表示します。事前に設定されている内容を変更するには、カスタム テンプレートを設定します。

### <a id="comparative-ranges-settings"></a>プロパティ設定

以下の表では、任意の動作と各プロパティ設定のマップを示します。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
比較範囲のカスタム ツールチップの構成|[rangeToolTipTemplate](%%jQueryApiUrl%%/ui.igLinearGauge#options:rangeToolTipTemplate)|必要なテンプレートの ID。



### <a id="comparative-ranges-example"></a>例

以下のスクリーンショットは、以下の設定の結果、比較範囲のツールチップで示される値がどのように表示されるか示しています。

-	プロパティ: [rangeToolTipTemplate](%%jQueryApiUrl%%/ui.igLinearGauge#options:rangeToolTipTemplate)

-	値:

	**HTML の場合:**
	
	```html
	<script id="rangeToolTipTemplate" type="text/x-jquery-tmpl">
	    <span style="padding:5px; background: grey;color: white">Range: ${item.startValue} to ${item.endValue}</span>
	</script>
	```

![](images/igLinearGauge_Configuring_the_Tooltips_2.png)

以下のコードはこの例を実装します。

**HTML の場合:**

```html
<script id="rangeToolTipTemplate" type="text/x-jquery-tmpl">
    <span style="padding:5px; background: grey;color: white">Range: ${item.startValue} to ${item.endValue}</span>
</script>
<script type="text/javascript">
    $(function () {
        $("#lineargauge").igLinearGauge({
            showToolTip: true,
            needleToolTipTemplate: "needleToolTipTemplate",
            rangeToolTipTemplate: 'rangeToolTipTemplate',
            value: 26,
            height: "70px",
            width: "300px",
            ranges: [
                {
                    name: 'bad',
                    startValue: 0,
                    endValue: 30
                },
                {
                    name: 'acceptable',
                    startValue: 30,
                    endValue: 70
                },
                {
                    name: 'good',
                    startValue: 70,
                    endValue: 100
                }]
        });
    });
</script>
```



##<a id="related-content"></a>関連コンテンツ


### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


-	[スケールの構成 (igLinearGauge)](igLinearGauge-Configuring-the-Scale.html): このトピックではコード例を使用して、`igLinearGauge` コントロールのスケールを構成する方法を説明します。説明には、コントロール内のスケールの配置、スケールの目盛およびラベルの構成が含まれます。

-	[針の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Needle.html): このトピックではコード例を使用して、`igLinearGauge` コントロールの針を構成する方法を説明します。説明には、針が示す値、幅、位置、および書式設定が含まれます。

-	[比較範囲の構成 (igLinearGauge)](igLinearGauge-Configuring-Comparative-Ranges.html): このトピックではコード例を使用して、`igLinearGauge` コントロールの範囲を構成する方法を説明します。説明には、範囲の数、位置、長さ、幅、および書式設定が含まれます。

-	[背景の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Background.html): このトピックではコード例を使用して、リニア ゲージの背景を構成する方法を説明します。説明には、背景のサイズ、位置、色、および境界線の設定が含まれます。





 

 



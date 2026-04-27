<!--
|metadata|
{
    "fileName": "iglineargauge-configuring-the-orientation-and-direction",
    "controlName": "igLinearGauge",
    "tags": ["Charting","How Do I"]
}
|metadata|
-->

# 向きと方向の構成 (igLinearGauge)

##トピックの概要

### 目的

このトピックは、垂直スケールと反転したスケール方向の両方またはいずれか一方により `igLinearGauge`™ コントロールを構成する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[igLinearGauge の概要](igLinearGauge-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igLinearGauge` コントロールの概念的な情報を提供します。

-	[igLinearGauge の追加](igLinearGauge-Adding.html):このトピックでは、`igLinearGauge` コントロールを %%PlatformName%% アプリケーションに追加する方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
    -   [スケールの向きと方向の構成の概要](#scale-orientation-summary)
    -   [スケールの向きと方向の構成の概要表](#scale-orientation-summary-chart)
-   [スケールの向きの構成](#config-scale-orientation)
    -   [概要](#orientation-overview)
    -   [プロパティ設定](#orientation-settings)
    -   [例](#orientation-examples)
-   [スケールの方向の構成 (スケールの反転)](#direction-config)
    -   [概要](#direction-overview)
    -   [プロパティ設定](#direction-settings)
    -   [例 - 水平方向での反転方向](#direction-horizontal-example)
    -   [例 - 垂直方向での反転方向](#direction-vertical-example)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="introduction"></a>概要

### <a id="scale-orientation-summary"></a>スケールの向きと方向の構成の概要

`igLinearGauge` コントロールは、スケールの垂直方向および水平方向をサポートしています。既定では、スケールは水平方向です。垂直方向のスケールの値は上向きに増加し、番号ラベルがその左側に配置されます。

![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_1.png)

この設定は、コントロールの [orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation) プロパティで定義されます。

スケールの向きは、スケールの値が増加する方向です。方向は、標準 (水平方向で左から右、垂直方向で下から上) または反転 (水平方向で右から左、垂直方向で上から下) が可能です。

水平方向での反転方向|垂直方向での反転方向
---|---
![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_2.png)|![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_3.png)


スケールの方向は、コントロールの [isScaleInverted](%%jQueryApiUrl%%/ui.igLinearGauge#options:isScaleInverted) プロパティで定義されます。デフォルトの方向は、標準です。

### <a id="scale-orientation-summary-chart"></a>スケールの向きと方向の構成の概要表

以下の表で、`igLinearGauge` のコントロールの方向とスケールの反転で構成できる要素を簡単に説明し、構成に使用するプロパティにマップします。

構成可能な項目|詳細|プロパティ
---|---|---
スケールの向き|コントロール内のリニア ゲージのスケールの向き (水平または垂直)。|[orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation)
スケールの方向|リニア ゲージの方向 (標準または反転)。|[isScaleInverted](%%jQueryApiUrl%%/ui.igLinearGauge#options:isScaleInverted)



##<a id="config-scale-orientation"></a>スケールの向きの構成

### <a id="orientation-overview"></a>概要

リニア ゲージの向き (水平または垂直) は、コントロールの [orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation) プロパティで指定します。

### <a id="orientation-settings"></a>プロパティ設定

以下の表では、各プロパティ設定の構成です。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
水平方向を指定する|[orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation)|"horizontal"
垂直方向を指定する|[orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation)|"vertical"


### <a id="orientation-examples"></a>例

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
[orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation)|"vertical"


![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_1.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#igLinearGauge').igLinearGauge({
    width: ”70”,
    height: ”300”,
    orientation: "vertical"
});
```



##<a id="direction-config"></a>スケールの方向の構成 (スケールの反転)

### <a id="direction-overview"></a>概要

水平方向では、スケールの標準 (デフォルト) 方向は「左から右」で、これはスケールが [グラフ領域](igLinearGauge-Overview.html#graph-area) の左端から開始され、右端で終了することを意味します ([scaleStartExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:scaleStartExtent) はグラフ領域の左端の始まりを示し、[scaleEndExtent](%%jQueryApiUrl%%/ui.igLinearGauge#options:scaleEndExtent) は、グラフ領域の左端からスケールの終りまでの距離を示します)。

![](images/igLinearGauge_Overview_5.png)

方向が反転すると、スケールはグラフ領域の右端から開始され、左端で終了します (`scaleStartExtent` はグラフ領域の右端の始まりを示し、`scaleEndExtent` はグラフ領域の右端からスケールの終りまでの距離を示します)。

![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_4.png)

垂直方向では、スケールの標準 (デフォルト) 方向は「下端から上端」で、これはスケールがグラフ領域の下端から開始され、上端で終了することを意味します (`scaleStartExtent` はグラフ領域の下端の始まりを示し、`scaleEndExtent` は、グラフ領域の下端からスケールの終りまでの距離を示します)。

![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_5.png)

方向が反転すると、スケールはグラフ領域の上端から開始され、下端で終了します (`scaleStartExtent` はグラフ領域の上端の始まりを示し、`scaleEndExtent` はグラフ領域の上端からスケールの終りまでの距離を示します)。

![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_6.png)

### <a id="direction-settings"></a>プロパティ設定

以下の表では、任意の構成とプロパティ設定のマップを示します。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
標準方向の構成|[isScaleInverted](%%jQueryApiUrl%%/ui.igLinearGauge#options:isScaleInverted)|“false”
反転方向の構成|isScaleInverted|“true”



### <a id="direction-horizontal-example"></a>例 - 水平方向での反転方向

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
[isScaleInverted](%%jQueryApiUrl%%/ui.igLinearGauge#options:isScaleInverted)|“true”
[orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation)|"horizontal"



![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_2.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#igLinearGauge').igLinearGauge({
    width: “70”,
    height: “300”,
    isScaleInverted: "true"
});
```

### <a id="direction-vertical-example"></a>例 - 垂直方向での反転方向

以下のスクリーンショットは、以下の設定の結果、`igLinearGauge` の外観がどのようになるか示しています。

プロパティ|値
---|---
[isScaleInverted](%%jQueryApiUrl%%/ui.igLinearGauge#options:isScaleInverted)|“true”
[orientation](%%jQueryApiUrl%%/ui.igLinearGauge#options:orientation)|"vertical"



![](images/igLinearGauge_Configuring_the_Orientation_and_Direction_3.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#igLinearGauge').igLinearGauge({
    width: '70',
    height: '300',
    orientation: "vertical", 
    isScaleInverted: "true"
});
```



##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

-	[視覚要素の構成 (igLinearGauge)](igLinearGauge-Configuring-the-Visual-Elements.html): このトピック グループは、`igLinearGauge` コントロールの視覚要素 (スケール要素、針および範囲など) を詳細に説明し、コード例を使用してコントロールの視覚要素を構成する方法を示します。


### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[垂直方向](%%SamplesUrl%%/linear-gauge/vertical-horizontal-orientation): このサンプルでは、`igLinearGauge` の方向を変更し、スケールを反転する方法を紹介します。





 

 



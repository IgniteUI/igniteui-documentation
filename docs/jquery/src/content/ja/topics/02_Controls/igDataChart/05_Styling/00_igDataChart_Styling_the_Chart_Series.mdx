<!--
|metadata|
{
    "fileName": "igdatachart-styling-the-chart-series",
    "controlName": "igDataChart",
    "tags": ["Charting","Styling"]
}
|metadata|
-->

# チャート シリーズのスタイル設定 (igDataChart)



##トピックの概要

### 目的

このトピックは、`igDataChart`™ コントロールのシリーズのスタイル設定方法の概要について紹介し、例として影付きの効果をシリーズに適用する方法を紹介します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。


-   [igDataChart の追加](igDataChart-Adding.html)

このトピックでは、`igDataChart` コントロールをページに追加し、データにバインドする方法を紹介します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-	[線状グラデーション色を適用したチャート シリーズのスタイル設定](#linear-gradient)
-   [影付きの効果を適用したチャート シリーズのスタイル設定](#drop-shadow-effect)
    -   [影付き効果の構成の概要](#drop-shadow-effect-config)
    -   [影のタイプ](#shadow-types)
    -   [影付き効果の構成の概要表](#drop-shadow-effect-chart)
    -   [プロパティ設定](#property-settings)
    -   [例 - モノリス シャドウによる影付き効果](#example)
    -   [例 - コンパウンド シャドウによる影付き効果](#example-drop-shadow-effect)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)



## <a id="introduction"></a> 概要


### チャート シリーズのスタイル設定の概要

igDataChart のシリーズは、複数の要素でスタイル設定できますが、異なるフィールとアウトライン ブラシをシリーズに適用することが重要な点です。これはシリーズの [`brush`](%%jQueryApiUrl%%/ui.igDataChart#options:series.brush) と [`outline`](%%jQueryApiUrl%%/ui.igDataChart#options:series.outline) プロパティで処理されます。シリーズのルック アンド フィールのその他の要素、たとえばアウトラインの太さやシリーズの不透明度なども、シリーズの [`thickness`](%%jQueryApiUrl%%/ui.igDataChart#options:series.thickness) および [`areaFillOpacity`](%%jQueryApiUrl%%/ui.igDataChart#options:series.areaFillOpacity) のプロパティで構成できます。

上記で説明するスタイル設定の制御に加え、[`isDropShadowEnabled`](%%jQueryApiUrl%%/ui.igDataChart#options:series.isDropShadowEnabled) プロパティでも[影付き効果をチャート シリーズに適用できます](#drop-shadow-effect)。

## <a id="linear-gradient"></a> 線状グラデーション色を適用したチャート シリーズのスタイル設定
[`brush`](%%jQueryApiUrl%%/ui.igDataChart#options:series.brush) または [`outline`](%%jQueryApiUrl%%/ui.igDataChart#options:series.outline) の型を `"linearGradient"` に設定し、色およびオフセットを持つ 2 つ以上の `colorStops` の配列を提供すると、線状グラデーションが適用されます。

以下のサンプルは、線状グラデーションを設定するチャート構成を定義します。

<div class="embed-sample">
   [チャート塗りつぶしのグラデーション](%%SamplesEmbedUrl%%/data-chart/chart-fill-gradients)
</div>

##<a id="drop-shadow-effect"></a>影付きの効果を適用したチャート シリーズのスタイル設定

###<a id="drop-shadow-effect-config"></a> 影付き効果の構成の概要

影付き効果により、シリーズはあたかも3Dのように見えます。

<div class="embed-sample">
   [ドロップ シャドウ](%%SamplesEmbedUrl%%/data-chart/drop-shadows)
   ![](images/igDataChart_Styling_the_Chart_Series_1.png)
</div>

シリーズの [`isDropShadowEnabled`](%%jQueryApiUrl%%/ui.igDataChart#options:series.isDropShadowEnabled) プロパティを "true" に設定すると、シリーズに影付き効果が適用されます。[構成可能な影のタイプ](#shadow-types)の場合、効果のカスタマイズとして、ぼかしの半径、色、方向、および不透明度が[series](igDataChart-Series-Types.html) の影に関連するプロパティでサポートされています (詳細は[影付き効果の構成の概要表](#drop-shadow-effect-chart)、[プロパティの設定](#property-settings)およびコード例を参照してください)。

###<a id="shadow-types"></a> 影のタイプ

2 種類の影が影付き効果で使用できます。シリーズの影が、塗りつぶし図形やアウトライン図形の個別の影、または単独のモノリス シャドウかにより使用するタイプが決定されます。

-   モノリス シャドウ - シリーズで表示される影は 1 種類のみ。
-   コンパウンド シャドウ - シリーズの塗りつぶし部分およびアウトライン部分で個別の影。

影のタイプのデフォルトはモノリスです。コンパウンド タイプを使用するメリットは、影付き効果の表示を微調整できる点です。

>**注:** 現在、コンパウンド シャドウにのみ [blur](#blur) が適用できます。制限についての詳細は、[注意事項](#GoogleBug)を参照してください。

影のタイプは、[`useSingleShadow`](%%jQueryApiUrl%%/ui.igDataChart#options:series.useSingleShadow) プロパティで制御されます。このプロパティを *"true"* (既定) に設定するとモノリス シャドウが適用され、"false" に設定するとコンパウンド シャドウが適用されます。

### <a id="drop-shadow-effect-chart"></a> 影付き効果の構成の概要表

以下の表で、チャートの影付き効果で構成できる要素を簡単に説明し、構成に使用するプロパティにマップします。既定の影付き効果のスタイル設定は、シリーズのタイプによって異なります。表の後に、影のタイプの設定について、詳細や例が記載されています。

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
構成可能な影のタイプ
            </td>
            <td>
各シリーズに対し個別に影を構成 (スタイル設定) する、またはシリーズ全体を 1 つの表示にするのいずれかを指定します。
            </td>
            <td>
                <ul>
                    <li>
[useSingleShadow](%%jQueryApiUrl%%/ui.igDataChart#options:series.useSingleShadow)
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
方向とオフセット
            </td>
            <td>
投影する方向。シリーズの境界線四角形の左上端を基点に X/Y オフセット座標で指定した水平および垂直のオフセットです。
            </td>
            <td>
                <ul>
                    <li>
[shadowOffsetX](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetX)
                    </li>
                    <br>
                    <li>
[shadowOffsetY](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetY)
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
色と不透明度
            </td>
            <td>
影の色。半透明が指定されている場合は、半透明な影を描画します。
            </td>
            <td>
                <ul>
                    <li>
[shadowColor](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowColor)
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
<a id="blur"></a>
ぼかし
            </td>
            <td>
影の縁の定義レベル (シャープとぼかし) です。ぼかしのレベルは、等高線の広がりやフェード アウトの全体のピクセル数で定義されます。値が大きいと、影のぼかしが強くなります。
            </td>
            <td>
                <ul>
                    <li>
[shadowBlur](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowBlur)
                    </li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



### <a id="property-settings"></a>プロパティ設定

以下の表は、影付き効果の各プロパティ設定で構成できる項目を示しています。

<table class="table table-bordered">
    <thead>
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
    </thead>
    <tbody>
        <tr>
            <td colspan="2">
使用される影付き効果
            </td>
            <td>
[isDropShadowEnabled](%%jQueryApiUrl%%/ui.igDataChart#options:series.isDropShadowEnabled)
            </td>
            <td>
*“true”*
            </td>
        </tr>
        <tr>
            <td colspan="2">
影のタイプ
            </td>
            <td>
[useSingleShadow](%%jQueryApiUrl%%/ui.igDataChart#options:series.useSingleShadow)
            </td>
            <td>
“true” or “false”
            </td>
        </tr>
        <tr>
            <td colspan="2">
影の色や不透明度
            </td>
            <td>
[shadowColor](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowColor)
            </td>
            <td>
任意の HTML カラー名、HEX カラー コードまたは RGBA カラー定義
            </td>
        </tr>
        <tr>
            <td rowspan="2">
方向とオフセット
            </td>
            <td>
シリーズ表示の影の水平オフセット
            </td>
            <td>
[shadowOffsetX](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetX)
            </td>
            <td>
ピクセルで指定したオフセットを表す double 値
            </td>
        </tr>
        <tr>
            <td>
シリーズ表示の影の垂直オフセット
            </td>
            <td>
[shadowOffsetY](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetY)
            </td>
            <td>
ピクセルで指定したオフセットを表す double 値
            </td>
        </tr>
        <tr>
            <td colspan="2">
ぼかしのレベル
            </td>
            <td>
[shadowBlur](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowBlur)
            </td>
            <td>
ぼかしのレベルを表す、任意のピクセルの double 値。値が大きいと、影のぼかしが強くなります。
                <blockquote>
                    <a id="GoogleBug" name="GoogleBug"></a>

                    **注:** モノリス シャドウには、ぼかし効果は適用できません。 **useSingleShadow** プロパティが "true" に設定されている場合、shadowBlur 設定は無視され、影にぼかしが適用されることはありません。これは、[Google® Chrome™ のバグ](https://code.google.com/p/chromium/issues/detail?id=100703)に対応するための制限です。すべての主要なブラウザーで同じ動作効果を保証することが目的です。上記の
                    Chrome のバグが解消され次第、この効果はアップデートの対象となる予定です。 それまでは、影をぼかす必要がある場合、コンパウンド シャドウを使用してください (useSingleShadow:"true")。
                </blockquote>
            </td>
        </tr>
    </tbody>
</table>

### <a id="example"></a> 例 - モノリス シャドウによる影付き効果

この例は、[モノリス](#shadow-types)の影付きを適用しスタイル設定する方法を示します。[`useSingleShadow`](%%jQueryApiUrl%%/ui.igDataChart#options:series.useSingleShadow) プロパティは デフォルトで"true" に設定されているため、明示的なコード設定は必要ありません。

以下のスクリーンショットは、以下の影の設定の結果、`igDataChart` コントロールの折れ線シリーズの外観がどのようになるか示しています。

プロパティ | 値
---|---
[isDropShadowEnabled](%%jQueryApiUrl%%/ui.igDataChart#options:series.isDropShadowEnabled) | true
[shadowBlur](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowBlur) | 20
[shadowColor](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowColor) | "darkBlue"
[shadowOffsetX](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetX) | 10
[shadowOffsetY](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetY) | -15


![](images/igDataChart_Styling_the_Chart_Series_2.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
series: [
    {
        type: "column",
        isDropShadowEnabled: true,
        shadowBlur: 20,
        shadowColor: "darkBlue",
        shadowOffsetX: 10,
        shadowOffsetY: -15
    }
```

### <a id="example-drop-shadow-effect"></a> 例 - コンパウンド シャドウによる影付き効果

この例は、[コンパウンド](#shadow-types)の影付きにぼかしを適用する方法を示します。

以下のスクリーンショットは、以下の影の設定の結果、`igDataChart` コントロールの柱状シリーズの外観がどのようになるか示しています。

プロパティ | 値
---|---
[isDropShadowEnabled](%%jQueryApiUrl%%/ui.igDataChart#options:series.isDropShadowEnabled) | true
[useSingleShadow](%%jQueryApiUrl%%/ui.igDataChart#options:series.useSingleShadow) | false
[shadowBlur](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowBlur) | 20
[shadowColor](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowColor) | “darkBlue”
[shadowOffsetX](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetX) | 10
[shadowOffsetY](%%jQueryApiUrl%%/ui.igDataChart#options:series.shadowOffsetY) | -15



![](images/igDataChart_Styling_the_Chart_Series_3.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
series: [
    {
        type: "column",
        isDropShadowEnabled: true,
        useSingleShadow: false,
        shadowBlur: 20,
        shadowColor: "darkBlue",
        shadowOffsetX: 10,
        shadowOffsetY: -15,
      }
```



##<a id="related-content"></a>関連コンテンツ


###<a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


-   [igDataChart のスタイル設定](igDataChart-Styling-Themes.html): このトピックは、`igDataChart` コントロールにスタイルおよびテーマを適用する方法を紹介します。

-   [%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html): %%ProductName%%™ ライブラリのスタイルとテーマの更新に関する概要とその手順を説明します。






 

 



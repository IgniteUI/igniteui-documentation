<!--
|metadata|
{
    "fileName": "using-gradient-colors-in-data-visualizations",
    "controlName": "Doughnut Chart, igBarcode, igBulletGraph, igDataChart, igFunnelChart, igLinearGauge",
    "tags": ["Data Presentation","How Do I","Styling","Theming"]
}
|metadata|
-->

# データのビジュアル化でのグラデーション カラーの使用



##トピックの概要

#### 目的

このトピックは、%%ProductName%%™ コントロールのビジュアル データにグラデーション カラーを適用する方法を説明します。この機能は、以下のデータ ビジュアライゼーション コントロールでサポートされています。

-   [igBulletGraph](igBulletGraph.html)™
-   [igDataChart](igDataChart-Landing-Page.html)™
-   [igLinearGauge](igLinearGauge.html)™

#### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

####概念

-   カラー グラデーション
-   CSS *background-image* プロパティ

####トピック

[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html): このトピックでは、デザイン段階でのアプリケーションのセットアップ手順について説明し、実稼働環境で CSS を使用するためのオプションを紹介すると同時に、テーマの作成またはカスタマイズについての概要を示します。

[igDataChart の追加](igDataChart-Adding.html): このトピックでは、igDataChart コントロールをページに追加し、データにバインドする方法を紹介します。

####外部リソース



[カラー グラデーション](http://ja.wikipedia.org/wiki/%E3%82%B0%E3%83%A9%E3%83%87%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3): カラー グラデーションの概念が説明された Wikipedia の記事

[CSS 線状グラデーション](https://developer.mozilla.org/ja/docs/Web/CSS/linear-gradient): `linear-gradient()` CSS 機能が説明された記事。



#### このトピックの内容

-   [概要](#_Introduction)
    -   [グラデーション カラー構成の概要](#_Gradient_colors_configuration_summary)
    -   [サポートされるグラデーションのタイプ](#_Supported_gradient_types)
    -   [グラデーション カラー構成の概要表](#_Gradient_colors_configuration_summary_chart)
-   [線状カラー グラデーションの構成](#_Configuring_Linear_Color_Gradients)
-   [API によるグラデーション カラーの構成](#_Configuring_Gradient_Colors_Through_the_API)
    -   [概要](#_Overview)
    -   [プロパティ設定](#_Property_settings)
    -   [例](#_Example)
-   [CSS クラスによるグラデーション カラーの構成](#_Configuring_Gradient_Colors_Through_CSS_Classes)
    -   [概要](#_Overview_CSS)
    -   [例](#_Example_CSS)
-   [CSS クラス リファレンス](#_CSS_Classes_Reference)
    -   [概要](#_CSS_Classes_Reference_Introduction)
    -   [igBulletGraph](#_igBulletGraph)
    -   [igDataChart](#_igDataChart)
    -   [igLinearGauge](#_igLinearGauge)
-   [関連コンテンツ](#_Related_Content)
    -   [トピック](#_Topics)
    -   [サンプル](#_Samples)



##<a id="_Introduction"></a>概要

####<a id="_Gradient_colors_configuration_summary"></a> グラデーション カラー構成の概要

線状カラー グラデーションは、データ ビジュアライゼーション コントロールでビジュアル オブジェクトの塗りつぶしとアウトラインに適用できます。

![](images/Using_Color_Gradients_in_Data_Visualisation_Components_1.png)

グラデーション カラーは、サポートされているコンポーネントの色関連プロパティにより構成されます。これには、線状などのグラデーションのタイプおよび色境界の指定が含まれます。他の構成プロパティは、それぞれの効果タイプに特有です。

####<a id="_Supported_gradient_types"></a> サポートされるグラデーションのタイプ

現在、線状グラデーションのみがサポートされています。

####<a id="_Gradient_colors_configuration_summary_chart"></a> グラデーション カラー構成の概要表

以下の表で、データ ビジュアライゼーションでグラデーション カラーを構成できる方法を簡単に説明します。 

<table class="table table-striped">
    <thead>
        <tr>
            <th>
グラデーション カラーを構成するには
            </th>
            <th>
以下を実行します。
            </th>
            <th>
サポートされるコントロール
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
API の使用
            </td>
            <td>
視覚要素のカラー グラデーション関連のプロパティを設定します。
            </td>
            <td>
                <ul>
                    <li>
igBulletGraph
                    </li>

                    <li>
igDataChart
                    </li>

                    <li>
igLinearGauge
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
CSS の使用
            </td>
            <td>
指定された CSS クラスに background-image プロパティのグラデーション タイプを指定します。
            </td>
            <td>
                <ul>
                    <li>
igBulletGraph
                    </li>

                    <li>
igDataChart
                    </li>

                    <li>
igLinearGauge
                    </li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>




##<a id="_Configuring_Linear_Color_Gradients"></a>線状カラー グラデーションの構成


####線状グラデーション カラー構成の概要

線状カラー グラデーション効果で構成できる主な要素は、タイプ、方向、およびカラー フローです。

####グラデーション方向の構成

デフォルトのグラデーション方向は上から下に設定されています。カスタムで方向が指定されていない場合、オフセット 0 の色は図の一番上に配置され、オフセット 1 の色は一番下に配置されます。グラデーション方向を変更するには、開始点と終了点を指定します。開始点と終了点は、グラデーションを開始し終了する地点です。その地点の x 座標および y 座標はともに 0～1 の範囲内であることが必要です。(0, 0) は図の境界線四角形の左上の端で (1, 1) は図の境界線四角形の右下の端です。

#### グラデーション カラー フローの構成

グラデーション タイプの他に、2 つ以上のグラデーション境界を構成します。各グラデーション境界は、グラデーションの開始点からの色とオフセットを指定し、グラデーションのカラー フローを表す仮想のグラデーション線に沿って色が配置される場所を示す必要があります。グラデーション線のデフォルトは、垂直の下方向です。すなわち、開始点の座標は (0,0) で終了点の座標は (0,1) です。グラデーション カラーのカスタム スプレッドを実現するために、2 つ以上のグラデーション境界が使用できます。

以下の画像は、前述で説明するようにカスタム設定された角度の線状カラー グラデーションで、*igDataChart* 領域シリーズの図形を塗りつぶす状態を示しています。

![](images/Using_Color_Gradients_in_Data_Visualisation_Components_2.png)

グラデーション カラーは、API、または一部のコントロールでは CSS クラスで構成できます。

>**注: **色が API と CSS クラスの両方で指定された場合は、API 設定が優先され、各 CSS クラスは無効になります。



##<a id="_Configuring_Gradient_Colors_Through_the_API"></a>API によるグラデーション カラーの構成


####<a id="_Overview"></a> 概要

API によるグラデーション カラーは、グラデーションを指定する JavaScript オブジェクトを、グラデーションをサポートするブラシや色関連のプロパティの 1 つに設定して構成されます。

####<a id="_Property_settings"></a> プロパティ設定

以下の表では、グラデーション カラーに関する視覚要素を構成できる項目を示し、管理に使用するプロパティにマップします。

<table class="table table-striped">
    <thead>
        <tr>
            <th>
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
            <td>
グラデーション タイプ
            </td>

            <td>
type
            </td>

            <td>
"linearGradient" など、任意のグラデーション タイプ
            </td>
        </tr>

        <tr>
            <td rowspan="2">
グラデーションの方向
            </td>

            <td>
startPoint
            </td>

            <td>
図の境界線四角形の左上の端に対するグラデーション線の開始点の x 、y 座標。小数で指定 (例: { x: 0, y: .2 })。
            </td>
        </tr>

        <tr>
            <td>
endPoint
            </td>

            <td>
図の境界線四角形の左上の端に対するグラデーション線の終了点の x 、y 座標。小数で指定 (例: { x: 1, y: .8 })。
            </td>
        </tr>

        <tr>
            <td>
グラデーション カラー フロー
            </td>

            <td>
colorStops
            </td>

            <td>
任意の色境界の配列。色および色のオフセットを指定。
            </td>
        </tr>
    </tbody>
</table>


####<a id="_Example"></a> 例

以下のスクリーンショットは、シリーズに以下のグラデーション カラーを適用した結果、igDataChart コントロールの任意のエリア シリーズ領域の外観がどのようになるか示しています。

プロパティ|値
---|---
type|"linearGradient"
startPoint|{ x: 0, y: .2 }
endPoint|{ x: 1, y: .8 }
colorStops|[{ color: "#FFD800", offset: 0 }, { color: "#FF00DC", offset: 1}]




![](images/Using_Color_Gradients_in_Data_Visualisation_Components_1.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
…
brush: {
    type: "linearGradient",
    colorStops: [{
        color: "#FFD800", //orange
        offset: 0
    },
    {
        color: "#FF00DC", //pink
        offset: 1
    }],
    startPoint: { x: 0, y: .2 },
    endPoint: { x: 1, y: .8 }
}
```



##<a id="_Configuring_Gradient_Colors_Through_CSS_Classes"></a>CSS クラスによるグラデーション カラーの構成


#### <a id="_Overview_CSS"></a>概要

一部の %%ProductName%% データ ビジュアライゼーション コントロールは、その色関連のプロパティの一部に対して CSS によるグラデーション カラーの設定をサポートしています。CSS でグラデーション カラーを指定するには、特定クラスを対象として、視覚要素の background-image プロパティをグラデーション (linear-gradient など) を指定する機能に設定する CSS ルールを作成する必要があります。CSS グラデーション カラーと CSS の単色設定が同時に指定された場合は、グラデーション カラーが優先されます。

>**注:** 色が API と CSS クラスの両方で指定された場合は、API 設定が優先され、各 CSS クラスは無効になります。

#### <a id="_Example_CSS"></a>例

以下のスクリーンショットは、最初のシリーズが CSS の以下の設定で構成された *igDataChart* コントロールを示しています。

構成可能な項目|設定
---|---
グラデーション タイプ|リニア
グラデーションの方向|左から右
グラデーション カラー フロー|左端から右端まで均一な赤、オレンジ、黄、緑、青、藍、すみれ色


![](images/Using_Color_Gradients_in_Data_Visualisation_Components_4.png)

以下のコードはこの例を実装します。

**CSS の場合:**

```css
.ui-chart-fill-palette-1 {
    background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}
```



##<a id="_CSS_Classes_Reference"></a>CSS クラス リファレンス


####<a id="_CSS_Classes_Reference_Introduction"></a> 概要

以下の表は、データ ビジュアライゼーションでグラデーション カラーの構成に使用する CSS クラスの参照情報を提供します。各クラスはコントロールに固有なクラスです。アルファベット順にリストされています。

####<a id="_igBulletGraph"></a> *igBulletGraph*

CSS クラス|詳細
---|---
ui-bulletgraph-backing-fill|ブレット グラフの背景 (バッキング) の塗りつぶしのカラー グラデーション
ui-bulletgraph-backing-outline|ブレット グラフの背景 (バッキング) のアウトラインのカラー グラデーション
ui-bulletgraph-minortick-fill |ブレット グラフの補助目盛の塗りつぶしのカラー グラデーション
ui-bulletgraph-minortick-outline |ブレット グラフの補助目盛のアウトラインのカラー グラデーション
ui-bulletgraph-range-fill-palette-1  ～  ui-bulletgraph-range-fill-palette-n |ブレット グラフの範囲の塗りつぶしに使用するパレットの n 番目のカラー グラデーション
ui-bulletgraph-range-outline-palette-1  ～  ui-bulletgraph-range-outline-palette-n |ブレット グラフの範囲のアウトラインに使用するパレットの n 番目のカラー グラデーション
ui-bulletgraph-targetvalue-fill |ブレット グラフの比較目盛マーカー(「ターゲット値」) バーのアウトラインのカラー グラデーション
ui-bulletgraph-targetvalue-outline |ブレット グラフの比較目盛マーカー(「ターゲット値」) バーのアウトラインのカラー グラデーション
ui-bulletgraph-tick-fill |ブレット グラフの主目盛の塗りつぶしのカラー グラデーション
ui-bulletgraph-tick-outline |ブレット グラフの主目盛のアウトラインのカラー グラデーション
ui-bulletgraph-value-fill |ブレット グラフのパフォーマンス バー(「値バー」) の塗りつぶしのカラー グラデーション
ui-bulletgraph-value-outline |ブレット グラフのパフォーマンス バー(「値バー」) のアウトラインのカラー グラデーション



####<a id="_igDataChart"></a> *igDataChart*

CSS クラス|詳細
---|---
ui-chart-fill-palette-1  ～  .ui-chart-fill-palette-n |チャート シリーズの図形の塗りつぶしに使用するパレットの n 番目のカラー グラデーション
ui-chart-outline-palette-1  ～  .ui-chart-outline-palette-n |チャート シリーズの図形のアウトラインに使用するパレットの n 番目のカラー グラデーション




####<a id="_igLinearGauge"></a> *igLinearGauge*

CSS クラス|詳細
---|---
ui-lineargauge-backing-fill |リニア ゲージの背景 (バッキング) の塗りつぶしのカラー グラデーション
ui-lineargauge-backing-outline |リニア ゲージの背景 (バッキング) のアウトラインのカラー グラデーション
ui-  lineargauge-minortick-fill |リニア ゲージの補助目盛の塗りつぶしのカラー グラデーション
ui-  lineargauge-minortick-outline |リニア ゲージの補助目盛のアウトラインのカラー グラデーション
ui-lineargauge-tick-fill |リニア ゲージの主目盛の塗りつぶしのカラー グラデーション
ui-  lineargauge-tick-outline |リニア ゲージの主目盛のアウトラインのカラー グラデーション
ui-lineargauge-needle-fill |リニア ゲージの針の塗りつぶしのカラー グラデーション
ui-lineargauge-needle-outline |リニア ゲージの針のアウトラインのカラー グラデーション
ui-lineargauge-range-fill-palette-1  ～  ui-lineargauge-range-fill-palette-n |リニア ゲージの範囲の塗りつぶしに使用するパレットの n 番目のカラー グラデーション
ui-lineargauge-range-outline-palette-1  ～  ui-lineargauge-range-outline-palette-n |リニア ゲージの範囲のアウトラインに使用するパレットの n 番目のカラー グラデーション




##<a id="_Related_Content"></a>関連コンテンツ


####<a id="_Topics"></a> トピック

以下のトピックでは、このトピックに関連する追加情報を提供します。

- [igDataChart のスタイル設定](igDataChart-Styling-Themes.html): このトピックは、igDataChart コントロールにスタイルおよびテーマを適用する方法を紹介します。



####<a id="_Samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。


- [チャート塗りつぶしのグラデーション](%%SamplesUrl%%/data-chart/chart-fill-gradients): このサンプルは、igDataChart コントロールで線状グラデーション カラーを使用する方法を紹介します。


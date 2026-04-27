<!--
|metadata|
{
    "fileName": "igdoughnutchart-overview",
    "controlName": "Doughnut Chart",
    "tags": ["API","Charting","Data Presentation","Getting Started","How Do I"]
}
|metadata|
-->

# igDoughnutChart の概要

## トピックの概要

### 目的

このトピックは、[igDoughnutChart](%%jQueryApiUrl%%/ui.igDoughnutChart#options)™ コントロールの概要を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**主要機能**](#features)
-   [**ユーザー インタラクションと操作性**](#interactions-usability)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igDoughnutChart` コントロールにより、変数の発生を比例的に示すことができます。コントロールの内部半径は構成可能で、ドーナツ型チャート シリーズにはスライスの選択および展開のサポートが内蔵されています。 

複数の変数の発生 (複数シリーズの追加) は、同心リングを使用して視覚化できます。チャートは、プロパティを構成する、またはテーマを適用することでスタイル設定できます。

以下のスクリーンショットは、2 つのシリーズを持つ `igDoughnutChart` を示しています。

![](images/igDoughnutChart_Overview_1.png)



## <a id="features"></a> 主要機能

以下の表で、`igDoughnutChart` コントロールの主な機能を簡単に説明します。

機能|説明
--------|------------
構成可能なリング|`igDoughnutChart` コントロールの各シリーズは、スライス色、ラベル、ツールチップ、スライス描画の開始角度など、さまざまな要素で構成することができます。 <p>![](images/igDoughnutChart_Overview_2.png)</p>
複数リング サポート|`igDoughnutChart` は、異なるコレクションにバインドできる各リングと複数のリングを同時に表示できます。または、共通のデータ ソースを共有できます。 <p>![](images/igDoughnutChart_Overview_3.png)</p>
スライスの選択|`igDoughnutChart` は、1 つ以上のスライスの状態を 選択された状態に設定する API を公開します。任意で、単一のカスタム ビジュアル スタイルを選択済みスライスに適用できます。 <p>![](images/igDoughnutChart_Overview_4.png)</p>
スライスの展開|`igDoughnutChart` スライスは、プログラム上で、またはユーザー インタラクションによって展開できます。 <p>![](images/igDoughnutChart_Overview_5.png)</p>





## <a id="interactions-usability"></a> ユーザー インタラクションと操作性

以下の表で、`igDoughnutChart` コントロールのユーザー インタラクション機能を簡単に説明します。

目的|方法|詳細|クライアント/サーバー設定
--------------|--------|---------|-------------
スライスのクリック|マウス クリック|`igDoughnutChart` は、スライス上でクリックすると起動する [`sliceClick`](%%jQueryApiUrl%%/ui.igDoughnutChart#options:sliceClick) イベントを公開します。<br />スライスの選択または公開を有効にすると、スライスの選択および公開の状態をクリックにより修正できます。|![](images/positive.png) [選択と展開の構成 (*igDoughnutChart*)](igDoughnutChart-Configuring-Selection-and-Explosion.html)


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*igDoughnutChart* の追加](igDoughnutChart-Adding.html): このトピックは、`igDoughnutChart` を HTML ページに追加する方法を説明します。

- [選択と展開の構成 (*igDoughnutChart*)](igDoughnutChart-Configuring-Selection-and-Explosion.html): このトピックは、`igDoughnutChart` のスライスの選択および展開を構成する方法を説明します。

- [jQuery および MVC API リファレンス リンク (*igDoughnutChart*)](igDoughnutChart-API-Links.html): このトピックでは、`igDoughnutChart` コントロールと %%ProductNameMVC%% に関する API ドキュメントへのリンクを提供します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [Collection にバインド](%%SamplesUrl%%/doughnut-chart/bind-to-collection): このサンプルは、%%ProductNameMVC%%を使用して `igDoughnutChart` を描画し、サーバー上のオブジェクトのコレクションにバインドする方法を紹介します。

- [JSON へのバインド](%%SamplesUrl%%/doughnut-chart/bind-json): このサンプルは、ドーナツ型チャートを JSON データにバインドする方法を紹介します。

- [ラベルおよびツールチップ](%%SamplesUrl%%/doughnut-chart/labels-tooltips): このサンプルは、`igDoughnutChart` のラベル、ツールチップなどのオプションを構成する方法を紹介します。

- [凡例の構成](%%SamplesUrl%%/doughnut-chart/configure-legend): このサンプルは、`igDoughnutChart` の凡例を構成する方法を紹介します。

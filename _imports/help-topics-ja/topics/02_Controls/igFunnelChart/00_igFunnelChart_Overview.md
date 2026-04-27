<!--
|metadata|
{
    "fileName": "igfunnelchart-overview",
    "controlName": "igFunnelChart",
    "tags": ["Charting","Data Presentation"]
}
|metadata|
-->

# igFunnelChart の概要

## トピックの概要

### 目的

このトピックでは、主要機能、最小要件、ユーザー機能性など、`igFunnelChart`™ コントロールに関する概念的な情報を提供します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念とトピックの一覧です。

- 概念
	-   チャート作成
	-   ファンネル チャート
	-   データのビジュアル化
-   トピック
	-   [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html): %%ProductName%%® ライブラリにつぃての一般的情報


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**最低必要条件**](#minimum-requirements)
-   [**主要な機能の概要**](#main-features)
    -   [主要な機能の概要](#main-features-overview)
    -   [反転ファンネル](#inverted)
    -   [加重スライス](#weighted)
    -   [スライスの選択](#slice-selection)
    -   [ベジエ曲線の図形](#bezier-curve)
-   [**ユーザー インタラクションと操作性**](#user-interaction-usability)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igFunnelChart` は、HTML5 による Web アプリケーションでファンネル チャートを描画するチャート作成用コントロールです。これは Web ページにファンネル チャートをプロットする際に新しい HTML5 Canvas タグを使用します。

![](images/igFunnelChart_Overview_%28Control_Overview%29_1.png)

`igFunnelChart` コントロールは、項目の異なるカテゴリーに関連づけられた値を表示するという点で `igPieChart`™ に似ています。ファンネル チャートに示される値の合計は必ずしもより大きなエンティティの合計でなくてもよい点が異なります。ファンネル スライスは、通常、値が大から小へ、または小から大へ並び替えされて表示されます。高さが同じか、項目の値に高さが比例した状態で表示されます。ファンネル チャートには、通常、円錐シェイプがありますが、ベジエ曲線で左側から右側へ等高線を形成することができます。

## <a id="minimum-requirements"></a> 最低必要条件

`igFunnelChart` コントロールは jQuery UI ウィジェットであるため、jQuery と jQuery の UI ライブラリに依存します。Modernizr ライブラリは、ブラウザーとデバイス機能を検出するために 内部使用されます。コントロールは、機能とデータのバインド用の %%ProductName%% の共有リソースのいくつかを使用します。これらのリソースへの参照は、実際の jQuery または %%ProductNameMVC%% が使用されているとしても必要となります。コントロールが ASP.NET MVC のコンテクスト内で使用されている場合、*Infragistics.Web.Mvc* アセンブリが必要です。



## <a id="main-features"></a> 主要機能

### <a id="main-features-overview"></a> 主要な機能の概要表

以下の表で、`igFunnelChart` コントロールの主な機能を簡単に説明します。追加の詳細は、以下の概要表の下に示します。

機能|説明
--- | ---
[反転ファンネル](#inverted)|ファンネル チャートにより、最大値を一番上に示す通常のビューとは異なり、最小値を一番上に表示できます。
[加重スライス](#weighted)|スライスの高さを値に基づいて設定できます。
[スライスの選択](#slice-selection)|スライスの選択を有効にし、スライスの選択スタイルおよび選択されていないスタイルを構成できます。
[ベジエ曲線の図形](#bezier-curve)|通常の台形シェイプと異なり、ファンネル チャートの側面をベジエ曲線の形式で構成できます。


### <a id="inverted"></a> 反転ファンネル

デフォルトでファンネル チャートは、最大のスライスを一番上に表示し、残りのスライスを値の降順に表示します。`igFunnelChart` は、最小値を一番上に示す昇り順でスライスを表示するよう構成できます。

![](images/igFunnelChart_Overview_%28Control_Overview%29_2.png)

#### 関連トピック:

-   [igFunnelChart の構成](igFunnelChart-Configuring.html)

### <a id="weighted"></a> 加重スライス

`igFunnelChart` コントロールにより、スライスの高さを値に基づいて設定できます。そのようにして、外部のビジュアル的なヒントがスライスの値に追加されます。

![](images/igFunnelChart_Overview_%28Control_Overview%29_3.png)

#### 関連トピック:

-   [igFunnelChart の構成](igFunnelChart-Configuring.html)

### <a id="slice-selection"></a> スライスの選択

スライス選択機能は `igFunnelChart` コントロールに対して有効となり、ユーザーはマウスのクリック 1 回で、または画面をタップすることによりスライスを選択できます。もう一度クリックまたはタップすると、スライスの選択を解除します。さらに、スタイルの選択および選択解除はその状態に従って定義されスライスに適用できます。

![](images/igFunnelChart_Overview_%28Control_Overview%29_4.png)

#### 関連トピック:

-   [igFunnelChart の構成](igFunnelChart-Configuring.html)

### <a id="bezier-curve"></a> ベジエ曲線の図形

側面を直線でなくベジエ曲線とすることによりビジュアル的なアピールをファンネル チャートに追加できます。コントロールにより、ベジエ曲線機能を有効にし、正確なシェイプを制御するためにベジエ コントロール ポイントの位置を構成できます。

![](images/igFunnelChart_Overview_%28Control_Overview%29_5.png)

#### 関連トピック:

-   [igFunnelChart の構成](igFunnelChart-Configuring.html)



## <a id="user-interaction-usability"></a> ユーザー インタラクションと操作性

以下の表で、`igFunnelChart` コントロールのユーザー相互作用機能を簡単に説明します。

目的|方法|詳細|クライアント/サーバー設定
--- | --- | --- | ---
スライスを選択|<ul><li>マウス クリック</li><li>スクリーン タップ</li></ul> |`igFunnelChart` により、ユーザーはホスト アプリケーションにおける目的のためにスライスを選択および選択解除できます。 | ![](images/positive.png)



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igFunnelChart の追加](igFunnelChart-Adding.html): このトピックは、`igFunnelChart` コントロールをウェブ ページに追加し、それをデータにバインドする方法を説明します。

- [*igFunnelChart* のデータへのバインディング](igFunnelChart-Binding-to-Data.html): このトピックでは、`igFunnelChart` コントロールを各種データ ソースへバインドする方法を説明します。

- [*igFunnelChart* の構成](igFunnelChart-Configuring.html): このトピックは、`igFunnelChart` コントロールの異なる可視機能とビヘイビアーの構成方法を説明します。

- [*igFunnelChart *のスタイル設定](igFunnelChart-Styling.html): このトピックでは、`igFunnelChart` コントロールのルックアンドフィールをカスタマイズする方法を説明します。

- [アクセシビリティ準拠 (*igFunnelChart*)](igFunnelChart-Accessibility-Compliance.html): このトピックでは、`igFunnelChart` コントロールのユーザー補助機能について説明し、チャートを含むページのアクセシビリティの遵守を実現する方法に関してアドバイスを提供します。

- [既知の問題と制限 (*igFunnelChart*)](igFunnelChart-Known-Issues-and-Limitations.html): このトピックでは、`igFunnelChart` コントロールに関連する既知の問題点に関する情報を提供します。 
- 
- [jQuery と MVC API リンク (*igFunnelChart*)](igFunnelChart-jQuery-and-ASP.NET-MVC-Helper-API--Links.html): このトピックでは、`igFunnelChart` コントロールと ASP.NET MVC ヘルパーのための API リファレンスのドキュメントへのリンクの一覧を示します。

### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [ファンネル チャート](%%SamplesUrl%%/funnel-chart/funnel-chart): このサンプルは、ファンネル チャート コントロールを使用して大きな値から小さな値までスライスの位置を反転する機能でスライスとしてデータを描画するコントロールの使用を説明します。

- [スライスの選択](%%SamplesUrl%%/funnel-chart/slice-selection): このサンプルは、スライス選択機能の有効化および `sliceClicked` イベントの処理を示します。





 

 



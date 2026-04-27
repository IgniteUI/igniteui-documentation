<!--
|metadata|
{
    "fileName": "iglayoutmanager-overview",
    "controlName": "igLayoutManager",
    "tags": ["How Do I","Layouts"]
}
|metadata|
-->

# igLayoutManager の概要



##トピックの概要


### 目的

このトピックは、%%ProductName%%® コントロールの概念について説明し、サポートされるレイアウトやその使用についての情報を提供します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
    -   [igLayoutManager の概要](#iglayoutmanager)
    -   [RWD サポート](#rwd-support)
-   [サポートされるレイアウト](#supported-layouts)
    -   [サポートされるレイアウトの概要表](#supported-layouts-summary-chart)
    -   [境界線レイアウト](#border-layout)
    -   [列レイアウト](#column-layout)
    -   [フロー レイアウト](#flow-layout)
    -   [グリッド レイアウト](#grid-layout)
    -   [垂直レイアウト](#vertical-layout)
-   [要件](#requirements)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)
    -   [リソース](#resources)



##<a id="introduction"></a>概要


### <a id="iglayoutmanager"></a>igLayoutManager の概要

`igLayoutManager` は、ページ要素を定義済み (カスタマイズ可能) のレイアウト パターン (「レイアウト」と呼びます) に配置することで、Web アプリケーションの HTML ページのレイアウト全体を管理するレイアウト コントロールです。この操作は、`igLayoutManager` を使用して選択されたレイアウトに応じて、ページにコンテナーを配置します。各アプリケーション ページの操作に加え、複数の Web ページの整理にこのコントロールが使用できます。以下の画像は、`igLayoutManager` の[](#column-layout)[列レイアウト](#column-layout)をカスタマイズした場合の HTML ページ配置を示します。

![](images/igLayoutManager_Overview_1.png)

`igLayoutManager` は、テーブルの使用または `<DIV>` 要素による手動レイアウトの簡単で効果的な代替になります。標準的なアプローチを使用して短時間に、最も人気のある Web ページを数限りないバリエーションで配置できます。

`igLayoutManager` により複数のレイアウトがサポート ([**サポートされるレイアウト**](#supported-layouts-summary-chart)を参照) され、各レイアウトはそれぞれ異なるレベルにカスタマイズできます。たとえば、[境界線レイアウト](#border-layout)では各要素の相対幅の他に表示状態も管理できます。また、[グリッド レイアウト](#grid-layout)では列数や行数、項目間の空白、複数行または複数列にまたがる項目の広がり (スパン)、項目自体とその他の配置とユーザーアクセス権などが構成可能です。構造上、[**列レイアウト**](#column-layout)は定義済みの CSS クラスのセットです。そのため、どのような効果でも任意で事前定義できます。

任意のレイアウトを選択するには、`igLayoutManager` コントロールの [layoutMode](%%jQueryApiUrl%%/ui.iglayoutmanager#options) プロパティを設定します。デフォルトのレイアウトは、[**列レイアウト**](#column-layout)です。レイアウトの構成やカスタマイズの詳細は、[igLayoutManager の追加](igLayoutManager-Adding.html)および[igLayoutManager の構成](igLayoutManager-Configuring-layouts.html)のトピックを参照してください。

### <a id="rwd-support"></a>RWD サポート

`igLayoutManager` コントロールのレイアウトは、本質的にレスポンシブ Web デザイン (RWD) やリキット Web デザインをサポートします。これは、項目のサイズ変更 (リキット デザイン) またはデザインの適応 (RWD) のどちらかで、ブラウザーのビューポート幅の変更に「すぐに」対応できることを意味します。

リキットまたはレスポンシブな動作は両方とも、コンテナーや要素の幅が絶対幅 (ピクセル単位) または相対幅 (パーセンテージ表示) のいずれかに応じて、有効あるいは無効になります。

以下の表で、幅のタイプの設定がレイアウトのデザインに与える影響を説明します。

コンテナーの幅|項目の幅|デザイン
---|---|---
パーセンテージ|パーセンテージ|リキット
パーセンテージ|ピクセル|レスポンシブ
ピクセル|任意|リキット、レスポンシブのどちらでもない





##<a id="supported-layouts"></a>サポートされるレイアウト


### <a id="supported-layouts-summary-chart"></a>サポートされるレイアウトの概要表

以下の表に、`igLayoutManager` コントロールのレイアウトの概要を示します。各レイアウトの詳細を概要表の後に各レイアウトの詳細を説明します。また、[igLayoutManager の構成](igLayoutManager-Configuring-layouts.html)のトピックも参照してください。

レイアウト|説明|外観
---|---|---
[](#border-layout)[境界線レイアウト](#border-layout)|境界線レイアウトはコンテナーを、ヘッダー、フッター、ボディ、左サイドバーおよび右サイドバーの各要素 (領域) に分割します。各要素には異なるコンテンツ項目が格納されています。|![](images/igLayoutManager_Overview_2.png)
[](#column-layout)[列レイアウト](#column-layout)|列レイアウトでは、コンテナーが 12 列に分割されます。列の各セットは独立した行に配置され、コンテンツ項目は左右の複数の列にまたがることができます。|![](images/igLayoutManager_Overview_3.png)
[](#flow-layout)[フロー レイアウト](#flow-layout)|フロー レイアウトではコンテンツ項目が左から右に配置され、コンテナーの右端に到達すると、折り返して左端から新しい行になります。|![](images/igLayoutManager_Overview_4.png)
[](#grid-layout)[グリッド レイアウト](#grid-layout)|グリッド レイアウトでは、列や行の数をカスタマイズできるグリッド システムに項目が配置されます。コンテンツ項目は、左右の複数列、および上下の複数行にまたがることができます。 |![](images/igLayoutManager_Overview_5.png)
[](#vertical-layout)[垂直レイアウト](#vertical-layout)|垂直レイアウトの場合、単一列の配列で形成されるため、コンテンツ項目は積み重ねるように上から下に配置されます。|![](images/igLayoutManager_Overview_6.png)


### <a id="border-layout"></a>境界線レイアウト

境界線レイアウトはコンテナーを、ヘッダー、フッター、ボディ、左サイドバー、および右サイドバーの各要素 (領域) に分割します。各要素には異なるコンテンツ項目が格納されています。

![](images/igLayoutManager_Overview_7.png)

境界線レイアウトは、ニュース配信や公告領域があるサイト、ブログなど、最も一般的なさまざまなレイアウト要件に適しています。

地域|クラス名
---|---
ヘッダー|[header](%%jQueryApiUrl%%/ui.iglayoutmanager#options)
フッター|[footer](%%jQueryApiUrl%%/ui.iglayoutmanager#options)
左サイドバー|[left](%%jQueryApiUrl%%/ui.iglayoutmanager#options)
右サイドバー|[right](%%jQueryApiUrl%%/ui.iglayoutmanager#options)
ボディ|[center](%%jQueryApiUrl%%/ui.iglayoutmanager#options)



>**注:** 上記のいずれのクラスも持たない子は使用されません。

ヘッダー、フッター、サイドバーの表示は、本文や左右のサイドバーと同様に構成可能です。

以下の画像は、境界線レイアウトのリキット デザインの効果を示します。

拡大されたブラウザー ビューポート|縮小されたブラウザー ビューポート
---|---
![](images/igLayoutManager_Overview_2.png)|![](images/igLayoutManager_Overview_9.png)



### <a id="column-layout"></a>列レイアウト

列レイアウトでは、コンテナーが 12 列に分割されます。連続する 12 列の各セットは、独立した行に配置されます。行や列は、DIV セクションで構成されています。レイアウト自体は、パーセント単位で表示する定義済みの CSS クラスで構成され、HTMLに適用すると、任意の列が配置できます。

![](images/igLayoutManager_Overview_10.png)

このアプローチの主なメリットは、レイアウトを非常に素早く実装できることです。空の Web ページにフレームワークを含めるだけで、任意のレイアウトを実装できます。

列よりも長いコンテンツ項目は、複数列にまたがることができます。以下の画像に、4 つのコンテンツ項目が各ツリー列にまたがって行を折り返えした状態の 1 行目、1 つの項目が 7 列にまたがった 2 行目、2 つの項目が、それぞれ 2 列、5 列にまたがった最終行 3 行目で構成された列レイアウトを示します。

![](images/igLayoutManager_Overview_11.png)

[グリッド レイアウト](#grid-layout)と異なり、列レイアウトには適切に動作する最低限の CSS セットが必要ですが、すべてのレイアウトの中で最もマークアップ構成が簡単です。row クラスを `<div>` 要素に割り当て、`<colN>` クラスをその子要素に割り当てるだけで、レイアウトを実装でき `igLayoutManager` をインスタンス化することありません。

以下の画像は、列レイアウトのリキット デザインの効果を示します。

拡大されたブラウザー ビューポート|縮小されたブラウザー ビューポート
---|---
![](images/igLayoutManager_Overview_1.png)|![](images/igLayoutManager_Overview_3.png)

列レイアウトの応答は、[CSS メディア クエリ](http://css-tricks.com/css-media-queries/)を使用して実装されます。これは、ビューポート幅 (1200 ピクセル以上、768～979 ピクセル内、767 ピクセル以下) の異なる範囲で定義済みの CSS クラスが提供されることを意味します。

次の画像に、列レイアウトのレスポンシブ デザインの効果を示します。

拡大されたブラウザー ビューポート|縮小されたブラウザー ビューポート
---|---
![](images/igLayoutManager_Overview_1.png)|![](images/igLayoutManager_Overview_15.png)


### <a id="flow-layout"></a>フロー レイアウト

フロー レイアウトではコンテンツ項目が左から右に配置され、コンテナーの右端に到達すると、折り返して左端から新しい行になります。項目の順は、項目を `igLayoutManager` コントロールに供給する配列の並べ替え順序に従います。以下の画像は、コンテナーの幅が 1 行に 7 項目のみ表示する場合の 9 項目の配置を概略図で示しています。

![](images/igLayoutManager_Overview_16.png)

フロー レイアウトにより多くのコンテンツ項目を自動的に配置すると、各項目の位置を明示的に指定する手間を省略することができます。フロー レイアウトは、さまざまなデザインに適用できます。たとえば、スクロール ディメンションに沿って 1 行に並んだ項目を作成する場合、項目のグリッドではなくスペースを調整します。項目はサイズを変えることもでき、従来のグリッドよりも非対称ながら、なおかつ線形のフローを持たせることができます。

>**注:** 各項目のサイズがすべて異なると、ブラウザーのレンダリング エンジンのロジックが配置に影響を与える場合があります。以下の画像では、ブラウザーのスペース利用効率のロジックにより、項目 4 が項目 1 の下の左端ではなく、項目 2 の右側の項目 3 の下で折り返し表示されています。これは、項目 2 が項目 1 やその行の他の項目より高さが大きく、下の空きスぺースが狭いため、項目 4 が挿入できないためです。

![](images/igLayoutManager_Overview_17.png)

以下の画像は、列レイアウトのリキット デザインとレスポンシブ デザインの両方の効果を示します (項目はサイズ変更され、次の行に再配置されています)。

拡大されたブラウザー ビューポート|縮小されたブラウザー ビューポート
---|---
![](images/igLayoutManager_Overview_18.png)|![](images/igLayoutManager_Overview_19.png)



### <a id="grid-layout"></a>グリッド レイアウト

グリッド レイアウトでは、項目が `<div>` 要素として定義された列および行から構成されるグリッド システムに配置されます。列や行の数および列の幅や高さは、カスタマイズ可能です。項目のサイズが変更された場合、コンテナーに合わせた再配置も選択できます。アニメーション化されたトランジションの期間も設定できます。

以下の画像は、2x2 のグリッド (2 列および 2 行) に配置された 4 つの項目を示しています。

![](images/igLayoutManager_Overview_20.png)

列や行をまたがることで、異なるサイズの項目に適応できます。項目に使用できるサイズは、各ディメンション (幅または高さ) でグリッド セル サイズの倍数であることに注意してください。以下の画像は、3x3 グリッドに配置された異なるサイズの 4 つの項目を概略図で示しています。左の一番上のセルは、右列および下側の行と接するセルにまたがっています。また、3 行目は左端のセルが右側の 3 列すべてにまたがっています。

![](images/igLayoutManager_Overview_21.png)

グリッド レイアウトでは、列や行の数、セルのサイズ、行や列にまたがる項目、セルのマージンおよびカラーがカスタマイズ可能です。

グリッド レイアウトを使用して作成すると、ビジュアルが充実し、構造的にバランスが取れたWeb サイトになります。グリット レイアウトにより、適切に配置されたデザイン要素を維持することができます。

[**列レイアウト**](#column-layout)と異なり、グリッド レイアウトではグリッドに持たせる列の数、その列の幅や高さを指定できるため、より高いレベルでレイアウトをカスタマイズできます。グリッド レイアウトにはその他に、コンテナーのサイズが変更された場合、項目の再配置を無効にするオプションがあります。項目が再配置されたときのアニメーションの期間も設定できます。

幅/高さを数値 (px として使用)、px、パーセンテージ、または幅/高さをすべての列で均等に分割するアスタリスク (`*`) に設定できます。グリッド レイアウトのもう 1 つの利点は、各列に固有の幅と高さを設定できることです。その 2 つのプロパティが配列を値として受け取ります。配列を定義する場合、1 つ以上の列が * 値を持つ場合、残りのスペースは列で均等に分割されます。

以下の画像は、グリッド レイアウトのリキット デザインの効果を示します。

拡大されたブラウザー ビューポート|縮小されたブラウザー ビューポート
---|---
![](images/igLayoutManager_Overview_22.png)|![](images/igLayoutManager_Overview_23.png)



以下の画像は、グリッド レイアウトのレスポンシブ デザインの効果を示します。

通常のブラウザー ビューポート|拡大されたブラウザー ビューポート
---|---
![](images/igLayoutManager_Overview_24.png)|![](images/igLayoutManager_Overview_25.png)



### <a id="vertical-layout"></a>垂直レイアウト

垂直レイアウトの場合、単一列の配列で形成されるため、コンテンツ項目は積み重ねるように上から下に配置されます。垂直レイアウトでは、項目をさまざまな高さや幅に設定できます。

![](images/igLayoutManager_Overview_26.png)

垂直レイアウトは、モバイル デバイス向けのプログラミングの使用に適しています。ニュース配信や、ストリームを生じるスポーツ中継などに最適です。

垂直レイアウトでは項目をさまざまな高さや幅に設定できます。このレイアウトで保持する列は 1 列のみです。

![](images/igLayoutManager_Overview_27.png)

以下の画像は、垂直レイアウトのリキット デザインの効果を示します。

拡大されたブラウザー ビューポート|縮小されたブラウザー ビューポート
---|---
![](images/igLayoutManager_Overview_28.png)|![](images/igLayoutManager_Overview_29.png)



##<a id="requirements"></a>要件


`igLayoutManager` コントロールは jQuery UI ウィジェットであるため、jQuery と jQuery の UI ライブラリに依存します。これらのリソースへの参照は、実際の jQuery または %%ProductNameMVC%% が使用されているとしても必要となります。コントロールが ASP.NET MVC のコンテクスト内で使用されている場合、Infragistics.Web.Mvc の組立が必要になります。

完全な要件の一覧については、[igLayoutManager の追加](igLayoutManager-Adding.html)のトピックを参照してください。



##<a id="related-content"></a>関連コンテンツ


### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


-	[igLayoutManager の追加](igLayoutManager-Adding.html): このトピックではコード例を使用して、HTML 単体、JavaScript または ASP.MVC 実装のいずれかで `igLayoutManager` コントロールを HTML ページに追加する方法を説明します。

-	[igLayoutManager の構成](igLayoutManager-Configuring-layouts.html): このトピックではコード例を使用して、`igLayoutManager` コントロールがサポートする別のレイアウトを設定する方法を説明します。

-	[イベント処理 (igLayoutManager)](igLayoutManager-Handling-Events.html): このトピックではコード例を使用して、`igLayoutManager` にイベント ハンドラーをアタッチする方法を説明します。

-	[igLayoutManager アクセシビリティの遵守](igLayoutManager-Accessibility-Compliance.html): このトピックは、`igLayoutManager` コントロールのアクセシビリティ機能を説明し、このコントロールを含むページのアクセシビリティ遵守を実現する方法に関する情報を提供します。

-	[既知の問題と制限 (igLayoutManager)](igLayoutManager-Known-Issues-and-Limitations.html): このトピックでは、`igLayoutManager` コントロールの既知の問題と制限に関する情報を提供します。

-	[jQuery および MVC API リファレンス リンク (igLayoutManager)](igLayoutManager-jQuery-and-ASP.NET-MVC-Helper-API-Links-.html):このトピックでは、`igLayoutManager` コントロールの jQuery および ASP.NET MVC ヘルパー クラスの API ドキュメントへのリンクを提供します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[ASP.NET MVC の基本的な使用方法](%%SamplesUrl%%/layout-manager/aspnet-mvc-helper): このサンプルでは、レイアウト マネージャー コントロールの ASP.NET MVC ヘルパーを使用する方法を紹介します。

-	[HTML マークアップからの境界線のレイアウト](%%SamplesUrl%%/layout-manager/border-layout-markup): このサンプルでは、「*center*」/「*left*」/「*right*」/「*header*」/「*footer*」 の各 CSS クラスを割り当て、HTML マークアップから `igLayoutManager` コントロールの境界線レイアウトを初期化する方法を紹介します。

-	[境界線のレイアウト - JavaScript による初期化](iglayoutmanager-adding.html#js-steps): このサンプルでは、[`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendered) イベントの処理や作成した領域へのコンテンツの割り当てによって、`igLayoutManager` コントロールの境界線レイアウトを JavaScript から初期化する方法を紹介します。

-	[レスポンシブ列レイアウト](%%SamplesUrl%%/layout-manager/column-layout-markup): このサンプルでは、項目にクラスを割り当て、その内容がまたがる領域を指定して、`igLayoutManager` コントロールの列レイアウトを使用する方法を紹介します。このサンプルは JavaScript の初期化コードを使用しません。CSS および HTML のみで実装されています。

-	[レスポンシブ フロー レイアウト](%%SamplesUrl%%/layout-manager/flow-layout): このサンプルは、さまざまな項目のサイズがピクセルまたはパーセンテージで設定された `igLayoutManager` コントロールのフロー レイアウトの応答について、また初期化のマークアップの必要なしで `igLayoutManager` のオプションに項目数を設定する方法を紹介します。

-	[colspan および rowspan 対応のグリッド レイアウト](%%SamplesUrl%%/layout-manager/grid-layout): このサンプルは、定義済みのサイズのグリッドに項目を任意の位置に配置できる `igLayoutManager` コントロールのグリッド レイアウトの機能を紹介します。rowspan や colspan がさまざまに設定された項目があります。

-	[カスタム サイズのグリッド レイアウト](%%SamplesUrl%%/layout-manager/grid-layout-custom-size): このサンプルは、`igLayoutManager` コントロールのグリッド レイアウトで各列に特定の幅および高さを指定する機能を紹介します。

-	[レスポンシブ垂直レイアウト](%%SamplesUrl%%/layout-manager/vertical-layout): このサンプルは、さまざまな項目のサイズがピクセルまたはパーセンテージで設定された `igLayoutManager` コントロールの垂直レイアウトの応答について、また初期化のマークアップの必要なしで `igLayoutManager` のオプションに項目数を設定する方法を紹介します。



### <a id="resources"></a>リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

-	[A List Apart: レスポンシブ Web デザイン](http://alistapart.com/article/responsive-web-design): このトピックでは、レスポンシブ Web デザインの主な原則を説明します。





 

 



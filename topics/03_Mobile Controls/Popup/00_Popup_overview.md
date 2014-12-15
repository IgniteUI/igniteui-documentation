<!--
|metadata|
{
    "fileName": "popup-overview",
    "controlName": "Popup",
    "tags": ["Layouts","MVC"]
}
|metadata|
-->

# Popup の概要

## トピックの概要

### 目的

このトピックでは、`Popup` MVC ラッパーを紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**Popup MVC ラッパーの主な機能の要点**](#summary)
-   [**Popup MVC ラッパーの機能**](#features)
	-   [配置](#positioning)
    -   [遷移](#transition)
    -   [テーマ設定とスタイル設定](#theming-styling)
    -   [属性](#attributes)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)


## <a id="introduction"></a> 概要

`Popup` は、ポップアップ ウィンドウに HTML コンテンツを表示できるウィジェットです。任意の HTML コンテンツを表示できます。ポップアップは HTML アンカーを利用すればを開きやすくなります。このウィジェットには、そのまますぐに使用できる機能セットがあります。

![](images/02_PopupOverview_1.png)



## <a id="summary"></a> Popup MVC ラッパーの主な機能の要点

以下の表は、`Popup` MVC ラッパーの主な機能をまとめたものです。

機能|説明
---|---
配置|`Popup` をどこに表示するか、親ウィンドウや相対要素に応じて選択できます。関連要素に最小スペースを設定する許容値を定義できます。
遷移|`Popup` は、jQuery 遷移値を受け付けて、いつ `Popup` が表示されるかという動作をカスタマイズできます。
テーマ設定とスタイル設定|オーバーレイ テーマ同様、一般 `Popup` テーマを設定します。`Popup` のシャドウとコーナーを定義できます。
属性|MVC `Popup` ラッパーには、クライアントでレンダリングされる HTML 属性のリストを受け付けるメソッドがあります。




## <a id="features"></a> Popup MVC ラッパーの機能

### <a id="positioning"></a> 配置

`Popup` をどこに表示するか、親ウィンドウや相対要素に応じて選択できます。このシナリオは、メソッド [`PositionTo`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~PositionTo.html) で実行できます。このメソッドは以下の値のどれかを受け付けます。

-   jQuery セレクター - ターゲット要素をピックします。例: `$(“#targetElementID”)`.`Popup` は相対要素の中心に移動します。
-   「origin」 - `popup` を開いたリンクの上に中心を揃えます。
-   「window」 - `popup` をウィンドウの中心に移動します。

 

関連要素に最小スペースを設定する許容値を定義できます。この結果は、メソッド [`Tolerance`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PopupWrapper~Tolerance.html) で実行できます。このメソッドは以下の値のどれかを受け付けます。

-   共通許容値 – `Popup` の上辺、右辺、下辺、左辺からの共通スペースを定義します。例: Tolerance(100)。
-   上/下と右/左許容値 – 上と下の距離に共通の距離を定義でき、さらに右と左のスペースに別の共通の値を定義できます。例: Tolerance(100, 150)。
-   個別の許容値 – 上から始まって、時計方向に `Popup` の各辺に個別に許容値を定義できます。例: Tolerance(100, 150, 50, 150)。

jQuery *Popup* ウィジェットの詳細については、[*Popup* プロパティのリファレンス](Popup-Property-Reference.html) トピックを参照してください。

### <a id="transition"></a> 遷移

`Popup` は、jQuery 遷移値を受け付けて、いつ `Popup` が表示されるかという動作をカスタマイズできます。設定できる値の詳細については、[Popup プロパティの参照](Popup-Property-Reference.html)ドキュメントを参照してください。

### <a id="theming-styling"></a> テーマ設定とスタイル設定

Page は、標準の [jQuery Mobile テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)に対応しています。特に指定しない限り、MVC ラッパーは、既定の jQuery モバイル形式 (つまり、テーマ 「c」) で各コントロールを表示します。以下の図では、`Popup` のテーマ 「a」 とオーバーレイ テーマ 「e」 が変更になり、シャドウが有効になっています。

![](images/02_PopupOverview_2.png)

### <a id="attributes"></a> 属性

MVC Page ラッパーは、クライアント側で表示される一連の HTML 属性に対応したメソッドを備えています。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Popup* の追加](Adding-Popup.html): このトピックでは、Infragistics MVC ラッパーを使用した `Popup` を有効にするために必要な情報を提供します。

- [Popup のプロパティ リファレンス](Popup-Property-Reference.html): このトピックでは、`Popup` MVC ラッパーのプロパティに関する参照情報について説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-popup/basic-usage): このサンプルでは、`Popup` ASP.NET MVC ヘルパーを初期化し、ボタン クリックで開く方法を紹介します。注: `Popup` Mobile ウィジェットは、jQuery モバイル 1.2.0 で初めて導入された機能です。





 

 



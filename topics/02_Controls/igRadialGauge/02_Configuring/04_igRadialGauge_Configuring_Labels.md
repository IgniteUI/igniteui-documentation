<!--
|metadata|
{
    "fileName": "igradialgauge-configuring-labels",
    "controlName": "igRadialGauge",
    "tags": ["Charting","Formatting","How Do I"]
}
|metadata|
-->

# ラベルの構成 (igRadialGauge)



## トピックの概要
### 目的

このトピックでは、`igRadialGauge`™ コントロールを使用したラベルの概念的な概要を提供します。ラベルのプロパティについて説明し、ラベルの構成方法の例も示します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igRadialGauge](igRadialGauge.html): このセクションでは、`igRadialGauge`™ コントロールおよびその主要機能の概要を説明します。

- [igRadialGauge の追加](igRadialGauge-Getting-Started-with-igRadialGauge.html): このトピックではコード例を使用して、`igRadialGauge`™ コントロールをページに追加する方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [ラベルの概要](#overview)
-   [プレビュー](#preview)
-   [ラベルのプロパティとイベント](#lable-properties)
-   [ラベルの構成](#config-lable)
-	[例](#lable-example)
-   [関連コンテンツ](#related-content)



##<a id="overview"></a>ラベルの概要 

### ラベルの概要

ゲージ ラベルはスケールで指定された間隔で数値を表示する視覚要素です。

### <a id="preview"></a>プレビュー

以下の画像は、ラベルを表示する `igRadialGauge` コントロールのプレビューです。

![](images/igRadialGauge_Getting_Started_01.png)



## <a id="lable-properties"></a>ラベルのプロパティとイベント
### ラベルのプロパティとイベントの概要

以下の表で、`igRadialGauge` コントロールのラベルのプロパティを簡単に説明します。

プロパティ名|プロパティ タイプ|説明
---|---|---
labelExtent|double|ゲージの中心に 0 のラベルを配置し、ゲージの半径 1 のラベルを配置した場合のゲージの中心からの距離 0 と 1 の間の値としてのラベル位置を決定します。
labelInterval|double|ラベルの描画に使用する間隔を決定します。デフォルトで、スケールの目盛と同じ間隔です。


以下の表で、`igRadialGauge` コントロールのラベルに関連するイベントを簡単に説明します。

イベント名|説明
---|---
alignLabel|このイベントは、ゲージ ラベルがスケールに沿って配置されると発生します。
formatLabel|このイベントは、ゲージ ラベルが書式設定されると発生します。


##<a id="config-lable"></a>ラベルの構成 

### 例

以下のスクリーンショットは、ラベルのプロパティを以下の構成にした場合の `igRadialGauge` コントロールの描画方法を示しています。

プロパティ|値
---|---
labelInterval|15
labelExtent|0.44



![](images/igRadialGauge_Label_01.png)

以下のコードはこの例を実装します。

 **JavaScript の場合:**   
 
```js 
$("#gauge").igRadialGauge({                                                
	width: "400px",
	height: "400px",        
	labelExtent: 0.44,                                
	labelInterval: 15                                                     
 });                                                                  
```

## <a id="lable-example"></a>例

以下のサンプルでは、ラジアル ゲージ コントロールのラベルを設定する方法を紹介します。スライダーを使用して、labelExtent および labelInterval プロパティの Label への影響を確認します。

<div class="embed-sample">
   [%%SamplesEmbedUrl%%/radial-gauge/label-settings](%%SamplesEmbedUrl%%/radial-gauge/label-settings)
</div>


## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igRadialGauge の追加](igRadialGauge-Getting-Started-with-igRadialGauge.html): このトピックではコード例を使用して、`igRadialGauge`™ コントロールを %%PlatformName%% アプリケーションに追加する方法を説明します。

- [背景の構成 (igRadialGauge)](igRadialGauge-Configuring-the-Backing.html): このトピックでは、`igRadialGauge`™ コントロールのバッキング機能の概念的な概要を提供します。バッキング領域のプロパティについて説明し、実装例を提供します。

- [針の構成 (igRadialGauge)](igRadialGauge-Configuring-Needles.html): このトピックでは、`igRadialGauge`™ コントロールを使用した針の概念的な概要を提供します。針のプロパティについて説明し、針の構成方法の例も示します。

- [範囲の構成 (igRadialGauge)](igRadialGauge-Configuring-Ranges.html): このトピックでは、`igRadialGauge`™ コントロールの範囲の概念的な概要を提供します。範囲のプロパティについて説明し、範囲をラジアル ゲージに追加する方法の例も示します。

- [スケールの構成 (igRadialGauge)](igRadialGauge-Configuring-the-Scales.html): このトピックでは、`igRadialGauge`™ コントロールのスケールの概念的な概要を提供します。スケールのプロパティについて説明し、スケールの実装方法の例も示します。

- [目盛の構成 (igRadialGauge)](igRadialGauge-Configuring-Tick-Marks.html): このトピックでは、`igRadialGauge`™ コントロールを使用した目盛の概念的な概要を提供します。目盛のプロパティについて説明し、目盛の実装方法の例を示します。



### サンプル

このトピックについては、以下のサンプルも参照してください。

- [API の使用](%%SamplesUrl%%/radial-gauge/api-usage): ボタンおよび API ビューアーが `igRadialGauge` の針のメソッドを紹介します。ボタンをクリックすると、ランタイムで針の値を変更するか、針の現在値を取得できます。

- [ゲージのアニメーション](%%SamplesUrl%%/radial-gauge/motion-framework): このサンプルは、`transitionDuration` プロパティを設定してラジアル ゲージを簡単にアニメーション化する方法を紹介します。

- [ゲージ針](%%SamplesUrl%%/radial-gauge/gauge-needle): ポインターとして表示される針は、スケールで単一の値を示します。以下のオプション ペインでラジアル ゲージコントロールの針を操作できます。

- [針のドラッグ](%%SamplesUrl%%/radial-gauge/drag-needle): このサンプルは、Mouse イベントを使用してラジアル ゲージ コントロールの針をドラッグする方法を紹介します。

- [範囲](%%SamplesUrl%%/radial-gauge/range): 範囲は、スケールで値の指定した領域を強調表示する視覚的な要素です。オプション ペインを使用してラジアルゲージコントロールの Range プロパティを設定できます。

- [スケールの設定](%%SamplesUrl%%/radial-gauge/scale-settings): スケールは、ラジアル ゲージで値の範囲を定義します。オプション ペインを使用してラジアルゲージコントロールの Scale プロパティを設定できます。

- [目盛](%%SamplesUrl%%/radial-gauge/tickmarks): ゲージの目盛をユーザーが指定した間隔で表示できます。オプション ペインを使用してラジアル ゲージ コントロールの目盛プロパティを設定できます。





 

 



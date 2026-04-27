<!--
|metadata|
{
    "fileName": "igradialgauge-configuring-the-scales",
    "controlName": "igRadialGauge",
    "tags": ["Charting","How Do I","Tips and Tricks"]
}
|metadata|
-->

# スケールの構成 (igRadialGauge)



## トピックの概要
### 目的

このトピックでは、`igRadialGauge`™ コントロールのスケールの概念的な概要を提供します。スケールのプロパティについて説明し、スケールの実装方法の例も示します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igRadialGauge](igRadialGauge.html): このセクションでは、`igRadialGauge`™ コントロールおよびその主要機能の概要を説明します。

- [igRadialGauge の追加](igRadialGauge-Getting-Started-with-igRadialGauge.html): このトピックではコード例を使用して、`igRadialGauge`™ コントロールをページに追加する方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [スケールの概要](#overview)
-   [プレビュー](#preview)
-   [スケールのプロパティ](#scale-properties)
-   [スケールの構成](#config-scale)
-   [関連コンテンツ](#related-content)



## <a id="overview"></a>スケールの概要
### スケールの概要

スケールはゲージの値を視覚的に示すために使用され、`igRadialGauge` コントロールで値の範囲を定義します。目盛と範囲はすべて要素で、スケールに追加できます。

### <a id="preview"></a>プレビュー

以下の画像は、スケールを追加した `igRadialGauge` コントロールのプレビューです。

![](images/igRadialGauge_Getting_Started_01.png)



## <a id="scale-properties"></a>スケールのプロパティ
### スケールのプロパティの概要

以下の表で、`igRadialGauge` コントロールのスケールに関連するプロパティを簡単に説明します。

<table class="table">
	<thead>
		<tr>
            <th>
プロパティ名
			</th>

            <th>
プロパティ タイプ
			</th>

            <th>
説明
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
`scaleStartExtent`
			</td>

            <td>
`double`
			</td>

            <td>
ゲージの中心から測定される、スケールの開始位置を決定します。このプロパティの値の範囲は 0 から 1 です。

                このプロパティの値を、`scaleEndExtent` プロパティよりも大きく設定すると、開始範囲はデフォルト設定されている実際の `scaleEndExtent` 値に戻ります。
			</td>
        </tr>

        <tr>
            <td>
`scaleEndExtent`
			</td>

            <td>
`double`
			</td>

            <td>
ゲージの中心から測定される、スケールの終了位置を決定します。このプロパティの値の範囲は 0 から 1 です。

                このプロパティの値を、`scaleStartExtent` プロパティよりも小さく設定すると、終了範囲はデフォルト設定されている実際の `scaleStartExtent` 値に戻ります。
			</td>
        </tr>

        <tr>
            <td>
`scaleStartAngle`
			</td>

            <td>
`double`
			</td>

            <td>
スケールの開始角度を度数で指定します。
			</td>
        </tr>

        <tr>
            <td>
`scaleEndAngle`
			</td>

            <td>
`double`
			</td>

            <td>
スケールの終了角度を度数で指定します。
			</td>
        </tr>

        <tr>
            <td>
`scaleOversweep`
			</td>

            <td>
`double`
			</td>

            <td>
スケールが両方向で、開始と終了の値を越えて移動する余分なスペース (度数) の値を指定します。値を 0 より大きい値に設定する必要があります。デフォルト値は 3 です。
			</td>
        </tr>

        <tr>
            <td>
`scaleBrush`
			</td>

            <td>
`brush`
			</td>

            <td>
スケールの背景の塗りつぶし使用するブラシを指定します。
			</td>
        </tr>

        <tr>
            <td>
`scaleSweepDirection`
			</td>

            <td>
`sweepDirection`
			</td>

            <td>
スケールの移動を時計周りまたは反時計回りに指定します。
			</td>
        </tr>

        <tr>
            <td>
`scaleOversweepShape`
			</td>

            <td>
`radialGaugeScaleOversweepShape`
			</td>

            <td>
                <table class="table">
	<thead>
		
	</thead>
	<tbody>
                        <tr>
                            <td>
circular
			</td>

                            <td>
図形の終了部分を描く角度を大きくします。
			</td>
                        </tr>

                        <tr>
                            <td>
fitted
			</td>

                            <td>
外部アークと内部アークの角度を大きくします。ただし、`scaleOversweep` プロパティが 0 に設定された場合、スケール図形の接続線を平衡に保持するように内部アークの角度をより大きくします。
			</td>
                        </tr>

                        <tr>
                            <td>
auto
			</td>

                            <td>
プロパティのデフォルト設定が Auto の場合は背景図形が自動的に決定され、それに応じて `scaleOversweep` プロパティを設定します。
			</td>
                        </tr>
                    </tbody>
</table>
                <br>

                このプロパティを Circular に設定し、`backingShape` プロパティの値を Fitted に設定した場合、スケールと背景図形のアークとの間に目視できるギャップが表示されます。
                    スケールをゲージの背景領域と正しく揃えるには、`scaleOversweep` プロパティと `backingShape` プロパティを同じ値に設定する必要があります。
            </td>
        </tr>
    </tbody>
</table>


##<a id="config-scale"></a>スケールの構成 

### 例

以下のスクリーンショットは、スケール プロパティを以下のように構成して `igRadialGauge` を描画する方法を示します。

プロパティ|値
---|---
`scaleStartExtent`|0.5
`scaleEndExtent`|0.4
`scaleOversweep`|15
`scaleSweepDirection`|counterclockwise



![](images/igRadialGauge_Scale_01.png)

以下のコードはこの例を実装します。

 **JavaScript の場合:**  
 
```js                                                                                                                                   $("#gauge").igRadialGauge({                                                  
	width: "400px",
	height: "400px",
	scaleStartExtent: 0.5,
	scaleEndExtent: 0.4, 
	scaleOversweep: 15,
	scaleSweepDirection: "counterclockwise"     
 });                                                                  
```

## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igRadialGauge の追加](igRadialGauge-Getting-Started-with-igRadialGauge.html): このトピックではコード例を使用して、`igRadialGauge`™ コントロールを %%PlatformName%% アプリケーションに追加する方法を説明します。

- [背景の構成 (igRadialGauge)](igRadialGauge-Configuring-the-Backing.html): このトピックでは、`igRadialGauge`™ コントロールのバッキング機能の概念的な概要を提供します。バッキング領域のプロパティについて説明し、実装例を提供します。

- [ラベルの構成 (igRadialGauge)](igRadialGauge-Configuring-Labels.html): このトピックでは、`igRadialGauge`™ コントロールを使用したラベルの概念的な概要を提供します。ラベルのプロパティについて説明し、ラベルの構成方法の例も示します。

- [針の構成 (igRadialGauge)](igRadialGauge-Configuring-Needles.html): このトピックでは、`igRadialGauge`™ コントロールを使用した針の概念的な概要を提供します。針のプロパティについて説明し、針の構成方法の例も示します。

- [範囲の構成 (igRadialGauge)](igRadialGauge-Configuring-Ranges.html): このトピックでは、`igRadialGauge`™ コントロールの範囲の概念的な概要を提供します。範囲のプロパティについて説明し、範囲をラジアル ゲージに追加する方法の例も示します。

- [目盛の構成 (igRadialGauge)](igRadialGauge-Configuring-Tick-Marks.html): このトピックでは、`igRadialGauge`™ コントロールを使用した目盛の概念的な概要を提供します。目盛のプロパティについて説明し、目盛の実装方法の例を示します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [API の使用](%%SamplesUrl%%/radial-gauge/api-usage): ボタンおよび API ビューアーが `igRadialGauge` の針のメソッドを紹介します。ボタンをクリックすると、ランタイムで針の値を変更するか、針の現在値を取得できます。

- [ゲージのアニメーション](%%SamplesUrl%%/radial-gauge/motion-framework): このサンプルは、`transitionDuration` プロパティを設定してラジアル ゲージを簡単にアニメーション化する方法を紹介します。

- [ゲージ針](%%SamplesUrl%%/radial-gauge/gauge-needle): ポインターとして表示される針は、スケールで単一の値を示します。以下のオプション ペインでラジアル ゲージコントロールの針を操作できます。

- [ラベル設定](igradialgauge-configuring-labels.html#lable-example): このサンプルは、ラジアル ゲージ コントロールのラベル設定の方法を紹介します。スライダーを使用して、`labelInterval` および `labelExtent` プロパティのラベルへの影響を確認できます。

- [針のドラッグ](%%SamplesUrl%%/radial-gauge/drag-needle): このサンプルは、Mouse イベントを使用してラジアル ゲージ コントロールの針をドラッグする方法を紹介します。

- [範囲](%%SamplesUrl%%/radial-gauge/range): 範囲は、スケールで値の指定した領域を強調表示する視覚的な要素です。オプション ペインを使用してラジアルゲージコントロールの Range プロパティを設定できます。

- [スケールの設定](%%SamplesUrl%%/radial-gauge/scale-settings): スケールは、ラジアル ゲージで値の範囲を定義します。オプション ペインを使用してラジアルゲージコントロールの Scale プロパティを設定できます。

- [目盛](%%SamplesUrl%%/radial-gauge/tickmarks): ゲージの目盛をユーザーが指定した間隔で表示できます。オプション ペインを使用してラジアル ゲージ コントロールの目盛プロパティを設定できます。





 

 



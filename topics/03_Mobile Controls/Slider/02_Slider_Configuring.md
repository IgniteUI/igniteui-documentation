<!--
|metadata|
{
    "fileName": "slider-configuring",
    "controlName": "Slider",
    "tags": ["How Do I","MVC"]
}
|metadata|
-->

# Slider の構成

## トピックの概要

### 目的

このトピックでは、ASP.NET MVC ヘルパーを使用してスライダーを構成するために必要な情報を提供します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Slider の概要](Slider-Overview.html): このトピックでは、Slider ASP.NET MVC ヘルパーの機能を説明しています。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**スライダー構成の概要**](#summary)
-   [**スライダーのデフォルトの最小値/最大値の変更**](#min-max-value)
-   [**スライダーのラベルの設定**](#label)
-   [**スライダーのラベルの配置の変更**](#label-alignment)
-   [**数値入力の表示モードの設定**](#numeric-input)
-   [**スライダーのラベルの非表示設定**](#label-hiding)
-   [**スライダーの無効化**](#disable)
-   [**スライダーの mini バージョンの使用**](#mini)
-   [**スライダーの手順の変更**](#step)
-   [**スライダーの強調表示**](#highlight)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="summary"></a> スライダー構成の概要

以下の表は、`Slider` ASP.NET MVC ヘルパーの構成可能な要素を示しています。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
構成可能な点
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
デフォルトの最小値/最大値を変更する
			</td>
            <td>
Slider ASP.NET MVC ヘルパーの [`MinValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html) および [`MaxValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html) プロパティは、`slider` のデフォルトの境界を変更するために使用します。デフォルトでは 0 から 100 の間の値です。
			</td>
            <td>
                <ul>
                    <li>
[MinValue](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html)
					</li>
                    <li>
[MaxValue](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
スライダーのラベルを構成する
			</td>
            <td>
ラベル テキストの値を設定し、[`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html) プロパティを使用してラベルを配置できます。[`HideLabel`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~HideLabel.html) プロパティは、ラベルを非表示にするために使用します。
			</td>

            <td>
                <ul>
                    <li>
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html)
					</li>
                    <li>
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html)
					</li>
                    <li>
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~HideLabel.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
デフォルト値を設定する
			</td>
            <td>
デフォルトでは、スライダーは値を *0* に設定して初期化されます。[`Value`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html) プロパティは値を変更するために使用します。
			</td>
            <td>
                <ul>
                    <li>
[Value](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ウィジェットの mini バージョンを使用する
			</td>
            <td>
[`Mini`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Mini.html) プロパティを有効にすると、サイズの小さいスライダーが出力されます。
			</td>
            <td>
                <ul>
                    <li>
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Mini.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
スライダーを無効にする
			</td>
            <td>
`Slider` は読み取り専用のウィジェットとして初期化できます。
			</td>
            <td>
                <ul>
                    <li>
[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Disabled.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
スライダーの手順を変更する
			</td>
            <td>
[`Step`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Step.html) プロパティは、変更イベントが発生した場合の間隔を定義するために使用します。
			</td>
            <td>
                <ul>
                    <li>
[Step](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Step.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
スライダーでの強調表示を有効にする
			</td>
            <td>
[`Highlight`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Highlight.html) プロパティは、`slider` について選択した値を強調表示するために使用します。
			</td>
            <td>
                <ul>
                    <li>
[Highlight](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Highlight.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>




## <a id="min-max-value"></a> スライダーのデフォルトの最小値/最大値の変更

スライダーのデフォルトの最小値と最大値は、[`MinValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html) および [`MaxValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html) プロパティを使用して変更します。

### プロパティ設定

以下の表に、スライダーの境界を “20” から “60” に設定する構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
最小値を 20 に設定する|[MinValue](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html)|20.0
最大値を 60 に設定する|[MaxValue](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html)|60.0


### コード例

次のスクリーンショットで示す 2 つのスライダーは、[`MinValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html) プロパティを *20.0* に設定したスライダーと、[`MaxValue`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html) プロパティを *60* に設定したスライダーです。上部のスライダーでは [`Value`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html) プロパティが 「*20.0*」 に設定され、下部のスライダーでは [`Value`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html) プロパティが 「*60*」 に設定されています。

![](images/Slider_Configuring_1.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(20.0)
    .MinValue(20.0)
    .MaxValue(60.0)
    .Render()
)

@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(60.0)
    .MinValue(20.0)
    .MaxValue(60.0)
    .Render()
)
```



## <a id="label"></a> スライダーのラベルの設定

スライダーのラベルのテキストは、`Slider` ASP.NET MVC ヘルパーの [`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html) プロパティを使用して変更できます。

### プロパティ設定

以下の表に、スライダーのラベルを 「Volume」 に設定するために必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
ラベルのテキストを 「Volume」 に設定する|[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html)|“Volume”


### コード例:

以下のスクリーンショットは、[`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html) プロパティを 「*Volume*」 に設定した場合のスライダーの表示結果です。

![](images/Slider_Configuring_2.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .Label("Volume")
    .Render()
)
```



## <a id="label-alignment"></a> スライダーのラベル配置の変更

ラベルの位置は、[`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html) プロパティを使用して変更します。Left、Right、Top、Bottom の 4 つの値を選択できます。

#### プロパティ設定

以下の表は、`slider` の下にラベルを配置するために必要な構成を示しています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
ラベルをスライダーの下に配置する|[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html)|*Alignment.Bottom*


### コード例

以下のスクリーンショットは、[`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html) プロパティを *Alignment.Bottom* に設定した場合のスライダーの表示結果を示しています。

![](images/Slider_Configuring_3.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .Label("Volume")
    .LabelAlignment(Alignment.Bottom)
    .Render()
)
```



## <a id="numeric-input"></a> 数値入力の表示モードの設定

スライダーの数値入力の表示モードは、[`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティを使用して変更します。

#### プロパティ設定

以下の表に、3 つの値 「*Block*」、「*Inline*」、「*None*」 を使用して [`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティを設定するために必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
入力の表示モードを Block に設定する|[NumericInputDisplayMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) |DisplayMode.Block
入力の表示モードを Inline に設定する|[NumericInputDisplayMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html)|DisplayMode.Inline
入力の表示モードを None に設定する|[NumericInputDisplayMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html)|DiplayMode.None


### コード例

以下のスクリーンショットには、[`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) に 3 つの値を設定した状態を示す 3 つのスライダーがあります。上のスライダーでは [`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティが 「*Inline*」 に設定され、中央のスライダーでは [`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティが 「*Block*」 に設定され、下のスライダーでは [`NumericInputDisplayMode`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html) プロパティが 「*None*」 に設定されています。

![](images/Slider_Configuring_4.png)

**Razor の場合:**

```
@(
    Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .NumericInputDisplayMode(DisplayMode.Inline)
    .Render()
)

@(
    Html.InfragisticsMobile()
    .Slider()
    .NumericInputDisplayMode(DisplayMode.Block)
    .Value(30.0)
    .Render()
)

@(
    Html.InfragisticsMobile()
    .Slider()
    .NumericInputDisplayMode(DisplayMode.None)
    .Value(30.0)
    .Render()
)
```



## <a id="label-hiding"></a> スライダーのラベルの非表示設定

スライダーのラベルの表示/非表示は、[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~HideLabel.html) プロパティを使用して構成します。

### プロパティ設定

以下の表は、スライダーのラベルを非表示にするために必要な構成を示しています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
ラベルを非表示にする|[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~HideLabel.html)|true


### コード例

以下のスクリーンショットは、ラベルを非表示にした結果、スライダーがどのように表示されるかを示しています。

![](images/Slider_Configuring_5.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .Label("Volume")
    .Hidelabel(true)
    .Render()
)
```



## <a id="disable"></a> スライダーの無効化

`slider` は読み取り専用に設定できます。

### プロパティ設定

以下の表は、スライダーを読み取り専用にするために必要な構成を示しています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
スライダーを無効にする|[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Disabled.html)|true


### コード例

以下のスクリーンショットは、スライダーを読み取り専用に構成した場合の表示結果を示しています。

![](images/Slider_Configuring_6.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .Disabled(true)
    .Render()
)
```



## <a id="mini"></a> スライダーの mini バージョンの使用

`スライダー`の mini バージョンを使用すると、標準バージョンのスライダーよりも高さが低くトラックが小さいスライダーが生成されます。

### プロパティ設定

以下の表は、スライダーをコンパクトにするために必要な構成を示しています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
Mini プロパティを有効にする|[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Mini.html)|true


### コード例

以下のスクリーンショットは、通常のスライダーと mini スライダーの違いを示しています。

![](images/Slider_Configuring_7.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .Label("Mini")
    .Mini(true)
    .Render()
)
<br />
@(
 Html.InfragisticsMobile()
    .Slider()
    .Label("Normal")
    .Value(30.0)
    .Render()
)
```



## <a id="step"></a> スライダーの手順の変更

`slider` の変更イベントが発生する現在の値の差分は、`slider` ASP.NET MVC ヘルパーの [`Step`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Step.html) プロパティを使用して構成します。

### プロパティ設定

以下の表は、[`Step`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Step.html) プロパティを 10.0 に設定するために必要な構成を示しています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
Step プロパティを 10 に設定する|[Step](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Step.html)|10.0


### コード例

このコード例は、ASP.NET MVC ヘルパーを使用して、スライダーの Step プロパティを 「10.0」 に設定する方法を示しています。

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Step(10.0)
    .Render()
)
```



## <a id="highlight"></a> スライダーの強調表示

`slider` の強調表示は、[`Highlight`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Highlight.html) プロパティを使用して構成します。

### プロパティ設定

以下の表は、スライダーの [`Highlight`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Highlight.html) を有効にするために必要な構成を示しています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|--------------
強調表示を有効にする|[Highlight](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Highlight.html)|“true”


### コード例

以下のスクリーンショットでは、2 つのスライダーがインスタンス化されています。上のスライダーでは [`Highlight`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Highlight.html) プロパティが 「*true*」 に設定され、下のスライダーではデフォルト値が設定されています。

![](images/Slider_Configuring_8.png)

**Razor の場合:**

```
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .Label("Hightlight")
    .Highlight(true)
    .Render()
)
<br />
@(
 Html.InfragisticsMobile()
    .Slider()
    .Value(30.0)
    .Label("Normal")
    .Render()
)
```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Slider の概要](Slider-Overview.html): このトピックでは、`Slider` ASP.NET MVC ヘルパーの機能を説明しています。

- [Slider の追加](Slider-Adding.html): このトピックでは、Infragistics ASP.NET MVC ヘルパーを使用して jQuery Mobile `slider` を追加する方法を説明しています。

- [Slider プロパティ参照](Slider-Property-Reference.html): このトピックでは、`Slider` ASP.NET MVC ヘルパーのプロパティに関する参照情報を提供しています。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-slider/basic-usage): このサンプルでは、基本の例で `Slider` ASP.NET MVC ヘルパーを使用する方法を紹介します。
    
- [カラー ピッカー](%%SamplesUrl%%/mobile-slider/color-picker): このサンプルでは、カラー ピッカー シナリオで `Slider` ASP.NET MVC ヘルパーを使用する方法を紹介します。スライダーを移動させると、四角形の色が変わり、その色の 16 進数値が自動的に表示されます。





 

 



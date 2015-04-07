<!--
|metadata|
{
    "fileName": "toggleswitch-configuring",
    "controlName": "ToggleSwitch",
    "tags": ["Editing","How Do I","MVC"]
}
|metadata|
-->

# ToggleSwitch の構成

## トピックの概要

### 目的

このトピックでは、`Toggle Switch`™ MVC ラッパーを構成する方法について説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [Toggle Switch の概要](ToggleSwitch-Overview.html): このトピックでは、`Toggle Switch` MVC ラッパーとその主な機能の概要を示します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**Toggle Switch の構成の概要**](#summary)
-   [**Toggle Switch のデフォルト状態の変更**](#default-state)
    -   [プロパティ設定](#default-state-property)
    -   [コード例](#default-state-example)
-   [**状態ラベルの構成**](#state-label)
    -   [プロパティ設定](#state-label-property-settings)
    -   [コード例](#state-label-example)
-   [**オプションのスイッチ ラベルの構成**](#label)
    -   [プロパティ設定](#label-property-settings)
    -   [コード例](#label-example)
-   [**Toggle Switch のサイズ変更**](#resize)
    -   [プロパティ設定](#resize-property-settings)
    -   [コード例](#resize-example)
-   [**Toggle Switch のユーザー操作の無効化**](#disable)
    -   [プロパティ設定](#disable-property-settings)
    -   [コード例](#disable-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)


## <a id="summary"></a> Toggle Switch の構成の概要

以下の表は、toggle switch MVC ラッパーの構成可能な要素を示しています。

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
[*ToggleSwitch* のデフォルト状態](#default-state)
			</td>
            <td>
`Toggle Switch` (Enabled/ Disabled) の論理状態は、[`SwitchedState`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html) プロパティで管理されます。このプロパティをウィジェットの初期化時に設定しておくことが、このウィジェットの既定状態を効率的に変更する方法です。
			</td>
            <td>
                <ul>
                    <li>
[SwitchedState](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[状態ラベルのテキスト](#state-label)
			</td>
            <td>
スイッチの状態 (*On*、デフォルトでは *Off*) を示すテキスト ラベルは、2 つの異なるプロパティで設定された 2 つのテキスト文字列 (それぞれ Enabled 状態と Disabled 状態) から実装されています。
			</td>
            <td>
                <ul>
                    <li>
[OnText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OnText.html)
					</li>
                    <li>
[OffText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OffText.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[スイッチ ラベル](#label)
			</td>
            <td>
`Toggle Switch` のオプション ラベルは、`テキスト`、`位置`、`表示状態`の点で構成できます。

                これらの点はそれぞれ、専用のプロパティで管理されます。
			</td>
            <td>
                <ul>
                    <li>
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Label.html)
					</li>
                    <li>
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~LabelAlignment.html)
					</li>
                    <li>
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~HideLabel.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[ToggleSwitch のサイズ](#resize)
			</td>
            <td>
ウィジェットのサイズは、幅とスケールの 2 つの点で構成できます。

これらの点はそれぞれ、専用のプロパティで管理されます。
			</td>
            <td>
                <ul>
                    <li>
[Width](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Width.html)
					</li>
                    <li>
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Mini.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[操作モード](#disable)
			</td>
            <td>
`Toggle Switch` には、編集と読み取り専用の 2 つの操作モードがあるため、必要な場合は読み取り専用ウィジェットとして構成できます。
			</td>
            <td>
                <ul>
                    <li>
[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Disabled.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



## <a id="default-state"></a> Toggle Switch のデフォルト状態の変更 

`Toggle Switch` (Enabled/ Disabled) の論理状態は、[`SwitchedState`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html) プロパティで管理されます。このプロパティをウィジェットの初期化時に設定しておくことが、このウィジェットの既定状態を効率的に変更する方法です。

デフォルトでは、`Toggle Switch` は Disabled 状態に初期化されています ([`SwitchedState`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html) プロパティが *false*)。

### <a id="default-state-property"></a> プロパティ設定

以下の表では、toggle switch を true 状態に初期化するために、目的の構成をマップしています。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|---------------
Toggle Switch 状態に設定する|[SwitchedState](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html)|true または false


### <a id="default-state-example"></a> コード例

以下のコードは、[`SwitchedState`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html) プロパティを true に設定して初期化することで、`Toggle Switch` のデフォルト状態を変更する方法を示しています。

![](images/ToggleSwitch_Configuring_1.png)

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .SwitchedState(true)
    .Render()
)
```



## <a id="state-label"></a> 状態ラベルの構成

スイッチの状態 (既定では*オン*と*オフ*) は、(有効な状態と無効な状態を表す) 2 つのテキスト文字列を用いて実装されます。この文字列は、それぞれ [`OnText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OnText.html) と [`OffText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OffText.html) プロパティで設定します。

### <a id="state-label-property-settings"></a> プロパティ設定

以下の表に、これらを管理するプロパティ設定に必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
-------------|--------------------|---------------
テキスト ラベルを Enable 状態に設定する|[OnText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OnText.html)|目的のテキスト文字列
テキスト ラベルを Disable 状態に設定する|[OffText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OffText.html)|目的のテキスト文字列



### <a id="state-label-example"></a> コード例

以下のコード スニペットは、`Toggle Switch` の Disabled 状態 (*Off*) のデフォルト テキストを [`OffText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OffText.html) プロパティを設定して Disable に、Enabled 状態のデフォルト テキストを [`OnText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OnText.html) プロパティを設定して *Enable* に変更する方法を示しています。

![](images/ToggleSwitch_Configuring_2.png)

![](images/ToggleSwitch_Configuring_3.png)

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .OffText("Disable")
    .Render()
)
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .OnText("Enable")
    .Render()
)
```


## <a id="label"></a> オプションのスイッチ ラベルの構成 

Toggle Switch のオプション ラベルは、以下の点で構成できます。

-   テキスト - ラベルのテキスト
-   位置 - 「switch」 に対するラベルの位置
-   表示状態 - ラベルの表示または非表示: 特定の状況では、ラベルを非表示にする場合があります (デフォルトでは構成されたラベルは表示されます)

これらの点はそれぞれ、専用のプロパティで管理されます。

### <a id="label-property-settings"></a> プロパティ設定

以下の表では、希望の構成をプロパティ設定にマップしています。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
目的:
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
スイッチ ラベルのテキストを設定する
			</td>
            <td>
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Label.html)
			</td>
            <td>
目的のテキスト文字列
			</td>
        </tr>

        <tr>
            <td>
スイッチ ラベルの位置を設定する
			</td>
            <td>
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~LabelAlignment.html)
			</td>
            <td>
以下のいずれかを指定
                <ul>
                    <li>
Left
					</li>
                    <li>
Right
					</li>
                    <li>
Top
					</li>
                    <li>
Bottom
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ラベルの表示または非表示
			</td>
            <td>
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~HideLabel.html)
			</td>
            <td>
                <ul>
                    <li>
true - ラベルを非表示にする
					</li>
                    <li>
false - ラベルを表示する
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>


### <a id="label-example"></a> コード例

以下のコード スニペットは、[`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Label.html) プロパティを 「*Lights*」、[`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~LabelAlignment.html) プロパティを *Top*に設定し (左図)、同じラベルを非表示にする (右図) ことで、スイッチの上部に Lights というスイッチ ラベルを設定する方法を示しています。

<table class="table">
	<tbody>
		<tr>
			<td>
![](images/ToggleSwitch_Configuring_4.png)
            </td>
			<td>
![](images/ToggleSwitch_Configuring_5.png)
            </td>
        </tr>
    </tbody>
</table>

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .Label("Lights")
    .LabelAlignment(Alignment.Top)
    .Render()
)
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .Label("Lights")
    .Hidelabel(true)
    .LabelAlignment(Alignment.Top)
    .Render()
)
```


## <a id="resize"></a> Toggle Switch のサイズ変更

ウィジェットのサイズは、次の 2 とおりの方法で構成できます。

-   MVC ラッパーの [`Width`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Width.html) プロパティでウィジェットの幅を**直接設定する方法**。この方法は、既定の状態値 (*On/Off*) よりも長い状態記述を収めるときに便利です。
-   **ミニ テーマを使用してウィジェット全体を縮小する方法**。

### <a id="resize-property-settings"></a> プロパティ設定

以下の表に、これらを管理するプロパティ設定に必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
`Toggle Switch` の幅を設定する|[Width](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Width.html)|目的の値は 「200px」 などピクセル単位
`Toggle Switch` を縮小する|[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Mini.html)|true


### <a id="resize-example"></a> コード例

以下のコード スニペットは、[`Width`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Width.html) プロパティを 「*200px*」 に設定して `Toggle Switch` を 200 ピクセル幅にサイズ変更し (左)、[`Mini`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Mini.html) プロパティを有効にして縮小する (右) 方法を示しています。

<table class="table">
	<tbody>
		<tr>
			<td>
![](images/ToggleSwitch_Configuring_6.png)
            </td>
			<td>
![](images/ToggleSwitch_Configuring_7.png)
            </td>
        </tr>
    </tbody>
</table>

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .Width("200px")
    .Render()
)
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .Label("Standard")
    .Render()
)
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .Label("Mini")
    .Mini(true)
    .Render()
)
```


## <a id="disable"></a> Toggle Switch のユーザー操作の無効化

デフォルトでは、`Toggle Switch` はユーザーと相互作用できます (ユーザーは 「switch」 を反転でき、これが編集モードです) が、ウィジェットはユーザーの介入を無効にする必要がある場合に読み取り専用モードで動作することもできます (後者の場合、スイッチはオブジェクトまたはプロセスの状態のみ視覚化します)。

以下のスクリーンショットは、モードを読み取り専用として構成した結果、`Toggle Switch` がどのように表示されるかを示しています。

![](images/ToggleSwitch_Configuring_8.png)

### <a id="disable-property-settings"></a> プロパティ設定

以下の表では、希望の構成をプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
`Toggle Switch` のユーザー操作を無効にする|[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Disabled.html)|true
`Toggle Switch` のユーザー操作を無効にする|[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Disabled.html)|false



### <a id="disable-example"></a> コード例

以下のコードは、[`Disabled`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Disabled.html) プロパティを *true* に設定して、`Toggle Switch` のユーザー操作を無効にする方法を示しています。

**Razor の場合:**

```csharp
@(
    Html.InfragisticsMobile()
    .ToggleSwitch()
    .Disabled(true)
    .Render()
)
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Toggle Switch](ToggleSwitch-Adding.html) [の追加](ToggleSwitch-Adding.html): このトピックでは、Infragistics® Model-View-Controller (MVC) ラッパーを使用して `Toggle Switch` ウィジェットを有効にする方法をコード例を示して説明します。

- [Toggle Switch](ToggleSwitch-Configuring.html) [の構成](ToggleSwitch-Configuring.html): このトピックでは、`Toggle Switch` ウィジェットを構成する方法を説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-toggleswitch/basic-usage): このサンプルでは、基本の例で `Toggle Switch` ASP.NET MVC ラッパーを使用する方法を紹介します。

- [デバイス マネージャー](%%SamplesUrl%%/mobile-toggleswitch/device-manager): このサンプルは、デバイスをオン/オフにできるデバイス マネージャーで `Toggle Switch` MVC ラッパーを使用する方法を紹介します。




 

 



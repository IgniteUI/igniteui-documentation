<!--
|metadata|
{
    "fileName": "toggleswitch-overview",
    "controlName": "ToggleSwitch",
    "tags": ["Editing","MVC"]
}
|metadata|
-->

# ToggleSwitch の概要

## トピックの概要

### 目的

このトピックでは、`Toggle Switch` MVC ラッパーとその主な機能の概要を示します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**ToggleSwitch の主な機能の概要**](#features)
    -   [オプションのスイッチ ラベル](#label)
    -   [構成可能なスイッチ ラベル表示位置](#label-position)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`Toggle Switch` MVC ラッパーは、オン/オフまたは true/false のデータ入力に使用される 2 値の「フリップ スイッチ」を生成します。こうした仮想スイッチはモバイル デバイスの一般的なユーザー インターフェイス (UI)　要素です。`Toggle Switch` は、「スイッチ」の　2 つの状態 (つまり、有効状態と無効状態) を表す択一的な 2 つの位置 (左側と右側の位置) を備えたトラック スイッチです。現在の状態を示し、状態によって配色の変わるラベルもあります。

![](images/ToggleSwitch_Overview_1.png)

既定では、`Toggle Switch` の状態を表すラベルは「オン」と「オフ」になりますが、この二者択一項目は、「有効/無効」、「オン/オフ」、「低/高」といった任意の表記にカスタマイズできます。

![](images/ToggleSwitch_Overview_2.png)

このスイッチの状態は、jQuery モバイル UI のプロパティ (本ドキュメントでは [SwitchedState](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html)) によって管理されます。

どちらの状態に `Toggle Switch` が初期化されるかは、jQuery モバイルの既定値によって決まります (本ドキュメントの作成時点では「無効」状態になります) が、この初期状態値は構成可能です。



## <a id="features"></a> ToggleSwitch の主な機能の概要

次の表は、`Toggle Switch` MVC ラッパーの主な機能をまとめたものです。いくつかの機能については、表のあとの本文部分で詳しく説明します。`Toggle Switch`の機能構成に関する詳細については、[ToggleSwitch の構成](ToggleSwitch-Configuring.html)を参照してください。

機能|説明
--------|----------
構成可能なサイズ|ウィジェットのサイズは、次の 2 とおりの方法で構成できます。<br/>MVC ラッパーの [`Width`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Width.html) プロパティでウィジェットの幅を**直接設定する方法**。この方法は、既定の状態値 (オン/オフ) よりも長い状態記述を収めるときに便利です。<br/>**ミニ テーマを使用してウィジェット全体を縮小する方法。**
デュアル モード操作 (編集/読み取り専用モード)|`Toggle Switch` は、読み取り専用のウィジェットとして構成できます。
構成可能な既定状態|`Toggle Switch` の状態は [`SwitchedState`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html) プロパティによって管理します。このプロパティをウィジェットの初期化時に設定しておくことが、このウィジェットの既定状態を効率的に変更する方法です。
構成可能な状態ラベル|スイッチの状態 (既定では*オン*と*オフ*) は、(有効な状態と無効な状態を表す) 2 つのテキスト文字列を用いて実装されます。この文字列は、それぞれ [`OnText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OnText.html) と [`OffText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OffText.html) プロパティで設定します。
[オプションのスイッチ ラベル](#label)|`Toggle Switch` には、スイッチ全体についてのラベルを付けることができます。このラベルは、そのスイッチの用途をユーザーに知らせるためのラベルです。
[構成可能なスイッチ ラベル表示位置](#label-position)|オプションのスイッチ ラベルは、「スイッチ」の上下左右いずれかの位置に表示できます。


### <a id="label"></a> オプションのスイッチ ラベル

`Toggle Switch` には、スイッチ全体についてのラベルを付けることができます。このラベルは、そのスイッチの用途をユーザーに知らせるためのラベルです。

![](images/ToggleSwitch_Overview_3.png)

スイッチ ラベルを表示するには、ラベルのテキストを [`Label`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Label.html) プロパティとして入力し、[`HideLabel`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~HideLabel.html) プロパティを未設定のままにするか、もしくは *false* に設定します。

### <a id="label-position"></a> 構成可能なスイッチ ラベル表示位置

オプションのスイッチ ラベルは、「スイッチ」の上下左右いずれかの位置に表示できます。

![](images/ToggleSwitch_Overview_3.png)

![](images/ToggleSwitch_Overview_5.png)

![](images/ToggleSwitch_Overview_6.png)

![](images/ToggleSwitch_Overview_7.png)



既定のラベル位置は「スイッチ」の上部になります。

ラベルの表示位置は、[`LabelAlignment`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~LabelAlignment.html) プロパティの設定値 (*Top*、*Bottom*、*Left*、または *Right*)　によって管理されます。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Toggle Switch](ToggleSwitch-Adding.html) [の追加](ToggleSwitch-Adding.html): このトピックでは、Infragistics® Model-View-Controller (MVC) ラッパーを使用して `Toggle Switch` ウィジェットを有効にする方法をコード例を示して説明します。

- [Toggle Switch](ToggleSwitch-Configuring.html) [の構成](ToggleSwitch-Configuring.html): このトピックでは、`Toggle Switch` ウィジェットを構成する方法を説明します。

- [Toggle Switch](ToggleSwitch-Property-Reference.html) [のプロパティ参照](ToggleSwitch-Property-Reference.html): このトピックでは、`Toggle Switch` ウィジェットのプロパティに関する参照情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-toggleswitch/basic-usage): このサンプルでは、基本の例で `Toggle Switch` ASP.NET MVC ラッパーを使用する方法を紹介します。

- [デバイス マネージャー](%%SamplesUrl%%/mobile-toggleswitch/device-manager): このサンプルは、デバイスをオン/オフにできるデバイス マネージャーで `Toggle Switch` MVC ラッパーを使用する方法を紹介します。





 

 



<!--
|metadata|
{
    "fileName": "collapsible-overview",
    "controlName": "Collapsible",
    "tags": ["Getting Started"]
}
|metadata|
-->

# Collapsible の概要

## トピックの概要

### 目的

このトピックでは、`Collapsible` ASP.NET MVC ラッパーとその機能の概要について説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**Collapsible ASP.NET MVC ヘルパーの主な機能の概要**](#features-summary)
	-   [Collapsible ASP.NET MVC ヘルパーの主な機能の要点チャート](#features-summary-chart)
    -   [構成可能ヘッダー テキスト](#header-text)
    -   [構成可能状態アイコン画像](#icon-picture)
    -   [構成可能状態アイコン位置](#icon-position)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`Collapsible` MVC ラッパーは、コンテンツの縮小可能なブロックを生成します。

![](images/Collapsible_Overview_CopyEdited_1.png)

折り畳み可能ブロックのヘッダーをクリック可能ボタンのように設定するオプションがあります。折り畳み可能ブロックのコンテンツには、任意の HTML コンテンツを使用できます。



## <a id="features-summary"></a> Collapsible ASP.NET MVC ヘルパーの主な機能の概要

### <a id="features-summary-chart"></a> Collapsible ASP.NET MVC ヘルパーの主な機能の要点チャート

以下の表は、`Collapsible` MVC ラッパーの主な機能をまとめています。いくつかの機能については、表のあとの本文部分で詳しく説明します。`Collapsible` のウィジェット機能の構成方法については、[*Collapsible の構成*](Collapsible-Configuring.html)トピックに対象となる範囲が記載されています。

機能|説明
---|---
[構成可能ヘッダー テキスト](#header-text)|縮小可能なブロックのヘッダーに表示されるテキストは、[`HeaderText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~HeaderText.html) プロパティで設定されます。
[構成可能状態アイコン画像](#icon-picture)|`Collapsible` ラッパーの Collapsed 状態と Expanded 状態のデフォルト アイコンは、それぞれ [`CollapsedIcon`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~CollapsedIcon.html) プロパティと [`ExpandedIcon`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandedIcon.html) プロパティを設定して変更できます。
[構成可能状態アイコン位置](#icon-position)|デフォルトでは、状態アイコンは `Collapsible` ヘッダーの一番左に表示されます。アイコンの位置は [`IconPosition`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~IconPosition.html) プロパティで構成できます。
構成可能な既定状態|`Collapsible` ウィジェットの状態 (Collapsed/Expanded) は [`Collapsed`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~Collapsed.html) プロパティで管理されます。ウィジェットの初期化時にこのプロパティを設定すると、ウィジェットのデフォルト状態が効果的に変更されます。



### <a id="header-text"></a> 構成可能ヘッダー テキスト

`Collapsible` ラッパーは、縮小可能なブロックのヘッダーのテキスト ラベルを表示するように構成できます。縮小されたコンテンツの情報をユーザーに提供することが目的です。

![](images/Collapsible_Overview_CopyEdited_2.png)

### <a id="icon-picture"></a> 構成可能状態アイコン画像

以下のスクリーンショットに、Collapsible ラッパーのヘッダーのアイコンをカスタマイズされた画像で示しています。

Collapsed 状態アイコン|Expanded 状態アイコン
---------------------|-------------------
![](images/Collapsible_Overview_CopyEdited_3.png) | ![](images/Collapsible_Overview_CopyEdited_4.png)


アイコンのタイプ (Collapsed/Expanded) は該当の画像で示しています。2 つのアイコンそれぞれの画像を設定するプロパティが個々に存在します。

-   [CollapsedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~CollapsedIcon.html)
-   [ExpandedIcon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~ExpandedIcon.html)

指定可能な値を[アイコン セット](http://jquerymobile.com/test/docs/buttons/buttons-icons.html)に示します。

### <a id="icon-position"></a> 構成可能状態アイコン位置

状態アイコンの位置は [`IconPosition`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.CollapsibleModel~IconPosition.html) プロパティで構成できます。以下の図に示すように*左*、*右*、*上*、*下* の 4 ヵ所が指定でき、構成プロパティの値として設定できます。

![](images/Collapsible_Overview_CopyEdited_5.png)

![](images/Collapsible_Overview_CopyEdited_6.png)

![](images/Collapsible_Overview_CopyEdited_7.png)

![](images/Collapsible_Overview_CopyEdited_8.png)



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Collapsible* の追加](Collapsible-Adding.html): このトピックでは、Infragistics® Model-View-Controller (MVC) ラッパーを使用して `Collapsible` ウィジェットを有効にする方法をコード例を用いて説明します。

- [*Collapsible* の構成](Collapsible-Configuring.html): このトピックでは `Collapsible` ウィジェットの構成方法について説明します。

- [*Collapsible* のプロパティ参照](Collapsible-Property-Reference.html): このトピックでは、`Collapsible` ウィジェットのプロパティに関する参照情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-collapsible/basic-usage): これは jQuery Mobile collapsible ウィジェットの ASP.NET MVC ヘルパーを紹介するサンプルです。





 

 



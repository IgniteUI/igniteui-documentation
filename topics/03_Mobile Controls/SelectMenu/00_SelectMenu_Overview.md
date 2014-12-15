<!--
|metadata|
{
    "fileName": "selectmenu-overview",
    "controlName": "SelectMenu",
    "tags": ["Editing","Getting Started","Selection"]
}
|metadata|
-->

# SelectMenu の概要

## トピックの概要
### 目的

このトピックでは、`SelectMenu`™ ヘルパーとその主な機能の概要を示します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**SelectMenu の主な機能の概要**](#main-features)
    -   [SelectMenu の主な機能に関する要点チャート](#select-main-features-chart)
    -   [オプションのラベル](#optional-label)
    -   [構成可能なラベル表示位置](#config-position-of-labels)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a>概要
### SelectMenu ASP.NET MVC ヘルパーの概要

`SelectMenu` ASP.NET MVC ヘルパーは、ネイティブの select 要素に基づいて jQuery モバイルの `selectmenu` ウィジェットを生成します。最終的なスタイルおよび機能を作成するために、jQuery モバイルは、元の select 要素を非表示にし、その要素を jQuery モバイル フレームワークのルック アンド フィールに合致したカスタム スタイルの選択ボタンに置き換えます。



## <a id="main-features"></a>SelectMenu の主な機能の概要
### <a id="select-main-features-chart"></a>SelectMenu の主な機能に関する要点チャート

次の表は、`SelectMenu` ASP.NET MVC ヘルパーの主な機能をまとめたものです。詳細については、表のあとの本文部分で説明します。`SelectMenu` の機能構成に関する詳細については、[**SelectMenu** の構成](SelectMenu-Configure.html)というトピックを参照してください。

機能|説明
---|---
[オプションのラベル](#optional-label)|`SelectMenu` には、スイッチ全体についてのラベルを付けることができます。このラベルは、そのスイッチの機能について詳しくユーザーに知らせるためのラベルです。
構成可能なコーナー|`SelectMenu` の四隅には、[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html) プロパティを使用して丸みを付けることができます。
[構成可能なラベル表示位置](#config-position-of-labels)|オプションのスイッチ ラベルは、`SelectMenu` の上下左右いずれかの位置に表示できます。


### <a id="optional-label"></a>オプションのラベル

`SelectMenu` には、スイッチ全体についてのラベルを付けることができます。This label
このラベルは、そのスイッチの機能について詳しくユーザーに知らせるためのラベルです。

![](images/SelectMenu_Overview_1.png)

メニュー ラベルを表示するには、ラベルのテキストを [Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Label.html) プロパティとして入力し、[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~HideLabel.html) プロパティを未設定のままにするか、もしくは false に設定します。

### <a id="config-position-of-labels"></a>構成可能なラベル表示位置

オプションのラベルは、`SelectMenu` の上下左右いずれかの位置に表示できます。

![](images/SelectMenu_Overview_1.png)

![](images/SelectMenu_Overview_3.png)

![](images/SelectMenu_Overview_4.png)

![](images/SelectMenu_Overview_5.png)


既定のラベル位置は `SelectMenu` の上部になります。

ラベルの表示位置は、[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~LabelAlignment.html) プロパティの設定値 (Top、Bottom、Left、または Right)　によって管理されます。

### 構成可能なコーナー

デフォルトでは、`SelectMenu` のコーナーは角丸です。四隅に丸みを付けるかどうかは、[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html) プロパティによって管理します。

![](images/SelectMenu_Overview_6.png)

![](images/SelectMenu_Overview_7.png)


## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [SelectMenu の構成](SelectMenu-Configure.html): このトピックでは、`SelectMenu` ヘルパーの構成方法について説明します。

- [SelectMenu プロパティ参照](SelectMenu-Property-Reference.html): このトピックでは、`SelectMenu` ヘルパーのプロパティに関する参照情報を提供します。

- [SelectMenu の追加](SelectMenu-Adding.html): このトピックでは、コード例をいくつか示しながら、Infragistics® ASP.NET MVC ヘルパーを使用して jQuery モバイル の `selectmenu` ウィジェットを有効にする方法について説明します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-selectmenu/basic-usage): このサンプルでは、基本の例で `SelectMenu` ASP.NET MVC ヘルパーを使用する方法を紹介します。





 

 



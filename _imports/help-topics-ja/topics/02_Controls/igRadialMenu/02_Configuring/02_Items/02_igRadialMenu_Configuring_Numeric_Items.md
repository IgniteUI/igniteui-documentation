<!--
|metadata|
{
    "fileName": "igradialmenu-configuring-numeric-items",
    "controlName": "igRadialMenu",
    "tags": ["How Do I","Layouts"]
}
|metadata|
-->

# 数値項目の構成 (igRadialMenu)



## トピックの概要
### 目的

このトピックでは、[`igRadialMenu`](%%jQueryApiUrl%%/ui.igRadialMenu#options)™ の数値項目について説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igRadialMenu の機能](igRadialMenu-Features.html): このトピックでは、このコントロールでサポートする機能を開発者の観点から説明します。

- [igRadialMenu の視覚要素](igRadialMenu-Visual-Elements.html): このトピックでは、コントロールの視覚要素についての概要を紹介します。

- [項目 / サブ項目の構成 - 概要](igRadialMenu-Items-Sub-Items-Configuration-Overview.html): このトピックでは、メニュー項目およびその共通構成プロパティの概要を説明します。

- [ボタン項目の構成](igRadialMenu-Configuring-Button-Items.html): このトピックでは、`igRadialMenu` のボタン項目について説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [数値項目の構成の概要](#configuration)
-   [数値項目](#numeric-item)
-   [数値ゲージ](#numeric-gauge)
-   [関連コンテンツ](#related-content)



## <a id="configuration"></a>数値項目の構成の概要
### 数値項目の構成の概要表

`igRadialMenu` は、数値を確認し設定する数値項目をサポートします。詳細は、表の後に記載されています。

数値項目|説明|タイプによる表示
---|---|---
[数値項目](#numeric-item)|<ul><li>ヘッダー テキストを表示します。</li><li>アイコンを表示します。</li><li>関連付けられた数値を表示します。</li></ul>|numericitem
[数値ゲージ](#numeric-gauge)|<ul><li>許容値を目盛りで表したスケールを表示します。</li><li>現在の値を表示します。</li><li>保留中の値を表示します。</li></ul>|numericgauge


## <a id="numeric-item"></a>数値項目
### 概要

ボタン項目が提供するヘッダー テキストやアイコンに加え、数値項目には関連付けられた値がアイコン内またはアイコン上に表示されます。

以下のスクリーンショットは、関連付けられた値 (12) がアイコン上に表示された数値項目を示します。

![](images/igRadialMenu_05.png)

### プロパティ設定

以下の表は、主な構成とそれを管理するプロパティ設定のマップを示します。

目的:|使用するオプション / イベント:|操作:
---|---|---
項目に関連付けられた数値の設定 / 確認|`value`|値を設定または読み取ります。
関連付けられた数値の変更についての通知|`valueChanged`|イベント ハンドラーにアタッチします。


## <a id="numeric-gauge"></a>数値ゲージ
### 概要

数値ゲージ項目は、ユーザーが選択できる値 (目盛り) のある数値ゲージを表示します。現在の値と保留中の値 (マウス カーソルがホバーしている値) を示す針もあります。

以下のスクリーンショットは、数値ゲージを示しています。

![](images/igRadialMenu_06.png)

1.  目盛り
2.  現在の値を示す針
3.  保留中の値を示す針

### プロパティ設定

以下の表は、主な構成とそれを管理するプロパティ設定のマップを示します。

目的:|使用するオプション / イベント:|操作:
---|---|---
保留中の値の設定 / 取得|`pendingValue`|double 型の値に設定します。
関連付けられた保留中の値の変更についての通知|`pendingValueChanged`|イベント ハンドラーにアタッチします。
目盛りの設定 / 取得|`ticks`|目盛りの値があるコレクションに設定します。
現在の値の設定 / 取得|`value`|double 型の値に設定します。
関連付けられた数値の変更についての通知|`valueChanged`|イベント ハンドラーにアタッチします。



## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [色項目の構成](igRadialMenu-Configuring-Color-Items.html): このトピックでは、`igRadialMenu` の色項目について説明します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [数値項目](%%SamplesUrl%%/radial-menu/numeric-items): このサンプルは、数値項目とゲージ項目を定義する方法を紹介します。





 

 



<!--
|metadata|
{
    "fileName": "igradialmenu-configuring-button-items",
    "controlName": "igRadialMenu",
    "tags": ["How Do I","Layouts"]
}
|metadata|
-->

# ボタン項目の構成 (igRadialMenu)



## トピックの概要
### 目的

このトピックでは、[`igRadialMenu`](%%jQueryApiUrl%%/ui.igRadialMenu#options)™ のボタン項目について説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igRadialMenu の機能](igRadialMenu-Features.html): このトピックでは、このコントロールでサポートする機能を開発者の観点から説明します。

- [igRadialMenu の視覚要素](igRadialMenu-Visual-Elements.html): このトピックでは、コントロールの視覚要素についての概要を紹介します。

- [項目 / サブ項目の構成 - 概要](igRadialMenu-Items-Sub-Items-Configuration-Overview.html): このトピックでは、メニュー項目およびその共通構成プロパティの概要を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [ボタン項目の構成の概要](#button-items-config)
-   [関連コンテンツ](#related-content)



## <a id="introduction"></a>概要
### ボタン項目の概要

`igRadialMenu` のボタン項目は通常の項目で、クリックで動作を実行します。ボタン項目にはテキストやアイコンを含めることができます。さらにボタン項目はサブ項目を持つことができ、サブ項目グループをナビゲートする矢印ボタンを外部リングとして親項目に持たせることができます。

ボタン項目をチェックボックス項目として構成することもでき、チェックボックスは外部リングの内側の項目領域内に円弧で表示されます。

ボタン項目はラジオ ボタン項目として構成でき、次の 2 つのモードで操作できます。

-   1 つ以上のチェック済み項目があるラジオ ボタン グループ
-   チェック済み項目がないラジオ ボタン グループ

以下のスクリーンショットは、各ボタン項目のタイプを示しています。

![](images/igRadialMenu_04.png)

1.  プレーン ボタン項目
2.  チェック済みのチェックボックス ボタン項目
3.  サブ項目を持つ色項目を示す矢印
4.  2 番目の選択肢がチェック済みのラジオ ボタン グループ



## <a id="button-items-config"></a>ボタン項目の構成の概要
### ボタン項目の構成の概要表

以下の表は、ボタン項目コントロールで構成できる主要な要素を簡単に説明し、それらを構成するプロパティにマップします。

構成可能な項目|詳細|オプション
---|---|---
ヘッダー|項目内テキストを追加、編集および削除します。|`header`
アイコン|項目内アイコンを追加、編集および削除します。|`icon`
非バインド サブ項目の追加|非バインド サブ項目を追加、編集および削除します。|`items`
チェックボックス|ボタン項目をチェックボックスルとして構成するには、`CheckBehaviour` プロパティを `CheckBox` に設定し、`IsChecked` プロパティを使用して状態を設定または取得します。|<ul><li>checkBehavior</li><li>isChecked</li></ul>
ラジオ ボタン|ボタン項目をラジオ ボタンとして構成するには、`CheckBehaviour` プロパティを `RadioButton` (1 つのチェック済み項目があるグループ用) または `RadioButtonAllowAllUp` (チェック済み項目がないグループ用) に設定し、GroupName プロパティを使用してすべてのグループ メンバーのグループ名が同じ名前に設定します。|<ul><li>`checkBehaviour`</li><li>`isChecked`</li><li>`groupName`</li></ul>
イベント|イベント ハンドラーを持つように Click イベントを構成して、特定のボタンがクリックされたときに処理が実行されるようにします。ボタンのチェック時やチェック解除時に通知するイベントもあります。|<ul><li>`click`</li><li>`checked`</li><li>`unchecked`</li></ul>


## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [数値項目の構成](igRadialMenu-Configuring-Numeric-Items.html): このトピックでは、`igRadialMenu` の数値項目について説明します。

- [色項目の構成](igRadialMenu-Configuring-Color-Items.html): このトピックでは、`igRadialMenu` の色項目について説明します。

### サンプル

以下のサンプルでは、このトピックに関連する情報を提供しています。

- [ボタン項目](%%SamplesUrl%%/radial-menu/button-items): このサンプルは、ボタン項目の定義および構成方法を紹介します。





 

 



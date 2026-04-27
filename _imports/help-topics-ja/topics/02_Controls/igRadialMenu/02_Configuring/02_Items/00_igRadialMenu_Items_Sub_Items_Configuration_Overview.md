<!--
|metadata|
{
    "fileName": "igradialmenu-items-sub-items-configuration-overview",
    "controlName": "igRadialMenu",
    "tags": ["How Do I","Layouts","Tips and Tricks"]
}
|metadata|
-->

# 項目 / サブ項目の構成 - 概要 (igRadialMenu)

## トピックの概要
### 目的

このトピックでは、メニュー項目およびその構成プロパティの概要について説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igRadialMenu の機能](igRadialMenu-Features.html): このトピックでは、このコントロールでサポートする機能を開発者の観点から説明します。

- [igRadialMenu の視覚要素](igRadialMenu-Visual-Elements.html): このトピックでは、コントロールの視覚要素についての概要を紹介します。

- [igRadialMenu の構成の概要](igRadialMenu-Configuration-Overview.html): このトピックでは、`igRadialMenu` を構成する方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [メニュー項目の構成の概要](#configuration-summary)
-   [関連コンテンツ](#related-content)

## <a id="configuration-summary"></a> メニュー項目の構成の概要
### メニュー項目の構成の概要表

`igRadialMenu` は、共通の構成可能なオプションで複数の項目をサポートします。以下の表にサポートされるオプションを示します。

構成可能な項目|詳細|オプション
---|---|---
メニュー項目インデックス|メニュー項目の位置を指定します。<br>**注:** この項目インデックスを指定しない場合、定義した順に項目が描画されます。|`wedgeIndex`
メニュー項目のスパン|メニュー項目がスパンするウェッジの数を指定します。|`wedgeSpan`
最近の項目|最後に選択されたサブ項目への参照を保持します。サブ項目の自動配置 (回転) 機能が使用できます。|`recentItem`
サブ項目の自動配置 (回転)|項目のサブ項目を自動回転するかどうかを指定し、最近選択された項目の位置を親項目の位置と一致させます。たとえば、ボタン項目の場合は、`recentItem` プロパティに指定された項目に一致させることができます。カラー項目またはカラーウェルについては、親のカラーウェル/カラー項目と一致する子のカラーウェルが使用されます。|`autoRotateChildren`

## <a id="related-content"></a> 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ボタン項目の構成](igRadialMenu-Configuring-Button-Items.html): このトピックでは、`igRadialMenu` のボタン項目について説明します。

- [数値項目の構成](igRadialMenu-Configuring-Numeric-Items.html): このトピックでは、`igRadialMenu` の数値項目について説明します。

- [色項目の構成](igRadialMenu-Configuring-Color-Items.html): このトピックでは、`igRadialMenu` の色項目について説明します。



### サンプル

このトピックについては、以下のサンプルも参照してください。

- [項目の構成](%%SamplesUrl%%/radial-menu/configure-items): このサンプルは、`igRadialMenu` 項目のパラメーターを構成する方法を紹介します。

- [数値項目](%%SamplesUrl%%/radial-menu/numeric-items): このサンプルは、数値項目とゲージ項目を定義する方法を紹介します。

- [色項目](%%SamplesUrl%%/radial-menu/color-items): このサンプルでは、色ドリルダウン選択を許可するために色項目およびカラー ウェルを定義して使用する方法を紹介します。

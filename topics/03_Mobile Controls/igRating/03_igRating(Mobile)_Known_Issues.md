

----------
<!--
|metadata|
{
    "fileName": "igrating(mobile)-known-issues",
    "controlName": "igRatingMobile",
    "tags": ["Known Issues"]
}
|metadata|
-->

# 既知の問題および制限 (igRating モバイル)

## トピックの概要

### 目的

このトピックでは、モバイル `igRating`™ コントロールの既知の問題について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igRating の概要](igRating%28Mobile%29-Overview.html): このトピックは、モバイル `igRating` コントロールの概要を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**既知の問題と制限**](#overview)
    -   [モバイル igRating でゼロ値を選択できない](#zero-value-select)
    -   [モバイル igRating でゼロ値を選択できない - 解決策](#zero-value-workaround)
-   [**関連コンテンツ**](#related-content)



## <a id="overview"></a> 既知の問題と制限

以下の表に、Ignite UI %%ProductVersionShort%% リリースのモバイル `igRating` の既知の問題と制限事項の概要を示します。いくつかの問題については、この概要表の後に、既知の問題点に関する詳しい説明と、考えられる回避策を示します。

凡例: | 
--------|------
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策はありません
![](images/plannedFix.png) | 修正予定です



機能|説明|解決済み
---|---|---
デスクトップ ブラウザーで、ゼロ値をモバイル `igRating` に選択できません。|デスクトップのブラウザーでこのコントロールの操作中は、レーティング値をゼロに戻すことはできません。 | ![](images/positive.png)



### <a id="zero-value-select"></a> デスクトップ ブラウザーで、ゼロ値をモバイル igRating に選択できません。

デスクトップのブラウザーでこのコントロールの操作中は、レーティング値をゼロに戻すことはできません。タッチ環境では、`igRating` の左にスワイプし、0 に設定できます。デスクトップ環境でユーザー操作によって null 値に設定できません。ただし、`igRating` モバイル API を使用して値を null 値に設定できます。

### <a id="zero-value-workaround"></a> モバイル igRating でゼロ値を選択できない - 解決策

以下のコードのように、`igRating` API を使用してゼロ値を設定できます。

**JavaScript の場合:**

```
$("#selector").igRating("option", "value", 0);
```

空のレーティング値の設定方法および実装の詳細は、「**関連コンテンツ**」セクションの**サンプル**を参照してください。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igRating モバイルの概要](igRating%28Mobile%29-Overview.html): このトピックでは、`igRating`™ コントロールの主な特長および機能を紹介します。

- [Mobile igRating をページに追加](Adding-igRating%28Mobile%29-to-a-Web-Page.html): このトピックでは、`igRating`™ モバイル コントロールをウェブ ページに追加する方法を説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。すべてのサンプルは、レーティングにゼロの値を設定するためのさまざまな方法を示しています。

- [基本的な使用方法](%%SamplesUrl%%/mobile-rating/basic-usage): `igRating` モバイルの初期化方法を示すサンプル。

- [カスタム項目](%%SamplesUrl%%/mobile-rating/custom-items): `igRating` モバイルにユーザー設定の画像を設定する方法を示すサンプルです。

- [ASP.NET MVC ヘルパー](%%SamplesUrl%%/mobile-rating/aspnet-mvc-helper): `igRating` モバイルを ASP.NET MVC ヘルパーでの初期化方法を示すサンプルです。





 

 



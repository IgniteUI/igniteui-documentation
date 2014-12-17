<!--
|metadata|
{
    "fileName": "igrating(mobile)-overview",
    "controlName": "igRatingMobile",
    "tags": ["API","Data Presentation","Getting Started"]
}
|metadata|
-->

# igRating (モバイル) の概要

## トピックの概要

### 目的

`igRating` Mobile™ コントロールおよび機能を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**機能**](#features)
	-   [投票のカスタマイズ](#vote-customization)
    -   [デュアル モード操作 (編集/読み取り専用モード)](#dual-mode)
    -   [動的なデータ バインディング](#dynamic-data)
    -   [レーティングのクリア](#clearing)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`igRating` モバイル コントロールを使用すると、値の範囲から項目を選択し評価できます。デフォルトでは、コントロールは星 5 つの行を表示します。強調表示される星はレーティングの値を表します。

![](images/02_igRatingMobileOverview_1.png)

コントロールはモバイル デバイスのためにデザインされるため、ReadOnly モード以外のレーティングは整数に四捨五入されます。ReadOnly モードでは、コントロールを整数または半数のレーティング値を表示できます。

![](images/02_igRatingMobileOverview_2.png)


## <a id="features"></a> 機能

以下は、`igRating` モバイル コントロールの機能の概要を示します。詳細は、概要表の後に記載されています。

- [投票のカスタマイズ](#vote-customization): `igRating` モバイル コントロールは、レーティング アイコンのカスタム画像を表示できます。

- [2 つのモードの操作 (編集/読み取り専用) モード](#dual-mode): `igRating` モバイル コントロールを読み取り専用モードに設定できます。

- [動的な変更](#dynamic-data): `igRating` モバイル コントロールは [JavaScript クライアント API](%%jQueryApiUrl%%/mobile.igRating) を使用してレーティングの値を動的に変更できます。また、コントロール API を使用して動的にコントロールを破棄できます。

- [レーティングのクリア](#clearing): ユーザーが `igRating` モバイル コントロールで左にスワイプすると、現在のレーティングをクリアします。以前に設定されるレーティング値の代わりに null 値を設定します。



### <a id="vote-customization"></a> 投票のカスタマイズ

`igRating` モバイル コントロールは、レーティング アイコンのカスタム画像を表示できます。

![](images/02_igRatingMobileOverview_3.png)

`igRating` モバイル CSS クラスをオーバーライドするカスタム スタイルによって実装されます。`igRating` モバイル CSS クラスについて、[CSS クラス リファレンス](igRating-Classes-Reference.html) トピックを参照してください。

**関連サンプル:**

-   [*igRating* カスタム項目](%%SamplesUrl%%/mobile-rating/custom-items)


### <a id="dual-mode"></a> デュアル モード操作 (編集/読み取り専用モード)

`igRating` モバイル コントロールを読み取り専用モードに設定できます。コントロールのデフォルトの ReadOnly モードは標準の編集モードのスタイルより小さい星があります。

![](images/02_igRatingMobileOverview_4.png)

モードは [`readOnly`](%%jQueryApiUrl%%/mobile.igRating#options) プロパティによって処理されます。このプロパティが `true` に設定されると、コントロールのユーザー操作が無効になります。

読み取り専用値は半数に四捨五入されます。たとえば、*2.25* の 2 倍の値を設定すると、値は *2.5* に四捨五入されます。値を *2.24* に設定すると、値は *2* に四捨五入されます。

> **注:** 視覚的な表現および値は四捨五入されます。


### <a id="dynamic-data"></a> 動的なデータ バインディング

`igRating` モバイル コントロールは [JavaScript クライアント API](%%jQueryApiUrl%%/mobile.igRating) を使用してレーティングの値を動的に変更し、コントロールを破棄できます。詳細については、[メソッド リファレンス](igRating-Method-Reference.html) トピックを参照してください。

> **注:** MVC ラッパーがレーティング値をサーバーに送信する非表示の入力フィールドの [`inputName`](%%jQueryApiUrl%%/mobile.igRating#options) 値以外のすべてのプロパティを動的に変更できます。


### <a id="clearing"></a> レーティングのクリア

ユーザーが `igRating` モバイル コントロールで左にスワイプすると、現在のレーティングをクリアします。設定されるレーティング値の代わりに null 値を設定します。マウスが使用されるデスクトップ環境で操作しません。

注: この機能を使用すると、ユーザー操作によって null 値を設定できます。*igRating* モバイル API を使用して動的に設定できます。詳細について、[既知の問題と制限](igRating%28Mobile%29-Known-Issues.html)トピックを参照してください。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igRating モバイルの追加](Adding-igRating%28Mobile%29-to-a-Web-Page.html): このトピックでは、`igRating`™ モバイル コントロールを web ページに追加する方法を説明します。

- [API リファレンス](igRating-API-Reference.html): このトピックでは、`igRating`™ モバイル API のカテゴリーを紹介します。コントロール プロパティ、メソッド、イベントおよび CSS クラスへのすべての参照に加え、API 使用時のいくつかの具体例が含まれています。

- [CSS クラス リファレンス](igRating-Classes-Reference.html): このトピックでは、`igRating` コントロールの CSS クラスを紹介します。

- [メソッド リファレンス](igRating-Method-Reference.html): このトピックでは、`igRating` コントロールのメソッドを紹介します。

- [既知の問題と制限](igRating%28Mobile%29-Known-Issues.html): このトピックでは、`igRating` モバイル コントロールの既知の問題について説明します。

- [アクセシビリティ準拠](igRating%28Mobile%29-Accessibility.html): このトピックでは、`igRating` モバイルのアクセシビリティ機能について説明し、レーティングを含むページのアクセシビリティ準拠を実現する方法についての助言を示します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-rating/basic-usage): `igRating` モバイルの初期化方法を示すサンプル。

- [カスタム項目](%%SamplesUrl%%/mobile-rating/custom-items): `igRating` モバイルにユーザー設定の画像を設定する方法を示すサンプルです。

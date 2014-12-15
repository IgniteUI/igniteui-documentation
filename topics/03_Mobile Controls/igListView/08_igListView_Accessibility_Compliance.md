<!--
|metadata|
{
    "fileName": "iglistview-accessibility-compliance",
    "controlName": "igListView",
    "tags": ["Section 508"]
}
|metadata|
-->

# アクセシビリティ準拠 (igListView)

## トピックの概要

### 目的

このトピックでは、`igListView`™ のアクセシビリティ機能について説明し、`igListView` を含むページのアクセシビリティ準拠を達成する方法に関する情報を提供します。

#### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- 概念
	- Web アクセシビリティ イニシアティブ (WAI)
- トピック
	- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView`™ の機能について説明します。
	- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。
- 外部リソース
	-   [Web コンテンツ アクセシビリティおよび Mobile Web](http://www.w3.org/WAI/mobile/)
	-   [Web コンテンツ アクセシビリティのガイドライン](http://www.w3.org/WAI/intro/wcag.php)
	-   [Mobile Web のベスト プラクティス](http://www.w3.org/TR/mobile-bp/)





## igListView のアクセシビリティ準拠

すべての Ignite UI™ Mobile コントロールおよびコンポーネントは、1973 年リハビリテーション法第 508 条第 1194 部 22 条を遵守しています。後に続くアクセシビリティ準拠一覧表には、コントロールに関連する第 1194 部 第 22 節の特定の規則が含まれています。また、list view コントロールが各規則を順守する方法に関する詳細も含まれています。

第 508 条とは別に、当社は [Mobile Web のベスト プラクティス](http://www.w3.org/TR/mobile-bp/)ガイドおよび [Web コンテンツのアクセシビリティ ガイドライン](http://www.w3.org/WAI/intro/wcag.php)ガイドにも従っています。

各アクセシビリティ規則の要件を満たすために、場合によっては、コントロールを操作して特定のプロパティを設定する必要がありますが、それ以外の場合は、コントロール自身がこの作業を行います。

> **注:** jQuery Mobile コントロールはクライアント専用のため、一部の規則はサポートされておらず、制限として示されています。

#### アクセシビリティ準拠一覧表

以下の表は、`igListView` のアクセシビリティ準拠機能についてまとめたものです。

規則|規則内容|準拠方法
---|---|---
(d)* |関連付けられたスタイル シートがなくても読めるようにドキュメントを構成するものとします。|`igListView` コントロールは UL HTML 要素として描画され、スタイルなしで使用できます。ただし、すべての機能はスクリプトに依存し、スクリプトが無効になっている場合は、これらの機能は利用できません。

\* - コントロールの制限



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [アクセシビリティ準拠](Accessibility-Compliance.html): すべての Ignite UI コントロールのアクセシビリティ準拠のための参照情報を提供します。

- [既知の問題と制限](igListView-Known-Issues.html): このトピックでは、`igListView` の既知の問題および制限について説明します。





 

 



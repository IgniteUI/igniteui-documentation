<!--
|metadata|
{
    "fileName": "iggrid-configuring-responsive-web-design-mode-overview",
    "controlName": "igGrid",
    "tags": ["Grids","How Do I","Layouts"]
}
|metadata|
-->

# レスポンス Web デザイン (RWD) モード構成の概要 (igGrid)

## トピックの概要

### 目的

このトピックは、列の非表示やテンプレートの構成など レスポンス Web デザイン (RWD) モードが構成される要素、およびこれらの要素が互いのどのように関係するのかを概念的に説明します。

### 前提条件

以下は、このトピックを理解するための前提条件として必要なトピックと記事の一覧です。

- 概念
    - レスポンス Web デザイン
    - レスポンシブ フレームワーク
    - CSS メディア クエリ
- トピック
    - [レスポンス Web デザイン (RWD) モードの概要 (igGrid)](igGrid-Responsive-Web-Design-Mode-Overview.html): このトピックは、`igGrid` コントロールの RWD モード機能およびこの機能が提供する機能性について概念的に説明します。
    - [レスポンス Web デザイン (RWD) モード構成を有効にする (igGrid)](igGrid-Enabling-Responsive-Web-Design-Mode.html): このトピックは、コード例を用いて、`igGrid` コントロールでレスポンス Web デザイン (RWD) モードを有効にする方法について説明します。
- 外部リソース
    -   [A List Apart: レスポンシブ Web デザイン](http://alistapart.com/article/responsive-web-design)
    -   [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
    -   [Wikipedia: レスポンシブ Web デザイン](http://en.wikipedia.org/wiki/Responsive_web_design)
    -   [CSS 3 メディア クエリ](http://www.w3.org/TR/css3-mediaqueries/)

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**レスポンス Web デザイン (RWD) 設計の構成の概要**](#overview)
    -   [RWD モードの構成の概要](#summary)
    -   [列の非表示の構成](#column-hiding)
    -   [RWD モード テンプレートの構成](#templates)
    -   [カスタム RWD モードの構成](#custom-configurations)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)



## <a id="overview"></a> レスポンス Web デザイン (RWD) 設計の構成の概要

### <a id="summary"></a> RWD モードの構成の概要

レスポンス Web デザイン (RWD) モードは、以下の機能を取り扱うよう構成できます。

-   [列の非表示](igGrid-Responsive-Web-Design-Mode-Configuring-Column-Hiding.html) - この機能は、アクティブな RWD のプロファイルによって列を表示/非表示にします。
-   [テンプレートの切り替え](igGrid-Responsive-Web-Design-Mode-Configuring-Row-and-Column-Templates.html) - この機能は、アクティブな RWD のプロファイルによって列のテンプレートを適用します。
-   [カスタム RWD モードの構成](igGrid-Responsive-Web-Design-Mode-Creating-Custom-Profile.html) - この機能により、カスタム RWD プロファイルを作成できます。

列の非表示とテンプレートに基づいた構成の機能は、Twitter Bootstrap RWD クラスで使用するよう構成できます。(詳細は、「[ブートストラップのサポートの構成](igGrid-Responsive-Web-Design-Mode-Configuring-Bootstrap-Support.html) 」トピックを参照)


### <a id="column-hiding"></a> 列の非表示の構成
列の 表示は、以下の方法で構成できます。    

-   **CSS クラスを利用する** -  [CCS 3 メディア クエリ](http://www.w3.org/TR/css3-mediaqueries/)を使用各クラス コレクションは、igGrid API を通して列を表示または非表示するために使用される表示要素を作成するかどうかがテストされます。         
	> **注:** CSS メディア クエリは、古いブラウザはサポートしません。詳細は、「 [CSS メディア クエリ ブラウザのサポート](http://caniuse.com/css-mediaqueries)」を参照してください。 

	CSS クラスは、 `columnSettings.classes` プロパティで構成されます。

-   **設定を構成する** - 構成の設定は、定義済み RWD モードのプロファイルおよび認識されたアクティブなプロファイルを使用して、列の表示を決定します。  デフォルトでは、構成設定は CSS 3 メディア クエリも使用して RWD モードのプロファイルを決定します。しかし、CSS 3 に依存することを望まない場合は、`$.ig.ResponsiveMode` クラスを拡張すればウィンドウのサイズ変更イベントを使用できます。     

**関連トピック**

-   [列の非表示の構成](igGrid-Responsive-Web-Design-Mode-Configuring-Column-Hiding.html)


### <a id="templates"></a> RWD モード テンプレートの構成

列 RWD モードテンプレートは `columnSettings.configuration` オプションを使用して構成されます。この構成オプションは、`responsiveModes` オプションで構成された名前などプロパティ付きオブジェクト リテラルを受け付けます。値は、テンプレート文字列を含むテンプレートとしての名前のついた単一のプロパティを持つオブジェクト リテラルです。

1 つの列のテンプレートはそれぞれ構成された [profile](igGrid-Responsive-Web-Design-Mode-Overview.html#profiles) で作成されます。プロファイルがアクティブ化されると、グリッドはプロファイル テンプレートに従ってレンダリングされます。

**関連トピック**

-   [列テンプレートを構成する](igGrid-Responsive-Web-Design-Mode-Configuring-Row-and-Column-Templates.html)


### <a id="custom-configurations"></a> カスタム RWD モードの構成

RWD モードには、デスクトップ、タブレットおよび電話など、定義済みのプロファイルがあります。それに加えて、カスタム プロファイルを作成できます。カスタム プロファイルは、`responsiveModes` オプションでインラインで、または `$.ig.ResponsiveMode` クラスを拡張することにより作成できます。

**関連トピック**

-   [カスタム レスポンス Web デザイン (RWD) モード プロファイルの作成](igGrid-Responsive-Web-Design-Mode-Creating-Custom-Profile.html)



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [列非表示の構成 (igGrid、RWD モード)](igGrid-Responsive-Web-Design-Mode-Configuring-Column-Hiding.html): このトピックでは、コード例を用いて、レスポンス Web デザイン (RWD) モードで `igGrid` コントロール用に列を非表示にする方法について説明します。

- [行および列テンプレートの構成 (igGrid、RWD モード)](igGrid-Responsive-Web-Design-Mode-Configuring-Row-and-Column-Templates.html): このトピックは、コード例を用いて `igGrid` コントロールの各 レスポンス Web デザイン (RWD) モード プロファイルに対して行と列を定義する方法、およびアクティブな RWD モードの切り替え時のテンプレートの自動変更を構成する方法について説明します。

- [カスタム レスポンス Web デザイン (RWD) プロファイルの作成 (igGrid)](igGrid-Responsive-Web-Design-Mode-Creating-Custom-Profile.html): このトピックは、コード例を使用して、`igGrid` コントロールのカスタム レスポンシブ Web デザイン (RWD) モード プロファイルを作成する方法について説明します。

- [ブートストラップ サポートの構成 (igGrid、RWD モード)](igGrid-Responsive-Web-Design-Mode-Configuring-Bootstrap-Support.html): このトピックは、Twitter Bootstrap の RWD クラスを用いて `igGrid` コントロールの レスポンス Web デザイン (RWD) モードを構成する方法について説明します。




 

 



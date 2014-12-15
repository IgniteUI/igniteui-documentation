<!--
|metadata|
{
    "fileName": "link-overview",
    "controlName": "Link",
    "tags": ["Getting Started","MVC","Navigation"]
}
|metadata|
-->

# Link の概要

## トピックの概要

### 目的

このトピックでは、MVC `Link` コントロール ラッパーとその主な機能を紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**Link MVC ラッパーの主な機能の概要**](#summary)
-   [**Link MVC ラッパーの機能**](#features)
	-   [テキスト](#text)
    -   [参照リソース](#reference-resource)
    -   [ターゲット](#target)
    -   [リレーションシップ](#relationship)
    -   [キャッシュ](#cache)
    -   [参照された文書のプリフェッチ](#prefetch)
    -   [トランジション アニメーション](#animation)
    -   [ボタンのような外観](#button)
    -   [テーマ](#theme)
    -   [属性](#attributes)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`Link` MVC ラッパーは、HTML 参照を描画するために使用されます。このヘルパーには `Link` を構成し、それをカスタマイズするための補助メソッドがいくつかあります。

![](images/02_LinkOverview_1.png)

![](images/02_LinkOverview_2.png)



## <a id="summary"></a> Link MVC ラッパーの主な機能の概要

以下の表は、`Link` MVC ラッパーの主な機能をまとめています。個々のメソッドの詳細情報は、[*Link *のプロパティ参照](Link-Property-Reference.html)トピックを参照してください。

機能|説明
---|---
テキスト|[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。
参照リソース|Link MVC API によって、読み込みたいリソースを参照することができます。
ターゲット|参照されたリソースのコンテナーになるターゲット ウィンドウを設定します。
リレーションシップ|現在の文書と参照された文書の関係を定義します。
キャッシュ|参照されたページを DOM にキャッシュするのを有効または無効にする機能。
参照された文書のプリフェッチ|要求時により高速に読み込むために、参照されたリソースをプリフェッチします。AJAX を使用して、バックグラウンドで文書をプリフェッチすることができます。
トランジション アニメーション|参照された文書に移行するときのアニメーション タイプを設定します。
ボタンのような外観|Link をボタンに変換し、そのメソッドを使用してカスタマイズすることができます。
テーマ|リンクは標準 jQuery Mobile テーマを受け付けます。
属性|MVC Link  ラッパーには、クライアントでレンダリングされる HTML 属性のリストを受け付けるメソッドがあります。



## <a id="features"></a> Link MVC ラッパーの機能

### <a id="text"></a> テキスト

[`Text`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Text.html) プロパティは、コントロールのテキストを取得または設定できるようにするプロパティです。

![](images/02_LinkOverview_1.png)

### <a id="reference-resource"></a> 参照リソース

`Link` MVC API によって、読み込みたいリソースを参照することができます。Link [`NavigateUrl`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~NavigateUrl.html) メソッドを使用してリソースを参照すると、クライアント上でこれは、アンカー タグの HTML href 属性の値として描画されます。

### <a id="target"></a> ターゲット

参照されたリソースのコンテナーになるターゲット ウィンドウを設定します。Link Target メソッドを使用してコンテナーを設定すると、クライアント上でこれは、アンカー タグの HTML target 属性の値として描画されます。

### <a id="relationship"></a> リレーションシップ

現在の文書と参照された文書の関係を定義することができます。[`DestinationRelationship`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~DestinationRelationship.html) メソッドを使用して文書の関係を定義すると、クライアント上でこれは、アンカー タグの HTML data-rel 属性の値として描画されます。

### <a id="cache"></a> キャッシュ

これは参照されたページを DOM にキャッシュするのを有効または無効にする機能です。`Link` [`DomCache`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~DomCache.html) メソッドを使用してページのキャッシングを有効または無効にすると、クライアント上でこれは、アンカー タグの HTML data-dom-cache 属性の値として描画されます。

### <a id="prefetch"></a> 参照された文書のプリフェッチ

要求時により高速に読み込むには、参照されたリソースを [`Prefetch`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Prefetch.html) します。AJAX を使用して、バックグラウンドで文書をプリフェッチすることができます。`Link` Prefetch メソッドを使用してページのプリフェッチを有効または無効にすると、クライアント上でこれは、アンカー タグの HTML data-prefetch 属性の値として描画されます。AJAX を使用すると、属性 data-ajax の値を描画する `Link` Ajax メソッドで、同じ動作が発生します。

### <a id="animation"></a> トランジション アニメーション

参照された文書に移行するときのアニメーション タイプを設定できます。`Link` Transition メソッドを使用してページ移行アニメーションを設定すると、クライアント上でこれは、アンカー タグの HTML data-transition 属性の値として描画されます。これは、data-direction 属性を反対の値で描画する `Link` [`ReverseDirection`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~ReverseDirection.html) メソッドでも同じです。

### <a id="button"></a> ボタンのような外観

`Link` をボタンに変換して、その Button メソッドを使用してカスタマイズすることができます。Button MVC メソッドの詳細については、[Button](Button.html) トピックを参照してください。

![](images/02_LinkOverview_2.png)

### <a id="theme"></a> テーマ

`Link` は標準 [jQuery Mobile テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)を受け入れますが、テーマは、コントロールがボタンのような外観を持つ場合にのみ適用できます。デフォルトで、MVC ラッパーは、デフォルトの jQuery Mobile フォーム、つまり「c」を使用してコントロールを描画します。以下の画像はテーマ「e」でカスタマイズされたボタンを示しています。

![](images/02_LinkOverview_5.png)

### <a id="attributes"></a> 属性

MVC `Link`  ラッパーには、クライアントでレンダリングされる HTML 属性のリストを受け付けるメソッドがあります。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Link* の追加](Adding-Link.html): このトピックでは、Infragistics MVC ラッパーを使用した `Link` を有効にするために必要な情報を提供します。

- [*Link* の構成](Configuring-Link.html): このトピックでは、MVC ラッパーを使用した `Link` を構成するために必要な情報とリファレンスを提供します。

- [*Link* のプロパティ リファレンス](Link-Property-Reference.html): このトピックでは、`Link` MVC ラッパーのプロパティに関するリファレンス情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-link/basic-usage): このサンプルでは、`Link` の ASP.NET MVC ヘルパーの使用方法を紹介します。





 

 



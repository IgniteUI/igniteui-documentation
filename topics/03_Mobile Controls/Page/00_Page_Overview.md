<!--
|metadata|
{
    "fileName": "page-overview",
    "controlName": "Page",
    "tags": ["Getting Started","Layouts","MVC"]
}
|metadata|
-->

# Page の概要

## トピックの概要
#### 目的

このトピックでは、Page MVC ラッパーに関連する情報について説明します。

#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [Page MVC ラッパーの各種機能](#wrapper-features)
-   [関連コンテンツ](#related-content)

## <a id="introduction"></a> 概要
Page MVC ラッパーは、[jQuery モバイル](http://jquerymobile.com/demos/1.1.1/docs/pages/page-anatomy.html)のコンテキストで各 Page のコンテナーを定義するために使用します。Page ラッパーのフラグメントを開いて閉じるまでの間に、Page HTML コンテンツのほか、[Page Content](PageContent.html)、[Page Footer](PageFooter.html)、[Page Header](PageHeader.html)、その他 jQuery モバイル コントロールを定義できます。1 つの MVC ビューに複数のページを定義できますが、最初のページだけがアクティブになります。ページを変更したい場合は、手動で変更する必要があります。Page MVC ヘルパーは jQuery Mobile [page](http://jquerymobile.com/demos/1.1.1/docs/pages/index.html) ウィジェットをレンダリングします。ページの各部の名称およびページの切り替えに関する詳細については、jQuery モバイルによって提供されるこの[リスト](http://jquerymobile.com/demos/1.1.1/docs/pages/index.html)を調べてください。


## <a id="wrapper-features"></a> Page MVC ラッパーの各種機能

### タイトル
Page タイトルは、[Title](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~Title.html) の MVC コントロール メソッドを使用することによって定義できます。ページ [Title](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~Title.html) メソッドを使用してページの名前を付けると、クライアント側の Page コンテナーの HTML `data-title attribute` がページのタイトルとして使用されることになります。

### 参照先
MVC ビューに複数のページがある場合、各ページを変更できるようにするには、各ページへの参照を定義しておく必要があります。[Url](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~Url.html) メソッドは Page のアドレスを定義します。Page [Url](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~Url.html) メソッドを使用すると、クライアント側の Page コンテナーの HTML `data-url` 属性値がページの URL として使用されることになります。

### キャッシュ
1 つのビュー内に配置されている複数のページを表示していった場合、jQuery モバイル フレームワークでは、1 つの Page だけが DOM ブラウザー内で使用可能な状態になり、別のページに移動するとその Page がクリアされるようになっています。[DomCache](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~DomCache.html) プロパティを使用することにより、このデフォルト ビヘイビアーを無効にして、DOM ブラウザーでの Page をキャッシュを有効にすることができます。Page [DomCache](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.PageModel~DomCache.html) メソッドを使用してキャッシュを有効化または無効化すると、クライアント側の Page コンテナーの HTML `data-dom-cache` 属性値が使用されることになります。

### 戻るボタンと閉じるボタン
ナビゲーション ボタンを追加できます。追加できるボタンは、後進ボタンと閉じるボタンの 2 種類です。戻るボタンは、Page ヘッダー内に表示されるボタンであるため、必ず定義しておく必要があります。このボタンのテキストとテーマを構成できます。閉じるボタンは、ダイアログ内で Page を開いたときにだけ表示されます。閉じるボタンのテキストもカスタマイズできます。構成したボタンと共に Page が表示されたときにブラウザー ページの外観を確認すれば、`data-add-back-btn`、`data-back-btn-text`、`data-back-btn-theme`、`data-close-btn-text` といったプロパティの値を決定できるようになります。

### テーマ
Page は、標準の [jQuery Mobile テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)に対応しています。特に指定しない限り、MVC ラッパーは、既定の jQuery モバイル形式 (つまり、テーマ `c`) で各コントロールを表示します。

### 属性
MVC Page ラッパーは、クライアント側で表示される一連の HTML 属性に対応したメソッドを備えています。

## <a id="related-content"></a> 関連コンテンツ

### トピック
このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Page* の追加](Adding-Page.html): このトピックでは、Infragistics MVC ラッパーを使用して Page を有効にする場合に必要な情報について説明します。
- [*Page* 構成](Page-Configuring.html): このトピックでは、MVC ラッパーを使用して Page を構成する場合に必要な情報と参照について説明します。
- [Page プロパティ参照](Page-Property-Reference.html): このトピックでは、Page MVC ラッパーのプロパティに関する参照情報について説明します。

### サンプル
このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-page/basic-usage): このサンプルでは、Page ASP.NET MVC ヘルパーを使用して、「data-role="Page"」 の HTML DIV 要素を定義する方法を示します。

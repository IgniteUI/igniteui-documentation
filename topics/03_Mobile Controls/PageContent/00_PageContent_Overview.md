<!--
|metadata|
{
    "fileName": "pagecontent-overview",
    "controlName": "PageContent",
    "tags": ["Getting Started","Layouts","MVC"]
}
|metadata|
-->

# PageContent の概要

## 概要
`PageContent` は、ページ中の実際のコンテンツとは意味的に異なります。ラッパーは、親 MVC Page ラッパーが必要です。各 Page は `PageContent` 領域を 1 つだけ含みます。ランタイム時に、MVC ラッパーは「data-role="content"」のタグが含まれる HTML DIV 要素を描画します。

## PageContent MVC ラッパーの機能
### テーマ
`PageContent` は標準の [jQuery Mobile テーマ](http://jquerymobile.com/demos/1.1.1/docs/api/themes.html)を受け入れます。デフォルトで、MVC ラッパーはテーマ「c」からのコントロールを描画します。

### 属性
MVC `PageContent` ラッパーには、クライアント上で描画される HTML 属性のリストを受け入れるメソッドが含まれます。

## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*PageContent* の追加](Adding-PageContent.html): このトピックには、Infragistics MVC ラッパーを使用して PageContent を有効にするために必要な情報が含まれています。
- [PageContent プロパティ参照](PageContent-Property-Reference.html): このトピックでは、PageContent MVC ラッパーのプロパティに関するリファレンス情報を提供します。

### サンプル
このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-pagecontent/basic-usage): このサンプルは、Content ASP.NET MVC ヘルパーを使用して、「data-role="content"」の HTML DIV 要素を描画する方法を示します。

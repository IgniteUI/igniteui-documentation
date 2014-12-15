<!--
|metadata|
{
    "fileName": "adding-pagefooter",
    "controlName": "PageFooter",
    "tags": ["How Do I","Layouts","MVC"]
}
|metadata|
-->

# PageFooter の追加
このトピックでは、Infragistics MVC ラッパーで PageFooter を有効にするために必要な情報を紹介します。

## 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。
- [PageFooter の概要](PageFooter-Overview.html): このトピックでは、PageFooter MVC ラッパーに関する情報を紹介します。

## PageFooter の追加
この手順では、MVC ラッパーを使用して、MVC ソリューションで PageFooter を追加する方法を説明します。PageFooter ラッパーの複数のインスタンスを 1 つの MVC ビューに追加することができますが、アクティブにできるのはその内の 1 つのみです。このサンプルは、空の `PageFooter` コントロールを初期化する方法、およびこれが描画されクライアント ブラウザに送信された結果を示しています。

### コードのプレビュー 
次のコードは、最終結果として表示される HTML を示しています。

**HTML の場合:**

```
<div data-role="page-footer" 
     id="pgftr1" >
</div>
```

### 前提条件 

この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC Mobile アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

## 手順

以下の手順では、基本 PageFooter ラッパーを初期化する方法を示します。

​1. ビュー ページにリソースを含めます

`Infragistics.Web.Mvc.Mobile.dll` への参照と、Infragistics Mobile Loader への参照が必要です。次の例では、`js` および `css` ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、`js` および `css` ファイルの実際の格納場所に合わせて変更する必要があります。

**Razor の場合:**
```
@using Infragistics.Web.Mvc.Mobile
<script src="http://code.jquery.com/jquery.min.js"></script>
<script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile.min.js"></script>
<script type="text/javascript" src="http://localhost/ig_mobileui/js/infragistics.mobile.loader.js"></script>
@(Html.InfragisticsMobile().
    Loader().
    ScriptPath("http://localhost/ig_mobileui/js/").
    CssPath("http://localhost/ig_mobileui/css/").
    Render())
```

​2. `PageFooter` をビュー ページに追加します

`PageFooter` の開始をマークするには、以下のコードを追加します。

**Razor の場合:**
```
@(Html.InfragisticsMobile()
    .PageFooter()
    .ID("pgftr1")
    .Title("PageFooter")
    .BeginRender())
```

ページ コンテンツの追加が終わったら、以下のコードを追加して、描画されるコンテンツの終わりをマークする必要があります。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .PageFooter()
    .ID("pgftr1")
    .EndRender())
```

​3. 結果を検証します

ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。


## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [PageFooter の概要](PageFooter-Overview.html): このトピックでは、PageFooter MVC ラッパーの使用方法を説明します。
- [PageFooter プロパティのリファレンス](PageFooter-Property-Reference.html): このトピックでは、PageFooter MVC ラッパーのプロパティに関する参照情報を紹介します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-pagefooter/basic-usage): このサンプルでは、jQuery Mobile ページ、ヘッダー、フッター、およびコンテンツ要素を描画するために使用される複数の ASP.NET MVC ヘルパーを紹介します。

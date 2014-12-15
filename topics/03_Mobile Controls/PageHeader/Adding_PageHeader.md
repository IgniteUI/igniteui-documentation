<!--
|metadata|
{
    "fileName": "adding-pageheader",
    "controlName": "PageHeader",
    "tags": ["How Do I","Layouts","MVC"]
}
|metadata|
-->

# PageHeader の追加

ここでは、MVC ラッパーを使用して MVCソリューションのビュー Page Header に Page Header を追加する手順について説明します。Page Header ラッパーの複数のインスタンスを 1 つの MVC View に追加できますが、アクティブにできるのはそのうち 1 つだけです。以下のサンプルは、Page Header を MVC View に追加する手順と、描画され、クライアント ブラウザーに送信される結果を示しています。

## コードのプレビュー 
次のコードは、最終結果として表示される HTML を示しています。

**HTML の場合:**

```
<div data-role="page-header" 
     id="pghdr1" >
</div>
```

## 前提条件 

この手順を実行する前に、以下の作業を終えておく必要があります。

-   MVC Mobile アプリケーションを作成します。
-   MVC リアシュアランス ラッパーに必要なリソースへの参照をプロジェクトに追加します。

## 手順

​1. リソースをビュー ページへ組み込む

`Infragistics.Web.Mvc.Mobile.dll` への参照と、Infragistics Mobile Loader への参照が必要です。次の例では、js および css ファイルのすべてが `ig_mobileui` という仮想ディレクトリーに置かれています。この手順を完了させるためには、このフォルダーの名前を、js および css ファイルの実際の格納場所に合わせて変更する必要があります。

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

​2. `Page Header` をビュー ページへ追加する

Page Header の開始をマークするには、以下のコードを追加します。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .PageHeader()
    .ID("pghdr1")
    .Title("Page Header")
    .BeginRender())
```

ページ コンテンツの追加が終わったら、以下のコードを追加する必要があります。このコードは、描画されるコンテンツの終わりをマークします。

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .PageHeader ()
    .ID("pgftr1")
    .EndRender())
```

​3. 結果を確認する

ビューを保存し、アプリケーションをビルドし直して実行し、その結果を確認します。

## 関連コンテンツ
#### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [PageHeader の概要](PageHeader-Overview.html): このグループのトピックでは、Page Header MVC ラッパーの使用方法について説明します。
- [PageHeader のプロパティ参照](PageHeader-Property-Reference.html): このトピックでは、Page Header MVC ラッパーのプロパティに関する参照情報について説明します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-pageheader/basic-usage): このサンプルでは、jQuery Mobile ページ、ヘッダー、フッター、およびコンテンツ要素を描画するために使用される複数の ASP.NET MVC ヘルパーを紹介します。





 

 



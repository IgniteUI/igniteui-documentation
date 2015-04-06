<!--
|metadata|
{
    "fileName": "referencing-mobile-resources-in-netadvantage-for-jquery",
    "controlName": "",
    "tags": ["Deployment"]
}
|metadata|
-->

# Ignite UI でのモバイル リソースの参照

##トピックの概要

### 目的

本トピックでは、Ignite UI コントロールに必要なモバイル リソースの管理方法について説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**jQuery コントロール用の外部モバイル リソースの参照**](#external)
-   [**jQuery コントロール用の Infragistics モバイル リソースの参照**](#ig-resources)
    -   [カスタム ダウンロードからインフラジスティクス JavaScript の参照](#custom-build)
    -   [Loader によるリソースの参照](#loader)
    -   [CSS および JavaScript ファイルの参照](#manual)
    -   [インストールされるリソース](#installed)
    -   [Infragistics コンテンツ配信ネットワーク (CDN) リソース](#cdn)
-   [**jQuery コントロール用のローカライズ モバイル リソースの参照**](#localization)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)
    -   [リソース](#resources)


## <a id="introduction"></a> 概要

Ignite UI 2012.2 モバイル コントロールに含まれているコントロールは、`igListView`™ と `igRating`™ の 2 つです。どちらのコントロールも、Ignite UI コントロールとは異なる新たなウィジェットで、モバイル プラットフォームに合わせて改良されたものです。各コントロールをページ上で使用するには、特定のスクリプトと CSS ファイルが必要です。本トピックでは、Ignite UI コントロールに必要なモバイル リソースの管理方法について説明します。

![](images/01_ReferencingResourcesInJQueryMobile_1.png)



## <a id="external"></a> jQuery コントロール用の外部モバイル リソースの参照

### 外部リソース参照の概要

Ignite UI モバイル コントロールの使用には、[jQuery](http://jquery.com/) と [jQuery Mobile](http://jquerymobile.com) の JavaScript ライブラリが必要です。これに加えて、最新のブラウザー機能を検出する [Modernizr](http://modernizr.com/) の使用を強くお勧めします。

> **注:** Ignite UI モバイル コントロールは Modernzir に依存したものではありませんが、Modernizr を併用することにより、モバイル環境での使い勝手が向上します。

次のリストは、最新バージョンの必須リソースをまとめたものです。それぞれのリソースは、互いに共存可能なもので、Ignite UI コントロール スクリプト (次のブロックを参照) とも互換性のあるリソースです。

-   jQuery 1.6.4 ([jQuery のダウンロード](http://docs.jquery.com/Downloading_jQuery))
-   jQuery Mobile 1.0.1 RTM ([jQuery Mobile のダウンロード](http://jquerymobile.com/download/))
-   Modernizr 2.5.3 (テスト版のボックス サイズ変更機能を装備したカスタム ビルド*。[Modernizr のダウンロード](http://modernizr.com/download/))(オプション)

**JQuery Mobile の基本構成 CSS ファイル**を参照する必要もあります。**これは各コントロールに必要な基本構成 CSS ファイルです。**

-   jQuery Mobile - jquery.mobile.structure.css ([jQuery Mobile のダウンロード](http://jquerymobile.com/download/))

> **注:** 既定の Modernizr パッケージには含まれていない *css-boxsizing* には一定の要件があります。Moderznir コードを生成する場合には、(コミュニティのアドオンから) *css-boxsizing* にチェックを入れておく必要があります。

![](images/01_ReferencingResourcesInJQueryMobile_2.png)

> **注:** Ignite UI のサポートされるフレームワーク バージョンの詳細について、[http://jp.infragistics.com/help/supported-environments](http://jp.infragistics.com/help/supported-environments) を参照してください。

### JavaScript ライブラリの参照

上述のライブラリを追加する必要がある参照。

JQuery ライブラリ:

**HTML の場合:**

```
<script src="Scripts/jquery.min.js" type="text/javascript"></script>
```

jQuery Mobile:

**HTML の場合:**

```
<script src="Scripts/jquery.mobile.min.js" type="text/javascript"></script>
```

Modernizr ライブラリ:

**HTML の場合:**

```
<script scr="Scripts/modernizr.js" type="text/javascript"></script>
```

### jQuery Mobile CSS の参照

Ignite UI ウィジェットのレイアウトを定義するには、JQuery Mobile の基本構造 CSS ファイルが必要です。次のコード例には基本構造 CSS ファイルが含まれています。

jQuery Mobile の基本構造 CSS ファイル:

**HTML の場合:**

```
<link href="Content/jqm/jquery.mobile.structure.min.css" rel="stylesheet" type="text/css" />
```


## <a id="ig-resources"></a> jQuery コントロール用の Infragistics モバイル リソースの参照

### Infragistics 各種リソースの参照

Ignite UI からモバイル コントロールを操作するには、ページ内で Infragistics リソースを参照する必要があります。こうしたリソースは、次のような方法で参照できます。

- [カスタム ダウンロードからインフラジスティクス JavaScript の参照](#custom-build): これは Ignite UI JavaScript ファイルを参照する方法です。Ignite UI コントロールの[カスタム ダウンロード](%%SamplesUrl%%/download)を作成できます。

- [Infragistics Loader の使用](#loader): Infragistics Loader は、すべての Infragistics リソース (スタイルおよびスクリプト) を解決するために使用されます。

- [すべての CSS および JavaScript ファイルを手動でインクルードする方法](#manual): Infragistics のテーマ、スタイル、スクリプトなど、必要なファイルをすべて手動で参照できます。


次のリンクは、スクリプトおよびスタイル ファイルの格納場所をまとめたものです。各リソースには、さまざまな方法でアクセスできます。

- [インストールされるリソース](#installed): パケットからインストールされる全リソースの格納場所です。

- [コンテンツ配信ネットワーク (CDN) リソースによる参照のインクルード](#cdn): JavaScript ファイルは、Infragistics CDN 上のホスト環境でも使用可能です。



> **注:** 既定の iOS テーマは、別のテーマ、たとえば、カスタムの ThemeRoller テーマに書き換えることできますが、特に使用したいテーマがない限りは、iOS テーマをインクルードしておいた方がよいでしょう。

### <a id="custom-build"></a> カスタム ダウンロードからインフラジスティクス JavaScript の参照

Ignite UI カスタム ビルドを作成するには、[カスタム ダウンロード ページ](%%SamplesUrl%%/download)を参照してください。カスタム ビルドには 2 つの利点があります。1. アプリケーションで使用されるコントロールおよび機能のみをダウンロードすることにより、最小限の JavaScript で実行することができます。2. JavaScript を 1 つのファイルに結合し、ブラウザーがサーバーへの要求の数を減らします。この利点により、アプリケーションのパフォーマンスを向上します。

**HTML の場合:**

```
<script src="../scripts/infragistics.mobile.js" type="text/javascript"></script>
```

**ASPX の場合:**

```
<%@ Import Namespace="Infragistics.Web.Mvc" %>
<!DOCTYPE html>
<html>
<head runat="server">
..    
<script src="<%= Url.Content("~/scripts/infragistics.mobile.js") %>" type="text/javascript"></script>
```

### <a id="loader"></a> Loader によるリソースの参照

Infragistics Loader は、Infragistics のリソース (スタイルやスクリプト) を解決して自動的にページに読み込んでくれます。必要な CSS と JavaScript ファイルへのパスを提供し、ローダーがページにフェッチするリソースを宣言する必要があります。

Infragistics Loader を参照する必要があります。

**HTML の場合:**

```
<script src="js/infragistics.loader.js" type="text/javascript"></script>
```

次の JavaScript コードを入れた別の `<script>` 要素を追加して Infragistics Loader を呼び出す必要があり、さらに、ロードしたいウィジェットのリソースを宣言しておく必要があります。たとえば、次のコードは、Loader を初期化し、`igListView` コントロールに必要なリソースをすべて要求して iOS テーマをロードします。

**HTML の場合:**

```
$.ig.loader({
       scriptPath: "js/",
       cssPath: "css/",
       resources: "igmList",
       theme: "ios"
});
```

Loader も ASP.NET MVC ラッパーを備えています。ラッパーが使用されるため、Loader を初期化するときにコントロールのリソースをその都度指定する必要はありません。必要なリソースは、当該のコントロールのラッパーから自動的に追加されるようになっています。

**C# の場合:**

```
@(Html.InfragisticsMobile().
    Loader().
    ScriptPath("js/").
    CssPath("css/").
    Theme("ios").
    Render())
```

上記のコードは各リソースを非同期的な形でロードします。Loader はコールバック関数をエクスポーズします。このコールバック関数には、当該のローダーによって管理されるリソースに応じて異なる実行コードを指定しておくことができます。次のコード サンプルは、カスタム コードのコールバックを使用する方法を示しています。

**HTML の場合:**

```
$.ig.loader(function () {
       /// DO YOUR LOGIC HERE
});
```

Infragistics Loader の完全な使用例については、「[ASP.NET MVC プロジェクトへのモバイル コントロールの追加](Adding-Mobile-Ignite-UI-Controls-to-an-ASP.NET-MVC-Application.html)」というトピックをお読みになるか、モバイル `igRating` のサンプルをご覧ください。

### <a id="manual"></a> CSS および JavaScript ファイルの参照

モバイル コントロール用のリソースを手動で参照したい場合には、iOS テーマ、jQuery Mobile の基本構造 CSS ファイル、および JavaScript の基本ファイルをインクルードする必要があります。

この方式では、アプリケーションに不要なスクリプトを除外できます。たとえば、リスト ビューを使用しない場合には、リスト ビューに関連した次のようなスクリプトをすべて除外できます:

-   *infragistics.util.js*
-   *infragistics.templating.js* など

最初に、アプリケーションで使用するモバイル コントロールの CSS をインクルードしておく必要があります。

Infragistics テーマ:

**HTML の場合:**

```
<!--INFRAGISTICS THEME-->
<link type="text/css" href="css/themes/ios/infragistics.mobile.theme.css" rel="stylesheet" />
```

> **注:** 既定の iOS テーマは別のテーマに書き換えることができますが、特に使用したいテーマがない限りは、iOS テーマをインクルードしておいた方がよいでしょう。

次に、コントロールに固有なスタイルおよびスクリプトをインクルードする必要があります。igListView および igRating に必要なリソースをそれぞれ表にまとめると、次のようになります。

`igListView` のモバイルの基本構造 CSS ファイル:

**HTML の場合:**

```
<link type="text/css" href="content/css/structure/modules/infragistics.mobile.list.css" rel="stylesheet" />
```

`igRating` のモバイルの基本構造 CSS ファイル:

**HTML の場合:**

```
<link type="text/css" href="content/css/structure/modules/infragistics.mobile.rating.css" rel="stylesheet" />
```

`igListView` のモバイル スクリプト

**HTML の場合:**

```
<script type="text/javascript" src="js/modules/infragistics.util.js"></script>
<script type="text/javascript" src="js/modules/infragistics.datasource.js"></script>
<script type="text/javascript" src="js/modules/i18n/infragistics.dataSource-en.js"></script>
<script type="text/javascript" src="js/modules/infragistics.ui.scroll.js"></script>
<script type="text/javascript" src="js/modules/infragistics.templating.js"></script>
<script type="text/javascript" src="js/modules/infragistics.mobileui.list.js"></script>
<script type="text/javascript" src="js/modules/infragistics.mobileui.list.sorting.js"></script>
<script type="text/javascript" src="js/modules/infragistics.mobileui.list.filtering.js"></script>
<script type="text/javascript" src="js/modules/infragistics.mobileui.list.loadondemand.js"></script>    
<script type="text/javascript" src="js/modules/i18n/infragistics.mobileui.list-en.js"></script>
```

`igRating` のモバイル スクリプト

**HTML の場合:**

```
<script type="text/javascript" src="js/modules/infragistics.mobileui.rating.js"></script>
```


### <a id="installed"></a> インストールされるリソース

Ignite UI %%ProductVersion%% のインストール時に一般的なフォルダー構成を選択した場合、各リソースは次のパスに置かれています。

タイプ|パス
---|---
アセンブリ|%%InstallPath%%\MVC\
スクリプト ファイル|%%InstallPath%%\mobile\js\
CSS ファイル|%%InstallPath%%\mobile\css\


![](images/01_ReferencingResourcesInJQueryMobile_3.png)

スクリプトは **js** フォルダーに収められています。JavaScript ファイルの参照をすべて手動でインクルードすることも、Infragistics Loader を使用することもできます。

![](images/01_ReferencingResourcesInJQueryMobile_4.png)

これらのファイルでは、modules フォルダー内にあるすべてのソース ファイルについて、古い命名規則に従ったファイル名が使用されます。

-   *infragistics.mobileui.CONTROL_NAME.js*
-   *infragistics.mobileui.CONTROL_NAME.CONTROL_FEATURE.js*

> **注:** 読み込まれるファイルのなかには、jQuery の非モバイル コントロールのソース ファイルもあります。たとえば、*infragistics.datasource.js*。これは、`igListView` に関するデータ ソースのバインドに使用されるファイルです。

ローカライズ フォルダー (**i18n**) には、各コントロールのローカライズ ファイルが収められています。

次のスクリーンショットは、もう 1 つのフォルダー、css の中身を示したものです。

![](images/01_ReferencingResourcesInJQueryMobile_5.png)

基本構造 CSS ファイルを含めて、どのコントロールに関する CSS ファイルも、すべて structure フォルダーに収められています。Infragistics モバイルのテーマは **themes** フォルダーに置かれています。

> **注:** iOS テーマは、リリース 2012.2 の Ignite UI に使用できる唯一のテーマです。

「[Ignite UI で使用される JavaScript ファイル](Deployment-Guide-JavaScript-Files.html)」トピックには、各コントロールに必要とされるスクリプトがすべて記載されています。


### <a id="cdn"></a> Infragistics コンテンツ配信ネットワーク (CDN) リソース

JavaScript ファイルは、Infragistics CDN 上のホスト環境でも使用可能です。CDN の使用には多くのメリットがあるため、詳しくは、ヘルプ トピック「[Infragistics コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html)」を参照してください。




## <a id="localization"></a> jQuery コントロール用のローカライズ モバイル リソースの参照

### ローカライズ リソースの参照

ローカライズ ファイルは localization フォルダー (**i18n**) に置かれています。

このトピックのセクション「[jQuery コントロール用の Infragistics モバイル リソースの参照](#ig-resources)」に示した手順どおりに Infragistics のリソースを追加すると、Web アプリケーションの **scripts** フォルダーに modules フォルダーが作成されます。modules フォルダーの中には **i18n** フォルダーが作成され、このフォルダーには、`igListView` を日本語にローカライズするための JavaScript ファイルが収められます。

> **注:** ローカライズ リソースは、必ずモバイル コントロール ウィジェットよりも先に読み込む必要があります。

ローカライズ リソースの参照方法には２通りあります。

-   Infragistics リソース (スタイルおよびスクリプト) およびローカライズ リソースについて解決する Infragistics Loader の使用。
-   ローカライズ スクリプトを手動で参照。

以下の各サンプルは、上記 3 つの JavaScript ファイルがすで存在するものとして、日本語化リソースをインクルードする方法を示したものです。

### 英語ローカライズの参照

英語ローカライズ ファイルは jQuery Mobile の JavaScript ファイルに組み込まれています。英語については、ローカライズ リソースをインクルードする必要はありません。

### コード例: Loader によるローカライズ リソースの参照

次のコード例は、Infragistics Loader によるローカライズ リソースのインクルード方法を示したものです。`igListView` ウィジェット ローカライズは `igLoader` のロケール オプションによって管理されます。

**JavaScript の場合:**

```
$.ig.loader({
    cssPath: "css/",
    scriptPath: "js/",
    resources: 'igListView',
    locale: 'ja'
});
//Continue loading the igListView widget
```

完全なサンプル コードおよび Infragistics Loader の詳細については、トピック「Infragistics Loader の使用」を参照してください。

### コード例: ローカライズ リソースのマニュアル参照

次のコード例は、ローカライズ リソースを手動でインクルードする方法を示したものです。

> **注:** ローカライズ スクリプトは、ページ コード内の実際の JavaScript ファイルの前に参照する必要があります。

**HTML の場合:**

```
<!-- LOCALIZATION SCRIPTS -->
<script scr="js/modules/i18n/infragistics.mobileui.list-ja.js" type="text/javascript"></script>
<!-- BASE IG SCRIPTS -->
<script type="text/javascript" src="js/modules/infragistics.mobileui.list.js"></script>
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ASP.NET MVC アプリケーションへのモバイル Ignite UI コントロールの追加](Adding-Mobile-Ignite-UI-Controls-to-an-ASP.NET-MVC-Application.html): このトピックでは、ASP.NET MVC アプリケーションにモバイル コントロールを追加する方法について説明します。

- [Ignite UI でのリソースの参照](Deployment-Guide-JavaScript-Resources.html): 本トピックでは、Ignite UI コントロールに必要なリソースの管理方法について説明します。

- [igList の概要](igListView-Overview.html): このトピックでは、`igListView` の機能について説明します。

- [igRating の概要](igRating%28Mobile%29-Overview.html): このトピックでは、`igRating` の主な特徴と機能が紹介されています。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。これらのサンプルでは、Loader を使用して `igListView` や `igRating` のリソースをロードする方法が示されています。

- [*igListView* のロード オン デマンド](%%SamplesUrl%%/mobile-list-view/load-on-demand): このサンプルでは、オン デマンドで `igListView` に項目をロードする方法が示されています。

- [*igRating* の既定値](%%SamplesUrl%%/mobile-rating/basic-usage): さまざまな方法を使用して `igRating` の初期化方法を示すサンプル。


### <a id="resources"></a> リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

- [jQuery](http://jquery.com/): JQuery JavaScript ライブラリのホーム ページ

- [jQuery Mobile](http://jquerymobile.com): jQuery Mobile JavaScript ライブラリのホームページ

- [Modernizr](http://modernizr.com/): Modernizr JavaScript ライブラリのホーム ページ





 

 



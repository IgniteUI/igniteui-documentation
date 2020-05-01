<!--
|metadata|
{
    "fileName": "getting-started",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# %%ProductName%% を使用した作業の開始

## このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [ダウンロードおよびインストール](#download)
-   [%%ProductFamilyName%% をプロジェクトにホストする](#hosting)
	-   [%%ProductFamilyName%% CLI の使用](#igniteui-cli)
    -   [NPM、JSPM、NuGet の使用](#package_managers)
    -   [CSS および JavaScript 参照の追加](#add_references)
    -   [%%ProductName%% ボイラープレート HTML ページのサンプル (CDN リンクを使用)](#boilerplate)
-   [最初のコントロールの追加](#first_control)
    -   [igGrid を直接に追加](#directly)
    -   [igGrid をページ デザイナーを使用して追加](#page_designer)
-   [必要最低限](#custom_download)
-   [CDN リンクの使用](#cdn)
-   [TypeScript の定義](#typescript)
-   [AngularJS 拡張子](#angularjs)
-   [Angular 拡張子](#angular)
-   [ReactJS 拡張子](#reactjs)
-   [%%ProductNameMVC%%](#aspnet_wrappers)
-   [関連コンテンツ](#related_content)

## <a id="introduction"></a>概要

%%ProductName%%＆trade; はきれいでモダンな Web アプリケーションを作成するための高度な HTML5 + ツールセットです。jQuery および jQuery UI をベースとしたチャート、データ視覚化マップ、(階層編集可能な) グリッド、ピボット グリッド、エンハンスト エディター （コンボボックス、マスクエ ディター、HTML エディター、日付ピッカー、など)、柔軟なデータソース コネクタなど、機能豊かで高性能な UI コントロールおよびウィジェットを提供します。

%%ProductName%% は 2 つのバージョンで提供します。 
-   オープン ソース版 - 完全なツールセットのサブセットを含む無償版。グリッドおよびデータ ビジュアライゼーションのコントロールは含まれません。詳細については、GitHub&trade; の [%%ProductName%% OSS](https://github.com/IgniteUI/ignite-ui) プロジェクトを参照してください。
-   完全版 - 完全なツールセットが含まれた有償版。

## <a id="download"></a>ダウンロードおよびインストール

%%ProductName%% は[ダウンロード ページ](http://jp.infragistics.com/products/ignite-ui/download)からダウンロードできます。 
お使いのオペレーティング システムにより、試用版およびライセンス版の両方の製品をインストールするためにいくつかのオプションがあります。

Windows の場合。

- **[プラットフォーム インストーラー](https://jp.infragistics.com/my-account/keys-and-downloads)**: プラットフォーム インストーラーは Windows のみのオンライン インストーラであり、%%ProductName%% をはじめとして、すべての Infragistics 開発ツール、そのヘルプとサンプルを管理 (インストール、更新、アンインストール) するためのウィザードのようなエクスペリエンスを提供します。

- **[すべての製品のダウンロード](http://jp.infragistics.com/products/ignite-ui/download)**: 
製品、ヘルプ、およびサンプルを含む Windows のみのオフライン MSI インストーラー。

MacOs、Linux、Unix 、などの場合。

- **[インストーラーなしのバンドルのダウンロード](http://jp.infragistics.com/products/ignite-ui/download)**: 
製品およびサンプルを含む Windows のみのオフライン MSI インストーラー。

## <a id="hosting"></a>%%ProductName%% をプロジェクトにホストする

%%ProductName%% をプロジェクトにホストするために複数のオプションがあります。
- %%ProductFamilyName%% CLI を使用
- NPM,、JSPM、NuGet のようなパッケージ マネージャーを使用します。
- [JavaScript ファイルおよび CSS ファイル](Adding-the-Required-Resources-for-IgniteUI-for-jQuery.html) を %%ProductName%% インストール ディレクトリからプロジェクトにコピーします。
- [Infragistics コンテンツ配信ネットワーク (CDN)](#cdn) を使用します。

## <a id="igniteui-cli"></a>%%ProductFamilyName%% CLI の使用

%%ProductFamilyName%% CLI は、Angular、React、および jQuery でアプリケーションを初期化、開発、スキャフォールディング、および処理するツールです。

CLI を使用するには、npm パッケージをグローバル モジュールとしてインストールします。

```
    npm install -g igniteui-cli
```

詳細については、「[%%ProductFamilyName%% CLI の使用](Using-Ignite-UI-CLI.html)」の使用トピックを参照してください。

## <a id="package_managers"></a>NPM、JSPM、NuGet の使用

%%ProductName%% では、NPM,、JSPM、NuGet、複数のパッケージ マネージャーをサポートします。

NPM （[%%ProductName%% オープン ソース](https://www.npmjs.com/package/ignite-ui)をインストールします）

```
    npm install ignite-ui
```

完全ライセンス版を構成する方法については、[%%ProductName%% npm パッケージの使用](Using-Ignite-UI-Npm-Packages.html)トピックを参照してください。

NuGet ([%%ProductName%% トライアル版](https://www.nuget.org/packages/IgniteUI/) をインストールします)

```
    Install-Package IgniteUI
```

ライセンス版を構成する方法については、[%%ProductName%% NuGet パッケージの使用](Using-Ignite-UI-NuGet-Packages.html)トピックを参照してください。

JSPM （[%%ProductName%% オープン ソース](https://www.npmjs.com/package/ignite-ui)をインストールします）
```
    jspm install npm:ignite-ui
```

完全ライセンス版を構成する方法については、[%%ProductName%% コントロールで System.JS を使用](Using-System.JS-with-IgniteUI-controls.html)トピックを参照してください。

### <a id="add_references"></a>CSS および JavaScript 参照の追加

%%ProductName%% がj Query および jQuery UI ライブラリに依存するため、%%ProductName%% スクリプトの前にそれへの参照を追加する必要があります。また、%%ProductName%% コントロールをページに追加するために複数のオプションがあります。
- 結合されたバンドル ファイルおよび圧縮化されたバンドル ファイルの参照 - インストールには、タイプごとにコントロールがグループ化された、結合されたファイルおよび圧縮されたファイルが含まれています。`infragistics.core.js`  (必須)、グリッドなどの Line of Business コントロールが含まれる `infragistics.lob.js`、チャートなどの Data Visualization コントロールが含まれる `infragistics.dv.js`、すべての Excel エクスポートに関連するロジックを含む `infragistics.excel-bundled.js`、スプレッドシート ユーザー インターフェイスの実装を含む `infragistics.spreadsheet-bundled.js`、およびすべてのスケジューラに関連するロジックを含む `infragistics.scheduler-bundled.js` があります。詳細については、[必要なリソースの手動で追加する](Adding-the-Required-Resources-for-IgniteUI-for-jQuery.html)トピックを参照してください。
- 個別のコントロール ファイルを参照する - 詳細については、[%%ProductName%% での JavaScript ファイル](Deployment-Guide-JavaScript-Files.html) トピックを参照してください。
- Infragistics Loader の使用 - Infragistics Loader は %%ProductName%% などのファイルを自動的に読み込みます。コントロール ファイルを手動で参照する手間を省きます。詳細については、 [Infragistics Loader による必要なリソースを自動で追加する](Using-Infragistics-Loader.html)  トピックを参照してください。
- AMD Loader の使用 - %%ProductName%% は AMD と互換性があるため、一般的な AMD ローダーで使用できます。

### <a id="boilerplate"></a>%%ProductName%% ボイラープレート HTML ページのサンプル (CDN リンクを使用)

次のコードは、%%ProductName%% の使用を開始するために必要な参照 （CDN リンク） を含むボイラープレート HTML ページのサンプルを表しています。

```
<!DOCTYPE html>
<html>
<head>
    <title></title>

    <!-- %%ProductName%% Required Combined CSS Files -->
    <link href="http://cdn-na.infragistics.com/igniteui/latest/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
    <link href="http://cdn-na.infragistics.com/igniteui/latest/css/structure/infragistics.css" rel="stylesheet" />
    
    <style>

        /* ----- CSS Goes Here ----- */

    </style>
</head>
<body>

    <!-- ----- HTML Goes Here ----- -->

    <table id="grid"></table>

    <!-- JavaScript Library Dependencies -->
    <script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="http://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

    <!-- %%ProductName%% Required Combined JavaScript Files -->
    <script src="http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.core.js"></script>
    <script src="http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.dv.js"></script>
    <script src="http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.lob.js"></script>    
    <script>

        $(function () {

            // ----- JavaScript Goes Here ----- //

        });

    </script>

</body>
</html>
```

## <a id="first_control"></a>最初のコントロールの追加

直接、またはページ デザイナーを使用する、という 2 つのオプションがあります。

### <a id="directly"></a>igGrid を直接に追加

<div class="embed-sample">
   [igGrid ページング](%%SamplesEmbedUrl%%/grid/paging)
</div>

### <a id="page_designer"></a>igGrid をページ デザイナーを使用して追加

%%ProductName%% [ページ デザイナー](http://designer.igniteui.com/index-release-jp.html)は、マウスのみの使用で %%ProductName%% コントロールを構成する完全なデザイナー エクスペリエンスを提供します。
ツールボックス （右側） からページ デザイン エリア （左） に `igGrid` を追加するために、[リストおよびピッカー] セクションから Grid コントロールをドラッグアンドドロップします。それから、プロパティ エディターを使用してグリッドを構成します。構成後、生成されたページをコピーします。

## <a id="custom_download"></a>必要最低限

%%ProductName%% の[カスタム ダウンロード ページ](https://jp.igniteui.com/download) には、プロジェクトで使用する %%ProductName%% コントロールと機能のみを選択し、最大のページ読み込みパフォーマンスのための、最適化された JavaScript ファイルおよび CSS ファイルをダウンロードするオプションがあります。

## <a id="cdn"></a>CDN リンクの使用

プロジェクトに %%ProductName%% スクリプト ファイルをホストする代わりに、%%ProductName%% CDN リンクを使用できます。インターネット アプリケーションの場合、通常 CDN は、社内でホストするよりすばやくエンド ユーザーにファイルを提供できます。

以下に、%%ProductName%% トライアル版のリンクをリストします。詳細については、[%%ProductName%% 対応 Infragistics コンテンツ配信ネットワーク (CDN)](deployment-guide-infragistics-content-delivery-network%28cdn%29.html) トピックを参照してください。

```
    <!-- %%ProductName%% Required Combined CSS Files (Trial) -->
    <link href="http://cdn-na.infragistics.com/igniteui/latest/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
    <link href="http://cdn-na.infragistics.com/igniteui/latest/css/structure/infragistics.css" rel="stylesheet" />

    <!-- JavaScript Library Dependencies -->
    <script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="http://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

    <!-- %%ProductName%% Required Combined JavaScript Files (Trial) -->
    <script src="http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.core.js"></script>
    <script src="http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.lob.js"></script>
    <script src="http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.dv.js"></script>
```

## <a id="typescript"></a>TypeScript の定義

%%ProductName%%® は、強い型付け、コンパイル時間のチェック、intellisense 機能を利用できるようにTypeScript の型定義を提供します。詳細については、 [TypeScript での %%ProductName%% の使用](Using-Ignite-UI-with-TypeScript.html)トピックを参照してください。

##<a id="angularjs"></a>AngularJS 拡張子

%%ProductName%% AngularJS 拡張子は、AngularJS アプリケーションで使用されるコントロールの両方向のデータ バインディングおよび宣言的初期化を提供します。詳細については、 [AngularJS での %%ProductName%% の使用](Using-Ignite-UI-with-AngularJS.html)トピックを参照してください。

## <a id="angular"></a>Angular 拡張子

%%ProductName%% Angular 拡張子は、Angular アプリケーションで使用されるコントロールの両方向のデータ バインディング、宣言的初期化、ネイティブ API を提供します。詳細については、GitHub で [%%ProductName%% Angular 拡張子 (英語)](https://github.com/IgniteUI/igniteui-angular-wrappers) を参照してください。

## <a id="reactjs"></a>ReactJS 拡張子

%%ProductName%% ReactJS 拡張子は、JSX マークアップおよび React API の初期化を提供しします。詳細については、GitHub で [%%ProductName%% React 拡張子 (英語)](https://github.com/IgniteUI/igniteui-react) を参照してください。

## <a id="aspnet_wrappers"></a>ASP.NET MVC ラッパー

%%ProductNameMVC% ラッパーは、モデルおよびビューチャートの初期化およびサーバー側リモート要求の処理をサポートします。詳細については、[「コントロールを MVC プロジェクトに追加」](Adding-IgniteUI-Controls-to-an-MVC-Project.html)トピックを参照してください。

## <a id="related_content"></a>関連コンテンツ

### トピック

- [%%ProductName%% CLI](Using-Ignite-UI-CLI.html)
- [配備ガイド](Deployment-Guide.html)
- [%%ProductName%% ページ デザイナー](http://designer.igniteui.com/index-release-jp.html)

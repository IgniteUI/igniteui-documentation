<!--
|metadata|
{
    "fileName": "using-ignite-ui-with-typescipt",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# TypeScript での Ignite UI の使用

## トピックの概要

このトピックでは、Ignite UI の型定義を TypeScript で使用する方法の概要を説明します。

### 前提条件

以下の表に、このトピックを理解するための前提条件として必要な情報を示しています。

**概念**

-   jQuery、jQuery UI
-   [TypeScript](http://www.typescriptlang.org/)

**トピック**

-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [構文](#syntax)
-     [Ignite UI を使用した TypeScript アプリケーションの作成](#creating-app)
-   [関連コンテンツ](#related-content)

## <a id="introduction"></a>概要

Ignite UI® は、強い型付け、コンパイル時間のチェック、intellisense 機能を利用できるようにTypeScript の型定義を提供します。

コントロールの定義は、Ignite UI インストール ディレクトリの下の *typings\igniteui.d.ts* ファイルにあります。TypeScript 用の定義は、jQuery と jQuery UI の定義を拡張しているため、元の定義に依存します。

## <a id="syntax"></a> 構文

TypeScript アプリケーションで Ignite UI コントロールを使用するための構文は、一般的な JavaScript アプリケーションの構文と同じです。したがって、コード スニペットのリファレンスは、[Ignite UI API ヘルプ](%%jQueryApiUrl%%)を参照できます。

## <a id="creating-app"></a>Ignite UI を使用した TypeScript アプリケーションの作成

###  <a id="requirements"></a>要件 

必要なリソースを考慮する場合は、[Ignite UI での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html) のドキュメントで説明するように、同じ要件とオプションが適用され、その後に Ignite UI Angular ディレクティブ モジュールをロードします。アプリケーションにはいくつかのスタイルと共に、以下も含める必要があります。

-   [jQuery](http://www.jquery.com/) 1.9 以降
-   [jQuery UI](http://jqueryui.com/) 1.10 以降
-   [TypeScript ](http://www.typescriptlang.org/) 1.4 以降
-   [Ignite UI](http://jp.igniteui.com/) 15.1 以降

### <a id="steps"></a>手順

1. Visual Studio で TypeScript を使用した新しい HTML アプリケーションを作成します。
2. Ignite UI のテーマと構造ファイルを含めます。

    **HTML の場合:**
    ```html
    <!-- Ignite UI Required Combined CSS Files -->
    <link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
    <link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/structure/infragistics.css" rel="stylesheet" />
    ```
    
3.  JavaScript ライブラリを追加します ([modernizr](http://modernizr.com/) はオプションです)。

    **HTML の場合:**
    ```html
    <!-- JavaScript Library Dependencies -->
    <script src="http://modernizr.com/downloads/modernizr-latest.js"></script>
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.min.js"></script>
    ```
4.  Ignite UI スクリプトを含めます。必要に応じて、カスタム ダウンロードを使用しますが、[いずれかの方法で Ignite UI を含める](Deployment-Guide-JavaScript-Resources.html)こともできます。

    **HTML の場合:**
    ```html
    <!-- Ignite UI Required Combined JavaScript Files -->
    <script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.core.js"></script>
    <script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.lob.js"></script>
	<!-- Required by the data vizualization controls -->
	<script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.dv.js"></script>
    ```

5. アプリケーション用の TypeScript ファイルの参照パスを追加します。

    **HTML の場合:**
    ```html
    <script src="./TypeScript/sampleApp.js"></script> 
    ```
    
6. TypeScript 用の Ignite UI と jQuery の型定義への参照パスを含めます。

    **TypeScript の場合:**
    ```typescript
    /// <reference path="jqueryui.d.ts" />
    /// <reference path="jquery.d.ts" />
    /// <reference path="igniteui.d.ts" />
    ```
    
>**注**: TypeScript の 1.5 以前のバージョンでは、コンパイラがコンパイル中にプログラムに依存関係を組み込むため、型定義への参照パスは必須です。1.5 以降のバージョンでは、単独の tsconfig.json ファイルで定義することができます。詳細は、[tsconfig.json wiki ](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json) のページを参照してください。

7. アプリケーションを実行する場所を、ビューで指示する必要があります。例：

    **HTML の場合:**
    ```typescript
    <body>
        <!--...-->
        <div id="sampleAppID"></div>
        <!--...-->
    </body>
	```
    
8. 最後に、igDialog など、必要なコントロールを追加します。

    **TypeScript の場合:**
    ```typescript
    $(function () {
      // Initialize the igDialog
      $("#sampleAppID").igDialog({
          state: "closed",
          modal: true,
          draggable: false,
          resizable: false,
          height: 500,
          width: 400
      });
    });
    ```

## <a id="related-content"></a>関連コンテンツ

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-   [igGrid TypeScript](%%SamplesUrl%%/grid/typescript)
-   [igHierarchicalGrid TypeScript](%%SamplesUrl%%/hierarchical-grid/typescript)
-   [igTreeGrid TypeScript](%%SamplesUrl%%/tree-grid/typescript)
-   [igPivotGrid TypeScript](%%SamplesUrl%%/pivot-grid/typescript)
-   [igDataChart TypeScript](%%SamplesUrl%%/data-chart/typescript)
-   [Editors TypeScript](%%SamplesUrl%%/editors/typescript)

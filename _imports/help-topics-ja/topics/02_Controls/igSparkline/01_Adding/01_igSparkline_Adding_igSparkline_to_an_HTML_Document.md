<!--
|metadata|
{
    "fileName": "igsparkline-adding-igsparkline-to-an-html-document",
    "controlName": "igSparkline",
    "tags": ["Charting","Data Binding","Data Presentation"]
}
|metadata|
-->

# igSparkline を HTML ドキュメントに追加



## トピックの概要
### 目的

このトピックは、[`igSparkline`](%%jQueryApiUrl%%/ui.igSparkline.html)™ を HTML ページに追加し JavaScript 配列へバインドする方法を示します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。


-   jQuery セレクター

**トピック**

- [igSparkline の概要](igSparkline-Overview.html): このトピックは、`igSparkline` コントロールの概要、その利点、およびサポートされるチャート タイプを提供します。

- [igSparkline の追加の概要](igSparkline-Adding-igSparkline-Overview.html): このトピックでは、`igSparkline`™ をアプリケーションに追加する各種方法の概要について説明します。

- [必要なリソースの手動で追加する](Adding-the-Required-Resources-for-IgniteUI-for-jQuery.html): このトピックでは、%%ProductName%%®での JavaScript リソースの構成について説明します。

- [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html): このトピックは、必要な JavaScript リソースを追加して %%ProductName%% ライブラリからコントロールを使用する場合の全般的なガイダンスを提供します。


**外部リソース**

-   [jQuery UI ウィジェット ファクトリ](http://jqueryui.com/widget/)

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [igSparkline を HTML ドキュメントに追加 - 概要](#overview)
    -   [igSparkline 追加の概要](#summary)
    -   [要件](#requirements)
    -   [手順](#steps)
-   [igSparkline の HTML ページへの追加](#adding-to-html-page)
    -   [概要](#html-page-introduction)
    -   [プレビュー](#html-page-preview)
    -   [前提条件](#html-page-prerequisites)
    -   [概要](#html-page-overview)
    -   [手順](#html-page-steps)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a>igSparkline を HTML ドキュメントに追加 - 概要
### <a id="summary"></a>igSparkline 追加の概要

`igSparkline` は、一連のデータ オブジェクトを描画する必要のあるデータ バインド コントロールです。コントロールは、HTML 要素、DIV をインスタンス化のベースとして機能させる必要があります。

データ ソースは、`dataSource` オプションで固有です。この例では、HTML でデータのインラインを定義します。配列は、AJAX 呼び出し、外部 JavaScript ファイル、またはその他の JavaScript 配列データの取得手段を介して取得できます。

`igSparkline` は、ドキュメントがリソースを取り込み終わると発生準備の整うドキュメント用関数で構成されます。

### <a id="requirements"></a>要件

以下の表で、`igSparkline` コントロールの要件を簡単に説明します。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
要件/必要なリソース
			</th>

            <th>
説明
			</th>

            <th>
必要な作業
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
IG テーマ
			</td>

            <td>
このテーマには、%%ProductName%% ライブラリ用のビジュアル スタイルが含まれます。テーマ ファイル:

                css/themes/Infragistics/infragistics.theme.css
			</td>

            <td>

			</td>
        </tr>

        <tr>
            <td>
`igSparkline` CSS リソース ファイル
			</td>

            <td>
                以下の CSS ファイルからのスタイルは、コントロールの各種要素のレンダリングに使用されます。

                <table class="table table-bordered">
	<thead>
		<tr>
                            <th>
CSS リソース
			</th>

                            <th>
説明
			</th>
                        </tr>
	</thead>
	<tbody>
                        

                        <tr>
                            <td>
`css/structure/modules/infragistics.ui.shared.css`
			</td>

                            <td>
すべての %%ProductName%% コントロールで共有される CSS スタイル
			</td>
                        </tr>

                        <tr>
                            <td>
`css/structure/modules/infragistics.ui.html5.css`
			</td>

                            <td>
HTML5 のブラウザー サポートに関連する CSS
			</td>
                        </tr>

                        <tr>
                            <td>
`css/structure/modules/infragistics.ui.sparkline.css`
			</td>

                            <td>
`igSparkline` ウィジェットに特有の CSS スタイル
			</td>
                        </tr>
                    </tbody>
</table>
                <br>
            </td>

            <td>
ページのファイルに `style` 参照を追加します。
			</td>
        </tr>

        <tr>
            <td>
Modernizr ライブラリ (オプション)
			</td>

            <td>
                Modernizr ライブラリは、ブラウザーとデバイス機能を検出するために igSparkline で使用されます。これは強制ではありませんが、含まれないとコントロールは HTML 互換ブラウザーで標準のデスクトップ環境であるかのように振る舞います。

                <ul>
                    <li>
[Modernizr](http://modernizr.com/)
					</li>
                </ul>
            </td>

            <td>
ページの `<head>` セクションでライブラリにスクリプト参照を追加します。
			</td>
        </tr>

        <tr>
            <td>
jQuery および jQuery UI JavaScript リソース
			</td>

            <td>
                %%ProductName%% は、以下のフレームワークの最上部にビルドされます。

                <ul>
                    <li>
[jQuery](http://jquery.com/)
					</li>

                    <li>
[jQuery UI](http://jqueryui.com/)
					</li>
                </ul>
            </td>

            <td>
ページの `<head>` セクションで両方のライブラリにスクリプト参照を追加します。
			</td>
        </tr>

        <tr>
            <td>
全般的な `igSparkline` JavaScript リソース
			</td>

            <td>
                %%ProductName%% ライブラリの igSparkline 機能は、複数のファイルに渡って配布されます。必要なリソースは以下の方法で読み込むことができます。

                <ul>
                    <li>
`infragistics.core.js` と `infragistics.dv.js` の結合したファイルを使用して必要な JavaScript 依存関係を素早く参照します。
					</li>

                    <li>
Infragistics® Loader (`igLoader`™) を使用します。必要なのは `igLoader` へのスクリプト参照をページに含めるか、 `igSparkline` をパラメータとして指定するのみです。igLoader は必要な個々の JavaScript ファイルと CSS ファイルを取り込みます。
					</li>

                    <li>
必要なリソースを手動で読み込みます。以下の表にリストされる依存関係を使用する必要があります。
					</li>
                </ul>

                以下の表は、igSparkline コントロール関連の %%ProductName%% ライブラリの依存関係をリストします。これらのリソースは、リソースを手動で取り込むことを選択する場合は明示的に参照される必要があります (`igLoader` は使用しない)。

                <table class="table table-bordered">
	<thead>
		<tr>
                            <th>
JS リソース
			</th>

                            <th>
説明
			</th>
                        </tr>
	</thead>
	<tbody>
                        

                        <tr>
                            <td>
`js/modules/infragistics.util.js`<br/>
`js/modules/infragistics.util.jquery.js`
			</td>

                            <td>
%%ProductName%% ユーティリティ
			</td>
                        </tr>
						
						<tr>
                            <td>
`js/modules/infragistics.ui.widget.js`
                            </td>
                            <td>
共有のウィジェット
                            </td>
                        </tr>

                        <tr>
                            <td>
`js/modules/Infragistics.datasource.js`
			</td>

                            <td>
データ ソース フレームワーク
			</td>
                        </tr>

                        <tr>
                            <td>
`js/modules/infragistics.templating.js`
			</td>

                            <td>
`igTemplating` engine
			</td>
                        </tr>
						
						<tr>
                            <td>
`js/modules/infragistics.ext_core.js`<br>
`js/modules/infragistics.ext_collections.js`<br>
`js/modules/infragistics.ext_ui.js`<br>
`js/modules/infragistics.dv_jquerydom.js`<br>
`js/modules/infragistics.dv_core.js`<br>
`js/modules/infragistics.dv_geometry.js`
			</td>

                            <td>
すべてのデータ ビジュアライゼーション コンポーネント用の共有ライブラリ
			</td>
                        </tr>
						
						<tr>
                            <td>
`js/modules/infragistics.dv_interactivity.js`
                            </td>
                            <td>
オプション。ツールチップなどのユーザー インタラクションのために必要です。
                            </td>
                        </tr>

                        <tr>
                            <td>
`js/modules/infragistics.ui.basechart.js`
			</td>

                            <td>
すべての %%ProductName%% チャート コンポーネントに対するベース ウィジェット
			</td>
                        </tr>

						<tr>
                            <td>
`js/modules/infragistics.sparkline.js`
			</td>

                            <td>
`igSparkline` ウィジェットの内部コア ロジック
			</td>
                        </tr>
						
                        <tr>
                            <td>
`js/modules/infragistics.ui.sparkline.js`
			</td>

                            <td>
`igSparkline` ウィジェット
			</td>
                        </tr>
                    </tbody>
</table>
                <br>
            </td>

            <td>
                以下のいずれかを追加します。

                <ul>
                    <li>
`igLoader` への参照
					</li>

                    <li>
すべての必要な JavaScript ファイルへの参照 (左側の表に一覧表示)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

### <a id="steps"></a>手順

`igSparkline` を HTML ドキュメントへ追加するための一般的な手順をおおまかに示すと、次のようになります。

1. 必要な JavaScript および CSS ファイルを参照します。

2. `igSparkline` 用のターゲット要素を作成します。

3. JavaScript 配列を定義します。

4. ドキュメント内の `igSparkline` をインスタンス化する

5. 基本的な描画オプションを構成します。



## <a id="adding-to-html-page"></a>igSparkline の HTML ページへの追加
### <a id="html-page-introduction"></a>概要

この手順では、基本的な `igSparkline` を HTML ページへ追加し基本的なオプションを構成してデータを供給し高さと幅を構成します。`igSparkline` は、一定期間出された注文ごとに総数を示します。

データ構造には、注文数を含む `ExtendedPrice` と、購入注文日を含む `OrderDate` フィールドが含まれます。`igSparkline` の `valueMemberPath` は `ExtendedPrice` に設定され、`labelMemberPath` は `OrderDate` に設定されます。

### <a id="html-page-preview"></a>プレビュー

以下のスクリーンショットは結果のプレビューです。

![](images/Adding_igSparkline_to_an_HTML_Document_1.png)

### <a id="html-page-prerequisites"></a>前提条件

空白の HTML ドキュメント

### <a id="html-page-overview"></a>概要

1. 必要な JavaScript および CSS ファイルを参照します。

2. `igSparkline` 用のターゲット要素を作成します。

3. JavaScript 配列を定義します。

4. ドキュメント内の `igSparkline` をインスタンス化する

5. 基本的な描画オプションを構成します。

### <a id="html-page-steps"></a>手順

これらの手順に従って、`igSparkline` を HTML ドキュメントに追加します。

1. 必要な JavaScript および CSS ファイルの参照

	HTML ドキュメントに JavaScript および CSS ファイルの依存関係を設定します。
	
	**HTML の場合:**
	
	
	```html
	<!DOCTYPE html>
	<html>
	<head>
	    <title></title>
	    <!-- %%ProductName%% Required Combined CSS Files -->
	    <link href="../../igniteui/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
	    <link href="../../igniteui/css/structure/infragistics.css" rel="stylesheet" />
	    <script src="../../js/modernizr.min.js"></script>
	    <script src="../../js/jquery.min.js"></script>
	    <script src="../../js/jquery-ui.min.js"></script>
	    <!-- %%ProductName%% Required Combined JavaScript Files -->
	    <script src="../../igniteui/js/infragistics.core.js"></script>
	    <script src="../../igniteui/js/infragistics.dv.js"></script>
	</head>
	<body>
	</body>
	</html>
	```

2. `igSparkline` 用のターゲット要素を作成します。

	`igSparkline` ウィジェットをインスタンス化する HTML 本文内に DIV 要素を作成します。
	
	**HTML の場合:**
	
	```html
	<body>
	    <!-- Target element for the igSparkline -->
	    <div id="sparkline"></div>
	…
	```

3. JavaScript 配列を定義する

	JavaScript 配列を定義します。
	
	**HTML の場合:**
	
	```html
	<body>
	<script>
	var invoices = [
	    {"OrderDate": "/Date(836452800000)/", "ExtendedPrice": 168.0000},
	    { "OrderDate": "/Date(836452800000)/", "ExtendedPrice": 98.0000},
	    { "OrderDate": "/Date(836452800000)/", "ExtendedPrice": 174.0000},
	    { "OrderDate": "/Date(836539200000)/", "ExtendedPrice": 167.4000},
	    { "OrderDate": "/Date(836539200000)/", "ExtendedPrice": 1696.0000},
	    { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 77.0000},
	    { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 1261.4000},
	    { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 214.2000},
	    { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 95.7600},
	    { "OrderDate": "/Date(836798400000)/","ExtendedPrice": 222.3000}
	];
	</script>
	</body>
	```

4. ドキュメント内の `igSparkline` をインスタンス化する

	以前に定義されたターゲット要素のセレクターを使用してウィジェットをインスタンス化します。
	
	**HTML の場合:**
	
	```html
	<script>
	        $(function () {
	            $("#sparkline").igSparkline({
	            });
	        });
	</script>
	```

5. 基本的な描画オプションを構成する

	`igSparkline` をインスタンス化する場合、dataSource、`valueMemberPath`、`labelMemberPath`、height および width の各オプションを構成します。
	
	**HTML の場合:**
	
	```html
	$("#sparkline").igSparkline({
	    dataSource: invoices,
	    height: "100px",
	    width: "300px",
	    valueMemberPath: 'ExtendedPrice',
	    labelMemberPath: 'OrderDate'
	});
	```

完全なコード

**HTML の場合:**

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <!-- %%ProductName%% Required Combined CSS Files -->
    <link href="../../igniteui/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
    <link href="../../igniteui/css/structure/infragistics.css" rel="stylesheet" />
    <script src="../../js/modernizr.min.js"></script>
    <script src="../../js/jquery.min.js"></script>
    <script src="../../js/jquery-ui.min.js"></script>
    <!-- %%ProductName%% Required Combined JavaScript Files -->
    <script src="../../igniteui/js/infragistics.core.js"></script>
    <script src="../../igniteui/js/infragistics.dv.js"></script>
</head>
<body>
    <!-- Target element for the igSparkline -->
    <div id="sparkline"></div>
    <script>
        var invoices = [
            {"OrderDate": "/Date(836452800000)/", "ExtendedPrice": 168.0000},
            { "OrderDate": "/Date(836452800000)/", "ExtendedPrice": 98.0000},
            { "OrderDate": "/Date(836452800000)/", "ExtendedPrice": 174.0000},
            { "OrderDate": "/Date(836539200000)/", "ExtendedPrice": 167.4000},
            { "OrderDate": "/Date(836539200000)/", "ExtendedPrice": 1696.0000},
            { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 77.0000},
            { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 1261.4000},
            { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 214.2000},
            { "OrderDate": "/Date(836798400000)/", "ExtendedPrice": 95.7600},
            { "OrderDate": "/Date(836798400000)/","ExtendedPrice": 222.3000}
        ];
    $(function () {
        $("#sparkline").igSparkline({
            dataSource: invoices,
            height: "100px",
            width: "300px",
            valueMemberPath: 'ExtendedPrice',
            labelMemberPath: 'OrderDate'
        });
    });
    </script>
</body>
</html>
```


## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igSparkline を ASP.NET MVC ビューに追加](igSparkline-Adding-igSparkline-to-an-ASPNET-MVC-View.html): このトピックでは、ASP.NET MVC ビューでの `igSparkline` インスタンス作成とオブジェクトの .NET コレクションへのバインドを見てみます。

- [jQuery と MVC API リンク (igSparkline)](igSparkline-jQuery-and-ASPNET-MVC-API.html): このトピックでは、`igSparkline` コントロールのための jQuery と ASP.NET MVC ヘルパー クラスのAPIドキュメントへのリンクを提供します。

### <a id="samples"></a>サンプル

以下のサンプルでは、このトピックに関連する情報を提供しています。

- [JSON データにバインド](%%SamplesUrl%%/sparkline/bind-json): このサンプルは外部のスクリプト ファイルに含まれる JSON データにバインドします。また、ASP.NET MVC ヘルパーとのバインドについても示します。





 

 



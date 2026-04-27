<!--
|metadata|
{
    "fileName": "adding-igpopover",
    "controlName": "igPopover",
    "tags": ["How Do I"]
}
|metadata|
-->

# igPopover の追加

## トピックの概要
### 目的

このトピックではコード例を使用して、JavaScript または ASP.NET MVC で HTML ページに `igPopover`™ コントロールを追加する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igPopover の概要](igPopover-Overview.html): このトピックでは、`igPopover` コントロールとその主な特長および機能の概要を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [igPopover の追加 - 概念的な概要](#overview)
    -   [igPopover の追加の概要](#summary)
    -   [要件](#overview-requirements)
    -   [手順](#overview-steps)
-   [JavaScript による igPopover の追加 - 手順](#procedure-js)
    -   [概要](#js-introduction)
    -   [プレビュー](#js-preview)
    -   [前提条件](#js-prerequisites)
    -   [概要](#js-overview)
    -   [手順](#js-steps)
-   [ASP.NET MVC による igPopover の追加 - 手順](#mvc-procedure)
    -   [概要](#mvc-introduction)
    -   [プレビュー](#mvc-preview)
    -   [前提条件](#mvc-prerequisites)
    -   [概要](#mvc-overview)
    -   [手順](#mvc-steps)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a>igPopover の追加 - 概念的な概要
### <a id="summary"></a>igPopover の追加の概要

`igPopover` コントロールは、任意の DOM 要素 (「ターゲット要素」と呼ばれる) で初期化できます。`igPopover` は、ネスト化された DIV 要素にコンテンツを描画します。コンテンツは、デフォルトでターゲット要素のタイトルですが、ハードコーディングされた 文字列、HTML コンテンツ、 または HTML 文字列を返す JavaScript 関数.のいずれかにすることもできます。

### <a id="overview-requirements"></a>要件

以下の表では、`igPopover` の追加の要件を簡単に説明します。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
要件 / 必要なリソース
			</th>

            <th width="417">
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
jQuery および jQuery UI JavaScript リソース
			</td>

            <td width="417">
                %%ProductName%%™ は、これらのフレームワークの最上位にビルドされます。

                <ul>
                    <li>
[**jQuery**](http://jquery.com/)
					</li>

                    <li>
[**jQuery UI**](https://jqueryui.com/)
					</li>
                </ul>
            </td>

            <td>
ページの &lt;head&gt; セクションで両方のライブラリにスクリプト参照を追加します。
			</td>
        </tr>

        <tr>
            <td height="300">
igPopover JavaScript リソース
			</td>

            <td height="300" width="417">
                %%ProductName%% ライブラリの igPopover の機能性は、複数のファイル間に配布されます。必要なリソースは以下の方法で読み込むことができます。

                <ul>
                    <li>
(推奨) [Infragistics® Loader](Using-Infragistics-Loader.html) (igLoader™)を使用します。ページ上に igLoader へのスクリプト参照を含めるのみです。
					</li>

                    <li>
必要なリソースを手動で読み込みます。以下の表にリストされる依存関係を使用する必要があります。
					</li>
                </ul>

                以下の表は、igPopover コントロール関連の %%ProductName%% ライブラリの依存関係を示します。これらのリソースは、リソースを手動で取り込むことを選択する場合は明示的に参照される必要があります (igLoader は使用しない)。

                <table class="table">
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
infragistics.ui.popover.js
			</td>

                            <td>
igPopover コントロール
			</td>
                        </tr>
                    </tbody>
</table>
                <br>
            </td>

            <td height="300">
                以下のいずれかを追加します。

                <ul>
                    <li>
igLoader への参照
					</li>

                    <li>
すべての必要な JavaScript ファイルへの参照 (左側の表に一覧表示)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
IG テーマ

                (オプション)
			</td>

            <td width="417">
このテーマには、%%ProductName%% ライブラリ用のビジュアル スタイルが含まれます。テーマ ファイル:

                {IG CSS root}/themes/Infragistics/infragistics.theme.css
			</td>

            <td>

			</td>
        </tr>

        <tr>
            <td>
igPopover の構造
			</td>

            <td width="417">
以下の CSS ファイルからのスタイルは、コントロールの各種要素のレンダリングに使用されます。

                {IG  CSS  root}/structure/modules/infragistics.ui.popover.css
			</td>

            <td>
ページのファイルにスタイル参照を追加します。
			</td>
        </tr>
    </tbody>
</table>



>**注:** JavaScript と CSS リソースを読み込むためには igLoader コンポーネントを使うことを推奨します。この方法の詳細は、[**Infragistics Loader による必要なリソースの自動追加**](Using-Infragistics-Loader.html)のトピックを参照してください。さらに、オンラインの [**%%ProductName%% サンプル ブラウザー**](%%SamplesUrl%%)には、`igPopover` コンポーネントで `igLoader` を使用する方法の具体的な例が記載されています。

### <a id="overview-steps"></a>手順

以下は、`igPopover` を HTML ページに追加する一般的な手順です。

1. ターゲット HTML 要素の追加

2. `igPopover` の追加

## <a id="procedure-js"></a>JavaScript による igPopover の追加 - 手順
### <a id="js-introduction"></a>概要

この手順は、実際の HTML/JavaScript の実装を使用して、基本機能を持つ `igPopover` を HTML ページに追加するステップを説明します。`igPopover` コントロールで必要なすべての %%ProductName%% リソースを読み込むには、Infragistics Loader コンポーネントを使用します。

この手順は、デフォルト構成の基本的な `igPopover` コントロールを input HTML 要素に追加します。ポップオーバーは入力のタイトルを含み、マウスを要素の上にホバーすると表示されます。

### <a id="js-preview"></a>プレビュー

次のスクリーンショットは最終結果のプレビューです。操作の結果として、UI に表示されたポップオーバー。

![](images/Adding_igPopover_1.png)

### <a id="js-prerequisites"></a>前提条件

必要なリソースが追加され、適切に参照されていること。(リソースの概要については、[要件](#overview-requirements)を参照してください。)以下が含まれます。

-   適切な場所に追加された必要なファイル:

   -   Web ページと同じディレクトリにある Scripts という名前のフォルダーに追加された必要な jQuery および jQueryUI JavaScript リソース
    -   ig という名前のフォルダーに追加された %%ProductName%% CSS ファイル (詳細は、[**%%ProductName%% のスタイル設定とテーマ設定**](Deployment-Guide-Styling-and-Theming.html)のトピックを参照してください。)

    -   Web サイトまたはアプリケーションにある Scripts/ig という名前のフォルダーに追加された %%ProductName%% JavaScript ファイル (詳細は、[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)のトピックを参照してください。)
-   ページの `<head>` セクションで参照される、必要な JavaScript リソース。

**HTML の場合:**

```html
<script  type="text/javascript" src="Scripts/jquery.js"></script>
<script  type="text/javascript" src="Scripts/jquery-ui.js"></script>
```

-   ページで参照される `igLoader` コンポーネント。

**HTML の場合:**

```html
<script  type="text/javascript" src="Scripts/ig/infragistics.loader.js"></script>
```

-   インスタンスが作成された `igLoader` コンポーネント:

**HTML の場合:**

```html
<script type="text/javascript">
    $.ig.loader({
        scriptPath: "Scripts/ig/",
        cssPath: "Content/ig/",
        resources: “igPopover"
    });
<script>
```

### <a id="js-overview"></a>概要

以下はプロセスの概念的概要です。

1. ターゲット HTML 要素の追加

2. `igPopover` の追加

### <a id="js-steps"></a>手順

以下の手順は、HTML ページで基本的な `igPopover` コントロールを追加する方法を説明します。

1. ターゲット HTML 要素の追加

	igPopover のターゲットになる HTML 要素を追加します。
	
	この手順の例では、input HTML 要素を追加します。
	
	**HTML の場合:**
	
	```html
	<input id=”firstName” type=”text” title=”Please enter your first name” value=””>
	```

2. `igPopover` コントロールを追加します。

	`igPopover` をインスタンス化します。
	
	HTML ページのスクリプト要素に初期化コードを追加します。初期化コードが、手順 1 で作成されたターゲット要素を対象とする `igPopover` インスタンスを作成します。
	
	以下のコードは、オプションを指定せずに `igPopover` コントロールのインスタンスを作成します手順 1 で作成された入力要素「firstName」を対象にします。
	
	**JavaScript の場合:**
	
	```js
	$.ig.loader(function () {
	    //  Create a basic igPopover control
	    $("#firstName").igPopover();
	});
	```

## <a id="mvc-procedure"></a>ASP.NET MVC による igPopover の追加 - 手順
### <a id="mvc-introduction"></a>概要

この手順は、基本的な機能の `igPopover` を ASP.NET MVC View に追加するステップを説明します。ここでは、必要なローダー構成と共に ASP.NET MVC 構文を使用します。

この手順は、デフォルト構成の基本的な `igPopover` コントロールを input HTML 要素に追加します。
ポップオーバーは入力のタイトルを含み、マウスを要素の上にホバーすると表示されます。

### <a id="mvc-preview"></a>プレビュー

次のスクリーンショットは最終結果のプレビューです。操作の結果として、UI に表示されたポップオーバー。

![](images/Adding_igPopover_1.png)

### <a id="mvc-prerequisites"></a>前提条件

この手順を実行するには、以下のリソースが必要です。

**必要なリソースが追加され、適切に参照されていること。(これらのリソースの概念については、「要件」を参照してください。)以下が含まれます。**

-   適切な場所に追加された必要なファイル:

   -   Web ページと同じディレクトリにある Scripts という名前のフォルダーに追加された必要な jQuery および jQueryUI JavaScript リソース
    -   Content/ig という名前のフォルダーに追加された %%ProductName%% CSS ファイル (詳細は、%%ProductName%% のスタイル設定とテーマ設定のトピックを参照してください。)

    -   Web サイトまたはアプリケーションにある Scripts/ig という名前のフォルダーに追加された %%ProductName%% JavaScript ファイル (詳細は、[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)のトピックを参照してください。)
-   ページの `<head>` セクションで参照される、必要な JavaScript リソース。

**HTML の場合:**

```html
<script  type="text/javascript" src="Scripts/jquery.js"></script>
<script  type="text/javascript" src="Scripts/jquery-ui.js"></script>
```

-   ページで参照される `igLoader` コンポーネント。

**HTML の場合:**

```html
<script  type="text/javascript" src="Scripts/ig/infragistics.loader.js"></script>
```

-   ASP.NET ビューでインスタンスを作成した `igLoader` コンポーネント:

**HTML の場合:**

```html
@(Html.Infragistics()
     .Loader()          .ScriptPath("http://localhost/ig_ui/js/")
     .CssPath("http://localhost/ig_ui/css/")
     .Render()
)
```

### <a id="mvc-overview"></a>概要

以下はプロセスの概念的概要です。

1. ターゲット HTML 要素の追加

2. `igPopover` の追加

### <a id="mvc-steps"></a>手順

以下の手順は、基本的な `igPopover` コントロールを ASP.NET MVC に追加する方法を示します。

1. ターゲット HTML 要素の追加

	igPopover のターゲットになる HTML 要素を追加します。
	
	この手順の例では、HTML input 要素を追加します。
	
	**HTML の場合:**
	
	```html
	<input id=”firstName” type=”text” title=”Please enter your first name” value=””>
	```

2. `igPopover` コントロールを追加します。

	`Popover` の %%ProductNameMVC%% 構成を ASP.NET MVC View に追加します。
	
	以下のコードは、オプションを指定せずに `igPopover` コントロールのインスタンスを作成します手順 1 で作成された入力要素「firstName」を対象にします。
	
	**ASPX の場合:**
	
	```csharp
	@(Html.Infragistics().Popover()
	        .ID(“firstName”)        
	        .Render()
	   )
	```


## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [イベントの処理 (igPopover)](igPopover-Handling-Events.html): このトピックでは、`igPopover` コントロールのイベントを説明し、イベント ハンドラーをアタッチするコード例を示します。

- [igPopover の構成](Configuring-igPopover.html): このトピックでは、`igPopover` コントロールのコンテンツの構成、アクティブ化、および配置する方法を説明します。

- [igPopover のスタイル設定](Styling-igPopover.html): このトピックでは、コード例を使用して、CSS を使用した `igPopover` コントロールのルック アンド フィールを構成する方法を説明します。コンテンツの背景色、ポインターの表示と色、ヘッダーの色、および閉じるボタンの外観の設定が含まれます。

- [アクセシビリティ準拠 (igPopover)](igPopover-Accessibility-Compliance.html): このトピックでは、igPopover コントロールのアクセシビリティ機能について説明し、コントロールを含むページに対するアクセシビリティの準拠を実現する方法を紹介します。

- [既知の問題と制限事項 (igPopover)](igPopover-Known-Issues-And-Limitations.html): このトピックでは、`igPopover` コントロールの既知の問題と制限事項および回避策についての情報を提供します。

- [jQuery と MVC API リンク (igPopover)](igPopover-ASP-NET-MVC-Helper-API.html): このトピックでは、`igPopover` コントロールの jQuery および ASP.NET MVC ヘルパー クラスの API 参照ドキュメントへのリンクを提供します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/popover/basic-popover): このサンプルは、JavaScript による `igPopover` の基本的な初期化シナリオ (単一のターゲット要素および複数のターゲット要素) を紹介します。

- [ASP.NET MVC の基本的な使用方法](%%SamplesUrl%%/popover/aspnet-mvc-helper): このサンプルは、ASP.NET MVC シナリオでの `igPopover` コントロールを紹介します。コントロールは、チェーン構文を使用して View で初期化されます。





 

 



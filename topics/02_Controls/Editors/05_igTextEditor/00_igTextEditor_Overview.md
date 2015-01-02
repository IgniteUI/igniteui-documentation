<!--
|metadata|
{
    "fileName": "igtexteditor-overview",
    "controlName": "igEditors",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igTextEditor の概要

## igTextEditor の概要
Ignite UI™ のテキスト エディターまたは `igTextEditor` は、単一行または複数行の入力用に書式設定可能な入力フィールドを描画するコントロールです。

`igTextEditor` コントロールは、任意のサーバー技術を使用する作業を構成できる豊富なクライアント側 API を公開します。Ignite UI™ のコントロールはサーバー非依存ですが、コントロールは Microsoft® ASP.NET MVC Framework 専用のラッパーを備えており、希望の .NET™ 言語を使用してコントロールを構成できます。

`igTextEditor` コントロールは、大幅にスタイル変更できるので、デフォルトのスタイルとまったく異なるルック アンド フィールのコントロールを実現できます。スタイル設定オプションでは、独自のスタイルも jQuery UI の ThemeRoller のスタイルも使用できます。

図 1: ユーザー向けに描画した `igTextEditor` コントロール

![](images/igTextEditor_Overview.png)

[基本的な使用方法サンプル](%%SamplesUrl%%/editors/basic-usage)

## 機能
`igTextEditor` には以下の特徴があります。

-   全体のテーマのサポート
-   検証
-   JavaScript クライアント API
-   ASP.NET MVC ラッパー
-   特定文字列を含む条件または含まない条件によるエントリのフィルタリング
-   定義済みのリストによるエントリのフィルタリング

## igTextEditor の Web ページへの追加
1.  最初に、アプリケーションに必要なローカライズ済みのリソースを含めます。組み込むリソースの詳細は、「[Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」ヘルプ トピックをご覧ください。
2.  ご自分の HTML ページまたは ASP.NET MVC View で、必要な JavaScript ファイル、CSS ファイル、および ASP.NET MVC アセンブリを参照してください。

    **HTML の場合:**

    ```
    <link type="text/css" href="/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
    <link type="text/css" href="/css/structure/infragistics.css" rel="stylesheet" />
    <script type="text/javascript" src="/Scripts/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="/Scripts/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/Scripts/Samples/infragistics.core.js"></script>
	<script type="text/javascript" src="/Scripts/Samples/infragistics.lob.js"></script>
    ```

    **ASPX の場合:**

    ```
    <%@ Import Namespace="Infragistics.Web.Mvc" %>

    <link type="text/css" href="<%= Url.Content("~/css/themes/infragistics/infragistics.theme.css") %>"rel="stylesheet" />
    <link type="text/css" href="<%= Url.Content("~/css/structure/infragistics.css") %>"rel="stylesheet" />

    <script type="text/javascript" src="<%= Url.Content("~/Scripts/jquery-1.4.4.min.js")%>"></script>
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/jquery-ui.min.js")%>"></script>
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/Samples/infragistics.core.js")%>"></script>
	<script type="text/javascript" src="<%= Url.Content("~/Scripts/Samples/infragistics.lob.js")%>"></script>
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/Samples/modules/i18n/regional/infragistics.ui.regional-en.js")%>"></script>
    ```

    **Razor の場合:**

    ```
    @using Infragistics.Web.Mvc;

    <link type="text/css" href="@Url.Content("~/css/themes/infragistics/infragistics.theme.css")" rel="stylesheet" />
    <link type="text/css" href="@Url.Content("~/css/structure/infragistics.css")" rel="stylesheet" />

    <script type="text/javascript" src="@Url.Content("~/Scripts/jquery-1.4.4.min.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/jquery-ui.min.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Samples/infragistics.core.js")"></script>
	<script type="text/javascript" src="@Url.Content("~/Scripts/Samples/infragistics.lob.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Samples/modules/i18n/regional/infragistics.ui.regional-en.js")"></script>
    ```

3.	jQuery の実装では、HTML 内のターゲット要素として INPUT、TD、DIV、または SPAN を作成します。ASP.NET MVC の実装の場合、含める要素を MVC ラッパーが作成してくれるので、この手順はオプションです。
   	
	**In HTML:**
	```
	    <input id="textEditor" type="text" />
	```

4.	上のセットアップが完了したら、数値エディターを初期化し、`width`、`nullText` などの必要なオプションを設定します。

	> **注:** ASP.NET MVC View では、その他のオプションをすべて設定した後でレンダリング メソッドを呼び出す必要があります。
	
	**In Javascript:**
	```
	    <script type="text/javascript">
	       $('#textEditor').igTextEditor({
	           width: 160,
	           nullText: 'Enter Text'
	       });
	    </script>	
	```
	**In ASPX:**
	```
	     <%= Html.Infragistics().TextEditor()
	       .ID("textEditor")
	       .Width(200)
	       .NullText("Enter Text")
	       .Render()%>
	```	
	**In Razor:**
	```
	    @(Html.Infragistics().TextEditor()
	       .ID("textEditor")
	       .Width(200)
	       .NullText("Enter Text")
	       .Render())
	```

5. Web ページを実行し、`igTextEditor` コントロールの基本セットアップを表示します。

## 関連リンク
-   [基本的な使用方法サンプル](%%SamplesUrl%%/editors/basic-usage)
-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)
-   [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 



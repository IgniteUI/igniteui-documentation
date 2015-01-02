<!--
|metadata|
{
    "fileName": "igpercenteditor-overview",
    "controlName": "igEditors",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igPercentEditor の概要

##igPercentEditor の概要


Ignite UI™ のパーセント エディター、すなわち `igPercentEditor` は、パーセント形式に書式設定された数値のみを受け付ける入力フィールドを描画するコントロールです。`igPercentEditor` コントロールは、ブラウザーから公開される異なる地域のオプションを認識することにより、ローカライズをサポートします。

`igPercentEditor` コントロールは、任意のサーバー技術を使用する作業を構成できる豊富なクライアント側 API を公開します。Ignite UI™ のコントロールはサーバー非依存ですが、コントロールは Microsoft® ASP.NET MVC Framework 専用のラッパーを備えており、希望の .NET™ 言語を使用してコントロールを構成できます。

`igPercentEditor` コントロールは大幅にスタイル変更できるため、デフォルトのスタイルとまったく異なるルック アンド フィールのコントロールを実現できます。スタイル設定オプションでは、独自のスタイルも jQuery UI の `ThemeRoller` のスタイルも使用できます。

図 1: ユーザー向けに描画した `igPercentEditor`

![](images/igPercentEditor_Overview_Pic1.png)

[基本的な使用方法サンプル](%%SamplesUrl%%/editors/basic-usage)

##機能

`igPercentEditor` には以下の特徴があります。

-   全体のテーマのサポート
-   JavaScript クライアント API
-   ASP.NET MVC ラッパー

##制限


-   編集モードでは、「%」とグループ セパレーター記号はサポートされていません。

##igPercentEditor の Web ページへの追加


1.  最初に、アプリケーションに必要なローカライズ済みのリソースを含めます。組み込むリソースの詳細は、「[Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」ヘルプ トピックをご覧ください。
2.  ご自分の HTML ページまたは ASP.NET MVC View で、必要な JavaScript ファイル、CSS ファイル、および ASP.NET MVC アセンブリを参照してください。

    **HTML の場合:**

    ```
    <link type="text/css" href="/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
    <link type="text/css" href="/css/structure/infragistics.css" rel="stylesheet" />
    <script type="text/javascript" src="/Scripts/jquery.min.js"></script>
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

3.  jQuery の実装では、HTML 内のターゲット要素として INPUT、TD、DIV、または SPAN を作成します。ASP.NET MVC の実装の場合、含める要素を MVC ラッパーが作成してくれるので、この手順はオプションです。

    **HTML の場合:**

    ```
    <input id="percentEditor" type="text" value="25.75"/>
    ```

4. 上のセットアップが完了したら、数値エディターを初期化し、`width`、`nullText`、`dataMode` などの必要なオプションを設定します。

    >**注:** ASP.NET MVC View では、その他のオプションをすべて設定した後で `Render` メソッドを呼び出す必要があります。

    **JavaScript の場合:**

    ```
    <script type="text/javascript">
      $('#percentEditor').igPercentEditor({
          width: 160
      });
    </script>
    ```

    **ASPX の場合:**

    ```
    <%= Html.Infragistics().PercentEditor()
    .ID("percentEditor")
    .Value(0.0)
    .Width(120)    
    .Render()%>
    ```

    **Razor の場合:**

	```
	@(Html.Infragistics().PercentEditor()
		.ID("percentEditor")
		.Value(0.0)
		.Width(120)    
		.Render())
	```

5.  Web ページを実行し、`igPercentEditor` コントロールの基本セットアップを表示します。

##関連リンク

-   [基本的な使用方法サンプル](%%SamplesUrl%%/editors/basic-usage)
-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)
-   [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 



<!--
|metadata|
{
    "fileName": "igmaskeditor--overview",
    "controlName": "igEditors",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igMaskEditor の概要

##igMaskEditor の概要

Ignite UI™ のマスク エディターまたは `igMaskEditor` は、指定の入力マスクによって決定される入力制限を強制する入力フィールドを描画するコントロールです。`igMaskEditor` コントロールは、ブラウザーから公開される異なる地域のオプションを認識することにより、ローカライズをサポートします。`igMaskEditor` コントロールは、任意のサーバー技術を使用する作業を構成できる豊富なクライアント側 API を公開します。Ignite UI™ のコントロールはサーバー非依存ですが、コントロールは Microsoft® ASP.NET MVC Framework 専用のラッパーを備えており、希望の .NET 言語を使用してコントロールを構成できます。`igMaskEditor` コントロールは、大幅にスタイル変更できるため、デフォルトのスタイルとまったく異なるルック アンド フィールのコントロールを実現できます。スタイル設定オプションでは、独自のスタイルも jQuery UI の ThemeRoller のスタイルも使用できます。

図 1: `igMaskEditor` コントロールの電話番号マスクの適用 

![](images/igMaskEditor_Overview_Pic1.png) 

[検証サンプル](%%SamplesUrl%%/editors/validation)

##機能

igMaskEditor には以下の特徴があります。
-   全体のテーマのサポート
-   検証
-   カスタム パスの定義
-   異なるデータ モード
-   ローカライズ
-   JavaScript クライアント API
-   ASP.NET MVC ラッパー

##制限

-   正規表現はサポートしません。使用可能な文字エントリを使用した厳密なマスクのみをサポートします
   
##igMaskEditor の Web ページへの追加

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
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/jquery.min.js")%>"></script>
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

	**HTML の場合:**
    ```
    <input id="maskEditor" type="text" />
    ```
	
4. 上のセットアップが完了したら、マスク エディターを初期化し、`width`、`nullText`、`mask` などの必要なオプションを設定します。

    >**注:** ASP.NET MVC View では、その他のオプションをすべて設定した後で `Render` メソッドを呼び出す必要があります。

    **JavaScript の場合:**

    ```
    <script type="text/javascript">
           $('#maskEditor').igMaskEditor({
               width: 160,
               inputMask: 'CCCCC',
               nullText: 'Enter Value'
           });
    </script>
    ```

    **ASPX の場合:**

     ```
     <%= Html.Infragistics().MaskEditor()
         .ID("maskEditor")
         .InputMask("CCCCC")
         .NullText("Enter Value")
         .Render()%>
     ```

    **Razor の場合:**

    ```
    @(Html.Infragistics().MaskEditor()
                 .ID("maskEditor")
                 .InputMask("CCCCC")
                 .NullText("Enter Value")
                 .Render())
    ```

5.	Web ページを実行し、`igMaskEditor` コントロールの基本セットアップを表示します。

##関連リンク

-   [検証サンプル](%%SamplesUrl%%/editors/validation)
-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)
-   [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)
 
 


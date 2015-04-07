<!--
|metadata|
{
    "fileName": "igcurrencyeditor-igcurrencyeditor-overview",
    "controlName": "igEditors",
    "tags": ["Getting Started"]
}
|metadata|
-->

# igCurrencyEditor の概要


Ignite UI™ の通貨エディター、つまり `igCurrencyEditor` は、さまざまな通貨タイプに書式設定された数値のみを受け付ける入力フィールドを描画するコントロールです。`igCurrencyEditor` コントロールは、ブラウザーが公開するさまざまな地域のオプションを認識することにより、ローカライズをサポートします。

ユーザーがコントロールを操作すると、外観が更新されて、ただちにフィードバックが返されます。エディターがフォーカスを失うと、値に依存した正または負のパターンがコントロールに適用され、適切な通貨記号が追加されます。

`igCurrencyEditor` コントロールは、任意のサーバー技術を使用する作業を構成できる豊富なクライアント側 API を公開します。Ignite UI™ のコントロールはサーバー非依存ですが、コントロールは Microsoft® ASP.NET MVC Framework 専用のラッパーを備えており、希望の .NET 言語を使用してコントロールを構成できます。

`igCurrencyEditor` コントロールは、広範囲なスタイル設定が可能なため、デフォルトのスタイルとまったく異なるルック アンド フィールのコントロールを実現できます。スタイル設定オプションでは、独自のスタイルも jQuery UI の ThemeRoller のスタイルも使用できます。

図 1: 米国通貨向けに書式設定された `igCurrencyEditor`

![](images/igCurrencyEditor_Overview_Pic1.png)

[igCurrencyEditor オプション サンプル](%%SamplesUrl%%/editors/currency-editor)

## 機能

`igCurrencyEditor` には以下の特徴があります。

-   全体のテーマのサポート
-   検証
-   ローカライズ
-   JavaScript クライアント API
-   ASP.NET MVC ラッパー
-   最小値と最大値

## igCurrencyEditor の Web ページへの追加

1.  最初に、アプリケーションに必要なローカライズ済みのリソースを含めます。組み込むリソースの詳細は、「[Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」ヘルプ トピックをご覧ください。
2.  ご自分の HTML ページまたは ASP.NET MVC View で、必要な JavaScript ファイル、CSS ファイル、および ASP.NET MVC アセンブリを参照してください。

    **HTML の場合:**

    ```html
    <link type="text/css" href="/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
    <link type="text/css" href="/css/structure/infragistics.css" rel="stylesheet" />
    <script type="text/javascript" src="/Scripts/jquery.min.js"></script>
    <script type="text/javascript" src="/Scripts/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/Scripts/Samples/infragistics.core.js"></script>
	<script type="text/javascript" src="/Scripts/Samples/infragistics.lob.js"></script>
    ```

	**ASPX の場合:**

    ```csharp
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

    ```csharp
    @using Infragistics.Web.Mvc;

    <link type="text/css" href="@Url.Content("~/css/themes/infragistics/infragistics.theme.css")" rel="stylesheet" />
    <link type="text/css" href="@Url.Content("~/css/structure/infragistics.css")" rel="stylesheet" />

    <script type="text/javascript" src="@Url.Content("~/Scripts/jquery.min.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/jquery-ui.min.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Samples/infragistics.core.js")"></script>
	<script type="text/javascript" src="@Url.Content("~/Scripts/Samples/infragistics.lob.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Samples/modules/i18n/regional/infragistics.ui.regional-en.js")"></script>
    ```

3.  jQuery の実装では、HTML 内のターゲット要素として INPUT、TD、DIV、または SPAN を作成します。ASP.NET MVC の実装の場合、含める要素を MVC ラッパーが作成してくれるので、この手順はオプションです。    

    **HTML の場合:**

    ```html
    <input id="currencyEditor" type="text" value="12345678.56723456" />
    ```

4.  上のセットアップが完了したら、数値エディターを初期化し、`width`、`nullText`、`dataMode` などの必要なオプションを設定します。

    > **注:** ASP.NET MVC View では、その他のオプションをすべて設定した後で `Render` メソッドを呼び出す必要があります。

    **JavaScript の場合:**

    ```js
    <script type="text/javascript">
         $('#currencyEditor').igCurrencyEditor({
             width: 200
         });
    </script>
    ```
 
	**ASPX の場合:**

     ```csharp
     <%= Html.Infragistics().CurrencyEditor()
       .ID("currencyEditor")
       .Width(200)
       .Value(12345678.56723456)
       .Render()%>
     ```

	**Razor の場合:**

    ```csharp
    @(Html.Infragistics().CurrencyEditor()
       .ID("currencyEditor")
       .Width(200)
       .Value(12345678.56723456)
       .Render())
    ```

5.  Web ページを実行し、`igCurrencyEditor` コントロールの基本セットアップを表示します。

## 関連リンク

-   [通貨エディター サンプル](%%SamplesUrl%%/editors/currency-editor)
-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)
-   [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 



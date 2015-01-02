<!--
|metadata|
{
    "fileName": "igdatepicker-overview",
    "controlName": "igDatePicker",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igDatePicker の概要


igDatePicker によって、ドロップダウン カレンダー付きの入力フィールドを使用でき、また、開発者は日付の表示形式を指定できます。igDatePicker コントロールは、ブラウザーから公開されるさまざまな地域のオプションを認識することにより、ローカライズをサポートします。

> **ローカライズの注意:** `igDatePicker` コントロールは `jQuery.datepicker` に依存関係があります。ページでそのローカライズ ファイルを参照する必要があります。

`igDatePicker` コントロールは、任意のサーバー技術を使用して作業を構成できる豊富なクライアント側 API を公開します。Ignite UI™ のコントロールはサーバー非依存ですが、エディター コントロールは Microsoft® ASP.NET MVC Framework 専用のラッパーを備えており、希望の .NET™ 言語を使用してコントロールを構成できます。

`igDatePicker` コントロールは、広範囲に及ぶスタイル設定が可能なため、デフォルトのスタイルとまったく異なるルック アンド フィールのコントロールを実現できます。スタイル設定オプションでは、独自のスタイルも jQuery UI の ThemeRoller のスタイルも使用できます。

> **注:** `igDatePicker` コントロールは独自のドロップダウンを実装していないため、`jQuery.datepicker` のドロップダウン カレンダーを再利用します。

図 1: `igDatePicker` コントロールによる日付選択

![](images/igDatePicker_Overview_Pic1.png)

[igDatePicker のサンプル](%%SamplesUrl%%/date-picker/basic-usage)

## 機能

`igDatePicker` には以下の特徴があります。

-   全体のテーマのサポート
-   検証
-   カスタム表示形式の定義
-   最小値と最大値の設定
-   ローカライズ
-   JavaScript クライアント API
-   ASP.NET MVC ラッパー
-   jquery.ui.datepicker でサポートされるすべての機能


## igDatePicker の Web ページへの追加

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

    <link type="text/css" href="<%= Url.Content("~/css/themes/infragistics/infragistics.theme.css") %>" rel="stylesheet" />
    <link type="text/css" href="<%= Url.Content("~/css/structure/infragistics.css") %>" rel="stylesheet" />

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

    <script type="text/javascript" src="@Url.Content("~/Scripts/jquery.min.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/jquery-ui.min.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Samples/infragistics.core.js")"></script>
	<script type="text/javascript" src="@Url.Content("~/Scripts/Samples/infragistics.lob.js")"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Samples/modules/i18n/regional/infragistics.ui.regional-en.js")"></script>
    ```

3.  jQuery の実装では、HTML 内のターゲット要素として INPUT、TD、DIV、または SPAN を作成します。ASP.NET MVC の実装の場合、含める要素を MVC ラッパーが作成してくれるので、この手順はオプションです。

    **HTML の場合:**

    ```
    <input id="datePicker" type="text" />
    ```

4.  上のセットアップが完了したら、日付エディターを初期化し、`width`、`nullText`、`mask` などの必要なオプションを設定します。

    > **注:** ASP.NET MVC View では、その他のオプションをすべて設定した後で Render メソッドを呼び出す必要があります。

    **JavaScript の場合:**

    ```
    <script type="text/javascript">
          $("#datePicker").igDatePicker({
             button: "dropdown",         
			 nullText: "Enter date"
          });
     </script>
    ```

    **ASPX の場合:**

     ```
     <%= Html.Infragistics().DatePicker()
         .ID("datePicker")
         .ButtonType(TextEditorButtonType.DropDown)
         .NullText("Enter date")
         .Render()%%>
     ```

    **Razor の場合:**

    ```
    @(Html.Infragistics().DatePicker()
         .ID("datePicker")
         .ButtonType(TextEditorButtonType.DropDown)
         .NullText("Enter date")
         .Render())
    ```

5.  Web ページを実行し、`igDatePicker` コントロールの基本セットアップを表示します。

## 関連リンク

-   [igDatePicker のサンプル](%%SamplesUrl%%/date-picker/basic-usage) 
-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)  
-   [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 



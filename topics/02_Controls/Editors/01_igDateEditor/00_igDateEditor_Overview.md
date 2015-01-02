<!--
|metadata|
{
    "fileName": "igdateeditor-overview",
    "controlName": "igEditors",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igDateEditor の概要


Ignite UI™ 日付エディター、つまり `igDateEditor` は日付に書式設定されたデータを編集できる入力フィールドを描画するコントロールです。`igDateEditor` コントロールは、ブラウザーから公開される異なる地域のオプションを認識することにより、ローカライズをサポートします。

`igDateEditor` コントロールは、任意のサーバー技術を使用する作業を構成できる豊富なクライアント側 API を公開します。Ignite UI™ のコントロールはサーバー非依存ですが、コントロールは Microsoft® ASP.NET MVC Framework 専用のラッパーを備えており、希望の .NET 言語を使用してコントロールを構成できます。

`igDateEditor` コントロールは、大幅にスタイル変更できるため、デフォルトのスタイルとまったく異なるルック アンド フィールのコントロールを実現できます。スタイル設定オプションでは、独自のスタイルも jQuery UI の ThemeRoller のスタイルも使用できます。

図 1: ユーザーに描画された `igDateEditor`

![](images/igDateEditor_Overview_Pic1.png)

[日付と時刻書式設定](%%SamplesUrl%%/editors/date-and-time-formats)

## 機能

`igDateEditor` には次のような特徴があります。

-   全体のテーマのサポート
-   検証
-   カスタム入力フォーマットの定義
-   カスタム表示形式の定義
-   最小値と最大値の設定
-   ローカライズ
-   JavaScript クライアント API
-   ASP.NET MVC ラッパー

## igDateEditor の Web ページへの追加

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

3.  jQuery の実装では、HTML 内のターゲット要素として INPUT、TD、DIV、または SPAN を作成します。ASP.NET MVC の実装の場合、含める要素を MVC ラッパーが作成してくれるので、この手順はオプションです。

    **HTML の場合:**

    ```
    <input id="dateEditor" type="text" />
    ```

4. 上のセットアップが完了したら、日付エディターを初期化し、`width`、`nullText`、`mask` などの必要なオプションを設定します。

    > **注:** ASP.NET MVC View では、その他のオプションをすべて設定した後で `Render` メソッドを呼び出す必要があります。

    **JavaScript の場合:**

    ```
    <script type="text/javascript">
          $('#dateEditor').igDateEditor({
              button: 'spin',
              minValue: new Date(1900, 0, 1),
              maxValue: new Date(2200, 11, 31),
              width: 195,
              nullText: 'Enter date'
          });
    </script>
    ```

    **ASPX の場合:**

     ```
     <%= Html.Infragistics().DateTimeEditor()
                  .ID("dateEditor")
                  .ButtonType(TextEditorButtonType.Spin)
                  .MinValue(new DateTime(1900, 1, 1))
                  .MaxValue(new DateTime(2200, 12, 31))
                  .NullText("Enter date")
                  .Render()%>
     ```

    **Razor の場合:**

    ```
    @(Html.Infragistics().DateTimeEditor()
                 .ID("dateEditor")
                 .ButtonType(TextEditorButtonType.Spin)
                 .MinValue(new DateTime(1900, 1, 1))
                 .MaxValue(new DateTime(2200, 12, 31))
                 .NullText("Enter date")
                 .Render())
    ```

5.  Web ページを実行し、`igDateEditor` コントロールの基本セットアップを表示します。

## 関連リンク

-   [日付と時刻書式設定](%%SamplesUrl%%/editors/date-and-time-formats) 
-   [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)
-   [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 



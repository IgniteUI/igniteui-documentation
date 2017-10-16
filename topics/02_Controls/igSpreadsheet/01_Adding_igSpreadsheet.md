<!--
|metadata|
{
    "fileName": "adding-igspreadsheet",
    "controlName": "igSpreadsheet",
    "tags": []
}
|metadata|
-->

# igSpreadsheet の追加

## トピックの概要 
### 目的

`igSpreadsheet`™ は、最新のあらゆるブラウザーで Excel ドキュメントを視覚化する jQuery ウィジェットです。このトピックは、このコントロールをプロジェクトに追加する手順を提供します。

### 前提条件

このトピックを理解するために [Infragistics JavaScript Excel Library](javascript-excel-library.html) の概念とトピックは前提条件です。

## JavaScript Resources

始まる前に、すべての必要なリソースを読み込みます。最初に jQuery リソースを読み込み、次に必要な Ignite UI リソースを読み込みます。Ignite UI リソースをプロジェクトに追加する方法が 3 つあります。
- use the `igLoader` (below)
- load the required modules [separately](#separate-files)
- use the [bundled files](#bundled) that combine all the required resources

```js
$.ig.loader({
    scriptPath: "../../igniteui/js/",
    cssPath: "../../igniteui/css/",
    resources: "igSpreadsheet"
});
```
> **注:** ファイルを読み込む代わりに新しい Excel ファイルを作成する場合に `igSpreadsheet` のみを読み込む必要があります。しかし、.xlsx ファイルを読み込むには、`igExcel.LoadSaveXlsx` リソースも読み込む必要があります。
次のトピックは、`igLoader` についての使用方法を説明します。 

[Infragistics Loader による必要なリソースを自動で追加する](using-infragistics-loader.html)

### <a id="separate-files"></a>Load modules separately

```html
<!-- util -->
<script src="js/modules/infragistics.util.js"></script>
<script src="js/modules/infragistics.util.jquery.js"></script>

<!-- ext -->
<script src="js/modules/infragistics.ext_core.js"></script>
<script src="js/modules/infragistics.ext_text.js"></script>
<script src="js/modules/infragistics.ext_collections.js"></script>
<script src="js/modules/infragistics.ext_io.js"></script>
<script src="js/modules/infragistics.ext_ui.js"></script>
<script src="js/modules/infragistics.dv_jquerydom.js" ></script>
<script src="js/modules/infragistics.ext_collectionsExtended.js"></script>
<script src="js/modules/infragistics.ext_threading.js"></script>
<script src="js/modules/infragistics.ext_web.js"></script>

<!-- xml -->
<script src="js/modules/infragistics.xml.js"></script>

<!-- documents.core -->
<script src="js/modules/infragistics.documents.core_core-en.js"></script>
<script src="js/modules/infragistics.documents.core_core.js"></script>
<script src="js/modules/infragistics.documents.core_openxml.js"></script>

<!-- excel -->
<script src="js/modules/infragistics.excel_core-en.js"></script>
<script src="js/modules/infragistics.excel_core.js"></script>
<script src="js/modules/infragistics.excel_functions.js"></script>
<script src="js/modules/infragistics.excel_serialization_biff8.js"></script>
<script src="js/modules/infragistics.excel_serialization_openxml.js"></script>

<!-- undo -->
<script src="js/modules/infragistics.undo.js"></script>

<!-- dv -->
<script src="js/modules/infragistics.dv_core.js"></script>
<script src="js/modules/infragistics.dv_jquerydom.js"></script>

<!-- combo -->
<script src="js/modules/infragistics.util.jquery.js"></script>
<script src="js/modules/infragistics.datasource.js"></script>
<script src="js/modules/infragistics.templating.js"></script>
<script src="js/modules/infragistics.ui.scroll.js"></script>
<script src="js/modules/infragistics.ui.validator.js"></script>
<script src="js/modules/infragistics.ui.combo.js"></script>

<!-- spreadsheet -->
<script src="js/modules/infragistics.spreadsheet.js"></script>
<script src="js/modules/infragistics.ui.spreadsheet.js"></script>
```

### <a id="bundled"></a> Load bundled files

```html
<script src="js/infragistics.core.js"></script>
<script src="js/infragistics.lob.js"></script>
<script src="js/infragistics.excel-bundled.js"></script>
<script src="js/infragistics.spreadsheet-bundled.js"></script>
```

## Creating a basic igSpreadsheet implementation on client-side


リソースを読み込んだ後、コントロールを初期化します。以下のコードは、空のスプレッドシートを読み込む基本ウィジェットを作成する方法を紹介します。 

```js
$("#spreadsheet").igSpreadsheet({
    height: "600",
    width: "100%"
});
```

注: 空の `igSpreadsheet` を初期化する場合、初期化コードですべての利用可能なオプションを使用できます。`igSpreadsheet` で開いて表示される外部のファイルを読み込む場合、[`areGridlinesVisible`](%%jQueryApiUrl%%/ui.igspreadsheet#options:areGridlinesVisible)、[`zoomLevel`](%%jQueryApiUrl%%/ui.igspreadsheet#options:zoomLevel) などの初期設定が適用されません。読み込んだファイルの視覚的な外観はファイルの視覚的な外観と同じなります。外部のファイルの読み込みがコントロールの最初描画の後に実行されます。つまり、外部のファイルにオプションを適用するには、ファイルを読み込んだ後 (ランタイム) にオプションを呼び出します。

```js
$("#spreadsheet").igSpreadsheet({
    height: "600",
    width: "100%"
});

var workbook = null;
var xhr = new XMLHttpRequest();
xhr.open('GET', '../../data-files/FormattingData.xlsx', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function (e) {
    // response is unsigned 8 bit integer
    var responseArray = new Uint8Array(this.response);
    $.ig.excel.Workbook.load(responseArray, function () {
        workbook = arguments[0];
        //as the workbook is loaded you can call the options that you want to apply to the excel file here
        $("#spreadsheet").igSpreadsheet("option", "workbook", workbook);
    }, function () {
        console.log("fail");
    })
};

xhr.send();
```

## Creating a basic igSpreadsheet implementation using ASP.NET MVC/Core helpers

If you want to define the control on server-side then you can use the MVC wrapper. The code below will achieve the same result as when the control is defined on the client-side.

In MVC:

```
@(Html.Infragistics()
    .Spreadsheet()
    .Height("600")
    .Width("100%")
    .WorkbookURL("../../data-files/FormattingData.xlsx")
)
```

> **Note:** When using the 'WorkbookURL' option, the Spreadsheet MVC helper automatically generates the required client-side code, that is needed to request an excel file and load it in the spreadsheet.

## 関連リンク
 -   [igSpreadsheet の概要](igSpreadsheet-Overview.html)
 -   [igSpreadsheet のアクティベーションとナビゲーションのインタラクション](igSpreadsheet-Activation-and-Navigation-Interactions.html)
 -   [igSpreadsheet のビジュアル要素](igSpreadsheet-Visual-Elements.html)
 -   [igSpreadsheet の機能の概要](igSpreadsheet-Feature-Overview.html)
 -   [igSpreadsheet の選択](igSpreadsheet-Selection.html)

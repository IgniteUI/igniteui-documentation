<!--
|metadata|
{
    "fileName": "javascript-excel-library-adding-a-hyperlink-to-a-cell-in-an-excel-file",
    "controlName": ["igExcel"],
    "tags": ["How Do I"]
}
|metadata|
-->

# Excel ファイルのセルへのハイパーリンクの追加

このトピックは、[`WorksheetCell`](%%jQueryApiUrl%%/ig.excel.WorksheetCell) オブジェクトの [applyFormula](%%jQueryApiUrl%%/ig.excel.WorksheetCell#methods:applyFormula) 関数を使用して、Microsoft® Excel™ ファイルのセルにハイパーリンクを追加する方法を示します。以下のコードは、Microsoft Excel の数式 `HYPERLINK` を使用してワークシートのセル 0 にハイパーリンクのある Excel ファイルを作成します。

**JavaScript の場合:**

```js
// Create a Workbook
var w = new $.ig.excel.Workbook();

// Add a new worksheet to the Workbook
var ws = w.worksheets().add("New");

// Create Hyperlink in a Worksheet cell
ws.rows(0).cells(0).applyFormula("=HYPERLINK(\"http://www.infragistics.com\",\"Infragistics\")");
```
